/**
 * src/pages/auth/signin/SingIn.jsx  (nom conservé pour éviter de casser l'import)
 * Page de connexion — connectée à l'API CekemaSmart
 */

import React, { useState } from 'react';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import { FaGoogle } from 'react-icons/fa6';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext';

// ─── Sous-formulaire 2FA ──────────────────────────────────────────────────────

function TwoFactorForm({ challengeToken, onSuccess }) {
  const { twoFactorChallenge } = useAuth();
  const [code, setCode] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);
    try {
      await twoFactorChallenge(challengeToken, code);
      onSuccess();
    } catch (err) {
      setError(err.message ?? 'Code invalide.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-md w-full bg-neutral-50 border border-neutral-200 shadow-sm space-y-8 rounded-xl p-8">
      <div className="space-y-1.5">
        <h1 className="text-2xl text-neutral-800 font-bold">Vérification 2FA</h1>
        <p className="text-sm text-neutral-600">
          Entrez le code à 6 chiffres de votre application d'authentification.
        </p>
      </div>

      <form className="space-y-6" onSubmit={handleSubmit}>
        <div className="space-y-1.5">
          <label className="text-sm text-neutral-600 font-medium">Code TOTP</label>
          <input
            type="text"
            inputMode="numeric"
            maxLength={6}
            value={code}
            onChange={(e) => setCode(e.target.value.replace(/\D/g, ''))}
            placeholder="000000"
            className="w-full rounded-lg px-3 h-12 bg-transparent focus:bg-sky-500/5 border border-neutral-300 focus:border-sky-500 focus:ring-2 focus:ring-sky-500 outline-none transition tracking-widest text-center text-lg"
          />
        </div>

        {error && <p className="text-sm text-red-500">{error}</p>}

        <button
          type="submit"
          disabled={submitting || code.length !== 6}
          className="w-full h-12 rounded-lg bg-neutral-800 text-white hover:bg-neutral-700 transition disabled:opacity-50"
        >
          {submitting ? 'Vérification…' : 'Valider'}
        </button>
      </form>
    </div>
  );
}

// ─── Page principale ──────────────────────────────────────────────────────────

const SignIn = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // ─── CORRECTION : Redirection par défaut vers /programs au lieu de /dashboard ───
  const redirectTo = location.state?.from?.pathname ?? '/dashboard';

  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [fieldErrors, setFieldErrors] = useState({});

  // État 2FA
  const [twoFactor, setTwoFactor] = useState(false);
  const [challengeToken, setChallengeToken] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setFieldErrors({});
    setSubmitting(true);

    try {
      const result = await login(email, password);
      if (result.twoFactor) {
        setChallengeToken(result.challengeToken);
        setTwoFactor(true);
      } else {
        navigate(redirectTo, { replace: true });
      }
    } catch (err) {
      if (err.errors) {
        setFieldErrors(err.errors);
      } else {
        setError(err.message ?? 'Identifiants incorrects.');
      }
    } finally {
      setSubmitting(false);
    }
  };

  if (twoFactor) {
    return (
      <div className="w-full min-h-screen pt-[6ch] flex items-center justify-center">
        <TwoFactorForm
          challengeToken={challengeToken}
          onSuccess={() => navigate(redirectTo, { replace: true })}
        />
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen pt-[6ch] flex items-center justify-center">
      <div className="max-w-md w-full bg-neutral-50 border border-neutral-200 shadow-sm space-y-8 rounded-xl p-8">

        {/* Header */}
        <div className="space-y-1.5">
          <h1 className="text-2xl text-neutral-800 font-bold">Sign In</h1>
          <p className="text-sm text-neutral-600">Connexion</p>
        </div>

        {/* Erreur globale */}
        {error && (
          <div className="rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-600">
            {error}
          </div>
        )}

        {/* Form */}
        <form className="space-y-6" onSubmit={handleSubmit}>

          {/* Email */}
          <div className="space-y-1.5">
            <label htmlFor="email" className="text-sm text-neutral-600 font-medium">
              Adresse email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Entrez votre email..."
              required
              className="w-full rounded-lg px-3 h-12 bg-transparent focus:bg-sky-500/5 border border-neutral-300 focus:border-sky-500 focus:ring-2 focus:ring-sky-500 outline-none transition"
            />
            {fieldErrors.email && (
              <p className="text-xs text-red-500">{fieldErrors.email[0]}</p>
            )}
          </div>

          {/* Password */}
          <div className="space-y-1.5">
            <label htmlFor="password" className="text-sm text-neutral-600 font-medium">
              Mot de passe
            </label>
            <div className="relative">
              <input
                id="password"
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Entrez votre mot de passe..."
                required
                className="w-full rounded-lg px-3 h-12 bg-transparent focus:bg-sky-500/5 border border-neutral-300 focus:border-sky-500 focus:ring-2 focus:ring-sky-500 outline-none transition"
              />
              <button
                type="button"
                className="absolute top-1/2 right-3 -translate-y-1/2 text-neutral-400"
                onClick={() => setShowPassword((p) => !p)}
              >
                {showPassword ? <FaEye size={16} /> : <FaEyeSlash size={16} />}
              </button>
            </div>
            {fieldErrors.password && (
              <p className="text-xs text-red-500">{fieldErrors.password[0]}</p>
            )}
          </div>

          {/* Remember + Forgot */}
          <div className="flex items-center justify-between text-sm">
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" className="w-4 h-4" />
              Se souvenir de moi
            </label>
            <Link to="/forgot-password" className="text-sky-600 hover:text-neutral-800">
              Mot de passe oublié ?
            </Link>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={submitting}
            className="w-full h-12 rounded-lg bg-neutral-800 text-white hover:bg-neutral-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {submitting ? (
              <span className="flex items-center justify-center gap-2">
                <span className="w-4 h-4 rounded-full border-2 border-white border-t-transparent animate-spin" />
                Connexion…
              </span>
            ) : (
              'Se connecter'
            )}
          </button>

          {/* OR */}
          <div className="flex items-center gap-3">
            <div className="flex-1 h-px bg-neutral-200" />
            <span className="text-sm text-neutral-500">Ou connectez-vous avec</span>
            <div className="flex-1 h-px bg-neutral-200" />
          </div>

          {/* Google */}
          <button
            type="button"
            className="w-full py-2 px-4 border border-neutral-300 rounded-lg hover:bg-neutral-100 flex items-center justify-center gap-2 text-sm"
          >
            <FaGoogle size={16} />
            Google
          </button>

          {/* Sign up */}
          <div className="flex justify-center gap-2 text-sm">
            <p>Vous n'avez pas de compte ?</p>
            <Link to="/signup" className="text-sky-600 hover:text-neutral-800">
              Créer un compte
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SignIn;