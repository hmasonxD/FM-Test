// import React, { useState } from "react";
// import { useNavigate } from "react-router-dom";

// interface LoginProps {
//   onLogin: () => void;
// }

// const Login: React.FC<LoginProps> = ({ onLogin }) => {
//   const [username, setUsername] = useState<string>("");
//   const [password, setPassword] = useState<string>("");
//   const [firstName, setFirstName] = useState<string>("");
//   const [lastName, setLastName] = useState<string>("");
//   const [email, setEmail] = useState<string>("");
//   const [isSignUp, setIsSignUp] = useState<boolean>(false);
//   const navigate = useNavigate();

//   const handleLogin = async () => {
//     try {
//       // Assuming login is successful, call onLogin callback
//       onLogin();

//       // Redirect to home page after successful login
//       navigate("/home");
//     } catch (error) {
//       console.error("Error during login:", error);
//     }
//   };

//   const handleSignUp = async () => {
//     try {
//       const response = await fetch("/register", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({
//           firstname: firstName,
//           lastname: lastName,
//           username: username,
//           email: email,
//           password: password,
//         }),
//       });

//       if (response.ok) {
//         const data = await response.json();
//         console.log(data.message); // Registration successful
//         setIsSignUp(false); // Switch back to login form
//       } else {
//         console.error("Error during sign up:", await response.text());
//       }
//     } catch (error) {
//       console.error("Error during sign up:", error);
//     }
//   };

//   return (
//     <div>
//       <h2>{isSignUp ? "Sign Up" : "Login"}</h2>
//       <form>
//         {isSignUp && (
//           <>
//             <label>First Name:</label>
//             <input
//               type="text"
//               value={firstName}
//               onChange={(e) => setFirstName(e.target.value)}
//             />
//             <label>Last Name:</label>
//             <input
//               type="text"
//               value={lastName}
//               onChange={(e) => setLastName(e.target.value)}
//             />
//             <label>Email:</label>
//             <input
//               type="email"
//               value={email}
//               onChange={(e) => setEmail(e.target.value)}
//             />
//           </>
//         )}
//         <label>Username:</label>
//         <input
//           type="text"
//           value={username}
//           onChange={(e) => setUsername(e.target.value)}
//         />
//         <label>Password:</label>
//         <input
//           type="password"
//           value={password}
//           onChange={(e) => setPassword(e.target.value)}
//         />
//         <button type="button" onClick={isSignUp ? handleSignUp : handleLogin}>
//           {isSignUp ? "Sign Up" : "Login"}
//         </button>
//       </form>
//       <button onClick={() => setIsSignUp(!isSignUp)}>
//         {isSignUp
//           ? "Already have an account? Login"
//           : "Don't have an account? Sign Up"}
//       </button>
//     </div>
//   );
// };

// export default Login;

// import React, { useState } from "react";
// import { useNavigate } from "react-router-dom";

// interface LoginProps {
//   onLogin: () => void;
// }

// const Login: React.FC<LoginProps> = ({ onLogin }) => {
//   const [username, setUsername] = useState<string>("");
//   const [password, setPassword] = useState<string>("");
//   const [error, setError] = useState<string | null>(null);
//   const navigate = useNavigate();

//   const handleLogin = async () => {
//     try {
//       const formData = new FormData();
//       formData.append("username", username);
//       formData.append("password", password);

//       const response = await fetch("http://localhost:5000/login", {
//         method: "POST",
//         body: formData,
//       });

//       if (response.ok) {
//         // Assuming login is successful, call onLogin callback
//         onLogin();

//         // Redirect to home page after successful login
//         navigate("/home");
//       } else {
//         const data = await response.json();
//         setError(data.error || "Login failed");
//       }
//     } catch (error) {
//       console.error("Error during login:", error);
//       setError("Wrong login input.");
//     }
//   };

//   return (
//     <div className="container">
//       <div className="card mx-auto" style={{ maxWidth: "500px" }}>
//         <div className="card-body">
//           <h2 className="card-title">Login</h2>
//           <form>
//             <div className="mb-3">
//               <label className="form-label">Username:</label>
//               <input
//                 className="form-control"
//                 type="text"
//                 value={username}
//                 onChange={(e) => setUsername(e.target.value)}
//               />
//             </div>
//             <div className="mb-3">
//               <label className="form-label">Password:</label>
//               <input
//                 className="form-control"
//                 type="password"
//                 value={password}
//                 onChange={(e) => setPassword(e.target.value)}
//               />
//             </div>
//             {error && <div style={{ color: "red" }}>{error}</div>}
//             <button
//               className="btn btn-primary"
//               type="button"
//               onClick={handleLogin}
//             >
//               Login
//             </button>
//           </form>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Login;

