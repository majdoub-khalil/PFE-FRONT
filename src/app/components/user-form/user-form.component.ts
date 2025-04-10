import { Component } from '@angular/core';
import { UserService, AppUser } from 'src/app/services/user.service';

@Component({
  selector: 'app-user-form',
  templateUrl: './user-form.component.html'
})
export class UserFormComponent {
  [x: string]: any;
  user: AppUser = {
    username: '',
    fullName: '',
    role: 'PRODUCER'
  };

  constructor(private userService: UserService) {}

  createUser() {
    this.userService.createUser(this.user).subscribe({
      next: (res) => {
        console.log('User created:', res);
        alert('User created!');
      },
      error: (err) => {
        console.error('Error:', err);
        alert('Failed to create user');
      }
    });
  }
  
  navigateToUserStats() {
    this.router.navigate(['/userstats']);
  }
}
