import { Component, OnInit } from '@angular/core';
// import { Chart, BarController, BarElement, CategoryScale, LinearScale, Title, Tooltip, Legend } from 'chart.js';
import { TaskService } from '../task.service';

// // 🟡 Registered Chart.js components for bar chart (Chart.js v3+)
// Chart.register(BarController, BarElement, CategoryScale, LinearScale, Title, Tooltip, Legend);

@Component({
  selector: 'app-task-chart',
  template: '<canvas id="taskChart"></canvas>'
})
export class TaskChartComponent implements OnInit {
  constructor(private taskService: TaskService) { }

  ngOnInit() {
    // 🔧 Commented out: Chart.js custom rendering using raw DOM
    /*
    this.taskService.getTaskStatusCounts().subscribe(data => {
      console.log(data);
      const statuses = Object.keys(data);
      const counts = Object.values(data);

      new Chart('taskChart', {
        type: 'bar',
        data: {
          labels: statuses,
          datasets: [{
            label: '# of Tasks',
            data: counts,
            backgroundColor: 'rgba(75, 192, 192, 0.2)',
            borderColor: 'rgba(75, 192, 192, 1)',
            borderWidth: 1
          }]
        },
        options: {
          scales: {
            y: {
              beginAtZero: true
            }
          }
        }
      });
    });
    */
  }
}
