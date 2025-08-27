// ===== GLOBAL VARIABLES =====
let particles = [];
let animationId;
let isDarkMode = false;

// ===== DOM CONTENT LOADED =====
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
});

// ===== INITIALIZE APPLICATION =====
function initializeApp() {
    setupThemeToggle();
    setupNavigation();
    setupScrollEffects();
    setupParticleSystem();
    setupNeuronNetwork();
    setupFormHandling();
    setupTiltEffects();
    setupIntersectionObserver();
    setupSmoothScrolling();
    setupButtonAnimations();
}

// ===== THEME TOGGLE =====
function setupThemeToggle() {
    const themeToggle = document.getElementById('themeToggle');
    const body = document.body;
    
    // Check for saved theme preference or default to light mode
    const savedTheme = localStorage.getItem('theme') || 'light';
    isDarkMode = savedTheme === 'dark';
    
    applyTheme();
    
    themeToggle.addEventListener('click', function() {
        isDarkMode = !isDarkMode;
        applyTheme();
        localStorage.setItem('theme', isDarkMode ? 'dark' : 'light');
        
        // Add rotation animation
        this.style.transform = 'rotate(360deg)';
        setTimeout(() => {
            this.style.transform = '';
        }, 400);
    });
}

function applyTheme() {
    const body = document.body;
    const themeToggle = document.getElementById('themeToggle');
    const toggleIcon = themeToggle.querySelector('.toggle-icon');
    
    if (isDarkMode) {
        body.classList.remove('light-mode');
        body.classList.add('dark-mode');
        toggleIcon.textContent = '☀️';
    } else {
        body.classList.remove('dark-mode');
        body.classList.add('light-mode');
        toggleIcon.textContent = '🌙';
    }
}

// ===== NAVIGATION =====
function setupNavigation() {
    const hamburger = document.getElementById('hamburger');
    const navMenu = document.querySelector('.nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');
    
    // Mobile menu toggle
    hamburger.addEventListener('click', function() {
        this.classList.toggle('active');
        navMenu.classList.toggle('active');
    });
    
    // Close mobile menu when clicking on a link
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
        });
    });
    
    // Navbar scroll effect
    let lastScrollTop = 0;
    const navbar = document.querySelector('.navbar');
    
    window.addEventListener('scroll', function() {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        
        if (scrollTop > lastScrollTop && scrollTop > 100) {
            navbar.style.transform = 'translateY(-100%)';
        } else {
            navbar.style.transform = 'translateY(0)';
        }
        
        lastScrollTop = scrollTop;
        
        // Add backdrop blur effect
        if (scrollTop > 50) {
            navbar.style.backdropFilter = 'blur(20px)';
            navbar.style.background = isDarkMode ? 
                'rgba(15, 23, 42, 0.95)' : 
                'rgba(255, 255, 255, 0.95)';
        } else {
            navbar.style.backdropFilter = 'blur(10px)';
            navbar.style.background = isDarkMode ? 
                'rgba(15, 23, 42, 0.8)' : 
                'rgba(255, 255, 255, 0.8)';
        }
    });
}

// ===== SCROLL EFFECTS =====
function setupScrollEffects() {
    const sections = document.querySelectorAll('section');
    
    function updateActiveNavLink() {
        const scrollPos = window.scrollY + 100;
        
        sections.forEach(section => {
            const top = section.offsetTop;
            const bottom = top + section.offsetHeight;
            const id = section.getAttribute('id');
            const navLink = document.querySelector(`.nav-link[href="#${id}"]`);
            
            if (scrollPos >= top && scrollPos < bottom) {
                document.querySelectorAll('.nav-link').forEach(link => {
                    link.classList.remove('active');
                });
                if (navLink) {
                    navLink.classList.add('active');
                }
            }
        });
    }
    
    window.addEventListener('scroll', updateActiveNavLink);
}

