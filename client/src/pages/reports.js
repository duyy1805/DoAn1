import React, { Component } from 'react';
import { Helmet } from 'react-helmet';
import DownloadIcon from '@material-ui/icons/PictureAsPdf';
import LoadingOverlay from 'react-loading-overlay';
import {
  Box,
  Container,
  Card,
  CardContent,
  Button,
  Grid,
  MenuItem,
  Divider,
  Select,
  FormControl,
  InputLabel,
  FormHelperText,
  Typography,
  Step,
  StepLabel,
  Stepper,
  StepContent


} from '@material-ui/core';
import Papa from "papaparse";
import { CSVReader } from 'react-papaparse';
import axios from 'axios';
import Plotly from "plotly.js-basic-dist";
import createPlotlyComponent from "react-plotly.js/factory";
import { number } from 'prop-types';
import { Steps, Descriptions, Row, Col } from 'antd';
import Step1 from './Step1';
import Step2 from './Step2';
import Step3 from './Step3';
import Step4 from './Step4';
const Plot = createPlotlyComponent(Plotly);

const buttonRef = React.createRef();
export default class Reports extends Component {
  state = {
    selectedDate: '',
    future_values_auto_arima: null,
    hidden0: false,
    hidden_step1: true,
    hidden_step2: true,
    hidden_step3: true,
    hidden_step4: true,
    hidden2: true, // loading overlay
    hidden3: true,
    arima: false,
    auto_arima: false,
    file: null,
    rnn: false,
    data: null,
    data2: null,
    data3: null,

    test_size: 0.2,
    fill_method: 'delete',

    time_of_TS: [],
    yearsx: [],
    data_of_TS: [],
    time_of_predicted: [],
    time_of_prediction: [],
    predicted_auto_arima: [],
    predicted_arima: [],
    prediction_auto_arima: [],
    activeStep: 0,
    skipped: new Set(),
    current: 0,
    column: [],
    timeColumn: null,
    dataColumn: null,
    filename: '',

    //visualize
    values_count: 0,
    missing_values_count: 0,
    sum_values: 0,
    max_values: 0,
    min_values: 0,
    mean_values: 0,
    median_values: 0,
    std_values: 0,
    variance_values: 0,
    skewness_values: 0,
    //step3

    params: []
  }

  onChange = (value) => {
    this.setState({ current: value }, () => {
      if (this.state.current !== 0) { this.setState({ hidden0: true }); }
      else { this.setState({ hidden0: false }); }

      if (this.state.file == null) this.setState({ hidden_step1: true })
      // else
      //   this.setState({ hidden0: value !== 0 ? true : false });

      if (this.state.current !== 1) this.setState({ hidden_step2: true })
      else this.setState({ hidden_step2: false })

      if (this.state.current !== 2) this.setState({ hidden_step3: true })
      else this.setState({ hidden_step3: false })

      if (this.state.current !== 3) this.setState({ hidden_step4: true })
      else this.setState({ hidden_step4: false })
    });
  };
  nextStep = () => {
    var x = this.state.current
    x = x + 1
    this.setState({ current: x }, () => {
      this.onChange(x)
      this.render()
    })
  }

  previousStep = () => {
    var x = this.state.current
    if (x != 0) { x = x - 1 }
    this.setState({ current: x }, () => {
      this.onChange(x)
      this.render()
    })
  }
  handleOpenDialog = (e) => {
    if (buttonRef.current) {
      buttonRef.current.open(e);
    }
  };

  handleSelectData = (event) => {
    // console.log(event.target.value)
    this.setState({ dataColumn: event.target.value }, () => {
      // console.log(this.state.dataColumn)
    })

  }

  handleSelectTime = (event) => {
    // console.log(event.target.value)
    this.setState({ timeColumn: event.target.value })
  }

