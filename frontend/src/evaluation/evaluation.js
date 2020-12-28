import React, { Component } from "react";
import Papa from "papaparse";
import { readRemoteFile } from "react-papaparse";
import Evalgraph from "./evalgraph";
import NewEvalgraph from "./newEvalgraph";
//import "../covid19app.css";
import "./evaluation.css";
import { Form, Select, Row, Col, Radio, List, Avatar } from "antd";

//const fs = require('fs');
const summaryCSV_1 =
  "https://raw.githubusercontent.com/scc-usc/covid19-forecast-bench/master/evaluation/state_death_eval/summary_1_weeks_ahead_states.csv";
const summaryCSV_2 =
  "https://raw.githubusercontent.com/scc-usc/covid19-forecast-bench/master/evaluation/state_death_eval/summary_2_weeks_ahead_states.csv";
const summaryCSV_3 =
  "https://raw.githubusercontent.com/scc-usc/covid19-forecast-bench/master/evaluation/state_death_eval/summary_3_weeks_ahead_states.csv";
const summaryCSV_4 =
  "https://raw.githubusercontent.com/scc-usc/covid19-forecast-bench/master/evaluation/state_death_eval/summary_4_weeks_ahead_states.csv";
const summaryCSV = [summaryCSV_1, summaryCSV_2, summaryCSV_3, summaryCSV_4];
const { Option } = Select;

class Evaluation extends Component {
  constructor(props) {
    super(props);
    this.state = {
      models: this.props.models || [],
      modelList: [],
      //rmseSummary: [],
      maeSummary: [],
      mainGraphData: {},
      //averageRmse: [],
      averageMae: [],
      //recentRmse: [],
      recentMae: [],
      errorType: "mae",
      timeSpan: "4",
      lastDate: "",
    };
  }

  componentWillMount = () => {
    this.formRef = React.createRef();
    Papa.parse(summaryCSV[3], {
      download: true,
      header: true,
      skipEmptyLines: true,
      complete: this.initialize,
    });
  };

  initialize = result => {
    result.data.map((csvRow, index) => {
      for (const col in csvRow) {
        if (col === "" && csvRow[col] !== " ") {
          this.setState(state => {
            const modelList = state.modelList.concat(csvRow[col]);
            return {
              modelList,
            };
          });
        }
      }
    });

    this.updateData(result, () => {
      this.addModel("USC_SI_kJalpha");
    });
  };

  updateData = (result, func) => {
    // const rmseSummary = result.data.map((csvRow, index) => {
    //   const model = { id: "", data: [] };
    //   for (const col in csvRow) {
    //     if (col === "") {
    //       model.id = csvRow[col];
    //     } else if (col.indexOf("mean_sq_abs_error_") >= 0) {
    //       model.data.push({
    //         x: col.substring(18, col.length),
    //         y: parseInt(csvRow[col]),
    //       });
    //     }
    //   }
    //   return model;
    // });
    const maeSummary = result.data.map((csvRow, index) => {
      const model = { id: "", data: [] };
      for (const col in csvRow) {
        if (col === "") {
          model.id = csvRow[col];
        } else {
          model.data.push({
            x: col,
            y: parseInt(csvRow[col]),
          });
        }
      }
      return model;
    });

    // const averageRmse = rmseSummary.map((data, idx) => {
    //   const model = { name: "", value: "" };
    //   model.name = data.id;
    //   let filtered_data = data.data.filter(function (element) {
    //     return !isNaN(element.y) && element.y !== "";
    //   });
    //   filtered_data = filtered_data.map((element, idx) => {
    //     return element.y;
    //   });
    //   model.value =
    //     filtered_data.reduce(function (a, b) {
    //       return a + b;
    //     }) / filtered_data.length;

    //   return model;
    // });

    // averageRmse.sort(function (first, second) {
    //   return first.value - second.value;
    // });

    const averageMae = maeSummary.map((data, idx) => {
      const model = { name: "", value: "" };
      model.name = data.id;
      let filtered_data = data.data.filter(function (element) {
        return !isNaN(element.y) && element.y !== "";
      });
      filtered_data = filtered_data.map((element, idx) => {
        return element.y;
      });
      if (filtered_data.length === 0 || filtered_data === undefined)
      {
        model.value = NaN;
      }
      else
      {
        model.value = 
        filtered_data.reduce(function (a, b) {
          return a + b;
        }) / filtered_data.length;
      }
      return model;
    });

    averageMae.sort(function (first, second) {
      return first.value - second.value;
    });

    const lastDate = maeSummary[0].data[maeSummary[0].data.length - 1].x;

    // let recentRmse = rmseSummary.map((data, idx) => {
    //   const model = { name: "", value: "" };
    //   model.name = data.id;
    //   let recent = data.data.filter(element => {
    //     return element.x === lastDate;
    //   });
    //   model.value = recent[0].y;
    //   return model;
    // });
    // recentRmse = recentRmse.filter(element => {
    //   return !isNaN(element.value) && element.value !== "";
    // });

    // recentRmse.sort((first, second) => {
    //   return first.value - second.value;
    // });

    let recentMae = maeSummary.map((data, idx) => {
      const model = { name: "", value: "" };
      model.name = data.id;
      let recent = data.data.filter(element => {
        return element.x === lastDate;
      });
      model.value = recent[0].y;
      return model;
    });
    recentMae = recentMae.filter(element => {
      return !isNaN(element.value) && element.value !== "";
    });

    recentMae.sort((first, second) => {
      return first.value - second.value;
    });

    this.setState(
      {
        //rmseSummary: rmseSummary,
        maeSummary: maeSummary,
        //averageRmse: averageRmse,
        averageMae: averageMae,
        lastDate: lastDate,
        //recentRmse: recentRmse,
        recentMae: recentMae,
      },
      () => {
        this.reloadAll();
        if (typeof func === "function" && func()) {
          func();
        }
      }
    );
  };

