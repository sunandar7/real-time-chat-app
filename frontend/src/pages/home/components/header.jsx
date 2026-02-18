import { useSelector } from "react-redux";

function Header() {
    const { user } = useSelector(state => state.userReducer);

    return (
        <div className="app-header">
            <div className="app-logo">
                <img src="../images/chat-pop-logo-2.png" className="app-logo-image" alt="Chat Pop Logo" />
                <h3>Chat Pop</h3>
            </div>
            <div className="app-user-profile">
                <div className="logged-user-name">{user?.username}</div>
                <div className="logged-user-profile-pic">{user?.username?.charAt(0)?.toUpperCase() || 'U'}</div>
            </div>
        </div>
    )
}

export default Header;