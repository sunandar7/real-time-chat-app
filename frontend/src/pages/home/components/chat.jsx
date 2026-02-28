import { useDispatch, useSelector } from "react-redux";
import { createMessage, getMessagesByChatId } from "../../../apiCalls/message";
import { clearUnreadMessage } from "../../../apiCalls/chat";
import { useState, useEffect } from "react";
import { toast } from "react-hot-toast";
import { showLoader, hideLoader } from "../../../redux/loaderSlice";
import moment from "moment";

function ChatArea( {socket} ) {
    const { selectedChat, allChats } = useSelector((state) => state.chatReducer);
    const { user: currentUser } = useSelector((state) => state.userReducer);
    const dispatch = useDispatch();
    const [ message, setMessage ] = useState('');
    const [ messages, setMessages ] = useState([]);
    const selectedUser = selectedChat?.members.find(member => member._id !== currentUser._id);

    const sendMessage =  async () => {
        try {
            const newMessage = {
                chatId: selectedChat._id,
                sender: currentUser._id,
                text: message
            }
            socket.emit('send-message', {
                ...newMessage,
                members: selectedChat.members.map(member => member._id),
                read: false,
                createdAt: moment().format('YYYY-MM-DD HH:mm:ss')
            })
            const response = await createMessage(newMessage);
            toast.success(response.message);
            setMessage('');
        } catch (error) {
            console.error("Error sending message:", error);
            const message = error.response?.data?.message || "Something went wrong";
            toast.error(message);
        }
    }

    const getMessages =  async () => {
        dispatch(showLoader());
        try {
            const response = await getMessagesByChatId(selectedChat._id);
            setMessages(response.data);
        } catch (error) {
            console.error("Error fetching messages:", error);
            const message = error.response?.data?.message || "Something went wrong";
            toast.error(message);
        } finally {
            dispatch(hideLoader());
        }
    }

    const clearUnreadMessageCount = async () => {
        dispatch(showLoader());
        try {
            const response = await clearUnreadMessage(selectedChat._id);
            allChats.map(chat => {
                if(chat._id === selectedChat._id) {
                    return response.data;
                }
                return chat;
            });

        } catch (error) {
            console.error("Error clearing unread message count:", error);
            const message = error.response?.data?.message || "Something went wrong";
            toast.error(message);
        } finally {
            dispatch(hideLoader());
        }
    }

    const formatTime = (timestamp) => {
        const now = moment();
        const diff = now.diff(moment(timestamp), 'days');

        if(diff < 1) {
            return `Today ${moment(timestamp).format('hh:mm A')}`;
        } else if(diff === 1) {
            return `Yesterday ${moment(timestamp).format('hh:mm A')}`;
        } else {
            return moment(timestamp).format('MMM D, hh:mm A');
        }
    }

    useEffect(() => {
        if(selectedChat){
            getMessages();
            if(selectedChat?.lastMessage?.sender !== currentUser._id) {
                clearUnreadMessageCount();
            }
            socket.on('receive-message', data => {
                if(data.chatId === selectedChat._id) {
                    setMessages(prevMessages => [...prevMessages, data]);
                }
            });
        }
    }, [selectedChat])

    useEffect(() => {
        const msgContainer = document.getElementById('main-chat-area');
        msgContainer.scrollTop = msgContainer.scrollHeight;
    }, [messages])

    return (
        <>
            {selectedChat && 
                <div className="app-chat-area">
                    <div className="app-chat-area-header">
                        {/* RECEIVER DATA */}
                        { selectedUser.username }
                    </div>
                    <div className="main-chat-area" id="main-chat-area">
                        {
                            messages && messages.map(message => {
                                const isCurrentUserSender = message.sender === currentUser._id;
                                return <div key={message._id} className="message-container" style={isCurrentUserSender ? {justifyContent: "end"} : {justifyContent: "start"}}>
                                    <div>
                                        <div className={isCurrentUserSender ? "send-message" : "received-message"}>{message.text}</div>
                                        <div className="message-timestamp" style={isCurrentUserSender ? {float: "right"} : {float: "left"}}>
                                            {formatTime(message.createdAt)} 
                                            {isCurrentUserSender && message.read && <i className="fa fa-check-circle" aria-hidden="true" style={{color: "#3c864b"}}></i> }
                                        </div>
                                    </div>
                                </div>
                            })
                        }
                    </div>
                    <div className="send-message-div">
                        <input type="text" className="send-message-input" 
                            placeholder="Type a message"
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                        />
                        <button className="fa fa-paper-plane send-message-btn" 
                            aria-hidden="true" 
                            onClick={sendMessage}>    
                        </button>
                    </div>
                </div>
            }
        </>
    )
}

export default ChatArea;