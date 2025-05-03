import { Component, OnInit } from '@angular/core';
import { Store } from '@ngxs/store';
import { IUser } from '../_interfaces/IUser';
import { AuthState, DeleteUser, Logout } from '../store/auth/auth.state';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  standalone: false,
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  // Registered Users Grid
  registeredUsers: IUser[] = [];
  registeredColumns: string[] = ['name', 'email', 'address', 'phone', 'birthdate', 'actions'];

  // Login Attempts Grid
  loginRecords: Array<{ user: IUser; loginTime: string }> = [];
  loginColumns: string[] = ['email', 'loginTime'];

  constructor(private store: Store, private router: Router, private toastr: ToastrService) {}

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

  deleteUser(email: string): void {
    if (confirm('Are you sure you want to delete this user?')) {
      this.store.dispatch(new DeleteUser(email)).subscribe({
        next: () => this.toastr.success('User deleted successfully.'),
        error: (err) => this.toastr.error(err.message),
      });
    }
  }

  onLogout() {
    this.store.dispatch(new Logout()).subscribe({
      next: () => {
        this.toastr.success('Logged out successfully');
        this.router.navigate(['/login']);
      },
      error: (err) => {
        this.toastr.error('Logout failed');
      }
    });
  }
}