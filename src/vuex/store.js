import Vue from 'vue';
import Vuex from 'vuex';
Vue.use(Vuex);


// import VueResource from 'vue-resource'
// Vue.use(VueResource);

const state = {
    isLoading: {
        show: false,
        text: null
    },
    room: {
        load: false,
        name: null
    },
    //导航菜单,默认是聊天室
    menu:{
        title:"边看边聊",
        type:"communit"
    },
    menuListData:[]

};

const getters = {
    getMenu: function (state) {
        return state.menu
    },
    getRoom: function (state) {
        return state.room
    },
    getLoading: function (state) {
        return state.isLoading
    },
    getMenuListData:function(state){
    	return state.menuListData
    }
}


const mutations = {
    openLoading: function (state, text) {
        state.isLoading.show = true,
        state.isLoading.text = text || 'loading'

    },
    closeLoading: function (state) {
        state.isLoading.show = false
    },
    setRoom: function (state, obj) {

        //修改或者维持原状
        if (obj.name) {
            state.room.name = obj.name
        }
        if (obj.load) {
            state.room.load = obj.load
        }
    },
    //点击菜单栏切换菜单内容组件
    setCurrentMenu: function (state, obj) {
        state.menu =obj
        console.log(state)

    },
    setMenuListData:function(state,obj){
    	state.menuListData=obj
    }

}

export default new Vuex.Store({
    state,
    getters,
    mutations
});
