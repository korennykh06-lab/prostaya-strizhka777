// Переменные для калькулятора
let selections = { length: null, service: null, care: null };

// Цены на услуги (только для коротких, средних, длинных)
const priceList = {
    oneton: { short: 3400, medium: 4100, long: 5300 },
    melirovanie: { short: 2200, medium: 3000, long: 4000 },
    airtouch: { short: 4800, medium: 5800, long: 7000 },
    shatush: { short: 4200, medium: 5000, long: 6200 }
};

const carePrices = {
    keratin: 4500,
    botox: 3800,
    none: 0
};

// Функция выбора опции
function selectOption(step, value, element) {
    const options = element.parentElement.querySelectorAll('.quiz-option');
    options.forEach(opt => opt.classList.remove('selected'));
    element.classList.add('selected');
    
    if (step === 1) {
        selections.length = value;
        document.getElementById('step1').style.display = 'none';
        document.getElementById('step2').style.display = 'block';
        document.getElementById('step1-indicator').classList.remove('active');
        document.getElementById('step1-indicator').classList.add('completed');
        document.getElementById('step2-indicator').classList.add('active');
    } else if (step === 2) {
        selections.service = value;
        document.getElementById('step2').style.display = 'none';
        document.getElementById('step3').style.display = 'block';
        document.getElementById('step2-indicator').classList.remove('active');
        document.getElementById('step2-indicator').classList.add('completed');
        document.getElementById('step3-indicator').classList.add('active');
    } else if (step === 3) {
        selections.care = value;
        
        let price = 0;
        if (selections.service && selections.length) {
            price = priceList[selections.service][selections.length];
        }
        if (selections.care !== 'none') {
            price += carePrices[selections.care];
        }
        
        document.getElementById('step3').style.display = 'none';
        document.getElementById('quiz-result').style.display = 'block';
        document.getElementById('step3-indicator').classList.remove('active');
        document.getElementById('step3-indicator').classList.add('completed');
        document.getElementById('result-price').textContent = price + ' ₽';
    }
}

// Сброс калькулятора
function resetQuiz() {
    selections = { length: null, service: null, care: null };
    document.getElementById('quiz-result').style.display = 'none';
    document.getElementById('step1').style.display = 'block';
    document.getElementById('step2').style.display = 'none';
    document.getElementById('step3').style.display = 'none';
    document.getElementById('step1-indicator').classList.remove('completed', 'active');
    document.getElementById('step2-indicator').classList.remove('completed', 'active');
    document.getElementById('step3-indicator').classList.remove('completed', 'active');
    document.getElementById('step1-indicator').classList.add('active');
    document.querySelectorAll('.quiz-option').forEach(opt => opt.classList.remove('selected'));
}

// Показать/скрыть детали услуги
function toggleDetails(btn) {
    const serviceCard = btn.closest('.service-card');
    const detailsWrapper = serviceCard.querySelector('.service-details-wrapper');
    if (detailsWrapper.classList.contains('show')) {
        detailsWrapper.classList.remove('show');
        btn.textContent = 'Подробнее';
    } else {
        document.querySelectorAll('.service-details-wrapper.show').forEach(d => {
            d.classList.remove('show');
            const otherBtn = d.closest('.service-card').querySelector('.service-detail-btn');
            if (otherBtn) otherBtn.textContent = 'Подробнее';
        });
        detailsWrapper.classList.add('show');
        btn.textContent = 'Скрыть';
    }
}

// Форма бронирования
const bookingForm = document.getElementById('booking-form');
if (bookingForm) {
    bookingForm.addEventListener('submit', function(e) {
        e.preventDefault();
        alert('Спасибо! Мы скоро свяжемся с вами.');
        this.reset();
    });
}

// Премиальная форма отзыва
const premiumForm = document.getElementById('review-form-premium');
if (premiumForm) {
    const stars = document.querySelectorAll('#star-rating i');
    const ratingInput = document.getElementById('review-rating-premium');
    let currentRating = 0;
    
    function updateStars(rating) {
        stars.forEach((star, index) => {
            if (index < rating) {
                star.className = 'fas fa-star active';
            } else {
                star.className = 'far fa-star';
            }
        });
        ratingInput.value = rating;
        currentRating = rating;
    }
    
    stars.forEach(star => {
        star.addEventListener('click', function() {
            const value = parseInt(this.getAttribute('data-value'));
            updateStars(value);
        });
        
        star.addEventListener('mouseenter', function() {
            const value = parseInt(this.getAttribute('data-value'));
            stars.forEach((s, idx) => {
                if (idx < value) {
                    s.className = 'fas fa-star hover';
                } else {
                    s.className = 'far fa-star hover';
                }
            });
        });
    });
    
    const starsContainer = document.getElementById('star-rating');
    if (starsContainer) {
        starsContainer.addEventListener('mouseleave', function() {
            updateStars(currentRating);
        });
    }
    
    premiumForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const name = document.getElementById('review-name-premium').value.trim();
        const rating = parseInt(ratingInput.value);
        const text = document.getElementById('review-text-premium').value.trim();
        const messageDiv = document.getElementById('review-message-premium');
        
        if (!name) {
            messageDiv.textContent = 'Пожалуйста, укажите ваше имя';
            messageDiv.className = 'review-message error';
            setTimeout(() => {
                messageDiv.textContent = '';
                messageDiv.className = 'review-message';
            }, 3000);
            return;
        }
        
        if (rating === 0) {
            messageDiv.textContent = 'Пожалуйста, оцените нашу работу (выберите количество звезд)';
            messageDiv.className = 'review-message error';
            setTimeout(() => {
                messageDiv.textContent = '';
                messageDiv.className = 'review-message';
            }, 3000);
            return;
        }
        
        if (!text) {
            messageDiv.textContent = 'Пожалуйста, напишите ваш отзыв';
            messageDiv.className = 'review-message error';
            setTimeout(() => {
                messageDiv.textContent = '';
                messageDiv.className = 'review-message';
            }, 3000);
            return;
        }
        
        messageDiv.textContent = 'Спасибо за ваш отзыв! Он будет опубликован после модерации.';
        messageDiv.className = 'review-message success';
        
        document.getElementById('review-name-premium').value = '';
        document.getElementById('review-text-premium').value = '';
        updateStars(0);
        
        setTimeout(() => {
            messageDiv.textContent = '';
            messageDiv.className = 'review-message';
        }, 5000);
    });
}

