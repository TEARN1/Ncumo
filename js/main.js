// =====================================================
// Global Mouse / Touch Tracking & Math Utilities
// =====================================================
const SANCTUARY_LOCKED = false; // Set to false to disable the lock screen completely
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
  { badge: "🍀 Kichi (Blessing)", desc: "Excellent vibes. The cozy ambient sounds will feel extra peaceful this weekend." }
];

const ACHIEVEMENTS = [
  { id: "memory_win", icon: "🧠", label: "Memory Master" },
  { id: "hearts_50", icon: "💝", label: "50 Hearts" },
  { id: "hearts_100", icon: "💌", label: "100 Hearts" },
  { id: "question_yes", icon: "💖", label: "Said Yes" },
  { id: "fortune_draw", icon: "🎴", label: "Fortune Seeker" },
  { id: "calculus_master", icon: "🎓", label: "Calculus Guru" }
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
let tapeProgress = 0.0;

let analyser = null;
let dataArray = null;
let masterFilter = null;
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
    
    // Create master low-pass filter for the DJ control
    masterFilter = audioCtx.createBiquadFilter();
    masterFilter.type = "lowpass";
    const filterSlider = document.getElementById("lofiFilter");
    const initFreq = filterSlider ? parseFloat(filterSlider.value) : 15000;
    masterFilter.frequency.setValueAtTime(initFreq, audioCtx.currentTime);
    
    masterFilter.connect(analyser);
    analyser.connect(audioCtx.destination);
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
    if (masterFilter) {
      gain.connect(masterFilter);
    } else {
      gain.connect(analyser);
      gain.connect(audioCtx.destination);
    }
    
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
  
  const leftRoll = document.querySelector(".cassette-tape-roll--left");
  const rightRoll = document.querySelector(".cassette-tape-roll--right");
  
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
    
    // Animate winding tape reels (left to right)
    if (leftRoll && rightRoll) {
      tapeProgress += 0.0003;
      if (tapeProgress > 1.0) {
        tapeProgress = 0.0;
      }
      const leftWidth = 2 + Math.floor((1.0 - tapeProgress) * 12);
      const rightWidth = 2 + Math.floor(tapeProgress * 12);
      leftRoll.style.borderWidth = `${leftWidth}px`;
      rightRoll.style.borderWidth = `${rightWidth}px`;
    }
    
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
    const response = await fetch("https://api.open-meteo.com/v1/forecast?latitude=-25.986&longitude=28.134&daily=weathercode,temperature_2m_max,temperature_2m_min,precipitation_probability_max&current_weather=true&timezone=Africa/Johannesburg");
    if (!response.ok) throw new Error("Failed to fetch weather forecast.");
    weatherData = await response.json();
    
    evaluateWeatherAlerts(weatherData);
    autoUpdateThemeBasedOnTime();
  } catch (e) {
    console.warn("Weather API unreachable, loading fallback alerts and default theme.", e);
    evaluateFallbackAlerts();
    autoUpdateThemeBasedOnTime();
  }
}

function autoUpdateThemeBasedOnTime() {
  if (sessionStorage.getItem("userSelectedTheme")) return;
  
  const hours = new Date().getHours();
  const isNight = (hours >= 19 || hours < 5);
  
  if (weatherData && weatherData.current_weather) {
    const code = weatherData.current_weather.weathercode;
    
    // Open-Meteo Weather Codes:
    // Rainy / Showery / Stormy codes -> Lofi Rain
    const rainCodes = [51, 53, 55, 56, 57, 61, 63, 65, 66, 67, 80, 81, 82, 95, 96, 99];
    // Cloudy / Overcast / Foggy codes -> Sunset Cafe
    const cloudyCodes = [2, 3, 45, 48];
    
    if (rainCodes.includes(code)) {
      if (targetTheme !== "rain") switchTheme("rain");
    } else if (isNight) {
      if (targetTheme !== "dream") switchTheme("dream");
    } else if (cloudyCodes.includes(code)) {
      if (targetTheme !== "cafe") switchTheme("cafe");
    } else {
      // Clear sky / Mainly clear -> Sakura Spring
      if (targetTheme !== "sakura") switchTheme("sakura");
    }
  } else {
    // Fallback if weatherData is not loaded yet or API is unreachable
    if (isNight) {
      if (targetTheme !== "dream") switchTheme("dream");
    } else {
      if (targetTheme !== "sakura") switchTheme("sakura");
    }
  }
}

// Check weather & time theme automatically every 60 seconds
setInterval(autoUpdateThemeBasedOnTime, 60000);

function evaluateWeatherAlerts(data) {
  const maxTemp = data.daily.temperature_2m_max[0];
  const rainProbToday = data.daily.precipitation_probability_max[0];
  const rainProbTomorrow = data.daily.precipitation_probability_max[1];
  
  if (rainProbToday > 40) {
    injectAlert("🌧️", `It might rain today in Commercia, Midrand (Probability: ${rainProbToday}%). Make sure you carry an umbrella, sthandwa sam! ☔`);
  }
  if (rainProbTomorrow > 50) {
    injectAlert("👕", "Just checked the forecast — rain is coming tomorrow. Better do your laundry today while the sun is out! ☀️👕");
  }
  if (rainProbToday <= 15 && maxTemp > 26) {
    injectAlert("☀️", `It's going to be warm and beautiful today (${maxTemp}°C). Have a lovely walk, sthandwa sam!`);
  }
  
  updateWorkAlerts();
  updateLoadsheddingAlerts();
  updateWaterAlerts(data);
}

