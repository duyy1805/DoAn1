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
import photo from '../../assets/images/logo.png';
import "./styles.css"
const { Column, ColumnGroup } = Table;

const Plot = createPlotlyComponent(Plotly);
const onFinish = (values: any) => {
    console.log('Success:', values);
};

const onFinishFailed = (errorInfo: any) => {
    console.log('Failed:', errorInfo);
};

const Step4 = (props) => {
    const { hidden_step1, hidden2, previousStep, handleSelectTime, future_values_auto_arima, future_values_arima, graph,
        auto_arima_graph, auto_arima_graph_0, auto_arima_graph_1, auto_arima_graph_2, auto_arima_graph_3,
        arima_graph, rnn_graph, rnn_graph_0, rnn_graph_1, rnn_graph_2, rnn_graph_3,
        ses_graph, ses_graph_0, ses_graph_1, ses_graph_2, ses_graph_3,
        des_graph, des_graph_0, des_graph_1, des_graph_2, des_graph_3,
        tes_graph, tes_graph_0, tes_graph_1, tes_graph_2, tes_graph_3,
        ma_graph, ma_graph_0, ma_graph_1, ma_graph_2, ma_graph_3,
        //error
        mae, mse, missing,
        column, timeColumn, dataColumn, time_of_TS, data_of_TS, predicted_auto_arima
    } = props;
    useEffect(() => {
    }, [])


    return (
        <div>

            <div>
                <h2>Download</h2>
                <a
                    href={photo}
                    download="photo"
                    target="_blank"
                    rel="noreferrer"
                >
                    <Button>Download Model</Button>
                </a>
            </div>
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
                        auto_arima_graph,
                        auto_arima_graph_0,
                        auto_arima_graph_1,
                        auto_arima_graph_2,
                        auto_arima_graph_3,
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
                    <a href={photo} download>
                        <Button type="primary">
                            <i className="fa fa-download"></i> Download
                        </Button>
                    </a>
                </div>
            </div>
        </div >

    );
};

export default Step4;