import React, { useState, useRef } from 'react';

const SignalementForm = () => {
  const [formData, setFormData] = useState({
    reporterName: '', reporterRole: '', isAnonymous: false,
    village: '', childName: '', abuserName: '',
    urgencyLevel: 'moyen', description: '', files: [] 
  });

  // --- AUDIO LOGIC ---
  const [isRecording, setIsRecording] = useState(false);
  const [audioUrl, setAudioUrl] = useState(null);
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);

  // --- DICTATION LOGIC ---
  const [isListening, setIsListening] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({ ...formData, [name]: type === 'checkbox' ? checked : value });
  };

  // Gestion des fichiers (Photo/Vidéo + Audio)
  const handleFileChange = (e) => {
    const selectedFiles = Array.from(e.target.files);
    setFormData(prev => ({ ...prev, files: [...prev.files, ...selectedFiles] }));
  };

  const removeFile = (indexToRemove) => {
    setFormData(prev => ({
      ...prev,
      files: prev.files.filter((_, index) => index !== indexToRemove)
    }));
  };

  // --- SPEECH TO TEXT ---
  const toggleDictation = () => {
    if (isListening) { setIsListening(false); return; }
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) { alert("Navigateur non compatible"); return; }
    const recognition = new SpeechRecognition();
    recognition.lang = 'fr-FR';
    recognition.interimResults = false;
    setIsListening(true);
    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      setFormData(prev => ({ ...prev, description: prev.description + (prev.description ? " " : "") + transcript }));
      setIsListening(false);
    };
    recognition.onend = () => setIsListening(false);
    recognition.start();
  };

  // --- AUDIO RECORDING ---
  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorderRef.current = new MediaRecorder(stream);
      audioChunksRef.current = [];
      mediaRecorderRef.current.ondataavailable = (e) => e.data.size > 0 && audioChunksRef.current.push(e.data);
      mediaRecorderRef.current.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        const audioFile = new File([audioBlob], "note_vocale.webm", { type: 'audio/webm' });
        setAudioUrl(URL.createObjectURL(audioBlob));
        setFormData(prev => ({ ...prev, files: [...prev.files, audioFile] }));
        stream.getTracks().forEach(track => track.stop());
      };
      mediaRecorderRef.current.start();
      setIsRecording(true);
    } catch (err) { alert("Erreur Micro"); }
  };
  const stopRecording = () => { mediaRecorderRef.current.stop(); setIsRecording(false); };

  // --- THEME DYNAMIQUE ---
  const isCritical = formData.urgencyLevel === 'critique';

  return (
    <div className={`min-h-screen py-10 px-4 transition-all duration-700 ease-in-out flex items-center justify-center font-sans ${isCritical ? 'bg-gradient-to-br from-red-900 via-red-800 to-black' : 'bg-gradient-to-br from-slate-100 via-blue-50 to-indigo-100'}`}>
      
      <div className={`max-w-2xl w-full bg-white rounded-[2rem] shadow-2xl overflow-hidden transition-all duration-500 ${isCritical ? 'shadow-red-900/50 ring-4 ring-red-500 transform scale-[1.01]' : 'shadow-slate-300/60'}`}>
        
        {/* HEADER */}
        <div className="relative h-64 w-full">
          
          {/* --- LOGO SOS (CERCLE PLEIN) --- */}
          <div className="absolute top-5 left-5 z-20">
             <img 
               src="https://jamaity.org/wp-content/uploads/2014/05/logo_ong_sosvillage.jpg" 
               alt="Logo SOS Villages d'Enfants Tunisie" 
               className="w-20 h-20 rounded-full object-cover shadow-xl border-4 border-white"
             />
          </div>
          {/* ------------------------------- */}

          <img 
            src="https://images.unsplash.com/photo-1516585427167-9f4af9627e6c?q=80&w=800&auto=format&fit=crop" 
            alt="Header" 
            className={`w-full h-full object-cover transition-all duration-700 ${isCritical ? 'filter grayscale contrast-150 brightness-50' : 'filter brightness-75'}`} 
          />
          <div className={`absolute inset-0 bg-gradient-to-t ${isCritical ? 'from-red-900/90 to-transparent' : 'from-blue-900/80 to-transparent'}`}></div>
          
          <div className="absolute bottom-0 left-0 p-8 w-full">
            {isCritical && (
              <div className="inline-flex items-center px-3 py-1 rounded-full bg-red-600 text-white text-xs font-bold uppercase tracking-widest mb-2 animate-pulse">
                ⚠️ Urgence Critique
              </div>
            )}
            <h1 className="text-4xl font-extrabold text-white tracking-tight drop-shadow-md">Signalement</h1>
            <p className="text-blue-100 mt-1 font-medium text-lg opacity-90">Plateforme de protection de l'enfance SOS</p>
          </div>
        </div>

        {/* FORM BODY */}
        <div className="p-8 space-y-8">

          {/* 1. IDENTITÉ */}
          <div className="bg-slate-50 rounded-2xl p-6 border border-slate-100 shadow-sm relative hover:border-blue-200 transition-colors">
             <div className="flex justify-between items-center mb-4">
                <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest">1. Identité</h3>
                <label className="flex items-center cursor-pointer select-none">
                  <span className="mr-3 text-sm font-semibold text-slate-500">Mode Anonyme</span>
                  <div className="relative">
                    <input type="checkbox" name="isAnonymous" checked={formData.isAnonymous} onChange={handleChange} className="sr-only" />
                    <div className={`block w-14 h-8 rounded-full transition-colors duration-300 ${formData.isAnonymous ? 'bg-slate-700' : 'bg-slate-300'}`}></div>
                    <div className={`absolute left-1 top-1 bg-white w-6 h-6 rounded-full transition-transform duration-300 shadow-md ${formData.isAnonymous ? 'transform translate-x-6' : ''}`}></div>
                  </div>
                </label>
             </div>
             <div className={`overflow-hidden transition-all duration-500 ease-in-out ${formData.isAnonymous ? 'max-h-0 opacity-0' : 'max-h-40 opacity-100'}`}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                  <input type="text" name="reporterName" className="w-full px-4 py-3 rounded-xl bg-white border border-slate-200 outline-none focus:ring-2 focus:ring-blue-500/20" placeholder="Nom complet" />
                  
                  <select name="reporterRole" className="w-full px-4 py-3 rounded-xl bg-white border border-slate-200 outline-none text-slate-600">
                      <option>Rôle...</option>
                      <option>Mère SOS</option>
                      <option>Tante SOS</option>
                      <option>Éducateur</option>
                      <option>Éducateur Polyvalent</option>
                      <option>Psychologue</option>
                      <option>Directeur</option>
                  </select>

                </div>
             </div>
          </div>

          {/* 2. LOCALISATION & ENFANT */}
          <div className="bg-indigo-50/50 rounded-2xl p-6 border border-indigo-100 shadow-sm">
             <div className="flex items-center mb-4 text-indigo-900">
                <div className="p-2 bg-indigo-100 rounded-lg mr-3">
                  <svg className="w-5 h-5 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /></svg>
                </div>
                <h3 className="text-sm font-bold uppercase tracking-widest">2. Localisation & Enfant</h3>
             </div>
             <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <select name="village" value={formData.village} onChange={handleChange} className="w-full px-4 py-3 rounded-xl bg-white border-2 border-indigo-50 focus:border-indigo-500 outline-none font-medium text-indigo-900">
                   <option value="">Choisir un village...</option><option value="gammarth">Gammarth</option><option value="siliana">Siliana</option><option value="mahres">Mahrès</option><option value="akouda">Akouda</option>
                </select>
                <input type="text" name="childName" placeholder="Nom de l'enfant" onChange={handleChange} className="w-full px-4 py-3 rounded-xl bg-white border-2 border-indigo-50 focus:border-indigo-500 outline-none font-medium text-indigo-900" />
             </div>
          </div>

          {/* 3. URGENCE */}
          <div className="grid grid-cols-3 gap-4">
              {['bas', 'moyen', 'critique'].map((level) => (
                <button key={level} type="button" onClick={() => setFormData({ ...formData, urgencyLevel: level })} 
                  className={`py-4 rounded-xl font-bold text-sm uppercase tracking-wide transition-all duration-300 border border-transparent 
                  ${formData.urgencyLevel === level 
                    ? (level === 'critique' ? 'bg-red-600 text-white shadow-lg scale-105' : level === 'moyen' ? 'bg-orange-500 text-white shadow-lg scale-105' : 'bg-emerald-500 text-white shadow-lg scale-105') 
                    : 'bg-slate-50 text-slate-500 hover:bg-slate-100'}`}>
                  {level}
                </button>
              ))}
          </div>

          {/* 4. DESCRIPTION + IA */}
          <div className="relative group">
            <div className="flex justify-between items-end mb-2">
              <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest ml-1">4. Description</h3>
              <button type="button" onClick={toggleDictation} className={`flex items-center px-4 py-1.5 rounded-full text-xs font-bold transition-all shadow-sm ${isListening ? 'bg-blue-600 text-white animate-pulse' : 'bg-white text-slate-600 border border-slate-200'}`}>
                {isListening ? "🎙️ Écoute..." : "✨ Dictée IA"}
              </button>
            </div>
            <textarea name="description" value={formData.description} rows="5" className="w-full p-5 rounded-2xl bg-slate-50 border-2 border-transparent focus:bg-white focus:border-blue-400 focus:shadow-xl outline-none resize-none" placeholder="Décrivez les faits..." onChange={handleChange}></textarea>
          </div>

          {/* 5. PREUVES (AUDIO + PHOTOS/VIDEOS) */}
          <div className="bg-slate-900 rounded-2xl p-6 text-white shadow-xl relative overflow-hidden">
             {/* Décoration de fond */}
             <div className="absolute top-0 right-0 -mr-10 -mt-10 w-40 h-40 rounded-full bg-slate-800 opacity-50 blur-2xl"></div>
             
             <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-6 relative z-10">5. Preuves (Audio, Photo, Vidéo)</h3>
             
             <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 relative z-10">
                
                {/* ZONE 1 : AUDIO */}
                <div className="bg-slate-800/50 rounded-xl p-4 border border-slate-700 flex flex-col items-center justify-center text-center">
                   {!audioUrl ? (
                     <>
                        <button type="button" onClick={isRecording ? stopRecording : startRecording} className={`w-14 h-14 rounded-full flex items-center justify-center transition-all shadow-lg mb-2 ${isRecording ? 'bg-red-500 animate-pulse' : 'bg-white text-slate-900'}`}>
                          {isRecording ? <div className="w-5 h-5 bg-white rounded"></div> : <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" /></svg>}
                        </button>
                        <span className="text-xs font-medium text-slate-400">{isRecording ? "Enregistrement..." : "Note Vocale"}</span>
                     </>
                   ) : (
                     <div className="w-full">
                       <div className="flex items-center justify-center mb-2 text-green-400 text-xs font-bold">✓ Audio OK</div>
                       <audio src={audioUrl} controls className="w-full h-8 opacity-90 scale-90" />
                       <button type="button" onClick={() => setAudioUrl(null)} className="text-xs text-red-400 underline mt-1">Supprimer</button>
                     </div>
                   )}
                </div>

                {/* ZONE 2 : PHOTOS / VIDEOS */}
                <div className="bg-slate-800/50 rounded-xl p-4 border border-slate-700 flex flex-col items-center justify-center text-center relative hover:bg-slate-800 transition-colors cursor-pointer group">
                   <input type="file" multiple accept="image/*,video/*" onChange={handleFileChange} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-20" />
                   <div className="w-14 h-14 rounded-full bg-slate-700 flex items-center justify-center mb-2 group-hover:bg-slate-600 transition-colors">
                      <svg className="w-6 h-6 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                   </div>
                   <span className="text-xs font-medium text-slate-400 group-hover:text-slate-200">Ajouter Photos/Vidéos</span>
                </div>
             </div>

             {/* Liste des fichiers ajoutés */}
             {formData.files.length > 0 && (
               <div className="mt-6 space-y-2 relative z-10">
                 <p className="text-xs font-bold text-slate-500 uppercase">Fichiers joints ({formData.files.length})</p>
                 {formData.files.map((file, index) => (
                   <div key={index} className="flex items-center justify-between bg-slate-800 p-2 rounded-lg border border-slate-700/50">
                      <div className="flex items-center overflow-hidden">
                        <span className="w-2 h-2 rounded-full bg-blue-500 mr-2 flex-shrink-0"></span>
                        <span className="text-xs text-slate-300 truncate">{file.name}</span>
                      </div>
                      <button type="button" onClick={() => removeFile(index)} className="text-slate-500 hover:text-red-400 ml-2">
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
                      </button>
                   </div>
                 ))}
               </div>
             )}
          </div>

          {/* SUBMIT */}
          <button type="button" className={`w-full py-5 rounded-2xl font-black text-lg text-white shadow-xl transition-all duration-300 transform hover:-translate-y-1 ${isCritical ? 'bg-red-600 hover:bg-red-700 shadow-red-500/40' : 'bg-gradient-to-r from-blue-600 to-indigo-600 shadow-blue-500/40'}`}>
            {isCritical ? "⚠️ LANCER L'ALERTE" : "Envoyer le Signalement"}
          </button>

        </div>
      </div>
    </div>
  );
};

export default SignalementForm;