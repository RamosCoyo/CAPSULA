document.addEventListener('DOMContentLoaded', function() {

    // --- MENÚ MÓVIL ---
    const menuBtn = document.getElementById('menu-btn');
    const mobileMenu = document.getElementById('mobile-menu');

    if (menuBtn && mobileMenu) {
        menuBtn.addEventListener('click', () => {
            const isOpen = !mobileMenu.classList.contains('hidden');
            mobileMenu.classList.toggle('hidden');
            menuBtn.setAttribute('aria-expanded', String(!isOpen));
            menuBtn.setAttribute('aria-label', isOpen ? 'Abrir menú de navegación' : 'Cerrar menú de navegación');
        });

        // Cerrar el menú al elegir una sección
        mobileMenu.querySelectorAll('a').forEach((link) => {
            link.addEventListener('click', () => {
                mobileMenu.classList.add('hidden');
                menuBtn.setAttribute('aria-expanded', 'false');
                menuBtn.setAttribute('aria-label', 'Abrir menú de navegación');
            });
        });
    }

    // --- CARRUSEL DE PROMOS ---
    const track = document.getElementById('promo-track');
    const toggleBtn = document.getElementById('promo-toggle');
    const toggleLabel = document.getElementById('promo-toggle-label');
    const toggleIcon = document.getElementById('promo-toggle-icon');
    // CAMBIO A 7 SEGUNDOS (7000 milisegundos)
    const intervalTime = 7000;
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    let isTransitioning = false;
    let autoplayTimer = null;
    // Si el sistema pide movimiento reducido, el carrusel arranca pausado
    // y el usuario puede reanudarlo manualmente con el botón.
    let userPaused = reducedMotion.matches;

    if (!track || track.children.length <= 1) return;

    function slideNext() {
        if (isTransitioning) return;
        isTransitioning = true;

        const slideWidth = track.firstElementChild.getBoundingClientRect().width;

        track.style.transition = 'transform 1s ease-in-out';
        track.style.transform = `translateX(-${slideWidth}px)`;

        setTimeout(() => {
            track.style.transition = 'none';
            track.appendChild(track.firstElementChild);
            track.style.transform = 'translateX(0)';
            
            setTimeout(() => {
                isTransitioning = false;
            }, 50);

        }, 1000); 
    }

    function startAutoplay() {
        if (autoplayTimer || userPaused) return;
        autoplayTimer = setInterval(slideNext, intervalTime);
    }

    function stopAutoplay() {
        clearInterval(autoplayTimer);
        autoplayTimer = null;
    }

    // Pausar el carrusel mientras el usuario pasa el mouse o navega con teclado
    const carousel = track.parentElement;
    if (carousel) {
        carousel.addEventListener('mouseenter', stopAutoplay);
        carousel.addEventListener('mouseleave', startAutoplay);
        carousel.addEventListener('focusin', stopAutoplay);
        carousel.addEventListener('focusout', startAutoplay);
    }

    // Botón de pausa/reanudación manual
    function syncToggleButton() {
        if (!toggleBtn || !toggleLabel || !toggleIcon) return;
        if (userPaused) {
            toggleBtn.setAttribute('aria-label', 'Reanudar carrusel de promociones');
            toggleLabel.textContent = 'Reanudar';
            toggleIcon.innerHTML = '<path d="M8 5v14l11-7z"/>';
        } else {
            toggleBtn.setAttribute('aria-label', 'Pausar carrusel de promociones');
            toggleLabel.textContent = 'Pausar';
            toggleIcon.innerHTML = '<path d="M6 4h4v16H6zM14 4h4v16h-4z"/>';
        }
    }

    if (toggleBtn) {
        toggleBtn.addEventListener('click', () => {
            userPaused = !userPaused;
            userPaused ? stopAutoplay() : startAutoplay();
            syncToggleButton();
        });
    }

    // Respetar cambios en la preferencia de "movimiento reducido" del sistema
    if (typeof reducedMotion.addEventListener === 'function') {
        reducedMotion.addEventListener('change', (event) => {
            userPaused = event.matches;
            event.matches ? stopAutoplay() : startAutoplay();
            syncToggleButton();
        });
    }

    syncToggleButton();
    startAutoplay();
});
