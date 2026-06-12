// =====================================================
// Global Mouse / Touch Tracking & Math Utilities
// =====================================================
let mouseX = 0, mouseY = 0;
window.addEventListener("mousemove", (e) => {
  mouseX = (e.clientX / window.innerWidth) * 2 - 1;
  mouseY = -(e.clientY / window.innerHeight) * 2 + 1;
});
window.addEventListener("touchmove", (e) => {
  if (e.touches.length > 0) {
    mouseX = (e.touches[0].clientX / window.innerWidth) * 2 - 1;
    mouseY = -(e.touches[0].clientY / window.innerHeight) * 2 + 1;
  }
});

// Seeded PRNG (Mulberry32)
function getDaySeed() {
  const now = new Date();
  return now.getFullYear() * 10000 + (now.getMonth() + 1) * 100 + now.getDate();
}

function createPRNG(seed) {
  let a = seed;
  return function() {
    let t = a += 0x6D2B79F5;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  }
}

// Helper to get week number of the year (1-53)
function getWeekNumber(d) {
  d = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()));
  d.setUTCDate(d.getUTCDate() + 4 - (d.getUTCDay()||7));
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(),0,1));
  const weekNo = Math.ceil(( ( (d - yearStart) / 86400000) + 1)/7);
  return weekNo;
}

// =====================================================
// Theme Color Definitions for WebGL Shader
// =====================================================
const THEME_COLORS = {
  sakura: {
    heart: [0.96, 0.46, 0.59],
    inner: [1.0, 0.88, 0.65],
    bg1: [0.99, 0.94, 0.95],
    bg2: [1.0, 0.72, 0.77]
  },
  cafe: {
    heart: [0.95, 0.45, 0.25],
    inner: [1.0, 0.90, 0.60],
    bg1: [0.99, 0.96, 0.92],
    bg2: [1.0, 0.80, 0.65]
  },
  dream: {
    heart: [0.60, 0.45, 0.85],
    inner: [0.80, 0.95, 1.0],
    bg1: [0.08, 0.05, 0.15],
    bg2: [0.15, 0.08, 0.25]
  },
  rain: {
    heart: [0.15, 0.60, 0.85],
    inner: [0.50, 0.95, 1.0],
    bg1: [0.90, 0.94, 0.96],
    bg2: [0.70, 0.82, 0.88]
  }
};

let currentTheme = "sakura";
let targetTheme = "sakura";

let curHeartColor = [...THEME_COLORS.sakura.heart];
let curInnerColor = [...THEME_COLORS.sakura.inner];
let curBg1Color = [...THEME_COLORS.sakura.bg1];
let curBg2Color = [...THEME_COLORS.sakura.bg2];

// =====================================================
// Databases & Dictionaries (Names Purged for Anonymity)
// =====================================================
const ADJECTIVES = [
  "Radiant", "Kind", "Graceful", "Brilliant", "Loved", "Irreplaceable", "Ethereal", "Angelic", 
  "Playful", "Dreamy", "Breathtaking", "Captivating", "Compassionate", "Genuine", "Inspiring", 
  "Magical", "Pure-hearted", "Warm-hearted", "Affectionate", "Charming", "Dazzling", "Elegant", 
  "Fascinating", "Gorgeous", "Heavenly", "Luminous", "Splendid", "Sweet", "Tender", "Wonderful", 
  "Adorable", "Beautiful", "Cheerful", "Delightful", "Exquisite", "Joyful", "Lovely", "Precious", 
  "Sparkling", "Unique", "Vibrant", "Enchanting", "Cute", "Fabulous", "Warm", "Gentle"
];

const ANIME_QUOTES = [
  { text: '"I wanted to tell you... wherever you are in the world, I\'ll search for you."', author: "Your Name" },
  { text: '"If it\'s possible for one person to be hurt by another, then it\'s possible for that person to be healed by another."', author: "Fruits Basket" },
  { text: '"You made me realize that even if we are apart, my feelings will never change."', author: "Cardcaptor Sakura" },
  { text: '"I love you. I knew it the minute I met you. No, even before I met you."', author: "Weathering With You" },
  { text: '"It was like you brought color into my world. You changed my life."', author: "Your Lie in April" },
  { text: '"Meeting you was the best thing that ever happened to me."', author: "Kimi ni Todoke" },
  { text: '"If I can meet you again, against the 6 billion to 1 odds, even if you can\'t move, I will marry you."', author: "Angel Beats" },
  { text: '"I will love you forever, no matter what happens to us."', author: "Sailor Moon" },
  // 20 Additional Romantic Anime Quotes
  { text: '"In our stories, there is a beautiful light... you are my light."', author: "Clannad" },
  { text: '"If I can be with you, I don\'t care about anything else."', author: "Sword Art Online" },
  { text: '"I love you. I loved you since the day I first met you."', author: "Toradora!" },
  { text: '"The moment I met you, my world had a sound again."', author: "Your Lie in April" },
  { text: '"You are the one who showed me that the world is beautiful."', author: "Violet Evergarden" },
  { text: '"No matter how dark the night, I will always find my way to you."', author: "Fate/stay night" },
  { text: '"Your hand is warm. It makes me feel safe."', author: "Clannad" },
  { text: '"Since meeting you, my heart has never stopped beating for you."', author: "Kimi ni Todoke" },
  { text: '"No matter what happens, I will protect you and stay by your side."', author: "Sword Art Online" },
  { text: '"My world begins and ends with you."', author: "Steins;Gate" },
  { text: '"If the world is against you, I\'ll be your only ally."', author: "Code Geass" },
  { text: '"Meeting you was fate, becoming your friend was a choice, but falling in love was out of my control."', author: "L-DK" },
  { text: '"I want to share all your happy moments, and hold you through all the sad ones."', author: "Fruits Basket" },
  { text: '"Even if I lose my memories, I will fall in love with you all over again."', author: "Golden Time" },
  { text: '"You are my home, the place where I belong."', author: "Kamisama Kiss" },
  { text: '"If I have you, I have everything I need."', author: "Horimiya" },
  { text: '"The warmth of your hand is the only thing I need to face the future."', author: "Noragami" },
  { text: '"You are the melody that plays in my head every single day."', author: "Your Lie in April" },
  { text: '"We can reach out to the stars, as long as we hold hands."', author: "Gurren Lagann" },
  { text: '"I\'ll stay by your side forever. I promise."', author: "Sword Art Online" }
];

const OMIKUJI_FORTUNES = [
  { badge: "🌟 Dai-kichi (Great Blessing)", desc: "Perfect stars align! An extremely cozy weekend date is ahead. Hug chance: 100%." },
  { badge: "🌸 Chuu-kichi (Middle Blessing)", desc: "A sweet text message is heading your way. Your smile is guaranteed to grow today." },
  { badge: "✨ Shou-kichi (Small Blessing)", desc: "A cozy laugh and hot chocolate are in your near future. Joy is in small things!" },
  { badge: "🍀 Kichi (Blessing)", desc: "Excellent vibes. Dressed outfits will look extra fashionable this weekend." }
];

const ACHIEVEMENTS = [
  { id: "memory_win", icon: "🧠", label: "Memory Master" },
  { id: "hearts_50", icon: "💝", label: "50 Hearts" },
  { id: "hearts_100", icon: "💌", label: "100 Hearts" },
  { id: "fashion_king", icon: "👑", label: "Fashion Guru" },
  { id: "question_yes", icon: "💖", label: "Said Yes" },
  { id: "fortune_draw", icon: "🎴", label: "Fortune Seeker" }
];

const DEFAULT_BUCKET_ITEMS = [
  { emoji: "🏖️", text: "Sunset beach trip" },
  { emoji: "🍽️", text: "Candlelight dinner" },
  { emoji: "🎬", text: "Cozy movie night" },
  { emoji: "🗻", text: "Mountain hiking trip" },
  { emoji: "✈️", text: "Fly away adventure" },
  { emoji: "💍", text: "Making future plans" }
];

const NOTE1_OPENINGS = ["Sthandwa sam,", "Ziyanda,", "My beautiful Ncumo,", "To my favourite person,", "My princess Ziyanda,"];
const NOTE1_BODIES = [
  "you make even the most ordinary days feel like a scene from a beautiful Ghibli film.",
  "your smile has this magical way of melting away all my weekday stress.",
  "being with you makes me realize what it truly means to be happy.",
  "every moment spent laughing with you is a memory I keep locked in my heart.",
  "your warmth and kindness make the world feel so much softer and brighter."
];
const NOTE1_CLOSINGS = ["Thank you for being you. ♡", "You are my whole world. 💖", "Ndiyakuthanda always. 💍", "Always yours. ♡", "Forever and always. ♡"];

const NOTE2_OPENINGS = ["Just a reminder,", "Hey stylist Ziyanda,", "By the way,", "Sweet Ziyanda,", "Dearest,"];
const NOTE2_BODIES = [
  "your laugh is my absolute favourite soundtrack, and I hope to hear it every day.",
  "I am still thinking about that sweet laugh we shared last weekend.",
  "you look absolutely breathtaking in every single style under the sun.",
  "you have this effortless way of bringing joy wherever you go.",
  "my day is always ten times better the second I think of you."
];
const NOTE2_CLOSINGS = ["Can't wait for our weekend date! 🗓️", "Sending you a huge virtual hug right now. 🤗", "Smile for me today! 🌸", "Hope this makes you grin! 🧸", "Ndiyakuthanda! ♡"];

const NOTE3_OPENINGS = ["Looking forward,", "Our future,", "Every single day,", "Looking ahead,"];
const NOTE3_BODIES = [
  "is filled with so many sunset dates, coffee walks, and shared dinners.",
  "has so many blank polaroid frames waiting to be filled by our adventures.",
  "is going to be a beautiful story that we write together step by step.",
  "holds so many exciting plans that I can't wait to share with you."
];
const NOTE3_CLOSINGS = ["Let's build more memories this weekend. 🗺️", "Always countdown-ing to our next date. ⏳", "Excited for everything to come! ✨", "You and me, always. 💍"];

const NOTE4_OPENINGS = ["In a world of temporary things,", "No matter where we go,", "Since June 5th,", "Every single day,"];
const NOTE4_BODIES = [
  "you are my forever and my safest, warmest space.",
  "my feelings for you only grow stronger and deeper with each passing day.",
  "you are the absolute main character of my story, and always will be.",
  "you prove to me that true love is the most beautiful thing in the world."
];
const NOTE4_CLOSINGS = ["Forever mine. ♡", "Ndiyakuthanda, sthandwa sam. 💖", "You have all of my heart. 💍", "My irreplaceable girl. 🌸"];

