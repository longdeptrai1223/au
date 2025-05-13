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

  // Redirect based on auth status
  useEffect(() => {
    if (!loading) {
      // If user is authenticated but on login page, redirect to dashboard
      if (user && location === "/login") {
        setLocation("/");
      }
      // If user is not authenticated and not on login page, redirect to login
      else if (!user && location !== "/login") {
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
