import { PrismaClient } from "./src/generated/prisma/client.js";

const prisma = new PrismaClient({
    datasourceUrl: process.env.DATABASE_URL,
});

async function main() {
    try {
        const count = await prisma.transaction.count();
        console.log("Transaction count:", count);

        const donationCount = await prisma.donation.count();
        console.log("Donation count:", donationCount);

        const wishlistCount = await prisma.wishlist.count();
        console.log("Wishlist count:", wishlistCount);

        console.log("ALL OK - Database connection works!");
    } catch (error) {
        console.error("Error:", error);
    } finally {
        await prisma.$disconnect();
    }
}

main();
