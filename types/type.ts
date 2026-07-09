// ─── Auth ─────────────────────────────────────────────────────────────────────

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

// ─── Board ────────────────────────────────────────────────────────────────────

export type Role = 'owner' | 'editor' | 'viewer';
export type visibilityRole = 'public' | 'private';

export interface ICard {
  _id: string;
  title: string;
  description?: string;
  category?: string;
  assigneeId?: IUserPublic | null; // populated on fetch, null if unassigned
  order: number;
  createdAt: string;
}

export interface IColumn {
  _id: string;
  title: string;
  order?: number;
  cards: ICard[];
}

export interface IBoardData {
  _id: string;
  name: string;
  createdBy: IUserPublic;
  visibility: visibilityRole;
  columns: IColumn[];
  createdAt: string;
  updatedAt: string;
}

// ─── Board Member ─────────────────────────────────────────────────────────────

export interface IMember {
  _id: string;
  board: string;
  user: IUserPublic;
  role: Role;
  code: string | null;
  joinedAt: string;
}

// ─── API Responses ────────────────────────────────────────────────────────────

export interface IBoardResponse {
  success: boolean;
  data: {
    board: IBoardData; // board.columns.cards.assigneeId is populated
    member: IMember; // contains role + user info
  };
}
