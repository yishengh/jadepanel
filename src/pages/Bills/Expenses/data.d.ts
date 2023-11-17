export interface Expenses {
  expensesId: number;
  expensesTime: string;
  expensesNum: string;
  expensesSort: string | null;
  expensesRemark: string | null;
  expensesUserId: number;
  expensesUser: string;
  offset: string;
  limit: number;
}

export type ExpensesPagination = {
  limit: number;
  total: number;
  pageSize: number;
  current: number;
};
