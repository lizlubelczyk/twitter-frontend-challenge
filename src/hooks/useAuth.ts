import { useEffect, useState } from "react";
import { useHttpRequestService } from "../service/HttpRequestService";

const useAuth = () => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const httpRequestService = useHttpRequestService();

    useEffect(() => {
        const checkAuth = async () => {
            const loggedIn = await httpRequestService.isLogged();
            setIsAuthenticated(loggedIn);
        };
        checkAuth();
    }, [httpRequestService]);

    return isAuthenticated;
};

export default useAuth;
