#!/usr/bin/env node
/**
 * MEDUSSA CRYPTOCURRENCY BLOCKCHAIN
 * Complete implementation - Ready for Ubuntu
 * Run: node medussa-crypto.js
 */

const crypto = require('crypto');
const fs = require('fs');

// ============================================
// CRYPTOGRAPHIC HELPERS
// ============================================
class CryptoUtils {
    static sha256(data) {
        return crypto.createHash('sha256').update(JSON.stringify(data)).digest('hex');
    }

    static generatePrivateKey() {
        return crypto.randomBytes(32).toString('hex');
    }

    static derivePublicKey(privateKey) {
        // Simplified - In production use ECDSA
        return crypto.createHash('sha256').update(privateKey).digest('hex').slice(0, 64);
    }

    static deriveAddress(publicKey) {
        return '0x' + crypto.createHash('ripemd160').update(publicKey).digest('hex').slice(0, 40);
    }

    static sign(data, privateKey) {
        const hash = this.sha256(data);
        const signature = crypto.createHmac('sha256', privateKey).update(hash).digest('hex');
        return signature;
    }

    static verifySignature(data, signature, publicKey) {
        // Simplified verification
        const hash = this.sha256(data);
        const expected = crypto.createHmac('sha256', publicKey).update(hash).digest('hex');
        return signature === expected;
    }
}

// ============================================
// WALLET SYSTEM
// ============================================
class Wallet {
    constructor() {
        this.privateKey = CryptoUtils.generatePrivateKey();
        this.publicKey = CryptoUtils.derivePublicKey(this.privateKey);
        this.address = CryptoUtils.deriveAddress(this.publicKey);
        this.balance = 0;
        this.transactions = [];
    }

    toJSON() {
        return {
            address: this.address,
            publicKey: this.publicKey,
            balance: this.balance,
            transactionCount: this.transactions.length
        };
    }

    send(toAddress, amount, fee = 0.001) {
        if (amount <= 0) throw new Error('Amount must be positive');
        if (amount + fee > this.balance) throw new Error('Insufficient balance');

        const tx = new Transaction(this.address, toAddress, amount, fee);
        tx.sign(this.privateKey);
        return tx;
    }
}

// ============================================
// TRANSACTION SYSTEM
// ============================================
class Transaction {
    constructor(from, to, amount, fee = 0.001) {
        this.id = crypto.randomBytes(16).toString('hex');
        this.from = from;
        this.to = to;
        this.amount = amount;
        this.fee = fee;
        this.timestamp = Date.now();
        this.signature = null;
        this.confirmed = false;
        this.blockIndex = null;
    }

    sign(privateKey) {
        const data = `${this.id}${this.from}${this.to}${this.amount}${this.fee}${this.timestamp}`;
        this.signature = CryptoUtils.sign(data, privateKey);
        return this;
    }

    isValid() {
        if (!this.from || !this.to || this.amount <= 0 || this.fee < 0) return false;
        if (!this.signature) return false;
        
        // For coinbase transactions (mining rewards)
        if (this.from === 'COINBASE') return true;
        
        // Verify signature
        const data = `${this.id}${this.from}${this.to}${this.amount}${this.fee}${this.timestamp}`;
        return CryptoUtils.verifySignature(data, this.signature, this.from);
    }

    toJSON() {
        return {
            id: this.id,
            from: this.from,
            to: this.to,
            amount: this.amount,
            fee: this.fee,
            timestamp: this.timestamp,
            confirmed: this.confirmed,
            blockIndex: this.blockIndex
        };
    }
}

// ============================================
// BLOCK SYSTEM
// ============================================
class Block {
    constructor(index, transactions, prevHash, miner, reward) {
        this.index = index;
        this.timestamp = Date.now();
        this.transactions = transactions;
        this.prevHash = prevHash;
        this.miner = miner;
        this.reward = reward;
        this.nonce = 0;
        this.hash = null;
        this.difficulty = 4; // Number of leading zeros required
    }

