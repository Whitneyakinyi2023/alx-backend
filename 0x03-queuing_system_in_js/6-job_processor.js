import kue from 'kue';

const queue = kue.createQueue();

// Helper function to log messages with timestamps
function logWithTimestamp(message) {
    const timestamp = new Date().toISOString();
    console.log(`[${timestamp}] ${message}`);
}

// Function to send notification, refactored to handle async behavior using Promises
function sendNotification(phoneNumber, message) {
    return new Promise((resolve, reject) => {
        logWithTimestamp(`Preparing to send notification to ${phoneNumber}...`);

        setTimeout(() => {
            try {
                // Simulating the actual sending of a notification
                logWithTimestamp(`Notification sent to ${phoneNumber}, with message: "${message}"`);
                resolve();  // Simulate successful send
            } catch (error) {
                reject(new Error(`Failed to send notification to ${phoneNumber}: ${error.message}`));
            }
        }, 200); // Simulating an async delay
    });
}

// Process jobs from the queue
queue.process('push_notification_code', (job, done) => {
    const { phoneNumber, message } = job.data;

    logWithTimestamp(`Processing job ${job.id}: Notification to ${phoneNumber}`);

    job.progress(0, 100); // Initial progress

    // Call sendNotification and handle success or failure
    sendNotification(phoneNumber, message)
        .then(() => {
            job.progress(100, 100); // Mark job progress as complete
            logWithTimestamp(`Job ${job.id}: Notification to ${phoneNumber} completed successfully.`);
            done();  // Signal job completion
        })
        .catch((error) => {
            logWithTimestamp(`Job ${job.id} failed: ${error.message}`);
            done(error);  // Signal job failure
        });
});
