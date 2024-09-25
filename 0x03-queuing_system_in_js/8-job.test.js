import { createQueue } from 'kue';
import { expect } from 'chai';
import createPushNotificationsJobs from './8-job';

describe('createPushNotificationsJobs', () => {
    let queue;

    // Setup and teardown the test environment
    beforeEach(() => {
        queue = createQueue();
        queue.testMode.enter();
    });

    afterEach(() => {
        queue.testMode.clear();
        queue.testMode.exit();
    });

    it('should create jobs in the queue for valid job data', () => {
        const jobs = [
            {
                phoneNumber: '4153518780',
                message: 'This is the code 0001 to verify your account'
            },
            {
                phoneNumber: '4153518781',
                message: 'This is the code 0022 to verify your account'
            }
        ];

        // Create jobs in the queue
        createPushNotificationsJobs(jobs, queue);

        // Assert that the correct number of jobs have been added
        expect(queue.testMode.jobs.length).to.equal(2);

        // Assert that the job data matches
        queue.testMode.jobs.forEach((job, index) => {
            expect(job.data).to.deep.equal(jobs[index]);
        });
    });

    it('should throw an error if jobs is not an array', () => {
        expect(() => createPushNotificationsJobs({}, queue)).to.throw('Jobs is not an array');
    });

    it('should not create any jobs if given an empty array', () => {
        const jobs = [];
        createPushNotificationsJobs(jobs, queue);

        // Assert that no jobs were added
        expect(queue.testMode.jobs.length).to.equal(0);
    });
});
