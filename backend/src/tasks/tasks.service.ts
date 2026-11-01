import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

@Injectable()
export class TasksService {
  async findAll(userId: number) {
    return prisma.task.findMany({
      where: { userId },
      orderBy: { createdAt: 'asc' },
    });
  }

  async create(title: string, userId: number, dueDate?: string) {
    return prisma.task.create({
      data: { title, userId, dueDate: dueDate ? new Date(dueDate) : null },
    });
  }

  async update(
    id: number,
    userId: number,
    changes: { title?: string; done?: boolean; dueDate?: string | null },
  ) {
    const data: { title?: string; done?: boolean; dueDate?: Date | null } = {};
    if (changes.title !== undefined) data.title = changes.title.trim();
    if (changes.done !== undefined) data.done = changes.done;
    if (changes.dueDate !== undefined) {
      data.dueDate = changes.dueDate ? new Date(changes.dueDate) : null;
    }

    const result = await prisma.task.updateMany({ where: { id, userId }, data });
    if (result.count === 0) {
      throw new NotFoundException('تسک پیدا نشد');
    }
    return prisma.task.findUnique({ where: { id } });
  }

  async remove(id: number, userId: number) {
    const result = await prisma.task.deleteMany({ where: { id, userId } });
    if (result.count === 0) {
      throw new NotFoundException('تسک پیدا نشد');
    }
    return { id };
  }
}