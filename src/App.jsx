import { Toaster } from "@/components/ui/toaster"
import { QueryClientProvider } from '@tanstack/react-query'
import { queryClientInstance } from '@/lib/query-client'
import { BrowserRouter as Router, Route, Routes, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { Suspense, lazy } from 'react';
import PageNotFound from './lib/PageNotFound';
import { AuthProvider, useAuth } from '@/lib/AuthContext';
import UserNotRegisteredError from '@/components/UserNotRegisteredError';
import ScrollToTop from './components/ScrollToTop';
import Home from '@/pages/Home';
import { LanguageProvider } from '@/i18n/LanguageProvider';
import { ThemeProvider } from '@/i18n/ThemeProvider';
// Add page imports here

const ArticleDetail = lazy(() => import('@/pages/ArticleDetail'));
const AccountDeletion = lazy(() => import('@/pages/AccountDeletion'));
const GoogleLogin = lazy(() => import('@/pages/GoogleLogin'));

const pageTransition = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  exit: { opacity: 0 },
  transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1] },
};

const RouteFallback = () => (
  <div className="fixed inset-0 flex items-center justify-center bg-background">
    <div className="w-8 h-8 border-4 border-secondary/30 border-t-accent rounded-full animate-spin"></div>
  </div>
);

const AnimatedRoutes = () => {
  const location = useLocation();
  return (
    <AnimatePresence mode="wait">
      <motion.div key={location.pathname} {...pageTransition} className="bg-background">
        <Routes location={location}>
          {/* Add your page Route elements here */}
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Suspense fallback={<RouteFallback />}><GoogleLogin /></Suspense>} />
          <Route path="/artigos/:slug" element={<Suspense fallback={<RouteFallback />}><ArticleDetail /></Suspense>} />
          <Route path="/conta/excluir" element={<Suspense fallback={<RouteFallback />}><AccountDeletion /></Suspense>} />
          <Route path="*" element={<PageNotFound />} />
        </Routes>
      </motion.div>
    </AnimatePresence>
  );
};

const AuthenticatedApp = () => {
  const { isLoadingAuth, isLoadingPublicSettings, authError, navigateToLogin } = useAuth();

  // Show loading spinner while checking app public settings or auth
  if (isLoadingPublicSettings || isLoadingAuth) {
    return (
      <div className="fixed inset-0 flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-slate-200 border-t-slate-800 rounded-full animate-spin"></div>
      </div>
    );
  }

  // Handle authentication errors
  if (authError) {
    if (authError.type === 'user_not_registered') {
      return <UserNotRegisteredError />;
    } else if (authError.type === 'auth_required') {
      // Redirect to login automatically
      navigateToLogin();
      return null;
    }
  }

  // Render the main app
  return <AnimatedRoutes />;
};


function App() {

  return (
    <AuthProvider>
      <QueryClientProvider client={queryClientInstance}>
        <Router>
          <ScrollToTop />
          <LanguageProvider>
            <ThemeProvider>
              <AuthenticatedApp />
            </ThemeProvider>
          </LanguageProvider>
        </Router>
        <Toaster />
      </QueryClientProvider>
    </AuthProvider>
  )
}

export default App
