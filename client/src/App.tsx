import Login from "@/tabs/auth/login"
import Signup from "@/tabs/auth/signup"
import ForgotPassword from "./tabs/auth/forgetpass"
import { createBrowserRouter, RouterProvider } from "react-router-dom"

function App() {
  const router = createBrowserRouter([
    {
      path: "signup",
      element: <><Signup /></>
    },
    {
      path: "/",
      element: <><Login /></>
    },
    {
      path: "forgot-password",
      element: <><ForgotPassword /></>
    }
  ])

  return (
    <>
      <RouterProvider router={router} />
    </>
  )
}

export default App
