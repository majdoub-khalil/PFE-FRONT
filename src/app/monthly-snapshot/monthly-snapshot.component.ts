import { Component, OnInit } from '@angular/core';
import { UserService } from '../services/user.service';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-monthly-snapshot',
  templateUrl: './monthly-snapshot.component.html',
  styleUrls: ['./monthly-snapshot.component.css']
})
export class MonthlySnapshotComponent implements OnInit {
  statsWithNames: any[] = [];
  loading: boolean = false;
  
  // Default to current month and year
  selectedMonth: number = new Date().getMonth() + 1;
  selectedYear: number = new Date().getFullYear();
  selectedPrestationId: number = 1;

  months = [
    { name: 'Jan', value: 1 }, { name: 'Feb', value: 2 }, { name: 'Mar', value: 3 },
    { name: 'Apr', value: 4 }, { name: 'May', value: 5 }, { name: 'Jun', value: 6 },
    { name: 'Jul', value: 7 }, { name: 'Aug', value: 8 }, { name: 'Sep', value: 9 },
    { name: 'Oct', value: 10 }, { name: 'Nov', value: 11 }, { name: 'Dec', value: 12 }
  ];

  prestations = [
    { label: 'NROPM', value: 1 },
    { label: 'DESAT', value: 2 },
    { label: 'MISSING', value: 3 }
  ];

  constructor(private userService: UserService) {}

  ngOnInit(): void {
    this.fetchMonthlyStats();
  }

  fetchMonthlyStats(): void {
    this.loading = true;

    forkJoin({
      stats: this.userService.getMonthlyStats(this.selectedMonth, this.selectedYear),
      users: this.userService.getAllUsers()
    }).subscribe({
      next: ({ stats, users }) => {
        this.statsWithNames = stats
          .map(stat => {
            const user = users.find(u => u.id === stat.producerId);
            if (user && user.prestation?.id_prestation == this.selectedPrestationId) {
              return {
                ...stat,
                fullName: user.fullName,
                percentComplete: stat.objectifsIndiv ? Math.min(100, (stat.unitesTraites / stat.objectifsIndiv) * 100) : 0
              };
            }
            return null;
          })
          .filter(stat => stat !== null);
      },
      error: (err) => {
        console.error('Error fetching data:', err);
        this.loading = false;
      },
      complete: () => {
        this.loading = false;
      }
    });
  }

  onFilterChange(): void {
    this.fetchMonthlyStats();
  }

  getProgressClass(percentage: number): string {
    if (percentage >= 75) return 'progress-high';
    if (percentage >= 50) return 'progress-medium';
    return 'progress-low';
  }
}