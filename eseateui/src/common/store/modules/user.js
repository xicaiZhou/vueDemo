const user = {
    state:{
        token: localStorage.getItem('token'),
        userinfo: localStorage.getItem('userinfo')
    },
    mutations:{
        userinfo(state, userinfo) {
            state.token = userinfo.token
            state.userinfo = userinfo
            localStorage.setItem('token', userinfo.token)
            localStorage.setItem('userinfo', JSON.stringify(userinfo))
        },
        logout() {
            localStorage.setItem('token', '')
            localStorage.setItem('userinfo', '')
        }
    }
}

export default user