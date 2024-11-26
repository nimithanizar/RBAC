import React, { useState } from 'react';
import { Form, Input, Button, Row, Col } from 'antd';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';
import { AuthFormWrap } from './style';
// import { app } from '../../../../controller/services/dbServices';
import Alert from '../../../../components/alerts/alerts';
import { AlertList } from '../../../styled';

function deleteCustomer() {
  const [loading, setLoading] = useState(false);
  const [emailSended, setEmailSended] = useState(false);
  const [emailSendingError, setEmailSendingError] = useState(false);
  const validationSchema = Yup.object().shape({
    email: Yup.string().email('Please Enter a Valid Email').required('Please Enter Your Email'),
  });

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(validationSchema),
  });

  const onSendEmail = async () => {
    setLoading(true);
    try {
      // await app.emailPasswordAuth.sendResetPasswordEmail({
      //   email: data.email,
      // });
      setLoading(false);
      setEmailSended(true);
      setEmailSendingError(false);
    } catch (error) {
      setEmailSended(false);
      setLoading(false);
      setEmailSendingError(true);
    }
  };

  return (
    <Row justify="center">
      {emailSendingError ? (
        <AlertList className="gap-y-[15px] inline-flex flex-col w-full p-[25px]">
          <Alert
            closable
            message="Failed to Delete Account"
            description="There was an issue in deleting the account linked to your email. Please try again later or contact support for assistance."
            type="error"
          />
        </AlertList>
      ) : (
        ''
      )}
      {emailSended ? (
        <AlertList className="gap-y-[15px] inline-flex flex-col w-full p-[25px]">
          <Alert
            closable
            message="Email Sent Successfully"
            description="we will notify onces the account is deleted."
            type="success"
          />
        </AlertList>
      ) : (
        ''
      )}
      <Col xxl={6} xl={8} md={12} sm={18} xs={24}>
        <AuthFormWrap className="mt-6 bg-white rounded-md dark:bg-white10 shadow-regular dark:shadow-none">
          <Form name="forgotPass" layout="vertical">
            <div className="px-5 py-4 text-center border-b border-gray-200 dark:border-white10">
              <h2 className="mb-0 text-xl font-semibold text-dark dark:text-white87">Delete Account</h2>
            </div>
            <div className="px-10 pt-8 pb-6">
              <p className="mb-4 dark:text-white60">
                Please provide the email address associated with your account, and we will notify onces the account is
                deleted
              </p>

              <Controller
                name="email"
                control={control}
                render={({ field }) => (
                  <Form.Item
                    label="Email Address"
                    validateStatus={errors.email ? 'error' : ''}
                    help={errors.email?.message}
                  >
                    <Input {...field} className="h-10 px-3 placeholder-gray-400" />
                  </Form.Item>
                )}
              />

              <Form.Item>
                <Button
                  className="block w-full h-12 p-0 text-sm font-medium"
                  htmlType="submit"
                  type="primary"
                  size="large"
                  onClick={handleSubmit(onSendEmail)}
                  disabled={loading}
                >
                  {loading ? 'Deleting Account' : 'Delete Account'}
                </Button>
              </Form.Item>
            </div>
          </Form>
        </AuthFormWrap>
      </Col>
    </Row>
  );
}

export default deleteCustomer;
