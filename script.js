// ANACARD JavaScript - Interactive Card Game Logic

// Game State
let gameState = {
    currentDeck: null,
    currentCardIndex: 0,
    shuffledDeck: [],
    savedCards: [],
    favoriteCards: [],
    everyoneAnswersMode: false,
    hostMode: false,
    timerInterval: null,
    timerSeconds: 0,
    darkMode: false,
    currentCategory: 'all',
    difficulty: 'all',
    soundEnabled: true,
    gameMode: 'classic', // New: Game modes
    stats: {
        cardsDrawn: 0,
        cardsSaved: 0,
        cardsFavorited: 0,
        sessionsPlayed: 0,
        totalTimeSpent: 0
    },
    couplesMode: {
        isActive: false,
        player1Answers: [],
        player2Answers: [],
        currentQuestion: 0,
        currentPlayer: 1
    },
    miniGame: {
        isActive: false,
        type: null,
        data: {}
    },
    customDecks: [], // User-created decks
    currentTest: null // Personality/Connection tests
};

// Group Game State
let groupGameState = {
    isActive: false,
    currentGame: null,
    players: [],
    roles: {},
    currentPhase: 'setup',
    round: 1,
    timer: null,
    currentLocation: null
};

// Group Games Configuration
const groupGames = {
    'imposter': {
        name: "Find the Imposter",
        description: "One player is secretly the imposter. Find them before it's too late!",
        icon: "user-secret",
        players: "4-10",
        time: "15-20 min",
        difficulty: "Medium"
    },
    'mafia': {
        name: "Mafia",
        description: "Classic social deduction game. Mafia vs Civilians in a battle of wits!",
        icon: "user-ninja",
        players: "5-12",
        time: "20-30 min", 
        difficulty: "Hard"
    },
    'werewolf': {
        name: "Werewolf",
        description: "Villagers must find the werewolves before they eliminate everyone!",
        icon: "wolf",
        players: "6-15",
        time: "25-35 min",
        difficulty: "Hard"
    },
    'spyfall': {
        name: "Spyfall",
        description: "One player is the spy who doesn't know the location. Find the spy!",
        icon: "user-secret",
        players: "3-8",
        time: "10-15 min",
        difficulty: "Easy"
    },
    'two-rooms': {
        name: "Two Rooms and a Boom",
        description: "Teams try to communicate secret words without being in the same room!",
        icon: "door-open",
        players: "6-12",
        time: "15-25 min",
        difficulty: "Medium"
    }
};

// Game Modes Configuration
const gameModes = {
    classic: {
        name: "Classic Mode",
        description: "Draw cards one by one, simple and relaxed",
        icon: "play-circle",
        settings: {
            timerEnabled: false,
            fastPace: false,
            emotionalFilter: false,
            kidFriendly: false
        }
    },
    party: {
        name: "Party Mode",
        description: "Faster pace, more dares, more group actions",
        icon: "party-horn",
        settings: {
            timerEnabled: true,
            timerDuration: 30,
            fastPace: true,
            emotionalFilter: true,
            kidFriendly: false
        }
    },
    deep: {
        name: "Deep Mode",
        description: "Focus on emotional and thoughtful cards",
        icon: "brain",
        settings: {
            timerEnabled: false,
            fastPace: false,
            emotionalFilter: true,
            kidFriendly: false,
            onlyDeep: true
        }
    },
    couple: {
        name: "Couple Mode",
        description: "Intimate, slow-paced, designed for two",
        icon: "heart",
        settings: {
            timerEnabled: false,
            fastPace: false,
            emotionalFilter: false,
            kidFriendly: false,
            twoPlayers: true
        }
    },
    family: {
        name: "Family Mode",
        description: "Safe, fun, kid-friendly prompts",
        icon: "home",
        settings: {
            timerEnabled: false,
            fastPace: false,
            emotionalFilter: true,
            kidFriendly: true
        }
    }
};

// Personality & Connection Tests
const connectionTests = {
    'fall-in-love-25': {
        name: "Fall in Love in 25 Questions",
        description: "A shorter version of the famous intimacy test",
        icon: "heart",
        type: "compatibility",
        questions: [
            "What's your idea of a perfect day together?",
            "What's something you're proud of about yourself?",
            "What does friendship mean to you?",
            "What's your favorite way to show affection?",
            "What's a goal you're working towards right now?",
            "What's the best advice you've ever received?",
            "What makes you feel most alive?",
            "What's something you'd like to learn?",
            "What's your favorite memory with family?",
            "What's your biggest fear?",
            "What makes you laugh the most?",
            "What's your dream travel destination?",
            "What's your favorite way to relax?",
            "What's something you're grateful for today?",
            "What's your favorite season and why?",
            "What's your hidden talent?",
            "What's your favorite book/movie and why?",
            "What's your perfect weekend like?",
            "What's your love language?",
            "What's your biggest dream?",
            "What's your favorite food memory?",
            "What's your proudest achievement?",
            "What's your favorite way to help others?",
            "What's your ideal future like?",
            "What's your favorite thing about yourself?"
        ]
    },
    'friendship-compatibility': {
        name: "Friendship Compatibility Test",
        description: "Discover how well you match as friends",
        icon: "users",
        type: "friendship",
        questions: [
            "How do you prefer to spend time with friends?",
            "What's your communication style in friendships?",
            "How important is personal space to you?",
            "What's your conflict resolution style?",
            "How do you show support to friends?",
            "What's your ideal friend group size?",
            "How often do you like to hang out with friends?",
            "What's your favorite group activity?",
            "How do you handle friend disagreements?",
            "What's your loyalty level in friendships?",
            "How do you make new friends?",
            "What's your favorite thing about your best friend?",
            "How do you maintain long-distance friendships?",
            "What's your friendship boundary style?",
            "How do you celebrate friends' successes?",
            "What's your comfort level with emotional sharing?",
            "How do you handle friend cancellations?",
            "What's your favorite friend tradition?",
            "How do you support friends through tough times?",
            "What's your friendship pet peeve?"
        ]
    },
    'family-bonding': {
        name: "Family Bonding Quiz",
        description: "Strengthen family connections",
        icon: "home",
        type: "family",
        questions: [
            "What's your favorite family tradition?",
            "How do you show love to family members?",
            "What's your favorite family memory?",
            "How do you handle family disagreements?",
            "What's your role in the family?",
            "What's your favorite family meal?",
            "How do you celebrate family achievements?",
            "What's your family communication style?",
            "How do you support family members?",
            "What's your favorite family vacation?",
            "How do you maintain family connections?",
            "What's your family's unique quality?",
            "How do you handle family stress?",
            "What's your favorite family story?",
            "How do you show appreciation to family?",
            "What's your family's strength?",
            "How do you resolve family conflicts?",
            "What's your favorite family activity?",
            "How do you express gratitude to family?",
            "What makes your family special?"
        ]
    },
    'know-me-challenge': {
        name: "How Well Do You Know Me?",
        description: "Test how well friends know each other",
        icon: "question-circle",
        type: "knowledge",
        questions: [
            "What's my biggest fear?",
            "What's my dream job?",
            "What's my favorite childhood memory?",
            "What's my biggest pet peeve?",
            "What's my hidden talent?",
            "What's my favorite food?",
            "What's my biggest goal?",
            "What's my favorite movie?",
            "What's my most embarrassing moment?",
            "What's my favorite season?",
            "What's my biggest achievement?",
            "What's my favorite hobby?",
            "What's my favorite song?",
            "What's my biggest weakness?",
            "What's my favorite book?",
            "What's my dream travel destination?",
            "What's my favorite color?",
            "What's my biggest strength?",
            "What's my favorite animal?",
            "What's my perfect day?"
        ]
    }
};

