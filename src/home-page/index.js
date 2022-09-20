import { isLogedin } from "../../expire-login.js";


const warningElement = document.querySelector('.warning');
const btnRemoveMainList = document.querySelector('.btn-remove-main-list');
const boxSubList = document.querySelector('.box-sub-list');
const warningPage = document.querySelector('.warning-page');
const prevUrlFromLocal = localStorage.getItem('prev_url') || '';
let subListId = '';

initPage();


document.querySelector('.btn-remove-main-list').addEventListener('click', alertRemoveMainList);
window.onShowMainSelectedList = onShowMainSelectedList;
document.querySelector('.cansel-remove').addEventListener('click', cancelRemoveMainList);
document.querySelector('.continue-delete').addEventListener('click', onRemove);



function initPage() {
    isLogin();
}


function isLogin() {
    if (isLogedin()) {
        getMainList();
        checkUrl();
        displaySubList();
        const body = document.querySelector('body')
        body.classList.add('flex');
        body.classList.remove('hidden');
    } else {
        location.href = './../auth-form/auth-form.html';
    }
}


function getMainList() {
    const listsFromLocal = JSON.parse(localStorage.getItem('main-list')) || [];
    const mainList = document.querySelector('.main-list');
    mainList.innerHTML = '';
    if (localStorage.getItem('main-list')) {
        listsFromLocal.forEach(list => {
            mainList.innerHTML +=
            `<div 
            class='list bg-slate-100 w-full mt-2 p-2 rounded-md cursor-pointer transition-all duration-150
            text-[15px]'
            onclick="onShowMainSelectedList(event)">
            ${list.title}
            </div>`
        });
    } else {
        mainList.innerHTML = `<span class="font-semibold mt-8">دیتایی وجود ندارد</span>`;
    }
}


function showMainSelectedList() {
    const MainListsElement = document.querySelectorAll('.list');
    const lastSelectedList = localStorage.getItem('main-list-selected');
    if (lastSelectedList) {
        MainListsElement.forEach(el => {
            const checkListTextContent = el.textContent.trim() === lastSelectedList;
            if (checkListTextContent) {
                el.classList.add('selected');
                btnRemoveMainList.classList.add('change-pointer');
            };
            showBoxElementSubList();
        });
    }
}


function onShowMainSelectedList(event) {
    if (isLogedin()) {
        const mainLists = document.querySelectorAll('.selected');
        mainLists.forEach(mainList => {
            mainList.classList.remove('selected');
        })
        event.target.classList.add('selected');
        localStorage.setItem('main-list-selected', event.target.textContent.trim());
        btnRemoveMainList.classList.add('change-pointer');
        plusPrices();
        showBoxElementSubList();
        displaySubList();
    } else {
        location.href = './../auth-form/auth-form.html';
    }
}


function getSubListFromMainSelectedList() {
    const subListsData = JSON.parse(localStorage.getItem('sub-list-data')) || [];
    const selectedElement = document.querySelector('.selected');
    if (subListsData.length > 0 && selectedElement) {
        const subLists = subListsData.filter(sub => sub.parent === selectedElement.textContent.trim());
        if (subLists.length > 0)  return subLists;
        return null;
    }
}


function showBoxElementSubList() {
    boxSubList.classList.add('show-box-sub-list');
}


function displaySubList() {
    const subListsFiltered = getSubListFromMainSelectedList();
    const subListEl = document.querySelector('.sub-list');
    if (subListsFiltered) {
        subListEl.innerHTML = 
        `<thead class="thead bg-white rounded-t-[7px]">
                <tr class="w-full">
                <th class="text-sm py-2 !min-w-[140px] !max-w-[140px]">نام</th>
                <th class="text-sm py-2 !min-w-[140px] !max-w-[140px]">قیمت</th>
                <th class="text-sm py-2 !min-w-[140px] !max-w-[140px]">تاریخ</th>
                <th class="text-sm py-2 !min-w-[140px] !max-w-[140px]">حذف / ویرایش</th>
            </tr>
        </thead>
        <tbody class="tbody overflow-x-auto h-[200px] xs:h-[70px] sm:h-[64px]"></tbody>`
        const tbody = document.querySelector('.tbody');
        subListsFiltered.forEach(sub => {
            tbody.innerHTML +=
                `<tr class="sub-list-element h-9 w-full bg-white">
                    <td class="text-sm !min-w-[140px] !max-w-[140px]">${sub.title}</td>
                    <td class="text-sm !min-w-[140px] !max-w-[140px]">${sub.price} تومان</td>
                    <td class="text-[13px] !min-w-[140px] !max-w-[140px]">${sub.created_at}</td>
                    <td class= !min-w-[140px]"!max-w-[140px]">
                        <i onclick="alertRemoveSubList(${sub.id})" class="bi bi-trash text-red-600 cursor-pointer ml-[10px]"></i>
                        <a href='./../sub-list/edit/edit-sub-list.html'>
                            <i onclick="onEditSubList(${sub.id})" class="bi bi-pencil-square first-letter: text-purple-600 cursor-pointer ml-[10px]"></i>
                        </a>
                    </td>
                </tr>`
                plusPrices();
                window.alertRemoveSubList = alertRemoveSubList;
                window.onEditSubList = onEditSubList;
        })
        changeClassThead();
    } else {
        subListEl.innerHTML = `<span>دیتایی وجود ندارد</span>`;
        subListEl.classList.remove('bg-white');
        subListEl.classList.remove('sub-list-shadow');
    }
        
}




