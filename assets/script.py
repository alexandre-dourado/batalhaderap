#!/usr/bin/env python3
"""
BATALHA RAP — Asset Slicer

Recorta uma prancha de assets PNG/RGBA em arquivos individuais.

Recursos:
- detecção baseada em alpha
- remoção de áreas transparentes
- componentes conectados
- agrupamento de componentes próximos
- padding configurável
- tamanho mínimo configurável
- geração de contact sheet
- geração de manifest.json
- preservação de transparência
- nomes inicialmente automáticos
- possibilidade de fornecer bounding boxes manualmente

Uso:

    python scripts/slice_batalha_assets.py \
        --input public/assets/batalha-asset-sheet.png \
        --output public/assets/batalha \
        --padding 12

Para recortes manuais:

    python scripts/slice_batalha_assets.py \
        --input ... \
        --output ... \
        --boxes scripts/batalha_boxes.json
"""

from __future__ import annotations

import argparse
import json
import math
from pathlib import Path

from PIL import Image, ImageDraw


# ---------------------------------------------------------
# CONFIG
# ---------------------------------------------------------

DEFAULT_PADDING = 12
DEFAULT_MIN_AREA = 250
DEFAULT_ALPHA_THRESHOLD = 8

# Pequenos componentes próximos podem pertencer ao mesmo asset.
DEFAULT_MERGE_DISTANCE = 18


# ---------------------------------------------------------
# HELPERS
# ---------------------------------------------------------

def clamp(v, low, high):
    return max(low, min(v, high))


def expand_box(box, padding, width, height):
    x1, y1, x2, y2 = box

    return (
        clamp(x1 - padding, 0, width),
        clamp(y1 - padding, 0, height),
        clamp(x2 + padding, 0, width),
        clamp(y2 + padding, 0, height),
    )


def box_area(box):
    x1, y1, x2, y2 = box
    return max(0, x2 - x1) * max(0, y2 - y1)


def boxes_touch_or_near(a, b, distance):
    ax1, ay1, ax2, ay2 = a
    bx1, by1, bx2, by2 = b

    return not (
        ax2 + distance < bx1
        or bx2 + distance < ax1
        or ay2 + distance < by1
        or by2 + distance < ay1
    )


def merge_boxes(a, b):
    return (
        min(a[0], b[0]),
        min(a[1], b[1]),
        max(a[2], b[2]),
        max(a[3], b[3]),
    )


def merge_nearby_boxes(boxes, distance):
    """
    Union-find simplificado.
    Une bounding boxes que estejam muito próximas.
    """

    boxes = list(boxes)

    changed = True

    while changed:
        changed = False
        result = []
        used = [False] * len(boxes)

        for i, current in enumerate(boxes):
            if used[i]:
                continue

            merged = current
            used[i] = True

            local_changed = True

            while local_changed:
                local_changed = False

                for j, candidate in enumerate(boxes):
                    if used[j]:
                        continue

                    if boxes_touch_or_near(
                        merged,
                        candidate,
                        distance
                    ):
                        merged = merge_boxes(merged, candidate)
                        used[j] = True
                        local_changed = True
                        changed = True

            result.append(merged)

        boxes = result

    return boxes


# ---------------------------------------------------------
# AUTOMATIC DETECTION
# ---------------------------------------------------------

def detect_components(image, alpha_threshold, min_area):
    """
    Detecta regiões não transparentes.

    Não utiliza cor para separar assets.
    Isso é importante porque os assets compartilham
    exatamente a mesma paleta.
    """

    alpha = image.getchannel("A")

    # Converte alpha em máscara binária.
    mask = alpha.point(
        lambda p: 255 if p >= alpha_threshold else 0
    )

    # bbox global
    global_bbox = mask.getbbox()

    if not global_bbox:
        return []

    # Usa connected components simples via flood fill.
    # Implementação sem OpenCV para manter dependências mínimas.
    pixels = mask.load()
    width, height = mask.size

    visited = bytearray(width * height)

    components = []

    for y in range(height):
        for x in range(width):

            index = y * width + x

            if visited[index]:
                continue

            if pixels[x, y] == 0:
                visited[index] = 1
                continue

            # BFS
            stack = [(x, y)]
            visited[index] = 1

            min_x = max_x = x
            min_y = max_y = y
            area = 0

            while stack:
                cx, cy = stack.pop()
                area += 1

                min_x = min(min_x, cx)
                max_x = max(max_x, cx)
                min_y = min(min_y, cy)
                max_y = max(max_y, cy)

                neighbors = (
                    (cx - 1, cy),
                    (cx + 1, cy),
                    (cx, cy - 1),
                    (cx, cy + 1),
                )

                for nx, ny in neighbors:

                    if nx < 0 or nx >= width:
                        continue

                    if ny < 0 or ny >= height:
                        continue

                    nindex = ny * width + nx

                    if visited[nindex]:
                        continue

                    visited[nindex] = 1

                    if pixels[nx, ny] > 0:
                        stack.append((nx, ny))

            if area >= min_area:
                components.append(
                    (min_x, min_y, max_x + 1, max_y + 1)
                )

    return components


# ---------------------------------------------------------
# MANUAL BOXES
# ---------------------------------------------------------

def load_manual_boxes(path):
    if not path:
        return None

    with open(path, "r", encoding="utf-8") as f:
        data = json.load(f)

    return data["boxes"]