// Бургер-меню
const burgerMenu = document.getElementById('burgerMenu');
const navLinks = document.getElementById('navLinks');

if (burgerMenu && navLinks) {
    burgerMenu.addEventListener('click', function() {
        this.classList.toggle('active');
        navLinks.classList.toggle('active');
        document.body.style.overflow = navLinks.classList.contains('active') ? 'hidden' : '';
    });
    
    navLinks.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
            burgerMenu.classList.remove('active');
            navLinks.classList.remove('active');
            document.body.style.overflow = '';
        });
    });
}

// Слайдер отзывов
const track = document.getElementById('reviewsTrack');
const prevBtn = document.getElementById('prevReviewBtn');
const nextBtn = document.getElementById('nextReviewBtn');
const dotsContainer = document.getElementById('reviewDots');

if (track && prevBtn && nextBtn) {
    const cards = Array.from(document.querySelectorAll('.review-card'));
    let currentIdx = 0;
    let visibleCards = window.innerWidth <= 768 ? 1 : 2;
    let startX = 0;
    let isDragging = false;
    
    function updateSlider() {
        if (cards.length === 0) return;
        const cardWidth = cards[0].offsetWidth + 25;
        const shift = -currentIdx * cardWidth;
        track.style.transform = `translateX(${shift}px)`;
        const activeDot = Math.floor(currentIdx / visibleCards);
        document.querySelectorAll('.dot').forEach((dot, idx) => {
            dot.classList.toggle('active', idx === activeDot);
        });
    }
    
    function createDots() {
        if (!dotsContainer) return;
        dotsContainer.innerHTML = '';
        const totalGroups = Math.ceil(cards.length / visibleCards);
        for (let i = 0; i < totalGroups; i++) {
            const dot = document.createElement('div');
            dot.classList.add('dot');
            if (i === 0) dot.classList.add('active');
            dot.addEventListener('click', () => {
                currentIdx = i * visibleCards;
                if (currentIdx >= cards.length) currentIdx = Math.max(0, cards.length - visibleCards);
                updateSlider();
            });
            dotsContainer.appendChild(dot);
        }
    }
    
    function nextSlide() {
        if (currentIdx + visibleCards < cards.length) {
            currentIdx += visibleCards;
        } else {
            currentIdx = 0;
        }
        updateSlider();
    }
    
    function prevSlide() {
        if (currentIdx - visibleCards >= 0) {
            currentIdx -= visibleCards;
        } else {
            currentIdx = Math.max(0, cards.length - visibleCards);
        }
        updateSlider();
    }
    
    track.addEventListener('touchstart', (e) => {
        startX = e.touches[0].clientX;
        isDragging = true;
    });
    
    track.addEventListener('touchend', (e) => {
        if (!isDragging) return;
        const endX = e.changedTouches[0].clientX;
        const diff = startX - endX;
        if (Math.abs(diff) > 50) {
            diff > 0 ? nextSlide() : prevSlide();
        }
        isDragging = false;
    });
    
    function handleResize() {
        visibleCards = window.innerWidth <= 768 ? 1 : 2;
        currentIdx = 0;
        createDots();
        updateSlider();
    }
    
    prevBtn.addEventListener('click', prevSlide);
    nextBtn.addEventListener('click', nextSlide);
    window.addEventListener('resize', handleResize);
    createDots();
    updateSlider();
}

// Инициализация калькулятора
function initCalculator() {
    document.querySelectorAll('#step1 .quiz-option').forEach(opt => {
        opt.addEventListener('click', function() {
            selectOption(1, this.getAttribute('data-value'), this);
        });
    });
    document.querySelectorAll('#step2 .quiz-option').forEach(opt => {
        opt.addEventListener('click', function() {
            selectOption(2, this.getAttribute('data-value'), this);
        });
    });
    document.querySelectorAll('#step3 .quiz-option').forEach(opt => {
        opt.addEventListener('click', function() {
            selectOption(3, this.getAttribute('data-value'), this);
        });
    });
}

// Плавная прокрутка
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        const href = this.getAttribute('href');
        if (href === '#') return;
        const target = document.querySelector(href);
        if (target) {
            e.preventDefault();
            target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    });
});

document.addEventListener('DOMContentLoaded', initCalculator);