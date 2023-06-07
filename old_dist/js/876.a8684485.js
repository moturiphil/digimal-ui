"use strict";(self["webpackChunkMassNetCampaign"]=self["webpackChunkMassNetCampaign"]||[]).push([[876],{72876:function(a,e,t){t.r(e),t.d(e,{default:function(){return Z}});var n=t(66252);const l=(0,n._)("div",{class:"page-header-actions"},null,-1);function o(a,e,t,o,u,r){const s=(0,n.up)("sdPageHeader"),d=(0,n.up)("PaySummary"),i=(0,n.up)("sdCards"),m=(0,n.up)("a-col"),p=(0,n.up)("a-row"),c=(0,n.up)("MixedCardWrap"),h=(0,n.up)("Main");return(0,n.wg)(),(0,n.iD)("div",null,[(0,n.Wm)(s,{title:"Pay Breakdown"},{buttons:(0,n.w5)((()=>[l])),_:1}),(0,n.Wm)(h,null,{default:(0,n.w5)((()=>[(0,n.Wm)(c,null,{default:(0,n.w5)((()=>[(0,n.Wm)(p,{gutter:25},{default:(0,n.w5)((()=>[(0,n.Wm)(m,{lg:18,md:35,sm:12,xs:24},{default:(0,n.w5)((()=>[(0,n.Wm)(i,{headless:""},{default:(0,n.w5)((()=>[(0,n.Wm)(d,{subtotal:1200})])),_:1})])),_:1})])),_:1})])),_:1})])),_:1})])}var u=t(72984),r=t(3577);const s={class:"activity-summary-inner"},d=(0,n._)("br",null,null,-1),i={class:"activity"},m={class:"amount"},p=(0,n._)("br",null,null,-1),c=(0,n._)("br",null,null,-1),h={class:"promo-apply-form"},y=(0,n._)("a",{to:"#"},"Place Order",-1);function w(a,e,t,l,o,u){const w=(0,n.up)("sdHeading"),f=(0,n.up)("a-input"),_=(0,n.up)("a-form-item"),g=(0,n.up)("sdButton"),v=(0,n.up)("a-form");return(0,n.wg)(),(0,n.iD)("div",s,[d,((0,n.wg)(!0),(0,n.iD)(n.HY,null,(0,n.Ko)(o.data,(a=>((0,n.wg)(),(0,n.iD)("div",{key:a.id},[(0,n.Wm)(w,{class:"summary-total",as:"h4"},{default:(0,n.w5)((()=>[(0,n._)("span",i,(0,r.zw)(a.item)+" : ",1),(0,n._)("span",m,(0,r.zw)(a.amount),1)])),_:2},1024),p])))),128)),c,(0,n.Wm)(v,{layout:o.formState.layout,model:o.formState,onFinish:u.submitPromo},{default:(0,n.w5)((()=>[(0,n._)("div",h,[(0,n.Wm)(_,{name:"promoCode",label:"Comments"},{default:(0,n.w5)((()=>[(0,n.Wm)(f,{value:o.promoCode,"onUpdate:value":e[0]||(e[0]=a=>o.promoCode=a),placeholder:"Comment"},null,8,["value"])])),_:1}),(0,n.Wm)(_,null,{default:(0,n.w5)((()=>[(0,n.Wm)(g,{htmlType:"submit",size:"default",type:"success",outlined:""},{default:(0,n.w5)((()=>[(0,n.Uk)(" Approve ")])),_:1}),(0,n.Uk)("    "),(0,n.Wm)(g,{htmlType:"submit",size:"default",type:"danger",outlined:""},{default:(0,n.w5)((()=>[(0,n.Uk)(" Decline ")])),_:1})])),_:1})])])),_:1},8,["layout","model","onFinish"]),3===o.current?((0,n.wg)(),(0,n.j4)(g,{key:0,onClick:u.onSubmit,class:"btn-proceed",type:"secondary",size:"large"},{default:(0,n.w5)((()=>[y])),_:1},8,["onClick"])):(0,n.kq)("",!0)])}var f=t(40008),_=t(22201),g=t(9669),v=t.n(g),b={data(){return{data:[],formState:{layout:"vertical"},promoCode:"",current:1}},mounted(){const{params:a,query:e}=(0,_.yj)();console.log({params:a,query:e});const t=`http://41.89.92.206/massnet/api/payroll_detail?payroll_list_id=${e.id}`;v().get(t,{headers:(0,f.Z)()}).then((a=>{this.data=a.data.data,console.log(this.data)})).catch((a=>{console.error(a)}))},methods:{submitPromo(){},onSubmit(){}}},W=t(83744);const C=(0,W.Z)(b,[["render",w]]);var x=C,k=t(23481);k.ZP.div`
  .cashflow-wrap{
    .ant-card{
        min-height: 500px;
        @media only screen and (max-width: 1599px){
          min-height: 440px;
        }
        @media only screen and (max-width: 1450px){
          min-height: 410px;
        }
    }
  }
  .youtube-subscriber-wrap{
      .ant-card{
          min-height: 470px;
      }
  }
`;const P=k.ZP.div`
  .location-map >div{
    @media only screen and (max-width: 767px){
      height: 100%;
    }
  }
`;var M=(0,n.aZ)({name:"WidgetMixed",components:{Main:u.or,PaySummary:x,MixedCardWrap:P},setup(){return{}}});const S=(0,W.Z)(M,[["render",o]]);var Z=S}}]);
//# sourceMappingURL=876.a8684485.js.map