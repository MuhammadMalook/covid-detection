// import { LOGGED_IN, LOGGED_OUT } from "./constants"

const initialState ={
    isLogged : false
}
const reducer = (state=initialState, action)=>{
    switch(action.type){
        case "LOGGED_IN":
           return {
                isLogged:true
           }
        case "LOGGED_OUT":
            return{
                isLogged:false
            }
        default:
            return{
                ...state
            }       
    }
}

export default reducer