import { useState, useEffect } from "react";
import { Card, Col, Row, Statistic, Pagination } from "antd";
import { Bar, Pie } from "react-chartjs-2";
import axios from "axios";
import { BASE_API_URL } from "../../../constants/APIConstants";
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement);

// Component để hiển thị một newsfeed
const NewsfeedCard = ({ title, content, reactCount, startDate, endDate, mediaUrls }) => (
    <Card title={title} bordered={false} style={{ marginBottom: 20 }}>
        <p>{content}</p>
        <p><strong>Start Date:</strong> {new Date(startDate).toLocaleString()}</p>
        <p><strong>End Date:</strong> {new Date(endDate).toLocaleString()}</p>
        <p><strong>Reacts:</strong> {reactCount}</p>
        {mediaUrls && mediaUrls.length > 0 && (
            <div style={{ display: "flex", gap: "10px" }}>
                {mediaUrls.map((url, index) => (
                    <img key={index} src={url} alt={`media ${index}`} style={{ width: "100px", height: "100px", objectFit: "cover" }} />
                ))}
            </div>
        )}
    </Card>
);
const VoteCard = ({ title, content, voteCount, startDate, endDate, mediaUrls }) => (
    <Card title={title} bordered={false} style={{ marginBottom: 20 }}>
        <p>{content}</p>
        <p><strong>Start Date:</strong> {new Date(startDate).toLocaleString()}</p>
        <p><strong>End Date:</strong> {new Date(endDate).toLocaleString()}</p>
        <p><strong>Votes:</strong> {voteCount}</p>
        {mediaUrls && mediaUrls.length > 0 && (
            <div style={{ display: "flex", gap: "10px" }}>
                {mediaUrls.map((url, index) => (
                    <img key={index} src={url} alt={`media ${index}`} style={{ width: "100px", height: "100px", objectFit: "cover" }} />
                ))}
            </div>
        )}
    </Card>
);
const SponsorOverviewPage = () => {
    const [statistics, setStatistics] = useState({});
    const [mostReacted, setMostReacted] = useState({});
    const [mostVoted, setMostVoted] = useState({});
    const [newsfeeds, setNewsfeeds] = useState([]);
    const [companyInfo, setCompanyInfo] = useState({});
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize] = useState(5);  // Số lượng bài viết hiển thị mỗi trang cho phần "All Newsfeeds"
    const [sponsorId, setSponsorId] = useState(null);

    // Lấy username từ localStorage
    const sponsorUsername = localStorage.getItem("username");

    useEffect(() => {
        // Lấy sponsorId thông qua username
        const fetchSponsorId = async () => {
            try {
                const response = await axios.get(`http://localhost:7050/sponsor/get-by-username?username=${sponsorUsername}`);
                setSponsorId(response.data.id);  // Lưu sponsorId vào state
                setCompanyInfo(response.data);  // Lưu thông tin công ty
            } catch (error) {
                console.error("Error fetching sponsorId:", error);
            }
        };

        if (sponsorUsername) {
            fetchSponsorId();
        }
    }, [sponsorUsername]);

    useEffect(() => {
        if (sponsorId) {
            const fetchStatistics = async () => {
                try {
                    const statsResponse = await axios.get(`${BASE_API_URL}/newsfeed-statistic/get-statistics?sponsor_id=${sponsorId}`);
                    setStatistics(statsResponse.data);

                    const mostReactedResponse = await axios.get(`${BASE_API_URL}/newsfeed-statistic/most-reacted?sponsor_id=${sponsorId}`);
                    setMostReacted(mostReactedResponse.data);

                    const mostVotedResponse = await axios.get(`${BASE_API_URL}/newsfeed-statistic/most-voted?sponsor_id=${sponsorId}`);
                    setMostVoted(mostVotedResponse.data);

                    const newsfeedResponse = await axios.get(`${BASE_API_URL}/newsfeed-statistic/get-all?sponsor_id=${sponsorId}`);
                    setNewsfeeds(newsfeedResponse.data);
                } catch (error) {
                    console.error("Error fetching data:", error);
                }
            };

            fetchStatistics();
        }
    }, [sponsorId]);

    const handlePaginationChange = (page) => {
        setCurrentPage(page);
    };

    const getPaginatedNewsfeeds = () => {
        const start = (currentPage - 1) * pageSize;
        const end = start + pageSize;
        return newsfeeds.slice(start, end);
    };

    return (
        <div style={{ padding: '20px' }}>
            <Row gutter={16}>
                <Col span={8}>
                    <Card title="Total Reacts">
                        <Statistic value={statistics.totalReacts || 0} />
                    </Card>
                </Col>
                <Col span={8}>
                    <Card title="Total Votes">
                        <Statistic value={statistics.totalVotes || 0} />
                    </Card>
                </Col>
            </Row>

            {/* Most Reacted Newsfeed */}
            <h2>Most Reacted Newsfeed</h2>
            <Row gutter={16}>
                <Col span={8}>
                    <NewsfeedCard
                        title="Most Reacted"
                        content={mostReacted.content}
                        reactCount={mostReacted.reactIds ? mostReacted.reactIds.length : 0}
                        startDate={mostReacted.startedAt}
                        endDate={mostReacted.endedAt}
                        mediaUrls={mostReacted.mediaUrls}
                    />
                </Col>
            </Row>

            {/* Most Voted Newsfeed */}
            <h2>Most Voted Newsfeed</h2>
            <Row gutter={16}>
                <Col span={8}>
                    <VoteCard
                        title="Most Voted"
                        content={mostVoted.content}
                        voteCount={1}  // Assuming a vote is counted as a react
                        startDate={mostVoted.startedAt}
                        endDate={mostVoted.endedAt}
                        mediaUrls={mostVoted.mediaUrls}
                    />
                </Col>
            </Row>

            {/* Hiển thị phân trang cho All Newsfeeds */}
            <Pagination
                current={currentPage}
                pageSize={pageSize}
                total={newsfeeds.length}
                onChange={handlePaginationChange}
                style={{ marginTop: 20, textAlign: "center" }}
            />

            <h2>All Newsfeeds</h2>
            <Row gutter={16}>
                {getPaginatedNewsfeeds().map(newsfeed => (
                    <Col span={8} key={newsfeed.id}>
                        <NewsfeedCard
                            title={`Newsfeed ${newsfeed.id}`}
                            content={newsfeed.content}
                            reactCount={newsfeed.reactIds.length}
                            startDate={newsfeed.startedAt}
                            endDate={newsfeed.endedAt}
                            mediaUrls={newsfeed.mediaUrls}
                        />
                    </Col>
                ))}
            </Row>

            {/* Biểu đồ Cột (Bar Chart) */}
            <h2>React and Vote Statistics</h2>
            <Card title="React and Vote Bar Chart">
                <Bar data={{
                    labels: ['React', 'Vote'],
                    datasets: [
                        {
                            label: 'Total Reacts & Votes',
                            data: [statistics.totalReacts || 0, statistics.totalVotes || 0],
                            backgroundColor: ['#FF6384', '#36A2EB'],
                            borderColor: ['#FF6384', '#36A2EB'],
                            borderWidth: 1,
                        },
                    ],
                }} options={{ responsive: true }} />
            </Card>

            {/* Hiển thị thông tin công ty */}
            <h2>Company Information</h2>
            <Card title="Company Details">
                <p><strong>Company Name:</strong> {companyInfo.companyName}</p>
                <p><strong>Phone Number:</strong> {companyInfo.companyPhoneNumberContact}</p>
                <p><strong>Email:</strong> {companyInfo.companyEmailContact}</p>
                <p><strong>Address:</strong> {companyInfo.companyAddress}</p>
                <p><strong>Company Points:</strong> {companyInfo.companyPoints}</p>
            </Card>
        </div>
    );
};

export default SponsorOverviewPage;
