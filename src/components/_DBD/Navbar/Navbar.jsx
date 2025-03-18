import './Navbar.module.css'
import styles from './Navbar.module.css'
import {NavLink, useLocation, useNavigate} from "react-router-dom";
import {useAuth} from "../utils/AuthProvider.jsx";

function Navbar() {
    const { isAuthenticated, username, logout } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const from = location.pathname || "/"

    const div_style = {
        height: "100%",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        gap: "10px"
    }

    return (
        <>
            <nav className={styles.navbar}> {/* можно оставить без className, но в css правило для блока nav */}
                <NavLink className={({isActive}) => isActive ? styles.active : ""} to="/">home</NavLink>
                <NavLink className={({isActive}) => isActive ? styles.active : ""} to="/admin">admin</NavLink>
                <NavLink className={({isActive}) => isActive ? styles.active : ""} to="/main">main</NavLink>

                <div style={div_style}>
                    {
                        (!isAuthenticated || sessionStorage.getItem("session-token") === null) &&
                        <button onClick={() => navigate("/auth")}>
                            Log In
                        </button>
                        // было бы удобнее:
                        // <p><span>Sign In</span> / <span>Sign In</span></p>
                    }

                    {
                        (isAuthenticated && sessionStorage.getItem("session-token") !== null) &&
                        <>
                            <div
                                style={{
                                    width: "5vh",
                                    height: "5vh",
                                    position: "relative",
                                    display: "flex",
                                    justifyContent: "center",
                                    alignItems: "center",
                                    overflow: "hidden",
                                }}
                            >
                                {/* Outer circle */}
                                <div
                                    style={{
                                        width: "100%",
                                        height: "100%",
                                        borderRadius: "50%",
                                        background: "#ccc",
                                    }}
                                ></div>
                            </div>
                            <h3>{username}</h3>
                            <button onClick={() => {
                                console.log(from)
                                logout();
                                navigate(from);
                            }}>
                                Log Out
                            </button>
                        </>
                    }
                </div>
            </nav>
        </>
    )
}

export default Navbar
