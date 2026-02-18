import { useEffect } from "react";
import { Navigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { getLoggedInUser } from "../apiCalls/users";
import { setUser } from "../redux/userSlice";
import { showLoader, hideLoader } from "../redux/loaderSlice";

function ProtectedRoute({ children }) {
    const { user } = useSelector(state => state.userReducer);
    const dispatch = useDispatch();
    const token = localStorage.getItem("token");

    useEffect(() => {
        const fetchUser = async () => {
            if (token && !user) {
                dispatch(showLoader());
                try {
                    const response = await getLoggedInUser();
                    dispatch(setUser(response.data));
                } catch (error) {
                    localStorage.removeItem("token");
                } finally {
                    dispatch(hideLoader());
                }
            }
        };

        fetchUser();
    }, [token, dispatch]);

    if (!token) {
        return <Navigate to="/login" replace />;
    }

    if (!user) {
        return null;
    }

    return children;
}

export default ProtectedRoute;