# ---------------------------------------------------------
# ASSET EXPORT
# ---------------------------------------------------------

def export_assets(
    image,
    boxes,
    output_dir,
    padding,
):
    output_dir.mkdir(parents=True, exist_ok=True)

    width, height = image.size

    manifest = []

    for index, box in enumerate(boxes, start=1):

        expanded = expand_box(
            box,
            padding,
            width,
            height
        )

        crop = image.crop(expanded)

        filename = f"asset-{index:03d}.png"
        filepath = output_dir / filename

        crop.save(
            filepath,
            format="PNG",
            optimize=True
        )

        manifest.append({
            "id": f"asset-{index:03d}",
            "file": filename,
            "bbox": {
                "x": expanded[0],
                "y": expanded[1],
                "width": expanded[2] - expanded[0],
                "height": expanded[3] - expanded[1]
            },
            "source_bbox": {
                "x": box[0],
                "y": box[1],
                "width": box[2] - box[0],
                "height": box[3] - box[1]
            }
        })

    return manifest


# ---------------------------------------------------------
# CONTACT SHEET
# ---------------------------------------------------------

def generate_contact_sheet(
    output_dir,
    manifest,
    thumb_size=220,
):
    assets = []

    for item in manifest:

        path = output_dir / item["file"]

        if not path.exists():
            continue

        im = Image.open(path).convert("RGBA")
        im.thumbnail((thumb_size, thumb_size))

        assets.append(
            (item["id"], im.copy())
        )

    if not assets:
        return

    columns = 5
    rows = math.ceil(len(assets) / columns)

    cell_w = thumb_size + 30
    cell_h = thumb_size + 60

    sheet = Image.new(
        "RGBA",
        (
            columns * cell_w,
            rows * cell_h
        ),
        (25, 25, 25, 255)
    )

    draw = ImageDraw.Draw(sheet)

    for i, (asset_id, im) in enumerate(assets):

        col = i % columns
        row = i // columns

        x = col * cell_w
        y = row * cell_h

        # checkerboard-ish transparency indicator
        sheet.alpha_composite(
            im,
            (
                x + (cell_w - im.width) // 2,
                y + 8
            )
        )

        draw.text(
            (
                x + 10,
                y + thumb_size + 15
            ),
            asset_id,
            fill="white"
        )

    sheet.save(
        output_dir / "CONTACT-SHEET.png"
    )


# ---------------------------------------------------------
# MAIN
# ---------------------------------------------------------

def main():

    parser = argparse.ArgumentParser()

    parser.add_argument(
        "--input",
        required=True
    )

    parser.add_argument(
        "--output",
        required=True
    )

    parser.add_argument(
        "--padding",
        type=int,
        default=DEFAULT_PADDING
    )

    parser.add_argument(
        "--min-area",
        type=int,
        default=DEFAULT_MIN_AREA
    )

    parser.add_argument(
        "--alpha-threshold",
        type=int,
        default=DEFAULT_ALPHA_THRESHOLD
    )

    parser.add_argument(
        "--merge-distance",
        type=int,
        default=DEFAULT_MERGE_DISTANCE
    )

    parser.add_argument(
        "--boxes",
        default=None
    )

    args = parser.parse_args()

    input_path = Path(args.input)
    output_dir = Path(args.output)

    print()
    print("BATALHA RAP — ASSET SLICER")
    print("=" * 50)

    print(f"Input:  {input_path}")
    print(f"Output: {output_dir}")

    image = Image.open(input_path).convert("RGBA")

    print(f"Image:  {image.width}x{image.height}")

    manual_boxes = load_manual_boxes(args.boxes)

    if manual_boxes:

        print(
            f"Using {len(manual_boxes)} manual bounding boxes."
        )

        boxes = [
            (
                b["x"],
                b["y"],
                b["x"] + b["width"],
                b["y"] + b["height"]
            )
            for b in manual_boxes
        ]

    else:

        print("Detecting visual components...")

        boxes = detect_components(
            image,
            args.alpha_threshold,
            args.min_area
        )

        print(
            f"Detected components: {len(boxes)}"
        )

        print(
            "Merging nearby components..."
        )

        boxes = merge_nearby_boxes(
            boxes,
            args.merge_distance
        )

        print(
            f"After merging: {len(boxes)}"
        )

    # Ordena visualmente:
    # primeiro por Y, depois por X.
    boxes.sort(
        key=lambda b: (
            b[1],
            b[0]
        )
    )

    manifest = export_assets(
        image,
        boxes,
        output_dir,
        args.padding
    )

    manifest_path = output_dir / "manifest.json"

    with open(
        manifest_path,
        "w",
        encoding="utf-8"
    ) as f:

        json.dump(
            {
                "source": str(input_path),
                "canvas": {
                    "width": image.width,
                    "height": image.height
                },
                "asset_count": len(manifest),
                "assets": manifest
            },
            f,
            indent=2,
            ensure_ascii=False
        )

    generate_contact_sheet(
        output_dir,
        manifest
    )

    print()
    print("=" * 50)
    print(f"Exported {len(manifest)} assets.")
    print(f"Manifest: {manifest_path}")
    print(f"Preview:  {output_dir / 'CONTACT-SHEET.png'}")
    print("=" * 50)
    print()


if __name__ == "__main__":
    main()