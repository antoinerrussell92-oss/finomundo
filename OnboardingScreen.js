import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Dimensions,
  FlatList,
} from 'react-native';
import Svg, { Path, Rect, Circle, Line, G } from 'react-native-svg';
import * as Localization from 'expo-localization';

const { width } = Dimensions.get('window');

const C = {
  black:    '#0d1f18',
  card:     'rgba(255,255,255,0.04)',
  border:   'rgba(255,255,255,0.07)',
  borderG:  'rgba(26,158,110,0.25)',
  green:    '#1A9E6E',
  greenDim: 'rgba(26,158,110,0.10)',
  amber:    '#F5A623',
  amberDim: 'rgba(245,166,35,0.08)',
  white:    '#ffffff',
  white60:  'rgba(255,255,255,0.6)',
  white35:  'rgba(255,255,255,0.35)',
  white15:  'rgba(255,255,255,0.08)',
  navy:     '#1a3a28',
};

function detectLanguage() {
  try {
    const locale = Localization.locale || 'en';
    const lang = locale.split('-')[0].toLowerCase();
    if (lang === 'pt') return 'pt';
    if (lang === 'es') return 'es';
    return 'en';
  } catch (e) {
    return 'en';
  }
}

const T = {
  en: {
    skip:         'Skip',
    getStarted:   'Get Started',
    next:         'Next',
    seePricing:   'See Pricing →',
    s1Title:      'Your world.',
    s1Accent:     'Your wealth.',
    s1Body:       'FinoMundo teaches money skills school never did — in your language, at your pace, built for your world.',
    s2Title:      '7 Worlds.',
    s2Accent:     'Real skills.',
    s2Body:       'Progress through 7 worlds of financial education. World 1 is free forever. Unlock the rest with one subscription.',
    s3Title:      'Learn it.',
    s3Accent:     'Trade it.',
    s3Body:       'Complete World 7 to unlock a full paper trading terminal — stocks, futures, crypto, forex, and options. Real markets, zero risk.',
    s4Title:      'Master your',
    s4Accent:     'trading mind.',
    s4Body:       'Psychology gates, loss debriefs, and a monthly prop firm scholarship for top traders. No other app does this.',
    w1: 'W1 Free',    w2: 'W2 Budgeting', w3: 'W3 Credit',
    w4: 'W4 Investing', w5: 'W5 Taxes',  w6: 'W6 Business', w7: 'W7 Trading 🔒',
    mockPort: 'Portfolio value', mockAapl: 'AAPL position',
    mockBrl: 'BRL/USD trade',   mockRank: 'Leaderboard rank',
    mockGate: 'Psychology gate', mockDebrief: 'Loss debrief',
    mockLimit: 'Daily loss limit', mockScholar: 'Prop scholarship',
    mockProtect: 'Protected', mockRequired: 'Required', mockMonthly: 'Monthly',
    pwBadge: 'FINOMUNDO PRO',
    pwTitle: 'World 1 is free.\nUnlock everything else.',
    pwSub: 'One subscription. All 7 worlds. Full trading terminal. Cancel anytime.',
    freeLabel: 'WORLD 1', freeVal: 'Free forever',
    monthly: 'MONTHLY', annual: 'ANNUAL', bestValue: 'Best Value',
    monthlyPrice: '$5.99', monthlyPer: '/ month',
    annualPrice: '$46',   annualPer: '/ year',
    annualSave: '2 months free — save $26',
    unlockBtn: 'Start with Annual — $46',
    restore: 'Restore purchase',
    missionNote: '🌱 Mission pricing available for Brazil, Mexico, and 11 other LatAm countries — shown in your local currency after signup.',
  },
  pt: {
    skip:         'Pular',
    getStarted:   'Começar',
    next:         'Próximo',
    seePricing:   'Ver Preços →',
    s1Title:      'Seu mundo.',
    s1Accent:     'Sua riqueza.',
    s1Body:       'O FinoMundo ensina habilidades financeiras que a escola nunca ensinou — no seu idioma, no seu ritmo, feito para o seu mundo.',
    s2Title:      '7 Mundos.',
    s2Accent:     'Habilidades reais.',
    s2Body:       'Avance pelos 7 mundos de educação financeira. O Mundo 1 é grátis para sempre. Desbloqueie o resto com uma assinatura.',
    s3Title:      'Aprenda.',
    s3Accent:     'Negocie.',
    s3Body:       'Complete o Mundo 7 para desbloquear um terminal completo de paper trading — ações, futuros, cripto, forex e opções. Mercados reais, risco zero.',
    s4Title:      'Domine sua',
    s4Accent:     'mente de trader.',
    s4Body:       'Portais psicológicos, debriefings de perdas e bolsa mensal para prop firm. Nenhum outro app faz isso.',
    w1: 'M1 Grátis',   w2: 'M2 Orçamento', w3: 'M3 Crédito',
    w4: 'M4 Investimentos', w5: 'M5 Impostos', w6: 'M6 Negócios', w7: 'M7 Trading 🔒',
    mockPort: 'Valor da carteira', mockAapl: 'Posição AAPL',
    mockBrl: 'Operação BRL/USD',   mockRank: 'Ranking',
    mockGate: 'Portal psicológico', mockDebrief: 'Debrief de perda',
    mockLimit: 'Limite diário de perda', mockScholar: 'Bolsa prop firm',
    mockProtect: 'Protegido', mockRequired: 'Obrigatório', mockMonthly: 'Mensal',
    pwBadge: 'FINOMUNDO PRO',
    pwTitle: 'Mundo 1 é grátis.\nDesbloqueie todo o resto.',
    pwSub: 'Uma assinatura. 7 mundos. Terminal completo. Cancele quando quiser.',
    freeLabel: 'MUNDO 1', freeVal: 'Grátis para sempre',
    monthly: 'MENSAL', annual: 'ANUAL', bestValue: 'Melhor Custo',
    monthlyPrice: 'R$10', monthlyPer: '/ mês',
    annualPrice: 'R$60',  annualPer: '/ ano',
    annualSave: '2 meses grátis — economize R$60',
    unlockBtn: 'Começar com Anual — R$60',
    restore: 'Restaurar compra',
    missionNote: '🌱 Preço missão para o Brasil e outros países da América Latina — acesso com poder de compra local.',
  },
  es: {
    skip:         'Omitir',
    getStarted:   'Comenzar',
    next:         'Siguiente',
    seePricing:   'Ver Precios →',
    s1Title:      'Tu mundo.',
    s1Accent:     'Tu riqueza.',
    s1Body:       'FinoMundo enseña habilidades financieras que la escuela nunca enseñó — en tu idioma, a tu ritmo, hecho para tu mundo.',
    s2Title:      '7 Mundos.',
    s2Accent:     'Habilidades reales.',
    s2Body:       'Avanza por 7 mundos de educación financiera. El Mundo 1 es gratis para siempre. Desbloquea el resto con una suscripción.',
    s3Title:      'Aprende.',
    s3Accent:     'Opera.',
    s3Body:       'Completa el Mundo 7 para desbloquear un terminal completo de paper trading — acciones, futuros, cripto, forex y opciones. Mercados reales, riesgo cero.',
    s4Title:      'Domina tu',
    s4Accent:     'mente de trader.',
    s4Body:       'Puertas psicológicas, debriefs de pérdidas y beca mensual para prop firm. Ninguna otra app hace esto.',
    w1: 'M1 Gratis',  w2: 'M2 Presupuesto', w3: 'M3 Crédito',
    w4: 'M4 Inversiones', w5: 'M5 Impuestos', w6: 'M6 Negocios', w7: 'M7 Trading 🔒',
    mockPort: 'Valor del portafolio', mockAapl: 'Posición AAPL',
    mockBrl: 'Operación BRL/USD',     mockRank: 'Ranking',
    mockGate: 'Puerta psicológica', mockDebrief: 'Debrief de pérdida',
    mockLimit: 'Límite diario de pérdida', mockScholar: 'Beca prop firm',
    mockProtect: 'Protegido', mockRequired: 'Requerido', mockMonthly: 'Mensual',
    pwBadge: 'FINOMUNDO PRO',
    pwTitle: 'Mundo 1 es gratis.\nDesbloquea todo lo demás.',
    pwSub: 'Una suscripción. 7 mundos. Terminal completo. Cancela cuando quieras.',
    freeLabel: 'MUNDO 1', freeVal: 'Gratis para siempre',
    monthly: 'MENSUAL', annual: 'ANUAL', bestValue: 'Mejor Valor',
    monthlyPrice: 'MX$45', monthlyPer: '/ mes',
    annualPrice: 'MX$249', annualPer: '/ año',
    annualSave: '2 meses gratis — ahorra MX$291',
    unlockBtn: 'Empezar con Anual — MX$249',
    restore: 'Restaurar compra',
    missionNote: '🌱 Precio misión disponible para México, Brasil y 11 países de LatAm — al precio de tu poder adquisitivo local.',
  },
};