  handleSelectChanege = (event) => {
    // console.log(this.state.yearsx[event.target.value])
    this.setState({ future_values_auto_arima: this.state.prediction_auto_arima[event.target.value] })
    this.setState({ selectedDate: event.target.value }, () => {
      // console.log(this.state.selectedDate)
    })
  }


  handleUpdateTestSize = (value) => {
    this.setState({ test_size: value });
  };

  handleFillMethod = (value) => {
    this.setState({ fill_method: value });
  };

  drawArima = () => {
    this.setState({ arima: !this.state.arima })
  }
  drawAuto_Arima = () => {
    this.setState({ auto_arima: !this.state.auto_arima })
  }
  drawRnn = () => {
    this.setState({ rnn: !this.state.rnn })
  }
  handleOnFileLoad = (data, file) => {
    this.setState({ hidden2: false, file: file });
    var predicted_auto_arima, predicted_arima, prediction_auto_arima
    const formData = new FormData();
    formData.append('test', 'test');
    formData.append('file', file, 'file.csv')
    axios({
      method: 'post',
      url: 'http://127.0.0.1:8000/upload/file',
      data: formData,
      headers: { 'Content-Type': 'multipart/form-data' }
    })
      .then((response) => {

        predicted_auto_arima = Object.values(JSON.parse(response.data.data1).predicted_sales)
        predicted_arima = Object.values(JSON.parse(response.data.data2).Predictions)
        prediction_auto_arima = Object.values(JSON.parse(response.data.data3).predicted_sales)

        this.setState({ predicted_auto_arima: predicted_auto_arima, predicted_arima: predicted_arima, prediction_auto_arima: prediction_auto_arima })
        var yearsx = []
        var int = 10
        var y = "2021-"
        prediction_auto_arima.map((element, index) => {


          if (int > 12) {
            y = "2022-"
            int = 1
            yearsx.push(y + int)

          }
          else {
            yearsx.push(y + int)
          }

          int = int + 1
        })


        // console.log(yearsx)

        this.setState({ yearsx: yearsx });
        this.setState({ hidden2: true });
        this.setState({ hidden_step1: false });
      })
      .catch((response) => {
        //handle error
        console.log(response);
      });

    this.setState({ data: data })
    var time_of_TS = []
    this.state.data.map((element, index) => {
      if (index > 0)
        time_of_TS.push(element.data[0])
    })


    this.setState({ time_of_TS: time_of_TS })

    var time_of_predicted = time_of_TS.filter((item, index) => { return index > 84 })
    this.setState({ time_of_predicted: time_of_predicted })

    var time_of_prediction = time_of_TS.filter((item, index) => { return index > 92 })
    this.setState({ time_of_prediction: time_of_prediction })



    var data_of_TS = []
    this.state.data.map((element, index) => {
      if (index > 0)
        data_of_TS.push(element.data[1])
    })
    this.setState({ data_of_TS: data_of_TS })

  };

