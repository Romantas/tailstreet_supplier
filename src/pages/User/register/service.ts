import request from 'umi-request';
import type { UserRegisterParams } from './index';

export async function fakeRegister(params: UserRegisterParams) {
  const res = await request('http://api.tailstreet.com/api/v1/users', {
    method: 'POST',
    data: { ...params, role: 1 },
  });
  return {
    data: res,
    currentAuthority: 'user',
    status: 'ok',
  };
}
