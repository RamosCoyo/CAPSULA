document.addEventListener('DOMContentLoaded', () => {
    // Evita la inicialización doble si el script llega a cargarse más de una vez
    if (window.__capsulaMenuInit) return;
    window.__capsulaMenuInit = true;

    // --- ÍCONOS SVG ---
    const iconBurger = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" class="w-full h-full text-capsula-bronze drop-shadow-[0_0_15px_rgba(197,131,43,0.5)]"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M4 10c0-4.4 3.6-8 8-8s8 3.6 8 8H4z"></path><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 13h18"></path><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M4 16h16v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2z"></path></svg>`;
    const iconWings = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" class="w-full h-full text-red-500 drop-shadow-[0_0_15px_rgba(239,68,68,0.5)]"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.777 17.656 7.343A7.975 7.975 0 0120 13a7.975 7.975 0 01-2.343 5.657z"></path><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9.879 16.121A3 3 0 1012.015 11L11 14H9c0 .768.293 1.536.879 2.121z"></path></svg>`;
    const iconNachos = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" class="w-full h-full text-yellow-400 drop-shadow-[0_0_15px_rgba(250,204,21,0.5)]"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M12 2L2 22h20L12 2z"></path><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M12 10l-4 8h8l-4-8z"></path></svg>`;
    const iconSnack = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" class="w-full h-full text-yellow-500 drop-shadow-[0_0_15px_rgba(234,179,8,0.5)]"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"></path></svg>`;
    const iconSalad = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" class="w-full h-full text-green-400 drop-shadow-[0_0_15px_rgba(74,222,128,0.5)]"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M4 21C4 17.134 7.58172 14 12 14C16.4183 14 20 17.134 20 21M12 14C10.8954 14 10 13.1046 10 12C10 10.8954 10.8954 10 12 10C13.1046 10 14 10.8954 14 12C14 13.1046 13.1046 14 12 14ZM12 10C10.8954 10 10 9.10457 10 8C10 6.89543 10.8954 6 12 6C13.1046 6 14 6.89543 14 8C14 9.10457 13.1046 10 12 10Z"></path></svg>`;
    const iconDrink = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" class="w-full h-full text-capsula-fuchsia drop-shadow-[0_0_15px_rgba(217,70,239,0.5)]"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M3 5h18l-9 9-9-9zM12 14v7M9 21h6"></path></svg>`;
    const iconBeer = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" class="w-full h-full text-yellow-600 drop-shadow-[0_0_15px_rgba(202,138,4,0.5)]"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9 4h6M9 4v12a2 2 0 002 2h2a2 2 0 002-2V4M9 4H7v12a4 4 0 004 4h2a4 4 0 004-4V4h-2M15 8h4v4h-4z"></path></svg>`;

    // --- BASE DE DATOS DEL MENÚ ---
    const menuItems = [
        { id: 'nachos-classic', name: 'Nachos Classic', desc: 'Totopo artesanal, salsa de queso, elote, frijol ranchero acompañado con pico de gallo.', price: '$109', sabor: 4, picor: 2, monchoso: 5, svg: iconNachos },
        { id: 'nachos-boneless', name: 'Nacho Boneless', desc: 'Totopo artesanal, salsa de queso, elote, boneless. Elige tu salsa favorita.', price: '$189', sabor: 5, picor: 3, monchoso: 5, svg: iconNachos },
        { id: 'dedos-queso', name: 'Dedos de Queso', desc: 'Suculentos dedos de queso acompañados de rica salsa marinara.', price: '$99', sabor: 4, picor: 0, monchoso: 5, svg: iconSnack },
        { id: 'jalapeno-poppers', name: 'Jalapeño Poppers', desc: '5 pzas de jalapeño poppers rellenas de queso crema acompañadas de un aderezo de la casa.', price: '$99', sabor: 4, picor: 3, monchoso: 4, svg: iconSnack },
        { id: 'aros-cebolla', name: 'Aros de Cebolla', desc: 'Orden de aros de cebolla doraditos y crujientes acompañados de un aderezo de la casa.', price: '$99', sabor: 4, picor: 0, monchoso: 4, svg: iconSnack },
        { id: 'elote-dorado', name: 'Elote Dorado', desc: 'Elotito tierno dorado y bañado en alguna de nuestras salsas se acompaña con aderezo de queso cheddar.', price: '$69', sabor: 5, picor: 1, monchoso: 3, svg: iconSnack },
        { id: 'papas-crisscut', name: 'Papas Crisscut', desc: 'Crujientes y doradas, con un corte enrejado que atrapa todo el sabor.', price: '$99', sabor: 5, picor: 0, monchoso: 4, svg: iconSnack },
        { id: 'papas-classic', name: 'Papas Classic', desc: 'Clásicas y deliciosas, perfectas para acompañar cualquier platillo.', price: '$99', sabor: 4, picor: 0, monchoso: 4, svg: iconSnack },
        { id: 'boneless', name: 'Boneless 350g', desc: 'Jugosos trozos de pollo sin hueso, bañados en tu salsa favorita.', price: '$189', sabor: 5, picor: 4, monchoso: 5, svg: iconWings },
        { id: 'alitas-medio', name: '1/2kg Alitas', desc: 'Alas de pollo doradas y crujientes, disponibles en una variedad de salsas.', price: '$189', sabor: 5, picor: 4, monchoso: 5, svg: iconWings },
        { id: 'alitas-kilo', name: '1kg Alitas', desc: 'Alas de pollo doradas y crujientes, disponibles en una variedad de salsas.', price: '$349', sabor: 5, picor: 4, monchoso: 5, svg: iconWings },
        { id: 'sampler', name: 'Sampler', desc: '5 aros de cebolla | 3 jalapeño poppers | 3 dedos de queso | 2 elotitos dorados | 120g papas a la francesa | 6 alitas bañadas.', price: '$279', sabor: 5, picor: 2, monchoso: 5, svg: iconSnack },

        { id: 'burger-chit-zaa', name: 'Hamburguesa Chitzaa', desc: 'Suculenta pechuga de pollo crispy con salsa de pizza, queso manchego y pepperoni.', price: '$169', sabor: 5, picor: 1, monchoso: 5, svg: iconBurger },
        { id: 'burger-sencilla', name: 'Burger de Res Sencilla', desc: 'Lechuga, tomate, tocino, mayonesa, queso manchego, y la receta de carne de res de la casa.', price: '$139', sabor: 4, picor: 1, monchoso: 4, svg: iconBurger },
        { id: 'burger-chicken-naked', name: 'Chicken Naked', desc: 'Pechuga a la plancha condimentada con especias del mediterráneo, lechuga, tomate, queso americano y tu salsa favorita.', price: '$169', sabor: 4, picor: 1, monchoso: 3, svg: iconBurger },
        { id: 'burger-boneless', name: 'Boneless Garantia', desc: 'Suculenta pechuga de pollo crunchy con lechuga, tomate, queso americano y bañada en tu salsa de elección.', price: '$169', sabor: 5, picor: 3, monchoso: 5, svg: iconBurger },
        { id: 'burger-empanizado', name: 'Burger Pollo Empanizado', desc: 'Medallón de pollo acompañado de lechuga, tomate, queso americano y mayonesa.', price: '$99', sabor: 4, picor: 1, monchoso: 4, svg: iconBurger },
        { id: 'burger-love-me', name: 'Love Me Cheeseburger', desc: 'Deliciosa carne de res, acompañada de lechuga, tomate, queso manchego, tocino y papa crisscut bañada en queso cheddar.', price: '$169', sabor: 5, picor: 1, monchoso: 5, svg: iconBurger },
        { id: 'burger-rodeo', name: 'Hamburguesa Rodeo', desc: 'Carne de sirloin bañada con smoke BBQ, aros de cebolla, queso manchego y tocino crujiente.', price: '$159', sabor: 5, picor: 1, monchoso: 5, svg: iconBurger },
        { id: 'burger-hot-poppers', name: 'Burger Hot Poppers', desc: 'Carne de sirloin acompañada de 3 jalapeños poppers rellenos de queso crema, manchego, tocino y aderezo rancho morita.', price: '$169', sabor: 5, picor: 4, monchoso: 5, svg: iconBurger },
        { id: 'burger-mushrooms', name: 'Burger Mushrooms', desc: 'Receta de carne de la casa acompañada de una mezcla de champiñones y cebolla asada, tocino y queso manchego.', price: '$189', sabor: 5, picor: 1, monchoso: 4, svg: iconBurger },
        { id: 'burger-doble', name: 'Burger de Res Doble', desc: 'Lechuga, tomate, tocino, mayonesa, queso manchego, cebolla caramelizada y doble porción de carne de res.', price: '$169', sabor: 5, picor: 1, monchoso: 5, svg: iconBurger },

        { id: 'ensalada-mamey', name: 'Ensalada del Mamey', desc: 'Pechuga de pollo a la plancha sobre lechuga romana, tomate, mezcla de quesos y aderezo a elección.', price: '$139', sabor: 4, picor: 0, monchoso: 2, svg: iconSalad },
        { id: 'ensalada-not-mamey', name: 'Ensalada Not Mamey', desc: 'Pechuga de pollo crispy bañada en salsa, servida sobre una cama de papas a la francesa y lechuga romana.', price: '$159', sabor: 5, picor: 2, monchoso: 4, svg: iconSalad },

        { id: 'coctel-ruso-negro', name: 'Ruso Negro', desc: 'Vodka de la casa y licor de café.', price: '$129', sabor: 4, picor: 0, monchoso: 1, svg: iconDrink },
        { id: 'coctel-margarita', name: 'Margarita', desc: 'Tequila de la casa, controy. Elige tu sabor: fresa, mango y limón.', price: '$109', sabor: 5, picor: 0, monchoso: 1, svg: iconDrink },
        { id: 'coctel-tequila-sunrise', name: 'Tequila Sunrise', desc: 'Tequila de la casa, granadina y jugo de naranja.', price: '$109', sabor: 4, picor: 0, monchoso: 1, svg: iconDrink },
        { id: 'coctel-tamarindo', name: 'Tamarindo Mezcal', desc: 'Rico tamarindo concentrado, 400 conejos y dash de limón.', price: '$129', sabor: 5, picor: 1, monchoso: 1, svg: iconDrink },
        { id: 'coctel-pina-colada', name: 'Piña Colada', desc: 'Jugo de piña, leche carnation, crema de coco, ron de la casa, canela y cereza.', price: '$109', sabor: 5, picor: 0, monchoso: 2, svg: iconDrink },
        { id: 'coctel-desarmador', name: 'Desarmador', desc: 'Vodka de la casa y jugo a escoger: naranja, piña, mango y uva.', price: '$109', sabor: 4, picor: 0, monchoso: 1, svg: iconDrink },
        { id: 'coctel-jamaizcal', name: 'Jamaizcal', desc: 'Jamaica con un toque de naranja y nuestro mezcal de la casa.', price: '$129', sabor: 5, picor: 1, monchoso: 1, svg: iconDrink },
        { id: 'coctel-carajillo', name: 'Carajillo', desc: 'Café expreso y licor 43 con hielos y adornado con granos de café.', price: '$139', sabor: 5, picor: 0, monchoso: 1, svg: iconDrink },
        { id: 'coctel-perro-salado', name: 'Perro Salado', desc: 'Tequila de la casa, sal, agua mineral y limón.', price: '$109', sabor: 4, picor: 0, monchoso: 1, svg: iconDrink },
        { id: 'coctel-medias-seda', name: 'Medias de Seda', desc: 'Leche carnation, crema de coco, ginebra de la casa, granadina y canela.', price: '$109', sabor: 5, picor: 0, monchoso: 1, svg: iconDrink },
        { id: 'coctel-ruso-blanco', name: 'Ruso Blanco', desc: 'Leche carnation, vodka de la casa y licor de café.', price: '$129', sabor: 4, picor: 0, monchoso: 1, svg: iconDrink },
        { id: 'coctel-pink-panther', name: 'Pink Panther', desc: 'Jugo de piña, leche carnation, crema de coco, ron, granadina y canela.', price: '$109', sabor: 5, picor: 0, monchoso: 2, svg: iconDrink },

        { id: 'litro-basico', name: 'Litro Básico', desc: 'Paloma, Vampiro o Azulitos. A elegir: Vodka, Ginebra, Whisky o Tequila.', price: '$109', sabor: 5, picor: 0, monchoso: 2, svg: iconDrink },
        { id: 'litro-premium', name: 'Litro Premium', desc: 'Buchanans, Don Julio 70, Maestro Dobel, Bacardí, Smirnoff, Absolut.', price: '$149', sabor: 5, picor: 0, monchoso: 2, svg: iconDrink },
        { id: 'caguama', name: 'Caguamas', desc: 'Carta Blanca, Tecate, Indio, XX.', price: '$89', sabor: 4, picor: 0, monchoso: 1, svg: iconBeer },
        { id: 'beer-tower', name: 'Beer Tower 5L', desc: 'Torre de cerveza de 5 litros. Perfecta para recargar al escuadrón completo.', price: '$349', sabor: 5, picor: 0, monchoso: 2, svg: iconBeer }
    ];

    const rosterContainer = document.getElementById('roster-container');
    const itemName = document.getElementById('item-name');
    const itemDesc = document.getElementById('item-desc');
    const itemPrice = document.getElementById('item-price');
    const itemImage = document.getElementById('item-image');
    
    const statSabor = document.getElementById('stat-sabor');
    const statPicor = document.getElementById('stat-picor');
    const statMonchoso = document.getElementById('stat-monchoso');

    const btnPrev = document.getElementById('btn-prev');
    const btnNext = document.getElementById('btn-next');

    let currentIndex = 0;
    let updateTimer = null;

    const generateStars = (score) => {
        let starsHTML = '';
        for (let i = 1; i <= 5; i++) {
            if (i <= score) {
                starsHTML += `<svg class="w-6 h-6 fill-current" viewBox="0 0 24 24" aria-hidden="true"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>`;
            } else {
                starsHTML += `<svg class="w-6 h-6 stroke-current fill-transparent opacity-30" viewBox="0 0 24 24" aria-hidden="true"><path stroke-width="1.5" stroke-linejoin="round" d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>`;
            }
        }
        return starsHTML;
    };

    const setStat = (container, score, label) => {
        if (!container) return;
        container.innerHTML = generateStars(score);
        container.setAttribute('role', 'img');
        container.setAttribute('aria-label', `${label}: ${score} de 5`);
    };

    const selectCharacter = (index) => {
        if (!menuItems[index]) return;
        
        currentIndex = index;
        const item = menuItems[index];

        // En el primer render no hay nada que ocultar (evita el parpadeo inicial).
        // Además se cancela el timeout anterior para clics rápidos en el roster.
        const isFirstRender = !itemImage.innerHTML.trim();
        clearTimeout(updateTimer);
        if (!isFirstRender) itemImage.style.opacity = '0';

        updateTimer = setTimeout(() => {
            if(itemName) itemName.textContent = item.name;
            if(itemDesc) itemDesc.textContent = item.desc;
            if(itemPrice) itemPrice.textContent = item.price;
            if(itemImage) itemImage.innerHTML = item.svg;
            
            setStat(statSabor, item.sabor, 'Sabor');
            setStat(statPicor, item.picor, 'Picor');
            setStat(statMonchoso, item.monchoso, 'Monchosidad');
            
            if(itemImage) itemImage.style.opacity = '1';
        }, isFirstRender ? 0 : 150);

        // Actualizar estados visuales de los cuadros
        document.querySelectorAll('.roster-box').forEach(box => {
            box.classList.remove('border-capsula-fuchsia', 'neon-border-fuchsia', 'scale-110');
            box.classList.add('border-gray-700', 'opacity-50');
            box.setAttribute('aria-pressed', 'false');
        });
        
        const activeBox = document.getElementById(`roster-${item.id}`);
        if (activeBox && rosterContainer) {
            activeBox.classList.remove('border-gray-700', 'opacity-50');
            activeBox.classList.add('border-capsula-fuchsia', 'neon-border-fuchsia', 'scale-110');
            activeBox.setAttribute('aria-pressed', 'true');
            
            // FÓRMULA DE CENTRADO EXACTO (REEMPLAZA scrollIntoView)
            // Esto calcula matemáticamente el centro del contenedor para cualquier elemento
            const scrollLeftTarget = activeBox.offsetLeft - (rosterContainer.clientWidth / 2) + (activeBox.offsetWidth / 2);
            rosterContainer.scrollTo({
                left: scrollLeftTarget,
                behavior: 'smooth'
            });
        }
    };

    // Renderizar los cuadritos del Roster con espaciadores laterales
    if (rosterContainer) {
        rosterContainer.innerHTML = '';

        // Espaciador izquierdo
        const leftSpacer = document.createElement('div');
        leftSpacer.className = 'flex-shrink-0 w-[calc(50%-40px)] md:w-[calc(50%-48px)] pointer-events-none';
        rosterContainer.appendChild(leftSpacer);

        // Elementos del menú (botones nativos: accesibles con teclado sin código extra)
        menuItems.forEach((item, index) => {
            const box = document.createElement('button');
            box.type = 'button';
            box.id = `roster-${item.id}`;
            box.className = `roster-box w-20 h-20 md:w-24 md:h-24 flex-shrink-0 glass-panel border-2 border-gray-700 rounded-lg cursor-pointer flex items-center justify-center p-4 transition-[border-color,opacity,transform] duration-300 opacity-50 hover:opacity-100 hover:border-capsula-cyan`;
            box.innerHTML = item.svg; 

            // Accesibilidad: nombre accesible + estado de selección
            box.setAttribute('aria-label', `Seleccionar ${item.name}`);
            box.setAttribute('aria-pressed', 'false');

            box.addEventListener('click', () => selectCharacter(index));
            rosterContainer.appendChild(box);
        });

        // Espaciador derecho
        const rightSpacer = document.createElement('div');
        rightSpacer.className = 'flex-shrink-0 w-[calc(50%-40px)] md:w-[calc(50%-48px)] pointer-events-none';
        rosterContainer.appendChild(rightSpacer);
    }

    // Flecha Izquierda
    if (btnPrev) {
        btnPrev.addEventListener('click', () => {
            let newIndex = currentIndex - 1;
            if (newIndex < 0) newIndex = menuItems.length - 1;
            selectCharacter(newIndex);
        });
    }

    // Flecha Derecha
    if (btnNext) {
        btnNext.addEventListener('click', () => {
            let newIndex = currentIndex + 1;
            if (newIndex >= menuItems.length) newIndex = 0;
            selectCharacter(newIndex);
        });
    }

    // Iniciar seleccionando el primer elemento
    selectCharacter(0);
});