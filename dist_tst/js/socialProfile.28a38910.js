"use strict";(self["webpackChunkMassNetCampaign"]=self["webpackChunkMassNetCampaign"]||[]).push([[2766,2340,3430],{63430:function(t,e,i){i.r(e),i.d(e,{ActivityContents:function(){return l},ProductOverviewTable:function(){return p},RightAsideWrapper:function(){return n},SettingWrapper:function(){return a},UserBioBox:function(){return r}});var o=i(23481);const r=o.ZP.div`
    .ant-card-body{
        padding: 25px 0 25px 0 !important;
    }

    .user-info{
        margin-bottom: 22px;
        padding: 0 25px 22px 25px;
        border-bottom: 1px solid ${({theme:t})=>t["border-color-light"]};
        &:last-child{
            border-bottom: 0;
            margin-bottom: 0;
            padding-bottom: 0;
        }
        .user-info__title{
            font-size: 12px;
            color: ${({theme:t})=>t["light-color"]};
            text-transform: uppercase;
            margin-bottom: 16px;
        }
        p{
            font-size: 15px;
            line-height: 1.667;
            color: ${({theme:t})=>t["gray-color"]};
            &:last-child{
                margin-bottom:0;
            }
        }
        .user-info__contact{
            li{
                display: flex;
                align-items: center;
                &:not(:last-child){
                    margin-bottom: 14px;
                }
                svg,
                i,
                img{
                    ${({theme:t})=>t.rtl?"margin-left":"margin-right"}: 12px;
                    color: ${({theme:t})=>t["light-color"]};
                }
                i svg{
                    margin-right: 0;
                }
                span{
                    font-size: 14px;
                    color: ${({theme:t})=>t["gray-color"]};
                }
            }
        }

        .user-info__skills{
            margin: -3px;
            .btn-outlined{
                margin: 3px !important;
                font-size: 11px;
                height: 25px;
                padding: 0px 8.75px;
                text-transform: uppercase;
                border-radius: 5px;
                border-color: ${({theme:t})=>t["border-color-normal"]};
                margin: ${({theme:t})=>t.rtl?"0 0 10px 10px":"0 10px 10px 0"};
                color: ${({theme:t})=>t["gray-color"]} !important;
            }
        }
        .card__social{
            a{
                display: inline-flex;
                align-items: center;
                justify-content: center;
                width: 44px;
                height: 44px;
                border-radius: 50%;
                box-shadow: 0 5px 15px ${({theme:t})=>t["light-color"]}20;
                &:not(:last-child){
                    ${({theme:t})=>t.rtl?"margin-left":"margin-right"}: 10px;
                }
                &.facebook{
                    span, svg{
                        color: #3B5998;
                    }
                }
                &.twitter{
                    span, svg{
                        color: #1DA1F2;
                    }
                }
                &.dribble{
                    span, svg{
                        color: #C2185B;
                    }
                }
                &.instagram{
                    span, svg{
                        color: #FF0300;
                    }
                }
            }
        }
    }

`,a=o.ZP.div`
    .cover-image{
        position: relative;
        .ant-upload-select{
            position: absolute;
            ${({theme:t})=>t.rtl?"left":"right"}: 20px;
            top: 20px;
            border: 1px solid #ffffff50;
            border-radius: 6px;
            @media only screen and (max-width: 991px){
                top: 50%;
                ${({theme:t})=>t.rtl?"left":"right"}: auto;
                left: 50%;
                transform: translate(-50%,-50%);
            }
            a{
                color: #fff;
                padding: 8px 17.35px;
                display: inline-flex;
                align-items: center;
                @media only screen and (max-width: 479px){
                    padding: 5px 10px;
                }
                i,
                svg,
                img
                {
                    ${({theme:t})=>t.rtl?"margin-left":"margin-right"}: 8px;
                }
                svg{
                    color:#fff;
                }
            }
        }
        .ant-upload-list {
            display: none;
        }
    }
    .coverWrapper{
        position: relative;
        z-index: 1;
        margin-bottom: 25px;
        background-color: #fff;
        border-radius: 0 0 10px 10px;
        nav{
            padding: 0 25px;
            ul{
                margin: 0;
                @media only screen and (max-width: 375px){
                    text-align: center;
                    padding: 10px 0;
                }
                li{
                    display: inline-block;
                    @media only screen and (max-width: 375px){
                        display: block;
                    }
                    &:not(:last-child){
                        ${({theme:t})=>t.rtl?"margin-left":"margin-right"}: 22px;
                        @media only screen and (max-width: 375px){
                            ${({theme:t})=>t.rtl?"margin-left":"margin-right"}: 0;
                        }
                    }
                    a{
                        position: relative;
                        display: block;
                        padding: 20px 5px;
                        color: ${({theme:t})=>t["light-color"]};
                        @media only screen and (max-width: 375px){
                            padding: 10px 5px;
                        }
                        &:after{
                            position: absolute;
                            ${({theme:t})=>t.rtl?"right":"left"}: 0;
                            bottom: 0;
                            width: 100%;
                            height: 1.5px;
                            content: '';
                            opacity: 0;
                            visibility: hidden;
                            background-color: ${({theme:t})=>t["primary-color"]};
                            @media only screen and (max-width: 375px){
                                display: none;
                            }
                        }
                        &.active{
                            font-weight: 500;
                            color: ${({theme:t})=>t["primary-color"]};
                            &:after{
                                opacity: 1;
                                visibility: visible;
                            }
                        }
                    }
                }
            }
        }

    }
    .setting-card-title{
        @media only screen and (max-width: 479px){
            text-align: center;
        }
        h1,
        h2,
        h3,
        h4,
        h5,
        h6{
            margin-bottom: 0;
            font-size: 16px;
            font-weight: 500;
        }
        span{
            font-size: 13px;
            font-weight: 400;
            margin: 0;
            color: ${({theme:t})=>t["light-color"]};
        }
    }
`,n=o.ZP.div`
    .ant-card-head{
        .btn-seeAll{
            font-size: 13px;
            font-weight: 500;
            color: ${({theme:t})=>t["primary-color"]};
        }
    }
    .ant-card-body{
        padding: 0 0 25px !important;
        ul{
            margin: 0;
            padding: 0;

            li{
                display: flex;
                align-items: center;
                justify-content: space-between;
                padding: 20px 25px;
                cursor: pointer;

                &:hover{
                    box-shadow: 0 15px 50px #9299B820;
                }

                div{
                    display: flex;
                    img{
                        width: 46px;
                        height: 46px;
                        ${({theme:t})=>t.rtl?"margin-left":"margin-right"}: 10px;
                        border-radius: 50%;
                    }
                    p{
                        margin: 0;
                        padding: 0;
                        span{
                            display: block;
                        }
                    }
                }
            }
            .btn-loadMore{
                display: inline-block;
                margin-top: 10px;
                font-size: 13px;
                font-weight: 500;
                padding: 0 25px;
            }
        }
    }
    .ff-widget{
        li{
            @media only screen and (max-width: 1599px){
                flex-flow: column;
                padding: 20px !important;
                align-items: flex-start !important;
            }
            .ff-info{
                @media only screen and (max-width: 1199px){
                    flex-flow: column;
                }
                @media only screen and (max-width: 767px){
                    flex-flow: row;
                }
                p{
                    font-size: 14px;
                    font-weight: 600;
                    color: ${({theme:t})=>t["dark-color"]};
                    @media only screen and (max-width: 1199px){
                        margin-top: 12px;
                    }
                    @media only screen and (max-width: 767px){
                        margin-top: 0;
                    }
                    span{
                        margin-top: 3px;
                        font-weight: 400;
                        color: ${({theme:t})=>t["light-color"]};
                    }
                }
            }
            .btn-ff{
                font-size: 12px;
                font-weight: 500;
                padding: 0 12.88px;
                height: 32px;
                @media only screen and (max-width: 1599px){
                    margin-top: 15px;
                }
                svg,
                i,
                img{
                    ${({theme:t})=>t.rtl?"margin-left":"margin-right"}: 6px;
                }
                span{
                    display: flex;
                    align-items: center;
                }
            }
        }
        .btn-following {
            border: 1px solid;
        }
    }
    .widget-photo-list,
    .widget-video-list{
        padding: 20px 25px 0;
        .ant-row{
            margin: -4px 0;
            .ant-col{
                margin: 4px 0;
            }
        }
        img{
            max-width: 103px;
            border-radius: 6px;
        }
    }

    .widget-video-list{
        .video{
            display: inline-block;
            position: relative;
            z-index: 4;
            &:after{
                position: absolute;
                ${({theme:t})=>t.rtl?"right":"left"}: 0;
                top: 0;
                width: 100%;
                height: 100%;
                content: '';
                border-radius: 6px;
                background-color: ${({theme:t})=>t["dark-color"]}20;
            }
            span{
                width: 30px;
                height: 30px;
                border-radius: 50%;
                display: flex;
                align-items: center;
                justify-content: center;
                position: absolute;
                top: 50%;
                left: 50%;
                transform: translate(-50%,-50%);
                z-index: 5;
                background-color: ${({theme:t})=>t["dark-color"]}60;
                svg,
                img,
                i{
                    width: 14px;
                    color: #fff;
                }
            }
        }
    }
`,l=o.ZP.div`
    .ant-card-body{
        padding: 25px 0 !important;
    }
    .activity-list{
        margin: 0;
        .activity-list__single{
            padding: 12px 25px;
            display: flex;
            align-items: center;
            .activity-icon{
                width: 31px;
                height: 31px;
                border-radius: 50%;
                display: flex;
                justify-content: center;
                align-items: center;
                background-color: #00000015;
                ${({theme:t})=>t.rtl?"margin-left":"margin-right"}: 15px;
                &.primary{
                    background-color: ${({theme:t})=>t["primary-color"]}15;
                    color: ${({theme:t})=>t["primary-color"]};
                }
                &.secondary{
                    background-color: ${({theme:t})=>t["secondary-color"]}15;
                    color: ${({theme:t})=>t["secondary-color"]};
                }
                &.success{
                    background-color: ${({theme:t})=>t["success-color"]}15;
                    color: ${({theme:t})=>t["success-color"]};
                }
                &.info{
                    background-color: ${({theme:t})=>t["info-color"]}15;
                    color: ${({theme:t})=>t["info-color"]};
                }
                &.danger{
                    background-color: ${({theme:t})=>t["danger-color"]}15;
                    color: ${({theme:t})=>t["danger-color"]};
                }
                &.warning{
                    background-color: ${({theme:t})=>t["warning-color"]}15;
                    color: ${({theme:t})=>t["warning-color"]};
                }
                i{
                    line-height: 0;
                }
            }
            .more{
                visibility: hidden;
            }
            &:hover{
                box-shadow: 0 15px 50px #88888820;
                .more{
                    visibility: visible;
                }
            }
            .activity-content{
                flex: auto;
                display: flex;
                align-items: center;
                justify-content: space-between;
            }
            .activity-info{
                display: flex;
                align-items: center;
                img{
                    max-width: 40px;
                    border-radius: 50%;
                    ${({theme:t})=>t.rtl?"margin-left":"margin-right"}: 20px;
                }
                p{
                    margin-bottom: 0;
                    font-size: 14px;
                    color: ${({theme:t})=>t["gray-color"]};
                    .inline-text{
                        font-weight: 500;
                        display: inline;
                    }
                    .hour{
                        display: block;
                        margin-top: 3px;
                        color: ${({theme:t})=>t["extra-light-color"]};
                    }
                }
            }
            .activity-more{
                svg,
                i{
                    color: ${({theme:t})=>t["extra-light-color"]};
                }
            }
        }

    }
`,p=o.ZP.div`
    .ant-card-body{
        padding: 0 !important;
        .ant-table{
            border-radius: ${({theme:t})=>t.rtl?"10px 10px 0 0":"0 0 10px 10px"};
            margin-top: 1px;
        }
    }
    table{
        margin-bottom: 25px;
        .ant-table-thead > tr > th{
            background-color: #fff;
            color: ${({theme:t})=>t["dark-color"]};
            &:first-child{
                padding-${({theme:t})=>t.rtl?"right":"left"}: 25px;
            }
            &:last-child{
                text-align: ${({theme:t})=>t.rtl?"left":"right"};
                padding-${({theme:t})=>t.rtl?"left":"right"}: 25px;
            }
            &.p_name{
                min-width: 420px;
            }
            &.p_price{
                min-width: 100px;
            }
        }
        .ant-table-tbody{
            tr{
                &:hover{
                    td{
                        background-color: ${({theme:t})=>t["bg-color-light"]};
                    }
                }
                td{
                    padding: 14px 16px;
                    font-size: 14px;
                    color: ${({theme:t})=>t["gray-color"]};
                    border-color: ${({theme:t})=>t["border-color-light"]};
                    &:first-child{
                        padding-${({theme:t})=>t.rtl?"right":"left"}: 25px;
                    }
                    &:last-child{
                        padding-${({theme:t})=>t.rtl?"left":"right"}: 25px;
                        text-align: ${({theme:t})=>t.rtl?"left":"right"};
                    }
                }
            }
        }
    }
`},59438:function(t,e,i){i.r(e),i.d(e,{default:function(){return b}});var o=i(66252);const r={class:"page-header-actions"},a={class:"coverWrapper"},n={class:"profileTab-menu"};function l(t,e,i,l,p,d){const s=(0,o.up)("sdCalendarButton"),m=(0,o.up)("sdExportButton"),c=(0,o.up)("sdShareButton"),g=(0,o.up)("sdFeatherIcons"),h=(0,o.up)("sdButton"),x=(0,o.up)("sdPageHeader"),f=(0,o.up)("UserCards"),u=(0,o.up)("a-skeleton"),b=(0,o.up)("sdCards"),w=(0,o.up)("UserBio"),y=(0,o.up)("a-col"),v=(0,o.up)("CoverSection"),$=(0,o.up)("router-link"),k=(0,o.up)("router-view"),_=(0,o.up)("SettingWrapper"),W=(0,o.up)("a-row"),z=(0,o.up)("Main");return(0,o.wg)(),(0,o.iD)(o.HY,null,[(0,o.Wm)(x,{title:"My Profile"},{buttons:(0,o.w5)((()=>[(0,o._)("div",r,[(0,o.Wm)(s),(0,o.Wm)(m),(0,o.Wm)(c),(0,o.Wm)(h,{size:"small",type:"primary"},{default:(0,o.w5)((()=>[(0,o.Wm)(g,{type:"plus",size:"14"}),(0,o.Uk)(" Add New ")])),_:1})])])),_:1}),(0,o.Wm)(z,null,{default:(0,o.w5)((()=>[(0,o.Wm)(W,{gutter:25},{default:(0,o.w5)((()=>[(0,o.Wm)(y,{xxl:6,lg:8,md:10,xs:24},{default:(0,o.w5)((()=>[((0,o.wg)(),(0,o.j4)(o.n4,null,{default:(0,o.w5)((()=>[(0,o.Wm)(f,{user:{name:"Duran Clyton",designation:"UI/UX Designer",img:"static/img/users/1.png"}},null,8,["user"])])),fallback:(0,o.w5)((()=>[(0,o.Wm)(b,{headless:""},{default:(0,o.w5)((()=>[(0,o.Wm)(u,{avatar:"",active:"",paragraph:{rows:3}})])),_:1})])),_:1})),((0,o.wg)(),(0,o.j4)(o.n4,null,{default:(0,o.w5)((()=>[(0,o.Wm)(w)])),fallback:(0,o.w5)((()=>[(0,o.Wm)(b,{headless:""},{default:(0,o.w5)((()=>[(0,o.Wm)(u,{avatar:"",active:"",paragraph:{rows:3}})])),_:1})])),_:1}))])),_:1}),(0,o.Wm)(y,{xxl:18,lg:16,md:14,xs:24},{default:(0,o.w5)((()=>[(0,o.Wm)(_,null,{default:(0,o.w5)((()=>[((0,o.wg)(),(0,o.j4)(o.n4,null,{default:(0,o.w5)((()=>[(0,o._)("div",a,[(0,o.Wm)(v),(0,o._)("nav",n,[(0,o._)("ul",null,[(0,o._)("li",null,[(0,o.Wm)($,{to:`${t.path}/overview`},{default:(0,o.w5)((()=>[(0,o.Uk)("Overview")])),_:1},8,["to"])]),(0,o._)("li",null,[(0,o.Wm)($,{to:`${t.path}/timeline`},{default:(0,o.w5)((()=>[(0,o.Uk)("Timeline")])),_:1},8,["to"])]),(0,o._)("li",null,[(0,o.Wm)($,{to:`${t.path}/activity`},{default:(0,o.w5)((()=>[(0,o.Uk)("Activity")])),_:1},8,["to"])])])])])])),fallback:(0,o.w5)((()=>[(0,o.Wm)(b,{headless:""},{default:(0,o.w5)((()=>[(0,o.Wm)(u,{active:""})])),_:1})])),_:1})),(0,o.Wm)(k,{name:"child"})])),_:1})])),_:1})])),_:1})])),_:1})],64)}var p=i(22201),d=i(72984),s=i(63430);const m=(0,o.RC)((()=>Promise.all([i.e(3356),i.e(8708),i.e(6646),i.e(5243),i.e(22),i.e(6911),i.e(2998),i.e(1080),i.e(9792),i.e(2141),i.e(533),i.e(4882),i.e(176),i.e(7223),i.e(8172)]).then(i.bind(i,96599)))),c=(0,o.RC)((()=>i.e(1478).then(i.bind(i,81478)))),g=(0,o.RC)((()=>i.e(6646).then(i.bind(i,56646)))),h={name:"MyProfile",components:{Main:d.Main,UserCards:m,UserBio:g,CoverSection:c,SettingWrapper:s.SettingWrapper},setup(){const{matched:t}=(0,p.yj)(),{path:e}=t[1];return{path:e}}};var x=h,f=i(83744);const u=(0,f.Z)(x,[["render",l]]);var b=u}}]);
//# sourceMappingURL=socialProfile.28a38910.js.map