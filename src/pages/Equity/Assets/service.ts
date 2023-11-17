// @ts-ignore
/* eslint-disable */
import { request } from '@umijs/max';
import { stringify } from 'querystring';
import { Assets } from '@/pages/Equity/Assets/data';

/** 查询收入记录 */

export async function selectAssets(
  params: {
    limit: number;
  },
  options?: { [key: string]: any },
) {
  const response = await request<{
    data: Assets[];
    /** 列表的内容总数 */
    total?: number;
    success?: boolean;
  }>('/api/equity/userAssets/selectAll', {
    method: 'GET',
    params: {
      ...params,
    },
    ...(options || {}),
  });

  // Add unique keys to each item in the data array
  const dataWithKeys = response.data.map((item) => ({
    ...item,
    key: item.assetsId, // Assuming cadId is a unique identifier
  }));

  return {
    ...response,
    data: dataWithKeys,
  };
}

/** 更新收入记录 */
export async function updateAssets(params: any, options?: { [key: string]: any }) {
  // console.log('updateExpenses');
  // console.log(params);
  return request(`/api/equity/userAssets/updateAssets`, {
    method: 'Post',
    headers: {
      'content-type': 'application/json',
    },
    data: JSON.stringify(params),
    ...(options || {}),
  });
}

/** 插入收入记录 */
export async function insertAssets(params: any, options?: { [key: string]: any }) {
  // console.log('insertExpenses');
  // console.log(params);
  return request(`/api/equity/userAssets/insertAssets?${stringify(params)}`, {
    method: 'GET',
    headers: {
      'content-type': 'application/json',
    },
    ...(options || {}),
  });
}

/** 删除收入记录 */
export async function deleteAssets(params: any, options?: { [key: string]: any }) {
  // console.log('deleteExpenses');
  // console.log(params);
  return request(`/api/equity/userAssets/deleteAssets?${stringify(params)}`, {
    method: 'GET',
    ...(options || {}),
  });
}

/** 获取收入记录的统计信息 */
export async function getAssetsCollection() {
  // console.log('getExpensesCollection' + stringify(params));
  // console.log(params);
  return request(`/api/equity/userAssets/getAssetsCollection`, {
    method: 'GET',
  });
}
