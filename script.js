const body = document.querySelector('body');
const menuToggle = document.querySelector('.menu-toggle');
const navMenu = document.querySelector('.nav-menu');
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

// Mobile Menu Toggle
if (menuToggle) {
    menuToggle.addEventListener('click', () => {
        navMenu.classList.toggle('active');
        
        if (navMenu.classList.contains('active')) {
            menuToggle.innerHTML = '<i class="fas fa-times"></i>';
        } else {
            menuToggle.innerHTML = '<i class="fas fa-bars"></i>';
        }
    });
}

// Close mobile menu when clicking outside
document.addEventListener('click', (e) => {
    if (navMenu && navMenu.classList.contains('active') && !e.target.closest('nav')) {
        navMenu.classList.remove('active');
        menuToggle.innerHTML = '<i class="fas fa-bars"></i>';
    }
});

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

// Initialize Map on Home Page
const mapElement = document.getElementById('map');
if (mapElement) {
    // Import Leaflet library
    var L = window.L;

    // Initialize Leaflet map
    const map = L.map('map').setView([12.9692, 79.1559], 15); // VIT Vellore coordinates
    
    // Add OpenStreetMap tiles
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);
    
    // Add marker for VIT
    const vitMarker = L.marker([12.9692, 79.1559]).addTo(map);
    vitMarker.bindPopup("<b>VIT University</b><br>Vellore, Tamil Nadu").openPopup();
    
    // Add markers for event locations
    const eventLocations = [
        { name: "Tech Tower", coords: [12.9712, 79.1590], desc: "GIS Workshop Location" },
        { name: "Anna Auditorium", coords: [12.9680, 79.1540], desc: "Guest Lecture Venue" },
        { name: "Technology Center", coords: [12.9700, 79.1570], desc: "GeoHackathon Venue" }
    ];
    
    eventLocations.forEach(location => {
        const marker = L.marker(location.coords).addTo(map);
        marker.bindPopup(`<b>${location.name}</b><br>${location.desc}`);
    });
}

// Animate elements on scroll
function animateOnScroll() {
    const elements = document.querySelectorAll('.link-card, .blog-card, .team-card, .member-card, .advisor-card');
    
    elements.forEach(element => {
        const elementTop = element.getBoundingClientRect().top;
        const windowHeight = window.innerHeight;
        
        if (elementTop < windowHeight - 100) {
            element.style.opacity = '1';
            element.style.transform = 'translateY(0)';
        }
    });
}

// Initialize animations
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
