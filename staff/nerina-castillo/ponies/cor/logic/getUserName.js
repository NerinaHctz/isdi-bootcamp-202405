import data from "../data/index.js";
import validate from "../validate.js";

const getUserName = (username, targetUsername, callback) => {
  validate.username(username);
  validate.callback(callback)

  data.findUser((user) => user.username === targetUsername, (error, user) => {
    if(error) {
      callback(new Error(error.message))

      return
    }

    if (!user) {
      callback(new Error("user not found"))
    
      return
    };

  callback(null, user.name);

  });

  
};

export default getUserName;