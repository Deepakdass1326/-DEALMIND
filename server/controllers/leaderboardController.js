import Game from '../models/Game.js';
import User from '../models/User.js';

// @desc    Get global leaderboard
// @route   GET /api/leaderboard
export const getLeaderboard = async (req, res) => {
  try {
    const limit = Math.min(parseInt(req.query.limit) || 50, 100);

    // Get top games by score
    const topGames = await Game.aggregate([
      { $match: { success: true, score: { $gt: 0 } } },
      { $sort: { score: -1 } },
      {
        $group: {
          _id: '$userId',
          bestScore: { $max: '$score' },
          bestGame: { $first: '$$ROOT' },
          totalGames: { $sum: 1 },
          avgScore: { $avg: '$score' },
        },
      },
      { $sort: { bestScore: -1 } },
      { $limit: limit },
      {
        $lookup: {
          from: 'users',
          localField: '_id',
          foreignField: '_id',
          as: 'user',
        },
      },
      { $unwind: '$user' },
      {
        $project: {
          _id: 0,
          userId: '$_id',
          name: '$user.name',
          bestScore: 1,
          totalGames: 1,
          avgScore: { $round: ['$avgScore', 1] },
          productName: '$bestGame.productName',
          finalPrice: '$bestGame.finalPrice',
          askingPrice: '$bestGame.askingPrice',
          minimumPrice: '$bestGame.minimumPrice',
          rounds: '$bestGame.currentRound',
          personality: '$bestGame.sellerPersonality',
          date: '$bestGame.createdAt',
        },
      },
    ]);

    // Add rank
    const leaderboard = topGames.map((entry, index) => ({
      rank: index + 1,
      ...entry,
    }));

    res.status(200).json({
      success: true,
      data: leaderboard,
    });
  } catch (error) {
    console.error('Leaderboard error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch leaderboard.',
    });
  }
};
