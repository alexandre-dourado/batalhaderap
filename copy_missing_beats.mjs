import fs from 'fs';
import path from 'path';

const beatsDir = 'public/beats';

const copies = [
  { srcPart: 'Cap', dstContains: 'versculo', dst: 'captulo4versculo3-instrumentalemvinil7v9hunkbsay.opus' },
  { srcPart: 'Chama os Mulekes', dstContains: 'chama', dst: 'chamaosmulekesinstrumental-conecrewdiretoria-oficial-udio-fullhd-rapconecrewdiretoriayoutube.opus' },
  { srcPart: 'Di', dstContains: 'dirio', dst: 'diriodeumdetento-instrumentalemvinilw-hnt5rgz4k.opus' },
  { srcPart: 'F', dstContains: 'frmula', dst: 'frmulamgicadapaz-instrumentalemviniliezk28qd8nu.opus' },
  { srcPart: 'Instrumental', dstContains: 'instrumentalbeat', dst: 'instrumentalbeat-racionais-pretozicaur7mrwhrou.opus' },
  { srcPart: 'INSTRUMENTAL', dstContains: 'marighella', dst: 'instrumentalmarighellamilfacesdeumhomemleal-racionais9szpl6ikobm.opus' },
  { srcPart: 'Racionais Mcs-', dstContains: 'vitima', dst: 'racionaismcs-avtimainstrumental6yzgh48gbhk.opus' },
];

const files = fs.readdirSync(beatsDir);

const srcMap = {
  'captulo4versculo3-instrumentalemvinil7v9hunkbsay.opus': files.find(f => f.includes('Vers') && f.includes('7v9HuNKBSaY')),
  'chamaosmulekesinstrumental-conecrewdiretoria-oficial-udio-fullhd-rapconecrewdiretoriayoutube.opus': files.find(f => f.includes('Mulekes')),
  'diriodeumdetento-instrumentalemvinilw-hnt5rgz4k.opus': files.find(f => f.includes('Detento')),
  'frmulamgicadapaz-instrumentalemviniliezk28qd8nu.opus': files.find(f => f.includes('rmula') || f.includes('ormula')),
  'instrumentalbeat-racionais-pretozicaur7mrwhrou.opus': files.find(f => f.includes('Preto Zica')),
  'instrumentalmarighellamilfacesdeumhomemleal-racionais9szpl6ikobm.opus': files.find(f => f.includes('Marighella')),
  'racionaismcs-avtimainstrumental6yzgh48gbhk.opus': files.find(f => f.includes('tima') && f.includes('6YZgH48gBHk')),
};

for (const [dst, src] of Object.entries(srcMap)) {
  if (!src) { console.error(`NOT FOUND for: ${dst}`); continue; }
  const srcPath = path.join(beatsDir, src);
  const dstPath = path.join(beatsDir, dst);
  if (fs.existsSync(dstPath)) { console.log(`SKIP (exists): ${dst}`); continue; }
  fs.copyFileSync(srcPath, dstPath);
  console.log(`OK: ${src} -> ${dst}`);
}
