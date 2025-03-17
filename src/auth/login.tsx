import { EyeInvisibleOutlined, EyeTwoTone } from "@ant-design/icons";
import { Checkbox, CheckboxProps, Input, Radio } from "antd";
import { useState } from "react";
import Logo from "../assets/Logo/logo.png";
import { AppDispatch } from "../store/store";

import { useDispatch } from "react-redux";
import { signInAdmin, signInSalon, signInStore } from "../api/auth/api";

const options = [
  { label: "Admin", value: 1 },
  { label: "Saloon", value: 2 },
  { label: "Ecommerce", value: 3 },
];

interface Credentials {
  category: number;
  userName: string;
  password: string;
  rememberMe: boolean;
}

const Login = () => {
  const dispatch = useDispatch<AppDispatch>();
  const [loginCredentials, setLoginCredentials] = useState<Credentials>({
    category: 1,
    userName: "",
    password: "",
    rememberMe: false,
  });

  const handleChange = (name: string, value: string | boolean | number) => {
    setLoginCredentials((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const onChange: CheckboxProps["onChange"] = (e) => {
    console.log(`checked = ${e.target.checked}`);
    setLoginCredentials((prev) => ({
      ...prev,
      rememberMe: !prev.rememberMe,
    }));
  };

  const HandleLogin = () => {
    if (loginCredentials.category === 1) {
      dispatch(
        signInAdmin({
          email: loginCredentials.userName,
          password: loginCredentials.password,
        })
      );
    }
    if (loginCredentials.category === 2) {
      dispatch(
        signInSalon({
          email: loginCredentials.userName,
          password: loginCredentials.password,
        })
      );
    }
    if (loginCredentials.category === 3) {
      dispatch(
        signInStore({
          email: loginCredentials.userName,
          password: loginCredentials.password,
        })
      );
    }

  };
  return (
    <div className="w-[100vw] h-[100vh] bg-[#F5F5F9] flex justify-center items-center ">
      <div className="w-[450px] shadow-xl gap-6 max-sm:gap-8 max-sm:w-max h-max max-sm:h-max flex flex-col bg-white p-10  rounded-lg">
        <div className="w-[100%] flex items-center justify-center">
          <img src={Logo} width={"200px"} height={"200px"} />
        </div>

        <div className="">
          <Radio.Group
            block
            options={options}
            defaultValue={1}
            optionType="button"
            buttonStyle="solid"
            onChange={(e) => handleChange("category", e.target.value)}
          />
        </div>
        <div>
          <h1 className=" font-roboto text-[1.5rem] ">Welocme to Glimmer</h1>
          <h2 className="font-roboto text-[1rem] text-[#646E78]">
            Please Sign-in
          </h2>
        </div>
        <div>
          <p className="text-[0.8rem]">Email or Username</p>
          <Input
            placeholder="User Name"
            value={loginCredentials.userName}
            onChange={(e) => handleChange("userName", e.target.value)}
          />
        </div>

        <div>
          <p className="text-[0.8rem]">password</p>
          <Input.Password
            placeholder="input password"
            iconRender={(visible) =>
              visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />
            }
            onChange={(e) => handleChange("password", e.target.value)}
            value={loginCredentials.password}
          />
        </div>

        <div className="flex justify-between">
          <span className="flex">
            <Checkbox onChange={onChange} checked={loginCredentials.rememberMe}>
              Remember Me
            </Checkbox>
          </span>

          <p className="text-[#5F61E6]">Forgot Password?</p>
        </div>

        <div className="w-[100%] h-max hover:translate-y-[-1px] hover:transition-all ">
          <button
            onClick={HandleLogin}
            className="w-[100%] bg-[#5F61E6] hover:bg-[#4A4CC9] rounded-lg text-white p-2"
          >
            Login
          </button>
        </div>
      </div>
    </div>
  );
};

export default Login;
