import axios from "axios";

const request = ({ req }) => {
  if (typeof window === "undefined") {
    return axios.create({
      baseURL: "https://www.ticketing-emre-aybey-prod.xyz",
      headers: req.headers,
    });
  } else {
    return axios.create({
      baseURL: "/",
    });
  }
};

export default request;

// http://ingress-nginx-controller.ingress-nginx.svc.cluster.local