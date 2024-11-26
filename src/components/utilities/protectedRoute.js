import propTypes from 'prop-types';
import React, { useContext } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import { UserContext } from '../../controller/context/userContext';

function ProtectedRoute({ Component, path }) {
  const { user, isVerified } = useContext(UserContext);
  // const isVerified = JSON.parse(localStorage.getItem('isVerified'));
  // const isVerified = JSON.parse(localStorage.getItem('isVerified'));

  if (!user || user.providerType !== 'local-userpass' || !isVerified) {
    return <Navigate to="/2fa" replace />;
  }

  return (
    <Routes>
      <Route path={path} element={<Component />} />
    </Routes>
  );
}

ProtectedRoute.propTypes = {
  Component: propTypes.object.isRequired,
  path: propTypes.string.isRequired,
};

export default ProtectedRoute;
