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
  Select,
} from "antd";
import { UploadOutlined } from "@ant-design/icons";
const { Column, ColumnGroup } = Table;
const { Search } = Input;
import "./AchivementLevelPage.css";

import {
  addNewAchivementLevel,
  deleteAchievementLevel,
  getAllAchivementLevel,
  updateAchivementLevel,
} from "../../services/AchivementLevelService";
import { getAllAchivement } from "../../services/AchivementService";
const { Dragger } = Upload;

const AchivementLevelPage = () => {
  const onSearch = (value, _e, info) => console.log(info?.source, value);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalOpenEdit, setModalOpenEdit] = useState(false);

  const [selectId, setSelectId] = useState(null);

  const [form] = Form.useForm();

  const [loading, setLoading] = useState(false);

  const onFinish = async (values) => {
    console.log("Form values:", values);

    const formData = new FormData();

    formData.append("imgUrl", values.imgUrl[0].originFileObj);

    formData.append("iconUrl", values.iconUrl[0].originFileObj);

    setLoading(true);

    const success =
      event == "add"
        ? await addNewAchivementLevel(
            values.name,
            values.description,
            values.maxIndex,
            values.achievementType,
            formData
          )
        : await updateAchivementLevel(
            selectId,
            values.name,
            values.description,
            values.maxIndex,
            values.achievementType,
            formData
          );

    // const success =
    //   event === "add"
    //     ? await createMaterial(values.name, pointsPerKg, co2SavedPerKg)
    //     : await updateMaterial(
    //         selectId,
    //         values.name,
    //         pointsPerKg,
    //         co2SavedPerKg
    //       );

    if (success) {
      setModalOpen(false);
      form.setFieldsValue({
        name: "",
        description: "",
        achievementType: "",
        maxIndex: 0,
        imgUrl: null,
        iconUrl: null,
      });

      if (event === "add") {
        message.success("Thêm thành công!");
      } else {
        message.success("Cập nhật thành công!");
      }

      callGetAchivementLevels();
      callGetAchivement();
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

  const [isModalDelete, setIsModalDelete] = useState(false);
  const [event, setEvent] = useState(null);
  const [achivementLevels, setAchivementLevels] = useState([]);
  const [achivements, setAchivements] = useState([]);

  const callGetAchivementLevels = async () => {
    setAchivementLevels(await getAllAchivementLevel());
  };

  const callGetAchivement = async () => {
    setAchivements(await getAllAchivement());
  };

  const handleOkDelete = async () => {
    const success = await deleteAchievementLevel(selectId);
    if (success) {
      message.success("Deleted successfully!");
      setSelectId(null);
      callGetAchivementLevels();
    }

    setIsModalDelete(false);
  };

  const handleCancelDelete = () => {
    setIsModalDelete(false);
  };

  useEffect(() => {
    callGetAchivementLevels();
    callGetAchivement();
  }, []);

  useEffect(() => {}, []);
  return (
    <Flex vertical gap="large">
      <Typography.Title level={2}>Achivement Level Management</Typography.Title>
      <Flex justify="space-between">
        <Search
          placeholder="Search locations"
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
            form.setFieldsValue({
              name: "",
              description: "",
              achievementType: "",
              maxIndex: 0,
              imgUrl: null,
              iconUrl: null,
            });
          }}
        >
          Add Material
        </Button>

        <Modal
          title="Xác nhận xóa"
          open={isModalDelete}
          onOk={handleOkDelete}
          onCancel={handleCancelDelete}
          centered
        >
          <p>Bạn có chắc chắn muốn xóa không?</p>
        </Modal>
        <Modal
          centered
          open={modalOpen}
          onCancel={() => setModalOpen(false)}
          footer={null}
        >
          <Flex vertical align="center">
            <div className="form-container">
              <h1 className="form-title">A new achivement level infromation</h1>
              <Form
                form={form}
                layout="vertical"
                onFinish={onFinish}
                initialValues={{
                  name: "",
                  description: "",
                  achievementType: "",
                  maxIndex: 0,
                  imgUrl: null,
                  iconUrl: null,
                }}
              >
                <Form.Item
                  label="Name of achivement title"
                  name="name"
                  rules={[
                    {
                      required: true,
                      message: "Plase select name!",
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
                      message: "Plase select description!",
                    },
                  ]}
                >
                  <Input />
                </Form.Item>

                <Form.Item
                  label="Select Achivement type"
                  name="achievementType"
                  rules={[
                    {
                      required: true,
                      message: "Please select an option!",
                    },
                  ]}
                >
                  <Select placeholder="Select an option">
                    {achivements.map((achivement) => (
                      <Option value={achivement.type}>{achivement.type}</Option>
                    ))}
                  </Select>
                </Form.Item>

                <Form.Item
                  label="Max index"
                  name="maxIndex"
                  rules={[
                    {
                      required: true,
                      message: "Plase select max index!",
                    },
                  ]}
                >
                  <Input type="number" />
                </Form.Item>

                <Form.Item
                  label="Image"
                  name="imgUrl"
                  valuePropName="fileList"
                  getValueFromEvent={normFile}
                  extra="Chọn hoặc kéo thả file vào đây"
                >
                  <Dragger
                    name="imgUrl"
                    multiple={false}
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
                  label="Icon"
                  name="iconUrl"
                  valuePropName="fileList"
                  getValueFromEvent={normFile}
                  extra="Chọn hoặc kéo thả file vào đây"
                >
                  <Dragger
                    name="iconUrl"
                    multiple={false}
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
                    {event === "add" ? "Thêm" : "Cập nhật"}
                  </Button>
                </Form.Item>
              </Form>
            </div>
          </Flex>
        </Modal>
      </Flex>
      <Table dataSource={achivementLevels}>
        <Column title="ID" dataIndex="id" key="id" />

        <Column title="Name" dataIndex="name" key="name" />
        <Column title="Description" dataIndex="description" key="description" />

        <Column
          title="Image"
          dataIndex="imgUrl"
          key="imgUrl"
          render={(text, record) => (
            <img
              src={record.imgUrl}
              alt="Image"
              style={{ maxWidth: "100px", maxHeight: "100px" }}
            />
          )}
        />

        <Column
          title="Icon"
          dataIndex="iconUrl"
          key="iconUrl"
          render={(text, record) => (
            <img
              src={record.iconUrl}
              alt="Icon"
              style={{ maxWidth: "100px", maxHeight: "100px" }}
            />
          )}
        />

        <Column title="Max index" dataIndex="maxIndex" key="maxIndex" />

        <Column
          title="Type"
          dataIndex="achivement"
          key="achievement"
          render={(text, record) => (
            <Tag color="green">{record.achivement.type}</Tag>
          )}
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
                  setEvent("update");
                  form.setFieldsValue({
                    name: record.name,
                    description: record.description,
                    achievementType: record.achivement.type,
                    maxIndex: record.maxIndex,
                    imgUrl: null,
                    iconUrl: null,
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
    </Flex>
  );
};
export default AchivementLevelPage;
