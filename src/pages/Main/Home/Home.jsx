import React, { useEffect } from "react";
import { useState } from "react";
import { Grid, Pagination } from "@mui/material";

import { Card, CardContent, Typography, Button, Alert, Box, Tooltip, Dialog, DialogActions, DialogContent, DialogTitle, Skeleton} from "@mui/material";

import { TreeDeciduous, Thermometer, List, Info, Hammer, CirclePlus, Dot, CircleX, Droplets, Sun  } from 'lucide-react';

import { NavLink } from "react-router-dom";
import { GetGroup, GetRule, DeleteGroup, DeleteFeed, DeleteRule, CreateRule, CreateFeeds, CreateGroup, GetFeedData } from "../../../api";

import { useWebSocket } from "../../WebSocketProvider";
import api from "../../../pages/api.jsx";

import { LoadingButton } from '@mui/lab';

 // token của bạn

const PlantCard = ({ plant, loading }) => {

    const [openDialog, setOpenDialog] = useState(false);
    
    const originalPlant = { ...plant }

    const [isDeleting, setIsDeleting] = useState(false);

    
    const deleted = {
        rules: [],
        feeds: [],
        groupDeleted: false,
    }


    const handleDeletePlant = async (e) => {
        e.preventDefault();
        setIsDeleting(true);
        try {
            // Xoá Rule (nếu tồn tại key)
            for (const feed of [plant.temperature, plant.humidity, plant.light]) {
                if (feed?.key) {
                    try {
                        await DeleteRule({
                            feedName: feed.key,
                            // token: token,
                        });
                        deleted.rules.push(feed.key);
                    } catch (error) {
                        console.warn(`Không xoá được rule của feed ${feed.key}`, error);
                    }
                }
            }
    
            // Xoá Feed (nếu tồn tại key)
            for (const feed of [plant.pump, plant.fan, plant.temperature, plant.humidity, plant.light]) {
                if (feed?.key) {
                    try {
                        await DeleteFeed({
                            groupName: plant.key,
                            feedName: feed.key,
                            // token: token,
                        });
                        deleted.feeds.push(feed.key);
                    } catch (error) {
                        console.warn(`Không xoá được feed ${feed.key}`, error);
                    }
                }
            }
    
            // Xoá Group (nếu có key)
            try {
                await DeleteGroup({
                    groupName: plant.key,
                    // token: token,
                });
                deleted.group = true;
            } catch (error) {
                console.warn(`Không xoá được group ${plant.name}`, error);
            }
    
            if (deleted.group) {
                alert(`Xoá cây trồng ${plant.name} thành công!`);
                window.location.reload();
            } else {
                alert(`Xoá cây trồng ${plant.name} thất bại`);
            }
    
        } catch (error) {
            if (error) {
                const findFeedDataByFeedKey = (plant, feedKey) => {
                    if (feedKey === plant.fan.key) {
                        return {
                            groupName: plant.key,
                            feedName: plant.fan.key,
                            feedFloor: 0,
                            feedCeiling: 1,
                            // token
                        };
                    }
    
                    if (feedKey === plant.pump.key) {
                        return {
                            groupName: plant.key,
                            feedName: plant.pump.key,
                            feedFloor: 0,
                            feedCeiling: 1,
                            // token
                        };
                    }
    
                    for (const type of ['temperature', 'humidity', 'light']) {
                        if (plant[type]?.key === feedKey) {
                            return {
                                groupName: plant.key,
                                feedName: feedKey,
                                feedFloor: plant[type].floor,
                                feedCeiling: plant[type].ceiling,
                                // token
                            };
                        }
                    }
                };
    
                const findRuleDataByRuleKey = (plant, ruleKey) => {
                    for (const type of ['temperature', 'humidity', 'light']) {
                        if (plant[type]?.key === ruleKey) {
                            return {
                                inputFeed: plant[type].key,
                                ceiling: plant[type].ceiling,
                                floor: plant[type].floor,
                                outputFeedAbove: plant[type].outputFeedAbove,
                                outputFeedBelow: plant[type].outputFeedBelow,
                                aboveValue: plant[type].aboveValue,
                                belowValue: plant[type].belowValue,
                                // token: token,
                            };
                        }
                    }
                };
    
                for (const key of deleted.rules) {
                    const ruleData = findRuleDataByRuleKey(originalPlant, key);
                    await CreateRule(ruleData);
                }
    
                for (const key of deleted.feeds) {
                    const feedData = findFeedDataByFeedKey(originalPlant, key);
                    await CreateFeeds(feedData);
                }
    
                if (deleted.groupDeleted) {
                    await CreateGroup({ groupName: originalPlant.key });
                }
            }
    
            console.log("Failed to delete a plant", error);
            alert(`Xoá cây trồng ${plant.name} thất bại`);
        } finally {
            setIsDeleting(false);
            setOpenDialog(false);
        }
    };
    

    const deviceList = `${plant.fan ? `Quạt làm mát (${plant.fan.key}), ` : ""}
    ${plant.pump ? `Máy bơm (${plant.pump.key}), `: ""}`

    const tempValue = plant.temperature?.values[0];
    const humidityValue = plant.humidity?.values[0];
    const lightValue = plant.light?.values[0];

    const notifyTemp = tempValue != null && plant.temperature?.floor != null && plant.temperature?.ceiling != null 
            ? (tempValue < plant.temperature.floor
                ? "Nhiệt độ thấp"
                : tempValue > plant.temperature.ceiling
                ? "Nhiệt độ cao"
                : "Bình thường")
            : "Không có dữ liệu về nhiệt độ";

    const notifyHumidity = humidityValue != null && plant.humidity?.floor != null && plant.humidity?.ceiling != null
            ? (humidityValue < plant.humidity.floor
                ? "Độ ẩm đất thấp"
                : humidityValue > plant.humidity.ceiling
                ? "Độ ẩm đất cao"
                : "Bình thường")
            : "Không có dữ liệu về độ ẩm đất"

    const notifyLight = lightValue != null && plant.light?.floor != null && plant.light?.ceiling != null
            ? (lightValue < plant.light.floor
                ? "Ánh sáng thấp"
                : lightValue > plant.light.ceiling
                ? "Ánh sáng cao"
                : "Bình thường")
            : "Không có dữ liệu về ánh sáng"

    
    const notify = [notifyTemp, notifyHumidity, notifyLight].every(n => n.includes("Không có dữ liệu"))
        ? "Không có dữ liệu"
        : [notifyTemp, notifyHumidity, notifyLight].filter(n => n !== "Bình thường").join(", ") || "Bình thường";
    return (
            <Card 
            sx={{ 
                width: 500, height: 380, borderRadius: "15px",
                boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
                transition: "all 0.3s ease-in-out",
                "&:hover": {
                    boxShadow: "0px 6px 15px rgba(0, 0, 0, 0.2)"
                },
                padding: "1rem",
            }}  
            className="d-flex flex-column align-items-center justify-content-center"
        >
                <CardContent>
                {/* Tên cây */}
                <Typography variant="h6" fontWeight="bold" style={{fontSize: "1.2rem"}} className="d-flex align-items-center justify-content-center">
                    <Dot size={28} color= {notify !== "Bình thường" ? "#D90808" : "#0CD908"}/> {plant.id}
                </Typography>

                {/* Loại cây */}
                <Typography variant="body2" gutterBottom style={{fontSize: "1.1rem"}}>
                    <TreeDeciduous color="#48752C" style = {{marginRight: "1rem", }}/> {plant.name}
                </Typography>

                {/* Thông tin môi trường */}
                <NavLink to={`/parameter`} state={{ plant }} style={{textDecoration: "none", color: "black"}}>
                    <Typography variant="body2" fontWeight="bold" mt={1} style={{fontSize: "1.1rem"}}>
                        Thông số cây trồng (phù hợp):
                    </Typography>
                    <Typography variant="body2" mt={1} style={{fontSize: "1.1rem"}}>
                        <Thermometer style = {{marginRight: "1rem", color: "#2C98A0"}}/> 
                        <span style={{fontWeight: "bold", marginRight: "0.3rem", color: "#2C98A0"}}>Nhiệt độ:</span> {plant?.temperature?.floor || plant?.temperature?.ceiling  ? (`${plant?.temperature?.floor}°C - ${plant?.temperature?.ceiling}°C`) : ("Không có rule")}
                    </Typography>
                    <Typography variant="body2" mt={1} style={{fontSize: "1.1rem"}}>
                        <Droplets style = {{marginRight: "1rem", color: "#334EAC"}}/> 
                        <span style={{fontWeight: "bold", marginRight: "0.3rem", color: "#334EAC"}}>Độ ẩm đất:</span> {plant?.humidity?.floor || plant?.humidity?.ceiling? (`${plant?.humidity?.floor}% - ${plant?.humidity?.ceiling}%`) : ("Không có rule")}
                    </Typography>
                    <Typography variant="body2" mt={1} style={{fontSize: "1.1rem"}}>
                        <Sun style = {{marginRight: "1rem", color: "#ECA611"}}/> 
                        <span style={{fontWeight: "bold", marginRight: "0.3rem", color: "#ECA611"}}>Ánh sáng:</span> {plant?.light?.floor || plant?.light?.ceiling ? (`${plant?.light?.floor}% - ${plant?.light?.ceiling}%`) : ("Không có rule")}
                    </Typography>
                </NavLink>
                
                <Typography variant="body2"  mt={1} style={{fontSize: "1.1rem"}} >
                    <List size={20} style = {{marginRight: "1rem",}}/> Các thiết bị theo dõi
                    <Tooltip title={deviceList} arrow>
                    <span> {/* Bọc lại để Tooltip hoạt động tốt hơn */}
                        <Info style={{ marginLeft: "1rem", cursor: "pointer" }} />
                    </span>
                    </Tooltip>
                </Typography>
                <Typography variant="body2" color={notify === "Bình thường" ? "success" : "error"} mt={1}>
                    <Alert severity={notify === "Bình thường" ? "success" : "error"} style = {{padding: "0 1rem", width: "20rem", maxHeight: "3rem"}}>{notify}</Alert>
                </Typography>

                {/* Nút sửa thông tin */}
                <Box style={{display: "flex", justifyContent: "end", textDecoration: "none"}}>
                    <Button
                        variant="contained"
                        fullWidth
                        onClick={() => setOpenDialog(true)}
                        sx={{ backgroundColor: "#FF2400", mt: 1.3, borderRadius: "10px", textTransform: "none", width: "fit-content", padding: "0.3rem 1rem", marginRight: "1rem", fontSize: "1.1rem"}}
                    >
                        <CircleX style={{marginRight: "0.3rem"}}/> Xoá cây trồng
                    </Button>
                    {plant && (
                        <NavLink to={`update`} state={{ plant }} style={{display: "flex", justifyContent: "end", textDecoration: "none"}}>
                            <Button
                                variant="contained"
                                fullWidth
                                sx={{ backgroundColor: "#26A69A", mt: 1.3, borderRadius: "10px", textTransform: "none", width: "fit-content", padding: "0.3rem 1rem", fontSize: "1.1rem"}}
                            >
                                <Hammer style={{marginRight: "0.3rem"}}/> Sửa thông tin
                            </Button>
                        </NavLink>
                    )}
                </Box>
                
            </CardContent>
            
            <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
                <DialogTitle>Xác nhận xoá</DialogTitle>
                <DialogContent>
                Bạn có chắc chắn muốn xoá cây trồng <strong>{plant.name}</strong> không?
                </DialogContent>
                <DialogActions>
                <Button onClick={() => setOpenDialog(false)} color="primary">
                    Huỷ
                </Button>
                <LoadingButton
                    onClick={handleDeletePlant}
                    color="error"
                    loading={isDeleting}
                >
                    Xoá
                </LoadingButton>
                </DialogActions>
            </Dialog>  
            </Card>
                
        )
    };

