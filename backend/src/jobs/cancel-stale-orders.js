import cron from 'node-cron';
import { findStaleOrderIds, cancelStaleOrder } from '../models/order.model.js';

const OLDER_THAN_MINUTES = Number(process.env.STALE_ORDER_MINUTES) || 30;

// Stops a second run from starting while the first one is still working
let running = false;

export const cancelStaleOrdersOnce = async () => {
    if (running) {
        return;
    }

    running = true;

    try {
        const orderIds = await findStaleOrderIds(OLDER_THAN_MINUTES);
        let cancelled = 0;

        for (const orderId of orderIds) {
            try {
                if (await cancelStaleOrder(orderId, OLDER_THAN_MINUTES)) {
                    cancelled += 1;
                }
            } catch (err) {
                // One bad order must not stop the rest of the run
                console.error('[stale orders] could not cancel order', orderId, err.message);
            }
        }

        if (orderIds.length > 0) {
            console.log(`[stale orders] checked ${orderIds.length}, cancelled ${cancelled}`);
        }
    } catch (err) {
        console.error('[stale orders] run failed', err.message);
    } finally {
        running = false;
    }
};

export const startStaleOrderJob = () => {
    // Every 5 minutes, at :00, :05, :10 and so on
    cron.schedule('*/5 * * * *', cancelStaleOrdersOnce);

    console.log(
        `[stale orders] job scheduled every 5 minutes (unpaid after ${OLDER_THAN_MINUTES} min)`
    );
};