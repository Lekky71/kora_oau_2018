export interface LoginResponse {
  spendings?: object[];
  saving?: object[];
  _id: string;
  username: string;
  password: string;
  email: string;
  first_name: string;
  last_name: string;
  bank: string;
}
