# 🛒 AI Grocery Flyer Generator

**Generate professional grocery flyers from JSON data using AI-powered layout optimization.**

[![Node.js](https://img.shields.io/badge/Node.js-18+-green.svg)](https://nodejs.org/)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)

> Transform product data into print-ready flyers in minutes with AI-powered design and layout optimization.

## ✨ Features

- **5-column responsive grid** with perfect alignment
- **AI-powered product categorization** and layout optimization
- **PNG export** ready for print and digital use
- **Embedded images** with no broken links
- **Multiple templates** (weekly, anniversary, holiday)


## 🚀 Quick Start

```bash
# Install
git clone https://github.com/12-crypto/AI-Flyer-Generator.git
cd AI-Flyer-Generator
npm install

# Optional: Setup Ollama for AI features
ollama pull llama2:7b && ollama serve

# Generate flyer
node index.js data/weekly-offers.json
```

## 📋 Usage

```bash
# Basic usage
node index.js data/weekly-offers.json
node index.js --example
node index.js --list

# Development
npm run dev          # Auto-reload mode
node quick-test.js   # HTML-only test
npm run ppt         # Generate presentation
```

## 📊 Data Format

```json
{
  "saleInfo": {
    "templateType": "weekly",
    "storeName": "STAR BAZAAR",
    "dateRange": "OCTOBER 10 TO OCTOBER 17, 2025",
    "address": "Main St, PA ",
    "phone": "XXX XXX XXXX"
  },
  "products": [
    {
      "name": "Laxmi Sonamasoori Rice",
      "price": "$33.99",
      "unit": "40LB",
      "specialOffer": true,
      "category": "rice",
      "image": "./images/products/rice.jpg"
    }
  ]
}
```

## 🏗️ Architecture


```
┌─────────────────┐    ┌──────────────────┐    ┌─────────────────┐
│  JSON/Text Data │───▶│  Coordinator     │───▶│  Layout Agent   │
│  • Products     │    │  Agent           │    │  • Grid Design  │
│  • Sale Info    │    │  • Analysis      │    │  • Positioning  │
│  • Images       │    │  • Planning      │    │  • Optimization │
└─────────────────┘    └──────────────────┘    └─────────────────┘
                                │
                                ▼
┌─────────────────┐    ┌──────────────────┐    ┌─────────────────┐
│  PNG Export     │◀───│  Design Agent    │◀───│  Data Parser    │
│  • Puppeteer    │    │  • HTML/CSS      │    │  • Text → JSON  │
│  • Print Ready  │    │  • Handlebars    │    │  • Validation   │
│  • Embedded IMG │    │  • Responsive    │    │  • Fallbacks    │
└─────────────────┘    └──────────────────┘    └─────────────────┘
```

### **Core Agents:**
- **CoordinatorAgent** - Orchestrates workflow and AI analysis (Ollama LLM)
- **DataParserAgent** - Converts text/JSON to structured data (Ollama + Regex)
- **LayoutAgent** - Grid arrangement and positioning (JavaScript)
- **DesignAgent** - HTML/CSS generation with Handlebars
- **ExportAgent** - PNG export via Puppeteer

## 📁 Project Structure

```
├── index.js                 # Main CLI
├── agents/                  # AI agent modules
├── data/                   # Input JSON files
├── images/                 # Logos and product images
├── output/generated-flyers/ # PNG exports
├── scripts/generate-ppt.js # Presentation generator
└── utils/ollamaClient.js   # LLM integration
```

## 🔧 Configuration

Create `.env` file:
```env
OLLAMA_HOST=http://localhost:11434
OLLAMA_MODEL=llama2:7b
```

## 🛠️ Available Scripts

| Command | Description |
|---------|-------------|
| `npm start` | Show CLI usage help |
| `npm run dev` | Development mode with nodemon |
| `npm test` | Run system health checks |
| `npm run ppt` | Generate PowerPoint presentation |

## 🐛 Troubleshooting

**Puppeteer issues:**
```bash
rm -rf node_modules && npm install
```

**Missing images:**
- Use relative paths from project root
- PNG/JPG formats only

**Ollama errors:**
```bash
ollama serve
ollama pull llama2:7b
```


## 📜 License

MIT License - Free for commercial use. Don't redistribute copyrighted product images.

---

