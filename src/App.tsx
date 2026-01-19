import { SubjectProvider, useSubjects } from './contexts/SubjectContext';
import { ConfigProvider, useConfig } from './contexts/ConfigContext';
import { Layout } from './components/Layout';
import { SemesterListView } from './components/SemesterListView';

function CurriculumTracker() {
  const { isLoading: isLoadingSubjects } = useSubjects();
  const { isLoading: isLoadingConfig } = useConfig();

  if (isLoadingSubjects || isLoadingConfig) {
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
    <Layout>
      <SemesterListView />
    </Layout>
  );
}

function App() {
  return (
    <ConfigProvider>
      <SubjectProvider>
        <CurriculumTracker />
      </SubjectProvider>
    </ConfigProvider>
  );
}

export default App;
