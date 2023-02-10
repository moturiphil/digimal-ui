"use strict";(self["webpackChunkMassNetCampaign"]=self["webpackChunkMassNetCampaign"]||[]).push([[8847],{91854:function(e,t,o){o.r(t),o.d(t,{Span:function(){return l},TodoStyleWrapper:function(){return d}});var a=o(23481);const l=a.ZP.span`
    &.active{
        color: ${({theme:e})=>e["primary-color"]};
        text-decoration: line-through;
    }
`,d=a.ZP.div`
    .ant-card-body{
        padding: 15px 0 25px !important
    }
    .ant-table{
        width: 100%;
        thead{
            display: none;
        }
        tbody{
            tr{
                position: relative;
                &:hover{
                    box-shadow: 0 15px 50px ${({theme:e})=>e["light-color"]}20;
                    td{
                        background-color: #fff;
                    }
                }
                td{
                    font-size: 14px;
                    color: ${({theme:e})=>e["gray-color"]};
                    line-height: .75;
                    &:first-child{
                        padding-left: 25px;
                        padding-right: 8px;
                        width: 48px;
                    }
                    &:last-child{
                        padding-right: 25px;
                    }
                    .ant-checkbox-wrapper{
                        padding-top: 3px;
                        &:hover{
                            &:after{
                                border-color: ${({theme:e})=>e["success-color"]};
                            }
                            .ant-checkbox-inner{
                                border-color: ${({theme:e})=>e["success-color"]};
                            }
                        }
                    }
                    .ant-checkbox-checked{
                        &:after{
                            border-color: ${({theme:e})=>e["success-color"]};
                        }
                    }
                    .ant-checkbox-checked .ant-checkbox-inner{
                        background-color: ${({theme:e})=>e["success-color"]};
                        border-color: ${({theme:e})=>e["success-color"]};
                    }
                    .todo-title{
                        min-width: 150px;
                        line-height: 1.5;
                    }
                }
            }
            .todos-action{
                min-width: 100px;
                text-align: right;
                svg,
                i,
                span{
                    color: #D8DCEB !important;
                }
                svg.feather-trash-2{
                    color: ${({theme:e})=>e["gray-color"]}
                }
                .star{
                    margin: 0 20px;
                    &.active{
                        svg,
                        i{
                            color: ${({theme:e})=>e["warning-color"]} !important;
                        }
                    }
                }
            }

        }
    }

    .new-todo-wrap{
        padding: 16px 25px 0;
        .btn-toDoAdd{
            font-size: 12px;
            font-weight: 500;
            height: 50px;
            padding: 0px 23.23px;
        }
    }
`},90857:function(e,t,o){o.r(t),o.d(t,{default:function(){return S}});var a=o(66252),l=o(3577);const d={class:"page-header-actions"},n={class:"ant-table-content"},r={class:"ant-table"},s={scope:"row"},i={class:"user-info"},c={class:"todos-action"},p=["onClick"],u=["onClick"],m={class:"new-todo-wrap"},h={class:"todo-modal"},f=(0,a._)("br",null,null,-1),g=(0,a._)("br",null,null,-1);function v(e,t,o,v,w,b){const y=(0,a.up)("sdCalendarButton"),k=(0,a.up)("sdExportButton"),W=(0,a.up)("sdShareButton"),x=(0,a.up)("sdFeatherIcons"),_=(0,a.up)("sdButton"),C=(0,a.up)("sdPageHeader"),T=(0,a.up)("a-checkbox"),D=(0,a.up)("draggable"),A=(0,a.up)("TableWrapper"),S=(0,a.up)("sdCards"),$=(0,a.up)("TodoStyleWrapper"),M=(0,a.up)("a-col"),z=(0,a.up)("a-row"),B=(0,a.up)("a-input"),H=(0,a.up)("a-form"),F=(0,a.up)("BasicFormWrapper"),N=(0,a.up)("sdModal"),U=(0,a.up)("Main");return(0,a.wg)(),(0,a.iD)(a.HY,null,[(0,a.Wm)(C,{title:"To Do"},{buttons:(0,a.w5)((()=>[(0,a._)("div",d,[(0,a.Wm)(y),(0,a.Wm)(k),(0,a.Wm)(W),(0,a.Wm)(_,{size:"small",type:"primary"},{default:(0,a.w5)((()=>[(0,a.Wm)(x,{type:"plus",size:"14"}),(0,a.Uk)(" Add New ")])),_:1})])])),_:1}),(0,a.Wm)(U,null,{default:(0,a.w5)((()=>[(0,a.Wm)(z,{gutter:30},{default:(0,a.w5)((()=>[(0,a.Wm)(M,{md:24},{default:(0,a.w5)((()=>[(0,a.Wm)($,null,{default:(0,a.w5)((()=>[(0,a.Wm)(S,{title:"Task Lists"},{default:(0,a.w5)((()=>[(0,a.Wm)(A,{class:"table-responsive"},{default:(0,a.w5)((()=>[(0,a._)("div",n,[(0,a._)("table",r,[(0,a.Wm)(D,{modelValue:e.myList,"onUpdate:modelValue":t[0]||(t[0]=t=>e.myList=t),tag:"tbody",group:"people",handle:".handle","item-key":"name"},{item:(0,a.w5)((({element:t})=>[(0,a._)("tr",null,[(0,a._)("td",null,[(0,a.Wm)(T,{onClick:()=>e.onSelectChange(t.key)},null,8,["onClick"])]),(0,a._)("td",s,[(0,a._)("div",i,(0,l.zw)(t.item),1)]),(0,a._)("td",null,[(0,a._)("div",c,[(0,a.Wm)(x,{classes:"handle",style:{cursor:"pointer",color:"#999"},type:"move"}),(0,a._)("a",{class:(0,l.C_)(t.favorite?"star active":"star"),onClick:()=>e.dispatch("onStarUpdate",{data:e.todoData,id:t.key}),to:"#"},[(0,a.Wm)(x,{type:"star",style:(0,l.j5)({color:t.favorite?"gold":"#888"}),size:16},null,8,["style"])],10,p),(0,a._)("a",{onClick:()=>e.onHandleDelete(t.key),to:"#"},[(0,a.Wm)(x,{type:"trash-2",size:"16"})],8,u)])])])])),_:1},8,["modelValue"])])])])),_:1}),(0,a._)("div",m,[(0,a.Wm)(_,{onClick:e.showModal,class:"btn-toDoAdd",transparented:"",type:"primary",size:"large"},{default:(0,a.w5)((()=>[(0,a.Uk)(" + Add New Task ")])),_:1},8,["onClick"])])])),_:1})])),_:1})])),_:1})])),_:1}),(0,a.Wm)(N,{type:"primary",title:"Add New Todo",visible:e.visible,footer:null,onCancel:e.handleCancel},{default:(0,a.w5)((()=>[(0,a._)("div",h,[(0,a.Wm)(F,null,{default:(0,a.w5)((()=>[(0,a.Wm)(H,{class:"adTodo-form",name:"todoAdd",model:e.formState,onFinish:e.onSubmitHandler},{default:(0,a.w5)((()=>[(0,a.Wm)(B,{value:e.formState.todoAdd,"onUpdate:value":t[1]||(t[1]=t=>e.formState.todoAdd=t),placeholder:"Input Item Name......."},null,8,["value"]),f,g,(0,a.Wm)(_,{onClick:e.showModal,htmlType:"submit",class:"btn-adTodo",type:"primary",size:"large"},{default:(0,a.w5)((()=>[(0,a.Uk)(" Add New ")])),_:1},8,["onClick"])])),_:1},8,["model","onFinish"])])),_:1})])])),_:1},8,["visible","onCancel"])])),_:1})],64)}o(57658);var w=o(91854),b=o(72984),y=o(33907),k=o(2262),W=o(9980),x=o.n(W);const _=[{title:"",dataIndex:"item"},{title:"",dataIndex:"action",width:120}],C=(0,a.aZ)({name:"ToDo",components:{TodoStyleWrapper:w.TodoStyleWrapper,Main:b.Main,TableWrapper:b.TableWrapper,BasicFormWrapper:b.BasicFormWrapper,draggable:x()},setup(){const{state:e,dispatch:t}=(0,y.oR)(),o=(0,a.Fl)((()=>e.todo.data)),l=(0,k.iH)(!1),d=(0,k.iH)([]),n=e=>{const a=o.value.filter((t=>t.key!==e));t("ToDoDeleteData",a)},r=(0,k.qj)({todoAdd:""}),s=e=>{if(d.value.includes(e)){const t=d.value.filter((t=>t!==e));d.value=t}else d.value.push(e)},i=()=>{const e=[];o.value.map((t=>e.push(t.key)));const a=Math.max(...e);""!==r.todoAdd?(t("ToDoAddData",[...o.value,{key:a+1,item:r.todoAdd,time:(new Date).getTime(),favorite:!1}]),r.todoAdd="",l.value=!1):alert("Please Give a Task Title...")},c=()=>{l.value=!0},p=()=>{l.value=!1},u=()=>{p()};return{handleCancel:u,onCancel:p,showModal:c,onSubmitHandler:i,onHandleDelete:n,onSelectChange:s,columns:_,formState:r,visible:l,dispatch:t,todoData:o,selectedRowKeys:d}},computed:{myList:{get(){return this.$store.state.todo.data},set(e){this.$store.dispatch("ToDoAddData",e)}}}});var T=C,D=o(83744);const A=(0,D.Z)(T,[["render",v]]);var S=A}}]);
//# sourceMappingURL=to-do.a51a05a9.js.map