// =====================================================
// 42 Delayed Weekend Cleaning & Date Jokes
// =====================================================
const WEEKEND_PROMPTS = [
  {
    text: "Shouldn't you be with me? 😉 Also... I haven't cleaned my place yet. You're going to help me clean when you come over, right? 🧹✨",
    responses: ["Only if I get snacks! 🍫", "Of course! 🧼", "You're on your own 😜"]
  },
  {
    text: "Shouldn't you be with me? 😉 Because my weekend has officially started and my favorite person is missing! 💖",
    responses: ["Pick me up! 🚗", "Let's stay in 🍕", "On my way! 🏃‍♀️"]
  },
  {
    text: "Don't you miss me? 🥺 My room is too quiet, my schedule is empty, and I need a Ziyanda laugh right now. ♡",
    responses: ["I miss you more! 🤗", "Only a little bit 😜", "Coming over! 🚀"]
  },
  {
    text: "Shouldn't you be with me? 😉 Let's drop whatever we are doing and go get some warm coffee. Thoughts? ☕",
    responses: ["mocha for me! ☕", "Tea date instead 🍵", "You're buying! 💸"]
  },
  {
    text: "Don't you miss me? 🥺 Let's plan our weekend date right now. You can't say no! 🗺️✨",
    responses: ["Yes, please! 💖", "Let's explore 🔍", "Pick the spot! 🌳"]
  },
  {
    text: "It's the weekend! 🏖️ Are we going on a date, or are you just gonna let me miss you all day?",
    responses: ["Pick me up! 🚗", "Let's stay in 🍕", "Let me think 😜"]
  },
  {
    text: "Weekend warning: Extreme cuddle threat detected! Are you prepared?",
    responses: ["100% ready! 🤗", "Only with snacks 🍿", "I'm running away! 🏃‍♀️"]
  },
  {
    text: "I was thinking... we look pretty good together. Let's test that today?",
    responses: ["Definitely! 💍", "Need to double check 🔍", "We look amazing! ✨"]
  },
  {
    text: "My weekend calendar has a huge slot marked: 'Spending time with my favorite girl.' You free?",
    responses: ["Always free for you! 💖", "Maybe for an hour 🕰️", "Yes, let's go! 🚀"]
  },
  {
    text: "Just a heads up: my hoodie has been missing you. I think you need to wear it today.",
    responses: ["It's mine now! 🧥", "I'll think about it 😜", "Bring it over! 🛍️"]
  },
  {
    text: "Weekend rule #1: You have to smile at least ten times. Let me help you with the first one.",
    responses: ["Already smiling! 😊", "Try harder! 😜", "Aww, thank you! ♡"]
  },
  {
    text: "If we were in an anime, this would be the episode where we go on a cozy sunset coffee date. Thoughts?",
    responses: ["I'll order the mocha! ☕", "Make it a tea date 🍵", "Only if you buy! 💸"]
  },
  {
    text: "Hey Ncumo, I've got a challenge. Who can make the other laugh first? Winner gets a hug.",
    responses: ["You're on! 🥊", "I always win! 🥇", "Easiest hug ever! 🤗"]
  },
  {
    text: "Weekend checklist: Charge phone 🔌, buy snacks 🍿, hang out with my favorite person. How are we doing on the last one?",
    responses: ["Let's make it happen! 🗓️", "On my way! 🏃‍♀️", "Working on it! 🌸"]
  },
  {
    text: "I haven't cooked anything yet. You're going to help me cook when you come over, right? 🍳😋",
    responses: ["Only if I'm head chef! 👩‍🍳", "I'll do the eating 🍕", "Let's order takeout! 📱"]
  },
  {
    text: "Weekend mood: counting down the minutes until I see you. What's your status?",
    responses: ["Same here! ⏳", "Just getting ready 👗", "Busy thinking of you 💭"]
  },
  {
    text: "Just checked: my heart is still beating only for you this weekend. Strange, right? 💓",
    responses: ["Not strange at all! 🥰", "Mine is too! 💖", "Smooth talker... 😉"]
  },
  {
    text: "Weekend assignment: Ziyanda has to let me hold her hand. No excuses allowed! 🤝",
    responses: ["Granted! 🤝🌸", "Only if it's warm ☀️", "Maybe later! 😜"]
  },
  {
    text: "The coffee shop is calling our name. Let's go grab a warm cup together? ☕",
    responses: ["Let's go! ☕✨", "Only if there are cakes 🍰", "Cozy walk first 🚶‍♀️"]
  },
  {
    text: "Shouldn't you be with me? 😉 Also... I haven't done my laundry yet. You're going to help me fold, right? 👕",
    responses: ["Fold it yourself! 😜", "Only the hoodies 🧥", "I'll supervise! 👑"]
  },
  {
    text: "I was looking at this weekend and thinking it lacks a bit of 'us'. Let's fix that.",
    responses: ["Yes, please! 💖", "On my way 🏃‍♀️", "What's the plan? 🗺️"]
  },
  {
    text: "Cuddle index is at 100% today. I suggest we take immediate action.",
    responses: ["Agreed! 🤗", "Wait for me! ⏳", "Only if it's cozy 🌧️"]
  },
  {
    text: "My favorite spot in the world is right next to you. Are we going there today?",
    responses: ["Definitely! 💍", "Let's find it 🗺️", "Always! ♡"]
  },
  {
    text: "Warning: Missing you level has reached critical status this weekend! 🚨",
    responses: ["Sending hug! 🤗", "I'll be there soon! 🚗", "Me too! 🥺"]
  },
  {
    text: "Weekend plan: Do absolutely nothing... together. Sound like a plan?",
    responses: ["Sounds perfect! 🛌", "Only with movies 🎬", "Let's go out! 🌳"]
  },
  {
    text: "I think you owe me a date this weekend. I'm here to collect! 💳",
    responses: ["Payment accepted! 🎟️", "Next weekend! 😜", "Let's go now! 🚀"]
  },
  {
    text: "Are we matching outfits today, or are you going to let me look less cool than you?",
    responses: ["Let's match! 👕", "I'm always cooler 😎", "Surprise me! 🎲"]
  },
  {
    text: "I haven't washed my car yet. You're going to help me splash water, right? 🚗💦",
    responses: ["Water fight! 🔫", "I'll watch 🍿", "Only if we play music 🎵"]
  },
  {
    text: "Just a reminder: weekends are for us. Everything else can wait.",
    responses: ["Exactly! 🌸", "Agreed 💯", "Let's focus on us! ♡"]
  },
  {
    text: "My weekend is empty without your smile. Can you bring it over?",
    responses: ["On my way! 🏃‍♀️", "Smiling already! 😊", "Coming soon! 💖"]
  },
  {
    text: "If I got a flower for every time I thought of you this weekend, I'd have a massive garden. 🌷",
    responses: ["So sweet! 💐", "Show me! 🔍", "Ndiyakuthanda! ♡"]
  },
  {
    text: "I bought your favorite snacks. I think that means you have to come visit me.",
    responses: ["Snack alert! 🍿", "Best boyfriend! 🥰", "Save some for me! 🏃‍♀️"]
  },
  {
    text: "Shouldn't you be with me? 😉 Also... my room is a mess. You're going to help me organize, right? 📦",
    responses: ["No way! 😜", "Only if we find treasures 🪙", "Clean up first! 🧹"]
  },
  {
    text: "Weekend challenge: who can make the coziest cup of hot chocolate? ☕🍫",
    responses: ["I will! 🥇", "Let's make it together 👩‍🍳", "You make it for me! 🥺"]
  },
  {
    text: "My heart has been asking for you all morning. I think you should answer it.",
    responses: ["Hello! 📞💖", "Coming! 🏃‍♀️", "Aww! ♡"]
  },
  {
    text: "I planned a little sunset walk for us. You coming, right?",
    responses: ["Love sunset walks! 🌅", "Only if it's warm ☀️", "Yes! 👟"]
  },
  {
    text: "Weekend checklist item #1: Hold Ziyanda tight. Can we check it off?",
    responses: ["Yes, please! 🤗", "Soon! 🕰", "Cuddle time! 💖"]
  },
  {
    text: "I was looking at the stars and thinking... none of them match your brightness. 🌌",
    responses: ["So romantic! ✨", "Aww! 🥰", "My starry sky! ♡"]
  },
  {
    text: "I haven't set up the movie list yet. You're going to help me pick, right? 🎬🍿",
    responses: ["Anime night! 🌸", "Cozy romance 🍿", "Action movie! 💥"]
  },
  {
    text: "Shouldn't you be with me? 😉 Also... I haven't done the dishes. You're going to help me rinse, right? 🍽️",
    responses: ["I'll dry! 🧼", "You wash them! 😜", "Let's use paper plates 😂"]
  },
  {
    text: "Weekend energy: 100% cozy, 100% focused on you. What about you?",
    responses: ["Same vibe! 🛌", "Excited! 🚀", "Ndiyakuthanda! ♡"]
  },
  {
    text: "Shouldn't you be with me? 😉 Also... I haven't watered the plants. You're going to help me garden, right? 🪴",
    responses: ["Only if I get dirty 🌱", "I'll talk to the plants 🗣️", "Water fight instead! 💦"]
  }
];

// =====================================================
// Web Audio Synthesizer & Visualizer System
// =====================================================
let audioCtx = null;
let lofiInterval = null;
let currentChordIdx = 0;
let isLofiPlaying = false;
let fortuneDrawCount = 0;

let analyser = null;
let dataArray = null;
let visualizerCanvas = null;
let visualizerCtx = null;
let visualizerAnimId = null;

// Procedural Cozy Rain nodes
let rainSource = null;
let rainGain = null;
let isRainPlaying = false;

const CHORD_PROGRESSIONS = {
  sakura: [
    [261.63, 329.63, 392.00, 493.88], // Cmaj7
    [293.66, 349.23, 440.00, 587.33], // Dm7
    [329.63, 392.00, 493.88, 587.33], // Em7
    [349.23, 440.00, 523.25, 698.46]  // Fmaj7
  ],
  cafe: [
    [220.00, 277.18, 329.63, 415.30], // Amaj7
    [246.94, 293.66, 369.99, 440.00], // Bm7
    [164.81, 207.65, 246.94, 329.63], // E7
    [220.00, 277.18, 329.63, 392.00]  // A7
  ],
  dream: [
    [220.00, 261.63, 329.63, 392.00], // Am7
    [174.61, 220.00, 261.63, 349.23], // Fmaj7
    [196.00, 246.94, 293.66, 392.00], // G7
    [164.81, 196.00, 246.94, 329.63]  // Em7
  ],
  rain: [
    [220.00, 261.63, 329.63, 392.00], // Am7
    [164.81, 196.00, 246.94, 329.63], // Em7
    [146.83, 174.61, 220.00, 293.66], // Dm7
    [130.81, 164.81, 196.00, 261.63]  // Cmaj7
  ]
};

