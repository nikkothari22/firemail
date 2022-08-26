import { onAuthStateChanged, User } from "firebase/auth"
import { useEffect, useState } from "react"
import { BrowserRouter, Route, Routes } from "react-router-dom"
import { auth } from "./config/fire"
import UserContext from "./context/UserContext"
import { Login } from "./pages/auth"

function App() {

  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    onAuthStateChanged(auth, (u) => {
      setUser(u)
      setLoading(false)
    })
  }, [])

  return (

    <BrowserRouter>
      <UserContext.Provider value={user}>
        <Routes>
          <Route index element={<Login />} />
        </Routes>
      </UserContext.Provider>

    </BrowserRouter>
  )
}

export default App
