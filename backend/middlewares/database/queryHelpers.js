import CustomError from "../../helpers/error/CustomError.js";
import User from "../../models/User.js";

export const isUserExist = async (req, res, next) => {
  const { username } = req.body;
  try {
    const user = await User.findOne({ where: { username: username } });
    if (!user) {
      return next(new CustomError(500, "There is no user with that username"));
    }
  } catch (err) {
    return next(err);
  }
  return next();
};
