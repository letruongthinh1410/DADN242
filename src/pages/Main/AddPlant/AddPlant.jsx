import React from "react";
import { Grid2, Box, TextField, InputAdornment, Typography } from "@mui/material";
import {
    Button,
    Select,
    MenuItem,
    FormControl,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    IconButton,
    Dialog,
    DialogTitle,
    DialogActions,
    Paper
  } from "@mui/material";
  
  import { SquarePlus, CirclePlus, Trash2, CircleX } from "lucide-react";
  import { NavLink } from "react-router-dom";

const PlantForm = ({plantData, handleChange}) => {
    return (
        <Box display="flex" flexDirection="column" gap={1} width={200} style={{margin: "auto"}}>
            {/* Mã số cây trồng */}
            <Typography fontWeight="bold">Mã số cây trồng:</Typography>
            <TextField
                variant="outlined"
                name="id"
                value={plantData.id}
                onChange={handleChange}
                inputProps={{ maxLength: 6 }}
                color="success"
                size="small"
                sx={{marginBottom: "1rem", width: "11rem"}}
            />

            {/* Tên cây trồng */}
            <Typography fontWeight="bold">Tên cây trồng:</Typography>
            <TextField
                variant="outlined"
                name="name"
                value={plantData.name}
                onChange={handleChange}
                color="success"
                size="small"
                sx={{marginBottom: "1rem", width: "11rem"}}
            />

            {/* Nhiệt độ phù hợp */}
            <Typography fontWeight="bold">Nhiệt độ phù hợp:</Typography>
            <TextField
                variant="outlined"
                type="number"
                name="temperature"
                value={plantData.temperature}
                onChange={handleChange}
                InputProps={{
                endAdornment: <InputAdornment position="end">°C</InputAdornment>,
                }}
                color="success"
                size="small"
                sx={{marginBottom: "1rem", width: "11rem"}}
            />

            {/* Độ ẩm đất phù hợp */}
            <Typography fontWeight="bold">Độ ẩm đất phù hợp:</Typography>
            <TextField
                variant="outlined"
                type="number"
                name="humidity"
                value={plantData.humidity}
                onChange={handleChange}
                InputProps={{
                endAdornment: <InputAdornment position="end">%</InputAdornment>,
                }}
                color="success"
                size="small"
                sx={{marginBottom: "1rem", width: "11rem"}}
            />

            {/* Ánh sáng phù hợp */}
            <Typography fontWeight="bold">Ánh sáng phù hợp:</Typography>
            <TextField
                variant="outlined"
                type="number"
                name="light"
                value={plantData.light}
                onChange={handleChange}
                InputProps={{
                    endAdornment: <InputAdornment position="end">%</InputAdornment>,
                }}
                color="success"
                size="small"
                sx={{marginBottom: "1rem", width: "11rem"}}
            />
        </Box>
    );
};
const AddPlant = () => {
    const [plantData, setPlantData] = React.useState({
        id: "",
        name: "",
        temperature: "",
        humidity: "",
        light: "",
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setPlantData({
        ...plantData,
        [name]: value,
        });
    };

    const [devices] = React.useState([
        {name: "Cảm biến ánh sáng", list_devices: ["AS001", "AS002", "AS003"]},
        {name: "Cảm biến nhiệt độ", list_devices: ["ND001", "ND002", "ND003"]},
        {name: "Cảm biến độ ẩm đất", list_devices: ["DA001", "DA002", "DA003"]}
    ])

    const [selectedType, setSelectedType] = React.useState("");
    const [selectedDevice, setSelectedDevice] = React.useState("");
    const [addedDevices, setAddedDevices] = React.useState([]);
    const [openDialog, setOpenDialog] = React.useState(false);

    const handleAddDevice = () => {
        if (selectedType && selectedDevice) {
            setAddedDevices([...addedDevices, { id: selectedDevice, type: selectedType }]);
            setSelectedDevice("");
        }
    };

    const handleDeleteDevice = (id) => {
        setAddedDevices(addedDevices.filter((device) => device.id !== id));
    };

    const handleDeleteAll = () => {
        setOpenDialog(true);
    };

    const confirmDeleteAll = () => {
        setAddedDevices([]);
        setOpenDialog(false);
    };

    return (
        <div className="add-plant" style={{ padding: "1rem 4rem", }}>
            <Grid2 container spacing={10}>
                <Grid2 sx={{xs: 6, md: 1}} >
                    <PlantForm plantData = {plantData} handleChange={handleChange}/>
                </Grid2>
                <Grid2 sx={{xs: 6, md: 11}} container spacing={10}>
                    <Grid2 sx={{xs: 6, md: 8}} > 
                        <TableContainer style={{border: "1px solid black", borderRadius: "1rem", height: "65vh", width: "35vw", overflow: "auto"}} component={Paper}>
                            <Table stickyHeader>
                                <TableHead>
                                    <TableRow>
                                        <TableCell style={{fontWeight: "600", textAlign: "center"}}>Mã thiết bị</TableCell>
                                        <TableCell style={{fontWeight: "600", textAlign: "center"}}>Tên thiết bị</TableCell>
                                        <TableCell style={{textAlign: "center"}}>
                                            <IconButton color="error" onClick={handleDeleteAll}>
                                                <Trash2 />
                                            </IconButton>
                                        </TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {addedDevices.map((device, index) => (
                                    <TableRow key={index}>
                                        <TableCell style={{textAlign: "center"}}>{device.id}</TableCell>
                                        <TableCell style={{textAlign: "center"}}>{device.type}</TableCell>
                                        <TableCell style={{textAlign: "center"}}>
                                            <IconButton color="error" onClick={() => handleDeleteDevice(device.id)}>
                                                <Trash2 />
                                            </IconButton>
                                        </TableCell>
                                    </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>

                        <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
                            <DialogTitle>Bạn có chắc chắn muốn xóa tất cả?</DialogTitle>
                            <DialogActions>
                            <Button onClick={() => setOpenDialog(false)} color="primary">
                                Hủy
                            </Button>
                            <Button onClick={confirmDeleteAll} color="error">
                                Xóa hết
                            </Button>
                            </DialogActions>
                        </Dialog>
                    </Grid2>
                    <Grid2 sx={{xs: 6, md: 4}} className="d-flex flex-column align-items-center justify-content-center">
                        <FormControl fullWidth style={{ marginBottom: "10px", width: "13rem" }}>
                            <Typography fontWeight="bold" style={{marginBottom: "0.3rem"}}>Thiết bị theo dõi:</Typography>
                            <Select value={selectedType} onChange={(e) => setSelectedType(e.target.value)} size="small">
                                <MenuItem key={""} value={""}>
                                   ---Tuỳ chọn---
                                </MenuItem>
                            {devices.map((device) => (
                                <MenuItem key={device.name} value={device.name}>
                                {device.name}
                                </MenuItem>
                            ))}
                            </Select>
                        </FormControl>

                        <FormControl fullWidth style={{ marginBottom: "10px", width: "13rem", marginTop: "1rem"}} disabled={!selectedType}>
                            <Typography fontWeight="bold" style={{marginBottom: "0.3rem"}}>Mã thiết bị:</Typography>
                            <Select
                                value={selectedDevice}
                                onChange={(e) => setSelectedDevice(e.target.value)}
                                size="small"
                            >
                                <MenuItem key={""} value={""}>
                                   ---Tuỳ chọn---
                                </MenuItem>
                            {devices
                                .find((device) => device.name === selectedType)?.list_devices.map((id) => (
                                <MenuItem key={id} value={id}>
                                    {id}
                                </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                        <Button 
                            variant="contained" 
                            backgroundColor="#0ba6ff" 
                            style = {{marginTop: "0.6rem", padding: "0.5rem 0", textTransform: "none", width: "10rem"}} 
                            fullWidth onClick={handleAddDevice}
                        >
                            <SquarePlus style = {{marginRight: "0.6rem",}}/> Thêm thiết bị
                        </Button>
                    </Grid2>
                </Grid2>
            </Grid2>
            <div className="d-flex justify-content-end align-items-center" style={{marginTop: "1rem"}}>
                <Button 
                    variant="contained" 
                    backgroundColor="#0ba6ff" 
                    style = {{padding: "0.5rem 0", marginRight: "1rem", textTransform: "none", width: "10rem"}} 
                    fullWidth onClick={handleAddDevice}
                >
                    <CirclePlus style = {{marginRight: "0.6rem",}}/> Thêm cây trồng
                </Button>
                <NavLink to="/plants">
                    <Button 
                        variant="contained" 
                        color="error" 
                        style = {{padding: "0.5rem 0", textTransform: "none", width: "7rem"}} 
                        fullWidth onClick={handleAddDevice}
                    >
                        <CircleX style = {{marginRight: "0.6rem",}}/> Huỷ
                    </Button>
                </NavLink>
            </div>
        </div>
    );
}

export default AddPlant;



