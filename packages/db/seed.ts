import { prisma } from "./client";

async function main() {
  const root = await prisma.folder.create({
    data: { name: "Root Folder" },
  });

  await prisma.folder.createMany({
    data: [
      { name: "Documents", parentId: root.id },
      { name: "Pictures", parentId: root.id },
    ],
  });
}

main()
  .then(() => {
    console.log("Seeded successfully");
  })
  .catch(console.error)
  .finally(() => prisma.$disconnect());
