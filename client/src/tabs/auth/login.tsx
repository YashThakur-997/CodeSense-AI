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

  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // Handle login logic here

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
        navigate('/homesection', { state: { username: data.username} });
      }
      else {
        console.error('Login failed');
        alert('Login failed. Please check your credentials.');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('An error occurred. Please try again later.');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="min-h-screen flex items-center justify-center bg-black">
        <Card className="w-full max-w-sm p-6 space-y-4 shadow-lg bg-[#0e0c0c] border border-gray-700">
          <h1 className="text-2xl font-bold text-center text-white">Login</h1>
          <Input className='text-white' placeholder="Email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
          <Input className='text-white' placeholder="Password" type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} />
          <Button className="w-full" type="submit">Login</Button>
          <div className="flex justify-between">
            <label className="flex items-center text-white">
              <input type="checkbox" className="mr-2 " />
              Remember me
            </label>
            <Link to="/forgot-password" className="text-sm text-blue-500 hover:underline">
              Forgot password?
            </Link>
          </div>
          <div className="text-center">
            <Link to="/signup" className="text-sm text-blue-500 hover:underline">
              Create an account
            </Link>
          </div>
        </Card>
      </div>
    </form>
  );
};

export default Login;