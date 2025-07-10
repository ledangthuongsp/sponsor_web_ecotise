import { useState, useEffect } from 'react';
import { Card, Row, Col, Button, Modal, message, Spin, Typography } from 'antd';
import axios from 'axios';
import { BASE_API_URL } from '../../../constants/APIConstants';

const SponsorQRCodeManagementPage = () => {
  const [newsfeeds, setNewsfeeds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalLoading, setModalLoading] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [qrCodeUrl, setQrCodeUrl] = useState(null);
  const [selectedNewsfeed, setSelectedNewsfeed] = useState(null);
  const [sponsorId, setSponsorId] = useState(null);

  const sponsorEmail = localStorage.getItem("email");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const sponsorId = await fetchSponsorId(sponsorEmail);
        setSponsorId(sponsorId);

        const res = await axios.get(`${BASE_API_URL}/newsfeed/get-newsfeed-by-sponsor-id?sponsorId=${sponsorId}`);
        setNewsfeeds(res.data);
      } catch (err) {
        console.error(err);
        message.error('Không thể tải dữ liệu Newsfeed');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [sponsorEmail]);

  const fetchSponsorId = async (email) => {
    const res = await axios.get(`${BASE_API_URL}/sponsor/get-by-email?email=${email}`);
    return res.data.id;
  };

  const handleGenerateQRCode = async (newsfeed) => {
    setSelectedNewsfeed(newsfeed);
    setQrCodeUrl(null);
    setModalLoading(true);
    setIsModalVisible(true);

    try {
      const res = await axios.post(`${BASE_API_URL}/sponsor/qrcode/generate`, null, {
        params: {
          sponsorId: sponsorId,
          points: 10,
          newsfeedId: newsfeed.id,
        },
      });

      const url = res.data?.qrCodeUrl;
      if (url) {
        setQrCodeUrl(url);
      } else {
        message.error("Không nhận được QR Code URL");
      }
    } catch (err) {
      console.error(err);
      message.error("Không thể tạo QR Code");
    } finally {
      setModalLoading(false);
    }
  };

  return (
    <div style={{ padding: 24 }}>
      <Typography.Title level={2}>Quản lý QR Code cho Newsfeed</Typography.Title>

      {loading ? (
        <div style={{ textAlign: 'center', marginTop: 100 }}>
          <Spin size="large" />
        </div>
      ) : (
        <Row gutter={[16, 16]}>
          {newsfeeds.map((newsfeed) => (
            <Col span={8} key={newsfeed.id}>
              <Card
                title={`Newsfeed #${newsfeed.id}`}
                extra={<Button type="link" onClick={() => handleGenerateQRCode(newsfeed)}>Tạo QR Code</Button>}
              >
                <p>{newsfeed.content}</p>
                <p><strong>Bắt đầu:</strong> {new Date(newsfeed.startedAt).toLocaleString()}</p>
                <p><strong>Kết thúc:</strong> {new Date(newsfeed.endedAt).toLocaleString()}</p>
              </Card>
            </Col>
          ))}
        </Row>
      )}

      <Modal
        title="QR Code"
        open={isModalVisible}
        onCancel={() => {
          setIsModalVisible(false);
          setQrCodeUrl(null);
        }}
        footer={null}
        centered
        width={500}
      >
        <Typography.Title level={4}>
          QR Code cho Newsfeed #{selectedNewsfeed?.id}
        </Typography.Title>

        {modalLoading ? (
          <div style={{ textAlign: 'center', padding: 40 }}>
            <Spin size="large" />
          </div>
        ) : qrCodeUrl ? (
          <div style={{ textAlign: 'center' }}>
            <img
              src={qrCodeUrl}
              alt="QR Code"
              style={{ maxWidth: '100%', height: 'auto', marginBottom: 16 }}
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = "/fallback-qr.png"; // nếu có ảnh fallback
              }}
            />
            <p>Quét mã để nhận điểm tham gia sự kiện</p>
          </div>
        ) : (
          <Typography.Text type="danger">Không thể hiển thị QR Code</Typography.Text>
        )}
      </Modal>
    </div>
  );
};

export default SponsorQRCodeManagementPage;
