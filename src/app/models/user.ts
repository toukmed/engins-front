export interface UserDto {
  username: string;
  password: string;
}

export interface UserEntity {
  nom: string;
  prenom: string;
  email: string;
  password: string;
}

export interface AuthResponse {
  token: string;
}
