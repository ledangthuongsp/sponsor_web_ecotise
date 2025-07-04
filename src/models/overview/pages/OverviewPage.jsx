import { useEffect, useState } from "react";
import { ArrowDownOutlined, ArrowUpOutlined } from "@ant-design/icons";
import { Card, Col, Row, Statistic, Select } from "antd";
import { Bar, Line } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, PointElement, LineElement } from 'chart.js';
import axios from "axios";
import dayjs from 'dayjs';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, PointElement, LineElement);

const { Option } = Select;

import { BASE_API_URL } from "../../../constants/APIConstants";

const OverviewPage = () => {
  const [statistics, setStatistics] = useState([]);
  const [totalStatistics, setTotalStatistics] = useState({});
  const [currentWeekStats, setCurrentWeekStats] = useState({});
  const [lastWeekStats, setLastWeekStats] = useState({});
  const [period, setPeriod] = useState("week");

  useEffect(() => {
    const fetchStatistics = async () => {
      try {
        const response = await axios.get(`${BASE_API_URL}/api/statistics/by-period?period=${period}`);
        setStatistics(response.data);
      } catch (error) {
        console.error("Failed to fetch statistics:", error);
      }
    };

    const fetchTotalStatistics = async () => {
      try {
        const response = await axios.get(`${BASE_API_URL}/api/statistics/total`);
        setTotalStatistics(response.data);
      } catch (error) {
        console.error("Failed to fetch total statistics:", error);
      }
    };

    const fetchCurrentWeekStatistics = async () => {
      try {
        const response = await axios.get(`${BASE_API_URL}/api/statistics/current-week`);
        setCurrentWeekStats(response.data);
      } catch (error) {
        console.error("Failed to fetch current week statistics:", error);
      }
    };

    const fetchLastWeekStatistics = async () => {
      try {
        const response = await axios.get(`${BASE_API_URL}/api/statistics/last-week`);
        setLastWeekStats(response.data);
      } catch (error) {
        console.error("Failed to fetch last week statistics:", error);
      }
    };

    fetchStatistics();
    fetchTotalStatistics();
    fetchCurrentWeekStatistics();
    fetchLastWeekStatistics();
  }, [period]);

  const getTotalChange = (current, last) => {
    return ((current - last) / (last || 1)) * 100;
  };

  const totalChange = {
    paper: getTotalChange(currentWeekStats.paperKg, lastWeekStats.paperKg),
    cardboard: getTotalChange(currentWeekStats.cardBoardKg, lastWeekStats.cardBoardKg),
    plastic: getTotalChange(currentWeekStats.plasticKg, lastWeekStats.plasticKg),
  };

  const totalData = {
    labels: ["Paper", "Cardboard", "Plastic", "Glass", "Cloth", "Metal"],
    datasets: [
      {
        label: "Total Collected (Kg)",
        data: [
          totalStatistics.paperKg,
          totalStatistics.cardBoardKg,
          totalStatistics.plasticKg,
          totalStatistics.glassKg,
          totalStatistics.clothKg,
          totalStatistics.metalKg,
        ],
        backgroundColor: [
          "#FF6384",
          "#36A2EB",
          "#FFCE56",
          "#4BC0C0",
          "#9966FF",
          "#FF9F40",
        ],
      },
    ],
  };

  const periodData = {
    labels: statistics.map((stat) => `${dayjs(stat.periodStart).format('DD/MM/YYYY')} - ${dayjs(stat.periodEnd).format('DD/MM/YYYY')}`),
    datasets: [
      {
        label: "Kg Collected",
        data: statistics.map((stat) => stat.paperKg + stat.cardboardKg + stat.plasticKg + stat.glassKg + stat.clothKg + stat.metalKg),
        backgroundColor: [
          "#FF6384",
          "#36A2EB",
          "#FFCE56",
          "#4BC0C0",
          "#9966FF",
          "#FF9F40",
        ],
      },
    ],
  };

  const co2Data = {
    labels: statistics.map((stat) => `${dayjs(stat.periodStart).format('DD/MM/YYYY')} - ${dayjs(stat.periodEnd).format('DD/MM/YYYY')}`),
    datasets: [
      {
        label: "CO2 Saved (Kg)",
        data: statistics.map((stat) => stat.co2Saved),
        borderColor: "#8DD3BB",
        borderWidth: 2,
        fill: false,
      },
    ],
  };

  return (
    <div style={{ padding: '20px' }}>
      <Select defaultValue={period} onChange={(value) => setPeriod(value)} style={{ width: 120, marginBottom: 20 }}>
        <Option value="week">Week</Option>
        <Option value="month">Month</Option>
        <Option value="year">Year</Option>
      </Select>
      <Row gutter={16}>
        <Col span={8}>
          <Card bordered={false}>
            <Statistic
              title="Total Paper Collected (Kg)"
              value={currentWeekStats.paperKg || 0}
              precision={2}
              valueStyle={{ color: totalChange.paper >= 0 ? "#3f8600" : "#cf1322" }}
              prefix={totalChange.paper >= 0 ? <ArrowUpOutlined /> : <ArrowDownOutlined />}
              suffix={`${totalChange.paper.toFixed(2)}%`}
            />
          </Card>
        </Col>
        <Col span={8}>
          <Card bordered={false}>
            <Statistic
              title="Total Cardboard Collected (Kg)"
              value={currentWeekStats.cardBoardKg || 0}
              precision={2}
              valueStyle={{ color: totalChange.cardboard >= 0 ? "#3f8600" : "#cf1322" }}
              prefix={totalChange.cardboard >= 0 ? <ArrowUpOutlined /> : <ArrowDownOutlined />}
              suffix={`${totalChange.cardboard.toFixed(2)}%`}
            />
          </Card>
        </Col>
        <Col span={8}>
          <Card bordered={false}>
            <Statistic
              title="Total Plastic Collected (Kg)"
              value={currentWeekStats.plasticKg || 0}
              precision={2}
              valueStyle={{ color: totalChange.plastic >= 0 ? "#3f8600" : "#cf1322" }}
              prefix={totalChange.plastic >= 0 ? <ArrowUpOutlined /> : <ArrowDownOutlined />}
              suffix={`${totalChange.plastic.toFixed(2)}%`}
            />
          </Card>
        </Col>
      </Row>
      <Row gutter={16} style={{ marginTop: 20 }}>
        <Col span={24}>
          <Card>
            <Bar options={{ responsive: true }} data={totalData} />
          </Card>
        </Col>
      </Row>
      <Row gutter={16} style={{ marginTop: 20 }}>
        <Col span={24}>
          <Card>
            <Bar options={{ responsive: true }} data={periodData} />
          </Card>
        </Col>
      </Row>
      <Row gutter={16} style={{ marginTop: 20 }}>
        <Col span={24}>
          <Card>
            <Line options={{ responsive: true }} data={co2Data} />
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default OverviewPage;
