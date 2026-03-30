import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import { FiShoppingBag, FiSearch, FiZap, FiTag } from 'react-icons/fi';
import { PRODUCTS } from '../data/products';

const CATEGORIES = ['All', ...Array.from(new Set(PRODUCTS.map((p) => p.category)))];

const containerVariants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.07 },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 28, scale: 0.97 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { type: 'spring', stiffness: 260, damping: 22 },
  },
};

const StorePage = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useSelector((state) => state.auth);
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');

  const handleNegotiate = (product) => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    navigate(`/game?productId=${product.id}`);
  };

  const filtered = PRODUCTS.filter((p) => {
    const matchesSearch =
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.description.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = activeCategory === 'All' || p.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div
      className="relative min-h-screen bg-[#000000]"
      style={{ paddingTop: 40, paddingBottom: 80 }}
    >
      {/* Background glow */}
      <div
        className="pointer-events-none fixed"
        style={{
          top: '10%',
          left: '50%',
          transform: 'translateX(-50%)',
          width: 700,
          height: 400,
          background:
            'radial-gradient(ellipse, rgba(161,204,165,0.06) 0%, transparent 70%)',
          filter: 'blur(80px)',
          zIndex: 0,
        }}
      />

      {/* Container specifically with inline styles to override any bugs */}
      <div
        className="relative z-10 px-4 sm:px-6 md:px-8"
        style={{ maxWidth: 1200, width: '100%', margin: '0 auto' }}
      >
        {/* ── Header ── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', marginBottom: '40px' }}
        >
          <div
            className="flex items-center justify-center rounded-2xl border border-[#a1cca5]/20"
            style={{
              width: 64,
              height: 64,
              marginBottom: 20,
              background: 'rgba(161,204,165,0.08)',
            }}
          >
            <FiShoppingBag size={26} className="text-[#a1cca5]" />
          </div>
          <h1
            className="font-extrabold tracking-tight text-white"
            style={{
              fontSize: 'clamp(2rem, 5vw, 2.75rem)',
              lineHeight: 1.1,
              marginBottom: 16,
            }}
          >
            Product{' '}
            <span className="bg-gradient-to-r from-[#a1cca5] to-white bg-clip-text text-transparent">
              Store
            </span>
          </h1>
          <p className="text-[#888]" style={{ maxWidth: 480, fontSize: '1rem', lineHeight: 1.5, margin: '0 auto' }}>
            Pick a product and negotiate the best deal with our AI seller.<br/>Your skills decide the price!
          </p>
        </motion.div>

        {/* ── Search + Filter Bar ── */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, delay: 0.1 }}
          style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '20px', marginBottom: '40px' }}
        >
          {/* Search */}
          <div
            className="flex flex-1 items-center rounded-xl border border-white/8 bg-[#050505] transition-all duration-200 focus-within:border-[#a1cca5]/30"
            style={{ padding: '12px 16px', gap: 10, minWidth: 0 }}
          >
            <FiSearch size={16} className="shrink-0 text-[#555]" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search products..."
              className="flex-1 bg-transparent text-white outline-none"
              style={{ fontSize: '0.9rem' }}
            />
          </div>

          {/* Category Pills */}
          <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '10px' }}>
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className="rounded-full border font-medium transition-all duration-200"
                style={{
                  padding: '7px 16px',
                  fontSize: '0.8rem',
                  background:
                    activeCategory === cat
                      ? 'rgba(161,204,165,0.15)'
                      : 'transparent',
                  borderColor:
                    activeCategory === cat
                      ? 'rgba(161,204,165,0.5)'
                      : 'rgba(255,255,255,0.08)',
                  color: activeCategory === cat ? '#a1cca5' : '#777',
                }}
              >
                {cat}
              </button>
            ))}
          </div>
        </motion.div>

        {/* ── Product Grid ── */}
        {filtered.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col items-center justify-center rounded-2xl border border-white/5 bg-[#050505] text-center"
            style={{ padding: '80px 32px' }}
          >
            <div style={{ fontSize: '3rem', marginBottom: 16 }}>🔍</div>
            <h3 className="font-bold text-white" style={{ fontSize: '1.2rem', marginBottom: 8 }}>
              No products found
            </h3>
            <p className="text-[#666]" style={{ fontSize: '0.9rem' }}>
              Try a different search or category.
            </p>
          </motion.div>
        ) : (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid"
            style={{
              gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
              gap: 20,
            }}
          >
            {filtered.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onNegotiate={handleNegotiate}
              />
            ))}
          </motion.div>
        )}

        {/* ── Stats bar ── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mt-12 flex flex-wrap items-center justify-center gap-6 rounded-2xl border border-white/5 bg-[#050505]"
          style={{ padding: '20px 32px' }}
        >
          <StatItem icon={<FiZap size={16} />} label="AI Sellers" value="4 Personalities" />
          <div className="h-6 w-px bg-white/10" />
          <StatItem icon={<FiTag size={16} />} label="Products" value={`${PRODUCTS.length} Items`} />
          <div className="h-6 w-px bg-white/10" />
          <StatItem icon={<FiShoppingBag size={16} />} label="Max Rounds" value="10 Rounds" />
        </motion.div>
      </div>
    </div>
  );
};

/* ── Product Card ── */
const ProductCard = ({ product, onNegotiate }) => {
  const [imgError, setImgError] = useState(false);
  const maxDiscount = Math.round(((product.marketPrice - product.minimumPrice) / product.marketPrice) * 100);

  return (
    <motion.div
      variants={cardVariants}
      whileHover={{ y: -4, transition: { duration: 0.2 } }}
      className="group relative flex flex-col overflow-hidden rounded-2xl border border-white/5 bg-[#050505] shadow-xl transition-all duration-300"
      style={{ cursor: 'default' }}
    >
      {/* Category badge */}
      <div className="absolute left-3 top-3 z-10">
        <span
          className="rounded-full font-semibold uppercase tracking-wider text-[#a1cca5]"
          style={{
            padding: '4px 10px',
            fontSize: '0.65rem',
            background: 'rgba(0,0,0,0.75)',
            border: '1px solid rgba(161,204,165,0.2)',
            backdropFilter: 'blur(8px)',
          }}
        >
          {product.category}
        </span>
      </div>

      {/* Max discount badge */}
      <div className="absolute right-3 top-3 z-10">
        <span
          className="rounded-full font-bold text-emerald-400"
          style={{
            padding: '4px 10px',
            fontSize: '0.65rem',
            background: 'rgba(0,0,0,0.75)',
            border: '1px solid rgba(52,211,153,0.2)',
            backdropFilter: 'blur(8px)',
          }}
        >
          Up to {maxDiscount}% off
        </span>
      </div>

      {/* Product Image */}
      <div
        className="relative overflow-hidden bg-[#0a0a0a]"
        style={{ height: 200 }}
      >
        {!imgError ? (
          <img
            src={product.image}
            alt={product.name}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
            onError={() => setImgError(true)}
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center">
            <FiShoppingBag size={48} className="text-[#333]" />
          </div>
        )}
        {/* Image overlay gradient */}
        <div
          className="absolute inset-0"
          style={{
            background: 'linear-gradient(to top, #050505 0%, transparent 50%)',
          }}
        />
      </div>

      {/* Card Content */}
      <div className="flex flex-1 flex-col" style={{ padding: '20px 20px 24px' }}>
        <h2
          className="font-bold text-white"
          style={{ fontSize: '1rem', marginBottom: 6, lineHeight: 1.3 }}
        >
          {product.name}
        </h2>
        <p
          className="flex-1 text-[#666]"
          style={{ fontSize: '0.83rem', lineHeight: 1.55, marginBottom: 18 }}
        >
          {product.description}
        </p>

        {/* Price block */}
        <div
          className="mb-4 flex items-center justify-between rounded-xl bg-white/3 border border-white/5"
          style={{ padding: '12px 14px' }}
        >
          <div>
            <div className="text-[#555]" style={{ fontSize: '0.7rem', marginBottom: 2 }}>
              Market Price
            </div>
            <div
              className="font-mono font-extrabold text-[#f59e0b]"
              style={{ fontSize: '1.15rem' }}
            >
              ₹{product.marketPrice.toLocaleString('en-IN')}
            </div>
          </div>
          <div className="text-right">
            <div className="text-[#555]" style={{ fontSize: '0.7rem', marginBottom: 2 }}>
              Target Price
            </div>
            <div
              className="font-mono font-bold text-[#a1cca5]"
              style={{ fontSize: '0.95rem' }}
            >
              ₹{product.targetPrice.toLocaleString('en-IN')}
            </div>
          </div>
        </div>

        {/* Negotiate Button */}
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => onNegotiate(product)}
          id={`negotiate-${product.id}`}
          className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#a1cca5] font-bold text-black transition-all duration-200 hover:bg-[#8bb58f]"
          style={{ padding: '13px 0', fontSize: '0.95rem' }}
        >
          <FiZap size={16} />
          Negotiate Now
        </motion.button>
      </div>
    </motion.div>
  );
};

/* ── Stat Item ── */
const StatItem = ({ icon, label, value }) => (
  <div className="flex items-center gap-3">
    <div className="text-[#a1cca5]">{icon}</div>
    <div>
      <div className="font-bold text-white" style={{ fontSize: '0.85rem' }}>{value}</div>
      <div className="text-[#555]" style={{ fontSize: '0.7rem' }}>{label}</div>
    </div>
  </div>
);

export default StorePage;
