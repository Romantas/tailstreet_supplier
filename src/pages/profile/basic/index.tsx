import React, { Component } from 'react';

import { GridContent } from '@ant-design/pro-layout';
import { Form, Card, Input, Row, Col, Upload, Button } from 'antd';
import { InboxOutlined } from '@ant-design/icons';
import type { Dispatch } from 'umi';
import { connect } from 'umi';
import type { BasicProfileDataType } from './data';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

type BasicProps = {
  loading: boolean;
  dispatch: Dispatch;
  profileAndbasic: BasicProfileDataType;
};
type BasicState = {
  visible: boolean;
};

class Basic extends Component<BasicProps, BasicState> {
  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'profileAndbasic/fetchBasic',
    });
  }
  render() {
    const props = {
      name: 'file',
      multiple: false,
      action: 'https://www.mocky.io/v2/5cc8019d300000980a055e76',
      onChange(info) {
        const { status } = info.file;
        if (status !== 'uploading') {
          console.log(info.file, info.fileList);
        }
      },
    };
    return (
      <GridContent>
        <Card bordered={false}>
          <Row justify="center">
            <Col span="8">
              <Form hideRequiredMark style={{ marginTop: 8 }} name="basic" layout="vertical">
                <Form.Item
                  label="Company Name"
                  name="CompanyName"
                  rules={[
                    {
                      required: true,
                      message: 'Please input your company name!',
                    },
                  ]}
                >
                  <Input placeholder="Company name" />
                </Form.Item>
                <Form.Item label="Description">
                  <ReactQuill theme="snow" />
                </Form.Item>
                <Form.Item name="city" label="City">
                  <Input placeholder="City" />
                </Form.Item>
                <Form.Item name="address" label="Address">
                  <Input placeholder="Address" />
                </Form.Item>
                <Form.Item name="Image">
                  <Upload.Dragger {...props}>
                    <p className="ant-upload-drag-icon">
                      <InboxOutlined />
                    </p>
                    <p className="ant-upload-text">Click or drag file to this area to upload</p>
                    <p className="ant-upload-hint">
                      Support for a single or bulk upload. Strictly prohibit from uploading company
                      data or other band files
                    </p>
                  </Upload.Dragger>
                  ,
                </Form.Item>
                <Button style={{ width: '100%' }} type="primary">
                  Save
                </Button>
              </Form>
            </Col>
          </Row>
        </Card>
      </GridContent>
    );
  }
}

export default connect(
  ({
    profileAndbasic,
    loading,
  }: {
    profileAndbasic: BasicProfileDataType;
    loading: {
      effects: Record<string, boolean>;
    };
  }) => ({
    profileAndbasic,
    loading: loading.effects['profileAndbasic/fetchBasic'],
  }),
)(Basic);
