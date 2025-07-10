import { useState, useEffect } from 'react';
import {
    Card, Row, Col, Button, Input, Modal, Form,
    DatePicker, Upload, message, List
} from 'antd';
import axios from 'axios';
import { BASE_API_URL } from '../../../constants/APIConstants';
import moment from 'moment';
import { UploadOutlined } from '@ant-design/icons';
import AddNewsfeedModal from './AddNewsfeedModal';
import dayjs from "dayjs";

const SponsorNewsfeedPage = () => {
    const [newsfeeds, setNewsfeeds] = useState([]);
    const [loading, setLoading] = useState(false);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [editNewsfeed, setEditNewsfeed] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [isAddMode, setIsAddMode] = useState(false);
    const [sponsorId, setSponsorId] = useState(null);
    const [fileList, setFileList] = useState([]);
    const [selectedNewsfeed, setSelectedNewsfeed] = useState(null);

    const sponsorEmail = localStorage.getItem("email");

    const fetchNewsfeeds = async () => {
        if (!sponsorId) return;
        setLoading(true);
        try {
            const response = await axios.get(`${BASE_API_URL}/newsfeed/get-newsfeed-by-sponsor-id?sponsorId=${sponsorId}`);
            setNewsfeeds(response.data);
        } catch (error) {
            message.error('Failed to load newsfeeds');
        }
        setLoading(false);
    };

    useEffect(() => {
        const fetchSponsorId = async () => {
            try {
                const response = await axios.get(`${BASE_API_URL}/sponsor/get-by-email?email=${sponsorEmail}`);
                if (response.data.id) {
                    setSponsorId(response.data.id);
                }
            } catch (error) {
                message.error('Failed to fetch sponsor ID');
            }
        };
        if (sponsorEmail) fetchSponsorId();
    }, [sponsorEmail]);

    useEffect(() => {
        fetchNewsfeeds();
    }, [sponsorId]);

    const handleAdd = () => {
        setIsAddMode(true);
        setIsModalVisible(true);
    };

    const handleEdit = (newsfeed) => {
        setIsAddMode(false);
        setEditNewsfeed({
            ...newsfeed,
            startedAt: newsfeed.startedAt ? moment(newsfeed.startedAt) : null,
            endedAt: newsfeed.endedAt ? moment(newsfeed.endedAt) : null,
        });
        setFileList(newsfeed.mediaUrls || []);
        setIsModalVisible(true);
    };

    const handleDelete = async (newsfeedId) => {
        try {
            await axios.delete(`${BASE_API_URL}/newsfeed/delete/${newsfeedId}`);
            setNewsfeeds(newsfeeds.filter(nf => nf.id !== newsfeedId));
            message.success('Newsfeed deleted');
        } catch (error) {
            message.error('Failed to delete newsfeed');
        }
    };

    const handleSave = async (values) => {
        try {
            const newFiles = fileList.filter(file => !file.url);
            let mediaUrls = fileList.filter(file => file.url).map(file => file.url);

            if (newFiles.length > 0) {
                const formData = new FormData();
                newFiles.forEach(file => formData.append('files', file.originFileObj));
                const uploadRes = await axios.post(`${BASE_API_URL}/upload`, formData, {
                    headers: { 'Content-Type': 'multipart/form-data' },
                });
                mediaUrls = mediaUrls.concat(uploadRes.data.urls);
            }

            const payload = {
                ...values,
                startedAt: dayjs(values.startedAt).format("YYYY-MM-DD HH:mm:ss"),
                endedAt: dayjs(values.endedAt).format("YYYY-MM-DD HH:mm:ss"),
                sponsorId,
                mediaUrls
            };

            await axios.put(`${BASE_API_URL}/newsfeed/update/${editNewsfeed.id}`, payload);
            setNewsfeeds(newsfeeds.map(nf => nf.id === editNewsfeed.id ? { ...nf, ...payload } : nf));
            message.success('Newsfeed updated');
            setIsModalVisible(false);
            setEditNewsfeed(null);
        } catch (error) {
            message.error('Failed to save newsfeed');
        }
    };

    const fetchPollDetails = async (pollId, newsfeed) => {
        try {
            const response = await axios.get(`${BASE_API_URL}/poll/by-newsfeed/${pollId}`);
            const poll = response.data;

            const enrichedOptions = await Promise.all(
                poll.pollOptions.map(async (option) => {
                    const enrichedVotes = await Promise.all(
                        (option.votes || []).map(async (vote) => {
                            try {
                                const userRes = await axios.get(`${BASE_API_URL}/user/get-user-by-id?userId=${vote.userId}`);
                                return {
                                    ...vote,
                                    fullName: userRes.data.fullName,
                                    avatarUrl: userRes.data.avatarUrl,
                                };
                            } catch {
                                return vote;
                            }
                        })
                    );
                    return {
                        ...option,
                        votes: enrichedVotes
                    };
                })
            );

            setSelectedNewsfeed({
                id: newsfeed.id,
                content: newsfeed.content,
                pollDetails: {
                    ...poll,
                    pollOptions: enrichedOptions
                }
            });
        } catch {
            message.error('Failed to load poll details');
        }
    };

    const filteredNewsfeeds = newsfeeds.filter(nf =>
        nf.content?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const formInitialValues = editNewsfeed
        ? {
              ...editNewsfeed,
              startedAt: moment(editNewsfeed.startedAt),
              endedAt: moment(editNewsfeed.endedAt),
          }
        : {};

    return (
        <div style={{ padding: 20 }}>
            <Row justify="space-between" style={{ marginBottom: 20 }}>
                <Col>
                    <Input.Search
                        placeholder="Search newsfeeds"
                        onChange={e => setSearchTerm(e.target.value)}
                        style={{ width: 300 }}
                    />
                </Col>
                <Col>
                    <Button type="primary" onClick={handleAdd}>Add Newsfeed</Button>
                </Col>
            </Row>

            <Row gutter={16}>
                {filteredNewsfeeds.map(newsfeed => (
                    <Col span={8} key={newsfeed.id}>
                        <Card
                            title={`Newsfeed ${newsfeed.id}`}
                            extra={<Button type="link" onClick={() => handleEdit(newsfeed)}>Edit</Button>}
                            actions={[
                                <Button type="link" onClick={() => handleDelete(newsfeed.id)}>Delete</Button>,
                                newsfeed.pollId && (
                                    <Button type="link" onClick={() => fetchPollDetails(newsfeed.pollId, newsfeed)}>
                                        View Poll
                                    </Button>
                                )
                            ]}
                        >
                            <p>{newsfeed.content}</p>
                            <p><strong>Start:</strong> {moment(newsfeed.startedAt).format('YYYY-MM-DD')}</p>
                            <p><strong>End:</strong> {moment(newsfeed.endedAt).format('YYYY-MM-DD')}</p>
                            <p><strong>Reacts:</strong> {newsfeed.reactIds?.length || 0}</p>
                            {newsfeed.mediaUrls?.map((url, i) => (
                                <img key={i} src={url} alt={`media-${i}`} style={{ width: '100%', marginBottom: 10 }} />
                            ))}
                        </Card>
                    </Col>
                ))}
            </Row>

            {/* ADD modal */}
            {isAddMode && (
                <AddNewsfeedModal
                    open={isModalVisible}
                    onCancel={() => {
                        setIsModalVisible(false);
                        setIsAddMode(false);
                    }}
                    onSuccess={() => {
                        setIsModalVisible(false);
                        setIsAddMode(false);
                        fetchNewsfeeds();
                    }}
                />
            )}

            {/* EDIT modal */}
            {!isAddMode && (
                <Modal
                    title="Edit Newsfeed"
                    open={isModalVisible}
                    onCancel={() => {
                        setIsModalVisible(false);
                        setEditNewsfeed(null);
                    }}
                    footer={null}
                    destroyOnClose
                    width={600}
                >
                    <Form initialValues={formInitialValues} onFinish={handleSave} layout="vertical">
                        <Form.Item name="content" label="Content" rules={[{ required: true }]}>
                            <Input.TextArea rows={4} />
                        </Form.Item>
                        <Form.Item name="startedAt" label="Start Date" rules={[{ required: true }]}>
                            <DatePicker showTime style={{ width: '100%' }} />
                        </Form.Item>
                        <Form.Item name="endedAt" label="End Date" rules={[{ required: true }]}>
                            <DatePicker showTime style={{ width: '100%' }} />
                        </Form.Item>
                        <Form.Item label="Media">
                            <Upload
                                fileList={fileList}
                                onChange={({ fileList }) => setFileList(fileList)}
                                beforeUpload={() => false}
                                multiple
                                listType="picture"
                            >
                                <Button icon={<UploadOutlined />}>Upload</Button>
                            </Upload>
                        </Form.Item>
                        <Form.Item>
                            <Button type="primary" htmlType="submit">Update</Button>
                        </Form.Item>
                    </Form>
                </Modal>
            )}

            {/* Poll Details Modal */}
            {selectedNewsfeed?.pollDetails && (
                <Modal
                    title={`Poll for Newsfeed #${selectedNewsfeed.id}`}
                    open={true}
                    onCancel={() => setSelectedNewsfeed(null)}
                    footer={null}
                    width={700}
                >
                    <h3>{selectedNewsfeed.pollDetails.question}</h3>
                    {selectedNewsfeed.pollDetails.pollOptions.map((option, index) => (
                        <div key={option.id} style={{ marginBottom: '16px' }}>
                            <strong>{index + 1}. {option.type}</strong>
                            <List
                                dataSource={option.votes || []}
                                renderItem={(vote) => (
                                    <List.Item>
                                        <div style={{ display: 'flex', alignItems: 'center' }}>
                                            <img
                                                src={vote.avatarUrl}
                                                alt="avatar"
                                                style={{
                                                    width: 40,
                                                    height: 40,
                                                    borderRadius: '50%',
                                                    objectFit: 'cover',
                                                    marginRight: 12
                                                }}
                                            />
                                            <div>
                                                <div><strong>{vote.fullName || `User ${vote.userId}`}</strong></div>
                                                <div style={{ fontSize: 12, color: '#888' }}>User ID: {vote.userId}</div>
                                            </div>
                                        </div>
                                    </List.Item>
                                )}
                                locale={{ emptyText: "No votes for this option" }}
                            />
                        </div>
                    ))}
                </Modal>
            )}
        </div>
    );
};

export default SponsorNewsfeedPage;
