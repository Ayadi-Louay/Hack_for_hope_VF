import React, { useState } from 'react';

// --- LIENS & ASSETS ---
const sosLogo = "https://jamaity.org/wp-content/uploads/2014/05/logo_ong_sosvillage.jpg";

// --- DONNÉES SIMULÉES ---
const INITIAL_REPORTS = [
  {
    id: 1,
    reporter: "Amel Ben Ali", role: "Mère SOS", village: "Gammarth", child: "Sami T.", date: "14 Fév 2026",
    urgency: "critique", status: "en_cours", category: "sauvegarde",
    description: "Sami présente des signes de retrait social soudain et refuse de manger depuis deux jours. J'ai remarqué des ecchymoses.",
    audio: true, photos: 2,
    ai_analysis: { score: 92, sentiment: "Détresse Élevée", tags: ["Violence Physique", "Trouble Alimentaire"], summary: "Signalement critique. Intervention immédiate recommandée." },
    process: [
      { step: 1, label: "Fiche Initiale", status: "completed", date: "14 Fév", doc: "DPE_Sami.pdf" },
      { step: 2, label: "Évaluation", status: "current", date: "En cours", doc: null },
      { step: 3, label: "Plan d'action", status: "pending", date: "-", doc: null },
      { step: 4, label: "Suivi", status: "pending", date: "-", doc: null },
      { step: 5, label: "Clôture", status: "pending", date: "-", doc: null },
    ],
    comments: [
        { user: "Amel Ben Ali", role: "Mère SOS", text: "J'ai essayé de lui parler ce matin, il refuse de sortir de sa chambre.", date: "14 Fév 08:30" },
        { user: "Admin (Vous)", role: "Direction", text: "Merci Amel. Le psychologue du village passera à 14h.", date: "14 Fév 09:15" }
    ]
  },
  {
    id: 2,
    reporter: "Anonyme", role: "Éducateur", village: "Siliana", child: "Ines K.", date: "13 Fév 2026",
    urgency: "moyen", status: "nouveau", category: "en_attente",
    description: "Absences répétées à l'école sans justification valable de la part de la famille biologique.",
    audio: false, photos: 0,
    ai_analysis: { score: 45, sentiment: "Préoccupant", tags: ["Négligence Éducative"], summary: "Risque modéré lié à la scolarité." },
    process: [
      { step: 1, label: "Fiche Initiale", status: "current", date: "13 Fév", doc: null },
      { step: 2, label: "Évaluation", status: "pending", date: "-", doc: null },
      { step: 3, label: "Plan d'action", status: "pending", date: "-", doc: null },
      { step: 4, label: "Suivi", status: "pending", date: "-", doc: null },
      { step: 5, label: "Clôture", status: "pending", date: "-", doc: null },
    ],
    comments: []
  },
  {
    id: 3,
    reporter: "Karim Z.", role: "Directeur", village: "Akouda", child: "Groupe Cadets", date: "10 Fév 2026",
    urgency: "bas", status: "cloture", category: "faux",
    description: "Conflit mineur entre deux enfants concernant le partage des jouets.",
    audio: true, photos: 1,
    ai_analysis: { score: 12, sentiment: "Neutre", tags: ["Conflit Relationnel"], summary: "Incident mineur géré en interne." },
    process: [
      { step: 1, label: "Fiche Initiale", status: "completed", date: "10 Fév", doc: "Note.pdf" },
      { step: 2, label: "Évaluation", status: "skipped", date: "-", doc: null },
      { step: 3, label: "Plan d'action", status: "skipped", date: "-", doc: null },
      { step: 4, label: "Suivi", status: "skipped", date: "-", doc: null },
      { step: 5, label: "Clôture", status: "completed", date: "10 Fév", doc: "Final.pdf" },
    ],
    comments: []
  }
];

const CHART_DATA = {
  bars: [4, 6, 3, 8, 5, 9, 12],
  labels: ['Aou', 'Sep', 'Oct', 'Nov', 'Dec', 'Jan', 'Fév'],
};

