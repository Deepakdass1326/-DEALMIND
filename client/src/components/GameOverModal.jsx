import { motion, AnimatePresence } from 'framer-motion';
import { FiCheckCircle, FiXCircle, FiAward, FiTrendingDown } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';

const GameOverModal = ({ game, onPlayAgain }) => {
  const navigate = useNavigate();
  const isWin = game?.success;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[200] flex items-center justify-center bg-[#000000]/85 p-5 backdrop-blur-[10px]"
      >
        <motion.div
          initial={{ scale: 0.8, opacity: 0, y: 30 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          transition={{ type: 'spring', damping: 20, stiffness: 200 }}
          className="w-full max-w-[440px] rounded-[1.25rem] border border-white/5 bg-[#050505] px-8 py-10 text-center shadow-2xl"
        >
          {/* Icon */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: 'spring' }}
            className={`mx-auto mb-5 flex h-20 w-20 items-center justify-center rounded-full ${
              isWin ? 'bg-[#a1cca5]/15' : 'bg-red-500/15'
            }`}
          >
            {isWin ? (
              <FiCheckCircle size={40} className="text-[#a1cca5]" />
            ) : (
              <FiXCircle size={40} className="text-red-500" />
            )}
          </motion.div>

          {/* Title */}
          <h2 className={`mb-2 text-[1.8rem] font-medium tracking-tight ${
            isWin ? 'text-[#a1cca5]' : 'text-red-500'
          }`}>
            {isWin ? 'Deal Closed!' : 'No Deal'}
          </h2>

          <p className="mb-6 text-sm text-[#888888]">
            {isWin
              ? 'Great negotiation! You secured a deal.'
              : game?.status === 'deal_rejected'
                ? 'The seller walked away from the negotiation.'
                : game?.status === 'max_rounds'
                  ? 'You ran out of rounds.'
                  : 'You chose to walk away.'}
          </p>

          {/* Stats Grid */}
          <div className="mb-7 grid grid-cols-2 gap-3">
            {isWin && (
              <>
                <StatCard
                  icon={<FiAward size={18} />}
                  label="Score"
                  value={`${game?.score || 0}/100`}
                  colorClass="text-[#a1cca5] border-white/5 bg-[#0a0a0a]"
                />
                <StatCard
                  icon={<FiTrendingDown size={18} />}
                  label="You Saved"
                  value={`₹${((game?.askingPrice || 0) - (game?.finalPrice || 0)).toLocaleString('en-IN')}`}
                  colorClass="text-white border-white/5 bg-[#0a0a0a]"
                />
                <StatCard
                  label="Final Price"
                  value={`₹${(game?.finalPrice || 0).toLocaleString('en-IN')}`}
                  colorClass="text-gray-300 border-white/5 bg-[#0a0a0a]"
                />
                <StatCard
                  label="Asking Was"
                  value={`₹${(game?.askingPrice || 0).toLocaleString('en-IN')}`}
                  colorClass="text-[#888888] border-white/5 bg-[#0a0a0a]"
                />
              </>
            )}
            {!isWin && (
              <>
                <StatCard
                  label="Rounds Played"
                  value={game?.currentRound || 0}
                  colorClass="text-white border-white/5 bg-[#0a0a0a]"
                />
                <StatCard
                  label="Product"
                  value={game?.productName?.split(' ').slice(0, 2).join(' ') || 'N/A'}
                  colorClass="text-[#888888] border-white/5 bg-[#0a0a0a]"
                  small
                />
              </>
            )}
          </div>

          {/* Actions */}
          <div className="flex flex-col gap-3">
            <div className="flex gap-3">
              <button
                className="flex-1 rounded-xl bg-[#a1cca5] py-3 font-semibold text-black transition-all duration-200 hover:bg-[#8bb58f]"
                onClick={onPlayAgain}
              >
                Play Again
              </button>
              <button
                className="flex-1 rounded-xl border border-white/10 bg-white/5 py-3 font-semibold text-white transition-all duration-200 hover:border-white/20 hover:bg-white/10"
                onClick={() => navigate('/leaderboard')}
              >
                Leaderboard
              </button>
            </div>
            <button
              className="w-full rounded-xl border border-[#a1cca5]/20 bg-[#a1cca5]/5 py-3 font-semibold text-[#a1cca5] transition-all duration-200 hover:bg-[#a1cca5]/10"
              onClick={() => navigate('/store')}
            >
              🛍️ Browse Store
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

const StatCard = ({ icon, label, value, colorClass, small }) => (
  <div className={`rounded-xl border p-3.5 ${colorClass}`}>
    {icon && <div className="mb-1">{icon}</div>}
    <div className={`font-mono font-bold ${small ? 'text-[0.8rem]' : 'text-[1.1rem]'}`}>
      {value}
    </div>
    <div className="mt-0.5 text-[0.7rem] font-medium text-gray-500">
      {label}
    </div>
  </div>
);

export default GameOverModal;