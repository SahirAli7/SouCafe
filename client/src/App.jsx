import React from "react";
import AppRoutes from "./routes/AppRoutes";
import { BrowserRouter } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import { AuthProvider } from "./context/authContext";  // Import the AuthProvider
import Navbar from "./components/Navbar";

function App() {
  return (
    <AuthProvider>  {/* Wrap the entire app with AuthProvider */}
      <BrowserRouter>
        <Navbar />
        <AppRoutes />
      </BrowserRouter>
      <ToastContainer />
    </AuthProvider>
  );
}

export default App;
