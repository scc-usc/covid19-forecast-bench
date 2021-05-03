import React, { Component } from "react";
import Papa from "papaparse";
import { readRemoteFile } from "react-papaparse";
import Evalgraph from "./evalgraph";
import Evalmap from "./evalmap";
import RankingTable from "./rankingTable";
import "./evaluation.css";
import { Form, Select, Row, Col, Radio, Slider } from "antd";
import FormItem from "antd/lib/form/FormItem";
import ReactGA from "react-ga";

const { Option } = Select;

const FORECAST_BENCH_SCOPE = ["US-COVID", "EU-COVID"];

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

const EU_REGIONS = [
  "Belgium",
  "Bulgaria",
  "Czechia",
  "Denmark",
  "Germany",
  "Estonia",
  "Ireland",
  "Greece",
  "Spain",
  "France",
  "Croatia",
  "Italy",
  "Cyprus",
  "Latvia",
  "Lithuania",
  "Luxembourg",
  "Hungary",
  "Malta",
  "Netherlands",
  "Austria",
  "Poland",
  "Portugal",
  "Romania",
  "Slovenia",
  "Slovakia",
  "Finland",
  "Sweden",
  "United Kingdom",
  "Iceland",
  "Liechtenstein",
  "Norway",
  "Switzerland",
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
  "SIkJaun_Ensemble_NN",
];

class Evaluation extends Component {
  constructor(props) {
    super(props);
    this.state = {
      scope: "US-COVID",
      region: "states",
      filter: "all",
      humanMethods: [],
      mlMethods: [],
      methodList: [],
      allMethods: [],
      csvData: [],
      mainGraphData: {},
      rankingTableData: [],
      metrics: "mae",
      metricsList: ["mae", "mape"],
      forecastType: "state_death_eval",
      timeSpan: "avg",
      maxDateRange: [],
      selectedDateRange: [],
    };
  }

  componentDidMount() {
    ReactGA.initialize("UA-186385643-2");
    ReactGA.pageview("/covid19-forecast-bench/evaluation");
  }

  componentWillMount = () => {
    this.formRef = React.createRef();
    Papa.parse(this.getUrl(), {
      download: true,
      worker: true,
      header: true,
      skipEmptyLines: true,
      complete: this.initialize,
    });
  };

