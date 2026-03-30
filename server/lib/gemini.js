import { ChatGoogleGenerativeAI } from '@langchain/google-genai';
import { HumanMessage, SystemMessage } from '@langchain/core/messages';
import { getPersonality } from '../services/sellerPersonality.js';

let model = null;

const getModel = () => {
  if (!model) {
    model = new ChatGoogleGenerativeAI({
      model: 'gemini-1.5-flash',
      apiKey: process.env.GOOGLE_API_KEY,
      temperature: 0.8,
      maxOutputTokens: 300,
    });
  }
  return model;
};

/**
 * Generate the AI seller's response based on the current game state.
 */
export const generateSellerResponse = async (game, playerAction, playerMessage, playerOffer, counterOffer, willAccept, willReject) => {
  const personality = getPersonality(game.sellerPersonality);

  const systemPrompt = `You are ${personality.name}, an AI seller in a negotiation game.

PERSONALITY: ${personality.description}
RESPONSE STYLE: ${personality.responseStyle}

PRODUCT: ${game.productName}
YOUR ASKING PRICE: ₹${game.askingPrice}
YOUR MINIMUM ACCEPTABLE PRICE: ₹${game.minimumPrice} (NEVER reveal this to the buyer)
CURRENT NEGOTIATION PRICE: ₹${counterOffer}

CURRENT STATE:
- Round: ${game.currentRound}/${game.maxRounds}
- Trust Level: ${game.trustLevel}/100
- Your Patience: ${game.patienceLevel}/100
- Your Mood: ${game.mood}

RULES:
1. NEVER reveal your minimum price
2. Stay in character as ${personality.name}
3. Keep responses under 2-3 sentences
4. Reference the product naturally
5. React to the player's strategy (${playerAction})
6. Use Indian Rupee (₹) for prices
${willAccept ? '7. You are ACCEPTING this deal. Be happy about it.' : ''}
${willReject ? '7. You are REJECTING this deal and walking away. Be firm.' : ''}
${!willAccept && !willReject ? `7. Your counter offer is ₹${counterOffer}. Present it naturally.` : ''}`;

  const humanPrompt = `The buyer's action: ${playerAction.toUpperCase()}
${playerMessage ? `Buyer says: "${playerMessage}"` : ''}
${playerOffer ? `Buyer offers: ₹${playerOffer}` : ''}

Respond in character. Be concise (2-3 sentences max).`;

  try {
    const aiModel = getModel();
    const response = await aiModel.invoke([
      new SystemMessage(systemPrompt),
      new HumanMessage(humanPrompt),
    ]);

    return response.content;
  } catch (error) {
    console.error('Gemini API Error:', error.message);
    // Throw error so controller can use its own fallback, or fallback here
    const fallback = getFallbackResponse(personality, playerAction, counterOffer, willAccept, willReject, game);
    if (!fallback) throw error;
    return fallback;
  }
};

/**
 * Fallback responses when Gemini API is unavailable.
 */
const getFallbackResponse = (personality, action, counterOffer, willAccept, willReject, game) => {
  if (willAccept) {
    const acceptResponses = [
      `Alright, you've got yourself a deal at ₹${game.finalPrice || counterOffer}! ${personality.avatar}`,
      `Fine, I'll accept ₹${game.finalPrice || counterOffer}. You drive a hard bargain!`,
      `Deal! ₹${game.finalPrice || counterOffer} it is. Pleasure doing business with you.`,
    ];
    return acceptResponses[Math.floor(Math.random() * acceptResponses.length)];
  }

  if (willReject) {
    const rejectResponses = [
      `I'm done negotiating. This isn't going anywhere. Good day.`,
      `Sorry, I can't go any lower. I'm walking away from this deal.`,
      `My patience has run out. Come back when you're serious.`,
    ];
    return rejectResponses[Math.floor(Math.random() * rejectResponses.length)];
  }

  const responses = {
    greet: [
      `Welcome to my shop! I'm ${personality.name} ${personality.avatar}. I have this beautiful ${game?.productName || 'item'} for ₹${counterOffer}. What do you say?`,
      `Hello there! Are you looking to buy the ${game?.productName || 'item'}? My price is ₹${counterOffer}. Let's make a deal.`,
      `Ah, a potential customer! I can give you the ${game?.productName || 'item'} for ₹${counterOffer}. Any thoughts?`,
    ],
    offer: [
      `Hmm, that's quite low. I could do ₹${counterOffer} at best.`,
      `I appreciate the offer, but the lowest I can go is ₹${counterOffer}.`,
      `Let me think... How about ₹${counterOffer}? That's a fair price.`,
    ],
    justify: [
      `I see your point, but this product speaks for itself. ₹${counterOffer} is fair.`,
      `Good reasoning, but my price reflects the quality. I'll say ₹${counterOffer}.`,
    ],
    rapport: [
      `I appreciate the kind words! But business is business. ₹${counterOffer}.`,
      `You seem like a good person. Let me see what I can do... ₹${counterOffer}?`,
    ],
    delay: [
      `Still thinking? I've got other buyers lined up. ₹${counterOffer}, take it or leave it.`,
      `Don't take too long, this deal won't last forever.`,
    ],
    bluff: [
      `Other offers? Sure you do. My price is ₹${counterOffer}.`,
      `Well, if you have better options, why are you still here? ₹${counterOffer}.`,
    ],
  };

  const actionResponses = responses[action] || responses.offer;
  return actionResponses[Math.floor(Math.random() * actionResponses.length)];
};

export default { generateSellerResponse };
