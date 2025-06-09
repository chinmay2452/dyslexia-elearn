import React, { useState } from "react";
import { Card, CardContent } from "../components/card";
import { Input } from "../components/input";
import { Button } from "../components/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/tabs";
import { useNavigate } from "react-router-dom";
import logo from "../assets/learn-bright-logo.svg";

const AuthPage: React.FC = () => {
  const navigate = useNavigate();
  const [tab, setTab] = useState("login");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [showLoginPassword, setShowLoginPassword] = useState(false);
  const [showSignupPassword, setShowSignupPassword] = useState(false);

  const [loginData, setLoginData] = useState({ email: "", password: "" });

  const [signupData, setSignupData] = useState({
    fullName: "",
    email: "",
    password: "",
    age: "",
    guardianName: ""
  });

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const res = await fetch("http://localhost:5000/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: signupData.fullName,
          email: signupData.email,
          password: signupData.password,
          role: "student",
          age: signupData.age,
          guardianName: signupData.guardianName
        })
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Signup failed");

      localStorage.setItem("token", data.token);
      navigate("/dyslexia-test");
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const res = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(loginData)
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Login failed");

      // Store token and user data
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));

      // Check if user has already taken the test
      const scoreRes = await fetch("http://localhost:5000/api/auth/dyslexia-score", {
        headers: {
          'Authorization': `Bearer ${data.token}`
        }
      });

      if (scoreRes.ok) {
        const scoreData = await scoreRes.json();
        if (scoreData.score !== null) {
          // User has already taken the test, redirect to dashboard
          navigate("/dashboard");
          return;
        }
      }

      // User hasn't taken the test yet, redirect to test
      navigate("/dyslexia-test");
    } catch (err: any) {
      setError(err.message);
      // Clear any existing token/user data on error
      localStorage.removeItem("token");
      localStorage.removeItem("user");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FFF9F2] flex flex-col items-center justify-center px-4">
      <div className="w-full max-w-md mb-8">
        <img src={logo} alt="Learn Bright Logo" className="w-full max-w-[300px] mx-auto" />
      </div>

      {error && (
        <div className="w-full max-w-md mb-4 p-4 bg-red-100 text-red-700 rounded-xl">
          {error}
        </div>
      )}

      <Tabs value={tab} onValueChange={setTab} className="w-full max-w-md">
        <TabsList className="grid w-full grid-cols-2 rounded-xl bg-[#ECECEC]">
          <TabsTrigger value="login" className="rounded-xl data-[state=active]:bg-[#A38BFE] data-[state=active]:text-white">Login</TabsTrigger>
          <TabsTrigger value="signup" className="rounded-xl data-[state=active]:bg-[#A38BFE] data-[state=active]:text-white">Sign Up</TabsTrigger>
        </TabsList>

        {/* LOGIN */}
        <TabsContent value="login">
          <Card className="mt-4 shadow-md bg-[#FFF1EB]">
            <CardContent className="p-6 space-y-4">
              <form onSubmit={handleLogin}>
                <h2 className="text-xl font-semibold text-[#444]">Welcome Back!</h2>
                <br />
                <Input type="email" value={loginData.email} onChange={(e) => setLoginData({ ...loginData, email: e.target.value })} placeholder="Email" className="rounded-xl text-black" required />
                <br />
                <Input type={showLoginPassword ? "text" : "password"} value={loginData.password} onChange={(e) => setLoginData({ ...loginData, password: e.target.value })} placeholder="Password" className="rounded-xl text-black" required />
                <Button type="submit" className="w-full mt-4" disabled={isLoading}>{isLoading ? "Logging in..." : "Login"}</Button>
              </form>
            </CardContent>
          </Card>
        </TabsContent>

        {/* SIGNUP */}
        <TabsContent value="signup">
          <Card className="mt-4 shadow-md bg-[#FFF1EB]">
            <CardContent className="p-6 space-y-4">
              <form onSubmit={handleSignup}>
                <h2 className="text-xl font-semibold text-[#444]">Create an Account</h2> <br />
                <Input type="text" value={signupData.fullName} onChange={(e) => setSignupData({ ...signupData, fullName: e.target.value })} placeholder="Full Name" className="rounded-xl text-black" required /> <br />
                <Input type="email" value={signupData.email} onChange={(e) => setSignupData({ ...signupData, email: e.target.value })} placeholder="Email" className="rounded-xl text-black" required /> <br />
                <Input type="text" value={signupData.age} onChange={(e) => setSignupData({ ...signupData, age: e.target.value })} placeholder="Age" className="rounded-xl text-black" required /> <br />
                <Input type="text" value={signupData.guardianName} onChange={(e) => setSignupData({ ...signupData, guardianName: e.target.value })} placeholder="Guardian Name" className="rounded-xl text-black" required /> <br />
                <Input type={showSignupPassword ? "text" : "password"} value={signupData.password} onChange={(e) => setSignupData({ ...signupData, password: e.target.value })} placeholder="Password" className="rounded-xl text-black" required />
                <Button type="submit" className="w-full mt-4" disabled={isLoading}>{isLoading ? "Signing up..." : "Sign Up"}</Button>
              </form>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AuthPage;