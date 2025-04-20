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
        // TODO: Implement authentication logic
        console.log('Form submitted:', formData);
    };

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    return (
        <div className="min-h-screen bg-[#C5E1A5] flex items-center justify-center px-4">
            <div className="max-w-md w-full bg-white rounded-xl shadow-lg p-8 space-y-6">
                <div className="text-center">
                    <div className="w-64 h-48 mx-auto mb-4 relative">
                        <img 
                            src={learnBrightLogo}
                            alt="Learn Brightly Logo" 
                            className="w-full h-full object-contain"
                        />
                    </div>
                    <h2 className="font-dyslexic text-4xl font-bold text-[#2E4053] mb-6 tracking-wider">
                        LEARN BRIGHT
                    </h2>
                    <h1 className="font-dyslexic text-3xl font-bold text-[#2E4053] mb-2">
                        {isLogin ? 'Welcome Back!' : 'Join Learn Brightly'}
                    </h1>
                    <p className="font-dyslexic text-gray-600">
                        {isLogin ? 'Continue your learning journey' : 'Start your learning journey today'}
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    {!isLogin && (
                        <div>
                            <label htmlFor="name" className="font-dyslexic block text-gray-700 mb-1">Name</label>
                            <input
                                type="text"
                                id="name"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                className="font-dyslexic w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none transition-colors duration-200"
                                required
                            />
                        </div>
                    )}

                    <div>
                        <label htmlFor="email" className="font-dyslexic block text-gray-700 mb-1">Email</label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            className="font-dyslexic w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none transition-colors duration-200"
                            required
                        />
                    </div>

                    <div>
                        <label htmlFor="password" className="font-dyslexic block text-gray-700 mb-1">Password</label>
                        <input
                            type="password"
                            id="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            className="font-dyslexic w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none transition-colors duration-200"
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        className="font-dyslexic w-full bg-[#2E4053] text-white py-2 px-4 rounded-lg hover:bg-[#34495E] transition duration-200"
                    >
                        {isLogin ? 'Login' : 'Sign Up'}
                    </button>
                </form>

                <div className="text-center">
                    <button
                        onClick={() => setIsLogin(!isLogin)}
                        className="font-dyslexic text-[#2E4053] hover:text-[#34495E]"
                    >
                        {isLogin ? "Don't have an account? Sign up" : "Already have an account? Login"}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Auth; 