function initAudio() {
  if (!audioCtx) {
    audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    analyser = audioCtx.createAnalyser();
    analyser.fftSize = 64;
    const bufferLength = analyser.frequencyBinCount;
    dataArray = new Uint8Array(bufferLength);
  }
  if (audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
}

function playSynthNote(freq, type = 'sine', duration = 0.3, slideTo = null, gainValue = 0.12) {
  try {
    initAudio();
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    
    osc.type = type;
    osc.frequency.setValueAtTime(freq, audioCtx.currentTime);
    if (slideTo) {
      osc.frequency.exponentialRampToValueAtTime(slideTo, audioCtx.currentTime + duration);
    }
    
    gain.gain.setValueAtTime(gainValue, audioCtx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + duration);
    
    osc.connect(gain);
    gain.connect(analyser); // Route notes through analyser first
    gain.connect(audioCtx.destination);
    
    osc.start();
    osc.stop(audioCtx.currentTime + duration);
  } catch (e) {
    console.warn("Audio Context blocked or failed.", e);
  }
}

function playChord(frequencies) {
  frequencies.forEach((freq, idx) => {
    setTimeout(() => {
      const type = (targetTheme === 'rain') ? 'sine' : 'triangle';
      const gain = (targetTheme === 'rain') ? 0.04 : 0.05;
      playSynthNote(freq, type, 2.0, null, gain);
    }, idx * 120);
  });
}

function startLofiLoop() {
  if (isLofiPlaying) return;
  isLofiPlaying = true;
  document.getElementById("cassetteWidget").classList.add("playing");
  document.getElementById("cassettePlay").textContent = "PAUSE";
  
  const progression = CHORD_PROGRESSIONS[targetTheme] || CHORD_PROGRESSIONS.sakura;
  playChord(progression[currentChordIdx]);
  
  lofiInterval = setInterval(() => {
    const activeProg = CHORD_PROGRESSIONS[targetTheme] || CHORD_PROGRESSIONS.sakura;
    currentChordIdx = (currentChordIdx + 1) % activeProg.length;
    playChord(activeProg[currentChordIdx]);
    
    if (Math.random() > 0.4) {
      setTimeout(() => {
        const highNotes = [523.25, 587.33, 659.25, 783.99, 880.00];
        const randomNote = highNotes[Math.floor(Math.random() * highNotes.length)];
        playSynthNote(randomNote, 'sine', 0.8, null, 0.03);
      }, 800);
    }
  }, 3000);
  
  startVisualizerDraw();
}

function stopLofiLoop() {
  isLofiPlaying = false;
  document.getElementById("cassetteWidget").classList.remove("playing");
  document.getElementById("cassettePlay").textContent = "PLAY";
  clearInterval(lofiInterval);
}

// Procedural Cozy Rain Generator (Mathematical Low-Pass Filtered White Noise)
function generateRainBuffer() {
  const bufferSize = audioCtx.sampleRate * 2; // 2 seconds
  const noiseBuffer = audioCtx.createBuffer(1, bufferSize, audioCtx.sampleRate);
  const output = noiseBuffer.getChannelData(0);
  for (let i = 0; i < bufferSize; i++) {
    output[i] = Math.random() * 2 - 1;
  }
  return noiseBuffer;
}

function startCozyRain() {
  initAudio();
  if (isRainPlaying) return;
  isRainPlaying = true;
  
  rainSource = audioCtx.createBufferSource();
  rainSource.buffer = generateRainBuffer();
  rainSource.loop = true;
  
  const lowpassFilter = audioCtx.createBiquadFilter();
  lowpassFilter.type = "lowpass";
  lowpassFilter.frequency.setValueAtTime(450, audioCtx.currentTime);
  
  rainGain = audioCtx.createGain();
  rainGain.gain.setValueAtTime(0.08, audioCtx.currentTime);
  
  rainSource.connect(lowpassFilter);
  lowpassFilter.connect(rainGain);
  rainGain.connect(audioCtx.destination);
  
  rainSource.start();
}

function stopCozyRain() {
  if (!isRainPlaying) return;
  isRainPlaying = false;
  try {
    rainSource.stop();
    rainSource.disconnect();
  } catch(e) {}
}

// Web Audio Cassette Canvas Visualizer Drawing
function startVisualizerDraw() {
  visualizerCanvas = document.getElementById("cassetteVisualizer");
  if (!visualizerCanvas) return;
  visualizerCtx = visualizerCanvas.getContext("2d");
  
  visualizerCanvas.width = visualizerCanvas.clientWidth;
  visualizerCanvas.height = visualizerCanvas.clientHeight;
  
  function draw() {
    if (!isLofiPlaying) {
      visualizerCtx.clearRect(0, 0, visualizerCanvas.width, visualizerCanvas.height);
      visualizerCtx.beginPath();
      visualizerCtx.moveTo(0, visualizerCanvas.height / 2);
      visualizerCtx.lineTo(visualizerCanvas.width, visualizerCanvas.height / 2);
      visualizerCtx.strokeStyle = getThemeNeonColor();
      visualizerCtx.lineWidth = 2;
      visualizerCtx.stroke();
      visualizerAnimId = requestAnimationFrame(draw);
      return;
    }
    
    visualizerAnimId = requestAnimationFrame(draw);
    analyser.getByteTimeDomainData(dataArray);
    
    visualizerCtx.clearRect(0, 0, visualizerCanvas.width, visualizerCanvas.height);
    visualizerCtx.lineWidth = 2.5;
    visualizerCtx.strokeStyle = getThemeNeonColor();
    visualizerCtx.shadowColor = getThemeNeonColor();
    visualizerCtx.shadowBlur = 8;
    visualizerCtx.beginPath();
    
    const sliceWidth = visualizerCanvas.width * 1.0 / dataArray.length;
    let x = 0;
    
    for (let i = 0; i < dataArray.length; i++) {
      const v = dataArray[i] / 128.0;
      const y = v * visualizerCanvas.height / 2;
      
      if (i === 0) {
        visualizerCtx.moveTo(x, y);
      } else {
        visualizerCtx.lineTo(x, y);
      }
      x += sliceWidth;
    }
    
    visualizerCtx.lineTo(visualizerCanvas.width, visualizerCanvas.height / 2);
    visualizerCtx.stroke();
    visualizerCtx.shadowBlur = 0;
  }
  draw();
}

function getThemeNeonColor() {
  if (targetTheme === "sakura") return "#f27b9b";
  if (targetTheme === "cafe") return "#ff7c43";
  if (targetTheme === "dream") return "#c09bf2";
  if (targetTheme === "rain") return "#00f2fe";
  return "#ffb7c5";
}

// SFX Synthesizers
const playFlipSFX = () => playSynthNote(350, 'triangle', 0.12, 600, 0.1);
const playMatchSFX = () => {
  playSynthNote(523.25, 'sine', 0.15, null, 0.1);
  setTimeout(() => playSynthNote(659.25, 'sine', 0.15, null, 0.1), 80);
  setTimeout(() => playSynthNote(783.99, 'sine', 0.25, null, 0.1), 160);
};
const playBubbleSFX = () => playSynthNote(450, 'sine', 0.06, null, 0.08);
const playDodgeSFX = () => playSynthNote(500, 'triangle', 0.12, 280, 0.08);
const playWinFanfare = () => {
  const notes = [523.25, 659.25, 783.99, 1046.50];
  notes.forEach((f, i) => {
    setTimeout(() => playSynthNote(f, 'sine', i === 3 ? 0.8 : 0.18, null, 0.12), i * 140);
  });
};

// =====================================================
// Weather API & Themes Cascading Integration
// =====================================================
let weatherData = null;

async function fetchWeatherAndSetTheme() {
  const statusAlerts = document.getElementById("statusAlerts");
  if (!statusAlerts) return;
  
  try {
    const response = await fetch("https://api.open-meteo.com/v1/forecast?latitude=-25.9989&longitude=28.1818&daily=weathercode,temperature_2m_max,temperature_2m_min,precipitation_probability_max&current_weather=true&timezone=Africa/Johannesburg");
    if (!response.ok) throw new Error("Failed to fetch weather forecast.");
    weatherData = await response.json();
    
    evaluateWeatherAlerts(weatherData);
    
    const isRaining = weatherData.current_weather && [51, 53, 55, 61, 63, 65, 80, 81, 82].includes(weatherData.current_weather.weathercode);
    const hours = new Date().getHours();
    
    if (isRaining) {
      switchTheme("rain");
    } else if (hours >= 19 || hours < 5) {
      switchTheme("dream");
    } else {
      switchTheme("sakura");
    }
  } catch (e) {
    console.warn("Weather API unreachable, loading fallback alerts and default theme.", e);
    evaluateFallbackAlerts();
  }
}

function evaluateWeatherAlerts(data) {
  const maxTemp = data.daily.temperature_2m_max[0];
  const rainProbToday = data.daily.precipitation_probability_max[0];
  const rainProbTomorrow = data.daily.precipitation_probability_max[1];
  
  if (rainProbToday > 40) {
    injectAlert("🌧️", `It might rain today in Ivory Park (Probability: ${rainProbToday}%). Make sure you carry an umbrella, sthandwa sam! ☔`);
  }
  if (rainProbTomorrow > 50) {
    injectAlert("👕", "Just checked the forecast — rain is coming tomorrow. Better do your laundry today while the sun is out! ☀️👕");
  }
  if (rainProbToday <= 15 && maxTemp > 26) {
    injectAlert("☀️", `It's going to be warm and beautiful today (${maxTemp}°C). Have a lovely walk, sthandwa sam!`);
  }
  
  updateWorkAlerts();
  updateLoadsheddingAlerts();
}

function evaluateFallbackAlerts() {
  const date = new Date();
  const day = date.getDay();
  if (day === 6 || day === 0) {
    injectAlert("☀️", "Beautiful weekend vibes! Hope you wake up with a smile today. 🌸");
  }
  updateWorkAlerts();
  updateLoadsheddingAlerts();
}

function injectAlert(icon, text) {
  const container = document.getElementById("statusAlerts");
  if (!container) return;
  const alertDiv = document.createElement("div");
  alertDiv.className = "status-alert-item";
  alertDiv.innerHTML = `<span class="status-alert-icon">${icon}</span><span class="status-alert-desc">${text}</span>`;
  container.appendChild(alertDiv);
}

// =====================================================
// Loadshedding Ivory Park Block 16 Schedule Simulator
// =====================================================
function updateLoadsheddingAlerts() {
  const now = new Date();
  const scheduleToday = getLoadsheddingSchedule(now);
  
  if (scheduleToday && scheduleToday.slots.length > 0) {
    const slotStr = scheduleToday.slots.join(", ");
    injectAlert("⚡", `Power Warning (Ivory Park Block 16): Loadshedding is scheduled for today at ${slotStr}. Remember to charge your phone and power bank! ⚡🔋`);
  } else {
    const tomorrow = new Date();
    tomorrow.setDate(now.getDate() + 1);
    const scheduleTomorrow = getLoadsheddingSchedule(tomorrow);
    if (scheduleTomorrow && scheduleTomorrow.slots.length > 0) {
      injectAlert("🔌", `Power Notice: Loadshedding is scheduled for tomorrow (Ivory Park Block 16) at ${scheduleTomorrow.slots.join(", ")}. Keep everything charged! 🔋`);
    } else {
      injectAlert("💡", "No loadshedding scheduled for Ivory Park Block 16 today or tomorrow. Enjoy the lights! 💡");
    }
  }
}

function getLoadsheddingSchedule(date) {
  const day = date.getDay();
  const stage = (day % 3 === 0) ? 0 : 2; 
  if (stage === 0) return null;
  
  const slots = [
    ["18:00 - 20:30"], // Sun
    ["02:00 - 04:30", "18:00 - 20:30"], // Mon
    ["10:00 - 12:30"], // Tue
    ["02:00 - 04:30", "10:00 - 12:30"], // Wed
    ["18:00 - 20:30"], // Thu
    ["10:00 - 12:30", "18:00 - 20:30"], // Fri
    ["02:00 - 04:30"]  // Sat
  ];
  return { stage, slots: slots[day] };
}

// =====================================================
// Work Hours Alerts (Monday & Friday, 6:00 - 18:00)
// =====================================================
function updateWorkAlerts() {
  const now = new Date();
  const day = now.getDay();
  const hours = now.getHours();
  
  if (day === 0) {
    injectAlert("💼", "Heads up sthandwa sam, just a reminder that I work early tomorrow (Monday, 06:00 - 18:00) so I might be offline during the day, but I'll text you the moment I finish! 💼");
  }
  else if (day === 4) {
    injectAlert("💼", "Heads up sthandwa sam, just a reminder that I work early tomorrow (Friday, 06:00 - 18:00). Have a beautiful day ahead! 💼🌸");
  }
  else if ((day === 1 || day === 5) && (hours >= 6 && hours < 18)) {
    injectAlert("💼", "I'm currently at work (06:00 - 18:00), counting down the hours until I can message you! 💼⏳");
  }
}

// =====================================================
// Theme Swapper & Visual Controller
// =====================================================
function switchTheme(themeId) {
  if (!THEME_COLORS[themeId]) return;
  targetTheme = themeId;
  
  document.body.className = `theme-${themeId}`;
  
  const rainControlSec = document.getElementById("rainControlSec");
  if (rainControlSec) {
    rainControlSec.style.display = (themeId === "rain") ? "block" : "none";
  }
  if (themeId !== "rain") {
    const rainToggle = document.getElementById("rainToggle");
    if (rainToggle) {
      rainToggle.checked = false;
    }
    stopCozyRain();
  }
  
  document.querySelectorAll(".theme-btn").forEach(btn => {
    btn.classList.remove("active");
  });
  const activeBtn = document.getElementById(`theme${themeId.charAt(0).toUpperCase() + themeId.slice(1)}`);
  if (activeBtn) activeBtn.classList.add("active");
  
  const cassetteTrackName = document.getElementById("cassetteTrackName");
  if (cassetteTrackName) {
    cassetteTrackName.textContent = `Lofi Melodies: Chord Tone ${currentChordIdx+1}`;
  }
  
  regeneratePetals(themeId);
}

function regeneratePetals(themeId) {
  const container = document.getElementById("petals");
  if (!container) return;
  container.innerHTML = "";
  
  let glyphs = ["🌸", "🌷", "💗", "❀"];
  if (themeId === "cafe") glyphs = ["🍂", "🍁", "☕", "🥧"];
  if (themeId === "dream") glyphs = ["⭐", "✨", "🌙", "☁️"];
  if (themeId === "rain") glyphs = ["🌧️", "💧", "🍃", "☔"];
  
  const count = window.innerWidth < 640 ? 12 : 24;
  for (let i = 0; i < count; i++) {
    const petal = document.createElement("span");
    petal.className = "petal";
    petal.textContent = glyphs[Math.floor(Math.random() * glyphs.length)];
    petal.style.left = Math.random() * 100 + "vw";
    petal.style.fontSize = 0.8 + Math.random() * 1.2 + "rem";
    petal.style.animationDuration = 7 + Math.random() * 11 + "s";
    petal.style.animationDelay = -Math.random() * 20 + "s";
    petal.style.setProperty("--drift-x", (Math.random() * 20 - 10) + "vw");
    petal.style.opacity = 0.4 + Math.random() * 0.5;
    container.appendChild(petal);
  }
}

document.getElementById("themeSakura").addEventListener("click", () => { playBubbleSFX(); switchTheme("sakura"); });
document.getElementById("themeCafe").addEventListener("click", () => { playBubbleSFX(); switchTheme("cafe"); });
document.getElementById("themeDream").addEventListener("click", () => { playBubbleSFX(); switchTheme("dream"); });
document.getElementById("themeRain").addEventListener("click", () => { playBubbleSFX(); switchTheme("rain"); });

document.getElementById("rainToggle").addEventListener("change", (e) => {
  if (e.target.checked) {
    startCozyRain();
  } else {
    stopCozyRain();
  }
});

// =====================================================
// Delayed Weekend Cleaning Popup Manager (Cached Weekly)
// =====================================================
function checkWeekendCleanPopup() {
  const now = new Date();
  const day = now.getDay();
  const isWeekend = (day === 0 || day === 6);
  
  if (isWeekend) {
    const delay = 5000 + Math.random() * 15000; // between 5 and 20 seconds
    setTimeout(() => {
      // Calculate weekend week index to ensure persistence for the same weekend
      const weekendId = `${now.getFullYear()}-W${getWeekNumber(now)}`;
      let chosenIdx = localStorage.getItem("ncumoWeekendPromptIdx");
      let savedWeekendId = localStorage.getItem("ncumoWeekendId");
      
      if (chosenIdx === null || savedWeekendId !== weekendId) {
        chosenIdx = Math.floor(Math.random() * WEEKEND_PROMPTS.length);
        localStorage.setItem("ncumoWeekendPromptIdx", chosenIdx);
        localStorage.setItem("ncumoWeekendId", weekendId);
      } else {
        chosenIdx = parseInt(chosenIdx, 10);
      }
      
      const promptObj = WEEKEND_PROMPTS[chosenIdx];
      const cleanModal = document.getElementById("weekendCleanModal");
      const cleanText = document.getElementById("weekendCleanText");
      const cleanBtns = document.getElementById("weekendCleanBtns");
      
      if (!cleanModal || !cleanText || !cleanBtns) return;
      
      cleanText.textContent = promptObj.text;
      cleanBtns.innerHTML = "";
      
      promptObj.responses.forEach(response => {
        const btn = document.createElement("button");
        btn.className = "weekend-clean-btn";
        btn.textContent = response;
        btn.addEventListener("click", () => {
          cleanModal.hidden = true;
          playMatchSFX();
          spawnSparklesAt(window.innerWidth / 2, window.innerHeight / 2, 12);
        });
        cleanBtns.appendChild(btn);
      });
      
      cleanModal.hidden = false;
      playSynthNote(440, 'sine', 0.3, 880, 0.1);
    }, delay);
  }
}
window.addEventListener("load", checkWeekendCleanPopup);

// =====================================================
// WebGL Heart Shader Render Loop (Smooth Color Fades)
// =====================================================
function initWebGLHeart() {
  const canvas = document.getElementById("webglCanvas");
  if (!canvas) return;
  
  const gl = canvas.getContext("webgl") || canvas.getContext("experimental-webgl");
  if (!gl) {
    runCanvasFallback();
    return;
  }
  
  const vsSource = `
    attribute vec2 position;
    void main() {
      gl_Position = vec4(position, 0.0, 1.0);
    }
  `;
  
  const fsSource = `
    precision highp float;
    uniform vec2 u_resolution;
    uniform float u_time;
    uniform vec2 u_mouse;
    
    uniform vec3 u_heartColor;
    uniform vec3 u_innerColor;
    uniform vec3 u_bgColor1;
    uniform vec3 u_bgColor2;
    uniform float u_theme; // 0.0: sakura, 1.0: cafe, 2.0: dream, 3.0: rain

    float sdHeart(vec3 p) {
      p.x = abs(p.x);
      p.y += 0.35;
      float z = p.z;
      float y = p.y;
      float x = p.x;
      
      float a = x*x + 1.8*y*y + z*z - 0.85;
      float h = x*x*z*z*z * 0.5;
      return a*a*a - h;
    }

    float map(vec3 p) {
      float pulse = 1.0 + 0.07 * sin(u_time * 4.2);
      p /= pulse;
      
      float rx = u_mouse.y * 0.4;
      float ry = u_mouse.x * 0.5 + u_time * 0.22;
      
      float cy = cos(ry), sy = sin(ry);
      p.xz = mat2(cy, -sy, sy, cy) * p.xz;
      
      float cx = cos(rx), sx = sin(rx);
      p.yz = mat2(cx, -sx, sx, cx) * p.yz;
      
      return sdHeart(p) * 0.25 * pulse;
    }

    vec3 calcNormal(vec3 p) {
      vec2 e = vec2(0.001, 0.0);
      return normalize(vec3(
        map(p + e.xyy) - map(p - e.xyy),
        map(p + e.yxy) - map(p - e.yxy),
        map(p + e.yyx) - map(p - e.yyx)
      ));
    }

    void main() {
      vec2 uv = (gl_FragCoord.xy - 0.5 * u_resolution.xy) / u_resolution.y;
      
      // Dynamic coordinate distortion based on weather themes
      if (u_theme == 1.0) {
        // Sunset Cafe: Heat wave wobble
        float heat = sin(uv.y * 12.0 + u_time * 2.5) * 0.004;
        uv.x += heat;
      } else if (u_theme == 3.0) {
        // Lofi Rain: Refractive screen raindrop ripples
        float ripple = sin(uv.y * 30.0 + u_time * 4.0) * cos(uv.x * 20.0 - u_time * 2.0);
        if (ripple > 0.982) {
          uv += vec2(sin(u_time + uv.y * 10.0), cos(u_time + uv.x * 10.0)) * 0.015;
        }
      }

      vec3 col = u_bgColor1;
      float dist = length(uv - vec2(0.0, 0.05));
      float wave = sin(uv.x * 2.5 + u_time * 0.4) * cos(uv.y * 2.5 + u_time * 0.4);
      col = mix(col, u_bgColor2, smoothstep(0.85, 0.25, dist + wave * 0.1));
      col = mix(col, u_innerColor, smoothstep(0.45, 0.0, dist + wave * 0.15) * 0.5);

      // WebGL Environmental Weather Graphics
      if (u_theme == 0.0) {
        // Sakura / Sunny: Drifting light rays and warm rising ember particles
        float rays = sin(uv.x * 3.0 + uv.y * 1.5 - u_time * 0.8) * cos(-uv.x * 1.0 + uv.y * 2.0 + u_time * 0.4);
        col += vec3(1.0, 0.92, 0.94) * max(0.0, rays) * 0.05;
        
        float embers = sin(uv.x * 35.0 + u_time) * cos(uv.y * 35.0 - u_time * 0.7);
        if (embers > 0.975) {
          col += vec3(0.98, 0.65, 0.75) * (0.3 + 0.7 * sin(u_time * 2.0 + uv.x * 100.0)) * 0.4;
        }
      } else if (u_theme == 1.0) {
        // Sunset Cafe: Sunset solar corona aura
        float aura = 1.0 / (dist * 10.0 + 1.0);
        col += vec3(1.0, 0.55, 0.25) * aura * 0.28;
      } else if (u_theme == 2.0) {
        // Midnight Dream: Rotating galaxy core and twinkling stars field
        float angle = u_time * 0.12;
        float s = sin(angle), c = cos(angle);
        vec2 rotUv = mat2(c, -s, s, c) * uv;
        float spiral = sin(length(rotUv) * 15.0 - u_time * 1.5 + atan(rotUv.y, rotUv.x));
        col += vec3(0.65, 0.45, 0.95) * max(0.0, spiral) * 0.05 / (length(rotUv) + 0.1);
        
        float starsField = sin(uv.x * 45.0 + sin(uv.y * 20.0)) * cos(uv.y * 45.0 + u_time * 1.8);
        if (starsField > 0.985) {
          col += vec3(1.0, 0.95, 0.7) * (0.4 + 0.6 * sin(u_time * 3.0 + uv.y * 50.0));
        }
      } else if (u_theme == 3.0) {
        // Lofi Rain: Falling rain streaks scrolling down
        float rainStreak = sin(uv.x * 50.0 + uv.y * 5.0) * cos(uv.y * 10.0 + u_time * 8.0);
        if (rainStreak > 0.95) {
          col = mix(col, vec3(0.72, 0.84, 0.92), 0.15 * max(0.0, rainStreak));
        }
      }

      vec3 ro = vec3(0.0, 0.0, 4.0);
      vec3 rd = normalize(vec3(uv, -1.5));
      
      float t = 0.0;
      float maxT = 8.0;
      bool hit = false;
      
      for (int i = 0; i < 70; i++) {
        vec3 p = ro + rd * t;
        float d = map(p);
        if (d < 0.001) {
          hit = true;
          break;
        }
        t += d * 0.25;
        if (t > maxT) break;
      }
      
      if (hit) {
        vec3 p = ro + rd * t;
        vec3 n = calcNormal(p);
        
        vec3 lightDir = normalize(vec3(1.0, 2.0, 3.0));
        vec3 viewDir = normalize(ro - p);
        
        float diff = max(0.0, dot(n, lightDir));
        vec3 halfDir = normalize(lightDir + viewDir);
        float spec = pow(max(0.0, dot(n, halfDir)), 28.0);
        
        float rim = 1.0 - max(0.0, dot(n, viewDir));
        vec3 shaded = mix(u_heartColor, u_innerColor, rim * 0.4);
        
        vec3 litColor = shaded * (diff * 0.7 + 0.3) + vec3(1.0) * spec * 0.75;
        col = mix(col, litColor, 0.94);
      }
      
      gl_FragColor = vec4(col, 1.0);
    }
  `;
  
  function compileShader(source, type) {
    const shader = gl.createShader(type);
    gl.shaderSource(shader, source);
    gl.compileShader(shader);
    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
      throw new Error(gl.getShaderInfoLog(shader));
    }
    return shader;
  }
  
  try {
    const vs = compileShader(vsSource, gl.VERTEX_SHADER);
    const fs = compileShader(fsSource, gl.FRAGMENT_SHADER);
    
    const program = gl.createProgram();
    gl.attachShader(program, vs);
    gl.attachShader(program, fs);
    gl.linkProgram(program);
    
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      throw new Error(gl.getProgramInfoLog(program));
    }
    
    gl.useProgram(program);
    
    const vertices = new Float32Array([
      -1.0, -1.0,
       1.0, -1.0,
      -1.0,  1.0,
      -1.0,  1.0,
       1.0, -1.0,
       1.0,  1.0,
    ]);
    
    const buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);
    
    const posAttr = gl.getAttribLocation(program, "position");
    gl.enableVertexAttribArray(posAttr);
    gl.vertexAttribPointer(posAttr, 2, gl.FLOAT, false, 0, 0);
    
    const uResolution = gl.getUniformLocation(program, "u_resolution");
    const uTime = gl.getUniformLocation(program, "u_time");
    const uMouse = gl.getUniformLocation(program, "u_mouse");
    
    const uHeartColor = gl.getUniformLocation(program, "u_heartColor");
    const uInnerColor = gl.getUniformLocation(program, "u_innerColor");
    const uBg1 = gl.getUniformLocation(program, "u_bgColor1");
    const uBg2 = gl.getUniformLocation(program, "u_bgColor2");
    const uTheme = gl.getUniformLocation(program, "u_theme");
    
    let startTime = Date.now();
    let smoothMouseX = 0, smoothMouseY = 0;
    
    function resize() {
      const displayWidth = canvas.clientWidth;
      const displayHeight = canvas.clientHeight;
      if (canvas.width !== displayWidth || canvas.height !== displayHeight) {
        canvas.width = displayWidth;
        canvas.height = displayHeight;
        gl.viewport(0, 0, canvas.width, canvas.height);
      }
    }
    
    function renderShader() {
      resize();
      const elapsed = (Date.now() - startTime) * 0.001;
      
      smoothMouseX += (mouseX - smoothMouseX) * 0.05;
      smoothMouseY += (mouseY - smoothMouseY) * 0.05;
      
      // Interpolate colors smoothly
      const targetColors = THEME_COLORS[targetTheme];
      for (let i = 0; i < 3; i++) {
        curHeartColor[i] += (targetColors.heart[i] - curHeartColor[i]) * 0.04;
        curInnerColor[i] += (targetColors.inner[i] - curInnerColor[i]) * 0.04;
        curBg1Color[i] += (targetColors.bg1[i] - curBg1Color[i]) * 0.04;
        curBg2Color[i] += (targetColors.bg2[i] - curBg2Color[i]) * 0.04;
      }
      
      // Map active theme ID to uniform float
      let themeVal = 0.0; // sakura
      if (targetTheme === "cafe") themeVal = 1.0;
      if (targetTheme === "dream") themeVal = 2.0;
      if (targetTheme === "rain") themeVal = 3.0;
      
      gl.uniform2f(uResolution, canvas.width, canvas.height);
      gl.uniform1f(uTime, elapsed);
      gl.uniform2f(uMouse, smoothMouseX, smoothMouseY);
      
      gl.uniform3fv(uHeartColor, new Float32Array(curHeartColor));
      gl.uniform3fv(uInnerColor, new Float32Array(curInnerColor));
      gl.uniform3fv(uBg1, new Float32Array(curBg1Color));
      gl.uniform3fv(uBg2, new Float32Array(curBg2Color));
      gl.uniform1f(uTheme, themeVal);
      
      gl.drawArrays(gl.TRIANGLES, 0, 6);
      requestAnimationFrame(renderShader);
    }
    
    renderShader();
  } catch (e) {
    console.warn("Shader compilation failed, loading 2D canvas fallback.", e);
    runCanvasFallback();
  }
}

