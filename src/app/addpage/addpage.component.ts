// addpage.component.ts
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { TaskService } from '../task.service';
import { Task } from '../task.model';

@Component({
  selector: 'app-addpage',
  templateUrl: './addpage.component.html',
  styleUrls: ['./addpage.component.css']
})
export class AddPageComponent {
  newTask: Task = {
    title: '',
    description: '',
    taskStatus: '',
    taskUrgency: '',
    dueDate: ''
  };

  constructor(private taskService: TaskService, private router: Router) {}

  addTask(): void {
    this.taskService.addTask(this.newTask).subscribe(
      () => {
        this.router.navigate(['/']);
      },
      (error) => {
        console.error('Error adding task', error);
      }
    );
  }
  navigateHome(): void {
    this.router.navigate(['/']);
  }
}
