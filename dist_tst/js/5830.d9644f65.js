"use strict";(self["webpackChunkMassNetCampaign"]=self["webpackChunkMassNetCampaign"]||[]).push([[5830],{25830:function(t,e,i){i.r(e),i.d(e,{AddUser:function(){return d},RecordFormWrapper:function(){return o},RecordViewWrapper:function(){return n},UserCarrdTop:function(){return l},UserTableStyleWrapper:function(){return p},UsercardWrapper:function(){return a}});var r=i(23481);const n=r.ZP.div`
    .btn-add_new{
        ${({theme:t})=>t.rtl?"margin-right":"margin-left"}: 10px;
        a{
            display: flex;
            align-items: center;
            svg,
            img,
            i{
                ${({theme:t})=>t.rtl?"margin-left":"margin-right"}: 6px;
            }
        }
    }
    .search-box{
        position: relative;
        box-shadow: 0 5px 5px rgba(#9299B8,.3);
        .search-icon{
            position: absolute;
            ${({theme:t})=>t.rtl?"right":"left"}: 18px;
            top: 50%;
            transform: translateY(-50%);
            svg,
            img{
                margin-top: 6px;
                min-width: 16px;
                color: #9299B8;
            }
        }
        input{
            border: 0 none;
            height: 40px;
            min-width: 280px;
            padding: ${({theme:t})=>t.rtl?"0 45px 0 20px":"0 20px 0 45px"};
            border-radius: 6px;
            &::placeholder{
                color: #ADB4D2;
            }
            &:focus{
                outline: none;
            }
        }
    }
`,o=r.ZP.div`
    .pro-image{
        position: relative;
        margin-bottom: 30px;
        .ant-spin.ant-spin-spinning{
            position: absolute;
            top: 0;
            ${({theme:t})=>t.rtl?"right":"left"}: 0;
            width: 120px;
            height: 120px;
            background: #ffffff90;
            display: flex;
            align-items: center;
            justify-content: center;
            text-align: center;
            z-index: 10;
            &:after{
                position: absolute;
                ${({theme:t})=>t.rtl?"right":"left"}: 0;
                top: 0;
                width: 100%;
                height: 100%;
                border-radius: 50%;
                background-color: #272B4120;
                content: '';
                z-index: -1;
            }
            .ant-spin-dot {
                position: relative;
                z-index: 10;
            }
        }
        img{
            max-width: 120px;
            min-width: 120px;
            border-radius: 50%;
        }
        .ant-spin{
            height: 120px;
            width: 120px;
            display: flex;
            align-items: center;
        }
        .ant-upload-select{
            position: absolute;
            ${({theme:t})=>t.rtl?"right":"left"}: 80px;
            bottom: -5px;
            height: 40px;
            width: 40px;
            background: #fff;
            display: inline-flex;
            align-items: center;
            justify-content: center;
            border-radius: 50%;
            z-index: 222;
            span{
                display: inline-flex;
                height: 32px;
                align-items: center;
                justify-content: center;
                border-radius: 50%;
                width: 32px;
                background: #5F63F2;
            }
            svg{
                color: #fff;
            }
        }
        .upload-btn{
            display: flex;
            align-items: center;
            justify-content: center;
            color: #fff;
        }
        .info{
            ${({theme:t})=>t.rtl?"margin-right":"margin-left"}: 20px;
            background: none;
            h1{
                font-size: 15px;
                font-weight: 500;
                margin-bottom: 0;
            }
        }
        .ant-upload-list-item{
            margin-top: 0;
            &:hover{
                .ant-upload-list-item-info{
                    background-color: transparent;
                }
            }
            .ant-upload-list-item-info{
                >span{
                    display: flex;
                    align-items: center;
                    ${({theme:t})=>t.rtl?"padding-right":"padding-left"}: 14px;
                    ${({theme:t})=>t.rtl?"padding-left":"padding-right"}: 10px;
                }
                .ant-upload-list-item-card-actions {
                    /* // top: -8px; */
                }
            }
        }
    }

    .record-spin{
        height: 100vh;
        display: flex;
        align-items: center;
        justify-content: center;
    }
`,a=r.ZP.nav`
.user-card-pagination{
  margin: 15px 0 40px 0;
  text-align: ${({theme:t})=>t.rtl?"left":"right"};
  @media only screen and (max-width: 991px){
    text-align: center;
  }
}
`,l=r.ZP.div`
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
`,p=r.ZP.div`
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
`,d=r.ZP.div`
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
`}}]);
//# sourceMappingURL=5830.d9644f65.js.map