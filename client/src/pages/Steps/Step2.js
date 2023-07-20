// step 2 thanhf step3 cluwaj chọn thuật toán + tham số


// ======step2 thì là chuẩn hóa, chuẩn bị dữ liệu

// Fill dữ liệu bị thiếu
// xóa các dữ liệu không hợp lệ
// phân chia dữ liệu train test

import React from 'react';
// import { Helmet } from 'react-helmet';
// import DownloadIcon from '@material-ui/icons/PictureAsPdf';
// import LoadingOverlay from 'react-loading-overlay';
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


// import Plotly from "plotly.js-basic-dist";
// import createPlotlyComponent from "react-plotly.js/factory";

import { InputNumber, Select, Form, Button, } from 'antd';



// const Plot = createPlotlyComponent(Plotly);
const onFinish = (values: any) => {
    console.log('Success:', values);
};

const onFinishFailed = (errorInfo: any) => {
    console.log('Failed:', errorInfo);
};

const Step2 = (props) => {
    const {
        nextStep, previousStep,
        test_size, handleUpdateTestSize, handleFillMethod,
    } = props;


    return (
        <div>

            <Container >
                <Box
                    sx={{
                        // backgroundColor: 'background.default',
                        minHeight: '100%',

                    }}
                >
                    <Box
                        sx={{
                            m: 3,
                            // display: hidden_step2 ? 'none' : 'block',
                        }}>
                        <Card sx={{ m: 0 }}>
                            <CardContent sx={{ width: "1000px" }}>
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
                                        <Form.Item
                                            label="Fill missing data method"
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
                                        </Form.Item>
                                        {/* <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
                                                <Button type="primary" htmlType="submit">
                                                    Submit
                                                </Button>
                                            </Form.Item> */}
                                    </div>
                                </Form>
                            </CardContent>
                        </Card>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '10px' }}>
                            <Button
                                // type="primary"
                                // variant="contained"
                                onClick={previousStep}
                            // sx={{ backgroundColor: '#EB2CB2', }}
                            >
                                Previous
                            </Button>
                            <Button
                                type="primary"
                                // variant="contained"
                                onClick={nextStep}
                            // sx={{ backgroundColor: '#EB2CB2', }}
                            >
                                Next
                            </Button>
                        </div>
                    </Box>
                </Box>
            </Container>
        </div >
    );
};

export default Step2;