export interface SignUpRequest {
  username: string;
  email: string;
  password: string;
}

export interface SignInUpResponseError {
  detail: string;
}

export interface SignUpReponse {
  email: string;
  id: number;
  created_at: Date;
  hashed_password?: string;
  username: string;
}

export interface SignInRequest {
  username: string;
  email?: string;
  password: string;
}

export interface SignInResponse {
  id: number;
  username: string;
  email: string;
}
