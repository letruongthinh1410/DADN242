import React, {useState, useEffect} from "react";
import { Card, FormControl, Select, MenuItem, Typography, Grid, Alert, Button, Switch, TableContainer, TableBody, TableCell, TableHead, TableRow, Table, CircularProgress } from "@mui/material";
import { Gauge, gaugeClasses } from '@mui/x-charts/Gauge';
import { LineChart } from "@mui/x-charts/LineChart";
import { LocalizationProvider } from "@mui/x-date-pickers";

import { GetGroup, GetRule, GetFeedData} from "../../../api";
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { useLocation } from "react-router-dom";

import { useWebSocket } from "../../WebSocketProvider";

import { Thermometer, Droplets, Sun } from "lucide-react";
import api from "../../../pages/api.jsx";


const Chart = ({num, humidity, temperature, light, xLabelsTemp, xLabelsPump, xLabelsLight}) => {
    humidity = humidity?.slice().reverse();
    temperature = temperature?.slice().reverse();
    light = light?.slice().reverse();
    xLabelsTemp = xLabelsTemp?.slice().reverse();
    xLabelsPump = xLabelsPump?.slice().reverse();
    xLabelsLight = xLabelsLight?.slice().reverse();
    switch (num) { 
        case 1: {
            return (
                <>
                { temperature?.length > 0 && xLabelsTemp?.length > 0 ? 
                (<LineChart
                    height={500}
                        series={[
                            { data: temperature, label: 'Nhiệt độ', area: true, color: "green"},
                        ]}
                        xAxis={[{ scaleType: 'point', data: xLabelsTemp }]}
                        grid={{ vertical: true, horizontal: true }}
                />
            ) : (
                    <Typography variant="body2" color="textSecondary">
                      Không có dữ liệu biểu đồ
                    </Typography>
                  )}
                </>
                
            );
        }
        case 2: {
            return (
                <>
                { humidity?.length > 0 ? (<LineChart
                    height={500}
                        series={[
                            { data: humidity, label: 'Độ ẩm đất', area: true, color: "blue"},
                        ]}
                        xAxis={[{ scaleType: 'point', data: xLabelsPump }]}
                        grid={{ vertical: true, horizontal: true }}
                />) : (
                    <Typography variant="body2" color="textSecondary">
                    Không có dữ liệu biểu đồ
                  </Typography>)}
                </>
                
                
            );
        }
        case 3: {
            return (
                <>
                {
                    light?.length > 0 ? (<LineChart
                    height={500}
                        series={[
                            { data: light, label: 'Ánh sáng', area: true, color: "yellow"},
                        ]}
                        xAxis={[{ scaleType: 'point', data: xLabelsLight }]}
                        grid={{ vertical: true, horizontal: true }}
                />) : (
                    <Typography variant="body2" color="textSecondary">
                    Không có dữ liệu biểu đồ
                  </Typography>
                 )
                }
                </>
                
            );
        }
        default: {
            break;
        }
    }
}

const ButtonList = [
    {name: "Nhiệt độ", icon: <Thermometer style={{marginRight: "0.5rem"}}/>},
    {name: "Độ ẩm đất", icon: <Droplets style={{marginRight: "0.5rem"}}/>},
    {name: "Ánh sáng", icon: <Sun style={{marginRight: "0.5rem"}}/>},
]

