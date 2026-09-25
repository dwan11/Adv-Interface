import math,random
R=random.Random(33)
W,H=533,800; VP=(268,445)
INK="#4F443B"
lines=[]; color=[]; bloom_lines=[]; bloom_color=[]; refl_color=[]; refl_lines=[]
def toVP(x0,y0,x): return VP[1]+(y0-VP[1])*(x-VP[0])/(x0-VP[0])
def P(pts,close=False): return 'M'+' L'.join(f'{x:.1f},{y:.1f}' for x,y in pts)+(' Z' if close else '')
def ln(x1,y1,x2,y2,w=0.6,op=1,col=INK,t=lines): t.append(f'<line x1="{x1:.1f}" y1="{y1:.1f}" x2="{x2:.1f}" y2="{y2:.1f}" stroke="{col}" stroke-width="{w}" opacity="{op}"/>')
def fill(pts,f,t=color,extra=''): t.append(f'<path d="{P(pts,True)}" fill="{f}" {extra}/>')

BX0,BX1,BY0,BY1=190,348,80,350
yl=lambda x: toVP(BX0,345,x); yr=lambda x: toVP(BX1,350,x); yb=lambda x: VP[1]+(x-VP[0])*1.04
xl_far=VP[0]+(548-VP[1])/(-0.95); xr_far=VP[0]+(548-VP[1])/2.19; xr_near=VP[0]+(H-VP[1])/2.19
yl0=VP[1]+(0-VP[0])*(-0.95)

# ================= COLOR (gouache fields) =================
# skylight
fill([(176,0),(362,0),(BX1,BY0),(BX0,BY0)],"url(#gSky)")
# side washi walls
fill([(0,0),(176,0),(BX0,BY0),(BX0,345),(0,yl(0))],"url(#gWallL)")
fill([(362,0),(W,0),(W,yr(W)),(BX1,350),(BX1,BY0)],"url(#gWallR)")
# back washi wall (glow)
fill([(BX0,BY0),(BX1,BY0),(BX1,BY1),(BX0,BY1)],"url(#gBack)")
color.append(f'<rect id="washiGlow" x="{BX0}" y="{BY0}" width="{BX1-BX0}" height="{BY1-BY0}" fill="url(#gGlow)"/>')
# washi grid (warm hairlines in the colour pass)
for i in range(1,6):
    x=BX0+i*(BX1-BX0)/6; ln(x,BY0,x,BY1,0.5,0.5,"#C79A55",color)
for j in range(1,4):
    y=BY0+j*(BY1-BY0)/4; ln(BX0,y,BX1,y,0.5,0.5,"#C79A55",color)
for x in (170,140,96,30): ln(x,0,x,yl(x),0.5,0.45,"#C79A55",color)
for x in (368,398,442,508): ln(x,0,x,yr(x),0.5,0.45,"#C79A55",color)
# void below back wall + left corridor
fill([(BX0,BY1),(BX1,BY1),(BX1,yb(BX1)),(xr_far,548),(xl_far,548),(BX0,520)],"url(#gVoid)")
fill([(0,yl(0)),(BX0,345),(BX0,520),(xl_far,548),(0,yl0)],"url(#gCorr)")
for (px,pw,top) in ((36,18,300),(84,14,318)):
    color.append(f'<rect x="{px}" y="{top}" width="{pw}" height="{505-top}" fill="url(#gPillar)"/>')
# corridor lamps (tiny warm points in the dark)
for x,y in ((120,470),(150,482)): color.append(f'<circle cx="{x}" cy="{y}" r="7" fill="url(#gLamp)"/>')
# stone wall
fill([(BX1,350),(W,yr(W)),(W,yb(W)),(BX1,yb(BX1))],"url(#gStone)")
for k in range(9):   # stone courses in perspective
    t=(k+1)/10; ya=350+t*(yb(BX1)-350); yz=yr(W)+t*(yb(W)-yr(W))
    color.append(f'<line x1="{BX1}" y1="{ya:.1f}" x2="{W}" y2="{yz:.1f}" stroke="#7D8793" stroke-width="0.45" opacity="0.55"/>')
    for s in range(4):
        x=BX1+(s+(0.5 if k%2 else 0))*(W-BX1)/4.2
        y1=ya+(yz-ya)*(x-BX1)/(W-BX1); y2=y1+(yb(BX1)-350)/10*(1+(x-BX1)/150)
        color.append(f'<line x1="{x:.1f}" y1="{y1:.1f}" x2="{x:.1f}" y2="{y2:.1f}" stroke="#7D8793" stroke-width="0.4" opacity="0.4"/>')
