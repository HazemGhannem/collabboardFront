import { get, set, del, clear } from 'idb-keyval';
import type { IBoard } from '@/types/type';

const KEYS = {
  boards: 'boards',
  currentBoard: 'currentBoard',
} as const;

// ─── Boards list ─────────────────────────────────────────────────────────────

export const saveBoards = (boards: IBoard[]) => set(KEYS.boards, boards);

export const loadBoards = (): Promise<IBoard[] | undefined> =>
  get<IBoard[]>(KEYS.boards);

export const clearBoards = () => del(KEYS.boards);

// ─── Current board ────────────────────────────────────────────────────────────

export const saveCurrentBoard = (board: IBoard) =>
  set(KEYS.currentBoard, board);

export const loadCurrentBoard = (): Promise<IBoard | undefined> =>
  get<IBoard>(KEYS.currentBoard);

export const clearCurrentBoard = () => del(KEYS.currentBoard);

// ─── Clear everything ────────────────────────────────────────────────────────

export const clearAllBoardData = () => clear();
