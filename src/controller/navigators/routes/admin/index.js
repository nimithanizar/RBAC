import { Spin } from 'antd';
import React, { lazy, Suspense, useEffect, useMemo } from 'react';
import { Route, Routes, useLocation } from 'react-router-dom';
import Dashboard from './dashboard';
import withAdminLayout from '../../../../layout/withAdminLayout';
import { useCurrentUser } from '../../../../model/queryCalls/queryCalls';

const Roles = lazy(() => import('../../../../container/roles'));
const AddRole = lazy(() => import('../../../../container/roles/addRoles'));
const Users = lazy(() => import('../../../../container/users/index'));
const AddUser = lazy(() => import('../../../../container/users/addUsers'));

const Admin = React.memo(() => {
  const { data } = useCurrentUser();
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  const routes = useMemo(() => {
    const userRoutes = [
      { path: '/*', element: <Dashboard /> },
      { path: 'users/*', element: <Users /> },
      { path: 'users/addNewUser', element: <AddUser /> },
      { path: 'users/editUser/:id', element: <AddUser /> },
      { path: 'roles/*', element: <Roles /> },
      { path: 'roles/addNewRole', element: <AddRole /> },
      { path: 'roles/editRole/:id', element: <AddRole /> },
    ];

    return userRoutes;
  }, [data?.permissions]);
  return (
    <Suspense
      fallback={
        <div className="spin flex items-center justify-center bg-white dark:bg-dark h-screen w-full fixed z-[999] ltr:left-0 rtl:right-0 top-0">
          <Spin />
        </div>
      }
    >
      <Routes>
        {routes.map((route, index) => (
          <Route key={index} path={route.path} element={route.element} />
        ))}
      </Routes>
    </Suspense>
  );
});

export default withAdminLayout(Admin);
