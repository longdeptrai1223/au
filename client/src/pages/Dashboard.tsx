import Header from '../components/Header';
import BottomNavigation from '../components/BottomNavigation';
import WalletCard from '../components/WalletCard';
import MiningStatusCard from '../components/MiningStatusCard';
import BoostActionsCard from '../components/BoostActionsCard';
import ActivityCard from '../components/ActivityCard';
import { useAuth } from '../contexts/AuthContext';
import LoadingOverlay from '../components/LoadingOverlay';

const Dashboard = () => {
  const { loading } = useAuth();

  if (loading) {
    return <LoadingOverlay />;
  }

  return (
    <div className="flex flex-col h-screen bg-[#121212]">
      <Header />
      
      <main className="flex-1 overflow-auto">
        <div className="container mx-auto px-4 py-6 max-w-4xl">
          <WalletCard />
          <MiningStatusCard />
          <BoostActionsCard />
          <ActivityCard />
        </div>
      </main>
      
      <BottomNavigation />
    </div>
  );
};

export default Dashboard;
