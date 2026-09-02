from PIL import Image
import os

os.makedirs('public/assets', exist_ok=True)
os.makedirs('public/assets/batalha/icons', exist_ok=True)
os.makedirs('public/assets/batalha/navigation', exist_ok=True)

img = Image.open('assets/assets.png').convert('RGBA')

assets = {
    # Main
    'logo-batalha.png': (1, 0, 629, 357),
    'icon-512.png': (630, 14, 945, 323),
    'icon-192.png': (942, 89, 1153, 309),
    'texture-halftone.png': (1200, 11, 1525, 332),
    'og-image.png': (11, 342, 867, 693),
    
    # Icons - Row 1
    'batalha/icons/icon-play.png': (864, 340, 1033, 531),
    'batalha/icons/icon-pause.png': (1028, 332, 1198, 527),
    'batalha/icons/icon-stop.png': (1192, 336, 1364, 533),
    'batalha/icons/icon-swap.png': (1356, 328, 1531, 525),
    
    # Icons - Row 2
    'batalha/icons/icon-dice.png': (863, 518, 1033, 701),
    'batalha/icons/icon-switch-mc.png': (1027, 522, 1199, 701),
    'batalha/icons/icon-judge.png': (1190, 524, 1365, 703),
    'batalha/icons/icon-check.png': (1357, 513, 1526, 711),
    
    # Nav Icons (Manual boxes to avoid merge)
    'batalha/navigation/icon-arrow-left.png': (12, 690, 185, 800),
    'batalha/navigation/icon-screen.png': (195, 690, 350, 800),
    'batalha/navigation/icon-vinyl.png': (360, 690, 530, 800)
}

for name, box in assets.items():
    cropped = img.crop(box)
    
    # Auto-trim transparent borders
    alpha = cropped.split()[-1]
    bbox = alpha.getbbox()
    if bbox:
        cropped = cropped.crop(bbox)
        
    cropped.save(f'public/assets/{name}', format='PNG')
    print(f'Exported {name}')

print('All assets extracted!')
