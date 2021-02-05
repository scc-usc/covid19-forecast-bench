import React, { Component } from "react";
import { Link } from "react-router-dom"; 
import "./homepage.css";
import "../forecastbench.css";
import "../w3.css";

class HomePage extends Component {

	render() {
		return (
			
			<div class="w3-content">

			<div class="mySlides w3-display-container w3-center">

			<div class ="w3-opacity">
			<img src="https://raw.githubusercontent.com/scc-usc/covid19-forecast-bench/master/frontend/images/example_plot.PNG" height="300" width="100%"/>
			</div>

			<div class="w3-display-bottommiddle w3-container w3-padding-32">
			<p class="w3-xxlarge w3-center w3-text-black"><b>COVID-19 Forecasting Benchmark</b></p>
			<p class="w3-black w3-text-white w3-large"><b>Pushing the limits of AI/ML in epidemic forecasting</b></p>   
			</div>
			
			</div>

			<br/>
			<div class = "w3-sand w3-sans-serif w3-large">
			<p class="w3-justify">
			The COVID-19 Forecasting Benchmark aims to provide an evaluation platform to AI/ML researchers interested in epidemic forecasting.
			Submit your own forecasts and find out where you stand compared to other AI/ML based forecasts and expert COVID-19 forecasts.
			</p>
			
			<div class = "w3-center">
			
			<Link to="/evaluation" className="w3-btn w3-blue">Check Evaluations</Link>{'	'}
			<Link to="/submit" className="w3-btn w3-blue">Start a Submission</Link>

			</div>

			

			<br/><br/>
			<p class="w3-justify">
			With the help of the AI/ML community, we wish to find the answers the following questions.
			</p>
			<ul >
			<li> Which epidemic forecasting methods perform the best? </li>
			<li> Can AI/ML based epidemic forecasting methods wihtout human intervention outperform human tuned methods? </li>
			<li> What methodology decisions work best and when? </li>
			<li> What are the appropriate ways of evaluating epidemic forecasts? </li>
			</ul>
			
			<br/>
			<p>
			For details, please read our <a href="https://drive.google.com/file/d/1ljd03CvjXAJkBHD5r1RKZcwCFeeLJ_me/view?usp=sharing" target="_blank"> paper </a> accepted at The 5th International Workshop on Health Intelligence in conjunction with The Thirty-Fifth AAAI Conference on Artificial Intelligence (AAAI-21).
			</p>

			</div>

			</div>
			);
		}
	}

	export default HomePage;