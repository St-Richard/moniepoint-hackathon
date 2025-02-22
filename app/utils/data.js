import fs from 'fs';
import path from 'path';

const transactions = [];

function parseFile(filePath) {
  const fileContent = fs.readFileSync(filePath, 'utf-8');
  const lines = fileContent.split('\n').filter(line => line.trim() !== '');
  lines.map(line => {
    transactions.push(line);
  });
}

export default function parseFiles(directoryPath) {
  const files = fs.readdirSync(directoryPath).filter(file => file.endsWith('.txt'));
  let statements = [];
  files.forEach(file => {
    const filePath = path.join(directoryPath, file);
    const fileStatements = parseFile(filePath);
    statements = statements.concat(fileStatements);
  });
  return statements;
}

const __dirname = path.dirname(new URL(import.meta.url).pathname).substring(1);
const directoryPath = path.join(__dirname, '../transactions');
parseFiles(directoryPath);

let maxSalesVolume = 0;
let highestSalesValue = 0;
let productSales = {};
let staffSales = {};
let hourSales = {};
let mostSoldProduct = '';
let highestSalesStaff = {};
let highestHour = {};

export async function processTransaction() {// Process each transaction
  transactions.forEach(transaction => {

    const parts = transaction.split(',');

    const staffId = parts[0];
    const transactionTime = parts[1];
    const products = parts[2].slice(1, -1).split('|');
    const salesValue = parseFloat(parts[3]);

    let totalQuantity = 0;
    products.forEach(product => {
      const quantity = parseInt(product.split(':')[1], 10); // Extract the quantity after the colon
      totalQuantity += quantity;
    });

    if (totalQuantity > maxSalesVolume) {
      maxSalesVolume = totalQuantity;
    }

    if (salesValue > highestSalesValue) {
      highestSalesValue = salesValue;
    }

    products.forEach(product => {
      const [productId, quantity] = product.split(':');
      const qty = parseInt(quantity, 10);


      productSales[productId] = (productSales[productId] || 0) + qty;
    });

    // 3. Highest sales staff ID for each month
    const month = transactionTime.substring(0, 7);  // Extracts the YYYY-MM format
    staffSales[month] = staffSales[month] || {};
    staffSales[month][staffId] = (staffSales[month][staffId] || 0) + salesValue;

    // 4. Highest hour of the day by average transaction volume
    const hour = transactionTime.substring(11, 13);  // Extracts the hour (HH) part
    hourSales[hour] = hourSales[hour] || { totalQuantity: 0, transactionCount: 0 };
    products.forEach(product => {
      const quantity = parseInt(product.split(':')[1], 10);
      hourSales[hour].totalQuantity += quantity;
      hourSales[hour].transactionCount += 1;
    });
  });

  // Find most sold product by volume
  mostSoldProduct = Object.keys(productSales).reduce((a, b) => productSales[a] > productSales[b] ? a : b);

  // Find highest sales staff for each month
  Object.keys(staffSales).forEach(month => {
    highestSalesStaff[month] = Object.keys(staffSales[month]).reduce((a, b) => staffSales[month][a] > staffSales[month][b] ? a : b);
  });

  // Find the hour with the highest average transaction volume
  Object.keys(hourSales).forEach(hour => {
    const avgVolume = hourSales[hour].totalQuantity / hourSales[hour].transactionCount;
    if (!highestHour.avgVolume || avgVolume > highestHour.avgVolume) {
      highestHour = { hour, avgVolume };
    }
  });
  const formatedHour = highestHour.hour;

  const CardData = {
    maxSalesVolume,
    highestSalesValue,
    mostSoldProduct,
    highestSalesStaff,
    formatedHour
  };
  return CardData;
}
