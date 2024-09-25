import redis from 'redis';

// Create Redis client
const client = redis.createClient();

// Constants
const HASH_NAME = 'HolbertonSchools';

// Function to log messages with timestamps
function logWithTimestamp(message) {
    const timestamp = new Date().toISOString();
    console.log(`[${timestamp}] ${message}`);
}

// Redis event listeners
client.on('connect', () => {
    logWithTimestamp('Connected to Redis');
});

client.on('error', (err) => {
    logWithTimestamp(`Redis Client Error: ${err.message}`);
});

// Async function to manage Redis operations
(async () => {
    try {
        await client.connect();

        // Batch setting of hash fields
        const schoolData = {
            Portland: 50,
            Seattle: 80,
            NewYork: 20,
            Bogota: 20,
            Cali: 40,
            Paris: 2,
        };

        await client.hSet(HASH_NAME, schoolData);
        logWithTimestamp('Hash fields set successfully');

        // Get all fields from the hash
        const result = await client.hGetAll(HASH_NAME);
        logWithTimestamp('HolbertonSchools hash: ' + JSON.stringify(result, null, 2));

    } catch (error) {
        logWithTimestamp(`Error during Redis operations: ${error.message}`);
    } finally {
        await client.quit();
        logWithTimestamp('Redis client connection closed');
    }
})();
