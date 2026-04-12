const DATA = {
    getGreeting: () => {
        const h = new Date().getHours();
        if (h < 12) return "Bom dia";
        if (h < 18) return "Boa tarde";
        return "Boa noite";
    },
    sounds: {
        rain: "sounds/rain.mp3",
        lofi: "sounds/lofi.mp3",
        coffee: "sounds/coffee.mp3",
        white: "sounds/white.mp3",
        fire: "sounds/fire.mp3"
    },
    tasks: {
        baixa: [
            { id: 'b1', text: "Hidrate-se", desc: "2 min", icon: "drop", time: 2 },
            { id: 'b2', text: "Micro-ordem", desc: "5 min", icon: "desktop", time: 5 },
            { id: 'b3', text: "Respire", desc: "3 min", icon: "wind", time: 3 }
        ],
        moderada: [
            { id: 'm1', text: "E-mails", desc: "15 min", icon: "tray", time: 15 },
            { id: 'm2', text: "Planejamento", desc: "10 min", icon: "list-checks", time: 10 },
            { id: 'm3', text: "Leitura", desc: "20 min", icon: "article", time: 20 }
        ],
        alta: [
            { id: 'a1', text: "Deep Work", desc: "45 min", icon: "lightning", time: 45 },
            { id: 'a2', text: "Estudo", desc: "50 min", icon: "code", time: 50 },
            { id: 'a3', text: "Projeto", desc: "60 min", icon: "rocket", time: 60 }
        ]
    }
};

