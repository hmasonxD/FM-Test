import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./components/Login";
import Home from "./components/Home";
import Admin from "./components/Admin";
import Menu from "./components/Menu";
import Profile from "./components/Profile";
import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";

const App: React.FC = () => {
  const [isLoggedIn, setLoggedIn] = useState(false);
  const [darkMode, setDarkMode] = useState(false);

  const handleLogin = () => {
    setLoggedIn(true);
  };

  const handleLogout = () => {
    setLoggedIn(false);
  };

  const handleRegister = () => {
    // You can add registration logic here if needed
    console.log("Registration logic here");
  };

  return (
    <Router>
      <div
        className={`App ${darkMode ? "dark-mode" : ""}`}
        style={{
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
        }}
      >
        {isLoggedIn && (
          <div style={{ position: "fixed", width: "100%", top: 0, zIndex: 1 }}>
            <Menu
              onLogout={handleLogout}
              darkMode={darkMode}
              setDarkMode={setDarkMode}
            />
          </div>
        )}
        <button
          style={{
            position: "fixed",
            top: "1rem",
            right: "1rem",
            padding: "1rem",
            borderRadius: "50%",
            border: "none",
            cursor: "pointer",
            backgroundColor: darkMode ? "#f8f9fa" : "#343a40",
            color: darkMode ? "#343a40" : "#f8f9fa",
          }}
          onClick={() => setDarkMode(!darkMode)}
        >
          {darkMode ? "🌞" : "🌙"}
        </button>
        <Routes>
          <Route
            path="/"
            element={
              <Login onLogin={handleLogin} onRegister={handleRegister} />
            }
          />
          <Route
            path="/home"
            element={
              isLoggedIn ? (
                <Home />
              ) : (
                <Login onLogin={handleLogin} onRegister={handleRegister} />
              )
            }
          />
          <Route
            path="/admin"
            element={
              isLoggedIn ? (
                <Admin />
              ) : (
                <Login onLogin={handleLogin} onRegister={handleRegister} />
              )
            }
          />
          <Route
            path="/profile"
            element={
              isLoggedIn ? (
                <Profile />
              ) : (
                <Login onLogin={handleLogin} onRegister={handleRegister} />
              )
            }
          />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
