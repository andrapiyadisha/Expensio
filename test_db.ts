import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()
async function main() {
  const cats = await prisma.categories.findMany()
  console.log("Categories:", cats)
  const users = await prisma.users.findMany({ include: { role: true } })
  console.log("Users:", users.map(u => ({ id: u.UserID, role: u.role.RoleName })))
}
main()