// const handleAuth = async () => {
//   try {
//     const formData = new FormData();
//     formData.append("username", username);
//     formData.append("password", password);

//     if (isSignUp) {
//       formData.append("firstName", firstName);
//       formData.append("lastName", lastName);
//       formData.append("email", email);
//     }

//     const response = await fetch(isSignUp ? "/register" : "/login", {
//       method: "POST",
//       body: isSignUp
//         ? JSON.stringify(Object.fromEntries(formData))
//         : formData,
//       headers: {
//         "Content-Type": isSignUp ? "application/json" : undefined,
//       },
//     });

//     if (response.ok) {
//       // Assuming login/signup is successful, call the appropriate callback
//       isSignUp ? onRegister() : onLogin();

//       // Redirect to home page after successful login/signup
//       navigate("/home");
//     } else {
//       const data = await response.json();
//       setError(data.message || "An unexpected error occurred");
//     }
//   } catch (error) {
//     console.error("Error during authentication:", error);
//     setError("An unexpected error occurred");
//   }
// };

import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

interface LoginProps {
  onLogin: () => void;
  onRegister: () => void;
}

const Login: React.FC<LoginProps> = ({ onLogin, onRegister }) => {
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [firstname, setFirstname] = useState<string>("");
  const [lastname, setLastname] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [isSignUp, setIsSignUp] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [registrationSuccess, setRegistrationSuccess] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      const response = await fetch("http://localhost:5000/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username,
          password,
        }),
      });

      if (response.ok) {
        const data = await response.json();

        if (data.success) {
          onLogin();
          navigate("/home");
        } else {
          setError(data.error || "Login failed. Please try again.");
        }
      } else {
        const responseData = await response.json();
        setError(responseData.error || "Unexpected error. Please try again.");
      }

      setUsername("");
      setPassword("");
    } catch (error) {
      console.error("Login error:", error);
      setError(
        "An unexpected error occurred. Please check your network connection and try again later."
      );
    }
  };

  const handleRegister = async () => {
    try {
      const response = await fetch("http://localhost:5000/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          firstname,
          lastname,
          username,
          email,
          password,
        }),
      });

      if (response.ok) {
        // Reset form fields
        setFirstname("");
        setLastname("");
        setUsername("");
        setEmail("");
        setPassword("");

        const data = await response.json();
        console.log(data.message);
        onRegister();
        handleFormSwitch();
        setRegistrationSuccess(true);
      } else {
        const contentType = response.headers.get("content-type");
        if (contentType && contentType.indexOf("application/json") !== -1) {
          const data = await response.json();
          if (data.validation_errors) {
            const errors = data.validation_errors;
            setError(`Registration failed. ${Object.values(errors).join(" ")}`);
          } else {
            setError(data.error || "Registration failed. Please try again.");
          }
        } else {
          const responseText = await response.text();
          setError(responseText || "Unexpected error. Please try again.");
        }
      }
    } catch (error) {
      console.error("Error during registration:", error);
      setError("An unexpected error occurred");
    }
  };
  const handleFormSwitch = () => {
    setIsSignUp((prevSignUp) => !prevSignUp);
    setFirstname("");
    setLastname("");
    setEmail("");
    setError("");
    setRegistrationSuccess(false);
  };
  return (
    <div className="container">
      <div className="card mx-auto" style={{ maxWidth: "500px" }}>
        <div className="card-body">
          <h2 className="card-title">{isSignUp ? "Register" : "Login"}</h2>
          {registrationSuccess && (
            <div style={{ color: "green" }}>Registration Successful!</div>
          )}
          {error && <div style={{ color: "red" }}>{error}</div>}
          <form>
            {isSignUp && (
              <>
                <div className="mb-3">
                  <label className="form-label">First Name:</label>
                  <input
                    className="form-control"
                    type="text"
                    value={firstname}
                    onChange={(e) => setFirstname(e.target.value)}
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Last Name:</label>
                  <input
                    className="form-control"
                    type="text"
                    value={lastname}
                    onChange={(e) => setLastname(e.target.value)}
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Email:</label>
                  <input
                    className="form-control"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
              </>
            )}
            {}
            <div className="mb-3">
              <label className="form-label">Username:</label>
              <input
                className="form-control"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>
            <div className="mb-3">
              <label className="form-label">Password:</label>
              <input
                className="form-control"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <button
              className="btn btn-primary me-2"
              type="button"
              onClick={isSignUp ? handleRegister : handleLogin}
            >
              {isSignUp ? "Register" : "Login"}
            </button>
            <button
              className="btn btn-secondary"
              type="button"
              onClick={handleFormSwitch}
            >
              {isSignUp ? "Switch to Login" : "Switch to Register"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
