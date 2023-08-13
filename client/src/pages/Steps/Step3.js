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
const { Column, ColumnGroup } = Table;

const Plot = createPlotlyComponent(Plotly);
const onFinish = (values: any) => {
    console.log('Success:', values);
};

const onFinishFailed = (errorInfo: any) => {
    console.log('Failed:', errorInfo);
};

const Step3 = (props) => {
    const { hidden_step1, hidden2, previousStep, handleSelectTime, future_values_auto_arima, future_values_arima, graph,
        auto_arima_graph, auto_arima_graph_0, auto_arima_graph_1, auto_arima_graph_2, auto_arima_graph_3,
        arima_graph, rnn_graph, rnn_graph_0, rnn_graph_1, rnn_graph_2, rnn_graph_3,
        //error
        mae,
        column, timeColumn, dataColumn, time_of_TS, data_of_TS, predicted_auto_arima
    } = props;
    useEffect(() => {
        console.log(mae)
    }, [])

    const data = [
        {
            key: '1',
            err: 'MAE',
            fill_1: mae[0], fill_2: mae[1], fill_3: mae[2], fill_4: mae[3],
            fill_5: mae[4], fill_6: mae[5], fill_7: mae[6], fill_8: mae[7],
            fill_9: mae[8], fill_10: mae[9], fill_11: mae[10], fill_12: mae[11],
            fill_13: mae[12], fill_14: mae[13], fill_15: mae[14], fill_16: mae[15],
        },
        {
            key: '2',
            err: 'MSE',
            fill_1: mae[0], fill_2: mae[1], fill_3: mae[2], fill_4: mae[3],
            fill_5: mae[4], fill_6: mae[5], fill_7: mae[6], fill_8: mae[7],
            fill_9: mae[8], fill_10: mae[9], fill_11: mae[10], fill_12: mae[11],
            fill_13: mae[12], fill_14: mae[13], fill_15: mae[14], fill_16: mae[15],
        },
    ];

    const columnGroups = [
        { title: "ARIMA", startKey: "fill_1", endKey: "fill_4" },
        { title: "RNN", startKey: "fill_5", endKey: "fill_8" },
        { title: "3", startKey: "fill_9", endKey: "fill_12" },
        { title: "4", startKey: "fill_13", endKey: "fill_16" },
        { title: "5", startKey: "fill_17", endKey: "fill_20" },
        { title: "6", startKey: "fill_21", endKey: "fill_24" },
    ];
    const columnGroupsAndColumns = columnGroups.map(group => {
        const columns = [];
        for (let i = parseInt(group.startKey.split('_')[1]); i <= parseInt(group.endKey.split('_')[1]); i++) {
            columns.push(<Column title={`Fill_${i}`} dataIndex={`fill_${i}`} key={`fill_${i}`} />);
        }
        return {
            groupTitle: group.title,
            columns: columns,
        };
    });

    return (
        <div>
            <Container style={{ padding: 0, maxWidth: 1700 }}>
                <Box
                    style={{ marginTop: 24 }}
                >
                    <Card style={{ backgroundColor: "transparent" }}>
                        <CardContent style={{ backgroundColor: "transparent", marginTop: 10 }}>
                            <Table style={{ tableLayout: "auto" }} dataSource={data} pagination={false} scroll={{ x: 1600 }} >
                                <Column title="" dataIndex="err" key="err" />
                                {columnGroupsAndColumns.map(groupWithColumns => (
                                    <ColumnGroup title={groupWithColumns.groupTitle}>
                                        {groupWithColumns.columns}
                                    </ColumnGroup>
                                ))}

                            </Table>
                        </CardContent>
                        <Card sx={{ m: 0 }} style={{ width: 1650, boxShadow: "0px 2px 6px 4px rgba(0, 0, 0, 0.1)", borderRadius: "12px", marginLeft: 20, backgroundColor: '#1677ff' }}>
                            <CardContent sx={{ width: "1700px", backgroundColor: '#fafafa', marginLeft: 4 }} style={{ padding: 0, paddingLeft: 5 }}>
                                <Typography component="div" sx={{ textAlign: '', p: 1, fontSize: '1.5rem', }}>
                                    Time-Series Forecasting Models
                                </Typography>
                            </CardContent>
                        </Card>
                        <CardContent style={{ backgroundColor: "transparent", display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', marginTop: 10 }}>
                            <Box sx={{ m: 3 }} style={{ margin: 2 }}>
                                <Grid
                                    container
                                    spacing={0}
                                    direction="column"
                                    alignItems="center"
                                    justify="center"
                                >
                                    <div style={{ position: 'absolute', zIndex: 99, marginLeft: 460, marginTop: 350 }}>
                                        <Button
                                            type="primary"
                                        >
                                            Select
                                        </Button>
                                    </div>
                                    <div>
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
                                                width: 550, height: 400, title: 'ARMIA Model',
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
                            <Box sx={{ m: 3 }} style={{ margin: 0 }}>
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
                                                    name: 'Original series',
                                                    x: time_of_TS,
                                                    y: data_of_TS,
                                                    line: { color: '#17BECF' }
                                                }
                                                ,
                                                // arima_graph,
                                                rnn_graph,
                                                rnn_graph_0,
                                                rnn_graph_1,
                                                rnn_graph_2,
                                                rnn_graph_3,
                                            ]}
                                            layout={{
                                                width: 550, height: 400, title: 'Time series data',
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
                            <Box sx={{ m: 3 }} style={{ margin: 0 }}>
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
                                                    x: time_of_TS,
                                                    y: data_of_TS,
                                                    line: { color: '#17BECF' }
                                                }
                                                ,
                                                arima_graph,
                                                // rnn_graph


                                            ]}
                                            layout={{
                                                width: 550, height: 400, title: 'Time series data',
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
                            <Box sx={{ m: 3 }} style={{ margin: 0 }}>
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
                                                    x: time_of_TS,
                                                    y: data_of_TS,
                                                    line: { color: '#17BECF' }
                                                }
                                                ,
                                                arima_graph,
                                                // rnn_graph


                                            ]}
                                            layout={{
                                                width: 550, height: 400, title: 'Time series data',
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
                            <Box sx={{ m: 3 }} style={{ margin: 0 }}>
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
                                                    x: time_of_TS,
                                                    y: data_of_TS,
                                                    line: { color: '#17BECF' }
                                                }
                                                ,
                                                arima_graph,
                                                // rnn_graph


                                            ]}
                                            layout={{
                                                width: 550, height: 400, title: 'Time series data',
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
                            <Box sx={{ m: 3 }} style={{ margin: 0 }}>
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
                                                    x: time_of_TS,
                                                    y: data_of_TS,
                                                    line: { color: '#17BECF' }
                                                }
                                                ,
                                                arima_graph,
                                                // rnn_graph


                                            ]}
                                            layout={{
                                                width: 550, height: 400, title: 'Time series data',
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

                        </CardContent>
                        <Divider />
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
                            onClick={() => message.success('Processing complete!')}
                        // sx={{ backgroundColor: '#EB2CB2', }}
                        >
                            Done
                        </Button>
                    </div>
                </Box>



            </Container>
        </div >
    );
};

export default Step3;