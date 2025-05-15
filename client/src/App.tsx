// VietnamGreeter/client/src/App.tsx
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
    const handleNavigation = async () => {
      if (!loading) {
        const token = localStorage.getItem('firebaseToken');
        console.log('Auth State:', {
          currentLocation: location,
          hasToken: !!token,
          hasUser: !!user,
          loading,
          hasUserData: !!userData
        });

        // Chỉ chuyển hướng khi không trong quá trình loading
        if (!loading) {
          // Nếu đang ở trang login và đã đăng nhập thành công
          if (location === "/login" && user && token && userData) {
            console.log('Redirecting from login to home - User is authenticated');
            setLocation("/");
            return;
          }

          // Nếu không ở trang login và chưa đăng nhập
          if (location !== "/login" && (!user || !token)) {
            console.log('Redirecting to login - No authentication');
            setLocation("/login");
            return;
          }
        }
      }
    };

    handleNavigation();
  }, [user, loading, location, setLocation, userData]);

  // Hiển thị loading khi đang trong quá trình xác thực
  if (loading) {
    return <LoadingOverlay />;
  }

  return (
    <Switch>
      <Route 
        path="/" 
        component={() => {
          if (!user || !userData) {
            console.log('Access denied - redirecting to login');
            setLocation("/login");
            return <LoadingOverlay />;
          }
          return <Dashboard />;
        }} 
      />
      <Route 
        path="/login" 
        component={() => {
          // Nếu đã đăng nhập, chuyển về trang chủ
          if (user && userData) {
            console.log('User already logged in - redirecting to home');
            setLocation("/");
            return <LoadingOverlay />;
          }
          return <Login />;
        }} 
      />
      <Route component={NotFound} />
    </Switch>
  );
}

export default App;