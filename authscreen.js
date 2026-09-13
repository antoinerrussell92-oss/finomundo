import React, { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, StyleSheet,
  SafeAreaView, StatusBar, ActivityIndicator,
  KeyboardAvoidingView, Platform, NativeModules, ScrollView,
} from 'react-native';

const SUPABASE_URL = 'https://zxtkcxabtzwalrpynzpg.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inp4dGtjeGFidHp3YWxycHluenBnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzc1MTE0NDAsImV4cCI6MjA5MzA4NzQ0MH0.kKQSa7QHVjMR5_byqFiJJt160u_UPGayH0tCqlo-tz0';

const deviceLocale = (
  Platform.OS === 'ios'
    ? NativeModules.SettingsManager?.settings?.AppleLocale ||
      NativeModules.SettingsManager?.settings?.AppleLanguages?.[0] ||
      'en'
    : NativeModules.I18nManager?.localeIdentifier || 'en'
);
const lang = deviceLocale.startsWith('pt') ? 'pt' : deviceLocale.startsWith('es') ? 'es' : 'en';

const T = {
  brand:        { en: 'FinoMundo',                              pt: 'FinoMundo',                              es: 'FinoMundo'                              },
  tagline:      { en: 'Financial education for everyone',       pt: 'Educação financeira para todos',         es: 'Educación financiera para todos'         },
  login:        { en: 'Log In',                                 pt: 'Entrar',                                 es: 'Iniciar sesión'                          },
  signup:       { en: 'Sign Up',                                pt: 'Criar conta',                            es: 'Registrarse'                             },
  email:        { en: 'EMAIL ADDRESS',                          pt: 'ENDEREÇO DE E-MAIL',                     es: 'CORREO ELECTRÓNICO'                      },
  emailPh:      { en: 'you@example.com',                        pt: 'voce@exemplo.com',                       es: 'tu@ejemplo.com'                          },
  password:     { en: 'PASSWORD',                               pt: 'SENHA',                                  es: 'CONTRASEÑA'                              },
  passwordPh:   { en: '••••••••',                               pt: '••••••••',                               es: '••••••••'                                },
  confirmPw:    { en: 'CONFIRM PASSWORD',                       pt: 'CONFIRMAR SENHA',                        es: 'CONFIRMAR CONTRASEÑA'                    },
  name:         { en: 'YOUR NAME',                              pt: 'SEU NOME',                               es: 'TU NOMBRE'                               },
  namePh:       { en: 'First name or username',                 pt: 'Primeiro nome ou usuário',               es: 'Nombre o usuario'                        },
  loginBtn:     { en: 'Log In',                                 pt: 'Entrar',                                 es: 'Iniciar sesión'                          },
  signupBtn:    { en: 'Create Account',                         pt: 'Criar conta',                            es: 'Crear cuenta'                            },
  forgotPw:     { en: 'Forgot password?',                       pt: 'Esqueceu a senha?',                      es: '¿Olvidaste tu contraseña?'               },
  noAccount:    { en: "Don't have an account?",                 pt: 'Não tem uma conta?',                     es: '¿No tienes cuenta?'                      },
  hasAccount:   { en: 'Already have an account?',               pt: 'Já tem uma conta?',                      es: '¿Ya tienes cuenta?'                      },
  switchSignup: { en: 'Sign up free',                           pt: 'Criar conta grátis',                     es: 'Regístrate gratis'                       },
  switchLogin:  { en: 'Log in',                                 pt: 'Entrar',                                 es: 'Iniciar sesión'                          },
  free:         { en: 'World 1 is free forever · No card needed', pt: 'Mundo 1 gratuito para sempre · Sem cartão', es: 'Mundo 1 gratis para siempre · Sin tarjeta' },
  errEmail:     { en: 'Please enter a valid email address.',    pt: 'Por favor insira um e-mail válido.',      es: 'Por favor ingresa un correo válido.'     },
  errPw:        { en: 'Password must be at least 6 characters.',pt: 'A senha deve ter pelo menos 6 caracteres.', es: 'La contraseña debe tener al menos 6 caracteres.' },
  errMatch:     { en: 'Passwords do not match.',                pt: 'As senhas não coincidem.',                es: 'Las contraseñas no coinciden.'           },
  errName:      { en: 'Please enter your name.',                pt: 'Por favor insira seu nome.',             es: 'Por favor ingresa tu nombre.'            },
  checkEmail:   { en: 'Account created! Check your email to confirm, then log in.',
                  pt: 'Conta criada! Verifique seu e-mail para confirmar e depois entre.',
                  es: 'Cuenta creada! Revisa tu correo para confirmar y luego inicia sesión.' },
  resetSent:    { en: 'Password reset email sent. Check your inbox.',
                  pt: 'E-mail de redefinição enviado. Verifique sua caixa de entrada.',
                  es: 'Correo de restablecimiento enviado. Revisa tu bandeja de entrada.' },
  resetTitle:   { en: 'Reset Password',                         pt: 'Redefinir senha',                        es: 'Restablecer contraseña'                  },
  resetSub:     { en: "Enter your email and we'll send a reset link.",
                  pt: 'Digite seu e-mail e enviaremos um link de redefinição.',
                  es: 'Ingresa tu correo y te enviaremos un enlace de restablecimiento.'   },
  resetBtn:     { en: 'Send Reset Link',                        pt: 'Enviar link',                            es: 'Enviar enlace'                           },
  backToLogin:  { en: '← Back to login',                       pt: '← Voltar ao login',                      es: '← Volver al inicio de sesión'            },
  privacyNote:  { en: 'By continuing you agree to our Terms of Service and Privacy Policy.',
                  pt: 'Ao continuar você concorda com nossos Termos de Serviço e Política de Privacidade.',
                  es: 'Al continuar aceptas nuestros Términos de Servicio y Política de Privacidad.'  },
};

