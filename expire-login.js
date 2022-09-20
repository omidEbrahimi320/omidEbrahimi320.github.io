function expirLogein() {
    const expireDate = localStorage.getItem('expire-logedin');
    const dateNow = new Date().getMonth();
    const isExpired = dateNow > expireDate;
    return isExpired;
}

export function isLogedin() {
    const remember = JSON.parse(localStorage.getItem('remember-data'));
    return remember || !expirLogein();
}