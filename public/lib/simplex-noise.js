// Inlined simplex-noise (2D only) - exposes window.SimplexNoise
// Compatible with: new SimplexNoise(rngFunc).noise2D(x,y)
(function(){
  function SimplexNoise(random){
    random=random||Math.random;
    this.p=new Uint8Array(256);
    for(var i=0;i<256;i++)this.p[i]=i;
    for(var i=255;i>0;i--){
      var n=Math.floor((i+1)*random());
      var q=this.p[i];this.p[i]=this.p[n];this.p[n]=q;
    }
    this.perm=new Uint8Array(512);
    this.permMod12=new Uint8Array(512);
    for(var i=0;i<512;i++){
      this.perm[i]=this.p[i&255];
      this.permMod12[i]=this.perm[i]%12;
    }
  }
  var grad3=new Float32Array([1,1,0,-1,1,0,1,-1,0,-1,-1,0,1,0,1,-1,0,1,1,0,-1,-1,0,-1,0,1,1,0,-1,1,0,1,-1,0,-1,-1]);
  var F2=0.5*(Math.sqrt(3)-1);
  var G2=(3-Math.sqrt(3))/6;
  SimplexNoise.prototype.noise2D=function(xin,yin){
    var permMod12=this.permMod12,perm=this.perm;
    var n0=0,n1=0,n2=0;
    var s=(xin+yin)*F2;
    var i=Math.floor(xin+s),j=Math.floor(yin+s);
    var t=(i+j)*G2;
    var X0=i-t,Y0=j-t;
    var x0=xin-X0,y0=yin-Y0;
    var i1,j1;
    if(x0>y0){i1=1;j1=0;}else{i1=0;j1=1;}
    var x1=x0-i1+G2,y1=y0-j1+G2;
    var x2=x0-1+2*G2,y2=y0-1+2*G2;
    var ii=i&255,jj=j&255;
    var t0=0.5-x0*x0-y0*y0;
    if(t0>=0){
      var gi0=permMod12[ii+perm[jj]]*3;
      t0*=t0;n0=t0*t0*(grad3[gi0]*x0+grad3[gi0+1]*y0);
    }
    var t1=0.5-x1*x1-y1*y1;
    if(t1>=0){
      var gi1=permMod12[ii+i1+perm[jj+j1]]*3;
      t1*=t1;n1=t1*t1*(grad3[gi1]*x1+grad3[gi1+1]*y1);
    }
    var t2=0.5-x2*x2-y2*y2;
    if(t2>=0){
      var gi2=permMod12[ii+1+perm[jj+1]]*3;
      t2*=t2;n2=t2*t2*(grad3[gi2]*x2+grad3[gi2+1]*y2);
    }
    return 70*(n0+n1+n2);
  };
  window.SimplexNoise=SimplexNoise;
})();
