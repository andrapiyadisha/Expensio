const { PrismaClient } = require("../lib/generated/prisma/client");
const { PrismaMariaDb } = require("@prisma/adapter-mariadb");

const adapter = new PrismaMariaDb({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "Disha@1812",
    database: "expense_managment",
    connectionLimit: 5
});

const prisma = new PrismaClient({ adapter });

async function main() {
    console.log("Seeding roles...");

    const roles = [
        { RoleName: "Admin", Description: "System administrator with full access" },
        { RoleName: "User", Description: "Standard user with access to their own data" },
    ];

    for (const role of roles) {
        await prisma.roles.upsert({
            where: { RoleName: role.RoleName },
            update: {},
            create: role,
        });
    }

    console.log("Roles seeded successfully!");
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
