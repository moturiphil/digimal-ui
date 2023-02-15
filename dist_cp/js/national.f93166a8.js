"use strict";(self["webpackChunkMassNetCampaign"]=self["webpackChunkMassNetCampaign"]||[]).push([[604],{21616:function(t,e,a){a.r(e),a.d(e,{FixedSidebar:function(){return l},SidebarWrap:function(){return s},TaskListWrap:function(){return o}});var i=a(23481);const s=i.ZP.div`
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
`,o=i.ZP.div`
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
`,l=i.ZP.div`
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
`},67075:function(t,e,a){a.r(e),a.d(e,{default:function(){return A}});var i=a(66252),s=a(3577);const o={class:"sDash_tasklist-wrap"},l=(0,i._)("div",{class:"sDash_tasklist-head"},[(0,i._)("h2",{class:"sDash_task-list-title"},"Net Distribution List")],-1),r={class:"sDash_tasklist-body"},n={key:0,class:"sDash_tasks"},d={class:"sDash_tasks-item__content"},c={class:"sDash_tasks-item__title"},p={class:"sDash_tasks-item__text"},m={class:"sDash_tasks-item__action"},h=["onClick"],u=["onClick"],k=(0,i._)("span",null,"Edit",-1),f=["onClick"],g=(0,i._)("span",null,"Delete",-1),_={to:"#"},x={key:1,class:"sDash_empty-task"},v=(0,i._)("span",null,"Sorry !! No Distibutuib Found :(",-1),b=[v],w={class:"sDash_addTask-modal-inner"},D={class:"sDash-modal-actions"};function y(t,e,a,v,y,W){const $=(0,i.up)("a-checkbox"),C=(0,i.up)("sdFeatherIcons"),z=(0,i.up)("sdDropdown"),S=(0,i.up)("a-input"),T=(0,i.up)("a-form-item"),F=(0,i.up)("a-textarea"),U=(0,i.up)("sdButton"),A=(0,i.up)("a-form"),B=(0,i.up)("BasicFormWrapper"),E=(0,i.up)("sdModal"),H=(0,i.up)("TaskListWrap");return(0,i.wg)(),(0,i.j4)(H,{class:"mb-30"},{default:(0,i.w5)((()=>[(0,i._)("div",o,[l,(0,i._)("div",r,[t.task.length>0?((0,i.wg)(),(0,i.iD)("ul",n,[((0,i.wg)(!0),(0,i.iD)(i.HY,null,(0,i.Ko)(t.task,((e,a)=>((0,i.wg)(),(0,i.iD)("li",{class:"sDash_tasks-item",key:a},[(0,i._)("div",d,[(0,i._)("div",c,[(0,i.Wm)($,{checked:!!e.completed,onChange:()=>t.dispatch("onCompleteUpdate",{data:t.task,id:e.id})},{default:(0,i.w5)((()=>[(0,i.Uk)((0,s.zw)(e.title),1)])),_:2},1032,["checked","onChange"])]),(0,i._)("div",p,[(0,i._)("p",null,(0,s.zw)(e.description),1)])]),(0,i._)("div",m,[(0,i._)("a",{to:"#",class:(0,s.C_)(""+(e.favourite?"task-favourite active":"task-favourite")),onClick:()=>t.dispatch("onStarUpdate",{data:t.task,id:e.id})},[(0,i.Wm)(C,{type:"star",size:"14"})],10,h),(0,i.Wm)(z,null,{overlay:(0,i.w5)((()=>[(0,i._)("a",{to:"#",onClick:()=>t.showModal(e.id,e)},[(0,i.Wm)(C,{type:"edit",size:"14"}),k],8,u),(0,i._)("a",{to:"#",onClick:()=>t.handleTaskDelete(e.id)},[(0,i.Wm)(C,{type:"trash-2",size:"14"}),g],8,f)])),default:(0,i.w5)((()=>[(0,i._)("a",_,[(0,i.Wm)(C,{type:"more-vertical",size:"18"})])])),_:2},1024)])])))),128))])):((0,i.wg)(),(0,i.iD)("div",x,b))])]),(0,i.Wm)(E,{title:"Edit Task",class:"sDash_addTask-modal",type:"primary",visible:t.visible,footer:null,onCancel:t.handleCancel},{default:(0,i.w5)((()=>[(0,i._)("div",w,[(0,i.Wm)(B,null,{default:(0,i.w5)((()=>[(0,i.Wm)(A,{name:"add-task",model:t.formState,onFinish:t.onEditHandle},{default:(0,i.w5)((()=>[(0,i.Wm)(T,{name:"title"},{default:(0,i.w5)((()=>[(0,i.Wm)(S,{value:t.formState.title,"onUpdate:value":e[0]||(e[0]=e=>t.formState.title=e),placeholder:"Title"},null,8,["value"])])),_:1}),(0,i.Wm)(T,{name:"description"},{default:(0,i.w5)((()=>[(0,i.Wm)(F,{rows:4,value:t.formState.description,"onUpdate:value":e[1]||(e[1]=e=>t.formState.description=e),placeholder:"Add Description"},null,8,["value"])])),_:1}),(0,i.Wm)(T,{hidden:"true",name:"favourite"},{default:(0,i.w5)((()=>[(0,i.Wm)(S,{value:t.formState.favourite,"onUpdate:value":e[2]||(e[2]=e=>t.formState.favourite=e)},null,8,["value"])])),_:1}),(0,i.Wm)(T,{hidden:"true",name:"completed"},{default:(0,i.w5)((()=>[(0,i.Wm)(S,{value:t.formState.completed,"onUpdate:value":e[3]||(e[3]=e=>t.formState.completed=e)},null,8,["value"])])),_:1}),(0,i._)("div",D,[(0,i.Wm)(U,{size:"small",type:"white",key:"cancel",outlined:"",onClick:t.handleCancel},{default:(0,i.w5)((()=>[(0,i.Uk)(" Cancel ")])),_:1},8,["onClick"]),(0,i.Wm)(U,{htmlType:"submit",size:"small",type:"primary",key:"submit"},{default:(0,i.w5)((()=>[(0,i.Uk)(" Submit ")])),_:1})])])),_:1},8,["model","onFinish"])])),_:1})])])),_:1},8,["visible","onCancel"])])),_:1})}var W=a(2262),$=a(33907),C=a(72984),z=a(21616);const S={name:"All",components:{BasicFormWrapper:C.BasicFormWrapper,TaskListWrap:z.TaskListWrap},setup(){const{state:t,dispatch:e}=(0,$.oR)(),a=(0,i.Fl)((()=>t.task.data.sort(((t,e)=>e.id-t.id)))),s=(0,W.iH)(!1),o=(0,W.iH)(""),l=(0,W.iH)({});let r=(0,W.qj)({title:"",description:"",favourite:"",completed:"",id:""});const n=(t,e)=>{console.log(e),o.value=t,s.value=!0,l.value=e,r.title=e.title,r.description=e.description,r.favourite=e.favourite,r.completed=e.completed,r.id=t},d=()=>{s.value=!1},c=t=>{const i=a.value.filter((e=>e.id!==t));e("ontaskDelete",i)},p=t=>{const i=a.value.map((e=>e.id===r.id?(e=t,e):e));s.value=!1,e("ontaskEdit",i)};return{task:a,visible:s,taskEditId:o,editableItem:l,showModal:n,handleCancel:d,handleTaskDelete:c,onEditHandle:p,dispatch:e,formState:r}}};var T=S,F=a(83744);const U=(0,F.Z)(T,[["render",y]]);var A=U}}]);
//# sourceMappingURL=national.f93166a8.js.map