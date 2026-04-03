// Переменные для калькулятора
let currentStep = 1;
let selections = { length: null, complexity: null, care: null };

function selectOption(step, value) {
    const options = document.querySelectorAll(`#step${step} .quiz-option`);
    options.forEach(opt => opt.classList.remove('selected'));
    event.target.classList.add('selected');
    
    if (step === 1) {
        selections.length = value;
        document.getElementById('step1').style.display = 'none';
        document.getElementById('step2').style.display = 'block';
        document.getElementById('step1-indicator').classList.remove('active');
        document.getElementById('step1-indicator').classList.add('completed');
        document.getElementById('step2-indicator').classList.add('active');
        currentStep = 2;
    } else if (step === 2) {
        selections.complexity = value;
        document.getElementById('step2').style.display = 'none';
        document.getElementById('step3').style.display = 'block';
        document.getElementById('step2-indicator').classList.remove('active');
        document.getElementById('step2-indicator').classList.add('completed');
        document.getElementById('step3-indicator').classList.add('active');
        currentStep = 3;
    } else if (step === 3) {
        selections.care = value;
        let price = 0;
        if (selections.length === 'short') price = 3400;
        else if (selections.length === 'medium') price = 4100;
        else if (selections.length === 'long') price = 5300;
        if (selections.complexity === 'medium') price += 1500;
        else if (selections.complexity === 'complex') price += 3000;
        if (selections.care === 'treatment') price += 2500;
        else if (selections.care === 'keratin') price += 4000;
        document.getElementById('step3').style.display = 'none';
        document.getElementById('quiz-result').style.display = 'block';
        document.getElementById('step3-indicator').classList.remove('active');
        document.getElementById('step3-indicator').classList.add('completed');
        document.getElementById('result-price').textContent = price + ' ₽';
    }
}

function resetQuiz() {
    selections = { length: null, complexity: null, care: null };
    document.getElementById('quiz-result').style.display = 'none';
    document.getElementById('step1').style.display = 'block';
    document.getElementById('step2').style.display = 'none';
    document.getElementById('step3').style.display = 'none';
    document.getElementById('step1-indicator').classList.remove('completed', 'active');
    document.getElementById('step2-indicator').classList.remove('completed', 'active');
    document.getElementById('step3-indicator').classList.remove('completed', 'active');
    document.getElementById('step1-indicator').classList.add('active');
    document.querySelectorAll('.quiz-option').forEach(opt => opt.classList.remove('selected'));
    currentStep = 1;
}

function toggleTip(btn) {
    const tipCard = btn.closest('.tip-card');
    const fullText = tipCard.querySelector('.full-tip-text');
    if (fullText.classList.contains('show')) {
        fullText.classList.remove('show');
        btn.textContent = 'Подробнее';
    } else {
        fullText.classList.add('show');
        btn.textContent = 'Скрыть';
    }
}

function toggleDetails(btn) {
    const serviceCard = btn.closest('.service-card');
    const detailsWrapper = serviceCard.querySelector('.service-details-wrapper');
    if (detailsWrapper.classList.contains('show')) {
        detailsWrapper.classList.remove('show');
        btn.textContent = 'Подробнее';
    } else {
        // Закрываем другие открытые детали
        document.querySelectorAll('.service-details-wrapper.show').forEach(d => {
            d.classList.remove('show');
            const otherBtn = d.closest('.service-card').querySelector('.service-detail-btn');
            if (otherBtn) otherBtn.textContent = 'Подробнее';
        });
        detailsWrapper.classList.add('show');
        btn.textContent = 'Скрыть';
    }
}

// Обработка формы бронирования
const bookingForm = document.getElementById('booking-form');
if (bookingForm) {
    bookingForm.addEventListener('submit', function(e) {
        e.preventDefault();
        alert('Спасибо! Мы скоро свяжемся с вами для подтверждения записи.');
        this.reset();
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

    // Закрытие меню при клике на ссылку
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
    
    function updateSlider() {
        const cardWidth = cards[0].offsetWidth + 30;
        const shift = -currentIdx * cardWidth;
        track.style.transform = `translateX(${shift}px)`;
        const activeDot = Math.floor(currentIdx / visibleCards);
        const dotElements = document.querySelectorAll('.dot');
        dotElements.forEach((dot, idx) => {
            if (idx === activeDot) dot.classList.add('active');
            else dot.classList.remove('active');
        });
    }
    
    function createDots() {
        dotsContainer.innerHTML = '';
        const totalGroups = Math.ceil(cards.length / visibleCards);
        for (let i = 0; i < totalGroups; i++) {
            const dot = document.createElement('div');
            dot.classList.add('dot');
            if (i === 0) dot.classList.add('active');
            dot.addEventListener('click', () => {
                currentIdx = i * visibleCards;
                if (currentIdx >= cards.length) currentIdx = cards.length - visibleCards;
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

// Плавная прокрутка к якорям
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        const href = this.getAttribute('href');
        if (href === '#') return;
        
        const target = document.querySelector(href);
        if (target) {
            e.preventDefault();
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});