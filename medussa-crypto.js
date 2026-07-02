#!/usr/bin/env node
/**
 * ⚡ MEDUSA CRYPTOCURRENCY BLOCKCHAIN
 * Complete Implementation - No Editing Required
 * Run: node medusa-crypto.js
 */

const crypto = require('crypto');
const fs = require('fs');
const path = require('path');

// ============================================
// CONFIGURATION
// ============================================

const CONFIG = {
    TIMEZONE: 'Europe/Vilnius',
    FILE_PREFIX: '1000019890_',
    DATA_DIR: './medusa_backups/',
    MAX_BLOCKS: 9000000,
    SEGMENTS: 9,
    BLOCKS_PER_SEGMENT: 1000000,
    HARDSHIP_START: 4,
    HARDSHIP_PEAK: 6,
    RESET_POINT: 9,
    REQUIRED_FIELDS: ['owner', 'email', 'date', 'location', 'timestamp', 'data'],
    MIN_VALUES_LENGTH: 14,
    MAX_VALUES_LENGTH: 14
};

// ============================================
// CRYPTOGRAPHIC HELPERS
// ============================================

class CryptoUtils {
    static sha256(data) {
        return crypto.createHash('sha256').update(data).digest('hex');
    }

    static generatePrivateKey() {
        return crypto.randomBytes(32).toString('base64');
    }

    static generatePublicKey(privateKey) {
        const hash = crypto.createHash('sha256');
        hash.update(privateKey);
        return hash.digest('hex');
    }

    static sign(data, privateKey) {
        const hash = crypto.createHash('sha256');
        hash.update(data + privateKey);
        return hash.digest('hex');
    }

    static verify(data, signature, publicKey) {
        const expected = this.sign(data, publicKey);
        return signature === expected;
    }

    static randomHash() {
        return crypto.randomBytes(32).toString('hex');
    }
}

// ============================================
// TIME & LOCATION HELPERS (LITHUANIA)
// ============================================

class LocationUtils {
    static getLithuaniaTime() {
        return new Date().toLocaleString('en-US', {
            timeZone: CONFIG.TIMEZONE
        });
    }

    static getLithuaniaDate() {
        return new Date().toLocaleDateString('en-CA', {
            timeZone: CONFIG.TIMEZONE
        });
    }

