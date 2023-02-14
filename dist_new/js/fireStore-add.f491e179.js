"use strict";(self["webpackChunkMassNetCampaign"]=self["webpackChunkMassNetCampaign"]||[]).push([[911],{40008:function(e,t,a){function n(){let e=JSON.parse(localStorage.getItem("user"));return console.log(e),e?{Accept:"application/json",Authorization:"Bearer "+e}:{}}a.r(t),a.d(t,{default:function(){return n}})},10963:function(e,t,a){a.r(t),a.d(t,{RecordFormWrapper:function(){return i},RecordViewWrapper:function(){return r}});var n=a(23481);const r=n.ZP.div`
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
`,i=n.ZP.div`
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
            min-width: 120px;
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
            svg{
                color: #fff;
            }
        }
        .upload-btn{
            display: flex;
            align-items: center;
            justify-content: center;
            color: #fff;
        }
        .info{
            ${({theme:e})=>e.rtl?"margin-right":"margin-left"}: 20px;
            background: none;
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
`},74169:function(e,t,a){a.r(t),a.d(t,{default:function(){return v}});var n=a(66252),r=a(3577);const i={class:"record-form-actions text-right"};function o(e,t,a,o,l,d){const u=(0,n.up)("router-link"),s=(0,n.up)("sdButton"),p=(0,n.up)("sdPageHeader"),m=(0,n.up)("a-input"),c=(0,n.up)("a-form-item"),f=(0,n.up)("a-date-picker"),g=(0,n.up)("a-form"),h=(0,n.up)("BasicFormWrapper"),v=(0,n.up)("a-col"),x=(0,n.up)("a-row"),w=(0,n.up)("sdCards"),b=(0,n.up)("RecordFormWrapper"),_=(0,n.up)("Main");return(0,n.wg)(),(0,n.iD)(n.HY,null,[(0,n.Wm)(p,{title:"Start Event"},{default:(0,n.w5)((()=>[(0,n.Wm)(s,{class:"btn-add_new",size:"default",key:"1",type:"sucess"},{default:(0,n.w5)((()=>[(0,n.Wm)(u,{to:"/crud/axios-view"},{default:(0,n.w5)((()=>[(0,n.Uk)("View All")])),_:1})])),_:1})])),_:1}),(0,n.Wm)(_,null,{default:(0,n.w5)((()=>[(0,n.Wm)(x,{gutter:15},{default:(0,n.w5)((()=>[(0,n.Wm)(v,{xs:24},{default:(0,n.w5)((()=>[(0,n.Wm)(b,null,{default:(0,n.w5)((()=>[(0,n.Wm)(w,{headless:""},{default:(0,n.w5)((()=>[(0,n.Wm)(x,{justify:"center"},{default:(0,n.w5)((()=>[(0,n.Wm)(v,{xl:10,md:16,xs:24},{default:(0,n.w5)((()=>[(0,n.Wm)(h,null,{default:(0,n.w5)((()=>[(0,n.Wm)(g,{class:"add-record-form",style:{width:"100%"},layout:"vertical",name:"addnew",model:e.formState,onFinish:e.handleSubmit},{default:(0,n.w5)((()=>[(0,n.Wm)(c,{name:"name",label:"Event Name"},{default:(0,n.w5)((()=>[(0,n.Wm)(m,{value:e.formState.name,"onUpdate:value":t[0]||(t[0]=t=>e.formState.name=t),placeholder:"Input Event Name"},null,8,["value"])])),_:1}),(0,n.Wm)(c,{name:"event_code",label:"Event Code"},{default:(0,n.w5)((()=>[(0,n.Wm)(m,{value:e.formState.event_code,"onUpdate:value":t[1]||(t[1]=t=>e.formState.event_code=t),placeholder:"Input Event Code"},null,8,["value"])])),_:1}),(0,n.Wm)(c,{name:"startDate",label:"Event Start Date"},{default:(0,n.w5)((()=>[(0,n.Wm)(f,{style:{width:"100%"},value:e.formState.startDate,"onUpdate:value":t[2]||(t[2]=t=>e.formState.startDate=t),format:e.dateFormat},null,8,["value","format"])])),_:1}),(0,n.Wm)(c,{name:"endDate",label:"Event End Date"},{default:(0,n.w5)((()=>[(0,n.Wm)(f,{style:{width:"100%"},value:e.formState.endDate,"onUpdate:value":t[3]||(t[3]=t=>e.formState.endDate=t),format:e.dateFormat},null,8,["value","format"])])),_:1}),(0,n.Wm)(c,{name:"venue",label:"Event Venue"},{default:(0,n.w5)((()=>[(0,n.Wm)(m,{value:e.formState.venue,"onUpdate:value":t[4]||(t[4]=t=>e.formState.venue=t),placeholder:"Input Event Venue"},null,8,["value"])])),_:1}),(0,n._)("div",i,[(0,n.Wm)(s,{size:"default",htmlType:"Save",type:"success"},{default:(0,n.w5)((()=>[(0,n.Uk)((0,r.zw)(e.isLoading?"Loading...":"Submit"),1)])),_:1})])])),_:1},8,["model","onFinish"])])),_:1})])),_:1})])),_:1})])),_:1})])),_:1})])),_:1})])),_:1})])),_:1})],64)}var l=a(10963),d=a(72984),u=a(33907),s=a(2262),p=a(40008);const m="YYYY-MM-DD",c=(0,n.aZ)({name:"AddNew",components:{RecordFormWrapper:l.RecordFormWrapper,Main:d.Main,BasicFormWrapper:d.BasicFormWrapper},setup(){const{state:e}=(0,u.oR)(),t=(0,n.Fl)((()=>e.crud.loading)),a=(0,n.Fl)((()=>e.crud.url)),r=(0,n.Fl)((()=>e.crud.fileLoading)),i=(0,s.iH)(""),o="http://41.89.92.206/massnet/api/event/create",l=e=>{e={name:e.name,start_date:new Date(e.startDate.$d).toISOString().substr(0,10),end_date:new Date(e.endDate.$d).toISOString().substr(0,10),event_code:e.event_code,user_id:1,campaign_id:1,venue:e.venue,location_id:1},console.log(e),fetch(o,{method:"POST",headers:{"Content-Type":"application/json",...(0,p["default"])()},body:JSON.stringify(e)}).then((e=>e.json())).then((e=>{console.log(e)})).catch((e=>{console.error("Error:",e)}))},d=(0,s.qj)({name:"",event_code:"",startDate:"",endDate:"",user_id:1,campaign_id:1,venue:"",location_id:1});return{isLoading:t,apiUrl:a,isFileLoading:r,handleSubmit:l,dateFormat:m,formState:d,join:i}}});var f=c,g=a(83744);const h=(0,g.Z)(f,[["render",o]]);var v=h}}]);
//# sourceMappingURL=fireStore-add.f491e179.js.map