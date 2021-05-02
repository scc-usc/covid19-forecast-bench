import React, { Component } from "react";
import { Table, Tag } from "antd";

const rankingTable = props => {
  const { data, addMethod, metrics } = props;

  const columns = [
    {
      title: "Method Name",
      dataIndex: "methodName",
      sorter: (a, b) => a.methodName < b.methodName,
      sortDirections: ["ascend", "descend"],
      render: methodName => (
        <a
          onClick={() => {
            addMethod(methodName);
          }}
        >
          {methodName}
        </a>
      ),
    },
    {
      title: "Method Type",
      dataIndex: "methodType",
      filters: [
        {
          text: "ML/AI",
          value: "ML/AI",
        },
        {
          text: "Human-Expert",
          value: "Human-Expert",
        },
      ],
      onFilter: (value, entry) => entry.methodType.indexOf(value) === 0,
      render: type => {
        let color = type.length > 5 ? "geekblue" : "volcano";
        return (
          <Tag color={color} key={type}>
            {type}
          </Tag>
        );
      },
    },
    {
      title: `Relative ${metrics.toUpperCase()}`,
      dataIndex: "relativeError",
      sorter: (a, b) => a.relativeError - b.relativeError,
      defaultSortOrder: "ascend",
      sortDirections: ["ascend", "descend"],
    },
    {
      title: metrics.toUpperCase(),
      dataIndex: "averageError",
      sorter: (a, b) => a.averageError - b.averageError,
      sortDirections: ["ascend", "descend"],
    },
    {
      title: "Number of Forecasts",
      dataIndex: "forecastCount",
      sorter: (a, b) => a.forecastCount - b.forecastCount,
      filters: [
        {
          text: "Only show methods that fits selected date range.",
          value: "1",
        },
      ],
      onFilter: (value, entry) => entry.fitWithinDateRange == value,
      defaultFilteredValue: ["1"],
      sortDirections: ["ascend", "descend"],
    },
    {
      title: "Status",
      dataIndex: "updating",
      filters: [
        {
          text: "Only show methods that are still updating.",
          value: "1",
        },
      ],
      onFilter: (value, entry) => entry.updating == value,
      render: b => {
        let color = b? "green" : "red";
        let text = b? "Still Updating" : "Stop Updates";
        return (
          <Tag color={color} key={Math.random() * 10000}>
            {text}
          </Tag>
        );
      },
    }
  ];

  return <Table columns={columns} dataSource={data} />;
};

export default rankingTable;
