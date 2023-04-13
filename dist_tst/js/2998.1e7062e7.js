"use strict";(self["webpackChunkMassNetCampaign"]=self["webpackChunkMassNetCampaign"]||[]).push([[2998,5830],{25830:function(t,e,r){r.r(e),r.d(e,{AddUser:function(){return d},RecordFormWrapper:function(){return a},RecordViewWrapper:function(){return i},UserCarrdTop:function(){return l},UserTableStyleWrapper:function(){return p},UsercardWrapper:function(){return n}});var o=r(23481);const i=o.ZP.div`
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
`,a=o.ZP.div`
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
`,n=o.ZP.nav`
.user-card-pagination{
  margin: 15px 0 40px 0;
  text-align: ${({theme:t})=>t.rtl?"left":"right"};
  @media only screen and (max-width: 991px){
    text-align: center;
  }
}
`,l=o.ZP.div`
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
`,p=o.ZP.div`
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
`,d=o.ZP.div`
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
`},43359:function(t,e,r){r.r(e),r.d(e,{ActivitiesWrapper:function(){return h},ProjectCard:function(){return n},ProjectDetailsWrapper:function(){return s},ProjectHeader:function(){return i},ProjectList:function(){return c},ProjectListAssignees:function(){return d},ProjectListTitle:function(){return p},ProjectModalFooter:function(){return x},ProjectPagination:function(){return l},ProjectSorting:function(){return a},TaskLists:function(){return g},TasklistAction:function(){return m}});var o=r(23481);const i=o.ZP.div`
    .ant-page-header-heading-sub-title{
        ${({theme:t})=>t.rtl?"margin-left":"margin-right"}: 0;
        position: relative;
        ${({theme:t})=>t.rtl?"padding-right":"padding-left"}: 15px;
        font-weight: 500;
        &:before{
            position: absolute;
            content: '';
            width: 1px;
            height: 24px;
            background: ${({theme:t})=>t["dash-color"]};
            ${({theme:t})=>t.rtl?"right":"left"}: 0;
            top:0;
        }
    }
`,a=o.ZP.div`
    margin-bottom: 25px;
    .project-sort-bar{
        display: flex;
        flex-wrap: wrap;
        align-items: center;
        margin: 0 -10px;
        .project-sort-nav,
        .project-sort-search,
        .project-sort-group{
            padding: 0 10px;
        }

        .project-sort-group{
            ${({theme:t})=>t.rtl?"margin-right":"margin-left"}: auto;
        }
        .project-sort-search{
            .ant-select-selection-search{
                width: 100% !important;
            }
            .ant-input-affix-wrapper{
                padding-top: 0 !important;
                padding-bottom: 0 !important;
            }
        }
    }
    @media (max-width: 1500px){
        .project-sort-search{
            .ant-select{
                width: 237px !important;
            }
        }
        .project-sort-group .sort-group{
            .ant-select{
                min-width: 180px;
            }
        }
    }
    @media (min-width: 1201px) and (max-width: 1300px) {
        .project-sort-search{
            .ant-select{
                width: 170px !important;
            }
        }
        .project-sort-group{
            padding: 0 5px;

        }
        .project-sort-group .sort-group .layout-style a{
            width: 35px;
            height: 35px;
        }
        .project-sort-group .sort-group .ant-select {
            min-width: 170px;
            ${({theme:t})=>t.rtl?"padding-right":"padding-left"}: 5px;
            ${({theme:t})=>t.rtl?"margin-left":"margin-right"}: 5px;
        }
    }
    @media (max-width: 1199px){
        .project-sort-search{
            flex: 0 0 100%;
            order: 0;
            margin-bottom: 25px;
            display: flex;
            justify-content: center;
            .ant-select{
                width: 350px !important;
            }
        }
        .project-sort-nav{
            order: 1;
            margin: 0 auto;
        }
        .project-sort-group{
            order: 2;
        }
    }
    @media (max-width: 991px){
        .project-sort-group{
            ${({theme:t})=>t.rtl?"margin-right":"margin-left"}: unset;
            flex: 0 0 100%;
            margin-top: 15px;
            .sort-group{
                justify-content: flex-start;
                .layout-style{
                    ${({theme:t})=>t.rtl?"margin-right":"margin-left"}: auto;
                }
            }
        }
    }
    @media (max-width: 575px){
        .project-sort-group{
            .sort-group{
                > span{
                    display: none;
                }
                .ant-select{
                    ${({theme:t})=>t.rtl?"margin-left":"margin-right"}: 0;
                }
            }
        }
    }

    nav{
        background: #fff;
        border-radius: 5px;
        padding: 9px 20px;
        ul{
            list-style: none;
            margin: 0;
            padding: 0;
            display: flex;
            align-items: center;
            justify-content: space-between;
            li{
                ${({theme:t})=>t.rtl?"margin-left":"margin-right"}: 11px;
                ${({theme:t})=>t.rtl?"border-left":"border-right"}: 1px solid ${({theme:t})=>t["border-color-light"]};
                &:last-child{
                    ${({theme:t})=>t.rtl?"margin-left":"margin-right"}: 0;
                    ${({theme:t})=>t.rtl?"margin-left":"margin-right"}: 0;
                    ${({theme:t})=>t.rtl?"border-left":"border-right"}: 0 none;
                }
                a{
                    color: ${({theme:t})=>t["gray-solid"]};
                    font-weight: 400;
                    ${({theme:t})=>t.rtl?"padding-left":"padding-right"}: 11px;
                }
                &.active{
                    a{
                        color: ${({theme:t})=>t["primary-color"]};
                    }
                }
                &:last-child{
                    a{
                        ${({theme:t})=>t.rtl?"padding-left":"padding-right"}: 0;
                    }
                }
            }
        }
    }
    .ant-select-selection-search-input{
        border: 0 none;
        border-radius: 23px;
        input{
            height: 40px !important;
            border-radius: 23px;
        }
    }
    .ant-select-arrow{
        right: auto;
        ${({theme:t})=>t.rtl?"left":"right"}: 11px !important;
    }

    .sort-group{
        color: ${({theme:t})=>t["gray-solid"]};
        display: flex;
        align-items: center;
        justify-content: flex-end;


        .ant-select{
            ${({theme:t})=>t.rtl?"padding-right":"padding-left"}: 10px;
            ${({theme:t})=>t.rtl?"margin-right":"margin-left"}: 15px;
            min-width: 260px;
            .ant-select-selector{
                border: 0 none;
                .ant-select-selection-item{
                    color: ${({theme:t})=>t["gray-solid"]};
                }

            }
        }
        .layout-style{
            display: flex;
            align-items: center;
            ${({theme:t})=>t.rtl?"margin-right":"margin-left"}: 20px;
            a{
                display: flex;
                width: 40px;
                height: 40px;
                border-radius: 50%;
                align-items: center;
                justify-content: center;
                color: ${({theme:t})=>t["gray-solid"]};
                &:hover,
                &.active{
                    color: ${({theme:t})=>t["primary-color"]};
                    background: #fff;
                    i{
                        svg{
                            color: ${({theme:t})=>t["primary-color"]};
                        }
                    }
                }
            }
        }
    }
    @media (max-width: 400px){
        .sort-group .ant-select{
            min-width: 200px;
        }
        .project-sort-search{
            .ant-select-auto-complete{
                width: 100% !important;
            }
        }
        .project-sort-nav{
            nav{
                padding: 10px;
            }
            nav ul{
                flex-wrap: wrap;
                justify-content: center;
                margin-bottom: -5px;
                li{
                    ${({theme:t})=>t.rtl?"border-left":"border-right"}: 0 none;
                    margin-bottom: 5px;
                }
            }
        }
    }
`,n=o.ZP.div`
    .ant-card-body{
        padding: 0px !important;
    }
    .project-top{
        padding:30px 30px 0px;
    }
    .project-bottom{
        .project-assignees{
            padding: 16px 30px 25px;
        }
    }
    .project-title{
        display: flex;
        align-items: flex-start;
        justify-content: space-between;
        h1{
            font-size: 16px;
            display: flex;
            flex-wrap: wrap;
            align-items: center;
            margin: -2px;
            a{
                color: ${({theme:t})=>t["dark-color"]};
                ${({theme:t})=>t.rtl?"margin-left":"margin-right"}: 11px !important;
            }
            a,
            .ant-tag{
                margin: 2px;
            }
            .ant-tag{
                text-transform: uppercase;
                font-size: 10px;
                ${({theme:t})=>t.rtl?"margin-left":"margin-right"}: 0;
                line-height: 18px;
                background: red;
                color: #fff;
                border: 0 none;
                &.early{
                    background: ${({theme:t})=>t["primary-color"]};
                }
                &.progress{
                    background: ${({theme:t})=>t["danger-color"]};
                }
                &.late{
                    background: ${({theme:t})=>t["warning-color"]};
                }
                &.complete{
                    background: ${({theme:t})=>t["success-color"]};
                }
            }
        }
        .ant-dropdown-trigger{
            color: ${({theme:t})=>t["extra-light-color"]};
        }
    }
    .project-desc{
        margin: 7px 0 25px 0;
        color: ${({theme:t})=>t["gray-color"]};
    }
    .project-timing{
        display: flex;
        align-items: center;
        margin-bottom: 15px;
        div{
            ${({theme:t})=>t.rtl?"margin-left":"margin-right"}: 30px;
            &:last-child{
                ${({theme:t})=>t.rtl?"margin-left":"margin-right"}: 0;
            }
            span, strong{
                display: block;
            }
            span{
                font-size: 12px;
                margin-bottom: 2px;
                color: ${({theme:t})=>t["gray-solid"]};
            }
            strong{
                font-weight: 500;
            }
        }
    }
    .project-progress{
        p{
            margin: 2px 0 0 0;
            color: ${({theme:t})=>t["gray-solid"]};
            font-size: 12px;
        }
        .ant-progress-text{
            font-size: 12px;
            font-weight: 500;
        }
    }
    .project-assignees{
        border-top: 1px solid ${({theme:t})=>t["border-color-light"]};
        margin-top: 17px;
        padding-top: 16px;
        p{
            font-size: 13px;
            color: ${({theme:t})=>t["gray-solid"]}
        }
        ul{
            margin: -3px;
            padding: 0;
            display: flex;
            align-items: center;
            flex-wrap: wrap;
            li{
                list-style: none;
                padding: 3px;
                img{
                    width: 35px;
                    height: 35px;
                    border-radius: 50%;
                    object-fit: cover;
                }
            }
        }
    }
`,l=o.ZP.div`
    .ant-pagination{
        display: flex;
        justify-content: flex-end;
        @media only screen and (max-width: 767px) {
            justify-content: center;
        }
    }
`,p=o.ZP.div`
    h1{
        font-size: 15px;
        font-weight: 500;
        margin-bottom: 5px;
        a{
            color: ${({theme:t})=>t["dark-color"]};
        }
    }
    p{
        margin: 0;
        font-size: 12px;
        color: ${({theme:t})=>t["gray-solid"]};
    }
`,d=o.ZP.div`
    ul{
        margin: -3px;
        padding: 0;
        display: flex;
        align-items: center;
        li{
            list-style: none;
            padding: 3px;
            img{
                width: 35px;
                height: 35px;
                border-radius: 50%;
                object-fit: cover;
            }
        }
    }
`,c=o.ZP.div`
    margin-bottom: 30px;
    .project-list-progress{
        white-space: normal;
        .ant-progress-line{
            display: flex;
            align-items: center;
        }
        p{
            margin: 4px 0 0 0;
            font-size: 12px;
            color: ${({theme:t})=>t["gray-solid"]};
        }
        .ant-progress>div{
            flex-direction: row;
        }
    }
    .date-started,
    .date-finished{
        font-weight: 500;
    }
    .ant-table{
        .ant-table-thead{
            th{
                background-color: ${({theme:t})=>t["bg-color-light"]};
            }
        }
        .ant-table-tbody{
            tr{
                &:hover{
                    td{
                        background-color: ${({theme:t})=>t["bg-color-light"]};
                    }
                }
                .ant-tag{
                    text-transform: uppercase;
                    font-size: 10px;
                    ${({theme:t})=>t.rtl?"margin-left":"margin-right"}: 0;
                    line-height: 18px;
                    background: red;
                    color: #fff;
                    border: 0 none;
                    &.early{
                        background: ${({theme:t})=>t["primary-color"]};
                    }
                    &.progress{
                        background: ${({theme:t})=>t["danger-color"]};
                    }
                    &.late{
                        background: ${({theme:t})=>t["warning-color"]};
                    }
                    &.complete{
                        background: ${({theme:t})=>t["success-color"]};
                    }
                }
            }
        }
    }
    .ant-table-content table > thead > tr th{
        font-weight: 400;
        color: ${({theme:t})=>t["light-color"]};
        border-top: 1px solid ${({theme:t})=>t["border-color-light"]};
    }
    .ant-table-content table > thead > tr th:first-child{
        border-radius: ${({theme:t})=>t.rtl?"0 10px 10px 0":"10px 0 0 10px"} !important;
        ${({theme:t})=>t.rtl?"border-right":"border-left"}: 1px solid ${({theme:t})=>t["border-color-light"]};
    }
    .ant-table-content table > thead > tr th:last-child{
        border-radius: ${({theme:t})=>t.rtl?"10px 0 0 10px":"0 10px 10px 0"} !important;
        ${({theme:t})=>t.rtl?"border-left":"border-right"}: 1px solid ${({theme:t})=>t["border-color-light"]};
    }
    .ant-dropdown-trigger{
        svg{
            color: ${({theme:t})=>t["extra-light-color"]};
        }
    }
`,s=o.ZP.div`
    .project-header{
        display: flex;
        align-items: center;
        @media only screen and (max-width: 800px) {
            flex-wrap: wrap;
        }
        @media only screen and (max-width: 575px) {
            flex-flow: column;
            button{
                margin: 15px 0 0;
            }
        }
        h1{
            ${({theme:t})=>t.rtl?"margin-left":"margin-right"}: 20px;
            margin-bottom: 0;
            font-size: 20px;
            @media only screen and (max-width: 800px) {
                margin-bottom: 10px;
            }
            @media only screen and (max-width: 575px) {
                margin: 0;
            }
        }
        button{
            font-size: 12px;
            font-weight: 500;
            ${({theme:t})=>t.rtl?"margin-left":"margin-right"}: 10px;
            height: 35px;
            padding: 0px 13.5px;
            &.btn-markComplete{
                background: #fff !important;
                border-color: ${({theme:t})=>t["border-color-deep"]} !important;
            }
        }
    }
    .project-action{
        .project-edit,
        .project-remove{
            border-radius: 6px;
            background: #fff;
            height: 35px;
            padding: 0 15px;
            font-size: 12px;
            font-weight: 500;
            display: inline-flex;
            align-items: center;
            justify-content: center;
            margin: 0 5px;
            box-shadow: 0 3px 5px ${({theme:t})=>t["gray-solid"]}05;
            svg,
            img{
                ${({theme:t})=>t.rtl?"margin-left":"margin-right"}: 6px;
            }
            i{
                line-height: 0;
            }
        }
        .project-edit{
            color: ${({theme:t})=>t["primary-color"]};
        }
        .project-remove{
            color: ${({theme:t})=>t["danger-color"]};
        }
    }
    .project-progress{
        border-radius: 10px;
        background: ${({theme:t})=>t["success-color"]};
        padding: 20px 25px 20px;
        margin-bottom: 25px;
        h3{
            color: #fff;
        }
        .ant-progress-inner{
            background: rgba(255,255,255, 0.2);
        }
        .ant-progress-bg{
            background: #fff;
        }
        .ant-progress-text{
            color: #fff;
            font-weight: 500;
        }
        .ant-progress>div{
            flex-direction: row;
        }
    }
    .about-project-wrapper{
        min-height: 485px;
        background: #fff;
        border-radius: 10px;
        margin-bottom: 25px;
    }
    .state-single{
        display: flex;
        align-items: center;
        margin-bottom: 25px;
        &:last-child{
            margin-bottom: 0;
        }
        > div{
            ${({theme:t})=>t.rtl?"margin-left":"margin-right"}: 20px;
        }
        a{
            display: flex;
            align-items: center;
            justify-content: center;
            width: 60px;
            height: 60px;
            border-radius: 12px;
            background: rgba(95,99,242,0.1);
        }
        h1{
            font-size: 20px;
            font-weight: 600;
            margin: 0 0 3px;
        }
        p{
            color: ${({theme:t})=>t["gray-solid"]};
            margin: 0;
        }
        .color-primary{
            a{
                background: rgba(95,99,242,0.1);
                svg{
                    color: ${({theme:t})=>t["primary-color"]};
                }
            }
        }
        .color-secondary{
            a{
                background: rgba(255,105,165,0.1);
                svg{
                    color: ${({theme:t})=>t["secondary-color"]};
                }
            }
        }
        .color-success{
            a{
                background: rgba(32,201,151,0.1);
                svg{
                    color: ${({theme:t})=>t["success-color"]};
                }
            }
        }
        .color-warning{
            a{
                background: rgba(250,139,12,0.1);
                svg{
                    color: ${({theme:t})=>t["warning-color"]};
                }
            }
        }
    }
    .about-content{
        p{
            font-size: 15px;
            line-height: 25px;
            color: ${({theme:t})=>t["gray-color"]};
        }
    }
    .about-project{
        margin: 42px -40px 0;
        display: flex;
        align-items: center;
        @media only screen and (max-width: 991px) {
            flex-flow: column;
            align-items: flex-start;
        }
        div{
            margin: 0 40px;
            span{
                color: ${({theme:t})=>t["gray-solid"]};
                font-size: 13px;
                display: block;
                margin-bottom: 3px;
            }
            p{
                font-weight: 500;
            }
        }
    }
    .project-users-wrapper{
        .btn-addUser{
            padding: 0px 12.6px;
            font-size: 12px;
            font-weight: 500;
            color: ${({theme:t})=>t["primary-color"]} !important;
            border-color: ${({theme:t})=>t["border-color-light"]};
        }
        i +span, svg +span, img +span {
            ${({theme:t})=>t.rtl?"margin-right":"margin-left"}: 6px;
        }
    }
    .project-users{
        min-height: 368px;
        .porject-user-single{
            display: flex;
            align-items: center;
            margin-bottom: 25px;
            &:last-child{
                margin-bottom: 0;
            }
            & > div{
                ${({theme:t})=>t.rtl?"margin-left":"margin-right"}: 15px;
            }
            div{
                img{
                    width: 45px;
                    height: 45px;
                    border-radius: 50%;
                    object-fit: cover;
                    display: block;
                }
                h1{
                    font-size: 14px;
                    font-weight: 600;
                    margin-bottom: 2px;
                }
                p{
                    color: ${({theme:t})=>t["gray-solid"]};
                    margin: 0;
                }
            }
        }
    }

    .file-list{
        min-height: 385px;
        .file-list__single{
            justify-content: space-between;
            align-items: center;
            &:not(:last-child){
                margin-bottom: 18px;
            }
            span{
                display: block;
                font-size: 12px;
                line-height: 1.42;
                &.file-name{
                    font-size: 14px;
                    font-weight: 500;
                    color: ${({theme:t})=>t["dark-color"]};
                }
                &.file-size{
                    margin: 2px 0;;
                    color: ${({theme:t})=>t["gray-solid"]};
                }
                &.file-content-action{
                    a{
                        font-weight: 500;
                        color: ${({theme:t})=>t["primary-color"]};
                    }
                    a + a{
                        margin-left: 8px;
                    }
                }
            }
        }
        .file-single-info{
            width: 50%;
            align-items: center;
            .file-single-logo{
                ${({theme:t})=>t.rtl?"margin-left":"margin-right"}: 16px;
                img{
                    max-width: 42px;
                }
            }
        }
        .file-single-action{
            .ant-dropdown-trigger {
                color: ${({theme:t})=>t["extra-light-color"]};
            }
        }
    }

    .dropdown-more{
        a{
            font-size: 13px;
            svg,
            i.
            img{
                ${({theme:t})=>t.rtl?"margin-left":"margin-right"}: 8px;
            }
        }
    }
`,g=o.ZP.div`
    .ant-card{
        .ant-card-head{
            border-color: ${({theme:t})=>t["border-color-light"]};
            margin-bottom: 0;
        }
        .ant-card-body{
            padding: 0 !important;
        }
    }
    nav{
        a{
            font-size: 14px;
            font-weight: 500;
            color: ${({theme:t})=>t["gray-solid"]};
            position: relative;
            padding: 20px 0px;
            &:not(:last-child){
                ${({theme:t})=>t.rtl?"margin-left":"margin-right"}: 18px;
            }
            &:before{
                position: absolute;
                content: '';
                width: 100%;
                ${({theme:t})=>t.rtl?"right":"left"}: 0;
                bottom: -2px;
                height: 1px;

            }
            &.active{
                color: ${({theme:t})=>t["primary-color"]};
                &:before{
                    background: ${({theme:t})=>t["primary-color"]};
                }
            }
        }
    }
    table{
        margin-top: 15px;
        .ant-checkbox-checked{
            .ant-checkbox-inner{
                background: ${({theme:t})=>t["success-color"]};
                border-color: ${({theme:t})=>t["success-color"]};
            }
            &:after{
                border-color: ${({theme:t})=>t["success-color"]};
            }
        }
        thead{
            display: none;
        }
        tr{
            th{
                background: #fff;
                border-bottom: 0;
                padding: 10px;
                &:first-child{
                    ${({theme:t})=>t.rtl?"margin-left":"margin-right"}: 25px;
                }
                .ant-checkbox-indeterminate {
                    .ant-checkbox-inner{
                        &:after{
                            background: ${({theme:t})=>t["success-color"]};
                        }
                    }
                }
            }
            &:hover{
                td{
                    background: #fff;
                }
            }
        }
        .ant-table-tbody{
            > tr.ant-table-row{
                &.ant-table-row-selected{
                    > td{
                        background: #fff;
                    }
                    .task-title{
                        text-decoration: line-through;
                    }
                }
                > td{
                    padding: 10px;
                    border-bottom: 0;
                    text-align: ${({theme:t})=>t.rtl?"right":"left"};
                    &:first-child{
                        ${({theme:t})=>t.rtl?"padding-right":"padding-left"}: 25px;
                    }
                    &:last-child{
                        ${({theme:t})=>t.rtl?"padding-left":"padding-right"}: 25px;
                    }
                    .task-title{
                        color: ${({theme:t})=>t["gray-color"]};
                    }
                    .task-created{
                        font-size: 12px;
                        color: ${({theme:t})=>t["gray-color"]};
                    }
                    .ant-checkbox{
                        &:hover{
                            .ant-checkbox-inner{
                                border-color: ${({theme:t})=>t["success-color"]};
                            }
                        }
                    }
                }
                &:hover{
                    box-shadow: 0 15px 50px ${({theme:t})=>t["gray-solid"]}20;
                    > td{
                        background: #fff;
                    }
                }
            }
        }
    }

    .tasklist-action{
        margin: 18px 25px 25px;
        button{
            width: 100%;
            text-align: ${({theme:t})=>t.rtl?"right":"left"};
            justify-content: flex-start;
            font-size: 12px;
            font-weight: 500;
            &.ant-btn-primary{
                border-radius: 6px;
                background: ${({theme:t})=>t["primary-color"]}10;
            }
        }
    }
`,m=o.ZP.div`
    display: flex;
    align-items: center;
    justify-content: flex-end;
    margin: 0 -10px;
    span, img, div{
        display: block;
        margin: 0 10px;
        line-height: normal;
    }
    span, a{
        color: ${({theme:t})=>t["gray-solid"]};
    }
    .task-created{
        color: #9299b8 !important;
    }
    .task-move{
        svg,
        i{
            color: #D8DCEB;
        }
    }
`,h=o.ZP.div`
    padding: 25px;
    min-height: 435px;
    .activity-block{
        &:not(:last-child){
            margin-bottom: 20px;
            padding-bottom: 20px;
            border-bottom: 1px solid ${({theme:t})=>t["border-color-light"]};
        }
    }
    .activity-dateMeta{
        height: 100%;
        border-radius: 10px;
        display: flex;
        flex-flow: column;
        align-items: center;
        justify-content: center;
        background: ${({theme:t})=>t["bg-color-light"]};
        border: 1px solid ${({theme:t})=>t["border-color-light"]};
        @media only screen and (max-width: 575px) {
            height: auto;
            padding: 30px 0px;
            margin-bottom: 25px;
        }
        h1{
            font-size: 18px;
            margin-bottom: 0px;
        }
        .activity-month{
            color: ${({theme:t})=>t["gray-color"]};
        }
    }

    .activity-single{
        &:not(:last-child){
            margin-bottom: 25px;
        }
        .activity-icon{
            display: inline-flex;
            align-items: center;
            justify-content: center;
            height: 24px;
            width: 24px;
            border-radius: 50%;
            margin: ${({theme:t})=>t.rtl?"4px 0 0 10px":"4px 10px 0 0"};
            &.bg-primary{
                background: ${({theme:t})=>t["primary-color"]}15;
                color: ${({theme:t})=>t["primary-color"]};
            }
            &.bg-secondary{
                background: ${({theme:t})=>t["secondary-color"]}15;
                color: ${({theme:t})=>t["secondary-color"]};
            }
            &.bg-success{
                background: ${({theme:t})=>t["success-color"]}15;
                color: ${({theme:t})=>t["success-color"]};
            }
        }
        img{
            ${({theme:t})=>t.rtl?"margin-left":"margin-right"}: 12px;
        }
        .activity-title{
            font-size: 14px;
            font-weight: 500;
            margin: -4px 0 0;
            span{
                font-weight: 400;
                margin: 0 2px;
                color: ${({theme:t})=>t["gray-solid"]};
            }
        }
        .activity-timeMeta{
            font-size: 12px;
            margin-bottom: 0;
            color: ${({theme:t})=>t["extra-light-color"]};
        }
    }
`,x=o.ZP.div`
    margin-top: 10px;
    button{
        margin-right: 10px;
    }
`},24993:function(t,e,r){r.r(e),r.d(e,{default:function(){return w}});var o=r(66252);const i={class:"table-actions"},a=(0,o._)("a",{href:"",title:"Delete"},null,-1);function n(t,e,r,n,l,p){const d=(0,o.up)("sdFeatherIcons"),c=(0,o.up)("sdButton"),s=(0,o.up)("router-link"),g=(0,o.up)("a-table"),m=(0,o.up)("TableWrapper"),h=(0,o.up)("UserTableStyleWrapper");return(0,o.wg)(),(0,o.j4)(h,null,{default:(0,o.w5)((()=>[(0,o.Wm)(m,{class:"table-responsive"},{default:(0,o.w5)((()=>[(0,o.Wm)(g,{rowSelection:t.rowSelection,pagination:{pageSize:10,showSizeChanger:!0},dataSource:t.dataSource,columns:t.columns},{events:(0,o.w5)((({record:e})=>[(0,o._)("td",null,[(0,o._)("div",i,[(0,o.Wm)(c,{onClick:t.showSuccessModal,size:"small",type:"success"},{default:(0,o.w5)((()=>[(0,o.Wm)(d,{type:"edit-3",size:"16"}),(0,o.Uk)("    Enroll Participants ")])),_:1},8,["onClick"]),(0,o.Wm)(c,null,{default:(0,o.w5)((()=>[(0,o.Wm)(s,{to:`/event/view/${e.id}`,class:"btn-icon",type:"info",shape:"circle"},{default:(0,o.w5)((()=>[(0,o.Wm)(d,{type:"eye",size:"16"}),(0,o.Uk)("    View ")])),_:2},1032,["to"])])),_:2},1024),(0,o.Wm)(c,{class:"btn-icon",type:"danger",onClick:r=>t.handleDelete(e.id),shape:"circle"},{default:(0,o.w5)((()=>[(0,o.Wm)(d,{type:"trash-2",size:"16"}),a])),_:2},1032,["onClick"])])])])),_:1},8,["rowSelection","dataSource","columns"])])),_:1})])),_:1})}var l=r(25830),p=r(72984),d=r(2262),c=r(22201),s=r(40008),g=r(9669),m=r.n(g),h=r(33907);const x=[{title:"Participant Name",dataIndex:"fullName",key:"id"},{title:"Participant Phone",dataIndex:"phone_no",key:"id"},{title:"Organization",dataIndex:"org_types_id",key:"id"},{title:"Role",dataIndex:"role_id",key:"id"}],f=(0,o.aZ)({name:"EventCampaignTable",components:{UserTableStyleWrapper:l.UserTableStyleWrapper,TableWrapper:p.TableWrapper},setup(){const{state:t}=(0,h.oR)(),e=(0,o.Fl)((()=>t.crud.data)),r=(0,d.iH)([]),i=(0,d.iH)([]),a="http://41.89.92.206/massnet/api",{query:n}=(0,c.yj)();console.log(n.id),(0,o.bv)((async()=>{try{const t=await m().get(`${a}/events/${n.id}/participants`,{headers:(0,s["default"])()});console.log(t.data.data);const e=t.data.data.map((t=>{let e=`${t.first_name} ${t.last_name}`;return{...t,fullName:e}}));r.value=t.data.data,console.log(e),r.value=e,console.log(r.value)}catch(t){console.error(t)}}));const l=t=>{i.value=t},p={selectedRowKeys:i,onChange:l};return{columns:x,eventData:e,rowSelection:p,dataSource:r,selectedRowKeys:i,onSelectChange:l}}});var u=f,b=r(83744);const y=(0,b.Z)(u,[["render",n]]);var w=y},32998:function(t,e,r){r.r(e),r.d(e,{default:function(){return w}});var o=r(66252);const i={key:"1",class:"project-header"},a={key:0,class:"spin"};function n(t,e,r,n,l,p){const d=(0,o.up)("sdHeading"),c=(0,o.up)("sdPageHeader"),s=(0,o.up)("a-spin"),g=(0,o.up)("sdCards"),m=(0,o.up)("a-col"),h=(0,o.up)("EventCampaignTable"),x=(0,o.up)("a-row"),f=(0,o.up)("Main"),u=(0,o.up)("ProjectDetailsWrapper");return(0,o.wg)(),(0,o.j4)(u,null,{default:(0,o.w5)((()=>[t.project?((0,o.wg)(),(0,o.j4)(c,{key:0},{title:(0,o.w5)((()=>[(0,o._)("div",i,[(0,o.Wm)(d,{as:"h2"},{default:(0,o.w5)((()=>[(0,o.Uk)("Event Info")])),_:1})])])),_:1})):(0,o.kq)("",!0),(0,o.Wm)(f,null,{default:(0,o.w5)((()=>[t.project?((0,o.wg)(),(0,o.j4)(x,{key:1,gutter:25},{default:(0,o.w5)((()=>[(0,o.Wm)(m,{xxl:24,xl:12,md:24,xs:24},{default:(0,o.w5)((()=>[(0,o.Wm)(g,{headless:""})])),_:1}),(0,o.Wm)(m,{xxl:24,xl:24,md:24,xs:24},{default:(0,o.w5)((()=>[(0,o.Wm)(g,{title:"Event Participants"},{default:(0,o.w5)((()=>[(0,o.Wm)(h)])),_:1})])),_:1})])),_:1})):((0,o.wg)(),(0,o.iD)("div",a,[(0,o.Wm)(s)]))])),_:1})])),_:1})}r(54346);var l=r(81701),p=(r(57986),r(29340)),d=r(43359),c=r(72984),s=r(33907),g=r(2262),m=r(22201),h=r(24993),x=r(40008);const f=(0,o.aZ)({name:"ProjectDetails",components:{ProjectDetailsWrapper:d.ProjectDetailsWrapper,Main:c.Main,EventCampaignTable:h["default"]},data(){const{state:t,dispatch:e}=(0,s.oR)(),r=(0,o.Fl)((()=>t.project.singData)),{params:i,matched:a,query:n}=(0,m.yj)(),{title:d,content:c}=(0,o.Fl)((()=>t.project.singData[0]));console.log({query:n,params:i});const{facilitators:h}=(0,g.qj)({facilitators:[]}),f=[{title:"Name",dataIndex:"first_name",render:(t,e)=>(0,o.Wm)("span",null,[e.first_name,(0,o.Uk)(" "),e.last_name])},{title:"Phone Number",dataIndex:"phone_no",key:"phone_no"},{title:"ID Number",dataIndex:"id_no",key:"id_no"}],u=async()=>{const t=await fetch(`http://41.89.92.206/massnet/api/event/${n.event_code}/facilitators`,{method:"GET",headers:{"Content-Type":"application/json",...(0,x["default"])()}}),e=await t.json();this.facilitators=e.data,p.Z.info({title:"Facilitators",content:(0,o.Wm)("div",null,[(0,o.Wm)(l.ZP,{dataSource:e.data,columns:f},null)]),onOk(){}})};return(0,o.bv)((()=>{e("eventCampaignData",parseInt(i.id,10))})),{title:d,content:c,project:r,params:i,matched:a,facilitators:h,getfacilitators:u}}});var u=f,b=r(83744);const y=(0,b.Z)(u,[["render",n]]);var w=y}}]);
//# sourceMappingURL=2998.1e7062e7.js.map