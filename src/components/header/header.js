import PropTypes from 'prop-types';
import React from 'react';
import { ThemeProvider } from 'styled-components';
import config from '../../controller/config/config';

const { theme } = config;

function Header({ name }) {
  return (
    <ThemeProvider theme={theme}>
      <h1 className="text-primary">{name}</h1>
    </ThemeProvider>
  );
}

Header.propTypes = {
  name: PropTypes.string,
};
export default Header;
