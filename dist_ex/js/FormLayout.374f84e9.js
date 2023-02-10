"use strict";(self["webpackChunkMassNetCampaign"]=self["webpackChunkMassNetCampaign"]||[]).push([[429],{66611:function(a,t,e){e.r(t),e.d(t,{CheckListWrap:function(){return n},DropDownListComponents:function(){return m},FormComponentsWrap:function(){return p},FormValidationWrap:function(){return u},HorizontalFormStyleWrap:function(){return o},VerticalFormStyleWrap:function(){return l}});var r=e(23481);const o=r.ZP.div`
    .ant-card{
        margin-bottom: 25px
    }
    .ant-form-horizontal{
        .ant-form-item .ant-form-item-label{
            label{
                display: inline-block;
                font-weight: 500;
                margin-bottom: 0;
                @media only screen and (max-width: 767px) {
                    margin-bottom: 0;
                }
            }
        }

        .ant-form-item{
            margin-bottom: 25px !important;
        }
        .ant-input-affix-wrapper .ant-input-prefix svg{
            color: ${({theme:a})=>a["gray-color"]};
        }
        .sDash_form-action{
            margin: -7.5px;
            button{
                font-size: 14px;
                font-weight: 500;
                border-radius: 6px;
                margin: 7.5px;
                padding: 6.4px 19px;
                &.sDash_form-action__btn{
                    height: 44px;
                    padding: 6.4px 20px;
                }
                &.ant-btn-light{
                    background-color: #F1F2F6;
                    border-color: #F1F2F6;
                }
                &.sDash_form-action__btn{
                    height: 44px;
                }
            }
            .ant-btn-light{
                background-color: #F8F9FB;
            }
        }
    }
    &.sDash_input-form{
        .ant-picker{
            width: 100%;
            &:focus{
                outline: none;
                box-shadow: 0 0;
            }
        }
    }
    ant-picker-input{
        &::placeholder{
            color: #9299B8 !important;
        }
    }
`,l=r.ZP.div`
    .ant-card{
        margin-bottom: 25px
    }

    .ant-input-affix-wrapper .ant-input-prefix svg{
        color: ${({theme:a})=>a["gray-color"]};
    }
    .sDash_form-action{
        margin: -7.5px;
        button{
            font-size: 14px;
            font-weight: 500;
            border-radius: 6px;
            margin: 7.5px;
            padding: 6.4px 19px;
            &.ant-btn-light{
                height: 44px;
                background-color: #F1F2F6;
                border-color: #F1F2F6;
            }
        }
        .ant-form-item{
            margin-bottom: 25px !important;
        }
        .ant-btn-light{
            background-color: #F8F9FB;
        }
    }
    .ant-form-item{
        padding-bottom: 0;
    }
`,n=r.ZP.div`
    .sDash_check-list-wrap{
        display: flex;
        justify-content: space-between;
        .sDash_check-list{
            li{
                &:not(:last-child){
                    margin-bottom: 20px;
                }
            }
        }
    }
`,m=r.ZP.div`
    .sDash_dropdown-list{
        .ant-dropdown-trigger{
            font-size: 14px;
            font-weight: 400;
            color: #9299B8;
            width: 100%;
            justify-content: flex-start;
            &:not(:last-child){
                margin-bottom: 25px;
            }
        }
    }
`,p=r.ZP.div`
    .sDash_datepicker-list{
        .ant-picker.ant-picker-range{
            width: 100%;
        }
    }
    .sDash_editor{
        border-radius: 4px;
        .EditorToolbar__root___3_Aqz{
            padding: 12px 20px 0;
        }
        .DraftEditor-root{
            min-height: 100px;
            .public-DraftEditorPlaceholder-root{
                padding: 12px 20px 0;
            }
        }
        select{
            margin-top: -4px;
        }
        .Dropdown__value___34Py9{
            &:after,
            &:before{
                ${({theme:a})=>a.rtl?"right":"left"}: auto;
                ${({theme:a})=>a.rtl?"left":"right"}: 10px;
            }
        }
    }
    .sDash_slider-list{
        margin: -25px 0;
        .ant-slider{
            margin: 25px 0;
        }
    }
`,u=r.ZP.div`
    .ant-card-body{
        padding: 30px 25px 50px 25px !important;
    }
    .ant-form-item .has-error{
        .ant-form-explain{
            font-size: 13px;
        }
    }
    .sDash_agree-check{
        .ant-form-item-control-input{
            min-height: auto;
        }
        .ant-form-item .has-error{
            .ant-checkbox-wrapper{
                span{
                    font-size: 13px;
                }
                .ant-checkbox{
                    border-color: ${({theme:a})=>a["danger-color"]}30;
                    &.ant-checkbox-checked{
                        border-color: ${({theme:a})=>a["danger-color"]}30;
                        &:after{
                            border-color: ${({theme:a})=>a["danger-color"]}30;
                        }
                        .ant-checkbox-inner{
                            &:after{
                                border-color: ${({theme:a})=>a["danger-color"]};
                            }
                        }
                    }
                    .ant-checkbox-inner{
                        border-color: ${({theme:a})=>a["danger-color"]}30;
                        background-color: ${({theme:a})=>a["danger-color"]}30;
                    }
                }
            }
        }
        .ant-form-item-explain{
            margin-left: 25px;
            font-size: 13px;
        }
    }
    .sDash_form-action{
        button{
            border-radius: 4px;
            padding: 6.4px 29.2px;
            height: 44px;
        }
    }
`},88816:function(a,t,e){e.r(t),e.d(t,{default:function(){return w}});var r=e(66252);const o={class:"page-header-actions"};function l(a,t,e,l,n,m){const p=(0,r.up)("sdCalendarButton"),u=(0,r.up)("sdExportButton"),i=(0,r.up)("sdShareButton"),s=(0,r.up)("sdFeatherIcons"),d=(0,r.up)("sdButton"),c=(0,r.up)("sdPageHeader"),f=(0,r.up)("HorizontalForm"),w=(0,r.up)("a-col"),h=(0,r.up)("HorizontalIconForm"),W=(0,r.up)("VerticalForm"),_=(0,r.up)("VerticalIconForm"),g=(0,r.up)("MultiColumnForm"),b=(0,r.up)("a-row"),x=(0,r.up)("Main");return(0,r.wg)(),(0,r.iD)("div",null,[(0,r.Wm)(c,{title:"Form Layout"},{buttons:(0,r.w5)((()=>[(0,r._)("div",o,[(0,r.Wm)(p),(0,r.Wm)(u),(0,r.Wm)(i),(0,r.Wm)(d,{size:"small",type:"primary"},{default:(0,r.w5)((()=>[(0,r.Wm)(s,{type:"plus",size:"14"}),(0,r.Uk)(" Add New ")])),_:1})])])),_:1}),(0,r.Wm)(x,null,{default:(0,r.w5)((()=>[(0,r.Wm)(b,{gutter:25},{default:(0,r.w5)((()=>[(0,r.Wm)(w,{lg:12,xs:24},{default:(0,r.w5)((()=>[(0,r.Wm)(f)])),_:1}),(0,r.Wm)(w,{lg:12,xs:24},{default:(0,r.w5)((()=>[(0,r.Wm)(h)])),_:1}),(0,r.Wm)(w,{lg:12,xs:24},{default:(0,r.w5)((()=>[(0,r.Wm)(W)])),_:1}),(0,r.Wm)(w,{lg:12,xs:24},{default:(0,r.w5)((()=>[(0,r.Wm)(_)])),_:1}),(0,r.Wm)(w,{xs:24},{default:(0,r.w5)((()=>[(0,r.Wm)(g)])),_:1})])),_:1})])),_:1})])}var n=e(72984),m=e(44568),p=e(52762),u=e(80620),i=e(29380),s=e(6060),d=(0,r.aZ)({name:"Form",components:{Main:n.Main,HorizontalForm:m["default"],HorizontalIconForm:p["default"],VerticalForm:u["default"],VerticalIconForm:i["default"],MultiColumnForm:s["default"]}}),c=e(83744);const f=(0,c.Z)(d,[["render",l]]);var w=f},44568:function(a,t,e){e.r(t),e.d(t,{default:function(){return s}});var r=e(66252);const o={class:"sDash_form-action"};function l(a,t,e,l,n,m){const p=(0,r.up)("a-input"),u=(0,r.up)("a-form-item"),i=(0,r.up)("a-input-password"),s=(0,r.up)("sdButton"),d=(0,r.up)("a-col"),c=(0,r.up)("a-row"),f=(0,r.up)("a-form"),w=(0,r.up)("sdCards"),h=(0,r.up)("HorizontalFormStyleWrap");return(0,r.wg)(),(0,r.j4)(h,null,{default:(0,r.w5)((()=>[(0,r.Wm)(w,{title:"Horizontal Form"},{default:(0,r.w5)((()=>[(0,r.Wm)(f,{layout:a.formState.layout,model:a.formState,"label-col":a.labelCol,"wrapper-col":a.wrapperCol,labelAlign:"left"},{default:(0,r.w5)((()=>[(0,r.Wm)(u,{label:"Name"},{default:(0,r.w5)((()=>[(0,r.Wm)(p,{value:a.formState.name,"onUpdate:value":t[0]||(t[0]=t=>a.formState.name=t),placeholder:"input placeholder"},null,8,["value"])])),_:1}),(0,r.Wm)(u,{label:"Email Address"},{default:(0,r.w5)((()=>[(0,r.Wm)(p,{value:a.formState.emailAddress,"onUpdate:value":t[1]||(t[1]=t=>a.formState.emailAddress=t),placeholder:"input placeholder"},null,8,["value"])])),_:1}),(0,r.Wm)(u,{label:"Password"},{default:(0,r.w5)((()=>[(0,r.Wm)(i,{value:a.formState.password,"onUpdate:value":t[2]||(t[2]=t=>a.formState.password=t),placeholder:"input placeholder"},null,8,["value"])])),_:1}),(0,r.Wm)(c,null,{default:(0,r.w5)((()=>[(0,r.Wm)(d,{lg:{span:16,offset:8},md:{span:15,offset:9},xs:{span:24,offset:0}},{default:(0,r.w5)((()=>[(0,r._)("div",o,[(0,r.Wm)(s,{class:"sDash_form-action__btn",size:"large","html-type":"submit",type:"light"},{default:(0,r.w5)((()=>[(0,r.Uk)(" Cancel ")])),_:1}),(0,r.Wm)(s,{class:"sDash_form-action__btn",type:"primary",size:"large"},{default:(0,r.w5)((()=>[(0,r.Uk)(" Save ")])),_:1})])])),_:1})])),_:1})])),_:1},8,["layout","model","label-col","wrapper-col"])])),_:1})])),_:1})}var n=e(2262),m=e(66611),p=(0,r.aZ)({name:"HorizantalForm",components:{HorizontalFormStyleWrap:m.HorizontalFormStyleWrap},setup(){const a=(0,n.qj)({layout:"horizontal",name:"Duran Clayton",emailAddress:"username@email.com",password:"123456"}),t={lg:8,md:9,xs:24},e={lg:16,md:15,xs:24};return{formState:a,labelCol:t,wrapperCol:e}}}),u=e(83744);const i=(0,u.Z)(p,[["render",l]]);var s=i},52762:function(a,t,e){e.r(t),e.d(t,{default:function(){return s}});var r=e(66252);const o={class:"sDash_form-action"};function l(a,t,e,l,n,m){const p=(0,r.up)("sdFeatherIcons"),u=(0,r.up)("a-input"),i=(0,r.up)("a-form-item"),s=(0,r.up)("a-input-password"),d=(0,r.up)("sdButton"),c=(0,r.up)("a-col"),f=(0,r.up)("a-row"),w=(0,r.up)("a-form"),h=(0,r.up)("sdCards"),W=(0,r.up)("HorizontalFormStyleWrap");return(0,r.wg)(),(0,r.j4)(W,null,{default:(0,r.w5)((()=>[(0,r.Wm)(h,{title:"Horizontal Form With Icons"},{default:(0,r.w5)((()=>[(0,r.Wm)(w,{layout:a.formState.layout,model:a.formState,"label-col":a.labelCol,"wrapper-col":a.wrapperCol,labelAlign:"left"},{default:(0,r.w5)((()=>[(0,r.Wm)(i,{label:"Name"},{default:(0,r.w5)((()=>[(0,r.Wm)(u,{value:a.formState.name,"onUpdate:value":t[0]||(t[0]=t=>a.formState.name=t),placeholder:"input placeholder"},{prefix:(0,r.w5)((()=>[(0,r.Wm)(p,{type:"user",size:"14"})])),_:1},8,["value"])])),_:1}),(0,r.Wm)(i,{label:"Email Address"},{default:(0,r.w5)((()=>[(0,r.Wm)(u,{value:a.formState.emailAddress,"onUpdate:value":t[1]||(t[1]=t=>a.formState.emailAddress=t),placeholder:"input placeholder"},{prefix:(0,r.w5)((()=>[(0,r.Wm)(p,{type:"mail",size:"14"})])),_:1},8,["value"])])),_:1}),(0,r.Wm)(i,{label:"Password"},{default:(0,r.w5)((()=>[(0,r.Wm)(s,{value:a.formState.password,"onUpdate:value":t[2]||(t[2]=t=>a.formState.password=t),placeholder:"input placeholder"},{prefix:(0,r.w5)((()=>[(0,r.Wm)(p,{type:"lock",size:"14"})])),_:1},8,["value"])])),_:1}),(0,r.Wm)(f,null,{default:(0,r.w5)((()=>[(0,r.Wm)(c,{lg:{span:16,offset:8},md:{span:15,offset:9},xs:{span:24,offset:0}},{default:(0,r.w5)((()=>[(0,r._)("div",o,[(0,r.Wm)(d,{class:"btn-signin","html-type":"submit",type:"light"},{default:(0,r.w5)((()=>[(0,r.Uk)(" Cancel ")])),_:1}),(0,r.Wm)(d,{class:"btn-signin",type:"primary"},{default:(0,r.w5)((()=>[(0,r.Uk)(" Save ")])),_:1})])])),_:1})])),_:1})])),_:1},8,["layout","model","label-col","wrapper-col"])])),_:1})])),_:1})}var n=e(2262),m=e(66611),p=(0,r.aZ)({name:"HorizontalIconForm",components:{HorizontalFormStyleWrap:m.HorizontalFormStyleWrap},setup(){const a=(0,n.qj)({layout:"horizontal",name:"Duran Clayton",emailAddress:"username@email.com",password:"123456"}),t={lg:8,md:9,xs:24},e={lg:16,md:15,xs:24};return{formState:a,labelCol:t,wrapperCol:e}}}),u=e(83744);const i=(0,u.Z)(p,[["render",l]]);var s=i},6060:function(a,t,e){e.r(t),e.d(t,{default:function(){return i}});var r=e(66252);const o={class:"sDash_form-action"};function l(a,t,e,l,n,m){const p=(0,r.up)("a-input"),u=(0,r.up)("a-form-item"),i=(0,r.up)("a-col"),s=(0,r.up)("a-row"),d=(0,r.up)("sdButton"),c=(0,r.up)("a-form"),f=(0,r.up)("sdCards"),w=(0,r.up)("BasicFormWrapper");return(0,r.wg)(),(0,r.iD)("div",null,[(0,r.Wm)(w,{class:"mb-25"},{default:(0,r.w5)((()=>[(0,r.Wm)(f,{title:"Multiple Column"},{default:(0,r.w5)((()=>[(0,r.Wm)(c,{name:"multi-form",layout:"vertical"},{default:(0,r.w5)((()=>[(0,r.Wm)(s,{gutter:30},{default:(0,r.w5)((()=>[(0,r.Wm)(i,{sm:12,xs:24,class:"mb-25"},{default:(0,r.w5)((()=>[(0,r.Wm)(u,null,{default:(0,r.w5)((()=>[(0,r.Wm)(p,{placeholder:"Username"})])),_:1}),(0,r.Wm)(u,null,{default:(0,r.w5)((()=>[(0,r.Wm)(p,{placeholder:"City"})])),_:1}),(0,r.Wm)(u,null,{default:(0,r.w5)((()=>[(0,r.Wm)(p,{placeholder:"Company"})])),_:1})])),_:1}),(0,r.Wm)(i,{sm:12,xs:24,class:"mb-25"},{default:(0,r.w5)((()=>[(0,r.Wm)(u,null,{default:(0,r.w5)((()=>[(0,r.Wm)(p,{placeholder:"Last Name"})])),_:1}),(0,r.Wm)(u,null,{default:(0,r.w5)((()=>[(0,r.Wm)(p,{placeholder:"Country"})])),_:1}),(0,r.Wm)(u,null,{default:(0,r.w5)((()=>[(0,r.Wm)(p,{placeholder:"Email"})])),_:1})])),_:1})])),_:1}),(0,r.Wm)(s,null,{default:(0,r.w5)((()=>[(0,r.Wm)(i,{sm:12,xs:24},{default:(0,r.w5)((()=>[(0,r._)("div",o,[(0,r.Wm)(d,{class:"btn-signin","html-type":"submit",type:"light"},{default:(0,r.w5)((()=>[(0,r.Uk)(" Cancel ")])),_:1}),(0,r.Wm)(d,{class:"btn-signin",type:"primary"},{default:(0,r.w5)((()=>[(0,r.Uk)(" Save ")])),_:1})])])),_:1})])),_:1})])),_:1})])),_:1})])),_:1})])}var n=e(72984),m=(0,r.aZ)({name:"MultiColumnForm",components:{BasicFormWrapper:n.BasicFormWrapper}}),p=e(83744);const u=(0,p.Z)(m,[["render",l]]);var i=u},80620:function(a,t,e){e.r(t),e.d(t,{default:function(){return d}});var r=e(66252);const o={class:"sDash_form-action"};function l(a,t,e,l,n,m){const p=(0,r.up)("a-input"),u=(0,r.up)("a-form-item"),i=(0,r.up)("a-input-password"),s=(0,r.up)("sdButton"),d=(0,r.up)("a-col"),c=(0,r.up)("a-row"),f=(0,r.up)("a-form"),w=(0,r.up)("sdCards"),h=(0,r.up)("VerticalFormStyleWrap"),W=(0,r.up)("BasicFormWrapper");return(0,r.wg)(),(0,r.j4)(W,null,{default:(0,r.w5)((()=>[(0,r.Wm)(h,null,{default:(0,r.w5)((()=>[(0,r.Wm)(w,{title:"Vertical Form"},{default:(0,r.w5)((()=>[(0,r.Wm)(f,{name:"sDash_vertical-form",layout:a.formState.layout},{default:(0,r.w5)((()=>[(0,r.Wm)(u,{label:"Name"},{default:(0,r.w5)((()=>[(0,r.Wm)(p,{value:"Duran Clayton",placeholder:"input placeholder"})])),_:1}),(0,r.Wm)(u,{label:"Email Address"},{default:(0,r.w5)((()=>[(0,r.Wm)(p,{name:"email",value:"username@email.com",placeholder:"input placeholder"})])),_:1}),(0,r.Wm)(u,{label:"Password"},{default:(0,r.w5)((()=>[(0,r.Wm)(i,{name:"password",value:"12345678",placeholder:"with input password"})])),_:1}),(0,r.Wm)(c,null,{default:(0,r.w5)((()=>[(0,r.Wm)(d,{xs:24},{default:(0,r.w5)((()=>[(0,r._)("div",o,[(0,r.Wm)(s,{class:"btn-signin","html-type":"submit",type:"light"},{default:(0,r.w5)((()=>[(0,r.Uk)(" Cancel ")])),_:1}),(0,r.Wm)(s,{class:"btn-signin",type:"primary"},{default:(0,r.w5)((()=>[(0,r.Uk)(" Save ")])),_:1})])])),_:1})])),_:1})])),_:1},8,["layout"])])),_:1})])),_:1})])),_:1})}var n=e(66611),m=e(72984),p=e(2262),u=(0,r.aZ)({name:"VerticalForm",components:{BasicFormWrapper:m.BasicFormWrapper,VerticalFormStyleWrap:n.VerticalFormStyleWrap},setup(){const a=(0,p.qj)({layout:"vertical"});return{formState:a}}}),i=e(83744);const s=(0,i.Z)(u,[["render",l]]);var d=s},29380:function(a,t,e){e.r(t),e.d(t,{default:function(){return s}});var r=e(66252);const o={class:"sDash_form-action"};function l(a,t,e,l,n,m){const p=(0,r.up)("sdFeatherIcons"),u=(0,r.up)("a-input"),i=(0,r.up)("a-form-item"),s=(0,r.up)("a-input-password"),d=(0,r.up)("sdButton"),c=(0,r.up)("a-col"),f=(0,r.up)("a-row"),w=(0,r.up)("a-form"),h=(0,r.up)("sdCards"),W=(0,r.up)("VerticalFormStyleWrap"),_=(0,r.up)("BasicFormWrapper");return(0,r.wg)(),(0,r.j4)(_,null,{default:(0,r.w5)((()=>[(0,r.Wm)(W,null,{default:(0,r.w5)((()=>[(0,r.Wm)(h,{title:"Vertical Form With Icons"},{default:(0,r.w5)((()=>[(0,r.Wm)(w,{name:"sDash_vertical-form-with-icon",layout:"vertical"},{default:(0,r.w5)((()=>[(0,r.Wm)(i,{label:"Name"},{default:(0,r.w5)((()=>[(0,r.Wm)(u,{value:"Duran Clayton",placeholder:"input placeholder"},{prefix:(0,r.w5)((()=>[(0,r.Wm)(p,{type:"user",size:"14"})])),_:1})])),_:1}),(0,r.Wm)(i,{label:"Email Address"},{default:(0,r.w5)((()=>[(0,r.Wm)(u,{name:"email",value:"username@email.com",placeholder:"input placeholder"},{prefix:(0,r.w5)((()=>[(0,r.Wm)(p,{type:"mail",size:"14"})])),_:1})])),_:1}),(0,r.Wm)(i,{label:"Password"},{default:(0,r.w5)((()=>[(0,r.Wm)(s,{name:"password",value:"12345678",placeholder:"with input password"},{prefix:(0,r.w5)((()=>[(0,r.Wm)(p,{type:"lock",size:"14"})])),_:1})])),_:1}),(0,r.Wm)(f,null,{default:(0,r.w5)((()=>[(0,r.Wm)(c,{lg:{span:16,offset:8},md:{span:15,offset:9},xs:{span:24,offset:0}},{default:(0,r.w5)((()=>[(0,r._)("div",o,[(0,r.Wm)(d,{class:"btn-signin","html-type":"submit",type:"light"},{default:(0,r.w5)((()=>[(0,r.Uk)(" Cancel ")])),_:1}),(0,r.Wm)(d,{class:"btn-signin",type:"primary"},{default:(0,r.w5)((()=>[(0,r.Uk)(" Save ")])),_:1})])])),_:1})])),_:1})])),_:1})])),_:1})])),_:1})])),_:1})}var n=e(66611),m=e(72984),p=(0,r.aZ)({name:"VerticalIconForm",components:{BasicFormWrapper:m.BasicFormWrapper,VerticalFormStyleWrap:n.VerticalFormStyleWrap}}),u=e(83744);const i=(0,u.Z)(p,[["render",l]]);var s=i}}]);
//# sourceMappingURL=FormLayout.374f84e9.js.map