// editpage.component.ts
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TaskService } from '../task.service';
import { Task } from '../task.model';

@Component({
  selector: 'app-editpage',
  templateUrl: './editpage.component.html',
  styleUrls: ['./editpage.component.css']
})
export class EditPageComponent implements OnInit {
  task: Task = {
    title: '',
    description: '',
    taskStatus: '',
    taskUrgency: '',
    dueDate: ''
  };

  constructor(
    private taskService: TaskService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    const taskId = Number(this.route.snapshot.paramMap.get('id'));
    if (taskId) {
      this.loadTask(taskId);
    }
  }

  loadTask(taskId: number): void {
    this.taskService.getTaskById(taskId).subscribe(
      (data) => {
        this.task = data;
      },
      (error) => {
        console.error('Error fetching task', error);
      }
    );
  }

  updateTask(): void {
    if (!this.task.id) {
      console.error('Task ID is missing');
      return;
    }
    this.taskService.updateTask(this.task.id, this.task).subscribe(
      () => {
        this.router.navigate(['/']);
      },
      (error) => {
        console.error('Error updating task', error);
      }
    );
  }
}
