import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { AppUser } from '../models/app-user.model';
import { UserService } from '../services/user.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ActeTraitement } from '../models/ActeTraitement ';
import { forkJoin, of } from 'rxjs';
import { catchError, map, switchMap } from 'rxjs/operators';
import { PilotStats } from '../models/PilotStats';
import { MonthlyPilotStats } from '../models/MonthlyPilotStats';

@Component({
  selector: 'app-calculet-table',
  templateUrl: './calculet-table.component.html',
  styleUrls: ['./calculet-table.component.css']
})
export class CalculetTableComponent implements OnInit {
  users: AppUser[] = [];
  producers: AppUser[] = [];
  pilots: AppUser[] = [];
  prestationId!: number;
  acteTraitements: ActeTraitement[] = [];
  filteredProducers: AppUser[] = [];
  filteredPilots: AppUser[] = [];
  pilotStats: Map<number, PilotStats> = new Map<number, PilotStats>();
  expandedPilotStats: Set<number> = new Set<number>();

  selectedMonth: number = new Date().getMonth() + 1;
  selectedYear: number = new Date().getFullYear();
  months = [
    { name: 'Jan', value: 1 }, { name: 'Feb', value: 2 }, { name: 'Mar', value: 3 },
    { name: 'Apr', value: 4 }, { name: 'May', value: 5 }, { name: 'Jun', value: 6 },
    { name: 'Jul', value: 7 }, { name: 'Aug', value: 8 }, { name: 'Sep', value: 9 },
    { name: 'Oct', value: 10 }, { name: 'Nov', value: 11 }, { name: 'Dec', value: 12 }
  ];
  years: number[] = [];

  constructor(
    private userService: UserService,
    private router: Router,
    private route: ActivatedRoute,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.route.params.subscribe(params => {
      const id = +params['prestationId'];
      this.prestationId = !isNaN(id) ? id : 2;
      this.initYears();
      this.loadData();
    });
  }

  initYears() {
    const currentYear = new Date().getFullYear();
    this.years = Array.from({ length: 10 }, (_, i) => currentYear - i);
  }

  loadData() {
    this.userService.getAllUsers().subscribe((users: AppUser[]) => {
      this.users = users;
      this.producers = users.filter(user => user.role === 'PRODUCER');
      this.pilots = users.filter(user => user.role === 'PILOT');

      this.userService.getAllActes().subscribe((actes: ActeTraitement[]) => {
        this.acteTraitements = actes;
        this.filterByPrestation();
      });
    });
  }

  onDateChange() {
    console.log(`📅 Date changed to: ${this.selectedMonth}/${this.selectedYear}`);
    
    // Log the actual types
    console.log('Types:', {
      selectedMonthType: typeof this.selectedMonth,
      selectedYearType: typeof this.selectedYear,
      selectedMonthValue: this.selectedMonth,
      selectedYearValue: this.selectedYear
    });
    
    // Force conversion to numbers before filtering
    this.selectedMonth = Number(this.selectedMonth);
    this.selectedYear = Number(this.selectedYear);
    
    this.userService.getAllActes().subscribe((actes: ActeTraitement[]) => {
      console.log(`📥 Actes fetched after date change: ${actes.length}`);
      this.acteTraitements = actes;
      this.filterByPrestation();
    });
  }
  
  onPrestationChange(newPrestationId: number) {
    this.prestationId = newPrestationId;
    this.loadData(); 
    this.router.navigate(['/calculet', newPrestationId]);
  }
  
