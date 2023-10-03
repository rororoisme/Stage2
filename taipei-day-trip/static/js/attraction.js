let pictureElem = document.querySelector(".picture_current")
let profileElem = document.querySelector(".profile")

// 取得景點ID
const url = window.location.href; 
const arr = url.split("/");
const attractionId = arr[arr.length-1];

let attractionImages = [];
let currentImageIndex = 0;
let bookingTime = "";
let bookingPrice = 0;

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
    bookingTime = "morning"
    bookingPrice = 2000
    const price_field = document.querySelector('.price_fieldText');
    price_field.textContent = "新台幣 2000 元";
}

function check_pm() {
    bookingTime = "afternoon"
    bookingPrice = 2500
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

// Login
function closeLoginBox(){
    let loginContainer = document.querySelector(".loginContainer");
    let loginBox = document.querySelector(".loginBox")
    let grayBackGround = document.querySelector(".grayBackGround")
    loginContainer.style.display = "none";
    loginBox.style.display = "none";
    grayBackGround.style.display = "none";
}

function logout(){
    console.log("Call logout")
    window.localStorage.setItem("token","");
    // 連線目標網址 = 當前網址
    window.location.href = window.location.pathname;
}

function login(){
    let loginEmail = document.querySelector(".loginEmail").value
    let loginPassword = document.querySelector(".loginPassword").value
    let userData = {
        email: loginEmail,
        password: loginPassword
    };
    
    fetch(`/api/user/auth`,{
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
        },
        body:JSON.stringify(userData)
    }).then(function(response){
        return response.json();
    }).then(function(data){
        console.log("登入成功!")
        window.localStorage.setItem("token", data["token"]);
        // 連線目標網址 = 當前網址
        window.location.href = window.location.pathname ;
    })
}

function goLogin(){
    let loginContainer = document.querySelector(".loginContainer");
    let loginBox = document.querySelector(".loginBox");
    let signUpContainer = document.querySelector(".signUpContainer");
    let signUpBox = document.querySelector(".signUpBox")
    let grayBackGround = document.querySelector(".grayBackGround")
    loginContainer.style.display = "flex";
    loginBox.style.display = "flex";
    signUpContainer.style.display = "none";
    signUpBox.style.display = "none";
    grayBackGround.style.display = "flex";
}



// SignUp
function closeSignUpBox(){
    let signUpContainer = document.querySelector(".signUpContainer");
    let signUpBox = document.querySelector(".signUpBox")
    let grayBackGround = document.querySelector(".grayBackGround")
    signUpContainer.style.display = "none";
    signUpBox.style.display = "none";
    grayBackGround.style.display = "none";
}

let SignUpLoading = false;
function signUp(){
    let signUpName = document.querySelector(".signUpName").value.trim()
    let signUpEmail = document.querySelector(".signUpEmail").value.trim()
    let signUpPassword = document.querySelector(".signUpPassword").value.trim()

    if (signUpName == "" || signUpEmail == "" || signUpPassword == ""){      
        console.log("stop!")
        return
    }

    if (!SignUpLoading) {
        SignUpLoading  = true;
        let userData = {
            name: signUpName,
            email: signUpEmail,
            password: signUpPassword
        }
        fetch(`/api/user`,{
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(userData) 

        }).then(function(response) {
            return response.json();
        }).then(function(data){
            SignUpLoading = false;
            console.log(data)
            let signUpAlarm = document.querySelector(".signUpAlarm");
            if (data.ok == true) {
                signUpAlarm.innerHTML = "註冊成功！"
            } else if (data.error == true) {
                signUpAlarm.innerHTML = "該Email已被註冊，點此登入"
            }
        })
    }
}


function goSignUp(){
    console.log("Call goSignUp")
    let loginContainer = document.querySelector(".loginContainer");
    let loginBox = document.querySelector(".loginBox");
    let signUpContainer = document.querySelector(".signUpContainer");
    let signUpBox = document.querySelector(".signUpBox")
    let grayBackGround = document.querySelector(".grayBackGround")
    signUpContainer.style.display = "flex";
    signUpBox.style.display = "flex";
    loginContainer.style.display = "none";
    loginBox.style.display = "none";
    grayBackGround.style.display = "flex";
}



function getStatus(){
    let token = window.localStorage.getItem('token');

    console.log("call getStatus, token = " + token);

    // token丟進來確認一次內容, 以防token過期或是假token
    fetch(`/api/user/auth`,{
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "Authorization": "bearer " + token
        }
    }).then(function(response){
        return response.json();
    }).then(function(data){
        let userdata = data["data"]
        console.log(data)
        let loginElem = document.querySelector(".BtnRight");
        if (userdata) { 
            console.log("Has login")
            loginElem.textContent = "登出"
            loginElem.addEventListener('click', logout);
            loginElem.removeEventListener('click', goLogin);
        } else { 
            console.log("Not login yet")
            loginElem.textContent = "登入/註冊"
            loginElem.addEventListener('click', goLogin);
            loginElem.removeEventListener('click', logout);
        }
    })
}




function goBooking(){
    window.location.href = "/booking";
}


function bookingPost() {
    console.log("bookingPost is called");
    let token = window.localStorage.getItem("token");
    let url = window.location.href;
    let attractionIdSplit = url.split("/");
    let attractionIdValue = attractionIdSplit[attractionIdSplit.length -1]
    let date = document.querySelector(".date").value
    console.log(date);
    console.log(token);
    if (token == "" || token == undefined ) {
        goLogin();
        return;
    }


    if (date == "") {
        alert("請選擇預約日期");
        return;
    }

    const today = new Date();
    const targetDate = new Date(date);
    if (targetDate < today) {
        alert("請選擇往後日期");
        return;
    }

    if (bookingTime == "") {
        alert("請選擇預定時間");
        return;
    }

    let bookingData = {
        "attractionId": attractionIdValue,
        "date": date,
        "time": bookingTime,
        "price": bookingPrice
    };

    fetch(`/api/booking`,{
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": "bearer " + token
        },
        body:JSON.stringify(bookingData)
        
    }).then(function(response){
        if (response.status === 403) {
      
            goLogin();
            // 跳過其中幾筆then到最後的catch Error階段, return還是會跑
            throw new Error("未登入");
        } 
        
        return response.json();
    }).then(function(data){
        window.location.href = "/booking";
    }).catch(function(error) {
        console.log("儲存行程出問題");
        console.log(error);
    });
}

getStatus();