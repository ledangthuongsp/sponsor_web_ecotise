import { useState } from "react";
import { Button } from "antd/es/radio";
import { Layout, Menu} from "antd";
import DashboardIcon from "../../assets/icons/DashboardIcon";
import Logo from "../../assets/logo.png";
import Icon from "../../assets/icons";
import "../../layouts/MainLayout.css";  // Assuming styles for your layout are in this file
import { CiGift } from "react-icons/ci";
import { CiUser } from "react-icons/ci";
import { useNavigate } from "react-router-dom";
import { CiSettings } from "react-icons/ci";

// Importing pages to be displayed in Content
import Overview from "../../models/sponsor/overviews/SponsorOverviewPage";
import SponsorNewsfeedPage from '../../models/sponsor/newsfeeds/SponsorNewsfeedPage';
import SponsorQRCodeManagementPage from "../../models/sponsor/qrcode/SponsorQRCodeManagementPage";
import DonationManagement from "../../models/donations/pages/DonationPage";
import LocationManagement from "../../models/locations/pages/LocationPage";
import RewardManagement from "../../models/rewards/RewardPages";
import SponsorInformationPage from "../../models/sponsor/information/SponsorInformation.jsx";
import ChangePasswordPage from "../../models/sponsor/ChangePasswordPage";
import EmployeeManagement from "../../models/employees/EmployeePage";
const { Sider, Content } = Layout;

const items = [
    {
        key: "1",
        icon: <DashboardIcon />,
        label: "Dashboard",
    },
    {
        key: "2",
        icon: <img src={Icon.DonationIcon} alt="Newsfeed" style={{ width: '24px', height: '24px' }} />,
        label: "Newsfeed Management",
    },
    {
        key: "3",
        icon: <img src={Icon.MaterialIcon} alt="QR Code" style={{ width: '24px', height: '24px' }} />,
        label: "Newsfeed QR Code",
    },
    {
        key: "4",
        icon: <img src={Icon.DonationIcon} alt="Donation" style={{ width: '24px', height: '24px' }} />,
        label: "Donation Management",
    },
    {
        key: "5",
        icon: <img src={Icon.LocationIcon} alt="Location" style={{ width: '24px', height: '24px' }} />,
        label: "Location Management",
    },
    {
        key: "6",
        icon: <CiGift size={24} />,
        label: "Reward Management",
    },
    {
        key: "7",
        icon: <CiUser size={24} />,
        label: "Information",
    },
    {
        key: "8",
        icon: <CiSettings size={24} />,
        label: "Change Password",
    },
];

const DashboardPage = () => {
    // State to manage which content to display
    const [activeContent, setActiveContent] = useState("1");
    const navigate = useNavigate();
    // Function to handle menu item click
    const handleMenuClick = (e) => {
        setActiveContent(e.key);
    };

    const handleLogout = () => {
        localStorage.clear(); // Clear localStorage
         navigate("/signin", { replace: true }); // Redirect to sign-in page
    };

    const renderContent = () => {
        switch (activeContent) {
            case "1":
                return <Overview />;
            case "2":
                return <SponsorNewsfeedPage />;
            case "3":
                return <SponsorQRCodeManagementPage />;
            case "4":
                return <DonationManagement />;
            case "5":
                return <LocationManagement />;
            case "6":
                return <RewardManagement />;
            case "7":
                return <SponsorInformationPage />;
            case "8":
                return <ChangePasswordPage />;
            // case "10":
            //     return <RewardManagement />;
            default:
                return <h1>Page Not Found</h1>;
        }
    };
    return (
        <Layout style={{ minHeight: "100vh" }}>
            {/* Sidebar */}
            <Sider width={240} className="sider" breakpoint="lg" collapsedWidth="0">
                <div className="logo-container" style={{ padding: "20px", textAlign: "center" }}>
                    <img src={Logo} alt="Logo" style={{ height: "100px", width: "auto" }} />
                </div>
                <Menu
                    className="sider-menu"
                    theme="light"
                    mode="inline"
                    defaultSelectedKeys={["1"]}
                    onClick={handleMenuClick}
                    items={items}
                />
                <Button
                    type="primary"
                    style={{ margin: "20px", alignContent: "center", display: "flex", justifyContent: "center" }}
                    onClick={handleLogout} // Logout handler
                >
                    Logout
                </Button>
            </Sider>

            {/* Main content area */}
            <Layout>
                <Content
                    style={{
                        margin: "24px 16px 0",
                        padding: "24px",
                        background: "#fff",
                        minHeight: "100vh",
                    }}
                >
                    {renderContent()}  {/* Dynamically render content based on selected menu */}
                </Content>
            </Layout>
        </Layout>
    );
};

export default DashboardPage;