// Mini Games
const miniGames = {
    'story-builder': {
        name: "Story Builder",
        description: "Each player adds one sentence to create a story",
        icon: "book",
        minPlayers: 2
    },
    'guess-player': {
        name: "Guess the Player",
        description: "A trait is revealed, guess who it fits",
        icon: "user-question",
        minPlayers: 3
    },
    'memory-match': {
        name: "Memory Match",
        description: "Recall details shared earlier in the game",
        icon: "brain",
        minPlayers: 2
    },
    'photo-challenge': {
        name: "Photo Challenge",
        description: "Take photos based on prompts",
        icon: "camera",
        minPlayers: 1
    }
};
const cardDecks = {
    conversation: {
        name: "Conversation Starters",
        icon: "comments",
        cards: [
            "What's the most interesting thing you've learned recently?",
            "If you could have dinner with any three people, who would they be?",
            "What's a skill you've always wanted to learn?",
            "What's the best piece of advice you've ever received?",
            "What's your favorite memory from childhood?",
            "If you could live anywhere in the world, where would it be?",
            "What's something that always makes you laugh?",
            "What's the most adventurous thing you've ever done?",
            "What's a book/movie that changed your perspective?",
            "What's your perfect weekend like?",
            "What's something you're proud of accomplishing?",
            "What's the best gift you've ever received?",
            "What's a tradition you'd like to start?",
            "What's something that surprised you about yourself?",
            "What's your favorite way to relax?",
            "What's a challenge you overcame that made you stronger?",
            "What's the most beautiful place you've ever visited?",
            "What's something you're looking forward to?",
            "What's a small thing that brings you joy?",
            "What's your favorite season and why?",
            "What's something you'd like to be remembered for?",
            "What's the best decision you've ever made?",
            "What's a skill that comes naturally to you?",
            "What's something that always motivates you?",
            "What's your favorite way to spend time with friends?",
            "What's a goal you're currently working towards?",
            "What's something that never fails to make you smile?",
            "What's the most valuable lesson you've learned?",
            "What's your favorite thing about yourself?",
            "What's a place that feels like home to you?",
            "What's something you'd do if you knew you couldn't fail?",
            "What's your favorite way to express creativity?",
            "What's a quality you admire in others?",
            "What's something you're grateful for right now?",
            "What's your favorite way to help others?",
            "What's a risk you're glad you took?",
            "What's something that always inspires you?",
            "What's your favorite way to celebrate?",
            "What's a habit you're proud of?",
            "What's something you'd tell your younger self?",
            "What's your favorite way to learn new things?",
            "What's a place you'd love to visit?",
            "What's something that makes you feel alive?",
            "What's your favorite way to connect with nature?",
            "What's a tradition from your family you love?",
            "What's something you're curious about?",
            "What's your favorite way to practice self-care?",
            "What's a dream you're working towards?",
            "What's something that always makes you feel better?"
        ]
    },
    dares: {
        name: "Fun Dares",
        icon: "fire",
        cards: [
            "Do your best dance move for 30 seconds",
            "Sing a song in a funny voice",
            "Tell a joke that makes everyone groan",
            "Do 10 jumping jacks",
            "Speak in an accent for the next 2 minutes",
            "Act out your favorite movie scene",
            "Do your best animal impression",
            "Tell a story using only hand gestures",
            "Walk like a robot for 1 minute",
            "Make up a rap about the person to your left",
            "Do a dramatic reading of a text message",
            "Balance something on your head for 30 seconds",
            "Talk backwards for 30 seconds",
            "Do your best superhero pose",
            "Make a face and hold it for 20 seconds",
            "Pretend you're a tour guide showing us around",
            "Do your best commercial voice",
            "Act like you're walking on hot lava",
            "Tell a story with your eyes closed",
            "Do your best weather forecast",
            "Pretend you're a statue for 45 seconds",
            "Make up a handshake with someone",
            "Do your best sports commentator voice",
            "Act like you're underwater for 30 seconds",
            "Do your best magic trick",
            "Pretend you're interviewing someone famous",
            "Do your best robot dance",
            "Act like you're in a slow-motion movie",
            "Make up a cheer about the group",
            "Do your best game show host voice",
            "Pretend you're a news reporter",
            "Do your best animal walk",
            "Act like you're in a musical",
            "Do your best impression of a baby",
            "Pretend you're walking through a spider web",
            "Do your best action movie hero voice",
            "Act like you're tasting something amazing",
            "Do your best cartoon character voice",
            "Pretend you're stuck in slow motion",
            "Do your best dramatic sigh",
            "Act like you're discovering treasure"
        ]
    },
    'would-you-rather': {
        name: "Would You Rather",
        icon: "balance-scale",
        cards: [
            "Would you rather be able to fly or be invisible?",
            "Would you rather live in the city or the countryside?",
            "Would you rather have a personal chef or a personal driver?",
            "Would you rather be able to talk to animals or speak every language?",
            "Would you rather never have to sleep or never have to eat?",
            "Would you rather be famous for something good or infamous for something bad?",
            "Would you rather have a rewind button or a pause button for life?",
            "Would you rather be too hot or too cold?",
            "Would you rather have a personal theme song or background music?",
            "Would you rather be able to teleport or read minds?",
            "Would you rather have a perfect memory or forget everything?",
            "Would you rather be able to change the past or see the future?",
            "Would you rather have a million dollars or true love?",
            "Would you rather be stranded on an island or lost in a forest?",
            "Would you rather have a talking pet or a flying car?",
            "Would you rather be able to breathe underwater or walk on water?",
            "Would you rather have a personal assistant or a personal trainer?",
            "Would you rather be able to control time or control elements?",
            "Would you rather have a lifetime supply of your favorite food or drink?",
            "Would you rather be able to change your appearance at will or teleport?",
            "Would you rather have a perfect sense of direction or perfect timing?",
            "Would you rather be able to talk to plants or understand babies?",
            "Would you rather have a personal library or personal movie theater?",
            "Would you rather be able to duplicate yourself or shrink yourself?",
            "Would you rather have a perfect singing voice or perfect dancing skills?",
            "Would you rather be able to control dreams or never have nightmares?",
            "Would you rather have a personal chef or personal stylist?",
            "Would you rather be able to understand any language or play any instrument?",
            "Would you rather have a perfect memory or perfect creativity?",
            "Would you rather be able to control weather or control animals?",
            "Would you rather have a personal jetpack or personal submarine?",
            "Would you rather be able to heal instantly or never get sick?",
            "Would you rather have a personal bodyguard or personal assistant?",
            "Would you rather be able to change one thing about the world or yourself?",
            "Would you rather have a perfect sense of humor or perfect sense of style?",
            "Would you rather be able to control technology or control nature?",
            "Would you rather have a personal robot or personal AI?",
            "Would you rather be able to understand any subject instantly or master any skill?",
            "Would you rather have a perfect sense of direction or perfect sense of time?",
            "Would you rather be able to communicate with ghosts or see the future?",
            "Would you rather have a personal garden or personal aquarium?",
            "Would you rather be able to change colors like a chameleon or regenerate like a starfish?",
            "Would you rather have a perfect sense of smell or perfect sense of taste?",
            "Would you rather be able to control electricity or control water?",
            "Would you rather have a personal library or personal art gallery?",
            "Would you rather be able to understand animals or understand babies?"
        ]
    },
    'deep-questions': {
        name: "Deep Questions",
        icon: "brain",
        cards: [
            "What does happiness mean to you?",
            "What's something you've never told anyone?",
            "What do you think happens after we die?",
            "What's your biggest fear and how do you face it?",
            "What does success look like to you?",
            "What's a moment that changed your life forever?",
            "What do you value most in relationships?",
            "What's something you're still figuring out about yourself?",
            "What does love mean to you?",
            "What's a mistake that taught you an important lesson?",
            "What do you want your legacy to be?",
            "What's something you've forgiven yourself for?",
            "What does friendship mean to you?",
            "What's a belief you've changed over time?",
            "What does courage mean to you?",
            "What's something you're proud of overcoming?",
            "What does trust mean to you?",
            "What's a moment you felt truly alive?",
            "What does wisdom mean to you?",
            "What's something you've learned from failure?",
            "What does gratitude mean to you?",
            "What's a moment you felt completely at peace?",
            "What does family mean to you?",
            "What's something you've learned about love?",
            "What does purpose mean to you?",
            "What's a moment you felt truly understood?",
            "What does growth mean to you?",
            "What's something you've learned about yourself?",
            "What does connection mean to you?",
            "What's a moment you felt completely yourself?",
            "What does healing mean to you?",
            "What's something you've learned about others?",
            "What does home mean to you?",
            "What's a moment you felt truly happy?",
            "What does change mean to you?",
            "What's something you've learned about life?",
            "What does beauty mean to you?",
            "What's a moment you felt truly grateful?",
            "What does strength mean to you?",
            "What's something you've learned about relationships?"
        ]
    },
    'party-games': {
        name: "Party Games",
        icon: "glass-cheers",
        cards: [
            "Two Truths and a Lie: Share three 'facts' about yourself, one is false",
            "Charades: Act out a movie title without speaking",
            "20 Questions: Think of something, others have 20 yes/no questions to guess",
            "Never Have I Ever: Share something you've never done",
            "Telephone: Whisper a phrase around the circle, see how it changes",
            "Story Chain: Each person adds one sentence to create a story",
            "Word Association: Take turns saying the first word that comes to mind",
            "Impressions: Everyone does their best impression of someone famous",
            "Category Game: Name things in a category until someone can't think of one",
            "Memory Game: List items in order, each person adds one more",
            "Reverse Charades: Group acts out, one person guesses",
            "Pictionary: Draw something for others to guess",
            "Guess the Song: Hum or tap a song for others to guess",
            "Alphabet Game: Go through alphabet with words in a category",
            "Counting Game: Count to 20, but if two people say same number, start over",
            "Mirror Game: One person leads, others mirror their movements exactly",
            "Freeze Dance: Dance until music stops, then freeze in position",
            "Human Knot: Everyone holds hands in a circle, untangle without letting go",
            "Pass the Drawing: Each person adds to a drawing without seeing previous parts",
            "Guess the Emotion: Act out an emotion for others to guess",
            "One Word Story: Each person adds one word to create a story",
            "Sound Effects: Make sound effects for a silent movie scene",
            "Group Sculpture: One person poses others to create a living sculpture",
            "Follow the Leader: Copy the leader's actions exactly",
            "Blind Drawing: Draw something blindfolded, others guess what it is",
            "Human Rock Paper Scissors: Play in teams with full body movements",
            "Pass the Message: Pass a complex message around the circle",
            "Group Countdown: Try to count to 10 with only one person speaking at a time",
            "Mirror Mirror: Pair up, mirror each other's movements",
            "Group Mime: Act out a scene together without speaking",
            "Human Machine: Each person becomes a part of a working machine",
            "Pass the Emotion: Pass an expression around the circle",
            "Group Story: Create a story where each person adds one sentence",
            "Sound Circle: Each person makes a sound, group tries to recreate the sequence"
        ]
    },
    'travel-adventure': {
        name: "Travel & Adventure",
        icon: "plane",
        cards: [
            "If you could teleport anywhere right now, where would you go?",
            "What's the most adventurous thing you've ever done while traveling?",
            "Describe your perfect travel companion",
            "What's a travel experience that changed your perspective?",
            "If you could live in any country for a year, where would it be?",
            "What's the most beautiful place you've ever seen?",
            "What's your favorite travel memory?",
            "If you could have any travel superpower, what would it be?",
            "What's a place you'd never visit again and why?",
            "Describe your dream vacation in detail",
            "What's the weirdest food you've tried while traveling?",
            "If you could travel through time, where would you go?",
            "What's the most important lesson you've learned from traveling?",
            "Describe a moment when you felt truly lost while traveling",
            "What's your favorite mode of transportation and why?",
            "If you could create a new country, what would it be like?",
            "What's the most hospitable place you've ever visited?",
            "Describe your travel style in three words",
            "What's a place that exceeded your expectations?",
            "If you could speak any language fluently, which would you choose?",
            "What's the most challenging travel experience you've had?",
            "Describe your perfect travel day",
            "What's a travel tradition you have?",
            "If you could travel with any three people, who would they be?",
            "What's the most breathtaking view you've ever witnessed?",
            "Describe a time when travel made you feel brave",
            "What's your favorite travel souvenir?",
            "If you could relive any trip, which would it be?",
            "What's a place that felt like coming home?",
            "Describe your most unexpected travel discovery",
            "What's the longest journey you've ever taken?",
            "If you could create a travel app, what would it do?",
            "What's a place that made you feel small in a good way?",
            "Describe your favorite travel photograph memory",
            "What's the most interesting person you've met while traveling?",
            "If you could have any travel job, what would it be?",
            "What's a travel mistake you've learned from?",
            "Describe your perfect travel playlist",
            "What's the most peaceful place you've ever visited?",
            "If you could travel to any planet, where would you go?",
            "What's a travel experience that made you laugh uncontrollably?",
            "Describe your travel philosophy in one sentence"
        ]
    },
    'creativity-imagination': {
        name: "Creativity & Imagination",
        icon: "palette",
        cards: [
            "If you could invent anything, what would it be?",
            "Describe a color that doesn't exist",
            "If you could talk to your younger self, what would you say?",
            "Create a new holiday and describe how people celebrate it",
            "If you could design a new animal, what would it look like?",
            "Describe a world where gravity works differently",
            "If you could write a book about your life, what would the title be?",
            "Create a new flavor and describe it",
            "If you could paint your emotions, what would they look like?",
            "Describe a machine that solves an everyday problem",
            "If you could compose a song, what would it be about?",
            "Create a new type of weather and describe it",
            "If you could design a dream house, what would it include?",
            "Describe a world where everyone has a superpower",
            "If you could create a new sport, what would the rules be?",
            "Describe your imagination as a physical place",
            "If you could invent a new sense, what would it be?",
            "Create a new language and describe its purpose",
            "If you could design a new planet, what would it be like?",
            "Describe a day in the life of your future self",
            "If you could create a new art form, what would it be?",
            "Describe a world where music has colors",
            "If you could write a letter to anyone, dead or alive, who would it be?",
            "Create a new type of transportation and describe it",
            "If you could design a perfect city, what would it include?",
            "Describe a world where dreams can be shared",
            "If you could create a new type of food, what would it taste like?",
            "Describe your creative process as a journey",
            "If you could invent a new game, how would it work?",
            "Create a new type of plant and describe its properties",
            "If you could design a new type of clothing, what would it do?",
            "Describe a world where time moves differently",
            "If you could create a new type of music, how would it sound?",
            "Describe your ideal workspace for creativity",
            "If you could invent a new type of communication, how would it work?",
            "Create a new type of building and describe its purpose",
            "If you could design a new type of education system, what would it be?",
            "Describe a world where emotions have physical forms",
            "If you could create a new type of entertainment, what would it be?",
            "Describe your imagination as a garden"
        ]
    },
    'mindfulness-wellness': {
        name: "Mindfulness & Wellness",
        icon: "spa",
        cards: [
            "What does self-care look like for you?",
            "Describe your perfect moment of peace",
            "What's a small thing that always grounds you?",
            "If you could bottle a feeling, which would you choose?",
            "What does your inner voice sound like when you're happy?",
            "Describe a place where you feel completely yourself",
            "What's a ritual that brings you comfort?",
            "If you could design a meditation space, what would it include?",
            "What does your breath feel like when you're calm?",
            "Describe your favorite way to connect with nature",
            "What's a thought that always makes you smile?",
            "If you could create a wellness routine, what would it include?",
            "Describe the feeling of sunshine on your skin",
            "What's a sound that instantly relaxes you?",
            "If you could design a perfect day for your mental health, what would it be?",
            "Describe the taste of your favorite comfort food",
            "What's a movement that makes you feel alive?",
            "If you could create a self-care package, what would you include?",
            "Describe the feeling of clean sheets",
            "What's a scent that brings you peace?",
            "If you could design a relaxation app, what features would it have?",
            "Describe your ideal morning routine",
            "What's a texture that comforts you?",
            "If you could create a wellness journal, what prompts would it include?",
            "Describe the feeling of a warm hug",
            "What's a color that makes you feel calm?",
            "If you could design a perfect evening routine, what would it include?",
            "Describe the feeling of accomplishment",
            "What's a taste that reminds you of home?",
            "If you could create a mindfulness exercise, what would it be?",
            "Describe the feeling of gratitude",
            "What's a movement that expresses joy?",
            "If you could design a perfect self-care day, what would it include?",
            "Describe the feeling of being fully present",
            "What's a sound that makes you feel safe?",
            "If you could create a wellness challenge, what would it be?",
            "Describe the feeling of letting go",
            "What's a sensation that reminds you you're alive?",
            "If you could design a perfect space for reflection, what would it include?",
            "Describe the feeling of hope",
            "What's a simple pleasure that never gets old?",
            "If you could create a mantra for yourself, what would it be?",
            "Describe the feeling of being truly rested",
            "What's a moment that made you feel proud of yourself?",
            "If you could design a perfect balance between work and life, what would it look like?",
            "Describe the feeling of being understood",
            "What's a small victory you're celebrating today?",
            "If you could create a wellness community, what would it focus on?",
            "Describe the feeling of being exactly where you need to be"
        ]
    },
    'fall-in-love': {
        name: "Fall in Love ❤️",
        icon: "heart",
        type: "compatibility",
        questions: [
            {
                id: 1,
                question: "What's your idea of a perfect date?",
                options: [
                    { text: "Cozy dinner at home", value: "homebody", points: { homebody: 3, adventurer: 1, social: 2 } },
                    { text: "Adventure outdoors", value: "adventurer", points: { homebody: 1, adventurer: 3, social: 2 } },
                    { text: "Social event with friends", value: "social", points: { homebody: 2, adventurer: 1, social: 3 } }
                ]
            },
            {
                id: 2,
                question: "How do you show love?",
                options: [
                    { text: "Words of affirmation", value: "words", points: { words: 3, actions: 1, gifts: 2, time: 2 } },
                    { text: "Acts of service", value: "actions", points: { words: 1, actions: 3, gifts: 2, time: 2 } },
                    { text: "Thoughtful gifts", value: "gifts", points: { words: 2, actions: 2, gifts: 3, time: 1 } },
                    { text: "Quality time", value: "time", points: { words: 2, actions: 2, gifts: 1, time: 3 } }
                ]
            },
            {
                id: 3,
                question: "What's your relationship with change?",
                options: [
                    { text: "I embrace it", value: "embrace", points: { embrace: 3, cautious: 1, resistant: 0 } },
                    { text: "I'm cautious but open", value: "cautious", points: { embrace: 2, cautious: 3, resistant: 1 } },
                    { text: "I prefer stability", value: "resistant", points: { embrace: 1, cautious: 2, resistant: 3 } }
                ]
            },
            {
                id: 4,
                question: "How do you handle conflicts?",
                options: [
                    { text: "Talk it through immediately", value: "immediate", points: { immediate: 3, process: 2, avoid: 0 } },
                    { text: "Take time to process first", value: "process", points: { immediate: 2, process: 3, avoid: 1 } },
                    { text: "Need space to cool down", value: "avoid", points: { immediate: 0, process: 1, avoid: 3 } }
                ]
            },
            {
                id: 5,
                question: "What's your ideal weekend?",
                options: [
                    { text: "Spontaneous adventures", value: "spontaneous", points: { spontaneous: 3, planned: 1, relaxed: 2 } },
                    { text: "Well-planned activities", value: "planned", points: { spontaneous: 1, planned: 3, relaxed: 2 } },
                    { text: "Relaxing and unstructured", value: "relaxed", points: { spontaneous: 2, planned: 1, relaxed: 3 } }
                ]
            },
            {
                id: 6,
                question: "How important is personal space?",
                options: [
                    { text: "I need lots of alone time", value: "alone", points: { alone: 3, balanced: 2, together: 0 } },
                    { text: "Balance of both", value: "balanced", points: { alone: 2, balanced: 3, together: 2 } },
                    { text: "Prefer being together", value: "together", points: { alone: 0, balanced: 2, together: 3 } }
                ]
            },
            {
                id: 7,
                question: "What's your approach to finances?",
                options: [
                    { text: "Careful planner and saver", value: "saver", points: { saver: 3, spender: 0, balanced: 2 } },
                    { text: "Enjoy spending on experiences", value: "spender", points: { saver: 0, spender: 3, balanced: 1 } },
                    { text: "Balanced approach", value: "balanced", points: { saver: 2, spender: 1, balanced: 3 } }
                ]
            },
            {
                id: 8,
                question: "How do you feel about social media?",
                options: [
                    { text: "Love sharing our life", value: "share", points: { share: 3, private: 0, selective: 2 } },
                    { text: "Keep relationship private", value: "private", points: { share: 0, private: 3, selective: 1 } },
                    { text: "Selective sharing", value: "selective", points: { share: 2, private: 1, selective: 3 } }
                ]
            },
            {
                id: 9,
                question: "What's your communication style?",
                options: [
                    { text: "Very expressive and open", value: "expressive", points: { expressive: 3, reserved: 0, thoughtful: 2 } },
                    { text: "More reserved and thoughtful", value: "reserved", points: { expressive: 0, reserved: 3, thoughtful: 2 } },
                    { text: "Balanced depending on situation", value: "thoughtful", points: { expressive: 2, reserved: 2, thoughtful: 3 } }
                ]
            },
            {
                id: 10,
                question: "How do you view the future?",
                options: [
                    { text: "Excited and optimistic", value: "optimistic", points: { optimistic: 3, realistic: 2, cautious: 1 } },
                    { text: "Realistic and prepared", value: "realistic", points: { optimistic: 2, realistic: 3, cautious: 2 } },
                    { text: "Cautiously hopeful", value: "cautious", points: { optimistic: 1, realistic: 2, cautious: 3 } }
                ]
            }
        ]
    },
    '36-questions-love': {
        name: "36 Questions to Love 💝",
        icon: "heart",
        type: "aron-questions",
        cards: [
            "Given the choice of anyone in the world, whom would you want as a dinner guest?",
            "Would you like to be famous? In what way?",
            "Before making a telephone call, do you ever rehearse what you're going to say? Why?",
            "What would constitute a 'perfect' day for you?",
            "When did you last sing to yourself? To someone else?",
            "If you were able to live to the age of 90 and retain either the mind or body of a 30-year-old for the last 60 years of your life, which would you want?",
            "Do you have a secret hunch about how you will die?",
            "Name three things you and your partner appear to have in common.",
            "For what in your life do you feel most grateful?",
            "If you could change anything about the way you were raised, what would it be?",
            "Take four minutes and tell your partner your life story in as much detail as possible.",
            "If you could wake up tomorrow having gained any one quality or ability, what would it be?",
            "If a crystal ball could tell you the truth about yourself, your life, the future or anything else, what would you want to know?",
            "Is there something that you've dreamed of doing for a long time? Why haven't you done it?",
            "What is the greatest accomplishment of your life?",
            "What do you value most in a friendship?",
            "What is your most treasured memory?",
            "What is your most terrible memory?",
            "If you knew that in one year you would die suddenly, would you change anything about the way you are now living? Why?",
            "What does friendship mean to you?",
            "What roles do love and affection play in your life?",
            "Alternate sharing something you consider a positive characteristic of your partner. Share a total of five items.",
            "How close and warm is your family? Do you feel your childhood was happier than most other people's?",
            "How do you feel about your relationship with your mother?",
            "Make three true 'we' statements each. For instance, 'We are both in this room feeling...'",
            "Complete this sentence: 'I wish I had someone with whom I could share...'",
            "If you were going to become a close friend with your partner, please share what would be important for them to know.",
            "Tell your partner what you like about them; be very honest this time, saying things that you might not say to someone you've just met.",
            "Share with your partner an embarrassing moment in your life.",
            "When did you last cry in front of another person? By yourself?",
            "Tell your partner something that you like about them already.",
            "What, if anything, is too serious to be joked about?",
            "If you were to die this evening with no opportunity to communicate with anyone, what would you most regret not having told someone? Why haven't you told them yet?",
            "Your house, containing everything you own, catches fire. After saving your loved ones and pets, you have time to safely make a final dash to save any one item. What would it be? Why?",
            "Of all the people in your family, whose death would you find most disturbing? Why?",
            "Share a personal problem and ask your partner's advice on how he or she might handle it. Also, ask your partner to reflect back to you how you seem to be feeling about the problem you have chosen."
        ]
    }
};