function evaluateFallbackAlerts() {
  const date = new Date();
  const day = date.getDay();
  if (day === 6 || day === 0) {
    injectAlert("☀️", "Beautiful weekend vibes! Hope you wake up with a smile today. 🌸");
  }
  updateWorkAlerts();
  updateLoadsheddingAlerts();
  updateWaterAlerts(null);
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
// Loadshedding Commercia Block 9 Schedule Simulator
// =====================================================
function updateLoadsheddingAlerts() {
  const now = new Date();
  const scheduleToday = getLoadsheddingSchedule(now);
  
  if (scheduleToday && scheduleToday.slots.length > 0) {
    const slotStr = scheduleToday.slots.join(", ");
    injectAlert("⚡", `Power Warning (Commercia Block 9): Loadshedding is scheduled for today at ${slotStr}. Remember to charge your phone and power bank! ⚡🔋`);
  } else {
    const tomorrow = new Date();
    tomorrow.setDate(now.getDate() + 1);
    const scheduleTomorrow = getLoadsheddingSchedule(tomorrow);
    if (scheduleTomorrow && scheduleTomorrow.slots.length > 0) {
      injectAlert("🔌", `Power Notice: Loadshedding is scheduled for tomorrow (Commercia Block 9) at ${scheduleTomorrow.slots.join(", ")}. Keep everything charged! 🔋`);
    } else {
      injectAlert("💡", "No loadshedding scheduled for Commercia Block 9 today or tomorrow. Enjoy the lights! 💡");
    }
  }
}

// =====================================================
// Water Supply & Reservoir Alerts (Rabie Ridge Reservoir)
// =====================================================
function updateWaterAlerts(data) {
  if (data) {
    const maxTemp = data.daily.temperature_2m_max[0];
    const rainProb = data.daily.precipitation_probability_max[0];
    if (maxTemp > 28) {
      injectAlert("🚰", `Water Warning (Rabie Ridge Reservoir): Reservoir levels are stable. Due to high temperatures (${maxTemp}°C), demand is high. Please use water sparingly in Commercia, sthandwa sam! 💧`);
    } else if (rainProb > 50) {
      injectAlert("🚰", `Water Status (Rabie Ridge Tower): Pressure is stable and operations are normal. Stay warm and keep hydrated today! 🌧️💧`);
    } else {
      injectAlert("🚰", `Water Status (Rabie Ridge Reservoir): Flow is steady, pressure is normal in Commercia. Keep drinking water and stay glowing! 💧✨`);
    }
  } else {
    injectAlert("🚰", `Water Status (Rabie Ridge Reservoir): Supply is normal for Commercia. Remember to drink water and take care of yourself, sthandwa sam! 💧`);
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

document.getElementById("themeSakura").addEventListener("click", () => { playBubbleSFX(); sessionStorage.setItem("userSelectedTheme", "true"); switchTheme("sakura"); });
document.getElementById("themeCafe").addEventListener("click", () => { playBubbleSFX(); sessionStorage.setItem("userSelectedTheme", "true"); switchTheme("cafe"); });
document.getElementById("themeDream").addEventListener("click", () => { playBubbleSFX(); sessionStorage.setItem("userSelectedTheme", "true"); switchTheme("dream"); });
document.getElementById("themeRain").addEventListener("click", () => { playBubbleSFX(); sessionStorage.setItem("userSelectedTheme", "true"); switchTheme("rain"); });

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
      const isMobile = window.innerWidth < 768;
      const scale = isMobile ? 0.75 : 1.0;
      const displayWidth = Math.floor(canvas.clientWidth * scale);
      const displayHeight = Math.floor(canvas.clientHeight * scale);
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
  
  // Last visit time tracking
  const lastVisitStr = localStorage.getItem("lastVisitTime");
  const currentMs = Date.now();
  let longingMsg = "";
  
  if (lastVisitStr) {
    const lastVisitMs = parseInt(lastVisitStr, 10);
    const diffHours = (currentMs - lastVisitMs) / (1000 * 60 * 60);
    const diffDays = Math.floor(diffHours / 24);
    
    if (diffDays >= 7) {
      longingMsg = `It's been a whole week (${diffDays} days) since you were last here... 😭 Did you forget about me, sthandwa sam? I missed you so much it hurts! 💔`;
    } else if (diffDays >= 3) {
      longingMsg = `It's been ${diffDays} days since you last visited... 🥺 I was starting to feel really lonely and sad. I missed you so much! 💔`;
    } else if (diffHours >= 24) {
      longingMsg = `I missed you yesterday... 🥺 It felt like a lifetime. I'm so glad you're back today, sthandwa sam! ♡`;
    }
  }
  
  // Save the current visit time
  localStorage.setItem("lastVisitTime", currentMs.toString());
  
  if (longingMsg) {
    greetingEl.textContent = longingMsg;
  } else {
    // Normal greetings based on time of day
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
  }
  
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
initLockScreen();
init3DScrollverse();

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
// Game 3: Anime Love Fortune Omikuji Box
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
// Game 4: One Important Question
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
const lofiFilter = document.getElementById("lofiFilter");

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

if (lofiFilter) {
  lofiFilter.addEventListener("input", (e) => {
    const val = parseFloat(e.target.value);
    initAudio();
    if (masterFilter) {
      masterFilter.frequency.setTargetAtTime(val, audioCtx.currentTime, 0.05);
    }
  });
}

// =====================================================
// Secret Mobile Heart-Tap Easter Egg
// =====================================================
let heartTapCount = 0;
let lastHeartTapTime = 0;
const heartTarget = document.querySelector(".hero") || document.getElementById("webglCanvas");
if (heartTarget) {
  heartTarget.addEventListener("pointerdown", (e) => {
    // Ignore taps on interactive child elements like buttons and links
    if (e.target.closest("button, a, input, select, textarea, label")) return;
    
    const now = Date.now();
    if (now - lastHeartTapTime > 1500) {
      heartTapCount = 1;
    } else {
      heartTapCount++;
    }
    lastHeartTapTime = now;

    // Spawn cute heart and blossom sparkles at tap position
    if (partCanvas) {
      const px = e.clientX;
      const py = e.clientY;
      spawnSparklesAt(px, py, 6, ["💖", "✨", "🌸", "🌷"]);
    }

    if (heartTapCount >= 5) {
      triggerWinConfetti();
      heartTapCount = 0;
    }
  });
}

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

// =====================================================
// Sanctuary Angry / Upset Lock Screen Manager
// =====================================================
function initLockScreen() {
  const lockScreen = document.getElementById("lockScreen");
  const lockInput = document.getElementById("lockInput");
  const lockUnlockBtn = document.getElementById("lockUnlockBtn");
  const lockFeedback = document.getElementById("lockFeedback");
  
  if (!lockScreen) return;
  
  // If the lock is not enabled in code, or she already unlocked it in this browser session
  if (!SANCTUARY_LOCKED || sessionStorage.getItem("sanctuaryUnlocked") === "true") {
    lockScreen.style.display = "none";
    return;
  }
  
  // Show the lock screen
  lockScreen.style.display = "flex";
  
  function attemptUnlock() {
    const val = lockInput.value.trim().toLowerCase();
    const magicWords = ["sorry", "i'm sorry", "im sorry", "apology", "forgive me", "i love you", "love"];
    
    if (magicWords.includes(val)) {
      sessionStorage.setItem("sanctuaryUnlocked", "true");
      lockFeedback.hidden = false;
      lockFeedback.style.color = "#a3e635"; // light green
      lockFeedback.textContent = "Apology accepted! ♡ Opening the sanctuary...";
      
      initAudio();
      playWinFanfare();
      triggerWinConfetti();
      
      setTimeout(() => {
        lockScreen.style.opacity = "0";
        lockScreen.style.transition = "opacity 0.8s ease";
        setTimeout(() => {
          lockScreen.style.display = "none";
        }, 800);
      }, 1500);
    } else {
      lockFeedback.hidden = false;
      lockFeedback.style.color = "#ffaec1"; // pink/red
      lockFeedback.textContent = "That's not the magic word... 🥺 (Hint: try saying sorry)";
      lockInput.value = "";
      
      // Trigger a shake animation
      lockFeedback.style.animation = "none";
      setTimeout(() => {
        lockFeedback.style.animation = "lockShake 0.4s ease";
      }, 10);
    }
  }
  
  lockUnlockBtn.addEventListener("click", attemptUnlock);
  lockInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter") attemptUnlock();
  });
}

// =====================================================
// 🌌 10-Dimensional 3D Scrollverse (Dimensional Sanctuary)
// =====================================================
function init3DScrollverse() {
  const scrollCanvas = document.getElementById("scroll3dCanvas");
  if (!scrollCanvas) return;
  
  const THREE = window.THREE;
  if (!THREE) {
    console.warn("Three.js not loaded. Cannot start 3D Scrollverse.");
    return;
  }
  
  let activeDimension = 1;
  let dimensionProgress = 0;
  let scrollMouseX = 0;
  let scrollMouseY = 0;
  
  // Track scroll position
  const panels = document.querySelectorAll(".scroll3d-panel");
  function handleScroll3d() {
    const section = document.getElementById("dimensionalSanctuary");
    if (!section) return;
    
    const rect = section.getBoundingClientRect();
    const sectionHeight = rect.height;
    const scrolled = -rect.top;
    
    const totalPanels = 10;
    const panelHeight = sectionHeight / totalPanels;
    
    let activeIdx = Math.floor(scrolled / panelHeight) + 1;
    activeIdx = Math.max(1, Math.min(totalPanels, activeIdx));
    
    const panelOffset = scrolled % panelHeight;
    let progress = panelOffset / panelHeight;
    if (progress < 0) progress = 0;
    if (progress > 1) progress = 1;
    
    activeDimension = activeIdx;
    dimensionProgress = progress;
    
    panels.forEach((panel, idx) => {
      if (idx + 1 === activeDimension) {
        panel.classList.add("active");
      } else {
        panel.classList.remove("active");
      }
    });
    
    // Toggle DOM elements using CSS classes for transitions
    const cssCube = document.getElementById("scroll3dCssCubeContainer");
    const ascii = document.getElementById("scroll3dAsciiContainer");
    const typo = document.getElementById("scroll3dCssTyposContainer");
    if (cssCube) {
      if (activeDimension === 3) cssCube.classList.add("active");
      else cssCube.classList.remove("active");
    }
    if (ascii) {
      if (activeDimension === 5) ascii.classList.add("active");
      else ascii.classList.remove("active");
    }
    if (typo) {
      if (activeDimension === 9) typo.classList.add("active");
      else typo.classList.remove("active");
    }
  }
  window.addEventListener("scroll", handleScroll3d);
  handleScroll3d(); // run once
  
  // Track Mouse movement in 3D section
  const section = document.getElementById("dimensionalSanctuary");
  section.addEventListener("mousemove", (e) => {
    const rect = section.getBoundingClientRect();
    scrollMouseX = ((e.clientX - rect.left) / rect.width) * 2 - 1;
    scrollMouseY = -(((e.clientY - rect.top) / rect.height) * 2 - 1);
  });
  section.addEventListener("touchmove", (e) => {
    if (e.touches.length > 0) {
      const rect = section.getBoundingClientRect();
      scrollMouseX = ((e.touches[0].clientX - rect.left) / rect.width) * 2 - 1;
      scrollMouseY = -(((e.touches[0].clientY - rect.top) / rect.height) * 2 - 1);
    }
  });
  
  // Setup Three.js
  let renderer;
  try {
    renderer = new THREE.WebGLRenderer({ canvas: scrollCanvas, alpha: true, antialias: true });
    renderer.setSize(scrollCanvas.clientWidth, scrollCanvas.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  } catch (err) {
    console.warn("Could not start WebGL in scrollverse. Modes 3, 5, and 9 will still work.", err);
  }
  
  window.addEventListener("resize", () => {
    const w = scrollCanvas.clientWidth;
    const h = scrollCanvas.clientHeight;
    if (renderer) renderer.setSize(w, h);
    cameraPersp.aspect = w / h;
    cameraPersp.updateProjectionMatrix();
  });
  
  // Cameras
  const cameraOrtho = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
  const cameraPersp = new THREE.PerspectiveCamera(45, scrollCanvas.clientWidth / scrollCanvas.clientHeight, 0.1, 100);
  cameraPersp.position.z = 5;
  
  // Scenes
  const sceneRaymarch = new THREE.Scene();
  const sceneThreeD = new THREE.Scene();
  
  // Lighting for 3D elements
  const ambientLight = new THREE.AmbientLight(0xffffff, 0.65);
  sceneThreeD.add(ambientLight);
  const dirLight = new THREE.DirectionalLight(0xffffff, 0.85);
  dirLight.position.set(5, 5, 5);
  sceneThreeD.add(dirLight);
  
  // 1. Raymarch Plane Shader Material
  const uniforms = {
    u_resolution: { value: new THREE.Vector2(scrollCanvas.clientWidth, scrollCanvas.clientHeight) },
    u_time: { value: 0 },
    u_mouse: { value: new THREE.Vector2(0, 0) },
    u_heartColor: { value: new THREE.Color(0.95, 0.65, 0.73) }, // pinkish
    u_innerColor: { value: new THREE.Color(1.0, 0.89, 0.91) },
    u_bgColor1: { value: new THREE.Color(1.0, 0.95, 0.96) },
    u_bgColor2: { value: new THREE.Color(0.98, 0.93, 0.99) },
    u_theme: { value: 1.0 },
    u_opacity: { value: 0.0 }
  };
  
  const shaderMaterial = new THREE.ShaderMaterial({
    vertexShader: `
      varying vec2 vUv;
      void main() {
        vUv = uv;
        gl_Position = vec4(position, 1.0);
      }
    `,
    fragmentShader: `
      varying vec2 vUv;
      uniform vec2 u_resolution;
      uniform float u_time;
      uniform vec2 u_mouse;
      uniform vec3 u_heartColor;
      uniform vec3 u_innerColor;
      uniform vec3 u_bgColor1;
      uniform vec3 u_bgColor2;
      uniform float u_theme;
      uniform float u_opacity;

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
        vec2 uv = vUv - 0.5;
        uv.x *= u_resolution.x / u_resolution.y;
        vec3 col = vec3(0.0);
        
        if (u_theme == 8.0) {
          float shift = u_mouse.x * 0.04 + sin(u_time * 1.5) * 0.01;
          
          // Red
          vec2 uvR = uv - vec2(shift, 0.0);
          vec3 roR = vec3(0.0, 0.0, 2.2);
          vec3 rdR = normalize(vec3(uvR, -1.0));
          float tR = 0.0;
          for (int i=0; i<24; i++) {
            vec3 p = roR + rdR * tR;
            float d = map(p);
            if (d < 0.001 || tR > 4.0) break;
            tR += d;
          }
          
          // Green
          vec2 uvG = uv;
          vec3 roG = vec3(0.0, 0.0, 2.2);
          vec3 rdG = normalize(vec3(uvG, -1.0));
          float tG = 0.0;
          for (int i=0; i<24; i++) {
            vec3 p = roG + rdG * tG;
            float d = map(p);
            if (d < 0.001 || tG > 4.0) break;
            tG += d;
          }
          
          // Blue
          vec2 uvB = uv + vec2(shift, 0.0);
          vec3 roB = vec3(0.0, 0.0, 2.2);
          vec3 rdB = normalize(vec3(uvB, -1.0));
          float tB = 0.0;
          for (int i=0; i<24; i++) {
            vec3 p = roB + rdB * tB;
            float d = map(p);
            if (d < 0.001 || tB > 4.0) break;
            tB += d;
          }
          
          vec3 cBg = mix(u_bgColor1, u_bgColor2, vUv.y);
          col.r = (tR < 4.0) ? mix(u_heartColor.r, u_innerColor.r, dot(calcNormal(roR + rdR * tR), vec3(0.0,0.0,1.0))) : cBg.r;
          col.g = (tG < 4.0) ? mix(u_heartColor.g, u_innerColor.g, dot(calcNormal(roG + rdG * tG), vec3(0.0,0.0,1.0))) : cBg.g;
          col.b = (tB < 4.0) ? mix(u_heartColor.b, u_innerColor.b, dot(calcNormal(roB + rdB * tB), vec3(0.0,0.0,1.0))) : cBg.b;
        } else {
          vec3 ro = vec3(0.0, 0.0, 2.2);
          vec3 rd = normalize(vec3(uv, -1.0));
          float t = 0.0;
          for (int i=0; i<24; i++) {
            vec3 p = ro + rd * t;
            float d = map(p);
            if (d < 0.001 || t > 4.0) break;
            t += d;
          }
          
          col = mix(u_bgColor1, u_bgColor2, vUv.y);
          
          if (t < 4.0) {
            vec3 pos = ro + rd * t;
            vec3 nor = calcNormal(pos);
            float diff = max(0.0, dot(nor, normalize(vec3(1.0, 1.0, 1.0))));
            float spec = pow(max(0.0, dot(reflect(rd, nor), normalize(vec3(1.0,1.0,1.0)))), 16.0);
            vec3 hCol = mix(u_heartColor, u_innerColor, dot(nor, vec3(0.0,0.0,1.0)) * 0.5 + 0.5);
            col = hCol * (diff * 0.8 + 0.2) + vec3(1.0) * spec * 0.4;
          }
        }
        gl_FragColor = vec4(col, u_opacity);
      }
    `,
    uniforms: uniforms,
    transparent: true,
    depthWrite: false,
    depthTest: false
  });
  
  const planeGeo = new THREE.PlaneGeometry(2, 2);
  const planeMesh = new THREE.Mesh(planeGeo, shaderMaterial);
  sceneRaymarch.add(planeMesh);
  
  // 2. Point Cloud Particles
  const pCount = 2000;
  const pPositions = new Float32Array(pCount * 3);
  const pOrigPositions = new Float32Array(pCount * 3);
  const pColors = new Float32Array(pCount * 3);
  
  for (let i = 0; i < pCount; i++) {
    const t = Math.PI * (2 * Math.random() - 1);
    const p = Math.PI * (Math.random() - 0.5);
    const scale = 0.2 + 0.8 * Math.random();
    
    const x = 16 * Math.pow(Math.sin(t), 3) * scale;
    const y = (13 * Math.cos(t) - 5 * Math.cos(2*t) - 2 * Math.cos(3*t) - Math.cos(4*t)) * scale;
    const z = (Math.random() - 0.5) * 12;
    
    pOrigPositions[i*3] = x * 0.12;
    pOrigPositions[i*3+1] = y * 0.12;
    pOrigPositions[i*3+2] = z * 0.12;
    
    pPositions[i*3] = x * 0.12;
    pPositions[i*3+1] = y * 0.12;
    pPositions[i*3+2] = z * 0.12;
    
    // Gradient pink/rose/violet colors
    pColors[i*3] = 0.95 + Math.random() * 0.05;
    pColors[i*3+1] = 0.45 + Math.random() * 0.2;
    pColors[i*3+2] = 0.6 + Math.random() * 0.25;
  }
  
  const pGeo = new THREE.BufferGeometry();
  pGeo.setAttribute('position', new THREE.BufferAttribute(pPositions, 3));
  pGeo.setAttribute('color', new THREE.BufferAttribute(pColors, 3));
  
  const pMat = new THREE.PointsMaterial({
    size: 0.09,
    vertexColors: true,
    transparent: true,
    opacity: 0.0,
    blending: THREE.AdditiveBlending
  });
  const pointCloud = new THREE.Points(pGeo, pMat);
  sceneThreeD.add(pointCloud);
  
  // 4. Torus Knot wireframe mesh
  const torusGeo = new THREE.TorusKnotGeometry(1.0, 0.28, 100, 12);
  const torusMat = new THREE.MeshBasicMaterial({ color: 0xff4fac, wireframe: true, transparent: true, opacity: 0.0 });
  const torusMesh = new THREE.Mesh(torusGeo, torusMat);
  sceneThreeD.add(torusMesh);
  
  // 5. ASCII coordinates setup
  const asciiPoints = [];
  for (let t = 0; t < Math.PI * 2; t += 0.12) {
    for (let p = -Math.PI/2; p < Math.PI/2; p += 0.12) {
      const x = 16 * Math.pow(Math.sin(t), 3) * Math.cos(p);
      const y = 13 * Math.cos(t) - 5 * Math.cos(2*t) - 2 * Math.cos(3*t) - Math.cos(4*t);
      const z = 16 * Math.pow(Math.sin(t), 3) * Math.sin(p);
      asciiPoints.push({ x: x * 0.1, y: -y * 0.1, z: z * 0.1 });
    }
  }
  
  // 6. Voxel Grid setup
  const voxelGroup = new THREE.Group();
  const boxGeo = new THREE.BoxGeometry(0.16, 0.16, 0.16);
  const boxMat = new THREE.MeshStandardMaterial({ color: 0xff7c9b, roughness: 0.3, metalness: 0.15 });
  
  const vSize = 7;
  for (let x = -vSize; x <= vSize; x++) {
    for (let y = -vSize; y <= vSize; y++) {
      for (let z = -vSize; z <= vSize; z++) {
        const xF = x / (vSize * 0.85);
        const yF = y / (vSize * 0.85);
        const zF = z / (vSize * 0.85);
        
        const a = xF*xF + (9/4)*yF*yF + zF*zF - 1.0;
        const hVal = a*a*a - xF*xF*zF*zF*zF;
        
        if (hVal <= 0.0) {
          const voxel = new THREE.Mesh(boxGeo, boxMat);
          voxel.position.set(x * 0.22, y * 0.22, z * 0.22);
          voxelGroup.add(voxel);
        }
      }
    }
  }
  voxelGroup.scale.set(0, 0, 0);
  sceneThreeD.add(voxelGroup);
  
  // Main animation / render loop
  const clock = new THREE.Clock();
  
  function animate3d() {
    requestAnimationFrame(animate3d);
    
    const time = clock.getElapsedTime();
    
    // 3. CSS 3D Cube (Dimension 3)
    if (activeDimension === 3) {
      if (renderer) renderer.clear();
      const cube = document.querySelector(".cube3d");
      if (cube) {
        const ry = time * 25 + scrollMouseX * 45;
        const rx = scrollMouseY * 35;
        cube.style.transform = `rotateX(${-rx}deg) rotateY(${ry}deg)`;
      }
      // Fade out Three.js groups
      if (renderer) {
        uniforms.u_opacity.value += (0.0 - uniforms.u_opacity.value) * 0.1;
        pMat.opacity += (0.0 - pMat.opacity) * 0.1;
        torusMat.opacity += (0.0 - torusMat.opacity) * 0.1;
        voxelGroup.scale.set(
          voxelGroup.scale.x + (0.0 - voxelGroup.scale.x) * 0.1,
          voxelGroup.scale.y + (0.0 - voxelGroup.scale.y) * 0.1,
          voxelGroup.scale.z + (0.0 - voxelGroup.scale.z) * 0.1
        );
      }
      return;
    }
    
    // 5. ASCII 3D Console (Dimension 5)
    else if (activeDimension === 5) {
      if (renderer) renderer.clear();
      const pre = document.getElementById("scroll3dAsciiPre");
      if (pre) {
        pre.innerHTML = renderAsciiBuffer(time, scrollMouseX, scrollMouseY);
      }
      // Fade out Three.js groups
      if (renderer) {
        uniforms.u_opacity.value += (0.0 - uniforms.u_opacity.value) * 0.1;
        pMat.opacity += (0.0 - pMat.opacity) * 0.1;
        torusMat.opacity += (0.0 - torusMat.opacity) * 0.1;
        voxelGroup.scale.set(
          voxelGroup.scale.x + (0.0 - voxelGroup.scale.x) * 0.1,
          voxelGroup.scale.y + (0.0 - voxelGroup.scale.y) * 0.1,
          voxelGroup.scale.z + (0.0 - voxelGroup.scale.z) * 0.1
        );
      }
      return;
    }
    
    // 9. CSS 3D Parallax Typography (Dimension 9)
    else if (activeDimension === 9) {
      if (renderer) renderer.clear();
      const container = document.querySelector(".typo3d-container");
      if (container) {
        const ry = scrollMouseX * 35;
        const rx = -scrollMouseY * 35;
        container.style.transform = `rotateX(${rx}deg) rotateY(${ry}deg)`;
      }
      // Fade out Three.js groups
      if (renderer) {
        uniforms.u_opacity.value += (0.0 - uniforms.u_opacity.value) * 0.1;
        pMat.opacity += (0.0 - pMat.opacity) * 0.1;
        torusMat.opacity += (0.0 - torusMat.opacity) * 0.1;
        voxelGroup.scale.set(
          voxelGroup.scale.x + (0.0 - voxelGroup.scale.x) * 0.1,
          voxelGroup.scale.y + (0.0 - voxelGroup.scale.y) * 0.1,
          voxelGroup.scale.z + (0.0 - voxelGroup.scale.z) * 0.1
        );
      }
      return;
    }
    
    // All other dimensions require WebGL:
    if (!renderer) return;
    
    // Update theme specific background colors inside uniforms
    const bodyClass = document.body.className;
    if (bodyClass.includes("theme-sakura")) {
      uniforms.u_heartColor.value.set("#ffb7c5");
      uniforms.u_bgColor1.value.set("#fff2f5");
      uniforms.u_bgColor2.value.set("#ffefe8");
    } else if (bodyClass.includes("theme-cafe")) {
      uniforms.u_heartColor.value.set("#ffaa76");
      uniforms.u_bgColor1.value.set("#ffefe8");
      uniforms.u_bgColor2.value.set("#ffe3d5");
    } else if (bodyClass.includes("theme-dream")) {
      uniforms.u_heartColor.value.set("#9b72cf");
      uniforms.u_bgColor1.value.set("#140d21");
      uniforms.u_bgColor2.value.set("#1f1435");
    } else if (bodyClass.includes("theme-rain")) {
      uniforms.u_heartColor.value.set("#4facfe");
      uniforms.u_bgColor1.value.set("#f0f4f8");
      uniforms.u_bgColor2.value.set("#d0e1f9");
    }
    
    // Update basic uniforms
    uniforms.u_time.value = time;
    // Dampen/smooth mouse coordinates
    uniforms.u_mouse.value.x += (scrollMouseX - uniforms.u_mouse.value.x) * 0.1;
    uniforms.u_mouse.value.y += (scrollMouseY - uniforms.u_mouse.value.y) * 0.1;
    
    // Smooth transition interpolations for mesh properties
    const targetRaymarchOp = (activeDimension === 1 || activeDimension === 8) ? 1.0 : 0.0;
    uniforms.u_opacity.value += (targetRaymarchOp - uniforms.u_opacity.value) * 0.15;
    planeMesh.visible = (uniforms.u_opacity.value > 0.01);
    
    const targetPointsOp = (activeDimension === 2 || activeDimension === 10) ? 0.9 : 0.0;
    pMat.opacity += (targetPointsOp - pMat.opacity) * 0.15;
    pointCloud.visible = (pMat.opacity > 0.01);
    
    const targetTorusOp = (activeDimension === 4) ? (0.35 + 0.65 * (1.0 - dimensionProgress)) : 0.0;
    torusMat.opacity += (targetTorusOp - torusMat.opacity) * 0.15;
    torusMesh.visible = (torusMat.opacity > 0.01);
    
    const targetVoxelScale = (activeDimension === 6 || activeDimension === 7) ? 1.0 : 0.0;
    voxelGroup.scale.set(
      voxelGroup.scale.x + (targetVoxelScale - voxelGroup.scale.x) * 0.12,
      voxelGroup.scale.y + (targetVoxelScale - voxelGroup.scale.y) * 0.12,
      voxelGroup.scale.z + (targetVoxelScale - voxelGroup.scale.z) * 0.12
    );
    voxelGroup.visible = (voxelGroup.scale.x > 0.01);
    
    // 1. Raymarch Render (Dimensions 1 and 8)
    if (activeDimension === 1 || activeDimension === 8) {
      uniforms.u_theme.value = activeDimension;
      renderer.render(sceneRaymarch, cameraOrtho);
    }
    
    // 2. Points (Dimension 2 & SBS 10)
    else if (activeDimension === 2 || activeDimension === 10) {
      pointCloud.rotation.y = time * 0.4 + scrollMouseX * 0.6;
      pointCloud.rotation.x = scrollMouseY * 0.4;
      
      // Dispersion behavior
      const posAttr = pointCloud.geometry.attributes.position;
      const arr = posAttr.array;
      for (let i = 0; i < pCount; i++) {
        const theta = i * 0.15 + time;
        const dispersionFactor = activeDimension === 2 ? dimensionProgress : 0.0;
        const dx = Math.sin(theta) * dispersionFactor * 4.5;
        const dy = Math.cos(theta) * dispersionFactor * 4.5;
        arr[i*3] = pOrigPositions[i*3] + dx;
        arr[i*3+1] = pOrigPositions[i*3+1] + dy;
      }
      posAttr.needsUpdate = true;
      
      if (activeDimension === 2) {
        renderer.render(sceneThreeD, cameraPersp);
      } else {
        // SBS VR Viewport render
        const w = scrollCanvas.clientWidth;
        const h = scrollCanvas.clientHeight;
        
        // Left Eye
        renderer.setViewport(0, 0, w / 2, h);
        renderer.setScissor(0, 0, w / 2, h);
        renderer.setScissorTest(true);
        cameraPersp.position.set(-0.25, 0, 5);
        cameraPersp.lookAt(0, 0, 0);
        renderer.render(sceneThreeD, cameraPersp);
        
        // Right Eye
        renderer.setViewport(w / 2, 0, w / 2, h);
        renderer.setScissor(w / 2, 0, w / 2, h);
        cameraPersp.position.set(0.25, 0, 5);
        cameraPersp.lookAt(0, 0, 0);
        renderer.render(sceneThreeD, cameraPersp);
        
        // Restore
        renderer.setScissorTest(false);
        renderer.setViewport(0, 0, w, h);
      }
    }
    
    // 4. Wireframe Torus (Dimension 4)
    else if (activeDimension === 4) {
      torusMesh.rotation.y = time * 0.55 + scrollMouseX * 0.7;
      torusMesh.rotation.x = time * 0.35 - scrollMouseY * 0.5;
      renderer.render(sceneThreeD, cameraPersp);
    }
    
    // 6. Voxel Heart (Dimension 6)
    else if (activeDimension === 6) {
      voxelGroup.rotation.y = time * 0.45 + scrollMouseX * 0.5;
      voxelGroup.rotation.x = scrollMouseY * 0.4;
      
      voxelGroup.children.forEach((vox, idx) => {
        const targetScale = Math.max(0.01, Math.min(1.0, (1.2 - idx / voxelGroup.children.length) + (dimensionProgress - 0.5) * 2.0));
        vox.scale.set(targetScale, targetScale, targetScale);
      });
      
      renderer.render(sceneThreeD, cameraPersp);
    }
    
    // 7. Red-Cyan Anaglyph Voxel Heart (Dimension 7)
    else if (activeDimension === 7) {
      voxelGroup.rotation.y = time * 0.45 + scrollMouseX * 0.5;
      voxelGroup.rotation.x = scrollMouseY * 0.4;
      voxelGroup.children.forEach(vox => vox.scale.set(1, 1, 1));
      
      // Anaglyph Camera Mask Render
      renderer.clear();
      
      // Left eye (red only)
      renderer.colorMask(true, false, false, true);
      cameraPersp.position.set(-0.15, 0, 5);
      cameraPersp.lookAt(0, 0, 0);
      renderer.render(sceneThreeD, cameraPersp);
      
      // Right eye (cyan: green + blue)
      renderer.clearDepth();
      renderer.colorMask(false, true, true, true);
      cameraPersp.position.set(0.15, 0, 5);
      cameraPersp.lookAt(0, 0, 0);
      renderer.render(sceneThreeD, cameraPersp);
      
      // Reset color write mask
      renderer.colorMask(true, true, true, true);
    }
  }
  
  // Custom ASCII screen-buffer logic
  function renderAsciiBuffer(time, mx, my) {
    const width = 50;
    const height = 24;
    const buffer = Array(width * height).fill(" ");
    const zBuffer = Array(width * height).fill(-Infinity);
    
    const cosX = Math.cos(time * 0.65 + mx * 1.5);
    const sinX = Math.sin(time * 0.65 + mx * 1.5);
    const cosY = Math.cos(time * 0.45 + my * 1.5);
    const sinY = Math.sin(time * 0.45 + my * 1.5);
    
    asciiPoints.forEach(p => {
      // Rotation
      let y1 = p.y * cosX - p.z * sinX;
      let z1 = p.y * sinX + p.z * cosX;
      let x2 = p.x * cosY + z1 * sinY;
      let z2 = -p.x * sinY + z1 * cosY;
      
      const dist = 10;
      const ooz = 1 / (z2 + dist);
      
      const xp = Math.floor(width / 2 + x2 * ooz * 32 * 2);
      const yp = Math.floor(height / 2 + y1 * ooz * 16);
      
      if (xp >= 0 && xp < width && yp >= 0 && yp < height) {
const idx = xp + yp * width;
        if (z2 > zBuffer[idx]) {
          zBuffer[idx] = z2;
          const chars = ".,-~:;=!*#$@";
          const charIdx = Math.floor(Math.max(0, Math.min(chars.length - 1, (z2 + 3) * 2.2)));
          buffer[idx] = chars[charIdx];
        }
      }
    });
    
    let output = "";
    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        output += buffer[x + y * width];
      }
      output += "\n";
    }
    return output;
  }

  animate3d();
}

