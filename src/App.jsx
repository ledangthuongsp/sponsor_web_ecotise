import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LandingPage from './pages/landing/landing_page';
import Signin from './pages/landing/sign_in_page';
import Dashboard from './pages/dashboard/dashboard_page';
import HelloPage from './pages/landing/hello_pages';
import SponsorRegister from './pages/landing/sponsor_register_tab';
import AdminDashboardPage from './pages/dashboard/admin_dashboard_page';
import Overview from './models/overview/pages/OverviewPage';
const App = () => {
    return (
        <Router>
            <Routes>
                <Route path='/' element={<LandingPage />} />
                <Route path='/signin' element={<Signin />} />
                <Route path="/hello" element={<HelloPage />} />
                <Route path="/sponsor-register" element={<SponsorRegister />} />
                <Route path="/dashboard-admin" element={<AdminDashboardPage />} />
                <Route path='/dashboard-sponsor' element={<Dashboard />} />
                <Route path='/overview' element={<Overview />} />
            </Routes>
        </Router>
    );
};
export default App;
