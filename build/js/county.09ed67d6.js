"use strict";(self["webpackChunkMassNetCampaign"]=self["webpackChunkMassNetCampaign"]||[]).push([[533],{21616:function(t,e,a){a.r(e),a.d(e,{FixedSidebar:function(){return r},SidebarWrap:function(){return i},TaskListWrap:function(){return o}});var s=a(23481);const i=s.ZP.div`
    .sDash_taskApp-sidebar{
        background-color: #fff;
        padding: 30px;
        border-radius: 10px;
        box-shadow: 0 5px 20px rgba(${({theme:t})=>t["gray-color"]},.03);
        min-height: 300px;
        .sDash_btn-add{
            width: 100%;
            font-size: 14px;
            font-weight: 500;
            border-radius: 22px;
            height: 44px;
            margin-bottom: 20px;
        }
    }
    .sDash_taskApp-sidebar__nav{
        width: calc(100% + 30px);
        position: relative;
        ${({theme:t})=>t.rtl?"right":"left"}: -15px;
        .sDash_taskApp-sidebar__nav--item{
            display: block;
            .sDash_taskApp-sidebar__nav--link{
                display: flex;
                align-items: center;
                font-size: 14px;
                border-radius: 4px;
                color: ${({theme:t})=>t["gray-color"]};
                padding: 8px 15px;
                &:hover{
                    color: ${({theme:t})=>t["primary-color"]};
                    background-color: ${({theme:t})=>t["primary-color"]}10;
                    .nav-item-icon{
                        i,
                        svg{
                            color: ${({theme:t})=>t["primary-color"]};
                        }
                    }
                }
                &.active{
                    color: ${({theme:t})=>t["primary-color"]};
                    background-color: ${({theme:t})=>t["primary-color"]}10;
                    .nav-item-icon{
                        i,
                        svg{
                            color: ${({theme:t})=>t["primary-color"]};
                        }
                    }
                }
                .nav-item-icon{
                    line-height: 1;
                    ${({theme:t})=>t.rtl?"margin-left":"margin-right"}: 12px;
                    i,
                    svg{
                        width: 16px;
                        color: #ADB4D2;
                    }
                }
            }
        }
    }
`,o=s.ZP.div`
    .sDash_tasklist-wrap{
        background-color: #fff;
        border-radius: 10px;
        box-shadow: 0 5px 20px rgba(#9299B8,.03);
    }
    .sDash_tasklist-head{
        .sDash_task-list-title{
            font-size: 16px;
            font-weight: 500;
            padding: 15px 30px;
            margin-bottom: 0;
            border-bottom: 1px solid ${({theme:t})=>t["border-color-light"]};
        }
    }
    .sDash_tasklist-body{
        padding-bottom: 25px;
        .sDash_tasks{
            .sDash_tasks-item{
                display: flex;
                align-items: center;
                justify-content: space-between;
                padding: 15px 30px;
                &:not(:last-child){
                    border-bottom: 1px solid ${({theme:t})=>t["border-color-light"]};
                }
                @media only screen and (max-width: 575px){
                    padding: 15px 20px;
                    flex-direction: column;
                    align-items: flex-start;
                }
            }
            .sDash_tasks-item__title{
                font-size: 16px;
                margin-bottom: 10px;
                color: ${({theme:t})=>t["dark-color"]};
                .ant-checkbox + span{
                    ${({theme:t})=>t.rtl?"padding-right":"padding-left"}: 10px;
                }
                .ant-checkbox-wrapper{
                    &:hover{
                        .ant-checkbox-inner{
                            border-color: ${({theme:t})=>t["success-color"]};
                        }
                    }
                    .ant-checkbox-input{
                        &:focus + .ant-checkbox-inner{
                            border-color: ${({theme:t})=>t["success-color"]};
                        }
                    }
                    .ant-checkbox-inner{
                        width: 18px;
                        height: 18px;
                        &:after{
                            width: 5.51428571px;
                            height: 10px;
                            top: 45%;
                        }
                    }
                    .ant-checkbox-checked{
                        &:after{
                            border-color: ${({theme:t})=>t["success-color"]};
                        }
                        .ant-checkbox-inner{
                            background-color: ${({theme:t})=>t["success-color"]};
                            border-color: ${({theme:t})=>t["success-color"]};
                        }
                    }
                }
            }
            .sDash_tasks-item__text{
                p{
                    font-size: 12px;
                    font-weight: 400;
                    color: ${({theme:t})=>t["gray-color"]};
                    &:last-child{
                        margin-bottom: 0;
                    }
                }
            }
            .sDash_tasks-item__action{
                display: flex;
                align-items: center;
                @media only screen and (max-width: 575px){
                    margin-top: 20px;
                }
                svg,
                i{
                    color: ${({theme:t})=>t["extra-light-color"]};
                }
                .task-favourite{
                    line-height: 1;
                    ${({theme:t})=>t.rtl?"margin-left":"margin-right"}: 20px;
                    &.active{
                        svg,
                        i{
                            color: ${({theme:t})=>t["warning-color"]}; 
                        }
                    }
                }
                .ant-dropdown-trigger {
                    line-height: 1;
                }
                .task-favourite{
                    cursor: pointer;
                }
            }
        }
        .sDash_empty-task{
            min-height: 215px;
            display: flex;
            align-items: center;
            justify-content: center;
            span{
                font-size: 18px;
                font-weight: 500;
                color: ${({theme:t})=>t["light-color"]}; 
            }
        }
    }
`,r=s.ZP.div`
    position: fixed;
    top: 0;
    ${({theme:t})=>t.rtl?"right":"left"}: 0px;
    width: 280px;
    height: 100vh;
    z-index: 9999;
    background-color: #fff;
    overflow-y: auto;
    transition: all .3s ease;
    &.show{
        transform: translateX(0px);
    }
    &.hide{
        transform: translateX(-280px);
    }
    .trigger-close{
        float: right;
        margin-top: 15px;
        ${({theme:t})=>t.rtl?"margin-left":"margin-right"}: 15px;
        svg,
        i{
            color: ${({theme:t})=>t["danger-color"]}; 
        }
    }
    .sDash_taskApp-sidebar{
        padding-top: 60px;
    }
`},90893:function(t,e,a){a.r(e),a.d(e,{default:function(){return H}});var s=a(66252),i=a(3577);const o={class:"sDash_tasklist-wrap"},r=(0,s._)("div",{class:"sDash_tasklist-head"},[(0,s._)("h2",{class:"sDash_task-list-title"},"Net Distribution Lists")],-1),n={class:"sDash_tasklist-body"},l={key:0,class:"sDash_tasks"},c={class:"sDash_tasks-item__content"},d={class:"sDash_tasks-item__title"},p={class:"sDash_tasks-item__text"},h={class:"sDash_tasks-item__action"},m=["onClick"],g=["onClick"],k=(0,s._)("span",null,"Edit",-1),u=["onClick"],x=(0,s._)("span",null,"Delete",-1),_={to:"#"},f={key:1,class:"sDash_empty-task"},b=(0,s._)("span",null,"Sorry !! No Distribution Found :(",-1),v=[b],D={class:"sDash_addTask-modal-inner"};function w(t,e,a,b,w,y){const $=(0,s.up)("a-checkbox"),C=(0,s.up)("sdFeatherIcons"),W=(0,s.up)("sdDropdown"),z=(0,s.up)("BasicFormWrapper"),T=(0,s.up)("sdModal"),F=(0,s.up)("TaskListWrap");return(0,s.wg)(),(0,s.j4)(F,{class:"mb-30"},{default:(0,s.w5)((()=>[(0,s._)("div",o,[r,(0,s._)("div",n,[t.task.length>0?((0,s.wg)(),(0,s.iD)("ul",l,[((0,s.wg)(!0),(0,s.iD)(s.HY,null,(0,s.Ko)(t.task,((e,a)=>((0,s.wg)(),(0,s.iD)("li",{class:"sDash_tasks-item",key:a},[(0,s._)("div",c,[(0,s._)("div",d,[(0,s.Wm)($,{checked:!!e.completed,onChange:()=>t.dispatch(t.onCompleteUpdate(t.task,e.id))},{default:(0,s.w5)((()=>[(0,s.Uk)((0,i.zw)(e.title),1)])),_:2},1032,["checked","onChange"])]),(0,s._)("div",p,[(0,s._)("p",null,(0,i.zw)(e.description),1)])]),(0,s._)("div",h,[(0,s._)("a",{to:"#",class:(0,i.C_)(""+(e.favourite?"task-favourite active":"task-favourite")),onClick:()=>t.dispatch("onStarUpdate",{data:t.task,id:e.id})},[(0,s.Wm)(C,{type:"star",size:"14"})],10,m),(0,s.Wm)(W,null,{overlay:(0,s.w5)((()=>[(0,s._)("a",{to:"#",onClick:()=>t.showModal(e.id,e)},[(0,s.Wm)(C,{type:"edit",size:"14"}),k],8,g),(0,s._)("a",{to:"#",onClick:()=>t.handleTaskDelete(e.id)},[(0,s.Wm)(C,{type:"trash-2",size:"14"}),x],8,u)])),default:(0,s.w5)((()=>[(0,s._)("a",_,[(0,s.Wm)(C,{type:"more-vertical",size:"18"})])])),_:2},1024)])])))),128))])):((0,s.wg)(),(0,s.iD)("div",f,v))])]),(0,s.Wm)(T,{title:"Edit Task",class:"sDash_addTask-modal",type:"primary",visible:t.visible,footer:null,onCancel:t.handleCancel},{default:(0,s.w5)((()=>[(0,s._)("div",D,[((0,s.wg)(!0),(0,s.iD)(s.HY,null,(0,s.Ko)(t.task,((t,e)=>((0,s.wg)(),(0,s.j4)(z,{key:e})))),128))])])),_:1},8,["visible","onCancel"])])),_:1})}var y=a(2262),$=a(33907),C=a(72984),W=a(21616);const z=(0,s.aZ)({name:"Favorite",components:{BasicFormWrapper:C.BasicFormWrapper,TaskListWrap:W.TaskListWrap},setup(){const{state:t,dispatch:e}=(0,$.oR)(),a=(0,s.Fl)((()=>t.task.data.filter((t=>t.favourite)).sort(((t,e)=>e.id-t.id)))),i=(0,y.iH)(!1),o=(0,y.iH)(""),r=(0,y.iH)({}),n=(t,e)=>{o.value=t,i.value=!0,r.value=e},l=()=>{i.value=!1},c=t=>{const s=a.value.filter((e=>e.id!==t));e("ontaskDelete",s)},d=(t,s)=>{const o=a.value.map((e=>e.id===s?(e=t,e):e));i.value=!1,e("ontaskEdit",o)};return{task:a,visible:i,taskEditId:o,editableItem:r,showModal:n,handleCancel:l,handleTaskDelete:c,onEditHandle:d}}});var T=z,F=a(83744);const A=(0,F.Z)(T,[["render",w]]);var H=A}}]);
//# sourceMappingURL=county.09ed67d6.js.map