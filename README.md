# btnsRights
按钮权限



用户登录系统后，后台返回当前用户所有的菜单和按钮数据，前端根据菜单中的href值和路由path比对，得出当前菜单中的按钮总数



main.js引入：

```js
import btnsRights from "utils/btnsRights";
Vue.prototype.$btnsRights = btnsRights;
```



用户登录系统获取权限数据后：

```js
//存储当前角色的所有权限
btnsRights.set(res.data.tree);
```



当前页面中使用时：

```js
<el-button class="newBtn" v-if="rights.includes('新增')">新增</el-button>

export default {
    created() {
        //使用限制： 页面中不能有created方法,且对应二级路由
        //使用方法： 在data中的return方法里面声明rights:[]，在按钮中使用rights.include('新增')等
        let href = this.$route.path.substr(1);
        href = href.includes('/') ? href.split('/')[0] : href;
        this.$btnsRights.currentRights(href).then(res => {
            if (res && res.length) this.rights = res;
        });
    },
}

```

