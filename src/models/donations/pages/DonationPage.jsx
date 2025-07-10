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
  const [event, setEvent] = useState(null); // 'add' hoặc 'update'
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

  // Hàm này chuẩn hóa dữ liệu từ Upload component của Ant Design
  const normFile = (e) => {
    if (Array.isArray(e)) {
      return e;
    }
    return e?.fileList || [];
  };

  const onFinish = async (values) => {
    const formData = new FormData(); // Tạo đối tượng FormData duy nhất ở đây

    // Thêm các trường dữ liệu text vào FormData
    formData.append("title", values.title);
    formData.append("name", values.name);
    formData.append("description", values.description);

    // Định dạng và thêm ngày tháng vào FormData
    const startDate = format(new Date(values.startDate), "yyyy-MM-dd HH:mm:ss");
    const endDate = format(new Date(values.endDate), "yyyy-MM-dd HH:mm:ss");
    formData.append("startDate", startDate);
    formData.append("endDate", endDate);

    // Xử lý và thêm hình ảnh vào FormData
    // Đảm bảo là mảng, và chỉ thêm các file mới (có originFileObj)
    const coverImages = Array.isArray(values.coverImages) ? values.coverImages : (values.coverImages ? [values.coverImages] : []);
    coverImages.forEach((file) => {
      if (file.originFileObj) { // Chỉ thêm file mới được chọn
        formData.append("coverImages", file.originFileObj);
      }
    });

    const sponsorImages = Array.isArray(values.sponsorImages) ? values.sponsorImages : (values.sponsorImages ? [values.sponsorImages] : []);
    sponsorImages.forEach((file) => {
      if (file.originFileObj) { // Chỉ thêm file mới được chọn
        formData.append("sponsorImages", file.originFileObj);
      }
    });

    setLoading(true);

    try {
      let success = false;
      if (event === "add") {
        // Khi thêm mới, sponsorId cần được truyền vào hoặc là một phần của FormData
        // Vì API của bạn trong DonationService.js không còn nhận sponsorId riêng lẻ,
        // bạn cần thêm nó vào formData ở đây.
        formData.append("sponsorId", sponsorId);
        const responseData = await createDonation(formData); // Chỉ truyền FormData
        success = !!responseData; // Kiểm tra nếu có dữ liệu trả về là thành công
      } else { // event === "update"
        // Khi cập nhật, ID của donation cần được truyền vào cho hàm updateDonation.
        // API update của bạn cũng nhận formData, nên ID (selectId) có thể cần được thêm vào formData
        // nếu backend của bạn mong đợi nó ở đó, hoặc API của bạn có thể sử dụng nó qua URL.
        // Giả sử backend của bạn mong đợi ID trong FormData cho việc cập nhật:
        formData.append("id", selectId);
        // Nếu bạn muốn cập nhật totalDonations, hãy đảm bảo giá trị này có trong `values`
        // và thêm nó vào formData
        // if (values.totalDonations !== undefined) {
        //   formData.append("totalDonations", values.totalDonations);
        // }
        const responseData = await updateDonation(selectId, formData); // Truyền ID và FormData
        success = !!responseData;
      }

      if (success) {
        message.success(event === "add" ? "Added successfully" : "Updated successfully");
        setModalOpen(false);
        form.resetFields();
        callGetDonations();
      } else {
        message.error("Action failed: No successful response from server.");
      }
    } catch (error) {
      console.error("Error creating/updating donation:", error);
      // Hiển thị thông báo lỗi chi tiết hơn từ server nếu có
      message.error("Upload failed: " + (error.response?.data?.message || error.message || "Unknown error"));
    } finally {
      setLoading(false);
    }
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
          style={{ backgroundColor: "#8DD3BB", width: 150, marginLeft: 10 }}
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
            // Nếu coverImageUrl là một chuỗi, hãy bọc nó trong một mảng
            (Array.isArray(images) ? images : [images]).map((url, idx) => (
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
                    // KHI CHỈNH SỬA:
                    // Ant Design Upload component mong đợi `fileList` là một mảng các đối tượng { uid, name, status, url, ... }
                    // Bạn cần ánh xạ các URL hình ảnh hiện có thành định dạng này để chúng hiển thị trong Dragger.
                    // Nếu bạn đặt [] như hiện tại, Dragger sẽ trống rỗng và người dùng phải tải lại ảnh.
                    // Đây là cách bạn có thể hiển thị ảnh hiện có:
                    sponsorImages: record.sponsorImages ? record.sponsorImages.map((url, index) => ({
                      uid: `sponsor-${index}`, // Cần một uid duy nhất
                      name: url.substring(url.lastIndexOf('/') + 1), // Tên file từ URL
                      status: 'done',
                      url: url,
                    })) : [],
                    coverImages: record.coverImageUrl ? (Array.isArray(record.coverImageUrl) ? record.coverImageUrl : [record.coverImageUrl]).map((url, index) => ({
                      uid: `cover-${index}`,
                      name: url.substring(url.lastIndexOf('/') + 1),
                      status: 'done',
                      url: url,
                    })) : [],
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