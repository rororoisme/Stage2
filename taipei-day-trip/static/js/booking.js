
let attractionInformation;

// title導回首頁
function backToHome() {
    window.location.href = "/"
}

// Login
function closeLoginBox(){
    window.location.reload();
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

function testAccountLogin() {
    document.querySelector('.loginEmail').value = 'test@example.com';
    document.querySelector('.loginPassword').value = 'password123';
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

// 把css變化包成一個function
// 再把此function放在行程沒預約的條件之下
// function ()
function noBookingCSS(){
    let sectionBoxElem = document.querySelector(".sectionBox");
    let separatorContainerElems = document.querySelectorAll(".separatorContainer")
    let contactFormElem = document.querySelector(".contactForm")
    let paymentBoxElem = document.querySelector(".paymentBox")
    let confirmElem = document.querySelector(".confirm")
    sectionBoxElem.style.display = "none";
    separatorContainerElems.forEach(function(elem) {
        elem.style.display = "none";
    });
    contactFormElem.style.display = "none";
    paymentBoxElem.style.display = "none";
    confirmElem.style.display = "none";

    let noBookingText = document.createElement("div");
    let noBookingTextTarget = document.querySelector(".mainHeadline");
    let noBookingFooterElem = document.querySelector("footer")
    noBookingFooterElem.classList.add("noBookingFooter")
    noBookingText.classList.add("noBookingText")
    noBookingText.innerHTML = "目前沒有任何待預訂的行程";
    noBookingTextTarget.insertAdjacentElement("afterend", noBookingText);
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

function testAccountSignUp() {
    document.querySelector('.signUpName').value = 'test';
    document.querySelector('.signUpEmail').value = 'test@example.com';
    document.querySelector('.signUpPassword').value = 'password123';
}

function bookingDelete() {
    let token = window.localStorage.getItem("token");
    fetch(`/api/booking`,{
        method: "DELETE",
        headers: {
            "Content-Type": "application/json",
            "Authorization": "bearer " + token
        }
    }).then(function(response){
        return response.json();
    }).then(function(data){
        // 刪除完成
        window.location.reload();
    });
}

function logout(){
    window.localStorage.setItem("token","");
    // 連線目標網址 = 當前網址
    window.location.href = "/";
}

function getStatus(){
    let token = window.localStorage.getItem("token");

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
        let userNameElem = document.querySelector(".userName");
        let attractionNameElem = document.querySelector(".sectionAttraction");
        let sectionImageElem = document.querySelector(".sectionImage")
        let sectionDateElem = document.querySelector(".sectionDate")
        let sectionTimeElem = document.querySelector(".sectionTime")
        let sectionPriceElem = document.querySelector(".sectionPrice")
        let sectionAddressElem = document.querySelector(".sectionAddress")
        if (userdata) { 
            // 已登入
            console.log("Has login")
            loginElem.textContent = "登出"
            loginElem.addEventListener('click', logout);
            loginElem.removeEventListener('click', goLogin);
            userNameElem.textContent = userdata["name"];
            // 已登入要檢查行程
            fetch(`/api/booking`,{
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": "bearer " + token
                }
            }).then(function(response){
                return response.json();
            }).then(function(data){
                // 注意後端該筆api的response很多層
                if(data["data"] == undefined) {
                    noBookingCSS();
                } else {
                    console.log(data["data"])
                    attractionInformation = data["data"];
                    attractionNameElem.textContent = data["data"]["attraction"]["name"];
                    sectionImageElem.src = data["data"]["attraction"]["image"];
                    sectionDateElem.textContent = data["data"]["date"];

                    if (data["data"]["time"] == "morning"){
                        sectionTimeElem.textContent = "早上 9 點到下午 4 點"
                    } else {
                        sectionTimeElem.textContent = "下午 2 點到晚上 8 點"
                    }
                    
                    
                    if (data["data"]["price"] == "2000"){
                        sectionPriceElem.textContent = "新台幣 2000 元"
                    } else {
                        sectionPriceElem.textContent = "新台幣 2500 元"
                    }
                    
                    sectionAddressElem.textContent = data["data"]["attraction"]["address"];
                } 
            });

        } else {
            goLogin();
            
        }
    })
}

