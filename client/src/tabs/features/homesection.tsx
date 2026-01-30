

const homesection = () => {

  const logout = () => {
    // Clear the authentication token (assuming it's stored in cookies)
    document.cookie = 'token=; Max-Age=0; path=/;';
    // Redirect to login page
    window.location.href = '/';
  }

  return (
    <div className="bg-black min-h-screen flex items-center justify-center">
      <h1 className="text-white text-4xl">Welcome to the Home Section!</h1>
      <button onClick={logout} className="mt-4 px-4 py-2 bg-red-600 text-white rounded ml-4">
        logout
      </button>
    </div>
  )
}

export default homesection
