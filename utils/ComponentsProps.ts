// ____________________CARD Component____________________
export interface CardProps {
  id: string;
  title: string;
  category: string;
  color: { bgColor: String; textColor: string; borderColor: string };
  user: string;
  blur?: boolean;
  coumId?: string;
}

// ____________________Column Component____________________
export interface ColumnProps {
  id: string;
  title: string;
  cards: CardProps[];
}
// ____________________Board Component____________________

export interface ColumnData {
  id: string;
  title: string;
  cards: CardProps[];
}
