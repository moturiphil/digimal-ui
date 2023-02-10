"use strict";(self["webpackChunkMassNetCampaign"]=self["webpackChunkMassNetCampaign"]||[]).push([[7389],{66611:function(e,t,a){a.r(t),a.d(t,{CheckListWrap:function(){return l},DropDownListComponents:function(){return i},FormComponentsWrap:function(){return s},FormValidationWrap:function(){return p},HorizontalFormStyleWrap:function(){return n},VerticalFormStyleWrap:function(){return r}});var o=a(23481);const n=o.ZP.div`
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
            color: ${({theme:e})=>e["gray-color"]};
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
`,r=o.ZP.div`
    .ant-card{
        margin-bottom: 25px
    }

    .ant-input-affix-wrapper .ant-input-prefix svg{
        color: ${({theme:e})=>e["gray-color"]};
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
`,l=o.ZP.div`
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
`,i=o.ZP.div`
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
`,s=o.ZP.div`
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
                ${({theme:e})=>e.rtl?"right":"left"}: auto;
                ${({theme:e})=>e.rtl?"left":"right"}: 10px;
            }
        }
    }
    .sDash_slider-list{
        margin: -25px 0;
        .ant-slider{
            margin: 25px 0;
        }
    }
`,p=o.ZP.div`
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
                    border-color: ${({theme:e})=>e["danger-color"]}30;
                    &.ant-checkbox-checked{
                        border-color: ${({theme:e})=>e["danger-color"]}30;
                        &:after{
                            border-color: ${({theme:e})=>e["danger-color"]}30;
                        }
                        .ant-checkbox-inner{
                            &:after{
                                border-color: ${({theme:e})=>e["danger-color"]};
                            }
                        }
                    }
                    .ant-checkbox-inner{
                        border-color: ${({theme:e})=>e["danger-color"]}30;
                        background-color: ${({theme:e})=>e["danger-color"]}30;
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
`},49127:function(e,t,a){a.r(t),a.d(t,{default:function(){return D}});var o=a(66252);const n={class:"page-header-actions"},r={class:"sDash_dropdown-list"},l={class:"sDash_datepicker-list"},i={class:"sDash_editor"},s={class:"taglist-wrap"},p={class:"sDash_slider-list"},m={className:"sDash_uploader-list"},d=(0,o._)("p",{class:"ant-upload-text"},"Drop files here to upload",-1),u=(0,o._)("p",{class:"ant-upload-text"},"Drop files here to upload",-1);function c(e,t,a,c,f,h){const g=(0,o.up)("sdCalendarButton"),w=(0,o.up)("sdExportButton"),_=(0,o.up)("sdShareButton"),x=(0,o.up)("sdFeatherIcons"),b=(0,o.up)("sdButton"),W=(0,o.up)("sdPageHeader"),k=(0,o.up)("a-input"),D=(0,o.up)("a-form-item"),y=(0,o.up)("a-col"),F=(0,o.up)("a-input-password"),v=(0,o.up)("a-row"),C=(0,o.up)("a-form"),L=(0,o.up)("BasicFormWrapper"),z=(0,o.up)("sdCards"),P=(0,o.up)("sdDropdown"),$=(0,o.up)("DropDownListComponents"),B=(0,o.up)("a-date-picker"),U=(0,o.up)("a-range-picker"),Z=(0,o.up)("ckeditor"),S=(0,o.up)("a-tag"),E=(0,o.up)("a-switch"),M=(0,o.up)("a-slider"),I=(0,o.up)("a-upload-dragger"),N=(0,o.up)("FormComponentsWrap"),V=(0,o.up)("Main");return(0,o.wg)(),(0,o.iD)("div",null,[(0,o.Wm)(W,{title:"Form Component"},{buttons:(0,o.w5)((()=>[(0,o._)("div",n,[(0,o.Wm)(g),(0,o.Wm)(w),(0,o.Wm)(_),(0,o.Wm)(b,{size:"small",type:"primary"},{default:(0,o.w5)((()=>[(0,o.Wm)(x,{type:"plus",size:"14"}),(0,o.Uk)(" Add New ")])),_:1})])])),_:1}),(0,o.Wm)(V,null,{default:(0,o.w5)((()=>[(0,o.Wm)(N,null,{default:(0,o.w5)((()=>[(0,o.Wm)(v,{gutter:25},{default:(0,o.w5)((()=>[(0,o.Wm)(y,{md:12,xs:24},{default:(0,o.w5)((()=>[(0,o.Wm)(z,{title:"Input Groups",class:"mb-25"},{default:(0,o.w5)((()=>[(0,o.Wm)(L,null,{default:(0,o.w5)((()=>[(0,o.Wm)(C,{name:"sDash_textarea",layout:"vertical"},{default:(0,o.w5)((()=>[(0,o.Wm)(v,{gutter:30},{default:(0,o.w5)((()=>[(0,o.Wm)(y,{lg:12,xs:24,class:"mb-25"},{default:(0,o.w5)((()=>[(0,o.Wm)(D,{name:"input-name"},{default:(0,o.w5)((()=>[(0,o.Wm)(k,{placeholder:"Name"},{prefix:(0,o.w5)((()=>[(0,o.Wm)(x,{type:"user",size:"14"})])),_:1})])),_:1})])),_:1}),(0,o.Wm)(y,{lg:12,xs:24,class:"mb-25"},{default:(0,o.w5)((()=>[(0,o.Wm)(D,null,{default:(0,o.w5)((()=>[(0,o.Wm)(k,{name:"email",placeholder:"Email"},{prefix:(0,o.w5)((()=>[(0,o.Wm)(x,{type:"mail",size:"14"})])),_:1})])),_:1})])),_:1}),(0,o.Wm)(y,{lg:12,xs:24,class:"mb-25"},{default:(0,o.w5)((()=>[(0,o.Wm)(D,null,{default:(0,o.w5)((()=>[(0,o.Wm)(k,{name:"input-location",placeholder:"Location"},{prefix:(0,o.w5)((()=>[(0,o.Wm)(x,{type:"map-pin",size:"14"})])),_:1})])),_:1})])),_:1}),(0,o.Wm)(y,{lg:12,xs:24,class:"mb-25"},{default:(0,o.w5)((()=>[(0,o.Wm)(D,null,{default:(0,o.w5)((()=>[(0,o.Wm)(F,{name:"password",value:"12345678",placeholder:"with input password"},{prefix:(0,o.w5)((()=>[(0,o.Wm)(x,{type:"lock",size:"14"})])),_:1})])),_:1})])),_:1}),(0,o.Wm)(y,{lg:12,xs:24,class:"mb-25"},{default:(0,o.w5)((()=>[(0,o.Wm)(D,null,{default:(0,o.w5)((()=>[(0,o.Wm)(k,{name:"input-payment",placeholder:"Payment Method"},{prefix:(0,o.w5)((()=>[(0,o.Wm)(x,{type:"credit-card",size:"14"})])),_:1})])),_:1})])),_:1}),(0,o.Wm)(y,{lg:12,xs:24,class:"mb-25"},{default:(0,o.w5)((()=>[(0,o.Wm)(D,null,{default:(0,o.w5)((()=>[(0,o.Wm)(k,{name:"input-phone",placeholder:"Phone"},{prefix:(0,o.w5)((()=>[(0,o.Wm)(x,{type:"phone",size:"14"})])),_:1})])),_:1})])),_:1})])),_:1})])),_:1})])),_:1})])),_:1}),(0,o.Wm)(z,{title:"Dropdown",class:"mb-25"},{default:(0,o.w5)((()=>[(0,o.Wm)($,null,{default:(0,o.w5)((()=>[(0,o._)("div",r,[(0,o.Wm)(P,{placement:"bottomLeft"},{default:(0,o.w5)((()=>[(0,o.Wm)(b,{class:"btn-outlined",outlined:!0,type:"light"},{default:(0,o.w5)((()=>[(0,o.Uk)(" Alerts ")])),_:1})])),_:1}),(0,o.Wm)(P,{placement:"bottomLeft"},{default:(0,o.w5)((()=>[(0,o.Wm)(b,{class:"btn-outlined",outlined:!0,type:"light"},{default:(0,o.w5)((()=>[(0,o.Uk)(" Select an option... ")])),_:1})])),_:1})])])),_:1})])),_:1}),(0,o.Wm)(z,{title:"Datepicker",class:"mb-25"},{default:(0,o.w5)((()=>[(0,o._)("div",l,[(0,o.Wm)(L,null,{default:(0,o.w5)((()=>[(0,o.Wm)(C,{name:"datepicker-form",layout:"vertical"},{default:(0,o.w5)((()=>[(0,o.Wm)(D,{name:"datePicker",label:"Datepicker"},{default:(0,o.w5)((()=>[(0,o.Wm)(B)])),_:1}),(0,o.Wm)(D,{name:"rangePicker",label:"Date Range Picker"},{default:(0,o.w5)((()=>[(0,o.Wm)(U)])),_:1})])),_:1})])),_:1})])])),_:1}),(0,o.Wm)(z,{title:"Text Editor",class:"mb-25"},{default:(0,o.w5)((()=>[(0,o._)("div",i,[(0,o.Wm)(Z,{editor:e.editor,modelValue:e.editorData,"onUpdate:modelValue":t[0]||(t[0]=t=>e.editorData=t),config:e.editorConfig},null,8,["editor","modelValue","config"])])])),_:1})])),_:1}),(0,o.Wm)(y,{md:12,xs:24},{default:(0,o.w5)((()=>[(0,o.Wm)(z,{title:"Tags",class:"mb-25"},{default:(0,o.w5)((()=>[(0,o._)("div",s,[(0,o.Wm)(S,null,{default:(0,o.w5)((()=>[(0,o.Uk)("Unremovable")])),_:1}),(0,o.Wm)(S,{closable:""},{default:(0,o.w5)((()=>[(0,o.Uk)(" a-tag 2 ")])),_:1}),(0,o.Wm)(S,{closable:""},{default:(0,o.w5)((()=>[(0,o.Uk)(" a-tag 3 ")])),_:1})])])),_:1}),(0,o.Wm)(z,{title:"Toggle buttons",class:"mb-25"},{default:(0,o.w5)((()=>[(0,o.Wm)(E,{checked:e.formState.toggle,"onUpdate:checked":t[1]||(t[1]=t=>e.formState.toggle=t),size:"large"},null,8,["checked"])])),_:1}),(0,o.Wm)(z,{title:"Sliders",class:"mb-25"},{default:(0,o.w5)((()=>[(0,o._)("div",p,[(0,o.Wm)(M,{"default-value":30}),(0,o.Wm)(M,{range:"",step:10,"default-value":[20,50]})])])),_:1}),(0,o.Wm)(z,{title:"Dropzone",class:"mb-25"},{default:(0,o.w5)((()=>[(0,o._)("div",m,[(0,o.Wm)(I,{class:"sDash-uploader-large",fileList:e.fileList,"onUpdate:fileList":t[2]||(t[2]=t=>e.fileList=t),name:"file",multiple:!0,action:"https://www.mocky.io/v2/5cc8019d300000980a055e76",onChange:e.handleChange},{default:(0,o.w5)((()=>[d])),_:1},8,["fileList","onChange"]),(0,o.Wm)(I,{fileList:e.fileList,"onUpdate:fileList":t[3]||(t[3]=t=>e.fileList=t),name:"file",multiple:!0,action:"https://www.mocky.io/v2/5cc8019d300000980a055e76",onChange:e.handleChange},{default:(0,o.w5)((()=>[u])),_:1},8,["fileList","onChange"])])])),_:1})])),_:1})])),_:1})])),_:1})])),_:1})])}a(94310);var f=a(61446),h=a(2262),g=a(72984),w=a(66611),_=a(5234),x=a.n(_),b=(0,o.aZ)({name:"FormComponent",components:{Main:g.Main,BasicFormWrapper:g.BasicFormWrapper,FormComponentsWrap:w.FormComponentsWrap,DropDownListComponents:w.DropDownListComponents},data(){return{editor:x(),editorData:"<p>What is Lorem Ipsum Lorem Ipsum is simply dummy text of the printing and typesetting industry Lorem Ipsum has been the industry's standard dummy text ever since the 1500s when an unknown printer took a galley of type and scrambled it to make a type specimen book it has?</p>",editorConfig:{height:"300px"},disabled:!1}},setup(){const e=e=>{const t=e.file.status;"uploading"!==t&&console.log(e.file,e.fileList),"done"===t?f.ZP.success(`${e.file.name} file uploaded successfully.`):"error"===t&&f.ZP.error(`${e.file.name} file upload failed.`)},t=(0,h.qj)({toggle:!1});return{handleChange:e,fileList:(0,h.iH)([]),formState:t}}}),W=a(83744);const k=(0,W.Z)(b,[["render",c]]);var D=k}}]);
//# sourceMappingURL=FormComponents.4fd1b3c0.js.map