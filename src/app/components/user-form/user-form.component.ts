import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { UserService, AppUser } from 'src/app/services/user.service';

@Component({
  selector: 'app-user-form',
  templateUrl: './user-form.component.html',
  styleUrls: ['./user-form.component.css']
})
export class UserFormComponent {
  [x: string]: any;
  user: AppUser = {
    username: '',
    fullName: '',
    role: 'PRODUCER'
  };

  constructor(private userService: UserService,    private router: Router) {}

  createUser() {
    this.userService.createUser(this.user).subscribe({
      next: (res) => {
        console.log('User created:', res);
        alert('User created!');
        this.navigateToTable(); 
      },
      error: (err) => {
        console.error('Error:', err);
        alert('Failed to create user');
      }
    });
  }
  
  navigateToTable() {
    this.router.navigate(['/table']);
  }
}
