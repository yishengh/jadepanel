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
import type { ClaimsAndDebt, ClaimsAndDebtPagination } from '../data';
import {
  selectClaimsAndDebt,
  getClaimsAndDebtCollection,
  deleteClaimsAndDebt,
  updateClaimsAndDebt,
  insertClaimsAndDebt,
} from '@/pages/Equity/ClaimsAndDebt/service';
import { useIntl } from '@@/exports';
import type { FormValueType } from '../components/UpdateForm';
import UpdateForm from '../components/UpdateForm';

/**
 * 添加节点
 *
 * @param fields
 */

const handleAdd = async (fields: ClaimsAndDebt) => {
  const hide = message.loading('正在添加');

  try {
    await insertClaimsAndDebt({ ...fields });
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

const handleUpdate = async (fields: FormValueType, currentRow?: ClaimsAndDebt) => {
  const hide = message.loading('正在配置');

  try {
    await updateClaimsAndDebt({
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

const handleRemove = async (selectedRows: ClaimsAndDebt[]) => {
  const hide = message.loading('正在删除');
  if (!selectedRows || selectedRows.length === 0) return true;

  try {
    for (const row of selectedRows) {
      // 发起删除请求，针对每个收入记录都发起一次请求
      await deleteClaimsAndDebt({ cadId: row.cadId });
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
  const [currentRow, setCurrentRow] = useState<ClaimsAndDebt>();
  const [selectedRowsState, setSelectedRows] = useState<ClaimsAndDebt[]>([]);
  const columns: ProColumns<ClaimsAndDebt>[] = [
    {
      title: 'ID',
      sorter: (a, b) => a.cadId - b.cadId,
      dataIndex: 'cadId',
      tip: intl.formatMessage({
        id: 'pages.ClaimsAndDebt.subPage.tip',
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
      title: '借贷',
      sorter: (a, b) => a.cadTime.localeCompare(b.cadTime),
      dataIndex: 'cadTime',
      key: 'showTime',
      valueType: 'date',
      hideInSearch: true,
    },
    {
      title: '借贷',
      dataIndex: 'cadTime',
      valueType: 'dateRange',
      hideInTable: true,
      search: {
        transform: (value) => {
          return {
            startTime: value[0],
            endTime: value[1],
          };
        },
      },
    },

    {
      title: '借贷金额',
      hideInSearch: true,
      sorter: (a, b) => parseFloat(a.cadNum) - parseFloat(b.cadNum),
      dataIndex: 'cadNum',
    },

    {
      title: '类别',
      dataIndex: 'cadType',
      // initialValue: 'All',
      filters: true,
      onFilter: true,
      valueEnum: {
        借入: { text: '借入' },
        借出: { text: '借出' },
      },
      search: {
        transform: (cadType) => {
          return {
            cadType,
          };
        },
      },
    },

    {
      title: '债权人',
      hideInSearch: true,
      dataIndex: 'creditor',
    },

    {
      title: '债务人',
      hideInSearch: true,
      dataIndex: 'obligor',
    },

    {
      title: '已偿还金额',
      hideInSearch: true,
      dataIndex: 'cadRepay',
    },

    {
      title: '备注',
      hideInSearch: true,
      dataIndex: 'cadRemark',
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
      <ProTable<ClaimsAndDebt, ClaimsAndDebtPagination>
        headerTitle={intl.formatMessage({
          id: 'pages.ClaimsAndDebt.subPage.tableName',
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
              id: 'pages.ClaimsAndDebt.subPage.addNewClaimsAndDebt',
              defaultMessage: '添加新项目',
            })}
          </Button>,
        ]}
        form={{
          // 由于配置了 transform，提交的参与与定义的不同这里需要转化一下
          syncToUrl: (values, type) => {
            if (type === 'get') {
              return {
                ...values,
                cadTime: [values.startTime, values.endTime],
              };
            }
            return values;
          },
        }}
        request={selectClaimsAndDebt}
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
        title="新建借贷"
        width="400px"
        open={createModalVisible}
        onOpenChange={handleModalVisible}
        onFinish={async (value) => {
          const success = await handleAdd(value as ClaimsAndDebt);
          if (success) {
            handleModalVisible(false);
            if (actionRef.current) {
              actionRef.current.reload();
            }
          }
        }}
      >
        <ProFormDigit
          label="金额"
          rules={[
            {
              required: true,
              message: '金额为必填项',
            },
          ]}
          width="md"
          name="cadNum"
        />

        <ProFormSelect
          name="cadType"
          label="类别"
          valueEnum={{
            借入: { text: '借入' },
            借出: { text: '借出' },
          }}
          placeholder="请选择一项类别"
          width="md"
          rules={[{ required: true, message: '请选择一项类别!' }]}
        />

        <ProFormText
          label="债权人"
          rules={[
            {
              required: true,
              message: '债权人为必填项',
            },
          ]}
          width="md"
          name="creditor"
        />

        <ProFormText
          label="债务人"
          rules={[
            {
              required: true,
              message: '债务人为必填项',
            },
          ]}
          width="md"
          name="obligor"
        />

        <ProFormText label="备注" width="md" name="cadRemark" />
        <ProFormText label="已偿还" width="md" name="cadRepay" />
        <ProFormDatePicker name="cadTime" label="日期" />
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
        {currentRow?.cadId && (
          <ProDescriptions<ClaimsAndDebt>
            column={2}
            title={currentRow?.cadId}
            request={async () => ({
              data: currentRow || {},
            })}
            params={{
              id: currentRow?.cadId,
            }}
            columns={columns as ProDescriptionsItemProps<ClaimsAndDebt>[]}
          />
        )}
      </Drawer>
    </PageContainer>
  );
};

export default TableList;
