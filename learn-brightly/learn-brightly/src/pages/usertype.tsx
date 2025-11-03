import React, { useState } from "react";
import { Card, CardContent } from "../components/card";
import { Button } from "../components/button";
import { useNavigate } from "react-router-dom";
import logo from "../assets/learn-bright-logo.svg";

const UserTypePage: React.FC = () => {
  const navigate = useNavigate();
  const [selectedUserType, setSelectedUserType] = useState<"parent" | "student" | null>(null);

  const handleUserTypeSelect = (userType: "parent" | "student") => {
    setSelectedUserType(userType);
    // Redirect to auth page with user type as query parameter
    navigate(`/auth?userType=${userType}`);
  };

  return (
    <div className="min-h-screen bg-[#FFF9F2] flex flex-col items-center justify-center px-4">
      <div className="w-full max-w-md mb-8">
        <img src={logo} alt="Learn Bright Logo" className="w-full max-w-[300px] mx-auto" />
      </div>

      <Card className="w-full max-w-md shadow-md bg-[#FFF1EB]">
        <CardContent className="p-6 space-y-6">
          <div className="text-center">
            <h2 className="text-2xl font-semibold text-[#444] mb-2">Welcome to Learn Brightly</h2>
            <p className="text-[#666]">Please select your user type to continue</p>
          </div>

          <div className="space-y-4">
            <Button 
              onClick={() => handleUserTypeSelect("student")}
              className="w-full h-16 text-lg font-medium bg-[#A38BFE] hover:bg-[#8B7AFE] text-white rounded-xl transition-colors"
            >
              I am a Student
            </Button>
            
            <Button 
              onClick={() => handleUserTypeSelect("parent")}
              className="w-full h-16 text-lg font-medium bg-[#A38BFE] hover:bg-[#8B7AFE] text-white rounded-xl transition-colors"
            >
              I am a Parent/Guardian
            </Button>
          </div>

          <div className="text-center text-sm text-[#666]">
            <p>Choose the option that best describes your role</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default UserTypePage;


