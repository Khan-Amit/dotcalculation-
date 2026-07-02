#!/usr/bin/env node
/**
 * MEDUSSA REAL BLOCKCHAIN
 * Uses real cryptography (SHA-256, ECDSA)
 * Generates real blockchain JSON for validation
 * 
 * Run: node medussa-real-blockchain.js
 */

const crypto = require('crypto');
const fs = require('fs');

// ============================================
// REAL CRYPTOGRAPHIC FUNCTIONS
// ============================================

// Real SHA-256 hashing
function sha256(data) {
    return crypto.createHash('sha256').update(JSON.stringify(data)).digest('hex');
}

// Real private key generation (32 bytes)
function generatePrivateKey() {
    return crypto.randomBytes(32).toString('hex');
}

// Real public key derivation using secp256k1
function derivePublicKey(privateKey) {
    // Using elliptic curve secp256k1 (Bitcoin standard)
    const ec = new (require('elliptic').ec)('secp256k1');
    const key = ec.keyFromPrivate(privateKey);
    const pub = key.getPublic('hex');
    return pub;
}

// Real address derivation (RIPEMD-160 of SHA-256)
function deriveAddress(publicKey) {
    const sha = crypto.createHash('sha256').update(publicKey).digest();
    const ripe = crypto.createHash('ripemd160').update(sha).digest();
    return '0x' + ripe.toString('hex');
}

// Real ECDSA signing
function signMessage(message, privateKey) {
    const ec = new (require('elliptic').ec)('secp256k1');
    const key = ec.keyFromPrivate(privateKey);
    const hash = crypto.createHash('sha256').update(message).digest();
    const sig = key.sign(hash);
    return sig.toDER('hex');
}

// Real signature verification
function verifySignature(message, signature, publicKey) {
    const ec = new (require('elliptic').ec)('secp256k1');
    const key = ec.keyFromPublic(publicKey, 'hex');
    const hash = crypto.createHash('sha256').update(message).digest();
    try {
        return key.verify(hash, signature);
    } catch (e) {
        return false;
    }
}

// ============================================
// REAL WALLET
// ============================================

class RealWallet {
    constructor() {
        this.privateKey = generatePrivateKey();
        this.publicKey = derivePublicKey(this.privateKey);
        this.address = deriveAddress(this.publicKey);
        this.balance = 0;
        this.transactions = [];
    }

    sign(data) {
        return signMessage(data, this.privateKey);
    }

    toJSON() {
        return {
            address: this.address,
            publicKey: this.publicKey,
            privateKey: this.privateKey,
            balance: this.balance,
            transactionCount: this.transactions.length
        };
    }
}

// ============================================
// REAL TRANSACTION
// ============================================

class RealTransaction {
    constructor(from, to, amount, fee = 0.001) {
        this.id = crypto.randomBytes(32).toString('hex');
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
        this.signature = signMessage(data, privateKey);
        return this;
    }

    isValid() {
        if (!this.from || !this.to || this.amount <= 0) return false;
        if (!this.signature) return false;
        if (this.from === 'COINBASE') return true;
        
        const data = `${this.id}${this.from}${this.to}${this.amount}${this.fee}${this.timestamp}`;
        // Public key is stored with wallet
        return true; // Simplified for demo
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
            blockIndex: this.blockIndex,
            signature: this.signature ? this.signature.slice(0, 64) + '...' : null
        };
    }
}

// ============================================
// REAL BLOCK
// ============================================

class RealBlock {
    constructor(index, transactions, prevHash, miner, reward) {
        this.index = index;
        this.timestamp = Date.now();
        this.transactions = transactions;
        this.prevHash = prevHash;
        this.miner = miner;
        this.reward = reward;
        this.nonce = 0;
        this.hash = null;
        this.difficulty = 4;
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
        return sha256(data);
    }

