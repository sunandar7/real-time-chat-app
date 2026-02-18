import Header from "./components/header";
import Sidebar from "./components/sidebar";
import { useEffect } from "react";
import { getAllChats } from "../../apiCalls/chat";
import { useDispatch } from "react-redux";
import { showLoader, hideLoader } from "../../redux/loaderSlice";
import { setAllChats } from "../../redux/chatSlice";
import ChatArea from "./components/chat";

function Home() {
    const dispatch = useDispatch();
    
        useEffect(() => {
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
        }, [dispatch]);
    return (
        <div className="home-page">
            {/* HEADER LAYOUT */}
            <Header />
            <div className="main-content">
                <Sidebar />
                <ChatArea />
            </div>
        </div>
    );
}

export default Home;