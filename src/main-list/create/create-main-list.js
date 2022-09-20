import { isLogedin } from "./../../../expire-login.js";
import { DURATION_TIME_ALERT } from "/src/env.js";


isLogin();

function isLogin() {
    if (isLogedin()) {
        setUrl();
        const body = document.querySelector('body')
        body.classList.add('flex');
        body.classList.remove('hidden');
    } else {
        location.href = './../../auth-form/auth-form.html';
    }
}


document.querySelector('.create-main-list').addEventListener('click', onCreateList);
document.querySelector('.title-main-list').addEventListener('keydown', onCreateList);
document.querySelector('.cansel-create').addEventListener('click', onCanselCreate);

function onCreateList(event) {
    if (isLogedin()) {
        if(event.key === 'Enter') event.preventDefault();
        if ((event instanceof KeyboardEvent && event.key === 'Enter') || event instanceof PointerEvent) {
            const titleMainList = document.querySelector('.title-main-list');
            const title_list = JSON.parse(localStorage.getItem('main-list'))
            const alertElement = document.querySelector('.alert');
            const list = {
                title: titleMainList.value
            }
        
            if (title_list) {
                const duplicate = title_list.find(item => item.title === titleMainList.value);
        
                if (duplicate) alertMessage('error', alertElement, 'نام دسته تکراری است.');
                else if (titleMainList.value === '') alertMessage('error', alertElement, 'فیلد خالی است.');
                else {
                    title_list.unshift(list);
                    localStorage.setItem('main-list', JSON.stringify(title_list));
                    alertMessage('success', alertElement, 'دسته با موفقیت ایجاد شد.');
                }
            } else {
                if (titleMainList.value === '') alertMessage('error', alertElement, 'فیلد خالی است.');
                else {
                    const arr = [];
                    arr.unshift(list);
                    localStorage.setItem('main-list', JSON.stringify(arr));
                    alertMessage('success', alertElement, 'دسته با موفقیت ایجاد شد.');
                }
            }
        }
    } else {
        location.href = './../../auth-form/auth-form.html';
    }
}

function onCanselCreate() {
    if (isLogedin()) {
        location.href = './../../home-page/index.html';
    } else {
        location.href = './../../auth-form/auth-form.html';
    }
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
            location.href = './../../home-page/index.html';
        } else element.classList.remove('error');
    }, DURATION_TIME_ALERT);
}

function setUrl() {
    const prev_url = window.location.href;
    localStorage.removeItem('main-list-selected');
    localStorage.setItem('prev_url', prev_url);
}