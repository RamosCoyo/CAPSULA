document.addEventListener('DOMContentLoaded', function() {
    const track = document.getElementById('promo-track');
    // CAMBIO A 7 SEGUNDOS (7000 milisegundos)
    const intervalTime = 7000; 
    let isTransitioning = false;

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

    setInterval(slideNext, intervalTime);
});