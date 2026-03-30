import mongoose from 'mongoose';

const moveSchema = new mongoose.Schema({
  round: Number,
  playerAction: {
    type: String,
    enum: ['offer', 'justify', 'rapport', 'delay', 'bluff', 'exit'],
  },
  playerMessage: String,
  playerOffer: Number,
  aiResponse: String,
  aiCounterOffer: Number,
  trustChange: Number,
  moodChange: String,
  patienceChange: Number,
  timestamp: { type: Date, default: Date.now },
});

const gameSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  // Product info
  productName: {
    type: String,
    default: 'Premium Wireless Headphones',
  },
  // Pricing
  askingPrice: {
    type: Number,
    required: true,
  },
  targetPrice: {
    type: Number,
    required: true,
  },
  minimumPrice: {
    type: Number,
    required: true,
  },
  finalPrice: {
    type: Number,
    default: null,
  },
  // Seller state
  sellerPersonality: {
    type: String,
    enum: ['greedy', 'emotional', 'logical', 'impatient'],
    required: true,
  },
  trustLevel: {
    type: Number,
    default: 50,
    min: 0,
    max: 100,
  },
  patienceLevel: {
    type: Number,
    default: 100,
    min: 0,
    max: 100,
  },
  mood: {
    type: String,
    enum: ['happy', 'neutral', 'cautious', 'annoyed', 'angry'],
    default: 'neutral',
  },
  // Game state
  currentRound: {
    type: Number,
    default: 0,
  },
  maxRounds: {
    type: Number,
    default: 10,
  },
  status: {
    type: String,
    enum: ['active', 'deal_reached', 'deal_rejected', 'max_rounds', 'player_exit'],
    default: 'active',
  },
  success: {
    type: Boolean,
    default: false,
  },
  score: {
    type: Number,
    default: 0,
  },
  // Conversation history
  moves: [moveSchema],
}, {
  timestamps: true,
});

// Calculate score before saving completed games
gameSchema.pre('save', function () {
  if (this.status !== 'active' && this.finalPrice && this.success) {
    // Score = (minimumPrice / finalPrice) * 100, capped at 100
    this.score = Math.min(100, Math.round((this.minimumPrice / this.finalPrice) * 100));
  }
});

const Game = mongoose.model('Game', gameSchema);
export default Game;
