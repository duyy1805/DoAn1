import React, { Component, useEffect, useState, useRef } from 'react';
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
import { InputNumber, Row, Select, Col, Tabs, Badge, Form, Button, Checkbox, Input, Space, Collapse } from 'antd';
const { Option } = Select;

// eslint-disable-next-line
const model = ['MA', 'Auto ARIMA', 'Manual ARIMA', 'smooth-based', 'TBATS', 'RNN'];
const options = [];
for (let i = 0; i < model.length; i++) {
    options.push({
        label: model[i],
        value: model[i],
    });
}

const text = `
  A dog is a type of domesticated animal.
  Known for its loyalty and faithfulness,
  it can be found as a welcome guest in many households across the world.
`;

const onChange = (key) => {
    // console.log(key);
};


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


    const formRef = useRef(null);

    const handleApplyClick = () => {
        if (formRef.current) {
            formRef.current.click();
        }
    };
    const [item, setItem] = useState([]) // select
    const [Items, setItems] = useState([]) // collapse
    useEffect(() => {
        console.log(item)
        setItems(items.filter(i => item.includes(i.key)).sort((a, b) => {
            const keyAIndex = item.indexOf(a.key);
            const keyBIndex = item.indexOf(b.key);
            if (keyAIndex < keyBIndex) {
                return -1;
            }
            if (keyAIndex > keyBIndex) {
                return 1;
            }
            return 0;
        }))
    }, [item])
    const items = [
        {
            key: 'MA',
            label: 'MA',
            children: <p>{text}</p>,
        },
        {
            key: 'Auto ARIMA',
            label: 'Auto ARIMA',
            children:
                <Card>
                    <CardContent sx={{ display: 'flex', justifyContent: 'center' }}>
                        <Button
                            // style={{ width: 80 }}
                            type="primary"
                            // variant="contained"
                            onClick={handleOnFileLoadAutoArima}

                        >
                            Apply auto ARIMA model
                        </Button>
                    </CardContent>

                </Card>
            ,
        },
        {
            key: 'Manual ARIMA',
            label: 'Manual ARIMA',
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
                        <Form.Item >
                            <Button
                                // style={{ width: 80 }} 
                                style={{ display: 'none' }}
                                ref={formRef}
                                type="primary" htmlType="submit">
                                Apply manual ARIMA model
                            </Button>
                        </Form.Item>
                    </div>
                </Form>
            ,
        },
        {
            key: 'smooth-based',
            label: 'smooth-based',
            children: <p>{text}</p>,
        },
        {
            key: 'TBATS',
            label: 'TBATS',
            children: <p>{text}</p>,
        },
        {
            key: 'RNN',
            label: 'RNN',
            children: <p>{text}</p>,
        },
    ];
    const handleChange = (value) => {
        setItem(value)
    };
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
                            <Card sx={{ m: 0 }} style={{ boxShadow: "0px 2px 6px 4px rgba(0, 0, 0, 0.1)", borderRadius: "12px" }}>
                                <CardContent sx={{ width: "1000px" }}>
                                    <Typography component="div" align="center" variant="h3" sx={{ textAlign: 'center', p: 1, fontSize: '2.5rem' }}>
                                        Select Time-Series Model
                                    </Typography>
                                    <Divider />
                                    {/* <div style={{ paddingTop: 15 }}>
                                        Choose one or more
                                    </div> */}
                                    <Space
                                        style={{
                                            width: '100%',
                                            marginTop: 30,
                                            marginBottom: 30,
                                        }}
                                        direction="vertical"
                                    >
                                        <Select
                                            mode="multiple"
                                            allowClear
                                            style={{
                                                width: '100%',
                                            }}
                                            placeholder="Please select"
                                            // defaultValue={['a10', 'c12']}
                                            onChange={handleChange}
                                            options={options}
                                        />
                                    </Space>
                                    {item.length !== 0 ?
                                        (
                                            <Collapse defaultActiveKey={['Manual ARIMA']} items={Items} onChange={onChange} />
                                        )
                                        : null
                                    }
                                </CardContent>
                            </Card>
                        </Box>
                    </Box>
                    {item.length !== 0 ?
                        (
                            <div style={{ display: 'flex', justifyContent: 'center' }}>
                                {/* <Form.Item > */}
                                <Button
                                    // style={{ width: 80 }} 
                                    onClick={handleApplyClick}
                                    type="primary" htmlType="submit">
                                    Apply all models
                                </Button>
                                {/* </Form.Item> */}
                            </div>
                        )
                        : null
                    }
                </LoadingOverlay>
            </Container>
        </div >
    );
};

export default Step3;