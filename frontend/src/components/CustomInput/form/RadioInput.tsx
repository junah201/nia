import {
  FormControl,
  FormDescription,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { InputProps } from '@/constants/form';

export const RadioInput = ({
  name,
  label,
  value,
  onChange,
  errorMessage,
  helperText,
  disabled,
  options = [],
}: InputProps) => {
  return (
    <FormItem>
      <FormLabel htmlFor={name}>{label}</FormLabel>
      <FormControl>
        <RadioGroup
          onValueChange={onChange}
          defaultValue={value}
          className="flex flex-col sm:flex-row space-y-1 flex-wrap sm:space-x-3"
          disabled={disabled}
        >
          {options.map((option) => (
            <FormItem
              key={option.value}
              className="flex items-center space-x-3 space-y-0"
            >
              <FormControl>
                <RadioGroupItem value={option.value} />
              </FormControl>
              <FormLabel className="font-normal">{option.label}</FormLabel>
            </FormItem>
          ))}
        </RadioGroup>
      </FormControl>
      {errorMessage ? (
        <FormMessage>{errorMessage}</FormMessage>
      ) : (
        <FormDescription>{helperText}</FormDescription>
      )}
    </FormItem>
  );
};

export default RadioInput;
