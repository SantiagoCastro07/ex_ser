// PREMIUM CASINO - RULETA DE DERECHOS Y DEBERES
let selectedChoice = '';
let currentRotation = 0;
let score = 800;
let isSpinning = false;
const totalSegments = 21;
const segmentAngle = 360 / totalSegments;

// Estadísticas
let stats = {
  totalSpins: 0,
  totalWins: 0,
  currentStreak: 0,
  biggestWin: 0,
  bestStreak: 0
};

// Configuración de segmentos
const segmentTypes = [];
for (let i = 0; i < totalSegments; i++) {
  if (i === 0) {
    segmentTypes.push("bonus");
  } else if (i % 2 === 1) {
    segmentTypes.push("deber");
  } else {
    segmentTypes.push("derecho");
  }
}

const colors = {
  'deber': '#34495e',
  'derecho': '#e74c3c',
  'bonus': '#27ae60'
};

// Listas de derechos y deberes
const deberes = [
  "Mantener el buen orden y aseo en la institución",
  "Cumplir las normas y actuar de buena fe",
  "Exponer claramente su estado de salud y la causa de su visita",
  "Seguir las recomendaciones médicas",
  "No solicitar servicios con información engañosa",
  "Expresar la información que se solicita para prestar un buen servicio",
  "Informar de todo acto que afecte a la clínica",
  "Cumplir las citas y requerimientos del personal de salud",
  "Respetar al personal de salud y a los usuarios",
  "Brindar un trato amable y digno"
];

const derechos = [
  "Conocer todos los trámites administrativos",
  "Ser informado de todo lo relacionado con su atención",
  "Recibir atención que salvaguarde su dignidad personal y respete sus valores",
  "Respetar su privacidad, confidencialidad de la información y contar con una historia clínica íntegra, veraz y legible",
  "Recibir un trato amable, cortés y humano por parte de todo el personal",
  "Conocer toda la información sobre la enfermedad, procedimientos y tratamientos",
  "Ser atendido por personal capacitado",
  "Recibir prescripción de medicamentos y explicación de vías de administración",
  "Aceptar o rechazar procedimientos dejando constancia escrita",
  "Recibir atención requerida de acuerdo a sus necesidades"
];

// Preguntas del quiz
const quizQuestions = [
  {
    question: "¿Cuál es uno de los principales deberes del paciente en la institución médica?",
    options: [
      "Exigir atención inmediata sin cita previa",
      "Mantener el buen orden y aseo en la institución",
      "Solicitar medicamentos sin prescripción",
      "Interrumpir las consultas de otros pacientes"
    ],
    correct: 1
  },
  {
    question: "Como paciente, tienes derecho a:",
    options: [
      "Recibir información solo si la solicitas expresamente",
      "Conocer toda la información sobre tu enfermedad, procedimientos y tratamientos",
      "Ser atendido por cualquier persona de la institución",
      "Rechazar el pago de los servicios médicos"
    ],
    correct: 1
  },
  {
    question: "¿Qué deber tiene el paciente respecto a su información médica?",
    options: [
      "Ocultar información relevante sobre su salud",
      "Exponer claramente su estado de salud y la causa de su visita",
      "Inventar síntomas para obtener medicamentos",
      "Solo hablar con el médico principal"
    ],
    correct: 1
  },
  {
    question: "En cuanto a la privacidad del paciente, es un derecho:",
    options: [
      "Que solo el médico conozca tu información",
      "Respetar tu privacidad, confidencialidad y tener una historia clínica íntegra",
      "Que tu información sea pública para otros pacientes",
      "No tener historia clínica"
    ],
    correct: 1
  },
  {
    question: "¿Cuál es un deber fundamental del paciente hacia el personal médico?",
    options: [
      "Criticar constantemente su trabajo",
      "Respetar al personal de salud y a los usuarios",
      "Exigir descuentos en los servicios",
      "Interrumpir sus procedimientos"
    ],
    correct: 1
  },
  {
    question: "Como paciente, tienes derecho a recibir:",
    options: [
      "Medicamentos gratuitos siempre",
      "Atención que salvaguarde tu dignidad personal y respete tus valores",
      "Tratamiento sin consentimiento",
      "Servicios médicos sin costo"
    ],
    correct: 1
  },
  {
    question: "¿Qué deber tiene el paciente con las citas médicas?",
    options: [
      "Llegar cuando pueda, sin horario fijo",
      "Cumplir las citas y requerimientos del personal de salud",
      "Cancelar las citas sin previo aviso",
      "Traer acompañantes sin autorización"
    ],
    correct: 1
  },
  {
    question: "Respecto a los procedimientos médicos, el paciente tiene derecho a:",
    options: [
      "Exigir procedimientos innecesarios",
      "Aceptar o rechazar procedimientos dejando constancia escrita",
      "Realizarse procedimientos sin supervisión médica",
      "Modificar las prescripciones médicas"
    ],
    correct: 1
  }
];

