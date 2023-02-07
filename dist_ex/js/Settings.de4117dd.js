"use strict";(self["webpackChunkMassNetCampaign"]=self["webpackChunkMassNetCampaign"]||[]).push([[2265],{74441:function(t,e,o){o.r(e),o.d(e,{AccountWrapper:function(){return a},ChangePasswordWrapper:function(){return l},NotificationWrapper:function(){return d},ProfileAuthorBox:function(){return i},SettingWrapper:function(){return r},SocialProfileForm:function(){return p}});var n=o(23481);const i=n.ZP.div`
    .ant-card-body{
        padding: 25px 0 25px !important;
    }
    .author-info{
        padding: 0 20px 20px;
        text-align: center;
        border-bottom: 1px solid ${({theme:t})=>t["border-color-light"]};
        .info{
            background-color: transparent;
        }
    }
    figure{
        position: relative;
        max-width: 120px;
        margin: 0 auto 18px;
        .ant-upload-select{
            position: absolute;
            ${({theme:t})=>t.rtl?"left":"right"}: 0;
            bottom: -2px;
            height: 40px;
            width: 40px;
            background: #fff;
            display: inline-flex;
            align-items: center;
            justify-content: center;
            border-radius: 50%;
            span{
                display: inline-flex;
                height: 32px;
                align-items: center;
                justify-content: center;
                border-radius: 50%;
                width: 32px;
                background: ${({theme:t})=>t["primary-color"]};
            }
            a{
                display: flex;
                align-items: center;
                justify-content: center;
                color: #fff;
            }
            i{
                color: #fff;
            }
        }
    }
    figcaption{
        .info{
            h1,
            h2,
            h3,
            h4,
            h5,
            h6{
                font-size: 18px;
                margin-bottom: 4px;
            }
            p{
                margin-bottom: 0;
                color: ${({theme:t})=>t["light-color"]};
            }
        }
    }

    .settings-menmulist{
        padding: 20px 20px 0px 20px;
        li{
            a{
                display: flex;
                align-items: center;
                padding: 12px 20px;
                border-radius: 6px;
                color: ${({theme:t})=>t["light-color"]};
                i,
                svg,
                img{
                    ${({theme:t})=>t.rtl?"margin-left":"margin-right"}: 6px;
                }
                &.router-link-active{
                    font-weight: 500;
                    color: ${({theme:t})=>t["primary-color"]};
                    background: ${({theme:t})=>t["primary-color"]}05;
                }
            }
        }
    }
`,r=n.ZP.div`
    .cover-image{
        position: relative;
        margin-bottom: 25px;
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
`,a=n.ZP.div`
    .ant-card-body{
        padding: 30px 25px 25px 25px !important;
        @media only screen and (max-width: 767px){
            padding: 20px !important;
        }
    }
    .account-form-top{
        margin-bottom: 26px;
        padding-bottom: 30px;
        border-bottom: 1px solid ${({theme:t})=>t["border-color-light"]};
    }
    .account-form{
        .ant-row{
            &:not(:last-child){
                margin-bottom: 0;
            }
        }
        p{
            margin: 2px 0 22px;
            color: ${({theme:t})=>t["light-color"]};
            span{
                    font-weight: 500;
                    color: ${({theme:t})=>t["dark-color"]};
            }
        }
    }
    .account-closing{
        .ant-row{
            display: flex;
            align-items: center;
            width: 100%;
        }
        .account-closing__title{
            font-size: 16px;
        }
        p{
            margin-bottom: 0;
            color: ${({theme:t})=>t["gray-color"]};
        }
        button{
            height: 38px;
            padding: 0 16.75px;
            @media only screen and (max-width: 991px){
                margin-top: 14px;
            }
            @media only screen and (max-width: 767px){
                margin-top: 0px;
            }
            @media only screen and (max-width: 575px){
                margin-top: 14px;
            }
        }
    }
    .account-action{
        button{
            height: 44px;
        }
        .ant-btn-light{
            font-weight: 400;
            background: ${({theme:t})=>t["bg-color-light"]};
            border: 1px solid ${({theme:t})=>t["border-color-light"]};
        }
    }
`,l=n.ZP.div`
    .ant-card-body{
        min-height: 565px;
    }
    form{
        .ant-input{
            background: none !important;
        }
        .ant-form-item-control-input-content{
            .ant-input-password:not(.ant-input-affix-wrapper){
            padding: ${({theme:t})=>t.rtl?"0 0 0 20px":"0 20px 0 0"} !important;
            }
        }
        .input-message{
            font-size: 13px;
            color: ${({theme:t})=>t["light-color"]};
            margin: -22px 0 0;
        }
        .ant-form-item-control-input-content{
            .anticon-eye-invisible{
                svg,
                i{
                    color: ${({theme:t})=>t["extra-light-color"]};
                }
            }
        }
        .setting-form-actions{
            button{
                border-radius: 6px;
            }
            .ant-btn-light{
                color: ${({theme:t})=>t["gray-color"]};
                border: 1px solid ${({theme:t})=>t["border-color-light"]};
            }
        }
    }
`,p=n.ZP.div`
    .ant-form-item-control-input{
        min-height: 44px;
        .ant-form-item-control-input-content{
            input{
            padding: ${({theme:t})=>t.rtl?"12px 50px 12px 20px":"12px 20px 12px 50px"} !important;
            }
            input::placeholder{
                font-size: 13px;
                color: ${({theme:t})=>t["light-color"]};
            }
        }
        .ant-input-affix-wrapper{
            padding: 0 !important;
        }
    }
    .ant-form-item{
        button{
            padding: 0px 23px;
        }
        label{
            color: ${({theme:t})=>t["dark-color"]};
        }
        .ant-input-affix-wrapper{
            position: relative;
            input{
                ${({theme:t})=>t.rtl?"padding-right":"padding-left"}: 50px;
            }
            span.fa,
            i{
                font-size: 18px;
                color: #fff;
            }
            &.facebook{
                .ant-input-prefix{
                    background: #3B5998;
                    border-radius: 4px;
                }
            }
            &.twitter{
                .ant-input-prefix{
                    background: #1DA1F2;
                    border-radius: 4px;
                }
            }
            &.dribbble{
                .ant-input-prefix{
                    background: #DD3E7C;
                    border-radius: 4px;
                }
            }
            &.instagram{
                .ant-input-prefix{
                    background: #FF0300;
                    border-radius: 4px;
                }
            }
            &.github{
                .ant-input-prefix{
                    background: #23282D;
                    border-radius: 4px;
                }
            }
            &.medium{
                .ant-input-prefix{
                    background: #292929;
                    border-radius: 4px;
                }
            }
            .ant-input-prefix{
                position: absolute;
                height: 100%;
                width: 44px;
                display: inline-flex;
                align-items: center;
                justify-content: center;
                ${({theme:t})=>t.rtl?"right":"left"}: 0;
                top: 50%;
                transform: translateY(-50%);
                background: #ddd;
                z-index: 1;
                i,
                svg{
                    color: #fff;
                }
            }
        }
    }

    .social-form-actions{
        margin-top: 25px;
    }
`,d=n.ZP.div`
    .notification-box-single{
        .ant-card{
            border: 1px solid ${({theme:t})=>t["border-color-light"]};
        }
        .notification-header{
            margin-top: -8px;
            .notification-header__text{
                font-size: 15px;
                font-weight: 500;
                color: ${({theme:t})=>t["light-color"]};
            }
            .btn-toggle{
                font-size: 13px;
                color: ${({theme:t})=>t["info-color"]};
            }
        }
        .notification-body{
            box-shadow: 0 10px 30px ${({theme:t})=>t["light-color"]}10;
            .ant-card{
                margin-bottom: 0 !important;
            }
            .ant-card-body{
                padding: 5px 0 !important;
            }
            nav{
                li{
                    padding: 15px 25px !important;
                    @media only screen and (max-width: 575px){
                        padding: 15px 20px !important;
                    }
                    &:not(:last-child){
                        border-bottom: 1px solid ${({theme:t})=>t["border-color-light"]};
                    }
                }
            }
        }
        .notification-list-single{
            .notification-list-single__title{
                font-size: 14px;
                font-weight: 500;
                margin-bottom: 2px;
                color: ${({theme:t})=>t["gray-color"]};
            }
            p{
                margin-bottom: 3px;
                color: ${({theme:t})=>t["light-color"]};
            }
        }
    }
    .notification-actions{
        margin: 26px 0 11px;
        button{
            border-radius: 6px;
            height: 44px;
            margin-bottom: 15px;
        }
    }
`},31391:function(t,e,o){o.r(e),o.d(e,{default:function(){return g}});var n=o(66252);const i={class:"page-header-actions"},r={class:"spin"};function a(t,e,o,a,l,p){const d=(0,n.up)("sdCalendarButton"),s=(0,n.up)("sdExportButton"),c=(0,n.up)("sdShareButton"),m=(0,n.up)("sdFeatherIcons"),u=(0,n.up)("sdButton"),g=(0,n.up)("sdPageHeader"),f=(0,n.up)("author-box"),x=(0,n.up)("ProfileAuthorBox"),h=(0,n.up)("a-col"),b=(0,n.up)("CoverSection"),w=(0,n.up)("router-view"),y=(0,n.up)("a-spin"),v=(0,n.up)("SettingWrapper"),_=(0,n.up)("a-row"),$=(0,n.up)("Main");return(0,n.wg)(),(0,n.iD)("div",null,[(0,n.Wm)(g,{title:"Profile Settings"},{buttons:(0,n.w5)((()=>[(0,n._)("div",i,[(0,n.Wm)(d),(0,n.Wm)(s),(0,n.Wm)(c),(0,n.Wm)(u,{size:"small",type:"primary"},{default:(0,n.w5)((()=>[(0,n.Wm)(m,{type:"plus",size:"14"}),(0,n.Uk)(" Add New ")])),_:1})])])),_:1}),(0,n.Wm)($,null,{default:(0,n.w5)((()=>[(0,n.Wm)(_,{gutter:25},{default:(0,n.w5)((()=>[(0,n.Wm)(h,{xxl:6,lg:8,md:10,xs:24},{default:(0,n.w5)((()=>[(0,n.Wm)(x,null,{default:(0,n.w5)((()=>[(0,n.Wm)(f)])),_:1})])),_:1}),(0,n.Wm)(h,{xxl:18,lg:16,md:14,xs:24},{default:(0,n.w5)((()=>[(0,n.Wm)(v,null,{default:(0,n.w5)((()=>[(0,n.Wm)(b),((0,n.wg)(),(0,n.j4)(n.n4,null,{default:(0,n.w5)((()=>[(0,n.Wm)(w)])),fallback:(0,n.w5)((()=>[(0,n._)("div",r,[(0,n.Wm)(y)])])),_:1}))])),_:1})])),_:1})])),_:1})])),_:1})])}var l=o(72984),p=o(74441),d=o(96160),s=o(625),c=(0,n.aZ)({name:"Settings",components:{Main:l.Main,SettingWrapper:p.SettingWrapper,AuthorBox:s["default"],CoverSection:d["default"],ProfileAuthorBox:p.ProfileAuthorBox},data(){return{}}}),m=o(83744);const u=(0,m.Z)(c,[["render",a]]);var g=u},96160:function(t,e,o){o.r(e),o.d(e,{default:function(){return m}});var n=o(66252);const i={class:"cover-image"},r=["src"],a={to:"#"};function l(t,e,l,p,d,s){const c=(0,n.up)("sdFeatherIcons"),m=(0,n.up)("a-upload");return(0,n.wg)(),(0,n.iD)("div",i,[(0,n._)("img",{style:{width:"100%"},src:o(34551),alt:"banner"},null,8,r),(0,n.Wm)(m,{name:"file",action:"https://www.mocky.io/v2/5cc8019d300000980a055e76",headers:t.headers,onChange:t.onChange},{default:(0,n.w5)((()=>[(0,n._)("a",a,[(0,n.Wm)(c,{type:"camera",size:"16"}),(0,n.Uk)(" Change Cover ")])])),_:1},8,["headers","onChange"])])}const p=(0,n.aZ)({name:"CoverSection",components:{},data(){return{headers:{authorization:"authorization-text"}}},methods:{onChange(t){"uploading"!==t.file.status&&console.log(t.file,t.fileList),"done"===t.file.status?this.$message.success(`${t.file.name} file uploaded successfully`):"error"===t.file.status&&this.$message.error(`${t.file.name} file upload failed.`)}}});var d=p,s=o(83744);const c=(0,s.Z)(d,[["render",l]]);var m=c},625:function(t,e,o){o.r(e),o.d(e,{default:function(){return g}});var n=o(66252);const i={class:"author-info"},r=["src"],a={to:"#"},l={class:"info"},p=(0,n._)("p",null,"UI/UX Designer",-1),d={class:"settings-menmulist"};function s(t,e,s,c,m,u){const g=(0,n.up)("sdFeatherIcons"),f=(0,n.up)("a-upload"),x=(0,n.up)("sdHeading"),h=(0,n.up)("router-link"),b=(0,n.up)("sdCards");return(0,n.wg)(),(0,n.j4)(b,{headless:""},{default:(0,n.w5)((()=>[(0,n._)("div",i,[(0,n._)("figure",null,[(0,n._)("img",{src:o(44016),alt:""},null,8,r),(0,n.Wm)(f,{action:"https://www.mocky.io/v2/5cc8019d300000980a055e76"},{default:(0,n.w5)((()=>[(0,n._)("a",a,[(0,n.Wm)(g,{type:"camera",size:"16"})])])),_:1})]),(0,n._)("figcaption",null,[(0,n._)("div",l,[(0,n.Wm)(x,{as:"h4"},{default:(0,n.w5)((()=>[(0,n.Uk)("Duran Clayton")])),_:1}),p])])]),(0,n._)("nav",d,[(0,n._)("ul",null,[(0,n._)("li",null,[(0,n.Wm)(h,{to:{name:"set-profile"}},{default:(0,n.w5)((()=>[(0,n.Wm)(g,{type:"user",size:"14"}),(0,n.Uk)(" Edit Profile ")])),_:1})]),(0,n._)("li",null,[(0,n.Wm)(h,{to:{name:"set-account"}},{default:(0,n.w5)((()=>[(0,n.Wm)(g,{type:"settings",size:"14"}),(0,n.Uk)(" Account Settings ")])),_:1})]),(0,n._)("li",null,[(0,n.Wm)(h,{to:{name:"set-password"}},{default:(0,n.w5)((()=>[(0,n.Wm)(g,{type:"key",size:"14"}),(0,n.Uk)(" Change Password ")])),_:1})]),(0,n._)("li",null,[(0,n.Wm)(h,{to:{name:"set-social"}},{default:(0,n.w5)((()=>[(0,n.Wm)(g,{type:"users",size:"14"}),(0,n.Uk)(" Social Profile ")])),_:1})]),(0,n._)("li",null,[(0,n.Wm)(h,{to:{name:"set-notification"}},{default:(0,n.w5)((()=>[(0,n.Wm)(g,{type:"bell",size:"14"}),(0,n.Uk)(" Notification ")])),_:1})])])])])),_:1})}var c={name:"AuthorBox",components:{}},m=o(83744);const u=(0,m.Z)(c,[["render",s]]);var g=u},34551:function(t,e,o){t.exports=o.p+"img/cover-img.8b84ff16.png"}}]);
//# sourceMappingURL=Settings.de4117dd.js.map