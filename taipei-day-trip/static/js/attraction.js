let pictureElem = document.querySelector(".picture_current")
let profileElem = document.querySelector(".profile")

// 取得資料ID
const url = window.location.href; 
const arr = url.split("/");
const attractionId = arr[arr.length-1];
// 展示景點資訊
fetch(`/api/attraction/${attractionId}`, {
    method: "GET",
    headers: {
        "Content-Type": "application/json",
    },
})
.then(function(response) {
    return response.json();
}).then(function(data){
    init(data);
    setEventListener(data)
    // 獲取所需的資料內容
    let originalData = data["data"];
    let attractionImages = data["images"];
    let attractionName = originalData["name"];
    let attractionCategory = originalData["category"];
    let attractionMrt = originalData["mrt"];
    let attractionDescription = originalData["description"];
    let attractionAddress = originalData["address"];
    let attractionTransport = originalData["transport"];

    // 根據CSS選取html元素
    let pictureElem = document.querySelector(".picture_current");
    let containerElem = document.querySelector(".profile")
    let descriptionElem = document.querySelector(".infors_text");
    let addressElem = document.querySelector(".addressText");
    let transportElem = document.querySelector(".trafficText");

    // 將獲得的變數放到前端切好的區塊
    pictureElem.src = attractionImages[0];


    const section = document.querySelector('.')



    // 1. 把資料塞好

    // 2. 做監聽事件
  
})




// // 照片輪播
// fetch(`/api/attraction/${attractionId}`, {
//     method: "GET",
//     headers: {
//         "Content-Type": "application/json",
//     },
// })
// .then(function(response) {
//     return response.json();
// }).then(function(data){
//     console.log(data)
//     // 1.塞第一張圖
//     // 2.for迴圈，幾張圖就塞幾個點

//     let imageUrlArr = [XXXXXXXX, XXXXXXX, XXXXXXX]
//     for (imageUrlArr) {
//         let imageUrl = imageUrlArr[i]
//         function aaaa() {
//             changeImage(imageUrl);
//         }
//         let circle = createElem...
//         circle.evnetListener('click', aaaa);


//         xxx.addChild(circle);
//     }

// })
fetch(`/api/attraction/${attractionId}`, {
    method: "GET",
    headers: {
        "Content-Type": "application/json",
    },
})
.then(function(response) {
    return response.json();
}).then(function(data){
    // 獲取所需的資料內容
    let originalData = data["data"];
    let attractionImages = originalData["images"];
    let imagesCount = images.length ????
    

    })

function changeImage(url) {
    let image = querySelector(".image")
    image.src = url 
}




// 時段收費
// 點上半天-> 費用內容置換-> 自己變綠色-> 另一個選項變白色
function check_right() {
    const price_field = document.querySelector('.price_field');
    price_field.textContent = "導覽費用：2000";
    money = 2000;

    const check_right = document.querySelector('.check_right');
    check_right.style.backgroundColor = 'green';
 
    const check_left = document.querySelector('.check_left');
    check_left.style.backgroundColor = 'white';
    
}

function check_left() {
    const price_field = document.querySelector('.price_field');
    price_field.textContent = "導覽費用：2500";

    const check_right = document.querySelector('.check_right');
    check_right.style.backgroundColor = 'white';

    const check_left = document.querySelector('.check_left');
    check_left.style.backgroundColor = 'green';
    
}



