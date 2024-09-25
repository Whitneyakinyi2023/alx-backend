import kue from 'kue';

const queue = kue.createQueue();
const JOB_TYPE = 'push_notification_code_2';

const blacklistedNumbers = [
    '4153518780',
    '4153518781'
];

// Function to check if a number is blacklisted
function isBlacklisted(phoneNumber) {
    return blacklistedNumbers.includes(phoneNumber);
}

// Function to send notification
function sendNotification(phoneNumber, message, job, done) {
    job.progress(0, 100);

    // Check if phone number is blacklisted
    if (isBlacklisted(phoneNumber)) {
        const errorMessage = `Phone number ${phoneNumber} is blacklisted`;
        console.error(errorMessage);
        return done(new Error(errorMessage)); // Immediately return with an error
    }

    // Simulate sending notification
    job.progress(50, 100);
    console.log(`Sending notification to ${phoneNumber} with message: "${message}"`);

    setTimeout(() => {
        job.progress(100, 100);
        console.log(`Notification to ${phoneNumber} successfully sent`);
        done(); // Finish the job successfully
    }, 100);  // Simulating async notification send
}

// Process the job in the queue
queue.process(JOB_TYPE, 2, (job, done) => {
    const { phoneNumber, message } = job.data;

    console.log(`Processing job ${job.id}: Sending notification to ${phoneNumber}`);

    sendNotification(phoneNumber, message, job, done);
});
