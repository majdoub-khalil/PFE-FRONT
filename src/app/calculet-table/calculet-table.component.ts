import { Component, OnInit } from '@angular/core';
import { AppUser, ProducerData, PilotData } from '../models/app-user.model'; // Make sure your import path is correct
import { UserService } from '../services/user.service';
import { Router } from '@angular/router';
@Component({
  selector: 'app-calculet-table',
  templateUrl: './calculet-table.component.html',
  styleUrls: ['./calculet-table.component.css']
})
export class CalculetTableComponent implements OnInit {
  users: AppUser[] = []; // Users array to hold all users with their data
  producersData: ProducerData[] = [];
  pilotsData: PilotData[] = [];
  currentUser: AppUser | null = null; // Current logged-in user
  AppUser: any;
  producers: AppUser[] = [];

groupedProducers: { [prestation: string]: AppUser[] } = {};


  constructor(private userService: UserService,private router: Router) {}

  ngOnInit() {
    // Initially, we load users with their associated data
    this.loadUsersWithData();
    this.producers = this.users.filter(user => user.role === 'PRODUCER');

// Group producers by prestation using frontend logic
const nro = this.producers.filter(p => p.id! >= 1 && p.id! <= 10);
const desat = this.producers.filter(p => p.id! >= 11 && p.id! <= 20);
const audit = this.producers.filter(p => p.id! > 20);

this.groupedProducers = {
  NROPM: nro,
  DESAT: desat,
  AUDIT: audit
};
  }

  // Load users with their associated data (Producer and Pilot Data)
  loadUsersWithData() {
    this.userService.getAllUsers().subscribe((users: AppUser[]) => {
      this.users = users;
      // Optionally set current user (mocked or based on real authentication)
      this.currentUser = users.find(user => user.id === 1) || null;

      // Extract data based on roles
      this.producersData = this.users.filter(user => user.role === 'PRODUCER' && user.producerData).map(user => user.producerData!);
      this.pilotsData = this.users.filter(user => user.role === 'PILOT' && user.pilotData).map(user => user.pilotData!);
    });
  }

  // Save Producer Data to backend
  saveProducerData(user: AppUser) {
    if (user.producerData) {
      this.userService.addProducerData(user.id!, user.producerData).subscribe({
        next: () => alert('Producer data saved successfully'),
        error: (err) => console.error('Error saving producer data', err),
      });
    }
  }

  // Save Pilot Data to backend
  savePilotData(user: AppUser) {
    if (user.pilotData) {
      this.userService.addPilotData(user.id!, user.pilotData).subscribe({
        next: () => alert('Pilot data saved successfully'),
        error: (err) => console.error('Error saving pilot data', err),
      });
    }
  }

  // For role-based rendering and table data manipulation
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