  modelIsSelected = model => {
    if (this.state.models && model) {
      return this.state.models.includes(model);
    }
    return false;
  };

  addModel = model => {
    // const rmseData = this.state.rmseSummary.filter(data => data.id === model)[0]
    //   .data;
    const maeData = this.state.maeSummary.filter(data => data.id === model)[0]
      .data;
    const allData = {maeData: maeData };
    this.setState(
      prevState => ({
        models: [...prevState.models, model],
        mainGraphData: {
          ...prevState.mainGraphData,
          [model]: allData,
        },
      }),
      () => {
        this.formRef.current.setFieldsValue({
          models: this.state.models,
        });
      }
    );
  };

  removeModel = targetModel => {
    if (targetModel === " ")
    {
      return;
    }
    this.setState(prevState => {
      return {
        models: prevState.models.filter(model => model !== targetModel),
        mainGraphData: Object.keys(prevState.mainGraphData)
          .filter(model => model !== targetModel)
          .reduce((newMainGraphData, model) => {
            return {
              ...newMainGraphData,
              [model]: prevState.mainGraphData[model],
            };
          }, {}),
      };
    });
  };

  onValuesChange = (changedValues, allValues) => {
    const prevModels = this.state.models;
    const newModels = allValues.models;
    if (newModels && prevModels) {
      const modelsToAdd = newModels.filter(
        model => !prevModels.includes(model)
      );
      const modelsToRemove = prevModels.filter(
        model => !newModels.includes(model)
      );

      modelsToAdd.forEach(this.addModel);
      modelsToRemove.forEach(this.removeModel);
    }
  };

  reloadAll = () => {
    const prevModels = this.state.models;
    this.setState(
      {
        models: [],
        mainGraphData: {},
      },
      () => {
        prevModels.forEach(this.addModel);
      }
    );
  };

  handleErrorTypeSelect = e => {
    this.setState({
      errorType: e.target.value,
    });
  };

  handleTimeSpanSelect = e => {
    this.setState({
      timeSpan: e.target.value,
    });
    Papa.parse(summaryCSV[e.target.value - 1], {
      download: true,
      header: true,
      skipEmptyLines: true,
      complete: this.updateData,
    });
  };

  getAvatar(number) {
    let icon_src = "";
    switch (number) {
      case 1:
        icon_src = "https://img.icons8.com/officel/80/000000/medal2.png";
        break;
      case 2:
        icon_src =
          "https://img.icons8.com/officel/80/000000/medal-second-place.png";
        break;
      case 3:
        icon_src =
          "https://img.icons8.com/officel/80/000000/medal2-third-place.png";
        break;
      default:
        icon_src =
          "https://img.icons8.com/carbon-copy/100/000000/" +
          number +
          "-circle.png";
        break;
    }

    return <Avatar className="rank-number" src={icon_src} alt="" />;
  }

