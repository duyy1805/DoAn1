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
    StepContent


} from '@material-ui/core';
import Papa from "papaparse";
import { CSVReader } from 'react-papaparse';
import axios from 'axios';
import Plotly from "plotly.js-basic-dist";
import createPlotlyComponent from "react-plotly.js/factory";
import { number } from 'prop-types';
import { InputNumber, Row, Col, Tabs, Badge, Form, Button, Checkbox, Input } from 'antd';

const Plot = createPlotlyComponent(Plotly);
const onFinish = (values: any) => {
    console.log('Success:', values);
};

const onFinishFailed = (errorInfo: any) => {
    console.log('Failed:', errorInfo);
};

const Step4 = (props) => {
    const { hidden_step1, hidden_step3, hidden_step4, hidden0, hidden2, handleSelectChanege, test, handleOnFileLoad1, handleOnError, handleOnRemoveFile,
        handleOpenDialog, buttonRef, handleSelectTime, predicted, handleOnFileLoadAutoArima, graph, arima_graph, drawArima,
        selectedDate, filename, yearx, column, timeColumn, dataColumn, years, yearsx, sales, sales2, handleOnFileLoad2, handleSelectData } = props;
    // useEffect(() => {
    //     console.log(arima_graph)
    // }, [])
    return (
        <div>
            <Container >
                <Box sx={{ m: 3, display: hidden_step4 ? 'none' : 'block' }}>
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
                                    type="primary"
                                    // variant="contained"
                                    onClick={drawArima}
                                    sx={{
                                        m: 1,
                                    }}
                                >
                                    Apply ARIMA Model
                                </Button>
                                {/* <Button
                                    color="primary"
                                    variant="contained"
                                    onClick={this.drawRnn}
                                    sx={{
                                        m: 1,
                                    }}
                                >
                                    Apply RNN Model
                                </Button> */}

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
                                                        name: ' before prediction ',
                                                        x: years,
                                                        y: sales,
                                                        line: { color: '#17BECF' }
                                                    }
                                                    ,
                                                    arima_graph,
                                                    // rnn_graph


                                                ]}
                                                layout={{
                                                    width: 900, height: 700, title: 'Time series data',
                                                    xaxis: {
                                                        title: 'Time',
                                                    },
                                                    yaxis: {
                                                        title: 'Data'
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
                                        value={selectedDate}
                                        label="Age"

                                        onChange={handleSelectChanege}
                                    >

                                        {yearsx.map((element, index) => <MenuItem key={index} value={index}>{element} </MenuItem>)}

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





                            </Box>

                        </CardContent>
                        <Divider />
                    </Card>
                </Box>




            </Container>
        </div >
    );
};

export default Step4;