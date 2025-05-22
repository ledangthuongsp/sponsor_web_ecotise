import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LandingPage from './pages/landing/landing_page';
import Signin from './pages/landing/sign_in_page';
import Dashboard from './pages/dashboard/dashboard_page';
import paths from './routes/paths';
import Activity from './pages/activity/activity_page';
import DonationsPage from './pages/donation/donation_page';
import HelloPage from './pages/landing/hello_pages';
import SponsorRegister from './pages/landing/sponsor_register_tab';
const App = () => {
    return (
        <Router>
            <Routes>
                <Route path={paths.landing} element={<LandingPage />} />
                <Route path={paths.signin} element={<Signin />} />
                <Route path="/hello" element={<HelloPage />} />
                <Route path="/sponsor-register" element={<SponsorRegister />} />
                <Route path={paths.dashboard} element={<Dashboard />} />
                <Route path={paths.activity} element={<Activity />} />
                <Route path={paths.donation} element={<DonationsPage />} />
            </Routes>
        </Router>
    );
};
export default App;
