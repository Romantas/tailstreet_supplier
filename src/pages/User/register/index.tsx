import { Form, Button, Input, Popover, Progress, message } from 'antd';
import type { FC } from 'react';
import React, { useState, useEffect } from 'react';
import type { Dispatch } from 'umi';
import { Link, connect, history, FormattedMessage, formatMessage } from 'umi';

import type { StateType } from './model';
import styles from './style.less';

const FormItem = Form.Item;

const passwordStatusMap = {
  ok: (
    <div className={styles.success}>
      <FormattedMessage id="userandregister.strength.strong" />
    </div>
  ),
  pass: (
    <div className={styles.warning}>
      <FormattedMessage id="userandregister.strength.medium" />
    </div>
  ),
  poor: (
    <div className={styles.error}>
      <FormattedMessage id="userandregister.strength.short" />
    </div>
  ),
};

const passwordProgressMap: {
  ok: 'success';
  pass: 'normal';
  poor: 'exception';
} = {
  ok: 'success',
  pass: 'normal',
  poor: 'exception',
};

type RegisterProps = {
  dispatch: Dispatch;
  userAndregister: StateType;
  submitting: boolean;
};

export type UserRegisterParams = {
  mail: string;
  password: string;
  confirm: string;
  mobile: string;
  captcha: string;
  prefix: string;
};

const Register: FC<RegisterProps> = ({ submitting, dispatch, userAndregister }) => {
  const [visible, setvisible]: [boolean, any] = useState(false);
  const [popover, setpopover]: [boolean, any] = useState(false);
  const confirmDirty = false;
  let interval: number | undefined;
  const [form] = Form.useForm();
  useEffect(() => {
    if (!userAndregister) {
      return;
    }
    const account = form.getFieldValue('mail');
    if (userAndregister.status === 'ok') {
      console.log(userAndregister);
      message.success('Success');
      history.push({
        pathname: '/profile',
        state: {
          account,
        },
      });
    }
  }, [userAndregister]);
  useEffect(
    () => () => {
      clearInterval(interval);
    },
    [],
  );
  const getPasswordStatus = () => {
    const value = form.getFieldValue('password');
    if (value && value.length > 9) {
      return 'ok';
    }
    if (value && value.length > 5) {
      return 'pass';
    }
    return 'poor';
  };
  const onFinish = (values: Record<string, any>) => {
    dispatch({
      type: 'userAndregister/submit',
      payload: {
        ...values,
      },
    });
  };
  const checkConfirm = (_: any, value: string) => {
    const promise = Promise;
    if (value && value !== form.getFieldValue('password')) {
      return promise.reject(formatMessage({ id: 'userandregister.password.twice' }));
    }
    return promise.resolve();
  };
  const checkPassword = (_: any, value: string) => {
    const promise = Promise;
    // ??????????????????
    if (!value) {
      setvisible(!!value);
      return promise.reject(formatMessage({ id: 'userandregister.password.required' }));
    }
    // ???????????????
    if (!visible) {
      setvisible(!!value);
    }
    setpopover(!popover);
    if (value.length < 6) {
      return promise.reject('');
    }
    if (value && confirmDirty) {
      form.validateFields(['confirm']);
    }
    return promise.resolve();
  };
  const renderPasswordProgress = () => {
    const value = form.getFieldValue('password');
    const passwordStatus = getPasswordStatus();
    return value && value.length ? (
      <div className={styles[`progress-${passwordStatus}`]}>
        <Progress
          status={passwordProgressMap[passwordStatus]}
          className={styles.progress}
          strokeWidth={6}
          percent={value.length * 10 > 100 ? 100 : value.length * 10}
          showInfo={false}
        />
      </div>
    ) : null;
  };

  return (
    <div className={styles.main}>
      <h3>
        <FormattedMessage id="userandregister.register.register" />
      </h3>
      <Form form={form} name="UserRegister" onFinish={onFinish}>
        <FormItem
          name="email"
          rules={[
            {
              required: true,
              message: formatMessage({ id: 'userandregister.email.required' }),
            },
            {
              type: 'email',
              message: formatMessage({ id: 'userandregister.email.wrong-format' }),
            },
          ]}
        >
          <Input
            size="large"
            placeholder={formatMessage({ id: 'userandregister.email.placeholder' })}
          />
        </FormItem>
        <Popover
          getPopupContainer={(node) => {
            if (node && node.parentNode) {
              return node.parentNode as HTMLElement;
            }
            return node;
          }}
          content={
            visible && (
              <div style={{ padding: '4px 0' }}>
                {passwordStatusMap[getPasswordStatus()]}
                {renderPasswordProgress()}
                <div style={{ marginTop: 10 }}>
                  <FormattedMessage id="userandregister.strength.msg" />
                </div>
              </div>
            )
          }
          overlayStyle={{ width: 240 }}
          placement="right"
          visible={visible}
        >
          <FormItem
            name="password"
            className={
              form.getFieldValue('password') &&
              form.getFieldValue('password').length > 0 &&
              styles.password
            }
            rules={[
              {
                validator: checkPassword,
              },
            ]}
          >
            <Input
              size="large"
              type="password"
              placeholder={formatMessage({ id: 'userandregister.password.placeholder' })}
            />
          </FormItem>
        </Popover>
        <FormItem
          name="confirm"
          rules={[
            {
              required: true,
              message: formatMessage({ id: 'userandregister.confirm-password.required' }),
            },
            {
              validator: checkConfirm,
            },
          ]}
        >
          <Input
            size="large"
            type="password"
            placeholder={formatMessage({ id: 'userandregister.confirm-password.placeholder' })}
          />
        </FormItem>
        <FormItem
          name="mobile"
          rules={[
            {
              required: true,
              message: formatMessage({ id: 'userandregister.phone-number.required' }),
            },
            {
              pattern: /^\d{8}$/,
              message: formatMessage({ id: 'userandregister.phone-number.wrong-format' }),
            },
          ]}
        >
          <Input
            addonBefore="+370"
            size="large"
            placeholder={formatMessage({ id: 'userandregister.phone-number.placeholder' })}
          />
        </FormItem>
        <FormItem>
          <Button
            size="large"
            loading={submitting}
            className={styles.submit}
            type="primary"
            htmlType="submit"
          >
            <FormattedMessage id="userandregister.register.register" />
          </Button>
          <Link className={styles.login} to="/user/login">
            Already have an account?
          </Link>
        </FormItem>
      </Form>
    </div>
  );
};
export default connect(
  ({
    userAndregister,
    loading,
  }: {
    userAndregister: StateType;
    loading: {
      effects: Record<string, boolean>;
    };
  }) => ({
    userAndregister,
    submitting: loading.effects['userAndregister/submit'],
  }),
)(Register);
