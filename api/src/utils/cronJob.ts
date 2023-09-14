import cron from 'node-cron';
import { CouponCardTemplate } from '../modules/card-templates/models/coupon-card-template.model';

export function cronJob() {
    // Schedule the job to run every day at midnight (adjust the time as needed)
    cron.schedule('0 0 * * *', async () => {
        console.log('Updating coupon card statuses...');
        const couponCards = await CouponCardTemplate.findAll();
        for (const couponCard of couponCards) {
            await couponCard.updateStatusBasedOnEndDate();
            console.log(`Updated coupon card ${couponCard.id} status to ${couponCard.status}`);
        }
    });
}
