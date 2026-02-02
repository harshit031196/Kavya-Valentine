document.addEventListener('DOMContentLoaded', () => {
    // Element Constants
    const body = document.body;
    const landingPage = document.getElementById('landing-page');
    const fastForwardButton = document.getElementById('fast-forward');
    const transitionContainer = document.getElementById('transition-container');
    const febPage = document.getElementById('feb-page');
    const enterFebButton = document.getElementById('enter-feb-button');
    const proposalPage = document.getElementById('proposal-page');
    const finalMessagePage = document.getElementById('final-message-page');
    const yesButton = document.getElementById('yes-button');
    const noButton = document.getElementById('no-button');
    const noButtonQuote = document.getElementById('no-button-quote');
    const flipper = document.querySelector('.flipper');
    const frontPage = document.querySelector('.front');
    const backPage = document.querySelector('.back');
    // Transition state
    let flipTimeoutId = null;
    let transitioning = false;

    // Helpers to control pages
    function cancelFlip() {
        if (flipTimeoutId) { clearTimeout(flipTimeoutId); flipTimeoutId = null; }
        transitioning = false;
    }

    function hideAllPages() {
        landingPage.style.display = 'none';
        transitionContainer.style.display = 'none';
        febPage.style.display = 'none';
        proposalPage.style.display = 'none';
        finalMessagePage.style.display = 'none';
        landingPage.classList.remove('page-visible');
        transitionContainer.classList.remove('page-visible');
        febPage.classList.remove('page-visible');
        proposalPage.classList.remove('page-visible');
        finalMessagePage.classList.remove('page-visible');
    }

    function showPage(el) {
        hideAllPages();
        el.style.display = 'flex';
        requestAnimationFrame(() => el.classList.add('page-visible'));
    }

    // Show landing page initially
    showPage(landingPage);

    // Image and Color Configuration
    const totalImages = 13;
    const images = Array.from({ length: totalImages }, (_, i) => `images/journey-${i + 1}.png`);
    const colors = ['#1a1a1a', '#2a2a2a', '#3a3a3a', '#4a4a4a', '#5a5a5a', '#6a6a6a', '#7a7a7a', '#8a8a8a', '#9a9a9a', '#aaaaaa', '#bbbbbb', '#cccccc', '#dddddd'];
    let currentImage = 0;
    let progressContainer = null;
    let progressDots = [];

    function buildProgressDots(count) {
        clearProgressDots();
        progressContainer = document.createElement('div');
        progressContainer.id = 'progress-dots';
        // container inline styles
        Object.assign(progressContainer.style, {
            position: 'absolute',
            bottom: '18px',
            left: '50%',
            transform: 'translateX(-50%)',
            display: 'flex',
            gap: '8px',
            pointerEvents: 'none',
            zIndex: '3'
        });

        for (let i = 0; i < count; i++) {
            const dot = document.createElement('span');
            // dot inline styles
            Object.assign(dot.style, {
                width: '8px',
                height: '8px',
                borderRadius: '50%',
                background: 'rgba(255,255,255,0.4)',
                boxShadow: '0 2px 8px rgba(0,0,0,0.25)',
                opacity: '0.7',
                transform: 'scale(1)',
                transition: 'transform .2s ease, background .2s ease, opacity .2s ease'
            });
            progressContainer.appendChild(dot);
            progressDots.push(dot);
        }
        transitionContainer.appendChild(progressContainer);
    }

    function setActiveProgressDot(index) {
        if (!progressDots.length) return;
        const clamped = Math.max(0, Math.min(index, progressDots.length - 1));
        progressDots.forEach((d, i) => {
            const active = i === clamped;
            d.style.background = active ? '#ff4081' : 'rgba(255,255,255,0.4)';
            d.style.transform = active ? 'scale(1.4)' : 'scale(1)';
            d.style.opacity = active ? '1' : '0.7';
        });
    }

    function clearProgressDots() {
        if (progressContainer && progressContainer.parentNode) {
            progressContainer.parentNode.removeChild(progressContainer);
        }
        progressContainer = null;
        progressDots = [];
    }


    // --- Event Listeners ---
    fastForwardButton.addEventListener('click', () => {
        if (transitioning) return;
        transitioning = true;
        fastForwardButton.disabled = true;
        showPage(transitionContainer);
        currentImage = 0;
        buildProgressDots(images.length);
        setActiveProgressDot(0);
        startImageTransition();
    });

    enterFebButton.addEventListener('click', () => {
        if (flipTimeoutId) { clearTimeout(flipTimeoutId); flipTimeoutId = null; }
        transitioning = false;
        cancelFlip();
        clearProgressDots();
        showPage(proposalPage);
        body.style.background = 'linear-gradient(135deg, #ff9a9e 0%, #fad0c4 99%, #fad0c4 100%)';
        createPetals();
    });

    yesButton.addEventListener('click', () => {
        if (flipTimeoutId) { clearTimeout(flipTimeoutId); flipTimeoutId = null; }
        transitioning = false;
        cancelFlip();
        clearProgressDots();
        showPage(finalMessagePage);
        body.style.background = '#fff';
        partyPopper();
    });

    const quotes = [
        "No is a little harder to say, right :p?",
        "Are you sure?",
        "Really?",
        "Think again!",
        "Last chance!",
        "Okay, you're persistent!"
    ];

    noButton.addEventListener('mouseover', () => {
        const x = Math.random() * (window.innerWidth - noButton.clientWidth);
        const y = Math.random() * (window.innerHeight - noButton.clientHeight);
        noButton.style.position = 'absolute';
        noButton.style.left = `${x}px`;
        noButton.style.top = `${y}px`;
        noButtonQuote.innerText = quotes[Math.floor(Math.random() * quotes.length)];
    });

    // --- Animation and Transition Functions ---
    function startImageTransition() {
        // If navigation already happened, stop
        if (!transitioning) return;
        if (currentImage >= images.length) {
            cancelFlip();
            showPage(febPage);
            clearProgressDots();
            return;
        }

        body.style.backgroundColor = colors[currentImage] || '#e0e0e0';
        setActiveProgressDot(currentImage);

        if (currentImage % 2 === 0) {
            frontPage.style.backgroundImage = `url(${images[currentImage]})`;
            if (images[currentImage + 1]) {
                backPage.style.backgroundImage = `url(${images[currentImage + 1]})`;
            }
            flipper.classList.remove('flipped');
        } else {
            backPage.style.backgroundImage = `url(${images[currentImage]})`;
            if (images[currentImage + 1]) {
                frontPage.style.backgroundImage = `url(${images[currentImage + 1]})`;
            }
            flipper.classList.add('flipped');
        }
        
        currentImage++;
        flipTimeoutId = setTimeout(startImageTransition, 360); // Pace matches CSS for realistic calendar flip
    }

    function createPetals() {
        for (let i = 0; i < 30; i++) {
            const petal = document.createElement('div');
            petal.classList.add('petal');
            petal.style.left = `${Math.random() * 100}vw`;
            petal.style.animationDuration = `${Math.random() * 2 + 3}s`;
            petal.style.animationDelay = `${Math.random() * 5}s`;
            body.appendChild(petal);
        }
    }

    function partyPopper() {
        const end = Date.now() + (3 * 1000);
        const colors = ['#ff4081', '#ff9a9e', '#ffffff'];

        (function frame() {
            confetti({
                particleCount: 3,
                angle: 60,
                spread: 55,
                origin: { x: 0 },
                colors: colors
            });
            confetti({
                particleCount: 3,
                angle: 120,
                spread: 55,
                origin: { x: 1 },
                colors: colors
            });

            if (Date.now() < end) {
                requestAnimationFrame(frame);
            }
        }());
    }
});