const xlsx = require('xlsx');
const fs = require('fs');

// Read the Excel file
const workbook = xlsx.readFile('D:/inventory-feedback-app/data/items.xlsx');
const sheetName = workbook.SheetNames[0];
const sheet = workbook.Sheets[sheetName];

// Convert to JSON
const jsonData = xlsx.utils.sheet_to_json(sheet);

// Write JSON to a file
fs.writeFileSync('D:/inventory-feedback-app/data/items.json', JSON.stringify(jsonData, null, 2));

console.log('Excel file successfully converted to JSON!');