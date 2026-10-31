import { Component, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Tasks, Task } from '../../services/tasks';

@Component({
  selector: 'app-task-list',
  imports: [FormsModule],
  templateUrl: './task-list.html',
  styleUrl: './task-list.css'
})
export class TaskList implements OnInit {
  tasks = signal<Task[]>([]);
  newTitle = '';

  constructor(private tasksService: Tasks) {}

  ngOnInit() {
    this.tasksService.getTasks().subscribe(data => {
      this.tasks.set(data);
    });
  }

  onAddTask() {
    if (!this.newTitle.trim()) return;

    this.tasksService.addTask(this.newTitle).subscribe(newTask => {
      this.tasks.update(current => [...current, newTask]);
      this.newTitle = '';
    });
  }
}