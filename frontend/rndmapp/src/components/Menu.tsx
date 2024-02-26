// import React from "react";
// import { Link } from "react-router-dom";
// import { Navbar, Nav } from "react-bootstrap";

// type MenuProps = {
//   onLogout: () => void;
//   darkMode: boolean;
//   setDarkMode: (value: boolean) => void;
// };

// const Menu: React.FC<MenuProps> = ({ onLogout, darkMode, setDarkMode }) => {
//   return (
//     <Navbar
//       bg={darkMode ? "dark" : "light"}
//       variant={darkMode ? "dark" : "light"}
//     >
//       <Navbar.Brand as={Link} to="/home">
//         Home
//       </Navbar.Brand>
//       <Nav className="mr-auto">
//         <Nav.Link as={Link} to="/admin">
//           Admin
//         </Nav.Link>
//         <Nav.Link as={Link} to="/user">
//           User
//         </Nav.Link>
//       </Nav>
//       <Nav>
//         <Nav.Link onClick={onLogout}>Logout</Nav.Link>
//         <button
//           style={{
//             padding: "1rem",
//             borderRadius: "50%",
//             border: "none",
//             cursor: "pointer",
//             backgroundColor: darkMode ? "#f8f9fa" : "#343a40",
//             color: darkMode ? "#343a40" : "#f8f9fa",
//           }}
//           onClick={() => setDarkMode(!darkMode)}
//         >
//           {darkMode ? "🌞" : "🌙"}
//         </button>
//       </Nav>
//     </Navbar>
//   );
// };

// export default Menu;
import React, { useState, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Navbar, Nav, NavDropdown } from "react-bootstrap";

interface MenuProps {
  onLogout: () => void;
  darkMode: boolean;
  setDarkMode: (value: boolean) => void;
}

const Menu: React.FC<MenuProps> = ({ onLogout, darkMode, setDarkMode }) => {
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const closeTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const navigate = useNavigate();

  const handleLogout = () => {
    if (closeTimeoutRef.current) {
      clearTimeout(closeTimeoutRef.current);
    }

    // Call the onLogout function
    onLogout();

    // Redirect to the login route
    navigate("/");
  };

  const handleMouseEnter = () => {
    // Clear any existing timeout
    if (closeTimeoutRef.current) {
      clearTimeout(closeTimeoutRef.current);
    }

    setUserMenuOpen(true);
  };

  const handleMouseLeave = () => {
    // Set a timeout to close the menu after a delay
    closeTimeoutRef.current = setTimeout(() => {
      setUserMenuOpen(false);
    }, 500); // Adjust the delay (in milliseconds) as needed
  };

  return (
    <Navbar
      bg={darkMode ? "dark" : "light"}
      variant={darkMode ? "dark" : "light"}
    >
      <Navbar.Brand as={Link} to="/home">
        Home
      </Navbar.Brand>
      <Nav className="mr-auto">
        <Nav.Link as={Link} to="/admin">
          Admin
        </Nav.Link>
        <NavDropdown
          title="User"
          id="basic-nav-dropdown"
          show={userMenuOpen}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          <NavDropdown.Item as={Link} to="/profile">
            Profile
          </NavDropdown.Item>
          <NavDropdown.Item onClick={handleLogout}>Logout</NavDropdown.Item>
        </NavDropdown>
      </Nav>
      <Nav>
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
      </Nav>
    </Navbar>
  );
};

export default Menu;
