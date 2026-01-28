import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Link } from "react-router-dom"

const Signup = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-black">
      <Card className="w-full max-w-sm p-6 space-y-4 shadow-lg bg-[#0e0c0c] border border-gray-700">
        <h1 className="text-2xl font-bold text-center text-white">Sign Up</h1>
        <Input className="text-white" placeholder="Email" />
        <Input className="text-white" placeholder="Password" type="password" />
        <Button className="w-full">Sign Up</Button>
        <p className="text-sm text-center text-white">
          Already have an account? <Link to="/" className="text-blue-500">Log in</Link>
        </p>
      </Card>
    </div>
  )
}

export default Signup
