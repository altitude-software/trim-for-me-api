import { Uuid } from '../../../../shared/domain/value-objects/uuid.vo';
import { Email } from '../value-objects/email.vo';

export enum UserRole {
  CREATOR = 'creator',
  EDITOR = 'editor',
}

export interface UserProps {
  id?: Uuid;
  email: Email;
  password: string;
  role: UserRole;
  name?: string | null;
  createdAt?: Date;
  updatedAt?: Date;
}

export class User {
  readonly id: Uuid;
  private _email: Email;
  private _password: string;
  private _role: UserRole;
  private _name: string | null;
  readonly createdAt: Date;
  private _updatedAt: Date;

  private constructor(props: UserProps) {
    this.id = props.id ?? new Uuid();
    this._email = props.email;
    this._password = props.password;
    this._role = props.role;
    this._name = props.name ?? null;
    this.createdAt = props.createdAt ?? new Date();
    this._updatedAt = props.updatedAt ?? new Date();
  }

  static create(props: UserProps): User {
    return new User(props);
  }

  static reconstitute(props: Required<UserProps>): User {
    return new User(props);
  }

  // Getters
  get email(): Email {
    return this._email;
  }
  get password(): string {
    return this._password;
  }
  get role(): UserRole {
    return this._role;
  }
  get name(): string | null {
    return this._name;
  }
  get updatedAt(): Date {
    return this._updatedAt;
  }

  // Setters
  updateName(name: string | null): void {
    this._name = name;
    this.touch();
  }

  updateEmail(email: Email): void {
    this._email = email;
    this.touch();
  }

  updatePassword(hashedPassword: string): void {
    this._password = hashedPassword;
    this.touch();
  }

  isCreator(): boolean {
    return this._role === UserRole.CREATOR;
  }

  isEditor(): boolean {
    return this._role === UserRole.EDITOR;
  }

  private touch(): void {
    this._updatedAt = new Date();
  }
}
