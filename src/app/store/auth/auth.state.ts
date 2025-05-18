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

export class DeleteUser {
  static readonly type = '[Auth] Delete User';
  constructor(public payload: string) {} // payload will be user email
}

export interface AuthStateModel {
  usersRegistered: IUser[];
  usersLogged: Array<{
    user: IUser;
    loginTime: string;
    loggedIn: boolean;
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
  @Selector()
  static usersRegistered(state: AuthStateModel): IUser[] {
    return state.usersRegistered;
  }

  @Selector()
  static usersLogged(
    state: AuthStateModel
  ): Array<{ user: IUser; loginTime: string; loggedIn: boolean }> {
    return state.usersLogged;
  }

  @Selector()
  static currentUser(state: AuthStateModel): IUser | null {
    return state.currentUser;
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
    }
  }

  @Action(Login)
  async login(ctx: StateContext<AuthStateModel>, action: Login) {
    ctx.patchState({ loading: true, error: null });

    const { email, password } = action.payload;
    const state = ctx.getState();

    if (!email || !password) {
      throw new Error('Email and password are required');
    }

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
      loggedIn: true,
    };

    const updatedLoggedUsers = [...state.usersLogged, loginEntry];

    // Update both state
    ctx.patchState({
      currentUser: loginEntry.user,
      usersLogged: updatedLoggedUsers,
      loading: false,
    });
  }

  @Action(Logout)
  logout(ctx: StateContext<AuthStateModel>) {
    const currentUser = ctx.getState().currentUser;
    let usersLogged = [...ctx.getState().usersLogged];

    if (!currentUser) {
      throw new Error('No user is currently logged in.');
    }

    // Update the loggedIn flag to false for the current user
    const updatedLoggedUsers = usersLogged.map((entry) => {
      if (entry.user.email === currentUser.email) {
        return {
          ...entry,
          loggedIn: false, // update loggedIn flag instead of removing
        };
      }
      return entry;
    });

    // Update state and storage
    ctx.patchState({
      currentUser: null,
      usersLogged: updatedLoggedUsers,
    });
  }

  @Action(DeleteUser)
  deleteUser(ctx: StateContext<AuthStateModel>, action: DeleteUser) {
    const state = ctx.getState();

    // Filter out the user to delete
    const updatedUsers = state.usersRegistered.filter(
      (user) => user.email !== action.payload
    );

    // Update state
    ctx.patchState({
      usersRegistered: updatedUsers,
    });
  }
}
