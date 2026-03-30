import { motion } from 'framer-motion';

const moodConfig = {
  happy:    { emoji: '😊', hex: '#10b981', label: 'Happy',   bg: 'bg-[#10b981]/10', text: 'text-[#10b981]', border: 'border-[#10b981]/40', from: 'from-[#10b981]/10' },
  neutral:  { emoji: '😐', hex: '#6366f1', label: 'Neutral', bg: 'bg-[#6366f1]/10', text: 'text-[#6366f1]', border: 'border-[#6366f1]/40', from: 'from-[#6366f1]/10' },
  cautious: { emoji: '🤨', hex: '#f59e0b', label: 'Cautious',bg: 'bg-[#f59e0b]/10', text: 'text-[#f59e0b]', border: 'border-[#f59e0b]/40', from: 'from-[#f59e0b]/10' },
  annoyed:  { emoji: '😤', hex: '#f97316', label: 'Annoyed', bg: 'bg-[#f97316]/10', text: 'text-[#f97316]', border: 'border-[#f97316]/40', from: 'from-[#f97316]/10' },
  angry:    { emoji: '😡', hex: '#ef4444', label: 'Angry',   bg: 'bg-[#ef4444]/10', text: 'text-[#ef4444]', border: 'border-[#ef4444]/40', from: 'from-[#ef4444]/10' },
};

const SellerAvatar = ({ personality, mood = 'neutral', name, avatar }) => {
  const moodData = moodConfig[mood] || moodConfig.neutral;

  return (
    <motion.div
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      className="flex flex-col items-center gap-3"
    >
      {/* Avatar Circle */}
      <motion.div
        animate={{
          boxShadow: `0 0 30px ${moodData.hex}30, 0 0 60px ${moodData.hex}10`,
        }}
        transition={{ duration: 1, repeat: Infinity, repeatType: 'reverse' }}
        className={`relative flex h-[90px] w-[90px] items-center justify-center rounded-full border-2 bg-gradient-to-br to-[#050505] text-[2.5rem] ${moodData.from} ${moodData.border}`}
      >
        <motion.span
          key={mood}
          initial={{ scale: 0.5, rotate: -20 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: 'spring', stiffness: 300 }}
        >
          {avatar || moodData.emoji}
        </motion.span>

        {/* Mood indicator dot */}
        <motion.div
          animate={{ scale: [1, 1.3, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="absolute bottom-0.5 right-0.5 h-[18px] w-[18px] rounded-full border-[3px] border-[#050505]"
          style={{ backgroundColor: moodData.hex }}
        />
      </motion.div>

      {/* Name & Mood */}
      <div className="text-center">
        <div className="text-base font-bold text-white">
          {name || 'AI Seller'}
        </div>
        <motion.div
          key={mood}
          initial={{ opacity: 0, y: 5 }}
          animate={{ opacity: 1, y: 0 }}
          className={`mt-0.5 inline-block rounded-full px-2.5 py-0.5 text-[0.75rem] font-semibold ${moodData.text} ${moodData.bg}`}
        >
          {moodData.emoji} {moodData.label}
        </motion.div>
      </div>
    </motion.div>
  );
};

export default SellerAvatar;