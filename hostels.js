// DOM Elements
console.log("hostels.js loaded");

const allHostelsGrid = document.getElementById('all-hostels');
const searchInput = document.getElementById('search-input');
const priceRange = document.getElementById('price-range');
const amenitiesSelect = document.getElementById('amenities');
const locationSelect = document.getElementById('location'); // Location dropdown
const pagination = document.getElementById('pagination');

// Constants
const HOSTELS_PER_PAGE = 12;
let currentPage = 1;
let hostelsData = []; // Store fetched hostels globally

// Fetch hostels from PHP API
function fetchHostels() {
    console.log("Fetching hostels...");

    fetch("./php/get_hostels.php")
        .then(response => response.json())
        .then(data => {
            console.log("Full API Response:", data);

            if (data.success) {
                hostelsData = data.hostels;
                populateLocationDropdown(); // Populate locations after fetching data
                loadAllHostels();
            } else {
                allHostelsGrid.innerHTML = "<p>No hostels found</p>";
            }
        })
        .catch(error => console.error("Error fetching hostels:", error));
}

// Populate Location Dropdown
// Populate Location Dropdown with unique addresses
function populateLocationDropdown() {
    const uniqueLocations = new Set(); // Use Set to store unique addresses

    hostelsData.forEach(hostel => {
        if (hostel.address.trim() !== "") {
            uniqueLocations.add(hostel.address.trim()); // Trim spaces and add to Set
        }
    });

    locationSelect.innerHTML = `<option value="">All Locations</option>`; // Default option

    uniqueLocations.forEach(location => {
        locationSelect.innerHTML += `<option value="${location}">${location}</option>`;
    });

    console.log("Unique Locations in Dropdown:", [...uniqueLocations]); // Debugging log
}


// Create hostel card HTML
function createHostelCard(hostel) {
    return `
        <div class="hostel-card">
            <img src="${hostel.images[0]}" alt="${hostel.name}" class="hostel-image">
            <div class="hostel-content">
                <h3 class="hostel-title">${hostel.name}</h3>
                <div class="hostel-location">
                    <i class="fas fa-map-marker-alt"></i>
                    <span>${hostel.address}</span>
                </div>
               <p class="hostel-description">
    <i class="fas fa-align-left"></i> ${hostel.description}
</p>

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
        laundry: 'fa-soap',
        gym: 'fa-dumbbell'
    };

    return amenities.map(amenity => `
        <span class="amenity-tag">
            <i class="fas ${amenityIcons[amenity] || 'fa-check'}"></i>
            ${amenity.charAt(0).toUpperCase() + amenity.slice(1)}
        </span>
    `).join('');
}

// Load and display hostels with pagination
function loadAllHostels(page = 1) {
    const filteredHostels = filterHostels(hostelsData);
    const totalPages = Math.ceil(filteredHostels.length / HOSTELS_PER_PAGE);

    const start = (page - 1) * HOSTELS_PER_PAGE;
    const end = start + HOSTELS_PER_PAGE;
    const pageHostels = filteredHostels.slice(start, end);

    allHostelsGrid.innerHTML = pageHostels.map(hostel => createHostelCard(hostel)).join('');
    createPagination(totalPages, page);
}

// Filter hostels based on search and filters
function filterHostels(hostels) {
    const searchTerm = searchInput.value.toLowerCase();
    const selectedPrice = priceRange.value;
    const selectedAmenity = amenitiesSelect.value;
    const selectedLocation = locationSelect.value;

    return hostels.filter(hostel => {
        const matchesSearch = hostel.name.toLowerCase().includes(searchTerm) ||
                              hostel.description.toLowerCase().includes(searchTerm) ||
                              hostel.address.toLowerCase().includes(searchTerm);
        
        const matchesPrice = !selectedPrice || checkPriceRange(hostel.rent, selectedPrice);
        const matchesAmenity = !selectedAmenity || hostel.amenities.includes(selectedAmenity);
       const matchesLocation = !selectedLocation || hostel.address.trim().toLowerCase() === selectedLocation.trim().toLowerCase();


        return matchesSearch && matchesPrice && matchesAmenity && matchesLocation;
    });
}

// Check if hostel price is within selected range
function checkPriceRange(rent, range) {
    if (range.includes('+')) {
        const min = parseInt(range);
        return rent >= min;
    } else {
        const [min, max] = range.split('-').map(Number);
        return rent >= min && rent <= max;
    }
}


// Create pagination controls
function createPagination(totalPages, currentPage) {
    let paginationHTML = '';

    if (totalPages > 1) {
        paginationHTML += `
            <button class="pagination-btn" ${currentPage === 1 ? 'disabled' : ''} 
                    onclick="changePage(${currentPage - 1})">
                Previous
            </button>
        `;

       const maxVisibleButtons = 5;
let startPage = Math.max(2, currentPage - Math.floor(maxVisibleButtons / 2));
let endPage = Math.min(totalPages - 1, startPage + maxVisibleButtons - 1);

if (endPage - startPage < maxVisibleButtons - 1) {
    startPage = Math.max(2, endPage - maxVisibleButtons + 1);
}

// Always show first page
paginationHTML += `
    <button onclick="changePage(1)"
        style="
            padding: 6px 12px;
            margin: 3px;
            border: none;
            background-color: ${currentPage === 1 ? '#333' : '#eee'};
            color: ${currentPage === 1 ? '#fff' : '#333'};
            font-weight: ${currentPage === 1 ? 'bold' : 'normal'};
            border-radius: 4px;
            cursor: pointer;">
        1
    </button>
`;

// Add ... if needed before startPage
if (startPage > 2) {
    paginationHTML += `<span style="margin: 3px;">...</span>`;
}

// Middle buttons
for (let i = startPage; i <= endPage; i++) {
    paginationHTML += `
        <button onclick="changePage(${i})"
            style="
                padding: 6px 12px;
                margin: 3px;
                border: none;
                background-color: ${i === currentPage ? '#333' : '#eee'};
                color: ${i === currentPage ? '#fff' : '#333'};
                font-weight: ${i === currentPage ? 'bold' : 'normal'};
                border-radius: 4px;
                cursor: pointer;">
            ${i}
        </button>
    `;
}

// Add ... if needed after endPage
if (endPage < totalPages - 1) {
    paginationHTML += `<span style="margin: 3px;">...</span>`;
}

// Always show last page
if (totalPages > 1) {
    paginationHTML += `
        <button onclick="changePage(${totalPages})"
            style="
                padding: 6px 12px;
                margin: 3px;
                border: none;
                background-color: ${currentPage === totalPages ? '#333' : '#eee'};
                color: ${currentPage === totalPages ? '#fff' : '#333'};
                font-weight: ${currentPage === totalPages ? 'bold' : 'normal'};
                border-radius: 4px;
                cursor: pointer;">
            ${totalPages}
        </button>
    `;
}



        paginationHTML += `
            <button class="pagination-btn" ${currentPage === totalPages ? 'disabled' : ''} 
                    onclick="changePage(${currentPage + 1})">
                Next
            </button>
        `;
    }

    pagination.innerHTML = paginationHTML;
}

// Change page
function changePage(page) {
    currentPage = page;
    loadAllHostels(page);
    window.scrollTo(0, 0);
}

// Event Listeners
document.addEventListener('DOMContentLoaded', fetchHostels);

// Filter event listeners
searchInput.addEventListener('input', () => loadAllHostels(1));
priceRange.addEventListener('change', () => loadAllHostels(1));
amenitiesSelect.addEventListener('change', () => loadAllHostels(1));
locationSelect.addEventListener('change', () => loadAllHostels(1));
