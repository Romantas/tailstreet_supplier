import request from 'umi-request';
import type { TableListParams, TableListItem } from './data';

export async function queryRule(id: number) {
  const res = await request(`https://api.tailstreet.com/api/v1/reservations/company/${id}`);

  return {
    current: 1,
    data: res,
    pageSize: 10,
    success: true,
    total: 10,
  };
}

export async function updateStatus(status: string) {
  const id = sessionStorage.getItem('id');
  location.reload();
  return await request(`https://api.tailstreet.com/api/v1/reservations/status/${status}/${id}`, {
    method: 'PUT',
  });
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

export async function addRule(params: TableListItem) {
  return request('/api/rule', {
    method: 'POST',
    data: {
      ...params,
      method: 'post',
    },
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
