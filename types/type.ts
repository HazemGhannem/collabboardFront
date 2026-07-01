export interface IUserPublic {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  image?: string;
}
export interface LoginData {
  email: string;
  password: string;
}

export interface SignupData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  image?: string;
}