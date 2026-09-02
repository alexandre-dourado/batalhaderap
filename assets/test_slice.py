import json
from PIL import Image

def get_components(mask_bbox, image_mask):
    x1, y1, x2, y2 = mask_bbox
    pixels = image_mask.load()
    width, height = image_mask.size
    
    visited = bytearray(width * height)
    components = []
    
    for y in range(y1, y2):
        for x in range(x1, x2):
            idx = y * width + x
            if visited[idx] or pixels[x, y] == 0:
                visited[idx] = 1
                continue
                
            # BFS
            stack = [(x, y)]
            visited[idx] = 1
            min_x, max_x, min_y, max_y = x, x, y, y
            
            while stack:
                cx, cy = stack.pop()
                min_x = min(min_x, cx)
                max_x = max(max_x, cx)
                min_y = min(min_y, cy)
                max_y = max(max_y, cy)
                
                for nx, ny in ((cx-1, cy), (cx+1, cy), (cx, cy-1), (cx, cy+1)):
                    if x1 <= nx < x2 and y1 <= ny < y2:
                        nidx = ny * width + nx
                        if not visited[nidx]:
                            visited[nidx] = 1
                            if pixels[nx, ny] > 0:
                                stack.append((nx, ny))
                                
            components.append((min_x, min_y, max_x + 1, max_y + 1))
            
    return components

img = Image.open('assets/assets.png').convert('RGBA')
alpha = img.getchannel('A')
mask = alpha.point(lambda p: 255 if p > 50 else 0)

# Bottom left region roughly covers the nav icons and decor
comps = get_components((0, 680, 950, 1024), mask)

# Merge nearby components in this region with distance=5
def merge(comps, dist):
    changed = True
    while changed:
        changed = False
        res = []
        used = [False] * len(comps)
        for i, c in enumerate(comps):
            if used[i]: continue
            used[i] = True
            merged = c
            local_changed = True
            while local_changed:
                local_changed = False
                for j, c2 in enumerate(comps):
                    if used[j]: continue
                    if not (merged[2] + dist < c2[0] or c2[2] + dist < merged[0] or merged[3] + dist < c2[1] or c2[3] + dist < merged[1]):
                        merged = (min(merged[0], c2[0]), min(merged[1], c2[1]), max(merged[2], c2[2]), max(merged[3], c2[3]))
                        used[j] = True
                        local_changed = True
                        changed = True
            res.append(merged)
        comps = res
    return comps

comps = merge(comps, 5)
comps = [c for c in comps if (c[2]-c[0])*(c[3]-c[1]) > 100]
comps.sort(key=lambda b: (b[1], b[0]))

for i, c in enumerate(comps):
    print(f"Component {i}: x={c[0]}, y={c[1]}, w={c[2]-c[0]}, h={c[3]-c[1]}")