// 2D Canvas Fallback
function runCanvasFallback() {
  const canvas = document.getElementById("webglCanvas");
  if (!canvas) return;
  const ctx = canvas.getContext("2d");
  let width = canvas.width = canvas.clientWidth;
  let height = canvas.height = canvas.clientHeight;
  
  window.addEventListener("resize", () => {
    width = canvas.width = canvas.clientWidth;
    height = canvas.height = canvas.clientHeight;
  });
  
  const heartParticles = [];
  const numHeart = 180;
  for (let i = 0; i < numHeart; i++) {
    const t = Math.PI * 2 * Math.random();
    const r = 0.2 + 0.8 * Math.sqrt(Math.random());
    const x = 16 * Math.pow(Math.sin(t), 3) * r;
    const y = -(13 * Math.cos(t) - 5 * Math.cos(2*t) - 2 * Math.cos(3*t) - Math.cos(4*t)) * r;
    heartParticles.push({
      ox: x * 6,
      oy: y * 6,
      size: 1.5 + Math.random() * 2,
      color: r < 0.35 ? "rgba(255, 220, 150, " : "rgba(255, 183, 197, "
    });
  }
  
  const ringParticles = [];
  const numRing = 100;
  for (let i = 0; i < numRing; i++) {
    ringParticles.push({
      radius: 90 + Math.random() * 50,
      theta: Math.random() * Math.PI * 2,
      speed: 0.01 + Math.random() * 0.015,
      size: 1.0 + Math.random() * 1.5,
      color: i < 50 ? "rgba(255, 230, 160, " : "rgba(230, 190, 255, "
    });
  }
  
  const sparks = [];
  const numSparks = 50;
  for (let i = 0; i < numSparks; i++) {
    sparks.push({
      x: (Math.random() - 0.5) * 150,
      y: 100 + Math.random() * 100,
      vy: 1.0 + Math.random() * 1.5,
      vx: (Math.random() - 0.5) * 0.5,
      size: 1.0 + Math.random() * 1.8,
      alpha: 0.3 + Math.random() * 0.6
    });
  }
  
  let angle = 0;
  function animate() {
    ctx.clearRect(0, 0, width, height);
    const pulse = 1 + 0.06 * Math.sin(angle);
    angle += 0.05;
    
    ctx.save();
    ctx.translate(width / 2, height / 2);
    
    heartParticles.forEach((p, idx) => {
      const bx = p.ox * pulse + Math.sin(angle + idx * 0.1) * 3;
      const by = p.oy * pulse + Math.cos(angle + idx * 0.1) * 3;
      const px = bx + mouseX * 25;
      const py = by - mouseY * 25;
      ctx.fillStyle = p.color + (0.4 + Math.random() * 0.4) + ")";
      ctx.beginPath();
      ctx.arc(px, py, p.size, 0, Math.PI * 2);
      ctx.fill();
    });
    
    ringParticles.forEach(p => {
      p.theta += p.speed;
      const rx = p.radius * Math.cos(p.theta) + mouseX * 25;
      const ry = p.radius * Math.sin(p.theta) * 0.3 - mouseY * 25;
      ctx.fillStyle = p.color + "0.65)";
      ctx.beginPath();
      ctx.arc(rx, ry, p.size, 0, Math.PI * 2);
      ctx.fill();
    });
    
    sparks.forEach(p => {
      p.y -= p.vy;
      p.x += p.vx + Math.sin(angle + p.y * 0.02) * 0.2;
      if (p.y < -height / 2) {
        p.y = height / 2 + Math.random() * 50;
        p.x = (Math.random() - 0.5) * 120;
      }
      const px = p.x + mouseX * 10;
      const py = p.y - mouseY * 10;
      ctx.fillStyle = `rgba(255, 183, 197, ${p.alpha})`;
      ctx.beginPath();
      ctx.arc(px, py, p.size, 0, Math.PI * 2);
      ctx.fill();
    });
    
    ctx.restore();
    requestAnimationFrame(animate);
  }
  animate();
}

