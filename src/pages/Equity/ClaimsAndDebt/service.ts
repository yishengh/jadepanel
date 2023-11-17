// @ts-ignore
/* eslint-disable */
import { request } from '@umijs/max';
import { stringify } from 'querystring';
import { ClaimsAndDebt } from '@/pages/Equity/ClaimsAndDebt/data';

/** 查询收入记录 */

export async function selectClaimsAndDebt(
  params: {
    limit: number;
  },
  options?: { [key: string]: any },
) {
  const response = await request<{
    data: ClaimsAndDebt[];
    /** 列表的内容总数 */
    total?: number;
    success?: boolean;
  }>('/api/equity/claimsAndDebt/selectAll', {
    method: 'GET',
    params: {
      ...params,
    },
    ...(options || {}),
  });

  // Add unique keys to each item in the data array
  const dataWithKeys = response.data.map((item) => ({
    ...item,
    key: item.cadId, // Assuming cadId is a unique identifier
  }));

  return {
    ...response,
    data: dataWithKeys,
  };
}

/** 更新收入记录 */
export async function updateClaimsAndDebt(params: any, options?: { [key: string]: any }) {
  // console.log('updateExpenses');
  // console.log(params);
  return request(`/api/equity/claimsAndDebt/updateClaimsAndDebt`, {
    method: 'Post',
    headers: {
      'content-type': 'application/json',
    },
    data: JSON.stringify(params),
    ...(options || {}),
  });
}

/** 插入收入记录 */
export async function insertClaimsAndDebt(params: any, options?: { [key: string]: any }) {
  // console.log('insertExpenses');
  // console.log(params);
  return request(`/api/equity/claimsAndDebt/insertClaimsAndDebt?${stringify(params)}`, {
    method: 'GET',
    headers: {
      'content-type': 'application/json',
    },
    ...(options || {}),
  });
}

/** 删除收入记录 */
export async function deleteClaimsAndDebt(params: any, options?: { [key: string]: any }) {
  // console.log('deleteExpenses');
  // console.log(params);
  return request(`/api/equity/claimsAndDebt/deleteClaimsAndDebt?${stringify(params)}`, {
    method: 'GET',
    ...(options || {}),
  });
}

/** 获取收入记录的统计信息 */
export async function getClaimsAndDebtCollection(params: any, options?: { [key: string]: any }) {
  // console.log('getExpensesCollection' + stringify(params));
  // console.log(params);
  return request(`/api/equity/claimsAndDebt/getClaimsAndDebtsCollection?${stringify(params)}`, {
    method: 'GET',
    ...(options || {}),
  });
}