const IconGlobe = () => (
  <Svg width={36} height={36} viewBox="0 0 24 24" fill="none">
    <Circle cx="12" cy="12" r="9" stroke={C.green} strokeWidth="1.4"/>
    <Path d="M12 3c-2 2.5-3 5.5-3 9s1 6.5 3 9M12 3c2 2.5 3 5.5 3 9s-1 6.5-3 9" stroke={C.green} strokeWidth="1.4" strokeLinecap="round"/>
    <Line x1="3" y1="12" x2="21" y2="12" stroke={C.green} strokeWidth="1.4" strokeLinecap="round"/>
    <Line x1="4.5" y1="7.5" x2="19.5" y2="7.5" stroke={C.green} strokeWidth="1.4" strokeLinecap="round"/>
    <Line x1="4.5" y1="16.5" x2="19.5" y2="16.5" stroke={C.green} strokeWidth="1.4" strokeLinecap="round"/>
  </Svg>
);

const IconMap = () => (
  <Svg width={36} height={36} viewBox="0 0 24 24" fill="none">
    <Path d="M3 6l6-3 6 3 6-3v15l-6 3-6-3-6 3V6z" stroke={C.green} strokeWidth="1.4" strokeLinejoin="round"/>
    <Line x1="9" y1="3" x2="9" y2="18" stroke={C.green} strokeWidth="1.4" strokeLinecap="round"/>
    <Line x1="15" y1="6" x2="15" y2="21" stroke={C.green} strokeWidth="1.4" strokeLinecap="round"/>
  </Svg>
);

