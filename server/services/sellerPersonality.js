// Seller personality definitions and behavior modifiers

const PERSONALITIES = {
  greedy: {
    name: 'Greedy Greg',
    description: 'A profit-obsessed seller who hates losing a single penny.',
    avatar: '🤑',
    initialMood: 'neutral',
    initialTrust: 40,
    initialPatience: 70,
    traits: {
      priceFlexibility: 0.05,    // Very reluctant to drop price
      trustGainRate: 0.6,        // Hard to earn trust
      trustLossRate: 1.5,        // Quick to lose trust on low offers
      patienceDrainRate: 1.0,    // Normal patience drain
      bluffSensitivity: 0.3,     // Somewhat resistant to bluffs
      rapportEffect: 0.5,        // Less swayed by rapport
      logicEffect: 0.7,          // Moderate response to logic
      emotionEffect: 0.3,        // Barely affected by emotions
    },
    responseStyle: 'Always emphasizes value and quality. Reluctant to budge. Uses phrases like "This is already a steal", "You won\'t find a better price", "I have other buyers interested".',
  },
  emotional: {
    name: 'Emotional Emma',
    description: 'A seller who is deeply influenced by feelings and personal connection.',
    avatar: '😊',
    initialMood: 'happy',
    initialTrust: 55,
    initialPatience: 60,
    traits: {
      priceFlexibility: 0.15,    // More flexible if trust is high
      trustGainRate: 1.5,        // Easy to build trust
      trustLossRate: 2.0,        // Also easy to lose trust (sensitive)
      patienceDrainRate: 1.2,    // Slightly impatient
      bluffSensitivity: 0.8,     // Very sensitive to bluffs (reacts negatively)
      rapportEffect: 2.0,        // Strongly swayed by rapport
      logicEffect: 0.5,          // Less interested in pure logic
      emotionEffect: 2.0,        // Greatly affected by tone and politeness
    },
    responseStyle: 'Warm and personal. Reacts strongly to tone. Uses phrases like "I really want to help you", "That hurts my feelings", "Since you\'re so nice, maybe I can work something out".',
  },
  logical: {
    name: 'Logical Leo',
    description: 'A data-driven seller who responds to facts, comparisons, and reasoning.',
    avatar: '🧠',
    initialMood: 'neutral',
    initialTrust: 50,
    initialPatience: 80,
    traits: {
      priceFlexibility: 0.12,    // Moderate flexibility tied to logic
      trustGainRate: 1.0,        // Steady trust building
      trustLossRate: 0.8,        // Doesn't lose trust easily
      patienceDrainRate: 0.7,    // Very patient
      bluffSensitivity: 0.2,     // Sees through bluffs easily
      rapportEffect: 0.4,        // Small talk doesn't sway much
      logicEffect: 2.0,          // Strongly responds to reasoning
      emotionEffect: 0.3,        // Unaffected by emotional appeals
    },
    responseStyle: 'Methodical and analytical. Cites specs, market data. Uses phrases like "Based on the specs...", "The market rate is...", "Let me break down the value proposition".',
  },
  impatient: {
    name: 'Impatient Ivan',
    description: 'A time-pressed seller who wants to close the deal fast.',
    avatar: '⚡',
    initialMood: 'cautious',
    initialTrust: 45,
    initialPatience: 40,
    traits: {
      priceFlexibility: 0.18,    // More flexible to close quickly
      trustGainRate: 0.8,        // Moderate trust building
      trustLossRate: 1.2,        // Loses trust on delays
      patienceDrainRate: 2.0,    // Very fast patience drain
      bluffSensitivity: 0.5,     // Moderate bluff sensitivity
      rapportEffect: 0.6,        // Slightly affected by rapport
      logicEffect: 0.8,          // Somewhat affected by logic
      emotionEffect: 0.6,        // Moderately emotional
    },
    responseStyle: 'Quick and to the point. Shows urgency. Uses phrases like "I don\'t have all day", "Take it or leave it", "Let\'s wrap this up", "Final offer".',
  },
};

export const getRandomPersonality = () => {
  const types = Object.keys(PERSONALITIES);
  return types[Math.floor(Math.random() * types.length)];
};

export const getPersonality = (type) => {
  return PERSONALITIES[type] || PERSONALITIES.logical;
};

export const getPersonalityNames = () => {
  return Object.entries(PERSONALITIES).map(([key, val]) => ({
    type: key,
    name: val.name,
    avatar: val.avatar,
  }));
};

export default PERSONALITIES;