  filterByPrestation(): void {
    console.log('🔍 Filtering for Prestation ID:', this.prestationId);
    console.log('📆 Filtering for Date:', this.selectedMonth, '/', this.selectedYear);
    console.log('👥 Total users known:', this.users.length);
    console.log('📚 Total actes loaded:', this.acteTraitements.length);
  
    // Reset filtered arrays
    this.filteredProducers = [];
    this.filteredPilots = [];
    this.pilotStats.clear();
  
    // ✅ Filter producers with date + prestation
    this.filteredProducers = this.users.filter(user => {
      if (!this.isProducer(user) || !user.producerData) return false;
  
      if (user.prestation?.id_prestation !== this.prestationId) {
        console.log(`— skip user ${user.id}: wrong prestation`);
        return false;
      }
  
      const userActes = this.acteTraitements.filter(
        a => a.affectation === user.id?.toString()
      );
      console.log(`— user ${user.id} has ${userActes.length} total actes`);
  
      const hasMatchingActe = userActes.some(acte => {
        if (!acte.date_validation) return false;
  
        const acteDate = new Date(acte.date_validation);
        const acteYear = acteDate.getFullYear();
        const acteMonth = acteDate.getMonth() + 1;
  
        const match =
          acteYear === this.selectedYear &&
          acteMonth === this.selectedMonth;
  
        console.log(`   • acte ${acte.idacte} → ${acte.date_validation} date=${acteDate.toISOString()} year=${acteYear} month=${acteMonth} match? ${match}`);
        return match;
      });
  
      return hasMatchingActe;
    });

    // ✅ Filter pilots by prestation only — then fetch live data for each
    const pilotsMatchingPrestation = this.users.filter(user => {
      return (
        this.isPilot(user) &&
        user.pilotData &&
        user.prestation?.id_prestation === this.prestationId
      );
    });

    console.log(`✅ Pilots matching prestation: ${pilotsMatchingPrestation.length}`);
    
    // Create an array of observables for each pilot's live data
    const livePilotDataRequests = pilotsMatchingPrestation.map(pilot => {
      if (!pilot.id) return of(null);
      
      return this.userService.getLivePilotData(pilot.id).pipe(
        map(liveData => {
          // Create a copy of the pilot to avoid modifying the original users array
          const pilotWithLiveData = {...pilot};
          // Update the pilot data with live data
          pilotWithLiveData.pilotData = liveData;
          return pilotWithLiveData;
        }),
        catchError(err => {
          console.error(`Failed to fetch live data for pilot ${pilot.id}`, err);
          // Return the original pilot if live data fetch fails
          return of(pilot);
        })
      );
    });
    
    // If we have pilots with matching prestation, fetch their live data
    if (livePilotDataRequests.length > 0) {
      forkJoin(livePilotDataRequests).subscribe(updatedPilots => {
        // Filter out any null values from the result
        this.filteredPilots = updatedPilots.filter(pilot => pilot !== null) as AppUser[];
        console.log(`✅ Got live data for ${this.filteredPilots.length} pilots`);
        console.log('🧪 Final filteredPilots list with live data:', this.filteredPilots.map(u => u.id));
        
        // After we have the filtered pilots, get stats for each
        this.loadPilotStats();
        this.cdr.detectChanges();
      });
    } else {
      this.filteredPilots = [];
      this.cdr.detectChanges();
    }
  
    console.log(`✅ Producers matching date & prestation: ${this.filteredProducers.length}`);
    console.log('🧪 Final filteredProducers list:', this.filteredProducers.map(u => u.id));
  }
  
  // Load pilot stats for all filtered pilots
  loadPilotStats() {
    this.pilotStats.clear();
    
    // Create an array of observables for each pilot's stats
    const statsRequests = this.filteredPilots.map(pilot => {
      if (!pilot.id) return of(null);
      
      return this.userService.getPilotStats(pilot.id).pipe(
        map(stats => {
          return { pilotId: pilot.id, stats };
        }),
        catchError(err => {
          console.error(`Failed to fetch stats for pilot ${pilot.id}`, err);
          return of(null);
        })
      );
    });
    
    if (statsRequests.length > 0) {
      forkJoin(statsRequests).subscribe(results => {
        results.forEach(result => {
          if (result && result.pilotId && result.stats) {
            this.pilotStats.set(result.pilotId, result.stats);
          }
        });
        console.log('📊 Pilot stats loaded:', this.pilotStats);
        this.cdr.detectChanges();
      });
    }
  }
  
  togglePilotStats(pilotId: number) {
    if (this.expandedPilotStats.has(pilotId)) {
      this.expandedPilotStats.delete(pilotId);
    } else {
      this.expandedPilotStats.add(pilotId);
    }
  }
  
  isPilotStatsExpanded(pilotId: number): boolean {
    return this.expandedPilotStats.has(pilotId);
  }
  
  saveProducerData(user: AppUser) {
    if (user.producerData) {
      this.userService.addProducerData(user.id!, user.producerData).subscribe({
        next: () => alert('Producer data saved successfully'),
        error: (err) => console.error('Error saving producer data', err),
      });
    }
  }

  savePilotData(user: AppUser) {
    if (user.pilotData) {
      this.userService.addPilotData(user.id!, user.pilotData).subscribe({
        next: () => alert('Pilot data saved successfully'),
        error: (err) => console.error('Error saving pilot data', err),
      });
    }
  }

  isProducer(user: AppUser): boolean {
    return user.role === 'PRODUCER';
  }

  isPilot(user: AppUser): boolean {
    return user.role === 'PILOT';
  }

  navigateToUserStats() {
    // Pass selected date as query parameters
    this.router.navigate(['/userstats', this.prestationId], {
      queryParams: {
        month: this.selectedMonth,
        year: this.selectedYear
      }
    });
  }

  goToProducerStats(producerId: number) {
    this.router.navigate(['/producer', producerId, 'stats']);
  }

  labelMap: any = {
    1: { unitesTraites: 'Dossiers Traités', unitesBloques: 'Dossiers Bloqués', unitesEnCours: 'Dossiers En Cours' },
    2: { unitesTraites: 'Unitées Traitées', unitesBloques: 'Unitées Bloquées', unitesEnCours: 'Unitées En Cours' },
    3: { unitesTraites: 'KM Traités', unitesBloques: 'KM Bloqués', unitesEnCours: 'KM En Cours' }
  };
}