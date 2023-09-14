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
  Upload, InputNumber
} from 'antd';
import { Fade, Slide, Zoom, LightSpeed, Bounce } from "react-reveal";
import type { UploadProps } from 'antd/es/upload/interface';
import { InboxOutlined } from '@ant-design/icons';
import Papa from "papaparse";
import axios from 'axios';

const { Dragger } = Upload;

const Plot = createPlotlyComponent(Plotly);
const Billing = () => {

  const [fileList, setFileList] = useState([]);
  const [file, setFile] = useState();
  const [column, setColumn] = useState([])
  const [timeColumn, setTimeColumn] = useState()
  const [dataColumn, setDataColumn] = useState()
  const [n_periods, setN_Periods] = useState(1)
  const [forecasting, setForecasting] = useState([])

  const handleOnFileLoad = (file) => {
    setFile(file);
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
        setColumn(columnArray[0]);
      }
    })
  }

  const forecast = () => {
    const formData = new FormData();
    formData.append('timeColumn', timeColumn);
    formData.append('dataColumn', dataColumn);
    formData.append('n_periods', n_periods);
    formData.append('file', file, 'file.csv')
    axios({
      method: 'post',
      url: 'http://127.0.0.1:8000/forecasting',
      data: formData,
      headers: { 'Content-Type': 'multipart/form-data' }
    })
      .then((response) => {
        setForecasting(response.data.predictions)
        window.scrollTo({
          top: 700,
          behavior: "smooth", // Sử dụng smooth behavior để kích hoạt cuộn mềm mại
        });
      })
      .catch((response) => {
        //handle error
        console.log(response);
      });

  }
  const props1: UploadProps = {
    onRemove: (file) => {
      const index = fileList.indexOf(file);
      const newFileList = fileList.slice();
      newFileList.splice(index, 1);
      setFileList(newFileList);
    },
    beforeUpload: (file) => {
      setFileList([...fileList, file]);
      handleOnFileLoad(file)
      return false;
    },
  };
  // useEffect(() => { setFileList(FileList) }, [])

  return (
    <div >
      <Container style={{ padding: 0 }} >
        <Box
          sx={{
            // backgroundColor: 'background.default',
            minHeight: '100%',
            // display: hidden0 ? 'none' : 'block',
          }}
        >
          <Box sx={{ m: 0, }} style={{ marginTop: 24 }} >
            <Fade bottom duration={1000}>
              <Card sx={{ m: 0 }} style={{ boxShadow: "0px 2px 6px 4px rgba(0, 0, 0, 0.1)", borderRadius: "12px" }} >
                <CardContent sx={{ width: "1200px" }}>
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
                          onChange={(event) => setTimeColumn(event.target.value)}
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
                          onChange={(event) => setDataColumn(event.target.value)}
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
                      </aside>
                    </Box>
                  ) : null}
                  {fileList.length !== 0 ? (
                    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                      <InputNumber
                        defaultValue={1}
                        max={30} min={0} step={1} size="large"
                        style={{ marginRight: 10, width: 200 }}
                        addonBefore="Forecasting number"
                        value={n_periods}
                        onChange={(value) => (setN_Periods(value))}
                      />
                      <Button
                        type="primary"
                        // variant="contained"
                        onClick={forecast}
                        style={{ marginLeft: 10 }}
                      >
                        Predict
                      </Button>
                    </div>
                  ) : null}
                </CardContent>
                {forecasting.length !== 0 ? (
                  <div style={{ textAlign: 'center', marginTop: '20px', marginBottom: 20 }}>
                    Predictions values
                  </div>
                ) : null}
                <div style={{ textAlign: 'center', marginTop: '20px', marginBottom: 20 }}>
                  {forecasting.map((prediction, index) => (
                    <span key={index} style={{ marginRight: '10px' }}>{prediction}</span>
                  ))}
                </div>
              </Card>
            </Fade>
          </Box>
        </Box>
      </Container>
    </div >
  );
};


export default Billing;
