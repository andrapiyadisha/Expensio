import { PrismaClient } from "@/app/generated/prisma/client";
import { PrismaMariaDb } from "@prisma/adapter-mariadb";



const adapter = new PrismaMariaDb({
    host:"localhost",
    port:3306,
    user:"root",
    password:"Disha@1812",
    database:"expense_managment",
    connectionLimit:5
})

export const prisma = new PrismaClient({adapter})