import { useEffect } from "react";
import Landing from "../Component/Layout/Landing/Landing";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../firebase/Firebase";
import { useNavigate } from "react-router-dom";

const AuthLayout = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        navigate('/dashboard', { replace: true });
      }
    });

    return () => unsubscribe();
  }, [navigate]);

  return (
    <>
      <Landing />
    </>
  );
};

export default AuthLayout;