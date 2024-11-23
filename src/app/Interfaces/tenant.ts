export interface Tenant {
  id: number;
  name: string;
  occupation?: string;
  paddress?: string;
  telephone?: string;
  startDate: string;
  isActive: number;
  flatId?: number;
  flatDescription?: string;
}
