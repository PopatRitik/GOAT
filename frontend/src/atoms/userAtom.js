import { atom } from "recoil";

const getUserFromLocalStorage = () => {
  const user = localStorage.getItem("user-goat");
  return user ? JSON.parse(user) : null;
};

const userAtom = atom({
  key: "userAtom",
  default: getUserFromLocalStorage(),
});

export default userAtom;
