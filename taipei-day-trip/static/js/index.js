let nextPage = 0;
let keyword = "";
let listBarElem = document.querySelector(".listBarContainer")
let attractionElem = document.querySelector(".attractionsGroup")


// 設定箭頭點擊會捲動橫軸
const listBarContainer = document.querySelector(".listBarContainer");
const leftArrow = document.querySelector(".leftArrow");
const rightArrow = document.querySelector(".rightArrow");
leftArrow.addEventListener("click", () => {
    listBarContainer.scrollBy(-100, 0);
});

rightArrow.addEventListener("click", () => {
    listBarContainer.scrollBy(100, 0);
});


// 串接景點API
fetch(`/api/mrts`, {
    method: "GET",
    headers: {
        "Content-Type": "application/json",
    },
})
.then(function(response) {
    return response.json();
}).then(function(data){
    let arr = data["data"]
    for(let i=0; i<arr.length; i++){
        let mrtElem = document.createElement('div');
        mrtElem.className = 'list_item';
        mrtElem.setAttribute('onclick', 'searchMrt(this)');
        mrtElem.textContent = arr[i];
        listBarElem.appendChild(mrtElem);
        };
    }
)

function searchMrt(elem) {
    document.querySelector(".searchInput").value = elem.textContent;
    searchKeywords();
}


// 載入頁面圖案
fetch(`/api/attractions?page=0`, {
    method: "GET",
    headers: {
        "Content-Type": "application/json",
    },
})
.then(function(response) {
    return response.json();
}).then(function(data){
    nextPage = data['nextPage'];
    let arr = data["data"];
    console.log("第一次載 " + arr.length)
    const attractionsGroup = document.querySelector('.attractionsGroup');
    attractionsGroup.classList.add('container');
    // // 迴圈建立各個景點的畫面元素
    for (let i = 0; i < arr.length; i++) {
        const attraction = arr[i];

        // 創建一個新的<div>表示單一景點
        const attractionElement = document.createElement('div');
        attractionElement.classList.add('attraction');
        attractionElement.classList.add('product');

        function clickAttraction(){
            let id = attraction["id"];
            jumpToAttraction(id);
        }
        attractionElement.addEventListener('click', clickAttraction);

        // 圖片以及景點名稱的group
        const imageGroup = document.createElement('div');
        imageGroup.classList.add("imagegroup");
        // 圖片
        const imageElement = document.createElement('img');
        imageElement.classList.add('littlepic');
        imageElement.src = attraction["images"][0];
        imageGroup.appendChild(imageElement);
        // 景點名稱
        const textOnImage = document.createElement('h2');
        textOnImage.textContent = attraction["name"];
        textOnImage.classList.add("textonimage");
        imageGroup.appendChild(textOnImage);

        // 圖片下方的 捷運站名 + 類別
        const textUnderImageGroup = document.createElement('div');
        textUnderImageGroup.classList.add("textunderimagegroup");
        // 捷運名
        const mrtElement = document.createElement('h2');
        mrtElement.classList.add("textunderimageleft");
        mrtElement.textContent = attraction["mrt"];
        // 類別名
        const categoryElement = document.createElement('h2');
        categoryElement.classList.add("textunderimageright");
        categoryElement.textContent = attraction["category"];

        textUnderImageGroup.appendChild(mrtElement);
        textUnderImageGroup.appendChild(categoryElement);

        // 把<h2>跟<img>加到<div>之中
        attractionElement.appendChild(imageGroup);
        attractionElement.appendChild(textUnderImageGroup);
        // 把裝有每個景點的<div>加入到主容器, 顯示在網頁上
        attractionsGroup.appendChild(attractionElement);
    };
})   


// 關鍵字搜尋
function searchKeywords() {
    keyword = document.querySelector(".searchInput").value;
    nextPage = 0;

    fetch(`/api/attractions?page=0&keyword=` + keyword, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
        },
    })
    .then(function(response) {
        return response.json();
    }).then(function(data){
        nextPage = data['nextPage'];
        let arr = data["data"]
       
        const attractionsGroup = document.querySelector('.attractionsGroup');
        while (attractionsGroup.firstChild) {
            attractionsGroup.removeChild(attractionsGroup.firstChild);
        }
        attractionsGroup.classList.add('container');
        // 迴圈建立各個景點的畫面元素
        for (let i = 0; i < arr.length; i++) {
            const attraction = arr[i];
    
            // 創建一個新的<div>表示單一景點
            const attractionElement = document.createElement('div');
            attractionElement.classList.add('attraction');
            attractionElement.classList.add('product');
            function clickAttraction(){
                let id = attraction["id"];
                jumpToAttraction(id);
            }
            attractionElement.addEventListener('click', clickAttraction);
    
            // 圖片以及景點名稱的group
            const imageGroup = document.createElement('div');
            imageGroup.classList.add("imagegroup");
            // 圖片
            const imageElement = document.createElement('img');
            imageElement.classList.add('littlepic');
            imageElement.src = attraction["images"][0];
            imageGroup.appendChild(imageElement);
            // 景點名稱
            const textOnImage = document.createElement('h2');
            textOnImage.textContent = attraction["name"];
            textOnImage.classList.add("textonimage");
            imageGroup.appendChild(textOnImage);
    
            // 圖片下方的 捷運站名 + 類別
            const textUnderImageGroup = document.createElement('div');
            textUnderImageGroup.classList.add("textunderimagegroup");
            // 捷運名
            const mrtElement = document.createElement('h2');
            mrtElement.classList.add("textunderimageleft");
            mrtElement.textContent = attraction["mrt"];
            // 類別名
            const categoryElement = document.createElement('h2');
            categoryElement.classList.add("textunderimageright");
            categoryElement.textContent = attraction["category"];
    
            textUnderImageGroup.appendChild(mrtElement);
            textUnderImageGroup.appendChild(categoryElement);
    
            // 把<h2>跟<img>加到<div>之中
            attractionElement.appendChild(imageGroup);
            attractionElement.appendChild(textUnderImageGroup);
            // 把裝有每個景點的<div>加入到主容器, 顯示在網頁上
            attractionsGroup.appendChild(attractionElement);
        };
    })   
}


