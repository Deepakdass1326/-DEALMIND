import Game from '../models/Game.js';
import User from '../models/User.js';
import { getRandomPersonality, getPersonality } from '../services/sellerPersonality.js';
import {
  getRandomProduct,
  calculateTrustChange,
  calculatePatienceChange,
  calculateMood,
  calculateCounterOffer,
  shouldAcceptDeal,
  shouldRejectDeal,
  calculateScore,
} from '../services/gameEngine.js';
import { generateSellerResponse } from '../lib/gemini.js';

// @desc    Start a new game
// @route   POST /api/game/start
export const startGame = async (req, res) => {
  try {
    // Determine product — client can send a specific product, otherwise pick randomly
    let product;
    if (req.body.productId && req.body.productName && req.body.marketPrice) {
      const marketPrice = Number(req.body.marketPrice);
      product = {
        name: req.body.productName,
        askingPrice: marketPrice,
        targetPrice: Math.round(marketPrice * 0.75),
        minimumPrice: Math.round(marketPrice * 0.60),
      };
    } else {
      product = getRandomProduct();
    }

    const personalityType = getRandomPersonality();
    const personality = getPersonality(personalityType);

    const game = await Game.create({
      userId: req.user._id,
      productName: product.name,
      askingPrice: product.askingPrice,
      targetPrice: product.targetPrice,
      minimumPrice: product.minimumPrice,
      sellerPersonality: personalityType,
      trustLevel: personality.initialTrust,
      patienceLevel: personality.initialPatience,
      mood: personality.initialMood,
      currentRound: 0,
      maxRounds: 10,
      status: 'active',
    });

    // Generate opening message from AI
    let openingMessage;
    try {
      openingMessage = await generateSellerResponse(
        game,
        'greet',
        null,
        null,
        game.askingPrice,
        false,
        false,
      );
    } catch {
      openingMessage = `Welcome! I'm ${personality.name} ${personality.avatar}. I have a ${product.name} for sale at ₹${product.askingPrice}. What do you say?`;
    }

    res.status(201).json({
      success: true,
      data: {
        gameId: game._id,
        productName: game.productName,
        askingPrice: game.askingPrice,
        sellerName: personality.name,
        sellerAvatar: personality.avatar,
        sellerPersonality: personalityType,
        trustLevel: game.trustLevel,
        patienceLevel: game.patienceLevel,
        mood: game.mood,
        currentRound: game.currentRound,
        maxRounds: game.maxRounds,
        status: game.status,
        openingMessage,
      },
    });
  } catch (error) {
    console.error('Start game error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to start game.',
    });
  }
};

