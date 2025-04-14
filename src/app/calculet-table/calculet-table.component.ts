import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { AppUser } from '../models/app-user.model';
import { UserService } from '../services/user.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-calculet-table',
  templateUrl: './calculet-table.component.html',
  styleUrls: ['./calculet-table.component.css']
})
export class CalculetTableComponent implements OnInit {
  users: AppUser[] = [];
  producers: AppUser[] = [];
  pilots: AppUser[] = [];
  prestationId: number = 2; // Default to DESAT (prestationId can be changed)
  filteredProducers: AppUser[] = [];
  filteredPilots: AppUser[] = [];

  constructor(private userService: UserService, private router: Router, private cdr: ChangeDetectorRef) {}

  ngOnInit() {
    this.loadUsersWithData();
  }

  loadUsersWithData() {
    this.userService.getAllUsers().subscribe((users: AppUser[]) => {
      this.users = users;
      this.producers = users.filter(user => user.role === 'PRODUCER');
      this.pilots = users.filter(user => user.role === 'PILOT');

      // Log the users and their prestation data for debugging
      console.log("Users with their prestation data:", this.users);
      
      this.filterByPrestation();
    });
  }

  filterByPrestation() {
    console.log('Filtering by prestationId:', this.prestationId);

    // Log each user's prestation data for inspection
    this.users.forEach(user => {
      if (user.prestation) {
        console.log(`User: ${user.fullName}, Prestation ID: ${user.prestation.id_prestation}`);
      } else {
        console.log(`User: ${user.fullName}, Prestation: None`);
      }
    });

    // Filter the producers and pilots based on prestationId.
    // Using Number(...) to ensure type consistency.
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

  onPrestationChange() {
    console.log('Prestation changed:', this.prestationId);
    this.filterByPrestation();
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
    this.router.navigate(['/userstats']);
  }

  goToProducerStats(producerId: number) {
    this.router.navigate(['/producer', producerId, 'stats']);
  }
}
