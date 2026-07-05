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



export interface ICard {
  id: string;
  title: string;
  description?: string;
  category?: string;
  color?: string;
  assigneeId?: string;
  order: number;
  createdAt: string;
}

export interface IColumn {
  _id: string;
  title: string;
  order: number;
  cards: ICard[];
}

export interface IBoard {
  success: Boolean;
  data: {
    _id: string;
    name: string;
    createdBy: {
      _id: string;
      firstName: string;
      lastName: string;
      email: string;
      image?: string;
    };
    columns: IColumn[];
    createdAt: string;
    updatedAt: string;
  };
}