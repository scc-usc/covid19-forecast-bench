import React, { Component } from "react";
import Papa from "papaparse";
import EvalGraph from "./evalgraph";
import "../forecastbench.css";
import "./evaluation.css";
import summaryCSV from "./summary/summary_4_weeks_ahead_states.csv";

import {
    Form,
    Select,
    Row,
    Col,
    Radio,
    List,
    Avatar
  } from "antd";

const { Option } = Select;

// const data = {
//     jhu: {
// runningAvgRankings: [
//     {
//      model: {
//  name: "YYG_ParamSearch",
//  description: "Based on the SEIR model to make daily projections regarding COVID-19 infections and deaths in 50 US states. The model's contributor is Youyang Gu.",
//  link: "http://covid19-projections.com/about/"
// },
//  RMSE: 34.35
// },  {
//      model: {
//  name: "SIkJa_USC",
//  description: "This is our SI-kJalpha model.",
//  link: "https://scc-usc.github.io/ReCOVER-COVID-19/"
// },
//  RMSE: 35.41
// },  {
//      model: {
//  name: "UCLA_SuEIR",
//  description: "SEIR model by UCLA Statistical Machine Learning Lab.",
//  link: "https://covid19.uclaml.org/"
// },
//  RMSE: 52.53
// },  {
//      model: {
//  name: "Covid19Sim_Simulator",
//  description: "An interactive tool developed by researchers at Mass General Hospital, Harvard Medical School, Georgia Tech and Boston Medical Center.",
//  link: "https://covid19sim.org/"
// },
//  RMSE: 58.28
// },  {
//      model: {
//  name: "CU_select",
//  description: "A metapopulation county-level SEIR model by Columbia University.",
//  link: "https://blogs.cuit.columbia.edu/jls106/publications/covid-19-findings-simulations/"
// },
//  RMSE: 64.22
// },  {
//      model: {
//  name: "JHU_IDD_CovidSP",
//  description: "County-level metapopulation model by Johns Hopkins ID Dynamics COVID-19 Working Group.",
//  link: "https://github.com/HopkinsIDD/COVIDScenarioPipeline"
// },
//  RMSE: 72.68
// },  {
//      model: {
//  name: "IowaStateLW_STEM",
//  description: "A COVID19 forecast project led by Lily Wang in Iowa State University.",
//  link: "https://covid19.stat.iastate.edu"
// },
//  RMSE: 76.08
// },  {
//      model: {
//  name: "CovidActNow_SEIR_CAN",
//  description: "SEIR model by the CovidActNow research team.",
//  link: "https://covidactnow.org/"
// },
//  RMSE: 110.82
// },],
// recentRankings: [
//     {
//      model: {
//  name: "YYG_ParamSearch",
//  description: "Based on the SEIR model to make daily projections regarding COVID-19 infections and deaths in 50 US states. The model's contributor is Youyang Gu.",
//  link: "http://covid19-projections.com/about/"
// },
//  RMSE: 18.6
// },  {
//      model: {
//  name: "SIkJa_USC",
//  description: "This is our SI-kJalpha model.",
//  link: "https://scc-usc.github.io/ReCOVER-COVID-19/"
// },
//  RMSE: 20.03
// },  {
//      model: {
//  name: "Covid19Sim_Simulator",
//  description: "An interactive tool developed by researchers at Mass General Hospital, Harvard Medical School, Georgia Tech and Boston Medical Center.",
//  link: "https://covid19sim.org/"
// },
//  RMSE: 20.58
// },  {
//      model: {
//  name: "JHU_IDD_CovidSP",
//  description: "County-level metapopulation model by Johns Hopkins ID Dynamics COVID-19 Working Group.",
//  link: "https://github.com/HopkinsIDD/COVIDScenarioPipeline"
// },
//  RMSE: 24.22
// },  {
//      model: {
//  name: "UCLA_SuEIR",
//  description: "SEIR model by UCLA Statistical Machine Learning Lab.",
//  link: "https://covid19.uclaml.org/"
// },
//  RMSE: 24.6
// },  {
//      model: {
//  name: "CU_select",
//  description: "A metapopulation county-level SEIR model by Columbia University.",
//  link: "https://blogs.cuit.columbia.edu/jls106/publications/covid-19-findings-simulations/"
// },
//  RMSE: 40.24
// },  {
//      model: {
//  name: "IowaStateLW_STEM",
//  description: "A COVID19 forecast project led by Lily Wang in Iowa State University.",
//  link: "https://covid19.stat.iastate.edu"
// },
//  RMSE: 40.41
// },  {
//      model: {
//  name: "CovidActNow_SEIR_CAN",
//  description: "SEIR model by the CovidActNow research team.",
//  link: "https://covidactnow.org/"
// },
//  RMSE: NaN
// },]
//     }
// };

//import percentCSV from "./summary/summary_4_weeks_ahead_us.csv";
class Evaluation extends Component {

    constructor(props) {
        super(props);
        this.state = {
            models: this.props.models || [],
            modelList: [],
            rmseSummary: [],
            maeSummary: [],
            mainGraphData: {},
            errorType: "rmse"
           // percentSummary: []
        };
    }

    componentDidMount = () => {
        this.formRef = React.createRef();
        Papa.parse(summaryCSV, {
            header: true,
            download: true,
            skipEmptyLines: true,
            complete: this.updateData
        });
        // Papa.parse(percentCSV, {
        //     header: true,
        //     download: true,
        //     skipEmptyLines: true,
        //     complete: this.parsePercentData
        // })
    }

