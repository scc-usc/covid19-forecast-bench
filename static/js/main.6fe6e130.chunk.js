(this.webpackJsonpfrontend=this.webpackJsonpfrontend||[]).push([[0],{170:function(e,t,a){},253:function(e,t,a){},299:function(e,t,a){},304:function(e,t){},306:function(e,t){},421:function(e,t,a){},425:function(e,t,a){},461:function(e,t,a){},463:function(e,t,a){},464:function(e,t,a){},469:function(e,t,a){"use strict";a.r(t);var n=a(3),i=a(0),s=a.n(i),r=a(40),c=a.n(r),o=(a(299),a(58)),l=a(78),d=a(79),h=a(87),u=a(86),b=(a(300),a(170),a(131)),f=a(26),j=a(124),m=a(167),p=a(166),O=a.n(p),g=(a(301),a(485)),x=a(500),v=a(502),M=a(492),w=a(496),y=a(495),k=a(503),S=a(497),I=["#ffeebb44","#adeecf44","#ffe9d644","#fbbedf44","#cbbcb144","#ffd5cd44","#bedbbb44","#9ba4b444","#51adcf44","#f8efd444","#ffcbcb44","#99f3bd44","#d6e0f044","#fbe2e544"],A=["#ef4f4f","#74c7b8","#ff7b54","#ffb26b","#ffd56b","#939b62","#ec4646","#663f3f","#51c2d5","#bee5d3","#d6b0b1","#d6b0b1","#8b5e83","#3b5360","#111d5e","#c70039","#ee9595","#f37121","#350b40","#af0069"],C=function(e,t,a,i,s,r){e.forEach((function(e,c){if(s[e]){var o=r[c%r.length],l={data:{stroke:o,strokeWidth:1},parent:{border:"1px solid #ccc"}},d={data:{fill:o},labels:{fill:o}},h=[{fill:o,fontSize:5,fontFamily:"sans-serif",fontWeight:"bold"},{fill:"#aaa",fontSize:5,fontFamily:"sans-serif"},{fill:"#aaa",fontSize:5,fontFamily:"sans-serif"}],u=s[e].maeData.filter((function(e){return e.y}));i.push({name:e,symbol:{fill:o}}),t.push(Object(n.jsx)(g.a,{data:u,style:l,interpolation:"linear"},c)),a.push(Object(n.jsx)(x.a,{data:u,style:d,size:1.5,labels:function(t){var a=t.datum;return[e,"End date: ".concat(a.x.substring(11,21)),"MAE: ".concat(a.y)]},labelComponent:Object(n.jsx)(v.a,{cornerRadius:0,flyoutStyle:{fill:"white",stroke:"#ccc",strokeWidth:.5},flyoutHeight:20,style:h,dx:-36,dy:20})},c))}}))},N=function(e){var t=e.data,a=e.mlMethods,i=e.humanMethods,s=e.allMethods,r=e.filter,c=[],o=[],l=[];return t.anchorDatapoints&&c.push(Object(n.jsx)(g.a,{style:{data:{stroke:"#ffffff"}},data:t.anchorDatapoints.maeData})),t&&("human"===r?(C(a,c,o,l,t,I),C(i,c,o,l,t,A)):"ml"===r?(C(i,c,o,l,t,I),C(a,c,o,l,t,A)):C(s,c,o,l,t,A)),o.push(Object(n.jsx)(x.a,{style:{data:{fill:"#ffffff"}},size:0,data:[{x:"x",y:200}]})),Object(n.jsx)("div",{children:Object(n.jsxs)(M.a,{containerComponent:Object(n.jsx)(w.a,{}),theme:y.a.material,padding:{top:2,bottom:40,left:40,right:60},height:180,children:[c,o,Object(n.jsx)(k.a,{tickCount:8,tickFormat:function(e){return"string"===typeof e?e.substring(11,21):e},label:"Forecast End Date",style:{tickLabels:{fontSize:6,padding:10,angle:25},axisLabel:{fontSize:6,padding:2}}}),Object(n.jsx)(k.a,{dependentAxis:!0,label:"MAE",style:{tickLabels:{fontSize:6,padding:1},axisLabel:{fontSize:6,padding:20}}}),Object(n.jsx)(S.a,{data:l,style:{labels:{fontSize:4}},x:290,y:0})]})})},D=(a(421),a(200)),_=a.n(D),L={AL:"Alabama",AK:"Alaska",AZ:"Arizona",AR:"Arkansas",CA:"California",CO:"Colorado",CT:"Connecticut",DE:"Delaware",FL:"Florida",GA:"Georgia",HI:"Hawaii",ID:"Idaho",IL:"Illinois",IN:"Indiana",IA:"Iowa",KS:"Kansas",KY:"Kentucky",LA:"Louisiana",ME:"Maine",MD:"Maryland",MA:"Massachusetts",MI:"Michigan",MN:"Minnesota",MS:"Mississippi",MO:"Missouri",MT:"Montana",NE:"Nebraska",NV:"Nevada",NH:"New Hampshire",NJ:"New Jersey",NM:"New Mexico",NY:"New York",NC:"North Carolina",ND:"North Dakota",OH:"Ohio",OK:"Oklahoma",OR:"Oregon",PA:"Pennsylvania",RI:"Rhode Island",SC:"South Carolina",SD:"South Dakota",TN:"Tennessee",TX:"Texas",UT:"Utah",VT:"Vermont",VA:"Virginia",WA:"Washington",WV:"West Virginia",WI:"Wisconsin",WY:"Wyoming"},T={Alabama:"AL",Alaska:"AK",Arizona:"AZ",Arkansas:"AR",California:"CA",Colorado:"CO",Connecticut:"CT",Delaware:"DE",Florida:"FL",Georgia:"GA",Hawaii:"HI",Idaho:"ID",Illinois:"IL",Indiana:"IN",Iowa:"IA",Kansas:"KS",Kentucky:"KY",Louisiana:"LA",Maine:"ME",Maryland:"MD",Massachusetts:"MA",Michigan:"MI",Minnesota:"MN",Mississippi:"MS",Missouri:"MO",Montana:"MT",Nebraska:"NE",Nevada:"NV","New Hampshire":"NH","New Jersey":"NJ","New Mexico":"NM","New York":"NY","North Carolina":"NC","North Dakota":"ND",Ohio:"OH",Oklahoma:"OK",Oregon:"OR",Pennsylvania:"PA","Rhode Island":"RI","South Carolina":"SC","South Dakota":"SD",Tennessee:"TN",Texas:"TX",Utah:"UT",Vermont:"VT",Virginia:"VA",Washington:"WA","West Virginia":"WV",Wisconsin:"WI",Wyoming:"WY"},E=function(e){var t=e.clickHandler,a=e.region,i=function(e){t(L[e.target.dataset.name])},s=Object(n.jsx)(_.a,{onClick:i,defaultFill:"#c05555",width:"400",height:"350"});if("states"!==a){var r={};r[T[a]]={fill:"#c05555"},s=Object(n.jsx)(_.a,{onClick:i,customize:r,width:"400",height:"350"})}return Object(n.jsx)("div",{children:s})},F=(a(425),a(490)),V=a(483),R=a(484),W=a(487),H=a(493),G=a(72),z=F.a.Option,J=["Washington","Illinois","California","Arizona","Massachusetts","Wisconsin","Texas","Nebraska","Utah","Oregon","Florida","New York","Rhode Island","Georgia","New Hampshire","North Carolina","New Jersey","Colorado","Maryland","Nevada","Tennessee","Hawai","Indiana","Kentucky","Minnesota","Oklahoma","Pennsylvania","South Carolina","District of Columbia","Kansas","Missouri","Vermont","Virginia","Connecticut","Iowa","Louisiana","Ohio","Michigan","South Dakota","Arkansas","Delaware","Mississippi","New Mexico","North Dakota","Wyoming","Alaska","Maine","Alabama","Idaho","Montana","Puerto Rico","Virgin Islands","Guam","West Virginia","Northern Mariana Islands","American Samoa"],P=["UMich_RidgeTfReg","SIkJaun10_hyper7","ensemble_SIkJa_RF","SIkJaun1_window_noval","SIkJaun1_hyper7_smooth7","SIkJaun1_hyper7","SIkJaun10_window_noval","SIkJaun10_hyper7_smooth7"],K=function(e){Object(h.a)(a,e);var t=Object(u.a)(a);function a(e){var n;return Object(l.a)(this,a),(n=t.call(this,e)).componentWillMount=function(){n.formRef=s.a.createRef(),O.a.parse("https://raw.githubusercontent.com/scc-usc/covid19-forecast-bench/master/evaluation/state_death_eval/summary_".concat(n.state.timeSpan,"_weeks_ahead_").concat(n.state.region,".csv"),{download:!0,worker:!0,header:!0,skipEmptyLines:!0,complete:n.initialize})},n.initialize=function(e){e.data.map((function(e,t){var a=function(t){""===t&&" "!==e[t]&&n.setState((function(a){return{methodList:a.methodList.concat(e[t])}}))};for(var i in e)a(i)})),n.updateData(e,(function(){n.addMethod("ensemble_SIkJa_RF"),n.addMethod("reich_COVIDhub_ensemble")}))},n.updateData=function(e,t){var a={maeData:[]},i=e.data.map((function(e,t){var n={id:"",data:[]};for(var i in e)""===i?n.id=e[i]:n.data.push({x:i,y:parseInt(e[i])});return" "==n.id&&(a.maeData=n.data),n}));n.setState({maeSummary:i,mainGraphData:{anchorDatapoints:a}},(function(){n.reloadAll(),"function"===typeof t&&t()&&t()}))},n.methodIsSelected=function(e){return!(!n.state.allMethods||!e)&&n.state.allMethods.includes(e)},n.doesMethodFitFilter=function(e,t){return"ml"===t?P.includes(e):"human"!==t||!P.includes(e)},n.isMLMethod=function(e){return n.doesMethodFitFilter(e,"ml")},n.addMethod=function(e){var t={maeData:n.state.maeSummary.filter((function(t){return t.id===e}))[0].data};n.setState((function(a){return{humanMethods:n.isMLMethod(e)?a.humanMethods:[].concat(Object(m.a)(a.humanMethods),[e]),mlMethods:n.isMLMethod(e)?[].concat(Object(m.a)(a.mlMethods),[e]):a.mlMethods,allMethods:[].concat(Object(m.a)(a.allMethods),[e]),mainGraphData:Object(o.a)(Object(o.a)({},a.mainGraphData),{},Object(j.a)({},e,t))}}),(function(){n.formRef.current.setFieldsValue({methods:n.state.allMethods})}))},n.removeMethod=function(e){if(" "!==e){var t=n.state.humanMethods,a=n.state.mlMethods,i=n.state.allMethods;n.isMLMethod(e)?a=a.filter((function(t){return t!==e})):t=t.filter((function(t){return t!==e})),i=i.filter((function(t){return t!=e})),n.setState((function(n){return{humanMethods:t,mlMethods:a,allMethods:i,mainGraphData:Object.keys(n.mainGraphData).filter((function(t){return t!==e})).reduce((function(e,t){return Object(o.a)(Object(o.a)({},e),{},Object(j.a)({},t,n.mainGraphData[t]))}),{})}}))}},n.onValuesChange=function(e,t){var a=n.state.allMethods,i=t.methods;if(i&&a){var s=i.filter((function(e){return!a.includes(e)})),r=a.filter((function(e){return!i.includes(e)}));s.forEach(n.addMethod),r.forEach(n.removeMethod)}},n.reloadAll=function(){var e=n.state.allMethods;n.setState({humanMethods:[],mlMethods:[],allMethods:[]},(function(){e.forEach(n.addMethod)}))},n.handleErrorTypeSelect=function(e){n.setState({errorType:e.target.value})},n.handleTimeSpanSelect=function(e){n.setState({timeSpan:e.target.value}),O.a.parse("https://raw.githubusercontent.com/scc-usc/covid19-forecast-bench/master/evaluation/state_death_eval/summary_".concat(e.target.value,"_weeks_ahead_").concat(n.state.region,".csv"),{download:!0,worker:!0,header:!0,skipEmptyLines:!0,complete:n.updateData})},n.handleRegionChange=function(e){n.setState({region:e},(function(){O.a.parse("https://raw.githubusercontent.com/scc-usc/covid19-forecast-bench/master/evaluation/state_death_eval/summary_".concat(n.state.timeSpan,"_weeks_ahead_").concat(n.state.region,".csv"),{download:!0,header:!0,worker:!0,skipEmptyLines:!0,complete:n.updateData}),n.formRef.current.setFieldsValue({region:n.state.region})}))},n.handleFilterChange=function(e){n.setState({filter:e.target.value})},n.state={region:"states",filter:"all",humanMethods:[],mlMethods:[],methodList:[],allMethods:[],maeSummary:[],mainGraphData:{},metrics:"MAE",metricsList:["MAE","MAPE (coming soon)","RMSE (coming soon)"],forecastType:"incDeath",timeSpan:"4",lastDate:""},n}return Object(d.a)(a,[{key:"componentDidMount",value:function(){G.a.initialize("UA-186385643-2"),G.a.pageview("/covid19-forecast-bench/evaluation")}},{key:"render",value:function(){var e=this,t=this.state,a=t.filter,i=t.humanMethods,s=t.mlMethods,r=t.allMethods,c=t.methodList,l=t.region,d=(t.metrics,t.metricsList),h=t.timeSpan,u=t.mainGraphData,b=c.filter((function(t){return!e.methodIsSelected(t)})).filter((function(t){return e.doesMethodFitFilter(t,a)})).sort().map((function(e){return Object(n.jsxs)(z,{children:[" ",e," "]},e)})),f=[];return f.push(Object(n.jsx)(z,{value:"states",children:"US Average"},"0")),J.forEach((function(e,t){f.push(Object(n.jsx)(z,{value:e.replace(" ","%20"),children:e},t+1))})),Object(n.jsx)("div",{className:"leader-page-wrapper",children:Object(n.jsxs)("div",{className:"evaluation-container",children:[Object(n.jsx)("div",{className:"control-container",children:Object(n.jsx)(V.a,{type:"flex",justify:"space-around",children:Object(n.jsx)(R.a,{span:12,children:Object(n.jsxs)(W.a,Object(o.a)(Object(o.a)({},{labelCol:{span:6},wrapperCol:{span:18}}),{},{ref:this.formRef,onValuesChange:this.onValuesChange,children:[Object(n.jsx)(W.a.Item,{label:"Forecast Type",name:"forecastType",children:Object(n.jsxs)(F.a,{showSearch:!0,defaultValue:"incDeath",children:[Object(n.jsx)(z,{value:"incDeath",children:"COVID-19 US state-level death forecasts"}),Object(n.jsx)(z,{value:"incCase",children:"COVID-19 US state-level case forecasts (coming soon)"})]})}),Object(n.jsx)(W.a.Item,{label:"Region",name:"region",children:Object(n.jsx)(F.a,{showSearch:!0,placeholder:"Select a region",defaultValue:"states",value:l,onChange:this.handleRegionChange,children:f})}),Object(n.jsx)(W.a.Item,{label:"Highlight",name:"filter",children:Object(n.jsxs)(H.a.Group,{defaultValue:"all",onChange:this.handleFilterChange,children:[Object(n.jsx)(H.a.Button,{value:"all",children:"All Methods"}),Object(n.jsx)(H.a.Button,{value:"ml",children:"ML/AI Methods"}),Object(n.jsx)(H.a.Button,{value:"human",children:"Human-Expert Methods"})]})}),Object(n.jsx)(W.a.Item,{label:"Methods",name:"methods",children:Object(n.jsx)(F.a,{mode:"multiple",placeholder:"Select Methods",children:b})}),Object(n.jsx)(W.a.Item,{label:"Metrics",name:"metrics",children:Object(n.jsx)(F.a,{showSearch:!0,defaultValue:"MAE",children:d.map((function(e,t){return Object(n.jsx)(z,{value:e,children:e},t)}))})}),Object(n.jsx)(W.a.Item,{label:"Prediction Time Span",name:"timeSpan",children:Object(n.jsxs)(H.a.Group,{value:h,defaultValue:"4",onChange:this.handleTimeSpanSelect,children:[Object(n.jsx)(H.a,{value:"1",children:"1-week-ahead"}),Object(n.jsx)(H.a,{value:"2",children:"2-week-ahead"}),Object(n.jsx)(H.a,{value:"3",children:"3-week-ahead"}),Object(n.jsx)(H.a,{value:"4",children:"4-week-ahead"})]})})]}))})})}),Object(n.jsxs)(V.a,{type:"flex",justify:"space-around",children:[Object(n.jsx)("div",{className:"evalmap-container",children:Object(n.jsx)(E,{clickHandler:this.handleRegionChange,region:l})}),Object(n.jsx)("div",{className:"evalgraph-container",children:Object(n.jsx)(N,{className:"graph",data:u,mlMethods:s,humanMethods:i,allMethods:r,filter:a})})]})]})})}}]),a}(i.Component),U=(a(461),a(253),function(e){Object(h.a)(a,e);var t=Object(u.a)(a);function a(){return Object(l.a)(this,a),t.apply(this,arguments)}return Object(d.a)(a,[{key:"componentDidMount",value:function(){G.a.initialize("UA-186385643-2"),G.a.pageview("/covid19-forecast-bench/home")}},{key:"render",value:function(){return Object(n.jsxs)("div",{class:"w3-content",children:[Object(n.jsxs)("div",{class:"mySlides w3-display-container w3-center",children:[Object(n.jsx)("div",{class:"w3-opacity",children:Object(n.jsx)("img",{src:"https://raw.githubusercontent.com/scc-usc/covid19-forecast-bench/master/frontend/images/example_plot.PNG",height:"300",width:"100%"})}),Object(n.jsxs)("div",{class:"w3-display-bottommiddle w3-container w3-padding-32",children:[Object(n.jsx)("p",{class:"w3-xxlarge w3-center w3-text-black",children:Object(n.jsx)("b",{children:"COVID-19 Forecasting Benchmark"})}),Object(n.jsx)("p",{class:"w3-black w3-text-white w3-large",children:Object(n.jsx)("b",{children:"Pushing the limits of AI/ML in epidemic forecasting"})})]})]}),Object(n.jsx)("br",{}),Object(n.jsxs)("div",{class:"w3-sand w3-sans-serif w3-large",children:[Object(n.jsx)("p",{class:"w3-justify",children:"The COVID-19 Forecasting Benchmark aims to provide an evaluation platform to AI/ML researchers interested in epidemic forecasting. Submit your own forecasts and find out where you stand compared to other AI/ML based forecasts and expert COVID-19 forecasts."}),Object(n.jsxs)("div",{class:"w3-center",children:[Object(n.jsx)(b.b,{to:"/evaluation",className:"w3-btn w3-blue",children:"Check Evaluations"}),"\t",Object(n.jsx)(b.b,{to:"/submit",className:"w3-btn w3-blue",children:"Start a Submission"})]}),Object(n.jsx)("br",{}),Object(n.jsx)("br",{}),Object(n.jsx)("p",{class:"w3-justify",children:"With the help of the AI/ML community, we wish to find the answers to the following questions."}),Object(n.jsxs)("ul",{children:[Object(n.jsx)("li",{children:" Which epidemic forecasting methods perform the best? "}),Object(n.jsx)("li",{children:" Can AI/ML based epidemic forecasting methods wihtout human intervention outperform human tuned methods? "}),Object(n.jsx)("li",{children:" What methodology decisions work best and when? "}),Object(n.jsx)("li",{children:" What are the appropriate ways of evaluating epidemic forecasts? "})]}),Object(n.jsx)("br",{}),Object(n.jsxs)("p",{children:["For details, please read our ",Object(n.jsx)("a",{href:"https://drive.google.com/file/d/1ljd03CvjXAJkBHD5r1RKZcwCFeeLJ_me/view?usp=sharing",target:"_blank",children:" paper "})," accepted at The 5th International Workshop on Health Intelligence in conjunction with The Thirty-Fifth AAAI Conference on Artificial Intelligence (AAAI-21)."]})]}),Object(n.jsx)("br",{}),Object(n.jsx)("p",{children:"Contact: ajiteshs[AT]usc[DOT]edu"})]})}}]),a}(i.Component)),Y=(a(463),function(e){Object(h.a)(a,e);var t=Object(u.a)(a);function a(){return Object(l.a)(this,a),t.apply(this,arguments)}return Object(d.a)(a,[{key:"componentDidMount",value:function(){G.a.initialize("UA-186385643-2"),G.a.pageview("/covid19-forecast-bench/submit")}},{key:"render",value:function(){return Object(n.jsx)("div",{class:"w3-content",children:Object(n.jsxs)("div",{class:"w3-sand w3-sans-serif w3-large",children:[Object(n.jsx)("h1",{children:"Submitting your Forecasts"}),Object(n.jsx)("p",{children:"We invite the interested teams to submit forecasts generated by their methodology by issuing a pull request."}),Object(n.jsxs)("ul",{class:"w3-ul",children:[Object(n.jsxs)("li",{children:[" ",Object(n.jsx)("b",{children:" Data to use"}),": While generating retrospective forecasts, please ensure that you are only using data that was available before then. Our Github repo provides the ",Object(n.jsx)("a",{href:"https://github.com/scc-usc/covid19-forecast-bench/tree/master/historical-data",target:"_blank",children:" version of case and death data available on previous days "}),'. The method should treat them as "separate datasets" without any knowledge of the date of the data, i.e., the method should be consistent irrespective of the date.',Object(n.jsx)("div",{class:"w3-center",children:Object(n.jsx)("img",{src:"https://raw.githubusercontent.com/scc-usc/covid19-forecast-bench/master/frontend/images/forecast-generation.png",width:"80%"})}),"You may use the historical versions of the JHU data available at ",Object(n.jsx)("a",{href:" https://github.com/scc-usc/ReCOVER-COVID-19/blob/master/results/historical_forecasts",target:"_blank",children:" our other repo in time-series format"}),'. Other data sources may be used as long as you can guarantee that no "foresight" was used.']}),Object(n.jsxs)("li",{children:[" ",Object(n.jsx)("b",{children:" Submission format "}),":The format of the file should be exactly like the ",Object(n.jsx)("a",{href:"https://github.com/reichlab/covid19-forecast-hub/blob/master/data-processed/README.md#forecast-file-format",target:"_blank",children:" submissions for Reich Lab's forecast hub"}),". Please follow the naming convention: [Date of forecast (YYYY-MM-DD)]-[Method_Name].csv. "]}),Object(n.jsxs)("li",{children:[" ",Object(n.jsx)("b",{children:" Forecast dates "}),": We will take the retrospective forecasts for any range of time, starting in July until the present. "]}),Object(n.jsxs)("li",{children:[" ",Object(n.jsx)("b",{children:" Forecast locations "}),": Currently, we are only accepting case and death forecasts for US state, county, and national-level and national-level for other countries. More locations will be addressed in the future. "]}),Object(n.jsxs)("li",{children:[" ",Object(n.jsx)("b",{children:" Forecast horizon"}),": The forecasts are expected to be incident cases forecasts per week observed on a Sunday for 1, 2, 3, and 4-week ahead. One week ahead forecast geenrated after a Monday is to be treated as the Sunday after the next one. This is in accordance with the Reich Lab's forecasting hub. "]}),Object(n.jsxs)("li",{children:[" ",Object(n.jsx)("b",{children:" Where to upload files "}),': Please add your files in the folder "raw-forecasts/" in your fork of',Object(n.jsx)("a",{href:"https://github.com/scc-usc/covid19-forecast-bench",target:"_blank",children:" our repo "})," and submit a pull request. It can be done directly using your browser, cloning the repo is not needed:",Object(n.jsx)("div",{class:"w3-center",children:Object(n.jsx)("img",{src:"https://raw.githubusercontent.com/scc-usc/covid19-forecast-bench/master/frontend/images/pull-request.PNG",width:"100%"})})]}),Object(n.jsxs)("li",{children:[" ",Object(n.jsx)("b",{children:" Methodology Description"}),": In a file named metadata-[Method Name].csv, please provide a short description of your approach, mentioning at least the following:",Object(n.jsxs)("ul",{children:[Object(n.jsx)("li",{children:" Modeling technique: Generative (SIR, SEIR, ...), Discriminative (Neural Networks, ARIMA, ...), ... "}),Object(n.jsx)("li",{children:" Learning approach: Bayesian, Regression (Quadratic Programming, Gradient Descent, ...), ... "}),Object(n.jsx)("li",{children:" Pre-processing: Smoothing (1 week, 2, week, auto), anomaly detection, ... "})]})]}),Object(n.jsxs)("li",{children:[" ",Object(n.jsx)("b",{children:"Submitting forecasts from multiple methodologies"}),": If you are submitting forecasts for multiple methodolgies, please ensure there is something in their metadata descriptions that differentiates them. Please note that any change in your approach, including data pre-processing and hand-tuning a parameter counts as a different methodology. You can alter your method name to mark the distinction such as by appending an appropriate suffix. "]}),Object(n.jsxs)("li",{children:[" ",Object(n.jsx)("b",{children:"License"}),": We encourage you to make your submission under ",Object(n.jsx)("a",{href:"https://opensource.org/licenses/MIT",target:"_blank",children:" the opensource MIT license"}),". "]})]}),Object(n.jsx)("br",{})]})})}}]),a}(i.Component)),B=(a(464),a(465),a(486)),q=a(489),X=function(){return Object(n.jsxs)(B.a,{collapseOnSelect:!0,expand:"lg",className:"navbar-header navbar-light",children:[Object(n.jsx)(B.a.Brand,{href:"#/",children:Object(n.jsx)("img",{className:"logo",src:"https://identity.usc.edu/files/2011/12/combo_gold_white_cardinal.png",alt:"USC"})}),Object(n.jsx)(B.a.Toggle,{"aria-controls":"responsive-navbar-nav"}),Object(n.jsxs)(B.a.Collapse,{id:"responsive-navbar-nav",children:[Object(n.jsxs)(q.a,{className:"mr-auto",children:[Object(n.jsx)(q.a.Link,{className:"navbar-link",href:"#/",children:"Home"}),Object(n.jsx)(q.a.Link,{className:"navbar-link",href:"#evaluation",children:"Evaluation"}),Object(n.jsx)(q.a.Link,{className:"navbar-link",href:"#submit",children:"Submit"}),Object(n.jsx)(q.a.Link,{className:"navbar-link-highlight",href:"https://github.com/scc-usc/covid19-forecast-bench",target:"_blank",children:"Github"})]}),Object(n.jsx)(q.a,{})]})]})},Z=function(e){Object(h.a)(a,e);var t=Object(u.a)(a);function a(e){var n;return Object(l.a)(this,a),(n=t.call(this,e)).redirectHome=function(){n.setState({redirectHome:!0,redirectSubmit:!1,redirectEvaluation:!1})},n.redirectSubmit=function(){n.setState({redirectHome:!1,redirectSubmit:!0,redirectEvaluation:!1})},n.redirectEvaluation=function(){n.setState({redirectHome:!1,redirectSubmit:!1,redirectEvaluation:!0})},n.state={redirectHome:!1,redirectSubmit:!1,redirectEvaluation:!1},n}return Object(d.a)(a,[{key:"render",value:function(){var e=this.state,t=e.redirectHome,a=e.redirectSubmit,i=e.redirectEvaluation;return Object(n.jsxs)(b.a,{basename:"/",children:[t?Object(n.jsx)(f.a,{to:"/"}):null,a?Object(n.jsx)(f.a,{to:"/about"}):null,i?Object(n.jsx)(f.a,{to:"/evaluation"}):null,Object(n.jsx)(X,{redirectHome:this.redirectHome,redirectSubmit:this.redirectSubmit,redirectEvaluation:this.redirectEvaluation}),Object(n.jsxs)(f.d,{children:[Object(n.jsx)(f.b,{exact:!0,path:"/",render:function(e){return Object(n.jsx)(U,Object(o.a)({},e))}}),Object(n.jsx)(f.b,{exact:!0,path:"/submit",render:function(e){return Object(n.jsx)(Y,Object(o.a)({},e))}}),Object(n.jsx)(f.b,{exact:!0,path:"/evaluation",render:function(e){return Object(n.jsx)(K,Object(o.a)({},e))}})]})]})}}]),a}(i.Component),Q=function(e){e&&e instanceof Function&&a.e(3).then(a.bind(null,505)).then((function(t){var a=t.getCLS,n=t.getFID,i=t.getFCP,s=t.getLCP,r=t.getTTFB;a(e),n(e),i(e),s(e),r(e)}))};c.a.render(Object(n.jsx)(s.a.StrictMode,{children:Object(n.jsx)(Z,{})}),document.getElementById("root")),Q()}},[[469,1,2]]]);
//# sourceMappingURL=main.6fe6e130.chunk.js.map