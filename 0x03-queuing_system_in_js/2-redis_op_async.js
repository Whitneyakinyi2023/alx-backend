import { createClient } from 'redis';

const client = createClient();
const TIMEOUT_DURATION = 5000; // 5 seconds

// Function to log messages with timestamps
function logWithTimestamp(message) {
    const timestamp = new Date().toISOString();
    console.log(`[${timestamp}] ${message}`);
}

// Error handling for Redis client connection
client.on('error', (error) => {
    logWithTimestamp(`Redis client not connected to the server: ${error.message}`);
});

// Function to connect to Redis
async function connectRedis() {
    try {
        await client.connect();
        logWithTimestamp('Redis client connected to the server');
    } catch (error) {
        logWithTimestamp(`Failed to connect to Redis: ${error.message}`);
    }
}

// Function to set a new school value
async function setNewSchool(schoolName, value) {
    logWithTimestamp(`Setting value for "${schoolName}" to "${value}"`);
    try {
        const reply = await client.set(schoolName, value);
        logWithTimestamp(`Set operation reply: ${reply}`);
    } catch (error) {
        logWithTimestamp(`Error setting value for "${schoolName}": ${error.message}`);
    }
}

// Function to display a school's value with timeout handling
async function displaySchoolValue(schoolName) {
    logWithTimestamp(`Getting value for "${schoolName}"`);
    try {
        const reply = await Promise.race([
            client.get(schoolName),
            new Promise((_, reject) => setTimeout(() => reject(new Error('Timeout')), TIMEOUT_DURATION))
        ]);

        if (reply === null) {
            logWithTimestamp(`No value found for "${schoolName}"`);
        } else {
            logWithTimestamp(`Value for "${schoolName}": ${reply}`);
        }
    } catch (error) {
        if (error.message === 'Timeout') {
            logWithTimestamp(`Timeout occurred while retrieving value for "${schoolName}"`);
        } else {
            logWithTimestamp(`Error retrieving value for "${schoolName}": ${error.message}`);
        }
    }
}

// Main function to execute the logic
async function run() {
    await connectRedis();
    await displaySchoolValue('Holberton');
    await setNewSchool('HolbertonSanFrancisco', '100');
    await displaySchoolValue('HolbertonSanFrancisco');
}

// Execute the main function
run().catch((error) => {
    logWithTimestamp(`Error in run function: ${error.message}`);
});
