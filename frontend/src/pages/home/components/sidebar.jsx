import { useState } from "react";
import Search from "./search";
import UsersList from "./usersList";

function Sidebar( {socket} ) {
    const [searchTerm, setSearchTerm] = useState('');
    return (
        <div className="app-sidebar">
            <Search searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
            <UsersList searchTerm={searchTerm} socket={socket} />
        </div>
    )
} 

export default Sidebar;