// agents/designAgent.js - WITH PRODUCT IMAGE SUPPORT
import handlebars from 'handlebars';
import fs from 'fs';
import path from 'path';

export class DesignAgent {
  constructor() {
    this.name = 'Design';
  }

  async generateHTML(layout, templateType, saleInfo = {}) {
    console.log('🎨 Design Agent: Creating HTML flyer with product images...');

    const template = this.getTemplate(templateType);
    const compiledTemplate = handlebars.compile(template);
    
    // Process product images - convert to base64 for embedded PDF
    const productsWithImages = await this.processProductImages(layout.products);
    
  // Process logo image
    const logoImageData = await this.processLogoImage();
  // Process footer promo images
  const { leftPromoImageData, rightPromoImageData } = await this.processPromoImages(saleInfo);
    
    const html = compiledTemplate({
      products: productsWithImages,
      grid: layout.grid,
      colorScheme: layout.colorScheme,
      dateRange: saleInfo.dateRange || this.getDateRange(),
      storeName: saleInfo.storeName || 'STAR BAZAAR',
      saleTitle: this.getSaleTitle(templateType),
      address: saleInfo.address || '2431 W Main St, Norristown, PA - 19403',
      email: saleInfo.email || 'starbazaarpa@gmail.com',
      phone: saleInfo.phone || '484 986 0990',
      logoImageData: logoImageData,
      footerPromoText: saleInfo.footerPromoText || 'Free 1 Samosa And 1 Masala Tea With Shopping Worth $30',
      acceptBannerText: saleInfo.acceptBannerText || 'NOW WE ACCEPT AETNA FOOD CARD ALSO',
      cashText: saleInfo.cashText || 'Cash Discount 2%',
      leftPromoImageData,
      rightPromoImageData,
      attractionText: saleInfo.attractionText || 'FRESH • QUALITY • SAVINGS'
    });

    console.log('✅ Design Agent: HTML generated with product images');
    return html;
  }

  async processProductImages(products) {
    return products.map(product => {
      if (product.image && fs.existsSync(product.image)) {
        // Convert local image to base64 for embedding in PDF
        const imageBuffer = fs.readFileSync(product.image);
        const base64Image = imageBuffer.toString('base64');
        const ext = path.extname(product.image).toLowerCase();
        const mimeType = ext === '.png' ? 'image/png' : 'image/jpeg';
        
        return {
          ...product,
          imageData: `data:${mimeType};base64,${base64Image}`
        };
      }
      return product;
    });
  }

  async processLogoImage() {
    const logoPath = './images/Star Bazaar.png';
    if (fs.existsSync(logoPath)) {
      const imageBuffer = fs.readFileSync(logoPath);
      const base64Image = imageBuffer.toString('base64');
      return `data:image/png;base64,${base64Image}`;
    }
    return null;
  }

  async processPromoImages(saleInfo = {}) {
    const leftPath = saleInfo.footerLeftImage || './images/footer-left.png';
    const rightPath = saleInfo.footerRightImage || './images/footer-right.png';

    const toData = (p) => {
      try {
        if (p && fs.existsSync(p)) {
          const buf = fs.readFileSync(p);
          const ext = path.extname(p).toLowerCase();
          const mime = ext === '.png' ? 'image/png' : 'image/jpeg';
          return `data:${mime};base64,${buf.toString('base64')}`;
        }
      } catch {}
      return null;
    };

    return {
      leftPromoImageData: toData(leftPath),
      rightPromoImageData: toData(rightPath)
    };
  }

  getTemplate(templateType) {
    return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>{{storeName}} - {{saleTitle}}</title>
  <style>
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }
    :root {
      --page-width: 1200px;
      --grid-cols: 5;
      --space-1: 4px;
      --space-2: 8px;
      --space-3: 12px;
      --space-4: 16px;
      --space-5: 20px;
      --radius-s: 8px;
      --radius-m: 12px;
      --radius-l: 18px;
      --radius-xl: 22px;
      --shadow-1: 0 2px 6px rgba(0,0,0,0.12);
      --shadow-2: 0 6px 12px rgba(0,0,0,0.18);
      --shadow-3: 0 8px 16px rgba(0,0,0,0.22);
      --brand-green: #2e7d32;
      --brand-yellow: #ffd54f;
      --brand-orange: #ff9800;
      --brand-orange2: #ff7043;
    }
    
