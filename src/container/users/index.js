/* eslint-disable no-underscore-dangle */
import React, { useState } from 'react';
import { Table, Typography, Space, Modal, Skeleton, message, Input, Button } from 'antd';
import { useNavigate } from 'react-router-dom';
import { PageHeader } from '../../components/page-headers/page-headers';
import { GlobalUtilityStyle } from '../styled';
import { useUsers, useCurrentUser } from '../../model/queryCalls/queryCalls';
import { DeleteUser } from '../../controller/services/dbServices';
import { useDebounce } from '../../controller/hooks/useDebounce';

const users = () => {
  const navigate = useNavigate();
  const { data } = useCurrentUser();
  const [open, setOpen] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);
  const [messageApi, contextHolder] = message.useMessage();
  const [searchTerm, setSearchTerm] = useState('');
  const PageRoutes = [
    {
      path: 'index',
      breadcrumbName: 'Users Manage',
    },
    {
      path: 'first',
      breadcrumbName: 'Users',
    },
  ];

  const debouncedSearchTerm = useDebounce(searchTerm, 500);

  const { data: usersData, isLoading, refetch, isRefetching } = useUsers({ search: debouncedSearchTerm });
  const onDelete = async () => {
    setConfirmLoading(true);
    try {
      const result = await DeleteUser({ id: deleteId });
      // console.log('user Deleted', result);
      if (result) {
        refetch();
        setConfirmLoading(false);
        setOpen(false);
      } else {
        setConfirmLoading(false);
        setOpen(false);
        messageApi.open({
          type: 'error',
          content: 'Ensure that at least one user retains the Super Administrator role at all times.',
          duration: 2,
        });
      }
    } catch (error) {
      setConfirmLoading(false);
      setOpen(false);
    }
  };

  const handleCancel = () => {
    setOpen(false);
    setDeleteId(null);
  };

  const handleChangePage = (page) => {
    setCurrentPage(page);
  };

  const handleChangePageSize = (current, size) => {
    setPageSize(size);
    setCurrentPage(current);
  };

  const columns = [
    {
      title: 'Name',
      key: 'name',
      render: (text) => <a>{`${text?.firstName} ${text?.lastName ? text?.lastName : ''}`}</a>,
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
      render: (text) => <a>{text}</a>,
      responsive: ['lg', 'md'],
    },
    {
      title: 'Mobile Number',
      dataIndex: 'number',
      key: 'number',
      render: (text) => <a>{`+91 ${text}`}</a>,
      responsive: ['lg', 'md'],
    },
    {
      title: 'Role',
      dataIndex: 'getRole',
      key: 'getRole',
      render: (getRole) => (
        <span>
          {getRole.map((role, index) => (
            <span key={index}>
              {index > 0 && ' , '}
              {role.name}
            </span>
          ))}
        </span>
      ),
      responsive: ['lg', 'md'],
    },
  ];

  if (data?.permissions.includes('usersReadWrite')) {
    columns.push({
      title: 'Action',
      width: 150,
      fixed: 'right',
      render: (item) => (
        <Space>
          <Typography.Link onClick={() => navigate(`/admin/users/editUser/${item?._id}`)}>Edit</Typography.Link>
          <Typography.Link
            onClick={() => {
              setDeleteId(item?._id);
              setOpen(true);
            }}
          >
            Delete
          </Typography.Link>
        </Space>
      ),
    });
  }

  const paginationConfig = {
    current: currentPage,
    pageSize,
    total: usersData?.length,
    onChange: handleChangePage,
    showSizeChanger: true,
    onShowSizeChange: (current, size) => handleChangePageSize(current, size),
    pageSizeOptions: ['5', '10', '50', '100', '500'],
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  return (
    <>
      <PageHeader
        routes={PageRoutes}
        title="Users Manage"
        className="flex items-center justify-between px-8 xl:px-[15px] pt-2 pb-6 sm:pb-[30px] bg-transparent sm:flex-col"
      />
      {contextHolder}
      <Modal title="Warning!" open={open} onOk={onDelete} confirmLoading={confirmLoading} onCancel={handleCancel}>
        <p>Are you sure ?</p>
      </Modal>
      <GlobalUtilityStyle>
        <div className="min-h-[715px] lg:min-h-[580px] flex-1 h-auto px-8 xl:px-[15px] pb-[30px] bg-transparent">
          <div className="flex justify-between items-center pb-6 sm:pb-[30px] bg-transparent sm:flex-col">
            <Input placeholder="Search With Email" onChange={handleSearchChange} className="w-[250px] h-10" />
            <Button
              style={{
                width: '100px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
              // className="h-10 p-0 text-sm font-medium"
              htmlType="submit"
              type="primary"
              size="medium"
              onClick={(e) => {
                e.stopPropagation(); // Prevent row click event
                navigate(`/admin/users/addNewUser`);
              }}
            >
              Add
            </Button>
          </div>
          {isLoading ? (
            <Skeleton active paragraph={{ rows: 6 }} />
          ) : (
            <Table
              columns={columns}
              dataSource={usersData?.slice((currentPage - 1) * pageSize, currentPage * pageSize)}
              pagination={paginationConfig}
              loading={isRefetching}
            />
          )}
        </div>
      </GlobalUtilityStyle>
    </>
  );
};

export default users;
