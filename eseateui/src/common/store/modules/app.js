const app ={
    state:{
        areaData:[],
        editId:""
    },
    mutations:{
        AREA(state,areaData){
          state.areaData = areaData
        },
        EDITID(state,editId){
            state.editId = editId
        }
    },
    actions:{

    }
}

export default app