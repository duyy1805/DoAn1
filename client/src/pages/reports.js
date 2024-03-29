import React, { Component } from 'react';
import { Helmet } from 'react-helmet';
// import DownloadIcon from '@material-ui/icons/PictureAsPdf';
import LoadingOverlay from 'react-loading-overlay';
import {
  //   Box,
  //   Container,
  //   Card,
  //   CardContent,
  //   Button as ButtonMui,
  //   Grid,
  //   MenuItem,
  Divider,
  //   Select,
  //   FormControl,
  //   InputLabel,
  //   FormHelperText,
  //   Typography,
  //   Step,
  //   StepLabel,
  //   Stepper,
  //   StepContent


} from '@material-ui/core';
import Papa from "papaparse";
// import { CSVReader } from 'react-papaparse';
import axios from 'axios';
import Plotly from "plotly.js-basic-dist";
// import createPlotlyComponent from "react-plotly.js/factory";
// import { number } from 'prop-types';
import { Steps, message, } from 'antd';
import Step1 from './Steps/Step1';
import Step2 from './Steps/Step2';
import Step3 from './Steps/Step3';
import Step4 from './Steps/Step4';
// const Plot = createPlotlyComponent(Plotly);
import { Fade, Slide } from "react-reveal";
import { object } from 'prop-types';



const buttonRef = React.createRef();
export default class Reports extends Component {
  state = {
    selectedDate: '',
    future_values_auto_arima: null,
    future_values_arima: null,
    hidden0: false,
    hidden_step1: true,
    hidden_step2: true,
    hidden_step3: true,
    hidden_step4: true,
    hidden2: true, // loading overlay
    hidden3: true,
    arima: false,
    auto_arima: false,
    missing: false,
    file: null,
    rnn: true,
    data: null,
    data2: null,
    data3: null,

    response_data: [],
    test_size: 0.2,
    fill_method: '0',

    time_of_TS: [],
    yearsx: [],
    data_of_TS: [],
    time_of_predicted: [],
    time_of_prediction: [],


    predicted_auto_arima: [], predicted_auto_arima_0: [], predicted_auto_arima_1: [], predicted_auto_arima_2: [], predicted_auto_arima_3: [],
    predicted_arima: [],
    prediction_auto_arima: [],
    prediction_arima: [],

    predicted_RNN: [], predicted_RNN_0: [], predicted_RNN_1: [], predicted_RNN_2: [], predicted_RNN_3: [],
    predicted_SES: [], predicted_SES_0: [], predicted_SES_1: [], predicted_SES_2: [], predicted_SES_3: [],
    predicted_DES: [], predicted_DES_0: [], predicted_DES_1: [], predicted_DES_2: [], predicted_DES_3: [],
    predicted_TES: [], predicted_TES_0: [], predicted_TES_1: [], predicted_TES_2: [], predicted_TES_3: [],
    predicted_MA: [], predicted_MA_0: [], predicted_MA_1: [], predicted_MA_2: [], predicted_MA_3: [],
    //=====sai số

    mae: [],
    mse: [],

    selectedModel: [],
    activeStep: 0,
    skipped: new Set(),
    FileList: [],
    current: 0,
    column: [],
    timeColumn: null,
    dataColumn: null,
    filename: '',

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
      // this.onChange(x)
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

  next = () => {
    // setCurrent(current + 1);
    const current = this.state.current + 1
    this.setState({ current: current }, () => {
      // this.render()
    })
  };
  prev = () => {
    // setCurrent(current - 1);
    const current = this.state.current - 1
    this.setState({ current: current })
  };
  handleOpenDialog = (e) => {
    if (buttonRef.current) {
      buttonRef.current.open(e);
    }
  };

  handleSelectData = (event) => {
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
    this.setState({ future_values_arima: this.state.prediction_arima[event.target.value] })
    this.setState({ selectedDate: event.target.value }, () => {
      console.log(this.state.selectedDate)
    })
  }

  handleSelectFileList = (fileList) => {
    this.setState({ FileList: fileList })
  }

  handleUpdateTestSize = (value) => {
    this.setState({ test_size: value });
  };

  handleFillMethod = (value) => {
    this.setState({ fill_method: value });
  };

  handleSetError = () => {
    this.setState({ mae: [], mse: [] });
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
  handleOnFileLoad = (file) => {
    // this.setState({ data: data })
    // var time_of_TS = []
    // this.state.data.map((element, index) => {
    //   if (index > 0)
    //     time_of_TS.push(element.data[0])
    // })

    this.setState({ file: file });
    // console.log(file)
    this.setState({ filename: file['name'] })

    // this.setState({ data: data });
    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: (result) => {
        const columnArray = [];
        const valueArray = [];
        this.setState({ data: result.data });
        result.data.map((d) => {
          columnArray.push(Object.keys(d))
          valueArray.push(Object.values(d))
        });
        this.setState({ column: columnArray[0] });
      }
    })
  };

