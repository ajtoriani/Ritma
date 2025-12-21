const DATA = {
    getGreeting: () => {
        const h = new Date().getHours();
        if (h < 12) return "Bom dia";
        if (h < 18) return "Boa tarde";
        return "Boa noite";
    },
    tasks: {
        baixa: [
            { id: 'b1', text: "Hidrate-se", desc: "Beba água. Tempo sugerido: 2 min", icon: "drop", time: 2 },
            { id: 'b2', text: "Micro-ordem", desc: "Arrume a mesa. Tempo: 5 min", icon: "desktop", time: 5 },
            { id: 'b3', text: "Respire", desc: "Pausa consciente. Tempo: 3 min", icon: "wind", time: 3 }
        ],
        moderada: [
            { id: 'm1', text: "Responder E-mails", desc: "Limpe a caixa de entrada.", icon: "tray", time: 15 },
            { id: 'm2', text: "Revisão Rápida", desc: "Planeje o dia seguinte.", icon: "list-checks", time: 10 },
            { id: 'm3', text: "Leitura Técnica", desc: "Leia um artigo da área.", icon: "article", time: 20 }
        ],
        alta: [
            { id: 'a1', text: "Deep Work", desc: "Foco total na tarefa difícil.", icon: "lightning", time: 45 },
            { id: 'a2', text: "Estudo Prático", desc: "Codar ou desenhar telas.", icon: "code", time: 50 },
            { id: 'a3', text: "Projeto Pessoal", desc: "Avançar no portfólio.", icon: "rocket", time: 60 }
        ]
    }
};

const Store = {
    state: {
        energy: null,
        queue: [],
        completedIds: [],
        theme: 'light',
        streak: 0,
        lastLoginDate: null
    },
    timer: null,
    timeLeft: 0,
    isAudioPlaying: false,

    init() {
        const saved = localStorage.getItem('ritma_prod_v3');
        if (saved) {
            this.state = { ...this.state, ...JSON.parse(saved) };
        }
        
        this.checkStreak();
        this.applyTheme();
        UI.render();
        UI.updateHeader(); 
    },

    save() {
        localStorage.setItem('ritma_prod_v3', JSON.stringify(this.state));
        UI.updateHeader(); 
    },

    checkStreak() {
        const today = new Date().toDateString();
        const last = this.state.lastLoginDate;

        if (last !== today) {
            const yesterday = new Date();
            yesterday.setDate(yesterday.getDate() - 1);
            
            if (last === yesterday.toDateString()) {
                this.state.streak += 1;
            } else {
                this.state.streak = 1; 
            }
            this.state.lastLoginDate = today;
            this.save();
        }
    },

    toggleTheme() {
        this.state.theme = this.state.theme === 'light' ? 'dark' : 'light';
        this.applyTheme();
        this.save();
    },

    applyTheme() {
        const body = document.body;
        const btnIcon = document.querySelector('#btn-theme i');
        
        if (this.state.theme === 'dark') {
            body.classList.add('dark');
            if(btnIcon) btnIcon.className = 'ph ph-sun';
        } else {
            body.classList.remove('dark');
            if(btnIcon) btnIcon.className = 'ph ph-moon';
        }
    },

    setEnergy(level) {
        this.state.energy = level;
        if (this.state.queue.length === 0) {
            this.state.queue = [...DATA.tasks[level]];
            this.state.completedIds = [];
        }
        this.save();
        UI.render(); 
    },

    addTask(text) {
        if (!text.trim()) return;
        const newTask = {
            id: 'custom-' + Date.now(),
            text: text,
            desc: "Tarefa personalizada",
            icon: "check-circle", 
            time: 25 
        };
        this.state.queue.push(newTask);
        this.save();
        UI.render();
    },

    startFocus(minutes, displayElement) {
        const audio = document.getElementById('audio-focus');
        
        if (this.isAudioPlaying) {
            this.stopFocus();
            return;
        }

        this.isAudioPlaying = true;
        this.timeLeft = minutes * 60; 
        
        if(audio) {
            audio.volume = 0.5;
            audio.play().catch(console.error);
        }

        this.timer = setInterval(() => {
            this.timeLeft--;
            
            const m = Math.floor(this.timeLeft / 60).toString().padStart(2, '0');
            const s = (this.timeLeft % 60).toString().padStart(2, '0');
            displayElement.textContent = `${m}:${s}`;
            
            document.title = `${m}:${s} - Focando...`;

            if (this.timeLeft <= 0) {
                this.stopFocus();
                displayElement.textContent = "00:00";
                this.completeTask(null); 
                alert("Tempo acabou!");
            }
        }, 1000);
    },

    stopFocus() {
        clearInterval(this.timer);
        this.isAudioPlaying = false;
        document.title = "Ritma"; 
        const audio = document.getElementById('audio-focus');
        if(audio) {
            audio.pause();
            audio.currentTime = 0;
        }
        UI.updatePlayButton(false);
    },

    completeTask(taskId) {
        this.stopFocus(); 
        
        const audioDone = document.getElementById('audio-done');
        if(audioDone) { 
            audioDone.volume = 1.0; 
            audioDone.play().catch(console.error); 
        }

        if (taskId && !this.state.completedIds.includes(taskId)) {
            this.state.completedIds.push(taskId);
            setTimeout(() => {
                this.save();
                UI.render(); 
            }, 1000); 
        }
    },

    reset() {
        if(confirm('Iniciar novo ciclo?')) {
            this.stopFocus();
            this.state.energy = null;
            this.state.queue = [];
            this.state.completedIds = [];
            this.save();
            UI.render();
        }
    }
};

