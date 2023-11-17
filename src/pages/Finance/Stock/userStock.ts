export interface UserStock {
  stockId: number;
  stockCode: string;
  stockName: string;
  stockType: string;
  stockPrice: string;
  stockNum: string;
  stockTime: string;
  stockUser: string;
  stockUserId: string;
}

export type UserStockPagination = {
  limit: number;
  total: number;
  pageSize: number;
  current: number;
};
