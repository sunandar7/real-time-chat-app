import { useDispatch, useSelector } from "react-redux";
function ChatArea() {
    const { selectedChat } = useSelector((state) => state.chatReducer);
    return (
        <div>
            {selectedChat && <h2>{selectedChat._id}</h2>}
        </div>
    )
}

export default ChatArea;