window.addEventListener('DOMContentLoaded', () => {
  if (localStorage.getItem('loggedIn') === 'true') {
    const logoutSection = document.getElementById('logout-section');
    if (logoutSection) {
      logoutSection.style.display = 'block';
    }
  }
});



const featuredHostelsGrid = document.getElementById('featured-hostels');

// Create hostel card HTML
function createHostelCard(hostel) {
    return `
        <div class="hostel-card">
            <img src="${hostel.images[0]}" alt="${hostel.name}" class="hostel-image">
            <div class="hostel-content">
                <h3 class="hostel-title">${hostel.name}</h3>
                <div class="hostel-location">
                    <i class="fas fa-map-marker-alt"></i>
                    <span>${hostel.location.address}</span>
                </div>
                <p class="hostel-description">${hostel.description}</p>
                <div class="hostel-amenities">
                    ${createAmenityTags(hostel.amenities)}
                </div>
                <div class="hostel-footer">
                    <span class="hostel-price">₨${hostel.rent.toLocaleString()}</span>
                    <a href="hostel-details.html?id=${hostel.id}" class="primary-btn">View Details</a>
                </div>
            </div>
        </div>
    `;
}

// Create amenity tags HTML
function createAmenityTags(amenities) {
    const amenityIcons = {
        wifi: 'fa-wifi',
        ac: 'fa-snowflake',
        meals: 'fa-utensils',
        laundry: 'fa-washing-machine',
        gym: 'fa-dumbbell'
    };

    return amenities.map(amenity => `
        <span class="amenity-tag">
            <i class="fas ${amenityIcons[amenity]}"></i>
            ${amenity.charAt(0).toUpperCase() + amenity.slice(1)}
        </span>
    `).join('');
}

// Event Listeners




document.addEventListener("DOMContentLoaded", function () {
    console.log("DOM fully loaded");

    const navToggle = document.getElementById('nav-toggle');
    const navMenu = document.getElementById('nav-menu');

    if (navToggle && navMenu) {
        navToggle.addEventListener('click', () => {
            console.log("Hamburger clicked"); // Debugging
            navMenu.classList.toggle('active');
        });
    } else {
        console.log("navToggle or navMenu not found"); // Debugging
    }
// Update footer year
document.getElementById('current-year').textContent = new Date().getFullYear();
});
