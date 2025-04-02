import React from "react";

import { FormControl, Select, MenuItem, Typography, Grid, Alert, Button, Switch, TableContainer, Table, TableBody, TableCell, TableHead, TableRow} from "@mui/material";
import { Gauge, gaugeClasses } from '@mui/x-charts/Gauge';
import { LineChart } from "@mui/x-charts/LineChart";
import { TimePicker, LocalizationProvider } from "@mui/x-date-pickers";

import { takePlantsList } from "../../../api";
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from "dayjs";

import { Sun, ThermometerSun, Droplets } from "lucide-react";
const Chart = ({num, humidity, temperature, light, xLabels}) => {
    switch (num) { 
        case 1: {
            return (
                <LineChart
                    width={800}
                    height={500}
                        series={[
                            { data: temperature, label: 'Nhiệt độ', area: true,},
                        ]}
                        xAxis={[{ scaleType: 'point', data: xLabels }]}
                        grid={{ vertical: true, horizontal: true }}
                />
            );
        }
        case 2: {
            return (
                <LineChart
                    width={800}
                    height={500}
                        series={[
                            { data: humidity, label: 'Độ ẩm đất', area: true,},
                        ]}
                        xAxis={[{ scaleType: 'point', data: xLabels }]}
                        grid={{ vertical: true, horizontal: true }}
                />
            );
        }
        case 3: {
            return (
                <LineChart
                    width={800}
                    height={500}
                        series={[
                            { data: light, label: 'Ánh sáng', area: true,},
                        ]}
                        xAxis={[{ scaleType: 'point', data: xLabels }]}
                        grid={{ vertical: true, horizontal: true }}
                />
            );
        }
        default: {
            break;
        }
    }
}

const ButtonList = [
    {name: "Nhiệt độ", icon: <ThermometerSun style={{marginRight: "0.5rem"}}/>},
    {name: "Độ ẩm đất", icon: <Droplets style={{marginRight: "0.5rem"}}/>},
    {name: "Ánh sáng", icon: <Sun style={{marginRight: "0.5rem"}}/>},
]

