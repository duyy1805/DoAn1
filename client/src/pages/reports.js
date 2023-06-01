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
const Plot = createPlotlyComponent(Plotly);

const buttonRef = React.createRef();
export class Reports extends Component {
  state = {
    selectedDate: '',
    predicted: null,
    hidden0: false,
    hidden: true,
    hidden2: true,
    hidden3: true,
    arima: false,
    file: null,
    rnn: false,
    data: null,
    data2: null,
    data3: null,
    times: [],
    timesx: [],
    values: [],
    times2: [],
    times3: [],
    values2: [],
    values3: [],
    values4: [],
    activeStep: 0,
    skipped: new Set(),
    current: 0,
    column: [],
    timeColumn: null,
    dataColumn: null,
    filename: '',
  }

  onChange = (value) => {
    this.setState({ current: value });

    if (this.state.file == null) this.setState({ hidden: true })
    else
      this.setState({ hidden: value !== 0 ? true : false });
    if (value !== 0) this.setState({ hidden0: true })
    else
      this.setState({ hidden0: false });
  };
  handleOpenDialog = (e) => {
    console.log(e)
    if (buttonRef.current) {
      buttonRef.current.open(e);
    }
  };

  handleSelectData = (event) => {
    console.log(event.target.value)
    this.setState({ dataColumn: event.target.value }, () => {
      console.log(this.state.dataColumn)
    })

  }

  handleSelectTime = (event) => {
    console.log(event.target.value)
    this.setState({ timeColumn: event.target.value })
  }

  handleSelectChanege = (event) => {
<<<<<<< HEAD
    this.setState({ predicted: this.state.sales4[event.target.value].toFixed(2) })
    this.setState({ selectedDate: this.state.yearsx[event.target.value] })
  }
=======
    this.setState({ predicted: this.state.values4[event.target.value].toFixed(2) })
    this.setState({ selectedDate: this.state.timesx[event.target.value] })
  };
