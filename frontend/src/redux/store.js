import reducer from "./reducer";
import { createStore } from "redux";

const store = createStore(reducer)
const unsub = store.subscribe(()=>{
    console.log(store.getState())
})

export default  store