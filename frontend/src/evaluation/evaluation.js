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
      filter: "all",
      humanMethods: [],
      mlMethods: [],
      methodList: [],
      allMethods: [],
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
            const methodList = state.methodList.concat(csvRow[col]);
            return {
              methodList,
            };
          });
        }
      }
    });

    this.updateData(result, () => {
      this.addMethod("USC_SI_kJalpha");
    });
  };

  updateData = (result, func) => {
    let anchorDatapoints = { id: "", data: [] };
    const maeSummary = result.data.map((csvRow, index) => {
      const method = { id: "", data: [] };
      for (const col in csvRow) {
        if (col === "") {
          method.id = csvRow[col];
        } else {
          method.data.push({
            x: col,
            y: parseInt(csvRow[col]),
          });
        }
      }

      // If method id is an empty space, the data are empty anchor datapoints.
      if (method.id == " ") {
        anchorDatapoints = method;
      }
      return method;
    });

    this.setState(
      {
        maeSummary: maeSummary,
        mainGraphData: { anchorDatapoints }
      },
      () => {
        this.reloadAll();
        if (typeof func === "function" && func()) {
          func();
        }
      }
    );
  };

  methodIsSelected = method => {
    if (this.state.allMethods && method) {
      return this.state.allMethods.includes(method);
    }
    return false;
  };

  // Take methods staring with reich_ as human expert methods,
  // others as ML/AI methods.
  // filter will be either all/ml/human, and this function
  // will check if the method fits the filter.
  doesMethodFitFilter = (method, filter) => {
    if (filter === "ml") {
      return method.substring(0, 6) !== "reich_";
    } else if (filter === "human") {
      return method.substring(0, 6) === "reich_";
    }
    return true;
  }

  isMLMethod = method => {
    return this.doesMethodFitFilter(method, "ml");
  }

  addMethod = method => {
    const maeData = this.state.maeSummary.filter(data => data.id === method)[0]
      .data;
    const allData = { maeData: maeData };
    let humanMethods = this.state.humanMethods;
    let mlMethods = this.state.mlMethods;
    let allMethods = this.state.allMethods;

    if (!this.isMLMethod(method)) {
      humanMethods = [...humanMethods, method];
    } else {
      mlMethods = [...mlMethods, method];
    }
    allMethods = [...allMethods, method];

    this.setState(
      prevState => {
        return {
          humanMethods: humanMethods,
          mlMethods: mlMethods,
          allMethods: allMethods,
          mainGraphData: {
            ...prevState.mainGraphData,
            [method]: allData,
          },
        };
      },
      () => {
        this.formRef.current.setFieldsValue({
          methods: allMethods,
        });
      }
    );
  };

  removeMethod = targetMethod => {
    if (targetMethod === " ") {
      return;
    }
    let humanMethods = this.state.humanMethods;
    let mlMethods = this.state.mlMethods;
    let allMethods = this.state.allMethods;

    if (!this.isMLMethod(targetMethod)) {
      humanMethods = humanMethods.filter(method => method !== targetMethod);
    } else {
      mlMethods = mlMethods.filter(method => method !== targetMethod);
    }
    allMethods = allMethods.filter(method => method != targetMethod);

    this.setState(prevState => {
      return {
        humanMethods: humanMethods,
        mlMethods: mlMethods,
        allMethods: allMethods,
        mainGraphData: Object.keys(prevState.mainGraphData)
          .filter(method => method !== targetMethod)
          .reduce((newMainGraphData, method) => {
            return {
              ...newMainGraphData,
              [method]: prevState.mainGraphData[method],
            };
          }, {}),
      };
    });
  };

  onValuesChange = (changedValues, allValues) => {
    const prevMethods = this.state.allMethods;
    const newMethods = allValues.methods;
    if (newMethods && prevMethods) {
      const methodsToAdd = newMethods.filter(
        method => !prevMethods.includes(method)
      );
      const methodsToRemove = prevMethods.filter(
        method => !newMethods.includes(method)
      );

      methodsToAdd.forEach(this.addMethod);
      methodsToRemove.forEach(this.removeMethod);
    }
  };

  reloadAll = () => {
    const prevMethods = this.state.allMethods;
    this.setState(
      {
        humanMethods: [],
        mlMethods: [],
        allMethods: [],
      },
      () => {
        prevMethods.forEach(this.addMethod);
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

  handleFilterChange = e => {
    this.setState({
      filter: e.target.value
    });
  }

  render() {
    const {
      filter,
      humanMethods,
      mlMethods,
      allMethods,
      methodList,
      region,
      // errorType,
      timeSpan,
      mainGraphData,
    } = this.state;

    const methodOptions = methodList
      .filter(method => !this.methodIsSelected(method))
      .filter(method => this.doesMethodFitFilter(method, filter))
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
                {/* TODO: Add filter component and region select component
                into the form structure.  */}
                <div className="control-component">
                  Filter: &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                  <Radio.Group defaultValue="all" onChange={this.handleFilterChange}>
                    <Radio.Button value="all">All Methods</Radio.Button>
                    <Radio.Button value="ml">ML/AI Methods</Radio.Button>
                    <Radio.Button value="human">
                      Human Expert-Level Methods
                    </Radio.Button>
                  </Radio.Group>
                </div>
                <div className="control-component">
                  Region:&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
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
                  <Form.Item label="Methods" name="methods">
                    <Select
                      mode="multiple"
                      style={{ width: "100%" }}
                      placeholder="Select Methods"
                    >
                      {methodOptions}
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
                  mlMethods={mlMethods}
                  humanMethods={humanMethods}
                  allMethods={allMethods}
                  filter={filter}
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
