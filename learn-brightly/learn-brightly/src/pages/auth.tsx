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
    phoneNumber?: string;
  }

  const [signupData, setSignupData] = useState<SignupData>({
    fullName: "",
    email: "",
    password: "",
    age: null,
    guardianName: "",
    phoneNumber: "",
  });

  // Get user type from URL (example: ?userType=parent)
  useEffect(() => {
    const urlUserType = searchParams.get("userType");
    if (urlUserType === "parent" || urlUserType === "student") {
      setUserType(urlUserType);
    }
  }, [searchParams]);

  // Validation helpers
  const validateEmail = (email: string) => {
    const re = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return re.test(email);
  };

  const validatePhone = (phone: string) => {
    const re = /^\d{10}$/;
    return re.test(phone);
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      // Validate required fields
      if (!signupData.fullName || !signupData.email || !signupData.password) {
        throw new Error("Please fill all required fields.");
      }

      // Validate Email
      if (!validateEmail(signupData.email)) {
        throw new Error("Please enter a valid email address with a domain (e.g., user@example.com).");
      }

      if (userType === "student") {
        if (!signupData.age || !signupData.guardianName) {
          throw new Error("Please fill age and guardian name for student.");
        }
        // Validate Age
        if (isNaN(Number(signupData.age)) || Number(signupData.age) <= 0) {
          throw new Error("Age must be a valid positive number.");
        }
      }

      if (userType === "parent") {
        if (!signupData.phoneNumber) {
          throw new Error("Please fill phone number for parent.");
        }
        // Validate Phone Number
        if (!validatePhone(signupData.phoneNumber)) {
          throw new Error("Phone number must be exactly 10 digits.");
        }
      }

      // Supabase Auth signup
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: signupData.email,
        password: signupData.password,
      });
      if (authError) throw new Error(authError.message);

      if (userType === "parent") {
        // Insert into parents table
        const { error: insertError } = await supabase
          .from("parents")
          .insert([
            {
              id: authData.user?.id,
              parent_name: signupData.fullName,
              contact_email: signupData.email,
              phone_number: signupData.phoneNumber,
            },
          ]);
        if (insertError) throw new Error(insertError.message);
      } else {
        // Generate unique student code
        const studentCode = Math.random().toString(36).substring(2, 8).toUpperCase();

        // Insert into users table (for students)
        const userInsert = {
          id: authData.user?.id,
          full_name: signupData.fullName,
          email: signupData.email,
          role: userType,
          age: signupData.age ?? null,
          guardian_name: signupData.guardianName || null,
          student_code: studentCode,
        };

        const { error: insertError } = await supabase
          .from("users")
          .insert([userInsert]);
        if (insertError) throw new Error(insertError.message);
      }

      // Store local data
      localStorage.setItem(
        "user",
        JSON.stringify({
          id: authData.user?.id,
          email: signupData.email,
          fullName: signupData.fullName,
          role: userType,
          ...(userType === "parent" ? { phoneNumber: signupData.phoneNumber } : {}),
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
      if (!validateEmail(loginData.email)) {
        throw new Error("Please enter a valid email address.");
      }

      const { data: authData, error: authError } =
        await supabase.auth.signInWithPassword({
          email: loginData.email,
          password: loginData.password,
        });
      if (authError) throw new Error(authError.message);

      // Try fetching from users table first
      let { data: userData } = await supabase
        .from("users")
        .select("*")
        .eq("email", loginData.email)
        .maybeSingle();

      let role = userData?.role;

      // If not found in users, try parents table
      if (!userData) {
        const { data: parentData } = await supabase
          .from("parents")
          .select("*")
          .eq("contact_email", loginData.email)
          .maybeSingle();

        if (parentData) {
          userData = {
            ...parentData,
            full_name: parentData.parent_name,
            email: parentData.contact_email,
            role: "parent"
          };
          role = "parent";
        } else {
          throw new Error("User profile not found");
        }
      }

      localStorage.setItem("user", JSON.stringify(userData));

      if (role === "parent") {
        navigate("/parentdashboard");
      } else {
        // Check if student has taken dyslexia test
        const { data: scores } = await supabase
          .from("dyslexia_score")
          .select("id")
          .eq("user", authData.user.id)
          .limit(1);

        if (scores && scores.length > 0) {
          navigate("/dashboard");
        } else {
          navigate("/dyslexia-test");
        }
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

                {userType === "parent" && (
                  <Input
                    type="tel"
                    value={signupData.phoneNumber}
                    onChange={(e) =>
                      setSignupData({
                        ...signupData,
                        phoneNumber: e.target.value,
                      })
                    }
                    placeholder="Phone Number"
                    className="rounded-xl text-black mt-3"
                    required
                  />
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