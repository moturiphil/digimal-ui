"use strict";(self["webpackChunkMassNetCampaign"]=self["webpackChunkMassNetCampaign"]||[]).push([[7616],{6626:function(t,e,n){n.r(e),n.d(e,{AuthWrapper:function(){return a}});var o=n(23481);const a=o.ZP.div`
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
    color: ${({theme:t})=>t["gray-color"]};
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
          color: ${({theme:t})=>t["extra-light-color"]};
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
      color: ${({theme:t})=>t["gray-solid"]};
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
        background: ${({theme:t})=>t["border-color-light"]};
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
            box-shadow: 0 5px 15px ${({theme:t})=>t["light-color"]}10;
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
          background: ${({theme:t})=>t["bg-color-light"]};
          color: ${({theme:t})=>t["text-color"]};
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
          background: ${({theme:t})=>t["bg-color-light"]};
          color: ${({theme:t})=>t["text-color"]};
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
          background: ${({theme:t})=>t["bg-color-light"]};
          color: ${({theme:t})=>t["text-color"]};
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
`},83625:function(t,e,n){n.r(e),n.d(e,{default:function(){return w}});var o=n(66252),a=n(3577);const i={class:"auth-contents"},r=(0,o._)("p",{class:"forgot-text"}," Enter your ID No you used to register via USSD and we’ll send you instructions to set your password and email. ",-1),s={class:"return-text"};function l(t,e,n,l,p,d){const g=(0,o.up)("sdHeading"),m=(0,o.up)("a-input"),u=(0,o.up)("a-form-item"),x=(0,o.up)("sdButton"),c=(0,o.up)("router-link"),h=(0,o.up)("a-form"),f=(0,o.up)("AuthWrapper");return(0,o.wg)(),(0,o.j4)(f,null,{default:(0,o.w5)((()=>[(0,o._)("div",i,[(0,o.Wm)(h,{onFinish:l.handleSubmit,model:l.formState,layout:"vertical"},{default:(0,o.w5)((()=>[(0,o.Wm)(g,{as:"h3"},{default:(0,o.w5)((()=>[(0,o.Uk)("Registered as New User?")])),_:1}),r,(0,o.Wm)(u,{label:"ID No",name:"id_no"},{default:(0,o.w5)((()=>[(0,o.Wm)(m,{type:"number",value:l.formState.id_no,"onUpdate:value":e[0]||(e[0]=t=>l.formState.id_no=t),placeholder:"34567890"},null,8,["value"])])),_:1}),l.showOtpInput?((0,o.wg)(),(0,o.j4)(u,{key:0,label:"OTP",name:"otp"},{default:(0,o.w5)((()=>[(0,o.Wm)(m,{type:"text",value:l.formState.otp,"onUpdate:value":e[1]||(e[1]=t=>l.formState.otp=t),placeholder:"Enter OTP"},null,8,["value"])])),_:1})):(0,o.kq)("",!0),(0,o.Wm)(u,null,{default:(0,o.w5)((()=>[(0,o.Wm)(x,{class:"btn-reset",htmlType:"submit",type:"success",size:"large"},{default:(0,o.w5)((()=>[(0,o.Uk)((0,a.zw)(l.showOtpInput?"Verify OTP":"Send OTP"),1)])),_:1})])),_:1}),(0,o._)("p",s,[(0,o.Uk)(" Return to "),(0,o.Wm)(c,{to:"/auth/login"},{default:(0,o.w5)((()=>[(0,o.Uk)("Sign In")])),_:1})])])),_:1},8,["onFinish","model"])])])),_:1})}n(57658);var p=n(2262),d=n(6626),g=n(59973),m=n(9669),u=n.n(m),x=n(22201),c={name:"Register",components:{AuthWrapper:d.AuthWrapper},setup(){const t=(0,o.Fl)((()=>g["default"].state.auth.loading)),e=(0,p.iH)(null),n="http://41.89.92.206/massnet/api/generate_otp",a=(0,x.tv)(),i=(0,p.qj)({id_no:"",otp:""}),r=(0,p.iH)(!1),s=async()=>{if(r.value){const t=sessionStorage.getItem("otp"),e=i.otp;t===e?a.push("/auth/set-password"):console.log("OTP does not match")}else{const t={id_no:i.id_no};console.log(sessionStorage.getItem("id_no"));const e=await u().post(n,t);if(200!==e.status)throw new Error("Network response was not ok.");sessionStorage.removeItem("id_no",t.id_no),sessionStorage.removeItem("otp",e.data.OTP),sessionStorage.setItem("otp",e.data.OTP),sessionStorage.setItem("id_no",t.id_no),console.log(e.data),r.value=!0}};return{isLoading:t,checked:e,handleSubmit:s,formState:i,isError:(0,o.Fl)((()=>g["default"].state.auth.isError)),errorMessage:(0,o.Fl)((()=>g["default"].state.auth.errorMessage)),errorDescription:(0,o.Fl)((()=>g["default"].state.auth.errorDescription)),showOtpInput:r}}},h=n(83744);const f=(0,h.Z)(c,[["render",l]]);var w=f}}]);
//# sourceMappingURL=forgotPassword.84c5b3c5.js.map