import { setRemember } from "./auth.sevice.js";
import { isLogedin } from "./../../../expire-login.js";
import { DURATION_TIME_ALERT } from "/src/env.js";

const errorEmail = document.querySelector('.error-email');
const errorPassword = document.querySelector('.error-password');
const email = document.querySelector('.email');
const password = document.querySelector('.password');
const title = document.querySelector('.title');
const submitForm = document.querySelector('.submit');
const rememberEl = document.querySelector('.remember');
const switcherEl = document.querySelector('.switcher');
const checkbox = document.querySelector('.checkbox');
let isEmailValid = false;
let isPasswordValid = false;

document.querySelector('.email').addEventListener('input', validationEmail);
document.querySelector('.password').addEventListener('input', validationPassword);

document.querySelector('.submit').addEventListener('click', subbmit);
document.querySelector('.bi-x').addEventListener('click', removeAlert);
email.addEventListener('keydown', subbmit);
password.addEventListener('keydown', subbmit);
document.querySelector('.switcher').addEventListener('click', switcher);

isLogin();

function isLogin() {
    if (isLogedin()) {
        location.href = './../home-page/index.html';
    } else {
        const body = document.querySelector('body');
        body.classList.add('flex');
        body.classList.remove('hidden');
    }
}


function removeAlert() {
    const alertAuth = document.querySelector('.alert-auth');
    alertAuth.style.visibility = 'hidden';
}


function switcher(event) {
    const authForm = document.querySelector('.auth-form');
    errorEmail.style.visibility = 'hidden';
    errorPassword.style.visibility = 'hidden';
    email.value = '';
    password.value = '';
    isEmailValid = false;
    isPasswordValid = false;
    submitForm.setAttribute('disabled', 'disabled');

    authForm.style.transform = 'rotateY(90deg)';
    setTimeout(() => {
        if (event.target.textContent.trim() === 'عضویت') {
            event.target.textContent = 'ورود';
            submitForm.innerHTML = 'ثبت نام';
            title.innerHTML = 'ثبت نام در سایت';
            rememberEl.style.visibility = 'hidden';
        } else {
            event.target.textContent = 'عضویت';
            submitForm.innerHTML = 'ورود';
            title.innerHTML = 'ورود به سایت';
            rememberEl.style.visibility = 'visible';
        }
        authForm.style.transform = 'rotateY(0deg)';
    }, 300)
}

function subbmit(event) {
    const registerDataFromLocal = JSON.parse(localStorage.getItem('register')) || [];
    const enabledSubmit = document.querySelector('.enabled')
    if ((event instanceof KeyboardEvent && event.key === 'Enter' || event instanceof PointerEvent) && enabledSubmit) {
        if (title.innerHTML.trim() === 'ثبت نام در سایت') {
            const users = registerDataFromLocal.filter(user => user.email !== email.value);
            if (!users[0]) {
                const registerData = {
                    email: email.value,
                    password: password.value
                }
                registerDataFromLocal.push(registerData);
                localStorage.setItem('register', JSON.stringify(registerDataFromLocal));
                alertMessage('success', 'ثبت نام با موفقیت انجام شد.');
    
                switcherEl.innerHTML = 'عضویت';
                submitForm.innerHTML = 'ورود';
                title.innerHTML = 'ورود به سایت';
                rememberEl.style.visibility = 'visible';
                isEmailValid = false;
                isPasswordValid = false;
                email.value = '';
                password.value = '';
                return
            } else {
                alertMessage('error', 'ایمیل تکراری است.');
            }
        }
    
        localStorage.removeItem('remember-data');
    
        if (title.innerHTML.trim() === 'ورود به سایت') {
            const users = registerDataFromLocal.filter(user => user.email === email.value && user.password === password.value);
            if (users[0]) {
                if (checkbox.checked) {
                    const rememberElData = {
                        email: email.value,
                        password: password.value
                    }
                    setRemember(rememberElData);
                    localStorage.removeItem('prev_url');
                    localStorage.removeItem('expire-logedin');
                } else {
                    localStorage.removeItem('remember-data');
                    const currentMonth = new Date().getMonth();
                    console.log(currentMonth);
                    const dateNow = new Date().getMonth();
                    console.log(dateNow);
                    const nextDate = new Date().setMonth(currentMonth + 1) // nextDate format number //
                    // console.log();
                    const expireMonth = new Date(nextDate).getTime();
                    console.log(expireMonth);
                    localStorage.setItem('expire-logedin', expireMonth);
                }
                const prevUrl = window.location.href;
                localStorage.setItem('prev_url', prevUrl);
                
                email.value = '';
                password.value = '';
    
                
                alertMessage('success', 'ورود با موفقیت انجام شد.');
            } else alertMessage('error', 'ایمیل یا پسسور اشتباه است.');
        }
    }
}

    
// validators for email and password //

