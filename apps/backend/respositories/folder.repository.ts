import { IFolderRepository } from '@backend/interfaces/folder.interface';
import { prisma } from '@db/client';

export const FolderRepository: IFolderRepository = {
  async findAll({ page, limit, parent_id, order_by }) {
    const where: any = {
      parentId: parent_id || null,
    };
    // console.log(where);
    
    const [total, items] = await prisma.$transaction([
      prisma.folder.count(),
      prisma.folder.findMany({
        where,
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { id: order_by },
      }),
    ]);
    return { items, total };
  },

  async create(name: string, parentId?: number) {
    return prisma.folder.create({
      data: { name, parentId: parentId || null },
    });
  },

  async findOne(id: number) {
    return prisma.folder.findUnique({ where: { id } });
  },

  async update(id: number, name: string) {
    return prisma.folder.update({
      where: { id },
      data: { name },
    });
  },

  async delete(id: number) {
    return prisma.folder.delete({ where: { id } });
  },

  async getPath(id: number) {
    const path: any[] = [];
    let current = await prisma.folder.findUnique({ where: { id } });

    while (current) {
      path.unshift(current);
      if (!current.parentId) break;

      current = await prisma.folder.findUnique({
        where: { id: current.parentId },
      });
    }

    return path;
  },
};
