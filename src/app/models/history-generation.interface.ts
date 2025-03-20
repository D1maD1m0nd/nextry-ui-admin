export interface User {
  name: string;
  email: string;
}

export interface HistoryGeneration {
  id: string;
  status: string | null;
  createdAt: string;
  userId: string;
  generationType: string;
  previewUrl: string;
  stockUrl: string;
  user: User;
} 