import React, { Component } from "react";
import Papa from "papaparse";
import { readRemoteFile } from "react-papaparse";
import Evalgraph from "./evalgraph";
import Evalmap from "./evalmap";
import "./evaluation.css";
import { Form, Select, Row, Col, Radio, List, Avatar } from "antd";
import FormItem from "antd/lib/form/FormItem";
import ReactGA from "react-ga";

const { Option } = Select;

const US_STATES = [
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

// TODO: Since we only have limited number of ML/AI methods, they are hardcoded here.
// Later we got to fetch this file from a file/online source.
const ML_MODELS = [
  "UMich_RidgeTfReg",
  "SIkJaun10_hyper7",
  "ensemble_SIkJa_RF",
  "SIkJaun1_window_noval",
  "SIkJaun1_hyper7_smooth7",
  "SIkJaun1_hyper7",
  "SIkJaun10_window_noval",
  "SIkJaun10_hyper7_smooth7",
];

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
      maeSummary: [],
      mainGraphData: {},
      metrics: "MAE",
      metricsList: ["MAE", "Percentage", "RMSE"],
      forecastType: "incDeath",
      timeSpan: "4",
      lastDate: "",
    };
  }

  componentDidMount() {    
      ReactGA.initialize('UA-186385643-2');
      ReactGA.pageview('/covid19-forecast-bench/evaluation');
    }


  componentWillMount = () => {
    this.formRef = React.createRef();
    Papa.parse(
      `https://raw.githubusercontent.com/scc-usc/covid19-forecast-bench/master/evaluation/state_death_eval/summary_${this.state.timeSpan}_weeks_ahead_${this.state.region}.csv`,
      {
        download: true,
        worker: true,
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
      this.addMethod("ensemble_SIkJa_RF");
      this.addMethod("reich_COVIDhub_ensemble");
    });
  };

  updateData = (result, func) => {
    let anchorDatapoints = { maeData: [] };
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
        anchorDatapoints.maeData = method.data;
      }
      return method;
    });

    this.setState(
      {
        maeSummary: maeSummary,
        mainGraphData: { anchorDatapoints },
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

  doesMethodFitFilter = (method, filter) => {
    if (filter === "ml") {
      return ML_MODELS.includes(method);
    } else if (filter === "human") {
      return !ML_MODELS.includes(method);
    }
    return true;
  };

  isMLMethod = method => {
    return this.doesMethodFitFilter(method, "ml");
  };

  addMethod = method => {
    const maeData = this.state.maeSummary.filter(data => data.id === method)[0]
      .data;
    const allData = { maeData: maeData };

    this.setState(
      prevState => {
        return {
          humanMethods: this.isMLMethod(method)
            ? prevState.humanMethods
            : [...prevState.humanMethods, method],
          mlMethods: !this.isMLMethod(method)
            ? prevState.mlMethods
            : [...prevState.mlMethods, method],
          allMethods: [...prevState.allMethods, method],
          mainGraphData: {
            ...prevState.mainGraphData,
            [method]: allData,
          },
        };
      },
      () => {
        this.formRef.current.setFieldsValue({
          methods: this.state.allMethods,
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
    Papa.parse(
      `https://raw.githubusercontent.com/scc-usc/covid19-forecast-bench/master/evaluation/state_death_eval/summary_${e.target.value}_weeks_ahead_${this.state.region}.csv`,
      {
        download: true,
        worker: true,
        header: true,
        skipEmptyLines: true,
        complete: this.updateData,
      }
    );
  };

  handleRegionChange = newRegion => {
    this.setState(
      {
        region: newRegion,
      },
      () => {
        Papa.parse(
          `https://raw.githubusercontent.com/scc-usc/covid19-forecast-bench/master/evaluation/state_death_eval/summary_${this.state.timeSpan}_weeks_ahead_${this.state.region}.csv`,
          {
            download: true,
            header: true,
            worker: true,
            skipEmptyLines: true,
            complete: this.updateData,
          }
        );

        this.formRef.current.setFieldsValue({
          region: this.state.region,
        });
      }
    );
  };

  handleFilterChange = e => {
    this.setState({
      filter: e.target.value,
    });
  };

  render() {
    const {
      filter,
      humanMethods,
      mlMethods,
      allMethods,
      methodList,
      region,
      metrics,
      metricsList,
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

    const formLayout = {
      labelCol: { span: 6 },
      wrapperCol: { span: 18 },
    };

    const regionOptions = [];
    regionOptions.push(
      <Option value="states" key="0">
        US Average
      </Option>
    );
    US_STATES.forEach((state, index) => {
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
                <Form
                  {...formLayout}
                  ref={this.formRef}
                  onValuesChange={this.onValuesChange}
                >
                  <Form.Item label="Filter" name="filter">
                    <Radio.Group
                      defaultValue="all"
                      onChange={this.handleFilterChange}
                    >
                      <Radio.Button value="all">All Methods</Radio.Button>
                      <Radio.Button value="ml">ML/AI Methods</Radio.Button>
                      <Radio.Button value="human">
                        Human-Expert Methods
                      </Radio.Button>
                    </Radio.Group>
                  </Form.Item>
                  <Form.Item label="Region" name="region">
                    <Select
                      showSearch
                      placeholder="Select a region"
                      defaultValue="states"
                      value={region}
                      onChange={this.handleRegionChange}
                    >
                      {regionOptions}
                    </Select>
                  </Form.Item>
                  <Form.Item label="Methods" name="methods">
                    <Select mode="multiple" placeholder="Select Methods">
                      {methodOptions}
                    </Select>
                  </Form.Item>
                  {/* TODO: The metrics options have not been implemented. */}
                  <Form.Item label="Metrics" name="metrics">
                    <Select showSearch defaultValue="MAE">
                      {metricsList.map((m, idx) => (
                        <Option value={m} key={idx}>
                          {m}
                        </Option>
                      ))}
                    </Select>
                  </Form.Item>
                  {/* TODO: The metrics options have not been implemented. */}
                  <Form.Item label="Forecast Type" name="forecastType">
                    <Select showSearch defaultValue="incDeath">
                      <Option value="incDeath">
                        COVID-19 death US state-level death forecasts
                      </Option>
                      <Option value="incCase">
                        COVID-19 death US state-level case forecasts
                      </Option>
                    </Select>
                  </Form.Item>
                  <Form.Item label="Prediction Time Span" name="timeSpan">
                    <Radio.Group
                      value={timeSpan}
                      defaultValue={"4"}
                      onChange={this.handleTimeSpanSelect}
                    >
                      <Radio value="1">1-week-ahead</Radio>
                      <Radio value="2">2-week-ahead</Radio>
                      <Radio value="3">3-week-ahead</Radio>
                      <Radio value="4">4-week-ahead</Radio>
                    </Radio.Group>
                  </Form.Item>
                </Form>
              </Col>
             
            </Row>
          </div>
          <Row type="flex" justify="space-around">
             
              <div className="evalmap-container">
                <Evalmap
                  clickHandler={this.handleRegionChange}
                  region={region}
                />
              </div>
              
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
              
          </Row>
           
              
        </div>
      </div>
    );
  }
}

export default Evaluation;
