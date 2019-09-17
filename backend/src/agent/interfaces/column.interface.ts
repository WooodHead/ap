type ColumnType = 'static' | 'time';

export interface Column {
  title: string;
  key: string;
  type: ColumnType;
}
