"use strict";(self["webpackChunkMassNetCampaign"]=self["webpackChunkMassNetCampaign"]||[]).push([[6458],{74441:function(t,e,o){o.r(e),o.d(e,{AccountWrapper:function(){return n},ChangePasswordWrapper:function(){return l},NotificationWrapper:function(){return c},ProfileAuthorBox:function(){return a},SettingWrapper:function(){return r},SocialProfileForm:function(){return p}});var i=o(23481);const a=i.ZP.div`
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
`,r=i.ZP.div`
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
`,n=i.ZP.div`
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
`,l=i.ZP.div`
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
`,p=i.ZP.div`
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
`,c=i.ZP.div`
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
`},8059:function(t,e,o){o.r(e),o.d(e,{default:function(){return h}});var i=o(66252),a=o(3577);const r={class:"setting-card-title"},n=(0,i._)("span",null,"Add elsewhere links to your profile ",-1),l={class:"setting-form-actions"};function p(t,e,o,p,c,d){const s=(0,i.up)("sdHeading"),m=(0,i.up)("font-awesome-icon"),u=(0,i.up)("a-input"),f=(0,i.up)("a-form-item"),x=(0,i.up)("sdButton"),g=(0,i.up)("a-form"),h=(0,i.up)("BasicFormWrapper"),b=(0,i.up)("a-col"),w=(0,i.up)("a-row"),y=(0,i.up)("SocialProfileForm"),v=(0,i.up)("sdCards");return(0,i.wg)(),(0,i.j4)(v,null,{title:(0,i.w5)((()=>[(0,i._)("div",r,[(0,i.Wm)(s,{as:"h4"},{default:(0,i.w5)((()=>[(0,i.Uk)("Social Profiles")])),_:1}),n])])),default:(0,i.w5)((()=>[(0,i.Wm)(y,null,{default:(0,i.w5)((()=>[(0,i.Wm)(w,{type:"flex",justify:"center"},{default:(0,i.w5)((()=>[(0,i.Wm)(b,{xxl:12,xl:14,sm:18,xs:24},{default:(0,i.w5)((()=>[(0,i.Wm)(h,null,{default:(0,i.w5)((()=>[(0,i.Wm)(g,{onSubmit:t.handleSubmit,layout:"vertical"},{default:(0,i.w5)((()=>[(0,i.Wm)(f,{label:"Facebook"},{default:(0,i.w5)((()=>[(0,i.Wm)(u,{value:t.formState.facebook,class:"facebook",placeholder:"URL"},{prefix:(0,i.w5)((()=>[(0,i.Wm)(m,{class:"super-crazy-colors",icon:t.faFacebookF,size:"1x",style:(0,a.j5)({textShadow:"0 1px 0 rgba(0, 0, 0, 0.1)"})},null,8,["icon","style"])])),_:1},8,["value"])])),_:1}),(0,i.Wm)(f,{label:"Twitter"},{default:(0,i.w5)((()=>[(0,i.Wm)(u,{value:t.formState.twitter,class:"twitter",placeholder:"URL"},{prefix:(0,i.w5)((()=>[(0,i.Wm)(m,{class:"super-crazy-colors",icon:t.faTwitter,size:"1x",style:(0,a.j5)({textShadow:"0 1px 0 rgba(0, 0, 0, 0.1)"})},null,8,["icon","style"])])),_:1},8,["value"])])),_:1}),(0,i.Wm)(f,{label:"Dribbble"},{default:(0,i.w5)((()=>[(0,i.Wm)(u,{value:t.formState.dribble,class:"dribbble",placeholder:"URL"},{prefix:(0,i.w5)((()=>[(0,i.Wm)(m,{class:"super-crazy-colors",icon:t.faDribbble,size:"1x",style:(0,a.j5)({textShadow:"0 1px 0 rgba(0, 0, 0, 0.1)"})},null,8,["icon","style"])])),_:1},8,["value"])])),_:1}),(0,i.Wm)(f,{label:"Instagram"},{default:(0,i.w5)((()=>[(0,i.Wm)(u,{value:t.formState.instagram,class:"instagram",placeholder:"URL"},{prefix:(0,i.w5)((()=>[(0,i.Wm)(m,{class:"super-crazy-colors",icon:t.faInstagram,size:"1x",style:(0,a.j5)({textShadow:"0 1px 0 rgba(0, 0, 0, 0.1)"})},null,8,["icon","style"])])),_:1},8,["value"])])),_:1}),(0,i.Wm)(f,{label:"Github"},{default:(0,i.w5)((()=>[(0,i.Wm)(u,{value:t.formState.github,class:"github",placeholder:"URL"},{prefix:(0,i.w5)((()=>[(0,i.Wm)(m,{class:"super-crazy-colors",icon:t.faGithub,size:"1x",style:(0,a.j5)({textShadow:"0 1px 0 rgba(0, 0, 0, 0.1)"})},null,8,["icon","style"])])),_:1},8,["value"])])),_:1}),(0,i.Wm)(f,{label:"Medium"},{default:(0,i.w5)((()=>[(0,i.Wm)(u,{value:t.formState.medium,class:"medium",placeholder:"URL"},{prefix:(0,i.w5)((()=>[(0,i.Wm)(m,{class:"super-crazy-colors",icon:t.faMediumM,size:"1x",style:(0,a.j5)({textShadow:"0 1px 0 rgba(0, 0, 0, 0.1)"})},null,8,["icon","style"])])),_:1},8,["value"])])),_:1}),(0,i._)("div",l,[(0,i.Wm)(x,{onClick:t.handleSubmit,size:"default",htmlType:"submit",type:"primary"},{default:(0,i.w5)((()=>[(0,i.Uk)(" Update Social Profile ")])),_:1},8,["onClick"]),(0,i.Uk)("     "),(0,i.Wm)(x,{size:"default",onClick:t.handleCancel,type:"light"},{default:(0,i.w5)((()=>[(0,i.Uk)(" Cancel ")])),_:1},8,["onClick"])])])),_:1},8,["onSubmit"])])),_:1})])),_:1})])),_:1})])),_:1})])),_:1})}var c=o(74441),d=o(72984),s=o(51417),m=o(2262);const u=(0,i.aZ)({name:"SocialProfile",data(){const t="clayton",e=(0,m.qj)({facebook:"",twitter:"",instagram:"",dribble:"",medium:"",github:""}),o=t=>{this.values={...t},console.log(t,e)},i=t=>{console.log(t)};return{name:t,values:null,formState:e,handleFinish:o,handleFinishFailed:i,faFacebookF:s.AYu,faDribbble:s.KQj,faTwitter:s.mdU,faInstagram:s.Zzi,faGithub:s.zhw,faMediumM:s.cly}},components:{SocialProfileForm:c.SocialProfileForm,BasicFormWrapper:d.BasicFormWrapper},methods:{handleSubmit(t){t.preventDefault(),this.form.validateFields(((t,e)=>{t||(this.values={...e,tags:this.tags},console.log(e))}))},handleCancel(t){t.preventDefault()}}});var f=u,x=o(83744);const g=(0,x.Z)(f,[["render",p]]);var h=g}}]);
//# sourceMappingURL=Social.b30b509b.js.map