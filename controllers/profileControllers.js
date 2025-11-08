import { User } from "../models/userModel.js";

export const fetchMe = async (req, res) => {
  try {
    const { id } = req.user;
    const user = await User.findById(id);

    res.status(200).json(user);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
