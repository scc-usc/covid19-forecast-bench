import React, { Component } from "react";
import { VictoryChart, VictoryLine, VictoryZoomContainer } from "victory";

class Evalgraph extends Component {
  render() {
    const { data } = this.props;
    let lineData;
    if (data["USC_SI_kJalpha"] !== undefined) {
      lineData = data["USC_SI_kJalpha"]["maeData"];
      lineData = lineData.filter(datapoint => datapoint.y);
      console.log(lineData);
    }
    return (
      <div>
        <VictoryChart containerComponent={<VictoryZoomContainer />}>
          <VictoryLine data={lineData} />
        </VictoryChart>
      </div>
    );
  }
}

export default Evalgraph;