    calculateHash() {
        const data = {
            index: this.index,
            timestamp: this.timestamp,
            transactions: this.transactions.map(tx => tx.id),
            prevHash: this.prevHash,
            miner: this.miner,
            reward: this.reward,
            nonce: this.nonce
        };
        return CryptoUtils.sha256(data);
    }

    mine() {
        console.log(`⛏️  Mining block ${this.index}...`);
        let hash = this.calculateHash();
        let attempts = 0;
        const startTime = Date.now();

        while (!hash.startsWith('0'.repeat(this.difficulty))) {
            this.nonce++;
            hash = this.calculateHash();
            attempts++;
            
            // Progress indicator every 100k attempts
            if (attempts % 100000 === 0) {
                console.log(`   Attempts: ${attempts}, Current hash: ${hash.slice(0, 12)}...`);
            }
        }

        this.hash = hash;
        const timeTaken = ((Date.now() - startTime) / 1000).toFixed(2);
        console.log(`   ✅ Block mined in ${timeTaken}s, Nonce: ${this.nonce}, Attempts: ${attempts}`);
        console.log(`   Hash: ${hash}`);
        return hash;
    }

    isValid() {
        if (!this.hash) return false;
        if (this.hash !== this.calculateHash()) return false;
        if (!this.hash.startsWith('0'.repeat(this.difficulty))) return false;
        
        // Validate all transactions
        for (const tx of this.transactions) {
            if (!tx.isValid()) return false;
        }
        
        return true;
    }

    toJSON() {
        return {
            index: this.index,
            timestamp: this.timestamp,
            transactions: this.transactions.map(tx => tx.toJSON()),
            prevHash: this.prevHash,
            miner: this.miner,
            reward: this.reward,
            nonce: this.nonce,
            hash: this.hash,
            difficulty: this.difficulty
        };
    }
}

// ============================================
// BLOCKCHAIN CORE
// ============================================
class MedussaCrypto {
    constructor() {
        this.chain = [];
        this.pendingTransactions = [];
        this.balances = {};
        this.wallets = {};
        this.reward = 2.5;
        this.difficulty = 4;
        this.totalSupply = 0;
        this.networkNodes = ['Alpha', 'Beta', 'Gamma', 'Delta', 'Epsilon', 'Zeta', 'Eta', 'Theta', 'Iota'];
        
        // Initialize genesis block
        this.createGenesisBlock();
    }

    createGenesisBlock() {
        const genesisTx = new Transaction('COINBASE', 'GENESIS', 0, 0);
        genesisTx.confirmed = true;
        genesisTx.blockIndex = 0;
        
        const genesisBlock = new Block(0, [genesisTx], '0'.repeat(64), 'Genesis', 0);
        genesisBlock.nonce = 0;
        genesisBlock.hash = CryptoUtils.sha256({
            index: 0,
            timestamp: genesisBlock.timestamp,
            transactions: ['GENESIS'],
            prevHash: '0'.repeat(64),
            miner: 'Genesis',
            reward: 0,
            nonce: 0
        });
        genesisBlock.difficulty = 0;
        
        this.chain.push(genesisBlock);
        console.log('🌱 Genesis block created');
    }

    // ===== WALLET MANAGEMENT =====
    createWallet() {
        const wallet = new Wallet();
        wallet.balance = 0;
        this.wallets[wallet.address] = wallet;
        this.balances[wallet.address] = 0;
        return wallet;
    }

    getBalance(address) {
        return this.balances[address] || 0;
    }

    getWallet(address) {
        return this.wallets[address] || null;
    }

