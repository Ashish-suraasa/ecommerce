type userLoginType = {
  email: string;
  password: string;
};

type userRegisterType = {
  first_name: string;
  last_name: string;
  password: string;
  email: string;
  address: string;
  profile_img: string;
};

type globalUserType = userRegisterType & {
  is_admin: boolean;
  id: string;
};

export { userLoginType, userRegisterType, globalUserType };
