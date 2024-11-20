import { Navbar } from "./components";
import { Register, Login } from "./pages";

function App() {
  return (
    <div className="h-dvh w-full">
      <Navbar />

      <Login />
    </div>
  );
}

export default App;
