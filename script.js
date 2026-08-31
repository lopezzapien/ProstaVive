/**
 * Men's Health & Longevity Review - Advertorial Interaction Logic
 * Native HTML5 Dialog Controller, Dynamic Date & Lead Capture Handlers
 */

document.addEventListener('DOMContentLoaded', () => {
  // 1. Dynamic Editorial Date Formatting
  const currentDateEl = document.getElementById('currentDate');
  const modalDateEl = document.getElementById('modalDate');
  const copyrightYearEl = document.getElementById('copyrightYear');

  const today = new Date();
  const formattedDate = today.toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric'
  });

  if (currentDateEl) currentDateEl.textContent = formattedDate;
  if (modalDateEl) modalDateEl.textContent = formattedDate;
  if (copyrightYearEl) copyrightYearEl.textContent = today.getFullYear();

  // 2. Scroll Progress Bar
  const scrollProgressBar = document.getElementById('scrollProgressBar');
  if (scrollProgressBar) {
    window.addEventListener('scroll', () => {
      const scrollTop = window.scrollY || document.documentElement.scrollTop;
      const docHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
      const progressPercent = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
      scrollProgressBar.style.width = `${Math.min(progressPercent, 100)}%`;
    }, { passive: true });
  }

  // 3. Native <dialog> Modal Management
  const leadModal = document.getElementById('leadModal');
  const openModalBtn = document.getElementById('openModalBtn');
  const closeModalBtn = document.getElementById('closeModalBtn');
  const leadForm = document.getElementById('leadForm');
  const userEmailInput = document.getElementById('userEmail');
  const emailError = document.getElementById('emailError');
  const submitLeadBtn = document.getElementById('submitLeadBtn');
  const modalSuccessState = document.getElementById('modalSuccessState');

  if (leadModal && openModalBtn) {
    // Open modal
    openModalBtn.addEventListener('click', () => {
      if (typeof leadModal.showModal === 'function') {
        leadModal.showModal();
        document.body.style.overflow = 'hidden'; // prevent background scrolling
        // Focus the email field automatically for smooth UX
        setTimeout(() => {
          if (userEmailInput) userEmailInput.focus();
        }, 150);
      } else {
        // Fallback for older browsers
        leadModal.setAttribute('open', '');
      }
    });

    // Close modal via button
    if (closeModalBtn) {
      closeModalBtn.addEventListener('click', () => {
        closeModal();
      });
    }

    // Close on backdrop click
    leadModal.addEventListener('click', (e) => {
      const dialogDimensions = leadModal.getBoundingClientRect();
      if (
        e.clientX < dialogDimensions.left ||
        e.clientX > dialogDimensions.right ||
        e.clientY < dialogDimensions.top ||
        e.clientY > dialogDimensions.bottom
      ) {
        closeModal();
      }
    });

    // Handle ESC key natively on dialog
    leadModal.addEventListener('cancel', () => {
      document.body.style.overflow = '';
    });
  }

  function closeModal() {
    if (leadModal) {
      leadModal.close();
      document.body.style.overflow = '';
    }
  }

  // 4. Form Validation & Submission Handling
  if (leadForm && userEmailInput) {
    // Email regex validation helper
    const isValidEmail = (email) => {
      return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    };

    userEmailInput.addEventListener('input', () => {
      if (emailError.textContent) {
        emailError.textContent = '';
        userEmailInput.classList.remove('input-error');
      }
    });

    leadForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const emailValue = userEmailInput.value.trim();

      if (!emailValue) {
        showError('Please enter your email address to continue.');
        return;
      }

      if (!isValidEmail(emailValue)) {
        showError('Please enter a valid email address (e.g. name@domain.com).');
        return;
      }

      // Valid state: simulate high-converting transition
      emailError.textContent = '';
      userEmailInput.classList.remove('input-error');
      submitLeadBtn.disabled = true;
      submitLeadBtn.innerHTML = `
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="animation: spin 1s linear infinite;">
          <line x1="12" y1="2" x2="12" y2="6"></line>
          <line x1="12" y1="18" x2="12" y2="22"></line>
          <line x1="4.93" y1="4.93" x2="7.76" y2="7.76"></line>
          <line x1="16.24" y1="16.24" x2="19.07" y2="19.07"></line>
          <line x1="2" y1="12" x2="6" y2="12"></line>
          <line x1="18" y1="12" x2="22" y2="12"></line>
          <line x1="4.93" y1="19.07" x2="7.76" y2="16.24"></line>
          <line x1="16.24" y1="7.76" x2="19.07" y2="4.93"></line>
        </svg>
        <span>Verifying Regional Allocation...</span>
      `;

      setTimeout(() => {
        leadForm.style.display = 'none';
        if (modalSuccessState) {
          modalSuccessState.style.display = 'flex';
        }
      }, 1100);
    });

    function showError(msg) {
      if (emailError) {
        emailError.textContent = msg;
      }
      userEmailInput.classList.add('input-error');
      userEmailInput.focus();
    }
  }
});
