import { Component, OnInit } from '@angular/core';
import { ChartOptions, ChartType } from 'chart.js';
import { UserService } from '../../services/user.service';
import { AppUser } from 'src/app/services/user.service'; // Assuming AppUser is imported here

@Component({
  selector: 'app-user-stats',
  templateUrl: './user-stats.component.html',
  styleUrls: ['./user-stats.component.css']
})
export class UserStatsComponent implements OnInit {
  // Regular chart
  public chartLabels: string[] = [];
  public chartData: number[] = [];
  public chartType: ChartType = 'pie';

  // Burndown chart
  public burndownLabels: string[] = ['Total work done ', 'Objectif Commun PL'];
  public burndownData: number[] = [];
  public burndownType: ChartType = 'doughnut';

  // Rating
  topProducer: AppUser | null = null;  // Specify type here
  fallingBehind: AppUser[] = [];
  metGoals: AppUser[] = [];
  totalProducers: number = 0;
  averageObjective: number = 0;

  // Real burndown progression
  public progressionChartType: ChartType = 'line';
  public realBurndownLabels: string[] = [];
  public goalData: number[] = [];
  public progressionData: number[] = [];
  public idealData: number[] = [];

  public chartOptions: ChartOptions = {
    responsive: true
  };

  // Dashboard insights
  dashboardInsights: any = {
    topProducer: '',
    fallingBehindCount: 0,
    metGoalsCount: 0,
    totalProducers: 0,
    averageObjective: 0
  };

  constructor(private userService: UserService) {}

  ngOnInit(): void {
    this.loadStats();
    this.loadBurndownData();
    this.generateProgressionChart();
    this.loadUserInsights();  // Add this to load user insights as well
    this.loadAdditionalStats(); 
  }

  loadStats() {
    this.userService.getProducerStats().subscribe((stats) => {
      this.chartLabels = Object.keys(stats);
      this.chartData = Object.values(stats);
    });
  }

  loadBurndownData() {
    this.userService.getBurndownStats().subscribe((data) => {
      this.burndownData = [data.totalObjectifsIndiv, data.objectifsCommunPL];
    });
  }

  generateProgressionChart() {
    this.userService.getBurndownStats().subscribe((data) => {
      const goal = data.objectifsCommunPL; // Get the goal from the API response
      const days = 10; // Define the number of days
  
      // Generate day labels for the x-axis (e.g., Day 1, Day 2, ..., Day 10)
      this.realBurndownLabels = Array.from({ length: days }, (_, i) => `Day ${i + 1}`);
  
      // Simulated progression of tasks completed for each day
      this.progressionData = [5, 15, 30, 50, 70, 95, 120, 140, 160, 175];
  
      // Constant goal line (same goal value for every day)
      this.goalData = Array(days).fill(goal);
  
      // Ideal linear progression line, assuming an even spread over the days
      this.idealData = Array.from({ length: days }, (_, i) => Math.round((goal / (days - 1)) * i));
    });
  }

  loadUserInsights() {
    this.userService.getAllUsers().subscribe(users => {
      const producers = users.filter(u => u.role === 'PRODUCER' && u.producerData);
      this.totalProducers = producers.length;
  
      let totalObjective = 0;
      let top: AppUser | null = null;
  
      this.metGoals = [];
      this.fallingBehind = [];
  
      producers.forEach(prod => {
        if (prod.producerData) { // Ensure producerData exists
          const treated = prod.producerData.unitesTraites;
          const objective = prod.producerData.objectifsIndiv;
          totalObjective += objective;
  
          // Update top producer with more treated units
          if (!top || (prod.producerData.unitesTraites > (top.producerData ? top.producerData.unitesTraites : 0))) {
            top = prod;
          }
  
          // Classify producers based on their progress
          if (treated >= objective) {
            this.metGoals.push(prod);
          } else {
            this.fallingBehind.push(prod);
          }
        }
      });
  
      this.averageObjective = this.totalProducers > 0 ? Math.round(totalObjective / this.totalProducers) : 0;
  
      // Set the top producer if there's one
      this.topProducer = top;
  
      // Generate insights for the dashboard
      this.generateDashboardInsights();
    });
  }
  
  generateDashboardInsights() {
    const topProducerName = this.topProducer ? `${this.topProducer.fullName} (ID: ${this.topProducer.id})` : 'N/A';
    const fallingBehindCount = this.fallingBehind.length;
    const metGoalsCount = this.metGoals.length;
  
    console.log("🎯 Dashboard Insights:");
    console.log(`✅ Top Producer of the Month: ${topProducerName}`);
    console.log(`🚨 Users Falling Behind: ${fallingBehindCount}`);
    console.log(`🟢 Users Who Met Their Goal: ${metGoalsCount}`);
    console.log(`👥 Total Number of Producers: ${this.totalProducers}`);
    console.log(`📈 Average Objective per Producer: ${this.averageObjective}`);
  
    // You can store these in variables if you'd like to display them in the UI
    this.dashboardInsights = {
      topProducer: topProducerName,
      fallingBehindCount,
      metGoalsCount,
      totalProducers: this.totalProducers,
      averageObjective: this.averageObjective
    };
  }
   // New Insights
   public averageEfficiencyRate: number = 0;
   public averageBlockageRatio: number = 0;
 
   loadAdditionalStats() {
     this.userService.getProducerInsights().subscribe((data) => {
       this.averageEfficiencyRate = Math.round(data.averageEfficiencyRate);
       this.averageBlockageRatio = Math.round(data.averageBlockageRatio);
     });
   }
   expandedSections: { [key: string]: boolean } = {};

toggleDetail(section: string): void {
  this.expandedSections[section] = !this.expandedSections[section];
}

isExpanded(section: string): boolean {
  return !!this.expandedSections[section];
}
}
