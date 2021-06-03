import request from 'umi-request';
import type { UserRegisterParams } from './index';

export async function fakeRegister(params: UserRegisterParams) {
  const res = await request('http://localhost:8080/api/v1/users', {
    method: 'POST',
    data: { ...params, role: 1 },
  });
  return {
    data: res,
    currentAuthority: 'user',
    status: 'ok',
  };
}
