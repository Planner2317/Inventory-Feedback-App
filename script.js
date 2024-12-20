let currentImageIndex = 0;
let images = [];

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
            for (let i = 1; i <= 5; i++) {
                const imgPath = `./images/${itemCode}/image${i}.jpg`;
                const img = new Image();
                img.src = imgPath;
                img.onload = () => images.push(imgPath);
                img.onerror = () => console.log(`Image ${imgPath} not found.`);
            }

            // Wait for all images to load or error out
            setTimeout(() => {
                if (images.length > 0) {
                    updateImage();
                    itemDetails.classList.remove("hidden");
                } else {
                    alert("No images found for this item.");
                }
            }, 1000); // Adjust timeout as needed
        } else {
            alert("Item not found!");
        }
    } catch (error) {
        console.error("Error loading JSON file:", error);
        alert("Failed to load item data. Please try again later.");
    }
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
    if (currentImageIndex > 0) {
        currentImageIndex--;
        updateImage();
    }
}

function nextImage() {
    if (currentImageIndex < images.length - 1) {
        currentImageIndex++;
        updateImage();
    }
}

document.getElementById("feedbackForm").addEventListener("submit", function(event) {
    event.preventDefault();
    // Handle form data here
    alert("Form submitted!");
});