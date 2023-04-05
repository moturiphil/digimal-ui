"use strict";(self["webpackChunkMassNetCampaign"]=self["webpackChunkMassNetCampaign"]||[]).push([[3076],{23214:function(e,t,o){o.r(t);var a=o(9669),n=o.n(a);const r="http://41.89.92.206/massnet/api/";class i{login(e){return n().post(r+"login",{id_no:e.id_no,password:e.password}).then((e=>(console.log(e),e.data.token&&sessionStorage.setItem("user",JSON.stringify(e.data.token)),e)))}logout(){sessionStorage.removeItem("user")}register(e){return console.log(e),n().patch(r+"set_users_password",{id_no:e.id_no,password:e.password,confirm_password:e.confirm_password,otp:e.otp,email:e.email}).then((e=>{console.log(e)}))}}t["default"]=new i},6626:function(e,t,o){o.r(t),o.d(t,{AuthWrapper:function(){return n}});var a=o(23481);const n=a.ZP.div`
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
`},97321:function(e,t,o){o.r(t),o.d(t,{default:function(){return f}});var a=o(66252);const n={class:"auth-contents"},r=(0,a._)("p",{class:"forgot-text"}," Create Password and submit email for your account ",-1),i={class:"return-text"};function s(e,t,o,s,l,d){const p=(0,a.up)("sdHeading"),m=(0,a.up)("a-input"),u=(0,a.up)("a-form-item"),c=(0,a.up)("sdButton"),g=(0,a.up)("router-link"),x=(0,a.up)("a-form"),f=(0,a.up)("AuthWrapper");return(0,a.wg)(),(0,a.j4)(f,null,{default:(0,a.w5)((()=>[(0,a._)("div",n,[(0,a.Wm)(x,{onFinish:s.handleSubmit,model:s.formState,layout:"vertical"},{default:(0,a.w5)((()=>[(0,a.Wm)(p,{as:"h3"},{default:(0,a.w5)((()=>[(0,a.Uk)("Complete Profile?")])),_:1}),r,(0,a.Wm)(u,{label:"ID NO"},{default:(0,a.w5)((()=>[(0,a.Wm)(m,{value:s.formState.id_no,"onUpdate:value":t[0]||(t[0]=e=>s.formState.id_no=e),disabled:""},null,8,["value"])])),_:1}),(0,a.Wm)(u,{label:"Email"},{default:(0,a.w5)((()=>[(0,a.Wm)(m,{value:s.formState.email,"onUpdate:value":t[1]||(t[1]=e=>s.formState.email=e),placeholder:"Enter Email"},null,8,["value"])])),_:1}),(0,a.Wm)(u,{label:"Password",name:"password"},{default:(0,a.w5)((()=>[(0,a.Wm)(m,{type:"password",value:s.formState.password,"onUpdate:value":t[2]||(t[2]=e=>s.formState.password=e),placeholder:"Enter Password"},null,8,["value"])])),_:1}),(0,a.Wm)(u,{label:"Confirm Password",name:"password"},{default:(0,a.w5)((()=>[(0,a.Wm)(m,{type:"password",value:s.formState.confirm_password,"onUpdate:value":t[3]||(t[3]=e=>s.formState.confirm_password=e),placeholder:"Confirm Password"},null,8,["value"])])),_:1}),(0,a.Wm)(u,null,{default:(0,a.w5)((()=>[(0,a.Wm)(c,{class:"btn-reset",htmlType:"submit",type:"success",size:"large"},{default:(0,a.w5)((()=>[(0,a.Uk)(" Create Account ")])),_:1})])),_:1}),(0,a._)("p",i,[(0,a.Uk)(" Return to "),(0,a.Wm)(g,{to:"/auth/login"},{default:(0,a.w5)((()=>[(0,a.Uk)("Sign In")])),_:1})])])),_:1},8,["onFinish","model"])])])),_:1})}o(57658);var l=o(2262),d=o(6626),p=o(59973),m=o(22201),u=o(23214),c={name:"Password",components:{AuthWrapper:d.AuthWrapper},setup(){const e=(0,a.Fl)((()=>p["default"].state.auth.loading)),t=(0,l.iH)(null),o=(0,m.yj)(),n=(0,m.tv)(),r=(0,a.Fl)((()=>o.params?.id_no?o.params.id_no.toString().padStart(6,"0"):"")),i=(0,l.qj)({id_no:sessionStorage.getItem("id_no")||"",otp:sessionStorage.getItem("otp")||"",email:"",password:"",confirm_password:""}),s=(0,l.iH)(!1),d=async()=>{const e=await u["default"].register({id_no:i.id_no,otp:i.otp,password:i.password,confirm_password:i.confirm_password,email:i.email});n.replace("/"),200==e.status&&(console.log(e),n.push("/auth/login"),console.log("response successfully sent...."))};return{isLoading:e,checked:t,handleSubmit:d,formState:i,isError:(0,a.Fl)((()=>p["default"].state.auth.isError)),errorMessage:(0,a.Fl)((()=>p["default"].state.auth.errorMessage)),errorDescription:(0,a.Fl)((()=>p["default"].state.auth.errorDescription)),showOtpInput:s,formattedId:r}}},g=o(83744);const x=(0,g.Z)(c,[["render",s]]);var f=x}}]);
//# sourceMappingURL=comingSoon.6151f037.js.map