import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { TaskService } from '../task.service';
import { Chart } from 'chart.js';

@Component({
  selector: 'app-urgency-chart',
  templateUrl: './urgency-chart.component.html',
  styleUrls: ['./urgency-chart.component.css']
})
export class UrgencyChartComponent implements OnInit {
  @ViewChild('urgencyChart') urgencyChartRef!: ElementRef;
  chart!: Chart;

  constructor(private taskService: TaskService) {}

  ngOnInit() {
    this.loadChart();
  }

  loadChart() {
    this.taskService.getTaskUrgencyCounts().subscribe(data => {
      console.log('Urgency Data:', data);
      const labels = Object.keys(data);
      const values = Object.values(data);

      if (this.chart) {
        this.chart.destroy(); // Destroy previous chart before reloading
      }

      this.chart = new Chart(this.urgencyChartRef.nativeElement, {
        type: 'bar',
        data: {
          labels: labels,
          datasets: [{
            label: 'Urgency Levels',
            data: values,
            backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF', '#FF9F40', '#FF6633'],
            borderColor: '#ddd',
            borderWidth: 1
          }]
        },
        options: {
          responsive: true,
          plugins: {
            legend: { display: true },
            title: { display: true, text: 'Task Urgency Distribution' }
          },
          scales: {
            // // y: { beginAtZero: true }
          }
        }
      });
    });
  }
}
