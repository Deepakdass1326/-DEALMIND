/**
 * DealMind AI — Product Catalog
 * targetPrice  = marketPrice * 0.75  (AI tries to get this)
 * minimumPrice = marketPrice * 0.60  (AI's floor — never revealed to buyer)
 */

export const PRODUCTS = [
  {
    id: 'sony-headphones',
    name: 'Sony WH-1000XM5 Headphones',
    shortName: 'Sony Headphones',
    description: 'Industry-leading noise cancellation with 30-hour battery life and premium audio quality.',
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&q=80',
    category: 'Electronics',
    marketPrice: 29999,
    targetPrice: Math.round(29999 * 0.75),
    minimumPrice: Math.round(29999 * 0.60),
  },
  {
    id: 'nike-shoes',
    name: 'Nike Air Max 270 Sneakers',
    shortName: 'Nike Shoes',
    description: 'Lightweight React foam midsole with Max Air unit for all-day comfort and street-ready style.',
    image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&q=80',
    category: 'Footwear',
    marketPrice: 12999,
    targetPrice: Math.round(12999 * 0.75),
    minimumPrice: Math.round(12999 * 0.60),
  },
  {
    id: 'office-chair',
    name: 'Ergonomic Pro Office Chair',
    shortName: 'Office Chair',
    description: 'Lumbar support, adjustable armrests, breathable mesh back — designed for marathon work sessions.',
    image: 'https://images.unsplash.com/photo-1596162954151-cdcb4c0f70a8?w=600&q=80',
    category: 'Furniture',
    marketPrice: 18999,
    targetPrice: Math.round(18999 * 0.75),
    minimumPrice: Math.round(18999 * 0.60),
  },
  {
    id: 'samsung-monitor',
    name: 'Samsung 27" 4K Curved Monitor',
    shortName: 'Samsung Monitor',
    description: '144Hz refresh rate, 1ms response time, HDR600 — the ultimate display for work and gaming.',
    image: 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=600&q=80',
    category: 'Electronics',
    marketPrice: 34999,
    targetPrice: Math.round(34999 * 0.75),
    minimumPrice: Math.round(34999 * 0.60),
  },
  {
    id: 'coffee-maker',
    name: 'De\'Longhi Espresso Machine',
    shortName: 'Coffee Maker',
    description: 'Barista-grade espresso at home. 15-bar pressure, built-in grinder, and milk frother included.',
    image: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=600&q=80',
    category: 'Kitchen',
    marketPrice: 8999,
    targetPrice: Math.round(8999 * 0.75),
    minimumPrice: Math.round(8999 * 0.60),
  },
  {
    id: 'canon-camera',
    name: 'Canon EOS R6 Mark II Camera',
    shortName: 'Canon Camera',
    description: '40fps burst shooting, 6K RAW video, and IBIS stabilization. The photographer\'s dream mirrorless.',
    image: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=600&q=80',
    category: 'Photography',
    marketPrice: 54999,
    targetPrice: Math.round(54999 * 0.75),
    minimumPrice: Math.round(54999 * 0.60),
  },
  {
    id: 'apple-watch',
    name: 'Apple Watch Series 9',
    shortName: 'Apple Watch',
    description: 'Double tap gesture, blood oxygen monitoring, crash detection and always-on Retina display.',
    image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&q=80',
    category: 'Wearables',
    marketPrice: 41999,
    targetPrice: Math.round(41999 * 0.75),
    minimumPrice: Math.round(41999 * 0.60),
  },
  {
    id: 'gaming-laptop',
    name: 'ASUS ROG Gaming Laptop',
    shortName: 'Gaming Laptop',
    description: 'RTX 4070 GPU, Intel i9 processor, 165Hz QHD display with per-key RGB lighting.',
    image: 'https://images.unsplash.com/photo-1603302576837-37561b2e2302?w=600&q=80',
    category: 'Computers',
    marketPrice: 124999,
    targetPrice: Math.round(124999 * 0.75),
    minimumPrice: Math.round(124999 * 0.60),
  },
  {
    id: 'leather-bag',
    name: 'Premium Leather Messenger Bag',
    shortName: 'Leather Bag',
    description: 'Full-grain Italian leather, laptop compartment up to 15", handcrafted with solid brass hardware.',
    image: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=600&q=80',
    category: 'Accessories',
    marketPrice: 7999,
    targetPrice: Math.round(7999 * 0.75),
    minimumPrice: Math.round(7999 * 0.60),
  },
  {
    id: 'mechanical-keyboard',
    name: 'Keychron Q1 Pro Keyboard',
    shortName: 'Mechanical Keyboard',
    description: 'Wireless QMK/VIA mechanical keyboard with hot-swappable switches and aluminum body.',
    image: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=600&q=80',
    category: 'Accessories',
    marketPrice: 15999,
    targetPrice: Math.round(15999 * 0.75),
    minimumPrice: Math.round(15999 * 0.60),
  },
];

/**
 * Find product by ID
 */
export const getProductById = (id) => PRODUCTS.find((p) => p.id === id) || null;

export default PRODUCTS;
