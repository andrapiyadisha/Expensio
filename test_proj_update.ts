import { prisma } from './lib/prisma'

async function main() {
  try {
     console.log("Fetching project 1...");
     const proj = await prisma.projects.findFirst();
     
     if (!proj) {
        console.log("No projects found!");
        return;
     }
     
     console.log("Updating project ID:", proj.ProjectID);
     const updated = await prisma.projects.update({ 
         where: { ProjectID: proj.ProjectID }, 
         data: { Budget: 999 } 
     });
     console.log("Update Success:", updated.Budget);
  } catch(e: any) { 
     console.error("Prisma Error:", e.message); 
  } finally {
     await prisma.$disconnect();
  }
}
main();
