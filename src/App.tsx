import "./index.css";
import { ThemeProvider } from "@/components/theme-provider";
import {
  BrowserRouter as Router,
  Routes,
  Route,
} from "react-router-dom";
import Layout from "@/components/layout";
import Login from "./pages/login";
import Dashboard from "./pages/dashboard";
import Parts from "./pages/parts";

function App() {

  return (
    <ThemeProvider defaultTheme="dark">
      <Router>
        <Routes>
            <Route path="/" element={<Login />} />
            <Route path="/dashboard" element={<Layout />}>
              <Route index element ={<Dashboard />} />
              <Route path="parts" element={<Parts /> } />
            </Route>
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App;
