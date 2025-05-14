import { useAuth } from "@/common/context/AuthContext";
import { useRouter } from "next/router";
import { useEffect, ReactNode } from "react";

interface PrivateRouteProps {
  children: ReactNode;
}

const PrivateRoute: React.FC<PrivateRouteProps> = ({ children }) => {
  

  
  const { user, token, isInitialized } = useAuth(); // Ensure `isInitialized` is available in AuthContext
  const router = useRouter();

  useEffect(() => {
    if (isInitialized) {
      if (!token) {
        console.log("No token found. Redirecting to /signin...");
        router.push("/signin");
        return;
      }

      if (!user) {
        console.log("User not authenticated. Redirecting to /signin...");
        router.push("/signin");
      }
    }
  }, [isInitialized, token, user, router]);

  if (!isInitialized) {
    // Placeholder while AuthContext is initializing
    return <p style={{ textAlign: "center", marginTop: "20px" }}>Initializing session, please wait...</p>;
  }

  if (!token || !user) {
    // Prevent rendering if user is not authenticated
    return null;
  }

  return <>{children}</>;
};

export default PrivateRoute;
