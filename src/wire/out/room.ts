export interface RoomResponse {
  id: string;
  name: string;
  createdAt: number;
}

export interface RoomListResponse {
  rooms: RoomResponse[];
}
