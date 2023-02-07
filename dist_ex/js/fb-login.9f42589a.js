"use strict";(self["webpackChunkMassNetCampaign"]=self["webpackChunkMassNetCampaign"]||[]).push([[4661,609,4535],{35393:function(e,t,n){n.d(t,{Z:function(){return c}});var a=n(66252),i={icon:{tag:"svg",attrs:{viewBox:"64 64 896 896",focusable:"false"},children:[{tag:"path",attrs:{d:"M880 112H144c-17.7 0-32 14.3-32 32v736c0 17.7 14.3 32 32 32h736c17.7 0 32-14.3 32-32V144c0-17.7-14.3-32-32-32zm-32 736H663.9V602.2h104l15.6-120.7H663.9v-77.1c0-35 9.7-58.8 59.8-58.8h63.9v-108c-11.1-1.5-49-4.8-93.2-4.8-92.2 0-155.3 56.3-155.3 159.6v89H434.9v120.7h104.3V848H176V176h672v672z"}}]},name:"facebook",theme:"outlined"},o=i,r=n(85041);function l(e){for(var t=1;t<arguments.length;t++){var n=null!=arguments[t]?Object(arguments[t]):{},a=Object.keys(n);"function"===typeof Object.getOwnPropertySymbols&&(a=a.concat(Object.getOwnPropertySymbols(n).filter((function(e){return Object.getOwnPropertyDescriptor(n,e).enumerable})))),a.forEach((function(t){s(e,t,n[t])}))}return e}function s(e,t,n){return t in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}var d=function(e,t){var n=l({},e,t.attrs);return(0,a.Wm)(r.Z,l({},n,{icon:o}),null)};d.displayName="FacebookOutlined",d.inheritAttrs=!1;var c=d},62348:function(e,t,n){n.d(t,{Z:function(){return c}});var a=n(66252),i={icon:{tag:"svg",attrs:{viewBox:"64 64 896 896",focusable:"false"},children:[{tag:"path",attrs:{d:"M928 254.3c-30.6 13.2-63.9 22.7-98.2 26.4a170.1 170.1 0 0075-94 336.64 336.64 0 01-108.2 41.2A170.1 170.1 0 00672 174c-94.5 0-170.5 76.6-170.5 170.6 0 13.2 1.6 26.4 4.2 39.1-141.5-7.4-267.7-75-351.6-178.5a169.32 169.32 0 00-23.2 86.1c0 59.2 30.1 111.4 76 142.1a172 172 0 01-77.1-21.7v2.1c0 82.9 58.6 151.6 136.7 167.4a180.6 180.6 0 01-44.9 5.8c-11.1 0-21.6-1.1-32.2-2.6C211 652 273.9 701.1 348.8 702.7c-58.6 45.9-132 72.9-211.7 72.9-14.3 0-27.5-.5-41.2-2.1C171.5 822 261.2 850 357.8 850 671.4 850 843 590.2 843 364.7c0-7.4 0-14.8-.5-22.2 33.2-24.3 62.3-54.4 85.5-88.2z"}}]},name:"twitter",theme:"outlined"},o=i,r=n(85041);function l(e){for(var t=1;t<arguments.length;t++){var n=null!=arguments[t]?Object(arguments[t]):{},a=Object.keys(n);"function"===typeof Object.getOwnPropertySymbols&&(a=a.concat(Object.getOwnPropertySymbols(n).filter((function(e){return Object.getOwnPropertyDescriptor(n,e).enumerable})))),a.forEach((function(t){s(e,t,n[t])}))}return e}function s(e,t,n){return t in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}var d=function(e,t){var n=l({},e,t.attrs);return(0,a.Wm)(r.Z,l({},n,{icon:o}),null)};d.displayName="TwitterOutlined",d.inheritAttrs=!1;var c=d},6626:function(e,t,n){n.r(t),n.d(t,{AuthWrapper:function(){return i}});var a=n(23481);const i=a.ZP.div`
  height: 100%;
  padding: 40px;
  @media only screen and (max-width: 1599px){
    padding: 25px;
  }

  @media only screen and (max-width: 767px){
    text-align: center;
  }
  .auth-notice{
    text-align: right;
    font-weight: 500;
    color: ${({theme:e})=>e["gray-color"]};
    @media only screen and (max-width: 767px){
      text-align: center;
      margin-bottom: 10px;
    }
  }
  button{
    &.btn-signin{
      min-width: 185px;
    }
    &.btn-create{
      border-radius: 8px;
      min-width: 205px;
    }
    &.btn-reset{
      border-radius: 8px;
      min-width: 260px;
    }
    &.ant-btn-lg{
      font-size: 14px;
      font-weight: 500;
      height: 48px;
    }
  }
  .auth-contents{
    display: flex;
    align-items: center;
    justify-content: center;
    form{
      width: 420px;
      h1{
        font-size: 24px;
        font-weight: 600;
        margin-bottom: 45px;
        @media only screen and (max-width: 767px){
          margin-bottom: 28px;
        }
        input::placeholder{
          color: ${({theme:e})=>e["extra-light-color"]};
        }
      }
      .ant-input{
        padding: 12px 11px;
      }
      .auth-form-action{
        margin-bottom: 20px;
        display: flex;
        justify-content: space-between;
        @media only screen and (max-width: 379px){
          flex-flow: column;
          .forgot-pass-link{
            margin-top: 15px;
          }
        }
      }
    }
    .ant-form{
      .ant-form-item{
        margin-bottom: 14px;
      }
    }
    #forgotPass{
      .forgot-text{
        margin-bottom: 25px;
      }
      .return-text{
        margin-top: 35px;
      }
    }
    .form-divider{
      font-size: 13px;
      color: ${({theme:e})=>e["gray-solid"]};
      text-align: center;
      position: relative;
      margin-bottom: 25px;
      &:before{
        content: '';
        position: absolute;
        width: 100%;
        left: 0;
        top: 50%;
        transform: translateY(-50%);
        z-index: 1;
        height: 1px;
        background: ${({theme:e})=>e["border-color-light"]};
      }
      span{
        background: #fff;
        padding: 0 15px;
        display: inline-block;
        position: relative;
        z-index: 2;
      }
    }
    .social-login{
      display: flex;
      align-items: center;
      margin: -6px -6px 14px -6px;
      @media only screen and (max-width: 767px){
        justify-content: center;
      }
      &.signin-social{
        li{
          a{
            box-shadow: 0 5px 15px ${({theme:e})=>e["light-color"]}10;
            background-color: #fff;
          }
        }
      }
      li{
        padding:6px;
        a{
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 6px;
          height: 48px;
          padding: 0 15px;
          background: ${({theme:e})=>e["bg-color-light"]};
          color: ${({theme:e})=>e["text-color"]};
          font-weight: 500;
          @media only screen and (max-width: 379px){
            height: 44px;
            padding: 0 12px;
          }
          span:not(.anticon){
            display: inline-block;
            margin-left: 5px;
          }
          svg,
          i{
            width: 20px;
            height: 20px;
          }
          &.google-signup,
          &.google-signin{
            display: flex;
            align-items: center;
            padding: 0 30px;
            @media only screen and (max-width: 379px){
              padding: 0 5px;
            }
            img{
              margin-right: 8px;
              @media only screen and (max-width: 379px){
                margin-right: 4px;
              }
            }
          }
          &.facebook-sign{
            color: #475993;
          }
          &.twitter-sign{
            color: #03A9F4;
          }
        }
      }
    }
    .auth0-login{
      margin: -6px;
      display: flex;
      flex-wrap: wrap;
      a{
          display: inline-flex;
          align-items: center;
          justify-content: center;
          border-radius: 6px;
          height: 48px;
          padding: 0 30px;
          background: ${({theme:e})=>e["bg-color-light"]};
          color: ${({theme:e})=>e["text-color"]};
          font-weight: 500;
          border: 0 none;
          border-radius: 5px;
          margin: 6px;
          flex: 1;
          @media (max-width:480px){
            flex: none;
            width: 100%;
          }
      }
    }
  }
  .auth0-login{
      margin: -6px;
      display: flex;
      flex-wrap: wrap;
      a{
          display: inline-flex;
          align-items: center;
          justify-content: center;
          border-radius: 6px;
          height: 48px;
          padding: 0 30px;
          background: ${({theme:e})=>e["bg-color-light"]};
          color: ${({theme:e})=>e["text-color"]};
          font-weight: 500;
          border: 0 none;
          border-radius: 5px;
          margin: 6px;
          flex: 1;
          @media (max-width:480px){
            flex: none;
            width: 100%;
          }
      }
    }
  }
`},52338:function(e,t,n){n.r(t),n.d(t,{default:function(){return O}});var a=n(66252),i=n(3577);const o={class:"auth-notice"},r={class:"auth-contents"},l=(0,a._)("span",{class:"color-secondary"},"Admin",-1),s={class:"auth-form-action"},d=(0,a._)("p",{class:"form-divider"},[(0,a._)("span",null,"Or")],-1),c={class:"social-login"},p=["src"],u=(0,a._)("span",null,"Sign in with Google",-1),g={class:"twitter-sign",href:"#"};function m(e,t,m,f,h,x){const b=(0,a.up)("router-link"),w=(0,a.up)("sdHeading"),v=(0,a.up)("a-input"),y=(0,a.up)("a-form-item"),A=(0,a.up)("a-checkbox"),k=(0,a.up)("sdButton"),W=(0,a.up)("FacebookOutlined"),O=(0,a.up)("TwitterOutlined"),j=(0,a.up)("a-form"),S=(0,a.up)("AuthWrapper");return(0,a.wg)(),(0,a.j4)(S,null,{default:(0,a.w5)((()=>[(0,a._)("p",o,[(0,a.Uk)(" Don’t have an account? "),(0,a.Wm)(b,{to:"/auth/fb-register"},{default:(0,a.w5)((()=>[(0,a.Uk)("Sign up now")])),_:1})]),(0,a._)("div",r,[(0,a.Wm)(j,{onFinish:e.handleSubmit,model:e.formState,layout:"vertical"},{default:(0,a.w5)((()=>[(0,a.Wm)(w,{as:"h3"},{default:(0,a.w5)((()=>[(0,a.Uk)(" Sign in to "),l])),_:1}),(0,a.Wm)(y,{name:"username",label:"Username or Email Address"},{default:(0,a.w5)((()=>[(0,a.Wm)(v,{type:"email",value:e.formState.username,"onUpdate:value":t[0]||(t[0]=t=>e.formState.username=t)},null,8,["value"])])),_:1}),(0,a.Wm)(y,{name:"password",initialValue:"123456",label:"Password"},{default:(0,a.w5)((()=>[(0,a.Wm)(v,{type:"password",value:e.formState.password,"onUpdate:value":t[1]||(t[1]=t=>e.formState.password=t),placeholder:"Password"},null,8,["value"])])),_:1}),(0,a._)("div",s,[(0,a.Wm)(A,{onChange:e.onChange},{default:(0,a.w5)((()=>[(0,a.Uk)("Keep me logged in")])),_:1},8,["onChange"]),(0,a.Wm)(b,{class:"forgot-pass-link",to:"/auth/forgotPassword"},{default:(0,a.w5)((()=>[(0,a.Uk)(" Forgot password? ")])),_:1})]),(0,a.Wm)(y,null,{default:(0,a.w5)((()=>[(0,a.Wm)(k,{class:"btn-signin",htmlType:"submit",type:"primary",size:"large"},{default:(0,a.w5)((()=>[(0,a.Uk)((0,i.zw)(e.isLoading?"Loading...":"Sign In"),1)])),_:1})])),_:1}),d,(0,a._)("ul",c,[(0,a._)("li",null,[(0,a._)("a",{onClick:t[2]||(t[2]=()=>e.dispatch("firebaseAuthLoginWithGoogle")),class:"google-signup",href:"#"},[(0,a._)("img",{src:n(88004),alt:""},null,8,p),u])]),(0,a._)("li",null,[(0,a._)("a",{onClick:t[3]||(t[3]=()=>e.dispatch("firebaseAuthLoginWithFacebook")),class:"facebook-sign",href:"#"},[(0,a.Wm)(W)])]),(0,a._)("li",null,[(0,a._)("a",g,[(0,a.Wm)(O)])])])])),_:1},8,["onFinish","model"])])])),_:1})}n(57658);var f=n(35393),h=n(62348),x=n(2262),b=n(33907),w=n(6626),v=n(22201);const y={name:"SignIn",components:{FacebookOutlined:f.Z,TwitterOutlined:h.Z,AuthWrapper:w.AuthWrapper},setup(){const{state:e,dispatch:t}=(0,b.oR)(),n=(0,a.Fl)((()=>e.firebase.loading)),i=(0,a.Fl)((()=>e.firebase.uid)),o=(0,x.iH)(null),r=(0,v.tv)(),l=e=>{t("firebaseAuthLogin",{data:e})},s=()=>{r.push("/"),t("login")};(0,a.m0)((()=>{i.value&&s()}));const d=e=>{e.value=e},c=(0,x.qj)({username:"",password:""});return{isLoading:n,checked:o,handleSubmit:l,onChange:d,formState:c,dispatch:t}}};var A=y,k=n(83744);const W=(0,k.Z)(A,[["render",m]]);var O=W},88004:function(e){e.exports="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABQAAAAUCAYAAACNiR0NAAAABHNCSVQICAgIfAhkiAAAAjdJREFUOE+1lL1rU1EYxp/3NrEW2qSiFJWqRaRmEJqlOpq02iXU3m5u1q/ByVTddRGkQ1r/AU1ABKcEIh2alN5RWoVUB4suCW66JLUQSW7uI+eWXG4+SQTvdM573vt7n/fjHEGHb39meskSWQARFMGEciORF9AQEcO3uZ1o96s0G/dnL+sWsVqHdAqo4Jpg2be5nXL7NABLs9NxQG51gjTbCZYGa9XgkJHL188cYN8wYtdvVUJi5IotClWaBJKtypjQhHGPadoKqgNHggR1tfbVqtFmmLLbCg/uTn6o5Uev1IEqFU8NoWFjJ9dr+k7KZhY6iWQlcxbmp5O2XRMrPJL9aPQLsxVWM1BdWlAb8/MJVLfGX/ve5+78C+wQuAEDgqsuQNh7HS3q9NifNQBTXQMRRaWQbiePB8ckjIbOqfPFWNkAxB24Lfs/AHtMuSeFZKGhKV+tEbwwA+/eRnZu9tIUPVaOi+tmEUxIfWxStdNYMS/iN7wArfDefLbr2Oir5ZBQttyBSd62B3tl/cKXV9b5S85gk0VLQ/h7JNN2sBUMlKQAow6QLCQfD03YwED6WgiiNUQ7dGQcGuKQgYK9s8wpoehjP+8vHS/eaKgKLVlMPRlMOY9DID33DIKnvdRO+fhLMxj7dQ8ea1jN3cvUo6NR5y7XIf1CvZVTB2d+PH+z/nD8gXOXmxVNpud0TbgGyLnualmwKNFv8xudH1g3QNWVokWFHKUgKBA/iV0R5CA09iKZeLuAfwEBsO2jMmMBgQAAAABJRU5ErkJggg=="}}]);
//# sourceMappingURL=fb-login.9f42589a.js.map