// Page Navigation
function showPage(pageId) {
    document.querySelectorAll('.page').forEach(page => {
        page.classList.remove('active');
    });
    setTimeout(() => {
        document.getElementById(pageId).classList.add('active');
    }, 100);
}

function showLandingPage() {
    showPage('landingPage');
}

function showDeckSelection() {
    showPage('deckSelectionPage');
}

function showGamePlay() {
    showPage('gamePlayPage');
}

// Game Mode Functions
function setGameMode(mode) {
    gameState.gameMode = mode;
    
    // Apply theme to body
    document.body.setAttribute('data-theme', mode);
    
    // Update UI to show selected mode
    document.querySelectorAll('.mode-card').forEach(card => {
        card.classList.remove('selected');
    });
    event.currentTarget.classList.add('selected');
    
    // Apply mode settings
    const modeSettings = gameModes[mode].settings;
    
    // Filter cards based on mode
    if (modeSettings.kidFriendly) {
        filterKidFriendlyCards();
    }
    if (modeSettings.onlyDeep) {
        filterDeepCards();
    }
    if (modeSettings.fastPace) {
        enableFastPace();
    }
    if (modeSettings.timerEnabled) {
        enableTimer(modeSettings.timerDuration);
    }
    
    playSound('favorite');
    showNotification(`Game mode set to: ${gameModes[mode].name}`);
    
    // Save theme preference
    saveGameState();
}