dtop=toVP(533,yr(533)+140,492)
fill([(492,dtop),(W,toVP(533,yr(533)+140,533)),(W,yb(W)),(492,yb(492))],"url(#gDoor)")
# stone floors
fill([(0,yl0),(xl_far,548),(0,520)],"url(#gFloorL)")
fill([(0,510),(xl_far,548),(0,yl0)],"url(#gFloorL)")
fill([(xr_far,548),(BX1,yb(BX1)),(W,yb(W)),(W,H),(xr_near,H)],"url(#gFloorR)")
for t in (0.25,0.5,0.75):
    color.append(f'<line x1="{xr_far+(BX1-xr_far)*t:.1f}" y1="{548-(548-yb(BX1))*t:.1f}" x2="{xr_near+(W-xr_near)*t:.1f}" y2="{H}" stroke="#8C7A66" stroke-width="0.4" opacity="0.5"/>')
# pool
pool=[(xl_far,548),(xr_far,548),(xr_near,H),(0,H),(0,yl0)]
fill(pool,"url(#gPool)")
color.append(f'<g clip-path="url(#clipPool)">'
  f'<rect x="{BX0+10}" y="560" width="{BX1-BX0-20}" height="240" fill="url(#gReflGlow)" filter="url(#b8)"/>'
  f'<rect x="0" y="560" width="160" height="240" fill="url(#gReflSide)" opacity="0.45" filter="url(#b8)"/></g>')
# plinth + pebbles
px0,px1,py=213,302,572
fill([(px0,py),(px1,py),(px1+6,py+12),(px0-6,py+12)],"#2A2522")
fill([(px0-6,py+12),(px1+6,py+12),(px1+6,py+19),(px0-6,py+19)],"#171412")
for i in range(26):
    x=px0+4+i*3.3+R.uniform(-1,1); color.append(f'<ellipse cx="{x:.1f}" cy="{py-1.2+R.uniform(-0.6,0.6):.1f}" rx="{R.uniform(1.4,2.2):.1f}" ry="1.2" fill="#EDE8DE"/>')
# vase
vc=258
Lv=[]
for i in range(41):
    t=i/40; y=520+52*t
    r=14+10*math.sin(min(1,t*1.25)*math.pi*0.62)-((t-0.8)*28 if t>0.8 else 0)
    Lv.append((vc-r,y))
vase=Lv+[(2*vc-x,y) for x,y in reversed(Lv)]
fill(vase,"url(#gVase)")
color.append(f'<path d="M{vc-17},532 C{vc-21},542 {vc-20},556 {vc-13},566" fill="none" stroke="#C99A7E" stroke-width="2.2" opacity="0.5" filter="url(#b1)"/>')

# ================= LINES (the sketch) =================
def L(*a,**k): ln(*a,**k)
for (a,b) in [((BX0,BY0),(BX1,BY0)),((BX0,BY1),(BX1,BY1)),((BX0,BY0),(BX0,BY1)),((BX1,BY0),(BX1,BY1)),
              ((BX0,BY0),(176,0)),((BX1,BY0),(362,0)),((BX0,345),(0,yl(0))),((BX1,350),(W,yr(W))),
              ((BX1,350),(BX1,yb(BX1))),((BX1,yb(BX1)),(W,yb(W))),((492,dtop),(492,yb(492))),((492,dtop),(W,toVP(533,yr(533)+140,533))),
              ((xl_far,548),(0,yl0)),((xr_far,548),(xr_near,H)),((xl_far,548),(xr_far,548)),((0,510),(150,505))]:
    L(a[0],a[1],b[0],b[1],0.75)
for i in range(1,6): x=BX0+i*(BX1-BX0)/6; L(x,BY0,x,BY1,0.35,0.6)
for j in range(1,4): y=BY0+j*(BY1-BY0)/4; L(BX0,y,BX1,y,0.35,0.6)
for x in (170,140,96,30): L(x,0,x,yl(x),0.35,0.55)
for x in (368,398,442,508): L(x,0,x,yr(x),0.35,0.55)
L(BX0-7,BY0*0.5,BX1+7,BY0*0.5,0.35,0.5)
for (px,pw,top) in ((36,18,300),(84,14,318)):
    lines.append(f'<rect x="{px}" y="{top}" width="{pw}" height="{505-top}" fill="none" stroke="{INK}" stroke-width="0.6"/>')
