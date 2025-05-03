import { Component, OnInit } from '@angular/core';
import { Store } from '@ngxs/store';
import { IUser } from '../_interfaces/IUser';
import { AuthState } from '../store/auth/auth.state';

@Component({
  selector: 'app-dashboard',
  standalone: false,
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  // Registered Users Grid
  registeredUsers: IUser[] = [];
  registeredColumns: string[] = ['name', 'email', 'address', 'phone', 'birthdate'];

  // Login Attempts Grid
  loginRecords: Array<{ user: IUser; loginTime: string }> = [];
  loginColumns: string[] = ['email', 'loginTime'];

  constructor(private store: Store) {}

  ngOnInit() {
    // Subscribe to registered users
    this.store.select(AuthState.usersRegistered).subscribe((users: IUser[]) => {
      this.registeredUsers = users || [];
      console.log('Registered users updated:', this.registeredUsers);
    });

    // Subscribe to login records
    this.store.select(AuthState.usersLogged).subscribe((records: Array<{ user: IUser; loginTime: string }>) => {
      this.loginRecords = records || [];
      console.log('Login records updated:', this.loginRecords);
    });
  }

  formatLoginTime(isoString: string): string {
    return new Date(isoString).toLocaleString();
  }
}