import { Controller, Get, Post, Body, UseGuards, Req } from '@nestjs/common';
import { TasksService } from './tasks.service.js';
import { JwtGuard } from '../auth/jwt.guard.js';

@Controller('tasks')
@UseGuards(JwtGuard)
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @Get()
  findAll(@Req() req: any) {
    return this.tasksService.findAll();
  }

  @Post()
  create(@Body('title') title: string, @Req() req: any) {
    return this.tasksService.create(title, req.user.userId);
  }
}