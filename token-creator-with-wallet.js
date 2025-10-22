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
  createAssociatedTokenAccount,
  getMint
} from '@solana/spl-token';

class TokenCreatorWithWallet {
  constructor(network = 'devnet', payerKeypair) {
    this.connection = new Connection(clusterApiUrl(network), 'confirmed');
    this.network = network;
    this.payer = payerKeypair;
  }

  // Kiểm tra số dư
  async checkBalance(publicKey) {
    const balance = await this.connection.getBalance(publicKey);
    return balance / LAMPORTS_PER_SOL;
  }

  // Tạo token mới
  async createToken(decimals = 6) {
    try {
      // Tạo keypair cho mint
      const mintKeypair = Keypair.generate();

      console.log('🚀 Starting token creation...');
      console.log('👑 Mint Authority:', mintKeypair.publicKey.toString());
      console.log('💳 Payer:', this.payer.publicKey.toString());

      // Kiểm tra số dư
      const balance = await this.checkBalance(this.payer.publicKey);
      console.log(`💰 Payer balance: ${balance} SOL`);

      if (balance < 0.1) {
        throw new Error(`Insufficient SOL balance: ${balance}. Need at least 0.1 SOL`);
      }

      // Tạo mint account
      console.log('🔄 Creating mint account...');
      const mint = await createMint(
        this.connection,
        this.payer,
        mintKeypair.publicKey, // Mint Authority
        mintKeypair.publicKey, // Freeze Authority
        decimals
      );

      console.log('✅ Token created successfully!');
      console.log('🔑 Mint Address:', mint.toString());
      console.log('🔢 Decimals:', decimals);

      return {
        mint,
        mintKeypair,
        decimals
      };

    } catch (error) {
      console.error('💥 Error creating token:', error);
      throw error;
    }
  }

  // Mint token đến địa chỉ
  async mintToAddress(mint, mintKeypair, recipientAddress, amount = 1000) {
    try {
      console.log(`🎯 Minting ${amount} tokens to ${recipientAddress.toString()}...`);

      // Kiểm tra số dư payer
      const balance = await this.checkBalance(this.payer.publicKey);
      console.log(`💰 Payer balance: ${balance} SOL`);

      if (balance < 0.05) {
        throw new Error('Insufficient SOL for transaction');
      }

      // Tạo hoặc lấy token account
      const tokenAccount = await getOrCreateAssociatedTokenAccount(
        this.connection,
        this.payer, // Payer (sử dụng payer chính)
        mint,
        recipientAddress
      );

      console.log('✅ Token account:', tokenAccount.address.toString());

      // Mint tokens
      const mintAmount = BigInt(amount * Math.pow(10, 6));
      console.log(`🪙 Minting ${amount} tokens (${mintAmount} raw units)...`);

      const signature = await mintTo(
        this.connection,
        this.payer,
        mint,
        tokenAccount.address,
        mintKeypair,
        mintAmount
      );

      console.log('✅ Tokens minted successfully!');
      console.log('📝 Transaction Signature:', signature);

      // Kiểm tra số dư token
      await new Promise(resolve => setTimeout(resolve, 2000));
      const accountInfo = await getAccount(this.connection, tokenAccount.address);
      const tokenBalance = Number(accountInfo.amount) / Math.pow(10, 6);

      console.log(`💰 Token Balance: ${tokenBalance} tokens`);

      return {
        tokenAccount: tokenAccount.address,
        signature,
        balance: tokenBalance
      };

    } catch (error) {
      console.error('💥 Error minting tokens:', error);
      throw error;
    }
  }

