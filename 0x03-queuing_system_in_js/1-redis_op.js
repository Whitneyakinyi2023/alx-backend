import { createClient } from 'redis';

const client = createClient();

client.on('error', (error) => {
    console.error('Redis client not connected to the server:', error.message);
});

// Connect to Redis with error handling
async function connectRedis() {
    try {
        await client.connect();
        console.log('Redis client connected to the server');
    } catch (error) {
        console.error('Failed to connect to Redis:', error.message);
    }
}

// Centralized error handling function
function handleError(error, operation) {
    console.error(`Error during ${operation}:`, error.message);
}

// Set a new school value
async function setNewSchool(schoolName, value) {
    if (!schoolName || !value) {
        console.error('School name and value must be provided');
        return;
    }

    try {
        const reply = await client.set(schoolName, value);
        console.log(`Set operation reply: ${reply}`);
    } catch (error) {
        handleError(error, 'setNewSchool');
    }
}

// Display a school's value
async function displaySchoolValue(schoolName) {
    if (!schoolName) {
        console.error('School name must be provided');
        return;
    }

    try {
        const reply = await client.get(schoolName);
        if (reply === null) {
            console.log(`No value found for ${schoolName}`);
        } else {
            console.log(`Value for ${schoolName}: ${reply}`);
        }
    } catch (error) {
        handleError(error, 'displaySchoolValue');
    }
}

// Main function to run the application
async function run() {
    await connectRedis();

    await displaySchoolValue('Holberton');
    await setNewSchool('HolbertonSanFrancisco', '100');
    await displaySchoolValue('HolbertonSanFrancisco');

    // Clean up and disconnect
    await client.quit();
}

// Execute the main function
run();
