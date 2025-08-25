import React, { useEffect } from 'react';
import { Button } from "./button";
import { Link, useNavigate } from "react-router-dom";
import ReadingText from './ReadingText';
import { AlertCircle, BookOpen, Home, Redo, GraduationCap } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from "./alert";
import { motion } from "framer-motion";
import { useToast } from "../hooks/use-toast";
import { jwtDecode } from 'jwt-decode';

interface TestResultsProps {
  score: number;
}

interface DecodedToken {
  id: string;
  email: string;
  role: string;
}

const TestResults: React.FC<TestResultsProps> = ({ score }) => {
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    const saveScore = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          navigate('/');
          return;
        }

        const response = await fetch('http://localhost:5000/api/auth/update-dyslexia-score', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({ score })
        });

        if (!response.ok) {
          if (response.status === 401) {
            // Token is invalid or expired, redirect to login
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            navigate('/');
            return;
          }
          throw new Error('Failed to save score');
        }

        toast({
          title: "Score saved successfully",
          description: "Your dyslexia test results have been saved.",
        });

        // Ensure token is still valid
        const verifyResponse = await fetch('http://localhost:5000/api/auth/verify', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (!verifyResponse.ok) {
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          navigate('/');
          return;
        }
      } catch (error) {
        console.error('Error saving score:', error);
        toast({
          title: "Error saving score",
          description: "There was a problem saving your test results.",
          variant: "destructive"
        });
      }
    };

    saveScore();
  }, [score, navigate, toast]);

  // Determine result level based on score
  let resultLevel = '';
  let resultMessage = '';
  let resultColor = '';
  
  if (score < 30) {
    resultLevel = 'Low';
    resultMessage = 'You showed few signs of dyslexia. However, if you\'re still concerned, it\'s always good to speak with a teacher or learning specialist.';
    resultColor = 'bg-pastel-green';
  } else if (score < 60) {
    resultLevel = 'Medium';
    resultMessage = 'You showed some signs of dyslexia. This doesn\'t mean you have it, but it might be helpful to talk to a teacher or learning specialist.';
    resultColor = 'bg-pastel-yellow';
  } else {
    resultLevel = 'High';
    resultMessage = 'You showed several signs that could be associated with dyslexia. We recommend speaking with a teacher, learning specialist, or doctor for further assessment.';
    resultColor = 'bg-pastel-peach';
  }

  return (
    <div className="bg-white rounded-2xl p-6 shadow-lg animate-pop border-2 border-pastel-purple/20">
      <h1 className="text-2xl font-bold mb-6 text-center text-primary">Your Test Results</h1>
      
      <div className="flex flex-col items-center mb-8">
        <motion.div 
          className={`w-48 h-48 ${resultColor} rounded-full flex items-center justify-center text-4xl font-bold mb-4 shadow-md border-2 border-white`}
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 260, damping: 20 }}
        >
          {score}%
        </motion.div>
        
        <h2 className="text-xl font-bold mb-2 text-primary">
          {resultLevel} signs of dyslexia
        </h2>
      </div>
      
      <Alert className="mb-6 bg-pastel-blue/30 border-pastel-blue">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Important to know</AlertTitle>
        <AlertDescription>
          <ReadingText>
            This test is just a screening tool and not a formal diagnosis. Dyslexia can only be officially diagnosed by qualified professionals.
          </ReadingText>
        </AlertDescription>
      </Alert>
      
      <div className="mb-8 p-4 bg-pastel-yellow/30 rounded-xl">
        <h3 className="text-lg font-bold mb-2">What this means:</h3>
        <ReadingText>
          {resultMessage}
        </ReadingText>
      </div>
      
      <div className="space-y-4">
        <h3 className="text-lg font-bold">Next steps:</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Link to="/dyslexia" className="block">
            <Button variant="outline" className="w-full h-auto py-4 flex flex-col items-center gap-2 bg-pastel-purple/10 hover:bg-pastel-purple/20 border-pastel-purple/30">
              <BookOpen className="h-5 w-5" />
              <span>Learn more about dyslexia</span>
            </Button>
          </Link>
          
          <Link to="/resources" className="block">
            <Button variant="outline" className="w-full h-auto py-4 flex flex-col items-center gap-2 bg-pastel-blue/10 hover:bg-pastel-blue/20 border-pastel-blue/30">
              <GraduationCap className="h-5 w-5" />
              <span>Explore learning resources</span>
            </Button>
          </Link>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Link to="/test" className="block">
            <Button variant="outline" className="w-full h-auto py-4 flex flex-col items-center gap-2 bg-pastel-green/10 hover:bg-pastel-green/20 border-pastel-green/30">
              <Redo className="h-5 w-5" />
              <span>Take the test again</span>
            </Button>
          </Link>
          
          <Link to="/dashboard" className="block">
            <Button className="w-full h-auto py-4 flex flex-col items-center gap-2 bg-primary hover:bg-primary/90">
              <Home className="h-5 w-5" />
              <span>Return to Home</span>
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default TestResults;
