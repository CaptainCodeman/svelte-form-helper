import{S as Q,i as W,s as X,k as y,q as p,a as k,l as S,m as q,r as v,h as c,c as O,n as d,b as x,G as u,Z as Y,Y as ee,u as Z,H as $,_ as te,I as j,$ as le}from"../chunks/index.207a1664.js";import{c as ae}from"../chunks/form.64dfff32.js";function z(i){let e;return{c(){e=p("Name is required")},l(t){e=v(t,"Name is required")},m(t,m){x(t,e,m)},d(t){t&&c(e)}}}function K(i){let e;return{c(){e=p("Name must be at least 3 characters")},l(t){e=v(t,"Name must be at least 3 characters")},m(t,m){x(t,e,m)},d(t){t&&c(e)}}}function se(i){let e,t,m,b,r,h,a,J,T,U,D,_,F,w,B,f,L,N=JSON.stringify(i[1],null,2)+"",I,R,E=JSON.stringify(i[0],null,2)+"",M,A,C,G,n=i[0].valueMissing&&z(),o=i[0].tooShort&&K();return{c(){e=y("form"),t=y("label"),m=p("Username"),b=k(),r=y("input"),h=k(),a=y("div"),n&&n.c(),J=k(),o&&o.c(),D=k(),_=y("button"),F=p("Submit"),B=k(),f=y("pre"),L=p("form: "),I=p(N),R=p(`
name: `),M=p(E),A=p(`
`),this.h()},l(l){e=S(l,"FORM",{});var s=q(e);t=S(s,"LABEL",{for:!0,class:!0});var H=q(t);m=v(H,"Username"),H.forEach(c),b=O(s),r=S(s,"INPUT",{id:!0,class:!0,type:!0,placeholder:!0,minlength:!0,autocomplete:!0}),h=O(s),a=S(s,"DIV",{id:!0,class:!0});var P=q(a);n&&n.l(P),J=O(P),o&&o.l(P),P.forEach(c),D=O(s),_=S(s,"BUTTON",{type:!0,class:!0});var V=q(_);F=v(V,"Submit"),V.forEach(c),s.forEach(c),B=O(l),f=S(l,"PRE",{class:!0});var g=q(f);L=v(g,"form: "),I=v(g,N),R=v(g,`
name: `),M=v(g,E),A=v(g,`
`),g.forEach(c),this.h()},h(){d(t,"for","name"),d(t,"class","text-sm text-gray-500 svelte-6s6css"),d(r,"id","name"),d(r,"class","validated:valid:text-green-700 validated:valid:border-green-700 validated:invalid:text-red-700 validated:invalid:border-red-700"),d(r,"type","text"),d(r,"placeholder","unique name"),r.required=!0,d(r,"minlength","3"),d(r,"autocomplete","off"),d(a,"id",T=i[0].id),d(a,"class","m-1 text-xs text-red-700"),a.hidden=U=!i[0].show,d(_,"type","submit"),d(_,"class","block my-3 text-white bg-green-800 py-2 px-4 rounded disabled:bg-gray-400"),_.disabled=w=!i[1].valid,d(f,"class","text-xs mt-4")},m(l,s){x(l,e,s),u(e,t),u(t,m),u(e,b),u(e,r),u(e,h),u(e,a),n&&n.m(a,null),u(a,J),o&&o.m(a,null),u(e,D),u(e,_),u(_,F),x(l,B,s),x(l,f,s),u(f,L),u(f,I),u(f,R),u(f,M),u(f,A),C||(G=[Y(i[3].call(null,r)),Y(i[2].call(null,e)),ee(e,"submit",le(ie))],C=!0)},p(l,[s]){l[0].valueMissing?n||(n=z(),n.c(),n.m(a,J)):n&&(n.d(1),n=null),l[0].tooShort?o||(o=K(),o.c(),o.m(a,null)):o&&(o.d(1),o=null),s&1&&T!==(T=l[0].id)&&d(a,"id",T),s&1&&U!==(U=!l[0].show)&&(a.hidden=U),s&2&&w!==(w=!l[1].valid)&&(_.disabled=w),s&2&&N!==(N=JSON.stringify(l[1],null,2)+"")&&Z(I,N),s&1&&E!==(E=JSON.stringify(l[0],null,2)+"")&&Z(M,E)},i:$,o:$,d(l){l&&c(e),n&&n.d(),o&&o.d(),l&&c(B),l&&c(f),C=!1,te(G)}}}function ie(){}function re(i,e,t){let m,b;const r=ae();j(i,r,a=>t(1,b=a));const h=r.field({onBoth:!0,onDirty:!1,onTouched:!1});return j(i,h,a=>t(0,m=a)),[m,b,r,h]}class ue extends Q{constructor(e){super(),W(this,e,re,se,X,{})}}export{ue as component};