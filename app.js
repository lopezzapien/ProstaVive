/**
 * VITALITY BIOCELL™ - Advertorial Interactivity & CRO Controller
 * Vanilla JS de alto rendimiento, 0 dependencias externas.
 */

document.addEventListener('DOMContentLoaded', () => {
  initDateStamp();
  initReadingProgressBar();
  initBeforeAfterSlider();
  initStickyCtaBar();
  initConversionModal();
});

/**
 * 1. Timestamp dinámico y actualizado en español
 */
function initDateStamp() {
  const dateEl = document.getElementById('currentDateStamp');
  if (!dateEl) return;

  const now = new Date();
  const options = { year: 'numeric', month: 'long', day: 'numeric' };
  const formattedDate = now.toLocaleDateString('es-ES', options);
  dateEl.textContent = `Actualizado: ${formattedDate}`;
}

/**
 * 2. Barra de Progreso de Lectura Superior
 */
function initReadingProgressBar() {
  const progressBar = document.getElementById('progressBar');
  if (!progressBar) return;

  window.addEventListener('scroll', () => {
    const winScroll = document.documentElement.scrollTop || document.body.scrollTop;
    const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    const scrolled = (winScroll / height) * 100;
    progressBar.style.width = scrolled + '%';
  }, { passive: true });
}

/**
 * 3. Slider Interactivo Antes / Después (Touch + Mouse + Teclado)
 */
function initBeforeAfterSlider() {
  const sliderContainer = document.getElementById('beforeAfterSlider');
  const afterLayer = document.getElementById('afterLayer');
  const sliderHandle = document.getElementById('sliderHandle');

  if (!sliderContainer || !afterLayer || !sliderHandle) return;

  let isDragging = false;

  function updateSliderPosition(xCoord) {
    const rect = sliderContainer.getBoundingClientRect();
    let xPos = xCoord - rect.left;

    // Limitar entre 0% y 100% con un margen de seguridad de 5%
    if (xPos < rect.width * 0.05) xPos = rect.width * 0.05;
    if (xPos > rect.width * 0.95) xPos = rect.width * 0.95;

    const percentage = (xPos / rect.width) * 100;

    // Aplicar posicionamiento fluido
    afterLayer.style.width = `${percentage}%`;
    sliderHandle.style.left = `${percentage}%`;
  }

  // Eventos Mouse
  sliderContainer.addEventListener('mousedown', (e) => {
    isDragging = true;
    updateSliderPosition(e.clientX);
  });

  window.addEventListener('mouseup', () => {
    isDragging = false;
  });

  window.addEventListener('mousemove', (e) => {
    if (!isDragging) return;
    updateSliderPosition(e.clientX);
  });

  // Eventos Touch (Móviles y Tablets)
  sliderContainer.addEventListener('touchstart', (e) => {
    isDragging = true;
    updateSliderPosition(e.touches[0].clientX);
  }, { passive: true });

  window.addEventListener('touchend', () => {
    isDragging = false;
  });

  window.addEventListener('touchmove', (e) => {
    if (!isDragging) return;
    updateSliderPosition(e.touches[0].clientX);
  }, { passive: true });

  // Accesibilidad Teclado (Flechas Izquierda / Derecha)
  sliderContainer.addEventListener('keydown', (e) => {
    const currentPercent = parseFloat(sliderHandle.style.left) || 50;
    if (e.key === 'ArrowLeft') {
      const newPercent = Math.max(5, currentPercent - 5);
      afterLayer.style.width = `${newPercent}%`;
      sliderHandle.style.left = `${newPercent}%`;
      e.preventDefault();
    } else if (e.key === 'ArrowRight') {
      const newPercent = Math.min(95, currentPercent + 5);
      afterLayer.style.width = `${newPercent}%`;
      sliderHandle.style.left = `${newPercent}%`;
      e.preventDefault();
    }
  });
}

/**
 * 4. Barra Sticky Flotante de Conversión
 */
function initStickyCtaBar() {
  const stickyBar = document.getElementById('stickyCtaBar');
  const heroSection = document.querySelector('.article-hero');
  const ctaSection = document.getElementById('ctaSection');

  if (!stickyBar || !heroSection) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      // Mostrar sticky bar cuando el usuario pasa la sección Hero
      if (!entry.isIntersecting && window.scrollY > 300) {
        stickyBar.classList.add('visible');
      } else {
        stickyBar.classList.remove('visible');
      }
    });
  }, { threshold: 0.1 });

  observer.observe(heroSection);

  // Ocultar sticky bar cuando el CTA principal entra en pantalla para no duplicar
  if (ctaSection) {
    const ctaObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          stickyBar.classList.remove('visible');
        }
      });
    }, { threshold: 0.2 });

    ctaObserver.observe(ctaSection);
  }
}

/**
 * 5. Modal de Verificación de Disponibilidad CRO
 */
function initConversionModal() {
  const modal = document.getElementById('verificationModal');
  const openButtons = [
    document.getElementById('mainCtaBtn'),
    document.getElementById('stickyCtaBtn')
  ].filter(Boolean);
  const closeBtn = document.getElementById('modalCloseBtn');
  const loader = document.getElementById('modalLoader');
  const result = document.getElementById('modalResult');
  const progressFill = document.getElementById('modalProgressFill');
  const statusText = document.getElementById('modalStatusText');
  const claimOrderBtn = document.getElementById('claimOrderBtn');

  if (!modal) return;

  function openModal() {
    modal.classList.add('active');
    modal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';

    // Reiniciar y arrancar simulación de verificación
    loader.style.display = 'block';
    result.style.display = 'none';
    progressFill.style.width = '0%';
    statusText.textContent = 'Consultando base de datos de lotes frescos...';

    // Animación de chequeo clínico en 3 etapas
    setTimeout(() => {
      progressFill.style.width = '35%';
      statusText.textContent = 'Verificando trazabilidad de pureza liposomal...';
    }, 600);

    setTimeout(() => {
      progressFill.style.width = '75%';
      statusText.textContent = 'Comprobando reserva de lote para tu código postal...';
    }, 1400);

    setTimeout(() => {
      progressFill.style.width = '100%';
      setTimeout(() => {
        loader.style.display = 'none';
        result.style.display = 'block';
        startCountdownTimer();
      }, 400);
    }, 2200);
  }

  function closeModal() {
    modal.classList.remove('active');
    modal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  openButtons.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      openModal();
    });
  });

  if (closeBtn) closeBtn.addEventListener('click', closeModal);

  modal.addEventListener('click', (e) => {
    if (e.target === modal) closeModal();
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.classList.contains('active')) {
      closeModal();
    }
  });

  if (claimOrderBtn) {
    claimOrderBtn.addEventListener('click', () => {
      alert('¡Redirigiendo de forma segura a la pasarela de pedido con Garantía de 90 Días!');
      closeModal();
    });
  }
}

/**
 * 6. Temporizador regresivo de reserva
 */
let timerInterval = null;
function startCountdownTimer() {
  if (timerInterval) clearInterval(timerInterval);
  
  let timeLeft = 9 * 60 + 59; // 9 minutos 59 segundos
  const timerDisplay = document.getElementById('timerCountdown');
  if (!timerDisplay) return;

  timerInterval = setInterval(() => {
    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;
    timerDisplay.textContent = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
    
    if (timeLeft <= 0) {
      clearInterval(timerInterval);
      timerDisplay.textContent = "00:00 (Lote reservado temporalmente)";
    }
    timeLeft--;
  }, 1000);
}