const Dashboard = () => {
  const [reports, setReports] = useState(INITIAL_REPORTS);
  const [filter, setFilter] = useState('tout');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedReport, setSelectedReport] = useState(null);
  const [modalTab, setModalTab] = useState('dossier');

  const filteredReports = reports.filter(r => {
    const statusMatch = filter === 'tout' ? true : r.status === filter;
    const searchMatch = r.child.toLowerCase().includes(searchTerm.toLowerCase()) || 
                        r.village.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        r.description.toLowerCase().includes(searchTerm.toLowerCase());
    return statusMatch && searchMatch;
  });

  const stats = {
    total: reports.length,
    urgent: reports.filter(r => r.urgency === 'critique').length,
    pending: reports.filter(r => r.status === 'nouveau').length,
    closed: reports.filter(r => r.status === 'cloture').length
  };

  const updateCategory = (id, newCategory) => {
    const updated = reports.map(r => r.id === id ? { ...r, category: newCategory } : r);
    setReports(updated);
    if (selectedReport && selectedReport.id === id) setSelectedReport({ ...selectedReport, category: newCategory });
  };

  const addComment = (text) => {
    if(!text) return;
    const newComment = { user: "Admin (Vous)", role: "Direction", text: text, date: "À l'instant" };
    const updatedReport = { ...selectedReport, comments: [...selectedReport.comments, newComment] };
    
    setReports(reports.map(r => r.id === selectedReport.id ? updatedReport : r));
    setSelectedReport(updatedReport);
  };

  return (
    <div className="flex h-screen bg-slate-50 font-sans text-slate-600 overflow-hidden selection:bg-sky-200">
      
      {/* --- SIDEBAR --- */}
      <aside className="w-72 bg-gradient-to-b from-sky-600 to-blue-700 text-white flex flex-col shadow-2xl z-20 hidden md:flex">
        <div className="p-8 flex items-center border-b border-white/10">
          {/* MODIFICATION ICI : Logo plus grand et sans padding */}
          <div className="w-14 h-14 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 mr-4 flex items-center justify-center shadow-inner overflow-hidden">
             <img src={sosLogo} alt="SOS" className="w-full h-full object-cover" />
          </div>
          <div>
            <h1 className="font-bold text-xl tracking-tight">SOS Admin</h1>
            <p className="text-xs text-sky-200">Niveau 2 • IA Active</p>
          </div>
        </div>
        
        <nav className="flex-1 py-8 space-y-3 px-6">
          <NavItem icon={<DashboardIcon />} label="Tableau de bord" active />
          <NavItem icon={<StatsIcon />} label="Analyses IA" />
          <NavItem icon={<UsersIcon />} label="Équipes & Villages" />
          <NavItem icon={<CalendarIcon />} label="Calendrier" />
        </nav>

        <div className="p-6">
            <div className="bg-blue-800/40 rounded-xl p-4 border border-blue-500/30 backdrop-blur-sm">
                <div className="flex items-center justify-between mb-2">
                    <span className="text-xs text-blue-200 font-bold uppercase">Prochaine Échéance</span>
                    <span className="text-[10px] bg-red-500 text-white px-1.5 py-0.5 rounded">J-1</span>
                </div>
                <p className="text-sm font-medium text-white">Comité Village Gammarth</p>
                <p className="text-xs text-blue-300 mt-1">15 Fév, 14:00</p>
            </div>
        </div>
      </aside>

      {/* --- MAIN CONTENT --- */}
      <main className="flex-1 flex flex-col overflow-hidden relative bg-slate-50/50">
        
        {/* HEADER */}
        <header className="bg-white/80 backdrop-blur-xl h-24 flex items-center justify-between px-10 z-10 sticky top-0 border-b border-slate-200/60">
          <div>
            <h2 className="text-3xl font-black text-slate-800 tracking-tight">Tableau de bord</h2>
            <p className="text-sm text-slate-400 font-medium mt-1">Supervision globale et analyse de risques</p>
          </div>
          
          <div className="flex items-center space-x-4">
             <div className="relative hidden lg:block group">
                <SearchIcon className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 group-focus-within:text-sky-500 transition-colors" />
                <input 
                    type="text" 
                    placeholder="Rechercher dossier, village..." 
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 pr-4 py-2.5 bg-slate-100 border-none rounded-full w-64 text-sm font-medium focus:ring-2 focus:ring-sky-200 focus:bg-white transition-all outline-none placeholder:text-slate-400"
                />
             </div>

             <div className="h-8 w-px bg-slate-200 mx-2"></div>

             <button className="w-10 h-10 rounded-full bg-white border border-slate-200 flex items-center justify-center text-slate-400 hover:text-sky-600 transition shadow-sm relative">
               <span className="absolute top-2 right-2.5 w-2 h-2 bg-red-500 rounded-full border border-white animate-pulse"></span>
               <BellIcon />
             </button>
             <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-sky-400 to-blue-500 text-white flex items-center justify-center font-bold shadow-lg shadow-sky-200">
                A
             </div>
          </div>
        </header>

        {/* SCROLLABLE AREA */}
        <div className="flex-1 overflow-y-auto p-10 custom-scrollbar">
          
          {/* STATS CARDS */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <StatCard title="Total Signalements" value={stats.total} color="text-sky-600" bg="bg-sky-50" icon={<FileIcon />} />
            <StatCard title="Urgence Critique" value={stats.urgent} color="text-red-500" bg="bg-red-50" icon={<AlertIcon />} />
            <StatCard title="À Traiter" value={stats.pending} color="text-orange-500" bg="bg-orange-50" icon={<NewIcon />} />
            <StatCard title="Clôturés" value={stats.closed} color="text-emerald-500" bg="bg-emerald-50" icon={<CheckIcon />} />
          </div>

          {/* GRAPHIQUES */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-10">
            {/* Histogramme */}
            <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-[0_4px_20px_-10px_rgba(0,0,0,0.05)]">
                <div className="flex justify-between items-center mb-6">
                    <div>
                        <h3 className="font-bold text-lg text-slate-800">Évolution des Signalements</h3>
                        <p className="text-xs text-slate-400">7 derniers mois</p>
                    </div>
                    <div className="bg-sky-50 text-sky-600 p-2 rounded-lg"><ChartBarIcon /></div>
                </div>
                <div className="h-40 flex items-end justify-between space-x-2 px-2">
                    {CHART_DATA.bars.map((val, idx) => (
                        <div key={idx} className="flex flex-col items-center flex-1 group">
                            <div className="relative w-full flex justify-end flex-col items-center h-full">
                                <div className="text-[10px] font-bold text-sky-600 opacity-0 group-hover:opacity-100 transition-opacity absolute -top-4">{val}</div>
                                <div style={{ height: `${(val / 15) * 100}%` }} className={`w-full max-w-[30px] rounded-t-lg transition-all duration-500 ${idx === 6 ? 'bg-sky-500 shadow-lg shadow-sky-200' : 'bg-slate-100 hover:bg-sky-300'}`}></div>
                            </div>
                            <span className="text-[10px] font-bold text-slate-400 mt-2 uppercase">{CHART_DATA.labels[idx]}</span>
                        </div>
                    ))}
                </div>
            </div>

            {/* Courbe IA (SVG) */}
            <div className="bg-gradient-to-br from-indigo-50 to-white p-6 rounded-3xl border border-indigo-100 shadow-[0_4px_20px_-10px_rgba(0,0,0,0.05)] relative overflow-hidden">
                <div className="absolute top-0 right-0 w-40 h-40 bg-purple-200/20 rounded-full blur-3xl -mr-10 -mt-10"></div>
                <div className="flex justify-between items-center mb-6 relative z-10">
                    <div>
                        <h3 className="font-bold text-lg text-indigo-900 flex items-center"><AiStarIcon className="w-4 h-4 mr-2 text-indigo-500" />Analyse de Risque</h3>
                        <p className="text-xs text-indigo-400">Prédiction basée sur l'IA</p>
                    </div>
                    <span className="bg-indigo-100 text-indigo-600 text-xs font-bold px-3 py-1 rounded-full">+12% vs Jan</span>
                </div>
                <div className="h-40 w-full relative z-10 flex items-end">
                     <svg className="w-full h-full overflow-visible" preserveAspectRatio="none" viewBox="0 0 100 100">
                         <defs>
                             <linearGradient id="gradient" x1="0%" y1="0%" x2="0%" y2="100%">
                                 <stop offset="0%" stopColor="#6366f1" stopOpacity="0.3" />
                                 <stop offset="100%" stopColor="#6366f1" stopOpacity="0" />
                             </linearGradient>
                         </defs>
                         <polygon points="0,100 0,80 16,65 32,70 48,50 64,55 80,35 100,20 100,100" fill="url(#gradient)" />
                         <polyline points="0,80 16,65 32,70 48,50 64,55 80,35 100,20" fill="none" stroke="#4f46e5" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="drop-shadow-md" />
                         <circle cx="100" cy="20" r="4" fill="#4f46e5" className="animate-ping opacity-75" />
                         <circle cx="100" cy="20" r="4" fill="#4f46e5" />
                     </svg>
                </div>
            </div>
          </div>

          {/* LISTE DES DOSSIERS AVEC FILTRES */}
          <div className="flex flex-col md:flex-row justify-between items-center mb-8">
            <div className="flex space-x-2 bg-white p-1.5 rounded-full shadow-sm border border-slate-200 overflow-x-auto max-w-full">
              {['tout', 'nouveau', 'en_cours', 'cloture'].map(f => (
                <button key={f} onClick={() => setFilter(f)} className={`px-6 py-2.5 rounded-full text-sm font-bold capitalize whitespace-nowrap transition-all ${filter === f ? 'bg-slate-800 text-white shadow-md' : 'text-slate-500 hover:bg-slate-50 hover:text-slate-700'}`}>{f.replace('_', ' ')}</button>
              ))}
            </div>
            <div className="text-xs font-bold text-slate-400 mt-4 md:mt-0 uppercase tracking-wide">
                {filteredReports.length} Dossier{filteredReports.length > 1 ? 's' : ''} trouvé{filteredReports.length > 1 ? 's' : ''}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 pb-10">
            {filteredReports.map(report => (
              <div 
                key={report.id} onClick={() => { setSelectedReport(report); setModalTab('dossier'); }}
                className="bg-white rounded-3xl p-7 shadow-sm hover:shadow-xl transition-all duration-300 border border-slate-100 cursor-pointer group hover:-translate-y-1 relative overflow-hidden"
              >
                <div className={`absolute left-0 top-0 bottom-0 w-1.5 ${report.urgency === 'critique' ? 'bg-red-500' : report.urgency === 'moyen' ? 'bg-orange-400' : 'bg-emerald-400'}`}></div>

                <div className="flex justify-between items-start mb-5 pl-2">
                  <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wide border ${report.category === 'sauvegarde' ? 'bg-red-50 text-red-600 border-red-100' : report.category === 'faux' ? 'bg-slate-50 text-slate-500 border-slate-200' : 'bg-blue-50 text-blue-600 border-blue-100'}`}>
                    {report.category.replace(/_/g, ' ')}
                  </span>
                  <div className="flex items-center space-x-1 bg-indigo-50 px-2 py-1 rounded-lg border border-indigo-100">
                     <AiStarIcon className="w-3 h-3 text-indigo-500" /><span className="text-xs font-bold text-indigo-700">{report.ai_analysis.score}%</span>
                  </div>
                </div>

                <div className="pl-2">
                    <h3 className="font-bold text-xl text-slate-800 mb-1 group-hover:text-sky-600 transition-colors">{report.child}</h3>
                    <p className="text-sm text-slate-400 mb-5 flex items-center font-medium"><LocationIcon className="w-4 h-4 mr-1.5 text-slate-300" /> {report.village} • {report.date}</p>
                    <p className="text-slate-600 text-sm line-clamp-2 mb-5 leading-relaxed">{report.description}</p>
                    <div className="flex items-center justify-between pt-4 border-t border-slate-50">
                        <div className="flex items-center space-x-2">
                            {report.audio && <div className="w-8 h-8 rounded-full bg-sky-50 text-sky-500 flex items-center justify-center"><MicIcon className="w-4 h-4"/></div>}
                            {report.comments.length > 0 && <div className="w-8 h-8 rounded-full bg-emerald-50 text-emerald-500 flex items-center justify-center"><ChatIcon className="w-4 h-4"/></div>}
                        </div>
                        <div className="text-xs font-bold text-slate-400 flex items-center">
                           <span className="w-2 h-2 rounded-full bg-blue-500 mr-2 animate-pulse"></span>
                           Étape {report.process.filter(p => p.status === 'completed').length + 1}/5
                        </div>
                    </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>

      {/* --- MODAL AVANCÉE (Avec Onglets) --- */}
      {selectedReport && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-6xl max-h-[95vh] rounded-[2rem] shadow-2xl overflow-hidden flex flex-col md:flex-row animate-scaleIn">
            
            {/* COLONNE GAUCHE PRINCIPALE */}
            <div className="flex-1 flex flex-col min-h-0 bg-slate-50 relative">
               
               {/* Header Modal + Boutons Onglets */}
               <div className="p-8 pb-0">
                   <div className="flex justify-between items-start mb-6">
                        <div>
                            <div className="inline-flex items-center space-x-2 bg-sky-100 px-3 py-1 rounded-full text-sky-700 text-xs font-bold mb-3 uppercase tracking-wide">
                                <LocationIcon className="w-3 h-3"/> <span>{selectedReport.village}</span>
                            </div>
                            <h2 className="text-3xl font-black text-slate-800">{selectedReport.child}</h2>
                        </div>
                        <button onClick={() => setSelectedReport(null)} className="w-10 h-10 bg-white shadow-sm rounded-full flex items-center justify-center text-slate-400 hover:text-red-500 transition"><CloseIcon /></button>
                   </div>

                   <div className="flex space-x-6 border-b border-slate-200">
                       <button onClick={() => setModalTab('dossier')} className={`pb-4 text-sm font-bold transition border-b-2 ${modalTab === 'dossier' ? 'border-sky-500 text-sky-600' : 'border-transparent text-slate-400 hover:text-slate-600'}`}>
                           Dossier & Analyse
                       </button>
                       <button onClick={() => setModalTab('discussion')} className={`pb-4 text-sm font-bold transition border-b-2 flex items-center ${modalTab === 'discussion' ? 'border-sky-500 text-sky-600' : 'border-transparent text-slate-400 hover:text-slate-600'}`}>
                           Discussion & Équipe
                           <span className="ml-2 bg-slate-200 text-slate-600 text-[10px] px-1.5 py-0.5 rounded-full">{selectedReport.comments.length}</span>
                       </button>
                   </div>
               </div>

               {/* Contenu Scrollable (Onglets) */}
               <div className="flex-1 overflow-y-auto p-8 custom-scrollbar">
                  
                  {modalTab === 'dossier' ? (
                      <div className="animate-fadeIn">
                        {/* CONTENU DOSSIER */}
                        <div className="bg-gradient-to-br from-indigo-50 via-white to-purple-50 p-6 rounded-3xl border border-indigo-100 mb-6 shadow-sm">
                            <div className="flex items-center mb-4">
                                <div className="w-8 h-8 bg-indigo-500 rounded-lg flex items-center justify-center text-white mr-3 shadow-lg shadow-indigo-200"><AiStarIcon className="w-5 h-5" /></div>
                                <h3 className="font-bold text-lg text-indigo-900">Analyse IA</h3>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                <div className="text-center bg-white/60 p-3 rounded-xl border border-indigo-50">
                                    <p className="text-xs font-bold text-indigo-400 uppercase">Risque</p>
                                    <div className="text-3xl font-black text-indigo-600">{selectedReport.ai_analysis.score}/100</div>
                                </div>
                                <div className="col-span-2">
                                    <div className="flex flex-wrap gap-2 mb-2">
                                        {selectedReport.ai_analysis.tags.map(tag => <span key={tag} className="px-2 py-1 bg-white border border-indigo-100 text-indigo-600 text-[10px] font-bold rounded-md shadow-sm">#{tag}</span>)}
                                    </div>
                                    <p className="text-sm text-indigo-800 italic">"{selectedReport.ai_analysis.summary}"</p>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white p-6 rounded-3xl border border-slate-200 mb-6 shadow-sm">
                            <p className="text-slate-600 text-sm leading-relaxed mb-4">{selectedReport.description}</p>
                            {selectedReport.audio && (
                                <div className="bg-slate-800 rounded-xl p-3 text-white flex items-center">
                                    <div className="w-8 h-8 bg-sky-500 rounded-full flex items-center justify-center mr-3"><PlayIcon className="w-4 h-4" /></div>
                                    <div className="flex-1 h-1 bg-slate-600 rounded-full"><div className="w-1/3 h-full bg-sky-400 rounded-full"></div></div>
                                </div>
                            )}
                        </div>

                        <div>
                            <h3 className="font-bold text-slate-800 mb-4 flex items-center"><ChartBarIcon className="w-5 h-5 mr-2 text-slate-400"/> Procédure de Signalement</h3>
                            <div className="space-y-4 ml-2 border-l-2 border-slate-200 pl-6 relative">
                                {selectedReport.process.map((step, idx) => (
                                    <div key={idx} className="relative">
                                        <div className={`absolute -left-[31px] top-1 w-4 h-4 rounded-full border-2 ${step.status === 'completed' ? 'bg-emerald-500 border-emerald-500' : step.status === 'current' ? 'bg-blue-500 border-blue-500 ring-4 ring-blue-100' : 'bg-white border-slate-300'}`}></div>
                                        <div className="flex justify-between items-start bg-white p-3 rounded-xl border border-slate-100 shadow-sm">
                                            <div>
                                                <p className={`text-sm font-bold ${step.status === 'pending' ? 'text-slate-400' : 'text-slate-800'}`}>{step.label}</p>
                                                <p className="text-xs text-slate-400">{step.date}</p>
                                            </div>
                                            {(step.status === 'completed' || step.status === 'current') && (
                                                <button className="text-[10px] bg-slate-50 hover:bg-sky-50 hover:text-sky-600 px-3 py-1 rounded border border-slate-200 font-bold transition">
                                                    {step.doc ? "Voir Fiche" : "Importer"}
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                      </div>
                  ) : (
                      <div className="animate-fadeIn h-full flex flex-col">
                          {/* CONTENU CHAT */}
                          <div className="flex-1 space-y-4 mb-4">
                              {selectedReport.comments.length === 0 ? (
                                  <div className="text-center py-10 text-slate-400 text-sm">Aucune discussion pour le moment.</div>
                              ) : (
                                selectedReport.comments.map((comment, idx) => (
                                    <div key={idx} className={`flex flex-col ${comment.role === 'Direction' ? 'items-end' : 'items-start'}`}>
                                        <div className={`max-w-[80%] p-4 rounded-2xl text-sm ${comment.role === 'Direction' ? 'bg-blue-600 text-white rounded-tr-none' : 'bg-white border border-slate-200 text-slate-700 rounded-tl-none'}`}>
                                            <p>{comment.text}</p>
                                        </div>
                                        <span className="text-[10px] text-slate-400 mt-1 px-2">{comment.user} • {comment.date}</span>
                                    </div>
                                ))
                              )}
                          </div>
                          
                          <div className="mt-auto bg-white p-2 rounded-2xl border border-slate-200 flex items-center shadow-sm">
                              <input 
                                type="text" 
                                placeholder="Écrire un message à l'équipe..." 
                                className="flex-1 bg-transparent border-none focus:ring-0 text-sm p-3 outline-none"
                                onKeyDown={(e) => {
                                    if(e.key === 'Enter') {
                                        addComment(e.target.value);
                                        e.target.value = '';
                                    }
                                }}
                              />
                              <button className="w-10 h-10 bg-blue-600 text-white rounded-xl flex items-center justify-center hover:bg-blue-700 transition">
                                  <SendIcon className="w-4 h-4" />
                              </button>
                          </div>
                      </div>
                  )}
               </div>
            </div>

            {/* DROITE : ACTIONS & CLASSIFICATION */}
            <div className="w-full md:w-80 bg-white border-l border-slate-200 p-8 flex flex-col z-20 shadow-[-10px_0_30px_rgba(0,0,0,0.02)]">
                
                {/* CLASSIFICATION */}
                <div className="mb-8">
                    <h4 className="font-black text-slate-800 uppercase text-xs tracking-widest mb-4">Décision de Classement</h4>
                    <div className="space-y-2">
                        <ClassificationButton 
                            active={selectedReport.category === 'sauvegarde'} 
                            label="Sauvegarde" color="bg-red-500" textColor="text-red-700" bgLight="bg-red-50" borderColor="border-red-500"
                            onClick={() => updateCategory(selectedReport.id, 'sauvegarde')} 
                        />
                        <ClassificationButton 
                            active={selectedReport.category === 'prise_en_charge'} 
                            label="Prise en Charge" color="bg-orange-500" textColor="text-orange-700" bgLight="bg-orange-50" borderColor="border-orange-500"
                            onClick={() => updateCategory(selectedReport.id, 'prise_en_charge')} 
                        />
                         <ClassificationButton 
                            active={selectedReport.category === 'faux'} 
                            label="Faux Signalement" color="bg-slate-500" textColor="text-slate-700" bgLight="bg-slate-100" borderColor="border-slate-500"
                            onClick={() => updateCategory(selectedReport.id, 'faux')} 
                        />
                    </div>
                </div>

                <hr className="border-slate-100 mb-6"/>

                {/* NOTE CONFIDENTIELLE & EXPORT */}
                <div className="flex-1 flex flex-col">
                    <h4 className="font-black text-slate-800 uppercase text-xs tracking-widest mb-3">Note Confidentielle</h4>
                    <textarea className="w-full flex-1 p-4 rounded-xl border border-slate-200 bg-slate-50 text-sm focus:bg-white focus:ring-2 focus:ring-sky-100 outline-none resize-none transition mb-4" placeholder="Rédiger observation..."></textarea>
                    
                    <button className="w-full mb-3 py-3 bg-white border border-slate-200 text-slate-600 font-bold rounded-xl hover:bg-slate-50 transition flex items-center justify-center text-sm">
                        <DownloadIcon className="w-4 h-4 mr-2"/> Exporter le Rapport
                    </button>

                    <button className="w-full py-4 bg-slate-900 text-white font-bold rounded-xl hover:bg-black transition shadow-lg shadow-slate-300">Enregistrer</button>
                </div>
            </div>

          </div>
        </div>
      )}
    </div>
  );
};

// --- COMPOSANTS UI AUXILIAIRES ---

const StatCard = ({ title, value, color, bg, icon }) => (
  <div className="bg-white p-6 rounded-3xl shadow-[0_2px_15px_-3px_rgba(0,0,0,0.07),0_10px_20px_-2px_rgba(0,0,0,0.04)] border border-slate-50 flex items-center justify-between group hover:-translate-y-1 transition-all duration-300">
    <div><p className="text-slate-400 text-xs font-bold uppercase tracking-wider mb-2">{title}</p><p className="text-4xl font-black text-slate-800">{value}</p></div>
    <div className={`w-14 h-14 rounded-2xl ${bg} ${color} flex items-center justify-center transition-transform group-hover:rotate-12`}>{icon}</div>
  </div>
);

const NavItem = ({ icon, label, active }) => (
  <div className={`flex items-center px-4 py-3.5 rounded-xl cursor-pointer transition-all font-medium ${active ? 'bg-white/10 text-white shadow-inner backdrop-blur-sm border border-white/5' : 'text-sky-100/70 hover:bg-white/5 hover:text-white'}`}>
    <span className="mr-3">{icon}</span><span className="text-sm">{label}</span>
  </div>
);

const ClassificationButton = ({ active, label, color, textColor, bgLight, borderColor, onClick }) => (
    <button onClick={onClick} className={`w-full p-4 rounded-xl border-2 text-left transition flex items-center justify-between ${active ? `${borderColor} ${bgLight} ${textColor}` : 'border-slate-100 hover:border-slate-300 text-slate-500'}`}>
        <span className="font-bold text-sm">{label}</span>
        {active && <div className={`w-3 h-3 ${color} rounded-full shadow-sm`}></div>}
    </button>
);

// --- ICONES SVG ---
const DashboardIcon = () => <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" /></svg>;
const UsersIcon = () => <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" /></svg>;
const FileIcon = () => <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>;
const AlertIcon = ({className = "w-6 h-6"}) => <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>;
const NewIcon = () => <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>;
const CheckIcon = ({className = "w-6 h-6"}) => <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>;
const LocationIcon = ({className}) => <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>;
const MicIcon = ({className}) => <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" /></svg>;
const CloseIcon = () => <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>;
const PlayIcon = ({className}) => <svg className={className} fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" /></svg>;
const AiStarIcon = ({className = "w-6 h-6"}) => <svg className={className} fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>;
const BellIcon = () => <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" /></svg>;
const StatsIcon = () => <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>;
const ChartBarIcon = ({className}) => <svg className={className || "w-5 h-5"} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>;
const SearchIcon = ({className}) => <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>;
const CalendarIcon = () => <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>;
const ChatIcon = ({className}) => <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" /></svg>;
const SendIcon = ({className}) => <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" /></svg>;
const DownloadIcon = ({className}) => <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>;

export default Dashboard;