const IconChart = () => (
  <Svg width={36} height={36} viewBox="0 0 24 24" fill="none">
    <Path d="M3 3v18h18" stroke={C.amber} strokeWidth="1.4" strokeLinecap="round"/>
    <Path d="M7 14l4-4 4 4 4-6" stroke={C.amber} strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
    <Circle cx="19" cy="8" r="1.5" fill={C.amber}/>
  </Svg>
);

const IconBrain = () => (
  <Svg width={36} height={36} viewBox="0 0 24 24" fill="none">
    <Path d="M12 5a4 4 0 00-4 4v.5A3.5 3.5 0 005 13a3.5 3.5 0 003.5 3.5H12M12 5a4 4 0 014 4v.5A3.5 3.5 0 0119 13a3.5 3.5 0 01-3.5 3.5H12M12 5v13" stroke={C.amber} strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
    <Circle cx="12" cy="19" r="1" fill={C.amber}/>
  </Svg>
);

const SLIDES = [
  { id: '1', Icon: IconGlobe, iconBg: C.greenDim, mockup: null,     accentColor: C.green },
  { id: '2', Icon: IconMap,   iconBg: C.greenDim, mockup: 'worlds', accentColor: C.green },
  { id: '3', Icon: IconChart, iconBg: C.amberDim, mockup: 'trade',  accentColor: C.amber },
  { id: '4', Icon: IconBrain, iconBg: C.amberDim, mockup: 'psych',  accentColor: C.amber },
];

