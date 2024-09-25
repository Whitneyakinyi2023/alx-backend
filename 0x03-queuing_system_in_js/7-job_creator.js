import kue from 'kue';

const queue = kue.createQueue();
const JOB_TYPE = 'push_notification_code_2';

const blacklistedNumbers = [
    '4153518780',
    '4153518781'
];

// Log helper to include timestamps for better traceability
function logWithTimestamp(message) {
    const timestamp = new Date().toISOString();
    console.log(`[${timestamp}] ${message}`);
}

// Check if phone number is blacklisted
function isBlacklisted(phoneNumber) {
    return blacklistedNumbers.includes(phoneNumber);
}

// Function to send notification with better async handling using Promises
function sendNotification(phoneNumber, message, job) {
    return new Promise((resolve, reject) => {
        job.progress(0, 100);

        // Simulate notification sending
        setTimeout(() => {
            job.progress(50, 100);
            logWithTimestamp(`Sending notification to ${phoneNumber} with message: "${message}"`);

            setTimeout(() => {
                job.progress(100, 100);
                logWithTimestamp(`Notification to ${phoneNumber} successfully sent`);
                resolve();
            }, 100);  // Simulating async delay for sending notification
        }, 100);
    });
}

// Processing jobs in the queue
queue.process(JOB_TYPE, 2, (job, done) => {
    const { phoneNumber, message } = job.data;

    logWithTimestamp(`Processing job ${job.id}: Attempting to send notification to ${phoneNumber}`);

    // Check if the phone number is blacklisted
    if (isBlacklisted(phoneNumber)) {
        const errorMessage = `Phone number ${phoneNumber} is blacklisted. Job ${job.id} aborted.`;
        logWithTimestamp(errorMessage);
        return done(new Error(errorMessage));
    }

    // Send the notification and handle the result
    sendNotification(phoneNumber, message, job)
        .then(() => {
            logWithTimestamp(`Notification sent to ${phoneNumber} successfully for job ${job.id}.`);
            done(); // Mark the job as complete
        })
        .catch((error) => {
            logWithTimestamp(`Failed to send notification to ${phoneNumber} for job ${job.id}: ${error.message}`);
            done(error); // Mark the job as failed
        });
});
