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
// ─── API Error Responses ────────────────────────────────────────────────────────────

export interface ApiResponseError {
  status: number;
  data: {
    error: string;
    success: boolean;
  };
}

 

// Frontend shape of a board-membership record, as returned by
// GET /boards (list endpoint) — `board` is populated, not a raw ObjectId.
export interface IBoardMember {
  _id: string;
  board: IBoardData;
  user: string; // raw ObjectId string — not populated in this query
  role: Role;
  code?: string | null;
  joinedAt: string;
}
export interface IBoardsPagination {
  total: number;
  page: number;
  pageSize: number;  
  totalPages: number;
}