import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from "react-router-dom";
import { Login } from "./pages/Login";
import Index from "./pages/Index";

const ProtectedRoute = ({ children }: { children: JSX.Element }) => {
  const isAuth = localStorage.getItem("auth") === "true";
  const location = useLocation();

  if (!isAuth) {
    return <Navigate to="/" state={{ from: location }} replace />;
  }
  return children;
};

const App = () => {
  return (
      <Router>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route
              path="/index"
              element={
                <ProtectedRoute>
                  <Index />
                </ProtectedRoute>
              }
          />
          {/* redirige toute autre route vers login */}
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </Router>
  );
};

export default App;
