import { useState } from 'react';
import '../styles/fonts.css';
import learnBrightLogo from '../assets/learn-bright-logo.svg';

const Auth = () => {
    const [isLogin, setIsLogin] = useState(true);
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        name: ''
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log('Form submitted:', formData);
    };

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    return (
        <div className="min-h-screen bg-[#F5F5F5] flex items-center justify-center px-4">
            <div className="max-w-md w-full bg-white rounded-xl shadow-lg p-8 space-y-6">
                <div className="text-center">
                    <div className="w-64 h-48 mx-auto mb-4 relative">
                        <img 
                            src={learnBrightLogo}
                            alt="Learn Brightly Logo" 
                            className="w-full h-full object-contain"
                        />
                    </div>
                    <h2 className="font-dyslexic text-4xl font-bold text-[#2C3E50] mb-6 tracking-wider">
                        LEARN BRIGHT
                    </h2>
                    <h1 className="font-dyslexic text-3xl font-bold text-[#2C3E50] mb-2">
                        {isLogin ? 'Welcome Back!' : 'Join Learn Brightly'}
                    </h1>
                    <p className="font-dyslexic text-[#34495E]">
                        {isLogin ? 'Continue your learning journey' : 'Start your learning journey today'}
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    {!isLogin && (
                        <div>
                            <label htmlFor="name" className="font-dyslexic block text-[#34495E] mb-1">Name</label>
                            <input
                                type="text"
                                id="name"
                                name="name"
                                placeholder='Enter your name'
                                value={formData.name}
                                onChange={handleChange}
                                className="placeholder:text-[#95A5A6] text-[#2C3E50] font-dyslexic w-full px-4 py-2 border-2 border-[#BDC3C7] rounded-lg focus:ring-2 focus:ring-[#3498DB] focus:border-[#3498DB] outline-none transition-colors duration-200 bg-[#F8F9F9]"
                                required
                            />
                        </div>
                    )}

                    <div>
                        <label htmlFor="email" className="font-dyslexic block text-[#34495E] mb-1">Email</label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            placeholder='Enter your email'
                            value={formData.email}
                            onChange={handleChange}
                            className="placeholder:text-[#95A5A6] text-[#2C3E50] font-dyslexic w-full px-4 py-2 border-2 border-[#BDC3C7] rounded-lg focus:ring-2 focus:ring-[#3498DB] focus:border-[#3498DB] outline-none transition-colors duration-200 bg-[#F8F9F9]"
                            required
                        />
                    </div>

                    <div>
                        <label htmlFor="password" className="font-dyslexic block text-[#34495E] mb-1">Password</label>
                        <input
                            type="password"
                            id="password"
                            name="password"
                            placeholder='Enter your password'
                            value={formData.password}
                            onChange={handleChange}
                            className="placeholder:text-[#95A5A6] text-[#2C3E50] font-dyslexic w-full px-4 py-2 border-2 border-[#BDC3C7] rounded-lg focus:ring-2 focus:ring-[#3498DB] focus:border-[#3498DB] outline-none transition-colors duration-200 bg-[#F8F9F9]"
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        className="font-dyslexic w-full bg-[#3498DB] text-white py-2 px-4 rounded-lg hover:bg-[#2980B9] transition duration-200"
                    >
                        {isLogin ? 'Login' : 'Sign Up'}
                    </button>
                </form>

                <div className="text-center">
                    <button
                        onClick={() => setIsLogin(!isLogin)}
                        className="font-dyslexic text-[#3498DB] hover:text-[#2980B9]"
                    >
                        {isLogin ? "Don't have an account? Sign up" : "Already have an account? Login"}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Auth; 