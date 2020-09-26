import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers';
import Router from 'next/router';
import { useToasts } from 'react-toast-notifications';
import * as yup from 'yup';
import FormInput from '../../components/form-input';
import useRequest from '../../hooks/use-request';
import CurrencyInput from '../../components/currency-input';
import { removeCurrencyMask } from '../../utils/string/mask-functions';

const schema = yup.object().shape({
  title: yup.string().required(),
  price: yup
    .string()
    .required()
    .test(
      'isBiggerThanZero',
      'Price must be bigger than 0',
      value => removeCurrencyMask(value) > 0
    ),
});

const NewTicket = () => {
  const { addToast } = useToasts();

  const { register, handleSubmit, errors, control, setValue } = useForm({
    resolver: yupResolver(schema),
  });
  const [doRequest] = useRequest({
    url: '/api/tickets',
    method: 'post',
    onSuccess: () => {
      Router.push('/');
      addToast('Ticket Created', {
        appearance: 'success',
        autoDismiss: true,
      });
    },
  });

  const onSubmit = async data => {
    doRequest({ title: data.title, price: removeCurrencyMask(data.price) });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <h1>Create a Ticket</h1>
      <FormInput
        name='title'
        placeholder='Enter a title'
        label='Title'
        reference={register}
        errors={errors}
      />
      <CurrencyInput
        name='price'
        label='Price'
        reference={register}
        errors={errors}
        control={control}
      />
      <button className='btn btn-primary'>Create Ticket</button>
    </form>
  );
};

export default NewTicket;
