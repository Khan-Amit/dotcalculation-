// ============================================================
// blockchain.js – Medussa (MEDB) Blockchain (JSON native)
// ============================================================

const crypto = require('crypto');

// ============================================================
// SHA256 HASH
// ============================================================
function sha256(str) {
    return crypto.createHash('sha256').update(str).digest('hex');
}

// ============================================================
// BLOCK CLASS
// ============================================================
class Block {
    constructor(index, data, previousHash = '000000') {
        this.index = index;
        this.timestamp = Math.floor(Date.now() / 1000);
        this.data = data;
        this.previousHash = previousHash;
        this.nonce = 0;
        this.hash = this.calculateHash();
    }

    calculateHash() {
        return sha256(
            this.index +
            this.timestamp +
            this.data +
            this.previousHash +
            this.nonce
        );
    }

    mineBlock(difficulty) {
        const target = '0'.repeat(difficulty);
        while (!this.hash.startsWith(target)) {
            this.nonce++;
            this.hash = this.calculateHash();
        }
        console.log(`⛏️  Block mined: ${this.hash} (nonce: ${this.nonce})`);
    }
}

// ============================================================
// BLOCKCHAIN CLASS
// ============================================================
class Blockchain {
    constructor(difficulty = 4) {
        this.chain = [this.createGenesisBlock()];
        this.difficulty = difficulty;
        this.blockCount = 0;
        this.medbRewardCounter = 0;
        this.totalMedb = 0;
    }

    createGenesisBlock() {
        const genesis = new Block(0, 'GENESIS BLOCK – MEDUSSA BORN', '000000');
        genesis.mineBlock(this.difficulty);
        return genesis;
    }

    getLatestBlock() {
        return this.chain[this.chain.length - 1];
    }

    addBlock(data) {
        this.blockCount++;
        const newBlock = new Block(
            this.blockCount,
            data,
            this.getLatestBlock().hash
        );
        newBlock.mineBlock(this.difficulty);
        this.chain.push(newBlock);

        // 🪙 3 BLOCKS = 1 MEDB
        this.medbRewardCounter++;
        if (this.medbRewardCounter === 3) {
            this.medbRewardCounter = 0;
            this.totalMedb++;
            console.log(`🪙 +1 MEDB MINED! (Total: ${this.totalMedb} MEDB)`);
        }
    }

    isChainValid() {
        for (let i = 1; i < this.chain.length; i++) {
            const current = this.chain[i];
            const previous = this.chain[i - 1];

            if (current.hash !== current.calculateHash()) {
                console.log(`❌ Invalid hash at block ${i}`);
                return false;
            }
            if (current.previousHash !== previous.hash) {
                console.log(`❌ Invalid previous hash at block ${i}`);
                return false;
            }
        }
        return true;
    }

    toJSON() {
        return {
            chain: this.chain,
            difficulty: this.difficulty,
            blockCount: this.blockCount,
            totalMedb: this.totalMedb,
            timestamp: new Date().toISOString()
        };
    }

    printChain() {
        console.log('\n=========================================');
        console.log('📦 MEDUSSA BLOCKCHAIN (JSON)');
        console.log('=========================================');
        this.chain.forEach(block => {
            console.log(
                `Block #${block.index} | Hash: ${block.hash} | Prev: ${block.previousHash.slice(0, 10)}... | Data: ${block.data} | Nonce: ${block.nonce}`
            );
        });
        console.log('=========================================');
        console.log(`🔗 Total blocks: ${this.chain.length}`);
        console.log(`🪙 Total MEDB mined: ${this.totalMedb} MEDB`);
        console.log('=========================================\n');
    }
}

// ============================================================
// RUN SIMULATION
// ============================================================
console.log('🔥 MEDUSSA (MEDB) BLOCKCHAIN v1.0 (JSON native)');
console.log('=========================================');
console.log('💡 3 BLOCKS = 1 MEDB');
console.log('⚡ Difficulty: 4 leading zeros');
console.log('=========================================\n');

const medussa = new Blockchain(4);

console.log('⛏️  Mining blocks...\n');

for (let i = 1; i <= 12; i++) {
    medussa.addBlock(`Transaction ${i} -> Medussa Network`);
}

console.log(`\n✅ Chain valid: ${medussa.isChainValid()}`);

medussa.printChain();

// ============================================================
// EXPORT AS JSON
// ============================================================
const jsonOutput = medussa.toJSON();
console.log('📄 JSON Export (first 2 blocks preview):');
console.log(JSON.stringify({
    ...jsonOutput,
    chain: jsonOutput.chain.slice(0, 2)
}, null, 2));

// ============================================================
// TAMPER TEST
// ============================================================
console.log('\n🔧 Tampering with block 1...');
medussa.chain[1].data = 'HACKED!';
medussa.chain[1].hash = medussa.chain[1].calculateHash();

console.log(`🔍 Chain valid after tamper: ${medussa.isChainValid()}`);
