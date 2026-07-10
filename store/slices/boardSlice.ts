import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type {
  IMember,
  IColumn,
  ICard,
  IBoardData,
  IBoardMember,
  IBoardsPagination,
} from '@/types/type';
import type { PresenceUser } from '@/utils/ComponentsProps';

interface BoardState {
  memberData: IMember | null;
  board: IBoardData | null;
  columns: IColumn[];
  loading: boolean;
  error: string | null;
  onlineUsers: PresenceUser[];
}

const initialState: BoardState = {
  memberData: null,
  board: null,
  columns: [],
  loading: false,
  error: null,
  onlineUsers: [],
};

const boardSlice = createSlice({
  name: 'board',
  initialState,
  reducers: {
    // ── Board ──────────────────────────────────────────────────────────────────

    setBoard: (state, action: PayloadAction<IBoardData>) => {
      state.board = action.payload;
    },

    setMemberData: (state, action: PayloadAction<IMember>) => {
      state.memberData = action.payload;
    },
    clearBoard: (state) => {
      state.board = null;
      state.columns = [];
    },

    // ── Columns ────────────────────────────────────────────────────────────────

    setColumns: (state, action: PayloadAction<IColumn[]>) => {
      state.columns = action.payload;
    },
    addColumn: (state, action: PayloadAction<IColumn>) => {
      state.columns.push(action.payload);
    },
    deleteColumn: (state, action: PayloadAction<{ columnId: string }>) => {
      state.columns = state.columns.filter(
        (c) => c._id !== action.payload.columnId,
      );
    },
    updateColumn: (
      state,
      action: PayloadAction<{ columnId: string; title: string }>,
    ) => {
      const col = state.columns.find((c) => c._id === action.payload.columnId);
      if (col) col.title = action.payload.title;
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
      const fromCol = state.columns.find((c) => c._id === fromColumnId);
      const toCol = state.columns.find((c) => c._id === toColumnId);
      if (!fromCol || !toCol) return;

      const cardIndex = fromCol.cards.findIndex((c) => c._id === cardId);
      if (cardIndex === -1) return;

      const [card] = fromCol.cards.splice(cardIndex, 1);
      toCol.cards.splice(toIndex, 0, card);
    },

    // ── Cards: add ─────────────────────────────────────────────────────────────

    addCard: (
      state,
      action: PayloadAction<{ columnId: string; card: ICard }>,
    ) => {
      const col = state.columns.find((c) => c._id === action.payload.columnId);
      if (!col) return;
      const alreadyExists = col.cards.some(
        (c) => c._id === action.payload.card._id,
      );
      if (alreadyExists) return;
      col.cards.push(action.payload.card);
    },

    // ── Cards: delete ──────────────────────────────────────────────────────────

    deleteCard: (
      state,
      action: PayloadAction<{ columnId: string; cardId: string }>,
    ) => {
      const col = state.columns.find((c) => c._id === action.payload.columnId);
      if (col)
        col.cards = col.cards.filter((c) => c._id !== action.payload.cardId);
    },

    // ── Cards: update ──────────────────────────────────────────────────────────

    updateCardInColumn: (
      state,
      action: PayloadAction<{
        columnId: string;
        cardId: string;
        card: Partial<ICard>;
      }>,
    ) => {
      const { columnId, cardId, card } = action.payload;
      const col = state.columns.find((c) => c._id === columnId);
      if (!col) return;
      const index = col.cards.findIndex((c) => c._id === cardId);
      if (index === -1) return;
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
  setMemberData,
  clearBoard,
  setColumns,
  addColumn,
  deleteColumn,
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
