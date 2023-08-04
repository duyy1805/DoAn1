// step 2 thanhf step3 cluwaj chọn thuật toán + tham số


// ======step2 thì là chuẩn hóa, chuẩn bị dữ liệu

// Fill dữ liệu bị thiếu
// xóa các dữ liệu không hợp lệ
// phân chia dữ liệu train test

import React from 'react';
// import { Helmet } from 'react-helmet';
// import DownloadIcon from '@material-ui/icons/PictureAsPdf';
import LoadingOverlay from 'react-loading-overlay';
import {
    Box,
    Container,
    Card,
    CardContent,
    // MenuItem,
    Divider,
    // Select,
    // FormControl,
    // InputLabel,
    // FormHelperText,
    Typography,



} from '@material-ui/core';


import { InputNumber, Select, Form, Button, } from 'antd';

import { Fade, Slide, Zoom, LightSpeed, Bounce } from "react-reveal";

// const Plot = createPlotlyComponent(Plotly);
const onFinish = (values: any) => {
    console.log('Success:', values);
};

const onFinishFailed = (errorInfo: any) => {
    console.log('Failed:', errorInfo);
};

const Step2 = (props) => {
    const {
        nextStep, previousStep, testAllModel, hidden2,
        test_size, handleUpdateTestSize, handleFillMethod,
    } = props;


    return (
        <div>
            <LoadingOverlay
                styles={{ display: 'none' }}
                active={!hidden2}
                spinner
                text='Loading'
            >
                <Container style={{ padding: 0 }}>
                    <Box
                        sx={{
                            // backgroundColor: 'background.default',
                            minHeight: '100%',

                        }}
                    >
                        <Box

                            style={{ marginTop: 24 }}
                        >
                            <Fade bottom duration={1000}>
                                <Card sx={{ m: 0 }} style={{ boxShadow: "0px 2px 6px 4px rgba(0, 0, 0, 0.1)", borderRadius: "12px" }}>
                                    <CardContent sx={{ width: "1200px" }}>
                                        <Typography component="div" align="center" variant="h3" sx={{ textAlign: 'center', p: 1, fontSize: '2.5rem' }}>
                                            Data preparation
                                        </Typography>
                                        <Divider />
                                        <Form
                                            name="basic"
                                            labelCol={{ span: 18 }}
                                            wrapperCol={{ span: 6 }}
                                            style={{ maxWidth: 20000, color: 'red' }}
                                            initialValues={{ test_size: 0.2, fill: '0' }}
                                            onFinish={onFinish}
                                            onFinishFailed={onFinishFailed}
                                            autoComplete="off"
                                            disable="false"
                                        >
                                            <div style={{ display: 'flex', justifyContent: 'center', marginTop: 50 }}>
                                                <Form.Item
                                                    label="Test size"
                                                    name="test_size"
                                                    style={{ marginRight: '100px' }}
                                                    rules={[{ required: true, message: 'Please input!' }]}
                                                >
                                                    <InputNumber
                                                        defaultValue={0.2}
                                                        max={1} min={0} step={0.01}
                                                        value={test_size}
                                                        onChange={(value) => (handleUpdateTestSize(value))}
                                                    />
                                                </Form.Item>
                                                {/* <Form.Item
                                                label="Filling missing data method"
                                                name="fill"
                                                style={{ marginRight: '100px' }}
                                                rules={[{ required: true, message: 'Please input!' }]}
                                            >
                                                <Select
                                                    defaultValue="0"
                                                    style={{ width: 180 }}
                                                    onChange={(value) => handleFillMethod(value)}
                                                    options={[
                                                        { value: 'delete', label: 'Delete mising column' },
                                                        { value: '0', label: 'Fill with 0' },
                                                        { value: 'mean', label: 'Fill with mean values' },
                                                        { value: 'forward', label: 'Forward fill' },
                                                        { value: 'backward', label: 'backward fill' },
                                                    ]}
                                                />
                                            </Form.Item> */}
                                            </div>
                                        </Form>
                                    </CardContent>
                                </Card>
                            </Fade>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '10px' }}>
                                <Slide left duration={1000}>
                                    <Button
                                        // type="primary"
                                        // variant="contained"
                                        onClick={previousStep}
                                    // sx={{ backgroundColor: '#EB2CB2', }}
                                    >
                                        Previous
                                    </Button>
                                </Slide>
                                <Slide right duration={1000}>
                                    <Button
                                        type="primary"
                                        // variant="contained"
                                        onClick={testAllModel}
                                    // sx={{ backgroundColor: '#EB2CB2', }}
                                    >
                                        Next
                                    </Button>
                                </Slide>
                            </div>
                        </Box>
                    </Box>
                </Container>
            </LoadingOverlay>
        </div >
    );
};

export default Step2;