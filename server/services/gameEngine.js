import { getPersonality } from './sellerPersonality.js';

// Product configurations
const PRODUCTS = [
  { name: 'Premium Wireless Headphones', askingPrice: 12000, targetPrice: 9000, minimumPrice: 6500 },
  { name: 'Smart Fitness Watch', askingPrice: 15000, targetPrice: 11000, minimumPrice: 7500 },
  { name: 'Mechanical Gaming Keyboard', askingPrice: 8000, targetPrice: 6000, minimumPrice: 4000 },
  { name: 'Portable Bluetooth Speaker', askingPrice: 5000, targetPrice: 3500, minimumPrice: 2200 },
  { name: 'Noise-Cancelling Earbuds', askingPrice: 10000, targetPrice: 7500, minimumPrice: 5000 },
];

export const getRandomProduct = () => {
  return PRODUCTS[Math.floor(Math.random() * PRODUCTS.length)];
};

/**
 * Calculate trust change based on the player action and seller personality.
 */
export const calculateTrustChange = (action, offer, game) => {
  const personality = getPersonality(game.sellerPersonality);
  const traits = personality.traits;
  let trustDelta = 0;
  const currentPrice = game.moves.length > 0
    ? game.moves[game.moves.length - 1].aiCounterOffer || game.askingPrice
    : game.askingPrice;

  switch (action) {
    case 'offer': {
      const ratio = offer / currentPrice;
      if (ratio >= 0.9) {
        trustDelta = 8 * traits.trustGainRate;     // Reasonable offer
      } else if (ratio >= 0.7) {
        trustDelta = 2 * traits.trustGainRate;      // Moderate offer
      } else if (ratio >= 0.5) {
        trustDelta = -5 * traits.trustLossRate;     // Low offer
      } else {
        trustDelta = -15 * traits.trustLossRate;    // Insulting offer
      }
      break;
    }
    case 'justify':
      trustDelta = 5 * traits.logicEffect;
      break;
    case 'rapport':
      trustDelta = 7 * traits.rapportEffect;
      break;
    case 'delay':
      trustDelta = -3 * traits.patienceDrainRate;
      break;
    case 'bluff': {
      // Bluffs can backfire based on sensitivity
      const bluffSuccess = Math.random() > traits.bluffSensitivity;
      trustDelta = bluffSuccess ? 4 : -10 * traits.trustLossRate;
      break;
    }
    case 'exit':
      trustDelta = 0;
      break;
    default:
      trustDelta = 0;
  }

  return Math.round(trustDelta);
};

/**
 * Calculate patience change based on the player action and round.
 */
export const calculatePatienceChange = (action, game) => {
  const personality = getPersonality(game.sellerPersonality);
  const traits = personality.traits;
  let patienceDelta = 0;

  switch (action) {
    case 'offer':
      patienceDelta = -5 * traits.patienceDrainRate;
      break;
    case 'justify':
      patienceDelta = -3 * traits.patienceDrainRate;
      break;
    case 'rapport':
      patienceDelta = 2;  // Rapport can restore a bit of patience
      break;
    case 'delay':
      patienceDelta = -12 * traits.patienceDrainRate;
      break;
    case 'bluff':
      patienceDelta = -8 * traits.patienceDrainRate;
      break;
    default:
      patienceDelta = -3;
  }

  // Late-game penalty: patience drains faster
  const roundPenalty = game.currentRound > 6 ? -3 : 0;

  return Math.round(patienceDelta + roundPenalty);
};

/**
 * Calculate the AI's mood based on trust and patience.
 */
export const calculateMood = (trust, patience) => {
  if (trust >= 70 && patience >= 50) return 'happy';
  if (trust >= 50 && patience >= 30) return 'neutral';
  if (trust >= 30 && patience >= 20) return 'cautious';
  if (trust >= 15 || patience >= 10) return 'annoyed';
  return 'angry';
};

/**
 * Calculate the AI's counter offer based on game state.
 */
export const calculateCounterOffer = (playerOffer, game) => {
  const personality = getPersonality(game.sellerPersonality);
  const traits = personality.traits;

  const currentPrice = game.moves.length > 0
    ? game.moves[game.moves.length - 1].aiCounterOffer || game.askingPrice
    : game.askingPrice;

  // How much the seller is willing to concede
  const trustFactor = game.trustLevel / 100;         // 0-1
  const patienceFactor = 1 - (game.patienceLevel / 100); // More impatient = more flexible
  const roundFactor = game.currentRound / game.maxRounds; // Later rounds = more flexible

  // Base flexibility modified by personality and game state
  const flexibility = traits.priceFlexibility * (1 + trustFactor * 0.5 + patienceFactor * 0.3 + roundFactor * 0.4);

  // Calculate how far the seller will move toward the player's offer
  const priceDiff = currentPrice - playerOffer;
  const concession = priceDiff * flexibility;

  let counterOffer = currentPrice - concession;

  // Never go below minimum price
  counterOffer = Math.max(counterOffer, game.minimumPrice);

  // Round to nearest 50
  counterOffer = Math.round(counterOffer / 50) * 50;

  // If player offer is at or above current price, accept
  if (playerOffer >= currentPrice) {
    counterOffer = currentPrice;
  }

  return counterOffer;
};

/**
 * Check if the AI should accept the deal.
 */
export const shouldAcceptDeal = (playerOffer, game) => {
  // Accept if offer is at or above target price
  if (playerOffer >= game.targetPrice) return true;

  // Accept if offer is above minimum and trust is high + patience is low
  if (playerOffer >= game.minimumPrice) {
    const acceptProbability =
      (game.trustLevel / 100) * 0.4 +
      ((100 - game.patienceLevel) / 100) * 0.3 +
      (game.currentRound / game.maxRounds) * 0.3;

    return acceptProbability > 0.65;
  }

  return false;
};

/**
 * Check if the seller should reject (walk away).
 */
export const shouldRejectDeal = (game) => {
  // Reject if patience hits 0
  if (game.patienceLevel <= 0) return true;

  // Reject if mood is angry and trust is below 10
  if (game.mood === 'angry' && game.trustLevel < 10) return true;

  return false;
};

/**
 * Calculate final score.
 */
export const calculateScore = (finalPrice, minimumPrice, rounds, maxRounds) => {
  const priceScore = (minimumPrice / finalPrice) * 100;
  const efficiencyBonus = ((maxRounds - rounds) / maxRounds) * 10; // Bonus for quick deals
  return Math.min(100, Math.round(priceScore + efficiencyBonus));
};
