import React, { useState, FormEvent, ChangeEvent } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../farebase/config";
import { Link, useNavigate } from "react-router-dom";

const Login: React.FC = () => {
  const [loginData, setLoginData] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    signInWithEmailAndPassword(auth, loginData.email, loginData.password)
      .then((userCredential) => {
        const user = userCredential.user;
        const userData = {
          displayName: user.displayName,
          email: user.email,
          photoURL: user.photoURL,
        };
        localStorage.setItem("user", JSON.stringify(userData));
        navigate("/");
      })
      .catch((error) => {
        const errorCode = error.code;
        if (
          errorCode === "auth/wrong-password" ||
          errorCode === "auth/user-not-found"
        ) {
          setError("Incorrect email or password. Please try signing up.");
        } else {
          setError(error.message);
        }
        console.log(error.message);
      });

    setLoginData({ email: "", password: "" });
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setLoginData((prev) => ({ ...prev, [id]: value }));
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-base-200">
      <form
        className="w-[383px] h-[483px] max-w-md p-8 bg-base-100 rounded-lg shadow-lg border border-gray-300"
        onSubmit={handleLogin}
      >
        <h2 className="text-3xl font-bold mb-6 text-center">Login</h2>
        <div className="form-control mb-4">
          <label className="label" htmlFor="email">
            <span className="label-text">Email</span>
          </label>
          <input
            id="email"
            type="email"
            placeholder="Enter your email..."
            className="input input-bordered w-full"
            value={loginData.email}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-control mb-4">
          <label className="label" htmlFor="password">
            <span className="label-text">Password</span>
          </label>
          <input
            id="password"
            type="password"
            placeholder="Enter your password..."
            className="input input-bordered w-full"
            value={loginData.password}
            onChange={handleChange}
            required
          />
        </div>

        {error && <div className="text-red-500 text-sm mb-4">{error}</div>}

        <div className="form-control">
          <button
            type="submit"
            className="btn btn-primary w-full bg-[#057AFF] mb-6"
          >
            LOGIN
          </button>
        </div>

        <div className="form-control">
          <button
            type="button"
            className="btn btn-primary w-full bg-[#463AA1]"
            onClick={() => navigate("/guest")}
          >
            GUEST USER
          </button>
        </div>

        <div className="text-center mt-4">
          <p className="text-sm">
            Not a member yet?
            <Link to="/signUp" className="link link-primary ml-1">
              Register
            </Link>
          </p>
        </div>
      </form>
    </div>
  );
};

export default Login;
