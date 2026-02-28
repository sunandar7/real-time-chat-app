import { useState, useEffect } from "react";
import { getAllUsers } from "../../../apiCalls/users";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import { showLoader, hideLoader } from "../../../redux/loaderSlice";
import { createChat } from "../../../apiCalls/chat";
import { setAllChats, setSelectedChat } from "../../../redux/chatSlice";
import { toast } from "react-hot-toast";
import moment from "moment";

function UsersList({searchTerm, socket}) {
    const [ users, setUsers] = useState([]);
    const { allChats, selectedChat } = useSelector(state => state.chatReducer);
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

    const isSelectedChat = (user) => {
        if (selectedChat) {
            return selectedChat.members.map(member => member._id).includes(user._id);
        }
        return false;
    }

    const getLastMessage = (userId) => {
        const chat = allChats.find(chat => chat.members.map(member => member._id).includes(userId));
        if(!chat || !chat.lastMessage) {
            return "";
        } else {
            const msgPrefix = chat?.lastMessage?.sender === currentUser._id ? "You: " : "";
            return msgPrefix + chat?.lastMessage?.text?.substring(0,25);
        }
    }

    const getLastMessageTimestamp = (userId) => {
        const chat = allChats.find(chat => chat.members.map(member => member._id).includes(userId));
        if(!chat || !chat?.lastMessage) {
            return "";
        } else {
            return moment(chat?.lastMessage?.createdAt).format('hh:mm A')
        }
    }

    const getUnreadMessageCount = (userId) => {
        const chat = allChats.find(chat => chat.members.map(member => member._id ).includes(userId));

        if(chat && chat.unreadMessagesCount && chat.lastMessage.sender !== currentUser._id) {
            return <div className="unread-message-counter"> {chat.unreadMessagesCount} </div>;
        } else {
            return "";
        }
    }

    const getData = () => {
        if(searchTerm === "") {
            return allChats;
        } else {
            return users.filter(user => {
                return user.username.toLowerCase().includes(searchTerm.toLowerCase())
            })
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

    useEffect(() => {
            socket.on('receive-message', (data) => {
                if(selectedChat?._id !== data.chatId) {
                    const updatedChats = allChats.map(chat => {
                        if(chat._id === data.chatId) {
                            return {
                                ...chat,
                                unreadMessagesCount: (chat?.unreadMessagesCount || 0) + 1,
                                lastMessage: data
                            }
                        }
                        return chat;
                    });
                    dispatch(setAllChats(updatedChats));
                }
            })
    }, [socket, selectedChat, allChats, dispatch])

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
        getData().map(obj => {
            let user = obj;
            if(obj.members) {
                user = obj.members.find(member => member._id !== currentUser._id);
            }
            return <div className="user-search-filter" onClick={() => openChat(user._id)} key={user._id}>
                    <div className={isSelectedChat(user) ? "selected-user" : "filtered-user"}>
                        <div className="filter-user-display">
                            {user.profilePic && <img src={`http://localhost:3000/${user.profilePic}`} alt="Profile Pic" className="user-profile-image" />}
                            {!user.profilePic && 
                                <div className={isSelectedChat(user) ? "user-selected-avatar" : "user-default-avatar"}>
                                    {user.username.charAt(0).toUpperCase()}
                                </div>
                            }
                            <div className="filter-user-details">
                                <div className="user-display-name">{user.username}</div>
                                <div className="user-display-email">{getLastMessage(user._id) || user.email}</div>
                            </div>
                            <div>
                                {getUnreadMessageCount(user._id)}
                                <div className="last-message-timestamp">{getLastMessageTimestamp(user._id)}</div>
                            </div>
                            {!chatAlreadyExists(user._id) && (
                                <div className="user-start-chat">
                                    <button className="user-start-chat-btn" onClick={() => startNewChat(user._id)}>Start Chat</button>
                                </div>
                            )}
                        </div>
                    </div> 
                </div>
            }   
        ))            
}

export default UsersList;