lines.append(f'<path d="{P([(px0,py),(px1,py),(px1+6,py+12),(px0-6,py+12)],True)}" fill="none" stroke="{INK}" stroke-width="0.7"/>')
lines.append(f'<path d="M{px0-6},{py+12} v7 h{px1-px0+12} v-7" fill="none" stroke="{INK}" stroke-width="0.7"/>')
lines.append(f'<path d="{P(vase,True)}" fill="none" stroke="{INK}" stroke-width="0.8"/>')
lines.append(f'<ellipse cx="{vc}" cy="520" rx="14" ry="2.6" fill="none" stroke="{INK}" stroke-width="0.6"/>')
for (y,x1,x2) in ((640,150,230),(700,290,350),(752,110,170)): L(x1,y,x2,y,0.35,0.5)

# ================= BLOSSOM =================
branches=[]; flowers=[]; buds=[]
def grow(x0,y0,a,length,depth,w,dist0=0):
    pts=[(x0,y0)]; x,y=x0,y0; n=8
    for i in range(n):
        a+=R.uniform(-0.15,0.15); x+=math.cos(a)*length/n; y+=math.sin(a)*length/n; pts.append((x,y))
    branches.append((pts,w))
    for i in range(2,len(pts)):
        px,py_=pts[i]
        if R.random()<0.3: continue
        d=dist0+length*i/n
        for _ in range(R.randint(2,4) if depth>1 else R.randint(1,3)):
            fx,fy=px+R.gauss(0,6),py_+R.gauss(0,5)
            if R.random()<0.75: flowers.append((fx,fy,R.uniform(3.4,5.8),R.uniform(0,6.28),R.uniform(0.55,1),d))
            else: buds.append((fx,fy,R.uniform(1.6,2.6),a+R.uniform(-1.2,1.2),d))
    if depth>1:
        for i in (2,3,5,6):
            if R.random()<0.5:
                bx,by=pts[i]; grow(bx,by,a+R.choice([-1,1])*R.uniform(0.4,0.85),length*R.uniform(0.3,0.45),depth-1,w*0.55,dist0+length*i/n)
spec=[(-2.95,185),(-2.62,175),(-2.3,175),(-1.95,190),(-1.72,225),(-1.5,200),(-1.28,185),(-0.98,185),(-0.66,190),(-0.36,195),(-0.12,170),(-3.15,135)]
for a,l in spec: grow(vc+R.uniform(-5,5),522,a,l,2,1.4)
maxd=max(f[5] for f in flowers) or 1
for pts,w in branches:
    bloom_lines.append(f'<path d="{P(pts)}" fill="none" stroke="#3E3029" stroke-width="{w*0.75:.2f}" stroke-linecap="round"/>')
    bloom_lines.append(f'<path d="{P(pts[:5])}" fill="none" stroke="#3E3029" stroke-width="{w*1.25:.2f}" stroke-linecap="round" opacity="0.6"/>')
def petal(cx,cy,r,a,sq):
    dx,dy=math.cos(a),math.sin(a)*sq; px,py=-math.sin(a),math.cos(a)*sq
    Q=lambda u,v:(cx+dx*u*r+px*v*r, cy+dy*u*r+py*v*r)
    f=lambda p:f'{p[0]:.2f},{p[1]:.2f}'
    return f'M{f(Q(0.15,0))} C{f(Q(0.3,0.52))} {f(Q(0.95,0.54))} {f(Q(1.0,0.2))} Q{f(Q(0.86,0))} {f(Q(1.0,-0.2))} C{f(Q(0.95,-0.54))} {f(Q(0.3,-0.52))} {f(Q(0.15,0))} Z'
flowers.sort(key=lambda f:f[5])
for i,(x,y,r,rot,sq,d) in enumerate(flowers):
    ds=' '.join(petal(x,y,r,rot+k*2*math.pi/5,sq) for k in range(5))
    t=0.42+0.55*(d/maxd)+R.uniform(-0.04,0.04)
    # colour: luminous petals + halo, revealed per flower
    bloom_color.append(f'<g class="fl" data-t="{t:.3f}" opacity="0"><circle cx="{x:.1f}" cy="{y:.1f}" r="{r*1.6:.1f}" fill="url(#gHalo)"/>'
        f'<path d="{ds}" fill="url(#gPetal)"/><circle cx="{x:.2f}" cy="{y:.2f}" r="{r*0.2:.2f}" fill="#E4A68E"/></g>')
    bloom_lines.append(f'<path d="{ds}" fill="none" stroke="{INK}" stroke-width="0.32" opacity="0.85"/>')
    st=[]
    for k in range(7):
        aa=rot+k*2*math.pi/7+0.2; rr=r*R.uniform(0.38,0.55)
        ex,ey=x+math.cos(aa)*rr,y+math.sin(aa)*rr*sq
        st.append(f'M{x:.2f},{y:.2f} L{ex:.2f},{ey:.2f}')
        bloom_color.append(f'<circle class="fl" data-t="{t:.3f}" opacity="0" cx="{ex:.2f}" cy="{ey:.2f}" r="0.45" fill="#C39A45"/>')
    bloom_lines.append(f'<path d="{" ".join(st)}" stroke="#7A5E3A" stroke-width="0.22" fill="none" opacity="0.8"/>')
