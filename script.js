// Научи повече + — Разширена образователна платформа
// ============================================

// 🌙 ТЕМНА/СВЕТЛА ТЕМА
const themeToggle = document.querySelector('[data-theme-toggle]');
if (themeToggle) {
  const savedTheme = localStorage.getItem('nauchi-theme') || 'light';
  document.documentElement.setAttribute('data-theme', savedTheme);
  themeToggle.textContent = savedTheme === 'light' ? '🌙' : '☀️';
  themeToggle.addEventListener('click', () => {
    const current = document.documentElement.getAttribute('data-theme') || 'light';
    const newTheme = current === 'light' ? 'dark' : 'light';
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('nauchi-theme', newTheme);
    themeToggle.textContent = newTheme === 'light' ? '🌙' : '☀️';
  });
}

// 📱 МЕНЮТО
const menuButton = document.querySelector('.menu-toggle');
const nav = document.querySelector('.nav');
if (menuButton && nav) {
  menuButton.addEventListener('click', () => {
    const isOpen = nav.classList.toggle('open');
    menuButton.setAttribute('aria-expanded', String(isOpen));
  });
}

// 🎮 СИСТЕМА ЗА ТОЧКИ, НИВА И ЗНАЧКИ (РАЗШИРЕНА)
class GameSystem {
  constructor() {
    this.data = JSON.parse(localStorage.getItem('nauchi-game') || '{"points":0,"level":0,"badges":[],"streak":0,"lastAnswered":{},"sessions":[],"achievements":{"perfectQuiz":false,"allBadges":false,"topScorer":false,"consistency":false},"quizHistory":[]}');
    this.leaderboard = JSON.parse(localStorage.getItem('nauchi-leaderboard') || '[]');
    this.updateUI();
  }
  
  addPoints(amount) {
    this.data.points += amount;
    this.data.level = Math.floor(this.data.points / 100);
    
    // Лидерборд
    this.updateLeaderboard();
    
    // Постижение за топ резултат
    if (this.data.points >= 500) {
      this.addAchievement('topScorer', '🏆 Топ резултат достигнут!');
    }
    
    this.saveData();
    this.updateUI();
  }
  
  addBadge(badge) {
    if (!this.data.badges.includes(badge)) {
      this.data.badges.push(badge);
      
      // Постижение за всички бейджове
      if (this.data.badges.length === 12) {
        this.addAchievement('allBadges', '🌟 Колекционер на бейджове!');
      }
      
      this.saveData();
      this.showBadgeNotification(badge);
    }
  }
  
  addAchievement(key, title) {
    if (!this.data.achievements[key]) {
      this.data.achievements[key] = true;
      this.showAchievementNotification(title);
      this.saveData();
    }
  }
  
  updateLeaderboard() {
    const playerName = localStorage.getItem('nauchi-name') || 'Аноним';
    const existingEntry = this.leaderboard.find(e => e.name === playerName);
    
    if (existingEntry) {
      existingEntry.points = Math.max(existingEntry.points, this.data.points);
      existingEntry.date = new Date().toISOString();
    } else {
      this.leaderboard.push({
        name: playerName,
        points: this.data.points,
        level: this.data.level,
        date: new Date().toISOString()
      });
    }
    
    this.leaderboard.sort((a, b) => b.points - a.points);
    this.leaderboard = this.leaderboard.slice(0, 10);
    localStorage.setItem('nauchi-leaderboard', JSON.stringify(this.leaderboard));
  }
  
  updateStreak() {
    this.data.streak++;
    if (this.data.streak >= 3 && !this.data.badges.includes('fire')) this.addBadge('fire');
    if (this.data.streak >= 10 && !this.data.badges.includes('master')) this.addBadge('master');
  }
  
  resetStreak() {
    this.data.streak = 0;
    this.saveData();
  }
  
  saveData() {
    localStorage.setItem('nauchi-game', JSON.stringify(this.data));
  }
  
