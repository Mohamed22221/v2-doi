export interface Language {
  id: number;
  code: string;  
  name: string;        
  isActive: boolean;
  createdAt: string;  
  updatedAt: string;  
  deletedAt: string | null;
}