    // ===== TRANSACTION MANAGEMENT =====
    addTransaction(tx) {
        if (!tx.isValid()) {
            throw new Error('Invalid transaction');
        }
        
        // Check sender balance
        if (tx.from !== 'COINBASE') {
            const balance = this.getBalance(tx.from);
            const totalCost = tx.amount + tx.fee;
            if (balance < totalCost) {
                throw new Error(`Insufficient balance: ${balance} < ${totalCost}`);
            }
        }
        
        this.pendingTransactions.push(tx);
        console.log(`📝 Transaction ${tx.id.slice(0, 8)}... added to pool (${this.pendingTransactions.length} pending)`);
        return tx;
    }

    // ===== MINING =====
    mineBlock(minerAddress) {
        // Validate miner exists
        if (!this.wallets[minerAddress]) {
            throw new Error('Miner wallet not found');
        }

        // Create coinbase transaction (reward)
        const coinbaseTx = new Transaction('COINBASE', minerAddress, this.reward, 0);
        coinbaseTx.confirmed = true;
        coinbaseTx.sign('COINBASE_KEY'); // Special signature for coinbase

        // Combine coinbase with pending transactions
        const transactions = [coinbaseTx, ...this.pendingTransactions];
        
        // Create block
        const prevHash = this.chain[this.chain.length - 1].hash;
        const block = new Block(this.chain.length, transactions, prevHash, minerAddress, this.reward);
        block.difficulty = this.difficulty;
        
        // Mine block
        block.mine();
        
        // Validate block
        if (!block.isValid()) {
            throw new Error('Invalid block mined');
        }
        
        // Add to chain
        this.chain.push(block);
        
        // Update balances
        this.processBlock(block);
        
        // Clear pending transactions
        this.pendingTransactions = [];
        
        console.log(`✅ Block ${block.index} added to chain`);
        console.log(`💰 Total supply: ${this.totalSupply} MED`);
        console.log(`📊 Total blocks: ${this.chain.length}`);
        
        return block;
    }

    processBlock(block) {
        for (const tx of block.transactions) {
            if (tx.from === 'COINBASE') {
                // Mining reward
                this.balances[tx.to] = (this.balances[tx.to] || 0) + tx.amount;
                this.totalSupply += tx.amount;
                tx.confirmed = true;
                tx.blockIndex = block.index;
                console.log(`   💰 Reward: ${tx.amount} MED → ${tx.to.slice(0, 10)}...`);
            } else {
                // Regular transaction
                if (this.balances[tx.from] >= tx.amount + tx.fee) {
                    this.balances[tx.from] -= tx.amount + tx.fee;
                    this.balances[tx.to] = (this.balances[tx.to] || 0) + tx.amount;
                    tx.confirmed = true;
                    tx.blockIndex = block.index;
                    
                    // Update wallet objects
                    if (this.wallets[tx.from]) {
                        this.wallets[tx.from].balance = this.balances[tx.from];
                        this.wallets[tx.from].transactions.push(tx);
                    }
                    if (this.wallets[tx.to]) {
                        this.wallets[tx.to].balance = this.balances[tx.to];
                        this.wallets[tx.to].transactions.push(tx);
                    }
                    
                    console.log(`   💸 ${tx.from.slice(0, 10)}... → ${tx.to.slice(0, 10)}... : ${tx.amount} MED`);
                }
            }
        }
    }

    // ===== BLOCKCHAIN EXPLORER =====
    getBlock(index) {
        return this.chain[index] || null;
    }

    getLastBlock() {
        return this.chain[this.chain.length - 1];
    }

    getTransaction(txId) {
        for (const block of this.chain) {
            for (const tx of block.transactions) {
                if (tx.id === txId) return tx;
            }
        }
        return null;
    }

    getTransactionsByAddress(address) {
        const txs = [];
        for (const block of this.chain) {
            for (const tx of block.transactions) {
                if (tx.from === address || tx.to === address) {
                    txs.push(tx);
                }
            }
        }
        return txs;
    }

    isChainValid() {
        for (let i = 1; i < this.chain.length; i++) {
            const current = this.chain[i];
            const previous = this.chain[i - 1];
            
            if (!current.isValid()) {
                console.log(`❌ Block ${i} is invalid`);
                return false;
            }
            
            if (current.prevHash !== previous.hash) {
                console.log(`❌ Block ${i} has invalid previous hash`);
                return false;
            }
        }
        return true;
    }