const PlantList = ({ plants, loading}) => {
    const [page, setPage] = useState(1);
    const plantsPerPage = 2;

    // Tính toán số trang
    const totalPages = Math.ceil(plants.length / plantsPerPage);

    // Lọc danh sách cây cho trang hiện tại
    const currentPlants = plants.slice((page - 1) * plantsPerPage, page * plantsPerPage);

    return (
        <Box sx={{minHeight: "80vh"}} className="d-flex flex-column align-items-around justify-content-center">
            {/* Grid hiển thị danh sách cây */}
            <Grid
                container 
                spacing={3} 
                justifyContent="center"
                 // Để danh sách mở rộng khi cần
                style={{minHeight: "50vh"}}
                            >
                                {loading < 1 ? (
                                    Array.from({ length: 2 }).map((_, index) => (
                                        <Grid item key={index}>
                                            <Card sx={{ width: 500, height: 380 }}>
                                                <Skeleton
                                                    variant="rectangular"
                                                    sx={{
                                                        bgcolor: "grey.50",
                                                        width: 500,
                                                        height: 380,
                                                }}
                                                />
                                            </Card>
                                        </Grid>
                                    ))
                                    ) : plants.length > 0 ? (
                                    currentPlants.map((plant, index) => {
                                        return (
                                        <Grid item key={index}>
                                            <PlantCard plant={plant} />
                                        </Grid>
                                        );
                                    })
                                    ) : (
                                    <Grid item xs={12} className="d-flex align-items-center justify-content-center">
                                        <Typography variant="h6" color="text.secondary" textAlign="center">
                                           Chưa có cây trồng nào hết...
                                        </Typography>
                                    </Grid>
                                    )}

                            </Grid>

                            {/* Pagination luôn ở dưới */}
            <Box sx={{ display: "flex", justifyContent: "space-around", alignItems: "center", mt: 3 }}>
                <NavLink to="add" style={{textDecoration: "none"}}>
                        <Button
                            variant="contained"
                            fullWidth
                            sx={{ backgroundColor: "#0ba6ff", borderRadius: "10px", textTransform: "none", width: "fit-content", padding: "0.2rem 0.8rem", fontWeight: 400, fontSize: "1rem"}}
                        >
                            <CirclePlus style = {{marginRight: "0.6rem"}}/> Thêm cây trồng
                        </Button>
                </NavLink>

                <Pagination
                    count={totalPages}
                    page={page}
                    onChange={(event, value) => setPage(value)}
                    color="primary"
                    variant="outlined" shape="rounded"
                    showFirstButton showLastButton
                />
                <p style={{margin: "0", fontWeight: 600, fontSize: "1.1rem"}}>Tổng số cây trồng: {plants.length}</p>
            </Box>
        </Box>
    );
};

