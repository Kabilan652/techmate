import React, { useState, useEffect } from 'react';
import { useAuth } from "../context/AuthContext";
import { useNavigate , Link } from "react-router-dom";


  import { 
    User, 
    Mail, 
    Lock, 
    Eye, 
    EyeOff, 
    ArrowRight, 
    Check, 
    X,
    ShieldCheck,
    Zap
  } from 'lucide-react';

  const SignupPage = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
      fullName: '',
      email: '',
      password: '',
      confirmPassword: ''
    });

    
    const { signUp } = useAuth();
    



    const [showPassword, setShowPassword] = useState(false);
    const [errors, setErrors] = useState({});
    const [isLoading, setIsLoading] = useState(false);
    const [passwordStrength, setPasswordStrength] = useState(0);

    // Password Strength Logic
    useEffect(() => {
      const pass = formData.password;
      let score = 0;
      if (pass.length > 5) score += 1; // Length check
      if (pass.length > 10) score += 1; // Long length check
      if (/[A-Z]/.test(pass)) score += 1; // Uppercase check
      if (/[0-9]/.test(pass)) score += 1; // Number check
      if (/[^A-Za-z0-9]/.test(pass)) score += 1; // Special char check
      
      setPasswordStrength(score);
    }, [formData.password]);

    const validate = () => {
      let tempErrors = {};
      if (!formData.fullName) tempErrors.fullName = "Full Name is required";
      if (!formData.email.includes('@')) tempErrors.email = "Invalid email address";
      if (formData.password.length < 6) tempErrors.password = "Password must be at least 6 characters";
      if (formData.password !== formData.confirmPassword) tempErrors.confirmPassword = "Passwords do not match";
      
      setErrors(tempErrors);
      return Object.keys(tempErrors).length === 0;
    };

    const handleChange = (e) => {
      setFormData({ ...formData, [e.target.name]: e.target.value });
      // Clear error for that field when typing
      if (errors[e.target.name]) {
        setErrors({ ...errors, [e.target.name]: null });
      }
    };
  const handleSubmit = async (e) => {
      e.preventDefault();

      if (!validate()) return;

      setIsLoading(true);

      const { error } = await signUp(
        formData.email,
        formData.password,
        formData.fullName
      );

      if (error) {
        setErrors({ api: error.message });
        setIsLoading(false);
      } else {
        // Alert and redirect to login page
        alert("Account Created Successfully  Please log in to continue.");
        navigate("/login"); 
      }
    };


    // Helper for strength color
    const getStrengthColor = () => {
      if (passwordStrength <= 1) return "bg-red-500";
      if (passwordStrength <= 3) return "bg-yellow-500";
      return "bg-green-500";
    };

    return (
      <div className="min-h-screen flex bg-gray-50">
        
        {/* --- LEFT SIDE: Signup Form --- */}
        <div className="w-full lg:w-1/2 flex flex-col justify-center items-center p-8 bg-white order-2 lg:order-1">
          <div className="w-full max-w-md">
            
            <div className="mb-8">
              <h2 className="text-3xl font-extrabold text-gray-900 tracking-tight">Create your account</h2>
              <p className="mt-2 text-sm text-gray-600">
                Start your 7-day free trial. No credit card required.
              </p>
            </div>

            

            <form className="space-y-5" onSubmit={handleSubmit}>
              
              {/* Full Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700">Full Name</label>
                <div className="mt-1 relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <User className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleChange}
                    className={`block w-full pl-10 pr-3 py-3 border ${errors.fullName ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`}
                    placeholder="John Doe"
                  />
                </div>
                {errors.fullName && <p className="mt-1 text-xs text-red-500">{errors.fullName}</p>}
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-medium text-gray-700">Email Address</label>
                <div className="mt-1 relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Mail className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className={`block w-full pl-10 pr-3 py-3 border ${errors.email ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`}
                    placeholder="you@example.com"
                  />
                </div>
                {errors.email && <p className="mt-1 text-xs text-red-500">{errors.email}</p>}
              </div>

              {/* Password */}
              <div>
                <label className="block text-sm font-medium text-gray-700">Password</label>
                <div className="mt-1 relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    className={`block w-full pl-10 pr-10 py-3 border ${errors.password ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`}
                    placeholder="Create a password"
                  />
                  <div className="absolute inset-y-0 right-0 pr-3 flex items-center cursor-pointer" onClick={() => setShowPassword(!showPassword)}>
                      {showPassword ? <EyeOff className="h-5 w-5 text-gray-400" /> : <Eye className="h-5 w-5 text-gray-400" />}
                  </div>
                </div>
                
                {/* Password Strength Meter */}
                {formData.password && (
                  <div className="mt-2">
                      <div className="flex space-x-1 h-1">
                          {[...Array(5)].map((_, i) => (
                              <div 
                                  key={i} 
                                  className={`flex-1 rounded-full transition-all duration-500 ${i < passwordStrength ? getStrengthColor() : 'bg-gray-200'}`}
                              ></div>
                          ))}
                      </div>
                      <p className="text-xs text-gray-500 mt-1 text-right">
                          {passwordStrength <= 2 ? 'Weak' : passwordStrength <= 4 ? 'Good' : 'Strong'}
                      </p>
                  </div>
                )}
                {errors.password && <p className="mt-1 text-xs text-red-500">{errors.password}</p>}
              </div>

              {/* Confirm Password */}
              <div>
                <label className="block text-sm font-medium text-gray-700">Confirm Password</label>
                <div className="mt-1 relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <ShieldCheck className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="password"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    className={`block w-full pl-10 pr-3 py-3 border ${errors.confirmPassword ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`}
                    placeholder="Confirm password"
                  />
                </div>
                {errors.confirmPassword && <p className="mt-1 text-xs text-red-500">{errors.confirmPassword}</p>}
              </div>

              <div className="flex items-center text-sm">
                  <input type="checkbox" id="terms" className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded mr-2" required />
                  <label htmlFor="terms" className="text-gray-600">
                      I agree to the <a href="#" className="text-indigo-600 hover:underline">Terms of Service</a> and <a href="#" className="text-indigo-600 hover:underline">Privacy Policy</a>
                  </label>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className={`w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all ${isLoading ? 'opacity-70 cursor-not-allowed' : ''}`}
              >
                {isLoading ? 'Creating Account...' : 'Get Started'}
                {!isLoading && <ArrowRight className="ml-2 h-5 w-5" />}
              </button>
            </form>

           <p className="mt-6 text-center text-sm text-gray-600">
            Already have an account?{' '}
            {/* 2. Use Link component here */}
            <Link to="/login" className="font-bold text-indigo-600 hover:text-indigo-500 hover:underline">
              Login 
            </Link>
          </p>
          </div>
        </div>

        {/* --- RIGHT SIDE: Visuals (Hidden on mobile) --- */}
        <div className="hidden lg:flex lg:w-1/2 relative bg-gray-900 overflow-hidden order-1 lg:order-2">
          <div 
              className="absolute inset-0 bg-cover bg-center opacity-40"
              style={{ backgroundImage: "url('https://images.unsplash.com/photo-1517694712202-14dd9538aa97?ixlib=rb-4.0.3&auto=format&fit=crop&w=1470&q=80')" }}
          ></div>
          <div className="absolute inset-0 bg-gradient-to-br from-indigo-900/90 to-purple-900/80"></div>
          
          <div className="relative z-10 w-full h-full flex flex-col justify-center px-12 text-white">
              <div className="mb-8">
                  <div className="w-12 h-12 bg-white/10 rounded-lg flex items-center justify-center backdrop-blur-sm mb-6">
                      <Zap className="text-yellow-400 w-6 h-6" />
                  </div>
                  <h2 className="text-4xl font-bold mb-4">Master Coding <br/>Faster than Ever.</h2>
                  <p className="text-indigo-200 text-lg leading-relaxed max-w-md">
                      Join 50,000+ developers learning with interactive lessons, instant feedback, and real-world projects.
                  </p>
              </div>
              
              <div className="space-y-4">
                  {["Interactive Code Editor", "500+ Practice Exercises", "Completion Certificates"].map((item, i) => (
                      <div key={i} className="flex items-center space-x-3 text-indigo-100">
                          <div className="bg-green-500/20 p-1 rounded-full">
                              <Check className="text-green-400 w-4 h-4" />
                          </div>
                          <span className="font-medium">{item}</span>
                      </div>
                  ))}
              </div>
          </div>
        </div>

      </div>
    );
  };

  export default SignupPage;