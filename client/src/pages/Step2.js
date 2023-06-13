// step 2 thanhf step3 cluwaj chọn thuật toán + tham số


// ======step2 thì là chuẩn hóa, chuẩn bị dữ liệu

// Fill dữ liệu bị thiếu
// xóa các dữ liệu không hợp lệ
// phân chia dữ liệu train test

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

const Step2 = (props) => {
    const { hidden_step1, hidden_step2, hidden_step3, hidden0, hidden2, handleSelectChanege, test, handleOnFileLoad1, handleOnError, handleOnRemoveFile,
        handleOpenDialog, test_size, buttonRef, handleSelectTime, predicted, handleOnFileLoadAutoArima, graph, arima_graph, handleUpdateTestSize,
        selectedDate, filename, yearx, column, timeColumn, dataColumn, years, yearsx, sales, sales2, handleOnFileLoad2, handleSelectData } = props;


    return (
        <div>

            <Container >
                <LoadingOverlay
                    styles={{ display: 'none' }}
                    active={!hidden2}
                    spinner
                    text='Lunas'
                >
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
                                        disable="false"
                                    >
                                        <div style={{ display: 'flex', justifyContent: 'center', marginTop: 50 }}>
                                            <Form.Item
                                                label="Maximum AR(p)"
                                                name="p"
                                                style={{ marginRight: '100px' }}
                                            // rules={[{ required: true, message: 'Please input your username!' }]}
                                            >
                                                <InputNumber defaultValue={0.2} max={1} min={0} step={0.01}
                                                    value={test_size}
                                                    onChange={(value) => (handleUpdateTestSize(value))}
                                                />
                                            </Form.Item>

                                            <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
                                                <Button type="primary" htmlType="submit">
                                                    Submit
                                                </Button>
                                            </Form.Item>
                                        </div>
                                    </Form>

                                </CardContent>
                            </Card>
                        </Box>
                    </Box>
                </LoadingOverlay>
            </Container>
        </div >
    );
};

export default Step2;