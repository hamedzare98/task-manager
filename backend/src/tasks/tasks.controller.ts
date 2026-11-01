import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  ParseIntPipe,
  UseGuards,
  Req,
} from '@nestjs/common';
import { TasksService } from './tasks.service.js';
import { JwtGuard } from '../auth/jwt.guard.js';

@Controller('tasks')
@UseGuards(JwtGuard)
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @Get()
  findAll(@Req() req: any) {
    return this.tasksService.findAll(req.user.userId);
  }

  @Post()
  create(
    @Body('title') title: string,
    @Body('dueDate') dueDate: string | undefined,
    @Req() req: any,
  ) {
    return this.tasksService.create(title, req.user.userId, dueDate);
  }

  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: { title?: string; done?: boolean; dueDate?: string | null },
    @Req() req: any,
  ) {
    return this.tasksService.update(id, req.user.userId, body);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number, @Req() req: any) {
    return this.tasksService.remove(id, req.user.userId);
  }
}