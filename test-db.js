require('dotenv').config();
const { PrismaClient } = require('@prisma/client');

async function main() {
  try {
    const prisma = new PrismaClient();
    console.log("Connecting...");
    const val = await prisma.setting.findMany();
    console.log("Success! Data:", val);
  } catch (e) {
    console.error("Connection failed!");
    console.error(e);
  }
}

main();
