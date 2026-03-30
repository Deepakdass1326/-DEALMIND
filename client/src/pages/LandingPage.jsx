import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { FiTarget, FiZap, FiTrendingUp, FiUsers, FiArrowRight, FiShield, FiCpu, FiMessageSquare } from 'react-icons/fi';

const LandingPage = () => {
  const { isAuthenticated } = useSelector((state) => state.auth);

  return (
    <div className="relative min-h-screen bg-[#000000] text-white overflow-x-hidden font-sans">
      
      <div className="stars-bg"></div>

      {/* ── Hero Section ── */}
      <section className="relative flex flex-col items-center justify-center overflow-hidden" style={{ minHeight: 'calc(100vh - 72px)', padding: '80px 20px 96px' }}>

        {/* Glowing orb */}
        <div
          className="absolute rounded-full pointer-events-none"
          style={{
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: 600,
            height: 600,
            background: 'radial-gradient(circle, rgba(16,185,129,0.5) 0%, rgba(6,182,212,0.3) 30%, rgba(225,29,72,0.2) 60%, transparent 80%)',
            filter: 'blur(80px)',
          }}
        />

        <div className="relative z-10 mx-auto flex w-full flex-col items-center text-center" style={{ maxWidth: 960 }}>

          {/* Heading */}
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="font-black tracking-tight"
            style={{ fontSize: 'clamp(3rem, 8vw, 5.5rem)', lineHeight: 1.05, marginBottom: 24 }}
          >
            Master the art of AI Negotiation.
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-[#888]"
            style={{ maxWidth: 520, fontSize: 'clamp(1rem, 2vw, 1.15rem)', lineHeight: 1.6, marginBottom: 40 }}
          >
            Negotiate with intelligent AI sellers. Use psychology, strategy, and timing to outsmart the bot and secure the best possible deal.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="flex flex-wrap items-center justify-center"
            style={{ gap: 16 }}
          >
            <Link
              to={isAuthenticated ? '/game' : '/register'}
              className="inline-flex items-center justify-center rounded-full bg-[#a1cca5] text-black font-semibold no-underline transition-colors hover:bg-[#8bb58f]"
              style={{ padding: '14px 32px', fontSize: '1rem', gap: 8 }}
            >
              Start Negotiating
            </Link>
            <Link
              to="/leaderboard"
              className="inline-flex items-center justify-center rounded-full border border-white/20 bg-transparent text-white font-medium no-underline transition-colors hover:bg-white/5"
              style={{ padding: '14px 32px', fontSize: '1rem', gap: 8 }}
            >
              View Leaderboard ↗
            </Link>
          </motion.div>
        </div>
      </section>

      {/* ── Subtitle Break Section ── */}
      <section className="relative z-10 w-full flex justify-center" style={{ padding: '80px 20px 120px' }}>
        <div style={{ maxWidth: 960 }}>
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="font-medium tracking-tight text-white"
            style={{ fontSize: 'clamp(2rem, 5vw, 3.2rem)', lineHeight: 1.3 }}
          >
            We're a specialized AI simulator platform{' '}
            <span
              className="inline-flex items-center justify-center rounded-full bg-[#0a0a0a] border border-white/10 align-middle"
              style={{ padding: '4px 16px', fontSize: '1.5rem' }}
            >
              🤖
            </span>{' '}
            We turn players Into master{' '}
            <span
              className="inline-flex items-center justify-center rounded-full bg-[#0a0a0a] border border-white/10 align-middle"
              style={{ padding: '4px 16px', fontSize: '1.5rem' }}
            >
              ⚡
            </span>{' '}
            dealmakers.
          </motion.h2>
        </div>
      </section>

      {/* ── How it works Bento Grid ── */}
      <section className="relative z-10 w-full flex justify-center" style={{ padding: '0 20px 96px' }}>
        <div style={{ width: '100%', maxWidth: 1200 }}>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            style={{ marginBottom: 48 }}
          >
            <h2 className="font-medium tracking-tight text-[#a1cca5]" style={{ fontSize: 'clamp(2rem, 4vw, 3rem)' }}>
              How it works
            </h2>
          </motion.div>

          <div
            className="grid grid-cols-1 md:grid-cols-3"
            style={{ gap: 16 }}
          >
            {/* Box 1 */}
            <BentoBox delay={0}>
              <div
                className="rounded-xl border border-white/5 bg-[#050505] flex items-center justify-center w-full"
                style={{ height: 120, marginBottom: 24 }}
              >
                <div className="flex bg-[#000] rounded-full border border-white/5" style={{ padding: 6, gap: 8 }}>
                  <div className="rounded-full bg-[#a1cca5] text-black font-bold" style={{ padding: '8px 20px', fontSize: '0.75rem', boxShadow: '0 0 10px rgba(161,204,165,0.3)' }}>Greedy</div>
                  <div className="rounded-full text-[#888] font-medium" style={{ padding: '8px 20px', fontSize: '0.75rem' }}>Emotional</div>
                </div>
              </div>
              <div style={{ marginTop: 'auto' }}>
                <h3 className="font-medium text-white" style={{ fontSize: '1.25rem', marginBottom: 12 }}>01. Face Unique AI Bots</h3>
                <p className="text-[#888]" style={{ fontSize: '0.95rem', lineHeight: 1.6 }}>
                  Every seller has a hidden personality profile. You might face a logical bot one round, and a highly emotional seller the next.
                </p>
              </div>
            </BentoBox>

            {/* Box 2 */}
            <BentoBox delay={0.1}>
              <div
                className="rounded-xl border border-white/5 bg-[#050505] flex items-center justify-center flex-wrap w-full"
                style={{ height: 120, marginBottom: 24, padding: '0 32px', gap: 16 }}
              >
                <div className="text-[#666] hover:text-white transition-colors cursor-pointer"><FiTrendingUp size={22} /></div>
                <div className="text-[#666] hover:text-white transition-colors cursor-pointer"><FiShield size={22} /></div>
                <div className="text-[#666] hover:text-white transition-colors cursor-pointer"><FiMessageSquare size={22} /></div>
                <div className="text-[#a1cca5]" style={{ filter: 'drop-shadow(0 0 8px rgba(161,204,165,0.4))' }}><FiZap size={22} /></div>
              </div>
              <div style={{ marginTop: 'auto' }}>
                <h3 className="font-medium text-white" style={{ fontSize: '1.25rem', marginBottom: 12 }}>02. Strategic Actions</h3>
                <p className="text-[#888]" style={{ fontSize: '0.95rem', lineHeight: 1.6 }}>
                  Don't just offer numbers. Build rapport, justify your price with logical reasoning, or bluff to force the AI into a corner.
                </p>
              </div>
            </BentoBox>

            {/* Box 3 */}
            <BentoBox delay={0.2}>
              <div
                className="overflow-hidden rounded-xl border border-white/5 bg-[#050505] flex items-center w-full"
                style={{ height: 120, marginBottom: 24, padding: 20 }}
              >
                <div className="w-full">
                  <div className="flex justify-between text-[#666]" style={{ fontSize: '0.75rem', marginBottom: 8 }}>
                    <span>Trust Meter</span><span>75%</span>
                  </div>
                  <div className="w-full overflow-hidden rounded-full bg-white/5" style={{ height: 6 }}>
                    <div className="h-full rounded-full" style={{ width: '75%', background: 'linear-gradient(to right, transparent, #a1cca5)' }} />
                  </div>
                </div>
              </div>
              <div style={{ marginTop: 'auto' }}>
                <h3 className="font-medium text-white" style={{ fontSize: '1.25rem', marginBottom: 12 }}>03. Real-time Dynamics</h3>
                <p className="text-[#888]" style={{ fontSize: '0.95rem', lineHeight: 1.6 }}>
                  Watch the bot's trust and patience meters shift in real-time based on your actions. Push too hard, and they'll walk away.
                </p>
              </div>
            </BentoBox>

            {/* Box 4 */}
            <BentoBox delay={0.3}>
              <div
                className="rounded-xl border border-white/5 bg-[#050505] flex flex-col justify-center w-full relative"
                style={{ height: 160, marginBottom: 24, padding: '0 24px', gap: 20 }}
              >
                <div className="absolute font-mono text-[#a1cca5]" style={{ top: 16, right: 16, fontSize: '0.75rem' }}>Round 4/10</div>
                <ProgressBar label="Time per round" value={80} />
                <ProgressBar label="Seller Flexibility" value={45} />
              </div>
              <div style={{ marginTop: 'auto' }}>
                <h3 className="font-medium text-white" style={{ fontSize: '1.25rem', marginBottom: 12 }}>04. Finite Rounds</h3>
                <p className="text-[#888]" style={{ fontSize: '0.95rem', lineHeight: 1.6 }}>
                  Deals must be closed within 10 rounds. You either strike a bargain, or walk away empty-handed.
                </p>
              </div>
            </BentoBox>

            {/* Box 5 (Wider span) */}
            <BentoBox delay={0.4} className="md:col-span-2 overflow-hidden relative">
              <div
                className="absolute rounded-full border border-white/5"
                style={{
                  right: '-5%',
                  bottom: '-40%',
                  width: 400,
                  height: 400,
                  background: 'linear-gradient(135deg, #0a0a0a, #204020)',
                  opacity: 0.3,
                  boxShadow: '0 0 100px rgba(161,204,165,0.1)',
                }}
              >
                <div className="absolute rounded-full border border-white/5" style={{ inset: 8 }} />
                <div className="absolute rounded-full border border-white/5" style={{ inset: 32 }} />
                <div
                  className="absolute rounded-full border border-[#a1cca5]/10"
                  style={{ inset: 64, background: 'radial-gradient(ellipse at top left, rgba(161,204,165,0.2), transparent)' }}
                />
              </div>

              <div className="relative z-10" style={{ maxWidth: '65%', paddingTop: 80, paddingBottom: 16 }}>
                <h3 className="font-medium text-white" style={{ fontSize: '1.5rem', marginBottom: 12 }}>05. Global Leaderboard</h3>
                <p className="text-[#888]" style={{ fontSize: '0.95rem', lineHeight: 1.6 }}>
                  Compare your final deal prices with players worldwide. Your score is based on how closely you squeeze the AI to its absolute minimum hidden price.
                </p>
              </div>
            </BentoBox>
          </div>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="border-t border-white/5 bg-[#000000]" style={{ padding: '40px 0' }}>
        <div className="mx-auto flex justify-between items-center text-[#555]" style={{ maxWidth: 1200, padding: '0 20px', fontSize: '0.75rem' }}>
          <p>© 2026 DEALMIND AI Negotiation.</p>
          <div style={{ display: 'flex', gap: 16 }}>
            <Link to="/leaderboard" className="hover:text-white transition no-underline text-[#555]">Leaderboard</Link>
            <Link to="/game" className="hover:text-white transition no-underline text-[#555]">Play</Link>
          </div>
        </div>
      </footer>
    </div>
  );
};

/* ── Sub-components ── */

const BentoBox = ({ children, delay, className = '' }) => (
  <motion.div
    initial={{ opacity: 0, y: 25 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ delay, duration: 0.5 }}
    className={`rounded-2xl border border-white/5 bg-[#0a0a0a] flex flex-col hover:bg-[#0c0c0c] hover:border-white/10 transition-all duration-300 ${className}`}
    style={{ padding: '32px 36px' }}
  >
    {children}
  </motion.div>
);

const ProgressBar = ({ label, value }) => (
  <div>
    <div className="text-[#666] font-medium tracking-wide" style={{ fontSize: '0.7rem', marginBottom: 8 }}>{label}</div>
    <div className="w-full overflow-hidden rounded-full bg-white/5" style={{ height: 6 }}>
      <div className="h-full rounded-full" style={{ width: `${value}%`, background: 'linear-gradient(to right, transparent, rgba(161,204,165,0.5), #a1cca5)' }} />
    </div>
  </div>
);

export default LandingPage;