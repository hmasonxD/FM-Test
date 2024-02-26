import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

interface UserProfile {
  id: number;
  username: string;
  firstname: string;
  lastname: string;
  email: string;
}

const Profile: React.FC = () => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        const response = await fetch("http://localhost:5000/profile", {
          method: "GET",
          headers: {
            Accept: "application/json",
          },
          credentials: "include",
        });

        if (response.ok) {
          const userData: UserProfile = await response.json();
          setUser(userData);
        } else {
          console.error("Error fetching profile data:", response.status);
          // Log response details for debugging
          console.error(await response.json());
        }
      } catch (error) {
        console.error("Error fetching profile data:", error);
      }
    };

    fetchProfileData();
  }, [navigate]);

  return (
    <div>
      <h2>User Profile</h2>
      {user ? (
        <table>
          <tr>
            <th>User ID</th>
            <th>First Name</th>
            <th>Last Name</th>
            <th>Username</th>
            <th>Email</th>
          </tr>
          <tr>
            <td>{user.id}</td>
            <td>{user.firstname}</td>
            <td>{user.lastname}</td>
            <td>{user.username}</td>
            <td>{user.email}</td>
          </tr>
        </table>
      ) : (
        <p>No user found.</p>
      )}
    </div>
  );
};

export default Profile;
// import React, { useState, useEffect } from "react";
// import { useNavigate } from "react-router-dom";

// interface UserProfile {
//   id: number;
//   username: string;
//   firstname: string;
//   lastname: string;
//   email: string;
// }

// const Profile: React.FC = () => {
//   const [user, setUser] = useState<UserProfile | null>(null);
//   const navigate = useNavigate();

//   useEffect(() => {
//     const fetchProfileData = async () => {
//       try {
//         const response = await fetch("http://localhost:5000/profile", {
//           method: "GET",
//           headers: {
//             Accept: "application/json",
//           },
//           credentials: "include", // Include credentials in the request
//         });

//         if (response.ok) {
//           const data = await response.json();
//           setUser(data);
//         } else if (response.status === 401) {
//           // Handle authentication failure (log an error message)
//           console.error("Authentication failed while fetching profile data");
//         } else if (response.status === 302) {
//           // Handle redirection
//           console.error("Redirection occurred while fetching profile data");
//         } else if (response.status === 400) {
//           // Handle bad request
//           console.error("Bad request while fetching profile data");
//         } else {
//           console.error("Error fetching profile data:", response.status);
//         }
//       } catch (error) {
//         console.error("Error fetching profile data:", error);
//       }
//     };

//     fetchProfileData();
//   }, []);

//   return (
//     <div>
//       <h2>User Profile</h2>
//       {user ? (
//         <table>
//           <tr>
//             <th>User ID</th>
//             <th>First Name</th>
//             <th>Last Name</th>
//             <th>Username</th>
//             <th>Email</th>
//           </tr>
//           <tr>
//             <td>{user.id}</td>
//             <td>{user.firstname}</td>
//             <td>{user.lastname}</td>
//             <td>{user.username}</td>
//             <td>{user.email}</td>
//           </tr>
//         </table>
//       ) : (
//         <p>No user found.</p>
//       )}
//     </div>
//   );
// };

// export default Profile;
