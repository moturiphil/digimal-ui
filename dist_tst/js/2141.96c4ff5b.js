"use strict";(self["webpackChunkMassNetCampaign"]=self["webpackChunkMassNetCampaign"]||[]).push([[2141],{47487:function(t,e,r){r.r(e),r.d(e,{ActivitiesWrapper:function(){return h},ProjectCard:function(){return n},ProjectDetailsWrapper:function(){return d},ProjectHeader:function(){return a},ProjectList:function(){return s},ProjectListAssignees:function(){return c},ProjectListTitle:function(){return p},ProjectModalFooter:function(){return x},ProjectPagination:function(){return l},ProjectSorting:function(){return i},TaskLists:function(){return g},TasklistAction:function(){return m}});var o=r(23481);const a=o.ZP.div`
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
`,i=o.ZP.div`
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
`,c=o.ZP.div`
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
`,s=o.ZP.div`
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
`,d=o.ZP.div`
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
`},89666:function(t,e,r){r.r(e),r.d(e,{default:function(){return b}});var o=r(66252);function a(t,e,r,a,i,n){const l=(0,o.up)("a-table"),p=(0,o.up)("TableWrapper"),c=(0,o.up)("UserTableStyleWrapper");return(0,o.wg)(),(0,o.j4)(c,null,{default:(0,o.w5)((()=>[(0,o.Wm)(p,{class:"table-responsive"},{default:(0,o.w5)((()=>[(0,o.Wm)(l,{rowSelection:t.rowSelection,pagination:{pageSize:10,showSizeChanger:!0},dataSource:t.dataSource,columns:t.columns},null,8,["rowSelection","dataSource","columns"])])),_:1})])),_:1})}var i=r(25830),n=r(72984),l=r(2262),p=r(22201),c=r(40008),s=r(9669),d=r.n(s),g=r(33907);const m=[{title:"Event Name",dataIndex:"name",key:"id"},{title:"Event Code",dataIndex:"event_code",key:"id"},{title:"Event Status",dataIndex:"status",key:"id"},{title:"Event Venue",dataIndex:"venue",key:"id"},{title:"Actions",dataIndex:"",key:"events",slots:{customRender:"events"},width:"90px"}],h=(0,o.aZ)({name:"EventCampaignTable",components:{UserTableStyleWrapper:i.UserTableStyleWrapper,TableWrapper:n.TableWrapper},setup(){const{state:t}=(0,g.oR)(),e=(0,o.Fl)((()=>t.crud.data)),r=(0,l.iH)([]),a=(0,l.iH)([]),i="http://41.89.92.206/massnet/api/campaign",n=(0,p.yj)(),s=(0,l.qj)({value:n.params.id});(0,o.bv)((async()=>{try{const t=await d().get(`${i}/${s.value}/events`,{headers:(0,c["default"])()});t.data.data.length>0&&t.data.data.forEach((t=>{0===t.status?t.status="Inactive":1===t.status&&(t.status="Active")})),r.value=t.data.data}catch(t){console.error(t)}}));const h=t=>{a.value=t},x={selectedRowKeys:a,onChange:h};return{columns:m,eventData:e,rowSelection:x,dataSource:r,selectedRowKeys:a,onSelectChange:h}}});var x=h,f=r(83744);const u=(0,f.Z)(x,[["render",a]]);var b=u},82141:function(t,e,r){r.r(e),r.d(e,{default:function(){return u}});var o=r(66252),a=r(3577);const i={key:"1",class:"project-header"},n={key:0,class:"spin"};function l(t,e,r,l,p,c){const s=(0,o.up)("sdHeading"),d=(0,o.up)("sdPageHeader"),g=(0,o.up)("a-spin"),m=(0,o.up)("sdCards"),h=(0,o.up)("a-col"),x=(0,o.up)("EventCampaignTable"),f=(0,o.up)("a-row"),u=(0,o.up)("Main"),b=(0,o.up)("ProjectDetailsWrapper");return(0,o.wg)(),(0,o.j4)(b,null,{default:(0,o.w5)((()=>[t.project?((0,o.wg)(),(0,o.j4)(d,{key:0},{title:(0,o.w5)((()=>[(0,o._)("div",i,[(0,o.Wm)(s,{as:"h2"},{default:(0,o.w5)((()=>[(0,o.Uk)((0,a.zw)(t.project[0].title),1)])),_:1})])])),_:1})):(0,o.kq)("",!0),(0,o.Wm)(u,null,{default:(0,o.w5)((()=>[t.project?((0,o.wg)(),(0,o.j4)(f,{key:1,gutter:25},{default:(0,o.w5)((()=>[(0,o.Wm)(h,{xxl:6,xl:8,md:24,xs:24},{default:(0,o.w5)((()=>[(0,o.Wm)(m,{headless:""})])),_:1}),(0,o.Wm)(h,{xxl:18,xl:24,md:24,xs:24},{default:(0,o.w5)((()=>[(0,o.Wm)(m,{title:"Event List Table"},{default:(0,o.w5)((()=>[(0,o.Wm)(x)])),_:1})])),_:1})])),_:1})):((0,o.wg)(),(0,o.iD)("div",n,[(0,o.Wm)(g)]))])),_:1})])),_:1})}var p=r(47487),c=r(72984),s=r(33907),d=r(22201),g=r(89666);const m=(0,o.aZ)({name:"ProjectDetails",components:{ProjectDetailsWrapper:p.ProjectDetailsWrapper,Main:c.Main,EventCampaignTable:g["default"]},setup(){const{state:t,dispatch:e}=(0,s.oR)(),r=(0,o.Fl)((()=>t.project.singData)),{params:a,matched:i}=(0,d.yj)(),{title:n,content:l}=(0,o.Fl)((()=>t.project.singData[0]));return(0,o.bv)((()=>e("eventCampaignData",parseInt(a.id,10)))),{title:n,content:l,project:r,params:a,matched:i}}});var h=m,x=r(83744);const f=(0,x.Z)(h,[["render",l]]);var u=f}}]);
//# sourceMappingURL=2141.96c4ff5b.js.map