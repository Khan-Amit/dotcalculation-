// ============================================================
// blockchain.js — MEDUSSA REAL Blockchain Engine
// ============================================================

// ============================================================
// SHA256 (Real Cryptographic Hash)
// ============================================================
async function sha256(message) {
    const msgBuffer = new TextEncoder().encode(message);
    const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

// ============================================================
// BLOCK CLASS
// ============================================================
class Block {
    constructor(index, timestamp, data, previousHash, nonce = 0) {
        this.index = index;
        this.timestamp = timestamp;
        this.data = data;
        this.previousHash = previousHash;
        this.nonce = nonce;
        this.hash = '';
    }

    async calculateHash() {
        const payload = this.index + this.timestamp + this.data + this.previousHash + this.nonce;
        return await sha256(payload);
    }

    async mineBlock(difficulty) {
        const target = '0'.repeat(difficulty);
        while (true) {
            this.hash = await this.calculateHash();
            if (this.hash.startsWith(target)) break;
            this.nonce++;
        }
    }
}

// ============================================================
// BLOCKCHAIN CLASS
// ============================================================
class Blockchain {
    constructor(difficulty = 4) {
        this.chain = [];
        this.difficulty = difficulty;
        this.totalBlocks = 0;
        this.totalPulses = 0;
        this.vaulted = 0;
        this.segment = 1;
        this.consensus = 100;
        this.sessionStart = Date.now();
        this.nodes = ['ALPHA', 'BETA', 'GAMMA', 'DELTA', 'EPSILON', 'ZETA', 'ETA', 'THETA', 'IOTA'];
        this.nodeBlocks = {};
        this.nodes.forEach(n => this.nodeBlocks[n] = 0);
        this.isMining = false;
        this.miningInterval = null;
        this.lastBlockTime = Date.now();
        this.speed = 0;
        this.heat = 25;
        this.genesisCreated = false;
        this.chainFile = 'blockchain.json';
    }

    // ============================================================
    // GENESIS
    // ============================================================
    async createGenesis() {
        if (this.genesisCreated || this.chain.length > 0) return;
        const genesis = new Block(
            0,
            Date.now(),
            'GENESIS BLOCK — MEDUSSA BORN',
            '0000000000000000000000000000000000000000000000000000000000000000'
        );
        await genesis.mineBlock(this.difficulty);
        this.chain.push(genesis);
        this.totalBlocks = 1;
        this.vaulted = 1;
        this.genesisCreated = true;
        this.updateNodeBlock('GENESIS');
        await this.saveToFile();
    }

    // ============================================================
    // ADD BLOCK
    // ============================================================
    async addBlock(nodeName, data) {
        const index = this.chain.length;
        const timestamp = Date.now();
        const previousHash = this.chain[this.chain.length - 1].hash;
        const block = new Block(index, timestamp, data, previousHash);
        await block.mineBlock(this.difficulty);
        this.chain.push(block);
        this.totalBlocks = this.chain.length;
        this.vaulted = this.chain.length;
        this.totalPulses += Math.floor(Math.random() * 1000) + 100;
        this.updateNodeBlock(nodeName);
        this.lastBlockTime = Date.now();
        this.updateSpeed();
        this.updateHeat();
        this.updateConsensus();
        await this.saveToFile();
    }

    // ============================================================
    // INTERNAL UPDATES
    // ============================================================
    updateNodeBlock(nodeName) {
        if (this.nodeBlocks[nodeName] !== undefined) {
            this.nodeBlocks[nodeName]++;
        }
    }

    updateSpeed() {
        const now = Date.now();
        const diff = (now - this.lastBlockTime) / 1000;
        this.speed = diff > 0 ? Math.min(5.0, 1 / diff) : 0;
    }

    updateHeat() {
        const base = 25;
        const activity = this.isMining ? 15 : 0;
        const random = Math.random() * 5;
        this.heat = Math.min(45, base + activity + random);
    }

    updateConsensus() {
        const active = Object.values(this.nodeBlocks).filter(b => b > 0).length;
        this.consensus = Math.round((active / this.nodes.length) * 100);
        if (this.consensus < 60) this.consensus = 60;
    }

    // ============================================================
    // GETTERS
    // ============================================================
    getLatestBlock() {
        return this.chain[this.chain.length - 1];
    }

    isChainValid() {
        for (let i = 1; i < this.chain.length; i++) {
            if (this.chain[i].previousHash !== this.chain[i - 1].hash) return false;
        }
        return true;
    }

    getRollingWindow(size = 20) {
        const start = Math.max(0, this.chain.length - size);
        return this.chain.slice(start);
    }

    getStats() {
        const activeNodes = Object.values(this.nodeBlocks).filter(b => b > 0).length;
        return {
            totalBlocks: this.chain.length,
            activeNodes: `${activeNodes}/${this.nodes.length}`,
            totalPulses: this.totalPulses,
            vaulted: this.vaulted,
            segment: this.segment,
            consensus: `${this.consensus}%`,
            session: this.getSessionTime(),
            nodesSynced: `${activeNodes}/${this.nodes.length}`,
            speed: this.speed,
            heat: this.heat
        };
    }

    getSessionTime() {
        const elapsed = Math.floor((Date.now() - this.sessionStart) / 1000);
        const h = String(Math.floor(elapsed / 3600)).padStart(2, '0');
        const m = String(Math.floor((elapsed % 3600) / 60)).padStart(2, '0');
        const s = String(elapsed % 60).padStart(2, '0');
        return `${h}:${m}:${s}`;
    }

    toJSON() {
        return {
            chain: this.chain,
            totalBlocks: this.totalBlocks,
            totalPulses: this.totalPulses,
            vaulted: this.vaulted,
            segment: this.segment,
            consensus: this.consensus,
            session: this.getSessionTime(),
            nodesSynced: `${Object.values(this.nodeBlocks).filter(b => b > 0).length}/${this.nodes.length}`,
            nodeBlocks: this.nodeBlocks,
            timestamp: new Date().toISOString()
        };
    }

    // ============================================================
    // SAVE / LOAD blockchain.json (via File System API)
    // ============================================================
    async saveToFile() {
        try {
            const data = this.toJSON();
            const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
            if ('showSaveFilePicker' in window) {
                try {
                    const handle = await window.showSaveFilePicker({
                        suggestedName: this.chainFile,
                        types: [{ description: 'JSON', accept: { 'application/json': ['.json'] } }]
                    });
                    const writable = await handle.createWritable();
                    await writable.write(blob);
                    await writable.close();
                    return;
                } catch (e) {}
            }
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = this.chainFile;
            a.click();
            URL.revokeObjectURL(url);
        } catch (e) {
            console.warn('Auto-save failed:', e);
        }
    }

    async loadFromFile(file) {
        try {
            const text = await file.text();
            const data = JSON.parse(text);
            this.chain = data.chain || [];
            this.totalBlocks = data.totalBlocks || 0;
            this.totalPulses = data.totalPulses || 0;
            this.vaulted = data.vaulted || 0;
            this.segment = data.segment || 1;
            this.consensus = data.consensus || 100;
            this.nodeBlocks = data.nodeBlocks || {};
            this.nodes.forEach(n => { if (!this.nodeBlocks[n]) this.nodeBlocks[n] = 0; });
            this.genesisCreated = this.chain.length > 0;
            this.sessionStart = Date.now();
            if (this.chain.length > 0) {
                this.lastBlockTime = this.chain[this.chain.length - 1].timestamp;
            }
            return true;
        } catch (e) {
            console.warn('Failed to load blockchain.json:', e);
            return false;
        }
    }
}

// ============================================================
// EXPORT FOR USE IN HTML
// ============================================================
export { Blockchain, Block, sha256 };
