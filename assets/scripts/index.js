// Constants
const PRIMARY_URL = 'https://friendship.introtorhythm.com/friendship';
const BACKUP_URL = 'https://introtorhythm.com/listen';

// === SIDEBAR TOGGLE ===
const toggleSidebar = () => {
    const isOpen = document.getElementById('sidebar').classList.contains('active');

    if (isOpen) {
        closeSidebar();
    } else {
        openSidebar();
    }
};

const openSidebar = () => {
    document.getElementById('sidebar').classList.add('active');
    document.getElementById('overlay').classList.add('active');
};

const closeSidebar = () => {
    document.getElementById('sidebar').classList.remove('active');
    document.getElementById('overlay').classList.remove('active');
}

const tryPlay = (audio, src) => {
    audio.src = src;

    return audio.play()
        .then(() => true)
        .catch((err) => {
            console.error(`✗ Stream error for ${src}:`, err);
            return false;
        });
};

// === AUDIO PLAYER FUNCTIONALITY ===
(() => {
    let audio = document.getElementById('fr-audio');
    let player = document.getElementById('fr-player');
    let btn = document.getElementById('fr-btn');
    let icon = document.getElementById('fr-icon');
    let status = document.getElementById('fr-status');
    let vol = document.getElementById('fr-vol');
    let fill = document.getElementById('fr-fill');
    let playing = false;

    audio.volume = 0.8;

    const setPlaying = (state) => {
        playing = state;
        player.className = 'fr-player' + (state ? ' fr-player--playing' : '');
        icon.innerHTML = state
            ? '<rect x="6" y="5" width="4" height="14"/><rect x="14" y="5" width="4" height="14"/>'
            : '<path d="M8 5v14l11-7z"/>';
    };

    btn.addEventListener('click', async () => {
        if (!playing) {
            status.textContent = 'Connecting…';

            let streamIsPlaying = await tryPlay(audio, PRIMARY_URL);

            if (!streamIsPlaying) {
                streamIsPlaying = await tryPlay(audio, BACKUP_URL);
            }

            if (!streamIsPlaying) {
                status.textContent = 'Stream unavailable';
                console.error('✗ Both streams failed to load');
                return;
            }

            setPlaying(true);
            status.textContent = 'Live';
            console.log('Loading stream:', audio.src);
            console.log('✓ Stream playing successfully');
        } else {
            audio.pause();
            audio.src = '';
            setPlaying(false);
            status.textContent = 'Press play to tune in';
        }
    });

    audio.addEventListener('waiting', () => { status.textContent = 'Buffering…'; });
    audio.addEventListener('playing', () => { status.textContent = 'Live'; });
    audio.addEventListener('error',   () => {
        setPlaying(false);
        status.textContent = 'Stream unavailable';
        console.error('Audio element error:', audio.error);
    });

    vol.addEventListener('input', () => {
        audio.volume = vol.value / 100;
        fill.style.width = vol.value + '%';
    });
})();