// @desc    Make a move in the game
// @route   POST /api/game/move
export const makeMove = async (req, res) => {
  try {
    const { gameId, action, message, offer } = req.body;

    if (!gameId || !action) {
      return res.status(400).json({
        success: false,
        message: 'gameId and action are required.',
      });
    }

    const validActions = ['offer', 'justify', 'rapport', 'delay', 'bluff', 'exit'];
    if (!validActions.includes(action)) {
      return res.status(400).json({
        success: false,
        message: `Invalid action. Must be one of: ${validActions.join(', ')}`,
      });
    }

    const game = await Game.findOne({ _id: gameId, userId: req.user._id });
    if (!game) {
      return res.status(404).json({
        success: false,
        message: 'Game not found.',
      });
    }

    if (game.status !== 'active') {
      return res.status(400).json({
        success: false,
        message: 'This game is already finished.',
      });
    }

    // Handle player exit
    if (action === 'exit') {
      game.status = 'player_exit';
      game.success = false;
      await game.save();

      return res.status(200).json({
        success: true,
        data: {
          gameId: game._id,
          aiResponse: "Fine, walk away then. You're missing out on a great deal!",
          status: 'player_exit',
          gameOver: true,
          success: false,
        },
      });
    }

    // Increment round
    game.currentRound += 1;

    // Calculate state changes
    const trustChange = calculateTrustChange(action, offer, game);
    const patienceChange = calculatePatienceChange(action, game);

    game.trustLevel = Math.max(0, Math.min(100, game.trustLevel + trustChange));
    game.patienceLevel = Math.max(0, Math.min(100, game.patienceLevel + patienceChange));

    const newMood = calculateMood(game.trustLevel, game.patienceLevel);
    const moodChange = newMood !== game.mood ? newMood : null;
    game.mood = newMood;

    // Check if seller walks away
    const sellerRejects = shouldRejectDeal(game);
    if (sellerRejects) {
      game.status = 'deal_rejected';
      game.success = false;

      const aiResponse = await generateSellerResponse(game, action, message, offer, null, false, true);

      game.moves.push({
        round: game.currentRound,
        playerAction: action,
        playerMessage: message,
        playerOffer: offer,
        aiResponse,
        aiCounterOffer: null,
        trustChange,
        moodChange: moodChange || game.mood,
        patienceChange,
      });

      await game.save();

      // Update user stats
      await User.findByIdAndUpdate(req.user._id, {
        $inc: { gamesPlayed: 1 },
      });

      return res.status(200).json({
        success: true,
        data: {
          gameId: game._id,
          aiResponse,
          status: 'deal_rejected',
          gameOver: true,
          success: false,
          trustLevel: game.trustLevel,
          patienceLevel: game.patienceLevel,
          mood: game.mood,
          currentRound: game.currentRound,
        },
      });
    }

    // Calculate counter offer (if player made an offer)
    let counterOffer = null;
    let dealAccepted = false;

    if (action === 'offer' && offer) {
      dealAccepted = shouldAcceptDeal(offer, game);

      if (dealAccepted) {
        game.finalPrice = offer;
        game.status = 'deal_reached';
        game.success = true;
        game.score = calculateScore(offer, game.minimumPrice, game.currentRound, game.maxRounds);
        counterOffer = offer;
      } else {
        counterOffer = calculateCounterOffer(offer, game);
      }
    } else {
      // For non-offer actions, keep current price
      const lastMove = game.moves[game.moves.length - 1];
      counterOffer = lastMove ? lastMove.aiCounterOffer || game.askingPrice : game.askingPrice;
    }

    // Check max rounds
    if (game.currentRound >= game.maxRounds && !dealAccepted) {
      game.status = 'max_rounds';
      game.success = false;
    }

    // Generate AI response
    const aiResponse = await generateSellerResponse(
      game, action, message, offer, counterOffer, dealAccepted,
      game.status === 'max_rounds',
    );

    // Record the move
    game.moves.push({
      round: game.currentRound,
      playerAction: action,
      playerMessage: message,
      playerOffer: offer,
      aiResponse,
      aiCounterOffer: counterOffer,
      trustChange,
      moodChange: moodChange || game.mood,
      patienceChange,
    });

    await game.save();

    // Update user stats if game ended
    if (game.status !== 'active') {
      const updateData = { $inc: { gamesPlayed: 1 } };
      if (game.success) {
        updateData.$inc.gamesWon = 1;
        updateData.$inc.totalSaved = game.askingPrice - game.finalPrice;

        // Update best score
        const user = await User.findById(req.user._id);
        if (game.score > user.bestScore) {
          updateData.bestScore = game.score;
        }
      }
      await User.findByIdAndUpdate(req.user._id, updateData);
    }

    res.status(200).json({
      success: true,
      data: {
        gameId: game._id,
        aiResponse,
        counterOffer,
        status: game.status,
        gameOver: game.status !== 'active',
        success: game.success,
        score: game.score,
        trustLevel: game.trustLevel,
        patienceLevel: game.patienceLevel,
        mood: game.mood,
        currentRound: game.currentRound,
        maxRounds: game.maxRounds,
        trustChange,
        patienceChange,
        moodChange,
        finalPrice: game.finalPrice,
      },
    });
  } catch (error) {
    console.error('Make move error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to process move.',
    });
  }
};

// @desc    Get game history for user
// @route   GET /api/game/history
export const getHistory = async (req, res) => {
  try {
    const games = await Game.find({ userId: req.user._id })
      .sort({ createdAt: -1 })
      .limit(20)
      .select('productName askingPrice finalPrice minimumPrice sellerPersonality status success score currentRound maxRounds createdAt');

    res.status(200).json({
      success: true,
      data: games,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch history.',
    });
  }
};

// @desc    Get a specific game details
// @route   GET /api/game/:id
export const getGameById = async (req, res) => {
  try {
    const game = await Game.findOne({
      _id: req.params.id,
      userId: req.user._id,
    });

    if (!game) {
      return res.status(404).json({
        success: false,
        message: 'Game not found.',
      });
    }

    const personality = getPersonality(game.sellerPersonality);

    res.status(200).json({
      success: true,
      data: {
        ...game.toObject(),
        sellerName: personality.name,
        sellerAvatar: personality.avatar,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch game.',
    });
  }
};
