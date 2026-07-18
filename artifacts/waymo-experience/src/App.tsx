import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from '@/components/ui/toaster';
import { TooltipProvider } from '@/components/ui/tooltip';
import NotFound from '@/pages/not-found';
import Home from '@/pages/Home';
import Vehicle from '@/pages/Vehicle';
import Intelligence from '@/pages/Intelligence';
import Safety from '@/pages/Safety';
import Network from '@/pages/Network';
import Vision from '@/pages/Vision';
import { Route, Switch, Router as WouterRouter } from 'wouter';
import { useEffect } from 'react';

const queryClient = new QueryClient();

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/vehicle" component={Vehicle} />
      <Route path="/intelligence" component={Intelligence} />
      <Route path="/safety" component={Safety} />
      <Route path="/network" component={Network} />
      <Route path="/vision" component={Vision} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  useEffect(() => {
    document.documentElement.classList.add('dark');
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, '')}>
          <Router />
        </WouterRouter>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
