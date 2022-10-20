const LOGGED_IN = "LOGGED_IN";
const LOGGED_OUT = "LOGGED_OUT";

const login = (value)=>{
    return{
        type:LOGGED_IN,
        payload:value
    }
}
const logout = (value)=>{
return{
    type:LOGGED_OUT,
    payload:value
}
}

export {login, logout, LOGGED_IN, LOGGED_OUT}