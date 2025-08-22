import { IFileRepository } from '@backend/interfaces/file.interface';
import { prisma } from '@db/client';

export const FileRepository: IFileRepository = {
  async findByFolder(folderId: number, { page, limit, order_by }) {
    const where = { folderId };
    const [total, items] = await prisma.$transaction([
      prisma.file.count({ where }),
      prisma.file.findMany({
        where,
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { id: order_by },
      }),
    ]);
    return { items, total };
  },

  async findOne(id: number) {
    return prisma.file.findUnique({
      where: { id },
    });
  },

  async update(id: number, name: string) {
    return prisma.file.update({
      where: { id },
      data: { name },
    });
  },

  async delete(id: number) {
    return prisma.file.delete({
      where: { id },
    });
  },

  async createMany(
    folderId: number | null,
    files: {
      name: string;
      mimeType?: string | null;
      originalName: string;
      size: number;
      path: string;
    }[],
  ) {
    if (!files.length) return { count: 0 };

    const result = await prisma.file.createMany({
      data: files.map((f) => {
        const fileData: any = {
          name: f.name,
          originalName: f.originalName,
          mimeType: f.mimeType ?? null,
          size: f.size,
          path: f.path,
        };
        if (folderId !== null) {
          fileData.folderId = folderId;
        }
        return fileData;
      }),
      skipDuplicates: true,
    });

    return result; // { count: number }
  },
};
