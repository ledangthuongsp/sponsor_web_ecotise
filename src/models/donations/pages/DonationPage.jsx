import React, { useEffect, useState } from "react";
import {
  Button,
  Flex,
  Space,
  Table,
  Typography,
  Input,
  Modal,
  message,
  Upload,
  Form,
  DatePicker,
} from "antd";
import moment from "moment";
import { UploadOutlined } from "@ant-design/icons";
import {
  createDonation,
  deleteDonation,
  getDonationsBySponsorId,
  updateDonation,
} from "../../../services/DonationService";
import { format } from "date-fns";
import "./DonationPage.css";

const { Column } = Table;
const { Search } = Input;
const { Dragger } = Upload;

const DonationPage = () => {
  const [donations, setDonations] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isModalDelete, setIsModalDelete] = useState(false);
  const [selectId, setSelectId] = useState(null);
  const [event, setEvent] = useState(null);
  const [form] = Form.useForm();

  // Get sponsorId from localStorage
  const sponsorId = localStorage.getItem("sponsorId");

  const callGetDonations = async () => {
    if (sponsorId) {
      try {
        const data = await getDonationsBySponsorId(sponsorId);
        setDonations(data);
      } catch (e) {
        message.error("Failed to load donations");
      }
    } else {
      message.error("Sponsor ID is not available");
    }
  };

  useEffect(() => {
    if (sponsorId) {
      callGetDonations();
    } else {
      message.error("Sponsor ID is missing");
    }
  }, [sponsorId]);

  const onSearch = (value) => {
    console.log("Search:", value);
  };

  const normFile = (e) => (Array.isArray(e) ? e : e?.fileList || []);

  const onFinish = async (values) => {
    const formData = new FormData();
    values.coverImages.forEach((file) =>
      formData.append("coverImage", file.originFileObj)
    );
    values.sponsorImages.forEach((file) =>
      formData.append("sponsorImages", file.originFileObj)
    );

    const startDate = format(new Date(values.startDate), "yyyy-MM-dd HH:mm:ss");
    const endDate = format(new Date(values.endDate), "yyyy-MM-dd HH:mm:ss");

    setLoading(true);

    const success =
      event === "add"
        ? await createDonation(
            sponsorId, // Pass sponsorId when creating a donation
            values.title,
            values.name,
            values.description,
            startDate,
            endDate,
            formData
          )
        : await updateDonation(
            selectId,
            values.title,
            values.name,
            values.description,
            startDate,
            endDate,
            formData
          );

    if (success) {
      message.success(event === "add" ? "Added successfully" : "Updated successfully");
      setModalOpen(false);
      form.resetFields();
      callGetDonations();
    } else {
      message.error("Action failed");
    }

    setLoading(false);
  };

  const handleOkDelete = async () => {
    const success = await deleteDonation(selectId);
    if (success) {
      message.success("Deleted successfully");
      callGetDonations();
    } else {
      message.error("Delete failed");
    }
    setIsModalDelete(false);
  };

  return (
    <Flex vertical gap="large">
      <Typography.Title level={2}>Donations Management</Typography.Title>
      <Flex justify="space-between">
        <Search placeholder="Search donations" onSearch={onSearch} enterButton />
        <Button
          type="primary"
          style={{ backgroundColor: "#8DD3BB", width: 150 , marginLeft: 10}}
          onClick={() => {
            form.resetFields();
            setEvent("add");
            setModalOpen(true);
          }}
        >
          Add Donation
        </Button>
      </Flex>

      <Table dataSource={donations} rowKey="id">
        <Column title="ID" dataIndex="id" />
        <Column title="Title" dataIndex="title" />
        <Column title="Name" dataIndex="name" />
        <Column title="Sponsor" dataIndex="sponsorName" />
        <Column title="Total Points" dataIndex="totalDonations" />
        <Column
          title="Start Date"
          dataIndex="startDate"
          render={(text) => moment(text).format("YYYY-MM-DD")}
        />
        <Column
          title="End Date"
          dataIndex="endDate"
          render={(text) => moment(text).format("YYYY-MM-DD")}
        />
        <Column
          title="Sponsor Images"
          dataIndex="sponsorImages"
          render={(images) =>
            images.map((url, idx) => (
              <img key={idx} src={url} alt="" style={{ width: 200, marginRight: 5 }} />
            ))
          }
        />
        <Column
          title="Cover Images"
          dataIndex="coverImageUrl"
          render={(images) =>
            images.map((url, idx) => (
              <img key={idx} src={url} alt="" style={{ width: 200 }} />
            ))
          }
        />
        <Column
          title="Action"
          render={(_, record) => (
            <Space>
              <Button
                type="primary"
                onClick={() => {
                  setSelectId(record.id);
                  setModalOpen(true);
                  setEvent("update");
                  form.setFieldsValue({
                    title: record.title,
                    name: record.name,
                    description: record.description,
                    startDate: moment(record.startDate),
                    endDate: moment(record.endDate),
                    sponsorImages: [],
                    coverImages: [],
                  });
                }}
              >
                Edit
              </Button>
              <Button danger onClick={() => {
                setSelectId(record.id);
                setIsModalDelete(true);
              }}>
                Delete
              </Button>
            </Space>
          )}
        />
      </Table>

      {/* DELETE MODAL */}
      <Modal
        open={isModalDelete}
        title="Confirm Delete"
        onOk={handleOkDelete}
        onCancel={() => setIsModalDelete(false)}
      >
        <p>Are you sure you want to delete this donation?</p>
      </Modal>

      {/* CREATE/UPDATE MODAL */}
      <Modal
        centered
        open={modalOpen}
        onCancel={() => setModalOpen(false)}
        footer={null}
        destroyOnClose
      >
        <Typography.Title level={4} style={{ textAlign: "center" }}>
          {event === "add" ? "Add Donation" : "Edit Donation"}
        </Typography.Title>
        <Form layout="vertical" form={form} onFinish={onFinish}>
          <Form.Item
            label="Title"
            name="title"
            rules={[{ required: true, message: "Please enter title" }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="Name"
            name="name"
            rules={[{ required: true, message: "Please enter name" }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="Description"
            name="description"
            rules={[{ required: true, message: "Please enter description" }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="Start Date"
            name="startDate"
            rules={[{ required: true, message: "Please select start date" }]}
          >
            <DatePicker showTime />
          </Form.Item>

          <Form.Item
            label="End Date"
            name="endDate"
            rules={[{ required: true, message: "Please select end date" }]}
          >
            <DatePicker showTime />
          </Form.Item>

          <Form.Item
            label="Sponsor Images"
            name="sponsorImages"
            valuePropName="fileList"
            getValueFromEvent={normFile}
          >
            <Dragger multiple listType="picture">
              <p className="ant-upload-drag-icon">
                <UploadOutlined />
              </p>
              <p>Click or drag sponsor images here</p>
            </Dragger>
          </Form.Item>

          <Form.Item
            label="Cover Images"
            name="coverImages"
            valuePropName="fileList"
            getValueFromEvent={normFile}
          >
            <Dragger multiple listType="picture">
              <p className="ant-upload-drag-icon">
                <UploadOutlined />
              </p>
              <p>Click or drag cover images here</p>
            </Dragger>
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" loading={loading} block>
              {event === "add" ? "Add Donation" : "Update Donation"}
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </Flex>
  );
};

export default DonationPage;
