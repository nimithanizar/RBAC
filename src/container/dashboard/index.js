import React from 'react';
// import { Row, Col } from 'antd';
import { PageHeader } from '../../components/page-headers/page-headers';

function Dashboard() {
  const PageRoutes = [
    {
      path: null,
      breadcrumbName: 'Dashboard',
    },
    {
      path: 'first',
      breadcrumbName: 'Dashboard',
    },
  ];

  return (
    <>
      <PageHeader
        routes={PageRoutes}
        title="Dashboard"
        className="flex items-center justify-between px-8 xl:px-[15px] pt-2 pb-6 sm:pb-[30px] bg-transparent sm:flex-col"
      />
      {/* <GlobalUtilityStyle> */}
      <div className="welcome-section text-center my-6">
        <h1 className="text-2xl font-semibold">Welcome to Dashboard</h1>
        <p className="text-gray-500">Here you can visualize your data insights.</p>
      </div>
      {/* </GlobalUtilityStyle> */}
    </>
  );
}

export default Dashboard;
