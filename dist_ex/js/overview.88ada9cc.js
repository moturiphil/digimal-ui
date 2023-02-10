"use strict";(self["webpackChunkMassNetCampaign"]=self["webpackChunkMassNetCampaign"]||[]).push([[2340,4695],{38801:function(e,t,a){a.r(t),a.d(t,{chartLinearGradient:function(){return r},customTooltips:function(){return n},textRefactor:function(){return o}});const o=(e,t)=>`${e.split(" ").slice(0,t).join(" ")}...`,r=(e,t,a)=>{const o=e.getContext("2d"),r=o.createLinearGradient(0,0,0,t);return r.addColorStop(0,`${a.start}`),r.addColorStop(1,`${a.end}`),r},n=function(e){let t=document.querySelector(".chartjs-tooltip");if(this._chart.canvas.closest(".parentContainer").contains(t)||(t=document.createElement("div"),t.className="chartjs-tooltip",t.innerHTML="<table></table>",document.querySelectorAll(".parentContainer").forEach((e=>{e.contains(document.querySelector(".chartjs-tooltip"))&&document.querySelector(".chartjs-tooltip").remove()})),this._chart.canvas.closest(".parentContainer").appendChild(t)),0===e.opacity)return void(t.style.opacity=0);function a(e){return e.lines}if(t.classList.remove("above","below","no-transform"),e.yAlign?t.classList.add(e.yAlign):t.classList.add("no-transform"),e.body){const o=e.title||[],r=e.body.map(a);let n="<thead>";o.forEach((function(e){n+=`<div class='tooltip-title'>${e}</div>`})),n+="</thead><tbody>",r.forEach((function(t,a){const o=e.labelColors[a];let r=`background:${o.backgroundColor}`;r+=`; border-color:${o.borderColor}`,r+="; border-width: 2px",r+="; border-radius: 30px";const i=`<span class="chartjs-tooltip-key" style="${r}"></span>`;n+=`<tr><td>${i}${t}</td></tr>`})),n+="</tbody>";const i=t.querySelector("table");i.innerHTML=n}const o=this._chart.canvas.offsetTop,r=this._chart.canvas.offsetLeft,n=document.querySelector(".chartjs-tooltip"),i=n.clientHeight;t.style.opacity=1,t.style.left=`${r+e.caretX}px`,t.style.top=o+e.caretY-(e.caretY>10?i>100?i+5:i+15:70)+"px",t.style.fontFamily=e._bodyFontFamily,t.style.fontSize=`${e.bodyFontSize}px`,t.style.fontStyle=e._bodyFontStyle,t.style.padding=`${e.yPadding}px ${e.xPadding}px`}},63430:function(e,t,a){a.r(t),a.d(t,{ActivityContents:function(){return l},ProductOverviewTable:function(){return s},RightAsideWrapper:function(){return i},SettingWrapper:function(){return n},UserBioBox:function(){return r}});var o=a(23481);const r=o.ZP.div`
    .ant-card-body{
        padding: 25px 0 25px 0 !important;
    }

    .user-info{
        margin-bottom: 22px;
        padding: 0 25px 22px 25px;
        border-bottom: 1px solid ${({theme:e})=>e["border-color-light"]};
        &:last-child{
            border-bottom: 0;
            margin-bottom: 0;
            padding-bottom: 0;
        }
        .user-info__title{
            font-size: 12px;
            color: ${({theme:e})=>e["light-color"]};
            text-transform: uppercase;
            margin-bottom: 16px;
        }
        p{
            font-size: 15px;
            line-height: 1.667;
            color: ${({theme:e})=>e["gray-color"]};
            &:last-child{
                margin-bottom:0;
            }
        }
        .user-info__contact{
            li{
                display: flex;
                align-items: center;
                &:not(:last-child){
                    margin-bottom: 14px;
                }
                svg,
                i,
                img{
                    ${({theme:e})=>e.rtl?"margin-left":"margin-right"}: 12px;
                    color: ${({theme:e})=>e["light-color"]};
                }
                i svg{
                    margin-right: 0;
                }
                span{
                    font-size: 14px;
                    color: ${({theme:e})=>e["gray-color"]};
                }
            }
        }

        .user-info__skills{
            margin: -3px;
            .btn-outlined{
                margin: 3px !important;
                font-size: 11px;
                height: 25px;
                padding: 0px 8.75px;
                text-transform: uppercase;
                border-radius: 5px;
                border-color: ${({theme:e})=>e["border-color-normal"]};
                margin: ${({theme:e})=>e.rtl?"0 0 10px 10px":"0 10px 10px 0"};
                color: ${({theme:e})=>e["gray-color"]} !important;
            }
        }
        .card__social{
            a{
                display: inline-flex;
                align-items: center;
                justify-content: center;
                width: 44px;
                height: 44px;
                border-radius: 50%;
                box-shadow: 0 5px 15px ${({theme:e})=>e["light-color"]}20;
                &:not(:last-child){
                    ${({theme:e})=>e.rtl?"margin-left":"margin-right"}: 10px;
                }
                &.facebook{
                    span, svg{
                        color: #3B5998;
                    }
                }
                &.twitter{
                    span, svg{
                        color: #1DA1F2;
                    }
                }
                &.dribble{
                    span, svg{
                        color: #C2185B;
                    }
                }
                &.instagram{
                    span, svg{
                        color: #FF0300;
                    }
                }
            }
        }
    }

`,n=o.ZP.div`
    .cover-image{
        position: relative;
        .ant-upload-select{
            position: absolute;
            ${({theme:e})=>e.rtl?"left":"right"}: 20px;
            top: 20px;
            border: 1px solid #ffffff50;
            border-radius: 6px;
            @media only screen and (max-width: 991px){
                top: 50%;
                ${({theme:e})=>e.rtl?"left":"right"}: auto;
                left: 50%;
                transform: translate(-50%,-50%);
            }
            a{
                color: #fff;
                padding: 8px 17.35px;
                display: inline-flex;
                align-items: center;
                @media only screen and (max-width: 479px){
                    padding: 5px 10px;
                }
                i,
                svg,
                img
                {
                    ${({theme:e})=>e.rtl?"margin-left":"margin-right"}: 8px;
                }
                svg{
                    color:#fff;
                }
            }
        }
        .ant-upload-list {
            display: none;
        }
    }
    .coverWrapper{
        position: relative;
        z-index: 1;
        margin-bottom: 25px;
        background-color: #fff;
        border-radius: 0 0 10px 10px;
        nav{
            padding: 0 25px;
            ul{
                margin: 0;
                @media only screen and (max-width: 375px){
                    text-align: center;
                    padding: 10px 0;
                }
                li{
                    display: inline-block;
                    @media only screen and (max-width: 375px){
                        display: block;
                    }
                    &:not(:last-child){
                        ${({theme:e})=>e.rtl?"margin-left":"margin-right"}: 22px;
                        @media only screen and (max-width: 375px){
                            ${({theme:e})=>e.rtl?"margin-left":"margin-right"}: 0;
                        }
                    }
                    a{
                        position: relative;
                        display: block;
                        padding: 20px 5px;
                        color: ${({theme:e})=>e["light-color"]};
                        @media only screen and (max-width: 375px){
                            padding: 10px 5px;
                        }
                        &:after{
                            position: absolute;
                            ${({theme:e})=>e.rtl?"right":"left"}: 0;
                            bottom: 0;
                            width: 100%;
                            height: 1.5px;
                            content: '';
                            opacity: 0;
                            visibility: hidden;
                            background-color: ${({theme:e})=>e["primary-color"]};
                            @media only screen and (max-width: 375px){
                                display: none;
                            }
                        }
                        &.active{
                            font-weight: 500;
                            color: ${({theme:e})=>e["primary-color"]};
                            &:after{
                                opacity: 1;
                                visibility: visible;
                            }
                        }
                    }
                }
            }
        }

    }
    .setting-card-title{
        @media only screen and (max-width: 479px){
            text-align: center;
        }
        h1,
        h2,
        h3,
        h4,
        h5,
        h6{
            margin-bottom: 0;
            font-size: 16px;
            font-weight: 500;
        }
        span{
            font-size: 13px;
            font-weight: 400;
            margin: 0;
            color: ${({theme:e})=>e["light-color"]};
        }
    }
`,i=o.ZP.div`
    .ant-card-head{
        .btn-seeAll{
            font-size: 13px;
            font-weight: 500;
            color: ${({theme:e})=>e["primary-color"]};
        }
    }
    .ant-card-body{
        padding: 0 0 25px !important;
        ul{
            margin: 0;
            padding: 0;

            li{
                display: flex;
                align-items: center;
                justify-content: space-between;
                padding: 20px 25px;
                cursor: pointer;

                &:hover{
                    box-shadow: 0 15px 50px #9299B820;
                }

                div{
                    display: flex;
                    img{
                        width: 46px;
                        height: 46px;
                        ${({theme:e})=>e.rtl?"margin-left":"margin-right"}: 10px;
                        border-radius: 50%;
                    }
                    p{
                        margin: 0;
                        padding: 0;
                        span{
                            display: block;
                        }
                    }
                }
            }
            .btn-loadMore{
                display: inline-block;
                margin-top: 10px;
                font-size: 13px;
                font-weight: 500;
                padding: 0 25px;
            }
        }
    }
    .ff-widget{
        li{
            @media only screen and (max-width: 1599px){
                flex-flow: column;
                padding: 20px !important;
                align-items: flex-start !important;
            }
            .ff-info{
                @media only screen and (max-width: 1199px){
                    flex-flow: column;
                }
                @media only screen and (max-width: 767px){
                    flex-flow: row;
                }
                p{
                    font-size: 14px;
                    font-weight: 600;
                    color: ${({theme:e})=>e["dark-color"]};
                    @media only screen and (max-width: 1199px){
                        margin-top: 12px;
                    }
                    @media only screen and (max-width: 767px){
                        margin-top: 0;
                    }
                    span{
                        margin-top: 3px;
                        font-weight: 400;
                        color: ${({theme:e})=>e["light-color"]};
                    }
                }
            }
            .btn-ff{
                font-size: 12px;
                font-weight: 500;
                padding: 0 12.88px;
                height: 32px;
                @media only screen and (max-width: 1599px){
                    margin-top: 15px;
                }
                svg,
                i,
                img{
                    ${({theme:e})=>e.rtl?"margin-left":"margin-right"}: 6px;
                }
                span{
                    display: flex;
                    align-items: center;
                }
            }
        }
        .btn-following {
            border: 1px solid;
        }
    }
    .widget-photo-list,
    .widget-video-list{
        padding: 20px 25px 0;
        .ant-row{
            margin: -4px 0;
            .ant-col{
                margin: 4px 0;
            }
        }
        img{
            max-width: 103px;
            border-radius: 6px;
        }
    }

    .widget-video-list{
        .video{
            display: inline-block;
            position: relative;
            z-index: 4;
            &:after{
                position: absolute;
                ${({theme:e})=>e.rtl?"right":"left"}: 0;
                top: 0;
                width: 100%;
                height: 100%;
                content: '';
                border-radius: 6px;
                background-color: ${({theme:e})=>e["dark-color"]}20;
            }
            span{
                width: 30px;
                height: 30px;
                border-radius: 50%;
                display: flex;
                align-items: center;
                justify-content: center;
                position: absolute;
                top: 50%;
                left: 50%;
                transform: translate(-50%,-50%);
                z-index: 5;
                background-color: ${({theme:e})=>e["dark-color"]}60;
                svg,
                img,
                i{
                    width: 14px;
                    color: #fff;
                }
            }
        }
    }
`,l=o.ZP.div`
    .ant-card-body{
        padding: 25px 0 !important;
    }
    .activity-list{
        margin: 0;
        .activity-list__single{
            padding: 12px 25px;
            display: flex;
            align-items: center;
            .activity-icon{
                width: 31px;
                height: 31px;
                border-radius: 50%;
                display: flex;
                justify-content: center;
                align-items: center;
                background-color: #00000015;
                ${({theme:e})=>e.rtl?"margin-left":"margin-right"}: 15px;
                &.primary{
                    background-color: ${({theme:e})=>e["primary-color"]}15;
                    color: ${({theme:e})=>e["primary-color"]};
                }
                &.secondary{
                    background-color: ${({theme:e})=>e["secondary-color"]}15;
                    color: ${({theme:e})=>e["secondary-color"]};
                }
                &.success{
                    background-color: ${({theme:e})=>e["success-color"]}15;
                    color: ${({theme:e})=>e["success-color"]};
                }
                &.info{
                    background-color: ${({theme:e})=>e["info-color"]}15;
                    color: ${({theme:e})=>e["info-color"]};
                }
                &.danger{
                    background-color: ${({theme:e})=>e["danger-color"]}15;
                    color: ${({theme:e})=>e["danger-color"]};
                }
                &.warning{
                    background-color: ${({theme:e})=>e["warning-color"]}15;
                    color: ${({theme:e})=>e["warning-color"]};
                }
                i{
                    line-height: 0;
                }
            }
            .more{
                visibility: hidden;
            }
            &:hover{
                box-shadow: 0 15px 50px #88888820;
                .more{
                    visibility: visible;
                }
            }
            .activity-content{
                flex: auto;
                display: flex;
                align-items: center;
                justify-content: space-between;
            }
            .activity-info{
                display: flex;
                align-items: center;
                img{
                    max-width: 40px;
                    border-radius: 50%;
                    ${({theme:e})=>e.rtl?"margin-left":"margin-right"}: 20px;
                }
                p{
                    margin-bottom: 0;
                    font-size: 14px;
                    color: ${({theme:e})=>e["gray-color"]};
                    .inline-text{
                        font-weight: 500;
                        display: inline;
                    }
                    .hour{
                        display: block;
                        margin-top: 3px;
                        color: ${({theme:e})=>e["extra-light-color"]};
                    }
                }
            }
            .activity-more{
                svg,
                i{
                    color: ${({theme:e})=>e["extra-light-color"]};
                }
            }
        }

    }
`,s=o.ZP.div`
    .ant-card-body{
        padding: 0 !important;
        .ant-table{
            border-radius: ${({theme:e})=>e.rtl?"10px 10px 0 0":"0 0 10px 10px"};
            margin-top: 1px;
        }
    }
    table{
        margin-bottom: 25px;
        .ant-table-thead > tr > th{
            background-color: #fff;
            color: ${({theme:e})=>e["dark-color"]};
            &:first-child{
                padding-${({theme:e})=>e.rtl?"right":"left"}: 25px;
            }
            &:last-child{
                text-align: ${({theme:e})=>e.rtl?"left":"right"};
                padding-${({theme:e})=>e.rtl?"left":"right"}: 25px;
            }
            &.p_name{
                min-width: 420px;
            }
            &.p_price{
                min-width: 100px;
            }
        }
        .ant-table-tbody{
            tr{
                &:hover{
                    td{
                        background-color: ${({theme:e})=>e["bg-color-light"]};
                    }
                }
                td{
                    padding: 14px 16px;
                    font-size: 14px;
                    color: ${({theme:e})=>e["gray-color"]};
                    border-color: ${({theme:e})=>e["border-color-light"]};
                    &:first-child{
                        padding-${({theme:e})=>e.rtl?"right":"left"}: 25px;
                    }
                    &:last-child{
                        padding-${({theme:e})=>e.rtl?"left":"right"}: 25px;
                        text-align: ${({theme:e})=>e.rtl?"left":"right"};
                    }
                }
            }
        }
    }
`},20176:function(e,t,a){a.r(t),a.d(t,{default:function(){return Q}});var o=a(66252);const r={class:"card-chunk"},n=(0,o._)("span",null,"Orders",-1),i={class:"growth-upward"},l=(0,o._)("span",null,"Since last week",-1),s={class:"card-chunk"},d={class:"card-chunk"},c=(0,o._)("span",null,"Revenue",-1),p={class:"growth-downward"},m=(0,o._)("span",null,"Since last week",-1),h={class:"card-chunk"},g={class:"card-chunk"},u=(0,o._)("span",null,"Avg. order value",-1),f={class:"growth-upward"},x=(0,o._)("span",null,"Since last week",-1),b={class:"card-chunk"},y={to:"#"},w=(0,o._)("span",null,"Printer",-1),v={to:"#"},k=(0,o._)("span",null,"PDF",-1),$={to:"#"},_=(0,o._)("span",null,"Google Sheets",-1),C={to:"#"},W=(0,o._)("span",null,"Excel (XLSX)",-1),S={to:"#"},z=(0,o._)("span",null,"CSV",-1),F={class:"performance-lineChart"},P={to:"#"},L=(0,o._)("span",null,"Printer",-1),A={to:"#"},B=(0,o._)("span",null,"PDF",-1),M={to:"#"},j=(0,o._)("span",null,"Google Sheets",-1),E={to:"#"},O=(0,o._)("span",null,"Excel (XLSX)",-1),T={to:"#"},R=(0,o._)("span",null,"CSV",-1);function D(e,t,a,D,J,G){const Z=(0,o.up)("sdHeading"),q=(0,o.up)("sdFeatherIcons"),I=(0,o.up)("CardBarChart2"),U=(0,o.up)("Chart"),X=(0,o.up)("EChartCard"),H=(0,o.up)("sdCards"),N=(0,o.up)("a-col"),V=(0,o.up)("sdChartContainer"),Y=(0,o.up)("PerformanceChartWrapper"),K=(0,o.up)("a-table"),Q=(0,o.up)("ProductOverviewTable"),ee=(0,o.up)("a-row");return(0,o.wg)(),(0,o.j4)(ee,{gutter:25},{default:(0,o.w5)((()=>[(0,o.Wm)(N,{xxl:8,lg:12,md:24,sm:12,xs:24},{default:(0,o.w5)((()=>[(0,o.Wm)(H,{headless:""},{default:(0,o.w5)((()=>[(0,o.Wm)(X,null,{default:(0,o.w5)((()=>[(0,o._)("div",r,[(0,o.Wm)(I,null,{default:(0,o.w5)((()=>[(0,o.Wm)(Z,{as:"h1"},{default:(0,o.w5)((()=>[(0,o.Uk)("7,461")])),_:1}),n,(0,o._)("p",null,[(0,o._)("span",i,[(0,o.Wm)(q,{type:"arrow-up"}),(0,o.Uk)(" 25% ")]),l])])),_:1})]),(0,o._)("div",s,[(0,o.Wm)(U,{labels:["Jan","Feb","Mar","Apr","May","Jun","Jul"],height:180,class:"card-chunk4",style:{marginBottom:"-5"},datasets:[{data:[20,60,50,45,50,60,70],backgroundColor:"#EFEFFE",hoverBackgroundColor:"#5F63F2",label:"Orders",barPercentage:1}],options:e.chartOptions},null,8,["options"])])])),_:1})])),_:1})])),_:1}),(0,o.Wm)(N,{xxl:8,lg:12,md:24,sm:12,xs:24},{default:(0,o.w5)((()=>[(0,o.Wm)(H,{headless:""},{default:(0,o.w5)((()=>[(0,o.Wm)(X,null,{default:(0,o.w5)((()=>[(0,o._)("div",d,[(0,o.Wm)(I,null,{default:(0,o.w5)((()=>[(0,o.Wm)(Z,{as:"h1"},{default:(0,o.w5)((()=>[(0,o.Uk)("$28,947")])),_:1}),c,(0,o._)("p",null,[(0,o._)("span",p,[(0,o.Wm)(q,{type:"arrow-down"}),(0,o.Uk)(" 25% ")]),m])])),_:1})]),(0,o._)("div",h,[(0,o.Wm)(U,{class:"cardChunk2",labels:["Jan","Feb","Mar","Apr","May","Jun","Jul"],height:180,style:{marginBottom:"-5"},datasets:[{data:[20,60,50,45,50,60,70],backgroundColor:"#FFF0F6",hoverBackgroundColor:"#FF69A5",label:"Revenue",barPercentage:1}],options:e.chartOptions},null,8,["options"])])])),_:1})])),_:1})])),_:1}),(0,o.Wm)(N,{xxl:8,lg:12,md:24,sm:12,xs:24},{default:(0,o.w5)((()=>[(0,o.Wm)(H,{headless:""},{default:(0,o.w5)((()=>[(0,o.Wm)(X,null,{default:(0,o.w5)((()=>[(0,o._)("div",g,[(0,o.Wm)(I,null,{default:(0,o.w5)((()=>[(0,o.Wm)(Z,{as:"h1"},{default:(0,o.w5)((()=>[(0,o.Uk)("$3,241")])),_:1}),u,(0,o._)("p",null,[(0,o._)("span",f,[(0,o.Wm)(q,{type:"arrow-up"}),(0,o.Uk)(" 25% ")]),x])])),_:1})]),(0,o._)("div",b,[(0,o.Wm)(U,{class:"card-chunk3",labels:["Jan","Feb","Mar","Apr","May","Jun","Jul"],height:180,style:{marginBottom:"-5"},datasets:[{data:[20,60,50,45,50,60,70],backgroundColor:"#E8FAF4",hoverBackgroundColor:"#20C997",label:"Avg Orders",barPercentage:1}],options:e.chartOptions},null,8,["options"])])])),_:1})])),_:1})])),_:1}),(0,o.Wm)(N,{xs:24},{default:(0,o.w5)((()=>[null!==e.performanceState?((0,o.wg)(),(0,o.j4)(Y,{key:0},{default:(0,o.w5)((()=>[(0,o.Wm)(H,{more:"",title:"General Statistics"},{more:(0,o.w5)((()=>[(0,o._)("a",y,[(0,o.Wm)(q,{size:"16",type:"printer"}),w]),(0,o._)("a",v,[(0,o.Wm)(q,{size:"16",type:"book-open"}),k]),(0,o._)("a",$,[(0,o.Wm)(q,{size:"16",type:"file-text"}),_]),(0,o._)("a",C,[(0,o.Wm)(q,{size:"16",type:"x"}),W]),(0,o._)("a",S,[(0,o.Wm)(q,{size:"16",type:"file"}),z])])),default:(0,o.w5)((()=>[(0,o._)("div",F,[(0,o.Wm)(V,{class:"parentContainer"},{default:(0,o.w5)((()=>[(0,o.Wm)(U,{type:"line",id:"performance",class:"performance",labels:e.performanceState.labels,datasets:e.performanceDatasets,options:e.performanceOption,height:e.height},null,8,["labels","datasets","options","height"])])),_:1})])])),_:1})])),_:1})):(0,o.kq)("",!0)])),_:1}),(0,o.Wm)(N,{xs:24},{default:(0,o.w5)((()=>[(0,o.Wm)(Q,null,{default:(0,o.w5)((()=>[(0,o.Wm)(H,{more:"",title:"My Products"},{more:(0,o.w5)((()=>[(0,o._)("a",P,[(0,o.Wm)(q,{size:"16",type:"printer"}),L]),(0,o._)("a",A,[(0,o.Wm)(q,{size:"16",type:"book-open"}),B]),(0,o._)("a",M,[(0,o.Wm)(q,{size:"16",type:"file-text"}),j]),(0,o._)("a",E,[(0,o.Wm)(q,{size:"16",type:"x"}),O]),(0,o._)("a",T,[(0,o.Wm)(q,{size:"16",type:"file"}),R])])),default:(0,o.w5)((()=>[(0,o.Wm)(K,{class:"table-responsive",pagination:!1,dataSource:e.dataSource,columns:e.columns},null,8,["dataSource","columns"])])),_:1})])),_:1})])),_:1})])),_:1})}var J=a(63430),G=a(91719),Z=a(38801),q=a(78708),I=a(33907);const U={legend:{display:!1,labels:{display:!1}},scales:{yAxes:[{stacked:!0,gridLines:{display:!1},ticks:{display:!1}}],xAxes:[{stacked:!0,gridLines:{display:!1},ticks:{display:!1}}]}},X=[{key:"1",name:"Nakuru County",price:"$280",sold:126,revenue:"$38,536"},{key:"2",name:"Half Sleeve Shirt",price:"$25",sold:80,revenue:"$38,536"},{key:"3",name:"Marco Shoes",price:"$32",sold:58,revenue:"$38,536"},{key:"4",name:'15" Mackbook Pro        ',price:"$950",sold:36,revenue:"$38,536"},{key:"5",name:"Apple iPhone X",price:"$985",sold:24,revenue:"$38,536"}],H=[{title:"Products Name",dataIndex:"name",key:"name",class:"p_name"},{title:"Price",dataIndex:"price",key:"price",class:"p_price"},{title:"Sold",dataIndex:"sold",key:"sold"},{title:"Revenue",dataIndex:"revenue",key:"revenue"}],N=(0,o.aZ)({name:"Overview",components:{CardBarChart2:G.CardBarChart2,EChartCard:G.EChartCard,PerformanceChartWrapper:G.PerformanceChartWrapper,ProductOverviewTable:J.ProductOverviewTable,Chart:q["default"]},setup(){const{state:e,dispatch:t}=(0,I.oR)(),a=(0,o.Fl)((()=>e.chartContent.performanceData));(0,o.bv)((()=>t("performanceGetData")));const r=(0,o.Fl)((()=>null!==a.value&&[{data:a.value.users[1],borderColor:"#5F63F2",borderWidth:4,fill:!0,backgroundColor:()=>(0,Z.chartLinearGradient)(document.getElementById("performance"),300,{start:"#5F63F230",end:"#ffffff05"}),label:"Revenue",pointStyle:"circle",pointRadius:"0",hoverRadius:"9",pointBorderColor:"#fff",pointBackgroundColor:"#5F63F2",hoverBorderWidth:5}])),n={maintainAspectRatio:!0,elements:{z:9999},legend:{display:!1},hover:{mode:"index",intersect:!1},tooltips:{mode:"label",intersect:!1,backgroundColor:"#ffffff",position:"average",enabled:!1,custom:Z.customTooltips,callbacks:{title(){return"General Statistics"},label(e,t){const{yLabel:a,datasetIndex:o}=e;return`<span class="chart-data">${a}k</span> <span class="data-label">${t.datasets[o].label}</span>`}}},scales:{yAxes:[{gridLines:{color:"#e5e9f2",borderDash:[3,3],zeroLineColor:"#e5e9f2",zeroLineWidth:1,zeroLineBorderDash:[3,3]},ticks:{beginAtZero:!0,fontSize:13,fontColor:"#182b49",max:80,stepSize:20,callback(e){return`${e}k`}}}],xAxes:[{gridLines:{display:!0,zeroLineWidth:2,zeroLineColor:"transparent",color:"transparent",z:1,tickMarkLength:0},ticks:{padding:10}}]}};return{performanceState:a,chartOptions:U,dataSource:X,columns:H,performanceDatasets:r,customTooltips:Z.customTooltips,height:window.innerWidth<=575?200:86,performanceOption:n}}});var V=N,Y=a(83744);const K=(0,Y.Z)(V,[["render",D]]);var Q=K}}]);
//# sourceMappingURL=overview.88ada9cc.js.map