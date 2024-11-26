import React, {
  lazy,
  // useEffect
} from 'react';
import {
  Route,
  Routes,
  //  useNavigate
} from 'react-router-dom';
import AuthLayout from '../../../container/profile/authentication/Index';

const Login = lazy(() => import('../../../container/profile/authentication/overview/SignIn'));
// const SignUp = lazy(() => import('../../../container/profile/authentication/overview/Signup'));
const ForgotPass = lazy(() => import('../../../container/profile/authentication/overview/ForgotPassword'));
const DeleteCustomer = lazy(() => import('../../../container/profile/authentication/overview/DeleteCustomer'));
const ConfirmPass = lazy(() => import('../../../container/profile/authentication/overview/ConfirmPassword'));
const AuthWithOTP = lazy(() => import('../../../container/profile/authentication/overview/AuthenticationWithOTP'));

// const AuthRoot = () => {
//   const navigate = useNavigate();

//   useEffect(() => navigate('/'));
// };

const FrontendRoutes = React.memo(() => {
  return (
    <Routes>
      <Route path="*" index element={<Login />} />
      <Route path="forgotPassword" element={<ForgotPass />} />
      <Route path="confirmPassword" element={<ConfirmPass />} />
      {/* <Route path="register" element={<SignUp />} /> */}
      <Route path="deleteCustomer" element={<DeleteCustomer />} />
      <Route path="2fa" element={<AuthWithOTP />} />
      {/* <Route path="*" element={<AuthRoot />} /> */}
    </Routes>
  );
});

export default AuthLayout(FrontendRoutes);