let currentQuizIndex = 0;
let currentQuestion = null;

// Inicialización
document.addEventListener("DOMContentLoaded", function() {
  createWheelSVG();
  setChoice('deber');
  createParticles();
  loadStats();
  updateStatsDisplay();
});

// Crear partículas animadas
function createParticles() {
  const particlesContainer = document.getElementById('particles');
  
  for (let i = 0; i < 50; i++) {
    const particle = document.createElement('div');
    particle.className = 'particle';
    particle.style.left = Math.random() * 100 + '%';
    particle.style.animationDelay = Math.random() * 8 + 's';
    particle.style.animationDuration = (Math.random() * 3 + 5) + 's';
    particlesContainer.appendChild(particle);
  }
}

// Crear ruleta SVG mejorada
function createWheelSVG() {
  const wheel = document.getElementById('wheel');
  const existingContent = wheel.innerHTML;
  wheel.innerHTML = '';

  const rouletteContainer = document.querySelector('.roulette');
  const containerSize = 400;
  
  const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  svg.setAttribute('width', '100%');
  svg.setAttribute('height', '100%');
  svg.setAttribute('viewBox', `0 0 ${containerSize} ${containerSize}`);

  const centerX = containerSize / 2;
  const centerY = containerSize / 2;
  const radius = (containerSize / 2) - 15;

  // Crear gradientes
  const defs = document.createElementNS('http://www.w3.org/2000/svg', 'defs');
  
  // Gradiente para deber
  const deberGradient = document.createElementNS('http://www.w3.org/2000/svg', 'radialGradient');
  deberGradient.setAttribute('id', 'deberGradient');
  deberGradient.innerHTML = `
    <stop offset="0%" style="stop-color:#5d6d7e"/>
    <stop offset="100%" style="stop-color:#34495e"/>
  `;
  
  // Gradiente para derecho
  const derechoGradient = document.createElementNS('http://www.w3.org/2000/svg', 'radialGradient');
  derechoGradient.setAttribute('id', 'derechoGradient');
  derechoGradient.innerHTML = `
    <stop offset="0%" style="stop-color:#ec7063"/>
    <stop offset="100%" style="stop-color:#e74c3c"/>
  `;
  
  // Gradiente para bonus
  const bonusGradient = document.createElementNS('http://www.w3.org/2000/svg', 'radialGradient');
  bonusGradient.setAttribute('id', 'bonusGradient');
  bonusGradient.innerHTML = `
    <stop offset="0%" style="stop-color:#58d68d"/>
    <stop offset="100%" style="stop-color:#27ae60"/>
  `;

  defs.appendChild(deberGradient);
  defs.appendChild(derechoGradient);
  defs.appendChild(bonusGradient);
  svg.appendChild(defs);

  // Crear segmentos
  for (let i = 0; i < totalSegments; i++) {
    const startAngle = (i * segmentAngle - 90) * Math.PI / 180;
    const endAngle = ((i + 1) * segmentAngle - 90) * Math.PI / 180;

    const x1 = centerX + radius * Math.cos(startAngle);
    const y1 = centerY + radius * Math.sin(startAngle);
    const x2 = centerX + radius * Math.cos(endAngle);
    const y2 = centerY + radius * Math.sin(endAngle);

    const largeArcFlag = segmentAngle > 180 ? 1 : 0;

    const pathData = [
      `M ${centerX} ${centerY}`,
      `L ${x1} ${y1}`,
      `A ${radius} ${radius} 0 ${largeArcFlag} 1 ${x2} ${y2}`,
      'Z'
    ].join(' ');

    const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    path.setAttribute('d', pathData);
    
    const segmentType = segmentTypes[i];
    path.setAttribute('fill', `url(#${segmentType}Gradient)`);
    path.setAttribute('stroke', '#ffd700');
    path.setAttribute('stroke-width', '2');
    
    // Efectos de sombra
    path.setAttribute('filter', 'drop-shadow(0px 2px 4px rgba(0,0,0,0.3))');

    svg.appendChild(path);
  }

  wheel.appendChild(svg);
  wheel.innerHTML += existingContent; // Restaurar contenido existente
}

