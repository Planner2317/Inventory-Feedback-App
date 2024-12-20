document.addEventListener('DOMContentLoaded', function() {
    // Ensure "Unknown" is selected as default for all dropdowns
    const dropdowns = document.querySelectorAll('select');
    
    dropdowns.forEach(dropdown => {
        // Find the "Unknown" option in each dropdown and set it as selected
        const unknownOption = dropdown.querySelector('option[value="unknown"]');
        if (unknownOption) {
            unknownOption.selected = true; // Ensure "Unknown" is selected by default
        }
    });

    // Event listener for searching an item by code
    document.getElementById('searchBtn').addEventListener('click', async function() {
        await searchItem();
    });
});

// Function to search item by code and fetch details
async function searchItem() {
    const itemCode = document.getElementById("itemCode").value.trim();
    const itemDetails = document.getElementById("itemDetails");
    const oldDescription = document.getElementById("oldDescription");
    const location = document.getElementById("location");
    const itemImage = document.getElementById("itemImage");

    // Reset
    itemDetails.classList.add("hidden");
    oldDescription.textContent = "";
    location.textContent = "";
    images = [];
    currentImageIndex = 0;

    // Load JSON File
    try {
        const response = await fetch("./data/items.json");
        if (!response.ok) throw new Error("Network response was not ok");
        const jsonData = await response.json();

        // Find Item Data
        const result = jsonData.find(row => row["Item Code"] === itemCode);

        if (result) {
            oldDescription.textContent = result["Old Description"];
            location.textContent = result["Location"];

            // Load Images
            const imagePromises = [];
            for (let i = 1; i <= 5; i++) {
                const imgPath = `./images/${itemCode}/image${i}.jpg`;
                imagePromises.push(checkImageExists(imgPath));
            }

            const imageResults = await Promise.all(imagePromises);
            images = imageResults.filter(imgPath => imgPath !== null);

            if (images.length > 0) {
                updateImage();
                itemDetails.classList.remove("hidden");
            } else {
                alert("No images found for this item.");
            }
        } else {
            alert("Item not found!");
        }
    } catch (error) {
        console.error("Error loading JSON file:", error);
        alert("Failed to load item data. Please try again later.");
    }
}

// Function to check if an image exists
function checkImageExists(imgPath) {
    return new Promise((resolve) => {
        const img = new Image();
        img.src = imgPath;
        img.onload = () => resolve(imgPath);
        img.onerror = () => resolve(null); // Return null if image does not exist
    });
}

// Function to update the image displayed
function updateImage() {
    const itemImage = document.getElementById("itemImage");
    if (images.length > 0) {
        itemImage.src = images[currentImageIndex];
    } else {
        itemImage.src = ''; // Clear the image if no images are found
    }
}

// Function to display previous image
function prevImage() {
    if (images.length > 0) {
        currentImageIndex = (currentImageIndex - 1 + images.length) % images.length;
        updateImage();
    }
}

// Function to display next image
function nextImage() {
    if (images.length > 0) {
        currentImageIndex = (currentImageIndex + 1) % images.length;
        updateImage();
    }
}
