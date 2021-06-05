import request from 'umi-request';
import type { TableListParams, TableListItem } from './data';

export async function queryRule(id: number) {
  const res = await request(`http://api.tailstreet.com/api/v1/employees/services/${id}`);

  return {
    current: 1,
    data: res,
    pageSize: 10,
    success: true,
    total: 10,
  };
}

export async function removeRule(params: { key: number[] }) {
  return request('/api/rule', {
    method: 'POST',
    data: {
      ...params,
      method: 'delete',
    },
  });
}

export async function queryServices() {
  const id = sessionStorage.getItem('id');
  return await request(`http://api.tailstreet.com/api/v1/services/company/${id}`);
}

export async function addRule(params: TableListItem) {
  const id = sessionStorage.getItem('id');
  const date = params.date.map((i) => i.format('YYYY-MM-DD'));
  const time = params.time.map((i) => i.format('HH:mm:ss'));
  return await request(`http://api.tailstreet.com/api/v1/employees`, {
    method: 'POST',
    data: { ...params, companyId: id, date: date, time: time },
  });
}

export async function updateRule(params: TableListParams) {
  return request('/api/rule', {
    method: 'POST',
    data: {
      ...params,
      method: 'update',
    },
  });
}
