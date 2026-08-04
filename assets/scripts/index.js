
        // === SIDEBAR TOGGLE ===
        function toggleSidebar() {
            document.getElementById('sidebar').classList.add('active');
            document.getElementById('overlay').classList.add('active');
        }

        function closeSidebar() {
            document.getElementById('sidebar').classList.remove('active');
            document.getElementById('overlay').classList.remove('active');
        }

        // === AUDIO PLAYER FUNCTIONALITY ===
        (function () {
            var audio   = document.getElementById('fr-audio');
            var player  = document.getElementById('fr-player');
            var btn     = document.getElementById('fr-btn');
            var icon    = document.getElementById('fr-icon');
            var status  = document.getElementById('fr-status');
            var vol     = document.getElementById('fr-vol');
            var fill    = document.getElementById('fr-fill');
            var playing = false;

            audio.volume = 0.8;

            function setPlaying(state) {
                playing = state;
                player.className = 'fr-player' + (state ? ' fr-player--playing' : '');
                icon.innerHTML = state
                    ? '<rect x="6" y="5" width="4" height="14"/><rect x="14" y="5" width="4" height="14"/>'
                    : '<path d="M8 5v14l11-7z"/>';
            }

            btn.addEventListener('click', function () {
                if (!playing) {
                    // Updated stream URL
                    audio.src = 'https://friendship.introtorhythm.com/friendship';
                    console.log('Loading stream:', audio.src);
                    
                    audio.play()
                        .then(function () { 
                            setPlaying(true); 
                            status.textContent = 'Live'; 
                            console.log('✓ Stream playing successfully');
                        })
                        .catch(function (err) {
                            status.textContent = 'Connection failed';
                            console.error('✗ Stream error:', err);
                        });
                } else {
                    audio.pause();
                    audio.src = '';
                    setPlaying(false);
                    status.textContent = 'Press play to tune in';
                }
            });

            audio.addEventListener('waiting', function () { status.textContent = 'Buffering…'; });
            audio.addEventListener('playing', function () { status.textContent = 'Live'; });
            audio.addEventListener('error',   function () { 
                setPlaying(false); 
                status.textContent = 'Stream unavailable'; 
                console.error('Audio element error:', audio.error);
            });

            vol.addEventListener('input', function () {
                audio.volume = vol.value / 100;
                fill.style.width = vol.value + '%';
            });
        }());