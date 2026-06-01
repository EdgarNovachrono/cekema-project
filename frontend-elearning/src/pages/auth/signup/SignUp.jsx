/**
 * src/pages/auth/signup/SignUp.jsx
 * Page d'inscription — connectée à l'API CekemaSmart
 */

import React, { useState } from 'react';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import { FaGoogle } from 'react-icons/fa6';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext';

const SignUp = () => {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);
  const [form, setForm] = useState({
    first_name: '',
    last_name: '',
    email: '',
    password: '',
    password_confirmation: '',
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [fieldErrors, setFieldErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setFieldErrors({});

    if (form.password !== form.password_confirmation) {
      setFieldErrors({ password_confirmation: ['Les mots de passe ne correspondent pas.'] });
      return;
    }

    setSubmitting(true);
    try {
      await register(form);
      navigate('/dashboard', { replace: true });
    } catch (err) {
      if (err.errors) {
        setFieldErrors(err.errors);
      } else {
        setError(err.message ?? 'Une erreur est survenue lors de l\'inscription.');
      }
    } finally {
      setSubmitting(false);
    }
  };

  // Helper pour les inputs
  const inputClass =
    'w-full rounded-lg px-3 h-12 bg-transparent focus:bg-sky-500/5 border border-neutral-300 focus:border-sky-500 focus:ring-2 focus:ring-sky-500 outline-none transition';

  return (
    <div className="w-full min-h-screen pt-[6ch] flex items-center justify-center">
      <div className="max-w-md w-full bg-neutral-50 border border-neutral-200 shadow-sm space-y-8 rounded-xl p-8">

        {/* Header */}
        <div className="space-y-1.5">
          <h1 className="text-2xl text-neutral-800 font-bold">Sign up</h1>
          <p className="text-sm text-neutral-600">Créer un compte</p>
        </div>

        {/* Erreur globale */}
        {error && (
          <div className="rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-600">
            {error}
          </div>
        )}

        <form className="space-y-5" onSubmit={handleSubmit}>

          {/* Prénom */}
          <div className="space-y-1.5">
            <label htmlFor="first_name" className="text-sm text-neutral-600 font-medium">
              Prénom
            </label>
            <input
              id="first_name"
              name="first_name"
              type="text"
              value={form.first_name}
              onChange={handleChange}
              placeholder="Entrez votre prénom..."
              required
              className={inputClass}
            />
            {fieldErrors.first_name && (
              <p className="text-xs text-red-500">{fieldErrors.first_name[0]}</p>
            )}
          </div>

          {/* Nom */}
          <div className="space-y-1.5">
            <label htmlFor="last_name" className="text-sm text-neutral-600 font-medium">
              Nom
            </label>
            <input
              id="last_name"
              name="last_name"
              type="text"
              value={form.last_name}
              onChange={handleChange}
              placeholder="Entrez votre nom..."
              required
              className={inputClass}
            />
            {fieldErrors.last_name && (
              <p className="text-xs text-red-500">{fieldErrors.last_name[0]}</p>
            )}
          </div>

          {/* Email */}
          <div className="space-y-1.5">
            <label htmlFor="email" className="text-sm text-neutral-600 font-medium">
              Adresse email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
              placeholder="Entrez votre email..."
              required
              className={inputClass}
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
                name="password"
                type={showPassword ? 'text' : 'password'}
                value={form.password}
                onChange={handleChange}
                placeholder="Entrez votre mot de passe..."
                required
                className={inputClass}
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

          {/* Confirm Password */}
          <div className="space-y-1.5">
            <label htmlFor="password_confirmation" className="text-sm text-neutral-600 font-medium">
              Confirmer le mot de passe
            </label>
            <input
              id="password_confirmation"
              name="password_confirmation"
              type={showPassword ? 'text' : 'password'}
              value={form.password_confirmation}
              onChange={handleChange}
              placeholder="Confirmez votre mot de passe..."
              required
              className={inputClass}
            />
            {fieldErrors.password_confirmation && (
              <p className="text-xs text-red-500">{fieldErrors.password_confirmation[0]}</p>
            )}
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={submitting}
            className="w-full rounded-lg h-12 px-8 bg-neutral-800 text-white hover:bg-neutral-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {submitting ? (
              <span className="flex items-center justify-center gap-2">
                <span className="w-4 h-4 rounded-full border-2 border-white border-t-transparent animate-spin" />
                Création en cours…
              </span>
            ) : (
              'Créer votre compte'
            )}
          </button>

          {/* OR */}
          <div className="flex items-center gap-3">
            <div className="flex-1 h-px bg-neutral-200" />
            <span className="text-sm text-neutral-500">Ou inscrivez-vous avec</span>
            <div className="flex-1 h-px bg-neutral-200" />
          </div>

          {/* Google (placeholder) */}
          <button
            type="button"
            className="w-full rounded-lg py-2 px-4 border border-neutral-300 hover:bg-neutral-100 flex items-center justify-center gap-2 text-sm"
          >
            <FaGoogle size={16} />
            Google
          </button>

          {/* Login */}
          <div className="flex justify-center gap-2">
            <p className="text-sm text-neutral-600">Vous avez déjà un compte ?</p>
            <Link to="/signin" className="text-sm text-sky-600 hover:text-neutral-800">
              Connexion
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SignUp;