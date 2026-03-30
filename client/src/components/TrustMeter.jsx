import { motion } from 'framer-motion';

const getTheme = (val) => {
  if (val >= 70) return { text: 'text-[#10b981]', hex: '#10b981', bar: 'from-[#10b981]/80 to-[#10b981]' };
  if (val >= 40) return { text: 'text-[#f59e0b]', hex: '#f59e0b', bar: 'from-[#f59e0b]/80 to-[#f59e0b]' };
  if (val >= 20) return { text: 'text-[#f97316]', hex: '#f97316', bar: 'from-[#f97316]/80 to-[#f97316]' };
  return       { text: 'text-[#ef4444]', hex: '#ef4444', bar: 'from-[#ef4444]/80 to-[#ef4444]' };
};

const TrustMeter = ({ value = 50, label = 'Trust' }) => {
  const theme = getTheme(value);

  return (
    <div className="w-full">
      <div className="mb-1.5 flex items-center justify-between">
        <span className="text-[0.75rem] font-semibold uppercase tracking-wider text-gray-400">
          {label}
        </span>
        <span className={`font-mono text-[0.8rem] font-bold ${theme.text}`}>
          {Math.round(value)}%
        </span>
      </div>

      <div className="h-2 w-full overflow-hidden rounded-full bg-white/10">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${Math.max(0, Math.min(100, value))}%` }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          className={`h-full rounded-full bg-gradient-to-r ${theme.bar}`}
          style={{ boxShadow: `0 0 12px ${theme.hex}40` }}
        />
      </div>
    </div>
  );
};

export default TrustMeter;