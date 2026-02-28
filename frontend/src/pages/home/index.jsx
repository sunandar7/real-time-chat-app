import Header from "./components/header";
import Sidebar from "./components/sidebar";
import { useEffect } from "react";
import { getAllChats } from "../../apiCalls/chat";
import { useDispatch, useSelector } from "react-redux";
import { showLoader, hideLoader } from "../../redux/loaderSlice";
import { setAllChats } from "../../redux/chatSlice";
import ChatArea from "./components/chat";
import { io } from "socket.io-client";

const socket = io('http://localhost:3000');

function Home() {
    const { user } = useSelector(state => state.userReducer);
    const { selectedChat } = useSelector(state => state.chatReducer);
    const dispatch = useDispatch();
    
        useEffect(() => {
            // Send to all connected clients
            // socket.emit('send-message-all', { message: 'Hello guys!'});
            // socket.on('send-message-by-server', data => {
            //     console.log('Received message from server: ', data);
            // });

            // Send to specific socket ID
            if (user) {
                socket.emit('join-room', user._id);

                // socket.emit('send-message', { message: 'Hello', recipient: '69933f5f55149a1d9643d30e'});
                // socket.on('receive-message', data => {
                //     console.log('Received message from server: ', data);
                // });
            }

            const fetchChats = async () => {
                dispatch(showLoader());
                try {
                    const response = await getAllChats();
                    dispatch(setAllChats(response.data));
                } catch (error) {
                    console.error("Error fetching chats:", error);
                } finally {
                    dispatch(hideLoader());
                }
            };
    
            fetchChats();
        }, [dispatch, user]);
    return (
        <div className="home-page">
            {/* HEADER LAYOUT */}
            <Header />
            <div className="main-content">
                <Sidebar socket={socket} />
                {selectedChat && <ChatArea socket={socket} />}
            </div>
        </div>
    );
}

export default Home;