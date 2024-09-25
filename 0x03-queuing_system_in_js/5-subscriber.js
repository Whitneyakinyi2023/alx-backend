import redis from 'redis';

const CHANNEL_NAME = 'holberton school channel';
const KILL_SERVER_COMMAND = 'KILL_SERVER';

// Helper function to log messages with timestamps
function logWithTimestamp(message) {
    const timestamp = new Date().toISOString();
    console.log(`[${timestamp}] ${message}`);
}

// Redis client initialization
const client = redis.createClient();

// Event listener when Redis connects to the server
client.on('connect', () => {
    logWithTimestamp('Redis client successfully connected to the server');
});

// Event listener for connection errors
client.on('error', (err) => {
    logWithTimestamp(`Redis client failed to connect to the server: ${err.message}`);
});

// Subscribe to the designated Redis channel
client.subscribe(CHANNEL_NAME);

// Event listener for receiving messages from the Redis channel
client.on('message', (channel, message) => {
    logWithTimestamp(`Received message from ${channel}: "${message}"`);

    // Check if the received message is the kill command
    if (message === KILL_SERVER_COMMAND) {
        logWithTimestamp('Received KILL_SERVER command, shutting down...');
        client.unsubscribe(CHANNEL_NAME);  // Unsubscribe from the channel
        client.quit();  // Gracefully close the Redis connection
    }
});