// ===== PARTICLE SYSTEM =====
function setupParticleSystem() {
    const particlesContainer = document.getElementById('particles');
    const particleCount = window.innerWidth < 768 ? 30 : 50;
    
    // Create particles
    for (let i = 0; i < particleCount; i++) {
        createParticle();
    }
    
    function createParticle() {
        const particle = document.createElement('div');
        particle.className = 'particle';
        
        // Random properties
        const size = Math.random() * 4 + 2;
        const startX = Math.random() * window.innerWidth;
        const duration = Math.random() * 20 + 10;
        const delay = Math.random() * 20;
        
        particle.style.cssText = `
            width: ${size}px;
            height: ${size}px;
            left: ${startX}px;
            animation-duration: ${duration}s;
            animation-delay: ${delay}s;
        `;
        
        particlesContainer.appendChild(particle);
        
        // Remove and recreate particle after animation
        setTimeout(() => {
            if (particle.parentNode) {
                particle.remove();
                createParticle();
            }
        }, (duration + delay) * 1000);
    }
    
    // Responsive particle adjustment
    window.addEventListener('resize', debounce(() => {
        const currentCount = particlesContainer.children.length;
        const targetCount = window.innerWidth < 768 ? 30 : 50;
        
        if (currentCount !== targetCount) {
            particlesContainer.innerHTML = '';
            for (let i = 0; i < targetCount; i++) {
                createParticle();
            }
        }
    }, 250));
}

// ===== NEURON NETWORK ANIMATION =====
function setupNeuronNetwork() {
    const neuronNetwork = document.getElementById('neuronNetwork');
    const connections = document.querySelectorAll('.connection');
    const nodes = document.querySelectorAll('.neuron-node');
    
    if (!neuronNetwork) return;
    
    // Position nodes in a circular pattern
    const centerX = 200;
    const centerY = 200;
    const radius = 150;
    
    nodes.forEach((node, index) => {
        const angle = (index / nodes.length) * 2 * Math.PI;
        const x = centerX + Math.cos(angle) * radius;
        const y = centerY + Math.sin(angle) * radius;
        
        node.style.left = `${x}px`;
        node.style.top = `${y}px`;
    });
    
    // Animate connections
    function updateConnections() {
        connections.forEach((connection, index) => {
            const startNode = nodes[index];
            const endNode = nodes[(index + 1) % nodes.length];
            
            if (startNode && endNode) {
                const startRect = startNode.getBoundingClientRect();
                const endRect = endNode.getBoundingClientRect();
                const networkRect = neuronNetwork.getBoundingClientRect();
                
                const x1 = startRect.left - networkRect.left + 10;
                const y1 = startRect.top - networkRect.top + 10;
                const x2 = endRect.left - networkRect.left + 10;
                const y2 = endRect.top - networkRect.top + 10;
                
                connection.setAttribute('x1', x1);
                connection.setAttribute('y1', y1);
                connection.setAttribute('x2', x2);
                connection.setAttribute('y2', y2);
            }
        });
    }
    
    updateConnections();
    window.addEventListener('resize', debounce(updateConnections, 250));
    
    // Add interactive hover effects
    nodes.forEach(node => {
        node.addEventListener('mouseenter', function() {
            this.style.transform = 'scale(2) translateZ(30px)';
            this.style.boxShadow = '0 0 30px var(--brand-primary)';
        });
        
        node.addEventListener('mouseleave', function() {
            this.style.transform = '';
            this.style.boxShadow = '';
        });
    });
}

// ===== FORM HANDLING =====
function setupFormHandling() {
    const contactForm = document.getElementById('contactForm');
    
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const formData = new FormData(this);
            const data = Object.fromEntries(formData);
            
            // Simulate form submission
            const submitBtn = this.querySelector('button[type="submit"]');
            const originalText = submitBtn.querySelector('span').textContent;
            
            submitBtn.querySelector('span').textContent = 'Sending...';
            submitBtn.disabled = true;
            
            setTimeout(() => {
                submitBtn.querySelector('span').textContent = 'Message Sent!';
                submitBtn.style.background = 'var(--success)';
                
                setTimeout(() => {
                    submitBtn.querySelector('span').textContent = originalText;
                    submitBtn.disabled = false;
                    submitBtn.style.background = '';
                    this.reset();
                }, 2000);
            }, 1500);
            
            console.log('Form submission:', data);
        });
    }
}

// ===== TILT EFFECTS =====
function setupTiltEffects() {
    const tiltElements = document.querySelectorAll('[data-tilt], [data-hover-lift], [data-3d]');
    
    tiltElements.forEach(element => {
        element.addEventListener('mouseenter', function() {
            this.style.transition = 'transform 0.1s ease';
        });
        
        element.addEventListener('mousemove', function(e) {
            const rect = this.getBoundingClientRect();
            const centerX = rect.left + rect.width / 2;
            const centerY = rect.top + rect.height / 2;
            
            const deltaX = e.clientX - centerX;
            const deltaY = e.clientY - centerY;
            
            const rotateX = (deltaY / rect.height) * -20;
            const rotateY = (deltaX / rect.width) * 20;
            
            this.style.transform = `
                perspective(1000px) 
                rotateX(${rotateX}deg) 
                rotateY(${rotateY}deg) 
                translateZ(10px)
            `;
        });
        
        element.addEventListener('mouseleave', function() {
            this.style.transition = 'transform 0.4s ease';
            this.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateZ(0px)';
        });
    });
}

