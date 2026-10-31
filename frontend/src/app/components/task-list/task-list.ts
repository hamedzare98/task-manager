import { Component, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { Tasks, Task } from '../../services/tasks';
import { Auth } from '../../services/auth';

@Component({
  selector: 'app-task-list',
  imports: [FormsModule],
  templateUrl: './task-list.html',
  styleUrl: './task-list.css'
})
export class TaskList implements OnInit {
  tasks = signal<Task[]>([]);
  newTitle = '';

  constructor(
    private tasksService: Tasks,
    private authService: Auth,
    private router: Router
  ) {}

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

  onLogout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}