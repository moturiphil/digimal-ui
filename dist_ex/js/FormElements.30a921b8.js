"use strict";(self["webpackChunkMassNetCampaign"]=self["webpackChunkMassNetCampaign"]||[]).push([[6711],{66611:function(e,a,l){l.r(a),l.d(a,{CheckListWrap:function(){return n},DropDownListComponents:function(){return u},FormComponentsWrap:function(){return m},FormValidationWrap:function(){return d},HorizontalFormStyleWrap:function(){return r},VerticalFormStyleWrap:function(){return o}});var t=l(23481);const r=t.ZP.div`
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
`,o=t.ZP.div`
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
`,n=t.ZP.div`
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
`,u=t.ZP.div`
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
`,m=t.ZP.div`
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
`,d=t.ZP.div`
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
`},47260:function(e,a,l){l.r(a),l.d(a,{default:function(){return x}});var t=l(66252);const r={class:"page-header-actions"},o=(0,t._)("span",{class:"sDash_upload-text"},"Select File",-1),n=(0,t._)("a",{to:"#",class:"sDash_upload-browse"}," Browse ",-1),u={class:"sDash_check-list-wrap"},m={class:"sDash_check-list sDash_check-list--left"},d={class:"sDash_check-list sDash_check-list--right"};function s(e,a,l,s,i,p){const c=(0,t.up)("sdCalendarButton"),f=(0,t.up)("sdExportButton"),h=(0,t.up)("sdShareButton"),_=(0,t.up)("sdFeatherIcons"),w=(0,t.up)("sdButton"),W=(0,t.up)("sdPageHeader"),b=(0,t.up)("GridForm"),g=(0,t.up)("a-col"),x=(0,t.up)("SizedForm"),v=(0,t.up)("InputForm"),k=(0,t.up)("a-textarea"),F=(0,t.up)("a-form-item"),D=(0,t.up)("a-form"),S=(0,t.up)("sdCards"),C=(0,t.up)("a-select-option"),U=(0,t.up)("a-select"),y=(0,t.up)("a-upload"),z=(0,t.up)("a-checkbox"),B=(0,t.up)("a-radio"),Z=(0,t.up)("CheckListWrap"),P=(0,t.up)("a-row"),T=(0,t.up)("Main");return(0,t.wg)(),(0,t.iD)("div",null,[(0,t.Wm)(W,{title:"Form Elements"},{buttons:(0,t.w5)((()=>[(0,t._)("div",r,[(0,t.Wm)(c),(0,t.Wm)(f),(0,t.Wm)(h),(0,t.Wm)(w,{size:"small",type:"primary"},{default:(0,t.w5)((()=>[(0,t.Wm)(_,{type:"plus",size:"14"}),(0,t.Uk)(" Add New ")])),_:1})])])),_:1}),(0,t.Wm)(T,null,{default:(0,t.w5)((()=>[(0,t.Wm)(P,{gutter:25},{default:(0,t.w5)((()=>[(0,t.Wm)(g,{xs:24},{default:(0,t.w5)((()=>[(0,t.Wm)(b)])),_:1}),(0,t.Wm)(g,{lg:12,xs:24},{default:(0,t.w5)((()=>[(0,t.Wm)(x),(0,t.Wm)(v)])),_:1}),(0,t.Wm)(g,{lg:12,xs:24},{default:(0,t.w5)((()=>[(0,t.Wm)(S,{title:"Text Input",class:"mb-25"},{default:(0,t.w5)((()=>[(0,t.Wm)(D,{name:"sDash_textarea",layout:"vertical"},{default:(0,t.w5)((()=>[(0,t.Wm)(F,{name:"basic-textarea",label:"Basic Textarea"},{default:(0,t.w5)((()=>[(0,t.Wm)(k,{placeholder:"Basic usage",rows:2})])),_:1}),(0,t.Wm)(F,{label:"Unresizable Textarea"},{default:(0,t.w5)((()=>[(0,t.Wm)(k,{placeholder:"Unresizable Textarea",name:"unresizable-textarea",class:"sDash_unresizable",rows:3})])),_:1})])),_:1})])),_:1}),(0,t.Wm)(S,{title:"Select",class:"mb-25"},{default:(0,t.w5)((()=>[(0,t.Wm)(D,{name:"sDash_Select",layout:"vertical"},{default:(0,t.w5)((()=>[(0,t.Wm)(F,{label:"Basic Select"},{default:(0,t.w5)((()=>[(0,t.Wm)(U,{size:"large",name:"basic-select",class:"sDash_fullwidth-select"},{default:(0,t.w5)((()=>[(0,t.Wm)(C,{value:"1"},{default:(0,t.w5)((()=>[(0,t.Uk)("1")])),_:1}),(0,t.Wm)(C,{"default-value":"2",value:"2"},{default:(0,t.w5)((()=>[(0,t.Uk)("2")])),_:1}),(0,t.Wm)(C,{value:"3"},{default:(0,t.w5)((()=>[(0,t.Uk)("3")])),_:1}),(0,t.Wm)(C,{value:"4"},{default:(0,t.w5)((()=>[(0,t.Uk)("4")])),_:1})])),_:1})])),_:1}),(0,t.Wm)(F,{label:"Disabled Basic Select"},{default:(0,t.w5)((()=>[(0,t.Wm)(U,{size:"large",name:"disabled-select",class:"sDash_fullwidth-select",disabled:""},{default:(0,t.w5)((()=>[(0,t.Wm)(C,{value:"1"},{default:(0,t.w5)((()=>[(0,t.Uk)("1")])),_:1})])),_:1})])),_:1}),(0,t.Wm)(F,{label:"Multiple Select"},{default:(0,t.w5)((()=>[(0,t.Wm)(U,{mode:"multiple","default-value":["1","2"],placeholder:"Please select"},{default:(0,t.w5)((()=>[(0,t.Wm)(C,{value:"1"},{default:(0,t.w5)((()=>[(0,t.Uk)("1")])),_:1}),(0,t.Wm)(C,{value:"2"},{default:(0,t.w5)((()=>[(0,t.Uk)("2")])),_:1}),(0,t.Wm)(C,{value:"3"},{default:(0,t.w5)((()=>[(0,t.Uk)("3")])),_:1}),(0,t.Wm)(C,{value:"4"},{default:(0,t.w5)((()=>[(0,t.Uk)("4")])),_:1})])),_:1})])),_:1}),(0,t.Wm)(F,{label:"Disabled Multiple Select"},{default:(0,t.w5)((()=>[(0,t.Wm)(U,{mode:"multiple","default-value":["1","2"],placeholder:"Please select",disabled:""},{default:(0,t.w5)((()=>[(0,t.Wm)(C,{value:"1"},{default:(0,t.w5)((()=>[(0,t.Uk)("1")])),_:1}),(0,t.Wm)(C,{value:"2"},{default:(0,t.w5)((()=>[(0,t.Uk)("2")])),_:1}),(0,t.Wm)(C,{value:"3"},{default:(0,t.w5)((()=>[(0,t.Uk)("3")])),_:1}),(0,t.Wm)(C,{value:"4"},{default:(0,t.w5)((()=>[(0,t.Uk)("4")])),_:1})])),_:1})])),_:1})])),_:1})])),_:1}),(0,t.Wm)(S,{title:"File Browser",class:"sDash_upload-form mb-25"},{default:(0,t.w5)((()=>[(0,t.Wm)(D,{name:"sDash_file_browser",layout:"vertical"},{default:(0,t.w5)((()=>[(0,t.Wm)(y,{class:"sDash_upload-basic",name:"file",multiple:!0,action:"https://www.mocky.io/v2/5cc8019d300000980a055e76",headers:e.headers,onChange:e.handleChange},{default:(0,t.w5)((()=>[o,n])),_:1},8,["headers","onChange"])])),_:1})])),_:1}),(0,t.Wm)(Z,{class:"mb-25"},{default:(0,t.w5)((()=>[(0,t.Wm)(S,{title:"Checkboxes and Radios"},{default:(0,t.w5)((()=>[(0,t._)("div",u,[(0,t._)("ul",m,[(0,t._)("li",null,[(0,t.Wm)(z,null,{default:(0,t.w5)((()=>[(0,t.Uk)("Checkbox")])),_:1})]),(0,t._)("li",null,[(0,t.Wm)(z,{checked:""},{default:(0,t.w5)((()=>[(0,t.Uk)(" Checked ")])),_:1})]),(0,t._)("li",null,[(0,t.Wm)(z,{disabled:""},{default:(0,t.w5)((()=>[(0,t.Uk)(" Disabled Unchecked ")])),_:1})]),(0,t._)("li",null,[(0,t.Wm)(z,{checked:"",disabled:""},{default:(0,t.w5)((()=>[(0,t.Uk)(" Disabled Checked ")])),_:1})])]),(0,t._)("ul",d,[(0,t._)("li",null,[(0,t.Wm)(B,null,{default:(0,t.w5)((()=>[(0,t.Uk)("Uncheck")])),_:1})]),(0,t._)("li",null,[(0,t.Wm)(B,{checked:""},{default:(0,t.w5)((()=>[(0,t.Uk)("Checked")])),_:1})]),(0,t._)("li",null,[(0,t.Wm)(B,{disabled:""},{default:(0,t.w5)((()=>[(0,t.Uk)("Disabled Unchecked")])),_:1})]),(0,t._)("li",null,[(0,t.Wm)(B,{checked:"",disabled:""},{default:(0,t.w5)((()=>[(0,t.Uk)(" Disabled Checked ")])),_:1})])])])])),_:1})])),_:1})])),_:1})])),_:1})])),_:1})])}l(94310);var i=l(61446),p=l(72984),c=l(66611),f=l(58994),h=l(83765),_=l(18425),w=l(2262),W=(0,t.aZ)({name:"FormElement",components:{Main:p.Main,GridForm:f["default"],SizedForm:h["default"],InputForm:_["default"],CheckListWrap:c.CheckListWrap},setup(){const e=e=>{"uploading"!==e.file.status&&console.log(e.file,e.fileList),"done"===e.file.status?i.ZP.success(`${e.file.name} file uploaded successfully`):"error"===e.file.status&&i.ZP.error(`${e.file.name} file upload failed.`)},a=(0,w.iH)([]);return{fileList:a,headers:{authorization:"authorization-text"},handleChange:e}}}),b=l(83744);const g=(0,b.Z)(W,[["render",s]]);var x=g},58994:function(e,a,l){l.r(a),l.d(a,{default:function(){return d}});var t=l(66252);function r(e,a,l,r,o,n){const u=(0,t.up)("a-input"),m=(0,t.up)("a-form-item"),d=(0,t.up)("a-col"),s=(0,t.up)("a-row"),i=(0,t.up)("a-form"),p=(0,t.up)("sdCards"),c=(0,t.up)("BasicFormWrapper");return(0,t.wg)(),(0,t.j4)(c,{class:"mb-25"},{default:(0,t.w5)((()=>[(0,t.Wm)(p,{title:"Form Group in Grid"},{default:(0,t.w5)((()=>[(0,t.Wm)(i,{name:"sDash_grid-form",layout:"vertical"},{default:(0,t.w5)((()=>[(0,t.Wm)(s,{gutter:30},{default:(0,t.w5)((()=>[(0,t.Wm)(d,{md:8,xs:24,class:"mb-25"},{default:(0,t.w5)((()=>[(0,t.Wm)(m,null,{default:(0,t.w5)((()=>[(0,t.Wm)(u,{name:"grid-3-1",placeholder:"One of Three Columns"})])),_:1})])),_:1}),(0,t.Wm)(d,{md:8,xs:24,class:"mb-25"},{default:(0,t.w5)((()=>[(0,t.Wm)(m,null,{default:(0,t.w5)((()=>[(0,t.Wm)(u,{name:"grid-3-2",placeholder:"One of Three Columns"})])),_:1})])),_:1}),(0,t.Wm)(d,{md:8,xs:24,class:"mb-25"},{default:(0,t.w5)((()=>[(0,t.Wm)(m,null,{default:(0,t.w5)((()=>[(0,t.Wm)(u,{name:"grid-3-3",placeholder:"One of Three Columns"})])),_:1})])),_:1})])),_:1}),(0,t.Wm)(s,{gutter:30},{default:(0,t.w5)((()=>[(0,t.Wm)(d,{md:6,xs:24,class:"mb-25"},{default:(0,t.w5)((()=>[(0,t.Wm)(m,null,{default:(0,t.w5)((()=>[(0,t.Wm)(u,{name:"grid-4-1",placeholder:"One of Four Columns"})])),_:1})])),_:1}),(0,t.Wm)(d,{md:6,xs:24,class:"mb-25"},{default:(0,t.w5)((()=>[(0,t.Wm)(m,null,{default:(0,t.w5)((()=>[(0,t.Wm)(u,{name:"grid-4-2",placeholder:"One of Four Columns"})])),_:1})])),_:1}),(0,t.Wm)(d,{md:6,xs:24,class:"mb-25"},{default:(0,t.w5)((()=>[(0,t.Wm)(m,null,{default:(0,t.w5)((()=>[(0,t.Wm)(u,{name:"grid-4-3",placeholder:"One of Four Columns"})])),_:1})])),_:1}),(0,t.Wm)(d,{md:6,xs:24,class:"mb-25"},{default:(0,t.w5)((()=>[(0,t.Wm)(m,null,{default:(0,t.w5)((()=>[(0,t.Wm)(u,{name:"grid-4-4",placeholder:"One of Four Columns"})])),_:1})])),_:1})])),_:1}),(0,t.Wm)(s,{gutter:30},{default:(0,t.w5)((()=>[(0,t.Wm)(d,{md:12,xs:24,class:"mb-25"},{default:(0,t.w5)((()=>[(0,t.Wm)(m,null,{default:(0,t.w5)((()=>[(0,t.Wm)(u,{name:"grid-2-1",placeholder:"One of Two Columns"})])),_:1})])),_:1}),(0,t.Wm)(d,{md:12,xs:24,class:"mb-25"},{default:(0,t.w5)((()=>[(0,t.Wm)(m,null,{default:(0,t.w5)((()=>[(0,t.Wm)(u,{name:"grid-2-1",placeholder:"One of Two Columns"})])),_:1})])),_:1})])),_:1})])),_:1})])),_:1})])),_:1})}var o=l(72984),n=(0,t.aZ)({name:"GridForm",components:{BasicFormWrapper:o.BasicFormWrapper}}),u=l(83744);const m=(0,u.Z)(n,[["render",r]]);var d=m},18425:function(e,a,l){l.r(a),l.d(a,{default:function(){return f}});var t=l(66252);const r={className:"sDash_color-picker"};function o(e,a,l,o,n,u){const m=(0,t.up)("a-input"),d=(0,t.up)("a-form-item"),s=(0,t.up)("a-input-password"),i=(0,t.up)("a-input-number"),p=(0,t.up)("a-date-picker"),c=(0,t.up)("a-month-picker"),f=(0,t.up)("a-time-picker"),h=(0,t.up)("a-form"),_=(0,t.up)("sdCards"),w=(0,t.up)("HorizontalFormStyleWrap"),W=(0,t.up)("BasicFormWrapper");return(0,t.wg)(),(0,t.j4)(W,null,{default:(0,t.w5)((()=>[(0,t.Wm)(w,null,{default:(0,t.w5)((()=>[(0,t.Wm)(_,{title:"Basic Inputs"},{default:(0,t.w5)((()=>[(0,t.Wm)(h,{name:"input-form",layout:e.formState.layout,model:e.formState,"label-col":e.labelCol,"wrapper-col":e.wrapperCol,labelAlign:"left"},{default:(0,t.w5)((()=>[(0,t.Wm)(d,{label:"Text"},{default:(0,t.w5)((()=>[(0,t.Wm)(m,{value:e.formState.text,"onUpdate:value":a[0]||(a[0]=a=>e.formState.text=a),placeholder:"input placeholder"},null,8,["value"])])),_:1}),(0,t.Wm)(d,{label:"Email Address"},{default:(0,t.w5)((()=>[(0,t.Wm)(m,{value:e.formState.emailAddress,"onUpdate:value":a[1]||(a[1]=a=>e.formState.emailAddress=a),placeholder:"input placeholder"},null,8,["value"])])),_:1}),(0,t.Wm)(d,{label:"URL"},{default:(0,t.w5)((()=>[(0,t.Wm)(m,{value:e.formState.url,"onUpdate:value":a[2]||(a[2]=a=>e.formState.url=a),name:"input-url",placeholder:"https://massnet-campaign-admin-dashboard-template"},null,8,["value"])])),_:1}),(0,t.Wm)(d,{label:"Phone"},{default:(0,t.w5)((()=>[(0,t.Wm)(m,{value:e.formState.phone,"onUpdate:value":a[3]||(a[3]=a=>e.formState.phone=a),name:"input-phone",placeholder:"017123456789"},null,8,["value"])])),_:1}),(0,t.Wm)(d,{label:"Password"},{default:(0,t.w5)((()=>[(0,t.Wm)(s,{value:e.formState.password,"onUpdate:value":a[4]||(a[4]=a=>e.formState.password=a),placeholder:"input placeholder"},null,8,["value"])])),_:1}),(0,t.Wm)(d,{label:"Number"},{default:(0,t.w5)((()=>[(0,t.Wm)(i,{value:e.formState.number,"onUpdate:value":a[5]||(a[5]=a=>e.formState.number=a),name:"input-number",placeholder:"12457485"},null,8,["value"])])),_:1}),(0,t.Wm)(d,{label:"Date"},{default:(0,t.w5)((()=>[(0,t.Wm)(p,{name:"input-date",value:e.formState.date,"onUpdate:value":a[6]||(a[6]=a=>e.formState.date=a)},null,8,["value"])])),_:1}),(0,t.Wm)(d,{label:"Month"},{default:(0,t.w5)((()=>[(0,t.Wm)(c,{name:"input-month",placeholder:"Select month",value:e.formState.month,"onUpdate:value":a[7]||(a[7]=a=>e.formState.month=a)},null,8,["value"])])),_:1}),(0,t.Wm)(d,{label:"Time"},{default:(0,t.w5)((()=>[(0,t.Wm)(f,{"default-value":e.dayjs("12:08:23","HH:mm:ss"),name:"input-time",value:e.formState.time,"onUpdate:value":a[8]||(a[8]=a=>e.formState.time=a)},null,8,["default-value","value"])])),_:1}),(0,t.Wm)(d,{label:"Color"},{default:(0,t.w5)((()=>[(0,t._)("div",r,[(0,t.Wm)(m,{style:{height:"55px"},name:"color",type:"color",value:e.formState.color,"onUpdate:value":a[9]||(a[9]=a=>e.formState.color=a)},null,8,["value"])])])),_:1})])),_:1},8,["layout","model","label-col","wrapper-col"])])),_:1})])),_:1})])),_:1})}var n=l(2262),u=l(72984),m=l(66611),d=l(27484),s=l.n(d),i=(0,t.aZ)({name:"InputForm",components:{BasicFormWrapper:u.BasicFormWrapper,HorizontalFormStyleWrap:m.HorizontalFormStyleWrap},methods:{dayjs:s()},setup(){const e=(0,n.qj)({layout:"vertical",text:"Duran Clayton",emailAddress:"username@email.com",password:"123456",number:"124",date:"",month:"",time:"",color:"#5F63F2"}),a={md:6,xs:24},l={md:18,xs:24};return{formState:e,labelCol:a,wrapperCol:l}}}),p=l(83744);const c=(0,p.Z)(i,[["render",o]]);var f=c},83765:function(e,a,l){l.r(a),l.d(a,{default:function(){return d}});var t=l(66252);function r(e,a,l,r,o,n){const u=(0,t.up)("a-input"),m=(0,t.up)("a-form-item"),d=(0,t.up)("a-col"),s=(0,t.up)("a-row"),i=(0,t.up)("a-form"),p=(0,t.up)("sdCards"),c=(0,t.up)("BasicFormWrapper");return(0,t.wg)(),(0,t.j4)(c,{class:"mb-25"},{default:(0,t.w5)((()=>[(0,t.Wm)(p,{title:"Sizes"},{default:(0,t.w5)((()=>[(0,t.Wm)(i,{name:"sDash_sized-form",layout:"vertical"},{default:(0,t.w5)((()=>[(0,t.Wm)(s,{gutter:30},{default:(0,t.w5)((()=>[(0,t.Wm)(d,{xs:24},{default:(0,t.w5)((()=>[(0,t.Wm)(m,{class:"large-input",label:"Large Input"},{default:(0,t.w5)((()=>[(0,t.Wm)(u,{size:"large",placeholder:"Large size"})])),_:1}),(0,t.Wm)(m,{class:"small-input",label:"Default Input"},{default:(0,t.w5)((()=>[(0,t.Wm)(u,{placeholder:"default size"})])),_:1}),(0,t.Wm)(m,{class:"mb-25",label:"Small Input"},{default:(0,t.w5)((()=>[(0,t.Wm)(u,{size:"small",placeholder:"small size"})])),_:1})])),_:1})])),_:1})])),_:1})])),_:1})])),_:1})}var o=l(72984),n=(0,t.aZ)({name:"SizedForm",components:{BasicFormWrapper:o.BasicFormWrapper}}),u=l(83744);const m=(0,u.Z)(n,[["render",r]]);var d=m}}]);
//# sourceMappingURL=FormElements.30a921b8.js.map