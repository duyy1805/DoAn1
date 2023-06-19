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

const Step3 = (props) => {
    const { hidden_step1, hidden_step3, hidden0, hidden2, handleSelectChanege, test, handleOnFileLoad1, handleOnError, handleOnRemoveFile,
        handleOpenDialog, buttonRef, handleSelectTime, predicted,
        previousStep, nextStep,
        handleOnFileLoadAutoArima, graph, arima_graph,
        selectedDate, filename, yearx, column, timeColumn, dataColumn, years, yearsx, sales, sales2, handleOnFileLoad2, handleSelectData } = props;
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
                        <Box sx={{ m: 3, display: hidden_step3 ? 'none' : 'block', }}>
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
                                                                type="primary"
                                                                // variant="contained"
                                                                onClick={handleOnFileLoadAutoArima}

                                                            >
                                                                Runn
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
                                                        // initialValues={{ remember: true }}
                                                        onFinish={onFinish}
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
                                                                    label="seasonal"
                                                                    name="seasonal"
                                                                    style={{ marginRight: '100px' }}
                                                                // rules={[{ required: true, message: 'Please input your username!' }]}
                                                                >
                                                                    <InputNumber defaultValue={1} />
                                                                </Form.Item>


                                                                <Form.Item
                                                                    label="error_action"
                                                                    name="error_action"
                                                                // rules={[{ required: true, message: 'Please input your username!' }]}
                                                                >
                                                                    <InputNumber defaultValue={1} />
                                                                </Form.Item>
                                                            </div>
                                                        </div>
                                                        <Form.Item name="remember" valuePropName="checked" wrapperCol={{ offset: 8, span: 16 }}>
                                                            <Checkbox>Remember me</Checkbox>
                                                        </Form.Item>

                                                        <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
                                                            <Button type="primary" htmlType="submit">
                                                                Submit
                                                            </Button>
                                                        </Form.Item>
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