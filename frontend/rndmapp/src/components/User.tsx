// import React, { useState, useEffect } from "react";
// import { Link, useNavigate } from "react-router-dom";

// const User: React.FC = () => {
//   const navigate = useNavigate();
//   const [userData, setUserData] = useState<any>(null);

//   useEffect(() => {
//     const fetchUserData = async () => {
//       try {
//         const response = await fetch("http://localhost:5000/profile", {
//           method: "GET",
//           headers: {
//             // Include any headers needed for authentication or authorization
//             // For simplicity, we're not using tokens in this example
//           },
//         });

//         if (response.ok) {
//           const data = await response.json();
//           setUserData(data);
//         } else {
//           console.error("Error fetching user data:", response.status);
//         }
//       } catch (error) {
//         console.error("Error during fetchUserData:", error);
//       }
//     };

//     fetchUserData();
//   }, []);

//   const handleProfile = () => {
//     console.log("Profile Data:", userData);
//     // todo
//   };

//   const handleChangePassword = () => {
//     // todo
//     console.log("Change Password clicked");
//   };

//   const handleLogout = () => {
//     //return to home?
//     navigate("/login");
//   };

//   return (
//     <div>
//       <h2>User</h2>
//       <div>
//         <h3>Options</h3>
//         <ul>
//           <li>
//             <Link to="/user/profile" onClick={handleProfile}>
//               Profile
//             </Link>
//           </li>
//           <li>
//             <Link to="/change-password" onClick={handleChangePassword}>
//               Change Password
//             </Link>
//           </li>
//           <li onClick={handleLogout}>Logout</li>
//         </ul>
//       </div>
//     </div>
//   );
// };

// export default User;
import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import ChangePassword from "./ChangePassword";

const User: React.FC = () => {
  const navigate = useNavigate();
  const [userProfile, setUserProfile] = useState<any>({});
  const [showSubMenu, setShowSubMenu] = useState(false);

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const response = await fetch("http://localhost:5000/user-profile", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
        });

        if (response.ok) {
          const data = await response.json();
          setUserProfile(data);
        } else {
          console.error("Error fetching user profile data:", response.status);
        }
      } catch (error) {
        console.error("Error during fetchUserProfile:", error);
      }
    };

    fetchUserProfile();
  }, []);

  const handleToggleSubMenu = () => {
    setShowSubMenu((prev) => !prev);
  };

  const handleLogout = () => {
    navigate("/login");
  };

  return (
    <div>
      <h2>User</h2>
      <div>
        <h3 onClick={handleToggleSubMenu}>Options ▼</h3>
        {showSubMenu && (
          <ul>
            <li>
              <Link to="/user/change-password">Change Password</Link>
            </li>
            <li onClick={handleLogout}>Logout</li>
          </ul>
        )}
      </div>
      <div>
        {}
        <p>Username: {userProfile.username}</p>
        <p>Firstname: {userProfile.Firstname}</p>
        <p>Lastname: {userProfile.lastname}</p>
        <p>Email: {userProfile.email}</p>
        {}
        <ChangePassword />
      </div>
    </div>
  );
};

export default User;
