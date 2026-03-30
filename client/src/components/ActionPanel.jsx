import { motion } from 'framer-motion';
import { FiDollarSign, FiMessageCircle, FiHeart, FiClock, FiZap, FiLogOut } from 'react-icons/fi';

const actions = [
  { id: 'offer', label: 'Make Offer', icon: <FiDollarSign size={20} />, color: '#a1cca5', description: 'Submit an offer', needsOffer: true },
  { id: 'justify', label: 'Justify', icon: <FiMessageCircle size={20} />, color: '#818cf8', description: 'Give a reason', needsMessage: true },
  { id: 'rapport', label: 'Rapport', icon: <FiHeart size={20} />, color: '#f472b6', description: 'Build connection' },
  { id: 'delay', label: 'Delay', icon: <FiClock size={20} />, color: '#fbbf24', description: 'Stall for time' },
  { id: 'bluff', label: 'Bluff', icon: <FiZap size={20} />, color: '#67e8f9', description: 'Fake alternatives' },
  { id: 'exit', label: 'Walk Away', icon: <FiLogOut size={20} />, color: '#f87171', description: 'End negotiation' },
];

const ActionPanel = ({ onAction, disabled, selectedAction, onSelect }) => {
  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(3, 1fr)',
        gap: 12,
      }}
    >
      {actions.map((action, i) => {
        const isSelected = selectedAction?.id === action.id;
        return (
          <motion.button
            key={action.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            whileHover={{ scale: 1.03, y: -2 }}
            whileTap={{ scale: 0.97 }}
            disabled={disabled}
            onClick={() => onSelect(action)}
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              height: 80,
              padding: 10,
              borderRadius: 12,
              border: isSelected ? `2px solid ${action.color}` : '1px solid transparent',
              background: isSelected ? `${action.color}15` : '#0a0a0a',
              cursor: disabled ? 'not-allowed' : 'pointer',
              opacity: disabled ? 0.5 : 1,
              transition: 'all 0.2s ease',
              fontFamily: 'Inter, sans-serif',
            }}
          >
            <div style={{ color: action.color, marginBottom: 4 }}>{action.icon}</div>
            <span style={{
              fontSize: '0.75rem',
              fontWeight: 600,
              textAlign: 'center',
              lineHeight: 1.2,
              color: isSelected ? action.color : '#888',
            }}>
              {action.label}
            </span>
          </motion.button>
        );
      })}
    </div>
  );
};

export { actions };
export default ActionPanel;
