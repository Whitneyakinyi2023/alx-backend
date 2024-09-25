import redis from 'redis';

const CHANNEL_NAME = 'holberton school channel';

// Create Redis client
const client = redis.createClient();

// Log connection success or failure
client.on('connect', () => {
    logWithTimestamp('Redis client connected to the server');
});

client.on('error', (err) => {
    logWithTimestamp(`Redis client failed to connect to the server: ${err.message}`);
});

// Helper function to log messages with timestamps
function logWithTimestamp(message) {
    const timestamp = new Date().toISOString();
    console.log(`[${timestamp}] ${message}`);
}

// Function to publish a message after a delay
function publishMessage(message, delay) {
    setTimeout(() => {
        logWithTimestamp(`About to send message: "${message}"`);
        client.publish(CHANNEL_NAME, message, (err) => {
            if (err) {
                logWithTimestamp(`Error publishing message "${message}": ${err.message}`);
            } else {
                logWithTimestamp(`Message "${message}" successfully sent to channel "${CHANNEL_NAME}"`);
            }
        });
    }, delay);
}

// Publish messages with varying delays
publishMessage('Holberton Student #1 starts course', 100);
publishMessage('Holberton Student #2 starts course', 200);
publishMessage('KILL_SERVER', 300);
publishMessage('Holberton Student #3 starts course', 400);