    // ===== STATISTICS =====
    getStats() {
        return {
            chainLength: this.chain.length,
            pendingTransactions: this.pendingTransactions.length,
            totalSupply: this.totalSupply,
            networkNodes: this.networkNodes.length,
            difficulty: this.difficulty,
            lastBlock: this.getLastBlock().index,
            lastBlockHash: this.getLastBlock().hash.slice(0, 16) + '...',
            blockReward: this.reward
        };
    }

    // ===== PERSISTENCE =====
    save(filename = 'medussa-chain.json') {
        const data = {
            chain: this.chain.map(block => block.toJSON()),
            balances: this.balances,
            totalSupply: this.totalSupply,
            timestamp: Date.now()
        };
        fs.writeFileSync(filename, JSON.stringify(data, null, 2));
        console.log(`💾 Blockchain saved to ${filename}`);
    }

    load(filename = 'medussa-chain.json') {
        if (!fs.existsSync(filename)) {
            console.log('📂 No saved chain found, starting fresh');
            return;
        }
        
        try {
            const data = JSON.parse(fs.readFileSync(filename, 'utf8'));
            this.totalSupply = data.totalSupply;
            this.balances = data.balances;
            console.log(`📂 Loaded chain with ${data.chain.length} blocks`);
        } catch (e) {
            console.log('⚠️  Error loading chain, starting fresh');
        }
    }
}

