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
      if (user && location === "/login") {
        setLocation("/");
      } else if (!user && !token && location !== "/login") {
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