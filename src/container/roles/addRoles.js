/* eslint-disable no-else-return */
/* eslint-disable react/jsx-boolean-value */
/* eslint-disable no-underscore-dangle */
/* eslint-disable no-lonely-if */
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Form, Input, Button, Col, Skeleton, message, List, Radio, Card } from 'antd';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';
import { PageHeader } from '../../components/page-headers/page-headers';
import { GlobalUtilityStyle } from '../styled';
import { useOneRole } from '../../model/queryCalls/queryCalls';
import { AddRole, UpdateRole } from '../../controller/services/dbServices';
import envConfig from '../../env/env.json';

const addRoles = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [messageApi, contextHolder] = message.useMessage();
  const [isLoading, setIsLoading] = useState(false);
  const [selectedPermissions, setSelectedPermissions] = useState([]);
  const { data: oneRoleData, isSuccess, isLoading: onRoleLoading } = useOneRole({ id });

  const PageRoutes = [
    {
      path: 'index',
      breadcrumbName: 'Roles Manage',
    },
    {
      path: 'first',
      breadcrumbName: id ? 'Edit Role' : 'Add Role',
    },
  ];

  const Error = () => {
    messageApi.open({
      type: 'error',
      content: 'Error Occurred!',
      duration: 3,
    });
  };

  const emptyPermissionError = () => {
    messageApi.open({
      type: 'error',
      content: 'Please Select Permissions!',
      duration: 3,
    });
  };

  const validationSchema = Yup.object().shape({
    name: Yup.string().required('Please enter role name'),
  });

  const {
    control,
    setValue,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(validationSchema),
  });

  // useEffect(() => {
  //   setValue('name', oneRoleData?.name);
  //   if (oneRoleData) {
  //     selectedPermissions(oneRoleData.getPermissions.map((permission) => permission._id.toString()) || []);
  //   }
  // }, [isSuccess]);

  useEffect(() => {
    if (id && isSuccess) {
      // When id is present and data loading is successful, set the values for editing
      setValue('name', oneRoleData?.name);
      const permissions = oneRoleData?.permissions || [];
      setSelectedPermissions(permissions);
    } else {
      // Reset the form and permissions when there's no id, i.e., for AddRole
      setValue('name', '');
      setSelectedPermissions([]);
    }
  }, [id, isSuccess, oneRoleData, setValue]);

  const onRoleAdding = async (data) => {
    setIsLoading(true);
    try {
      if (id) {
        if (selectedPermissions?.length > 0) {
          await UpdateRole({ id, data, permissions: selectedPermissions });
          setIsLoading(false);
          navigate('/admin/roles');
        } else {
          emptyPermissionError();
          setIsLoading(false);
        }
      } else {
        if (selectedPermissions?.length > 0) {
          const result = await AddRole({ data, permissions: selectedPermissions });
          if (result === false) {
            setIsLoading(false);
            messageApi.open({
              type: 'error',
              content: 'Role name already exists!',
              duration: 3,
            });
          } else {
            setIsLoading(false);
            navigate('/admin/roles');
          }
        } else {
          emptyPermissionError();
          setIsLoading(false);
        }
      }
    } catch (error) {
      setIsLoading(false);
      Error();
    }
  };

  const handleRadioChange = (page, permissionType) => {
    let updatedPermissions = [...selectedPermissions];
    const permissionMappings = {
      read: envConfig?.PERMISSIONS.find((p) => p.page === page)?.read,
      readWrite: envConfig?.PERMISSIONS.find((p) => p.page === page)?.readWrite,
      noPermission: null,
    };
    const newPermission = permissionMappings[permissionType];

    // Remove old permissions related to this page
    updatedPermissions = updatedPermissions?.filter((p) => !Object.values(permissionMappings).includes(p));

    // If it's not "noPermission", add the new permission
    if (newPermission) {
      updatedPermissions.push(newPermission);
    }

    setSelectedPermissions(updatedPermissions);
  };
  const radioOptions = [
    {
      label: 'Read',
      value: 'read',
    },
    {
      label: 'Read And Write',
      value: 'readWrite',
    },
    {
      label: 'No Permission',
      value: 'noPermission',
    },
  ];

  const getInitialValue = (page) => {
    const readPermission = envConfig?.PERMISSIONS.find((p) => p.page === page)?.read;
    const readWritePermission = envConfig?.PERMISSIONS.find((p) => p.page === page)?.readWrite;
    if (selectedPermissions?.includes(readWritePermission)) {
      return 'readWrite';
    } else if (selectedPermissions?.includes(readPermission)) {
      return 'read';
    } else {
      return 'noPermission';
    }
  };

  return (
    <>
      <PageHeader
        routes={PageRoutes}
        title={id ? 'Edit Role' : 'Add Role'}
        className="flex items-center justify-between px-8 xl:px-[15px] pt-2 pb-6 sm:pb-[30px] bg-transparent sm:flex-col"
      />
      {contextHolder}
      <GlobalUtilityStyle>
        <div className="min-h-[715px] lg:min-h-[580px] flex-1 h-auto px-8 xl:px-[15px] pb-[30px] bg-transparent">
          {onRoleLoading ? (
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
                        name="name"
                        control={control}
                        render={({ field }) => (
                          <Form.Item
                            label="Role Name *"
                            validateStatus={errors.name ? 'error' : ''}
                            help={errors.name?.message}
                            className="[&>div>div>label]:text-sm [&>div>div>label]:text-dark dark:[&>div>div>label]:text-white60 [&>div>div>label]:font-medium"
                          >
                            <Input
                              {...field}
                              placeholder="Super Administrator"
                              className="h-10 px-3 placeholder-gray-400"
                            />
                          </Form.Item>
                        )}
                      />

                      <Form.Item
                        label="Select Permissions *"
                        className="[&>div>div>label]:text-sm [&>div>div>label]:text-dark dark:[&>div>div>label]:text-white60 [&>div>div>label]:font-medium"
                      >
                        <Card>
                          <List
                            itemLayout="horizontal"
                            dataSource={envConfig?.PERMISSIONS || []}
                            bordered={true}
                            size="small"
                            renderItem={(item, index) => (
                              <List.Item
                                actions={[
                                  <Radio.Group
                                    options={radioOptions}
                                    onChange={(e) => handleRadioChange(item.page, e.target.value)}
                                    value={getInitialValue(item.page)}
                                  />,
                                ]}
                              >
                                <List.Item.Meta title={item.page} key={index} />
                              </List.Item>
                            )}
                          />
                        </Card>
                      </Form.Item>

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
                            onClick={handleSubmit(onRoleAdding)}
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