// ===== INTERSECTION OBSERVER =====
function setupIntersectionObserver() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
                
                // Special animations for specific elements
                if (entry.target.classList.contains('feature-card')) {
                    animateFeatureCard(entry.target);
                }
                
                if (entry.target.classList.contains('workflow-step')) {
                    animateWorkflowStep(entry.target);
                }
                
                if (entry.target.classList.contains('team-card')) {
                    animateTeamCard(entry.target);
                }
            }
        });
    }, observerOptions);
    
    // Observe elements
    const elementsToObserve = document.querySelectorAll(`
        .feature-card,
        .workflow-step,
        .benefit-card,
        .team-card,
        .highlight-item,
        .section-title
    `);
    
    elementsToObserve.forEach(el => observer.observe(el));
}

// ===== ANIMATION FUNCTIONS =====
function animateFeatureCard(card) {
    card.style.transform = 'translateY(50px)';
    card.style.opacity = '0';
    
    setTimeout(() => {
        card.style.transition = 'all 0.6s ease';
        card.style.transform = 'translateY(0)';
        card.style.opacity = '1';
    }, 100);
}

function animateWorkflowStep(step) {
    const delay = parseInt(step.dataset.step) * 200;
    
    step.style.transform = 'scale(0.8) rotateY(-90deg)';
    step.style.opacity = '0';
    
    setTimeout(() => {
        step.style.transition = 'all 0.8s ease';
        step.style.transform = 'scale(1) rotateY(0deg)';
        step.style.opacity = '1';
    }, delay);
}

function animateTeamCard(card) {
    card.style.transform = 'perspective(1000px) rotateX(-90deg)';
    card.style.opacity = '0';
    
    setTimeout(() => {
        card.style.transition = 'all 0.8s ease';
        card.style.transform = 'perspective(1000px) rotateX(0deg)';
        card.style.opacity = '1';
    }, Math.random() * 400);
}

// ===== SMOOTH SCROLLING =====
function setupSmoothScrolling() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            
            if (target) {
                const offsetTop = target.offsetTop - 80; // Account for fixed navbar
                
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// ===== BUTTON ANIMATIONS =====
function setupButtonAnimations() {
    const buttons = document.querySelectorAll('.btn');
    
    buttons.forEach(button => {
        button.addEventListener('click', function(e) {
            // Ripple effect
            const ripple = document.createElement('div');
            ripple.style.cssText = `
                position: absolute;
                border-radius: 50%;
                background: rgba(255, 255, 255, 0.5);
                transform: scale(0);
                animation: ripple 0.6s linear;
                pointer-events: none;
            `;
            
            const rect = this.getBoundingClientRect();
            const size = Math.max(rect.width, rect.height);
            const x = e.clientX - rect.left - size / 2;
            const y = e.clientY - rect.top - size / 2;
            
            ripple.style.width = ripple.style.height = size + 'px';
            ripple.style.left = x + 'px';
            ripple.style.top = y + 'px';
            
            this.appendChild(ripple);
            
            setTimeout(() => ripple.remove(), 600);
        });
        
        // Button-specific actions
        if (button.id === 'getStartedBtn') {
            button.addEventListener('click', () => {
                showNotification('Welcome to NeuroFlow AI! 🧠', 'success');
            });
        }
        
        if (button.id === 'talkToAiBtn') {
            button.addEventListener('click', () => {
                showNotification('AI Chat coming soon! 🤖', 'info');
            });
        }
        
        if (button.id === 'emergencyBtn') {
            button.addEventListener('click', () => {
                showEmergencyModal();
            });
        }
    });
}

// ===== NOTIFICATION SYSTEM =====
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background: ${type === 'success' ? '#10b981' : type === 'error' ? '#ef4444' : '#6366f1'};
        color: white;
        padding: 1rem 2rem;
        border-radius: 8px;
        box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
        z-index: 10000;
        transform: translateX(400px);
        transition: transform 0.3s ease;
        font-weight: 500;
    `;
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);
    
    setTimeout(() => {
        notification.style.transform = 'translateX(400px)';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

// ===== EMERGENCY MODAL =====
function showEmergencyModal() {
    const modal = document.createElement('div');
    modal.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.8);
        display: flex;
        justify-content: center;
        align-items: center;
        z-index: 10000;
        animation: fadeIn 0.3s ease;
    `;
    
    const modalContent = document.createElement('div');
    modalContent.style.cssText = `
        background: white;
        padding: 2rem;
        border-radius: 12px;
        max-width: 500px;
        width: 90%;
        text-align: center;
        animation: slideIn 0.3s ease;
    `;
    
    modalContent.innerHTML = `
        <h2 style="color: #ef4444; margin-bottom: 1rem;">🚨 Emergency Support</h2>
        <p style="margin-bottom: 2rem; color: #666;">If you're experiencing a mental health emergency, please contact:</p>
        <div style="margin-bottom: 2rem;">
            <p><strong>Crisis Hotline:</strong> <a href="tel:988">988</a></p>
            <p><strong>Emergency:</strong> <a href="tel:911">911</a></p>
            <p><strong>Crisis Text Line:</strong> Text HOME to 741741</p>
        </div>
        <button onclick="this.closest('.modal').remove()" style="
            background: #6366f1;
            color: white;
            border: none;
            padding: 1rem 2rem;
            border-radius: 8px;
            cursor: pointer;
            font-weight: 600;
        ">Close</button>
    `;
    
    modal.className = 'modal';
    modal.appendChild(modalContent);
    document.body.appendChild(modal);
    
    // Close on outside click
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.remove();
        }
    });
}

