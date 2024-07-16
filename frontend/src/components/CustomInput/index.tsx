import { useController, Control } from 'react-hook-form';

import { RadioInput, TextInput } from './form';

import {
  FormRules,
  Option,
  InputTypes,
  INPUT_TYPE,
  RegisterTypes,
  CustomInputProps,
  FormInputType,
} from '@/constants/form';

export const BasicInput = ({ ...props }: CustomInputProps) => {
  const content = (inputType: InputTypes) => {
    switch (inputType) {
      case INPUT_TYPE.TEXT:
        return <TextInput {...props} />;
      case INPUT_TYPE.RADIO:
        return <RadioInput {...props} />;
      default:
        return <></>;
    }
  };

  return content(props.type);
};

export const CustomInput = ({ ...props }: FormInputType) => {
  const { name, rules, control } = props;

  const {
    field: { value, onChange },
    fieldState: { error },
  } = useController({
    name,
    rules,
    control,
  });

  const label = `${props.label} ${rules?.required ? '*' : ''}`;

  return (
    <BasicInput
      {...props}
      label={label}
      value={value}
      onChange={onChange}
      errorMessage={error?.message}
    />
  );
};
