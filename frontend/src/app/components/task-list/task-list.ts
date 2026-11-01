import { Component, OnInit, computed, signal } from '@angular/core';
import { DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { Tasks, Task } from '../../services/tasks';
import { Auth } from '../../services/auth';

@Component({
  selector: 'app-task-list',
  imports: [FormsModule, DatePipe],
  templateUrl: './task-list.html',
  styleUrl: './task-list.css'
})
export class TaskList implements OnInit {
  tasks = signal<Task[]>([]);
  errorMessage = signal('');
  editingId = signal<number | null>(null);

  newTitle = '';
  newDueDate = '';
  editTitle = '';
  editDueDate = '';

  overdueCount = computed(() => this.tasks().filter(t => this.isOverdue(t)).length);

  private onError = (err: any) => {
    this.errorMessage.set(err.error?.message || 'خطایی رخ داد');
  };

  constructor(
    private tasksService: Tasks,
    private authService: Auth,
    private router: Router
  ) {}

  ngOnInit() {
    this.tasksService.getTasks().subscribe({
      next: data => this.tasks.set(data),
      error: this.onError,
    });
  }

  isOverdue(task: Task): boolean {
    return !task.done && !!task.dueDate && new Date(task.dueDate) < new Date();
  }

  onAddTask() {
    const title = this.newTitle.trim();
    if (!title) return;
    this.errorMessage.set('');

    const dueDate = this.newDueDate ? this.endOfDay(this.newDueDate) : undefined;

    this.tasksService.addTask(title, dueDate).subscribe({
      next: newTask => {
        this.tasks.update(current => [...current, newTask]);
        this.newTitle = '';
        this.newDueDate = '';
      },
      error: this.onError,
    });
  }

  onToggle(task: Task) {
    this.errorMessage.set('');
    this.tasksService.updateTask(task.id, { done: !task.done }).subscribe({
      next: updated => this.replaceTask(updated),
      error: this.onError,
    });
  }

  onDelete(task: Task) {
    if (!confirm('این تسک حذف شود؟')) return;
    this.errorMessage.set('');

    this.tasksService.deleteTask(task.id).subscribe({
      next: () => this.tasks.update(list => list.filter(t => t.id !== task.id)),
      error: this.onError,
    });
  }

  startEdit(task: Task) {
    this.errorMessage.set('');
    this.editTitle = task.title;
    this.editDueDate = task.dueDate ? this.toDateInput(task.dueDate) : '';
    this.editingId.set(task.id);
  }

  cancelEdit() {
    this.editingId.set(null);
  }

  saveEdit(task: Task) {
    const title = this.editTitle.trim();
    if (!title) return;
    this.errorMessage.set('');

    const dueDate = this.editDueDate ? this.endOfDay(this.editDueDate) : null;

    this.tasksService.updateTask(task.id, { title, dueDate }).subscribe({
      next: updated => {
        this.replaceTask(updated);
        this.editingId.set(null);
      },
      error: this.onError,
    });
  }

  onLogout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }

  private replaceTask(updated: Task) {
    this.tasks.update(list => list.map(t => (t.id === updated.id ? updated : t)));
  }

  private endOfDay(dateStr: string): string {
    return new Date(`${dateStr}T23:59:59`).toISOString();
  }

  private toDateInput(iso: string): string {
    const d = new Date(iso);
    const pad = (n: number) => String(n).padStart(2, '0');
    return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
  }
}