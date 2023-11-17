import {
  ProFormDatePicker,
  ProFormDateTimePicker,
  ProFormDigit,
  ProFormRadio,
  ProFormSelect,
  ProFormText,
  ProFormTextArea,
  StepsForm,
} from '@ant-design/pro-components';
import { Modal } from 'antd';
import React from 'react';
import type { UserStock } from '../userStock';

export type FormValueType = {
  target?: string;
  template?: string;
  type?: string;
  time?: string;
  frequency?: string;
} & Partial<UserStock>;

export type UpdateFormProps = {
  onCancel: (flag?: boolean, formVals?: FormValueType) => void;
  onSubmit: (values: FormValueType) => Promise<void>;
  updateModalVisible: boolean;
  values: Partial<UserStock>;
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
          stockNum: props.values.stockNum,
          stockName: props.values.stockName,
          stockCode: props.values.stockCode,
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
          name="stockNum"
        />

        <ProFormText
          label="stockName"
          rules={[
            {
              required: true,
              message: 'stockName为必填项',
            },
          ]}
          width="md"
          name="stockName"
        />

        <ProFormText
          label="stockCode"
          rules={[
            {
              required: true,
              message: 'stockCode为必填项',
            },
          ]}
          width="md"
          name="stockCode"
        />
      </StepsForm.StepForm>
      <StepsForm.StepForm
        initialValues={{
          stockType: props.values.stockType,
          stockPrice: props.values.stockPrice,
        }}
        title="配置规则属性"
      >
        <ProFormSelect
          name="stockType"
          label="类别"
          valueEnum={{
            ETF: { text: 'ETF' },
            STOCK: { text: 'STOCK' },
          }}
          placeholder="请选择一项类别"
          width="md"
          rules={[{ required: true, message: '请选择一项类别!' }]}
        />
        <ProFormText label="stockPrice" width="md" name="stockPrice" />
      </StepsForm.StepForm>
      <StepsForm.StepForm
        initialValues={{
          stockTime: props.values.stockTime,
        }}
        title="设定调度周期"
      >
        <ProFormDatePicker name="stockTime" label="日期" />
      </StepsForm.StepForm>
    </StepsForm>
  );
};

export default UpdateForm;
