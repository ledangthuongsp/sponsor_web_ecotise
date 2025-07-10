import React, { useEffect, useState } from 'react';
import { Table, Button, message, Modal, Form, Input, InputNumber, Tabs, Avatar, Row } from 'antd';
import PDFViewer from './PDFViewer';  // Import component PDFViewer
import { getAllSponsors, deleteSponsor, updateSponsor, getPendingSponsors, confirmSponsor } from '../../services/sponsor/SponsorService';
const { TabPane } = Tabs;

const SponsorPage = () => {
  const [allSponsors, setAllSponsors] = useState([]);  // Đã duyệt sponsors
  const [pendingSponsors, setPendingSponsors] = useState([]);  // Pending sponsors
  const [loading, setLoading] = useState(true);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [currentSponsor, setCurrentSponsor] = useState(null);
  const [currentType, setCurrentType] = useState(null); // 'approved' | 'pending'
  const [form] = Form.useForm();

  const fetchSponsors = async () => {
    try {
      setLoading(true);
      const approvedData = await getAllSponsors();
      setAllSponsors(approvedData);
      const pendingData = await getPendingSponsors();
      setPendingSponsors(pendingData);
    } catch (error) {
      message.error('Failed to fetch sponsors');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSponsors();
  }, []);

  const handleDelete = async (id) => {
    try {
      await deleteSponsor(id);
      message.success('Sponsor deleted successfully');
      fetchSponsors();
    } catch (error) {
      message.error('Failed to delete sponsor');
    }
  };

  const handleConfirm = async (id) => {
    try {
      await confirmSponsor(id); // Gọi API xác nhận sponsor
      message.success('Sponsor confirmed successfully');
      fetchSponsors();  // Cập nhật lại list
    } catch (error) {
      message.error('Failed to confirm sponsor');
    }
  };

  const showModal = (sponsor, type) => {
    setCurrentSponsor(sponsor);
    setCurrentType(type);
    form.setFieldsValue(sponsor);
    setIsModalVisible(true);
  };

  const handleOk = async () => {
    try {
      const values = form.getFieldsValue();
      await updateSponsor(currentSponsor.id, values);
      message.success('Sponsor updated successfully');
      setIsModalVisible(false);
      fetchSponsors();
    } catch (error) {
      message.error('Failed to update sponsor');
    }
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  // Cột cho sponsor đã duyệt
  const approvedColumns = [
    {
      title: 'Avatar',
      dataIndex: 'avatarUrl',
      key: 'avatarUrl',
      render: (avatarUrl) => <Avatar src={avatarUrl} size={64} />
    },
    { title: 'Company Name', dataIndex: 'companyName', key: 'companyName' },
    { title: 'Contact Name', dataIndex: 'companyDirectorName', key: 'companyDirectorName' },
    { title: 'Email', dataIndex: 'companyEmailContact', key: 'companyEmailContact' },
    { title: 'Phone', dataIndex: 'companyPhoneNumberContact', key: 'companyPhoneNumberContact' },
    { title: 'Status', dataIndex: 'status', key: 'status' },
  {
    title: 'Actions',
    key: 'actions',
    render: (text, record) => (
      <div style={{ display: 'flex', justifyContent: 'flex-start', gap: '8px' }}>
        <Button type="primary" onClick={() => showModal(record, 'approved')}>View</Button>
        <Button type="danger" onClick={() => handleDelete(record.id)}>
          Delete
        </Button>
      </div>
    ),
  },

  ];

  // Cột cho sponsor pending
  const pendingColumns = [
    { title: 'Company Name', dataIndex: 'companyName', key: 'companyName' },
    { title: 'Contact Name', dataIndex: 'contactName', key: 'contactName' },
    { title: 'Email', dataIndex: 'email', key: 'email' },
    { title: 'Phone', dataIndex: 'contactPhone', key: 'contactPhone' },
    { title: 'Status', dataIndex: 'status', key: 'status' },
    {
      title: 'Actions',
      key: 'actions',
      render: (text, record) => (
        <div style={{ display: 'flex', justifyContent: 'flex-start', gap: '8px' }}>
          <Button type="primary" onClick={() => showModal(record, 'pending')}>View</Button>
          <Button type="primary" onClick={() => handleConfirm(record.id)}>
            Confirm
          </Button>
        </div>
      ),
    },

  ];

  // Hàm kiểm tra phần mở rộng của file
  const getFileExtension = (url) => {
    return url.split('.').pop().toLowerCase();
  };

  // Hiển thị PDF hoặc DOC/DOCX
  const renderContract = (url) => {
    const extension = getFileExtension(url);

    if (extension === 'pdf') {
      return <PDFViewer url={url} />;
    } else if (extension === 'doc' || extension === 'docx') {
      // Sử dụng Google Docs Viewer để hiển thị file DOC hoặc DOCX
      const googleDocsViewerUrl = `https://docs.google.com/gview?url=${encodeURIComponent(url)}&embedded=true`;
      return (
        <iframe
          src={googleDocsViewerUrl}
          width="100%"
          height="500px"
          title="Document Viewer"
        />
      );
    } else {
      return <p>Unsupported file type</p>;
    }
  };

  return (
    <div>
      <h2>Sponsor Management</h2>
      <Tabs defaultActiveKey="1">
        <TabPane tab="Pending Sponsors" key="1">
          <Table
            columns={pendingColumns}
            dataSource={pendingSponsors}
            rowKey={record => record.id || record.email}
            loading={loading}
            pagination={{ pageSize: 10 }}
          />
        </TabPane>
        <TabPane tab="All Sponsors" key="2">
          <Table
            columns={approvedColumns}
            dataSource={allSponsors}
            rowKey="id"
            loading={loading}
            pagination={{ pageSize: 10 }}
          />
        </TabPane>
      </Tabs>

      <Modal
        title="View Sponsor"
        visible={isModalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
        width={1000}
        closable
        footer={null} // Loại bỏ các nút mặc định như OK và Cancel
      >
        <Tabs defaultActiveKey="1">
          {/* Tab thông tin */}
          <TabPane tab="Information" key="1">
            <Form form={form} layout="vertical" name="sponsorForm">
              {/* Hiển thị thông tin đầy đủ cho sponsor */}
              {currentType === 'approved' && (
                <>
                  <Form.Item name="companyName" label="Company Name">
                    <Input disabled />
                  </Form.Item>
                  <Form.Item name="companyPhoneNumberContact" label="Phone">
                    <Input disabled />
                  </Form.Item>
                  <Form.Item name="companyEmailContact" label="Email">
                    <Input disabled />
                  </Form.Item>
                  <Form.Item name="companyAddress" label="Company Address">
                    <Input disabled />
                  </Form.Item>
                  <Form.Item name="businessDescription" label="Business Description">
                    <Input.TextArea disabled />
                  </Form.Item>
                  <Form.Item name="companyDirectorName" label="Director Name">
                    <Input disabled />
                  </Form.Item>
                  <Form.Item name="companyTaxNumber" label="Tax Number">
                    <Input disabled />
                  </Form.Item>
                  <Form.Item name="companyPoints" label="Points">
                    <InputNumber disabled min={0} style={{ width: '100%' }} />
                  </Form.Item>
                  <Form.Item name="additionalFileUrl" label="Contract URL">
                    <Input disabled />
                  </Form.Item>
                  <Form.Item name="status" label="Status">
                    <Input disabled />
                  </Form.Item>
                </>
              )}
              {currentType === 'pending' && (
                <>
                  <Form.Item name="companyName" label="Company Name">
                    <Input disabled />
                  </Form.Item>
                  <Form.Item name="natureOfBusiness" label="Nature of Business">
                    <Input disabled />
                  </Form.Item>
                  <Form.Item name="address" label="Company Address">
                    <Input disabled />
                  </Form.Item>
                  <Form.Item name="contactName" label="Contact Name">
                    <Input disabled />
                  </Form.Item>
                  <Form.Item name="contactPhone" label="Contact Phone">
                    <Input disabled />
                  </Form.Item>
                  <Form.Item name="email" label="Email">
                    <Input disabled />
                  </Form.Item>
                  <Form.Item name="taxNumber" label="Tax Number">
                    <Input disabled />
                  </Form.Item>
                  <Form.Item name="idea" label="Idea">
                    <Input.TextArea disabled />
                  </Form.Item>
                  <Form.Item name="additionalFileUrl" label="Contract URL">
                    <Input disabled />
                  </Form.Item>
                  <Form.Item name="status" label="Status">
                    <Input disabled />
                  </Form.Item>
                </>
              )}
            </Form>
          </TabPane>

          {/* Tab hợp đồng */}
          <TabPane tab="Contract" key="2">
            {currentSponsor?.additionalFileUrl ? (
              renderContract(currentSponsor?.additionalFileUrl)
            ) : (
              <p>No contract available</p>
            )}
          </TabPane>
        </Tabs>
      </Modal>
    </div>
  );
};

export default SponsorPage;