const Parameter = () => {
    
    const location = useLocation();
    const plant = location.state?.plant || null;

    const [plants, setPlants] = useState([]);
    const [selectedPlant, setSelectedPlant] = React.useState(plant);
    
    const { sendToDevice, initWebSockets, checkConnect, version} = useWebSocket()
    const [loading, setLoading] = useState(0)
    useEffect(() => {
        const fetchPlants = async () => {
            try {
                setLoading(loading);
                const { data } = await api.get("/user/info");
                const { username, apikey } = data.data;
                const groupResponse = await GetGroup();
                const filteredGroups = groupResponse.filter(group => group.key !== "default");
    
                const plantData = await Promise.all(
                    filteredGroups.map(async (group) => {
                        if (!group.feeds || group.feeds.length < 4) return null;
    
                        const plant = {
                            id: group.id,
                            name: group.name,
                            key: group.key,
                            temperature: null,
                            humidity: null,
                            light: null,
                            fan: null,
                            pump: null,
                        };
    
                        await Promise.all(group.feeds.map(async (feed) => {
                            if (!checkConnect(feed.key)) initWebSockets([feed.key]);
    
                            if (["temp", "humidity", "light"].includes(feed.name)) {
                                try {
                                    const ruleRes = await GetRule({ feedName: feed.key });
                                    const ruleData = ruleRes.data[0];
    
                                    const feedData = await GetFeedData({
                                        username,
                                        feedKey: feed.key,
                                        apiKey: apikey,
                                    });
    
                                    const filtered = Array.isArray(feedData)
                                        ? feedData.filter(item => {
                                            const num = Number(item.value);
                                            return num !== 0 && num !== 1 && !isNaN(num);
                                        }) : [];
    
                                    const values = filtered.map(item => Number(item.value));
                                    const times = filtered.map(item => {
                                        const date = new Date(item.created_at);
                                        return date.toLocaleTimeString('vi-VN', { hour12: false });
                                    });
    
                                    const feedObj = {
                                        id: feed.id,
                                        name: feed.name,
                                        key: feed.key,
                                        ceiling: ruleData?.ceiling ?? null,
                                        floor: ruleData?.floor ?? null,
                                        outputFeedAbove: ruleData?.outputFeedAbove ?? null,
                                        outputFeedBelow: ruleData?.outputFeedBelow ?? null,
                                        aboveValue: ruleData?.aboveValue ?? null,
                                        belowValue: ruleData?.belowValue ?? null,
                                        values,
                                        times,
                                    };
    
                                    if (feed.name === "temp") plant.temperature = feedObj;
                                    if (feed.name === "humidity") plant.humidity = feedObj;
                                    if (feed.name === "light") plant.light = feedObj;
                                } catch (err) {
                                    console.error("❌ GetRule or FeedData failed:", feed.key, err);
                                }
                            } else if (feed.name === "fan" || feed.name === "pump") {
                                const feedData = await GetFeedData({
                                    username,
                                    feedKey: feed.key,
                                    apiKey: apikey,
                                });
    
                                const values = Array.isArray(feedData)
                                    ? feedData.map(item => Number(item.value)) : [];
                                const status = feedData != null && values[0] > 0;
    
                                plant[feed.name] = {
                                    id: feed.id,
                                    name: feed.name,
                                    key: feed.key,
                                    status,
                                };
                            }
                        }));
    
                        return plant;
                    })
                );
    
                const validPlants = plantData.filter(Boolean);
                setPlants(validPlants);
    
                const selected = selectedPlant
                    ? validPlants.find(p => p.id === selectedPlant.id)
                    : validPlants[0];
    
                setSelectedPlant(selected || validPlants[0]);
    
            } catch (err) {
                console.error("❌ Error fetching plants:", err);
            } finally {
                setLoading(loading + 1);
            }
        };
    
        fetchPlants();
    }, [checkConnect, initWebSockets, loading, selectedPlant]);
    

    useEffect(() => {
        const interval = setInterval(async () => {
            if (!plants || plants.length === 0) return;
    
            try {
                const { data } = await api.get("/user/info");
                const { username, apikey } = data.data;
    
                const updatedPlants = await Promise.all(plants.map(async (plant) => {
                    const updateSensorFeed = async (feedObj) => {
                        if (!feedObj) return feedObj;
                        const resData = await GetFeedData({ username, feedKey: feedObj.key, apiKey: apikey });
    
                        const filtered = Array.isArray(resData)
                            ? resData.filter(item => {
                                const num = Number(item.value);
                                return num !== 0 && num !== 1 && !isNaN(num);
                            }) : [];
    
                        const values = filtered.map(item => Number(item.value));
                        const times = filtered.map(item => {
                            const date = new Date(item.created_at);
                            return date.toLocaleTimeString('vi-VN', { hour12: false });
                        });
    
                        return { ...feedObj, values, times };
                    };
    
                    const updateStatusFeed = async (feedObj) => {
                        if (!feedObj) return feedObj;
                        const resData = await GetFeedData({ username, feedKey: feedObj.key, apiKey: apikey });
                        const values = Array.isArray(resData) ? resData.map(item => Number(item.value)) : [];
                        const status = resData != null && values[0] > 0;
                        return { ...feedObj, status };
                    };
    
                    return {
                        ...plant,
                        temperature: await updateSensorFeed(plant.temperature),
                        humidity: await updateSensorFeed(plant.humidity),
                        light: await updateSensorFeed(plant.light),
                        fan: await updateStatusFeed(plant.fan),
                        pump: await updateStatusFeed(plant.pump),
                    };
                }));
    
                setPlants(updatedPlants);
            } catch (err) {
                console.error("❌ Error updating plants realtime:", err);
            }
        }, 5000);
    
        return () => clearInterval(interval);
    }, [plants, version]);
    
    
    
    
    const tempValue = selectedPlant?.temperature?.values[0] ?? -1;
    const humidityValue = selectedPlant?.humidity?.values[0] ?? -1;
    const lightValue = selectedPlant?.light?.values[0] ?? -1;

    const notifyTemp = tempValue != null && selectedPlant?.temperature?.floor != null && selectedPlant?.temperature?.ceiling != null 
            ? (tempValue < selectedPlant.temperature.floor
                ? "Nhiệt độ thấp"
                : tempValue > selectedPlant.temperature.ceiling
                ? "Nhiệt độ cao"
                : "Bình thường")
            : "Không có dữ liệu";

    const notifyHumidity = humidityValue != null && selectedPlant?.humidity?.floor != null && selectedPlant?.humidity?.ceiling != null
            ? (humidityValue < selectedPlant.humidity.floor
                ? "Độ ẩm đất thấp"
                : humidityValue > selectedPlant.humidity.ceiling
                ? "Độ ẩm đất cao"
                : "Bình thường")
            : "Không có dữ liệu";

    const notifyLight = lightValue != null && selectedPlant?.light?.floor != null && selectedPlant?.light?.ceiling != null
            ? (lightValue < selectedPlant.light.floor
                ? "Ánh sáng thấp"
                : lightValue > selectedPlant.light.ceiling
                ? "Ánh sáng cao"
                : "Bình thường")
            : "Không có dữ liệu";

    
    const notify = [notifyTemp, notifyHumidity, notifyLight].filter(n => n !== `Bình thường`).join(', ') || `Bình thường`;
    
    const handleChangeSwitch = (event, type) => {
        const updatedPlants = plants.map((plant) => {
            if (plant.id === selectedPlant.id) {
                const updatedDevice = {
                    ...plant[type],
                    status: event.target.checked,
                };
    
                // Gửi lệnh đến thiết bị
                sendToDevice(plant[type].key, event.target.checked ? "1.0" : "0.0");
                
    
                return {
                    ...plant,
                    [type]: updatedDevice,
                };
            }
            return plant;
        });
        setPlants(updatedPlants);
        setSelectedPlant(updatedPlants.find(plant => plant.id === selectedPlant.id))
    };

    const [numButton, setNumButton] = useState(1)

    // Format thời gian dạng "HH:mm" hoặc "Hh"

    return (
        <LocalizationProvider dateAdapter={AdapterDayjs} >
            { loading >= 1 ? plants.length >= 1 ? (
                    <>
                        <Grid container spacing={1} style={{padding: "0 4rem", height: window.innerWidth > 768 ? "80vh" : "fit-content" }}>
                            <Grid size={{xs: 12, md: 8}}>
                                <FormControl fullWidth style={{ marginBottom: "10px", width: "13rem" }} >
                                    <Typography fontWeight="bold" style={{marginBottom: "0.3rem"}}>Cây trồng:</Typography>
                                    <Select
                                        value={selectedPlant?.id ?? ""}
                                        onChange={(e) => {
                                            const plantId = e.target.value;
                                            const plantObj = plants.find(p => p.id === plantId);
                                            setSelectedPlant(plantObj);
                                        }}
                                        size="small"
                                    >
                                        {plants.map((plant) => (
                                            <MenuItem key={plant?.id} value={plant?.id}>
                                                {plant?.name} - {plant?.id}
                                            </MenuItem>
                                        ))}
                                    </Select>

                                </FormControl>
                                <Grid container>
                                    <Grid 
                                        size={{xs: 12, md: 5}} 
                                        container 
                                        spacing={1}
                                    >
                                        <Grid size={12}>
                                            <Typography variant="body1" fontWeight="bold" style={{ alignSelf: "flex-start" }}>
                                                Độ ẩm đất
                                            </Typography>
                                        </Grid>
                                        <div className="d-flex align-items-center justify-content-start">
                                            <Grid  
                                                size={{xs: 12, md: 6}} style={{marginRight: "0.5rem"}}
                                            >
                                                <div 
                                                    style={{
                                                        width: "10rem",
                                                        height: "10rem",
                                                    }}

                                                >
                                                    <Gauge
                                                        value={humidityValue}
                                                        startAngle={-160}
                                                        endAngle={160}
                                                        innerRadius="70%"
                                                        outerRadius="100%"
                                                        style={{alignSelf: "center"}}
                                                        text={({value}) => `${value}%`}
                                                        sx= {{
                                                            [`& .${gaugeClasses.valueArc}`]: {
                                                                fill: '#3eaef4',
                                                            },
                                                            [`& .${gaugeClasses.valueText}`]: {
                                                                fontSize: 20,
                                                                fill: '#3eaef4',
                                                            },
                                                        }}
                                                    />
                                                    <div style={{ display: "flex", justifyContent: "space-around", marginTop: "-10px" }}>
                                                        <span style={{ fontSize: "14px", color: "gray" }}>0</span>
                                                        <span style={{ fontSize: "14px", color: "gray" }}>100</span>
                                                    </div>
                                                </div>
                                            </Grid>
                                            <Grid size={{xs: 12, md: 6}} className="d-flex align-items-center justify-content-center" style={{marginTop: "1rem", marginLeft: "1.3rem",}}>
                                                <Button
                                                    variant="contained"
                                                    sx={{
                                                        width: 90,
                                                        height: 90,
                                                        borderRadius: "50%",
                                                        fontSize: 16,
                                                        fontWeight: "bold",
                                                        textTransform: "none",
                                                        display: "flex",
                                                        justifyContent: "center",
                                                        alignItems: "center",
                                                        backgroundColor: "#3eaef4",
                                                        color: "black"
                                                    }}
                                                    onClick={() => {
                                                        const isPumpOn = selectedPlant?.pump?.status;
                                                        sendToDevice(selectedPlant.pump.key, isPumpOn ? "0.0" : "1.0");
                                                
                                                        const updatedPlants = plants.map((plant) => {
                                                            if (plant.id === selectedPlant.id) {
                                                                return {
                                                                    ...plant,
                                                                    pump: {
                                                                        ...plant.pump,
                                                                        status: !isPumpOn,
                                                                    },
                                                                };
                                                            }
                                                            return plant;
                                                        });
                                                        setPlants(updatedPlants);
                                                        setSelectedPlant(updatedPlants.find(plant => plant.id === selectedPlant.id))
                                                    }}
                                                >
                                                    {selectedPlant?.pump?.status ? "Tắt bơm" : "Tưới tiêu"}
                                                </Button>
                                            </Grid>
                                        </div>
                                        
                                    </Grid>
                                    <Grid size={{xs: 12, md: 7}}  container spacing={1} >
                                        <Grid size={12}>
                                            <Typography variant="body1" fontWeight="bold" style={{ alignSelf: "flex-start" }}>
                                                Ánh sáng
                                            </Typography>
                                        </Grid>
                                        <div className="d-flex align-items-center justify-content-center">
                                            <Grid size={{xs: 12, md: 12}}>
                                                <div 
                                                    style={{
                                                        width: "10rem",
                                                        height: "10rem",
                                                    }}
                                                >
                                                    <Gauge
                                                        value={lightValue}
                                                        startAngle={-160}
                                                        endAngle={160}
                                                        innerRadius="70%"
                                                        outerRadius="100%"
                                                        style={{alignSelf: "center"}}
                                                        text={({value}) => `${value}%`}
                                                        sx= {{
                                                            [`& .${gaugeClasses.valueArc}`]: {
                                                                fill: '#F2FF00',
                                                            },
                                                            [`& .${gaugeClasses.valueText}`]: {
                                                                fontSize: 20,
                                                                fill: '#F2FF00',
                                                            },
                                                        }}
                                                    />
                                                    <div style={{ display: "flex", justifyContent: "space-around", marginTop: "-10px" }}>
                                                        <span style={{ fontSize: "14px", color: "gray" }}>0</span>
                                                        <span style={{ fontSize: "14px", color: "gray" }}>100</span>
                                                    </div>
                                                </div>
                                            </Grid>
                                        </div>
                                        
                                    </Grid>
                                </Grid>
                                <Grid container spacing={1} style={{marginTop: "2rem"}}>
                                    <Grid size={{xs: 12, md: 5}} container spacing={2}>
                                        <Grid size={12}>
                                            <Typography variant="body1" fontWeight="bold" style={{ alignSelf: "flex-start" }}>
                                                Nhiệt độ
                                            </Typography>
                                        </Grid>
                                        <div className="d-flex align-items-center justify-content-start">
                                            <Grid size={{xs: 12, md: 6}} style={{marginRight: "0.5rem"}}>
                                                <div 
                                                    style={{
                                                        width: "10rem",
                                                        height: "10rem",
                                                    }}
                                                >
                                                    <Gauge
                                                        value={tempValue} 
                                                        startAngle={-160}
                                                        endAngle={160}
                                                        innerRadius="70%"
                                                        outerRadius="100%"
                                                        style={{alignSelf: "center"}}
                                                        text={({value}) => `${value}°C`}
                                                        sx= {{
                                                            [`& .${gaugeClasses.valueArc}`]: {
                                                                fill: '#00FF26',
                                                            },
                                                            [`& .${gaugeClasses.valueText}`]: {
                                                                fontSize: 20,
                                                                fill: '#00FF26',
                                                            },
                                                        }}
                                                    />
                                                    <div style={{ display: "flex", justifyContent: "space-around", marginTop: "-10px" }}>
                                                        <span style={{ fontSize: "14px", color: "gray" }}>0</span>
                                                        <span style={{ fontSize: "14px", color: "gray" }}>40</span>
                                                    </div>
                                                </div>
                                            </Grid>
                                            <Grid size={{xs: 12, md: 6}} className="d-flex align-items-center justify-content-center" style={{marginTop: "1rem"}}>
                                                <Button
                                                    variant="contained"
                                                    sx={{
                                                        width: 90,
                                                        height: 90,
                                                        borderRadius: "50%",
                                                        fontSize: 16,
                                                        fontWeight: "bold",
                                                        textTransform: "none",
                                                        display: "flex",
                                                        justifyContent: "center",
                                                        alignItems: "center",
                                                        backgroundColor: "#00FF26",
                                                        color: "black",
                                                        marginLeft: "1.3rem",
                                                    }}
                                                    onClick={() => {
                                                        const isFanOn = selectedPlant?.fan?.status;
                                                        sendToDevice(selectedPlant.fan.key, isFanOn ? "0.0" : "1.0");
                                                
                                                        const updatedPlants = plants.map((plant) => {
                                                            if (plant.id === selectedPlant.id) {
                                                                return {
                                                                    ...plant,
                                                                    fan: {
                                                                        ...plant.fan,
                                                                        status: !isFanOn,
                                                                    },
                                                                };
                                                            }
                                                            return plant;
                                                        });
                                                        setPlants(updatedPlants);
                                                        setSelectedPlant(updatedPlants.find(plant => plant.id === selectedPlant.id))
                                                    }}
                                                >
                                                    {selectedPlant?.fan?.status ? "Tắt quạt" : "Làm mát"}
                                                </Button>
                                            </Grid>
                                        </div>
                                    </Grid>
                                </Grid>
                            </Grid>
                            <Grid size={{xs: 12, md: 4}} container spacing={1} padding={2} className="d-flex flex-column">
                                <Grid size={12} style={{margin: "0 3rem"}}>
                                    <Typography variant="h6" fontWeight="bold" style={{marginBottom: "0.7rem"}}>
                                        {selectedPlant?.id || "N/A"} : {selectedPlant?.name || "N/A"}
                                    </Typography>
                                    <Typography variant="body1" style={{marginBottom: "0.1rem"}}>
                                        Nhiệt độ phù hợp: {selectedPlant?.temperature?.floor || "N/A"}°C - {selectedPlant?.temperature?.ceiling || "N/A"}°C
                                    </Typography>
                                    <Typography variant="body1" style={{marginBottom: "0.1rem"}}>
                                        Độ ẩm phù hợp: {selectedPlant?.humidity?.floor || "N/A"}% - {selectedPlant?.humidity?.ceiling || "N/A"}%
                                    </Typography>
                                    <Typography variant="body1" style={{marginBottom: "0.1rem"}}>
                                        Ánh sáng phù hợp: {selectedPlant?.light?.floor || "N/A"}% - {selectedPlant?.light?.ceiling || "N/A"}%
                                    </Typography>
                                    <Typography variant="body2" color={notify === "Bình thường" ? "success" : "error"} mt={1}>
                                        <Alert severity={notify === "Bình thường" ? "success" : "error"} style = {{padding: "0 1rem", width: "20rem", maxHeight: "3rem"}}>{notify}</Alert>
                                    </Typography>
                                </Grid>
                                <Grid size={12} style={{height: "fit-content"}}>
                                    <TableContainer 
                                        style={{borderRadius: "1rem", height: "65vh",}}
                                    >
                                        <Table stickyHeader aria-label="customized table" >
                                            <TableHead>
                                                <TableRow>
                                                    <TableCell style={{fontWeight: "600", textAlign: "center"}}>Mã thiết bị</TableCell>
                                                    <TableCell style={{fontWeight: "600", textAlign: "center"}}>Tên thiết bị</TableCell>
                                                    <TableCell style={{fontWeight: "600", textAlign: "center"}}>Trạng thái</TableCell>
                                                </TableRow>
                                            </TableHead>
                                            <TableBody>
                                                <TableRow key={selectedPlant?.temperature?.id}>
                                                    <TableCell style={{textAlign: "center"}}>{selectedPlant?.fan?.key}</TableCell>
                                                    <TableCell style={{textAlign: "center"}}>Quạt làm mát</TableCell>
                                                    <TableCell style={{textAlign: "center"}}>
                                                        <Switch
                                                            checked={selectedPlant?.fan?.status}
                                                            onChange={(e) => handleChangeSwitch(e, "fan")}
                                                        />
                                                    </TableCell>
                                                </TableRow>
                                                <TableRow key={selectedPlant?.humidity?.id}>
                                                    <TableCell style={{textAlign: "center"}}>{selectedPlant?.pump?.key}</TableCell>
                                                    <TableCell style={{textAlign: "center"}}>Máy bơm nước</TableCell>
                                                    <TableCell style={{textAlign: "center"}}>
                                                        <Switch
                                                            checked={selectedPlant?.pump?.status}
                                                            onChange={(e) => handleChangeSwitch(e, "pump")}
                                                        />
                                                    </TableCell>
                                                </TableRow>
                                            </TableBody>
                                        </Table>
                                    </TableContainer>
                                </Grid>
                            </Grid>
                        </Grid>
                        <Grid container spacing={1} padding={2}>
                            <Grid size={{xs: 12, md: 3}} className="d-flex flex-column align-items-center justify-content-start" style={{padding: "0 4rem"}}>
                                {ButtonList.map((item, index) => (
                                    <Button
                                        key={index}
                                        variant="outlined"
                                        sx={{
                                            height: "3rem",
                                            width: "10rem",
                                            margin: "0.5rem",
                                            borderRadius: "10px",
                                            textTransform: "none",
                                            color: numButton === index + 1 ? "white" : "black",
                                            backgroundColor: index + 1 === 2 ? "#42A5F5" : (index + 1 === 1 ? "#00FF26" : "#F2FF00"),
                                            "&:hover": {
                                                backgroundColor: numButton === index + 1 ? "#3eaef4" : "#f0f0f0",
                                                color: numButton === index + 1 ? "white" : "#3eaef4",
                                            },
                                        }}
                                        onClick={() => setNumButton(index + 1)}
                                    >
                                        {item.icon}
                                        {item.name}
                                    </Button>
                                ))}
                            </Grid>
                            <Grid size={{xs: 12, md: 9}}>
                                <Chart num={numButton} humidity={selectedPlant?.humidity?.values} temperature={selectedPlant?.temperature?.values} 
                                light={selectedPlant?.light?.values} xLabelsTemp={selectedPlant?.temperature?.times} xLabelsPump={selectedPlant?.humidity?.times} 
                                xLabelsLight={selectedPlant?.light?.times}/>
                            </Grid>
                        </Grid>
                    </>
                    ) : (
                    <Grid item xs={12} className="d-flex align-items-start" style={{margin: "0 5rem"}}>
                        <Typography variant="h6" color="text.secondary" textAlign="start">
                            Chưa có cây trồng nào hết...
                        </Typography>
                    </Grid>
                ) : (
                    <div className="d-flex align-items-center justify-content-center" style={{minHeight: "80vh"}}>
                    <CircularProgress size="6rem" />
                </div>
                )}
        </LocalizationProvider>
    )
}

export default Parameter;

