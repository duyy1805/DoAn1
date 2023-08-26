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
import {
    InputNumber, Row, Col, Tabs, Badge, Form,
    Tag, Button, Checkbox, Input, message, Space, Table
} from 'antd';
// import photo1 from '../../assets/images/logo.png';
// import photo2 from '../../assets/images/face-1.jpg';
import "./styles.css"
const { Column, ColumnGroup } = Table;

const Plot = createPlotlyComponent(Plotly);
const onFinish = (values: any) => {
    console.log('Success:', values);
};

const onFinishFailed = (errorInfo: any) => {
    console.log('Failed:', errorInfo);
};


const handleDownloadClick = () => {
    const JSZip = require('jszip'); // Import thư viện JSZip hoặc thư viện tương tự
    const zip = new JSZip();

    const photo1 = require('../../assets/images/logo.png');
    const photo2 = require('../../assets/images/face-1.jpg');

    // Thêm hình ảnh vào tệp ZIP
    zip.file('image1.png', photo1, { binary: true });
    zip.file('image2.png', photo2, { binary: true });

    // Tạo tệp ZIP và tải xuống
    zip.generateAsync({ type: 'blob' }).then((content) => {
        const link = document.createElement('a');
        link.href = URL.createObjectURL(content);
        link.download = 'images.zip'; // Đặt tên tệp ZIP ở đây
        link.click();
    });
};

const Step4 = (props) => {
    const { previousStep, graph,
        auto_arima_graph, auto_arima_graph_0, auto_arima_graph_1, auto_arima_graph_2, auto_arima_graph_3,
        arima_graph, rnn_graph, rnn_graph_0, rnn_graph_1, rnn_graph_2, rnn_graph_3,
        ses_graph, ses_graph_0, ses_graph_1, ses_graph_2, ses_graph_3,
        des_graph, des_graph_0, des_graph_1, des_graph_2, des_graph_3,
        tes_graph, tes_graph_0, tes_graph_1, tes_graph_2, tes_graph_3,
        ma_graph, ma_graph_0, ma_graph_1, ma_graph_2, ma_graph_3,
        //error
        mae, mse, missing, selectedModel,
        time_of_TS, data_of_TS
    } = props;
    useEffect(() => {
        console.log(selectedModel)
    }, [])


    return (
        <div>
            {!missing ? (
                <CardContent style={{ backgroundColor: "transparent", display: 'grid', gridTemplateColumns: 'repeat(1, 1fr)', marginTop: 10 }}>
                    <Box sx={{ m: 3 }} style={{ margin: 2 }}>
                        <div>
                            <div className="image-container">
                                <Plot
                                    data={[
                                        {

                                            type: "scatter",
                                            mode: "lines",
                                            name: 'Original data',
                                            x: time_of_TS,
                                            y: data_of_TS,
                                            line: { color: '#17BECF' }
                                        }
                                        ,
                                        eval(selectedModel[0]),
                                        // rnn_graph

                                    ]}
                                    layout={{
                                        width: 550, height: 400, title: 'ARIMA Model',
                                        xaxis: {
                                            title: 'Time',
                                        },
                                        yaxis: {
                                            title: 'Data'
                                        },
                                    }}
                                />
                                <div className="overlay">
                                    <Button type="primary" onClick={handleDownloadClick}>
                                        <i className="fa fa-download"></i> Download model
                                    </Button>
                                </div>
                            </div>
                        </div >
                    </Box>
                </CardContent>)
                :
                (
                    <CardContent style={{ backgroundColor: "transparent", display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', marginTop: 10 }}>
                        <Box sx={{ m: 3 }} style={{ margin: 2 }}>
                            <div>
                                <div className="image-container">
                                    <Plot
                                        data={[
                                            {

                                                type: "scatter",
                                                mode: "lines",
                                                name: 'Original data',
                                                x: time_of_TS,
                                                y: data_of_TS,
                                                line: { color: '#17BECF' }
                                            }
                                            ,
                                            eval(selectedModel[1]),
                                            // rnn_graph

                                        ]}
                                        layout={{
                                            width: 550, height: 400, title: 'ARIMA Model',
                                            xaxis: {
                                                title: 'Time',
                                            },
                                            yaxis: {
                                                title: 'Data'
                                            },
                                        }}
                                    />
                                    <div className="overlay">
                                        <Button type="primary" onClick={handleDownloadClick}>
                                            <i className="fa fa-download"></i> Download model
                                        </Button>
                                    </div>
                                </div>
                            </div >
                        </Box>
                        <Box sx={{ m: 3 }} style={{ margin: 2 }}>
                            <div>
                                <div className="image-container">
                                    <Plot
                                        data={[
                                            {

                                                type: "scatter",
                                                mode: "lines",
                                                name: 'Original data',
                                                x: time_of_TS,
                                                y: data_of_TS,
                                                line: { color: '#17BECF' }
                                            }
                                            ,
                                            eval(selectedModel[2]),
                                            // rnn_graph

                                        ]}
                                        layout={{
                                            width: 550, height: 400, title: 'ARIMA Model',
                                            xaxis: {
                                                title: 'Time',
                                            },
                                            yaxis: {
                                                title: 'Data'
                                            },
                                        }}
                                    />
                                    <div className="overlay">
                                        <Button type="primary" onClick={handleDownloadClick}>
                                            <i className="fa fa-download"></i> Download model
                                        </Button>
                                    </div>
                                </div>
                            </div >
                        </Box>
                        <Box sx={{ m: 3 }} style={{ margin: 2 }}>
                            <div>
                                <div className="image-container">
                                    <Plot
                                        data={[
                                            {

                                                type: "scatter",
                                                mode: "lines",
                                                name: 'Original data',
                                                x: time_of_TS,
                                                y: data_of_TS,
                                                line: { color: '#17BECF' }
                                            }
                                            ,
                                            eval(selectedModel[3]),
                                            // rnn_graph

                                        ]}
                                        layout={{
                                            width: 550, height: 400, title: 'ARIMA Model',
                                            xaxis: {
                                                title: 'Time',
                                            },
                                            yaxis: {
                                                title: 'Data'
                                            },
                                        }}
                                    />
                                    <div className="overlay">
                                        <Button type="primary" onClick={handleDownloadClick}>
                                            <i className="fa fa-download"></i> Download model
                                        </Button>
                                    </div>
                                </div>
                            </div >
                        </Box>
                        <Box sx={{ m: 3 }} style={{ margin: 2 }}>
                            <div>
                                <div className="image-container">
                                    <Plot
                                        data={[
                                            {

                                                type: "scatter",
                                                mode: "lines",
                                                name: 'Original data',
                                                x: time_of_TS,
                                                y: data_of_TS,
                                                line: { color: '#17BECF' }
                                            }
                                            ,
                                            eval(selectedModel[4]),
                                            // rnn_graph

                                        ]}
                                        layout={{
                                            width: 550, height: 400, title: 'ARIMA Model',
                                            xaxis: {
                                                title: 'Time',
                                            },
                                            yaxis: {
                                                title: 'Data'
                                            },
                                        }}
                                    />
                                    <div className="overlay">
                                        <Button type="primary" onClick={handleDownloadClick}>
                                            <i className="fa fa-download"></i> Download model
                                        </Button>
                                    </div>
                                </div>
                            </div >
                        </Box>
                    </CardContent>)
            }
        </div>
    );
};

export default Step4;