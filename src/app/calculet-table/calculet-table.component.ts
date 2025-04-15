import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { AppUser } from '../models/app-user.model';
import { UserService } from '../services/user.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-calculet-table',
  templateUrl: './calculet-table.component.html',
  styleUrls: ['./calculet-table.component.css']
})
export class CalculetTableComponent implements OnInit {
  users: AppUser[] = [];
  producers: AppUser[] = [];
  pilots: AppUser[] = [];
  prestationId!: number; // Will be set from route
  filteredProducers: AppUser[] = [];
  filteredPilots: AppUser[] = [];

  constructor(
    private userService: UserService,
    private router: Router,
    private route: ActivatedRoute,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    // Read prestationId from route params
    this.route.params.subscribe(params => {
      const id = +params['prestationId'];
      if (!isNaN(id)) {
        this.prestationId = id;
        this.loadUsersWithData();
      } else {
        console.warn('Invalid prestationId. Defaulting to 2 (DESAT)');
        this.prestationId = 2;
        this.loadUsersWithData();
      }
    });
  }

  loadUsersWithData() {
    this.userService.getAllUsers().subscribe((users: AppUser[]) => {
      this.users = users;
      this.producers = users.filter(user => user.role === 'PRODUCER');
      this.pilots = users.filter(user => user.role === 'PILOT');

      console.log("Users with their prestation data:", this.users);
      this.filterByPrestation();
    });
  }

  filterByPrestation() {
    console.log('Filtering by prestationId:', this.prestationId);

    this.users.forEach(user => {
      if (user.prestation) {
        console.log(`User: ${user.fullName}, Prestation ID: ${user.prestation.id_prestation}`);
      } else {
        console.log(`User: ${user.fullName}, Prestation: None`);
      }
    });

    this.filteredProducers = this.producers.filter(
      user => Number(user.prestation?.id_prestation) === this.prestationId
    );
    this.filteredPilots = this.pilots.filter(
      user => Number(user.prestation?.id_prestation) === this.prestationId
    );

    console.log('Filtered Producers:', this.filteredProducers);
    console.log('Filtered Pilots:', this.filteredPilots);

    this.cdr.detectChanges();
  }

  onPrestationChange(newPrestationId: number) {
    // Navigate to the route with the new prestationId
    console.log('Prestation changed:', newPrestationId);
    this.router.navigate(['/calculet', newPrestationId]);
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
    this.router.navigate(['/userstats', this.prestationId]);
  }

  goToProducerStats(producerId: number) {
    this.router.navigate(['/producer', producerId, 'stats']);
  }


  labelMap: any = {
    1: { // NROPM
      unitesTraites: 'Dossiers Traités',
      unitesBloques: 'Dossiers Bloqués',
      unitesEnCours: 'Dossiers En Cours',

    },
    2: { // DESAT
      unitesTraites: 'Unitées Traitées',
      unitesBloques: 'Unitées Bloquées',
      unitesEnCours: 'Unitées En Cours'
    },
    3: { // MISSING
      unitesTraites: 'KM Traités',
      unitesBloques: 'KM Bloqués',
      unitesEnCours: 'KM En Cours'
    }
  };
}
