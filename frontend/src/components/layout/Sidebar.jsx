import { logoutUser } from "../../api/auth";
import React, { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import {
  LayoutDashboard,
  Heart,
  Users,
  Zap,
  FileText,
  LogOut,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

const navItems = [
  { path: "/", label: "Dashboard", icon: LayoutDashboard, exact: true },
  { path: "/needs", label: "Community Needs", icon: Heart },
  { path: "/ngos", label: "NGOs", icon: Users },
  { path: "/smart-match", label: "Smart Match", icon: Zap },
  { path: "/reports", label: "Field Reports", icon: FileText },
];

const Sidebar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [collapsed, setCollapsed] = useState(false);

  const handleLogout = async () => {
    try {
      await logoutUser();
    } catch (err) {
      console.error(err);
    } finally {
      logout();
      navigate("/login");
    }
  };

  return (
    <div
      style={{
        width: collapsed ? "70px" : "220px",
        minWidth: collapsed ? "70px" : "220px",
        background: "#0f172a",
        display: "flex",
        flexDirection: "column",
        height: "100vh",
        transition: "all 0.3s ease",
        overflow: "hidden",
      }}
    >
      <div
        style={{
          padding: collapsed ? "20px 0" : "20px 16px",
          borderBottom: "1px solid #1e293b",
          display: "flex",
          alignItems: "center",
          gap: "10px",
          justifyContent: collapsed ? "center" : "flex-start",
        }}
      >
        <div
          style={{
            width: "36px",
            height: "36px",
            background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
            borderRadius: "10px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
          }}
        >
          <Zap size={18} color="white" />
        </div>
        {!collapsed && (
          <div>
            <div
              style={{
                fontSize: "15px",
                fontWeight: "700",
                color: "white",
                lineHeight: 1.2,
              }}
            >
              ImpactHub
            </div>
            <div
              style={{
                fontSize: "10px",
                color: "#64748b",
                letterSpacing: "0.05em",
                textTransform: "uppercase",
              }}
            >
              Volunteer Platform
            </div>
          </div>
        )}
      </div>

      <nav
        style={{
          flex: 1,
          padding: "12px 8px",
          display: "flex",
          flexDirection: "column",
          gap: "4px",
        }}
      >
        {navItems.map(({ path, label, icon: Icon, exact }) => (
          <NavLink
            key={path}
            to={path}
            end={exact}
            style={({ isActive }) => ({
              display: "flex",
              alignItems: "center",
              gap: "10px",
              padding: collapsed ? "10px 0" : "10px 12px",
              borderRadius: "8px",
              textDecoration: "none",
              color: isActive ? "white" : "#94a3b8",
              background: isActive ? "#6366f1" : "transparent",
              fontWeight: isActive ? "600" : "400",
              fontSize: "14px",
              transition: "all 0.2s ease",
              justifyContent: collapsed ? "center" : "flex-start",
            })}
          >
            <Icon size={18} style={{ flexShrink: 0 }} />
            {!collapsed && <span>{label}</span>}
          </NavLink>
        ))}
      </nav>

      <div style={{ padding: "12px 8px", borderTop: "1px solid #1e293b" }}>
        {!collapsed && (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "10px",
              padding: "10px 12px",
              marginBottom: "4px",
              borderRadius: "8px",
              background: "#1e293b",
            }}
          >
            <div
              style={{
                width: "32px",
                height: "32px",
                borderRadius: "50%",
                background: "#6366f1",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "13px",
                fontWeight: "700",
                color: "white",
                flexShrink: 0,
              }}
            >
              {user?.name?.charAt(0).toUpperCase() || "U"}
            </div>
            <div>
              <div
                style={{ fontSize: "13px", fontWeight: "600", color: "white" }}
              >
                {user?.name || "User"}
              </div>
              <div
                style={{
                  fontSize: "11px",
                  color: "#64748b",
                  textTransform: "capitalize",
                }}
              >
                {user?.role || "volunteer"}
              </div>
            </div>
          </div>
        )}
        <button
          onClick={handleLogout}
          style={{
            display: "flex",
            alignItems: "center",
            gap: "10px",
            width: "100%",
            padding: collapsed ? "10px 0" : "10px 12px",
            borderRadius: "8px",
            border: "none",
            background: "transparent",
            color: "#94a3b8",
            fontSize: "14px",
            cursor: "pointer",
            justifyContent: collapsed ? "center" : "flex-start",
          }}
        >
          <LogOut size={18} />
          {!collapsed && <span>Logout</span>}
        </button>
        <button
          onClick={() => setCollapsed(!collapsed)}
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            width: "100%",
            padding: "8px",
            marginTop: "4px",
            borderRadius: "8px",
            border: "none",
            background: "transparent",
            color: "#475569",
            cursor: "pointer",
          }}
        >
          {collapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