for x,y,r,a,d in buds:
    ca,sa=math.cos(a),math.sin(a); t=0.42+0.55*(d/maxd)
    bloom_color.append(f'<ellipse class="fl" data-t="{t:.3f}" opacity="0" cx="{x:.1f}" cy="{y:.1f}" rx="{r:.1f}" ry="{r*0.7:.1f}" transform="rotate({math.degrees(a):.0f} {x:.1f} {y:.1f})" fill="#F2C9CF"/>')
    bloom_lines.append(f'<ellipse cx="{x:.1f}" cy="{y:.1f}" rx="{r:.1f}" ry="{r*0.7:.1f}" transform="rotate({math.degrees(a):.0f} {x:.1f} {y:.1f})" fill="none" stroke="{INK}" stroke-width="0.32"/>')
    bloom_lines.append(f'<path d="M{x-ca*r:.1f},{y-sa*r:.1f} l{-ca*2.2+sa*1.2:.1f},{-sa*2.2-ca*1.2:.1f} M{x-ca*r:.1f},{y-sa*r:.1f} l{-ca*2.2-sa*1.2:.1f},{-sa*2.2+ca*1.2:.1f}" stroke="#6E5A3C" stroke-width="0.35" fill="none"/>')

yo=2*(py+19)
BL=''.join(bloom_lines); BC=''.join(bloom_color)

