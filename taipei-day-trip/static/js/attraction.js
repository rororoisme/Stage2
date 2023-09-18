let pictureElem = document.querySelector(".picture_current")
let profileElem = document.querySelector(".profile")

// 取得景點ID
const url = window.location.href; 
const arr = url.split("/");
const attractionId = arr[arr.length-1];

let attractionImages = [];
let currentImageIndex = 0;

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
    console.log(data)
    // 獲取所需的資料內容
    let originalData = data["data"];
    attractionImages = originalData["images"];
    let attractionName = originalData["name"];
    let attractionCategory = originalData["category"];
    let attractionMrt = originalData["mrt"];
    let attractionDescription = originalData["description"];
    let attractionAddress = originalData["address"];
    let attractionTransport = originalData["transport"];

    // 根據class名稱瞄準資料位置
    let pictureElem = document.querySelector(".picture");
    let containerElem = document.querySelector(".profile")
    let descriptionElem = document.querySelector(".infors_text");
    let addressElem = document.querySelector(".addressText");
    let transportElem = document.querySelector(".trafficText");
    let profileH2Elem = document.querySelector(".profileH2")
    let profilePElem = document.querySelector(".profileP")

    // 將獲得的變數放到前端切好的區塊
    // html元素 = 資料內容
    pictureElem.src = attractionImages[0]
    profileH2Elem.textContent = attractionName
    profilePElem.textContent = attractionCategory + " at " + attractionMrt
    descriptionElem.textContent = attractionDescription
    addressElem.textContent = attractionAddress
    transportElem.textContent = attractionTransport
    addCircle(attractionImages.length);
})


// 時段收費
function check_am() {
    const price_field = document.querySelector('.price_fieldText');
    price_field.textContent = "新台幣 2000 元";
}

function check_pm() {
    const price_field = document.querySelector('.price_fieldText');
    price_field.textContent = "新台幣 2500 元";
}

// 圖片往左播放
function previousPicture() {
    if (currentImageIndex != 0 ) {
        currentImageIndex = currentImageIndex - 1;
    } else {
        currentImageIndex = attractionImages.length - 1;
    }

    let url = attractionImages[currentImageIndex];
    let pictureElem = document.querySelector(".picture");
    pictureElem.src = url;
    changeCircleColor(currentImageIndex);
}

// 圖片往右播放
function nextPicture() {
// index 0~, length 1~
    if (currentImageIndex  < attractionImages.length -1) {
        currentImageIndex = currentImageIndex +1;
    } else {
        currentImageIndex = 0;
    }

    let url = attractionImages[currentImageIndex];
    let pictureElem = document.querySelector(".picture");
    pictureElem.src = url;
    changeCircleColor(currentImageIndex);
}

// 置換圓點的顏色, index=總張數, i=目前張數
function changeCircleColor(index) {
    let circleArr = document.querySelectorAll(".circle");
    for (let i = 0; i < circleArr.length; i++) {
        if (i == index) {
            circleArr[i].src = "/static/images/blackBtn.png";
        } else {
            circleArr[i].src = "/static/images/circleBtn.png";
        }
    }
}


// 產生照片個數的圓點
function addCircle(length){
    let circleGroupElem = document.querySelector(".circleGroup")
    for (let i=0; i < length; i++){
        //注意與左右箭頭換圖片時,照片順序不同步的問題
        let circle = document.createElement('img');
        circle.classList.add('circle');
        circle.src = "/static/images/circleBtn.png";
        if(i==0){
            circle.classList.add("check");
            circle.src = "/static/images/blackBtn.png";
        }
        circle.addEventListener("click", () => {
            let pictureElem = document.querySelector(".picture");
            pictureElem.src = attractionImages[i];
            currentImageIndex = i;
            
            changeCircleColor(i);
        });
        circleGroupElem.appendChild(circle);  
    }
}

// title導回首頁
function backToHome() {
    window.location.href = "/"
}
