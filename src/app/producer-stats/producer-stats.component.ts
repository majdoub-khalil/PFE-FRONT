// producer-stats.component.ts
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { UserService } from '../services/user.service';
import { AppUser } from '../models/app-user.model';
import { ChartType, ChartOptions } from 'chart.js';
import { trigger, transition, animate, style, state } from '@angular/animations';

@Component({
  selector: 'app-producer-stats',
  templateUrl: './producer-stats.component.html',
  styleUrls: ['./producer-stats.component.css'],
  animations: [
    trigger('ratingChange', [
      state('initial', style({ transform: 'scale(1)' })),
      state('active', style({ transform: 'scale(1.2)' })),
      transition('initial <=> active', animate('300ms ease-in-out')),
      transition(':increment, :decrement', [
        style({ transform: 'scale(1.2)', backgroundColor: '#2E7D32' }),
        animate('600ms ease-in-out', style({ transform: 'scale(1)', backgroundColor: '#4caf50' }))
      ]),
    ]),
    trigger('fadeIn', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(20px)' }),
        animate('400ms ease-out', style({ opacity: 1, transform: 'translateY(0)' }))
      ])
    ])
  ]
})
export class ProducerStatsComponent implements OnInit {
  producer: AppUser | null = null;
  animationState = 'initial';
  isLoading = true;
  today = new Date(); // For the last updated timestamp

  // Chart configuration with proper types
  chartOptions: ChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    legend: {
      position: 'right' as const, // Type cast to PositionType
      labels: {
        fontFamily: "'Poppins', sans-serif",
        fontSize: 14
      }
    }
  };

  // Colors for charts
  chartColors = [
    { 
      backgroundColor: ['#4caf50', '#f44336', '#ff9800'],
      borderColor: ['#388e3c', '#d32f2f', '#f57c00'],
      borderWidth: 2
    }
  ];

  lineChartColors = [
    {
      backgroundColor: 'rgba(76, 175, 80, 0.2)',
      borderColor: '#4caf50',
      pointBackgroundColor: '#388e3c',
      pointBorderColor: '#fff',
      pointHoverBackgroundColor: '#fff',
      pointHoverBorderColor: '#388e3c'
    }
  ];

  pieChartColors = [
    {
      backgroundColor: ['#4caf50', '#2196f3'],
      borderColor: ['#388e3c', '#1976d2'],
      borderWidth: 2
    }
  ];

  // Doughnut chart
  public doughnutChartLabels: string[] = ['Traitées', 'Bloquées', 'En Cours'];
  public doughnutChartData: number[] = [0, 0, 0];
  public doughnutChartType: ChartType = 'doughnut';

  // Line Chart
  public lineChartLabels: string[] = ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi'];
  public lineChartData: any[] = [
    { data: [0, 0, 0, 0, 0], label: 'Unités Traitées' }
  ];
  public lineChartType: ChartType = 'line';
  public lineChartOptions: ChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    legend: {
      position: 'right' as const,
      labels: {
        fontFamily: "'Poppins', sans-serif",
        fontSize: 14
      }
    },
    elements: {
      line: {
        tension: 0.3 // Smooth curves
      }
    },
    scales: {
      xAxes: [{
        gridLines: {
          color: 'rgba(0, 0, 0, 0.05)'
        }
      }],
      yAxes: [{
        gridLines: {
          color: 'rgba(0, 0, 0, 0.05)'
        },
        ticks: {
          beginAtZero: true
        }
      }]
    }
  };

  // Pie Chart
  public pieChartLabels: string[] = ['Unités Traitées', 'Objectifs Restants'];
  public pieChartData: number[] = [0, 0];
  public pieChartType: ChartType = 'pie';

  // Productivity Rating
  public rating: number = 0;
  public ratingColor: string = '#4caf50';

  constructor(private route: ActivatedRoute, private userService: UserService) {}

  ngOnInit() {
    this.loadProducerData();
  }

  loadProducerData() {
    const producerId = +this.route.snapshot.paramMap.get('id')!;
    
    this.userService.getUserById(producerId).subscribe(
      user => {
        if (user.role === 'PRODUCER') {
          this.producer = user;
          
          const data = user.producerData;
          if (data) {
            setTimeout(() => {
              this.updateChartData(data);
              this.isLoading = false;
              
              // Trigger animation after data is loaded
              setTimeout(() => {
                this.animationState = 'active';
                setTimeout(() => this.animationState = 'initial', 300);
              }, 300);
            }, 500);
          }
        }
      },
      error => {
        console.error('Error loading producer data:', error);
        this.isLoading = false;
      }
    );
  }

  updateChartData(data: any) {
    // Update doughnut chart data
    this.doughnutChartData = [
      data.unitesTraites ?? 0,
      data.unitesBloques ?? 0,
      data.unitesEnCours ?? 0
    ];

    // Generate realistic line chart data based on unitesTraites
    const baseValue = data.unitesTraites ?? 0;
    this.lineChartData = [{
      data: [
        Math.max(0, Math.round(baseValue * 0.7)),
        Math.max(0, Math.round(baseValue * 0.8)),
        Math.max(0, Math.round(baseValue * 0.85)),
        Math.max(0, Math.round(baseValue * 0.95)),
        baseValue
      ],
      label: 'Unités Traitées'
    }];

    // Update pie chart data - compare completed vs remaining
    const objectifs = data.objectifsIndiv ?? 100;
    const completed = data.unitesTraites ?? 0;
    const remaining = Math.max(0, objectifs - completed);
    this.pieChartData = [completed, remaining];

    // Calculate Productivity Rating
    const productivityRatio = data.unitesTraites / (data.objectifsIndiv || 1);
    this.rating = Math.min(10, Math.round(productivityRatio * 10));
    
    // Set rating color based on performance
    if (this.rating >= 8) this.ratingColor = '#4caf50'; // Green
    else if (this.rating >= 5) this.ratingColor = '#ff9800'; // Orange
    else this.ratingColor = '#f44336'; // Red
  }
}