defs=f'''<defs>
<linearGradient id="gSky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#FFFDF6"/><stop offset="1" stop-color="#F9EDCF"/></linearGradient>
<linearGradient id="gWallL" x1="1" y1="0" x2="0" y2="0.3"><stop offset="0" stop-color="#F7DE9E"/><stop offset="0.6" stop-color="#EDC67A"/><stop offset="1" stop-color="#DDAE62"/></linearGradient>
<linearGradient id="gWallR" x1="0" y1="0" x2="1" y2="0.3"><stop offset="0" stop-color="#F7DE9E"/><stop offset="0.6" stop-color="#EDC67A"/><stop offset="1" stop-color="#DDAE62"/></linearGradient>
<linearGradient id="gBack" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#FAE7B6"/><stop offset="1" stop-color="#F1CF8A"/></linearGradient>
<radialGradient id="gGlow" cx="0.5" cy="0.45" r="0.6"><stop offset="0" stop-color="#FFF8E6" stop-opacity="0.95"/><stop offset="1" stop-color="#FFF8E6" stop-opacity="0"/></radialGradient>
<linearGradient id="gVoid" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#4A3E33"/><stop offset="1" stop-color="#2A241F"/></linearGradient>
<linearGradient id="gCorr" x1="1" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#5A4E43"/><stop offset="1" stop-color="#2E2823"/></linearGradient>
<linearGradient id="gPillar" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#6D737C"/><stop offset="1" stop-color="#4A5058"/></linearGradient>
<radialGradient id="gLamp"><stop offset="0" stop-color="#FFE3A8" stop-opacity="0.9"/><stop offset="1" stop-color="#FFE3A8" stop-opacity="0"/></radialGradient>
<linearGradient id="gStone" x1="0" y1="0" x2="1" y2="0.2"><stop offset="0" stop-color="#5F6770"/><stop offset="1" stop-color="#474E57"/></linearGradient>
<linearGradient id="gDoor" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#2F3339"/><stop offset="1" stop-color="#23262B"/></linearGradient>
<linearGradient id="gFloorL" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#6E5E4E"/><stop offset="1" stop-color="#4B4036"/></linearGradient>
<linearGradient id="gFloorR" x1="0" y1="0" x2="0.4" y2="1"><stop offset="0" stop-color="#7C6A57"/><stop offset="1" stop-color="#4E4238"/></linearGradient>
<linearGradient id="gPool" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#2B2520"/><stop offset="1" stop-color="#15120F"/></linearGradient>
<linearGradient id="gReflGlow" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#F2CF88" stop-opacity="0.55"/><stop offset="1" stop-color="#F2CF88" stop-opacity="0"/></linearGradient>
<linearGradient id="gReflSide" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#E4B96A" stop-opacity="0.6"/><stop offset="1" stop-color="#E4B96A" stop-opacity="0"/></linearGradient>
<linearGradient id="gVase" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#6A4636"/><stop offset="0.35" stop-color="#553527"/><stop offset="1" stop-color="#2A1A12"/></linearGradient>
<radialGradient id="gHalo"><stop offset="0" stop-color="#FFFFFF" stop-opacity="0.3"/><stop offset="1" stop-color="#FFFFFF" stop-opacity="0"/></radialGradient>
<radialGradient id="gPetal" cx="0.5" cy="0.5" r="0.6"><stop offset="0" stop-color="#F6DADC"/><stop offset="0.45" stop-color="#FFFFFF"/><stop offset="1" stop-color="#FFFCFA"/></radialGradient>
<filter id="b8" filterUnits="userSpaceOnUse" x="-40" y="-40" width="{W+80}" height="{H+80}"><feGaussianBlur stdDeviation="8"/></filter>
<filter id="b1" filterUnits="userSpaceOnUse" x="-40" y="-40" width="{W+80}" height="{H+80}"><feGaussianBlur stdDeviation="1.2"/></filter>
<filter id="b2" filterUnits="userSpaceOnUse" x="-40" y="-40" width="{W+80}" height="{H+80}"><feGaussianBlur stdDeviation="2"/></filter>
<filter id="pen" filterUnits="userSpaceOnUse" x="-40" y="-40" width="{W+80}" height="{H+80}"><feTurbulence type="fractalNoise" baseFrequency="0.9" seed="3"/><feDisplacementMap in="SourceGraphic" scale="0.8"/></filter>
<clipPath id="clipPool"><path d="{P(pool,True)}"/></clipPath>
<linearGradient id="revealGrad" gradientUnits="userSpaceOnUse" x1="0" x2="0" y1="-220" y2="0"><stop offset="0" stop-color="#fff"/><stop offset="1" stop-color="#000"/></linearGradient>
<mask id="reveal" maskUnits="userSpaceOnUse" x="-40" y="-40" width="{W+80}" height="{H+80}"><rect x="-40" y="-40" width="{W+80}" height="{H+80}" fill="url(#revealGrad)"/></mask>
<filter id="feather" filterUnits="userSpaceOnUse" x="-60" y="-60" width="{W+120}" height="{H+120}"><feGaussianBlur stdDeviation="9"/></filter>
<linearGradient id="vigFade" x1="0" y1="0" x2="0" y2="1"><stop offset="0.8" stop-color="#fff"/><stop offset="1" stop-color="#000"/></linearGradient>
<mask id="vignette" maskUnits="userSpaceOnUse" x="-40" y="-40" width="{W+80}" height="{H+80}">
  <path d="M14,{H} L14,262 A252.5,252.5 0 0 1 519,262 L507,{H} Z" fill="url(#vigFade)" filter="url(#feather)"/>
</mask>
</defs>'''
svg=f'''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {W} {H}" class="lobby" role="img" aria-label="Line drawing of a hotel lobby with a cherry blossom arrangement, filling with colour as progress rises">
{defs}
<g mask="url(#vignette)">
  <g id="colour" mask="url(#reveal)">{''.join(color)}
    <g clip-path="url(#clipPool)"><g transform="translate(0,{yo}) scale(1,-1)" opacity="0.32" filter="url(#b2)"><path d="{P(vase,True)}" fill="#6A412F"/></g></g>
  </g>
  <g id="lines" filter="url(#pen)" fill="none" stroke-linecap="round">{''.join(lines)}</g>
  <g id="reflLines" clip-path="url(#clipPool)"><g transform="translate(0,{yo}) scale(1,-1)" opacity="0.14">{BL}</g></g>
  <g id="reflBloom" clip-path="url(#clipPool)"><g transform="translate(0,{yo}) scale(1,-1)" opacity="0.28" filter="url(#b1)">{BC}</g></g>
  <g id="bloomColour">{BC}</g>
  <g id="bloomLines">{BL}</g>
</g>
</svg>'''
open('art.svg','w').write(svg)
print(len(flowers),len(buds),len(svg)//1024,'KB')