const UI = {
    app: document.getElementById('app'),

    updateHeader() {
        const streakEl = document.getElementById('streak-display');
        if (streakEl) {
            streakEl.innerHTML = `<i class="ph-fill ph-fire"></i> ${Store.state.streak} dias`;
            streakEl.classList.remove('hidden');
        }
        
        const btnIcon = document.querySelector('#btn-theme i');
        if(btnIcon) {
            btnIcon.className = Store.state.theme === 'dark' ? 'ph ph-sun' : 'ph ph-moon';
        }
    },

    render() {
        this.app.innerHTML = '';
        if (!Store.state.energy) {
            this.renderCheckIn();
        } else {
            this.renderDashboard();
        }
    },

    renderCheckIn() {
        const template = document.getElementById('tpl-checkin');
        const clone = template.content.cloneNode(true);
        const list = clone.getElementById('energy-options-container');

        const options = [
            { id: 'baixa', label: 'Baixa', icon: 'battery-low' },
            { id: 'moderada', label: 'Moderada', icon: 'battery-medium' },
            { id: 'alta', label: 'Alta', icon: 'battery-high' },
        ];

        options.forEach(opt => {
            const btn = document.createElement('button');
            btn.className = 'energy-card stagger-item';
            btn.onclick = () => Store.setEnergy(opt.id);
            btn.innerHTML = `
                <div class="energy-icon-box"><i class="ph ph-${opt.icon}"></i></div>
                <span class="energy-label">${opt.label}</span>
            `;
            list.appendChild(btn);
        });
        this.app.appendChild(clone);
    },

    renderDashboard() {
        const { queue, completedIds } = Store.state;
        const pending = queue.filter(t => !completedIds.includes(t.id));
        const isFinished = pending.length === 0;

        const template = document.getElementById('tpl-dashboard');
        const clone = template.content.cloneNode(true);

        const total = queue.length;
        const done = completedIds.length;
        const pct = total === 0 ? 0 : (done / total) * 100;
        
        clone.getElementById('greeting').textContent = DATA.getGreeting();
        clone.getElementById('counter').textContent = `${done}/${total}`;
        setTimeout(() => {
            const bar = document.getElementById('progress-bar');
            if(bar) bar.style.width = `${pct}%`;
        }, 50);

        const heroArea = clone.getElementById('hero-area');
        const nextList = clone.getElementById('next-list-area');
        const emptyState = clone.getElementById('empty-state');

        if (isFinished) {
            heroArea.classList.add('hidden');
            nextList.classList.add('hidden');
            emptyState.classList.remove('hidden');
            clone.getElementById('btn-reset').onclick = () => Store.reset();
            this.app.appendChild(clone);
            return;
        }

        const task = pending[0];
        const taskTime = task.time || 25;

        const hero = document.createElement('div');
        hero.className = 'hero-card stagger-item';
        hero.innerHTML = `
            <i class="ph ph-${task.icon} hero-icon"></i>
            <h2 class="hero-title">${task.text}</h2>
            <p class="hero-desc">${task.desc}</p>
            <div id="timer-display" class="timer-display">${taskTime}:00</div>
            <div class="timer-controls">
                <button id="btn-focus" class="btn-secondary"><i class="ph ph-play"></i> Focar</button>
                <button id="btn-complete" class="btn-primary"><i class="ph ph-check"></i> Feito</button>
            </div>
        `;

        const btnFocus = hero.querySelector('#btn-focus');
        const display = hero.querySelector('#timer-display');
        
        btnFocus.onclick = () => {
            Store.startFocus(taskTime, display);
            UI.updatePlayButton(Store.isAudioPlaying);
        };

        const btnComplete = hero.querySelector('#btn-complete');
        btnComplete.onclick = function() {
            this.classList.add('success');
            this.textContent = "Ótimo trabalho!";
            Store.completeTask(task.id);
        };

        heroArea.appendChild(hero);

        const input = clone.getElementById('new-task-input');
        const btnAdd = clone.getElementById('btn-add-task');
        
        const handleAdd = () => {
            Store.addTask(input.value);
            input.value = '';
        };

        btnAdd.onclick = handleAdd;
        input.onkeypress = (e) => {
            if(e.key === 'Enter') handleAdd();
        };

        const nextTasks = pending.slice(1);
        const listContainer = clone.getElementById('queue-list');
        
        if (nextTasks.length > 0) {
            nextTasks.forEach(t => {
                const row = document.createElement('div');
                row.className = 'task-row stagger-item';
                row.innerHTML = `<i class="ph ph-${t.icon}"></i><span>${t.text}</span> <span style="font-size:12px; margin-left:auto">${t.time || 25}m</span>`;
                listContainer.appendChild(row);
            });
        }

        this.app.appendChild(clone);
    },

    updatePlayButton(isPlaying) {
        const btn = document.getElementById('btn-focus');
        const display = document.getElementById('timer-display');
        
        if(!btn) return;

        if (isPlaying) {
            btn.innerHTML = `<i class="ph ph-pause"></i> Pausar`;
            btn.style.background = "#e0e7ff";
            if(Store.state.theme === 'dark') btn.style.background = "#312e81"; // Ajuste para dark mode
            
            display.classList.add('pulsing');
        } else {
            btn.innerHTML = `<i class="ph ph-play"></i> Focar`;
            btn.style.background = "var(--primary-soft)";
            display.classList.remove('pulsing');
        }
    }
};

document.getElementById('btn-theme').addEventListener('click', () => Store.toggleTheme());
document.getElementById('btn-settings').addEventListener('click', () => Store.reset());

Store.init();