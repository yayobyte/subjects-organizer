import { useState } from 'react';
import { SubjectProvider } from './contexts/SubjectContext';
import { Layout } from './components/Layout';
import { SemesterListView } from './components/SemesterListView';
import { CurriculumGraph } from './components/CurriculumGraph';

function CurriculumTracker() {
  const [view, setView] = useState<'list' | 'graph'>('list');


  return (
    <Layout view={view} setView={setView}>
      {view === 'list' ? <SemesterListView /> : <CurriculumGraph />}
    </Layout>
  );
}

function App() {
  return (
    <SubjectProvider>
      <CurriculumTracker />
    </SubjectProvider>
  );
}

export default App;
