// @ts-ignore
/* eslint-disable */
import {request} from '@umijs/max';
import {stringify} from "querystring";
import {Expenses} from "@/pages/Bills/Expenses/data";

/** 查询收入记录 */

export async function selectExpenses(
  params: {
    limit: number;
  },
  options?: { [key: string]: any },
) {
  const response = await request<{
    data: Expenses[];
    /** 列表的内容总数 */
    total?: number;
    success?: boolean;
  }>('/api/bills/userExpenses/selectAll', {
    method: 'GET',
    params: {
      ...params,
    },
    ...(options || {}),
  });

  // Add unique keys to each item in the data array
  const dataWithKeys = response.data.map(item => ({
    ...item,
    key: item.expensesId, // Assuming expensesId is a unique identifier
  }));

  return {
    ...response,
    data: dataWithKeys,
  };
}


/** 更新收入记录 */
export async function updateExpenses(params: any, options?: { [key: string]: any }) {
  // console.log('updateExpenses');
  // console.log(params);
  return request(`/api/bills/userExpenses/updateExpenses`, {
    method: "Post",
    headers: {
      'content-type': 'application/json'
    },
    data: JSON.stringify(params),
    ...(options || {}),
  });
}

/** 插入收入记录 */
export async function insertExpenses(params: any, options?: { [key: string]: any }) {
  // console.log('insertExpenses');
  // console.log(params);
  return request(`/api/bills/userExpenses/insertExpenses?${stringify(params)}`, {
    method: "GET",
    headers: {
      'content-type': 'application/json'
    },
    ...(options || {}),
  });
}

/** 删除收入记录 */
export async function deleteExpenses(params: any, options?: { [key: string]: any }) {
  // console.log('deleteExpenses');
  // console.log(params);
  return request(`/api/bills/userExpenses/deleteExpenses?${stringify(params)}`, {
    method: "GET",
    ...(options || {}),
  });
}

/** 查询收入类型名 */
export async function findTypeName(options?: { [key: string]: any }) {
  // console.log('findTypeName');
  // console.log('/api/bills/userExpenses/findType');
  return request(`/api/bills/userExpenses/findType`, {
    method: "GET",
    ...(options || {}),
  });
}

/** 获取收入记录的统计信息 */
export async function getExpensesCollection(params: any, options?: { [key: string]: any }) {
  // console.log('getExpensesCollection' + stringify(params));
  // console.log(params);
  return request(`/api/bills/userExpenses/getExpensesCollection?${stringify(params)}`, {
    method: "GET",
    ...(options || {}),
  });
}
