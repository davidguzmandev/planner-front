import './App.css'
import { ThemeProvider } from "@/components/theme-provider"
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom"
import { Login } from "./pages/login"

function App() {

  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <Router>
        <Routes>
          <Route path='/' element={<Login />} />
        </Routes>
      </Router>
    </ThemeProvider>
  )
}

export default App
