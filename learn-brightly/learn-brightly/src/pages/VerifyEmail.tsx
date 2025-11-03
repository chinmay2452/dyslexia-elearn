import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Card, CardContent } from '../components/card';
import { Button } from '../components/button';
import { CheckCircle, XCircle, Mail, RefreshCw } from 'lucide-react';
import { useToast } from '../hooks/use-toast';

const VerifyEmail: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [verificationStatus, setVerificationStatus] = useState<'pending' | 'success' | 'error'>('pending');
  const [message, setMessage] = useState('');
  const [email, setEmail] = useState('');

  useEffect(() => {
    const token = searchParams.get('token');
    const emailParam = searchParams.get('email');
    
    if (token && emailParam) {
      setEmail(emailParam);
      verifyEmail(token, emailParam);
    } else {
      setVerificationStatus('error');
      setMessage('Invalid verification link. Please check your email and try again.');
    }
  }, [searchParams]);

  const verifyEmail = async (token: string, email: string) => {
    setIsLoading(true);
    try {
      const response = await fetch('http://localhost:5000/api/auth/verify-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ token, email }),
      });

      const data = await response.json();

      if (response.ok) {
        setVerificationStatus('success');
        setMessage(data.message);
        toast({
          title: "Email verified successfully!",
          description: "You can now log in to your account.",
        });
      } else {
        setVerificationStatus('error');
        setMessage(data.error || 'Verification failed');
      }
    } catch (error) {
      setVerificationStatus('error');
      setMessage('Network error. Please check your connection and try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const resendVerificationEmail = async () => {
    if (!email) return;
    
    setIsLoading(true);
    try {
      const response = await fetch('http://localhost:5000/api/auth/resend-verification', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (response.ok) {
        toast({
          title: "Verification email sent!",
          description: "Please check your inbox for the new verification email.",
        });
      } else {
        toast({
          title: "Error",
          description: data.error || 'Failed to resend verification email',
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Network error. Please try again later.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoToLogin = () => {
    navigate('/auth');
  };

  return (
    <div className="min-h-screen bg-[#FFF9F2] flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardContent className="p-8 text-center">
          {verificationStatus === 'pending' && (
            <>
              <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-[#A38BFE] mx-auto mb-6"></div>
              <h1 className="text-2xl font-bold text-[#444] mb-4">
                Verifying your email...
              </h1>
              <p className="text-[#666]">
                Please wait while we verify your email address.
              </p>
            </>
          )}

          {verificationStatus === 'success' && (
            <>
              <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-6" />
              <h1 className="text-2xl font-bold text-[#444] mb-4">
                Email Verified! 🎉
              </h1>
              <p className="text-[#666] mb-6">
                {message}
              </p>
              <Button 
                onClick={handleGoToLogin}
                className="w-full bg-[#A38BFE] hover:bg-[#8B7AFE]"
              >
                Go to Login
              </Button>
            </>
          )}

          {verificationStatus === 'error' && (
            <>
              <XCircle className="h-16 w-16 text-red-500 mx-auto mb-6" />
              <h1 className="text-2xl font-bold text-[#444] mb-4">
                Verification Failed
              </h1>
              <p className="text-[#666] mb-6">
                {message}
              </p>
              
              {email && (
                <div className="space-y-4">
                  <p className="text-sm text-[#666]">
                    Didn't receive the email? Check your spam folder or resend the verification email.
                  </p>
                  <Button 
                    onClick={resendVerificationEmail}
                    disabled={isLoading}
                    variant="outline"
                    className="w-full"
                  >
                    {isLoading ? (
                      <>
                        <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                        Sending...
                      </>
                    ) : (
                      <>
                        <Mail className="h-4 w-4 mr-2" />
                        Resend Verification Email
                      </>
                    )}
                  </Button>
                </div>
              )}
              
              <Button 
                onClick={handleGoToLogin}
                variant="outline"
                className="w-full mt-4"
              >
                Back to Login
              </Button>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default VerifyEmail;
