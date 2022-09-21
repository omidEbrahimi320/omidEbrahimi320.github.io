import { isLogedin } from "./../../../expire-login.js";
import { DURATION_TIME_ALERT } from "/src/env.js";


document.querySelector('.input-title').addEventListener('keydown', onCreate);
document.querySelector('.input-price').addEventListener('keydown', onCreate);
document.querySelector('.create-sub-list').addEventListener('click', onCreate);
document.querySelector('.cancel-create').addEventListener('click', onCancelCreate);

const remember = JSON.parse(localStorage.getItem('remember-data'));

isLogin();

function isLogin() {
    if (isLogedin()) {
        setUrl();
        const body = document.querySelector('body');
        body.classList.add('flex');
        body.classList.remove('hidden');
    } else {
        location.href = './../../auth-form/auth-form.html';
    }
}

function onCreate(event) {
    if (isLogedin()) {
        if (event instanceof KeyboardEvent && event.key === 'Enter' || event instanceof PointerEvent) {
            const inputTitle       = document.querySelector('.input-title');
            const inputPrice       = document.querySelector('.input-price');
            const alertElement     = document.querySelector('.alert');
            const subListFromLocal = JSON.parse(localStorage.getItem('sub-list-data')) || [];
            const mainListSelected = JSON.parse(JSON.stringify(localStorage.getItem('main-list-selected')));
        
            const subList = {
                id: Date.now(),
                parent: mainListSelected,
                title: inputTitle.value,
                price: new Number(inputPrice.value).toLocaleString('fa-IR'),
                created_at: todayPersianDate()
            };
        
            const valid = validationForm(inputTitle, inputPrice, alertElement);
            if (valid) {
                console.log(subListFromLocal);
                subListFromLocal.unshift(subList);
                localStorage.setItem('sub-list-data', JSON.stringify(subListFromLocal));
                alertMessage('success', alertElement, 'زیر دسته با موفقیت ایجاد شد.');
            } else {
                validationForm(inputTitle, inputPrice, alertElement);
            }
        }
    } else {
        location.href = './../../auth-form/auth-form.html';
    }

}


function onCancelCreate() {
    location.href = './../../../index.html';
}



function alertMessage(status, element, message) {
    if (status === 'success') {
        element.classList.add('success');
        element.innerHTML = message
    }

    if (status === 'error') {
        element.classList.add('error');
        element.innerHTML = message
    }

    setTimeout(() => {
        if (element.classList.contains('success')) {
            element.classList.remove('success');
            location.href = './../../../index.html';
        } else element.classList.remove('error');
    }, DURATION_TIME_ALERT);
}


function setUrl() {
    const prev_url = window.location.href;
    localStorage.setItem('prev_url', prev_url);
}

function todayPersianDate() {
    return new Date().toLocaleString('fa', {
        dateStyle: 'full'
    })
    .split(' ')
    .reverse()
    .join(' ')
    .replace(',', '');
}


function validationForm(title, price, alertElement) {
    const formError  = 'فرم خالی است.';
    const nameError  = 'فیلد نام خالی است.';
    const priceError = 'فیلد قیمت خالی است.';

    
    if (!price.value || !title.value) {
        if (!title.value && !price.value) alertMessage('error', alertElement, formError);
        else if (!title.value)            alertMessage('error', alertElement, nameError);
        else                              alertMessage('error', alertElement, priceError);
        return false;
    }
    return true;
}