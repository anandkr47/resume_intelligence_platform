import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Upload } from './pages/Upload';
import { Resumes } from './pages/Resumes';
import { Analytics } from './pages/Analytics';
import { Jobs } from './pages/Jobs';
import { Layout } from './components/Layout';
import { Navigate } from 'react-router-dom';

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Analytics />} />
          <Route path="/upload" element={<Upload />} />
          <Route path="/resumes" element={<Resumes />} />
          <Route path="/analytics" element={<Navigate to="/" replace />} />
          <Route path="/jobs" element={<Jobs />} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;
