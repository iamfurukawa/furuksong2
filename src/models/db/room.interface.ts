export interface RoomInsert {
  name: string;
}

export interface Room {
  id: string; // UUID
  name: string;
  createdAt: number; // timestamp Unix
}