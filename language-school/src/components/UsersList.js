import React, { useEffect, useState } from "react";
import Loading from "./Loading";
import useAxiosAuth from "../hooks/useAxiosAuth";
import UserListItem from "./UserListItem";

function UsersList() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const axios = useAxiosAuth();

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get("/users");
        setUsers(response.data);
        setLoading(false);
      } catch (error) {
        console.error(error);
      }
    };

    fetchUsers();
  }, [axios]);

  if (loading) {
    return <Loading />;
  }

  return (
    <div>
      <h1>Lista użytkowników</h1>
      {users.map((user) => (
        <UserListItem user={user} />
      ))}
    </div>
  );
}

export default UsersList;
