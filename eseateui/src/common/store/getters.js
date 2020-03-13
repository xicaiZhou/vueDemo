const getters = {
    token: state => state.user.token,
    userinfo: state => state.user.userinfo,
    areaData: state => state.app.areaData,
    editId: state => state.app.editId
  }
  export default getters