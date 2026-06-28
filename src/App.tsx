import { Dashboard } from './pages/Dashboard';
import { ToastProvider } from './components/ToastProvider';
import { InspectorProvider } from './components/InspectorProvider';
import { ErrorBoundary } from './components/ErrorBoundary';

function App() {
  return (
    <ErrorBoundary>
      <ToastProvider>
        <InspectorProvider>
          <Dashboard />
        </InspectorProvider>
      </ToastProvider>
    </ErrorBoundary>
  );
}

export default App;