const TradingMockup = ({ t }) => (
  <View style={styles.mockCard}>
    {[
      { label: t.mockPort, val: 'ƒ 12,450', color: C.green },
      { label: t.mockAapl, val: '+8.4%',    color: C.green },
      { label: t.mockBrl,  val: '+2.1%',    color: C.amber },
      { label: t.mockRank, val: '#14',      color: C.white },
    ].map((r) => (
      <View key={r.label} style={styles.mockRow}>
        <Text style={styles.mockLabel}>{r.label}</Text>
        <Text style={[styles.mockVal, { color: r.color }]}>{r.val}</Text>
      </View>
    ))}
  </View>
);

const PsychMockup = ({ t }) => (
  <View style={styles.mockCard}>
    {[
      { label: t.mockGate,    val: 'Fear & Greed',   color: C.amber },
      { label: t.mockDebrief, val: t.mockRequired,   color: C.white },
      { label: t.mockLimit,   val: t.mockProtect,    color: C.green },
      { label: t.mockScholar, val: t.mockMonthly,    color: C.amber },
    ].map((r) => (
      <View key={r.label} style={styles.mockRow}>
        <Text style={styles.mockLabel}>{r.label}</Text>
        <Text style={[styles.mockVal, { color: r.color }]}>{r.val}</Text>
      </View>
    ))}
  </View>
);

const WorldPills = ({ t }) => (
  <View style={styles.worldRow}>
    {[
      { label: t.w1, locked: false },
      { label: t.w2, locked: false },
      { label: t.w3, locked: false },
      { label: t.w4, locked: true },
      { label: t.w5, locked: true },
      { label: t.w6, locked: true },
      { label: t.w7, locked: true },
    ].map((w) => (
      <View key={w.label} style={[styles.worldPill, w.locked && styles.worldPillLocked]}>
        <Text style={[styles.worldPillText, w.locked && styles.worldPillTextLocked]}>{w.label}</Text>
      </View>
    ))}
  </View>
);

const SlideItem = ({ item, t, slideWidth }) => {
  const titles = {
    '1': { main: t.s1Title, accent: t.s1Accent },
    '2': { main: t.s2Title, accent: t.s2Accent },
    '3': { main: t.s3Title, accent: t.s3Accent },
    '4': { main: t.s4Title, accent: t.s4Accent },
  };
  const bodies = {
    '1': t.s1Body,
    '2': t.s2Body,
    '3': t.s3Body,
    '4': t.s4Body,
  };

  return (
    <View style={[styles.slide, { width: slideWidth }]}>
      <View style={[styles.iconBox, { backgroundColor: item.iconBg }]}>
        <item.Icon />
      </View>
      <Text style={styles.slideTitle}>
        {titles[item.id].main}{' '}
        <Text style={{ color: item.accentColor }}>{titles[item.id].accent}</Text>
      </Text>
      {item.mockup === 'worlds' && <WorldPills t={t} />}
      {item.mockup === 'trade'  && <TradingMockup t={t} />}
      {item.mockup === 'psych'  && <PsychMockup t={t} />}
      <Text style={styles.slideBody}>{bodies[item.id]}</Text>
    </View>
  );
};

