"use strict";(self["webpackChunkMassNetCampaign"]=self["webpackChunkMassNetCampaign"]||[]).push([[5632],{57461:function(t,e,r){r.r(e),r.d(e,{AddUser:function(){return l},UserCarrdTop:function(){return o},UserTableStyleWrapper:function(){return a},UsercardWrapper:function(){return n}});var i=r(23481);const n=i.ZP.nav`
.user-card-pagination{
  margin: 15px 0 40px 0;
  text-align: ${({theme:t})=>t.rtl?"left":"right"};
  @media only screen and (max-width: 991px){
    text-align: center;
  }
}
`,o=i.ZP.div`
  .ant-page-header-heading-extra{
    .btn-add_new{
      margin-right: 15px;
      @media only screen and (max-width: 575px){
        margin-right: 6px;
      }
    }
    .action-btn{
      display: inline-flex;
      align-items: center;
      justify-content: center;
      height: 40px;
      width: 40px;
      border-radius: 50%;
      color: ${({theme:t})=>t["light-color"]};
      @media only screen and (max-width: 575px){
        height: 30px;
        width: 30px;
      }
      &.active{
        background-color: #fff;
        color: ${({theme:t})=>t["primary-color"]};
      }
    }
  }
`,a=i.ZP.div`
  padding: 25px;
  background: #fff;
  border-radius: 10px
  table{
    tbody{
      td{
        .user-info{
          .user-name{
            font-size: 14px;
          }
        }
        span.status-text{
          font-size: 12px;
          padding: 0 12.41px;
          line-height: 1.9;
          font-weight: 500;
          border-radius: 12px;
          text-transform: capitalize;
          display: inline-block !important;
          background: #ddd;
          &.active{
            background-color: ${({theme:t})=>t["success-color"]}15;
            color: ${({theme:t})=>t["success-color"]};
          }
          &.deactivate{
            background-color: ${({theme:t})=>t["warning-color"]}15;
            color: ${({theme:t})=>t["warning-color"]};
          }
          &.blocked{
            background-color: ${({theme:t})=>t["danger-color"]}15;
            color: ${({theme:t})=>t["danger-color"]};
          }
        }
      }
    }
    .table-actions{
      min-width: 150px !important;
    }
  }
  .ant-table-pagination.ant-pagination{
    width: 100%;
    text-align: ${({theme:t})=>t.rtl?"left":"right"};
    border-top: 1px solid ${({theme:t})=>t["border-color-light"]};
    margin-top: 0 !important;
    padding-top: 30px;
    @media only screen and (max-width: 767px){
      text-align: center;
    }
  }
  .contact-table{
    table{
      tr{
        th{
          &:first-child{
            ${({theme:t})=>t.rtl?"padding-right":"padding-left"}: 20px;
          }
          &:last-child{
            ${({theme:t})=>t.rtl?"padding-left":"padding-right"}: 20px;
          }
        }
      }
      .table-actions{
        button{
          width: auto;
          height: auto;
          padding: 0;
          background-color: transparent;
          &:hover{
            background-color: transparent;
          }
          &.ant-btn-primary{
            &:hover{
              color: #ADB4D2;
            }
          }
        }
      }
      tbody >tr.ant-table-row-selected >td{
        background-color: ${({theme:t})=>t["primary-color"]}10;
      }
    }
  }
`,l=i.ZP.div`
  .ant-card-head-title{
    padding: 0 !important;
  }
  .form-title{
    font-size: 18px;
    font-weight: 500;
    margin-bottom: 36px;
  }
  .ant-form-item:not(:last-child){
    margin-bottom: 11px !important;
  }
  .ant-form-item-label{
    line-height: 35px;
  }
  .work-status{
    .ant-form-item-control{
      line-height: 0;
    }
  }
  .ant-form-item-control{
    line-height: 0;
  }
  .add-user-bottom{
    margin-top: 20px;
    button{
      height: 44px;
    }
    button + button{
      ${({theme:t})=>t.rtl?"margin-right":"margin-left"}: 15px;
    }
    .ant-btn-light{
      background: ${({theme:t})=>t["bg-color-light"]};
      border: 1px solid #F1F2F6;
    }
    &.text-right{
      @media only screen and (max-width: 767px){
        text-align: ${({theme:t})=>t.rtl?"right":"left"} !important;
      }
    }
  }
  .card-nav{
    ul{
      flex-wrap: wrap;
      margin-bottom: -4px -12px;
      @media only screen and (max-width: 575px){
        justify-content: center;
      }
      li{
        margin: 4px 12px !important;
        &:not(:last-child){
          ${({theme:t})=>t.rtl?"margin-left":"margin-right"}: 26px;
          @media only screen and (max-width: 575px){
            ${({theme:t})=>t.rtl?"margin-left":"margin-right"}: 0;
          }
        }
        a{
          position: relative;
          padding: 22px 0;
          font-size: 14px;
          font-weight: 500;
          display: inline-flex;
          align-items: center;
          color: ${({theme:t})=>t["gray-color"]};
          @media only screen and (max-width: 575px){
            padding: 0;
          }
          &:after{
            position: absolute;
            ${({theme:t})=>t.rtl?"right":"left"}: 0;
            bottom: -4px;
            width: 100%;
            height: 2px;
            border-radius: 4px;
            content: '';
            opacity: 0;
            visibility: hidden;
            background-color: ${({theme:t})=>t["primary-color"]};
            @media only screen and (max-width: 575px){
              display: none;
            }
          }
          &.active{
            color: ${({theme:t})=>t["primary-color"]};
            &:after{
              opacity: 1;
              visibility: visible;
            }
            svg,
            img,
            i,
            span{
              color: ${({theme:t})=>t["primary-color"]};
            }
          }
          svg,
          img,
          i,
          span{
            color: ${({theme:t})=>t["light-color"]};
            ${({theme:t})=>t.rtl?"margin-left":"margin-right"}: 7px;
          }
          i svg{
            margin-right: 0;
          }
          i svg{
            margin-right: 0;
          }
        }
      }
    }
  }

  /* // Photo Upload */
  .photo-upload{
    position: relative;
    max-width: 260px;
    margin-bottom: 30px;
    .ant-upload-select{
      display: inline-flex;
      align-items: center;
      justify-content: center;
      height: 40px;
      width: 40px;
      border-radius: 50%;
      position: absolute;
      ${({theme:t})=>t.rtl?"right":"left"}: 85px;
      bottom: 5px;
      z-index: 10;
      background-color: ${({theme:t})=>t["white-color"]};
      span{
        display: inline-flex;
        align-items: center;
        justify-content: center;
        width: 32px;
        height: 32px;
        border-radius: 50%;
        z-index: -1;
        background-color: ${({theme:t})=>t["primary-color"]};
      }
      svg,
      i,
      span{
        color: ${({theme:t})=>t["white-color"]};
      }
      a{
        display: flex;
        align-items: center;
        justify-content: center;
      }
    }
    img{
      border-radius: 50%;
    }
    .info{
      background-color: transparent;
    }
    figcaption{
      ${({theme:t})=>t.rtl?"margin-right":"margin-left"}: 20px;
      .info{
        h1,
        h2,
        h3,
        h4,
        h5,
        h6{
          font-size: 15px;
          font-weight: 500;
        }
      }
    }
  }

  .user-work-form{
    .ant-picker{
      padding: 0 15px 0 0;
    }
  }
  .user-info-form{
    .ant-select-single .ant-select-selector .ant-select-selection-item{
      color: ${({theme:t})=>t["gray-color"]};
    }
  }
  .social-form{
    .ant-form-item-control{
      .ant-input-prefix{
        width: 46px;
        height: 46px;
        border-radius: 4px;
      }
      .ant-input-affix-wrapper{
          padding-top: 0 !important;
          padding-bottom: 0 !important;
      }
    }
    .ant-form-item-control-input{
      height: 44px;
      .ant-input-affix-wrapper{
        &:hover,
        &:focus,
        &.ant-input-affix-wrapper-focused{
          border-color: #E3E6EF;
        }
        .ant-input{
          height: 42px;
          ${({theme:t})=>t.rtl?"padding-right":"padding-left"}: 0;
        }
      }
    }
    .ant-input-affix-wrapper{
      padding-top: 0;
      padding-bottom: 0;
    }
    .ant-input-prefix{
      position: relative;
      ${({theme:t})=>t.rtl?"right":"left"}: -11px;
      ${({theme:t})=>t.rtl?"margin-right":"margin-left"}: 0;
      span{
        display: flex;
        align-items: center;
        justify-content: center;
        border-radius: 4px;
        width: 100%;
        height: 100%;
        background-color: ${({theme:t})=>t["primary-color"]};
        i,
        svg,
        span.fa,
        i svg{
          color: #fff !important;
          font-size: 16px;
        }
        &.facebook{
          background-color: #3B5998;
        }
        &.twitter{
          background-color: #38B8FF;
        }
        &.linkedin{
          background-color: #2CAAE1;
        }
        &.instagram{
          background-color: #FF0300;
        }
        &.github{
          background-color: #292929;
        }
        &.youtube{
          background-color: #FE0909;
        }
      }
    }
  }
`},1742:function(t,e,r){r.r(e),r.d(e,{default:function(){return g}});var i=r(66252);const n={class:"card-nav"};function o(t,e,r,o,a,l){const d=(0,i.up)("sdPageHeader"),p=(0,i.up)("sdFeatherIcons"),c=(0,i.up)("router-link"),m=(0,i.up)("router-view"),s=(0,i.up)("sdCards"),g=(0,i.up)("AddUser"),h=(0,i.up)("a-col"),u=(0,i.up)("a-row"),f=(0,i.up)("Main");return(0,i.wg)(),(0,i.iD)(i.HY,null,[(0,i.Wm)(d,{title:"Add User"}),(0,i.Wm)(f,null,{default:(0,i.w5)((()=>[(0,i.Wm)(u,{gutter:15},{default:(0,i.w5)((()=>[(0,i.Wm)(h,{xs:24},{default:(0,i.w5)((()=>[(0,i.Wm)(g,null,{default:(0,i.w5)((()=>[(0,i.Wm)(s,null,{title:(0,i.w5)((()=>[(0,i._)("div",n,[(0,i._)("ul",null,[(0,i._)("li",null,[(0,i.Wm)(c,{to:"info"},{default:(0,i.w5)((()=>[(0,i.Wm)(p,{type:"user",size:"14"}),(0,i.Uk)(" Personal Info ")])),_:1})]),(0,i._)("li",null,[(0,i.Wm)(c,{to:"work"},{default:(0,i.w5)((()=>[(0,i.Wm)(p,{type:"briefcase",size:"14"}),(0,i.Uk)(" Work Info ")])),_:1})]),(0,i._)("li",null,[(0,i.Wm)(c,{to:"social"},{default:(0,i.w5)((()=>[(0,i.Wm)(p,{type:"share-2",size:"14"}),(0,i.Uk)(" Social ")])),_:1})])])])])),default:(0,i.w5)((()=>[(0,i.Wm)(m,{name:"descendant"})])),_:1})])),_:1})])),_:1})])),_:1})])),_:1})],64)}var a=r(57461),l=r(72984),d=r(22201);const p=(0,i.aZ)({name:"AddNew",components:{Main:l.Main,AddUser:a.AddUser},setup(){const{matched:t}=(0,d.yj)();return{matched:t}}});var c=p,m=r(83744);const s=(0,m.Z)(c,[["render",o]]);var g=s}}]);
//# sourceMappingURL=addUser.5320eb84.js.map