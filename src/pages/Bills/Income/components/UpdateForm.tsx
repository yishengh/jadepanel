import {
    ProFormDatePicker,
    ProFormDateTimePicker, ProFormDigit,
    ProFormRadio,
    ProFormSelect,
    ProFormText,
    ProFormTextArea,
    StepsForm,
} from '@ant-design/pro-components';
import { Modal } from 'antd';
import React from 'react';
import type { Income } from '../data';

export type FormValueType = {
    target?: string;
    template?: string;
    type?: string;
    time?: string;
    frequency?: string;
} & Partial<Income>;

export type UpdateFormProps = {
    onCancel: (flag?: boolean, formVals?: FormValueType) => void;
    onSubmit: (values: FormValueType) => Promise<void>;
    updateModalVisible: boolean;
    values: Partial<Income>;
};

const UpdateForm: React.FC<UpdateFormProps> = (props) => {
    return (
        <StepsForm
            stepsProps={{
                size: 'small',
            }}
            stepsFormRender={(dom, submitter) => {
                return (
                    <Modal
                        width={640}
                        bodyStyle={{
                            padding: '32px 40px 48px',
                        }}
                        destroyOnClose
                        title="修改收入"
                        open={props.updateModalVisible}
                        footer={submitter}
                        onCancel={() => {
                            props.onCancel();
                        }}
                    >
                        {dom}
                    </Modal>
                );
            }}
            onFinish={props.onSubmit}
        >
            <StepsForm.StepForm
                initialValues={{
                    incomeNum: props.values.incomeNum,
                    incomeUser: props.values.incomeUser,
                }}
                title="基本信息"
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
            </StepsForm.StepForm>
            <StepsForm.StepForm
                initialValues={{
                    incomeSort: props.values.incomeSort,
                    incomeRemark: props.values.incomeRemark,
                }}
                title="配置规则属性"
            >
                <ProFormSelect
                    name="incomeSort"
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
                    rules={[{ required: true, message: '请选择一项类别!' }]}
                />
                <ProFormText
                    label="备注"
                    width="md"
                    name="incomeRemark"
                />
            </StepsForm.StepForm>
            <StepsForm.StepForm
                initialValues={{
                    incomeTime: props.values.incomeTime,
                }}
                title="设定调度周期"
            >
                <ProFormDatePicker
                    name="incomeTime"
                    label="日期"
                />
            </StepsForm.StepForm>
        </StepsForm>
    );
};

export default UpdateForm;
