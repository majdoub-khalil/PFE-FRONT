import { Component, OnInit, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { UserService } from '../services/user.service';
import { BurndownPoint } from '../models/BurndownPoint';
import { Chart, ChartDataSets, ChartOptions } from 'chart.js';
import { catchError, finalize } from 'rxjs/operators';
import { of } from 'rxjs';

@Component({
  selector: 'app-global-stats',
  templateUrl: './global-stats.component.html',
  styleUrls: ['./global-stats.component.css']
})
export class GlobalStatsComponent implements OnInit, AfterViewInit {
  @ViewChild('burndownCanvas', { static: false }) burndownCanvas!: ElementRef;
  
  // Chart data
  burndownData: BurndownPoint[] = [];
  burndownChart!: Chart;
  
  // General statistics data
  generalStats: any = null;
  
  // Filter controls
  selectedYear: number = new Date().getFullYear();
  selectedMonth: number = new Date().getMonth() + 1;
  selectedPrestationId: number = 1;
  
  // Dropdown options
  years: number[] = [];
  months: number[] = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
  prestations: any[] = [];
  
  // Loading states
  isLoading: boolean = true;
  hasError: boolean = false;
  errorMessage: string = '';
  
  isLoadingStats: boolean = true;
  hasStatsError: boolean = false;
  statsErrorMessage: string = '';
  
  // Month names for display
  monthNames: string[] = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  constructor(private userService: UserService) {
    // Generate last 5 years for dropdown
    const currentYear = new Date().getFullYear();
    for (let i = 0; i < 5; i++) {
      this.years.push(currentYear - i);
    }
  }
  producerIdNameMap: { [id: string]: string } = {};

  ngOnInit(): void {
    this.loadInitialData();

  this.userService.getAllUsers().subscribe(users => {
    users
      .filter(u => u.role === 'PRODUCER')
      .forEach(u => {
        if (u.id && u.fullName) {
          this.producerIdNameMap[u.id.toString()] = u.fullName;
        }
      });
  });
  }
  
  ngAfterViewInit(): void {
    // If data is already loaded by the time view initializes, create chart
    if (this.burndownData.length > 0 && !this.burndownChart) {
      this.initializeChart();
    }
  }
  
  loadInitialData(): void {
    // Initialize loading states
    this.isLoading = true;
    this.isLoadingStats = true;
    
    // Load prestations (services)
    this.prestations = [
      { id: 1, name: 'NROPM' },
      { id: 2, name: 'DESSAT' },
      { id: 3, name: 'MISSING' }
    ];
    
    // Load chart data and statistics
    this.fetchBurndownData();
    this.fetchGeneralStats();
  }

  fetchBurndownData(): void {
    this.isLoading = true;
    this.hasError = false;
    
    this.userService.getBurndownData(this.selectedYear, this.selectedMonth, this.selectedPrestationId)
      .pipe(
        catchError((error: any) => {
          console.error('Error fetching burndown data:', error);
          this.hasError = true;
          this.errorMessage = 'Failed to load burndown data. Please try again later.';
          return of([]);
        }),
        finalize(() => {
          this.isLoading = false;
        })
      )
      .subscribe((data: BurndownPoint[]) => {
        this.burndownData = data;
        
        if (data.length === 0) {
          this.hasError = true;
          this.errorMessage = 'No data available for the selected period.';
          return;
        }
        
        if (this.burndownCanvas) {
          this.initializeChart();
        }
      });
  }
  
  fetchGeneralStats(): void {
    this.isLoadingStats = true;
    this.hasStatsError = false;
    
    this.userService.getGeneralMonthlyStatistics(this.selectedYear, this.selectedMonth)
      .pipe(
        catchError((error: any) => {
          console.error('Error fetching general statistics:', error);
          this.hasStatsError = true;
          this.statsErrorMessage = 'Failed to load general statistics. Please try again later.';
          return of(null);
        }),
        finalize(() => {
          this.isLoadingStats = false;
        })
      )
      .subscribe((data: any) => {
        this.generalStats = data;
      });
  }

  initializeChart(): void {
    // Clean up any existing chart
    if (this.burndownChart) {
      this.burndownChart.destroy();
    }
    
    if (!this.burndownData || this.burndownData.length === 0) {
      return;
    }
    
    const ctx = this.burndownCanvas.nativeElement.getContext('2d');
    
    // Prepare data
    const labels = this.burndownData.map(point => this.formatDate(point.date));
    const actualData = this.burndownData.map(point => point.cumulativeTraites);
    const idealData = this.burndownData.map(point => point.totalObjectif);
    const dailyData = this.burndownData.map(point => point.dailyTraites);
    
    // Create gradients for chart
    const actualGradient = ctx.createLinearGradient(0, 0, 0, 400);
    actualGradient.addColorStop(0, 'rgba(54, 162, 235, 0.8)');
    actualGradient.addColorStop(1, 'rgba(54, 162, 235, 0.1)');
    
    const idealGradient = ctx.createLinearGradient(0, 0, 0, 400);
    idealGradient.addColorStop(0, 'rgba(255, 99, 132, 0.8)');
    idealGradient.addColorStop(1, 'rgba(255, 99, 132, 0.1)');
    
    // Define datasets
    const datasets: ChartDataSets[] = [
      // Daily production as bars
      {
        type: 'bar',
        label: 'Daily Production',
        data: dailyData,
        backgroundColor: 'rgba(75, 192, 192, 0.7)',
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 1,
        barPercentage: 0.6,
        order: 3
      },
      // Actual progress as line
      {
        type: 'line',
        label: 'Actual Progress',
        data: actualData,
        borderColor: 'rgba(54, 162, 235, 1)',
        backgroundColor: actualGradient,
        pointBackgroundColor: 'rgba(54, 162, 235, 1)',
        pointBorderColor: '#fff',
        pointHoverBackgroundColor: '#fff',
        pointHoverBorderColor: 'rgba(54, 162, 235, 1)',
        borderWidth: 3,
        pointRadius: 5,
        pointHoverRadius: 7,
        fill: true,
        lineTension: 0.4,
        order: 1
      },
      // Ideal progress as line
      {
        type: 'line',
        label: 'Goal',
        data: idealData,
        borderColor: 'rgba(255, 99, 132, 1)',
        backgroundColor: idealGradient,
        pointBackgroundColor: 'rgba(255, 99, 132, 1)',
        pointBorderColor: '#fff',
        pointHoverBackgroundColor: '#fff',
        pointHoverBorderColor: 'rgba(255, 99, 132, 1)',
        borderWidth: 3,
        pointRadius: 5,
        pointHoverRadius: 7,
        fill: true,
        lineTension: 0.1,
        order: 2
      }
    ];
    
    // Chart options
    const options: ChartOptions = {
      responsive: true,
      maintainAspectRatio: false,
      legend: {
        position: 'top',
        labels: {
          fontFamily: 'Arial, sans-serif',
          fontSize: 14,
          fontColor: '#666',
          usePointStyle: true,
          padding: 20
        }
      },
      tooltips: {
        mode: 'index',
        intersect: false,
        backgroundColor: 'rgba(0,0,0,0.7)',
        titleFontFamily: 'Arial, sans-serif',
        bodyFontFamily: 'Arial, sans-serif',
        titleFontSize: 14,
        bodyFontSize: 13,
        xPadding: 12,
        yPadding: 12,
        cornerRadius: 8,
        displayColors: true,
        callbacks: {
          label: function(tooltipItem: any, data: any) {
            const datasetLabel = data.datasets[tooltipItem.datasetIndex].label || '';
            const value = tooltipItem.yLabel;
            
            if (datasetLabel === 'Daily Production') {
              return `${datasetLabel}: ${value} units processed`;
            }
            return `${datasetLabel}: ${value}`;
          }
        }
      },
      hover: {
        mode: 'nearest',
        intersect: true
      },
      scales: {
        xAxes: [{
          display: true,
          gridLines: {
            display: true,
            color: 'rgba(200, 200, 200, 0.2)',
            drawBorder: false
          },
          ticks: {
            fontFamily: 'Arial, sans-serif',
            fontColor: '#666'
          }
        }],
        yAxes: [{
          display: true,
          gridLines: {
            display: true,
            color: 'rgba(200, 200, 200, 0.2)',
            drawBorder: false
          },
          ticks: {
            fontFamily: 'Arial, sans-serif',
            fontColor: '#666',
            beginAtZero: true,
            padding: 10
          }
        }]
      },
      title: {
        display: true,
        text: `Burndown Chart - ${this.monthNames[this.selectedMonth - 1]} ${this.selectedYear}`,
        fontSize: 18,
        fontFamily: 'Arial, sans-serif',
        fontColor: '#333',
        padding: 20
      },
      animation: {
        duration: 1000,
        easing: 'easeOutQuart'
      }
    };
    
    // Create chart
    this.burndownChart = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: labels,
        datasets: datasets
      },
      options: options
    });
  }
  
  formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.getDate().toString().padStart(2, '0');
  }
  
  onFilterChange(): void {
    this.fetchBurndownData();
    this.fetchGeneralStats();
  }
  
  getProducerKeys(): string[] {
    if (this.generalStats && this.generalStats.unitsByProducer) {
      return Object.keys(this.generalStats.unitsByProducer);
    }
    return [];
  }
  
}