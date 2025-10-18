# Grocery Flyer Generator

Generate polished, on-brand grocery flyers (PNG) from simple JSON or text data. The system uses Node.js, Handlebars for templating, and Puppeteer for export. A local LLM (Ollama) helps with analysis and parsing.

## ✨ Features
- 5-column symmetric product grid with consistent spacing and card heights
- Logo, weekly banner with single-line dates, and a bold black footer
- Embedded product images and logo (base64) for reliable export
- PNG-only export for stability on macOS
- Optional: generate a manager-ready PPT deck with the latest flyer

## 🧰 Prerequisites
- macOS (tested), Linux/Windows should work with Node + Chromium
- Node.js 18+ and npm
- Chromium is bundled via Puppeteer (auto-installed)
- Optional (for AI-assisted parsing/analysis):
	- Ollama installed and running locally
	- Model: `llama2:7b` (or adjust in `.env`)

## 📦 Installation
1) Clone or copy this repository
2) Install dependencies

```bash
npm install
```

3) (Optional) Configure `.env`

Create a `.env` file in the project root if you want to use Ollama:

```
OLLAMA_HOST=http://localhost:11434
OLLAMA_MODEL=llama2:7b
```

Start Ollama if using AI features:

```bash
ollama serve
```

## 🖼️ Project Structure
- `index.js` – CLI entry, orchestrates the full pipeline
- `agents/` – modular steps: Coordinator, DataParser, Layout, Design, Export
- `data/` – example input JSON files
- `images/` – logo and optional footer promo images
- `output/generated-flyers/` – exported PNG flyers
- `output/presentations/` – generated PPT decks
- `scripts/generate-ppt.js` – builds a PPT for management review

## 📄 Data Format (JSON)
Place a JSON file in `data/`, e.g. `data/weekly-offers.json`:

```json
{
	"saleInfo": {
		"templateType": "weekly",
		"storeName": "STAR BAZAAR",
		"dateRange": "OCTOBER 10 TO OCTOBER 17, 2025",
		"address": "2431 W Main St, Norristown, PA - 19403",
		"email": "starbazaarpa@gmail.com",
		"phone": "484 986 0990",
		"attractionText": "FRESH • QUALITY • SAVINGS",
		"footerPromoText": "Free 1 Samosa And 1 Masala Tea With Shopping Worth $30"
	},
	"products": [
		{
			"name": "Laxmi Sonamasoori Rice",
			"price": "$33.99",
			"unit": "40LB",
			"image": "./images/products/sonamasoori.png"
		}
	]
}
```

Notes
- `image` paths should be relative to the project root. Images are embedded as base64.
- The logo is read from `./images/Star Bazaar.png` by default.

## ▶️ Generate a Flyer (PNG)

```bash
# From project root
node index.js data/weekly-offers.json
```

Output: `output/generated-flyers/flyer-weekly-YYYY-MM-DD.png`

Tips
- If using Ollama, ensure it’s running first (`ollama serve`).
- You can also run `node index.js --example` to test the pipeline quickly.

## 🧪 Quick HTML-only sanity test (optional)
If you want to test the template rendering without export, use `quick-test.js` (if present) or create a small script that calls `DesignAgent.getTemplate()` and writes an HTML file.


## 🧩 Troubleshooting
- Puppeteer fails to launch Chromium
	- Delete `node_modules` and reinstall: `rm -rf node_modules && npm install`
	- Ensure no corporate proxy blocks the download; try a personal network
- Export is blank or missing images
	- Verify your image paths exist and are readable
	- Use PNG/JPG files; avoid web URLs for now
- Date wraps to two lines
	- The template forces single-line dates. If your text still overflows, slightly shorten `saleInfo.dateRange` or reduce letter spacing.
- Ollama errors / timeouts
	- Make sure `ollama serve` is running and the model listed in `.env` is downloaded
	- You can skip AI parsing by providing clean JSON in `data/`

## ⚙️ Scripts
- `npm start` – prints CLI usage
- `npm run dev` – nodemon for development
- `npm test` – basic Ollama health/JSON tests
- `npm run ppt` – generate PPT deck

## 📜 License
This project is provided as-is for internal/store use. Avoid distributing product images you don’t own.
