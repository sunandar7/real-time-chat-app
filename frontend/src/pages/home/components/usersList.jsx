import { useState, useEffect } from "react";
import { getAllUsers } from "../../../apiCalls/users";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import { showLoader, hideLoader } from "../../../redux/loaderSlice";
import { createChat } from "../../../apiCalls/chat";
import { setAllChats, setSelectedChat } from "../../../redux/chatSlice";
import { toast } from "react-hot-toast";

function UsersList({searchTerm}) {
    const [ users, setUsers] = useState([]);
    const { allChats } = useSelector(state => state.chatReducer);
    const { user: currentUser } = useSelector(state => state.userReducer);
    const dispatch = useDispatch();

    const startNewChat = async (searchedUserId) => {
        dispatch(showLoader());
        try {
            const response = await createChat([currentUser._id, searchedUserId]);
            const newChat = response.data;
            toast.success(response.message);
            const updatedChats = [...allChats, newChat];
            dispatch(setAllChats(updatedChats));
            dispatch(setSelectedChat(newChat));
        } catch (error) {
            console.error("Error creating chat:", error);
        } finally {
            dispatch(hideLoader());
        }
    }

    const openChat = (selectedUserId) => {
        const existingChat = allChats.find(chat => 
            chat.members.map(member => member._id).includes(currentUser._id) && 
            chat.members.map(member => member._id).includes(selectedUserId)
        );

        if (existingChat) {
            dispatch(setSelectedChat(existingChat));
        }
    }

    useEffect(() => {
        const fetchUsers = async () => {
            dispatch(showLoader());   
            try {
                const response = await getAllUsers();
                setUsers(response.data);
            } catch (error) {
                console.error("Error fetching users:", error);
            } finally {
                dispatch(hideLoader());
            }
        };
        fetchUsers();
    }, [dispatch]);

    // Filter users based on search term
    const filteredUsers = users.filter(user =>
        (user.username.toLowerCase().includes(searchTerm.toLowerCase()) && searchTerm) ||
        (allChats.some(chat => chat.members.map(member => member._id).includes(user._id)))
    );

    // check if user is already in chat list
    const chatAlreadyExists = (userId) => {
        return allChats.find(chat => 
            chat.members.map(member => member._id).includes(userId)
        );
    };

    return (
        filteredUsers && filteredUsers.length > 0 ? (
            filteredUsers.map(user => (
                <div className="user-search-filter" onClick={() => openChat(user._id)} key={user._id}>
                    <div className="filtered-user">
                        <div className="filter-user-display">
                            {user.profilePic && <img src={`http://localhost:3000/${user.profilePic}`} alt="Profile Pic" className="user-profile-image" />}
                            {!user.profilePic && 
                                <div className="user-default-profile-pic">
                                    {user.username.charAt(0).toUpperCase()}
                                </div>
                            }
                            <div className="filter-user-details">
                                <div className="user-display-name">{user.username}</div>
                                <div className="user-display-email">{user.email}</div>
                            </div>
                            {!chatAlreadyExists(user._id) && (
                                <div className="user-start-chat">
                                    <button className="user-start-chat-btn" onClick={() => startNewChat(user._id)}>Start Chat</button>
                                </div>
                            )}
                        </div>
                    </div> 
                </div>
            )
        )) : (
            <p className="no-users-found">No users found.</p>
        )               
    )
}

export default UsersList;