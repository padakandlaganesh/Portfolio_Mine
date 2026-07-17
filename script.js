document.addEventListener('DOMContentLoaded', () => {

    /* ==========================================================================
       CUSTOM CURSOR
       ========================================================================== */
    const cursorDot = document.getElementById('cursor-dot');
    const cursorRing = document.getElementById('cursor-ring');
    
    let mouseX = 0;
    let mouseY = 0;
    let ringX = 0;
    let ringY = 0;
    let lastSpawnTime = 0;
    
    // Check if device supports hover interactions (mouse)
    const isDesktop = window.matchMedia('(pointer: fine)').matches;
    
    if (isDesktop && cursorDot && cursorRing) {
        window.addEventListener('mousemove', (e) => {
            mouseX = e.clientX;
            mouseY = e.clientY;
            
            // Instantly position the inner dot
            cursorDot.style.left = `${mouseX}px`;
            cursorDot.style.top = `${mouseY}px`;
            
            // Spawn trailing particles
            const now = Date.now();
            if (now - lastSpawnTime > 45) {
                createCursorParticle(mouseX, mouseY);
                lastSpawnTime = now;
            }
        });
        
        // Smoothly interpolate the outer ring (fluid lag effect)
        const animateRing = () => {
            const ease = 0.15; // interpolation factor
            ringX += (mouseX - ringX) * ease;
            ringY += (mouseY - ringY) * ease;
            
            cursorRing.style.left = `${ringX}px`;
            cursorRing.style.top = `${ringY}px`;
            
            requestAnimationFrame(animateRing);
        };
        animateRing();
        
        // Add hovered states to cursor on links/buttons
        const hoverTargets = 'a, button, input, textarea, select, .color-dot, .skill-badge, .filter-btn, .tab-btn, .project-card-new, .education-card, .achievement-card';
        const addHoverEffects = () => {
            document.querySelectorAll(hoverTargets).forEach(elem => {
                // Prevent duplicate listeners
                if (elem.dataset.cursorBound) return;
                elem.dataset.cursorBound = 'true';
                
                elem.addEventListener('mouseenter', () => {
                    cursorDot.classList.add('hovered');
                    cursorRing.classList.add('hovered');
                });
                elem.addEventListener('mouseleave', () => {
                    cursorDot.classList.remove('hovered');
                    cursorRing.classList.remove('hovered');
                });
            });
        };
        addHoverEffects();
        
        // Observe DOM mutations to bind new elements (like terminal outputs)
        const observer = new MutationObserver(addHoverEffects);
        observer.observe(document.body, { childList: true, subtree: true });
    } else {
        // Hide custom cursors on touch screens
        if (cursorDot) cursorDot.style.display = 'none';
        if (cursorRing) cursorRing.style.display = 'none';
    }

    /* ==========================================================================
       NAVIGATION & MOBILE BURGER MENU
       ========================================================================== */
    const header = document.querySelector('.header');
    const mobileNavToggle = document.querySelector('.mobile-nav-toggle');
    const mobileNavOverlay = document.querySelector('.mobile-nav-overlay');
    const mobileNavLinks = document.querySelectorAll('.mobile-nav-link');
    
    // Header background change on scroll
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });
    
    // Mobile navigation toggle
    if (mobileNavToggle && mobileNavOverlay) {
        mobileNavToggle.addEventListener('click', () => {
            const isOpen = mobileNavOverlay.classList.toggle('open');
            mobileNavToggle.classList.toggle('active');
            
            // Animate hamburger lines
            const bars = mobileNavToggle.querySelectorAll('.bar');
            if (isOpen) {
                document.body.style.overflow = 'hidden'; // Lock scrolling
                bars[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
                bars[1].style.opacity = '0';
                bars[2].style.transform = 'rotate(-45deg) translate(6px, -6px)';
            } else {
                document.body.style.overflow = ''; // Unlock scrolling
                bars[0].style.transform = 'none';
                bars[1].style.opacity = '1';
                bars[2].style.transform = 'none';
            }
        });
        
        // Close menu on nav item click
        mobileNavLinks.forEach(link => {
            link.addEventListener('click', () => {
                mobileNavOverlay.classList.remove('open');
                document.body.style.overflow = '';
                
                const bars = mobileNavToggle.querySelectorAll('.bar');
                bars[0].style.transform = 'none';
                bars[1].style.opacity = '1';
                bars[2].style.transform = 'none';
            });
        });
    }

    /* ==========================================================================
       LIGHT / DARK THEME TOGGLE
       ========================================================================== */
    const themeToggle = document.getElementById('theme-toggle');
    const currentTheme = localStorage.getItem('theme');
    
    if (currentTheme === 'dark') {
        document.body.classList.add('dark-theme');
        if (themeToggle) {
            themeToggle.innerHTML = '<i class="fa-solid fa-sun"></i>';
        }
    } else {
        document.body.classList.remove('dark-theme');
        if (themeToggle) {
            themeToggle.innerHTML = '<i class="fa-solid fa-moon"></i>';
        }
    }
    
    if (themeToggle) {
        themeToggle.addEventListener('click', () => {
            document.body.classList.toggle('dark-theme');
            let theme = 'light';
            if (document.body.classList.contains('dark-theme')) {
                theme = 'dark';
                themeToggle.innerHTML = '<i class="fa-solid fa-sun"></i>';
            } else {
                themeToggle.innerHTML = '<i class="fa-solid fa-moon"></i>';
            }
            localStorage.setItem('theme', theme);
        });
    }

    /* ==========================================================================
       ACTIVE NAV ITEM INDICATOR (SCROLL SPY)
       ========================================================================== */
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link');
    
    const activeNavObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const id = entry.target.getAttribute('id');
                navLinks.forEach(link => {
                    if (link.getAttribute('href') === `#${id}`) {
                        link.classList.add('active');
                    } else {
                        link.classList.remove('active');
                    }
                });
            }
        });
    }, {
        rootMargin: '-30% 0px -60% 0px' // Trigger active state when section occupies mid viewport
    });
    
    sections.forEach(section => activeNavObserver.observe(section));

    /* ==========================================================================
       SCROLL REVEAL ANIMATIONS
       ========================================================================== */
    const revealItems = document.querySelectorAll('.scroll-reveal');
    
    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('revealed');
                revealObserver.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.05,
        rootMargin: '0px 0px -40px 0px'
    });
    
    revealItems.forEach(item => revealObserver.observe(item));

    /* ==========================================================================
       INTERACTIVE TABS
       ========================================================================== */
    const tabBtns = document.querySelectorAll('.tab-btn');
    const tabPanels = document.querySelectorAll('.tab-panel');
    
    tabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // Remove active classes
            tabBtns.forEach(b => b.classList.remove('active'));
            tabPanels.forEach(p => p.classList.remove('active'));
            
            // Add active class to clicked button
            btn.classList.add('active');
            
            // Show corresponding panel
            const tabId = btn.getAttribute('data-tab');
            const targetPanel = document.getElementById(`panel-${tabId}`);
            if (targetPanel) {
                targetPanel.classList.add('active');
            }
        });
    });

    /* ==========================================================================
       INTERACTIVE TERMINAL DRAWER CONTROLS
       ========================================================================== */
    const terminalDrawer = document.getElementById('terminal-drawer');
    const openTerminalBtn = document.getElementById('open-terminal-btn');
    const closeTerminalBtn = document.getElementById('close-terminal-btn');
    const terminalBody = document.getElementById('terminal-body');
    const terminalInput = document.getElementById('terminal-input');
    
    if (openTerminalBtn && terminalDrawer) {
        openTerminalBtn.addEventListener('click', () => {
            terminalDrawer.style.display = 'flex';
            document.body.classList.add('terminal-active');
            setTimeout(() => {
                if (terminalInput) terminalInput.focus();
            }, 100);
        });
    }
    
    if (closeTerminalBtn && terminalDrawer) {
        closeTerminalBtn.addEventListener('click', () => {
            terminalDrawer.style.display = 'none';
            document.body.classList.remove('terminal-active');
        });
        
        // Close on clicking outside terminal window
        terminalDrawer.addEventListener('click', (e) => {
            if (e.target === terminalDrawer) {
                terminalDrawer.style.display = 'none';
                document.body.classList.remove('terminal-active');
            }
        });
    }
    
    if (terminalInput && terminalBody) {
        // Focus input on console wrapper click
        const terminalWindow = terminalBody.parentElement;
        terminalWindow.addEventListener('click', (e) => {
            if (e.target !== closeTerminalBtn && !closeTerminalBtn.contains(e.target)) {
                terminalInput.focus();
            }
        });
        
        terminalInput.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                const rawCommand = terminalInput.value;
                const command = rawCommand.trim().toLowerCase();
                
                terminalInput.value = '';
                executeTerminalCommand(command, rawCommand);
            }
        });
    }
    
    const executeTerminalCommand = (cmd, rawCmd) => {
        // Echo prompt
        appendTerminalLine(`<span class="terminal-prompt" style="color: var(--accent); font-weight: 600;">ganesh@portfolio:~$</span> ${escapeHTML(rawCmd)}`);
        
        if (cmd === '') {
            scrollTerminalToBottom();
            return;
        }
        
        switch (cmd) {
            case 'help':
                appendTerminalLine(`
                    <div style="margin-top: 5px; margin-bottom: 5px; line-height: 1.6;">
                        Available commands:<br>
                        - <span class="text-accent">about</span>      : Display bio and education overview.<br>
                        - <span class="text-accent">skills</span>     : List programming languages and tech stacks.<br>
                        - <span class="text-accent">projects</span>   : View featured portfolio projects.<br>
                        - <span class="text-accent">contact</span>    : Print professional mail and profiles.<br>
                        - <span class="text-accent">matrix</span>     : Run digital screen matrix effect.<br>
                        - <span class="text-accent">clear</span>      : Clear the screen logs.<br>
                        - <span class="text-accent">exit</span>       : Close the terminal emulator console.
                    </div>
                `);
                break;
            case 'matrix':
            case 'rain':
                triggerMatrixRain();
                break;
            case 'about':
                appendTerminalLine(`
                    <div style="margin-top: 5px; margin-bottom: 5px; line-height: 1.6;">
                        <span class="text-accent" style="font-weight: 600;">Ganesh Padakandla - Full Stack Developer</span><br>
                        B.Tech CSE (AI & ML) student graduating in 2027 from Lakireddy Bali Reddy College of Engineering.<br>
                        Active developer with robust foundations in Java, Python, and JavaScript, building scalable MERN & FastAPI applications.
                    </div>
                `);
                break;
            case 'skills':
                appendTerminalLine(`
                    <div style="margin-top: 5px; margin-bottom: 5px; line-height: 1.6;">
                        • Languages: Java, Python, JavaScript, SQL<br>
                        • Frameworks: React.js, Node.js, Express, HTML/CSS<br>
                        • AI/ML Tools: LangChain, Hugging Face, PyTorch, Transformers, OpenAI RAG<br>
                        • Databases: MySQL, SQL<br>
                        • Tools: Git, GitHub, Cursor, VS Code, Antigravity, LaTeX
                    </div>
                `);
                break;
            case 'projects':
                appendTerminalLine(`
                    <div style="margin-top: 5px; margin-bottom: 5px; line-height: 1.6;">
                        1. <span class="text-accent" style="font-weight:600;">ServiceConnect</span>: Local Service Marketplace built via MERN stack, Socket.io, and JWT.<br>
                        2. <span class="text-accent" style="font-weight:600;">Hallucination Detection & Correction</span>: AI verification pipeline using NLI and RAG algorithms on LLMs.
                    </div>
                `);
                break;
            case 'contact':
                appendTerminalLine(`
                    <div style="margin-top: 5px; margin-bottom: 5px; line-height: 1.6;">
                        • Email   : <a href="mailto:padakandlaganesh123@gmail.com" class="text-accent" style="text-decoration: underline;">padakandlaganesh123@gmail.com</a><br>
                        • Phone   : +91 9908397242<br>
                        • GitHub  : <a href="https://github.com/padakandlaganesh" target="_blank" class="text-accent" style="text-decoration: underline;">github.com/padakandlaganesh</a><br>
                        • LinkedIn: <a href="https://linkedin.com/in/ganesh-padakandla" target="_blank" class="text-accent" style="text-decoration: underline;">linkedin.com/in/ganesh-padakandla</a>
                    </div>
                `);
                break;
            case 'exit':
                terminalDrawer.style.display = 'none';
                document.body.classList.remove('terminal-active');
                break;
            case 'clear':
                const inputLineHtml = `
                    <span class="terminal-prompt" style="color: var(--accent); font-weight: 600;">ganesh@portfolio:~$</span>
                    <input type="text" id="terminal-input" autocomplete="off" style="background: transparent; border: none; outline: none; color: #fff; font-family: inherit; font-size: inherit; flex-grow: 1;">
                `;
                terminalBody.innerHTML = `
                    <div class="terminal-line">Terminal screen cleared. Welcome to Ganesh's Console (v1.0.0)</div>
                    <div class="terminal-line text-muted">Type <span class="text-accent">help</span> for commands.</div>
                    <div class="terminal-line terminal-input-line" style="display: flex; align-items: center; gap: 8px;">${inputLineHtml}</div>
                `;
                
                const newTerminalInput = document.getElementById('terminal-input');
                newTerminalInput.addEventListener('keydown', (e) => {
                    if (e.key === 'Enter') {
                        const newRawCmd = newTerminalInput.value;
                        const newCmd = newRawCmd.trim().toLowerCase();
                        newTerminalInput.value = '';
                        executeTerminalCommand(newCmd, newRawCmd);
                    }
                });
                newTerminalInput.focus();
                return;
            default:
                appendTerminalLine(`bash: command not found: <span style="color: #ff5f56;">${escapeHTML(cmd)}</span>. Type <span class="text-accent">help</span> for commands.`);
        }
        
        scrollTerminalToBottom();
    };
    
    const appendTerminalLine = (htmlContent) => {
        const lineDiv = document.createElement('div');
        lineDiv.className = 'terminal-line';
        lineDiv.innerHTML = htmlContent;
        
        const inputLine = terminalBody.querySelector('.terminal-input-line');
        terminalBody.insertBefore(lineDiv, inputLine);
    };
    
    const scrollTerminalToBottom = () => {
        terminalBody.scrollTop = terminalBody.scrollHeight;
    };
    
    const escapeHTML = (text) => {
        return text
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#039;');
    };

    /* ==========================================================================
       CONTACT FORM SUBMIT VALIDATION
       ========================================================================== */
    const contactForm = document.getElementById('portfolio-contact-form');
    const formResponse = document.getElementById('form-response-message');
    
    if (contactForm && formResponse) {
        contactForm.addEventListener('submit', (e) => {
            // Let the form naturally submit via mailto, but show a success status locally
            // Alternatively, we can use client validation and alert the user.
            formResponse.textContent = '';
            formResponse.className = 'form-response-new';
            
            // Validate basic inputs
            const nameVal = document.getElementById('form-name').value;
            const emailVal = document.getElementById('form-email').value;
            
            if (!nameVal || !emailVal) {
                e.preventDefault();
                formResponse.textContent = 'Please fill out all required fields.';
                formResponse.classList.add('error');
                return;
            }
            
            formResponse.textContent = 'Opening your email client to send the message...';
            formResponse.classList.add('success');
            
            setTimeout(() => {
                formResponse.style.opacity = '0';
                setTimeout(() => {
                    formResponse.textContent = '';
                    formResponse.className = 'form-response-new';
                    formResponse.style.opacity = '1';
                }, 400);
            }, 6000);
        });
    }

    /* ==========================================================================
       BACK TO TOP BUTTON
       ========================================================================== */
    const scrollTopBtn = document.getElementById('scroll-top-btn');
    
    if (scrollTopBtn) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 400) {
                scrollTopBtn.style.opacity = '1';
                scrollTopBtn.style.visibility = 'visible';
                scrollTopBtn.style.transform = 'translateY(0)';
            } else {
                scrollTopBtn.style.opacity = '0';
                scrollTopBtn.style.visibility = 'hidden';
                scrollTopBtn.style.transform = 'translateY(15px)';
            }
        });
        
        scrollTopBtn.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
        
        // Initial button configuration
        scrollTopBtn.style.opacity = '0';
        scrollTopBtn.style.visibility = 'hidden';
        scrollTopBtn.style.transform = 'translateY(15px)';
        scrollTopBtn.style.transition = 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)';
    }

    /* ==========================================================================
       SPECIAL EFFECTS IMPLEMENTATION
       ========================================================================== */

    // 1. Scroll Progress Bar
    const scrollProgress = document.getElementById('scroll-progress');
    if (scrollProgress) {
        window.addEventListener('scroll', () => {
            const winScroll = document.documentElement.scrollTop || document.body.scrollTop;
            const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
            const scrolled = height > 0 ? (winScroll / height) * 100 : 0;
            scrollProgress.style.width = scrolled + '%';
        });
    }

    // 2. Custom Cursor Particle Trail Spawner
    function createCursorParticle(x, y) {
        const particle = document.createElement('div');
        particle.className = 'cursor-particle';
        particle.style.left = `${x}px`;
        particle.style.top = `${y}px`;
        
        const size = Math.random() * 6 + 4;
        particle.style.width = `${size}px`;
        particle.style.height = `${size}px`;
        
        document.body.appendChild(particle);
        
        setTimeout(() => {
            particle.style.opacity = '0';
            particle.style.transform = 'translate(-50%, -50%) scale(0.1)';
        }, 50);
        
        setTimeout(() => {
            particle.remove();
        }, 600);
    }

    // 3. Magnetic Hover Attraction
    const magneticElements = document.querySelectorAll('.btn-neo, .theme-toggle-btn, .scroll-top-btn-new, .find-icon, .logo-wrap');
    if (isDesktop) {
        magneticElements.forEach(elem => {
            elem.addEventListener('mousemove', (e) => {
                const rect = elem.getBoundingClientRect();
                const x = e.clientX - rect.left - rect.width / 2;
                const y = e.clientY - rect.top - rect.height / 2;
                elem.style.transform = `translate(${x * 0.35}px, ${y * 0.35}px)`;
            });
            elem.addEventListener('mouseleave', () => {
                elem.style.transform = 'translate(0px, 0px)';
            });
        });
    }

    // 4. Hero Typewriter Title loop
    const words = ["Full Stack Developer", "AI/ML CSE Student"];
    let wordIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    const typewriterText = document.getElementById('typewriter-text');
    
    function type() {
        const currentWord = words[wordIndex];
        if (isDeleting) {
            charIndex--;
        } else {
            charIndex++;
        }
        
        if (typewriterText) {
            typewriterText.textContent = currentWord.substring(0, charIndex);
        }
        
        let typeSpeed = isDeleting ? 40 : 80;
        
        if (!isDeleting && charIndex === currentWord.length) {
            typeSpeed = 1500;
            isDeleting = true;
        } else if (isDeleting && charIndex === 0) {
            isDeleting = false;
            wordIndex = (wordIndex + 1) % words.length;
            typeSpeed = 400;
        }
        
        setTimeout(type, typeSpeed);
    }
    if (typewriterText) {
        setTimeout(type, 1000);
    }

    // 5. Interactive Particle Background Canvas
    const canvas = document.getElementById('hero-particles');
    if (canvas) {
        const ctx = canvas.getContext('2d');
        let particles = [];
        let particleCount = 60;
        
        const resizeCanvas = () => {
            canvas.width = canvas.parentElement.offsetWidth;
            canvas.height = canvas.parentElement.offsetHeight;
        };
        resizeCanvas();
        window.addEventListener('resize', resizeCanvas);
        
        class Particle {
            constructor() {
                this.reset();
            }
            reset() {
                this.x = Math.random() * canvas.width;
                this.y = Math.random() * canvas.height;
                this.size = Math.random() * 2.5 + 0.5;
                this.speedX = Math.random() * 0.6 - 0.3;
                this.speedY = Math.random() * 0.6 - 0.3;
                this.alpha = Math.random() * 0.5 + 0.2;
            }
            update() {
                this.x += this.speedX;
                this.y += this.speedY;
                
                if (this.x < 0 || this.x > canvas.width) this.speedX *= -1;
                if (this.y < 0 || this.y > canvas.height) this.speedY *= -1;
                
                if (this.x < -10 || this.x > canvas.width + 10 || this.y < -10 || this.y > canvas.height + 10) {
                    this.reset();
                }
            }
            draw() {
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
                const isDark = document.body.classList.contains('dark-theme');
                ctx.fillStyle = isDark ? `rgba(0, 223, 130, ${this.alpha})` : `rgba(0, 223, 130, ${this.alpha * 0.7})`;
                ctx.fill();
            }
        }
        
        for (let i = 0; i < particleCount; i++) {
            particles.push(new Particle());
        }
        
        const animateParticles = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            
            for (let i = 0; i < particles.length; i++) {
                particles[i].update();
                particles[i].draw();
                
                for (let j = i + 1; j < particles.length; j++) {
                    const dx = particles[i].x - particles[j].x;
                    const dy = particles[i].y - particles[j].y;
                    const dist = Math.sqrt(dx * dx + dy * dy);
                    
                    if (dist < 100) {
                        ctx.beginPath();
                        ctx.moveTo(particles[i].x, particles[i].y);
                        ctx.lineTo(particles[j].x, particles[j].y);
                        const alpha = (1 - dist / 100) * 0.12;
                        ctx.strokeStyle = `rgba(0, 223, 130, ${alpha})`;
                        ctx.lineWidth = 0.8;
                        ctx.stroke();
                    }
                }
                
                if (isDesktop && mouseX && mouseY) {
                    const rect = canvas.getBoundingClientRect();
                    const canvasMouseX = mouseX - rect.left;
                    const canvasMouseY = mouseY - rect.top;
                    
                    const dx = particles[i].x - canvasMouseX;
                    const dy = particles[i].y - canvasMouseY;
                    const dist = Math.sqrt(dx * dx + dy * dy);
                    
                    if (dist < 150) {
                        ctx.beginPath();
                        ctx.moveTo(particles[i].x, particles[i].y);
                        ctx.lineTo(canvasMouseX, canvasMouseY);
                        const alpha = (1 - dist / 150) * 0.25;
                        ctx.strokeStyle = `rgba(0, 223, 130, ${alpha})`;
                        ctx.lineWidth = 1;
                        ctx.stroke();
                    }
                }
            }
            requestAnimationFrame(animateParticles);
        };
        animateParticles();
    }


    // 7. Matrix Easter Egg Screen Rain in Terminal
    function triggerMatrixRain() {
        const existingCanvas = terminalBody.querySelector('.matrix-canvas');
        if (existingCanvas) existingCanvas.remove();
        
        const matrixCanvas = document.createElement('canvas');
        matrixCanvas.className = 'matrix-canvas';
        terminalBody.appendChild(matrixCanvas);
        
        matrixCanvas.width = terminalBody.clientWidth;
        matrixCanvas.height = terminalBody.clientHeight;
        
        const mCtx = matrixCanvas.getContext('2d');
        const katakana = "ｱｲｳｴｵｶｷｸｹｺｻｼｽｾｿﾀﾁﾂﾃﾄﾅﾆﾇﾈﾉﾊﾋﾌﾍﾎﾏﾐﾑﾒﾓﾔﾕﾖﾗﾘﾙﾚﾛﾜﾝ1234567890ABCDEFGHIJKLMNOPQRSTUVWXYZ";
        const alphabet = katakana.split("");
        
        const fontSize = 14;
        const columns = matrixCanvas.width / fontSize;
        
        const rainDrops = [];
        for (let x = 0; x < columns; x++) {
            rainDrops[x] = 1;
        }
        
        let animationFrameId;
        
        const drawRain = () => {
            mCtx.fillStyle = 'rgba(8, 8, 10, 0.08)';
            mCtx.fillRect(0, 0, matrixCanvas.width, matrixCanvas.height);
            
            mCtx.fillStyle = '#00df82';
            mCtx.font = fontSize + 'px monospace';
            
            for (let i = 0; i < rainDrops.length; i++) {
                const text = alphabet[Math.floor(Math.random() * alphabet.length)];
                mCtx.fillText(text, i * fontSize, rainDrops[i] * fontSize);
                
                if (rainDrops[i] * fontSize > matrixCanvas.height && Math.random() > 0.975) {
                    rainDrops[i] = 0;
                }
                rainDrops[i]++;
            }
        };
        
        const runMatrix = () => {
            drawRain();
            animationFrameId = requestAnimationFrame(runMatrix);
        };
        runMatrix();
        
        appendTerminalLine(`
            <div style="color: var(--accent); margin-top: 5px; margin-bottom: 5px;">
                Matrix digital rain activated! Press <span class="text-accent" style="cursor: pointer; text-decoration: underline;" id="stop-matrix-btn">here</span> or click anywhere to exit.
            </div>
        `);
        
        const stopMatrix = () => {
            cancelAnimationFrame(animationFrameId);
            matrixCanvas.remove();
            document.removeEventListener('click', stopMatrixOnClick);
        };
        
        const stopMatrixOnClick = (e) => {
            if (e.target.id === 'stop-matrix-btn' || matrixCanvas.contains(e.target) || e.target === matrixCanvas) {
                stopMatrix();
            }
        };
        
        document.addEventListener('click', stopMatrixOnClick);
    }

});