// Seleccionar opción de apuesta
function setChoice(type) {
  selectedChoice = type;
  document.querySelectorAll('.choice').forEach(btn => {
    btn.classList.remove('active');
  });
  const activeBtn = document.querySelector(`.choice.${type}`);
  if (activeBtn) {
    activeBtn.classList.add('active');
  }
}

// Obtener elemento aleatorio
function getRandomElement(array) {
  return array[Math.floor(Math.random() * array.length)];
}

// Calcular segmento ganador
function getWinningSegment(rotation) {
  const normalizedRotation = rotation % 360;
  const flecha_angle = (360 - normalizedRotation) % 360;
  const segmentIndex = Math.floor(flecha_angle / segmentAngle);
  return segmentIndex % totalSegments;
}

// Función principal de giro
// Encuentra esta función en tu script.js y reemplázala:

function spin() {
  if (isSpinning) return;
  
  const bet = parseInt(document.getElementById("bet").value);

  // Verificar si el jugador tiene créditos suficientes ANTES de validar la apuesta
  if (score < 10) {
    showQuizModal();
    return;
  }

  if (isNaN(bet) || bet < 10 || bet > score) {
    showNotification("❌ Apuesta inválida. Debes apostar al menos 10 puntos y no exceder tus créditos actuales.", 'error');
    return;
  }

  isSpinning = true;
  score -= bet;
  updateScore();

  const spinBtn = document.querySelector('.spin-btn');
  const btnText = spinBtn.querySelector('.btn-text');
  spinBtn.disabled = true;
  btnText.textContent = 'GIRANDO...';

  // Animación de giro más realista
  const minSpins = 8;
  const randomSpin = Math.random() * 360;
  const totalRotation = (minSpins * 360) + randomSpin;
  currentRotation += totalRotation;

  const wheel = document.getElementById('wheel');
  wheel.style.transition = 'transform 4.5s cubic-bezier(0.25, 0.1, 0.25, 1)';
  wheel.style.transform = `rotate(${currentRotation}deg)`;

  // Efectos de sonido simulados con vibración visual
  animateSpinEffects();

  setTimeout(() => {
    processSpinResult(bet);
    
    isSpinning = false;
    spinBtn.disabled = false;
    btnText.textContent = 'GIRAR';
    
    // Verificar nuevamente si necesita quiz después del giro
    if (score < 10) {
      setTimeout(() => {
        showNotification("💡 ¡Se te acabaron los créditos! Responde el quiz para recuperar puntos", 'info');
      }, 2000);
    }
    
    // Actualizar estadísticas
    stats.totalSpins++;
    updateStatsDisplay();
    saveStats();
  }, 4500);
}

// Efectos visuales durante el giro
function animateSpinEffects() {
  const rouletteContainer = document.querySelector('.roulette-container');
  rouletteContainer.style.animation = 'none';
  rouletteContainer.offsetHeight; // Trigger reflow
  rouletteContainer.style.animation = 'rouletteShake 4.5s ease-out';
}