  render() {
    const {
      models,
      modelList,
      errorType,
      timeSpan,
      mainGraphData,
      lastDate,
      //averageRmse,
      averageMae,
      //recentRmse,
      recentMae,
    } = this.state;
    const modelOptions = modelList
      .filter(model => !this.modelIsSelected(model))
      .sort()
      .map(s => {
        return <Option key={s}> {s} </Option>;
      });
    //const chartData = this.parseData(mainGraphData, errorType);
    let runningAvgRankings = [];
    let recentRankings = [];
    // if (errorType === "rmse") {
    //   runningAvgRankings = averageRmse.map((ele, idx) => {
    //     const model = { model: {}, RMSE: "" };
    //     model.model.name = ele.name;
    //     model.RMSE = ele.value;
    //     return model;
    //   });
    //   recentRankings = recentRmse.map((ele, idx) => {
    //     const model = { model: {}, RMSE: "" };
    //     model.model.name = ele.name;
    //     model.RMSE = ele.value;
    //     return model;
    //   });
    // } else {
    //   runningAvgRankings = averageMae.map((ele, idx) => {
    //     const model = { model: {}, MAE: "" };
    //     model.model.name = ele.name;
    //     model.MAE = ele.value;
    //     return model;
    //   });
    //   recentRankings = recentMae.map((ele, idx) => {
    //     const model = { model: {}, MAE: "" };
    //     model.model.name = ele.name;
    //     model.MAE = ele.value;
    //     return model;
    //   });
    // }
    runningAvgRankings = averageMae.map((ele, idx) => {
        const model = { model: {}, MAE: "" };
        model.model.name = ele.name;
        model.MAE = ele.value;
        return model;
      });
      recentRankings = recentMae.map((ele, idx) => {
        const model = { model: {}, MAE: "" };
        model.model.name = ele.name;
        model.MAE = ele.value;
        return model;
    });
    runningAvgRankings = runningAvgRankings.slice(0, 9);
    recentRankings = recentRankings.slice(0, 9);

    const data = {
      jhu: {
        runningAvgRankings: runningAvgRankings,
        recentRankings: recentRankings,
      },
    };
    return (
      <div className="leader-page-wrapper">
        {/* <Row>
                        
                        <Col span={12}>
                            <h2 className="title">Running Average Performance</h2>
                            <List className="leaderboard"
                                itemLayout="horizontal"
                                dataSource={data.jhu.runningAvgRankings}
                                renderItem={item => (
                                    <List.Item>
                                        <List.Item.Meta
                                            avatar={this.getAvatar(data.jhu.runningAvgRankings.indexOf(item) + 1)}
                                            title = {item.model.name}
                                        />
                                        <div className="content">
                                            {errorType === "rmse" ? 
                                            <span>RMSE: <span className="score">{item.RMSE}</span></span>
                                            :
                                            <span>MAE: <span className="score">{item.MAE}</span></span>
                                            }
                                        </div>
                                    </List.Item>
                                )}
                            />
                        </Col>
                        <Col span={12}>
                            <h2 className="title">Recent Performance (from {`${lastDate.split("_")[0]} to ${lastDate.split("_")[1]}`})</h2>
                            <List className="leaderboard"
                                itemLayout="horizontal"
                                dataSource={data.jhu.recentRankings}
                                renderItem={item => (
                                    <List.Item>
                                        <List.Item.Meta
                                            avatar={this.getAvatar(data.jhu.recentRankings.indexOf(item) + 1)}
                                            title = {item.model.name}
                                        />
                                        <div className="content">
                                            {errorType === "rmse" ? 
                                            <span>RMSE: <span className="score">{item.RMSE}</span></span>
                                            :
                                            <span>MAE: <span className="score">{item.MAE}</span></span>
                                            }
                                        </div>
                                    </List.Item>
                                )}
                            />
                        </Col>
                    </Row>  */}
        <div className="evaluation-container">
          <Row type="flex" justify="space-around">
            <Col span={12}>
              <Form ref={this.formRef} onValuesChange={this.onValuesChange}>
                <Form.Item
                  label="Models"
                  name="models"
                  rules={[{ required: true, message: "Please select models!" }]}
                >
                  <Select
                    mode="multiple"
                    style={{ width: "100%" }}
                    placeholder="Select models"
                  >
                    {modelOptions}
                  </Select>
                </Form.Item>
              </Form>
              {/* <div className="radio-group">
                Error Type:&nbsp;&nbsp;
                <Radio.Group
                  value={errorType}
                  onChange={this.handleErrorTypeSelect}
                >
                  <Radio value="rmse">Root Mean Square Error</Radio>
                  <Radio value="mae">Mean Absolute Error</Radio>
                </Radio.Group>
              </div> */}
              <div className="radio-group">
                Prediction Time Span:&nbsp;&nbsp;
                <Radio.Group
                  value={timeSpan}
                  onChange={this.handleTimeSpanSelect}
                >
                  <Radio value="1">1-week-ahead</Radio>
                  <Radio value="2">2-week-ahead</Radio>
                  <Radio value="3">3-week-ahead</Radio>
                  <Radio value="4">4-week-ahead</Radio>
                </Radio.Group>
              </div>
            </Col>
          </Row>
          <Row>
            <Col span={24}>
              <div className="evalgraph-container">
                <NewEvalgraph
                  className="graph"
                  data={mainGraphData}
                  errorType={errorType}
                  models={models}
                />
              </div>
              {/* <Evalgraph className='graph' data={mainGraphData} errorType={errorType}/> */}
            </Col>
          </Row>
        </div>
      </div>
    );
  }
}

export default Evaluation;
