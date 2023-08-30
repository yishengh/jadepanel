import {PlusOutlined} from '@ant-design/icons';
import type {ActionType, ProColumns, ProDescriptionsItemProps} from '@ant-design/pro-components';
import {
  FooterToolbar,
  ModalForm,
  PageContainer,
  ProDescriptions,
  ProFormText,
  ProFormTextArea,
  ProTable,
} from '@ant-design/pro-components';
import {Button, Drawer, Input, message} from 'antd';
import React, {useRef, useState} from 'react';
import type {Income, IncomePagination} from '../data';
import {selectIncome, getIncomeCollection} from '@/pages/Bills/Income/service';



const params = { flag: "month" };
console.log("This is month log");

// 发起请求并获取Promise对象
const promise = getIncomeCollection(params);

// 在Promise对象解决（成功）时，处理数据并进行日志记录
promise
  .then(response => {
    console.log("This is done month log");
    console.log(response);
  })
  .catch(error => {
    // 处理错误
    console.error(error);
  });

const TableList: React.FC = () => {
  const [createModalVisible, handleModalVisible] = useState<boolean>(false);
  const [updateModalVisible, handleUpdateModalVisible] = useState<boolean>(false);
  const [showDetail, setShowDetail] = useState<boolean>(false);
  const actionRef = useRef<ActionType>();
  const [currentRow, setCurrentRow] = useState<Income>();
  const [selectedRowsState, setSelectedRows] = useState<Income[]>([]);
  const columns: ProColumns<Income>[] = [
    {
      title: 'ID',
      dataIndex: 'incomeId',
      tip: '规则名称是唯一的 key',
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
      title: 'User',
      dataIndex: 'incomeUser',
      valueType: 'textarea',
    },
    {
      title: '次数',
      dataIndex: 'incomeNum',
      sorter: true,
      hideInForm: true,
      renderText: (val: string) => `${val}万`,
    },
  ];

  return (
    <PageContainer>
      <ProTable<Income, IncomePagination>
        headerTitle="查询表格"
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
            <PlusOutlined/> 新建
          </Button>,
        ]}
        request={selectIncome}
        columns={columns}
        rowSelection={{
          onChange: (_, selectedRows) => {
            setSelectedRows(selectedRows);
          },
        }}
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
