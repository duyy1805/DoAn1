import React, { useState, useEffect } from 'react';
// import { Helmet } from 'react-helmet';
// import DownloadIcon from '@material-ui/icons/PictureAsPdf';
import LoadingOverlay from 'react-loading-overlay';
import {
  Box,
  Container,
  Card,
  CardContent,
  // Button as ButtonMui,
  Grid,
  MenuItem,
  Divider,
  Select,
  FormControl,
  InputLabel,
  FormHelperText,
  Typography,
  // Zoom,
  // Step,
  // StepLabel,
  // Stepper,
  // StepContent,
  // InputNumber


} from '@material-ui/core';
import Plotly from "plotly.js-basic-dist";
import createPlotlyComponent from "react-plotly.js/factory";
import {
  Descriptions,
  Button, Tabs,
  Upload
} from 'antd';
import { Fade, Slide, Zoom, LightSpeed, Bounce } from "react-reveal";
import type { UploadProps } from 'antd/es/upload/interface';
import { InboxOutlined } from '@ant-design/icons';

const { Dragger } = Upload;

const Plot = createPlotlyComponent(Plotly);
const Step1 = (props) => {
  const { hidden_step1, hidden0, hidden2, handleOnFileLoad, response_data,
    handleSelectTime, nextStep, FileList, handleSelectFileList,
    //visualize
    column, timeColumn, dataColumn, data_of_TS, time_of_TS, handleOnFileLoad2, handleSelectData } = props;
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
  useEffect(() => { setFileList(FileList) }, [])
  useEffect(() => { handleSelectFileList(fileList) }, [fileList]);

  return (
    <div >
      <LoadingOverlay
        styles={{ display: 'none' }}
        active={!hidden2}
        spinner
        text='Loading'
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
              <Fade bottom duration={1000}>
                <Card sx={{ m: 0 }} style={{ boxShadow: "0px 2px 6px 4px rgba(0, 0, 0, 0.1)", borderRadius: "12px" }} >
                  <CardContent sx={{ width: "1000px" }}>
                    <Typography component="div" align="center" variant="h3" sx={{ textAlign: 'center', p: 1, fontSize: '2.5rem' }}>
                      Time Series Forecasting
                    </Typography>

                    <Divider />

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
                        < aside
                          style={{
                            position: 'absolute',
                            // display: 'flex',
                            // flexDirection: 'row',
                            // justifyContent: 'center',
                            marginTop: 15,
                            marginLeft: 450
                          }}
                        >
                          {fileList.length !== 0 ? (
                            <Button
                              type="primary"
                              // variant="contained"
                              onClick={handleOnFileLoad2}

                            >
                              Visualization
                            </Button>
                          ) : null}
                        </aside>
                      </Box>
                    ) : null}
                  </CardContent>
                </Card>
              </Fade>
            </Box>
            <Box sx={{ m: 3, display: hidden_step1 ? 'none' : 'block', }}>
              <Zoom left duration={1000}>
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
                              <Descriptions.Item label="Values count">{response_data.values_count}</Descriptions.Item>
                              <Descriptions.Item label="Missing values">{response_data.missing_values_count}</Descriptions.Item>
                              <Descriptions.Item label="Sum values">{response_data.sum_values}</Descriptions.Item>
                              <Descriptions.Item label="Max value">{response_data.max_values}</Descriptions.Item>
                              <Descriptions.Item label="Min value" span={2}>
                                {response_data.min_values}
                              </Descriptions.Item>
                              <Descriptions.Item label="Mean values" span={3}>
                                {response_data.mean_values}
                              </Descriptions.Item>
                              <Descriptions.Item label="Meadian">{response_data.median_values}</Descriptions.Item>
                              <Descriptions.Item label="Standard deviation">{response_data.std_values}</Descriptions.Item>
                              <Descriptions.Item label="Variance">{response_data.variance_values}</Descriptions.Item>
                              <Descriptions.Item label="Skewness">
                                {response_data.skewness_values}
                              </Descriptions.Item>
                            </Descriptions>
                          </Card>
                        </Box>
                    },
                  ]}
                />
              </Zoom>
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