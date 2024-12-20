let images = [];
let currentImageIndex = 0;

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

function checkImageExists(imgPath) {
    return new Promise((resolve) => {
        const img = new Image();
        img.src = imgPath;
        img.onload = () => resolve(imgPath);
        img.onerror = () => resolve(null); // Return null if image does not exist
    });
}

function updateImage() {
    const itemImage = document.getElementById("itemImage");
    if (images.length > 0) {
        itemImage.src = images[currentImageIndex];
    } else {
        itemImage.src = ''; // Clear the image if no images are found
    }
}

function prevImage() {
    if (images.length > 0) {
        currentImageIndex = (currentImageIndex - 1 + images.length) % images.length;
        updateImage();
    }
}

function nextImage() {
    if (images.length > 0) {
        currentImageIndex = (currentImageIndex + 1) % images.length;
        updateImage();
    }
}
