import { Input} from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Link } from 'react-router-dom';

const ForgotPassword = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-black">
    <Card className="flex flex-col gap-4 p-6 w-full max-w-md shadow-lg bg-[#0e0c0c] border border-gray-700">
      <h1 className="text-2xl font-bold text-white">Forgot Password</h1>
      <p className="text-white">Please enter your email address to reset your password.</p>
      <Input className="text-white" type="email" placeholder="Email" />
      <Button>Send Reset Link</Button>
      <p className="text-sm text-center text-white">
        Remembered your password? <Link to="/" className="text-blue-500">Log in</Link>
      </p>
    </Card>
    </div>
  )
}

export default ForgotPassword
