"""Bake Natural Earth 1:50m land (public domain) into data/geo.json for kit.realMap.
  python3 -I tools/bake_geo.py ne_50m_land.geojson data/geo.json
Source: https://raw.githubusercontent.com/nvkelso/natural-earth-vector/master/geojson/ne_50m_land.geojson
"""
import json, sys
src, out = sys.argv[1], sys.argv[2]
BB = (-110.0, -60.0, 170.0, 82.0)


def clip(poly):
    def edge(pts, inside, inter):
        res = []
        for i in range(len(pts)):
            a, b = pts[i - 1], pts[i]
            ia, ib = inside(a), inside(b)
            if ib:
                if not ia: res.append(inter(a, b))
                res.append(b)
            elif ia: res.append(inter(a, b))
        return res
    ix = lambda x: (lambda a, b: (x, a[1] + (b[1] - a[1]) * (x - a[0]) / (b[0] - a[0])))
    iy = lambda y: (lambda a, b: (a[0] + (b[0] - a[0]) * (y - a[1]) / (b[1] - a[1]), y))
    p = poly
    for ins, it in [(lambda q: q[0] >= BB[0], ix(BB[0])), (lambda q: q[0] <= BB[2], ix(BB[2])),
                    (lambda q: q[1] >= BB[1], iy(BB[1])), (lambda q: q[1] <= BB[3], iy(BB[3]))]:
        if not p: break
        p = edge(p, ins, it)
    return p


def dp(pts, eps):
    if len(pts) < 3: return pts
    a, b = pts[0], pts[-1]; dx, dy = b[0] - a[0], b[1] - a[1]; L = (dx * dx + dy * dy) ** 0.5 or 1e-9
    dmax, idx = 0, 0
    for i in range(1, len(pts) - 1):
        d = abs(dy * pts[i][0] - dx * pts[i][1] + b[0] * a[1] - b[1] * a[0]) / L
        if d > dmax: dmax, idx = d, i
    if dmax > eps: return dp(pts[:idx + 1], eps)[:-1] + dp(pts[idx:], eps)
    return [a, b]


sys.setrecursionlimit(100000)
g = json.load(open(src)); polys = []
for f in g['features']:
    geo = f['geometry']; rings = [geo['coordinates']] if geo['type'] == 'Polygon' else geo['coordinates']
    for r in rings:
        ring = [tuple(c) for c in r[0]]
        xs = [c[0] for c in ring]; ys = [c[1] for c in ring]
        if max(xs) < BB[0] or min(xs) > BB[2] or max(ys) < BB[1] or min(ys) > BB[3]: continue
        c = clip(ring)
        if len(c) < 4: continue
        area = abs(sum(c[i - 1][0] * c[i][1] - c[i][0] * c[i - 1][1] for i in range(len(c)))) / 2
        if area < 0.08: continue
        h = len(c) // 2   # a closed ring has equal ends: simplify its two halves separately
        s = dp(c[:h + 1], 0.03)[:-1] + dp(c[h:] + [c[0]], 0.03)[:-1]
        if len(s) >= 4: polys.append([[round(x, 2), round(y, 2)] for x, y in s])
PL = {
    'LISBON': (-9.14, 38.72), 'CAPE OF GOOD HOPE': (18.47, -34.36), 'MALINDI': (40.12, -3.22), 'CALICUT': (75.78, 11.25),
    'COCHIN': (76.24, 9.96), 'CANNANORE': (75.37, 11.87), 'GOA': (73.91, 15.50), 'CHAUL': (72.93, 18.55), 'DIU': (70.98, 20.71),
    'DAMAN': (72.83, 20.41), 'BASSEIN': (72.83, 19.33), 'SURAT': (72.83, 21.17), 'HOOGHLY': (88.39, 22.90), 'HORMUZ': (56.46, 27.06),
    'MALACCA': (102.25, 2.19), 'CONSTANTINOPLE': (28.98, 41.01), 'VENICE': (12.33, 45.44), 'CAIRO': (31.24, 30.04),
    'FATEHPUR SIKRI': (77.66, 27.09), 'BIJAPUR': (75.71, 16.83), 'BRAZIL': (-47.9, -12.0), 'LONDON': (-0.13, 51.51),
    'AMSTERDAM': (4.90, 52.37), 'MADRID': (-3.70, 40.42), 'BENGAL': (89.5, 23.6),
}
json.dump({'src': 'Natural Earth 1:50m land (public domain), clipped + simplified', 'bbox': BB, 'land': polys,
           'places': {k: list(v) for k, v in PL.items()}}, open(out, 'w'), separators=(',', ':'))
print(len(polys), 'polygons', sum(len(p) for p in polys), 'points')
