import express from 'express';
import kue from 'kue';
import { createClient } from 'redis';
import { promisify } from 'util';

const redisClient = createClient();
const queue = kue.createQueue();
const app = express();
const port = process.env.PORT || 1245; // Use environment variable for port
let reservationEnabled = true;

// Promisify Redis client methods
const getAsync = promisify(redisClient.get).bind(redisClient);
const setAsync = promisify(redisClient.set).bind(redisClient);

// Connect to Redis and handle connection errors
redisClient.connect().catch(err => {
    console.error('Redis connection error:', err);
});

// Reserve initial seats
async function reserveSeat(number) {
    await setAsync('available_seats', number);
}

async function getCurrentAvailableSeats() {
    const seats = await getAsync('available_seats');
    return seats ? parseInt(seats, 10) : 0;
}

// Initialize available seats
reserveSeat(50).then(() => {
    console.log('Initial available seats: 50');
});

// Endpoint to get available seats
app.get('/available_seats', async (req, res) => {
    try {
        const numberOfAvailableSeats = await getCurrentAvailableSeats();
        res.json({ numberOfAvailableSeats });
    } catch (err) {
        res.status(500).json({ error: 'Error fetching available seats' });
    }
});

// Endpoint to reserve a seat
app.get('/reserve_seat', (req, res) => {
    if (!reservationEnabled) {
        return res.json({ status: 'Reservations are blocked' });
    }

    const job = queue.create('reserve_seat').save(err => {
        if (err) {
            return res.status(500).json({ status: 'Reservation failed' });
        }
        return res.json({ status: 'Reservation in process' });
    });

    job.on('complete', () => {
        console.log(`Seat reservation job ${job.id} completed`);
    });
    job.on('failed', (err) => {
        console.error(`Seat reservation job ${job.id} failed: ${err}`);
    });
});

// Endpoint to process the reservation queue
app.get('/process', (req, res) => {
    res.json({ status: 'Queue processing' });

    queue.process('reserve_seat', async (job, done) => {
        try {
            const availableSeats = await getCurrentAvailableSeats();
            if (availableSeats > 0) {
                await reserveSeat(availableSeats - 1);
                if (availableSeats - 1 === 0) {
                    reservationEnabled = false; // Disable further reservations if no seats are left
                }
                done();
            } else {
                done(new Error('Not enough seats available'));
            }
        } catch (error) {
            done(error);
        }
    });
});

// Start the server
app.listen(port, () => {
    console.log(`API available on localhost port ${port}`);
});

// Handle process termination
process.on('SIGINT', async () => {
    await redisClient.quit();
    console.log('Redis client closed, server exiting...');
    process.exit(0);
});
