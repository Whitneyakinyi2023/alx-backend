import kue from 'kue';

const queue = kue.createQueue();

// Job data for notification
const jobData = {
    phoneNumber: 888888,
    message: 'Hello, and bienvenue'
};

// Helper function to log messages with timestamps
function logWithTimestamp(message) {
    const timestamp = new Date().toISOString();
    console.log(`[${timestamp}] ${message}`);
}

// Create and save the notification job in the queue
const job = queue.create('push_notification_code', jobData)
    .save((err) => {
        if (err) {
            logWithTimestamp(`Error creating job: ${err.message}`);
        } else {
            logWithTimestamp(`Notification job created successfully with ID: ${job.id}`);
        }
    });

// Handle the "complete" event when the job is successfully processed
job.on('complete', () => {
    logWithTimestamp(`Notification job ${job.id} completed successfully`);
});

// Handle the "failed" event when the job fails
job.on('failed', (error) => {
    logWithTimestamp(`Notification job ${job.id} failed with error: ${error ? error.message : 'unknown error'}`);
});

// Optional: Handle job progress (e.g., 0-100%)
job.on('progress', (progress) => {
    logWithTimestamp(`Notification job ${job.id} is ${progress}% complete`);
});
