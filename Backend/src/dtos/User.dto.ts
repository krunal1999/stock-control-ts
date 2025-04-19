export interface RegisterUserDTO {
  fullName: string;
  email: string;
  password: string;
  mobile: string;
  gender: string;
  address?: string;
}

export interface LoginUserDTO {
  email: string;
  password: string;
}
