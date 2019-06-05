import router from './router'
import {routesAll} from './router/index'
import {Message} from 'element-ui'
import store from 'store/store'
import {getToken} from '@/utils/token'
import {leftMenu} from '@/api/system'
import btnsRights from "utils/btnsRights";


// 导航守卫（路由跳转前验证登录）
router.beforeEach((to, from, next) => {
    if (to.path === '/login' || to.path === '/android/distinguish') {
        next();
    } else {
        if (getToken()) {
            if (!store.getters.addRouters.length) {
                leftMenu({roleId:store.getters.user.roleId}).then(res => {
                    if (res.data && res.data.tree && res.data.tree.length) {
                        const asyncRouters = handleRouters(routesAll, res.data.tree, []);
                        //确保当前路由均已加载完毕
                        asyncRouters.push({path: "*", redirect: "/login"},);
                        store.commit('SET_ROUTERS', asyncRouters);
                        router.addRoutes(store.getters.addRouters);
                        //存储当前角色的所有权限
                        btnsRights.set(res.data.tree);
                        next({...to, replace: true});
                    } else {
                        Message.error(res.msg)
                    }
                }).catch(err => {
                    store.dispatch('LogOut').then(() => {
                        Message.error(err || '连接失败，请重新登录！')
                        next({redirect: "/login"})
                    })
                });
            } else {
                next();
            }
        }else {
            router.push('/login');
        }
    }
});

//参数：route 路由表  data 菜单数据 routers存储数组
function handleRouters(route, data, routers) {
    route.forEach(item => {
        let path = item.path;
        if (item.path.indexOf('/') > -1) {
            path = item.path.split('/')[1];
        }
        data.forEach((ele) => {
            if (ele.href && ele.href === path) {
                if (item.children && item.children.length && ele.children && ele.children.length) {
                    //当前是菜单权限时
                    if(ele.children[0].href){
                        routers.push({...item, name: ele.title, iconName: ele.icon, children: []});
                        let index = findIndex(routers, item);
                        handleRouters(item.children, ele.children, routers[index].children)
                    }else{
                        //当前是按钮权限时，直接添加当前完整的路由信息
                        routers.push({...item, name: ele.title, iconName: ele.icon});
                    }
                } else {
                    routers.push({...item, name: ele.title, iconName: ele.icon});
                }
            }
        })
    });
    return routers;
}

function findIndex(arr, ele) {
    let index = 0;
    arr.forEach((e, i) => {
        if (e.path === ele.path) {
            index = i;
        }
    });
    return index;
}