// Connection Test Functions
function startConnectionTest(testId) {
    const test = connectionTests[testId];
    gameState.currentTest = testId;
    
    // Create test questions deck
    const testDeck = {
        name: test.name,
        icon: test.icon,
        cards: [...test.questions]
    };
    
    gameState.currentDeck = 'test';
    gameState.shuffledDeck = [...testDeck.cards];
    shuffleArray(gameState.shuffledDeck);
    gameState.currentCardIndex = 0;
    
    document.getElementById('currentDeckName').textContent = testDeck.name;
    updateCardCounter();
    showGamePlay();
    
    // Show test instructions
    showTestInstructions(test);
    playSound('favorite');
}

function showTestInstructions(test) {
    const instructions = `
        <div style="text-align: center; padding: 20px; background: rgba(78, 205, 196, 0.1); border-radius: 12px; margin-bottom: 20px;">
            <h4 style="color: var(--secondary-color); margin-bottom: 15px;">${test.name}</h4>
            <p style="margin-bottom: 15px;">${test.description}</p>
            <p style="margin-bottom: 10px;"><strong>Instructions:</strong></p>
            <ol style="text-align: left; max-width: 400px; margin: 0 auto;">
                <li>Take turns asking and answering each question</li>
                <li>Be honest and open with your responses</li>
                <li>Listen actively to your partner's answers</li>
                <li>Progress through all questions in order</li>
                <li>Enjoy discovering more about each other!</li>
            </ol>
            <p style="margin-top: 15px; font-style: italic; color: #666;">Click "Draw Card" to begin your test!</p>
        </div>
    `;
    
    document.getElementById('cardText').innerHTML = instructions;
}

// Mini Game Functions
function startMiniGame(gameType) {
    const game = miniGames[gameType];
    gameState.miniGame.isActive = true;
    gameState.miniGame.type = gameType;
    gameState.miniGame.data = {};
    
    // Initialize mini game based on type
    switch(gameType) {
        case 'story-builder':
            initStoryBuilder();
            break;
        case 'guess-player':
            initGuessPlayer();
            break;
        case 'memory-match':
            initMemoryMatch();
            break;
        case 'photo-challenge':
            initPhotoChallenge();
            break;
    }
    
    // Show game play page first, then display mini game
    showGamePlay();
    document.getElementById('currentDeckName').textContent = game.name;
    document.getElementById('cardCounter').textContent = 'Mini Game';
    
    // Show mini game interface
    setTimeout(() => {
        showMiniGameInterface(game);
    }, 100);
    
    playSound('favorite');
}

function initStoryBuilder() {
    gameState.miniGame.data.story = [];
    gameState.miniGame.data.currentPlayer = 1;
    gameState.miniGame.data.players = [];
}

function initGuessPlayer() {
    gameState.miniGame.data.currentRound = 1;
    gameState.miniGame.data.scores = {};
}

function initMemoryMatch() {
    gameState.miniGame.data.sharedDetails = [];
    gameState.miniGame.data.currentRound = 1;
}

function initPhotoChallenge() {
    gameState.miniGame.data.currentChallenge = 0;
    gameState.miniGame.data.photos = [];
}

function showMiniGameInterface(game) {
    console.log('Showing mini game interface for:', game.name);
    
    const interface = `
        <div class="mini-game-interface">
            <h3>${game.name}</h3>
            <p>${game.description}</p>
            <div class="mini-game-content" id="miniGameContent">
                <!-- Game content will be inserted here -->
            </div>
            <div class="mini-game-controls">
                <button onclick="exitMiniGame()" class="control-button secondary">
                    <i class="fas fa-times"></i> Exit Game
                </button>
            </div>
        </div>
    `;
    
    const cardTextElement = document.getElementById('cardText');
    if (cardTextElement) {
        cardTextElement.innerHTML = interface;
        console.log('Mini game interface loaded');
    } else {
        console.error('cardText element not found');
    }
    
    // Initialize specific game content
    switch(gameState.miniGame.type) {
        case 'story-builder':
            showStoryBuilderContent();
            break;
        case 'guess-player':
            showGuessPlayerContent();
            break;
        case 'memory-match':
            showMemoryMatchContent();
            break;
        case 'photo-challenge':
            showPhotoChallengeContent();
            break;
    }
}

function showGuessPlayerContent() {
    console.log('Loading Guess Player content');
    
    const traits = [
        "loves spicy food", "has traveled abroad", "plays a musical instrument",
        "speaks multiple languages", "is afraid of spiders", "has never seen snow",
        "can cook gourmet meals", "collects something unusual", "has a hidden talent",
        "prefers tea over coffee", "is a morning person", "has broken a bone",
        "can't swim", "has met a celebrity", "is allergic to something common"
    ];
    
    const currentTrait = traits[Math.floor(Math.random() * traits.length)];
    gameState.miniGame.data.currentTrait = currentTrait;
    
    const content = `
        <div class="guess-player-game">
            <div class="trait-display">
                <h4>Who fits this trait?</h4>
                <div class="trait-card">
                    <p>"${currentTrait}"</p>
                </div>
            </div>
            <div class="player-input">
                <p>Make your guess!</p>
                <div class="guess-options">
                    <button onclick="makeGuess('player1')" class="guess-btn">Player 1</button>
                    <button onclick="makeGuess('player2')" class="guess-btn">Player 2</button>
                    <button onclick="makeGuess('player3')" class="guess-btn">Player 3</button>
                    <button onclick="makeGuess('player4')" class="guess-btn">Player 4</button>
                </div>
            </div>
            <div class="game-info">
                <p>Round ${gameState.miniGame.data.currentRound} • Score: <span id="guessScore">0</span></p>
            </div>
        </div>
    `;
    
    const miniGameContent = document.getElementById('miniGameContent');
    if (miniGameContent) {
        miniGameContent.innerHTML = content;
        console.log('Guess Player content loaded');
    } else {
        console.error('miniGameContent element not found');
    }
}

function makeGuess(player) {
    const correctPlayer = Math.floor(Math.random() * 4) + 1;
    const guessedPlayer = parseInt(player.replace('player', ''));
    
    if (guessedPlayer === correctPlayer) {
        gameState.miniGame.data.scores = gameState.miniGame.data.scores || 0;
        gameState.miniGame.data.scores++;
        showNotification(`Correct! It was Player ${correctPlayer}! +1 point`);
    } else {
        showNotification(`Wrong! It was actually Player ${correctPlayer}`);
    }
    
    document.getElementById('guessScore').textContent = gameState.miniGame.data.scores || 0;
    
    // Next round
    gameState.miniGame.data.currentRound++;
    setTimeout(() => showGuessPlayerContent(), 2000);
    playSound('draw');
}

function showMemoryMatchContent() {
    if (gameState.miniGame.data.currentRound === 1) {
        // First, collect some "shared details" from players
        gameState.miniGame.data.sharedDetails = [
            "Player 1's favorite color is blue",
            "Player 2 has a dog named Max",
            "Player 3 loves pizza with pineapple",
            "Player 4 has been to Japan",
            "Player 1 plays guitar",
            "Player 2 is allergic to cats",
            "Player 3 speaks 3 languages",
            "Player 4 collects vintage stamps"
        ];
    }
    
    const detail = gameState.miniGame.data.sharedDetails[Math.floor(Math.random() * gameState.miniGame.data.sharedDetails.length)];
    
    const content = `
        <div class="memory-match-game">
            <div class="memory-display">
                <h4>Remember this detail:</h4>
                <div class="memory-card">
                    <p>${detail}</p>
                </div>
            </div>
            <div class="memory-test">
                <p>Now, who does this belong to?</p>
                <input type="text" id="memoryAnswer" placeholder="Enter player number..." />
                <button onclick="checkMemoryAnswer('${detail}')" class="control-button primary">
                    <i class="fas fa-check"></i> Submit Answer
                </button>
            </div>
            <div class="game-info">
                <p>Round ${gameState.miniGame.data.currentRound} • Score: <span id="memoryScore">0</span></p>
            </div>
        </div>
    `;
    
    document.getElementById('miniGameContent').innerHTML = content;
}

