/* eslint-disable multiline-ternary */
/* eslint-disable semi */
/* eslint-disable indent */
/* eslint-disable space-before-function-paren */
/* eslint-disable prettier/prettier */
import React from 'react';
import { NavLink } from 'react-router-dom';

function HeaderNoLogin() {
  return (
    <div>
      <nav className="navbar navbar-dark bg_navbar">
        <div className="container-fluid">
          <NavLink className="navbar-brand" to="./">
            <img src="./img/Bms_web_logo.png" style={{ width: '60px', marginBottom: '8px' }}></img>
            <span>
              <b>BS Management</b>
            </span>
          </NavLink>
        </div>
      </nav>
    </div>
  );
}
export default React.memo(HeaderNoLogin); // Ngăn Header load lại
