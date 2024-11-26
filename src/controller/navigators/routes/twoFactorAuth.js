import React, {
  lazy,
  //  useEffect
} from 'react';
import {
  Route,
  Routes,
  //  useNavigate
} from 'react-router-dom';
import AuthLayout from '../../../container/profile/authentication/Index';

const AuthWithOTP = lazy(() => import('../../../container/profile/authentication/overview/AuthenticationWithOTP'));

// const AuthRoot = () => {
//   // const navigate = useNavigate();
//   // useEffect(() => navigate('/2fa'));
// };

const FrontendRoutes = React.memo(() => {
  return (
    <Routes>
      {/* <Route path="*" element={<AuthRoot />} /> */}
      <Route path="*" element={<AuthWithOTP />} />
    </Routes>
  );
});

export default AuthLayout(FrontendRoutes);