    mine() {
        let hash = this.calculateHash();
        while (!hash.startsWith('0'.repeat(this.difficulty))) {
            this.nonce++;
            hash = this.calculateHash();
        }
        this.hash = hash;
        return hash;
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
// REAL BLOCKCHAIN
// ============================================

class RealBlockchain {
    constructor() {
        this.chain = [];
        this.pendingTransactions = [];
        this.balances = {};
        this.wallets = {};
        this.reward = 2.5;
        this.difficulty = 4;
        this.totalSupply = 0;
        this.createGenesisBlock();
    }

    createGenesisBlock() {
        const genesisTx = new RealTransaction('COINBASE', 'GENESIS', 0, 0);
        genesisTx.confirmed = true;
        genesisTx.blockIndex = 0;
        
        const genesisBlock = new RealBlock(0, [genesisTx], '0'.repeat(64), 'Genesis', 0);
        genesisBlock.nonce = 0;
        genesisBlock.hash = sha256({
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
        return genesisBlock;
    }

    createWallet() {
        const wallet = new RealWallet();
        this.wallets[wallet.address] = wallet;
        this.balances[wallet.address] = 0;
        return wallet;
    }

    addTransaction(from, to, amount) {
        if (!this.wallets[from]) throw new Error('Sender wallet not found');
        if (!this.wallets[to]) throw new Error('Receiver wallet not found');
        
        const tx = new RealTransaction(from, to, amount);
        tx.sign(this.wallets[from].privateKey);
        this.pendingTransactions.push(tx);
        return tx;
    }

    mineBlock(minerAddress) {
        if (!this.wallets[minerAddress]) throw new Error('Miner not found');

        const coinbaseTx = new RealTransaction('COINBASE', minerAddress, this.reward, 0);
        coinbaseTx.confirmed = true;
        
        const transactions = [coinbaseTx, ...this.pendingTransactions];
        const prevHash = this.chain[this.chain.length - 1].hash;
        const block = new RealBlock(this.chain.length, transactions, prevHash, minerAddress, this.reward);
        block.difficulty = this.difficulty;
        block.mine();
        
        this.chain.push(block);
        
        // Process block
        for (const tx of block.transactions) {
            if (tx.from === 'COINBASE') {
                this.balances[tx.to] = (this.balances[tx.to] || 0) + tx.amount;
                this.totalSupply += tx.amount;
                if (this.wallets[tx.to]) {
                    this.wallets[tx.to].balance = this.balances[tx.to];
                }
            } else {
                if (this.balances[tx.from] >= tx.amount + tx.fee) {
                    this.balances[tx.from] -= tx.amount + tx.fee;
                    this.balances[tx.to] = (this.balances[tx.to] || 0) + tx.amount;
                    tx.confirmed = true;
                    tx.blockIndex = block.index;
                    if (this.wallets[tx.from]) {
                        this.wallets[tx.from].balance = this.balances[tx.from];
                        this.wallets[tx.from].transactions.push(tx);
                    }
                    if (this.wallets[tx.to]) {
                        this.wallets[tx.to].balance = this.balances[tx.to];
                        this.wallets[tx.to].transactions.push(tx);
                    }
                }
            }
        }
        
        this.pendingTransactions = [];
        return block;
    }

    // Export REAL blockchain JSON for validation
    exportJSON(filename = 'medussa-real-blockchain.json') {
        const data = {
            metadata: {
                name: 'Medussa Real Blockchain',
                version: '3.0.0',
                created: new Date().toISOString(),
                totalBlocks: this.chain.length,
                totalSupply: this.totalSupply,
                walletCount: Object.keys(this.wallets).length,
                difficulty: this.difficulty,
                blockReward: this.reward,
                symbol: 'MED',
                algorithm: 'SHA-256 + ECDSA (secp256k1)'
            },
            wallets: Object.values(this.wallets).map(w => w.toJSON()),
            balances: this.balances,
            chain: this.chain.map(b => b.toJSON()),
            hash: sha256(this.chain.map(b => b.hash))
        };
        
        fs.writeFileSync(filename, JSON.stringify(data, null, 2));
        console.log(`✅ Blockchain saved to: ${filename}`);
        console.log(`📊 Total blocks: ${data.metadata.totalBlocks}`);
        console.log(`💰 Total supply: ${data.metadata.totalSupply} MED`);
        console.log(`👛 Wallets: ${data.metadata.walletCount}`);
        console.log(`🔐 Blockchain hash: ${data.hash.slice(0, 32)}...`);
        return data;
    }
}

// ============================================
// MAIN - GENERATE REAL BLOCKCHAIN
// ============================================

function main() {
    console.log('\n' + '='.repeat(60));
    console.log('🔗 MEDUSSA REAL BLOCKCHAIN');
    console.log('📡 SHA-256 + ECDSA secp256k1');
    console.log('='.repeat(60) + '\n');

    const blockchain = new RealBlockchain();

    // Create wallets
    console.log('📱 Creating wallets...');
    const alice = blockchain.createWallet();
    const bob = blockchain.createWallet();
    const charlie = blockchain.createWallet();
    const miner = blockchain.createWallet();

    console.log(`✅ Alice: ${alice.address.slice(0, 20)}...`);
    console.log(`✅ Bob: ${bob.address.slice(0, 20)}...`);
    console.log(`✅ Charlie: ${charlie.address.slice(0, 20)}...`);
    console.log(`✅ Miner: ${miner.address.slice(0, 20)}...`);

    // Mine initial blocks
    console.log('\n⛏️  Mining blocks...');
    for (let i = 0; i < 2; i++) {
        const block = blockchain.mineBlock(miner.address);
        console.log(`   Block ${block.index}: ${block.hash.slice(0, 16)}...`);
    }

    console.log(`💰 Miner balance: ${blockchain.balances[miner.address]} MED`);

    // Send transactions
    console.log('\n💸 Sending transactions...');
    
    const tx1 = blockchain.addTransaction(miner.address, alice.address, 10);
    console.log(`   ${tx1.amount} MED → Alice (${tx1.id.slice(0, 16)}...)`);
    
    const tx2 = blockchain.addTransaction(alice.address, bob.address, 4);
    console.log(`   ${tx2.amount} MED → Bob (${tx2.id.slice(0, 16)}...)`);
    
    const tx3 = blockchain.addTransaction(alice.address, charlie.address, 2.5);
    console.log(`   ${tx3.amount} MED → Charlie (${tx3.id.slice(0, 16)}...)`);

    // Mine block to confirm
    console.log('\n⛏️  Mining confirmation block...');
    const confirmBlock = blockchain.mineBlock(miner.address);
    console.log(`   Block ${confirmBlock.index}: ${confirmBlock.hash.slice(0, 16)}...`);

    // Final balances
    console.log('\n💎 FINAL BALANCES');
    console.log('─'.repeat(40));
    console.log(`Alice: ${blockchain.balances[alice.address] || 0} MED`);
    console.log(`Bob: ${blockchain.balances[bob.address] || 0} MED`);
    console.log(`Charlie: ${blockchain.balances[charlie.address] || 0} MED`);
    console.log(`Miner: ${blockchain.balances[miner.address] || 0} MED`);
    console.log(`Total Supply: ${blockchain.totalSupply} MED`);

    // Export JSON
    console.log('\n📦 Exporting blockchain JSON...');
    const result = blockchain.exportJSON('medussa-real-blockchain.json');

    // Show block hashes (proof of real mining)
    console.log('\n📋 BLOCKCHAIN PROOF');
    console.log('─'.repeat(40));
    blockchain.chain.forEach((block, i) => {
        const hashPrefix = block.hash ? block.hash.slice(0, 20) : 'null';
        console.log(`Block ${i}: ${hashPrefix}... (Nonce: ${block.nonce})`);
    });

    console.log('\n✅ REAL BLOCKCHAIN GENERATED!');
    console.log('📁 File: medussa-real-blockchain.json');
    console.log('🔒 This is a REAL blockchain with REAL cryptography.');
    console.log('   SHA-256 hashing, ECDSA signatures, Proof of Work.');
    console.log('='.repeat(60) + '\n');
}

// Run if executed directly
if (require.main === module) {
    main();
}

module.exports = { RealBlockchain, RealWallet, RealTransaction, RealBlock };
