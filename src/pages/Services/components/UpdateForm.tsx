import React from 'react';
import { ModalForm, ProFormText } from '@ant-design/pro-form';
import { FormattedMessage } from 'umi';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

import type { TableListItem } from '../data';

export type FormValueType = {
  target?: string;
  template?: string;
  type?: string;
  time?: string;
  frequency?: string;
} & Partial<TableListItem>;

export type UpdateFormProps = {
  onCancel: (flag?: boolean, formVals?: FormValueType) => void;
  onSubmit: (values: FormValueType) => Promise<void>;
  updateModalVisible: boolean;
  values: Partial<TableListItem>;
};

const UpdateForm: React.FC<UpdateFormProps> = (props) => {
  return (
    <ModalForm
      title="Service"
      width="720px"
      visible={props.updateModalVisible}
      // onVisibleChange={props.onCancel}
      onFinish={props.onSubmit}
    >
      <ProFormText
        rules={[
          {
            required: true,
            message: (
              <FormattedMessage id="pages.searchTable.ruleName" defaultMessage="规则名称为必填项" />
            ),
          },
        ]}
        name="name"
        placeholder="Service name"
      />
      <ReactQuill style={{ marginBottom: 24, minHeight: 240 }} theme="snow" />
      <ProFormText
        rules={[
          {
            required: true,
            message: (
              <FormattedMessage id="pages.searchTable.ruleName" defaultMessage="规则名称为必填项" />
            ),
          },
        ]}
        name="duration"
        placeholder="Enter duration"
      />
      <ProFormText
        rules={[
          {
            required: true,
            message: (
              <FormattedMessage id="pages.searchTable.ruleName" defaultMessage="规则名称为必填项" />
            ),
          },
        ]}
        name="cost"
        placeholder="Enter cost"
      />
    </ModalForm>
  );
};

export default UpdateForm;
