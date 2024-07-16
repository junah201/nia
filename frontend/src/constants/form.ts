import dayjs from 'dayjs';
import { Control, UseFormRegister } from 'react-hook-form';

export interface FormRules<RegisterField = any> {
  required?: string;
  min?: {
    value: number | string;
    message: string;
  };
  max?: {
    value: number | string;
    message: string;
  };
  minLength?: {
    value: number;
    message: string;
  };
  maxLength?: {
    value: number;
    message: string;
  };
  pattern?: {
    value: RegExp;
    message: string;
  };
  validate?: (input: string, values: RegisterField) => boolean | string;
}

export interface Option {
  label: string;
  value: any;
}

export const INPUT_TYPE = Object.freeze({
  TEXT: 'text',
  PASSWORD: 'password',
  NUMBER: 'number',
  DATE: 'date',
  RADIO: 'radio',
  MULTILINE: 'textarea',
  FILE: 'file',
  SELECT: 'select',
  CHECKBOX: 'checkbox',
});

type InputSchema = typeof INPUT_TYPE;
type InputKeys = keyof typeof INPUT_TYPE;
export type InputTypes = InputSchema[InputKeys];

export const INPUT = Object.freeze({
  EMAIL: Object.freeze({
    name: 'email',
    label: '이메일',
    type: INPUT_TYPE.TEXT,
    placeholder: 'nia@gmail.com',
    helperText: '이메일을 입력해주세요.',
    disabled: false,
    rules: {
      required: '이메일을 입력해주세요.',
      pattern: {
        value: /^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/,
        message: '이메일 형식이 올바르지 않습니다.',
      },
    },
  }),
  PASSWORD: Object.freeze({
    name: 'password',
    label: '비밀번호',
    type: INPUT_TYPE.PASSWORD,
    placeholder: '********',
    helperText: '비밀번호를 입력해주세요.',
    disabled: false,
    rules: {
      required: '비밀번호를 입력해주세요.',
      minLength: {
        value: 8,
        message: '비밀번호는 8자 이상이어야 합니다.',
      },
      maxLength: {
        value: 100,
        message: '비밀번호는 100자 이하여야 합니다.',
      },
    },
  }),
  CONFIRM_PASSWORD: Object.freeze({
    name: 'confirm_password',
    label: '비밀번호 확인',
    type: INPUT_TYPE.PASSWORD,
    placeholder: '********',
    helperText: '비밀번호를 다시 입력해주세요.',
    disabled: false,
    rules: {
      required: '비밀번호를 다시 입력해주세요.',
      validate: (input: string, values: Record<string, any>) => {
        const password = values['password'];

        return input === password || '비밀번호가 일치하지 않습니다.';
      },
    },
  }),
  NAME: Object.freeze({
    name: 'name',
    label: '이름',
    type: INPUT_TYPE.TEXT,
    placeholder: '홍길동',
    helperText: '이름을 입력해주세요.',
    disabled: false,
    rules: {
      required: '이름을 입력해주세요.',
    },
  }),
  ORIGINAL_URL: Object.freeze({
    name: 'original_url',
    label: 'URL',
    type: INPUT_TYPE.TEXT,
    placeholder: 'https://www.google.com',
    helperText: 'URL을 입력해주세요.',
    disabled: false,
    rules: {
      required: 'URL을 입력해주세요.',
      // TODO : URL 형식 체크
    },
  }),
  EXPIRED_AT: Object.freeze({
    name: 'expired_at',
    label: '만료일',
    type: INPUT_TYPE.RADIO,
    placeholder: '',
    helperText: '만료일을 선택해주세요.',
    disabled: false,
    options: [
      {
        label: '1주일',
        value: '1 week',
      },
      {
        label: '1개월',
        value: '1 month',
      },
      {
        label: '6개월 (Pro)',
        value: '6 month',
      },
      {
        label: '1년 (Pro)',
        value: '1 year',
      },
      {
        label: '3년 (Pro)',
        value: '3 year',
      },
    ],
    rules: {
      required: '만료일을 선택해주세요.',
    },
  }),
});

export type RegisterTypes = (typeof INPUT)[keyof typeof INPUT]['name'];
export type RegisterField = Record<RegisterTypes, any>;
export type RegisterForm = UseFormRegister<RegisterField>;

interface InputType {
  name: RegisterTypes;
  label: string;
  placeholder: string;
  disabled: boolean;
  helperText: string;
  options?: Option[];
  control: Control<any, any>;
}

export interface FormInputType extends InputType {
  type: InputTypes;
  rules: FormRules;
}

export interface CustomInputProps extends InputType {
  type: InputTypes;
  value: any;
  onChange: (...event: any[]) => void;
  errorMessage?: string | undefined;
}

export interface InputProps extends InputType {
  value: any;
  onChange: (...event: any[]) => void;
  errorMessage?: string | undefined;
}
