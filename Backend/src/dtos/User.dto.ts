export interface RegisterUserDTO {
  fullName: string;
  email: string;
  password: string;
  mobile: string;
  gender: string;
}

export interface LoginUserDTO {
  email: string;
  password: string;
}
