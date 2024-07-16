import {
  FormControl,
  FormDescription,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { InputProps } from '@/constants/form';

export const TextInput = ({
  name,
  label,
  placeholder,
  value,
  onChange,
  errorMessage,
  helperText,
  disabled,
}: InputProps) => {
  return (
    <FormItem>
      <FormLabel aria-label={`${name} Label`} htmlFor={name}>
        {label}
      </FormLabel>
      <FormControl>
        <Input
          aria-label={`${name} Input`}
          placeholder={placeholder}
          disabled={disabled}
          value={value}
          onChange={onChange}
        />
      </FormControl>
      {errorMessage ? (
        <FormMessage aria-label={`${name} Error Message`}>
          {errorMessage}
        </FormMessage>
      ) : (
        <FormDescription aria-label={`${name} Description`}>
          {helperText}
        </FormDescription>
      )}
    </FormItem>
  );
};

export default TextInput;