  updateUI() {
    const badge = document.querySelector('.points-badge');
    if (badge) {
      const level = ['Любопитен', 'Изследовател', 'Учен', 'Нобелист'][Math.min(this.data.level, 3)];
      badge.innerHTML = `🏆 Ниво ${this.data.level + 1}: ${level}<br><small>${this.data.points} точки</small>`;
    }
  }
  
  showBadgeNotification(badge) {
    const badgeEmoji = { fire: '🔥', master: '👑', scientist: '🧬' };
    const msg = document.createElement('div');
    msg.className = 'badge-popup';
    msg.textContent = `${badgeEmoji[badge]} Спечели значка: ${badge}!`;
    document.body.appendChild(msg);
    setTimeout(() => msg.remove(), 3000);
  }
  
  showAchievementNotification(title) {
    const msg = document.createElement('div');
    msg.className = 'achievement-popup';
    msg.textContent = title;
    document.body.appendChild(msg);
    setTimeout(() => msg.remove(), 4000);
  }
  
  getStatistics() {
    return {
      totalPoints: this.data.points,
      level: this.data.level,
      badges: this.data.badges.length,
      quizzesTaken: this.data.quizHistory.length,
      achievements: Object.values(this.data.achievements).filter(Boolean).length,
      rank: this.leaderboard.findIndex(e => e.name === (localStorage.getItem('nauchi-name') || 'Аноним')) + 1
    };
  }
  
  exportResults() {
    const stats = this.getStatistics();
    const data = {
      player: localStorage.getItem('nauchi-name') || 'Аноним',
      date: new Date().toLocaleString('bg-BG'),
      statistics: stats,
      quizHistory: this.data.quizHistory,
      achievements: this.data.achievements,
      badges: this.data.badges
    };
    
    const csv = `Име: ${data.player}\nДата: ${data.date}\n\nСтатистика:\nОбщо точки: ${stats.totalPoints}\nНиво: ${stats.level}\nБейджове: ${stats.badges}\nПостижения: ${stats.achievements}\nРанк: ${stats.rank}`;
    
    const blob = new Blob([csv], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `biohizika-results-${new Date().toISOString().split('T')[0]}.txt`;
    a.click();
  }
}

const gameSystem = new GameSystem();

// 🎯 СИСТЕМА ЗА ДИНАМИЧНИ МИСИИ
class QuestSystem {
  constructor() {
    this.data = JSON.parse(localStorage.getItem('nauchi-quests') || '{"activeQuest":null,"completedQuests":[],"questProgress":{}}');
    this.quests = {
      biologyMaster: {
        id: 'biologyMaster',
        title: '🧬 Мастер на биологията',
        description: 'Завършете викторини за основи на биологията, клетката и человешкото тяло.',
        tasks: [
          { id: 'quiz-biology-1', label: 'Преминете викторина "Биология"', type: 'quiz', required: true },
          { id: 'lab-molecular', label: 'Посетете молекулярната лаборатория', type: 'simulation', required: false }
        ],
        reward: { points: 200, badge: 'scientist' },
        difficulty: 'easy'
      },
      chemistryExplorer: {
        id: 'chemistryExplorer',
        title: '🧪 Химичен Изследовател',
        description: 'Овладейте химията чрез интерактивни симулации и викторини.',
        tasks: [
          { id: 'quiz-chemistry-1', label: 'Преминете викторина "Химия"', type: 'quiz', required: true },
          { id: 'lab-molecular-2', label: 'Изградете молекули в лабораторията', type: 'simulation', required: true },
          { id: 'quiz-chemistry-2', label: 'Завършете második химия викторина', type: 'quiz', required: false }
        ],
        reward: { points: 250, badge: 'master' },
        difficulty: 'medium'
      },
      physicsNinja: {
        id: 'physicsNinja',
        title: '⚡ Физика Нинджа',
        description: 'Научете се орбитите, силите и енергията чрез симулации.',
        tasks: [
          { id: 'quiz-physics-1', label: 'Преминете викторина "Физика"', type: 'quiz', required: true },
          { id: 'sim-gravity', label: 'Изучете гравитацията в симулатор', type: 'simulation', required: true },
          { id: 'quiz-physics-2', label: 'Втори физика тест', type: 'quiz', required: false }
        ],
        reward: { points: 300, badge: 'fire' },
        difficulty: 'hard'
      },
      geneticsGenius: {
        id: 'geneticsGenius',
        title: '🧬 Генетика Гений',
        description: 'Овладейте генетиката и наследствата чрез интерактивна симулация.',
        tasks: [
          { id: 'lab-genetics', label: 'Завършете генетична симулация', type: 'simulation', required: true },
          { id: 'lab-genetics-2', label: 'Менделови закони', type: 'simulation', required: true }
        ],
        reward: { points: 200, badge: 'scientist' },
        difficulty: 'medium'
      },
      universalScholar: {
        id: 'universalScholar',
        title: '👑 Универсален Учен',
        description: 'Завършете всички темати и станете истински учен!',
        tasks: [
          { id: 'quest-biologyMaster', label: 'Завершите квест "Мастер на биологията"', type: 'quest', required: true },
          { id: 'quest-chemistryExplorer', label: 'Завершите квест "Химичен Изследовател"', type: 'quest', required: true },
          { id: 'quest-physicsNinja', label: 'Завершите квест "Физика Нинджа"', type: 'quest', required: true },
          { id: 'quest-geneticsGenius', label: 'Завершите квест "Генетика Гений"', type: 'quest', required: true }
        ],
        reward: { points: 500, badge: 'master' },
        difficulty: 'impossible'
      }
    };
  }
  
