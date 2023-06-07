"use strict";(self["webpackChunkMassNetCampaign"]=self["webpackChunkMassNetCampaign"]||[]).push([[76],{23214:function(e,t,o){var n=o(9669),a=o.n(n);const i="http://41.89.92.206/massnet/api/";class r{login(e){return a().post(i+"login",{id_no:e.id_no,password:e.password}).then((e=>(console.log(e),e.data.token&&sessionStorage.setItem("user",JSON.stringify(e.data.token)),e)))}logout(){sessionStorage.removeItem("user")}register(e){return console.log(e),a().patch(i+"set_users_password",{id_no:e.id_no,password:e.password,confirm_password:e.confirm_password,otp:e.otp,email:e.email}).then((e=>{console.log(e)}))}getUser(){const e=sessionStorage.getItem("user");return e?JSON.parse(e):null}hasPermission(e){const t=this.getUser();return t&&t.permissions&&t.permissions.includes(e)}}t["Z"]=new r},6626:function(e,t,o){o.d(t,{c:function(){return a}});var n=o(23481);const a=n.ZP.div`
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
`},97321:function(e,t,o){o.r(t),o.d(t,{default:function(){return h}});var n=o(66252);const a={class:"auth-contents"},i=(0,n._)("p",{class:"forgot-text"}," Create Password and submit email for your account ",-1),r={class:"return-text"};function s(e,t,o,s,l,p){const d=(0,n.up)("sdHeading"),m=(0,n.up)("a-input"),c=(0,n.up)("a-form-item"),g=(0,n.up)("sdButton"),u=(0,n.up)("router-link"),x=(0,n.up)("a-form"),h=(0,n.up)("AuthWrapper");return(0,n.wg)(),(0,n.j4)(h,null,{default:(0,n.w5)((()=>[(0,n._)("div",a,[(0,n.Wm)(x,{onFinish:s.handleSubmit,model:s.formState,layout:"vertical"},{default:(0,n.w5)((()=>[(0,n.Wm)(d,{as:"h3"},{default:(0,n.w5)((()=>[(0,n.Uk)("Complete Profile?")])),_:1}),i,(0,n.Wm)(c,{label:"ID NO"},{default:(0,n.w5)((()=>[(0,n.Wm)(m,{value:s.formState.id_no,"onUpdate:value":t[0]||(t[0]=e=>s.formState.id_no=e),disabled:""},null,8,["value"])])),_:1}),(0,n.Wm)(c,{label:"Email"},{default:(0,n.w5)((()=>[(0,n.Wm)(m,{value:s.formState.email,"onUpdate:value":t[1]||(t[1]=e=>s.formState.email=e),placeholder:"Enter Email"},null,8,["value"])])),_:1}),(0,n.Wm)(c,{label:"Password",name:"password"},{default:(0,n.w5)((()=>[(0,n.Wm)(m,{type:"password",value:s.formState.password,"onUpdate:value":t[2]||(t[2]=e=>s.formState.password=e),placeholder:"Enter Password"},null,8,["value"])])),_:1}),(0,n.Wm)(c,{label:"Confirm Password",name:"password"},{default:(0,n.w5)((()=>[(0,n.Wm)(m,{type:"password",value:s.formState.confirm_password,"onUpdate:value":t[3]||(t[3]=e=>s.formState.confirm_password=e),placeholder:"Confirm Password"},null,8,["value"])])),_:1}),(0,n.Wm)(c,null,{default:(0,n.w5)((()=>[(0,n.Wm)(g,{class:"btn-reset",htmlType:"submit",type:"success",size:"large"},{default:(0,n.w5)((()=>[(0,n.Uk)(" Create Account ")])),_:1})])),_:1}),(0,n._)("p",r,[(0,n.Uk)(" Return to "),(0,n.Wm)(u,{to:"/auth/login"},{default:(0,n.w5)((()=>[(0,n.Uk)("Sign In")])),_:1})])])),_:1},8,["onFinish","model"])])])),_:1})}o(57658);var l=o(2262),p=o(6626),d=o(52773),m=o(22201),c=o(23214),g={name:"Password",components:{AuthWrapper:p.c},setup(){const e=(0,n.Fl)((()=>d.Z.state.auth.loading)),t=(0,l.iH)(null),o=(0,m.yj)(),a=(0,m.tv)(),i=(0,n.Fl)((()=>o.params?.id_no?o.params.id_no.toString().padStart(6,"0"):"")),r=(0,l.qj)({id_no:sessionStorage.getItem("id_no")||"",otp:sessionStorage.getItem("otp")||"",email:"",password:"",confirm_password:""}),s=(0,l.iH)(!1),p=async()=>{const e=await c.Z.register({id_no:r.id_no,otp:r.otp,password:r.password,confirm_password:r.confirm_password,email:r.email});a.replace("/"),200==e.status&&(console.log(e),a.push("/auth/login"),console.log("response successfully sent...."))};return{isLoading:e,checked:t,handleSubmit:p,formState:r,isError:(0,n.Fl)((()=>d.Z.state.auth.isError)),errorMessage:(0,n.Fl)((()=>d.Z.state.auth.errorMessage)),errorDescription:(0,n.Fl)((()=>d.Z.state.auth.errorDescription)),showOtpInput:s,formattedId:i}}},u=o(83744);const x=(0,u.Z)(g,[["render",s]]);var h=x}}]);
//# sourceMappingURL=comingSoon.a1a64a20.js.map