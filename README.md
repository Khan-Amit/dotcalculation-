# 🐍 MEDUSSA Blockchain

## Your Own Private Blockchain

Built on 3-6-9 Matrix · Electromagnetic Pulse Counting

---

## What Is Medussa?

**Medussa** is a complete, self-contained blockchain system that:

- ✅ Creates blocks from pulse data
- ✅ Displays blockchain in real-time
- ✅ Saves to localStorage (phone backup)
- ✅ **Save to folder** (Download JSON)
- ✅ **Load from folder** (Import JSON)
- ✅ Works offline - no internet needed
- ✅ No crypto - just pure blockchain

---

## How It Works

### 1. Pulse Counting (3-6-9 Matrix)
- **3 = Creator** (Input pulses)
- **6 = Preserver** (Pulse interaction)
- **9 = Destroyer** (Block creation)

### 2. Binary Logic
- if (Pulse > Threshold) → 1 (WINNER)
- if (Pulse < Threshold) → 0 (LOSER)

### 3. Blockchain
- Blocks are chained together
- Each block references previous hash
- Immutable by design

---

## Features

| Feature | Description |
|---------|-------------|
| **Live Dashboard** | Real-time display of 12 channels |
| **Binary Map** | Visual 1/0 representation |
| **Blockchain View** | Last 20 blocks displayed |
| **Save to Folder** | Download JSON to any folder |
| **Load from Folder** | Import JSON from any folder |
| **Export/Import** | Save/load your chain |
| **Auto-Mining** | Space bar to toggle |
| **Phone Backup** | localStorage persistence |

---

## File Structure


---

## How to Use

### Quick Start
1. Open `index.html` in any browser
2. Press **Space** to start auto-mining
3. Watch blocks appear

### Save to Folder
1. Enter folder name in the input box
2. Click **SAVE CHAIN**
3. JSON file downloads to your Downloads folder
4. Move it anywhere you want

### Load from Folder
1. Click **LOAD CHAIN**
2. Select your JSON file
3. Chain restores immediately

### Add Block
- Click **ADD BLOCK** (adds one block)
- Press **Space** (toggles auto-mining)

### Export Chain
- Click **EXPORT JSON**
- Or press **Ctrl+S**
- Saves as JSON file

### Import Chain
- Click **IMPORT JSON**
- Select your JSON file
- Chain restores

### Clear Chain
- Click **CLEAR ALL**
- Or press **Ctrl+C**
- Confirms before clearing

---

## Keyboard Shortcuts

| Key | Action |
|-----|--------|
| **Space** | Toggle auto-mining |
| **Ctrl+S** | Export chain |
| **Ctrl+C** | Clear chain |

---

## The 3-6-9 Matrix

| Number | Role | Description |
|--------|------|-------------|
| **3** | Creator | Input pulses from sensors |
| **6** | Preserver | Pulse interaction/processing |
| **9** | Destroyer | Block creation/output |

---

## Block Structure

```json
{
  "index": 0,
  "timestamp": 1234567890,
  "pulseCount": 3492,
  "decision": true,
  "prevHash": "0000000000000000",
  "hash": "3a7f8b2c9d4e5f01",
  "data": {
    "values": [3162, 2880, 1244, ...],
    "winners": [true, true, false, ...]
  }
}



---

## How to Use

### Quick Start
1. Open `index.html` in any browser
2. Press **Space** to start auto-mining
3. Watch blocks appear

### Save to Folder
1. Enter folder name in the input box
2. Click **SAVE CHAIN**
3. JSON file downloads to your Downloads folder
4. Move it anywhere you want

### Load from Folder
1. Click **LOAD CHAIN**
2. Select your JSON file
3. Chain restores immediately

### Add Block
- Click **ADD BLOCK** (adds one block)
- Press **Space** (toggles auto-mining)

### Export Chain
- Click **EXPORT JSON**
- Or press **Ctrl+S**
- Saves as JSON file

### Import Chain
- Click **IMPORT JSON**
- Select your JSON file
- Chain restores

### Clear Chain
- Click **CLEAR ALL**
- Or press **Ctrl+C**
- Confirms before clearing

---

## Keyboard Shortcuts

| Key | Action |
|-----|--------|
| **Space** | Toggle auto-mining |
| **Ctrl+S** | Export chain |
| **Ctrl+C** | Clear chain |

---

## The 3-6-9 Matrix

| Number | Role | Description |
|--------|------|-------------|
| **3** | Creator | Input pulses from sensors |
| **6** | Preserver | Pulse interaction/processing |
| **9** | Destroyer | Block creation/output |

---

## Block Structure

```json
{
  "index": 0,
  "timestamp": 1234567890,
  "pulseCount": 3492,
  "decision": true,
  "prevHash": "0000000000000000",
  "hash": "3a7f8b2c9d4e5f01",
  "data": {
    "values": [3162, 2880, 1244, ...],
    "winners": [true, true, false, ...]
  }
}
## The 3-6-9 Matrix

| Number | Role | Description |
|--------|------|-------------|
| **3** | Creator | Input pulses from sensors |
| **6** | Preserver | Pulse interaction/processing |
| **9** | Destroyer | Block creation/output |

---

## Block Structure

```json
{
  "index": 0,
  "timestamp": 1234567890,
  "pulseCount": 3492,
  "decision": true,
  "prevHash": "0000000000000000",
  "hash": "3a7f8b2c9d4e5f01",
  "data": {
    "values": [3162, 2880, 1244, ...],
    "winners": [true, true, false, ...]
  }
}
```

---

Folder Save Format

```json
{
  "name": "medussa_chain",
  "version": "1.0",
  "matrix": "3-6-9",
  "created": 1234567890,
  "blockchain": [...],
  "totalPulses": 12345,
  "blockCount": 100
}
```

---