// ===== UTILITY FUNCTIONS =====
function debounce(func, wait, immediate) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            timeout = null;
            if (!immediate) func(...args);
        };
        const callNow = immediate && !timeout;
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
        if (callNow) func(...args);
    };
}

function lerp(start, end, factor) {
    return start + (end - start) * factor;
}

function map(value, inMin, inMax, outMin, outMax) {
    return (value - inMin) * (outMax - outMin) / (inMax - inMin) + outMin;
}

// ===== CSS ANIMATIONS (ADDED VIA JAVASCRIPT) =====
const style = document.createElement('style');
style.textContent = `
    @keyframes ripple {
        to {
            transform: scale(4);
            opacity: 0;
        }
    }
    
    @keyframes fadeIn {
        from { opacity: 0; }
        to { opacity: 1; }
    }
    
    @keyframes slideIn {
        from { 
            transform: translateY(-50px);
            opacity: 0;
        }
        to { 
            transform: translateY(0);
            opacity: 1;
        }
    }
    
    .animate-in {
        animation: slideInUp 0.6s ease forwards;
    }
    
    @keyframes slideInUp {
        from {
            transform: translateY(30px);
            opacity: 0;
        }
        to {
            transform: translateY(0);
            opacity: 1;
        }
    }
`;
document.head.appendChild(style);

// ===== PERFORMANCE OPTIMIZATION =====
// Passive event listeners for better performance
document.addEventListener('scroll', function() {
    // Scroll handling
}, { passive: true });

document.addEventListener('touchstart', function() {
    // Touch handling
}, { passive: true });

// ===== ERROR HANDLING =====
window.addEventListener('error', function(e) {
    console.error('JavaScript Error:', e.error);
    showNotification('Something went wrong. Please refresh the page.', 'error');
});

// ===== ANALYTICS (PLACEHOLDER) =====
function trackEvent(eventName, properties = {}) {
    // Placeholder for analytics tracking
    console.log('Analytics Event:', eventName, properties);
}

// Track button clicks
document.addEventListener('click', function(e) {
    if (e.target.matches('.btn')) {
        trackEvent('button_click', {
            button_id: e.target.id || 'unknown',
            button_text: e.target.textContent.trim()
        });
    }
});

// ===== ACCESSIBILITY ENHANCEMENTS =====
// Keyboard navigation
document.addEventListener('keydown', function(e) {
    // Escape key to close modals
    if (e.key === 'Escape') {
        const modal = document.querySelector('.modal');
        if (modal) {
            modal.remove();
        }
    }
    
    // Enter key for buttons
    if (e.key === 'Enter' && e.target.matches('.btn')) {
        e.target.click();
    }
});

// Focus management
document.addEventListener('focusin', function(e) {
    if (e.target.matches('.btn, .nav-link, input, textarea')) {
        e.target.style.outline = '2px solid var(--brand-primary)';
        e.target.style.outlineOffset = '2px';
    }
});

document.addEventListener('focusout', function(e) {
    if (e.target.matches('.btn, .nav-link, input, textarea')) {
        e.target.style.outline = '';
        e.target.style.outlineOffset = '';
    }
});

// ===== INITIALIZATION COMPLETE =====
console.log('✅ NeuroFlow AI website initialized successfully!');
showNotification('Welcome to NeuroFlow AI! 🧠', 'success');