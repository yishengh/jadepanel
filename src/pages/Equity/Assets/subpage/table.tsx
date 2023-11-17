import { PlusOutlined, UserOutlined } from '@ant-design/icons';
import type {
  ActionType,
  ProColumns,
  ProDescriptionsItemProps,
  ProFormInstance,
} from '@ant-design/pro-components';
import {
  FooterToolbar,
  ModalForm,
  PageContainer,
  ProDescriptions,
  ProFormText,
  ProFormTextArea,
  ProTable,
  ProFormDigit,
  ProFormSelect,
  ProFormDatePicker,
  ProForm,
} from '@ant-design/pro-components';
import { AutoComplete, Button, Drawer, Input, InputNumber, message } from 'antd';
import React, { useEffect, useRef, useState } from 'react';
import type { Assets, AssetsPagination, UserAssets } from '../data';
import {
  selectAssets,
  getAssetsCollection,
  deleteAssets,
  updateAssets,
  insertAssets,
} from '@/pages/Equity/Assets/service';
import { useIntl } from '@@/exports';
import type { FormValueType } from '../components/UpdateForm';
import UpdateForm from '../components/UpdateForm';

/**
 * 添加节点
 *
 * @param fields
 */

const handleAdd = async (fields: UserAssets) => {
  const hide = message.loading('正在添加');

  try {
    await insertAssets({ ...fields });
    hide();
    message.success('添加成功');
    return true;
  } catch (error) {
    hide();
    message.error('添加失败请重试！');
    return false;
  }
};

/**
 * 更新节点
 *
 * @param fields
 */

