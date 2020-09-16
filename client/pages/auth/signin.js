import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers";
import Router from "next/router";
import { useToasts } from "react-toast-notifications";
import * as yup from "yup";
import FormInput from "../../components/form-input";
import useRequest from "../../hooks/use-request";

const schema = yup.object().shape({
  email: yup.string().required().email(),
  password: yup.string().required().min(4),
});

const Signin = () => {
  const { addToast } = useToasts();

  const { register, handleSubmit, errors } = useForm({
    resolver: yupResolver(schema),
  });
  const [doRequest] = useRequest({
    url: "/api/users/signin",
    method: "post",
    onSuccess: () => {
      Router.push("/");
      addToast("WELCOME TO TICKETING", {
        appearance: "success",
        autoDismiss: true,
      });
    },
  });

  const onSubmit = async (data) => {
    doRequest(data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <h1>Sign In</h1>
      <FormInput
        name="email"
        label="Email adress"
        defaultValue="test@test.com"
        reference={register}
        errors={errors}
      />
      <FormInput
        name="password"
        label="Password"
        type="password"
        reference={register}
        errors={errors}
      />
      <button className="btn btn-primary">Sign In</button>
    </form>
  );
};

export default Signin;