// =====================================================
// Twinkling Star Canvas Handler (For Midnight Theme)
// =====================================================
const starCanvas = document.getElementById("starCanvas");
const starCtx = starCanvas.getContext("2d");
let stars = [];

function resizeStarCanvas() {
  starCanvas.width = window.innerWidth;
  starCanvas.height = window.innerHeight;
  initStars();
}
function initStars() {
  stars = [];
  const count = Math.floor((starCanvas.width * starCanvas.height) / 10000);
  for (let i = 0; i < count; i++) {
    stars.push({
      x: Math.random() * starCanvas.width,
      y: Math.random() * starCanvas.height,
      size: Math.random() * 1.5,
      alpha: Math.random(),
      speed: 0.01 + Math.random() * 0.02
    });
  }
}
function drawStars() {
  starCtx.clearRect(0, 0, starCanvas.width, starCanvas.height);
  if (document.body.classList.contains("theme-dream")) {
    starCtx.fillStyle = "#ffffff";
    stars.forEach(s => {
      s.alpha += s.speed;
      if (s.alpha > 1 || s.alpha < 0) s.speed = -s.speed;
      starCtx.globalAlpha = Math.max(0, s.alpha);
      starCtx.fillRect(s.x, s.y, s.size, s.size);
    });
  }
  requestAnimationFrame(drawStars);
}
window.addEventListener("resize", resizeStarCanvas);
resizeStarCanvas();
drawStars();

// =====================================================
// Confetti & Sparkles Particle Engine
// =====================================================
const partCanvas = document.getElementById("particleCanvas");
const partCtx = partCanvas.getContext("2d");
let particles = [];

function resizeParticleCanvas() {
  partCanvas.width = window.innerWidth;
  partCanvas.height = window.innerHeight;
}
window.addEventListener("resize", resizeParticleCanvas);
resizeParticleCanvas();

class Particle {
  constructor(x, y, char, size, color) {
    this.x = x;
    this.y = y;
    this.char = char;
    this.size = size || 10 + Math.random() * 18;
    this.color = color || "var(--sakura-deep)";
    this.vx = (Math.random() - 0.5) * 6;
    this.vy = -(3 + Math.random() * 5);
    this.alpha = 1;
    this.decay = 0.015 + Math.random() * 0.02;
    this.rotation = Math.random() * 360;
    this.rotationSpeed = (Math.random() - 0.5) * 4;
  }
  update() {
    this.x += this.vx;
    this.y += this.vy;
    this.vy += 0.1; // gravity
    this.alpha -= this.decay;
    this.rotation += this.rotationSpeed;
  }
  draw() {
    partCtx.save();
    partCtx.globalAlpha = this.alpha;
    partCtx.translate(this.x, this.y);
    partCtx.rotate((this.rotation * Math.PI) / 180);
    partCtx.font = `${this.size}px sans-serif`;
    partCtx.textAlign = "center";
    partCtx.textBaseline = "middle";
    partCtx.fillText(this.char, 0, 0);
    partCtx.restore();
  }
}

function spawnSparklesAt(x, y, count = 6, chars = ["✨", "💖", "🌸", "🌟"]) {
  for (let i = 0; i < count; i++) {
    const char = chars[Math.floor(Math.random() * chars.length)];
    particles.push(new Particle(x, y, char));
  }
}

function triggerWinConfetti() {
  const x = partCanvas.width / 2;
  const y = partCanvas.height * 0.7;
  const emojis = ["💖", "🌸", "✨", "🎀", "🧸", "🌷", "💗"];
  for (let i = 0; i < 60; i++) {
    const char = emojis[Math.floor(Math.random() * emojis.length)];
    const p = new Particle(x, y, char, 16 + Math.random() * 22);
    p.vx = (Math.random() - 0.5) * 12;
    p.vy = -(8 + Math.random() * 12);
    particles.push(p);
  }
  playWinFanfare();
}

function drawParticles() {
  partCtx.clearRect(0, 0, partCanvas.width, partCanvas.height);
  particles = particles.filter(p => {
    p.update();
    p.draw();
    return p.alpha > 0;
  });
  requestAnimationFrame(drawParticles);
}
drawParticles();

window.addEventListener("click", (e) => {
  if (e.target.tagName !== "BUTTON" && e.target.tagName !== "A" && !e.target.closest(".theme-selector")) {
    spawnSparklesAt(e.clientX, e.clientY);
  }
});

// =====================================================
// Scroll Reveal Elements
// =====================================================
const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add("visible");
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.1 });
document.querySelectorAll(".reveal").forEach((el) => observer.observe(el));

// =====================================================
// UI Note Modal & Menu Toggles
// =====================================================
const modal = document.getElementById("modal");
const modalText = document.getElementById("modalText");
const modalClose = document.getElementById("modalClose");
const navToggle = document.getElementById("navToggle");
const navLinks = document.getElementById("navLinks");

document.querySelectorAll(".note").forEach((note) => {
  note.addEventListener("click", () => {
    modalText.textContent = note.dataset.note;
    modal.hidden = false;
    playBubbleSFX();
    unlockAchievement("visited_all");
  });
});
modalClose.addEventListener("click", () => {
  modal.hidden = true;
  playBubbleSFX();
});
modal.addEventListener("click", (e) => {
  if (e.target === modal) modal.hidden = true;
});
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") modal.hidden = true;
});

navToggle.addEventListener("click", () => {
  navLinks.classList.toggle("active");
  playBubbleSFX();
});
document.querySelectorAll(".nav__links a").forEach(link => {
  link.addEventListener("click", () => {
    navLinks.classList.remove("active");
  });
});

// Wax Envelope Open Letter Toggler
const envelope = document.getElementById("loveLetterEnvelope");
envelope.addEventListener("click", (e) => {
  e.stopPropagation();
  const open = envelope.classList.toggle("open");
  playSynthNote(open ? 440 : 330, 'sine', 0.25, open ? 880 : 220, 0.1);
  if (open) {
    spawnSparklesAt(window.innerWidth / 2, window.innerHeight / 2, 12);
  }
});

// =====================================================
// Date Tickers & Anniversary Counters
// =====================================================
const ANNIVERSARY = new Date(2026, 5, 5); // June 5, 2026
const HER_BIRTHDAY = new Date(2026, 0, 29); // Jan 29
const MY_BIRTHDAY = new Date(2026, 11, 8); // Dec 8

function updateAnniversaryProgress(daysElapsed) {
  const monthProgress = (daysElapsed % 30.4) / 30.4;
  const yearProgress = (daysElapsed % 365.25) / 365.25;
  
  const mCircle = document.getElementById("monthProgressCircle");
  const yCircle = document.getElementById("yearProgressCircle");
  const circ = 2 * Math.PI * 36;
  
  if (mCircle && yCircle) {
    mCircle.style.strokeDasharray = `${circ} ${circ}`;
    mCircle.style.strokeDashoffset = circ - (monthProgress * circ);
    
    yCircle.style.strokeDasharray = `${circ} ${circ}`;
    yCircle.style.strokeDashoffset = circ - (yearProgress * circ);
  }
}

function updateTogether() {
  let diff = Date.now() - ANNIVERSARY.getTime();
  if (diff < 0) diff = 0;
  const secs = Math.floor(diff / 1000);
  const daysVal = Math.floor(secs / 86400);
  
  document.getElementById("cDays").textContent = daysVal;
  document.getElementById("cHours").textContent = Math.floor((secs % 86400) / 3600);
  document.getElementById("cMins").textContent = Math.floor((secs % 3600) / 60);
  document.getElementById("cSecs").textContent = secs % 60;
  
  updateAnniversaryProgress(daysVal);
}
updateTogether();
setInterval(updateTogether, 1000);

