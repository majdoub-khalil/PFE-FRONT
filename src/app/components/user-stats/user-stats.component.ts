import { Component, OnInit } from '@angular/core';
import { ChartOptions, ChartType } from 'chart.js';
import { UserService } from '../../services/user.service';
import { AppUser } from 'src/app/services/user.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-user-stats',
  templateUrl: './user-stats.component.html',
  styleUrls: ['./user-stats.component.css']
})
export class UserStatsComponent implements OnInit {
  // Charts
  public chartLabels: string[] = [];
  public chartData: number[] = [];
  public chartType: ChartType = 'pie';

  public burndownLabels: string[] = ['Total work done', 'Objectif Commun PL'];
  public burndownData: number[] = [];
  public burndownType: ChartType = 'doughnut';

  public progressionChartType: ChartType = 'line';
  public realBurndownLabels: string[] = [];
  public goalData: number[] = [];
  public progressionData: number[] = [];
  public idealData: number[] = [];

  public chartOptions: ChartOptions = { responsive: true };

  // Insight data
  topProducer: AppUser | null = null;
  fallingBehind: AppUser[] = [];
  metGoals: AppUser[] = [];
  currentProducers: AppUser[] = [];
  totalProducers: number = 0;
  averageObjective: number = 0;

  // Additional insights
  averageEfficiencyRate: number = 0;
  averageBlockageRatio: number = 0;

  // UI Expansion toggles
  expandedSections: { [key: string]: boolean } = {};

  dashboardInsights: any = {
    topProducer: '',
    fallingBehindCount: 0,
    metGoalsCount: 0,
    totalProducers: 0,
    averageObjective: 0
  };

  constructor(private userService: UserService, private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      const prestationId = +params['prestationId'];
      if (!isNaN(prestationId)) {
        this.loadStats(prestationId);
        this.loadBurndownData(prestationId);
        this.generateProgressionChart(prestationId);
        this.loadUserInsights(prestationId);
        this.loadAdditionalStats(prestationId);
      } else {
        console.error('Invalid prestationId:', params['prestationId']);
      }
    });
  }

  loadStats(prestationId: number) {
    this.userService.getProducerStats(prestationId).subscribe((stats) => {
      this.chartLabels = Object.keys(stats);
      this.chartData = Object.values(stats);
    });
  }

  loadBurndownData(prestationId: number) {
    this.userService.getBurndownStats(prestationId).subscribe((data) => {
      this.burndownData = [data.totalObjectifsIndiv, data.objectifsCommunPL];
    });
  }

  generateProgressionChart(prestationId: number) {
    this.userService.getBurndownStats(prestationId).subscribe((data) => {
      const goal = data.objectifsCommunPL;
      const days = 10;

      this.realBurndownLabels = Array.from({ length: days }, (_, i) => `Day ${i + 1}`);
      this.progressionData = [5, 15, 30, 50, 70, 95, 120, 140, 160, 175];
      this.goalData = Array(days).fill(goal);
      this.idealData = Array.from({ length: days }, (_, i) => Math.round((goal / (days - 1)) * i));
    });
  }

  loadUserInsights(prestationId: number) {
    this.userService.getAllUsers().subscribe(users => {
      const producers = users.filter(u =>
        u.role === 'PRODUCER' &&
        u.producerData &&
        u.prestation &&
        u.prestation.id_prestation === prestationId
      );

      this.totalProducers = producers.length;
      this.currentProducers = producers;

      this.metGoals = [];
      this.fallingBehind = [];
      let totalObjective = 0;
      let top: AppUser | null = null;

      producers.forEach(prod => {
        const treated = prod.producerData!.unitesTraites;
        const objective = prod.producerData!.objectifsIndiv;
        totalObjective += objective;

        if (!top || treated > (top.producerData?.unitesTraites || 0)) {
          top = prod;
        }

        if (treated >= objective) {
          this.metGoals.push(prod);
        } else {
          this.fallingBehind.push(prod);
        }
      });

      this.averageObjective = this.totalProducers > 0
        ? Math.round(totalObjective / this.totalProducers)
        : 0;

      this.topProducer = top;
      this.generateDashboardInsights(prestationId);
    });
  }

  generateDashboardInsights(prestationId: number) {
    const metProducers = this.metGoals.filter(p =>
      p.prestation?.id_prestation === prestationId
    );
    const fallingBehindProducers = this.fallingBehind.filter(p =>
      p.prestation?.id_prestation === prestationId
    );

    const topProducer = this.currentProducers.reduce((top, prod) => {
      return prod.producerData!.unitesTraites > (top?.producerData?.unitesTraites || 0)
        ? prod
        : top;
    }, null as AppUser | null);

    const topProducerName = topProducer
      ? `${topProducer.fullName} (ID: ${topProducer.id})`
      : 'N/A';

    this.dashboardInsights = {
      topProducer: topProducerName,
      fallingBehindCount: fallingBehindProducers.length,
      metGoalsCount: metProducers.length,
      totalProducers: this.totalProducers,
      averageObjective: this.averageObjective
    };

    this.loadAdditionalStats(prestationId);
  }

  loadAdditionalStats(prestationId?: number) {
    if (prestationId !== undefined) {
      this.userService.getProducerInsights(prestationId).subscribe((data) => {
        this.averageEfficiencyRate = Math.round(data.averageEfficiencyRate);
        this.averageBlockageRatio = Math.round(data.averageBlockageRatio);
      });
    } else {
      console.error('Prestation ID is missing');
    }
  }

  toggleDetail(section: string): void {
    this.expandedSections[section] = !this.expandedSections[section];
  }

  isExpanded(section: string): boolean {
    return !!this.expandedSections[section];
  }
}
