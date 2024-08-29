let currentIndex = 0;

function showSlide(index) {
    const slides = document.querySelector('.slides');
    const totalSlides = slides.children.length;

    if (index >= totalSlides) {
        currentIndex = 0;
    } else if (index < 0) {
        currentIndex = totalSlides - 1;
    } else {
        currentIndex = index;
    }

    slides.style.transform = `translateX(-${currentIndex * 100}%)`;
}

function changeSlide(step) {
    showSlide(currentIndex + step);
}

// Auto-slide
setInterval(() => {
    changeSlide(1);
}, 5000);

function goToLoginPage(){
    window.location.href = 'login.html';
}

function goToCartPage(){
    window.location.href = 'cart.html';
}

function goToOrderPage(){
    window.location.href = 'orders.html';
}
