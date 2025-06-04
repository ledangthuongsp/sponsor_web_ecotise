import React, { useEffect, useState } from "react";
import {
    Button,
    Space,
    Table,
    Typography,
    Input,
    message,
    Modal,
} from "antd";
import axios from "axios";
import dayjs from 'dayjs';
import "./DetectResponsePage.css";
import { BASE_API_URL } from "../../constants/APIConstants";
const { Column } = Table;
const { Search } = Input;

const DetectResponsePage = () => {
    const [detectResponses, setDetectResponses] = useState([]);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [currentImage, setCurrentImage] = useState("");

    const fetchDetectResponses = async () => {
        try {
            const response = await axios.get(`${BASE_API_URL}/detect-response/all`);
            setDetectResponses(response.data);
        } catch (error) {
            console.error("Failed to fetch detect responses:", error);
        }
    };

    useEffect(() => {
        fetchDetectResponses();
    }, []);

    const handleDownload = (url) => {
        fetch(url, {
            method: "GET",
            headers: {},
        })
            .then(response => {
                response.arrayBuffer().then(buffer => {
                    const url = window.URL.createObjectURL(new Blob([buffer]));
                    const link = document.createElement("a");
                    link.href = url;
                    link.setAttribute("download", "image.jpg"); // or any other extension
                    document.body.appendChild(link);
                    link.click();
                });
            })
            .catch(err => {
                console.error("Failed to download image:", err);
                message.error("Failed to download image.");
            });
    };

    const showModal = (imgUrl) => {
        setCurrentImage(imgUrl);
        setIsModalVisible(true);
    };

    const handleCancel = () => {
        setIsModalVisible(false);
    };

    return (
        <div style={{ padding: '20px' }}>
            <Typography.Title level={2}>Detect Responses Management</Typography.Title>
            <Space style={{ marginBottom: 16 }}>
                <Search
                    placeholder="Search responses"
                    onSearch={(value) => console.log(value)}
                    enterButton
                    className="search-input"
                />
            </Space>
            <Table dataSource={detectResponses} rowKey="id">
                <Column title="ID" dataIndex="id" key="id" />
                <Column
                    title="Image"
                    dataIndex="imgUrl"
                    key="imgUrl"
                    render={(text) => <img src={text} alt="Response" onClick={() => showModal(text)} />}
                />
                <Column title="Description" dataIndex="description" key="description" />
                <Column title="User ID" dataIndex="userId" key="userId" />
                <Column
                    title="Created At"
                    dataIndex="createdAt"
                    key="createdAt"
                    render={(text) => dayjs(text).format('DD/MM/YYYY HH:mm:ss')}
                />
                <Column
                    title="Action"
                    key="action"
                    render={(_, record) => (
                        <Space size="middle">
                            <Button type="primary" onClick={() => handleDownload(record.imgUrl)}>
                                Download
                            </Button>
                        </Space>
                    )}
                />
            </Table>

            <Modal
                visible={isModalVisible}
                footer={null}
                onCancel={handleCancel}
                centered
            >
                <img src={currentImage} alt="Full Size" style={{ width: '100%', height: '100%' }} />
            </Modal>
        </div>
    );
};

export default DetectResponsePage;
