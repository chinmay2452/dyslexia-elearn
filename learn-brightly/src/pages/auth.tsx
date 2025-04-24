import React, { useState } from "react";
import { Card, CardContent } from "../components/card";
import { Input } from "../components/input";
import { Button } from "../components/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/tabs";
import { useNavigate } from "react-router-dom";
import logo from "../assets/learn-bright-logo.svg";
import { auth } from "../lib/firebase";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  updateProfile,
} from "firebase/auth";

const AuthPage: React.FC = () => {
  const navigate = useNavigate();
  const [tab, setTab] = useState("login");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [showLoginPassword, setShowLoginPassword] = useState(false);
  const [showSignupPassword, setShowSignupPassword] = useState(false);

  // Login form state
  const [loginData, setLoginData] = useState({
    email: "",
    password: "",
  });

  // Signup form state
  const [signupData, setSignupData] = useState({
    fullName: "",
    age: "",
    guardianName: "",
    email: "",
    password: "",
  });

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        loginData.email,
        loginData.password
      );

      // Store user info in localStorage
      localStorage.setItem(
        "user",
        JSON.stringify({
          uid: userCredential.user.uid,
          email: userCredential.user.email,
          displayName: userCredential.user.displayName,
        })
      );

      navigate("/test");
    } catch (error: any) {
      setError(error.message || "An error occurred during signup");
    }
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      // Create user with email and password
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        signupData.email,
        signupData.password
      );

      // Update user profile with additional information
      await updateProfile(userCredential.user, {
        displayName: signupData.fullName,
      });

      // Store additional user info in localStorage
      localStorage.setItem(
        "user",
        JSON.stringify({
          uid: userCredential.user.uid,
          email: userCredential.user.email,
          displayName: signupData.fullName,
          age: signupData.age,
          guardianName: signupData.guardianName,
        })
      );

      // Redirect to dashboard
      navigate("/test");
    } catch (error: any) {
      setError(error.message || "An error occurred during login");
    }
  };

  return (
    <div className="min-h-screen bg-[#FFF9F2] flex flex-col items-center justify-center px-4">
      <div className="w-full max-w-md mb-8">
        <img
          src={logo}
          alt="Learn Bright - Dyslexia is a different kind of brilliance"
          className="w-full max-w-[300px] mx-auto"
        />
      </div>

      {error && (
        <div className="w-full max-w-md mb-4 p-4 bg-red-100 text-red-700 rounded-xl">
          {error}
        </div>
      )}

      <Tabs value={tab} onValueChange={setTab} className="w-full max-w-md">
        <TabsList className="grid w-full grid-cols-2 rounded-xl bg-[#ECECEC]">
          <TabsTrigger
            value="login"
            className="rounded-xl data-[state=active]:bg-[#A38BFE] data-[state=active]:text-white"
          >
            Login
          </TabsTrigger>
          <TabsTrigger
            value="signup"
            className="rounded-xl data-[state=active]:bg-[#A38BFE] data-[state=active]:text-white"
          >
            Sign Up
          </TabsTrigger>
        </TabsList>

        {/* LOGIN PAGE */}
        <TabsContent value="login">
          <Card className="mt-4 shadow-md bg-[#FFF1EB]">
            <CardContent className="p-6 space-y-4">
              <form onSubmit={handleLogin}>
                <h2 className="text-xl font-semibold text-[#444]">
                  Welcome Back!
                </h2>
                <div className="space-y-2">
                  <Input
                    id="login-email"
                    type="email"
                    value={loginData.email}
                    onChange={(e) =>
                      setLoginData({ ...loginData, email: e.target.value })
                    }
                    placeholder="XYZ@email.com"
                    className="rounded-xl text-black"
                    required
                  />
                </div>
                <br />
                <div className="space-y-2">
                  <div className="relative">
                    <Input
                      id="login-password"
                      type={showLoginPassword ? "text" : "password"}
                      value={loginData.password}
                      onChange={(e) =>
                        setLoginData({ ...loginData, password: e.target.value })
                      }
                      placeholder="password"
                      className="rounded-xl text-black pr-10"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowLoginPassword(!showLoginPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                    >
                      {showLoginPassword ? (
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-5 w-5"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                        >
                          <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                          <path
                            fillRule="evenodd"
                            d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z"
                            clipRule="evenodd"
                          />
                        </svg>
                      ) : (
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-5 w-5"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                        >
                          <path
                            fillRule="evenodd"
                            d="M3.707 2.293a1 1 0 00-1.414 1.414l14 14a1 1 0 001.414-1.414l-1.473-1.473A10.014 10.014 0 0019.542 10C18.268 5.943 14.478 3 10 3a9.958 9.958 0 00-4.512 1.074l-1.78-1.781zm4.261 4.26l1.514 1.515a2.003 2.003 0 012.45 2.45l1.514 1.514a4 4 0 00-5.478-5.478z"
                            clipRule="evenodd"
                          />
                          <path d="M12.454 16.697L9.75 13.992a4 4 0 01-3.742-3.741L2.335 6.578A9.98 9.98 0 00.458 10c1.274 4.057 5.065 7 9.542 7 .847 0 1.669-.105 2.454-.303z" />
                        </svg>
                      )}
                    </button>
                  </div>
                </div>
                <Button
                  type="submit"
                  disabled={isLoading}
                  className="w-full mt-4 bg-[#A38BFE] hover:bg-[#9179f1] text-white rounded-xl"
                >
                  {isLoading ? "Logging in..." : "Login"}
                </Button>
              </form>
            </CardContent>
          </Card>
        </TabsContent>

        {/* SIGNUP PAGE */}
        <TabsContent value="signup">
          <Card className="mt-4 shadow-md bg-[#EDEBFF]">
            <CardContent className="p-6 space-y-4">
              <form onSubmit={handleSignup}>
                <h2 className="text-xl font-semibold text-[#444]">
                  Create Your Account
                </h2>
                <div className="space-y-2">
                  <Input
                    id="fullName"
                    type="text"
                    value={signupData.fullName}
                    onChange={(e) =>
                      setSignupData({ ...signupData, fullName: e.target.value })
                    }
                    placeholder="Name"
                    className="rounded-xl text-black"
                    required
                  />
                </div>
                <br />
                <div className="space-y-2">
                  <Input
                    id="age"
                    type="number"
                    value={signupData.age}
                    onChange={(e) =>
                      setSignupData({ ...signupData, age: e.target.value })
                    }
                    placeholder="Age"
                    className="rounded-xl text-black"
                    required
                    min="5"
                    max="18"
                  />
                </div>
                <br />
                <div className="space-y-2">
                  <Input
                    id="guardian"
                    type="text"
                    value={signupData.guardianName}
                    onChange={(e) =>
                      setSignupData({
                        ...signupData,
                        guardianName: e.target.value,
                      })
                    }
                    placeholder="Guardian's Name"
                    className="rounded-xl text-black"
                    required
                  />
                </div>
                <br />
                <div className="space-y-2">
                  <Input
                    id="signup-email"
                    type="email"
                    value={signupData.email}
                    onChange={(e) =>
                      setSignupData({ ...signupData, email: e.target.value })
                    }
                    placeholder="XYZ@email.com"
                    className="rounded-xl text-black"
                    required
                  />
                </div>
                <br />
                <div className="space-y-2">
                  <div className="relative">
                    <Input
                      id="signup-password"
                      type={showSignupPassword ? "text" : "password"}
                      value={signupData.password}
                      onChange={(e) =>
                        setSignupData({
                          ...signupData,
                          password: e.target.value,
                        })
                      }
                      placeholder="password"
                      className="rounded-xl text-black pr-10"
                      required
                      minLength={8}
                    />
                    <button
                      type="button"
                      onClick={() => setShowSignupPassword(!showSignupPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                    >
                      {showSignupPassword ? (
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-5 w-5"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                        >
                          <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                          <path
                            fillRule="evenodd"
                            d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z"
                            clipRule="evenodd"
                          />
                        </svg>
                      ) : (
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-5 w-5"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                        >
                          <path
                            fillRule="evenodd"
                            d="M3.707 2.293a1 1 0 00-1.414 1.414l14 14a1 1 0 001.414-1.414l-1.473-1.473A10.014 10.014 0 0019.542 10C18.268 5.943 14.478 3 10 3a9.958 9.958 0 00-4.512 1.074l-1.78-1.781zm4.261 4.26l1.514 1.515a2.003 2.003 0 012.45 2.45l1.514 1.514a4 4 0 00-5.478-5.478z"
                            clipRule="evenodd"
                          />
                          <path d="M12.454 16.697L9.75 13.992a4 4 0 01-3.742-3.741L2.335 6.578A9.98 9.98 0 00.458 10c1.274 4.057 5.065 7 9.542 7 .847 0 1.669-.105 2.454-.303z" />
                        </svg>
                      )}
                    </button>
                  </div>
                </div>
                <Button
                  type="submit"
                  disabled={isLoading}
                  className="w-full mt-4 bg-[#A38BFE] hover:bg-[#9179f1] text-white rounded-xl"
                >
                  {isLoading ? "Creating Account..." : "Sign Up"}
                </Button>
              </form>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AuthPage;
