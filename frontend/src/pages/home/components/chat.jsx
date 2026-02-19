import { useDispatch, useSelector } from "react-redux";
import { createMessage, getMessagesByChatId } from "../../../apiCalls/message";
import { useState, useEffect } from "react";
import { toast } from "react-hot-toast";
import { showLoader, hideLoader } from "../../../redux/loaderSlice";

function ChatArea() {
    const { selectedChat } = useSelector((state) => state.chatReducer);
    const { user: currentUser } = useSelector((state) => state.userReducer);
    const dispatch = useDispatch();
    const [ message, setMessage ] = useState('');
    const [ messages, setMessages ] = useState([]);
    const selectedUser = selectedChat?.members.find(member => member._id !== currentUser._id);

    const sendMessage =  async () => {
        dispatch(showLoader());
        try {
            const newMessage = {
                chatId: selectedChat._id,
                sender: currentUser._id,
                text: message
            }
            const response = await createMessage(newMessage);
            toast.success(response.message);
            setMessage('');
        } catch (error) {
            console.error("Error sending message:", error);
            const message = error.response?.data?.message || "Something went wrong";
            toast.error(message);
        } finally {
            dispatch(hideLoader());
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

    useEffect(() => {
        if(selectedChat){
            getMessages();
        }
    }, [selectedChat])

    return (
        <>
            {selectedChat && 
                <div className="app-chat-area">
                    <div className="app-chat-area-header">
                        {/* RECEIVER DATA */}
                        { selectedUser.username }
                    </div>
                    <div className="main-chat-area">
                        {
                            messages && messages.map(message => {
                                return <div key={message._id} className="message-container" style={{justifyContent: "flex-end"}}>
                                    <div className="send-message">{message.text}</div>
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