const handleUpdate = async (fields: FormValueType, currentRow?: UserAssets) => {
  const hide = message.loading('正在配置');

  try {
    await updateAssets({
      ...currentRow,
      ...fields,
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

const handleRemove = async (selectedRows: Assets[]) => {
  const hide = message.loading('正在删除');
  if (!selectedRows || selectedRows.length === 0) return true;

  try {
    for (const row of selectedRows) {
      // 发起删除请求，针对每个收入记录都发起一次请求
      await deleteAssets({ assetsId: row.assetsId });
    }
    hide();
    message.success('删除成功，即将刷新');
    return true;
  } catch (error) {
    hide();
    message.error('删除失败，请重试');
    return false;
  }
};

const TableList: React.FC = () => {
  const intl = useIntl();
  const [createModalVisible, handleModalVisible] = useState<boolean>(false);
  const [updateModalVisible, handleUpdateModalVisible] = useState<boolean>(false);
  const [showDetail, setShowDetail] = useState<boolean>(false);
  const actionRef = useRef<ActionType>();
  const [currentRow, setCurrentRow] = useState<Assets>();
  const [selectedRowsState, setSelectedRows] = useState<Assets[]>([]);
  const columns: ProColumns<Assets>[] = [
    {
      title: 'ID',
      sorter: (a, b) => a.assetsId - b.assetsId,
      dataIndex: 'assetsId',
      tip: intl.formatMessage({
        id: 'pages.assetsId.subPage.tip',
        defaultMessage: '表格唯一Key',
      }),
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
      title: 'assetsName',
      hideInSearch: true,
      dataIndex: 'assetsName',
    },
    {
      title: 'assetsOwner',
      hideInSearch: true,
      dataIndex: 'assetsOwner',
    },

    {
      title: 'assetsLocation',
      hideInSearch: true,
      dataIndex: 'assetsLocation',
    },

    {
      title: 'totalPrice',
      hideInSearch: true,
      dataIndex: 'totalPrice',
    },

    {
      title: 'historicalValue',
      hideInSearch: true,
      dataIndex: 'historicalValue',
    },
    {
      title: 'assetsInstalment',
      hideInSearch: true,
      dataIndex: 'assetsInstalment',
    },
    {
      title: 'instalmentPrice',
      hideInSearch: true,
      dataIndex: 'instalmentPrice',
    },
    {
      title: 'instalmentSurplus',
      hideInSearch: true,
      dataIndex: 'instalmentSurplus',
    },
    {
      title: 'realizationValue',
      hideInSearch: true,
      dataIndex: 'realizationValue',
    },
    {
      title: 'assetsRemark',
      hideInSearch: true,
      dataIndex: 'assetsRemark',
    },
    {
      title: 'assetsCreateTime',
      hideInSearch: true,
      dataIndex: 'assetsCreateTime',
    },

    {
      title: '操作',
      dataIndex: 'option',
      valueType: 'option',
      render: (_, record) => (
        <span>
          <Button
            type="link"
            onClick={() => {
              handleUpdateModalVisible(true);
              setCurrentRow(record);
            }}
          >
            修改
          </Button>

          <Button
            type="link"
            onClick={() => {
              handleRemove([record]);
              actionRef.current?.reloadAndRest?.();
            }}
          >
            删除
          </Button>
        </span>
      ),
    },
  ];

  return (
    <PageContainer>
      <ProTable<Assets, AssetsPagination>
        headerTitle={intl.formatMessage({
          id: 'pages.Assets.subPage.tableName',
          defaultMessage: '表格唯一Key',
        })}
        actionRef={actionRef}
        rowKey="key"
        search={{
          labelWidth: 120,
        }}
        toolBarRender={() => [
          <Button
            type="primary"
            key="primary"
            onClick={() => {
              handleModalVisible(true);
            }}
          >
            <PlusOutlined />{' '}
            {intl.formatMessage({
              id: 'pages.Assets.subPage.addNewAssets',
              defaultMessage: '添加新项目',
            })}
          </Button>,
        ]}
        request={selectAssets}
        columns={columns}
        rowSelection={{
          onChange: (_, selectedRows) => {
            setSelectedRows(selectedRows);
          },
        }}
      />
      {selectedRowsState?.length > 0 && (
        <FooterToolbar
          extra={
            <div>
              已选择{' '}
              <a
                style={{
                  fontWeight: 600,
                }}
              >
                {selectedRowsState.length}
              </a>{' '}
              项 &nbsp;&nbsp;
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
            批量删除
          </Button>
        </FooterToolbar>
      )}

      <ModalForm
        title="新建Assets"
        width="400px"
        open={createModalVisible}
        onOpenChange={handleModalVisible}
        onFinish={async (value) => {
          const success = await handleAdd(value as Assets);
          if (success) {
            handleModalVisible(false);
            if (actionRef.current) {
              actionRef.current.reload();
            }
          }
        }}
      >
        <ProFormText
          label="名称"
          rules={[
            {
              required: true,
              message: '名称为必填项',
            },
          ]}
          width="md"
          name="assetsName"
        />
        <ProFormText
          label="assetsOwner"
          rules={[
            {
              required: true,
              message: '名称为必填项',
            },
          ]}
          width="md"
          name="assetsOwner"
        />
        <ProFormDatePicker
          label="日期"
          rules={[
            {
              required: true,
              message: '名称为必填项',
            },
          ]}
          width="md"
          name="assetsCreateTime"
        />
      </ModalForm>

      <UpdateForm
        onSubmit={async (value: FormValueType) => {
          const success = await handleUpdate(value, currentRow);

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
        open={showDetail}
        onClose={() => {
          setCurrentRow(undefined);
          setShowDetail(false);
        }}
        closable={false}
      >
        {currentRow?.assetsId && (
          <ProDescriptions<Assets>
            column={2}
            title={currentRow?.assetsId}
            request={async () => ({
              data: currentRow || {},
            })}
            params={{
              id: currentRow?.assetsId,
            }}
            columns={columns as ProDescriptionsItemProps<Assets>[]}
          />
        )}
      </Drawer>
    </PageContainer>
  );
};

export default TableList;
