import { Component, OnInit } from '@angular/core';
import { UserService } from '../../services/user.service';
import { ChartOptions, ChartType } from 'chart.js';

@Component({
  selector: 'app-user-stats',
  templateUrl: './user-stats.component.html',
  styleUrls: ['./user-stats.component.css']
})
export class UserStatsComponent implements OnInit {
  public chartLabels: string[] = [];
  public chartData: number[] = [];
  public chartType: ChartType = 'pie'; // 'pie', 'line', etc.
  public chartOptions: ChartOptions = {
    responsive: true,
  };

  constructor(private userService: UserService) {}

  ngOnInit(): void {
    this.loadStats();
  }

  loadStats() {
    this.userService.getProducerStats().subscribe((stats) => {
      this.chartLabels = Object.keys(stats);
      this.chartData = Object.values(stats);
    });
  }
}
