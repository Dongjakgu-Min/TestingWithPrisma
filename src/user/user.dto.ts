export interface CreateUserDto {
  username: string;
  password: string;
}

export interface UpdateUserDto {
  username?: string;
  password?: string;
}

export interface LoginUserDto {
  username: string;
  password: string;
}
