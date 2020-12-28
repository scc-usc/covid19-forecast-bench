import React, { Component, Fragment } from "react";
import Paper from "@material-ui/core/Paper";
import { Plugin } from "@devexpress/dx-react-core";
import {
  ArgumentAxis,
  ValueAxis,
  Chart,
  LineSeries,
  Tooltip,
  Legend,
  ZoomAndPan,
} from "@devexpress/dx-react-chart-material-ui";
import { EventTracker } from "@devexpress/dx-react-chart";

const testData = [
  { argument: 1, value: 10 },
  { argument: 2, value: 20 },
  { argument: 3, value: 30 },
];

class NewEvalgraph extends Component {
  constructor(props) {
    super(props);
    this.state = {
      chartData: [],
      models: [],
      viewport: undefined,
    };
    this.parseData = this.parseData.bind(this);
    this.viewportChange = viewport => this.setState({ viewport });
  }

  componentDidUpdate = prevProps => {
    if (this.props !== prevProps) {
      let { data, errorType, models } = this.props;
      this.parseData(data, errorType, chartData => {
        this.setState({
          chartData,
          models,
        });
      });
    }
  };

  parseData = (data, errorType, callback) => {
    const firstModel = Object.keys(data)[0];
    //let foundData = new Array(Object.keys(data).length).fill(0);
    if (data[firstModel]) {
      if (errorType === "rmse") {
        const chartData = data[firstModel].rmseData.map((value, idx) => {
          let date =
            value.x.split("_")[0].substring(5) +
            "_" +
            value.x.split("_")[1].substring(5);
          let dataSet = { name: date };
          if (!isNaN(value.y) && value.y !== "") {
            dataSet[Object.keys(data)[0]] = value.y;
          }
          for (let i = 1; i < Object.keys(data).length; ++i) {
            let error = data[Object.keys(data)[i]].rmseData[idx].y;
            if (!isNaN(error) && error !== "") {
              dataSet[Object.keys(data)[i]] = error;
            }
          }
          return dataSet;
        });
        callback(chartData);
      } else {
        const chartData = data[firstModel].maeData.map((value, idx) => {
          // let date =
          //   value.x.split("_")[0].substring(5) +
          //   "_" +
          //   value.x.split("_")[1].substring(5);
          let date = value.x;
          let dataSet = { name: date };
          if (!isNaN(value.y) && value.y !== "") {
            dataSet[Object.keys(data)[0]] = value.y;
          }
          for (let i = 1; i < Object.keys(data).length; ++i) {
            let error = data[Object.keys(data)[i]].maeData[idx].y;
            if (!isNaN(error) && error !== "") {
              dataSet[Object.keys(data)[i]] = error;
            }
          }
          return dataSet;
        });
        callback(chartData);
      }
    }
  };

  render() {
    const { chartData, models, viewport } = this.state;
    const { errorType } = this.props;
    console.log(chartData);
    const TooltipContent = ({ targetItem }) => {
      const item = chartData[targetItem.point];
      return (
        <div>
          <p>{`${targetItem.series}`}</p>
          <table>
            <tbody>
              <tr>
                <td>{`Date: ${item.name}`}</td>
              </tr>
              <tr>
                <td>{`Error: ${item[targetItem.series]}`}</td>
              </tr>
            </tbody>
          </table>
        </div>
      );
    };

    let lines = [];
    for (let i = 0; i < models.length; ++i) {
      lines.push(
        <LineSeries
          key={i}
          valueField={models[i]}
          argumentField="name"
          name={models[i]}
        />
      );
    }
    return (
      <Paper>
        <Chart data={chartData}>
          {/* <ArgumentAxis tickSize={3} /> */}
          <ValueAxis />
          <Plugin>
            {/* {lines.length &&
            lines.length === models.length &&
            lines.every(line => React.isValidElement(line))
              ? lines
              : null} */}
            {lines}
            <ZoomAndPan
              viewport={viewport}
              onViewportChange={this.viewportChange}
            />
          </Plugin>
          <EventTracker />
          <Tooltip contentComponent={TooltipContent} />
          <Legend />
        </Chart>
      </Paper>
    );
  }
}

export default NewEvalgraph;
