"use strict";(self["webpackChunkMassNetCampaign"]=self["webpackChunkMassNetCampaign"]||[]).push([[9276],{53295:function(n,t,e){e.r(t),e.d(t,{BannerCardWrap:function(){return s},BannerCarouselWrap:function(){return u},BannerCtaWrap:function(){return x},BannerLongWrap:function(){return d},BannerNormal:function(){return p},BannerWrapper:function(){return m},Figure2:function(){return r},Figure3:function(){return i},Figure6:function(){return o},Figure7:function(){return l}});var a=e(23481);const r=a.ZP.figure`
    position: relative;
    padding: 20px 0px 30px;
    margin-bottom: 0;
    img {
        position: absolute;
        bottom : -15px;
        right : 0;
        ${({theme:n})=>n.rtl?"left":"right"}: 0;
    }
    figcaption{
        h2{
            font-size: 30px;
            font-weight: 600;
            color: #fff;
            margin-bottom: 14px;
        }
        p{
            font-size: 15px;
            opacity: .7;
            color: #fff;
        }
        button{
            margin-top: 26px;
            color: ${({theme:n})=>n["primary-color"]} !important;
            &:focus{
                background-color: #fff !important;
            }
            &.ant-btn-lg{
                height: 44px;
                font-size: 15px;
                font-weight: 500;
            }
        }
    }
`,i=a.ZP.figure`
    position: relative;
    min-height: 180px;
    margin-bottom: 0;
    padding: 18px 0 0;
    &.theme-wide{
        padding: 0;
        min-height: 100%;
        width: 100%;
        figcaption{
            h2{
                font-size: 24px;
                font-weight: 600;
                margin-bottom: 12px;
            }
            p{
                margin-bottom: 18px;
            }
        }
    }
    &.theme-3{
        padding: 0px 0 30px;
        img{
            bottom: -55px;
        }
        figcaption{
            h2{
                margin-bottom: 10px;
            }
            p{
                margin-bottom: 18px;
            }
        }
    }
    h2{
        font-size: 30px;
        font-weight: 600;
        color: #fff;
        margin-bottom: 25px;
    }
    p{
        color: #fff;
        opacity: .7;
    }
    img {
        position: absolute;
        bottom: -65px;
        ${({theme:n})=>n.rtl?"left":"right"}: -25px;
        @media only screen and (max-width: 1599px){
            max-width: 150px;
        }
    }
    button{
        color: ${({theme:n})=>n["primary-color"]} !important;
        &:focus{
            background-color: #fff !important;
        }
        &.ant-btn-lg{
            height: 44px;
            font-size: 15px;
            font-weight: 500;
        }
    }
`,o=a.ZP.figure`
    position: relative;
    margin-bottom: 0;
    direction: ${({theme:n})=>n.rtl?"rtl":"ltr"};
    figcaption{
        h2{
            font-size: 22px;
            font-weight: 600;
            color: #FF4D4F;
            margin: 15px 0 18px;
        }
    }

`,l=a.ZP.figure`
    display: flex;
    margin-bottom: 0;
    align-items: center;
    @media only screen and (max-width: 575px){
        flex-direction: column;
    }
    img{
        @media only screen and (max-width: 575px){
            margin-bottom: 15px;
        }
    }
    figcaption{
        @media only screen and (max-width: 575px){
            text-align: center;
            margin-left: 0px;
        }
    }
`,m=a.ZP.figure`
    .ant-card{
        margin-bottom: 70px !important;
        @media only screen and (max-width: 1199px){
            margin-bottom: 50px !important;
        }
        @media only screen and (max-width: 991px){
            margin-bottom: 30px !important;
        }
    }
`,p=a.ZP.div`
    .ant-card{
        margin-bottom: 70px !important;
        box-shadow: 0 5px 20px ${({theme:n})=>n["dark-color"]}15;
        @media only screen and (max-width: 1199px){
            margin-bottom: 50px !important;
        }
        @media only screen and (max-width: 991px){
            margin-bottom: 30px !important;
        }
    }
    .ant-card-body{
        padding: 35px 30px 46px !important;
    }
    h2{
        font-size: 30px;
        font-weight: 600;
        margin-bottom: 12px;
        color: ${({theme:n})=>n["dark-color"]};
    }
    p{
        font-size: 15px;
        font-weight: 400;
        margin-bottom: 18px;
        line-height: 1.667;
        color: ${({theme:n})=>n["gray-color"]};
    }
    .ant-btn{
        height: 38px;
    }
    &.theme-wide{
        .ant-card-body{
            padding: 50px 25px 50px 0 !important;
            padding: ${({theme:n})=>n.rtl?"50px 25px 50px 25px":"50px 25px 50px 0"}!important;
        }
        figcaption{
            ${({theme:n})=>n.rtl?"margin-right":"margin-left"}: 18px;
            h2{
                font-size: 23px;
                font-weight: 600;
                margin-bottom: 8px;
            }
            .ant-btn-lg{
                padding: 0 16.24px;
                font-size: 15px;
                height: 44px;
            }
        }
    }
`,u=a.ZP.div`
    margin-bottom: 70px;
    border-radius: 10px;
    padding: 60px 0 105px;
    background-color: ${({theme:n})=>n["primary-color"]};
    @media only screen and (max-width: 1199px){
        margin-bottom: 50px !important;
    }
    @media only screen and (max-width: 991px){
        margin-bottom: 30px !important;
    }
    .ant-carousel{
        .slick-dots{
            &.slick-dots-bottom{
                bottom: -35px;
            }
            li{
                width: auto;
                &.slick-active{
                    width: auto;
                }
                button{
                    width: 5px;
                    height: 5px;
                    border-radius: 50%;
                }
            }
        }
    }
    .banner-signle{
        display: flex !important;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        .banner-single__content{
            margin-top: 28px;
            text-align: center;
            h3{
                font-size: 24px;
                font-weight: 600;
                color: #fff;
                margin-bottom: 8px;
            }
            p{
                font-size: 15px;
                color: #fff;
                &:last-child{
                    margin-bottom: 0;
                }
            }
        }
    }
`,d=a.ZP.div`
    margin-bottom: 70px;
    @media only screen and (max-width: 1199px){
        margin-bottom: 50px !important;
    }
    @media only screen and (max-width: 991px){
        margin-bottom: 30px !important;
    }
    .banner-long-inner{
        padding: 30px 0;
        text-align: center;
        border-radius: 10px;
        background-color: #fff;
        h2{
            font-size: 22px;
            font-weight: 600;
            margin-bottom: 28px;
        }
    }
`,s=a.ZP.div`
    position: relative
    margin-bottom:
    @media only screen and (max-width: 1199px){
        margin-bottom: 50px !important;
    }
    @media only screen and (max-width: 991px){
        margin-bottom: 30px !important;
    }
    h2{
        font-size: 30px;
        font-weight: 600;
        color: #fff;
        margin-bottom: 20px;
    }
    .banner-card-inner{
        background-size: cover;
        background-repeat: no-repeat;
        background-position: center bottom;
        min-height: 450px;
        padding: 38px 40px 40px 40px;
        border-radius: 10px;
        @media only screen and (max-width: 575px){
            padding: 28px 30px 30px 30px;
        }
        &.theme-2{
            h2{
                margin-bottom: 18px;
            }
            p{
                font-size: 15px;
                color: #fff;
                opacity: .70;
                max-width: 290px;
                margin-bottom: 20px;
            }
            img{
                max-width: 285px;
            }
        }
        button{
            height: 44px;
            font-size: 15px;
            font-weight: 500;
            color: ${({theme:n})=>n["primary-color"]} !important;
        }
        img{
            position: absolute;
            bottom: 0;
            max-width: 460px;
            ${({theme:n})=>n.rtl?"left":"right"}: 0;
        }
    }
`,x=a.ZP.div`
    border-radius: 10px;
    margin-bottom: 30px;
    .banner-cta{
        min-height: 224px;
        justify-content: flex-end;
        background-size: cover;
        background-repeat: no-repeat;
        background-position: left;
        border-radius: 10px;
        @media only screen and (max-width: 1599px){
            margin-top: 30px;
        }
        @media only screen and (max-width: 575px){
            background-position: center;
        }
        .banner-cta__content{
            text-align: center;
            margin-top: -8px;
            padding: ${({theme:n})=>n.rtl?"30px 0px 30px 30px":"30px 30px 30px 0px"};
            h2{
                font-size: 30px;
                font-weight: 600;
            }
            button{
                margin-top: 10px;
                height: 44px;
            }
        }
        &.theme-2{
            justify-content: flex-start;
            background-position: right;
            @media only screen and (max-width: 575px){
                background-position: center;
            }
            .banner-cta__content{
                padding: ${({theme:n})=>n.rtl?"30px 30px 30px 0px":"30px 0px 30px 30px"};
                text-align: ${({theme:n})=>n.rtl?"right":"left"}
                h2{
                    margin-bottom: 10px;
                }
                p{
                    font-size: 15px;
                    opacity: .70;
                }
            }
        }
    }
`},88732:function(n,t,e){e.r(t),e.d(t,{Banner1:function(){return i},Banner2:function(){return o},Banner3:function(){return l},Banner4:function(){return m},Banner5:function(){return p},Banner6:function(){return u},Banner7:function(){return d},BannerCard:function(){return g},BannerCard2:function(){return c},BannerCarousel:function(){return s},BannerCta:function(){return f},BannerCta2:function(){return h},BannerLong:function(){return x},default:function(){return B}});var a=e(66252),r=e(53295);const i=(0,a.aZ)({name:"Banner1",render(){return(0,a.Wm)(r.BannerNormal,null,{default:()=>[(0,a.Wm)((0,a.up)("sdCards"),{headless:!0,bodyStyle:{minHeight:"270px"}},{default:()=>[(0,a.Wm)("h2",null,[(0,a.Uk)("15 Days Free Trail")]),(0,a.Wm)("p",null,[(0,a.Uk)("Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut")]),(0,a.Wm)((0,a.up)("sdButton"),{class:"btn-outlined",size:"small",outlined:!0,type:"primary"},{default:()=>[(0,a.Uk)("Start")]})]})]})}}),o=()=>(0,a.Wm)(r.BannerWrapper,null,{default:()=>[(0,a.Wm)((0,a.up)("sdCards"),{class:"mb-70",bodyStyle:{background:"#5F63F2",borderRadius:"10px",minHeight:"270px"},headless:!0},{default:()=>[(0,a.Wm)(r.Figure2,null,{default:()=>[(0,a.Wm)("img",{src:e(37814),alt:""},null),(0,a.Wm)("figcaption",null,[(0,a.Wm)("h2",null,[(0,a.Uk)("Upgrade your plan")]),(0,a.Wm)("p",null,[(0,a.Uk)("Lorem ipsum dolor sit amet")]),(0,a.Wm)((0,a.up)("sdButton"),{size:"large",type:"white"},{default:()=>[(0,a.Uk)("Upgrade")]})])]})]})]}),l=()=>(0,a.Wm)(r.BannerWrapper,null,{default:()=>[(0,a.Wm)((0,a.up)("sdCards"),{bodyStyle:{borderRadius:"10px",minHeight:"270px",background:"#5F63F2"},headless:!0},{default:()=>[(0,a.Wm)(r.Figure3,null,{default:()=>[(0,a.Wm)("img",{src:e(48669),alt:""},null),(0,a.Wm)("figcaption",null,[(0,a.Wm)("h2",null,[(0,a.Uk)("Earn More Money")]),(0,a.Wm)((0,a.up)("sdButton"),{size:"large",type:"white"},{default:()=>[(0,a.Uk)("Learn More")]})])]})]})]}),m=()=>(0,a.Wm)(r.BannerWrapper,null,{default:()=>[(0,a.Wm)((0,a.up)("sdCards"),{bodyStyle:{background:"#272B41",borderRadius:"10px",minHeight:"270px"},headless:!0},{default:()=>[(0,a.Wm)(r.Figure3,{class:"theme-3"},{default:()=>[(0,a.Wm)("img",{src:e(90059),alt:""},null),(0,a.Wm)("figcaption",null,[(0,a.Wm)("h2",null,[(0,a.Uk)("Win Your Bonus")]),(0,a.Wm)("p",null,[(0,a.Uk)("Weekly performance bonus")]),(0,a.Wm)((0,a.up)("sdButton"),{size:"large",type:"white"},{default:()=>[(0,a.Uk)("Learn More")]})])]})]})]}),p=()=>(0,a.Wm)(r.BannerWrapper,null,{default:()=>[(0,a.Wm)((0,a.up)("sdCards"),{bodyStyle:{background:"#5F63F2",borderRadius:"10px",minHeight:"265px",display:"flex",alignItems:"center"},headless:!0},{default:()=>[(0,a.Wm)(r.Figure3,{class:"theme-wide"},{default:()=>[(0,a.Wm)("img",{src:e(54756),alt:""},null),(0,a.Wm)("figcaption",null,[(0,a.Wm)("h2",null,[(0,a.Uk)("Congratulations Jhon!")]),(0,a.Wm)("p",null,[(0,a.Uk)("Best Seller on the last month.")]),(0,a.Wm)((0,a.up)("sdButton"),{size:"large",type:"white"},{default:()=>[(0,a.Uk)("Learn More")]})])]})]})]}),u=()=>(0,a.Wm)(r.BannerWrapper,null,{default:()=>[(0,a.Wm)((0,a.up)("sdCards"),{bodyStyle:{background:`url(${e(90082)})`,backgroundSize:"cover",borderRadius:"10px",minHeight:"265px",display:"flex",direction:"ltr",alignItems:"center"},headless:!0},{default:()=>[(0,a.Wm)(r.Figure6,null,{default:()=>[(0,a.Wm)("img",{src:e(9644),alt:""},null),(0,a.Wm)("figcaption",null,[(0,a.Wm)("h2",null,[(0,a.Uk)("Up to 50 OFF")]),(0,a.Wm)((0,a.up)("sdButton"),{class:"btn-outlined",size:"small",outlined:!0,type:"danger"},{default:()=>[(0,a.Uk)("Buy Now")]})])]})]})]}),d=()=>(0,a.Wm)(r.BannerNormal,{class:"theme-wide"},{default:()=>[(0,a.Wm)((0,a.up)("sdCards"),{headless:!0},{default:()=>[(0,a.Wm)(r.Figure7,null,{default:()=>[(0,a.Wm)("img",{src:e(8219),alt:""},null),(0,a.Wm)("figcaption",null,[(0,a.Wm)("h2",null,[(0,a.Uk)("Subscribe to our newsletter")]),(0,a.Wm)("p",null,[(0,a.Uk)("Lorem ipsum dolor sit amet, consetetur ")]),(0,a.Wm)((0,a.up)("sdButton"),{class:"btn-outlined ant-btn-lg",outlined:!0,type:"primary"},{default:()=>[(0,a.Uk)("Subscribe Now")]})])]})]})]}),s=(0,a.aZ)({name:"BannerCarousel",render(){return(0,a.Wm)(r.BannerCarouselWrap,null,{default:()=>[(0,a.Wm)((0,a.up)("a-carousel"),{autoplay:!0},{default:()=>[(0,a.Wm)("div",{class:"banner-signle"},[(0,a.Wm)("div",{class:"banner-single__img"},[(0,a.Wm)("img",{src:e(42145),alt:""},null)]),(0,a.Wm)("div",{class:"banner-single__content"},[(0,a.Wm)("h3",null,[(0,a.Uk)("Achievements")]),(0,a.Wm)("p",null,[(0,a.Uk)("Lorem ipsum dolor sit amet, consetetur sadipscing elitr.")])])]),(0,a.Wm)("div",{class:"banner-signle"},[(0,a.Wm)("div",{class:"banner-single__img"},[(0,a.Wm)("img",{src:e(42145),alt:""},null)]),(0,a.Wm)("div",{class:"banner-single__content"},[(0,a.Wm)("h3",null,[(0,a.Uk)("Achievements")]),(0,a.Wm)("p",null,[(0,a.Uk)("Lorem ipsum dolor sit amet, consetetur sadipscing elitr.")])])]),(0,a.Wm)("div",{class:"banner-signle"},[(0,a.Wm)("div",{class:"banner-single__img"},[(0,a.Wm)("img",{src:e(42145),alt:""},null)]),(0,a.Wm)("div",{class:"banner-single__content"},[(0,a.Wm)("h3",null,[(0,a.Uk)("Achievements")]),(0,a.Wm)("p",null,[(0,a.Uk)("Lorem ipsum dolor sit amet, consetetur sadipscing elitr.")])])])]})]})}}),x=()=>(0,a.Wm)(r.BannerLongWrap,null,{default:()=>[(0,a.Wm)("div",{class:"banner-long-inner"},[(0,a.Wm)("h2",null,[(0,a.Uk)("Up To Date ")]),(0,a.Wm)("img",{src:e(10211),alt:""},null)])]}),g=()=>(0,a.Wm)(r.BannerCardWrap,null,{default:()=>[(0,a.Wm)("div",{class:"banner-card-inner",style:{backgroundImage:`url("${e(78050)}")`}},[(0,a.Wm)("h2",null,[(0,a.Uk)("Need More Space?")]),(0,a.Wm)((0,a.up)("sdButton"),{size:"large",type:"white"},{default:()=>[(0,a.Uk)("Buy Storage")]})])]}),c=()=>(0,a.Wm)(r.BannerCardWrap,null,{default:()=>[(0,a.Wm)("div",{class:"banner-card-inner theme-2",style:{backgroundImage:`url("${e(29653)}")`}},[(0,a.Wm)("h2",null,[(0,a.Uk)("Create Sale Report")]),(0,a.Wm)("p",null,[(0,a.Uk)("Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy")]),(0,a.Wm)((0,a.up)("sdButton"),{size:"large",type:"white"},{default:()=>[(0,a.Uk)("Learn More")]})])]}),f=()=>(0,a.Wm)(r.BannerCtaWrap,null,{default:()=>[(0,a.Wm)("div",{class:"banner-cta align-center-v",style:{backgroundImage:`url("${e(73233)}")`}},[(0,a.Wm)("div",{class:"banner-cta__content"},[(0,a.Wm)("h2",null,[(0,a.Uk)("Dedicated Support")]),(0,a.Wm)((0,a.up)("sdButton"),{size:"large",type:"primary"},{default:()=>[(0,a.Uk)("Learn More")]})])])]}),h=()=>(0,a.Wm)(r.BannerCtaWrap,null,{default:()=>[(0,a.Wm)("div",{class:"banner-cta align-center-v theme-2",style:{backgroundImage:`url("${e(24426)}")`}},[(0,a.Wm)("div",{class:"banner-cta__content"},[(0,a.Wm)("h2",null,[(0,a.Uk)("Welcome Back Garry Sobars!")]),(0,a.Wm)("p",null,[(0,a.Uk)("Lorem ipsum dolor amet, consetetur sadipscing elitr sed diam ")]),(0,a.Wm)((0,a.up)("sdButton"),{size:"large",type:"white"},{default:()=>[(0,a.Uk)("Learn More")]})])])]});var W=i;const b=W;var B=b},89847:function(n,t,e){e.r(t),e.d(t,{default:function(){return d}});var a=e(66252);const r={class:"page-header-actions"};function i(n,t,e,i,o,l){const m=(0,a.up)("sdCalendarButton"),p=(0,a.up)("sdExportButton"),u=(0,a.up)("sdShareButton"),d=(0,a.up)("sdFeatherIcons"),s=(0,a.up)("sdButton"),x=(0,a.up)("sdPageHeader"),g=(0,a.up)("Banner1"),c=(0,a.up)("a-col"),f=(0,a.up)("Banner2"),h=(0,a.up)("Banner3"),W=(0,a.up)("Banner4"),b=(0,a.up)("Banner5"),B=(0,a.up)("Banner6"),w=(0,a.up)("Banner7"),y=(0,a.up)("a-row"),k=(0,a.up)("BannerCarousel"),v=(0,a.up)("BannerLong"),C=(0,a.up)("BannerCard"),_=(0,a.up)("BannerCard2"),U=(0,a.up)("BannerCta"),z=(0,a.up)("BannerCta2"),F=(0,a.up)("Main");return(0,a.wg)(),(0,a.iD)("div",null,[(0,a.Wm)(x,{title:"Banners"},{buttons:(0,a.w5)((()=>[(0,a._)("div",r,[(0,a.Wm)(m),(0,a.Wm)(p),(0,a.Wm)(u),(0,a.Wm)(s,{size:"small",type:"primary"},{default:(0,a.w5)((()=>[(0,a.Wm)(d,{type:"plus",size:"14"}),(0,a.Uk)(" Add New ")])),_:1})])])),_:1}),(0,a.Wm)(F,null,{default:(0,a.w5)((()=>[(0,a.Wm)(y,{gutter:25},{default:(0,a.w5)((()=>[(0,a.Wm)(c,{xxl:6,xl:12,lg:12,sm:24,xs:24},{default:(0,a.w5)((()=>[(0,a.Wm)(g)])),_:1}),(0,a.Wm)(c,{xxl:6,xl:12,lg:12,sm:24,xs:24},{default:(0,a.w5)((()=>[(0,a.Wm)(f)])),_:1}),(0,a.Wm)(c,{xxl:6,xl:12,lg:12,sm:24,xs:24},{default:(0,a.w5)((()=>[(0,a.Wm)(h)])),_:1}),(0,a.Wm)(c,{xxl:6,xl:12,lg:12,sm:24,xs:24},{default:(0,a.w5)((()=>[(0,a.Wm)(W)])),_:1}),(0,a.Wm)(c,{xxl:8,xl:12,lg:12,sm:24,xs:24},{default:(0,a.w5)((()=>[(0,a.Wm)(b)])),_:1}),(0,a.Wm)(c,{xxl:8,xl:12,lg:12,sm:24,xs:24},{default:(0,a.w5)((()=>[(0,a.Wm)(B)])),_:1}),(0,a.Wm)(c,{xxl:8,xl:12,lg:12,sm:24,xs:24},{default:(0,a.w5)((()=>[(0,a.Wm)(w)])),_:1})])),_:1}),(0,a.Wm)(y,{gutter:25},{default:(0,a.w5)((()=>[(0,a.Wm)(c,{xxl:4,xl:12,lg:12,sm:24,xs:24},{default:(0,a.w5)((()=>[(0,a.Wm)(k)])),_:1}),(0,a.Wm)(c,{xxl:4,xl:12,lg:12,sm:24,xs:24},{default:(0,a.w5)((()=>[(0,a.Wm)(v)])),_:1}),(0,a.Wm)(c,{xxl:8,md:12,xs:24},{default:(0,a.w5)((()=>[(0,a.Wm)(C)])),_:1}),(0,a.Wm)(c,{xxl:8,md:12,xs:24},{default:(0,a.w5)((()=>[(0,a.Wm)(_)])),_:1})])),_:1}),(0,a.Wm)(y,{gutter:25},{default:(0,a.w5)((()=>[(0,a.Wm)(c,{xxl:12,xs:24},{default:(0,a.w5)((()=>[(0,a.Wm)(U)])),_:1}),(0,a.Wm)(c,{xxl:12,xs:24},{default:(0,a.w5)((()=>[(0,a.Wm)(z)])),_:1})])),_:1})])),_:1})])}var o=e(72984),l=e(88732),m=(0,a.aZ)({name:"Sidebar",components:{Main:o.Main,Banner1:l.Banner1,Banner2:l.Banner2,Banner3:l.Banner3,Banner4:l.Banner4,Banner5:l.Banner5,Banner6:l.Banner6,Banner7:l.Banner7,BannerCarousel:l.BannerCarousel,BannerLong:l.BannerLong,BannerCard:l.BannerCard,BannerCard2:l.BannerCard2,BannerCta:l.BannerCta,BannerCta2:l.BannerCta2},data(){return{}}}),p=e(83744);const u=(0,p.Z)(m,[["render",i]]);var d=u}}]);
//# sourceMappingURL=Banners.7154c8a6.js.map