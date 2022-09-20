
export const setRemember = (obj) => {
    localStorage.setItem('remember-data', JSON.stringify(obj))
}