  // Tạo token hoàn chỉnh
  async createCompleteToken(recipientAddress, tokenAmount = 1000, decimals = 6) {
    try {
      console.log('🎯 Recipient Address:', recipientAddress.toString());

      // Bước 1: Tạo token
      const tokenData = await this.createToken(decimals);

      // Bước 2: Mint tokens
      const mintData = await this.mintToAddress(
        tokenData.mint,
        tokenData.mintKeypair,
        recipientAddress,
        tokenAmount
      );

      return {
        ...tokenData,
        ...mintData,
        recipient: recipientAddress
      };

    } catch (error) {
      console.error('💥 Complete token creation failed:', error);
      throw error;
    }
  }

  // Lấy thông tin token
  async getTokenInfo(mintAddress) {
    try {
      const mintInfo = await getMint(this.connection, new PublicKey(mintAddress));
      return {
        address: mintAddress,
        decimals: mintInfo.decimals,
        supply: Number(mintInfo.supply) / Math.pow(10, mintInfo.decimals),
        mintAuthority: mintInfo.mintAuthority,
        freezeAuthority: mintInfo.freezeAuthority
      };
    } catch (error) {
      console.error('Error getting token info:', error);
      throw error;
    }
  }
}

// Hàm tạo từ secret key
function createWalletFromSecretKey(secretKeyBase64) {
  const secretKey = Uint8Array.from(Buffer.from(secretKeyBase64, 'base64'));
  return Keypair.fromSecretKey(secretKey);
}

// Hàm main
async function main() {
  console.log('🌈 Solana Token Creator With Existing Wallet\n');

  // CÁCH 1: Sử dụng ví có sẵn (thay thế bằng secret key của bạn)
  const existingWalletSecretKey = process.env.SOLANA_SECRET_KEY;
  
  if (!existingWalletSecretKey) {
    console.log('❌ No existing wallet found. Please use one of these options:\n');
    
    // CÁCH 2: Tạo ví mới và yêu cầu funding
    const newWallet = Keypair.generate();
    console.log('🆕 New Wallet Created:');
    console.log('Public Key:', newWallet.publicKey.toString());
    console.log('Secret Key (base64):', Buffer.from(newWallet.secretKey).toString('base64'));
    console.log('\n💧 Please fund this wallet with test SOL from:');
    console.log('   https://faucet.solana.com');
    console.log('   https://solfaucet.com');
    console.log('\n💰 Then run this script again with the funded wallet.');
    return;
  }

  try {
    // Sử dụng ví có SOL
    const wallet = createWalletFromSecretKey(existingWalletSecretKey);
    const tokenCreator = new TokenCreatorWithWallet('devnet', wallet);

    console.log('👛 Using wallet:', wallet.publicKey.toString());
    
    // Kiểm tra số dư
    const balance = await tokenCreator.checkBalance(wallet.publicKey);
    console.log(`💰 Wallet balance: ${balance} SOL\n`);

    if (balance < 0.1) {
      console.log('❌ Insufficient SOL balance.');
      console.log('💧 Please fund your wallet with test SOL from faucet.');
      return;
    }

    // Tạo recipient (có thể là chính ví của bạn hoặc ví khác)
    const recipient = wallet.publicKey; // Mint cho chính mình

    // Tạo token
    const result = await tokenCreator.createCompleteToken(recipient, 1000, 6);

    console.log('\n🎊 TOKEN CREATION COMPLETED!');
    console.log('='.repeat(50));
    console.log('🔑 Mint Address:', result.mint.toString());
    console.log('👑 Mint Authority:', result.mintKeypair.publicKey.toString());
    console.log('🎯 Recipient:', result.recipient.toString());
    console.log('📦 Token Account:', result.tokenAccount.toString());
    console.log('💰 Token Balance:', result.balance, 'tokens');
    console.log('📝 Tx Signature:', result.signature);
    console.log('='.repeat(50));

    // Lưu thông tin quan trọng
    console.log('\n💾 IMPORTANT: Save these keys!');
    console.log('Mint Private Key:', Buffer.from(result.mintKeypair.secretKey).toString('base64'));

  } catch (error) {
    console.error('💥 Program failed:', error.message);
  }
}

// Chạy chương trình
main();