  handleOnFileLoad1 = (data, file) => {
    this.setState({ data: data })

    this.setState({ file: file });
    console.log(data)
    this.setState({ filename: file['name'] })

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
      formData.append('timeColumn', this.state.timeColumn);
      formData.append('dataColumn', this.state.dataColumn);
      formData.append('file', this.state.file, 'file.csv')
      axios({
        method: 'post',
        url: 'http://127.0.0.1:8000/file',
        data: formData,
        headers: { 'Content-Type': 'multipart/form-data' }
      })
        .then((response) => {
          this.setState({ response_data: response.data })
          this.setState({ hidden_step1: false });
          this.setState({ hidden2: true });
          window.scrollTo({
            top: 700,
            behavior: "smooth", // Sử dụng smooth behavior để kích hoạt cuộn mềm mại
          });
        })
        .catch((response) => {
          //handle error
          console.log(response);
        });
      var time_of_TS = []
      var xx = ''
      this.state.data.map((element, index) => {
        // if (index > 0)
        time_of_TS.push(element[this.state.timeColumn])
        // else
        //   xx = element.data
      })

      this.setState({ time_of_TS: time_of_TS })

      var data_of_TS = []
      this.state.data.map((element, index) => {
        // if (index > 0)
        data_of_TS.push(element[this.state.dataColumn])
      })
      this.setState({ data_of_TS: data_of_TS },
      )
      // this.setState({ hidden_step1: false });
    }
  };

  testAllModel = async () => {
    await this.handleOnFileLoadSES()
    await this.handleOnFileLoadDES()
    await this.handleOnFileLoadTES()
    await this.handleOnFileLoadMA()
    await this.handleOnFileLoadAutoArima()
    await this.handleOnFileLoadRNN()

    this.setState({ auto_arima: true, arima: true, current: 2 }, () => {
      this.setState({ hidden2: true })
      message.success("Complete")
      // this.onChange(3)
      // this.render()
    })


  }
  callApiAutoARIMA = async () => {

    this.setState({ hidden2: false })
    var formData = new FormData();
    formData.append('test_size', this.state.test_size);
    formData.append('fill_method', this.state.fill_method);
    formData.append('timeColumn', this.state.timeColumn);
    formData.append('dataColumn', this.state.dataColumn);
    formData.append('file', this.state.file, 'file.csv')
    try {
      const response = await axios({
        method: 'post',
        url: 'http://127.0.0.1:8000/autoarima',
        data: formData,
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      return response;

    } catch (error) {

    }
  }

  callApiRNN = async () => {

    this.setState({ hidden2: false })
    var formData = new FormData();
    formData.append('test_size', this.state.test_size);
    formData.append('fill_method', this.state.fill_method);
    formData.append('timeColumn', this.state.timeColumn);
    formData.append('dataColumn', this.state.dataColumn);
    formData.append('file', this.state.file, 'file.csv')
    try {
      const response = await axios({
        method: 'post',
        url: 'http://127.0.0.1:8000/rnn',
        data: formData,
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      return response;

    } catch (error) {

    }
  }

  callApiSES = async () => {

    this.setState({ hidden2: false })
    var formData = new FormData();
    formData.append('test_size', this.state.test_size);
    formData.append('fill_method', this.state.fill_method);
    formData.append('timeColumn', this.state.timeColumn);
    formData.append('dataColumn', this.state.dataColumn);
    formData.append('file', this.state.file, 'file.csv')
    try {
      const response = await axios({
        method: 'post',
        url: 'http://127.0.0.1:8000/ses',
        data: formData,
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      return response;

    } catch (error) {

    }
  }
  callApiDES = async () => {

    this.setState({ hidden2: false })
    var formData = new FormData();
    formData.append('test_size', this.state.test_size);
    formData.append('fill_method', this.state.fill_method);
    formData.append('timeColumn', this.state.timeColumn);
    formData.append('dataColumn', this.state.dataColumn);
    formData.append('file', this.state.file, 'file.csv')
    try {
      const response = await axios({
        method: 'post',
        url: 'http://127.0.0.1:8000/des',
        data: formData,
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      return response;

    } catch (error) {

    }
  }
  callApiTES = async () => {

    this.setState({ hidden2: false })
    var formData = new FormData();
    formData.append('test_size', this.state.test_size);
    formData.append('fill_method', this.state.fill_method);
    formData.append('timeColumn', this.state.timeColumn);
    formData.append('dataColumn', this.state.dataColumn);
    formData.append('file', this.state.file, 'file.csv')
    try {
      const response = await axios({
        method: 'post',
        url: 'http://127.0.0.1:8000/tes',
        data: formData,
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      return response;

    } catch (error) {

    }
  }

  callApiMA = async () => {

    this.setState({ hidden2: false })
    var formData = new FormData();
    formData.append('test_size', this.state.test_size);
    formData.append('fill_method', this.state.fill_method);
    formData.append('timeColumn', this.state.timeColumn);
    formData.append('dataColumn', this.state.dataColumn);
    formData.append('file', this.state.file, 'file.csv')
    try {
      const response = await axios({
        method: 'post',
        url: 'http://127.0.0.1:8000/ma',
        data: formData,
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      return response;

    } catch (error) {

    }
  }
  handleOnFileLoadAutoArima = async () => {
    var predicted_auto_arima, predicted_arima, prediction_auto_arima
    var predicted_auto_arima_0, predicted_auto_arima_1, predicted_auto_arima_2, predicted_auto_arima_3
    const response = await this.callApiAutoARIMA();
    var new_values1 = this.state.mae.concat(response.data.mae)
    var new_values2 = this.state.mse.concat(response.data.mse)
    this.setState({ mae: new_values1, mse: new_values2 });
    if (response.data.data1.length > 1) {
      this.setState({ missing: true })
      // console.log(Object.values(JSON.parse(response.data.data1[0]).predicted_values))
      predicted_auto_arima_0 = Object.values(JSON.parse(response.data.data1[0]).predicted_values)
      predicted_auto_arima_1 = Object.values(JSON.parse(response.data.data1[1]).predicted_values)
      predicted_auto_arima_2 = Object.values(JSON.parse(response.data.data1[2]).predicted_values)
      predicted_auto_arima_3 = Object.values(JSON.parse(response.data.data1[3]).predicted_values)
      prediction_auto_arima = Object.values(JSON.parse(response.data.data2).predicted_values)
    }

    predicted_auto_arima = Object.values(JSON.parse(response.data.data1[0]).predicted_values)
    var timestamps = (Object.values(JSON.parse(response.data.data2).index))

    var dates = timestamps.map(timestamp => {
      var dateObject = new Date(timestamp);
      return dateObject.toISOString().slice(0, 10);
    });
    // console.log(dates)
    this.setState({
      predicted_auto_arima: predicted_auto_arima,
      predicted_auto_arima_0: predicted_auto_arima_0,
      predicted_auto_arima_1: predicted_auto_arima_1,
      predicted_auto_arima_2: predicted_auto_arima_2,
      predicted_auto_arima_3: predicted_auto_arima_3,
      yearsx: dates, prediction_auto_arima: prediction_auto_arima
    });
    var time_of_TS = []
    this.state.data.map((element, index) => {
      // if (index > 0)
      time_of_TS.push(element[this.state.timeColumn])
    })
    var x = time_of_TS.length - time_of_TS.length * this.state.test_size
    // console.log(x)
    var time_of_predicted = time_of_TS.filter((item, index) => { return index > x })
    this.setState({ time_of_predicted: time_of_predicted })
  }

  handleOnFileLoadRNN = async () => {
    var predicted, prediction
    var predicted_0, predicted_1, predicted_2, predicted_3
    const response = await this.callApiRNN();
    var new_values1 = this.state.mae.concat(response.data.mae)
    var new_values2 = this.state.mse.concat(response.data.mse)
    this.setState({ mae: new_values1, mse: new_values2 });
    if (response.data.data1.length > 1) {
      this.setState({ missing: true })
      console.log(Object.values((JSON.parse(response.data.data1[0])).Time))
      predicted_0 = Object.values((JSON.parse(response.data.data1[0]).Predictions))
      predicted_1 = Object.values((JSON.parse(response.data.data1[1]).Predictions))
      predicted_2 = Object.values((JSON.parse(response.data.data1[2]).Predictions))
      predicted_3 = Object.values((JSON.parse(response.data.data1[3]).Predictions))
    }
    predicted = Object.values((JSON.parse(response.data.data1[0]).Predictions))

    this.setState({
      predicted_RNN: predicted,
      predicted_RNN_0: predicted_0,
      predicted_RNN_1: predicted_1,
      predicted_RNN_2: predicted_2,
      predicted_RNN_3: predicted_3,
    });
    var time_of_TS = []
    this.state.data.map((element, index) => {
      // if (index > 0)
      time_of_TS.push(element[this.state.timeColumn])
    })
    var x = time_of_TS.length - time_of_TS.length * this.state.test_size
    var time_of_predicted = time_of_TS.filter((item, index) => { return index > x })

    this.setState({ time_of_predicted: time_of_predicted })
  }

  handleOnFileLoadSES = async () => {
    var predicted, prediction
    var predicted_0, predicted_1, predicted_2, predicted_3
    const response = await this.callApiSES();
    var new_values1 = this.state.mae.concat(response.data.mae)
    var new_values2 = this.state.mse.concat(response.data.mse)
    this.setState({ mae: new_values1, mse: new_values2 });
    if (response.data.data1.length > 1) {
      this.setState({ missing: true })
      console.log(Object.values((JSON.parse(response.data.data1[0])).Time))
      predicted_0 = Object.values((JSON.parse(response.data.data1[0]).Predictions))
      predicted_1 = Object.values((JSON.parse(response.data.data1[1]).Predictions))
      predicted_2 = Object.values((JSON.parse(response.data.data1[2]).Predictions))
      predicted_3 = Object.values((JSON.parse(response.data.data1[3]).Predictions))
    }
    predicted = Object.values((JSON.parse(response.data.data1[0]).Predictions))

    this.setState({
      predicted_SES: predicted,
      predicted_SES_0: predicted_0,
      predicted_SES_1: predicted_1,
      predicted_SES_2: predicted_2,
      predicted_SES_3: predicted_3,
    });
    var time_of_TS = []
    this.state.data.map((element, index) => {
      // if (index > 0)
      time_of_TS.push(element[this.state.timeColumn])
    })
    var x = time_of_TS.length - time_of_TS.length * this.state.test_size
    var time_of_predicted = time_of_TS.filter((item, index) => { return index > x })

    this.setState({ time_of_predicted: time_of_predicted })
  }
  handleOnFileLoadDES = async () => {
    var predicted, prediction
    var predicted_0, predicted_1, predicted_2, predicted_3
    const response = await this.callApiDES();
    var new_values1 = this.state.mae.concat(response.data.mae)
    var new_values2 = this.state.mse.concat(response.data.mse)
    this.setState({ mae: new_values1, mse: new_values2 });
    if (response.data.data1.length > 1) {
      this.setState({ missing: true })
      console.log(Object.values((JSON.parse(response.data.data1[0])).Time))
      predicted_0 = Object.values((JSON.parse(response.data.data1[0]).Predictions))
      predicted_1 = Object.values((JSON.parse(response.data.data1[1]).Predictions))
      predicted_2 = Object.values((JSON.parse(response.data.data1[2]).Predictions))
      predicted_3 = Object.values((JSON.parse(response.data.data1[3]).Predictions))
    }
    predicted = Object.values((JSON.parse(response.data.data1[0]).Predictions))

    this.setState({
      predicted_DES: predicted,
      predicted_DES_0: predicted_0,
      predicted_DES_1: predicted_1,
      predicted_DES_2: predicted_2,
      predicted_DES_3: predicted_3,
    });
    var time_of_TS = []
    this.state.data.map((element, index) => {
      // if (index > 0)
      time_of_TS.push(element[this.state.timeColumn])
    })
    var x = time_of_TS.length - time_of_TS.length * this.state.test_size
    var time_of_predicted = time_of_TS.filter((item, index) => { return index > x })

    this.setState({ time_of_predicted: time_of_predicted })
  }
  handleOnFileLoadTES = async () => {
    var predicted, prediction
    var predicted_0, predicted_1, predicted_2, predicted_3
    const response = await this.callApiTES();
    var new_values1 = this.state.mae.concat(response.data.mae)
    var new_values2 = this.state.mse.concat(response.data.mse)
    this.setState({ mae: new_values1, mse: new_values2 });
    if (response.data.data1.length > 1) {
      this.setState({ missing: true })
      console.log(Object.values((JSON.parse(response.data.data1[0])).Time))
      predicted_0 = Object.values((JSON.parse(response.data.data1[0]).Predictions))
      predicted_1 = Object.values((JSON.parse(response.data.data1[1]).Predictions))
      predicted_2 = Object.values((JSON.parse(response.data.data1[2]).Predictions))
      predicted_3 = Object.values((JSON.parse(response.data.data1[3]).Predictions))
    }
    predicted = Object.values((JSON.parse(response.data.data1[0]).Predictions))

    this.setState({
      predicted_TES: predicted,
      predicted_TES_0: predicted_0,
      predicted_TES_1: predicted_1,
      predicted_TES_2: predicted_2,
      predicted_TES_3: predicted_3,
    });
    var time_of_TS = []
    this.state.data.map((element, index) => {
      // if (index > 0)
      time_of_TS.push(element[this.state.timeColumn])
    })
    var x = time_of_TS.length - time_of_TS.length * this.state.test_size
    var time_of_predicted = time_of_TS.filter((item, index) => { return index > x })

    this.setState({ time_of_predicted: time_of_predicted })
  }
  handleOnFileLoadMA = async () => {
    var predicted, prediction
    var predicted_0, predicted_1, predicted_2, predicted_3
    const response = await this.callApiMA();
    var new_values1 = this.state.mae.concat(response.data.mae)
    var new_values2 = this.state.mse.concat(response.data.mse)
    this.setState({ mae: new_values1, mse: new_values2 });
    if (response.data.data1.length > 1) {
      this.setState({ missing: true })
      console.log(Object.values((JSON.parse(response.data.data1[0])).Time))
      predicted_0 = Object.values((JSON.parse(response.data.data1[0]).Predictions))
      predicted_1 = Object.values((JSON.parse(response.data.data1[1]).Predictions))
      predicted_2 = Object.values((JSON.parse(response.data.data1[2]).Predictions))
      predicted_3 = Object.values((JSON.parse(response.data.data1[3]).Predictions))
    }
    predicted = Object.values((JSON.parse(response.data.data1[0]).Predictions))

    this.setState({
      predicted_MA: predicted,
      predicted_MA_0: predicted_0,
      predicted_MA_1: predicted_1,
      predicted_MA_2: predicted_2,
      predicted_MA_3: predicted_3,
    });
    var time_of_TS = []
    this.state.data.map((element, index) => {
      // if (index > 0)
      time_of_TS.push(element[this.state.timeColumn])
    })
    var x = time_of_TS.length - time_of_TS.length * this.state.test_size
    var time_of_predicted = time_of_TS.filter((item, index) => { return index > x })

    this.setState({ time_of_predicted: time_of_predicted })
  }

  selectModel = (values) => {
    console.log(values)
    const graph = `${values}_graph`
    const graph_0 = `${values}_graph_0`
    const graph_1 = `${values}_graph_1`
    const graph_2 = `${values}_graph_2`
    const graph_3 = `${values}_graph_3`
    const selectedModel = []
    selectedModel.push(graph)
    selectedModel.push(graph_0)
    selectedModel.push(graph_1)
    selectedModel.push(graph_2)
    selectedModel.push(graph_3)
    selectedModel.push(values)
    this.setState({ selectedModel: selectedModel, current: 3 }, () => {
      // this.setState({ hidden2: true })
      // message.success("Complete")
      // this.onChange(3)        
      // this.render()
    })
  }


  handleOnFileLoadArima = (values) => {
    var predicted_auto_arima, predicted_arima, prediction_arima
    // console.log(values)
    // this.setState({ hidden2: false })
    const formData = new FormData();
    formData.append('test_size', this.state.test_size);
    formData.append('fill_method', this.state.fill_method);
    formData.append('timeColumn', this.state.timeColumn);
    formData.append('dataColumn', this.state.dataColumn);
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

    // console.log(formData)
    axios({
      method: 'post',
      url: 'http://127.0.0.1:8000/arima',
      data: formData,
      headers: { 'Content-Type': 'multipart/form-data' }
    })
      .then((response) => {

        predicted_arima = Object.values(JSON.parse(response.data.data1).predicted_values)
        prediction_arima = Object.values(JSON.parse(response.data.data2).predicted_values)
        const timestamps = (Object.values(JSON.parse(response.data.data2).index))

        const dates = timestamps.map(timestamp => {
          const dateObject = new Date(timestamp);
          return dateObject.toISOString().slice(0, 10);
        });
        this.setState({ predicted_arima: predicted_arima, yearsx: dates, prediction_arima: prediction_arima })
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
      // if (index > 0)
      time_of_TS.push(element[this.state.timeColumn])
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
      !this.state.missing ? {
        type: "scatter",
        mode: "lines",
        name: 'No filling',
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
    var auto_arima_graph_0 =
      this.state.missing ? {
        type: "scatter",
        mode: "lines",
        name: 'Filling with linear interpolation',
        x: this.state.time_of_predicted,
        y: this.state.predicted_auto_arima_0,
        line: { color: '#FF0000' }
      } : {
        type: "scatter",
        mode: "lines",
        name: 'no graph ',
        x: [],
        y: [],
        line: { color: '#17BECF' }
      }
    var auto_arima_graph_1 =
      this.state.missing ? {
        type: "scatter",
        mode: "lines",
        name: 'Filling with mean value',
        x: this.state.time_of_predicted,
        y: this.state.predicted_auto_arima_1,
        line: { color: '#E82CB2' }
      } : {
        type: "scatter",
        mode: "lines",
        name: 'no graph ',
        x: [],
        y: [],
        line: { color: '#17BECF' }
      }
    var auto_arima_graph_2 =
      this.state.missing ? {
        type: "scatter",
        mode: "lines",
        name: 'Filling with forward value',
        x: this.state.time_of_predicted,
        y: this.state.predicted_auto_arima_2,
        line: { color: '#E6792F' }
      } : {
        type: "scatter",
        mode: "lines",
        name: 'no graph ',
        x: [],
        y: [],
        line: { color: '#17BECF' }
      }
    var auto_arima_graph_3 =
      this.state.missing ? {
        type: "scatter",
        mode: "lines",
        name: 'Filling with backward values',
        x: this.state.time_of_predicted,
        y: this.state.predicted_auto_arima_3,
        line: { color: '#eaed11' }
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
      !this.state.missing ? {
        type: "scatter",
        mode: "lines",
        name: 'No filling',
        x: this.state.time_of_predicted,
        y: this.state.predicted_RNN,
        line: { color: '#FF0000' }
      } : {
        type: "scatter",
        mode: "lines",
        name: 'no graph ',
        x: [],
        y: [],
        line: { color: '#17BECF' }
      }
    var rnn_graph_0 =
      this.state.missing ? {
        type: "scatter",
        mode: "lines",
        name: 'Filling with linear interpolation',
        x: this.state.time_of_predicted,
        y: this.state.predicted_RNN_0,
        line: { color: '#FF0000' }
      } : {
        type: "scatter",
        mode: "lines",
        name: 'no graph ',
        x: [],
        y: [],
        line: { color: '#17BECF' }
      }
    var rnn_graph_1 =
      this.state.missing ? {
        type: "scatter",
        mode: "lines",
        name: 'Filling with mean value',
        x: this.state.time_of_predicted,
        y: this.state.predicted_RNN_1,
        line: { color: '#E82CB2' }
      } : {
        type: "scatter",
        mode: "lines",
        name: 'no graph ',
        x: [],
        y: [],
        line: { color: '#17BECF' }
      }
    var rnn_graph_2 =
      this.state.missing ? {
        type: "scatter",
        mode: "lines",
        name: 'Filling with forward value',
        x: this.state.time_of_predicted,
        y: this.state.predicted_RNN_2,
        line: { color: '#E6792F' }
      } : {
        type: "scatter",
        mode: "lines",
        name: 'no graph ',
        x: [],
        y: [],
        line: { color: '#17BECF' }
      }
    var rnn_graph_3 =
      this.state.missing ? {
        type: "scatter",
        mode: "lines",
        name: 'Filling with backward values',
        x: this.state.time_of_predicted,
        y: this.state.predicted_RNN_3,
        line: { color: '#eaed11' }
      } : {
        type: "scatter",
        mode: "lines",
        name: 'no graph ',
        x: [],
        y: [],
        line: { color: '#17BECF' }
      }

    var ses_graph =
      !this.state.missing ? {
        type: "scatter",
        mode: "lines",
        name: 'No filling',
        x: this.state.time_of_predicted,
        y: this.state.predicted_SES,
        line: { color: '#FF0000' }
      } : {
        type: "scatter",
        mode: "lines",
        name: 'no graph ',
        x: [],
        y: [],
        line: { color: '#17BECF' }
      }
    var ses_graph_0 =
      this.state.missing ? {
        type: "scatter",
        mode: "lines",
        name: 'Filling with linear interpolation',
        x: this.state.time_of_predicted,
        y: this.state.predicted_SES_0,
        line: { color: '#FF0000' }
      } : {
        type: "scatter",
        mode: "lines",
        name: 'no graph ',
        x: [],
        y: [],
        line: { color: '#17BECF' }
      }
    var ses_graph_1 =
      this.state.missing ? {
        type: "scatter",
        mode: "lines",
        name: 'Filling with mean value',
        x: this.state.time_of_predicted,
        y: this.state.predicted_SES_1,
        line: { color: '#E82CB2' }
      } : {
        type: "scatter",
        mode: "lines",
        name: 'no graph ',
        x: [],
        y: [],
        line: { color: '#17BECF' }
      }
    var ses_graph_2 =
      this.state.missing ? {
        type: "scatter",
        mode: "lines",
        name: 'Filling with forward value',
        x: this.state.time_of_predicted,
        y: this.state.predicted_SES_2,
        line: { color: '#E6792F' }
      } : {
        type: "scatter",
        mode: "lines",
        name: 'no graph ',
        x: [],
        y: [],
        line: { color: '#17BECF' }
      }
    var ses_graph_3 =
      this.state.missing ? {
        type: "scatter",
        mode: "lines",
        name: 'Filling with backward values',
        x: this.state.time_of_predicted,
        y: this.state.predicted_SES_3,
        line: { color: '#eaed11' }
      } : {
        type: "scatter",
        mode: "lines",
        name: 'no graph ',
        x: [],
        y: [],
        line: { color: '#17BECF' }
      }

    var des_graph =
      !this.state.missing ? {
        type: "scatter",
        mode: "lines",
        name: 'No filling',
        x: this.state.time_of_predicted,
        y: this.state.predicted_DES,
        line: { color: '#FF0000' }
      } : {
        type: "scatter",
        mode: "lines",
        name: 'no graph ',
        x: [],
        y: [],
        line: { color: '#17BECF' }
      }
    var des_graph_0 =
      this.state.missing ? {
        type: "scatter",
        mode: "lines",
        name: 'Filling with linear interpolation',
        x: this.state.time_of_predicted,
        y: this.state.predicted_DES_0,
        line: { color: '#FF0000' }
      } : {
        type: "scatter",
        mode: "lines",
        name: 'no graph ',
        x: [],
        y: [],
        line: { color: '#17BECF' }
      }
    var des_graph_1 =
      this.state.missing ? {
        type: "scatter",
        mode: "lines",
        name: 'Filling with mean value',
        x: this.state.time_of_predicted,
        y: this.state.predicted_DES_1,
        line: { color: '#E82CB2' }
      } : {
        type: "scatter",
        mode: "lines",
        name: 'no graph ',
        x: [],
        y: [],
        line: { color: '#17BECF' }
      }
    var des_graph_2 =
      this.state.missing ? {
        type: "scatter",
        mode: "lines",
        name: 'Filling with forward value',
        x: this.state.time_of_predicted,
        y: this.state.predicted_DES_2,
        line: { color: '#E6792F' }
      } : {
        type: "scatter",
        mode: "lines",
        name: 'no graph ',
        x: [],
        y: [],
        line: { color: '#17BECF' }
      }
    var des_graph_3 =
      this.state.missing ? {
        type: "scatter",
        mode: "lines",
        name: 'Filling with backward values',
        x: this.state.time_of_predicted,
        y: this.state.predicted_DES_3,
        line: { color: '#eaed11' }
      } : {
        type: "scatter",
        mode: "lines",
        name: 'no graph ',
        x: [],
        y: [],
        line: { color: '#17BECF' }
      }

    var tes_graph =
      !this.state.missing ? {
        type: "scatter",
        mode: "lines",
        name: 'No filling',
        x: this.state.time_of_predicted,
        y: this.state.predicted_TES,
        line: { color: '#FF0000' }
      } : {
        type: "scatter",
        mode: "lines",
        name: 'no graph ',
        x: [],
        y: [],
        line: { color: '#17BECF' }
      }
    var tes_graph_0 =
      this.state.missing ? {
        type: "scatter",
        mode: "lines",
        name: 'Filling with linear interpolation',
        x: this.state.time_of_predicted,
        y: this.state.predicted_TES_0,
        line: { color: '#FF0000' }
      } : {
        type: "scatter",
        mode: "lines",
        name: 'no graph ',
        x: [],
        y: [],
        line: { color: '#17BECF' }
      }
    var tes_graph_1 =
      this.state.missing ? {
        type: "scatter",
        mode: "lines",
        name: 'Filling with mean value',
        x: this.state.time_of_predicted,
        y: this.state.predicted_TES_1,
        line: { color: '#E82CB2' }
      } : {
        type: "scatter",
        mode: "lines",
        name: 'no graph ',
        x: [],
        y: [],
        line: { color: '#17BECF' }
      }
    var tes_graph_2 =
      this.state.missing ? {
        type: "scatter",
        mode: "lines",
        name: 'Filling with forward value',
        x: this.state.time_of_predicted,
        y: this.state.predicted_TES_2,
        line: { color: '#E6792F' }
      } : {
        type: "scatter",
        mode: "lines",
        name: 'no graph ',
        x: [],
        y: [],
        line: { color: '#17BECF' }
      }
    var tes_graph_3 =
      this.state.missing ? {
        type: "scatter",
        mode: "lines",
        name: 'Filling with backward values',
        x: this.state.time_of_predicted,
        y: this.state.predicted_TES_3,
        line: { color: '#eaed11' }
      } : {
        type: "scatter",
        mode: "lines",
        name: 'no graph ',
        x: [],
        y: [],
        line: { color: '#17BECF' }
      }
    var sma_graph =
      !this.state.missing ? {
        type: "scatter",
        mode: "lines",
        name: 'No filling',
        x: this.state.time_of_predicted,
        y: this.state.predicted_MA,
        line: { color: '#FF0000' }
      } : {
        type: "scatter",
        mode: "lines",
        name: 'no graph ',
        x: [],
        y: [],
        line: { color: '#17BECF' }
      }
    var sma_graph_0 =
      this.state.missing ? {
        type: "scatter",
        mode: "lines",
        name: 'Filling with linear interpolation',
        x: this.state.time_of_predicted,
        y: this.state.predicted_MA_0,
        line: { color: '#FF0000' }
      } : {
        type: "scatter",
        mode: "lines",
        name: 'no graph ',
        x: [],
        y: [],
        line: { color: '#17BECF' }
      }
    var sma_graph_1 =
      this.state.missing ? {
        type: "scatter",
        mode: "lines",
        name: 'Filling with mean value',
        x: this.state.time_of_predicted,
        y: this.state.predicted_MA_1,
        line: { color: '#E82CB2' }
      } : {
        type: "scatter",
        mode: "lines",
        name: 'no graph ',
        x: [],
        y: [],
        line: { color: '#17BECF' }
      }
    var sma_graph_2 =
      this.state.missing ? {
        type: "scatter",
        mode: "lines",
        name: 'Filling with forward value',
        x: this.state.time_of_predicted,
        y: this.state.predicted_MA_2,
        line: { color: '#E6792F' }
      } : {
        type: "scatter",
        mode: "lines",
        name: 'no graph ',
        x: [],
        y: [],
        line: { color: '#17BECF' }
      }
    var sma_graph_3 =
      this.state.missing ? {
        type: "scatter",
        mode: "lines",
        name: 'Filling with backward values',
        x: this.state.time_of_predicted,
        y: this.state.predicted_MA_3,
        line: { color: '#eaed11' }
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
    const steps = [
      {
        title: 'Step 1',
        content: <Step1 test={this.test}
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

          FileList={this.state.FileList}
          handleSelectFileList={this.handleSelectFileList}

          buttonRef={buttonRef}
          timeColumn={this.state.timeColumn}
          dataColumn={this.state.dataColumn}
          handleSelectData={this.handleSelectData}
          handleSelectTime={this.handleSelectTime}
          handleOpenDialog={this.handleOpenDialog}
          handleOnFileLoad={this.handleOnFileLoad}
          handleOnFileLoad1={this.handleOnFileLoad1}
          handleOnFileLoad2={this.handleOnFileLoad2}
          handleOnError={this.handleOnError}
          handleOnRemoveFile={this.handleOnRemoveFile}

          nextStep={this.next}
          previousStep={this.prev}
          //visualize
          handleSetError={this.handleSetError}
          mae={this.state.mae}
          mse={this.state.mse}
          response_data={this.state.response_data}
          filename={this.state.filename}></Step1 >,
      },
      {
        title: 'Step 2',
        content: <Step2
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


          handleUpdateTestSize={this.handleUpdateTestSize}
          handleFillMethod={this.handleFillMethod}

          testAllModel={this.testAllModel}

          handleOpenDialog={this.handleOpenDialog}
          handleOnFileLoad1={this.handleOnFileLoad1}
          handleOnFileLoad2={this.handleOnFileLoad2}
          handleOnError={this.handleOnError}

          nextStep={this.next}
          previousStep={this.prev}
          graph={graph}
          arima_graph={arima_graph}
          handleOnRemoveFile={this.handleOnRemoveFile}
          handleOnFileLoadAutoArima={this.handleOnFileLoadAutoArima}
          filename={this.state.filename}></Step2>,
      },
      {
        title: 'Step 3',
        content: <Step3

          future_values_auto_arima={this.state.future_values_auto_arima}
          future_values_arima={this.state.future_values_arima}

          hidden0={this.state.hidden0}
          hidden2={this.state.hidden2}
          hidden3={this.state.hidden3}
          file={this.state.file}
          data={this.state.data}
          time_of_TS={this.state.time_of_TS}
          yearsx={this.state.yearsx}
          data_of_TS={this.state.data_of_TS}
          predicted_auto_arima={this.state.predicted_auto_arima}

          nextStep={this.next}
          previousStep={this.prev}

          drawArima={this.drawArima}
          drawAuto_Arima={this.drawAuto_Arima}
          arima_graph={arima_graph}
          auto_arima_graph={auto_arima_graph}
          auto_arima_graph_0={auto_arima_graph_0}
          auto_arima_graph_1={auto_arima_graph_1}
          auto_arima_graph_2={auto_arima_graph_2}
          auto_arima_graph_3={auto_arima_graph_3}
          rnn_graph={rnn_graph}
          rnn_graph_0={rnn_graph_0} rnn_graph_1={rnn_graph_1} rnn_graph_2={rnn_graph_2} rnn_graph_3={rnn_graph_3}
          ses_graph={ses_graph}
          ses_graph_0={ses_graph_0} ses_graph_1={ses_graph_1} ses_graph_2={ses_graph_2} ses_graph_3={ses_graph_3}
          des_graph={des_graph}
          des_graph_0={des_graph_0} des_graph_1={des_graph_1} des_graph_2={des_graph_2} des_graph_3={des_graph_3}
          tes_graph={tes_graph}
          tes_graph_0={tes_graph_0} tes_graph_1={tes_graph_1} tes_graph_2={tes_graph_2} tes_graph_3={tes_graph_3}
          sma_graph={sma_graph}
          sma_graph_0={sma_graph_0} sma_graph_1={sma_graph_1} sma_graph_2={sma_graph_2} sma_graph_3={sma_graph_3}
          //error
          selectModel={this.selectModel}
          mae={this.state.mae}
          mse={this.state.mse}
          missing={this.state.missing}
          filename={this.state.filename}></Step3>,
      },
      {
        title: 'Step 4',
        content: <Step4

          future_values_auto_arima={this.state.future_values_auto_arima}
          future_values_arima={this.future_values_arima}

          hidden0={this.state.hidden0}
          hidden2={this.state.hidden2}
          hidden3={this.state.hidden3}
          file={this.state.file}
          data={this.state.data}
          time_of_TS={this.state.time_of_TS}
          yearsx={this.state.yearsx}
          data_of_TS={this.state.data_of_TS}
          predicted_auto_arima={this.state.predicted_auto_arima}

          nextStep={this.next}
          previousStep={this.prev}

          drawArima={this.drawArima}
          drawAuto_Arima={this.drawAuto_Arima}
          missing={this.state.missing}
          selectedModel={this.state.selectedModel}
          arima_graph={arima_graph}
          auto_arima_graph={auto_arima_graph}
          auto_arima_graph_0={auto_arima_graph_0}
          auto_arima_graph_1={auto_arima_graph_1}
          auto_arima_graph_2={auto_arima_graph_2}
          auto_arima_graph_3={auto_arima_graph_3}
          rnn_graph={rnn_graph}
          rnn_graph_0={rnn_graph_0} rnn_graph_1={rnn_graph_1} rnn_graph_2={rnn_graph_2} rnn_graph_3={rnn_graph_3}
          ses_graph={ses_graph}
          ses_graph_0={ses_graph_0} ses_graph_1={ses_graph_1} ses_graph_2={ses_graph_2} ses_graph_3={ses_graph_3}
          des_graph={des_graph}
          des_graph_0={des_graph_0} des_graph_1={des_graph_1} des_graph_2={des_graph_2} des_graph_3={des_graph_3}
          tes_graph={tes_graph}
          tes_graph_0={tes_graph_0} tes_graph_1={tes_graph_1} tes_graph_2={tes_graph_2} tes_graph_3={tes_graph_3}
          sma_graph={sma_graph}
          sma_graph_0={sma_graph_0} sma_graph_1={sma_graph_1} sma_graph_2={sma_graph_2} sma_graph_3={sma_graph_3}
          filename={this.state.filename}></Step4>,
      },
    ];

    const items = steps.map((item) => ({ key: item.title, title: item.title }));

    return (

      <>
        <Helmet>
          <title>Dashboard</title>
        </Helmet>
        <div style={{
          paddingLeft: 0, overflow: "hidden",
          // overflowY: 'scroll'
        }}>
          <Fade top duration={1000}>
            <div style={{ flex: ' 3 0 0', display: 'flex', justifyContent: 'center', flexDirection: 'column', alignItems: 'center' }}>
              <div>
                {/* <Divider /> */}
                <Steps
                  current={this.state.current}
                  // onChange={this.onChange}
                  direction="horizontal"
                  style={{ marginTop: "24px", width: '1200px', background: '#f9f9f9 ', padding: '20px', paddingLeft: "40px", borderRadius: '12px', boxShadow: "0px 2px 6px 4px rgba(0, 0, 0, 0.1)" }}
                  items={[
                    {
                      title: 'Step 1',
                      description: "Import Time Series File",
                    },
                    {
                      title: 'Step 2',
                      description: "Data Preprocessing",
                    },
                    {
                      title: 'Step 3',
                      description: "Select Forecasting Models",
                    },
                    {
                      title: 'Step 4',
                      description: "Download Models",
                    },
                  ]}
                />
              </div>
            </div>
          </Fade>
          {/* <Fade bottom duration={1000}> */}
          <div style={{ flex: ' 3 0 0', display: 'flex', flexDirection: 'column', alignItems: 'center', }}>
            <div>
              {steps[this.state.current].content}
            </div>
          </div>
          {/* </Fade > */}
        </div >
      </>
    );
  }
}

