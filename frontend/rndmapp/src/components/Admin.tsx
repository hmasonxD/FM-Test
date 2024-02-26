import React, { useState, useEffect } from "react";

interface User {
  id: number;
  username: string;
  firstname: string;
  lastname: string;
  email: string;
}

const Admin: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch("http://localhost:5000/users", {
          headers: {
            Accept: "application/json",
          },
        });

        if (response.ok) {
          const usersData: User[] = await response.json();
          setUsers(usersData);
        } else {
          console.error("Error fetching users:", response.status);
        }
      } catch (error) {
        console.error("Error during fetchUsers:", error);
      }
    };

    fetchUsers();
  }, []);

  const handleDeleteUser = async (userId: number) => {
    try {
      const response = await fetch(`http://localhost:5000/users/${userId}`, {
        method: "DELETE",
        headers: {
          Accept: "application/json",
        },
      });

      if (response.ok) {
        setUsers((prevUsers) => prevUsers.filter((user) => user.id !== userId));
      } else {
        console.error("Error deleting user:", response.status);
      }
    } catch (error) {
      console.error("Error during handleDeleteUser:", error);
    }
  };

  return (
    <div className="container mt-5">
      <h2 className="mb-4">Admin Page</h2>
      <table className="table table-bordered table-striped">
        <thead className="thead-dark">
          <tr>
            <th>ID</th>
            <th>Username</th>
            <th>Firstname</th>
            <th>Lastname</th>
            <th>Email</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.id}>
              <td>{user.id}</td>
              <td>{user.username}</td>
              <td>{user.firstname}</td>
              <td>{user.lastname}</td>
              <td>{user.email}</td>
              <td>
                <button
                  className="btn btn-danger"
                  onClick={() => handleDeleteUser(user.id)}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Admin;
