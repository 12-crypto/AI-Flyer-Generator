// agents/layoutAgent.js
export class LayoutAgent {
  constructor() {
    this.name = 'Layout';
  }

  async generateLayout(products, layoutPlan) {
    console.log('📐 Layout Agent: Arranging products...');

    const grid = layoutPlan.grid || { columns: 5, rows: Math.ceil(products.length / 5) };
    const arranged = [];

    let row = 0, col = 0;
    
    for (const product of products) {
      arranged.push({
        ...product,
        position: { row, col },
        featured: layoutPlan.featuredProducts?.includes(product.name) || false
      });

      col++;
      if (col >= grid.columns) {
        col = 0;
        row++;
      }
    }

    console.log(`✅ Layout Agent: Arranged ${arranged.length} products in ${grid.columns}x${grid.rows} grid`);
    
    return {
      grid,
      products: arranged,
      colorScheme: layoutPlan.colorScheme || { primary: '#FFD700', secondary: '#000000' }
    };
  }

  async optimizeLayout(layout) {
    // Move featured/special offers to prominent positions
    const featured = layout.products.filter(p => p.specialOffer || p.featured);
    const regular = layout.products.filter(p => !p.specialOffer && !p.featured);

    let row = 0, col = 0;
    const optimized = [...featured, ...regular].map(product => {
      const newProduct = { ...product, position: { row, col } };
      col++;
      if (col >= layout.grid.columns) {
        col = 0;
        row++;
      }
      return newProduct;
    });

    console.log('✅ Layout optimized: Featured offers at top');
    
    return {
      ...layout,
      products: optimized
    };
  }
}
