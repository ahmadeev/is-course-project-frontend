// Navbar.jsx
import './Navbar.module.css'
import styles from './Navbar.module.css'
import {NavLink, useLocation, useNavigate} from "react-router-dom";
import {useAuth} from "../utils/AuthProvider.jsx";

function Navbar() {
    const { isAuthenticated, username, logout, hasRole } = useAuth();
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
            <nav className={styles.navbar}>
                <NavLink className={({isActive}) => isActive ? styles.active : ""} to="/">home</NavLink>
                {
                    hasRole("ROLE_USER") && (
                        <>
                            <NavLink className={({isActive}) => isActive ? styles.active : ""} to="/main">main</NavLink>
                            <NavLink className={({isActive}) => isActive ? styles.active : ""} to="/add-match">add match</NavLink>
                            <NavLink className={({isActive}) => isActive ? styles.active : ""} to="/generate-build">generate build</NavLink>
                            <NavLink className={({isActive}) => isActive ? styles.active : ""} to="/roll-dice">roll dice</NavLink>
                        </>
                    )
                }

                {
                    hasRole("ROLE_ADMIN") &&  <NavLink className={({isActive}) => isActive ? styles.active : ""} to="/admin">admin</NavLink>
                }

                <div style={div_style}>
                    {
                        (!isAuthenticated || sessionStorage.getItem("session-token") === null) &&
                        <button
                            className={styles.loginButton}
                            onClick={() => navigate("/auth")}
                        >
                            <i className="fas fa-sign-in-alt"></i>
                            Log In
                        </button>
                    }

                    {
                        (isAuthenticated && sessionStorage.getItem("session-token") !== null) &&
                        <>
                            <NavLink
                                to="/id"
                                className={({isActive}) => `${styles.profileContainer} ${isActive ? styles.active : ''}`}
                            >
                                <div className={styles.avatarCircleContainer}>
                                    <div className={styles.avatarCircle}></div>
                                </div>
                                <h3>{username}</h3>
                            </NavLink>
                            <button
                                className={styles.logoutButton}
                                onClick={() => {
                                    console.log(from)
                                    logout();
                                    navigate(from);
                                }}
                            >
                                <i className="fas fa-sign-out-alt"></i>
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
