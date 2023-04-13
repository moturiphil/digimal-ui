"use strict";(self["webpackChunkMassNetCampaign"]=self["webpackChunkMassNetCampaign"]||[]).push([[4535],{23214:function(e,t,n){n.r(t);var o=n(9669),a=n.n(o);const i="http://41.89.92.206/massnet/api/";class r{login(e){return a().post(i+"login",{id_no:e.id_no,password:e.password}).then((e=>(console.log(e),e.data.token&&sessionStorage.setItem("user",JSON.stringify(e.data.token)),e)))}logout(){sessionStorage.removeItem("user")}register(e){return console.log(e),a().patch(i+"set_users_password",{id_no:e.id_no,password:e.password,confirm_password:e.confirm_password,otp:e.otp,email:e.email}).then((e=>{console.log(e)}))}}t["default"]=new r},6626:function(e,t,n){n.r(t),n.d(t,{AuthWrapper:function(){return a}});var o=n(23481);const a=o.ZP.div`
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
`},84587:function(e,t,n){n.r(t),n.d(t,{default:function(){return b}});var o=n(66252);const a=(0,o._)("p",{class:"auth-notice"},"Don’t have an account? Contact Admin",-1),i={class:"auth-contents"},r=(0,o._)("span",{class:"color-success"},"Campaign Dashboard",-1),s={class:"auth-form-action"},l=(0,o._)("p",{class:"form-divider"},null,-1);function d(e,t,n,d,p,c){const g=(0,o.up)("sdHeading"),m=(0,o.up)("a-input"),u=(0,o.up)("a-form-item"),h=(0,o.up)("a-checkbox"),x=(0,o.up)("router-link"),f=(0,o.up)("sdButton"),w=(0,o.up)("a-form"),b=(0,o.up)("a-notification"),y=(0,o.up)("AuthWrapper");return(0,o.wg)(),(0,o.j4)(y,null,{default:(0,o.w5)((()=>[a,(0,o._)("div",i,[(0,o.Wm)(w,{onFinish:d.handleSubmit,model:d.formState,layout:"vertical"},{default:(0,o.w5)((()=>[(0,o.Wm)(g,{as:"h3"},{default:(0,o.w5)((()=>[(0,o.Uk)(" Sign in to "),r])),_:1}),(0,o.Wm)(u,{name:"id_no",label:"National ID No"},{default:(0,o.w5)((()=>[(0,o.Wm)(m,{type:"number",value:d.formState.id_no,"onUpdate:value":t[0]||(t[0]=e=>d.formState.id_no=e),placeholder:"Enter ID No"},null,8,["value"])])),_:1}),(0,o.Wm)(u,{name:"password",initialValue:"",label:"Password"},{default:(0,o.w5)((()=>[(0,o.Wm)(m,{type:"password",value:d.formState.password,"onUpdate:value":t[1]||(t[1]=e=>d.formState.password=e),placeholder:"Password"},null,8,["value"])])),_:1}),(0,o._)("div",s,[(0,o.Wm)(h,{modelValue:d.checked,"onUpdate:modelValue":t[2]||(t[2]=e=>d.checked=e),onChange:e.onChange},{default:(0,o.w5)((()=>[(0,o.Uk)("Keep me logged in")])),_:1},8,["modelValue","onChange"]),(0,o.Wm)(x,{class:"forgot-pass-link",to:"/auth/register"},{default:(0,o.w5)((()=>[(0,o.Uk)(" New User? ")])),_:1})]),(0,o.Wm)(u,null,{default:(0,o.w5)((()=>[(0,o.Wm)(f,{class:"btn-signin",htmlType:"submit",loading:d.isLoading,type:"success",size:"large"},{default:(0,o.w5)((()=>[(0,o.Uk)(" Sign In ")])),_:1},8,["loading"])])),_:1}),l])),_:1},8,["onFinish","model"]),d.isError?((0,o.wg)(),(0,o.j4)(b,{key:0,message:d.errorMessage,type:"error",description:d.errorDescription,showIcon:!0,duration:0,style:{width:"100%"}},null,8,["message","description"])):(0,o.kq)("",!0)])])),_:1})}n(11611);var p=n(70473),c=(n(57658),n(2262)),g=n(23214),m=n(22201),u=n(6626),h=n(59973),x={name:"SignIn",components:{AuthWrapper:u.AuthWrapper},setup(){const e=(0,o.Fl)((()=>h["default"].state.auth.loading)),t=(0,c.iH)(null),n=(0,m.tv)(),a=(0,c.qj)({id_no:"",password:""}),i=async()=>{const e=await g["default"].login({id_no:a.id_no,password:a.password});if(console.log(e.status,e.data),200==e.status){console.log(e.status),console.log("response successful.................");try{h["default"].commit("auth/setUser",e.data.user),n.push({path:"/"}),p.Z.success({message:"Login Successful",description:"Welcome to Campaign Dashboard"})}catch(t){console.log(t)}}else 401==e.status&&(console.log("other error responses"),p.Z.error({message:"Login Failed",description:"Invalid Credentials"}))};return{isLoading:e,checked:t,handleSubmit:i,formState:a,isError:(0,o.Fl)((()=>h["default"].state.auth.isError)),errorMessage:(0,o.Fl)((()=>h["default"].state.auth.errorMessage)),errorDescription:(0,o.Fl)((()=>h["default"].state.auth.errorDescription))}}},f=n(83744);const w=(0,f.Z)(x,[["render",d]]);var b=w}}]);
//# sourceMappingURL=login.fda76714.js.map