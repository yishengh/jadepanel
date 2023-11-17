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
import type { Assets } from '../data';

export type FormValueType = {
  target?: string;
  template?: string;
  type?: string;
  time?: string;
  frequency?: string;
} & Partial<Assets>;

export type UpdateFormProps = {
  onCancel: (flag?: boolean, formVals?: FormValueType) => void;
  onSubmit: (values: FormValueType) => Promise<void>;
  updateModalVisible: boolean;
  values: Partial<Assets>;
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
          assetsName: props.values.assetsName,
          assetsOwner: props.values.assetsOwner,
          assetsLocation: props.values.assetsLocation,
          totalPrice: props.values.totalPrice,
          historicalValue: props.values.historicalValue,
        }}
        title="基本信息"
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
        <ProFormText
          label="assetsLocation"
          rules={[
            {
              required: true,
              message: '名称为必填项',
            },
          ]}
          width="md"
          name="assetsLocation"
        />
        <ProFormDigit
          label="totalPrice"
          rules={[
            {
              required: true,
              message: '名称为必填项',
            },
          ]}
          width="md"
          name="totalPrice"
        />

        <ProFormDigit
          label="historicalValue"
          rules={[
            {
              required: true,
              message: '名称为必填项',
            },
          ]}
          width="md"
          name="historicalValue"
        />
      </StepsForm.StepForm>
      <StepsForm.StepForm
        initialValues={{
          assetsInstalment: props.values.assetsInstalment,
          instalmentPrice: props.values.instalmentPrice,
          instalmentSurplus: props.values.instalmentSurplus,
          realizationValue: props.values.realizationValue,
        }}
        title="配置规则属性"
      >
        <ProFormDigit
          label="assetsInstalment"
          rules={[
            {
              required: true,
              message: '名称为必填项',
            },
          ]}
          width="md"
          name="assetsInstalment"
        />
        <ProFormDigit
          label="instalmentPrice"
          rules={[
            {
              required: true,
              message: '名称为必填项',
            },
          ]}
          width="md"
          name="instalmentPrice"
        />
        <ProFormDigit
          label="instalmentSurplus"
          rules={[
            {
              required: true,
              message: '名称为必填项',
            },
          ]}
          width="md"
          name="instalmentSurplus"
        />
        <ProFormDigit
          label="realizationValue"
          rules={[
            {
              required: true,
              message: '名称为必填项',
            },
          ]}
          width="md"
          name="realizationValue"
        />
      </StepsForm.StepForm>
      <StepsForm.StepForm
        initialValues={{
          assetsRemark: props.values.assetsRemark,
          assetsCreateTime: props.values.assetsCreateTime,
        }}
        title="设定调度周期"
      >
        <ProFormText name="assetsRemark" label="日期" />
        <ProFormDatePicker name="assetsCreateTime" label="日期" />
      </StepsForm.StepForm>
    </StepsForm>
  );
};

export default UpdateForm;
