import React, { Component } from "react";
import Papa from "papaparse";
import { readRemoteFile } from "react-papaparse";
import Evalgraph from "./evalgraph";
import Evalmap from "./evalmap";
import "./evaluation.css";
import { Form, Select, Row, Col, Radio, List, Avatar } from "antd";

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
      region: "states",
      models: this.props.models || [],
      modelList: [],
      //rmseSummary: [],
      maeSummary: [],
      mainGraphData: {},
      errorType: "mae",
      timeSpan: "4",
      lastDate: "",
    };
  }

  componentWillMount = () => {
    this.formRef = React.createRef();
    Papa.parse(
      `https://raw.githubusercontent.com/scc-usc/covid19-forecast-bench/master/evaluation/state_death_eval/summary_${this.state.timeSpan}_weeks_ahead_${this.state.region}.csv`,
      {
        download: true,
        header: true,
        skipEmptyLines: true,
        complete: this.initialize,
      }
    );
  };

  initialize = result => {
    result.data.map((csvRow, index) => {
      for (const col in csvRow) {
        if (col === "" && csvRow[col] !== " ") {
          this.setState(state => {
            const modelList = state.modelList
              .concat(csvRow[col])
              .filter(model => model != "reich_AIpert_pwllnod");
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

    this.setState(
      {
        maeSummary: maeSummary,
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
    const maeData = this.state.maeSummary.filter(data => data.id === model)[0]
      .data;
    const allData = { maeData: maeData };
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
    if (targetModel === " ") {
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
    console.log(this.state);
    Papa.parse(
      `https://raw.githubusercontent.com/scc-usc/covid19-forecast-bench/master/evaluation/state_death_eval/summary_${e.target.value}_weeks_ahead_${this.state.region}.csv`,
      {
        download: true,
        header: true,
        skipEmptyLines: true,
        complete: this.updateData,
      }
    );
  };

  handleRegionChange = newRegion => {
    this.setState({
      region: newRegion,
    });
    Papa.parse(
      `https://raw.githubusercontent.com/scc-usc/covid19-forecast-bench/master/evaluation/state_death_eval/summary_${this.state.timeSpan}_weeks_ahead_${newRegion}.csv`,
      {
        download: true,
        header: true,
        skipEmptyLines: true,
        complete: this.updateData,
      }
    );
  };

  render() {
    const {
      models,
      modelList,
      region,
      // errorType,
      timeSpan,
      mainGraphData,
    } = this.state;
    const modelOptions = modelList
      .filter(model => !this.modelIsSelected(model))
      .sort()
      .map(s => {
        return <Option key={s}> {s} </Option>;
      });

    const US_states = [
      "Washington",
      "Illinois",
      "California",
      "Arizona",
      "Massachusetts",
      "Wisconsin",
      "Texas",
      "Nebraska",
      "Utah",
      "Oregon",
      "Florida",
      "New York",
      "Rhode Island",
      "Georgia",
      "New Hampshire",
      "North Carolina",
      "New Jersey",
      "Colorado",
      "Maryland",
      "Nevada",
      "Tennessee",
      "Hawai",
      "Indiana",
      "Kentucky",
      "Minnesota",
      "Oklahoma",
      "Pennsylvania",
      "South Carolina",
      "District of Columbia",
      "Kansas",
      "Missouri",
      "Vermont",
      "Virginia",
      "Connecticut",
      "Iowa",
      "Louisiana",
      "Ohio",
      "Michigan",
      "South Dakota",
      "Arkansas",
      "Delaware",
      "Mississippi",
      "New Mexico",
      "North Dakota",
      "Wyoming",
      "Alaska",
      "Maine",
      "Alabama",
      "Idaho",
      "Montana",
      "Puerto Rico",
      "Virgin Islands",
      "Guam",
      "West Virginia",
      "Northern Mariana Islands",
      "American Samoa",
    ];

    const regionOptions = [];
    regionOptions.push(
      <Option value="states" key="0">
        US Average
      </Option>
    );
    US_states.forEach((state, index) => {
      regionOptions.push(
        <Option value={state.replace(" ", "%20")} key={index + 1}>
          {state}
        </Option>
      );
    });

    return (
      <div className="leader-page-wrapper">
        <div className="evaluation-container">
          <div className="control-container">
            <Row type="flex" justify="space-around">
              <Col span={12}>
                <div className="region-select-group">
                  Region:&nbsp;&nbsp;&nbsp;
                  <Select
                    showSearch
                    style={{ width: 200 }}
                    placeholder="Select a region"
                    optionFilterProp="children"
                    defaultValue="states"
                    value={region}
                    onChange={this.handleRegionChange}
                  >
                    {regionOptions}
                  </Select>
                </div>
                <Form ref={this.formRef} onValuesChange={this.onValuesChange}>
                  <Form.Item label="Models" name="models">
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
          </div>
          <Row>
            <Col span={8}>
              <div className="evalmap-container">
                <Evalmap
                  clickHandler={this.handleRegionChange}
                  region={region}
                />
              </div>
            </Col>
            <Col span={16}>
              <div className="evalgraph-container">
                <Evalgraph
                  className="graph"
                  data={mainGraphData}
                  models={models}
                />
              </div>
            </Col>
          </Row>
        </div>
      </div>
    );
  }
}

export default Evaluation;
