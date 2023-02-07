"use strict";(self["webpackChunkMassNetCampaign"]=self["webpackChunkMassNetCampaign"]||[]).push([[2066],{72379:function(e,t,a){a.r(t),a.d(t,{RecordFormWrapper:function(){return r},RecordViewWrapper:function(){return n}});var i=a(23481);const n=i.ZP.div`
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
`,r=i.ZP.div`
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
`},32434:function(e,t,a){a.r(t),a.d(t,{default:function(){return y}});var i=a(66252),n=a(49963);const r={class:"search-box"},o={class:"search-icon"},l={key:0,class:"spin"},s={key:1};function d(e,t,a,d,p,c){const u=(0,i.up)("sdFeatherIcons"),g=(0,i.up)("router-link"),m=(0,i.up)("sdButton"),h=(0,i.up)("sdPageHeader"),x=(0,i.up)("a-spin"),f=(0,i.up)("a-table"),A=(0,i.up)("TableWrapper"),w=(0,i.up)("sdCards"),b=(0,i.up)("a-col"),y=(0,i.up)("a-row"),W=(0,i.up)("Main"),B=(0,i.up)("RecordViewWrapper");return(0,i.wg)(),(0,i.j4)(B,null,{default:(0,i.w5)((()=>[(0,i.Wm)(h,{title:"Data List"},{subTitle:(0,i.w5)((()=>[(0,i._)("div",null,[(0,i.Wm)(m,{class:"btn-add_new",size:"default",type:"primary"},{default:(0,i.w5)((()=>[(0,i.Wm)(g,{to:"/crud/fireStore-add"},{default:(0,i.w5)((()=>[(0,i.Wm)(u,{type:"plus",size:"14"}),(0,i.Uk)(" Add New ")])),_:1})])),_:1})])])),buttons:(0,i.w5)((()=>[(0,i._)("div",r,[(0,i._)("span",o,[(0,i.Wm)(u,{type:"search",size:"14"})]),(0,i.wy)((0,i._)("input",{onKeyup:t[0]||(t[0]=(...t)=>e.onHandleSearch&&e.onHandleSearch(...t)),"onUpdate:modelValue":t[1]||(t[1]=t=>e.searchValue=t),type:"text",name:"recored-search",placeholder:"Search Here"},null,544),[[n.nr,e.searchValue]])])])),_:1}),(0,i.Wm)(W,null,{default:(0,i.w5)((()=>[(0,i.Wm)(y,{gutter:15},{default:(0,i.w5)((()=>[(0,i.Wm)(b,{class:"w-100",md:24},{default:(0,i.w5)((()=>[(0,i.Wm)(w,{headless:""},{default:(0,i.w5)((()=>[e.isLoading?((0,i.wg)(),(0,i.iD)("div",l,[(0,i.Wm)(x)])):((0,i.wg)(),(0,i.iD)("div",s,[(0,i.Wm)(A,{class:"table-data-view table-responsive"},{default:(0,i.w5)((()=>[(0,i.Wm)(f,{rowSelection:e.rowSelection,pagination:{pageSize:10,showSizeChanger:!0},dataSource:e.dataSource,columns:e.columns},null,8,["rowSelection","dataSource","columns"])])),_:1})]))])),_:1})])),_:1})])),_:1})])),_:1})])),_:1})}var p=a(72379),c=a(72984),u=a(33907),g=a(2262),m=a(30381),h=a.n(m);const x=[{title:"Name",dataIndex:"name",key:"name"},{title:"Email",dataIndex:"email",key:"email"},{title:"Company",dataIndex:"company",key:"company"},{title:"Position",dataIndex:"position",key:"position"},{title:"Status",dataIndex:"status",key:"status"},{title:"Joining Date",dataIndex:"jdate",key:"jdate"},{title:"Actions",dataIndex:"action",key:"action",width:"90px"}],f={name:"ViewPage",components:{RecordViewWrapper:p.RecordViewWrapper,Main:c.Main,TableWrapper:c.TableWrapper},setup(){const{state:e,dispatch:t}=(0,u.oR)(),n=(0,i.Fl)((()=>e.fireStore.data)),r=(0,i.Fl)((()=>e.fireStore.loading)),o=(0,g.iH)([]),l=(0,g.iH)("");(0,i.bv)((()=>{t("fireStoreCrudGetData")}));const s=e=>{const a=window.confirm("Are you sure delete this?");return a&&t("fireStoreDataDelete",e),!1},d=()=>{t("fireStoreDataSearch",l.value)},p=(0,i.Fl)((()=>n.value.length&&n.value.map(((e,t)=>{const{id:n,name:r,email:o,company:l,position:d,join:p,status:c,city:u,country:g,image:m}=e;return{key:t+1,name:(0,i.Wm)("div",{class:"record-img align-center-v"},[(0,i.Wm)("img",{src:m||a(39429),alt:n},null),(0,i.Wm)("span",null,[(0,i.Wm)("span",null,[r]),(0,i.Wm)("span",{class:"record-location"},[u,(0,i.Uk)(","),g])])]),email:o,company:l,position:d,jdate:h()(p).format("YYYY-MM-DD"),status:(0,i.Wm)("span",{class:`status ${c}`},[c]),action:(0,i.Wm)("div",{class:"table-actions"},[(0,i.Wm)((0,i.up)("router-link"),{class:"edit",to:`/crud/fireStore-edit/${n}`},{default:()=>[(0,i.Wm)((0,i.up)("sdFeatherIcons"),{type:"edit",size:14},null)]}),(0,i.Uk)("   "),(0,i.Wm)((0,i.up)("router-link"),{class:"delete",onClick:()=>s(n),to:"#"},{default:()=>[(0,i.Wm)((0,i.up)("sdFeatherIcons"),{type:"trash-2",size:14},null)]})])}})))),c=e=>{o.value=e},m={selectedRowKeys:o,onChange:c};return{crud:n,isLoading:r,selectedRowKeys:o,onHandleSearch:d,handleDelete:s,rowSelection:m,onSelectChange:c,dataSource:p,columns:x,searchValue:l}}};var A=f,w=a(83744);const b=(0,w.Z)(A,[["render",d]]);var y=b},39429:function(e){e.exports="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAHgAAAB4CAYAAAA5ZDbSAAAElklEQVR4Xu2Xy0okQRBFc0TwuVFx4VtEFBFxI7jzr/0Bdy5FVBR8ICqIqBsVBXGGSIgmpqa6C63ulrme2khblVl578kbkfVre3v7d+KSdeAXgGXZZmEA1uYLYHG+AAawugPi+ujBABZ3QFweCQawuAPi8kgwgMUdEJdHggEs7oC4PBIMYHEHxOWRYACLOyAujwQDWNwBcXkkGMDiDojLI8EAFndAXB4JBrC4A+LySDCAxR0Ql0eCASzugLg8EgxgcQfE5ZFgAIs7IC6PBANY3AFxeSQYwOIOiMsjwQAWd0BcHgkGsLgD4vJIMIDFHRCXR4IBLO6AuDwSDGBxB8TlkWAAizsgLo8EA1jcAXF5JBjA4g6IyyPBABZ3QFxexxO8tbWVLdzZ2cl/x8bG0vr6eurv78+/7+/v0+7u7j/3Pj4+0tnZWTo5OamFwN93d3eX9vf381xTU1NpZWUlXV5els6/tLSU5ufn08XFReP+2tpampmZyePf39/TwcFBur6+zr/jvaenp4bWWgtv0+COAXbRJjgCNvN6e3vT4eFhA7abb5vh7e0tA7fx4+PjaW9vL2+COpe9c3Z2Nh0dHWUo8T1xXt8MPT09yTbY1dVVA/DGxkY6Pz/Pa4lrszE+9+vra968cTPVWXc7xnYMsC/OzBgZGWm6q83sx8fH9PDwkJaXl9Px8XGGYMbZ2Jubm9optrU4VHvX5ORkTnOzjVP1btswPsfi4mKW6lWoSm87oH1mjm8FHI20RReNd/iDg4PJUjUwMJBLeyyRMY3FpEYjrCzbBrKrKmFVgCNEX6OX/wh/dXU1vby8pNHR0Vy1LOFWkWLqW1WUz4Bs9uy3At7c3Ex9fX053dEYT1YEbFXAe3Ic5+CsfM7NzbVMfBzXyrxWgIv9uwqwbUjv13Ez2lrssg3QqsLVhfwtgL3XPT8/N0pbFeBYBh2ql3Pv9/HAVjTG5p+ens6V4Pb2tnHgKjOwGWB7z8TExF8HrCrA1hLK0m3vtX5tyY4HtrpAi+O7DriZeUVo8Tnb4a0AG7yFhYXcy70Xlh2erDTbIe4rPbhZb/UklvXgVvBtM9r9mPB2w7X5ug7YjLKeWgai2SnaDjJDQ0ONE/VnS3QRTrNTtBtc3IT22/rp6elp49PIn419v3iKLn4i/ogSbXDMsHj5t6Ol2Iy0shUPUjbGD1hWYv2w4mXOS31ZCS37pi37XzHx8QQf1+XPxe/0qCm2CQc8PDych7nOuE7fFLFdtTPJHU9wOxZbLIPtmLMbcxRLdDfe2fUe3A5RAP66iyT4695VjiTBlRbxQF0H/osE1xX5k8cDWJw+gAEs7oC4PBIMYHEHxOWRYACLOyAujwQDWNwBcXkkGMDiDojLI8EAFndAXB4JBrC4A+LySDCAxR0Ql0eCASzugLg8EgxgcQfE5ZFgAIs7IC6PBANY3AFxeSQYwOIOiMsjwQAWd0BcHgkGsLgD4vJIMIDFHRCXR4IBLO6AuDwSDGBxB8TlkWAAizsgLo8EA1jcAXF5JBjA4g6IyyPBABZ3QFweCQawuAPi8kgwgMUdEJdHgsUB/wHERxbFRshvpQAAAABJRU5ErkJggg=="}}]);
//# sourceMappingURL=fireStore-view.55eb240a.js.map