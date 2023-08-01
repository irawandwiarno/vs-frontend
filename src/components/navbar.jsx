import React from "react";

const Navbar = () => {
  return (
    <nav className="navbar px-3" role="navigation" aria-label="main navigation">
      <div className="navbar-brand">
        <a className="navbar-item" href="/">
          <h1>Vintage Series Shop</h1>
        </a>
      </div>

      <div id="navbar" className="navbar-menu">
        <div className="navbar-start">
          <a className="navbar-item" href="/">
            Home
          </a>
          <a className="navbar-item" href="/nota">
            Nota
          </a>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