  startQuest(questId) {
    if (!this.quests[questId]) return false;
    
    const quest = this.quests[questId];
    this.data.activeQuest = questId;
    this.data.questProgress[questId] = this.data.questProgress[questId] || {
      started: new Date().toISOString(),
      completedTasks: [],
      progress: 0
    };
    
    this.saveData();
    this.showQuestNotification(`🎯 Кquest избран: ${quest.title}`);
    return true;
  }
  
  completeTask(questId, taskId) {
    if (!this.quests[questId]) return false;
    if (!this.data.questProgress[questId]) return false;
    
    const progress = this.data.questProgress[questId];
    if (!progress.completedTasks.includes(taskId)) {
      progress.completedTasks.push(taskId);
      
      const tasks = this.quests[questId].tasks;
      progress.progress = (progress.completedTasks.length / tasks.length) * 100;
      
      this.saveData();
      this.checkQuestCompletion(questId);
      return true;
    }
    return false;
  }
  
  checkQuestCompletion(questId) {
    const quest = this.quests[questId];
    const progress = this.data.questProgress[questId];
    
    if (!progress) return false;
    
    const requiredTasks = quest.tasks.filter(t => t.required).map(t => t.id);
    const completedRequired = requiredTasks.every(taskId => progress.completedTasks.includes(taskId));
    
    if (completedRequired) {
      this.completeQuest(questId);
      return true;
    }
    return false;
  }
  
  completeQuest(questId) {
    const quest = this.quests[questId];
    const progress = this.data.questProgress[questId];
    
    if (!progress.completed) {
      progress.completed = new Date().toISOString();
      this.data.completedQuests.push(questId);
      
      gameSystem.addPoints(quest.reward.points);
      gameSystem.addBadge(quest.reward.badge);
      
      this.saveData();
      this.showQuestNotification(`✅ Квест завършен! ${quest.title} - +${quest.reward.points} точки!`);
      return true;
    }
    return false;
  }
  
  getQuestStatus(questId) {
    const quest = this.quests[questId];
    const progress = this.data.questProgress[questId];
    
    if (!progress) {
      return { status: 'locked', progress: 0, completed: false, completedTasks: [] };
    }
    
    return {
      status: progress.completed ? 'completed' : 'active',
      progress: progress.progress || 0,
      completed: !!progress.completed,
      completedTasks: progress.completedTasks || []
    };
  }
  
  saveData() {
    localStorage.setItem('nauchi-quests', JSON.stringify(this.data));
  }
  
