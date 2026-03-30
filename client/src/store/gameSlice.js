import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../services/api';

export const startGame = createAsyncThunk(
  'game/start',
  // productParams = { productId, name, marketPrice } (optional — if not passed, server picks random)
  async (productParams, { rejectWithValue }) => {
    try {
      const body = productParams
        ? {
            productId: productParams.productId,
            productName: productParams.name,
            marketPrice: productParams.marketPrice,
          }
        : {};
      const response = await api.post('/game/start', body);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to start game');
    }
  }
);

export const makeMove = createAsyncThunk(
  'game/makeMove',
  async ({ gameId, action, message, offer }, { rejectWithValue }) => {
    try {
      const response = await api.post('/game/move', {
        gameId,
        action,
        message,
        offer: offer ? Number(offer) : undefined,
      });
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to make move');
    }
  }
);

export const fetchHistory = createAsyncThunk(
  'game/fetchHistory',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get('/game/history');
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch history');
    }
  }
);

export const fetchLeaderboard = createAsyncThunk(
  'game/fetchLeaderboard',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get('/leaderboard');
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch leaderboard');
    }
  }
);

const gameSlice = createSlice({
  name: 'game',
  initialState: {
    // Current game
    currentGame: null,
    messages: [],
    isLoading: false,
    isMoveLoading: false,
    error: null,
    gameOver: false,

    // History
    history: [],
    historyLoading: false,

    // Leaderboard
    leaderboard: [],
    leaderboardLoading: false,
  },
  reducers: {
    resetGame: (state) => {
      state.currentGame = null;
      state.messages = [];
      state.gameOver = false;
      state.error = null;
    },
    addPlayerMessage: (state, action) => {
      state.messages.push({
        type: 'player',
        action: action.payload.action,
        message: action.payload.message,
        offer: action.payload.offer,
        timestamp: Date.now(),
      });
    },
    clearGameError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Start Game
      .addCase(startGame.pending, (state) => {
        state.isLoading = true;
        state.error = null;
        state.messages = [];
        state.gameOver = false;
      })
      .addCase(startGame.fulfilled, (state, action) => {
        state.isLoading = false;
        state.currentGame = action.payload;
        state.messages = [{
          type: 'seller',
          message: action.payload.openingMessage,
          timestamp: Date.now(),
        }];
      })
      .addCase(startGame.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // Make Move
      .addCase(makeMove.pending, (state) => {
        state.isMoveLoading = true;
        state.error = null;
      })
      .addCase(makeMove.fulfilled, (state, action) => {
        state.isMoveLoading = false;
        const data = action.payload;

        // Add AI response message
        state.messages.push({
          type: 'seller',
          message: data.aiResponse,
          counterOffer: data.counterOffer,
          timestamp: Date.now(),
        });

        // Update game state
        if (state.currentGame) {
          state.currentGame.trustLevel = data.trustLevel;
          state.currentGame.patienceLevel = data.patienceLevel;
          state.currentGame.mood = data.mood;
          state.currentGame.currentRound = data.currentRound;
          state.currentGame.status = data.status;
          state.currentGame.counterOffer = data.counterOffer;
        }

        if (data.gameOver) {
          state.gameOver = true;
          if (state.currentGame) {
            state.currentGame.success = data.success;
            state.currentGame.score = data.score;
            state.currentGame.finalPrice = data.finalPrice;
          }
        }
      })
      .addCase(makeMove.rejected, (state, action) => {
        state.isMoveLoading = false;
        state.error = action.payload;
      })
      // Fetch History
      .addCase(fetchHistory.pending, (state) => {
        state.historyLoading = true;
      })
      .addCase(fetchHistory.fulfilled, (state, action) => {
        state.historyLoading = false;
        state.history = action.payload;
      })
      .addCase(fetchHistory.rejected, (state) => {
        state.historyLoading = false;
      })
      // Fetch Leaderboard
      .addCase(fetchLeaderboard.pending, (state) => {
        state.leaderboardLoading = true;
      })
      .addCase(fetchLeaderboard.fulfilled, (state, action) => {
        state.leaderboardLoading = false;
        state.leaderboard = action.payload;
      })
      .addCase(fetchLeaderboard.rejected, (state) => {
        state.leaderboardLoading = false;
      });
  },
});

export const { resetGame, addPlayerMessage, clearGameError } = gameSlice.actions;
export default gameSlice.reducer;
