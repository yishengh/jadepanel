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
import type { ClaimsAndDebt } from '../data';

export type FormValueType = {
  target?: string;
  template?: string;
  type?: string;
  time?: string;
  frequency?: string;
} & Partial<ClaimsAndDebt>;

export type UpdateFormProps = {
  onCancel: (flag?: boolean, formVals?: FormValueType) => void;
  onSubmit: (values: FormValueType) => Promise<void>;
  updateModalVisible: boolean;
  values: Partial<ClaimsAndDebt>;
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
          cadNum: props.values.cadNum,
          creditor: props.values.creditor,
          obligor: props.values.obligor,
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
          name="cadNum"
        />

        <ProFormText
          label="creditor"
          rules={[
            {
              required: true,
              message: 'creditor为必填项',
            },
          ]}
          width="md"
          name="creditor"
        />

        <ProFormText
          label="obligor"
          rules={[
            {
              required: true,
              message: 'obligor为必填项',
            },
          ]}
          width="md"
          name="obligor"
        />
      </StepsForm.StepForm>
      <StepsForm.StepForm
        initialValues={{
          cadType: props.values.cadType,
          cadRemark: props.values.cadRemark,
        }}
        title="配置规则属性"
      >
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
        <ProFormText label="备注" width="md" name="cadRemark" />
        <ProFormText label="已偿还" width="md" name="cadRepay" />
      </StepsForm.StepForm>
      <StepsForm.StepForm
        initialValues={{
          cadTime: props.values.cadTime,
        }}
        title="设定调度周期"
      >
        <ProFormDatePicker name="cadTime" label="日期" />
      </StepsForm.StepForm>
    </StepsForm>
  );
};

export default UpdateForm;
