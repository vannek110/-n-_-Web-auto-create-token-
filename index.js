import { 
  Connection, 
  Keypair, 
  clusterApiUrl, 
  PublicKey,
  LAMPORTS_PER_SOL
} from '@solana/web3.js';
import { 
  createMint, 
  getOrCreateAssociatedTokenAccount,
  mintTo,
  getAccount,
  createAssociatedTokenAccount
} from '@solana/spl-token';

class SolanaTokenCreator {
  constructor(network = 'devnet') {
    this.connection = new Connection(clusterApiUrl(network), 'confirmed');
    this.network = network;
  }

  // Request airdrop SOL
  async requestAirdrop(publicKey, amount = 1) {
    try {
      console.log(`💰 Requesting ${amount} SOL airdrop to ${publicKey.toString()}...`);
      
      const airdropSignature = await this.connection.requestAirdrop(
        publicKey,
        amount * LAMPORTS_PER_SOL
      );
      
      const latestBlockhash = await this.connection.getLatestBlockhash();
      const confirmation = await this.connection.confirmTransaction({
        signature: airdropSignature,
        blockhash: latestBlockhash.blockhash,
        lastValidBlockHeight: latestBlockhash.lastValidBlockHeight
      }, 'confirmed');
      
      console.log('✅ Airdrop successful!');
      return confirmation;
    } catch (error) {
      console.error('❌ Airdrop failed:', error);
      throw error;
    }
  }

  // Tạo token mới
  async createToken(
    decimals = 9,
    mintAuthority = null,
    freezeAuthority = null
  ) {
    try {
      // Tạo keypairs
      const mintKeypair = mintAuthority || Keypair.generate();
      const payerKeypair = Keypair.generate();

      console.log('🚀 Starting token creation...');
      console.log('👑 Mint Authority:', mintKeypair.publicKey.toString());
      console.log('💳 Payer:', payerKeypair.publicKey.toString());

      // Airdrop SOL cho payer
      await this.requestAirdrop(payerKeypair.publicKey, 1.5); // Tăng lên 1.5 SOL

      // Tạo mint account
      console.log('🔄 Creating mint account...');
      const mint = await createMint(
        this.connection,
        payerKeypair,
        mintKeypair.publicKey,
        freezeAuthority ? freezeAuthority.publicKey : mintKeypair.publicKey,
        decimals
      );

      console.log('✅ Token created successfully!');
      console.log('🔑 Mint Address:', mint.toString());
      console.log('🔢 Decimals:', decimals);
      console.log('🌐 Network:', this.network);

      return {
        mint,
        mintKeypair,
        payerKeypair,
        decimals
      };

    } catch (error) {
      console.error('💥 Error creating token:', error);
      throw error;
    }
  }

  // Tạo token account và mint token
  async mintToAddress(
    mint,
    mintKeypair,
    recipientAddress,
    amount = 1000
  ) {
    try {
      console.log(`🎯 Preparing to mint ${amount} tokens to ${recipientAddress.toString()}...`);

      // Kiểm tra xem recipient có đủ SOL không, nếu không thì airdrop
      const recipientBalance = await this.connection.getBalance(recipientAddress);
      console.log(`💰 Recipient balance: ${recipientBalance / LAMPORTS_PER_SOL} SOL`);

      if (recipientBalance < 0.01 * LAMPORTS_PER_SOL) {
        console.log('⚠️  Recipient has low SOL, requesting airdrop...');
        await this.requestAirdrop(recipientAddress, 0.5);
      }

      // Tạo associated token account
      console.log('📦 Creating token account...');
      const tokenAccount = await getOrCreateAssociatedTokenAccount(
        this.connection,
        mintKeypair, // Payer (sử dụng mintKeypair vì nó có SOL)
        mint,
        recipientAddress
      );

      console.log('✅ Token account created:', tokenAccount.address.toString());

      // Mint tokens
      const mintAmount = BigInt(amount * Math.pow(10, 6)); // Sử dụng BigInt và đúng decimals
      console.log(`🪙 Minting ${amount} tokens (${mintAmount} raw units)...`);

      const signature = await mintTo(
        this.connection,
        mintKeypair,
        mint,
        tokenAccount.address,
        mintKeypair, // Mint authority
        mintAmount
      );

      console.log('✅ Tokens minted successfully!');
      console.log('📝 Transaction Signature:', signature);

      // Kiểm tra số dư
      await new Promise(resolve => setTimeout(resolve, 2000)); // Đợi 2 giây
      const accountInfo = await getAccount(this.connection, tokenAccount.address);
      const balance = Number(accountInfo.amount) / Math.pow(10, 6);

      console.log(`💰 Final Balance: ${balance} tokens`);

      return {
        tokenAccount: tokenAccount.address,
        signature,
        balance
      };

    } catch (error) {
      console.error('💥 Error minting tokens:', error);
      
      // Xử lý lỗi cụ thể
      if (error.message.includes('TokenAccountNotFoundError')) {
        console.log('🔧 Fix: Creating token account manually...');
        return await this.createTokenAccountAndMint(mint, mintKeypair, recipientAddress, amount);
      }
      throw error;
    }
  }

