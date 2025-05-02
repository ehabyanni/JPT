import { IUser } from "../../_interfaces/IUser";

export class Register {
    static readonly type = '[Auth] Register';
    constructor(public user: IUser) {}
  }
  
  export class Login {
    static readonly type = '[Auth] Login';
    constructor(public email: string, public password: string) {}
  }
  
  export class Logout {
    static readonly type = '[Auth] Logout';
  }
  