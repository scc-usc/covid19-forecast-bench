import React, { Component } from "react";
import 'semantic-ui-css/semantic.min.css';
import "./forecastbench.css";
import {HashRouter, Route, Redirect, Switch} from 'react-router-dom'; 
import Evaluation from "./evaluation/evaluation";
import HomePage from "./homepage/homepage";
import Submit from "./submit/submit";
import Navbar from "./navbar/navbar";

class ForecastBench extends Component {
  constructor(props){
    super(props);
    this.state = {
      redirectHome: false,
      redirectSubmit: false,
      redirectEvaluation: false,
    }
  }

  redirectHome = ()=>{
    this.setState({
      redirectHome: true,
      redirectSubmit: false,
      redirectEvaluation: false,
    });
  }

  redirectSubmit = ()=>{
    this.setState({
      redirectHome: false,
      redirectSubmit: true,
      redirectEvaluation: false,
    });
  }

  redirectEvaluation = ()=>{
    this.setState({
      redirectHome: false,
      redirectSubmit: false,
      redirectEvaluation: true,
    });
  }

  render() {
    const {redirectHome, redirectSubmit, redirectEvaluation} = this.state;
    return (
      <HashRouter basename="/">
        {redirectHome?<Redirect to="/"/>:null}
        {redirectSubmit?<Redirect to="/about"/>:null}
        {redirectEvaluation?<Redirect to="/evaluation"/>:null}
        <Navbar redirectHome = {this.redirectHome}
                redirectSubmit = {this.redirectSubmit}
                redirectEvaluation = {this.redirectEvaluation}
        />
        <Switch>
          <Route exact path='/'
            render={(props) => <HomePage {...props} />}/>
          <Route exact path='/submit'
            render={(props) => <Submit {...props} />} />
          <Route exact path='/evaluation'
            render={(props) => <Evaluation {...props} />}/>
        </Switch>
      </HashRouter>
    );
  }
}

export default ForecastBench;