// =====================================================
// Apology Section: "I forgive you" button
// =====================================================
const forgiveBtn = document.getElementById("forgiveBtn");
const forgiveReply = document.getElementById("forgiveReply");
if (forgiveBtn) {
  forgiveBtn.addEventListener("click", () => {
    forgiveReply.hidden = false;
    forgiveBtn.disabled = true;
    forgiveBtn.style.opacity = "0.6";
    forgiveBtn.textContent = "Thank you, my love ♡";
    if (typeof initAudio === "function") initAudio();
    if (typeof triggerWinConfetti === "function") triggerWinConfetti();
    const rect = forgiveBtn.getBoundingClientRect();
    if (typeof spawnSparklesAt === "function") {
      spawnSparklesAt(rect.left + rect.width / 2, rect.top, 14, ["💖", "🌹", "🌸", "✨", "💐"]);
    }
  });
}

// =====================================================
// 🎓 Calculus Academy Portal Logic
// =====================================================

const CALC_MODULES = [
  {
    step: 1,
    title: "1. Limits 🔗",
    conceptTitle: "The Heartbeat of Limits: Infinite Closeness",
    conceptText: "In Calculus, a limit is the value a function approaches as the input gets closer and closer to some number. Even if the function is undefined at that exact spot, the limit can still exist! It is about the journey, not the destination. Just like how two hearts can align closer and closer until they beat as one.",
    realWorldTitle: "GPS Velocity tracking",
    realWorldText: "To calculate your exact speed at a specific instant (instantaneous velocity), a GPS device cannot divide by zero elapsed time. Instead, it takes the limit of your average velocity as the time interval approaches 0.",
    mathFormula: "\\lim_{x \\to 3} \\frac{x^2 - 9}{x - 3} = 6",
    chalkMotivation: "Limits are like standing on a balcony together, leaning in closer and closer... but never stepping off. Mathematics is all about finding the beauty in closeness.",
    challengeQuestion: "Evaluate the limit algebraically:<br><strong>$$\\lim_{x \\to 3} \\frac{x^2 - 9}{x - 3}$$</strong>",
    correctAnswer: "6",
    hints: [
      "Direct substitution of x = 3 gives 0/0, which is indeterminate. We must factor the numerator first!",
      "The numerator is a difference of squares: x^2 - 9. How do you factor that?",
      "x^2 - 9 factors into (x - 3)(x + 3). Write out the limit expression with this factored form.",
      "Cancel out the common term (x - 3) from the top and bottom. What function remains?",
      "You are left with (x + 3). Now plug x = 3 directly into this simplified expression: 3 + 3 = ?"
    ],
    solutionSteps: [
      "Directly substituting $x = 3$ yields $(3^2 - 9)/(3 - 3) = 0/0$, which is undefined (indeterminate form).",
      "Factor the numerator using the difference of squares rule: $x^2 - 9 = (x - 3)(x + 3)$.",
      "Substitute this factorization back into the limit: $\\lim_{x \\to 3} \\frac{(x - 3)(x + 3)}{x - 3}$.",
      "Cancel the common factor $(x - 3)$ since $x \\neq 3$ in the limit context: $\\lim_{x \\to 3} (x + 3)$.",
      "Substitute $x = 3$ into the remaining simplified expression: $3 + 3 = 6$."
    ]
  },
  {
    step: 2,
    title: "2. First Principles 📈",
    conceptTitle: "First Principles: Finding the Slope at a Single Point",
    conceptText: "A secant line measures the average slope between two points. If we drag those points closer and closer together until the distance between them (h) approaches 0, the secant line morphs into a tangent line. The slope of this tangent line is the derivative, calculated from first principles.",
    realWorldTitle: "Rocket Science",
    realWorldText: "When tracking a rocket launch, sensors measure its distance at different points. To find the exact acceleration or velocity at exactly t = 5 seconds, engineers apply first principles over shrinking intervals of time.",
    mathFormula: "f'(x) = \\lim_{h \\to 0} \\frac{f(x+h) - f(x)}{h}",
    chalkMotivation: "First principles is the language of change. It tells us how fast we are growing at this exact millisecond.",
    challengeQuestion: "Using the definition from first principles, find the derivative value of <strong>f(x) = 2x^2</strong> at <strong>x = 3</strong>.",
    correctAnswer: "12",
    hints: [
      "First, write down the formula: f'(x) = &lim;_{h &rarr; 0} [f(x+h) - f(x)] / h.",
      "Evaluate f(x+h) for f(x) = 2x^2: f(x+h) = 2(x+h)^2 = 2(x^2 + 2xh + h^2) = 2x^2 + 4xh + 2h^2.",
      "Subtract f(x): f(x+h) - f(x) = (2x^2 + 4xh + 2h^2) - 2x^2 = 4xh + 2h^2.",
      "Divide the result by h to simplify: (4xh + 2h^2) / h = 4x + 2h.",
      "Take the limit as h goes to 0: 4x + 2(0) = 4x. Now evaluate 4x at x = 3. What is 4 * 3?"
    ],
    solutionSteps: [
      "Apply the definition of the derivative from first principles: $f'(x) = \\lim_{h \\to 0} \\frac{f(x+h) - f(x)}{h}$.",
      "Evaluate $f(x+h)$: $f(x+h) = 2(x+h)^2 = 2(x^2 + 2xh + h^2) = 2x^2 + 4xh + 2h^2$.",
      "Subtract $f(x) = 2x^2$: $f(x+h) - f(x) = 2x^2 + 4xh + 2h^2 - 2x^2 = 4xh + 2h^2$.",
      "Divide by $h$: $\\frac{4xh + 2h^2}{h} = \\frac{h(4x + 2h)}{h} = 4x + 2h$.",
      "Evaluate the limit as $h \\to 0$: $\\lim_{h \\to 0} (4x + 2h) = 4x$.",
      "Substitute $x = 3$ to get the final slope: $f'(3) = 4(3) = 12$."
    ]
  },
  {
    step: 3,
    title: "3. Rules ⚡",
    conceptTitle: "The Quick Rules: Unleashing Derivatives",
    conceptText: "First principles is beautiful, but algebraic shortcuts make calculations instant. The Power Rule, Product Rule, Quotient Rule, and Chain Rule are the keys to unlocking derivatives of any complex function.",
    realWorldTitle: "Business Marginal Cost",
    realWorldText: "Finance analysts model revenue and cost as equations. They use derivative shortcuts to instantly calculate 'marginal cost' (the cost of producing one more unit) to determine maximum profit margins.",
    mathFormula: "\\frac{d}{dx}[x^n] = n x^{n-1}",
    chalkMotivation: "Rules give us the speed to solve complex systems. With a few simple steps, we can differentiate anything.",
    challengeQuestion: "Differentiate <strong>f(x) = (3x^2 + 2)^4</strong> using the Chain Rule, and find the value of <strong>f'(1)</strong>.",
    correctAnswer: "3000",
    hints: [
      "This requires the Chain Rule: dy/dx = f'(g(x)) * g'(x). Here, the outer function is u^4, and the inner function is u = 3x^2 + 2.",
      "Differentiate the outer function with respect to u: d/du [u^4] = 4u^3. This gives 4(3x^2 + 2)^3.",
      "Differentiate the inner function: d/dx [3x^2 + 2] = 6x.",
      "Multiply them: f'(x) = 4(3x^2 + 2)^3 * 6x = 24x(3x^2 + 2)^3.",
      "Substitute x = 1: f'(1) = 24(1) * (3(1)^2 + 2)^3 = 24 * 5^3. Solve 24 * 125."
    ],
    solutionSteps: [
      "Identify the outer function $f(u) = u^4$ and the inner function $u = g(x) = 3x^2 + 2$.",
      "Differentiate the outer function: $f'(u) = 4u^3 = 4(3x^2 + 2)^3$.",
      "Differentiate the inner function: $g'(x) = 6x$.",
      "Apply the Chain Rule: $f'(x) = 4(3x^2 + 2)^3 \\cdot 6x = 24x(3x^2 + 2)^3$.",
      "Substitute $x = 1$: $f'(1) = 24(1)(3(1)^2 + 2)^3 = 24 \\cdot (5)^3$.",
      "Calculate $5^3 = 125$, then multiply: $24 \\cdot 125 = 3000$."
    ]
  },
  {
    step: 4,
    title: "4. Optimization 🎯",
    conceptTitle: "Optimization: Finding the Absolute Best",
    conceptText: "By setting a function's derivative to zero (f'(x) = 0), we find the critical turning points. These points represent local maximums (peaks) or local minimums (valleys). Optimization is the art of mathematically finding the absolute best solution under constraints.",
    realWorldTitle: "Product Design",
    realWorldText: "Companies optimize product sizing. To pack 330ml of liquid into a metal can using the minimum amount of metal (minimizing surface area and costs), engineers set the derivative of surface area with respect to radius to zero.",
    mathFormula: "f'(x) = 0 \\implies \\text{Critical Points}",
    chalkMotivation: "Optimization finds the perfect balance. It is about choosing the best path out of infinite possibilities.",
    challengeQuestion: "A rectangular garden is built against a wall, requiring fencing on three sides. If you have <strong>40 meters</strong> of fencing, what is the maximum area of the garden (in square meters)?",
    correctAnswer: "200",
    hints: [
      "Let the side perpendicular to the wall be x, and the side parallel to the wall be y.",
      "The total fence length is 2x + y = 40. This means y = 40 - 2x.",
      "The area is A = x * y. Substitute y: A(x) = x(40 - 2x) = 40x - 2x^2.",
      "To maximize area, take the derivative and set it to 0: A'(x) = 40 - 4x = 0.",
      "Solve for x: 4x = 40, so x = 10. Calculate the maximum area A(10) = 40(10) - 2(10)^2."
    ],
    solutionSteps: [
      "Define the dimensions: Let $x$ be the sides perpendicular to the wall, and $y$ be the side parallel to the wall.",
      "Set up the fence length constraint: $2x + y = 40 \\implies y = 40 - 2x$.",
      "Write the area function: $Area (A) = x \\cdot y = x(40 - 2x) = 40x - 2x^2$.",
      "Find the derivative of the area function: $A'(x) = 40 - 4x$.",
      "Set the derivative to zero for local extreme values: $40 - 4x = 0 \\implies 4x = 40 \\implies x = 10$.",
      "Confirm it is a maximum: The second derivative is $A''(x) = -4$ (negative, so it is a local maximum).",
      "Calculate the maximum area: $A(10) = 10 \\cdot (40 - 2(10)) = 10 \\cdot 20 = 200\\text{ square meters}$."
    ]
  },
  {
    step: 5,
    title: "5. Integration 💖",
    conceptTitle: "Integration: The Power of Accumulation",
    conceptText: "If differentiation splits a curve into tiny pieces, integration gathers those pieces back together. By summing up infinite infinitely thin rectangles (Riemann sums), we can calculate the exact area under any curve. Integration accumulates change over time.",
    realWorldTitle: "Tesla Battery Range",
    realWorldText: "Electric cars continuously change speed. The car's computer integrates the varying velocity curve over elapsed time to calculate the exact distance travelled and predict remaining battery range.",
    mathFormula: "\\int_{1}^{3} 3x^2 dx = [x^3]_{1}^{3} = 26",
    chalkMotivation: "Integration sums up every tiny moment. Every single second spent together accumulates into a lifetime of memories.",
    challengeQuestion: "Find the exact area under the curve <strong>f(x) = 3x^2</strong> from <strong>x = 1</strong> to <strong>x = 3</strong>.",
    correctAnswer: "26",
    hints: [
      "To find the area, evaluate the definite integral: &int;_{1}^{3} 3x^2 dx.",
      "Find the indefinite integral (antiderivative) of 3x^2.",
      "The antiderivative of 3x^2 is x^3, because the derivative of x^3 is 3x^2.",
      "Apply the Fundamental Theorem of Calculus: [x^3] from 1 to 3 = (3^3) - (1^3).",
      "Calculate 3^3 = 27 and 1^3 = 1. What is 27 - 1?"
    ],
    solutionSteps: [
      "Formulate the definite integral representing the area: $Area = \\int_{1}^{3} 3x^2 dx$.",
      "Find the antiderivative: $\\int 3x^2 dx = 3 \\cdot (x^3 / 3) = x^3$.",
      "Apply the Fundamental Theorem of Calculus: $Area = [x^3]_{1}^{3} = F(3) - F(1)$.",
      "Calculate the upper bound value: $3^3 = 27$.",
      "Calculate the lower bound value: $1^3 = 1$.",
      "Perform the subtraction: $27 - 1 = 26$."
    ]
  }
];

