import React from "react";

import { FormControl, Select, MenuItem, Typography, Grid2, Alert } from "@mui/material";
import { Gauge, gaugeClasses } from '@mui/x-charts/Gauge';

const Parameter = () => {

    const plants = [
        { id: "TMT001", name: "Cà chua", type: "Hoa quả", temperature: 27, humidity: 50, light: 50, status: "Nhiệt độ cao", sign: true, devices: ["Cảm biến ánh sáng AS001", "Cảm biến nhiệt độ ND001", "Cảm biến độ ẩm đất DA001"] },
        { id: "RSF001", name: "Hoa hồng", type: "Hoa", temperature: 27, humidity: 50, light: 50, status: "Độ ẩm đất thấp", sign: true, devices: ["Cảm biến ánh sáng AS001", "Cảm biến nhiệt độ ND001", "Cảm biến độ ẩm đất DA001"] },
        { id: "ORF001", name: "Hoa ly", type: "Hoa", temperature: 27, humidity: 50, light: 50, status: "Bình thường", sign: false, devices: ["Cảm biến ánh sáng AS001", "Cảm biến nhiệt độ ND001", "Cảm biến độ ẩm đất DA001"] },
        { id: "CBF001", name: "Cây bắp cải", type: "Rau", temperature: 27, humidity: 50, light: 50, status: "Bình thường", sign: false, devices: ["Cảm biến ánh sáng AS001", "Cảm biến nhiệt độ ND001", "Cảm biến độ ẩm đất DA001"] },
        { id: "HLT001", name: "Hoa lan", type: "Hoa", temperature: 27, humidity: 50, light: 50, status: "Bình thường", sign: false, devices: ["Cảm biến ánh sáng AS001", "Cảm biến nhiệt độ ND001", "Cảm biến độ ẩm đất DA001"] },
        { id: "BMT001", name: "Bí ngô", type: "Hoa quả", temperature: 27, humidity: 50, light: 50, status: "Nhiệt độ cao", sign: true, devices: ["Cảm biến ánh sáng AS001", "Cảm biến nhiệt độ ND001", "Cảm biến độ ẩm đất DA001"] },
        { id: "LMT001", name: "Lá lốt", type: "Lá", temperature: 27, humidity: 50, light: 50, status: "Bình thường", sign: false, devices: ["Cảm biến ánh sáng AS001", "Cảm biến nhiệt độ ND001", "Cảm biến độ ẩm đất DA001"] },
    ];
    
        const [selectedPlant, setPlant] = React.useState(plants[0]);

    return (
        <Grid2 container spacing={1}>
            <Grid2 size={{ xs: 12, md: 9 }}>
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
                <Grid2 container spacing={1}>
                    <Grid2 size={{xs: 12, md: 6}}>
                        <Typography variant="body1" fontWeight="bold">
                            Độ ẩm đất
                        </Typography>
                        <Gauge 
                            width={200} 
                            height={200} 
                            value={60} 
                            startAngle={-155} 
                            endAngle={155} 
                        />
                    </Grid2>
                    <Grid2 size={{xs: 12, md: 6}}>
                        
                    </Grid2>
                </Grid2>
                <Grid2 container spacing={1}>
                    <Grid2 size={{xs: 12, md: 6}}>

                    </Grid2>
                    <Grid2 size={{xs: 12, md: 6}}>
                        
                    </Grid2>
                </Grid2>
            </Grid2>
            <Grid2 size={{ xs: 12, md: 3 }}>
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
            </Grid2>
        </Grid2>
        
)
}

export default Parameter;