// 防止重複載入
let scrollBottomFlag = true;
// 為了防止重複載入, 觀察載入狀況
let isLoading = false;
window.addEventListener('scroll', function() {

    const footerElement = document.querySelector('footer');
    const bottom = footerElement.getBoundingClientRect().bottom;

    if (bottom - window.innerHeight < 10 ) {
        if (!scrollBottomFlag && !isLoading) {
            if (nextPage != undefined) {
                // 正在加載數據時, 將isLoading設置為true
                isLoading = true;
                let url = `/api/attractions?page=` + nextPage;
                if (keyword != "")
                    url = url + "&keyword=" + keyword;
                fetch(url, {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                    },
                })
                .then(function(response) {
                    return response.json();
                }).then(function(data){
                    nextPage = data['nextPage'];
                    let arr = data["data"];
                    console.log("到底了 : " + arr.length)
                    if (arr.length != 0) {
                        const attractionsGroup = document.querySelector('.attractionsGroup');
                        attractionsGroup.classList.add('container');

                        // 迴圈建立各個景點的畫面元素
                        for (let i = 0; i < arr.length; i++) {
                            const attraction = arr[i];
                    
                            // 創建一個新的<div>表示單一景點
                            const attractionElement = document.createElement('div');
                            attractionElement.classList.add('attraction');
                            attractionElement.classList.add('product');
                            function clickAttraction(){
                                let id = attraction["id"];
                                jumpToAttraction(id);
                            }
                            attractionElement.addEventListener('click', clickAttraction);
                            // 圖片以及景點名稱的group
                            const imageGroup = document.createElement('div');
                            imageGroup.classList.add("imagegroup");
                            // 圖片
                            const imageElement = document.createElement('img');
                            imageElement.classList.add('littlepic');
                            imageElement.src = attraction["images"][0];
                            imageGroup.appendChild(imageElement);
                            // 景點名稱
                            const textOnImage = document.createElement('h2');
                            textOnImage.textContent = attraction["name"];
                            textOnImage.classList.add("textonimage");
                            imageGroup.appendChild(textOnImage);
                    
                            // 圖片下方的 捷運站名 + 類別
                            const textUnderImageGroup = document.createElement('div');
                            textUnderImageGroup.classList.add("textunderimagegroup");
                            // 捷運名
                            const mrtElement = document.createElement('h2');
                            mrtElement.classList.add("textunderimageleft");
                            mrtElement.textContent = attraction["mrt"];
                            // 類別名
                            const categoryElement = document.createElement('h2');
                            categoryElement.classList.add("textunderimageright");
                            categoryElement.textContent = attraction["category"];
                    
                            textUnderImageGroup.appendChild(mrtElement);
                            textUnderImageGroup.appendChild(categoryElement);
                    
                            // 把<h2>跟<img>加到<div>之中
                            attractionElement.appendChild(imageGroup);
                            attractionElement.appendChild(textUnderImageGroup);
                            // 把裝有每個景點的<div>加入到主容器, 顯示在網頁上
                            attractionsGroup.appendChild(attractionElement);
                        };
                    }
                }).finally(function() {
                    // 無論成功或失敗, 都將isLoading設置為false
                    // 若放在迴圈當中, 某些狀況造成狀態無法重置
                    isLoading = false;
                });
            }
        }
    } else if (bottom - window.innerHeight > 5) {
        scrollBottomFlag = false;
    }
});


function jumpToAttraction(id) {
    window.location.href = "/attraction/" + id;
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


function login(){
    let loginEmail = document.querySelector(".loginEmail").value
    let loginPassword = document.querySelector(".loginPassword").value
    let userData = {
        email: loginEmail,
        password: loginPassword
    };
    
    if (loginEmail == "" || loginPassword == ""){
        console.log("stop!")
        return
    }

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
                signUpAlarm.innerHTML = "註冊成功！點此登入"
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
    let token = window.localStorage.getItem("token");

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

function logout(){
    console.log("Call logout")
    window.localStorage.setItem("token","");
    // 連線目標網址 = 當前網址
    window.location.href = window.location.pathname;
}

function goBooking(){
    window.location.href = "/booking";
}




getStatus();