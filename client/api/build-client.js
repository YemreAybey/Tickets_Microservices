import axios from "axios";

const request = ({ req }) => {
  if (typeof window === "undefined") {
    return axios.create({
      baseURL: process.env.BASE_URL,
      headers: req.headers,
    });
  } else {
    return axios.create({
      baseURL: "/",
    });
  }
};

export default request;