  showQuestNotification(msg) {
    const notification = document.createElement('div');
    notification.className = 'quest-notification';
    notification.textContent = msg;
    notification.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      background: linear-gradient(135deg, #18a58e, #0f6b56);
      color: white;
      padding: 1rem 1.5rem;
      border-radius: 8px;
      box-shadow: 0 4px 12px rgba(0,0,0,0.2);
      z-index: 10000;
      animation: slideIn 0.3s ease;
      font-weight: 500;
    `;
    document.body.appendChild(notification);
    setTimeout(() => notification.remove(), 3000);
  }
  
  getAllQuests() {
    return Object.values(this.quests).map(quest => ({
      ...quest,
      status: this.getQuestStatus(quest.id)
    }));
  }
}

const questSystem = new QuestSystem();

const quizData = {
  biology: [
    {q:'Коя е основната структурна и функционална единица на живите организми?',a:['Клетката','Тъканта','Органът','Органната система'],c:0,e:'Клетката е най-малката структурна и функционална единица на живите организми.'},
    {q:'Коя клетъчна структура регулира обмена на вещества между клетката и средата?',a:['Клетъчна мембрана','Цитоплазма','Клетъчно ядро','Рибозома'],c:0,e:'Клетъчната мембрана отделя клетката от околната среда и контролира преминаването на вещества.'},
    {q:'Кой пигмент участва в поглъщането на светлинна енергия при фотосинтезата?',a:['Хлорофил','Хемоглобин','Меланин','Кератин'],c:0,e:'Хлорофилът е зелен пигмент, който поглъща светлинна енергия в хлоропластите.'},
    {q:'Коя система пренася кислород и хранителни вещества в човешкото тяло?',a:['Кръвоносна','Нервна','Опорно-двигателна','Храносмилателна'],c:0,e:'Кръвта пренася кислород и хранителни вещества до клетките чрез кръвоносната система.'},
    {q:'Кой орган изпомпва кръвта в тялото?',a:['Сърцето','Белият дроб','Черният дроб','Стомахът'],c:0,e:'Сърцето е мускулест орган, който поддържа движението на кръвта.'},
    {q:'Какъв процес произвежда енергия в митохондриите?',a:['Клетъчно дишане','Фотосинтеза','Брожение','Трансформация'],c:0,e:'Клетъчното дишане е процес, при който клетката освобождава енергия от хранителни вещества.'},
    {q:'В кои клетки могат да се намерят хлоропласти?',a:['В растителните','В животинските','В микробите','Във всички'],c:0,e:'Хлоропластите се намират само в растителните клетки, защото те извършват фотосинтеза.'},
    {q:'Какво съдържа клетъчното ядро?',a:['ДНК','Хемоглобин','Хлорофил','Липиди'],c:0,e:'Клетъчното ядро съдържа ДНК — генетичния материал на организма.'},
  ],
  chemistry: [
    {q:'Коя е най-малката частица на химичния елемент, която запазва свойствата му?',a:['Атом','Молекула','Клетка','Кристал'],c:0,e:'Атомът е най-малката неделима при химични реакции частица на елемента.'},
    {q:'Кой е химичният символ на кислорода?',a:['O','K','C','H'],c:0,e:'Химичният символ на кислорода е O.'},
    {q:'Кое от изброените е хомогенна смес (разтвор)?',a:['Въздух','Вода с пясък','Желязо и сяра','Олио във вода'],c:0,e:'Въздухът е хомогенна смес от газове.'},
    {q:'Какво се образува при химична промяна (реакция)?',a:['Нови вещества','Само нова форма','Само по-малки парчета','Газ без изключение'],c:0,e:'При химична промяна изходните вещества се превръщат в едно или повече нови вещества.'},
    {q:'Кой е химичният символ на желязото?',a:['Fe','F','Ir','Zn'],c:0,e:'Символът Fe произлиза от латинското име ferrum.'},
    {q:'Какво е pH на чистата вода при 25°C?',a:['7','0','14','10'],c:0,e:'Чистата вода има pH = 7, което я прави неутрална.'},
    {q:'Кой процес разделя веществата при електролиза?',a:['Електричеството','Топлината','Движението','Налягането'],c:0,e:'При електролиза электричеството причинява разделяне на вещества.'},
    {q:'Какво е химичната формула на захарта?',a:['C12H22O11','CO2','H2O','NaCl'],c:0,e:'Химичната формула на захарата е C12H22O11, което е вуглевод.'},
  ],
  physics: [
    {q:'В каква мерна единица се измерва силата в международната система?',a:['Нютон (N)','Джаул (J)','Метър (m)','Секунда (s)'],c:0,e:'Силата се измерва в нютони (N).'},
    {q:'Какво описва физичната величина скорост?',a:['Промяната на пътя за единица време','Масата на тялото','Температурата','Обема'],c:0,e:'Скоростта показва колко път се изминава за определено време.'},
    {q:'В каква мерна единица се измерва механичната енергия и работа?',a:['Джаул (J)','Нютон (N)','Ампер (A)','Ват (W)'],c:0,e:'Енергията и работата се измерват в джаули (J).'},
    {q:'Какво представлява електричният ток в метален проводник?',a:['Насочено движение на електрони','Движение на протони','Пренос на топлина','Магнитно поле'],c:0,e:'В металните проводници токът се дължи на насочено движение на свободни електрони.'},
    {q:'Какво може да направи една сила, действаща на тяло?',a:['Да промени движението или формата му','Да промени химичния елемент','Да унищожи масата му','Да спре времето'],c:0,e:'Силата може да промени скоростта, посоката или да деформира тялото.'},
    {q:'Какво е ускорението?',a:['Промяна на скоростта за единица време','Дължина на пътя','Количество енергия','Магнитно поле'],c:0,e:'Ускорението е промяната на скоростта за единица време.'},
    {q:'Кой закон гласи, че всяко действие има равно и противоположно противодействие?',a:['Трети закон на Нютон','Първи закон на Нютон','Закон на гравитацията','Закон на енергията'],c:0,e:'Третият закон на Нютон описва действието и противодействието.'},
    {q:'Какво е мощност?',a:['Работа за единица време','Количество енергия','Скорост на движение','Маса на тялото'],c:0,e:'Мощността е работата, която се извършва за единица време.'},
  ]
};
quizData.mixed = [
  {...quizData.biology[0],topic:'Биология'},
  {...quizData.chemistry[2],topic:'Химия'},
  {...quizData.physics[0],topic:'Физика'},
  {...quizData.biology[2],topic:'Биология'},
  {...quizData.chemistry[1],topic:'Химия'},
  {...quizData.physics[2],topic:'Физика'},
  {...quizData.biology[5],topic:'Биология'},
  {...quizData.chemistry[5],topic:'Химия'},
];

function createQuiz(container, key) {
  const questions = quizData[key];
  if (!questions) return;
  let index = 0, score = 0, locked = false, answers = [], currentOptions = [], correctAnswers = 0;
  
  function render() {
    locked = false;
    const item = questions[index];
    currentOptions = item.a.map((_, i) => i).sort(() => Math.random() - 0.5);
    container.innerHTML = `
      <div class="quiz-top"><span>Въпрос ${index+1} от ${questions.length}${item.topic ? ' · '+item.topic : ''}</span><span>Точки: ${score}</span></div>
      <div class="progress"><span style="width:${(index/questions.length)*100}%"></span></div>
      <h3 class="question">${item.q}</h3>
      <div class="answers">${currentOptions.map((originalIndex,i)=>`<button class="answer" type="button" data-answer="${i}"><b>${String.fromCharCode(65+i)}.</b> ${item.a[originalIndex]}</button>`).join('')}</div>
      <div class="feedback" hidden aria-live="polite"></div>
      <div class="quiz-controls"><span class="muted">${key==='mixed'?'Смесен тест':'Избери един отговор'}</span><button class="btn primary next" type="button" disabled>${index===questions.length-1?'Виж резултата':'Следващ въпрос →'}</button></div>`;
    container.querySelectorAll('.answer').forEach(button => button.addEventListener('click', () => choose(Number(button.dataset.answer))));
    container.querySelector('.next').addEventListener('click', () => { if(index < questions.length-1){index++;render();} else showResult(); });
  }
  
  function choose(choice) {
    if (locked) return;
    locked = true;
    const item = questions[index], correct = currentOptions[choice] === item.c;
    if(correct) {
      score++;
      correctAnswers++;
      gameSystem.updateStreak();
      triggerConfetti();
    } else {
      gameSystem.resetStreak();
    }
    answers[index] = correct;
    container.querySelectorAll('.answer').forEach((button,i) => {
      button.disabled = true;
      if(currentOptions[i] === item.c) button.classList.add('correct');
      else if(i === choice) button.classList.add('wrong');
    });
    const feedback = container.querySelector('.feedback');
    feedback.hidden = false;
    feedback.textContent = (correct ? '✓ Точно така! ' : '✦ Добър опит! ') + item.e;
    container.querySelector('.next').disabled = false;
    container.querySelector('.quiz-top span:last-child').textContent = `Точки: ${score}`;
  }
  
  function showResult() {
    const percent = Math.round(score/questions.length*100);
    const message = percent===100?'🏆 Фантастично! Отлично владееш темата.':percent>=60?'🌟 Много добре! Още малко упражнение и ще станеш още по-уверен.':'📚 Продължавай да опитваш! Прегледай темите и опитай отново.';
    gameSystem.addPoints(score * 10);
    if (percent === 100) gameSystem.addBadge('scientist');
    
    container.innerHTML = `<div class="quiz-result"><div class="score">${score}/${questions.length}</div><h3>${percent}% верни отговори</h3><p>${message}</p><button class="btn primary restart" type="button">Опитай отново ↻</button></div>`;
    container.querySelector('.restart').addEventListener('click',()=>{index=0;score=0;answers=[];correctAnswers=0;render();});
  }
  render();
}

// 🎉 КОНФЕТИ АНИМАЦИЯ
function triggerConfetti() {
  for (let i = 0; i < 15; i++) {
    const confetti = document.createElement('div');
    confetti.className = 'confetti';
    confetti.textContent = ['🎉', '✨', '⭐', '🌟', '🎊'][Math.floor(Math.random() * 5)];
    confetti.style.left = Math.random() * window.innerWidth + 'px';
    confetti.style.top = '-10px';
    document.body.appendChild(confetti);
    setTimeout(() => confetti.remove(), 2000);
  }
}

document.querySelectorAll('[data-quiz]').forEach(el => createQuiz(el,el.dataset.quiz));

const contactForm = document.querySelector('#contact-form');
if(contactForm) contactForm.addEventListener('submit', event => {
  event.preventDefault();
  contactForm.querySelector('.form-status').textContent = 'Благодарим за предложението! В демо версията то не се изпраща към сървър.';
  contactForm.reset();
});

// 📚 ФАКТ НА ДЕНЯ
const dailyFacts = [
  '🧬 Човешкото тяло съдържа приблизително 37 трилиона клетки!',
  '⚛️ Всички атоми у вас са по-стари от Слънцето.',
  '🧠 Мозъкът ти тежи около 1,4 кг, но потребява 20% от енергията.',
  '💚 Растенията произвеждат кислорода, от който дишаме.',
  '⚡ Електричеството в телата ни е същото като това в батериите.',
  '🔬 Микроскопът е открил свят, невидим за човешкото око.',
  '🌿 Едно дърво поглъща около 20 кг CO2 годишно.',
  '💧 Вода покрива 71% от Земята и е в 60% от всяко животно.',
];

function showDailyFact() {
  const fact = dailyFacts[Math.floor(Math.random() * dailyFacts.length)];
  const container = document.querySelector('[data-daily-fact]');
  if (container) container.textContent = fact;
}
showDailyFact();

// 🎨 АНИМАЦИИ НА ПРЕВЪРТАНЕ
document.addEventListener('DOMContentLoaded', () => {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.animation = 'slideUp 0.6s ease';
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });
  
  document.querySelectorAll('.section, .subject-card, .topic').forEach(el => {
    observer.observe(el);
  });
});

// 📊 ГРАФИК НА СКОРОСТТА (Физика)
function initSpeedGraph() {
  const canvas = document.getElementById('speed-graph');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const width = canvas.width = 400;
  const height = canvas.height = 200;
  
  function drawGraph(speed) {
    ctx.fillStyle = '#f4f8fb';
    ctx.fillRect(0, 0, width, height);
    
    ctx.strokeStyle = '#e6edf2';
    for (let i = 0; i <= 10; i++) {
      ctx.beginPath();
      ctx.moveTo(0, (i/10)*height);
      ctx.lineTo(width, (i/10)*height);
      ctx.stroke();
    }
    
    ctx.strokeStyle = '#18a58e';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(0, height - 20);
    for (let x = 0; x < width; x++) {
      const y = height - (speed/150) * (height - 40) - 20;
      if (x === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.stroke();
  }
  
  document.getElementById('sim-dist').addEventListener('input', () => drawGraph(document.getElementById('sim-dist').value / document.getElementById('sim-time').value));
  document.getElementById('sim-time').addEventListener('input', () => drawGraph(document.getElementById('sim-dist').value / document.getElementById('sim-time').value));
  drawGraph(75);
}
initSpeedGraph();

// 🧪 ХИМИЯ - ПЕРИОДИЧНА СИСТЕМА
const elements = {
  'H': 'Водород - Лекотен газ, съставка на вода',
  'C': 'Въглерод - Основа на живота на Земята',
  'N': 'Азот - Съставка на въздуха (78%)',
  'O': 'Кислород - Необходим за дишане',
  'Fe': 'Желязо - Металът на кръвта',
  'Na': 'Натрий - Съставка на сол',
  'Cl': 'Хлор - Половина на сола (NaCl)',
  'Ca': 'Калций - Съставка на костите',
};

function showElement(symbol) {
  const info = document.getElementById('element-info');
  if (info) info.innerHTML = `<strong>${symbol}:</strong> ${elements[symbol] || 'Неизвестен елемент'}`;
}

// 📊 СИСТЕМА ЗА ДНЕВНИК НА ПРОГРЕСА
class ProgressJournal {
  constructor() {
    this.entries = JSON.parse(localStorage.getItem('nauchi-journal') || '[]');
  }

  addEntry(questId, description, difficulty = 'normal') {
    const entry = {
      id: Date.now(),
      questId,
      timestamp: new Date().toISOString(),
      description,
      difficulty,
      reflection: '',
      timeSpent: 0
    };
    this.entries.push(entry);
    this.saveEntries();
    return entry;
  }

  getEntries(questId = null) {
    if (!questId) return this.entries;
    return this.entries.filter(e => e.questId === questId);
  }

  updateReflection(entryId, reflection) {
    const entry = this.entries.find(e => e.id === entryId);
    if (entry) {
      entry.reflection = reflection;
      this.saveEntries();
    }
  }

  getStats() {
    const totalSessions = this.entries.length;
    const totalTime = this.entries.reduce((sum, e) => sum + e.timeSpent, 0);
    const avgDifficulty = this.entries.length > 0 
      ? this.entries.reduce((sum, e) => sum + (e.difficulty === 'hard' ? 3 : e.difficulty === 'normal' ? 2 : 1), 0) / this.entries.length 
      : 0;
    
    return { totalSessions, totalTime, avgDifficulty };
  }

  saveEntries() {
    localStorage.setItem('nauchi-journal', JSON.stringify(this.entries));
  }
}

// 🌟 СИСТЕМА ЗА ОЦЕНЯВАНЕ НА КУУЕСТ
class QuestRating {
  constructor() {
    this.ratings = JSON.parse(localStorage.getItem('nauchi-ratings') || '{}');
  }

  rateQuest(questId, rating, comment = '') {
    if (rating < 1 || rating > 5) return false;
    
    this.ratings[questId] = {
      rating,
      comment,
      timestamp: new Date().toISOString(),
      helpful: 0,
      notHelpful: 0
    };
    this.saveRatings();
    return true;
  }

  getRating(questId) {
    return this.ratings[questId] || null;
  }

  markHelpful(questId) {
    if (this.ratings[questId]) {
      this.ratings[questId].helpful++;
      this.saveRatings();
    }
  }

  saveRatings() {
    localStorage.setItem('nauchi-ratings', JSON.stringify(this.ratings));
  }
}

// 📈 СИСТЕМА ЗА АНАЛИЗ НА ПЕРФОРМАНС
class PerformanceAnalytics {
  constructor() {
    this.sessions = JSON.parse(localStorage.getItem('nauchi-sessions') || '[]');
  }

  recordSession(questId, score, time, correct, total) {
    const session = {
      id: Date.now(),
      questId,
      score,
      time,
      accuracy: (correct / total) * 100,
      timestamp: new Date().toISOString()
    };
    this.sessions.push(session);
    this.saveSessions();
    return session;
  }

  getQuestStats(questId) {
    const questSessions = this.sessions.filter(s => s.questId === questId);
    if (questSessions.length === 0) return null;

    const avgScore = questSessions.reduce((sum, s) => sum + s.score, 0) / questSessions.length;
    const avgTime = questSessions.reduce((sum, s) => sum + s.time, 0) / questSessions.length;
    const avgAccuracy = questSessions.reduce((sum, s) => sum + s.accuracy, 0) / questSessions.length;

    return { avgScore, avgTime, avgAccuracy, attempts: questSessions.length };
  }

  getTrendData(questId) {
    return this.sessions
      .filter(s => s.questId === questId)
      .sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp))
      .slice(-10);
  }

  saveSessions() {
    localStorage.setItem('nauchi-sessions', JSON.stringify(this.sessions));
  }
}

// 🏆 СИСТЕМА ЗА ЛИЧНЛОТНИ ЗАПИСИ
class PersonalRecords {
  constructor() {
    this.records = JSON.parse(localStorage.getItem('nauchi-records') || '{}');
  }

  checkRecord(questId, score) {
    if (!this.records[questId] || score > this.records[questId]) {
      this.records[questId] = score;
      this.savRecords();
      return true;
    }
    return false;
  }

  getRecord(questId) {
    return this.records[questId] || 0;
  }

  getAllRecords() {
    return this.records;
  }

  savRecords() {
    localStorage.setItem('nauchi-records', JSON.stringify(this.records));
  }
}

// ИНИЦИАЛИЗИРАНЕ НА НОВИТЕ СИСТЕМИ
const progressJournal = new ProgressJournal();
const questRating = new QuestRating();
const performanceAnalytics = new PerformanceAnalytics();
const personalRecords = new PersonalRecords();

// 🧬 БИОЛОГИЯ - СЪБЕРИ КЛЕТКАТА
function initCellBuilder() {
  const builder = document.getElementById('cell-builder');
  if (!builder) return;
  
  const organelles = ['ядро', 'цитоплазма', 'мембрана', 'митохондрия'];
  builder.innerHTML = organelles.map(o => `<div draggable="true" class="organelle" data-org="${o}">${o}</div>`).join('');
  
  document.querySelectorAll('.organelle').forEach(org => {
    org.addEventListener('dragstart', (e) => e.dataTransfer.effectAllowed = 'move');
  });
}
initCellBuilder();

// 👤 ИМЕ НА ПОТРЕБИТЕЛ
const userNameInput = document.getElementById('user-name-input');
if(userNameInput) {
  const savedName = localStorage.getItem('userName') || '';
  userNameInput.value = savedName;
  userNameInput.addEventListener('change', (e) => {
    localStorage.setItem('userName', e.target.value);
  });
}