// Chalk Audio Synthesizer Context
let calcAudioCtx = null;
function getCalcAudioCtx() {
  if (!calcAudioCtx) {
    calcAudioCtx = new (window.AudioContext || window.webkitAudioContext)();
  }
  return calcAudioCtx;
}

function playChalkSound(type) {
  try {
    const ctx = getCalcAudioCtx();
    if (!ctx) return;
    if (ctx.state === "suspended") {
      ctx.resume();
    }
    
    const osc = ctx.createOscillator();
    const gainNode = ctx.createGain();
    osc.connect(gainNode);
    gainNode.connect(ctx.destination);
    
    const now = ctx.currentTime;
    
    if (type === 'write') {
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(2200, now);
      osc.frequency.exponentialRampToValueAtTime(120, now + 0.08);
      gainNode.gain.setValueAtTime(0.012, now);
      gainNode.gain.exponentialRampToValueAtTime(0.0001, now + 0.08);
      osc.start(now);
      osc.stop(now + 0.08);
    } else if (type === 'click') {
      osc.type = 'sine';
      osc.frequency.setValueAtTime(900, now);
      gainNode.gain.setValueAtTime(0.02, now);
      gainNode.gain.exponentialRampToValueAtTime(0.0001, now + 0.04);
      osc.start(now);
      osc.stop(now + 0.04);
    } else if (type === 'success') {
      const freqs = [329.63, 392.00, 523.25, 659.25]; // C major harmony
      freqs.forEach((f, i) => {
        const oscNode = ctx.createOscillator();
        const gNode = ctx.createGain();
        oscNode.type = 'sine';
        oscNode.frequency.setValueAtTime(f, now + i * 0.08);
        gNode.gain.setValueAtTime(0, now);
        gNode.gain.linearRampToValueAtTime(0.015, now + i * 0.08 + 0.02);
        gNode.gain.exponentialRampToValueAtTime(0.0001, now + 1.0);
        oscNode.connect(gNode);
        gNode.connect(ctx.destination);
        oscNode.start(now);
        oscNode.stop(now + 1.1);
      });
    } else if (type === 'eraser') {
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(75, now);
      osc.frequency.linearRampToValueAtTime(130, now + 0.6);
      
      const filter = ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.value = 130;
      
      osc.disconnect(gainNode);
      osc.connect(filter);
      filter.connect(gainNode);
      
      gainNode.gain.setValueAtTime(0, now);
      gainNode.gain.linearRampToValueAtTime(0.06, now + 0.15);
      gainNode.gain.linearRampToValueAtTime(0.06, now + 0.45);
      gainNode.gain.exponentialRampToValueAtTime(0.0001, now + 0.7);
      
      osc.start(now);
      osc.stop(now + 0.75);
    }
  } catch (e) {
    console.warn("Web Audio not allowed or error:", e);
  }
}

