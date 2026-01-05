document.addEventListener('DOMContentLoaded', () => {

    const elementsToAnimate = document.querySelectorAll('.fade-in');

    const observerOptions = {
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    elementsToAnimate.forEach(element => {
        observer.observe(element);
    });

    const searchBtn = document.querySelector('.search-btn');
    const searchInput = document.querySelector('.search-input');

    searchBtn.addEventListener('click', () => {
        if(searchInput.value.trim() === "") {
            alert("⚠️ Escribir algo para buscar ⚠️");
        } else {
            alert(`🔍 Buscando propiedades en: ${searchInput.value}...`)
        }
    });
});