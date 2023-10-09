const query = window.location.search;
const queryParams = new URLSearchParams(query);
const number = queryParams.get("number");
let orderNumberElem = document.querySelector(".orderNumber");
orderNumberElem.textContent = number;
let nextPage = 0;
let keyword = "";
let listBarElem = document.querySelector(".listBarContainer")
let attractionElem = document.querySelector(".attractionsGroup")

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

function backToHome() {
    window.location.href = "/"
}

function logout(){
    window.localStorage.setItem("token","");
    // 連線目標網址 = 當前網址
    window.location.href = "/";
}

function goBooking(){
    window.location.href = "/booking";
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

getStatus();