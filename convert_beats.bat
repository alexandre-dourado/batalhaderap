@echo off
mkdir "public\beats" 2>nul

ffmpeg -y -i "beats\The Passion HiFi - Bittersweet.mp3" -c:a libopus -b:a 96k "public\beats\bittersweet.opus"
ffmpeg -y -i "beats\The Passion HiFi - Buried.mp3" -c:a libopus -b:a 96k "public\beats\buried.opus"
ffmpeg -y -i "beats\The Passion HiFi - Cold Heat.wav" -c:a libopus -b:a 96k "public\beats\cold-heat.opus"
ffmpeg -y -i "beats\The Passion HiFi - I Love U Baby.wav" -c:a libopus -b:a 96k "public\beats\i-love-u-baby.opus"
ffmpeg -y -i "beats\The Passion HiFi - Lab Classic.mp3" -c:a libopus -b:a 96k "public\beats\lab-classic.opus"
ffmpeg -y -i "beats\The Passion HiFi - Laws of Movement.wav" -c:a libopus -b:a 96k "public\beats\laws-of-movement.opus"
ffmpeg -y -i "beats\The Passion HiFi - Let The Bass Kick.mp3" -c:a libopus -b:a 96k "public\beats\let-the-bass-kick.opus"
ffmpeg -y -i "beats\The Passion HiFi - Like a Ho.mp3" -c:a libopus -b:a 96k "public\beats\like-a-ho.opus"
ffmpeg -y -i "beats\The Passion HiFi - My Obstacles.mp3" -c:a libopus -b:a 96k "public\beats\my-obstacles.opus"
ffmpeg -y -i "beats\The Passion HiFi - NARC.wav" -c:a libopus -b:a 96k "public\beats\narc.opus"
ffmpeg -y -i "beats\The Passion HiFi - Sense and Technique.mp3" -c:a libopus -b:a 96k "public\beats\sense-and-technique.opus"
ffmpeg -y -i "beats\The Passion HiFi - The Art of Soul.mp3" -c:a libopus -b:a 96k "public\beats\the-art-of-soul.opus"
ffmpeg -y -i "beats\The Passion HiFi - untouchable.mp3" -c:a libopus -b:a 96k "public\beats\untouchable.opus"
ffmpeg -y -i "beats\The Passion Hifi - Mo' Blues.mp3" -c:a libopus -b:a 96k "public\beats\mo-blues.opus"
ffmpeg -y -i "beats\the passion hifi - cynical plans.mp3" -c:a libopus -b:a 96k "public\beats\cynical-plans.opus"

echo.
echo ===== CONVERSAO CONCLUIDA =====
dir "public\beats"
