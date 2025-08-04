let selectedChoice = '';
let currentRotation = 0;
let score = 800;
const totalSegments = 21;
const segmentAngle = 360 / totalSegments;

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

document.addEventListener("DOMContentLoaded", function() {
  document.getElementById("datosForm").addEventListener("submit", function (e) {
    e.preventDefault();
    const nombre = document.getElementById("nombre").value.trim();
    document.getElementById("formulario").classList.add("oculto");
    document.getElementById("contenido").classList.remove("oculto");
    document.getElementById("saludoUsuario").textContent = `¡Hola, ${nombre}! Bienvenido al juego`;
    createWheel();
    setChoice('deber');
  });
});

function createWheel() {
  const wheel = document.getElementById('wheel');
  wheel.innerHTML = '';

  // Detectar el tamaño actual del contenedor de la ruleta
  const rouletteContainer = document.querySelector('.roulette');
  const containerSize = rouletteContainer.offsetWidth;
  
  const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  svg.setAttribute('width', '100%');
  svg.setAttribute('height', '100%');
  svg.setAttribute('viewBox', `0 0 ${containerSize} ${containerSize}`);
  svg.style.borderRadius = '50%';
  svg.style.width = '100%';
  svg.style.height = '100%';

  const centerX = containerSize / 2;
  const centerY = containerSize / 2;
  const radius = (containerSize / 2) - 10; // Dejar margen para el borde

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
    path.setAttribute('fill', colors[segmentTypes[i]]);
    path.setAttribute('stroke', '#fff');
    path.setAttribute('stroke-width', '2');

    svg.appendChild(path);
  }

  wheel.appendChild(svg);
}

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

// Función para obtener un elemento aleatorio de un array
function getRandomElement(array) {
  return array[Math.floor(Math.random() * array.length)];
}

// FUNCIÓN CORREGIDA - Calculamos correctamente el segmento bajo la flecha
function getWinningSegment(rotation) {
  // Normalizar la rotación total
  const normalizedRotation = rotation % 360;
  
  // La flecha apunta hacia arriba (0°), calculamos qué segmento está ahí
  // Como la rueda gira en sentido horario, restamos la rotación
  const flecha_angle = (360 - normalizedRotation) % 360;
  
  // Calcular el índice del segmento (sin el offset de -90° porque ya está incluido en la creación)
  const segmentIndex = Math.floor(flecha_angle / segmentAngle);
  
  return segmentIndex % totalSegments;
}

function spin() {
  const bet = parseInt(document.getElementById("bet").value);

  if (isNaN(bet) || bet < 10 || bet > score) {
    alert("Apuesta inválida. Debes apostar al menos 10 puntos y no exceder tus puntos actuales.");
    return;
  }

  if (score < 10) {
    alert("No tienes puntos suficientes para jugar.");
    return;
  }

  score -= bet;
  document.getElementById("score").textContent = score;

  const spinBtn = document.querySelector('.spin-btn');
  spinBtn.disabled = true;
  spinBtn.textContent = 'Girando...';

  const minSpins = 5;
  const randomSpin = Math.random() * 360;
  const totalRotation = (minSpins * 360) + randomSpin;

  currentRotation += totalRotation;

  const wheel = document.getElementById('wheel');
  wheel.style.transform = `rotate(${currentRotation}deg)`;

  setTimeout(() => {
    const winningIndex = getWinningSegment(currentRotation);
    const resultType = segmentTypes[winningIndex];
    const resultDiv = document.getElementById("result");

    resultDiv.classList.remove('win-animation', 'lose-animation', 'bonus-animation');

    let resultMessage = " ";

    if (resultType === selectedChoice) {
      const gain = bet * 2;
      score += gain;
      resultMessage = `🎉 ¡Ganaste! Salió ${resultType.toUpperCase()}. Ganas ${gain} puntos.`;
      resultDiv.classList.add('win-animation');
    } else if (resultType === 'bonus' && selectedChoice === 'bonus') {
      // Solo ganas el bonus si apostaste específicamente a BONUS
      const bonusGain = bet * 21;
      score += bonusGain;
      resultMessage = `🍀 ¡BONUS! Apostaste correctamente. Ganas ${bonusGain} puntos.`;
      resultDiv.classList.add('bonus-animation');
    } else {
      // Si sale bonus pero no apostaste a bonus, o cualquier otra combinación perdedora
      resultMessage = `❌ Fallaste. Salió ${resultType.toUpperCase()}. Pierdes ${bet} puntos.`;
      resultDiv.classList.add('lose-animation');
    }

    // Mostrar el resultado básico
    resultDiv.innerHTML = resultMessage;

    // Mostrar modal con deber o derecho aleatorio según el resultado
    if (resultType === 'deber') {
      const deberAleatorio = getRandomElement(deberes);
      showModal('deber', '📋 DEBER', deberAleatorio);
    } else if (resultType === 'derecho') {
      const derechoAleatorio = getRandomElement(derechos);
      showModal('derecho', '⚖️ DERECHO', derechoAleatorio);
    }

    document.getElementById("score").textContent = score;

    if (score <= 0) {
      alert("¡Te has quedado sin puntos! El juego ha terminado.");
      score = 0;
      document.getElementById("score").textContent = score;
    }

    spinBtn.disabled = false;
    spinBtn.textContent = 'Girar';
  }, 4000);
}

// Funciones para manejar el modal
function showModal(type, title, text) {
  const modalOverlay = document.getElementById('modalOverlay');
  const modalHeader = document.getElementById('modalHeader');
  const modalTitle = document.getElementById('modalTitle');
  const modalText = document.getElementById('modalText');
  const modalContent = document.querySelector('.modal-content');

  // Configurar el contenido del modal
  modalTitle.textContent = title;
  modalText.textContent = text;
  
  // Aplicar la clase CSS correspondiente al header
  modalHeader.className = `modal-header ${type}`;
  
  // Mostrar el modal con animación
  modalOverlay.classList.add('show');
  modalContent.classList.add('slide-in');
  
  // Remover la clase de animación después de que termine
  setTimeout(() => {
    modalContent.classList.remove('slide-in');
  }, 400);
}

function closeModal() {
  const modalOverlay = document.getElementById('modalOverlay');
  modalOverlay.classList.remove('show');
}