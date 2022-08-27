import { onAuthStateChanged, User } from "firebase/auth"
import { useEffect, useState } from "react"
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom"
import { PageLoader } from "./components/layout/auth"
import { Navbar } from "./components/layout/nav"
import { auth } from "./config/fire"
import UserContext from "./context/UserContext"
import { Login } from "./pages/auth"
import { Dashboard } from "./pages/dashboard"
import ProtectedRoute from "./routes/ProtectedRoute"

function App() {

  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const listener = onAuthStateChanged(auth, (u) => {
      setUser(u)
      console.log("User changed", u)
      setLoading(false)
    })

    return () => {
      listener()
    }
  }, [])

  return (

    <BrowserRouter>
      <UserContext.Provider value={user}>
        {loading ? <PageLoader /> :
          <Routes>
            <Route index element={user ? <Navigate to="/dashboard" /> : <Login />} />
            <Route path="dashboard" element={<Navbar />}>
              <Route index element={<Dashboard />} />
            </Route>
          </Routes>
        }
      </UserContext.Provider>

    </BrowserRouter>
  )
}

export default App