function checkMemoryAnswer(correctDetail) {
    const answer = document.getElementById('memoryAnswer').value.trim();
    const playerNum = correctDetail.match(/Player (\d+)/);
    const correctPlayer = playerNum ? playerNum[1] : '';
    
    if (answer === correctPlayer) {
        gameState.miniGame.data.scores = gameState.miniGame.data.scores || 0;
        gameState.miniGame.data.scores++;
        showNotification(`Correct! It was Player ${correctPlayer}! +1 point`);
    } else {
        showNotification(`Wrong! It was Player ${correctPlayer}`);
    }
    
    document.getElementById('memoryScore').textContent = gameState.miniGame.data.scores || 0;
    
    // Next round
    gameState.miniGame.data.currentRound++;
    setTimeout(() => showMemoryMatchContent(), 2000);
    playSound('draw');
}

function showPhotoChallengeContent() {
    const challenges = [
        "Take a photo of something red",
        "Make your funniest face",
        "Find something round",
        "Strike a superhero pose",
        "Show us your favorite snack",
        "Make an animal sound",
        "Find something that makes you happy",
        "Do your best dance move",
        "Show us your shoes",
        "Make a heart with your hands",
        "Find something that starts with 'B'",
        "Show us your workspace"
    ];
    
    const currentChallenge = challenges[gameState.miniGame.data.currentChallenge % challenges.length];
    
    const content = `
        <div class="photo-challenge-game">
            <div class="challenge-display">
                <h4>Photo Challenge!</h4>
                <div class="challenge-card">
                    <p>${currentChallenge}</p>
                </div>
            </div>
            <div class="photo-instructions">
                <p>📸 Take a photo and show everyone!</p>
                <div class="timer-display" id="photoTimer">
                    <p>Time remaining: <span id="timeLeft">30</span>s</p>
                </div>
            </div>
            <div class="challenge-controls">
                <button onclick="startPhotoTimer()" class="control-button primary">
                    <i class="fas fa-camera"></i> Start Challenge
                </button>
                <button onclick="nextPhotoChallenge()" class="control-button secondary">
                    <i class="fas fa-forward"></i> Next Challenge
                </button>
            </div>
            <div class="game-info">
                <p>Challenge ${gameState.miniGame.data.currentChallenge + 1} of ${challenges.length}</p>
            </div>
        </div>
    `;
    
    document.getElementById('miniGameContent').innerHTML = content;
}

function startPhotoTimer() {
    let timeLeft = 30;
    const timerElement = document.getElementById('timeLeft');
    
    const timer = setInterval(() => {
        timeLeft--;
        timerElement.textContent = timeLeft;
        
        if (timeLeft <= 0) {
            clearInterval(timer);
            showNotification("Time's up! Show your photo!");
            playSound('favorite');
        }
    }, 1000);
    
    playSound('draw');
}

function nextPhotoChallenge() {
    gameState.miniGame.data.currentChallenge++;
    showPhotoChallengeContent();
    playSound('shuffle');
}

function showStoryBuilderContent() {
    console.log('Loading Story Builder content');
    
    const content = `
        <div class="story-builder-game">
            <div class="story-display" id="storyDisplay">
                <p>Your story will begin here...</p>
            </div>
            <div class="player-input">
                <p>Player ${gameState.miniGame.data.currentPlayer}, add one sentence to continue the story:</p>
                <input type="text" id="storyInput" placeholder="Enter your sentence..." />
                <button onclick="addStorySentence()" class="control-button primary">
                    <i class="fas fa-plus"></i> Add Sentence
                </button>
            </div>
        </div>
    `;
    
    const miniGameContent = document.getElementById('miniGameContent');
    if (miniGameContent) {
        miniGameContent.innerHTML = content;
        console.log('Story Builder content loaded');
    } else {
        console.error('miniGameContent element not found');
    }
}

function addStorySentence() {
    const input = document.getElementById('storyInput');
    const sentence = input.value.trim();
    
    if (sentence) {
        gameState.miniGame.data.story.push({
            player: gameState.miniGame.data.currentPlayer,
            text: sentence
        });
        
        updateStoryDisplay();
        input.value = '';
        
        // Move to next player
        gameState.miniGame.data.currentPlayer = 
            gameState.miniGame.data.currentPlayer === 1 ? 2 : 1;
        
        // Update player indicator
        const playerIndicator = document.querySelector('.player-input p');
        if (playerIndicator) {
            playerIndicator.textContent = 
                `Player ${gameState.miniGame.data.currentPlayer}, add one sentence to continue the story:`;
        }
        
        playSound('draw');
        showNotification(`Player ${gameState.miniGame.data.currentPlayer}'s turn!`);
    } else {
        showNotification('Please enter a sentence!');
    }
}

function updateStoryDisplay() {
    const storyDisplay = document.getElementById('storyDisplay');
    if (!storyDisplay) return;
    
    if (gameState.miniGame.data.story.length === 0) {
        storyDisplay.innerHTML = '<p><em>Your story will begin here...</em></p>';
        return;
    }
    
    const storyText = gameState.miniGame.data.story
        .map((item, index) => `<strong>P${item.player}:</strong> ${item.text}`)
        .join('<br><br>');
    
    storyDisplay.innerHTML = `<div class="story-content">${storyText}</div>`;
}

// Custom Deck Builder Functions
function openDeckBuilder() {
    showDeckBuilderInterface();
}

function showDeckBuilderInterface() {
    const interface = `
        <div class="deck-builder">
            <h3>Create Your Custom Deck</h3>
            <div class="deck-builder-form">
                <div class="form-group">
                    <label>Deck Name:</label>
                    <input type="text" id="deckName" placeholder="Enter deck name..." />
                </div>
                <div class="form-group">
                    <label>Deck Description:</label>
                    <input type="text" id="deckDescription" placeholder="Describe your deck..." />
                </div>
                <div class="form-group">
                    <label>Deck Icon:</label>
                    <select id="deckIcon">
                        <option value="star">⭐ Star</option>
                        <option value="heart">❤️ Heart</option>
                        <option value="rocket">🚀 Rocket</option>
                        <option value="music">🎵 Music</option>
                        <option value="camera">📷 Camera</option>
                        <option value="gamepad">🎮 Gamepad</option>
                    </select>
                </div>
                <div class="form-group">
                    <label>Cards (one per line):</label>
                    <textarea id="deckCards" rows="10" placeholder="Enter your cards, one per line..."></textarea>
                </div>
                <div class="deck-builder-actions">
                    <button onclick="saveCustomDeck()" class="control-button primary">
                        <i class="fas fa-save"></i> Save Deck
                    </button>
                    <button onclick="cancelDeckBuilder()" class="control-button secondary">
                        <i class="fas fa-times"></i> Cancel
                    </button>
                </div>
            </div>
        </div>
    `;
    
    document.getElementById('cardText').innerHTML = interface;
}

function saveCustomDeck() {
    const name = document.getElementById('deckName').value.trim();
    const description = document.getElementById('deckDescription').value.trim();
    const icon = document.getElementById('deckIcon').value;
    const cardsText = document.getElementById('deckCards').value.trim();
    
    if (!name || !cardsText) {
        showNotification('Please fill in deck name and at least one card!');
        return;
    }
    
    const cards = cardsText.split('\n').filter(card => card.trim());
    
    const customDeck = {
        id: 'custom-' + Date.now(),
        name: name,
        description: description,
        icon: icon,
        cards: cards,
        isCustom: true,
        createdAt: new Date().toISOString()
    };
    
    gameState.customDecks.push(customDeck);
    saveGameState();
    
    // Add to card decks
    cardDecks[customDeck.id] = {
        name: customDeck.name,
        icon: customDeck.icon,
        cards: customDeck.cards
    };
    
    showNotification(`Custom deck "${name}" created successfully!`);
    showDeckSelection();
    playSound('favorite');
}

function cancelDeckBuilder() {
    showDeckSelection();
}

function exitMiniGame() {
    gameState.miniGame.isActive = false;
    gameState.miniGame.type = null;
    gameState.miniGame.data = {};
    showDeckSelection();
    playSound('shuffle');
}

// Helper Functions
function filterKidFriendlyCards() {
    // Implementation for filtering kid-friendly cards
    console.log('Filtering kid-friendly cards');
}

function filterDeepCards() {
    // Implementation for filtering deep questions only
    console.log('Filtering deep cards');
}

function enableFastPace() {
    // Implementation for fast pace mode
    console.log('Enabling fast pace mode');
}

function enableTimer(duration) {
    // Implementation for timer
    console.log(`Enabling timer: ${duration} seconds`);
}

function showNotification(message) {
    // Create a simple notification
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.textContent = message;
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: var(--primary-color);
        color: white;
        padding: 15px 20px;
        border-radius: 8px;
        z-index: 1000;
        animation: slideIn 0.3s ease;
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.remove();
    }, 3000);
}
function selectDeck(deckType) {
    if (deckType === 'fall-in-love') {
        gameState.couplesMode.isActive = true;
        gameState.currentDeck = deckType;
        showGamePlay();
        initializeCouplesMode();
    } else if (deckType === '36-questions-love') {
        gameState.couplesMode.isActive = false;
        gameState.currentDeck = deckType;
        gameState.shuffledDeck = [...cardDecks[deckType].cards];
        shuffleArray(gameState.shuffledDeck);
        gameState.currentCardIndex = 0;
        
        document.getElementById('currentDeckName').textContent = cardDecks[deckType].name;
        updateCardCounter();
        showGamePlay();
        showAronInstructions();
    } else {
        gameState.couplesMode.isActive = false;
        gameState.currentDeck = deckType;
        gameState.shuffledDeck = [...cardDecks[deckType].cards];
        shuffleArray(gameState.shuffledDeck);
        gameState.currentCardIndex = 0;
        
        document.getElementById('currentDeckName').textContent = cardDecks[deckType].name;
        updateCardCounter();
        showGamePlay();
    }
}

