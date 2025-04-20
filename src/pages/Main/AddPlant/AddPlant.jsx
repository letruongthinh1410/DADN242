import React from "react";
import { Grid, Box, TextField, InputAdornment, Typography, Button, MenuItem, 
    CircularProgress, Dialog, DialogContent, DialogContentText, DialogTitle, DialogActions } from "@mui/material";
  
import { CirclePlus, CircleX, Thermometer, Droplets, Sun } from "lucide-react";
import { NavLink, useNavigate } from "react-router-dom";
import { CreateGroup, CreateFeeds, CreateRule, DeleteGroup } from "../../../api";

const token = "..."

const AddPlant = () => {
    const navigate = useNavigate()
    const [plantData, setPlantData] = React.useState({
        name: "",
        temperature: {
            ceiling: "",
            floor: "",
            outputFeedAbove: "",
            outputFeedBelow: "",
            aboveValue: "",
            belowValue: "",
        },
        humidity: {
            ceiling: "",
            floor: "",
            outputFeedAbove: "",
            outputFeedBelow: "",
            aboveValue: "",
            belowValue: "",
        },
        light: {
            ceiling: "",
            floor: "",
            outputFeedAbove: "",
            outputFeedBelow: "",
            aboveValue: "",
            belowValue: "",
        },
    });

    const [loading, setLoading] = React.useState(false);
    const [openConfirm, setOpenConfirm] = React.useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        const [section, field] = name.split(".");
    
        if (field) {
            setPlantData((prev) => ({
                ...prev,
                [section]: {
                    ...prev[section],
                    [field]: value,
                },
            }));
        } else {
            setPlantData((prev) => ({
                ...prev,
                [name]: value,
            }));
        }
    };

    const handleConfirmAddPlant = async (e) => {
        e.preventDefault()
        setOpenConfirm(true)
    }
    
    const handleAddPlant = async (e) => {
        e.preventDefault();

        setLoading(true)
        
        //token tạm thời
        let response
        try {
            response = await CreateGroup({
                groupName: plantData.name,
                token: token,
            });

            await CreateFeeds({
                groupName: response,
                feedName: "temp",
                feedFloor: plantData.temperature.floor,
                feedCeiling: plantData.temperature.ceiling,
                token: token,
            })
            await CreateFeeds({
                groupName: response,
                feedName: "pump",
                feedFloor: plantData.humidity.floor,
                feedCeiling: plantData.humidity.ceiling,
                token: token,
            })
            await CreateFeeds({
                groupName: response,
                feedName: "light",
                feedFloor: plantData.light.floor,
                feedCeiling: plantData.light.ceiling,
                token: token,
            })
            await CreateFeeds({
                groupName: response,
                feedName: "fan",
                feedFloor: 0,
                feedCeiling: 1,
                token: token,
            })
            
            await CreateRule({
                    inputFeed: `${response.key}.temp`,
                    ceiling: plantData.temperature.ceiling,
                    floor: plantData.temperature.floor,
                    outputFeedAbove: `${response.key}${plantData.temperature.outputFeedAbove}`,
                    outputFeedBelow: `${response.key}${plantData.temperature.outputFeedBelow}`,
                    aboveValue: plantData.temperature.aboveValue,
                    belowValue: plantData.temperature.belowValue,
                    token: token,
                })
            await CreateRule({
                inputFeed: `${response.key}.pump`,
                ceiling: plantData.humidity.ceiling,
                floor: plantData.humidity.floor,
                outputFeedAbove: `${response.key}${plantData.humidity.outputFeedAbove}`,
                outputFeedBelow: `${response.key}${plantData.humidity.outputFeedBelow}`,
                aboveValue: plantData.humidity.aboveValue,
                belowValue: plantData.humidity.belowValue,
                token: token,
            })
            await CreateRule({
                inputFeed: `${response.key}.light`,
                ceiling: plantData.light.ceiling,
                floor: plantData.light.floor,
                outputFeedAbove: `${response.key}${plantData.light.outputFeedAbove}`,
                outputFeedBelow: `${response.key}${plantData.light.outputFeedBelow}`,
                aboveValue: plantData.light.aboveValue,
                belowValue: plantData.light.belowValue,
                token: token,
            })

            alert(`Thêm cây trồng ${plantData.name} thành công!`);
            navigate("/plants")
        }
        catch (error) {
            if (response) {
                await DeleteGroup({
                    groupName: response,
                    token: token,
                }) 
            }
            console.error("Error adding plant:", error);
            alert("Thêm cây trồng không thành công!");
        }
        finally {
            setLoading (false)
            setOpenConfirm(false)
        }
    }

    return (
        <div className="add-plant" style={{ margin: "1rem 4rem", padding: "1rem", border: "1px solid black", borderRadius: "1rem" }}>
            <Grid container spacing={2} className="d-flex flex-column align-items-center">
                <Grid item xs={12} md={3} className="d-flex align-items-center">
                    <Typography fontWeight="bold" style={{width: "13rem"}}>Tên cây trồng:</Typography>
                    <TextField
                        variant="outlined"
                        name="name"
                        value={plantData.name}
                        onChange={handleChange}
                        color="success"
                        size="small"
                        sx={{ width: "100%" }}
                    />
                </Grid>
                <Grid item size={12} container spacing={2}>
                    {/* Nhiệt độ phù hợp */}
                    <Grid item size={{xs: 12, md: 4}} container spacing={2} sx={{ backgroundColor: "#D0F4E0", padding: "1rem", borderRadius: "8px" }}>
                        <Grid item xs={12}>
                            <Typography fontWeight="bold" fullWidth style={{ marginBottom: "1rem" , textAlign: "center", color: "#2C98A0" }}>
                                <Thermometer size={30}/> Nhiệt độ
                            </Typography>
                            <Box display="flex" gap={1} alignItems="center" sx={{ marginBottom: "1rem" }}>
                                <Typography fontWeight="bold" style={{ width: "6rem" }}>Tối thiểu:</Typography>
                                <TextField
                                    slotProps={{
                                        input: {
                                            endAdornment: <InputAdornment position="start">°C</InputAdornment>,
                                        },
                                    }}
                                    variant="outlined"
                                    type="number"
                                    name="temperature.floor"
                                    value={plantData.temperature.floor}
                                    onChange={handleChange}
                                    placeholder="Tối thiểu"
                                    color="success"
                                    size="small"
                                    sx={{ width: "10rem" }}
                                />
                            </Box>
                            <Box display="flex" gap={1} alignItems="center" sx={{ marginBottom: "1rem" }}>
                                <Typography fontWeight="bold" style={{ width: "6rem" }}>Tối đa:</Typography>
                                <TextField
                                    slotProps={{
                                        input: {
                                            endAdornment: <InputAdornment position="start">°C</InputAdornment>,
                                        },
                                    }}
                                    variant="outlined"
                                    type="number"
                                    name="temperature.ceiling"
                                    value={plantData.temperature.ceiling}
                                    onChange={handleChange}
                                    placeholder="Tối đa"
                                    color="success"
                                    size="small"
                                    sx={{ width: "10rem" }}
                                />
                            </Box>
                            <Typography fontWeight="bold" style={{ marginBottom: "1rem" }}>
                                Cao hơn tối đa
                            </Typography>
                            <Box display="flex" gap={1} alignItems="center" sx={{ marginBottom: "1rem" }}>
                                <Typography fontWeight="bold" style={{ width: "9rem" }}>Điều chỉnh thiết bị:</Typography>
                                <TextField
                                    select
                                    variant="outlined"
                                    name="temperature.outputFeedAbove"
                                    value={plantData.temperature.outputFeedAbove}
                                    onChange={handleChange}
                                    color="success"
                                    size="small"
                                    sx={{ width: "10rem" }}
                                >
                                    <MenuItem value="">Tuỳ chọn</MenuItem>
                                    <MenuItem value=".temp">Cảm biến nhiệt độ</MenuItem>
                                    <MenuItem value=".pump">Cảm biến độ ẩm đất</MenuItem>
                                    <MenuItem value=".light">Cảm biến ánh sáng</MenuItem>
                                </TextField>
                            </Box>
                            <Box display="flex" gap={1} alignItems="center" sx={{ marginBottom: "1rem" }}>
                                <Typography fontWeight="bold" style={{ width: "9rem" }}>Giá trị điều chỉnh:</Typography>
                                <TextField
                                    variant="outlined"
                                    type="number"
                                    name="temperature.aboveValue"
                                    value={plantData.temperature.aboveValue}
                                    onChange={handleChange}
                                    placeholder="Nhập giá trị"
                                    color="success"
                                    size="small"
                                    sx={{ width: "10rem" }}
                                />
                            </Box>
                            <Typography fontWeight="bold" style={{ marginBottom: "1rem" }}>
                                Thấp hơn tối thiểu
                            </Typography>
                            <Box display="flex" gap={1} alignItems="center" sx={{ marginBottom: "1rem" }}>
                                <Typography fontWeight="bold" style={{ width: "9rem" }}>Điều chỉnh thiết bị:</Typography>
                                <TextField
                                    select
                                    variant="outlined"
                                    name="temperature.outputFeedBelow"
                                    value={plantData.temperature.outputFeedBelow}
                                    onChange={handleChange}
                                    color="success"
                                    size="small"
                                    sx={{ width: "10rem" }}
                                >
                                    <MenuItem value="">Tuỳ chọn</MenuItem>
                                    <MenuItem value=".temp">Cảm biến nhiệt độ</MenuItem>
                                    <MenuItem value=".pump">Cảm biến độ ẩm đất</MenuItem>
                                    <MenuItem value=".light">Cảm biến ánh sáng</MenuItem>
                                </TextField>
                            </Box>
                            <Box display="flex" gap={1} alignItems="center" sx={{ marginBottom: "1rem" }}>
                                <Typography fontWeight="bold" style={{ width: "9rem" }}>Giá trị điều chỉnh:</Typography>
                                <TextField
                                    variant="outlined"
                                    type="number"
                                    name="temperature.belowValue"
                                    value={plantData.temperature.belowValue}
                                    onChange={handleChange}
                                    placeholder="Nhập giá trị"
                                    color="success"
                                    size="small"
                                    sx={{ width: "10rem" }}
                                />
                            </Box>
                        </Grid>
                    </Grid>
                    {/* Độ ẩm đất phù hợp */}
                    <Grid item size={{xs: 12, md: 4}} container spacing={2} sx={{ backgroundColor: "#e7f1ff", padding: "1rem", borderRadius: "8px" }}>
                        <Grid item xs={12}>
                            <Typography fontWeight="bold" fullWidth style={{ marginBottom: "1rem", textAlign: "center", color: "#334EAC" }}>
                                <Droplets size={30} style={{ marginRight: "0.2rem"}} /> Độ ẩm đất
                            </Typography>
                            <Box display="flex" gap={1} alignItems="center" sx={{ marginBottom: "1rem" }}>
                                <Typography fontWeight="bold" style={{ width: "6rem"}}>Tối thiểu:</Typography>
                                <TextField
                                    slotProps={{
                                        input: {
                                            endAdornment: <InputAdornment position="start">%</InputAdornment>,
                                        },
                                    }}
                                    variant="outlined"
                                    type="number"
                                    name="humidity.floor"
                                    value={plantData.humidity.floor}
                                    onChange={handleChange}
                                    placeholder="Tối thiểu"
                                    color="success"
                                    size="small"
                                    sx={{ width: "10rem" }}
                                />
                            </Box>
                            <Box display="flex" gap={1} alignItems="center" sx={{ marginBottom: "1rem" }}>
                                <Typography fontWeight="bold" style={{ width: "6rem" }}>Tối đa:</Typography>
                                <TextField
                                    slotProps={{
                                        input: {
                                            endAdornment: <InputAdornment position="start">%</InputAdornment>,
                                        },
                                    }}
                                    variant="outlined"
                                    type="number"
                                    name="humidity.ceiling"
                                    value={plantData.humidity.ceiling}
                                    onChange={handleChange}
                                    placeholder="Tối đa"
                                    color="success"
                                    size="small"
                                    sx={{ width: "10rem" }}
                                />
                            </Box>
                            <Typography fontWeight="bold" style={{ marginBottom: "1rem" }}>
                                Cao hơn tối đa
                            </Typography>
                            <Box display="flex" gap={1} alignItems="center" sx={{ marginBottom: "1rem" }}>
                                <Typography fontWeight="bold" style={{ width: "9rem" }}>Điều chỉnh thiết bị:</Typography>
                                <TextField
                                    select
                                    variant="outlined"
                                    name="humidity.outputFeedAbove"
                                    value={plantData.humidity.outputFeedAbove}
                                    onChange={handleChange}
                                    color="success"
                                    size="small"
                                    sx={{ width: "10rem" }}
                                >
                                    <MenuItem value="">Tuỳ chọn</MenuItem>
                                    <MenuItem value=".temp">Cảm biến nhiệt độ</MenuItem>
                                    <MenuItem value=".pump">Cảm biến độ ẩm đất</MenuItem>
                                    <MenuItem value=".light">Cảm biến ánh sáng</MenuItem>
                                </TextField>
                            </Box>
                            <Box display="flex" gap={1} alignItems="center" sx={{ marginBottom: "1rem" }}>
                                <Typography fontWeight="bold" style={{ width: "9rem" }}>Giá trị điều chỉnh:</Typography>
                                <TextField
                                    variant="outlined"
                                    type="number"
                                    name="humidity.aboveValue"
                                    value={plantData.humidity.aboveValue}
                                    onChange={handleChange}
                                    placeholder="Nhập giá trị"
                                    color="success"
                                    size="small"
                                    sx={{ width: "10rem" }}
                                />
                            </Box>
                            <Typography fontWeight="bold" style={{ marginBottom: "1rem" }}>
                                Thấp hơn tối thiểu
                            </Typography>
                            <Box display="flex" gap={1} alignItems="center" sx={{ marginBottom: "1rem" }}>
                                <Typography fontWeight="bold" style={{ width: "9rem" }}>Điều chỉnh thiết bị:</Typography>
                                <TextField
                                    select
                                    variant="outlined"
                                    name="humidity.outputFeedBelow"
                                    value={plantData.humidity.outputFeedBelow}
                                    onChange={handleChange}
                                    color="success"
                                    size="small"
                                    sx={{ width: "10rem" }}
                                >
                                    <MenuItem value="">Tuỳ chọn</MenuItem>
                                    <MenuItem value=".temp">Cảm biến nhiệt độ</MenuItem>
                                    <MenuItem value=".pump">Cảm biến độ ẩm đất</MenuItem>
                                    <MenuItem value=".light">Cảm biến ánh sáng</MenuItem>
                                </TextField>
                            </Box>
                            <Box display="flex" gap={1} alignItems="center" sx={{ marginBottom: "1rem" }}>
                                <Typography fontWeight="bold" style={{ width: "9rem" }}>Giá trị điều chỉnh:</Typography>
                                <TextField
                                    variant="outlined"
                                    type="number"
                                    name="humidity.belowValue"
                                    value={plantData.humidity.belowValue}
                                    onChange={handleChange}
                                    placeholder="Nhập giá trị"
                                    color="success"
                                    size="small"
                                    sx={{ width: "10rem" }}
                                />
                            </Box>
                        </Grid>
                    </Grid>
                    <Grid item size={{xs: 12, md: 4}} container spacing={2} sx={{ backgroundColor: "#FFFBD6", padding: "1rem", borderRadius: "8px"}}>
                        <Grid item xs={12}>
                            <Typography fontWeight="bold" fullWidth style={{ marginBottom: "1rem", textAlign: "center", color: "#ECA611" }}>
                                <Sun size={30} style={{ marginRight: "0.2rem" }} /> Ánh sáng
                            </Typography>
                            <Box display="flex" gap={1} alignItems="center" sx={{ marginBottom: "1rem" }}>
                                <Typography fontWeight="bold" style={{ width: "6rem" }}>Tối thiểu:</Typography>
                                <TextField
                                    slotProps={{
                                        input: {
                                            endAdornment: <InputAdornment position="start">%</InputAdornment>,
                                        },
                                    }}
                                    variant="outlined"
                                    type="number"
                                    name="light.floor"
                                    value={plantData.light.floor}
                                    onChange={handleChange}
                                    placeholder="Tối thiểu"
                                    color="success"
                                    size="small"
                                    sx={{ width: "10rem" }}
                                />
                            </Box>
                            <Box display="flex" gap={1} alignItems="center" sx={{ marginBottom: "1rem" }}>
                                <Typography fontWeight="bold" style={{ width: "6rem" }}>Tối đa:</Typography>
                                <TextField
                                    slotProps={{
                                        input: {
                                            endAdornment: <InputAdornment position="start">%</InputAdornment>,
                                        },
                                    }}
                                    variant="outlined"
                                    type="number"
                                    name="light.ceiling"
                                    value={plantData.light.ceiling}
                                    onChange={handleChange}
                                    placeholder="Tối đa"
                                    color="success"
                                    size="small"
                                    sx={{ width: "10rem" }}
                                />
                            </Box>
                            <Typography fontWeight="bold" style={{ marginBottom: "1rem" }}>
                                Cao hơn tối đa
                            </Typography>
                            <Box display="flex" gap={1} alignItems="center" sx={{ marginBottom: "1rem" }}>
                                <Typography fontWeight="bold" style={{ width: "9rem" }}>Điều chỉnh thiết bị:</Typography>
                                <TextField
                                    select
                                    variant="outlined"
                                    name="light.outputFeedAbove"
                                    value={plantData.light.outputFeedAbove}
                                    onChange={handleChange}
                                    color="success"
                                    size="small"
                                    sx={{ width: "10rem" }}
                                >
                                    <MenuItem value="">Tuỳ chọn</MenuItem>
                                    <MenuItem value=".temp">Cảm biến nhiệt độ</MenuItem>
                                    <MenuItem value=".pump">Cảm biến độ ẩm đất</MenuItem>
                                    <MenuItem value=".light">Cảm biến ánh sáng</MenuItem>
                                </TextField>
                            </Box>
                            <Box display="flex" gap={1} alignItems="center" sx={{ marginBottom: "1rem" }}>
                                <Typography fontWeight="bold" style={{ width: "9rem" }}>Giá trị điều chỉnh:</Typography>
                                <TextField
                                    variant="outlined"
                                    type="number"
                                    name="light.aboveValue"
                                    value={plantData.light.aboveValue}
                                    onChange={handleChange}
                                    placeholder="Nhập giá trị"
                                    color="success"
                                    size="small"
                                    sx={{ width: "10rem" }}
                                />
                            </Box>
                            <Typography fontWeight="bold" style={{ marginBottom: "1rem" }}>
                                Thấp hơn tối thiểu
                            </Typography>
                            <Box display="flex" gap={1} alignItems="center" sx={{ marginBottom: "1rem" }}>
                                <Typography fontWeight="bold" style={{ width: "9rem" }}>Điều chỉnh thiết bị:</Typography>
                                <TextField
                                    select
                                    variant="outlined"
                                    name="light.outputFeedBelow"
                                    value={plantData.light.outputFeedBelow}
                                    onChange={handleChange}
                                    color="success"
                                    size="small"
                                    sx={{ width: "10rem" }}
                                >
                                    <MenuItem value="">Tuỳ chọn</MenuItem>
                                    <MenuItem value=".temp">Cảm biến nhiệt độ</MenuItem>
                                    <MenuItem value=".pump">Cảm biến độ ẩm đất</MenuItem>
                                    <MenuItem value=".light">Cảm biến ánh sáng</MenuItem>
                                </TextField>
                            </Box>
                            <Box display="flex" gap={1} alignItems="center" sx={{ marginBottom: "1rem" }}>
                                <Typography fontWeight="bold" style={{ width: "9rem" }}>Giá trị điều chỉnh:</Typography>
                                <TextField
                                    variant="outlined"
                                    type="number"
                                    name="light.belowValue"
                                    value={plantData.light.belowValue}
                                    onChange={handleChange}
                                    placeholder="Nhập giá trị"
                                    color="success"
                                    size="small"
                                    sx={{ width: "10rem" }}
                                />
                            </Box>
                        </Grid>
                    </Grid>
                </Grid>

            </Grid>
            <div className="d-flex justify-content-end align-items-center" style={{marginTop: "1rem"}}>
                <Button 
                    variant="contained" 
                    backgroundColor="#0ba6ff" 
                    style = {{padding: "0.5rem 0", marginRight: "1rem", textTransform: "none", width: "10rem"}} 
                    fullWidth onClick={handleConfirmAddPlant}
                >
                    <CirclePlus style = {{marginRight: "0.6rem",}}/> Thêm cây trồng
                </Button>
                <NavLink to="/plants">
                    <Button 
                        variant="contained" 
                        color="error" 
                        style = {{padding: "0.5rem 0", textTransform: "none", width: "7rem"}} 
                        fullWidth 
                    >
                        <CircleX style = {{marginRight: "0.6rem",}}/> Huỷ
                    </Button>
                </NavLink>
            </div>
            {/* Loading overlay */}
            {loading ? (
                <div style={{
                    position: "fixed", top: 0, left: 0, width: "100%", height: "100%",
                    backgroundColor: "rgba(0,0,0,0.4)", display: "flex", justifyContent: "center", alignItems: "center", zIndex: 9999
                }}>
                    <CircularProgress size="6rem" />
                </div>
            ) : (
                <Dialog open={openConfirm} onClose={() => setOpenConfirm(false)}>
                    <DialogTitle>Xác nhận thêm cây trồng</DialogTitle>
                    <DialogContent>
                    <DialogContentText>
                        Bạn có chắc chắn muốn thêm cây trồng <strong>{plantData.name}</strong> không?
                    </DialogContentText>
                    </DialogContent>
                    <DialogActions>
                    <Button onClick={() => setOpenConfirm(false)} color="inherit">Hủy</Button>
                    <Button onClick={handleAddPlant} color="primary">Đồng ý</Button>
                    </DialogActions>
                </Dialog>
            )}

            
        </div>
    );
}

export default AddPlant;



