/* eslint-disable no-unused-vars */
import React, { useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Form, Input, Button, Row, Col, message, Typography } from 'antd';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';
import { UserContext } from '../../../../controller/context/userContext';
import { verifyOTP, sendEmailAfterLogin } from '../../../../controller/services/dbServices';

const { Text } = Typography;

function AuthenticationWithOTP() {
  const navigate = useNavigate();
  const [messageApi, contextHolder] = message.useMessage();
  const { user } = useContext(UserContext);
  const [isLoading, setIsLoading] = useState(false);
  const [canResend, setCanResend] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  const [countdown, setCountdown] = useState(60); // Countdown in seconds

  useEffect(() => {
    // Start a countdown for the resend button cooldown
    let timer = null;
    if (!canResend) {
      timer = setInterval(() => {
        setCountdown((prevCountdown) => {
          if (prevCountdown <= 1) {
            clearInterval(timer);
            setCanResend(true);
            return 60; // Reset for next use
          }
          return prevCountdown - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [canResend]);

  const validationSchema = Yup.object().shape({
    otp: Yup.string()
      .required('OTP is required')
      .matches(/^\d{6}$/, 'OTP must be exactly 6 digits and numeric'),
  });

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(validationSchema),
  });

  const emailVerifyOTPSuccess = (title) => {
    messageApi.open({
      type: 'success',
      content: title,
      duration: 3,
    });
  };

  const verifyOTPError = (title) => {
    messageApi.open({
      type: 'error',
      content: title,
      duration: 3,
    });
  };

  const onVerifyOtp = async (data) => {
    setIsLoading(true);
    try {
      const result = await verifyOTP({ email: user?.profile?.email, submittedOtp: data.otp });
      if (result.verified === true) {
        localStorage.setItem('isVerified', JSON.stringify(true));
        emailVerifyOTPSuccess(result.message);
        setIsLoading(false);
        // navigate('/admin');
        setTimeout(() => {
          window.location.reload();
        }, 1000);
      }
      if (result.verified === false) {
        verifyOTPError(result.message);
        setIsLoading(false);
      }
    } catch (error) {
      verifyOTPError(error.message);
      setIsLoading(false);
    }
  };

  const onResendOtp = async () => {
    try {
      if (!canResend) return;
      setResendLoading(true);
      const isEmailSent = await sendEmailAfterLogin({ toEmail: user?.profile?.email });
      if (isEmailSent.status === 202) {
        emailVerifyOTPSuccess('A new OTP has been sent to your email.');
        setResendLoading(false);
        setCanResend(false);
        setCountdown(60);
      }
    } catch (error) {
      setResendLoading(false);
      setCanResend(false);
      setCountdown(60);
      verifyOTPError('Failed to resend OTP.');
    }
  };

  return (
    <Row justify="center">
      <Col xxl={6} xl={8} md={12} sm={18} xs={24}>
        {contextHolder}
        <div className="mt-6 bg-white rounded-md shadow-regular p-4">
          <div className="text-center border-b border-gray-200 pb-4">
            <h2 className="mb-2 text-xl font-semibold">Two Factor Authentication</h2>
            <Text>
              Check Your Email: We&apos; sent a 6-digit verification code. Please enter it below to verify your account
              - {user?.profile?.email}.
            </Text>
          </div>
          <Form name="otpVerification" layout="vertical" className="mt-4">
            <Controller
              name="otp"
              control={control}
              render={({ field }) => (
                <Form.Item label="Enter OTP *" validateStatus={errors.otp ? 'error' : ''} help={errors.otp?.message}>
                  <Input {...field} maxLength={6} className="h-10 px-3" />
                </Form.Item>
              )}
            />
            <Form.Item>
              <Button
                className="w-full h-12 my-2"
                type="primary"
                size="large"
                loading={isLoading}
                onClick={handleSubmit(onVerifyOtp)}
              >
                Verify OTP
              </Button>
              <Button className="w-full" disabled={!canResend} loading={resendLoading} onClick={onResendOtp}>
                Resend OTP {canResend ? '' : `(${countdown})`}
              </Button>
            </Form.Item>
          </Form>
        </div>
      </Col>
    </Row>
  );
}

export default AuthenticationWithOTP;
