"use strict";(self["webpackChunkMassNetCampaign"]=self["webpackChunkMassNetCampaign"]||[]).push([[6381],{67125:function(e,t,n){n.r(t),n.d(t,{BackShadow:function(){return r},ChecklistWrap:function(){return i},KanvanBoardWrap:function(){return o}});var a=n(23481);const o=a.ZP.div`
.ant-card-body{
  min-height: 600px;
}
  h1{
    margin-bottom: 20px;
  }
  .sDash_kanban-board-list{
    display: flex;
    margin: -10px;
    flex-wrap: wrap;
    .sDash_kanban-board-item{
      flex: 0 0 20%;
      padding: 10px;
      max-height: 400px;
      margin-bottom: 30px;
      @media only screen and (max-width: 1599px){
        flex: 0 0 25%;
      }
      @media only screen and (max-width: 1399px){
        flex: 0 0 33.333%;
      }
      @media only screen and (max-width: 767px){
        flex: 0 0 50%;
      }
      @media only screen and (max-width: 575px){
        flex: 0 0 100%;
      }
      .ps{
        max-height: 400px;
        height: auto;
      }
      .sDash_kanban-board-item-scrolable{
        border-radius: 5px;
        background-color: ${({theme:e})=>e["bg-color-normal"]};
      }
      .sDash_addTask-control{
        padding-bottom: 20px;
        &.add-task-on{
          .sDash_addTask-from{
            display: block;
          }
          .btn-addTask{
            display: none;
          }
        }
        .sDash_addTask-from{
          padding: 0 20px 20px;
          display: none;
        }
        .sDash_addTask-input{
          padding: 10px;
          border-radius: 4px;
          background-color: #fff;
          width: 100%;
          height: 38px;
          border: 1px solid ${({theme:e})=>e["border-color-normal"]};
          &:focus{
            outline: none;
          }
        }
        .sDash_addTask-action{
          margin-top: 10px;
          display: flex;
          align-items: center;
          .add-column{
            ${({theme:e})=>e.rtl?"margin-left":"margin-right"}: 15px;
          }
          a{
            line-height: 1;
          }
          svg,
          i{
            color: ${({theme:e})=>e["gray-color"]};
          }
        }
      }
    }
    .btn-addColumn{
      flex: 0 0 20%;
      @media only screen and (max-width: 1599px){
        flex: 0 0 25%;
      }
      @media only screen and (max-width: 1399px){
        flex: 0 0 33.333%;
      }
      @media only screen and (max-width: 767px){
        flex: 0 0 50%;
      }
      @media only screen and (max-width: 575px){
        flex: 0 0 100%;
      }
    }
    .sDash_kanban-board-item__header{
      padding: 18px 20px 10px 20px;
      position: relative;
      &.editable{
        .list-header-title{
          display: none;
        }
        .title-edit{
          display: block;
          height: 60px;
          border-color: ${({theme:e})=>e["primary-color"]};
        }
      }
      .title-edit{
        width: 100%;
        padding: 0 15px;
        border: 1px solid #E3E6EF;
        height: 40px;
        line-height: 38px;
        border-radius: 4px;
        resize: none;
        display: none;
        transition: height .3s ease;
        &:focus{
          outline: none;
        }
      }
      .list-header-target{
        cursor: pointer;
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
      }
      .list-header-title{
        font-size: 15px;
        font-weight: 500;
        display:  flex;
        justify-content: space-between;
        .btn-more{
          padding: 0 4px;
          color: #868EAE;
          line-height: 1;
          position: relative;
          z-index: 22;
          svg,
          img{
            width: 20px;
            height: 20px;
          }
        }
        & > span{
          display: inline-flex;
          align-items: center;
          i{
            ${({theme:e})=>e.rtl?"padding-left":"padding-right"}: 8px;
          }
        }
      }
    }
    .sDash_kanvan-task{
      padding: 0 20px 0 20px;
    }
    .sDash_kanvan-task__single{
      position: relative;
      min-height: 48px;
      padding: 12px 15px;
      background-color: #fff;
      box-shadow: 0 0 5px #9299BB10;
      border-radius: 4px;
      margin-bottom: 10px;
      cursor: pointer;
      &:hover{
        .sDash_kanvan-task__title{
          .btn-edit{
            line-height: 1;
            opacity: 1;
            visibility: visible;
            pointer-events: auto;
          }
        }
      }
      .sDash_kanvan-task__title{
        font-size: 15px;
        font-weight: 500;
        margin: 0 5px 0 0;
        display: flex;
        justify-content: space-between;
        a{
          color: ${({theme:e})=>e["gray-color"]};
        }
        .btn-edit{
          display: flex;
          align-items: center;
          opacity: 0;
          visibility: hidden;
          pointer-events: none;
          svg,
          img{
            width: 14px;
            height: 14px;
            color: ${({theme:e})=>e["gray-color"]};
          }
        }
      }
      .sDash_kanvan-task__edit{
        display: none;
      }
      .sDash_kanvan-task__editable{
        position: relative;
        .sDash_kanvan-task__edit{
          display: flex;
          position: absolute;
          ${({theme:e})=>e.rtl?"right":"left"}: -30px;
          top: -10px;
          z-index: 99999;
          width: calc(100% + 60px);
          border-radius: 4px;
          input{
            min-height: 58px;
          }
          button{
            padding: 0px 21.71px;
            height: 38px;
          }
          .sDash_kanvan-task__edit--right{
            .btn-delete{
              font-size: 12px;
              ${({theme:e})=>e.rtl?"margin-right":"margin-left"}: 6px;
              white-space: nowrap;
              background-color: ${({theme:e})=>e["dark-color"]};
              line-height: 2.6;
              display: flex;
              align-items: center;
              border-radius: 5px;
              padding: 0 8px;
              color: #fff;
              i,
              svg{
                color: #fff;
                ${({theme:e})=>e.rtl?"margin-left":"margin-right"}: 4px;
              }
            }
          }
        }
        .edit-kanban-task{
          margin-top: 10px;
        }
      }
    }

    .btn-addTask{
      display: inline-block;
      width: calc(100% - 40px);
      padding: 8px 0;
      text-align: center;
      border-radius: 4px;
      position: relative;
      ${({theme:e})=>e.rtl?"right":"left"}: 20px;
      color: ${({theme:e})=>e["gray-color"]};
      background-color: ${({theme:e})=>e["border-color-normal"]};
      svg,
      i,
      img{
        ${({theme:e})=>e.rtl?"margin-left":"margin-right"}: 3px;
        color: ${({theme:e})=>e["gray-color"]};
      }
    }
    .btn-addColumn{
      padding: 10px;
      &.add-column-on{
        .btn-addColumn-inner{
          .btn-add{
            display: none;
          }
          .btn-addColumn-form{
            display: block;
          }
        }
      }
      .btn-add{
        display: block;
        width: 100%;
        height: fit-content;
        border-radius: 5px;
        padding: 12px 20px;
        background-color: #F4F5F7;
        color: ${({theme:e})=>e["gray-color"]};
        svg,
        i,
        img{
          ${({theme:e})=>e.rtl?"margin-left":"margin-right"}: 3px;
        }
      }
      .btn-addColumn-inner{
        background-color: #F4F5F7;
        .sDash-add-column-input{
          padding: 10px;
          border-radius: 4px;
          background-color: #fff;
          width: 100%;
          height: 38px;
          border: 1px solid ${({theme:e})=>e["border-color-normal"]};
          &:focus{
            outline: none;
          }
        }
      }
      .btn-addColumn-form{
        display: none;
        padding: 15px 20px 15px;
        .sDash_add-column-action{
          margin-top: 10px;
          display: flex;
          align-items: center;
          .add-column{
            margin-right: 15px;
            ${({theme:e})=>e.rtl?"margin-left":"margin-right"}: 15px;
          }
          a{
            line-height: 1;
          }
          svg,
          i{
            color: ${({theme:e})=>e["gray-color"]};
          }
        }
      }
    }
  }
`,i=a.ZP.div`
  .sDash_checklist-tasks__single{
    position: relative;
    padding: 10px 0;
    display: flex;
    align-items: center;
    justify-content: space-between;
    transition: .35s;
    z-index: 2;
    &:before{
      position: absolute;
      ${({theme:e})=>e.rtl?"right":"left"}: -12px;
      top: 0;
      width: calc(100% + 24px);
      height: 100%;
      content: '';
      background-color: #F4F5F7;
      opacity: 0;
      visibility: hidden;
      border-radius: 2px;
      z-index: -1;
    }
    &:hover{
      .btn-more{
        opacity: 1;
        visibility: visible;
      }
      &:before{
        opacity: 1;
        visibility: visible;
      }
    }
    .btn-more{
      display: flex;
      align-items: center;
      opacity: 0;
      visibility: hidden;
      i,
      svg{
        color: #868EAE;
      }
    }
    .ant-checkbox-wrapper{
      &.ant-checkbox-wrapper-checked{
        .sDash_task-label{
          position: relative;
          display: inline-block;
          color: ${({theme:e})=>e["gray-color"]};
          &:after{
            position: absolute;
            width: 100%;
            height: 1px;
            ${({theme:e})=>e.rtl?"right":"left"}: 0;
            top: 60%;
            transform: translateY(-50%);
            background-color: #9299B8;
            content: '';
          }
        }
      }
    }
  }
  .sDash_checklist-tasks-wrap{
    .addChecklistTask-wrap{
      .addChecklistTask-form{
        .add-checklistTask{
          padding: 8px 10px;
          margin-bottom: 12px;
        }
        .addChecklistTask-form-action{
          display: flex;
          align-items: center;
          a{
            line-height: 1;
            svg,
            i{
              color: ${({theme:e})=>e["gray-color"]};
            }
          }
          .btn-add{
            margin-right: 10px;
            ${({theme:e})=>e.rtl?"margin-left":"margin-right"}: 10px;
          }
        }
      }
      .add-item{
        margin-top: 15px;
      }
    }
  }
`,r=a.ZP.div`
  width: 100%;
  height: 100%;
  position: fixed;
  top: 0;
  left: 0;
  ${({theme:e})=>e.rtl?"right":"left"};
  z-index: 9999;
  background: #00000080;
`},6381:function(e,t,n){n.r(t),n.d(t,{default:function(){return z}});var a=n(66252),o=n(3577);const i={key:"1",class:"page-header-actions"},r={class:"sDash_kanban-board-item"},l={class:"sDash_kanban-board-item-scrolable"},s={class:"list-header-title"},d=["onClick"],c=(0,a._)("span",null,"Edit Card Title",-1),u=[c],h=["onClick"],p=(0,a._)("span",null,"Delete Card",-1),m=[p],f={href:"#",class:"btn-more"},g={class:"sDash_kanvan-task"},v=["onClick"],b=(0,a._)("span",null,"Add Task",-1),k={class:"sDash_addTask-from"},w={class:"sDash_addTask-action"},_={class:"btn-addColumn-inner"},y=(0,a._)("span",null,"Add Column",-1),x={class:"btn-addColumn-form"},T={class:"sDash_add-column-action"};function D(e,t,n,c,p,D){const C=(0,a.up)("sdCalendarButton"),E=(0,a.up)("sdExportButton"),S=(0,a.up)("sdShareButton"),I=(0,a.up)("sdFeatherIcons"),A=(0,a.up)("sdButton"),O=(0,a.up)("sdPageHeader"),P=(0,a.up)("sdDropdown"),B=(0,a.up)("BoardTitleUpdate"),M=(0,a.up)("TaskItem"),N=(0,a.up)("a-input"),W=(0,a.up)("perfect-scrollbar"),L=(0,a.up)("a-form"),$=(0,a.up)("draggable"),F=(0,a.up)("sdCards"),U=(0,a.up)("KanvanBoardWrap"),z=(0,a.up)("a-col"),j=(0,a.up)("a-row"),H=(0,a.up)("Main"),Y=(0,a.up)("UpdateTask"),R=(0,a.up)("BackShadow");return(0,a.wg)(),(0,a.iD)(a.HY,null,[(0,a.Wm)(O,{title:"Kanban"},{buttons:(0,a.w5)((()=>[(0,a._)("div",i,[(0,a.Wm)(C),(0,a.Wm)(E),(0,a.Wm)(S),(0,a.Wm)(A,{size:"small",type:"primary"},{default:(0,a.w5)((()=>[(0,a.Wm)(I,{type:"plus",size:"14"}),(0,a.Uk)(" Add New ")])),_:1})])])),_:1}),(0,a.Wm)(H,null,{default:(0,a.w5)((()=>[(0,a.Wm)(j,{gutter:15},{default:(0,a.w5)((()=>[(0,a.Wm)(z,{xs:24},{default:(0,a.w5)((()=>[(0,a.Wm)(U,null,{default:(0,a.w5)((()=>[(0,a.Wm)(F,{headless:"",title:"Product Design"},{default:(0,a.w5)((()=>[(0,a.Wm)($,{modelValue:e.dragAbleBoardData,"onUpdate:modelValue":t[4]||(t[4]=t=>e.dragAbleBoardData=t),"component-data":e.getComponentData(),tag:"div",handle:".handle","item-key":"boardId"},{item:(0,a.w5)((({element:n})=>[(0,a._)("div",r,[(0,a.Wm)(W,{options:{wheelSpeed:2,swipeEasing:!0,suppressScrollX:!0}},{default:(0,a.w5)((()=>[(0,a._)("div",l,[(0,a._)("div",{class:(0,o.C_)(n.boardId===e.titleBoardId?"sDash_kanban-board-item__header editable":"sDash_kanban-board-item__header")},[(0,a._)("h4",s,[(0,a._)("span",null,[(0,a.Wm)(I,{type:"menu",class:"handle"}),(0,a.Uk)(" "+(0,o.zw)(n.title),1)]),(0,a.Wm)(P,{action:["click"],class:"wide-dropdwon kanbanCard-more"},{overlay:(0,a.w5)((()=>[(0,a._)("a",{onClick:t=>e.onBoardEditable(t,n.boardId,n.title),href:"#"},u,8,d),(0,a._)("a",{onClick:()=>e.deleteColumnHandler(n.boardId),href:"#"},m,8,h)])),default:(0,a.w5)((()=>[(0,a._)("a",f,[(0,a.Wm)(I,{type:"more-horizontal",size:"14"})])])),_:2},1024)]),(0,a.Wm)(B,{boardId:n.boardId,boardTitle:e.boardTitle,onBlur:e.onBoardEditableHide},null,8,["boardId","boardTitle","onBlur"])],2),(0,a._)("div",g,[(0,a.Wm)(M,{id:n.boardId,taskId:e.taskId,onBackShadow:e.onBackShadow,onTaskTitleUpdate:e.onTaskTitleUpdate,onTaskTitleDelete:e.onTaskTitleDelete,showModal:e.showModal},null,8,["id","taskId","onBackShadow","onTaskTitleUpdate","onTaskTitleDelete","showModal"])]),(0,a._)("div",{class:(0,o.C_)(n.boardId===e.boardId?"sDash_addTask-control add-task-on":"sDash_addTask-control")},[(0,a._)("a",{href:"#",class:"btn-addTask",onClick:t=>e.handleOnAddTask(t,n.boardId)},[(0,a.Wm)(I,{type:"plus",size:"12"}),b],8,v),(0,a._)("div",k,[(0,a.Wm)(N,{name:`taskInput-${n.boardId}`,class:"sDash_addTask-input",placeholder:"Enter a Title",onPressEnter:()=>e.addTaskHandler(n.boardId)},null,8,["name","onPressEnter"]),(0,a._)("div",w,[(0,a.Wm)(A,{onClick:()=>e.addTaskHandler(n.boardId),class:"add-column",htmlType:"submit",size:"small",type:"primary"},{default:(0,a.w5)((()=>[(0,a.Uk)(" Add ")])),_:2},1032,["onClick"]),(0,a._)("a",{href:"#",onClick:t[0]||(t[0]=(...t)=>e.handleOffAddTask&&e.handleOffAddTask(...t))},[(0,a.Wm)(I,{type:"x",size:"18"})])])])],2)])])),_:2},1024)])])),footer:(0,a.w5)((()=>[(0,a._)("div",{class:(0,o.C_)(e.addColumn?"btn-addColumn add-column-on":"btn-addColumn")},[(0,a._)("div",_,[(0,a._)("a",{href:"#",class:"btn-add",onClick:t[1]||(t[1]=(...t)=>e.activeAddOption&&e.activeAddOption(...t))},[(0,a.Wm)(I,{type:"plus",size:"12"}),y]),(0,a.Wm)(L,{class:"addColumn-form",model:e.formState,name:"columnAdd",onFinish:e.addColumnHandler},{default:(0,a.w5)((()=>[(0,a._)("div",x,[(0,a.Wm)(N,{value:e.columnTitle,"onUpdate:value":t[2]||(t[2]=t=>e.columnTitle=t),class:"sDash-add-column-input",onChange:e.onColumnTitleChange,placeholder:"Enter Column Title"},null,8,["value","onChange"]),(0,a._)("div",T,[(0,a.Wm)(A,{class:"add-column",htmlType:"submit",size:"small",type:"primary"},{default:(0,a.w5)((()=>[(0,a.Uk)(" Add ")])),_:1}),(0,a._)("a",{href:"#",onClick:t[3]||(t[3]=(...t)=>e.diActiveAddOption&&e.diActiveAddOption(...t))},[(0,a.Wm)(I,{type:"x",size:"18"})])])])])),_:1},8,["model","onFinish"])])],2)])),_:1},8,["modelValue","component-data"])])),_:1})])),_:1})])),_:1})])),_:1})])),_:1}),(0,a.Wm)(Y,{handleCancel:e.handleCancel,modalVisible:e.modalVisible,data:e.checklistData},null,8,["handleCancel","modalVisible","data"]),e.backShadow?((0,a.wg)(),(0,a.j4)(R,{key:0,onClick:e.onBackShadowHide},null,8,["onClick"])):(0,a.kq)("",!0)],64)}n(57658);var C=n(67125),E=n(16096),S=n(70305),I=n(72984),A=n(39081),O=n(2262),P=n(33907),B=n(9980),M=n.n(B),N=n(77801),W=n(88630);const L={name:"Kanban",components:{KanvanBoardWrap:C.KanvanBoardWrap,BackShadow:C.BackShadow,Main:I.Main,BoardTitleUpdate:N["default"],KanbanBoardItem:E["default"],UpdateTask:S["default"],draggable:M(),TaskItem:W["default"],PerfectScrollbar:A.F},setup(){const{state:e,dispatch:t}=(0,P.oR)(),n=(0,a.Fl)((()=>e.themeLayout.rtlData)),o=(0,a.Fl)((()=>e.KanbanBoard.boardData)),i=(0,a.Fl)((()=>e.KanbanBoard.taskData)),r=(0,O.iH)(!1),l=(0,O.qj)({}),s=(0,O.qj)({formState:l,columnTitle:"",boardTitle:"",boardId:"",titleBoardId:"",checklistData:{id:1,boardId:1,checklist:[]},modalVisible:!1,boardEditable:!1,backShadow:!1,taskId:""}),d=e=>{e.preventDefault(),r.value=!0},c=e=>{e.preventDefault(),r.value=!1},u=t=>{e.columnTitle=t.target.value},h=(e,t)=>{e.preventDefault(),s.boardId=t},p=e=>{e.preventDefault(),s.boardId=""},m=e=>{s.backShadow=!0,s.taskId=e},f=()=>{s.backShadow=!1,s.taskId=""},g=(e,n)=>{i.value.map((t=>(t.id===n&&(t.title=e,s.backShadow=!1,s.taskId=""),t))),t("ToAddTask",i.value)},v=(e,n)=>{e.preventDefault();const a=i.value.filter((e=>e.id!==n));s.backShadow=!1,s.taskId="",t("ToDeleteTask",a)},b=e=>{const n=[],a=document.querySelector(`input[name="taskInput-${e}"]`).value;i.value.map((e=>n.push(e.id)));const o=Math.max(...n);console.log(o),""!==a?(t("ToAddTask",[...i.value,{id:`${o+1}`,boardId:s.boardId,title:a,checklist:[]}]),s.boardId=""):alert("Please Enter a Task Ttile")},k=()=>{const e=[];o.value.map((t=>e.push(t.boardId)));const n=Math.max(...e);""!==s.columnTitle?(t("ToAddBoard",[...o.value,{boardId:n+1,title:s.columnTitle}]),s.columnTitle="",r.value=!1):alert("Please Enter a Column Ttile")},w=e=>{s.modalVisible=!s.modalVisible,s.checklistData=e},_=(e,t,n)=>{e.preventDefault(),s.boardEditable=!0,s.boardTitle=n,s.titleBoardId=t},y=e=>{o.value.map((t=>(t.boardId===e&&(console.log(document.querySelector(`input[name="titile-edit${e}"]`)),t.title=document.querySelector(`input[name="titile-edit${e}"]`).value),t))),t("ToAddBoard",o.value),s.boardEditable=!1,s.titleBoardId=""},x=e=>{const n=o.value.filter((t=>t.boardId!==e)),a=window.confirm("Are You sure to delete this?");return a&&t("ToAddBoard",n),!1},T=()=>{s.modalVisible=!1};function D(){return{class:"sDash_kanban-board-list"}}const C=e=>{console.log(e)};return{log:C,getComponentData:D,handleCancel:T,deleteColumnHandler:x,onBoardEditableHide:y,onBoardEditable:_,showModal:w,addColumnHandler:k,addTaskHandler:b,onTaskTitleDelete:v,onBackShadow:m,onTaskTitleUpdate:g,onBackShadowHide:f,handleOffAddTask:p,handleOnAddTask:h,activeAddOption:d,rtl:n,boardData:o,tasks:i,addColumn:r,states:s,...(0,O.BK)(s),onColumnTitleChange:u,diActiveAddOption:c}},computed:{dragAbleBoardData:{get(){return this.$store.state.KanbanBoard.boardData},set(e){this.$store.dispatch("ToAddBoard",e)}}}};var $=L,F=n(83744);const U=(0,F.Z)($,[["render",D]]);var z=U},77801:function(e,t,n){n.r(t),n.d(t,{default:function(){return c}});var a=n(66252);function o(e,t,n,o,i,r){const l=(0,a.up)("a-input");return(0,a.wg)(),(0,a.j4)(l,{name:`titile-edit${e.boardId}`,class:"title-edit",placeholder:"Enter Title",onBlur:t[0]||(t[0]=()=>e.onBlur(e.boardId)),onPressEnter:t[1]||(t[1]=()=>e.onBlur(e.boardId)),value:e.value,"onUpdate:value":t[2]||(t[2]=t=>e.value=t)},null,8,["name","value"])}var i=n(2262),r=n(5298),l=(0,a.aZ)({name:"BoardTitleUpdate",props:{boardTitle:r.ZP.string,boardId:r.ZP.string,onBlur:r.ZP.func},setup(){const e=(0,i.iH)("");return{value:e}}}),s=n(83744);const d=(0,s.Z)(l,[["render",o]]);var c=d},16096:function(e,t,n){n.r(t),n.d(t,{default:function(){return k}});var a=n(66252),o=n(3577);const i={key:0},r={class:"sDash_kanvan-task__title"},l={class:"sDash_kanvan-task__edit",draggable:"false"},s={class:"sDash_kanvan-task__edit--left"},d={class:"sDash_kanvan-task__edit--right"},c=(0,a._)("span",null,"Delete Task",-1);function u(e,t,n,u,h,p){const m=(0,a.up)("sdFeatherIcons"),f=(0,a.up)("a-input"),g=(0,a.up)("sdButton");return e.isTaskLoading?((0,a.wg)(),(0,a.iD)("div",i,"loading")):((0,a.wg)(),(0,a.iD)("div",{key:1,class:(0,o.C_)(e.taskId===e.id?"sDash_kanvan-task__editable":"")},[(0,a._)("h4",r,[(0,a._)("a",{onClick:t[0]||(t[0]=()=>e.showModal(e.data)),href:"#"},(0,o.zw)(e.title),1),(0,a._)("a",{href:"#",class:"btn-edit",onClick:t[1]||(t[1]=()=>e.onBackShadow(e.id))},[(0,a.Wm)(m,{type:"edit-2",size:"12"})])]),(0,a._)("div",l,[(0,a._)("div",s,[(0,a.Wm)(f,{onPressEnter:t[2]||(t[2]=()=>e.onTaskTitleUpdate(e.value,e.id)),onChange:e.onTaskTitleChange,value:e.value,"onUpdate:value":t[3]||(t[3]=t=>e.value=t)},null,8,["onChange","value"]),(0,a.Wm)(g,{onClick:t[4]||(t[4]=()=>e.onTaskTitleUpdate(e.value,e.id)),class:"edit-kanban-task",htmlType:"submit",size:"small",type:"primary"},{default:(0,a.w5)((()=>[(0,a.Uk)(" Save ")])),_:1})]),(0,a._)("div",d,[(0,a._)("a",{href:"#",class:"btn-delete",onClick:t[5]||(t[5]=t=>e.onTaskTitleDelete(t,e.id))},[(0,a.Wm)(m,{type:"trash-2",size:"12"}),c])])])],2))}var h=n(2262),p=n(5298),m=n(33907);const f=(0,a.aZ)({name:"KanbanBoardItem",props:{data:p.ZP.object,showModal:p.ZP.func,onBackShadow:p.ZP.func,taskId:p.ZP.string,onTaskTitleUpdate:p.ZP.func,onTaskTitleDelete:p.ZP.func},setup(e){const{state:t}=(0,m.oR)(),n=(0,a.Fl)((()=>t.KanbanBoard.tsLoading)),{data:o}=(0,h.BK)(e),{title:i,id:r}=(0,h.BK)(o.value),l=(0,h.iH)(i.value),s=e=>{l.value=e.target.value};return{onTaskTitleChange:s,isTaskLoading:n,title:i,id:r,value:l}}});var g=f,v=n(83744);const b=(0,v.Z)(g,[["render",u]]);var k=b},88630:function(e,t,n){n.r(t),n.d(t,{default:function(){return Kt}});var a=n(66252);const o=["data-keyId"];function i(e,t,n,i,r,l){const s=(0,a.up)("KanbanBoardItem"),d=(0,a.up)("VueDraggableNext");return(0,a.wg)(),(0,a.j4)(d,{"data-boardId":e.id,onEnd:e.checkMove,class:"dragArea list-group w-full",modelValue:e.taskData,"onUpdate:modelValue":t[0]||(t[0]=t=>e.taskData=t),"item-key":"id",group:"people"},{default:(0,a.w5)((()=>[((0,a.wg)(!0),(0,a.iD)(a.HY,null,(0,a.Ko)(e.taskData.filter((e=>e.boardId===this.id)),(t=>((0,a.wg)(),(0,a.iD)("div",{class:"list-group-item sDash_kanvan-task__single",key:t.id,"data-keyId":t.id},[(0,a.Wm)(s,{taskId:e.taskId,onBackShadow:e.onBackShadow,onTaskTitleUpdate:e.onTaskTitleUpdate,onTaskTitleDelete:e.onTaskTitleDelete,showModal:e.showModal,data:t},null,8,["taskId","onBackShadow","onTaskTitleUpdate","onTaskTitleDelete","showModal","data"])],8,o)))),128))])),_:1},8,["data-boardId","onEnd","modelValue"])}
/*!
  * vue-draggable-next v2.1.0
  * (c) 2021 Anish George
  * @license MIT
  */
/**!
 * Sortable 1.14.0
 * @author	RubaXa   <trash@rubaxa.org>
 * @author	owenm    <owen23355@gmail.com>
 * @license MIT
 */
function r(e,t){var n=Object.keys(e);if(Object.getOwnPropertySymbols){var a=Object.getOwnPropertySymbols(e);t&&(a=a.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),n.push.apply(n,a)}return n}function l(e){for(var t=1;t<arguments.length;t++){var n=null!=arguments[t]?arguments[t]:{};t%2?r(Object(n),!0).forEach((function(t){d(e,t,n[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(n)):r(Object(n)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(n,t))}))}return e}function s(e){return s="function"===typeof Symbol&&"symbol"===typeof Symbol.iterator?function(e){return typeof e}:function(e){return e&&"function"===typeof Symbol&&e.constructor===Symbol&&e!==Symbol.prototype?"symbol":typeof e},s(e)}function d(e,t,n){return t in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}function c(){return c=Object.assign||function(e){for(var t=1;t<arguments.length;t++){var n=arguments[t];for(var a in n)Object.prototype.hasOwnProperty.call(n,a)&&(e[a]=n[a])}return e},c.apply(this,arguments)}function u(e,t){if(null==e)return{};var n,a,o={},i=Object.keys(e);for(a=0;a<i.length;a++)n=i[a],t.indexOf(n)>=0||(o[n]=e[n]);return o}function h(e,t){if(null==e)return{};var n,a,o=u(e,t);if(Object.getOwnPropertySymbols){var i=Object.getOwnPropertySymbols(e);for(a=0;a<i.length;a++)n=i[a],t.indexOf(n)>=0||Object.prototype.propertyIsEnumerable.call(e,n)&&(o[n]=e[n])}return o}var p="1.14.0";function m(e){if("undefined"!==typeof window&&window.navigator)return!!navigator.userAgent.match(e)}var f=m(/(?:Trident.*rv[ :]?11\.|msie|iemobile|Windows Phone)/i),g=m(/Edge/i),v=m(/firefox/i),b=m(/safari/i)&&!m(/chrome/i)&&!m(/android/i),k=m(/iP(ad|od|hone)/i),w=m(/chrome/i)&&m(/android/i),_={capture:!1,passive:!1};function y(e,t,n){e.addEventListener(t,n,!f&&_)}function x(e,t,n){e.removeEventListener(t,n,!f&&_)}function T(e,t){if(t){if(">"===t[0]&&(t=t.substring(1)),e)try{if(e.matches)return e.matches(t);if(e.msMatchesSelector)return e.msMatchesSelector(t);if(e.webkitMatchesSelector)return e.webkitMatchesSelector(t)}catch(n){return!1}return!1}}function D(e){return e.host&&e!==document&&e.host.nodeType?e.host:e.parentNode}function C(e,t,n,a){if(e){n=n||document;do{if(null!=t&&(">"===t[0]?e.parentNode===n&&T(e,t):T(e,t))||a&&e===n)return e;if(e===n)break}while(e=D(e))}return null}var E,S=/\s+/g;function I(e,t,n){if(e&&t)if(e.classList)e.classList[n?"add":"remove"](t);else{var a=(" "+e.className+" ").replace(S," ").replace(" "+t+" "," ");e.className=(a+(n?" "+t:"")).replace(S," ")}}function A(e,t,n){var a=e&&e.style;if(a){if(void 0===n)return document.defaultView&&document.defaultView.getComputedStyle?n=document.defaultView.getComputedStyle(e,""):e.currentStyle&&(n=e.currentStyle),void 0===t?n:n[t];t in a||-1!==t.indexOf("webkit")||(t="-webkit-"+t),a[t]=n+("string"===typeof n?"":"px")}}function O(e,t){var n="";if("string"===typeof e)n=e;else do{var a=A(e,"transform");a&&"none"!==a&&(n=a+" "+n)}while(!t&&(e=e.parentNode));var o=window.DOMMatrix||window.WebKitCSSMatrix||window.CSSMatrix||window.MSCSSMatrix;return o&&new o(n)}function P(e,t,n){if(e){var a=e.getElementsByTagName(t),o=0,i=a.length;if(n)for(;o<i;o++)n(a[o],o);return a}return[]}function B(){var e=document.scrollingElement;return e||document.documentElement}function M(e,t,n,a,o){if(e.getBoundingClientRect||e===window){var i,r,l,s,d,c,u;if(e!==window&&e.parentNode&&e!==B()?(i=e.getBoundingClientRect(),r=i.top,l=i.left,s=i.bottom,d=i.right,c=i.height,u=i.width):(r=0,l=0,s=window.innerHeight,d=window.innerWidth,c=window.innerHeight,u=window.innerWidth),(t||n)&&e!==window&&(o=o||e.parentNode,!f))do{if(o&&o.getBoundingClientRect&&("none"!==A(o,"transform")||n&&"static"!==A(o,"position"))){var h=o.getBoundingClientRect();r-=h.top+parseInt(A(o,"border-top-width")),l-=h.left+parseInt(A(o,"border-left-width")),s=r+i.height,d=l+i.width;break}}while(o=o.parentNode);if(a&&e!==window){var p=O(o||e),m=p&&p.a,g=p&&p.d;p&&(r/=g,l/=m,u/=m,c/=g,s=r+c,d=l+u)}return{top:r,left:l,bottom:s,right:d,width:u,height:c}}}function N(e,t,n){var a=z(e,!0),o=M(e)[t];while(a){var i=M(a)[n],r=void 0;if(r="top"===n||"left"===n?o>=i:o<=i,!r)return a;if(a===B())break;a=z(a,!1)}return!1}function W(e,t,n,a){var o=0,i=0,r=e.children;while(i<r.length){if("none"!==r[i].style.display&&r[i]!==Ge.ghost&&(a||r[i]!==Ge.dragged)&&C(r[i],n.draggable,e,!1)){if(o===t)return r[i];o++}i++}return null}function L(e,t){var n=e.lastElementChild;while(n&&(n===Ge.ghost||"none"===A(n,"display")||t&&!T(n,t)))n=n.previousElementSibling;return n||null}function $(e,t){var n=0;if(!e||!e.parentNode)return-1;while(e=e.previousElementSibling)"TEMPLATE"===e.nodeName.toUpperCase()||e===Ge.clone||t&&!T(e,t)||n++;return n}function F(e){var t=0,n=0,a=B();if(e)do{var o=O(e),i=o.a,r=o.d;t+=e.scrollLeft*i,n+=e.scrollTop*r}while(e!==a&&(e=e.parentNode));return[t,n]}function U(e,t){for(var n in e)if(e.hasOwnProperty(n))for(var a in t)if(t.hasOwnProperty(a)&&t[a]===e[n][a])return Number(n);return-1}function z(e,t){if(!e||!e.getBoundingClientRect)return B();var n=e,a=!1;do{if(n.clientWidth<n.scrollWidth||n.clientHeight<n.scrollHeight){var o=A(n);if(n.clientWidth<n.scrollWidth&&("auto"==o.overflowX||"scroll"==o.overflowX)||n.clientHeight<n.scrollHeight&&("auto"==o.overflowY||"scroll"==o.overflowY)){if(!n.getBoundingClientRect||n===document.body)return B();if(a||t)return n;a=!0}}}while(n=n.parentNode);return B()}function j(e,t){if(e&&t)for(var n in t)t.hasOwnProperty(n)&&(e[n]=t[n]);return e}function H(e,t){return Math.round(e.top)===Math.round(t.top)&&Math.round(e.left)===Math.round(t.left)&&Math.round(e.height)===Math.round(t.height)&&Math.round(e.width)===Math.round(t.width)}function Y(e,t){return function(){if(!E){var n=arguments,a=this;1===n.length?e.call(a,n[0]):e.apply(a,n),E=setTimeout((function(){E=void 0}),t)}}}function R(){clearTimeout(E),E=void 0}function X(e,t,n){e.scrollLeft+=t,e.scrollTop+=n}function V(e){var t=window.Polymer,n=window.jQuery||window.Zepto;return t&&t.dom?t.dom(e).cloneNode(!0):n?n(e).clone(!0)[0]:e.cloneNode(!0)}var Z="Sortable"+(new Date).getTime();function K(){var e,t=[];return{captureAnimationState:function(){if(t=[],this.options.animation){var e=[].slice.call(this.el.children);e.forEach((function(e){if("none"!==A(e,"display")&&e!==Ge.ghost){t.push({target:e,rect:M(e)});var n=l({},t[t.length-1].rect);if(e.thisAnimationDuration){var a=O(e,!0);a&&(n.top-=a.f,n.left-=a.e)}e.fromRect=n}}))}},addAnimationState:function(e){t.push(e)},removeAnimationState:function(e){t.splice(U(t,{target:e}),1)},animateAll:function(n){var a=this;if(!this.options.animation)return clearTimeout(e),void("function"===typeof n&&n());var o=!1,i=0;t.forEach((function(e){var t=0,n=e.target,r=n.fromRect,l=M(n),s=n.prevFromRect,d=n.prevToRect,c=e.rect,u=O(n,!0);u&&(l.top-=u.f,l.left-=u.e),n.toRect=l,n.thisAnimationDuration&&H(s,l)&&!H(r,l)&&(c.top-l.top)/(c.left-l.left)===(r.top-l.top)/(r.left-l.left)&&(t=G(c,s,d,a.options)),H(l,r)||(n.prevFromRect=r,n.prevToRect=l,t||(t=a.options.animation),a.animate(n,c,l,t)),t&&(o=!0,i=Math.max(i,t),clearTimeout(n.animationResetTimer),n.animationResetTimer=setTimeout((function(){n.animationTime=0,n.prevFromRect=null,n.fromRect=null,n.prevToRect=null,n.thisAnimationDuration=null}),t),n.thisAnimationDuration=t)})),clearTimeout(e),o?e=setTimeout((function(){"function"===typeof n&&n()}),i):"function"===typeof n&&n(),t=[]},animate:function(e,t,n,a){if(a){A(e,"transition",""),A(e,"transform","");var o=O(this.el),i=o&&o.a,r=o&&o.d,l=(t.left-n.left)/(i||1),s=(t.top-n.top)/(r||1);e.animatingX=!!l,e.animatingY=!!s,A(e,"transform","translate3d("+l+"px,"+s+"px,0)"),this.forRepaintDummy=q(e),A(e,"transition","transform "+a+"ms"+(this.options.easing?" "+this.options.easing:"")),A(e,"transform","translate3d(0,0,0)"),"number"===typeof e.animated&&clearTimeout(e.animated),e.animated=setTimeout((function(){A(e,"transition",""),A(e,"transform",""),e.animated=!1,e.animatingX=!1,e.animatingY=!1}),a)}}}}function q(e){return e.offsetWidth}function G(e,t,n,a){return Math.sqrt(Math.pow(t.top-e.top,2)+Math.pow(t.left-e.left,2))/Math.sqrt(Math.pow(t.top-n.top,2)+Math.pow(t.left-n.left,2))*a.animation}var Q=[],J={initializeByDefault:!0},ee={mount:function(e){for(var t in J)J.hasOwnProperty(t)&&!(t in e)&&(e[t]=J[t]);Q.forEach((function(t){if(t.pluginName===e.pluginName)throw"Sortable: Cannot mount plugin ".concat(e.pluginName," more than once")})),Q.push(e)},pluginEvent:function(e,t,n){var a=this;this.eventCanceled=!1,n.cancel=function(){a.eventCanceled=!0};var o=e+"Global";Q.forEach((function(a){t[a.pluginName]&&(t[a.pluginName][o]&&t[a.pluginName][o](l({sortable:t},n)),t.options[a.pluginName]&&t[a.pluginName][e]&&t[a.pluginName][e](l({sortable:t},n)))}))},initializePlugins:function(e,t,n,a){for(var o in Q.forEach((function(a){var o=a.pluginName;if(e.options[o]||a.initializeByDefault){var i=new a(e,t,e.options);i.sortable=e,i.options=e.options,e[o]=i,c(n,i.defaults)}})),e.options)if(e.options.hasOwnProperty(o)){var i=this.modifyOption(e,o,e.options[o]);"undefined"!==typeof i&&(e.options[o]=i)}},getEventProperties:function(e,t){var n={};return Q.forEach((function(a){"function"===typeof a.eventProperties&&c(n,a.eventProperties.call(t[a.pluginName],e))})),n},modifyOption:function(e,t,n){var a;return Q.forEach((function(o){e[o.pluginName]&&o.optionListeners&&"function"===typeof o.optionListeners[t]&&(a=o.optionListeners[t].call(e[o.pluginName],n))})),a}};function te(e){var t=e.sortable,n=e.rootEl,a=e.name,o=e.targetEl,i=e.cloneEl,r=e.toEl,s=e.fromEl,d=e.oldIndex,c=e.newIndex,u=e.oldDraggableIndex,h=e.newDraggableIndex,p=e.originalEvent,m=e.putSortable,v=e.extraEventProperties;if(t=t||n&&n[Z],t){var b,k=t.options,w="on"+a.charAt(0).toUpperCase()+a.substr(1);!window.CustomEvent||f||g?(b=document.createEvent("Event"),b.initEvent(a,!0,!0)):b=new CustomEvent(a,{bubbles:!0,cancelable:!0}),b.to=r||n,b.from=s||n,b.item=o||n,b.clone=i,b.oldIndex=d,b.newIndex=c,b.oldDraggableIndex=u,b.newDraggableIndex=h,b.originalEvent=p,b.pullMode=m?m.lastPutMode:void 0;var _=l(l({},v),ee.getEventProperties(a,t));for(var y in _)b[y]=_[y];n&&n.dispatchEvent(b),k[w]&&k[w].call(t,b)}}var ne=["evt"],ae=function(e,t){var n=arguments.length>2&&void 0!==arguments[2]?arguments[2]:{},a=n.evt,o=h(n,ne);ee.pluginEvent.bind(Ge)(e,t,l({dragEl:ie,parentEl:re,ghostEl:le,rootEl:se,nextEl:de,lastDownEl:ce,cloneEl:ue,cloneHidden:he,dragStarted:De,putSortable:be,activeSortable:Ge.active,originalEvent:a,oldIndex:pe,oldDraggableIndex:fe,newIndex:me,newDraggableIndex:ge,hideGhostForTarget:Ve,unhideGhostForTarget:Ze,cloneNowHidden:function(){he=!0},cloneNowShown:function(){he=!1},dispatchSortableEvent:function(e){oe({sortable:t,name:e,originalEvent:a})}},o))};function oe(e){te(l({putSortable:be,cloneEl:ue,targetEl:ie,rootEl:se,oldIndex:pe,oldDraggableIndex:fe,newIndex:me,newDraggableIndex:ge},e))}var ie,re,le,se,de,ce,ue,he,pe,me,fe,ge,ve,be,ke,we,_e,ye,xe,Te,De,Ce,Ee,Se,Ie,Ae=!1,Oe=!1,Pe=[],Be=!1,Me=!1,Ne=[],We=!1,Le=[],$e="undefined"!==typeof document,Fe=k,Ue=g||f?"cssFloat":"float",ze=$e&&!w&&!k&&"draggable"in document.createElement("div"),je=function(){if($e){if(f)return!1;var e=document.createElement("x");return e.style.cssText="pointer-events:auto","auto"===e.style.pointerEvents}}(),He=function(e,t){var n=A(e),a=parseInt(n.width)-parseInt(n.paddingLeft)-parseInt(n.paddingRight)-parseInt(n.borderLeftWidth)-parseInt(n.borderRightWidth),o=W(e,0,t),i=W(e,1,t),r=o&&A(o),l=i&&A(i),s=r&&parseInt(r.marginLeft)+parseInt(r.marginRight)+M(o).width,d=l&&parseInt(l.marginLeft)+parseInt(l.marginRight)+M(i).width;if("flex"===n.display)return"column"===n.flexDirection||"column-reverse"===n.flexDirection?"vertical":"horizontal";if("grid"===n.display)return n.gridTemplateColumns.split(" ").length<=1?"vertical":"horizontal";if(o&&r["float"]&&"none"!==r["float"]){var c="left"===r["float"]?"left":"right";return!i||"both"!==l.clear&&l.clear!==c?"horizontal":"vertical"}return o&&("block"===r.display||"flex"===r.display||"table"===r.display||"grid"===r.display||s>=a&&"none"===n[Ue]||i&&"none"===n[Ue]&&s+d>a)?"vertical":"horizontal"},Ye=function(e,t,n){var a=n?e.left:e.top,o=n?e.right:e.bottom,i=n?e.width:e.height,r=n?t.left:t.top,l=n?t.right:t.bottom,s=n?t.width:t.height;return a===r||o===l||a+i/2===r+s/2},Re=function(e,t){var n;return Pe.some((function(a){var o=a[Z].options.emptyInsertThreshold;if(o&&!L(a)){var i=M(a),r=e>=i.left-o&&e<=i.right+o,l=t>=i.top-o&&t<=i.bottom+o;return r&&l?n=a:void 0}})),n},Xe=function(e){function t(e,n){return function(a,o,i,r){var l=a.options.group.name&&o.options.group.name&&a.options.group.name===o.options.group.name;if(null==e&&(n||l))return!0;if(null==e||!1===e)return!1;if(n&&"clone"===e)return e;if("function"===typeof e)return t(e(a,o,i,r),n)(a,o,i,r);var s=(n?a:o).options.group.name;return!0===e||"string"===typeof e&&e===s||e.join&&e.indexOf(s)>-1}}var n={},a=e.group;a&&"object"==s(a)||(a={name:a}),n.name=a.name,n.checkPull=t(a.pull,!0),n.checkPut=t(a.put),n.revertClone=a.revertClone,e.group=n},Ve=function(){!je&&le&&A(le,"display","none")},Ze=function(){!je&&le&&A(le,"display","")};$e&&document.addEventListener("click",(function(e){if(Oe)return e.preventDefault(),e.stopPropagation&&e.stopPropagation(),e.stopImmediatePropagation&&e.stopImmediatePropagation(),Oe=!1,!1}),!0);var Ke=function(e){if(ie){e=e.touches?e.touches[0]:e;var t=Re(e.clientX,e.clientY);if(t){var n={};for(var a in e)e.hasOwnProperty(a)&&(n[a]=e[a]);n.target=n.rootEl=t,n.preventDefault=void 0,n.stopPropagation=void 0,t[Z]._onDragOver(n)}}},qe=function(e){ie&&ie.parentNode[Z]._isOutsideThisEl(e.target)};function Ge(e,t){if(!e||!e.nodeType||1!==e.nodeType)throw"Sortable: `el` must be an HTMLElement, not ".concat({}.toString.call(e));this.el=e,this.options=t=c({},t),e[Z]=this;var n={group:null,sort:!0,disabled:!1,store:null,handle:null,draggable:/^[uo]l$/i.test(e.nodeName)?">li":">*",swapThreshold:1,invertSwap:!1,invertedSwapThreshold:null,removeCloneOnHide:!0,direction:function(){return He(e,this.options)},ghostClass:"sortable-ghost",chosenClass:"sortable-chosen",dragClass:"sortable-drag",ignore:"a, img",filter:null,preventOnFilter:!0,animation:0,easing:null,setData:function(e,t){e.setData("Text",t.textContent)},dropBubble:!1,dragoverBubble:!1,dataIdAttr:"data-id",delay:0,delayOnTouchOnly:!1,touchStartThreshold:(Number.parseInt?Number:window).parseInt(window.devicePixelRatio,10)||1,forceFallback:!1,fallbackClass:"sortable-fallback",fallbackOnBody:!1,fallbackTolerance:0,fallbackOffset:{x:0,y:0},supportPointer:!1!==Ge.supportPointer&&"PointerEvent"in window&&!b,emptyInsertThreshold:5};for(var a in ee.initializePlugins(this,e,n),n)!(a in t)&&(t[a]=n[a]);for(var o in Xe(t),this)"_"===o.charAt(0)&&"function"===typeof this[o]&&(this[o]=this[o].bind(this));this.nativeDraggable=!t.forceFallback&&ze,this.nativeDraggable&&(this.options.touchStartThreshold=1),t.supportPointer?y(e,"pointerdown",this._onTapStart):(y(e,"mousedown",this._onTapStart),y(e,"touchstart",this._onTapStart)),this.nativeDraggable&&(y(e,"dragover",this),y(e,"dragenter",this)),Pe.push(this.el),t.store&&t.store.get&&this.sort(t.store.get(this)||[]),c(this,K())}function Qe(e){e.dataTransfer&&(e.dataTransfer.dropEffect="move"),e.cancelable&&e.preventDefault()}function Je(e,t,n,a,o,i,r,l){var s,d,c=e[Z],u=c.options.onMove;return!window.CustomEvent||f||g?(s=document.createEvent("Event"),s.initEvent("move",!0,!0)):s=new CustomEvent("move",{bubbles:!0,cancelable:!0}),s.to=t,s.from=e,s.dragged=n,s.draggedRect=a,s.related=o||t,s.relatedRect=i||M(t),s.willInsertAfter=l,s.originalEvent=r,e.dispatchEvent(s),u&&(d=u.call(c,s,r)),d}function et(e){e.draggable=!1}function tt(){We=!1}function nt(e,t,n){var a=M(W(n.el,0,n.options,!0)),o=10;return t?e.clientX<a.left-o||e.clientY<a.top&&e.clientX<a.right:e.clientY<a.top-o||e.clientY<a.bottom&&e.clientX<a.left}function at(e,t,n){var a=M(L(n.el,n.options.draggable)),o=10;return t?e.clientX>a.right+o||e.clientX<=a.right&&e.clientY>a.bottom&&e.clientX>=a.left:e.clientX>a.right&&e.clientY>a.top||e.clientX<=a.right&&e.clientY>a.bottom+o}function ot(e,t,n,a,o,i,r,l){var s=a?e.clientY:e.clientX,d=a?n.height:n.width,c=a?n.top:n.left,u=a?n.bottom:n.right,h=!1;if(!r)if(l&&Se<d*o){if(!Be&&(1===Ee?s>c+d*i/2:s<u-d*i/2)&&(Be=!0),Be)h=!0;else if(1===Ee?s<c+Se:s>u-Se)return-Ee}else if(s>c+d*(1-o)/2&&s<u-d*(1-o)/2)return it(t);return h=h||r,h&&(s<c+d*i/2||s>u-d*i/2)?s>c+d/2?1:-1:0}function it(e){return $(ie)<$(e)?1:-1}function rt(e){var t=e.tagName+e.className+e.src+e.href+e.textContent,n=t.length,a=0;while(n--)a+=t.charCodeAt(n);return a.toString(36)}function lt(e){Le.length=0;var t=e.getElementsByTagName("input"),n=t.length;while(n--){var a=t[n];a.checked&&Le.push(a)}}function st(e){return setTimeout(e,0)}function dt(e){return clearTimeout(e)}Ge.prototype={constructor:Ge,_isOutsideThisEl:function(e){this.el.contains(e)||e===this.el||(Ce=null)},_getDirection:function(e,t){return"function"===typeof this.options.direction?this.options.direction.call(this,e,t,ie):this.options.direction},_onTapStart:function(e){if(e.cancelable){var t=this,n=this.el,a=this.options,o=a.preventOnFilter,i=e.type,r=e.touches&&e.touches[0]||e.pointerType&&"touch"===e.pointerType&&e,l=(r||e).target,s=e.target.shadowRoot&&(e.path&&e.path[0]||e.composedPath&&e.composedPath()[0])||l,d=a.filter;if(lt(n),!ie&&!(/mousedown|pointerdown/.test(i)&&0!==e.button||a.disabled)&&!s.isContentEditable&&(this.nativeDraggable||!b||!l||"SELECT"!==l.tagName.toUpperCase())&&(l=C(l,a.draggable,n,!1),(!l||!l.animated)&&ce!==l)){if(pe=$(l),fe=$(l,a.draggable),"function"===typeof d){if(d.call(this,e,l,this))return oe({sortable:t,rootEl:s,name:"filter",targetEl:l,toEl:n,fromEl:n}),ae("filter",t,{evt:e}),void(o&&e.cancelable&&e.preventDefault())}else if(d&&(d=d.split(",").some((function(a){if(a=C(s,a.trim(),n,!1),a)return oe({sortable:t,rootEl:a,name:"filter",targetEl:l,fromEl:n,toEl:n}),ae("filter",t,{evt:e}),!0})),d))return void(o&&e.cancelable&&e.preventDefault());a.handle&&!C(s,a.handle,n,!1)||this._prepareDragStart(e,r,l)}}},_prepareDragStart:function(e,t,n){var a,o=this,i=o.el,r=o.options,l=i.ownerDocument;if(n&&!ie&&n.parentNode===i){var s=M(n);if(se=i,ie=n,re=ie.parentNode,de=ie.nextSibling,ce=n,ve=r.group,Ge.dragged=ie,ke={target:ie,clientX:(t||e).clientX,clientY:(t||e).clientY},xe=ke.clientX-s.left,Te=ke.clientY-s.top,this._lastX=(t||e).clientX,this._lastY=(t||e).clientY,ie.style["will-change"]="all",a=function(){ae("delayEnded",o,{evt:e}),Ge.eventCanceled?o._onDrop():(o._disableDelayedDragEvents(),!v&&o.nativeDraggable&&(ie.draggable=!0),o._triggerDragStart(e,t),oe({sortable:o,name:"choose",originalEvent:e}),I(ie,r.chosenClass,!0))},r.ignore.split(",").forEach((function(e){P(ie,e.trim(),et)})),y(l,"dragover",Ke),y(l,"mousemove",Ke),y(l,"touchmove",Ke),y(l,"mouseup",o._onDrop),y(l,"touchend",o._onDrop),y(l,"touchcancel",o._onDrop),v&&this.nativeDraggable&&(this.options.touchStartThreshold=4,ie.draggable=!0),ae("delayStart",this,{evt:e}),!r.delay||r.delayOnTouchOnly&&!t||this.nativeDraggable&&(g||f))a();else{if(Ge.eventCanceled)return void this._onDrop();y(l,"mouseup",o._disableDelayedDrag),y(l,"touchend",o._disableDelayedDrag),y(l,"touchcancel",o._disableDelayedDrag),y(l,"mousemove",o._delayedDragTouchMoveHandler),y(l,"touchmove",o._delayedDragTouchMoveHandler),r.supportPointer&&y(l,"pointermove",o._delayedDragTouchMoveHandler),o._dragStartTimer=setTimeout(a,r.delay)}}},_delayedDragTouchMoveHandler:function(e){var t=e.touches?e.touches[0]:e;Math.max(Math.abs(t.clientX-this._lastX),Math.abs(t.clientY-this._lastY))>=Math.floor(this.options.touchStartThreshold/(this.nativeDraggable&&window.devicePixelRatio||1))&&this._disableDelayedDrag()},_disableDelayedDrag:function(){ie&&et(ie),clearTimeout(this._dragStartTimer),this._disableDelayedDragEvents()},_disableDelayedDragEvents:function(){var e=this.el.ownerDocument;x(e,"mouseup",this._disableDelayedDrag),x(e,"touchend",this._disableDelayedDrag),x(e,"touchcancel",this._disableDelayedDrag),x(e,"mousemove",this._delayedDragTouchMoveHandler),x(e,"touchmove",this._delayedDragTouchMoveHandler),x(e,"pointermove",this._delayedDragTouchMoveHandler)},_triggerDragStart:function(e,t){t=t||"touch"==e.pointerType&&e,!this.nativeDraggable||t?this.options.supportPointer?y(document,"pointermove",this._onTouchMove):y(document,t?"touchmove":"mousemove",this._onTouchMove):(y(ie,"dragend",this),y(se,"dragstart",this._onDragStart));try{document.selection?st((function(){document.selection.empty()})):window.getSelection().removeAllRanges()}catch(n){}},_dragStarted:function(e,t){if(Ae=!1,se&&ie){ae("dragStarted",this,{evt:t}),this.nativeDraggable&&y(document,"dragover",qe);var n=this.options;!e&&I(ie,n.dragClass,!1),I(ie,n.ghostClass,!0),Ge.active=this,e&&this._appendGhost(),oe({sortable:this,name:"start",originalEvent:t})}else this._nulling()},_emulateDragOver:function(){if(we){this._lastX=we.clientX,this._lastY=we.clientY,Ve();var e=document.elementFromPoint(we.clientX,we.clientY),t=e;while(e&&e.shadowRoot){if(e=e.shadowRoot.elementFromPoint(we.clientX,we.clientY),e===t)break;t=e}if(ie.parentNode[Z]._isOutsideThisEl(e),t)do{if(t[Z]){var n=void 0;if(n=t[Z]._onDragOver({clientX:we.clientX,clientY:we.clientY,target:e,rootEl:t}),n&&!this.options.dragoverBubble)break}e=t}while(t=t.parentNode);Ze()}},_onTouchMove:function(e){if(ke){var t=this.options,n=t.fallbackTolerance,a=t.fallbackOffset,o=e.touches?e.touches[0]:e,i=le&&O(le,!0),r=le&&i&&i.a,l=le&&i&&i.d,s=Fe&&Ie&&F(Ie),d=(o.clientX-ke.clientX+a.x)/(r||1)+(s?s[0]-Ne[0]:0)/(r||1),c=(o.clientY-ke.clientY+a.y)/(l||1)+(s?s[1]-Ne[1]:0)/(l||1);if(!Ge.active&&!Ae){if(n&&Math.max(Math.abs(o.clientX-this._lastX),Math.abs(o.clientY-this._lastY))<n)return;this._onDragStart(e,!0)}if(le){i?(i.e+=d-(_e||0),i.f+=c-(ye||0)):i={a:1,b:0,c:0,d:1,e:d,f:c};var u="matrix(".concat(i.a,",").concat(i.b,",").concat(i.c,",").concat(i.d,",").concat(i.e,",").concat(i.f,")");A(le,"webkitTransform",u),A(le,"mozTransform",u),A(le,"msTransform",u),A(le,"transform",u),_e=d,ye=c,we=o}e.cancelable&&e.preventDefault()}},_appendGhost:function(){if(!le){var e=this.options.fallbackOnBody?document.body:se,t=M(ie,!0,Fe,!0,e),n=this.options;if(Fe){Ie=e;while("static"===A(Ie,"position")&&"none"===A(Ie,"transform")&&Ie!==document)Ie=Ie.parentNode;Ie!==document.body&&Ie!==document.documentElement?(Ie===document&&(Ie=B()),t.top+=Ie.scrollTop,t.left+=Ie.scrollLeft):Ie=B(),Ne=F(Ie)}le=ie.cloneNode(!0),I(le,n.ghostClass,!1),I(le,n.fallbackClass,!0),I(le,n.dragClass,!0),A(le,"transition",""),A(le,"transform",""),A(le,"box-sizing","border-box"),A(le,"margin",0),A(le,"top",t.top),A(le,"left",t.left),A(le,"width",t.width),A(le,"height",t.height),A(le,"opacity","0.8"),A(le,"position",Fe?"absolute":"fixed"),A(le,"zIndex","100000"),A(le,"pointerEvents","none"),Ge.ghost=le,e.appendChild(le),A(le,"transform-origin",xe/parseInt(le.style.width)*100+"% "+Te/parseInt(le.style.height)*100+"%")}},_onDragStart:function(e,t){var n=this,a=e.dataTransfer,o=n.options;ae("dragStart",this,{evt:e}),Ge.eventCanceled?this._onDrop():(ae("setupClone",this),Ge.eventCanceled||(ue=V(ie),ue.draggable=!1,ue.style["will-change"]="",this._hideClone(),I(ue,this.options.chosenClass,!1),Ge.clone=ue),n.cloneId=st((function(){ae("clone",n),Ge.eventCanceled||(n.options.removeCloneOnHide||se.insertBefore(ue,ie),n._hideClone(),oe({sortable:n,name:"clone"}))})),!t&&I(ie,o.dragClass,!0),t?(Oe=!0,n._loopId=setInterval(n._emulateDragOver,50)):(x(document,"mouseup",n._onDrop),x(document,"touchend",n._onDrop),x(document,"touchcancel",n._onDrop),a&&(a.effectAllowed="move",o.setData&&o.setData.call(n,a,ie)),y(document,"drop",n),A(ie,"transform","translateZ(0)")),Ae=!0,n._dragStartId=st(n._dragStarted.bind(n,t,e)),y(document,"selectstart",n),De=!0,b&&A(document.body,"user-select","none"))},_onDragOver:function(e){var t,n,a,o,i=this.el,r=e.target,s=this.options,d=s.group,c=Ge.active,u=ve===d,h=s.sort,p=be||c,m=this,f=!1;if(!We){if(void 0!==e.preventDefault&&e.cancelable&&e.preventDefault(),r=C(r,s.draggable,i,!0),B("dragOver"),Ge.eventCanceled)return f;if(ie.contains(e.target)||r.animated&&r.animatingX&&r.animatingY||m._ignoreWhileAnimating===r)return U(!1);if(Oe=!1,c&&!s.disabled&&(u?h||(a=re!==se):be===this||(this.lastPutMode=ve.checkPull(this,c,ie,e))&&d.checkPut(this,c,ie,e))){if(o="vertical"===this._getDirection(e,r),t=M(ie),B("dragOverValid"),Ge.eventCanceled)return f;if(a)return re=se,F(),this._hideClone(),B("revert"),Ge.eventCanceled||(de?se.insertBefore(ie,de):se.appendChild(ie)),U(!0);var g=L(i,s.draggable);if(!g||at(e,o,this)&&!g.animated){if(g===ie)return U(!1);if(g&&i===e.target&&(r=g),r&&(n=M(r)),!1!==Je(se,i,ie,t,r,n,e,!!r))return F(),i.appendChild(ie),re=i,z(),U(!0)}else if(g&&nt(e,o,this)){var v=W(i,0,s,!0);if(v===ie)return U(!1);if(r=v,n=M(r),!1!==Je(se,i,ie,t,r,n,e,!1))return F(),i.insertBefore(ie,v),re=i,z(),U(!0)}else if(r.parentNode===i){n=M(r);var b,k,w=0,_=ie.parentNode!==i,y=!Ye(ie.animated&&ie.toRect||t,r.animated&&r.toRect||n,o),x=o?"top":"left",T=N(r,"top","top")||N(ie,"top","top"),D=T?T.scrollTop:void 0;if(Ce!==r&&(b=n[x],Be=!1,Me=!y&&s.invertSwap||_),w=ot(e,r,n,o,y?1:s.swapThreshold,null==s.invertedSwapThreshold?s.swapThreshold:s.invertedSwapThreshold,Me,Ce===r),0!==w){var E=$(ie);do{E-=w,k=re.children[E]}while(k&&("none"===A(k,"display")||k===le))}if(0===w||k===r)return U(!1);Ce=r,Ee=w;var S=r.nextElementSibling,O=!1;O=1===w;var P=Je(se,i,ie,t,r,n,e,O);if(!1!==P)return 1!==P&&-1!==P||(O=1===P),We=!0,setTimeout(tt,30),F(),O&&!S?i.appendChild(ie):r.parentNode.insertBefore(ie,O?S:r),T&&X(T,0,D-T.scrollTop),re=ie.parentNode,void 0===b||Me||(Se=Math.abs(b-M(r)[x])),z(),U(!0)}if(i.contains(ie))return U(!1)}return!1}function B(s,d){ae(s,m,l({evt:e,isOwner:u,axis:o?"vertical":"horizontal",revert:a,dragRect:t,targetRect:n,canSort:h,fromSortable:p,target:r,completed:U,onMove:function(n,a){return Je(se,i,ie,t,n,M(n),e,a)},changed:z},d))}function F(){B("dragOverAnimationCapture"),m.captureAnimationState(),m!==p&&p.captureAnimationState()}function U(t){return B("dragOverCompleted",{insertion:t}),t&&(u?c._hideClone():c._showClone(m),m!==p&&(I(ie,be?be.options.ghostClass:c.options.ghostClass,!1),I(ie,s.ghostClass,!0)),be!==m&&m!==Ge.active?be=m:m===Ge.active&&be&&(be=null),p===m&&(m._ignoreWhileAnimating=r),m.animateAll((function(){B("dragOverAnimationComplete"),m._ignoreWhileAnimating=null})),m!==p&&(p.animateAll(),p._ignoreWhileAnimating=null)),(r===ie&&!ie.animated||r===i&&!r.animated)&&(Ce=null),s.dragoverBubble||e.rootEl||r===document||(ie.parentNode[Z]._isOutsideThisEl(e.target),!t&&Ke(e)),!s.dragoverBubble&&e.stopPropagation&&e.stopPropagation(),f=!0}function z(){me=$(ie),ge=$(ie,s.draggable),oe({sortable:m,name:"change",toEl:i,newIndex:me,newDraggableIndex:ge,originalEvent:e})}},_ignoreWhileAnimating:null,_offMoveEvents:function(){x(document,"mousemove",this._onTouchMove),x(document,"touchmove",this._onTouchMove),x(document,"pointermove",this._onTouchMove),x(document,"dragover",Ke),x(document,"mousemove",Ke),x(document,"touchmove",Ke)},_offUpEvents:function(){var e=this.el.ownerDocument;x(e,"mouseup",this._onDrop),x(e,"touchend",this._onDrop),x(e,"pointerup",this._onDrop),x(e,"touchcancel",this._onDrop),x(document,"selectstart",this)},_onDrop:function(e){var t=this.el,n=this.options;me=$(ie),ge=$(ie,n.draggable),ae("drop",this,{evt:e}),re=ie&&ie.parentNode,me=$(ie),ge=$(ie,n.draggable),Ge.eventCanceled||(Ae=!1,Me=!1,Be=!1,clearInterval(this._loopId),clearTimeout(this._dragStartTimer),dt(this.cloneId),dt(this._dragStartId),this.nativeDraggable&&(x(document,"drop",this),x(t,"dragstart",this._onDragStart)),this._offMoveEvents(),this._offUpEvents(),b&&A(document.body,"user-select",""),A(ie,"transform",""),e&&(De&&(e.cancelable&&e.preventDefault(),!n.dropBubble&&e.stopPropagation()),le&&le.parentNode&&le.parentNode.removeChild(le),(se===re||be&&"clone"!==be.lastPutMode)&&ue&&ue.parentNode&&ue.parentNode.removeChild(ue),ie&&(this.nativeDraggable&&x(ie,"dragend",this),et(ie),ie.style["will-change"]="",De&&!Ae&&I(ie,be?be.options.ghostClass:this.options.ghostClass,!1),I(ie,this.options.chosenClass,!1),oe({sortable:this,name:"unchoose",toEl:re,newIndex:null,newDraggableIndex:null,originalEvent:e}),se!==re?(me>=0&&(oe({rootEl:re,name:"add",toEl:re,fromEl:se,originalEvent:e}),oe({sortable:this,name:"remove",toEl:re,originalEvent:e}),oe({rootEl:re,name:"sort",toEl:re,fromEl:se,originalEvent:e}),oe({sortable:this,name:"sort",toEl:re,originalEvent:e})),be&&be.save()):me!==pe&&me>=0&&(oe({sortable:this,name:"update",toEl:re,originalEvent:e}),oe({sortable:this,name:"sort",toEl:re,originalEvent:e})),Ge.active&&(null!=me&&-1!==me||(me=pe,ge=fe),oe({sortable:this,name:"end",toEl:re,originalEvent:e}),this.save())))),this._nulling()},_nulling:function(){ae("nulling",this),se=ie=re=le=de=ue=ce=he=ke=we=De=me=ge=pe=fe=Ce=Ee=be=ve=Ge.dragged=Ge.ghost=Ge.clone=Ge.active=null,Le.forEach((function(e){e.checked=!0})),Le.length=_e=ye=0},handleEvent:function(e){switch(e.type){case"drop":case"dragend":this._onDrop(e);break;case"dragenter":case"dragover":ie&&(this._onDragOver(e),Qe(e));break;case"selectstart":e.preventDefault();break}},toArray:function(){for(var e,t=[],n=this.el.children,a=0,o=n.length,i=this.options;a<o;a++)e=n[a],C(e,i.draggable,this.el,!1)&&t.push(e.getAttribute(i.dataIdAttr)||rt(e));return t},sort:function(e,t){var n={},a=this.el;this.toArray().forEach((function(e,t){var o=a.children[t];C(o,this.options.draggable,a,!1)&&(n[e]=o)}),this),t&&this.captureAnimationState(),e.forEach((function(e){n[e]&&(a.removeChild(n[e]),a.appendChild(n[e]))})),t&&this.animateAll()},save:function(){var e=this.options.store;e&&e.set&&e.set(this)},closest:function(e,t){return C(e,t||this.options.draggable,this.el,!1)},option:function(e,t){var n=this.options;if(void 0===t)return n[e];var a=ee.modifyOption(this,e,t);n[e]="undefined"!==typeof a?a:t,"group"===e&&Xe(n)},destroy:function(){ae("destroy",this);var e=this.el;e[Z]=null,x(e,"mousedown",this._onTapStart),x(e,"touchstart",this._onTapStart),x(e,"pointerdown",this._onTapStart),this.nativeDraggable&&(x(e,"dragover",this),x(e,"dragenter",this)),Array.prototype.forEach.call(e.querySelectorAll("[draggable]"),(function(e){e.removeAttribute("draggable")})),this._onDrop(),this._disableDelayedDragEvents(),Pe.splice(Pe.indexOf(this.el),1),this.el=e=null},_hideClone:function(){if(!he){if(ae("hideClone",this),Ge.eventCanceled)return;A(ue,"display","none"),this.options.removeCloneOnHide&&ue.parentNode&&ue.parentNode.removeChild(ue),he=!0}},_showClone:function(e){if("clone"===e.lastPutMode){if(he){if(ae("showClone",this),Ge.eventCanceled)return;ie.parentNode!=se||this.options.group.revertClone?de?se.insertBefore(ue,de):se.appendChild(ue):se.insertBefore(ue,ie),this.options.group.revertClone&&this.animate(ie,ue),A(ue,"display",""),he=!1}}else this._hideClone()}},$e&&y(document,"touchmove",(function(e){(Ge.active||Ae)&&e.cancelable&&e.preventDefault()})),Ge.utils={on:y,off:x,css:A,find:P,is:function(e,t){return!!C(e,t,e,!1)},extend:j,throttle:Y,closest:C,toggleClass:I,clone:V,index:$,nextTick:st,cancelNextTick:dt,detectDirection:He,getChild:W},Ge.get=function(e){return e[Z]},Ge.mount=function(){for(var e=arguments.length,t=new Array(e),n=0;n<e;n++)t[n]=arguments[n];t[0].constructor===Array&&(t=t[0]),t.forEach((function(e){if(!e.prototype||!e.prototype.constructor)throw"Sortable: Mounted plugin must be a constructor function, not ".concat({}.toString.call(e));e.utils&&(Ge.utils=l(l({},Ge.utils),e.utils)),ee.mount(e)}))},Ge.create=function(e,t){return new Ge(e,t)},Ge.version=p;var ct,ut,ht,pt,mt,ft,gt=[],vt=!1;function bt(){function e(){for(var e in this.defaults={scroll:!0,forceAutoScrollFallback:!1,scrollSensitivity:30,scrollSpeed:10,bubbleScroll:!0},this)"_"===e.charAt(0)&&"function"===typeof this[e]&&(this[e]=this[e].bind(this))}return e.prototype={dragStarted:function(e){var t=e.originalEvent;this.sortable.nativeDraggable?y(document,"dragover",this._handleAutoScroll):this.options.supportPointer?y(document,"pointermove",this._handleFallbackAutoScroll):t.touches?y(document,"touchmove",this._handleFallbackAutoScroll):y(document,"mousemove",this._handleFallbackAutoScroll)},dragOverCompleted:function(e){var t=e.originalEvent;this.options.dragOverBubble||t.rootEl||this._handleAutoScroll(t)},drop:function(){this.sortable.nativeDraggable?x(document,"dragover",this._handleAutoScroll):(x(document,"pointermove",this._handleFallbackAutoScroll),x(document,"touchmove",this._handleFallbackAutoScroll),x(document,"mousemove",this._handleFallbackAutoScroll)),wt(),kt(),R()},nulling:function(){mt=ut=ct=vt=ft=ht=pt=null,gt.length=0},_handleFallbackAutoScroll:function(e){this._handleAutoScroll(e,!0)},_handleAutoScroll:function(e,t){var n=this,a=(e.touches?e.touches[0]:e).clientX,o=(e.touches?e.touches[0]:e).clientY,i=document.elementFromPoint(a,o);if(mt=e,t||this.options.forceAutoScrollFallback||g||f||b){_t(e,this.options,i,t);var r=z(i,!0);!vt||ft&&a===ht&&o===pt||(ft&&wt(),ft=setInterval((function(){var i=z(document.elementFromPoint(a,o),!0);i!==r&&(r=i,kt()),_t(e,n.options,i,t)}),10),ht=a,pt=o)}else{if(!this.options.bubbleScroll||z(i,!0)===B())return void kt();_t(e,this.options,z(i,!1),!1)}}},c(e,{pluginName:"scroll",initializeByDefault:!0})}function kt(){gt.forEach((function(e){clearInterval(e.pid)})),gt=[]}function wt(){clearInterval(ft)}var _t=Y((function(e,t,n,a){if(t.scroll){var o,i=(e.touches?e.touches[0]:e).clientX,r=(e.touches?e.touches[0]:e).clientY,l=t.scrollSensitivity,s=t.scrollSpeed,d=B(),c=!1;ut!==n&&(ut=n,kt(),ct=t.scroll,o=t.scrollFn,!0===ct&&(ct=z(n,!0)));var u=0,h=ct;do{var p=h,m=M(p),f=m.top,g=m.bottom,v=m.left,b=m.right,k=m.width,w=m.height,_=void 0,y=void 0,x=p.scrollWidth,T=p.scrollHeight,D=A(p),C=p.scrollLeft,E=p.scrollTop;p===d?(_=k<x&&("auto"===D.overflowX||"scroll"===D.overflowX||"visible"===D.overflowX),y=w<T&&("auto"===D.overflowY||"scroll"===D.overflowY||"visible"===D.overflowY)):(_=k<x&&("auto"===D.overflowX||"scroll"===D.overflowX),y=w<T&&("auto"===D.overflowY||"scroll"===D.overflowY));var S=_&&(Math.abs(b-i)<=l&&C+k<x)-(Math.abs(v-i)<=l&&!!C),I=y&&(Math.abs(g-r)<=l&&E+w<T)-(Math.abs(f-r)<=l&&!!E);if(!gt[u])for(var O=0;O<=u;O++)gt[O]||(gt[O]={});gt[u].vx==S&&gt[u].vy==I&&gt[u].el===p||(gt[u].el=p,gt[u].vx=S,gt[u].vy=I,clearInterval(gt[u].pid),0==S&&0==I||(c=!0,gt[u].pid=setInterval(function(){a&&0===this.layer&&Ge.active._onTouchMove(mt);var t=gt[this.layer].vy?gt[this.layer].vy*s:0,n=gt[this.layer].vx?gt[this.layer].vx*s:0;"function"===typeof o&&"continue"!==o.call(Ge.dragged.parentNode[Z],n,t,e,mt,gt[this.layer].el)||X(gt[this.layer].el,n,t)}.bind({layer:u}),24))),u++}while(t.bubbleScroll&&h!==d&&(h=z(h,!1)));vt=c}}),30),yt=function(e){var t=e.originalEvent,n=e.putSortable,a=e.dragEl,o=e.activeSortable,i=e.dispatchSortableEvent,r=e.hideGhostForTarget,l=e.unhideGhostForTarget;if(t){var s=n||o;r();var d=t.changedTouches&&t.changedTouches.length?t.changedTouches[0]:t,c=document.elementFromPoint(d.clientX,d.clientY);l(),s&&!s.el.contains(c)&&(i("spill"),this.onSpill({dragEl:a,putSortable:n}))}};function xt(){}function Tt(){}function Dt(){return"undefined"!==typeof window?window.console:n.g.console}xt.prototype={startIndex:null,dragStart:function(e){var t=e.oldDraggableIndex;this.startIndex=t},onSpill:function(e){var t=e.dragEl,n=e.putSortable;this.sortable.captureAnimationState(),n&&n.captureAnimationState();var a=W(this.sortable.el,this.startIndex,this.options);a?this.sortable.el.insertBefore(t,a):this.sortable.el.appendChild(t),this.sortable.animateAll(),n&&n.animateAll()},drop:yt},c(xt,{pluginName:"revertOnSpill"}),Tt.prototype={onSpill:function(e){var t=e.dragEl,n=e.putSortable,a=n||this.sortable;a.captureAnimationState(),t.parentNode&&t.parentNode.removeChild(t),a.animateAll()},drop:yt},c(Tt,{pluginName:"removeOnSpill"}),Ge.mount(new bt),Ge.mount(Tt,xt);const Ct=Dt();function Et(e){const t=Object.create(null);return function(n){const a=t[n];return a||(t[n]=e(n))}}const St=/-(\w)/g,It=Et((e=>e.replace(St,((e,t)=>t?t.toUpperCase():""))));function At(e){null!==e.parentElement&&e.parentElement.removeChild(e)}function Ot(e,t,n){const a=0===n?e.children[0]:e.children[n-1].nextSibling;e.insertBefore(t,a)}function Pt(e,t){return Object.values(e).indexOf(t)}function Bt(e,t,n,a){if(!e)return[];const o=Object.values(e),i=t.length-a,r=[...t].map(((e,t)=>t>=i?o.length:o.indexOf(e)));return r}function Mt(e,t){this.$nextTick((()=>this.$emit(e.toLowerCase(),t)))}function Nt(e){return t=>{null!==this.realList&&this["onDrag"+e](t),Mt.call(this,e,t)}}function Wt(e){return["transition-group","TransitionGroup"].includes(e)}function Lt(e){if(!e||1!==e.length)return!1;const[{type:t}]=e;return!!t&&Wt(t.name)}function $t(e,t){return t?{...t.props,...t.attrs}:e}const Ft=["Start","Add","Remove","Update","End"],Ut=["Choose","Unchoose","Sort","Filter","Clone"],zt=["Move",...Ft,...Ut].map((e=>"on"+e));let jt=null;const Ht={options:Object,list:{type:Array,required:!1,default:null},noTransitionOnDrag:{type:Boolean,default:!1},clone:{type:Function,default:e=>e},tag:{type:String,default:"div"},move:{type:Function,default:null},componentData:{type:Object,required:!1,default:null},component:{type:String,default:null},modelValue:{type:Array,required:!1,default:null}},Yt=(0,a.aZ)({name:"VueDraggableNext",inheritAttrs:!1,emits:["update:modelValue","move","change",...Ft.map((e=>e.toLowerCase())),...Ut.map((e=>e.toLowerCase()))],props:Ht,data(){return{transitionMode:!1,noneFunctionalComponentMode:!1,headerOffset:0,footerOffset:0,_sortable:{},visibleIndexes:[],context:{}}},render(){const e=this.$slots.default?this.$slots.default():null,t=$t(this.$attrs,this.componentData);return e?(this.transitionMode=Lt(e),(0,a.h)(this.getTag(),t,e)):(0,a.h)(this.getTag(),t,[])},created(){null!==this.list&&null!==this.modelValue&&Ct.error("list props are mutually exclusive! Please set one.")},mounted(){const e={};Ft.forEach((t=>{e["on"+t]=Nt.call(this,t)})),Ut.forEach((t=>{e["on"+t]=Mt.bind(this,t)}));const t=Object.keys(this.$attrs).reduce(((e,t)=>(e[It(t)]=this.$attrs[t],e)),{}),n=Object.assign({},t,e,{onMove:(e,t)=>this.onDragMove(e,t)});!("draggable"in n)&&(n.draggable=">*");const a=1===this.$el.nodeType?this.$el:this.$el.parentElement;this._sortable=new Ge(a,n),a.__draggable_component__=this,this.computeIndexes()},beforeUnmount(){try{void 0!==this._sortable&&this._sortable.destroy()}catch(e){}},computed:{realList(){return this.list?this.list:this.modelValue}},watch:{$attrs:{handler(e){this.updateOptions(e)},deep:!0},realList(){this.computeIndexes()}},methods:{getTag(){return this.component?(0,a.up)(this.component):this.tag},updateOptions(e){for(var t in e){const n=It(t);-1===zt.indexOf(n)&&this._sortable.option(n,e[t])}},getChildrenNodes(){return this.$el.children},computeIndexes(){this.$nextTick((()=>{this.visibleIndexes=Bt(this.getChildrenNodes(),this.$el.children,this.transitionMode,this.footerOffset)}))},getUnderlyingVm(e){const t=Pt(this.getChildrenNodes()||[],e);if(-1===t)return null;const n=this.realList[t];return{index:t,element:n}},emitChanges(e){this.$nextTick((()=>{this.$emit("change",e)}))},alterList(e){if(this.list)return void e(this.list);const t=[...this.modelValue];e(t),this.$emit("update:modelValue",t)},spliceList(){const e=e=>e.splice(...arguments);this.alterList(e)},updatePosition(e,t){const n=n=>n.splice(t,0,n.splice(e,1)[0]);this.alterList(n)},getVmIndex(e){const t=this.visibleIndexes,n=t.length;return e>n-1?n:t[e]},getComponent(){return this.$slots.default?this.$slots.default()[0].componentInstance:null},resetTransitionData(e){if(!this.noTransitionOnDrag||!this.transitionMode)return;var t=this.getChildrenNodes();t[e].data=null;const n=this.getComponent();n.children=[],n.kept=void 0},onDragStart(e){this.context=this.getUnderlyingVm(e.item),this.context&&(e.item._underlying_vm_=this.clone(this.context.element),jt=e.item)},onDragAdd(e){const t=e.item._underlying_vm_;if(void 0===t)return;At(e.item);const n=this.getVmIndex(e.newIndex);this.spliceList(n,0,t),this.computeIndexes();const a={element:t,newIndex:n};this.emitChanges({added:a})},onDragRemove(e){if(Ot(this.$el,e.item,e.oldIndex),"clone"===e.pullMode)return void At(e.clone);if(!this.context)return;const t=this.context.index;this.spliceList(t,1);const n={element:this.context.element,oldIndex:t};this.resetTransitionData(t),this.emitChanges({removed:n})},onDragUpdate(e){At(e.item),Ot(e.from,e.item,e.oldIndex);const t=this.context.index,n=this.getVmIndex(e.newIndex);this.updatePosition(t,n);const a={element:this.context.element,oldIndex:t,newIndex:n};this.emitChanges({moved:a})},updateProperty(e,t){e.hasOwnProperty(t)&&(e[t]+=this.headerOffset)},onDragMove(e,t){const n=this.move;if(!n||!this.realList)return!0;const a=this.getRelatedContextFromMoveEvent(e),o=this.context,i=this.computeFutureIndex(a,e);Object.assign(o,{futureIndex:i});const r=Object.assign({},e,{relatedContext:a,draggedContext:o});return n(r,t)},onDragEnd(){this.computeIndexes(),jt=null},getTrargetedComponent(e){return e.__draggable_component__},getRelatedContextFromMoveEvent({to:e,related:t}){const n=this.getTrargetedComponent(e);if(!n)return{component:n};const a=n.realList,o={list:a,component:n};if(e!==t&&a&&n.getUnderlyingVm){const e=n.getUnderlyingVm(t);if(e)return Object.assign(e,o)}return o},computeFutureIndex(e,t){const n=[...t.to.children].filter((e=>"none"!==e.style["display"]));if(0===n.length)return 0;const a=n.indexOf(t.related),o=e.component.getVmIndex(a),i=-1!==n.indexOf(jt);return i||!t.willInsertAfter?o:o+1}}});var Rt=n(16096),Xt=(0,a.aZ)({name:"TaskItem",components:{VueDraggableNext:Yt,KanbanBoardItem:Rt["default"]},props:["id","taskId","onBackShadow","onTaskTitleUpdate","onTaskTitleDelete","showModal"],computed:{taskData:{get(){return this.$store.state.KanbanBoard.taskData}}},methods:{checkMove(e){const t=e.to.getAttribute("data-boardId"),n=e.item.getAttribute("data-keyId"),a=this.$store.state.KanbanBoard.taskData.map((e=>(e.id==n&&(e.boardId=t),e)));this.$store.dispatch("ToAddTask",a)}}}),Vt=n(83744);const Zt=(0,Vt.Z)(Xt,[["render",i]]);var Kt=Zt},70305:function(e,t,n){n.r(t),n.d(t,{default:function(){return $}});var a=n(66252),o=n(3577);const i={class:"ant-modal-title"},r=(0,a._)("span",{class:"sub-text"},"in list Active Project",-1),l={class:"sDash_task-details-modal"},s={class:"sDash_task-details-modal__description"},d=(0,a._)("span",{class:"sDash_task-details__label"},"Description",-1),c={key:0},u={class:"sDash_checklist-block"},h={class:"addChecklist-wrap"},p=(0,a._)("span",null,"Add Checklist",-1),m={key:0,class:"addChecklist-form"},f={class:"addChecklist-form-action"},g={class:"sDash_checklist-row"},v={class:"sDash_checklist-item__top"},b={class:"sDash_checklist-item__title"},k={class:"sDash_checklist__progress"},w={class:"sDash_checklist-tasks-wrap"},_={class:"sDash_checklist-tasks"},y={class:"sDash_task-label"},x=["onClick"],T=(0,a._)("span",null,"Delete List",-1),D=[T],C={href:"#",class:"btn-more"},E={class:"addChecklistTask-wrap"},S={key:1,class:"addChecklistTask-form"},I={class:"addChecklistTask-form-action"};function A(e,t,n,T,A,O){const P=(0,a.up)("sdHeading"),B=(0,a.up)("a-textarea"),M=(0,a.up)("sdFeatherIcons"),N=(0,a.up)("sdButton"),W=(0,a.up)("a-input"),L=(0,a.up)("a-progress"),$=(0,a.up)("a-checkbox"),F=(0,a.up)("sdDropdown"),U=(0,a.up)("ChecklistWrap"),z=(0,a.up)("sdModal");return(0,a.wg)(),(0,a.j4)(z,{class:"sDash_task-details",visible:e.modalVisible,footer:null,onCancel:e.handleCancel},{title:(0,a.w5)((()=>[(0,a._)("div",i,[(0,a.Wm)(P,{as:"h4"},{default:(0,a.w5)((()=>[(0,a.Uk)((0,o.zw)(e.data.title),1)])),_:1}),r])])),default:(0,a.w5)((()=>[(0,a._)("div",l,[(0,a._)("div",s,[d,(0,a.Wm)(B,{name:"task-details-label",placeholder:"Add a more detailed description…"})])]),e.isLoading?((0,a.wg)(),(0,a.iD)("div",c)):((0,a.wg)(),(0,a.j4)(U,{key:1},{default:(0,a.w5)((()=>[(0,a._)("div",u,[(0,a._)("div",h,[(0,a.Wm)(N,{onClick:e.handleTaskEdit,class:"btn-checklist",type:"primary"},{default:(0,a.w5)((()=>[(0,a.Wm)(M,{type:"check-square",size:"14"}),p])),_:1},8,["onClick"]),e.editable?((0,a.wg)(),(0,a.iD)("div",m,[(0,a.Wm)(W,{name:"checkListInputValue",class:"add-checklist",placeholder:"Checklist Title",onPressEnter:t[0]||(t[0]=()=>e.onCheckListSubmit(e.data.id,e.data.boardId,e.data.checklist))}),(0,a._)("div",f,[(0,a.Wm)(N,{onClick:t[1]||(t[1]=()=>e.onCheckListSubmit(e.data.id,e.data.boardId,e.data.checklist)),class:"btn-add",size:"small",type:"primary"},{default:(0,a.w5)((()=>[(0,a.Uk)(" Add ")])),_:1}),(0,a._)("a",{onClick:t[2]||(t[2]=(...t)=>e.onCancelEdit&&e.onCancelEdit(...t)),href:"#"},[(0,a.Wm)(M,{type:"x",size:"18"})])])])):(0,a.kq)("",!0)]),(0,a._)("div",g,[((0,a.wg)(!0),(0,a.iD)(a.HY,null,(0,a.Ko)(e.data.checklist,((n,i)=>((0,a.wg)(),(0,a.iD)("div",{class:"sDash_checklist-item",key:i},[(0,a._)("div",v,[(0,a._)("h4",b,(0,o.zw)(n.label),1),(0,a.Wm)(N,{onClick:t=>e.onCheckListDelete(e.data.id,e.data.boardId,e.data.checklist,n.id,t),class:"btn-delete",type:"light"},{default:(0,a.w5)((()=>[(0,a.Uk)(" Delete ")])),_:2},1032,["onClick"])]),(0,a._)("div",k,[n.checkListTask.length?((0,a.wg)(),(0,a.j4)(L,{key:0,percent:Math.round(100*n.checkListTask.filter((e=>!0===e.checked)).length/n.checkListTask.length)},null,8,["percent"])):(0,a.kq)("",!0)]),(0,a._)("div",w,[(0,a._)("ul",_,[((0,a.wg)(!0),(0,a.iD)(a.HY,null,(0,a.Ko)(n.checkListTask,((t,i)=>((0,a.wg)(),(0,a.iD)("li",{class:"sDash_checklist-tasks__single",key:i},[(0,a.Wm)($,{checked:t.checked,"onUpdate:checked":e=>t.checked=e,onChange:a=>e.onChange(a.target.checked,n.id,t.id)},{default:(0,a.w5)((()=>[(0,a._)("span",y,(0,o.zw)(t.label),1)])),_:2},1032,["checked","onUpdate:checked","onChange"]),(0,a.Wm)(F,{action:["click"],class:"wide-dropdwon kanbanCard-more"},{overlay:(0,a.w5)((()=>[(0,a._)("a",{onClick:()=>e.onCheckListItemDelete(n.id,t.id),href:"#"},D,8,x)])),default:(0,a.w5)((()=>[(0,a._)("a",C,[(0,a.Wm)(M,{type:"more-horizontal",size:"14"})])])),_:2},1024)])))),128))]),(0,a._)("div",E,[e.checkListPopup!==`cp-${n.id}`?((0,a.wg)(),(0,a.j4)(N,{key:0,onClick:()=>e.onShowChecklistAddPopup(`cp-${n.id}`),class:"add-item",type:"light"},{default:(0,a.w5)((()=>[(0,a.Uk)(" Add an Item ")])),_:2},1032,["onClick"])):((0,a.wg)(),(0,a.iD)("div",S,[(0,a.Wm)(W,{name:"checkListAddInputValue",class:"add-checklistTask",placeholder:"Checklist Title",onPressEnter:()=>e.onCheckListItemAdd(n.id,n.checkListTask)},null,8,["onPressEnter"]),(0,a._)("div",I,[(0,a.Wm)(N,{onClick:()=>e.onCheckListItemAdd(n.id,n.checkListTask),class:"btn-add",size:"small",type:"primary"},{default:(0,a.w5)((()=>[(0,a.Uk)(" Add ")])),_:2},1032,["onClick"]),(0,a._)("a",{onClick:t[3]||(t[3]=(...t)=>e.onHideChecklistAddPopup&&e.onHideChecklistAddPopup(...t)),href:"#"},[(0,a.Wm)(M,{type:"x",size:"18"})])])]))])])])))),128))])])])),_:1}))])),_:1},8,["visible","onCancel"])}n(57658);var O=n(2262),P=n(5298),B=n(33907),M=n(67125),N=(0,a.aZ)({name:"UpdateTaskList",components:{ChecklistWrap:M.ChecklistWrap},props:{data:P.ZP.object,modalVisible:P.ZP.bool,handleCancel:P.ZP.func},setup(e){const{data:t}=(0,O.BK)(e),{state:n,dispatch:o}=(0,B.oR)(),i=(0,a.Fl)((()=>n.KanbanBoard.taskData)),r=(0,a.Fl)((()=>n.KanbanBoard.tsLoading)),l=(0,O.iH)(!1),s=(0,O.iH)(""),d=()=>{l.value=!l.value},c=e=>{e.preventDefault(),l.value=!1},u=(e,n,a)=>{i.value.map((o=>(t.value.id===o.id&&o.checklist.map((t=>(t.id===n&&t.checkListTask.map((t=>(t.id===a&&(t.checked=e),t))),t))),o))),o("ToAddTask",i.value)},h=(e,n)=>{const a=window.confirm("Are you sure to delete this?");return a&&(i.value.map((a=>(t.value.id===a.id&&a.checklist.map((t=>{if(t.id===e){const e=t.checkListTask.filter((e=>e.id!==n));t.checkListTask=e}return t})),a))),o("ToAddTask",i.value)),!1},p=(e,n)=>{const a=[],r=document.querySelector('input[name="checkListAddInputValue"]').value;n.map((e=>a.push(e.id)));const l=n.length?Math.max(...a):0;i.value.map((a=>(t.value.id===a.id&&a.checklist.map((t=>(t.id===e&&(t.checkListTask=[...n,{id:`${l+1}`,label:r,checked:!1}]),t))),a))),o("ToAddTask",i.value),s.value=""},m=(e,t,n)=>{const a=[],r=document.querySelector('input[name="checkListInputValue"]').value;n.map((e=>a.push(e.id)));const s=n.length?Math.max(...a):0;i.value.map((a=>a.id===e&&a.boardId===t?a.checklist=[...n,{id:`${s+1}`,label:r,checkListTask:[]}]:a)),o("ToAddTask",i.value),l.value=!1},f=(e,t,n,a,r)=>{r.preventDefault();const l=window.confirm("Are you sure to delete this?");return l&&(i.value.map((o=>o.id===e&&o.boardId===t?o.checklist=n.filter((e=>e.id!==a)):o)),o("ToAddTask",i.value)),!1},g=e=>{s.value=e},v=()=>{s.value=""};return{onCheckListItemDelete:h,onCheckListItemAdd:p,onCheckListSubmit:m,onCheckListDelete:f,onShowChecklistAddPopup:g,onHideChecklistAddPopup:v,tasks:i,editable:l,checkListPopup:s,handleTaskEdit:d,onCancelEdit:c,onChange:u,isLoading:r}}}),W=n(83744);const L=(0,W.Z)(N,[["render",A]]);var $=L}}]);
//# sourceMappingURL=6381.9d6b8df7.js.map