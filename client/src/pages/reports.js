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
import { Steps } from 'antd';
const Plot = createPlotlyComponent(Plotly);

const buttonRef = React.createRef();
export class Reports extends Component {
  state = {
    selectedDate: '',
    predicted: null,
    hidden: true,
    hidden2: true,
    hidden3: true,
    arima: false,
    file: null,
    rnn: false,
    data: null,
    data2: null,
    data3: null,
    years: [],
    yearsx: [],
    sales: [],
    years2: [],
    years3: [],
    sales2: [],
    sales3: [],
    sales4: [],
    activeStep: 0,
    skipped: new Set(),
    current: 0,
  }

  onChange = (value) => {
    // console.log(value)
    this.setState({ current: value });
    console.log(this.state.current);
    console.log(value)
    // this.setState({ hidden2: true });
    this.setState({ hidden: value !== 0 ? true : false });

  };
  handleOpenDialog = (e) => {
    if (buttonRef.current) {
      buttonRef.current.open(e);
    }
  };
  handleSelectChanege = (event) => {
    this.setState({ predicted: this.state.sales4[event.target.value].toFixed(2) })
    this.setState({ selectedDate: this.state.yearsx[event.target.value] })
  };
  drawArima = () => {
    this.setState({ arima: !this.state.arima })
  }
  drawRnn = () => {
    this.setState({ rnn: !this.state.rnn })
  }
  handleOnFileLoad = (data, file) => {
    this.setState({ hidden2: false, file: file });
    var sales2, sales3, sales4
    // console.log(this.state.file)
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

        sales2 = Object.values(JSON.parse(response.data.data1).predicted_sales)

        sales3 = Object.values(JSON.parse(response.data.data2).Predictions)
        sales4 = Object.values(JSON.parse(response.data.data3).predicted_sales)

        this.setState({ sales2: sales2, sales3: sales3, sales4: sales4 })
        var yearsx = []
        var int = 10
        var y = "2021-"
        sales4.map((element, index) => {


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


        console.log(yearsx)

        this.setState({ yearsx: yearsx });
        this.setState({ hidden2: true });
        this.setState({ hidden: false });
      })
      .catch((response) => {
        //handle error
        console.log(response);
      });

    this.setState({ data: data })
    var years = []
    this.state.data.map((element, index) => {
      if (index > 0)
        years.push(element.data[0])
    })


    this.setState({ years: years })

    var years2 = years.filter((item, index) => { return index > 84 })
    this.setState({ years2: years2 })

    var years3 = years.filter((item, index) => { return index > 92 })
    this.setState({ years3: years3 })



    var sales = []
    this.state.data.map((element, index) => {
      if (index > 0)
        sales.push(element.data[1])
    })
    this.setState({ sales: sales })

  };

  handleOnFileLoad1 = (data, file) => {
    this.setState({ file: file });
    var sales2, sales3, sales4
    console.log(this.state.file)
    this.setState({ data: data })
    // console.log(this.state.data)
    Papa.parse(file, {
        header : true,
        skipEmptyLines: true,
        complete: function(result) {
          const columnArray = [];
          const valueArray = [];
          result.data.map((d)=> {
              columnArray.push(Object.keys(d))
              valueArray.push(Object.values(d))
          });
          // console.log(result.data)
          console.log(columnArray[0][1])
        }
    })
    var years = []
    var xx = ''
    this.state.data.map((element, index) => {
      if (index > 0)
        years.push(element.data[0])
      else 
        xx = element.data.length
    })
    console.log(xx)

    this.setState({ years: years })

    var years2 = years.filter((item, index) => { return index > 84 })
    this.setState({ years2: years2 })

    var years3 = years.filter((item, index) => { return index > 92 })
    this.setState({ years3: years3 })



    var sales = []
    this.state.data.map((element, index) => {
      if (index > 0)
        sales.push(element.data[1])
    })
    this.setState({ sales: sales })
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
        name: 'sales after prediction Arima ',
        x: this.state.years2,
        y: this.state.sales2,
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
        name: 'sales after prediction RNN',
        x: this.state.years3,
        y: this.state.sales3,
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
        <div style={{ display: 'flex' }}>
          <div style={{ width: '30%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <Divider />
            <Steps
              current={this.state.current}
              onChange={this.onChange}
              direction="vertical"
              style={{ width: '50%', marginTop: "100px" }}
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
          <LoadingOverlay
            active={!this.state.hidden2}
            spinner
            text='applying ARIMA and RNN algorithms'
          >

            <Container maxWidth='lg'>
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
                      <Box
                        sx={{
                          display: 'flex',
                          justifyContent: 'center',
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
                                marginBottom: 10,
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
                      </Box>

                    </CardContent>
                  </Card>
                </Box>
                <Box sx={{ m: 3, display: this.state.hidden ? 'none' : 'block', }}>
                  <Card>
                    <CardContent>                      
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
                                    name: 'sales before prediction ',
                                    x: this.state.years,
                                    y: this.state.sales,
                                    line: { color: '#17BECF' }
                                  }
                                  // ,
                                  // arima_graph,
                                  // rnn_graph


                                ]}
                                layout={{
                                  width: 1000, height: 700, title: 'SALES',
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

                            {this.state.yearsx.map((element, index) => <MenuItem key={index} value={index}>{element} </MenuItem>)}

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
                          <h3> The predicted sale is  for {this.state.selectedDate} is :
                            {'  ' + this.state.predicted + ' DA'}
                          </h3>
                        }
                      </Box>
                    </CardContent>
                    <Divider />
                  </Card>
                </Box>
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
                                    name: 'sales before prediction ',
                                    x: this.state.years,
                                    y: this.state.sales,
                                    line: { color: '#17BECF' }
                                  }
                                  ,
                                  arima_graph,
                                  rnn_graph


                                ]}
                                layout={{
                                  width: 1000, height: 700, title: 'sales',
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

                            {this.state.yearsx.map((element, index) => <MenuItem key={index} value={index}>{element} </MenuItem>)}

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
                          <h3> The predicted sale is  for {this.state.selectedDate} is :
                            {'  ' + this.state.predicted + ' DA'}
                          </h3>

                        }




                      </Box>

                    </CardContent>
                    <Divider />
                  </Card>
                </Box> */}




              </Box>
            </Container>
          </LoadingOverlay>
        </div>
      </>
    );
  }
}

