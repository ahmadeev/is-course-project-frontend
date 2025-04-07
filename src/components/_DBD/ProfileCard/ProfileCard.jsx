import styles from "./ProfileCard.module.css";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../utils/AuthProvider.jsx";

function ProfileCard() {
    const { username } = useAuth(); // Предполагается, что useAuth возвращает username
    const navigate = useNavigate();

    const handleEditClick = () => {
        navigate("/forbidden");
    };

    const handleStatsClick = () => {
        navigate("/forbidden");
    };

    const description = "This is a placeholder description for the user's profile. Add more details here about the user, such as their preferences or bio. This text is intentionally long to demonstrate the ellipsis effect.";

    return (
        <div className={styles.profileContainer}>
            <div className={styles.profilePhoto}></div>
            <div className={styles.profileInfo}>
                <h2 className={styles.profileName}>{username || "Username"}</h2>
                <div className={styles.profileDescription} title={description}>
                    {description}
                </div>
                <div className={styles.profileActions}>
                    <button className={styles.editButton} onClick={handleEditClick}>
                        Edit Profile
                    </button>
                    <button className={styles.statsButton} onClick={handleStatsClick}>
                        View Stats
                    </button>
                </div>
            </div>
        </div>
    );
}

export default ProfileCard;