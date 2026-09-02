import { Routes, Route } from 'react-router-dom';
import { Home } from './pages/Home';
import { CreateEvent } from './pages/CreateEvent';
import { EventSetup } from './pages/EventSetup';
import { BracketView } from './pages/BracketView';
import { BattleLive } from './pages/BattleLive';
import { LiveScreen } from './pages/LiveScreen';
import { BeatsLibrary } from './pages/BeatsLibrary';

function App() {
  return (
    <div className="min-h-screen bg-background text-offwhite flex flex-col font-body">
      <main className="flex-1 flex flex-col">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/create" element={<CreateEvent />} />
          <Route path="/event/:id/setup" element={<EventSetup />} />
          <Route path="/event/:id" element={<BracketView />} />
          <Route path="/battle/:id" element={<BattleLive />} />
          <Route path="/live/:id" element={<LiveScreen />} />
          <Route path="/beats" element={<BeatsLibrary />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;