const Home = () => {
    const { version, initWebSockets, checkConnect } = useWebSocket()
    const [plants, setPlants] = useState([])
    const [loading, setLoading] = useState(0)
    useEffect(() => {
        const fetchData = async () => {
            setLoading(loading)
            try {
                const groupResponse = await GetGroup();
                const filteredGroups = groupResponse.filter(group => group.key !== "default");
                // lấy dữ liệu của plant (bật websocket và lấy deviceData)
                
                const plantData = filteredGroups.length > 0 ? 
                await Promise.all( filteredGroups.map(async (group) => {
                    if (group.length < 5) return null;
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
                            if(!checkConnect(feed.key)) initWebSockets([feed.key]) //bật WebSocket lên cho feed này

                            const response = await api.get("/user/info");

                            const resData = await GetFeedData({
                                username: response.data.data.username, // username tạm
                                feedKey: feed.key,
                                apiKey: response.data.data.apikey,
                            });

                            if (feed.name === "fan") {
                                const values = Array.isArray(resData)
                                ? resData.map(item => Number(item.value))
                                : []; //fan chỉ chứa giá trị 0 và 1
                                plant.fan = {
                                    id: feed.id,
                                    name: feed.name,
                                    key: feed.key,
                                    status: resData != null && values[0] > 0,
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
                                    status: resData != null && values[0] > 0,
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
                                        // token,
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

            } catch (err) {
                console.error("❌ Error fetching groups:", err);
            } finally {
                setLoading(loading + 1)
            }
             };
            
            fetchData();
        }, [version, initWebSockets, checkConnect]);

    return (
        <div className="home">
            <PlantList plants={plants} loading={loading}/>
        </div>
    );
}

export default Home;