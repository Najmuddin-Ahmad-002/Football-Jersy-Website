document.addEventListener("DOMContentLoaded", function () {
  const carousels = document.querySelectorAll(".carousel-container");

  carousels.forEach((carousel) => {
    const track = carousel.querySelector(".carousel-track");
    const prevBtn = carousel.querySelector(".prev");
    const nextBtn = carousel.querySelector(".next");
    const items = carousel.querySelectorAll(".carousel-item");
    const itemWidth = items[0].offsetWidth + 10; 
    const visibleItems = 4;
    const totalItems = items.length;
    let currentPosition = 0;

    nextBtn.addEventListener("click", () => {
      if (currentPosition < totalItems - visibleItems) {
        currentPosition++;
        track.style.transform = `translateX(-${itemWidth * currentPosition}px)`;
      }
    });

    prevBtn.addEventListener("click", () => {
      if (currentPosition > 0) {
        currentPosition--;
        track.style.transform = `translateX(-${itemWidth * currentPosition}px)`;
      }
    });
  });
});