  handleOnFileLoad1 = (data, file) => {
    this.setState({ data: data })
    var time_of_TS = []
    this.state.data.map((element, index) => {
      if (index > 0)
        time_of_TS.push(element.data[0])
    })
    this.setState({ file: file });
    // console.log(file['name'])
    this.setState({ filename: file['name'] })

    var predicted_auto_arima, predicted_arima, prediction_auto_arima;
    this.setState({ data: data });
    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: (result) => {
        const columnArray = [];
        const valueArray = [];
        result.data.map((d) => {
          columnArray.push(Object.keys(d))
          valueArray.push(Object.values(d))
        });
        this.setState({ column: columnArray[0] });
        // console.log(this.state.column);
      }
    })
  };

  handleOnFileLoad2 = () => {
    var predicted_auto_arima, predicted_arima, prediction_auto_arima
    if (this.state.file !== null) {
      this.setState({ hidden2: false });
      const formData = new FormData();
      formData.append('test', 'test');
      formData.append('timeColumn', this.state.column[this.state.timeColumn]);
      formData.append('dataColumn', this.state.column[this.state.dataColumn]);
      formData.append('file', this.state.file, 'file.csv')
      axios({
        method: 'post',
        url: 'http://127.0.0.1:8000/file',
        data: formData,
        headers: { 'Content-Type': 'multipart/form-data' }
      })
        .then((response) => {
          var values_count = response.data.values_count
          var missing_values_count = response.data.missing_values_count
          var sum_values = response.data.sum_values
          var max_values = response.data.max_values
          var min_values = response.data.min_values
          var mean_values = response.data.mean_values
          var median_values = response.data.median_values
          var std_values = response.data.std_values
          var variance_values = response.data.variance_values
          var skewness_values = response.data.skewness_values
          this.setState({ hidden_step1: false });
          this.setState({ hidden2: true });
          this.setState({
            sum_values: sum_values,
            values_count: values_count,
            missing_values_count: missing_values_count,
            max_values: max_values,
            min_values: min_values,
            mean_values: mean_values,
            median_values: median_values,
            std_values: std_values,
            variance_values: variance_values,
            skewness_values: skewness_values,
          }, () => {
            // console.log(response.data.max_values)
          })
        })
        .catch((response) => {
          //handle error
          console.log(response);
        });
      var time_of_TS = []
      var xx = ''
      this.state.data.map((element, index) => {
        if (index > 0)
          time_of_TS.push(element.data[this.state.timeColumn])
        else
          xx = element.data
      })

      this.setState({ time_of_TS: time_of_TS })

      var data_of_TS = []
      this.state.data.map((element, index) => {
        if (index > 0)
          data_of_TS.push(element.data[this.state.dataColumn])
      })
      this.setState({ data_of_TS: data_of_TS },
        // () => console.log(data_of_TS)
      )
      // this.setState({ hidden_step1: false });
    }
  };

  handleOnFileLoadAutoArima = () => {
    var predicted_auto_arima, predicted_arima, prediction_auto_arima
    this.setState({ hidden2: false })
    const formData = new FormData();
    formData.append('test_size', this.state.test_size);
    formData.append('fill_method', this.state.fill_method);
    formData.append('timeColumn', this.state.column[this.state.timeColumn]);
    formData.append('dataColumn', this.state.column[this.state.dataColumn]);
    formData.append('file', this.state.file, 'file.csv')
    axios({
      method: 'post',
      url: 'http://127.0.0.1:8000/autoarima',
      data: formData,
      headers: { 'Content-Type': 'multipart/form-data' }
    })
      .then((response) => {

        predicted_auto_arima = Object.values(JSON.parse(response.data.data1).predicted_values)
        prediction_auto_arima = Object.values(JSON.parse(response.data.data2).predicted_values)


        const timestamps = (Object.values(JSON.parse(response.data.data2).index))

        const dates = timestamps.map(timestamp => {
          const dateObject = new Date(timestamp);
          return dateObject.toISOString().slice(0, 10);
        });
        console.log(dates)
        this.setState({ predicted_auto_arima: predicted_auto_arima, yearsx: dates, prediction_auto_arima: prediction_auto_arima })
        this.setState({ auto_arima: true, current: 3 }, () => {
          this.setState({ hidden2: true })
          this.onChange(3)
          this.render()
        })
      })
      .catch((response) => {
        //handle error
        console.log(response);
      });
    var time_of_TS = []
    this.state.data.map((element, index) => {
      if (index > 0)
        time_of_TS.push(element.data[0])
    })
    var x = time_of_TS.length - time_of_TS.length * this.state.test_size
    // console.log(x)
    var time_of_predicted = time_of_TS.filter((item, index) => { return index > x })
    this.setState({ time_of_predicted: time_of_predicted })
  }

  handleOnFileLoadArima = (values) => {
    var predicted_auto_arima, predicted_arima, prediction_auto_arima
    console.log(values)
    // this.setState({ hidden2: false })
    const formData = new FormData();
    formData.append('test_size', this.state.test_size);
    formData.append('fill_method', this.state.fill_method);
    formData.append('timeColumn', this.state.column[this.state.timeColumn]);
    formData.append('dataColumn', this.state.column[this.state.dataColumn]);
    formData.append('file', this.state.file, 'file.csv')
    formData.append('p', values.p)
    formData.append('d', values.d)
    formData.append('q', values.q)
    formData.append('P', values.P)
    formData.append('D', values.D)
    formData.append('Q', values.Q)
    formData.append('m', values.m)
    formData.append('stationarity', values.stationarity)
    formData.append('invertibility', values.invertibility)
    formData.append('concentrate_scale', values.concentrate_scale)
    console.log(formData)
    axios({
      method: 'post',
      url: 'http://127.0.0.1:8000/arima',
      data: formData,
      headers: { 'Content-Type': 'multipart/form-data' }
    })
      .then((response) => {

        predicted_arima = Object.values(JSON.parse(response.data.data1).predicted_values)
        this.setState({ predicted_arima: predicted_arima })
        this.setState({ arima: true, current: 3 }, () => {
          this.setState({ hidden2: true })
          this.onChange(3)
          this.render()
        })
      })
      .catch((response) => {
        //handle error
        console.log(response);
      });
    var time_of_TS = []
    this.state.data.map((element, index) => {
      if (index > 0)
        time_of_TS.push(element.data[0])
    })
    var x = time_of_TS.length - time_of_TS.length * this.state.test_size
    console.log(x)
    var time_of_predicted = time_of_TS.filter((item, index) => { return index > x })
    this.setState({ time_of_predicted: time_of_predicted })
  }

  handleOnError = (err, file, inputElem, reason) => {
    console.log('---------------------------');
    console.log(err);
    console.log('---------------------------');
  };
  handleOnRemoveFile = (data) => {
    console.log('---------------------------');
    console.log(data);
    console.log('---------------------------');
  };
  handleRemoveFile = (e) => {
    // Note that the ref is set async, so it might be null at some point
    if (buttonRef.current) {
      buttonRef.current.removeFile(e);
    }
  };


  show = () => {
    this.setState({ hidden2: false });
    setTimeout(() => {
      this.setState({ hidden_step1: false });
      this.setState({ hidden2: true });
    }, 2000);
  };

  render() {
    var graph = {
      type: "scatter",
      mode: "lines",
      name: ' before prediction ',
      x: this.state.time_of_TS,
      y: this.state.data_of_TS,
      line: { color: '#17BECF' }
    }
    var auto_arima_graph =
      this.state.auto_arima ? {
        type: "scatter",
        mode: "lines",
        name: ' after prediction auto Arima ',
        x: this.state.time_of_predicted,
        y: this.state.predicted_auto_arima,
        line: { color: '#FF0000' }
      } : {
        type: "scatter",
        mode: "lines",
        name: 'no graph ',
        x: [],
        y: [],
        line: { color: '#17BECF' }
      }
    var arima_graph =
      this.state.arima ? {
        type: "scatter",
        mode: "lines",
        name: ' after prediction Arima ',
        x: this.state.time_of_predicted,
        y: this.state.predicted_arima,
        line: { color: '#E82CB2' }
      } : {
        type: "scatter",
        mode: "lines",
        name: 'no graph ',
        x: [],
        y: [],
        line: { color: '#17BECF' }
      }
    var rnn_graph =
      this.state.rnn ? {
        type: "scatter",
        mode: "lines",
        name: ' after prediction RNN',
        x: this.state.time_of_prediction,
        y: this.state.predicted_arima,
        line: { color: '#0000FF' }
      } : {
        type: "scatter",
        mode: "lines",
        name: 'no graph ',
        x: [],
        y: [],
        line: { color: '#17BECF' }
      }
    const isStepOptional = (step) => {
      return step === 1;
    };

    const isStepSkipped = (step) => {
      return this.state.skipped.has(step);
    };
    const steps = ['Select campaign settings', 'Create an ad group', 'Create an ad'];
    return (

      <>
        <Helmet>
          <title>Dashboard</title>
        </Helmet>
        <div style={{ display: 'flex', paddingLeft: 20, overflow: "hidden" }}>
          <div style={{ flex: ' 1 0 0', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <Divider />
            <Steps
              current={this.state.current}
              onChange={this.onChange}
              direction="vertical"
              style={{ marginTop: "100px" }}
              items={[
                {
                  title: 'Step 1',
                  description: "Import time series file",
                },
                {
                  title: 'Step 2',
                  description: "Data preparation",
                },
                {
                  title: 'Step 3',
                  description: "Select Time-Series Params",
                },
                {
                  title: 'Step 4',
                  // this.state.description,
                },
              ]}
            />
          </div>
          <div style={{ flex: ' 5 0 0', display: 'flex', flexDirection: 'column', alignItems: 'center', overflowY: 'scroll', height: 'calc(100vh - 102px)' }}>
            <div>
              <Step1 test={this.test}
                selectedDate={this.state.selectedDate}
                future_values_auto_arima={this.state.future_values_auto_arima}
                hidden_step1={this.state.hidden_step1}
                hidden_step3={this.state.hidden_step3}
                hidden0={this.state.hidden0}
                hidden2={this.state.hidden2}
                hidden3={this.state.hidden3}
                file={this.state.file}
                data={this.state.data}
                time_of_TS={this.state.time_of_TS}
                yearsx={this.state.yearsx}
                data_of_TS={this.state.data_of_TS}
                predicted_auto_arima={this.state.predicted_auto_arima}
                column={this.state.column}
                buttonRef={buttonRef}
                timeColumn={this.state.timeColumn}
                dataColumn={this.state.dataColumn}
                handleSelectData={this.handleSelectData}
                handleSelectTime={this.handleSelectTime}
                handleOpenDialog={this.handleOpenDialog}
                handleOnFileLoad1={this.handleOnFileLoad1}
                handleOnFileLoad2={this.handleOnFileLoad2}
                handleOnError={this.handleOnError}
                handleOnRemoveFile={this.handleOnRemoveFile}

                nextStep={this.nextStep}
                previousStep={this.previousStep}
                //visualize
                sum_values={this.state.sum_values}
                values_count={this.state.values_count}
                missing_values_count={this.state.missing_values_count}
                max_values={this.state.max_values}
                min_values={this.state.min_values}
                mean_values={this.state.mean_values}
                median_values={this.state.median_values}
                std_values={this.state.std_values}
                variance_values={this.state.variance_values}
                skewness_values={this.state.skewness_values}

                filename={this.state.filename}></Step1 >
            </div>
            <div>
              <Step2
                test={this.test}
                selectedDate={this.state.selectedDate}
                future_values_auto_arima={this.state.future_values_auto_arima}
                hidden_step1={this.state.hidden_step1}
                hidden_step2={this.state.hidden_step2}
                hidden_step3={this.state.hidden_step3}
                hidden0={this.state.hidden0}
                hidden2={this.state.hidden2}
                hidden3={this.state.hidden3}
                file={this.state.file}
                data={this.state.data}
                time_of_TS={this.state.time_of_TS}
                yearsx={this.state.yearsx}
                data_of_TS={this.state.data_of_TS}
                predicted_auto_arima={this.state.predicted_auto_arima}
                column={this.state.column}
                buttonRef={buttonRef}
                timeColumn={this.state.timeColumn}
                dataColumn={this.state.dataColumn}

                test_size={this.state.test_size}
                fill_method={this.state.fill_method}

                handleSelectData={this.handleSelectData}
                handleSelectTime={this.handleSelectTime}
                handleUpdateTestSize={this.handleUpdateTestSize}
                handleFillMethod={this.handleFillMethod}

                handleOpenDialog={this.handleOpenDialog}
                handleOnFileLoad1={this.handleOnFileLoad1}
                handleOnFileLoad2={this.handleOnFileLoad2}
                handleOnError={this.handleOnError}

                nextStep={this.nextStep}
                previousStep={this.previousStep}
                graph={graph}
                arima_graph={arima_graph}
                handleOnRemoveFile={this.handleOnRemoveFile}
                handleOnFileLoadAutoArima={this.handleOnFileLoadAutoArima}
                filename={this.state.filename}></Step2>
            </div>
            <div>
              <Step3
                test={this.test}
                selectedDate={this.state.selectedDate}
                future_values_auto_arima={this.state.future_values_auto_arima}
                hidden_step1={this.state.hidden_step1}
                hidden_step2={this.state.hidden_step2}
                hidden_step3={this.state.hidden_step3}
                hidden0={this.state.hidden0}
                hidden2={this.state.hidden2}
                hidden3={this.state.hidden3}
                file={this.state.file}
                data={this.state.data}
                time_of_TS={this.state.time_of_TS}
                yearsx={this.state.yearsx}
                data_of_TS={this.state.data_of_TS}
                predicted_auto_arima={this.state.predicted_auto_arima}
                column={this.state.column}
                buttonRef={buttonRef}
                timeColumn={this.state.timeColumn}
                dataColumn={this.state.dataColumn}
                handleSelectData={this.handleSelectData}
                handleSelectTime={this.handleSelectTime}
                handleOpenDialog={this.handleOpenDialog}
                handleOnFileLoad1={this.handleOnFileLoad1}
                handleOnFileLoad2={this.handleOnFileLoad2}
                handleOnError={this.handleOnError}

                nextStep={this.nextStep}
                previousStep={this.previousStep}

                params={this.state.params}
                handleOnFileLoadArima={this.handleOnFileLoadArima}

                graph={graph}
                arima_graph={arima_graph}
                handleOnRemoveFile={this.handleOnRemoveFile}
                handleOnFileLoadAutoArima={this.handleOnFileLoadAutoArima}
                filename={this.state.filename}></Step3>
            </div>
            <div>
              <Step4
                test={this.test}
                selectedDate={this.state.selectedDate}
                future_values_auto_arima={this.state.future_values_auto_arima}
                hidden_step1={this.state.hidden_step1}
                hidden_step3={this.state.hidden_step3}
                hidden_step4={this.state.hidden_step4}
                hidden0={this.state.hidden0}
                hidden2={this.state.hidden2}
                hidden3={this.state.hidden3}
                file={this.state.file}
                data={this.state.data}
                time_of_TS={this.state.time_of_TS}
                yearsx={this.state.yearsx}
                data_of_TS={this.state.data_of_TS}
                predicted_auto_arima={this.state.predicted_auto_arima}
                column={this.state.column}
                buttonRef={buttonRef}
                timeColumn={this.state.timeColumn}
                dataColumn={this.state.dataColumn}
                handleSelectData={this.handleSelectData}
                handleSelectTime={this.handleSelectTime}
                handleOpenDialog={this.handleOpenDialog}
                handleSelectChanege={this.handleSelectChanege}
                handleOnFileLoad1={this.handleOnFileLoad1}
                handleOnFileLoad2={this.handleOnFileLoad2}
                handleOnError={this.handleOnError}

                nextStep={this.nextStep}
                previousStep={this.previousStep}

                drawArima={this.drawArima}
                drawAuto_Arima={this.drawAuto_Arima}
                arima_graph={arima_graph}
                auto_arima_graph={auto_arima_graph}
                handleOnRemoveFile={this.handleOnRemoveFile}
                handleOnFileLoadAutoArima={this.handleOnFileLoadAutoArima}
                filename={this.state.filename}></Step4>
            </div>
          </div>
        </div >
      </>
    );
  }
}

