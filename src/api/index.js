const plants = [
    {   
        id: "TMT001", 
        name: "Cà chua", 
        type: "Hoa quả", 
        temperature: [25, 27], 
        humidity: [50, 70], 
        light: [65, 70], 
        status: "Nhiệt độ cao", 
        sign: true, 
        devices:[  
            {id: "AS001", name: "Cảm biến ánh sáng", status: true}, 
            {id: "ND001", name: "Cảm biến nhiệt độ", status: true},
            {id: "DA001", name: "Cảm biến độ ẩm đất", status: false},
        ]
    },
    { 
        id: "RSF001", 
        name: "Hoa hồng", 
        type: "Hoa", 
        temperature: [25, 27], 
        humidity: [50, 70], 
        light: [65, 70], 
        status: "Độ ẩm đất thấp", 
        sign: true, 
        devices:[  
            {id: "AS001", name: "Cảm biến ánh sáng", status: true}, 
            {id: "ND001", name: "Cảm biến nhiệt độ", status: true},
            {id: "DA001", name: "Cảm biến độ ẩm đất", status: false},
        ]
    },
    { 
        id: "ORF001", 
        name: "Hoa ly", 
        type: "Hoa", 
        temperature: [25, 27], 
        humidity: [50, 70], 
        light: [65, 70], 
        status: "Bình thường", 
        sign: false, 
        devices:[  
            {id: "AS001", name: "Cảm biến ánh sáng", status: true}, 
            {id: "ND001", name: "Cảm biến nhiệt độ", status: true},
            {id: "DA001", name: "Cảm biến độ ẩm đất", status: false},
        ] 
    },
    { 
        id: "CBF001", 
        name: "Cây bắp cải", 
        type: "Rau", 
        temperature: [25, 27], 
        humidity: [50, 70], 
        light: [65, 70], 
        status: "Bình thường", 
        sign: false, 
        devices:[  
            {id: "AS001", name: "Cảm biến ánh sáng", status: true}, 
            {id: "ND001", name: "Cảm biến nhiệt độ", status: true},
            {id: "DA001", name: "Cảm biến độ ẩm đất", status: false},
        ]
    },
    { 
        id: "HLT001", 
        name: "Hoa lan", 
        type: "Hoa", 
        temperature: [25, 27], 
        humidity: [50, 70], 
        light: [65, 70], 
        status: "Bình thường", 
        sign: false, 
        devices:[  
            {id: "AS001", name: "Cảm biến ánh sáng", status: true}, 
            {id: "ND001", name: "Cảm biến nhiệt độ", status: true},
            {id: "DA001", name: "Cảm biến độ ẩm đất", status: false},
        ] 
    },
    { 
        id: "BMT001", 
        name: "Bí ngô", 
        type: "Hoa quả", 
        temperature: [25, 27], 
        humidity: [50, 70], 
        light: [65, 70], 
        status: "Nhiệt độ cao", 
        sign: true, 
        devices:[  
            {id: "AS001", name: "Cảm biến ánh sáng", status: true}, 
            {id: "ND001", name: "Cảm biến nhiệt độ", status: true},
            {id: "DA001", name: "Cảm biến độ ẩm đất", status: false},
        ] 
    },
    { 
        id: "LMT001", 
        name: "Lá lốt", 
        type: "Lá", 
        temperature: [25, 27], 
        humidity: [50, 70], 
        light: [65, 70], 
        status: "Bình thường", 
        sign: false, 
        devices:[  
            {id: "AS001", name: "Cảm biến ánh sáng", status: true}, 
            {id: "ND001", name: "Cảm biến nhiệt độ", status: true},
            {id: "DA001", name: "Cảm biến độ ẩm đất", status: false},
        ] 
    },
];

export const takePlantsList = () => {
    return plants;
}

