import { Routes, Route } from "react-router-dom";
import { Navbar } from "./components";
import { Register, Login } from "./pages";

function App() {
  return (
    <div className="h-dvh w-full">
      <Navbar />

      <Routes>
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
      </Routes>
    </div>
  );
}

export default App;
