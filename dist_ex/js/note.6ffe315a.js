"use strict";(self["webpackChunkMassNetCampaign"]=self["webpackChunkMassNetCampaign"]||[]).push([[6793],{47920:function(t,e,a){a.r(e),a.d(e,{Bullet:function(){return m},MailRightAction:function(){return d},MessageAction:function(){return p},NoteCardWrap:function(){return s},NoteNav:function(){return n},NoteWrapper:function(){return c},Span:function(){return i},Style:function(){return r}});a(54346);var l=a(81701),o=a(23481);const i=o.ZP.span`
    &.active{
        color: green;
        text-decoration: line-through;
    }
`,r=(0,o.ZP)(l.ZP)`
  margin-bottom: 30px;  
  .ant-table{
    padding-bottom: 30px;
    border-radius: 10px;
    tr{
      th,
      td{
        &:first-child{
          ${({theme:t})=>t.rtl?"padding-right":"padding-left"}: 30px;
        }
        &:last-child{
          ${({theme:t})=>t.rtl?"padding-left":"padding-right"}: 30px;
        }
      }
    }
    .ant-table-selection-extra{
      /* ${({theme:t})=>t.rtl?"right: 15px;":"left: -15px;"} */
      right: 15px;
    }
  }
  .ant-table-thead{
    >tr{
      >th{
        background: #fff;
        &:first-child{
          ${({theme:t})=>t.rtl?"padding-left":"padding-right"}: 20px;
          border-top-left-radius: 10px !important;
        }
        &:last-child{
          border-top-right-radius: 10px !important;
        }
        .ant-table-selection-extra{
          ${({theme:t})=>t.rtl?"left":"right"}: -25px
        }
        .ant-dropdown-trigger{
          svg{
            width: 20px;
            color: ${({theme:t})=>t["gray-solid"]};
          }
        }
        .email-top-search{
          display: flex;
          justify-content: ${({theme:t})=>t.rtl?"flex-start":"flex-end"};
          align-items: center;
          @media only screen and (max-width: 575px){
            display: none;
          }
          .ant-select{
            max-width: 350px;
          }
          .ant-select-selector{
            height: 46px !important;
          }
          .ant-select-selection-search{
            width: 100% !important;
            .ant-select-selection-search-input{
              text-align: right;
              border-radius: 24px;
              background: ${({theme:t})=>t["bg-color-normal"]};
              border: 0 none;
              input{
                height: 44px !important;
                background: ${({theme:t})=>t["bg-color-normal"]};
                &:placeholder{
                  color: ${({theme:t})=>t["extra-light-color"]};
                }
              }
              .ant-input-suffix{
                ${({theme:t})=>t.rtl?"margin-left":"margin-right"}: 0;
                .anticon-search{
                  svg{
                    color: ${({theme:t})=>t["gray-solid"]};
                  }
                }
              }
            }
          }
        }
        .email-top-right{
          justify-content: flex-end;
          .email-extra{
            line-height: 1;
            a{
              color: ${({theme:t})=>t["gray-solid"]};
              &:not(:last-child){
                ${({theme:t})=>t.rtl?"margin-left":"margin-right"}: 25px;
              }
            }
          }
          .page-number{
            display: inline-block
            font-size: 14px;
            font-weight: 400;
            color: ${({theme:t})=>t["light-color"]};
            @media only screen and (max-width: 575px){
              display: none;
            }
          }
          .pagination-slider{
            margin: ${({theme:t})=>t.rtl?"0 15px 0 20px":"0 20px 0 15px"};
            .btn-paging{
              display: inline-flex;
              height: 30px;
              width: 30px;
              border-radius: 50%;
              align-items: center;
              justify-content: center;
              &:hover{
                background: ${({theme:t})=>t["primary-color"]}10;
              }
              svg{
                color: ${({theme:t})=>t["light-color"]};
              }
            }
          }
        }
      }
    }
  }

  
  .ant-table-tbody{
    .ant-table-cell{
      white-space: normal !important;
      text-align: ${({theme:t})=>t.rtl?"right":"left"};
    }
    >tr{
      &:hover{
        box-shadow: 0 15px 40px ${({theme:t})=>t["gray-solid"]}20;
        h1{
          font-weight: 600;
          color: ${({theme:t})=>t["dark-color"]};
          a{
            color: ${({theme:t})=>t["dark-color"]};
          }
        }
        .email-time{
          font-weight: 500;
          color: ${({theme:t})=>t["dark-color"]};
        }
        >td{
          background: #fff !important;
          border-color: #ffffff;
        }
      }
      h1 a{
        font-weight: 500;
        transition: 0s;
      }
      &.ant-table-row-selected{
        &:hover{
            >td{
              background: #fff;
            }
        }
        >td{
          background: #fff;
        }
      }
      >td{
        padding: 15px 16px;
        &:last-child{
          text-align: ${({theme:t})=>t.rtl?"left":"right"};
        }
        .ant-checkbox-wrapper{
          margin-top: 5px;
        }
        .email-time{
          font-size: 13px;
          font-weight: 400;
          color: ${({theme:t})=>t["gray-color"]};
        }
      }
    }
  }
  .ant-table-thead > tr > th .ant-table-header-column {
    width: 100%;
  }
  .ant-table-thead > tr:first-child > th:last-child {
    border-top-right-radius: 4px;
    text-align: ${({theme:t})=>t.rtl?"left":"right"};
  }
  .ant-pagination-item {
    display: none;
  }
  .ant-table-pagination.ant-pagination {
    position: absolute;
    z-index: 1;
    ${({theme:t})=>t.rtl?"left":"right"}: 0;
  }
  
`,n=o.ZP.nav`
  ul{
    list-style: none;
    margin: 20px 0;
    padding: 0;
    li{
      position: relative;
      &.add-label-btn{
        &:hover{
          background: transparent;
          a{
            background: transparent;
            color: ${({theme:t})=>t["primary-color"]} !important;
          }
        }
        a{
          color: ${({theme:t})=>t["light-color"]} !important;
          transition: .3s;
          &:hover{
            background: transparent;
            svg,
            i,
            span{
              color: ${({theme:t})=>t["primary-color"]};
            }
          }
        }
      }
      a{
        padding: 8px 20px;
        display: flex;
        align-items: center;
        transition: 0.3s ease;
        border-radius: 4px;
        color: ${({theme:t})=>t["gray-color"]};
        svg{
          min-width: 18px;
          ${({theme:t})=>t.rtl?"margin-left":"margin-right"}: 14px;
          color: ${({theme:t})=>t["extra-light-color"]};
        }
        &.active{
          background: rgba(95,99,242,0.1);
          color: ${({theme:t})=>t["primary-color"]};
          svg,
          i{
            color: ${({theme:t})=>t["primary-color"]};
          }
        }
      }

      &:hover{
        a{
          background: rgba(95,99,242,0.1);
          color: ${({theme:t})=>t["primary-color"]};
          svg,
          i{
            color: ${({theme:t})=>t["primary-color"]};
          }
        }
      }
      .nav-text{
        width: 100%;
        display: flex;
        justify-content: space-between;
      }
      .add-label{
        box-shadow: 0 10px 40px rgba(146,153,184,0.2);
        padding: 25px 30px;
        position: relative;
        width: calc(100% + 60px);
        ${({theme:t})=>t.rtl?"right":"left"}: 50%;
        transform: translateX(-50%);
        background: #fff;
        border-radius: 8px;
        @media only screen and (max-width: 1199px){
          width: calc(100% + 40px);
          padding: 15px;
        }
        h1{
          text-align: left;
          font-size: 16px;
          line-height: 20px;
          margin-bottom: 16px;
          font-weight: 500;
          transition: .3s;
          color: ${({theme:t})=>t["dark-color"]};
        }
        input{
          height: 44px;
          border-radius: 2px;
          border: 1px solid ${({theme:t})=>t["border-color-light"]};
        }
        .btn-group{
          margin-top: 15px;
          display: flex;
          align-items: center;
          flex-wrap: wrap;
          margin: 10px -5px -5px;
          button{
            margin: 5px;
            height: 38px;
          }
          .ant-btn-default{
            padding: 0 12px;
            color: ${({theme:t})=>t["light-color"]};
          }
        }
      }
    }
  }
  .nav-labels{
    margin-top: 35px;
    p{
      font-size: 12px;
      text-align: left;
      margin: 0;
      padding: 0 15px;
      color: #9299b8;
      text-align: ${({theme:t})=>t.rtl?"right":"left"};
      img,
      svg,
      i{
        ${({theme:t})=>t.rtl?"margin-left":"margin-right"}: 6px;
      }
    }
    ul{
      margin-top: 6px;
      margin-bottom: 0;
    }
  }
`,p=o.ZP.div`
  display: flex;
  align-items: center;
  margin: 0 -5px;
  @media only screen and (max-width: 575px){
    flex-flow: row !important;
    margin-bottom: 5px;
  }
  a{
    display: flex;
    align-items: center;
    justify-content: center;
    width: 38px;
    height: 38px;
    border-radius: 50%;
    margin: 0 4px;
    transition: 0.3s ease;
    @media only screen and (max-width: 575px){
      width: 25px;
      height: 25px;
    }
    svg{
      width: 16px;
      color: ${({theme:t})=>t["gray-solid"]};
    }
    &:hover{
      background: rgba(95,99,242,0.05);
      svg{
        color: ${({theme:t})=>t["primary-color"]};
      }
    }
  }
`,d=o.ZP.div`
  span{
    color: ${({theme:t})=>t["light-color"]};
  }
`,s=o.ZP.div`
  min-height: 625px;
  @media only screen and (max-width: 1199px){
    min-height: 100%;
  }
`,c=o.ZP.div`
  position: relative;
  .sidebar-card{
    .ant-card{
      min-height: 710px;
      .ant-card-body{
        padding: 25px 0 !important;
      }
    }
  }
  .ant-card-body{
    padding: 30px 30px 0 30px !important;
  }
  .trigger-close.ant-btn-link{
    margin: 0 !important;
    position: absolute;
    ${({theme:t})=>t.rtl?"left":"right"}: 20px;
    top: 20px;
    z-index: 99;
    padding: 0;
    background: transparent !important;
  }
  .trigger-col {
    @media only screen and (max-width: 991px){
      text-align: center;
    }
  }
  .ant-btn-link{
    background: #fff !important;
    margin-bottom: 25px;
    border-radius: 6px;
    color: ${({theme:t})=>t["primary-color"]} !important;
    &:focus{
      color: ${({theme:t})=>t["primary-color"]} !important;
    }
  }
  .note-sideabr{
    &.hide{
      transform: translateX(${({theme:t})=>t.rtl?"100%":"-100%"});
      transition: .35s ease-in;
    }
    &.show{
      transform: translateX(0%);
      transition: .35s ease-in;
    }
    @media only screen and (max-width: 991px){
      display: block;
      background: #fff;
      position: fixed;
      ${({theme:t})=>t.rtl?"right":"left"}: 0;
      top: 60px;
      width: 280px;
      height: 100%;
      z-index: 99;
    }
    .ant-card{
      min-height: 900px;
      .ant-card-body{
        padding: 0px !important;
      }
    }
  }

  .note-sidebar-top{
    padding: 30px 30px 0;
    @media only screen and (max-width: 991px){
      padding: 60px 30px 0;
    }
    .ant-btn{
      height: 44px;
    }
  }

  .note-sidebar-bottom{
    padding: 0 15px 25px 15px;
  }

  table{
    .ant-table-tbody{
      .ant-table-cell{
        vertical-align: top;
      }
    }
  }
`,m=o.ZP.span`
    width: 10px;
    height: 10px;
    border-radius: 50%;
    ${({theme:t})=>t.rtl?"margin-left":"margin-right"}: 10px;
    &.personal{
        background: #5F63F2;
    }
    &.work{
        background: #20C997;
    }
    &.social{
        background: #FA8B0C;
    }
    &.important{
        background: #2C99FF;
    }
`},87687:function(t,e,a){a.r(e),a.d(e,{default:function(){return z}});var l=a(66252),o=a(3577);const i={class:"page-header-actions"},r=(0,l._)("span",null,"Add New",-1),n={key:1,class:"sidebar-card"},p={class:"note-sidebar-top"},d={class:"note-sidebar-bottom"},s=(0,l._)("span",{class:"nav-text"},[(0,l._)("span",null,"All")],-1),c=(0,l._)("span",{class:"nav-text"},[(0,l._)("span",null,"Favorites")],-1),m={class:"nav-labels"},u=["src"],h={class:"note-sidebar-top"},g={class:"note-sidebar-bottom"},x=(0,l._)("span",{class:"nav-text"},[(0,l._)("span",null,"All")],-1),f=(0,l._)("span",{class:"nav-text"},[(0,l._)("span",null,"Favorites")],-1),b={class:"nav-labels"},w=["src"],k={class:"project-modal"};function v(t,e,v,y,_,W){const $=(0,l.up)("sdCalendarButton"),A=(0,l.up)("sdExportButton"),C=(0,l.up)("sdShareButton"),S=(0,l.up)("sdFeatherIcons"),N=(0,l.up)("sdButton"),U=(0,l.up)("sdPageHeader"),z=(0,l.up)("router-link"),B=(0,l.up)("Bullet"),F=(0,l.up)("NoteNav"),Z=(0,l.up)("sdCards"),M=(0,l.up)("a-col"),j=(0,l.up)("router-view"),H=(0,l.up)("a-row"),P=(0,l.up)("NoteWrapper"),E=(0,l.up)("a-input"),I=(0,l.up)("a-form-item"),R=(0,l.up)("a-textarea"),T=(0,l.up)("a-select-option"),Y=(0,l.up)("a-select"),D=(0,l.up)("a-form"),L=(0,l.up)("BasicFormWrapper"),Q=(0,l.up)("a-modal"),X=(0,l.up)("Main");return(0,l.wg)(),(0,l.iD)(l.HY,null,[(0,l.Wm)(U,{title:"Note"},{buttons:(0,l.w5)((()=>[(0,l._)("div",i,[(0,l.Wm)($),(0,l.Wm)(A),(0,l.Wm)(C),(0,l.Wm)(N,{size:"small",type:"primary"},{default:(0,l.w5)((()=>[(0,l.Wm)(S,{type:"plus",size:"14"}),r])),_:1})])])),_:1}),(0,l.Wm)(X,null,{default:(0,l.w5)((()=>[(0,l.Wm)(P,null,{default:(0,l.w5)((()=>[(0,l.Wm)(H,{class:"justify-content-center",gutter:25},{default:(0,l.w5)((()=>[(0,l.Wm)(M,{class:"trigger-col",xxl:5,xl:7,lg:9,xs:24},{default:(0,l.w5)((()=>[t.responsive<=991?((0,l.wg)(),(0,l.j4)(N,{key:0,type:"link",class:"mail-sidebar-trigger",style:{marginTop:0},onClick:t.toggleCollapsed},{default:(0,l.w5)((()=>[(0,l.Wm)(S,{type:t.collapsed?"align-left":"align-right"},null,8,["type"])])),_:1},8,["onClick"])):(0,l.kq)("",!0),t.responsive>991?((0,l.wg)(),(0,l.iD)("div",n,[(0,l.Wm)(Z,{headless:""},{default:(0,l.w5)((()=>[(0,l._)("div",p,[(0,l.Wm)(N,{onClick:t.showModal,shape:"round",type:"primary",size:"default",block:""},{default:(0,l.w5)((()=>[(0,l.Wm)(S,{type:"plus",size:"18"}),(0,l.Uk)(" Add Notes ")])),_:1},8,["onClick"])]),(0,l._)("div",d,[(0,l.Wm)(F,null,{default:(0,l.w5)((()=>[(0,l._)("ul",null,[(0,l._)("li",null,[(0,l.Wm)(z,{to:`${t.path}/all`},{default:(0,l.w5)((()=>[(0,l.Wm)(S,{type:"edit",size:"18"}),s])),_:1},8,["to"])]),(0,l._)("li",null,[(0,l.Wm)(z,{to:`${t.path}/favorite`},{default:(0,l.w5)((()=>[(0,l.Wm)(S,{type:"star",size:"18"}),c])),_:1},8,["to"])])]),(0,l._)("div",m,[(0,l._)("p",null,[(0,l._)("img",{src:a(36887),alt:"icon"},null,8,u),(0,l.Uk)(" Labels ")]),(0,l._)("ul",null,[(0,l._)("li",null,[(0,l.Wm)(z,{to:`${t.path}/personal`},{default:(0,l.w5)((()=>[(0,l.Wm)(B,{class:"personal"}),(0,l.Uk)(" Personal ")])),_:1},8,["to"])]),(0,l._)("li",null,[(0,l.Wm)(z,{to:`${t.path}/work`},{default:(0,l.w5)((()=>[(0,l.Wm)(B,{class:"work"}),(0,l.Uk)(" Work ")])),_:1},8,["to"])]),(0,l._)("li",null,[(0,l.Wm)(z,{to:`${t.path}/social`},{default:(0,l.w5)((()=>[(0,l.Wm)(B,{class:"social"}),(0,l.Uk)(" Social ")])),_:1},8,["to"])]),(0,l._)("li",null,[(0,l.Wm)(z,{to:`${t.path}/important`},{default:(0,l.w5)((()=>[(0,l.Wm)(B,{class:"important"}),(0,l.Uk)(" Important ")])),_:1},8,["to"])])])])])),_:1})])])),_:1})])):((0,l.wg)(),(0,l.iD)("div",{key:2,class:(0,o.C_)(t.collapsed?"sidebar-card note-sideabr show":"sidebar-card note-sideabr hide")},[(0,l.Wm)(Z,{headless:""},{default:(0,l.w5)((()=>[(0,l.Wm)(N,{type:"link",class:"mail-sidebar-trigger trigger-close",style:{marginTop:0},onClick:t.toggleCollapsed},{default:(0,l.w5)((()=>[(0,l.Wm)(S,{type:"x"})])),_:1},8,["onClick"]),(0,l._)("div",h,[(0,l.Wm)(N,{onClick:t.showModal,shape:"round",type:"primary",size:"default",block:""},{default:(0,l.w5)((()=>[(0,l.Wm)(S,{type:"plus",size:"18"}),(0,l.Uk)(" Add Notes ")])),_:1},8,["onClick"])]),(0,l._)("div",g,[(0,l.Wm)(F,null,{default:(0,l.w5)((()=>[(0,l._)("ul",null,[(0,l._)("li",null,[(0,l.Wm)(z,{to:`${t.path}/all`,onClick:t.collapseSidebar},{default:(0,l.w5)((()=>[(0,l.Wm)(S,{type:"edit",size:"18"}),x])),_:1},8,["to","onClick"])]),(0,l._)("li",null,[(0,l.Wm)(z,{to:`${t.path}/favorite`,onClick:t.collapseSidebar},{default:(0,l.w5)((()=>[(0,l.Wm)(S,{type:"star",size:"18"}),f])),_:1},8,["to","onClick"])])]),(0,l._)("div",b,[(0,l._)("p",null,[(0,l._)("img",{src:a(36887),alt:"icon"},null,8,w),(0,l.Uk)(" Labels ")]),(0,l._)("ul",null,[(0,l._)("li",null,[(0,l.Wm)(z,{to:`${t.path}/personal`,onClick:t.collapseSidebar},{default:(0,l.w5)((()=>[(0,l.Wm)(B,{class:"personal"}),(0,l.Uk)(" Personal ")])),_:1},8,["to","onClick"])]),(0,l._)("li",null,[(0,l.Wm)(z,{to:`${t.path}/work`,onClick:t.collapseSidebar},{default:(0,l.w5)((()=>[(0,l.Wm)(B,{class:"work"}),(0,l.Uk)(" Work ")])),_:1},8,["to","onClick"])]),(0,l._)("li",null,[(0,l.Wm)(z,{to:`${t.path}/social`,onClick:t.collapseSidebar},{default:(0,l.w5)((()=>[(0,l.Wm)(B,{class:"social"}),(0,l.Uk)(" Social ")])),_:1},8,["to","onClick"])]),(0,l._)("li",null,[(0,l.Wm)(z,{to:`${t.path}/important`,onClick:t.collapseSidebar},{default:(0,l.w5)((()=>[(0,l.Wm)(B,{class:"important"}),(0,l.Uk)(" Important ")])),_:1},8,["to","onClick"])])])])])),_:1})])])),_:1})],2))])),_:1}),(0,l.Wm)(M,{xxl:19,xl:17,lg:15,xs:24},{default:(0,l.w5)((()=>[(0,l.Wm)(j,{name:"child"})])),_:1})])),_:1})])),_:1}),(0,l.Wm)(Q,{type:t.modalType,title:null,visible:t.visible,footer:null,onCancel:t.handleCancel},{default:(0,l.w5)((()=>[(0,l._)("div",k,[(0,l.Wm)(L,null,{default:(0,l.w5)((()=>[(0,l.Wm)(D,{name:"createProject",model:t.formState,onFinish:t.handleOk,layout:t.formState.layout},{default:(0,l.w5)((()=>[(0,l.Wm)(I,{name:"title",label:"Title"},{default:(0,l.w5)((()=>[(0,l.Wm)(E,{value:t.formState.title,"onUpdate:value":e[0]||(e[0]=e=>t.formState.title=e),placeholder:"Note Title"},null,8,["value"])])),_:1}),(0,l.Wm)(I,{name:"description",label:"Description"},{default:(0,l.w5)((()=>[(0,l.Wm)(R,{value:t.formState.description,"onUpdate:value":e[1]||(e[1]=e=>t.formState.description=e),rows:4,placeholder:"Note Description"},null,8,["value"])])),_:1}),(0,l.Wm)(I,{name:"label",label:"Note Label"},{default:(0,l.w5)((()=>[(0,l.Wm)(Y,{value:t.formState.label,"onUpdate:value":e[2]||(e[2]=e=>t.formState.label=e),style:{width:"100%"}},{default:(0,l.w5)((()=>[(0,l.Wm)(T,{value:"personal"},{default:(0,l.w5)((()=>[(0,l.Uk)("Personal")])),_:1}),(0,l.Wm)(T,{value:"work"},{default:(0,l.w5)((()=>[(0,l.Uk)("Work")])),_:1}),(0,l.Wm)(T,{value:"social"},{default:(0,l.w5)((()=>[(0,l.Uk)("Social")])),_:1}),(0,l.Wm)(T,{value:"important"},{default:(0,l.w5)((()=>[(0,l.Uk)("Important")])),_:1})])),_:1},8,["value"])])),_:1}),(0,l.Wm)(N,{htmlType:"submit",size:"default",type:"primary",key:"submit"},{default:(0,l.w5)((()=>[(0,l.Uk)(" Add New Note ")])),_:1})])),_:1},8,["model","onFinish","layout"])])),_:1})])])),_:1},8,["type","visible","onCancel"])])),_:1})],64)}a(57658);var y=a(47920),_=a(72984),W=a(33907),$=a(2262),A=a(22201);const C=(0,l.aZ)({name:"Note",components:{NoteNav:y.NoteNav,NoteWrapper:y.NoteWrapper,Bullet:y.Bullet,BasicFormWrapper:_.BasicFormWrapper,Main:_.Main},setup(){const{state:t,dispatch:e}=(0,W.oR)(),a=(0,l.Fl)((()=>t.note.data)),{matched:o}=(0,A.yj)(),{path:i}=o[1],r=(0,$.iH)(!1),n=(0,$.iH)("primary"),p=(0,$.iH)([]),d=(0,$.iH)(0),s=(0,$.iH)(!1),c=(0,$.qj)({title:"",description:"",label:"personal",layout:"vertical"});(0,l.bv)((()=>{function t(){const t=window.innerWidth;d.value=t}window.addEventListener("resize",t),t()}));const m=()=>{r.value=!0},u=()=>{r.value=!1},h=t=>{u();const l=[];a.value.map((t=>l.push(t.key)));const o=Math.max(...l);e("noteAddData",[...a.value,{...t,key:o+1,time:(new Date).getTime(),stared:!1}])},g=()=>{u()},x=()=>{s.value=!s.value},f=()=>{s.value=!1};return{collapseSidebar:f,toggleCollapsed:x,handleCancel:g,handleOk:h,showModal:m,path:i,modalType:n,checked:p,responsive:d,collapsed:s,visible:r,formState:c}}});var S=C,N=a(83744);const U=(0,N.Z)(S,[["render",v]]);var z=U},36887:function(t){t.exports="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABEAAAARCAYAAAA7bUf6AAAABHNCSVQICAgIfAhkiAAAAPFJREFUOE+V1MENgjAUBuD3SPSqTCIj6AaCAxg3ELzJhYu9ASvgAEKcQEfASeSMCc/UCFZsaeXU0Jcvr68/IIvzEhBmoHgIoALERei7paoGWZKTarN9r4M6ZB94KMNYkmcAsB6CtAiHdZARooOMkSHoL0QF/Y30oTDwbGTxiedgQkRZuFttdNfN96O0mI6J7nxdI9p4SAsHm+ZqCnFgRHRBAIcAzmHgLV/ZMIVEAAhutYXzyHerLmA6SAXwJr5SqoKGgB9EdrSHZfntDMQjiBcg/V7EjrpiYQb9G5Qin44oe/8mjjXilg9RFgElYpKXtuYJYxHP4F8uc4QAAAAASUVORK5CYII="}}]);
//# sourceMappingURL=note.6ffe315a.js.map