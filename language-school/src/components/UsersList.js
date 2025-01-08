import React, { useEffect, useState } from "react";
import Loading from "./Loading";
import useAxiosAuth from "../hooks/useAxiosAuth";
import UserListItem from "./UserListItem";
import Pagination from "./Pagination";

function UsersList() {
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(-1);
  const usersPerPage = 5;

  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const axios = useAxiosAuth();

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);
        const response = await axios.get(
          `/users?page=${currentPage}&limit=${usersPerPage}`
        );
        setUsers(response.data.users);
        setTotalPages(response.data.totalPages);
        setLoading(false);
      } catch (error) {
        console.error(error);
      }
    };

    fetchUsers();
  }, [axios, currentPage]);

  if (loading) {
    return <Loading />;
  }

  return (
    <div>
      <h1>Lista użytkowników</h1>
      {users.map((user) => (
        <UserListItem user={user} />
      ))}
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        setCurrentPage={setCurrentPage}
      />
    </div>
  );
}

export default UsersList;
