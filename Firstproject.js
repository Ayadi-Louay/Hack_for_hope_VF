import React, { useState } from 'react';

const SignalementForm = () => {
  // 1. État pour gérer les données du formulaire
  const [formData, setFormData] = useState({
    isAnonymous: false,      // 
    village: '',             // 
    childName: '',           // 
    abuserName: '',          // 
    incidentType: '',        // 
    urgencyLevel: 'medium',  // 
    description: '',         // 
    files: null              // 
  });

  const [loading, setLoading] = useState(false);

  // Gestion des changements dans les champs textes/select
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  // Gestion des fichiers (Photo, Audio, Vidéo)
  const handleFileChange = (e) => {
    setFormData({ ...formData, files: e.target.files });
  };

  // Soumission du formulaire
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    // Simulation d'envoi (Ici, vous connecterez votre API Backend Django/Node)
    console.log("Données envoyées :", formData);
    
    setTimeout(() => {
      alert("Signalement enregistré avec succès !");
      setLoading(false);
      // Réinitialiser ou rediriger
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl overflow-hidden">
        
        {/* En-tête */}
        <div className="bg-blue-600 p-6">
          <h2 className="text-2xl font-bold text-white text-center">Nouveau Signalement</h2>
          <p className="text-blue-100 text-center text-sm mt-2">
            Espace sécurisé - Hack for Hope
          </p>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">

          {/* Section 1 : Contexte */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Programme / Village */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Village SOS</label>
              <select 
                name="village" 
                value={formData.village} 
                onChange={handleChange}
                required
                className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Sélectionner un village...</option>
                <option value="gammarth">Gammarth</option>
                <option value="siliana">Siliana</option>
                <option value="mahrares">Mahres</option>
                <option value="akouda">Akouda</option>
              </select>
            </div>

            {/* Anonymat */}
            <div className="flex items-center mt-6">
              <input
                type="checkbox"
                name="isAnonymous"
                id="isAnonymous"
                checked={formData.isAnonymous}
                onChange={handleChange}
                className="h-5 w-5 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
              />
              <label htmlFor="isAnonymous" className="ml-2 block text-sm text-gray-900 font-semibold">
                Je souhaite rester anonyme
              </label>
            </div>
          </div>

          <hr className="border-gray-200" />

          {/* Section 2 : Personnes concernées */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-800">Personnes concernées</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Nom de l'enfant */}
              <div>
                <label className="block text-sm font-medium text-gray-700">Nom & Prénom de l'enfant</label>
                <input
                  type="text"
                  name="childName"
                  value={formData.childName}
                  onChange={handleChange}
                  required
                  className="mt-1 w-full p-2 border border-gray-300 rounded focus:ring-blue-500"
                  placeholder="Enfant concerné"
                />
              </div>

              {/* Nom de l'abuseur */}
              <div>
                <label className="block text-sm font-medium text-gray-700">Nom & Prénom de l'auteur présumé</label>
                <input
                  type="text"
                  name="abuserName"
                  value={formData.abuserName}
                  onChange={handleChange}
                  className="mt-1 w-full p-2 border border-gray-300 rounded focus:ring-blue-500"
                  placeholder="Laisser vide si inconnu"
                />
              </div>
            </div>
          </div>

          <hr className="border-gray-200" />

          {/* Section 3 : Détails de l'incident */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-800">Détails de l'incident</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Type d'incident */}
              <div>
                <label className="block text-sm font-medium text-gray-700">Type d'incident</label>
                <select
                  name="incidentType"
                  value={formData.incidentType}
                  onChange={handleChange}
                  required
                  className="mt-1 w-full p-2 border border-gray-300 rounded focus:ring-blue-500"
                >
                  <option value="">Choisir un type...</option>
                  <option value="sante">Santé / Médical</option>
                  <option value="comportement">Comportemental</option>
                  <option value="violence">Violence / Maltraitance</option>
                  <option value="conflit">Conflit</option>
                  <option value="autre">Autre</option>
                </select>
              </div>

              {/* Niveau d'urgence */}
              <div>
                <label className="block text-sm font-medium text-gray-700">Niveau d'urgence</label>
                <div className="mt-2 flex space-x-4">
                  {['bas', 'moyen', 'critique'].map((level) => (
                    <label key={level} className="inline-flex items-center">
                      <input
                        type="radio"
                        name="urgencyLevel"
                        value={level}
                        checked={formData.urgencyLevel === level}
                        onChange={handleChange}
                        className="form-radio text-blue-600"
                      />
                      <span className={`ml-2 capitalize ${level === 'critique' ? 'text-red-600 font-bold' : 'text-gray-700'}`}>
                        {level}
                      </span>
                    </label>
                  ))}
                </div>
              </div>
            </div>

            {/* Description (Champ libre) */}
            <div>
              <label className="block text-sm font-medium text-gray-700">Description détaillée</label>
              <textarea
                name="description"
                rows="4"
                value={formData.description}
                onChange={handleChange}
                required
                className="mt-1 w-full p-2 border border-gray-300 rounded focus:ring-blue-500"
                placeholder="Décrivez les faits de manière objective..."
              ></textarea>
            </div>

            {/* Pièces jointes (Photo/Audio/Vidéo) */}
            <div>
              <label className="block text-sm font-medium text-gray-700">Preuves (Photo, Audio, Vidéo)</label>
              <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md bg-gray-50">
                <div className="space-y-1 text-center">
                  <svg className="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48">
                    <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  <div className="flex text-sm text-gray-600">
                    <label htmlFor="file-upload" className="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none">
                      <span>Télécharger un fichier</span>
                      <input id="file-upload" name="file-upload" type="file" className="sr-only" multiple onChange={handleFileChange} />
                    </label>
                  </div>
                  <p className="text-xs text-gray-500">PNG, JPG, MP3, MP4 jusqu'à 10MB</p>
                </div>
              </div>
            </div>
          </div>

          {/* Bouton de soumission */}
          <div className="pt-4">
            <button
              type="submit"
              disabled={loading}
              className={`w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white 
                ${loading ? 'bg-blue-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500'}`}
            >
              {loading ? 'Envoi en cours...' : 'Envoyer le Signalement'}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};

export default SignalementForm;