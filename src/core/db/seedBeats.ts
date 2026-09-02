import { db } from './db';

const FACTORY_BEATS = [
  { id: "factory_beat_1", name: "$ERODEGREE$ - Psychopath (Official AMV) [jqkK1YOJgpY]", file: "/beats/$ERODEGREE$ - Psychopath (Official AMV) [jqkK1YOJgpY].opus" },
  { id: "factory_beat_2", name: "(FREE) Moneybagg Yo Type Beat \uff02Zero\uff02 [sq3vZqwd09s]", file: "/beats/(FREE) Moneybagg Yo Type Beat ＂Zero＂ [sq3vZqwd09s].opus" },
  { id: "factory_beat_3", name: "BEAT GR\u00c1TIS  -- Beat  Racionais Detroit  Prod  TGL 2 [Up98hDnMC54]", file: "/beats/BEAT GRÁTIS  -- Beat  Racionais Detroit  Prod  TGL 2 [Up98hDnMC54].opus" },
  { id: "factory_beat_4", name: "BEAT GR\u00c1TIS - Batida tipo mel\u00f3dica - \uff02FEEL MY PAIN\uff02 \uff5c Rap Trap Beat Instrumental [cPXLHi9HaxQ]", file: "/beats/BEAT GRÁTIS - Batida tipo melódica - ＂FEEL MY PAIN＂ ｜ Rap Trap Beat Instrumental [cPXLHi9HaxQ].opus" },
  { id: "factory_beat_5", name: "BEAT GR\u00c1TIS - Freestyle Boom Bap [oP6uWgHCeDg]", file: "/beats/BEAT GRÁTIS - Freestyle Boom Bap [oP6uWgHCeDg].opus" },
  { id: "factory_beat_6", name: "BEAT GR\u00c1TIS - Orochi x Kevin o Chris x Funk - Type Beat - \uff02Perigos Noturnos\uff02 (Prod. LuSeven) [8eQMmN08QDw]", file: "/beats/BEAT GRÁTIS - Orochi x Kevin o Chris x Funk - Type Beat - ＂Perigos Noturnos＂ (Prod. LuSeven) [8eQMmN08QDw].opus" },
  { id: "factory_beat_7", name: "BEAT GR\u00c1TIS TRAP - tipo mel\u00f3dica GRATUITA PARA LUCRO - \uff02Over Thinking\uff02 [l_P255PZzWM]", file: "/beats/BEAT GRÁTIS TRAP - tipo melódica GRATUITA PARA LUCRO - ＂Over Thinking＂ [l_P255PZzWM].opus" },
  { id: "factory_beat_8", name: "BEAT GR\u00c1TIS ] Batida tipo mel\u00f3dica - \uff02ADDICTED\uff02 \uff5c Batida do tipo escuro \uff5c Rap Trap Beat Instrumental [rVRi0kqS7fo]", file: "/beats/BEAT GRÁTIS ] Batida tipo melódica - ＂ADDICTED＂ ｜ Batida do tipo escuro ｜ Rap Trap Beat Instrumental [rVRi0kqS7fo].opus" },
  { id: "factory_beat_9", name: "BEAT RAP GR\u00c1TIS BOOM BAP  Misunderstood  HIP HOP FREE USE   USO LIBRE [xzzPsYEvs7E]", file: "/beats/BEAT RAP GRÁTIS BOOM BAP  Misunderstood  HIP HOP FREE USE   USO LIBRE [xzzPsYEvs7E].opus" },
  { id: "factory_beat_10", name: "Base Gueto - Beat Tipo Racionais Mc's - Instrumental ( Uso Livre ) [EHU20fbJyOk]", file: "/beats/Base Gueto - Beat Tipo Racionais Mc's - Instrumental ( Uso Livre ) [EHU20fbJyOk].opus" },
  { id: "factory_beat_11", name: "Beat Boombap [NYs-ri4P7V0]", file: "/beats/Beat Boombap [NYs-ri4P7V0].opus" },
  { id: "factory_beat_12", name: "Beat Gr\u00e1tis - \uff02Conception\uff02 - Matu\u00ea x Mateca x Wiu Type Beat Gr\u00e1tis \uff5c Prod.dazz [Gy8cf8tgXEc]", file: "/beats/Beat Grátis - ＂Conception＂ - Matuê x Mateca x Wiu Type Beat Grátis ｜ Prod.dazz [Gy8cf8tgXEc].opus" },
  { id: "factory_beat_13", name: "Beat Gr\u00e1tis - \uff02FLOW DOMINANT\uff02 \uff5c Free Type Beat 2021 Gr\u00e1tis \uff5c Hard Fast Rap Trap Beat Instrumental [uzBmdT-hOL0]", file: "/beats/Beat Grátis - ＂FLOW DOMINANT＂ ｜ Free Type Beat 2021 Grátis ｜ Hard Fast Rap Trap Beat Instrumental [uzBmdT-hOL0].opus" },
  { id: "factory_beat_14", name: "Beat Gr\u00e1tis [FREE] Cabelinho x Teto x Mc Poze Do Rodo - Type Beat Quebrada [Prod. @mrknobeat] [IycoJEKNLHA]", file: "/beats/Beat Grátis [FREE] Cabelinho x Teto x Mc Poze Do Rodo - Type Beat Quebrada [Prod. @mrknobeat] [IycoJEKNLHA].opus" },
  { id: "factory_beat_15", name: "Beat Gr\u00e1tis [FREE] Mc Poze do Rodo x Mc Cabelinho x Orochi Type Beat \uff02Rio\uff02 (Prod. Neytxn x Fepache) [sSngDZtqN6U]", file: "/beats/Beat Grátis [FREE] Mc Poze do Rodo x Mc Cabelinho x Orochi Type Beat ＂Rio＂ (Prod. Neytxn x Fepache) [sSngDZtqN6U].opus" },
  { id: "factory_beat_16", name: "Beat Instrumental #84 [5niGTgjO3zo]", file: "/beats/Beat Instrumental #84 [5niGTgjO3zo].opus" },
  { id: "factory_beat_17", name: "Beat Instrumental - BDA Batalha da Aldeia #12 [DbRNfYWr2Ko]", file: "/beats/Beat Instrumental - BDA Batalha da Aldeia #12 [DbRNfYWr2Ko].opus" },
  { id: "factory_beat_18", name: "Beat Instrumental - BDA Batalha da Aldeia #22 [ri1n5iS46cA]", file: "/beats/Beat Instrumental - BDA Batalha da Aldeia #22 [ri1n5iS46cA].opus" },
  { id: "factory_beat_19", name: "Beat Instrumental - BDA Batalha da Aldeia #31 [cdZGte4Lpbc]", file: "/beats/Beat Instrumental - BDA Batalha da Aldeia #31 [cdZGte4Lpbc].opus" },
  { id: "factory_beat_20", name: "Beat Instrumental - BDA Batalha da Aldeia #36 [VTQ5batiUP0]", file: "/beats/Beat Instrumental - BDA Batalha da Aldeia #36 [VTQ5batiUP0].opus" },
  { id: "factory_beat_21", name: "Beat Instrumental - BDA Batalha da Aldeia #41 [k7Nrt7ntJu4]", file: "/beats/Beat Instrumental - BDA Batalha da Aldeia #41 [k7Nrt7ntJu4].opus" },
  { id: "factory_beat_22", name: "Beat Instrumental - Batalha do Coliseu #34 [KYfR5a8HZlY]", file: "/beats/Beat Instrumental - Batalha do Coliseu #34 [KYfR5a8HZlY].opus" },
  { id: "factory_beat_23", name: "Beat Instrumental - Batalha do Coliseu #37 [DPUCozVXT6A]", file: "/beats/Beat Instrumental - Batalha do Coliseu #37 [DPUCozVXT6A].opus" },
  { id: "factory_beat_24", name: "Beat Instrumental - Batalha do Museu #20 [BoGYVgzLz3Y]", file: "/beats/Beat Instrumental - Batalha do Museu #20 [BoGYVgzLz3Y].opus" },
  { id: "factory_beat_25", name: "Beat Instrumental - Batalha do Museu #24 [alW5AdtL-Hk]", file: "/beats/Beat Instrumental - Batalha do Museu #24 [alW5AdtL-Hk].opus" },
  { id: "factory_beat_26", name: "Beat Instrumental - Batalha do Museu #39 [nTU5QjjHaAU]", file: "/beats/Beat Instrumental - Batalha do Museu #39 [nTU5QjjHaAU].opus" },
  { id: "factory_beat_27", name: "Beat Instrumental - Batalha do Museu #43 [VsygfNkPZ7Q]", file: "/beats/Beat Instrumental - Batalha do Museu #43 [VsygfNkPZ7Q].opus" },
  { id: "factory_beat_28", name: "Beat Instrumental - Batalha do Tanque #21 [A0UWrCQyHWw]", file: "/beats/Beat Instrumental - Batalha do Tanque #21 [A0UWrCQyHWw].opus" },
  { id: "factory_beat_29", name: "Beat Instrumental - Batalha do Tanque #27 [U5Xf1nRRVZo]", file: "/beats/Beat Instrumental - Batalha do Tanque #27 [U5Xf1nRRVZo].opus" },
  { id: "factory_beat_30", name: "Beat Instrumental - Batalha do tanque #23 [Bbdvr2aWnrc]", file: "/beats/Beat Instrumental - Batalha do tanque #23 [Bbdvr2aWnrc].opus" },
  { id: "factory_beat_31", name: "Beat Instrumental - Duelo de MC's fam\u00edlia de rua #11 [Nn_c8tXftrk]", file: "/beats/Beat Instrumental - Duelo de MC's família de rua #11 [Nn_c8tXftrk].opus" },
  { id: "factory_beat_32", name: "Beat Instrumental - Duelo de MC's\ud83d\udd25Fam\u00edlia de Rua - Nacional #30 [9C4FwxX4pYE]", file: "/beats/Beat Instrumental - Duelo de MC's🔥Família de Rua - Nacional #30 [9C4FwxX4pYE].opus" },
  { id: "factory_beat_33", name: "Beat Trap [pBu78msyInM]", file: "/beats/Beat Trap [pBu78msyInM].opus" },
  { id: "factory_beat_34", name: "Beat de Boombap [ay4RTNjeFEE]", file: "/beats/Beat de Boombap [ay4RTNjeFEE].opus" },
  { id: "factory_beat_35", name: "Beat de Funk [j56BiCztdiA]", file: "/beats/Beat de Funk [j56BiCztdiA].opus" },
  { id: "factory_beat_36", name: "Beat de Rap Gr\u00e1tis, Boom Bap Instrumental     BEEP    Uso Livre! [N5Mo863xpeg]", file: "/beats/Beat de Rap Grátis, Boom Bap Instrumental     BEEP    Uso Livre! [N5Mo863xpeg].opus" },
  { id: "factory_beat_37", name: "Beat de TRAP Gr\u00e1tis (FREE) Matu\u00ea x Leozin x Teto Type Beat - \uff02Space\uff02 - All Beats Free - BEATHIT [utKPXAcJUsc]", file: "/beats/Beat de TRAP Grátis (FREE) Matuê x Leozin x Teto Type Beat - ＂Space＂ - All Beats Free - BEATHIT [utKPXAcJUsc].opus" },
  { id: "factory_beat_38", name: "Beat de TRAP Gr\u00e1tis (FREE) Matu\u00ea x Teto x Doode x Reid Type Beat - Conex\u00f5es - All Beats Free BEATHIT [YhP27b7k6SU]", file: "/beats/Beat de TRAP Grátis (FREE) Matuê x Teto x Doode x Reid Type Beat - Conexões - All Beats Free BEATHIT [YhP27b7k6SU].opus" },
  { id: "factory_beat_39", name: "Beat de TRAP Gr\u00e1tis (FREE) Matu\u00ea x Teto x Doode x Reid Type Beat - Groupies - All Beats Free BEATHIT [DxlXO-B5o8I]", file: "/beats/Beat de TRAP Grátis (FREE) Matuê x Teto x Doode x Reid Type Beat - Groupies - All Beats Free BEATHIT [DxlXO-B5o8I].opus" },
  { id: "factory_beat_40", name: "Beat de TRAP Gr\u00e1tis (FREE) Matu\u00ea x Teto x Doode x Reid Type Beat - \uff02Distante\uff02 - AllBeatsFree BEATHIT [UULQDWmvfzU]", file: "/beats/Beat de TRAP Grátis (FREE) Matuê x Teto x Doode x Reid Type Beat - ＂Distante＂ - AllBeatsFree BEATHIT [UULQDWmvfzU].opus" },
  { id: "factory_beat_41", name: "Beat de TRAP Gr\u00e1tis (FREE) Matu\u00ea x Teto x Doode x Reid Type Beat - \uff02Safari\uff02 - All Beats Free BEATHIT [mJcDKZP0O7g]", file: "/beats/Beat de TRAP Grátis (FREE) Matuê x Teto x Doode x Reid Type Beat - ＂Safari＂ - All Beats Free BEATHIT [mJcDKZP0O7g].opus" },
  { id: "factory_beat_42", name: "Beat de TRAP Gr\u00e1tis (FREE) Matu\u00ea x Teto x Doode x Reid Type Beat - \uff02\u00c9 Sal\uff02 - All Beats Free BEATHIT [SA7-1DZCpJM]", file: "/beats/Beat de TRAP Grátis (FREE) Matuê x Teto x Doode x Reid Type Beat - ＂É Sal＂ - All Beats Free BEATHIT [SA7-1DZCpJM].opus" },
  { id: "factory_beat_43", name: "Beat de Trap Gr\u00e1tis (FREE) MC KEVIN X MC PH X MC POZE TYPE BEAT ~ CROCODILO [cEJ39fvZkGY]", file: "/beats/Beat de Trap Grátis (FREE) MC KEVIN X MC PH X MC POZE TYPE BEAT ~ CROCODILO [cEJ39fvZkGY].opus" },
  { id: "factory_beat_44", name: "Beat de Trap Gr\u00e1tis (FREE) Mc Cabelinho x MC Poze do Rodo Type Beat [801wVaLuZmM]", file: "/beats/Beat de Trap Grátis (FREE) Mc Cabelinho x MC Poze do Rodo Type Beat [801wVaLuZmM].opus" },
  { id: "factory_beat_45", name: "Beat de Trap Gr\u00e1tis (FREE) Yunk Vino x Teto x KayBlack Type Beat 'Paz Terr\u00edvel' (Prod. PEDRINN) [95ITLpqoYrE]", file: "/beats/Beat de Trap Grátis (FREE) Yunk Vino x Teto x KayBlack Type Beat 'Paz Terrível' (Prod. PEDRINN) [95ITLpqoYrE].opus" },
  { id: "factory_beat_46", name: "Beat de Trap Gr\u00e1tis - Type Beat Estilo Mc Poze do Rodo x Tz da Coronel x PL Quest Beat Free [ebGjWwXUv_Y]", file: "/beats/Beat de Trap Grátis - Type Beat Estilo Mc Poze do Rodo x Tz da Coronel x PL Quest Beat Free [ebGjWwXUv_Y].opus" },
  { id: "factory_beat_47", name: "Beat de Trap Gr\u00e1tis - [FREE] ''Opps'' HARD Trap Beat 2021 -FreeTrap Rap Instrumental Beat 2021 [5eNZHHzQKX4]", file: "/beats/Beat de Trap Grátis - [FREE] ''Opps'' HARD Trap Beat 2021 -FreeTrap Rap Instrumental Beat 2021 [5eNZHHzQKX4].opus" },
  { id: "factory_beat_48", name: "Beat de Trap Gr\u00e1tis - [FREE] (HARD) Lil Durk x Lil Baby Type Beat - \uff02Link Up\uff02 - Free Trap Type Beats [-kdagE-OtMs]", file: "/beats/Beat de Trap Grátis - [FREE] (HARD) Lil Durk x Lil Baby Type Beat - ＂Link Up＂ - Free Trap Type Beats [-kdagE-OtMs].opus" },
  { id: "factory_beat_49", name: "Beat de Trap Gr\u00e1tis - [FREE] Lil Baby x Quavo Type Beat '700' Free Trap Beats 2021 - Rap\u29f8Trap [F3Yra8O6DMw]", file: "/beats/Beat de Trap Grátis - [FREE] Lil Baby x Quavo Type Beat '700' Free Trap Beats 2021 - Rap⧸Trap [F3Yra8O6DMw].opus" },
  { id: "factory_beat_50", name: "Beat de Trap Gr\u00e1tis FREE-GRATUITO - \ud83d\udc0a Trap beat type Lyvinte x Teto x Brand\u00e3o (@LZ11N) \ud83d\udd25 [n7r_9bgWiLk]", file: "/beats/Beat de Trap Grátis FREE-GRATUITO - 🐊 Trap beat type Lyvinte x Teto x Brandão (@LZ11N) 🔥 [n7r_9bgWiLk].opus" },
  { id: "factory_beat_51", name: "Beat de Trap Gr\u00e1tis [FREE] MC Poze do Rodo x MC Cabelinho Type beat Trap Funk A cara do Crime 2 [_kiPETluAAo]", file: "/beats/Beat de Trap Grátis [FREE] MC Poze do Rodo x MC Cabelinho Type beat Trap Funk A cara do Crime 2 [_kiPETluAAo].opus" },
  { id: "factory_beat_52", name: "Beat de Trap Gr\u00e1tis [FREE] TZ da Coronel x 2T x MD Chefe type beat - Mandela (Prod. Hawk) [Boy76a4mOes]", file: "/beats/Beat de Trap Grátis [FREE] TZ da Coronel x 2T x MD Chefe type beat - Mandela (Prod. Hawk) [Boy76a4mOes].opus" },
  { id: "factory_beat_53", name: "Beat de Trap Gr\u00e1tis [FREE] Tz da Coronel X 2T X Sueth Type beat - \uff02Faixa Preta\uff02 [kc3iLMDfJCI]", file: "/beats/Beat de Trap Grátis [FREE] Tz da Coronel X 2T X Sueth Type beat - ＂Faixa Preta＂ [kc3iLMDfJCI].opus" },
  { id: "factory_beat_54", name: "Beat de Trap [8A5-X5QLHJ4]", file: "/beats/Beat de Trap [8A5-X5QLHJ4].opus" },
  { id: "factory_beat_55", name: "Beat de Trap [MroGNTF7O4g]", file: "/beats/Beat de Trap [MroGNTF7O4g].opus" },
  { id: "factory_beat_56", name: "Beat de Trap [pqyJhEU4rgQ]", file: "/beats/Beat de Trap [pqyJhEU4rgQ].opus" },
  { id: "factory_beat_57", name: "Beat de Trap [tostIYaY6_Y]", file: "/beats/Beat de Trap [tostIYaY6_Y].opus" },
  { id: "factory_beat_58", name: "Beat gr\u00e1tis - Thxuzz x TOKIODK x LEALL Drill Type Beat - \uff02Block\uff02 (prod. Skinny) [B7mWCvV-71U]", file: "/beats/Beat grátis - Thxuzz x TOKIODK x LEALL Drill Type Beat - ＂Block＂ (prod. Skinny) [B7mWCvV-71U].opus" },
  { id: "factory_beat_59", name: "Beat instrumental - BDA Batalha da Aldeia #3 [7cw0xqVw4lg]", file: "/beats/Beat instrumental - BDA Batalha da Aldeia #3 [7cw0xqVw4lg].opus" },
  { id: "factory_beat_60", name: "Beat instrumental - BDA Batalha da Aldeia #4 [2dcYGYCjICo]", file: "/beats/Beat instrumental - BDA Batalha da Aldeia #4 [2dcYGYCjICo].opus" },
  { id: "factory_beat_61", name: "Beat instrumental - BDA Batalha da Aldeia #5 [c3ur6dIhiJM]", file: "/beats/Beat instrumental - BDA Batalha da Aldeia #5 [c3ur6dIhiJM].opus" },
  { id: "factory_beat_62", name: "Beat instrumental - BDA Batalha da Aldeia #8 [ObVMBHSRWV4]", file: "/beats/Beat instrumental - BDA Batalha da Aldeia #8 [ObVMBHSRWV4].opus" },
  { id: "factory_beat_63", name: "Beat instrumental - Batalha do Coliseu\u29f8Rel\u00f3gio\u29f8Museu #55 [hmovs1ZoA0M]", file: "/beats/Beat instrumental - Batalha do Coliseu⧸Relógio⧸Museu #55 [hmovs1ZoA0M].opus" },
  { id: "factory_beat_64", name: "Beat instrumental - Batalha do Estudante #48 [lSf9PU2gVLc]", file: "/beats/Beat instrumental - Batalha do Estudante #48 [lSf9PU2gVLc].opus" },
  { id: "factory_beat_65", name: "Beat instrumental - Duelo de MC's \ud83d\udd25 fam\u00edlia de rua #10 [A25BqAvac-c]", file: "/beats/Beat instrumental - Duelo de MC's 🔥 família de rua #10 [A25BqAvac-c].opus" },
  { id: "factory_beat_66", name: "Beat instrumental - Fam\u00edlia de rua\ud83d\udd25Duelo de MC's  #50 [jG7fyJQnHiE]", file: "/beats/Beat instrumental - Família de rua🔥Duelo de MC's  #50 [jG7fyJQnHiE].opus" },
  { id: "factory_beat_67", name: "Cap\u00edtulo 4, Vers\u00edculo 3 - Instrumental em Vinil [7v9HuNKBSaY]", file: "/beats/Capítulo 4, Versículo 3 - Instrumental em Vinil [7v9HuNKBSaY].opus" },
  { id: "factory_beat_68", name: "Chama os Mulekes [ INSTRUMENTAL ] - CONE CREW DIRETORIA - [ OFICIAL ] - [ \u00c1UDIO ] - [ FULL HD ] - Rap Cone Crew Diretoria (youtube)", file: "/beats/Chama os Mulekes [ INSTRUMENTAL ] - CONE CREW DIRETORIA - [ OFICIAL ] - [ ÁUDIO ] - [ FULL HD ] - Rap Cone Crew Diretoria (youtube).opus" },
  { id: "factory_beat_69", name: "Crime Vai e Vem - Instrumental em Vinil [1jG6KUEhstE]", file: "/beats/Crime Vai e Vem - Instrumental em Vinil [1jG6KUEhstE].opus" },
  { id: "factory_beat_70", name: "Di\u00e1rio de um Detento - Instrumental em Vinil [w-hNt5rgZ4k]", file: "/beats/Diário de um Detento - Instrumental em Vinil [w-hNt5rgZ4k].opus" },
  { id: "factory_beat_71", name: "Expresso da Meia Noite - Instrumental em Vinil [qr99texOjx4]", file: "/beats/Expresso da Meia Noite - Instrumental em Vinil [qr99texOjx4].opus" },
  { id: "factory_beat_72", name: "FREE \uff5c Hard Trap Beat \uff02Hyped\uff02 (Prod. PQNO) [X-ze2O2dXTQ]", file: "/beats/FREE ｜ Hard Trap Beat ＂Hyped＂ (Prod. PQNO) [X-ze2O2dXTQ].opus" },
  { id: "factory_beat_73", name: "F\u00f3rmula M\u00e1gica da Paz - Instrumental em Vinil [iEZK28Qd8nU]", file: "/beats/Fórmula Mágica da Paz - Instrumental em Vinil [iEZK28Qd8nU].opus" },
  { id: "factory_beat_74", name: "Gangsta's Paradise (Instrumental) - 916ej (youtube)", file: "/beats/Gangsta's Paradise (Instrumental) - 916ej (youtube).opus" },
  { id: "factory_beat_75", name: "INSTRUMENTAL \uff5c Marighella (Mil Faces De Um Homem Leal) - Racionais [9szPl6IKoBM]", file: "/beats/INSTRUMENTAL ｜ Marighella (Mil Faces De Um Homem Leal) - Racionais [9szPl6IKoBM].opus" },
  { id: "factory_beat_76", name: "Instrumental \u29f8 Beat - Racionais - Preto Zica [U_r7MrWHRoU]", file: "/beats/Instrumental ⧸ Beat - Racionais - Preto Zica [U_r7MrWHRoU].opus" },
  { id: "factory_beat_77", name: "Matu\u00ea Produzindo um Beat no FL Studio #matu\u00ea #flstudio #beat [vjTslyj4Mn4]", file: "/beats/Matuê Produzindo um Beat no FL Studio #matuê #flstudio #beat [vjTslyj4Mn4].opus" },
  { id: "factory_beat_78", name: "O Homem na Estrada - Instrumental em Vinil [XPmGb3PQ6Yw]", file: "/beats/O Homem na Estrada - Instrumental em Vinil [XPmGb3PQ6Yw].opus" },
  { id: "factory_beat_79", name: "Racionais Mcs- \uff02A V\u00edtima\uff02(instrumental) [6YZgH48gBHk]", file: "/beats/Racionais Mcs- ＂A Vítima＂(instrumental) [6YZgH48gBHk].opus" },
  { id: "factory_beat_80", name: "Racionais mcs vida loka parte 1 instrumental [hHc2BGwayQs]", file: "/beats/Racionais mcs vida loka parte 1 instrumental [hHc2BGwayQs].opus" },
  { id: "factory_beat_81", name: "Racionais mcs vida loka parte 2 instrumental [qv7FOKsQ6EE]", file: "/beats/Racionais mcs vida loka parte 2 instrumental [qv7FOKsQ6EE].opus" },
  { id: "factory_beat_82", name: "The Force - instrumental #7 - BDA 6 anos [88sRZsvbQJY]", file: "/beats/The Force - instrumental #7 - BDA 6 anos [88sRZsvbQJY].opus" },
  { id: "factory_beat_83", name: "The Passion HiFi - Bittersweet", file: "/beats/The Passion HiFi - Bittersweet.opus" },
  { id: "factory_beat_84", name: "The Passion HiFi - Buried", file: "/beats/The Passion HiFi - Buried.opus" },
  { id: "factory_beat_85", name: "The Passion HiFi - Cold Heat", file: "/beats/The Passion HiFi - Cold Heat.opus" },
  { id: "factory_beat_86", name: "The Passion HiFi - I Love U Baby", file: "/beats/The Passion HiFi - I Love U Baby.opus" },
  { id: "factory_beat_87", name: "The Passion HiFi - Lab Classic", file: "/beats/The Passion HiFi - Lab Classic.opus" },
  { id: "factory_beat_88", name: "The Passion HiFi - Laws of Movement", file: "/beats/The Passion HiFi - Laws of Movement.opus" },
  { id: "factory_beat_89", name: "The Passion HiFi - Let The Bass Kick", file: "/beats/The Passion HiFi - Let The Bass Kick.opus" },
  { id: "factory_beat_90", name: "The Passion HiFi - Like a Ho", file: "/beats/The Passion HiFi - Like a Ho.opus" },
  { id: "factory_beat_91", name: "The Passion HiFi - My Obstacles", file: "/beats/The Passion HiFi - My Obstacles.opus" },
  { id: "factory_beat_92", name: "The Passion HiFi - NARC", file: "/beats/The Passion HiFi - NARC.opus" },
  { id: "factory_beat_93", name: "The Passion HiFi - Sense and Technique", file: "/beats/The Passion HiFi - Sense and Technique.opus" },
  { id: "factory_beat_94", name: "The Passion HiFi - The Art of Soul", file: "/beats/The Passion HiFi - The Art of Soul.opus" },
  { id: "factory_beat_95", name: "The Passion HiFi - untouchable", file: "/beats/The Passion HiFi - untouchable.opus" },
  { id: "factory_beat_96", name: "The Passion Hifi - Mo' Blues", file: "/beats/The Passion Hifi - Mo' Blues.opus" },
  { id: "factory_beat_97", name: "[BEAT GR\u00c1TIS] Batida tipo mel\u00f3dica - \uff02GHOST TOWN\uff02 \uff5c Batida do tipo escuro \uff5c Rap Trap Instrumental [WexBall86Wo]", file: "/beats/[BEAT GRÁTIS] Batida tipo melódica - ＂GHOST TOWN＂ ｜ Batida do tipo escuro ｜ Rap Trap Instrumental [WexBall86Wo].opus" },
  { id: "factory_beat_98", name: "[Beat Batalha da Atl\u00e2ntica] Beat Dudu Vs JayA Luuck \uff5c Beat Dudu Vs Noventa [0YeMa08HqYg]", file: "/beats/[Beat Batalha da Atlântica] Beat Dudu Vs JayA Luuck ｜ Beat Dudu Vs Noventa [0YeMa08HqYg].opus" },
  { id: "factory_beat_99", name: "[FREE] '' Mud '' \uff5c HARD Trap Beat 2021 \uff5cTrap Beat Instrumental 2021 +FREEDL [J3rOu1fXeMg]", file: "/beats/[FREE] '' Mud '' ｜ HARD Trap Beat 2021 ｜Trap Beat Instrumental 2021 +FREEDL [J3rOu1fXeMg].opus" },
  { id: "factory_beat_100", name: "[FREE] '' Never Lackin ''\uff5c HARD Trap Beat 2021 \uff5cTrap Beat Instrumental 2021Type Beat +FREEDL [OCzU8p09bSw]", file: "/beats/[FREE] '' Never Lackin ''｜ HARD Trap Beat 2021 ｜Trap Beat Instrumental 2021Type Beat +FREEDL [OCzU8p09bSw].opus" },
  { id: "factory_beat_101", name: "[FREE] '' Packs ''\uff5cHARD Trap Beat 2021 \uff5cRap Instrumental 2021 +FREEDL [4AIpWSXYJXU]", file: "/beats/[FREE] '' Packs ''｜HARD Trap Beat 2021 ｜Rap Instrumental 2021 +FREEDL [4AIpWSXYJXU].opus" },
  { id: "factory_beat_102", name: "[FREE] '' Take Over ''\uff5c HARD Trap Beat 2021 \uff5cRap Instrumental 2021 +FREEDL [YmJ81lpyBWw]", file: "/beats/[FREE] '' Take Over ''｜ HARD Trap Beat 2021 ｜Rap Instrumental 2021 +FREEDL [YmJ81lpyBWw].opus" },
  { id: "factory_beat_103", name: "[FREE] ''Trench Dreams''\uff5c HARD Trap Beat 2021\uff5cRap Instrumental Beat 2021 + FREEDL [0o_63bj4I2U]", file: "/beats/[FREE] ''Trench Dreams''｜ HARD Trap Beat 2021｜Rap Instrumental Beat 2021 + FREEDL [0o_63bj4I2U].opus" },
  { id: "factory_beat_104", name: "[FREE] Coolio X UK Drill Type Beat - GANGSTER'S PARADISE  UK Drill Instrumental 2022 - Kezii (youtube)", file: "/beats/[FREE] Coolio X UK Drill Type Beat - GANGSTER'S PARADISE  UK Drill Instrumental 2022 - Kezii (youtube).opus" },
  { id: "factory_beat_105", name: "[FREE] Piano Type Beat - Gangsta's Paradise  Free Type Beat - D0 Production (youtube)", file: "/beats/[FREE] Piano Type Beat - Gangsta's Paradise  Free Type Beat - D0 Production (youtube).opus" },
  { id: "factory_beat_106", name: "bittersweet", file: "/beats/bittersweet.opus" },
  { id: "factory_beat_107", name: "buried", file: "/beats/buried.opus" },
  { id: "factory_beat_108", name: "cold-heat", file: "/beats/cold-heat.opus" },
  { id: "factory_beat_109", name: "cynical-plans", file: "/beats/cynical-plans.opus" },
  { id: "factory_beat_110", name: "i-love-u-baby", file: "/beats/i-love-u-baby.opus" },
  { id: "factory_beat_111", name: "lab-classic", file: "/beats/lab-classic.opus" },
  { id: "factory_beat_112", name: "laws-of-movement", file: "/beats/laws-of-movement.opus" },
  { id: "factory_beat_113", name: "let-the-bass-kick", file: "/beats/let-the-bass-kick.opus" },
  { id: "factory_beat_114", name: "like-a-ho", file: "/beats/like-a-ho.opus" },
  { id: "factory_beat_115", name: "mo-blues", file: "/beats/mo-blues.opus" },
  { id: "factory_beat_116", name: "my-obstacles", file: "/beats/my-obstacles.opus" },
  { id: "factory_beat_117", name: "narc", file: "/beats/narc.opus" },
  { id: "factory_beat_118", name: "racionais mc's jorge de capadocia instrumental [zj7jkhv-q_s]", file: "/beats/racionais mc's jorge de capadocia instrumental [zj7jkhv-q_s].opus" },
  { id: "factory_beat_119", name: "sense-and-technique", file: "/beats/sense-and-technique.opus" },
  { id: "factory_beat_120", name: "the passion hifi - cynical plans", file: "/beats/the passion hifi - cynical plans.opus" },
  { id: "factory_beat_121", name: "the-art-of-soul", file: "/beats/the-art-of-soul.opus" },
  { id: "factory_beat_122", name: "untouchable", file: "/beats/untouchable.opus" },
];

