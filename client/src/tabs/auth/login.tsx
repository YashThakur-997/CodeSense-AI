import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const [form, setForm] = useState({
    email: '',
    password: '',
  });
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await fetch('http://localhost:3000/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(form),
      });

      if (response.ok) {
        const data = await response.json();
        document.cookie = `token=${data.token}; path=/;`;
        navigate('/homesection', { state: { username: data.username } });
      } else {
        console.error('Login failed');
        alert('Login failed. Please check your credentials.');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('An error occurred. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-gray-950 via-gray-900 to-black relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute top-0 left-0 w-72 h-72  rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-blue-600/20 rounded-full blur-3xl animate-pulse delay-1000" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-indigo-600/10 rounded-full blur-2xl" />

      <form onSubmit={handleSubmit} className="relative z-10 w-full max-w-md px-4 ">
        <Card className="w-full p-8 space-y-6 bg-gray-900/80 backdrop-blur-xl border border-gray-800/50 rounded-2xl shadow-2xl shadow-blue-900/40">
          {/* Logo/Brand Section */}
          <div className="text-center space-y-2">
            <div className="mx-auto w-46 h-16 bg-linear-to-br rounded-2xl flex items-center justify-center shadow-lg shadow-blue-500/30 mb-4">
              <svg width="400" height="120" viewBox="0 0 400 120" fill="none" xmlns="http://www.w3.org/2000/svg">
                <g id="LogoIcon">
                  <path d="M40 30C30 30 25 35 25 45V55C25 60 20 60 20 60C20 60 25 60 25 65V75C25 85 30 90 40 90" stroke="#00D2FF" stroke-width="6" stroke-linecap="round" />

                  <rect x="45" y="52" width="4" height="16" rx="2" fill="#00D2FF">
                    <animate attributeName="height" values="16;24;16" dur="1.5s" repeatCount="indefinite" />
                  </rect>
                  <rect x="55" y="44" width="4" height="32" rx="2" fill="#00D2FF">
                    <animate attributeName="height" values="32;48;32" dur="1.5s" repeatCount="indefinite" />
                  </rect>
                  <rect x="65" y="52" width="4" height="16" rx="2" fill="#00D2FF">
                    <animate attributeName="height" values="16;24;16" dur="1.5s" repeatCount="indefinite" />
                  </rect>

                  <path d="M80 30C90 30 95 35 95 45V55C95 60 100 60 100 60C100 60 95 60 95 65V75C95 85 90 90 80 90" stroke="#00D2FF" stroke-width="6" stroke-linecap="round" />
                </g>

                <text x="120" y="75" font-family="Arial, sans-serif" font-weight="800" font-size="36" fill="#ffffff">
                  Code<tspan fill="#0072FF">Sense</tspan>
                </text>
                <text x="120" y="98" font-family="Arial, sans-serif" font-weight="400" font-size="14" fill="#666" letter-spacing="4">
                  AI INTERVIEWER
                </text>
              </svg>
            </div>
            <h1 className="text-3xl font-bold bg-linear-to-r from-white to-gray-400 bg-clip-text text-transparent">
              Welcome Back
            </h1>
            <p className="text-gray-500 text-sm">Sign in to continue to CodeSense AI</p>
          </div>

          {/* Form Fields */}
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-300">Email</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                  </svg>
                </div>
                <Input
                  className="pl-10 bg-gray-800/50 border-gray-700/50 text-white placeholder:text-gray-500 focus:border-purple-500 focus:ring-purple-500/20 transition-all duration-300 h-12 rounded-xl"
                  placeholder="Enter your email"
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-300">Password</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </div>
                <Input
                  className="pl-10 bg-gray-800/50 border-gray-700/50 text-white placeholder:text-gray-500 focus:border-purple-500 focus:ring-purple-500/20 transition-all duration-300 h-12 rounded-xl"
                  placeholder="Enter your password"
                  type="password"
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                />
              </div>
            </div>
          </div>

          {/* Remember & Forgot */}
          <div className="flex items-center justify-between text-sm">
            <label className="flex items-center text-gray-400 cursor-pointer group">
              <input
                type="checkbox"
                className="w-4 h-4 rounded border-gray-600 bg-gray-800 text-purple-500 focus:ring-purple-500/20 mr-2 cursor-pointer"
              />
              <span className="group-hover:text-gray-300 transition-colors">Remember me</span>
            </label>
            <Link
              to="/forgot-password"
              className="text-blue-400 hover:text-blue-300 transition-colors font-medium"
            >
              Forgot password?
            </Link>
          </div>

          {/* Submit Button */}
          <Button
            className="w-full h-12 bg-black text-white font-semibold rounded-xl shadow-lg shadow-blue-500/25 transition-all duration-300 hover:shadow-blue-500/40 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
            type="submit"
            disabled={isLoading}
          >
            {isLoading ? (
              <div className="flex items-center gap-2">
                <svg className="animate-spin w-5 h-5" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                Signing in...
              </div>
            ) : (
              'Sign In'
            )}
          </Button>

          {/* Divider */}
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-800" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-gray-900 text-gray-500">New to CodeSense?</span>
            </div>
          </div>

          {/* Sign Up Link */}
          <div className="text-center">
            <Link
              to="/signup"
              className="inline-flex items-center gap-2 text-gray-400 hover:text-white transition-colors font-medium group"
            >
              Create an account
              <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
          </div>
        </Card>
      </form>
    </div>
  );
};

export default Login;