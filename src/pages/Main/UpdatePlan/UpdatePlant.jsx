import React from "react";
import { 
    Grid, 
    Box, 
    TextField, 
    InputAdornment, 
    Typography, 
    Button, 
    MenuItem, 
    Dialog, 
    DialogTitle, 
    DialogActions, 
    DialogContent, 
    DialogContentText, 
    CircularProgress 
} from "@mui/material";
  
  import { Save, CircleX, Thermometer, Droplets, Sun } from "lucide-react";

  import { NavLink, useNavigate, useLocation } from "react-router-dom";
  import { ModifyFeed, ModifyGroup, ModifyRule } from "../../../api";

const UpdatePlant = () => { 
    const navigate = useNavigate();

    const location = useLocation();
    const plant = location.state?.plant || null;

    const plantOrigin = {
        id: plant.id,
        name: plant.name,
        key: plant.key,
        fan: {
            id: plant.fan.id,
            name: plant.fan.name,
            key: plant.fan.key,
        },
        temperature: {
            ceiling: plant.temperature.ceiling,
            floor: plant.temperature.floor,
            outputFeedAbove: plant.temperature.outputFeedAbove,
            outputFeedBelow: plant.temperature.outputFeedBelow,
            aboveValue: plant.temperature.aboveValue,
            belowValue: plant.temperature.belowValue,
            id: plant.temperature.id,
            name: plant.temperature.name,
            key: plant.temperature.key,
        },
        humidity: {
            ceiling: plant.humidity.ceiling,
            floor: plant.humidity.floor,
            outputFeedAbove: plant.humidity.outputFeedAbove,
            outputFeedBelow: plant.humidity.outputFeedBelow,
            aboveValue: plant.humidity.aboveValue,
            belowValue: plant.humidity.belowValue,
            id: plant.humidity.id,
            name: plant.humidity.name,
            key: plant.humidity.key,
        },
        light: {
            ceiling: plant.light.ceiling,
            floor: plant.light.floor,
            outputFeedAbove: plant.light.outputFeedAbove,
            outputFeedBelow: plant.light.outputFeedBelow,
            aboveValue: plant.light.aboveValue,
            belowValue: plant.light.belowValue,
            id: plant.light.id,
            name: plant.light.name,
            key: plant.light.key,
        }
    }
    const [plantData, setPlantData] = React.useState({
        id: plant.id,
        name: plant.name,
        key: plant.key,
        fan: {
            id: plant.fan.id,
            name: plant.fan.name,
            key: plant.fan.key,
        },
        temperature: {
            ceiling: plant.temperature.ceiling,
            floor: plant.temperature.floor,
            outputFeedAbove: plant.temperature.outputFeedAbove,
            outputFeedBelow: plant.temperature.outputFeedBelow,
            aboveValue: plant.temperature.aboveValue,
            belowValue: plant.temperature.belowValue,
            id: plant.temperature.id,
            name: plant.temperature.name,
            key: plant.temperature.key,
        },
        humidity: {
            ceiling: plant.humidity.ceiling,
            floor: plant.humidity.floor,
            outputFeedAbove: plant.humidity.outputFeedAbove,
            outputFeedBelow: plant.humidity.outputFeedBelow,
            aboveValue: plant.humidity.aboveValue,
            belowValue: plant.humidity.belowValue,
            id: plant.humidity.id,
            name: plant.humidity.name,
            key: plant.humidity.key,
        },
        light: {
            ceiling: plant.light.ceiling,
            floor: plant.light.floor,
            outputFeedAbove: plant.light.outputFeedAbove,
            outputFeedBelow: plant.light.outputFeedBelow,
            aboveValue: plant.light.aboveValue,
            belowValue: plant.light.belowValue,
            id: plant.light.id,
            name: plant.light.name,
            key: plant.light.key,
        }
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

    const handleConfirmUpdatePlant = async (e) => {
        e.preventDefault()

        const isChanged = JSON.stringify(plantData) !== JSON.stringify(plantOrigin);
        if (!isChanged) {
            alert("Dữ liệu không thay đổi. Không cần cập nhật.");
            return;
        }

        setOpenConfirm(true)
    }
    

    const handleUpdatePlant = async (e) => {
        e.preventDefault()
        setLoading(true)
        const token = "..."
        //token tạm thời
        const isNameChanged = plantData.name !== plantOrigin.name;
        const isTempChanged = JSON.stringify(plantData.temperature) !== JSON.stringify(plantOrigin.temperature);
        const isHumidityChanged = JSON.stringify(plantData.humidity) !== JSON.stringify(plantOrigin.humidity);
        const isLightChanged = JSON.stringify(plantData.light) !== JSON.stringify(plantOrigin.light);
        try {
            if (isNameChanged) {
                const res = await ModifyGroup({
                    groupOriginName: plantOrigin.key,
                    groupChangeName: plantData.name,
                    token: token
                });
    
                // Cập nhật lại key của các feed sau khi đổi tên group
                const updateFeedKey = (feed) => {
                    const newGroupName = res.key;
                
                    const getNewKey = (oldKey) => {
                        if (!oldKey) return null;
                        const parts = oldKey.split(".");
                        return parts.length === 2 ? `${newGroupName}.${parts[1]}` : oldKey;
                    };

                    if (feed.name === "fan") {
                        return {
                            ...feed,
                            key: `${newGroupName}.${feed.name}`,
                        }
                    }
                
                    return {
                        ...feed,
                        key: `${newGroupName}.${feed.name}`,
                        outputFeedAbove: getNewKey(feed.outputFeedAbove),
                        outputFeedBelow: getNewKey(feed.outputFeedBelow),
                    };
                };
    
                plantData.fan = updateFeedKey(plantData.fan)
                plantData.temperature = updateFeedKey(plantData.temperature);
                plantData.humidity = updateFeedKey(plantData.humidity);
                plantData.light = updateFeedKey(plantData.light);
                console.log(plantData)

                await ModifyFeed({
                    groupName: res.key,
                    feedName: plantData.temperature.name,
                    feedKey: plantData.temperature.key,
                    token: token,
                })
                await ModifyFeed({
                    groupName: res.key,
                    feedName: plantData.humidity.name,
                    feedKey: plantData.humidity.key,
                    token: token,
                })
                await ModifyFeed({
                    groupName: res.key,
                    feedName: plantData.light.name,
                    feedKey: plantData.light.key,
                    token: token,
                })
                await ModifyFeed({
                    groupName: res.key,
                    feedName: plantData.fan.name,
                    feedKey: plantData.fan.key,
                    token: token,
                })
                
                
                const updateRule = async (type) => {
                    const newFeed = plantData[type];
                    const originFeed = plantOrigin[type]
                    await ModifyRule({
                        inputOriginFeed: originFeed.key,
                        inputChangeFeed: newFeed.key,
                        ceiling: newFeed.ceiling,
                        floor: newFeed.floor,
                        outputFeedAbove: newFeed.outputFeedAbove,
                        outputFeedBelow: newFeed.outputFeedBelow,
                        aboveValue: newFeed.aboveValue,
                        belowValue: newFeed.belowValue,
                        token: token
                    });
                };
        
                await updateRule("temperature");
                await updateRule("humidity");
                await updateRule("light");
            }
            else {
                const updateFeed = async (type) => {
                    const feed = plantData[type];
        
                    await ModifyRule({
                        inputOriginFeed: plantOrigin[type].key,
                        inputChangeFeed: feed.key,
                        ceiling: feed.ceiling,
                        floor: feed.floor,
                        outputFeedAbove: feed.outputFeedAbove,
                        outputFeedBelow: feed.outputFeedBelow,
                        aboveValue: feed.aboveValue,
                        belowValue: feed.belowValue,
                        token: token
                    });
                };
        
                if (isTempChanged) await updateFeed("temperature");
                if (isHumidityChanged) await updateFeed("humidity");
                if (isLightChanged) await updateFeed("light");
            }

            
    
            alert("Cập nhật thành công!");
            navigate("/plants");
            } catch (error) {
                console.error("Update failed:", error);
                alert("Cập nhật thất bại");
            } finally {
                setLoading(false);
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
                                    <MenuItem value={`${plantData.key}.temp`}>Cảm biến nhiệt độ</MenuItem>
                                    <MenuItem value={`${plantData.key}.pump`}>Cảm biến độ ẩm đất</MenuItem>
                                    <MenuItem value={`${plantData.key}.light`}>Cảm biến ánh sáng</MenuItem>
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
                                    <MenuItem value={`${plantData.key}.temp`}>Cảm biến nhiệt độ</MenuItem>
                                    <MenuItem value={`${plantData.key}.pump`}>Cảm biến độ ẩm đất</MenuItem>
                                    <MenuItem value={`${plantData.key}.light`}>Cảm biến ánh sáng</MenuItem>
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
                                    <MenuItem value={`${plantData.key}.temp`}>Cảm biến nhiệt độ</MenuItem>
                                    <MenuItem value={`${plantData.key}.pump`}>Cảm biến độ ẩm đất</MenuItem>
                                    <MenuItem value={`${plantData.key}.light`}>Cảm biến ánh sáng</MenuItem>
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
                                    <MenuItem value={`${plantData.key}.temp`}>Cảm biến nhiệt độ</MenuItem>
                                    <MenuItem value={`${plantData.key}.pump`}>Cảm biến độ ẩm đất</MenuItem>
                                    <MenuItem value={`${plantData.key}.light`}>Cảm biến ánh sáng</MenuItem>
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
                                    <MenuItem value={`${plantData.key}.temp`}>Cảm biến nhiệt độ</MenuItem>
                                    <MenuItem value={`${plantData.key}.pump`}>Cảm biến độ ẩm đất</MenuItem>
                                    <MenuItem value={`${plantData.key}.light`}>Cảm biến ánh sáng</MenuItem>
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
                                    <MenuItem value={`${plantData.key}.temp`}>Cảm biến nhiệt độ</MenuItem>
                                    <MenuItem value={`${plantData.key}.pump`}>Cảm biến độ ẩm đất</MenuItem>
                                    <MenuItem value={`${plantData.key}.light`}>Cảm biến ánh sáng</MenuItem>
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
                    style = {{padding: "0.5rem 0", marginRight: "1rem", textTransform: "none", width: "10rem", background: "#D9CB08"}} 
                    fullWidth onClick={handleConfirmUpdatePlant}
                >
                    <Save style = {{marginRight: "0.6rem",}}/> Cập nhật
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
                        Bạn có chắc chắn muốn cập nhật thông tin <strong>{plantData.name}</strong> không?
                    </DialogContentText>
                    </DialogContent>
                    <DialogActions>
                    <Button onClick={() => setOpenConfirm(false)} color="inherit">Hủy</Button>
                    <Button onClick={handleUpdatePlant} color="primary">Đồng ý</Button>
                    </DialogActions>
                </Dialog>
            )}

            
        </div>
    );
}

export default UpdatePlant;



