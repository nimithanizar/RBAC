/* eslint-disable no-underscore-dangle */
import React, { useState } from 'react';
import { Table, Typography, Space, Modal, Skeleton, Tag, Input, Button } from 'antd';
import { useNavigate } from 'react-router-dom';
import { PageHeader } from '../../components/page-headers/page-headers';
import { GlobalUtilityStyle } from '../styled';
import { useRoles, useCurrentUser } from '../../model/queryCalls/queryCalls';
import { DeleteRole } from '../../controller/services/dbServices';
import envConfig from '../../env/env.json';
import { useDebounce } from '../../controller/hooks/useDebounce';

const roles = () => {
  const navigate = useNavigate();
  const { data } = useCurrentUser();
  const [open, setOpen] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);
  const [searchTerm, setSearchTerm] = useState('');
  const PageRoutes = [
    {
      path: 'index',
      breadcrumbName: 'Roles Manage',
    },
    {
      path: 'first',
      breadcrumbName: 'Roles',
    },
  ];

  const debouncedSearchTerm = useDebounce(searchTerm, 500);

  const { data: rolesData, isLoading, refetch, isRefetching } = useRoles({ search: debouncedSearchTerm });

  const onDelete = async () => {
    setConfirmLoading(true);
    try {
      await DeleteRole({ id: deleteId });
      refetch();
      setConfirmLoading(false);
      setOpen(false);
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
    setCurrentPage(current); // Reset to the first page when changing page size
  };

  const tagStyle = {
    display: 'inline-block',
    backgroundColor: '#f0f0f0',
    border: '1px solid #d9d9d9',
    padding: '3px 10px',
    margin: '2px',
    borderRadius: '2px',
  };
  const renderPermissionTag = (checked, label) => (
    <Tag color={checked ? 'blue' : 'volcano'} style={tagStyle}>
      {label}
    </Tag>
  );

  const columns = [
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
      render: (text) => <div>{text}</div>,
    },
    {
      title: 'Permissions',
      dataIndex: 'permissions',
      key: 'permissions',
      render: (permissions) => (
        <div style={{ display: 'flex', flexWrap: 'wrap', alignContent: 'flex-start' }}>
          {envConfig.PERMISSIONS.filter(
            (permConfig) => permissions.includes(permConfig.read) || permissions.includes(permConfig.readWrite),
          ).map((permConfig, index) => (
            <React.Fragment key={index}>
              {permissions.includes(permConfig.read) && renderPermissionTag(true, `${permConfig.page}: Read`)}
              {permissions.includes(permConfig.readWrite) &&
                renderPermissionTag(true, `${permConfig.page}: Read&Write`)}
            </React.Fragment>
          ))}
        </div>
      ),
    },
  ];

  if (data?.permissions.includes('roleReadWrite')) {
    columns.push({
      title: 'Action',
      width: 200,
      fixed: 'right',
      render: (item) => (
        <Space>
          <Typography.Link onClick={() => navigate(`/admin/roles/editRole/${item?._id}`)}>Edit</Typography.Link>
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
    total: rolesData?.length, // Total number of items
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
        title="Roles Manage"
        className="flex items-center justify-between px-8 xl:px-[15px] pt-2 pb-6 sm:pb-[30px] bg-transparent sm:flex-col"
      />
      <Modal title="Warning!" open={open} onOk={onDelete} confirmLoading={confirmLoading} onCancel={handleCancel}>
        <p>Are you sure ?</p>
      </Modal>
      <GlobalUtilityStyle>
        <div className="min-h-[715px] lg:min-h-[580px] flex-1 h-auto px-8 xl:px-[15px] pb-[30px] bg-transparent">
          <div className="flex justify-between items-center pb-6 sm:pb-[30px] bg-transparent sm:flex-col">
            <Input placeholder="Search With Name" onChange={handleSearchChange} className="w-[250px] h-10" />
            <Button
              style={{
                width: '100px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
              htmlType="submit"
              type="primary"
              size="medium"
              onClick={(e) => {
                e.stopPropagation(); // Prevent row click event
                navigate(`/admin/roles/addNewRole`);
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
              dataSource={rolesData?.slice((currentPage - 1) * pageSize, currentPage * pageSize)}
              pagination={paginationConfig}
              loading={isRefetching}
            />
          )}
        </div>
      </GlobalUtilityStyle>
    </>
  );
};

export default roles;