function showAronInstructions() {
    const instructions = `
        <div style="text-align: center; padding: 20px; background: rgba(102, 126, 234, 0.1); border-radius: 12px; margin-bottom: 20px;">
            <h4 style="color: #667eea; margin-bottom: 15px;">🧠 Arthur Aron's 36 Questions</h4>
            <p style="margin-bottom: 10px;"><strong>Based on the 1997 scientific study on interpersonal closeness</strong></p>
            <p style="margin-bottom: 10px;">These questions are designed to gradually increase vulnerability and create deep connection.</p>
            <p style="margin-bottom: 10px;"><strong>Instructions:</strong></p>
            <ol style="text-align: left; max-width: 400px; margin: 0 auto;">
                <li>Take turns asking and answering each question</li>
                <li>Be honest and open with your responses</li>
                <li>Listen actively to your partner's answers</li>
                <li>Progress through all 36 questions in order</li>
                <li>End with 4 minutes of silent eye contact</li>
            </ol>
            <p style="margin-top: 15px; font-style: italic; color: #666;">"The more vulnerable you are, the closer you'll become."</p>
        </div>
    `;
    
    document.getElementById('cardText').innerHTML = instructions;
}

function initializeCouplesMode() {
    document.getElementById('currentDeckName').textContent = cardDecks['fall-in-love'].name;
    document.getElementById('cardContainer').classList.add('hidden');
    document.getElementById('couplesMode').classList.remove('hidden');
    document.getElementById('gameControls').classList.add('hidden');
    
    // Reset couples mode state
    gameState.couplesMode.player1Answers = [];
    gameState.couplesMode.player2Answers = [];
    gameState.couplesMode.currentQuestion = 0;
    gameState.couplesMode.currentPlayer = 1;
    
    updateCouplesUI();
}

function startCompatibilityTest() {
    gameState.couplesMode.currentQuestion = 0;
    gameState.couplesMode.currentPlayer = 1;
    gameState.couplesMode.player1Answers = [];
    gameState.couplesMode.player2Answers = [];
    
    document.getElementById('startCompatibilityBtn').style.display = 'none';
    showQuestion();
}

function showQuestion() {
    const questions = cardDecks['fall-in-love'].questions;
    const currentQ = questions[gameState.couplesMode.currentQuestion];
    
    document.getElementById('questionNumber').textContent = gameState.couplesMode.currentQuestion + 1;
    document.getElementById('compatibilityQuestion').textContent = currentQ.question;
    document.getElementById('currentPlayerNum').textContent = gameState.couplesMode.currentPlayer;
    
    // Display answer options
    const optionsContainer = document.getElementById('answerOptions');
    optionsContainer.innerHTML = '';
    
    currentQ.options.forEach((option, index) => {
        const optionDiv = document.createElement('div');
        optionDiv.className = 'answer-option';
        optionDiv.textContent = option.text;
        optionDiv.onclick = () => selectAnswer(option.value, option.points);
        optionsContainer.appendChild(optionDiv);
    });
    
    updateProgressBars();
}

function selectAnswer(value, points) {
    const currentPlayerAnswers = gameState.couplesMode.currentPlayer === 1 ? 
        gameState.couplesMode.player1Answers : gameState.couplesMode.player2Answers;
    
    currentPlayerAnswers.push({ value, points });
    
    // Move to next player or question
    if (gameState.couplesMode.currentPlayer === 1) {
        gameState.couplesMode.currentPlayer = 2;
        showQuestion();
    } else {
        gameState.couplesMode.currentPlayer = 1;
        gameState.couplesMode.currentQuestion++;
        
        if (gameState.couplesMode.currentQuestion < cardDecks['fall-in-love'].questions.length) {
            showQuestion();
        } else {
            calculateCompatibility();
        }
    }
    
    playSound('draw');
}

function updateProgressBars() {
    const totalQuestions = cardDecks['fall-in-love'].questions.length;
    const player1Progress = (gameState.couplesMode.player1Answers.length / totalQuestions) * 100;
    const player2Progress = (gameState.couplesMode.player2Answers.length / totalQuestions) * 100;
    
    document.getElementById('player1Progress').style.width = player1Progress + '%';
    document.getElementById('player2Progress').style.width = player2Progress + '%';
}

function updateCouplesUI() {
    // Update UI elements for couples mode
    const container = document.getElementById('cardContainer') || document.querySelector('.card-container');
    const gameControls = document.getElementById('gameControls') || document.querySelector('.game-controls');
    
    if (container) container.classList.toggle('hidden', gameState.couplesMode.isActive);
    if (gameControls) gameControls.classList.toggle('hidden', gameState.couplesMode.isActive);
    document.getElementById('couplesMode').classList.toggle('hidden', !gameState.couplesMode.isActive);
}

function calculateCompatibility() {
    const player1Answers = gameState.couplesMode.player1Answers;
    const player2Answers = gameState.couplesMode.player2Answers;
    
    let totalScore = 0;
    let maxScore = 0;
    const categories = {
        'Lifestyle': 0,
        'Communication': 0,
        'Values': 0,
        'Social': 0
    };
    
    // Calculate compatibility for each question
    for (let i = 0; i < player1Answers.length; i++) {
        const p1Answer = player1Answers[i];
        const p2Answer = player2Answers[i];
        
        // Calculate compatibility score for this question
        let questionScore = 0;
        let questionMax = 0;
        
        for (const category in p1Answer.points) {
            const p1Points = p1Answer.points[category] || 0;
            const p2Points = p2Answer.points[category] || 0;
            
            // Compatibility is based on how similar their preferences are
            const compatibility = Math.max(0, 3 - Math.abs(p1Points - p2Points));
            questionScore += compatibility;
            questionMax += 3;
            
            // Add to category scores
            if (i < 3) categories['Lifestyle'] += compatibility;
            else if (i < 6) categories['Communication'] += compatibility;
            else if (i < 8) categories['Values'] += compatibility;
            else categories['Social'] += compatibility;
        }
        
        totalScore += questionScore;
        maxScore += questionMax;
    }
    
    const overallPercentage = Math.round((totalScore / maxScore) * 100);
    
    // Calculate category percentages
    for (const category in categories) {
        categories[category] = Math.round((categories[category] / (maxScore / 4)) * 100);
    }
    
    showCompatibilityResults(overallPercentage, categories);
}

function showCompatibilityResults(percentage, categories) {
    const modal = document.getElementById('compatibilityResultsModal');
    
    // Animate the percentage
    animatePercentage(percentage);
    
    // Set message based on percentage
    let message, advice;
    if (percentage >= 80) {
        message = "Perfect Match! You're incredibly compatible! 💕";
        advice = "Your values and preferences align beautifully. You have a strong foundation for a lasting relationship filled with understanding and mutual respect.";
    } else if (percentage >= 60) {
        message = "Great Match! You have wonderful compatibility! 💖";
        advice = "You share many important values and preferences. Your differences can actually complement each other and create a balanced, dynamic relationship.";
    } else if (percentage >= 40) {
        message = "Good Potential! You have some nice connections! 💝";
        advice = "You have areas of compatibility that can grow stronger with communication and understanding. Focus on your shared values while respecting your differences.";
    } else {
        message = "Interesting Dynamic! You're quite different! 💗";
        advice = "Your differences can lead to growth and new perspectives. The key is open communication and finding appreciation for your unique qualities.";
    }
    
    document.getElementById('compatibilityMessage').textContent = message;
    document.getElementById('compatibilityAdvice').textContent = advice;
    
    // Display category breakdown
    const categoriesContainer = document.getElementById('compatibilityCategories');
    categoriesContainer.innerHTML = '';
    
    for (const [category, score] of Object.entries(categories)) {
        const categoryDiv = document.createElement('div');
        categoryDiv.className = 'category-score';
        categoryDiv.innerHTML = `
            <div class="category-name">${category}</div>
            <div class="category-percentage">${score}%</div>
        `;
        categoriesContainer.appendChild(categoryDiv);
    }
    
    modal.classList.add('active');
    playSound('favorite');
}

function animatePercentage(targetPercentage) {
    const element = document.getElementById('compatibilityPercentage');
    let currentPercentage = 0;
    const increment = targetPercentage / 30;
    
    const timer = setInterval(() => {
        currentPercentage += increment;
        if (currentPercentage >= targetPercentage) {
            currentPercentage = targetPercentage;
            clearInterval(timer);
        }
        element.textContent = Math.round(currentPercentage) + '%';
    }, 50);
}

function closeCompatibilityResults() {
    document.getElementById('compatibilityResultsModal').classList.remove('active');
}

function resetCouplesQuiz() {
    gameState.couplesMode.player1Answers = [];
    gameState.couplesMode.player2Answers = [];
    gameState.couplesMode.currentQuestion = 0;
    gameState.couplesMode.currentPlayer = 1;
    
    document.getElementById('startCompatibilityBtn').style.display = 'block';
    document.getElementById('answerOptions').innerHTML = '';
    document.getElementById('questionNumber').textContent = '1';
    document.getElementById('compatibilityQuestion').textContent = 'Ready to discover your compatibility?';
    document.getElementById('currentPlayerNum').textContent = '1';
    
    updateProgressBars();
    closeCompatibilityResults();
}

function shareResults() {
    const percentage = document.getElementById('compatibilityPercentage').textContent;
    const text = `We just took the Fall in Love quiz and got ${percentage} match! 💕 Try it yourself!`;
    
    if (navigator.share) {
        navigator.share({
            title: 'ANACARD Compatibility Results',
            text: text
        });
    } else {
        // Fallback - copy to clipboard
        navigator.clipboard.writeText(text);
        alert('Results copied to clipboard!');
    }
}

function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

// Game Controls
function drawCard() {
    if (gameState.currentCardIndex >= gameState.shuffledDeck.length) {
        // Reshuffle and continue
        shuffleArray(gameState.shuffledDeck);
        gameState.currentCardIndex = 0;
    }
    
    const card = gameState.shuffledDeck[gameState.currentCardIndex];
    displayCard(card);
    gameState.currentCardIndex++;
    updateCardCounter();
    
    // Show timer for dare cards
    if (gameState.currentDeck === 'dares') {
        document.getElementById('timerSection').classList.remove('hidden');
    } else {
        document.getElementById('timerSection').classList.add('hidden');
    }
}

function displayCard(cardText) {
    const cardElement = document.getElementById('currentCard');
    const cardTextElement = document.getElementById('cardText');
    
    // Add animation
    cardElement.style.transform = 'rotateY(90deg)';
    
    setTimeout(() => {
        cardTextElement.textContent = cardText;
        cardElement.style.transform = 'rotateY(0deg)';
    }, 300);
}

function shuffleDeck() {
    shuffleArray(gameState.shuffledDeck);
    gameState.currentCardIndex = 0;
    updateCardCounter();
    
    // Visual feedback
    const card = document.getElementById('currentCard');
    card.style.animation = 'pulse 0.5s ease-in-out';
    setTimeout(() => {
        card.style.animation = '';
    }, 500);
}

