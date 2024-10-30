import { useEffect, useState } from "react";
import { auth } from "./config";
import { onAuthStateChanged } from "firebase/auth";

const useAuth = () => {
    const [currentUser, setCurrentUser] = useState(null);
    const [loading, setLoading] = useState(true)
    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            setLoading(false)
            setCurrentUser(user);
        });

        return unsubscribe;
    }, []);

    return {
        currentUser,
        loading
    };
};

export {
    useAuth
}