const Parameter = () => {
    const plants = takePlantsList();
    const [selectedPlant, setPlant] = React.useState(plants[0]);

    const [time, setTime] = React.useState(dayjs());

    const [scroll, setScroll] = React.useState(true);

    const handleScroll = (event) => {
        setScroll(event.target.checked);
    };

    const [num, setNum] = React.useState(1); // quản lý button line chart
    const humidity = [60, 70, 50, 60, 55, 67, 59];
    const temperature = [25, 26, 30, 31, 24, 22, 23];
    const light = [34, 45, 50, 32, 45, 43, 47];
    const xLabels = [
        '0h',
        '2h',
        '4h',
        '8h',
        '10h',
        '12h',
        '14h',
        '16h',
        '18h',
        '20h',
        '22h',
        '24h',
    ];

    const handleChangeSwitch = (event) => {

    }
    return (
        <LocalizationProvider dateAdapter={AdapterDayjs} >
            <Grid container spacing={1} style={{padding: "0 4rem"}}>
                <Grid size={{xs: 12, md: 8}}>
                    <FormControl fullWidth style={{ marginBottom: "10px", width: "13rem" }} >
                        <Typography fontWeight="bold" style={{marginBottom: "0.3rem"}}>Cây trồng:</Typography>
                        <Select value={selectedPlant} onChange={(e) => setPlant(e.target.value)} size="small">
                            {plants.map((plant) => (
                                <MenuItem key={plant.id} value={plant}>
                                    {plant.name} - {plant.id}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                    <Grid container spacing={2} padding={2}>
                        <Grid size={12}>
                            <Typography variant="body1" fontWeight="bold" style={{ alignSelf: "flex-start" }}>
                                Độ ẩm đất
                            </Typography>
                        </Grid>

                        <Grid 
                            size={{xs: 12, md: 5}} 
                            container 
                            spacing={2} 
                            className="d-flex align-items-center justify-content-start" 
                            style={{marginRight: "3rem"}}
                        >
                                <div 
                                    style={{
                                        width: "10rem",
                                        height: "10rem",
                                    }}
                                >
                                    <Gauge
                                        value={selectedPlant.humidity}
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
                                >
                                    Tưới tiêu
                                </Button>
                        </Grid>
                        <Grid size={{xs: 12, md: 4}}  container spacing={1} style={{height: "fit-content"}}>
                            <Grid size={12}>
                                <Typography variant="body1" fontWeight="bold" style={{ alignSelf: "flex-start",}} >
                                    Hẹn giờ tưới nước:
                                </Typography>
                            </Grid>
                            <div className="d-flex align-items-center">
                                <Grid size={{xs: 12, md: 6}}  style={{width: "13rem",}}>
                                    <TimePicker
                                        onChange={(newTime) => setTime(newTime)}
                                        value={time}
                                    />
                                </Grid>
                                <Grid size={{xs: 12, md: 6}} >
                                    <Button
                                        variant="contained"
                                        sx={{
                                            width: "30%",
                                            height: "30%",
                                            borderRadius: "10px",
                                            fontSize: 16,
                                            fontWeight: "bold",
                                            textTransform: "none",
                                            backgroundColor: "#03DDFF",
                                            color: "white",
                                            marginLeft: "1rem",
                                        }}>
                                        Lưu
                                    </Button>
                                </Grid>
                            </div>
                        </Grid>
                    </Grid>   
                    <Grid container spacing={1} padding={2}>
                        <Grid size={{xs: 12, md: 5}} container spacing={2} padding={2}>
                            <Grid size={12}>
                                <Typography variant="body1" fontWeight="bold" style={{ alignSelf: "flex-start" }}>
                                    Nhiệt độ
                                </Typography>
                            </Grid>
                            <div className="d-flex align-items-center justify-content-start">
                                <Grid  
                                    size={{xs: 12, md: 6}} 
                                    className="d-flex flex-column" 
                                    style={{
                                        alignItems: "center", 
                                    }}
                                >
                                    <div 
                                        style={{
                                            width: "10rem",
                                            height: "10rem",
                                        }}
                                    >
                                        <Gauge
                                            value={(selectedPlant.temperature / 40) * 100}
                                            startAngle={-160}
                                            endAngle={160}
                                            innerRadius="70%"
                                            outerRadius="100%"
                                            style={{alignSelf: "center"}}
                                            text={({value}) => `${(value * 40) / 100}°C`}
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
                                <Grid size={{xs: 12, md: 6}} className="d-flex align-items-center justify-content-center">
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
                                    >
                                        Làm mát
                                    </Button>
                                </Grid>
                            </div>
                        </Grid>
                        <Grid size={{xs: 12, md: 7}} container spacing={2} padding={2}>
                            <Grid size={12}>
                                <Typography variant="body1" fontWeight="bold" style={{ alignSelf: "flex-start" }}>
                                    Ánh sáng
                                </Typography>
                            </Grid>
                            <div className="d-flex align-items-center justify-content-start">
                                <Grid  
                                    size={{xs: 12, md: 5}} 
                                    className="d-flex flex-column" 
                                    style={{
                                        alignItems: "center", 
                                    }}
                                >
                                    <div 
                                        style={{
                                            width: "10rem",
                                            height: "10rem",
                                        }}
                                    >
                                        <Gauge
                                            value={selectedPlant.light}
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
                                    size={{xs: 12, md: 7}} 
                                    className="d-flex align-items-center justify-content-between"
                                    style={{marginLeft: "1.3rem",}}
                                >
                                    <span>Thả màn</span>
                                    <Switch
                                        checked={scroll}
                                        onChange={handleScroll}
                                        color="warning"
                                    />
                                    <span>Cuốn màn</span>
                                </Grid>
                            </div>
                        </Grid>
                    </Grid>
                </Grid>
                <Grid size={{xs: 12, md: 4}} container spacing={1} padding={2} className="d-flex flex-column">
                    <Grid size={12} style={{margin: "0 3rem"}}>
                        <Typography variant="h6" fontWeight="bold" style={{marginBottom: "0.7rem"}}>
                            {selectedPlant.id} : {selectedPlant.name}
                        </Typography>
                        <Typography variant="body1" style={{marginBottom: "0.1rem"}}>
                            Nhiệt độ phù hợp: {selectedPlant.temperature}°C
                        </Typography>
                        <Typography variant="body1" style={{marginBottom: "0.1rem"}}>
                            Độ ẩm phù hợp: {selectedPlant.humidity}%
                        </Typography>
                        <Typography variant="body1" style={{marginBottom: "0.1rem"}}>
                            Ánh sáng phù hợp: {selectedPlant.light}%
                        </Typography>
                        <Typography variant="body2" color={selectedPlant.sign ? "error" : "success"} mt={1}>
                            <Alert severity={selectedPlant.sign ? "error" : "success"} style = {{padding: "0 1rem", maxWidth: "15rem", maxHeight: "3rem"}}>{selectedPlant.status}</Alert>
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
                                    {selectedPlant.devices.map((device) => (
                                        <TableRow key={device.id}>
                                            <TableCell style={{textAlign: "center"}}>{device.id}</TableCell>
                                            <TableCell style={{textAlign: "center"}}>{device.name}</TableCell>
                                            <TableCell style={{textAlign: "center"}}>
                                                <Switch
                                                    checked={device.status}
                                                    onChange={handleChangeSwitch}
                                                />
                                            </TableCell>
                                        </TableRow>
                                    ))}
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
                                color: num === index + 1 ? "white" : "black",
                                backgroundColor: index + 1 === 2 ? "#42A5F5" : (index + 1 === 1 ? "#00FF26" : "#F2FF00"),
                                "&:hover": {
                                    backgroundColor: num === index + 1 ? "#3eaef4" : "#f0f0f0",
                                    color: num === index + 1 ? "white" : "#3eaef4",
                                },
                            }}
                            onClick={() => setNum(index + 1)}
                        >
                            {item.icon}
                            {item.name}
                        </Button>
                    ))}
                </Grid>
                <Grid size={{xs: 12, md: 9}}>
                    <Chart num={num} humidity={humidity} temperature={temperature} light={light} xLabels={xLabels}/>
                </Grid>
            </Grid>
            
        </LocalizationProvider>
)
}

export default Parameter;