function t(key) {
  return T[key]?.[lang] || T[key]?.en || '';
}

const C = {
  green: '#1A9E6E', greenD: '#0D6B4A', greenL: '#E0F5EC',
  ink: '#0F1A14', muted: '#4A6358', border: '#D4E8DD',
  bg: '#F7FBF8', white: '#FFFFFF', red: '#E24B4A',
  amber: '#F5A623', tv: '#131722', tv2: '#1E222D',
  tvt: '#D1D4DC', tvtm: '#787B86', tvb: '#363A45',
};

async function signInWithPassword(email, password) {
  const res = await fetch(`${SUPABASE_URL}/auth/v1/token?grant_type=password`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'apikey': SUPABASE_ANON_KEY },
    body: JSON.stringify({ email, password }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error_description || data.msg || 'Login failed');
  return data;
}

async function signUp(email, password, name) {
  const res = await fetch(`${SUPABASE_URL}/auth/v1/signup`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'apikey': SUPABASE_ANON_KEY },
    body: JSON.stringify({ email, password, data: { display_name: name } }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error_description || data.msg || 'Sign up failed');
  return data;
}

async function resetPassword(email) {
  const res = await fetch(`${SUPABASE_URL}/auth/v1/recover`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'apikey': SUPABASE_ANON_KEY },
    body: JSON.stringify({ email }),
  });
  if (!res.ok) {
    const data = await res.json();
    throw new Error(data.error_description || data.msg || 'Reset failed');
  }
}

