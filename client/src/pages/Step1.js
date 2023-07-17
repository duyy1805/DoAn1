import React, { Component, useEffect, useState } from 'react';
import { Helmet } from 'react-helmet';
import DownloadIcon from '@material-ui/icons/PictureAsPdf';
import LoadingOverlay from 'react-loading-overlay';
import {
  Box,
  Container,
  Card,
  CardContent,
  Button as ButtonMui,
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
import {
  Steps, Descriptions, Row,
  Col, Button, Tabs, Badge,
  message, Upload
} from 'antd';
// import { AiOutlineArrowLeft, AiOutlineArrowRight } from 'react-icons/ai';
import { animated, useSpring } from '@react-spring/web'

import type { RcFile, UploadFile, UploadProps } from 'antd/es/upload/interface';
import { InboxOutlined } from '@ant-design/icons';

const { Dragger } = Upload;

const Plot = createPlotlyComponent(Plotly);
const Step1 = (props) => {
  const { hidden_step1, hidden0, hidden2, handleSelectChanege, test, handleOnFileLoad, handleOnFileLoad1, handleOnError, handleOnRemoveFile,
    handleOpenDialog, buttonRef, handleSelectTime, future_values_auto_arima, nextStep, previousStep,
    //visualize
    sum_values, values_count, missing_values_count, max_values, min_values, mean_values, median_values, std_values, variance_values, skewness_values,
    selectedDate, filename, yearx, column, timeColumn, dataColumn, data_of_TS, yearsx, time_of_TS, predicted_auto_arima, handleOnFileLoad2, handleSelectData } = props;
  // useEffect(() => { console.log(sum_values) }, [sum_values]);
  const [fileList, setFileList] = useState([]);

  const props1: UploadProps = {
    onRemove: (file) => {
      const index = fileList.indexOf(file);
      const newFileList = fileList.slice();
      newFileList.splice(index, 1);
      setFileList(newFileList);
      if (newFileList.length !== 0) {
        handleOnFileLoad(newFileList[newFileList.length - 1])
      }
    },
    beforeUpload: (file) => {
      setFileList([...fileList, file]);
      handleOnFileLoad(file)
      return false;
    },
  };
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
              // backgroundColor: 'background.default',
              minHeight: '100%',
              display: hidden0 ? 'none' : 'block',
            }}
          >
            <Box sx={{ m: 3, }} >
              <Card sx={{ m: 0 }} style={{ boxShadow: "0px 2px 6px 4px rgba(0, 0, 0, 0.1)", borderRadius: "12px" }} >
                <CardContent sx={{ width: "1000px" }}>
                  <Typography component="div" align="center" variant="h3" sx={{ textAlign: 'center', p: 1, fontSize: '2.5rem' }}>
                    Time Series Forecasting
                  </Typography>

                  <Divider />
                  {/* <div className='import-container' style={{}}>
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
                                whiteSpace: 'nowrap'
                                // marginBottom: 10,
                              }}
                            >
                              <Button
                                type="primary"
                                // variant="contained"
                                onClick={handleOpenDialog}
                              >
                                Import file
                              </Button>
                            </aside>
                          )}
                        </CSVReader>

                      </Box>
                      </Col>
                      <Col style={{ display: 'flex' }}><div className='file-name' style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>{filename}</div></Col>
                    </Row>
                  </div> */}
                  <Dragger {...props1} style={{ marginTop: 30 }}>
                    <p className="ant-upload-drag-icon">
                      <InboxOutlined />
                    </p>
                    <p className="ant-upload-text">Click or drag file to this area to upload</p>
                    <p className="ant-upload-hint">
                      Support for a single or bulk upload. Strictly prohibited from uploading company data or other
                      banned files.
                    </p>
                  </Dragger>
                  {fileList.length !== 0 ? (

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
                          value={timeColumn}
                          label="Time"
                          sx={{ borderRadius: '10px' }}
                          onChange={handleSelectTime}
                        >

                          {column.map((element, index) => <MenuItem key={index} value={element}>{element} </MenuItem>)}

                        </Select>
                        <FormHelperText>Select a time column</FormHelperText>
                      </FormControl>
                      <FormControl sx={{ m: 1, minWidth: 120 }}>
                        <InputLabel id="data-InputLabel">Data</InputLabel>
                        <Select
                          labelId="demo-simple-select-label"
                          id="demo-simple-select"
                          value={dataColumn}
                          sx={{ borderRadius: '10px' }}
                          label="Data"
                          onChange={handleSelectData}
                        >

                          {column.map((element, index) => <MenuItem key={index} value={element}>{element} </MenuItem>)}

                        </Select>
                        <FormHelperText>Select a data column</FormHelperText>
                      </FormControl>
                    </Box>
                  ) : null}
                  < aside
                    style={{
                      display: 'flex',
                      flexDirection: 'row',
                      justifyContent: 'center',
                      // marginBottom: 10,
                    }}
                  >
                    {fileList.length !== 0 ? (
                      <Button
                        type="primary"
                        // variant="contained"
                        onClick={handleOnFileLoad2}

                      >
                        Run
                      </Button>
                    ) : null}
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
                                        x: time_of_TS,
                                        y: data_of_TS,
                                        line: { color: '#17BECF' }
                                      }
                                      // ,
                                      // arima_graph,
                                      // rnn_graph


                                    ]}
                                    layout={{
                                      width: 900, height: 700,
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
                    label: 'Info',
                    key: '2',
                    children:
                      <Box sx={{ m: 3, display: hidden_step1 ? 'none' : 'block', }}>
                        <Card sx={{ padding: 2 }}>
                          {/* <Divider /> */}
                          <Descriptions title="Info" bordered>
                            <Descriptions.Item label="Values count">{values_count}</Descriptions.Item>
                            <Descriptions.Item label="Missing values">{missing_values_count}</Descriptions.Item>
                            <Descriptions.Item label="Sum values">{sum_values}</Descriptions.Item>
                            <Descriptions.Item label="Max value">{max_values}</Descriptions.Item>
                            <Descriptions.Item label="Min value" span={2}>
                              {min_values}
                            </Descriptions.Item>
                            <Descriptions.Item label="Mean values" span={3}>
                              {mean_values}
                            </Descriptions.Item>
                            <Descriptions.Item label="Trung vị">{median_values}</Descriptions.Item>
                            <Descriptions.Item label="Độ lệch chuẩn">{std_values}</Descriptions.Item>
                            <Descriptions.Item label="Phương sai">{variance_values}</Descriptions.Item>
                            <Descriptions.Item label="Độ lệch của chuỗi">
                              {skewness_values}
                            </Descriptions.Item>
                          </Descriptions>
                        </Card>
                      </Box>
                  },
                ]}
              />
              <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '10px' }}>
                <Button
                  type="primary"
                  // variant="contained"
                  onClick={nextStep}
                  style={{ margin: '0 8px' }}
                >
                  Next
                  {/* <AiOutlineArrowRight size={20} style={{ marginLeft: '5px' }} /> */}
                </Button>
              </div>
            </Box>
          </Box>
        </Container>
      </LoadingOverlay>

    </div >
  );
};

export default Step1;