    static getFormattedDate() {
        const now = new Date();
        const lt = new Date(now.toLocaleString('en-US', {
            timeZone: CONFIG.TIMEZONE
        }));
        const year = lt.getFullYear();
        const month = String(lt.getMonth() + 1).padStart(2, '0');
        const day = String(lt.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    }

    static getLocation() {
        try {
            // Default to Vilnius, Lithuania
            return 'Vilnius_LT';
        } catch (e) {
            return 'Vilnius_LT';
        }
    }

    static getTimestamp() {
        return Date.now();
    }
}

// ============================================
// BLOCK CLASS
// ============================================

class Block {
    constructor(index, data, prevHash = '') {
        this.index = index;
        this.timestamp = LocationUtils.getTimestamp();
        this.date = LocationUtils.getLithuaniaDate();
        this.location = LocationUtils.getLocation();
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
// MEDUSA BLOCKCHAIN
// ============================================

class MedusaBlockchain {
    constructor() {
        this.chain = [this.createGenesisBlock()];
        this.difficulty = 4;
        this.segment = 1;
        this.pulseCount = 0;
        this.hardshipLevel = 0;
    }

    createGenesisBlock() {
        const data = {
            values: [0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0],
            winners: [false, false, false, false, false, false, false, true, false, false, false, false, false, false, 1],
            owner: 'Selim Ahmed',
            email: 'amit.khanna.1082@gmail.com',
            copyright: '© 2026 Selim Ahmed',
            patent: 'Pending',
            system: 'MEDUSA'
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
        this.updateSegment();
        this.chain.push(newBlock);
        return newBlock;
    }

    updateSegment() {
        const blockCount = this.chain.length;
        if (blockCount <= 1000000) {
            this.segment = 1;
            this.hardshipLevel = 0;
        } else if (blockCount <= 2000000) {
            this.segment = 2;
            this.hardshipLevel = 0;
        } else if (blockCount <= 3000000) {
            this.segment = 3;
            this.hardshipLevel = 0;
        } else if (blockCount <= 4000000) {
            this.segment = 4;
            this.hardshipLevel = 1;
        } else if (blockCount <= 5000000) {
            this.segment = 5;
            this.hardshipLevel = 2;
        } else if (blockCount <= 6000000) {
            this.segment = 6;
            this.hardshipLevel = 3;
        } else if (blockCount <= 7000000) {
            this.segment = 7;
            this.hardshipLevel = 2;
        } else if (blockCount <= 8000000) {
            this.segment = 8;
            this.hardshipLevel = 1;
        } else if (blockCount <= 9000000) {
            this.segment = 9;
            this.hardshipLevel = 0;
        }
    }

    isValid() {
        for (let i = 1; i < this.chain.length; i++) {
            const currentBlock = this.chain[i];
            const prevBlock = this.chain[i - 1];

            if (currentBlock.hash !== currentBlock.calculateHash()) {
                console.error(`❌ Invalid hash at block ${i}`);
                return false;
            }

            if (currentBlock.prevHash !== prevBlock.hash) {
                console.error(`❌ Invalid previous hash at block ${i}`);
                return false;
            }

            if (!this.validateBlockData(currentBlock.data)) {
                console.error(`❌ Invalid data at block ${i}`);
                return false;
            }
        }
        console.log('✅ Blockchain is valid!');
        return true;
    }

    validateBlockData(data) {
        for (const field of CONFIG.REQUIRED_FIELDS) {
            if (!data.hasOwnProperty(field)) {
                console.error(`❌ Missing field: ${field}`);
                return false;
            }
        }

        if (!Array.isArray(data.values)) {
            console.error('❌ Values must be an array');
            return false;
        }

        if (data.values.length !== CONFIG.MIN_VALUES_LENGTH) {
            console.error(`❌ Values must have ${CONFIG.MIN_VALUES_LENGTH} elements`);
            return false;
        }

        if (data.winners && !Array.isArray(data.winners)) {
            console.error('❌ Winners must be an array');
            return false;
        }

        return true;
    }

    getBlockByDate(date) {
        return this.chain.filter(block => block.date === date);
    }

    getBlocksByLocation(location) {
        return this.chain.filter(block => block.location === location);
    }

    getSummary() {
        return {
            totalBlocks: this.chain.length,
            segment: this.segment,
            hardshipLevel: this.hardshipLevel,
            pulseCount: this.pulseCount,
            difficulty: this.difficulty,
            latestBlock: this.getLatestBlock().hash,
            timestamp: LocationUtils.getLithuaniaTime(),
            location: LocationUtils.getLocation(),
            date: LocationUtils.getLithuaniaDate()
        };
    }

    toJSON() {
        return {
            owner: 'Selim Ahmed',
            email: 'amit.khanna.1082@gmail.com',
            copyright: '© 2026 Selim Ahmed',
            patent: 'Pending',
            system: 'MEDUSA',
            date: LocationUtils.getLithuaniaDate(),
            location: LocationUtils.getLocation(),
            timestamp: LocationUtils.getTimestamp(),
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
        const date = LocationUtils.getFormattedDate();
        const location = LocationUtils.getLocation();
        const filename = `${CONFIG.FILE_PREFIX}${date}_${location}.json`;
        const filepath = path.join(CONFIG.DATA_DIR, filename);

        if (!fs.existsSync(CONFIG.DATA_DIR)) {
            fs.mkdirSync(CONFIG.DATA_DIR, { recursive: true });
        }

        fs.writeFileSync(
            filepath,
            JSON.stringify(this.toJSON(), null, 2),
            'utf8'
        );

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
            
            if (!data.blockchain || !Array.isArray(data.blockchain)) {
                console.error('❌ Invalid blockchain data');
                return null;
            }

            console.log(`✅ Downloaded: ${path.basename(filepath)}`);
            console.log(`📅 Date: ${data.date || 'Unknown'}`);
            console.log(`📍 Location: ${data.location || 'Unknown'}`);
            console.log(`📊 Blocks: ${data.blockchain.length}`);

            return data;
        } catch (e) {
            console.error(`❌ Error reading file: ${e.message}`);
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
            hasOwner: data.owner && data.owner === 'Selim Ahmed',
            hasEmail: data.email && data.email.includes('@'),
            hasDate: data.date && data.date.match(/^\d{4}-\d{2}-\d{2}$/),
            hasLocation: data.location && data.location.includes('_'),
            hasTimestamp: data.timestamp && typeof data.timestamp === 'number',
            hasBlockchain: data.blockchain && Array.isArray(data.blockchain) && data.blockchain.length > 0,
            hasValidBlocks: true
        };

        if (checks.hasBlockchain) {
            for (const block of data.blockchain) {
                if (!block.hash || !block.data || !block.data.values) {
                    checks.hasValidBlocks = false;
                    break;
                }
            }
        }

        console.log('\n📋 Validation Results:');
        console.log('-'.repeat(40));
        console.log(`✅ Owner: ${checks.hasOwner ? 'PASS' : 'FAIL'}`);
        console.log(`✅ Email: ${checks.hasEmail ? 'PASS' : 'FAIL'}`);
        console.log(`✅ Date: ${checks.hasDate ? 'PASS' : 'FAIL'}`);
        console.log(`✅ Location: ${checks.hasLocation ? 'PASS' : 'FAIL'}`);
        console.log(`✅ Timestamp: ${checks.hasTimestamp ? 'PASS' : 'FAIL'}`);
        console.log(`✅ Blockchain: ${checks.hasBlockchain ? 'PASS' : 'FAIL'}`);
        console.log(`✅ Block Data: ${checks.hasValidBlocks ? 'PASS' : 'FAIL'}`);

        const allPass = Object.values(checks).every(v => v === true);
        console.log('-'.repeat(40));
        console.log(allPass ? '✅ VALIDATION PASSED!' : '❌ VALIDATION FAILED!');

        if (checks.hasBlockchain) {
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

function downloadMedusaFile(date, location = 'Vilnius_LT') {
    console.log('\n📥 Downloading MEDUSA file...');
    console.log('='.repeat(50));

    const filename = `${CONFIG.FILE_PREFIX}${date}_${location}.json`;
    const filepath = path.join(CONFIG.DATA_DIR, filename);

    if (!fs.existsSync(filepath)) {
        console.error(`❌ File not found: ${filename}`);
        console.log(`   Try: node medusa-crypto.js download ${date}`);
        return null;
    }

    const data = MedusaBlockchain.downloadFromFile(filepath);
    if (data) {
        validateMedusaFile(filepath);
    }

    return data;
}

// ============================================
// MAIN COMMAND LINE
// ============================================

function main() {
    const args = process.argv.slice(2);
    const command = args[0] || 'help';

    console.log('\n⚡ MEDUSA CRYPTOCURRENCY BLOCKCHAIN');
    console.log('='.repeat(50));

    switch (command) {
        case 'init':
            console.log('🔧 Initializing new MEDUSA blockchain...');
            const blockchain = new MedusaBlockchain();
            
            for (let i = 1; i <= 10; i++) {
                const data = {
                    values: Array.from({length: 14}, () => Math.floor(Math.random() * 1000)),
                    winners: Array.from({length: 15}, () => Math.random() > 0.5),
                    owner: 'Selim Ahmed',
                    email: 'amit.khanna.1082@gmail.com'
                };
                blockchain.addBlock(data);
            }
            
            blockchain.isValid();
            const filepath = blockchain.saveToFile();
            console.log(`\n✅ Blockchain saved to: ${filepath}`);
            break;

        case 'validate':
            const fileToValidate = args[1];
            if (!fileToValidate) {
                console.log('❌ Please specify a file to validate');
                console.log('   Usage: node medusa-crypto.js validate <filename>');
                break;
            }
            validateMedusaFile(fileToValidate);
            break;

        case 'download':
            const dateToDownload = args[1] || LocationUtils.getFormattedDate();
            const locationToDownload = args[2] || LocationUtils.getLocation();
            downloadMedusaFile(dateToDownload, locationToDownload);
            break;

        case 'today':
            const today = LocationUtils.getFormattedDate();
            const loc = LocationUtils.getLocation();
            console.log(`📅 Today: ${today}`);
            console.log(`📍 Location: ${loc}`);
            downloadMedusaFile(today, loc);
            break;

        case 'status':
            console.log('📊 Current Status:');
            console.log(`   Date: ${LocationUtils.getLithuaniaDate()}`);
            console.log(`   Time: ${LocationUtils.getLithuaniaTime()}`);
            console.log(`   Location: ${LocationUtils.getLocation()}`);
            console.log(`   Files available:`);
            if (fs.existsSync(CONFIG.DATA_DIR)) {
                const files = fs.readdirSync(CONFIG.DATA_DIR)
                    .filter(f => f.startsWith(CONFIG.FILE_PREFIX));
                files.forEach(f => console.log(`   📄 ${f}`));
                console.log(`   Total: ${files.length} files`);
            } else {
                console.log('   No files yet');
            }
            break;

        case 'help':
        default:
            console.log(`
📋 MEDUSA - Commands:

  node medusa-crypto.js init          - Initialize new blockchain
  node medusa-crypto.js validate <file> - Validate a file
  node medusa-crypto.js download [date] [location] - Download specific file
  node medusa-crypto.js today         - Download today's file
  node medusa-crypto.js status        - Show current status
  node medusa-crypto.js help          - Show this help

Examples:
  node medusa-crypto.js init
  node medusa-crypto.js validate ./medusa_backups/1000019890_2026-07-02_Vilnius_LT.json
  node medusa-crypto.js download 2026-07-02 Vilnius_LT
  node medusa-crypto.js today

📍 Current Location: ${LocationUtils.getLocation()}
📅 Current Date: ${LocationUtils.getLithuaniaDate()}
            `);
            break;
    }
}

// ============================================
// EXPORTS
// ============================================

module.exports = {
    CryptoUtils,
    LocationUtils,
    Block,
    MedusaBlockchain,
    validateMedusaFile,
    downloadMedusaFile,
    CONFIG
};

if (require.main === module) {
    main();
}
