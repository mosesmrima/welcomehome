import { useState } from 'react';
import Sidebar from './components/Sidebar';
import LandingPage from './pages/LandingPage';
import OnboardingPage from './pages/OnboardingPage';
import HomePage from './pages/HomePage';
import TransactionsPage from './pages/TransactionsPage';
import PropertyDetailsPage from './pages/PropertyDetailsPage';
import SettingsPage from './pages/SettingsPage';

function App() {
  const [currentPage, setCurrentPage] = useState('landing');
  const [isVerified, setIsVerified] = useState(false);

  const handleVerificationComplete = () => {
    setIsVerified(true);
    setCurrentPage('home');
  };

  const handleGetStarted = () => {
    setCurrentPage('onboarding');
  };

  const renderPage = () => {
    if (currentPage === 'landing') {
      return <LandingPage onGetStarted={handleGetStarted} />;
    }

    if (!isVerified) {
      return <OnboardingPage onVerificationComplete={handleVerificationComplete} />;
    }

    switch (currentPage) {
      case 'transactions':
        return <TransactionsPage onViewProperty={() => setCurrentPage('property-details')} />;
      case 'property-details':
        return <PropertyDetailsPage onBack={() => setCurrentPage('transactions')} />;
      case 'settings':
        return <SettingsPage />;
      case 'home':
      default:
        return <HomePage />;
    }
  };

  return (
    <div className="flex min-h-screen bg-slate-50">
      {currentPage !== 'landing' && currentPage !== 'property-details' && (
        <Sidebar currentPage={currentPage} onPageChange={setCurrentPage} />
      )}

      <div className={`flex-1 ${currentPage !== 'landing' && currentPage !== 'property-details' ? 'lg:ml-72' : ''}`}>
        {renderPage()}
      </div>
    </div>
  );
}

export default App;
