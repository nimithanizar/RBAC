import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Row, Col, Form, Input, Button, Select, Spin, message } from 'antd';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';
// import { ReactSVG } from 'react-svg';
// import UilFacebook from '@iconscout/react-unicons/icons/uil-facebook-f';
// import UilTwitter from '@iconscout/react-unicons/icons/uil-twitter';
// import UilGithub from '@iconscout/react-unicons/icons/uil-github';

// import { useDispatch } from 'react-redux';
import { AuthFormWrap } from './style';
import { ObjectId, app, userRegister } from '../../../../controller/services/dbServices';
import { useRegisterRoles } from '../../../../model/queryCalls/queryCalls';
// import { Checkbox } from '../../../../components/checkbox/checkbox';
// import { register } from '../../../../redux/authentication/actionCreator';

function SignUp() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const { data: rolesData, isLoading } = useRegisterRoles();
  const [roleId, setRoleId] = useState(null);
  const [messageApi, contextHolder] = message.useMessage();
  const roleError = () => {
    messageApi.open({
      type: 'error',
      content: 'Please select a role before completing the registration process.',
      duration: 3,
    });
  };

  const loginError = () => {
    messageApi.open({
      type: 'error',
      content: 'Email is already in use. Please choose a different one.',
      duration: 3,
    });
  };

  const loginSuccess = () => {
    messageApi.open({
      type: 'success',
      content: 'Thank you for registering! You can now log in to your account.',
      duration: 5,
    });
  };

  const validationSchema = Yup.object().shape({
    email: Yup.string().email('Please enter a valid email').required('Please enter your email'),
    password: Yup.string()
      .required('Please enter your password')
      .min(8, 'Password must be at least 8 characters long') // Minimum length
      .matches(/[a-z]/, 'Password must contain at least one lowercase letter') // At least one lowercase letter
      .matches(/[A-Z]/, 'Password must contain at least one uppercase letter') // At least one uppercase letter
      .matches(/[0-9]/, 'Password must contain at least one number') // At least one number
      .matches(/[@$!%*#?&]/, 'Password must contain at least one special character (@, $, !, %, *, #, ?, &)'), // At least one special character
    firstName: Yup.string().required('Please enter your first name'),
    number: Yup.string()
      .matches(/^\d{10}$/, 'Please enter a valid 10-digit mobile number')
      .required('Mobile Number is required'),
  });

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(validationSchema),
  });

  const onSignUp = async (data) => {
    setLoading(true);
    try {
      if (roleId !== null) {
        await app.emailPasswordAuth.registerUser({ email: data.email, password: data.password });
        await userRegister({ data, roleId: new ObjectId(roleId) });
        loginSuccess();
        setTimeout(() => {
          navigate('/');
          setLoading(false);
        }, 1000);
      } else {
        roleError();
        setLoading(false);
      }
    } catch (error) {
      setLoading(false);
      loginError();
    }
  };

  const handleChange = (value) => {
    setRoleId(value);
  };

  return (
    <Row justify="center">
      {contextHolder}
      {isLoading ? (
        <div className="flex justify-center align-center">
          <Spin />
        </div>
      ) : (
        <Col xxl={6} xl={8} md={12} sm={18} xs={24}>
          <AuthFormWrap className="mt-6 bg-white rounded-md dark:bg-white10 shadow-regular dark:shadow-none">
            <div className="px-5 py-4 text-center border-b border-gray-200 dark:border-white10">
              <h2 className="mb-0 text-xl font-semibold text-dark dark:text-white87">Sign Up RBAC</h2>
            </div>
            <div className="px-10 pt-8 pb-6">
              <Form name="register" layout="vertical">
                <Controller
                  name="firstName"
                  control={control}
                  render={({ field }) => (
                    <Form.Item
                      label="First Name *"
                      validateStatus={errors.firstName ? 'error' : ''}
                      help={errors.firstName?.message}
                      className="[&>div>div>label]:text-sm [&>div>div>label]:text-dark dark:[&>div>div>label]:text-white60 [&>div>div>label]:font-medium"
                    >
                      <Input {...field} placeholder="Enter your first name" />
                    </Form.Item>
                  )}
                />
                <Controller
                  name="lastName"
                  control={control}
                  render={({ field }) => (
                    <Form.Item
                      label="Last Name"
                      validateStatus={errors.lastName ? 'error' : ''}
                      help={errors.lastName?.message}
                      className="[&>div>div>label]:text-sm [&>div>div>label]:text-dark dark:[&>div>div>label]:text-white60 [&>div>div>label]:font-medium"
                    >
                      <Input {...field} placeholder="Enter your last name" />
                    </Form.Item>
                  )}
                />
                <Controller
                  name="number"
                  control={control}
                  render={({ field }) => (
                    <Form.Item
                      label="Mobile Number *"
                      validateStatus={errors.number ? 'error' : ''}
                      help={errors.number?.message}
                      className="[&>div>div>label]:text-sm [&>div>div>label]:text-dark dark:[&>div>div>label]:text-white60 [&>div>div>label]:font-medium"
                    >
                      <Input {...field} placeholder="Enter your 10 digit number" addonBefore="+91" />
                    </Form.Item>
                  )}
                />
                <Controller
                  name="email"
                  control={control}
                  render={({ field }) => (
                    <Form.Item
                      label="Email Address *"
                      validateStatus={errors.email ? 'error' : ''}
                      help={errors.email?.message}
                      className="[&>div>div>label]:text-sm [&>div>div>label]:text-dark dark:[&>div>div>label]:text-white60 [&>div>div>label]:font-medium"
                    >
                      <Input {...field} placeholder="Enter you email" />
                    </Form.Item>
                  )}
                />
                <Form.Item
                  label="Role *"
                  className="[&>div>div>label]:text-sm [&>div>div>label]:text-dark dark:[&>div>div>label]:text-white60 [&>div>div>label]:font-medium"
                >
                  <Select
                    showSearch
                    size="middle"
                    onChange={handleChange}
                    placeholder="Select Role"
                    style={{
                      width: '100%',
                    }}
                    options={rolesData || []}
                  />
                </Form.Item>

                <Controller
                  name="password"
                  control={control}
                  render={({ field }) => (
                    <Form.Item
                      label="Password *"
                      validateStatus={errors.password ? 'error' : ''}
                      help={errors.password?.message}
                      className="[&>div>div>label]:text-sm [&>div>div>label]:text-dark dark:[&>div>div>label]:text-white60 [&>div>div>label]:font-medium"
                    >
                      <Input.Password {...field} placeholder="Password" />
                    </Form.Item>
                  )}
                />
                <div className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                  <p>Password must contain:</p>
                  <ul className="list-disc pl-5 space-y-1">
                    <li>At least 8 characters</li>
                    <li>At least one uppercase letter (A-Z)</li>
                    <li>At least one lowercase letter (a-z)</li>
                    <li>At least one number (0-9)</li>
                    <li>At least one special character (@, $, !, %, *, #, ?, &)</li>
                  </ul>
                </div>
                {/* <div className="flex items-center justify-between">
                <Checkbox onChange={onChange} checked={state.checked}>
                  Creating an account means you’re okay with our Terms of Service and Privacy Policy
                </Checkbox>
              </div> */}
                <Form.Item>
                  <Button
                    className="w-full h-12 p-0 my-6 text-sm font-medium"
                    htmlType="submit"
                    type="primary"
                    size="large"
                    onClick={handleSubmit(onSignUp)}
                    disabled={loading}
                  >
                    {loading ? `Creating...` : `Create Account`}
                  </Button>
                </Form.Item>
                {/* <p className="relative text-body dark:text-white60 -mt-2.5 mb-6 text-center text-13 font-medium before:absolute before:w-full before:h-px ltr:before:left-0 rtl:before:right-0 before:top-1/2 before:-translate-y-1/2 before:z-10 before:bg-gray-200 dark:before:bg-white10">
                <span className="relative z-20 px-4 bg-white dark:bg-[#1b1d2a]">Or</span>
              </p>
              <ul className="flex items-center justify-center mb-0">
                <li className="px-1.5 pt-3 pb-2.5">
                  <Link
                    to="#"
                    className="flex items-center justify-center h-12 px-4 rounded-md google-social bg-google-plus-transparent hover:bg-google-plus text-google-plus hover:text-white"
                  >
                    <ReactSVG
                      className="[&>div>svg>path]:fill-google-plus group-hover:[&>div>svg>path]:fill-white"
                      src={require(`../../../../static/img/icon/google-plus.svg`).default}
                    />
                  </Link>
                </li>
                <li className="px-1.5 pt-3 pb-2.5">
                  <Link
                    to="#"
                    className="flex items-center justify-center h-12 px-4 rounded-md facebook-social bg-facebook-transparent hover:bg-facebook text-facebook hover:text-white"
                  >
                    <UilFacebook />
                  </Link>
                </li>
                <li className="px-1.5 pt-3 pb-2.5">
                  <Link
                    to="#"
                    className="flex items-center justify-center h-12 px-4 rounded-md twitter-social bg-twitter-transparent hover:bg-twitter text-twitter hover:text-white"
                  >
                    <UilTwitter />
                  </Link>
                </li>
                <li className="px-1.5 pt-3 pb-2.5">
                  <Link
                    to="#"
                    className="flex items-center justify-center h-12 px-4 rounded-md github-social bg-github-transparent hover:bg-github text-github hover:text-white"
                  >
                    <UilGithub />
                  </Link>
                </li>
              </ul> */}
              </Form>
            </div>
            <div className="p-6 text-center bg-gray-100 dark:bg-white10 rounded-b-md">
              <p className="mb-0 text-sm font-medium text-body dark:text-white60">
                Already have an account?
                <Link to="/" className="ltr:ml-1.5 rtl:mr-1.5 text-info hover:text-primary">
                  Sign In
                </Link>
              </p>
            </div>
          </AuthFormWrap>
        </Col>
      )}
    </Row>
  );
}

export default SignUp;