function goBooking() {
    alert("您已在預定行程頁面");
    window.location.reload();
}


//------------------串接TapPay
const tapPayAppId = 137241;
const tapPayKey = "app_38SMa8FT2XGBb8ZDZTFk7TFSjG2srOFheEHg9VKAO7VV1b8McAywh2zKAwN2";
let isOkGetPrime = false;

function initTapPay() {
    TPDirect.setupSDK(tapPayAppId, tapPayKey, "sandbox");

	TPDirect.card.setup({
		fields: {
			number: {
				element: '#cardNumberInput',
				placeholder: '**** **** **** ****'
			},
			expirationDate: {
				element: document.getElementById("cardExpireInput"),
				placeholder: 'MM / YY'
			},
			ccv: {
				element: '#cardCVVInput',
				placeholder: 'CVV'
			}
		},
		styles: {
			'input': {
				'color': 'gray'
			},
			'.valid': {
				'color': 'green'
			},
			'.invalid': {
				'color': 'red'
			},
            '@media screen and (max-width: 400px)': {
                'input': {
                    'color': 'orange'
                }
            }
		},

		isMaskCreditCardNumber: true, 
        maskCreditCardNumberRange: {
            beginIndex: 6, 
            endIndex: 11
        }
    });

    
    // 管理輸入欄位 
    // canGetPrime = 全部欄位輸入正確
    TPDirect.card.onUpdate(function(update) {
        console.log("Update !!!")
        console.log(update)
        let confirmBtn = document.querySelector(".confirmBtn");

		if(update.canGetPrime) {
			isOkGetPrime = true;
		}
		else {
			isOkGetPrime = false;
		}
    })

}

function testAccountBooking() {
    document.querySelector('.contactName').value = 'test';
    document.querySelector('.contactEmail').value = 'test@example.com';
    document.querySelector('.contactNumber').value = 'password123';
}


let confirmBtn = document.querySelector(".confirmBtn");
confirmBtn.addEventListener("click",()=>{

    if(isOkGetPrime) {
        const tappayStatus = TPDirect.card.getTappayFieldsStatus();

        if(tappayStatus.canGetPrime === false) {
            alert("信用卡確認異常");
            console.log("can not get prime");
            return;
        }

        let bookingEmail = document.querySelector(".contactEmail").value;
        let bookingPhone = document.querySelector(".contactNumber").value;
        let bookingName = document.querySelector(".contactName").value;
        // 擋住未輸入個人資訊就送出
        if (bookingEmail == undefined || bookingEmail == "" ||
        bookingPhone == undefined || bookingPhone == "" ||
        bookingName == undefined || bookingName == "") {
            alert("請輸入完整個人資訊")
            return;
        }

        TPDirect.card.getPrime((result) => {
            
            if(result.status !== 0) {
                alert("信用卡確認異常");
                console.log("get prime error" + result.msg);
                return;
            }
            console.log("get prime success");
            console.log(result);

            let price = attractionInformation.price;
            delete  attractionInformation.price;
            let data = {
                "prime": result["card"]["prime"],
                "order": {
                  "price": price,
                  "trip": attractionInformation,
                  "contact": {
                    "name": bookingName,
                    "email": bookingEmail,
                    "phone": bookingPhone
                  }
                }
                
            };
            let token = window.localStorage.getItem('token');
            fetch(`/api/orders`,{
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": "bearer " + token
                },
                body:JSON.stringify(data)
            }).then(function(response){
                return response.json();
            }).then(function(data){
                console.log(data);
                if (data["data"]['payment']["status"] == 0) {
                    window.location.href = "/thankyou?number=" + data["data"]["number"];
                } else {
                    alert("付款失敗");
                }
            })
        });
    }
    else {
        alert("信用卡資訊不完整");
    }
})


initTapPay();
getStatus();





