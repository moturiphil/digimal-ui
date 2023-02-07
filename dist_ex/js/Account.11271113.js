"use strict";(self["webpackChunkMassNetCampaign"]=self["webpackChunkMassNetCampaign"]||[]).push([[1918],{74441:function(t,e,o){o.r(e),o.d(e,{AccountWrapper:function(){return r},ChangePasswordWrapper:function(){return l},NotificationWrapper:function(){return d},ProfileAuthorBox:function(){return i},SettingWrapper:function(){return a},SocialProfileForm:function(){return p}});var n=o(23481);const i=n.ZP.div`
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
`,a=n.ZP.div`
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
`,r=n.ZP.div`
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
`},87877:function(t,e,o){o.r(e),o.d(e,{default:function(){return _}});var n=o(66252),i=o(3577);const a={class:"setting-card-title"},r=(0,n._)("span",null,"Update your username and manage your account",-1),l={class:"account-form-top"},p={class:"account-form"},d={class:"account-form-bottom"},c={class:"account-closing"},m=(0,n._)("p",null,"Delete Your Account and Account data",-1),s={class:"account-action"},u={class:"setting-form-actions"};function g(t,e,o,g,f,h){const x=(0,n.up)("sdHeading"),b=(0,n.up)("a-input"),w=(0,n.up)("a-form-item"),v=(0,n.up)("a-col"),y=(0,n.up)("a-row"),_=(0,n.up)("sdButton"),$=(0,n.up)("a-form"),W=(0,n.up)("BasicFormWrapper"),k=(0,n.up)("sdCards"),F=(0,n.up)("AccountWrapper");return(0,n.wg)(),(0,n.j4)(F,null,{default:(0,n.w5)((()=>[(0,n.Wm)(k,null,{title:(0,n.w5)((()=>[(0,n._)("div",a,[(0,n.Wm)(x,{as:"h4"},{default:(0,n.w5)((()=>[(0,n.Uk)("Account Settings")])),_:1}),r])])),default:(0,n.w5)((()=>[(0,n.Wm)(y,null,{default:(0,n.w5)((()=>[(0,n.Wm)(v,{xs:24},{default:(0,n.w5)((()=>[(0,n.Wm)(W,null,{default:(0,n.w5)((()=>[(0,n.Wm)($,{model:t.formState,onFinish:t.handleFinish,onFinishFailed:t.handleFinishFailed,layout:"vertical"},{default:(0,n.w5)((()=>[(0,n._)("div",l,[(0,n.Wm)(y,{type:"flex",justify:"center"},{default:(0,n.w5)((()=>[(0,n.Wm)(v,{xxl:10,lg:16,md:18,xs:24},{default:(0,n.w5)((()=>[(0,n._)("div",p,[(0,n.Wm)(w,{label:"Username"},{default:(0,n.w5)((()=>[(0,n.Wm)(b,{value:t.formState.username,"onUpdate:value":e[0]||(e[0]=e=>t.formState.username=e),onChange:t.handleChange},null,8,["value","onChange"])])),_:1}),(0,n._)("p",null,[(0,n.Uk)(" Your Dashboard URL: http://dashboard.com/"),(0,n._)("span",null,(0,i.zw)(t.name),1)]),(0,n.Wm)(w,{label:"Email"},{default:(0,n.w5)((()=>[(0,n.Wm)(b,{value:t.formState.email,"onUpdate:value":e[1]||(e[1]=e=>t.formState.email=e)},null,8,["value"])])),_:1})])])),_:1})])),_:1})]),(0,n._)("div",d,[(0,n.Wm)(y,{type:"flex",justify:"center"},{default:(0,n.w5)((()=>[(0,n.Wm)(v,{xxl:10,lg:16,md:18,xs:24},{default:(0,n.w5)((()=>[(0,n._)("div",c,[(0,n.Wm)(y,null,{default:(0,n.w5)((()=>[(0,n.Wm)(v,{lg:18,md:24,sm:18,xs:24},{default:(0,n.w5)((()=>[(0,n.Wm)(x,{class:"account-closing__title",as:"h4"},{default:(0,n.w5)((()=>[(0,n.Uk)(" Close Account ")])),_:1}),m])),_:1}),(0,n.Wm)(v,{lg:6,md:24,sm:6,xs:24},{default:(0,n.w5)((()=>[(0,n.Wm)(_,{size:"small",type:"danger"},{default:(0,n.w5)((()=>[(0,n.Uk)(" Close Account ")])),_:1})])),_:1})])),_:1})]),(0,n._)("div",s,[(0,n._)("div",u,[(0,n.Wm)(_,{size:"default",htmlType:"submit",type:"primary"},{default:(0,n.w5)((()=>[(0,n.Uk)(" Save Change ")])),_:1}),(0,n.Uk)("     "),(0,n.Wm)(_,{size:"default",onClick:t.handleCancel,type:"light"},{default:(0,n.w5)((()=>[(0,n.Uk)(" Cancel ")])),_:1},8,["onClick"])])])])),_:1})])),_:1})])])),_:1},8,["model","onFinish","onFinishFailed"])])),_:1})])),_:1})])),_:1})])),_:1})])),_:1})}var f=o(74441),h=o(72984),x=o(2262);const b=(0,n.aZ)({name:"Account",components:{AccountWrapper:f.AccountWrapper,BasicFormWrapper:h.BasicFormWrapper},data(){const t="clayton",e=(0,x.qj)({username:t,email:"contact@example.com"}),o=t=>{this.values={...t},console.log(t,e)},n=t=>{console.log(t)};return{name:t,values:null,formState:e,handleFinish:o,handleFinishFailed:n}},methods:{handleSubmit(t){t.preventDefault(),this.form.validateFields(((t,e)=>{t||(this.values={...e,tags:this.tags},console.log(e))}))},handleCancel(t){t.preventDefault()},handleChange(t){this.name=t.target.value}}});var w=b,v=o(83744);const y=(0,v.Z)(w,[["render",g]]);var _=y}}]);
//# sourceMappingURL=Account.11271113.js.map