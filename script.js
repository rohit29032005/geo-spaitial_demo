// DOM Elements
const body = document.querySelector('body');
const tabBtns = document.querySelectorAll('.tab-btn');
const tabContents = document.querySelectorAll('.tab-content');
const filterBtns = document.querySelectorAll('.filter-btn');
const galleryItems = document.querySelectorAll('.gallery-item');
const viewEventBtns = document.querySelectorAll('.view-event');
const eventModal = document.getElementById('event-modal');
const closeModal = document.querySelector('.close-modal');
const memberSearch = document.getElementById('member-search');
const roleFilter = document.getElementById('role-filter');
const memberCards = document.querySelectorAll('.member-card');
const noResults = document.getElementById('no-results');
const dropdownToggle = document.querySelector('.dropdown-toggle');
const dropdownMenu = document.querySelector('.dropdown-menu');
const backToTopBtn = document.getElementById('back-to-top');

// Dropdown Menu Toggle - Enhanced as main navigation
if (dropdownToggle && dropdownMenu) {
    // Toggle dropdown when clicking the toggle button
    dropdownToggle.addEventListener('click', (e) => {
        e.stopPropagation(); // Prevent event bubbling
        dropdownMenu.classList.toggle('active');
        
        // Rotate the dropdown arrow icon
        const icon = dropdownToggle.querySelector('i.fa-chevron-down');
        if (icon) {
            if (dropdownMenu.classList.contains('active')) {
                icon.style.transform = 'rotate(180deg)';
            } else {
                icon.style.transform = 'rotate(0)';
            }
        }
        
        // Add subtle animation to dropdown items when opening - reduced intensity
        if (dropdownMenu.classList.contains('active')) {
            const dropdownItems = dropdownMenu.querySelectorAll('.dropdown-item');
            dropdownItems.forEach((item, index) => {
                // Reset animation
                item.style.animation = 'none';
                item.offsetHeight; // Trigger reflow
                // Slower animation with less delay between items
                item.style.animation = `slideInUp 0.5s ease forwards ${index * 0.03}s`;
                item.style.opacity = 0;
            });
        }
    });
    
    // Close dropdown when clicking outside
    document.addEventListener('click', (e) => {
        if (!dropdownToggle.contains(e.target) && !dropdownMenu.contains(e.target)) {
            dropdownMenu.classList.remove('active');
            const icon = dropdownToggle.querySelector('i.fa-chevron-down');
            if (icon) {
                icon.style.transform = 'rotate(0)';
            }
        }
    });
    
    // Add hover effect to dropdown items
    const dropdownItems = dropdownMenu.querySelectorAll('.dropdown-item');
    dropdownItems.forEach(item => {
        item.addEventListener('mouseenter', () => {
            const icon = item.querySelector('i');
            if (icon) {
                icon.style.transform = 'translateX(3px)';
            }
        });
        
        item.addEventListener('mouseleave', () => {
            const icon = item.querySelector('i');
            if (icon) {
                icon.style.transform = 'translateX(0)';
            }
        });
    });
    
    // Add active class to current page link in dropdown
    const currentPage = window.location.pathname.split('/').pop();
    dropdownItems.forEach(item => {
        const itemHref = item.getAttribute('href');
        if (itemHref === currentPage || (currentPage === '' && itemHref === 'index.html')) {
            item.classList.add('active');
        } else {
            item.classList.remove('active');
        }
    });
    
    // Check if we're on mobile and auto-expand dropdown if needed
    function checkMobileView() {
        if (window.innerWidth <= 768) {
            // On mobile, show dropdown button more prominently
            dropdownToggle.classList.add('mobile-view');
        } else {
            dropdownToggle.classList.remove('mobile-view');
        }
    }
    
    // Run on load and when window resizes
    checkMobileView();
    window.addEventListener('resize', checkMobileView);
}

