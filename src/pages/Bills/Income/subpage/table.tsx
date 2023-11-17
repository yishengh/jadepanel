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
import type { Income, IncomePagination } from '../data';
import {
  selectIncome,
  getIncomeCollection,
  deleteIncome,
  updateIncome,
  insertIncome,
} from '@/pages/Bills/Income/service';
import { useIntl } from '@@/exports';
import type { FormValueType } from '../components/UpdateForm';
import UpdateForm from '../components/UpdateForm';

// const params = {flag: "month"};
// console.log("This is month log");
//
// // 发起请求并获取Promise对象
// const promise = getIncomeCollection(params);
//
// // 在Promise对象解决（成功）时，处理数据并进行日志记录
// promise
//     .then(response => {
//         console.log("This is done month log");
//         console.log(response);
//     })
//     .catch(error => {
//         // 处理错误
//         console.error(error);
//     });

const TableList: React.FC = () => {
  /**
   * 添加节点
   *
   * @param fields
   */

  const handleAdd = async (fields: Income) => {
    const hide = message.loading(intl.formatMessage({ id: 'pages.income.incomeTable.adding' }));

    try {
      await insertIncome({ ...fields });
      hide();
      message.success(intl.formatMessage({ id: 'pages.income.incomeTable.addSuccess' }));
      return true;
    } catch (error) {
      hide();
      message.error(intl.formatMessage({ id: 'pages.income.incomeTable.addFailure' }));
      return false;
    }
  };

  /**
   * 更新节点
   *
   * @param fields
   */

  const handleUpdate = async (fields: FormValueType, currentRow?: Income) => {
    const hide = message.loading(
      intl.formatMessage({ id: 'pages.income.incomeTable.configuring' }),
    );

    try {
      await updateIncome({
        ...currentRow,
        ...fields,
      });
      hide();
      message.success(intl.formatMessage({ id: 'pages.income.incomeTable.configSuccess' }));
      return true;
    } catch (error) {
      hide();
      message.error(intl.formatMessage({ id: 'pages.income.incomeTable.configFailure' }));
      return false;
    }
  };

  /**
   * 删除节点
   *
   * @param selectedRows
   */

  const handleRemove = async (selectedRows: Income[]) => {
    const hide = message.loading(intl.formatMessage({ id: 'pages.income.incomeTable.deleting' }));
    if (!selectedRows || selectedRows.length === 0) return true;

    try {
      for (const row of selectedRows) {
        await deleteIncome({ incomeId: row.incomeId });
      }
      hide();
      message.success(intl.formatMessage({ id: 'pages.income.incomeTable.deleteSuccess' }));
      return true;
    } catch (error) {
      hide();
      message.error(intl.formatMessage({ id: 'pages.income.incomeTable.deleteFailure' }));
      return false;
    }
  };

  const intl = useIntl();
  const [createModalVisible, handleModalVisible] = useState<boolean>(false);
  const [updateModalVisible, handleUpdateModalVisible] = useState<boolean>(false);
  const [showDetail, setShowDetail] = useState<boolean>(false);
  const actionRef = useRef<ActionType>();
  const [currentRow, setCurrentRow] = useState<Income>();
  const [selectedRowsState, setSelectedRows] = useState<Income[]>([]);
  const columns: ProColumns<Income>[] = [
    {
      title: intl.formatMessage({
        id: 'pages.income.incomeTable.columns.id',
        defaultMessage: 'ID',
      }),
      sorter: (a, b) => a.incomeId - b.incomeId,
      dataIndex: 'incomeId',
      tip: intl.formatMessage({
        id: 'pages.income.incomeTable.tip',
        defaultMessage: 'Table unique key',
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
      title: intl.formatMessage({
        id: 'pages.income.incomeTable.columns.incomeTime',
        defaultMessage: 'Income Time',
      }),
      sorter: (a, b) => a.incomeTime.localeCompare(b.incomeTime),
      dataIndex: 'incomeTime',
      key: 'showTime',
      valueType: 'date',
      hideInSearch: true,
    },
    {
      title: intl.formatMessage({
        id: 'pages.income.incomeTable.columns.incomeTime',
        defaultMessage: 'Income Time',
      }),
      dataIndex: 'incomeTime',
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
      title: intl.formatMessage({
        id: 'pages.income.incomeTable.columns.incomeAmount',
        defaultMessage: 'Income Amount',
      }),
      hideInSearch: true,
      sorter: (a, b) => parseFloat(a.incomeNum) - parseFloat(b.incomeNum),
      dataIndex: 'incomeNum',
    },
    {
      title: intl.formatMessage({
        id: 'pages.income.incomeTable.columns.category',
        defaultMessage: 'Category',
      }),
      dataIndex: 'incomeSort',
      filters: true,
      onFilter: true,
      valueEnum: {
        all: {
          text: intl.formatMessage({
            id: 'pages.income.incomeTable.columns.categoryAll',
            defaultMessage: 'All-Modified',
          }),
        },
        人情: {
          text: intl.formatMessage({
            id: 'pages.income.incomeTable.columns.categoryPersonal',
            defaultMessage: 'Personal',
          }),
        },
        饮食: {
          text: intl.formatMessage({
            id: 'pages.income.incomeTable.columns.categoryDining',
            defaultMessage: 'Dining',
          }),
        },
        学习: {
          text: intl.formatMessage({
            id: 'pages.income.incomeTable.columns.categoryStudy',
            defaultMessage: 'Study',
          }),
        },
        设备: {
          text: intl.formatMessage({
            id: 'pages.income.incomeTable.columns.categoryEquipment',
            defaultMessage: 'Equipment',
          }),
        },
        烟酒: {
          text: intl.formatMessage({
            id: 'pages.income.incomeTable.columns.categoryTobaccoAlcohol',
            defaultMessage: 'Tobacco & Alcohol',
          }),
        },
        交通: {
          text: intl.formatMessage({
            id: 'pages.income.incomeTable.columns.categoryTransportation',
            defaultMessage: 'Transportation',
          }),
        },
        家居: {
          text: intl.formatMessage({
            id: 'pages.income.incomeTable.columns.categoryHome',
            defaultMessage: 'Home',
          }),
        },
        分红: {
          text: intl.formatMessage({
            id: 'pages.income.incomeTable.columns.categoryDividend',
            defaultMessage: 'Dividend',
          }),
        },
        工资: {
          text: intl.formatMessage({
            id: 'pages.income.incomeTable.columns.categorySalary',
            defaultMessage: 'Salary',
          }),
        },
        其他: {
          text: intl.formatMessage({
            id: 'pages.income.incomeTable.columns.categoryOther',
            defaultMessage: 'Other',
          }),
        },
      },
      search: {
        transform: (incomeSort) => {
          return {
            incomeSort,
          };
        },
      },
    },
    {
      title: intl.formatMessage({
        id: 'pages.income.incomeTable.columns.remark',
        defaultMessage: 'Remark',
      }),
      hideInSearch: true,
      // sorter: (a, b) => a.incomeUser.localeCompare(b.incomeUser),
      dataIndex: 'incomeRemark',
    },
    {
      title: intl.formatMessage({
        id: 'pages.income.incomeTable.columns.user',
        defaultMessage: 'User',
      }),
      // sorter: (a, b) => a.incomeUser.localeCompare(b.incomeUser),
      dataIndex: 'incomeUser',
      renderFormItem: (_, { type, defaultRender, ...rest }, form) => {
        if (type === 'form') {
          return null;
        }
        // console.log("this is forms")
        // console.log(form)
        // const status = form.getFieldValue('state');
        const status = 'Close';
        const renderTitle = (title: string) => (
          <span>
            {title}
            {/*<a*/}
            {/*    style={{float: 'right'}}*/}
            {/*    href="https://www.google.com/search?q=antd"*/}
            {/*    target="_blank"*/}
            {/*    rel="noopener noreferrer"*/}
            {/*>*/}
            {/*    more*/}
            {/*</a>*/}
          </span>
        );

        const renderItem = (title: string, count: number) => ({
          value: title,
          label: (
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
              }}
            >
              {title}
              {/*<span>*/}
              {/*    <UserOutlined/> {count}*/}
              {/*</span>*/}
            </div>
          ),
        });
        const options = [
          {
            label: renderTitle('Admin'),
            options: [renderItem('Yisheng', 10000), renderItem('Huang', 10600)],
          },
          {
            label: renderTitle('User'),
            options: [renderItem('SpiderMan', 10000), renderItem('IronMan', 10600)],
          },
        ];
        return (
          <AutoComplete
            popupClassName="certain-category-search-dropdown"
            style={{ width: 250 }}
            options={options}
          />
        );
      },
    },

    {
      title: intl.formatMessage({
        id: 'pages.income.incomeTable.columns.option',
        defaultMessage: 'Option',
      }),
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
            {intl.formatMessage({
              id: 'pages.income.incomeTable.updateButton',
              defaultMessage: '修改',
            })}
          </Button>

          <Button
            type="link"
            onClick={() => {
              handleRemove([record]);
              actionRef.current?.reloadAndRest?.();
            }}
          >
            {intl.formatMessage({
              id: 'pages.income.incomeTable.deleteButton',
              defaultMessage: '删除',
            })}
          </Button>
        </span>
      ),
    },
  ];

  return (
    <PageContainer>
      <ProTable<Income, IncomePagination>
        headerTitle={intl.formatMessage({
          id: 'pages.income.subPage.tableName',
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
              id: 'pages.income.subPage.addNewIncome',
              defaultMessage: '添加新收入',
            })}
          </Button>,
        ]}
        form={{
          // 由于配置了 transform，提交的参与与定义的不同这里需要转化一下
          syncToUrl: (values, type) => {
            if (type === 'get') {
              return {
                ...values,
                incomeTime: [values.startTime, values.endTime],
              };
            }
            return values;
          },
        }}
        request={selectIncome}
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
        title="新建收入"
        width="400px"
        open={createModalVisible}
        onOpenChange={handleModalVisible}
        onFinish={async (value) => {
          const success = await handleAdd(value as Income);
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
          name="incomeNum"
        />

        <ProFormText
          label="User"
          rules={[
            {
              required: true,
              message: 'User为必填项',
            },
          ]}
          width="md"
          name="incomeUser"
        />
        <ProFormSelect
          name="incomeSort"
          label="类别"
          valueEnum={{
            人情: { text: '人情' },
            饮食: { text: '饮食' },
            学习: { text: '学习' },
            设备: { text: '设备' },
            烟酒: { text: '烟酒' },
            交通: { text: '交通' },
            家居: { text: '家居' },
            分红: { text: '分红' },
            工资: { text: '工资' },
            其他: { text: '其他' },
          }}
          placeholder="请选择一项类别"
          width="md"
          rules={[{ required: true, message: '请选择一项类别!' }]}
        />
        <ProFormText label="备注" width="md" name="incomeRemark" />
        <ProFormDatePicker name="incomeTime" label="日期" />
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
        {currentRow?.incomeId && (
          <ProDescriptions<Income>
            column={2}
            title={currentRow?.incomeId}
            request={async () => ({
              data: currentRow || {},
            })}
            params={{
              id: currentRow?.incomeId,
            }}
            columns={columns as ProDescriptionsItemProps<Income>[]}
          />
        )}
      </Drawer>
    </PageContainer>
  );
};

export default TableList;
