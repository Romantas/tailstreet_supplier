import request from 'umi-request';

export type LoginParamsType = {
  userName: string;
  password: string;
  mobile: string;
  captcha: string;
};

export async function fakeAccountLogin(params: LoginParamsType) {
  const res = await request('http://api.tailstreet.com/api/v1/users/company/login', {
    method: 'POST',
    data: { password: params.password, email: params.userName },
  });
  console.log(res.id);
  sessionStorage.setItem('id', res?.company?.id || 0);
  sessionStorage.setItem('userId', res.id);
  return {
    id: res.id,
    status: 'ok',
    type: 'account',
    currentAuthority: 'admin',
  };
}

export async function getFakeCaptcha(mobile: string) {
  return request(`/api/login/captcha?mobile=${mobile}`);
}