// Let's spice things up with some cool animations when the page loads
document.addEventListener('DOMContentLoaded', () => {
    // This makes our header elements fade in nicely
    const header = document.querySelector('header');
    if (header) {
        header.classList.add('animate-fade-in');
    }
    
    // Hero section should grab attention but with reduced intensity
    const heroContent = document.querySelector('.hero-content');
    if (heroContent) {
        heroContent.classList.add('animate-slide-up');
        
        // Stagger the animations of hero elements with less delay
        const heroElements = heroContent.children;
        Array.from(heroElements).forEach((element, index) => {
            element.classList.add('animate-fade-in');
            element.style.animationDelay = `${(index + 1) * 0.1}s`; // Reduced delay
        });
    }
    
    // Make section headers float in - more subtle
    const sectionHeaders = document.querySelectorAll('.section-header');
    sectionHeaders.forEach(header => {
        // Use Intersection Observer to trigger animations as they come into view
        observeElement(header, () => {
            header.classList.add('animate-fade-in');
            header.querySelector('h2')?.classList.add('animate-slide-up');
            // Remove the underline animation to reduce visual noise
            header.querySelector('.underline')?.classList.add('animate-fade-in');
        });
    });
    
    // Card animations make the site feel more interactive - less intense
    const allCards = document.querySelectorAll('.link-card, .event-card, .blog-card, .team-card, .member-card, .advisor-card, .gallery-item');
    allCards.forEach((card, index) => {
        card.classList.add('hover-lift', 'hover-glow');
        observeElement(card, () => {
            card.classList.add('animate-fade-in');
            // Less staggering between card animations
            card.style.animationDelay = `${(index % 3) * 0.08}s`;
        });
    });
    
    // Keep the floating animation for images as requested
    const featureImages = document.querySelectorAll('.intro-image img, .mission-image img, .history-image img');
    featureImages.forEach(img => {
        observeElement(img, () => {
            img.classList.add('animate-float');
        });
    });
    
    // Make icons feel more interactive but less distracting
    const featureIcons = document.querySelectorAll('.link-card i, .footer-social i, .contact-icon i');
    featureIcons.forEach(icon => {
        // Remove automatic pulsing effects to reduce visual noise
        icon.addEventListener('mouseenter', () => {
            icon.style.color = 'var(--accent-color)';
        });
        icon.addEventListener('mouseleave', () => {
            icon.style.color = '';
        });
    });

    // Initialize Back to Top functionality
    initBackToTop();
    
    // Enhance campus map if exists
    enhanceCampusMap();
    // Initialize the animations for elements that are already in view
    triggerInitialAnimations();
});

// Utility function to observe when elements enter the viewport
function observeElement(element, callback) {
    // IntersectionObserver triggers animations as elements come into view
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                callback();
                observer.unobserve(element); // Only animate once
            }
        });
    }, { threshold: 0.2 });  // Slightly higher threshold so animations start later
    
    observer.observe(element);
}

// Trigger animations for elements that are already in the viewport on load
function triggerInitialAnimations() {
    // This makes sure elements that are already visible get animated too
    const animatableElements = document.querySelectorAll('.section-header, .link-card, .event-card, .blog-card, .team-card, .member-card, .advisor-card, .gallery-item, .intro-image img, .mission-image img, .history-image img');
    
    animatableElements.forEach(element => {
        const rect = element.getBoundingClientRect();
        if (rect.top < window.innerHeight && rect.bottom > 0) {
            // Element is in viewport, trigger its animation
            if (element.classList.contains('section-header')) {
                element.classList.add('animate-fade-in');
                element.querySelector('h2')?.classList.add('animate-slide-up');
                element.querySelector('.underline')?.classList.add('animate-fade-in');
            } else if (element.tagName.toLowerCase() === 'img') {
                element.classList.add('animate-float');
            } else {
                element.classList.add('animate-fade-in');
            }
        }
    });
}

// Tabs Functionality
if (tabBtns.length > 0) {
    tabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // Remove active class from all buttons and contents
            tabBtns.forEach(b => b.classList.remove('active'));
            tabContents.forEach(c => c.classList.remove('active'));
            
            // Add active class to clicked button and corresponding content
            btn.classList.add('active');
            const tabId = btn.getAttribute('data-tab');
            document.getElementById(`${tabId}-events`).classList.add('active');
        });
    });
}

// Gallery Filters
if (filterBtns.length > 0) {
    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // Remove active class from all buttons
            filterBtns.forEach(b => b.classList.remove('active'));
            
            // Add active class to clicked button
            btn.classList.add('active');
            
            const filter = btn.getAttribute('data-filter');
            
            // Filter gallery items
            galleryItems.forEach(item => {
                if (filter === 'all' || item.getAttribute('data-category') === filter) {
                    item.style.display = 'block';
                } else {
                    item.style.display = 'none';
                }
            });
        });
    });
}

// Event Modal
if (viewEventBtns.length > 0) {
    viewEventBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            
            // Get event details from the gallery item
            const galleryItem = btn.closest('.gallery-item');
            const eventTitle = galleryItem.querySelector('h3').textContent;
            const eventDate = galleryItem.querySelector('p').textContent;
            const eventImage = galleryItem.querySelector('img').src;
            
            // Populate modal with event details
            document.getElementById('modal-title').textContent = eventTitle;
            document.getElementById('modal-date').innerHTML = `<i class="fas fa-calendar-alt"></i> ${eventDate}`;
            document.getElementById('modal-location').innerHTML = '<i class="fas fa-map-marker-alt"></i> VIT University, Vellore';
            document.getElementById('modal-img').src = eventImage;
            document.getElementById('modal-description').innerHTML = `
                <p>This was an exciting event where students learned about ${eventTitle.toLowerCase()}. The event was well-attended and received positive feedback from participants.</p>
                <p>The event featured hands-on activities, guest speakers, and networking opportunities for students interested in geospatial technologies.</p>
            `;
            
            // Show modal
            eventModal.style.display = 'block';
            document.body.style.overflow = 'hidden';
        });
    });
}

