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

} from "antd";
import { getAllMaterials, updateMaterial } from "../../../services/MaterialService";


const { Column } = Table;
const { Search } = Input;

const MaterialsPage = () => {
  const [modalOpen, setModalOpen] = useState(false);
  const [selectId, setSelectId] = useState(null);
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [materials, setMaterials] = useState([]);

  const callGetMaterials = async () => {
    setMaterials(await getAllMaterials());
  };

  useEffect(() => {
    callGetMaterials();
  }, []);

  const onSearch = (value, _e, info) => console.log(info?.source, value);

  const onFinish = async (values) => {
    console.log("Form values:", values);

    const pointsPerKg = parseFloat(values.pointsPerKg);
    const co2SavedPerKg = parseFloat(values.co2SavedPerKg);

    setLoading(true);

    const success = await updateMaterial(selectId, pointsPerKg, co2SavedPerKg);

    if (success) {
      setModalOpen(false);
      form.resetFields();
      message.success("Updated successfully!");
      callGetMaterials();
    }

    setLoading(false);
  };

  return (
    <div style={{ padding: "20px" }}>
      <Typography.Title level={2}>Materials Management</Typography.Title>
      <Space style={{ marginBottom: 16 }}>
        <Search
          placeholder="Search materials"
          onSearch={onSearch}
          enterButton
        />
      </Space>
      <Table dataSource={materials} rowKey="id">
        <Column title="ID" dataIndex="id" key="id" />
        <Column title="Name" dataIndex="name" key="name" />
        <Column
          title="Points per Kg"
          dataIndex="pointsPerKg"
          key="pointsPerKg"
        />
        <Column
          title="Saved Co2 per Kg"
          dataIndex="co2SavedPerKg"
          key="co2SavedPerKg"
        />

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
                  form.setFieldsValue({
                    name: record.name,
                    pointsPerKg: record.pointsPerKg,
                    co2SavedPerKg: record.co2SavedPerKg,
                    type: record.type,
                  });
                }}
              >
                Edit
              </Button>
            </Space>
          )}
        />
      </Table>

      <Modal
        centered
        open={modalOpen}
        onCancel={() => setModalOpen(false)}
        footer={null}
      >
        <Typography.Title level={4}>Edit Material</Typography.Title>
        <Form
          form={form}
          layout="vertical"
          onFinish={onFinish}
        >
          <Form.Item
            label="Name of material"
            name="name"
            rules={[
              {
                required: true,
                message: "Please enter the name!",
              },
            ]}
          >
            <Input disabled />
          </Form.Item>

          <Form.Item
            label="Points per Kg"
            name="pointsPerKg"
            rules={[
              {
                required: true,
                message: "Please enter Points per Kg!",
              },
            ]}
          >
            <Input type="number" />
          </Form.Item>

          <Form.Item
            label="Saved Co2 per Kg"
            name="co2SavedPerKg"
            rules={[
              {
                required: true,
                message: "Please enter Saved Co2 per Kg!",
              },
            ]}
          >
            <Input type="number" />
          </Form.Item>

          <Form.Item
            label="Type"
            name="type"
            rules={[
              {
                required: true,
                message: "Please select the type!",
              },
            ]}
          >
            <Input disabled />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" loading={loading}>
              Update
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default MaterialsPage;
