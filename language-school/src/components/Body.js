import React from "react";
import { Outlet } from "react-router-dom";

const Body = () => {
  return (
    <main>
      <Outlet />
    </main>
  );
};

export default Body;
