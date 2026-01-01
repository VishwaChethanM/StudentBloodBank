import { Link, useLocation, useNavigate } from "react-router-dom";
import { FaHome, FaTint, FaHistory, FaSignOutAlt, FaBars, FaUser } from "react-icons/fa";
import { useState } from "react";

const Sidebar = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const [collapsed, setCollapsed] = useState(false);

    // Get user ID from sessionStorage
    const storedUser = sessionStorage.getItem("user");
    const parsedUser = storedUser ? JSON.parse(storedUser) : null;
    const userId = parsedUser?.userId;

    const handleLogout = () => {
        sessionStorage.clear();
        navigate("/login");
    };

    return (
        <div style={{ 
            width: collapsed ? "80px" : "250px", 
            height: "100vh", 
            background: "#2C3E50", 
            color: "white", 
            transition: "width 0.3s", 
            position: "fixed",
            padding: "10px",
            display: "flex",
            flexDirection: "column"
        }}>
            <div 
                style={{ 
                    display: "flex", 
                    alignItems: "center", 
                    justifyContent: collapsed ? "center" : "space-between", 
                    padding: "10px", 
                    cursor: "pointer"
                }}
                onClick={() => setCollapsed(!collapsed)}
            >
                <FaBars size={24} />
                {!collapsed && <h3>Blood Bank</h3>}
            </div>

            <nav style={{ marginTop: "20px", display: "flex", flexDirection: "column" }}>
                <SidebarItem 
                    to="/student-dashboard" 
                    icon={<FaHome />} 
                    text="Dashboard" 
                    active={location.pathname === "/student-dashboard"} 
                    collapsed={collapsed} 
                />
                <SidebarItem 
                    to="/request-blood" 
                    icon={<FaTint />} 
                    text="Request Blood" 
                    active={location.pathname === "/request-blood"} 
                    collapsed={collapsed} 
                />
                <SidebarItem 
                    to="/donation-history" 
                    icon={<FaHistory />} 
                    text="Donation History" 
                    active={location.pathname === "/donation-history"} 
                    collapsed={collapsed} 
                />
                <SidebarItem 
                    to={`/userdetails/${userId}`} // ✅ Dynamic link
                    icon={<FaUser />} 
                    text="User Details" 
                    active={location.pathname.startsWith("/userdetails")} 
                    collapsed={collapsed} 
                />
                <div 
                    style={{
                        display: "flex", 
                        alignItems: "center", 
                        padding: "10px", 
                        cursor: "pointer", 
                        color: "white", 
                        background: "#E74C3C",
                        borderRadius: "5px",
                        marginTop: "auto"
                    }}
                    onClick={handleLogout}
                >
                    <FaSignOutAlt size={20} />
                    {!collapsed && <span style={{ marginLeft: "10px" }}>Logout</span>}
                </div>
            </nav>
        </div>
    );
};

const SidebarItem = ({ to, icon, text, active, collapsed }) => (
    <Link 
        to={to} 
        style={{
            display: "flex", 
            alignItems: "center", 
            padding: "10px", 
            textDecoration: "none", 
            color: "white", 
            background: active ? "#1ABC9C" : "transparent", 
            borderRadius: "5px",
            marginBottom: "10px"
        }}
    >
        {icon}
        {!collapsed && <span style={{ marginLeft: "10px" }}>{text}</span>}
    </Link>
);

export default Sidebar;
