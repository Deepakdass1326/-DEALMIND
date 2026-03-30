import { motion } from 'framer-motion';

const ChatBubble = ({ message, type, offer, counterOffer, index }) => {
  const isPlayer = type === 'player';

  return (
    <motion.div
      initial={{ opacity: 0, y: 15, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ delay: index * 0.05, duration: 0.3 }}
      className={`flex mb-3 px-1 ${isPlayer ? 'justify-end' : 'justify-start'}`}
    >
      <div
        className={`max-w-[80%] text-sm leading-relaxed border ${
          isPlayer
            ? 'rounded-tl-2xl rounded-tr-2xl rounded-bl-2xl rounded-br-sm bg-gradient-to-br from-[#a1cca5] to-white text-black font-medium border-none shadow-md'
            : 'rounded-tl-2xl rounded-tr-2xl rounded-br-2xl rounded-bl-sm bg-[#111111] text-white border-white/5 font-normal shadow-md'
        }`}
        style={{ padding: '12px 16px', wordBreak: 'break-word', overflowWrap: 'break-word' }}
      >
        {/* Action tag */}
        {isPlayer && message?.action && (
          <div className="text-[0.65rem] font-bold uppercase tracking-widest opacity-70 mb-1">
            {message.action}
          </div>
        )}

        {/* Message text */}
        <div>{typeof message === 'string' ? message : message?.message || message?.action}</div>

        {/* Offer amount */}
        {(offer || message?.offer) && (
          <div 
            className={`mt-2 rounded-lg font-mono font-bold text-base ${
              isPlayer ? 'bg-black/15 text-black' : 'bg-[#a1cca5]/10 text-[#a1cca5]'
            }`}
            style={{ padding: '6px 12px', marginTop: '8px' }}
          >
            ₹{(offer || message?.offer)?.toLocaleString('en-IN')}
          </div>
        )}

        {/* Counter offer */}
        {counterOffer && !isPlayer && (
          <div 
            className="rounded-lg bg-white/10 font-mono font-bold text-base text-white"
            style={{ padding: '6px 12px', marginTop: '8px' }}
          >
            Counter: ₹{counterOffer?.toLocaleString('en-IN')}
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default ChatBubble;