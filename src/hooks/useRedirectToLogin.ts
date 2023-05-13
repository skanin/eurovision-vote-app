import { useEffect } from "react";
import { useAuthState } from 'react-firebase-hooks/auth';
import { useNavigate } from "react-router-dom";
import { auth } from "../firebase";

const useRedirectToLogin = () => {
    const [user, loading] = useAuthState(auth);
    const navigate = useNavigate();

    useEffect(() => {
		if (!user && !loading) {
			navigate('/login');
		}
    }, [user, loading, navigate]);
    
    return user && !loading;
};

export default useRedirectToLogin;
