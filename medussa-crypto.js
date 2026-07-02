#!/usr/bin/env node
/**
 * ⚡ MEDUSA CRYPTOCURRENCY BLOCKCHAIN
 * COMPLETE FIXED VERSION - READY TO RUN
 * Run: node medusa-crypto.js
 */

const crypto = require('crypto');
const fs = require('fs');
const path = require('path');

// ============================================
// CONFIGURATION
// ============================================

const CONFIG = {
    TIMEZONE: 'Asia/Dhaka',
    FILE_PREFIX: '1000019890_',
    DATA_DIR: './medusa_backups/',
    DIFFICULTY: 4
};

// ============================================
// CRYPTOGRAPHIC HELPERS - FIXED
// ============================================

class CryptoUtils {
    // FIXED: This was broken before
    static sha256(data) {
        return crypto.createHash('sha256').update(data).digest('hex');
    }

    static generatePrivateKey() {
        return crypto.randomBytes(32).toString('base64');
    }

    static generatePublicKey(privateKey) {
        return crypto.createHash('sha256').update(privateKey).digest('hex');
    }

    static randomHash() {
        return crypto.randomBytes(32).toString('hex');
    }
}

// ============================================
// TIME HELPERS
// ============================================

class TimeUtils {
    static getDate() {
        return new Date().toISOString().split('T')[0];
    }

    static getTime() {
        return Date.now();
    }

    static getLocation() {
        return 'Dhaka_BD';
    }
}

// ============================================
// BLOCK CLASS
// ============================================

class Block {
    constructor(index, data, prevHash = '0') {
        this.index = index;
        this.timestamp = TimeUtils.getTime();
        this.date = TimeUtils.getDate();
        this.location = TimeUtils.getLocation();
        this.data = data;
        this.prevHash = prevHash;
        this.nonce = 0;
        this.hash = this.calculateHash();
    }

    calculateHash() {
        const blockData = 
            this.index +
            this.timestamp +
            this.date +
            this.location +
            JSON.stringify(this.data) +
            this.prevHash +
            this.nonce;
        return CryptoUtils.sha256(blockData);
    }

    mineBlock(difficulty) {
        const target = '0'.repeat(difficulty);
        while (this.hash.substring(0, difficulty) !== target) {
            this.nonce++;
            this.hash = this.calculateHash();
        }
        console.log(`✅ Block ${this.index} mined: ${this.hash}`);
    }
}

// ============================================
// MEDUSA BLOCKCHAIN - COMPLETE
// ============================================

class MedusaBlockchain {
    constructor() {
        this.chain = [this.createGenesisBlock()];
        this.difficulty = CONFIG.DIFFICULTY;
        this.pulseCount = 0;
    }

    createGenesisBlock() {
        const data = {
            owner: 'Selim Ahmed',
            email: 'amit.khanna.1082@gmail.com',
            copyright: '© 2026 Selim Ahmed',
            patent: 'Pending',
            system: 'MEDUSA',
            values: [0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0],
            winners: [false, false, false, false, false, false, false, true, false, false, false, false, false, false, 1]
        };
        return new Block(0, data, '0000000000000000');
    }

    getLatestBlock() {
        return this.chain[this.chain.length - 1];
    }

    addBlock(data) {
        const latestBlock = this.getLatestBlock();
        const newBlock = new Block(
            this.chain.length,
            data,
            latestBlock.hash
        );
        newBlock.mineBlock(this.difficulty);
        this.pulseCount++;
        this.chain.push(newBlock);
        return newBlock;
    }

    isValid() {
        for (let i = 1; i < this.chain.length; i++) {
            const current = this.chain[i];
            const prev = this.chain[i - 1];

            if (current.hash !== current.calculateHash()) {
                console.error(`❌ Invalid hash at block ${i}`);
                return false;
            }

            if (current.prevHash !== prev.hash) {
                console.error(`❌ Invalid prev hash at block ${i}`);
                return false;
            }
        }
        console.log('✅ Blockchain is valid!');
        return true;
    }

    getSummary() {
        return {
            totalBlocks: this.chain.length,
            pulseCount: this.pulseCount,
            difficulty: this.difficulty,
            latestBlock: this.getLatestBlock().hash,
            date: TimeUtils.getDate(),
            location: TimeUtils.getLocation()
        };
    }

    toJSON() {
        return {
            owner: 'Selim Ahmed',
            email: 'amit.khanna.1082@gmail.com',
            copyright: '© 2026 Selim Ahmed',
            patent: 'Pending',
            system: 'MEDUSA',
            date: TimeUtils.getDate(),
            location: TimeUtils.getLocation(),
            timestamp: TimeUtils.getTime(),
            summary: this.getSummary(),
            blockchain: this.chain.map(block => ({
                index: block.index,
                timestamp: block.timestamp,
                date: block.date,
                location: block.location,
                data: block.data,
                prevHash: block.prevHash,
                hash: block.hash,
                nonce: block.nonce
            }))
        };
    }

    saveToFile() {
        const date = TimeUtils.getDate();
        const location = TimeUtils.getLocation();
        const filename = `${CONFIG.FILE_PREFIX}${date}_${location}.json`;
        const filepath = path.join(CONFIG.DATA_DIR, filename);

        if (!fs.existsSync(CONFIG.DATA_DIR)) {
            fs.mkdirSync(CONFIG.DATA_DIR, { recursive: true });
        }

        fs.writeFileSync(filepath, JSON.stringify(this.toJSON(), null, 2));
        console.log(`✅ File saved: ${filename}`);
        console.log(`📁 Path: ${filepath}`);
        return filepath;
    }

