import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LandingPage from './pages/landing/landing_page';
import Signin from './pages/authenticate/sign_in_page';
import Dashboard from './pages/dashboard/dashboard_page'; // Thay đường dẫn đúng nếu khác
import paths from './routes/paths';

const App = () => {
    return (
        <Router>
            <Routes>
                {/* Hiển thị Landing Page khi truy cập vào "/" */}
                <Route path={paths.landing} element={<LandingPage />} />

                {/* Hiển thị trang Sign In khi truy cập "/signin" */}
                <Route path={paths.signin} element={<Signin />} />

                {/* Hiển thị trang Dashboard khi truy cập "/dashboard" */}
                <Route path={paths.dashboard} element={<Dashboard />} />
            </Routes>
        </Router>
    );
};

export default App;
