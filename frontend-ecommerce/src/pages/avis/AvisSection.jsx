import React, { useState, useEffect, useCallback } from 'react';
import { useSelector } from 'react-redux';
import { MessageSquare, User, ThumbsUp, AlertCircle, CheckCircle } from 'lucide-react';
import StarRating from './StarRating';
import { api } from '../../service/api';

// ============================================================
// AvisSection — section avis + formulaire notation
// Props :
//   produit_id : number
//   note_moyenne : number
//   nb_avis_initial : number
// ============================================================

// Carte d'un avis individuel
const AvisCard = ({ avis }) => {
  const date = new Date(avis.date_avis).toLocaleDateString('fr-FR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  const initiales = `${(avis.prenom || 'U')[0]}${(avis.nom || '')[0] || ''}`.toUpperCase();

  return (
    <div className="bg-white border border-gray-100 rounded-xl p-4 flex gap-3">
      {/* Avatar */}
      <div className="shrink-0 w-10 h-10 bg-[#008294]/10 rounded-full flex items-center justify-center">
        <span className="text-[#008294] font-semibold text-sm">{initiales}</span>
      </div>

      {/* Contenu */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between gap-2 flex-wrap">
          <span className="font-semibold text-gray-800 text-sm">
            {avis.prenom} {avis.nom}
          </span>
          <span className="text-xs text-gray-400">{date}</span>
        </div>

        <StarRating note={Number(avis.note)} size={14} className="mt-1" />

        {avis.commentaire && (
          <p className="text-sm text-gray-600 mt-2 leading-relaxed">
            {avis.commentaire}
          </p>
        )}
      </div>
    </div>
  );
};

// Résumé des notes (distribution)
const RepartitionNotes = ({ avis }) => {
  const counts = [5, 4, 3, 2, 1].map((note) => ({
    note,
    count: avis.filter((a) => Number(a.note) === note).length,
  }));
  const total = avis.length;

  return (
    <div className="flex flex-col gap-1.5">
      {counts.map(({ note, count }) => (
        <div key={note} className="flex items-center gap-2 text-xs">
          <span className="w-4 text-gray-500">{note}</span>
          <Star size={12} className="text-yellow-400 fill-yellow-400" />
          <div className="flex-1 bg-gray-100 rounded-full h-2 overflow-hidden">
            <div
              className="bg-yellow-400 h-2 rounded-full transition-all duration-500"
              style={{ width: total > 0 ? `${(count / total) * 100}%` : '0%' }}
            />
          </div>
          <span className="w-4 text-gray-400 text-right">{count}</span>
        </div>
      ))}
    </div>
  );
};

// Import manquant pour RepartitionNotes
import { Star } from 'lucide-react';

// Formulaire d'ajout d'avis
const FormulaireAvis = ({ produit_id, onAvisAjoute }) => {
  const { isAuthenticated, user } = useSelector((s) => s.auth);
  const [note, setNote] = useState(0);
  const [commentaire, setCommentaire] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [status, setStatus] = useState(null); // 'success' | 'error' | null
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (note === 0) {
      setStatus('error');
      setMessage('Veuillez sélectionner une note.');
      return;
    }

    setIsLoading(true);
    setStatus(null);

    try {
      const res = await api.post('/api/avis/ajouter.php', {
        produit_id,
        note,
        commentaire: commentaire.trim(),
      });

      if (res.data.success) {
        setStatus('success');
        setMessage('Votre avis a été soumis et est en attente de validation.');
        setNote(0);
        setCommentaire('');
        onAvisAjoute?.();
      } else {
        setStatus('error');
        setMessage(res.data.message || 'Erreur lors de la soumission.');
      }
    } catch (err) {
      setStatus('error');
      setMessage(err.response?.data?.message || 'Erreur serveur.');
    } finally {
      setIsLoading(false);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="bg-gray-50 border border-gray-100 rounded-xl p-6 text-center">
        <User size={32} className="text-gray-300 mx-auto mb-3" />
        <p className="text-gray-600 text-sm mb-3">
          Connectez-vous pour laisser un avis
        </p>
        <a
          href="/signin"
          className="inline-block bg-[#008294] text-white text-sm px-5 py-2.5 rounded-lg hover:bg-[#006b7a] transition-colors font-medium"
        >
          Se connecter
        </a>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-gray-50 border border-gray-100 rounded-xl p-5"
    >
      <h4 className="font-semibold text-gray-800 mb-4">Laisser un avis</h4>

      {/* Feedback */}
      {status === 'success' && (
        <div className="flex items-center gap-2 bg-green-50 text-green-700 text-sm px-4 py-3 rounded-lg mb-4">
          <CheckCircle size={16} />
          {message}
        </div>
      )}
      {status === 'error' && (
        <div className="flex items-center gap-2 bg-red-50 text-red-700 text-sm px-4 py-3 rounded-lg mb-4">
          <AlertCircle size={16} />
          {message}
        </div>
      )}

      {/* Note */}
      <div className="mb-4">
        <label className="text-sm font-medium text-gray-700 mb-2 block">
          Votre note <span className="text-red-500">*</span>
        </label>
        <StarRating
          note={note}
          onChange={setNote}
          size={28}
          showLabel={true}
        />
      </div>

      {/* Commentaire */}
      <div className="mb-4">
        <label className="text-sm font-medium text-gray-700 mb-2 block">
          Commentaire <span className="text-gray-400 font-normal">(optionnel)</span>
        </label>
        <textarea
          value={commentaire}
          onChange={(e) => setCommentaire(e.target.value)}
          placeholder="Partagez votre expérience avec ce produit..."
          rows={4}
          maxLength={500}
          className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#008294]/30 focus:border-[#008294] resize-none transition-colors"
        />
        <p className="text-xs text-gray-400 text-right mt-1">
          {commentaire.length}/500
        </p>
      </div>

      {/* Submit */}
      <button
        type="submit"
        disabled={isLoading || note === 0}
        className="w-full bg-[#008294] text-white py-3 rounded-xl font-semibold hover:bg-[#006b7a] transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm"
      >
        {isLoading ? 'Envoi en cours...' : 'Publier mon avis'}
      </button>
    </form>
  );
};

// ============================================================
// Composant principal AvisSection
// ============================================================
const AvisSection = ({ produit_id, note_moyenne = 0, nb_avis_initial = 0 }) => {
  const [avis, setAvis] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);
  const PER_PAGE = 5;

  const fetchAvis = useCallback(async (reset = false) => {
    setIsLoading(true);
    try {
      const currentPage = reset ? 1 : page;
      const res = await api.get('/api/avis/liste.php', {
        params: { produit_id, page: currentPage, limit: PER_PAGE },
      });

      if (res.data.success) {
        const nouveauxAvis = res.data.avis || [];
        setAvis((prev) => (reset ? nouveauxAvis : [...prev, ...nouveauxAvis]));
        setHasMore(nouveauxAvis.length === PER_PAGE);
        if (!reset) setPage((p) => p + 1);
      }
    } catch {
      // Silencieux — l'UI affiche simplement 0 avis
    } finally {
      setIsLoading(false);
    }
  }, [produit_id, page]);

  useEffect(() => {
    fetchAvis(true);
  }, [produit_id]);

  const handleAvisAjoute = () => {
    // Recharger depuis le début après ajout
    setPage(1);
    fetchAvis(true);
  };

  const noteMoyenne = note_moyenne > 0
    ? Number(note_moyenne)
    : avis.length > 0
    ? avis.reduce((s, a) => s + Number(a.note), 0) / avis.length
    : 0;

  return (
    <section className="mt-12">
      <div className="flex items-center gap-2 mb-6">
        <MessageSquare size={20} className="text-[#008294]" />
        <h2 className="text-xl font-bold text-gray-900">
          Avis clients
        </h2>
        {avis.length > 0 && (
          <span className="text-sm text-gray-400">
            ({avis.length} avis)
          </span>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

        {/* Colonne gauche — résumé + formulaire */}
        <div className="flex flex-col gap-6">

          {/* Résumé note globale */}
          {avis.length > 0 && (
            <div className="bg-white border border-gray-100 rounded-xl p-5 text-center">
              <div className="text-5xl font-bold text-gray-900 mb-1">
                {noteMoyenne.toFixed(1)}
              </div>
              <StarRating
                note={noteMoyenne}
                size={20}
                className="justify-center mb-2"
              />
              <p className="text-sm text-gray-400">
                {avis.length} avis
              </p>
              <div className="mt-4 border-t border-gray-50 pt-4">
                <RepartitionNotes avis={avis} />
              </div>
            </div>
          )}

          {/* Formulaire */}
          <FormulaireAvis
            produit_id={produit_id}
            onAvisAjoute={handleAvisAjoute}
          />
        </div>

        {/* Colonne droite — liste avis */}
        <div className="lg:col-span-2">
          {isLoading && avis.length === 0 ? (
            <div className="flex flex-col gap-3">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="bg-gray-100 rounded-xl h-24 animate-pulse" />
              ))}
            </div>
          ) : avis.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <MessageSquare size={40} className="text-gray-200 mb-3" />
              <p className="text-gray-500 font-medium">Aucun avis pour ce produit</p>
              <p className="text-gray-400 text-sm mt-1">
                Soyez le premier à donner votre avis !
              </p>
            </div>
          ) : (
            <div className="flex flex-col gap-3">
              {avis.map((a, i) => (
                <AvisCard key={`${a.user_id}-${i}`} avis={a} />
              ))}

              {/* Charger plus */}
              {hasMore && (
                <button
                  onClick={() => fetchAvis(false)}
                  disabled={isLoading}
                  className="w-full py-3 border border-gray-200 rounded-xl text-sm text-gray-600 hover:bg-gray-50 transition-colors disabled:opacity-50"
                >
                  {isLoading ? 'Chargement...' : 'Voir plus d\'avis'}
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default AvisSection;