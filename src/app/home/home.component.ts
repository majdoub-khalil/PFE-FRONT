// home.component.ts
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TaskService } from '../task.service';
import { Task } from '../task.model';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  tasks: Task[] = [];
  searchTitle: string = '';
  searchStatus: string = '';
  searchDueDate: string = '';

  constructor(private taskService: TaskService, private router: Router) {}

  ngOnInit(): void {
    this.loadTasks();
  }

  loadTasks(): void {
    this.taskService.getAllTasks().subscribe(
      (data: any) => {
        this.tasks = Array.isArray(data) ? data : data.content || [];
      },
      (error) => {
        console.error('Error fetching tasks', error);
      }
    );
  }
  

  searchTasks(): void {
    this.taskService.searchTasks(this.searchTitle, this.searchStatus, this.searchDueDate).subscribe(
      (data: any) => {
        this.tasks = Array.isArray(data) ? data : data.content || [];
      },
      (error) => {
        console.error('Error searching tasks', error);
      }
    );
  }
  clearSearch(): void {
    this.searchTitle = '';
    this.searchStatus = '';
    this.searchDueDate = '';
    this.loadTasks();
  }

  navigateToAddPage(): void {
    this.router.navigate(['/add']);
  }

  navigateToEditPage(taskId?: number): void {
    if (taskId !== undefined) {
      this.router.navigate(['/edit', taskId]);
    } else {
      console.error('Task ID is undefined');
    }
  }

  deleteTask(taskId?: number): void {
    if (taskId !== undefined) {
      this.taskService.deleteTask(taskId).subscribe(
        () => {
          this.tasks = this.tasks.filter(task => task.id !== taskId);
        },
        (error) => {
          console.error('Error deleting task', error);
        }
      );
    } else {
      console.error('Task ID is undefined');
    }
  }
}
