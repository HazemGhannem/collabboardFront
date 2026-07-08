import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { IBoard } from '@/types/type';
import type { ColumnData, PresenceUser } from '@/utils/ComponentsProps';

interface BoardState {
  board: IBoard | null;
  boards: IBoard[];
  columns: ColumnData[];
  loading: boolean;
  error: string | null;
  onlineUsers: PresenceUser[];
}

const initialState: BoardState = {
  board: null,
  boards: [],
  columns: [],
  onlineUsers: [],
  loading: false,
  error: null,
};

const boardSlice = createSlice({
  name: 'board',
  initialState,
  reducers: {
    // ── Board ──────────────────────────────────────────────────────────────────

    setBoard: (state, action: PayloadAction<IBoard>) => {
      state.board = action.payload;
    },
    setBoards: (state, action: PayloadAction<IBoard[]>) => {
      state.boards = action.payload;
    },
    clearBoard: (state) => {
      state.board = null;
      state.columns = [];
    },

    // ── Columns ────────────────────────────────────────────────────────────────

    setColumns: (state, action: PayloadAction<ColumnData[]>) => {
      state.columns = action.payload;
    },
    addColumn: (state, action: PayloadAction<ColumnData>) => {
      state.columns.push(action.payload);
    },
    deleteColumn: (state, action: PayloadAction<{ columnId: string }>) => {
      state.columns = state.columns.filter(
        (col) => col.id !== action.payload.columnId,
      );
    },
    updateColumn: (
      state,
      action: PayloadAction<{ columnId: string; name: string }>,
    ) => {
      const col = state.columns.find((c) => c.id === action.payload.columnId);
      if (col) col.name = action.payload.name;
    },
    // ── Cards: move ────────────────────────────────────────────────────────────

    moveCard: (
      state,
      action: PayloadAction<{
        cardId: string;
        fromColumnId: string;
        toColumnId: string;
        toIndex: number;
      }>,
    ) => {
      const { cardId, fromColumnId, toColumnId, toIndex } = action.payload;
      const fromCol = state.columns.find((c) => c.id === fromColumnId);
      const toCol = state.columns.find((c) => c.id === toColumnId);
      if (!fromCol || !toCol) return;

      const cardIndex = fromCol.cards.findIndex((c) => c.id === cardId);
      if (cardIndex === -1) return;

      const [card] = fromCol.cards.splice(cardIndex, 1);
      toCol.cards.splice(toIndex, 0, card);
    },

    // ── Cards: add ─────────────────────────────────────────────────────────────

    addCard: (
      state,
      action: PayloadAction<{ columnId: string; card: ColumnData['cards'][0] }>,
    ) => {
      const col = state.columns.find((c) => c.id === action.payload.columnId);
      if (col) col.cards.push(action.payload.card);
    },

    // ── Cards: delete ──────────────────────────────────────────────────────────

    deleteCard: (
      state,
      action: PayloadAction<{ columnId: string; cardId: string }>,
    ) => {
      const col = state.columns.find((c) => c.id === action.payload.columnId);
      if (col)
        col.cards = col.cards.filter((c) => c.id !== action.payload.cardId);
    },

    // ── Cards: update ──────────────────────────────────────────────────────────

    updateCardInColumn: (
      state,
      action: PayloadAction<{
        columnId: string;
        cardId: string;
        card: Partial<ColumnData['cards'][0]>;
      }>,
    ) => {
      const { columnId, cardId, card } = action.payload;
      const col = state.columns.find((c) => c.id === columnId);
      if (!col) return;

      const index = col.cards.findIndex((c) => c.id === cardId);
      if (index === -1) return;

      // Merge only the fields that changed — keep the rest intact
      col.cards[index] = { ...col.cards[index], ...card };
    },

    // ── Presence ───────────────────────────────────────────────────────────────

    setOnlineUsers: (state, action: PayloadAction<PresenceUser[]>) => {
      state.onlineUsers = action.payload;
    },

    // ── Loading / error ────────────────────────────────────────────────────────

    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
  },
});

export const {
  setBoard,
  setBoards,
  clearBoard,
  setColumns,
  deleteColumn,
  addColumn,
  updateColumn,
  moveCard,
  addCard,
  deleteCard,
  updateCardInColumn,
  setOnlineUsers,
  setLoading,
  setError,
} = boardSlice.actions;

export default boardSlice.reducer;
