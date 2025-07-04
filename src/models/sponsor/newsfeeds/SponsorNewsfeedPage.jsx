import { useState, useEffect } from 'react';
import { Card, Row, Col, Button, Input, Modal, Form, DatePicker, Upload, message, List, Spin } from 'antd';
import axios from 'axios';
import { BASE_API_URL } from '../../../constants/APIConstants';
import moment from 'moment';
import { UploadOutlined } from '@ant-design/icons';

const SponsorNewsfeedPage = () => {
    const [newsfeeds, setNewsfeeds] = useState([]);
    const [loading, setLoading] = useState(false);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [editNewsfeed, setEditNewsfeed] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [isEditing, setIsEditing] = useState(false);
    const [sponsorId, setSponsorId] = useState(null);
    const [fileList, setFileList] = useState([]);
    const [selectedNewsfeed, setSelectedNewsfeed] = useState(null); // For selected newsfeed to fetch poll details
    const sponsorUsername = localStorage.getItem("username");

    // Fetch sponsorId using sponsor username
    useEffect(() => {
        const fetchSponsorId = async () => {
            try {
                if (!sponsorUsername) {
                    message.error('Username is not available in localStorage');
                    return;
                }
                const response = await axios.get(`http://localhost:7050/sponsor/get-by-username?username=${sponsorUsername}`);
                if (response.data.id) {
                    setSponsorId(response.data.id);
                } else {
                    message.error('Sponsor ID not found');
                }
            } catch (error) {
                console.error("Error fetching sponsorId:", error);
                message.error('Failed to fetch sponsor ID');
            }
        };

        if (sponsorUsername) {
            fetchSponsorId();
        }
    }, [sponsorUsername]);

    // Fetch all newsfeeds for the sponsor
    useEffect(() => {
        if (!sponsorId) return;

        const fetchNewsfeeds = async () => {
            setLoading(true);
            try {
                const response = await axios.get(`${BASE_API_URL}/newsfeed/get-newsfeed-by-sponsor-id?sponsorId=${sponsorId}`);
                setNewsfeeds(response.data);
            } catch (error) {
                message.error('Failed to load newsfeeds');
            }
            setLoading(false);
        };

        fetchNewsfeeds();
    }, [sponsorId]);

    // Fetch poll details and votes for a specific newsfeed
    const fetchPollDetails = async (pollId) => {
        try {
            const response = await axios.get(`${BASE_API_URL}/poll/by-newsfeed/${pollId}`);
            setSelectedNewsfeed({
                ...selectedNewsfeed,
                pollVotes: response.data.pollOptions, // Assume pollOptions contain votes and other details
            });
        } catch (error) {
            message.error('Failed to load poll details');
        }
    };

    // Handle add new newsfeed
    const handleAdd = () => {
        setIsEditing(false);
        setEditNewsfeed(null);
        setFileList([]);
        setIsModalVisible(true);
    };

    // Handle edit existing newsfeed
    const handleEdit = (newsfeed) => {
        setIsEditing(true);
        setEditNewsfeed({
            ...newsfeed,
            startedAt: newsfeed.startedAt ? moment(newsfeed.startedAt) : null,
            endedAt: newsfeed.endedAt ? moment(newsfeed.endedAt) : null,
        });
        setFileList(newsfeed.mediaUrls || []);
        setIsModalVisible(true);
    };

    // Handle delete newsfeed
    const handleDelete = async (newsfeedId) => {
        try {
            await axios.delete(`${BASE_API_URL}/newsfeed/delete/${newsfeedId}`);
            setNewsfeeds(newsfeeds.filter(newsfeed => newsfeed.id !== newsfeedId));
            message.success('Newsfeed deleted successfully');
        } catch (error) {
            message.error('Failed to delete newsfeed');
        }
    };

    // Save new or edited newsfeed
    const handleSave = async (values) => {
        try {
            const newFiles = fileList.filter(file => !file.url);
            let mediaUrls = fileList.filter(file => file.url).map(file => file.url);

            if (newFiles.length > 0) {
                const formData = new FormData();
                newFiles.forEach((file) => {
                    formData.append('files', file.originFileObj);
                });
                const uploadResponse = await axios.post(`${BASE_API_URL}/upload`, formData, { headers: { 'Content-Type': 'multipart/form-data' } });
                mediaUrls = mediaUrls.concat(uploadResponse.data.urls);
            }

            const payload = {
                ...values,
                startedAt: values.startedAt ? values.startedAt.toISOString() : null,
                endedAt: values.endedAt ? values.endedAt.toISOString() : null,
                sponsorId: sponsorId,
                mediaUrls: mediaUrls,
            };

            if (isEditing) {
                await axios.put(`${BASE_API_URL}/newsfeed/update/${editNewsfeed.id}`, payload);
                setNewsfeeds(newsfeeds.map(newsfeed => (newsfeed.id === editNewsfeed.id ? { ...newsfeed, ...payload } : newsfeed)));
                message.success('Newsfeed updated successfully');
            } else {
                const response = await axios.post(`${BASE_API_URL}/newsfeed/create`, payload);
                setNewsfeeds([...newsfeeds, response.data]);
                message.success('Newsfeed added successfully');
            }

            setIsModalVisible(false);
        } catch (error) {
            message.error('Failed to save newsfeed');
        }
    };

    // Filter newsfeeds based on search term
    const filteredNewsfeeds = newsfeeds.filter(newsfeed => newsfeed.content.toLowerCase().includes(searchTerm.toLowerCase()));

    // Form initial values
    const formInitialValues = editNewsfeed
        ? {
            ...editNewsfeed,
            startedAt: editNewsfeed.startedAt ? moment(editNewsfeed.startedAt) : null,
            endedAt: editNewsfeed.endedAt ? moment(editNewsfeed.endedAt) : null,
        }
        : {};

    return (
        <div style={{ padding: '20px' }}>
            <Row justify="space-between" style={{ marginBottom: '20px' }}>
                <Col>
                    <Input.Search
                        placeholder="Search newsfeeds"
                        onChange={(e) => setSearchTerm(e.target.value)}
                        style={{ width: 300 }}
                    />
                </Col>
                <Col>
                    <Button type="primary" onClick={handleAdd}>
                        Add New Newsfeed
                    </Button>
                </Col>
            </Row>

            <Row gutter={16}>
                {filteredNewsfeeds.map(newsfeed => (
                    <Col span={8} key={newsfeed.id}>
                        <Card
                            title={`Newsfeed ${newsfeed.id}`}
                            extra={
                                <Button type="link" onClick={() => handleEdit(newsfeed)}>Edit</Button>
                            }
                            actions={[
                                <Button type="link" onClick={() => handleDelete(newsfeed.id)}>Delete</Button>,
                                <Button type="link" onClick={() => fetchPollDetails(newsfeed.pollId)}>View Poll Details</Button>
                            ]}
                        >
                            <p>{newsfeed.content}</p>
                            <p><strong>Start Date:</strong> {moment(newsfeed.startedAt).format('YYYY-MM-DD')}</p>
                            <p><strong>End Date:</strong> {moment(newsfeed.endedAt).format('YYYY-MM-DD')}</p>
                            <p><strong>Reacts:</strong> {newsfeed.reactIds?.length || 0}</p>
                            <p><strong>Poll Count:</strong> {newsfeed.pollId ? (newsfeed.pollOptions?.length || 0) : 0}</p>
                            {newsfeed.mediaUrls && newsfeed.mediaUrls.map((url, index) => (
                                <img key={index} src={url} alt={`media ${index}`} style={{ width: "100%", marginBottom: 10 }} />
                            ))}
                        </Card>
                    </Col>
                ))}
            </Row>

            {/* View Poll Details Modal */}
            {selectedNewsfeed && selectedNewsfeed.pollVotes && (
                <Modal
                    title="Poll Votes Details"
                    open={true}
                    onCancel={() => setSelectedNewsfeed(null)}
                    footer={null}
                    width={600}
                >
                    <h3>Votes for Poll: {selectedNewsfeed.content}</h3>
                    <List
                        dataSource={selectedNewsfeed.pollVotes}
                        renderItem={(vote) => (
                            <List.Item>
                                <strong>User ID:</strong> {vote.userId} - <strong>Vote:</strong> {vote.selectedOption}
                            </List.Item>
                        )}
                    />
                </Modal>
            )}

            <Modal
                title={isEditing ? 'Edit Newsfeed' : 'Add Newsfeed'}
                open={isModalVisible}
                onCancel={() => setIsModalVisible(false)}
                footer={null}
                width={600}
                destroyOnClose
            >
                <Form
                    initialValues={formInitialValues}
                    onFinish={handleSave}
                    layout="vertical"
                >
                    <Form.Item name="content" label="Content" rules={[{ required: true, message: 'Please input content!' }]}>
                        <Input.TextArea rows={4} />
                    </Form.Item>
                    <Form.Item name="startedAt" label="Start Date" rules={[{ required: true, message: 'Please input start date!' }]}>
                        <DatePicker showTime format="YYYY-MM-DD HH:mm:ss" style={{ width: '100%' }} />
                    </Form.Item>
                    <Form.Item name="endedAt" label="End Date" rules={[{ required: true, message: 'Please input end date!' }]}>
                        <DatePicker showTime format="YYYY-MM-DD HH:mm:ss" style={{ width: '100%' }} />
                    </Form.Item>
                    <Form.Item label="Media">
                        <Upload
                            fileList={fileList}
                            onChange={({ fileList }) => setFileList(fileList)}
                            beforeUpload={() => false}
                            multiple
                            listType="picture"
                        >
                            <Button icon={<UploadOutlined />}>Upload Images</Button>
                        </Upload>
                    </Form.Item>
                    <Form.Item>
                        <Button type="primary" htmlType="submit">
                            {isEditing ? 'Update' : 'Create'}
                        </Button>
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    );
};

export default SponsorNewsfeedPage;