  getUrl = () => {
    let url =
      "https://raw.githubusercontent.com/scc-usc/covid19-forecast-bench/master/evaluation/US-COVID/state_death_eval/mae_avg_states.csv";
    if (this.state.timeSpan == "avg") {
      url = `https://raw.githubusercontent.com/scc-usc/covid19-forecast-bench/master/evaluation/${this.state.scope}/${this.state.forecastType}/${this.state.metrics}_avg_${this.state.region}.csv`;
    } else {
      url = `https://raw.githubusercontent.com/scc-usc/covid19-forecast-bench/master/evaluation/${this.state.scope}/${this.state.forecastType}/${this.state.metrics}_${this.state.timeSpan}_weeks_ahead_${this.state.region}.csv`;
    }
    return url;
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
      // Initialize data range.
      this.setState(
        {
          selectedDateRange: ["2020-08-01", "2021-02-27"],
        },
        () => {
          this.generateRanking();
          this.formRef.current.setFieldsValue({
            dateRange: [0, 30],
          });
        }
      );
      this.addMethod("ensemble_SIkJa_RF");
      this.addMethod("FH_COVIDhub_ensemble");
    });
  };

  updateData = (result, func) => {
    if (!result) {
      return;
    }
    let maxDateRange = ["2020-08-01", undefined];
    if (this.state.scope === "EU-COVID") {
      maxDateRange[0] = "2021-03-13";
    }
    let anchorDatapoints = { maeData: [], dataSeries: [] };

    // Update the date range by reading the column names.
    for (const date in result.data[0]) {
      if (!maxDateRange[1]) {
        maxDateRange[1] = date;
      }
      if (date > maxDateRange[1]) {
        maxDateRange[1] = date;
      }
    }

    for (const d in result.data[0]) {
      if (d != "") {
        anchorDatapoints.dataSeries.push({
          x: d,
          y: 0,
        });
      }
    }

    const csvData = result.data
      .map((csvRow, index) => {
        const method = { id: "", data: [] };
        let allNaN = true;
        for (const col in csvRow) {
          if (col === "") {
            method.id = csvRow[col];
          } else {
            const val = parseFloat(csvRow[col]);
            if (!isNaN(val)) {
              allNaN = false;
            }
            method.data.push({
              x: col,
              y: val,
            });
          }
        }
        if (!allNaN) {
          return method;
        }
      })
      .filter(method => method); // Filter out methods that are all NaN.

    this.setState(
      {
        csvData: csvData,
        mainGraphData: { anchorDatapoints },
        maxDateRange: maxDateRange,
        methodList: csvData.map(method => method.id),
      },
      () => {
        this.reloadAll();
        if (typeof func === "function" && func()) {
          func();
        }
      }
    );
  };

  generateRanking = () => {
    const selectedDateRange = this.state.selectedDateRange;
    const maxDateRange = this.state.maxDateRange;
    // First filter out the covid hub baseline MAE average.
    let baseline;
    if (this.state.scope === "US-COVID") {
      baseline = this.state.csvData.filter(
        method => method.id === "FH_COVIDhub_baseline"
      )[0];
    } else {
      baseline = this.state.csvData.filter(
        method => method.id === "EUFH_LANL_GrowthRate"
      )[0];
    }

    let baselineAverageError = 0;
    baselineAverageError = baseline.data[baseline.data.length - 1].y;

    const rankingTableData = this.state.csvData
      .map(method => {
        const methodName = method.id;
        const methodType = this.isMLMethod(methodName)
          ? "ML/AI"
          : "Human-Expert";
        let forecastCount = 0;
        let ErrorSum = 0;
        let relativeErrorSum = 0; // Sum of method_MAE/baseline_MAE
        let fromSelectedStartDate = false;
        let upToSelectedEndDate = false;
        let updating = false;
        method.data.forEach((dp, idx) => {
          if (
            !isNaN(dp.y) &&
            dp.x >= selectedDateRange[0] &&
            dp.x <= selectedDateRange[1]
          ) {
            ErrorSum += dp.y;
            relativeErrorSum += dp.y / baselineAverageError;
            forecastCount++;
          }
          if (!isNaN(dp.y) && dp.x == selectedDateRange[0]) {
            fromSelectedStartDate = true;
          }
          if (!isNaN(dp.y) && dp.x == selectedDateRange[1]) {
            upToSelectedEndDate = true;
          }
          if (!isNaN(dp.y) && dp.x == maxDateRange[1]) {
            updating = true;
          }
        });
        if (forecastCount === 0) {
          return null;
        }
        const fitWithinDateRange = fromSelectedStartDate && upToSelectedEndDate;
        const averageError = (ErrorSum / forecastCount).toFixed(2);
        let relativeError = relativeErrorSum / forecastCount;
        relativeError = relativeError.toFixed(3);
        return {
          methodName,
          methodType,
          averageError,
          relativeError,
          forecastCount,
          fitWithinDateRange,
          updating,
        };
      })
      .filter(entry => entry && entry.forecastCount); // Filter out methods without any forecasts.

    this.setState({
      rankingTableData: rankingTableData,
    });
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
    if (this.methodIsSelected(method)) {
      return;
    }
    const methodDataSeries = this.state.csvData.filter(
      data => data.id === method
    )[0].data;
    const methodGraphData = { dataSeries: methodDataSeries };

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
            [method]: methodGraphData,
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

  handleForecastTypeSelect = type => {
    const prevScope = this.state.scope;
    const scope = type.substring(0, 2) === "eu" ? "EU-COVID" : "US-COVID";

    if (scope != prevScope) {
      const defaultRegion = type.substring(0, 2) === "eu" ? "EU" : "states";
      this.setState(
        {
          scope: scope,
          forecastType: type,
          region: defaultRegion,
          humanMethods: [],
          mlMethods: [],
          allMethods: [],
        },
        () => {
          this.formRef.current.setFieldsValue({
            region: defaultRegion,
            methods: [],
            dateRange: [0, 100],
          });
          Papa.parse(this.getUrl(), {
            download: true,
            worker: true,
            header: true,
            skipEmptyLines: true,
            complete: result => {
              this.updateData(result, () => {
                if (this.state.scope === "US-COVID") {
                  this.addMethod("ensemble_SIkJa_RF");
                  this.addMethod("FH_COVIDhub_ensemble");
                } else {
                  this.addMethod("EUFH_LANL_GrowthRate");
                  this.addMethod("USC_SIkJalpha");
                }
              });
              this.setState({ selectedDateRange: this.state.maxDateRange });
              this.generateRanking();
            },
          });
        }
      );
    } else {
      this.setState(
        {
          scope: scope,
          forecastType: type,
        },
        () => {
          Papa.parse(this.getUrl(), {
            download: true,
            worker: true,
            header: true,
            skipEmptyLines: true,
            complete: result => {
              this.updateData(result, this.generateRanking);
            },
          });
        }
      );
    }
  };

  handleErrorTypeSelect = e => {
    this.setState({
      errorType: e.target.value,
    });
  };

  handleTimeSpanSelect = e => {
    this.setState(
      {
        timeSpan: e.target.value,
      },
      () => {
        Papa.parse(this.getUrl(), {
          download: true,
          worker: true,
          header: true,
          skipEmptyLines: true,
          complete: result => {
            this.updateData(result, this.generateRanking);
          },
        });
      }
    );
  };

  handleRegionChange = newRegion => {
    this.setState(
      {
        region: newRegion,
      },
      () => {
        Papa.parse(this.getUrl(), {
          download: true,
          header: true,
          worker: true,
          skipEmptyLines: true,
          complete: result => {
            this.updateData(result, this.generateRanking);
          },
        });

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

  getTotalNumberOfWeeks = () => {
    const MS_PER_WEEK = 1000 * 60 * 60 * 24 * 7;
    const start = new Date(this.state.maxDateRange[0]);
    const end = new Date(this.state.maxDateRange[1]);
    return (end - start) / MS_PER_WEEK;
  };

  getDateFromWeekNumber = weekNum => {
    // WeekNum is the number of weeks since the maxDateRange[0].
    if (this.state.maxDateRange[0]) {
      const date = new Date(this.state.maxDateRange[0]);
      date.setDate(date.getDate() + 7 * weekNum);
      date.setTime(date.getTime() + 4 * 60 * 60 * 1000);
      return date.toISOString().slice(0, 10);
    }
    return null;
  };

  handleDateRangeChange = e => {
    const start = this.getDateFromWeekNumber(e[0]);
    const end = this.getDateFromWeekNumber(e[1]);
    this.setState(
      {
        selectedDateRange: [start, end],
      },
      () => {
        this.generateRanking();
      }
    );
  };

  handleMetricsChange = metrics => {
    this.setState(
      {
        metrics: metrics,
      },
      () => {
        Papa.parse(this.getUrl(), {
          download: true,
          worker: true,
          header: true,
          skipEmptyLines: true,
          complete: result => {
            this.updateData(result, this.generateRanking);
            console.log(this.state.csvData);
          },
        });
      }
    );
  };

  render() {
    const {
      scope,
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
      rankingTableData,
      maxDateRange,
      selectedDateRange,
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

    const evalMap =
      scope === "US-COVID" ? (
        <div className="evalmap-container">
          <Evalmap clickHandler={this.handleRegionChange} region={region} />
        </div>
      ) : null;

    const regionOptions = [];
    if (scope === "US-COVID") {
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
    } else {
      regionOptions.push(
        <Option value="EU" key="0">
          EU Average
        </Option>
      );
      EU_REGIONS.forEach((region, index) => {
        regionOptions.push(
          <Option value={region.replace(" ", "%20")} key={index + 1}>
            {region}
          </Option>
        );
      });
    }

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
                  <Form.Item label="Forecast Type" name="forecastType">
                    <Select
                      showSearch
                      defaultValue="state_death_eval"
                      onChange={this.handleForecastTypeSelect}
                    >
                      <Option value="state_death_eval">
                        COVID-19 US state-level death forecasts
                      </Option>
                      <Option value="state_case_eval">
                        COVID-19 US state-level case forecasts
                      </Option>
                      <Option value="eu_death_eval">
                        COVID-19 Europe country-level death forecasts
                      </Option>
                      <Option value="eu_case_eval">
                        COVID-19 Europe country-level case forecasts
                      </Option>
                    </Select>
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

                  <Form.Item label="Highlight" name="filter">
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

                  <Form.Item label="Methods" name="methods">
                    <Select mode="multiple" placeholder="Select Methods">
                      {methodOptions}
                    </Select>
                  </Form.Item>
                  <Form.Item label="Metrics" name="metrics">
                    <Select
                      showSearch
                      defaultValue="mae"
                      onChange={this.handleMetricsChange}
                    >
                      <Option value="mae">MAE</Option>
                      <Option value="mape">MAPE</Option>
                    </Select>
                  </Form.Item>

                  <Form.Item label="Prediction Time Span" name="timeSpan">
                    <Radio.Group
                      value={timeSpan}
                      defaultValue={"avg"}
                      onChange={this.handleTimeSpanSelect}
                    >
                      <Radio value="avg">Average over 4 weeks</Radio>
                      <Radio value="1">1 week ahead</Radio>
                      <Radio value="2">2 week ahead</Radio>
                      <Radio value="3">3 week ahead</Radio>
                      <Radio value="4">4 week ahead</Radio>
                    </Radio.Group>
                  </Form.Item>
                  <Form.Item label="Prediction Date Range" name="dateRange">
                    <Slider
                      range
                      tooltipVisible
                      tooltipPlacement="bottom"
                      max={this.getTotalNumberOfWeeks()}
                      tipFormatter={this.getDateFromWeekNumber}
                      onAfterChange={this.handleDateRangeChange}
                    />
                  </Form.Item>
                </Form>
              </Col>
            </Row>
          </div>
          <Row type="flex" justify="space-around">
            {evalMap}
            <div className="evalgraph-container">
              <Evalgraph
                className="graph"
                data={mainGraphData}
                mlMethods={mlMethods}
                humanMethods={humanMethods}
                allMethods={allMethods}
                filter={filter}
                metrics={metrics}
                dateRange={selectedDateRange}
              />
            </div>
          </Row>
          <Row type="flex" justify="space-around">
            <div className="ranking-table-container">
              <RankingTable
                data={rankingTableData}
                addMethod={this.addMethod}
                metrics={metrics}
              />
            </div>
          </Row>
        </div>
      </div>
    );
  }
}

export default Evaluation;
