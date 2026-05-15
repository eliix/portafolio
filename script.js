// Contact Form Handling
document.addEventListener('DOMContentLoaded', function() {
  const contactForm = document.getElementById('contactForm');

  if (contactForm) {
    contactForm.addEventListener('submit', async function(e) {
      e.preventDefault();

      clearFormErrors();

      const name = document.getElementById('name').value.trim();
      const email = document.getElementById('email').value.trim();
      const message = document.getElementById('message').value.trim();

      let isValid = true;

      if (name === '') {
        showError('name', 'El nombre es obligatorio');
        isValid = false;
      } else if (name.length < 2) {
        showError('name', 'El nombre debe tener al menos 2 caracteres');
        isValid = false;
      } else if (!/\p{L}/u.test(name)) {
        showError('name', 'El nombre debe contener al menos una letra y no puede ser solo numeros');
        isValid = false;
      }

      if (email === '') {
        showError('email', 'El correo es obligatorio');
        isValid = false;
      } else if (!isValidEmail(email)) {
        showError('email', 'Por favor ingresa un correo valido');
        isValid = false;
      }

      if (message === '') {
        showError('message', 'El mensaje es obligatorio');
        isValid = false;
      } else if (message.length < 10) {
        showError('message', 'El mensaje debe tener al menos 10 caracteres');
        isValid = false;
      }

      if (!isValid) {
        showNotification('Por favor corrige los errores del formulario', 'error');
        return;
      }

      const submitBtn = contactForm.querySelector('.btn-submit');
      const originalText = submitBtn.textContent;
      submitBtn.textContent = 'Enviando...';
      submitBtn.disabled = true;

      const formData = new FormData(contactForm);

      try {
        const response = await fetch('https://api.web3forms.com/submit', {
          method: 'POST',
          body: formData
        });

        const data = await response.json();

        if (response.ok && data.success) {
          showNotification('Mensaje enviado con exito!', 'success');
          contactForm.reset();
        } else {
          throw new Error(data.message || 'Error al enviar el mensaje');
        }
      } catch (err) {
        console.error('Web3Forms submit error:', err);
        showNotification('Hubo un problema al enviar tu mensaje. Intenta nuevamente mas tarde.', 'error');
      } finally {
        submitBtn.textContent = originalText;
        submitBtn.disabled = false;
      }
    });
  }

  // Navigation button interactions
  const navBtns = document.querySelectorAll('.nav-btn');
  navBtns.forEach((btn, index) => {
    btn.addEventListener('click', function() {
      if (index === 0) {
        // Projects button
        document.getElementById('projects').scrollIntoView({ behavior: 'smooth' });
      } else {
        // Contact button
        document.getElementById('contact').scrollIntoView({ behavior: 'smooth' });
      }
    });
  });

  // Add hover effects to project cards
  const projectCards = document.querySelectorAll('.project-card');
  projectCards.forEach(card => {
    card.addEventListener('mouseenter', function() {
      this.style.transform = 'translateY(-8px)';
    });

    card.addEventListener('mouseleave', function() {
      this.style.transform = 'translateY(0)';
    });
  });

  // Intersection Observer for scroll animations
  const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0)';
      }
    });
  }, observerOptions);

  // Observe sections for animations
  const sections = document.querySelectorAll('section');
  sections.forEach(section => {
    observer.observe(section);
  });

  // Parallax effect on background
  document.addEventListener('mousemove', function(e) {
    const moveX = (e.clientX - window.innerWidth / 2) * 0.01;
    const moveY = (e.clientY - window.innerHeight / 2) * 0.01;

    document.body.style.backgroundPosition = `${50 + moveX}% ${50 + moveY}%`;
  });
});

// Notification function
function showNotification(message, type) {
  // Remove existing notification if any
  const existingNotification = document.querySelector('.notification');
  if (existingNotification) {
    existingNotification.remove();
  }
  
  // Create notification element
  const notification = document.createElement('div');
  notification.className = `notification notification-${type}`;
  notification.textContent = message;
  
  // Styles for notification
  notification.style.cssText = `
    position: fixed;
    bottom: 2rem;
    right: 2rem;
    padding: 1rem 2rem;
    border-radius: 12px;
    background: ${type === 'success' ? 'rgba(177, 156, 217, 0.9)' : 'rgba(220, 100, 100, 0.9)'};
    color: white;
    font-weight: 500;
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.15);
    backdrop-filter: blur(10px);
    -webkit-backdrop-filter: blur(10px);
    z-index: 1000;
    animation: slideInRight 0.3s ease-out;
  `;
  
  // Add animation keyframes if not already added
  if (!document.getElementById('notification-styles')) {
    const style = document.createElement('style');
    style.id = 'notification-styles';
    style.textContent = `
      @keyframes slideInRight {
        from {
          opacity: 0;
          transform: translateX(100px);
        }
        to {
          opacity: 1;
          transform: translateX(0);
        }
      }
      @keyframes slideOutRight {
        from {
          opacity: 1;
          transform: translateX(0);
        }
        to {
          opacity: 0;
          transform: translateX(100px);
        }
      }
    `;
    document.head.appendChild(style);
  }
  
  document.body.appendChild(notification);
  
  // Remove notification after 3 seconds
  setTimeout(() => {
    notification.style.animation = 'slideOutRight 0.3s ease-out forwards';
    setTimeout(() => {
      notification.remove();
    }, 300);
  }, 3000);
}

// Download CV button functionality
document.querySelector('.btn-download')?.addEventListener('click', function() {
  showNotification('Abriendo CV...', 'success');
});

function clearFormErrors() {
  document.querySelectorAll('.form-group').forEach((group) => {
    group.classList.remove('error');
    const message = group.querySelector('.error-message');
    if (message) {
      message.textContent = '';
    }
  });
}

function showError(fieldId, message) {
  const field = document.getElementById(fieldId);
  if (!field) {
    return;
  }
  const formGroup = field.closest('.form-group');
  if (!formGroup) {
    return;
  }
  const errorMessage = formGroup.querySelector('.error-message');
  formGroup.classList.add('error');
  if (errorMessage) {
    errorMessage.textContent = message;
  }
}

function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}
