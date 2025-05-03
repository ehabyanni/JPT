import { State, Action, StateContext } from '@ngxs/store';
import { IUser } from '../../_interfaces/IUser';
import { Injectable } from '@angular/core';

// Actions
export class Register {
  static readonly type = '[Auth] Register';
  constructor(public payload: IUser) {}
}

export class Login {
  static readonly type = '[Auth] Login';
  constructor(public payload: { email: string; password: string }) {}
}

export class Logout {
  static readonly type = '[Auth] Logout';
}

interface AuthStateModel {
  usersRegistered: IUser[];
  usersLogged: Array<{
    user: IUser;
    loginTime: string;
  }>;
  currentUser: IUser | null;
  loading: boolean;
  error: string | null;
}

@State<AuthStateModel>({
  name: 'auth',
  defaults: {
    usersRegistered: [],
    usersLogged: [],
    currentUser: null,
    loading: false,
    error: null,
  },
})
@Injectable()
export class AuthState {
  // Initialize from localStorage
  @Action({ type: '@@INIT' })
  // init(ctx: StateContext<AuthStateModel>) {
  //   const usersRegistered = JSON.parse(
  //     localStorage.getItem('usersRegistered') || '[]'
  //   );
  //   const usersLogged = JSON.parse(localStorage.getItem('usersLogged') || '[]');
  //   ctx.patchState({ usersRegistered, usersLogged });
  // }
  @Action(Register)
  register(ctx: StateContext<AuthStateModel>, action: Register) {
    ctx.patchState({ loading: true, error: null });

    const state = ctx.getState();
    if (
      state.usersRegistered.length === 1 &&
      state.usersRegistered[0] === undefined
    ) {
      const updatedUsers = [action.payload];
      ctx.patchState({
        usersRegistered: updatedUsers,
        loading: false,
      });
    } else {
      const userExists = state.usersRegistered.some(
        (u) => u.email === action.payload.email
      );

      console.log(userExists);

      if (userExists) {
        ctx.patchState({
          error: 'Email already registered',
          loading: false,
        });
        return;
      }

      const updatedUsers = [...state.usersRegistered, action.payload];
      ctx.patchState({
        usersRegistered: updatedUsers,
        loading: false,
      });
    }
  }

  @Action(Login)
  async login(ctx: StateContext<AuthStateModel>, action: Login) {
    ctx.patchState({ loading: true, error: null });

    try {
      const state = ctx.getState();

      // 1. Check if user exists in registered users
      const user = state.usersRegistered.find(
        (u) =>
          u.email === action.payload.email &&
          u.password === action.payload.password
      );

      if (!user) {
        throw new Error('Invalid credentials');
      }

      // 2. Check if already logged in (optional)
      const isAlreadyLogged = state.usersLogged.some(
        (entry) => entry.user.email === user.email
      );

      // 3. Add to logged users
      const loginEntry = {
        user,
        loginTime: new Date().toISOString(),
      };

      const updatedLoggedUsers = [...state.usersLogged, loginEntry];

      // Update both state and localStorage
      ctx.patchState({
        currentUser: user,
        usersLogged: updatedLoggedUsers,
        loading: false,
      });
      localStorage.setItem('usersLogged', JSON.stringify(updatedLoggedUsers));
    } catch (error: any) {
      ctx.patchState({
        error: error.message,
        loading: false,
      });
    }
  }

  @Action(Logout)
  logout(ctx: StateContext<AuthStateModel>) {
    ctx.patchState({
      currentUser: null,
    });
  }
}
