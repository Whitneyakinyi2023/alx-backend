import kue from 'kue';

export default function createPushNotificationsJobs(jobs, queue) {
    if (!Array.isArray(jobs)) {
        throw new Error('Jobs is not an array');
    }

    // Helper function for logging job events
    const logJobEvent = (job, event, message) => {
        job.on(event, (...args) => {
            console.log(`Notification job ${job.id} ${message}`, ...args);
        });
    };

    jobs.forEach((jobData) => {
        const job = queue.create('push_notification_code_3', jobData);

        // Save the job and handle potential errors
        job.save((err) => {
            if (err) {
                console.error(`Error creating notification job for ${jobData.phoneNumber}: ${err}`);
            } else {
                console.log(`Notification job created: ${job.id}`);
            }
        });

        // Log job events for completion, failure, and progress
        logJobEvent(job, 'complete', 'completed');
        logJobEvent(job, 'failed', 'failed with error');
        logJobEvent(job, 'progress', 'progress: % complete');
    });
}