const PaywallScreen = ({ t, onPurchase, onRestore }) => (
  <ScrollView style={styles.paywallScroll} contentContainerStyle={styles.paywallContent} showsVerticalScrollIndicator={false}>
    <View style={styles.pwBadge}>
      <Text style={styles.pwBadgeText}>{t.pwBadge}</Text>
    </View>
    <Text style={styles.pwTitle}>{t.pwTitle}</Text>
    <Text style={styles.pwSub}>{t.pwSub}</Text>

    <View style={styles.freeBox}>
      <Text style={styles.freeLabel}>{t.freeLabel}</Text>
      <Text style={styles.freeVal}>{t.freeVal}</Text>
    </View>

    <View style={styles.planCard}>
      <View style={styles.planTop}>
        <Text style={styles.planName}>{t.monthly}</Text>
      </View>
      <Text style={styles.planPrice}>
        {t.monthlyPrice} <Text style={styles.planPer}>{t.monthlyPer}</Text>
      </Text>
    </View>

    <View style={[styles.planCard, styles.planFeatured]}>
      <View style={styles.planTop}>
        <Text style={styles.planName}>{t.annual}</Text>
        <View style={styles.planBadge}>
          <Text style={styles.planBadgeText}>{t.bestValue}</Text>
        </View>
      </View>
      <Text style={styles.planPrice}>
        {t.annualPrice} <Text style={styles.planPer}>{t.annualPer}</Text>
      </Text>
      <Text style={styles.planSave}>{t.annualSave}</Text>
    </View>

    <TouchableOpacity style={styles.unlockBtn} onPress={onPurchase}>
      <Text style={styles.unlockBtnText}>{t.unlockBtn}</Text>
    </TouchableOpacity>

    <TouchableOpacity onPress={onRestore}>
      <Text style={styles.restoreText}>{t.restore}</Text>
    </TouchableOpacity>

    <View style={styles.missionNote}>
      <Text style={styles.missionNoteText}>{t.missionNote}</Text>
    </View>
  </ScrollView>
);

