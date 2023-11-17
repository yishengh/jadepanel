// @ts-ignore
/* eslint-disable */
import { request } from '@umijs/max';
import { stringify } from 'querystring';
import { UserStock } from '@/pages/Finance/Stock/userStock';

/** 查询收入记录 */

export async function selectUserStock(
  params: {
    limit: number;
  },
  options?: { [key: string]: any },
) {
  const response = await request<{
    data: UserStock[];
    /** 列表的内容总数 */
    total?: number;
    success?: boolean;
  }>('/api/finance/userStock/selectAll', {
    method: 'GET',
    params: {
      ...params,
    },
    ...(options || {}),
  });

  // Add unique keys to each item in the data array
  const dataWithKeys = response.data.map((item) => ({
    ...item,
    key: item.stockId, // Assuming cadId is a unique identifier
  }));

  return {
    ...response,
    data: dataWithKeys,
  };
}

/** 更新收入记录 */
export async function updateUserStock(params: any, options?: { [key: string]: any }) {
  // console.log('updateExpenses');
  // console.log(params);
  return request(`/api/finance/userStock/update`, {
    method: 'Post',
    headers: {
      'content-type': 'application/json',
    },
    data: JSON.stringify(params),
    ...(options || {}),
  });
}

/** 插入收入记录 */
export async function insertUserStock(params: any, options?: { [key: string]: any }) {
  // console.log('insertExpenses');
  // console.log(params);
  return request(`/api/finance/userStock/insert?${stringify(params)}`, {
    method: 'GET',
    headers: {
      'content-type': 'application/json',
    },
    ...(options || {}),
  });
}

/** 删除收入记录 */
export async function deleteUserStock(params: any, options?: { [key: string]: any }) {
  // console.log('deleteExpenses');
  // console.log(params);
  return request(`/api/finance/userStock/delete?${stringify(params)}`, {
    method: 'GET',
    ...(options || {}),
  });
}
//
// /** 获取收入记录的统计信息 */
// export async function getUserStockCollection(params: any, options?: { [key: string]: any }) {
//   // console.log('getExpensesCollection' + stringify(params));
//   // console.log(params);
//   return request(`/api/finance/userStock/get?${stringify(params)}`, {
//     method: 'GET',
//     ...(options || {}),
//   });
// }
