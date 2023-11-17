import {PlusOutlined, UserOutlined} from '@ant-design/icons';
import type {ActionType, ProColumns, ProDescriptionsItemProps, ProFormInstance} from '@ant-design/pro-components';
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
import {AutoComplete, Button, Drawer, Input, InputNumber, message} from 'antd';
import React, {useEffect, useRef, useState} from 'react';
import type {Expenses, ExpensesPagination} from '../data';
import {
    selectExpenses,
    getExpensesCollection,
    deleteExpenses,
    updateExpenses,
    insertExpenses
} from '@/pages/Bills/Expenses/service';
import {useIntl} from "@@/exports";
import type {FormValueType} from '../components/UpdateForm';
import UpdateForm from "../components/UpdateForm";


// const params = {flag: "month"};
// console.log("This is month log");
//
// // 发起请求并获取Promise对象
// const promise = getExpensesCollection(params);
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


/**
 * 添加节点
 *
 * @param fields
 */

const handleAdd = async (fields: Expenses) => {
    const hide = message.loading('正在添加');

    try {
        await insertExpenses({...fields});
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

const handleUpdate = async (fields: FormValueType, currentRow?: Expenses) => {
    const hide = message.loading('正在配置');

    try {
        await updateExpenses({
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

const handleRemove = async (selectedRows: Expenses[]) => {
    const hide = message.loading('正在删除');
    if (!selectedRows || selectedRows.length === 0) return true;

    try {
        for (const row of selectedRows) {
            // 发起删除请求，针对每个收入记录都发起一次请求
            await deleteExpenses({expensesId: row.expensesId});
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
    const [currentRow, setCurrentRow] = useState<Expenses>();
    const [selectedRowsState, setSelectedRows] = useState<Expenses[]>([]);
    const columns: ProColumns<Expenses>[] = [
        {
            title: 'ID',
            sorter: (a, b) => a.expensesId - b.expensesId,
            dataIndex: 'expensesId',
            tip: intl.formatMessage({
                id: 'pages.expenses.subPage.tip',
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
            title: '收入时间',
            sorter: (a, b) => a.expensesTime.localeCompare(b.expensesTime),
            dataIndex: 'expensesTime',
            key: 'showTime',
            valueType: 'date',
            hideInSearch: true,
        },
        {
            title: '收入时间',
            dataIndex: 'expensesTime',
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
            title: '收入金额',
            hideInSearch: true,
            sorter: (a, b) => parseFloat(a.expensesNum) - parseFloat(b.expensesNum),
            dataIndex: 'expensesNum',
        },
        {
            title: '类别',
            // sorter: (a, b) => a.expensesUser.localeCompare(b.expensesUser),
            dataIndex: 'expensesSort',
            // initialValue: 'All',
            filters: true,
            onFilter: true,
            valueEnum: {
                all: {text: 'All-修改'},
                人情: {text: '人情'},
                饮食: {text: '饮食'},
                学习: {text: '学习'},
                设备: {text: '设备'},
                烟酒: {text: '烟酒'},
                交通: {text: '交通'},
                家居: {text: '家居'},
                分红: {text: '分红'},
                工资: {text: '工资'},
                其他: {text: '其他'},
            },
            search: {
                transform: (expensesSort) => {
                    return {
                        expensesSort
                    };
                },
            },

        },
        {
            title: '备注',
            hideInSearch: true,
            // sorter: (a, b) => a.expensesUser.localeCompare(b.expensesUser),
            dataIndex: 'expensesRemark',
        },
        {
            title: '用户',
            // sorter: (a, b) => a.expensesUser.localeCompare(b.expensesUser),
            dataIndex: 'expensesUser',
            renderFormItem: (_, {
                type,
                defaultRender, ...rest
            }, form) => {

                if (type === 'form') {
                    return null;
                }
                // console.log("this is forms")
                // console.log(form)
                // const status = form.getFieldValue('state');
                const status = "Close";
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
                return <AutoComplete
                    popupClassName="certain-category-search-dropdown"
                    style={{width: 250}}
                    options={options}
                />
            }
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
            <ProTable<Expenses, ExpensesPagination>
                headerTitle={intl.formatMessage({
                    id: 'pages.expenses.subPage.tableName',
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
                        <PlusOutlined/> {intl.formatMessage({
                        id: 'pages.expenses.subPage.addNewExpenses',
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
                                expensesTime: [values.startTime, values.endTime],
                            };
                        }
                        return values;
                    },
                }}
                request={selectExpenses}
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
                    const success = await handleAdd(value as Expenses);
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
                    name="expensesNum"
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
                    name="expensesUser"
                />
                <ProFormSelect
                    name="expensesSort"
                    label="类别"
                    valueEnum={{
                        人情: {text: '人情'},
                        饮食: {text: '饮食'},
                        学习: {text: '学习'},
                        设备: {text: '设备'},
                        烟酒: {text: '烟酒'},
                        交通: {text: '交通'},
                        家居: {text: '家居'},
                        分红: {text: '分红'},
                        工资: {text: '工资'},
                        其他: {text: '其他'},
                    }}
                    placeholder="请选择一项类别"
                    width="md"
                    rules={[{required: true, message: '请选择一项类别!'}]}
                />
                <ProFormText
                    label="备注"
                    width="md"
                    name="expensesRemark"
                />
                <ProFormDatePicker
                    name="expensesTime"
                    label="日期"
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
                {currentRow?.expensesId && (
                    <ProDescriptions<Expenses>
                        column={2}
                        title={currentRow?.expensesId}
                        request={async () => ({
                            data: currentRow || {},
                        })}
                        params={{
                            id: currentRow?.expensesId,
                        }}
                        columns={columns as ProDescriptionsItemProps<Expenses>[]}
                    />
                )}
            </Drawer>
        </PageContainer>
    );
};

export default TableList;
