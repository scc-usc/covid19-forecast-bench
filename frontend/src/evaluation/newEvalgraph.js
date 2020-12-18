import React, { Component } from "react";
import Paper from '@material-ui/core/Paper';
import {
    ArgumentAxis,
    ValueAxis,
    Chart,
    LineSeries,
  } from "@devexpress/dx-react-chart-material-ui";


    const testData = [
        { argument: 1, value: 10 },
        { argument: 2, value: 20 },
        { argument: 3, value: 30 },
    ];

  class NewEvalgraph extends Component {
    constructor(props) {
      super(props);
      this.state = {
        chartData : [],
        models :[]
      };
      this.parseData = this.parseData.bind(this);
    }

    componentDidUpdate = (prevProps)=>{
      if (this.props !== prevProps)
      {
        let {data, errorType, models} = this.props;
        //const chartData = this.parseData(data, errorType);
        this.parseData(data, errorType, (chartData)=>{
          this.setState({
            chartData,
            models
          });
        });
        //this.setState({chartData:chartData});
      }
    }

    parseData = (data, errorType, callback) => { 
        const firstModel = Object.keys(data)[0];
        if (data[firstModel])
        {
            if (errorType === "rmse")
            {
                const chartData = data[firstModel].rmseData.map((value,idx) => {
                    //for the date(name, argument in graph)
                    let date = value.x.split("_")[0].substring(5)+ "_" + value.x.split("_")[1].substring(5);
                    let dataSet = {name: date};
                    //for the first model
                    if (!isNaN(value.y) && value.y !== "")
                    {
                      dataSet[Object.keys(data)[0]] = value.y;
                    }
                    else
                    {
                      dataSet[Object.keys(data)[0]] = 0;
                    }
                    //for all the other models
                    for (let i = 1; i < Object.keys(data).length; ++i)
                    {
                        let error = data[Object.keys(data)[i]].rmseData[idx].y;
                        if (!isNaN(error) && error !== "")
                        {
                          dataSet[Object.keys(data)[i]] = error;
                        }
                        else 
                        {
                          dataSet[Object.keys(data)[i]] = 0;
                        }  
                    }
                    return dataSet
                });
                // console.log(chartData);
                // this.setState({chartData:chartData});
                callback(chartData);
            }
            else
            {
              const chartData = data[firstModel].maeData.map((value,idx) => {
                let date = value.x.split("_")[0].substring(5)+ "_" + value.x.split("_")[1].substring(5)
                let dataSet = {name: date};
                if (!isNaN(value.y) && value.y !== "")
                    {
                      dataSet[Object.keys(data)[0]] = value.y;
                    }
                    for (let i = 1; i < Object.keys(data).length; ++i)
                    {
                        let error = data[Object.keys(data)[i]].maeData[idx].y;
                        if (!isNaN(error) && error !== "")
                        {
                          dataSet[Object.keys(data)[i]] = error;
                        }  
                    }
                    return dataSet
              });
              //this.setState({chartData:chartData});
              callback(chartData);
            }
        }
    }

    render(){
        //let {data, errorType, models} = this.props;
        const {chartData, models} = this.state;
        console.log(chartData);
        console.log(models);
        let lines = [];
        for (let i = 0; i < models.length; ++i)
        {
            lines.push(
                <LineSeries key={i} valueField={models[i]} argumentField="name" name = {models[i]}/>
            )
        }
        console.log(lines);
        // const testData = [
        //   { argument: 1, value: 10 },
        //   { argument: 2, value: 20 },
        //   { argument: 3, value: 30 },
        // ];
        return (
            <Paper>
                <Chart
                data={chartData}
                >
                <ArgumentAxis />
                <ValueAxis />
                {lines.length && lines.length === models.length && lines.every(line =>React.isValidElement(line))?lines:null}
                {/* <LineSeries valueField="USC-SI_kJalpha" argumentField="name" /> */}
                {/* <LineSeries valueField="value" argumentField="argument" /> */}
                </Chart>
            </Paper>
        )
    }
  }

  export default NewEvalgraph;