export interface ClaimsAndDebt {
  cadId: number;
  cadType: string;
  creditor: string;
  obligor: string;
  cadNum: string;
  cadTime: string;
  cadPlan: string;
  cadRepay: string;
  cadRemark: string;
  cadStatus: string;

  offset: string;
  limit: number;
}

export type ClaimsAndDebtPagination = {
  limit: number;
  total: number;
  pageSize: number;
  current: number;
};
