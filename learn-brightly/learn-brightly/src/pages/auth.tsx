import React, { useState, useEffect } from "react";
import { Card, CardContent } from "../components/card";
import { Input } from "../components/input";
import { Button } from "../components/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/tabs";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useToast } from "../hooks/use-toast";
import logo from "../assets/learn-bright-logo.svg";
import supabase from "../../supabase";

const AuthPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [tab, setTab] = useState("login");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [showLoginPassword, setShowLoginPassword] = useState(false);
  const [showSignupPassword, setShowSignupPassword] = useState(false);
  const [userType, setUserType] = useState<"parent" | "student">("student");
  const { toast } = useToast();

  const [loginData, setLoginData] = useState({ email: "", password: "" });

  interface SignupData {
    fullName: string;
    email: string;
    password: string;
    age: number | null;
    guardianName: string;
    dyslexiaScore: number | null;
  }

  const [signupData, setSignupData] = useState<SignupData>({
    fullName: "",
    email: "",
    password: "",
    age: null,
    guardianName: "",
    dyslexiaScore: null,
  });

  // Get user type from URL (example: ?userType=parent)
  useEffect(() => {
    const urlUserType = searchParams.get("userType");
    if (urlUserType === "parent" || urlUserType === "student") {
      setUserType(urlUserType);
    }
  }, [searchParams]);

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      // Validate required fields
      if (!signupData.fullName || !signupData.email || !signupData.password) {
        throw new Error("Please fill all required fields.");
      }
      if (
        userType === "student" &&
        (!signupData.age || !signupData.guardianName)
      ) {
        throw new Error("Please fill age and guardian name for student.");
      }

      // Supabase Auth signup
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: signupData.email,
        password: signupData.password,
      });
      if (authError) throw new Error(authError.message);

      // Prepare insert data for 'users' table
      const userInsert = {
        id: authData.user?.id,
        full_name: signupData.fullName,
        email: signupData.email,
        role: userType,
        age: signupData.age ?? null,
        guardian_name: signupData.guardianName || null,
        dyslexia_score: signupData.dyslexiaScore ?? null,
      };

      const { error: insertError } = await supabase
        .from("users")
        .insert([userInsert]);
      if (insertError) throw new Error(insertError.message);

      // Store local data
      localStorage.setItem(
        "user",
        JSON.stringify({
          id: authData.user?.id,
          email: signupData.email,
          fullName: signupData.fullName,
          role: userType,
        })
      );

      toast({
        title: "Registration successful!",
        description: "You are now logged in.",
      });

      // Navigate user
      navigate(userType === "parent" ? "/parentdashboard" : "/dyslexia-test");
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
      const { data: authData, error: authError } =
        await supabase.auth.signInWithPassword({
          email: loginData.email,
          password: loginData.password,
        });
      if (authError) throw new Error(authError.message);

      const { data: userData, error: userError } = await supabase
        .from("users")
        .select("*")
        .eq("email", loginData.email)
        .single();
      if (userError) throw new Error("User profile not found");

      localStorage.setItem("user", JSON.stringify(userData));

      if (userData.role === "parent") {
        navigate("/parentdashboard");
      } else if (userData.dyslexia_score !== null) {
        navigate("/dashboard");
      } else {
        navigate("/dyslexia-test");
      }
    } catch (err: any) {
      setError(err.message);
      localStorage.removeItem("user");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FFF9F2] flex flex-col items-center justify-center px-4">
      <div className="w-full max-w-md mb-8">
        <img
          src={logo}
          alt="Learn Bright Logo"
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

        {/* LOGIN */}
        <TabsContent value="login">
          <Card className="mt-4 shadow-md bg-[#FFF1EB]">
            <CardContent className="p-6 space-y-4">
              <form onSubmit={handleLogin}>
                <div className="text-center mb-4">
                  <h2 className="text-xl font-semibold text-[#444]">
                    Welcome Back!
                  </h2>
                  <p className="text-sm text-[#666] mt-1">
                    {userType === "student"
                      ? "Student Login"
                      : "Parent/Guardian Login"}
                  </p>
                </div>
                <Input
                  type="email"
                  value={loginData.email}
                  onChange={(e) =>
                    setLoginData({ ...loginData, email: e.target.value })
                  }
                  placeholder="Email"
                  className="rounded-xl text-black"
                  required
                />
                <Input
                  type={showLoginPassword ? "text" : "password"}
                  value={loginData.password}
                  onChange={(e) =>
                    setLoginData({ ...loginData, password: e.target.value })
                  }
                  placeholder="Password"
                  className="rounded-xl text-black mt-3"
                  required
                />
                <Button
                  type="submit"
                  className="w-full mt-4"
                  disabled={isLoading}
                >
                  {isLoading ? "Logging in..." : "Login"}
                </Button>
              </form>
            </CardContent>
          </Card>
        </TabsContent>

        {/* SIGNUP */}
        <TabsContent value="signup">
          <Card className="mt-4 shadow-md bg-[#FFF1EB]">
            <CardContent className="p-6 space-y-4">
              <form onSubmit={handleSignup}>
                <div className="text-center mb-4">
                  <h2 className="text-xl font-semibold text-[#444]">
                    Create an Account
                  </h2>
                  <p className="text-sm text-[#666] mt-1">
                    {userType === "student"
                      ? "Student Registration"
                      : "Parent Registration"}
                  </p>
                </div>

                <Input
                  type="text"
                  value={signupData.fullName}
                  onChange={(e) =>
                    setSignupData({ ...signupData, fullName: e.target.value })
                  }
                  placeholder="Full Name"
                  className="rounded-xl text-black"
                  required
                />
                <Input
                  type="email"
                  value={signupData.email}
                  onChange={(e) =>
                    setSignupData({ ...signupData, email: e.target.value })
                  }
                  placeholder="Email"
                  className="rounded-xl text-black mt-3"
                  required
                />

                {userType === "student" && (
                  <>
                    <Input
                      type="number"
                      value={signupData.age ?? ""}
                      onChange={(e) =>
                        setSignupData({
                          ...signupData,
                          age: e.target.value ? Number(e.target.value) : null,
                        })
                      }
                      placeholder="Age"
                      className="rounded-xl text-black mt-3"
                    />
                    <Input
                      type="text"
                      value={signupData.guardianName}
                      onChange={(e) =>
                        setSignupData({
                          ...signupData,
                          guardianName: e.target.value,
                        })
                      }
                      placeholder="Guardian Name"
                      className="rounded-xl text-black mt-3"
                    />
                  </>
                )}

                <Input
                  type={showSignupPassword ? "text" : "password"}
                  value={signupData.password}
                  onChange={(e) =>
                    setSignupData({ ...signupData, password: e.target.value })
                  }
                  placeholder="Password"
                  className="rounded-xl text-black mt-3"
                  required
                />
                <Button
                  type="submit"
                  className="w-full mt-4"
                  disabled={isLoading}
                >
                  {isLoading ? "Signing up..." : "Sign Up"}
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