function skipCard() {
    drawCard();
}

function saveCard() {
    const currentCardText = document.getElementById('cardText').textContent;
    if (currentCardText && !gameState.savedCards.includes(currentCardText)) {
        gameState.savedCards.push({
            text: currentCardText,
            deck: cardDecks[gameState.currentDeck].name,
            timestamp: new Date().toLocaleString()
        });
        updateSavedCount();
        
        // Visual feedback
        const card = document.getElementById('currentCard');
        card.style.animation = 'pulse 0.5s ease-in-out';
        setTimeout(() => {
            card.style.animation = '';
        }, 500);
    }
}

function updateCardCounter() {
    const total = gameState.shuffledDeck.length;
    const current = gameState.currentCardIndex + 1;
    document.getElementById('cardCounter').textContent = `Card ${current} of ${total}`;
}

function updateSavedCount() {
    document.getElementById('savedCount').textContent = gameState.savedCards.length;
}

// Game Menu Functions
function toggleGameMenu() {
    const menu = document.getElementById('gameMenu');
    menu.classList.toggle('hidden');
}

function toggleEveryoneAnswers() {
    gameState.everyoneAnswersMode = !gameState.everyoneAnswersMode;
    document.getElementById('everyoneAnswersStatus').textContent = 
        gameState.everyoneAnswersMode ? 'ON' : 'OFF';
    
    if (gameState.everyoneAnswersMode) {
        alert('Everyone Answers Mode: Each person takes turns answering the current card!');
    }
}

function toggleHostMode() {
    gameState.hostMode = !gameState.hostMode;
    document.getElementById('hostModeStatus').textContent = 
        gameState.hostMode ? 'ON' : 'OFF';
    
    if (gameState.hostMode) {
        alert('Host Mode: You control the game flow and can manage the deck!');
    }
}

function resetDeck() {
    if (confirm('Are you sure you want to reset this deck?')) {
        gameState.shuffledDeck = [...cardDecks[gameState.currentDeck].cards];
        shuffleArray(gameState.shuffledDeck);
        gameState.currentCardIndex = 0;
        updateCardCounter();
        document.getElementById('cardText').textContent = 'Click "Draw Card" to start playing!';
        toggleGameMenu();
    }
}

// Timer Functions
function startTimer(seconds) {
    stopTimer(); // Clear any existing timer
    gameState.timerSeconds = seconds;
    updateTimerDisplay();
    
    gameState.timerInterval = setInterval(() => {
        gameState.timerSeconds--;
        updateTimerDisplay();
        
        if (gameState.timerSeconds <= 0) {
            stopTimer();
            alert("Time's up!");
        }
    }, 1000);
}

function stopTimer() {
    if (gameState.timerInterval) {
        clearInterval(gameState.timerInterval);
        gameState.timerInterval = null;
    }
    gameState.timerSeconds = 0;
    updateTimerDisplay();
}

function updateTimerDisplay() {
    const minutes = Math.floor(gameState.timerSeconds / 60);
    const seconds = gameState.timerSeconds % 60;
    const display = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    document.getElementById('timerText').textContent = display;
}

// Saved Cards Modal
function showSavedCards() {
    const modal = document.getElementById('savedCardsModal');
    const list = document.getElementById('savedCardsList');
    
    if (gameState.savedCards.length === 0) {
        list.innerHTML = '<p class="empty-state">No saved cards yet</p>';
    } else {
        list.innerHTML = gameState.savedCards.map((card, index) => `
            <div class="saved-card-item">
                <p>${card.text}</p>
                <div class="saved-card-meta">
                    ${card.deck} • ${card.timestamp}
                </div>
            </div>
        `).join('');
    }
    
    modal.classList.add('active');
    toggleGameMenu();
}

function closeSavedCards() {
    document.getElementById('savedCardsModal').classList.remove('active');
}

// Close modal when clicking outside
document.getElementById('savedCardsModal').addEventListener('click', function(e) {
    if (e.target === this) {
        closeSavedCards();
    }
});

// Keyboard shortcuts
document.addEventListener('keydown', function(e) {
    if (document.getElementById('gamePlayPage').classList.contains('active')) {
        switch(e.key) {
            case ' ':
            case 'Enter':
                e.preventDefault();
                drawCard();
                break;
            case 's':
            case 'S':
                saveCard();
                break;
            case 'r':
            case 'R':
                shuffleDeck();
                break;
            case 'ArrowRight':
                skipCard();
                break;
            case 'Escape':
                if (!document.getElementById('gameMenu').classList.contains('hidden')) {
                    toggleGameMenu();
                }
                break;
        }
    }
});

// New Enhanced Functions
function toggleDarkMode() {
    gameState.darkMode = !gameState.darkMode;
    document.documentElement.setAttribute('data-theme', gameState.darkMode ? 'dark' : 'light');
    
    const icon = document.getElementById('themeIcon');
    icon.className = gameState.darkMode ? 'fas fa-sun' : 'fas fa-moon';
    
    playSound('toggle');
    saveGameState();
}

function toggleFavorite() {
    const currentCardText = document.getElementById('cardText').textContent;
    const favoriteIcon = document.getElementById('favoriteIcon');
    
    if (!currentCardText || currentCardText === 'Click "Draw Card" to start playing!') return;
    
    const existingIndex = gameState.favoriteCards.findIndex(card => card.text === currentCardText);
    
    if (existingIndex > -1) {
        gameState.favoriteCards.splice(existingIndex, 1);
        favoriteIcon.className = 'far fa-heart';
    } else {
        gameState.favoriteCards.push({
            text: currentCardText,
            deck: cardDecks[gameState.currentDeck].name,
            timestamp: new Date().toLocaleString()
        });
        favoriteIcon.className = 'fas fa-heart';
        gameState.stats.cardsFavorited++;
    }
    
    updateFavoriteCount();
    playSound('favorite');
    saveGameState();
}

function rateCard() {
    const currentCardText = document.getElementById('cardText').textContent;
    const rateIcon = document.getElementById('rateIcon');
    
    if (!currentCardText || currentCardText === 'Click "Draw Card" to start playing!') return;
    
    // Simple rating toggle - could be expanded to 1-5 stars
    rateIcon.classList.toggle('fas');
    rateIcon.classList.toggle('far');
    
    playSound('rate');
}

function showFavoriteCards() {
    const modal = document.getElementById('favoriteCardsModal');
    const list = document.getElementById('favoriteCardsList');
    
    if (gameState.favoriteCards.length === 0) {
        list.innerHTML = '<p class="empty-state">No favorite cards yet</p>';
    } else {
        list.innerHTML = gameState.favoriteCards.map((card, index) => `
            <div class="saved-card-item">
                <p>${card.text}</p>
                <div class="saved-card-meta">
                    ${card.deck} • ${card.timestamp}
                </div>
            </div>
        `).join('');
    }
    
    modal.classList.add('active');
    toggleGameMenu();
}

function closeFavoriteCards() {
    document.getElementById('favoriteCardsModal').classList.remove('active');
}

function showStats() {
    const modal = document.getElementById('statsModal');
    
    // Update statistics
    document.getElementById('totalCardsDrawn').textContent = gameState.stats.cardsDrawn;
    document.getElementById('totalCardsSaved').textContent = gameState.stats.cardsSaved;
    document.getElementById('totalCardsFavorited').textContent = gameState.stats.cardsFavorited;
    document.getElementById('totalSessionsPlayed').textContent = gameState.stats.sessionsPlayed;
    document.getElementById('totalTimeSpent').textContent = formatTime(gameState.stats.totalTimeSpent);
    
    // Find most played deck
    const deckCounts = {};
    for (const deckType in cardDecks) {
        deckCounts[deckType] = parseInt(localStorage.getItem(`deck_${deckType}_played`) || '0');
    }
    const mostPlayed = Object.keys(deckCounts).reduce((a, b) => deckCounts[a] > deckCounts[b] ? a : b);
    document.getElementById('mostPlayedDeck').textContent = deckCounts[mostPlayed] > 0 ? cardDecks[mostPlayed].name : '-';
    
    modal.classList.add('active');
    toggleGameMenu();
}

function closeStats() {
    document.getElementById('statsModal').classList.remove('active');
}

function toggleSound() {
    gameState.soundEnabled = !gameState.soundEnabled;
    document.getElementById('soundStatus').textContent = gameState.soundEnabled ? 'ON' : 'OFF';
    document.getElementById('soundIcon').className = gameState.soundEnabled ? 'fas fa-volume-up' : 'fas fa-volume-mute';
    saveGameState();
}

function playSound(type) {
    if (!gameState.soundEnabled) return;
    
    // Create simple sound effects using Web Audio API
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    switch(type) {
        case 'draw':
            oscillator.frequency.value = 523.25; // C5
            gainNode.gain.value = 0.1;
            break;
        case 'shuffle':
            oscillator.frequency.value = 659.25; // E5
            gainNode.gain.value = 0.1;
            break;
        case 'save':
            oscillator.frequency.value = 783.99; // G5
            gainNode.gain.value = 0.1;
            break;
        case 'favorite':
            oscillator.frequency.value = 880; // A5
            gainNode.gain.value = 0.1;
            break;
        case 'rate':
            oscillator.frequency.value = 987.77; // B5
            gainNode.gain.value = 0.1;
            break;
        case 'toggle':
            oscillator.frequency.value = 440; // A4
            gainNode.gain.value = 0.05;
            break;
        default:
            oscillator.frequency.value = 440;
            gainNode.gain.value = 0.05;
    }
    
    oscillator.start();
    oscillator.stop(audioContext.currentTime + 0.1);
}

function updateFavoriteCount() {
    document.getElementById('favoriteCount').textContent = gameState.favoriteCards.length;
}

