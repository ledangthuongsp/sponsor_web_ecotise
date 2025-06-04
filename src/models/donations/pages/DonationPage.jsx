import React, { useEffect, useState } from "react";
import {
  Button,
  Flex,
  Space,
  Table,
  Tag,
  Typography,
  Input,
  Modal,
  message,
  Upload,
  Divider,
  Form,
  DatePicker,
} from "antd";
import moment from "moment";
import { UploadOutlined } from "@ant-design/icons";
const { Column, ColumnGroup } = Table;
const { Search } = Input;
import "./DonationPage.css";
import {
  createDonation,
  deleteDonation,
  getAllDonations,
  updateDonation,
} from "../../../services/DonationService";
import { compareAsc, format } from "date-fns";

const { Dragger } = Upload;

const uploadProps = {
  name: "file",
  headers: {
    authorization: "authorization-text",
  },
  onChange(info) {
    if (info.file.status !== "uploading") {
      console.log(info.file, info.fileList);
    }
    if (info.file.status === "done") {
      message.success(`${info.file.name} file uploaded successfully`);
    } else if (info.file.status === "error") {
      message.error(`${info.file.name} file upload failed.`);
    }
  },
};

const DonationPage = () => {
  const onSearch = (value, _e, info) => console.log(info?.source, value);
  const [modalOpen, setModalOpen] = useState(false);
  const [donations, setDonations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isModalDelete, setIsModalDelete] = useState(false);
  const [selectId, setSelectId] = useState(null);
  const [event, setEvent] = useState(null);

  const [form] = Form.useForm();

  const onFinish = async (values) => {
    console.log("Form values:", values);
    const formData = new FormData();

    values.coverImages.forEach((file) => {
      formData.append("coverImage", file.originFileObj);
    });
    values.sponsorImages.forEach((file) => {
      formData.append("sponsorImages", file.originFileObj);
    });
    // formData.append("coverImage", values.coverImages);
    // formData.append("sponsorImages", values.sponsorImages);

    const startDate = new Date(values.startDate);
    const endDate = new Date(values.endDate);

    setLoading(true);

    const success =
      event === "add"
        ? await createDonation(
            values.title,
            values.name,
            values.description,
            format(startDate, "yyyy-MM-dd HH:mm:ss"),
            format(endDate, "yyyy-MM-dd HH:mm:ss"),
            formData
          )
        : await updateDonation(
            selectId,
            values.title,
            values.name,
            values.description,
            format(startDate, "yyyy-MM-dd HH:mm:ss"),
            format(endDate, "yyyy-MM-dd HH:mm:ss"),
            formData
          );

    if (success) {
      setModalOpen(false);
      form.resetFields();

      if (event === "add") {
        message.success("Added successfully!");
      } else {
        message.success("Updated successfully!");
      }

      callGetDoations();
    }

    setLoading(false);
  };

  const normFile = (e) => {
    console.log("Upload event:", e);
    if (Array.isArray(e)) {
      return e;
    }
    return e && e.fileList;
  };

  const callGetDoations = async () => {
    setDonations(await getAllDonations());
  };

  useEffect(() => {
    callGetDoations();
  }, []);

  const handleOkDelete = async () => {
    const success = await deleteDonation(selectId);
    if (success) {
      message.success("Deleted successfully!");
      setSelectId(null);
      callGetMaterials();
    }

    setIsModalDelete(false);
  };

  const handleCancelDelete = () => {
    setIsModalDelete(false);
  };

  return (
    <Flex vertical gap="large">
      <Typography.Title level={2}>Donations Management</Typography.Title>
      <Flex justify="space-between">
        <Search
          placeholder="Search flights"
          onSearch={onSearch}
          enterButton
          className="search-input"
        />
        <Button
          type="primary"
          style={{
            backgroundColor: "#8DD3BB",
            fontWeight: 500,
            width: "fit-content",
          }}
          onClick={() => {
            setModalOpen(true);
            setEvent("add");
            form.resetFields();
          }}
        >
          Add Donation
        </Button>
      </Flex>
      <Table dataSource={donations}>
        <Column title="ID" dataIndex="id" key="id" />
        <Column title="Title" dataIndex="title" key="title" />
        <Column title="Name" dataIndex="name" key="name" />
        <Column title="Description" dataIndex="description" key="description" />
        <Column
          title="Sponsor Images"
          dataIndex="sponsorImages"
          key="sponsorImages"
          render={(text, record) => (
            <div>
              {record.sponsorImages.map((imageUrl, index) => (
                <img
                  src={imageUrl}
                  alt={`Image ${index + 1}`}
                  style={{
                    maxWidth: "100px",
                    maxHeight: "100px",
                    marginRight: "5px",
                  }}
                />
              ))}
            </div>
          )}
        />
        <Column
          title="Cover Images"
          dataIndex="coverImages"
          key="coverImages"
          render={(text, record) => (
            <div>
              {record.coverImages.map((imageUrl, index) => (
                <img
                  src={imageUrl}
                  alt={`Image ${index + 1}`}
                  style={{
                    maxWidth: "100px",
                    maxHeight: "100px",
                    marginRight: "5px",
                  }}
                />
              ))}
            </div>
          )}
        />
        <Column
          title="Start Date"
          dataIndex="startDate"
          key="startDate"
          render={(text, record) => (
            <span>{moment(record.startDate).format("YYYY-MM-DD")}</span>
          )}
        />

        <Column
          title="End Date"
          dataIndex="endDate"
          key="endDate"
          render={(text, record) => (
            <span>{moment(record.endDate).format("YYYY-MM-DD")}</span>
          )}
        />

        <Column
          title="Total points"
          dataIndex="totalDonations"
          key="totalDonations"
        />

        {/* <Column
          title="Status"
          dataIndex="tags"
          key="tags"
          render={(tags) => (
            <>
              {tags.map((tag) => {
                let color;
                if (tag === "Active") {
                  color = "green";
                } else if (tag === "Cancelled") {
                  color = "red";
                }
                return (
                  <Tag color={color} key={tag}>
                    {tag.toUpperCase()}
                  </Tag>
                );
              })}
            </>
          )}
        /> */}
        <Column
          title="Action"
          key="action"
          render={(_, record) => (
            <Space size="middle">
              <Button
                type="primary"
                style={{ backgroundColor: "#8DD3BB" }}
                onClick={() => {
                  setSelectId(record.id);
                  setModalOpen(true);
                  setEvent("update");
                  form.setFieldsValue({
                    title: record.title,
                    name: record.name,
                    description: record.description,
                    startDate: null,
                    endDate: null,
                    sponsorImages: [],
                    coverImages: [],
                  });
                }}
              >
                Edit
              </Button>
              <Button
                danger
                onClick={() => {
                  setIsModalDelete(true);
                  setSelectId(record.id);
                }}
              >
                Delete
              </Button>
            </Space>
          )}
        />
      </Table>

      <Modal
        title="Confirm Delete"
        open={isModalDelete}
        onOk={handleOkDelete}
        onCancel={handleCancelDelete}
        centered
      >
        <p>Are you sure you want to delete this donation?</p>
      </Modal>

      <Modal
        centered
        open={modalOpen}
        onCancel={() => setModalOpen(false)}
        footer={null}
      >
        <Flex vertical align="center">
          <div className="form-container">
            <Typography.Title level={4}>
              {event === "add" ? "Add Donation" : "Edit Donation"}
            </Typography.Title>
            <Form form={form} layout="vertical" onFinish={onFinish}>
              <Form.Item
                label="Title"
                name="title"
                rules={[
                  {
                    required: true,
                    message: "Please enter title!",
                  },
                ]}
              >
                <Input />
              </Form.Item>

              <Form.Item
                label="Name"
                name="name"
                rules={[
                  {
                    required: true,
                    message: "Please enter title!",
                  },
                ]}
              >
                <Input />
              </Form.Item>

              <Form.Item
                label="Description"
                name="description"
                rules={[
                  {
                    required: true,

                    message: "Please enter description!",
                  },
                ]}
              >
                <Input />
              </Form.Item>

              <Form.Item
                label="Start date"
                name="startDate"
                rules={[
                  {
                    required: true,
                    message: "Plase select start date!",
                  },
                ]}
              >
                <DatePicker />
              </Form.Item>

              <Form.Item
                label="End date"
                name="endDate"
                rules={[
                  {
                    required: true,
                    message: "Plase select end date!",
                  },
                ]}
              >
                <DatePicker />
              </Form.Item>

              <Form.Item
                label="Sponsor images"
                name="sponsorImages"
                valuePropName="fileList"
                getValueFromEvent={normFile}
                extra="Chọn hoặc kéo thả file vào đây"
              >
                <Dragger
                  name="sponsorImages"
                  multiple={true}
                  action="/upload.do"
                  listType="picture"
                >
                  <p className="ant-upload-drag-icon">
                    <UploadOutlined />
                  </p>
                  <p className="ant-upload-text">
                    Nhấp hoặc kéo tệp vào khu vực này để tải lên
                  </p>
                </Dragger>
              </Form.Item>

              <Form.Item
                label="Cover images"
                name="coverImages"
                valuePropName="fileList"
                getValueFromEvent={normFile}
                extra="Chọn hoặc kéo thả file vào đây"
              >
                <Dragger
                  name="coverImages"
                  multiple={true}
                  action="/upload.do"
                  listType="picture"
                >
                  <p className="ant-upload-drag-icon">
                    <UploadOutlined />
                  </p>
                  <p className="ant-upload-text">
                    Nhấp hoặc kéo tệp vào khu vực này để tải lên
                  </p>
                </Dragger>
              </Form.Item>
              <Form.Item>
                <Button type="primary" htmlType="submit" loading={loading}>
                  {event === "add" ? "Add" : "Update"}
                </Button>
              </Form.Item>
            </Form>
          </div>
        </Flex>
      </Modal>
    </Flex>
  );
};

export default DonationPage;
