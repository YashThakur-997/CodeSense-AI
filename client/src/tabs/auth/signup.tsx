import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Link } from "react-router-dom"
import { useState } from "react"
import { useNavigate } from "react-router-dom"

const Signup = () => {
  const [form, setForm] = useState({
      email: '',
      password: '',
      username: '',
    });

  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>)=> {
    e.preventDefault();
    // Handle signup logic here
    console.log("Signup form submitted");
    try {
      const response = await fetch('http://localhost:3000/auth/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(form),
      });
      if (response.ok) {
        alert('Signup successful! Please log in.');
        navigate('/');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('An error occurred. Please try again later.');
    }
  }

  return (
    <form onSubmit={handleSubmit}>
    <div className="min-h-screen flex items-center justify-center bg-black">
      <Card className="w-full max-w-sm p-6 space-y-4 shadow-lg bg-[#0e0c0c] border border-gray-700">
        <h1 className="text-2xl font-bold text-center text-white">Sign Up</h1>
        <Input className="text-white" placeholder="Username" value={form.username} onChange={(e) => setForm({ ...form, username: e.target.value })} />
        <Input className="text-white" placeholder="Email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
        <Input className="text-white" placeholder="Password" type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} />
        <Button className="w-full" type="submit">Sign Up</Button>
        <p className="text-sm text-center text-white">
          Already have an account? <Link to="/" className="text-blue-500">Log in</Link>
        </p>
      </Card>
    </div>
    </form>
  )
}

export default Signup