export default function AuthScreen({ onAuthSuccess }) {
  const [mode, setMode] = useState('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  function validate() {
    if (!email.includes('@') || !email.includes('.')) { setError(t('errEmail')); return false; }
    if (mode === 'reset') return true;
    if (password.length < 6) { setError(t('errPw')); return false; }
    if (mode === 'signup') {
      if (password !== confirmPassword) { setError(t('errMatch')); return false; }
      if (!name.trim()) { setError(t('errName')); return false; }
    }
    return true;
  }

  async function handleLogin() {
    if (!validate()) return;
    setLoading(true); setError(''); setMessage('');
    try {
      const data = await signInWithPassword(email, password);
      if (data?.user) onAuthSuccess(data.user, data.access_token);
    } catch (e) {
      setError(e.message || 'Login failed.');
    } finally {
      setLoading(false);
    }
  }

  async function handleSignup() {
    if (!validate()) return;
    setLoading(true); setError(''); setMessage('');
    try {
      const data = await signUp(email, password, name.trim());
      if (data?.user) {
        setMessage(t('checkEmail'));
        setMode('login');
      } else {
        setError('Something went wrong. Please try again.');
      }
    } catch (e) {
      setError(e.message || 'Sign up failed.');
    } finally {
      setLoading(false);
    }
  }

  async function handleReset() {
    if (!validate()) return;
    setLoading(true); setError(''); setMessage('');
    try {
      await resetPassword(email);
      setMessage(t('resetSent'));
    } catch (e) {
      setError(e.message || 'Reset failed.');
    } finally {
      setLoading(false);
    }
  }

  function submit() {
    if (mode === 'login') handleLogin();
    else if (mode === 'signup') handleSignup();
    else handleReset();
  }

  return (
    <SafeAreaView style={s.safe}>
      <StatusBar barStyle="light-content" backgroundColor={C.tv}/>
      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
        <ScrollView contentContainerStyle={s.scroll} keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
          <View style={s.brandRow}>
            <Text style={s.brand}>Fino<Text style={{ color: C.green }}>Mundo</Text></Text>
            <Text style={s.tagline}>{t('tagline')}</Text>
          </View>

          {mode !== 'reset' && (
            <View style={s.tabRow}>
              <TouchableOpacity style={[s.tab, mode === 'login' && s.tabActive]} onPress={() => { setMode('login'); setError(''); setMessage(''); }}>
                <Text style={[s.tabText, mode === 'login' && s.tabTextActive]}>{t('login')}</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[s.tab, mode === 'signup' && s.tabActive]} onPress={() => { setMode('signup'); setError(''); setMessage(''); }}>
                <Text style={[s.tabText, mode === 'signup' && s.tabTextActive]}>{t('signup')}</Text>
              </TouchableOpacity>
            </View>
          )}

          {mode === 'reset' && (
            <View style={s.resetHeader}>
              <Text style={s.resetTitle}>{t('resetTitle')}</Text>
              <Text style={s.resetSub}>{t('resetSub')}</Text>
            </View>
          )}

          <View style={s.card}>
            {mode === 'signup' && (
              <View style={s.field}>
                <Text style={s.label}>{t('name')}</Text>
                <TextInput style={s.input} placeholder={t('namePh')} placeholderTextColor={C.tvtm} value={name} onChangeText={setName} autoCapitalize="words" returnKeyType="next"/>
              </View>
            )}

            <View style={s.field}>
              <Text style={s.label}>{t('email')}</Text>
              <TextInput style={s.input} placeholder={t('emailPh')} placeholderTextColor={C.tvtm} value={email} onChangeText={setEmail} keyboardType="email-address" autoCapitalize="none" autoCorrect={false} returnKeyType={mode === 'reset' ? 'done' : 'next'} onSubmitEditing={mode === 'reset' ? submit : undefined}/>
            </View>

            {mode !== 'reset' && (
              <View style={s.field}>
                <Text style={s.label}>{t('password')}</Text>
                <View style={s.passwordRow}>
                  <TextInput style={[s.input, { flex: 1, marginBottom: 0 }]} placeholder={t('passwordPh')} placeholderTextColor={C.tvtm} value={password} onChangeText={setPassword} secureTextEntry={!showPassword} autoCapitalize="none" returnKeyType={mode === 'signup' ? 'next' : 'done'} onSubmitEditing={mode === 'login' ? submit : undefined}/>
                  <TouchableOpacity style={s.eyeBtn} onPress={() => setShowPassword(v => !v)}>
                    <Text style={s.eyeIcon}>{showPassword ? '🙈' : '👁'}</Text>
                  </TouchableOpacity>
                </View>
              </View>
            )}

            {mode === 'signup' && (
              <View style={s.field}>
                <Text style={s.label}>{t('confirmPw')}</Text>
                <TextInput style={s.input} placeholder={t('passwordPh')} placeholderTextColor={C.tvtm} value={confirmPassword} onChangeText={setConfirmPassword} secureTextEntry={!showPassword} autoCapitalize="none" returnKeyType="done" onSubmitEditing={submit}/>
              </View>
            )}

            {error ? <View style={s.errorBox}><Text style={s.errorText}>⚠️ {error}</Text></View> : null}
            {message ? <View style={s.messageBox}><Text style={s.messageText}>✓ {message}</Text></View> : null}

            <TouchableOpacity style={[s.submitBtn, loading && s.submitBtnDisabled]} onPress={submit} disabled={loading} activeOpacity={0.85}>
              {loading ? <ActivityIndicator color={C.white} size="small"/> : <Text style={s.submitBtnText}>{mode === 'login' ? t('loginBtn') : mode === 'signup' ? t('signupBtn') : t('resetBtn')}</Text>}
            </TouchableOpacity>

            {mode === 'login' && (
              <TouchableOpacity style={s.forgotBtn} onPress={() => { setMode('reset'); setError(''); setMessage(''); }}>
                <Text style={s.forgotText}>{t('forgotPw')}</Text>
              </TouchableOpacity>
            )}
            {mode === 'reset' && (
              <TouchableOpacity style={s.forgotBtn} onPress={() => { setMode('login'); setError(''); setMessage(''); }}>
                <Text style={s.forgotText}>{t('backToLogin')}</Text>
              </TouchableOpacity>
            )}
          </View>

          {mode !== 'reset' && (
            <View style={s.switchRow}>
              <Text style={s.switchText}>{mode === 'login' ? t('noAccount') : t('hasAccount')}</Text>
              <TouchableOpacity onPress={() => { setMode(mode === 'login' ? 'signup' : 'login'); setError(''); setMessage(''); }}>
                <Text style={s.switchLink}>{' '}{mode === 'login' ? t('switchSignup') : t('switchLogin')}</Text>
              </TouchableOpacity>
            </View>
          )}

          <View style={s.freeNote}>
            <Text style={s.freeNoteText}>🎓 {t('free')}</Text>
          </View>
          <Text style={s.privacy}>{t('privacyNote')}</Text>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  safe: { flex: 1, backgroundColor: C.tv },
  scroll: { flexGrow: 1, justifyContent: 'center', paddingHorizontal: 24, paddingVertical: 32 },
  brandRow: { alignItems: 'center', marginBottom: 32 },
  brand: { fontSize: 36, fontWeight: '900', color: C.white, letterSpacing: -0.5, marginBottom: 6 },
  tagline: { fontSize: 13, color: C.tvtm, textAlign: 'center' },
  tabRow: { flexDirection: 'row', backgroundColor: C.tv2, borderRadius: 12, padding: 4, marginBottom: 20, borderWidth: 0.5, borderColor: C.tvb },
  tab: { flex: 1, paddingVertical: 10, alignItems: 'center', borderRadius: 9 },
  tabActive: { backgroundColor: C.green },
  tabText: { fontSize: 14, fontWeight: '600', color: C.tvtm },
  tabTextActive: { color: C.white },
  resetHeader: { marginBottom: 20, alignItems: 'center' },
  resetTitle: { fontSize: 20, fontWeight: '800', color: C.white, marginBottom: 8 },
  resetSub: { fontSize: 13, color: C.tvtm, textAlign: 'center', lineHeight: 20 },
  card: { backgroundColor: C.tv2, borderRadius: 16, padding: 20, borderWidth: 0.5, borderColor: C.tvb, marginBottom: 20 },
  field: { marginBottom: 16 },
  label: { fontSize: 9, fontWeight: '700', color: C.tvtm, letterSpacing: 1, marginBottom: 6 },
  input: { backgroundColor: C.tv, borderRadius: 10, paddingHorizontal: 14, paddingVertical: 13, fontSize: 14, color: C.tvt, borderWidth: 0.5, borderColor: C.tvb },
  passwordRow: { flexDirection: 'row', alignItems: 'center', backgroundColor: C.tv, borderRadius: 10, borderWidth: 0.5, borderColor: C.tvb, overflow: 'hidden' },
  eyeBtn: { paddingHorizontal: 14, paddingVertical: 13 },
  eyeIcon: { fontSize: 16 },
  errorBox: { backgroundColor: 'rgba(226,75,74,0.1)', borderRadius: 8, padding: 10, marginBottom: 14, borderWidth: 0.5, borderColor: 'rgba(226,75,74,0.3)' },
  errorText: { fontSize: 12, color: '#f87171', lineHeight: 18 },
  messageBox: { backgroundColor: 'rgba(26,158,110,0.1)', borderRadius: 8, padding: 10, marginBottom: 14, borderWidth: 0.5, borderColor: 'rgba(26,158,110,0.3)' },
  messageText: { fontSize: 12, color: C.green, lineHeight: 18 },
  submitBtn: { backgroundColor: C.green, borderRadius: 12, paddingVertical: 15, alignItems: 'center', marginBottom: 12 },
  submitBtnDisabled: { opacity: 0.6 },
  submitBtnText: { fontSize: 15, fontWeight: '800', color: C.white },
  forgotBtn: { alignItems: 'center', paddingVertical: 6 },
  forgotText: { fontSize: 12, color: C.tvtm, textDecorationLine: 'underline' },
  switchRow: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginBottom: 16, flexWrap: 'wrap' },
  switchText: { fontSize: 13, color: C.tvtm },
  switchLink: { fontSize: 13, fontWeight: '700', color: C.green },
  freeNote: { backgroundColor: 'rgba(26,158,110,0.08)', borderRadius: 10, padding: 12, alignItems: 'center', marginBottom: 16, borderWidth: 0.5, borderColor: 'rgba(26,158,110,0.2)' },
  freeNoteText: { fontSize: 12, color: C.green, fontWeight: '600', textAlign: 'center' },
  privacy: { fontSize: 10, color: C.tvtm, textAlign: 'center', lineHeight: 16 },
});