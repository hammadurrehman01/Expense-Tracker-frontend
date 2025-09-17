"use client"

import { useSelector } from "react-redux";

const Dashboard = () => {
  const user = useSelector((state: any) => state?.auth?.user);

  return <div>{user.user.name}</div>;
};

export default Dashboard;
