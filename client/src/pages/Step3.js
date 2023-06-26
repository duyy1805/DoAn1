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
    // Select,
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
import { InputNumber, Row, Select, Col, Tabs, Badge, Form, Button, Checkbox, Input } from 'antd';

const Plot = createPlotlyComponent(Plotly);
const onFinish = (values: any) => {
    console.log('Success:', values);
};

const onFinishFailed = (errorInfo: any) => {
    console.log('Failed:', errorInfo);
};

const Step3 = (props) => {
    const { hidden_step1, hidden_step3, hidden0, hidden2, handleSelectChanege, test, handleOnFileLoad1, handleOnError, handleOnRemoveFile,
        handleOpenDialog, buttonRef, handleSelectTime, future_values_auto_arima,
        previousStep, nextStep, params, handleOnFileLoadArima,
        handleOnFileLoadAutoArima, graph, arima_graph,
        selectedDate, filename, yearx, column, timeColumn, dataColumn, time_of_TS, yearsx, data_of_TS, predicted_auto_arima, handleOnFileLoad2, handleSelectData } = props;
    // useEffect(() => {
    //     console.log(arima_graph)
    // }, [])
    return (
        <div>

            <Container >
                <LoadingOverlay
                    styles={{ display: 'none' }}
                    active={!hidden2}
                    spinner
                    text='Applying ARIMA algorithms '
                >
                    <Box
                        sx={{
                            // backgroundColor: 'background.default',
                            minHeight: '100%',

                        }}
                    >
                        <Box
                            sx={{
                                m: 3,
                                // display: hidden_step3 ? 'none' : 'block',
                            }}>
                            <Card sx={{ m: 0 }}>
                                <CardContent sx={{ width: "1000px" }}>
                                    <Typography component="div" align="center" variant="h3" sx={{ textAlign: 'center', p: 1, fontSize: '2.5rem' }}>
                                        Select Time-Series Params
                                    </Typography>
                                    <Divider />
                                    <Tabs
                                        defaultActiveKey="1"
                                        items={[
                                            {
                                                label: 'Auto',
                                                key: '1',
                                                children:

                                                    <Card>
                                                        <CardContent sx={{ display: 'flex', justifyContent: 'center' }}>
                                                            <Button
                                                                style={{ width: 80 }}
                                                                type="primary"
                                                                // variant="contained"
                                                                onClick={handleOnFileLoadAutoArima}

                                                            >
                                                                Run
                                                            </Button>
                                                        </CardContent>
                                                    </Card>

                                            },
                                            {
                                                label: 'Manual',
                                                key: '2',
                                                children:
                                                    <Form
                                                        name="basic"
                                                        labelCol={{ span: 18 }}
                                                        wrapperCol={{ span: 6 }}
                                                        style={{ maxWidth: 20000, color: 'red' }}
                                                        initialValues={{
                                                            p: 1, d: 1, q: 1, P: 1, D: 1, Q: 1, m: 1, concentrate_scale: 'False', invertibility: 'False', stationarity: 'False'
                                                        }}
                                                        onFinish={(values) => handleOnFileLoadArima(values)}
                                                        onFinishFailed={onFinishFailed}
                                                        autoComplete="off"
                                                    // disabled='true'
                                                    >
                                                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                                                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', marginTop: 10 }}>
                                                                <Form.Item
                                                                    label="p"
                                                                    name="p"
                                                                    style={{ marginRight: '100px' }}
                                                                // rules={[{ required: true, message: 'Please input your username!' }]}
                                                                >
                                                                    <InputNumber defaultValue={1} />
                                                                </Form.Item>

                                                                <Form.Item
                                                                    label="d"
                                                                    name="d"
                                                                    style={{ marginRight: '100px' }}
                                                                // rules={[{ required: true, message: 'Please input your username!' }]}
                                                                >
                                                                    <InputNumber defaultValue={1} />
                                                                </Form.Item>


                                                                <Form.Item
                                                                    label="q"
                                                                    name="q"
                                                                // rules={[{ required: true, message: 'Please input your username!' }]}
                                                                >
                                                                    <InputNumber defaultValue={1} />
                                                                </Form.Item>
                                                                <Form.Item
                                                                    label="P"
                                                                    name="P"
                                                                    style={{ marginRight: '100px' }}
                                                                // rules={[{ required: true, message: 'Please input your username!' }]}
                                                                >
                                                                    <InputNumber defaultValue={1} />
                                                                </Form.Item>

                                                                <Form.Item
                                                                    label="D"
                                                                    name="D"
                                                                    style={{ marginRight: '100px' }}
                                                                // rules={[{ required: true, message: 'Please input your username!' }]}
                                                                >
                                                                    <InputNumber defaultValue={1} />
                                                                </Form.Item>


                                                                <Form.Item
                                                                    label="Q"
                                                                    name="Q"
                                                                // rules={[{ required: true, message: 'Please input your username!' }]}
                                                                >
                                                                    <InputNumber defaultValue={1} />
                                                                </Form.Item>
                                                                <Form.Item
                                                                    label="m"
                                                                    name="m"
                                                                    style={{ marginRight: '100px' }}
                                                                // rules={[{ required: true, message: 'Please input your username!' }]}
                                                                >
                                                                    <InputNumber defaultValue={1} />
                                                                </Form.Item>

                                                                <Form.Item
                                                                    label="stationarity"
                                                                    name="stationarity"
                                                                    style={{ marginRight: '100px' }}
                                                                // rules={[{ required: true, message: 'Please input your username!' }]}
                                                                >
                                                                    <Select
                                                                        defaultValue="True"
                                                                        style={{ width: 90 }}
                                                                        // onChange={(value)}
                                                                        options={[
                                                                            { value: 'True', label: 'True' },
                                                                            { value: 'False', label: 'False' }
                                                                        ]}
                                                                    />
                                                                </Form.Item>


                                                                <Form.Item
                                                                    label="invertibility"
                                                                    name="invertibility"
                                                                // rules={[{ required: true, message: 'Please input your username!' }]}
                                                                >
                                                                    <Select
                                                                        defaultValue="True"
                                                                        style={{ width: 90 }}
                                                                        // onChange={(value)}
                                                                        options={[
                                                                            { value: 'True', label: 'True' },
                                                                            { value: 'False', label: 'False' }
                                                                        ]}
                                                                    />
                                                                </Form.Item>
                                                                <Form.Item
                                                                    label="concentrate_scale"
                                                                    name="concentrate_scale"
                                                                >
                                                                    <Select
                                                                        defaultValue="True"
                                                                        style={{ width: 90 }}
                                                                        // onChange={(value)}
                                                                        options={[
                                                                            { value: 'True', label: 'True' },
                                                                            { value: 'False', label: 'False' }
                                                                        ]}
                                                                    />
                                                                </Form.Item>
                                                            </div>
                                                        </div>
                                                        <div style={{ display: 'flex', justifyContent: 'center' }}>
                                                            <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
                                                                <Button style={{ width: 80 }} type="primary" htmlType="submit">
                                                                    Run
                                                                </Button>
                                                            </Form.Item>
                                                        </div>
                                                    </Form>
                                            },
                                        ]}
                                    />
                                </CardContent>
                            </Card>
                        </Box>
                    </Box>
                </LoadingOverlay>
            </Container>
        </div >
    );
};

export default Step3;