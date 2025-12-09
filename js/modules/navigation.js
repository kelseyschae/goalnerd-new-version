/**
 * =============================================================================
 * NAVIGATION MODULE
 * =============================================================================
 * 
 * This module handles all navigation-related functionality:
 * - Hamburger menu toggle (mobile)
 * - Navigation link animations (rollOut effect)
 * - Skip link for accessibility
 * 
 * IMPORTED BY: main.js, players.module.js, details.module.js, 
 *              search-results.module.js
 * 
 * NOTE: This file does NOT contain any API keys.
 * 
 * =============================================================================
 */

/**
 * Initialize the hamburger menu for mobile navigation
 * 
 * What this does:
 * - Shows/hides the mobile menu when hamburger is clicked
 * - Transforms hamburger icon into an X when open
 * - Closes menu when clicking outside
 * - Closes menu when pressing Escape key (accessibility)
 */
export function initHamburgerMenu() {
    const hamburger = document.getElementById('hamburger-btn');
    const navLinks = document.getElementById('nav-links');
    
    if (!hamburger || !navLinks) return;

    // Toggle menu on hamburger click
    hamburger.addEventListener('click', (e) => {
        e.stopPropagation();
        const isActive = navLinks.classList.toggle('active');
        hamburger.classList.toggle('active');
        hamburger.setAttribute('aria-expanded', isActive.toString());
    });

    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
        if (!navLinks.contains(e.target) && !hamburger.contains(e.target)) {
            navLinks.classList.remove('active');
            hamburger.classList.remove('active');
            hamburger.setAttribute('aria-expanded', 'false');
        }
    });

    // Close menu on Escape key press (accessibility)
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && navLinks.classList.contains('active')) {
            navLinks.classList.remove('active');
            hamburger.classList.remove('active');
            hamburger.setAttribute('aria-expanded', 'false');
            hamburger.focus();
        }
    });

    // Prevent menu from closing when clicking inside it
    navLinks.addEventListener('click', (e) => {
        e.stopPropagation();
    });
}

/**
 * Initialize rollOut animation for navigation links
 * 
 * What this does:
 * - When a nav link is clicked, it plays a rollOut animation
 * - After the animation finishes, it navigates to the new page
 * - Uses Animate.css library classes
 */
/**
 * Initialize Page Transitions (Dissolve Effect)
 * * 1. Fade In: Al cargar, quitamos la clase .fade-out (si la tuviera)
 * 2. Fade Out: Al hacer clic, agregamos .fade-out y esperamos antes de cambiar de página
 */
export function initNavigationAnimation() {
    
    // --- FADE IN (Entrada) ---
    // Al cargar el JS, aseguramos que la página sea visible
    // (Un pequeño timeout asegura que la transición se note si vienes de un fade-out)
    setTimeout(() => {
        document.body.classList.remove('fade-out');
    }, 50);

    // --- FADE OUT (Salida) ---
    const links = document.querySelectorAll('a');
    
    links.forEach(link => {
        link.addEventListener('click', (e) => {
            const targetUrl = link.getAttribute('href');

            // Solo aplicar si:
            // 1. Tiene href
            // 2. No es un link vacío o ancla (#)
            // 3. No abre en nueva pestaña (_blank)
            if (targetUrl && targetUrl !== '#' && !targetUrl.startsWith('#') && link.target !== '_blank') {
                e.preventDefault(); // Detenemos el cambio inmediato

                // 1. Desvanecer la página
                document.body.classList.add('fade-out');

                // 2. Esperar 500ms (lo que dura el CSS) y luego cambiar
                setTimeout(() => {
                    window.location.href = targetUrl;
                }, 500);
            }
        });
    });
}

/**
 * Handle skip link focus for accessibility
 * 
 * What this does:
 * - Allows keyboard users to skip the navigation and go straight to content
 * - The skip link appears when focused (Tab key)
 */
export function initSkipLink() {
    const skipLink = document.querySelector('.skip-link');
    if (!skipLink) return;

    skipLink.addEventListener('click', (e) => {
        e.preventDefault();
        const targetId = skipLink.getAttribute('href').substring(1);
        const targetElement = document.getElementById(targetId);
        
        if (targetElement) {
            targetElement.setAttribute('tabindex', '-1');
            targetElement.focus();
            targetElement.scrollIntoView({ behavior: 'smooth' });
        }
    });
}