// Procesar resultado del giro
function processSpinResult(bet) {
  const winningIndex = getWinningSegment(currentRotation);
  const resultType = segmentTypes[winningIndex];
  const resultDiv = document.getElementById("result");

  resultDiv.classList.remove('win-animation', 'lose-animation', 'bonus-animation');

  let resultMessage = "";
  let isWin = false;
  let winAmount = 0;

  if (resultType === selectedChoice) {
    if (resultType === 'bonus') {
      winAmount = bet * 21;
      resultMessage = `💎 ¡JACKPOT! Ganas ${winAmount} créditos`;
      resultDiv.classList.add('bonus-animation');
    } else {
      winAmount = bet * 2;
      resultMessage = `🎉 ¡Ganaste! Salió ${resultType.toUpperCase()}. Ganas ${winAmount} créditos`;
      resultDiv.classList.add('win-animation');
    }
    score += winAmount;
    isWin = true;
    stats.totalWins++;
    stats.currentStreak++;
    
    if (winAmount > stats.biggestWin) {
      stats.biggestWin = winAmount;
    }
    if (stats.currentStreak > stats.bestStreak) {
      stats.bestStreak = stats.currentStreak;
    }
  } else {
    resultMessage = `💸 Salió ${resultType.toUpperCase()}. Pierdes ${bet} créditos`;
    resultDiv.classList.add('lose-animation');
    stats.currentStreak = 0;
  }

  resultDiv.innerHTML = resultMessage;
  updateScore();

  // Mostrar modal con información educativa
  setTimeout(() => {
    if (resultType === 'deber') {
      const deberAleatorio = getRandomElement(deberes);
      showModal('deber', '📋 DEBER DEL PACIENTE', deberAleatorio);
    } else if (resultType === 'derecho') {
      const derechoAleatorio = getRandomElement(derechos);
      showModal('derecho', '⚖️ DERECHO DEL PACIENTE', derechoAleatorio);
    }
  }, 1000);

  // Mostrar notificación de resultado
  if (isWin) {
    showNotification(`🎉 ¡Felicidades! Ganaste ${winAmount} créditos`, 'success');
  }
}

// Actualizar puntuación
function updateScore() {
  const scoreElement = document.getElementById("score");
  scoreElement.textContent = score;
  
  // Animación de cambio de puntos
  scoreElement.style.transform = 'scale(1.2)';
  scoreElement.style.transition = 'transform 0.3s ease';
  setTimeout(() => {
    scoreElement.style.transform = 'scale(1)';
  }, 300);
}

