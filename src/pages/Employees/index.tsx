import { PlusOutlined } from '@ant-design/icons';
import { Button, message, Drawer, DatePicker, TimePicker } from 'antd';
import React, { useState, useRef, useEffect } from 'react';
import { FormattedMessage } from 'umi';
import { GridContent, FooterToolbar } from '@ant-design/pro-layout';
import type { ProColumns, ActionType } from '@ant-design/pro-table';
import ProTable from '@ant-design/pro-table';
import { ModalForm, ProFormText, ProFormSelect } from '@ant-design/pro-form';
import type { ProDescriptionsItemProps } from '@ant-design/pro-descriptions';
import ProDescriptions from '@ant-design/pro-descriptions';
import type { FormValueType } from './components/UpdateForm';
import UpdateForm from './components/UpdateForm';
import type { TableListItem } from './data';
import { queryRule, updateRule, addRule, removeRule, queryServices } from './service';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import moment from 'moment';

/**
 * 添加节点
 *
 * @param fields
 */
const handleAdd = async (fields: TableListItem) => {
  const hide = message.loading('Loading...');
  try {
    await addRule({ ...fields });
    hide();
    message.success('Success');
    return true;
  } catch (error) {
    hide();
    message.error('Error!');
    return false;
  }
};

/**
 * 更新节点
 *
 * @param fields
 */
const handleUpdate = async (fields: FormValueType) => {
  const hide = message.loading('正在配置');
  try {
    await updateRule({
      name: fields.name,
      desc: fields.desc,
      key: fields.key,
    });
    hide();

    message.success('配置成功');
    return true;
  } catch (error) {
    hide();
    message.error('配置失败请重试！');
    return false;
  }
};

/**
 * 删除节点
 *
 * @param selectedRows
 */
const handleRemove = async (selectedRows: TableListItem[]) => {
  const hide = message.loading('正在删除');
  if (!selectedRows) return true;
  try {
    await removeRule({
      key: selectedRows.map((row) => row.key),
    });
    hide();
    message.success('删除成功，即将刷新');
    return true;
  } catch (error) {
    hide();
    message.error('删除失败，请重试');
    return false;
  }
};

