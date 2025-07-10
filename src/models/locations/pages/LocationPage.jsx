import React, { useEffect, useState } from "react";
import {
    Button, Flex, Table, Tag, Typography, Input, Modal, message, Upload, Form, TimePicker, Select, Space,
} from "antd";
import { UploadOutlined, PlusOutlined } from "@ant-design/icons";
import moment from "moment";
import {
    getAllLocations,
    createLocation,
    updateLocation,
    getAllMaterials,
    updateMaterialsForLocation,
    removeAllMaterials,
    addOpeningSchedule,
    updateScheduleDayOfWeek,
    updateTimeSlotsInSchedule,
    deleteOpeningSchedule,
} from "../../../services/LocationService";
import "./LocationPage.css";

const { Column } = Table;
const { Search } = Input;
const { Dragger } = Upload;



const dayOfWeekVN = {
    MONDAY: "Thứ 2", TUESDAY: "Thứ 3", WEDNESDAY: "Thứ 4", THURSDAY: "Thứ 5",
    FRIDAY: "Thứ 6", SATURDAY: "Thứ 7", SUNDAY: "Chủ nhật",
};
const dayOfWeekOptions = Object.entries(dayOfWeekVN).map(([value, label]) => ({ value, label }));

const LocationPage = () => {
    const [event, setEvent] = useState(null);
    const [modalOpen, setModalOpen] = useState(false);
    const [selectId, setSelectId] = useState(null);
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);
    const [locations, setLocations] = useState([]);

    // Materials
    const [materials, setMaterials] = useState([]);
    const [materialModalOpen, setMaterialModalOpen] = useState(false);
    const [selectedLocation, setSelectedLocation] = useState(null);
    const [selectedMaterialIds, setSelectedMaterialIds] = useState([]);

    // Schedules
    const [scheduleModalOpen, setScheduleModalOpen] = useState(false);
    const [editingLocation, setEditingLocation] = useState(null);
    const [editingSchedule, setEditingSchedule] = useState(null);

    // Fetch locations & materials
    const callGetLocations = async () => {
        const sponsorId = localStorage.getItem("sponsorId");
        const all = await getAllLocations(sponsorId);
        setLocations(all);
    };
    const callGetMaterials = async () => {
        const all = await getAllMaterials();
        setMaterials(all);
    };

    useEffect(() => {
        callGetLocations();
        callGetMaterials();
    }, []);

    const normFile = (e) => (Array.isArray(e) ? e : e?.fileList);

    // --- Add/Update Location ---
    const onFinish = async (values) => {
        const sponsorId = localStorage.getItem("sponsorId");
        const formData = new FormData();
        if (values.backGroundImgUrl?.[0]?.originFileObj) {
            formData.append("backGroundImage", values.backGroundImgUrl[0].originFileObj);
        }
        values.imgDetailsUrl?.forEach((file) => {
            if (file.originFileObj) {
                formData.append("imageDetails", file.originFileObj);
            }
        });
        setLoading(true);
        const success =
            event === "add"
                ? await createLocation(
                    values.locationName, values.description, values.address,
                    values.latitude, values.longitude, formData, sponsorId
                )
                : await updateLocation(
                    selectId, values.locationName, values.description,
                    values.address, values.latitude, values.longitude, formData
                );
        setLoading(false);
        if (success) {
            setModalOpen(false);
            form.resetFields();
            message.success(event === "add" ? "Added successfully!" : "Updated successfully!");
            callGetLocations();
        }
    };

    // --- MATERIALS CRUD ---
    const openEditMaterialModal = (record) => {
        setSelectedLocation(record);
        setSelectedMaterialIds(record.materials.map(m => m.id));
        setMaterialModalOpen(true);
    };
    const handleUpdateMaterials = async () => {
        const success = await updateMaterialsForLocation(selectedLocation.id, selectedMaterialIds);
        if (success) {
            message.success("Materials updated");
            setMaterialModalOpen(false);
            callGetLocations();
        }
    };
    const handleRemoveAllMaterials = async (locationId) => {
        const success = await removeAllMaterials(locationId);
        if (success) {
            message.success("All materials removed");
            callGetLocations();
        }
    };

    // --- SCHEDULE CRUD ---
    const openAddScheduleModal = (location) => {
        setEditingLocation(location);
        setEditingSchedule(null);
        setScheduleModalOpen(true);
    };
    const openEditScheduleModal = (location, schedule) => {
        setEditingLocation(location);
        setEditingSchedule(schedule);
        setScheduleModalOpen(true);
    };
    const handleDeleteSchedule = async (locationId, dayOfWeek) => {
        const success = await deleteOpeningSchedule(locationId, dayOfWeek);
        if (success) {
            message.success("Schedule deleted");
            callGetLocations();
        }
    };

    const handleSaveSchedule = async (values) => {
        let success = false;
        const timeSlots = values.timeSlots.map(ts => ({
            startTime: ts[0].format("HH:mm"),
            endTime: ts[1].format("HH:mm")
        }));
        if (!editingSchedule) {
            // Add new
            success = await addOpeningSchedule(editingLocation.id, values.dayOfWeek, timeSlots);
        } else {
            // Update dayOfWeek & timeslots
            success = await updateScheduleDayOfWeek(editingSchedule.id, editingLocation.id, values.dayOfWeek);
            if (success) {
                success = await updateTimeSlotsInSchedule(editingSchedule.id, editingLocation.id, timeSlots);
            }
        }
        if (success) {
            message.success("Schedule saved");
            setScheduleModalOpen(false);
            callGetLocations();
        }
    };

    return (
        <Flex vertical gap="large">
            <Typography.Title level={2}>Locations Management</Typography.Title>
            <Flex justify="space-between" gap="medium">
                <Search placeholder="Search locations" onSearch={() => { }} enterButton />
                <Button
                    type="primary"
                    style={{ backgroundColor: "#8DD3BB", marginLeft: 10, width: 150 }}
                    onClick={() => {
                        setModalOpen(true);
                        setEvent("add");
                        form.resetFields();
                    }}
                >
                    Add Location
                </Button>
            </Flex>
            {/* Modal Add/Edit Location */}
            <Modal centered open={modalOpen} onCancel={() => setModalOpen(false)} footer={null}>
                <Flex vertical align="center">
                    <div className="form-container">
                        <Typography.Title level={4}>
                            {event === "add" ? "Add Location" : "Edit Location"}
                        </Typography.Title>
                        <Form form={form} layout="vertical" onFinish={onFinish}>
                            <Form.Item label="Name of location" name="locationName" rules={[{ required: true }]}>
                                <Input />
                            </Form.Item>
                            <Form.Item label="Description" name="description" rules={[{ required: true }]}>
                                <Input />
                            </Form.Item>
                            <Form.Item label="Address" name="address" rules={[{ required: true }]}>
                                <Input />
                            </Form.Item>
                            <Form.Item label="Latitude" name="latitude" rules={[{ required: true }]}>
                                <Input type="number" />
                            </Form.Item>
                            <Form.Item label="Longitude" name="longitude" rules={[{ required: true }]}>
                                <Input type="number" />
                            </Form.Item>
                            <Form.Item label="Background image" name="backGroundImgUrl" valuePropName="fileList" getValueFromEvent={normFile}>
                                <Dragger name="backGroundImgUrl" multiple={false} listType="picture">
                                    <p className="ant-upload-drag-icon"><UploadOutlined /></p>
                                    <p className="ant-upload-text">Click or drag file to upload</p>
                                </Dragger>
                            </Form.Item>
                            <Form.Item label="Detail images" name="imgDetailsUrl" valuePropName="fileList" getValueFromEvent={normFile}>
                                <Dragger name="imgDetailsUrl" multiple listType="picture">
                                    <p className="ant-upload-drag-icon"><UploadOutlined /></p>
                                    <p className="ant-upload-text">Click or drag files to upload</p>
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
            {/* Modal MATERIALS */}
            <Modal
                open={materialModalOpen}
                onCancel={() => setMaterialModalOpen(false)}
                title="Update Materials"
                footer={[
                    <Button key="close" onClick={() => setMaterialModalOpen(false)}>Cancel</Button>,
                    <Button key="save" type="primary" onClick={handleUpdateMaterials}>Save</Button>
                ]}
            >
                <Select
                    mode="multiple"
                    style={{ width: "100%" }}
                    placeholder="Select materials"
                    value={selectedMaterialIds}
                    onChange={setSelectedMaterialIds}
                    options={materials.map(m => ({
                        value: m.id,
                        label: `${m.name} (${m.pointsPerKg} pts/kg)`
                    }))}
                />
            </Modal>
            {/* Modal SCHEDULE */}
            <Modal
                open={scheduleModalOpen}
                onCancel={() => setScheduleModalOpen(false)}
                title={editingSchedule ? "Edit Schedule" : "Add Schedule"}
                footer={null}
            >
                <Form
                    onFinish={handleSaveSchedule}
                    initialValues={editingSchedule ? {
                        dayOfWeek: editingSchedule.dayOfWeek,
                        timeSlots: editingSchedule.timeSlots.map(ts => [
                            ts.startTime ? moment(ts.startTime, "HH:mm") : null,
                            ts.endTime ? moment(ts.endTime, "HH:mm") : null,
                        ])
                    } : {}}
                >
                    <Form.Item label="Day of week" name="dayOfWeek" rules={[{ required: true }]}>
                        <Select options={dayOfWeekOptions} />
                    </Form.Item>
                    <Form.List name="timeSlots">
                        {(fields, { add, remove }) => (
                            <>
                                {fields.map(({ key, name, ...restField }) => (
                                    <Space key={key} style={{ display: 'flex', marginBottom: 8 }} align="baseline">
                                        <Form.Item
                                            {...restField}
                                            name={[name, 0]}
                                            rules={[{ required: true, message: "Start time?" }]}
                                        >
                                            <TimePicker format="HH:mm" />
                                        </Form.Item>
                                        <span> - </span>
                                        <Form.Item
                                            {...restField}
                                            name={[name, 1]}
                                            rules={[{ required: true, message: "End time?" }]}
                                        >
                                            <TimePicker format="HH:mm" />
                                        </Form.Item>
                                        <Button type="link" danger onClick={() => remove(name)}>Delete</Button>
                                    </Space>
                                ))}
                                <Button type="dashed" onClick={() => add()} icon={<PlusOutlined />}>Add Time Slot</Button>
                            </>
                        )}
                    </Form.List>
                    <Form.Item>
                        <Button type="primary" htmlType="submit" style={{ marginTop: 12 }}>Save</Button>
                    </Form.Item>
                </Form>
            </Modal>
            {/* MAIN TABLE */}
            <Table dataSource={locations} rowKey="id">
                <Column title="ID" dataIndex="id" key="id" />
                <Column title="Name" dataIndex="locationName" key="locationName" />
                <Column title="Description" dataIndex="description" key="description" />
                <Column title="Address" dataIndex="typeOfLocation" key="typeOfLocation" />
                <Column title="Latitude" dataIndex="latitude" />
                <Column title="Longitude" dataIndex="longitude" />
                <Column title="Background" dataIndex="backGroundImgUrl" render={(url) => <img src={url} alt="bg" style={{ width: 200 }} />} />
                <Column
                  title="Materials"
                  dataIndex="materials"
                  render={(materials, record) => (
                    <div>
                      <div style={{ marginBottom: 8, display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                        {materials.map(mat => (
                          <Tag key={mat.id} color="green">
                            {mat.name} - {mat.pointsPerKg} pts/kg
                          </Tag>
                        ))}
                      </div>
                      <div style={{ display: 'flex', gap: 12 }}>
                        <Button size="small" type="link" onClick={() => openEditMaterialModal(record)}>Edit</Button>
                        <Button size="small" type="link" danger onClick={() => handleRemoveAllMaterials(record.id)}>Remove all</Button>
                      </div>
                    </div>
                  )}
                />
                <Column
                  title="Opening Schedules"
                  dataIndex="openingSchedules"
                  render={(schedules, record) => {
                    // Để hiển thị ngày theo thứ tự VN chuẩn
                    const daysOrder = ["MONDAY", "TUESDAY", "WEDNESDAY", "THURSDAY", "FRIDAY", "SATURDAY", "SUNDAY"];
                    const scheduleMap = {};
                    schedules.forEach(sch => { scheduleMap[sch.dayOfWeek] = sch; });

                    return (
                      <div>
                        {daysOrder.map(day => (
                          <div key={day} style={{ marginBottom: 4, display: 'flex', alignItems: 'center' }}>
                            <span style={{ fontWeight: 600, minWidth: 72, display: 'inline-block' }}>
                              {dayOfWeekVN[day]}:
                            </span>
                            {scheduleMap[day] && scheduleMap[day].timeSlots.length > 0 ? (
                              <>
                                <span style={{ marginLeft: 6, flex: 1 }}>
                                  {scheduleMap[day].timeSlots.map(slot => (
                                    <Tag key={slot.id}>{slot.startTime} - {slot.endTime}</Tag>
                                  ))}
                                </span>
                                <Button size="small" type="link" style={{ marginLeft: 4 }} onClick={() => openEditScheduleModal(record, scheduleMap[day])}>Edit</Button>
                                <Button size="small" type="link" danger onClick={() => handleDeleteSchedule(record.id, day)}>Delete</Button>
                              </>
                            ) : (
                              <Button size="small" type="dashed" style={{ marginLeft: 8 }} onClick={() => openAddScheduleModal(record)}>
                                Add schedule
                              </Button>
                            )}
                          </div>
                        ))}
                      </div>
                    );
                  }}
                />

                <Column
                    title="Actions"
                    key="action"
                    render={(_, record) => (
                        <Button type="primary" onClick={() => {
                            setSelectId(record.id);
                            setEvent("update");
                            setModalOpen(true);
                            form.setFieldsValue({
                                locationName: record.locationName,
                                description: record.description,
                                address: record.typeOfLocation,
                                latitude: record.latitude,
                                longitude: record.longitude,
                                backGroundImgUrl: null,
                                imgDetailsUrl: [],
                            });
                        }}>Edit</Button>
                    )}
                />
            </Table>
        </Flex>
    );
};

export default LocationPage;