function updateBirthdays() {
  const now = new Date();
  let nextHer = new Date(now.getFullYear(), HER_BIRTHDAY.getMonth(), HER_BIRTHDAY.getDate());
  let nextMine = new Date(now.getFullYear(), MY_BIRTHDAY.getMonth(), MY_BIRTHDAY.getDate());

  if (now > nextHer) nextHer.setFullYear(now.getFullYear() + 1);
  if (now > nextMine) nextMine.setFullYear(now.getFullYear() + 1);

  const daysHer = Math.ceil((nextHer - now) / 86400000);
  const daysMine = Math.ceil((nextMine - now) / 86400000);

  document.getElementById("herBirthday").textContent = daysHer;
  document.getElementById("myBirthday").textContent = daysMine;
}
updateBirthdays();
setInterval(updateBirthdays, 60000);

document.getElementById("cardHerBday").addEventListener("click", () => {
  playSynthNote(523, 'sine', 0.25, 783);
  modalText.textContent = "29 January — An Aquarius princess who lights up the whole room! 🌟";
  modal.hidden = false;
});
document.getElementById("cardMyBday").addEventListener("click", () => {
  playSynthNote(349, 'sine', 0.25, 523);
  modalText.textContent = "8 December — A Sagittarius guy who is incredibly lucky to have you. ♐";
  modal.hidden = false;
});

// Weekend Countdown
const weekendText = document.getElementById("weekendText");
function updateWeekend() {
  const now = new Date();
  const day = now.getDay();
  if (day === 6 || day === 0) {
    weekendText.innerHTML = "It's the weekend — you're mine right now 💖";
    return;
  }
  const next = new Date(now);
  next.setDate(now.getDate() + ((6 - day + 7) % 7));
  next.setHours(0, 0, 0, 0);
  const diff = next - now;
  const d = Math.floor(diff / 86400000);
  const h = Math.floor((diff % 86400000) / 3600000);
  const m = Math.floor((diff % 3600000) / 60000);
  weekendText.textContent = `${d}d ${h}h ${m}m until I see you again, Ziyanda ♡`;
}
updateWeekend();
setInterval(updateWeekend, 30000);

// =====================================================
// Seeded Dynamic Populators (Daily Updates)
// =====================================================
function populateAdjectives() {
  const container = document.querySelector(".about__words");
  if (!container) return;
  container.innerHTML = "";
  
  const seed = getDaySeed();
  const rnd = createPRNG(seed);
  
  const adjCopy = [...ADJECTIVES];
  const selected = [];
  for (let i = 0; i < 6; i++) {
    const idx = Math.floor(rnd() * adjCopy.length);
    selected.push(adjCopy.splice(idx, 1)[0]);
  }
  
  selected.forEach(word => {
    const span = document.createElement("span");
    span.className = "word-chip";
    span.textContent = word;
    container.appendChild(span);
  });
}

function populateLoveNotes() {
  const notes = document.querySelectorAll(".note");
  const seed = getDaySeed();
  const rnd = createPRNG(seed + 12345);
  
  const templates = [
    () => {
      const o = NOTE1_OPENINGS[Math.floor(rnd() * NOTE1_OPENINGS.length)];
      const b = NOTE1_BODIES[Math.floor(rnd() * NOTE1_BODIES.length)];
      const c = NOTE1_CLOSINGS[Math.floor(rnd() * NOTE1_CLOSINGS.length)];
      return `${o} ${b} ${c}`;
    },
    () => {
      const o = NOTE2_OPENINGS[Math.floor(rnd() * NOTE2_OPENINGS.length)];
      const b = NOTE2_BODIES[Math.floor(rnd() * NOTE2_BODIES.length)];
      const c = NOTE2_CLOSINGS[Math.floor(rnd() * NOTE2_CLOSINGS.length)];
      return `${o} ${b} ${c}`;
    },
    () => {
      const o = NOTE3_OPENINGS[Math.floor(rnd() * NOTE3_OPENINGS.length)];
      const b = NOTE3_BODIES[Math.floor(rnd() * NOTE3_BODIES.length)];
      const c = NOTE3_CLOSINGS[Math.floor(rnd() * NOTE3_CLOSINGS.length)];
      return `${o} ${b} ${c}`;
    },
    () => {
      const o = NOTE4_OPENINGS[Math.floor(rnd() * NOTE4_OPENINGS.length)];
      const b = NOTE4_BODIES[Math.floor(rnd() * NOTE4_BODIES.length)];
      const c = NOTE4_CLOSINGS[Math.floor(rnd() * NOTE4_CLOSINGS.length)];
      return `${o} ${b} ${c}`;
    }
  ];
  
  notes.forEach((noteBtn, idx) => {
    if (idx < templates.length) {
      const noteText = templates[idx]();
      noteBtn.dataset.note = noteText;
    }
  });
}

function populateEnvelopeLetter() {
  const letterEl = document.querySelector(".envelope__letter");
  if (!letterEl) return;
  const now = new Date();
  const day = now.getDate();
  const month = now.getMonth();
  
  let letterTitle = "Dearest Ziyanda,";
  let letterText = "";
  
  if (month === 0 && day === 29) {
    letterTitle = "Happy Birthday Ziyanda! 🎂";
    letterText = "Happy Birthday to the most beautiful girl in the universe! Today is all about celebrating you, my Ziyanda. You deserve all the joy, smiles, and love in the world. I'm so lucky to have you. Ndiyakuthanda! 🎂💖<br><br>— Yours ♡";
  } else if (month === 11 && day === 8) {
    letterTitle = "Happy Birthday to Me! 🎉";
    letterText = "It's my birthday today, but the greatest gift I could ever ask for is having you in my life. Thank you for making my world so much brighter. I'm so glad we get to celebrate these days together. ♡<br><br>— Yours ♡";
  } else if (day === 5) {
    letterTitle = "Happy Monthly Anniversary! 💍";
    letterText = "Happy Monthly Anniversary, sthandwa sam! Another month of being mine, of weekend dates, of endless laughs, and growing love. Here's to forever. Ndiyakuthanda, Ncumolwakhe! 💍✨<br><br>— Yours ♡";
  } else {
    const seed = getDaySeed();
    const rnd = createPRNG(seed + 999);
    const letterOpenings = [
      "This little corner of the internet is dedicated to your beautiful smile. Thank you for filling my weekends with laughter and making the weekdays worth grinding for.",
      "Just wanted to write you a tiny reminder today of how much you mean to me. You bring so much color and warmth to my life.",
      "Every single day since we started this journey, my feelings for you have grown stronger. You are my sunshine and my safest space.",
      "No matter how tough or busy the weekdays get, thinking of you always brings a smile to my face. I'm so lucky to have you."
    ];
    const letterBodies = [
      " You are irreplaceable, and I cherish every little thing about you—your laugh, your kindness, and the way you look at me.",
      " I hope this day brings you as much happiness as you bring to my heart every single second.",
      " I'm constantly counting down the days until the weekend, so I can see you again and make you laugh.",
      " You make everything feel so special. I'm looking forward to all our future dates and adventures together."
    ];
    const letterClosings = [
      "<br><br>Ndiyakuthanda, Ncumolwakhe! ♡<br><br>— Yours ♡",
      "<br><br>Forever yours, sthandwa sam! 💖<br><br>— Yours ♡",
      "<br><br>Always and forever, my love! 💍<br><br>— Yours ♡",
      "<br><br>With all my love, sthandwa sam! 🌸<br><br>— Yours ♡"
    ];
    
    const opening = letterOpenings[Math.floor(rnd() * letterOpenings.length)];
    const body = letterBodies[Math.floor(rnd() * letterBodies.length)];
    const closing = letterClosings[Math.floor(rnd() * letterClosings.length)];
    letterText = `${opening}${body}${closing}`;
  }
  
  letterEl.innerHTML = `<h4>${letterTitle}</h4><p>${letterText}</p>`;
}

function setupDailyQuote() {
  const seed = getDaySeed();
  const rnd = createPRNG(seed + 777);
  const q = ANIME_QUOTES[Math.floor(rnd() * ANIME_QUOTES.length)];
  const quoteEl = document.getElementById("animeQuote");
  if (quoteEl) {
    quoteEl.textContent = `${q.text} — ${q.author}`;
  }
}

function populateTimeline() {
  const timeline = document.querySelector(".timeline");
  if (!timeline) return;
  const items = timeline.querySelectorAll(".timeline__item");
  
  const diff = Date.now() - ANNIVERSARY.getTime();
  const daysVal = Math.max(0, Math.floor(diff / 86400000));
  
  const existingDyn = timeline.querySelector(".timeline__item--dynamic");
  if (existingDyn) existingDyn.remove();
  
  const dynNode = document.createElement("div");
  dynNode.className = "timeline__item timeline__item--dynamic reveal visible";
  
  const seed = getDaySeed();
  const rnd = createPRNG(seed + 8888);
  const milestoneNotes = [
    "Laughing together, holding hands, and making every second count.",
    "Another beautiful day in our story. Every page is better with you.",
    "Days are passing, but my love for you keeps growing higher.",
    "So grateful for every laugh we shared and every plan we are building.",
    "Watching our future dreams fold closer day by day."
  ];
  const noteText = milestoneNotes[Math.floor(rnd() * milestoneNotes.length)];
  const todayStr = new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
  
  dynNode.innerHTML = `
    <div class="timeline__node"></div>
    <div class="timeline__content">
      <span class="timeline__date">${todayStr} (Day ${daysVal})</span>
      <h4 class="timeline__title">Today With You 💖</h4>
      <p class="timeline__desc">${noteText}</p>
    </div>
  `;
  
  const lastItem = items[items.length - 1];
  timeline.insertBefore(dynNode, lastItem);
}

function updateGreetingMessage() {
  const greetingBox = document.getElementById("heroGreeting");
  const greetingEl = document.getElementById("heroGreetingText");
  if (!greetingBox || !greetingEl) return;
  
  const now = new Date();
  const day = now.getDay();
  const hours = now.getHours();
  let msg = "";
  
  const isWeekend = (day === 0 || day === 6);
  if (isWeekend) {
    msg = "Shouldn't you be with me? 😉";
  } else {
    if (hours >= 20) {
      msg = "It's late, Ncumo. Go get some rest. 🌙";
    } else if (hours < 5) {
      msg = "Go back to sleep, sthandwa sam. Dreamland is waiting for you. 🥱💤";
    } else if (hours === 5) {
      msg = "Up early? Good morning! ☀️";
    } else if (hours === 6) {
      msg = "Good morning, Ncumolwakhe. Hope you woke up with a smile today! ☀️🌸";
    } else {
      msg = "Have a good day! Go crush it. 🚀✨";
    }
  }
  greetingEl.textContent = msg;
  greetingBox.hidden = false;
}

// Call populators & alert checkers
populateAdjectives();
populateLoveNotes();
populateEnvelopeLetter();
setupDailyQuote();
populateTimeline();
updateGreetingMessage();
fetchWeatherAndSetTheme();
initWebGLHeart();

// Quote changer
let currentQuoteIdx = 0;
document.getElementById("nextQuote").addEventListener("click", () => {
  playBubbleSFX();
  let nextIdx = currentQuoteIdx;
  while (nextIdx === currentQuoteIdx) {
    nextIdx = Math.floor(Math.random() * ANIME_QUOTES.length);
  }
  currentQuoteIdx = nextIdx;
  const q = ANIME_QUOTES[currentQuoteIdx];
  const textEl = document.getElementById("animeQuote");
  textEl.style.opacity = 0;
  setTimeout(() => {
    textEl.textContent = `${q.text} — ${q.author}`;
    textEl.style.opacity = 1;
  }, 200);
  spawnSparklesAt(window.innerWidth / 2, window.innerHeight * 0.4, 4);
});

