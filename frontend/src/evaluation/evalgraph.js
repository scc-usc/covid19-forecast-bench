import React, { Component } from "react";
import {
  VictoryChart,
  VictoryLine,
  VictoryScatter,
  VictoryTooltip,
  VictoryLabel,
  VictoryLegend,
  VictoryAxis,
  VictoryZoomContainer,
  VictoryTheme,
} from "victory";

const colorSchemes = [
  "#ef4f4f",
  "#ffcda3",
  "#74c7b8",
  "#ff7b54",
  "#ffb26b",
  "#ffd56b",
  "#939b62",
  "#ec4646",
  "#663f3f",
  "#51c2d5",
  "#bbf1fa",
  "#bee5d3",
  "#d6b0b1",
  "#d6b0b1",
  "#8b5e83",
  "#3b5360",
  "#111d5e",
  "#c70039",
  "#ee9595",
  "#f37121",
];

export const evalgraph = props => {
  const { data, models } = props;

  const lineAnimation = {
    duration: 2000,
    onLoad: { duration: 1000 },
  };

  const flyoutStyle = { fill: "white",
    stroke: "#ccc",
    strokeWidth: 0.5 };

  let lines = [];
  let scatters = [];
  let legends = [];

  // An invisible anchor point to prevent the chart from being cut off.
  scatters.push(<VictoryLine
    style={{
      data: { stroke: "#ffffff" },
    }}
    size={0}
    data={[
      { x: "2020-07-01", y: 0 },
    ]}
  />);

  models.forEach((model, idx) => {
    const color = colorSchemes[idx % colorSchemes.length];

    const lineStyle = {
      data: { stroke: color, strokeWidth: 1 },
      parent: { border: "1px solid #ccc" },
    };

    const scatterStyle = {
      data: { fill: color },
      labels: { fill: color },
    };

    const tooltipStyle = [
      { fill: color, fontSize: 5, fontFamily: "sans-serif", fontWeight: "bold" },
      { fill: "#aaa", fontSize: 5, fontFamily: "sans-serif" },
      { fill: "#aaa", fontSize: 5, fontFamily: "sans-serif" },
    ];

    const lineData = data[model]["maeData"].filter(datapoint => datapoint.y); // Filter out NaN values.
    legends.push({ name: model, symbol: { fill: color }});

    lines.push(
      <VictoryLine
        key={idx}
        data={lineData}
        // animate={lineAnimation}
        style={lineStyle}
        interpolation="linear"
      />
    );
    scatters.push(
      <VictoryScatter
        key={idx}
        data={lineData}
        style={scatterStyle}
        size={1.5}
        labels={({ datum }) => [
          model,
          `End date: ${datum.x.substring(11, 21)}`,
          `MAE: ${datum.y}`,
        ]}
        labelComponent={
          <VictoryTooltip
            cornerRadius={0}
            flyoutStyle={flyoutStyle}
            flyoutHeight={20}
            style={tooltipStyle}
            dx={-36}
            dy={20}
          />
        }
      />
    );
  });

  // An invisible datapoint to prevent the chart from being cut off.
  scatters.push(<VictoryScatter
    style={{
      data: { fill: "#ffffff" },
    }}
    size={0}
    data={[
      { x: "x", y: 200 },
    ]}
  />);

  return (
    <div>
      <VictoryChart
        containerComponent={<VictoryZoomContainer />}
        theme={VictoryTheme.material}
        padding={{top: 2, bottom: 40, left: 40, right: 60}}
        height={180}
      >
        {scatters}
        {lines}
        <VictoryAxis
          tickCount={8}
          tickFormat={t => (typeof t === "string" ? t.substring(11, 21) : t)}
          label="Forecast End Date"
          style={{
            tickLabels: { fontSize: 6, padding: 10, angle: 25 },
            axisLabel: { fontSize: 6, padding: 2}
          }}
        />
        <VictoryAxis
          dependentAxis
          label="MAE"
          style={{
            tickLabels: { fontSize: 6, padding: 1 },
            axisLabel: { fontSize: 6, padding: 20 },
          }}
        />
        <VictoryLegend
          data={legends}
          style={{labels: {fontSize: 4}}}
          x={290}
          y={0}
        />
      </VictoryChart>
    </div>
  );
};

export default evalgraph;
