import React, { useState } from 'react';

// Assurez-vous que vos fichiers sont bien dans le même dossier src
import SignalementForm from './SignalementForm';
import Dashboard from './Dashboard';

function App() {
  // État pour gérer quelle page afficher ('form' ou 'admin')
  // Mettez 'admin' par défaut si vous voulez voir le dashboard directement
  const [currentPage, setCurrentPage] = useState('admin'); 

  return (
    <div>
      {/* --- BARRE DE NAVIGATION TEMPORAIRE (POUR LE DÉVELOPPEMENT) --- */}
      <nav className="bg-slate-800 text-white p-4 flex justify-between items-center shadow-md">
        <div className="font-bold text-xl">SOS Villages D'Enfants</div>
        <div className="space-x-4">
          <button 
            onClick={() => setCurrentPage('form')}
            className={`px-4 py-2 rounded-lg transition ${currentPage === 'form' ? 'bg-blue-600 font-bold' : 'hover:bg-slate-700 text-slate-300'}`}
          >
            Vue Publique (Formulaire)
          </button>
          <button 
            onClick={() => setCurrentPage('admin')}
            className={`px-4 py-2 rounded-lg transition ${currentPage === 'admin' ? 'bg-blue-600 font-bold' : 'hover:bg-slate-700 text-slate-300'}`}
          >
            Vue Admin (Dashboard)
          </button>
        </div>
      </nav>

      {/* --- AFFICHAGE CONDITIONNEL --- */}
      <div>
        {currentPage === 'form' && <SignalementForm />}
        {currentPage === 'admin' && <Dashboard />}
      </div>
    </div>
  );
}

export default App;
