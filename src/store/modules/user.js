import { login, logout, getInfo } from '@/api/user'
import { getToken, setToken, removeToken } from '@/utils/auth'
import { resetRouter, asyncRoutes, constantRoutes, anyRoutes} from '@/router'
import router from '@/router'
import cloneDeep from 'lodash/cloneDeep'
const getDefaultState = () => {
  return {
    token: getToken(),
    name: '',
    avatar: '',
    roles:[],
    buttons:[],
    routes:[],
    resultAsyncRoutes:[],
    resultAllRoutes:[]
  }
}

const state = getDefaultState()

const mutations = {
  RESET_STATE: (state) => {
    Object.assign(state, getDefaultState())
  },
  SET_TOKEN: (state, token) => {
    state.token = token
  },
  SET_USERINFO:(state,userInfo) => {
    state.name = userInfo.name
    state.avatar = userInfo.avatar
    state.roles = userInfo.roles
    state.buttons = userInfo.buttons
    state.routes = userInfo.routes
  },
  SET_RESULTASYNCROUTES:(state,asyncRoutes) => {
    state.resultAsyncRoutes = asyncRoutes
    state.resultAllRoutes = constantRoutes.concat(state.resultAsyncRoutes,anyRoutes)
    router.addRoutes(state.resultAllRoutes)
  }
}
const computedAsyncRoutes = (asyncRoutesParam,routes) => {
  return asyncRoutesParam.filter((item) => {
    if(routes.indexOf(item.name) != -1){
      if(item.children&&item.children.length){
        item.children = computedAsyncRoutes(item.children,routes)
      }
      return true
    }
  })
}
const actions = {
  // user login
  login({ commit }, userInfo) {
    const { username, password } = userInfo
    return new Promise((resolve, reject) => {
      login({ username: username.trim(), password: password }).then(response => {
        const { data } = response
        commit('SET_TOKEN', data.token)
        setToken(data.token)
        resolve()
      }).catch(error => {
        reject(error)
      })
    })
  },

  // get user info
  getInfo({ commit, state }) {
    return new Promise((resolve, reject) => {
      getInfo(state.token).then(response => {
        const { data } = response

        if (!data) {
          return reject('Verification failed, please Login again.')
        }

        commit('SET_USERINFO',data)
        commit('SET_RESULTASYNCROUTES',computedAsyncRoutes(cloneDeep(asyncRoutes),data.routes))
        resolve(data)
      }).catch(error => {
        reject(error)
      })
    })
  },

  // user logout
  logout({ commit, state }) {
    return new Promise((resolve, reject) => {
      logout(state.token).then(() => {
        removeToken() // must remove  token  first
        resetRouter()
        commit('RESET_STATE')
        resolve()
      }).catch(error => {
        reject(error)
      })
    })
  },

  // remove token
  resetToken({ commit }) {
    return new Promise(resolve => {
      removeToken() // must remove  token  first
      commit('RESET_STATE')
      resolve()
    })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}

