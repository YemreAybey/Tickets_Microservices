import { Controller } from 'react-hook-form';
import MaskedInput from 'react-text-mask';
import createNumberMask from 'text-mask-addons/dist/createNumberMask';

const defaultMaskOptions = {
  prefix: '$',
  suffix: '',
  includeThousandsSeparator: true,
  thousandsSeparatorSymbol: ',',
  allowDecimal: true,
  decimalSymbol: '.',
  decimalLimit: 2, // how many digits allowed after the decimal
  integerLimit: 11, // limit length of integer numbers
  allowNegative: false,
  allowLeadingZeroes: false,
};

const CurrencyInput = ({
  name,
  label,
  defaultValue,
  reference,
  errors,
  mask,
  maskOptions = {},
  control,
}) => {
  const divStyle = {
    borderColor: errors[name] ? 'red' : 'initial',
  };

  const errorStyle = {
    color: 'red',
    fontSize: '11px',
  };

  const currencyMask = createNumberMask({
    ...(mask || defaultMaskOptions),
    ...maskOptions,
  });

  return (
    <div className='form-roup my-2'>
      <label>{label}</label>
      <Controller
        name={name}
        as={
          <MaskedInput
            inputMode='numeric'
            name={name}
            defaultValue={defaultValue || ''}
            ref={reference}
            className='form-control'
            style={divStyle}
            mask={currencyMask}
            type={'text'}
            placeholder='$0.00'
          />
        }
        control={control}
      />
      <span style={errorStyle}>{errors[name]?.message}</span>
    </div>
  );
};

export default CurrencyInput;
