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

    // Load Excel File
    const response = await fetch("./data/items.xlsx");
    const data = await response.arrayBuffer();
    const workbook = XLSX.read(data, { type: "array" });
    const sheet = workbook.Sheets[workbook.SheetNames[0]];
    const excelData = XLSX.utils.sheet_to_json(sheet);

    // Find Item Data
    const result = excelData.find(row => row["Item Code"] === itemCode);

    if (result) {
        oldDescription.textContent = result["Old Description"];
        location.textContent = result["Location"];

        // Load Images
        const imgPath = `./images/${itemCode}/`;
        for (let i = 1; i <= 5; i++) {
            images.push(`${imgPath}image${i}.jpg`);
        }

        updateImage();
        itemDetails.classList.remove("hidden");
    } else {
        alert("Item not found!");
    }
}

function updateImage() {
    const itemImage = document.getElementById("itemImage");
    if (images.length > 0) {
        itemImage.src = images[currentImageIndex];
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
