import './index.css'
import { ThemeProvider } from "@/components/theme-provider"
import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import { Login } from "./pages/login"
import Dashboard from "./pages/dashboard"

function App() {

  return (
    <ThemeProvider defaultTheme="dark" >
      <Router>
        <Routes>
          <Route path='/' element={<Login />} />
          <Route path='/dashboard' element={<Dashboard />} />
        </Routes>
      </Router>
    </ThemeProvider>
  )
}

export default App