// Close Modal
if (closeModal) {
    closeModal.addEventListener('click', () => {
        eventModal.style.display = 'none';
        document.body.style.overflow = 'auto';
    });
}

// Close Modal when clicking outside
window.addEventListener('click', (e) => {
    if (eventModal && e.target === eventModal) {
        eventModal.style.display = 'none';
        document.body.style.overflow = 'auto';
    }
});

// Members Search and Filter
function filterMembers() {
    const searchTerm = memberSearch ? memberSearch.value.toLowerCase() : '';
    const roleValue = roleFilter ? roleFilter.value : 'all';
    let visibleCount = 0;
    
    memberCards.forEach(card => {
        const name = card.querySelector('h3').textContent.toLowerCase();
        const role = card.getAttribute('data-role');
        
        const matchesSearch = name.includes(searchTerm);
        const matchesRole = roleValue === 'all' || role === roleValue;
        
        if (matchesSearch && matchesRole) {
            card.style.display = 'block';
            visibleCount++;
        } else {
            card.style.display = 'none';
        }
    });
    
    if (noResults) {
        noResults.style.display = visibleCount === 0 ? 'block' : 'none';
    }
}

if (memberSearch) {
    memberSearch.addEventListener('input', filterMembers);
}

if (roleFilter) {
    roleFilter.addEventListener('change', filterMembers);
}

// Back to Top Button Functionality
function initBackToTop() {
    if (!backToTopBtn) return;
    
    // Show back to top button after scrolling down 300px
    window.addEventListener('scroll', () => {
        if (window.scrollY > 300) {
            backToTopBtn.classList.add('visible');
        } else {
            backToTopBtn.classList.remove('visible');
        }
    });
    
    // Smooth scroll to top when clicked
    backToTopBtn.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}

// Enhance campus map if it exists
function enhanceCampusMap() {
    const mapElement = document.getElementById('map');
    if (!mapElement) return;
    
    try {
        // Check if Leaflet library is loaded
        if (typeof L !== 'undefined') {
            // Initialize VIT campus map
            const map = L.map('map', {
                scrollWheelZoom: false,  // Disable scroll wheel zoom by default
                zoomControl: true,       // Add zoom controls
                dragging: true,          // Allow dragging
                tap: true                // Enable tap for mobile
            }).setView([12.969722, 79.155833], 15); // VIT Vellore coordinates
            
            // Add OpenStreetMap tile layer
            L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
                maxZoom: 19
            }).addTo(map);
            
            // Add marker for VIT Vellore campus
            const marker = L.marker([12.969722, 79.155833]).addTo(map);
            marker.bindPopup("<b>VIT University</b><br>Vellore Campus").openPopup();
            
            // Add a custom style overlay to match the website theme
            mapElement.style.border = '2px solid var(--primary-color)';
            mapElement.style.borderRadius = 'var(--radius-md)';
            mapElement.style.boxShadow = '0 5px 15px var(--shadow-color)';
            
            // Enable scroll zoom only when map is focused
            mapElement.addEventListener('click', function() {
                map.scrollWheelZoom.enable();
            });
            
            // Disable scroll zoom when mouse leaves the map
            mapElement.addEventListener('mouseleave', function() {
                map.scrollWheelZoom.disable();
            });
            
            // Fix map container size issues
            setTimeout(function() {
                map.invalidateSize();
            }, 500);
        }
    } catch (error) {
        console.error('Error initializing map:', error);
    }
}

// Animate elements on scroll - with reduced intensity
function animateOnScroll() {
    // Find elements that we want to animate when they come into view
    const elements = document.querySelectorAll('.link-card, .blog-card, .team-card, .member-card, .advisor-card, .section-header');
    
    elements.forEach(element => {
        const elementTop = element.getBoundingClientRect().top;
        const windowHeight = window.innerHeight;
        
        // When element is almost in view, animate it with less intensity
        if (elementTop < windowHeight - 50) {
            // If we haven't already animated this element
            if (!element.classList.contains('has-animated')) {
                element.classList.add('has-animated');
                
                if (element.classList.contains('section-header')) {
                    element.classList.add('animate-fade-in');
                    element.querySelector('h2')?.classList.add('animate-slide-up');
                } else {
                    // Slower and less dramatic transition
                    element.style.opacity = '1';
                    element.style.transform = 'translateY(0)';
                    element.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
                }
            }
        }
    });
}

// Initialize animations - we keep the original animation code too for backward compatibility
document.addEventListener('DOMContentLoaded', () => {
    const animatedElements = document.querySelectorAll('.link-card, .blog-card, .team-card, .member-card, .advisor-card');
    
    animatedElements.forEach(element => {
        element.style.opacity = '0';
        element.style.transform = 'translateY(20px)';
        element.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
    });
    
    // Trigger initial animation
    setTimeout(animateOnScroll, 300);
    
    // Add scroll event listener
    window.addEventListener('scroll', animateOnScroll);
});
