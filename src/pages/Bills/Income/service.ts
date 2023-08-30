// @ts-ignore
/* eslint-disable */
import {request} from '@umijs/max';
import {stringify} from "querystring";
import {Income} from "@/pages/Bills/Income/data";

/** 查询收入记录 */

export async function selectIncome(
  params: {
    limit: number;
  },
  options?: { [key: string]: any },
) {
  const response = await request<{
    data: Income[];
    /** 列表的内容总数 */
    total?: number;
    success?: boolean;
  }>('/api/bills/userIncome/selectAll', {
    method: 'GET',
    params: {
      ...params,
    },
    ...(options || {}),
  });

  // Add unique keys to each item in the data array
  const dataWithKeys = response.data.map(item => ({
    ...item,
    key: item.incomeId, // Assuming incomeId is a unique identifier
  }));

  return {
    ...response,
    data: dataWithKeys,
  };
}


/** 更新收入记录 */
export async function updateIncome(params: any, options?: { [key: string]: any }) {
  console.log('updateIncome');
  console.log(params);
  return request(`/api/bills/userIncome/updateIncome`, {
    method: "Post",
    headers: {
      'content-type': 'application/json'
    },
    data: JSON.stringify(params),
    ...(options || {}),
  });
}

/** 插入收入记录 */
export async function insertIncome(params: any, options?: { [key: string]: any }) {
  console.log('insertIncome');
  console.log(params);
  return request(`/api/bills/userIncome/insertIncome?${stringify(params)}`, {
    method: "GET",
    headers: {
      'content-type': 'application/json'
    },
    ...(options || {}),
  });
}

/** 删除收入记录 */
export async function deleteIncome(params: any, options?: { [key: string]: any }) {
  console.log('deleteIncome');
  console.log(params);
  return request(`/api/bills/userIncome/deleteIncome?${stringify(params)}`, {
    method: "GET",
    ...(options || {}),
  });
}

/** 查询收入类型名 */
export async function findTypeName(options?: { [key: string]: any }) {
  console.log('findTypeName');
  console.log('/api/bills/userIncome/findType');
  return request(`/api/bills/userIncome/findType`, {
    method: "GET",
    ...(options || {}),
  });
}

/** 获取收入记录的统计信息 */
export async function getIncomeCollection(params: any, options?: { [key: string]: any }) {
  console.log('getIncomeCollection' + stringify(params));
  console.log(params);
  return request(`/api/bills/userIncome/getIncomeCollection?${stringify(params)}`, {
    method: "GET",
    ...(options || {}),
  });
}
