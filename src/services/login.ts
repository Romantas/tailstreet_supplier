import request from 'umi-request';

export type LoginParamsType = {
  userName: string;
  password: string;
  mobile: string;
  captcha: string;
};

export async function fakeAccountLogin(params: LoginParamsType) {
  const res = await request('http://localhost:8080/api/v1/users/company/login', {
    method: 'POST',
    data: { password: params.password, email: params.userName },
  });
  sessionStorage.setItem('id', res.company.id);
  console.log(res);
  return {
    status: 'ok',
    type: 'account',
    currentAuthority: 'admin',
  };
}

export async function getFakeCaptcha(mobile: string) {
  return request(`/api/login/captcha?mobile=${mobile}`);
}
