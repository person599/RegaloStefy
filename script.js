// ========== PAGE SWITCHING ==========
function switchPage(targetId) {
    const main = document.getElementById('mainPage');
    const countdown = document.getElementById('countdownPage');
    
    if (!main || !countdown) return;

    if (targetId === 'mainPage') {
        countdown.classList.remove('active');
        main.classList.add('active');
    } else if (targetId === 'countdownPage') {
        main.classList.remove('active');
        countdown.classList.add('active');
    }
}

function createSnow() {
    const snowContainers = document.querySelectorAll('.snow-container');
    const isMobile = window.innerWidth < 600;
    const snowflakeCount = isMobile ? 200 : 300;
    
    snowContainers.forEach(container => {
        container.innerHTML = '';
        
        for (let i = 0; i < snowflakeCount; i++) {
            const snowflake = document.createElement('div');
            snowflake.textContent = '❄';
            snowflake.style.cssText = `
                position: absolute;
                color: white;
                left: ${Math.random() * 100}%;
                top: ${Math.random() * -100}px;
                animation: snowfall ${8 + Math.random() * 12}s linear infinite;
                animation-delay: ${Math.random() * 10}s;
                opacity: ${0.4 + Math.random() * 0.6};
                font-size: ${6 + Math.random() * 16}px;
                user-select: none;
                pointer-events: none;
                will-change: transform;
            `;
            container.appendChild(snowflake);
        }
    });
}

// ========== COUNTDOWN ==========
function updateCountdown() {
    const target = new Date('2026-05-05T00:00:00').getTime();
    const now = Date.now();
    const diff = target - now;
    
    const daysEl = document.getElementById('days');
    const hoursEl = document.getElementById('hours');
    const minutesEl = document.getElementById('minutes');
    const secondsEl = document.getElementById('seconds');
    const messageEl = document.querySelector('.birthday-message p');
    
    if (!daysEl || !hoursEl || !minutesEl || !secondsEl) return;
    
    if (diff > 0) {
        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((diff % (1000 * 60)) / 1000);
        
        daysEl.textContent = String(days).padStart(3, '0');
        hoursEl.textContent = String(hours).padStart(2, '0');
        minutesEl.textContent = String(minutes).padStart(2, '0');
        secondsEl.textContent = String(seconds).padStart(2, '0');
    } else {
        daysEl.textContent = '000';
        hoursEl.textContent = '00';
        minutesEl.textContent = '00';
        secondsEl.textContent = '00';
        if (messageEl) {
            messageEl.textContent = '🎉 È OGGI! AUGURI! 🎉';
        }
    }
}

// ========== MUSIC TOGGLE ==========
function initMusic() {
    const musicToggle = document.getElementById('music-toggle');
    const menuMusic = document.getElementById('menu-music');
    
    if (!musicToggle || !menuMusic) return;
    
    let isPlaying = false;
    
    musicToggle.addEventListener('click', function() {
        if (isPlaying) {
            menuMusic.pause();
            musicToggle.textContent = '🔇';
            isPlaying = false;
        } else {
            menuMusic.play().then(function() {
                musicToggle.textContent = '🔊';
                isPlaying = true;
            }).catch(function() {
                // Autoplay blocked, do nothing
                console.log('Autoplay blocked');
            });
        }
    });
}

// ========== PWA INSTALL ==========
function initPWA() {
    const pwaBanner = document.getElementById('pwa-install-banner');
    const installBtn = document.getElementById('pwa-install-btn');
    const dismissBtn = document.getElementById('pwa-dismiss-btn');
    
    if (!pwaBanner || !installBtn || !dismissBtn) return;
    
    let deferredPrompt = null;

    function shouldShowInstallPrompt() {
        if (localStorage.getItem('pwaInstalled') === 'true') return false;
        if (window.matchMedia('(display-mode: standalone)').matches) return false;
        return true;
    }

    window.addEventListener('beforeinstallprompt', function(e) {
        e.preventDefault();
        deferredPrompt = e;
        
        if (shouldShowInstallPrompt()) {
            pwaBanner.style.display = 'block';
        }
    });

    installBtn.addEventListener('click', function() {
        if (deferredPrompt) {
            deferredPrompt.prompt();
            deferredPrompt.userChoice.then(function(choiceResult) {
                if (choiceResult.outcome === 'accepted') {
                    deferredPrompt = null;
                    pwaBanner.style.display = 'none';
                }
            });
        }
    });

    dismissBtn.addEventListener('click', function() {
        pwaBanner.style.display = 'none';
    });

    window.addEventListener('appinstalled', function() {
        pwaBanner.style.display = 'none';
        localStorage.setItem('pwaInstalled', 'true');
    });
}

// ========== PREVENT SCROLL BOUNCE ON IOS ==========
function preventOverscroll() {
    document.body.addEventListener('touchmove', function(e) {
        const target = e.target;
        const page = target.closest('.page.active');
        
        if (page) {
            const isScrollable = page.scrollHeight > page.clientHeight;
            const isAtTop = page.scrollTop <= 0;
            const isAtBottom = page.scrollTop + page.clientHeight >= page.scrollHeight;
            
            if (!isScrollable || (isAtTop && e.touches[0].clientY > 0) || isAtBottom) {
                // Allow normal behavior
            }
        }
    }, { passive: true });
}

// ========== HANDLE RESIZE ==========
let resizeTimeout;
function handleResize() {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(function() {
        createSnow();
    }, 250);
}

// ========== INITIALIZATION ==========
document.addEventListener('DOMContentLoaded', function() {
    initMusic();
    initPWA();
    createSnow();
    updateCountdown();
    preventOverscroll();
    
    // Update countdown every second
    setInterval(updateCountdown, 1000);
    
    // Recreate snow on resize
    window.addEventListener('resize', handleResize);
});

// Fallback if DOMContentLoaded already fired
if (document.readyState === 'complete' || document.readyState === 'interactive') {
    initMusic();
    initPWA();
    createSnow();
    updateCountdown();
    setInterval(updateCountdown, 1000);
}