>>>>>>> 400c677ee17157f3b209218b3755c7065c2ad932
  drawArima = () => {
    this.setState({ arima: !this.state.arima })
  }
  drawRnn = () => {
    this.setState({ rnn: !this.state.rnn })
  }
  handleOnFileLoad = (data, file) => {
    this.setState({ hidden2: false, file: file });
    var values2, values3, values4
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

        values2 = Object.values(JSON.parse(response.data.data1).predicted_values)

        values3 = Object.values(JSON.parse(response.data.data2).Predictions)
        values4 = Object.values(JSON.parse(response.data.data3).predicted_values)

        this.setState({ values2: values2, values3: values3, values4: values4 })
        var timesx = []
        var int = 10
        var y = "2021-"
        values4.map((element, index) => {


          if (int > 12) {
            y = "2022-"
            int = 1
            timesx.push(y + int)

          }
          else {
            timesx.push(y + int)
          }

          int = int + 1
        })


<<<<<<< HEAD
        // console.log(yearsx)
=======
        console.log(timesx)
>>>>>>> 400c677ee17157f3b209218b3755c7065c2ad932

        this.setState({ timesx: timesx });
        this.setState({ hidden2: true });
        this.setState({ hidden: false });
      })
      .catch((response) => {
        //handle error
        console.log(response);
      });

    this.setState({ data: data })
    var times = []
    this.state.data.map((element, index) => {
      if (index > 0)
        times.push(element.data[0])
    })


    this.setState({ times: times })

    var times2 = times.filter((item, index) => { return index > 84 })
    this.setState({ times2: times2 })

    var times3 = times.filter((item, index) => { return index > 92 })
    this.setState({ times3: times3 })



    var values = []
    this.state.data.map((element, index) => {
      if (index > 0)
        values.push(element.data[1])
    })
    this.setState({ values: values })

  };

  handleOnFileLoad1 = (data, file) => {
    this.setState({ data: data })
    var times = []
    this.state.data.map((element, index) => {
      if (index > 0)
        times.push(element.data[0])
    })
    this.setState({ file: file });
    console.log(file['name'])
    this.setState({ filename: file['name'] })

    var values2, values3, values4;
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
        console.log(this.state.column);
      }
    })
    // var times = []
    // var xx = ''
    // this.state.data.map((element, index) => {
    //   if (index > 0)
    //     times.push(element.data[0])
    //   else
    //     xx = element.data.length
    // })
    // console.log(xx)

    // this.setState({ times: times })

    // var times2 = times.filter((item, index) => { return index > 84 })
    // this.setState({ times2: times2 })

    // var times3 = times.filter((item, index) => { return index > 92 })
    // this.setState({ times3: times3 })



    // var values = []
    // this.state.data.map((element, index) => {
    //   if (index > 0)
    //     values.push(element.data[1])
    // })
    // this.setState({ values: values })
    // this.setState({ hidden: false });

  };

  handleOnFileLoad2 = () => {
    var values2, values3, values4
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

        values2 = Object.values(JSON.parse(response.data.data1).predicted_values)

        values3 = Object.values(JSON.parse(response.data.data2).Predictions)
        values4 = Object.values(JSON.parse(response.data.data3).predicted_values)

        this.setState({ values2: values2, values3: values3, values4: values4 })
        var timesx = []
        var int = 10
        var y = "2021-"
        values4.map((element, index) => {


          if (int > 12) {
            y = "2022-"
            int = 1
            timesx.push(y + int)

          }
          else {
            timesx.push(y + int)
          }

          int = int + 1
        })


        console.log(timesx)

        this.setState({ timesx: timesx });
        this.setState({ hidden2: true });
        this.setState({ hidden: false });
      })
      .catch((response) => {
        //handle error
        console.log(response);
      });
    console.log(this.state.data)
    var times = []
    var xx = ''
    this.state.data.map((element, index) => {
      if (index > 0)
        times.push(element.data[this.state.timeColumn])
      else
        xx = element.data
    })

    this.setState({ times: times })

    var times2 = times.filter((item, index) => { return index > 84 })
    this.setState({ times2: times2 })

    var times3 = times.filter((item, index) => { return index > 92 })
    this.setState({ times3: times3 })



    var values = []
    this.state.data.map((element, index) => {
      if (index > 0)
        values.push(element.data[this.state.dataColumn])
    })
    console.log(this.state.dataColumn)
    this.setState({ values: values }, () => console.log(values))
    this.setState({ hidden: false });
  };
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
  handleNext = () => {
    const nextStep = this.state.activeStep + 1;
    this.setState({ activeStep: nextStep })
    console.log(this.state.activeStep)
  };

  handleBack = () => {
    const prevStep = this.state.activeStep - 1;
    this.setState({ activeStep: prevStep })

  };

  handleReset = () => {
    this.setState({ activeStep: 0 })
  };

  show = () => {
    this.setState({ hidden2: false });
    setTimeout(() => {
      this.setState({ hidden: false });
      this.setState({ hidden2: true });
    }, 2000);
  };

  render() {
    var arima_graph =
      this.state.arima ? {
        type: "scatter",
        mode: "lines",
        name: 'values after prediction Arima ',
        x: this.state.times2,
        y: this.state.values2,
        line: { color: '#FF0000' }
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
        name: 'values after prediction RNN',
        x: this.state.times3,
        y: this.state.values3,
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
        <div style={{ display: 'flex', marginLeft: '200px', marginRight: '200px' }}>
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
                  // this.state.description,
                },
                {
                  title: 'Step 3',
                  // this.state.description,
                },
                {
                  title: 'Step 4',
                  // this.state.description,
                },
              ]}
            />
          </div>
          <Step1 test={this.test}
            selectedDate={this.state.selectedDate}
            predicted={this.state.predicted}
            hidden={this.state.hidden}
            hidden0={this.state.hidden0}
            hidden2={this.state.hidden2}
            hidden3={this.state.hidden3}
            file={this.state.file}
            data={this.state.data}
            times={this.state.times}
            timesx={this.state.timesx}
            values={this.state.values}
            values2={this.state.values2}
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
            filename={this.state.filename}></Step1 >
          {/* <div style={{ flex: '5 0 0' }}>
            <LoadingOverlay
              styles={{ display: 'none' }}
              active={!this.state.hidden2}
              spinner
              text='applying ARIMA and RNN algorithms'
            >

              <Container >
                <Box
                  sx={{
                    backgroundColor: 'background.default',
                    minHeight: '100%',

                  }}
                >
                  <Box >
                    <Card sx={{ m: 0 }} >
                      <CardContent >
                        <Typography component="div" align="center" variant="h3" sx={{ textAlign: 'center', p: 1 }}>
                          Time Series Forecasting using ARIMA & RNN
                        </Typography>

                        <Divider />
                        <div className='import-container' >
                          <Row>
                            <Col span={4} offset={10}><Box className='import-button'
                              sx={{
                                display: 'flex',
                                justifyContent: 'center',
                                alignItems: 'center',
                                p: 2,
                              }}
                            >

                              <CSVReader
                                ref={buttonRef}
                                onFileLoad={this.handleOnFileLoad1}
                                onError={this.handleOnError}
                                noClick
                                noDrag
                                onRemoveFile={this.handleOnRemoveFile}
                              >
                                {({ file }) => (
                                  <aside
                                    style={{
                                      display: 'flex',
                                      flexDirection: 'row',
                                      // marginBottom: 10,
                                    }}
                                  >
                                    <Button
                                      color="primary"
                                      variant="contained"
                                      onClick={this.handleOpenDialog}

                                    >
                                      Import CSV file
                                    </Button>
                                  </aside>
                                )}
                              </CSVReader>

                            </Box></Col>
                            <Col ><div className='file-name' style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>{this.state.filename}</div></Col>
                          </Row>
                        </div>


                        <Box
                          sx={{
                            display: 'flex',
                            justifyContent: 'center',
                            p: 2
                          }}
                        >
                          <FormControl sx={{ m: 1, minWidth: 120 }}>
                            <InputLabel id="time-InputLabel">Time</InputLabel>
                            <Select
                              labelId="demo-simple-select-label"
                              id="demo-simple-select"
                              value={this.state.column[this.state.timeColumn]}
                              label="Age"

                              onChange={this.handleSelectTime}
                            >

                              {this.state.column.map((element, index) => <MenuItem key={index} value={index}>{element} </MenuItem>)}

                            </Select>
                            <FormHelperText>Select a time column</FormHelperText>
                          </FormControl>
                          <FormControl sx={{ m: 1, minWidth: 120 }}>
                            <InputLabel id="data-InputLabel">Data</InputLabel>
                            <Select
                              labelId="demo-simple-select-label"
                              id="demo-simple-select"
                              value={this.state.column[this.state.dataColumn]}
                              label="Age"

                              onChange={this.handleSelectData}
                            >

                              {this.state.column.map((element, index) => <MenuItem key={index} value={index}>{element} </MenuItem>)}

                            </Select>
                            <FormHelperText>Select a data column</FormHelperText>
                          </FormControl>
                        </Box>
                        <aside
                          style={{
                            display: 'flex',
                            flexDirection: 'row',
                            justifyContent: 'center',
                            // marginBottom: 10,
                          }}
                        >
                          <Button
                            color="primary"
                            variant="contained"
                            onClick={this.handleOnFileLoad2}

                          >
                            Run
                          </Button>
                        </aside>
                      </CardContent>
                    </Card>
                  </Box>
                  <Box sx={{ m: 3, display: this.state.hidden ? 'none' : 'block', }}>
                    <Card>
                      <CardContent>
                        <Box >
                          <Box sx={{ m: 3 }} display="flex" justifyContent="center">
                            <Grid
                              container
                              spacing={0}
                              direction="column"
                              alignItems="center"
                              justify="center"
                            >
                              <div>
                                <Plot
                                  data={[
                                    {
                                      type: "scatter",
                                      mode: "lines",
                                      name: 'values before prediction ',
                                      x: this.state.times,
                                      y: this.state.values,
                                      line: { color: '#17BECF' }
                                    }
                                    // ,
                                    // arima_graph,
                                    // rnn_graph


                                  ]}
                                  layout={{
                                    //width: 1000, height: 700, 
                                    title: 'SALES',
                                    xaxis: {
                                      title: 'date(Monthly)',
                                    },
                                    yaxis: {
                                      title: 'Time series data'
                                    },
                                  }}
                                />
                              </div>
                            </Grid>
                          </Box>
                        </Box>

                        <Box
                          sx={{
                            display: 'flex',
                            justifyContent: 'center',
                            p: 2
                          }}
                        >
                          <FormControl sx={{ m: 1, minWidth: 120 }}>
                            <InputLabel id="demo-simple-select-helper-label">select</InputLabel>
                            <Select
                              labelId="demo-simple-select-label"
                              id="demo-simple-select"
                              value={this.state.selectedDate}
                              label="Age"

                              onChange={this.handleSelectChanege}
                            >

                              {this.state.timesx.map((element, index) => <MenuItem key={index} value={index}>{element} </MenuItem>)}

                            </Select>
                            <FormHelperText>select a date to make prediction</FormHelperText>
                          </FormControl>

                        </Box>

                        <Box
                          sx={{
                            display: 'flex',
                            justifyContent: 'center',
                            p: 2
                          }}
                        >
                          {this.state.predicted !== null &&
                            <h3> The predicted value is  for {this.state.selectedDate} is :
                              {'  ' + this.state.predicted + ' DA'}
                            </h3>
                          }
                        </Box>
                      </CardContent>
                      <Divider />
                      <Descriptions title="User Info">
                        <Descriptions.Item label="UserName">Zhou Maomao</Descriptions.Item>
                        <Descriptions.Item label="Telephone">1810000000</Descriptions.Item>
                        <Descriptions.Item label="Live">Hangzhou, Zhejiang</Descriptions.Item>
                        <Descriptions.Item label="Remark">empty</Descriptions.Item>
                        <Descriptions.Item label="Address">
                          No. 18, Wantang Road, Xihu District, Hangzhou, Zhejiang, China
                        </Descriptions.Item>
                      </Descriptions>
                    </Card>
                  </Box> */}
          {/* <Box sx={{ m: 3, display: this.state.hidden ? 'none' : 'block', }}>
                  <Card>
                    <CardContent>
                      <Box
                        sx={{
                          display: 'flex',
                          justifyContent: 'flex-end',
                          p: 2
                        }}
                      >
                        <Button
                          color="primary"
                          variant="contained"
                          onClick={this.drawArima}
                          sx={{
                            m: 1,
                          }}
                        >
                          Apply ARIMA Model
                        </Button>
                        <Button
                          color="primary"
                          variant="contained"
                          onClick={this.drawRnn}
                          sx={{
                            m: 1,
                          }}
                        >
                          Apply RNN Model
                        </Button>

                      </Box>
                      <Box sx={{ maxWidth: 1000 }}>

                        <Box sx={{ m: 3 }} display="flex" justifyContent="center">
                          <Grid
                            container
                            spacing={0}
                            direction="column"
                            alignItems="center"
                            justify="center"
                          >
                            <div>
                              <Plot
                                data={[
                                  {

                                    type: "scatter",
                                    mode: "lines",
                                    name: 'values before prediction ',
                                    x: this.state.times,
                                    y: this.state.values,
                                    line: { color: '#17BECF' }
                                  }
                                  ,
                                  arima_graph,
                                  rnn_graph


                                ]}
                                layout={{
                                  width: 1000, height: 700, title: 'values',
                                  xaxis: {
                                    title: 'date(Monthly)',
                                  },
                                  yaxis: {
                                    title: 'Time series data'
                                  },
                                }}
                              />
                            </div>
                          </Grid>
                        </Box>
                      </Box>


                      <Box
                        sx={{
                          display: 'flex',
                          justifyContent: 'center',
                          p: 2
                        }}
                      >
                        <FormControl sx={{ m: 1, minWidth: 120 }}>
                          <InputLabel id="demo-simple-select-helper-label">select</InputLabel>
                          <Select
                            labelId="demo-simple-select-label"
                            id="demo-simple-select"
                            value={this.state.selectedDate}
                            label="Age"

                            onChange={this.handleSelectChanege}
                          >

                            {this.state.timesx.map((element, index) => <MenuItem key={index} value={index}>{element} </MenuItem>)}

                          </Select>
                          <FormHelperText>select a date to make prediction</FormHelperText>
                        </FormControl>

                      </Box>

                      <Box
                        sx={{
                          display: 'flex',
                          justifyContent: 'center',
                          p: 2
                        }}
                      >
                        {this.state.predicted !== null &&
                          <h3> The predicted value is  for {this.state.selectedDate} is :
                            {'  ' + this.state.predicted + ' DA'}
                          </h3>

                        }




                      </Box>

                    </CardContent>
                    <Divider />
                  </Card>
                </Box> */}




          {/* </Box>
              </Container>
            </LoadingOverlay>

          </div> */}

        </div>
      </>
    );
  }
}

