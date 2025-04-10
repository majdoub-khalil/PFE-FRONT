import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Task } from './task.model';

@Injectable({
  providedIn: 'root'
})
export class TaskService {
  private baseUrl = 'http://localhost:8080'; // Adjust the base URL as needed

  constructor(private http: HttpClient) {}

  // Fetch all tasks
  getAllTasks(): Observable<Task[]> {
    return this.http.get<Task[]>(`${this.baseUrl}/all`);
  }

  // Fetch a task by ID
  getTaskById(id: number): Observable<Task> {
    return this.http.get<Task>(`${this.baseUrl}/${id}`);
  }

  // Add a new task
  addTask(task: Task): Observable<Task> {
    return this.http.post<Task>(`${this.baseUrl}/addTask`, task);
  }

  // Update an existing task
  updateTask(id: number, task: Task): Observable<Task> {
    return this.http.put<Task>(`${this.baseUrl}/update/${id}`, task);
  }

  // Delete a task
  deleteTask(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/delete/${id}`);
  }

  // Search tasks
  searchTasks(title?: string, taskStatus?: string, dueDate?: string): Observable<Task[]> {
    let params = new HttpParams();
    if (title) {
      params = params.set('title', title);
    }
    if (taskStatus) {
      params = params.set('taskStatus', taskStatus);
    }
    if (dueDate) {
      params = params.set('dueDate', dueDate);
    }
    return this.http.get<Task[]>(`${this.baseUrl}/tasks/search`, { params });
  }
  getTaskStatusCounts(): Observable<{ [key: string]: number }> {
    return this.http.get<{ [key: string]: number }>(`${this.baseUrl}/statusCounts`);
  }
  getTaskUrgencyCounts(): Observable<{ [key: string]: number }> {
    return this.http.get<{ [key: string]: number }>(`${this.baseUrl}/TaskurgencyCounts`);
  }
  // ========== ActeTraitement ==========
  getAllActes(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/actes`);
  }

  createActe(acte: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/actes`, acte);
  }

  // ========== Calculet ==========
  getAllCalculets(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/calculet`);
  }

  createCalculet(calculet: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/calculet`, calculet);
  }
}