const Employees: React.FC = () => {
  /** 新建窗口的弹窗 */
  const [createModalVisible, handleModalVisible] = useState<boolean>(false);
  /** 分布更新窗口的弹窗 */
  const [updateModalVisible, handleUpdateModalVisible] = useState<boolean>(false);

  const [showDetail, setShowDetail] = useState<boolean>(false);
  const [services, setServices] = useState([]);
  const [description, setDescription] = useState();
  const [date, setDate] = useState(null);
  const [time, setTime] = useState(null);

  const actionRef = useRef<ActionType>();
  const [currentRow, setCurrentRow] = useState<TableListItem>();
  const [selectedRowsState, setSelectedRows] = useState<TableListItem[]>([]);

  useEffect(() => {
    queryServices().then((res) =>
      setServices(
        res.map((i) => {
          return { label: i.title, value: i.id };
        }),
      ),
    );
  }, []);

  const disabledDate = (current) => {
    // Can not select days before today and today
    return current && current < moment().endOf('day');
  };

  const onDateChange = (date) => {
    setDate(date);
  };

  const onTimeChange = (time) => {
    setTime(time);
  };

  const columns: ProColumns<TableListItem>[] = [
    {
      title: 'Name',
      dataIndex: 'name',
      render: (dom, entity) => {
        return (
          <a
            onClick={() => {
              setCurrentRow(entity);
              setShowDetail(true);
            }}
          >
            {dom}
          </a>
        );
      },
    },
    {
      title: 'Experience',
      dataIndex: 'experience',
      valueType: 'textarea',
      render: (value) => <div dangerouslySetInnerHTML={{ __html: value }} />,
    },
    {
      title: 'Services',
      dataIndex: 'services',
      sorter: true,
      render: (value) => {
        return value?.map((i) => <p key={i.title}>{i.title}, </p>);
      },
    },
    {
      title: <FormattedMessage id="pages.searchTable.titleOption" defaultMessage="操作" />,
      dataIndex: 'option',
      valueType: 'option',
      render: (_, record) => [
        <a
          key="config"
          onClick={() => {
            handleUpdateModalVisible(true);
            setCurrentRow(record);
          }}
        >
          <FormattedMessage id="edit" defaultMessage="Edit" />
        </a>,
      ],
    },
  ];

  return (
    <GridContent>
      <ProTable<TableListItem>
        headerTitle="Employee"
        actionRef={actionRef}
        rowKey="key"
        search={false}
        toolBarRender={() => [
          <Button
            type="primary"
            key="primary"
            onClick={() => {
              handleModalVisible(true);
            }}
          >
            <PlusOutlined /> <FormattedMessage id="pages.searchTable.new" defaultMessage="新建" />
          </Button>,
        ]}
        request={() => queryRule(Number(sessionStorage.getItem('id')))}
        columns={columns}
        rowSelection={{
          onChange: (_, selectedRows) => {
            setSelectedRows(selectedRows);
          },
        }}
        pagination={{
          showTotal: (total, range) => (
            <div>{`showing ${range[0]}-${range[1]} of ${total} total items`}</div>
          ),
        }}
      />
      {selectedRowsState?.length > 0 && (
        <FooterToolbar
          extra={
            <div>
              <FormattedMessage id="pages.searchTable.chosen" defaultMessage="已选择" />{' '}
              <a style={{ fontWeight: 600 }}>{selectedRowsState.length}</a>{' '}
              <FormattedMessage id="pages.searchTable.item" defaultMessage="项" />
              &nbsp;&nbsp;
              <span>
                <FormattedMessage
                  id="pages.searchTable.totalServiceCalls"
                  defaultMessage="服务调用次数总计"
                />{' '}
                {selectedRowsState.reduce((pre, item) => pre + item.callNo, 0)}{' '}
                <FormattedMessage id="pages.searchTable.tenThousand" defaultMessage="万" />
              </span>
            </div>
          }
        >
          <Button
            onClick={async () => {
              await handleRemove(selectedRowsState);
              setSelectedRows([]);
              actionRef.current?.reloadAndRest?.();
            }}
          >
            <FormattedMessage id="pages.searchTable.batchDeletion" defaultMessage="批量删除" />
          </Button>
          <Button type="primary">
            <FormattedMessage id="pages.searchTable.batchApproval" defaultMessage="批量审批" />
          </Button>
        </FooterToolbar>
      )}
      <ModalForm
        title="Add a employee"
        width="400px"
        visible={createModalVisible}
        onVisibleChange={handleModalVisible}
        modalProps={{
          cancelText: 'Cancel',
          okText: 'Ok',
        }}
        onFinish={async (value) => {
          const success = await handleAdd({
            ...(value as TableListItem),
            experience: description,
            date: date,
            time: time,
          });
          if (success) {
            handleModalVisible(false);
            if (actionRef.current) {
              actionRef.current.reload();
            }
          }
        }}
      >
        <ProFormText
          rules={[
            {
              required: true,
              message: (
                <FormattedMessage
                  id="pages.searchTable.ruleName"
                  defaultMessage="规则名称为必填项"
                />
              ),
            },
          ]}
          name="name"
          placeholder="Add name"
        />
        <ProFormText
          rules={[
            {
              required: true,
              message: (
                <FormattedMessage
                  id="pages.searchTable.ruleName"
                  defaultMessage="规则名称为必填项"
                />
              ),
            },
          ]}
          name="lastName"
          placeholder="Add last name"
        />
        <ProFormSelect
          name="select"
          options={services}
          fieldProps={{
            mode: 'multiple',
          }}
          placeholder="Select a service"
          rules={[{ required: true, message: 'Please select your country!' }]}
        />
        <DatePicker.RangePicker
          name="date"
          style={{ marginBottom: '24px', width: '100%' }}
          placeholder={['start date', 'end date']}
          disabledDate={disabledDate}
          value={date}
          onChange={onDateChange}
        />
        <TimePicker.RangePicker
          name="time"
          style={{ marginBottom: '24px', width: '100%' }}
          format="HH:mm"
          minuteStep={30}
          value={time}
          onChange={onTimeChange}
        />
        <ReactQuill theme="snow" placeholder="Add experience" onChange={(e) => setDescription(e)} />
      </ModalForm>
      <UpdateForm
        onSubmit={async (value) => {
          const success = await handleUpdate(value);
          if (success) {
            handleUpdateModalVisible(false);
            setCurrentRow(undefined);
            if (actionRef.current) {
              actionRef.current.reload();
            }
          }
        }}
        onCancel={() => {
          handleUpdateModalVisible(false);
          setCurrentRow(undefined);
        }}
        updateModalVisible={updateModalVisible}
        values={currentRow || {}}
      />

      <Drawer
        width={600}
        visible={showDetail}
        onClose={() => {
          setCurrentRow(undefined);
          setShowDetail(false);
        }}
        closable={false}
      >
        {currentRow?.name && (
          <ProDescriptions<TableListItem>
            column={2}
            title={currentRow?.name}
            request={async () => ({
              data: currentRow || {},
            })}
            params={{
              id: currentRow?.name,
            }}
            columns={columns as ProDescriptionsItemProps<TableListItem>[]}
          />
        )}
      </Drawer>
    </GridContent>
  );
};

export default Employees;
