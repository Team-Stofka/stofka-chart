// src/components/Header.tsx
import React from 'react';
import './Header.css';

const Header: React.FC = () => {
  return (
    <header className="header">
      <div className="header-left">
        <h1 className="logo">Stofka</h1>
        <nav className="nav">
          <a href="#">거래소</a>
          <a href="#">입출금</a>
          <a href="#">투자내역</a>
          <a href="#">코인동향</a>
          <a href="#">고객센터</a>
        </nav>
      </div>
      <div className="header-right">
        <a href="#">로그인</a>
        <a href="#">회원가입</a>
        <a href="#">KO</a>
      </div>
    </header>
  );
};

export default Header;
