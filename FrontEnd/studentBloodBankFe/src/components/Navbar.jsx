import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const menuRef = useRef(null);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setMenuOpen(false);
      }
    };

    window.addEventListener("resize", handleResize);
    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      window.removeEventListener("resize", handleResize);
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <nav style={styles.navbar}>
      <div style={styles.logo}>Blood Bank</div>

      {/* Mobile Menu Icon (Hamburger) */}
      {isMobile && (
        <div style={styles.menuIcon} onClick={() => setMenuOpen(!menuOpen)}>☰</div>
      )}

      {/* Navigation Links - Dropdown Menu */}
      <ul ref={menuRef} style={{ ...styles.navLinks, ...(isMobile ? (menuOpen ? styles.dropdown : styles.hidden) : {}) }}>
        <li><Link to="/" style={styles.link} onClick={() => setMenuOpen(false)}>Home</Link></li>
        <li><Link to="/about" style={styles.link} onClick={() => setMenuOpen(false)}>About Us</Link></li>
        <li><Link to="/contact" style={styles.link} onClick={() => setMenuOpen(false)}>Contact</Link></li>
        <li><Link to="/register" style={styles.link} onClick={() => setMenuOpen(false)}>Register</Link></li>
        <li><Link to="/login" style={styles.link} onClick={() => setMenuOpen(false)}>Login</Link></li>
      </ul>
    </nav>
  );
};

export default Navbar;

/* Styles */
const styles = {
  navbar: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    background: "linear-gradient(to right, #ff512f, #dd2476)",
    padding: "15px 20px",
    color: "white",
    width: "100%",
    position: "fixed",
    top: 0,
    right: 0,
    zIndex: 1000,
  },
  logo: {
    fontSize: "1.8rem",
    fontWeight: "bold",
    color: "white",
    padding: "0 30px",
  },
  menuIcon: {
    fontSize: "1.8rem",
    cursor: "pointer",
    color: "white",
    display: "block",
  },
  navLinks: {
    display: "flex",
    listStyle: "none",
    gap: "20px",
    transition: "all 0.3s ease-in-out",
  },
  dropdown: {
    flexDirection: "column",
    position: "absolute",
    top: "60px",
    right: "10px",
    background: "rgba(0, 0, 0, 0.8)",
    padding: "15px",
    borderRadius: "5px",
    boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.3)",
    width: "200px",
    textAlign: "center",
    zIndex: 100,
  },
  hidden: {
    display: "none",
  },
  link: {
    color: "white",
    textDecoration: "none",
    fontSize: "1.2rem",
    padding: "10px 15px",
    display: "block",
  },
};