/* 
    #####################                                                                ######################
    #####################   check url on load page and on returned from another page     ######################
    #####################                                                                ######################
*/

function checkUrl() {
    const urlAuth = prevUrlFromLocal === "http://127.0.0.1:5500/src/auth-form/auth-form.html";
    const urlCreateList = prevUrlFromLocal === "127.0.0.1:5500/src/main-list/create/create-main-list.html";
    if (prevUrlFromLocal === '' || urlCreateList || urlAuth) {
        const selectedEl = document.querySelector('.selected');
        localStorage.removeItem('main-list-selected');
        if (selectedEl) {
            selectedEl.classList.remove('selected');
        }
    } else {
        showMainSelectedList();
        localStorage.setItem('prev_url', '');
    }
}


function cancelRemoveMainList() {
    if (isLogedin()) {
        warningElement.classList.remove('show-warning');
        warningPage.classList.remove('show-warning-page');
    } else {
        location.href = './../auth-form/auth-form.html';
    }
}


function alertMessage(status, element, message) {
    if (isLogedin()) {
        const textWarning = document.querySelector('.text-warning');
        element.classList.add('show-warning');
        warningPage.classList.add('show-warning-page');
        textWarning.innerHTML = message;
    } else {
        if (status === 'warning') {
            location.href = './../auth-form/auth-form.html';
        }
    }
}


function onEditSubList(subId) {
    const dataFromLocal = JSON.parse(localStorage.getItem('sub-list-data'));
    dataFromLocal.forEach((sub) => {
        if (subId === sub.id) {
            localStorage.setItem('sub-list-data-edited', JSON.stringify(sub));
        }
    })
}



/* 
    #####################                        BEGIN                                  ######################
    #####################   check url on load page and on returned from another page    ######################
    #####################                                                               ######################
*/


function alertRemoveSubList(subId) {
    subListId = subId;
    alertMessage('warning', warningElement, 'آیا از حذف این زیر دسته مطمئن هستید؟');
}

function alertRemoveMainList() {
    const mainListsSelected = document.querySelector('.selected');
    if (mainListsSelected) {
        alertMessage('warning', warningElement, 'آیا از حذف این دسته مطمئن هستید؟ زیر دسته هایش هم حذف میشوند.');
    }
}

function removeSubList() {
    const dataFromLocal = JSON.parse(localStorage.getItem('sub-list-data'));
    const filtered = dataFromLocal.filter(sub => sub.id !== subListId);
    localStorage.setItem('sub-list-data', JSON.stringify(filtered));
    displaySubList();
    warningElement.classList.remove('show-warning');
    warningPage.classList.remove('show-warning-page');
    plusPrices();
}


function onRemove() {
    if (isLogedin()) {
        const textWarning = document.querySelector('.text-warning');
        if (textWarning.innerHTML.trim() === 'آیا از حذف این زیر دسته مطمئن هستید؟') {
            removeSubList();
        } else removeMainList();
    } else {
        location.href = './../auth-form/auth-form.html';
    }
}


function removeMainList() {
    const listsFromLocal = JSON.parse(localStorage.getItem('main-list')) || [];
    const mainListSelected = localStorage.getItem('main-list-selected');
    listsFromLocal.forEach((mainList, index) => {
        if (mainList.title === mainListSelected) {
            removeSubListsForMainLists(mainListSelected);
            listsFromLocal.splice(index, 1);
            localStorage.setItem('main-list', JSON.stringify(listsFromLocal));
            btnRemoveMainList.classList.remove('change-pointer');
            boxSubList.classList.remove('show-box-sub-list');
            warningElement.classList.remove('show-warning');
            localStorage.removeItem('main-list-selected');
            warningPage.classList.remove('show-warning-page');
            getMainList();
            if (!listsFromLocal.length) {
                localStorage.removeItem('main-list');
                getMainList();
            }
        } 
    });
}

function removeSubListsForMainLists(mainListSelected) {
    const subListsData = JSON.parse(localStorage.getItem('sub-list-data')) || [];
    const filtered = subListsData.filter(sub => sub.parent !== mainListSelected)
    
    localStorage.setItem('sub-list-data', JSON.stringify(filtered));
    displaySubList()
}





/* 
    #####################                        END                                    ######################
    #####################   check url on load page and on returned from another page    ######################
    #####################                                                               ######################
*/


function plusPrices() {
    const subListsFiltered = getSubListFromMainSelectedList();
    const showSumPrice = document.querySelector('.show-sum-price');
    let sumNum = 0;
    if (subListsFiltered) {
        subListsFiltered.forEach(sub => {
            let priceArray = [...sub.price];
            const filterComma = priceArray.filter((item) => item !== '٬');
            const numberPrice = +persianToEnglishNumber(filterComma.join(''));
            sumNum += numberPrice;
            showSumPrice.innerHTML = new Number(sumNum).toLocaleString('fa-IR');
        });
    } else {
        showSumPrice.innerHTML = new Number('0').toLocaleString('fa-IR');
    }
}

function persianToEnglishNumber(persianNumber) {
    return persianNumber.replace(/[۰-۹]/g, d => '۰۱۲۳۴۵۶۷۸۹'.indexOf(d));
}

function isScrollExist() {
    const tbody = document.querySelector('.tbody');
    const hasScroll = tbody.scrollHeight > tbody.clientHeight;
    return hasScroll;
}


function changeClassThead() {
    const thead = document.querySelector('.thead');
    if (isScrollExist()) thead.classList.add('theadWidth');
    else thead.classList.remove('theadWidth');
}

window.addEventListener('resize', changeClassThead)