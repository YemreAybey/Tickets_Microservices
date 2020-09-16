import { useEffect } from "react";
import Router from "next/router";
import { useToasts } from "react-toast-notifications";
import useRequest from "../../hooks/use-request";

const Signout = () => {
  const { addToast } = useToasts();

  const [doRequest] = useRequest({
    url: "/api/users/signout",
    method: "post",
    onSuccess: () => {
      Router.push("/auth/signin");
      addToast("Signed Out", {
        appearance: "success",
        autoDismiss: true,
      });
    },
  });

  useEffect(() => {
    doRequest({});
  }, []);

  return <div>Signing you out</div>;
};

export default Signout;
