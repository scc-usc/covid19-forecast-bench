import React, { Component } from "react";
import {
    red,
    gold,
    lime,
    cyan,
    geekblue,
    purple,
    magenta
  } from "@ant-design/colors";

import { 
    LineChart, 
    Line,
    CartesianGrid,
    XAxis,
    YAxis,
    Tooltip,
    Legend,
    Label,
    ErrorBar,
    ReferenceLine
} from 'recharts';

function getLineColor(index) {
    const colors = [
        red,
        gold,
        lime,
        cyan,
        geekblue,
        purple,
        magenta
    ];

    return colors[index % colors.length];
}



class Evalgraph extends Component {
    parseData = (data, errorType) => { 
        const firstModel = Object.keys(data)[0];
        if (data[firstModel])
        {
            if (errorType === "rmse")
            {
                const chartData = data[firstModel].rmseData.map((value,idx) => {
                    let date = value.x.split("_")[0].substring(5)+ "_" + value.x.split("_")[1].substring(5);
                    let dataSet = {name: date};
                    if (!isNaN(value.y) && value.y !== "")
                    {
                      dataSet[Object.keys(data)[0]] = value.y;
                    }
                    for (let i = 1; i < Object.keys(data).length; ++i)
                    {
                        let error = data[Object.keys(data)[i]].rmseData[idx].y;
                        if (!isNaN(error) && error !== "")
                        {
                          dataSet[Object.keys(data)[i]] = error;
                        }  
                    }
                    return dataSet
                });
                return chartData;
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
              return chartData;
            }
        }
    }
    
    render(){
        let {data, errorType} = this.props;
        //map data
        const chartData = this.parseData(data, errorType);
        //areas and line color
        const models = Object.keys(data);
        let colors = [];
        models.map((model, idx)=>{
            let strokeColor = getLineColor(idx);
            colors.push(strokeColor);
            return 0;
        });
        let lines = [];
        for (let i = 0; i < models.length; ++i)
        {
            lines.push(
                <Line type="monotone" key={i} dataKey={models[i]} stroke={colors[i][3]} strokeWidth={5}/>
            )
        }
        return(
            <LineChart width={1400} height={300} data={chartData}
            margin={{ top: 40, right: 30, left: 40, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis>
                {errorType==="rmse"?
                <Label value="Root Mean Square Error" dy = {90} position="insideLeft" angle={-90} fontSize={15} />
                 :
                <Label value="Mean Absolute Error" dy = {45} position="insideLeft" angle={-90} fontSize={15} />
                }
            </YAxis>
            <Tooltip />
            <Legend iconSize={40}/>
            {lines}
            </LineChart>
        );
    }
}

export default Evalgraph;

