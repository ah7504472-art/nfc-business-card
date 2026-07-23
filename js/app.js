// ============= APP.JS - Interactive Features =============

// Smooth scroll animations
document.addEventListener('DOMContentLoaded', function() {
    // Add entrance animations
    const elements = document.querySelectorAll('.theme-card, .theme-btn, .info-section');
    elements.forEach((el, index) => {
        el.style.animation = `slideUp 0.8s ease-out ${index * 0.1}s both`;
    });

    // Add ripple effect to buttons
    const buttons = document.querySelectorAll('.btn-action, .btn-save, .theme-btn');
    buttons.forEach(button => {
        button.addEventListener('click', function(e) {
            createRipple(e, this);
        });
        button.addEventListener('mouseenter', function() {
            this.style.transform = this.getAttribute('data-original-transform') || 'scale(1.02)';
        });
    });

    // Parallax effect on scroll
    window.addEventListener('scroll', parallaxEffect);
});

// Ripple effect function
function createRipple(e, element) {
    const ripple = document.createElement('span');
    const rect = element.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    ripple.style.position = 'absolute';
    ripple.style.left = x + 'px';
    ripple.style.top = y + 'px';
    ripple.style.width = '20px';
    ripple.style.height = '20px';
    ripple.style.background = 'rgba(255, 255, 255, 0.5)';
    ripple.style.borderRadius = '50%';
    ripple.style.transform = 'scale(0)';
    ripple.style.pointerEvents = 'none';
    ripple.style.animation = 'rippleEffect 0.6s ease-out';

    element.style.position = 'relative';
    element.style.overflow = 'hidden';
    element.appendChild(ripple);

    setTimeout(() => ripple.remove(), 600);
}

// Parallax effect on scroll
function parallaxEffect() {
    const scrolled = window.pageYOffset;
    const parallaxElements = document.querySelectorAll('.landing-container::before, .card-container::before');
    
    parallaxElements.forEach(el => {
        if (el) {
            el.style.transform = `translateY(${scrolled * 0.5}px)`;
        }
    });
}

// Contact functions
function call() {
    window.location.href = 'tel:+201004594168';
}

function whatsapp() {
    window.location.href = 'https://wa.me/201004594168';
}

function email() {
    window.location.href = 'mailto:ayadeissa24@gmail.com';
}

function downloadVCF() {
    const link = document.createElement('a');
    link.href = 'contact.vcf';
    link.download = 'Ayad-Eissa.vcf';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    // Show feedback
    showNotification('Contact saved!');
}

// Notification system
function showNotification(message) {
    const notification = document.createElement('div');
    notification.textContent = message;
    notification.style.cssText = `
        position: fixed;
        bottom: 30px;
        right: 30px;
        background: linear-gradient(135deg, #00d4ff 0%, #0099ff 100%);
        color: white;
        padding: 15px 25px;
        border-radius: 10px;
        box-shadow: 0 10px 30px rgba(0, 212, 255, 0.4);
        animation: slideIn 0.3s ease-out;
        z-index: 1000;
        font-weight: 600;
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease-out';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

// Copy to clipboard function
function copyToClipboard(text) {
    navigator.clipboard.writeText(text).then(() => {
        showNotification('Copied to clipboard!');
    });
}

// Mobile menu toggle
function toggleMenu() {
    const menu = document.querySelector('.mobile-menu');
    if (menu) {
        menu.classList.toggle('active');
    }
}

// Detect device type
function isMobileDevice() {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
}

// Share functionality
function shareContact() {
    if (navigator.share) {
        navigator.share({
            title: 'Ayad Eissa - Digital Business Card',
            text: 'Check out my premium digital business card!',
            url: window.location.href
        }).catch(err => console.log('Error sharing:', err));
    } else {
        showNotification('Share not supported on this device');
    }
}

// Keyboard shortcuts
document.addEventListener('keydown', function(e) {
    // ESC to go back
    if (e.key === 'Escape') {
        const backButton = document.querySelector('.btn-back');
        if (backButton) {
            window.history.back();
        }
    }
    // M to open WhatsApp
    if (e.key === 'm' || e.key === 'M') {
        // Only if not typing in input
        if (document.activeElement.tagName !== 'INPUT' && document.activeElement.tagName !== 'TEXTAREA') {
            whatsapp();
        }
    }
});

// Theme functions
let currentTheme = 'cyber-neon';

function setTheme(themeName) {
    currentTheme = themeName;
    document.body.className = `${themeName}-theme`;
    localStorage.setItem('preferredTheme', themeName);
}

function getTheme() {
    return localStorage.getItem('preferredTheme') || 'cyber-neon';
}

// Add ripple animation to CSS
const style = document.createElement('style');
style.textContent = `
    @keyframes rippleEffect {
        to {
            transform: scale(4);
            opacity: 0;
        }
    }
    
    @keyframes slideIn {
        from {
            transform: translateX(400px);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOut {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(400px);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

// Intersection Observer for fade-in animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver(function(entries) {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

// Observe all cards
document.querySelectorAll('.theme-card, .card').forEach(card => {
    card.style.opacity = '0';
    card.style.transform = 'translateY(20px)';
    card.style.transition = 'opacity 0.6s ease-out, transform 0.6s ease-out';
    observer.observe(card);
});

// Performance optimization - debounce scroll events
let scrollTimeout;
function debounce(func, delay) {
    return function(...args) {
        clearTimeout(scrollTimeout);
        scrollTimeout = setTimeout(() => func(...args), delay);
    };
}

const debouncedParallax = debounce(parallaxEffect, 10);
window.addEventListener('scroll', debouncedParallax);

// Page visibility API - pause animations when tab is hidden
document.addEventListener('visibilitychange', function() {
    if (document.hidden) {
        document.body.style.animationPlayState = 'paused';
    } else {
        document.body.style.animationPlayState = 'running';
    }
});

// Touch support for mobile
if (isMobileDevice()) {
    document.addEventListener('touchstart', function() {
        // Enable :active styles on iOS
    }, false);
}

// Load preferred theme on page load
document.addEventListener('DOMContentLoaded', function() {
    const savedTheme = getTheme();
    if (savedTheme && savedTheme !== 'cyber-neon') {
        setTheme(savedTheme);
    }
});

// Export functions for global access
window.app = {
    call,
    whatsapp,
    email,
    downloadVCF,
    copyToClipboard,
    shareContact,
    toggleMenu,
    isMobileDevice,
    setTheme,
    getTheme
};
