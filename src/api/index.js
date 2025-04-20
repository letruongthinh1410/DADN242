import axios from "axios";

//-----------Login-------------------
export const Login = async ({loginEmail, password}) => {
    const res = await axios.post("http://localhost:8080/v1/auth/login", {
        email: loginEmail,
        password: password,
      },
      {
        header: {"Content-Type": "application/json",},
        withCredentials: true,
      },)
    
    return res.data;
}

export const Register = async ({registerEmail, username, apiKey, password}) => {
    const res = await axios.post("http://localhost:8080/v1/auth/register", {
        email: registerEmail,
        username: username,
        apiKey: apiKey,
        password: password,
      });
    return res.data;
}

export const Subscribe = async ({token}) => {
    await axios.post("http://localhost:8080/v1/api/mqtt/subscribe", {}, {
        headers: { Authorization: `Bearer ${token}` }
    });
}

//-----------------Plants------------------
//----Create Group-------- (CreateTree)

export const CreateGroup = async ({groupName, token}) => {
    const res = await axios.post("http://localhost:8080/v1/user/groups", {
        name: groupName,
        description: `Day la group ve ${groupName}`,
    },
    {
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        },
        withCredentials: true,
    });
    return res.data.data;
}

export const CreateFeeds = async ({groupName, feedName, feedFloor, feedCeiling, token}) => {
    const res = await axios.post(`http://localhost:8080/v1/user/groups/${groupName.key}/feeds`, {
        name: feedName,
        floor: feedFloor,
        ceiling: feedCeiling,
        description: `Day la ${feedName} cua ${groupName.name}`,
    },
    {
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        },
        withCredentials: true,
    })
    return res.data
}

export const CreateRule = async ({inputFeed, ceiling, floor, outputFeedAbove, outputFeedBelow, aboveValue, belowValue, token}) => {
    const res = await axios.post(`http://localhost:8080/v1/user/rule`, {
        inputFeed: inputFeed,
        ceiling: ceiling,
        floor: floor,
        outputFeedAbove: outputFeedAbove,
        outputFeedBelow: outputFeedBelow,
        aboveValue: aboveValue,
        belowValue: belowValue,
    },
    {
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        },
        withCredentials: true,
    })
    return res.data
}
//---------GetGroup------------------ (GetPlantList)
export const GetGroup = async ({token}) => {
    const res = await axios.get("http://localhost:8080/v1/user/groups", {
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        },
        withCredentials: true,
    });
    return res.data.data
}

export const GetRule = async ({feedName, token}) => {
    const res = await axios.get(`http://localhost:8080/v1/user/rule?feed=${feedName}`, {
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        },
        withCredentials: true,
    })
    
    return res.data
}

//---------ModifyGroup------------------
export const ModifyGroup = async ({groupOriginName, groupChangeName, token}) => {
    const res = await axios.put(`http://localhost:8080/v1/user/groups/${groupOriginName}`, {
        name: groupChangeName,
        key: groupChangeName.toLowerCase(), 
        description: `Day la group ve ${groupChangeName}`
    },
    {
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        },
        withCredentials: true,
    })
    return res.data.data
}

export const ModifyFeed = async({groupName, feedName, feedKey, token}) => {
    const res = await axios.put(`http://localhost:8080/v1/user/groups/${groupName}/feeds/${feedKey}`, {
        name: feedName,
        key: feedName,
        description: `Day la ${feedName} ve ${groupName}`,
    },
    {
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        },
        withCredentials: true,
    })
    return res.data.data
}

export const ModifyRule = async ({inputOriginFeed, inputChangeFeed, ceiling, floor, outputFeedAbove, outputFeedBelow, aboveValue, belowValue, token}) => {
    const res = await axios.put(`http://localhost:8080/v1/user/rule?feed=${inputOriginFeed}`, {
        inputFeed: inputChangeFeed,
        ceiling: ceiling,
        floor: floor,
        outputFeedAbove: outputFeedAbove,
        outputFeedBelow: outputFeedBelow,
        aboveValue: aboveValue,
        belowValue: belowValue,
    }, {
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        },
        withCredentials: true,
    })
    return res.data
}


//---------DeleteGroup------------------ (DeleteTree)
export const DeleteGroup = async ({groupName, token}) => {
    const res = await axios.delete(`http://localhost:8080/v1/user/groups/${groupName}`, {
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        },
        withCredentials: true,
    })
    return res.data
}

export const DeleteFeed = async ({groupName, feedName, token}) => {
    const res = await axios.delete(`http://localhost:8080/v1/user/groups/${groupName}/feeds/${feedName}`, {
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        },
        withCredentials: true,
    })
    return res.data
}

export const DeleteRule = async ({feedName, token}) => {
    const res = await axios.delete(`http://localhost:8080/v1/user/rule?feed=${feedName}`, {
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        },
        withCredentials: true,
    })
    return res.data
}

//---------Parameter------------------
export const GetFeedData = async ({username, feedKey}) => {
    const res = await axios.get(`https://io.adafruit.com/api/v2/${username}/feeds/${feedKey}/data`, {
        headers: {
            "X-AIO-Key": "...",
        },
    });
    return res.data;
}
