/* eslint-disable no-unused-vars */
/* eslint-disable no-underscore-dangle */
/* eslint-disable no-lonely-if */
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Form, Input, Button, Col, Select, Skeleton, message } from 'antd';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';
import { PageHeader } from '../../components/page-headers/page-headers';
import { GlobalUtilityStyle } from '../styled';
import { ObjectId, app, userAddWithRole, userUpdateWithRole } from '../../controller/services/dbServices';
import { useUserRegisterRoles, useOneUser } from '../../model/queryCalls/queryCalls';

const addRoles = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [messageApi, contextHolder] = message.useMessage();
  const [isLoading, setIsLoading] = useState(false);
  const [roleId, setRoleId] = useState(null);
  const { data: userRolesData, isLoading: userRolesLoading } = useUserRegisterRoles();
  const { data: editData, isLoading: editLoading, isSuccess, refetch } = useOneUser({ id });

  const PageRoutes = [
    {
      path: 'index',
      breadcrumbName: 'Users Manage',
    },
    {
      path: 'first',
      breadcrumbName: id ? 'Edit User' : 'Add User',
    },
  ];

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

  const loginSuccess = (title) => {
    messageApi.open({
      type: 'success',
      content: title,
      duration: 5,
    });
  };

  const addValidationSchema = Yup.object().shape({
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
      .matches(/^\d{10}$/, 'Please enter a valid 10-digit number')
      .required('mobile number is required'),
  });
  const updateValidationSchema = Yup.object().shape({
    firstName: Yup.string().required('Please enter your first name'),
    number: Yup.string()
      .matches(/^\d{10}$/, 'Please enter a valid 10-digit number')
      .required('mobile number is required'),
  });

  const {
    control,
    setValue,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(id ? updateValidationSchema : addValidationSchema),
  });

  const onSignUp = async (data) => {
    setIsLoading(true);
    try {
      if (roleId !== null) {
        if (id) {
          const result = await userUpdateWithRole({ id, data, roleId });
          if (result) {
            loginSuccess('user updated successfully!');
            setTimeout(() => {
              refetch();
              setIsLoading(false);
              navigate('/admin/users');
            }, 1000);
          } else {
            setIsLoading(false);
            messageApi.open({
              type: 'error',
              content: 'Ensure that at least one user retains the Super Administrator role at all times.',
              duration: 3,
            });
          }
        } else {
          await app.emailPasswordAuth.registerUser({ email: data.email, password: data.password });
          await userAddWithRole({ data, roleId });
          loginSuccess('new user created successfully!');
          setTimeout(() => {
            refetch();
            setIsLoading(false);
            navigate('/admin/users');
          }, 1000);
        }
      } else {
        roleError();
        setIsLoading(false);
      }
    } catch (error) {
      setIsLoading(false);
      loginError();
    }
  };

  // useEffect(() => {
  //   setValue('firstName', editData?.firstName);
  //   setValue('lastName', editData?.lastName);
  //   setValue('number', editData?.number);
  //   if (editData?.getRole?.length > 0) {
  //     setRoleId(editData?.getRole[0]?._id?.toString());
  //   }
  // }, [isSuccess]);

  useEffect(() => {
    if (id && editData) {
      setValue('firstName', editData?.firstName);
      setValue('lastName', editData?.lastName);
      setValue('number', editData?.number);
      if (editData?.getRole?.length > 0) {
        setRoleId(editData?.getRole[0]?._id?.toString());
      }
    } else {
      // Reset the form and permissions when there's no id, i.e., for AddRole
      setValue('firstName', '');
      setValue('lastName', '');
      setValue('number', '');
      setRoleId(null);
    }
  }, [id, isSuccess, editData, setValue]);
  const handleChange = (value) => {
    setRoleId(value);
  };
  return (
    <>
      <PageHeader
        routes={PageRoutes}
        title={id ? 'Edit User' : 'Add User'}
        className="flex items-center justify-between px-8 xl:px-[15px] pt-2 pb-6 sm:pb-[30px] bg-transparent sm:flex-col"
      />
      {contextHolder}
      <GlobalUtilityStyle>
        <div className="min-h-[715px] lg:min-h-[580px] flex-1 h-auto px-8 xl:px-[15px] pb-[30px] bg-transparent">
          {editLoading || userRolesLoading ? (
            <div className="flex justify-center align-center">
              <Skeleton active paragraph={{ rows: 6 }} />
            </div>
          ) : (
            <div className="flex justify-center ">
              <Col xxl={24} xl={24} md={24} sm={18} xs={24}>
                <div className="bg-white rounded-md dark:bg-white10 shadow-regular dark:shadow-none">
                  <div className="px-10 pt-8 pb-6">
                    <Form name="login" layout="vertical">
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
                          options={userRolesData || []}
                          value={roleId}
                        />
                      </Form.Item>
                      {id ? null : (
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
                              <Input {...field} placeholder="Enter you email" autoComplete="off" />
                            </Form.Item>
                          )}
                        />
                      )}

                      {id ? null : (
                        <>
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
                                <Input.Password
                                  {...field}
                                  placeholder="Password"
                                  autoComplete="new-password"
                                  autoCorrect="off"
                                  autoCapitalize="none"
                                  spellCheck="false"
                                />
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
                        </>
                      )}
                      <Form.Item className="w-full justify-center">
                        <div className="flex flex-row gap-5 justify-center">
                          <Button
                            className="w-[100px] h-10 p-0 my-6 text-sm font-medium"
                            htmlType="submit"
                            type="primary"
                            size="small"
                            onClick={() => navigate(-1)}
                          >
                            Back
                          </Button>
                          <Button
                            className="w-[100px] h-10 p-0 my-6 text-sm font-medium"
                            htmlType="submit"
                            type="primary"
                            size="small"
                            onClick={handleSubmit(onSignUp)}
                            disabled={isLoading}
                          >
                            {isLoading ? 'Saving...' : 'Save'}
                          </Button>
                        </div>
                      </Form.Item>
                    </Form>
                  </div>
                </div>
              </Col>
            </div>
          )}
        </div>
      </GlobalUtilityStyle>
    </>
  );
};

export default addRoles;
