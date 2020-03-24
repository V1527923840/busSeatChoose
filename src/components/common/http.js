import axios from 'axios';

axios.defaults.headers.post['Authorization'] = "Bearer " + sessionStorage.getItem('token');
axios.defaults.headers.get['Authorization'] = "Bearer " + sessionStorage.getItem('token');

export function Get(url) {
    return new Promise(async (resole,reject) => {
        try {
            const res = await axios.get(url)
            resole(res)
        } catch(err){
            reject(err)
        }
    })
}

export function Post(url,params){
    return new Promise(async (resole,reject) => {
        try {
            const res = await axios.get(url, params)
            resole(res)
        } catch(err){
            reject(err)
        }
    })
}
