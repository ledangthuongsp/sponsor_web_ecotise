import { useState } from "react";
import { Layout, Menu } from "antd";
import DashboardIcon from "../../assets/icons/DashboardIcon";
import Logo from "../../assets/logo.png";
import Icon from "../../assets/icons";
import "../../layouts/MainLayout.css";  // Assuming styles for your layout are in this file
import { CiGift } from "react-icons/ci";

// Importing pages to be displayed in Content
import Overview from "../../models/overview/pages/OverviewPage";
import DonationManagement from "../../models/donations/pages/DonationPage";
import LocationManagement from "../../models/locations/pages/LocationPage";
import MaterialManagement from "../../models/materials/pages/MaterialsPage";
import AchievementLevels from "../../models/achivements/AchivementLevelPage";
import EmployeeManagement from "../../models/employees/EmployeePage";
import DetectResponse from "../../models/detect_response/DetectResponsePage";
import QuizManagement from "../../models/quiz/QuizManagementPage";
import RewardManagement from "../../models/rewards/RewardPages";

const { Sider, Content } = Layout;

const items = [
    {
        key: "1",
        icon: <DashboardIcon />,
        label: "Dashboard",
    },
    {
        key: "2",
        icon: <img src={Icon.DonationIcon} alt="Donation" style={{ width: '24px', height: '24px' }} />,
        label: "Donation Management",
    },
    {
        key: "4",
        icon: <img src={Icon.LocationIcon} alt="Location" style={{ width: '24px', height: '24px' }} />,
        label: "Location Management",
    },
    {
        key: "5",
        icon: <img src={Icon.MaterialIcon} alt="Material" style={{ width: '24px', height: '24px' }} />,
        label: "Material Management",
    },
    {
        key: "6",
        icon: <img src={Icon.AchievementIcon} alt="Achievement" style={{ width: '24px', height: '24px' }} />,
        label: "Achievement Levels",
    },
    {
        key: "7",
        icon: <img src={Icon.EmployeeIcon} alt="Employee" style={{ width: '24px', height: '24px' }} />,
        label: "Employees Management",
    },
    {
        key: "8",
        icon: <img src={Icon.DetectIcon} alt="Detect" style={{ width: '24px', height: '24px' }} />,
        label: "Detect Response",
    },
    {
        key: "9",
        icon: <img src={Icon.QuizIcon} alt="Quiz" style={{ width: '24px', height: '24px' }} />,
        label: "Quiz Management",
    },
    {
        key: "10",
        icon: <CiGift size={24} />,
        label: "Reward Management",
    },
];

const AdminDashboardPage = () => {
    // State to manage which content to display
    const [activeContent, setActiveContent] = useState("1");

    // Function to handle menu item click
    const handleMenuClick = (e) => {
        setActiveContent(e.key);
    };

    const renderContent = () => {
        switch (activeContent) {
            case "1":
                return <Overview />;
            case "2":
                return <DonationManagement />;
            case "4":
                return <LocationManagement />;
            case "5":
                return <MaterialManagement />;
            case "6":
                return <AchievementLevels />;
            case "7":
                return <EmployeeManagement />;
            case "8":
                return <DetectResponse />;
            case "9":
                return <QuizManagement />;
            case "10":
                return <RewardManagement />;
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
                    onClick={handleMenuClick} // Update the content when menu is clicked
                    items={items}
                />
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

export default AdminDashboardPage;
