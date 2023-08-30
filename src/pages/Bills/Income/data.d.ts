export interface Income {
  incomeId: number;
  incomeTime: string;
  incomeNum: string;
  incomeSort: string | null;
  incomeRemark: string | null;
  incomeUserId: number;
  incomeUser: string;
  offset: string;
  limit: number;
}

export type IncomePagination = {
  limit: number;
  total: number;
  pageSize: number;
  current: number;
};
