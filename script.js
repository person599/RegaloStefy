function switchPage(targetId) {
    const main = document.getElementById('mainPage');
    const countdown = document.getElementById('countdownPage');

    if (targetId) {
        if (targetId === 'mainPage') {
            countdown.classList.remove('active');
            main.classList.add('active');
        } else if (targetId === 'countdownPage') {
            main.classList.remove('active');
            countdown.classList.add('active');
        }
        return;
    }

    if (main.classList.contains('active')) {
        main.classList.remove('active');
        countdown.classList.add('active');
    } else {
        countdown.classList.remove('active');
        main.classList.add('active');
    }
}

function createSnow() {
    const snowContainers = document.querySelectorAll('.snow-container');
    const snowflakeCount = 100;
    
    snowContainers.forEach(container => {
        for (let i = 0; i < snowflakeCount; i++) {
            const snowflake = document.createElement('div');
            snowflake.textContent = '❄';
            snowflake.style.position = 'absolute';
            snowflake.style.color = 'white';
            snowflake.style.left = Math.random() * 100 + '%';
            snowflake.style.top = Math.random() * -100 + 'px';
            snowflake.style.animationName = 'snowfall';
            snowflake.style.animationDuration = (10 + Math.random() * 10) + 's';
            snowflake.style.animationDelay = Math.random() * 5 + 's';
            snowflake.style.animationIterationCount = 'infinite';
            snowflake.style.animationTimingFunction = 'linear';
            snowflake.style.opacity = 0.6 + Math.random() * 0.4;
            snowflake.style.fontSize = (8 + Math.random() * 16) + 'px';
            snowflake.style.userSelect = 'none';
            snowflake.style.pointerEvents = 'none';
            container.appendChild(snowflake);
        }
    });
}

function updateCountdown() {
    const target = new Date('2026-05-05T00:00:00').getTime();
    const now = new Date().getTime();
    const diff = target - now;
    
    if (diff > 0) {
        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((diff % (1000 * 60)) / 1000);
        
        document.getElementById('days').textContent = String(days).padStart(3, '0');
        document.getElementById('hours').textContent = String(hours).padStart(2, '0');
        document.getElementById('minutes').textContent = String(minutes).padStart(2, '0');
        document.getElementById('seconds').textContent = String(seconds).padStart(2, '0');
    } else {
        document.getElementById('days').textContent = '000';
        document.getElementById('hours').textContent = '00';
        document.getElementById('minutes').textContent = '00';
        document.getElementById('seconds').textContent = '00';
        document.querySelector('.birthday-message p').textContent = '🎉 È OGGI! AUGURI! 🎉';
    }
}

const musicToggle = document.getElementById('music-toggle');
const menuMusic = document.getElementById('menu-music');
let isPlaying = false;

musicToggle.addEventListener('click', () => {
    if (isPlaying) {
        menuMusic.pause();
        musicToggle.textContent = '🔇';
        console.log('Musica in pausa');
        isPlaying = false;
    } else {
        menuMusic.play();
        musicToggle.textContent = '🔊';
        console.log('Musica in riproduzione');
        isPlaying = true;
    }
});

/* --- GESTIONE PWA INSTALLAZIONE --- */    

document.addEventListener('DOMContentLoaded', () => {
    
    const pwaBanner = document.getElementById('pwa-install-banner');
    const installBtn = document.getElementById('pwa-install-btn');
    const dismissBtn = document.getElementById('pwa-dismiss-btn');
    let deferredPrompt;

    // Controllo sicurezza elementi
    if (!pwaBanner || !installBtn || !dismissBtn) {
        console.error("ERRORE: Elementi banner non trovati.");
        return;
    }

    function shouldShowInstallPrompt() {
        // 1. Se l'abbiamo già installata, non mostrarlo
        if (localStorage.getItem('pwaInstalled') === 'true') return false;

        // 2. Se l'app è già aperta come App (standalone), non mostrarlo
        if (window.matchMedia('(display-mode: standalone)').matches) return false;

        // RIMOSSO: Il controllo su 'pwaDismissed'. 
        // Ora mostrerà il banner ogni volta che ricarichi, finché non installi.
        return true;
    }

    window.addEventListener('beforeinstallprompt', (e) => {
        // Impedisce al browser di mostrare il banner standard (e genera quel warning in console, è normale)
        e.preventDefault();
        deferredPrompt = e;
        console.log("Evento catturato. Pronto a mostrare il banner.");

        if (shouldShowInstallPrompt()) {
            pwaBanner.style.display = 'block'; 
        }
    });

    installBtn.addEventListener('click', async () => {
        if (deferredPrompt) {
            deferredPrompt.prompt();
            const { outcome } = await deferredPrompt.userChoice;
            console.log(`Esito: ${outcome}`);
            
            // Se l'utente accetta, nascondiamo il banner per sempre
            if (outcome === 'accepted') {
                deferredPrompt = null;
                pwaBanner.style.display = 'none';
            }
            // Se rifiuta, il banner sparisce solo per ora, ma tornerà al reload
        }
    });

    dismissBtn.addEventListener('click', () => {
        // Nasconde il banner SOLO per questa sessione
        pwaBanner.style.display = 'none';
        
        // RIMOSSO: localStorage.setItem('pwaDismissed', 'true');
        // Anzi, per sicurezza rimuoviamo eventuali blocchi precedenti:
        localStorage.removeItem('pwaDismissed');
    });

    window.addEventListener('appinstalled', () => {
        console.log('App installata!');
        pwaBanner.style.display = 'none';
        localStorage.setItem('pwaInstalled', 'true');
    });
});

createSnow();
setInterval(updateCountdown, 1000);
updateCountdown();