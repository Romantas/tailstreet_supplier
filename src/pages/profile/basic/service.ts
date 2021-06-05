import request from 'umi-request';

export async function queryBasicProfile() {
  return request('/api/profile/basic');
}

export async function addCompanyInfo(id: number, data: any) {
  return await fetch(`https://api.tailstreet.com/api/v1/company-info/${id}`, {
    method: 'POST',
    body: data,
  });
}
