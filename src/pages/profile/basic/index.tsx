import React, { Component } from 'react';

import { GridContent } from '@ant-design/pro-layout';
import { Form, Card, Input, Row, Col, Upload, Button } from 'antd';
import { InboxOutlined } from '@ant-design/icons';
import type { CurrentUser, Dispatch } from 'umi';
import { connect } from 'umi';
import type { BasicProfileDataType } from './data';
import { addCompanyInfo } from './service';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { ConnectState } from '@/models/connect';

type BasicProps = {
  loading: boolean;
  dispatch: Dispatch;
  profileAndbasic: BasicProfileDataType;
};
type BasicState = {
  description: string;
  file: any;
  visible: boolean;
  currentUser: CurrentUser;
};

class Basic extends Component<BasicProps, BasicState> {
  constructor(props: any) {
    super(props);

    this.state = {
      description: '',
      file: null,
    };
  }

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'profileAndbasic/fetchBasic',
    });
  }

  handleChange = (e) => {
    this.setState({
      description: e,
    });
  };

  handleImageChange = (info) => {
    this.setState({ file: info.file });
  };

  handleFinal = (e) => {
    const formData = new FormData();
    formData.append('name', e.name);
    formData.append('description', this.state.description);
    formData.append('city', e.city);
    formData.append('address', e.address);
    formData.append('file', e.image.fileList[0].originFileObj);
    // console.log(e.image.fileList[0].originFileObj);
    addCompanyInfo(Number(sessionStorage.getItem('userId')), formData)
      .then((res) => {
        return res.json();
      })
      .then((res) => {
        sessionStorage.setItem('id', res.id);
      });
  };

  render() {
    const props = {
      name: 'file',
      multiple: false,
      onChange: this.handleImageChange,
      beforeUpload: () => false,
    };

    return (
      <GridContent>
        <Card bordered={false}>
          <Row justify="center">
            <Col span="8">
              <Form
                hideRequiredMark
                style={{ marginTop: 8 }}
                name="basic"
                layout="vertical"
                onFinish={this.handleFinal}
              >
                <Form.Item
                  label="Company Name"
                  name="name"
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
                  <ReactQuill
                    theme="snow"
                    placeholder="Write Something about your company"
                    onChange={this.handleChange}
                  />
                </Form.Item>
                <Form.Item name="city" label="City">
                  <Input placeholder="City" />
                </Form.Item>
                <Form.Item name="address" label="Address">
                  <Input placeholder="Address" />
                </Form.Item>
                <Form.Item name="image">
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
                </Form.Item>
                <Button style={{ width: '100%' }} type="primary" htmlType="submit">
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
    user,
    profileAndbasic,
    loading,
  }: {
    user: ConnectState['user'];
    profileAndbasic: BasicProfileDataType;
    loading: {
      effects: Record<string, boolean>;
    };
  }) => ({
    currentUser: user.currentUser,
    profileAndbasic,
    loading: loading.effects['profileAndbasic/fetchBasic'],
  }),
)(Basic);
