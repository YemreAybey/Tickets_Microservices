import axios from 'axios';
import { useToasts } from 'react-toast-notifications';

const useRequest = ({ url, method, onSuccess }) => {
  const { addToast } = useToasts();

  const doRequest = async data => {
    try {
      const res = await axios[method](url, data);
      if (onSuccess) {
        onSuccess(res.data);
      }
      return res.data;
    } catch (err) {
      console.log(err);
      err.response.data.errors.forEach(e => {
        addToast(e.message, {
          appearance: 'error',
          autoDismiss: true,
        });
      });
    }
  };

  return [doRequest];
};

export default useRequest;
