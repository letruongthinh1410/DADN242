import axios from "axios";
import api from '../pages/api';
//-----------Login-------------------
export const Login = async ({ loginEmail, password }) => {
    const res = await api.post("/auth/login", {
      email: loginEmail,
      password: password,
    }, {
      headers: { "Content-Type": "application/json" },
      withCredentials: true,
    });
    return res.data;
  };
  
  export const Register = async ({ registerEmail, username, apiKey, password }) => {
    const res = await api.post("/auth/register", {
      email: registerEmail,
      username: username,
      apiKey: apiKey,
      password: password,
    }, {
      headers: { "Content-Type": "application/json" },
      withCredentials: true,
    });
    return res.data;
  };
  
  export const Subscribe = async () => {
    const res = await api.post("/api/mqtt/subscribe", {}, {
      headers: { "Content-Type": "application/json" },
    });
    return res.data;
  };

//-----------------Plants------------------
//----Create Group (CreateTree)
export const CreateGroup = async ({ groupName }) => {
    const res = await api.post("/user/groups", {
      name: groupName,
      description: `Day la group ve ${groupName}`,
    }, {
      headers: { "Content-Type": "application/json" },
    });
    return res.data.data;
  };
  
  export const CreateFeeds = async ({ groupName, feedName, feedFloor, feedCeiling }) => {
    const res = await api.post(`/user/groups/${groupName.key}/feeds`, {
      name: feedName,
      floor: feedFloor,
      ceiling: feedCeiling,
      description: `Day la ${feedName} cua ${groupName.name}`,
    }, {
      headers: { "Content-Type": "application/json" },
    });
    return res.data;
  };
  
  export const CreateRule = async ({ inputFeed, ceiling, floor, outputFeedAbove, outputFeedBelow, aboveValue, belowValue }) => {
    const res = await api.post("/user/rule", {
      inputFeed,
      ceiling,
      floor,
      outputFeedAbove,
      outputFeedBelow,
      aboveValue,
      belowValue,
    }, {
      headers: { "Content-Type": "application/json" },
    });
    return res.data;
  };
  
//---------GetGroup (GetPlantList)------------------
export const GetGroup = async () => {
    const res = await api.get("/user/groups", {
      headers: { "Content-Type": "application/json" },
    });
    return res.data.data;
  };
  
  export const GetRule = async ({ feedName }) => {
    const res = await api.get(`/user/rule`, {
      params: { feed: feedName },
      headers: { "Content-Type": "application/json" },
    });
    return res.data;
  };

//---------ModifyGroup------------------
export const ModifyGroup = async ({ groupOriginName, groupChangeName }) => {
    const res = await api.put(`/user/groups/${groupOriginName}`, {
      name: groupChangeName,
      key: groupChangeName.toLowerCase(),
      description: `Day la group ve ${groupChangeName}`,
    }, {
      headers: { "Content-Type": "application/json" },
    });
    return res.data.data;
  };
  
  export const ModifyFeed = async ({ groupName, feedName, feedKey }) => {
    const res = await api.put(`/user/groups/${groupName}/feeds/${feedKey}`, {
      name: feedName,
      key: feedName,
      description: `Day la ${feedName} ve ${groupName}`,
    }, {
      headers: { "Content-Type": "application/json" },
    });
    return res.data.data;
  };
  
  export const ModifyRule = async ({ inputOriginFeed, inputChangeFeed, ceiling, floor, outputFeedAbove, outputFeedBelow, aboveValue, belowValue }) => {
    const res = await api.put(`/user/rule`, {
      inputFeed: inputChangeFeed,
      ceiling,
      floor,
      outputFeedAbove,
      outputFeedBelow,
      aboveValue,
      belowValue,
    }, {
      params: { feed: inputOriginFeed },
      headers: { "Content-Type": "application/json" },
    });
    return res.data;
  };


//---------DeleteGroup------------------
export const DeleteGroup = async ({ groupName }) => {
    const res = await api.delete(`/user/groups/${groupName}`, {
      headers: { "Content-Type": "application/json" },
    });
    return res.data;
  };
  
  export const DeleteFeed = async ({ groupName, feedName }) => {
    const res = await api.delete(`/user/groups/${groupName}/feeds/${feedName}`, {
      headers: { "Content-Type": "application/json" },
    });
    return res.data;
  };
  
  export const DeleteRule = async ({ feedName }) => {
    const res = await api.delete(`/user/rule`, {
      params: { feed: feedName },
      headers: { "Content-Type": "application/json" },
    });
    return res.data;
  };
  

//---------Parameter------------------
export const GetFeedData = async ({username, feedKey,apiKey}) => {
    const res = await axios.get(`https://io.adafruit.com/api/v2/${username}/feeds/${feedKey}/data`, {
        headers: {
            "X-AIO-Key": apiKey,
        },
    });
    return res.data;
}