    body {
      font-family: 'Arial Black', Arial, sans-serif;
      -webkit-font-smoothing: antialiased;
      -moz-osx-font-smoothing: grayscale;
      line-height: 1.3;
      background: #fff;
      width: var(--page-width);
      margin: 0 auto;
    }
    
    .header {
      /* Fresh produce inspired left tone fading into warm weekly banner colors */
      background: linear-gradient(135deg, var(--brand-green) 0%, #43a047 20%, var(--brand-yellow) 60%, var(--brand-orange) 85%, var(--brand-orange2) 100%);
      padding: 28px 30px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      position: relative;
      border-bottom: 6px solid #000;
      min-height: 130px;
    }
    
    .header-left {
      flex: 0 0 260px;
      display: flex;
      align-items: center;
      justify-content: center;
      background: #fff;
      border-radius: var(--radius-l);
      padding: 18px 20px;
      box-shadow: var(--shadow-2);
      border: 3px solid #fff;
    }
    
    .logo-image {
      max-width: 100%;
      max-height: 110px;
      object-fit: contain;
    }
    
    .logo-placeholder {
      font-size: 18px;
      font-weight: bold;
      color: #228B22;
      text-align: center;
    }
    
    .header-center {
      flex: 1;
      text-align: center;
      padding: 0 24px;
    }

    .brand-title {
      font-size: 64px;
      color: #ffffff;
      font-weight: 900;
      letter-spacing: 3px;
      text-shadow: 0 4px 10px rgba(0,0,0,0.45);
      line-height: 1.05;
      margin-bottom: 8px;
    }

    .attraction-pill {
      display: inline-block;
      background: rgba(255,255,255,0.9);
      color: #1a1a1a;
      border: 3px solid #000;
      padding: 8px 18px;
      border-radius: 28px;
      font-weight: 900;
      font-size: 18px;
      box-shadow: 0 6px 12px rgba(0,0,0,0.25);
    }
    
    .header-right {
      flex: 0 0 460px; /* little wider for readability */
      display: flex;
      align-items: center;
      justify-content: flex-end;
    }

    .weekly-banner {
      width: 100%;
      background: var(--brand-yellow);
      border: 4px solid #000;
      border-radius: var(--radius-xl);
      padding: 12px 22px;
      box-shadow: var(--shadow-3);
    }

    .weekly-title {
      font-size: 40px;
      font-weight: 900;
      letter-spacing: 1px;
      color: #111;
      text-align: center;
    }

    .weekly-divider {
      height: 3px;
      background: #000;
      margin: 10px 0 8px;
      border-radius: 2px;
    }

    .weekly-dates {
      font-size: 20px;
      font-weight: 800;
      color: #111;
      text-align: center;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      white-space: nowrap;
    }
    
    /* sale-badge replaced by weekly-banner */
    
    .header h1 { display: none; }
    
    /* date-range moved into weekly-banner as .weekly-dates */
    
    .products-grid {
      display: grid;
      grid-template-columns: repeat(var(--grid-cols), 1fr);
      gap: 16px;
      padding: 24px;
      background: #ffffff;
    }
    
    .product-card {
      border: 2px solid #e8e8e8;
      padding: 12px 12px 14px;
      text-align: center;
      background: #fff;
      transition: transform 0.25s ease, box-shadow 0.25s ease;
      border-radius: var(--radius-m);
      position: relative;
      min-height: 260px;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      box-shadow: var(--shadow-1);
    }
    
    .product-card.featured {
      border: 2px solid #FFD700;
      background: #FFFACD;
      box-shadow: 0 4px 12px rgba(255, 215, 0, 0.3);
      transform: none;
    }
    
    .product-card:hover {
      transform: translateY(-8px) scale(1.03);
      box-shadow: 0 10px 25px rgba(0,0,0,0.15);
    }
    
    .product-image-container {
      width: 100%;
      height: 120px;
      display: flex;
      align-items: center;
      justify-content: center;
      margin-bottom: 10px;
      background: #f9f9f9;
      border-radius: var(--radius-s);
      overflow: hidden;
    }
    
    .product-image {
      max-width: 100%;
      max-height: 100%;
      object-fit: contain;
      border-radius: 6px;
    }
    
    .no-image-placeholder {
      width: 100%;
      height: 100%;
      background: linear-gradient(135deg, #e0e0e0 0%, #f5f5f5 100%);
      display: flex;
      align-items: center;
      justify-content: center;
      color: #999;
      font-size: 14px;
      border-radius: 6px;
    }
    
    .product-name {
      font-size: 20px;
      font-weight: 900;
      margin: 6px 0;
      color: #1a1a1a;
      line-height: 1.2;
      min-height: 48px; /* reserve space for 2 lines */
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
      overflow: hidden;
    }
    
    .product-price {
      font-size: 26px;
      font-weight: 900;
      color: #fff;
      background: #000;
      padding: 8px 12px;
      border-radius: 8px;
      display: inline-block;
      margin-top: 6px;
      box-shadow: 0 2px 0 rgba(0,0,0,0.25);
      border: 2px solid #000;
      min-width: 110px;
      letter-spacing: 0.2px;
    }
    
    /* Alternate price colors by COLUMN (5-column grid): odd columns black, even columns yellow */
    .product-card:nth-child(5n+1) .product-price,
    .product-card:nth-child(5n+3) .product-price,
    .product-card:nth-child(5n+5) .product-price {
      background: #000;
      color: #fff;
      border-color: #000;
    }
    .product-card:nth-child(5n+2) .product-price,
    .product-card:nth-child(5n+4) .product-price {
      background: #ffd54f;
      color: #000;
      border-color: #ffd54f;
    }
    
    .product-unit {
      font-size: 14px;
      color: #4f4f4f;
      margin-top: 4px;
      font-weight: 800;
    }

    /* Push price/unit section to the bottom for perfect row alignment */
    .product-card > div:last-child {
      margin-top: auto;
    }
    
    .special-offer-badge {
      position: absolute;
      top: -10px;
      right: -10px;
      background: red;
      color: white;
      padding: 8px 15px;
      font-size: 13px;
      font-weight: bold;
      border-radius: 20px;
      box-shadow: 0 4px 8px rgba(0,0,0,0.3);
      transform: rotate(10deg);
      z-index: 10;
    }
    
    .footer {
      background: #000;
      color: #fff;
      padding: 26px 24px 30px;
      text-align: center;
      margin-top: 0;
      border-top: 0;
    }

    .footer-promo {
      margin: 10px 10px 18px;
      padding: 14px 18px;
      background: #fff;
      border: 4px solid #000;
      border-radius: 16px;
      display: grid;
      grid-template-columns: 1fr 3fr 1fr;
      align-items: center;
      gap: 12px;
    }

    .footer-promo img {
      width: 100%;
      height: 120px;
      object-fit: contain;
    }

    .footer-promo-text {
      font-size: 40px;
      font-weight: 900;
      line-height: 1.15;
      color: #111;
    }

    .cash-pill {
      display: inline-block;
      margin: 16px auto 18px;
      padding: 10px 26px;
      background: #111;
      color: #fff;
      border: 3px solid #fff;
      border-radius: 40px;
      font-size: 26px;
      font-weight: 900;
      box-shadow: 0 6px 12px rgba(0,0,0,0.25);
    }

    .contact-bar {
      display: grid;
      grid-template-columns: 1fr 1fr 1fr;
      gap: 14px;
      margin: 8px 0 18px;
    }

    .contact-item {
      background: transparent;
      border: 0;
      border-radius: 0;
      padding: 0 18px;
      font-weight: 900;
      font-size: 22px;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 10px;
      color: #fff;
    }

    .accept-banner {
      background: #ffd54f;
      color: #111;
      font-size: 40px;
      font-weight: 900;
      padding: 12px 22px;
      margin: 6px auto 12px;
      border-radius: 10px;
      border: 0;
      letter-spacing: 1px;
      max-width: 1120px;
    }
    
    .special-offer-section {
      background: white;
      border: 3px solid #000;
      margin: 20px;
      padding: 20px;
      text-align: center;
      border-radius: 8px;
    }
    
    .special-offer-title {
      font-size: 24px;
      font-weight: bold;
      color: #000;
      margin-bottom: 10px;
    }
    
    .special-offer-subtitle {
      font-size: 16px;
      color: #666;
      margin-bottom: 15px;
    }
    
    .footer-highlight {
      background: #FFD93D;
      color: #000;
      font-size: 20px;
      font-weight: bold;
      padding: 12px 25px;
      margin: 15px 0;
      border-radius: 5px;
    }
    
    .footer-info {
      font-size: 15px;
      margin: 8px 0;
      line-height: 1.6;
    }
    
    .footer-disclaimer {
      font-size: 13px;
      margin-top: 10px;
      opacity: 0.9;
      line-height: 1.6;
      color: #fff;
    }
  </style>
</head>
<body>
  <div class="header">
    <div class="header-left">
      {{#if logoImageData}}
      <img src="{{logoImageData}}" alt="Star Bazaar Logo" class="logo-image" />
      {{else}}
      <div class="logo-placeholder">
        ⭐ STAR BAZAAR ⭐<br>
        <small style="font-size: 12px; color: #666;">Logo Not Found</small>
      </div>
      {{/if}}
    </div>

    <div class="header-center">
      <div class="brand-title">STAR<br>BAZAAR</div>
      <div class="attraction-pill">{{attractionText}}</div>
    </div>

    <div class="header-right">
      <div class="weekly-banner">
        <div class="weekly-title">{{saleTitle}}</div>
        <div class="weekly-divider"></div>
        <div class="weekly-dates">{{dateRange}}</div>
      </div>
    </div>
  </div>
  
  <div class="products-grid">
    {{#each products}}
    <div class="product-card">
      <div class="product-image-container">
        {{#if imageData}}
        <img src="{{imageData}}" alt="{{name}}" class="product-image" />
        {{else}}
        <div class="no-image-placeholder">📦</div>
        {{/if}}
      </div>
      
      <div class="product-name">{{name}}</div>
      <div>
        <div class="product-price">{{price}}</div>
        {{#if unit}}
        <div class="product-unit">{{unit}}</div>
        {{/if}}
      </div>
    </div>
    {{/each}}
  </div>
  
  <div class="footer">
    <div class="footer-promo">
      <div>
        {{#if leftPromoImageData}}
        <img src="{{leftPromoImageData}}" alt="Promo Left" />
        {{/if}}
      </div>
      <div class="footer-promo-text">{{footerPromoText}}</div>
      <div>
        {{#if rightPromoImageData}}
        <img src="{{rightPromoImageData}}" alt="Promo Right" />
        {{/if}}
      </div>
    </div>

    <div class="cash-pill">{{cashText}}</div>

    <div class="contact-bar">
      <div class="contact-item">📍 {{address}}</div>
      <div class="contact-item">📧 {{email}}</div>
      <div class="contact-item">📞 {{phone}}</div>
    </div>

    <div class="accept-banner">{{acceptBannerText}}</div>

    <div class="footer-disclaimer">
      • NO RAIN CHECKS • WE ARE NOT RESPONSIBLE FOR ANY TYPOGRAPHICAL ERRORS<br>
      • WE RESERVE THE RIGHT TO LIMIT THE QUANTITY • SALE VALID AT THIS LOCATION ONLY
    </div>
  </div>
</body>
</html>
    `;
  }

  getSaleTitle(templateType) {
    const titles = {
      'diwali': 'DIWALI DHAMAKA SALE',
      'weekly': 'WEEKLY SPECIAL',
      'anniversary': 'ANNIVERSARY SALE',
      'thanksgiving': 'THANKSGIVING SALE',
      'newyear': 'NEW YEAR SALE'
    };
    return titles[templateType] || 'SPECIAL OFFERS';
  }

  getDateRange() {
    const now = new Date();
    const endDate = new Date(now);
    endDate.setDate(endDate.getDate() + 7);
    
    const options = { month: 'long', day: 'numeric' };
    return `${now.toLocaleDateString('en-US', options)} TO ${endDate.toLocaleDateString('en-US', options)}`;
  }
}
