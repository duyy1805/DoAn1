import React, { Component, useEffect, useState } from 'react';
import { Helmet } from 'react-helmet';
import DownloadIcon from '@material-ui/icons/PictureAsPdf';
import LoadingOverlay from 'react-loading-overlay';
import {
    Box,
    Container,
    Card,
    CardContent,
    // Button,
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

const onFinish = (values: any) => {
    console.log('Success:', values);
};

const onFinishFailed = (errorInfo: any) => {
    console.log('Failed:', errorInfo);
};

const Step2 = (props) => {
    const { hidden_step1, hidden_step2, hidden0, hidden2, handleSelectChanege, test, handleOnFileLoad1, handleOnError, handleOnRemoveFile,
        handleOpenDialog, buttonRef, handleSelectTime, predicted,
        selectedDate, filename, yearx, column, timeColumn, dataColumn, years, yearsx, sales, sales2, handleOnFileLoad2, handleSelectData } = props;
    return (
        <div>
            <Container >
                <Box
                    sx={{
                        backgroundColor: 'background.default',
                        minHeight: '100%',

                    }}
                >
                    <Box sx={{ m: 3, display: hidden_step2 ? 'none' : 'block', }}>
                        <Card sx={{ m: 0 }}>
                            <CardContent>
                                <Typography component="div" align="center" variant="h3" sx={{ textAlign: 'center', p: 1 }}>
                                    Select Time-Series Params
                                </Typography>
                                <Divider />
                                <Form
                                    name="basic"
                                    labelCol={{ span: 18 }}
                                    wrapperCol={{ span: 6 }}
                                    style={{ maxWidth: 20000, color: 'red' }}
                                    // initialValues={{ remember: true }}
                                    onFinish={onFinish}
                                    onFinishFailed={onFinishFailed}
                                    autoComplete="off"
                                    disabled='true'
                                >
                                    <div style={{ display: 'flex', justifyContent: 'center', marginTop: 50 }}>
                                        <Form.Item
                                            label="Maximum AR(p)"
                                            name="p"
                                            style={{ marginRight: '100px' }}
                                        // rules={[{ required: true, message: 'Please input your username!' }]}
                                        >
                                            <InputNumber defaultValue={1} />
                                        </Form.Item>

                                        <Form.Item
                                            label="Maximum Difference(d)"
                                            name="d"
                                            style={{ marginRight: '100px' }}
                                        // rules={[{ required: true, message: 'Please input your username!' }]}
                                        >
                                            <InputNumber defaultValue={1} />
                                        </Form.Item>


                                        <Form.Item
                                            label="Maximum MA(q)"
                                            name="q"
                                        // rules={[{ required: true, message: 'Please input your username!' }]}
                                        >
                                            <InputNumber defaultValue={1} />
                                        </Form.Item>
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
                            </CardContent>
                        </Card>
                    </Box>
                </Box>
            </Container>
        </div >
    );
};

export default Step2;