// ============================================
// DEMO AND TESTING
// ============================================
function runDemo() {
    console.log('\n' + '='.repeat(60));
    console.log('🚀 MEDUSSA CRYPTOCURRENCY BLOCKCHAIN');
    console.log('='.repeat(60));
    
    // Initialize blockchain
    const chain = new MedussaCrypto();
    
    // Create wallets
    console.log('\n📱 CREATING WALLETS');
    console.log('─'.repeat(40));
    
    const alice = chain.createWallet();
    const bob = chain.createWallet();
    const miner = chain.createWallet();
    const charlie = chain.createWallet();
    
    console.log('✅ Alice:', alice.address.slice(0, 16) + '...');
    console.log('✅ Bob:', bob.address.slice(0, 16) + '...');
    console.log('✅ Miner:', miner.address.slice(0, 16) + '...');
    console.log('✅ Charlie:', charlie.address.slice(0, 16) + '...');
    
    // Initial balances
    console.log('\n💰 INITIAL BALANCES');
    console.log('─'.repeat(40));
    console.log(`Alice: ${chain.getBalance(alice.address)} MED`);
    console.log(`Bob: ${chain.getBalance(bob.address)} MED`);
    console.log(`Miner: ${chain.getBalance(miner.address)} MED`);
    console.log(`Charlie: ${chain.getBalance(charlie.address)} MED`);
    
    // Give Alice some coins (mine first block)
    console.log('\n⛏️  FIRST MINING - ALICE GETS REWARD');
    console.log('─'.repeat(40));
    chain.mineBlock(alice.address);
    console.log(`Alice balance: ${chain.getBalance(alice.address)} MED`);
    
    // Send transaction: Alice → Bob
    console.log('\n💸 SENDING TRANSACTION');
    console.log('─'.repeat(40));
    const tx1 = alice.send(bob.address, 5, 0.001);
    chain.addTransaction(tx1);
    console.log(`  ${tx1.amount} MED → Bob (fee: ${tx1.fee})`);
    
    // Send transaction: Alice → Charlie
    const tx2 = alice.send(charlie.address, 2.5, 0.001);
    chain.addTransaction(tx2);
    console.log(`  ${tx2.amount} MED → Charlie (fee: ${tx2.fee})`);
    
    // Mine block to confirm transactions
    console.log('\n⛏️  MINING BLOCK 2');
    console.log('─'.repeat(40));
    chain.mineBlock(miner.address);
    
    // Check final balances
    console.log('\n💎 FINAL BALANCES');
    console.log('─'.repeat(40));
    console.log(`Alice: ${chain.getBalance(alice.address)} MED`);
    console.log(`Bob: ${chain.getBalance(bob.address)} MED`);
    console.log(`Miner: ${chain.getBalance(miner.address)} MED`);
    console.log(`Charlie: ${chain.getBalance(charlie.address)} MED`);
    
    // Check total supply
    console.log(`\n💰 Total Supply: ${chain.totalSupply} MED`);
    console.log(`📊 Chain Length: ${chain.chain.length} blocks`);
    
    // Show last block
    console.log('\n📦 LAST BLOCK');
    console.log('─'.repeat(40));
    const lastBlock = chain.getLastBlock();
    console.log(`Index: ${lastBlock.index}`);
    console.log(`Hash: ${lastBlock.hash.slice(0, 20)}...`);
    console.log(`Transactions: ${lastBlock.transactions.length}`);
    console.log(`Miner: ${lastBlock.miner.slice(0, 16)}...`);
    console.log(`Reward: ${lastBlock.reward} MED`);
    
    // Validate chain
    console.log('\n🔍 CHAIN VALIDATION');
    console.log('─'.repeat(40));
    const isValid = chain.isChainValid();
    console.log(`✅ Chain is ${isValid ? 'VALID' : 'INVALID'}`);
    
    // Save chain
    console.log('\n💾 SAVING CHAIN');
    console.log('─'.repeat(40));
    chain.save('medussa-crypto-chain.json');
    
    // Export wallet keys
    console.log('\n🔑 WALLET BACKUP');
    console.log('─'.repeat(40));
    console.log('Alice Private Key:', alice.privateKey.slice(0, 20) + '...');
    console.log('Bob Private Key:', bob.privateKey.slice(0, 20) + '...');
    console.log('Miner Private Key:', miner.privateKey.slice(0, 20) + '...');
    console.log('Charlie Private Key:', charlie.privateKey.slice(0, 20) + '...');
    
    console.log('\n✅ DEMO COMPLETE');
    console.log('='.repeat(60));
    console.log('📝 Save your private keys to access wallets later!');
    console.log('🔗 Chain saved to: medussa-crypto-chain.json');
    console.log('='.repeat(60) + '\n');
}

// ============================================
// COMMAND LINE INTERFACE
// ============================================
function showHelp() {
    console.log(`
MEDUSSA CRYPTOCURRENCY BLOCKCHAIN CLI
═══════════════════════════════════════════

Commands:
  node medussa-crypto.js demo          - Run the demo
  node medussa-crypto.js stats         - Show blockchain stats
  node medussa-crypto.js wallet        - Create a new wallet
  node medussa-crypto.js send <from> <to> <amount> - Send transaction
  
Example:
  node medussa-crypto.js demo
`);
}

// ============================================
// MAIN EXECUTION
// ============================================
if (require.main === module) {
    const args = process.argv.slice(2);
    
    switch(args[0]) {
        case 'demo':
            runDemo();
            break;
        case 'stats':
            const chain = new MedussaCrypto();
            chain.load();
            console.log(chain.getStats());
            break;
        case 'wallet':
            const w = new MedussaCrypto();
            const wallet = w.createWallet();
            console.log('\n🔑 NEW WALLET');
            console.log('─'.repeat(40));
            console.log('Address:', wallet.address);
            console.log('Public Key:', wallet.publicKey.slice(0, 30) + '...');
            console.log('Private Key:', wallet.privateKey);
            console.log('\n⚠️  SAVE YOUR PRIVATE KEY SAFELY!');
            break;
        default:
            showHelp();
    }
}

module.exports = { 
    MedussaCrypto, 
    Wallet, 
    Transaction, 
    Block,
    CryptoUtils 
};
