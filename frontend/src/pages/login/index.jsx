import React from "react";
import { Link } from "react-router-dom";
import { loginUser } from "../../apiCalls/auth";
import { toast } from "react-hot-toast";
import { useDispatch } from "react-redux";
import { showLoader, hideLoader } from "../../redux/loaderSlice";
import { useNavigate } from "react-router-dom";
import { setUser } from "../../redux/userSlice";

function Login() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [formData, setFormData] = React.useState({
        email: '',
        password: ''
    });

    async function onFormSubmit(event) {
        event.preventDefault();
        dispatch(showLoader());

        try {
            const response = await loginUser(formData);

            localStorage.setItem("token", response.token);

            dispatch(setUser(response.data));

            toast.success(response.message);

            navigate("/", { replace: true });

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
                    <h1>Login Here</h1>
                </div>
                <div className="form">
                    <form onSubmit={ onFormSubmit }>
                        <input type="email" placeholder="Email"
                            value={formData.email}
                            onChange={(e) => setFormData({...formData, email: e.target.value})}
                        />
                        <input type="password" placeholder="Password" 
                            value={formData.password}
                            onChange={(e) => setFormData({...formData, password: e.target.value})}
                        />
                        <button>Login</button>
                    </form>
                </div>
                <div className="card_terms"> 
                    <span>Don't have an account yet?
                        <Link to="/signup">Signup Here</Link>
                    </span>
                </div>
            </div>
        </div>
    );
}

export default Login;