// client/src/App.tsx
import { useLocation, Switch, Route } from "wouter";
import { useEffect } from "react";
import { useAuth } from "./contexts/AuthContext";
import Dashboard from "./pages/Dashboard";
import Login from "./pages/Login";
import NotFound from "./pages/not-found";
import LoadingOverlay from "./components/LoadingOverlay";

function App() {
  const [location, setLocation] = useLocation();
  const { user, loading, userData } = useAuth();

  useEffect(() => {
    if (!loading) {
      const token = localStorage.getItem('firebaseToken');
      console.log('Auth State:', {
        location,
        hasToken: !!token,
        hasUser: !!user,
        loading,
        hasUserData: !!userData
      });
      
      // Chỉ chuyển hướng khi đã load xong và có đủ thông tin
      if (user && token && userData && location === "/login") {
        console.log('Redirecting to home - User authenticated');
        setLocation("/");
      } else if (!user && !token && location !== "/login") {
        console.log('Redirecting to login - No authentication');
        setLocation("/login");
      }
    }
  }, [user, loading, location, setLocation, userData]);

  // Hiển thị loading khi đang trong quá trình xác thực
  if (loading) {
    return <LoadingOverlay />;
  }

  return (
    <Switch>
      <Route path="/" component={Dashboard} />
      <Route path="/login" component={Login} />
      <Route component={NotFound} />
    </Switch>
  );
}

export default App;