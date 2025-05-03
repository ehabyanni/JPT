import { Component } from '@angular/core';
import { Select } from '@ngxs/store';
import { Observable, of } from 'rxjs';
import { IUser } from '../_interfaces/IUser';

@Component({
  selector: 'app-dashboard',
  standalone: false,
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent {
  @Select((state : any) => state.auth.users) users$: Observable<IUser[]> = of([]);
}
