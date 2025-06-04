import React, { useEffect, useState } from "react";
import {
  Button,
  Space,
  Table,
  Typography,
  Input,
  Modal,
  message,
  Form,
  DatePicker,
  Select,
  Upload,
  Avatar,
  Image,
  Popconfirm
} from "antd";
import axios from "axios";
import dayjs from 'dayjs';
import { UploadOutlined } from '@ant-design/icons';
import Icon from '../../assets/icons'
const { Column } = Table;
const { Search } = Input;
import { BASE_API_URL } from "../../constants/APIConstants";

const EmployeePage = () => {
  const [modalAddOpen, setModalAddOpen] = useState(false);
  const [modalEditOpen, setModalEditOpen] = useState(false);
  const [employees, setEmployees] = useState([]);
  const [locations, setLocations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentEmployee, setCurrentEmployee] = useState(null);
  const [usernameConfirm, setUsernameConfirm] = useState('');
  const [formAdd] = Form.useForm();
  const [formEdit] = Form.useForm();

  const fetchEmployees = async () => {
    try {
      const response = await axios.get(`${BASE_API_URL}/employee/get-all-employee`);
      setEmployees(Array.isArray(response.data) ? response.data : []);
    } catch (error) {
      console.error("Failed to fetch employees:", error);
    }
  };

  const fetchLocations = async () => {
    try {
      const response = await axios.get(`${BASE_API_URL}/location/get-all`);
      setLocations(Array.isArray(response.data) ? response.data : []);
    } catch (error) {
      console.error("Failed to fetch locations:", error);
    }
  };

  useEffect(() => {
    fetchEmployees();
    fetchLocations();
  }, []);

  const onSearch = async (value) => {
    try {
      const response = await axios.get(`${BASE_API_URL}/user/username?username=${value}`);
      setEmployees(Array.isArray(response.data) ? response.data : []);
    } catch (error) {
      message.error("Failed to find employee");
    }
  };

  const handleEdit = (record) => {
    setCurrentEmployee(record);
    formEdit.setFieldsValue({
      ...record,
      dayOfBirth: record.dayOfBirth ? dayjs(record.dayOfBirth) : null
    });
    setModalEditOpen(true);
  };

  const handleDelete = async (id, username) => {
    if (usernameConfirm !== username) {
      message.error("Username confirmation does not match.");
      return;
    }

    try {
      await axios.delete(`${BASE_API_URL}/user/delete-user-by-id?id=${id}&username=${username}`);
      message.success("Employee deleted successfully");
      fetchEmployees();
    } catch (error) {
      message.error("Failed to delete employee");
    }
  };

  const onFinishAdd = async (values) => {
    try {
      await axios.post(`${BASE_API_URL}/auth/signup?roles=EMPLOYEE&locationId=${values.locationId}`, {
        ...values,
      });
      message.success("Employee registered successfully");
      setModalAddOpen(false);
      fetchEmployees();
    } catch (error) {
      message.error("Failed to register employee");
    }
  };

  const onFinishEdit = async (values) => {
    try {
      // Update employee logic
      message.success("Employee updated successfully");
      setModalEditOpen(false);
      fetchEmployees();
    } catch (error) {
      message.error("Failed to update employee");
    }
  };

  const handleAvatarUpload = async (file) => {
    const formData = new FormData();
    formData.append('avatarFile', file);
    formData.append('employeeId', currentEmployee.id);

    try {
      const response = await axios.post(`${BASE_API_URL}/employee/upload-new-avatar`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      message.success("Avatar updated successfully");
      setCurrentEmployee({
        ...currentEmployee,
        avatarUrl: response.data
      });
      return response.data;
    } catch (error) {
      message.error("Failed to upload avatar");
      return null;
    }
  };

  return (
    <>
      <Typography.Title level={2}>Employee Management</Typography.Title>
      <Space style={{ marginBottom: 16 }}>
        <Search
          placeholder="Search employees"
          onSearch={onSearch}
          enterButton
        />
        <Button
          type="primary"
          style={{ backgroundColor: "#8DD3BB" }}
          onClick={() => {
            setCurrentEmployee(null);
            formAdd.resetFields();
            setModalAddOpen(true);
          }}
        >
          Add Employee
        </Button>
      </Space>
      <Table dataSource={employees} rowKey="id">
        <Column title="ID" dataIndex="id" key="id" />
        <Column title="Full Name" dataIndex="fullName" key="fullName" />
        <Column title="Email" dataIndex="email" key="email" />
        <Column title="Address" dataIndex="address" key="address" />
        <Column title="Phone Number" dataIndex="phoneNumber" key="phoneNumber" />
        <Column title="Personal ID" dataIndex="personalId" key="personalId" />
        <Column title="Date of Birth" dataIndex="dayOfBirth" key="dayOfBirth" />

        <Column
          title="Action"
          key="action"
          render={(_, record) => (
            <Space size="middle">
              <Button
                type="primary"
                style={{ backgroundColor: "#8DD3BB" }}
                onClick={() => handleEdit(record)}
              >
                Edit
              </Button>
              <Popconfirm
                title={() => (
                  <>
                    <p>Are you sure you want to delete this employee?</p>
                    <p>To confirm, type the username below:</p>
                    <Input
                      placeholder="Username"
                      value={usernameConfirm}
                      onChange={(e) => setUsernameConfirm(e.target.value)}
                    />
                  </>
                )}
                onConfirm={() => handleDelete(record.id, record.username)}
                okText="Yes"
                cancelText="No"
                okButtonProps={{ disabled: usernameConfirm !== record.username }}
              >
                <Button danger>Delete</Button>
              </Popconfirm>
            </Space>
          )}
        />
      </Table>

      <Modal
        centered
        open={modalAddOpen}
        onCancel={() => setModalAddOpen(false)}
        footer={null}
      >
        <Typography.Title level={4}>Add Employee</Typography.Title>
        <Form
          form={formAdd}
          layout="vertical"
          onFinish={onFinishAdd}
        >
          <Form.Item
            label="Username"
            name="username"
            rules={[
              {
                required: true,
                message: "Please enter username!",
              },
            ]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="Email"
            name="email"
            rules={[
              {
                required: true,
                message: "Please enter email!",
              },
            ]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="Password"
            name="password"
            rules={[
              {
                required: true,
                message: "Please enter password!",
              },
            ]}
          >
            <Input.Password />
          </Form.Item>

          <Form.Item
            label="Full Name"
            name="fullName"
            rules={[
              {
                required: true,
                message: "Please enter full name!",
              },
            ]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="Phone Number"
            name="phoneNumber"
            rules={[
              {
                required: true,
                message: "Please enter phone number!",
              },
            ]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="Address"
            name="address"
            rules={[
              {
                required: true,
                message: "Please enter address!",
              },
            ]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="Date of Birth"
            name="dayOfBirth"
            rules={[
              {
                required: true,
                message: "Please select date of birth!",
              },
            ]}
          >
            <DatePicker />
          </Form.Item>

          <Form.Item
            label="Location"
            name="locationId"
            rules={[
              {
                required: true,
                message: "Please select location!",
              },
            ]}
          >
            <Select>
              {locations.map(location => (
                <Select.Option key={location.id} value={location.id}>
                  {location.locationName}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" loading={loading}>
              Submit
            </Button>
          </Form.Item>
        </Form>
      </Modal>

      <Modal
        centered
        open={modalEditOpen}
        onCancel={() => setModalEditOpen(false)}
        footer={null}
      >
        <Typography.Title level={4}>Edit Employee</Typography.Title>
        {currentEmployee && (
          <div style={{ textAlign: 'center', marginBottom: '20px' }}>
            <Avatar
              size={100}
              src={<Image src={currentEmployee.avatarUrl || Icon.UserIcon} style={{ width: 100 }} />}
            />
            <Upload
              name="avatar"
              showUploadList={false}
              beforeUpload={file => {
                handleAvatarUpload(file);
                return false;
              }}
            >
              <Button icon={<UploadOutlined />}>Change Avatar</Button>
            </Upload>
          </div>
        )}
        <Form
          form={formEdit}
          layout="vertical"
          onFinish={onFinishEdit}
          initialValues={currentEmployee}
        >
          <Form.Item
            label="Username"
            name="username"
            rules={[
              {
                required: true,
                message: "Please enter username!",
              },
            ]}
          >
            <Input disabled />
          </Form.Item>

          <Form.Item
            label="Email"
            name="email"
            rules={[
              {
                required: true,
                message: "Please enter email!",
              },
            ]}
          >
            <Input disabled />
          </Form.Item>

          <Form.Item
            label="Full Name"
            name="fullName"
            rules={[
              {
                required: true,
                message: "Please enter full name!",
              },
            ]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="Phone Number"
            name="phoneNumber"
            rules={[
              {
                required: true,
                message: "Please enter phone number!",
              },
            ]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="Address"
            name="address"
            rules={[
              {
                required: true,
                message: "Please enter address!",
              },
            ]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="Personal ID"
            name="personalId"
            rules={[
              {
                required: true,
                message: "Please enter personal ID!",
              },
            ]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="Date of Birth"
            name="dayOfBirth"
            rules={[
              {
                required: true,
                message: "Please select date of birth!",
              },
            ]}
          >
            <DatePicker />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" loading={loading}>
              Submit
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

export default EmployeePage;
