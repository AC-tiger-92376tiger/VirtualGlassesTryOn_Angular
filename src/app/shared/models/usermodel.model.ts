export interface UserModel {
    id?: number;
    username: string;
    email: string;
    role: string;
    passwordHash?: string;
    createdAt?: Date;
  }
  