// =====================================================
// Achievements Badge Locker
// =====================================================
let achievements = JSON.parse(localStorage.getItem("ncumoAchievements")) || [];
function initAchievements() {
  const grid = document.getElementById("achievementsGrid");
  if (!grid) return;
  grid.innerHTML = "";
  ACHIEVEMENTS.forEach(ach => {
    const div = document.createElement("div");
    div.className = "achievement";
    if (achievements.includes(ach.id)) div.classList.add("unlocked");
    div.innerHTML = `<span class="achievement__icon">${ach.icon}</span><div class="achievement__label">${ach.label}</div>`;
    grid.appendChild(div);
  });
}
function unlockAchievement(id) {
  if (!achievements.includes(id)) {
    achievements.push(id);
    localStorage.setItem("ncumoAchievements", JSON.stringify(achievements));
    initAchievements();
    setTimeout(triggerWinConfetti, 100);
  }
}
initAchievements();

// =====================================================
// Bucket List Manager
// =====================================================
let bucketItems = JSON.parse(localStorage.getItem("ncumoBucketList")) || DEFAULT_BUCKET_ITEMS;
function renderBucketList() {
  const grid = document.getElementById("bucketGrid");
  if (!grid) return;
  grid.innerHTML = "";
  bucketItems.forEach((item, i) => {
    const div = document.createElement("div");
    div.className = "bucket-item";
    if (item.done) div.classList.add("done");
    div.innerHTML = `<span class="bucket-emoji">${item.emoji}</span><div class="bucket-text">${item.text}</div>`;
    div.addEventListener("click", () => {
      item.done = !item.done;
      playBubbleSFX();
      localStorage.setItem("ncumoBucketList", JSON.stringify(bucketItems));
      renderBucketList();
    });
    grid.appendChild(div);
  });
}
document.getElementById("bucketAddBtn").addEventListener("click", () => {
  const val = document.getElementById("bucketInput").value.trim();
  if (val) {
    bucketItems.push({ emoji: "✨", text: val, done: false });
    localStorage.setItem("ncumoBucketList", JSON.stringify(bucketItems));
    document.getElementById("bucketInput").value = "";
    playBubbleSFX();
    renderBucketList();
    spawnSparklesAt(window.innerWidth / 2, window.innerHeight * 0.7, 5);
  }
});
renderBucketList();

// =====================================================
// Game 1: Flower Memory Match (Stages/Levels)
// =====================================================
const memoryGrid = document.getElementById("memoryGrid");
const memMoves = document.getElementById("memMoves");
const memPairs = document.getElementById("memPairs");
const memWin = document.getElementById("memWin");
const memReset = document.getElementById("memReset");

let memFirst = null;
let memLock = false;
let memMatched = 0;
let memMoveCount = 0;
let memLevel = 1;

const MEM_LEVELS = [
  { pairs: 2, cols: 2, name: "First Blush 🌸", emojis: ["🌸", "💖"] },
  { pairs: 4, cols: 4, name: "Growing Feelings 🌷", emojis: ["🌸", "🌷", "💖", "🧸"] },
  { pairs: 6, cols: 4, name: "Sweet Harmony 🦋", emojis: ["🌸", "🌷", "💖", "🧸", "🦋", "✨"] },
  { pairs: 8, cols: 4, name: "Infinite Love 💍", emojis: ["🌸", "🌷", "💖", "🧸", "🦋", "✨", "🎀", "💍"] }
];

function buildMemory() {
  const levelInfo = MEM_LEVELS[memLevel - 1];
  document.getElementById("memLevel").textContent = memLevel;
  document.getElementById("memLevelName").textContent = `Stage: ${levelInfo.name}`;
  memoryGrid.style.setProperty("--grid-cols", levelInfo.cols);
  
  memoryGrid.innerHTML = "";
  memWin.hidden = true;
  memFirst = null;
  memLock = false;
  memMatched = 0;
  memMoveCount = 0;
  memMoves.textContent = "0";
  memPairs.textContent = `0/${levelInfo.pairs}`;

  const deck = [...levelInfo.emojis, ...levelInfo.emojis].sort(() => Math.random() - 0.5);
  deck.forEach((emoji) => {
    const container = document.createElement("div");
    container.className = "mem-card-container";
    if (levelInfo.cols === 4) {
      container.style.minHeight = "3.2rem";
    } else {
      container.style.minHeight = "4rem";
    }
    
    const card = document.createElement("div");
    card.className = "mem-card";
    
    const front = document.createElement("div");
    front.className = "mem-card-face mem-card-front";
    
    const back = document.createElement("div");
    back.className = "mem-card-face mem-card-back";
    back.textContent = emoji;
    
    card.appendChild(front);
    card.appendChild(back);
    container.appendChild(card);
    
    container.addEventListener("click", () => flipCard(container));
    memoryGrid.appendChild(container);
  });
}

function flipCard(container) {
  if (memLock || container.classList.contains("flipped") || container.classList.contains("matched")) return;
  container.classList.add("flipped");
  playFlipSFX();

  if (!memFirst) {
    memFirst = container;
    return;
  }

  memMoveCount++;
  memMoves.textContent = memMoveCount;

  const firstBack = memFirst.querySelector(".mem-card-back").textContent;
  const secondBack = container.querySelector(".mem-card-back").textContent;
  const levelInfo = MEM_LEVELS[memLevel - 1];

  if (firstBack === secondBack) {
    memFirst.classList.add("matched");
    container.classList.add("matched");
    memFirst = null;
    memMatched++;
    memPairs.textContent = `${memMatched}/${levelInfo.pairs}`;
    setTimeout(playMatchSFX, 200);
    
    if (memMatched === levelInfo.pairs) {
      setTimeout(() => {
        if (memLevel < MEM_LEVELS.length) {
          memWin.innerHTML = `Stage Clear! "${levelInfo.name}" matched! 💖<br><button class="btn btn--small" id="memNextBtn" style="margin-top:0.8rem;">Play Stage ${memLevel + 1} ⏭️</button>`;
          memWin.hidden = false;
          unlockAchievement("memory_win");
          document.getElementById("memNextBtn").addEventListener("click", () => {
            memLevel++;
            buildMemory();
          });
        } else {
          memWin.innerHTML = `Ultimate Level Cleared! 💍 You matched all of them, just like you matched my heart! 💍✨<br><button class="btn btn--small" id="memRestartBtn" style="margin-top:0.8rem;">Restart Stages 🔄</button>`;
          memWin.hidden = false;
          unlockAchievement("memory_win");
          document.getElementById("memRestartBtn").addEventListener("click", () => {
            memLevel = 1;
            buildMemory();
          });
        }
        triggerWinConfetti();
      }, 500);
    }
  } else {
    memLock = true;
    const first = memFirst;
    memFirst = null;
    setTimeout(() => {
      first.classList.remove("flipped");
      container.classList.remove("flipped");
      memLock = false;
    }, 1000);
  }
}
memReset.addEventListener("click", () => {
  playBubbleSFX();
  buildMemory();
});
buildMemory();

// =====================================================
// Game 2: Catch the Hearts (Stages & Work Obstacles)
// =====================================================
const catchArena = document.getElementById("catchArena");
const catchScore = document.getElementById("catchScore");
const catchTime = document.getElementById("catchTime");
const catchBest = document.getElementById("catchBest");
const catchStart = document.getElementById("catchStart");
const catchMsg = document.getElementById("catchMsg");
const HEART_GLYPHS = ["💖", "💝", "💗", "💕", "🌸"];

let catchRunning = false;
let score = 0;
let timeLeft = 20;
let spawnTimer, countdownTimer;
let best = Number(localStorage.getItem("ncumoBest") || 0);
catchBest.textContent = best;

let catchStage = 1;
const CATCH_STAGES = [
  { id: 1, name: "Soft Breeze 🌸", target: 15, durationMin: 2.2, durationMax: 3.2, spawnRate: 600, hint: "Catch the falling bubbles. Simple and sweet." },
  { id: 2, name: "Shower of Affection 💖", target: 25, durationMin: 1.5, durationMax: 2.2, spawnRate: 400, hint: "Hearts fall faster now! Focus, sthandwa sam." },
  { id: 3, name: "Storm of Love ⛈️", target: 35, durationMin: 1.0, durationMax: 1.7, spawnRate: 350, hint: "Blazing fast! Avoid clicking the work stress 💻!" }
];

function spawnHeart() {
  if (!catchRunning) return;
  const stageInfo = CATCH_STAGES[catchStage - 1];
  const item = document.createElement("button");
  item.className = "falling-heart";
  
  const isObstacle = (stageInfo.id === 3 && Math.random() > 0.65);
  
  if (isObstacle) {
    item.textContent = "💻";
    item.title = "Weekday Stress!";
  } else {
    item.textContent = HEART_GLYPHS[Math.floor(Math.random() * HEART_GLYPHS.length)];
  }
  
  item.style.left = Math.random() * 85 + "%";
  const dur = stageInfo.durationMin + Math.random() * (stageInfo.durationMax - stageInfo.durationMin);
  item.style.animationDuration = dur + "s";
  
  item.addEventListener("click", () => {
    if (item.classList.contains("caught")) return;
    item.classList.add("caught");
    
    if (isObstacle) {
      score = Math.max(0, score - 3);
      catchScore.textContent = score;
      playSynthNote(180, 'sawtooth', 0.22, 100, 0.15);
      spawnSparklesAt(parseFloat(item.style.left) * catchArena.clientWidth / 100, item.offsetTop, 4, ["💥", "💻", "❌"]);
    } else {
      score++;
      catchScore.textContent = score;
      playSynthNote(750 + (score * 5), 'sine', 0.1, 1000, 0.08);
      
      if (score === 50) unlockAchievement("hearts_50");
      if (score === 100) unlockAchievement("hearts_100");
    }
    setTimeout(() => item.remove(), 350);
  });
  
  item.addEventListener("animationend", () => item.remove());
  catchArena.appendChild(item);
}

function endCatch() {
  catchRunning = false;
  clearInterval(spawnTimer);
  clearInterval(countdownTimer);
  catchArena.querySelectorAll(".falling-heart").forEach((h) => h.remove());
  
  const stageInfo = CATCH_STAGES[catchStage - 1];
  
  if (score >= stageInfo.target) {
    if (catchStage < CATCH_STAGES.length) {
      catchMsg.innerHTML = `Stage ${catchStage} Cleared! Score: ${score}/${stageInfo.target} 🎉<br><button class="btn btn--small" id="catchNextBtn" style="margin-top:0.8rem;">Advance to Stage ${catchStage + 1} ⏭️</button>`;
      catchStage++;
      document.getElementById("catchStage").textContent = catchStage;
      setTimeout(() => {
        document.getElementById("catchNextBtn").addEventListener("click", () => {
          document.getElementById("catchHint").textContent = CATCH_STAGES[catchStage - 1].hint;
          playBubbleSFX();
          catchMsg.innerHTML = `Ready for Stage ${catchStage}? Let's go!`;
        });
      }, 50);
    } else {
      catchMsg.innerHTML = `Ultimate Stage Cleared! Final Score: ${score} 🏆<br>You are a true heart-catching master! 💖<br><button class="btn btn--small" id="catchRestartBtn" style="margin-top:0.8rem;">Restart Game 🔄</button>`;
      setTimeout(() => {
        document.getElementById("catchRestartBtn").addEventListener("click", () => {
          catchStage = 1;
          document.getElementById("catchStage").textContent = catchStage;
          document.getElementById("catchHint").textContent = CATCH_STAGES[0].hint;
          playBubbleSFX();
          catchMsg.innerHTML = `Ready to play again, sthandwa sam?`;
        });
      }, 50);
    }
    
    if (score > best) {
      best = score;
      localStorage.setItem("ncumoBest", best);
      catchBest.textContent = best;
    }
    triggerWinConfetti();
  } else {
    catchMsg.innerHTML = `Failed! You caught ${score}/${stageInfo.target} hearts.<br>Keep going, you've got this! 🌸`;
    playSynthNote(220, 'sawtooth', 0.4, 100, 0.1);
  }
  
  catchMsg.hidden = false;
  catchStart.textContent = "Play Again";
}

catchStart.addEventListener("click", () => {
  initAudio();
  if (catchRunning) return;
  catchRunning = true;
  score = 0;
  timeLeft = 20;
  catchScore.textContent = "0";
  catchTime.textContent = timeLeft;
  catchMsg.hidden = true;
  catchStart.textContent = "Catching...";
  
  const stageInfo = CATCH_STAGES[catchStage - 1];
  spawnTimer = setInterval(spawnHeart, stageInfo.spawnRate);
  countdownTimer = setInterval(() => {
    timeLeft--;
    catchTime.textContent = timeLeft;
    if (timeLeft <= 0) endCatch();
  }, 1000);
});

