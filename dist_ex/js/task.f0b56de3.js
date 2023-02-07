"use strict";(self["webpackChunkMassNetCampaign"]=self["webpackChunkMassNetCampaign"]||[]).push([[930],{28078:function(a,e,t){t.r(e),t.d(e,{FixedSidebar:function(){return o},SidebarWrap:function(){return i},TaskListWrap:function(){return l}});var s=t(23481);const i=s.ZP.div`
    .sDash_taskApp-sidebar{
        background-color: #fff;
        padding: 30px;
        border-radius: 10px;
        box-shadow: 0 5px 20px rgba(${({theme:a})=>a["gray-color"]},.03);
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
        ${({theme:a})=>a.rtl?"right":"left"}: -15px;
        .sDash_taskApp-sidebar__nav--item{
            display: block;
            .sDash_taskApp-sidebar__nav--link{
                display: flex;
                align-items: center;
                font-size: 14px;
                border-radius: 4px;
                color: ${({theme:a})=>a["gray-color"]};
                padding: 8px 15px;
                &:hover{
                    color: ${({theme:a})=>a["primary-color"]};
                    background-color: ${({theme:a})=>a["primary-color"]}10;
                    .nav-item-icon{
                        i,
                        svg{
                            color: ${({theme:a})=>a["primary-color"]};
                        }
                    }
                }
                &.active{
                    color: ${({theme:a})=>a["primary-color"]};
                    background-color: ${({theme:a})=>a["primary-color"]}10;
                    .nav-item-icon{
                        i,
                        svg{
                            color: ${({theme:a})=>a["primary-color"]};
                        }
                    }
                }
                .nav-item-icon{
                    line-height: 1;
                    ${({theme:a})=>a.rtl?"margin-left":"margin-right"}: 12px;
                    i,
                    svg{
                        width: 16px;
                        color: #ADB4D2;
                    }
                }
            }
        }
    }
`,l=s.ZP.div`
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
            border-bottom: 1px solid ${({theme:a})=>a["border-color-light"]};
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
                    border-bottom: 1px solid ${({theme:a})=>a["border-color-light"]};
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
                color: ${({theme:a})=>a["dark-color"]};
                .ant-checkbox + span{
                    ${({theme:a})=>a.rtl?"padding-right":"padding-left"}: 10px;
                }
                .ant-checkbox-wrapper{
                    &:hover{
                        .ant-checkbox-inner{
                            border-color: ${({theme:a})=>a["success-color"]};
                        }
                    }
                    .ant-checkbox-input{
                        &:focus + .ant-checkbox-inner{
                            border-color: ${({theme:a})=>a["success-color"]};
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
                            border-color: ${({theme:a})=>a["success-color"]};
                        }
                        .ant-checkbox-inner{
                            background-color: ${({theme:a})=>a["success-color"]};
                            border-color: ${({theme:a})=>a["success-color"]};
                        }
                    }
                }
            }
            .sDash_tasks-item__text{
                p{
                    font-size: 12px;
                    font-weight: 400;
                    color: ${({theme:a})=>a["gray-color"]};
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
                    color: ${({theme:a})=>a["extra-light-color"]};
                }
                .task-favourite{
                    line-height: 1;
                    ${({theme:a})=>a.rtl?"margin-left":"margin-right"}: 20px;
                    &.active{
                        svg,
                        i{
                            color: ${({theme:a})=>a["warning-color"]}; 
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
                color: ${({theme:a})=>a["light-color"]}; 
            }
        }
    }
`,o=s.ZP.div`
    position: fixed;
    top: 0;
    ${({theme:a})=>a.rtl?"right":"left"}: 0px;
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
        ${({theme:a})=>a.rtl?"margin-left":"margin-right"}: 15px;
        svg,
        i{
            color: ${({theme:a})=>a["danger-color"]}; 
        }
    }
    .sDash_taskApp-sidebar{
        padding-top: 60px;
    }
`},25846:function(a,e,t){t.r(e),t.d(e,{default:function(){return q}});var s=t(66252),i=t(3577);const l={class:"page-header-actions"},o={class:"sDash_taskApp-sidebar"},r={class:"sDash_taskApp-sidebar__nav"},n={class:"sDash_taskApp-sidebar__nav--item"},p={class:"nav-item-icon"},d=(0,s._)("span",{class:"nav-item-text"},"All",-1),c={class:"sDash_taskApp-sidebar__nav--item"},m={class:"nav-item-icon"},h=(0,s._)("span",{class:"nav-item-text"},"Favorite",-1),u={class:"sDash_taskApp-sidebar__nav--item"},_={class:"nav-item-icon"},g=(0,s._)("span",{class:"nav-item-text"},"Completed",-1),k={class:"sDash_addTask-modal-inner"},x={class:"sDash-modal-actions"},f={class:"sDash_taskApp-sidebar"},v={class:"sDash_taskApp-sidebar__nav"},b={class:"sDash_taskApp-sidebar__nav--item"},w={class:"nav-item-icon"},y=(0,s._)("span",{class:"nav-item-text"},"All",-1),W={class:"sDash_taskApp-sidebar__nav--item"},D={class:"nav-item-icon"},A=(0,s._)("span",{class:"nav-item-text"},"Favorite",-1),$={class:"sDash_taskApp-sidebar__nav--item"},C={class:"nav-item-icon"},z=(0,s._)("span",{class:"nav-item-text"},"Completed",-1),S={key:0,class:"sidebar-trier-wrap text-center mb-30"};function T(a,e,t,T,F,M){const B=(0,s.up)("sdCalendarButton"),H=(0,s.up)("sdExportButton"),U=(0,s.up)("sdShareButton"),j=(0,s.up)("sdFeatherIcons"),Z=(0,s.up)("sdButton"),P=(0,s.up)("sdPageHeader"),N=(0,s.up)("router-link"),q=(0,s.up)("SidebarWrap"),E=(0,s.up)("a-input"),I=(0,s.up)("a-form-item"),L=(0,s.up)("a-textarea"),X=(0,s.up)("a-form"),Y=(0,s.up)("BasicFormWrapper"),R=(0,s.up)("sdModal"),G=(0,s.up)("FixedSidebar"),J=(0,s.up)("a-col"),K=(0,s.up)("router-view"),O=(0,s.up)("a-row"),Q=(0,s.up)("Main");return(0,s.wg)(),(0,s.iD)(s.HY,null,[(0,s.Wm)(P,{title:"Task"},{buttons:(0,s.w5)((()=>[(0,s._)("div",l,[(0,s.Wm)(B),(0,s.Wm)(H),(0,s.Wm)(U),(0,s.Wm)(Z,{size:"small",type:"primary"},{default:(0,s.w5)((()=>[(0,s.Wm)(j,{type:"plus",size:"14"}),(0,s.Uk)(" Add New ")])),_:1})])])),_:1}),(0,s.Wm)(Q,null,{default:(0,s.w5)((()=>[(0,s.Wm)(O,{gutter:25},{default:(0,s.w5)((()=>[(0,s.Wm)(J,{xl:5,lg:6,md:7,xs:24},{default:(0,s.w5)((()=>[a.responsive>767?((0,s.wg)(),(0,s.iD)(s.HY,{key:0},[(0,s.Wm)(q,{class:"mb-30"},{default:(0,s.w5)((()=>[(0,s._)("div",o,[(0,s.Wm)(Z,{class:"sDash_btn-add",size:"large",type:"primary",raised:"",onClick:a.showModal},{default:(0,s.w5)((()=>[(0,s.Wm)(j,{type:"plus",size:"16"}),(0,s.Uk)(" Add Task ")])),_:1},8,["onClick"]),(0,s._)("ul",r,[(0,s._)("li",n,[(0,s.Wm)(N,{class:"sDash_taskApp-sidebar__nav--link",to:`${a.path}/all`},{default:(0,s.w5)((()=>[(0,s._)("span",p,[(0,s.Wm)(j,{type:"edit",size:"16"})]),d])),_:1},8,["to"])]),(0,s._)("li",c,[(0,s.Wm)(N,{class:"sDash_taskApp-sidebar__nav--link",to:`${a.path}/favorites`},{default:(0,s.w5)((()=>[(0,s._)("span",m,[(0,s.Wm)(j,{type:"star",size:"16"})]),h])),_:1},8,["to"])]),(0,s._)("li",u,[(0,s.Wm)(N,{class:"sDash_taskApp-sidebar__nav--link",to:`${a.path}/completed`},{default:(0,s.w5)((()=>[(0,s._)("span",_,[(0,s.Wm)(j,{type:"check",size:"16"})]),g])),_:1},8,["to"])])])])])),_:1}),(0,s.Wm)(R,{title:"Add Task",class:"sDash_addTask-modal",type:a.modalType,visible:a.visible,footer:null,onCancel:a.handleCancel},{default:(0,s.w5)((()=>[(0,s._)("div",k,[(0,s.Wm)(Y,null,{default:(0,s.w5)((()=>[(0,s.Wm)(X,{model:a.formState,name:"add-task",onFinish:a.handleAddTask,layout:a.formState.layout},{default:(0,s.w5)((()=>[(0,s.Wm)(I,{name:"title"},{default:(0,s.w5)((()=>[(0,s.Wm)(E,{value:a.formState.title,"onUpdate:value":e[0]||(e[0]=e=>a.formState.title=e),placeholder:"Title"},null,8,["value"])])),_:1}),(0,s.Wm)(I,{name:"description"},{default:(0,s.w5)((()=>[(0,s.Wm)(L,{value:a.formState.description,"onUpdate:value":e[1]||(e[1]=e=>a.formState.description=e),rows:4,placeholder:"Add Description"},null,8,["value"])])),_:1}),(0,s._)("div",x,[(0,s.Wm)(Z,{size:"small",type:"light",key:"cancel",outlined:"",onClick:a.handleCancel},{default:(0,s.w5)((()=>[(0,s.Uk)(" Cancel ")])),_:1},8,["onClick"]),(0,s.Wm)(Z,{htmlType:"submit",size:"small",type:"primary",key:"submit"},{default:(0,s.w5)((()=>[(0,s.Uk)(" Add Task ")])),_:1})])])),_:1},8,["model","onFinish","layout"])])),_:1})])])),_:1},8,["type","visible","onCancel"])],64)):((0,s.wg)(),(0,s.j4)(G,{key:1,class:(0,i.C_)(a.collapsed?"show":"hide")},{default:(0,s.w5)((()=>[(0,s._)("a",{to:"#",type:"link",class:"trigger-close",onClick:e[2]||(e[2]=(...e)=>a.toggleCollapsed&&a.toggleCollapsed(...e))},[(0,s.Wm)(j,{type:"x"})]),(0,s.Wm)(q,{class:"mb-30"},{default:(0,s.w5)((()=>[(0,s._)("div",f,[(0,s.Wm)(Z,{class:"sDash_btn-add",size:"large",type:"primary",raised:"",onClick:a.showModal},{default:(0,s.w5)((()=>[(0,s.Wm)(j,{type:"plus",size:"16"}),(0,s.Uk)(" Add Task ")])),_:1},8,["onClick"]),(0,s._)("ul",v,[(0,s._)("li",b,[(0,s.Wm)(N,{class:"sDash_taskApp-sidebar__nav--link",to:`${a.path}/all`},{default:(0,s.w5)((()=>[(0,s._)("span",w,[(0,s.Wm)(j,{type:"edit",size:"16"})]),y])),_:1},8,["to"])]),(0,s._)("li",W,[(0,s.Wm)(N,{class:"sDash_taskApp-sidebar__nav--link",to:`${a.path}/favorites`},{default:(0,s.w5)((()=>[(0,s._)("span",D,[(0,s.Wm)(j,{type:"star",size:"16"})]),A])),_:1},8,["to"])]),(0,s._)("li",$,[(0,s.Wm)(N,{class:"sDash_taskApp-sidebar__nav--link",to:`${a.path}/completed`},{default:(0,s.w5)((()=>[(0,s._)("span",C,[(0,s.Wm)(j,{type:"check",size:"16"})]),z])),_:1},8,["to"])])])])])),_:1})])),_:1},8,["class"]))])),_:1}),(0,s.Wm)(J,{xl:19,lg:18,md:17,xs:24},{default:(0,s.w5)((()=>[a.responsive<=767?((0,s.wg)(),(0,s.iD)("div",S,[(0,s.Wm)(Z,{type:"link",class:"sidebar-trigger",style:{marginTop:0},onClick:a.toggleCollapsed},{default:(0,s.w5)((()=>[(0,s.Wm)(j,{type:a.collapsed?"align-left":"align-right"},null,8,["type"])])),_:1},8,["onClick"])])):(0,s.kq)("",!0),(0,s.Wm)(K,{name:"child"})])),_:1})])),_:1}),(0,s._)("span",{role:"button",tabIndex:"0",class:(0,i.C_)(a.collapsed?"overlay-dark show":"overlay-dark"),onClick:e[3]||(e[3]=(...e)=>a.toggleCollapsed&&a.toggleCollapsed(...e))},null,2)])),_:1})],64)}t(57658);var F=t(28078),M=t(72984),B=t(33907),H=t(2262),U=t(22201);const j=(0,s.aZ)({name:"Task",components:{FixedSidebar:F.FixedSidebar,SidebarWrap:F.SidebarWrap,Main:M.Main,BasicFormWrapper:M.BasicFormWrapper},setup(){const{state:a,dispatch:e}=(0,B.oR)(),t=(0,s.Fl)((()=>a.task.data)),i=(0,H.iH)(0),l=(0,H.iH)(!1),o=(0,H.iH)(!1),r=(0,H.iH)("primary"),{matched:n}=(0,U.yj)(),{path:p}=n[1],d=()=>{o.value=!0,l.value=!1},c=()=>{o.value=!1},m=(0,H.qj)({title:"",description:"",layout:"vertical"}),h=a=>{c();const s=[];t.value.map((a=>s.push(a.id)));const i=Math.max(...s);e("taskAddData",[...t.value,{...a,id:i+1,favourite:!1,completed:!1}])};(0,s.m0)((()=>{function a(){const a=window.innerWidth;i.value=a}window.addEventListener("resize",a),a()}));const u=()=>{l.value=!l.value};return{taskData:t,responsive:i,collapsed:l,visible:o,modalType:r,showModal:d,handleCancel:c,handleAddTask:h,toggleCollapsed:u,formState:m,path:p}}});var Z=j,P=t(83744);const N=(0,P.Z)(Z,[["render",T]]);var q=N}}]);
//# sourceMappingURL=task.f0b56de3.js.map