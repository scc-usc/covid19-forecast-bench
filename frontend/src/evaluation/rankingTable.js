import React, { Component } from "react";
import { Table, Tag } from "antd";

const rankingTable = props => {
  const { data, addMethod } = props;

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
      title: "MAE Running Average",
      dataIndex: "averageMAE",
      sorter: (a, b) => a.averageMAE - b.averageMAE,
      sortDirections: ["ascend", "descend"],
    },
    {
      title: "Relative MAE",
      dataIndex: "relativeMAE",
      sorter: (a, b) => a.relativeMAE - b.relativeMAE,
      defaultSortOrder: "ascend",
      sortDirections: ["ascend", "descend"],
    },
    {
      title: "Number of Forecasts",
      dataIndex: "forecastCount",
      sorter: (a, b) => a.forecastCount - b.forecastCount,
      sortDirections: ["ascend", "descend"],
    },
  ];

  return <Table columns={columns} dataSource={data} />;
};

export default rankingTable;
