import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Form, Input, Button, Row, Col } from 'antd';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';
import { AuthFormWrap } from './style';
import { app } from '../../../../controller/services/dbServices';
import Alert from '../../../../components/alerts/alerts';
import { AlertList } from '../../../styled';

function ConfirmPassword() {
  const navigate = useNavigate();
  const params = new URLSearchParams(window.location.search);
  const token = params.get('token');
  const tokenId = params.get('tokenId');
  const [loading, setLoading] = useState(false);
  const [passwordResetted, setPasswordResetted] = useState(false);
  const [passwordResettedError, setPasswordResettedError] = useState(false);
  const [incorrectPassword, setIncorrectPassword] = useState(false);
  const validationSchema = Yup.object().shape({
    password: Yup.string()
      .required('Please enter your password')
      .min(8, 'Password must be at least 8 characters long') // Minimum length
      .matches(/[a-z]/, 'Password must contain at least one lowercase letter') // At least one lowercase letter
      .matches(/[A-Z]/, 'Password must contain at least one uppercase letter') // At least one uppercase letter
      .matches(/[0-9]/, 'Password must contain at least one number') // At least one number
      .matches(/[@$!%*#?&]/, 'Password must contain at least one special character (@, $, !, %, *, #, ?, &)'), // At least one special character
    confirmPassword: Yup.string()
      .required('Please enter your password')
      .min(8, 'Password must be at least 8 characters long') // Minimum length
      .matches(/[a-z]/, 'Password must contain at least one lowercase letter') // At least one lowercase letter
      .matches(/[A-Z]/, 'Password must contain at least one uppercase letter') // At least one uppercase letter
      .matches(/[0-9]/, 'Password must contain at least one number') // At least one number
      .matches(/[@$!%*#?&]/, 'Password must contain at least one special character (@, $, !, %, *, #, ?, &)'), // At least one special character
  });

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(validationSchema),
  });

  const onResetPassword = async (data) => {
    setLoading(true);
    try {
      if (data.password === data.confirmPassword) {
        await app.emailPasswordAuth.resetPassword({
          password: data.password,
          token,
          tokenId,
        });
        setLoading(false);
        setPasswordResetted(true);
        setPasswordResettedError(false);
        setTimeout(() => {
          navigate('/');
        }, 2000);
      } else {
        setPasswordResetted(false);
        setLoading(false);
        setIncorrectPassword(true);
        setPasswordResettedError(false);
      }
    } catch (error) {
      setPasswordResetted(false);
      setLoading(false);
      setPasswordResettedError(true);
    }
  };

  return (
    <Row justify="center">
      {passwordResettedError ? (
        <AlertList className="gap-y-[15px] inline-flex flex-col w-full p-[25px]">
          <Alert
            closable
            message="Password Reset Error"
            description="There was an issue in resetting password . Please try again later ."
            type="error"
          />
        </AlertList>
      ) : (
        ''
      )}
      {incorrectPassword ? (
        <AlertList className="gap-y-[15px] inline-flex flex-col w-full p-[25px]">
          <Alert
            closable
            message="Incorrect Password"
            description="The password you entered is incorrect. Please double-check your password and try again."
            type="error"
          />
        </AlertList>
      ) : (
        ''
      )}
      {passwordResetted ? (
        <AlertList className="gap-y-[15px] inline-flex flex-col w-full p-[25px]">
          <Alert closable message="Password Reset Successful" description="" type="success" />
        </AlertList>
      ) : (
        ''
      )}
      <Col xxl={6} xl={8} md={12} sm={18} xs={24}>
        <AuthFormWrap className="mt-6 bg-white rounded-md dark:bg-white10 shadow-regular dark:shadow-none">
          <Form name="confirmPass" layout="vertical">
            <div className="px-5 py-4 text-center border-b border-gray-200 dark:border-white10">
              <h2 className="mb-0 text-xl font-semibold text-dark dark:text-white87">Confirm Password?</h2>
            </div>
            <div className="px-10 pt-8 pb-6">
              <p className="mb-4 dark:text-white60">Enter a new password.</p>
              <Controller
                name="password"
                control={control}
                render={({ field }) => (
                  <Form.Item
                    label="New Password"
                    validateStatus={errors.password ? 'error' : ''}
                    help={errors.password?.message}
                  >
                    <Input.Password {...field} placeholder="" />
                  </Form.Item>
                )}
              />

              <Controller
                name="confirmPassword"
                control={control}
                render={({ field }) => (
                  <Form.Item
                    label="Confirm New Password"
                    validateStatus={errors.confirmPassword ? 'error' : ''}
                    help={errors.confirmPassword?.message}
                  >
                    <Input.Password {...field} placeholder="" />
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
              <Form.Item>
                <Button
                  className="block w-full h-12 p-0 text-sm font-medium"
                  htmlType="submit"
                  type="primary"
                  size="large"
                  onClick={handleSubmit(onResetPassword)}
                  disabled={loading}
                >
                  {loading ? 'Changing' : `Change Password`}
                </Button>
              </Form.Item>
            </div>
            <div className="p-6 text-center bg-section dark:bg-white10 rounded-b-md">
              <p className="mb-0 text-sm font-medium text-body dark:text-white60">
                Return to
                <Link to="/" className="ltr:ml-1.5 rtl:mr-1.5 text-info hover:text-primary">
                  Sign In
                </Link>
              </p>
            </div>
          </Form>
        </AuthFormWrap>
      </Col>
    </Row>
  );
}

export default ConfirmPassword;