const Store = {
    state: {
        energy: null,
        queue: [],
        completedIds: [],
        completions: [], 
        historyLog: [], 
        theme: 'light',
        streak: 0,
        lastLoginDate: null,
        selectedSound: 'rain'
    },
    timer: null,
    timeLeft: 0,
    isAudioPlaying: false,

    init() {
        const saved = localStorage.getItem('ritma_v14_final'); 
        if (saved) {
            this.state = { ...this.state, ...JSON.parse(saved) };
            if (!this.state.completions) this.state.completions = [];
            if (!this.state.historyLog) this.state.historyLog = [];
        }
        
        this.checkNewDay();
        this.applyTheme();
        UI.init();
        UI.render();
    },

    save() {
        localStorage.setItem('ritma_v14_final', JSON.stringify(this.state));
    },

    checkNewDay() {
        const today = new Date().toDateString();
        const last = this.state.lastLoginDate;
        
        if (last !== today) {
            const yesterday = new Date();
            yesterday.setDate(yesterday.getDate() - 1);
            
            if (last === yesterday.toDateString()) {
                this.state.streak += 1;
            } else if (last) {
                this.state.streak = 1;
            } else {
                this.state.streak = 1; 
            }

            if (last) {
                this.state.energy = null;
                this.state.queue = [];
                this.state.completedIds = [];
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

    setSound(soundKey) {
        this.state.selectedSound = soundKey;
        const audio = document.getElementById('audio-focus');
        if (audio) {
            audio.src = DATA.sounds[soundKey];
            if (this.isAudioPlaying) audio.play().catch(console.error);
        }
        this.save();
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

    addTask(text, minutes) {
        if (!text.trim()) return;
        const timeValue = parseInt(minutes);
        const newTask = {
            id: 'custom-' + Date.now(),
            text: text,
            desc: `${timeValue} min`,
            icon: "check-circle", 
            time: timeValue 
        };
        this.state.queue.push(newTask);
        this.save();
        UI.render();
    },

    deleteTask(id) {
        if(confirm('Remover esta tarefa?')) {
            this.state.queue = this.state.queue.filter(t => t.id !== id);
            this.save();
            UI.render();
        }
    },

    setActiveTask(id) {
        const index = this.state.queue.findIndex(t => t.id === id);
        if (index > -1) {
            const task = this.state.queue.splice(index, 1)[0];
            this.state.queue.unshift(task);
            this.save();
            UI.render();
        }
    },

    reorderTasks(oldIndex, newIndex) {
        const pending = this.state.queue.filter(t => !this.state.completedIds.includes(t.id));
        const completed = this.state.queue.filter(t => this.state.completedIds.includes(t.id));
        const realOldIndex = oldIndex + 1;
        const realNewIndex = newIndex + 1;
        const [movedItem] = pending.splice(realOldIndex, 1);
        pending.splice(realNewIndex, 0, movedItem);
        this.state.queue = [...completed, ...pending];
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
            if(!audio.src) audio.src = DATA.sounds[this.state.selectedSound || 'rain'];
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
            }
        }, 1000);
    },

    stopFocus() {
        clearInterval(this.timer);
        this.isAudioPlaying = false;
        document.title = "Ritma"; 
        const audio = document.getElementById('audio-focus');
        if(audio) { audio.pause(); audio.currentTime = 0; }
        UI.updatePlayButton(false);
    },

    completeTask(taskId) {
        this.stopFocus(); 
        const audioDone = document.getElementById('audio-done');
        if(audioDone) { audioDone.volume = 1.0; audioDone.play().catch(console.error); }
        
        if(typeof confetti === 'function') {
            confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });
        }

        if (taskId && !this.state.completedIds.includes(taskId)) {
            const taskObj = this.state.queue.find(t => t.id === taskId);
            this.state.completedIds.push(taskId);
            this.state.completions.push(Date.now()); 
            
            if (taskObj) {
                this.state.historyLog.push({
                    text: taskObj.text,
                    time: taskObj.time || 25,
                    timestamp: Date.now()
                });
            }
            setTimeout(() => { this.save(); UI.render(); }, 1000); 
        }
    },

    getTotalFocusTime() {
        return this.state.historyLog.reduce((total, task) => total + (task.time || 25), 0);
    },

    getCurrentSessionFocusTime() {
        const completed = this.state.queue.filter(t => this.state.completedIds.includes(t.id));
        return completed.reduce((total, task) => total + (task.time || 25), 0);
    },

    getEnergyStats() {
        const completed = this.state.queue.filter(t => this.state.completedIds.includes(t.id));
        const stats = { alta: 0, moderada: 0, baixa: 0 };
        completed.forEach(task => {
            if (task.id.startsWith('a')) stats.alta++;
            else if (task.id.startsWith('m')) stats.moderada++;
            else if (task.id.startsWith('b')) stats.baixa++;
            else stats.alta++;
        });
        return stats;
    },

    getWeeklyStats() {
        const days = [0, 0, 0, 0, 0, 0, 0];
        const now = new Date();
        const oneWeekAgo = new Date();
        oneWeekAgo.setDate(now.getDate() - 7);

        this.state.completions.forEach(timestamp => {
            const date = new Date(timestamp);
            if (date > oneWeekAgo) {
                days[date.getDay()]++;
            }
        });
        return days;
    }
};

