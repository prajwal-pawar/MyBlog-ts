import { Routes, Route } from "react-router-dom";
import { Navigate } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { Navbar } from "./components";
import { Register, Login, Home, CreateArticle } from "./pages";
import useAuth from "./hooks/useAuth";

function App() {
  const { user } = useAuth();

  return (
    <div className="h-dvh w-full">
      {/* toaster configs */}
      <Toaster
        position="top-center"
        toastOptions={{
          style: {
            borderRadius: "10px",
            background: "#333",
            color: "#fff",
          },
        }}
      />

      <Navbar />

      <Routes>
        <Route
          path="/register"
          element={user ? <Navigate to="/" /> : <Register />}
        />
        <Route path="/login" element={user ? <Navigate to="/" /> : <Login />} />
        <Route path="/" element={user ? <Home /> : <Navigate to="/login" />} />
        <Route
          path="/article/create"
          element={user ? <CreateArticle /> : <Navigate to="/login" />}
        />
      </Routes>
    </div>
  );
}

export default App;
