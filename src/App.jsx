import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LandingPage from './pages/landing/landing_page';
import Signin from './pages/authenticate/sign_in_page'
import Dashboard from './pages/dashboard/dashboard_page';
import paths from './routes/paths';
import Activity from './pages/activity/activity_page';
import SponsorInfo from './components/sponsor_info';
const App = () => {
    return (
        <Router>
            <Routes>
                {/* Route của Landing Page */}
                <Route path={paths.landing} element={<LandingPage />} />
                
                {/* Route của Sign In */}
                <Route path={paths.signin} element={<Signin />} />
                
                {/* Route của Dashboard */}
                <Route path={paths.dashboard} element={<Dashboard />} />
                <Route path={paths.activity} element={<Activity />} />
            </Routes>
        </Router>
    );
};
export default App;
