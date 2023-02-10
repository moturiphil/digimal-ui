"use strict";(self["webpackChunkMassNetCampaign"]=self["webpackChunkMassNetCampaign"]||[]).push([[6911],{72379:function(e,t,a){a.r(t),a.d(t,{RecordFormWrapper:function(){return n},RecordViewWrapper:function(){return l}});var i=a(23481);const l=i.ZP.div`
    .btn-add_new{
        ${({theme:e})=>e.rtl?"margin-right":"margin-left"}: 10px;
        a{
            display: flex;
            align-items: center;
            svg,
            img,
            i{
                ${({theme:e})=>e.rtl?"margin-left":"margin-right"}: 6px;
            }
        }
    }
    .search-box{
        position: relative;
        box-shadow: 0 5px 5px rgba(#9299B8,.3);
        .search-icon{
            position: absolute;
            ${({theme:e})=>e.rtl?"right":"left"}: 18px;
            top: 50%;
            transform: translateY(-50%);
            svg,
            img{
                margin-top: 6px;
                min-width: 16px;
                color: #9299B8;
            }
        }
        input{
            border: 0 none;
            height: 40px;
            min-width: 280px;
            padding: ${({theme:e})=>e.rtl?"0 45px 0 20px":"0 20px 0 45px"};
            border-radius: 6px;
            &::placeholder{
                color: #ADB4D2;
            }
            &:focus{
                outline: none;
            }
        }
    }
`,n=i.ZP.div`
    .pro-image{
        position: relative;
        margin-bottom: 30px;
        .ant-spin.ant-spin-spinning{
            position: absolute;
            top: 0;
            ${({theme:e})=>e.rtl?"right":"left"}: 0;
            width: 120px;
            height: 120px;
            background: #ffffff90;
            display: flex;
            align-items: center;
            justify-content: center;
            text-align: center;
            z-index: 10;
            &:after{
                position: absolute;
                ${({theme:e})=>e.rtl?"right":"left"}: 0;
                top: 0;
                width: 100%;
                height: 100%;
                border-radius: 50%;
                background-color: #272B4120;
                content: '';
                z-index: -1;
            }
            .ant-spin-dot {
                position: relative;
                z-index: 10;
            }
        }
        img{
            max-width: 120px;
            border-radius: 50%;
        }
        .ant-spin{
            height: 120px;
            width: 120px;
            display: flex;
            align-items: center;
        }
        .ant-upload-select{
            position: absolute;
            ${({theme:e})=>e.rtl?"right":"left"}: 80px;
            bottom: -5px;
            height: 40px;
            width: 40px;
            background: #fff;
            display: inline-flex;
            align-items: center;
            justify-content: center;
            border-radius: 50%;
            z-index: 222;
            span{
                display: inline-flex;
                height: 32px;
                align-items: center;
                justify-content: center;
                border-radius: 50%;
                width: 32px;
                background: #5F63F2;
            }
        }
        .upload-btn{
            display: flex;
            align-items: center;
            justify-content: center;
            color: #fff;
        }
        .profile-info{
            ${({theme:e})=>e.rtl?"margin-right":"margin-left"}: 20px;
            h1{
                font-size: 15px;
                font-weight: 500;
                margin-bottom: 0;
            }
        }
        .ant-upload-list-item{
            margin-top: 0;
            &:hover{
                .ant-upload-list-item-info{
                    background-color: transparent;
                }
            }
            .ant-upload-list-item-info{
                >span{
                    display: flex;
                    align-items: center;
                    ${({theme:e})=>e.rtl?"padding-right":"padding-left"}: 14px;
                    ${({theme:e})=>e.rtl?"padding-left":"padding-right"}: 10px;
                }
                .ant-upload-list-item-card-actions {
                    /* // top: -8px; */
                }
            }
        }
    }

    .record-spin{
        height: 100vh;
        display: flex;
        align-items: center;
        justify-content: center;
    }
`},83775:function(e,t,a){a.r(t),a.d(t,{default:function(){return y}});var i=a(66252),l=a(3577);const n={class:"pro-image align-center-v"},r=["src"],o={class:"upload-btn",to:"#"},u={class:"profile-info"},d={key:0,class:"isUploadSpain"},m={class:"record-form-actions text-right"};function s(e,t,s,p,f,c){const g=(0,i.up)("router-link"),w=(0,i.up)("sdButton"),h=(0,i.up)("sdPageHeader"),v=(0,i.up)("sdFeatherIcons"),x=(0,i.up)("a-upload"),A=(0,i.up)("sdHeading"),W=(0,i.up)("a-spin"),b=(0,i.up)("a-input"),y=(0,i.up)("a-form-item"),k=(0,i.up)("a-select-option"),B=(0,i.up)("a-select"),F=(0,i.up)("a-date-picker"),S=(0,i.up)("a-radio"),U=(0,i.up)("a-radio-group"),_=(0,i.up)("a-form"),P=(0,i.up)("BasicFormWrapper"),C=(0,i.up)("a-col"),D=(0,i.up)("a-row"),j=(0,i.up)("sdCards"),X=(0,i.up)("RecordFormWrapper"),L=(0,i.up)("Main");return(0,i.wg)(),(0,i.iD)(i.HY,null,[(0,i.Wm)(h,{title:"Add New"},{default:(0,i.w5)((()=>[(0,i.Wm)(w,{class:"btn-add_new",size:"default",key:"1",type:"primary"},{default:(0,i.w5)((()=>[(0,i.Wm)(g,{to:"/crud/fireStore-view"},{default:(0,i.w5)((()=>[(0,i.Uk)("View All")])),_:1})])),_:1})])),_:1}),(0,i.Wm)(L,null,{default:(0,i.w5)((()=>[(0,i.Wm)(D,{gutter:15},{default:(0,i.w5)((()=>[(0,i.Wm)(C,{xs:24},{default:(0,i.w5)((()=>[(0,i.Wm)(X,null,{default:(0,i.w5)((()=>[(0,i.Wm)(j,{headless:""},{default:(0,i.w5)((()=>[(0,i.Wm)(D,{justify:"center"},{default:(0,i.w5)((()=>[(0,i.Wm)(C,{xl:10,md:16,xs:24},{default:(0,i.w5)((()=>[(0,i.Wm)(P,null,{default:(0,i.w5)((()=>[(0,i.Wm)(_,{class:"add-record-form",style:{width:"100%"},layout:"vertical",name:"addnew",model:e.formState,onFinish:e.handleSubmit},{default:(0,i.w5)((()=>[(0,i._)("figure",n,[(0,i._)("img",{src:null===e.url?a(39429):e.url,alt:""},null,8,r),(0,i._)("figcaption",null,[(0,i.Wm)(x,(0,l.vs)((0,i.F4)(e.props)),{default:(0,i.w5)((()=>[(0,i._)("a",o,[(0,i.Wm)(v,{type:"camera",size:"16"})])])),_:1},16),(0,i._)("div",u,[(0,i.Wm)(A,{as:"h4"},{default:(0,i.w5)((()=>[(0,i.Uk)("Profile Photo")])),_:1})]),e.isFileLoading?((0,i.wg)(),(0,i.iD)("div",d,[(0,i.Wm)(W)])):(0,i.kq)("",!0)])]),(0,i.Wm)(y,{name:"name",label:"Name"},{default:(0,i.w5)((()=>[(0,i.Wm)(b,{value:e.formState.name,"onUpdate:value":t[0]||(t[0]=t=>e.formState.name=t),placeholder:"Input Name"},null,8,["value"])])),_:1}),(0,i.Wm)(y,{name:"email",label:"Email"},{default:(0,i.w5)((()=>[(0,i.Wm)(b,{value:e.formState.email,"onUpdate:value":t[1]||(t[1]=t=>e.formState.email=t),type:"email",placeholder:"example@gmail.com"},null,8,["value"])])),_:1}),(0,i.Wm)(y,{name:"country",label:"Country"},{default:(0,i.w5)((()=>[(0,i.Wm)(B,{value:e.formState.country,"onUpdate:value":t[2]||(t[2]=t=>e.formState.country=t),style:{width:"100%"}},{default:(0,i.w5)((()=>[(0,i.Wm)(k,{value:""},{default:(0,i.w5)((()=>[(0,i.Uk)("Please Select")])),_:1}),(0,i.Wm)(k,{value:"bangladesh"},{default:(0,i.w5)((()=>[(0,i.Uk)("Bangladesh")])),_:1}),(0,i.Wm)(k,{value:"india"},{default:(0,i.w5)((()=>[(0,i.Uk)("India")])),_:1}),(0,i.Wm)(k,{value:"pakistan"},{default:(0,i.w5)((()=>[(0,i.Uk)("Pakistan")])),_:1}),(0,i.Wm)(k,{value:"srilanka"},{default:(0,i.w5)((()=>[(0,i.Uk)("Srilanka")])),_:1})])),_:1},8,["value"])])),_:1}),(0,i.Wm)(y,{name:"city",label:"City"},{default:(0,i.w5)((()=>[(0,i.Wm)(B,{value:e.formState.city,"onUpdate:value":t[3]||(t[3]=t=>e.formState.city=t),style:{width:"100%"}},{default:(0,i.w5)((()=>[(0,i.Wm)(k,{value:""},{default:(0,i.w5)((()=>[(0,i.Uk)("Please Select")])),_:1}),(0,i.Wm)(k,{value:"dhaka"},{default:(0,i.w5)((()=>[(0,i.Uk)("Dhaka")])),_:1}),(0,i.Wm)(k,{value:"mymensingh"},{default:(0,i.w5)((()=>[(0,i.Uk)("Mymensingh")])),_:1}),(0,i.Wm)(k,{value:"khulna"},{default:(0,i.w5)((()=>[(0,i.Uk)("Khulna")])),_:1}),(0,i.Wm)(k,{value:"barisal"},{default:(0,i.w5)((()=>[(0,i.Uk)("Barisal")])),_:1})])),_:1},8,["value"])])),_:1}),(0,i.Wm)(y,{name:"company",label:"Company"},{default:(0,i.w5)((()=>[(0,i.Wm)(b,{value:e.formState.company,"onUpdate:value":t[4]||(t[4]=t=>e.formState.company=t),placeholder:"Company Name"},null,8,["value"])])),_:1}),(0,i.Wm)(y,{name:"position",label:"Position"},{default:(0,i.w5)((()=>[(0,i.Wm)(b,{value:e.formState.position,"onUpdate:value":t[5]||(t[5]=t=>e.formState.position=t),placeholder:"Position"},null,8,["value"])])),_:1}),(0,i.Wm)(y,{label:"Joining Date"},{default:(0,i.w5)((()=>[(0,i.Wm)(F,{style:{width:"100%"},value:e.join,"onUpdate:value":t[6]||(t[6]=t=>e.join=t),format:e.dateFormat},null,8,["value","format"])])),_:1}),(0,i.Wm)(y,{name:"status",label:"Status"},{default:(0,i.w5)((()=>[(0,i.Wm)(U,{value:e.formState.status,"onUpdate:value":t[7]||(t[7]=t=>e.formState.status=t)},{default:(0,i.w5)((()=>[(0,i.Wm)(S,{value:"active"},{default:(0,i.w5)((()=>[(0,i.Uk)("Active")])),_:1}),(0,i.Wm)(S,{value:"deactivated"},{default:(0,i.w5)((()=>[(0,i.Uk)("Deactivated")])),_:1}),(0,i.Wm)(S,{value:"blocked"},{default:(0,i.w5)((()=>[(0,i.Uk)("Blocked")])),_:1})])),_:1},8,["value"])])),_:1}),(0,i._)("div",m,[(0,i.Wm)(w,{size:"default",htmlType:"Save",type:"primary"},{default:(0,i.w5)((()=>[(0,i.Uk)((0,l.zw)(e.isLoading?"Loading...":"Submit"),1)])),_:1})])])),_:1},8,["model","onFinish"])])),_:1})])),_:1})])),_:1})])),_:1})])),_:1})])),_:1})])),_:1})])),_:1})],64)}var p=a(72379),f=a(72984),c=a(33907),g=a(2262),w=a(30381),h=a.n(w);const v="YYYY/MM/DD",x={name:"AddNew",components:{RecordFormWrapper:p.RecordFormWrapper,Main:f.Main,BasicFormWrapper:f.BasicFormWrapper},setup(){const{state:e,dispatch:t}=(0,c.oR)(),a=(0,i.Fl)((()=>e.fireStore.loading)),l=(0,i.Fl)((()=>e.fireStore.url)),n=(0,i.Fl)((()=>e.fireStore.fileLoading)),r=(0,g.iH)(""),o=e=>{t("fireStoreCrudSubmitData",{...e,image:l.value,join:h()(r.value).format("YYYY/MM/DD"),id:(new Date).getTime()}),t("fireStoreFileClear")},u={name:"file",action:"https://www.mocky.io/v2/5cc8019d300000980a055e76",multiple:!1,showUploadList:!1,headers:{authorization:"authorization-text"},onChange(e){"uploading"!==e.file.status&&t("fireStoreFileUploader",e.file.originFileObj)}},d=(0,g.qj)({name:"",email:"",country:"",city:"",company:"",position:"",status:""});return{isLoading:a,url:l,isFileLoading:n,handleSubmit:o,props:u,dateFormat:v,formState:d,join:r}}};var A=x,W=a(83744);const b=(0,W.Z)(A,[["render",s]]);var y=b},39429:function(e){e.exports="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAHgAAAB4CAYAAAA5ZDbSAAAElklEQVR4Xu2Xy0okQRBFc0TwuVFx4VtEFBFxI7jzr/0Bdy5FVBR8ICqIqBsVBXGGSIgmpqa6C63ulrme2khblVl578kbkfVre3v7d+KSdeAXgGXZZmEA1uYLYHG+AAawugPi+ujBABZ3QFweCQawuAPi8kgwgMUdEJdHggEs7oC4PBIMYHEHxOWRYACLOyAujwQDWNwBcXkkGMDiDojLI8EAFndAXB4JBrC4A+LySDCAxR0Ql0eCASzugLg8EgxgcQfE5ZFgAIs7IC6PBANY3AFxeSQYwOIOiMsjwQAWd0BcHgkGsLgD4vJIMIDFHRCXR4IBLO6AuDwSDGBxB8TlkWAAizsgLo8EA1jcAXF5JBjA4g6IyyPBABZ3QFxexxO8tbWVLdzZ2cl/x8bG0vr6eurv78+/7+/v0+7u7j/3Pj4+0tnZWTo5OamFwN93d3eX9vf381xTU1NpZWUlXV5els6/tLSU5ufn08XFReP+2tpampmZyePf39/TwcFBur6+zr/jvaenp4bWWgtv0+COAXbRJjgCNvN6e3vT4eFhA7abb5vh7e0tA7fx4+PjaW9vL2+COpe9c3Z2Nh0dHWUo8T1xXt8MPT09yTbY1dVVA/DGxkY6Pz/Pa4lrszE+9+vra968cTPVWXc7xnYMsC/OzBgZGWm6q83sx8fH9PDwkJaXl9Px8XGGYMbZ2Jubm9optrU4VHvX5ORkTnOzjVP1btswPsfi4mKW6lWoSm87oH1mjm8FHI20RReNd/iDg4PJUjUwMJBLeyyRMY3FpEYjrCzbBrKrKmFVgCNEX6OX/wh/dXU1vby8pNHR0Vy1LOFWkWLqW1WUz4Bs9uy3At7c3Ex9fX053dEYT1YEbFXAe3Ic5+CsfM7NzbVMfBzXyrxWgIv9uwqwbUjv13Ez2lrssg3QqsLVhfwtgL3XPT8/N0pbFeBYBh2ql3Pv9/HAVjTG5p+ens6V4Pb2tnHgKjOwGWB7z8TExF8HrCrA1hLK0m3vtX5tyY4HtrpAi+O7DriZeUVo8Tnb4a0AG7yFhYXcy70Xlh2erDTbIe4rPbhZb/UklvXgVvBtM9r9mPB2w7X5ug7YjLKeWgai2SnaDjJDQ0ONE/VnS3QRTrNTtBtc3IT22/rp6elp49PIn419v3iKLn4i/ogSbXDMsHj5t6Ol2Iy0shUPUjbGD1hWYv2w4mXOS31ZCS37pi37XzHx8QQf1+XPxe/0qCm2CQc8PDych7nOuE7fFLFdtTPJHU9wOxZbLIPtmLMbcxRLdDfe2fUe3A5RAP66iyT4695VjiTBlRbxQF0H/osE1xX5k8cDWJw+gAEs7oC4PBIMYHEHxOWRYACLOyAujwQDWNwBcXkkGMDiDojLI8EAFndAXB4JBrC4A+LySDCAxR0Ql0eCASzugLg8EgxgcQfE5ZFgAIs7IC6PBANY3AFxeSQYwOIOiMsjwQAWd0BcHgkGsLgD4vJIMIDFHRCXR4IBLO6AuDwSDGBxB8TlkWAAizsgLo8EA1jcAXF5JBjA4g6IyyPBABZ3QFweCQawuAPi8kgwgMUdEJdHgsUB/wHERxbFRshvpQAAAABJRU5ErkJggg=="}}]);
//# sourceMappingURL=fireStore-add.236fb23e.js.map