function checkAuth() {
    const isAdmin = localStorage.getItem("adminAuth");
    if (!isAdmin) {
        window.location.href = "login.html";
    }
}

document.getElementById('search-input').addEventListener('input', function() {
    const filter = this.value.toLowerCase();
    const rows = hostelTableBody.getElementsByTagName('tr');
    for (let row of rows) {
        const nameCell = row.cells[0];
        if (nameCell) {
            const text = nameCell.textContent.toLowerCase();
            row.style.display = text.includes(filter) ? '' : 'none';
        }
    }
});


// Base URL for PHP files
const BASE_URL = "http://localhost/project/php/";

// DOM Elements
const hostelTableBody = document.getElementById("hostels-table-body");
const addHostelBtn = document.getElementById("add-hostel-btn");
const hostelModal = document.getElementById("hostel-modal");
const hostelForm = document.getElementById("hostel-form");
const logoutBtn = document.getElementById("logout-btn");

let editingHostelId = null;

// Load hostels from the server with error handling
function loadHostelsTable() {
    fetch(`${BASE_URL}get_hostels.php`)
        .then(response => response.text()) // Convert response to text
        .then(text => {
            try {
                const data = JSON.parse(text);
                if (data.success) {
                    // Reverse the hostels array to show descending order
                    const hostelsDesc = data.hostels.reverse();

                    hostelTableBody.innerHTML = hostelsDesc.map(hostel => `
                        <tr>
                            <td>${hostel.name}</td>
                            <td>${hostel.address}</td>
                            <td>₨${hostel.rent.toLocaleString()}</td>
                            <td>
                                <button onclick="editHostel(${hostel.id})" class="edit-btn">
                                    <i class="fas fa-edit"></i>
                                </button>
                                <button onclick="deleteHostel(${hostel.id})" class="delete-btn">
                                    <i class="fas fa-trash"></i>
                                </button>
                            </td>
                        </tr>
                    `).join('');
                } else {
                    hostelTableBody.innerHTML = "<tr><td colspan='4'>No hostels found</td></tr>";
                }
            } catch (error) {
                console.error("JSON Parse Error:", text);
            }
        })
        .catch(error => console.error("Error:", error));
}


function showModal(hostel = null) {
    document.getElementById("modal-title").textContent = hostel ? "Edit Hostel" : "Add New Hostel";
    
    const imageInputs = document.getElementById("image-inputs");

    if (hostel) {
        editingHostelId = hostel.id;
        document.getElementById("hostel-name").value = hostel.name;
        document.getElementById("hostel-description").value = hostel.description;
        document.getElementById("hostel-rent").value = hostel.rent;
        document.getElementById("hostel-address").value = hostel.address;
        document.getElementById("hostel-coordinates").value = hostel.coordinates || "";

        // Set amenities checkboxes
        document.querySelectorAll(".amenities-checkboxes input").forEach(checkbox => {
            checkbox.checked = hostel.amenities.includes(checkbox.value);
        });

        // Set multiple image input boxes
        const imageUrls = [];
        if (hostel.images) imageUrls.push(hostel.images);
        if (hostel.image2) imageUrls.push(hostel.image2);
        if (hostel.image3) imageUrls.push(hostel.image3);

        imageInputs.innerHTML = "";
        imageUrls.forEach(image => {
            const input = document.createElement("input");
            input.type = "url";
            input.className = "image-url";
            input.required = true;
            input.value = image.trim();
            imageInputs.appendChild(input);
        });

    } else {
        editingHostelId = null;
        hostelForm.reset();
        imageInputs.innerHTML = `
            <input type="url" class="image-url" required placeholder="Enter image URL">
        `;
    }

    hostelModal.classList.add("active");
}



// Handle form submission (Add or Edit)
hostelForm.addEventListener("submit", (e) => {
    e.preventDefault();

    const formData = {
        name: document.getElementById("hostel-name").value,
        description: document.getElementById("hostel-description").value,
        rent: Number(document.getElementById("hostel-rent").value),
        address: document.getElementById("hostel-address").value,
        amenities: Array.from(document.querySelectorAll(".amenities-checkboxes input:checked")).map(checkbox => checkbox.value),
        images: Array.from(document.querySelectorAll(".image-url")).map(input => input.value),
        coordinates: document.getElementById("hostel-coordinates").value.trim()
    };

    if (editingHostelId) {
        updateHostel(editingHostelId, formData);
    } else {
        addHostel(formData);
    }

    hostelModal.classList.remove("active");
    loadHostelsTable();
});

// Add new hostel
function addHostel(hostelData) {
    fetch(`${BASE_URL}add_hostel.php`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(hostelData)
    })
    .then(response => response.json())
    .then(data => {
        alert(data.message);
        if (data.success) loadHostelsTable();
    })
    .catch(error => console.error("Error:", error));
}

// Update existing hostel
function updateHostel(id, hostelData) {
    hostelData.id = id; // Add ID to request body

    fetch(`${BASE_URL}update_hostel.php`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(hostelData)
    })
    .then(response => response.json())
    .then(data => {
        alert(data.message);
        if (data.success) loadHostelsTable();
    })
    .catch(error => console.error("Error:", error));
}

// Delete hostel
function deleteHostel(id) {
    if (confirm("Are you sure you want to delete this hostel?")) {
        fetch(`${BASE_URL}delete_hostel.php`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ id })
        })
        .then(response => response.json())
        .then(data => {
            alert(data.message);
            if (data.success) loadHostelsTable();
        })
        .catch(error => console.error("Error:", error));
    }
}

// Edit hostel
function editHostel(id) {
    fetch(`${BASE_URL}get_hostel.php?id=${id}`)
        .then(response => response.text()) // Convert response to text
        .then(text => {
            try {
                const data = JSON.parse(text);
                if (data.success) {
                    showModal(data.hostel);
                } else {
                    alert("Hostel not found");
                }
            } catch (error) {
                console.error("JSON Parse Error:", text);
            }
        })
        .catch(error => console.error("Error:", error));
}

// Event Listeners
document.addEventListener("DOMContentLoaded", () => {
    checkAuth();
    loadHostelsTable();
});

addHostelBtn.addEventListener("click", () => showModal());

logoutBtn.addEventListener("click", () => {
    localStorage.removeItem("adminAuth");
    window.location.href = "login.html";
});

// Close modal when clicking outside or on close button
document.querySelectorAll(".close-modal").forEach(button => {
    button.addEventListener("click", () => {
        hostelModal.classList.remove("active");
    });
});

hostelModal.addEventListener("click", (e) => {
    if (e.target === hostelModal) {
        hostelModal.classList.remove("active");
    }
});
