import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchLeaderboard } from '../store/gameSlice';
import { motion } from 'framer-motion';
import { FiAward, FiTrendingUp, FiLoader } from 'react-icons/fi';

const personalityEmojis = {
  greedy: '🤑',
  emotional: '😊',
  logical: '🧠',
  impatient: '⚡',
};

const LeaderboardPage = () => {
  const dispatch = useDispatch();
  const { leaderboard, leaderboardLoading } = useSelector((state) => state.game);
  const { user } = useSelector((state) => state.auth);

  useEffect(() => {
    dispatch(fetchLeaderboard());
  }, [dispatch]);

  if (leaderboardLoading) {
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
        style={{ width: '100%', maxWidth: 800, margin: '0 auto' }}
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
            <FiAward size={28} className="text-[#a1cca5]" />
          </div>
          <h1 className="font-extrabold tracking-tight text-white" style={{ fontSize: 'clamp(2rem, 5vw, 2.75rem)', lineHeight: 1.1, marginBottom: 12 }}>
            Global Leaderboard
          </h1>
          <p className="text-[#888]" style={{ maxWidth: 480, fontSize: '1rem' }}>
            Top negotiators ranked by their best scores
          </p>
        </motion.div>

        {/* Leaderboard Table Width Wrapper */}
        <div className="w-full">
          {leaderboard.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="rounded-2xl border border-white/5 bg-[#050505] flex flex-col items-center text-center shadow-lg"
              style={{ padding: '64px 32px' }}
            >
              <div style={{ fontSize: '3rem', marginBottom: 16, opacity: 0.8 }}>🏆</div>
              <h3 className="font-bold text-white" style={{ fontSize: '1.25rem', marginBottom: 8 }}>No scores yet</h3>
              <p className="text-[#888]">
                Be the first to complete a negotiation and claim the top spot!
              </p>
            </motion.div>
          ) : (
          <div className="overflow-hidden rounded-2xl border border-white/5 bg-[#050505] shadow-xl">
            {/* Table Header */}
            <div
              className="grid border-b border-white/5 bg-[#0a0a0a] font-bold uppercase tracking-widest text-[#888]"
              style={{
                gridTemplateColumns: '50px 1fr 70px',
                padding: '16px 24px',
                fontSize: '0.7rem',
              }}
            >
              <span>Rank</span>
              <span>Player</span>
              <span>Score</span>
            </div>

            {/* Rows */}
            {leaderboard.map((entry, index) => (
              <motion.div
                key={entry.userId || index}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.03 }}
                className="grid items-center border-b border-white/5 transition-colors duration-200"
                style={{
                  gridTemplateColumns: '50px 1fr 70px',
                  padding: '16px 24px',
                  background: user?.id === entry.userId ? 'rgba(161,204,165,0.05)' : '#050505',
                }}
              >
                {/* Rank */}
                <span className={`font-extrabold ${
                  entry.rank === 1 ? 'text-[#f59e0b]'
                  : entry.rank === 2 ? 'text-slate-300'
                  : entry.rank === 3 ? 'text-[#a1cca5]'
                  : 'text-[#666]'
                }`} style={{ fontSize: entry.rank <= 3 ? '1.1rem' : '0.9rem' }}>
                  {entry.rank <= 3 ? ['🥇', '🥈', '🥉'][entry.rank - 1] : `#${entry.rank}`}
                </span>

                {/* Player name */}
                <div className="flex items-center" style={{ gap: 10 }}>
                  <div
                    className="flex items-center justify-center rounded-lg bg-[#0a0a0a] border border-white/5 font-bold uppercase text-[#a1cca5]"
                    style={{ width: 32, height: 32, fontSize: '0.7rem' }}
                  >
                    {entry.name?.charAt(0)}
                  </div>
                  <span className="text-sm font-semibold text-white">
                    {entry.name}
                    {user?.id === entry.userId && (
                      <span
                        className="rounded-full font-bold text-[#a1cca5]"
                        style={{ marginLeft: 8, padding: '2px 8px', fontSize: '0.65rem', background: 'rgba(161,204,165,0.1)' }}
                      >
                        YOU
                      </span>
                    )}
                  </span>
                </div>

                {/* Score */}
                <span className="font-mono font-bold text-[#a1cca5]">
                  {entry.bestScore}
                </span>
              </motion.div>
            ))}
          </div>
        )}
        </div>

        {/* Score Formula Info */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex items-center rounded-2xl border border-white/5 bg-[#050505] shadow-lg"
          style={{ marginTop: 24, padding: '24px 32px', gap: 20 }}
        >
          <div className="rounded-full shrink-0" style={{ padding: 12, background: 'rgba(161,204,165,0.1)' }}>
            <FiTrendingUp size={20} className="text-[#a1cca5]" />
          </div>
          <div>
            <div className="font-bold text-white" style={{ fontSize: '0.9rem', marginBottom: 4 }}>
              Scoring Formula
            </div>
            <div className="text-[#888]" style={{ fontSize: '0.8rem' }}>
              <code
                className="rounded-md font-mono text-[#a1cca5] bg-[#0a0a0a] border border-white/5"
                style={{ padding: '4px 10px' }}
              >
                Score = (Min Price / Final Price) × 100 + Efficiency Bonus
              </code>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default LeaderboardPage;