export default function OnboardingScreen({ onComplete }) {
  const [lang, setLang]                 = useState('en');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showPaywall, setShowPaywall]   = useState(false);
  const flatListRef = useRef(null);

  useEffect(() => {
    const detected = detectLanguage();
    setLang(detected);
  }, []);

  const t = T[lang];
  const isLast = currentIndex === SLIDES.length - 1;

  const handleNext = () => {
    if (isLast) { setShowPaywall(true); return; }
    const next = currentIndex + 1;
    flatListRef.current?.scrollToIndex({ index: next, animated: true });
    setCurrentIndex(next);
  };

  const onScrollEnd = (e) => {
    const index = Math.round(e.nativeEvent.contentOffset.x / width);
    setCurrentIndex(index);
  };

  if (showPaywall) {
    return (
      <View style={styles.container}>
        <PaywallScreen
          t={t}
          onPurchase={() => { console.log('Purchase — wire RevenueCat here'); onComplete && onComplete(); }}
          onRestore={()  => { console.log('Restore — wire RevenueCat here'); }}
        />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.skipBtn} onPress={() => setShowPaywall(true)}>
        <Text style={styles.skipText}>{t.skip}</Text>
      </TouchableOpacity>

      <FlatList
        ref={flatListRef}
        data={SLIDES}
        renderItem={({ item }) => <SlideItem item={item} t={t} slideWidth={width} />}
        keyExtractor={(item) => item.id}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onMomentumScrollEnd={onScrollEnd}
        scrollEventThrottle={16}
      />

      <View style={styles.dotsRow}>
        {SLIDES.map((_, i) => (
          <View key={i} style={[styles.dot, i === currentIndex && styles.dotActive]} />
        ))}
      </View>

      <TouchableOpacity style={styles.nextBtn} onPress={handleNext}>
        <Text style={styles.nextBtnText}>
          {currentIndex === 0 ? t.getStarted : isLast ? t.seePricing : t.next}
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container:           { flex: 1, backgroundColor: C.black },
  skipBtn:             { position: 'absolute', top: 52, right: 20, zIndex: 10, padding: 8 },
  skipText:            { fontSize: 12, color: 'rgba(255,255,255,0.15)', fontWeight: '500' },
  slide:               { flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 32, paddingTop: 80, paddingBottom: 160 },
  iconBox:             { width: 80, height: 80, borderRadius: 22, borderWidth: 1, borderColor: C.borderG, alignItems: 'center', justifyContent: 'center', marginBottom: 22 },
  slideTitle:          { fontSize: 24, fontWeight: '800', color: C.white, textAlign: 'center', lineHeight: 30, marginBottom: 14 },
  slideBody:           { fontSize: 13, color: C.white35, textAlign: 'center', lineHeight: 20, marginTop: 10 },
  worldRow:            { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center', gap: 6, marginTop: 12, marginBottom: 6 },
  worldPill:           { backgroundColor: C.greenDim, borderWidth: 1, borderColor: C.borderG, borderRadius: 20, paddingHorizontal: 10, paddingVertical: 4 },
  worldPillLocked:     { backgroundColor: C.amberDim, borderColor: 'rgba(245,166,35,0.2)' },
  worldPillText:       { fontSize: 10, color: C.green, fontWeight: '600' },
  worldPillTextLocked: { color: C.amber },
  mockCard:            { backgroundColor: C.white15, borderWidth: 1, borderColor: C.borderG, borderRadius: 12, padding: 14, width: '100%', marginTop: 12, marginBottom: 4 },
  mockRow:             { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 },
  mockLabel:           { fontSize: 11, color: C.white35 },
  mockVal:             { fontSize: 11, fontWeight: '600' },
  dotsRow:             { flexDirection: 'row', justifyContent: 'center', alignItems: 'center', position: 'absolute', bottom: 100, left: 0, right: 0, gap: 6 },
  dot:                 { width: 6, height: 6, borderRadius: 3, backgroundColor: C.navy },
  dotActive:           { width: 18, backgroundColor: C.green },
  nextBtn:             { position: 'absolute', bottom: 36, left: 24, right: 24, backgroundColor: C.green, borderRadius: 14, paddingVertical: 16, alignItems: 'center' },
  nextBtnText:         { color: C.white, fontSize: 15, fontWeight: '800', letterSpacing: 0.5 },
  paywallScroll:       { flex: 1 },
  paywallContent:      { padding: 28, paddingTop: 52, paddingBottom: 48 },
  pwBadge:             { alignSelf: 'flex-start', backgroundColor: C.greenDim, borderWidth: 1, borderColor: C.borderG, borderRadius: 20, paddingHorizontal: 12, paddingVertical: 5, marginBottom: 16 },
  pwBadgeText:         { color: C.green, fontSize: 10, fontWeight: '700', letterSpacing: 1 },
  pwTitle:             { fontSize: 26, fontWeight: '800', color: C.white, lineHeight: 32, marginBottom: 8 },
  pwSub:               { fontSize: 13, color: C.white35, lineHeight: 20, marginBottom: 16 },
  freeBox:             { backgroundColor: C.greenDim, borderWidth: 1, borderColor: C.borderG, borderRadius: 12, padding: 14, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 },
  freeLabel:           { fontSize: 11, color: C.white35, fontWeight: '700', letterSpacing: 0.5 },
  freeVal:             { fontSize: 18, fontWeight: '800', color: C.green },
  planCard:            { borderWidth: 1, borderColor: C.border, borderRadius: 14, padding: 16, marginBottom: 10 },
  planFeatured:        { borderColor: C.borderG, backgroundColor: C.greenDim },
  planTop:             { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 },
  planName:            { fontSize: 11, fontWeight: '700', color: C.white35, letterSpacing: 1 },
  planBadge:           { backgroundColor: C.greenDim, borderWidth: 1, borderColor: C.borderG, borderRadius: 20, paddingHorizontal: 8, paddingVertical: 2 },
  planBadgeText:       { fontSize: 9, color: C.green, fontWeight: '600' },
  planPrice:           { fontSize: 28, fontWeight: '800', color: C.white },
  planPer:             { fontSize: 13, fontWeight: '400', color: C.white35 },
  planSave:            { fontSize: 11, color: C.green, marginTop: 4 },
  unlockBtn:           { backgroundColor: C.green, borderRadius: 14, paddingVertical: 16, alignItems: 'center', marginBottom: 10 },
  unlockBtnText:       { color: C.white, fontSize: 14, fontWeight: '800', letterSpacing: 0.5 },
  restoreText:         { textAlign: 'center', fontSize: 11, color: C.navy, marginBottom: 20, paddingVertical: 4 },
  missionNote:         { backgroundColor: 'rgba(245,166,35,0.05)', borderWidth: 1, borderColor: 'rgba(245,166,35,0.15)', borderRadius: 12, padding: 14 },
  missionNoteText:     { fontSize: 11, color: C.white35, lineHeight: 17, textAlign: 'center' },
});