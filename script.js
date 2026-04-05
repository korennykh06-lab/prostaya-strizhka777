// Переменные для калькулятора
let selections = { length: null, service: null, care: null };

// Цены на услуги в зависимости от длины волос
const priceList = {
    oneton: { short: 3400, medium: 4100, long: 5300, verylong: 6500 },
    melirovanie: { short: 2200, medium: 3000, long: 4000, verylong: 5200 },
    airtouch: { short: 5000, medium: 5800, long: 7000, verylong: 8500 },
    shatush: { short: 4200, medium: 5000, long: 6200, verylong: 7500 },
    babylights: { short: 4500, medium: 5200, long: 6500, verylong: 8000 },
    tonirovanie: { short: 2700, medium: 3500, long: 4800, verylong: 6000 }
};

// Цены на дополнительные услуги
const carePrices = {
    keratin: 4500,
    botox: 3800,
    polish: 2500,
    none: 0
};

// Функция для выбора опции в калькуляторе
function selectOption(step, value, element) {
    // Убираем выделение со всех опций в текущем шаге
    const options = element.parentElement.querySelectorAll('.quiz-option');
    options.forEach(opt => opt.classList.remove('selected'));
    // Выделяем выбранную опцию
    element.classList.add('selected');
    
    if (step === 1) {
        selections.length = value;
        // Переход к шагу 2
        document.getElementById('step1').style.display = 'none';
        document.getElementById('step2').style.display = 'block';
        // Обновляем индикаторы прогресса
        document.getElementById('step1-indicator').classList.remove('active');
        document.getElementById('step1-indicator').classList.add('completed');
        document.getElementById('step2-indicator').classList.add('active');
    } else if (step === 2) {
        selections.service = value;
        // Переход к шагу 3
        document.getElementById('step2').style.display = 'none';
        document.getElementById('step3').style.display = 'block';
        // Обновляем индикаторы прогресса
        document.getElementById('step2-indicator').classList.remove('active');
        document.getElementById('step2-indicator').classList.add('completed');
        document.getElementById('step3-indicator').classList.add('active');
    } else if (step === 3) {
        selections.care = value;
        
        // Расчет итоговой цены
        let price = 0;
        if (selections.service && selections.length) {
            price = priceList[selections.service][selections.length];
        }
        if (selections.care !== 'none') {
            price += carePrices[selections.care];
        }
        
        // Показываем результат
        document.getElementById('step3').style.display = 'none';
        document.getElementById('quiz-result').style.display = 'block';
        document.getElementById('step3-indicator').classList.remove('active');
        document.getElementById('step3-indicator').classList.add('completed');
        document.getElementById('result-price').textContent = price + ' ₽';
    }
}

// Функция сброса калькулятора
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

// Функция для показа/скрытия деталей услуги
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
        if (cards.length === 0) return;
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
        if (!dotsContainer) return;
        dotsContainer.innerHTML = '';
        const totalGroups = Math.ceil(cards.length / visibleCards);
        for (let i = 0; i < totalGroups; i++) {
            const dot = document.createElement('div');
            dot.classList.add('dot');
            if (i === 0) dot.classList.add('active');
            dot.addEventListener('click', () => {
                currentIdx = i * visibleCards;
                if (currentIdx >= cards.length) currentIdx = cards.length - visibleCards;
                if (currentIdx < 0) currentIdx = 0;
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

// Инициализация обработчиков для калькулятора
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