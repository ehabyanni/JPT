import { State, Action, StateContext, Selector } from '@ngxs/store';
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

export class LoadFromStorage {
  static readonly type = '[Auth] Load From Storage';
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
   ngxsOnInit(ctx: StateContext<AuthStateModel>) {
    const storedUsers = localStorage.getItem('usersRegistered');
    const storedLogins = localStorage.getItem('usersLogged');
    
    if (storedUsers) {
      ctx.patchState({
        usersRegistered: JSON.parse(storedUsers)
      });
    }
    
    if (storedLogins) {
      ctx.patchState({
        usersLogged: JSON.parse(storedLogins)
      });
    }
  }

  @Selector()
  static usersRegistered(state: AuthStateModel): IUser[] {
    return state.usersRegistered;
  }

  @Selector()
  static usersLogged(state: AuthStateModel): Array<{ user: IUser; loginTime: string }> {
    return state.usersLogged;
  }
  
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

      if (userExists) {
        throw new Error('User already exists');
      }

      const updatedUsers = [...state.usersRegistered, action.payload];
      ctx.patchState({
        usersRegistered: updatedUsers,
        loading: false,
      });
      localStorage.setItem('usersRegistered', JSON.stringify(updatedUsers));
    }
  }

  @Action(Login)
  async login(ctx: StateContext<AuthStateModel>, action: Login) {
    ctx.patchState({ loading: true, error: null });

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

    if (isAlreadyLogged) {
      throw new Error('User already logged in');
    }

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
  }

  @Action(Logout)
  logout(ctx: StateContext<AuthStateModel>) {
    ctx.patchState({
      currentUser: null,
    });
  }
}
