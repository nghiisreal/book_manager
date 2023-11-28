/* eslint-disable react/prop-types */
/* eslint-disable multiline-ternary */
/* eslint-disable semi */
/* eslint-disable indent */
/* eslint-disable space-before-function-paren */
/* eslint-disable prettier/prettier */
import React from 'react';
import './Footer.css';
// lấy giá trị location để so sánh
export default function Footer({ location }) {
  const isLoginPage = location.pathname === '/' || location.pathname === '/login';

  if (isLoginPage) {
    return (
      <div>
        <footer className="bg-dark text-center text-white">
          <div className="container p-3 pb-0">
            <section className="mb-4">
              <a
                className="btn text-white btn-floating m-1"
                style={{ backgroundColor: '#3b5998' }}
                href="#!"
                role="button">
                <i className="fab fa-facebook-f" />
              </a>

              <a
                className="btn text-white btn-floating m-1"
                style={{ backgroundColor: '#55acee' }}
                href="#!"
                role="button">
                <i className="fab fa-twitter" />
              </a>

              <a
                className="btn text-white btn-floating m-1"
                style={{ backgroundColor: '#dd4b39' }}
                href="#!"
                role="button">
                <i className="fab fa-google" />
              </a>

              <a
                className="btn text-white btn-floating m-1"
                style={{ backgroundColor: '#ac2bac' }}
                href="#!"
                role="button">
                <i className="fab fa-instagram" />
              </a>

              <a
                className="btn text-white btn-floating m-1"
                style={{ backgroundColor: '#0082ca' }}
                href="#!"
                role="button">
                <i className="fab fa-linkedin-in" />
              </a>

              <a
                className="btn text-white btn-floating m-1"
                style={{ backgroundColor: '#333333' }}
                href="#!"
                role="button">
                <i className="fab fa-github" />
              </a>
            </section>
          </div>

          <div className="text-center p-2" style={{ backgroundColor: 'rgba(0, 0, 0, 0.2)' }}>
            © 2023 Copyright:{' '}
            <a className="text-white" href="#">
              npbnghi - 28/11/2023
            </a>
          </div>
        </footer>
      </div>
    );
  }

  return <></>;
}
