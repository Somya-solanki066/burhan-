import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  const username = process.env.ADMIN_USERNAME || "admin";
  const password = process.env.ADMIN_PASSWORD || "admin123";
  const name = process.env.ADMIN_NAME || "Burhan Admin";
  const hash = await bcrypt.hash(password, 10);

  await prisma.admin.upsert({
    where: { username },
    update: { password: hash, name },
    create: { username, password: hash, name },
  });

  console.log(`Admin ready: ${username}`);

  const defaultExpenses = [
    "Purchase",
    "Salary",
    "Travel",
    "Food",
    "Rent",
    "Utilities",
    "Misc",
  ];

  for (const name of defaultExpenses) {
    await prisma.expense.upsert({
      where: { name },
      update: {},
      create: { name },
    });
  }

  console.log("Default expenses ready");
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