// Background Chalk Dust Particles
let chalkDustCanvas = null;
let chalkDustCtx = null;
let chalkParticles = [];
let chalkAnimationId = null;

function initChalkParticles() {
  chalkDustCanvas = document.getElementById("chalkDustCanvas");
  if (!chalkDustCanvas) return;
  chalkDustCtx = chalkDustCanvas.getContext("2d");
  
  function resizeDustCanvas() {
    const parent = chalkDustCanvas.parentElement;
    if (parent) {
      chalkDustCanvas.width = parent.clientWidth;
      chalkDustCanvas.height = parent.clientHeight;
    }
  }
  resizeDustCanvas();
  window.addEventListener("resize", resizeDustCanvas);
  
  const symbols = ["\u222B", "dx", "lim", "\u03B8", "f(x)", "y=x\u00B2", "\u221E", "\u03A3", "\u03C0", "dy/dx", "x\u2192a", "f'(x)"];
  chalkParticles = [];
  const numParticles = 28;
  for (let i = 0; i < numParticles; i++) {
    chalkParticles.push({
      x: Math.random() * chalkDustCanvas.width,
      y: Math.random() * chalkDustCanvas.height,
      text: symbols[Math.floor(Math.random() * symbols.length)],
      size: 11 + Math.random() * 11,
      vx: (Math.random() - 0.5) * 0.35,
      vy: (Math.random() - 0.5) * 0.35,
      opacity: 0.08 + Math.random() * 0.35
    });
  }
  
  function animateDust() {
    if (!chalkDustCtx || !chalkDustCanvas) return;
    chalkDustCtx.clearRect(0, 0, chalkDustCanvas.width, chalkDustCanvas.height);
    
    chalkParticles.forEach(p => {
      p.x += p.vx;
      p.y += p.vy;
      
      if (p.x < -50) p.x = chalkDustCanvas.width + 50;
      if (p.x > chalkDustCanvas.width + 50) p.x = -50;
      if (p.y < -50) p.y = chalkDustCanvas.height + 50;
      if (p.y > chalkDustCanvas.height + 50) p.y = -50;
      
      chalkDustCtx.save();
      chalkDustCtx.globalAlpha = p.opacity;
      chalkDustCtx.fillStyle = "#ffffff";
      chalkDustCtx.font = `${p.size}px 'Courier New', Courier, monospace`;
      chalkDustCtx.fillText(p.text, p.x, p.y);
      chalkDustCtx.restore();
    });
    
    chalkAnimationId = requestAnimationFrame(animateDust);
  }
  
  animateDust();
}

