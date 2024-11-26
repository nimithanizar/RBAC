/* eslint-disable no-unneeded-ternary */
import React, { useContext } from 'react';
import { Provider, useSelector } from 'react-redux';
import { ThemeProvider } from 'styled-components';
import { BrowserRouter as Router, Navigate, Route, Routes } from 'react-router-dom';
import { ConfigProvider } from 'antd';
import { QueryClient, QueryClientProvider } from 'react-query';
import store from './controller/redux/store';
import Admin from './controller/navigators/routes/admin';
import Auth from './controller/navigators/routes/auth';
import TwoAuth from './controller/navigators/routes/twoFactorAuth';
import './static/css/style.css';
import config from './controller/config/config';
import ProtectedRoute from './components/utilities/protectedRoute';
import 'antd/dist/antd.less';
import { UserContext } from './controller/context/userContext';

const { theme } = config;
// eslint-disable-next-line react/prop-types
function ProviderConfig({ url }) {
  const { user, isVerified } = useContext(UserContext);
  const {
    rtl,
    // isLoggedIn,
    topMenu,
    mainContent,
  } = useSelector((state) => {
    return {
      rtl: state.ChangeLayoutMode.rtlData,
      topMenu: state.ChangeLayoutMode.topMenu,
      mainContent: state.ChangeLayoutMode.mode,
      // isLoggedIn: state.auth.login,
    };
  });

  return (
    <ConfigProvider direction={rtl ? 'rtl' : 'ltr'}>
      <ThemeProvider theme={{ ...theme, rtl, topMenu, mainContent }}>
        <Router basename={process.env.PUBLIC_URL}>
          <Routes>
            <Route
              path="*"
              element={!user ? <Auth /> : <Navigate to={url === '/' || url === '/2fa' ? '/admin' : url} />}
            />
            <Route
              path="/admin/*"
              element={
                user && user.providerType === 'local-userpass' && isVerified ? (
                  <ProtectedRoute path="/*" Component={Admin} />
                ) : (
                  <Navigate to="/2fa" />
                )
              }
            />
            <Route
              path="/2fa/*"
              element={
                user && user.providerType === 'local-userpass' && !isVerified ? <TwoAuth /> : <Navigate to="/" />
              }
            />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Router>
      </ThemeProvider>
    </ConfigProvider>
  );
}

function App() {
  const queryClient = new QueryClient();
  const url = window.location.pathname;
  return (
    <Provider store={store}>
      <QueryClientProvider client={queryClient}>
        <ProviderConfig url={url} />
      </QueryClientProvider>
    </Provider>
  );
}

export default App;
