export class CreateUserDto {
  readonly name: string;
  readonly password: string;
  readonly email: string;
  readonly emailVerify: boolean;
  readonly type: 'company' | 'user';
  readonly gender?: 'female' | 'male';
  readonly tags?: string[] | string;
}