  // Phương thức dự phòng để tạo token account
  async createTokenAccountAndMint(mint, mintKeypair, recipientAddress, amount) {
    try {
      console.log('🔧 Creating token account manually...');
      
      // Tạo associated token account
      const tokenAccount = await createAssociatedTokenAccount(
        this.connection,
        mintKeypair,
        mint,
        recipientAddress
      );

      console.log('✅ Token account created:', tokenAccount.toString());

      // Mint tokens
      const mintAmount = BigInt(amount * Math.pow(10, 6));
      const signature = await mintTo(
        this.connection,
        mintKeypair,
        mint,
        tokenAccount,
        mintKeypair,
        mintAmount
      );

      console.log('✅ Tokens minted successfully!');
      console.log('📝 Transaction Signature:', signature);

      // Kiểm tra số dư
      await new Promise(resolve => setTimeout(resolve, 2000));
      const accountInfo = await getAccount(this.connection, tokenAccount);
      const balance = Number(accountInfo.amount) / Math.pow(10, 6);

      console.log(`💰 Final Balance: ${balance} tokens`);

      return {
        tokenAccount,
        signature,
        balance
      };

    } catch (error) {
      console.error('💥 Error in manual token account creation:', error);
      throw error;
    }
  }

  // Tạo token hoàn chỉnh với recipient có SOL
  async createCompleteToken(
    tokenAmount = 1000,
    decimals = 6
  ) {
    try {
      // Tạo recipient và đảm bảo có SOL
      const recipient = Keypair.generate();
      console.log('🎯 Recipient Address:', recipient.publicKey.toString());
      
      // Airdrop SOL cho recipient trước
      await this.requestAirdrop(recipient.publicKey, 0.5);

      // Bước 1: Tạo token
      const tokenData = await this.createToken(decimals);

      // Bước 2: Mint tokens
      const mintData = await this.mintToAddress(
        tokenData.mint,
        tokenData.mintKeypair,
        recipient.publicKey,
        tokenAmount
      );

      return {
        ...tokenData,
        ...mintData,
        recipient: recipient.publicKey,
        recipientKeypair: recipient // Lưu keypair nếu cần
      };

    } catch (error) {
      console.error('💥 Complete token creation failed:', error);
      throw error;
    }
  }

  // Phiên bản đơn giản hơn - chỉ tạo token, không mint ngay
  async createTokenOnly(decimals = 6) {
    try {
      console.log('🚀 Creating token only (no initial mint)...');
      
      const tokenData = await this.createToken(decimals);
      
      console.log('\n🎊 TOKEN CREATED SUCCESSFULLY!');
      console.log('=' .repeat(50));
      console.log('🔑 Mint Address:', tokenData.mint.toString());
      console.log('👑 Mint Authority:', tokenData.mintKeypair.publicKey.toString());
      console.log('💳 Payer:', tokenData.payerKeypair.publicKey.toString());
      console.log('🔢 Decimals:', decimals);
      console.log('🌐 Network: devnet');
      console.log('=' .repeat(50));
      
      // Lưu thông tin quan trọng
      console.log('\n💾 IMPORTANT: Save these keys securely!');
      console.log('Mint Private Key (base64):', Buffer.from(tokenData.mintKeypair.secretKey).toString('base64'));
      
      return tokenData;
      
    } catch (error) {
      console.error('💥 Failed to create token:', error);
      throw error;
    }
  }
}

// Hàm main để chạy chương trình
async function main() {
  console.log('🌈 Solana Token Creator - Starting...\n');

  const tokenCreator = new SolanaTokenCreator('devnet');

  try {
    // Lựa chọn 1: Tạo token hoàn chỉnh (token + mint)
    console.log('🔧 Using complete token creation...');
    const result = await tokenCreator.createCompleteToken(
      500,  // số lượng token
      6     // số decimal
    );

    console.log('\n🎊 TOKEN CREATION COMPLETED!');
    console.log('=' .repeat(50));
    console.log('🔑 Mint Address:', result.mint.toString());
    console.log('👑 Mint Authority:', result.mintKeypair.publicKey.toString());
    console.log('🎯 Recipient:', result.recipient.toString());
    console.log('📦 Token Account:', result.tokenAccount.toString());
    console.log('💰 Final Balance:', result.balance, 'tokens');
    console.log('📝 Tx Signature:', result.signature);
    console.log('🌐 Network: devnet');
    console.log('=' .repeat(50));

  } catch (error) {
    console.error('\n💥 Complete creation failed, trying token-only creation...');
    
    // Lựa chọn 2: Chỉ tạo token, không mint ngay
    try {
      await tokenCreator.createTokenOnly(6);
    } catch (error2) {
      console.error('💥 Both methods failed:', error2);
    }
  }
}

// Chạy chương trình
main();