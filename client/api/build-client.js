import axios from "axios";

const request = ({ req }) => {
  if (typeof window === "undefined") {
    return axios.create({
      baseURL:
        "https://ingress-nginx-controller.ingress-nginx.svc.cluster.local",
      headers: req.headers,
    });
  } else {
    return axios.create({
      baseURL: "/",
    });
  }
};

export default request;