function formatTime(seconds) {
    if (seconds < 60) return `${seconds}s`;
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m`;
    return `${Math.floor(seconds / 3600)}h ${Math.floor((seconds % 3600) / 60)}m`;
}

function saveGameState() {
    localStorage.setItem('anacard_gameState', JSON.stringify(gameState));
}

function loadGameState() {
    const saved = localStorage.getItem('anacard-game-state');
    if (saved) {
        const parsed = JSON.parse(saved);
        Object.assign(gameState, parsed);
        
        // Restore theme
        if (gameState.gameMode && gameState.gameMode !== 'classic') {
            document.body.setAttribute('data-theme', gameState.gameMode);
        }
        
        // Restore dark mode
        if (gameState.darkMode) {
            document.body.setAttribute('data-theme', 'dark');
        }
        
        // Update UI elements
        updateStatsDisplay();
        updateFavoriteCount();
    }
}

function updateStats() {
    gameState.stats.cardsDrawn++;
    gameState.stats.sessionsPlayed = parseInt(localStorage.getItem('total_sessions') || '0') + 1;
    localStorage.setItem('total_sessions', gameState.stats.sessionsPlayed);
    
    // Track deck usage
    const deckKey = `deck_${gameState.currentDeck}_played`;
    const currentCount = parseInt(localStorage.getItem(deckKey) || '0');
    localStorage.setItem(deckKey, currentCount + 1);
    
    saveGameState();
}

// Additional UI Functions
function toggleFavorite() {
    const currentCardText = document.getElementById('cardText').textContent;
    const favoriteIcon = document.getElementById('favoriteIcon');
    
    if (gameState.favoriteCards.includes(currentCardText)) {
        // Remove from favorites
        gameState.favoriteCards = gameState.favoriteCards.filter(card => card !== currentCardText);
        favoriteIcon.className = 'far fa-heart';
        showNotification('Removed from favorites');
    } else {
        // Add to favorites
        gameState.favoriteCards.push(currentCardText);
        favoriteIcon.className = 'fas fa-heart';
        gameState.stats.cardsFavorited++;
        showNotification('Added to favorites');
    }
    
    updateFavoriteCount();
    saveGameState();
    playSound('favorite');
}

function rateCard() {
    const rateIcon = document.getElementById('rateIcon');
    if (rateIcon.className === 'far fa-star') {
        rateIcon.className = 'fas fa-star';
        showNotification('Card rated!');
    } else {
        rateIcon.className = 'far fa-star';
        showNotification('Rating removed');
    }
    playSound('favorite');
}

function toggleGameMenu() {
    const menu = document.getElementById('gameMenu');
    menu.classList.toggle('hidden');
}

function toggleEveryoneAnswers() {
    gameState.everyoneAnswersMode = !gameState.everyoneAnswersMode;
    document.getElementById('everyoneAnswersStatus').textContent = gameState.everyoneAnswersMode ? 'ON' : 'OFF';
    showNotification(`Everyone Answers: ${gameState.everyoneAnswersMode ? 'ON' : 'OFF'}`);
}

function toggleHostMode() {
    gameState.hostMode = !gameState.hostMode;
    document.getElementById('hostModeStatus').textContent = gameState.hostMode ? 'ON' : 'OFF';
    showNotification(`Host Mode: ${gameState.hostMode ? 'ON' : 'OFF'}`);
}

function showSavedCards() {
    if (gameState.savedCards.length === 0) {
        showNotification('No saved cards yet!');
        return;
    }
    
    const savedCardsHtml = gameState.savedCards.map((card, index) => `
        <div class="saved-card">
            <p>${card.text}</p>
            <small>${card.deck} • ${card.timestamp}</small>
        </div>
    `).join('');
    
    document.getElementById('cardText').innerHTML = `
        <div class="saved-cards-container">
            <h3>Saved Cards (${gameState.savedCards.length})</h3>
            ${savedCardsHtml}
        </div>
    `;
}

function showFavoriteCards() {
    if (gameState.favoriteCards.length === 0) {
        showNotification('No favorite cards yet!');
        return;
    }
    
    const favoriteCardsHtml = gameState.favoriteCards.map((card, index) => `
        <div class="favorite-card">
            <p>${card}</p>
        </div>
    `).join('');
    
    document.getElementById('cardText').innerHTML = `
        <div class="favorite-cards-container">
            <h3>Favorite Cards (${gameState.favoriteCards.length})</h3>
            ${favoriteCardsHtml}
        </div>
    `;
}

function showStats() {
    const statsHtml = `
        <div class="stats-container">
            <h3>Your Statistics</h3>
            <div class="stats-grid">
                <div class="stat-item">
                    <i class="fas fa-layer-group"></i>
                    <div>
                        <strong>${gameState.stats.cardsDrawn}</strong>
                        <span>Cards Drawn</span>
                    </div>
                </div>
                <div class="stat-item">
                    <i class="fas fa-bookmark"></i>
                    <div>
                        <strong>${gameState.stats.cardsSaved}</strong>
                        <span>Cards Saved</span>
                    </div>
                </div>
                <div class="stat-item">
                    <i class="fas fa-heart"></i>
                    <div>
                        <strong>${gameState.stats.cardsFavorited}</strong>
                        <span>Favorites</span>
                    </div>
                </div>
                <div class="stat-item">
                    <i class="fas fa-play"></i>
                    <div>
                        <strong>${gameState.stats.sessionsPlayed}</strong>
                        <span>Sessions</span>
                    </div>
                </div>
                <div class="stat-item">
                    <i class="fas fa-clock"></i>
                    <div>
                        <strong>${formatTime(gameState.stats.totalTimeSpent)}</strong>
                        <span>Total Time</span>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    document.getElementById('cardText').innerHTML = statsHtml;
}

function toggleSound() {
    gameState.soundEnabled = !gameState.soundEnabled;
    document.getElementById('soundStatus').textContent = gameState.soundEnabled ? 'ON' : 'OFF';
    document.getElementById('soundIcon').className = gameState.soundEnabled ? 'fas fa-volume-up' : 'fas fa-volume-mute';
    showNotification(`Sound: ${gameState.soundEnabled ? 'ON' : 'OFF'}`);
}

function resetDeck() {
    gameState.currentCardIndex = 0;
    shuffleArray(gameState.shuffledDeck);
    updateCardCounter();
    document.getElementById('cardText').textContent = 'Click "Draw Card" to start playing!';
    showNotification('Deck reset!');
    playSound('shuffle');
}

function toggleDarkMode() {
    gameState.darkMode = !gameState.darkMode;
    const themeIcon = document.getElementById('themeIcon');
    
    if (gameState.darkMode) {
        document.body.setAttribute('data-theme', 'dark');
        themeIcon.className = 'fas fa-sun';
    } else {
        document.body.removeAttribute('data-theme');
        themeIcon.className = 'fas fa-moon';
    }
    
    showNotification(`Dark mode: ${gameState.darkMode ? 'ON' : 'OFF'}`);
    saveGameState();
}

// Core Game Functions
function drawCard() {
    if (gameState.currentCardIndex >= gameState.shuffledDeck.length) {
        shuffleArray(gameState.shuffledDeck);
        gameState.currentCardIndex = 0;
    }
    
    const card = gameState.shuffledDeck[gameState.currentCardIndex];
    displayCard(card);
    gameState.currentCardIndex++;
    updateCardCounter();
    
    // Update stats
    updateStats();
    
    // Reset favorite icon
    document.getElementById('favoriteIcon').className = 'far fa-heart';
    
    playSound('draw');
}

function saveCard() {
    const currentCardText = document.getElementById('cardText').textContent;
    if (currentCardText && !gameState.savedCards.includes(currentCardText)) {
        gameState.savedCards.push({
            text: currentCardText,
            deck: cardDecks[gameState.currentDeck]?.name || 'Unknown',
            timestamp: new Date().toLocaleString()
        });
        updateSavedCount();
        gameState.stats.cardsSaved++;
        
        playSound('save');
        saveGameState();
    }
}

function shuffleDeck() {
    shuffleArray(gameState.shuffledDeck);
    gameState.currentCardIndex = 0;
    updateCardCounter();
    playSound('shuffle');
}

function displayCard(card) {
    const cardElement = document.getElementById('cardText');
    if (typeof card === 'object' && card.text) {
        cardElement.textContent = card.text;
    } else {
        cardElement.textContent = card;
    }
}

function updateCardCounter() {
    const counter = document.getElementById('cardCounter');
    if (counter) {
        counter.textContent = `${gameState.currentCardIndex}/${gameState.shuffledDeck.length}`;
    }
}

function updateSavedCount() {
    const savedCount = document.getElementById('savedCount');
    if (savedCount) {
        savedCount.textContent = gameState.savedCards.length;
    }
}

function updateFavoriteCount() {
    const favoriteCount = document.getElementById('favoriteCount');
    if (favoriteCount) {
        favoriteCount.textContent = gameState.favoriteCards.length;
    }
}

function updateStatsDisplay() {
    const statsDisplay = document.getElementById('statsDisplay');
    if (statsDisplay) {
        statsDisplay.innerHTML = `
            <div class="stat-item">
                <i class="fas fa-layer-group"></i>
                <span>${gameState.stats.cardsDrawn} Cards Drawn</span>
            </div>
            <div class="stat-item">
                <i class="fas fa-bookmark"></i>
                <span>${gameState.stats.cardsSaved} Cards Saved</span>
            </div>
            <div class="stat-item">
                <i class="fas fa-heart"></i>
                <span>${gameState.stats.cardsFavorited} Favorites</span>
            </div>
            <div class="stat-item">
                <i class="fas fa-play"></i>
                <span>${gameState.stats.sessionsPlayed} Sessions</span>
            </div>
        `;
    }
}

// Initialize on load
document.addEventListener('DOMContentLoaded', function() {
    loadGameState();
    
    // Start session timer
    const sessionStart = Date.now();
    setInterval(() => {
        gameState.stats.totalTimeSpent = Math.floor((Date.now() - sessionStart) / 1000);
        saveGameState();
    }, 30000); // Update every 30 seconds
    
    // Add smooth scrolling
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({ behavior: 'smooth' });
            }
        });
    });
    
    // Add touch support for mobile
    let touchStartX = 0;
    let touchEndX = 0;
    
    const card = document.getElementById('currentCard');
    
    if (card) {
        card.addEventListener('touchstart', function(e) {
            touchStartX = e.changedTouches[0].screenX;
        });
        
        card.addEventListener('touchend', function(e) {
            touchEndX = e.changedTouches[0].screenX;
            handleSwipe();
        });
    }
    
    function handleSwipe() {
        const swipeThreshold = 50;
        const diff = touchStartX - touchEndX;
        
        if (Math.abs(diff) > swipeThreshold) {
            if (diff > 0) {
                // Swipe left - next card
                drawCard();
            } else {
                // Swipe right - save card
                saveCard();
            }
        }
    }
    
    // Initialize UI
    updateStatsDisplay();
    updateFavoriteCount();
    updateSavedCount();
});
