import { useEffect, useState } from "react";
import {
  Button,
  Flex,
  Table,
  Typography,
  Input,
  Modal,
  message,
  Upload,
  Form,
  Popconfirm,
  InputNumber,
  Divider,
} from "antd";
import { UploadOutlined } from "@ant-design/icons";
import {
  getAllRewardItem,
  addNewRewardItem,
  updateRewardItem,
  deleteRewardItem,
  getStockByRewardItemId,
  getLowStockItems,
  createImportRequest,
} from '../../services/RewardService';
import { getAllLocations } from "../../services/LocationService";
import { Pie, Bar } from '@ant-design/charts';

const { Column } = Table;
const { Search } = Input;
const { Dragger } = Upload;

const RewardPages = () => {
  const [form] = Form.useForm();
  const [rewards, setRewards] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [event, setEvent] = useState("add");
  const [selectId, setSelectId] = useState(null);
  const [stockModalOpen, setStockModalOpen] = useState(false);
  const [selectedReward, setSelectedReward] = useState(null);
  const [locationStocks, setLocationStocks] = useState([]);
  const [allLocations, setAllLocations] = useState([]);
  const [importQuantities, setImportQuantities] = useState({});
  const [lowStockData, setLowStockData] = useState([]);
  const [stockChartData, setStockChartData] = useState([]);

  const callGetRewards = async () => {
    const res = await getAllRewardItem();
    setRewards(res);
    fetchStockChartData(res);
  };

  const fetchStockChartData = async (rewardItems) => {
    let allData = [];
    for (let reward of rewardItems) {
      const stockList = await getStockByRewardItemId(reward.id);
      const total = stockList.reduce((acc, curr) => acc + (curr.stock || 0), 0);
      allData.push({ type: reward.itemName, value: total });
    }
    setStockChartData(allData);
  };

  const fetchStockData = async (rewardId) => {
    const locs = await getAllLocations();
    const stockData = await getStockByRewardItemId(rewardId);
    setAllLocations(locs);
    setLocationStocks(stockData);
    setImportQuantities({});
  };

  const fetchLowStock = async () => {
    const all = await getAllLocations();
    const result = [];
    for (const reward of rewards) {
      for (const loc of all) {
        const items = await getLowStockItems(loc.id, 3);
        items.forEach(item => {
          if (item.rewardItemId === reward.id) {
            result.push({
              key: `${reward.id}-${loc.id}`,
              rewardItemName: reward.itemName,
              locationName: loc.locationName,
              locationId: loc.id,
              rewardItemId: reward.id,
              stock: item.stock,
            });
          }
        });
      }
    }
    setLowStockData(result);
  };

  useEffect(() => {
    callGetRewards();
  }, []);

  useEffect(() => {
    if (rewards.length > 0) {
      fetchLowStock();
    }
  }, [rewards]);

  const handleImportRequest = async (rewardItemId, locationId) => {
    const quantity = importQuantities[`${rewardItemId}-${locationId}`] || 0;
    if (quantity <= 0) {
      message.warning("Please enter quantity > 0");
      return;
    }
    const success = await createImportRequest(locationId, [
      { rewardItemId, numberOfItem: quantity }
    ]);
    if (success) {
      message.success("Import request sent!");
      fetchLowStock();
    } else {
      message.error("Failed to send import request.");
    }
  };

  const filteredRewards = rewards.filter((reward) =>
    reward.itemName?.toLowerCase().includes(searchTerm)
  );

  const normFile = (e) => Array.isArray(e) ? e : e?.fileList;

  const onFinish = async (values) => {
    const formData = new FormData();
    const rewardData = {
      pointCharge: values.pointCharge,
      itemName: values.itemName,
      itemDescription: values.itemDescription,
      rewardItemUrl: values.rewardItemUrl
        ?.filter((file) => !file.originFileObj)
        .map((file) => file.url),
    };
    formData.append("reward", new Blob([JSON.stringify(rewardData)], { type: "application/json" }));
    values.rewardItemUrl?.forEach((file) => {
      if (file.originFileObj) {
        formData.append("files", file.originFileObj);
      }
    });

    setLoading(true);
    const success =
      event === "add"
        ? await addNewRewardItem(formData)
        : await updateRewardItem(selectId, formData);

    if (success) {
      message.success(event === "add" ? "Added!" : "Updated!");
      setModalOpen(false);
      form.resetFields();
      callGetRewards();
    }
    setLoading(false);
  };

  const handleDelete = async (id) => {
    setLoading(true);
    const res = await deleteRewardItem(id);
    if (res) {
      message.success("Deleted!");
      await callGetRewards();
    }
    setLoading(false);
  };

  return (
    <Flex vertical gap="large">
      <Typography.Title level={2}>Reward Management</Typography.Title>

      {/* PART 1: CRUD */}
      <Flex justify="space-between" gap="small">
        <Search placeholder="Search rewards" onSearch={(val) => setSearchTerm(val)} enterButton />
        <Button type="primary" onClick={() => { setModalOpen(true); setEvent("add"); form.resetFields(); }}>
          Add Reward
        </Button>
      </Flex>

      <Table dataSource={filteredRewards} rowKey="id" pagination={{ pageSize: 5 }}>
        <Column title="ID" dataIndex="id" />
        <Column title="Name" dataIndex="itemName" />
        <Column title="Point" dataIndex="pointCharge" />
        <Column title="Description" dataIndex="itemDescription" />
        <Column
          title="Images"
          dataIndex="rewardItemUrl"
          render={(urls) => urls.map((url, i) => (
            <img key={i} src={url} alt="reward" style={{ maxWidth: "80px", marginRight: "5px" }} />
          ))}
        />
        <Column
          title="Actions"
          render={(_, record) => (
            <Flex gap="small">
              <Button onClick={async () => {
                setSelectedReward(record);
                await fetchStockData(record.id);
                setStockModalOpen(true);
              }}>Stock</Button>
              <Button onClick={() => {
                setModalOpen(true);
                setEvent("update");
                setSelectId(record.id);
                form.setFieldsValue({
                  itemName: record.itemName,
                  itemDescription: record.itemDescription,
                  pointCharge: record.pointCharge,
                  rewardItemUrl: record.rewardItemUrl.map((url, i) => ({
                    uid: `${i}`, name: `img-${i}`, status: "done", url,
                  })),
                });
              }}>Edit</Button>
              <Popconfirm title="Confirm delete?" onConfirm={() => handleDelete(record.id)}>
                <Button danger>Delete</Button>
              </Popconfirm>
            </Flex>
          )}
        />
      </Table>

      {/* Modal Add/Edit */}
      <Modal open={modalOpen} onCancel={() => setModalOpen(false)} footer={null} centered>
        <Form form={form} layout="vertical" onFinish={onFinish}>
          <Form.Item label="Name" name="itemName" rules={[{ required: true }]}><Input /></Form.Item>
          <Form.Item label="Description" name="itemDescription" rules={[{ required: true }]}><Input /></Form.Item>
          <Form.Item label="Point Charge" name="pointCharge" rules={[{ required: true }]}><Input type="number" /></Form.Item>
          <Form.Item label="Reward Images" name="rewardItemUrl" valuePropName="fileList" getValueFromEvent={normFile}>
            <Dragger multiple listType="picture"><UploadOutlined /> Drag or Click</Dragger>
          </Form.Item>
          <Form.Item><Button type="primary" htmlType="submit" loading={loading}>{event === "add" ? "Add" : "Update"}</Button></Form.Item>
        </Form>
      </Modal>

      {/* Modal View Stock per reward */}
      <Modal open={stockModalOpen} onCancel={() => setStockModalOpen(false)} footer={null} width={800} centered>
        <Typography.Title level={4}>Stock for: {selectedReward?.itemName}</Typography.Title>
        <Table dataSource={allLocations.map((loc) => {
            const stock = locationStocks.find((s) => s.locationId === loc.id) || {};
            return {
              key: loc.id,
              locationName: loc.locationName,
              stock: stock.stock || 0,
              importing: stock.importing || 0,
              pending: stock.pending || 0,
              locationId: loc.id,
            };
          })}
          pagination={false}
        >
          <Column title="Location" dataIndex="locationName" />
          <Column title="Stock" dataIndex="stock" />
          <Column title="Importing" dataIndex="importing" />
          <Column title="Pending" dataIndex="pending" />
          <Column
            title="Import Qty"
            render={(_, record) => (
              <InputNumber
                min={1}
                value={importQuantities[`${selectedReward.id}-${record.locationId}`] || 0}
                onChange={(value) =>
                  setImportQuantities((prev) => ({
                    ...prev,
                    [`${selectedReward.id}-${record.locationId}`]: value,
                  }))
                }
              />
            )}
          />
          <Column
            title="Actions"
            render={(_, record) => (
              <Button type="primary" onClick={() => handleImportRequest(selectedReward.id, record.locationId)}>
                Import
              </Button>
            )}
          />
        </Table>
      </Modal>

      {/* PART 2: Location thiếu hàng */}
      <Divider orientation="left">Location Low Stock Items</Divider>
      <Table dataSource={lowStockData} rowKey="key" pagination={{ pageSize: 5 }}>
        <Column title="Reward" dataIndex="rewardItemName" />
        <Column title="Location" dataIndex="locationName" />
        <Column title="Current Stock" dataIndex="stock" />
        <Column
          title="Import Qty"
          render={(_, record) => (
            <InputNumber
              min={1}
              value={importQuantities[`${record.rewardItemId}-${record.locationId}`] || 0}
              onChange={(val) => setImportQuantities(prev => ({
                ...prev,
                [`${record.rewardItemId}-${record.locationId}`]: val
              }))}
            />
          )}
        />
        <Column
          title="Actions"
          render={(_, record) => (
            <Button type="primary" onClick={() => handleImportRequest(record.rewardItemId, record.locationId)}>
              Import
            </Button>
          )}
        />
      </Table>

      {/* PART 3: Charts */}
      <Divider orientation="left">Reward Stock Overview</Divider>
      <Flex gap="large" wrap="wrap">
        <div style={{ width: 400 }}>
          <Typography.Title level={5}>Total Stock by Reward</Typography.Title>
          <Bar data={stockChartData} xField="value" yField="type" height={300} />
        </div>
        <div style={{ width: 400 }}>
          <Typography.Title level={5}>Stock Distribution</Typography.Title>
          <Pie
            data={stockChartData}
            angleField="value"
            colorField="type"
            radius={0.9}
            label={{ type: "outer", content: "{name} {percentage}" }}
          />
        </div>
      </Flex>
    </Flex>
  );
};

export default RewardPages;
