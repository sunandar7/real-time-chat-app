import { useState } from "react";
import Search from "./search";
import UsersList from "./usersList";

function Sidebar( {socket, onlineUser} ) {
    const [searchTerm, setSearchTerm] = useState('');
    return (
        <div className="app-sidebar">
            <Search searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
            <UsersList 
                searchTerm={searchTerm} 
                socket={socket} 
                onlineUser={onlineUser}
            />
        </div>
    )
} 

export default Sidebar;