    updateData = (result) => {
        const rmseSummary = result.data.map((csvRow, index) => {
            const model = {id: "", data: []};
            for (const col in csvRow) {
                if (col === "") {
                    model.id = csvRow[col];
                    this.setState(state => {
                        const modelList = state.modelList.concat(csvRow[col]);
                        return {
                            modelList,
                        };
                    });
                } else if (col.indexOf("mean_sq_abs_error_") >= 0) {
                    model.data.push({
                        x: col.substring(18, col.length),
                        y: Math.sqrt(parseInt(csvRow[col]))
                    });
                }
            }
            return model;
        });

        const maeSummary = result.data.map((csvRow, index) => {
            const model = {id: "", data: []};
            for (const col in csvRow) {
                if (col === "") {
                    model.id = csvRow[col];
                } else if (col.indexOf("mean_abs_error_") >= 0) {
                    model.data.push({
                        x: col.substring(15, col.length),
                        y: parseInt(csvRow[col])
                    });
                }
            }
            return model;
        });

        this.setState({
            rmseSummary: rmseSummary,
            maeSummary: maeSummary,
        }, ()=>{
            this.addModel('USC-SI_kJalpha');
        });
    }

    modelIsSelected = (model)=>{
        if (this.state.models && model) {
          return this.state.models.includes(model);
        }
        return false;
    }

    addModel = (model)=>{
        const rmseData = this.state.rmseSummary.filter(data => data.id === model)[0].data;
        const maeData = this.state.maeSummary.filter(data => data.id === model)[0].data;
        const allData = {rmseData:rmseData, maeData:maeData};
        this.setState(
            prevState => ({
              models: [...prevState.models, model],
              mainGraphData: {
                ...prevState.mainGraphData,
                [model]: allData
            }
            }),() => {
                this.formRef.current.setFieldsValue({
                    models: this.state.models
                });
            });
    }

    removeModel = (targetModel)=>{
        this.setState(prevState =>{
            return {
                models: prevState.models.filter(model => model !== targetModel),
                mainGraphData: Object.keys(prevState.mainGraphData)
                .filter(model => model !== targetModel)
                .reduce((newMainGraphData, model) => {
                  return {
                    ...newMainGraphData,
                    [model]: prevState.mainGraphData[model]
                  };
                }, {})
            }
        }
        );
    }

    onValuesChange = (changedValues, allValues)=>{
        const prevModels = this.state.models;
        const newModels = allValues.models;
        if (newModels && prevModels)
        {
            const modelsToAdd = newModels.filter(
            model => !prevModels.includes(model)
            );
            const modelsToRemove = prevModels.filter(
            model => !newModels.includes(model)
            );

            modelsToAdd.forEach(this.addModel);
            modelsToRemove.forEach(this.removeModel);
        }
    }

    handleErrorTypeSelect = e =>{
        this.setState({
            errorType: e.target.value
        });
    }

    // getAvatar(number) {
    //     let icon_src = "";
    //     switch (number) {
    //         case 1:
    //             icon_src = "https://img.icons8.com/officel/80/000000/medal2.png";
    //             break;
    //         case 2:
    //             icon_src = "https://img.icons8.com/officel/80/000000/medal-second-place.png";
    //             break;
    //         case 3:
    //             icon_src = "https://img.icons8.com/officel/80/000000/medal2-third-place.png";
    //             break;
    //         default:
    //             icon_src = "https://img.icons8.com/carbon-copy/100/000000/" + number + "-circle.png";
    //             break;
    //     }

    //     return <Avatar className="rank-number" src={icon_src} alt="" />;

    // };


    render() {
        const {
            rmseSummary,
            maeSummary,
            modelList,
            errorType,
            mainGraphData
            // percentSummary
        } = this.state;
        //console.log(mainGraphData);
        const modelOptions = modelList
        .filter(model => !this.modelIsSelected(model))
        .sort()
        .map(s => {
        return <Option key={s}> {s} </Option>;
        });

        return(
            <div className='eval-page-wrapper'>
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
                                            title={<a className="model-name" href={item.model.link}>{item.model.name}</a>}
                                            description={item.model.description}
                                        />
                                        <div className="content">
                                            <span>RMSE: <span className="score">{item.RMSE}</span></span>
                                        </div>
                                    </List.Item>
                                )}
                            />
                        </Col>
                        <Col span={12}>
                            <h2 className="title">Recent Performance (from 2020-09-20)</h2>
                            <List className="leaderboard"
                                itemLayout="horizontal"
                                dataSource={data.jhu.recentRankings}
                                renderItem={item => (
                                    <List.Item>
                                        <List.Item.Meta
                                            avatar={this.getAvatar(data.jhu.recentRankings.indexOf(item) + 1)}
                                            title={<a className="model-name" href={item.model.link}>{item.model.name}</a>}
                                            description={item.model.description}
                                        />
                                        <div className="content">
                                            <span>RMSE: <span className="score">{item.RMSE}</span></span>
                                        </div>
                                    </List.Item>
                                )}
                            />
                        </Col>
                    </Row>  */}
            <div className="graph-container">
                <Row type="flex" justify="space-around">
                    <Col span={10}>
                        <Form
                            ref={this.formRef}
                            onValuesChange={this.onValuesChange}
                        >
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
                        <div className="radio-group">Error Type:&nbsp;&nbsp;
                            <Radio.Group
                                value={errorType}
                                onChange={this.handleErrorTypeSelect}>
                                <Radio value="rmse">Root Mean Square Error</Radio>
                                <Radio value="mae">Mean Absolute Error</Radio>
                            </Radio.Group>
                        </div>
                    </Col>
                </Row>
                <Row>
                    <Col span={24}>
                        <div className="eval-graph-container">
                            <EvalGraph className="graph" data={mainGraphData} errorType={errorType} />
                        </div>

                    </Col>
                </Row>
            </div>
            </div>
        );
    }
}

export default Evaluation;