// Sistema de notificaciones
function showNotification(message, type = 'info') {
  // Remover notificación existente
  const existingNotification = document.querySelector('.notification');
  if (existingNotification) {
    existingNotification.remove();
  }

  const notification = document.createElement('div');
  notification.className = `notification notification-${type}`;
  notification.innerHTML = message;
  
  // Estilos dinámicos
  notification.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    background: ${type === 'success' ? 'linear-gradient(45deg, #28a745, #20c997)' : 
                 type === 'error' ? 'linear-gradient(45deg, #dc3545, #c82333)' : 
                 'linear-gradient(45deg, #17a2b8, #138496)'};
    color: white;
    padding: 15px 25px;
    border-radius: 10px;
    font-weight: 600;
    box-shadow: 0 8px 25px rgba(0,0,0,0.3);
    z-index: 3000;
    animation: slideInRight 0.5s ease;
    max-width: 300px;
  `;

  document.body.appendChild(notification);

  setTimeout(() => {
    notification.style.animation = 'slideOutRight 0.5s ease forwards';
    setTimeout(() => notification.remove(), 500);
  }, 4000);
}

// Sistema de estadísticas
function updateStatsDisplay() {
  document.getElementById('totalSpins').textContent = stats.totalSpins;
  document.getElementById('totalWins').textContent = stats.totalWins;
  document.getElementById('currentStreak').textContent = stats.currentStreak;
  document.getElementById('biggestWin').textContent = stats.biggestWin;
}

function toggleStats() {
  const statsContent = document.getElementById('statsContent');
  const toggleBtn = document.querySelector('.stats-toggle');
  
  if (statsContent.classList.contains('collapsed')) {
    statsContent.classList.remove('collapsed');
    toggleBtn.textContent = '▲';
  } else {
    statsContent.classList.add('collapsed');
    toggleBtn.textContent = '▼';
  }
}

function saveStats() {
  try {
    localStorage.setItem('casinoStats', JSON.stringify(stats));
  } catch (e) {
    console.log('No se pudo guardar las estadísticas');
  }
}

function loadStats() {
  try {
    const savedStats = localStorage.getItem('casinoStats');
    if (savedStats) {
      stats = { ...stats, ...JSON.parse(savedStats) };
    }
  } catch (e) {
    console.log('No se pudieron cargar las estadísticas');
  }
}

// Sistema de Quiz
function showQuizModal() {
  currentQuestion = getRandomQuizQuestion();
  const modal = document.getElementById('quizModal');
  const questionEl = document.getElementById('quizQuestion');
  const optionsEl = document.getElementById('quizOptions');
  const resultEl = document.getElementById('quizResult');
  const nextBtn = document.getElementById('nextQuestionBtn');

  questionEl.textContent = currentQuestion.question;
  resultEl.innerHTML = '';
  resultEl.className = 'quiz-result';
  nextBtn.classList.add('oculto');

  // Crear opciones
  optionsEl.innerHTML = '';
  currentQuestion.options.forEach((option, index) => {
    const optionDiv = document.createElement('div');
    optionDiv.className = 'quiz-option';
    optionDiv.textContent = option;
    optionDiv.onclick = () => selectQuizOption(index, optionDiv);
    optionsEl.appendChild(optionDiv);
  });

  modal.classList.add('show');
}

function getRandomQuizQuestion() {
  return quizQuestions[Math.floor(Math.random() * quizQuestions.length)];
}

function selectQuizOption(selectedIndex, optionElement) {
  const options = document.querySelectorAll('.quiz-option');
  const resultEl = document.getElementById('quizResult');
  const nextBtn = document.getElementById('nextQuestionBtn');

  // Desactivar todas las opciones
  options.forEach(opt => {
    opt.onclick = null;
    opt.style.cursor = 'not-allowed';
  });

  if (selectedIndex === currentQuestion.correct) {
    // Respuesta correcta
    optionElement.classList.add('correct');
    score += 100;
    updateScore();
    
    resultEl.innerHTML = '🎉 ¡Correcto! Has ganado 100 créditos';
    resultEl.classList.add('success');
    
    setTimeout(() => {
      closeQuizModal();
      showNotification('¡Excelente! Ganaste 100 créditos respondiendo correctamente', 'success');
    }, 2500);

  } else {
    // Respuesta incorrecta
    optionElement.classList.add('incorrect');
    options[currentQuestion.correct].classList.add('correct');
    
    resultEl.innerHTML = '❌ Incorrecto. Inténtalo con otra pregunta';
    resultEl.classList.add('error');
    
    nextBtn.classList.remove('oculto');
  }
}

function loadNewQuestion() {
  showQuizModal();
}

function closeQuizModal() {
  const modal = document.getElementById('quizModal');
  modal.classList.remove('show');
}

// Modales de información (Derechos/Deberes)
function showModal(type, title, text) {
  const modalOverlay = document.getElementById('modalOverlay');
  const modalHeader = document.getElementById('modalHeader');
  const modalTitle = document.getElementById('modalTitle');
  const modalText = document.getElementById('modalText');

  modalTitle.textContent = title;
  modalText.textContent = text;
  modalHeader.className = `modal-header ${type}`;
  
  modalOverlay.classList.add('show');
}

function closeModal() {
  const modalOverlay = document.getElementById('modalOverlay');
  modalOverlay.classList.remove('show');
}

// Eventos de teclado para mejor UX
document.addEventListener('keydown', function(event) {
  if (event.code === 'Space' && !isSpinning) {
    event.preventDefault();
    spin();
  }
  
  if (event.code === 'Escape') {
    closeModal();
    closeQuizModal();
  }
  
  // Selección rápida de opciones
  if (event.code === 'Digit1') setChoice('deber');
  if (event.code === 'Digit2') setChoice('derecho');
  if (event.code === 'Digit3') setChoice('bonus');
});

// Agregar CSS dinámico para animaciones adicionales
const additionalCSS = `
@keyframes rouletteShake {
  0%, 100% { transform: translateX(0); }
  2% { transform: translateX(-2px); }
  4% { transform: translateX(2px); }
  6% { transform: translateX(-2px); }
  8% { transform: translateX(2px); }
  10% { transform: translateX(0); }
}

@keyframes slideInRight {
  from {
    transform: translateX(100%);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
}

@keyframes slideOutRight {
  from {
    transform: translateX(0);
    opacity: 1;
  }
  to {
    transform: translateX(100%);
    opacity: 0;
  }
}

.notification {
  font-family: 'Inter', sans-serif;
}
`;

// Insertar CSS adicional
const styleSheet = document.createElement('style');
styleSheet.textContent = additionalCSS;
document.head.appendChild(styleSheet);

// Inicializar efectos visuales adicionales
function initializeVisualEffects() {
  // Efecto de parallax suave en el mouse
  document.addEventListener('mousemove', (e) => {
    const lights = document.querySelectorAll('.light');
    const mouseX = e.clientX / window.innerWidth;
    const mouseY = e.clientY / window.innerHeight;
    
    lights.forEach((light, index) => {
      const speed = (index + 1) * 0.5;
      const x = (mouseX - 0.5) * speed;
      const y = (mouseY - 0.5) * speed;
      light.style.transform = `translate(${x}px, ${y}px)`;
    });
  });
}

// Auto-inicializar efectos visuales
setTimeout(initializeVisualEffects, 1000);

// Agrega estas funciones AL FINAL de tu script.js (antes del último }):

// Verificar automáticamente si necesita quiz al cargar
function checkForQuizOnLoad() {
  if (score < 10) {
    setTimeout(() => {
      showNotification("💡 Tus créditos están bajos. Haz clic en 'Recuperar Créditos' para ganar más puntos", 'info');
      // Mostrar botón de quiz si no existe
      addQuizButton();
    }, 1000);
  }
}

// Agregar botón de quiz manual
function addQuizButton() {
  // Verificar si el botón ya existe
  if (document.getElementById('manualQuizBtn')) {
    return;
  }

  const quizButton = document.createElement('button');
  quizButton.id = 'manualQuizBtn';
  quizButton.className = 'spin-btn';
  quizButton.style.cssText = `
    background: linear-gradient(45deg, #17a2b8, #138496);
    margin-top: 20px;
    padding: 15px 40px;
    font-size: 1.2rem;
  `;
  quizButton.innerHTML = `
    <span class="btn-text">RECUPERAR CRÉDITOS</span>
    <div class="btn-glow"></div>
  `;
  quizButton.onclick = () => showQuizModal();

  // Insertar después del botón de girar
  const spinBtn = document.querySelector('.spin-btn');
  spinBtn.parentNode.insertBefore(quizButton, spinBtn.nextSibling);
}

// Remover botón de quiz cuando tenga suficientes puntos
function removeQuizButton() {
  const quizBtn = document.getElementById('manualQuizBtn');
  if (quizBtn) {
    quizBtn.remove();
  }
}

// Modificar la función updateScore existente para manejar el botón
function updateScore() {
  const scoreElement = document.getElementById("score");
  scoreElement.textContent = score;
  
  // Animación de cambio de puntos
  scoreElement.style.transform = 'scale(1.2)';
  scoreElement.style.transition = 'transform 0.3s ease';
  setTimeout(() => {
    scoreElement.style.transform = 'scale(1)';
  }, 300);

  // Manejar botón de quiz basado en créditos
  if (score < 10) {
    addQuizButton();
  } else {
    removeQuizButton();
  }
}

// Modificar el event listener de DOMContentLoaded existente
document.addEventListener("DOMContentLoaded", function() {
  createWheelSVG();
  setChoice('deber');
  createParticles();
  loadStats();
  updateStatsDisplay();
  checkForQuizOnLoad(); // Agregar esta línea
});