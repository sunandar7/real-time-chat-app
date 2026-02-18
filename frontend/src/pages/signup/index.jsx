import React from "react";
import { Link } from "react-router-dom";
import { signupUser } from "../../apiCalls/auth";
import toast from "react-hot-toast";
import { useDispatch } from "react-redux";
import { showLoader, hideLoader } from "../../redux/loaderSlice";

function Signup() {
    const dispatch = useDispatch();
    const [user, setUser] = React.useState({
        username: '',
        email: '',
        password: ''
    });

    async function onFormSubmit(event) {
        event.preventDefault();
        dispatch(showLoader());
        try {
            const response = await signupUser(user);
        
            toast.success(response.message);
        } catch (error) {
            const message =
            error.response?.data?.message || "Something went wrong";
        
            toast.error(message);
        } finally {
            dispatch(hideLoader());
        }
    }

    return (
        <div className="container">
            <div className="container-back-img"></div>
            <div className="container-back-color"></div>
            <div className="card">
                <div className="card_title">
                    <h1>Create Account</h1>
                </div>
                <div className="form">
                    <form onSubmit={ onFormSubmit }>
                        <input type="text" placeholder="User Name" 
                            value={user.username} 
                            onChange={(e) => setUser({...user, username: e.target.value})}
                        />
                        <input type="email" placeholder="Email" 
                            value={user.email} 
                            onChange={(e) => setUser({...user, email: e.target.value})}
                        />
                        <input type="password" placeholder="Password" 
                            value={user.password} 
                            onChange={(e) => setUser({...user, password: e.target.value})}
                        />
                        <button>Sign Up</button>
                    </form>
                </div>
                <div className="card_terms">
                    <span>Already have an account?
                        <Link to="/login">Login Here</Link>
                    </span>
                </div>
            </div>
        </div>
    );
}

export default Signup;