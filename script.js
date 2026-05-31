document.addEventListener('DOMContentLoaded', () => {
    // ==========================================
    // 1. REAL AUDIO PLAYER LOGIC (HTML5 API)
    // ==========================================
    const players = document.querySelectorAll('.audio-player');
    let currentlyPlayingAudio = null;
    let currentlyPlayingBtn = null;

    players.forEach(player => {
        const playBtn = player.querySelector('.play-btn');
        const progressContainer = player.querySelector('.progress-container');
        const progressBar = player.querySelector('.progress-bar');
        const currentTimeEl = player.querySelector('.current-time');
        const durationEl = player.querySelector('.duration');
        const audio = player.querySelector('audio');

        if (!audio) return;

        // Helper func to format seconds to M:SS
        const formatTime = (secs) => {
            if (isNaN(secs) || secs === Infinity) return "--:--";
            const m = Math.floor(secs / 60);
            const s = Math.floor(secs % 60);
            return `${m}:${s < 10 ? '0' : ''}${s}`;
        };

        // Initialize duration when metadata is loaded by the browser
        audio.addEventListener('loadedmetadata', () => {
            durationEl.textContent = formatTime(audio.duration);
        });

        // Toggle Play/Pause
        playBtn.addEventListener('click', () => {
            if (audio.paused) {
                // Pause any other playing track first
                if (currentlyPlayingAudio && currentlyPlayingAudio !== audio) {
                    currentlyPlayingAudio.pause();
                    currentlyPlayingBtn.classList.remove('playing');
                }
                
                audio.play().then(() => {
                    playBtn.classList.add('playing');
                    currentlyPlayingAudio = audio;
                    currentlyPlayingBtn = playBtn;
                }).catch(error => {
                    console.error("Помилка відтворення:", error);
                    alert("Не вдалося завантажити трек. Перевірте публічність репозиторію або правильність посилання.");
                    playBtn.classList.remove('playing');
                });
            } else {
                audio.pause();
                playBtn.classList.remove('playing');
            }
        });

        // Update progress bar and time text dynamically
        audio.addEventListener('timeupdate', () => {
            if (!audio.duration) return;
            const percent = (audio.currentTime / audio.duration) * 100;
            progressBar.style.width = `${percent}%`;
            currentTimeEl.textContent = formatTime(audio.currentTime);
        });

        // Reset when track finishes
        audio.addEventListener('ended', () => {
            playBtn.classList.remove('playing');
            progressBar.style.width = '0%';
            currentTimeEl.textContent = '0:00';
            currentlyPlayingAudio = null;
        });

        // Seek timeline click functionality
        progressContainer.addEventListener('click', (e) => {
            if (!audio.duration) return; // Prevent clicking if not loaded
            const rect = progressContainer.getBoundingClientRect();
            const clickX = e.clientX - rect.left;
            const width = rect.width;
            const percentage = Math.max(0, Math.min(1, (clickX / width)));
            
            audio.currentTime = percentage * audio.duration;
        });
    });

    // ==========================================
    // 2. LUXURY STARDUST PARTICLES (HTML5 CANVAS)
    // ==========================================
    const canvas = document.getElementById('particle-canvas');
    if (canvas) {
        const ctx = canvas.getContext('2d');
        let particles = [];
        
        function resizeCanvas() {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        }
        window.addEventListener('resize', resizeCanvas);
        resizeCanvas();

        class Particle {
            constructor() {
                this.reset();
                this.y = Math.random() * canvas.height;
            }

            reset() {
                this.x = Math.random() * canvas.width;
                this.y = canvas.height + Math.random() * 20;
                this.size = Math.random() * 1.2 + 0.4;
                this.speedY = -(Math.random() * 0.3 + 0.1);
                this.opacity = Math.random() * 0.3 + 0.1;
                this.twinkleSpeed = Math.random() * 0.015 + 0.005;
                this.twinkleAngle = Math.random() * Math.PI;
                this.swaySpeed = Math.random() * 0.01 + 0.005;
                this.swayAngle = Math.random() * Math.PI;
            }

            update() {
                this.y += this.speedY;
                this.twinkleAngle += this.twinkleSpeed;
                this.swayAngle += this.swaySpeed;
                this.x += Math.sin(this.swayAngle) * 0.15;

                if (this.y < -10 || this.x < -10 || this.x > canvas.width + 10) {
                    this.reset();
                }
            }

            draw() {
                ctx.beginPath();
                const alpha = this.opacity * (0.4 + Math.sin(this.twinkleAngle) * 0.6);
                ctx.fillStyle = `rgba(247, 224, 168, ${Math.max(0, Math.min(alpha, 1))})`;
                ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
                ctx.fill();
            }
        }

        const particleCount = Math.min(90, Math.floor((canvas.width * canvas.height) / 18000));
        for (let i = 0; i < particleCount; i++) {
            particles.push(new Particle());
        }

        function animateParticles() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            particles.forEach(p => {
                p.update();
                p.draw();
            });
            requestAnimationFrame(animateParticles);
        }
        animateParticles();
    }
});
