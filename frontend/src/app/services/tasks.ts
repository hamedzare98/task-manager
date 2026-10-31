import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

export interface Task {
  id: number;
  title: string;
  done: boolean;
  createdAt: string;
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

  addTask(title: string) {
    return this.http.post<Task>(this.apiUrl, { title });
  }
}