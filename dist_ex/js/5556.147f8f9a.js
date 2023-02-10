"use strict";(self["webpackChunkMassNetCampaign"]=self["webpackChunkMassNetCampaign"]||[]).push([[5556],{47079:function(t,a,e){e.r(a),e.d(a,{Bullet:function(){return o},NoteStyleCard:function(){return n}});var r=e(23481);const n=r.ZP.div`
    .ant-card{
        border-radius: 15px !important;
    }
    .ant-card .ant-card-body{        
        border-radius: 15px !important;
        color: ${({theme:t})=>t["gray-color"]};    
        padding-bottom: 20px !important;
        padding-top: 20px !important;
        transition: .35s;
        h4{
            display: flex;
            align-items: center;
            font-size: 16px;
            margin-bottom: 16px;
            color: ${({theme:t})=>t["dark-color"]};
            justify-content: space-between;
            svg{
                color: #5A5F7D !important;
                cursor: move;
            }
            .status-bullet{
                position: relative;
                bottom: 2px;
                min-width: 7px;
                height: 7px;
                display: inline-block;
                border-radius: 50%;
               ${({theme:t})=>t.rtl?"margin-right":"margin-left"} : 8px;
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
            }
        }
        .actions{
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-top: 18px;
            .star{
                svg,
                i,
                span{
                    color: ${({theme:t})=>t["gray-color"]} !important;
                }
                &.active{
                    svg,
                    i,
                    span{
                        color: ${({theme:t})=>t["warning-color"]} !important;
                    } 
                } 
            }
            span{
                display: inline-block;
                margin: -5px;
                a {
                    margin: 5px;
                    svg,
                    i,
                    span{
                        color: ${({theme:t})=>t["gray-color"]} !important;
                    }
                }
            }
            .ant-dropdown-trigger{
                svg{
                    color: #868EAE;
                }
            }
        }        
    } 
    &.personal .ant-card .ant-card-body{
        background: #5F63F240;
        &:hover{
            background: #5F63F290;
        }
    }
    &.work .ant-card .ant-card-body{
        background: #20C99740;
        &:hover{
            background: #20C99790;
        }
    }
    &.social .ant-card .ant-card-body{
        background: #FA8B0C40;
        &:hover{
            background: #FA8B0C90;
        }
    }
    &.important .ant-card .ant-card-body{
        background: #2C99FF40;
        &:hover{
            background: #2C99FF90;
        }
    }  
`,o=r.ZP.span`
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
`},47920:function(t,a,e){e.r(a),e.d(a,{Bullet:function(){return g},MailRightAction:function(){return p},MessageAction:function(){return d},NoteCardWrap:function(){return c},NoteNav:function(){return l},NoteWrapper:function(){return s},Span:function(){return o},Style:function(){return i}});e(54346);var r=e(81701),n=e(23481);const o=n.ZP.span`
    &.active{
        color: green;
        text-decoration: line-through;
    }
`,i=(0,n.ZP)(r.ZP)`
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
  
`,l=n.ZP.nav`
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
`,d=n.ZP.div`
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
`,p=n.ZP.div`
  span{
    color: ${({theme:t})=>t["light-color"]};
  }
`,c=n.ZP.div`
  min-height: 625px;
  @media only screen and (max-width: 1199px){
    min-height: 100%;
  }
`,s=n.ZP.div`
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
`,g=n.ZP.span`
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
`},42651:function(t,a,e){e.r(a),e.d(a,{default:function(){return b}});var r=e(66252),n=e(3577);const o={class:"actions"},i={class:"nav-labels"},l={to:"#"};function d(t,a,e,d,p,c){const s=(0,r.up)("sdFeatherIcons"),g=(0,r.up)("Bullet"),h=(0,r.up)("sdDropdown"),m=(0,r.up)("sdCards"),x=(0,r.up)("NoteStyleCard");return(0,r.wg)(),(0,r.j4)(x,{class:(0,n.C_)(t.data.label)},{default:(0,r.w5)((()=>[(0,r.Wm)(m,{headless:""},{default:(0,r.w5)((()=>[(0,r._)("h4",null,[(0,r._)("span",null,[(0,r.Uk)((0,n.zw)(t.data.title)+" ",1),(0,r._)("span",{class:(0,n.C_)(`status-bullet ${t.data.label}`)},null,2)]),(0,r.Wm)(s,{class:"handle",type:"move"})]),(0,r._)("p",null,(0,n.zw)(t.data.description),1),(0,r._)("div",o,[(0,r._)("span",null,[(0,r._)("a",{class:(0,n.C_)(t.data.stared?"star active":"star"),onClick:a[0]||(a[0]=(...a)=>t.onStarUpdate&&t.onStarUpdate(...a)),to:"#"},[(0,r.Wm)(s,{type:"star",size:"16"})],2),(0,r._)("a",{onClick:a[1]||(a[1]=()=>t.onHandleDelete()),to:"#"},[(0,r.Wm)(s,{type:"trash-2",size:"16"})])]),(0,r.Wm)(h,null,{overlay:(0,r.w5)((()=>[(0,r._)("div",i,[(0,r._)("ul",null,[(0,r._)("li",null,[(0,r._)("a",{onClick:a[2]||(a[2]=()=>t.onLabelChange("personal")),to:"#"},[(0,r.Wm)(g,{class:"personal"}),(0,r.Uk)(" Personal ")])]),(0,r._)("li",null,[(0,r._)("a",{onClick:a[3]||(a[3]=()=>t.onLabelChange("work")),to:"#"},[(0,r.Wm)(g,{class:"work"}),(0,r.Uk)(" Work ")])]),(0,r._)("li",null,[(0,r._)("a",{onClick:a[4]||(a[4]=()=>t.onLabelChange("social")),to:"#"},[(0,r.Wm)(g,{class:"social"}),(0,r.Uk)(" Social ")])]),(0,r._)("li",null,[(0,r._)("a",{onClick:a[5]||(a[5]=()=>t.onLabelChange("important")),to:"#"},[(0,r.Wm)(g,{class:"important"}),(0,r.Uk)(" Important ")])])])])])),default:(0,r.w5)((()=>[(0,r._)("a",l,[(0,r.Wm)(s,{type:"more-vertical",size:"20"})])])),_:1})])])),_:1})])),_:1},8,["class"])}var p=e(5298),c=e(2262),s=e(33907),g=e(47079);const h=(0,r.aZ)({name:"NoteCard",props:{data:p.ZP.object},components:{NoteStyleCard:g.NoteStyleCard,Bullet:g.Bullet},setup(t){const{state:a,dispatch:e}=(0,s.oR)(),n=(0,r.Fl)((()=>a.note.data)),{data:o}=(0,c.BK)(t),i=t=>{e("onLabelUpdate",{data:n.value,id:o.value.key,value:t})},l=()=>{const t=n.value.filter((t=>t.key!==o.value.key));e("noteDeleteData",t)},d=()=>{e("onStarUpdate",{data:n.value,id:o.value.key})};return{onStarUpdate:d,noteData:n,dispatch:e,onHandleDelete:l,onLabelChange:i}}});var m=h,x=e(83744);const u=(0,x.Z)(m,[["render",d]]);var b=u}}]);
//# sourceMappingURL=5556.147f8f9a.js.map