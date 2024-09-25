import express from 'express';
import { createClient } from 'redis';
import { promisify } from 'util';

// Define the list of products
const listProducts = [
    { itemId: 1, itemName: 'Suitcase 250', price: 50, initialAvailableQuantity: 4 },
    { itemId: 2, itemName: 'Suitcase 450', price: 100, initialAvailableQuantity: 10 },
    { itemId: 3, itemName: 'Suitcase 650', price: 350, initialAvailableQuantity: 2 },
    { itemId: 4, itemName: 'Suitcase 1050', price: 550, initialAvailableQuantity: 5 }
];

// Function to get a product by ID
function getItemById(id) {
    return listProducts.find((product) => product.itemId === id);
}

// Initialize Express and Redis client
const app = express();
const port = 1245;

const client = createClient();

client.on('error', (err) => console.error('Redis Client Error', err));

async function connectRedis() {
    try {
        await client.connect();
        console.log('Connected to Redis');
    } catch (err) {
        console.error('Redis connection failed', err);
    }
}

connectRedis();

// Promisify Redis client methods for async/await usage
const getAsync = promisify(client.get).bind(client);
const setAsync = promisify(client.set).bind(client);

// Function to reserve stock by item ID
async function reserveStockById(itemId, stock) {
    try {
        await setAsync(`item.${itemId}`, stock);
    } catch (err) {
        console.error(`Error setting stock for item ${itemId}:`, err);
    }
}

// Function to get the current reserved stock by item ID
async function getCurrentReservedStockById(itemId) {
    try {
        const stock = await getAsync(`item.${itemId}`);
        return stock !== null ? parseInt(stock, 10) : null;
    } catch (err) {
        console.error(`Error getting stock for item ${itemId}:`, err);
        return null;
    }
}

// Route to list all products
app.get('/list_products', (req, res) => {
    res.json(listProducts);
});

// Route to get a product by ID with its current stock
app.get('/list_products/:itemId', async (req, res) => {
    const itemId = parseInt(req.params.itemId, 10);
    const product = getItemById(itemId);

    if (!product) {
        return res.status(404).json({ status: 'Product not found' });
    }

    const currentStock = await getCurrentReservedStockById(itemId) || product.initialAvailableQuantity;
    res.json({ ...product, currentQuantity: currentStock });
});

// Route to reserve a product by ID
app.get('/reserve_product/:itemId', async (req, res) => {
    const itemId = parseInt(req.params.itemId, 10);
    const product = getItemById(itemId);

    if (!product) {
        return res.status(404).json({ status: 'Product not found' });
    }

    const currentStock = await getCurrentReservedStockById(itemId) || product.initialAvailableQuantity;

    if (currentStock <= 0) {
        return res.status(400).json({ status: 'Not enough stock available', itemId });
    }

    await reserveStockById(itemId, currentStock - 1);
    res.json({ status: 'Reservation confirmed', itemId });
});

// Start the Express server
app.listen(port, () => {
    console.log(`API available on localhost port ${port}`);
});
