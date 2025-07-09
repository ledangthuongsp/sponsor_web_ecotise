import {
  Modal,
  Form,
  Input,
  Upload,
  DatePicker,
  Button,
  message,
  InputNumber,
  Space
} from "antd";
import { PlusOutlined } from "@ant-design/icons";
import axios from "axios";
import dayjs from "dayjs";
import { useState } from "react";
import { BASE_API_URL } from "../../../constants/APIConstants";
import PropTypes from "prop-types";

const { RangePicker } = DatePicker;

const AddNewsfeedModal = ({ open, onCancel, onSuccess }) => {
  const [form] = Form.useForm();
  const [fileList, setFileList] = useState([]);
  const [pollOptions, setPollOptions] = useState([""]);
  const [uploading, setUploading] = useState(false);

  const sponsorUsername = localStorage.getItem("username");

  const fetchSponsorId = async () => {
    const res = await axios.get(`${BASE_API_URL}/sponsor/get-by-username?username=${sponsorUsername}`);
    return res.data.id;
  };

  const handleAddOption = () => {
    setPollOptions([...pollOptions, ""]);
  };

  const handleOptionChange = (value, index) => {
    const updated = [...pollOptions];
    updated[index] = value;
    setPollOptions(updated);
  };

  const handleRemoveOption = (index) => {
    const updated = [...pollOptions];
    updated.splice(index, 1);
    setPollOptions(updated);
  };

  const handleUpload = async () => {
    try {
      const values = await form.validateFields();
      setUploading(true);

      const sponsorId = await fetchSponsorId();

      const formData = new FormData();
      formData.append("content", values.content);
      formData.append("sponsorId", sponsorId);
      formData.append("pointForActivity", values.pointForActivity || 0);
        formData.append("startedAt", dayjs(values.dateRange[0]).format("YYYY-MM-DD HH:mm:ss"));
        formData.append("endedAt", dayjs(values.dateRange[1]).format("YYYY-MM-DD HH:mm:ss"));

      pollOptions.forEach((opt) => {
        if (opt.trim()) formData.append("pollOptions", opt);
      });

      fileList.forEach((file) => {
        formData.append("files", file.originFileObj);
      });

      await axios.post(`${BASE_API_URL}/newsfeed/create`, formData, {
        headers: {
          "Content-Type": "multipart/form-data"
        }
      });

      message.success("Tạo newsfeed thành công");
      onSuccess(); // reload lại list
      onCancel();  // đóng modal
      form.resetFields();
      setFileList([]);
      setPollOptions([""]);
    } catch (error) {
      console.error(error);
      message.error("Tạo newsfeed thất bại");
    } finally {
      setUploading(false);
    }
  };

  return (
    <Modal
      title="Tạo Newsfeed Mới"
      open={open}
      onCancel={onCancel}
      footer={null} // Custom footer để control vị trí nút
      destroyOnClose
    >
      <Form
        form={form}
        layout="vertical"
      >
        <Form.Item
          name="content"
          label="Nội dung"
          rules={[{ required: true, message: "Vui lòng nhập nội dung!" }]}
        >
          <Input.TextArea rows={4} placeholder="Nhập nội dung newsfeed" />
        </Form.Item>

        <Form.Item
          name="pointForActivity"
          label="Điểm cho hoạt động"
        >
          <InputNumber min={0} style={{ width: "100%" }} />
        </Form.Item>

        <Form.Item
          name="dateRange"
          label="Thời gian diễn ra"
          rules={[{ required: true, message: "Vui lòng chọn thời gian diễn ra!" }]}
        >
          <RangePicker
            showTime
            style={{ width: "100%" }}
            placeholder={["Start date", "End date"]}
          />
        </Form.Item>

        <Form.Item label="Tùy chọn bình chọn (Poll)">
          <Space direction="vertical" style={{ width: "100%" }}>
            {pollOptions.map((opt, idx) => (
              <Space key={idx} style={{ display: "flex" }}>
                <Input
                  value={opt}
                  onChange={(e) => handleOptionChange(e.target.value, idx)}
                  placeholder={`Lựa chọn ${idx + 1}`}
                />
                {pollOptions.length > 1 && (
                  <Button danger onClick={() => handleRemoveOption(idx)}>X</Button>
                )}
              </Space>
            ))}
            <Button type="dashed" onClick={handleAddOption} icon={<PlusOutlined />}>
              Thêm lựa chọn
            </Button>
          </Space>
        </Form.Item>

        <Form.Item label="Ảnh đính kèm">
          <Upload
            fileList={fileList}
            onChange={({ fileList }) => setFileList(fileList)}
            beforeUpload={() => false}
            listType="picture"
            multiple
          >
            <Button icon={<PlusOutlined />}>Chọn ảnh</Button>
          </Upload>
        </Form.Item>

        <Form.Item>
          <div style={{ display: "flex", justifyContent: "flex-end", gap: 8 }}>
            <Button onClick={onCancel}>Cancel</Button>
            <Button type="primary" loading={uploading} onClick={handleUpload}>
              Tạo mới
            </Button>
          </div>
        </Form.Item>
      </Form>
    </Modal>
  );
};
AddNewsfeedModal.propTypes = {
  open: PropTypes.bool.isRequired,
  onCancel: PropTypes.func.isRequired,
  onSuccess: PropTypes.func.isRequired
};

export default AddNewsfeedModal;