function validationEmail(event) {
    isEmail(event);
    emptyEmail(event);

    if ((isEmail(event) && !emptyEmail(event))) isEmailValid = true;
    else isEmailValid = false;
    isValidForm();
}

function validationPassword(event) {
    checkLengthPassword(event);
    emptyPassword(event);

    if ((checkLengthPassword(event) && !emptyPassword(event))) isPasswordValid = true;
    else isPasswordValid = false;
    isValidForm();
}

function isValidForm() {
    if (isEmailValid === true && isPasswordValid === true) {
        submitForm.removeAttribute('disabled')
    } else {
        submitForm.setAttribute('disabled', 'enabled');
    }
    const checkErrorEmail = errorEmail.style.visibility === 'hidden';
    const checkErrorPassword = errorPassword.style.visibility === 'hidden';
    
    if (checkErrorEmail && checkErrorPassword && email.value && password.value) {
        submitForm.classList.add('enabled');
    } else {
        submitForm.classList.remove('enabled');
    }
}

function isEmail(event) {
    const gmail = event.target.value.endsWith('@gmail.com');
    const yahoo = event.target.value.endsWith('@yahoo.com');
    const message = 'فقط فرمت های gmail.com, yaho.com پشتیبانی میشوند.';

    if (gmail || yahoo) {
        errorEmail.style.visibility = 'hidden';
        return true;
    }

    if (!gmail && !yahoo) {
        errorMessage(errorEmail, 'visible', message);
        return false;
    }
}


function emptyEmail(event) {
    if (!event.target.value) {
        errorMessage(errorEmail, 'visible', 'لطفا فیلد ایمیل را پر کنید.');
        return true
    }
    return false
}

function checkLengthPassword(event) {
    const lengthValue = event.target.value.length;
    if (lengthValue < 6 || lengthValue > 12) {
        errorMessage(errorPassword, 'visible', 'لطفا بین 6 تا 12 کاراکتر وارد کنید.');
        return false
    } else {
        errorPassword.style.visibility = 'hidden';
        return true;
    }

}

function emptyPassword(event) {
    if (!event.target.value) {
        errorMessage(errorPassword, 'visible', 'لطفا فیلد پسوورد را پر کنید.');
        return true
    }
    return false
}


// show error and successfully message //

function errorMessage(element, status, message) {
    element.style.visibility = status;
    element.innerHTML = message;
}

function alertMessage(status, message) {
    const alert = document.querySelector('.alert');
    if (status === 'success') {
        alert.classList.add('success');
        alert.innerHTML = message;
    }

    if (status === 'error') {
        alert.classList.add('error');
        alert.innerHTML = message;
    }

    setTimeout(() => {
        alert.classList.remove('success');
        alert.classList.remove('error');
        alert.innerHTML = '';
        if (message === 'ورود با موفقیت انجام شد.') {
            location.href = './../home-page/index.html';
        }
    }, DURATION_TIME_ALERT)
}