    static downloadFromFile(filepath) {
        if (!fs.existsSync(filepath)) {
            console.error(`❌ File not found: ${filepath}`);
            return null;
        }

        try {
            const content = fs.readFileSync(filepath, 'utf8');
            const data = JSON.parse(content);
            console.log(`✅ Downloaded: ${path.basename(filepath)}`);
            console.log(`📅 Date: ${data.date}`);
            console.log(`📍 Location: ${data.location}`);
            console.log(`📊 Blocks: ${data.blockchain.length}`);
            return data;
        } catch (e) {
            console.error(`❌ Error: ${e.message}`);
            return null;
        }
    }
}

// ============================================
// VALIDATION FUNCTION
// ============================================

function validateMedusaFile(filepath) {
    console.log('\n🔍 Validating MEDUSA file...');
    console.log('='.repeat(50));

    if (!fs.existsSync(filepath)) {
        console.error(`❌ File not found: ${filepath}`);
        return false;
    }

    try {
        const content = fs.readFileSync(filepath, 'utf8');
        const data = JSON.parse(content);

        const checks = {
            owner: data.owner === 'Selim Ahmed',
            email: data.email && data.email.includes('@'),
            date: data.date && data.date.match(/^\d{4}-\d{2}-\d{2}$/),
            location: data.location && data.location.includes('_'),
            blockchain: data.blockchain && data.blockchain.length > 0,
            values: data.blockchain && data.blockchain[0].data && data.blockchain[0].data.values
        };

        console.log('\n📋 Validation Results:');
        console.log('-'.repeat(40));
        console.log(`✅ Owner: ${checks.owner ? 'PASS' : 'FAIL'}`);
        console.log(`✅ Email: ${checks.email ? 'PASS' : 'FAIL'}`);
        console.log(`✅ Date: ${checks.date ? 'PASS' : 'FAIL'}`);
        console.log(`✅ Location: ${checks.location ? 'PASS' : 'FAIL'}`);
        console.log(`✅ Blockchain: ${checks.blockchain ? 'PASS' : 'FAIL'}`);
        console.log(`✅ Values: ${checks.values ? 'PASS' : 'FAIL'}`);

        const allPass = Object.values(checks).every(v => v === true);
        console.log('-'.repeat(40));
        console.log(allPass ? '✅ VALIDATION PASSED!' : '❌ VALIDATION FAILED!');

        if (checks.blockchain) {
            console.log(`\n📊 Summary:`);
            console.log(`   Blocks: ${data.blockchain.length}`);
            console.log(`   Date: ${data.date}`);
            console.log(`   Location: ${data.location}`);
        }

        return allPass;

    } catch (e) {
        console.error(`❌ Validation error: ${e.message}`);
        return false;
    }
}

// ============================================
// DOWNLOAD FUNCTION
// ============================================

function downloadMedusaFile(date, location = 'Dhaka_BD') {
    console.log('\n📥 Downloading MEDUSA file...');
    console.log('='.repeat(50));

    const filename = `${CONFIG.FILE_PREFIX}${date}_${location}.json`;
    const filepath = path.join(CONFIG.DATA_DIR, filename);

    if (!fs.existsSync(filepath)) {
        console.error(`❌ File not found: ${filename}`);
        return null;
    }

    return MedusaBlockchain.downloadFromFile(filepath);
}

// ============================================
// MAIN
// ============================================

function main() {
    const args = process.argv.slice(2);
    const command = args[0] || 'help';

    console.log('\n⚡ MEDUSA BLOCKCHAIN');
    console.log('='.repeat(50));

    switch (command) {
        case 'init':
            console.log('🔧 Initializing MEDUSA...');
            const bc = new MedusaBlockchain();
            for (let i = 1; i <= 5; i++) {
                bc.addBlock({
                    values: Array.from({length: 14}, () => Math.floor(Math.random() * 1000)),
                    winners: Array.from({length: 15}, () => Math.random() > 0.5),
                    owner: 'Selim Ahmed'
                });
            }
            bc.isValid();
            bc.saveToFile();
            break;

        case 'validate':
            const file = args[1];
            if (!file) {
                console.log('❌ Usage: node medusa-crypto.js validate <filename>');
                break;
            }
            validateMedusaFile(file);
            break;

        case 'download':
            const date = args[1] || TimeUtils.getDate();
            const loc = args[2] || TimeUtils.getLocation();
            downloadMedusaFile(date, loc);
            break;

        case 'today':
            const today = TimeUtils.getDate();
            const location = TimeUtils.getLocation();
            console.log(`📅 Today: ${today}`);
            console.log(`📍 Location: ${location}`);
            downloadMedusaFile(today, location);
            break;

        case 'status':
            console.log(`📅 Date: ${TimeUtils.getDate()}`);
            console.log(`📍 Location: ${TimeUtils.getLocation()}`);
            if (fs.existsSync(CONFIG.DATA_DIR)) {
                const files = fs.readdirSync(CONFIG.DATA_DIR)
                    .filter(f => f.startsWith(CONFIG.FILE_PREFIX));
                console.log(`📄 Files: ${files.length}`);
                files.forEach(f => console.log(`   - ${f}`));
            }
            break;

        default:
            console.log(`
📋 MEDUSA Commands:

  node medusa-crypto.js init          - Initialize blockchain
  node medusa-crypto.js validate <file> - Validate a file
  node medusa-crypto.js download [date] - Download a file
  node medusa-crypto.js today         - Download today's file
  node medusa-crypto.js status        - Show status

Examples:
  node medusa-crypto.js init
  node medusa-crypto.js today
  node medusa-crypto.js status
            `);
    }
}

// ============================================
// EXPORTS
// ============================================

module.exports = {
    CryptoUtils,
    TimeUtils,
    Block,
    MedusaBlockchain,
    validateMedusaFile,
    downloadMedusaFile,
    CONFIG
};

if (require.main === module) {
    main();
}