const SEED_KEY = 'batalha_factory_beats_v6';

export async function seedFactoryBeats(): Promise<void> {
  // Runs only once per device
  if (localStorage.getItem(SEED_KEY)) return;

  try {
    let seededCount = 0;
    for (const beat of FACTORY_BEATS) {
      const existing = await db.beats.get(beat.id);
      if (existing) continue;

      const encodedUrl = encodeURI(beat.file).replace(/#/g, '%23').replace(/\?/g, '%3F');
      const res = await fetch(encodedUrl);
      if (!res.ok) {
        console.warn(`[BATALHA] Beat não encontrado: ${beat.file}`);
        continue;
      }

      const blob = await res.blob();
      await db.beats.add({
        id: beat.id,
        name: beat.name,
        filename: beat.file,
        duration: 0,
        createdAt: Date.now(),
        audioData: blob,
      });
      seededCount++;
    }

    if (seededCount > 0 || FACTORY_BEATS.length === 0) {
      localStorage.setItem(SEED_KEY, '1');
      console.info(`[BATALHA] ${seededCount} beats de fábrica carregados com sucesso.`);
    } else {
      console.warn('[BATALHA] Nenhum beat foi carregado, tentando novamente na próxima carga.');
    }
  } catch (err) {
    // Silent fail — user can always import manually
    console.warn('[BATALHA] Seed de beats falhou silenciosamente:', err);
  }
}
