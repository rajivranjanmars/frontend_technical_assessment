import { useEffect } from 'react';
import { PipelineToolbar } from './toolbar';
import { PipelineUI } from './ui';
import { SubmitButton } from './submit';
import { MenuBar } from './components/MenuBar';
import { KeyboardHandler } from './components/KeyboardHandler';
import { StatusBar } from './components/StatusBar';
import { ContextMenu } from './components/ContextMenu';
import { WelcomeModal } from './components/WelcomeModal';
import { useStore } from './store';

function App() {
  const loadAutoSave = useStore(state => state.loadAutoSave);

  // Load auto-saved pipeline on mount
  useEffect(() => {
    loadAutoSave();
  }, [loadAutoSave]);

  return (
    <div style={{ height: '100vh', display: 'flex', flexDirection: 'column' }}>
      <KeyboardHandler />
      <WelcomeModal />
      <MenuBar />
      <PipelineToolbar />
      <ContextMenu>
        <PipelineUI />
      </ContextMenu>
      <SubmitButton />
      <StatusBar />
    </div>
  );
}

export default App;
