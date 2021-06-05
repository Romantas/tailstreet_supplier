import request from 'umi-request';

export type LoginParamsType = {
  userName: string;
  password: string;
  mobile: string;
  captcha: string;
};

export async function fakeAccountLogin(params: LoginParamsType) {
  const res = await request('https://api.tailstreet.com/api/v1/users/company/login', {
    method: 'POST',
    data: { password: params.password, email: params.userName },
  });
  console.log(res);
  sessionStorage.setItem('id', res?.company?.id || 0);
  sessionStorage.setItem('userId', res.id);
  if (res?.company) {
    sessionStorage.setItem('name', res?.company.name);
  }
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
