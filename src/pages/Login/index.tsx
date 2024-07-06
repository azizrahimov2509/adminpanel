import React, { useState, FormEvent, ChangeEvent } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../farebase/config";
import { useNavigate } from "react-router-dom";
import { Form, Input, Button, Row, Col, Typography, Alert } from "antd";

const { Title } = Typography;

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
    <Row style={{ minHeight: "100vh", backgroundColor: "#001f3f" }}>
      <Col
        span={12}
        style={{
          backgroundColor: "#001f3f",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          padding: "48px",
          color: "#fff",
        }}
      >
        <div
          style={{
            maxWidth: "500px",
            width: "100%",
            padding: "24px",
            backgroundColor: "#001529",
            borderRadius: "8px",
            boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
            border: "1px solid #d9d9d9",
            color: "#fff",
          }}
        >
          <Title level={2} style={{ textAlign: "center", color: "#fff" }}>
            Admin Panel
          </Title>
          <Form
            name="login"
            initialValues={{ remember: true }}
            onSubmitCapture={handleLogin}
          >
            <div className="flex items-center justify-center ">
              <div className=" flex flex-col items-end justify-center">
                <Form.Item
                  label={<span style={{ color: "#fff" }}>Email</span>}
                  name="email"
                  rules={[
                    { required: true, message: "Please input your email!" },
                  ]}
                >
                  <Input
                    id="email"
                    type="email"
                    placeholder="Enter your email..."
                    value={loginData.email}
                    onChange={handleChange}
                    className="w-52"
                  />
                </Form.Item>

                <Form.Item
                  label={<span style={{ color: "#fff" }}>Password</span>}
                  name="password"
                  rules={[
                    { required: true, message: "Please input your password!" },
                  ]}
                >
                  <Input.Password
                    id="password"
                    placeholder="Enter your password..."
                    value={loginData.password}
                    onChange={handleChange}
                    className="w-52"
                  />
                </Form.Item>
              </div>
            </div>

            {error && (
              <Alert
                message={error}
                type="error"
                showIcon
                style={{ marginBottom: "16px" }}
              />
            )}

            <Form.Item>
              <Button type="primary" htmlType="submit" block>
                LOGIN
              </Button>
            </Form.Item>
          </Form>
        </div>
      </Col>
      <Col
        span={12}
        style={{
          background: `url('../../../public/Wall-Panels-9.jpg') no-repeat center center`,
          backgroundSize: "cover",
        }}
      />
    </Row>
  );
};

export default Login;
