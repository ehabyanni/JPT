import { Component, OnInit } from '@angular/core';
import { Store } from '@ngxs/store';

import { IUser } from '../_interfaces/IUser';
import { AuthState } from '../store/auth/auth.state';

@Component({
  selector: 'app-dashboard',
  standalone: false,
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss',
})
export class DashboardComponent implements OnInit {

  registeredUsers: IUser[] = [];
  displayedColumns: string[] = ['name', 'email', 'address', 'phone', 'birthdate'];

  constructor(private store: Store) {}

  ngOnInit() {
    this.store.select(AuthState.usersRegistered).subscribe((users : IUser[]) => {
      this.registeredUsers = users;
      console.log('Users:', users)
    });
  }
}
