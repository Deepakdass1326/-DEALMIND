import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchHistory } from '../store/gameSlice';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { FiClock, FiCheckCircle, FiXCircle, FiLoader, FiPlay } from 'react-icons/fi';

const personalityEmojis = {
  greedy: '🤑',
  emotional: '😊',
  logical: '🧠',
  impatient: '⚡',
};

const HistoryPage = () => {
  const dispatch = useDispatch();
  const { history, historyLoading } = useSelector((state) => state.game);

  useEffect(() => {
    dispatch(fetchHistory());
  }, [dispatch]);

  if (historyLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }}
        >
          <FiLoader size={40} className="text-[#a1cca5]" />
        </motion.div>
      </div>
    );
  }

  return (
    <div className="bg-[#000000]" style={{ minHeight: 'calc(100vh - 72px)', paddingTop: 40, paddingBottom: 64 }}>
      {/* Enforced centered container */}
      <div 
        className="flex flex-col items-center px-4 sm:px-6"
        style={{ width: '100%', maxWidth: 1000, margin: '0 auto' }}
      >

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col items-center text-center w-full"
          style={{ marginBottom: 40 }}
        >
          <div
            className="flex items-center justify-center rounded-2xl border border-[#a1cca5]/20"
            style={{ width: 64, height: 64, marginBottom: 20, background: 'rgba(161,204,165,0.08)' }}
          >
            <FiClock size={28} className="text-[#a1cca5]" />
          </div>
          <h1 className="font-extrabold tracking-tight text-white" style={{ fontSize: 'clamp(2rem, 5vw, 2.75rem)', lineHeight: 1.1, marginBottom: 12 }}>
            Game <span className="text-[#a1cca5]">History</span>
          </h1>
          <p className="text-[#888]" style={{ maxWidth: 480, fontSize: '1rem' }}>
            Your past negotiation sessions
          </p>
        </motion.div>

        {/* History Content Wrapper */}
        <div className="w-full flex justify-center">
          {history.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="mx-auto rounded-2xl border border-white/5 bg-[#050505] flex flex-col items-center text-center shadow-lg"
              style={{ padding: '64px 32px', maxWidth: 600 }}
            >
              <div style={{ fontSize: '3rem', marginBottom: 16, opacity: 0.8 }}>📋</div>
              <h3 className="font-bold text-white" style={{ fontSize: '1.25rem', marginBottom: 8 }}>No games yet</h3>
              <p className="text-[#888]" style={{ marginBottom: 24 }}>
                Start your first negotiation to see your history here.
              </p>
              <Link
                to="/game"
                className="inline-flex items-center rounded-xl bg-[#a1cca5] font-bold text-black no-underline transition-all duration-200 hover:bg-[#8bb58f]"
                style={{ padding: '12px 24px', gap: 8 }}
              >
                <FiPlay size={16} /> Play Now
              </Link>
            </motion.div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 w-full" style={{ gap: 20 }}>
            {history.map((game, index) => (
              <motion.div
                key={game._id}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.04 }}
                whileHover={{ y: -3 }}
                className="cursor-default rounded-2xl border bg-[#050505] shadow-md"
                style={{
                  padding: 24,
                  borderLeft: `4px solid ${game.success ? '#a1cca5' : 'rgba(239,68,68,0.8)'}`,
                  borderColor: `rgba(255,255,255,0.04)`,
                  borderLeftColor: game.success ? '#a1cca5' : 'rgba(239,68,68,0.8)',
                }}
              >
                {/* Top row */}
                <div className="flex items-start justify-between" style={{ marginBottom: 14 }}>
                  <div>
                    <div className="font-bold text-white" style={{ fontSize: '0.95rem', marginBottom: 4 }}>
                      {game.productName}
                    </div>
                    <div className="text-[#666]" style={{ fontSize: '0.75rem' }}>
                      {new Date(game.createdAt).toLocaleDateString('en-IN', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </div>
                  </div>
                  <div
                    className="flex items-center rounded-full font-bold"
                    style={{
                      padding: '4px 12px',
                      gap: 6,
                      fontSize: '0.75rem',
                      background: game.success ? 'rgba(161,204,165,0.1)' : 'rgba(239,68,68,0.1)',
                      color: game.success ? '#a1cca5' : '#ef4444',
                    }}
                  >
                    {game.success ? <FiCheckCircle size={13} /> : <FiXCircle size={13} />}
                    {game.success ? 'Deal' : 'No Deal'}
                  </div>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-3" style={{ gap: 10 }}>
                  {game.success && (
                    <MiniStat label="Score" value={`${game.score}/100`} color="#a1cca5" />
                  )}
                  <MiniStat label="Asking" value={`₹${game.askingPrice?.toLocaleString('en-IN')}`} color="#888" />
                  {game.finalPrice && (
                    <MiniStat label="Final" value={`₹${game.finalPrice?.toLocaleString('en-IN')}`} color="#fff" />
                  )}
                  <MiniStat label="Rounds" value={`${game.currentRound}/${game.maxRounds}`} color="#888" />
                  <MiniStat
                    label="Seller"
                    value={personalityEmojis[game.sellerPersonality] || '🤖'}
                    color="#ccc"
                  />
                </div>
              </motion.div>
            ))}
          </div>
        )}
        </div>
      </div>
    </div>
  );
};

const MiniStat = ({ label, value, color }) => (
  <div className="rounded-xl bg-[#0a0a0a] border border-white/5 text-center" style={{ padding: 10 }}>
    <div className="font-mono font-bold" style={{ fontSize: '0.85rem', color }}>
      {value}
    </div>
    <div className="font-semibold uppercase tracking-wider text-[#888]" style={{ fontSize: '0.6rem', marginTop: 2 }}>
      {label}
    </div>
  </div>
);

export default HistoryPage;