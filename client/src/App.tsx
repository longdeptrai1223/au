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
  const { user, loading } = useAuth();

  useEffect(() => {
    if (!loading) {
      const token = localStorage.getItem('firebaseToken');
      console.log('Current location:', location);
      console.log('Has token:', !!token);
      console.log('Has user:', !!user);
      
      if (user && token && location === "/login") {
        console.log('Redirecting to home');
        setLocation("/");
      } else if (!user && !token && location !== "/login") {
        console.log('Redirecting to login');
        setLocation("/login");
      }
    }
  }, [user, loading, location, setLocation]);

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