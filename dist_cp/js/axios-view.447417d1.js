"use strict";(self["webpackChunkMassNetCampaign"]=self["webpackChunkMassNetCampaign"]||[]).push([[179],{40008:function(e,t,a){function n(){let e=JSON.parse(localStorage.getItem("user"));return console.log(e),e?{Accept:"application/json",Authorization:"Bearer "+e}:{}}a.r(t),a.d(t,{default:function(){return n}})},25830:function(e,t,a){a.r(t),a.d(t,{RecordFormWrapper:function(){return r},RecordViewWrapper:function(){return i}});var n=a(23481);const i=n.ZP.div`
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
`,r=n.ZP.div`
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
`},23286:function(e,t,a){a.r(t),a.d(t,{default:function(){return b}});var n=a(66252);const i={class:"search-box"},r={class:"search-icon"},o={key:0,class:"spin"},l={key:1};function s(e,t,a,s,p,d){const c=(0,n.up)("sdFeatherIcons"),u=(0,n.up)("router-link"),g=(0,n.up)("sdButton"),m=(0,n.up)("sdPageHeader"),f=(0,n.up)("a-spin"),h=(0,n.up)("a-table"),x=(0,n.up)("TableWrapper"),w=(0,n.up)("sdCards"),b=(0,n.up)("a-col"),y=(0,n.up)("a-row"),v=(0,n.up)("DragAndDropTable"),W=(0,n.up)("Main"),k=(0,n.up)("RecordViewWrapper");return(0,n.wg)(),(0,n.j4)(k,null,{default:(0,n.w5)((()=>[(0,n.Wm)(m,{title:"MassNet Campaigns"},{subTitle:(0,n.w5)((()=>[(0,n.Wm)(g,{class:"btn-add_new",size:"default",type:"success"},{default:(0,n.w5)((()=>[(0,n.Wm)(u,{to:"/campaigns/create-campaign"},{default:(0,n.w5)((()=>[(0,n.Wm)(c,{type:"plus",size:"14"}),(0,n.Uk)(" Start New Campaign")])),_:1})])),_:1})])),buttons:(0,n.w5)((()=>[(0,n._)("div",i,[(0,n._)("span",r,[(0,n.Wm)(c,{type:"search",size:"14"})])])])),_:1}),(0,n.Wm)(W,null,{default:(0,n.w5)((()=>[(0,n.Wm)(y,{gutter:15},{default:(0,n.w5)((()=>[(0,n.Wm)(b,{class:"w-100",md:24},{default:(0,n.w5)((()=>[(0,n.Wm)(w,{headless:""},{default:(0,n.w5)((()=>[e.isLoading?((0,n.wg)(),(0,n.iD)("div",o,[(0,n.Wm)(f)])):((0,n.wg)(),(0,n.iD)("div",l,[(0,n.Wm)(x,{class:"table-data-view table-responsive"},{default:(0,n.w5)((()=>[(0,n.Wm)(h,{rowSelection:e.rowSelection,pagination:{pageSize:10,showSizeChanger:!0},dataSource:e.dataSource,columns:e.columns},null,8,["rowSelection","dataSource","columns"])])),_:1})]))])),_:1})])),_:1})])),_:1}),(0,n.Wm)(b,{xs:24},{default:(0,n.w5)((()=>[(0,n.Wm)(v)])),_:1})])),_:1})])),_:1})}var p=a(25830),d=a(72984),c=a(33907),u=a(2262),g=a(40008);const m=[{title:"Campaign Name",dataIndex:"name",key:"id"},{title:"Campaign Start Date",dataIndex:"start_date",key:"id"},{title:"Campaign End Date",dataIndex:"end_date",key:"id"}],f=(0,n.aZ)({name:"ViewPage",components:{RecordViewWrapper:p.RecordViewWrapper,Main:d.Main,TableWrapper:d.TableWrapper},setup(){const{state:e,dispatch:t}=(0,c.oR)(),a=(0,n.Fl)((()=>e.crud.data)),i=(0,n.Fl)((()=>e.crud.loading)),r=(0,u.iH)([]),o=(0,u.iH)([]);console.log((0,g["default"])()),(0,n.bv)((async()=>{try{const e=await fetch("http://localhost:8000/api/campaign_all",{method:"GET",headers:(0,g["default"])()}),t=await e.json();o.value=t.data}catch(e){console.error(e)}}));const l=e=>{const a=window.confirm("Are you sure delete this?");return a&&t("axiosDataDelete",{id:e,getData:()=>{t("axiosCrudGetData")}}),!1},s=(0,u.qj)({searchItem:""}),p=e=>{r.value=e},d={selectedRowKeys:r,onChange:p};return{crud:a,isLoading:i,selectedRowKeys:r,handleDelete:l,rowSelection:d,onSelectChange:p,dataSource:o,columns:m,formState:s}},beforeRouteEnter(e,t,a){localStorage.getItem("user")?a():a("/auth/login")}});var h=f,x=a(83744);const w=(0,x.Z)(h,[["render",s]]);var b=w}}]);
//# sourceMappingURL=axios-view.447417d1.js.map