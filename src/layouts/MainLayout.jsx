import { Flex, Layout, Menu } from "antd";
import Sider from "antd/es/layout/Sider";
import { Content } from "antd/es/layout/layout";

import "./MainLayout.css";
import DashboardIcon from "../assets/icons/DashboardIcon";
import Logo from "../assets/logo.png";
import Icon from "../assets/icons";
import { Link } from "react-router-dom";
const items = [
  {
    key: "1",
    icon: <DashboardIcon />,
    label: <Link to="/">Dashboard</Link>,
  },
  {
    key: "2",
    icon: <img src={Icon.DonationIcon} alt="Donation" style={{ width: '24px', height: '24px' }} />,
    label: <Link to="/donations">Donation Management</Link>,
  },
  {
    key: "4",
    icon: <img src={Icon.LocationIcon} alt="Location" style={{ width: '24px', height: '24px' }} />,
    label: <Link to="/locations">Location Management</Link>,
  },
  {
    key: "5",
    icon: <img src={Icon.MaterialIcon} alt="Material" style={{ width: '24px', height: '24px' }} />,
    label: <Link to="/materials">Material Management</Link>,
  },
  {
    key: "6",
    icon: <img src={Icon.AchievementIcon} alt="Achievement" style={{ width: '24px', height: '24px' }} />,
    label: <Link to="/achivement_levels">Achievement Levels</Link>,
  },
  {
    key: "7",
    icon: <img src={Icon.EmployeeIcon} alt="Employee" style={{ width: '24px', height: '24px' }} />,
    label: <Link to="/employees">Employees Management</Link>,
  },
  {
    key: "8",
    icon: <img src={Icon.DetectIcon} alt="Detect" style={{ width: '24px', height: '24px' }} />,
    label: <Link to="/detect-response">Detect Response</Link>,
  },
  {
    key: "9",
    icon: <img src={Icon.QuizIcon} alt="Quiz" style={{ width: '24px', height: '24px' }} />,
    label: <Link to="/quiz-management">Quiz Management</Link>,
  },
];

const MainLayout = ({ children }) => {
  const [username, setUsername] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const storedUsername = localStorage.getItem("username");
    if (!storedUsername) {
      navigate("/signin"); // Redirect to sign in if no username
    } else {
      setUsername(storedUsername);
    }
  }, [navigate]);

  return (
    <Layout>
      <Sider
        className="sider"
        breakpoint="lg"
        collapsedWidth="0"
        width="20%"
        onBreakpoint={(broken) => {
          console.log(broken);
        }}
        onCollapse={(collapsed, type) => {
          console.log(collapsed, type);
        }}
      >
        <Flex className="sider-header" align="center" justify="center" style={{ minHeight: 120 }}>
          <img
            src={Logo}
            alt="Logo"
            style={{ height: "100px", width: "auto", display: "block" }}
          />
        </Flex>
        <Menu
          className="sider-menu"
          theme="light"
          mode="inline"
          defaultSelectedKeys={["1"]}
          items={items}
        />
      </Sider>
      <Layout>
        <Content
          style={{
            margin: "24px 16px 0",
          }}
        >
          {children}
        </Content>
      </Layout>
    </Layout>
  );
};

export default MainLayout;
