document.addEventListener("DOMContentLoaded", function() {
    const prevBtn = document.querySelector(".prev");
    const nextBtn = document.querySelector(".next");
    const images = document.querySelector(".images");

    let currentIndex = 0;

    nextBtn.addEventListener("click", function() {
        if (currentIndex < images.children.length - 4) {
            currentIndex++;
            updateCarousel();
        }
    });

    prevBtn.addEventListener("click", function() {
        if (currentIndex > 0) {
            currentIndex--;
            updateCarousel();
        }
    });

    function updateCarousel() {
        const slideWidth = images.children[0].offsetWidth;
        images.style.transform = `translateX(-${slideWidth * currentIndex}px)`;
    }
});
