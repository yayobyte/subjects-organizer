import { useState } from 'react';
import { SubjectProvider, useSubjects } from './contexts/SubjectContext';
import { Layout } from './components/Layout';
import { SemesterListView } from './components/SemesterListView';
import { CurriculumGraph } from './components/CurriculumGraph';

function CurriculumTracker() {
  const [view, setView] = useState<'list' | 'graph'>('list');
  const { isLoading } = useSubjects();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-crimson-violet-500 border-t-transparent"></div>
          <p className="mt-4 text-slate-600 dark:text-slate-400">Loading curriculum data...</p>
        </div>
      </div>
    );
  }

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
