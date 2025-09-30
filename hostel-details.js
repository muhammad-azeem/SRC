// ✅ Run after DOM fully loads
document.addEventListener('DOMContentLoaded', () => {
    // Get hostel ID from URL
    const urlParams = new URLSearchParams(window.location.search);
    const hostelId = urlParams.get("id");

    // Load data
    loadHostelDetails(hostelId);
    // loadComments(hostelId);
    setupCommentForm(hostelId);
});

// ✅ Load hostel details
function loadHostelDetails(hostelId) {
    const section = document.getElementById('hostel-details');
    if (!hostelId || !section) {
        section.innerHTML = '<div class="container"><h2>Hostel not found</h2></div>';
        return;
    }

    fetch(`php/get_hostel.php?id=${hostelId}`)
        .then(res => res.json())
        .then(data => {
            if (data?.success && data.hostel) {
                displayHostelDetails(data.hostel);
            } else {
                section.innerHTML = '<div class="container"><h2>Hostel not found</h2></div>';
            }
        })
        .catch(() => {
            section.innerHTML = '<div class="container"><h2>Error loading details</h2></div>';
        });
}

// ✅ Show hostel details
function displayHostelDetails(hostel) {
    document.getElementById("hostel-title").textContent = hostel.name || "Hostel Name";
    document.getElementById("hostel-gallery").innerHTML = createGallery([hostel.images, hostel.image2, hostel.image3]);
    document.getElementById("hostel-address").innerHTML = `<i class="fas fa-map-marker-alt"></i> ${hostel.address || 'N/A'}`;
    document.getElementById("hostel-description").textContent = hostel.description || "No description available";
    document.getElementById("hostel-amenities").innerHTML = createAmenitiesList(hostel.amenities);
    document.getElementById("hostel-rent").textContent = `₨${hostel.rent?.toLocaleString() || 'N/A'}`;

    const mapBtn = document.getElementById("hostel-location-btn");
    if (hostel.coordinates?.trim()) {
        mapBtn.href = hostel.coordinates;
        mapBtn.style.display = "inline-block";
    } else {
        mapBtn.style.display = "none";
    }
}

// ✅ Create gallery
function createGallery(images) {
    const valid = images.filter(img => img);
    if (!valid.length) return `<p>No images available</p>`;
    return valid.map(img => `<img src="${img}" class="gallery-image">`).join('');
}

// ✅ Create amenities list
function createAmenitiesList(amenities) {
    if (!amenities) return `<p>No amenities listed</p>`;
    const icons = { wifi: 'fa-wifi', ac: 'fa-snowflake', meals: 'fa-utensils', laundry: 'fa-soap', gym: 'fa-dumbbell' };
    return amenities.split(', ').map(item => `
        <div class="amenity-item">
            <i class="fas ${icons[item.toLowerCase()] || 'fa-check'}"></i>
            <span>${item.charAt(0).toUpperCase() + item.slice(1)}</span>
        </div>
    `).join('');
}

// ✅ Load comments
// function loadComments(hostelId) {
//     if (!hostelId) return;
//     fetch(`php/get_comments.php?hostel_id=${hostelId}`)
//         .then(res => res.json())
//         .catch(err => console.error("Error loading comments", err));
// }

// ✅ Submit comment
function setupCommentForm(hostelId) {
    const form = document.getElementById("comment-form");
    if (!form) return;

    form.addEventListener("submit", e => {
        e.preventDefault();
        const username = document.getElementById("username").value.trim();
        const comment = document.getElementById("comment").value.trim();

        if (!username || !comment) {
            alert("Please enter your name and comment.");
            return;
        }

        fetch("php/submit_comment.php", {
            method: "POST",
            body: new URLSearchParams({ hostel_id: hostelId, username, comment }),
            headers: { "Content-Type": "application/x-www-form-urlencoded" }
        })
        .then(res => res.json())
        .then(data => {
            alert(data.message);
            if (data.success) {
               // loadComments(hostelId);
                form.reset();
            }
        })
        .catch(err => console.error("Error submitting comment", err));
    });
}
