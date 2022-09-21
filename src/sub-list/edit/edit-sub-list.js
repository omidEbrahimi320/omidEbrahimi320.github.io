import { isLogedin } from "./../../../expire-login.js";
import { DURATION_TIME_ALERT } from "/src/env.js";


const inputTitle    = document.querySelector('.input-title');
const inputPrice    = document.querySelector('.input-price');
const alertElement    = document.querySelector('.alert');
const dataForEdit   = JSON.parse(localStorage.getItem('sub-list-data-edited'));
const dataFromLocal = JSON.parse(localStorage.getItem('sub-list-data'));

document.querySelector('.input-title').addEventListener('keydown', onEditSubList);
document.querySelector('.input-price').addEventListener('keydown', onEditSubList);
document.querySelector('.cancel-edit').addEventListener('click', onCancelEdit);
document.querySelector('.edit-sub-list').addEventListener('click', onEditSubList);


isLogin();

function isLogin() {
    if (isLogedin()) {
        getDataForEdit();
        setUrl();
        const body = document.querySelector('body');
        body.classList.add('flex');
        body.classList.remove('hidden');
    } else {
        location.href = './../../auth-form/auth-form.html';
    }
}

function getDataForEdit() {
    let priceArray = [...dataForEdit.price];
    const filterComma = priceArray.filter((item) => item !== '٬');
    const numberPrice = +persianToEnglishNumber(filterComma.join(''));
    
    inputTitle.value = dataForEdit.title;
    inputPrice.value = numberPrice;
}


function onEditSubList(event) {
    if (isLogedin()) {
        if (event instanceof KeyboardEvent && event.key === 'Enter' || event instanceof PointerEvent) {
            const subListEdited = {
                id: dataForEdit.id,
                parent: dataForEdit.parent,
                title: inputTitle.value,
                price: new Number(inputPrice.value).toLocaleString('fa-IR'),
                created_at: dataForEdit.created_at
            }
            
            dataFromLocal.filter(sub => {
                const valid = validationForm(inputTitle, inputPrice, alertElement);
                if (dataForEdit.id === sub.id && valid) {
                    const indexSub = dataFromLocal.indexOf(sub);
                    dataFromLocal.splice(indexSub, 1, subListEdited);
                    localStorage.setItem('sub-list-data', JSON.stringify(dataFromLocal));
                    alertMessage('success', alertElement, 'زیر دسته با موفقیت ویرایش شد.');
                } else {
                    validationForm(inputTitle, inputPrice, alertElement);
                }
            });
        }
    } else {
        location.href = './../../auth-form/auth-form.html';
    }
}

function onCancelEdit() {
    location.href = './../../../index.html';
}

function setUrl() {
    const prev_url = window.location.href;
    localStorage.setItem('prev_url', prev_url);
}

function persianToEnglishNumber(persianNumber) {
    return persianNumber.replace(/[۰-۹]/g, d => '۰۱۲۳۴۵۶۷۸۹'.indexOf(d));
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


