// import { LOGGED_IN, LOGGED_OUT } from "./constants"

const initialState ={
    isLogged : false,
    role : ""
}
const reducer = (state=initialState, action)=>{
    switch(action.type){
        case "LOGGED_IN":
           return {
                isLogged:true,
                role:action.payload
           }
        case "LOGGED_OUT":
            return{
                isLogged:false,
                role : ""
            }
        default:
            return{
                ...state
            }       
    }
}

export default reducer