function stopChalkParticles() {
  if (chalkAnimationId) {
    cancelAnimationFrame(chalkAnimationId);
    chalkAnimationId = null;
  }
}

let calcState = {
  activeStep: 1,
  sliderVal: 50,
  hintsUnlocked: 0,
  completed: [false, false, false, false, false]
};

let lastChalkSoundTime = 0;
function playThrottledWriteSound() {
  const now = Date.now();
  if (now - lastChalkSoundTime > 140) {
    playChalkSound("write");
    lastChalkSoundTime = now;
  }
}

function initCalculusAcademy() {
  const portal = document.getElementById("calcAcademyPortal");
  const launchBtn = document.getElementById("launchCalcBtn");
  const exitBtn = document.getElementById("exitCalcBtn");
  const tabs = document.querySelectorAll(".calc-chalk-tab");
  const theoryCard = document.getElementById("chalkTheoryCard");
  const canvas = document.getElementById("calcPortalCanvas");
  const sliderContainer = document.getElementById("chalkSliderContainer");
  const questionText = document.getElementById("chalkQuestionText");
  const inputEl = document.getElementById("chalkAnswerInput");
  const checkBtn = document.getElementById("chalkCheckBtn");
  const feedbackText = document.getElementById("chalkFeedbackText");
  const hintDots = document.getElementById("chalkHintDots");
  const revealHintBtn = document.getElementById("revealHintBtn");
  const hintText = document.getElementById("chalkHintText");
  const showSolutionBtn = document.getElementById("chalkShowSolutionBtn");
  const solutionBox = document.getElementById("chalkSolutionBox");
  const motivationText = document.getElementById("chalkMotivationText");
  
  const calcScreen = document.getElementById("chalkCalcScreen");
  const modeArithmetic = document.getElementById("modeArithmetic");
  const modeAlgebraic = document.getElementById("modeAlgebraic");
  const arithmeticPad = document.getElementById("calcArithmeticPad");
  const algebraicPad = document.getElementById("calcAlgebraicPad");
  const polyInput = document.getElementById("calcPolyInput");
  const evalXInput = document.getElementById("calcEvalXInput");
  const diffBtn = document.getElementById("calcDifferentiateBtn");
  const evalBtn = document.getElementById("calcEvaluateBtn");
  const keys = document.querySelectorAll(".calc-key");
  const clearKey = document.getElementById("calcClear");
  const equalKey = document.getElementById("calcEqual");

  if (!portal || !launchBtn) return;

  const savedCompleted = localStorage.getItem("ncumoCalcCompleted");
  if (savedCompleted) {
    calcState.completed = JSON.parse(savedCompleted);
  }

  launchBtn.addEventListener("click", () => {
    playChalkSound("click");
    portal.hidden = false;
    setTimeout(() => {
      portal.classList.add("active");
      initChalkParticles();
      renderActiveStep();
    }, 10);
  });

  exitBtn.addEventListener("click", () => {
    playChalkSound("click");
    portal.classList.remove("active");
    stopChalkParticles();
    setTimeout(() => {
      portal.hidden = true;
    }, 500);
  });

  function triggerEraserSwipe(callback) {
    const eraser = document.getElementById("chalkboardEraser");
    if (!eraser) {
      callback();
      return;
    }
    eraser.hidden = false;
    eraser.classList.remove("swiping");
    void eraser.offsetWidth;
    eraser.classList.add("swiping");
    playChalkSound("eraser");
    
    setTimeout(() => {
      callback();
    }, 500);
    
    setTimeout(() => {
      eraser.hidden = true;
      eraser.classList.remove("swiping");
    }, 1000);
  }

  tabs.forEach(tab => {
    tab.addEventListener("click", () => {
      playChalkSound("click");
      const step = parseInt(tab.getAttribute("data-step"));
      let canAccess = true;
      for (let i = 0; i < step - 1; i++) {
        if (!calcState.completed[i]) {
          canAccess = false;
          break;
        }
      }
      
      if (canAccess) {
        tabs.forEach(t => t.classList.remove("active"));
        tab.classList.add("active");
        triggerEraserSwipe(() => {
          calcState.activeStep = step;
          calcState.hintsUnlocked = 0;
          renderActiveStep();
        });
      } else {
        feedbackText.hidden = false;
        feedbackText.className = "chalk-feedback error";
        feedbackText.textContent = "Complete the previous challenges to unlock this module! 🌸";
        setTimeout(() => {
          feedbackText.hidden = true;
        }, 3000);
      }
    });
  });

  function renderActiveStep() {
    const mod = CALC_MODULES[calcState.activeStep - 1];
    
    theoryCard.innerHTML = `
      <h4 class="chalk-theory-title">${mod.conceptTitle}</h4>
      <p>${mod.conceptText}</p>
      <div class="chalk-theory-context">
        <strong>Real-World Application (${mod.realWorldTitle}):</strong><br>
        ${mod.realWorldText}
      </div>
      <div class="chalk-theory-math"></div>
    `;

    const formulaEl = theoryCard.querySelector(".chalk-theory-math");
    if (formulaEl) {
      if (window.katex) {
        try {
          katex.render(mod.mathFormula, formulaEl, { throwOnError: false, displayMode: true });
        } catch (e) {
          formulaEl.innerHTML = mod.mathFormula;
        }
      } else {
        formulaEl.innerHTML = `<code>${mod.mathFormula}</code>`;
      }
    }

    motivationText.textContent = mod.chalkMotivation;

    if (window.katex) {
      try {
        let questionHtml = mod.challengeQuestion;
        const matches = questionHtml.match(/\$\$(.*?)\$\$/g);
        if (matches) {
          matches.forEach(m => {
            const math = m.replace(/\$\$/g, "");
            const tempSpan = document.createElement("span");
            katex.render(math, tempSpan, { throwOnError: false, displayMode: false });
            questionHtml = questionHtml.replace(m, tempSpan.outerHTML);
          });
        }
        questionText.innerHTML = questionHtml;
      } catch (err) {
        questionText.innerHTML = mod.challengeQuestion.replace(/\$\$(.*?)\$\$/g, '<code>$1</code>');
      }
    } else {
      questionText.innerHTML = mod.challengeQuestion.replace(/\$\$(.*?)\$\$/g, '<code>$1</code>');
    }

    inputEl.value = "";
    feedbackText.hidden = true;
    hintText.hidden = true;
    solutionBox.hidden = true;
    showSolutionBtn.hidden = true;

    updateHintDots();
    setupSlider(mod.step);
    drawCalcVisualizer();
  }

  function setupSlider(step) {
    sliderContainer.innerHTML = "";
    let min = 0, max = 100, val = 50, label = "Slider";
    
    if (step === 1) {
      min = 0; max = 100; val = 15; label = "Approach Point x (Drag towards 50)";
    } else if (step === 2) {
      min = 1; max = 100; val = 90; label = "Distance h (Drag to 0 to find tangent slope)";
    } else if (step === 3) {
      min = -30; max = 30; val = 10; label = "Scan Point x";
    } else if (step === 4) {
      min = 2; max = 18; val = 4; label = "Fenced Cutout side x (m) (Maximize Area!)";
    } else if (step === 5) {
      min = 2; max = 30; val = 4; label = "Number of Riemann Sum Rectangle Slices (N)";
    }

    calcState.sliderVal = val;

    sliderContainer.innerHTML = `
      <div class="chalk-slider-label">
        <span>${label}</span>
        <span id="chalkSliderValText"><strong>${val}</strong></span>
      </div>
      <input type="range" class="calc-slider" id="chalkSlider" min="${min}" max="${max}" value="${val}">
    `;

    const slider = document.getElementById("chalkSlider");
    slider.addEventListener("input", (e) => {
      calcState.sliderVal = parseFloat(e.target.value);
      playThrottledWriteSound();
      let displayVal = calcState.sliderVal;
      if (step === 1) {
        displayVal = (calcState.sliderVal < 50) ? (0.5 + 1.45 * (calcState.sliderVal / 50)).toFixed(2) : (3.5 - 1.45 * ((calcState.sliderVal - 50) / 50)).toFixed(2);
      } else if (step === 2) {
        displayVal = (0.05 + 2.45 * (calcState.sliderVal / 100)).toFixed(2);
      } else if (step === 3) {
        displayVal = (calcState.sliderVal / 10).toFixed(1);
      } else if (step === 4) {
        displayVal = calcState.sliderVal.toFixed(1) + "m";
      } else if (step === 5) {
        displayVal = calcState.sliderVal;
      }
      document.getElementById("chalkSliderValText").innerHTML = `<strong>${displayVal}</strong>`;
      drawCalcVisualizer();
    });
  }

  function drawCalcVisualizer() {
    const rect = canvas.getBoundingClientRect();
    const dpr = window.devicePixelRatio || 1;
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    
    const ctx = canvas.getContext("2d");
    ctx.scale(dpr, dpr);
    
    const step = calcState.activeStep;
    const sVal = calcState.sliderVal;
    
    ctx.clearRect(0, 0, rect.width, rect.height);
    
    ctx.strokeStyle = "rgba(255, 255, 255, 0.05)";
    ctx.lineWidth = 1;
    for (let x = 0; x < rect.width; x += 30) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, rect.height);
      ctx.stroke();
    }
    for (let y = 0; y < rect.height; y += 30) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(rect.width, y);
      ctx.stroke();
    }

    if (step === 1) {
      const originX = 160;
      const originY = 180;
      const scale = 30;

      drawAxes(ctx, originX, originY, "x", "y", rect);

      ctx.strokeStyle = "#a3be8c";
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(originX - 3 * scale, originY - (-1) * scale);
      ctx.lineTo(originX + 1.95 * scale, originY - 3.95 * scale);
      ctx.stroke();

      ctx.beginPath();
      ctx.moveTo(originX + 2.05 * scale, originY - 4.05 * scale);
      ctx.lineTo(originX + 5 * scale, originY - 7 * scale);
      ctx.stroke();

      const hX = originX + 2 * scale;
      const hY = originY - 4 * scale;
      ctx.fillStyle = "#1e222a";
      ctx.strokeStyle = "#ff9ebb";
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(hX, hY, 6, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();

      let x = 0;
      if (sVal < 50) {
        x = 0.5 + 1.45 * (sVal / 50);
      } else {
        x = 3.5 - 1.45 * ((sVal - 50) / 50);
      }
      const y = x + 2;
      const ptX = originX + x * scale;
      const ptY = originY - y * scale;

      ctx.strokeStyle = "rgba(255, 255, 255, 0.25)";
      ctx.setLineDash([4, 4]);
      ctx.beginPath();
      ctx.moveTo(ptX, ptY);
      ctx.lineTo(ptX, originY);
      ctx.moveTo(ptX, ptY);
      ctx.lineTo(originX, ptY);
      ctx.stroke();
      ctx.setLineDash([]);

      ctx.fillStyle = "#ebcb8b";
      ctx.beginPath();
      ctx.arc(ptX, ptY, 6, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = "#eceff4";
      ctx.font = "12px Courier New";
      ctx.fillText(`L = 6 (Limit)`, originX - 90, hY + 4);
      ctx.fillText(`a = 3`, hX - 18, originY + 15);
      
      ctx.fillStyle = "#ebcb8b";
      ctx.fillText(`x: ${x.toFixed(2)}`, ptX - 25, originY - 5);
      ctx.fillText(`y: ${y.toFixed(2)}`, originX + 5, ptY - 5);

    } else if (step === 2) {
      const originX = 150;
      const originY = 220;
      const scale = 40;

      drawAxes(ctx, originX, originY, "x", "y", rect);

      ctx.strokeStyle = "#88c0d0";
      ctx.lineWidth = 3;
      ctx.beginPath();
      for (let px = -1; px <= 4.2; px += 0.1) {
        const py = 0.3 * px * px;
        const cx = originX + px * scale;
        const cy = originY - py * scale;
        if (px === -1) ctx.moveTo(cx, cy);
        else ctx.lineTo(cx, cy);
      }
      ctx.stroke();

      const ax = 1.5;
      const ay = 0.3 * ax * ax;
      const aX = originX + ax * scale;
      const aY = originY - ay * scale;

      const h = 0.05 + 2.45 * (sVal / 100);
      const bx = ax + h;
      const by = 0.3 * bx * bx;
      const bX = originX + bx * scale;
      const bY = originY - by * scale;

      const m = (by - ay) / (bx - ax);

      ctx.strokeStyle = "#ebcb8b";
      ctx.lineWidth = 2;
      ctx.beginPath();
      const startX = ax - 1.2;
      const startY = m * (startX - ax) + ay;
      const endX = bx + 1.2;
      const endY = m * (endX - ax) + ay;
      ctx.moveTo(originX + startX * scale, originY - startY * scale);
      ctx.lineTo(originX + endX * scale, originY - endY * scale);
      ctx.stroke();

      const tangentM = 0.6 * ax;
      ctx.strokeStyle = "#ff9ebb";
      ctx.setLineDash([3, 3]);
      ctx.beginPath();
      const tStartX = ax - 1.5;
      const tStartY = tangentM * (tStartX - ax) + ay;
      const tEndX = ax + 2.0;
      const tEndY = tangentM * (tEndX - ax) + ay;
      ctx.moveTo(originX + tStartX * scale, originY - tStartY * scale);
      ctx.lineTo(originX + tEndX * scale, originY - tEndY * scale);
      ctx.stroke();
      ctx.setLineDash([]);

      ctx.fillStyle = "#a3be8c";
      ctx.beginPath();
      ctx.arc(aX, aY, 6, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = "#ff9ebb";
      ctx.beginPath();
      ctx.arc(bX, bY, 6, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = "#eceff4";
      ctx.font = "12px Courier New";
      ctx.fillText(`Point A(x)`, aX - 10, aY - 12);
      ctx.fillText(`Point B(x+h)`, bX - 10, bY - 12);
      ctx.fillText(`h: ${h.toFixed(2)}`, bX + 10, bY + 12);
      ctx.fillStyle = "#ebcb8b";
      ctx.fillText(`Secant Slope (Average Rate): ${m.toFixed(2)}`, 20, 30);
      ctx.fillStyle = "#ff9ebb";
      ctx.fillText(`Tangent Slope (Instant): ${tangentM.toFixed(2)}`, 20, 50);

    } else if (step === 3) {
      const originX = 240;
      const originY = 130;
      const scale = 35;

      drawAxes(ctx, originX, originY, "x", "y", rect);

      ctx.strokeStyle = "#a3be8c";
      ctx.lineWidth = 3;
      ctx.beginPath();
      for (let px = -3.5; px <= 3.5; px += 0.1) {
        const py = 0.1 * px * px * px - 1.2 * px;
        const cx = originX + px * scale;
        const cy = originY - py * scale;
        if (px === -3.5) ctx.moveTo(cx, cy);
        else ctx.lineTo(cx, cy);
      }
      ctx.stroke();

      ctx.strokeStyle = "rgba(255, 158, 187, 0.4)";
      ctx.lineWidth = 2;
      ctx.beginPath();
      for (let px = -3.5; px <= 3.5; px += 0.1) {
        const py = 0.3 * px * px - 1.2;
        const cx = originX + px * scale;
        const cy = originY - py * scale;
        if (px === -3.5) ctx.moveTo(cx, cy);
        else ctx.lineTo(cx, cy);
      }
      ctx.stroke();

      const x = sVal / 10;
      const y = 0.1 * x * x * x - 1.2 * x;
      const dy = 0.3 * x * x - 1.2;

      const ptX = originX + x * scale;
      const ptY = originY - y * scale;
      const dPtY = originY - dy * scale;

      ctx.strokeStyle = "#ebcb8b";
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      const lx1 = x - 1.5;
      const ly1 = dy * (lx1 - x) + y;
      const lx2 = x + 1.5;
      const ly2 = dy * (lx2 - x) + y;
      ctx.moveTo(originX + lx1 * scale, originY - ly1 * scale);
      ctx.lineTo(originX + lx2 * scale, originY - ly2 * scale);
      ctx.stroke();

      ctx.strokeStyle = "rgba(255, 255, 255, 0.15)";
      ctx.setLineDash([2, 2]);
      ctx.beginPath();
      ctx.moveTo(ptX, 0);
      ctx.lineTo(ptX, rect.height);
      ctx.stroke();
      ctx.setLineDash([]);

      ctx.fillStyle = "#a3be8c";
      ctx.beginPath();
      ctx.arc(ptX, ptY, 5, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = "#ff9ebb";
      ctx.beginPath();
      ctx.arc(ptX, dPtY, 5, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = "#eceff4";
      ctx.font = "11px Courier New";
      ctx.fillText(`f(x) = 0.1x³ - 1.2x (Function)`, 15, 220);
      ctx.fillStyle = "#ff9ebb";
      ctx.fillText(`f'(x) = 0.3x² - 1.2 (Derivative)`, 15, 240);

      ctx.fillStyle = "#ebcb8b";
      ctx.fillText(`Scan x: ${x.toFixed(1)}`, ptX + 8, originY + 15);
      ctx.fillText(`Slope of tangent = ${dy.toFixed(2)}`, ptX + 8, ptY - 10);
      ctx.fillText(`Derivative Height = ${dy.toFixed(2)}`, ptX + 8, dPtY + 15);

    } else if (step === 4) {
      const xVal = sVal;
      const yVal = 40 - 2 * xVal;
      const area = xVal * yVal;

      ctx.fillStyle = "#2e3440";
      ctx.fillRect(20, 60, 15, 140);

      ctx.fillStyle = "#a3be8c";
      ctx.font = "11px Courier New";
      ctx.fillText("WALL", 18, 50);

      const rectScale = 3;
      const rectW = yVal * rectScale;
      const rectH = xVal * rectScale;
      
      ctx.strokeStyle = "#ff9ebb";
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(35, 130 - rectW / 2);
      ctx.lineTo(35 + rectH, 130 - rectW / 2);
      ctx.lineTo(35 + rectH, 130 + rectW / 2);
      ctx.lineTo(35, 130 + rectW / 2);
      ctx.stroke();

      ctx.fillStyle = "rgba(163, 190, 140, 0.15)";
      ctx.fillRect(35, 130 - rectW / 2, rectH, rectW);

      ctx.fillStyle = "#d8dee9";
      ctx.fillText(`x = ${xVal.toFixed(1)}m`, 30 + rectH / 2, 115 - rectW / 2);
      ctx.fillText(`y = ${yVal.toFixed(1)}m`, 40 + rectH, 134);
      ctx.fillStyle = "#ebcb8b";
      ctx.fillText(`Area: ${area.toFixed(0)}m²`, 45, 130);

      const graphOriginX = 240;
      const graphOriginY = 200;
      const graphScaleX = 10;
      const graphScaleY = 0.7;

      drawAxes(ctx, graphOriginX, graphOriginY, "x", "Area", rect);

      ctx.strokeStyle = "#88c0d0";
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      for (let gx = 0; gx <= 20; gx += 0.5) {
        const ga = 40 * gx - 2 * gx * gx;
        const cx = graphOriginX + gx * graphScaleX;
        const cy = graphOriginY - ga * graphScaleY;
        if (gx === 0) ctx.moveTo(cx, cy);
        else ctx.lineTo(cx, cy);
      }
      ctx.stroke();

      const peakX = graphOriginX + 10 * graphScaleX;
      const peakY = graphOriginY - 200 * graphScaleY;
      ctx.strokeStyle = "rgba(255, 255, 255, 0.2)";
      ctx.setLineDash([2, 2]);
      ctx.beginPath();
      ctx.moveTo(peakX, peakY);
      ctx.lineTo(peakX, graphOriginY);
      ctx.lineTo(graphOriginX, peakY);
      ctx.stroke();
      ctx.setLineDash([]);
      ctx.fillStyle = "#ff9ebb";
      ctx.beginPath();
      ctx.arc(peakX, peakY, 4, 0, Math.PI * 2);
      ctx.fill();

      const curX = graphOriginX + xVal * graphScaleX;
      const curY = graphOriginY - area * graphScaleY;
      ctx.fillStyle = "#ebcb8b";
      ctx.beginPath();
      ctx.arc(curX, curY, 6, 0, Math.PI * 2);
      ctx.fill();

      ctx.font = "11px Courier New";
      ctx.fillText(`Peak: 200m² at x=10m`, graphOriginX + 50, peakY - 5);
      ctx.fillText(`Current Area: ${area.toFixed(0)}m²`, graphOriginX + 50, curY - 15);

    } else if (step === 5) {
      const originX = 120;
      const originY = 220;
      const scaleX = 80;
      const scaleY = 40;

      drawAxes(ctx, originX, originY, "x", "y", rect);

      ctx.strokeStyle = "#a3be8c";
      ctx.lineWidth = 3;
      ctx.beginPath();
      for (let px = 0; px <= 3.4; px += 0.05) {
        const py = 0.4 * px * px;
        const cx = originX + px * scaleX;
        const cy = originY - py * scaleY;
        if (px === 0) ctx.moveTo(cx, cy);
        else ctx.lineTo(cx, cy);
      }
      ctx.stroke();

      const n = Math.floor(sVal);
      const startX = 1;
      const endX = 3;
      const width = (endX - startX) / n;
      let areaSum = 0;

      ctx.fillStyle = "rgba(136, 192, 208, 0.25)";
      ctx.strokeStyle = "#88c0d0";
      ctx.lineWidth = 1;

      for (let i = 0; i < n; i++) {
        const rx = startX + i * width;
        const ry = 0.4 * rx * rx;
        const rectW = width * scaleX;
        const rectH = ry * scaleY;
        const rxCanvas = originX + rx * scaleX;
        const ryCanvas = originY - rectH;

        ctx.fillRect(rxCanvas, ryCanvas, rectW, rectH);
        ctx.strokeRect(rxCanvas, ryCanvas, rectW, rectH);

        areaSum += ry * width;
      }

      ctx.strokeStyle = "rgba(255, 255, 255, 0.4)";
      ctx.lineWidth = 1;
      ctx.setLineDash([3, 3]);
      ctx.beginPath();
      ctx.moveTo(originX + 1 * scaleX, 0);
      ctx.lineTo(originX + 1 * scaleX, originY);
      ctx.moveTo(originX + 3 * scaleX, 0);
      ctx.lineTo(originX + 3 * scaleX, originY);
      ctx.stroke();
      ctx.setLineDash([]);

      ctx.fillStyle = "#eceff4";
      ctx.font = "12px Courier New";
      ctx.fillText(`Slices N: ${n}`, 260, 40);
      ctx.fillStyle = "#88c0d0";
      ctx.fillText(`Riemann Area Sum: ${(areaSum * (26 / 3.4667)).toFixed(2)}`, 260, 60);
      ctx.fillStyle = "#a3be8c";
      ctx.fillText(`Exact Definite Area: 26.00`, 260, 80);
      ctx.fillStyle = "#d8dee9";
      ctx.fillText(`x=1`, originX + 1 * scaleX - 10, originY + 15);
      ctx.fillText(`x=3`, originX + 3 * scaleX - 10, originY + 15);
    }
  }

  function drawAxes(ctx, ox, oy, xLabel, yLabel, rect) {
    ctx.strokeStyle = "rgba(255, 255, 255, 0.3)";
    ctx.lineWidth = 1.5;
    
    ctx.beginPath();
    ctx.moveTo(10, oy);
    ctx.lineTo(rect.width - 10, oy);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(ox, 10);
    ctx.lineTo(ox, rect.height - 10);
    ctx.stroke();

    ctx.fillStyle = "rgba(255, 255, 255, 0.6)";
    ctx.font = "10px monospace";
    ctx.fillText(xLabel, rect.width - 20, oy - 8);
    ctx.fillText(yLabel, ox + 8, 20);
  }

  checkBtn.addEventListener("click", () => {
    const mod = CALC_MODULES[calcState.activeStep - 1];
    const ans = inputEl.value.trim().replace(/\s+/g, '');
    
    if (ans === mod.correctAnswer) {
      feedbackText.hidden = false;
      feedbackText.className = "chalk-feedback success";
      feedbackText.innerHTML = `Amazing job, sthandwa sam! You got it right! 🌟<br>Derivative checked and verified.`;
      
      calcState.completed[calcState.activeStep - 1] = true;
      localStorage.setItem("ncumoCalcCompleted", JSON.stringify(calcState.completed));

      playChalkSound("success");
      if (typeof triggerWinConfetti === "function") triggerWinConfetti();
      
      const rect = checkBtn.getBoundingClientRect();
      if (typeof spawnSparklesAt === "function") {
        spawnSparklesAt(rect.left + rect.width / 2, rect.top, 15, ["🎓", "✨", "🌸", "💖", "✏️"]);
      }

      const allCompleted = calcState.completed.every(c => c === true);
      if (allCompleted) {
        unlockAchievement("calculus_master");
        feedbackText.innerHTML += `<br><strong>🎉 Curriculum Mastered! You unlocked the 'Calculus Guru' badge! 🏆</strong>`;
      }

      showSolutionBtn.hidden = false;
    } else {
      playChalkSound("click");
      feedbackText.hidden = false;
      feedbackText.className = "chalk-feedback error";
      feedbackText.textContent = "Almost there! Double-check your math, sthandwa sam, or reveal a hint if you need a guide! 🌸";
      showSolutionBtn.hidden = false;
    }
  });

  revealHintBtn.addEventListener("click", () => {
    playChalkSound("click");
    const mod = CALC_MODULES[calcState.activeStep - 1];
    if (calcState.hintsUnlocked < 5) {
      calcState.hintsUnlocked++;
      updateHintDots();
      
      hintText.hidden = false;
      hintText.innerHTML = `<strong>Hint ${calcState.hintsUnlocked}:</strong> ${mod.hints[calcState.hintsUnlocked - 1]}`;
    }
  });

  function updateHintDots() {
    const dots = hintDots.querySelectorAll(".hint-dot");
    dots.forEach((dot, idx) => {
      if (idx < calcState.hintsUnlocked) {
        dot.classList.add("unlocked");
      } else {
        dot.classList.remove("unlocked");
      }
    });

    if (calcState.hintsUnlocked >= 5) {
      revealHintBtn.disabled = true;
      revealHintBtn.style.opacity = "0.5";
      revealHintBtn.textContent = "All Hints Unlocked 💡";
    } else {
      revealHintBtn.disabled = false;
      revealHintBtn.style.opacity = "1";
      revealHintBtn.textContent = `Unlock Hint (${calcState.hintsUnlocked}/5) 💡`;
    }
  }

  showSolutionBtn.addEventListener("click", () => {
    playChalkSound("click");
    const mod = CALC_MODULES[calcState.activeStep - 1];
    solutionBox.hidden = false;
    
    let stepsHtml = mod.solutionSteps.map((stepText, idx) => {
      let text = stepText;
      if (window.katex) {
        const matches = text.match(/\$(.*?)\$/g);
        if (matches) {
          matches.forEach(m => {
            const math = m.replace(/\$/g, "");
            try {
              const tempSpan = document.createElement("span");
              katex.render(math, tempSpan, { throwOnError: false });
              text = text.replace(m, tempSpan.outerHTML);
            } catch (err) {}
          });
        }
      }
      return `<li>${text}</li>`;
    }).join("");

    solutionBox.innerHTML = `
      <h4>📖 Mathematical Step-by-Step Proof</h4>
      <ol>${stepsHtml}</ol>
      <p style="margin-top: 0.8rem; font-size: 0.78rem; opacity: 0.8; font-style: italic; color: #ff9ebb;">
        Verified Solution · Grade 12 to Higher Certificate Standard.
      </p>
    `;
    
    solutionBox.scrollIntoView({ behavior: "smooth", block: "nearest" });
  });

  modeArithmetic.addEventListener("click", () => {
    playChalkSound("click");
    modeArithmetic.classList.add("active");
    modeAlgebraic.classList.remove("active");
    arithmeticPad.hidden = false;
    algebraicPad.hidden = true;
  });

  modeAlgebraic.addEventListener("click", () => {
    playChalkSound("click");
    modeAlgebraic.classList.add("active");
    modeArithmetic.classList.remove("active");
    arithmeticPad.hidden = true;
    algebraicPad.hidden = false;
  });

  keys.forEach(key => {
    key.addEventListener("click", () => {
      playChalkSound("click");
      const val = key.textContent;
      if (val === "=" || val === "C") return;
      
      if (calcScreen.textContent === "0" || calcScreen.textContent === "Error" || calcScreen.textContent.startsWith("d/dx") || calcScreen.textContent.startsWith("f(")) {
        calcScreen.textContent = val;
      } else {
        calcScreen.textContent += val;
      }
    });
  });

  clearKey.addEventListener("click", () => {
    playChalkSound("click");
    calcScreen.textContent = "0";
  });

  equalKey.addEventListener("click", () => {
    playChalkSound("click");
    const expr = calcScreen.textContent;
    const cleanExpr = expr.replace(/[^0-9+\-*/.]/g, "");
    try {
      if (cleanExpr === "") {
        calcScreen.textContent = "0";
        return;
      }
      const res = eval(cleanExpr);
      calcScreen.textContent = Number.isInteger(res) ? res : res.toFixed(4);
    } catch (e) {
      calcScreen.textContent = "Error";
    }
  });

  diffBtn.addEventListener("click", () => {
    playChalkSound("write");
    const expr = polyInput.value;
    const res = differentiatePolynomial(expr);
    calcScreen.textContent = "d/dx = " + res;
  });

  evalBtn.addEventListener("click", () => {
    playChalkSound("write");
    const expr = polyInput.value;
    const xVal = parseFloat(evalXInput.value);
    if (isNaN(xVal)) {
      calcScreen.textContent = "Error: Input x";
      return;
    }
    const res = evaluatePolynomial(expr, xVal);
    calcScreen.textContent = `f(${xVal}) = ` + (Number.isInteger(res) ? res : res.toFixed(4));
  });

  function differentiatePolynomial(expr) {
    expr = expr.replace(/\s+/g, '').replace(/-/g, '+-');
    const terms = expr.split('+').filter(t => t.length > 0);
    let derTerms = [];
    
    terms.forEach(term => {
      const axnMatch = term.match(/^([+-]?\d*(?:\.\d+)?)?x\^([+-]?\d+)$/);
      const axMatch = term.match(/^([+-]?\d*(?:\.\d+)?)?x$/);
      
      if (axnMatch) {
        let coefStr = axnMatch[1];
        let coef = 1;
        if (coefStr === "+") coef = 1;
        else if (coefStr === "-") coef = -1;
        else if (coefStr !== undefined && coefStr !== "") coef = parseFloat(coefStr);
        
        let exp = parseInt(axnMatch[2]);
        let newCoef = coef * exp;
        let newExp = exp - 1;
        
        if (newExp === 0) {
          derTerms.push(`${newCoef}`);
        } else if (newExp === 1) {
          derTerms.push(`${newCoef}x`);
        } else {
          derTerms.push(`${newCoef}x^${newExp}`);
        }
      } else if (axMatch) {
        let coefStr = axMatch[1];
        let coef = 1;
        if (coefStr === "+") coef = 1;
        else if (coefStr === "-") coef = -1;
        else if (coefStr !== undefined && coefStr !== "") coef = parseFloat(coefStr);
        derTerms.push(`${coef}`);
      }
    });
    
    if (derTerms.length === 0) return "0";
    let result = derTerms.join('+').replace(/\+-/g, '-').replace(/^\+/, '');
    return result;
  }

  function evaluatePolynomial(expr, xVal) {
    expr = expr.replace(/\s+/g, '').replace(/-/g, '+-');
    const terms = expr.split('+').filter(t => t.length > 0);
    let sum = 0;
    
    terms.forEach(term => {
      const axnMatch = term.match(/^([+-]?\d*(?:\.\d+)?)?x\^([+-]?\d+)$/);
      const axMatch = term.match(/^([+-]?\d*(?:\.\d+)?)?x$/);
      const cMatch = term.match(/^([+-]?\d+(?:\.\d+)?)$/);
      
      if (axnMatch) {
        let coefStr = axnMatch[1];
        let coef = 1;
        if (coefStr === "+") coef = 1;
        else if (coefStr === "-") coef = -1;
        else if (coefStr !== undefined && coefStr !== "") coef = parseFloat(coefStr);
        
        let exp = parseInt(axnMatch[2]);
        sum += coef * Math.pow(xVal, exp);
      } else if (axMatch) {
        let coefStr = axMatch[1];
        let coef = 1;
        if (coefStr === "+") coef = 1;
        else if (coefStr === "-") coef = -1;
        else if (coefStr !== undefined && coefStr !== "") coef = parseFloat(coefStr);
        sum += coef * xVal;
      } else if (cMatch) {
        sum += parseFloat(cMatch[1]);
      }
    });
    
    return sum;
  }
}

initCalculusAcademy();
