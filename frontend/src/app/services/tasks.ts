import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

export interface Task {
  id: number;
  title: string;
  done: boolean;
  createdAt: string;
  dueDate: string | null;
}

@Injectable({
  providedIn: 'root'
})
export class Tasks {
  private apiUrl = 'http://localhost:3000/tasks';

  constructor(private http: HttpClient) {}

  getTasks() {
    return this.http.get<Task[]>(this.apiUrl);
  }

  addTask(title: string, dueDate?: string) {
    return this.http.post<Task>(this.apiUrl, { title, dueDate });
  }

  updateTask(
    id: number,
    changes: { title?: string; done?: boolean; dueDate?: string | null },
  ) {
    return this.http.patch<Task>(`${this.apiUrl}/${id}`, changes);
  }

  deleteTask(id: number) {
    return this.http.delete<{ id: number }>(`${this.apiUrl}/${id}`);
  }
}