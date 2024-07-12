import data from "../data/index";
import validate from "../validate";

const loginUser = (username, password) => {
  validate.username(username)
  validate.password(password)
  if (username.trim().length < 4) throw new Error("invalid username");

  if (password.trim().length < 8) throw new Error("invalid password");

  const user = data.findUser((user) => user.username === username);

  if (user === null) throw new Error("username does not exist");

  if (user.password !== password) throw new Error("wrong password");

  sessionStorage.username = username;
};

export default loginUser;