const UI = {
    app: document.getElementById('app'),
    currentPage: 'home',

    init() {
        document.getElementById('nav-home').onclick = () => this.switchPage('home');
        document.getElementById('nav-stats').onclick = () => this.switchPage('stats');
        document.getElementById('nav-calendar').onclick = () => this.switchPage('calendar');
    },

    switchPage(page) {
        this.currentPage = page;
        document.querySelectorAll('.nav-item').forEach(el => el.classList.remove('active'));
        if (page === 'home') document.getElementById('nav-home').classList.add('active');
        if (page === 'stats') document.getElementById('nav-stats').classList.add('active');
        if (page === 'calendar') document.getElementById('nav-calendar').classList.add('active');
        this.render();
    },

    render() {
        this.app.innerHTML = '';
        Store.checkNewDay();

        if (this.currentPage === 'home') {
            if (!Store.state.energy) {
                this.renderCheckIn();
            } else {
                this.renderDashboard();
            }
        } else if (this.currentPage === 'stats') {
            this.renderStats();
        } else if (this.currentPage === 'calendar') {
            this.renderCalendar();
        }
    },

    renderCheckIn() {
        const template = document.getElementById('tpl-checkin');
        const clone = template.content.cloneNode(true);
        const list = clone.getElementById('energy-options-container');
        const options = [
            { id: 'baixa', label: 'Baixa', icon: 'battery-low', theme: 'green' },
            { id: 'moderada', label: 'Moderada', icon: 'battery-medium', theme: 'orange' },
            { id: 'alta', label: 'Alta', icon: 'battery-high', theme: 'red' },
        ];
        options.forEach(opt => {
            const btn = document.createElement('button');
            btn.className = 'energy-card stagger-item';
            btn.onclick = () => Store.setEnergy(opt.id);
            btn.innerHTML = `
                <div class="stat-icon-box theme-${opt.theme}"><i class="ph-fill ph-${opt.icon}"></i></div>
                <span class="energy-label">${opt.label}</span>
            `;
            list.appendChild(btn);
        });
        this.app.appendChild(clone);
    },

    renderDashboard() {
        const { queue, completedIds, energy } = Store.state;
        const pending = queue.filter(t => !completedIds.includes(t.id));
        const template = document.getElementById('tpl-dashboard');
        const clone = template.content.cloneNode(true);

        clone.getElementById('greeting').textContent = DATA.getGreeting();
        clone.getElementById('date-display').textContent = new Date().toLocaleDateString('pt-BR', { weekday: 'short', day: 'numeric' });
        clone.getElementById('stat-energy').textContent = energy ? energy.charAt(0).toUpperCase() + energy.slice(1) : '-';
        
        const totalCount = pending.length + completedIds.length;
        clone.getElementById('stat-tasks').textContent = `${completedIds.length}/${totalCount}`;
        clone.getElementById('stat-streak').textContent = Store.state.streak;

        const sessionMinutes = Store.getCurrentSessionFocusTime();
        let timeString = `${sessionMinutes}m`;
        if (sessionMinutes >= 60) {
            const h = Math.floor(sessionMinutes / 60);
            const m = sessionMinutes % 60;
            timeString = `${h}h ${m > 0 ? m + 'm' : ''}`;
        }
        clone.getElementById('stat-focus-today').textContent = timeString;

        const heroArea = clone.getElementById('hero-area');
        const nextList = clone.getElementById('queue-list');
        const emptyState = clone.getElementById('empty-state');

        if (pending.length > 0) {
            heroArea.style.display = 'block';
            nextList.style.display = 'block';
            emptyState.classList.add('hidden');

            const task = pending[0];
            const taskTime = task.time || 25;
            
            const hero = document.createElement('div');
            hero.className = 'hero-card stagger-item';
            hero.innerHTML = `
                <div class="sound-selector-wrapper">
                    <i class="ph-fill ph-speaker-high"></i>
                    <select id="sound-select">
                        <option value="rain">Chuva</option>
                        <option value="lofi">Lo-Fi</option>
                        <option value="coffee">Café</option>
                        <option value="white">Ruído</option>
                        <option value="fire">Fogo</option>
                    </select>
                </div>
                <h2 class="hero-title">${task.text}</h2>
                <p class="hero-desc">${task.desc}</p>
                <div id="timer-display" class="timer-display">${taskTime}:00</div>
                <div class="timer-controls">
                    <button id="btn-focus" class="btn-white">Focar</button>
                    <button id="btn-complete" class="btn-glass"><i class="ph-bold ph-check"></i></button>
                </div>
            `;
            
            const soundSelect = hero.querySelector('#sound-select');
            soundSelect.value = Store.state.selectedSound;
            const audioEl = document.getElementById('audio-focus');
            if(audioEl) audioEl.src = DATA.sounds[soundSelect.value];
            soundSelect.onchange = (e) => Store.setSound(e.target.value);

            const btnFocus = hero.querySelector('#btn-focus');
            const display = hero.querySelector('#timer-display');
            btnFocus.onclick = () => {
                Store.startFocus(taskTime, display);
                UI.updatePlayButton(Store.isAudioPlaying);
            };
            const btnComplete = hero.querySelector('#btn-complete');
            btnComplete.onclick = () => Store.completeTask(task.id);

            heroArea.appendChild(hero);
            
            const nextTasks = pending.slice(1);
            nextList.innerHTML = '';
            if (nextTasks.length > 0) {
                nextTasks.forEach(t => {
                    const row = document.createElement('div');
                    row.className = 'task-row stagger-item';
                    
                    row.innerHTML = `
                        <i class="ph-bold ph-dots-six-vertical drag-handle" title="Segure para arrastar"></i>
                        <div class="task-content" title="Clique para focar nesta tarefa" style="display:flex; align-items:center; gap:8px; flex:1; cursor:pointer;">
                            <i class="ph-fill ph-circle" style="color: var(--primary)"></i>
                            <span>${t.text}</span> 
                        </div>
                        <span style="font-size:12px; opacity:0.5; margin-right:8px">${t.time}m</span>
                        <button class="btn-delete" data-id="${t.id}"><i class="ph ph-trash"></i></button>
                    `;
                    row.querySelector('.task-content').onclick = () => Store.setActiveTask(t.id);
                    row.querySelector('.btn-delete').onclick = () => Store.deleteTask(t.id);
                    nextList.appendChild(row);
                });
            }

        } else if (queue.length > 0 && pending.length === 0) {
            heroArea.style.display = 'none';
            nextList.style.display = 'none';
            emptyState.classList.remove('hidden');
        } else {
             heroArea.innerHTML = `<div class="hero-card"><h2 class="hero-title">Adicione uma tarefa</h2></div>`;
        }

        const input = clone.getElementById('new-task-input');
        const inputTime = clone.getElementById('new-task-time');
        const btnAdd = clone.getElementById('btn-add-task');
        
        const handleAdd = () => {
            if (!input.value.trim()) return;
            if (!inputTime.value) {
                alert('Por favor, defina o tempo em minutos para esta tarefa.');
                inputTime.focus();
                return;
            }
            Store.addTask(input.value, inputTime.value);
            input.value = ''; 
            inputTime.value = '';
        };

        btnAdd.onclick = handleAdd;
        input.onkeydown = (e) => { if(e.key === 'Enter') handleAdd(); };
        inputTime.onkeydown = (e) => { if(e.key === 'Enter') handleAdd(); };

        this.app.appendChild(clone);

        const listToDrag = document.getElementById('queue-list');
        if (listToDrag && pending.length > 1) {
            new Sortable(listToDrag, {
                handle: '.drag-handle', 
                animation: 150, 
                ghostClass: 'sortable-ghost', 
                delay: 200, 
                delayOnTouchOnly: true, 
                fallbackTolerance: 5, 
                onEnd: function (evt) {
                    if (evt.oldIndex !== evt.newIndex) {
                        Store.reorderTasks(evt.oldIndex, evt.newIndex);
                    }
                }
            });
        }
    },

    renderStats() {
        const template = document.getElementById('tpl-stats');
        const clone = template.content.cloneNode(true);
        
        const totalMinutes = Store.getTotalFocusTime();
        let timeString = `${totalMinutes}m`;
        if (totalMinutes >= 60) {
            const h = Math.floor(totalMinutes / 60);
            const m = totalMinutes % 60;
            timeString = `${h}h ${m > 0 ? m + 'm' : ''}`;
        }
        clone.getElementById('total-focus-time').textContent = timeString;

        const weeklyData = Store.getWeeklyStats();
        const maxVal = Math.max(...weeklyData) || 1;
        const daysLabels = ['D', 'S', 'T', 'Q', 'Q', 'S', 'S'];
        const todayIndex = new Date().getDay();

        const chartContainer = clone.getElementById('chart-bars-container');
        chartContainer.innerHTML = '';
        
        weeklyData.forEach((val, idx) => {
            const pct = (val / maxVal) * 100;
            const bar = document.createElement('div');
            bar.className = `bar ${idx === todayIndex ? 'active' : ''}`;
            bar.style.height = `${pct}%`;
            bar.setAttribute('data-day', daysLabels[idx]);
            chartContainer.appendChild(bar);
        });

        const stats = Store.getEnergyStats();
        const totalTasks = stats.alta + stats.moderada + stats.baixa || 1;
        const setBar = (type, value) => {
            const pct = (value / totalTasks) * 100;
            const bar = clone.getElementById(`bar-${type}`);
            const count = clone.getElementById(`count-${type}`);
            if(count) count.textContent = value;
            setTimeout(() => { if(bar) bar.style.width = `${pct}%`; }, 50);
        };
        setBar('alta', stats.alta);
        setBar('moderada', stats.moderada);
        setBar('baixa', stats.baixa);
        
        this.app.appendChild(clone);
    },

    renderCalendar() {
        const template = document.getElementById('tpl-calendar');
        const clone = template.content.cloneNode(true);
        
        const grid = clone.getElementById('calendar-grid');
        const selectedDateTasks = clone.getElementById('selected-date-tasks');

        const now = new Date();
        const year = now.getFullYear();
        const month = now.getMonth();

        clone.getElementById('calendar-month-year').textContent = now.toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' });

        const firstDayIndex = new Date(year, month, 1).getDay(); 
        const daysInMonth = new Date(year, month + 1, 0).getDate();

        const log = Store.state.historyLog || [];
        const tasksByDay = {};
        
        log.forEach(t => {
            const d = new Date(t.timestamp);
            if (d.getMonth() === month && d.getFullYear() === year) {
                const day = d.getDate();
                if (!tasksByDay[day]) tasksByDay[day] = [];
                tasksByDay[day].push(t);
            }
        });

        for (let i = 0; i < firstDayIndex; i++) {
            const div = document.createElement('div');
            div.className = 'calendar-day empty';
            grid.appendChild(div);
        }

        for (let day = 1; day <= daysInMonth; day++) {
            const div = document.createElement('div');
            div.className = 'calendar-day stagger-item';
            div.textContent = day;

            const hasTasks = tasksByDay[day] && tasksByDay[day].length > 0;
            if (hasTasks) {
                div.classList.add('has-tasks');
            }

            if (day === now.getDate()) {
                div.classList.add('today');
            }

            div.onclick = () => {
                grid.querySelectorAll('.calendar-day').forEach(el => el.classList.remove('active'));
                div.classList.add('active');

                selectedDateTasks.innerHTML = '';
                
                if (hasTasks) {
                    const h4 = document.createElement('h4');
                    h4.textContent = `Tarefas do dia ${day}:`;
                    selectedDateTasks.appendChild(h4);

                    tasksByDay[day].forEach(t => {
                        const row = document.createElement('div');
                        row.className = 'history-item-mini stagger-item';
                        row.innerHTML = `
                            <i class="ph-fill ph-check-circle" style="color: var(--icon-green); font-size: 18px;"></i>
                            <span style="flex:1; font-weight: 600; font-size: 14px;">${t.text}</span>
                            <span style="font-size:12px; font-weight: 700; color: var(--primary); background: var(--primary-soft); padding: 2px 8px; border-radius: 8px;">${t.time}m</span>
                        `;
                        selectedDateTasks.appendChild(row);
                    });
                } else {
                    selectedDateTasks.innerHTML = '<p style="text-align:center; color:var(--text-muted); font-size:14px; margin-top:20px;">Nenhuma tarefa neste dia. Aproveite o descanso!</p>';
                }
            };

            grid.appendChild(div);
        }

        this.app.appendChild(clone);
    },

    updatePlayButton(isPlaying) {
        const btn = document.getElementById('btn-focus');
        if(!btn) return;
        btn.textContent = isPlaying ? "Pausar" : "Focar";
        const display = document.getElementById('timer-display');
        if(isPlaying) display.classList.add('pulsing'); else display.classList.remove('pulsing');
    }
};

document.getElementById('btn-theme').addEventListener('click', () => Store.toggleTheme());
Store.init();