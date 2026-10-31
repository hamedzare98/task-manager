import { Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

@Injectable()
export class TasksService {
  async findAll(userId: number) {
    return prisma.task.findMany({ where: { userId } });
  }

  async create(title: string, userId: number) {
    return prisma.task.create({
      data: { title, userId },
    });
  }
}