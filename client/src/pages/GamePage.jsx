import { useState, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { startGame, makeMove, addPlayerMessage, resetGame } from '../store/gameSlice';
import { motion, AnimatePresence } from 'framer-motion';
import SellerAvatar from '../components/SellerAvatar';
import TrustMeter from '../components/TrustMeter';
import ChatBubble from '../components/ChatBubble';
import ActionPanel from '../components/ActionPanel';
import GameOverModal from '../components/GameOverModal';
import { FiSend, FiPlay, FiLoader, FiShoppingBag } from 'react-icons/fi';
import toast from 'react-hot-toast';
import { getProductById } from '../data/products';

const GamePage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { currentGame, messages, isLoading, isMoveLoading, gameOver, error } = useSelector((state) => state.game);
  const [selectedAction, setSelectedAction] = useState(null);
  const [offerAmount, setOfferAmount] = useState('');
  const [messageText, setMessageText] = useState('');
  const [selectedProduct, setSelectedProduct] = useState(null);
  const chatEndRef = useRef(null);

  // Read productId from URL — auto-start game with that product
  useEffect(() => {
    const productId = searchParams.get('productId');
    if (productId) {
      const product = getProductById(productId);
      if (product) {
        setSelectedProduct(product);
        dispatch(resetGame());
        dispatch(startGame({ productId: product.id, name: product.name, marketPrice: product.marketPrice }));
      } else {
        // Unknown productId — go back to store
        navigate('/store');
      }
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (error) toast.error(error);
  }, [error]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleStartGame = () => {
    dispatch(resetGame());
    dispatch(startGame());
  };

  const handleSendAction = () => {
    if (!selectedAction || !currentGame) return;

    if (selectedAction.id === 'offer') {
      const offer = Number(offerAmount);
      if (!offer || offer <= 0) {
        toast.error('Please enter a valid offer amount');
        return;
      }
      dispatch(addPlayerMessage({
        action: 'offer',
        message: messageText || `I'll offer ₹${offer.toLocaleString('en-IN')}`,
        offer,
      }));
      dispatch(makeMove({
        gameId: currentGame.gameId,
        action: 'offer',
        message: messageText || `I'll offer ₹${offer.toLocaleString('en-IN')}`,
        offer,
      }));
    } else if (selectedAction.id === 'justify' && !messageText.trim()) {
      toast.error('Please enter your justification message');
      return;
    } else {
      dispatch(addPlayerMessage({
        action: selectedAction.id,
        message: messageText || selectedAction.label,
      }));
      dispatch(makeMove({
        gameId: currentGame.gameId,
        action: selectedAction.id,
        message: messageText || undefined,
      }));
    }

    setSelectedAction(null);
    setOfferAmount('');
    setMessageText('');
  };

  // No game started - show start screen
  if (!currentGame && !isLoading) {
    // If came from store with a productId, show loading (auto-start in progress via useEffect)
    const productId = searchParams.get('productId');
    if (productId) {
      return (
        <div className="flex min-h-screen items-center justify-center">
          <motion.div animate={{ rotate: 360 }} transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }}>
            <FiLoader size={40} className="text-[#a1cca5]" />
          </motion.div>
        </div>
      );
    }

    return (
      <div className="flex min-h-screen items-center justify-center" style={{ padding: 20 }}>
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="w-full rounded-2xl border border-white/5 bg-[#050505] text-center shadow-2xl"
          style={{ maxWidth: 500, padding: '64px 40px' }}
        >
          <motion.div
            animate={{ y: [0, -8, 0] }}
            transition={{ duration: 3, repeat: Infinity }}
            style={{ fontSize: '4rem', marginBottom: 24 }}
          >
            🎯
          </motion.div>
          <h1 className="font-extrabold" style={{ fontSize: '2rem', marginBottom: 12 }}>
            Ready to{' '}
            <span className="bg-gradient-to-r from-[#a1cca5] to-white bg-clip-text text-transparent">
              Negotiate
            </span>
            ?
          </h1>
          <p className="text-[#999]" style={{ fontSize: '0.95rem', marginBottom: 8 }}>
            Pick a product from the store or start with a random one.
          </p>
          <p className="text-[#666]" style={{ fontSize: '0.85rem', marginBottom: 36 }}>
            Each seller has a unique personality. Adapt your strategy to get the best deal!
          </p>
          <div className="flex flex-col items-center gap-3">
            <button
              onClick={handleStartGame}
              className="inline-flex items-center rounded-xl bg-[#a1cca5] font-bold text-black transition-all duration-200 hover:bg-[#8bb58f]"
              style={{ padding: '16px 40px', fontSize: '1.1rem', gap: 10, boxShadow: '0 0 30px rgba(161,204,165,0.15)' }}
            >
              <FiPlay size={20} />
              Random Game
            </button>
            <button
              onClick={() => navigate('/store')}
              className="inline-flex items-center rounded-xl border border-white/10 bg-white/5 font-semibold text-white transition-all duration-200 hover:border-white/20 hover:bg-white/10"
              style={{ padding: '13px 32px', fontSize: '0.95rem', gap: 8 }}
            >
              <FiShoppingBag size={17} />
              Choose from Store
            </button>
          </div>
        </motion.div>
      </div>
    );
  }


  // Loading
  if (isLoading) {
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
    <div className="flex flex-col flex-1 bg-[#000000] overflow-hidden" style={{ minHeight: 'calc(100vh - 96px)', width: '100%' }}>
      <div 
        className="flex flex-1 flex-col md:grid overflow-hidden gap-6 md:grid-cols-[250px_1fr]"
        style={{ maxWidth: 1536, width: '100%', margin: '0 auto', padding: '6px 16px 16px 16px' }}
      >

        {/* Left Sidebar */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex flex-col overflow-hidden"
          style={{ gap: 10, height: '100%', maxHeight: 'calc(100vh - 118px)' }}
        >
          {/* Seller Avatar Card */}
          <div className="rounded-2xl border border-white/5 bg-[#050505] text-center shadow-lg" style={{ padding: 12 }}>
            <SellerAvatar
              personality={currentGame?.sellerPersonality}
              mood={currentGame?.mood}
              name={currentGame?.sellerName}
              avatar={currentGame?.sellerAvatar}
            />
          </div>

          {/* Product Info Card */}
          <div className="rounded-2xl border border-white/5 bg-[#050505] shadow-lg overflow-hidden flex flex-col" style={{ flex: 1, minHeight: 200 }}>
            {/* Top half - Image */}
            <div className="relative w-full flex-1" style={{ minHeight: 80 }}>
              {selectedProduct?.image ? (
                <img
                  src={selectedProduct.image}
                  alt={selectedProduct?.name}
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="h-full w-full bg-[#0a0a0a] flex items-center justify-center">
                  <FiShoppingBag size={24} className="text-[#333]" />
                </div>
              )}
              {/* Dark subtle gradient overlay to blend perfectly into bottom content */}
              <div
                className="absolute inset-0"
                style={{
                  background: 'linear-gradient(to top, #050505 0%, transparent 60%)',
                }}
              />
            </div>

            {/* Bottom half - Content */}
            <div className="flex flex-col" style={{ padding: '0px 14px 12px 14px', backgroundColor: '#050505', zIndex: 1, marginTop: -6 }}>
              {/* Category */}
              <div
                style={{
                  fontSize: '0.55rem',
                  fontWeight: 700,
                  letterSpacing: '0.1em',
                  textTransform: 'uppercase',
                  color: '#a1cca5',
                  marginBottom: 2,
                }}
              >
                {selectedProduct?.category || 'Product'}
              </div>

              {/* Product Name */}
              <div
                style={{
                  fontSize: '0.85rem',
                  fontWeight: 700,
                  color: '#ffffff',
                  lineHeight: 1.2,
                  marginBottom: 8,
                }}
              >
                {currentGame?.productName || selectedProduct?.name}
              </div>

              {/* Price row */}
              <div className="flex items-center justify-between mt-auto">
                <div>
                  <div style={{ fontSize: '0.6rem', color: '#888', marginBottom: 2 }}>Market Price</div>
                  <div style={{ fontFamily: 'monospace', fontWeight: 800, fontSize: '0.95rem', color: '#f59e0b' }}>
                    ₹{(currentGame?.askingPrice || selectedProduct?.marketPrice || 0).toLocaleString('en-IN')}
                  </div>
                </div>
                <div className="text-right">
                  <div style={{ fontSize: '0.6rem', color: '#555', marginBottom: 2 }}>
                    {currentGame?.counterOffer && currentGame.counterOffer !== currentGame.askingPrice
                      ? 'Seller Now'
                      : 'Target Deal'}
                  </div>
                  <div style={{ fontFamily: 'monospace', fontWeight: 700, fontSize: '0.85rem', color: '#a1cca5' }}>
                    ₹{(
                      currentGame?.counterOffer && currentGame.counterOffer !== currentGame.askingPrice
                        ? currentGame.counterOffer
                        : selectedProduct?.targetPrice || 0
                    ).toLocaleString('en-IN')}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Meters */}
          <div className="flex flex-col rounded-2xl border border-white/5 bg-[#050505] shadow-lg" style={{ padding: 12, gap: 12 }}>
            <TrustMeter value={currentGame?.trustLevel} label="Trust" />
            <TrustMeter value={currentGame?.patienceLevel} label="Patience" />
          </div>

          {/* Round Counter */}
          <div 
            className="flex items-center justify-between rounded-2xl border border-white/5 bg-[#050505] shadow-lg" 
            style={{ padding: '10px 14px', marginTop: 'auto' }}
          >
            <span className="font-semibold uppercase tracking-wider text-[#666]" style={{ fontSize: '0.75rem' }}>
              Round
            </span>
            <span className={`font-mono font-extrabold ${
              currentGame?.currentRound >= 8 ? 'text-red-500' : 'text-[#a1cca5]'
            }`} style={{ fontSize: '1.1rem' }}>
              {currentGame?.currentRound || 0}/{currentGame?.maxRounds || 10}
            </span>
          </div>
        </motion.div>

        {/* Right Side - Chat & Actions */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex flex-col"
          style={{ gap: 16, height: '100%', maxHeight: 'calc(100vh - 118px)', overflow: 'hidden' }}
        >
          {/* Chat Area */}
          <div className="flex flex-1 flex-col overflow-y-auto rounded-2xl border border-white/5 bg-[#050505] shadow-lg [&::-webkit-scrollbar]:w-[4px] [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-[#222] [&::-webkit-scrollbar-thumb]:rounded-full" style={{ padding: 20, scrollbarWidth: 'thin', scrollbarColor: '#222 transparent' }}>
            <div className="flex-1">
              {messages.map((msg, i) => (
                <ChatBubble
                  key={i}
                  message={msg.type === 'player' ? msg : msg.message}
                  type={msg.type}
                  offer={msg.offer}
                  counterOffer={msg.counterOffer}
                  index={i}
                />
              ))}
              {isMoveLoading && (
                <div className="flex items-center" style={{ padding: '16px 20px', gap: 6 }}>
                  {[0, 0.2, 0.4].map((delay, idx) => (
                    <motion.div
                      key={idx}
                      animate={{ opacity: [0.3, 1, 0.3] }}
                      transition={{ duration: 1.2, repeat: Infinity, delay }}
                      className="rounded-full bg-[#666]"
                      style={{ width: 8, height: 8 }}
                    />
                  ))}
                </div>
              )}
              <div ref={chatEndRef} />
            </div>
          </div>

          {/* Actions Panel */}
          {!gameOver && (
            <div className="rounded-2xl border border-white/5 bg-[#050505] shadow-lg" style={{ padding: 20 }}>
              <ActionPanel
                disabled={isMoveLoading || gameOver}
                selectedAction={selectedAction}
                onSelect={setSelectedAction}
              />

              {/* Input area */}
              <AnimatePresence>
                {selectedAction && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="overflow-hidden"
                  >
                    <div className="flex flex-col" style={{ marginTop: 14, gap: 10 }}>
                      {selectedAction.needsOffer && (
                        <div className="relative">
                          <span
                            className="absolute font-bold text-[#a1cca5]"
                            style={{ left: 14, top: '50%', transform: 'translateY(-50%)', fontSize: '1rem' }}
                          >
                            ₹
                          </span>
                          <input
                            type="number"
                            value={offerAmount}
                            onChange={(e) => setOfferAmount(e.target.value)}
                            placeholder="Enter your offer amount"
                            className="w-full rounded-xl border border-white/5 bg-[#0a0a0a] font-mono font-semibold text-white outline-none transition-all duration-200 focus:border-[#a1cca5]/40 focus:bg-[#111]"
                            style={{ padding: '14px 18px 14px 34px', fontSize: '0.95rem' }}
                          />
                        </div>
                      )}
                      <div className="flex flex-col sm:flex-row" style={{ gap: 10 }}>
                        <input
                          type="text"
                          value={messageText}
                          onChange={(e) => setMessageText(e.target.value)}
                          placeholder={
                            selectedAction.id === 'justify' ? "Why should I lower the price?" :
                            selectedAction.id === 'rapport'  ? "Say something nice..." :
                            selectedAction.id === 'bluff'    ? "I saw a better deal..." :
                            "Add a message (optional)"
                          }
                          className="flex-1 rounded-xl border border-white/5 bg-[#0a0a0a] text-white outline-none transition-all duration-200 focus:border-[#a1cca5]/40 focus:bg-[#111]"
                          style={{ padding: '14px 18px', fontSize: '0.95rem' }}
                          onKeyDown={(e) => e.key === 'Enter' && handleSendAction()}
                        />
                        <button
                          onClick={handleSendAction}
                          disabled={isMoveLoading}
                          className="flex items-center justify-center whitespace-nowrap rounded-xl bg-[#a1cca5] font-bold text-black transition-all duration-200 hover:bg-[#8bb58f] disabled:opacity-50"
                          style={{ padding: '14px 24px', gap: 8 }}
                        >
                          <FiSend size={16} />
                          Send
                        </button>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )}
        </motion.div>
      </div>

      {/* Game Over Modal */}
      {gameOver && (
        <GameOverModal
          game={currentGame}
          onPlayAgain={handleStartGame}
        />
      )}
    </div>
  );
};

export default GamePage;