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

    const getFeedData = (feed) => {
        return {
            ceiling: feed.ceiling ?? "",
            floor: feed.floor ?? "",
            outputFeedAbove: feed.outputFeedAbove ?? "",
            outputFeedBelow: feed.outputFeedBelow ?? "",
            aboveValue: feed.aboveValue ?? "", 
            belowValue: feed.belowValue ?? "",
            id: feed.id,
            name: feed.name,
            key: feed.key
        } 
    };
    

    const plantOrigin = {
        id: plant.id,
        name: plant.name,
        key: plant.key,
        fan: {
            id: plant.fan.id,
            name: plant.fan.name,
            key: plant.fan.key,
        },
        pump: {
            id: plant.pump.id,
            name: plant.pump.name,
            key: plant.pump.key,
        },
        temperature: getFeedData(plant.temperature),
        humidity: getFeedData(plant.humidity),
        light: getFeedData(plant.light),

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
        pump: {
            id: plant.pump.id,
            name: plant.pump.name,
            key: plant.pump.key,
        },
        temperature: getFeedData(plant.temperature),
        humidity: getFeedData(plant.humidity),
        light: getFeedData(plant.light),
    });

    console.log(plantData)

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
        e.preventDefault();
        setLoading(true);
    
        const isNameChanged = plantData.name !== plantOrigin.name;
    
        const isFeedChanged = (current, original) => {
            return JSON.stringify(current) !== JSON.stringify(original);
        };
    
        const handleFeedUpdate = async (type) => {
            const current = plantData[type];
            const original = plantOrigin[type];
    
            if (!isFeedChanged(current, original)) {
                alert(`${type === "temperature" ? "Nhiệt độ" : type === "humidity" ? "Độ ẩm" : "Ánh sáng"} không có thay đổi gì.`);
                return;
            }

            await ModifyRule({
                inputOriginFeed: original.key,
                inputChangeFeed: current.key,
                ceiling: current.ceiling,
                floor: current.floor,
                outputFeedAbove: current.outputFeedAbove,
                outputFeedBelow: current.outputFeedBelow,
                aboveValue: current.aboveValue,
                belowValue: current.belowValue,
            });
            
        };
    
        try {
            if (isNameChanged) {
                const res = await ModifyGroup({
                    groupOriginName: plantOrigin.key,
                    groupChangeName: plantData.name,
                });
    
                const updateFeedKey = (feed) => {
                    const newGroupName = res.key;
                    const getNewKey = (oldKey) => {
                        if (!oldKey) return null;
                        const parts = oldKey.split(".");
                        return parts.length === 2 ? `${newGroupName}.${parts[1]}` : oldKey;
                    };
                    if (!feed) return null;
                    if (feed.name === "fan" || feed.name === "pump") {
                        return { ...feed, key: `${newGroupName}.${feed.name}` };
                    }
                    return {
                        ...feed,
                        key: `${newGroupName}.${feed.name}`,
                        outputFeedAbove: getNewKey(feed.outputFeedAbove),
                        outputFeedBelow: getNewKey(feed.outputFeedBelow),
                    };
                };
    
                plantData.key = res.key;
                plantData.temperature = updateFeedKey(plantData.temperature);
                plantData.humidity = updateFeedKey(plantData.humidity);
                plantData.light = updateFeedKey(plantData.light);
                plantData.fan = updateFeedKey(plantData.fan);
                plantData.pump = updateFeedKey(plantData.pump);
    
                const feedsToUpdate = ["temperature", "humidity", "light", "fan", "pump"];
                for (let type of feedsToUpdate) {
                    const feed = plantData[type];
                    if (feed) {
                        await ModifyFeed({
                            groupName: res.key,
                            feedName: feed.name,
                            feedKey: feed.key,
                        });
                    }
                }
            }
    
            await handleFeedUpdate("temperature");
            await handleFeedUpdate("humidity");
            await handleFeedUpdate("light");
    
            alert("Cập nhật thành công!");
            navigate("/plants");
    
        } catch (error) {
            console.error("Update failed:", error);
            alert("Cập nhật thất bại");
        } finally {
            setLoading(false);
            setOpenConfirm(false);
        }
    };
    
    const availableDevices = [
        { label: "Quạt làm mát", value: `${plantData.key}.fan` },
        { label: "Máy bơm", value: `${plantData.key}.pump` },
      ];
      
    // Thiết bị đã chọn ở phía trên (Nhiệt độ cao)
    const selectedAbove = plantData?.temperature?.outputFeedAbove;
    // Thiết bị đã chọn ở phía dưới (Nhiệt độ thấp)
    const selectedBelow = plantData?.temperature?.outputFeedBelow;
    
    // Các thiết bị còn lại cho mỗi phần
    const devicesForAbove = availableDevices.filter(device => device.value !== selectedBelow);
    const devicesForBelow = availableDevices.filter(device => device.value !== selectedAbove);
          

    const getUsedDevices = () => {
        const fields = [
            plantData?.humidity?.outputFeedAbove,
            plantData?.humidity?.outputFeedBelow,
            plantData?.light?.outputFeedAbove,
            plantData?.light?.outputFeedBelow,
            plantData?.temperature?.outputFeedAbove,
            plantData?.temperature?.outputFeedBelow,
        ];
        return fields.filter(Boolean); // Lọc bỏ undefined, null, ""
    };
    const getAvailableDevices = (currentValue) => {
        if (!plantData?.key) return [];
    
        const allDevices = [
            { label: "Quạt làm mát", value: `${plantData.key}.fan` },
            { label: "Máy bơm", value: `${plantData.key}.pump` },
        ];
        const usedDevices = getUsedDevices();
    
        // Nếu currentValue đang chọn thì phải giữ lại (không lọc mất)
        return allDevices.filter(device => !usedDevices.includes(device.value) || device.value === currentValue);
    };      
        
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
                                    value={plantData?.temperature?.ceiling}
                                    onChange={handleChange}
                                    placeholder="Tối đa"
                                    color="success"
                                    size="small"
                                    sx={{ width: "10rem" }}
                                />
                            </Box>
                            <Typography fontWeight="bold" style={{ marginBottom: "1rem" }}>
                                Nhiệt độ cao
                            </Typography>
                            <Box display="flex" gap={1} alignItems="center" sx={{ marginBottom: "1rem" }}>
                                <Typography fontWeight="bold" style={{ width: "9rem" }}>Chọn thiết bị:</Typography>
                                <TextField
                                    select
                                    variant="outlined"
                                    name="temperature.outputFeedAbove"
                                    value={plantData?.temperature?.outputFeedAbove}
                                    onChange={handleChange}
                                    color="success"
                                    size="small"
                                    sx={{ width: "10rem" }}
                                >
                                    {/* <MenuItem value="">Tuỳ chọn</MenuItem>
                                    <MenuItem value={`${plantData.key}.fan`}>Quạt làm mát</MenuItem>
                                    <MenuItem value={`${plantData.key}.pump`}>Máy bơm</MenuItem> */}
                                        {/* {devicesForAbove.length > 0 ? (
                                        <>
                                            <MenuItem value="">Tuỳ chọn</MenuItem>
                                            {devicesForAbove.map((device) => (
                                            <MenuItem key={device.value} value={device.value}>{device.label}</MenuItem>
                                            ))}
                                        </>
                                        ) : (
                                        <MenuItem value="">Không có thiết bị</MenuItem>
                                        )} */}
                                    <MenuItem value="">Tuỳ chọn</MenuItem>    
                                    {getAvailableDevices(plantData?.temperature?.outputFeedAbove).length > 0 ? (getAvailableDevices(plantData?.temperature?.outputFeedAbove).map(device => (
                                    <MenuItem key={device.value} value={device.value}>
                                        {device.label}
                                    </MenuItem>
                                    ))):(<MenuItem value="">Không có thiết bị</MenuItem>)}

                                </TextField>
                            </Box>
                            <Box display="flex" gap={1} alignItems="center" sx={{ marginBottom: "1rem" }}>
                                <Typography fontWeight="bold" style={{ width: "9rem" }}>On/off:</Typography>
                                <TextField
                                    select
                                    variant="outlined"
                                    name="temperature.aboveValue"
                                    value={plantData?.temperature?.aboveValue}
                                    onChange={handleChange}
                                    color="success"
                                    size="small"
                                    sx={{ width: "10rem" }}
                                >
                                    <MenuItem value="">Tuỳ chọn</MenuItem>
                                    <MenuItem value="1">Bật</MenuItem>
                                    <MenuItem value="0">Tắt</MenuItem>
                                </TextField>
                            </Box>
                            <Typography fontWeight="bold" style={{ marginBottom: "1rem" }}>
                                Nhiệt độ thấp
                            </Typography>
                            <Box display="flex" gap={1} alignItems="center" sx={{ marginBottom: "1rem" }}>
                                <Typography fontWeight="bold" style={{ width: "9rem" }}>Chọn thiết bị:</Typography>
                                <TextField
                                    select
                                    variant="outlined"
                                    name="temperature.outputFeedBelow"
                                    value={plantData?.temperature?.outputFeedBelow}
                                    onChange={handleChange}
                                    color="success"
                                    size="small"
                                    sx={{ width: "10rem" }}
                                >
                                    {/* <MenuItem value="">Tuỳ chọn</MenuItem>
                                    <MenuItem value={`${plantData.key}.fan`}>Quạt làm mát</MenuItem>
                                    <MenuItem value={`${plantData.key}.pump`}>Máy bơm</MenuItem> */}
                                    {/* {devicesForBelow.length > 0 ? (
                                        <>
                                            <MenuItem value="">Tuỳ chọn</MenuItem>
                                            {devicesForBelow.map((device) => (
                                            <MenuItem key={device.value} value={device.value}>{device.label}</MenuItem>
                                            ))}
                                        </>
                                        ) : (
                                        <MenuItem value="">Không có thiết bị</MenuItem>
                                        )} */}
                                    {getAvailableDevices(plantData?.temperature?.outputFeedBelow).length > 0 ? (getAvailableDevices(plantData?.temperature?.outputFeedBelow).map(device => (
                                    <MenuItem key={device.value} value={device.value}>
                                        {device.label}
                                    </MenuItem>
                                    ))):(<MenuItem value="">Không có thiết bị</MenuItem>)}


                                </TextField>
                            </Box>
                            <Box display="flex" gap={1} alignItems="center" sx={{ marginBottom: "1rem" }}>
                                <Typography fontWeight="bold" style={{ width: "9rem" }}>On/off:</Typography>
                                <TextField
                                    select
                                    variant="outlined"
                                    name="temperature.belowValue"
                                    value={plantData?.temperature?.belowValue}
                                    onChange={handleChange}
                                    color="success"
                                    size="small"
                                    sx={{ width: "10rem" }}
                                >
                                    <MenuItem value="">Tuỳ chọn</MenuItem>
                                    <MenuItem value="1">Bật</MenuItem>
                                    <MenuItem value="0">Tắt</MenuItem>
                                </TextField>
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
                                    value={plantData?.humidity?.floor}
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
                                    value={plantData?.humidity?.ceiling}
                                    onChange={handleChange}
                                    placeholder="Tối đa"
                                    color="success"
                                    size="small"
                                    sx={{ width: "10rem" }}
                                />
                            </Box>
                            <Typography fontWeight="bold" style={{ marginBottom: "1rem" }}>
                                Độ ẩm cao
                            </Typography>
                            <Box display="flex" gap={1} alignItems="center" sx={{ marginBottom: "1rem" }}>
                                <Typography fontWeight="bold" style={{ width: "9rem" }}>Chọn thiết bị:</Typography>
                                <TextField
                                    select
                                    variant="outlined"
                                    name="humidity.outputFeedAbove"
                                    value={plantData?.humidity?.outputFeedAbove}
                                    onChange={handleChange}
                                    color="success"
                                    size="small"
                                    sx={{ width: "10rem" }}
                                >
                                    <MenuItem value="">Tuỳ chọn</MenuItem>
                                    <MenuItem value={`${plantData.key}.fan`}>Quạt làm mát</MenuItem>
                                    <MenuItem value={`${plantData.key}.pump`}>Máy bơm</MenuItem>
                                </TextField>
                            </Box>
                            <Box display="flex" gap={1} alignItems="center" sx={{ marginBottom: "1rem" }}>
                                <Typography fontWeight="bold" style={{ width: "9rem" }}>On/off:</Typography>
                                <TextField
                                    select
                                    variant="outlined"
                                    name="humidity.aboveValue"
                                    value={plantData?.humidity?.aboveValue}
                                    onChange={handleChange}
                                    color="success"
                                    size="small"
                                    sx={{ width: "10rem" }}
                                >
                                    <MenuItem value="">Tuỳ chọn</MenuItem>
                                    <MenuItem value="1">Bật</MenuItem>
                                    <MenuItem value="0">Tắt</MenuItem>
                                </TextField>
                            </Box>
                            <Typography fontWeight="bold" style={{ marginBottom: "1rem" }}>
                                Độ ẩm thấp
                            </Typography>
                            <Box display="flex" gap={1} alignItems="center" sx={{ marginBottom: "1rem" }}>
                                <Typography fontWeight="bold" style={{ width: "9rem" }}>Chọn thiết bị:</Typography>
                                <TextField
                                    select
                                    variant="outlined"
                                    name="humidity.outputFeedBelow"
                                    value={plantData?.humidity?.outputFeedBelow}
                                    onChange={handleChange}
                                    color="success"
                                    size="small"
                                    sx={{ width: "10rem" }}
                                >
                                    <MenuItem value="">Tuỳ chọn</MenuItem>
                                    <MenuItem value={`${plantData.key}.fan`}>Quạt làm mát</MenuItem>
                                    <MenuItem value={`${plantData.key}.pump`}>Máy bơm</MenuItem>
                                </TextField>
                            </Box>
                            <Box display="flex" gap={1} alignItems="center" sx={{ marginBottom: "1rem" }}>
                                <Typography fontWeight="bold" style={{ width: "9rem" }}>On/off:</Typography>
                                <TextField
                                    select
                                    variant="outlined"
                                    name="humidity.belowValue"
                                    value={plantData?.humidity?.belowValue}
                                    onChange={handleChange}
                                    placeholder="Nhập giá trị"
                                    color="success"
                                    size="small"
                                    sx={{ width: "10rem" }}
                                >
                                    <MenuItem value="">Tuỳ chọn</MenuItem>
                                    <MenuItem value="1">Bật</MenuItem>
                                    <MenuItem value="0">Tắt</MenuItem>
                                </TextField>
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
                                    value={plantData?.light?.floor}
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
                                    value={plantData?.light?.ceiling}
                                    onChange={handleChange}
                                    placeholder="Tối đa"
                                    color="success"
                                    size="small"
                                    sx={{ width: "10rem" }}
                                />
                            </Box>
                            <Typography fontWeight="bold" style={{ marginBottom: "1rem" }}>
                                Ánh sáng cao
                            </Typography>
                            <Box display="flex" gap={1} alignItems="center" sx={{ marginBottom: "1rem" }}>
                                <Typography fontWeight="bold" style={{ width: "9rem" }}>Chọn thiết bị:</Typography>
                                <TextField
                                    select
                                    variant="outlined"
                                    name="light.outputFeedAbove"
                                    value={plantData?.light?.outputFeedAbove}
                                    onChange={handleChange}
                                    color="success"
                                    size="small"
                                    sx={{ width: "10rem" }}
                                >
                                    <MenuItem value="">Tuỳ chọn</MenuItem>
                                    <MenuItem value={`${plantData.key}.fan`}>Quạt làm mát</MenuItem>
                                    <MenuItem value={`${plantData.key}.pump`}>Máy bơm</MenuItem>
                                </TextField>
                            </Box>
                            <Box display="flex" gap={1} alignItems="center" sx={{ marginBottom: "1rem" }}>
                                <Typography fontWeight="bold" style={{ width: "9rem" }}>On/off:</Typography>
                                <TextField
                                    select
                                    variant="outlined"
                                    name="light.aboveValue"
                                    value={plantData?.light?.aboveValue}
                                    onChange={handleChange}
                                    color="success"
                                    size="small"
                                    sx={{ width: "10rem" }}
                                >
                                    <MenuItem value="">Tuỳ chọn</MenuItem>
                                    <MenuItem value="1">Bật</MenuItem>
                                    <MenuItem value="0">Tắt</MenuItem>
                                </TextField>
                            </Box>
                            <Typography fontWeight="bold" style={{ marginBottom: "1rem" }}>
                                Ánh sáng thấp
                            </Typography>
                            <Box display="flex" gap={1} alignItems="center" sx={{ marginBottom: "1rem" }}>
                                <Typography fontWeight="bold" style={{ width: "9rem" }}>Chọn thiết bị:</Typography>
                                <TextField
                                    select
                                    variant="outlined"
                                    name="light.outputFeedBelow"
                                    value={plantData?.light?.outputFeedBelow}
                                    onChange={handleChange}
                                    color="success"
                                    size="small"
                                    sx={{ width: "10rem" }}
                                >
                                    <MenuItem value="">Tuỳ chọn</MenuItem>
                                    <MenuItem value={`${plantData.key}.fan`}>Quạt làm mát</MenuItem>
                                    <MenuItem value={`${plantData.key}.pump`}>Máy bơm</MenuItem>
                                </TextField>
                            </Box>
                            <Box display="flex" gap={1} alignItems="center" sx={{ marginBottom: "1rem" }}>
                                <Typography fontWeight="bold" style={{ width: "9rem" }}>On/off:</Typography>
                                <TextField
                                    select
                                    variant="outlined"
                                    name="light.belowValue"
                                    value={plantData?.light?.belowValue}
                                    onChange={handleChange}
                                    color="success"
                                    size="small"
                                    sx={{ width: "10rem" }}
                                >
                                    <MenuItem value="">Tuỳ chọn</MenuItem>
                                    <MenuItem value="1">Bật</MenuItem>
                                    <MenuItem value="0">Tắt</MenuItem>
                                </TextField>
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



