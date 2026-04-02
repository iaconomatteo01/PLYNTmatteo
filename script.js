// NAVBAR SCROLL
const navbar = document.querySelector('.navbar');
window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 60);
});

// BURGER MENU
const burger = document.getElementById('burger');
const navLinks = document.querySelector('.nav-links');

burger.addEventListener('click', () => {
  const isOpen = navLinks.style.display === 'flex';
  navLinks.style.display = isOpen ? 'none' : 'flex';
  if (!isOpen) {
    navLinks.style.flexDirection = 'column';
    navLinks.style.position = 'absolute';
    navLinks.style.top = '100%';
    navLinks.style.left = '0';
    navLinks.style.right = '0';
    navLinks.style.background = '#0E2118';
    navLinks.style.padding = '20px 24px';
    navLinks.style.borderBottom = '1px solid #1C3A2B';
    navLinks.style.gap = '20px';
  }
});

//TOAST NOTIFICATION
function showToast(msg, duration = 3000) {
  const toast = document.getElementById('toast');
  toast.textContent = msg;
  toast.classList.add('show');
  setTimeout(() => toast.classList.remove('show'), duration);
}

//ADD TO CART
function addToCart(btn, productName) {
  const original = btn.textContent;
  btn.textContent = '✓ Ajouté !';
  btn.style.background = '#4A8C5C';
  btn.disabled = true;
  showToast(`🛒 ${productName} ajouté au panier !`);
  setTimeout(() => {
    btn.textContent = original;
    btn.style.background = '';
    btn.disabled = false;
  }, 2000);
}

//SCROLL ANIMATIONS
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.style.opacity = '1';
      entry.target.style.transform = 'translateY(0)';
    }
  });
}, { threshold: 0.15 });

document.querySelectorAll('.value-card, .product-card').forEach(el => {
  el.style.opacity = '0';
  el.style.transform = 'translateY(30px)';
  el.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
  observer.observe(el);
});

//STAR RATING
const stars = document.querySelectorAll('.star');
const noteInput = document.getElementById('note');
let selectedNote = 0;

stars.forEach(star => {
  // Hover
  star.addEventListener('mouseenter', () => {
    const val = parseInt(star.dataset.val);
    stars.forEach(s => {
      s.classList.toggle('hover', parseInt(s.dataset.val) <= val);
    });
  });

  // Mouse leave
  star.parentElement.addEventListener('mouseleave', () => {
    stars.forEach(s => {
      s.classList.remove('hover');
      s.classList.toggle('active', parseInt(s.dataset.val) <= selectedNote);
    });
  });

  // Click
  star.addEventListener('click', () => {
    selectedNote = parseInt(star.dataset.val);
    noteInput.value = selectedNote;
    stars.forEach(s => {
      s.classList.toggle('active', parseInt(s.dataset.val) <= selectedNote);
    });
    document.getElementById('err-note').classList.remove('visible');
  });
});

//FORM VALIDATION & SUBMIT
const form = document.getElementById('avis-form');

function showError(id, msg) {
  const el = document.getElementById(id);
  el.textContent = msg;
  el.classList.add('visible');
}

function clearError(id) {
  document.getElementById(id).classList.remove('visible');
}

function validateForm() {
  let valid = true;
  const nom = document.getElementById('nom').value.trim();
  const email = document.getElementById('email').value.trim();
  const produit = document.getElementById('produit').value;
  const commentaire = document.getElementById('commentaire').value.trim();

  if (!nom || nom.length < 2) {
    showError('err-nom', 'Prénom requis (min. 2 caractères)');
    document.getElementById('nom').classList.add('error');
    valid = false;
  } else {
    clearError('err-nom');
    document.getElementById('nom').classList.remove('error');
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    showError('err-email', 'Email invalide');
    document.getElementById('email').classList.add('error');
    valid = false;
  } else {
    clearError('err-email');
    document.getElementById('email').classList.remove('error');
  }

  if (selectedNote === 0) {
    showError('err-note', 'Merci de sélectionner une note');
    valid = false;
  } else {
    clearError('err-note');
  }

  if (!produit) {
    showError('err-produit', 'Merci de choisir un produit');
    document.getElementById('produit').classList.add('error');
    valid = false;
  } else {
    clearError('err-produit');
    document.getElementById('produit').classList.remove('error');
  }

  if (!commentaire || commentaire.length < 10) {
    showError('err-commentaire', 'Commentaire requis (min. 10 caractères)');
    document.getElementById('commentaire').classList.add('error');
    valid = false;
  } else {
    clearError('err-commentaire');
    document.getElementById('commentaire').classList.remove('error');
  }

  return valid;
}

form.addEventListener('submit', (e) => {
  e.preventDefault();
  if (!validateForm()) return;

  const btn = document.getElementById('submit-btn');
  btn.textContent = 'Publication...';
  btn.disabled = true;

  const formData = new FormData(form);

  fetch('../DONNEES/submit_avis.php', {
    method: 'POST',
    body: formData
  })
  .then(res => res.json())
  .then(data => {
    if (data.success) {
      document.getElementById('form-success').classList.add('visible');
      form.reset();
      selectedNote = 0;
      noteInput.value = 0;
      stars.forEach(s => s.classList.remove('active'));
      showToast('🌿 Merci pour votre avis !');
      loadAvis(); // recharge les avis depuis la BDD
    } else {
      showToast('❌ Erreur : ' + (data.message || 'Réessaie'));
    }
    btn.textContent = 'Publier mon avis';
    btn.disabled = false;
  })
  .catch(() => {
    showToast('❌ Connexion impossible au serveur');
    btn.textContent = 'Publier mon avis';
    btn.disabled = false;
  });
});

//CHARGEMENT DES AVIS DEPUIS LA BDD
function loadAvis() {
  fetch('../DONNEES/get_avis.php')
    .then(res => res.json())
    .then(data => {
      if (!data.success) return;

      const grid = document.getElementById('avis-grid');
      grid.innerHTML = '';

      data.avis.forEach(avis => {
        const stars = Array.from({length: 5}, (_, i) =>
          `<span class="star${i < avis.note ? ' active' : ''}" style="color:${i < avis.note ? '#A8FF78' : '#1C3A2B'}">★</span>`
        ).join('');

        const card = document.createElement('div');
        card.className = 'avis-card';
        card.innerHTML = `
          <div class="avis-stars">${stars}</div>
          <p class="avis-text">« ${avis.commentaire} »</p>
          <span class="avis-author">${avis.nom} — ${avis.produit}</span>
        `;
        grid.appendChild(card);
      });
    })
    .catch(() => console.log('Avis non chargés (mode local ?)'));
}

// Charger les avis au démarrage de la page
document.addEventListener('DOMContentLoaded', loadAvis);
