import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { UserService } from '../services/user.service';
import { AppUser } from '../models/app-user.model';
import { ChartType } from 'chart.js';
import { trigger, transition, animate, style } from '@angular/animations';

@Component({
  selector: 'app-producer-stats',
  templateUrl: './producer-stats.component.html',
  styleUrls: ['./producer-stats.component.css'],
  animations: [
    trigger('ratingChange', [
      transition(':increment, :decrement', [
        style({ transform: 'scale(1.2)' }),
        animate('300ms ease-in-out', style({ transform: 'scale(1)' }))
      ]),
    ])
  ]
})
export class ProducerStatsComponent implements OnInit {
  producer: AppUser | null = null;

  // Data for doughnut chart for Chart.js v2
  public doughnutChartLabels: string[] = ['Traitées', 'Bloquées', 'En Cours'];
  public doughnutChartData: number[] = [0, 0, 0]; // Default values
  public doughnutChartType: ChartType = 'doughnut'; // Default chart type

  // Line Chart: Progress over time (e.g., Unites Traitées over days)
  public lineChartLabels: string[] = ['Day 1', 'Day 2', 'Day 3', 'Day 4', 'Day 5']; // Example days
  public lineChartData: number[] = [0, 0, 0, 0, 0]; // Example data, will be updated dynamically
  public lineChartType: ChartType = 'line';  // Line chart

  // Pie Chart: Distribution of Unites Traitées vs Objectifs Individuels
  public pieChartLabels: string[] = ['Unites Traitées', 'Objectifs Individuels'];
  public pieChartData: number[] = [0, 0];  // Example data for comparison
  public pieChartType: ChartType = 'pie';  // Pie chart

  // Productivity Rating
  public rating: number = 0;

  constructor(private route: ActivatedRoute, private userService: UserService) {}

  ngOnInit() {
    const producerId = +this.route.snapshot.paramMap.get('id')!;
    this.userService.getUserById(producerId).subscribe(user => {
      if (user.role === 'PRODUCER') {
        this.producer = user;

        const data = user.producerData;
        if (data) {
          // Update doughnut chart data
          this.doughnutChartData = [
            data.unitesTraites ?? 0,
            data.unitesBloques ?? 0,
            data.unitesEnCours ?? 0
          ];

          // Update line chart data (for example, Unites Traitées over the last few days)
          this.lineChartData = [
            data.unitesTraites ?? 0,  // Day 1 data
            data.unitesTraites ?? 0,  // Day 2 data
            data.unitesTraites ?? 0,  // Day 3 data
            data.unitesTraites ?? 0,  // Day 4 data
            data.unitesTraites ?? 0   // Day 5 data
          ];

          // Update pie chart data (comparing Unites Traitées and Objectifs Individuels)
          this.pieChartData = [
            data.unitesTraites ?? 0,
            data.objectifsIndiv ?? 0
          ];

          // Calculate Productivity Rating
          const productivityRatio = data.unitesTraites / (data.objectifsIndiv || 1); // Avoid division by 0
          this.rating = Math.min(10, Math.round(productivityRatio * 10)); // Rating out of 10
        }
      }
    });
  }
}
