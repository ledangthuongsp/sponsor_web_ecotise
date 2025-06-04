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
  Select,
  Divider,
  Spin,
} from "antd";
import { UploadOutlined } from "@ant-design/icons";
import "./QuizManagementPage.css";

import {
  addNewQuizTopic,
  getAllQuizTopics,
  updateQuizTopic,
  deleteQuizTopic,
} from "../../services/QuizTopicService";
import {
  addNewQuizQuestion,
  getAllQuizQuestions,
  updateQuizQuestion,
  deleteQuizQuestion,
} from "../../services/QuizQuestionService";

const { Column } = Table;
const { Search } = Input;
const { Dragger } = Upload;
const { Option } = Select;

const QuizManagementPage = () => {
  const onSearch = (value) => console.log(value);
  const [modalOpen, setModalOpen] = useState(false);
  const [isModalDelete, setIsModalDelete] = useState(false);
  const [selectId, setSelectId] = useState(null);
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [quizTopics, setQuizTopics] = useState([]);
  const [quizQuestions, setQuizQuestions] = useState([]);
  const [selectedTopic, setSelectedTopic] = useState(null);
  const [event, setEvent] = useState(null);
  const [modalOpenQuestion, setModalOpenQuestion] = useState(false);

  const onFinish = async (values) => {
    setLoading(true);

    console.log(values);

    if (event === "addTopic" || event === "updateTopic") {
      const imgFile = values.imgUrl[0].originFileObj;

      console.log(imgFile);

      const success =
        event === "addTopic"
          ? await addNewQuizTopic(values.topicName, values.description, imgFile)
          : await updateQuizTopic(
              selectId,
              values.topicName,
              values.description,
              imgFile
            );

      if (success) {
        message.success(
          event === "addTopic"
            ? "Topic added successfully!"
            : "Topic updated successfully!"
        );
        setModalOpen(false);
        form.resetFields();
        callGetQuizTopics();
      }
    } else if (event === "addQuestion" || event === "updateQuestion") {
      const success =
        event === "addQuestion"
          ? await addNewQuizQuestion(
              values.topicId,
              values.questionText,
              values.correctAnswer,
              values.incorrectAnswer1,
              values.incorrectAnswer2
            )
          : await updateQuizQuestion(
              selectId,
              values.questionText,
              values.correctAnswer,
              values.incorrectAnswer1,
              values.incorrectAnswer2
            );

      if (success) {
        message.success(
          event === "addQuestion"
            ? "Question added successfully!"
            : "Question updated successfully!"
        );
        setModalOpenQuestion(false);
        form.resetFields();
        callGetQuizQuestions(selectedTopic);
        callGetQuizTopics();
      }
    }

    setLoading(false);
  };

  const normFile = (e) => {
    if (Array.isArray(e)) {
      return e;
    }
    return e && e.fileList;
  };

  const callGetQuizTopics = async () => {
    const topics = await getAllQuizTopics();
    setQuizTopics(topics);
  };

  const callGetQuizQuestions = async (topicId) => {
    if (topicId) {
      const questions = await getAllQuizQuestions(topicId);
      setQuizQuestions(questions);
    }
  };

  const handleOkDelete = async () => {
    setLoading(true);

    if (event === "deleteTopic") {
      const success = await deleteQuizTopic(selectId);
      if (success) {
        message.success("Topic deleted successfully!");
        callGetQuizTopics();
      }
    } else if (event === "deleteQuestion") {
      const success = await deleteQuizQuestion(selectId);
      if (success) {
        message.success("Question deleted successfully!");
        callGetQuizQuestions(selectedTopic);
      }
    }

    setLoading(false);
    setIsModalDelete(false);
    setSelectId(null);
  };

  const handleCancelDelete = () => {
    setIsModalDelete(false);
  };

  useEffect(() => {
    callGetQuizTopics();
  }, []);

  return (
    <Spin spinning={loading}>
      <Flex vertical gap="large">
        <Typography.Title level={2}>Quiz Management</Typography.Title>
        <Flex justify="space-between">
          <Search
            placeholder="Search topics"
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
              setEvent("addTopic");
              form.resetFields();
            }}
          >
            Add Topic
          </Button>

          <Modal
            title="Confirm Deletion"
            open={isModalDelete}
            onOk={handleOkDelete}
            onCancel={handleCancelDelete}
            centered
          >
            <p>Are you sure you want to delete?</p>
          </Modal>

          <Modal
            centered
            open={modalOpen}
            onCancel={() => setModalOpen(false)}
            footer={null}
          >
            <Flex vertical align="center">
              <div className="form-container">
                <h1 className="form-title">Quiz Topic Information</h1>
                <Form
                  form={form}
                  layout="vertical"
                  onFinish={onFinish}
                  initialValues={{
                    topicName: "",
                    description: "",
                    imgUrl: null,
                  }}
                >
                  <Form.Item
                    label="Topic Name"
                    name="topicName"
                    rules={[
                      {
                        required: true,
                        message: "Please enter the topic name!",
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
                        message: "Please enter the description!",
                      },
                    ]}
                  >
                    <Input />
                  </Form.Item>

                  <Form.Item
                    label="Image"
                    name="imgUrl"
                    valuePropName="fileList"
                    getValueFromEvent={normFile}
                    extra="Choose or drag a file here"
                  >
                    <Dragger name="imgUrl" multiple={false} listType="picture">
                      <p className="ant-upload-drag-icon">
                        <UploadOutlined />
                      </p>
                      <p className="ant-upload-text">
                        Click or drag file to this area to upload
                      </p>
                    </Dragger>
                  </Form.Item>

                  <Form.Item>
                    <Button type="primary" htmlType="submit" loading={loading}>
                      {event === "addTopic" ? "Add" : "Update"}
                    </Button>
                  </Form.Item>
                </Form>
              </div>
            </Flex>
          </Modal>

          <Modal
            centered
            open={modalOpenQuestion}
            onCancel={() => setModalOpenQuestion(false)}
            footer={null}
          >
            <Flex vertical align="center">
              <div className="form-container">
                <h1 className="form-title">Quiz Question Information</h1>
                <Form
                  form={form}
                  layout="vertical"
                  onFinish={onFinish}
                  initialValues={{
                    topicId: selectedTopic,
                    questionText: "",
                    correctAnswer: "",
                    incorrectAnswer1: "",
                    incorrectAnswer2: "",
                  }}
                >
                  <Form.Item
                    label="Topic"
                    name="topicId"
                    rules={[
                      {
                        required: true,
                        message: "Please select a topic!",
                      },
                    ]}
                  >
                    <Select placeholder="Select a topic">
                      {quizTopics.map((topic) => (
                        <Option key={topic.id} value={topic.id}>
                          {topic.topicName}
                        </Option>
                      ))}
                    </Select>
                  </Form.Item>

                  <Form.Item
                    label="Question Text"
                    name="questionText"
                    rules={[
                      {
                        required: true,
                        message: "Please enter the question text!",
                      },
                    ]}
                  >
                    <Input />
                  </Form.Item>

                  <Form.Item
                    label="Correct Answer"
                    name="correctAnswer"
                    rules={[
                      {
                        required: true,
                        message: "Please enter the correct answer!",
                      },
                    ]}
                  >
                    <Input />
                  </Form.Item>

                  <Form.Item
                    label="Incorrect Answer 1"
                    name="incorrectAnswer1"
                    rules={[
                      {
                        required: true,
                        message: "Please enter an incorrect answer!",
                      },
                    ]}
                  >
                    <Input />
                  </Form.Item>

                  <Form.Item
                    label="Incorrect Answer 2"
                    name="incorrectAnswer2"
                    rules={[
                      {
                        required: true,
                        message: "Please enter another incorrect answer!",
                      },
                    ]}
                  >
                    <Input />
                  </Form.Item>

                  <Form.Item>
                    <Button type="primary" htmlType="submit" loading={loading}>
                      {event === "addQuestion" ? "Add" : "Update"}
                    </Button>
                  </Form.Item>
                </Form>
              </div>
            </Flex>
          </Modal>
        </Flex>
        <Table
          dataSource={quizTopics}
          rowKey="id"
          onRow={(record) => {
            return {
              onClick: () => {
                setSelectedTopic(record.id);
                callGetQuizQuestions(record.id);
              },
            };
          }}
        >
          <Column title="ID" dataIndex="id" key="id" />
          <Column title="Topic Name" dataIndex="topicName" key="topicName" />
          <Column
            title="Description"
            dataIndex="description"
            key="description"
          />
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
                    setEvent("updateTopic");
                    form.setFieldsValue({
                      topicName: record.topicName,
                      description: record.description,
                      imgUrl: null,
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
                    setEvent("deleteTopic");
                  }}
                >
                  Delete
                </Button>
              </Space>
            )}
          />
        </Table>
        <Divider />
        <Typography.Title level={3}>
          Questions for Selected Topic
        </Typography.Title>
        <Button
          type="primary"
          style={{
            backgroundColor: "#8DD3BB",
            fontWeight: 500,
            width: "fit-content",
            marginBottom: "16px",
          }}
          onClick={() => {
            setModalOpenQuestion(true);
            setEvent("addQuestion");
            form.resetFields();
            form.setFieldsValue({
              topicId: selectedTopic,
            });
          }}
          disabled={!selectedTopic}
        >
          Add Question
        </Button>
        <Table dataSource={quizQuestions} rowKey="id">
          <Column title="ID" dataIndex="id" key="id" />
          <Column
            title="Question Text"
            dataIndex="questionText"
            key="questionText"
          />
          <Column
            title="Correct Answer"
            dataIndex="correctAnswer"
            key="correctAnswer"
          />
          <Column
            title="Incorrect Answer 1"
            dataIndex="incorrectAnswer1"
            key="incorrectAnswer1"
          />
          <Column
            title="Incorrect Answer 2"
            dataIndex="incorrectAnswer2"
            key="incorrectAnswer2"
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
                    setModalOpenQuestion(true);
                    setEvent("updateQuestion");
                    form.setFieldsValue({
                      topicId: selectedTopic,
                      questionText: record.questionText,
                      correctAnswer: record.correctAnswer,
                      incorrectAnswer1: record.incorrectAnswer1,
                      incorrectAnswer2: record.incorrectAnswer2,
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
                    setEvent("deleteQuestion");
                  }}
                >
                  Delete
                </Button>
              </Space>
            )}
          />
        </Table>
      </Flex>
    </Spin>
  );
};

export default QuizManagementPage;