// =====================================================
// Game 3: Chibi Dresser Room (Anonymity Checked)
// =====================================================
const HAIRCUTS = ["👦", "💇‍♂️", "🧢", "🎩", "👑"];
const TOPS = ["👕", "🧥", "👔", "🦺", "🧣"];
const BOTTOMS = ["👖", "🩳", "🩲", "🥋"];
const SHOES = ["👟", "🥾", "👞", "🩴"];

const WARDROBE_VERDICTS = [
  "Okay stylist Ziyanda, I see you 👀🔥",
  "You are styling me to be the best-dressed man in Ivory Park 😮‍💨",
  "Hmm... would you still hold my hand in this?",
  "This one's for our weekend date 😏",
  "Drip level: dangerously in love 💖",
  "If you like it, I'm wearing it. Simple."
];

let curHair = 0, curTop = 0, curBottom = 0, curShoes = 0;
let savedLooks = JSON.parse(localStorage.getItem("ncumoLookbook")) || [];

const avatarHair = document.getElementById("avatarHair");
const avatarTop = document.getElementById("avatarTop");
const avatarBottom = document.getElementById("avatarBottom");
const avatarShoes = document.getElementById("avatarShoes");

const iconHair = document.getElementById("iconHair");
const iconTop = document.getElementById("iconTop");
const iconBottom = document.getElementById("iconBottom");
const iconShoes = document.getElementById("iconShoes");

const fitVerdict = document.getElementById("fitVerdict");
const fitCart = document.getElementById("fitCart");
const lookbookGrid = document.getElementById("lookbookGrid");
const lookbookSec = document.getElementById("lookbookSec");

function updateAvatarUI() {
  avatarHair.textContent = HAIRCUTS[curHair];
  avatarTop.textContent = TOPS[curTop];
  avatarBottom.textContent = BOTTOMS[curBottom];
  avatarShoes.textContent = SHOES[curShoes];

  iconHair.textContent = HAIRCUTS[curHair];
  iconTop.textContent = TOPS[curTop];
  iconBottom.textContent = BOTTOMS[curBottom];
  iconShoes.textContent = SHOES[curShoes];
}

function selectNextItem(type, step) {
  playBubbleSFX();
  triggerChibiAnimation();
  
  if (type === "hair") {
    curHair = (curHair + step + HAIRCUTS.length) % HAIRCUTS.length;
  } else if (type === "top") {
    curTop = (curTop + step + TOPS.length) % TOPS.length;
  } else if (type === "bottom") {
    curBottom = (curBottom + step + BOTTOMS.length) % BOTTOMS.length;
  } else if (type === "shoes") {
    curShoes = (curShoes + step + SHOES.length) % SHOES.length;
  }
  
  updateAvatarUI();
  fitVerdict.textContent = WARDROBE_VERDICTS[Math.floor(Math.random() * WARDROBE_VERDICTS.length)];
}

function triggerChibiAnimation() {
  const avatar = document.getElementById("chibiAvatar");
  if (!avatar) return;
  avatar.classList.remove("poof");
  void avatar.offsetWidth; 
  avatar.classList.add("poof");
}

document.getElementById("prevHair").addEventListener("click", () => selectNextItem("hair", -1));
document.getElementById("nextHair").addEventListener("click", () => selectNextItem("hair", 1));
document.getElementById("prevTop").addEventListener("click", () => selectNextItem("top", -1));
document.getElementById("nextTop").addEventListener("click", () => selectNextItem("top", 1));
document.getElementById("prevBottom").addEventListener("click", () => selectNextItem("bottom", -1));
document.getElementById("nextBottom").addEventListener("click", () => selectNextItem("bottom", 1));
document.getElementById("prevShoes").addEventListener("click", () => selectNextItem("shoes", -1));
document.getElementById("nextShoes").addEventListener("click", () => selectNextItem("shoes", 1));

document.getElementById("fitShuffle").addEventListener("click", () => {
  playBubbleSFX();
  triggerChibiAnimation();
  
  curHair = Math.floor(Math.random() * HAIRCUTS.length);
  curTop = Math.floor(Math.random() * TOPS.length);
  curBottom = Math.floor(Math.random() * BOTTOMS.length);
  curShoes = Math.floor(Math.random() * SHOES.length);
  
  updateAvatarUI();
  fitVerdict.textContent = "Surprise drip styled! 🎲 How do I look?";
});

function renderLookbook() {
  lookbookGrid.innerHTML = "";
  if (savedLooks.length > 0) {
    lookbookSec.hidden = false;
    fitCart.textContent = `Cart: ${savedLooks.length} custom outfits saved!`;
    savedLooks.forEach((look, idx) => {
      const div = document.createElement("button");
      div.className = "lookbook-item";
      div.innerHTML = `<span>Look ${idx+1}:</span> ${look.hair} ${look.top} ${look.bottom} ${look.shoes}`;
      div.addEventListener("click", () => {
        playBubbleSFX();
        triggerChibiAnimation();
        
        curHair = HAIRCUTS.indexOf(look.hair);
        curTop = TOPS.indexOf(look.top);
        curBottom = BOTTOMS.indexOf(look.bottom);
        curShoes = SHOES.indexOf(look.shoes);
        
        updateAvatarUI();
        fitVerdict.textContent = `Restored Look ${idx+1}! Great taste.`;
      });
      lookbookGrid.appendChild(div);
    });
  } else {
    lookbookSec.hidden = true;
    fitCart.textContent = "No looks saved to Lookbook yet.";
  }
}

document.getElementById("fitBuy").addEventListener("click", () => {
  playMatchSFX();
  const look = {
    hair: HAIRCUTS[curHair],
    top: TOPS[curTop],
    bottom: BOTTOMS[curBottom],
    shoes: SHOES[curShoes]
  };
  savedLooks.push(look);
  localStorage.setItem("ncumoLookbook", JSON.stringify(savedLooks));
  renderLookbook();
  unlockAchievement("fashion_king");
  spawnSparklesAt(window.innerWidth / 2, window.innerHeight * 0.7, 8);
});

function setupDailyDrip() {
  const seed = getDaySeed();
  const rnd = createPRNG(seed + 54321);
  
  curHair = Math.floor(rnd() * HAIRCUTS.length);
  curTop = Math.floor(rnd() * TOPS.length);
  curBottom = Math.floor(rnd() * BOTTOMS.length);
  curShoes = Math.floor(rnd() * SHOES.length);
  
  updateAvatarUI();
  
  const dailyOutfits = [
    "Cozy Sunday Drip", "Sunset Walk Vibe", "Ivory Park Chic", 
    "Lofi Study Aesthetic", "Anime Convention Style", "Weekend Date Look",
    "Casual Coffee Drip", "Magical Evening Fit"
  ];
  const outfitName = dailyOutfits[Math.floor(rnd() * dailyOutfits.length)];
  fitVerdict.textContent = `Today's Daily Look: "${outfitName}"! 🎲 Style me more!`;
}
setupDailyDrip();
renderLookbook();

// =====================================================
// Game 4: Anime Love Fortune Omikuji Box
// =====================================================
const fortuneDrawer = document.getElementById("fortuneDrawer");
const fortuneStick = document.getElementById("fortuneStick");
const fortuneWin = document.getElementById("fortuneWin");
let fortuneLock = false;

fortuneDrawer.addEventListener("click", () => {
  if (fortuneLock) return;
  fortuneLock = true;
  fortuneWin.hidden = true;
  
  initAudio();
  playSynthNote(220, 'triangle', 0.5, 440);
  fortuneDrawer.classList.add("shake");
  
  setTimeout(() => {
    fortuneDrawer.classList.remove("shake");
    fortuneDrawer.classList.add("stick-out");
    playMatchSFX();
    
    setTimeout(() => {
      const seed = getDaySeed();
      const rnd = createPRNG(seed + (fortuneDrawCount * 100));
      const fort = OMIKUJI_FORTUNES[Math.floor(rnd() * OMIKUJI_FORTUNES.length)];
      fortuneWin.innerHTML = `<strong>${fort.badge}</strong><br>${fort.desc}`;
      fortuneWin.hidden = false;
      fortuneDrawer.classList.remove("stick-out");
      fortuneLock = false;
      unlockAchievement("fortune_draw");
      spawnSparklesAt(window.innerWidth / 2, window.innerHeight * 0.6, 6);
      fortuneDrawCount++;
    }, 700);
  }, 600);
});

// =====================================================
// Game 5: One Important Question
// =====================================================
const yesBtn = document.getElementById("yesBtn");
const noBtn = document.getElementById("noBtn");
const questionBtns = document.getElementById("questionBtns");
const questionText = document.getElementById("questionText");
const yesWin = document.getElementById("yesWin");
const NO_TAUNTS = ["No", "Are you sure?", "Really?? 🥺", "Think again!", "Nani?! 😳", "No way! ✨", "Excuses... 🌸"];
let noDodges = 0;

function dodge() {
  noDodges++;
  playDodgeSFX();
  noBtn.classList.add("fleeing");
  
  const maxX = questionBtns.clientWidth - noBtn.offsetWidth;
  const maxY = questionBtns.clientHeight - noBtn.offsetHeight;
  noBtn.style.left = Math.random() * Math.max(maxX, 0) + "px";
  noBtn.style.top = Math.random() * Math.max(maxY, 0) + "px";
  
  noBtn.textContent = NO_TAUNTS[Math.min(noDodges, NO_TAUNTS.length - 1)];
  const scaleDodge = Math.max(0.4, 1 - noDodges * 0.1);
  const scaleYes = 1 + Math.min(noDodges, 8) * 0.12;
  
  noBtn.style.transform = `scale(${scaleDodge})`;
  yesBtn.style.transform = `scale(${scaleYes})`;
  
  if (noDodges >= 7) {
    noBtn.remove();
  }
}

noBtn.addEventListener("mouseenter", dodge);
noBtn.addEventListener("click", dodge);
noBtn.addEventListener("touchstart", (e) => {
  e.preventDefault();
  dodge();
});

yesBtn.addEventListener("click", () => {
  questionText.textContent = "💖💖💖";
  questionBtns.hidden = true;
  yesWin.hidden = false;
  unlockAchievement("question_yes");
  setTimeout(triggerWinConfetti, 50);
});

// =====================================================
// Cassette Player Controller
// =====================================================
const cassettePlay = document.getElementById("cassettePlay");
const cassettePrev = document.getElementById("cassettePrev");
const cassetteNext = document.getElementById("cassetteNext");
const cassetteTrackName = document.getElementById("cassetteTrackName");

cassettePlay.addEventListener("click", () => {
  initAudio();
  if (isLofiPlaying) {
    stopLofiLoop();
  } else {
    startLofiLoop();
  }
});

cassettePrev.addEventListener("click", () => {
  playBubbleSFX();
  const activeProg = CHORD_PROGRESSIONS[targetTheme] || CHORD_PROGRESSIONS.sakura;
  currentChordIdx = (currentChordIdx - 1 + activeProg.length) % activeProg.length;
  if (isLofiPlaying) {
    playChord(activeProg[currentChordIdx]);
  }
  cassetteTrackName.textContent = `Lofi Melodies: Chord Tone ${currentChordIdx+1}`;
});

cassetteNext.addEventListener("click", () => {
  playBubbleSFX();
  const activeProg = CHORD_PROGRESSIONS[targetTheme] || CHORD_PROGRESSIONS.sakura;
  currentChordIdx = (currentChordIdx + 1) % activeProg.length;
  if (isLofiPlaying) {
    playChord(activeProg[currentChordIdx]);
  }
  cassetteTrackName.textContent = `Lofi Melodies: Chord Tone ${currentChordIdx+1}`;
});

// =====================================================
// Konami Code Easter Egg (L-O-V-E)
// =====================================================
let eggInput = "";
const targetWord = "love";
document.addEventListener("keydown", (e) => {
  eggInput += e.key.toLowerCase();
  if (eggInput.length > targetWord.length) {
    eggInput = eggInput.substring(eggInput.length - targetWord.length);
  }
  if (eggInput === targetWord) {
    eggInput = "";
    initAudio();
    playWinFanfare();
    for (let i = 0; i < 40; i++) {
      setTimeout(() => {
        spawnSparklesAt(Math.random() * window.innerWidth, Math.random() * window.innerHeight, 5, ["💖", "💗", "✨", "🌸"]);
      }, i * 80);
    }
  }
});
