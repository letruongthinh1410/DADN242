import React, {useState, useEffect} from "react";
import { FormControl, Select, MenuItem, Typography, Grid, Alert, Button, Switch, TableContainer, TableBody, TableCell, TableHead, TableRow, Table } from "@mui/material";
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

    const token =  localStorage.getItem("accessToken");
    
    const [plants, setPlants] = useState([]);
    const [selectedPlant, setSelectedPlant] = React.useState(plant);
    
    const { deviceData, sendToDevice, initWebSockets, checkConnect} = useWebSocket()

    useEffect(() => {
        const fetchPlants = async () => {
            try {
                const groupResponse = await GetGroup();
                const filteredGroups = groupResponse.filter(group => group.key !== "default");
                const plantData = filteredGroups.length > 0 ? await Promise.all(
                    filteredGroups.map(async (group) => {
                    if (!group.feeds || group.feeds.length < 4) return null;
                    let plant = {
                        id: group.id,
                        name: group.name,
                        key: group.key,
                        temperature: null,
                        humidity: null,
                        light: null,
                        fan: null,
                        pump: null,
                    };
            
                    await Promise.all(
                        group.feeds.map(async (feed) => {
                            if(!checkConnect(feed.key)) initWebSockets([feed.key], token) //bật WebSocket lên cho feed này
                            
                            const response = await api.get("/user/info");

                            const resData = await GetFeedData({
                                username: response.data.data.username, // username tạm
                                feedKey: feed.key,
                                apiKey: response.data.data.apikey,
                            })

                            if (feed.name === "fan") {
                                const values = Array.isArray(resData)
                                ? resData.map(item => Number(item.value))
                                : []; //fan chỉ chứa giá trị 0 và 1
                                plant.fan = {
                                    id: feed.id,
                                    name: feed.name,
                                    key: feed.key,
                                    status: resData != null && values[values.length - 1] > 0,
                                };
                            } 
                            else if (feed.name === "pump") {
                                const values = Array.isArray(resData)
                                ? resData.map(item => Number(item.value))
                                : []; //fan chỉ chứa giá trị 0 và 1
                                plant.pump = {
                                    id: feed.id,
                                    name: feed.name,
                                    key: feed.key,
                                    status: resData != null && values[values.length - 1] > 0,
                                };
                            } 
                            else {
                                //temp, humidity, light chứa 0, 1 và các giá trị khác
                                const formatFeedData = (resData) => {
                                    if (!Array.isArray(resData) || resData.length === 0) return { values: [], times: [] };
                                    
                                    // Lọc những entry có value KHÁC 0 và 1
                                    const filtered = resData.filter(item => {
                                        const num = Number(item.value);
                                        return num !== 0 && num !== 1 && !isNaN(num);
                                    });
                                    
                                    if (filtered.length === 0) return { values: [], times: [] };
                                    
                                    const values = filtered.map(item => Number(item.value));
                                    const times = filtered.map(item => {
                                        const date = new Date(item.created_at);
                                        return date.toLocaleTimeString('vi-VN', { hour12: false }); // "hh:mm:ss"
                                    });
                                    
                                    return { values, times };
                                    };
                                
                                const { values, times } = formatFeedData(resData)
                                try {
                                    const ruleRes = await GetRule({
                                        feedName: feed.key,
                                    });
                                    const ruleData = ruleRes.data[0];
                                        
                                    const feedObject = {
                                        id: feed.id,
                                        name: feed.name,
                                        key: feed.key,
                                        ceiling: ruleData?.ceiling ?? null,
                                        floor: ruleData?.floor ?? null,
                                        outputFeedAbove: ruleData?.outputFeedAbove ?? null,
                                        outputFeedBelow: ruleData?.outputFeedBelow ?? null,
                                        aboveValue: ruleData?.aboveValue ?? null,
                                        belowValue: ruleData?.belowValue ?? null,
                                        values: values,
                                        times: times,
                                    }
                                    if (feed.name === "temp") {
                                        plant.temperature = feedObject;
                                    } else if (feed.name === "humidity") {
                                        plant.humidity = feedObject;
                                    } else if (feed.name === "light") {
                                        plant.light = feedObject;
                                    }
                            } catch (err) {
                                console.error("❌ Failed to fetch rule for", feed.key, err);
                            }
                        }
                        })
                    );
                
                    return plant;
                })
            ) : []
                setPlants(plantData);
                if (plantData.length > 0) {
                    if (selectedPlant) {
                        const updatedSelected = plantData.find(plant => plant.id === selectedPlant.id);
                        setSelectedPlant(updatedSelected || plantData[0]); // nếu không tìm thấy, dùng cây đầu tiên
                    } else {
                        setSelectedPlant(plantData[0]); // lần đầu chưa có selectedPlant
                    }
                }
                
            } catch (err) {
            console.error("❌ Error fetching groups:", err);
            }
        };
        fetchPlants();
    }, [plant, checkConnect, initWebSockets, selectedPlant, token, deviceData])
    
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
                sendToDevice(plant[type].key, event.target.checked ? "1" : "0");
                
    
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

    //----------------Liên quan đến table------------
    const [scroll, setScroll] = React.useState(true);

    const handleScroll = (event) => {
        setScroll(event.target.checked);
    };

    const [numButton, setNumButton] = useState(1)

    // Format thời gian dạng "HH:mm" hoặc "Hh"

    return (
        <LocalizationProvider dateAdapter={AdapterDayjs} >
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
                                <MenuItem key={plant.id} value={plant.id}>
                                    {plant.name} - {plant.id}
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
                                            sendToDevice(selectedPlant.pump.key, isPumpOn ? "0" : "1");
                                    
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
                            <div className="d-flex align-items-center justify-content-start">
                                <Grid size={{xs: 12, md: 6}}>
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
                            
                                <Grid 
                                    size={{xs: 12, md: 8}} 
                                    className="d-flex align-items-center justify-content-between"
                                    style={{marginLeft: "1.3rem", marginTop: "1rem"}}
                                >
                                    <Typography>Thả màn</Typography>
                                    <Switch
                                        checked={scroll}
                                        onChange={handleScroll}
                                        color="warning"
                                    />
                                    <Typography>Cuốn màn</Typography>
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
                                            sendToDevice(selectedPlant.fan.key, isFanOn ? "0" : "1");
                                    
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
            
        </LocalizationProvider>
    )
}

export default Parameter;

