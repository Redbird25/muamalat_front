import React from 'react';
import {Outlet} from "react-router-dom";
import CustomSidebar from "./CustomSidebar";

const DashboardLayout = () => {
  return (
    <>
      <div className="container">
        <div className="row flex-lg-nowrap">
          <CustomSidebar/>
          
          <div className="w-xl-80 w-lg-70 flex-fill custom-min-h-100-dvh">
            <Outlet/>
          </div>
        </div>
      </div>
    </>
  );
};

export default DashboardLayout;
