import { prisma } from "./lib/prisma";

async function main() {
    console.log("Seeding roles...");

    const roles = [
        { RoleName: "Admin", Description: "Administrator with full access" },
        { RoleName: "User", Description: "Standard user access" }
    ];

    for (const role of roles) {
        await prisma.roles.upsert({
            where: { RoleName: role.RoleName },
            update: {},
            create: role,
        });
    }

    console.log("Seeding complete.");
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
