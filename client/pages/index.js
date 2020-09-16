import request from "../api/build-client";
const Index = ({ currentUser }) => {
  return currentUser ? <h1>WELCOME</h1> : <h1>SIGNED OUT</h1>;
};

Index.getInitialProps = async (context) => {
  const req = request(context);
  const { data } = await req.get("/api/users/currentuser");

  return data;
};

export default Index;
