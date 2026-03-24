export interface WareHouse {
  id: number;
  warehouseCode: string;
  warehouseName: string;
  address: string;
  city: string;
  state: string;
  capacity: number;
  isActive: boolean;
  managerName: string;
}


export type GetAllWareHousesResponse = WareHouse[];
