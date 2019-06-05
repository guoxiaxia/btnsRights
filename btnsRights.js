function BtnsRights() {
    //当前用户的所有权限
    this.btnsRights = [];
    //当前页面的按钮权限
    this.resultBtn = [];
}

BtnsRights.prototype = {
    set : function (data) {
        this.btnsRights = data;
    },
    get : function () {
        return this.btnsRights;
    },
    //根据路由path对应菜单href获取二级菜单下面的按钮权限,
    // 返回该页面所有权限的名称---数组形式
    currentRights: function (href) {
        this.resultBtn = [];
        return new Promise(resolve => {
            this.filterHref(this.btnsRights, href);
            resolve(this.resultBtn.map(ele => ele.title));
        })
    },
    //获取指定路由中的数据
    filterHref: function (data,href) {
        data.forEach(ele => {
            if(ele.href === href){
                this.resultBtn = ele.children;
            }else if(ele.children && ele.children.length){
                this.filterHref(ele.children, href);
            }
        })
    },
    // 返回该页面所有权限的数据---数组形式
    currentData: function (href) {
        return new Promise(resolve => {
            this.filterHref(this.btnsRights, href);
            resolve(this.resultBtn.map(ele => ele));
        })
    },
};

const btnsRights = new BtnsRights();
export default btnsRights;

//使用
// btnsRights.currentRights('Guser').then(res => {
//     console.log(res)
// });
