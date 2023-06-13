import React, { Component, useEffect, useState } from 'react';
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
  StepContent,
  InputNumber


} from '@material-ui/core';
import Papa from "papaparse";
import { CSVReader } from 'react-papaparse';
import axios from 'axios';
import Plotly from "plotly.js-basic-dist";
import createPlotlyComponent from "react-plotly.js/factory";
import { number } from 'prop-types';
import { Steps, Descriptions, Row, Col, Tabs, Badge } from 'antd';
const Plot = createPlotlyComponent(Plotly);
const Step1 = (props) => {
  const { hidden_step1, hidden0, hidden2, handleSelectChanege, test, handleOnFileLoad1, handleOnError, handleOnRemoveFile,
    handleOpenDialog, buttonRef, handleSelectTime, predicted,
    //visualize
    sum_values, values_count, missing_values_count,
    selectedDate, filename, yearx, column, timeColumn, dataColumn, years, yearsx, sales, sales2, handleOnFileLoad2, handleSelectData } = props;
  // useEffect(() => { console.log(sum_values) }, [sum_values]);
  return (
    <div >
      <LoadingOverlay
        styles={{ display: 'none' }}
        active={!hidden2}
        spinner
        text='Lunas'
      >

        <Container >
          <Box
            sx={{
              backgroundColor: 'background.default',
              minHeight: '100%',
              display: hidden0 ? 'none' : 'block',
            }}
          >
            <Box sx={{ m: 3, }}>
              <Card sx={{ m: 0 }} >
                <CardContent >
                  <Typography component="div" align="center" variant="h3" sx={{ textAlign: 'center', p: 1 }}>
                    Time Series Forecasting using ARIMA & RNN
                  </Typography>

                  <Divider />
                  <div className='import-container' style={{}}>
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
                          onFileLoad={handleOnFileLoad1}
                          onError={handleOnError}
                          noClick
                          noDrag
                          onRemoveFile={handleOnRemoveFile}
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
                                onClick={handleOpenDialog}

                              >
                                Import CSV file
                              </Button>
                            </aside>
                          )}
                        </CSVReader>

                      </Box></Col>
                      <Col style={{ display: 'flex' }}><div className='file-name' style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>{filename}</div></Col>
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
                        value={column[timeColumn]}
                        label="Age"

                        onChange={handleSelectTime}
                      >

                        {column.map((element, index) => <MenuItem key={index} value={index}>{element} </MenuItem>)}

                      </Select>
                      <FormHelperText>Select a time column</FormHelperText>
                    </FormControl>
                    <FormControl sx={{ m: 1, minWidth: 120 }}>
                      <InputLabel id="data-InputLabel">Data</InputLabel>
                      <Select
                        labelId="demo-simple-select-label"
                        id="demo-simple-select"
                        value={column[dataColumn]}
                        label="Age"

                        onChange={handleSelectData}
                      >

                        {column.map((element, index) => <MenuItem key={index} value={index}>{element} </MenuItem>)}

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
                      onClick={handleOnFileLoad2}

                    >
                      Run
                    </Button>
                  </aside>
                </CardContent>
              </Card>
            </Box>
            <Box sx={{ m: 3, display: hidden_step1 ? 'none' : 'block', }}>
              <Tabs
                defaultActiveKey="1"
                items={[
                  {
                    label: 'Graph',
                    key: '1',
                    children:

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
                                        name: ' before prediction ',
                                        x: years,
                                        y: sales,
                                        line: { color: '#17BECF' }
                                      }
                                      // ,
                                      // arima_graph,
                                      // rnn_graph


                                    ]}
                                    layout={{
                                      width: 1000, height: 700,
                                      title: 'TIME SERIES DATA',
                                      xaxis: {
                                        title: 'Time',
                                      },
                                      yaxis: {
                                        title: 'Data'
                                      },
                                      font: {
                                        family: '-apple - system, BlinkMacSystemFont, Segoe UI, Roboto, Helvetica Neue, Arial, Noto Sans, sans- serif, Apple Color Emoji, Segoe UI Emoji, Segoe UI Symbol, Noto Color Emoji',
                                        size: 14,
                                        color: 'black'
                                      }
                                    }}
                                  />
                                </div>
                              </Grid>
                            </Box>
                          </Box>


                        </CardContent>
                      </Card>

                  },
                  {
                    label: 'Visualization',
                    key: '2',
                    children:
                      <Box sx={{ m: 3, display: hidden_step1 ? 'none' : 'block', }}>
                        <Card sx={{ padding: 2 }}>
                          {/* <Divider /> */}
                          <Descriptions title="Visualization" bordered>
                            <Descriptions.Item label="Values count">{values_count}</Descriptions.Item>
                            <Descriptions.Item label="Missing values">{missing_values_count}</Descriptions.Item>
                            <Descriptions.Item label="Sum values">{sum_values}</Descriptions.Item>
                            <Descriptions.Item label="Max value">0</Descriptions.Item>
                            <Descriptions.Item label="Min value" span={2}>

                            </Descriptions.Item>
                            <Descriptions.Item label="Giá trị trung bình" span={3}>
                              <Badge status="processing" text="Running" />
                            </Descriptions.Item>
                            <Descriptions.Item label="Trung vị">10</Descriptions.Item>
                            <Descriptions.Item label="Độ lệch chuẩn">0</Descriptions.Item>
                            <Descriptions.Item label="Phương sai">0</Descriptions.Item>
                            <Descriptions.Item label="Độ lệch của chuỗi">

                            </Descriptions.Item>
                          </Descriptions>
                        </Card>
                      </Box>
                  },
                ]}
              />
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
  );
};

export default Step1;