import React, { Component } from "react";
import 'semantic-ui-css/semantic.min.css';
import "./forecastbench.css";
import {HashRouter, Route, Redirect, Switch} from 'react-router-dom'; 
import Evaluation from "./evaluation/evaluation";
import HomePage from "./homepage/homepage";
import AboutUS from "./aboutus/aboutus";
import Navbar from "./navbar/navbar";

class ForecastBench extends Component {
  constructor(props){
    super(props);
    this.state = {
      redirectHome: false,
      redirectAbout: false,
      redirectEvaluation: false,
    }
  }

  redirectHome = ()=>{
    this.setState({
      redirectHome: true,
      redirectAbout: false,
      redirectEvaluation: false,
    });
  }

  redirectAbout = ()=>{
    this.setState({
      redirectHome: false,
      redirectAbout: true,
      redirectEvaluation: false,
    });
  }

  redirectEvaluation = ()=>{
    this.setState({
      redirectHome: false,
      redirectAbout: false,
      redirectEvaluation: true,
    });
  }

  render() {
    const {redirectHome, redirectAbout, redirectEvaluation} = this.state;
    return (
      <HashRouter basename="/">
        {redirectHome?<Redirect to="/"/>:null}
        {redirectAbout?<Redirect to="/about"/>:null}
        {redirectEvaluation?<Redirect to="/evaluation"/>:null}
        <Navbar redirectHome = {this.redirectHome}
                redirectAbout = {this.redirectAbout}
                redirectEvaluation = {this.redirectEvaluation}
        />
        <Switch>
          <Route exact path='/'
            render={(props) => <HomePage {...props} />}/>
          <Route exact path='/about'
            render={(props) => <AboutUS {...props} />} />
          <Route exact path='/evaluation'
            render={(props) => <Evaluation {...props} />}/>
        </Switch>
      </HashRouter>
    );
  }
}

export default ForecastBench;
