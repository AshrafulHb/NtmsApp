export interface Tenant {
  id: number;
  name: string;
  occupation?: string;
  paddress?: string;
  telephone?: string;
  securityDeposit?: string;
  startDate: string;
  isActive: number;
  flatId?: number;
  flatCode?: string;
}
