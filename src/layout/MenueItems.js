/* eslint-disable no-unused-vars */
import { UilCreateDashboard, UilWindowSection, UilShieldCheck } from '@iconscout/react-unicons';
import { Menu, Spin } from 'antd';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { NavLink } from 'react-router-dom';
import UilEllipsisV from '@iconscout/react-unicons/icons/uil-ellipsis-v';
import propTypes from 'prop-types';
import { NavTitle } from './Style';
import { changeDirectionMode, changeLayoutMode, changeMenuMode } from '../controller/redux/themeLayout/actionCreator';
import { useCurrentUser } from '../model/queryCalls/queryCalls';

function MenuItems({ toggleCollapsed }) {
  const { t } = useTranslation();
  const { data, isLoading } = useCurrentUser();

  function getItem(label, key, icon, children, type) {
    return {
      key,
      icon,
      children,
      label,
      type,
    };
  }

  const { topMenu } = useSelector((state) => {
    return {
      topMenu: state.ChangeLayoutMode.topMenu,
    };
  });

  const dispatch = useDispatch();

  const path = '/admin';

  const pathName = window.location.pathname;
  const pathArray = pathName.split(path);
  const mainPath = pathArray[1];
  const mainPathSplit = mainPath.split('/');

  const [openKeys, setOpenKeys] = React.useState(
    !topMenu ? [`${mainPathSplit.length > 2 ? mainPathSplit[1] : 'dashboard'}`] : [],
  );

  const onOpenChange = (keys) => {
    setOpenKeys(keys[keys.length - 1] !== 'recharts' ? [keys.length && keys[keys.length - 1]] : keys);
  };

  const onClick = (item) => {
    if (item.keyPath.length === 1) setOpenKeys([]);
  };

  const changeLayout = (mode) => {
    dispatch(changeLayoutMode(mode));
  };
  const changeNavbar = (topMode) => {
    const html = document.querySelector('html');
    if (topMode) {
      html.classList.add('hexadash-topmenu');
    } else {
      html.classList.remove('hexadash-topmenu');
    }
    dispatch(changeMenuMode(topMode));
  };
  const changeLayoutDirection = (rtlMode) => {
    if (rtlMode) {
      const html = document.querySelector('html');
      html.setAttribute('dir', 'rtl');
    } else {
      const html = document.querySelector('html');
      html.setAttribute('dir', 'ltr');
    }
    dispatch(changeDirectionMode(rtlMode));
  };

  const darkmodeActivated = () => {
    document.body.classList.add('dark');
  };

  const darkmodeDiactivated = () => {
    document.body.classList.remove('dark');
  };
  let dashboard = null;
  let rolesManagementSection = null;
  let layoutManagementSection = null;

  layoutManagementSection = getItem(t('layouts'), 'layout', !topMenu && <UilWindowSection />, [
    getItem(
      <NavLink
        onClick={() => {
          toggleCollapsed();
          darkmodeDiactivated();
          changeLayout('lightMode');
        }}
        to="#"
      >
        {t('light')} {t('mode')}
      </NavLink>,
      'light',
      null,
    ),
    getItem(
      <NavLink
        onClick={() => {
          toggleCollapsed();
          darkmodeActivated();
          changeLayout('darkMode');
        }}
        to="#"
      >
        {t('dark')} {t('mode')}
      </NavLink>,
      'dark',
      null,
    ),
    getItem(
      <NavLink
        onClick={() => {
          toggleCollapsed();
          changeNavbar(true);
        }}
        to="#"
      >
        {t('top')} {t('menu')}
      </NavLink>,
      'topMenu',
      null,
    ),
    getItem(
      <NavLink
        onClick={() => {
          toggleCollapsed();
          changeNavbar(false);
        }}
        to="#"
      >
        {t('side')} {t('menu')}
      </NavLink>,
      'sideMenu',
      null,
    ),
    getItem(
      <NavLink
        onClick={() => {
          toggleCollapsed();
          changeLayoutDirection(true);
        }}
        to="#"
      >
        RTL
      </NavLink>,
      'rtl',
      null,
    ),
    getItem(
      <NavLink
        onClick={() => {
          toggleCollapsed();
          changeLayoutDirection(false);
        }}
        to="#"
      >
        LTR
      </NavLink>,
      'ltr',
      null,
    ),
  ]);

  dashboard = getItem(
    <NavLink onClick={toggleCollapsed} to={`${path}`}>
      {t('dashboard')}
    </NavLink>,
    'dashboard',
    !topMenu && (
      <NavLink className="menuItem-iocn" to={`${path}`}>
        <UilCreateDashboard />
      </NavLink>
    ),
  );

  const rolesList = ['roleRead', 'roleReadWrite'].some((permission) => data?.permissions.includes(permission))
    ? getItem(
        <NavLink onClick={toggleCollapsed} to={`${path}/roles`}>
          {t('All Roles')}
        </NavLink>,
        'All Roles',
        null,
      )
    : null;

  const usersList = ['usersRead', 'usersReadWrite'].some((permission) => data?.permissions.includes(permission))
    ? getItem(
        <NavLink onClick={toggleCollapsed} to={`${path}/users`}>
          {t('All Users')}
        </NavLink>,
        'All Users',
        null,
      )
    : null;

  rolesManagementSection = ['roleRead', 'roleReadWrite', 'usersRead', 'usersReadWrite'].some((permission) =>
    data?.permissions.includes(permission),
  )
    ? getItem(t('Roles & Users'), 'Roles & Users', !topMenu && <UilShieldCheck />, [rolesList, usersList])
    : null;

  const menuItems = [dashboard, rolesManagementSection];

  return isLoading ? (
    <div className="flex justify-center align-items-center">
      <Spin />
    </div>
  ) : (
    <Menu
      onOpenChange={onOpenChange}
      onClick={onClick}
      mode={!topMenu || window.innerWidth <= 991 ? 'inline' : 'horizontal'}
      // // eslint-disable-next-line no-nested-ternary
      defaultSelectedKeys={
        !topMenu
          ? [
              `${
                mainPathSplit.length === 1
                  ? 'dashboard'
                  : mainPathSplit.length === 2
                  ? mainPathSplit[1]
                  : mainPathSplit[2]
              }`,
            ]
          : []
      }
      defaultOpenKeys={!topMenu ? [`${mainPathSplit.length > 2 ? mainPathSplit[1] : 'dashboard'}`] : []}
      overflowedIndicator={<UilEllipsisV />}
      openKeys={openKeys}
      items={menuItems}
    />
  );
}

MenuItems.propTypes = {
  toggleCollapsed: propTypes.func,
};

export default MenuItems;
