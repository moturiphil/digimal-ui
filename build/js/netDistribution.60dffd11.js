"use strict";(self["webpackChunkMassNetCampaign"]=self["webpackChunkMassNetCampaign"]||[]).push([[275],{21616:function(a,e,t){t.r(e),t.d(e,{FixedSidebar:function(){return l},SidebarWrap:function(){return i},TaskListWrap:function(){return o}});var s=t(23481);const i=s.ZP.div`
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
`,l=s.ZP.div`
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
`},91382:function(a,e,t){t.r(e),t.d(e,{default:function(){return O}});var s=t(66252),i=t(3577);const o={class:"sDash_taskApp-sidebar"},l={class:"sDash_taskApp-sidebar__nav"},n={class:"sDash_taskApp-sidebar__nav--item"},r={class:"nav-item-icon"},p=(0,s._)("span",{class:"nav-item-text"},"National",-1),d={class:"sDash_taskApp-sidebar__nav--item"},c={class:"nav-item-icon"},m=(0,s._)("span",{class:"nav-item-text"},"County",-1),h={class:"sDash_taskApp-sidebar__nav--item"},u={class:"nav-item-icon"},_=(0,s._)("span",{class:"nav-item-text"},"Sub-County",-1),g={class:"sDash_addTask-modal-inner"},k={class:"sDash-modal-actions"},x={class:"sDash_taskApp-sidebar"},b={class:"sDash_taskApp-sidebar__nav"},f={class:"sDash_taskApp-sidebar__nav--item"},v={class:"nav-item-icon"},y=(0,s._)("span",{class:"nav-item-text"},"National",-1),w={class:"sDash_taskApp-sidebar__nav--item"},D={class:"nav-item-icon"},W=(0,s._)("span",{class:"nav-item-text"},"County",-1),$={class:"sDash_taskApp-sidebar__nav--item"},C={class:"nav-item-icon"},A=(0,s._)("span",{class:"nav-item-text"},"Sub-County",-1),z={key:0,class:"sidebar-trier-wrap text-center mb-30"};function S(a,e,t,S,T,F){const M=(0,s.up)("sdFeatherIcons"),U=(0,s.up)("sdButton"),j=(0,s.up)("router-link"),B=(0,s.up)("SidebarWrap"),H=(0,s.up)("a-input"),Z=(0,s.up)("a-form-item"),N=(0,s.up)("a-textarea"),O=(0,s.up)("a-form"),P=(0,s.up)("BasicFormWrapper"),q=(0,s.up)("sdModal"),I=(0,s.up)("FixedSidebar"),L=(0,s.up)("a-col"),X=(0,s.up)("router-view"),E=(0,s.up)("a-row"),R=(0,s.up)("Main");return(0,s.wg)(),(0,s.j4)(R,null,{default:(0,s.w5)((()=>[(0,s.Wm)(E,{gutter:25},{default:(0,s.w5)((()=>[(0,s.Wm)(L,{xl:5,lg:6,md:7,xs:24},{default:(0,s.w5)((()=>[a.responsive>767?((0,s.wg)(),(0,s.iD)(s.HY,{key:0},[(0,s.Wm)(B,{class:"mb-30"},{default:(0,s.w5)((()=>[(0,s._)("div",o,[(0,s.Wm)(U,{class:"sDash_btn-add",size:"large",type:"success",raised:"",onClick:a.showModal},{default:(0,s.w5)((()=>[(0,s.Wm)(M,{type:"plus",size:"16"}),(0,s.Uk)(" Add Org Unit ")])),_:1},8,["onClick"]),(0,s._)("ul",l,[(0,s._)("li",n,[(0,s.Wm)(j,{class:"sDash_taskApp-sidebar__nav--link",to:`${a.path}/national`},{default:(0,s.w5)((()=>[(0,s._)("span",r,[(0,s.Wm)(M,{type:"edit",size:"16"})]),p])),_:1},8,["to"])]),(0,s._)("li",d,[(0,s.Wm)(j,{class:"sDash_taskApp-sidebar__nav--link",to:`${a.path}/county`},{default:(0,s.w5)((()=>[(0,s._)("span",c,[(0,s.Wm)(M,{type:"star",size:"16"})]),m])),_:1},8,["to"])]),(0,s._)("li",h,[(0,s.Wm)(j,{class:"sDash_taskApp-sidebar__nav--link",to:`${a.path}/sub-county`},{default:(0,s.w5)((()=>[(0,s._)("span",u,[(0,s.Wm)(M,{type:"check",size:"16"})]),_])),_:1},8,["to"])])])])])),_:1}),(0,s.Wm)(q,{title:"Add Task",class:"sDash_addTask-modal",type:a.modalType,visible:a.visible,footer:null,onCancel:a.handleCancel},{default:(0,s.w5)((()=>[(0,s._)("div",g,[(0,s.Wm)(P,null,{default:(0,s.w5)((()=>[(0,s.Wm)(O,{model:a.formState,name:"add-task",onFinish:a.handleAddTask,layout:a.formState.layout},{default:(0,s.w5)((()=>[(0,s.Wm)(Z,{name:"title"},{default:(0,s.w5)((()=>[(0,s.Wm)(H,{value:a.formState.title,"onUpdate:value":e[0]||(e[0]=e=>a.formState.title=e),placeholder:"Title"},null,8,["value"])])),_:1}),(0,s.Wm)(Z,{name:"description"},{default:(0,s.w5)((()=>[(0,s.Wm)(N,{value:a.formState.description,"onUpdate:value":e[1]||(e[1]=e=>a.formState.description=e),rows:4,placeholder:"Add Description"},null,8,["value"])])),_:1}),(0,s._)("div",k,[(0,s.Wm)(U,{size:"small",type:"light",key:"cancel",outlined:"",onClick:a.handleCancel},{default:(0,s.w5)((()=>[(0,s.Uk)(" Cancel ")])),_:1},8,["onClick"]),(0,s.Wm)(U,{htmlType:"submit",size:"small",type:"success",key:"submit"},{default:(0,s.w5)((()=>[(0,s.Uk)(" Add Org Unit ")])),_:1})])])),_:1},8,["model","onFinish","layout"])])),_:1})])])),_:1},8,["type","visible","onCancel"])],64)):((0,s.wg)(),(0,s.j4)(I,{key:1,class:(0,i.C_)(a.collapsed?"show":"hide")},{default:(0,s.w5)((()=>[(0,s._)("a",{to:"#",type:"link",class:"trigger-close",onClick:e[2]||(e[2]=(...e)=>a.toggleCollapsed&&a.toggleCollapsed(...e))},[(0,s.Wm)(M,{type:"x"})]),(0,s.Wm)(B,{class:"mb-30"},{default:(0,s.w5)((()=>[(0,s._)("div",x,[(0,s.Wm)(U,{class:"sDash_btn-add",size:"large",type:"primary",raised:"",onClick:a.showModal},{default:(0,s.w5)((()=>[(0,s.Wm)(M,{type:"plus",size:"16"}),(0,s.Uk)(" Add Org Unit ")])),_:1},8,["onClick"]),(0,s._)("ul",b,[(0,s._)("li",f,[(0,s.Wm)(j,{class:"sDash_taskApp-sidebar__nav--link",to:`${a.path}/national`},{default:(0,s.w5)((()=>[(0,s._)("span",v,[(0,s.Wm)(M,{type:"edit",size:"16"})]),y])),_:1},8,["to"])]),(0,s._)("li",w,[(0,s.Wm)(j,{class:"sDash_taskApp-sidebar__nav--link",to:`${a.path}/county`},{default:(0,s.w5)((()=>[(0,s._)("span",D,[(0,s.Wm)(M,{type:"star",size:"16"})]),W])),_:1},8,["to"])]),(0,s._)("li",$,[(0,s.Wm)(j,{class:"sDash_taskApp-sidebar__nav--link",to:`${a.path}/sub-county`},{default:(0,s.w5)((()=>[(0,s._)("span",C,[(0,s.Wm)(M,{type:"check",size:"16"})]),A])),_:1},8,["to"])])])])])),_:1})])),_:1},8,["class"]))])),_:1}),(0,s.Wm)(L,{xl:19,lg:18,md:17,xs:24},{default:(0,s.w5)((()=>[a.responsive<=767?((0,s.wg)(),(0,s.iD)("div",z,[(0,s.Wm)(U,{type:"link",class:"sidebar-trigger",style:{marginTop:0},onClick:a.toggleCollapsed},{default:(0,s.w5)((()=>[(0,s.Wm)(M,{type:a.collapsed?"align-left":"align-right"},null,8,["type"])])),_:1},8,["onClick"])])):(0,s.kq)("",!0),(0,s.Wm)(X,{name:"child"})])),_:1})])),_:1}),(0,s._)("span",{role:"button",tabIndex:"0",class:(0,i.C_)(a.collapsed?"overlay-dark show":"overlay-dark"),onClick:e[3]||(e[3]=(...e)=>a.toggleCollapsed&&a.toggleCollapsed(...e))},null,2)])),_:1})}t(57658);var T=t(21616),F=t(72984),M=t(33907),U=t(2262),j=t(22201);const B=(0,s.aZ)({name:"Task",components:{FixedSidebar:T.FixedSidebar,SidebarWrap:T.SidebarWrap,Main:F.Main,BasicFormWrapper:F.BasicFormWrapper},setup(){const{state:a,dispatch:e}=(0,M.oR)(),t=(0,s.Fl)((()=>a.task.data)),i=(0,U.iH)(0),o=(0,U.iH)(!1),l=(0,U.iH)(!1),n=(0,U.iH)("primary"),{matched:r}=(0,j.yj)(),{path:p}=r[1],d=()=>{l.value=!0,o.value=!1},c=()=>{l.value=!1},m=(0,U.qj)({title:"",description:"",layout:"vertical"}),h=a=>{c();const s=[];t.value.map((a=>s.push(a.id)));const i=Math.max(...s);e("taskAddData",[...t.value,{...a,id:i+1,favourite:!1,completed:!1}])};(0,s.m0)((()=>{function a(){const a=window.innerWidth;i.value=a}window.addEventListener("resize",a),a()}));const u=()=>{o.value=!o.value};return{taskData:t,responsive:i,collapsed:o,visible:l,modalType:n,showModal:d,handleCancel:c,handleAddTask:h,toggleCollapsed:u,formState:m,path:p}}});var H=B,Z=t(83744);const N=(0,Z.Z)(H,[["render",S]]);var O=N}}]);
//# sourceMappingURL=netDistribution.60dffd11.js.map