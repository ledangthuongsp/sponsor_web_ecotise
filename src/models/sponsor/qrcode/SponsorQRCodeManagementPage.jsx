import { useState, useEffect } from 'react';
import { Card, Row, Col, Button, Modal, message, Spin } from 'antd';
import axios from 'axios';
import { BASE_API_URL } from '../../../constants/APIConstants';

const SponsorQRCodeManagementPage = () => {
    const [newsfeeds, setNewsfeeds] = useState([]);
    const [loading, setLoading] = useState(false);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [qrCodeUrl, setQrCodeUrl] = useState(null);
    const [selectedNewsfeed, setSelectedNewsfeed] = useState(null);

    const sponsorUsername = localStorage.getItem("username");

    // Lấy danh sách newsfeeds của sponsor
    useEffect(() => {
        const fetchNewsfeeds = async () => {
            setLoading(true);
            try {
                const sponsorId = await fetchSponsorId(sponsorUsername);
                const response = await axios.get(`${BASE_API_URL}/newsfeed/get-newsfeed-by-sponsor-id?sponsorId=${sponsorId}`);
                setNewsfeeds(response.data);
            } catch (error) {
                message.error('Failed to load newsfeeds');
            }
            setLoading(false);
        };

        fetchNewsfeeds();
    }, []);

    // Lấy sponsorId thông qua username
    const fetchSponsorId = async (username) => {
        try {
            const response = await axios.get(`http://localhost:7050/sponsor/get-by-username?username=${username}`);
            return response.data.id;
        } catch (error) {
            message.error('Failed to fetch sponsor ID');
        }
    };

    // Lấy URL QR code khi nhấn vào một newsfeed
    const handleGenerateQRCode = async (newsfeed) => {
        setSelectedNewsfeed(newsfeed);
        setLoading(true);

        try {
            const response = await axios.post(`${BASE_API_URL}/sponsor/qrcode/generate`, {
                sponsorId: newsfeed.sponsorId,
                points: 10, // Assuming some points, this can be dynamic
                newsfeedId: newsfeed.id,
            });

            setQrCodeUrl(response.data.qrCodeUrl); // Get QR Code URL from response
            setIsModalVisible(true);
        } catch (error) {
            message.error('Failed to generate QR code');
        }

        setLoading(false);
    };

    return (
        <div style={{ padding: '20px' }}>
            <h2>Manage QR Codes for Newsfeeds</h2>
            <Row gutter={16}>
                {newsfeeds.map(newsfeed => (
                    <Col span={8} key={newsfeed.id}>
                        <Card
                            title={`Newsfeed ${newsfeed.id}`}
                            extra={
                                <Button type="link" onClick={() => handleGenerateQRCode(newsfeed)}>
                                    Generate QR Code
                                </Button>
                            }
                        >
                            <p>{newsfeed.content}</p>
                            <p><strong>Start Date:</strong> {newsfeed.startedAt}</p>
                            <p><strong>End Date:</strong> {newsfeed.endedAt}</p>
                        </Card>
                    </Col>
                ))}
            </Row>

            {/* QR Code Modal */}
            <Modal
                title="QR Code"
                visible={isModalVisible}
                onCancel={() => setIsModalVisible(false)}
                footer={null}
                width={600}
            >
                <h3>QR Code for Newsfeed {selectedNewsfeed?.id}</h3>
                {loading ? (
                    <Spin size="large" />
                ) : (
                    <div style={{ textAlign: 'center' }}>
                        <img src={qrCodeUrl} alt="QR Code" style={{ width: '100%' }} />
                        <p>Scan this QR code to participate and earn points!</p>
                    </div>
                )}
            </Modal>
        </div>
    );
};

export default SponsorQRCodeManagementPage;
