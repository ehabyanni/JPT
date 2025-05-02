import { State, Action, StateContext, Selector } from '@ngxs/store';
import { Register, Login, Logout } from './auth.actions';
import { IUser } from '../../_interfaces/IUser';

export interface AuthStateModel {
  user: IUser | null;
  isLoggedIn: boolean;
  errorMessage: string;
}

@State<AuthStateModel>({
  name: 'auth',
  defaults: {
    user: null,
    isLoggedIn: false,
    errorMessage: ''
  }
})
export class AuthState {
  @Selector()
  static isLoggedIn(state: AuthStateModel): boolean {
    return state.isLoggedIn;
  }

  @Selector()
  static user(state: AuthStateModel): IUser | null {
    return state.user;
  }

  @Action(Register)
  register({ getState, patchState }: StateContext<AuthStateModel>, { user }: Register) {
    const state = getState();
    // Simulate registering by adding to state
    patchState({
      user: user,
      isLoggedIn: true,
      errorMessage: ''
    });
  }

  @Action(Login)
  login({ getState, patchState }: StateContext<AuthStateModel>, { email, password }: Login) {
    const state = getState();
    // Simulate login by checking credentials (you can replace this with real login logic)
    if (email === 'test@example.com' && password === 'password') {
      patchState({
        user: { email, name: 'Test User', password },
        isLoggedIn: true,
        errorMessage: ''
      });
    } else {
      patchState({
        errorMessage: 'Invalid email or password'
      });
    }
  }

  @Action(Logout)
  logout({ patchState }: StateContext<AuthStateModel>) {
    patchState({
      user: null,
      isLoggedIn: false,
      errorMessage: ''
    });
  }
}
