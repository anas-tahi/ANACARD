// ANACARD JavaScript - Interactive Card Game Logic

// Game State
let gameState = {
    currentDeck: null,
    currentCardIndex: 0,
    shuffledDeck: [],
    savedCards: [],
    everyoneAnswersMode: false,
    hostMode: false,
    timerInterval: null,
    timerSeconds: 0
};

// Card Decks Data
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

// Deck Selection
function selectDeck(deckType) {
    gameState.currentDeck = deckType;
    gameState.shuffledDeck = [...cardDecks[deckType].cards];
    shuffleArray(gameState.shuffledDeck);
    gameState.currentCardIndex = 0;
    
    document.getElementById('currentDeckName').textContent = cardDecks[deckType].name;
    updateCardCounter();
    showGamePlay();
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

// Initialize
document.addEventListener('DOMContentLoaded', function() {
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
    
    card.addEventListener('touchstart', function(e) {
        touchStartX = e.changedTouches[0].screenX;
    });
    
    card.addEventListener('touchend', function(e) {
        touchEndX = e.changedTouches[0].screenX;
        handleSwipe();
    });
    
    function handleSwipe() {
        const swipeThreshold = 50;
        const diff = touchStartX - touchEndX;
        
        if (Math.abs(diff) > swipeThreshold) {
            if (diff > 0) {
                // Swipe left - skip card
                skipCard();
            } else {
                // Swipe right - save card
                saveCard();
            }
        }
    }
    
    // Prevent context menu on long press for better mobile experience
    card.addEventListener('contextmenu', function(e) {
        e.preventDefault();
    });
});
