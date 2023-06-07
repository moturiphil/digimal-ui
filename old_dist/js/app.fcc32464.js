(function(){"use strict";var e={14351:function(e,t,a){a.d(t,{$:function(){return W},r:function(){return N}});const i="#5F63F2",o="#4347D9",n="#FF69A5",r="#E34A87",l="#1890ff",s="#0D79DF",d="rgba(0, 0, 0, 0.85)",c="#20C997",m="#0CAB7C",p="#FA8B0C",g="#D47407",u="#f5222d",h="#E30D0F",x="#2C99FF",f="#0D79DF",b="#272B41",y="#131623",w="#5A5F7D",v="#363A51",k="#9299B8",$="#e2e6ea",A="#ffffff",P="#5A5F7D",D="#5A5F7D",S="#ADB4D2",E="#FF4D4F",B="#E30D0F",C="#F1F2F6",L="#E3E6EF",I="#C6D0DC",_="#EFF0F3",U="#F8F9FB",Z="#F4F5F7",F="##22C997",j="rgba(95,99,242,0.2)",z="#9299b8",R="#F63178",M="48px",T="36px",O="29px",N={"primary-color":i,"primary-hover":o,"secondary-color":n,"secondary-hover":r,"link-color":l,"link-hover":s,"success-color":c,"success-hover":m,"warning-color":p,"warning-hover":g,"error-color":u,"error-hover":h,"info-color":x,"info-hover":f,"dark-color":b,"dark-hover":y,"gray-color":w,"gray-hover":v,"light-color":k,"light-hover":$,"white-color":A,"white-hover":D,white:A,black:"#000",pink:R,"dash-color":P,"dash-hover":v,"extra-light-color":S,"danger-color":E,"danger-hover":B,"font-family":"'Inter', sans-serif","font-size-base":"14px","heading-color":d,"text-color":b,"text-color-secondary":w,"disabled-color":"rgba(0, 0, 0, 0.25)","border-radius-base":"4px","border-color-base":"#d9d9d9","box-shadow-base":"0 2px 8px rgba(0, 0, 0, 0.15)","border-color-light":C,"border-color-normal":L,"border-color-deep":I,"bg-color-light":U,"bg-color-normal":Z,"bg-color-deep":_,"light-gray-color":F,"gray-solid":z,"btn-height-large":M,"btn-height-small":T,"btn-height-extra-small":O,"btn-default-color":b,"card-head-background":"#ffffff","card-head-color":b,"card-background":"#ffffff","card-head-padding":"16px","card-padding-base":"12px","card-radius":"10px","card-shadow":"0 5px 20px rgba(146,153,184,0.03)","layout-body-background":"#F4F5F7","layout-header-background":"#ffffff","layout-footer-background":"#fafafa","layout-header-height":"64px","layout-header-padding":"0 15px","layout-footer-padding":"24px 15px","layout-sider-background":"#ffffff","layout-trigger-height":"48px","layout-trigger-background":"#002140","layout-trigger-color":"#fff","layout-zero-trigger-width":"36px","layout-zero-trigger-height":"42px","layout-sider-background-light":"#fff","layout-trigger-background-light":"#fff","layout-trigger-color-light":"rgba(0, 0, 0, 0.65)","page-header-padding":"24px","page-header-padding-vertical":"16px","page-header-padding-breadcrumb":"12px","page-header-back-color":"#000","page-header-ghost-bg":"inherit","popover-color":b,"alert-success-border-color":c,"alert-success-bg-color":c+15,"alert-error-bg-color":u+15,"alert-warning-bg-color":p+15,"alert-info-bg-color":x+15,"radio-button-checked-bg":i,"grid-gutter-width":25,"skeleton-color":C,"slider-rail-background-color":j,"slider-rail-background-color-hover":j,"slider-track-background-color":i,"slider-track-background-color-hover":i,"slider-handle-color":i,"slider-handle-size":"16px","input-height-base":"48px","input-border-color":L,"input-height-sm":"30px","input-height-lg":"50px","rate-star-color":p,"rate-star-size":"13px","switch-min-width":"30px","switch-sm-min-width":"30px","switch-height":"18px","switch-sm-height":"15px","result-title-font-size":"20px","result-subtitle-font-size":"12px","result-icon-font-size":"50px","tabs-horizontal-padding":"12px 15px","tabs-horizontal-margin":"0","list-item-padding":"10px 24px","tag-default-bg":"#EFF0F3","tag-default-color":b,"tag-font-size":"11px"},W={...N,"primary-color":"green",backgroundColor:"#000"}},57215:function(e,t,a){var i=a(49963),o=a(66252);const n={key:0,class:"spin"},r={class:"spin"};function l(e,t,a,i,l,s){const d=(0,o.up)("a-spin"),c=(0,o.up)("router-view"),m=(0,o.up)("ThemeProvider");return e.isLoading?((0,o.wg)(),(0,o.iD)("div",n,[(0,o.Wm)(d)])):((0,o.wg)(),(0,o.j4)(m,{key:1,theme:{...e.theme,rtl:e.rtl,topMenu:e.topMenu,darkMode:e.darkMode}},{default:(0,o.w5)((()=>[((0,o.wg)(),(0,o.j4)(o.n4,null,{default:(0,o.w5)((()=>[(0,o.Wm)(c)])),fallback:(0,o.w5)((()=>[(0,o._)("div",r,[(0,o.Wm)(d)])])),_:1}))])),_:1},8,["theme"]))}var s=a(23481),d=a(14351),c=a(33907),m=(0,o.aZ)({name:"App",components:{ThemeProvider:s.f6},setup(){const{state:e,dispatch:t}=(0,c.oR)(),a=(0,o.Fl)((()=>e.themeLayout.rtlData)),i=(0,o.Fl)((()=>e.themeLayout.loading)),n=(0,o.Fl)((()=>e.themeLayout.data)),r=(0,o.Fl)((()=>e.themeLayout.topMenu)),l=(0,o.Fl)((()=>e.firebase.loading));return(0,o.bv)((()=>{t("firebaseAuthGetUid")})),{theme:d.r,rtl:a,darkMode:n,topMenu:r,isLoading:i,isFbAuthLoading:l}}}),p=a(83744);const g=(0,p.Z)(m,[["render",l]]);var u=g;const h=(0,i.ri)(u);var x=h,f=a(22201),b=[],y=[],w=[{path:"/components",name:"components",component:()=>a.e(160).then(a.bind(a,5792)),children:[]}],v=[{name:"net-distribution",path:"/nets",component:()=>a.e(388).then(a.bind(a,51554)),children:[{name:"distribution",path:"distribution",component:()=>a.e(80).then(a.bind(a,22402))},{name:"delivered",path:"delivered",component:()=>a.e(80).then(a.bind(a,73975))},{name:"post-create",path:"post-create",component:()=>a.e(80).then(a.bind(a,12185))},{name:"receive-nets",path:"receive-nets",component:()=>a.e(80).then(a.bind(a,52176))},{name:"distribution-point",path:"distribution-point",component:()=>a.e(80).then(a.bind(a,92573))},{name:"distribution-points",path:"distribution-points",component:()=>a.e(80).then(a.bind(a,49945))},{name:"distribution-point-nets",path:"distribution-point-nets",component:()=>a.e(80).then(a.bind(a,72006))},{name:"drop-off",path:"drop-off",component:()=>a.e(80).then(a.bind(a,60209))}]},{name:"hh-nets-distributed",path:"hh-nets-distributed",component:()=>a.e(80).then(a.bind(a,48845))},{name:"receive-nets/",path:"receive-nets",component:()=>a.e(80).then(a.bind(a,73038))},{name:"house-holds",path:"households",component:()=>a.e(388).then(a.bind(a,51554)),children:[{name:"list",path:"list",component:()=>a.e(80).then(a.bind(a,56537))},{name:"chv",path:"chv",component:()=>a.e(80).then(a.bind(a,39687))}]},{name:"import-export",path:"/users",component:()=>a.e(6).then(a.bind(a,63128)),children:[{name:"import",path:"import",component:()=>a.e(6).then(a.bind(a,33663))},{name:"export",path:"export",component:()=>a.e(157).then(a.bind(a,15477))}]}];const k=[{path:"/",name:"dashboard",component:()=>a.e(362).then(a.bind(a,46178)),children:[{path:"/",name:"home",component:()=>a.e(268).then(a.bind(a,96749))},{path:"registered-users",name:"registered-users",component:()=>a.e(372).then(a.bind(a,10399))},{path:"stock-status",name:"stock-status",component:()=>a.e(372).then(a.bind(a,78572))},{path:"/campaigns/view/:id",name:"campaign-details",component:()=>a.e(821).then(a.bind(a,8821))},{path:"/assign-worker/:id",name:"post-worker",component:()=>a.e(269).then(a.bind(a,71269))},{path:"/campaigns/create-campaign",name:"create-campaign",component:()=>a.e(756).then(a.bind(a,96756))},{path:"/campaigns/view-campaign",name:"view-campaigns",component:()=>a.e(255).then(a.bind(a,50255))},{path:"/events/register/:id",name:"events-register"},{path:"/event/view/:id",name:"view-event",component:()=>Promise.all([a.e(828),a.e(239)]).then(a.bind(a,10239))},{path:"/event/pending-confirmation/:id",name:"pending-confirmation-event",component:()=>Promise.all([a.e(828),a.e(938)]).then(a.bind(a,14938))},{path:"/payroll/view/:id",name:"view-payroll",component:()=>a.e(570).then(a.bind(a,60570))},{path:"/activity/breakdown/:id",name:"activity-breakdown",component:()=>a.e(876).then(a.bind(a,72876))}]},{path:"/events",name:"events",component:()=>a.e(388).then(a.bind(a,51554)),children:[{path:"event-view",name:"event-view",component:()=>a.e(66).then(a.bind(a,79501))},{path:"event-create",name:"event-create",component:()=>a.e(911).then(a.bind(a,96060))}]},{path:"/activities",name:"activities",component:()=>a.e(388).then(a.bind(a,51554)),children:[{path:"activity-view",name:"activity-view",component:()=>a.e(66).then(a.bind(a,97946))},{path:"activity-confirm",name:"activity-confirm",component:()=>a.e(66).then(a.bind(a,81635))},{path:"activity-create",name:"activity-create",component:()=>a.e(911).then(a.bind(a,25340))}]},{path:"/org-units/",name:"org-units",component:()=>a.e(388).then(a.bind(a,51554)),children:[{path:"view",name:"view",component:()=>a.e(911).then(a.bind(a,52941))},{path:"location-create",name:"location-create",component:()=>a.e(911).then(a.bind(a,70135))},{path:"sub-location-create",name:"sub-location-create",component:()=>a.e(911).then(a.bind(a,29864))},{path:"village-create",name:"village-create",component:()=>a.e(911).then(a.bind(a,93253))},{path:"/:id/sub-counties",name:"county-sub-counties",component:()=>a.e(860).then(a.bind(a,99860))},{path:"/:id/wards",name:"wards",component:()=>a.e(42).then(a.bind(a,46042))},{path:"/:id/locations",name:"locations",component:()=>a.e(447).then(a.bind(a,18447))},{path:"/:id/sub-locations",name:"sub-locations",component:()=>a.e(353).then(a.bind(a,83353))},{path:"/:id/villages",name:"villages",component:()=>a.e(754).then(a.bind(a,79754))}]},{path:"/household/validation",name:"hh-validation",component:()=>a.e(288).then(a.bind(a,33171))},{path:"/payroll",name:"payroll",component:()=>a.e(288).then(a.bind(a,52047))},...y,...b,...w,...v];var $=k;const A=[{path:"login",name:"login",component:()=>a.e(535).then(a.bind(a,97921))},{path:"set-password",name:"set-password",component:()=>a.e(76).then(a.bind(a,97321))},{path:"register",name:"register",component:()=>a.e(616).then(a.bind(a,36314))},{path:"/:a_part",redirect:e=>{const t=e.query.a_code;return{name:"register",params:{a_part:e.params.a_part},query:{a_code:t}}}},{path:"/activity-confirm/:a_part",name:"activity-register",component:()=>a.e(616).then(a.bind(a,69966))},{path:"/auth/activity-confirm",name:"activity-confirm",component:()=>a.e(966).then(a.bind(a,69966))}];var P=A,D=a(52773);const S=[{name:"Admin",path:"/",component:()=>Promise.all([a.e(356),a.e(328)]).then(a.bind(a,42630)),children:[...$],meta:{auth:!1}},{name:"Auth",path:"/auth",component:()=>Promise.all([a.e(356),a.e(818)]).then(a.bind(a,81939)),children:[...P],meta:{auth:!0}}],E=(0,f.p7)({history:(0,f.PO)({NODE_ENV:"production",VUE_APP_TINYMCE_API_KEY:"7o2468tzzaks78b3x5oeguzaqb2z8lvmrilea7aktlo0de7k",VUE_APP_PIXABAY_API_KEY:"10318573-0d69a875d",VUE_APP_FIREBASE_API_KEY:"AIzaSyCTq5eJkSFhSlJZZijxdmGwQ8dv8C1Eilk",VUE_APP_FIREBASE_MESSAGING_SENDER_ID:"230278565850",VUE_APP_FIREBASE_APP_ID:"1:230278565850:web:bde8cb518a3c9a37f83ae3",VUE_APP_FIREBASE_MEASUREMENT_ID:"G-43XQJBNN1T",VUE_APP_API_ENDPOINT:"https://demo.jsnorm.com/laravel/strikingdash-api/api/vuestore/",VUE_APP_BASE_URL:"http://41.89.92.206/massnet/api",VUE_APP_AUTH0_DOMAIN:"dev-cc7jh4vf.us.auth0.com",VUE_APP_AUTH0_CLIENT_ID:"RQE7Ri7VAgoUYhDY1zbeePKAvVwfsUDK",VUE_APP_GOOGLE_MAP_API:"AIzaSyCWLSu-IIz-TNFJ7oGbgbP7FXiW14SWk08",BASE_URL:"/"}.VUE_APP_SUB_ROUTE?{NODE_ENV:"production",VUE_APP_TINYMCE_API_KEY:"7o2468tzzaks78b3x5oeguzaqb2z8lvmrilea7aktlo0de7k",VUE_APP_PIXABAY_API_KEY:"10318573-0d69a875d",VUE_APP_FIREBASE_API_KEY:"AIzaSyCTq5eJkSFhSlJZZijxdmGwQ8dv8C1Eilk",VUE_APP_FIREBASE_MESSAGING_SENDER_ID:"230278565850",VUE_APP_FIREBASE_APP_ID:"1:230278565850:web:bde8cb518a3c9a37f83ae3",VUE_APP_FIREBASE_MEASUREMENT_ID:"G-43XQJBNN1T",VUE_APP_API_ENDPOINT:"https://demo.jsnorm.com/laravel/strikingdash-api/api/vuestore/",VUE_APP_BASE_URL:"http://41.89.92.206/massnet/api",VUE_APP_AUTH0_DOMAIN:"dev-cc7jh4vf.us.auth0.com",VUE_APP_AUTH0_CLIENT_ID:"RQE7Ri7VAgoUYhDY1zbeePKAvVwfsUDK",VUE_APP_GOOGLE_MAP_API:"AIzaSyCWLSu-IIz-TNFJ7oGbgbP7FXiW14SWk08",BASE_URL:"/"}.VUE_APP_SUB_ROUTE:"/"),linkExactActiveClass:"active",routes:S});E.beforeEach(((e,t,a)=>{D.Z||e.meta.auth||D.Z.state.auth.login?a():a({name:"login"}),window.scrollTo(0,0)}));var B=E,C=(a(33216),a(3613)),L=(a(94643),a(44648)),I=(a(80106),a(92262)),_=(a(85597),a(95146)),U=(a(93300),a(96461)),Z=(a(93589),a(61148)),F=(a(15921),a(87204)),j=(a(74457),a(30595)),z=(a(57986),a(29340)),R=(a(54346),a(97099)),M=(a(58569),a(40542)),T=(a(92591),a(41751)),O=(a(6788),a(97139)),N=(a(50460),a(31802)),W=(a(12777),a(9283)),V=(a(7283),a(40904)),J=(a(58517),a(66818)),q=(a(84575),a(97142)),G=(a(4148),a(9884)),X=(a(28633),a(9864)),Y=(a(16388),a(3107)),H=(a(84324),a(95878)),K=(a(50306),a(74889)),Q=(a(58258),a(88316)),ee=(a(87483),a(773)),te=(a(31529),a(46912)),ae=(a(83616),a(38988)),ie=(a(36969),a(88943)),oe=(a(17219),a(40885)),ne=(a(49282),a(47297)),re=(a(17198),a(59418)),le=(a(21723),a(85263)),se=(a(38770),a(47346)),de=(a(91019),a(46978)),ce=(a(5378),a(72616)),me=(a(67485),a(6723)),pe=(a(44830),a(27782)),ge=(a(20446),a(16987)),ue=(a(79861),a(48051)),he=(a(89397),a(98704)),xe=(a(7163),a(75356)),fe=(a(11838),a(6329)),be=(a(38049),a(99230)),ye=(a(88124),a(65494)),we=(a(51998),a(24871)),ve=(a(46724),a(14563)),ke=(a(63197),a(172)),$e=(a(82577),a(29937)),Ae=(a(76266),a(52245)),Pe=(a(65057),a(9179)),De=(a(80149),a(45949)),Se=(a(58856),a(69662)),Ee=(a(58293),a(45542)),Be=(a(94310),a(61446));x.config.globalProperties.$message=Be.ZP,x.use(Ee.Z),x.use(Se.Z),x.use(De.Z),x.use(Pe.ZP),x.use(Ae.ZP),x.use($e.ZP),x.use(ke.Z),x.use(ve.Z),x.use(we.Z),x.use(ye.Z),x.use(be.ZP),x.use(fe.Z),x.use(xe.ZP),x.use(he.Z),x.use(ue.ZP),x.use(ge.Z),x.use(pe.ZP),x.use(me.ZP),x.use(ce.Z),x.use(de.Z),x.use(se.ZP),x.use(le.Z),x.use(re.ZP),x.use(ne.Z),x.use(oe.Z),x.use(ie.Z),x.use(ae.ZP),x.use(te.ZP),x.use(ee.ZP),x.use(Q.Z),x.use(K.Z),x.use(H.ZP),x.use(Y.C),x.use(X.ZP),x.use(G.Z),x.use(q.ZP),x.use(J.Z),x.use(V.Z),x.use(W.ZP),x.use(N.ZP),x.use(O.Z),x.use(T.Z),x.use(M.ZP),x.use(R.ZP),x.use(z.Z),x.use(j.ZP),x.use(F.Z),x.use(ke.Z),x.use(Z.ZP),x.use(U.ZP),x.use(_.ZP),x.use(I.Z),x.use(L.ZP),x.use(C.ZP);var Ce=a(78947),Le=a(51436),Ie=a(57810);Ce.vI.add(Le.mRB),x.component("font-awesome-icon",Ie.GN);var _e=a(58662),Ue=a(64e3),Ze=a.n(Ue);x.use(Ze()),x.component("l-map",_e.iA),x.component("l-tile-layer",_e.Hw),x.component("l-marker",_e.$R),x.component("l-control-layer",_e.HF);var Fe=a(59391),je=a(36751);const ze=(0,Fe.Z)();x.config.globalProperties.emitter=ze,x.use(je.Z);var Re=a(54489),Me=a.n(Re),Te=a(1946);x.use(Me()),x.use(Te.ZP,{});var Oe=a(3577);const Ne={key:1};function We(e,t,a,i,n,r){const l=(0,o.up)("sdFeatherIcons"),s=(0,o.up)("router-link"),d=(0,o.up)("sdDropdown"),c=(0,o.up)("CardFrame"),m=(0,o.up)("sdHeading");return e.headless?((0,o.wg)(),(0,o.j4)(c,{key:1,bodypadding:e.bodypadding&&e.bodypadding,bodyStyle:e.bodyStyle&&e.bodyStyle,size:e.size,style:{width:"100%"},bordered:e.border},{title:(0,o.w5)((()=>[(0,o.WI)(e.$slots,"title")])),default:(0,o.w5)((()=>[e.title?((0,o.wg)(),(0,o.j4)(m,{key:0,as:"h4"},{default:(0,o.w5)((()=>[(0,o.Uk)((0,Oe.zw)(e.title),1)])),_:1})):(0,o.kq)("",!0),e.caption?((0,o.wg)(),(0,o.iD)("p",Ne,(0,Oe.zw)(e.caption),1)):(0,o.kq)("",!0),(0,o.WI)(e.$slots,"default")])),_:3},8,["bodypadding","bodyStyle","size","bordered"])):((0,o.wg)(),(0,o.j4)(c,{key:0,size:e.size,title:e.title,bodyStyle:e.bodyStyle&&e.bodyStyle,headStyle:e.headStyle&&e.headStyle,bordered:e.border,bodypadding:e.bodypadding&&e.bodypadding,style:{width:"100%"}},{title:(0,o.w5)((()=>[(0,o.WI)(e.$slots,"title")])),extra:(0,o.w5)((()=>[e.more?((0,o.wg)(),(0,o.j4)(d,{key:0,action:["click"],placement:"bottomRight"},{overlay:(0,o.w5)((()=>[(0,o.WI)(e.$slots,"more")])),default:(0,o.w5)((()=>[e.moreText?((0,o.wg)(),(0,o.j4)(s,{key:1,to:"#"},{default:(0,o.w5)((()=>[(0,o.Uk)("More")])),_:1})):((0,o.wg)(),(0,o.j4)(s,{key:0,to:"#"},{default:(0,o.w5)((()=>[(0,o.Wm)(l,{type:"more-horizontal",size:"24"})])),_:1}))])),_:3})):(0,o.kq)("",!0),(0,o.WI)(e.$slots,"button")])),default:(0,o.w5)((()=>[(0,o.WI)(e.$slots,"caption"),(0,o.WI)(e.$slots,"default")])),_:3},8,["size","title","bodyStyle","headStyle","bordered","bodypadding"]))}const Ve=e=>`\n    .ant-card-head {\n      display: flex;\n      justify-content: space-evenly;\n      .ant-card-head-wrapper{\n        width: 100%;\n      }\n      .ant-tabs.ant-tabs-top.ant-card-head-tabs.ant-tabs-large.ant-tabs-line{\n        width: 100%;\n        display: block;\n      }\n      .ant-tabs-nav-scroll {\n        display: flex;\n        justify-content: flex-end;\n      }\n      .ant-tabs-ink-bar.ant-tabs-ink-bar-animated {\n        display: none;\n      }\n      .ant-tabs-nav .ant-tabs-tab {\n        border-radius: 2px;\n        height: 30px;\n        margin: 0px;\n        ${e.rtl?"margin-right":"margin-left"}: -1px;\n        display: inline-flex;\n        align-items: center;\n        border: 1px solid ${e["border-color-base"]};\n        background: #fff;\n        span svg {\n          ${e.rtl?"padding-right":"padding-left"}: 5px;\n        }\n      }\n      .ant-tabs-nav .ant-tabs-tab-active {\n        font-weight: 500;\n        border: 1px solid ${e["primary-color"]};\n        background: ${e["primary-color"]};\n        color: #fff;\n        border-radius: 2px;\n        height: 30px;\n        margin: 0px;\n        display: inline-flex;\n        align-items: center;\n      }\n      .ant-tabs-bar {\n        border: none;\n      }\n      .ant-tabs-nav-wrap {\n        margin-bottom: 0px;\n        overflow: hidden;\n    }\n    }\n    .ant-card-head .ant-tabs.ant-tabs-top.ant-card-head-tabs.ant-tabs-large.ant-tabs-line {\n      width: 100%;\n      display: block;\n      justify-content: flex-end;\n      height: 73px;\n      padding-top: 8px;\n  }\n`,Je=["isbutton","bodypadding"],qe=(0,s.ZP)(H.ZP,Je)`
  ${({isbutton:e,theme:t})=>e&&Ve(t)}

  margin-bottom: 25px;
  .ant-card-head{
    border-color: #F1F2F6;
  }
  .ant-card-head .ant-card-head-title {
    padding: 16.5px 0;
    line-height: 1.4;
  }
  .ant-card-head-title .ant-page-header-heading-title{
    font-weight: 500;
  }
  .ant-card-body{
    padding: ${({bodypadding:e})=>e?`${e}`:"25px"};
    table{
      .ant-tag{
        line-height: 18px;
        border: 0 none;
        text-transform: uppercase;
        font-size: 10px;
        color: #fff;
        &.early{
          background: ${({theme:e})=>e["primary-color"]};
        }
        &.late{
          background: ${({theme:e})=>e["warning-color"]};
        }
        &.complete{
          background: ${({theme:e})=>e["success-color"]};
        }
        &.progress{
          background: ${({theme:e})=>e["danger-color"]};
        }
      }
    }
  }
  .ant-card.ant-card-bordered {
      border-radius: 4px;
      overflow: hidden;
      border: none;
  }
  .custom-label {
    font-size: 13px;
    color: #868eae;
    display: inline-flex;
    align-items: center;
  }
  .custom-label:not(:last-child) {
    ${({theme:e})=>e.rtl?" margin-left":" margin-right"} : 20px;
  }

  .custom-label span {
    width: 8px;
    height: 8px;
    border-radius: 50%;
    ${({theme:e})=>e.rtl?" margin-left":" margin-right"}: 7px;
  }


  .ant-card-extra .ant-dropdown-trigger {
    line-height: 0;
    order: 1;
    ${({theme:e})=>e.rtl?" margin-right":" margin-left"}: 20px;
  }

  .growth-downward h1 sub,
  .growth-upward h1 sub {
    font-size: 14px;
    font-weight: 600;
    bottom: 0;
    ${({theme:e})=>e.rtl?" right":" left"}: 5px;
  }

`;var Ge=a(5298),Xe=(0,o.aZ)({name:"Cards",components:{CardFrame:qe},props:{title:Ge.ZP.oneOfType([Ge.ZP.string,Ge.ZP.object,Ge.ZP.node]),size:Ge.ZP.oneOf(["default","small"]).def("default"),more:Ge.ZP.bool.def(!1),bodyStyle:Ge.ZP.object,headStyle:Ge.ZP.object,headless:Ge.ZP.bool.def(!1),border:Ge.ZP.bool.def(!1),caption:Ge.ZP.string,bodypadding:Ge.ZP.string,moreText:Ge.ZP.bool.def(!1)}});const Ye=(0,p.Z)(Xe,[["render",We]]);var He=Ye;const Ke=["innerHTML"];function Qe(e,t,a,i,n,r){return(0,o.wg)(),(0,o.iD)("i",{class:(0,Oe.C_)(e.classes),innerHTML:e.activity,style:{"line-height":"0"}},null,10,Ke)}var et=a(28508),tt=a(2262),at=(0,o.aZ)({name:"FeatherIcons",props:{type:Ge.ZP.string.def("activity"),size:Ge.ZP.oneOfType([Ge.ZP.number,Ge.ZP.string]).def(16),stroke:Ge.ZP.oneOfType([Ge.ZP.number,Ge.ZP.string]).def(2),classes:Ge.ZP.string,color:Ge.ZP.string,fill:Ge.ZP.string.def("transparent")},setup(e){const{size:t,color:a,fill:i,type:n,stroke:r,classes:l}=(0,tt.BK)(e);let s=(0,tt.iH)(et.icons[n.value].toSvg({"stroke-width":r.value,width:t.value,height:t.value,color:a.value,fill:i.value,class:l.value}));return(0,o.m0)((()=>{s.value=et.icons[n.value].toSvg({"stroke-width":r.value,width:t.value,height:t.value,color:a.value,fill:i.value})})),{activity:s}}});const it=(0,p.Z)(at,[["render",Qe]]);var ot=it;function nt(e,t,a,i,n,r){const l=(0,o.up)("Style");return(0,o.wg)(),(0,o.j4)(l,{message:e.message,type:e.type,description:e.description,closable:e.closable&&e.closable,showIcon:e.showIcon&&e.showIcon,outlined:e.outlined,closeText:e.closeText&&e.closeText},{default:(0,o.w5)((()=>[(0,o.Uk)('\r\n    <template v-slot:description>\r\n      <div>\r\n        <slot name="description"></slot>\r\n      </div>\r\n    </template>\r\n  ')])),_:1},8,["message","type","description","closable","showIcon","outlined","closeText"])}const rt=["type","icon","message","description","showIcon","outlined","closable","closeText"],lt=(e,t)=>`\n    border: 1px solid ${e[`${t}-color`]} !important;\n    background: #fff !important;\n    &:hover, &:focus, &:active {\n      .ant-alert-message, .ant-alert-message{\n        color: #fff;\n      }\n    }\n    .ant-alert-message, .ant-alert-message {\n      color: ${e[`${t}-color`]}\n    }\n  `,st=(0,s.ZP)(Ee.Z,rt)`
  border-radius: ${({shape:e})=>e?"40px":"4px"} !important;
  border-width: 0px !important;
  margin: 15px 0 0 0!important;
  padding: 11px 20px!important;
  .ant-alert-message{
    line-height: 1.8;
    margin-bottom: 0 !important;
    font-size: 15px !important;
    font-weight: 500 !important;
  }
  &.ant-alert-with-description{
    .ant-alert-message{
      margin-bottom: 5px !important;
    }
  }
  &.ant-alert-closable {
    .ant-alert-message{
      display: block;
    }
  }
  .ant-alert-message, .ant-alert-description {
    color: ${({type:e,theme:t})=>t[`${e}-color`]} !important;
  }
  .ant-alert-close-text{
    font-size: 12px;
    line-height: 1.5;
    font-weight: 500;
    color: #9299B8;
  }

  ${({outlined:e,theme:t,type:a})=>e&&lt(t,a)}

  ${({showIcon:e,theme:t})=>e&&`padding: 16px 15px 20px!important;\n    .alert-empty-message{\n      padding: 11px 40px 11px!important;      \n    }\n    .ant-alert-icon{\n      top: 5px !important;\n      ${t.rtl?"right":"left"}: 0px !important;\n    }\n    .ant-alert-message{\n      margin-top: -2px;\n    }\n    i.ant-alert-icon {\n      color: ${({type:e})=>t[`${e}-color`]} !important;\n      background: #ffffff00 !important;\n      height: 100%;\n      width: 50px;\n      position: absolute;\n      top: 0;\n      font-size: 15px;\n      ${t.rtl?"right":"left"}: 0 !important;\n    }`}


  .ant-alert-close-icon {
    top: 12px !important;
    ${({theme:e})=>e.rtl?"left":"right"}: 20px !important;
    svg,
    span,
    img,
    i{
      width: 8px;
      height: 8px;
    }
  }
`;var dt=(0,o.aZ)({name:"Alerts",components:{Style:st},props:{type:Ge.ZP.oneOf(["success","info","warning","error"]).def("success"),message:Ge.ZP.string.def("Hello there! A simple success alert—check it out!"),description:Ge.ZP.oneOfType([Ge.ZP.string]),showIcon:Ge.ZP.bool.def(!1),outlined:Ge.ZP.bool.def(!1),closable:Ge.ZP.bool.def(!1),closeText:Ge.ZP.oneOfType([Ge.ZP.string]),icon:Ge.ZP.node}});const ct=(0,p.Z)(dt,[["render",nt]]);var mt=ct;function pt(e,t,a,i,n,r){const l=(0,o.up)("ButtonStyled");return(0,o.wg)(),(0,o.j4)(l,{squared:e.squared,outlined:e.outlined,ghost:e.ghost,transparent:e.transparented,raised:e.raised,data:e.type,size:e.size,shape:e.shape,type:e.type,icon:e.icon,color:e.color,social:e.social,click:()=>e.load&&e.enterLoading,loading:e.loading,block:e.block,disabled:e.disabled,class:(0,Oe.C_)(`ant-btn ant-btn-${e.type} ${e.shape&&`ant-btn-${e.shape}`} ${e.block&&"ant-btn-block"}`)},{default:(0,o.w5)((()=>[(0,o.WI)(e.$slots,"default")])),_:3},8,["squared","outlined","ghost","transparent","raised","data","size","shape","type","icon","color","social","click","loading","block","disabled","class"])}const gt=De.Z.Group,ut=["type","shape","icon","size","outlined","ghost","transparent","raised","squared","color","social","loading"],ht=(e,t)=>`\n        background: transparent;\n        border: 1px ${"dash"!==t?"solid":"dashed"} ${"light"!==t?e[`${t}-color`]:e["border-color-normal"]};\n        color: ${"default"!==t&&e[`${t}-color`]};\n  \n        &:hover, &:focus {\n          background: transparent;\n          border: 1px ${"dash"!==t?"solid":"dashed"} ${"default"!==t&&e[`${t}-hover`]};\n          color: ${"default"!==t&&e[`${t}-hover`]};\n        }\n    `,xt=e=>`\n          background: transparent;\n          border: 1px solid ${e["border-color-normal"]} !important;\n          color: ${e["border-color-normal"]} !important;\n\n          &:hover, &:focus {\n              background: #ffffff50 !important;\n              border: 1px solid transparent !important;\n              color: ${e["border-color-normal"]} !important;\n          }\n      `,ft=(e,t)=>`\n        background: ${"default"!==t&&e[`${t}-color`]}15;\n        border-width: 0px;\n        color: ${"default"!==t&&e[`${t}-color`]};\n        &:hover, &:focus {\n            background: ${"default"!==t&&e[`${t}-hover`]}15;\n            border-width: 0px;\n            color: ${"default"!==t&&e[`${t}-hover`]}; \n        }\n    `,bt=(e,t)=>`\n        box-shadow: 0 10px 15px ${"white"!==t?e[`${t}-color`]:"#9299B8"}20;\n    `,yt=(e,t)=>`\n      background: ${"default"!==t&&e[`${t}-color`]};\n      border: 1px solid ${"default"!==t?e[`${t}-color`]:e["disabled-color"]};\n      color: ${"default"!==t&&"#ffffff"};\n      border-radius: 0px;\n      padding: 0px 15px;\n  \n      &:hover, &:focus {\n          background: ${"default"!==t&&e[`${t}-hover`]};\n          border: 1px solid ${"default"!==t&&e[`${t}-hover`]};\n          color: ${"default"!==t&&"#ffffff"};\n      }\n  `,wt=(e,t)=>`\n      background: transparent;\n      border: 1px ${"dash"!==t?"solid":"dashed"} ${"default"!==t?e[`${t}-color`]:e["disabled-color"]};\n      color: ${"default"!==t&&e[`${t}-color`]};\n      border-radius: 0px;\n      padding: 0px 15px;\n      &:hover, &:focus {\n          background: ${"default"!==t&&e[`${t}-hover`]};\n          border: 1px solid ${"default"!==t&&e[`${t}-hover`]};\n          color: ${"default"!==t&&"#ffffff"};\n      }\n  `,vt=(e,t)=>`\n      background: ${e};\n      background: ${e};\n      border: 1px solid ${e};\n      color: #ffffff;\n      border-radius: ${t?"40px":"4px"};\n      padding: 0px 12px;\n      display: inline-flex;\n      align-items: center;\n      span {\n          padding-left: 5px;\n      }\n      &:hover, &:focus {\n          background: ${e}90;\n          border: 1px solid ${e}90;\n          color: #ffffff;\n      }\n  `,kt=(0,s.ZP)("button",ut)`

    background: ${({type:e,theme:t})=>"default"!==e&&t[`${e}-color`]+""};
    border-width: 0px;
    border-style: ${({type:e})=>"dashed"!==e?"solid":"dashed"};
    color: ${({type:e})=>"default"!==e&&"white"!==e?"#ffffff":"#5A5F7D"};
    display: inline-flex;
    align-items: center;
    justify-content: center;
    border-radius: ${({shape:e})=>e?"40px":"5px"};
    padding: 0px 20.5px;
    height: ${({size:e,theme:t})=>"default"!==e?t[`btn-height-${e}`]:"42px"};
    font-weight: 500;
    box-shadow: 0 0;
    &:hover, &:focus {
        background: ${({type:e,theme:t})=>"default"!==e&&"white"!==e&&t[`${e}-hover`]+""};
        color: ${({type:e})=>"default"!==e&&"white"!==e?"#ffffff":"#5A5F7D"};
    }
    i,
    svg,
    img{
        width: 16px;
        height: 16px;
    }

    span{
        ${({theme:e})=>e.rtl?"margin-right":"margin-left"}: 6px
    }

    ${({transparent:e,theme:t,type:a})=>e&&ft(t,a)};
    ${({outlined:e,theme:t,type:a})=>e&&ht(t,a)};
    ${({ghost:e,theme:t})=>e&&xt(t)};
    ${({raised:e,theme:t,type:a})=>e&&bt(t,a)};
    ${({squared:e,theme:t,type:a})=>e&&yt(t,a)};
    ${({squared:e,outlined:t,theme:a,type:i})=>e&&t&&wt(a,i)};
    ${({social:e,color:t,shape:a})=>e&&vt(t,a)};
`,$t=(0,s.ZP)(gt)`
    >.ant-btn:first-child{
        border-top-left-radius: 3px !important;
        border-bottom-left-radius: 3px !important;
    }
    button {
        margin: 0px;
        padding: 0 10.75px;
        height: 30px;
        font-size: 12px;
        font-weight: 500;        
    }
    .ant-btn-light:hover{
        background: #F4F5F7;
    }
`,At=(0,s.ZP)("div")`
    position: relative;
    .sDash-range-calendar{
        position: absolute;
        padding: 10px 10px 0 10px;
        z-index: 22 !important;
        top: 50px;
        right: 0;
        margin-right: -50%;
        background-color: #fff;
    }
`;var Pt=(0,o.aZ)({name:"Button",components:{ButtonStyled:kt},data(){return{loading:!1}},methods:{enterLoading:function(){this.loading=!0}},props:{type:Ge.ZP.oneOf(["primary","secondary","success","info","warning","danger","link","dark","light","white","dashed","error","default"]).def("default"),shape:Ge.ZP.string,icon:Ge.ZP.string,size:Ge.ZP.oneOf(["large","default","small"]).def("default"),color:Ge.ZP.string,outlined:Ge.ZP.bool.def(!1),block:Ge.ZP.bool.def(!1),disabled:Ge.ZP.bool.def(!1),transparented:Ge.ZP.bool.def(!1),raised:Ge.ZP.bool.def(!1),squared:Ge.ZP.bool.def(!1),social:Ge.ZP.bool.def(!1),load:Ge.ZP.bool.def(!1),ghost:Ge.ZP.bool.def(!1)}});const Dt=(0,p.Z)(Pt,[["render",pt]]);var St=Dt;function Et(e,t,a,i,n,r){const l=(0,o.up)("ButtonStyledGroup");return(0,o.wg)(),(0,o.j4)(l,null,{default:(0,o.w5)((()=>[(0,o.WI)(e.$slots,"default")])),_:3})}var Bt=(0,o.aZ)({name:"BtnGroup",components:{ButtonStyledGroup:$t}});const Ct=(0,p.Z)(Bt,[["render",Et]]);var Lt=Ct;const It={key:0,class:"sDash-range-calendar",placement:"bottomRight",title:"Search by Calendar",action:"click"},_t=(0,o._)("span",null,"Calendar",-1);function Ut(e,t,a,i,n,r){const l=(0,o.up)("v-calendar"),s=(0,o.up)("sdFeatherIcons"),d=(0,o.up)("sdButton"),c=(0,o.up)("CustomDropDown");return(0,o.wg)(),(0,o.j4)(c,{id:"dropdownParent"},{default:(0,o.w5)((()=>[e.isVisible?((0,o.wg)(),(0,o.iD)("div",It,[(0,o.Wm)(l,{columns:e.$screens({default:1,lg:2}),"is-expanded":"",modelValue:e.range,"onUpdate:modelValue":t[0]||(t[0]=t=>e.range=t),"is-range":""},null,8,["columns","modelValue"])])):(0,o.kq)("",!0),(0,o.Wm)(d,{onClick:e.handleVisible,size:"small",type:"white"},{default:(0,o.w5)((()=>[(0,o.Wm)(s,{type:"calendar",size:"14"}),_t])),_:1},8,["onClick"])])),_:1})}var Zt=(0,o.aZ)({name:"CalendarButton",components:{CustomDropDown:At},data(){return{range:{start:new Date(2021,0,1),end:new Date(2021,0,5)}}},setup(){const e=(0,tt.iH)(!1),t=()=>{e.value=!e.value};return(0,o.bv)((()=>{document.body.addEventListener("click",(t=>{if(t.target.closest("#dropdownParent"))return!1;e.value=!1}))})),{handleVisible:t,isVisible:e}}});const Ft=(0,p.Z)(Zt,[["render",Ut]]);var jt=Ft;const zt={to:"#"},Rt=(0,o._)("span",null,"Printer",-1),Mt={to:"#"},Tt=(0,o._)("span",null,"PDF",-1),Ot={to:"#"},Nt=(0,o._)("span",null,"Google Sheets",-1),Wt={to:"#"},Vt=(0,o._)("span",null,"Excel (XLSX)",-1),Jt={to:"#"},qt=(0,o._)("span",null,"CSV",-1),Gt=(0,o._)("span",null,"Export",-1);function Xt(e,t,a,i,n,r){const l=(0,o.up)("sdFeatherIcons"),s=(0,o.up)("sdButton"),d=(0,o.up)("sdPopover");return(0,o.wg)(),(0,o.j4)(d,{placement:"bottomLeft",action:"click"},{content:(0,o.w5)((()=>[(0,o._)("a",zt,[(0,o.Wm)(l,{type:"printer"}),Rt]),(0,o._)("a",Mt,[(0,o.Wm)(l,{type:"book-open"}),Tt]),(0,o._)("a",Ot,[(0,o.Wm)(l,{type:"file-text"}),Nt]),(0,o._)("a",Wt,[(0,o.Wm)(l,{type:"x"}),Vt]),(0,o._)("a",Jt,[(0,o.Wm)(l,{type:"file"}),qt])])),default:(0,o.w5)((()=>[(0,o.Wm)(s,{size:"small",type:"white"},{default:(0,o.w5)((()=>[(0,o.Wm)(l,{type:"download"}),Gt])),_:1})])),_:1})}var Yt=(0,o.aZ)({name:"ExportButton",components:{}});const Ht=(0,p.Z)(Yt,[["render",Xt]]);var Kt=Ht;const Qt={to:"#"},ea=(0,o._)("span",null,"Facebook",-1),ta={to:"#"},aa=(0,o._)("span",null,"Twitter",-1),ia={to:"#"},oa=(0,o._)("span",null,"Feed",-1),na={to:"#"},ra=(0,o._)("span",null,"Linkedin",-1),la={to:"#"},sa=(0,o._)("span",null,"Instagram",-1),da=(0,o._)("span",null,"Share",-1);function ca(e,t,a,i,n,r){const l=(0,o.up)("sdFeatherIcons"),s=(0,o.up)("sdButton"),d=(0,o.up)("sdPopover");return(0,o.wg)(),(0,o.j4)(d,{placement:"bottomLeft",action:"click"},{content:(0,o.w5)((()=>[(0,o._)("a",Qt,[(0,o.Wm)(l,{type:"facebook"}),ea]),(0,o._)("a",ta,[(0,o.Wm)(l,{type:"twitter"}),aa]),(0,o._)("a",ia,[(0,o.Wm)(l,{type:"rss"}),oa]),(0,o._)("a",na,[(0,o.Wm)(l,{type:"linkedin"}),ra]),(0,o._)("a",la,[(0,o.Wm)(l,{type:"instagram"}),sa])])),default:(0,o.w5)((()=>[(0,o.Wm)(s,{size:"small",type:"white"},{default:(0,o.w5)((()=>[(0,o.Wm)(l,{type:"share-2",size:"14"}),da])),_:1})])),_:1})}var ma=(0,o.aZ)({name:"ShareButton",components:{}});const pa=(0,p.Z)(ma,[["render",ca]]);var ga=pa;const ua=(0,s.ZP)(Q.Z)`
  margin-bottom: 0;

  .page-header-actions button.ant-btn-white svg {
    width: 12px;
    height: 12px;
    ${({theme:e})=>e.rtl?"margin-left":"margin-right"}: 2px;
    color: #5f63f2;
  }
  i +span, svg +span, img +span {
      ${({theme:e})=>e.rtl?"margin-right":"margin-left"}: 6px;
  }
`,ha=(0,o.aZ)({components:{PageHeaderStyle:ua},props:{title:Ge.ZP.oneOfType([Ge.ZP.string,Ge.ZP.object]),subTitle:Ge.ZP.oneOfType([Ge.ZP.string,Ge.ZP.object]),bgColor:Ge.ZP.string,class:Ge.ZP.string,routes:Ge.ZP.object,buttons:Ge.ZP.array,ghost:Ge.ZP.bool,breadcrumb:Ge.ZP.object},render(){return(0,o.Wm)("div",null,[(0,o.Wm)("div",{style:{backgroundColor:this.bgColor||"#F4F5F7"}},[(0,o.Wm)(ua,{style:{backgroundColor:"rgb(244, 245, 247)"},class:this.class,title:this.title||this.$slots.title(),subTitle:this.subTitle||(this.$slots.subTitle?this.$slots.subTitle():null),breadcrumb:this.breadcrumb&&this.breadcrumb,ghost:this.ghost,extra:this.$slots.buttons&&this.$slots.buttons()},null)])])}});const xa={class:"project-modal"},fa={class:"projects-members mb-30"},ba=["src"],ya=["src"],wa=["src"],va=["src"],ka=["src"];function $a(e,t,i,n,r,l){const s=(0,o.up)("a-input"),d=(0,o.up)("a-form-item"),c=(0,o.up)("a-select-option"),m=(0,o.up)("a-select"),p=(0,o.up)("a-textarea"),g=(0,o.up)("a-checkbox-group"),u=(0,o.up)("a-date-picker"),h=(0,o.up)("a-col"),x=(0,o.up)("sdButton"),f=(0,o.up)("ProjectModalFooter"),b=(0,o.up)("a-row"),y=(0,o.up)("a-form"),w=(0,o.up)("BasicFormWrapper"),v=(0,o.up)("sdModal");return(0,o.wg)(),(0,o.j4)(v,{type:e.modalType,title:"Create Project",visible:e.visible,onCancel:e.handleCancel},{default:(0,o.w5)((()=>[(0,o._)("div",xa,[(0,o.Wm)(w,null,{default:(0,o.w5)((()=>[(0,o.Wm)(y,{model:e.formState,onFinish:e.handleOk,layout:e.formState.layout},{default:(0,o.w5)((()=>[(0,o.Wm)(d,{name:"project",label:""},{default:(0,o.w5)((()=>[(0,o.Wm)(s,{value:e.formState.project,"onUpdate:value":t[0]||(t[0]=t=>e.formState.project=t),placeholder:"Project Name"},null,8,["value"])])),_:1}),(0,o.Wm)(d,{name:"category",label:""},{default:(0,o.w5)((()=>[(0,o.Wm)(m,{value:e.formState.category,"onUpdate:value":t[1]||(t[1]=t=>e.formState.category=t),style:{width:"100%"}},{default:(0,o.w5)((()=>[(0,o.Wm)(c,{value:""},{default:(0,o.w5)((()=>[(0,o.Uk)("Project Category")])),_:1}),(0,o.Wm)(c,{value:"one"},{default:(0,o.w5)((()=>[(0,o.Uk)("Project One")])),_:1}),(0,o.Wm)(c,{value:"two"},{default:(0,o.w5)((()=>[(0,o.Uk)("Project Two")])),_:1})])),_:1},8,["value"])])),_:1}),(0,o.Wm)(d,{name:"description",label:""},{default:(0,o.w5)((()=>[(0,o.Wm)(p,{rows:4,placeholder:"Project Description"})])),_:1}),(0,o.Wm)(d,{name:"privacy",label:"Project Privacy"},{default:(0,o.w5)((()=>[(0,o.Wm)(g,{value:e.formState.privacy,"onUpdate:value":t[2]||(t[2]=t=>e.formState.privacy=t),options:e.options},null,8,["value","options"])])),_:1}),(0,o.Wm)(d,{name:"members",label:"Project Members"},{default:(0,o.w5)((()=>[(0,o.Wm)(s,{value:e.formState.members,"onUpdate:value":t[3]||(t[3]=t=>e.formState.members=t),placeholder:"Search Members"},null,8,["value"])])),_:1}),(0,o._)("div",fa,[(0,o._)("img",{style:{width:"35px"},src:a(44016),alt:""},null,8,ba),(0,o._)("img",{style:{width:"35px"},src:a(38341),alt:""},null,8,ya),(0,o._)("img",{style:{width:"35px"},src:a(79835),alt:""},null,8,wa),(0,o._)("img",{style:{width:"35px"},src:a(19813),alt:""},null,8,va),(0,o._)("img",{style:{width:"35px"},src:a(71640),alt:""},null,8,ka)]),(0,o.Wm)(b,{gutter:15},{default:(0,o.w5)((()=>[(0,o.Wm)(h,{md:12},{default:(0,o.w5)((()=>[(0,o.Wm)(d,{name:"start",label:"Start Date"},{default:(0,o.w5)((()=>[(0,o.Wm)(u,{value:e.formState.start,"onUpdate:value":t[4]||(t[4]=t=>e.formState.start=t),placeholder:"mm/dd/yyyy",format:e.dateFormat},null,8,["value","format"])])),_:1})])),_:1}),(0,o.Wm)(h,{md:12},{default:(0,o.w5)((()=>[(0,o.Wm)(d,{name:"end",label:"End Date"},{default:(0,o.w5)((()=>[(0,o.Wm)(u,{value:e.formState.end,"onUpdate:value":t[5]||(t[5]=t=>e.formState.end=t),placeholder:"mm/dd/yyyy",format:e.dateFormat},null,8,["value","format"])])),_:1})])),_:1}),(0,o.Wm)(h,{md:12},{default:(0,o.w5)((()=>[(0,o.Wm)(d,null,{default:(0,o.w5)((()=>[(0,o.Wm)(f,null,{default:(0,o.w5)((()=>[(0,o.Wm)(x,{size:"default",type:"primary",key:"submit",onClick:e.handleOk},{default:(0,o.w5)((()=>[(0,o.Uk)(" Add New Project ")])),_:1},8,["onClick"]),(0,o.Wm)(x,{size:"default",type:"light",key:"back",outlined:"",onClick:e.handleCancel},{default:(0,o.w5)((()=>[(0,o.Uk)(" Cancel ")])),_:1},8,["onClick"])])),_:1})])),_:1})])),_:1})])),_:1})])),_:1},8,["model","onFinish","layout"])])),_:1})])])),_:1},8,["type","visible","onCancel"])}var Aa=a(72984);s.ZP.div`
    .ant-page-header-heading-sub-title{
        ${({theme:e})=>e.rtl?"margin-left":"margin-right"}: 0;
        position: relative;
        ${({theme:e})=>e.rtl?"padding-right":"padding-left"}: 15px;
        font-weight: 500;
        &:before{
            position: absolute;
            content: '';
            width: 1px;
            height: 24px;
            background: ${({theme:e})=>e["dash-color"]};
            ${({theme:e})=>e.rtl?"right":"left"}: 0;
            top:0;
        }
    }
`,s.ZP.div`
    margin-bottom: 25px;
    .project-sort-bar{
        display: flex;
        flex-wrap: wrap;
        align-items: center;
        margin: 0 -10px;
        .project-sort-nav,
        .project-sort-search,
        .project-sort-group{
            padding: 0 10px;
        }

        .project-sort-group{
            ${({theme:e})=>e.rtl?"margin-right":"margin-left"}: auto;
        }
        .project-sort-search{
            .ant-select-selection-search{
                width: 100% !important;
            }
            .ant-input-affix-wrapper{
                padding-top: 0 !important;
                padding-bottom: 0 !important;
            }
        }
    }
    @media (max-width: 1500px){
        .project-sort-search{
            .ant-select{
                width: 237px !important;
            }
        }
        .project-sort-group .sort-group{
            .ant-select{
                min-width: 180px;
            }
        }
    }
    @media (min-width: 1201px) and (max-width: 1300px) {
        .project-sort-search{
            .ant-select{
                width: 170px !important;
            }
        }
        .project-sort-group{
            padding: 0 5px;

        }
        .project-sort-group .sort-group .layout-style a{
            width: 35px;
            height: 35px;
        }
        .project-sort-group .sort-group .ant-select {
            min-width: 170px;
            ${({theme:e})=>e.rtl?"padding-right":"padding-left"}: 5px;
            ${({theme:e})=>e.rtl?"margin-left":"margin-right"}: 5px;
        }
    }
    @media (max-width: 1199px){
        .project-sort-search{
            flex: 0 0 100%;
            order: 0;
            margin-bottom: 25px;
            display: flex;
            justify-content: center;
            .ant-select{
                width: 350px !important;
            }
        }
        .project-sort-nav{
            order: 1;
            margin: 0 auto;
        }
        .project-sort-group{
            order: 2;
        }
    }
    @media (max-width: 991px){
        .project-sort-group{
            ${({theme:e})=>e.rtl?"margin-right":"margin-left"}: unset;
            flex: 0 0 100%;
            margin-top: 15px;
            .sort-group{
                justify-content: flex-start;
                .layout-style{
                    ${({theme:e})=>e.rtl?"margin-right":"margin-left"}: auto;
                }
            }
        }
    }
    @media (max-width: 575px){
        .project-sort-group{
            .sort-group{
                > span{
                    display: none;
                }
                .ant-select{
                    ${({theme:e})=>e.rtl?"margin-left":"margin-right"}: 0;
                }
            }
        }
    }

    nav{
        background: #fff;
        border-radius: 5px;
        padding: 9px 20px;
        ul{
            list-style: none;
            margin: 0;
            padding: 0;
            display: flex;
            align-items: center;
            justify-content: space-between;
            li{
                ${({theme:e})=>e.rtl?"margin-left":"margin-right"}: 11px;
                ${({theme:e})=>e.rtl?"border-left":"border-right"}: 1px solid ${({theme:e})=>e["border-color-light"]};
                &:last-child{
                    ${({theme:e})=>e.rtl?"margin-left":"margin-right"}: 0;
                    ${({theme:e})=>e.rtl?"margin-left":"margin-right"}: 0;
                    ${({theme:e})=>e.rtl?"border-left":"border-right"}: 0 none;
                }
                a{
                    color: ${({theme:e})=>e["gray-solid"]};
                    font-weight: 400;
                    ${({theme:e})=>e.rtl?"padding-left":"padding-right"}: 11px;
                }
                &.active{
                    a{
                        color: ${({theme:e})=>e["primary-color"]};
                    }
                }
                &:last-child{
                    a{
                        ${({theme:e})=>e.rtl?"padding-left":"padding-right"}: 0;
                    }
                }
            }
        }
    }
    .ant-select-selection-search-input{
        border: 0 none;
        border-radius: 23px;
        input{
            height: 40px !important;
            border-radius: 23px;
        }
    }
    .ant-select-arrow{
        right: auto;
        ${({theme:e})=>e.rtl?"left":"right"}: 11px !important;
    }

    .sort-group{
        color: ${({theme:e})=>e["gray-solid"]};
        display: flex;
        align-items: center;
        justify-content: flex-end;


        .ant-select{
            ${({theme:e})=>e.rtl?"padding-right":"padding-left"}: 10px;
            ${({theme:e})=>e.rtl?"margin-right":"margin-left"}: 15px;
            min-width: 260px;
            .ant-select-selector{
                border: 0 none;
                .ant-select-selection-item{
                    color: ${({theme:e})=>e["gray-solid"]};
                }

            }
        }
        .layout-style{
            display: flex;
            align-items: center;
            ${({theme:e})=>e.rtl?"margin-right":"margin-left"}: 20px;
            a{
                display: flex;
                width: 40px;
                height: 40px;
                border-radius: 50%;
                align-items: center;
                justify-content: center;
                color: ${({theme:e})=>e["gray-solid"]};
                &:hover,
                &.active{
                    color: ${({theme:e})=>e["primary-color"]};
                    background: #fff;
                    i{
                        svg{
                            color: ${({theme:e})=>e["primary-color"]};
                        }
                    }
                }
            }
        }
    }
    @media (max-width: 400px){
        .sort-group .ant-select{
            min-width: 200px;
        }
        .project-sort-search{
            .ant-select-auto-complete{
                width: 100% !important;
            }
        }
        .project-sort-nav{
            nav{
                padding: 10px;
            }
            nav ul{
                flex-wrap: wrap;
                justify-content: center;
                margin-bottom: -5px;
                li{
                    ${({theme:e})=>e.rtl?"border-left":"border-right"}: 0 none;
                    margin-bottom: 5px;
                }
            }
        }
    }
`,s.ZP.div`
    .ant-card-body{
        padding: 0px !important;
    }
    .project-top{
        padding:30px 30px 0px;
    }
    .project-bottom{
        .project-assignees{
            padding: 16px 30px 25px;
        }
    }
    .project-title{
        display: flex;
        align-items: flex-start;
        justify-content: space-between;
        h1{
            font-size: 16px;
            display: flex;
            flex-wrap: wrap;
            align-items: center;
            margin: -2px;
            a{
                color: ${({theme:e})=>e["dark-color"]};
                ${({theme:e})=>e.rtl?"margin-left":"margin-right"}: 11px !important;
            }
            a,
            .ant-tag{
                margin: 2px;
            }
            .ant-tag{
                text-transform: uppercase;
                font-size: 10px;
                ${({theme:e})=>e.rtl?"margin-left":"margin-right"}: 0;
                line-height: 18px;
                background: red;
                color: #fff;
                border: 0 none;
                &.early{
                    background: ${({theme:e})=>e["primary-color"]};
                }
                &.progress{
                    background: ${({theme:e})=>e["danger-color"]};
                }
                &.late{
                    background: ${({theme:e})=>e["warning-color"]};
                }
                &.complete{
                    background: ${({theme:e})=>e["success-color"]};
                }
            }
        }
        .ant-dropdown-trigger{
            color: ${({theme:e})=>e["extra-light-color"]};
        }
    }
    .project-desc{
        margin: 7px 0 25px 0;
        color: ${({theme:e})=>e["gray-color"]};
    }
    .project-timing{
        display: flex;
        align-items: center;
        margin-bottom: 15px;
        div{
            ${({theme:e})=>e.rtl?"margin-left":"margin-right"}: 30px;
            &:last-child{
                ${({theme:e})=>e.rtl?"margin-left":"margin-right"}: 0;
            }
            span, strong{
                display: block;
            }
            span{
                font-size: 12px;
                margin-bottom: 2px;
                color: ${({theme:e})=>e["gray-solid"]};
            }
            strong{
                font-weight: 500;
            }
        }
    }
    .project-progress{
        p{
            margin: 2px 0 0 0;
            color: ${({theme:e})=>e["gray-solid"]};
            font-size: 12px;
        }
        .ant-progress-text{
            font-size: 12px;
            font-weight: 500;
        }
    }
    .project-assignees{
        border-top: 1px solid ${({theme:e})=>e["border-color-light"]};
        margin-top: 17px;
        padding-top: 16px;
        p{
            font-size: 13px;
            color: ${({theme:e})=>e["gray-solid"]}
        }
        ul{
            margin: -3px;
            padding: 0;
            display: flex;
            align-items: center;
            flex-wrap: wrap;
            li{
                list-style: none;
                padding: 3px;
                img{
                    width: 35px;
                    height: 35px;
                    border-radius: 50%;
                    object-fit: cover;
                }
            }
        }
    }
`,s.ZP.div`
    .ant-pagination{
        display: flex;
        justify-content: flex-end;
        @media only screen and (max-width: 767px) {
            justify-content: center;
        }
    }
`,s.ZP.div`
    h1{
        font-size: 15px;
        font-weight: 500;
        margin-bottom: 5px;
        a{
            color: ${({theme:e})=>e["dark-color"]};
        }
    }
    p{
        margin: 0;
        font-size: 12px;
        color: ${({theme:e})=>e["gray-solid"]};
    }
`,s.ZP.div`
    ul{
        margin: -3px;
        padding: 0;
        display: flex;
        align-items: center;
        li{
            list-style: none;
            padding: 3px;
            img{
                width: 35px;
                height: 35px;
                border-radius: 50%;
                object-fit: cover;
            }
        }
    }
`,s.ZP.div`
    margin-bottom: 30px;
    .project-list-progress{
        white-space: normal;
        .ant-progress-line{
            display: flex;
            align-items: center;
        }
        p{
            margin: 4px 0 0 0;
            font-size: 12px;
            color: ${({theme:e})=>e["gray-solid"]};
        }
        .ant-progress>div{
            flex-direction: row;
        }
    }
    .date-started,
    .date-finished{
        font-weight: 500;
    }
    .ant-table{
        .ant-table-thead{
            th{
                background-color: ${({theme:e})=>e["bg-color-light"]};
            }
        }
        .ant-table-tbody{
            tr{
                &:hover{
                    td{
                        background-color: ${({theme:e})=>e["bg-color-light"]};
                    }
                }
                .ant-tag{
                    text-transform: uppercase;
                    font-size: 10px;
                    ${({theme:e})=>e.rtl?"margin-left":"margin-right"}: 0;
                    line-height: 18px;
                    background: red;
                    color: #fff;
                    border: 0 none;
                    &.early{
                        background: ${({theme:e})=>e["primary-color"]};
                    }
                    &.progress{
                        background: ${({theme:e})=>e["danger-color"]};
                    }
                    &.late{
                        background: ${({theme:e})=>e["warning-color"]};
                    }
                    &.complete{
                        background: ${({theme:e})=>e["success-color"]};
                    }
                }
            }
        }
    }
    .ant-table-content table > thead > tr th{
        font-weight: 400;
        color: ${({theme:e})=>e["light-color"]};
        border-top: 1px solid ${({theme:e})=>e["border-color-light"]};
    }
    .ant-table-content table > thead > tr th:first-child{
        border-radius: ${({theme:e})=>e.rtl?"0 10px 10px 0":"10px 0 0 10px"} !important;
        ${({theme:e})=>e.rtl?"border-right":"border-left"}: 1px solid ${({theme:e})=>e["border-color-light"]};
    }
    .ant-table-content table > thead > tr th:last-child{
        border-radius: ${({theme:e})=>e.rtl?"10px 0 0 10px":"0 10px 10px 0"} !important;
        ${({theme:e})=>e.rtl?"border-left":"border-right"}: 1px solid ${({theme:e})=>e["border-color-light"]};
    }
    .ant-dropdown-trigger{
        svg{
            color: ${({theme:e})=>e["extra-light-color"]};
        }
    }
`,s.ZP.div`
    .project-header{
        display: flex;
        align-items: center;
        @media only screen and (max-width: 800px) {
            flex-wrap: wrap;
        }
        @media only screen and (max-width: 575px) {
            flex-flow: column;
            button{
                margin: 15px 0 0;
            }
        }
        h1{
            ${({theme:e})=>e.rtl?"margin-left":"margin-right"}: 20px;
            margin-bottom: 0;
            font-size: 20px;
            @media only screen and (max-width: 800px) {
                margin-bottom: 10px;
            }
            @media only screen and (max-width: 575px) {
                margin: 0;
            }
        }
        button{
            font-size: 12px;
            font-weight: 500;
            ${({theme:e})=>e.rtl?"margin-left":"margin-right"}: 10px;
            height: 35px;
            padding: 0px 13.5px;
            &.btn-markComplete{
                background: #fff !important;
                border-color: ${({theme:e})=>e["border-color-deep"]} !important;
            }
        }
    }
    .project-action{
        .project-edit,
        .project-remove{
            border-radius: 6px;
            background: #fff;
            height: 35px;
            padding: 0 15px;
            font-size: 12px;
            font-weight: 500;
            display: inline-flex;
            align-items: center;
            justify-content: center;
            margin: 0 5px;
            box-shadow: 0 3px 5px ${({theme:e})=>e["gray-solid"]}05;
            svg,
            img{
                ${({theme:e})=>e.rtl?"margin-left":"margin-right"}: 6px;
            }
            i{
                line-height: 0;
            }
        }
        .project-edit{
            color: ${({theme:e})=>e["primary-color"]};
        }
        .project-remove{
            color: ${({theme:e})=>e["danger-color"]};
        }
    }
    .project-progress{
        border-radius: 10px;
        background: ${({theme:e})=>e["success-color"]};
        padding: 20px 25px 20px;
        margin-bottom: 25px;
        h3{
            color: #fff;
        }
        .ant-progress-inner{
            background: rgba(255,255,255, 0.2);
        }
        .ant-progress-bg{
            background: #fff;
        }
        .ant-progress-text{
            color: #fff;
            font-weight: 500;
        }
        .ant-progress>div{
            flex-direction: row;
        }
    }
    .about-project-wrapper{
        min-height: 485px;
        background: #fff;
        border-radius: 10px;
        margin-bottom: 25px;
    }
    .state-single{
        display: flex;
        align-items: center;
        margin-bottom: 25px;
        &:last-child{
            margin-bottom: 0;
        }
        > div{
            ${({theme:e})=>e.rtl?"margin-left":"margin-right"}: 20px;
        }
        a{
            display: flex;
            align-items: center;
            justify-content: center;
            width: 60px;
            height: 60px;
            border-radius: 12px;
            background: rgba(95,99,242,0.1);
        }
        h1{
            font-size: 20px;
            font-weight: 600;
            margin: 0 0 3px;
        }
        p{
            color: ${({theme:e})=>e["gray-solid"]};
            margin: 0;
        }
        .color-primary{
            a{
                background: rgba(95,99,242,0.1);
                svg{
                    color: ${({theme:e})=>e["primary-color"]};
                }
            }
        }
        .color-secondary{
            a{
                background: rgba(255,105,165,0.1);
                svg{
                    color: ${({theme:e})=>e["secondary-color"]};
                }
            }
        }
        .color-success{
            a{
                background: rgba(32,201,151,0.1);
                svg{
                    color: ${({theme:e})=>e["success-color"]};
                }
            }
        }
        .color-warning{
            a{
                background: rgba(250,139,12,0.1);
                svg{
                    color: ${({theme:e})=>e["warning-color"]};
                }
            }
        }
    }
    .about-content{
        p{
            font-size: 15px;
            line-height: 25px;
            color: ${({theme:e})=>e["gray-color"]};
        }
    }
    .about-project{
        margin: 42px -40px 0;
        display: flex;
        align-items: center;
        @media only screen and (max-width: 991px) {
            flex-flow: column;
            align-items: flex-start;
        }
        div{
            margin: 0 40px;
            span{
                color: ${({theme:e})=>e["gray-solid"]};
                font-size: 13px;
                display: block;
                margin-bottom: 3px;
            }
            p{
                font-weight: 500;
            }
        }
    }
    .project-users-wrapper{
        .btn-addUser{
            padding: 0px 12.6px;
            font-size: 12px;
            font-weight: 500;
            color: ${({theme:e})=>e["primary-color"]} !important;
            border-color: ${({theme:e})=>e["border-color-light"]};
        }
        i +span, svg +span, img +span {
            ${({theme:e})=>e.rtl?"margin-right":"margin-left"}: 6px;
        }
    }
    .project-users{
        min-height: 368px;
        .porject-user-single{
            display: flex;
            align-items: center;
            margin-bottom: 25px;
            &:last-child{
                margin-bottom: 0;
            }
            & > div{
                ${({theme:e})=>e.rtl?"margin-left":"margin-right"}: 15px;
            }
            div{
                img{
                    width: 45px;
                    height: 45px;
                    border-radius: 50%;
                    object-fit: cover;
                    display: block;
                }
                h1{
                    font-size: 14px;
                    font-weight: 600;
                    margin-bottom: 2px;
                }
                p{
                    color: ${({theme:e})=>e["gray-solid"]};
                    margin: 0;
                }
            }
        }
    }

    .file-list{
        min-height: 385px;
        .file-list__single{
            justify-content: space-between;
            align-items: center;
            &:not(:last-child){
                margin-bottom: 18px;
            }
            span{
                display: block;
                font-size: 12px;
                line-height: 1.42;
                &.file-name{
                    font-size: 14px;
                    font-weight: 500;
                    color: ${({theme:e})=>e["dark-color"]};
                }
                &.file-size{
                    margin: 2px 0;;
                    color: ${({theme:e})=>e["gray-solid"]};
                }
                &.file-content-action{
                    a{
                        font-weight: 500;
                        color: ${({theme:e})=>e["primary-color"]};
                    }
                    a + a{
                        margin-left: 8px;
                    }
                }
            }
        }
        .file-single-info{
            width: 50%;
            align-items: center;
            .file-single-logo{
                ${({theme:e})=>e.rtl?"margin-left":"margin-right"}: 16px;
                img{
                    max-width: 42px;
                }
            }
        }
        .file-single-action{
            .ant-dropdown-trigger {
                color: ${({theme:e})=>e["extra-light-color"]};
            }
        }
    }

    .dropdown-more{
        a{
            font-size: 13px;
            svg,
            i.
            img{
                ${({theme:e})=>e.rtl?"margin-left":"margin-right"}: 8px;
            }
        }
    }
`,s.ZP.div`
    .ant-card{
        .ant-card-head{
            border-color: ${({theme:e})=>e["border-color-light"]};
            margin-bottom: 0;
        }
        .ant-card-body{
            padding: 0 !important;
        }
    }
    nav{
        a{
            font-size: 14px;
            font-weight: 500;
            color: ${({theme:e})=>e["gray-solid"]};
            position: relative;
            padding: 20px 0px;
            &:not(:last-child){
                ${({theme:e})=>e.rtl?"margin-left":"margin-right"}: 18px;
            }
            &:before{
                position: absolute;
                content: '';
                width: 100%;
                ${({theme:e})=>e.rtl?"right":"left"}: 0;
                bottom: -2px;
                height: 1px;

            }
            &.active{
                color: ${({theme:e})=>e["primary-color"]};
                &:before{
                    background: ${({theme:e})=>e["primary-color"]};
                }
            }
        }
    }
    table{
        margin-top: 15px;
        .ant-checkbox-checked{
            .ant-checkbox-inner{
                background: ${({theme:e})=>e["success-color"]};
                border-color: ${({theme:e})=>e["success-color"]};
            }
            &:after{
                border-color: ${({theme:e})=>e["success-color"]};
            }
        }
        thead{
            display: none;
        }
        tr{
            th{
                background: #fff;
                border-bottom: 0;
                padding: 10px;
                &:first-child{
                    ${({theme:e})=>e.rtl?"margin-left":"margin-right"}: 25px;
                }
                .ant-checkbox-indeterminate {
                    .ant-checkbox-inner{
                        &:after{
                            background: ${({theme:e})=>e["success-color"]};
                        }
                    }
                }
            }
            &:hover{
                td{
                    background: #fff;
                }
            }
        }
        .ant-table-tbody{
            > tr.ant-table-row{
                &.ant-table-row-selected{
                    > td{
                        background: #fff;
                    }
                    .task-title{
                        text-decoration: line-through;
                    }
                }
                > td{
                    padding: 10px;
                    border-bottom: 0;
                    text-align: ${({theme:e})=>e.rtl?"right":"left"};
                    &:first-child{
                        ${({theme:e})=>e.rtl?"padding-right":"padding-left"}: 25px;
                    }
                    &:last-child{
                        ${({theme:e})=>e.rtl?"padding-left":"padding-right"}: 25px;
                    }
                    .task-title{
                        color: ${({theme:e})=>e["gray-color"]};
                    }
                    .task-created{
                        font-size: 12px;
                        color: ${({theme:e})=>e["gray-color"]};
                    }
                    .ant-checkbox{
                        &:hover{
                            .ant-checkbox-inner{
                                border-color: ${({theme:e})=>e["success-color"]};
                            }
                        }
                    }
                }
                &:hover{
                    box-shadow: 0 15px 50px ${({theme:e})=>e["gray-solid"]}20;
                    > td{
                        background: #fff;
                    }
                }
            }
        }
    }

    .tasklist-action{
        margin: 18px 25px 25px;
        button{
            width: 100%;
            text-align: ${({theme:e})=>e.rtl?"right":"left"};
            justify-content: flex-start;
            font-size: 12px;
            font-weight: 500;
            &.ant-btn-primary{
                border-radius: 6px;
                background: ${({theme:e})=>e["primary-color"]}10;
            }
        }
    }
`,s.ZP.div`
    display: flex;
    align-items: center;
    justify-content: flex-end;
    margin: 0 -10px;
    span, img, div{
        display: block;
        margin: 0 10px;
        line-height: normal;
    }
    span, a{
        color: ${({theme:e})=>e["gray-solid"]};
    }
    .task-created{
        color: #9299b8 !important;
    }
    .task-move{
        svg,
        i{
            color: #D8DCEB;
        }
    }
`,s.ZP.div`
    padding: 25px;
    min-height: 435px;
    .activity-block{
        &:not(:last-child){
            margin-bottom: 20px;
            padding-bottom: 20px;
            border-bottom: 1px solid ${({theme:e})=>e["border-color-light"]};
        }
    }
    .activity-dateMeta{
        height: 100%;
        border-radius: 10px;
        display: flex;
        flex-flow: column;
        align-items: center;
        justify-content: center;
        background: ${({theme:e})=>e["bg-color-light"]};
        border: 1px solid ${({theme:e})=>e["border-color-light"]};
        @media only screen and (max-width: 575px) {
            height: auto;
            padding: 30px 0px;
            margin-bottom: 25px;
        }
        h1{
            font-size: 18px;
            margin-bottom: 0px;
        }
        .activity-month{
            color: ${({theme:e})=>e["gray-color"]};
        }
    }

    .activity-single{
        &:not(:last-child){
            margin-bottom: 25px;
        }
        .activity-icon{
            display: inline-flex;
            align-items: center;
            justify-content: center;
            height: 24px;
            width: 24px;
            border-radius: 50%;
            margin: ${({theme:e})=>e.rtl?"4px 0 0 10px":"4px 10px 0 0"};
            &.bg-primary{
                background: ${({theme:e})=>e["primary-color"]}15;
                color: ${({theme:e})=>e["primary-color"]};
            }
            &.bg-secondary{
                background: ${({theme:e})=>e["secondary-color"]}15;
                color: ${({theme:e})=>e["secondary-color"]};
            }
            &.bg-success{
                background: ${({theme:e})=>e["success-color"]}15;
                color: ${({theme:e})=>e["success-color"]};
            }
        }
        img{
            ${({theme:e})=>e.rtl?"margin-left":"margin-right"}: 12px;
        }
        .activity-title{
            font-size: 14px;
            font-weight: 500;
            margin: -4px 0 0;
            span{
                font-weight: 400;
                margin: 0 2px;
                color: ${({theme:e})=>e["gray-solid"]};
            }
        }
        .activity-timeMeta{
            font-size: 12px;
            margin-bottom: 0;
            color: ${({theme:e})=>e["extra-light-color"]};
        }
    }
`;const Pa=s.ZP.div`
    margin-top: 10px;
    button{
        margin-right: 10px;
    }
`,Da=[{label:"Privet",value:"privet"},{label:"Team",value:"team"},{label:"Public",value:"public"}],Sa="MM/DD/YYYY",Ea=(0,o.aZ)({name:"CreateProject",components:{BasicFormWrapper:Aa.nS,ProjectModalFooter:Pa},props:{visible:Ge.ZP.bool.def(!1),onCancel:Ge.ZP.func.isRequired},setup(e){const t=(0,tt.iH)("primary"),a=(0,tt.iH)([]),{onCancel:i}=(0,tt.BK)(e),o=(0,tt.qj)({project:"",category:"",description:"",privacy:[""],members:"",start:"",end:"",layout:"vertical"}),n=()=>{i.value()},r=()=>{i.value()};return{options:Da,handleOk:n,handleCancel:r,modalType:t,checked:a,dateFormat:Sa,formState:o}}});var Ba=Ea;const Ca=(0,p.Z)(Ba,[["render",$a]]);var La=Ca;const Ia={key:0},_a={key:1,class:"sDash-drawer-placement"},Ua={key:2,style:{height:"200px",overflow:"hidden",position:"relative",padding:"48px",textAlign:"center",width:"100%"}},Za={style:{"margin-top":"16px"}},Fa={key:3},ja=(0,o._)("span",null,"New account",-1),za={style:{position:"absolute",right:0,bottom:0,width:"100%",borderTop:"1px solid #e9e9e9",padding:"10px 16px",background:"#fff",textAlign:"right",zIndex:1}};function Ra(e,t,a,i,n,r){const l=(0,o.up)("sdButton"),s=(0,o.up)("a-drawer"),d=(0,o.up)("a-radio"),c=(0,o.up)("a-radio-group"),m=(0,o.up)("PlusOutlined");return(0,o.wg)(),(0,o.iD)(o.HY,null,["basic"==e.type?((0,o.wg)(),(0,o.iD)("div",Ia,[(0,o.Wm)(l,{type:"primary",raised:!0,onClick:e.showDrawer},{default:(0,o.w5)((()=>[(0,o.Uk)((0,Oe.zw)(e.btnText),1)])),_:1},8,["onClick"]),(0,o.Wm)(s,{title:e.title,placement:e.placement,closable:!1,visible:e.visible,"onUpdate:visible":t[0]||(t[0]=t=>e.visible=t),onAfterVisibleChange:e.afterVisibleChange},{default:(0,o.w5)((()=>[(0,o.WI)(e.$slots,"default")])),_:3},8,["title","placement","visible","onAfterVisibleChange"])])):(0,o.kq)("",!0),"custom"==e.type?((0,o.wg)(),(0,o.iD)("div",_a,[(0,o.Wm)(c,{value:e.customPlacement,"onUpdate:value":t[1]||(t[1]=t=>e.customPlacement=t)},{default:(0,o.w5)((()=>[(0,o.Wm)(d,{value:"top"},{default:(0,o.w5)((()=>[(0,o.Uk)("top")])),_:1}),(0,o.Wm)(d,{value:"right"},{default:(0,o.w5)((()=>[(0,o.Uk)("right")])),_:1}),(0,o.Wm)(d,{value:"bottom"},{default:(0,o.w5)((()=>[(0,o.Uk)("bottom")])),_:1}),(0,o.Wm)(d,{value:"left"},{default:(0,o.w5)((()=>[(0,o.Uk)("left")])),_:1})])),_:1},8,["value"]),(0,o.Wm)(l,{type:"primary",raised:!0,onClick:e.showDrawer},{default:(0,o.w5)((()=>[(0,o.Uk)((0,Oe.zw)(e.btnText),1)])),_:1},8,["onClick"]),(0,o.Wm)(s,{title:e.title,placement:e.customPlacement,closable:!1,visible:e.visible,onClose:e.onClose},{default:(0,o.w5)((()=>[(0,o.WI)(e.$slots,"default")])),_:3},8,["title","placement","visible","onClose"])])):(0,o.kq)("",!0),"render"==e.type?((0,o.wg)(),(0,o.iD)("div",Ua,[(0,o.Uk)(" Render in this "),(0,o._)("div",Za,[(0,o.Wm)(l,{type:"primary",raised:!0,onClick:e.showDrawer},{default:(0,o.w5)((()=>[(0,o.Uk)("Open")])),_:1},8,["onClick"])]),(0,o.Wm)(s,{title:e.title,placement:"right",closable:!1,visible:e.visible,"get-container":!1,style:{position:"absolute"},onClose:e.onClose},{default:(0,o.w5)((()=>[(0,o.WI)(e.$slots,"default")])),_:3},8,["title","visible","onClose"])])):(0,o.kq)("",!0),"submit"==e.type?((0,o.wg)(),(0,o.iD)("div",Fa,[(0,o.Wm)(l,{type:"primary",raised:!0,onClick:e.showDrawer},{default:(0,o.w5)((()=>[(0,o.Wm)(m),ja])),_:1},8,["onClick"]),(0,o.Wm)(s,{title:e.title,width:720,visible:e.visible,"body-style":{paddingBottom:"80px"},onClose:e.onClose},{default:(0,o.w5)((()=>[(0,o.WI)(e.$slots,"default"),(0,o._)("div",za,[(0,o.Wm)(l,{type:"primary",onClick:e.onClose},{default:(0,o.w5)((()=>[(0,o.Uk)("Submit")])),_:1},8,["onClick"])])])),_:3},8,["title","visible","onClose"])])):(0,o.kq)("",!0)],64)}var Ma=a(44218),Ta=(0,o.aZ)({name:"Drawer",components:{PlusOutlined:Ma.Z},props:{type:Ge.ZP.oneOf(["basic","custom","render","submit"]).def("basic"),title:Ge.ZP.string,placement:Ge.ZP.string,btnText:Ge.ZP.string.def("Open"),width:Ge.ZP.number.def(320)},setup(){const{state:e}=(0,c.oR)(),t=(0,tt.iH)(!1),a=(0,tt.iH)("left"),i=(0,o.Fl)((()=>e.themeLayout.rtlData)),n=e=>{console.log("visible",e)},r=()=>{t.value=!0},l=()=>{t.value=!1};return(0,o.bv)((()=>{t.value=!1})),{visible:t,customPlacement:a,afterVisibleChange:n,showDrawer:r,onClose:l,rtl:i}}});const Oa=(0,p.Z)(Ta,[["render",Ra]]);var Na=Oa,Wa=a(25924);const Va=(0,o.aZ)({name:"GoogleBasicBarChart",components:{GChart:Wa.GChart},data(){return{chartOptions:{title:this.title,width:this.width,height:this.height,chartArea:{width:this.chartArea},hAxis:{title:"Total",minValue:0},vAxis:{title:"City"}}}},methods:{},props:{type:Ge.ZP.string.def("BarChart"),width:Ge.ZP.string.def("100%"),height:Ge.ZP.number.def(300),data:Ge.ZP.array,title:Ge.ZP.string.def("Chart"),chartArea:Ge.ZP.string.def("50%")},render(){return(0,o.Wm)(Wa.GChart,{type:this.type,data:this.data,options:this.chartOptions,rootProps:{"data-testid":"1"}},null)}}),Ja=(0,o.aZ)({name:"BubbleChart",components:{GChart:Wa.GChart},data(){return{chartOptions:{width:this.width,height:this.height,colorAxis:{colors:this.colors}}}},methods:{},props:{type:Ge.ZP.string.def("BubbleChart"),width:Ge.ZP.string.def("100%"),height:Ge.ZP.number.def(300),data:Ge.ZP.array,colors:Ge.ZP.array.def(["#b0120a","#ffab91"])},render(){return(0,o.Wm)(Wa.GChart,{type:this.type,data:this.data,options:this.chartOptions},null)}}),qa=(0,o.aZ)({name:"GoogleMaterialBarChart",components:{GChart:Wa.GChart},data(){return{chartOptions:{chart:{title:this.title,subtitle:this.subtitle},width:this.width,height:this.height,chartArea:{width:this.chartArea}}}},methods:{},props:{type:Ge.ZP.string.def("ColumnChart"),width:Ge.ZP.string.def("100%"),height:Ge.ZP.number.def(300),data:Ge.ZP.array,title:Ge.ZP.string.def("Chart"),chartArea:Ge.ZP.string.def("50%"),subtitle:Ge.ZP.string.def("subtitle")},render(){return(0,o.Wm)(Wa.GChart,{type:this.type,data:this.data,options:this.chartOptions,rootProps:{"data-testid":"2"},height:this.height},null)}}),Ga=(0,o.aZ)({name:"GoogleStackedChart",components:{GChart:Wa.GChart},data(){return{chartOptions:{chart:{title:this.title},width:this.width,height:this.height,chartArea:{width:this.chartArea},isStacked:!0,hAxis:{title:"Total",minValue:0},vAxis:{title:"City"}}}},methods:{},props:{type:Ge.ZP.string.def("BarChart"),width:Ge.ZP.string.def("100%"),height:Ge.ZP.number.def(300),data:Ge.ZP.array,title:Ge.ZP.string.def("Chart"),chartArea:Ge.ZP.string.def("50%")},render(){return(0,o.Wm)(Wa.GChart,{type:this.type,data:this.data,options:this.chartOptions,rootProps:{"data-testid":"3"},height:this.height},null)}}),Xa=(0,o.aZ)({name:"GoogleCustomColorChart",components:{GChart:Wa.GChart},data(){return{chartOptions:{title:this.title,width:this.width,height:this.height,colors:this.colors,chartArea:{width:this.chartArea},hAxis:{title:"Total",minValue:0},vAxis:{title:"City"}}}},methods:{},props:{type:Ge.ZP.string.def("BarChart"),width:Ge.ZP.string.def("100%"),height:Ge.ZP.number.def(300),data:Ge.ZP.array,title:Ge.ZP.string.def("Chart"),chartArea:Ge.ZP.string.def("50%"),colors:Ge.ZP.array},render(){return(0,o.Wm)(Wa.GChart,{type:this.type,data:this.data,options:this.chartOptions,rootProps:{"data-testid":"4"}},null)}}),Ya=(0,o.aZ)({name:"GoogleComboChart",components:{GChart:Wa.GChart},data(){return{chartOptions:{title:this.title,width:this.width,height:this.height,colors:this.colors,chartArea:{width:this.chartArea},seriesType:"bars",series:{5:{type:"line"}}}}},methods:{},props:{type:Ge.ZP.string.def("ComboChart"),width:Ge.ZP.string.def("100%"),height:Ge.ZP.number.def(300),data:Ge.ZP.array,title:Ge.ZP.string.def("Chart"),chartArea:Ge.ZP.string.def("50%"),colors:Ge.ZP.array},render(){return(0,o.Wm)(Wa.GChart,{type:this.type,data:this.data,options:this.chartOptions,rootProps:{"data-testid":"5"}},null)}}),Ha=(0,o.aZ)({name:"GoogleLineChart",components:{GChart:Wa.GChart},data(){return{chartOptions:{width:this.width,height:this.height,hAxis:{title:"Time"},vAxis:{title:"Popularity"}}}},methods:{},props:{type:Ge.ZP.string.def("LineChart"),width:Ge.ZP.string.def("100%"),height:Ge.ZP.number.def(300),data:Ge.ZP.array},render(){return(0,o.Wm)(Wa.GChart,{type:this.type,data:this.data,options:this.chartOptions,rootProps:{"data-testid":"6"}},null)}}),Ka=(0,o.aZ)({name:"GoogleMultiLineChart",components:{GChart:Wa.GChart},data(){return{chartOptions:{width:this.width,height:this.height,hAxis:{title:"Time"},vAxis:{title:"Popularity"},series:{0:{curveType:"function"},1:{curveType:"function"}}}}},methods:{},props:{type:Ge.ZP.string.def("LineChart"),width:Ge.ZP.string.def("100%"),height:Ge.ZP.number.def(300),data:Ge.ZP.array},render(){return(0,o.Wm)(Wa.GChart,{type:this.type,data:this.data,options:this.chartOptions,rootProps:{"data-testid":"7"}},null)}}),Qa=(0,o.aZ)({name:"GoogleBasicPieChart",components:{GChart:Wa.GChart},data(){return{chartOptions:{title:this.title,width:this.width,height:this.height,chartArea:{width:this.chartArea}}}},methods:{},props:{type:Ge.ZP.string.def("PieChart"),width:Ge.ZP.string.def("100%"),height:Ge.ZP.number.def(300),data:Ge.ZP.array,title:Ge.ZP.string.def("My Daily Activities"),chartArea:Ge.ZP.string.def("50%")},render(){return(0,o.Wm)(Wa.GChart,{type:this.type,data:this.data,options:this.chartOptions,rootProps:{"data-testid":"9"}},null)}}),ei=(0,o.aZ)({name:"Google3dPieChart",components:{GChart:Wa.GChart},data(){return{chartOptions:{title:this.title,width:this.width,height:this.height,is3D:!0,chartArea:{width:this.chartArea}}}},methods:{},props:{type:Ge.ZP.string.def("PieChart"),width:Ge.ZP.string.def("100%"),height:Ge.ZP.number.def(300),data:Ge.ZP.array,title:Ge.ZP.string.def("My Daily Activities"),chartArea:Ge.ZP.string.def("50%")},render(){return(0,o.Wm)(Wa.GChart,{type:this.type,data:this.data,options:this.chartOptions,rootProps:{"data-testid":"9"}},null)}});var ti=a(91719);function ai(e,t,a,i,n,r){const l=(0,o.up)("a-cascader"),s=(0,o.up)("CascaderStyle");return(0,o.wg)(),(0,o.j4)(s,null,{default:(0,o.w5)((()=>[(0,o.Wm)(l,{size:e.size,options:e.options,expandTrigger:e.trigger,defaultValue:e.defaultValue,onChange:e.onChangeEvent,"show-search":e.isShowSearch&&{filter:e.filter},placeholder:e.placeholder,"load-data":e.loadData,"change-on-select":""},null,8,["size","options","expandTrigger","defaultValue","onChange","show-search","placeholder","load-data"])])),_:1})}const ii=s.ZP.div`
    margin: 20px 0;
    .ant-input{
        padding: 5.5px 20px;
    }
    .anticon svg{
        width: 10px;
        height: 8.5px;
    }
`;var oi=(0,o.aZ)({name:"Cascader",components:{CascaderStyle:ii},data(){return{options:this.data}},methods:{onChangeEvent(e,t){this.loading?this.onChange(e,t):this.onChange(e)},filter(e,t){return t.some((t=>t.label.toLowerCase().indexOf(e.toLowerCase())>-1))},loadData(e){const t=e[e.length-1];t.loading=!0,setTimeout((()=>{t.loading=!1,t.children=[{label:`${t.label} Dynamic 1`,value:"dynamic1"},{label:`${t.label} Dynamic 2`,value:"dynamic2"}],this.options=[...this.options]}),1e3)}},props:{data:Ge.ZP.arrayOf(Ge.ZP.object).def([{value:"zhejiang",label:"Zhejiang",children:[{value:"hangzhou",label:"Hangzhou",children:[{value:"xihu",label:"West Lake"}]}]},{value:"jiangsu",label:"Jiangsu",children:[{value:"nanjing",label:"Nanjing",children:[{value:"zhonghuamen",label:"Zhong Hua Men"}]}]}]),defaultValue:Ge.ZP.arrayOf(Ge.ZP.string).def([]),trigger:Ge.ZP.string.def("click"),placeholder:Ge.ZP.string.def("Please select"),onChange:Ge.ZP.func,isShowSearch:Ge.ZP.bool.def(!1),loading:Ge.ZP.bool.def(!1),size:Ge.ZP.oneOf(["large","default","small"]).def("default")}});const ni=(0,p.Z)(oi,[["render",ai]]);var ri=ni;function li(e,t,a,i,n,r){const l=(0,o.up)("H1"),s=(0,o.up)("H2"),d=(0,o.up)("H3"),c=(0,o.up)("H4"),m=(0,o.up)("H5"),p=(0,o.up)("H6");return"H1"===e.as.toUpperCase()?((0,o.wg)(),(0,o.j4)(l,{key:0,style:(0,Oe.j5)(e.styles),className:e.className,id:e.id},{default:(0,o.w5)((()=>[(0,o.WI)(e.$slots,"default")])),_:3},8,["style","className","id"])):"H2"===e.as.toUpperCase()?((0,o.wg)(),(0,o.j4)(s,{key:1,style:(0,Oe.j5)(e.styles),className:e.className,id:e.id},{default:(0,o.w5)((()=>[(0,o.WI)(e.$slots,"default")])),_:3},8,["style","className","id"])):"H3"===e.as.toUpperCase()?((0,o.wg)(),(0,o.j4)(d,{key:2,style:(0,Oe.j5)(e.styles),className:e.className,id:e.id},{default:(0,o.w5)((()=>[(0,o.WI)(e.$slots,"default")])),_:3},8,["style","className","id"])):"H4"===e.as.toUpperCase()?((0,o.wg)(),(0,o.j4)(c,{key:3,style:(0,Oe.j5)(e.styles),className:e.className,id:e.id},{default:(0,o.w5)((()=>[(0,o.WI)(e.$slots,"default")])),_:3},8,["style","className","id"])):"H5"===e.as.toUpperCase()?((0,o.wg)(),(0,o.j4)(m,{key:4,style:(0,Oe.j5)(e.styles),className:e.className,id:e.id},{default:(0,o.w5)((()=>[(0,o.WI)(e.$slots,"default")])),_:3},8,["style","className","id"])):((0,o.wg)(),(0,o.j4)(p,{key:5,style:(0,Oe.j5)(e.styles),className:e.className,id:e.id},{default:(0,o.w5)((()=>[(0,o.WI)(e.$slots,"default")])),_:3},8,["style","className","id"]))}const si=s.ZP.h1`
  font-size: 30px;
  font-weight: 600;
  line-height: 38px;
`,di=s.ZP.h1`
  font-size: 24px;
  font-weight: 600;
  line-height: 30px;
`,ci=s.ZP.h1`
  font-size: 22px;
  font-weight: 600;
  line-height: 27px;
`,mi=s.ZP.h1`
  font-size: 20px;
  font-weight: 600;
  line-height: 24px;
`,pi=s.ZP.h1`
  font-size: 18px;
  font-weight: 600;
  line-height: 22px;
`,gi=s.ZP.h1`
  font-size: 16px;
  font-weight: 600;
  line-height: 20px;
`;var ui=(0,o.aZ)({name:"Heading",props:{as:Ge.ZP.oneOf(["h1","h2","h3","h4","h5","h6"]).def("h1"),className:Ge.ZP.string,id:Ge.ZP.string,styles:Ge.ZP.object.def({})},components:{H1:si,H2:di,H3:ci,H4:mi,H5:pi,H6:gi}});const hi=(0,p.Z)(ui,[["render",li]]);var xi=hi;function fi(e,t,a,i,n,r){const l=(0,o.up)("a-select-option"),s=(0,o.up)("AutoCompleteStyled"),d=(0,o.up)("sdFeatherIcons"),c=(0,o.up)("sdButton"),m=(0,o.up)("a-input");return e.customComponent?((0,o.wg)(),(0,o.j4)(s,{key:0,style:(0,Oe.j5)({width:e.width}),onSelect:e.onSelect,onSearch:e.onSearching},(0,o.Nv)({default:(0,o.w5)((()=>[(0,o.WI)(e.$slots,"default")])),_:2},[e.myData.length?{name:"options",fn:(0,o.w5)((()=>[((0,o.wg)(!0),(0,o.iD)(o.HY,null,(0,o.Ko)(e.myData,(e=>((0,o.wg)(),(0,o.j4)(l,{key:e.title},{default:(0,o.w5)((()=>[(0,o.Uk)((0,Oe.zw)(e.title),1)])),_:2},1024)))),128))])),key:"0"}:{name:"options",fn:(0,o.w5)((()=>[(0,o.Wm)(l,{key:"Data not found!"},{default:(0,o.w5)((()=>[(0,o.Uk)(" Data not found! ")])),_:1})])),key:"1"}]),1032,["style","onSelect","onSearch"])):e.patterns?((0,o.wg)(),(0,o.j4)(s,{key:1,value:e.value,"onUpdate:value":t[0]||(t[0]=t=>e.value=t),class:"certain-category-search",dropdownClassName:"certain-category-search-dropdown",dropdownMatchSelectWidth:!1,dropdownStyle:{width:300},style:(0,Oe.j5)({width:e.width}),placeholder:e.placeholder,onSearch:e.onSearching},(0,o.Nv)({default:(0,o.w5)((()=>[(0,o.Wm)(m,null,{suffix:(0,o.w5)((()=>[e.patternButtons?((0,o.wg)(),(0,o.j4)(c,{key:0,class:"search-btn",style:(0,Oe.j5)({[e.rtl?"marginLeft":"marginRight"]:-20}),type:"primary"},{default:(0,o.w5)((()=>[(0,o.Wm)(d,{type:"search"})])),_:1},8,["style"])):((0,o.wg)(),(0,o.j4)(d,{key:1,type:"search"}))])),_:1})])),_:2},[e.myData.length?{name:"options",fn:(0,o.w5)((()=>[((0,o.wg)(!0),(0,o.iD)(o.HY,null,(0,o.Ko)(e.myData,(e=>((0,o.wg)(),(0,o.j4)(l,{key:e.title},{default:(0,o.w5)((()=>[(0,o.Uk)((0,Oe.zw)(e.title),1)])),_:2},1024)))),128))])),key:"0"}:{name:"options",fn:(0,o.w5)((()=>[(0,o.Wm)(l,{key:"Data not found!"},{default:(0,o.w5)((()=>[(0,o.Uk)(" Data not found! ")])),_:1})])),key:"1"}]),1032,["value","style","placeholder","onSearch"])):((0,o.wg)(),(0,o.j4)(s,{key:2,style:(0,Oe.j5)({width:e.width}),onSelect:e.onSelect,onSearch:e.onSearching,placeholder:e.placeholder,value:e.value},(0,o.Nv)({_:2},[e.myData.length?{name:"options",fn:(0,o.w5)((()=>[((0,o.wg)(!0),(0,o.iD)(o.HY,null,(0,o.Ko)(e.myData,(e=>((0,o.wg)(),(0,o.j4)(l,{key:e.title},{default:(0,o.w5)((()=>[(0,o.Uk)((0,Oe.zw)(e.title),1)])),_:2},1024)))),128))])),key:"0"}:{name:"options",fn:(0,o.w5)((()=>[(0,o.Wm)(l,{key:"Data not found!"},{default:(0,o.w5)((()=>[(0,o.Uk)(" Data not found! ")])),_:1})])),key:"1"}]),1032,["style","onSelect","onSearch","placeholder","value"]))}const bi=["customComponent","patterns","patternButtons","width","onSearch","options","placeholder"],yi=(0,s.ZP)(xe.ZP,bi)`
    display: block !important;
    .ant-select-selection-placeholder{
        padding: 0 20px !important;
        text-align: ${({theme:e})=>e.rtl?"right":"left"};
        ${({theme:e})=>e.rtl?"right":"left"}: 2px !important;
    }
    .ant-select-selector{
        display: flex;
        align-items: center;
        padding: 0 !important;
        border-color: #E3E6EF !important;
        .ant-select-selection-search{
            .ant-input-affix-wrapper{
                padding: 0 20px;
            }
            .ant-input-suffix{
                svg,
                i{
                    position: relative;
                    /* top: 1.5px; */
                    color: ${({theme:e})=>e["extra-light-color"]};
                }
            }
        }
    }
    .ant-select-selector input{
        height: 35px !important;
        ${({theme:e})=>e.rtl?"padding-right":"padding-left"}: 0 !important;
        &::placeholder{
            color: ${({theme:e})=>e["extra-light-color"]} !important;
        }
    }
    .ant-select-selection-search{
        ${({theme:e})=>e.rtl?"right":"left"}: 20px;
        width: auto !important;
        @media only screen and (max-width: 575px){
            width: 100% !important;
        }
    }
    .ant-select-selection-search textarea.ant-input{
        padding: 12px 20px;
        height: 50px;
    }
    .ant-input-affix-wrapper{
        padding: 0 20px;
    }
    .ant-input-affix-wrapper input{
        height: 38px !important;
    }
    .ant-input-affix-wrapper .ant-input-suffix .search-btn{
        height: 38px;
        border-radius: ${({theme:e})=>e.rtl?"4px 0 0 4px":"0 4px 4px 0"};
        svg,
        i{
            color: #fff;
        }
    }
`;var wi=(0,o.aZ)({name:"AutoComplete",components:{AutoCompleteStyled:yi},props:{customComponent:Ge.ZP.bool.def(!1),patterns:Ge.ZP.bool.def(!1),patternButtons:Ge.ZP.bool.def(!1),width:Ge.ZP.string.def("350px"),dataSource:Ge.ZP.array,placeholder:Ge.ZP.string.def("Input here")},setup(e,{emit:t}){const{dataSource:a}=(0,tt.BK)(e),{state:i}=(0,c.oR)(),n=(0,tt.iH)(""),r=(0,tt.iH)(a.value),l=(0,o.Fl)((()=>i.themeLayout.rtlData)),s=e=>{n.value=e;const i=a.value.filter((t=>t.title.toUpperCase().startsWith(e.toUpperCase())));return t("onSearch",e),r.value=e?i:a.value},d=()=>{};return{value:n,myData:r,rtl:l,onSearching:s,onSelect:d}}});const vi=(0,p.Z)(wi,[["render",fi]]);var ki=vi;const $i=(0,o._)("a",{to:"#"},[(0,o._)("span",null,"Export to CSV")],-1),Ai=(0,o._)("a",{to:"#"},[(0,o._)("span",null,"Export to XML")],-1),Pi=(0,o._)("a",{to:"#"},[(0,o._)("span",null,"Export to Drive")],-1);function Di(e,t,a,i,n,r){const l=(0,o.up)("Content"),s=(0,o.up)("a-dropdown");return(0,o.wg)(),(0,o.j4)(s,{overlayClassName:e.className,placement:e.placement,title:e.title,trigger:e.action},{overlay:(0,o.w5)((()=>[(0,o.Wm)(l,null,{default:(0,o.w5)((()=>[(0,o.WI)(e.$slots,"overlay",{},(()=>[$i,Ai,Pi]))])),_:3})])),default:(0,o.w5)((()=>[(0,o.WI)(e.$slots,"default")])),_:3},8,["overlayClassName","placement","title","trigger"])}const Si=s.ZP.div`
    background: #ffffff;
    box-shadow: 0px 0px 2px #888;
    a i, a svg, a img {
        ${({theme:e})=>e.rtl?"margin-left":"margin-right"}: 8px;
    }
    a {
        display: block;
        color: #888;
        padding: 6px 12px;
    }
    a:hover {
        background: ${({theme:e})=>e["primary-color"]}10;
        color: ${({theme:e})=>e["primary-color"]}
    }
    .dropdown-theme-2{
        a:hover{
            background: ${({theme:e})=>e.pink}10;
            color: ${({theme:e})=>e.pink}
        }
    }
`;var Ei=(0,o.aZ)({name:"Dropdown",components:{Content:Si},props:{placement:Ge.ZP.string.def("bottomRight"),title:Ge.ZP.string,action:Ge.ZP.array.def(["hover"]),class:Ge.ZP.string.def("strikingDash-dropdown")},data(){return{className:this.class}}});const Bi=(0,p.Z)(Ei,[["render",Di]]);var Ci=Bi;const Li={to:"#"},Ii=(0,o._)("span",null,"Btn Dropdown one",-1),_i={to:"#"},Ui=(0,o._)("span",null,"Btn Dropdown two",-1),Zi={to:"#"},Fi=(0,o._)("span",null,"Btn Dropdown three",-1);function ji(e,t,a,i,n,r){const l=(0,o.up)("Title"),s=(0,o.up)("sdFeatherIcons"),d=(0,o.up)("Content"),c=(0,o.up)("a-popover");return(0,o.wg)(),(0,o.j4)(c,{class:"className",modelValue:e.visible,"onUpdate:modelValue":t[0]||(t[0]=t=>e.visible=t),placement:e.placement,title:e.title&&e.title,trigger:e.action},(0,o.Nv)({content:(0,o.w5)((()=>[(0,o.Wm)(d,null,{default:(0,o.w5)((()=>[(0,o.WI)(e.$slots,"content",{},(()=>[(0,o._)("a",Li,[(0,o.Wm)(s,{type:"check",size:"16"}),Ii]),(0,o._)("a",_i,[(0,o.Wm)(s,{type:"check",size:"16"}),Ui]),(0,o._)("a",Zi,[(0,o.Wm)(s,{type:"check",size:"16"}),Fi])]))])),_:3})])),default:(0,o.w5)((()=>[(0,o.WI)(e.$slots,"default")])),_:2},[e.title?{name:"title",fn:(0,o.w5)((()=>[(0,o.Wm)(l,null,{default:(0,o.w5)((()=>[(0,o.Uk)((0,Oe.zw)(e.title),1)])),_:1})])),key:"0"}:void 0]),1032,["modelValue","placement","title","trigger"])}const zi=s.ZP.div`  
  a, .span {
      display: block;
      color: #888;
      padding: 6px 12px;
      text-align: ${({theme:e})=>e.rtl?"right":"left"};
      span {
        ${({theme:e})=>e.rtl?"padding-right":"padding-left"}: 12px;
      }
  }
  a:hover {
    background: ${({theme:e})=>e["primary-color"]}10;
    color: ${({theme:e})=>e["primary-color"]}
  }
  
`,Ri=s.ZP.p`
  text-align: ${({theme:e})=>e.rtl?"right":"left"};
  margin: 0;
`;var Mi=(0,o.aZ)({name:"Popover",props:{placement:Ge.ZP.string.def("bottom"),title:Ge.ZP.string,class:Ge.ZP.string,action:Ge.ZP.string.def("hover")},data(){return{visible:!1,className:this.class}},components:{Content:zi,Title:Ri}});const Ti=(0,p.Z)(Mi,[["render",ji]]);var Oi=Ti;function Ni(e,t,a,i,n,r){const l=(0,o.up)("sdButton"),s=(0,o.up)("ModalStyled");return(0,o.wg)(),(0,o.j4)(s,{title:e.title,visible:e.visible,confirmLoading:e.confirmLoading,onOk:e.onOk,onCancel:e.onCancel,type:!!e.color&&this.type,width:e.width,class:(0,Oe.C_)(e.className),footer:null},{footer:(0,o.w5)((()=>[(0,o.WI)(e.$slots,"footer",{},(()=>[(0,o.Wm)(l,{type:"white",outlined:!e.color,key:"back",onClick:e.onCancel},{default:(0,o.w5)((()=>[(0,o.Uk)(" Return ")])),_:1},8,["outlined","onClick"]),(0,o.Wm)(l,{key:"submit",type:e.color?"white":e.type,outlined:"white"===e.type,loading:e.confirmLoading,onClick:e.handleOk},{default:(0,o.w5)((()=>[(0,o.Uk)(" Submit ")])),_:1},8,["type","outlined","loading","onClick"])]))])),default:(0,o.w5)((()=>[(0,o.WI)(e.$slots,"title"),(0,o.WI)(e.$slots,"default")])),_:3},8,["title","visible","confirmLoading","onOk","onCancel","type","width","class"])}const Wi=(e,t)=>`\n  .ant-modal-content, .ant-modal-header {\n    background-color: ${"default"!==e&&t[`${e}-color`]} !important;\n  }\n  .ant-modal-title {\n    color: #fff;\n  }\n  .ant-modal-footer button {\n    background: #fff;\n    color: #999;\n    border: 1px solid #ffff;\n  }\n`,Vi=["type"],Ji=(0,s.ZP)(z.Z,Vi)`    
  ${({theme:e,type:t})=>t&&Wi(t,e)}
`;var qi=(0,o.aZ)({name:"Modal",components:{ModalStyled:Ji},props:{onCancel:Ge.ZP.func,onOk:Ge.ZP.func,visible:Ge.ZP.bool.def(!1),confirmLoading:Ge.ZP.bool.def(!1),title:Ge.ZP.string,class:Ge.ZP.string.def("atbd-modal"),type:Ge.ZP.oneOf(["primary","secondary","success","error","danger","info","white","warning"]).def("white"),footer:Ge.ZP.oneOf([null]),width:Ge.ZP.number.def(620),color:Ge.ZP.oneOfType([Ge.ZP.bool,Ge.ZP.string]).def(!1)},data(){return{className:this.class}}});const Gi=(0,p.Z)(qi,[["render",Ni]]);var Xi=Gi;[xi,He,{name:"ChartContainer",...ti.BO},{name:"GoogleMaterialBarChart",...qa},{name:"GoogleBasicBarChart",...Va},{name:"GoogleStackedChart",...Ga},{name:"GoogleCustomColorChart",...Xa},{name:"GoogleComboChart",...Ya},{name:"GoogleLineChart",...Ha},{name:"GoogleMultiLineChart",...Ka},{name:"GoogleBasicPieChart",...Qa},{name:"Google3dPieChart",...ei},{name:"BubbleChart",...Ja},mt,La,St,Lt,Na,jt,Kt,ga,{name:"PageHeader",...ha},ri,ki,Ci,Oi,ot,Xi].map((e=>{x.component(`sd${e.name}`,e)}));var Yi=a(29537);const Hi=s.ZP.div`
    position: relative;
    z-index: 21;
    .ant-card-body{
        padding: 20px 25px 15px!important;
        .postBody{
            display: flex;
            position: relative;
            .post-author{
                max-width: 46px;
                border-radius: 50%;
                position: absolute;
                top: 5px;
                z-index: 22;
                ${({theme:e})=>e.rtl?"right":"left"}: 0;
            }
            textarea{
                border: 0 none;
                padding-${({theme:e})=>e.rtl?"right":"left"}: 70px;
                min-height: 55px;
                resize: none;
                &:focus{
                    outline: none;
                    box-shadow: 0 0 0 0px rgba(95, 99, 242, 0.2);
                }
            }
        }
        .postFooter{
            display: flex;
            align-items: center;
            justify-content: space-between;
            margin-top: 10px;
            border-top: 1px solid #F1F2F6;
            padding-top: 15px;
            .ant-upload{
                margin-${({theme:e})=>e.rtl?"left":"right"}: 8px;
                .ant-btn{
                    height: 30px;
                    font-size: 12px;
                    font-weight: 500;
                    border-radius: 16px;
                    padding: 0 14.5px;
                    color: ${({theme:e})=>e["gray-color"]};
                }
            }
            .btn-more{
                padding: 0 16px;
                height: 30px;
            }
            .postFooter_left{
                display: flex;
            }
            .btn-post{
                height: 35px;
            }
        }
    }
`;s.ZP.div`
    width: 100%;
    height: 100%;
    background: #11121760;
    position: fixed;
    top: 0;
    ${({theme:e})=>e.rtl?"right":"left"}: 0;
    z-index: -0;
`,s.ZP.div`
    width: 100%;
    height: 100%;
    background: #11121760;
    position: fixed;
    top: 0;
    ${({theme:e})=>e.rtl?"right":"left"}: 0;
    z-index: 9999;
`,s.ZP.div`
    .ant-card-body{
        padding: 20px 0 !important;
    }
    .post-content{
        .gallery{
            padding: 0 25px;
            .ant-row{
                height: 100%;
                margin: -5px;
                .ant-col{
                    padding: 5px;
                }
            }
            img{
                margin-bottom: 0px;
                border-radius: 8px;
            }
            .my-masonry-grid{
                margin: -5px;
                a{
                    padding: 5px;
                    display: block;
                    img{
                        margin-bottom: 5px;
                    }
                    &:empty{
                        display: none;
                    }
                }
            }
            .my-masonry-grid[cols=2]{
                a{
                    width: 50%;
                }
            }
        }
        .post-text{
            border-bottom: 1px solid #F1F2F6;
            padding: 0 25px 20px 25px;
            margin-bottom: 20px;
            p{
                font-size: 15px;
                color: ${({theme:e})=>e["gray-color"]};
                &:last-child{
                    margin-bottom: 0;
                }
            }
        }
        .post-actions{
            padding: 0 25px 20px 25px;
            margin-bottom: 20px;
            border-bottom: 1px solid #F1F2F6;
            span{
                display: inline-flex;
                align-items: center;
                color: ${({theme:e})=>e["extra-light-color"]};
                margin-${({theme:e})=>e.rtl?"left":"right"}: 20px;
            }
            a{
                display: inline-flex;
                align-items: center;
                font-size: 13px;
                color: ${({theme:e})=>e["extra-light-color"]};
                svg,
                i{
                    margin-${({theme:e})=>e.rtl?"left":"right"}: 6px;
                }
            }
        }
        .commentArea{
            display: flex;
            align-items: center;
            padding: 0 25px 20px 25px;
            border-bottom: 1px solid #F1F2F6;
            @media only screen and (max-width: 991px){
                flex-flow: column;
                align-items: flex-start;
            }
            .comment-form{
                flex: auto;
                position: relative;
                display: flex;
                align-items: center;
                margin-${({theme:e})=>e.rtl?"left":"right"}: 10px;
                @media only screen and (max-width: 991px){
                    flex-flow: column;
                    align-items: flex-start;
                    width: 100%;
                    margin-${({theme:e})=>e.rtl?"left":"right"}: 0;
                    margin-bottom: 15px;
                }
                img{
                    max-width: 36px;
                    margin-${({theme:e})=>e.rtl?"left":"right"}: 10px;
                    border-radius: 50%;
                    @media only screen and (max-width: 991px){
                        margin-${({theme:e})=>e.rtl?"left":"right"}: 0;
                        margin-bottom: 15px;
                    }
                }
                textarea{
                    padding: 14px 22px;
                    height: 50px;
                    border: 0 none;
                    border-radius: 25px;
                    background-color: #F4F5F7;
                    resize: none;
                }
            }
            .btn-send{
                padding: 0;
                height: 50px;
                width: 50px;
                border-radius: 50%;
                display: flex;
                align-items: center;
                justify-content: center;
                box-shadow: 0 10px 15px #5F63F220;
                @media only screen and (max-width: 991px){
                    width: 35px;
                    height: 35px;
                }
                svg,
                i,
                img{
                    width: 16px;
                    color: #fff;
                    @media only screen and (max-width: 991px){
                        width: 14px;
                    }
                }
            }
            .chatbox-reply-action{
                position: absolute;
                ${({theme:e})=>e.rtl?"left":"right"}: 22px;
                align-items: center;
                @media only screen and (max-width: 991px){
                    bottom: 10px;
                }
                .smile-icon{
                    position: relative;
                    margin-${({theme:e})=>e.rtl?"left":"right"}: 18px;
                    line-height: 1;
                    @media only screen and (max-width: 991px){
                        margin-${({theme:e})=>e.rtl?"left":"right"}: 8px;
                    }
                    emoji-picker{
                        position: absolute;
                        z-index: 9999999;
                    }
                }
                a{
                    line-height: 1;
                    &:not(:last-child){
                        margin-${({theme:e})=>e.rtl?"left":"right"}: 18px;
                        @media only screen and (max-width: 991px){
                            margin-${({theme:e})=>e.rtl?"left":"right"}: 6px;
                        }
                    }
                    svg,
                    i{
                        color: #ADB4D2;
                        width: 18px;
                        @media only screen and (max-width: 991px){
                            width: 14px;
                        }
                    }
                }
                .ant-upload-list {
                    display: none;
                }
                .ant-upload{
                    margin: 0;
                    padding: 0;
                    width: auto;
                    height: auto;
                    line-height: .5;
                    background-color: transparent;
                    border: 0 none;
                }
            }
        }
        .commentReplay{
            padding: 20px 25px 0 25px;
            .ant-comment-content-author-name{
                font-size: 14px;
                font-weight: 600;
                color: ${({theme:e})=>e["dark-color"]};
            }
            .ant-comment-actions{
                margin-top: 10px;
            }
        }
    }
`,s.ZP.div`
    display: flex;
    align-items: center;
    img {
        width: 46px;
        height: 46px;
        border-radius: 50%;
        ${({theme:e})=>e.rtl?"margin-left":"margin-right"}: 15px;
    }
    p {
        font-size: 14px;
        font-weight: 600;
        color: ${({theme:e})=>e["dark-color"]};
        margin: 0;
        span {
            font-size: 13px;
            font-weight: 400;
            display: block;
            margin: 0;
            color: ${({theme:e})=>e["light-color"]};
        }
    }
`;[{name:"UserCard",...Yi.Oe},{name:"CreatePost",...Hi}].map((e=>{x.component(`sd${e.name}`,e)})),x.config.productionTip=!1,x.use(D.Z),x.use(B),x.mount("#app")},40008:function(e,t,a){function i(){let e=JSON.parse(sessionStorage.getItem("user"));return e?{Accept:"application/json",Authorization:"Bearer "+e}:{}}a.d(t,{Z:function(){return i}})},91719:function(e,t,a){a.d(t,{BO:function(){return m},JY:function(){return l},Xg:function(){return r},_z:function(){return n},jk:function(){return d},nR:function(){return o},nd:function(){return s},so:function(){return c}});var i=a(23481);const o=i.ZP.div`
    display: flex;
    flex-wrap: wrap;
    align-items: flex-end;
    .card-chunk{
        width: 50%;
        flex: 0 0 50%;
    }
    @media only screen and (max-width: 379px){
        .card-chunk{
            width: 100%;
            flex: 0 0 100%;
            h1{
                margin-bottom: 0;
            }
            p{
                margin: 5px 0 20px 0;
            }
        }
    }
    .chartjs-tooltip {
        min-width: 132px !important;
    }
`,n=i.ZP.div`
    display: flex;
    align-items: flex-start;
    padding: 5px 0 2px 0;
    .icon-box{
        display: flex;
        align-items: center;
        justify-content: center;
        height: 60px;
        width: 60px;
        border-radius: 10px;
        margin-right: 10px;
        ${({theme:e})=>e.rtl?"margin-left":"margin-right"}: 10px;
        @media only screen and (max-width: 1399px){
            height: 40px;
            width: 40px;
        }
        @media only screen and (max-width: 991px){
            height: 60px;
            width: 60px;
        }
        img{
            max-width: 35px;
        }
        &.box-primary{
            background-color: ${({theme:e})=>e["primary-color"]}10;
            path,
            circle{
                fill: ${({theme:e})=>e["primary-color"]};
            }
        }
        &.box-success{
            background-color: ${({theme:e})=>e["success-color"]}10;
            path,
            circle{
                fill: ${({theme:e})=>e["success-color"]};
            }
        }
        &.box-secondary{
            background-color: ${({theme:e})=>e["secondary-color"]}10;
            path,
            circle{
                fill: ${({theme:e})=>e["secondary-color"]};
            }
        }
    }
    .card-chunk{
        h2{
            font-size: 24px;
            font-weight: 600;
            margin-bottom: 2px;
            color: ${({theme:e})=>e["dark-color"]};
        }
        span{
            color: ${({theme:e})=>e["light-gray-color"]};
        }
        p{
            margin-top: 16px;
        }
    }
`,r=(i.ZP.div`
    h1{
        margin-bottom: 30px;
    }
    .ant-row{
        margin: -5px 0;
    }
    .ant-col{
        margin: 5px 0;
    }
`,i.ZP.div`
    canvas{
        width: 100% !important;
        margin-top: 64px;
        @media only screen and (max-width: 1199px){
            margin-top: 15px;
        }
    }
    .focard-details{
        &.growth-downward{
            h1{
                font-size: 30px;
                @media only screen and (max-width: 767px){
                    font-size: 24px;
                }
            }
            .focard-status{
                .focard-status__percentage{
                    color: ${({theme:e})=>e["danger-color"]};
                    font-size: 14px;
                }
            }
        }
        &.growth-upward{
            .focard-status{
                .focard-status__percentage{
                    color: ${({theme:e})=>e["success-color"]};
                    font-size: 14px;
                }
            }
        }
        h1{
            font-weight: 600;
            margin-bottom: 2px;
        }
        .subtitle{
            font-size: 14px;
            color: #868EAE;
            margin-bottom: 10px;
        }
        .focard-status{
            display: flex;
            flex-wrap: wrap;
            align-items: center;
            margin: 0 -5px;
            span{
                display: inline-flex;
                align-items: center;
                margin: 0 5px;
                &.focard-status__percentage{
                    font-weight: 500;
                }
            }
            span + span{
                color: #868EAE;
                font-size: 13px;
            }
        }
        svg{
            width: 15px;
            position: relative;
            top: 3px;
            ${({theme:e})=>e.rtl?"margin-left":"margin-right"}: 10px;
        }
    }

    .focard-chart{
        ${({theme:e})=>e.rtl?"margin-right":"margin-left"}: -10px;
    }

    @media (max-width: 1300px){
        .focard-details{
            h1{
                font-size: 24px;
            }
            &.growth-downward{
                h1{
                    font-size: 24px;
                }
            }
        }
    }

    .forcast-card-box{
        .ant-card-body{
            padding: 0 !important;
            h1{
                padding: ${({theme:e})=>e.rtl?"25px 25px 0 0":"25px 0 0 25px"};
                font-size: 16px;
                font-weight: 500;
                margin-bottom: 26px;
                @media only screen and (max-width: 767px){
                    margin-bottom: 16px;
                }
            }
        }

        .focard-details{
            margin-top: 15px;
            padding: 0 25px 22px;
            @media only screen and (max-width: 767px){
                padding: 0 25px 0;
            }
            h1{
                padding: 0;
                font-size: 30px;
                font-weight: 600;
                margin-bottom: 4px;
                @media only screen and (max-width: 767px){
                    font-size: 24px;
                }
            }
            p{
                margin-bottom: 0;
            }
        }
        canvas{
            margin-top: 0px;
            border-radius: 0 0 10px 10px;
        }
        .chart-label{
            display: none;
        }
    }
`,i.ZP.div`
    >div{
        @media only screen and (max-width: 575px) {
            flex-flow: column;
            align-items: flex-start !important;
            ul{
                margin: 0 0 15px;
            }
        }
    }
    .card-bar-top{
        &.flex-grid{
            ${({theme:e})=>e.rtl?"margin-right":"margin-left"}: -20px;
            @media only screen and (max-width: 575px) {
                flex-flow: column;
                align-items: center;
            }
            h1{
                font-size: 24px;
                margin-bottom: 22px;
                @media only screen and (max-width: 1199px) {
                    font-size: 20px;
                }
            }
        }
        .flex-grid-child{
            padding: 0 20px;
        }
        p{
            font-size: 14px;
            margin-bottom: 8px;
            color: ${({theme:e})=>e["light-color"]};
        }
        h1{
            margin-bottom: 18px;
            sub{
                bottom: 0;
                font-size: 14px;
                ${({theme:e})=>e.rtl?"margin-right":"margin-left"}: 8px;
                color: ${({theme:e})=>e["success-color"]};
                svg{
                    ${({theme:e})=>e.rtl?"margin-left":"margin-right"}: 4px;
                }
            }
        }
    }
    ul{
        margin-top: 15px;
    }
    .chart-dataIndicator{
        li{
            font-size: 13px;
            color: ${({theme:e})=>e["gray-color"]};
            &:not(:last-child){
                ${({theme:e})=>e.rtl?"margin-left":"margin-right"}: 16px;
            }
        }
    }
    .chartjs-tooltip{
        min-width: 140px !important;
        @media only screen and (max-width: 1199px){
            min-width: 115px !important;
        }
    }
    .deals-barChart{
        display: flex;
        .card-bar-top{
            &:not(:last-child){
                margin-right: 30px;
                ${({theme:e})=>e.rtl?"margin-left":"margin-right"}: 30px;
            }
        }
        h4{
            font-weight: 400;
            color: ${({theme:e})=>e["light-gray-color"]};
            p{
                &.growth-down{
                    .deal-percentage{
                        color: ${({theme:e})=>e["danger-color"]};
                    }
                }
                &.growth-up{
                    .deal-percentage{
                        color: ${({theme:e})=>e["success-color"]};
                    }
                }
                .deal-percentage{
                    svg,
                    img,
                    i{
                        margin-right: 3px;
                    }
                }
                .deal-value{
                    font-size: 22px;
                    font-weight: 600;
                    margin-right: 8px;
                    color: ${({theme:e})=>e["dark-color"]};
                }
            }
        }
    }
    .deals-list{
        .custom-label{
            font-size: 14px;
            &:not(:last-child){
                ${({theme:e})=>e.rtl?"margin-left":"margin-right"}: 30px;
            }
        }
    }
`,i.ZP.div`
    .forcast-overview{
        .ant-card-body{
            padding: 0 24px !important;
            @media only screen and (max-width: 1199px){
                padding: 24px 24px 0 24px !important;
            }
        }
    }
    .card-radio{
        .ant-radio-button-wrapper{
            height: 30px;
            line-height: 28px;
            font-size: 12px;
            font-weight: 500;
            padding: 0 10.5px;
            color: ${({theme:e})=>e["gray-color"]};
            border-color: ${({theme:e})=>e["border-color-light"]};
            box-shadow: 0 0;
            &:before{
                display: none;
            }
            &:focus-within{
                box-shadow: 0 0;
            }
            &:first-child{
                border-radius: 3px 0 0 3px;
            }
            &:last-child{
                border-radius: 0 3px 3px 0;
            }
            &.ant-radio-button-wrapper-checked{
                color: #fff !important;
                background: ${({theme:e})=>e["primary-color"]} !important;
                // border-color: ${({theme:e})=>e["primary-color"]};
                &:hover{
                    color: #fff !important;
                    background: ${({theme:e})=>e["primary-color"]} !important;
                }
            }
            &:hover{
                background: ${({theme:e})=>e["bg-color-normal"]} !important;
            }
        }
    }
    .focard-wrapper{
        margin: 0 -12px;
        ${({theme:e})=>e.rtl?"padding: 24px 24px 25px 0;":"padding: 24px 0 25px 24px;"};
        ${({theme:e})=>e.topMenu?"padding-bottom: 0px":"padding-bottom: 25px"};

        @media only screen and (max-width: 1350px){
            padding: 24px 0 25px 10px;
        }
        @media only screen and (max-width: 1199px){
            margin: 0;
        }
        .ant-col-md-12{
            ${({theme:e})=>e.rtl?"padding: 0 12px 0 18px;":"padding: 0 18px 0 12px;"}

            @media only screen and (max-width: 1350px){
                ${({theme:e})=>e.rtl?"padding: 0 6px 0 14px;":"padding: 0 14px 0 6px;"}
            }
            @media only screen and (max-width: 575px){
                &:not(:last-child){
                    margin-bottom: 20px;
                }
            }
            &:first-child{
                @media only screen and (max-width: 1350px){
                    ${({theme:e})=>e.rtl?"padding-right":"padding-left"}: 20px;
                }
                @media only screen and (max-width: 1199px){
                    padding: ${({theme:e})=>e.rtl?"0 0 0 12px":"0 12px 0 0"};
                    @media only screen and (max-width: 575px){
                        padding: 0;
                    }
                }
            }
            &:last-child{
                padding: 0 14px 0 18px;
                @media only screen and (max-width: 1350px){
                    &:last-child{
                        padding: 0 10px 0 14px;
                    }
                }
                @media only screen and (max-width: 1199px){
                    &:last-child{
                        padding: 0 0 0 12px;
                        @media only screen and (max-width: 575px){
                            padding: 0;
                        }
                    }
                }
            }
        }

        &.focard-divider{
            ${({theme:e})=>e.rtl?"padding-right":"padding-left"}: 0;
            ${({theme:e})=>e.rtl?"padding-left":"padding-right"}: 15px;
            ${({theme:e})=>e.rtl?"border-left":"border-right"}: 1px solid ${({theme:e})=>e["border-color-light"]} !important;
            @media only screen and (max-width: 1199px){
                ${({theme:e})=>e.rtl?"padding-left":"padding-right"}: 0 none !important;
                padding: ${({theme:e})=>e.rtl?"0 10px 0 0":"0 0 0 10px"};
            }
            @media only screen and (max-width: 575px){
                padding-right: 0 none;
            }
            .ant-col-md-12{
                &:first-child{
                    padding: 0 16px 0 24px;
                    @media only screen and (max-width: 1350px){
                        padding: ${({theme:e})=>e.rtl?"0 20px 0 10px":"0 10px 0 20px"};
                    }
                    @media only screen and (max-width: 1199px){
                        padding: ${({theme:e})=>e.rtl?"0 0 0 12px":"0 12px 0 0"};
                    }
                    @media only screen and (max-width: 575px){
                        padding: 0;
                    }
                }
                &:last-child{
                    padding: ${({theme:e})=>e.rtl?"0 18px 0 10px":"0 10px 0 18px"};
                    @media only screen and (max-width: 1350px){
                        padding: ${({theme:e})=>e.rtl?"0 20px 0 4px":"0 4px 0 20px"};
                    }
                    @media only screen and (max-width: 1199px){
                        padding: ${({theme:e})=>e.rtl?"0 12px 0 0px":"0 0 0 12px"};
                    }
                    @media only screen and (max-width: 575px){
                        padding: 0;
                    }
                }
            }
        }
    }
    .ant-card-body{
        padding: 0 !important;
    }
    .traffic-table{
        min-height: 410px;
        .ant-table{
            border-radius: 10px;
        }
        table{
            color: #333;
            thead{
                th{
                    background-color: ${({theme:e})=>e["bg-color-light"]};
                    padding: 11.5px 16px;
                    &:nth-child(2){
                        border-left: 1px solid ${({theme:e})=>e["border-color-light"]};
                    }
                    &:nth-child(4){
                        border-right: 1px solid ${({theme:e})=>e["border-color-light"]};
                    }
                }
            }
            tbody{
                tr{
                    &:first-child{
                        td{
                            background-color: #fff !important;
                        }
                    }
                    &:not(:first-child){
                        &:hover{
                            td{
                                background: ${({theme:e})=>e["bg-color-light"]} !important;
                            }
                        }
                    }
                    &:hover{
                        td{
                            .social-name{
                                color: ${({theme:e})=>e["primary-color"]};
                            }
                        }
                    }
                }
                td{
                    padding: 14.5px 15px;
                    text-align: ${({theme:e})=>e.rtl?"left":"right"};
                    ${({theme:e})=>e.rtl?"border-left":"border-right"}: 1px solid ${({theme:e})=>e["border-color-light"]};
                    color: ${({theme:e})=>e["gray-color"]};
                    &:first-child{
                        ${({theme:e})=>e.rtl?"border-right":"border-left"}: 0 none;
                        text-align: ${({theme:e})=>e.rtl?"right":"left"};
                        ${({theme:e})=>e.rtl?"padding-right":"padding-left"}: 25px;
                    }
                    &:last-child{
                        ${({theme:e})=>e.rtl?"border-left":"border-right"}: 0 none;
                        ${({theme:e})=>e.rtl?"padding-left":"padding-right"}: 25px;
                    }
                    .traffic-title{
                        font-weight: 500;
                        color: ${({theme:e})=>e["dark-color"]};
                    }
                    .social-name{
                        color: ${({theme:e})=>e["info-color"]};
                    }
                }
            }
        }
    }
`,i.ZP.div`
    padding: 25px 0 0;
    height: 100%;
    ${({theme:e})=>e.rtl?"border-left":"border-right"}: 1px solid ${({theme:e})=>e["border-color-light"]};
    @media only screen and (max-width: 1599px){
        display: flex;
        align-items: center;
        flex-wrap: wrap;
        ${({theme:e})=>e.rtl?"border-left":"border-right"}: 0 none;
        margin: 0 -15px;
        padding: 15px 0 0;

    }
    div{
        margin-bottom: 25px;
        @media only screen and (max-width: 1599px){
            flex: 0 0 25%;
            padding: 15px;
            margin-bottom: 10px;
        }
        @media only screen and (max-width: 1199px){
            flex: 0 0 50%;
            padding: 5px 15px;
            margin-bottom: 5px;
        }
        @media only screen and (max-width: 575px){
            flex: 0 0 100%;
            text-align: center;
        }
        p{
            font-size: 14px;
            color: ${({theme:e})=>e["light-gray-color"]};
            margin-bottom:0;
        }
        h1{
            font-size: 22px;
            font-weight: 600;
            margin-bottom: 0;
            @media only screen and (max-width: 991px){
                font-size: 20px;
            }
            & > span{
                ${({theme:e})=>e.rtl?"margin-left":"margin-right"}: 10px;
                @media only screen and (max-width: 1599px){
                    display: block;
                }
            }
            sub{
                font-size: 13px;
                font-weight: 400;
                display: inline-flex;
                align-items: center;
                line-height: normal;
                color: ${({theme:e})=>e["light-color"]};
                span{
                    display: inline-flex;
                    align-items: center;
                    color: ${({theme:e})=>e["success-color"]};
                    padding: ${({theme:e})=>e.rtl?"0 0 0 10px":"0 10px 0 0"};
                }
                svg{
                    width:12px;
                }
                &.growth-downward{
                    span{
                        color: ${({theme:e})=>e["danger-color"]};
                    }
                }
            }
        }
    }
`),l=(i.ZP.div`
    background: #fff;
    border-radius: 10px;
    padding: 25px 25px 15px;
    overflow: hidden;
    position: relative;
    z-index: 0;
    margin-bottom: 30px;
    ${({theme:e})=>e.topMenu?"min-height: 595px":"min-height: auto"};
    @media only screen and (max-width: 991px){
        min-height: auto;
    }
    &:before{
        position: absolute;
        content: '';
        width: 100%;
        height: 215px;
        background:linear-gradient(45deg, ${({theme:e})=>e["secondary-color"]}, ${({theme:e})=>e["warning-color"]});
  ${({theme:e})=>e.rtl?"right":"left"}:0;
        top: 0;
        z-index:-1;
    }
    .overview-box{
        .ant-card-body{
            padding: 22px 25px 14px !important;
        }
        .ant-progress{
            margin-bottom: 15px;
        }
        .ant-progress-bg{
            height: 6px !important;
        }
        .overview-box-single{
            h1{
                margin-bottom: 0;
            }
            p{
                color: ${({theme:e})=>e["light-color"]};
            }
        }
        .growth-downward,
        .growth-upward{
            span{
                ${({theme:e})=>e.rtl?"margin-right":"margin-left"}: 6px;
            }
        }
        .overview-box-percentage{
            font-weight: 500;
        }
    }
    .ant-card{
        box-shadow: 0 10px 30px rgba(146,153,184,0.15);
        .growth-upward{
            color: ${({theme:e})=>e["success-color"]};
            font-weight: 600;
            display: inline-flex;
            align-items: center;
            span{
                color: ${({theme:e})=>e["light-gray-color"]};
                font-weight: 400;
                font-size: 13px;
            }
        }
        .growth-downward{
            color: ${({theme:e})=>e["danger-color"]};
            font-weight: 600;
            display: inline-flex;
            align-items: center;
            span{
                color: ${({theme:e})=>e["light-gray-color"]};
                font-weight: 400;
                font-size: 13px;
            }
        }
    }
    .overview-head{
        margin-bottom: 70px;
        h1{
            font-size: 16px;
            font-weight: 500;
            color: #fff;
        }
        .ant-btn-default{
            font-size: 12px;
            background: rgba(255,255,255,0.1);
            padding: 0px 11px;
            border: 0 none;
            color: #fff !important;
            svg,
            img,
            i{
                ${({theme:e})=>e.rtl?"margin-right":"margin-left"}: 6px;
            }
        }
        .ant-dropdown-trigger{
            height: 32px;
        }
    }
`,i.ZP.div`
    @media only screen and (max-width: 1599px){
        min-height: 524px;
        background: #fff;
        border-radius: 10px;
    }
    .performance-lineChart{
        margin-top: 20px;
        .chart-label{
            display: none;
        }
        ul{
            margin-top: 16px;
            li{
                &:not(:last-child){
                    ${({theme:e})=>e.rtl?"margin-left":"margin-right"}: 25px;
                }
            }
        }
    }
    .chartjs-tooltip{
        min-width: 175px !important;
        @media only screen and (max-width: 767px){
            min-width: 150px !important;
        }
    }
`),s=i.ZP.div`
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    margin: -24px 0 25px;
    @media only screen and (max-width: 767px){
        margin: -19px 0 25px;
        flex-flow: column;
    }
    >div{
        transition: 0.3s ease;
        padding: 20px;
        @media only screen and (max-width: 1599px){
            flex: 0 0 50%;
        }
        p{
            font-weight: 500;
        }
        &:hover{
            box-shadow: 0 15px 30px rgba(146,153,184,0.15);
            p{
                color: ${({theme:e})=>e["primary-color"]};
            }
        }
        &.active{
            background: ${({theme:e})=>e["bg-color-light"]};
            &:hover{
                box-shadow: 0 15px 30px #fff;
            }
        }
    }
    .growth-upward,
    .growth-downward{
        cursor: pointer;
        &:focus{
            outline: none
        }
        h1{
            font-size: 24px;
            sub{
                span{
                    font-weight: 500;
                }
            }
        }
    }
`,d=(i.ZP.div`
    min-height: 510px;
    background: #fff;
    border-radius: 10px;
    @media only screen and (max-width: 1599px){
        min-height: 440px;
    }
    @media only screen and (max-width: 991px){
        min-height: auto;
    }
    .session-chart-inner{
        ul{
            display: flex;
            max-width: 365px;
            margin: 40px auto 6px auto;
            li{
                width: 33.33%;
                text-align: center;
                position: relative;
                .doughnutLabelColor{
                    position: absolute;
                    display: block;
                    height: 8px;
                    width: 8px;
                    border-radius: 50%;
                    top: 50%;
                    transform: translateY(-50%);
                    ${({theme:e})=>e.rtl?"right":"left"}: 14px;
                    @media only screen and (max-width: 1400px){
                        ${({theme:e})=>e.rtl?"right":"left"}: 5px;
                    }
                    @media only screen and (max-width: 1300px){
                        ${({theme:e})=>e.rtl?"right":"left"}: 0;
                    }
                    @media only screen and (max-width: 1199px){
                        ${({theme:e})=>e.rtl?"right":"left"}: 15px;
                    }
                    @media only screen and (max-width: 379px){
                        ${({theme:e})=>e.rtl?"right":"left"}: 0;
                    }
                }
                .doughnutLabe{
                    color: ${({theme:e})=>e["gray-color"]};
                }
            }
        }
        p{
            position: absolute;
            top: 50%;
            left: 50%;
            text-align: center;
            width: 200px;
            margin-bottom: 0;
            display: inline-block;
            transform: translate(-50%, -50%);
            span{
                font-size: 24px;
                display: block;
                font-weight: 600;
            }
        }
    }
`,i.ZP.div`
    /* // margin: 0 0 15px -15px; */
    max-width: 365px;
    margin: 42px auto auto;
    >div{
        width: 33.33%;
        text-align: center;
        span{
            font-size: 18px;
            font-weight: 600;
            display: inline-block;
            @media only screen and (max-width: 1300px){
                display: block;
            }
            @media only screen and (max-width: 1199px){
                display: inline-block;
            }
            @media only screen and (max-width: 379px){
                display: block;
            }
        }
        sub{
            bottom: 0;
            ${({theme:e})=>e.rtl?"right":"left"}: 5px;
            font-size: 13px;
            color: ${({theme:e})=>e["light-gray-color"]};
        }
    }

    .session-single{
        text-align: center;
    }
`,i.ZP.div`
    max-height: 300px;
    overflow: hidden auto;
    border: 1px solid ${({theme:e})=>e["border-color-light"]};
    .ps{
        height: auto !important;
    }
    table{
        tr{
            &:first-child{
                td{
                    padding-top: 15px;
                }
            }
            &:last-child{
                td{
                    padding-bottom: 15px;
                }
            }
            th{
                font-size: 13px;
                font-weight: 500;
                color: ${({theme:e})=>e["dark-color"]};
                background: ${({theme:e})=>e["bg-color-light"]};
                padding: 9px 20px;
                border: 0 none;
            }
            td{
                font-size: 13px;
                border: 0 none;
                padding: 6px 20px;
                color: ${({theme:e})=>e["gray-color"]};
            }
        }
    }

`,i.ZP.div`
    text-align: center;
    height: 100%;
    ${({theme:e})=>e.rtl?"padding-right":"padding-left"}: 20px;
    >div{
        width: 100%;
        height: 250px;
        overflow: hidden;
        @media only screen and (max-width: 479px){
            height: 200px;
        }
        .svgMap-map-wrapper{
            height: 100%;
        }
    }
    .svgMap-map-wrapper {
        .svgMap-map-image{
            left: -16px;
        }
    }
    svg{
        width: 450px;
        background: #fff;
        @media only screen and (max-width: 479px){
            height: 180px;
        }
        @media only screen and (max-width: 440px){
            width: 310px;
        }
        @media only screen and (max-width: 320px){
            width: 280px;
        }
    }
    .svgMap-map-controls-wrapper{
        right: 5px !important;
        left: auto !important;
        bottom: 0px !important;
        box-shadow: none !important;
        .svgMap-map-controls-zoom{
            flex-direction: column;
        }
        button{
            display: block;
            width: 27px;
            height: 27px;
            background: none;
            color: #5a5f7d;
            border: 1px solid #f1f2f6;
            padding: 0;
            font-size: 15px;
            display: flex;
            align-items: center;
            justify-content: center;
            background-color: #fff;
            cursor: pointer;
            margin: 0 !important;
            &:first-child{
                border-radius: 6px 6px 0 0;
            }
            &:last-child{
                border-radius: 0 0 6px 6px;
            }
            &:focus{
                outline: none;
            }
            svg{
                width: 10px;
            }
        }
        button + button{
            border-top: 0 none;
        }
    }
`,i.ZP.div`
    @media only screen and (max-width: 1599px){
        min-height: 380px;
    }
    @media only screen and (max-width: 1199px){
        min-height: 100%;
    }
    .ant-table-tbody{
        .ant-table-cell{
            white-space: normal !important;
            @media only screen and (max-width: 991px){
                white-space: nowrap !important;
            }
        }
    }
    table{
        th{
            white-space: nowrap !important;
            text-align: ${({theme:e})=>e.rtl?"left":"right"} !important;
            &:first-child{
                text-align: ${({theme:e})=>e.rtl?"right":"left"} !important;
            }
        }
        tbody{
            tr{
                td{
                    text-align: ${({theme:e})=>e.rtl?"left":"right"};
                    color: ${({theme:e})=>e["gray-color"]};
                    &:first-child{
                        text-align: ${({theme:e})=>e.rtl?"right":"left"};
                    }
                    .page-title{
                        color: ${({theme:e})=>e["primary-color"]};
                    }
                }
            }
        }
    }
`,i.ZP.div`
    @media only screen and (max-width: 379px){
        text-align: center
    }
    h1{
        margin-bottom: 5px;
    }
    @media only screen and (max-width: 1500px){
        h1{
            font-size: 22px;
        }
    }
    & > span{
        font-size: 14px;
        color: ${({theme:e})=>e["light-gray-color"]};
    }
    p{
        display: flex;
        flex-wrap: wrap;
        align-items: center;
        margin: 21px 0 0 0;
        @media only screen and (max-width: 379px){
            justify-content: center;
        }
        .growth-upward, .growth-downward{
            display: inline-flex;
            align-items: center;
            ${({theme:e})=>e.rtl?"padding-left":"padding-right"}: 10px;
            font-weight: 600;

            i{
                line-height: 1;
            }
            svg{
                width: 15px;
            }
        }
        .growth-upward{
            color: ${({theme:e})=>e["success-color"]};
            svg{
                color: ${({theme:e})=>e["success-color"]};
            }
        }
        .growth-downward{
            color: ${({theme:e})=>e["danger-color"]};
            svg{
                color: ${({theme:e})=>e["danger-color"]};
            }
        }
        span{
            color: ${({theme:e})=>e["light-gray-color"]};
            font-size: 13px;
            display: inline-block;
        }
    }
`),c=(i.ZP.div`
    .ant-card-body{
        padding: 12px 25px 10px !important;
    }
`,i.ZP.div`
    .linkedin-chart-wrap{
        min-height: 388px;
    }
    .growth-upward,
    .growth-downward{
        line-height: 2.2;
        h1{
            margin-bottom: 0;
            svg,
            i,
            img{
                margin-right: 3px;
            }
        }
    }
    .line-chart-row{
        &:not(:last-child){
            margin-bottom: 24px;
        }
        .border-linechart{
            border-bottom: 1px solid ${({theme:e})=>e["border-color-deep"]};
            position: relative;
            &:before{
                position: absolute;
                content: '';
                width: 10px;
                height: 2px;
                ${({theme:e})=>e.rtl?"right":"left"}: 0;
                bottom: -1px;
                background: #fff;
            }
        }
    }
    .overview-container{
        .line-chart-row{
            &:not(:last-child){
                ${({theme:e})=>e.topMenu?"margin-bottom: 25px":"margin-bottom: 24px"};
            }
        }
    }
`,i.ZP.div`
    >.ant-card{
        ${({theme:e})=>e.topMenu?"min-height: 225px":"min-height: 100%"};
        @media only screen and (max-width: 1599px){
            min-height: 225px;
        }
    }
    .ant-card-body{
        h1{
            font-size: 16px;
            font-weight: 500;
        }
    }
    .ratio-content{
        margin-top: 30px
        @media only screen and (max-width: 767px){
            margin-top: 25px;
        }
        h1{
            margin-bottom: 2px;
            font-size: 36px;
            font-weight: 600;
            @media only screen and (max-width: 767px){
                font-size: 30px;
            }
        }
        .ant-progress{
            margin-bottom: 12px;
            .ant-progress-bg{
                height: 6px !important;
            }
            .ant-progress-text{
                position: absolute;
                ${({theme:e})=>e.rtl?"left":"right"}: 0;
                bottom: 26px;
                font-weight: 500;
            }
            &.progress-success{
                .ant-progress-text{
                    color: ${({theme:e})=>e["success-color"]};
                }
            }
            &.ant-progress-status-warning{
                .ant-progress-text{
                    color: ${({theme:e})=>e["warning-color"]};
                }
            }
        }
        p{
            font-weight: 400;
            margin-bottom: 0;
            color: ${({theme:e})=>e["light-color"]};
            strong{
                font-size: 13px;
                font-weight: 500;
                margin-right: 4px;
                color: ${({theme:e})=>e["dark-color"]};
            }
        }
    }
`,i.ZP.div`
    .ant-card-body{
        padding: 0 25px !important;
    }
    .ant-card-extra{
        .card-nav{
            ul{
                padding: 0;
                li{
                    padding: 0;
                }
            }
        }
    }
    canvas{
        padding: 25px 0 0;
        @media only screen and (max-width: 1599px){
            padding-top: 5px;
        }
    }
    .chart-dataIndicator{
        padding: 10px 0 25px 0;
        margin-top: 0 !important;
    }
    ul{
        padding: 10px 0 20px 0;
        margin: -5px -12px;
        li{
            padding: 5px 12px;
            font-size: 13px;
            color: ${({theme:e})=>e["light-gray-color"]};
            @media only screen and (max-width: 575px){
                display: flex !important;
            }
            &:not(:last-child){
            ${({theme:e})=>e.rtl?"margin-left":"margin-right"}: 20px;
                @media only screen and (max-width: 575px){
                    ${({theme:e})=>e.rtl?"margin-left":"margin-right"}: 0;
                }
            }
        }
    }
    .chartjs-tooltip{
        min-width: 185px !important;
        @media only screen and (max-width: 1199px){
            min-width: 170px !important;
        }
    }
    .ant-card-extra{
        padding: 0;
    }
`),m=(i.ZP.div`
    .location-map{
        padding: 10px 0 5px;
        position: relative;
        overflow: hidden;
        >div{
            width: 100%;
            height: 185px;
        }
        .svgMap-map-wrapper{
            position: static;
            padding-top: 0;
            .svgMap-map-image{
                position: static;
                left: -20px;
                padding: 0 15px;
            }
        }
        .svgMap-map-controls-wrapper{
            right: 18px !important;
            left: auto !important;
            bottom: 10px !important;
            box-shadow: none !important;
            .svgMap-map-controls-zoom{
                flex-direction: column;
            }
            button{
                display: block;
                width: 27px;
                height: 27px;
                background: none;
                color: #5a5f7d;
                border: 1px solid #f1f2f6;
                padding: 0;
                font-size: 15px;
                display: flex;
                align-items: center;
                justify-content: center;
                background-color: #fff;
                cursor: pointer;
                margin: 0 !important;
                &:focus{
                    outline: none;
                }
                svg{
                    width: 10px;
                }
            }
            button + button{
                border-top: 0 none;
            }
        }
        #world-map{
            margin-top: 25px;
        }
    }
    .location-table{
        margin: 0 25px 18px;
        padding-top: 12px;
        min-height: 180px;
        border-top: 1px solid ${({theme:e})=>e["border-color-light"]} !important;
        background: #ffffff;
        z-index: 999;
        position: relative;
        &.theme-2{
            min-height: 155px;
        }
        table{
            thead{
                th{
                    font-size: 12px;
                    background: #fff;
                    border: 0 none;
                    font-weight: 400;
                    text-transform: uppercase;
                    color: ${({theme:e})=>e["light-color"]};
                }
            }
            tr{
                &:hover{
                    td{
                        background: #fff !important;
                    }
                }
                td{
                    border: 0 none;
                    color: ${({theme:e})=>e["gray-color"]};
                }
                th,
                td{
                    padding: 7px 16px;
                    &:first-child{
                        ${({theme:e})=>e.rtl?"padding-right":"padding-left"}: 0;
                    }
                    &:last-child{
                        text-align: ${({theme:e})=>e.rtl?"left":"right"};
                        ${({theme:e})=>e.rtl?"padding-left":"padding-right"}: 0;
                    }
                }
            }
        }
    }
`,i.ZP.div`

    .chart-label{
        justify-content: flex-start;
        margin-bottom: 26px;
        display: none
    }

    >.ant-card{
        min-height: 455px;
        @media only screen and (max-width: 1599px){
            min-height: 100%;
        }
    }
    .performance-lineChart{
        ul{
            margin: -25px -25px 20px;
        }

        &.theme-2{
            .custom-label{
                .current-amount{
                    color: ${({theme:e})=>e.pink};
                }
            }
        }
        canvas{
            margin-bottom: 0 !important;
        }
    }
    .custom-label{
        flex-direction: column;
        align-items: flex-start;
        margin: 25px;
        .current-amount{
            display: block;
            font-size: 24px;
            font-weight: 600;
            color: ${({theme:e})=>e["primary-color"]};
        }
        .prev-amount{
            display: block;
            font-size: 24px;
            font-weight: 600;
            color: ${({theme:e})=>e["dark-color"]};
        }
        div{
            span{
                display: inline-block;
            }
        }
    }

    .chartjs-tooltip{
        min-width: 166px !important;
        @media only screen and (max-width: 1199px){
            min-width: 150px !important;
        }
    }
`,i.ZP.div`

    .full-width-table{
        >.ant-card{
            ${({theme:e})=>e.topMenu?"min-height: 555px":"min-height: 500px"};
            @media only screen and (max-width: 1599px){
                min-height: 100%;
            }
        }
        .ant-card-body{
            padding: 0 !important;
        }
    }
    .revenue-table{
        .ant-table-content{
            .ant-table-cell{
                padding: 10px 20px;
                &:first-child{
                    ${({theme:e})=>e.rtl?"padding-right":"padding-left"}: 25px;
                }
                &:last-child{
                    ${({theme:e})=>e.rtl?"padding-left":"padding-right"}: 25px;
                }
            }
            thead{
                th{
                    font-weight: 500;
                    color: ${({theme:e})=>e["dark-color"]};
                    &:last-child{
                        text-align: left;
                    }
                }
            }
            tbody{
                td{
                    color: ${({theme:e})=>e["gray-color"]};
                    padding: 10px 20px;
                    canvas{
                        margin-bottom: 0 !important;
                    }
                }
            }
        }
    }
`,i.ZP.div`
    .revenue-chat-label{
        display: flex;
        flex-direction: column;
        align-items: flex-start;
        .chart-label{
            &:not(:last-child){
                margin-bottom: 18px;
            }
            .label-dot{
                &.dot-Desktop{
                    background: #20C997;
                }
                &.dot-Mobile{
                    background: #5F63F2;
                }
                &.dot-Tablets{
                    background: #FA8B0C;
                }
            }
        }
    }
    .revenue-chart-data{
        p{
            font-size: 18px;
            margin-bottom: 12px;
            &:last-child{
                margin-bottom: 0;
            }
            strong{
                font-weight: 500;
            }
        }
    }
`,i.ZP.div`
    min-height: 450px;
    ${({theme:e})=>e.topMenu?"min-height: 515px":"min-height: 450px"};
    @media only screen and (max-width: 1599px){
        min-height: 400px;
    }
    @media only screen and (max-width: 1199px){
        min-height: 100%;
    }
    .ant-card-body{
        padding: 0 !important;
    }
    .ant-table-content{
        .ant-table-cell{
            white-space: normal !important;
            @media only screen and (max-width: 991px){
                white-space: nowrap !important;
            }
        }
    }
    table{
        thead{
            tr{
                th{
                    background: #fff;
                    border-top: 1px solid ${({theme:e})=>e["border-color-light"]};
                    color: ${({theme:e})=>e["dark-color"]};
                    padding: 16px 25px;
                    text-align: ${({theme:e})=>e.rtl?"left":"right"};
                    &:first-child, &:nth-child(5){
                        text-align: ${({theme:e})=>e.rtl?"right":"left"};
                    }
                }
            }
        }
        tbody{
            tr{
                td{
                    padding: 16px 25px;
                    color: ${({theme:e})=>e["gray-color"]};
                    text-align: ${({theme:e})=>e.rtl?"left":"right"};
                    &:first-child, &:nth-child(5){
                        text-align: ${({theme:e})=>e.rtl?"right":"left"};
                    }
                }
            }
        }
    }
`,i.ZP.div`
  margin: 1rem auto;
  width: 300px;

  svg {
    stroke: #fff;

    /* // All layers are just path elements */
    path {
      fill: #a82b2b;
      cursor: pointer;
      outline: none;

      /* // When a layer is hovered */
      &:hover {
        fill: rgba(168, 43, 43, 0.83);
      }

      /* // When a layer is focused. */
      &:focus {
        fill: rgba(168, 43, 43, 0.6);
      }

      /* // When a layer is 'checked' (via checkedLayers prop). */
      &[aria-checked='true'] {
        fill: rgba(56, 43, 168, 1);
      }

      /* // When a layer is 'selected' (via currentLayers prop). */
      &[aria-current='true'] {
        fill: rgba(56, 43, 168, 0.83);
      }

      /* // You can also highlight a specific layer via it's id */
      &[id='nz-can'] {
        fill: rgba(56, 43, 168, 0.6);
      }
    }
  }
`,i.ZP.div`
    display: block;
    font-family: "Raleway";
    .chart-divider {
        display: block;
        width: 100%;
        height: 100px;
    }
    .chartjs-tooltip {
        opacity: 1;
        position: absolute;
        background: #fff
        box-shadow: 0 8px 10px #9299B815;
        padding: 10px 12px !important;
        border-radius: 3px;
        border: 1px solid #F1F2F6;
        min-width: 80px;
        -webkit-transition: all 0.5s ease;
        transition: all 0.5s ease;
        pointer-events: none;
        transform: translate(-50%, 5%);
        z-index: 222;
        top: 0;
        left: 0;
        @media only screen and (max-width: 1199px){
            padding: 6px 8px !important;
        }
        &:before {
            position: absolute;
            content: '';
            border-top: 5px solid #fff;
            border-left: 5px solid transparent;
            border-right: 5px solid transparent;
            bottom: -5px;
            ${({theme:e})=>e.rtl?"right":"left"}: 50%;
            transform: translateX(-50%);
        }
    }
    .chartjs-tooltip-key {
        display: inline-block;
        width: 10px;
        height: 10px;
        background: "pink";
        ${({theme:e})=>e.rtl?"margin-left":"margin-right"}
        : 10px;
    }
    .tooltip-title {
        color: ${({theme:e})=>e["gray-color"]};
        font-size: 12px;
        font-weight: 500 !important;
        font-family: 'Inter', sans-serif;
        text-transform: capitalize;
        margin-bottom: 4px;
    }
    .tooltip-value {
        color: #63b963;
        font-size: 22px;
        font-weight: 600 !important;
        font-family: 'Inter', sans-serif;
    }
    .tooltip-value sup {
        font-size: 12px;
        @media only screen and (max-width: 1199px){
            font-size: 11px;
        }
    }
    table{
        tbody{
            td{
                font-size: 13px;
                font-weight: 500;
                padding-bottom: 3px;
                white-space: nowrap;
                padding: 2px 0;
                color: ${({theme:e})=>e["dark-color"]};
                @media only screen and (max-width: 1199px){
                    font-size: 12px;
                }
                .data-label{
                    ${({theme:e})=>e.rtl?"margin-right":"margin-left"}: 3px;
                    color: ${({theme:e})=>e["light-gray-color"]};
                }
            }
        }
    }
`);i.ZP.div`
    .ant-card-body{
        padding: 30px 25px !important;
    }
    .sent-emial-chart{
        color: #333;
        canvas{
            margin: 0 auto;
        }
    }
    .sent-emial-data{
        margin-top: 30px;
    }
    .sent-emial-box{
        justify-content: space-between;
        @media only screen and (max-width: 575px){
            align-items: flex-start;
            flex-direction: column;
        }
    }
    .sent-emial-item{
        display: flex;
        @media only screen and (max-width: 575px){
            &:not(:last-child){
                margin-bottom: 15px;
            }
        }
        .sent-emial-icon{
            display: flex;
            align-items: center;
            justify-content: center;
            width: 60px;
            height: 60px;
            border-radius: 10px;
            ${({theme:e})=>e.rtl?"margin-left":"margin-right"}: 10px;
            background-color: ${({theme:e})=>e["primary-color"]}10;
            &.icon-success{
                background-color: ${({theme:e})=>e["success-color"]}10;
            }
            &.icon-primary{
                background-color: ${({theme:e})=>e["primary-color"]}10;
            }
            &.icon-warning{
                background-color: ${({theme:e})=>e["warning-color"]}10;
            }
        }
        .sent-emial-content{
            flex: auto;
            h4{
                font-size: 20px;
                font-weight: 500;
                margin-bottom: 2px;
                strong{
                    font-weight: 500;
                }
            }
            p{
                font-size: 14px;
                font-weight: 400;
                margin-bottom: 0;
                color: ${({theme:e})=>e["gray-color"]};
            }
        }
    }
`,i.ZP.div`
    margin-top: 18px;
    min-height: 314px;
    .recent-deals-table{
        .dealing-author{
            display: flex;
            align-items: center;
            img{
                max-width: 36px;
                border-radius: 50%;
            }
            .dealing-author-info{
                ${({theme:e})=>e.rtl?"margin-right":"margin-left"}: 12px;
                h4{
                    font-size: 14px;
                    font-weight: 600;
                    margin-bottom: 2px;
                }
                p{
                    font-size: 13px;
                    color: #9297AF;
                    margin-bottom: 0;
                }
            }
        }
        .deal-amount{
            font-size: 14px;
            font-weight: 600;
            color: ${({theme:e})=>e["dark-color"]};
        }
        .ant-table-tbody > tr > td{
            padding: 7px 25px;
            border-bottom: 0 none;
        }
    }
`,i.ZP.div`
    .ant-card{
        min-height: 435px;
    }
    .target-progressbar-wrap{
        direction: ltr;
        text-align: center;
        margin-bottom: 70px;
    }
    .s-target-list__item{
        h2{
            font-size: 22px;
            font-weight: 600;
            margin-bottom: 4px;
        }
        &.target-revinue{
            h2{
                color: ${({theme:e})=>e["success-color"]};
            }
        }
        p{
            margin-bottom: 0;
            color: ${({theme:e})=>e["gray-color"]};
        }
    }
`,i.ZP.div`
    @media only screen and (max-width: 1599px){
        min-height: 435px;
        background-color: #fff;
        border-radius: 10px;
    }
    .growth-chart-wrap{
        margin-top: 58px;
    }
    .growth-list__item{
        h2{
            font-size: 22px;
            font-weight: 600;
            line-height: 1.4;
            margin-bottom: 2px;
        }
        p{
            margin-bottom: 0;
            color: ${({theme:e})=>e["gray-color"]};
        }
    }
    canvas{
        margin-bottom: 0 !important;
    }
`,i.ZP.div`
    .top-seller-table{
        min-height: auto;
        .product-info{
            .product-img{
                ${({theme:e})=>e.rtl?"margin-left":"margin-right"}: 15px;
            }
        }
        .ant-table-row {
            .ant-table-cell{
                padding: 15px 15px;
                &:not(first-child){
                    text-align: right;
                }
            }
        }
    }
`},29537:function(e,t,a){a.d(t,{Oe:function(){return o},Q:function(){return r},bw:function(){return l},yY:function(){return n}});var i=a(23481);i.ZP.div`
  background: #fff;
  border-radius: 10px;
  box-shadow: 0px 5px 20px #9299B830;
  padding: 30px;
  .pricing-badge{
    height: 32px;
    padding: 6px 22.6px;
  }
  .price-amount{
    font-size: 36px;
    margin-bottom: 10px;
    .currency{
      font-size: 16px;
      font-weight: 600;
      top: -12px;
      ${({theme:e})=>e.rtl?"margin-right":"margin-left"}: 2px;
      color: ${({theme:e})=>e["extra-light-color"]};
    }
    .pricing-validity{
      font-size: 13px;
      font-weight: 400;
      bottom: 0;
      ${({theme:e})=>e.rtl?"right":"left"}: -2px;
      color: ${({theme:e})=>e["light-color"]};
    }
  }
  .package-user-type{
    font-size: 13px;
    font-weight: 500;
    color: ${({theme:e})=>e["gray-color"]};
  }
  .pricing-title{
    font-size: 24px;
    font-weight: 600;
    margin-bottom: 8px;
  }
  button{
    padding: 0px 29.32px;
    height: 44px;
    border-radius: 6px;
    &.ant-btn-white{
      border: 1px solid #E3E6EF;
      span{
        color: #272b41;
      }
    }
  }
`,i.ZP.div`
  margin: 28px 0 15px;
  min-height: 210px;
  .list-single{
    display: flex;
    align-items: center;
    &:not(:last-child){
      margin-bottom: 12px;
    }
    .icon{
      display: inline-block;
      margin: ${({theme:e})=>e.rtl?"0px 0 -4px 10px":"0px 10px -4px 0"};
    }
  }
`,(0,i.ZP)("span",["type"])`
  display: inline-block;
  margin-bottom: 32px;
  padding: 5px 20px;
  border-radius: 16px;
  background: ${({type:e,theme:t})=>t[`${e}-color`]}10;
  color: ${({type:e,theme:t})=>t[`${e}-color`]};
  font-size: 13px;
  font-weight: 500;
`,i.ZP.nav`
  background: #fff;
  margin-bottom: 25px;
  border-radius: 10px;
  padding: 0px 16px;
  @media only screen and (max-width: 767px){
    padding: 0 12px;
  }
  @media only screen and (max-width: 575px){
    text-align: center;
  }
  ul {
    margin: 0;
    padding: 0;
    list-style-type: none;
    li {
      display: inline-block;
      a {
        position: relative;
        display: block;
        padding: 15px 0;
        margin: 0 12px;
        color: ${({theme:e})=>e["light-color"]};
        @media only screen and (max-width: 767px){
          margin: 0 10px;
        }
        &:after{
          position: absolute;
          ${({theme:e})=>e.rtl?"right":"left"}: 0;
          bottom: 0;
          width: 100%;
          height: 2px;
          border-radius: 10px;
          opacity: 0;
          visibility: hidden;
          background: ${({theme:e})=>e["success-color"]};
          content: "";
        }
        &.active{
          color: ${({theme:e})=>e["success-color"]};
          &:after{
            opacity: 1;
            visibility: visible;
          }
        }
      }
    }
  }
`,i.ZP.nav`
  border-radius: 10px;
  background: #fff;
  box-shadow: 0 5px 20px ${({theme:e})=>e["light-color"]}03;
  figure{
    margin-bottom: 0;
  }
  .gallery-single-content{
    padding: 18px 25px 20px;
    .gallery-single-title{
      font-size: 15px;
      font-weight: 500;
      margin-bottom: 2px;
    }
    p{
      font-size: 13px;
      margin-bottom: 0px;
      color: ${({theme:e})=>e["light-color"]};
    }
  }
`;const o=i.ZP.div`
  text-align: center;
  .user-card{
    &.theme-list{
      .ant-card-body{
        padding: 30px 25px 30px 30px !important;
        @media only screen and (max-width: 479px){
          padding: 25px 20px 25px 20px !important;
        }
      }
      figure{
        display: flex;
        align-items: flex-start;
        justify-content: space-between;
        @media only screen and (max-width: 479px){
          flex-flow: column;
        }
        img{
          max-width: 80px;
          ${({theme:e})=>e.rtl?"margin-left":"margin-right"}:20px;
          @media only screen and (max-width: 479px){
            ${({theme:e})=>e.rtl?"margin-left":"margin-right"}:0px;
          }
        }
      }
      figcaption{
        display: flex;
        justify-content: space-between;
        align-items: flex-start;
        text-align: ${({theme:e})=>e.rtl?"right":"left"};
        @media only screen and (max-width: 379px){
          flex-flow: column;
        }
      }
      .card__content{
        p{
          max-width: 400px;
          font-size: 15px;
          color: ${({theme:e})=>e["gray-color"]};
        }
        .card__designation{
            font-size: 13px;
            margin-bottom: 15px;
            color: ${({theme:e})=>e["light-color"]};
        }
        .card-text{
          margin-bottom: 12px;
        }
        .card-info{
          margin-bottom: 0;
          .user-meta{
            font-size: 14px;
            strong{
              font-weight: 600;
              color: ${({theme:e})=>e["dark-color"]};
            }
          }
          .user-meta + .user-meta{
            ${({theme:e})=>e.rtl?"margin-right":"margin-left"}: 20px;
          }
        }
      }
      .card__actions{
        text-align: ${({theme:e})=>e.rtl?"left":"right"}
        @media only screen and (max-width: 379px){
          margin-top: 15px;
        }
        button{
          padding: 0px 19.05px;
          min-width: 114px;
        }
      }
    }
    &.theme-grid-2{
      .ant-card-body{
        padding: 0 !important;
      }
      figure{
        position: relative;
      }
      .user-card__img{
        margin-bottom: 0;
        position: absolute;
        top: 80px;
        left: 50%;
        transform: translateX(-50%);
        width: 132px;
        height: 132px;
        border-radius: 50%;
        background-color: #fff;
        z-index: 22;
        img{
          position: relative;
          top: 6px;
        }
      }
      .user-card__bg{
        background-size: cover !important;
        background-position: center !important;
        border-radius: 10px 10px 0 0;
      }
      .card__bottom{
        position: relative;
        background-color: #fff;
        top: -26px;
        padding-top: 102px;
        border-radius: 30px 30px 10px 10px;
      }
    }
    &.theme-grid-3{
      .ant-card{
        text-align: left;
      }
      .ant-card-body{
        padding: 0 !important;
      }
      .card__top,
      .card__content,
      .card__info{
        padding: 0 30px;
      }
      .card__top{
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding-top: 30px;
        margin-bottom: 10px;
        .user-card__img{
          margin-right: 12px;
          ${({theme:e})=>e.rtl?"margin-left":"margin-right"}: 12px;
          img{
            max-width: 70px;
          }
        }
        .user-card__info{
          width: 100%;
          position: relative;
          .action-more{
            position: absolute;
            right: 0;
            ${({theme:e})=>e.rtl?"left":"right"}: 0;
            top: 0;
            color: #ADB4D2;
          }
          .card__designation{
            margin-bottom: 0;
          }
        }
      }
      .card__content{
        p{
          font-size: 15px;
          margin-bottom: 26px;
        }
        .image-group{
          margin: -3px;
        }
        img{
          max-width: 34px;
          margin: 3px;
        }
      }
      .card__info{
        padding-bottom: 30px;
        padding-top: 18px;
        .ant-progress-inner{
          position: relative !important;
        }
        p{
          font-size: 12px;
          color: ${({theme:e})=>e["light-color"]};
        }
        h2{
          font-size: 14px;
          font-weight: 500;
          margin-top: 4px;
          margin-bottom: 16px;
        }
        .info-line{
          display: flex;
          justify-content: space-between;
          .success{
            color: ${({theme:e})=>e["success-color"]};
          }
        }
        .completed-count{
          margin-top: 4px;
        }
        .project-progress{
          display: flex;
          justify-content: space-between;
          .progress-percentage{
            ${({theme:e})=>e.rtl?"margin-right":"margin-left"}: 20px;
            span{
              font-size: 12px;
              color: ${({theme:e})=>e["gray-color"]};
            }
          }
          .ant-progress{
            &> div{
              flex-direction: row;
            }
            .ant-progress-text{
              display: none;
            }
          }
        }
      }
    }
  }
  .card{
    position: relative;
    box-shadow: 0 5px 20px ${({theme:e})=>e["light-color"]}03;
    .ant-card-body{
      padding: 30px !important;
      div{
        position: static;
      }
    }
    figure{
      margin-bottom: 0;
      img{
        margin-bottom: 20px;
        width: 100%;
        border-radius: 50%;
        max-width: 150px;
      }
    }
    .card__more_actions{
      position: absolute;
      ${({theme:e})=>e.rtl?"left":"right"}: 24px;
      top: 20px;
      line-height: .5;
      padding: 5px 3px;
      color: ${({theme:e})=>e["extra-light-color"]};
      box-shadow: 0 10px 20px #9299B815;
      svg,
      img{
        width: 20px;
      }
    }
    .card__name{
      font-size: 16px;
      margin-bottom: 6px;
      font-weight: 500;
      a{
        color: ${({theme:e})=>e["dark-color"]};
        &:hover{
          color: ${({theme:e})=>e["success-color"]};
        }
      }
    }
    .card__designation{
      font-size: 13px;
      margin-bottom: 25px;
      color: ${({theme:e})=>e["light-color"]};
    }
    .card__social{
      margin-top: 16px;
      a{
        width: 38px;
        height: 38px;
        border-radius: 50%;
        display: inline-flex;
        align-items: center;
        justify-content: center;
        box-shadow: 0 10px 20px ${({theme:e})=>e["light-color"]}15;
        background: #fff;
        &:not(:last-child){
          ${({theme:e})=>e.rtl?"margin-left":"margin-right"}: 10px;
        }
        &.facebook{
            span.fa, svg{
            color: #3B5998;
          }
        }
        &.twitter {
            span.fa, svg{
            color: #1DA1F2;
          }
        }
        &.dribble {
            span.fa, svg{
            color: #C2185B;
          }
        }
        &.instagram {
            span.fa, svg{
            color: #FF0300;
          }
        }
      }
    }
  }

  .user-card{
    .ant-card-body{
      padding: 30px 25px 18px 25px !important;
      @media only screen and (max-width: 1599px){
        padding: 20px  20px 20px !important;
      }
      @media only screen and (max-width: 767px){
        padding: 15px  15px 15px !important;
      }
    }
    figure{
      img{
        margin-bottom: 18px;
        max-width: 150px;
      }
    }
    .card__actions{
      margin: -5px;
      .ant-btn-white{
        color: ${({theme:e})=>e["gray-color"]};
        border: 1px solid ${({theme:e})=>e["border-color-light"]};
        &:hover{
          border: 1px solid ${({theme:e})=>e["success-color"]};
        }
      }
      button{
        font-size: 13px;
        padding: 0px 22.7px;
        height: 38px;
        border-radius: 6px;
        box-shadow: 0px 3px 5px ${({theme:e})=>e["light-color"]}05;
        margin: 5px;
        &:hover{
          color: #fff !important;
          background-color: ${({theme:e})=>e["success-color"]} !important;
          svg,
          i{
            color: #fff;
          }
        }
        svg,
        i{
          color: ${({theme:e})=>e["light-color"]};
        }
      }
    }
    .card__info{
      padding-top: 20px;
      margin-top: 18px;
      border-top: 1px solid ${({theme:e})=>e["border-color-light"]};
      .info-single{
        text-align: center;
      }
      .info-single__title{
        font-size: 16px;
        font-weight: 600;
        line-height: 1.5;
        margin-bottom: 4px;
      }
      p{
        margin-bottom: 0;
        color: ${({theme:e})=>e["light-color"]};
      }
    }
  }
`,n=(i.ZP.div`
  .faq-badge{
    font-weight: 400;
    color: ${({theme:e})=>e["light-color"]};
    background: ${({theme:e})=>e["bg-color-light"]};
  }
  ul{
    li{
      a{
        display: inline-block;
        font-weight: 500;
        position: relative;
        padding: ${({theme:e})=>e.rtl?"12px 20px 12px 0":"12px 0 12px 20px"};
        transition: all .3s ease;
        color: ${({theme:e})=>e["gray-color"]};
        background-color: #fff;
        &.active{
          padding-left: 28px;
          &:before{
            opacity: 1;
            visibility: visible;
            ${({theme:e})=>e.rtl?"right":"left"}: -15px;
          }
          &:after{
            ${({theme:e})=>e.rtl?"right":"left"}: 5px;
          }
          &.success{
            &:after{
              background: ${({theme:e})=>e["success-color"]};
            }
          }
          &.secondary{
            &:after{
              background: ${({theme:e})=>e["secondary-color"]};
            }
          }
          &.success{
            &:after{
              background: ${({theme:e})=>e["success-color"]};
            }
          }
          &.warning{
            &:after{
              background: ${({theme:e})=>e["warning-color"]};
            }
          }
          &.info{
            &:after{
              background: ${({theme:e})=>e["info-color"]};
            }
          }
          &.danger{
            &:after{
              background: ${({theme:e})=>e["danger-color"]}5;
            }
          }
        }
        &:before{
          position: absolute;
          ${({theme:e})=>e.rtl?"right":"left"}: -25px;
          top: 0;
          height: 100%;
          width: 2px;
          border-radius: 10px;
          opacity: 0;
          visibility: hidden;
          content: '';
          background: ${({theme:e})=>e["success-color"]};
          transition: all .3s ease;
        }
        &:after{
          position: absolute;
          ${({theme:e})=>e.rtl?"right":"left"}: 0;
          top: 50%;
          transform: translatey(-50%);
          width: 8px;
          height: 8px;
          border-radius: 50%;
          content: '';
          background: ${({theme:e})=>e["success-color"]}50;
          transition: all .3s ease;
        }
        &.secondary{
          &:after{
            background: ${({theme:e})=>e["secondary-color"]}50;
          }
          &:before{
            background: ${({theme:e})=>e["secondary-color"]};
          }
        }
        &.success{
          &:after{
            background: ${({theme:e})=>e["success-color"]}50;
          }
          &:before{
            background: ${({theme:e})=>e["success-color"]};
          }
        }
        &.warning{
          &:after{
            background: ${({theme:e})=>e["warning-color"]}50;
          }
          &:before{
            background: ${({theme:e})=>e["warning-color"]};
          }
        }
        &.info{
          &:after{
            background: ${({theme:e})=>e["info-color"]}50;
          }
          &:before{
            background: ${({theme:e})=>e["info-color"]};
          }
        }
        &.danger{
          &:after{
            background: ${({theme:e})=>e["danger-color"]}50;
          }
          &:before{
            background: ${({theme:e})=>e["danger-color"]};
          }
        }
      }
    }
  }
`,i.ZP.div`
  text-align: center;
  .ant-card-body{
    padding: 30px 50px 40px 50px !important;
    @media only screen and (max-width: 1599px){
      padding: 30px !important;
    }
    @media only screen and (max-width: 991px){
      padding: 25px !important;
    }
  }
  figure{
    margin-bottom: 30px;
    img{
      width: 100%;
    }
  }
  h1,
  h2,
  h3,
  h4,
  h5,
  h6{
    font-size: 18px;
    font-weight: 500;
    margin-bottom: 20px;
    color: ${({theme:e})=>e["dark-color"]};
  }
  button{
    padding: 0 30px;
    border-radius: 6px;
    height: 44px;
  }
`,i.ZP.div`
  .ant-card{
    .ant-card-body{
      h1{
        font-weight: 500;
      }
    }
  }
  .ant-collapse{
    margin-top: 25px;
    &.ant-collapse-borderless{
      background: #fff;
    }
    &.ant-collapse-icon-position-left{
      .ant-collapse-header{
        color: ${({theme:e})=>e["dark-color"]} !important;
      }
    }
  }
  .ant-collapse-item{
    border: 1px solid ${({theme:e})=>e["border-color-light"]} !important;
    margin-bottom: 5px;
    &.ant-collapse-item-active{
      box-shadow: 0px 15px 40px ${({theme:e})=>e["light-color"]}15;
    }
    .ant-collapse-header{
      font-weight: 500;
      font-size: 15px;
      background-color: #fff;
      padding: 18px 25px !important;
      border-radius: 5px !important;
      @media only screen and (max-width: 575px){
        padding: ${({theme:e})=>e.rtl?"15px 15px 15px 45px":"15px 45px 15px 15px"} !important;
      }
      .ant-collapse-arrow{
        ${({theme:e})=>e.rtl?"right":"left"}: auto !important;
        ${({theme:e})=>e.rtl?"left":"right"}: 25px !important;
        top: 22px !important;
        transform: translateY(0) !important;
      }
    }
  }

  .ant-collapse-content{
    background-color: #fff !important;
    box-shadow: 0 15px 40px ${({theme:e})=>e["light-color"]}15;
    .ant-collapse-content-box{
      border-top: 1px solid ${({theme:e})=>e["border-color-light"]} !important;
      padding: 20px 25px 30px !important;
      P{
        font-size: 15px;
        margin-bottom: 35px;
        line-height: 1.667;
        color: ${({theme:e})=>e["gray-color"]};
      }
      h1,
      h2,
      h3,
      h4,
      h5,
      h6{
        font-size: 14px;
        font-weight: 500;
        margin-bottom: 12px;
        color: ${({theme:e})=>e["dark-color"]};
      }
      .panel-actions{
        display: flex;
        button{
          height: 36px;
          padding: 0 15px;
          &:not(:last-child){
            ${({theme:e})=>e.rtl?"margin-left":"margin-right"}: 10px;
          }
        }
      }
    }
  }
`,i.ZP.div`
  .ant-select{
    @media only screen and (max-width: 575px){
      width: 100% !important;
    }
  }
  .ant-select-selector{
    height: 48px !important;
    .ant-select-selection-search{
      height: 48px;
      width: 100% !important;
      input{
        height: 46px !important;
      }
    }
    .ant-input-affix-wrapper{
      border: 0 none;
      padding-top: 0 !important;
      padding-bottom: 0 !important;
    }
    .ant-select-selection-search-input {
      border-radius: 100px;
    }
  }
  .ant-input-suffix{
    i{
      font-size: 14px;
      top: 0 !important;
    }
    svg{
      width: 14px;
      height: 14px;
    }
  }
  .search-filter-menu{
    margin: 22px 0 20px;
    @media only screen and (max-width: 575px){
      text-align: center;
    }
    ul{
      li{
        display: inline-block;
        margin-bottom: 10px;
        &:not(:last-child){
          ${({theme:e})=>e.rtl?"margin-left":"margin-right"}: 10px;
        }
        a{
          font-size: 13px;
          font-weight: 500;
          display: block;
          padding: 5px 15px;
          border-radius: 5px;
          color: ${({theme:e})=>e["light-color"]};
          box-shadow: 0 3px 6px ${({theme:e})=>e["light-color"]}05;
          background: #fff;
          &.active{
            color: #fff;
            background: ${({theme:e})=>e["success-color"]};
          }
        }
      }
    }
  }
`),r=(i.ZP.div`
  .result-list-top{
    max-width: 1000px;
    border-bottom: 1px solid ${({theme:e})=>e["border-color-light"]};
    margin-bottom: 20px;
    padding-bottom: 24px;
  }
  .search-found-text{
    font-size: 16px;
    margin-bottom: 0;
    color: ${({theme:e})=>e["light-color"]};
    .result-count{
      ${({theme:e})=>e.rtl?"margin-left":"margin-right"}: 5px;
    }
    .result-keyword{
      ${({theme:e})=>e.rtl?"margin-right":"margin-left"}: 4px;
    }
    .result-count,
    .result-keyword{
      font-weight: 600;
      color: ${({theme:e})=>e["dark-color"]};
    }
  }
  .result-limit{
    text-align: ${({theme:e})=>e.rtl?"left":"right"};
    margin-bottom: 0;
    color: ${({theme:e})=>e["light-color"]};
    @media only screen and (max-width: 767px){
      text-align: ${({theme:e})=>e.rtl?"right":"left"};
      margin-top: 10px;
    }
  }
  .result-list-content{
    border-bottom: 1px solid ${({theme:e})=>e["border-color-light"]};
    padding-bottom: 14px;
    margin-bottom: 30px;
    ul{
      li{
        &:not(:last-child){
          margin-bottom: 35px;
        }
        .result-list-title{
          font-size: 16px;
          font-weight: 500;
          margin-bottom: 10px;
          .search-keyword{
            font-weight: 600;
            color: ${({theme:e})=>e["success-color"]};
          }
        }
        p{
          color: ${({theme:e})=>e["gray-color"]};
        }
      }
    }
  }
  .ant-pagination{
    @media only screen and (max-width: 575px){
      text-align: center;
    }
  }
`,i.ZP.div`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  width: 100%;
  min-height: 100vh;
  text-align: center;
  img{
    margin-bottom: 72px;
    max-width: 400px;
    width: 100%;
    @media only screen and (max-width: 575px){
      margin-bottom: 30px;
    }
  }
  h1,
  h2,
  h3,
  h4,
  h5,
  h6{
    font-size: 18px;
    font-weight: 500;
    margin-bottom: 15px;
  }
  p{
    color: ${({theme:e})=>e["gray-color"]};
  }
`,i.ZP.div`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  width: 100%;
  min-height: 100vh;
  text-align: center;
  img{
    margin-bottom: 100px;
    max-width: 400px;
    width: 100%;
    @media only screen and (max-width: 575px){
      margin-bottom: 30px;
    }
  }
  .error-text{
    font-size: 60px;
    font-weight: 600;
    margin-bottom: 35px;
    color: ${({theme:e})=>e["extra-light-color"]};
  }
  p{
    font-size: 18px;
    font-weight: 500;
    margin-bottom: 26px;
  }
  button{
    height: 44px;
  }
`,i.ZP.div`
  text-align: center;
  background: #fff;
  padding: 75px 0 30px;
  margin-bottom: 30px;
  @media only screen and (max-width: 1150px){
    padding: 50px 0 6px;
  }
  @media only screen and (max-width: 991px){
    padding: 20px 0 0px;
  }
  .strikingDash-logo{
    margin-bottom: 55px;
    @media only screen and (max-width: 1150px){
      margin-bottom: 30px;
    }
    @media only screen and (max-width: 767px){
      margin-bottom: 25px;
    }
    img{
      max-width: 170px;
    }
  }
  .coming-soon-content{
    h1{
      font-size: 58px;
      font-weight: 600;
      line-height: 1.5;
      margin-bottom: 25px;
      color: ${({theme:e})=>e["dark-color"]};
      @media only screen and (max-width: 991px){
        font-size: 48px;
        margin-bottom: 15px;
      }
      @media only screen and (max-width: 767px){
        font-size: 40px;
        line-height: 1.45;
      }
      @media only screen and (max-width: 479px){
        font-size: 30px;
      }
      @media only screen and (max-width: 375px){
        font-size: 20px;
      }
    }
    p{
      font-size: 17px;
      max-width: 580px;
      margin: 0 auto 25px;
      color: ${({theme:e})=>e["gray-color"]};
      @media only screen and (max-width: 991px){
        margin-bottom: 15px;
      }
      @media only screen and (max-width: 767px){
        font-size: 16px;
      }
      @media only screen and (max-width: 375px){
        font-size: 15px;
      }
    }
  }
  .countdwon-data{
    display: flex;
    justify-content: center;
    >span{
      &:not(:last-child){
        margin-right: 50px;
        ${({theme:e})=>e.rtl?"margin-left":"margin-right"}: 50px;
        @media only screen and (max-width: 575px){
          margin-right: 20px;
          ${({theme:e})=>e.rtl?"margin-left":"margin-right"}: 20px;
        }
      }
    }
  }
  .strikingDash-countdown{
    .countdown-time{
      font-size: 42px;
      font-weight: 600;
      line-height: 1.45;
      color: ${({theme:e})=>e["dark-color"]};
      @media only screen and (max-width: 991px){
        font-size: 32px;
      }
      @media only screen and (max-width: 575px){
        font-size: 26px;
      }
      @media only screen and (max-width: 375px){
        font-size: 20px;
      }
    }
    .countdown-title{
      font-size: 16px;
      font-weight: 400;
      display: block;
      color: ${({theme:e})=>e["gray-color"]};
      @media only screen and (max-width: 375px){
        font-size: 15px;
      }
    }
  }
  .subscription-form{
    margin-top: 40px;
    @media only screen and (max-width: 991px){
      margin-top: 25px;
    }
    @media only screen and (max-width: 1150px){
      margin-top: 35px;
    }
    .subscription-form-inner{
      display: flex;
      justify-content: center;
      @media only screen and (max-width: 375px){
        flex-flow: column;
        margin-bottom: 20px;
      }
      .ant-form-item-control{
        margin-right: 20px;
        ${({theme:e})=>e.rtl?"margin-left":"margin-right"}: 20px;
        @media only screen and (max-width: 375px){
          margin-right: 0;
          ${({theme:e})=>e.rtl?"margin-left":"margin-right"}: 0;
        }
        .ant-input{
          min-width: 320px;
          padding: 12px 20px;
          @media only screen and (max-width: 767px){
            min-width: 100%;
          }
          &::placeholder{
            color: ${({theme:e})=>e["extra-light-color"]};
          }
        }
      }
      button{
        font-size: 14px;
        text-transform: uppercase;
        font-weight: 500;
      }
    }
  }
  .coming-soon-social{
    margin-top: 50px;
    @media only screen and (max-width: 1150px){
      margin-top: 25px;
    }
    @media only screen and (max-width: 767px){
      margin-top: 30px;
    }
    ul{
      margin-bottom: 30px;
      li{
        display: inline-block;
        &:not(:last-child){
          margin-right: 15px;
          ${({theme:e})=>e.rtl?"margin-left":"margin-right"}: 15px;
        }
        a{
          display: flex;
          align-items: center;
          justify-content: center;
          width: 44px;
          height: 44px;
          border-radius: 50%;
          i,
          span,
          svg{
            color: #fff;
          }
          &.facebook{
            background-color: #3B5998;
          }
          &.twitter{
            background-color: #1DA1F2;
          }
          &.globe{
            background-color: #DD3E7C;
          }
          &.github{
            background-color: #23282D;
          }
        }
      }
    }
    p{
      font-size: 14px;
      color: ${({theme:e})=>e["light-color"]};
    }
  }
`,i.ZP.div`
  .form-title{
    font-size: 18px;
    font-weight: 500;
    margin-bottom: 36px;
  }
  .add-user-wrap{
   $:
  }
  .add-user-bottom{
    margin-top: 20px;
    button + button{
      ${({theme:e})=>e.rtl?"margin-right":"margin-left"}: 15px;
    }
    .ant-btn-light{
      background: ${({theme:e})=>e["bg-color-light"]};
      border: 1px solid #F1F2F6;
    }
    &.text-right{
      @media only screen and (max-width: 767px){
        text-align: ${({theme:e})=>e.rtl?"right":"left"} !important;
      }
    }
  }
  .card-nav{
    ul{
      flex-wrap: wrap;
      margin-bottom: -4px -10px;
      @media only screen and (max-width: 575px){
        justify-content: center;
      }
      li{
        margin: 4px 10px !important;
        &:not(:last-child){
          ${({theme:e})=>e.rtl?"margin-left":"margin-right"}: 26px;
          @media only screen and (max-width: 575px){
            ${({theme:e})=>e.rtl?"margin-left":"margin-right"}: 0;
          }
        }
        a{
          position: relative;
          padding: 22px 0;
          font-size: 14px;
          font-weight: 500;
          color: ${({theme:e})=>e["gray-color"]};
          @media only screen and (max-width: 575px){
            padding: 0;
          }
          &:after{
            position: absolute;
            ${({theme:e})=>e.rtl?"right":"left"}: 0;
            bottom: -4px;
            width: 100%;
            height: 2px;
            border-radius: 4px;
            content: '';
            opacity: 0;
            visibility: hidden;
            background-color: ${({theme:e})=>e["success-color"]};
            @media only screen and (max-width: 575px){
              display: none;
            }
          }
          &.active{
            color: ${({theme:e})=>e["success-color"]};
            &:after{
              opacity: 1;
              visibility: visible;
            }
            svg,
            img,
            i,
            span{
              color: ${({theme:e})=>e["success-color"]};
            }
          }
          svg,
          img,
          i,
          span{
            color: ${({theme:e})=>e["light-color"]};
            ${({theme:e})=>e.rtl?"margin-left":"margin-right"}: 10px;
          }
        }
      }
    }
  }

  /* // Photo Upload */
  .photo-upload{
    position: relative;
    max-width: 260px;
    margin-bottom: 30px;
    .ant-upload-select{
      display: inline-flex;
      align-items: center;
      justify-content: center;
      height: 40px;
      width: 40px;
      border-radius: 50%;
      position: absolute;
      ${({theme:e})=>e.rtl?"right":"left"}: 85px;
      bottom: 5px;
      z-index: 10;
      background-color: ${({theme:e})=>e["white-color"]};
      span{
        display: inline-flex;
        align-items: center;
        justify-content: center;
        width: 32px;
        height: 32px;
        border-radius: 50%;
        z-index: -1;
        background-color: ${({theme:e})=>e["success-color"]};
      }
      svg,
      i,
      span{
        color: ${({theme:e})=>e["white-color"]};
      }
      a{
        display: flex;
        align-items: center;
        justify-content: center;
      }
    }
    img{
      border-radius: 50%;
    }
    .info{
      background-color: transparent;
    }
    figcaption{
      ${({theme:e})=>e.rtl?"margin-right":"margin-left"}: 20px;
      .info{
        h1,
        h2,
        h3,
        h4,
        h5,
        h6{
          font-size: 15px;
          font-weight: 500;
        }
      }
    }
  }

  .user-work-form{
    .ant-picker{
      padding: 0 15px 0 0;
    }
  }
  .user-info-form{
    .ant-select-single .ant-select-selector .ant-select-selection-item{
      color: ${({theme:e})=>e["gray-color"]};
    }
  }
  .social-form{
    .ant-form-item-control-input-content{
      .ant-input-prefix{
        width: 44px;
        height: 44px;
        border-radius: 4px;
      }
    }
    .ant-form-item-control-input{
      height: 44px;
      .ant-input-affix-wrapper{
        &:hover,
        &:focus,
        &.ant-input-affix-wrapper-focused{
          border-color: #E3E6EF;
        }
        .ant-input{
          height: 42px;
          ${({theme:e})=>e.rtl?"padding-right":"padding-left"}: 0;
        }
      }
    }
    .ant-input-prefix{
      position: relative;
      ${({theme:e})=>e.rtl?"right":"left"}: -11px;
      span{
        display: flex;
        align-items: center;
        justify-content: center;
        border-radius: 4px;
        width: 100%;
        height: 100%;
        background-color: ${({theme:e})=>e["success-color"]};
        i,
        svg,
        span.fa{
          color: #fff;
          font-size: 16px;
        }
        .fa-facebook{
          background-color: #3B5998;
        }
        .fa-twitter{
          background-color: #38B8FF;
        }
        .fa-linkedin{
          background-color: #2CAAE1;
        }
        .fa-instagram{
          background-color: #FF0300;
        }
        .fa-github{
          background-color: #292929;
        }
        .fa-youtube{
          background-color: #FE0909;
        }
      }
    }
  }
`,i.ZP.div`
   .ant-card-head{
     .ant-card-head-title{
       .v-num{
        $: 0;
         font-size: 18px;
         color: ${({theme:e})=>e["dark-color"]};
       }
       .sign{
         font-size: 18px;
         color: ${({theme:e})=>e["dark-color"]};
         display: inline-block;
         margin: 0 8px;
       }
       .rl-date{
        $: 0;
         font-weight: 400;
         font-size: 16px;
       }
     }
   }
  .version-list{
    .version-list__single{
      &:not(:last-child){
        margin-bottom: 30px;
      }
      ul{
        li{
          position: relative;
          ${({theme:e})=>e.rtl?"padding-right":"padding-left"}: 20px;
          font-size: 16px;
          color: ${({theme:e})=>e["gray-color"]};
          &:not(:last-child){
            margin-bottom: 12px;
          }
          &:after{
            position: absolute;
            ${({theme:e})=>e.rtl?"right":"left"}: 0;
            top: 50%;
            transform: translateY(-50%);
            width: 6px;
            height: 6px;
            border-radius: 50%;
            content: "";
          }
        }
        &.version-success{
          li{
            &:after{
              background-color: ${({theme:e})=>e["success-color"]};
            }
          }
        }
        &.version-success{
          li{
            &:after{
              background-color: ${({theme:e})=>e["success-color"]};
            }
          }
        }
        &.version-info{
          li{
            &:after{
              background-color: ${({theme:e})=>e["info-color"]};
            }
          }
        }
      }
    }
    .version-list__top{
      .badge{
        font-size: 12px;
        line-height: 1.2;
        letter-spacing: 1.4px;
        font-weight: 500;
        display: inline-block;
        padding: 5px 8px;
        height: auto;
        border-radius: 4px;
        margin-bottom: 14px;
        color: #fff;
        &.badge-success{
          background-color: ${({theme:e})=>e["success-color"]};
        }
        &.badge-info{
          background-color: ${({theme:e})=>e["info-color"]};
        }
        &.badge-success{
          background-color: ${({theme:e})=>e["success-color"]};
        }
      }
    }
  }

  .changelog-accordion{
    margin-top: 30px;
    .ant-collapse{
      background-color: transparent;
      border: 0 none;
    }
    .ant-collapse-item{
      border-radius: 6px;
      border: 1px solid ${({theme:e})=>e["border-color-normal"]};
      &:not(:last-child){
        margin-bottom: 20px;
      }
      &:last-child{
        border-radius: 6px;
        .ant-collapse-header{
          border-radius: 6px;
        }
      }
    }
    .ant-collapse-header{
      border-radius: 6px;
      padding: 20px 30px 18px 30px !important;
      @media only screen and (max-width: 575px){
        padding: 16px 20px 14px 20px !important;
      }
      .ant-collapse-arrow{
        left: auto !important;
        right: 30px;
        svg,
        img{
          width: 14px;
        }
      }
      .v-num{
        font-size: 18px;
        font-weight: 500;
        color: ${({theme:e})=>e["dark-color"]};
        @media only screen and (max-width: 575px){
          font-size: 16px;
        }
      }
      .rl-date{
        font-size: 16px;
        font-weight: 400;
        @media only screen and (max-width: 575px){
          font-size: 14px;
        }
      }
    }
    .ant-collapse-content{
      border-radius: 0 0 6px 6px;
      > .ant-collapse-content-box{
        padding: 30px 30px 25px;
      }
    }
  }
`,i.ZP.div`
  .history-title{
    font-size: 11px;
    margin-bottom: 24px;
    color: ${({theme:e})=>e["light-gray-color"]};
  }
  .v-history-list{
    li{
      display: flex;
      justify-content: space-between;
      &:not(:last-child){
        margin-bottom: 24px;
      }
      .version-name{
        font-size: 14px;
        font-weight: 500;
        color: ${({theme:e})=>e["dark-color"]};
      }
      .version-date{
        font-size: 14px;
        color: ${({theme:e})=>e["light-gray-color"]};
      }
    }
  }
`,i.ZP.div`
  position: relative;
  padding: 0 150px;
  .button-group {
      width: 100%;
      display: flex;
      justify-content: space-between;
      position: absolute;
      top: 50%;
      left: 0;
  }
`,i.ZP.div`
  .ant-card{
    direction: ltr;
  }
  .ant-card-body{
    padding: 0 !important;
  }
  .testimonial-block{
    .swiper-button-prev,
    .swiper-button-next{
      width: 44px;
      height: 44px;
      border-radius: 50%;
      box-shadow: 0 3px 10px ${({theme:e})=>e["dark-color"]}16;
      @media only screen and (max-width: 991px){
        width: 35px;
        height: 35px;
      }
      &:after{
        line-height: 0;
      }
    }
    .testimonial-title{
      font-size: 30px;
      font-weight: 600;
      margin-bottom: 50px;
      color: ${({theme:e})=>e["dark-color"]};
      @media only screen and (max-width: 991px){
        font-size: 24px;
      }
    }
    &.theme-1{
      padding: 60px 100px 75px 100px;
      @media only screen and (max-width: 1599px){
        padding: 60px 50px 75px 50px;
      }
      @media only screen and (max-width: 1399px){
        padding: 50px 25px 45px 25px;
      }
      .testimonial-title{
        margin-bottom: 0;
      }
      .swiper-button-prev,
      .swiper-button-next{
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        position: absolute;
        top: 50%;
        transform: translateY(-80%);
        z-index: 22;
        background-color: #fff;
      }
      .swiper-button-prev{
        left: 10px;
        &:before{
          font-family: 'Inter';
          content: url('${a(47156)}');
        }
      }
      .swiper-button-next{
        right: 10px;
        &:before{
          font-family: 'Inter';
          content: url('${a(84908)}');
        }
      }
      .swiper-pagination{
        .swiper-pagination-bullet{
          width: 10px;
          height: 10px;
          background-color: #DCDDFA;
          opacity: 1;
          &.swiper-pagination-bullet-active{
            background-color: ${({theme:e})=>e["success-color"]};
          }
        }
      }
      .swiper-container{
        padding: 40px 25px 60px;
      }
      .swiper-slide {
        text-align: center;
        background-color: #fff;
        border-radius: 8px;
        padding: 40px;
        box-shadow: 0 10px 20px ${({theme:e})=>e["light-color"]}10;
        @media only screen and (max-width: 1399px){
          padding: 25px;
        }
        @media only screen and (max-width: 479px){
          padding: 25px 15px;
        }
        &.swiper-slide-active{
          box-shadow: 0 20px 50px ${({theme:e})=>e["light-color"]}20;
        }
      }
      .testimonial-block__single{
          figure{
            margin-bottom: 0;
            img{
              margin-bottom: 12px;
            }
          }
          .client-name{
            font-size: 15px;
            margin-bottom: 5px;
            color: ${({theme:e})=>e["dark-color"]}
          }
          .client-designation{
            font-size: 13px;
            font-weight: 400;
            opacity: .70;
            margin-bottom: 26px;
            color: ${({theme:e})=>e["gray-color"]};
          }
          .client-review{
            font-size: 16px;
            margin-bottom: 0;
            line-height: 1.75;
            color: ${({theme:e})=>e["gray-color"]};
          }
      }
    }
    &.theme-2{
      padding: 60px 100px 75px 100px;
      background-color: ${({theme:e})=>e["bg-color-light"]};
      @media only screen and (max-width: 1399px){
        padding: 60px 40px 75px 40px;
      }
      @media only screen and (max-width: 991px){
        padding: 50px 70px 55px 70px;
      }
      @media only screen and (max-width: 575px){
        padding: 30px 30px 45px 30px;
      }
      .testimonial-title{
        @media only screen and (max-width: 991px){
          margin-bottom: 20px;
        }
      }
      .swiper-button-prev,
      .swiper-button-next{
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        position: absolute;
        top: 50%;
        transform: translateY(-50%);
        z-index: 22;
        background-color: #fff;
        @media only screen and (max-width: 991px){
          top: auto;
          bottom: -6px;
        }
      }
      .swiper-button-prev{
        left: 5px;
        @media only screen and (max-width: 991px){
          left: 42%;
        }
        @media only screen and (max-width: 575px){
          left: 36%;
        }
        &:before{
          font-family: 'Inter';
          content: url('${a(47156)}');
        }
      }
      .swiper-button-next{
        right: 5px;
        @media only screen and (max-width: 991px){
          right: 42%;
        }
        @media only screen and (max-width: 575px){
          right: 36%;
        }
        &:before{
          font-family: 'Inter';
          content: url('${a(84908)}');
        }
      }
      .swiper-container{
        padding: 0 20px;
        @media only screen and (max-width: 991px){
          padding: 30px 0 70px 0;
        }
      }
      .swiper-slide {
        background-color: #fff;
        border-radius: 8px;
        padding: 40px;
        box-shadow: 0 10px 30px ${({theme:e})=>e["light-color"]}10;
        @media only screen and (max-width: 479px){
          padding: 24px;
        }
      }
      .testimonial-block__single{
        position: relative;
        .quotation{
          position: absolute;
          ${({theme:e})=>e.rtl?"left":"right"}: 40px;
          top: 40px;
          @media only screen and (max-width: 479px){
            ${({theme:e})=>e.rtl?"left":"right"}: 25px;
          }
          img{
            @media only screen and (max-width: 479px){
              max-width: 40px;
            }
          }
        }
      }
      .testimonial-block__author{
        direction: ${({theme:e})=>e.rtl?"rtl":"ltr"};
        display: flex;
        align-items: center;
        margin-bottom: 22px;
        img{
          max-width: 70px;
          margin-right: 18px;
          ${({theme:e})=>e.rtl?"margin-left":"margin-right"}: 18px;
          @media only screen and (max-width: 479px){
            max-width: 60px;
            ${({theme:e})=>e.rtl?"margin-left":"margin-right"}: 10px;
          }
        }
        .author-info{
          .client-name{
            font-size: 15px;
            font-weight: 500;
            margin-bottom: 5px;
          }
          .client-designation{
            font-size: 13px;
            opacity: .70;
            margin-bottom: 0;
          }
          .info{
            background-color: #fff;
          }
        }
      }
      .testimonial-block__review{
        direction: ${({theme:e})=>e.rtl?"rtl":"ltr"};
        p{
          margin-bottom: 0;
          line-height: 1.75;
          font-size: 16px;
          color: ${({theme:e})=>e["gray-color"]};
        }
      }
    }
    &.theme-3{
      padding-top: 95px;
      @media only screen and (max-width: 991px){
        padding-top: 42px;
      }
      .testimonial-title{
        margin-bottom: 0;
      }
      .swiper-pagination {
        position: absolute;
        height: fit-content;
        top: 45px;
        left: 50%;
        transform: translateX(-50%);
        @media only screen and (max-width: 575px){
          top: 20px;
        }
        .pagination-thumb{
          display: inline-block;
          width: auto;
          height: auto;
          opacity: .4;
          margin: 4px 0;
          img{
            max-width: 70px;
            @media only screen and (max-width: 991px){
              max-width: 40px;
            }
            @media only screen and (max-width: 479px){
              max-width: 25px;
            }
          }
          &.swiper-pagination-bullet-active{
            position: relative;
            z-index: 22;
            opacity: 1;
            img{
              transform: scale(1.4);
            }
          }
        }
      }
      .testimonial-block__single{
        padding: 175px 0 86px;
        @media only screen and (max-width: 991px){
          padding: 135px 30px 36px;
        }
        @media only screen and (max-width: 575px){
          padding: 80px 30px 40px;
        }
      }
      .testimonial-block__inner{
        max-width: 800px;
        margin: 0 auto;
        text-align: center;
      }
      .testimonial-block__review{
        p{
          font-size: 16px;
          color: ${({theme:e})=>e["gray-color"]};
        }
      }
      .testimonial-block__author{
        .author-info{
          margin-top: 8px;
        }
        .author-name{
          font-size: 16px;
          font-weight: 500;
          margin-bottom: 3px;
        }
        .author-designation{
          opacity: .70;
          font-size: 14px;
        }
      }
    }
    &.theme-4{
      padding: 60px 100px 75px 100px;
      background-color: ${({theme:e})=>e["bg-color-light"]};
      @media only screen and (max-width: 1599px){
        padding: 60px 60px 75px 60px;
      }
      @media only screen and (max-width: 991px){
        padding: 50px 30px 48px 30px;
      }
      .swiper-button-prev,
      .swiper-button-next{
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        position: absolute;
        top: 50%;
        transform: translateY(-50%);
        z-index: 22;
        background-color: #fff;
        @media only screen and (max-width: 575px){
          top: auto;
          bottom: -6px;
        }
      }
      .swiper-button-prev{
        left: 100px;
        @media only screen and (max-width: 1599px){
          left: 50px;
        }
        @media only screen and (max-width: 575px){
          left: 36%;
        }
        &:before{
          font-family: 'Inter';
          content: url('${a(47156)}');
        }
      }
      .swiper-button-next{
        right: 100px;
        @media only screen and (max-width: 1599px){
          right: 50px;
        }
        @media only screen and (max-width: 575px){
          right: 36%;
        }
        &:before{
          font-family: 'Inter';
          content: url('${a(84908)}');
        }
      }
      .swiper-container{
        @media only screen and (max-width: 575px){
          padding: 0 0 70px;
        }
      }
      .testimonial-block__inner{
        max-width: 1000px;
        margin: 0 auto;
        padding: 50px;
        background-color: #fff;
        box-shadow: 0 10px 30px ${({theme:e})=>e["light-color"]}10;
        text-align: center;
        @media only screen and (max-width: 1599px){
          max-width: 570px;
          padding: 30px;
        }
        @media only screen and (max-width: 991px){
          max-width: 450px;
        }
      }
      .testimonial-block__author{
        img{
          max-width: 100px;
          margin-bottom: 26px;
        }
      }
      .author-info{
        margin-top: 18px;
        .client-name{
          font-size: 15px;
          font-weight: 500;
          margin-bottom: 5px;
        }
        .client-designation{
          font-size: 13px;
          opacity: .70;
          margin-bottom: 0;
        }
      }
      .testimonial-block__review{
        p{
          margin-bottom: 0;
          line-height: 1.75;
          font-size: 16px;
          color: ${({theme:e})=>e["gray-color"]};
        }
      }
    }
  }
  .testimonial-title{
    text-align: center;
  }
`,i.ZP.div`
  background-color: ${({theme:e})=>e["bg-color-light"]};
  border-radius: 10px;
  box-shadow: 0 5px 20px #9299B810;
  margin-bottom: 50px;
  .sDash-support-container{
    max-width: 1110px;
    margin: 0 auto;
    @media only screen and (max-width: 1599px){
      max-width: 990px;
    }
    @media only screen and (max-width: 1399px){
      max-width: 790px;
    }
    @media only screen and (max-width: 1150px){
      max-width: 100%;
      padding: 30px
    }
  }
  .sDash_support-content{
    .sDash_support-content__title{
      font-size: 30px;
      font-weight: 600;
      margin-bottom: 10px;
      color: ${({theme:e})=>e["dark-color"]};
      @media only screen and (max-width: 767px){
        font-size: 26px;
      }
    }
    p{
      color: ${({theme:e})=>e["gray-color"]};
    }
    .btn-ticket{
      margin-top: 15px;
      height: 46px;
      font-size: 14px;
      font-weight: 500;
      @media only screen and (max-width: 575px){
        margin-top: 0;
      }
    }
  }
  .sDash_support-img{
    margin-top: 50px;
    @media only screen and (max-width: 1150px){
      margin-top: 0;
    }
    img{
      width: 100%;
      @media only screen and (max-width: 575px){
        margin-top: 30px;
      }
    }
  }
`,i.ZP.div`
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
`),l=i.ZP.div`
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
`;i.ZP.div`
  background-color: #fff;
  border-radius: 10px;
  box-shadow: 0 5px 20px #9299B810;
  padding: 100px 0 50px 0;
  @media only screen and (max-width: 1599px){
    padding: 50px 0 20px 0;
  }
  @media only screen and (max-width: 1199px){
    margin-bottom: 30px;
  }
  .sDash-support-container{
    max-width: 1110px;
    margin: 0 auto;
    @media only screen and (max-width: 1599px){
      max-width: 990px;
    }
    @media only screen and (max-width: 1399px){
      max-width: 790px;
    }
    @media only screen and (max-width: 1150px){
      max-width: 100%;
      padding: 30px
    }
  }
  .sDash-support-link-item{
    max-width: 350px;
    margin: 0 auto 30px;
    padding: 30px;
    text-align: center;
    border-radius: 6px;
    transiiton: .35s;
    border: 1px solid ${({theme:e})=>e["border-color-light"]};
    &:hover{
      box-shadow: 0 15px 25px #9299BB15;
      border-color: #fff;
    }
    .sDash-support-link-item__icon{
      height: 80px;
      width: 80px;
      margin: 0 auto 28px;
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 50%;
      &.success{
        background-color: ${({theme:e})=>e["success-color"]};
      }
      &.success{
        background-color: ${({theme:e})=>e["success-color"]};
      }
      &.info{
        background-color: ${({theme:e})=>e["info-color"]};
      }
    }
    .sDash-support-link-item__title{
      font-size: 20px;
      font-weight: 500;
      color: ${({theme:e})=>e["dark-color"]};
    }
    .sDash-support-link-item__content{
      .btn-link{
        display: flex;
        align-items: center;
        justify-content: center;
        height: 40px;
        background-color: #EFEFFE;
        border-radius: 20px;
        margin: 36px auto 0;
        font-size: 15px;
        padding: 0 24.5px;
        width: fit-content;
      }
    }
  }
  .sDash_faq-block{
    margin-top: 70px;
    @media only screen and (max-width: 1150px){
      margin-top: 20px;
    }
    .ant-card{
      border: 1px solid ${({theme:e})=>e["border-color-normal"]};
      .ant-card-body{
        h1{
          color: ${({theme:e})=>e["dark-color"]};
        }
      }
    }
    .ant-collapse-item {
      &.ant-collapse-item-active{
        box-shadow: 0 0;
      }
      .ant-collapse-header{
        background-color: #fff !important;
        padding: 19.5px 25px !important
        .ant-collapse-arrow{
          color: #9299B8;
        }
      }
      .ant-collapse-content{
        box-shadow: 0 0;
      }
    }
  }
`},72984:function(e,t,a){a.d(t,{J3:function(){return l},nS:function(){return n},or:function(){return o},w9:function(){return s},y6:function(){return r}});var i=a(23481);const o=i.ZP.div`
    padding: 0px 30px 20px;
    min-height: 715px;
    background-color: rgb(244, 245, 247);
    &.grid-boxed{
        padding: 0px 180px 20px;
        @media only screen and (max-width: 1599px){
            padding: 0px 130px 20px;
        }
        @media only screen and (max-width: 1399px){
            padding: 0px 50px 20px;
        }
        @media only screen and (max-width: 991px){
            padding: 0px 30px 20px;
        }
    }
    .ant-card-rtl .ant-card-extra{
                margin-right: 0 !important;
            }
    .ant-tabs-tab span svg {
        ${({theme:e})=>e.rtl?"padding-left":"padding-right"}: 5px;
    }
    /* Picker Under Input */
    .ant-form-item-control-input .ant-picker {
        padding: ${({theme:e})=>e.rtl?"0 0 0 12px":"0 12px 0 0"} !important;
    }

    /* progressbars */

    .ant-progress >div{
        display: inline-flex;
        align-items: center;
        width: 100%;
        position: relative;
        font-size: 14px;
    }

    .ant-progress .ant-progress-outer {
        ${({theme:e})=>e.rtl?"margin-left":"margin-right"}: 0 !important;
        ${({theme:e})=>e.rtl?"padding-left":"padding-right"}: 0 !important;
    }

    .ant-progress .ant-progress-text {
        order: 0;
        margin-left: auto;
        ${({theme:e})=>e.rtl?"margin-right":"margin-left"}: 10px !important;
        align-self: flex-end;
        text-align: center;
    }

    .ant-progress-status-warning .ant-progress-bg {
        background: #fa8b0c;
    }

    /* progress bars */

    @media only screen and (max-width: 1199px){
        padding: 0px 15px;
    }
    @media only screen and (max-width: 991px){
        min-height: 580px;
    }
    .w-100{
        width: 100%;
    }
    .product-sidebar-col{
        @media only screen and (max-width: 767px){
            order: 2;
        }
    }
    .ant-skeleton-paragraph{
        margin-bottom: 0;
    }

    /* // ant alert */
    .ant-alert-closable{
        .ant-alert-message{
          ${({theme:e})=>e.rtl?"margin-left":"margin-right"}: 15px;
        }
    }

    .ant-alert-with-description .ant-alert-description{
        display: inline-block;
    }

    /* // ant Calendar Picker */
    .ant-picker-calendar{
        .ant-badge-status-text{
            color: ${({theme:e})=>e["gray-color"]};
        }
    }
    .ant-picker-calendar-header .ant-picker-calendar-year-select{
        @media only screen and (max-width: 400px){
            width: 50% !important;
        }
    }
    .ant-picker-calendar-header .ant-picker-calendar-month-select{
        @media only screen and (max-width: 400px){
            width: calc(50% - 8px) !important
        }
    }

    /* // Card Grid */
    .card-grid-wrap{
        .ant-card-grid{
            @media only screen and (max-width: 575px){
                width: 50% !important
            }
        }
    }

    /* // Drawer */
    .atbd-drawer{
        .ant-card-body{
            text-align: center;
        }
    }
    .drawer-placement{
        @media only screen and (max-width: 400px){
            text-align: center;
        }
        .ant-radio-group{
            margin: -4px;
            @media only screen and (max-width: 400px){
                margin-bottom: 15px;
            }
            .ant-radio-wrapper{
                margin: 4px;
            }
        }
    }
    .ant-drawer-content-wrapper{
        @media only screen and (max-width: 400px){
            width: 260px !important;
        }
        @media only screen and (max-width: 375px){
            width: 220px !important;
        }
    }

    /* // Input */
    .input-wrap{
        @media only screen and (max-width: 991px){
            min-height: 500px;
        }
        input::placeholder{
            color: ${({theme:e})=>e["light-color"]};
        }
    }
    /* // Modal Buttons */
    .modal-btns-wrap{
        margin: 0 -5px;
    }
    /* spinner */
    .ant-spin{
        ${({theme:e})=>e.rtl?"margin-left":"margin-right"}: 20px;
        &:last-child{
            ${({theme:e})=>e.rtl?"margin-left":"margin-right"}: 0;
        }
    }

    /* Column Cards Wrapper */
    .columnCardsWrapper{
        background: #F4F5F7;
        border-radius: 4px;
        padding: 50px 30px 25px;
    }
    .columnCardsWrapper .ant-card{
        background: #fff;
    }
    .columnCardsWrapper .ant-card-head{
        background: #fff;
    }

    /* Ant Collapse */
    .ant-collapse{
        border-color: #E3E6EF;
        border-radius: 5px;
    }
    .ant-collapse.ant-collapse-icon-position-left .ant-collapse-header{
        color: #5A5F7D;
        padding: 12px 16px 10px 45px;
        background-color: ${({theme:e})=>e["bg-color-light"]};
    }
    .ant-collapse-content p{
        color: #9299B8;
        margin-bottom: 0;
    }
    .ant-collapse-content > .ant-collapse-content-box {
        padding: 20px 20px 12px;
    }
    .ant-collapse-content > .ant-collapse-content-box .ant-collapse-content-box{
        padding: 10.5px 20px;
    }
    .ant-collapse.ant-collapse-borderless{
        background-color: #fff;
    }
    .ant-collapse > .ant-collapse-item,
    .ant-collapse .ant-collapse-content{
        border-color: #E3E6EF;
    }
    .ant-collapse > .ant-collapse-item.ant-collapse-item-disabled .ant-collapse-header{
        color: #ADB4D2 !important;
    }

    .ant-collapse > .ant-collapse-item .ant-collapse-header .ant-collapse-arrow{
        font-size: 8px;
        color: ${({theme:e})=>e["light-color"]};
        svg,
        i{
            color: ${({theme:e})=>e["light-color"]};
        }
    }

    .ant-collapse .ant-collapse {
        border: 0 none;
        background: #fff;
    }

    .ant-collapse .ant-collapse > .ant-collapse-item {
        border-bottom: 0;
    }
    .ant-collapse .ant-collapse .ant-collapse-header{
        border: 1px solid #E3E6EF;
        background: #F8F9FB;
    }
    .ant-collapse .ant-collapse .ant-collapse-content{
        margin: 20px 0 10px 0;
        border: 1px solid #E3E6EF;
        border-radius: 0;
    }

    // Ant Collapse Borderless

    .ant-collapse.ant-collapse-borderless{
        .ant-collapse-item{
            background-color: #F8F9FB !important;
        }
    }

    // Ant Radio
    .ant-radio-button-wrapper{
        height: 48px;
        line-height: 46px;
        padding: 0 25.25px;
        @media only screen and (max-width: 1024px){
            padding: 0 10px;
        }
        @media only screen and (max-width: 379px){
            height: 40px !important;
            line-height: 38px !important;
            font-size: 12px;
            padding: 0 6px;
        }
    }

    .ant-radio-group-small{
        .ant-radio-button-wrapper{
            height: 30px;
            padding: 0 7px;
            line-height: 28px;
        }
    }

    // Ant Result
    .ant-result{
        .ant-result-icon{
            > .anticon{
                font-size: 50px;
            }
        }
    }
    .ant-result-title{
        font-size: 20px;
        line-height: 1.8;
        text-align: center;
        color: ${({theme:e})=>e["dark-color"]};
    }

    .ant-result-subtitle{
        color: #5a5f7d;
        font-size: 12px;
        line-height: 1.6;
        text-align: center;
    }

    .ant-result-extra{
        margin-top: 24px;
    }

    /* // Select */
    .sDash-select-vertical-list{
        .ant-select{
            &:not(:last-child){
                margin-bottom: 15px;
            }
        }
    }
    .ant-tree-select .ant-select-selector{
        height: 42px;
    }
    .tag-select-list{
        margin-bottom: -10px;
        .ant-select{
            margin-bottom: 10px;
        }
    }
    .ant-select-selector{
        border-color: #E3E6EF !important;
    }

    .ant-select{
        &.ant-select-multiple{
            .ant-select-selection-item{
                ${({theme:e})=>e.rtl?"padding-right":"padding-left"}: 8px;
            }
        }
        &.ant-select-lg{
            height: 50px;
            line-height: 48px;
            .ant-select-selector{
                height: 50px !important;
                line-height: 48px;
            }
            .ant-select-selection-item{
                line-height: 48px !important;
                ${({theme:e})=>e.rtl?"padding-right":"padding-left"}: 8px;
            }
            &.ant-select-multiple {
                .ant-select-selector{
                    padding: 1px 5px 5px 10px !important;
                }
                .ant-select-selection-item{
                    height: 32px;
                    line-height: 32px !important;
                }
            }
        }
        &.ant-select-multiple.ant-select-sm{
            .ant-select-selection-item{
                height: 16px;
                line-height: 14px;
                font-size: 11px;
            }
        }
    }

    .ant-select-multiple {
        .ant-select-selector{
            padding: 0 5px 0 10px !important;
            .ant-select-selection-item{
                height: 24px;
                line-height: 22px;
            }
        }
    }

    /* // Slider */
    .slider-with-input{
        .ant-slider{
            ${({theme:e})=>e.rtl?"margin-left":"margin-right"}: 15px;
        }
        .slider-with-input__single{
            margin-bottom: 15px;
        }
    }

    /* // Taglist */
    .taglist-wrap{
        margin: -5px;
        .ant-tag {
            line-height: 22px;
            padding: 0 10.2px;
            border: 0 none;
            margin: 5px;
            color: ${({theme:e})=>e["gray-color"]};
            &.ant-tag-has-color{
                color: #fff !important;
            }
            &.ant-tag-magenta{
                color: #eb2f96;
            }
            &.ant-tag-red{
                color: #f5222d;
            }
            &.ant-tag-volcano{
                color: #fa541c;
            }
            &.ant-tag-orange{
                color: #fa8c16;
            }
            &.ant-tag-gold{
                color: #faad14;
            }
            &.ant-tag-line{
                color: #a0d911;
            }
            &.ant-tag-green{
                color: #a0d911;
            }
            &.ant-tag-cyan{
                color: #13c2c2;
            }
            &.ant-tag-blue{
                color: #1890ff;
            }
            &.ant-tag-geekbule{
                color: #2f54eb;
            }
            &.ant-tag-purple{
                color: #722ed1;
            }
        }
    }

    /* // Timepicker List */
    .timepicker-list{
        margin: -5px;
        .ant-picker{
            margin: 5px;
        }
    }

    /* // Ant Menu */
    .ant-menu{
        .ant-menu-submenu-title{
            svg{
                color: ${({theme:e})=>e["light-color"]};
            }
        }
    }

    /* Ant Comment */
    .ant-comment-inner{
        padding: 0;
    }
    .ant-comment-content-detail p{
        color: #9299B8;
    }

    .ant-list-items{
        padding-top: 22px;
        .ant-list-item{
            padding: 0;
            border-bottom: 0 none;
        }
    }
    .ant-list-items li:not(:last-child){
        margin-bottom: 22px;
    }
    .ant-comment:not(:last-child){
        margin-bottom: 22px;
    }
    .ant-comment-nested{
        margin-top: 22px;
    }
    .ant-comment-actions li span{
        color: #ADB4D2;
    }
    .ant-comment-content-detail textarea{
        resize: none;
        min-height: 170px;
        border-radius: 5px;
    }

    // Ant List
    .ant-list.ant-list-bordered{
        .ant-list-header,
        .ant-list-footer{
            padding: 13px 16px;
        }
        .ant-list-items{
            padding-top: 0;
            .ant-list-item{
                padding: 12.5px 16px;
                margin-bottom: 0;
                color: ${({theme:e})=>e["gray-color"]};
            }
        }
    }

    /* // Vector Map */
    .rsm_map{
        min-height: 505px;
        .world-map{
            width: 100%;
            height: auto;
            @media only screen and (max-width: 1599px){
                height: 480px;
            }
            @media only screen and (max-width: 1399px){
                height: 400px;
            }
            @media only screen and (max-width: 575px){
                height: 400px;
            }
            @media only screen and (max-width: 767px){
                height: 300px;
            }
            @media only screen and (max-width: 575px){
                height: 250px;
            }
            @media only screen and (max-width: 479px){
                height: 350px;
            }
            @media only screen and (max-width: 375px){
                height: 240px;
            }
        }
        .controls{
            position: absolute;
            right: 30px;
            bottom: 30px;
            button{
                display: block;
                width: 27px;
                height: 27px;
                background: none;
                color: #5a5f7d;
                border: 1px solid #f1f2f6;
                padding: 0;
                font-size: 15px;
                display: flex;
                align-items: center;
                justify-content: center;
                background-color: #fff;
                cursor: pointer;
                &:first-child{
                    border-radius: 6px 6px 0 0;
                }
                &:last-child{
                    border-radius: 0 0 6px 6px;
                }
                &:focus{
                    outline: none;
                }
                svg{
                    width: 10px;
                }
            }
            button + button{
                border-top: 0 none;
            }
        }
    }

    /* // Checkout Wrapper */
    .checkoutWraper{
        .ant-card-body{
            padding: 50px 50px 50px 30px !important;
            @media only screen and (max-width: 575px){
                padding: 25px !important;
            }
            .ant-card-body{
                padding: 25px !important;
                @media only screen and (max-width: 375px){
                    padding: 15px !important;
                }
            }
        }
        .ant-steps{
            margin-top: -22px;
        }
    }

    /* // Star Active */
    a{
        i,
        span.fa{
          font-size: 16px;
          color: ${({theme:e})=>e["extra-light-color"]};
          line-height: 0;
        }
        &.starDeactivate{
          i:before{
            content: "\f31b";
          }
        }
        &.starActive{
          i,
          span.fa{
            color: ${({theme:e})=>e["warning-color"]};
          }
          i:before,
          span.fa:before{
            color: ${({theme:e})=>e["warning-color"]};
            content: "\f005";

          }
        }
    }

    .ant-timeline{
        color: ${({theme:e})=>e["gray-color"]};
        .ant-timeline-item-content{
            font-size: 16px;
        }
    }


    .ant-rate{
        .ant-rate-star{
            svg{
                width: 13px;
                height: 13px;
            }
        }
    }

    .ant-rate-content{
        font-weight: 500;
        color: ${({theme:e})=>e["gray-color"]}
    }

    .account-card{
        .ant-card-head{
            .ant-card-extra{
                @media only screen and (max-width: 575px){
                   padding-top: 0 !important;
                }
            }

        }

    }

    /* // Rechart */
    .recharts-default-legend{
        .recharts-legend-item{
            min-width: 100px !important;
        }
    }

    /* // Radio */
    .radio-size-wrap{
            .ant-radio-button-wrapper{
                @media only screen and (max-width: 1450px){
                    padding: 0 11.5px;
                }
                @media only screen and (max-width: 450px){
                    padding: 0 5.5px;
                }
            }
        }
    }

    /* // Message  */
    .message-button-list{
        margin: -4px;
        .ant-btn {
            margin: 4px;
        }
    }
    /* Chart Label */

    .chart-label {
        display: flex;
        align-items: center;
        justify-content: center;
        margin-bottom: 6px;
        color: #5a5f7d;
    }

    .chart-label .label-dot {
        ${({theme:e})=>e.rtl?"margin-left":"margin-right"}: 8px;
        width: 7px;
        height: 7px;
        border-radius: 50%;
    }

    .chart-label .label-dot.dot-success {
        background: #20c997;
    }

    .chart-label .label-dot.dot-info {
        background: #5f63f2;
    }

    .chart-label .label-dot.dot-warning {
        background: #fa8b0c;
    }

    .chart-label .label-dot {
        display: block;
        width: 7px;
        height: 7px;
        border-radius: 50%;
        ${({theme:e})=>e.rtl?"margin-left":"margin-right"}: 10px;
    }

    // Ant comment
    .ant-comment-actions{
        li{
            position: relative;
            &:not(:last-child){
                ${({theme:e})=>e.rtl?"margin-left":"margin-right"}: 8px;
                ${({theme:e})=>e.rtl?"padding-left":"padding-right"}: 8px;
                &:after{
                    position: absolute;
                    ${({theme:e})=>e.rtl?"left":"right"}: 0;
                    top: 50%;
                    transform: translateY(-50%);
                    width: 1px;
                    height: 12px;
                    background-color: #C6D0DC;
                    content: '';
                }
            }
            .com-time{
                cursor: default;
            }
            >span{
                ${({theme:e})=>e.rtl?"padding-left":"padding-right"}: 0;
            }
            span{
                ${({theme:e})=>e.rtl?"margin-left":"margin-right"}: 0;
            }
        }

        .comment-ld-action{
            ${({theme:e})=>e.rtl?"padding-right":"padding-left"}: 8px;
            cursor: auto;
        }
    }

    .ant-comment{
        .ant-comment-content{
            .add-comment{
                margin-top: 25px;
                font-size: 14px;
                padding: 0px 25px;
                box-shadow: 0 8px 13px ${({theme:e})=>e["primary-color"]}20;
            }
        }
    }

    // Emoji Picker React
    .emoji-picker-react{
        bottom: 15px;
        right: 25px;
        box-shadow: 0 5px 10px #efefef10;
        @media only screen and (max-width: 479px){
            bottom: 25px;
            right: -50px;
            width: 260px;
        }
        .emoji-categories{
            padding: 0 10px;
        }
        .emoji-search{
            margin: 0 10px;
        }
        .content-wrapper:before{
            display: none;
        }
        .emoji-group{
            padding: 0 10px;
        }
        .emoji-group:before{
            font-size: 12px;
            font-weight: 600;
            color: ${({theme:e})=>e["dark-color"]};
        }
        .emoji-group .emoji-img{
            margin: 5px !important;
        }
    }

    .wizard-side-border{
        >.ant-card{
            .ant-card-body{
                padding: 0 25px !important;
            }
        }
        .checkout-successful{
            >.ant-card{
                .ant-card-body{
                    padding: 25px !important;
                }
            }
        }
        .payment-method-form.theme-light{
            .shipping-selection__card{
                .ant-card-body{
                    padding: 25px !important;
                }
            }
        }
        .shipping-selection__card{
            .ant-card-body{
                padding: 25px !important;
            }
        }
        .atbd-review-order{
            .ant-card-body{
                padding: 25px 25px 0 !important;
                @media only screen and (max-width: 767px) {
                    padding: 15px 15px 0 !important;
                }
            }
        }

        .ant-steps {
            padding: 50px;
            @media only screen and (max-width: 1399px) {
                padding: 25px;
            }
        }
        .steps-wrapper{
            padding: 50px;
            @media only screen and (max-width: 1399px) {
                padding: 25px;
            }
            ${({theme:e})=>e.rtl?"border-right":"border-left"}: 1px solid ${({theme:e})=>e["border-color-light"]};
        }
    }
    .editor-compose > div {
        position: static;
        max-width: 100%;
        margin: 25px 0;
    }

    // Ant Dragger
    .ant-upload-drag{
        background-color: #fff !important;
        border-radius: 10px !important;
        display: flex;
        align-items: center;
        min-height: 100px;
        border-color: #C6D0DC;

        .ant-upload-drag-container{
            .ant-upload-text{
                margin-bottom: 0;
                font-size: 15px;
                color: #9299B8;
            }
        }
    }

    .sDash-uploader-large{
        .ant-upload-drag{
            min-height: 180px;
        }
    }

    // Form Validation
    .ant-form-item{
        .has-success{
            .ant-input{
                border-color: ${({theme:e})=>e["success-color"]};
            }
            &.ant-form-item-with-help{
                .ant-form-explain{
                    color: ${({theme:e})=>e["success-color"]};
                }
            }
        }
        &.ant-form-item-with-help{
            .ant-form-explain{
                margin: 6px 0 2px 0;
            }
        }
    }

    // Statistics Account Balance
    .sDash-ac-balance{
        .sDash-rcharge-btn{
            font-size: 14px;
            margin-top: 15px;
            height: 42px !important;
        }
    }

    // Switch Style

    .ant-switch{
        min-width: 35px;
    }

    .ant-switch-small{
        min-width: 30px;
        height: 15px;
        line-height: 15px;
    }

    // Ant Picker
    .ant-time-picker{
        min-width: 250px;
        .ant-time-picker-input{
            padding: 12px 11px;
        }
        &.ant-time-picker-large{
            .ant-time-picker-input{
                padding: 12px 11px;
            }
        }
        &.ant-time-picker-small{
            .ant-time-picker-input{
                padding: 8px 11px;
            }
        }
    }

    .sDash-dynamic-tag{
        .sDash-new-tag-input{
            background-color: #EFF0F3;
        }
        .ant-input{
            height: 30px;
        }
    }

    // Ant Tab
    .ant-tabs-top-bar{
        .ant-tabs-nav{
            margin: 0 0 16px;
            .ant-tabs-tab{
                i{
                    line-height: .6;
                }
            }
        }
    }

    // Ant Input
    .ant-input{
        padding: 12px 11px;
        &::placeholder{
            color: #9299B8;
        }
    }
    .ant-input-affix-wrapper{
        padding: 12px 11px !important;
        font-size: 14px;
    }
    .ant-input-affix-wrapper-lg{
        padding: 11.5px 11px;
        font-size: 16px;
    }

    .ant-input-affix-wrapper-sm {
        padding: 3px 7px;
    }

    .ant-input-lg{
        padding: 11.5px 11px;
        font-size: 16px;
    }

    .ant-input-sm{
        padding: 3px 7px;
    }

    #world-map{
        display: flex;
        align-items: center;
        justify-content: center;
    }

    .ant-form-item-label{
        line-height: 1.5715;
    }
    .ant-form-vertical .ant-form-item{
        padding-bottom: 0;
    }

    .ant-checkbox-wrapper{
        span + span{
            color: ${({theme:e})=>e["light-color"]};
        }
    }
    .ant-menu{
        .ant-menu-item{
            svg,
            i{
                color: ${({theme:e})=>e["light-color"]};
            }
        }
    }
    .sDash-action-btn-list{
        &.ant-space{
            margin: -4px !important;
            .ant-space-item{
                margin: 4px !important
            }
        }
    }

    // Switch List
    .sDash-switch-list{
        margin: 0 -5px;
        button{
            margin: 0 5px;
        }
    }

    // Ant tabs
    .ant-tabs-tab-prev-icon,
    .ant-tabs-tab-next-icon{
        top: 40%;
    }

    .sDash-drawer-placement{
        .ant-radio-group{
            ${({theme:e})=>e.rtl?"margin-left":"margin-right"}: 8px;
        }
    }
`,n=(i.ZP.div`
    margin-bottom: -25px;
    .button-group-single{
        margin-bottom: 15px;
        h4{
            font-size: 15px;
            margin-bottom: 8px;
        }
        .ant-btn-group{
            margin-bottom: 10px;
        }
    }
    .button-group-single .ant-btn-white{
        border: 1px solid #E3E6EF;
        background: #fff !important;
        ${({theme:e})=>e.rtl?"border-left-width":"border-right-width"}: 0px;
        &:last-child{
            ${({theme:e})=>e.rtl?"border-left-width":"border-right-width"}: 1px;
        }
        &:hover{
            color: ${({theme:e})=>e["gray-color"]} !important;
            background: ${({theme:e})=>e["bg-color-normal"]} !important;
        }
    }
    .button-group-single .ant-btn-light{
        border: 1px solid #E3E6EF;
        ${({theme:e})=>e.rtl?"border-left-width":"border-right-width"}: 0px;
        font-weight: 500;
        color: ${({theme:e})=>e["extra-light-color"]} !important;
        background: ${({theme:e})=>e["bg-color-normal"]} !important;
        &:last-child{
            ${({theme:e})=>e.rtl?"border-left-width":"border-right-width"}: 1px;
        }
    }
    .ant-btn-group:not(:last-child){
        ${({theme:e})=>e.rtl?"margin-left":"margin-right"}: 20px;
    }
    .ant-btn-group{
        > .ant-btn:first-child{
            ${({theme:e})=>e.rtl?"border-top-right-radius":"border-top-left-radius"}: 3px !important;
            ${({theme:e})=>e.rtl?"border-top-left-radius":"border-top-right-radius"}: 0 !important;
            ${({theme:e})=>e.rtl?"border-bottom-right-radius":"border-bottom-left-radius"}: 3px !important;
            ${({theme:e})=>e.rtl?"border-bottom-left-radius":"border-bottom-right-radius"}: 0 !important;
        }
        > .ant-btn:last-child:not(:first-child){
            ${({theme:e})=>e.rtl?"border-top-left-radius":"border-top-right-radius"}: 3px !important;
            ${({theme:e})=>e.rtl?"border-top-right-radius":"border-top-left-radius"}: 0 !important;
            ${({theme:e})=>e.rtl?"border-bottom-left-radius":"border-bottom-right-radius"}: 3px !important;
            ${({theme:e})=>e.rtl?"border-bottom-right-radius":"border-bottom-left-radius"}: 0 !important;
        }
    }
`,i.ZP.div`
    .ant-btn-block{
        margin-bottom: 10px;
    }
`,i.ZP.div`
    display: flex;
    align-items: flex-end;
    flex-wrap: wrap;
`,i.ZP.div`
    display: inline;
    .anticon i,
    .anticon svg,
    .anticon img{
        width: 10px;
        height: 10px;
    }
    .ant-btn-group button.active{
        ${({theme:e})=>e.rtl?"border-left":"border-right"}: 0px;
    }
`,i.ZP.div`
    margin-top: -15px;

    .ant-alert{
        .ant-alert-icon{
            position: relative;
        }
        &.ant-alert-with-description{
            .ant-alert-icon{
                font-size: 15px;
                ${({theme:e})=>e.rtl?"margin-left":"margin-right"}: 10px;
                ${({theme:e})=>e.rtl?"margin-right":"margin-left"}: 0;
            }
        }
    }

    .alert-empty-message{
        .ant-alert{
            padding: ${({theme:e})=>e.rtl?"10px 15px 10px 40px":"10px 40px 10px 15px"} !important;
            &.ant-alert-no-icon{
                padding: 10px 20px 10px!important;
            }
        }
        .ant-alert-icon{
            top: 5px !important;
        }
        .ant-alert-message{
            display: none !important;
        }
    }
`,i.ZP.div`
    .ant-select:not(:last-child){
        margin-bottom: 20px;
    }
    .auto-complete-input{
        .ant-select{
            width: 200px !important;
            @media only screen and (max-width: 575px){
                width: 100% !important;
            }
        }
    }

    .autocomplete-with-btn{
        .ant-input-suffix{
            position: absolute;
            ${({theme:e})=>e.rtl?"left":"right"}:0;
            ${({theme:e})=>e.rtl?"margin-left":"margin-right"}: 0;
            top: -1px;
            .search-btn{
                padding: 0px 12px !important;
                border-radius: ${({theme:e})=>e.rtl?"4px 0 0  4px":"0 4px 4px  0"} !important;
                height: 40px !important;
                i{
                    top: -2px !important;
                }
            }
        }
    }
`,i.ZP.div`
    .ant-select-single:not(.ant-select-customize-input) .ant-select-selector{
        height: 30px !important;
    }
    .ant-select-single .ant-select-selector .ant-select-selection-item,
    .ant-select-single .ant-select-selector .ant-select-selection-placeholder {
        line-height: 28px !important;
    }
    .ant-picker-calendar-full .ant-picker-panel .ant-picker-calendar-date-content{
        height: 105px;
    }
    .ant-radio-button-wrapper{
        height: 30px;
        line-height: 28px;
        @media only screen and (max-width: 575px){
            height: 30px !important;
            line-height: 28px !important;
        }
    }
    .ant-fullcalendar-header{
        direction: ltr;
    }
    .ant-fullcalendar-fullscreen {
        .ant-fullcalendar-content{
            text-align: ${({theme:e})=>e.rtl?"right":"left"};
            .ant-badge-status-text{
                ${({theme:e})=>e.rtl?"margin-right":"margin-left"}: 8px;
                ${({theme:e})=>e.rtl?"margin-left":"margin-right"}: 0;
            }
        }
        table tbody >tr >th,
        table tbody >tr >td{
            padding: 0;
        }

        .ant-fullcalendar-calendar-body{
            padding: 8px 0;
        }

        .ant-fullcalendar-header{
            .ant-fullcalendar-year-select{
                @media only screen and (max-width: 479px){
                    width: 50% !important;
                }
            }
            .ant-fullcalendar-month-select{
                @media only screen and (max-width: 479px){
                    width: calc(50% - 8px) !important;
                }
            }
            .ant-select-selector{
                @media only screen and (max-width: 479px){
                    text-align: left;
                }
            }
            .ant-radio-group{
                @media only screen and (max-width: 479px){
                    width: 100%;
                    margin-left: 0;
                    margin-top: 8px;
                }
                .ant-radio-button-wrapper{
                    width: 50%;
                    text-align: center;
                }
            }
        }
    }
`,i.ZP.div`
    .ant-calendar-picker{
        width: 100% !important;
        border-color: #E3E6EF;
        border-radius: 5px;
        .ant-calendar-picker-input{
            padding: 6px 11px 6px;
        }
    }
    .ant-calendar-picker:not(:last-child){
        margin-bottom: 20px;
    }
    .ant-calendar-picker > input{
        color: #5A5F7D;
    }
    .ant-picker-range .ant-picker-input > input{
        text-align: center;
        font-weight: 500;
    }
`,i.ZP.div`
    margin: -4px;
    button{
        margin: 4px;
    }
`,i.ZP.div`
    padding: 12px;
    border-radius: 4px;
    border: 1px solid ${({theme:e})=>e["border-color-normal"]};
    margin: -3px;
    .ant-tag{
        margin: 3px;
        font-size: 11px;
        padding: 0 4px;
        border-radius: 5px;
        border: 0 none;
        height: 24px;
        display: inline-flex;
        align-items: center;
        i{
            line-height: .6;
        }
    }
`,i.ZP.div`
    .ant-page-header{
        border: 1px solid ${({theme:e})=>e["border-color-normal"]};
        border-radius: 5px;
        background-color: transparent !important;
        padding: 18px 20px;
        .ant-breadcrumb{
            @media only screen and (max-width: 767px){
                text-align: center;
            }
        }
    }
    .ant-page-header-heading-extra{
        color: #ddd;
        .ant-space {
            margin: -4px;
            @media only screen and (max-width: 767px){
                justify-content: center;
            }
            button{
                border-radius: 3px;
                padding: 0 18.3px;
            }
            .ant-space-item{
                margin: 4px;
            }
        }
    }
    .ant-page-header .ant-page-header-heading-left{
        margin: 2px 0;
    }
    .ant-page-header.has-breadcrumb{
        padding: 22px 25px 25px 25px;
        .ant-page-header-heading-extra{
            margin: 0 0 0 auto !important;
            @media only screen and (max-width: 767px){
                float: none;
                margin: 15px 0 auto !important;
            }

            @media only screen and (max-width: 575px){
                text-align: center;
                margin: 5px 0 auto !important;
            }
        }
    }
`,i.ZP.div`
    .ant-btn-lg{
        font-size: 14px;
    }
    .ant-space{
        margin: -4px;
        .ant-space-item{
            margin: 4px;
        }
    }
`,i.ZP.div`
    .ant-input{
        padding: 12px 11px;
    }
    .ant-form {
        .ant-form-item-label{
            line-height: 1.45;
        }
        .form-item{
            margin-bottom: 30px;
            label{
                font-weight: 500;
                display: block;
                margin-bottom: 15px;
            }
            .ant-cascader-picker{
                width: 100%;
                min-height: 48px;
                .ant-cascader-input{
                    min-height: 48px;
                }
            }
        }

        .ant-input-affix-wrapper .ant-input-prefix svg{
            color: #9299B8;
        }
    }
    .ant-form-item-control-input{
        min-height: auto !important;
    }
    .ant-form-item{
        flex-flow: column;
        &:not(:last-child){
            margin-bottom: 26px;
        }
        &:last-child{
            margin-bottom: 0;
        }
        .ant-form-item-label{
            text-align: ${({theme:e})=>e.rtl?"right":"left"};
            label{
                height: fit-content;
                margin-bottom: 6px;
            }
        }
        .ant-form-item-control-input{
            input,
            textarea{
                color: ${({theme:e})=>e["gray-color"]};
                &:placeholder{
                    color: ${({theme:e})=>e["light-color"]};
                }
            }
            input[type="password"]{
                padding-top: 12px;
                padding-bottom: 12px;
            }
            .ant-input-affix-wrapper{
                input[type="password"]{
                    padding-top: 0;
                    padding-bottom: 0;
                }
            }
            .ant-picker-input input{
                padding: 12px;
            }
            button{
                height: 44px;
            }
            .ant-input-affix-wrapper{
                padding: 0 11px;
            }
        }
        .ant-select-single{
            .ant-select-selector{
                padding: 0 20px;
                height: 48px !important;
                border: 1px solid ${({theme:e})=>e["border-color-normal"]};
                .ant-select-selection-item{
                    line-height: 46px !important;
                    padding: 0 !important;
                }
                .ant-select-selection-placeholder{
                    line-height: 46px !important;
                }
            }
        }
    }
    .setting-form-actions{
        margin: 48px 0 14px;
        @media only screen and (max-width: 575px){
            margin: 40px 0 14px;
        }
        button{
            border-radius: 6px;
            height: 44px;
            margin-bottom: 14px;
            &.ant-btn-light{
                border: 1px solid ${({theme:e})=>e["border-color-light"]};
                background-color: ${({theme:e})=>e["bg-color-light"]};
            }
        }
    }
    .ant-form-item-control{
        .input-prepend{
            position: absolute;
            ${({theme:e})=>e.rtl?"right":"left"}: 0;
            top: 0;
            display: inline-flex;
            align-items: center;
            justify-content: center;
            padding: 0 20px;
            height: 47px;
            border-radius: ${({theme:e})=>e.rtl?"0 4px 4px 0":"4px 0 0 4px"};
            z-index: 10;
            border: 1px solid ${({theme:e})=>e["border-color-normal"]};
            border-bottom: 0 none;
            background-color: ${({theme:e})=>e["bg-color-light"]};
            svg,
            i{
                color: ${({theme:e})=>e["gray-color"]};
            }
        }
        .input-prepend-wrap{
            .ant-input-number{
                input{
                    ${({theme:e})=>e.rtl?"padding-right":"padding-left"}: 70px;
                }
            }
        }
        .ant-input-number{
            width: 100% !important;
            border: 1px solid ${({theme:e})=>e["border-color-normal"]};
        }
    }
    .add-record-form{
        margin: 25px 0 35px 0;

        .record-form-actions{
            padding-right: 40px;
        }
        .ant-btn{
            height: 44px;
            font-size: 14px;
            font-weight: 500;
        }
        .ant-radio-group{
            margin-bottom: -4px;
            .ant-radio-wrapper{
                margin-bottom: 4px;
            }
        }
    }
    .adTodo-form{
        .btn-adTodo {
            font-size: 14px;
        }
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
    .sDash_color-picker{
        border: 1px solid #E3E6EF;
        border-radius: 4px;
        padding: 11px 14px;
        input{
            width: 100%;
            border: 0 none;
            background-color: #fff;
            &::-webkit-color-swatch{
                min-height: 18px;
                border: 1px solid #C6D0DC;
            }
        }
    }
`),r=(i.ZP.div`
    .ant-page-header-heading{
        @media only screen and (max-width: 991px){
            flex-flow: column;
            align-items: center;
        }
    }

    .ant-page-header-heading-left{
        @media only screen and (max-width: 575px){
            flex-flow: column;
        }
        @media only screen and (max-width: 800px){
            max-width: 100%;
        }
        .ant-page-header-back{
            @media only screen and (max-width: 575px){
                margin: 0;
                padding: 0;
            }
        }
        .ant-page-header-heading-title{
            @media only screen and (max-width: 575px){
                margin: 10px 0 8px;
                padding: 0;
            }
            &:after{
                @media only screen and (max-width: 575px){
                    display: none;
                }
            }
        }
        .ant-page-header-heading-sub-title{
            @media only screen and (max-width: 575px){
                margin: 0;
                padding: 0;
                flex-flow: column;
            }
            .title-counter{
                @media only screen and (max-width: 575px){
                    margin-bottom: 16px;
                }
            }
        }
    }

    .ant-page-header-heading-title{
        position: relative;
        ${({theme:e})=>e.rtl?"padding-left":"padding-right"}: 24px;
        ${({theme:e})=>e.rtl?"margin-left":"margin-right"}: 24px;
        @media only screen and (max-width: 767px){
            ${({theme:e})=>e.rtl?"padding-left":"padding-right"}: 12px;
            ${({theme:e})=>e.rtl?"margin-left":"margin-right"}: 12px !important;
        }
        &:after{
            position: absolute;
            ${({theme:e})=>e.rtl?"left":"right"}: 0px;
            top: 0;
            height: 100%;
            width: 1px;
            content: '';
            background: ${({theme:e})=>e["border-color-normal"]};
        }
    }
    .ant-page-header-heading-sub-title{
        font-weight: 500;
        display: flex;
        align-items: center;
        .title-counter{
            white-space: nowrap;
        }
        .ant-input-affix-wrapper{
            padding-top: 0;
            padding-bottom: 0;
            border-radius: 6px;
            border: 0 none;
            .ant-input-suffix{
                i{
                    line-height: 0;
                    svg{
                        font-size: 14px;
                        color: ${({theme:e})=>e["light-gray-color"]};
                    }
                }
            }
        }
    }
    .ant-select{
        ${({theme:e})=>e.rtl?"margin-right":"margin-left"}: 25px;
        @media only screen and (max-width: 575px){
            ${({theme:e})=>e.rtl?"margin-right":"margin-left"}: 0;
        }
        .ant-select-selector{
            height: 46px !important;
            min-width: 350px;
            @media only screen and (max-width: 991px){
                min-width: 100%;
            }
        }
        .ant-select-selection-search-input{
            height: 46px;
            border-radius: 23px;
            border: 0 none;
            box-shadow: 0 5px 20px #9299B803;
            input{
                height: 46px !important;
                font-size: 14px;
            }
        }
    }
    .btn-add_new{
        border-radius: 6px;
        height: 40px;
        padding: 0 14px;
        font-size: 12px;
        @media only screen and (max-width: 991px){
            margin-top: 10px;
        }
        a{
            display: flex;
            align-items: center;
            svg{
                ${({theme:e})=>e.rtl?"margin-left":"margin-right"}: 6px;
            }
        }
    }
`,i.ZP.div`
    .ant-card-body{
        @media only screen and (max-width: 767px){
            padding: 0 !important;
        }
    }
`,i.ZP.div`
    .ant-card-body{
        padding: 25px 25px 0 25px !important;
    }
`,i.ZP.div`
    .file-list{
        min-height: 385px;
        .file-list__single{
            justify-content: space-between;
            align-items: center;
            &:not(:last-child){
                margin-bottom: 18px;
            }
            span{
                display: block;
                font-size: 12px;
                line-height: 1.42;
                &.file-name{
                    font-size: 14px;
                    font-weight: 500;
                    color: ${({theme:e})=>e["dark-color"]};
                }
                &.file-size{
                    margin: 2px 0;;
                    color: ${({theme:e})=>e["gray-solid"]};
                }
                &.file-content-action{
                    a{
                        font-weight: 500;
                        color: ${({theme:e})=>e["primary-color"]};
                    }
                    a + a{
                        margin-left: 8px;
                    }
                }
            }
        }
        .file-single-info{
            width: 50%;
            align-items: center;
            .file-single-logo{
                ${({theme:e})=>e.rtl?"margin-left":"margin-right"}: 16px;
                img{
                    max-width: 42px;
                }
            }
        }
        .file-single-action{
            .ant-dropdown-trigger {
                color: ${({theme:e})=>e["extra-light-color"]};
            }
        }
    }
`,i.ZP.div`
    .ant-pagination-prev, .ant-pagination-next {
        line-height: 28px !important;
        transform: rotateY(${({theme:e})=>e.rtl?"180deg":"0deg"})
    }
    .ant-table table{
        text-align: ${({theme:e})=>e.rtl?"right":"left"};
    }
    .ant-table-thead > tr > th{
        text-align: ${({theme:e})=>e.rtl?"right":"left"};
    }
    span.anticon.anticon-right{
        transform: rotateY(${({theme:e})=>e.rtl?"180deg":"0deg"})
    }
    span.anticon.anticon-left{
        transform: rotateY(${({theme:e})=>e.rtl?"180deg":"0deg"})
    }
    .ant-table-tbody > tr > td.ant-table-selection-column{
        text-align: left;
    }
    &.table-order,
    &.table-seller,
    &.table-data-view{
        .ant-table-selection{
            .ant-checkbox-indeterminate{
                .ant-checkbox-inner{
                    background: ${({theme:e})=>e["primary-color"]};
                    border-color: ${({theme:e})=>e["primary-color"]};
                    &:after{
                        height: 2px;
                        background-color: #fff;
                    }
                }
            }
        }
        .ant-table-container{
            padding-bottom: 25px;
            border-bottom: 1px solid ${({theme:e})=>e["border-color-light"]};
        }
        tbody{
            tr{
                &:hover{
                    td{
                        background: ${({theme:e})=>e["bg-color-light"]};
                    }
                }
                td{
                    .product-id{
                        max-width: 60px;
                        text-align: ${({theme:e})=>e.rtl?"left":"right"};
                    }
                }
            }
        }
        .ant-pagination{
            margin-top: 25px !important;
        }
    }
    &.table-data-view{
        .ant-table-container{
            padding-bottom: 0;
        }
        table{
            thead{
                th{
                    padding: 15px 16px;
                }
            }
            tbody{
                td{
                    padding: 11px 16px;
                    .record-img{
                        img{
                            max-width: 38px;
                            min-height: 38px;
                            border-radius: 50%;
                            ${({theme:e})=>e.rtl?"margin-left":"margin-right"}: 12px;
                        }
                    }
                    .record-location{
                        display: block;
                        font-size: 12px;
                        font-weight: 400;
                        color: ${({theme:e})=>e["light-color"]};
                    }
                    .status{
                        font-weight: 500;
                        text-transform: capitalize;
                        &.active{
                            color: ${({theme:e})=>e["success-color"]};
                            background: ${({theme:e})=>e["success-color"]}10;
                        }
                        &.deactivated{
                            color: ${({theme:e})=>e["warning-color"]};
                            background: ${({theme:e})=>e["warning-color"]}10;
                        }
                        &.blocked{
                            color: ${({theme:e})=>e["danger-color"]};
                            background: ${({theme:e})=>e["danger-color"]}10;
                        }
                    }
                    .table-actions{
                        a{
                            svg, i{
                                width: 16px;
                                color: ${({theme:e})=>e["extra-light-color"]};
                            }
                            &.edit{
                                ${({theme:e})=>e.rtl?"margin-left":"margin-right"}: 6px;
                              &:hover{
                                svg,
                                i{
                                    color: ${({theme:e})=>e["info-color"]};
                                }
                              }
                            }
                            &.delete{
                              &:hover{
                                svg,
                                i{
                                    color: ${({theme:e})=>e["danger-color"]};
                                }
                              }
                            }
                        }
                    }
                }
            }
        }
    }
    table{
        thead{
            tr{
                border-radius: 10px;
                th{
                    &:last-child{
                        text-align: ${({theme:e})=>e.rtl?"left":"right"};
                    }
                    color: ${({theme:e})=>e["gray-color"]};
                    background: ${({theme:e})=>e["bg-color-light"]};
                    border-top: 1px solid ${({theme:e})=>e["border-color-light"]};
                    border-bottom: 1px solid ${({theme:e})=>e["border-color-light"]};
                    &:first-child{
                        ${({theme:e})=>e.rtl?"border-right":"border-left"}: 1px solid ${({theme:e})=>e["border-color-light"]};
                        border-radius: ${({theme:e})=>e.rtl?"0 10px 10px 0":"10px 0 0 10px"} !important;
                    }
                    &:last-child{
                        ${({theme:e})=>e.rtl?"border-left":"border-right"}: 1px solid ${({theme:e})=>e["border-color-light"]};
                        border-radius: ${({theme:e})=>e.rtl?"10px 0 0 10px":"0 10px 10px 0"} !important;
                    }
                }
            }
        }
        tbody{
            tr{
                &:hover{
                    td{
                        background: ${({theme:e})=>e["bg-color-light"]};
                    }
                }
                &.ant-table-row-selected{
                    &:hover{
                        td{
                            background: ${({theme:e})=>e["bg-color-light"]};
                        }
                    }
                    td{
                        background: ${({theme:e})=>e["bg-color-light"]};
                    }
                }
                td{
                    border: 0 none;
                    font-weight: 500;
                    color: ${({theme:e})=>e["dark-color"]};
                    &:first-child{
                        border-radius: ${({theme:e})=>e.rtl?"0 10px 10px 0":"10px 0 0 10px"} !important;
                    }
                    &:last-child{
                        border-radius: ${({theme:e})=>e.rtl?"10px 0 0 10px":"0 10px 10px 0"} !important;
                    }
                    span{
                        display: block;
                    }
                    .order-id{
                        min-width: 128px;
                    }
                    .customer-name{
                        min-width: 174px;
                    }
                    .status.warning{
                        min-width: 131px;
                        display: inline-block !important;
                    }
                    .ordered-amount{
                        min-width: 175px;
                    }
                    .ordered-date{
                        min-width: 165px;
                    }
                    .table-actions{
                        min-width: 60px;
                    }
                }
            }
        }
        .table-actions{
            text-align: ${({theme:e})=>e.rtl?"left":"right"};
            min-width: 115px !important;
            button{
                height: 40px;
                padding: 0 11px;
                background: transparent;
                border: 0 none;
                color: ${({theme:e})=>e["extra-light-color"]};
                &:hover{
                    &.ant-btn-primary{
                        color: ${({theme:e})=>e["primary-color"]};
                        background: ${({theme:e})=>e["primary-color"]}10;
                    }
                    &.ant-btn-info{
                        color: ${({theme:e})=>e["info-color"]};
                        background: ${({theme:e})=>e["info-color"]}10;
                    }
                    &.ant-btn-danger{
                        color: ${({theme:e})=>e["danger-color"]};
                        background: ${({theme:e})=>e["danger-color"]}10;
                    }
                }
            }
        }
        .seller-info{
            img{
                ${({theme:e})=>e.rtl?"margin-left":"margin-right"}: 12px;
            }
        }
        .user-info{
            display: flex;
            align-items: center;
            figure{
                margin: 0 8px 0;
            }
            .user-name{
                margin-bottom: 4px;
                font-weight: 500;
            }
            .user-designation{
                font-size: 12px;
                font-weight: 400;
                color: ${({theme:e})=>e["light-color"]};
            }
        }
    }
`),l=(i.ZP.div`
    .ant-card-body{
        padding: 15px !important;
    }
    table{
        thead{
            display: none;
        }
        tbody{
            >tr{
                &:not(:last-child){
                    td{
                         border-bottom: 1px solid ${({theme:e})=>e["border-color-normal"]} !important;
                    }
                 }
                 &:hover{
                     td{
                         background-color: transparent !important;
                     }
                 }
                >td{
                    font-size: 14px;
                    &:first-child,
                    &:last-child{
                        border-radius: 0 !important;
                    }
                }
            }
        }
        tr{
            td{
                svg,
                img{
                    width: 20px;
                }
                svg,
                i{
                    color: ${({theme:e})=>e["extra-light-color"]} !important;
                }
            }

        }
        .user-info{
            .user-name{
                font-size: 14px;
                margin-left: 8px;
            }
        }
    }
`,i.ZP.div`
    .ant-upload.ant-upload-drag{
        background-color: #fff;
        min-height: 280px;
        display: flex;
        align-items: center;
        border-color: #C6D0DC;
        border-radius: 10px;
        .ant-upload-drag-icon{
            svg,
            i{
                color: #ADB4D2;
            }
        }
    }
    .sDash_import-inner{
        .ant-upload-text{
            font-size: 20px;
            font-weight: 500;
        }
        .ant-upload-hint{
            margin-left: 4px;
            span{
                color: ${({theme:e})=>e["primary-color"]};
            }
        }
        .ant-upload-list{
            .ant-upload-list-item{
                background-color: #fff;
                border-color: ${({theme:e})=>e["border-color-normal"]};
            }
            .ant-upload-list-item-card-actions.picture{
                top: 18px;
                ${({theme:e})=>e.rtl?"left":"right"}: 15px;
            }
        }
    }
`),s=i.ZP.div`
    .sDash_export-box{
        display: flex;
        justify-content: space-between;
        margin-bottom: 30px;
        @media only screen and (max-width: 575px){
            flex-flow: column;
        }
        .ant-input-affix-wrapper{
            background-color: transparent;
            border: 1px solid #e3e6ef;
            padding: 12px 13px;
            width: 250px;
            height: 40px;
            display: flex;
            align-items: center;
            border-radius: 20px;
            .ant-input-prefix{
                i{
                    svg{
                        color: #9299B8;
                    }
                }
            }
        }
        .btn-export{
            height: 44px;
            @media only screen and (max-width: 575px){
                margin-bottom: 20px;
            }
        }
        .ant-select{
            width: auto !important;
            .ant-select-selector{
                padding: 0 20px;
                .ant-select-selection-search-input{
                    border-radius: 20px;
                }
            }
        }
    }
    .sDash_export-file-table{
        .ant-table-content{
            .ant-table-thead{
                border: 1px solid ${({theme:e})=>e["border-color-light"]};
                border-radius: 10px;
                tr{
                    th{
                        background-color: ${({theme:e})=>e["bg-color-light"]};
                        border: 0 none;
                        color: ${({theme:e})=>e["gray-color"]};
                        &:first-child{
                            border-radius: 10px 0 0 10px;
                        }
                        &:last-child{
                            border-radius: 0 10px 10px 0;
                        }
                    }
                }
            }
            .ant-table-tbody{
                tr{
                    &:hover{
                        box-shadow: 0 15px 50px #9299B820;
                        td{
                            background-color: #fff !important;
                        }
                    }
                    td{
                        border: 0 none;
                        padding: 22px 25px;
                        background-color: #fff;
                    }
                }
            }
        }
    }
`},52773:function(e,t,a){a.d(t,{Z:function(){return Ht}});var i=a(33907),o=a(14351);const n={darkMode:!1,topMenu:!1,rtl:!1,theme:o.r,darkTheme:o.$,auth0:!1};var r=n,l={changeLayoutBegin(e){e.loading=!0},changeLayoutSuccess(e,t){e.loading=!1,e.data=t},changeLayoutErr(e,t){e.loading=!1,e.error=t},changeRtlBegin(e){e.loading=!0},changeRtlSuccess(e,t){e.loading=!1,e.rtlData=t},changeRtlErr(e,t){e.loading=!1,e.error=t},changeMenuBegin(e){e.loading=!0},changeMenuSuccess(e,t){e.loading=!1,e.topMenu=t},changeMenuErr(e,t){e.loading=!1,e.error=t}};const s=()=>({data:r.darkMode,rtlData:r.rtl,topMenu:r.topMenu,loading:!1,rtlLoading:!1,menuLoading:!1,error:null}),d={async changeLayoutMode({commit:e},t){try{e("changeLayoutBegin"),setTimeout((()=>e("changeLayoutSuccess",t)),10)}catch(a){e("changeLayoutErr",a)}},async changeRtlMode({commit:e},t){try{e("changeRtlBegin"),setTimeout((()=>e("changeRtlSuccess",t)),10)}catch(a){e("changeRtlErr",a)}},async changeMenuMode({commit:e},t){try{e("changeMenuBegin"),setTimeout((()=>e("changeMenuSuccess",t)),10)}catch(a){e("changeMenuErr",a)}}};var c={namespaced:!1,state:s,actions:d,mutations:l},m=JSON.parse('[{"id":1,"time":1587041636455,"name":"Duran Clayton","designation":"UI/UX Designer","status":"active","content":"It is a long established fact that a reader will page when looking at its layout. The point of be distracted by the readable","img":"static/img/users/1.png","cover":"static/img/users/cover/1.png"},{"id":2,"time":1587041711525,"name":"Duran Clayton","designation":"UI/UX Designer","status":"deactivate","content":"It is a long established fact that a reader will page when looking at its layout. The point of be distracted by the readable","img":"static/img/users/2.png","cover":"static/img/users/cover/2.png"},{"id":3,"time":1587041758255,"name":"Duran Clayton","designation":"UI/UX Designer","status":"blocked","content":"It is a long established fact that a reader will page when looking at its layout. The point of be distracted by the readable","img":"static/img/users/3.png","cover":"static/img/users/cover/3.png"},{"id":4,"time":1587041856695,"name":"Duran Clayton","designation":"UI/UX Designer","status":"active","content":"It is a long established fact that a reader will page when looking at its layout. The point of be distracted by the readable","img":"static/img/users/4.png","cover":"static/img/users/cover/4.png"},{"id":5,"time":1587041880519,"name":"Duran Clayton","designation":"UI/UX Designer","status":"active","content":"It is a long established fact that a reader will page when looking at its layout. The point of be distracted by the readable","img":"static/img/users/5.png","cover":"static/img/users/cover/5.png"},{"id":6,"time":1587041932783,"name":"Duran Clayton","designation":"UI/UX Designer","status":"active","content":"It is a long established fact that a reader will page when looking at its layout. The point of be distracted by the readable","img":"static/img/users/6.png","cover":"static/img/users/cover/6.png"},{"id":7,"time":1587041957926,"name":"Duran Clayton","designation":"UI/UX Designer","status":"active","content":"It is a long established fact that a reader will page when looking at its layout. The point of be distracted by the readable","img":"static/img/users/7.png","cover":"static/img/users/cover/7.png"},{"id":8,"time":1587041979566,"name":"Duran Clayton","designation":"UI/UX Designer","status":"active","content":"It is a long established fact that a reader will page when looking at its layout. The point of be distracted by the readable","img":"static/img/users/8.png","cover":"static/img/users/cover/8.png"}]');const p=()=>({data:m,isLoading:!1,error:null});var g={namespaced:!1,state:p},u=JSON.parse('{"forcastOverview":{"today":{"Engaged":"25,872","EnLabels":["0","4","8","12","16","20","24"],"EnData":[150,100,200,250,200,300,150],"Impressions":"98,534","ImLabels":["0","4","8","12","16","20","24"],"ImData":[200,150,200,250,100,200,150],"Like":"12,142","LiLabels":["0","4","8","12","16","20","24"],"LiData":[150,100,200,250,200,300,150],"Impressions2":"1,432","ImLabels2":["0","4","8","12","16","20","24"],"ImData2":[200,150,200,250,100,200,150]},"week":{"Engaged":"55,872","EnLabels":["Sun","Mon","Tue","Wed","Thu","Fri","Sat"],"EnData":[1000,5000,1500,10000,14000,24000,20000],"Impressions":"85,534","ImLabels":["Sun","Mon","Tue","Wed","Thu","Fri","Sat"],"ImData":[10000,15000,10000,15000,14000,24000,20000],"Like":"45,254","LiLabels":["Sun","Mon","Tue","Wed","Thu","Fri","Sat"],"LiData":[100,300,150,200,500,400,500],"Impressions2":"14,452","ImLabels2":["Sun","Mon","Tue","Wed","Thu","Fri","Sat"],"ImData2":[100,300,150,200,500,400,500]},"month":{"Engaged":"98,872","EnLabels":["1-5","6-10","11-15","16-20","21-25","26-31"],"EnData":[15000,50000,15000,15000,40000,24000],"Impressions":"154,534","ImLabels":["1-5","6-10","11-15","16-20","21-25","26-31"],"ImData":[20000,40000,16000,15000,30000,23000],"Like":"120,142","LiLabels":["1-5","6-10","11-15","16-20","21-25","26-31"],"LiData":[5000,4000,16000,10000,20000,23000],"Impressions2":"114,320","ImLabels2":["1-5","6-10","11-15","16-20","21-25","26-31"],"ImData2":[1100,1300,1500,2000,500,1400,800]},"year":{"Engaged":"514,872","EnLabels":["Jan","Feb","Mar","App","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"],"EnData":[95000,55000,19000,55000,90000,240000,95000,55000,19000,55000,66000,90000,240000],"Impressions":"954,534","ImLabels":["Jan","Feb","Mar","App","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"],"ImData":[98000,65000,20000,55000,90000,240000,95000,55000,19000,55000,66000,90000,240000],"Like":"520,142","LiLabels":["Jan","Feb","Mar","App","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"],"LiData":[9500,5500,1900,5500,9000,24000,9500,5500,1900,5500,9000,10000,24000],"Impressions2":"445,320","ImLabels2":["Jan","Feb","Mar","App","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"],"ImData2":[5000,7000,19000,15000,19000,20000,35000,20000,19000,27000,10000,15000,20000]}},"youtubeSubscribe":{"week":{"Subscribe":"25,472","labels":["Sun","Mon","Tue","Wed","Thu","Fri","Sat"],"gained":[1000,5000,1500,10000,14000,24000,20000],"lost":[800,3500,1000,9000,10000,14000,15000],"percent":25},"month":{"Subscribe":"515,872","labels":["1-5","6-10","11-15","16-20","21-25","26-31"],"gained":[25000,50000,15000,15000,40000,24000],"lost":[20000,40000,12000,13000,30000,22000],"percent":50},"year":{"Subscribe":"985,872","labels":["Jan","Feb","Mar","App","May","Jun","Jul","Aug","Sep","Nov","Oct","Dec"],"gained":[95000,55000,19000,55000,90000,240000,95000,55000,19000,55000,90000,240000],"lost":[90000,50000,20000,50000,80000,300000,90000,55000,23000,50000,80000,200000],"percent":75}},"closedDeals":{"week":{"labels":["Sun","Mon","Tue","Wed","Thu","Fri","Sat"],"won":[100,500,150,1000,1400,2400,2000],"amount":[80,350,100,900,1000,1400,1500],"percent":25},"month":{"labels":["1-5","6-10","11-15","16-20","21-25","26-31"],"won":[2500,5000,1500,1500,4000,2400],"amount":[2000,4000,1200,1300,3000,2200],"percent":50},"year":{"labels":["Garissa","Isiolo","Wajir","Turkana","Kekicho","Kisii","Baringo","Kiambu","Nairobi","Mombasa","Kakamega","Kilifi"],"won":[9500,5500,1900,5500,9000,24000,9500,5500,1900,5500,9000,24000],"amount":[9000,5000,2000,5000,8000,30000,9000,5500,2300,5000,8000,20000],"percent":75}},"SocialTrafficMetrics":{"today":{"facebook":{"users":"3,397","newUsers":"422","session":"2,584","bounceRate":"30.35%","pagesSession":"2.50","avg":"00:01:05"},"twitter":{"users":"2,397","newUsers":"422","session":"2,584","bounceRate":"30.35%","pagesSession":"2.50","avg":"00:01:05"},"linkdin":{"users":"1,397","newUsers":"422","session":"2,584","bounceRate":"30.35%","pagesSession":"2.50","avg":"00:01:05"},"youtube":{"users":"4,397","newUsers":"422","session":"2,584","bounceRate":"30.35%","pagesSession":"2.50","avg":"00:01:05"},"pinterest":{"users":"597","newUsers":"422","session":"2,584","bounceRate":"30.35%","pagesSession":"2.50","avg":"00:01:05"},"google":{"users":"3,397","newUsers":"422","session":"2,584","bounceRate":"30.35%","pagesSession":"2.50","avg":"00:01:05"}},"week":{"facebook":{"users":"7,397","newUsers":"1402","session":"2,584","bounceRate":"30.35%","pagesSession":"2.50","avg":"00:01:05"},"twitter":{"users":"5,397","newUsers":"1020","session":"2,584","bounceRate":"30.35%","pagesSession":"2.50","avg":"00:01:05"},"linkdin":{"users":"4,397","newUsers":"1200","session":"2,584","bounceRate":"30.35%","pagesSession":"2.50","avg":"00:01:05"},"youtube":{"users":"15,397","newUsers":"10020","session":"2,584","bounceRate":"30.35%","pagesSession":"2.50","avg":"00:01:05"},"pinterest":{"users":"1200","newUsers":"622","session":"2,584","bounceRate":"30.35%","pagesSession":"2.50","avg":"00:01:05"},"google":{"users":"8,397","newUsers":"2500","session":"2,584","bounceRate":"30.35%","pagesSession":"2.50","avg":"00:01:05"}},"month":{"facebook":{"users":"17,397","newUsers":"5002","session":"2,584","bounceRate":"30.35%","pagesSession":"2.50","avg":"00:01:05"},"twitter":{"users":"15,397","newUsers":"6000","session":"2,584","bounceRate":"30.35%","pagesSession":"2.50","avg":"00:01:05"},"linkdin":{"users":"12,397","newUsers":"4002","session":"2,584","bounceRate":"30.35%","pagesSession":"2.50","avg":"00:01:05"},"youtube":{"users":"35,397","newUsers":"10010","session":"2,584","bounceRate":"30.35%","pagesSession":"2.50","avg":"00:01:05"},"pinterest":{"users":"7000","newUsers":"3200","session":"2,584","bounceRate":"30.35%","pagesSession":"2.50","avg":"00:01:05"},"google":{"users":"17,397","newUsers":"5000","session":"2,584","bounceRate":"30.35%","pagesSession":"2.50","avg":"00:01:05"}},"year":{"facebook":{"users":"70,397","newUsers":"25002","session":"2,584","bounceRate":"30.35%","pagesSession":"2.50","avg":"00:01:05"},"twitter":{"users":"60,397","newUsers":"35100","session":"2,584","bounceRate":"30.35%","pagesSession":"2.50","avg":"00:01:05"},"linkdin":{"users":"40020","newUsers":"20010","session":"2,584","bounceRate":"30.35%","pagesSession":"2.50","avg":"00:01:05"},"youtube":{"users":"90,397","newUsers":"50010","session":"2,584","bounceRate":"30.35%","pagesSession":"2.50","avg":"00:01:05"},"pinterest":{"users":"25000","newUsers":"12010","session":"2,584","bounceRate":"30.35%","pagesSession":"2.50","avg":"00:01:05"},"google":{"users":"57,397","newUsers":"45000","session":"2,584","bounceRate":"30.35%","pagesSession":"2.50","avg":"00:01:05"}}},"twitterOverview":{"week":{"twist":{"data":"472","chartValue":[10,25,28,22,15,18,22,20,15,17,25,30]},"impressions":{"data":"2K","chartValue":[0,-10,18,5,17,0,1,2,11,30,15,30]},"retweets":{"data":78,"chartValue":[5,10,8,10,7,10,15,20,12,17,15,10]},"rate":{"data":"4.8","chartValue":[0,10,0,15,0,18,0,10,12,18,25,30]},"followers":{"data":178,"chartValue":[5,10,8,10,7,10,15,20,12,17,15,10]}},"month":{"twist":{"data":"2472","chartValue":[0,10,8,15,7,10,15,20,18,35,25,30]},"impressions":{"data":"8K","chartValue":[0,-10,18,5,17,0,1,2,11,30,15,30]},"retweets":{"data":278,"chartValue":[0,15,10,18,20,15,10,7,15,8,10,30]},"rate":{"data":"3.8","chartValue":[0,10,0,15,0,18,0,10,12,18,25,30]},"followers":{"data":778,"chartValue":[0,10,8,15,7,10,15,20,18,35,25,30]}},"year":{"twist":{"data":"5472","chartValue":[0,250,200,220,309,301,250,180,320,270,250,300]},"impressions":{"data":"78K","chartValue":[0,-10,18,5,17,0,1,2,11,30,15,30]},"retweets":{"data":2078,"chartValue":[0,250,200,220,309,301,250,180,320,270,250,300]},"rate":{"data":"4.8","chartValue":[0,10,0,15,0,18,0,10,12,18,25,30]},"followers":{"data":5778,"chartValue":[0,250,200,220,309,301,250,180,320,270,250,300]}}},"instagramOverview":{"week":{"post":{"data":"472","chartValue":[10,25,28,22,15,18,22,20,15,17,25,30]},"like":{"data":"2K","chartValue":[0,-10,18,5,17,0,1,2,11,30,15,30]},"comments":{"data":78,"chartValue":[5,10,8,10,7,10,15,20,12,17,15,10]},"rate":{"data":"4.8","chartValue":[0,10,0,15,0,18,0,10,12,18,25,30]},"followers":{"data":178,"chartValue":[5,10,8,10,7,10,15,20,12,17,15,10]}},"month":{"post":{"data":"2472","chartValue":[0,10,8,15,7,10,15,20,18,35,25,30]},"like":{"data":"8K","chartValue":[0,-10,18,5,17,0,1,2,11,30,15,30]},"comments":{"data":278,"chartValue":[0,15,10,18,20,15,10,7,15,8,10,30]},"rate":{"data":"3.8","chartValue":[0,10,0,15,0,18,0,10,12,18,25,30]},"followers":{"data":778,"chartValue":[0,10,8,15,7,10,15,20,18,35,25,30]}},"year":{"post":{"data":"5472","chartValue":[0,250,200,220,309,301,250,180,320,270,250,300]},"like":{"data":"78K","chartValue":[0,-10,18,5,17,0,1,2,11,30,15,30]},"comments":{"data":2078,"chartValue":[0,250,200,220,309,301,250,180,320,270,250,300]},"rate":{"data":"4.8","chartValue":[0,10,0,15,0,18,0,10,12,18,25,30]},"followers":{"data":5778,"chartValue":[0,250,200,220,309,301,250,180,320,270,250,300]}}},"linkdinOverview":{"week":{"post":{"data":"472","chartValue":[10,25,28,22,15,18,22,20,15,17,25,30]},"like":{"data":"2K","chartValue":[0,-10,18,5,17,0,1,2,11,30,15,30]},"comments":{"data":78,"chartValue":[5,10,8,10,7,10,15,20,12,17,15,10]},"rate":{"data":"4.8","chartValue":[0,10,0,15,0,18,0,10,12,18,25,30]},"followers":{"data":178,"chartValue":[5,10,8,10,7,10,15,20,12,17,15,10]}},"month":{"post":{"data":"2472","chartValue":[0,10,8,15,7,10,15,20,18,35,25,30]},"like":{"data":"8K","chartValue":[0,-10,18,5,17,0,1,2,11,30,15,30]},"comments":{"data":278,"chartValue":[0,15,10,18,20,15,10,7,15,8,10,30]},"rate":{"data":"3.8","chartValue":[0,10,0,15,0,18,0,10,12,18,25,30]},"followers":{"data":778,"chartValue":[0,10,8,15,7,10,15,20,18,35,25,30]}},"year":{"post":{"data":"5472","chartValue":[0,250,200,220,309,301,250,180,320,270,250,300]},"like":{"data":"78K","chartValue":[0,-10,18,5,17,0,1,2,11,30,15,30]},"comments":{"data":2078,"chartValue":[0,250,200,220,309,301,250,180,320,270,250,300]},"rate":{"data":"4.8","chartValue":[0,10,0,15,0,18,0,10,12,18,25,30]},"followers":{"data":5778,"chartValue":[0,250,200,220,309,301,250,180,320,270,250,300]}}},"cashFlow":{"week":{"current":"5,472","in":"5,414","out":"5,798","dataIn":[20,60,50,45,50,60,70],"dataOut":[10,40,30,40,60,55,45],"labels":["Sun","Mon","Tue","Wed","Thu","Fri","Sat"]},"month":{"current":"25,472","in":"35,414","out":"45,798","dataIn":[20,60,50,45,50,60,70,45,45,70,75,80],"dataOut":[30,40,30,40,60,55,45,35,30,90,45,50],"labels":["1-5","6-10","11-15","16-20","21-25","26-31"]},"year":{"current":"55,472","in":"50,414","out":"95,798","dataIn":[20,60,50,45,50,60,70,40,45,35,25,30],"dataOut":[10,40,30,40,60,55,45,35,30,20,15,20],"labels":["Jan","Feb","Mar","App","May","Jun","Jul","Aug","Sep","Nov","Oct","Dec"]}},"income":{"week":{"total":["52,784",[20,60,50,45,50,60,70]],"sale":["74,820",[10,20,30,40,30,20,45]],"expense":["32,143",[5,10,7,15,25,30,20]],"profit":["52,727",[10,40,30,40,60,55,45]],"labels":["Sun","Mon","Tue","Wed","Thu","Fri","Sat"]},"month":{"total":["952,784",[70,100,80,85,90,87,110]],"sale":["274,820",[50,70,50,40,60,70,50]],"expense":["532,143",[35,30,40,50,45,60,40]],"profit":["2952,784",[50,70,50,40,60,70,50]],"labels":["1-5","6-10","11-15","16-20","21-25","26-31"]},"year":{"hh":["303",[167,136]],"population":["2221",[1373,848]],"nets_req":["1152",[708,444]],"nets_dist":["1080",[686,444]],"labels":["Bukengele","Mufungu"]}},"performance":{"week":{"users":["22.6K",[20,25,25,30,35,30,25,25],[40,40,30,35,20,25,40,35]],"sessions":["27.2k",[25,35,30,40,25,25,40],[45,20,35,32,40,30,25]],"bounce":["26.3%",[40,30,35,35,30,30,25],[20,30,25,25,40,30,25]],"duration":["2m 18s",[40,35,35,30,25,25,35],[30,25,35,30,30,35,30]],"labels":["Sun","Mon","Tue","Wed","Thu","Fri","Sat"]},"month":{"users":["52.6K",[65,35,45,42,65,60,42,45,35,55,40,65],[45,20,35,32,50,45,32,35,25,40,30,55]],"sessions":["47.2k",[65,35,45,42,65,60,42,45,35,55,40,30],[45,20,35,32,50,45,32,35,25,40,30,25]],"bounce":["26.3%",[35,35,45,42,65,60,42,45,35,55,40,30],[20,20,35,32,50,45,32,35,25,40,30,25]],"duration":["2m 18s",[65,35,45,42,65,60,42,45,35,55,40,65],[45,20,35,32,50,45,32,35,25,40,30,55]],"labels":["1-5","6-10","11-15","16-20","21-25","26-31"]},"year":{"users":["72.6K",[65,35,45,42,65,60,42,45,35,55,40,65],[45,20,35,32,50,45,32,35,25,40,30,55]],"sessions":["87.2k",[65,35,45,42,65,60,42,45,35,55,40,30],[45,20,35,32,50,45,32,35,25,40,30,25]],"bounce":["26.3%",[35,35,45,42,65,60,42,45,35,55,40,30],[20,20,35,32,50,45,32,35,25,40,30,25]],"duration":["2m 18s",[65,35,45,42,65,60,42,45,35,55,40,65],[45,20,35,32,50,45,32,35,25,40,30,55]],"labels":["Jan","Feb","Mar","App","May","Jun","Jul","Aug","Sep","Nov","Oct","Dec"]}},"trafficChanel":{"week":{"direct":{"sessions":"3,397","rate":"3.5","goals":"225","percent":"70","value":"23.28"},"email":{"sessions":"5,397","rate":"3.5","goals":"225","percent":"63","value":"23.28"},"search":{"sessions":"7,397","rate":"3.5","goals":"225","percent":"83","value":"23.28"},"referral":{"sessions":"1,397","rate":"3.5","goals":"225","percent":"73","value":"23.28"},"media":{"sessions":"397","rate":"3.5","goals":"225","percent":"73","value":"23.28"},"other":{"sessions":"6,397","rate":"3.5","goals":"225","percent":"73","value":"23.28"}},"month":{"direct":{"sessions":"23,397","rate":"4.5","goals":"2225","percent":"70","value":"23.28"},"email":{"sessions":"25,397","rate":"4.5","goals":"1225","percent":"63","value":"23.28"},"search":{"sessions":"27,397","rate":"3.5","goals":"2025","percent":"83","value":"23.28"},"referral":{"sessions":"11,397","rate":"5","goals":"2205","percent":"73","value":"23.28"},"media":{"sessions":"2397","rate":"3.5","goals":"2025","percent":"73","value":"23.28"},"other":{"sessions":"2,397","rate":"3.5","goals":"225","percent":"73","value":"23.28"}},"year":{"direct":{"sessions":"93,397","rate":"4.2","goals":"9225","percent":"80","value":"23.28"},"email":{"sessions":"25,397","rate":"4.5","goals":"12025","percent":"70","value":"23.28"},"search":{"sessions":"100,397","rate":"3.5","goals":"9025","percent":"83","value":"23.28"},"referral":{"sessions":"51,397","rate":"5","goals":"5205","percent":"73","value":"23.28"},"media":{"sessions":"9397","rate":"3.5","goals":"2025","percent":"73","value":"23.28"},"other":{"sessions":"5,397","rate":"3.5","goals":"225","percent":"73","value":"23.28"}}},"device":{"today":[83,70,20],"week":[483,870,420],"month":[4483,5870,2420],"year":[9483,13870,15420]},"region":{"week":[["United State",3947],["United Kingdom",5578],["Canada",398],["Japan",391],["India",242],["Bangladesh",74],["Brazil",10]],"month":[["United State",23947],["United Kingdom",15578],["Canada",8398],["Japan",3391],["India",1242],["Bangladesh",374],["Brazil",210]],"year":[["United State",93947],["United Kingdom",85578],["Canada",10398],["Japan",9391],["India",7242],["Bangladesh",974],["Brazil",710]]},"generated":{"week":[{"key":"1","name":"Google","visitors":"3,397","page_View":"2,201","revenue":"$536","trend":{"data":[0,10,8,14,7,10],"borderColor":"#5F63F2"}},{"key":"2","name":"Facebook","visitors":"4,456","page_View":"2,101","revenue":"$745","trend":{"data":[10,7,14,8,5,11],"borderColor":"#FF69A5"}},{"key":"3","name":"Email marketing","visitors":"5,148","page_View":"9,105","revenue":"$256","trend":{"data":[7,11,5,3,7,9],"borderColor":"#20C997"}},{"key":"4","name":"Direct website","visitors":"6,954","page_View":"7,358","revenue":"$852","trend":{"data":[10,5,9,6,11,7],"borderColor":"#2C99FF"}},{"key":"5","name":"Referral","visitors":"9,963","page_View":"5,741","revenue":"$159","trend":{"data":[5,15,6,21,9,16],"borderColor":"#FA8B0C"}}],"month":[{"key":"1","name":"Google","visitors":"23,397","page_View":"12,201","revenue":"$5,536","trend":{"data":[0,10,8,14,7,10],"borderColor":"#5F63F2"}},{"key":"2","name":"Facebook","visitors":"14,456","page_View":"12,101","revenue":"$4,745","trend":{"data":[10,7,14,8,5,11],"borderColor":"#FF69A5"}},{"key":"3","name":"Email marketing","visitors":"45,148","page_View":"19,105","revenue":"$8,256","trend":{"data":[7,11,5,3,7,9],"borderColor":"#20C997"}},{"key":"4","name":"Direct website","visitors":"26,954","page_View":"17,358","revenue":"$9,852","trend":{"data":[10,5,9,6,11,7],"borderColor":"#2C99FF"}},{"key":"5","name":"Referral","visitors":"89,963","page_View":"75,741","revenue":"$11,159","trend":{"data":[5,15,6,21,9,16],"borderColor":"#FA8B0C"}}],"year":[{"key":"1","name":"Google","visitors":"93,397","page_View":"82,201","revenue":"$9,536","trend":{"data":[0,10,8,14,7,10],"borderColor":"#5F63F2"}},{"key":"2","name":"Facebook","visitors":"74,456","page_View":"62,101","revenue":"$9,745","trend":{"data":[10,7,14,8,5,11],"borderColor":"#FF69A5"}},{"key":"3","name":"Email marketing","visitors":"95,148","page_View":"59,105","revenue":"$10,256","trend":{"data":[7,11,5,3,7,9],"borderColor":"#20C997"}},{"key":"4","name":"Direct website","visitors":"86,954","page_View":"37,358","revenue":"$10,852","trend":{"data":[10,5,9,6,11,7],"borderColor":"#2C99FF"}},{"key":"5","name":"Referral","visitors":"100,963","page_View":"100,741","revenue":"$91,159","trend":{"data":[5,15,6,21,9,16],"borderColor":"#FA8B0C"}}]},"topSale":{"today":[{"key":"1","img":"1.png","name":"Nakuru County","price":"$280","sold":"26","revenue":"$536"},{"key":"2","img":"2.png","name":"Half Sleeve Shirt","price":"$39","sold":"80","revenue":"$573"},{"key":"3","img":"3.png","name":"Marco Shoes","price":"$89","sold":"81","revenue":"$758"},{"key":"4","img":"4.png","name":"Marco Shoes","price":"$32","sold":"51","revenue":"$8,105"},{"key":"5","img":"5.png","name":"15\\" MackBook Pro","price":"$950","sold":"45","revenue":"$5,154"}],"week":[{"key":"1","img":"1.png","name":"Samsung Galaxy S8 256GB","price":"$280","sold":"126","revenue":"$38,536"},{"key":"2","img":"2.png","name":"Half Sleeve Shirt","price":"$39","sold":"180","revenue":"$20,573"},{"key":"3","img":"3.png","name":"Marco Shoes","price":"$89","sold":"581","revenue":"$170,758"},{"key":"4","img":"5.png","name":"Marco Shoes","price":"$32","sold":"451","revenue":"$258,105"},{"key":"5","img":"4.png","name":"15\\" MackBook Pro","price":"$950","sold":"745","revenue":"$745,154"}],"month":[{"key":"1","img":"1.png","name":"Samsung Galaxy S8 256GB","price":"$280","sold":"526","revenue":"$78,536"},{"key":"2","img":"2.png","name":"Half Sleeve Shirt","price":"$39","sold":"680","revenue":"$50,573"},{"key":"3","img":"3.png","name":"Marco Shoes","price":"$89","sold":"981","revenue":"$570,758"},{"key":"4","img":"5.png","name":"Marco Shoes","price":"$32","sold":"951","revenue":"$658,105"},{"key":"5","img":"4.png","name":"15\\" MackBook Pro","price":"$950","sold":"Kinga Malaria","revenue":"945,154"}],"year":[{"key":"1","img":"1.png","name":"Nakuru County","price":"$280","sold":"Kinga Malaria","revenue":"308,536"},{"key":"2","img":"2.png","name":"Bungoma County","price":"$39","sold":"Kinga Malaria","revenue":"2,00,573"},{"key":"3","img":"3.png","name":"Kakamega County","price":"$89","sold":"Kinga Malaria","revenue":"1,070,758"},{"key":"4","img":"5.png","name":"Turkana County","price":"$32","sold":"Kinga Malaria","revenue":"2,508,105"},{"key":"5","img":"4.png","name":"Narok County","price":"$950","sold":"Kinga Malaria","revenue":"7,045,154"}]},"recentDeal":{"today":[{"key":"1","name":"Laikipia County","date":"20 June 2021","price":"$536.00","img":"static/img/users/1.png"},{"key":"2","name":"Kajiado County","date":"20 June 2021","price":"$336.00","img":"static/img/users/2.png"},{"key":"3","name":"Baringo County","date":"20 June 2021","price":"$356.00","img":"static/img/users/3.png"},{"key":"4","name":"Kakamega County","date":"20 June 2021","price":"$383.00","img":"static/img/users/4.png"},{"key":"5","name":"Kwale County","date":"20 June 2021","price":"$536.00","img":"static/img/users/5.png"}],"week":[{"key":"1","name":"John ","date":"20 June 2021","price":"$1536.00","img":"static/img/users/1.png"},{"key":"2","name":"David Miller","date":"20 June 2021","price":"$1336.00","img":"static/img/users/2.png"},{"key":"3","name":"Chris Lein","date":"20 June 2021","price":"$1356.00","img":"static/img/users/3.png"},{"key":"4","name":"Ahmad Musa","date":"20 June 2021","price":"$1383.00","img":"static/img/users/4.png"},{"key":"5","name":"Robert Philips","date":"20 June 2021","price":"$1536.00","img":"static/img/users/5.png"}],"month":[{"key":"1","name":"John Mark","date":"20 June 2021","price":"$5536.00","img":"static/img/users/1.png"},{"key":"2","name":"David Miller","date":"20 June 2021","price":"$5336.00","img":"static/img/users/2.png"},{"key":"3","name":"Chris Lein","date":"20 June 2021","price":"$5356.00","img":"static/img/users/3.png"},{"key":"4","name":"Ahmad Musa","date":"20 June 2021","price":"$5383.00","img":"static/img/users/4.png"},{"key":"5","name":"Robert Philips","date":"20 June 2021","price":"$5536.00","img":"static/img/users/5.png"}],"year":[{"key":"1","name":"Isiolo County","date":"","price":"400","img":"static/img/users/1.png"},{"key":"2","name":"Kisumu County","date":"","price":"336","img":"static/img/users/2.png"},{"key":"3","name":"Nyamira County","date":"","price":"700","img":"static/img/users/3.png"},{"key":"4","name":"Uasin Gishu County","date":"","price":"500","img":"static/img/users/4.png"},{"key":"5","name":"Murang\'a  County","date":"","price":"353","img":"static/img/users/5.png"}]},"location":{"today":[{"key":"1","location":"United States","order":"97","revenue":"$536"},{"key":"2","location":"United Kingdom","order":"20","revenue":"$748"},{"key":"3","location":"Canada","order":"10","revenue":"$415"},{"key":"4","location":"China","order":"18","revenue":"$963"}],"week":[{"key":"1","location":"United States","order":"397","revenue":"$38,536"},{"key":"2","location":"United Kingdom","order":"420","revenue":"$45,748"},{"key":"3","location":"Canada","order":"210","revenue":"$96,415"},{"key":"4","location":"China","order":"108","revenue":"$25,963"}],"month":[{"key":"1","location":"United States","order":"797","revenue":"$78,536"},{"key":"2","location":"United Kingdom","order":"920","revenue":"$95,748"},{"key":"3","location":"Canada","order":"710","revenue":"$100,415"},{"key":"4","location":"China","order":"608","revenue":"$95,963"}],"year":[{"key":"1","location":"United States","order":"1397","revenue":"$308,536"},{"key":"2","location":"United Kingdom","order":"1420","revenue":"$405,748"},{"key":"3","location":"Canada","order":"1210","revenue":"$100,415"},{"key":"4","location":"China","order":"1508","revenue":"$250,963"}]}}'),h={recentDealBegin(e){e.reLoading=!0},recentDealSuccess(e,t){e.reLoading=!1,e.recentDealData=t},recentDealErr(e,t){e.reLoading=!1,e.error=t},closeDealBegin(e){e.cdLoading=!0},closeDealSuccess(e,t){e.cdLoading=!1,e.closeDealData=t},closeDealErr(e,t){e.cdLoading=!1,e.error=t},topSaleBegin(e){e.tsLoading=!0},topSaleSuccess(e,t){e.tsLoading=!1,e.topSaleData=t},topSaleErr(e,t){e.tsLoading=!1,e.error=t},topLocationBegin(e){e.tsLoading=!0},topLocationSuccess(e,t){e.tsLoading=!1,e.locationData=t},topLocationErr(e,t){e.tsLoading=!1,e.error=t},regionBegin(e){e.tsLoading=!0},regionSuccess(e,t){e.tsLoading=!1,e.locationData=t},regionErr(e,t){e.tsLoading=!1,e.error=t},generatedBegin(e){e.geLoading=!0},generatedSuccess(e,t){e.geLoading=!1,e.generatedData=t},generatedErr(e,t){e.geLoading=!1,e.error=t},performanceBegin(e){e.perLoading=!0},performanceSuccess(e,t){e.perLoading=!1,e.performanceData=t},performanceErr(e,t){e.perLoading=!1,e.error=t},updateLoadingBegin(e){e.perLoading=!0},updateLoadingSuccess(e){e.perLoading=!1},updateLoadingErr(e){e.perLoading=!1},trafficChanelBegin(e){e.tcLoading=!0},trafficChanelSuccess(e,t){e.tcLoading=!1,e.trafficChanelData=t},trafficChanelErr(e,t){e.tcLoading=!1,e.error=t},landingPageBegin(e){e.lpLoading=!0},landingPageSuccess(e,t){e.lpLoading=!1,e.landingPageData=t},landingPageErr(e,t){e.lpLoading=!1,e.error=t},topRegionBegin(e){e.reLoading=!0},topRegionSuccess(e,t){e.reLoading=!1,e.regionData=t},topRegionErr(e,t){e.reLoading=!1,e.error=t},deviceBegin(e){e.dvLoading=!0},deviceSuccess(e,t){e.dvLoading=!1,e.deviceData=t},deviceErr(e,t){e.dvLoading=!1,e.error=t},incomeBegin(e){e.icLoading=!0},incomeSuccess(e,t){e.icLoading=!1,e.incomeData=t},incomeErr(e,t){e.icLoading=!1,e.error=t},cashFlowBegin(e){e.cfLoading=!0},cashFlowSuccess(e,t){e.cfLoading=!1,e.cashFlowData=t},cashFlowErr(e,t){e.cfLoading=!1,e.error=t},socialTrafficBegin(e){e.soLoading=!0},socialTrafficSuccess(e,t){e.soLoading=!1,e.socialTrafficData=t},socialTrafficErr(e,t){e.soLoading=!1,e.error=t},linkdinOverviewBegin(e){e.liLoading=!0},linkdinOverviewSuccess(e,t){e.liLoading=!1,e.linkdinOverviewData=t},linkdinOverviewErr(e,t){e.liLoading=!1,e.error=t},instagramOverviewBegin(e){e.inLoading=!0},instagramOverviewSuccess(e,t){e.inLoading=!1,e.instagramOverviewData=t},instagramOverviewErr(e,t){e.inLoading=!1,e.error=t},twitterOverviewBegin(e){e.twLoading=!0},twitterOverviewSuccess(e,t){e.twLoading=!1,e.twitterOverviewData=t},twitterOverviewErr(e,t){e.twLoading=!1,e.error=t},forcastOverviewBegin(e){e.foLoading=!0},forcastOverviewSuccess(e,t){e.foLoading=!1,e.forcastData=t},forcastOverviewErr(e,t){e.foLoading=!1,e.error=t},youtubeSubscribeBegin(e){e.yuLoading=!0},youtubeSubscribeSuccess(e,t){e.yuLoading=!1,e.youtubeSubscribeData=t},youtubeSubscribeErr(e,t){e.yuLoading=!1,e.error=t}};const{forcastOverview:x,youtubeSubscribe:f,twitterOverview:b,instagramOverview:y,linkdinOverview:w,SocialTrafficMetrics:v,cashFlow:k,income:$,device:A,location:P,region:D,trafficChanel:S,performance:E,generated:B,topSale:C,closedDeals:L,recentDeal:I}=u,_=()=>({forcastData:null,foLoading:!1,youtubeSubscribeData:null,yuLoading:!1,closeDealData:null,cdLoading:!1,recentDealData:null,recLoading:!1,socialTrafficData:null,soLoading:!1,twitterOverviewData:null,twLoading:!1,instagramOverviewData:null,inLoading:!1,linkdinOverviewData:null,liLoading:!1,cashFlowData:null,cfLoading:!1,incomeData:null,icLoading:!1,performanceData:null,perLoading:!1,trafficChanelData:null,tcLoading:!1,deviceData:null,dvLoading:!1,landingPageData:null,lpLoading:!1,regionData:null,reLoading:!1,generatedData:null,geLoading:!1,topSaleData:null,tsLoading:!1,locationData:null,loLoading:!1,error:null}),U={async recentDealGetData({commit:e}){const{year:t}=I;try{e("recentDealBegin"),e("recentDealSuccess",t)}catch(a){e("recentDealErr",a)}},async recentDealFilterData({commit:e},t){try{e("recentDealBegin"),setTimeout((()=>{e("recentDealSuccess",I[t])}),100)}catch(a){e("recentDealErr",a)}},async closeDealGetData({commit:e}){const{year:t}=L;try{e("closeDealBegin"),e("closeDealSuccess",t)}catch(a){e("closeDealErr",a)}},async closeDealFilterData({commit:e},t){try{e("closeDealBegin"),setTimeout((()=>{e("closeDealSuccess",L[t])}),100)}catch(a){e("closeDealErr",a)}},async topSaleGetData({commit:e}){const{year:t}=C;try{e("topSaleBegin"),e("topSaleSuccess",t)}catch(a){e("topSaleErr",a)}},async topSaleFilterData({commit:e},t){try{e("topSaleBegin"),setTimeout((()=>{e("topSaleSuccess",C[t])}),100)}catch(a){e("topSaleErr",a)}},async topLocationGetData({commit:e}){const{year:t}=P;try{e("topLocationBegin"),e("topLocationSuccess",t)}catch(a){e("topLocationErr",a)}},async topLocationFilterData({commit:e},t){try{e("topLocationBegin"),setTimeout((()=>{e("topLocationSuccess",P[t])}),100)}catch(a){e("topLocationErr",a)}},async topRegionGetData({commit:e}){const{year:t}=D;try{e("topRegionBegin"),e("topRegionSuccess",t)}catch(a){e("topRegionErr",a)}},async topRegionFilterData({commit:e},t){try{e("topRegionBegin"),setTimeout((()=>{e("topRegionSuccess",D[t])}),100)}catch(a){e("topRegionErr",a)}},async generatedGetData({commit:e}){const{year:t}=B;try{e("generatedBegin"),e("generatedSuccess",t)}catch(a){e("generatedErr",a)}},async generatedFilterData({commit:e},t){try{e("generatedBegin"),setTimeout((()=>{e("generatedSuccess",B[t])}),100)}catch(a){e("generatedErr",a)}},async performanceGetData({commit:e}){const{year:t}=E;try{e("performanceBegin"),e("performanceSuccess",t)}catch(a){e("performanceErr",a)}},async performanceFilterData({commit:e},t){try{e("performanceBegin"),setTimeout((()=>{e("performanceSuccess",E[t])}),100)}catch(a){e("performanceErr",a)}},async setIsLoading({commit:e}){try{e("updateLoadingBegin"),setTimeout((()=>{e("updateLoadingSuccess")}),100)}catch(t){e("updateLoadingErr")}},async trafficChanelGetData({commit:e}){const{year:t}=S;try{e("trafficChanelBegin"),e("trafficChanelSuccess",t)}catch(a){e("trafficChanelErr",a)}},async trafficChanelFilterData({commit:e},t){try{e("trafficChanelBegin"),setTimeout((()=>{e("trafficChanelSuccess",S[t])}),100)}catch(a){e("trafficChanelErr",a)}},async landingPageGetData({commit:e}){const{year:t}=S;try{e("landingPageBegin"),e("landingPageSuccess",t)}catch(a){e("landingPageErr",a)}},async landingPageFilterData({commit:e},t){try{e("landingPageBegin"),setTimeout((()=>{e("landingPageSuccess",S[t])}),100)}catch(a){e("landingPageErr",a)}},async regionGetData({commit:e}){const{year:t}=D;try{e("regionBegin"),e("regionSuccess",t)}catch(a){e("regionErr",a)}},async regionFilterData({commit:e},t){try{e("regionBegin"),setTimeout((()=>{e("regionSuccess",D[t])}),100)}catch(a){e("regionErr",a)}},async deviceGetData({commit:e}){const{year:t}=A;try{e("deviceBegin"),e("deviceSuccess",t)}catch(a){e("deviceErr",a)}},async deviceFilterData({commit:e},t){try{e("deviceBegin"),setTimeout((()=>{e("deviceSuccess",A[t])}),100)}catch(a){e("deviceErr",a)}},async incomeGetData({commit:e}){const{year:t}=$;try{e("incomeBegin"),e("incomeSuccess",t)}catch(a){e("incomeErr",a)}},async incomeFilterData({commit:e},t){try{e("incomeBegin"),setTimeout((()=>{e("incomeSuccess",$[t])}),100)}catch(a){e("incomeErr",a)}},async cashFlowGetData({commit:e}){const{year:t}=k;try{e("cashFlowBegin"),e("cashFlowSuccess",t)}catch(a){e("cashFlowErr",a)}},async cashFlowFilterData({commit:e},t){try{e("cashFlowBegin"),setTimeout((()=>{e("cashFlowSuccess",k[t])}),100)}catch(a){e("cashFlowErr",a)}},async socialTrafficGetData({commit:e}){const{today:t}=v;try{e("socialTrafficBegin"),e("socialTrafficSuccess",t)}catch(a){e("socialTrafficErr",a)}},async socialTrafficFilterData({commit:e},t){try{e("socialTrafficBegin"),setTimeout((()=>{e("socialTrafficSuccess",v[t])}),100)}catch(a){e("socialTrafficErr",a)}},async linkdinOverviewGetData({commit:e}){const{month:t}=w;try{e("linkdinOverviewBegin"),e("linkdinOverviewSuccess",t)}catch(a){e("linkdinOverviewErr",a)}},async linkdinOverviewFilterData({commit:e},t){try{e("linkdinOverviewBegin"),setTimeout((()=>{e("linkdinOverviewSuccess",w[t])}),100)}catch(a){e("linkdinOverviewErr",a)}},async instagramOverviewGetData({commit:e}){const{month:t}=y;try{e("instagramOverviewBegin"),e("instagramOverviewSuccess",t)}catch(a){e("instagramOverviewErr",a)}},async instagramOverviewFilterData({commit:e},t){try{e("instagramOverviewBegin"),setTimeout((()=>{e("instagramOverviewSuccess",y[t])}),100)}catch(a){e("instagramOverviewErr",a)}},async forcastOverviewGetData({commit:e}){const{today:t}=x;try{e("forcastOverviewBegin"),e("forcastOverviewSuccess",t)}catch(a){e("forcastOverviewErr",a)}},async forcastOverviewFilterData({commit:e},t){try{e("forcastOverviewBegin"),setTimeout((()=>{e("forcastOverviewSuccess",x[t])}),100)}catch(a){e("forcastOverviewErr",a)}},async youtubeSubscribeGetData({commit:e}){const{year:t}=f;try{e("youtubeSubscribeBegin"),e("youtubeSubscribeSuccess",t)}catch(a){e("youtubeSubscribeErr",a)}},async youtubeSubscribeFilterData({commit:e},t){try{e("youtubeSubscribeBegin"),setTimeout((()=>{e("youtubeSubscribeSuccess",f[t])}),100)}catch(a){e("youtubeSubscribeErr",a)}},async twitterOverviewGetData({commit:e}){const{month:t}=b;try{e("twitterOverviewBegin"),e("twitterOverviewSuccess",t)}catch(a){e("twitterOverviewErr",a)}},async twitterOverviewFilterData({commit:e},t){try{e("twitterOverviewBegin"),setTimeout((()=>{e("twitterOverviewSuccess",b[t])}),100)}catch(a){e("twitterOverviewErr",a)}}};var Z={namespaced:!1,state:_,actions:U,mutations:h},F=JSON.parse('{"O":[{"userName":"Hasan Mahmud","email":"hasan@gmail.com","status":"unread","type":"inbox","stared":false,"from":"name@example.com","to":"me","img":"t1.jpg","id":1585118055048,"subject":"Email subject lorem ipsum","attach":[],"body":"Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry\'s standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum."},{"userName":"Mohammad Delower Hossain","email":"deloar@gmail.com","status":"read","type":"sent","from":"me","to":"name@example.com","stared":false,"img":"t2.jpg","id":1585118175550,"subject":"Email subject lorem ipsum","attach":[],"body":"Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry\'s standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum."},{"userName":"Mohammad Atik","email":"atik@gmail.com","status":"read","type":"inbox","from":"name@example.com","to":"me","stared":true,"img":"t3.jpg","id":1585118261699,"subject":"Email subject lorem ipsum","attach":[],"body":"Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry\'s standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum."},{"userName":"Alice Freeman","email":"azim@gmail.com","status":"read","type":"inbox","from":"name@example.com","to":"me","stared":false,"img":"t4.jpg","id":1585118306947,"subject":"Email subject lorem ipsum","attach":["1.png","2.png"],"body":"Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry\'s standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum."},{"userName":"Hileri Makr","email":"abdullah@gmail.com","status":"read","type":"sent","from":"me","to":"name@example.com","stared":false,"img":"t5.png","id":1585118306999,"subject":"Email subject lorem ipsum","attach":[],"body":"Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry\'s standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum."},{"userName":"Vincent Porter","email":"sorif@gmail.com","status":"read","type":"inbox","from":"name@example.com","to":"me","stared":false,"img":"t6.png","id":1593052811353,"subject":"Email subject lorem ipsum","attach":[],"body":"Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry\'s standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum."},{"userName":"Sam Porter","email":"tanvir@gmail.com","status":"read","type":"inbox","from":"name@example.com","to":"me","stared":false,"img":"t7.png","id":1593052915496,"subject":"Email subject lorem ipsum","attach":[],"body":"Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry\'s standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum."},{"userName":"Jenisha Trivedi","email":"tanvir@gmail.com","status":"read","type":"inbox","from":"name@example.com","to":"me","stared":false,"img":"t8.png","id":1593052915497,"subject":"Email subject lorem ipsum","attach":[],"body":"Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry\'s standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum."},{"userName":"Sarah Graves","email":"tanvir@gmail.com","status":"read","type":"inbox","from":"name@example.com","to":"me","stared":false,"img":"t9.png","id":1593052915498,"subject":"Email subject lorem ipsum","attach":[],"body":"Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry\'s standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum."},{"userName":"AI Could Uber","email":"tanvir@gmail.com","status":"read","type":"inbox","from":"name@example.com","to":"me","stared":false,"img":"t10.png","id":1593052915499,"subject":"Email subject lorem ipsum","attach":[],"body":"Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry\'s standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum."},{"userName":"Sam Porter","email":"tanvir@gmail.com","status":"read","type":"inbox","from":"name@example.com","to":"me","stared":false,"img":"t12.png","id":1593052915596,"subject":"Email subject lorem ipsum","attach":[],"body":"Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry\'s standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum."}]}'),j={singleEmailBegin(e){e.loading=!0},singleEmailSuccess(e,t){e.loading=!1,e.data=t},singleEmailErr(e,t){e.loading=!1,e.error=t},starUpdateBegin(e){e.sLoading=!0},starUpdateSuccess(e,t){e.sLoading=!1,e.allMessage=t},starUpdateErr(e,t){e.sLoading=!1,e.error=t}};const z=()=>({data:F.O,allMessage:F.O,sLoading:!1,loading:!1,error:null}),R={async filterSinglePage({commit:e},t){try{e("singleEmailBegin");const a=F.O.filter((e=>e.id===t));e("singleEmailSuccess",a)}catch(a){e("singleEmailErr",a)}},async onStarUpdate({commit:e},t){try{e("starUpdateBegin"),F.O.map((a=>a.id===t?a.stared?a.stared=!1:a.stared=!0:e("starUpdateSuccess",F.O)))}catch(a){e("starUpdateErr",a)}},async onSortingAscending({commit:e}){try{e("starUpdateBegin");const t=F.O.sort(((e,t)=>parseInt(t.id,10)-parseInt(e.id,10)));e("starUpdateSuccess",t)}catch(t){e("starUpdateErr",t)}},async onSortingDescending({commit:e}){try{e("starUpdateBegin");const t=F.O.sort(((e,t)=>parseInt(e.id,10)-parseInt(t.id,10)));e("starUpdateSuccess",t)}catch(t){e("starUpdateErr",t)}}};var M={namespaced:!1,state:z,actions:R,mutations:j},T=JSON.parse('[{"id":1,"title":"AntDesign","count":10000},{"id":2,"title":"Design UI","count":10600},{"id":3,"title":"Bootstrap Design UI","count":60100},{"id":4,"title":"Meterial design","count":30010},{"id":5,"title":"AntDesign design language","count":100000}]'),O={searchHeaderSuccess(e,t){t},searchHeaderErr(e,t){t}};const N=()=>T,W={async headerSearchAction({commit:e},t){try{e("searchHeaderBegin");const a=T.filter((e=>e.title.startsWith(t)));e("searchHeaderSuccess",a)}catch(a){e("searchHeaderErr",a)}}};var V={namespaced:!1,state:N,actions:W,mutations:O},J=JSON.parse('[{"V":[{"userName":"Md. Rofiq","email":"rofiq@gmail.com","time":1588219733771,"status":true,"img":"t1.jpg","active":true,"content":[{"content":"Jam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat consetetur sadipscing elitr sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat sed diam voluptua.","time":1585539620626,"seen":false,"reaction":false,"email":"rofiq@gmail.com","img":"t1.jpg"},{"content":"Jam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat consetetur sadipscing elitr sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat sed diam voluptua.","time":1585545728254,"seen":false,"reaction":false,"email":"woadud@gmail.com","img":"w.png"},{"content":"Jam nonumy eirmod tempor invidunt ut labore et dolore magna","time":1585545744546,"seen":false,"reaction":false,"email":"woadud@gmail.com","img":"w.png"},{"content":"Jam nonumy eirmod tempor invidunt ut labore et dolore magna.","time":1585545978832,"seen":false,"reaction":false,"email":"rofiq@gmail.com","img":"t1.jpg"},{"content":"Jam nonumy eirmod tempor invidunt ut labore et dolore magna","time":1585545744547,"seen":false,"reaction":false,"email":"woadud@gmail.com","img":"w.png"}]},{"userName":"Roshid Khan","email":"rosid@gmail.com","time":1588219733771,"status":true,"img":"t2.jpg","active":false,"content":[{"content":"Jam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat consetetur sadipscing elitr sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat sed diam voluptua.","time":1585539620626,"seen":false,"reaction":false,"email":"rosid@gmail.com","img":"t2.jpg"},{"content":"Jam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat consetetur sadipscing elitr sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat sed diam voluptua.","time":1585545728254,"seen":false,"reaction":false,"email":"woadud@gmail.com","img":"w.png"},{"content":"Jam nonumy eirmod tempor invidunt ut labore et dolore magna","time":1585545744548,"seen":false,"reaction":false,"email":"woadud@gmail.com","img":"w.png"},{"content":"Jam nonumy eirmod tempor invidunt ut labore et dolore magna.","time":1585545978832,"seen":false,"reaction":false,"email":"rosid@gmail.com","img":"t2.jpg"},{"content":"Jam nonumy eirmod tempor invidunt ut labore et dolore magna","time":1585545744549,"seen":false,"reaction":false,"email":"woadud@gmail.com","img":"w.png"}]},{"userName":"Domnic Harys","email":"domic@gmail.com","time":1588219733771,"status":true,"img":"t3.jpg","active":true,"content":[{"content":"Jam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat consetetur sadipscing elitr sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat sed diam voluptua.","time":1585539620626,"seen":false,"reaction":false,"email":"domic@gmail.com","img":"t3.jpg"},{"content":"Jam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat consetetur sadipscing elitr sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat sed diam voluptua.","time":1585545728254,"seen":false,"reaction":false,"email":"woadud@gmail.com","img":"w.png"},{"content":"Jam nonumy eirmod tempor invidunt ut labore et dolore magna","time":1585545744550,"seen":false,"reaction":false,"email":"woadud@gmail.com","img":"w.png"},{"content":"Jam nonumy eirmod tempor invidunt ut labore et dolore magna.","time":1585545978832,"seen":false,"reaction":false,"email":"domic@gmail.com","img":"t3.jpg"},{"content":"Jam nonumy eirmod tempor invidunt ut labore et dolore magna","time":1585545744551,"seen":false,"reaction":false,"email":"woadud@gmail.com","img":"w.png"}]},{"userName":"Shreyu Neu","email":"shreyu@gmail.com","time":1588219733771,"status":true,"img":"t4.jpg","active":true,"content":[{"content":"Jam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat consetetur sadipscing elitr sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat sed diam voluptua.","time":1585539620626,"seen":false,"reaction":false,"email":"shreyu@gmail.com","img":"t4.jpg"},{"content":"Jam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat consetetur sadipscing elitr sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat sed diam voluptua.","time":1585545728254,"seen":false,"reaction":false,"email":"woadud@gmail.com","img":"w.png"},{"content":"Jam nonumy eirmod tempor invidunt ut labore et dolore magna","time":1585545744552,"seen":false,"reaction":false,"email":"woadud@gmail.com","img":"w.png"},{"content":"Jam nonumy eirmod tempor invidunt ut labore et dolore magna.","time":1585545978832,"seen":false,"reaction":false,"email":"shreyu@gmail.com","img":"t4.jpg"},{"content":"Jam nonumy eirmod tempor invidunt ut labore et dolore magna","time":1585545744553,"seen":false,"reaction":false,"email":"woadud@gmail.com","img":"w.png"}]},{"userName":"Khalid Hasan","email":"khalid@gmail.com","time":1588219733771,"status":true,"img":"t5.png","active":false,"content":[{"content":"Jam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat consetetur sadipscing elitr sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat sed diam voluptua.","time":1585539620626,"seen":false,"reaction":false,"email":"khalid@gmail.com","img":"t5.png"},{"content":"Jam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat consetetur sadipscing elitr sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat sed diam voluptua.","time":1585545728254,"seen":false,"reaction":false,"email":"woadud@gmail.com","img":"w.png"},{"content":"Jam nonumy eirmod tempor invidunt ut labore et dolore magna","time":1585545744554,"seen":false,"reaction":false,"email":"woadud@gmail.com","img":"w.png"},{"content":"Jam nonumy eirmod tempor invidunt ut labore et dolore magna.","time":1585545978832,"seen":false,"reaction":false,"email":"khalid@gmail.com","img":"t5.png"},{"content":"Jam nonumy eirmod tempor invidunt ut labore et dolore magna","time":1585545744555,"seen":false,"reaction":false,"email":"woadud@gmail.com","img":"w.png"}]},{"userName":"Tuhin Molla","email":"tuhin@gmail.com","time":1588219733771,"status":true,"img":"t6.png","active":false,"content":[{"content":"Jam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat consetetur sadipscing elitr sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat sed diam voluptua.","time":1585539620626,"seen":false,"reaction":false,"email":"tuhin@gmail.com","img":"t6.png"},{"content":"Jam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat consetetur sadipscing elitr sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat sed diam voluptua.","time":1585545728254,"seen":false,"reaction":false,"email":"woadud@gmail.com","img":"w.png"},{"content":"Jam nonumy eirmod tempor invidunt ut labore et dolore magna","time":1585545744554,"seen":false,"reaction":false,"email":"woadud@gmail.com","img":"w.png"},{"content":"Jam nonumy eirmod tempor invidunt ut labore et dolore magna.","time":1585545978832,"seen":false,"reaction":false,"email":"tuhin@gmail.com","img":"t6.png"},{"content":"Jam nonumy eirmod tempor invidunt ut labore et dolore magna","time":1585545744455,"seen":false,"reaction":false,"email":"woadud@gmail.com","img":"w.png"}]},{"userName":"Salaman Hossain","email":"salman@gmail.com","time":1588219733771,"status":true,"img":"t7.png","active":false,"content":[{"content":"Jam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat consetetur sadipscing elitr sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat sed diam voluptua.","time":1585539620626,"seen":false,"reaction":false,"email":"salman@gmail.com","img":"t7.png"},{"content":"Jam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat consetetur sadipscing elitr sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat sed diam voluptua.","time":1585545728254,"seen":false,"reaction":false,"email":"woadud@gmail.com","img":"w.png"},{"content":"Jam nonumy eirmod tempor invidunt ut labore et dolore magna","time":1585545744554,"seen":false,"reaction":false,"email":"woadud@gmail.com","img":"w.png"},{"content":"Jam nonumy eirmod tempor invidunt ut labore et dolore magna.","time":1585545978832,"seen":false,"reaction":false,"email":"salman@gmail.com","img":"t7.png"},{"content":"Jam nonumy eirmod tempor invidunt ut labore et dolore magna","time":1585545744355,"seen":false,"reaction":false,"email":"woadud@gmail.com","img":"w.png"}]},{"userName":"Billal Hossain","email":"khalid@gmail.com","time":1588219733771,"status":true,"img":"t8.png","active":false,"content":[{"content":"Jam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat consetetur sadipscing elitr sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat sed diam voluptua.","time":1585539620626,"seen":false,"reaction":false,"email":"khalid@gmail.com","img":"t8.png"},{"content":"Jam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat consetetur sadipscing elitr sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat sed diam voluptua.","time":1585545728254,"seen":false,"reaction":false,"email":"woadud@gmail.com","img":"w.png"},{"content":"Jam nonumy eirmod tempor invidunt ut labore et dolore magna","time":1585545744554,"seen":false,"reaction":false,"email":"woadud@gmail.com","img":"w.png"},{"content":"Jam nonumy eirmod tempor invidunt ut labore et dolore magna.","time":1585545978832,"seen":false,"reaction":false,"email":"khalid@gmail.com","img":"t8.png"},{"content":"Jam nonumy eirmod tempor invidunt ut labore et dolore magna","time":1585545744255,"seen":false,"reaction":false,"email":"woadud@gmail.com","img":"w.png"}]},{"userName":"Akbar Hossain","email":"akbar@gmail.com","time":1588219733771,"status":true,"img":"t9.png","active":false,"content":[{"content":"Jam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat consetetur sadipscing elitr sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat sed diam voluptua.","time":1585539620626,"seen":false,"reaction":false,"email":"akbar@gmail.com","img":"t9.png"},{"content":"Jam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat consetetur sadipscing elitr sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat sed diam voluptua.","time":1585545728254,"seen":false,"reaction":false,"email":"woadud@gmail.com","img":"w.png"},{"content":"Jam nonumy eirmod tempor invidunt ut labore et dolore magna","time":1585545744554,"seen":false,"reaction":false,"email":"woadud@gmail.com","img":"w.png"},{"content":"Jam nonumy eirmod tempor invidunt ut labore et dolore magna.","time":1585545978832,"seen":false,"reaction":false,"email":"akbar@gmail.com","img":"t9.png"},{"content":"Jam nonumy eirmod tempor invidunt ut labore et dolore magna","time":1585545744425,"seen":false,"reaction":false,"email":"woadud@gmail.com","img":"w.png"}]},{"userName":"Kabil Hossain","email":"kabil@gmail.com","time":1588219733771,"status":true,"img":"t10.png","active":false,"content":[{"content":"Jam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat consetetur sadipscing elitr sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat sed diam voluptua.","time":1585539620626,"seen":false,"reaction":false,"email":"kabil@gmail.com","img":"t10.png"},{"content":"Jam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat consetetur sadipscing elitr sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat sed diam voluptua.","time":1585545728254,"seen":false,"reaction":false,"email":"woadud@gmail.com","img":"w.png"},{"content":"Jam nonumy eirmod tempor invidunt ut labore et dolore magna","time":1585545744554,"seen":false,"reaction":false,"email":"woadud@gmail.com","img":"w.png"},{"content":"Jam nonumy eirmod tempor invidunt ut labore et dolore magna.","time":1585545978832,"seen":false,"reaction":false,"email":"kabil@gmail.com","img":"t10.png"},{"content":"Jam nonumy eirmod tempor invidunt ut labore et dolore magna","time":1585545744535,"seen":false,"reaction":false,"email":"woadud@gmail.com","img":"w.png"}]},{"userName":"Jalal Hossain","email":"jalal@gmail.com","time":1588219733771,"status":true,"img":"t12.png","active":false,"content":[{"content":"Jam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat consetetur sadipscing elitr sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat sed diam voluptua.","time":1585539620626,"seen":false,"reaction":false,"email":"jalal@gmail.com","img":"t12.png"},{"content":"Jam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat consetetur sadipscing elitr sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat sed diam voluptua.","time":1585545728254,"seen":false,"reaction":false,"email":"woadud@gmail.com","img":"w.png"},{"content":"Jam nonumy eirmod tempor invidunt ut labore et dolore magna","time":1585545744554,"seen":false,"reaction":false,"email":"woadud@gmail.com","img":"w.png"},{"content":"Jam nonumy eirmod tempor invidunt ut labore et dolore magna.","time":1585545978832,"seen":false,"reaction":false,"email":"jalal@gmail.com","img":"t12.png"},{"content":"Jam nonumy eirmod tempor invidunt ut labore et dolore magna","time":1585545744513,"seen":false,"reaction":false,"email":"woadud@gmail.com","img":"w.png"}]}],"W":[{"groupName":"Marketing","id":"1","time":1588219733771,"status":true,"img":"g1.png","content":[{"content":"Jam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat consetetur sadipscing elitr sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat sed diam voluptua.","time":1585539620626,"seen":false,"reaction":false,"email":"rofiq@gmail.com","userName":"Md. Rofiq"},{"content":"Jam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat consetetur sadipscing elitr sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat sed diam voluptua.","time":1585545728254,"seen":false,"reaction":false,"email":"woadud@gmail.com","userName":"Woadud Akand"},{"content":"Jam nonumy eirmod tempor invidunt ut labore et dolore magna","time":1585545744556,"seen":false,"reaction":false,"email":"rosid@gmail.com","userName":"Roshid Khan"},{"content":"Jam nonumy eirmod tempor invidunt ut labore et dolore magna.","time":1585545978832,"seen":false,"reaction":false,"email":"rofiq@gmail.com","userName":"Md. Rofiq"},{"content":"Jam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat consetetur sadipscing elitr sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat sed diam voluptua.","time":1585545728254,"seen":false,"reaction":false,"email":"woadud@gmail.com","userName":"Woadud Akand"}]},{"groupName":"Web Development","id":"2","time":1588219733771,"status":true,"img":"g2.png","content":[{"content":"Jam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat consetetur sadipscing elitr sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat sed diam voluptua.","time":1585539620626,"seen":false,"reaction":false,"email":"rofiq@gmail.com","userName":"Md. Rofiq"},{"content":"Jam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat consetetur sadipscing elitr sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat sed diam voluptua.","time":1585545728254,"seen":false,"reaction":false,"email":"woadud@gmail.com","userName":"Woadud Akand"},{"content":"Jam nonumy eirmod tempor invidunt ut labore et dolore magna","time":1585545744558,"seen":false,"reaction":false,"email":"rosid@gmail.com","userName":"Roshid Khan"},{"content":"Jam nonumy eirmod tempor invidunt ut labore et dolore magna.","time":1585545978832,"seen":false,"reaction":false,"email":"rofiq@gmail.com","userName":"Md. Rofiq"},{"content":"Jam nonumy eirmod tempor invidunt ut labore et dolore magna","time":1585545744559,"seen":false,"reaction":false,"email":"woadud@gmail.com","userName":"Woadud Akand"}]},{"groupName":"UI/UX Group","id":"3","time":1588219733771,"status":true,"img":"g3.png","content":[{"content":"Jam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat consetetur sadipscing elitr sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat sed diam voluptua.","time":1585539620626,"seen":false,"reaction":false,"email":"rofiq@gmail.com","userName":"Md. Rofiq"},{"content":"Jam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat consetetur sadipscing elitr sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat sed diam voluptua.","time":1585545728254,"seen":false,"reaction":false,"email":"woadud@gmail.com","userName":"Woadud Akand"},{"content":"Jam nonumy eirmod tempor invidunt ut labore et dolore magna","time":1585545744560,"seen":false,"reaction":false,"email":"rosid@gmail.com","userName":"Roshid Khan"},{"content":"Jam nonumy eirmod tempor invidunt ut labore et dolore magna.","time":1585545978832,"seen":false,"reaction":false,"email":"rofiq@gmail.com","userName":"Md. Rofiq"},{"content":"Jam nonumy eirmod tempor invidunt ut labore et dolore magna","time":1585545744561,"seen":false,"reaction":false,"email":"woadud@gmail.com","userName":"Woadud Akand"}]},{"groupName":"Software","id":"4","time":1588219733771,"status":true,"img":"t1.jpg","content":[{"content":"Jam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat consetetur sadipscing elitr sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat sed diam voluptua.","time":1585539620626,"seen":false,"reaction":false,"email":"rofiq@gmail.com","userName":"Md. Rofiq"},{"content":"Jam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat consetetur sadipscing elitr sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat sed diam voluptua.","time":1585545728254,"seen":false,"reaction":false,"email":"woadud@gmail.com","userName":"Woadud Akand"},{"content":"Jam nonumy eirmod tempor invidunt ut labore et dolore magna","time":1585545744562,"seen":false,"reaction":false,"email":"rosid@gmail.com","userName":"Roshid Khan"},{"content":"Jam nonumy eirmod tempor invidunt ut labore et dolore magna.","time":1585545978832,"seen":false,"reaction":false,"email":"rofiq@gmail.com","userName":"Md. Rofiq"},{"content":"Jam nonumy eirmod tempor invidunt ut labore et dolore magna","time":1585545744563,"seen":false,"reaction":false,"email":"woadud@gmail.com","userName":"Woadud Akand"}]},{"groupName":"Khalid Hasan","id":"5","time":1588219733771,"status":true,"img":"t2.jpg","content":[{"content":"Jam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat consetetur sadipscing elitr sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat sed diam voluptua.","time":1585539620626,"seen":false,"reaction":false,"email":"rofiq@gmail.com","userName":"Md. Rofiq"},{"content":"Jam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat consetetur sadipscing elitr sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat sed diam voluptua.","time":1585545728254,"seen":false,"reaction":false,"email":"woadud@gmail.com","userName":"Woadud Akand"},{"content":"Jam nonumy eirmod tempor invidunt ut labore et dolore magna","time":1585545744564,"seen":false,"reaction":false,"email":"rosid@gmail.com","userName":"Roshid Khan"},{"content":"Jam nonumy eirmod tempor invidunt ut labore et dolore magna.","time":1585545978832,"seen":false,"reaction":false,"email":"rofiq@gmail.com","userName":"Md. Rofiq"},{"content":"Jam nonumy eirmod tempor invidunt ut labore et dolore magna","time":1585545744545,"seen":false,"reaction":false,"email":"woadud@gmail.com","userName":"Woadud Akand"}]},{"groupName":"Khalid Hasan","id":"6","time":1588219733771,"status":true,"img":"t3.jpg","content":[{"content":"Jam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat consetetur sadipscing elitr sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat sed diam voluptua.","time":1585539620626,"seen":false,"reaction":false,"email":"rofiq@gmail.com","userName":"Md. Rofiq"},{"content":"Jam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat consetetur sadipscing elitr sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat sed diam voluptua.","time":1585545728254,"seen":false,"reaction":false,"email":"woadud@gmail.com","userName":"Woadud Akand"},{"content":"Jam nonumy eirmod tempor invidunt ut labore et dolore magna","time":1585545744564,"seen":false,"reaction":false,"email":"rosid@gmail.com","userName":"Roshid Khan"},{"content":"Jam nonumy eirmod tempor invidunt ut labore et dolore magna.","time":1585545978832,"seen":false,"reaction":false,"email":"rofiq@gmail.com","userName":"Md. Rofiq"},{"content":"Jam nonumy eirmod tempor invidunt ut labore et dolore magna","time":1585545744545,"seen":false,"reaction":false,"email":"woadud@gmail.com","userName":"Woadud Akand"}]},{"groupName":"Khalid Hasan","id":"7","time":1588219733771,"status":true,"img":"t4.jpg","content":[{"content":"Jam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat consetetur sadipscing elitr sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat sed diam voluptua.","time":1585539620626,"seen":false,"reaction":false,"email":"rofiq@gmail.com","userName":"Md. Rofiq"},{"content":"Jam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat consetetur sadipscing elitr sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat sed diam voluptua.","time":1585545728254,"seen":false,"reaction":false,"email":"woadud@gmail.com","userName":"Woadud Akand"},{"content":"Jam nonumy eirmod tempor invidunt ut labore et dolore magna","time":1585545744564,"seen":false,"reaction":false,"email":"rosid@gmail.com","userName":"Roshid Khan"},{"content":"Jam nonumy eirmod tempor invidunt ut labore et dolore magna.","time":1585545978832,"seen":false,"reaction":false,"email":"rofiq@gmail.com","userName":"Md. Rofiq"},{"content":"Jam nonumy eirmod tempor invidunt ut labore et dolore magna","time":1585545744545,"seen":false,"reaction":false,"email":"woadud@gmail.com","userName":"Woadud Akand"}]},{"groupName":"Khalid Hasan","id":"8","time":1588219733771,"status":true,"img":"t5.png","content":[{"content":"Jam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat consetetur sadipscing elitr sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat sed diam voluptua.","time":1585539620626,"seen":false,"reaction":false,"email":"rofiq@gmail.com","userName":"Md. Rofiq"},{"content":"Jam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat consetetur sadipscing elitr sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat sed diam voluptua.","time":1585545728254,"seen":false,"reaction":false,"email":"woadud@gmail.com","userName":"Woadud Akand"},{"content":"Jam nonumy eirmod tempor invidunt ut labore et dolore magna","time":1585545744564,"seen":false,"reaction":false,"email":"rosid@gmail.com","userName":"Roshid Khan"},{"content":"Jam nonumy eirmod tempor invidunt ut labore et dolore magna.","time":1585545978832,"seen":false,"reaction":false,"email":"rofiq@gmail.com","userName":"Md. Rofiq"},{"content":"Jam nonumy eirmod tempor invidunt ut labore et dolore magna","time":1585545744545,"seen":false,"reaction":false,"email":"woadud@gmail.com","userName":"Woadud Akand"}]},{"groupName":"Khalid Hasan","id":"9","time":1588219733771,"status":true,"img":"t6.png","content":[{"content":"Jam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat consetetur sadipscing elitr sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat sed diam voluptua.","time":1585539620626,"seen":false,"reaction":false,"email":"rofiq@gmail.com","userName":"Md. Rofiq"},{"content":"Jam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat consetetur sadipscing elitr sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat sed diam voluptua.","time":1585545728254,"seen":false,"reaction":false,"email":"woadud@gmail.com","userName":"Woadud Akand"},{"content":"Jam nonumy eirmod tempor invidunt ut labore et dolore magna","time":1585545744564,"seen":false,"reaction":false,"email":"rosid@gmail.com","userName":"Roshid Khan"},{"content":"Jam nonumy eirmod tempor invidunt ut labore et dolore magna.","time":1585545978832,"seen":false,"reaction":false,"email":"rofiq@gmail.com","userName":"Md. Rofiq"},{"content":"Jam nonumy eirmod tempor invidunt ut labore et dolore magna","time":1585545744545,"seen":false,"reaction":false,"email":"woadud@gmail.com","userName":"Woadud Akand"}]},{"groupName":"Khalid Hasan","id":"10","time":1588219733771,"status":true,"img":"t7.png","content":[{"content":"Jam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat consetetur sadipscing elitr sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat sed diam voluptua.","time":1585539620626,"seen":false,"reaction":false,"email":"rofiq@gmail.com","userName":"Md. Rofiq"},{"content":"Jam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat consetetur sadipscing elitr sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat sed diam voluptua.","time":1585545728254,"seen":false,"reaction":false,"email":"woadud@gmail.com","userName":"Woadud Akand"},{"content":"Jam nonumy eirmod tempor invidunt ut labore et dolore magna","time":1585545744564,"seen":false,"reaction":false,"email":"rosid@gmail.com","userName":"Roshid Khan"},{"content":"Jam nonumy eirmod tempor invidunt ut labore et dolore magna.","time":1585545978832,"seen":false,"reaction":false,"email":"rofiq@gmail.com","userName":"Md. Rofiq"},{"content":"Jam nonumy eirmod tempor invidunt ut labore et dolore magna","time":1585545744545,"seen":false,"reaction":false,"email":"woadud@gmail.com","userName":"Woadud Akand"}]}]}]'),q={singleChatBegin(e){e.privetData.loading=!0},singleChatSuccess(e,t){e.privetData.loading=!1,e.privetData.data=t},singleChatErr(e,t){e.privetData.loading=!1,e.privetData.error=t},updatePrivetChatBegin(e){e.privetData.loading=!0},updatePrivetChatSuccess(e,t){e.privetData.loading=!1,e.privetData.data=t},updatePrivetChatErr(e,t){e.privetChat.loading=!1,e.privetChat.error=t},singleGroupChatBegin(e){e.groupData.loading=!0},singleGroupChatSuccess(e,t){e.groupData.loading=!1,e.groupData.data=t},singleGroupChatErr(e,t){e.groupData.loading=!1,e.groupData.error=t},updateGroupChatBegin(e){e.groupChat.loading=!0},updateGroupChatSuccess(e,t){e.groupChat.loading=!1,e.groupChat.data=t},updateGroupChatErr(e,t){e.groupChat.loading=!1,e.groupChat.error=t}};const G=()=>({privetData:{data:J[0].V,loading:!1,error:null},groupChat:{data:J[0].W,loading:!1,error:null},groupData:{data:J[0].W,loading:!1,error:null},privetChat:{data:J[0].V,loading:!1,error:null}}),X={async filterSinglePage({commit:e},t){try{e("singleChatBegin");const a=J[0].V.filter((e=>e.email===t));e("singleChatSuccess",a)}catch(a){e("singleChatErr",a)}},async updatePrivetChat({commit:e},{paramsId:t,pushItem:a}){try{e("updatePrivetChatBegin");const i=J[0].V.map((e=>{const i=e;return i.email===t&&(i.time=a.time,i.content=[...i.content,a]),i}));e("updatePrivetChatSuccess",i)}catch(i){e("updatePrivetChatErr",i)}},async filterSinglepageGroup({commit:e},t){try{e("singleGroupChatBegin");const a=J[0].W.filter((e=>e.id===t));e("singleGroupChatSuccess",a)}catch(a){e("singleGroupChatErr",a)}},async updateGroupChat({commit:e},{paramsId:t,pushItem:a}){try{e("updateGroupChatBegin");const i=J[0].W.map((e=>{const i=e;return i.id===t&&(i.time=a.time,i.content=[...i.content,a]),i}));e("updateGroupChatSuccess",i)}catch(i){e("updateGroupChatErr",i)}}};var Y={namespaced:!1,state:G,actions:X,mutations:q},H=JSON.parse('[{"id":1,"name":"Montes Scelerisque","rate":5,"time":1586372610052,"price":250,"oldPrice":650,"popular":105,"brand":"chair","category":"furniture","img":"static/img/products/1.png","description":"Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna."},{"id":2,"name":"Leo Sodales Varius","rate":4,"time":1586372643764,"price":320,"oldPrice":780,"popular":false,"brand":"chair","category":"furniture","img":"static/img/products/2.png","description":"Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna."},{"id":3,"name":"Hanging Lamp Berlingo","rate":4.5,"time":1586372866083,"price":150,"oldPrice":false,"brand":"chair","popular":102,"category":"furniture","img":"static/img/products/3.png","description":"Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna."},{"id":4,"name":"Commodo Adipiscing","rate":5,"time":1586372670340,"price":80,"oldPrice":120,"popular":false,"brand":"cup","category":"accessories","img":"static/img/products/4.png","description":"Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna."},{"id":5,"name":"Leo Sodales Varius","rate":4,"time":1586372885459,"price":220,"oldPrice":180,"popular":false,"brand":"chair","category":"furniture","img":"static/img/products/5.png","description":"Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna."},{"id":6,"name":"Leo Sodales Varius","rate":3,"time":1586372699556,"price":1010,"oldPrice":false,"popular":false,"brand":"plate","category":"accessories","img":"static/img/products/6.png","description":"Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna."},{"id":7,"name":"Hanging Lamp Berlingo","rate":5,"time":1586372908316,"price":920,"oldPrice":false,"popular":false,"brand":"chair","category":"furniture","img":"static/img/products/7.png","description":"Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna."},{"id":8,"name":"Commodo Adipiscing","rate":3,"time":1586372724883,"price":240,"oldPrice":650,"popular":false,"brand":"juice","category":"drinks","img":"static/img/products/8.png","description":"Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna."},{"id":9,"name":"Montes Scelerisque","rate":3,"time":1586372815027,"price":250,"oldPrice":false,"popular":false,"brand":"chair","category":"furniture","img":"static/img/products/9.png","description":"Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna."},{"id":10,"name":"Montes Scelerisque","rate":4,"time":1586372815027,"price":90,"oldPrice":110,"popular":false,"brand":"chair","category":"furniture","img":"static/img/products/10.png","description":"Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna."},{"id":11,"name":"Montes Scelerisque","rate":4.5,"time":1586372791516,"price":1280,"oldPrice":1590,"popular":false,"brand":"juice","category":"drinks","img":"static/img/products/11.png","description":"Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna."},{"id":12,"name":"Montes Scelerisque","rate":3.5,"time":1586372754820,"price":450,"oldPrice":false,"popular":false,"brand":"chair","category":"furniture","img":"static/img/products/12.png","description":"Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna."}]'),K={singleProductBegin(e){e.isLoading=!0},singleProductSuccess(e,t){e.isLoading=!1,e.product=t},singleProductErr(e,t){e.isLoading=!1,e.error=t},filterProductBegin(e){e.isProductLoading=!0},filterProductSuccess(e,t){e.isProductLoading=!1,e.products=t},filterProductErr(e,t){e.isProductLoading=!1,e.error=t},sortingProductBegin(e){e.isProductLoading=!0},sortingProductSuccess(e,t){e.isProductLoading=!1,e.products=t},sortingProductErr(e,t){e.isProductLoading=!1,e.error=t}};const Q=()=>({isProductLoading:!1,products:H,product:H,isLoading:!1,error:null}),ee={async filterSinglePage({commit:e},{paramsId:t,currentState:a}){try{e("singleProductBegin");const i=a.filter((e=>e.id===t));e("singleProductSuccess",i)}catch(i){e("singleProductErr",i)}},async sorting({commit:e},t){try{e("sortingProductBegin"),setTimeout((()=>{const a=H.sort(((e,a)=>a[t]-e[t]));e("sortingProductSuccess",a)}),100)}catch(a){e("sortingProductErr",a)}},async filterByPriceRange({commit:e},t){e("filterProductBegin");try{const a=H.filter((e=>e.price>=t[0]&&e.price<=t[1]));e("filterProductSuccess",a)}catch(a){e("filterProductErr",a)}},async filterByRating({commit:e},t){try{e("filterProductBegin"),setTimeout((()=>{const a=H.filter((e=>t[0].length?t[0].includes(e.rate):H));e("filterProductSuccess",a)}),100)}catch(a){e("filterProductErr",a)}},async filterByBrand({commit:e},t){try{e("filterProductBegin"),setTimeout((()=>{const a=H.filter((e=>t[0].length?t[0].includes(e.brand):H));e("filterProductSuccess",a)}),100)}catch(a){e("filterProductErr",a)}},async filterByCategory({commit:e},t){try{e("filterProductBegin"),setTimeout((()=>{const a=H.filter((e=>"all"!==t?e.category===t:H));e("filterProductSuccess",a)}),100)}catch(a){e("filterProductErr",a)}},async updateWishList({commit:e},t){try{e("filterProductBegin"),H.map((a=>a.id===t?a.popular?a.popular=!1:a.popular=!0:e("filterProductSuccess",H)))}catch(a){e("filterProductErr",a)}}};var te={namespaced:!1,state:Q,actions:ee,mutations:K},ae=JSON.parse('[{"orderId":"#02-0003","customers":"Kellie Marquot","status":"National","amount":"4,248","date":"January 20, 2021"},{"orderId":"#02-0004","customers":"Carroll Maharry","status":"County","amount":"14,248","date":"January 28, 2021"},{"orderId":"#02-0005","customers":"Rosenbaum Reichel","status":"National","amount":"24,248","date":"January 30, 2021"},{"orderId":"#02-0006","customers":"Ashley Briggs","status":"National","amount":"6,248","date":"February 2, 2021"},{"orderId":"#02-0007","customers":"Carl Jenkins","status":"Sub-County","amount":"35,545","date":"February 12, 2021"},{"orderId":"#02-0008","customers":"Bertha Martin","status":"National","amount":"4,248","date":"February 8, 2021"},{"orderId":"#02-0009","customers":"Stacie Hall","status":"County","amount":"34,248","date":"February 2, 2021"},{"orderId":"#02-0010","customers":"Kellie Marquot","status":"Sub-County","amount":"14,244","date":"January 20, 2021"},{"orderId":"#02-0010","customers":"Kellie Marquot","status":"Sub-County","amount":"14,244","date":"January 20, 2021"},{"orderId":"#02-0011","customers":"Amanda Jones","status":"National","amount":"4,248","date":"January 20, 2021"},{"orderId":"#02-0012","customers":"Ashley Briggs","status":"National","amount":"4,248","date":"January 20, 2021"}]'),ie={filterOrderBegin(e){e.loading=!0},filterOrderSuccess(e,t){e.loading=!1,e.data=t},filterOrderErr(e,t){e.loading=!1,e.error=t}};const oe=()=>({data:ae,loading:!1,error:null}),ne={async orderFilter({commit:e},{column:t,value:a}){try{e("filterOrderBegin");const i=ae.filter((e=>""!==a?e[t]===a:e));e("filterOrderSuccess",i)}catch(i){e("filterOrderErr",i)}}};var re={namespaced:!1,state:oe,actions:ne,mutations:ie},le=JSON.parse('[{"id":"1","name":"Montes Scelerisque","size":"Large","color":"Brown","price":"248.66","quantity":"1","img":"static/img/products/1.png","total":"248.66"},{"id":"2","name":"Leo Sodales Varius","size":"Small","color":"Golden","price":"240","quantity":"1","img":"static/img/products/2.png","total":"240"}]'),se={cartDataBegin(e){e.loading=!0},cartDataSuccess(e,t){e.loading=!1,e.data=t},cartDataErr(e,t){e.loading=!1,e.error=t},cartUpdateBegin(e){e.loading=!0},cartUpdateSuccess(e,t){e.loading=!1,e.data=t},cartUpdateErr(e,t){e.loading=!1,e.error=t},cartDeleteBegin(e){e.loading=!0},cartDeleteSuccess(e,t){e.loading=!1,e.data=t},cartDeleteErr(e,t){e.loading=!1,e.error=t}};const de=()=>({data:null,loading:!1,error:null}),ce={async cartGetData({commit:e}){try{e("cartDataBegin"),e("cartDataSuccess",le)}catch(t){e("cartDataErr",t)}},async cartUpdateQuantity({commit:e},{id:t,quantity:a,cartData:i}){try{e("cartUpdateBegin");const o=i.map((e=>(e.id===t&&(e.quantity=a),e)));e("cartUpdateSuccess",o)}catch(o){e("cartUpdateErr",o)}},async cartDelete({commit:e},{id:t,cartData:a}){try{e("cartDeleteBegin");const i=a.filter((e=>e.id!=t));e("cartDeleteSuccess",i)}catch(i){e("cartDeleteErr",i)}}};var me={namespaced:!1,state:de,actions:ce,mutations:se},pe=JSON.parse('[{"key":1,"name":"Meyri Carles","designation":"UI Designer","status":true,"img":"static/img/chat-author/t1.jpg"},{"key":2,"name":"Shreyu Neu","designation":"Product Designer","status":false,"img":"static/img/chat-author/t2.jpg"},{"key":3,"name":"Domnic Harris","designation":"Executive Assistant","status":false,"img":"static/img/chat-author/t3.jpg"},{"key":4,"name":"Khalid Hasan","designation":"UI Director","status":false,"img":"static/img/chat-author/t4.jpg"},{"key":5,"name":"Tuhin Molla","designation":"System Administrator","status":false,"img":"static/img/chat-author/t5.png"}]'),ge=JSON.parse('[{"postId":1,"from":"Meyri Carles","time":"1602131139130","img":["static/img/profile/post/postImage.png"],"author":"static/img/chat-author/t1.jpg","content":"Nam malesuada dolor tellus pretium amet was hendrerit facilisi  tempor quis enim sed ornare there suspendisse sed orci neque ac sed aliquet risus faucibus in pretium molestee.","like":4,"comment":[{"time":"1602131139130","from":"Alexendra Dhadio","text":"It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout."}]},{"postId":2,"from":"Alexendra Dhadio","time":"1602131061491","img":[],"author":"static/img/chat-author/t2.jpg","content":"Nam malesuada dolor tellus pretium amet was hendrerit facilisi  tempor quis enim sed ornare there suspendisse sed orci neque ac sed aliquet risus faucibus in pretium molestee.","like":4,"comment":[]},{"postId":3,"from":"Olivia Jon","time":"1602130144787","img":["static/img/profile/post/506.png","static/img/profile/post/907.png","static/img/profile/post/brightland_3744.png","static/img/profile/post/70.png","static/img/profile/post/165.png"],"author":"static/img/chat-author/t3.jpg","content":"","like":4,"comment":[]}]'),ue={profileFriendsBegin(e){e.isLoading=!0},profileFriendsSuccess(e,t){e.isLoading=!1,e.friends=t},profileFriendsErr(e,t){e.isLoading=!1,e.error=t},postDataBegin(e){e.postLoading=!0},postDataSuccess(e,t){e.postLoading=!1,e.posts=t},postDataErr(e,t){e.postLoading=!1,e.error=t}};const he=()=>({friends:pe,isLoading:!1,error:null,posts:ge,postLoading:!1}),xe={async profileFriendsChangeStatus({commit:e},t){try{e("profileFriendsBegin"),pe.map((a=>a.key===t?a.status=!a.status:e("profileFriendsSuccess",pe)))}catch(a){e("profileFriendsErr",a)}},async submitPost({commit:e},t){try{e("postDataBegin"),e("postDataSuccess",t)}catch(a){e("postDataErr",a)}},async likeUpdate({commit:e},{data:t,key:a}){try{e("postDataBegin"),t.map((i=>i.postId===a?i.like+=1:e("postDataSuccess",t)))}catch(i){e("postDataErr",i)}},async commentUpdate({commit:e},{data:t,key:a,comment:i}){try{e("postDataBegin"),t.map((o=>o.postId===a?o.comment=[...o.comment,{time:(new Date).getTime(),from:"David Warner",text:i}]:e("postDataSuccess",t)))}catch(o){e("postDataErr",o)}},async postDelete({commit:e},{data:t,key:a}){try{e("postDataBegin");const i=t.filter((e=>e.postId!==a));return e("postDataSuccess",i)}catch(i){e("postDataErr",i)}}};var fe={namespaced:!1,state:he,actions:xe,mutations:ue},be=JSON.parse('[{"id":1,"title":"Campaign Event","status":"early","content":"Adipisicing eu magna velit est exercitation et consequat Lorem laboris nulla. Laborum exercitation minim id ea ea. Minim cillum magna excepteur laboris duis labore pariatur Lorem aute cupidatat velit sunt non. Est laborum anim aliqua in elit consequat elit elit cupidatat. Nulla excepteur laborum voluptate nisi eiusmod nostrud sit. Aute aliquip sit non consectetur laborum velit in exercitation laboris officia adipisicing deserunt. Sint laboris aute minim aliqua aute culpa laboris ad amet dolor ea Lorem sit.","category":"Web Design","rate":5,"popular":1,"percentage":85},{"id":2,"title":"Campaigns View","status":"progress","content":"Adipisicing eu magna velit est exercitation et consequat Lorem laboris nulla. Laborum exercitation minim id ea ea. Minim cillum magna excepteur laboris duis labore pariatur Lorem aute cupidatat velit sunt non. Est laborum anim aliqua in elit consequat elit elit cupidatat. Nulla excepteur laborum voluptate nisi eiusmod nostrud sit. Aute aliquip sit non consectetur laborum velit in exercitation laboris officia adipisicing deserunt. Sint laboris aute minim aliqua aute culpa laboris ad amet dolor ea Lorem sit.","category":"Web Development","rate":3,"popular":2,"percentage":38},{"id":3,"title":"Application UI Design","status":"early","content":"Adipisicing eu magna velit est exercitation et consequat Lorem laboris nulla. Laborum exercitation minim id ea ea. Minim cillum magna excepteur laboris duis labore pariatur Lorem aute cupidatat velit sunt non. Est laborum anim aliqua in elit consequat elit elit cupidatat. Nulla excepteur laborum voluptate nisi eiusmod nostrud sit. Aute aliquip sit non consectetur laborum velit in exercitation laboris officia adipisicing deserunt. Sint laboris aute minim aliqua aute culpa laboris ad amet dolor ea Lorem sit.","category":"Graphic Design","rate":4,"popular":3,"percentage":46},{"id":4,"title":"Website Builder","status":"late","content":"Adipisicing eu magna velit est exercitation et consequat Lorem laboris nulla. Laborum exercitation minim id ea ea. Minim cillum magna excepteur laboris duis labore pariatur Lorem aute cupidatat velit sunt non. Est laborum anim aliqua in elit consequat elit elit cupidatat. Nulla excepteur laborum voluptate nisi eiusmod nostrud sit. Aute aliquip sit non consectetur laborum velit in exercitation laboris officia adipisicing deserunt. Sint laboris aute minim aliqua aute culpa laboris ad amet dolor ea Lorem sit.","category":"Web Development","rate":5,"popular":4,"percentage":29},{"id":5,"title":"Component Library","status":"progress","content":"Adipisicing eu magna velit est exercitation et consequat Lorem laboris nulla. Laborum exercitation minim id ea ea. Minim cillum magna excepteur laboris duis labore pariatur Lorem aute cupidatat velit sunt non. Est laborum anim aliqua in elit consequat elit elit cupidatat. Nulla excepteur laborum voluptate nisi eiusmod nostrud sit. Aute aliquip sit non consectetur laborum velit in exercitation laboris officia adipisicing deserunt. Sint laboris aute minim aliqua aute culpa laboris ad amet dolor ea Lorem sit.","category":"Web Development","rate":4,"popular":5,"percentage":96},{"id":6,"title":"Dashboard UI Project","status":"complete","content":"Adipisicing eu magna velit est exercitation et consequat Lorem laboris nulla. Laborum exercitation minim id ea ea. Minim cillum magna excepteur laboris duis labore pariatur Lorem aute cupidatat velit sunt non. Est laborum anim aliqua in elit consequat elit elit cupidatat. Nulla excepteur laborum voluptate nisi eiusmod nostrud sit. Aute aliquip sit non consectetur laborum velit in exercitation laboris officia adipisicing deserunt. Sint laboris aute minim aliqua aute culpa laboris ad amet dolor ea Lorem sit.","category":"Graphic Design","rate":3,"popular":6,"percentage":73},{"id":7,"title":"Custom Software","status":"progress","content":"Adipisicing eu magna velit est exercitation et consequat Lorem laboris nulla. Laborum exercitation minim id ea ea. Minim cillum magna excepteur laboris duis labore pariatur Lorem aute cupidatat velit sunt non. Est laborum anim aliqua in elit consequat elit elit cupidatat. Nulla excepteur laborum voluptate nisi eiusmod nostrud sit. Aute aliquip sit non consectetur laborum velit in exercitation laboris officia adipisicing deserunt. Sint laboris aute minim aliqua aute culpa laboris ad amet dolor ea Lorem sit.","category":"Web Development","rate":2,"popular":7,"percentage":42},{"id":8,"title":"Application UI Design","status":"early","content":"Adipisicing eu magna velit est exercitation et consequat Lorem laboris nulla. Laborum exercitation minim id ea ea. Minim cillum magna excepteur laboris duis labore pariatur Lorem aute cupidatat velit sunt non. Est laborum anim aliqua in elit consequat elit elit cupidatat. Nulla excepteur laborum voluptate nisi eiusmod nostrud sit. Aute aliquip sit non consectetur laborum velit in exercitation laboris officia adipisicing deserunt. Sint laboris aute minim aliqua aute culpa laboris ad amet dolor ea Lorem sit.","category":"Graphic Design","rate":4,"popular":8,"percentage":36},{"id":9,"title":"Website Builder","status":"late","content":"Adipisicing eu magna velit est exercitation et consequat Lorem laboris nulla. Laborum exercitation minim id ea ea. Minim cillum magna excepteur laboris duis labore pariatur Lorem aute cupidatat velit sunt non. Est laborum anim aliqua in elit consequat elit elit cupidatat. Nulla excepteur laborum voluptate nisi eiusmod nostrud sit. Aute aliquip sit non consectetur laborum velit in exercitation laboris officia adipisicing deserunt. Sint laboris aute minim aliqua aute culpa laboris ad amet dolor ea Lorem sit.","category":"Web Development","rate":3,"popular":9,"percentage":82},{"id":10,"title":"Component Library","status":"progress","content":"Adipisicing eu magna velit est exercitation et consequat Lorem laboris nulla. Laborum exercitation minim id ea ea. Minim cillum magna excepteur laboris duis labore pariatur Lorem aute cupidatat velit sunt non. Est laborum anim aliqua in elit consequat elit elit cupidatat. Nulla excepteur laborum voluptate nisi eiusmod nostrud sit. Aute aliquip sit non consectetur laborum velit in exercitation laboris officia adipisicing deserunt. Sint laboris aute minim aliqua aute culpa laboris ad amet dolor ea Lorem sit.","category":"Web Development","rate":2,"popular":10,"percentage":63},{"id":11,"title":"Dashboard UI Project","status":"complete","content":"Adipisicing eu magna velit est exercitation et consequat Lorem laboris nulla. Laborum exercitation minim id ea ea. Minim cillum magna excepteur laboris duis labore pariatur Lorem aute cupidatat velit sunt non. Est laborum anim aliqua in elit consequat elit elit cupidatat. Nulla excepteur laborum voluptate nisi eiusmod nostrud sit. Aute aliquip sit non consectetur laborum velit in exercitation laboris officia adipisicing deserunt. Sint laboris aute minim aliqua aute culpa laboris ad amet dolor ea Lorem sit.","category":"Graphic Design","rate":1,"popular":11,"percentage":53},{"id":12,"title":"Dashboard UI Project","status":"early","content":"Adipisicing eu magna velit est exercitation et consequat Lorem laboris nulla. Laborum exercitation minim id ea ea. Minim cillum magna excepteur laboris duis labore pariatur Lorem aute cupidatat velit sunt non. Est laborum anim aliqua in elit consequat elit elit cupidatat. Nulla excepteur laborum voluptate nisi eiusmod nostrud sit. Aute aliquip sit non consectetur laborum velit in exercitation laboris officia adipisicing deserunt. Sint laboris aute minim aliqua aute culpa laboris ad amet dolor ea Lorem sit.","category":"Web Design","rate":5,"popular":12,"percentage":33}]'),ye={eventCampaignBegin(e){e.loading=!0},eventCampaignSuccess(e,t){e.loading=!1,e.singleData=t},eventCampaignErr(e,t){e.loading=!1,e.error=t},filterProjectBegin(e){e.loading=!0},filterProjectSuccess(e,t){e.loading=!1,e.data=t},filterProjectErr(e,t){e.loading=!1,e.error=t},sortingProjectBegin(e){e.loading=!0},sortingProjectSuccess(e,t){e.loading=!1,e.data=t},sortingProjectErr(e,t){e.loading=!1,e.error=t}},we=a(9669),ve=a.n(we),ke=a(40008);const $e=()=>({data:be,singData:be,loading:!1,error:null}),Ae={async eventCampaignData({commit:e},t){try{e("eventCampaignBegin");const a=await ve().get(`http://localhost:8000/api/campaign/${t}/events`,{headers:(0,ke.Z)()});console.log(a);const i=a.data;e("eventCampaignSuccess",i)}catch(a){e("eventCampaignErr",a)}}};var Pe={namespaced:!1,state:$e,actions:Ae,mutations:ye},De={calendarReadBegin(e){e.loading=!0},calendarReadSuccess(e,t){e.loading=!1,e.events=t},calendarReadErr(e,t){e.loading=!1,e.error=t},eventVisibleBegin(e){e.loading=!0},eventVisibleSuccess(e,t){e.loading=!1,e.eventVisible=t},eventVisibleErr(e,t){e.loading=!1,e.error=t},starUpdateBegin(e){e.sLoading=!0},starUpdateSuccess(e,t){e.sLoading=!1,e.events=t},starUpdateErr(e,t){e.sLoading=!1,e.error=t},labelUpdateBegin(e){e.sLoading=!0},labelUpdateSuccess(e,t){e.sLoading=!1,e.events=t},labelUpdateErr(e,t){e.sLoading=!1,e.error=t}},Se=a(27484),Ee=a.n(Se);const Be=[{title:"Family Events",date:[Ee()().format("MM/DD/YYYY"),Ee()().format("MM/DD/YYYY")],id:1,label:"success",time:["2:00 pm","3:00 pm"],type:"event",description:"It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout"},{title:"Product Launch",date:[Ee()().format("MM/DD/YYYY"),Ee()(Ee()().add(2,"days")).format("MM/DD/YYYY")],id:2,label:"primary",time:["4:00 pm","5:00 pm"],type:"reminder",description:"It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout"},{title:"Team Meeting",id:3,date:[Ee()(Ee()().subtract(2,"days")).format("MM/DD/YYYY"),Ee()(Ee()().subtract(2,"days")).format("MM/DD/YYYY")],label:"secondary",time:["2:00 pm","3:00 pm"],type:"event",description:"It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout"},{title:"UI/UX Tasks",id:4,date:["09/12/2021","09/12/2021"],label:"info",time:["9:00 am","3:00 pm"],type:"event",description:"It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout"},{title:"Project Update",id:5,date:[Ee()(Ee()().add(5,"days")).format("MM/DD/YYYY"),Ee()(Ee()().add(5,"days")).format("MM/DD/YYYY")],label:"warning",time:["12:00 pm","2:30 pm"],type:"event",description:"It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout"}],Ce=[{title:"Family Events",date:[Ee()().format("MM/DD/YYYY"),Ee()().format("MM/DD/YYYY")],id:1,label:"success",time:["2:00 pm","3:00 pm"],type:"event",description:"It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout"},{title:"Product Launch",date:[Ee()().format("MM/DD/YYYY"),Ee()(Ee()().add(2,"days")).format("MM/DD/YYYY")],id:2,label:"primary",time:["4:00 pm","5:00 pm"],type:"reminder",description:"It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout"},{title:"Team Meeting",id:3,date:[Ee()(Ee()().subtract(2,"days")).format("MM/DD/YYYY"),Ee()(Ee()().subtract(2,"days")).format("MM/DD/YYYY")],label:"secondary",time:["2:00 pm","3:00 pm"],type:"event",description:"It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout"},{title:"UI/UX Tasks",id:4,date:["09/12/2021","09/12/2021"],label:"info",time:["9:00 am","3:00 pm"],type:"event",description:"It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout"},{title:"Project Update",id:5,date:[Ee()(Ee()().add(5,"days")).format("MM/DD/YYYY"),Ee()(Ee()().add(5,"days")).format("MM/DD/YYYY")],label:"warning",time:["12:00 pm","2:30 pm"],type:"event",description:"It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout"}],Le=()=>({events:Be,loading:!1,error:null,eventVisible:!1,sLoading:!1}),Ie={async calendarGetData({commit:e}){try{e("calendarReadBegin"),e("calendarReadSuccess",Ce)}catch(t){e("calendarReadErr",t)}},async addNewEvents({commit:e},t){try{e("calendarReadBegin"),e("calendarReadSuccess",t)}catch(a){e("calendarReadErr",a)}},async updateCurrentEvent({commit:e},{events:t,event:a,id:i}){try{e("calendarReadBegin"),t.map((e=>{const t=e;return t.id===i&&(t.title=a.title,t.description=a.description,t.date=a.date,t.time=a.time,t.label=a.label,t.type=a.type),t})),e("calendarReadSuccess",t)}catch(o){e("calendarReadErr",o)}},async eventVisible({commit:e},t){try{e("eventVisibleBegin"),e("eventVisibleSuccess",t)}catch(a){e("eventVisibleErr",a)}},async calendarAddData({commit:e},t){try{e("calendarReadBegin"),e("calendarReadSuccess",t)}catch(a){e("calendarReadErr",a)}},async calendarDeleteData({commit:e},t){try{e("calendarReadBegin"),e("calendarReadSuccess",t)}catch(a){e("calendarReadErr",a)}},async onStarUpdate({commit:e},{data:t,id:a}){try{e("starUpdateBegin"),t.map((i=>{if(i.key===a){const e=i;i.stared?e.stared=!1:e.stared=!0}return e("starUpdateSuccess",t)}))}catch(i){e("starUpdateErr",i)}},async onLabelUpdate({commit:e},{data:t,id:a,value:i}){try{e("labelUpdateBegin"),t.map((o=>{if(o.key===a){const e=o;e.label=i}return e("labelUpdateSuccess",t)}))}catch(o){e("labelUpdateErr",o)}},async onLabelFilter({commit:e},t){try{e("labelUpdateBegin");const a=Ce.filter((e=>"all"===t?Ce:"favorite"===t?e.stared:e.label===t));e("labelUpdateSuccess",a)}catch(a){e("labelUpdateErr",a)}}};var _e={namespaced:!1,state:Le,actions:Ie,mutations:De},Ue=JSON.parse('[{"id":1,"time":1587041636455,"name":"Duran Clayton","designation":"UI/UX Designer","img":"static/img/users/1.png"},{"id":2,"time":1587041711525,"name":"Duran Clayton","designation":"UI/UX Designer","img":"static/img/users/2.png"},{"id":3,"time":1587041758255,"name":"Duran Clayton","designation":"UI/UX Designer","img":"static/img/users/3.png"},{"id":4,"time":1587041856695,"name":"Duran Clayton","designation":"UI/UX Designer","img":"static/img/users/4.png"},{"id":5,"time":1587041880519,"name":"Duran Clayton","designation":"UI/UX Designer","img":"static/img/users/5.png"},{"id":6,"time":1587041932783,"name":"Duran Clayton","designation":"UI/UX Designer","img":"static/img/users/6.png"},{"id":7,"time":1587041957926,"name":"Duran Clayton","designation":"UI/UX Designer","img":"static/img/users/7.png"},{"id":8,"time":1587041979566,"name":"Duran Clayton","designation":"UI/UX Designer","img":"static/img/users/5.png"},{"id":9,"time":1587041979566,"name":"Duran Clayton","designation":"UI/UX Designer","img":"static/img/users/6.png"},{"id":10,"time":1587041979566,"name":"Duran Clayton","designation":"UI/UX Designer","img":"static/img/users/8.png"},{"id":11,"time":1587041979566,"name":"Duran Clayton","designation":"UI/UX Designer","img":"static/img/users/1.png"},{"id":12,"time":1587041979566,"name":"Duran Clayton","designation":"UI/UX Designer","img":"static/img/users/9.jpg"},{"id":13,"time":1587041979566,"name":"Duran Clayton","designation":"UI/UX Designer","img":"static/img/users/10.png"},{"id":14,"time":1587041979566,"name":"Duran Clayton","designation":"UI/UX Designer","img":"static/img/users/11.png"},{"id":15,"time":1587041979566,"name":"Duran Clayton","designation":"UI/UX Designer","img":"static/img/users/12.png"},{"id":16,"time":1587041979566,"name":"Duran Clayton","designation":"UI/UX Designer","img":"static/img/users/14.jpg"}]'),Ze={teamDataBegin(e){e.loading=!0},teamDataSuccess(e,t){e.loading=!1,e.data=t},teamDataErr(e,t){e.loading=!1,e.error=t}};const Fe=()=>({data:Ue,loading:!1,error:null}),je={async teamGetData({commit:e}){try{e("teamDataBegin"),e("teamDataSuccess",Ue)}catch(t){e("teamDataErr",t)}}};var ze={namespaced:!1,state:Fe,actions:je,mutations:Ze},Re=JSON.parse('[{"id":1,"time":1587041636455,"name":"Duran Clayton","designation":"UI/UX Designer","stared":false,"phone":"+90014525","company":"Business Development","email":"john@gmail.com","img":"static/img/users/1.png","joining":"11 Jun 2020"},{"id":2,"time":1587041711525,"name":"David Milar","designation":"UI/UX Designer","stared":true,"phone":"+90014525","company":"Business Development","email":"john@gmail.com","img":"static/img/users/2.png","joining":"31 May 2021"},{"id":3,"time":1587041758255,"name":"Tom Curan","designation":"UI/UX Designer","stared":true,"phone":"+90014525","company":"Business Development","email":"john@gmail.com","img":"static/img/users/1.png","joining":"01 Apr 2021"},{"id":4,"time":1587041856695,"name":"Stuard Broad","designation":"UI/UX Designer","stared":false,"phone":"+90014525","company":"Business Development","email":"john@gmail.com","img":"static/img/users/4.png","joining":"31 May 2021"},{"id":5,"time":1587041880519,"name":"Crish Moris","designation":"UI/UX Designer","stared":false,"phone":"+90014525","company":"Business Development","email":"john@gmail.com","img":"static/img/users/5.png","joining":"15 Feb 2021"},{"id":6,"time":1587041932783,"name":"Salman But","designation":"UI/UX Designer","stared":false,"phone":"+90014525","company":"Business Development","email":"john@gmail.com","img":"static/img/users/6.png","joining":"21 Dec 2017"},{"id":7,"time":1587041957926,"name":"Mohammad Amir","designation":"UI/UX Designer","stared":false,"phone":"+90014525","company":"Business Development","email":"john@gmail.com","img":"static/img/users/7.png","joining":"31 May 2021"},{"id":8,"time":1587041979566,"name":"Musfiqur Rohim","designation":"UI/UX Designer","stared":false,"phone":"+90014525","company":"Business Development","email":"john@gmail.com","img":"static/img/users/8.png","joining":"11 May 2018"}]'),Me={readBegin(e){e.loading=!0},readSuccess(e,t){e.loading=!1,e.data=t},readErr(e,t){e.loading=!1,e.error=t},starUpdateBegin(e){e.loading=!0},starUpdateSuccess(e,t){e.loading=!1,e.data=t},starUpdateErr(e,t){e.loading=!1,e.error=t}};const Te=()=>({data:Re,loading:!1,error:null}),Oe={async contactGetData({commit:e}){try{e("readBegin"),e("readSuccess",Re)}catch(t){e("readErr",t)}},async contactAddData({commit:e},t){try{e("readBegin"),e("readSuccess",t)}catch(a){e("readErr",a)}},async contactDeleteData({commit:e},t){try{e("readBegin"),e("readSuccess",t)}catch(a){e("readErr",a)}},async contactSearchData({commit:e},t){try{e("readBegin");const a=Re.filter((e=>e.name.toUpperCase().startsWith(t.toUpperCase())));e("readSuccess",a)}catch(a){e("readErr",a)}},async onStarUpdate({commit:e},{data:t,id:a}){try{e("starUpdateBegin"),t.map((i=>{if(i.id===a){const e=i;i.stared?e.stared=!1:e.stared=!0}return e("starUpdateSuccess",t)}))}catch(i){e("starUpdateErr",i)}}};var Ne={namespaced:!1,state:Te,actions:Oe,mutations:Me},We=JSON.parse('[{"key":1,"title":"Landing Page Design","time":1601453813448,"description":"Lorem Ipsum is simply dummy text of the printing","stared":false,"label":"personal"},{"key":2,"title":"Landing Page Development","time":1601453813450,"description":"Lorem Ipsum is simply dummy text of the printing","stared":true,"label":"work"},{"key":3,"title":"Shop Page Design","time":1601453813470,"description":"Lorem Ipsum is simply dummy text of the printing","stared":false,"label":"important"},{"key":4,"title":"Plugin Development","time":1601453813548,"description":"Lorem Ipsum is simply dummy text of the printing","stared":true,"label":"social"},{"key":5,"title":"Landing Page Development","time":1601453813550,"description":"Lorem Ipsum is simply dummy text of the printing","stared":true,"label":"work"},{"key":6,"title":"Shop App Design","time":1601453813470,"description":"Lorem Ipsum is simply dummy text of the printing","stared":false,"label":"important"}]'),Ve={noteReadBegin(e){e.loading=!0},noteReadSuccess(e,t){e.loading=!1,e.data=t},noteReadErr(e,t){e.loading=!1,e.error=t},starUpdateBegin(e){e.loading=!0},starUpdateSuccess(e,t){e.loading=!1,e.data=t},starUpdateErr(e,t){e.loading=!1,e.error=t},labelUpdateBegin(e){e.loading=!0},labelUpdateSuccess(e,t){e.loading=!1,e.data=t},labelUpdateErr(e,t){e.loading=!1,e.error=t}};const Je=()=>({data:We,loading:!1,error:null}),qe={async noteDragData({commit:e},t){try{e("labelUpdateBegin"),e("labelUpdateSuccess",t)}catch(a){e("labelUpdateErr",a)}},async noteGetData({commit:e}){try{e("noteReadBegin"),e("noteReadSuccess",We)}catch(t){e("noteReadErr",t)}},async noteAddData({commit:e},t){try{e("noteReadBegin"),e("noteReadSuccess",t)}catch(a){e("noteReadErr",a)}},async noteDraggable({commit:e},t){try{e("noteReadBegin"),e("noteReadSuccess",t)}catch(a){e("noteReadErr",a)}},async noteDeleteData({commit:e},t){try{e("noteReadBegin"),e("noteReadSuccess",t)}catch(a){e("noteReadErr",a)}},async onStarUpdate({commit:e},{data:t,id:a}){try{return e("starUpdateBegin"),t.map((e=>{if(e.key===a){const t=e;e.stared?t.stared=!0:t.stared=!1}})),e("starUpdateSuccess",t)}catch(i){e("starUpdateErr",i)}},async onLabelUpdate({commit:e},{data:t,id:a,value:i}){try{e("labelUpdateBegin"),t.map((o=>{if(o.key===a){const e=o;e.label=i}return e("labelUpdateSuccess",t)}))}catch(o){e("labelUpdateErr",o)}},async onLabelFilter({commit:e},t){try{e("labelUpdateBegin");const a=We.filter((e=>"all"===t?We:"favorite"===t?e.stared:e.label===t));e("labelUpdateSuccess",a)}catch(a){e("labelUpdateErr",a)}}};var Ge={namespaced:!1,state:Je,actions:qe,mutations:Ve},Xe=JSON.parse('[{"key":1,"item":"Add images to the product gallery","time":1599024943804,"favorite":true},{"key":2,"item":"Update user profile page","time":1599025094751,"favorite":true},{"key":3,"item":"Support tickets list doesn\'t support commas","time":1599025110373,"favorite":false},{"key":4,"item":"Changing title text on single locations pages","time":1599025120988,"favorite":false},{"key":5,"item":"Registration Confirmation! Email is missing some information","time":1599025134666,"favorite":true},{"key":6,"item":"Login page not redirecting wrong","time":1599025146100,"favorite":false},{"key":7,"item":"Custom Field for Registration","time":1599025156757,"favorite":false}]'),Ye={todoReadBegin(e){e.loading=!0},todoReadSuccess(e,t){e.loading=!1,e.data=t},todoReadErr(e,t){e.loading=!1,e.error=t},starUpdateBegin(e){e.loading=!0},starUpdateSuccess(e,t){e.loading=!1,e.data=t},starUpdateErr(e,t){e.loading=!1,e.error=t}};const He=()=>({data:Xe,loading:!1,error:null}),Ke={async ToDoGetData({commit:e}){try{e("todoReadBegin"),e("todoReadSuccess",Xe)}catch(t){e("todoReadErr",t)}},async ToDoAddData({commit:e},t){try{e("todoReadBegin"),e("todoReadSuccess",t)}catch(a){e("todoReadErr",a)}},async ToDoDeleteData({commit:e},t){try{e("todoReadBegin"),e("todoReadSuccess",t)}catch(a){e("todoReadErr",a)}},async onStarUpdate({commit:e},{data:t,id:a}){try{e("starUpdateBegin"),t.map((i=>{if(i.key===a){const e=i;i.favorite?e.favorite=!1:e.favorite=!0}return e("starUpdateSuccess",t)}))}catch(i){e("starUpdateErr",i)}}};var Qe={namespaced:!1,state:He,actions:Ke,mutations:Ye},et=JSON.parse('[{"id":1,"title":"Mombasa County","description":"Nets Distributed within Mombasa County","favourite":true,"completed":false},{"id":1,"title":"Kwale County","description":"Nets Distributed within Kwale County","favourite":true,"completed":false},{"id":1,"title":"Lamu County","description":"Nets Distributed within Lamu County","favourite":true,"completed":false},{"id":1,"title":"Kilifi County","description":"Nets Distributed within Kilifi County","favourite":true,"completed":false},{"id":1,"title":"Kajiado County","description":"Nets Distributed within Kajiado County","favourite":true,"completed":false},{"id":1,"title":"Nairobi County","description":"Nets Distributed within Nairobi County","favourite":true,"completed":false},{"id":1,"title":"Nakuru County","description":"Nets Distributed within Nakuru County","favourite":true,"completed":false},{"id":1,"title":"Uasin Gishu County","description":"Nets Distributed within Uasin Gishu County","favourite":true,"completed":false},{"id":1,"title":"Pokot County","description":"Nets Distributed within Pokot County","favourite":true,"completed":false}]'),tt={taskReadBegin(e){e.loading=!0},taskReadSuccess(e,t){e.loading=!1,e.data=t},taskReadErr(e,t){e.loading=!1,e.error=t},starUpdateBegin(e){e.loading=!0},starUpdateSuccess(e,t){e.loading=!1,e.data=t},starUpdateErr(e,t){e.loading=!1,e.error=t},completeUpdateBegin(e){e.loading=!0},completeUpdateSuccess(e,t){e.loading=!1,e.data=t},completeUpdateErr(e,t){e.loading=!1,e.error=t}};const at=()=>({data:et,loading:!1,error:null}),it={async taskAddData({commit:e},t){try{e("taskReadBegin"),e("taskReadSuccess",t)}catch(a){e("taskReadErr",a)}},async onStarUpdate({commit:e},{data:t,id:a}){try{e("starUpdateBegin"),t.map((i=>{if(i.id===a){const e=i;e.favourite?i.favourite=!1:e.favourite=!0}return e("starUpdateSuccess",t)}))}catch(i){e("starUpdateErr",i)}},async onCompleteUpdate({commit:e},{data:t,id:a}){try{e("completeUpdateBegin"),t.map((i=>{if(i.id===a){const e=i;e.completed?i.completed=!1:e.completed=!0}return e("completeUpdateSuccess",t)}))}catch(i){e("completeUpdateErr",i)}},async ontaskDelete({commit:e},t){try{e("taskReadBegin"),e("taskReadSuccess",t)}catch(a){e("taskReadErr",a)}},async ontaskEdit({commit:e},t){try{e("taskReadBegin"),e("taskReadSuccess",t)}catch(a){e("taskReadErr",a)}}};var ot={namespaced:!1,state:at,actions:it,mutations:tt},nt=(a(11611),a(70473)),rt=(a(57658),{fireStoreAddBeginBegin(e){e.loading=!0},fireStoreAddBeginSuccess(e,t){e.loading=!1,e.data=t},fireStoreAddBeginErr(e,t){e.loading=!1,e.error=t},fireStoreReadBegin(e){e.loading=!0},fireStoreReadSuccess(e,t){e.loading=!1,e.data=t},fireStoreReadErr(e,t){e.loading=!1,e.error=t},fireStoreUpdateBegin(e){e.loading=!0},fireStoreUpdateSuccess(e,t){e.loading=!1,e.data=t},fireStoreUpdateErr(e,t){e.loading=!1,e.error=t},fireStoreDeleteBegin(e){e.loading=!0},fireStoreDeleteSuccess(e,t){e.loading=!1,e.data=t},fireStoreDeleteErr(e,t){e.loading=!1,e.error=t},fireStoreSingleDataBegin(e){e.loading=!0},fireStoreSingleDataSuccess(e,t){e.loading=!1,e.data=t},fireStoreSingleDataErr(e,t){e.loading=!1,e.error=t},fireStoreUploadBegin(e){e.fileLoading=!0},fireStoreUploadSuccess(e,t){e.fileLoading=!1,e.url=t,e.error=!1},fireStoreUploadErr(e,t){e.fileLoading=!1,e.error=t},fireStoreSearchBegin(e){e.loading=!0},fireStoreSearchSuccess(e,t){e.loading=!1,e.data=t},fireStoreSearchErr(e,t){e.loading=!1,e.error=t}}),lt=a(15503);a(16690),a(96257),a(14642),a(2929);const st={apiKey:"AIzaSyCTq5eJkSFhSlJZZijxdmGwQ8dv8C1Eilk",authDomain:{NODE_ENV:"production",VUE_APP_TINYMCE_API_KEY:"7o2468tzzaks78b3x5oeguzaqb2z8lvmrilea7aktlo0de7k",VUE_APP_PIXABAY_API_KEY:"10318573-0d69a875d",VUE_APP_FIREBASE_API_KEY:"AIzaSyCTq5eJkSFhSlJZZijxdmGwQ8dv8C1Eilk",VUE_APP_FIREBASE_MESSAGING_SENDER_ID:"230278565850",VUE_APP_FIREBASE_APP_ID:"1:230278565850:web:bde8cb518a3c9a37f83ae3",VUE_APP_FIREBASE_MEASUREMENT_ID:"G-43XQJBNN1T",VUE_APP_API_ENDPOINT:"https://demo.jsnorm.com/laravel/strikingdash-api/api/vuestore/",VUE_APP_BASE_URL:"http://41.89.92.206/massnet/api",VUE_APP_AUTH0_DOMAIN:"dev-cc7jh4vf.us.auth0.com",VUE_APP_AUTH0_CLIENT_ID:"RQE7Ri7VAgoUYhDY1zbeePKAvVwfsUDK",VUE_APP_GOOGLE_MAP_API:"AIzaSyCWLSu-IIz-TNFJ7oGbgbP7FXiW14SWk08",BASE_URL:"/"}.VUE_APP_FIREBASE_AUTH_DOMAIN,databaseURL:{NODE_ENV:"production",VUE_APP_TINYMCE_API_KEY:"7o2468tzzaks78b3x5oeguzaqb2z8lvmrilea7aktlo0de7k",VUE_APP_PIXABAY_API_KEY:"10318573-0d69a875d",VUE_APP_FIREBASE_API_KEY:"AIzaSyCTq5eJkSFhSlJZZijxdmGwQ8dv8C1Eilk",VUE_APP_FIREBASE_MESSAGING_SENDER_ID:"230278565850",VUE_APP_FIREBASE_APP_ID:"1:230278565850:web:bde8cb518a3c9a37f83ae3",VUE_APP_FIREBASE_MEASUREMENT_ID:"G-43XQJBNN1T",VUE_APP_API_ENDPOINT:"https://demo.jsnorm.com/laravel/strikingdash-api/api/vuestore/",VUE_APP_BASE_URL:"http://41.89.92.206/massnet/api",VUE_APP_AUTH0_DOMAIN:"dev-cc7jh4vf.us.auth0.com",VUE_APP_AUTH0_CLIENT_ID:"RQE7Ri7VAgoUYhDY1zbeePKAvVwfsUDK",VUE_APP_GOOGLE_MAP_API:"AIzaSyCWLSu-IIz-TNFJ7oGbgbP7FXiW14SWk08",BASE_URL:"/"}.VUE_APP_FIREBASE_DATABASE_URL,projectId:{NODE_ENV:"production",VUE_APP_TINYMCE_API_KEY:"7o2468tzzaks78b3x5oeguzaqb2z8lvmrilea7aktlo0de7k",VUE_APP_PIXABAY_API_KEY:"10318573-0d69a875d",VUE_APP_FIREBASE_API_KEY:"AIzaSyCTq5eJkSFhSlJZZijxdmGwQ8dv8C1Eilk",VUE_APP_FIREBASE_MESSAGING_SENDER_ID:"230278565850",VUE_APP_FIREBASE_APP_ID:"1:230278565850:web:bde8cb518a3c9a37f83ae3",VUE_APP_FIREBASE_MEASUREMENT_ID:"G-43XQJBNN1T",VUE_APP_API_ENDPOINT:"https://demo.jsnorm.com/laravel/strikingdash-api/api/vuestore/",VUE_APP_BASE_URL:"http://41.89.92.206/massnet/api",VUE_APP_AUTH0_DOMAIN:"dev-cc7jh4vf.us.auth0.com",VUE_APP_AUTH0_CLIENT_ID:"RQE7Ri7VAgoUYhDY1zbeePKAvVwfsUDK",VUE_APP_GOOGLE_MAP_API:"AIzaSyCWLSu-IIz-TNFJ7oGbgbP7FXiW14SWk08",BASE_URL:"/"}.VUE_APP_FIREBASE_PROJECT_ID,storageBucket:{NODE_ENV:"production",VUE_APP_TINYMCE_API_KEY:"7o2468tzzaks78b3x5oeguzaqb2z8lvmrilea7aktlo0de7k",VUE_APP_PIXABAY_API_KEY:"10318573-0d69a875d",VUE_APP_FIREBASE_API_KEY:"AIzaSyCTq5eJkSFhSlJZZijxdmGwQ8dv8C1Eilk",VUE_APP_FIREBASE_MESSAGING_SENDER_ID:"230278565850",VUE_APP_FIREBASE_APP_ID:"1:230278565850:web:bde8cb518a3c9a37f83ae3",VUE_APP_FIREBASE_MEASUREMENT_ID:"G-43XQJBNN1T",VUE_APP_API_ENDPOINT:"https://demo.jsnorm.com/laravel/strikingdash-api/api/vuestore/",VUE_APP_BASE_URL:"http://41.89.92.206/massnet/api",VUE_APP_AUTH0_DOMAIN:"dev-cc7jh4vf.us.auth0.com",VUE_APP_AUTH0_CLIENT_ID:"RQE7Ri7VAgoUYhDY1zbeePKAvVwfsUDK",VUE_APP_GOOGLE_MAP_API:"AIzaSyCWLSu-IIz-TNFJ7oGbgbP7FXiW14SWk08",BASE_URL:"/"}.VUE_APP_FIREBASE_STORAGE_BUCKET,messagingSenderId:"230278565850",appId:"1:230278565850:web:bde8cb518a3c9a37f83ae3",measurementId:"G-43XQJBNN1T"};lt.Z.initializeApp(st);const dt=lt.Z.firestore();lt.Z.auth();var ct=a(49173);a(33404);const mt=()=>{nt.Z.success({message:"Your Record hasbeen Submited"})},pt=e=>{nt.Z.error({message:e})},gt=()=>{nt.Z.success({message:"Your Record hasbeen Deleted"})},ut=e=>{nt.Z.error({message:e})},ht=()=>{nt.Z.success({message:"Your Record hasbeen updated"})},xt=e=>{nt.Z.error({message:e})},ft=()=>({data:[],url:null,fileLoading:!1,loading:!1,error:null}),bt={async fireStoreCrudSubmitData({commit:e},t){try{await e("fireStoreAddBeginBegin"),await dt.collection("crud").doc(`${t.id}`).set(t),await e("fireStoreAddBeginSuccess",t),mt()}catch(a){await e("fireStoreAddBeginErr",a),console.log(a),pt(a)}},async fireStoreCrudGetData({commit:e}){const t=[];try{await e("fireStoreReadBegin");const a=await dt.collection("crud").get();await a.forEach((e=>{t.push(e.data())})),await e("fireStoreReadSuccess",t)}catch(a){console.log(a),await e("fireStoreReadErr",a)}},async fireStoreFileClear({commit:e}){try{await e("fireStoreUploadBegin"),e("fireStoreUploadSuccess",null)}catch(t){await e("fireStoreUploadErr",t)}},async fireStoreFileUploader({commit:e},t){console.log(t);try{await e("fireStoreUploadBegin");const a=ct.Z.storage().ref(`/images/${t.name}`).put(t);await a.on("state_changed",(e=>{console.log(e)}),(e=>{console.log(e)}),(()=>{ct.Z.storage().ref("images").child(t.name).getDownloadURL().then((t=>{e("fireStoreUploadSuccess",t)}))}))}catch(a){console.log(a),await e("fireStoreUploadErr",a)}},async fireStoreSingleDataGet({commit:e},t){try{await e("fireStoreSingleDataBegin");const a=await dt.collection("crud").where("id","==",parseInt(t)).get();await a.forEach((t=>{e("fireStoreSingleDataSuccess",t.data()),e("fireStoreUploadSuccess",t.data().image)}))}catch(a){await e("fireStoreSingleDataErr",a)}},async fireStoreDataDelete({commit:e},t){const a=[];try{await e("fireStoreDeleteBegin"),await dt.collection("crud").doc(`${t}`).delete();const i=await dt.collection("crud").get();await i.forEach((e=>{a.push(e.data())})),await e("fireStoreDeleteSuccess",a),gt()}catch(i){await e("fireStoreDeleteErr",i),console.log(i),ut(i)}},async fireStoreDataUpdate({commit:e},{id:t,data:a}){try{await e("fireStoreUpdateBegin"),await dt.collection("crud").doc(`${t}`).update({...a});const i=await dt.collection("crud").where("id","==",parseInt(t)).get();await i.forEach((t=>{e("fireStoreUpdateSuccess",t.data())})),ht()}catch(i){console.log(i),await e("fireStoreUpdateErr",i),xt(i)}},async fireStoreDataSearch({commit:e},t){const a=[];try{await e("fireStoreSearchBegin");const i=await dt.collection("crud").orderBy("name").startAt(t).endAt(t+"").get();await i.forEach((e=>{a.push(e.data())})),await e("fireStoreSearchSuccess",a)}catch(i){console.log(i),await e("fireStoreSearchErr",i)}}};var yt={namespaced:!1,state:ft,actions:bt,mutations:rt},wt={firebaseLoginBegin(e){e.loading=!0},firebaseLoginSuccess(e,t){e.loading=!1,e.isLogin=!0,e.uid=t},firebaseLoginErr(e,t){e.loading=!1,e.error=t},firebaseLogOutBegin(e){e.loading=!0},firebaseLogOutSuccess(e){e.loading=!1,e.isLogout=!0,e.isLogin=!1},firebaseLogOutErr(e,t){e.loading=!1,e.error=t},firebaseSignUpBegin(e){e.loading=!0},firebaseSignUpSuccess(e,t){e.loading=!1,e.isLogin=!0,e.uid=t},firebaseSignUpErr(e,t){e.loading=!1,e.error=t}};const vt=e=>{nt.Z.error({message:e})},kt=()=>({data:null,loading:!1,isLogout:!1,isLogin:!1,error:!1,isSignUpError:!1,isSignUpLoading:!1,uid:!1}),$t={async firebaseAuthLogin({commit:e},{data:t}){try{await e("firebaseLoginBegin"),await ct.Z.auth().signInWithEmailAndPassword(t.username,t.password),ct.Z.auth().onAuthStateChanged((t=>{t=t||{},e("firebaseLoginSuccess",!!t.uid&&t.uid)}))}catch(a){vt(a.message),await e("firebaseLoginErr",a)}},async firebaseAuthLoginWithGoogle({commit:e}){const t=new ct.Z.auth.GoogleAuthProvider;try{await e("firebaseLoginBegin");const a=await ct.Z.auth().signInWithPopup(t);console.log(a),await e("firebaseLoginSuccess",a)}catch(a){await e("firebaseLoginErr",a)}},async firebaseAuthLoginWithFacebook({commit:e}){const t=new ct.Z.auth.FacebookAuthProvider;try{await e("firebaseLoginBegin");const a=await ct.Z.auth().signInWithPopup(t);await e("firebaseLoginSuccess",a)}catch(a){await e("firebaseLoginErr",a)}},async firebaseAuthGetUid({commit:e}){try{await e("firebaseLoginBegin"),ct.Z.auth().onAuthStateChanged((async t=>{t=t||{},await e("firebaseLoginSuccess",!!t.uid&&t.uid)}))}catch(t){await e("firebaseLoginErr",t)}},async firebaseAuthLogout({commit:e},t){try{await e("firebaseLogOutBegin"),await ct.Z.auth().signOut(),await e("firebaseLogOutSuccess",!1),await t()}catch(a){await e("firebaseLogOutErr",a)}},async firebaseAuthSignUp({commit:e},t){try{await e("firebaseSignUpBegin");const a=await ct.Z.auth().createUserWithEmailAndPassword(t.email,t.password);await dt.collection("users").doc(a.user.uid).set({...t}),await e("firebaseSignUpSuccess",a.user.uid)}catch(a){vt(a.message),await e("firebaseSignUpErr",a)}}};var At={namespaced:!1,state:kt,actions:$t,mutations:wt},Pt={axiosAddBeginBegin(e){e.loading=!0},axiosAddBeginSuccess(e,t){e.loading=!1,e.data=t},axiosAddBeginErr(e,t){e.loading=!1,e.error=t},axiosReadBegin(e){e.loading=!0},axiosReadSuccess(e,t){e.loading=!1,e.data=t},axiosReadErr(e,t){e.loading=!1,e.error=t},axiosUpdateBegin(e){e.loading=!0},axiosUpdateSuccess(e){e.loading=!1},axiosUpdateErr(e,t){e.loading=!1,e.error=t},axiosDeleteBegin(e){e.loading=!0},axiosDeleteSuccess(e){e.loading=!1},axiosDeleteErr(e,t){e.loading=!1,e.error=t},axiosSingleDataBegin(e){e.loading=!0},axiosSingleDataSuccess(e,t){e.loading=!1,e.data=t},axiosSingleDataErr(e,t){e.loading=!1,e.error=t},axiosUploadBegin(e){e.fileLoading=!0},axiosUploadSuccess(e,t){e.fileLoading=!1,e.url=t,e.error=!1},axiosUploadErr(e,t){e.fileLoading=!1,e.error=t},axiosSearchBegin(e){e.loading=!0},axiosSearchSuccess(e,t){e.loading=!1,e.data=t},axiosSearchErr(e,t){e.loading=!1,e.error=t}};const Dt=e=>{const t="undefined"!==typeof window?localStorage.getItem(e):"";try{return JSON.parse(t)}catch(a){return t}},St="https://demo.jsnorm.com/laravel/strikingdash-api/api/vuestore/",Et=()=>({Authorization:`Bearer ${Dt("access_token")}`}),Bt=ve().create({baseURL:St,headers:{Authorization:`Bearer ${Dt("access_token")}`,"Content-Type":"application/json"}});class Ct{static get(e=""){return Bt({method:"GET",url:e,headers:{...Et()}})}static post(e="",t={},a={}){return Bt({method:"POST",url:e,data:t,headers:{...Et(),...a}})}static patch(e="",t={}){return Bt({method:"PATCH",url:e,data:JSON.stringify(t),headers:{...Et()}})}static delete(e="",t={}){return Bt({method:"DELETE",url:e,data:JSON.stringify(t),headers:{...Et()}})}static put(e="",t={}){return Bt({method:"PUT",url:e,data:JSON.stringify(t),headers:{...Et()}})}}Bt.interceptors.request.use((e=>{const t=e,{headers:a}=e;return t.headers={...a,Authorization:`Bearer ${Dt("access_token")}`},t})),Bt.interceptors.response.use((e=>e),(e=>{const{response:t}=e,a=e.config;return t&&500!==t.status?a:Promise.reject(e)}));const Lt=()=>{nt.Z.success({message:"Your Record hasbeen Submited"})},It=e=>{nt.Z.error({message:e})},_t=()=>{nt.Z.success({message:"Your Record hasbeen Deleted"})},Ut=e=>{nt.Z.error({message:e})},Zt=()=>{nt.Z.success({message:"Your Record hasbeen updated"})},Ft=e=>{nt.Z.error({message:e})},jt=()=>({data:[],url:null,fileLoading:!1,loading:!1,error:null}),zt={async axiosCrudSubmitData({commit:e},t){try{await e("axiosAddBeginBegin");const a=await Ct.post("/create",t);await e("axiosAddBeginSuccess",a.data.data),Lt()}catch(a){await e("axiosAddBeginErr",a),console.log(a),It(a.message)}},async axiosCrudGetData({commit:e}){try{await e("axiosReadBegin");const t=await Ct.get("/view-all");await e("axiosReadSuccess",t.data.data)}catch(t){console.log(t),await e("axiosReadErr",t)}},async axiosDataSearch({commit:e},t){try{if(await e("axiosReadBegin"),""!=t){const a=await Ct.get(`/search/${t}`);await e("axiosReadSuccess",a.data.data)}else try{const t=await Ct.get("/view-all");await e("axiosReadSuccess",t.data.data)}catch(a){console.log(a),await e("axiosReadErr",a)}}catch(a){console.log(a),await e("axiosReadErr",a)}},async axiosFileClear({commit:e}){try{await e("axiosUploadBegin"),e("axiosUploadSuccess",null)}catch(t){await e("axiosUploadErr",t)}},async axiosFileUploader({commit:e},t){let a=new FormData;a.set("image",t);try{await e("axiosUploadBegin");const t=await Ct.post("/image-upload",a,{"Content-Type":"multipart/form-data"});console.log(t.data),e("axiosUploadSuccess",`img/basics/${t.data}`)}catch(i){await e("axiosUploadErr",i)}},async axiosSingleDataGet({commit:e},t){try{await e("axiosSingleDataBegin");const a=await Ct.get(`/view/${t}`);e("axiosSingleDataSuccess",a.data.data),e("axiosUploadSuccess",a.data.data.image)}catch(a){await e("axiosSingleDataErr",a)}},async axiosDataDelete({commit:e},{id:t,getData:a}){try{await e("axiosDeleteBegin"),await Ct.get(`/delete/${t}`),await e("axiosDeleteSuccess"),await a(),_t()}catch(i){await e("axiosDeleteErr",i),console.log(i),Ut(i)}},async axiosDataUpdate({commit:e},{id:t,data:a}){try{await e("axiosUpdateBegin"),await Ct.post(`/update/${t}`,a),e("axiosUpdateSuccess"),Zt()}catch(i){await e("axiosUpdateErr",i),Ft(i)}}};var Rt={namespaced:!1,state:jt,actions:zt,mutations:Pt},Mt={loginBegin(e){e.login=!0},loginSuccess(e,t){e.loading=!1,e.login=t},loginErr(e,t){e.loading=!1,e.error=t},logoutBegin(e){e.loading=!0},logoutSuccess(e,t){e.loading=!1,e.login=t},logoutErr(e,t){e.loading=!1,e.error=t}},Tt=a(31955);const Ot=()=>({login:Tt.Z.get("logedIn"),loading:!1,error:null}),Nt={async login({commit:e}){try{return e("loginBegin"),Tt.Z.set("logedIn",!0),e("loginSuccess",!0)}catch(t){e("loginErr",t)}},async logOut({commit:e}){try{e("logoutBegin"),Tt.Z.remove("logedIn"),e("logoutSuccess",null)}catch(t){e("logoutErr",t)}}};var Wt={namespaced:!1,state:Ot,actions:Nt,mutations:Mt},Vt=JSON.parse('[{"boardId":"1","title":"To do"},{"boardId":"2","title":"In Progress"},{"boardId":"3","title":"Review"},{"boardId":"4","title":"Done"}]'),Jt=JSON.parse('[{"id":"1","boardId":"1","title":"File Manager Design","checklist":[{"id":"cl-1","label":"Research","checkListTask":[{"id":"1","label":"Design Idea","checked":true},{"id":"2","label":"Wireframe for design","checked":false},{"id":"3","label":"Make prototypes","checked":true},{"id":"4","label":"Add images to the product gallery","checked":true}]},{"id":"cl-2","label":"Design","checkListTask":[{"id":"1","label":"Design Idea","checked":true},{"id":"2","label":"Wireframe for design","checked":true},{"id":"3","label":"Make prototypes","checked":true},{"id":"4","label":"Add images to the product gallery","checked":true}]}]},{"id":"2","boardId":"1","title":"CRM Dashboard","checklist":[{"id":"1","label":"Research","checkListTask":[{"id":"1","label":"Design Idea","checked":true},{"id":"2","label":"Wireframe for design","checked":true},{"id":"3","label":"Make prototypes","checked":true},{"id":"4","label":"Add images to the product gallery","checked":true}]},{"id":"2","label":"Design","checkListTask":[{"id":"1","label":"Design Idea","checked":true},{"id":"2","label":"Wireframe for design","checked":true},{"id":"3","label":"Make prototypes","checked":true},{"id":"4","label":"Add images to the product gallery","checked":true}]}]},{"id":"3","boardId":"1","title":"Knowledgebase","checklist":[{"id":"1","label":"Research","checkListTask":[{"id":"1","label":"Design Idea","checked":true},{"id":"2","label":"Wireframe for design","checked":true},{"id":"3","label":"Make prototypes","checked":true},{"id":"4","label":"Add images to the product gallery","checked":true}]},{"id":"2","label":"Design","checkListTask":[{"id":"1","label":"Design Idea","checked":true},{"id":"2","label":"Wireframe for design","checked":true},{"id":"3","label":"Make prototypes","checked":true},{"id":"4","label":"Add images to the product gallery","checked":true}]}]},{"id":"4","boardId":"1","title":"CRM Dashboard ","checklist":[{"id":"1","label":"Research","checkListTask":[{"id":"1","label":"Design Idea","checked":true},{"id":"2","label":"Wireframe for design","checked":true},{"id":"3","label":"Make prototypes","checked":true},{"id":"4","label":"Add images to the product gallery","checked":true}]},{"id":"2","label":"Design","checkListTask":[{"id":"1","label":"Design Idea","checked":true},{"id":"2","label":"Wireframe for design","checked":true},{"id":"3","label":"Make prototypes","checked":true},{"id":"4","label":"Add images to the product gallery","checked":true}]}]},{"id":"5","boardId":"2","title":"Drag & Drop","checklist":[{"id":"1","label":"Research","checkListTask":[{"id":"1","label":"Design Idea","checked":true},{"id":"2","label":"Wireframe for design","checked":true},{"id":"3","label":"Make prototypes","checked":true},{"id":"4","label":"Add images to the product gallery","checked":true}]},{"id":"2","label":"Design","checkListTask":[{"id":"1","label":"Design Idea","checked":true},{"id":"2","label":"Wireframe for design","checked":true},{"id":"3","label":"Make prototypes","checked":true},{"id":"4","label":"Add images to the product gallery","checked":true}]}]},{"id":"6","boardId":"2","title":"Sales Dashboard ","checklist":[{"id":"1","label":"Research","checkListTask":[{"id":"1","label":"Design Idea","checked":true},{"id":"2","label":"Wireframe for design","checked":true},{"id":"3","label":"Make prototypes","checked":true},{"id":"4","label":"Add images to the product gallery","checked":true}]},{"id":"2","label":"Design","checkListTask":[{"id":"1","label":"Design Idea","checked":true},{"id":"2","label":"Wireframe for design","checked":true},{"id":"3","label":"Make prototypes","checked":true},{"id":"4","label":"Add images to the product gallery","checked":true}]}]},{"id":"7","boardId":"3","title":"Timeline Page","checklist":[{"id":"1","label":"Research","checkListTask":[{"id":"1","label":"Design Idea","checked":true},{"id":"2","label":"Wireframe for design","checked":true},{"id":"3","label":"Make prototypes","checked":true},{"id":"4","label":"Add images to the product gallery","checked":true}]},{"id":"2","label":"Design","checkListTask":[{"id":"1","label":"Design Idea","checked":true},{"id":"2","label":"Wireframe for design","checked":true},{"id":"3","label":"Make prototypes","checked":true},{"id":"4","label":"Add images to the product gallery","checked":true}]}]},{"id":"8","boardId":"3","title":"Import & Export","checklist":[{"id":"1","label":"Research","checkListTask":[{"id":"1","label":"Design Idea","checked":true},{"id":"2","label":"Wireframe for design","checked":true},{"id":"3","label":"Make prototypes","checked":true},{"id":"4","label":"Add images to the product gallery","checked":true}]},{"id":"2","label":"Design","checkListTask":[{"id":"1","label":"Design Idea","checked":true},{"id":"2","label":"Wireframe for design","checked":true},{"id":"3","label":"Make prototypes","checked":true},{"id":"4","label":"Add images to the product gallery","checked":true}]}]},{"id":"9","boardId":"3","title":"Coming Soon Page","checklist":[{"id":"1","label":"Research","checkListTask":[{"id":"1","label":"Design Idea","checked":true},{"id":"2","label":"Wireframe for design","checked":true},{"id":"3","label":"Make prototypes","checked":true},{"id":"4","label":"Add images to the product gallery","checked":true}]},{"id":"2","label":"Design","checkListTask":[{"id":"1","label":"Design Idea","checked":true},{"id":"2","label":"Wireframe for design","checked":true},{"id":"3","label":"Make prototypes","checked":true},{"id":"4","label":"Add images to the product gallery","checked":true}]}]},{"id":"10","boardId":"3","title":"Changelog","checklist":[{"id":"1","label":"Research","checkListTask":[{"id":"1","label":"Design Idea","checked":true},{"id":"2","label":"Wireframe for design","checked":true},{"id":"3","label":"Make prototypes","checked":true},{"id":"4","label":"Add images to the product gallery","checked":true}]},{"id":"2","label":"Design","checkListTask":[{"id":"1","label":"Design Idea","checked":true},{"id":"2","label":"Wireframe for design","checked":true},{"id":"3","label":"Make prototypes","checked":true},{"id":"4","label":"Add images to the product gallery","checked":true}]}]},{"id":"11","boardId":"4","title":"CRM Dashboard","checklist":[{"id":"1","label":"Research","checkListTask":[{"id":"1","label":"Design Idea","checked":true},{"id":"2","label":"Wireframe for design","checked":true},{"id":"3","label":"Make prototypes","checked":true},{"id":"4","label":"Add images to the product gallery","checked":true}]},{"id":"2","label":"Design","checkListTask":[{"id":"1","label":"Design Idea","checked":true},{"id":"2","label":"Wireframe for design","checked":true},{"id":"3","label":"Make prototypes","checked":true},{"id":"4","label":"Add images to the product gallery","checked":true}]}]}]'),qt={toAddBoardBegin(e){e.loading=!0},toAddBoardSuccess(e,t){e.loading=!1,e.boardData=t},toAddBoardErr(e,t){e.loading=!1,e.error=t},toAddTaskBegin(e){e.tsLoading=!0},toAddTaskSuccess(e,t){e.tsLoading=!1,e.taskData=t},toAddTaskErr(e,t){e.tsLoading=!1,e.error=t},toDeleteTaskBegin(e){e.tsLoading=!0},toDeleteTaskSuccess(e,t){e.tsLoading=!1,e.taskData=t},toDeleteTaskErr(e,t){e.tsLoading=!1,e.error=t}};const Gt=()=>({boardData:Vt,taskData:Jt,loading:!1,tsLoading:!1,error:null}),Xt={async ToAddBoard({commit:e},t){try{e("toAddBoardBegin"),e("toAddBoardSuccess",t)}catch(a){e("toAddBoardErr",a)}},async ToAddTask({commit:e},t){try{e("toAddTaskBegin"),e("toAddTaskSuccess",t)}catch(a){e("toAddTaskErr",a)}},async ToDeleteTask({commit:e},t){try{e("toDeleteTaskBegin"),e("toDeleteTaskSuccess",t)}catch(a){e("toDeleteTaskErr",a)}}};var Yt={namespaced:!1,state:Gt,actions:Xt,mutations:qt},Ht=(0,i.MT)({state:{user:null,otp:"",loading:!1,isError:!1,errorMessage:null,errorDescription:null},mutations:{setUser(e,t){e.user=t},setOtp(e,t){e.otp=t},setLoading(e,t){e.loading=t},setIsError(e,t){e.isError=t},setErrorMessage(e,t){e.errorMessage=t},setErrorDescription(e,t){e.errorDescription=t}},actions:{setUser({commit:e},t){e("setUser",t)}},modules:{themeLayout:c,users:g,chartContent:Z,email:M,headerSearchData:V,chat:Y,ecommerce:te,orders:re,cart:me,profile:fe,project:Pe,calendar:_e,team:ze,contact:Ne,note:Ge,todo:Qe,task:ot,crud:Rt,auth:Wt,fireStore:yt,firebase:At,KanbanBoard:Yt}})},47156:function(e,t,a){e.exports=a.p+"img/arrow-left.1e3c2008.svg"},84908:function(e,t,a){e.exports=a.p+"img/arrow-right.90e07b59.svg"},44016:function(e){e.exports="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAHgAAAB4CAYAAAA5ZDbSAAAElklEQVR4Xu2Xy0okQRBFc0TwuVFx4VtEFBFxI7jzr/0Bdy5FVBR8ICqIqBsVBXGGSIgmpqa6C63ulrme2khblVl578kbkfVre3v7d+KSdeAXgGXZZmEA1uYLYHG+AAawugPi+ujBABZ3QFweCQawuAPi8kgwgMUdEJdHggEs7oC4PBIMYHEHxOWRYACLOyAujwQDWNwBcXkkGMDiDojLI8EAFndAXB4JBrC4A+LySDCAxR0Ql0eCASzugLg8EgxgcQfE5ZFgAIs7IC6PBANY3AFxeSQYwOIOiMsjwQAWd0BcHgkGsLgD4vJIMIDFHRCXR4IBLO6AuDwSDGBxB8TlkWAAizsgLo8EA1jcAXF5JBjA4g6IyyPBABZ3QFxexxO8tbWVLdzZ2cl/x8bG0vr6eurv78+/7+/v0+7u7j/3Pj4+0tnZWTo5OamFwN93d3eX9vf381xTU1NpZWUlXV5els6/tLSU5ufn08XFReP+2tpampmZyePf39/TwcFBur6+zr/jvaenp4bWWgtv0+COAXbRJjgCNvN6e3vT4eFhA7abb5vh7e0tA7fx4+PjaW9vL2+COpe9c3Z2Nh0dHWUo8T1xXt8MPT09yTbY1dVVA/DGxkY6Pz/Pa4lrszE+9+vra968cTPVWXc7xnYMsC/OzBgZGWm6q83sx8fH9PDwkJaXl9Px8XGGYMbZ2Jubm9optrU4VHvX5ORkTnOzjVP1btswPsfi4mKW6lWoSm87oH1mjm8FHI20RReNd/iDg4PJUjUwMJBLeyyRMY3FpEYjrCzbBrKrKmFVgCNEX6OX/wh/dXU1vby8pNHR0Vy1LOFWkWLqW1WUz4Bs9uy3At7c3Ex9fX053dEYT1YEbFXAe3Ic5+CsfM7NzbVMfBzXyrxWgIv9uwqwbUjv13Ez2lrssg3QqsLVhfwtgL3XPT8/N0pbFeBYBh2ql3Pv9/HAVjTG5p+ens6V4Pb2tnHgKjOwGWB7z8TExF8HrCrA1hLK0m3vtX5tyY4HtrpAi+O7DriZeUVo8Tnb4a0AG7yFhYXcy70Xlh2erDTbIe4rPbhZb/UklvXgVvBtM9r9mPB2w7X5ug7YjLKeWgai2SnaDjJDQ0ONE/VnS3QRTrNTtBtc3IT22/rp6elp49PIn419v3iKLn4i/ogSbXDMsHj5t6Ol2Iy0shUPUjbGD1hWYv2w4mXOS31ZCS37pi37XzHx8QQf1+XPxe/0qCm2CQc8PDych7nOuE7fFLFdtTPJHU9wOxZbLIPtmLMbcxRLdDfe2fUe3A5RAP66iyT4695VjiTBlRbxQF0H/osE1xX5k8cDWJw+gAEs7oC4PBIMYHEHxOWRYACLOyAujwQDWNwBcXkkGMDiDojLI8EAFndAXB4JBrC4A+LySDCAxR0Ql0eCASzugLg8EgxgcQfE5ZFgAIs7IC6PBANY3AFxeSQYwOIOiMsjwQAWd0BcHgkGsLgD4vJIMIDFHRCXR4IBLO6AuDwSDGBxB8TlkWAAizsgLo8EA1jcAXF5JBjA4g6IyyPBABZ3QFweCQawuAPi8kgwgMUdEJdHgsUB/wHERxbFRshvpQAAAABJRU5ErkJggg=="},38341:function(e){e.exports="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAHgAAAB4CAYAAAA5ZDbSAAAElklEQVR4Xu2Xy0okQRBFc0TwuVFx4VtEFBFxI7jzr/0Bdy5FVBR8ICqIqBsVBXGGSIgmpqa6C63ulrme2khblVl578kbkfVre3v7d+KSdeAXgGXZZmEA1uYLYHG+AAawugPi+ujBABZ3QFweCQawuAPi8kgwgMUdEJdHggEs7oC4PBIMYHEHxOWRYACLOyAujwQDWNwBcXkkGMDiDojLI8EAFndAXB4JBrC4A+LySDCAxR0Ql0eCASzugLg8EgxgcQfE5ZFgAIs7IC6PBANY3AFxeSQYwOIOiMsjwQAWd0BcHgkGsLgD4vJIMIDFHRCXR4IBLO6AuDwSDGBxB8TlkWAAizsgLo8EA1jcAXF5JBjA4g6IyyPBABZ3QFxexxO8tbWVLdzZ2cl/x8bG0vr6eurv78+/7+/v0+7u7j/3Pj4+0tnZWTo5OamFwN93d3eX9vf381xTU1NpZWUlXV5els6/tLSU5ufn08XFReP+2tpampmZyePf39/TwcFBur6+zr/jvaenp4bWWgtv0+COAXbRJjgCNvN6e3vT4eFhA7abb5vh7e0tA7fx4+PjaW9vL2+COpe9c3Z2Nh0dHWUo8T1xXt8MPT09yTbY1dVVA/DGxkY6Pz/Pa4lrszE+9+vra968cTPVWXc7xnYMsC/OzBgZGWm6q83sx8fH9PDwkJaXl9Px8XGGYMbZ2Jubm9optrU4VHvX5ORkTnOzjVP1btswPsfi4mKW6lWoSm87oH1mjm8FHI20RReNd/iDg4PJUjUwMJBLeyyRMY3FpEYjrCzbBrKrKmFVgCNEX6OX/wh/dXU1vby8pNHR0Vy1LOFWkWLqW1WUz4Bs9uy3At7c3Ex9fX053dEYT1YEbFXAe3Ic5+CsfM7NzbVMfBzXyrxWgIv9uwqwbUjv13Ez2lrssg3QqsLVhfwtgL3XPT8/N0pbFeBYBh2ql3Pv9/HAVjTG5p+ens6V4Pb2tnHgKjOwGWB7z8TExF8HrCrA1hLK0m3vtX5tyY4HtrpAi+O7DriZeUVo8Tnb4a0AG7yFhYXcy70Xlh2erDTbIe4rPbhZb/UklvXgVvBtM9r9mPB2w7X5ug7YjLKeWgai2SnaDjJDQ0ONE/VnS3QRTrNTtBtc3IT22/rp6elp49PIn419v3iKLn4i/ogSbXDMsHj5t6Ol2Iy0shUPUjbGD1hWYv2w4mXOS31ZCS37pi37XzHx8QQf1+XPxe/0qCm2CQc8PDych7nOuE7fFLFdtTPJHU9wOxZbLIPtmLMbcxRLdDfe2fUe3A5RAP66iyT4695VjiTBlRbxQF0H/osE1xX5k8cDWJw+gAEs7oC4PBIMYHEHxOWRYACLOyAujwQDWNwBcXkkGMDiDojLI8EAFndAXB4JBrC4A+LySDCAxR0Ql0eCASzugLg8EgxgcQfE5ZFgAIs7IC6PBANY3AFxeSQYwOIOiMsjwQAWd0BcHgkGsLgD4vJIMIDFHRCXR4IBLO6AuDwSDGBxB8TlkWAAizsgLo8EA1jcAXF5JBjA4g6IyyPBABZ3QFweCQawuAPi8kgwgMUdEJdHgsUB/wHERxbFRshvpQAAAABJRU5ErkJggg=="},79835:function(e){e.exports="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAHgAAAB4CAYAAAA5ZDbSAAAElklEQVR4Xu2Xy0okQRBFc0TwuVFx4VtEFBFxI7jzr/0Bdy5FVBR8ICqIqBsVBXGGSIgmpqa6C63ulrme2khblVl578kbkfVre3v7d+KSdeAXgGXZZmEA1uYLYHG+AAawugPi+ujBABZ3QFweCQawuAPi8kgwgMUdEJdHggEs7oC4PBIMYHEHxOWRYACLOyAujwQDWNwBcXkkGMDiDojLI8EAFndAXB4JBrC4A+LySDCAxR0Ql0eCASzugLg8EgxgcQfE5ZFgAIs7IC6PBANY3AFxeSQYwOIOiMsjwQAWd0BcHgkGsLgD4vJIMIDFHRCXR4IBLO6AuDwSDGBxB8TlkWAAizsgLo8EA1jcAXF5JBjA4g6IyyPBABZ3QFxexxO8tbWVLdzZ2cl/x8bG0vr6eurv78+/7+/v0+7u7j/3Pj4+0tnZWTo5OamFwN93d3eX9vf381xTU1NpZWUlXV5els6/tLSU5ufn08XFReP+2tpampmZyePf39/TwcFBur6+zr/jvaenp4bWWgtv0+COAXbRJjgCNvN6e3vT4eFhA7abb5vh7e0tA7fx4+PjaW9vL2+COpe9c3Z2Nh0dHWUo8T1xXt8MPT09yTbY1dVVA/DGxkY6Pz/Pa4lrszE+9+vra968cTPVWXc7xnYMsC/OzBgZGWm6q83sx8fH9PDwkJaXl9Px8XGGYMbZ2Jubm9optrU4VHvX5ORkTnOzjVP1btswPsfi4mKW6lWoSm87oH1mjm8FHI20RReNd/iDg4PJUjUwMJBLeyyRMY3FpEYjrCzbBrKrKmFVgCNEX6OX/wh/dXU1vby8pNHR0Vy1LOFWkWLqW1WUz4Bs9uy3At7c3Ex9fX053dEYT1YEbFXAe3Ic5+CsfM7NzbVMfBzXyrxWgIv9uwqwbUjv13Ez2lrssg3QqsLVhfwtgL3XPT8/N0pbFeBYBh2ql3Pv9/HAVjTG5p+ens6V4Pb2tnHgKjOwGWB7z8TExF8HrCrA1hLK0m3vtX5tyY4HtrpAi+O7DriZeUVo8Tnb4a0AG7yFhYXcy70Xlh2erDTbIe4rPbhZb/UklvXgVvBtM9r9mPB2w7X5ug7YjLKeWgai2SnaDjJDQ0ONE/VnS3QRTrNTtBtc3IT22/rp6elp49PIn419v3iKLn4i/ogSbXDMsHj5t6Ol2Iy0shUPUjbGD1hWYv2w4mXOS31ZCS37pi37XzHx8QQf1+XPxe/0qCm2CQc8PDych7nOuE7fFLFdtTPJHU9wOxZbLIPtmLMbcxRLdDfe2fUe3A5RAP66iyT4695VjiTBlRbxQF0H/osE1xX5k8cDWJw+gAEs7oC4PBIMYHEHxOWRYACLOyAujwQDWNwBcXkkGMDiDojLI8EAFndAXB4JBrC4A+LySDCAxR0Ql0eCASzugLg8EgxgcQfE5ZFgAIs7IC6PBANY3AFxeSQYwOIOiMsjwQAWd0BcHgkGsLgD4vJIMIDFHRCXR4IBLO6AuDwSDGBxB8TlkWAAizsgLo8EA1jcAXF5JBjA4g6IyyPBABZ3QFweCQawuAPi8kgwgMUdEJdHgsUB/wHERxbFRshvpQAAAABJRU5ErkJggg=="},19813:function(e){e.exports="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAHgAAAB4CAYAAAA5ZDbSAAAElklEQVR4Xu2Xy0okQRBFc0TwuVFx4VtEFBFxI7jzr/0Bdy5FVBR8ICqIqBsVBXGGSIgmpqa6C63ulrme2khblVl578kbkfVre3v7d+KSdeAXgGXZZmEA1uYLYHG+AAawugPi+ujBABZ3QFweCQawuAPi8kgwgMUdEJdHggEs7oC4PBIMYHEHxOWRYACLOyAujwQDWNwBcXkkGMDiDojLI8EAFndAXB4JBrC4A+LySDCAxR0Ql0eCASzugLg8EgxgcQfE5ZFgAIs7IC6PBANY3AFxeSQYwOIOiMsjwQAWd0BcHgkGsLgD4vJIMIDFHRCXR4IBLO6AuDwSDGBxB8TlkWAAizsgLo8EA1jcAXF5JBjA4g6IyyPBABZ3QFxexxO8tbWVLdzZ2cl/x8bG0vr6eurv78+/7+/v0+7u7j/3Pj4+0tnZWTo5OamFwN93d3eX9vf381xTU1NpZWUlXV5els6/tLSU5ufn08XFReP+2tpampmZyePf39/TwcFBur6+zr/jvaenp4bWWgtv0+COAXbRJjgCNvN6e3vT4eFhA7abb5vh7e0tA7fx4+PjaW9vL2+COpe9c3Z2Nh0dHWUo8T1xXt8MPT09yTbY1dVVA/DGxkY6Pz/Pa4lrszE+9+vra968cTPVWXc7xnYMsC/OzBgZGWm6q83sx8fH9PDwkJaXl9Px8XGGYMbZ2Jubm9optrU4VHvX5ORkTnOzjVP1btswPsfi4mKW6lWoSm87oH1mjm8FHI20RReNd/iDg4PJUjUwMJBLeyyRMY3FpEYjrCzbBrKrKmFVgCNEX6OX/wh/dXU1vby8pNHR0Vy1LOFWkWLqW1WUz4Bs9uy3At7c3Ex9fX053dEYT1YEbFXAe3Ic5+CsfM7NzbVMfBzXyrxWgIv9uwqwbUjv13Ez2lrssg3QqsLVhfwtgL3XPT8/N0pbFeBYBh2ql3Pv9/HAVjTG5p+ens6V4Pb2tnHgKjOwGWB7z8TExF8HrCrA1hLK0m3vtX5tyY4HtrpAi+O7DriZeUVo8Tnb4a0AG7yFhYXcy70Xlh2erDTbIe4rPbhZb/UklvXgVvBtM9r9mPB2w7X5ug7YjLKeWgai2SnaDjJDQ0ONE/VnS3QRTrNTtBtc3IT22/rp6elp49PIn419v3iKLn4i/ogSbXDMsHj5t6Ol2Iy0shUPUjbGD1hWYv2w4mXOS31ZCS37pi37XzHx8QQf1+XPxe/0qCm2CQc8PDych7nOuE7fFLFdtTPJHU9wOxZbLIPtmLMbcxRLdDfe2fUe3A5RAP66iyT4695VjiTBlRbxQF0H/osE1xX5k8cDWJw+gAEs7oC4PBIMYHEHxOWRYACLOyAujwQDWNwBcXkkGMDiDojLI8EAFndAXB4JBrC4A+LySDCAxR0Ql0eCASzugLg8EgxgcQfE5ZFgAIs7IC6PBANY3AFxeSQYwOIOiMsjwQAWd0BcHgkGsLgD4vJIMIDFHRCXR4IBLO6AuDwSDGBxB8TlkWAAizsgLo8EA1jcAXF5JBjA4g6IyyPBABZ3QFweCQawuAPi8kgwgMUdEJdHgsUB/wHERxbFRshvpQAAAABJRU5ErkJggg=="},71640:function(e){e.exports="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAHgAAAB4CAYAAAA5ZDbSAAAElklEQVR4Xu2Xy0okQRBFc0TwuVFx4VtEFBFxI7jzr/0Bdy5FVBR8ICqIqBsVBXGGSIgmpqa6C63ulrme2khblVl578kbkfVre3v7d+KSdeAXgGXZZmEA1uYLYHG+AAawugPi+ujBABZ3QFweCQawuAPi8kgwgMUdEJdHggEs7oC4PBIMYHEHxOWRYACLOyAujwQDWNwBcXkkGMDiDojLI8EAFndAXB4JBrC4A+LySDCAxR0Ql0eCASzugLg8EgxgcQfE5ZFgAIs7IC6PBANY3AFxeSQYwOIOiMsjwQAWd0BcHgkGsLgD4vJIMIDFHRCXR4IBLO6AuDwSDGBxB8TlkWAAizsgLo8EA1jcAXF5JBjA4g6IyyPBABZ3QFxexxO8tbWVLdzZ2cl/x8bG0vr6eurv78+/7+/v0+7u7j/3Pj4+0tnZWTo5OamFwN93d3eX9vf381xTU1NpZWUlXV5els6/tLSU5ufn08XFReP+2tpampmZyePf39/TwcFBur6+zr/jvaenp4bWWgtv0+COAXbRJjgCNvN6e3vT4eFhA7abb5vh7e0tA7fx4+PjaW9vL2+COpe9c3Z2Nh0dHWUo8T1xXt8MPT09yTbY1dVVA/DGxkY6Pz/Pa4lrszE+9+vra968cTPVWXc7xnYMsC/OzBgZGWm6q83sx8fH9PDwkJaXl9Px8XGGYMbZ2Jubm9optrU4VHvX5ORkTnOzjVP1btswPsfi4mKW6lWoSm87oH1mjm8FHI20RReNd/iDg4PJUjUwMJBLeyyRMY3FpEYjrCzbBrKrKmFVgCNEX6OX/wh/dXU1vby8pNHR0Vy1LOFWkWLqW1WUz4Bs9uy3At7c3Ex9fX053dEYT1YEbFXAe3Ic5+CsfM7NzbVMfBzXyrxWgIv9uwqwbUjv13Ez2lrssg3QqsLVhfwtgL3XPT8/N0pbFeBYBh2ql3Pv9/HAVjTG5p+ens6V4Pb2tnHgKjOwGWB7z8TExF8HrCrA1hLK0m3vtX5tyY4HtrpAi+O7DriZeUVo8Tnb4a0AG7yFhYXcy70Xlh2erDTbIe4rPbhZb/UklvXgVvBtM9r9mPB2w7X5ug7YjLKeWgai2SnaDjJDQ0ONE/VnS3QRTrNTtBtc3IT22/rp6elp49PIn419v3iKLn4i/ogSbXDMsHj5t6Ol2Iy0shUPUjbGD1hWYv2w4mXOS31ZCS37pi37XzHx8QQf1+XPxe/0qCm2CQc8PDych7nOuE7fFLFdtTPJHU9wOxZbLIPtmLMbcxRLdDfe2fUe3A5RAP66iyT4695VjiTBlRbxQF0H/osE1xX5k8cDWJw+gAEs7oC4PBIMYHEHxOWRYACLOyAujwQDWNwBcXkkGMDiDojLI8EAFndAXB4JBrC4A+LySDCAxR0Ql0eCASzugLg8EgxgcQfE5ZFgAIs7IC6PBANY3AFxeSQYwOIOiMsjwQAWd0BcHgkGsLgD4vJIMIDFHRCXR4IBLO6AuDwSDGBxB8TlkWAAizsgLo8EA1jcAXF5JBjA4g6IyyPBABZ3QFweCQawuAPi8kgwgMUdEJdHgsUB/wHERxbFRshvpQAAAABJRU5ErkJggg=="}},t={};function a(i){var o=t[i];if(void 0!==o)return o.exports;var n=t[i]={id:i,loaded:!1,exports:{}};return e[i].call(n.exports,n,n.exports,a),n.loaded=!0,n.exports}a.m=e,function(){var e=[];a.O=function(t,i,o,n){if(!i){var r=1/0;for(c=0;c<e.length;c++){i=e[c][0],o=e[c][1],n=e[c][2];for(var l=!0,s=0;s<i.length;s++)(!1&n||r>=n)&&Object.keys(a.O).every((function(e){return a.O[e](i[s])}))?i.splice(s--,1):(l=!1,n<r&&(r=n));if(l){e.splice(c--,1);var d=o();void 0!==d&&(t=d)}}return t}n=n||0;for(var c=e.length;c>0&&e[c-1][2]>n;c--)e[c]=e[c-1];e[c]=[i,o,n]}}(),function(){a.n=function(e){var t=e&&e.__esModule?function(){return e["default"]}:function(){return e};return a.d(t,{a:t}),t}}(),function(){var e,t=Object.getPrototypeOf?function(e){return Object.getPrototypeOf(e)}:function(e){return e.__proto__};a.t=function(i,o){if(1&o&&(i=this(i)),8&o)return i;if("object"===typeof i&&i){if(4&o&&i.__esModule)return i;if(16&o&&"function"===typeof i.then)return i}var n=Object.create(null);a.r(n);var r={};e=e||[null,t({}),t([]),t(t)];for(var l=2&o&&i;"object"==typeof l&&!~e.indexOf(l);l=t(l))Object.getOwnPropertyNames(l).forEach((function(e){r[e]=function(){return i[e]}}));return r["default"]=function(){return i},a.d(n,r),n}}(),function(){a.d=function(e,t){for(var i in t)a.o(t,i)&&!a.o(e,i)&&Object.defineProperty(e,i,{enumerable:!0,get:t[i]})}}(),function(){a.f={},a.e=function(e){return Promise.all(Object.keys(a.f).reduce((function(t,i){return a.f[i](e,t),t}),[]))}}(),function(){a.u=function(e){return"js/"+({6:"import",66:"fireStore-view",76:"comingSoon",80:"Orders",157:"export",160:"components",268:"Home",288:"Search",328:"admin",362:"Dashboard",372:"Business",388:"ecommerce",535:"login",616:"forgotPassword",818:"auth",911:"fireStore-add"}[e]||e)+"."+{6:"2d44c875",42:"cff79ed0",66:"c74a014f",76:"a1a64a20",80:"83a1261c",93:"0d4a21e1",157:"92ff4485",160:"3ae41beb",239:"71554611",243:"dc009cc7",255:"1a9061e4",268:"0f6a7438",269:"68302aa3",288:"c15e8d62",328:"cea3ad23",353:"5631c601",356:"eee4b275",362:"0c7d4749",372:"39d203d8",374:"ad0fb7ed",388:"862213dd",431:"653c2ee5",447:"dd716e93",535:"ddb55b96",570:"56091371",616:"96821a1d",633:"10865409",648:"c0f45ddc",754:"9bd357eb",756:"cf975d5a",818:"5db28571",821:"ae1d0493",828:"2ce8f784",858:"3afd8204",860:"a04dde66",876:"a8684485",911:"8adb6163",938:"161f4c04",966:"bae9ae9e"}[e]+".js"}}(),function(){a.miniCssF=function(e){return"css/"+({66:"fireStore-view",288:"Search",328:"admin"}[e]||e)+"."+{66:"41c874f6",239:"c91af842",288:"7ee7336f",328:"41593e63",570:"b63f711f",938:"db8260d3"}[e]+".css"}}(),function(){a.g=function(){if("object"===typeof globalThis)return globalThis;try{return this||new Function("return this")()}catch(e){if("object"===typeof window)return window}}()}(),function(){a.hmd=function(e){return e=Object.create(e),e.children||(e.children=[]),Object.defineProperty(e,"exports",{enumerable:!0,set:function(){throw new Error("ES Modules may not assign module.exports or exports.*, Use ESM export syntax, instead: "+e.id)}}),e}}(),function(){a.o=function(e,t){return Object.prototype.hasOwnProperty.call(e,t)}}(),function(){var e={},t="MassNetCampaign:";a.l=function(i,o,n,r){if(e[i])e[i].push(o);else{var l,s;if(void 0!==n)for(var d=document.getElementsByTagName("script"),c=0;c<d.length;c++){var m=d[c];if(m.getAttribute("src")==i||m.getAttribute("data-webpack")==t+n){l=m;break}}l||(s=!0,l=document.createElement("script"),l.charset="utf-8",l.timeout=120,a.nc&&l.setAttribute("nonce",a.nc),l.setAttribute("data-webpack",t+n),l.src=i),e[i]=[o];var p=function(t,a){l.onerror=l.onload=null,clearTimeout(g);var o=e[i];if(delete e[i],l.parentNode&&l.parentNode.removeChild(l),o&&o.forEach((function(e){return e(a)})),t)return t(a)},g=setTimeout(p.bind(null,void 0,{type:"timeout",target:l}),12e4);l.onerror=p.bind(null,l.onerror),l.onload=p.bind(null,l.onload),s&&document.head.appendChild(l)}}}(),function(){a.r=function(e){"undefined"!==typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})}}(),function(){a.nmd=function(e){return e.paths=[],e.children||(e.children=[]),e}}(),function(){a.p="/"}(),function(){if("undefined"!==typeof document){var e=function(e,t,a,i,o){var n=document.createElement("link");n.rel="stylesheet",n.type="text/css";var r=function(a){if(n.onerror=n.onload=null,"load"===a.type)i();else{var r=a&&("load"===a.type?"missing":a.type),l=a&&a.target&&a.target.href||t,s=new Error("Loading CSS chunk "+e+" failed.\n("+l+")");s.code="CSS_CHUNK_LOAD_FAILED",s.type=r,s.request=l,n.parentNode&&n.parentNode.removeChild(n),o(s)}};return n.onerror=n.onload=r,n.href=t,a?a.parentNode.insertBefore(n,a.nextSibling):document.head.appendChild(n),n},t=function(e,t){for(var a=document.getElementsByTagName("link"),i=0;i<a.length;i++){var o=a[i],n=o.getAttribute("data-href")||o.getAttribute("href");if("stylesheet"===o.rel&&(n===e||n===t))return o}var r=document.getElementsByTagName("style");for(i=0;i<r.length;i++){o=r[i],n=o.getAttribute("data-href");if(n===e||n===t)return o}},i=function(i){return new Promise((function(o,n){var r=a.miniCssF(i),l=a.p+r;if(t(r,l))return o();e(i,l,null,o,n)}))},o={143:0};a.f.miniCss=function(e,t){var a={66:1,239:1,288:1,328:1,570:1,938:1};o[e]?t.push(o[e]):0!==o[e]&&a[e]&&t.push(o[e]=i(e).then((function(){o[e]=0}),(function(t){throw delete o[e],t})))}}}(),function(){var e={143:0};a.f.j=function(t,i){var o=a.o(e,t)?e[t]:void 0;if(0!==o)if(o)i.push(o[2]);else{var n=new Promise((function(a,i){o=e[t]=[a,i]}));i.push(o[2]=n);var r=a.p+a.u(t),l=new Error,s=function(i){if(a.o(e,t)&&(o=e[t],0!==o&&(e[t]=void 0),o)){var n=i&&("load"===i.type?"missing":i.type),r=i&&i.target&&i.target.src;l.message="Loading chunk "+t+" failed.\n("+n+": "+r+")",l.name="ChunkLoadError",l.type=n,l.request=r,o[1](l)}};a.l(r,s,"chunk-"+t,t)}},a.O.j=function(t){return 0===e[t]};var t=function(t,i){var o,n,r=i[0],l=i[1],s=i[2],d=0;if(r.some((function(t){return 0!==e[t]}))){for(o in l)a.o(l,o)&&(a.m[o]=l[o]);if(s)var c=s(a)}for(t&&t(i);d<r.length;d++)n=r[d],a.o(e,n)&&e[n]&&e[n][0](),e[n]=0;return a.O(c)},i=self["webpackChunkMassNetCampaign"]=self["webpackChunkMassNetCampaign"]||[];i.forEach(t.bind(null,0)),i.push=t.bind(null,i.push.bind(i))}();var i=a.O(void 0,[998],(function(){return a(57215)}));i=a.O(i)})();
//# sourceMappingURL=app.fcc32464.js.map