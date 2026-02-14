import React, { useState } from 'react';
import { useAuth } from "../context/AuthContext";
import { useNavigate, Link } from "react-router-dom"; // 1. Import Link here

import { 
  Mail, 
  Lock, 
  Eye, 
  EyeOff, 
  ArrowRight, 
  CheckCircle,
  AlertCircle,
  Cpu
} from 'lucide-react';

const LoginPage = () => {
  
  const { signIn } = useAuth(); 

  const [formData, setFormData] = useState({ email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError(''); 
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();

    setIsLoading(true);
    setError("");

    const { error } = await signIn(
      formData.email,
      formData.password
    );

    if (error) {
      if (error.message === "Email not confirmed") {
        setError(" Please verify your email before logging in.");
      } else {
        setError(error.message);
      }
      setIsLoading(false);
    } else {
      setSuccess(true);
      
      setTimeout(() => {
        navigate("/dashboard");
      }, 1000); 
    }
  };

  return (
    <div className="min-h-screen flex bg-gray-50">
      
      {/* --- LEFT SIDE: Visual/Branding --- */}
      <div className="hidden lg:flex lg:w-1/2 relative bg-indigo-900 overflow-hidden">
        <div 
            className="absolute inset-0 opacity-40 bg-cover bg-center"
            style={{ backgroundImage: "url('https://images.unsplash.com/photo-1555099962-4199c345e5dd?ixlib=rb-4.0.3&auto=format&fit=crop&w=1770&q=80')" }}
        ></div>
        <div className="absolute inset-0 bg-gradient-to-t from-indigo-900/90 via-indigo-900/50 to-transparent"></div>

        <div className="relative z-10 w-full flex flex-col justify-between p-12 text-white">
          <div className="flex items-center space-x-2 text-2xl font-bold tracking-tight">
             <Cpu size={32} />
             <span>TechMate Platform</span>
          </div>

          <div className="space-y-6">
            <blockquote className="text-2xl font-medium leading-relaxed">
              "This platform completely changed how I approach coding. The interactive lessons and instant feedback are a game changer."
            </blockquote>
            <div className="flex items-center space-x-4">
            
            </div>
          </div>
        </div>
      </div>

      {/* --- RIGHT SIDE: Login Form --- */}
      <div className="w-full lg:w-1/2 flex flex-col justify-center items-center p-8 bg-white">
        <div className="w-full max-w-md space-y-8">
          
          <div className="text-center">
            <h2 className="text-3xl font-extrabold text-gray-900 tracking-tight">Welcome back</h2>
            <p className="mt-2 text-sm text-gray-600">
              Please enter your details to sign in.
            </p>
          </div>

          {error && (
            <div className="flex items-center bg-red-50 border-l-4 border-red-500 p-4 rounded animate-pulse">
                <AlertCircle className="text-red-500 mr-2" size={20} />
                <p className="text-sm text-red-700">{error}</p>
            </div>
          )}
          
          {success && (
            <div className="flex items-center bg-green-50 border-l-4 border-green-500 p-4 rounded">
                <CheckCircle className="text-green-500 mr-2" size={20} />
                <p className="text-sm text-green-700">Login successful! Redirecting...</p>
            </div>
          )}

          <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
            <div className="space-y-4">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email address</label>
                <div className="mt-1 relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Mail className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm transition-all"
                    placeholder="you@example.com"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label>
                <div className="mt-1 relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    required
                    value={formData.password}
                    onChange={handleChange}
                    className="block w-full pl-10 pr-10 py-3 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm transition-all"
                    placeholder="••••••••"
                  />
                  <div className="absolute inset-y-0 right-0 pr-3 flex items-center cursor-pointer" onClick={() => setShowPassword(!showPassword)}>
                    {showPassword ? <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600" /> : <Eye className="h-5 w-5 text-gray-400 hover:text-gray-600" />}
                  </div>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                />
                <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-900">
                  Remember me
                </label>
              </div>

              <div className="text-sm">
                <a href="#" className="font-medium text-indigo-600 hover:text-indigo-500 hover:underline">
                  Forgot your password?
                </a>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading || success}
              className={`group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white transition-all duration-200 
                ${isLoading || success ? 'bg-indigo-400 cursor-not-allowed' : 'bg-indigo-600 hover:bg-indigo-700 hover:shadow-lg focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500'}`
              }
            >
              {isLoading ? (
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
              ) : success ? (
                <CheckCircle className="h-5 w-5 mr-2" />
              ) : (
                <span className="absolute left-0 inset-y-0 flex items-center pl-3">
                  <ArrowRight className="h-5 w-5 text-indigo-500 group-hover:text-indigo-400" aria-hidden="true" />
                </span>
              )}
              {isLoading ? 'Signing in...' : success ? 'Success!' : 'Sign in'}
            </button>
          </form>

          {/* 2. Changed this section to use Link instead of <a> */}
          <p className="mt-2 text-center text-sm text-gray-600">
            Don't have an account?{' '}
            <Link to="/signup" className="font-medium text-indigo-600 hover:text-indigo-500 hover:underline">
              Create an Account
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;