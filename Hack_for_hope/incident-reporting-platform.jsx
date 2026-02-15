import React, { useState, useEffect, useRef } from 'react';
import { Shield, Upload, CheckCircle, AlertTriangle, Clock, Lock, Eye, EyeOff, FileText, Camera, Mic, Video, ChevronDown, Sparkles, X, Play, Pause, Download, Square, LogIn, User } from 'lucide-react';

const IncidentReportingPlatform = () => {
  const [formData, setFormData] = useState({
    isAnonymous: false,
    program: '',
    childName: '',
    reportedPersonName: '',
    incidentType: '',
    description: '',
    attachments: [],
    imagePreview: null,
    audioFile: null,
    audioTranscription: '',
    isTranscribing: false
  });

  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [urgencyLevel, setUrgencyLevel] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showSignupModal, setShowSignupModal] = useState(false);
  const [loginCredentials, setLoginCredentials] = useState({ email: '', password: '' });
  const [signupData, setSignupData] = useState({ name: '', email: '', password: '', confirmPassword: '' });
  const [userInfo, setUserInfo] = useState(null);
  
  const audioRef = useRef(null);
  const recordingTimerRef = useRef(null);
  const recognitionRef = useRef(null);

  const programs = [
    'Village Alpha - Dakar',
    'Village Beta - Thiès',
    'Village Gamma - Saint-Louis',
    'Programme Éducatif Nord',
    'Programme Éducatif Sud',
    'Centre d\'Accueil Temporaire'
  ];

  const incidentTypes = [
    { value: 'sante', label: 'Santé', icon: '🏥' },
    { value: 'comportement', label: 'Comportement', icon: '👤' },
    { value: 'violence', label: 'Violence', icon: '⚠️' },
    { value: 'maltraitance', label: 'Maltraitance', icon: '🚨' },
    { value: 'autre', label: 'Autre', icon: '📋' }
  ];

  const urgencyLevels = [
    { value: 'faible', label: 'Faible', color: 'from-green-500 to-emerald-600', bg: 'bg-green-50', border: 'border-green-200', text: 'text-green-700' },
    { value: 'moyen', label: 'Moyen', color: 'from-yellow-500 to-amber-600', bg: 'bg-yellow-50', border: 'border-yellow-200', text: 'text-yellow-700' },
    { value: 'eleve', label: 'Élevé', color: 'from-orange-500 to-red-500', bg: 'bg-orange-50', border: 'border-orange-200', text: 'text-orange-700' },
    { value: 'critique', label: 'Critique', color: 'from-red-600 to-rose-700', bg: 'bg-red-50', border: 'border-red-300', text: 'text-red-700' }
  ];

  const getCurrentUrgencyStyle = () => {
    const level = urgencyLevels.find(l => l.value === urgencyLevel);
    return level || { color: 'from-cyan-500 to-blue-500', bg: 'bg-white', border: 'border-slate-200' };
  };

  // Fonction IA pour analyser l'urgence
  const analyzeUrgency = (description) => {
    if (!description || description.trim().length < 20) {
      return '';
    }

    const text = description.toLowerCase();
    
    const criticalKeywords = [
      'danger immédiat', 'urgence', 'critique', 'grave blessure', 'hémorragie',
      'inconscient', 'suicide', 'tentative', 'abus sexuel', 'viol', 'agression',
      'menace de mort', 'arme', 'kidnapping', 'enlèvement', 'mort', 'décès',
      'convulsions', 'fracture', 'brûlure grave', 'empoisonnement'
    ];
    
    const highKeywords = [
      'violence', 'maltraitance', 'coup', 'frappé', 'blessure', 'sang',
      'fugue', 'disparu', 'menace', 'bagarr', 'agress', 'isolement forcé',
      'privation', 'punition', 'malnutrition', 'négligence grave', 'fièvre élevée',
      'douleur intense', 'crise', 'attaque'
    ];
    
    const mediumKeywords = [
      'comportement inquiétant', 'changement soudain', 'isolé', 'triste',
      'refus de manger', 'cauchemar', 'peur', 'anxiété', 'conflit',
      'dispute', 'désobéissance', 'cri', 'pleur', 'fatigue', 'mal au ventre',
      'mal de tête', 'vomissement'
    ];

    let criticalCount = 0;
    let highCount = 0;
    let mediumCount = 0;

    criticalKeywords.forEach(keyword => {
      if (text.includes(keyword)) criticalCount++;
    });

    highKeywords.forEach(keyword => {
      if (text.includes(keyword)) highCount++;
    });

    mediumKeywords.forEach(keyword => {
      if (text.includes(keyword)) mediumCount++;
    });

    const hasExclamation = (description.match(/!/g) || []).length >= 2;
    const hasCapitals = (description.match(/[A-Z]{3,}/g) || []).length >= 1;
    const hasUrgentPhrases = /immédiatement|tout de suite|vite|urgent|aide|secours|svp/i.test(text);
    
    if (criticalCount >= 1 || (highCount >= 2 && hasUrgentPhrases)) {
      return 'critique';
    } else if (highCount >= 1 || (mediumCount >= 3) || (hasExclamation && hasCapitals)) {
      return 'eleve';
    } else if (mediumCount >= 1 || text.length > 200) {
      return 'moyen';
    } else {
      return 'faible';
    }
  };

  useEffect(() => {
    if (formData.description.trim().length >= 20) {
      setIsAnalyzing(true);
      const timer = setTimeout(() => {
        const level = analyzeUrgency(formData.description);
        setUrgencyLevel(level);
        setIsAnalyzing(false);
      }, 800);

      return () => clearTimeout(timer);
    } else {
      setUrgencyLevel('');
    }
  }, [formData.description]);

  // Initialiser la reconnaissance vocale
  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    
    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = 'ar-TN';
      
      recognition.onresult = (event) => {
        let interimTranscript = '';
        let finalTranscript = '';
        
        for (let i = event.resultIndex; i < event.results.length; i++) {
          const transcript = event.results[i][0].transcript;
          if (event.results[i].isFinal) {
            finalTranscript += transcript + ' ';
          } else {
            interimTranscript += transcript;
          }
        }
        
        if (finalTranscript) {
          setFormData(prev => ({
            ...prev,
            description: prev.description + finalTranscript
          }));
        }
      };
      
      recognition.onerror = (event) => {
        console.error('Erreur de reconnaissance vocale:', event.error);
        if (event.error === 'no-speech') {
          if (isRecording) {
            recognition.start();
          }
        } else {
          stopRecording();
        }
      };
      
      recognition.onend = () => {
        if (isRecording) {
          try {
            recognition.start();
          } catch (e) {
            console.log('Reconnaissance déjà en cours');
          }
        }
      };
      
      recognitionRef.current = recognition;
    }
    
    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, []);

  useEffect(() => {
    if (isRecording) {
      recordingTimerRef.current = setInterval(() => {
        setRecordingTime(prev => prev + 1);
      }, 1000);
    } else {
      if (recordingTimerRef.current) {
        clearInterval(recordingTimerRef.current);
      }
      setRecordingTime(0);
    }
    
    return () => {
      if (recordingTimerRef.current) {
        clearInterval(recordingTimerRef.current);
      }
    };
  }, [isRecording]);

  const startRecording = () => {
    if (recognitionRef.current) {
      try {
        recognitionRef.current.start();
        setIsRecording(true);
      } catch (e) {
        console.log('Reconnaissance déjà démarrée');
      }
    } else {
      alert('La reconnaissance vocale n\'est pas supportée par votre navigateur. Veuillez utiliser Chrome, Edge ou Safari.');
    }
  };

  const stopRecording = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }
    setIsRecording(false);
    setRecordingTime(0);
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  // Fonction de connexion simulée
  const handleLogin = (e) => {
    e.preventDefault();
    
    // Simulation d'authentification - À remplacer par votre API
    // Exemple: const response = await fetch('/api/auth/login', { method: 'POST', body: JSON.stringify(loginCredentials) });
    
    if (loginCredentials.email && loginCredentials.password) {
      // Simulation de données utilisateur
      const mockUserInfo = {
        name: 'Ahmed Ben Ali',
        email: loginCredentials.email,
        role: 'Déclarant',
        organization: 'SOS Villages d\'Enfants - Tunis'
      };
      
      setUserInfo(mockUserInfo);
      setIsAuthenticated(true);
      setShowLoginModal(false);
      setLoginCredentials({ email: '', password: '' });
    }
  };

  const handleSignup = (e) => {
    e.preventDefault();
    
    // Validation du mot de passe
    if (signupData.password !== signupData.confirmPassword) {
      alert('Les mots de passe ne correspondent pas');
      return;
    }
    
    if (signupData.password.length < 6) {
      alert('Le mot de passe doit contenir au moins 6 caractères');
      return;
    }
    
    // Simulation de création de compte - À remplacer par votre API
    // Exemple: const response = await fetch('/api/auth/signup', { method: 'POST', body: JSON.stringify(signupData) });
    
    if (signupData.email && signupData.password && signupData.name) {
      // Simulation de création réussie et connexion automatique
      const mockUserInfo = {
        name: signupData.name,
        email: signupData.email,
        role: 'Déclarant',
        organization: 'SOS Villages d\'Enfants'
      };
      
      setUserInfo(mockUserInfo);
      setIsAuthenticated(true);
      setShowSignupModal(false);
      setSignupData({ name: '', email: '', password: '', confirmPassword: '' });
    }
  };

  const handleLogout = () => {
    setUserInfo(null);
    setIsAuthenticated(false);
  };

  const transcribeAudio = async (audioFile) => {
    setFormData(prev => ({ ...prev, isTranscribing: true }));
    await new Promise(resolve => setTimeout(resolve, 2500));

    const mockTranscriptions = [
      "L'enfant Mohamed a été vu avec des marques suspectes sur les bras. Il refuse de parler de ce qui s'est passé et semble très effrayé.",
      "الطفل محمد كان عنده علامات مشبوهة على ذراعيه. يرفض الحديث عن ما حصل ويبدو خايف برشا.",
      "J'ai remarqué que l'enfant Fatma ne mange pas depuis trois jours. Elle pleure souvent et reste isolée des autres enfants.",
      "لاحظت أن الطفلة فاطمة ما تاكلش من ثلاثة أيام. تبكي برشا وتقعد وحدها بعيدة على الأطفال الآخرين."
    ];

    const randomTranscription = mockTranscriptions[Math.floor(Math.random() * mockTranscriptions.length)];

    setFormData(prev => ({
      ...prev,
      audioTranscription: randomTranscription,
      isTranscribing: false
    }));
  };

  const handleAudioUpload = async (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith('audio/')) {
      const audioUrl = URL.createObjectURL(file);
      
      setFormData(prev => ({
        ...prev,
        audioFile: { file, url: audioUrl },
        attachments: [...prev.attachments, file]
      }));

      await transcribeAudio(file);
    }
  };

  const toggleAudioPlayback = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const downloadAudio = () => {
    if (formData.audioFile) {
      const link = document.createElement('a');
      link.href = formData.audioFile.url;
      link.download = formData.audioFile.file.name;
      link.click();
    }
  };

  const removeAudio = () => {
    if (audioRef.current) {
      audioRef.current.pause();
    }
    setFormData(prev => ({
      ...prev,
      audioFile: null,
      audioTranscription: '',
      attachments: prev.attachments.filter(file => !file.type.startsWith('audio/'))
    }));
    setIsPlaying(false);
  };

  const retranscribeAudio = () => {
    if (formData.audioFile) {
      transcribeAudio(formData.audioFile.file);
    }
  };

  const copyTranscriptionToDescription = () => {
    setFormData(prev => ({
      ...prev,
      description: prev.description 
        ? prev.description + '\n\n' + prev.audioTranscription 
        : prev.audioTranscription
    }));
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: null }));
    }
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({
          ...prev,
          imagePreview: reader.result,
          attachments: [...prev.attachments, file]
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setFormData(prev => ({
      ...prev,
      imagePreview: null,
      attachments: prev.attachments.filter(file => !file.type.startsWith('image/'))
    }));
  };

  const handleFileUpload = (e) => {
    const files = Array.from(e.target.files);
    setFormData(prev => ({
      ...prev,
      attachments: [...prev.attachments, ...files]
    }));
  };

  const removeAttachment = (index) => {
    setFormData(prev => ({
      ...prev,
      attachments: prev.attachments.filter((_, i) => i !== index)
    }));
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.description.trim()) {
      newErrors.description = 'La description est requise';
    } else if (formData.description.trim().length < 20) {
      newErrors.description = 'La description doit contenir au moins 20 caractères';
    }

    // Vérifier l'authentification si non-anonyme
    if (!formData.isAnonymous && !isAuthenticated) {
      newErrors.authentication = 'Veuillez vous connecter pour un signalement non-anonyme';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (validateForm()) {
      const submissionData = {
        ...formData,
        urgencyLevel: urgencyLevel,
        userInfo: isAuthenticated ? userInfo : null
      };
      
      console.log('Données du formulaire:', submissionData);
      setSubmitted(true);
      
      setTimeout(() => {
        setSubmitted(false);
        setFormData({
          isAnonymous: false,
          program: '',
          childName: '',
          reportedPersonName: '',
          incidentType: '',
          description: '',
          attachments: [],
          imagePreview: null,
          audioFile: null,
          audioTranscription: '',
          isTranscribing: false
        });
        setUrgencyLevel('');
      }, 5000);
    } else {
      const firstError = document.querySelector('.error-message');
      if (firstError) {
        firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }
  };

  const currentStyle = getCurrentUrgencyStyle();

  if (submitted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-2xl p-12 max-w-md w-full text-center transform animate-scale-in">
          <div className="w-20 h-20 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-full flex items-center justify-center mx-auto mb-6 animate-bounce-subtle">
            <CheckCircle className="w-12 h-12 text-white" />
          </div>
          <h2 className="text-3xl font-bold text-slate-800 mb-4">Signalement Enregistré</h2>
          <p className="text-slate-600 mb-6 leading-relaxed">
            Votre signalement a été transmis avec succès aux équipes compétentes. 
            Un numéro de suivi vous sera communiqué par email.
          </p>
          <div className="bg-teal-50 border-l-4 border-teal-500 p-4 rounded-r-lg">
            <p className="text-sm text-teal-800 font-medium">
              <Lock className="w-4 h-4 inline mr-2" />
              Toutes les informations sont cryptées et sécurisées
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Header */}
      <header className="bg-gradient-to-r from-cyan-500 to-blue-500 shadow-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="bg-white p-2.5 rounded-xl shadow-lg flex items-center justify-center" style={{width: '70px', height: '70px'}}>
                <svg viewBox="0 0 100 100" className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
                  <rect x="5" y="5" width="90" height="90" rx="15" fill="#00A0DC" />
                  <circle cx="28" cy="30" r="7" fill="white"/>
                  <path d="M28 38 L23 55 L28 55 L28 70 L23 70 L28 38 Z" fill="white"/>
                  <path d="M28 38 L33 55 L28 55 L28 70 L33 70 L28 38 Z" fill="white"/>
                  <circle cx="72" cy="30" r="7" fill="white"/>
                  <path d="M72 38 L67 55 L72 55 L72 70 L67 70 L72 38 Z" fill="white"/>
                  <path d="M72 38 L77 55 L72 55 L72 70 L77 70 L72 38 Z" fill="white"/>
                  <rect x="48" y="40" width="4" height="30" fill="white"/>
                  <ellipse cx="50" cy="38" rx="8" ry="6" fill="white"/>
                  <ellipse cx="50" cy="33" rx="6" ry="5" fill="white"/>
                  <ellipse cx="50" cy="29" rx="4" ry="3" fill="white"/>
                  <path d="M46 42 Q42 40 42 36" stroke="white" strokeWidth="2" fill="none"/>
                  <path d="M54 42 Q58 40 58 36" stroke="white" strokeWidth="2" fill="none"/>
                </svg>
              </div>
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight leading-tight">
                  SOS VILLAGES<br/>D'ENFANTS
                </h1>
              </div>
            </div>
            <div className="bg-white/20 backdrop-blur-sm px-4 sm:px-5 py-2 sm:py-2.5 rounded-full shadow-lg border-2 border-white/40">
              <span className="text-white font-semibold text-xs sm:text-sm">Rôle : Déclarant</span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          
          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-6">

            {/* Bloc Authentification */}
            {!formData.isAnonymous && (
              <div className="bg-white rounded-2xl shadow-xl border-2 border-indigo-100 animate-fade-in sticky top-8 overflow-hidden">
                {/* En-tête avec icône utilisateur */}
                <div className="bg-gradient-to-r from-indigo-500 to-purple-600 p-4 sm:p-5">
                  <div className="flex items-center space-x-3">
                    <div className="bg-white/20 backdrop-blur-sm p-2 rounded-lg">
                      <User className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                    </div>
                    <h3 className="font-bold text-white text-base sm:text-lg">Authentification</h3>
                  </div>
                </div>
                
                <div className="p-5 sm:p-6">
                  {isAuthenticated ? (
                    <div className="space-y-4">
                      <div className="bg-gradient-to-br from-green-50 to-emerald-50 p-4 rounded-xl border-2 border-green-200">
                        <div className="flex items-center space-x-3 mb-3">
                          <CheckCircle className="w-6 h-6 text-green-600" />
                          <p className="font-bold text-green-800">Connecté</p>
                        </div>
                        <div className="space-y-1.5 text-sm">
                          <p className="text-slate-700"><span className="font-semibold">Nom:</span> {userInfo?.name}</p>
                          <p className="text-slate-700"><span className="font-semibold">Email:</span> {userInfo?.email}</p>
                          <p className="text-slate-600 text-xs mt-2">{userInfo?.organization}</p>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={handleLogout}
                        className="w-full bg-slate-200 hover:bg-slate-300 text-slate-700 py-2.5 px-4 rounded-lg font-semibold transition-all"
                      >
                        Se déconnecter
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <div className="bg-yellow-50 border-2 border-yellow-200 p-4 rounded-xl">
                        <div className="flex items-center space-x-2 mb-2">
                          <AlertTriangle className="w-5 h-5 text-yellow-600 flex-shrink-0" />
                          <p className="font-bold text-yellow-800 text-sm">Connexion requise</p>
                        </div>
                        <p className="text-xs text-yellow-700 leading-relaxed">
                          Pour un signalement non-anonyme, vous devez vous authentifier.
                        </p>
                      </div>
                      <div className="flex flex-col sm:flex-row gap-3">
                        <button
                          type="button"
                          onClick={() => setShowLoginModal(true)}
                          className="flex-1 bg-gradient-to-r from-indigo-500 to-purple-600 text-white py-3 px-3 sm:px-4 rounded-xl font-bold text-xs sm:text-sm shadow-lg hover:shadow-xl hover:from-indigo-600 hover:to-purple-700 transition-all duration-300 flex items-center justify-center space-x-1.5 sm:space-x-2 transform hover:scale-105"
                        >
                          <LogIn className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0" />
                          <span>Se connecter</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => setShowSignupModal(true)}
                          className="flex-1 bg-gradient-to-r from-emerald-500 to-teal-600 text-white py-3 px-3 sm:px-4 rounded-xl font-bold text-xs sm:text-sm shadow-lg hover:shadow-xl hover:from-emerald-600 hover:to-teal-700 transition-all duration-300 flex items-center justify-center space-x-1.5 sm:space-x-2 transform hover:scale-105"
                        >
                          <User className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0" />
                          <span>Créer un compte</span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {urgencyLevel && (
              <div className={`${currentStyle.bg} ${currentStyle.border} border-2 rounded-2xl p-6 shadow-lg animate-fade-in`}>
                <div className="flex items-center space-x-3 mb-3">
                  <Sparkles className={`w-6 h-6 ${currentStyle.text} animate-pulse`} />
                  <h4 className={`font-bold ${currentStyle.text}`}>Urgence Détectée (IA)</h4>
                </div>
                <p className={`text-2xl font-bold ${currentStyle.text}`}>
                  {urgencyLevels.find(l => l.value === urgencyLevel)?.label}
                </p>
                <p className="text-xs text-slate-600 mt-2">
                  Analysé automatiquement à partir de votre description
                </p>
              </div>
            )}

            {isAnalyzing && formData.description.trim().length >= 20 && (
              <div className="bg-blue-50 border-2 border-blue-200 rounded-2xl p-6 shadow-lg animate-fade-in">
                <div className="flex items-center space-x-3">
                  <Sparkles className="w-6 h-6 text-blue-600 animate-spin" />
                  <div>
                    <p className="font-bold text-blue-700">Analyse en cours...</p>
                    <p className="text-xs text-blue-600 mt-1">Détection du niveau d'urgence</p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Main Form */}
          <div className="lg:col-span-3">
            <div className={`bg-white rounded-2xl shadow-2xl overflow-hidden transition-all duration-500 ${
              urgencyLevel ? `ring-4 ring-${getCurrentUrgencyStyle().color.split('-')[1]}-200` : ''
            }`}>
              
              <div className={`bg-gradient-to-r ${currentStyle.color} p-8 text-white`}>
                <h2 className="text-3xl font-bold mb-2">Nouveau Signalement SOS</h2>
                <p className="text-blue-100">Décrivez l'incident - les autres champs sont optionnels</p>
              </div>

              <form onSubmit={handleSubmit} className="p-8 space-y-8">
                
                {/* Anonymous Toggle */}
                <div className="bg-gradient-to-br from-slate-50 to-slate-100 p-6 rounded-xl border-2 border-slate-200">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      {formData.isAnonymous ? (
                        <EyeOff className="w-6 h-6 text-purple-600" />
                      ) : (
                        <Eye className="w-6 h-6 text-blue-600" />
                      )}
                      <div>
                        <label className="text-lg font-bold text-slate-800">Signalement Anonyme</label>
                        <p className="text-sm text-slate-600">Vos coordonnées ne seront pas enregistrées</p>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleInputChange({ target: { name: 'isAnonymous', type: 'checkbox', checked: !formData.isAnonymous } })}
                      className={`relative inline-flex h-8 w-16 items-center rounded-full transition-colors duration-300 focus:outline-none focus:ring-4 focus:ring-purple-200 ${
                        formData.isAnonymous ? 'bg-gradient-to-r from-purple-500 to-indigo-600' : 'bg-slate-300'
                      }`}
                    >
                      <span className={`inline-block h-6 w-6 transform rounded-full bg-white shadow-lg transition-transform duration-300 ${
                        formData.isAnonymous ? 'translate-x-9' : 'translate-x-1'
                      }`} />
                    </button>
                  </div>
                </div>

                {/* Autres champs du formulaire... (identiques à la version précédente) */}
                {/* Je vais inclure seulement les champs essentiels pour la démonstration */}

                {/* Programme */}
                <div className="space-y-2">
                  <label className="block text-sm font-bold text-slate-700">
                    Programme / Village <span className="text-slate-400">(Optionnel)</span>
                  </label>
                  <div className="relative">
                    <select
                      name="program"
                      value={formData.program}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3.5 bg-white border-2 border-slate-300 rounded-xl appearance-none focus:outline-none focus:ring-4 focus:ring-blue-200 hover:border-blue-400 transition-all"
                    >
                      <option value="">Sélectionnez un programme (optionnel)</option>
                      {programs.map((prog, idx) => (
                        <option key={idx} value={prog}>{prog}</option>
                      ))}
                    </select>
                    <ChevronDown className="absolute right-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400 pointer-events-none" />
                  </div>
                </div>

                {/* Nom enfant */}
                {!formData.isAnonymous && (
                  <div className="space-y-2 animate-fade-in">
                    <label className="block text-sm font-bold text-slate-700">
                      Nom et Prénom de l'Enfant <span className="text-slate-400">(Optionnel)</span>
                    </label>
                    <input
                      type="text"
                      name="childName"
                      value={formData.childName}
                      onChange={handleInputChange}
                      placeholder="Ex: Aminata Diallo"
                      className="w-full px-4 py-3.5 border-2 border-slate-300 rounded-xl focus:outline-none focus:ring-4 focus:ring-blue-200 hover:border-blue-400 transition-all"
                    />
                  </div>
                )}

                {/* Personne signalée */}
                <div className="space-y-2">
                  <label className="block text-sm font-bold text-slate-700">
                    Nom et Prénom de la Personne Signalée <span className="text-slate-400">(Optionnel)</span>
                  </label>
                  <input
                    type="text"
                    name="reportedPersonName"
                    value={formData.reportedPersonName}
                    onChange={handleInputChange}
                    placeholder="Ex: Mamadou Ndiaye"
                    className="w-full px-4 py-3.5 border-2 border-slate-300 rounded-xl focus:outline-none focus:ring-4 focus:ring-blue-200 hover:border-blue-400 transition-all"
                  />
                </div>

                {/* Type d'incident */}
                <div className="space-y-3">
                  <label className="block text-sm font-bold text-slate-700">
                    Type d'Incident <span className="text-slate-400">(Optionnel)</span>
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                    {incidentTypes.map((type) => (
                      <button
                        key={type.value}
                        type="button"
                        onClick={() => handleInputChange({ target: { name: 'incidentType', value: type.value } })}
                        className={`p-4 rounded-xl border-2 transition-all duration-300 hover:scale-105 ${
                          formData.incidentType === type.value
                            ? 'bg-gradient-to-br from-blue-500 to-indigo-600 text-white border-blue-600 shadow-xl'
                            : 'bg-white border-slate-300 hover:border-blue-400 hover:shadow-lg'
                        }`}
                      >
                        <div className="text-3xl mb-2">{type.icon}</div>
                        <div className="text-sm font-semibold">{type.label}</div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Description avec Micro */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="block text-sm font-bold text-slate-700">
                      Description Détaillée de l'Incident <span className="text-red-500">*</span>
                    </label>
                    
                    <button
                      type="button"
                      onClick={isRecording ? stopRecording : startRecording}
                      className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-semibold transition-all ${
                        isRecording 
                          ? 'bg-gradient-to-r from-red-500 to-pink-600 text-white animate-pulse' 
                          : 'bg-gradient-to-r from-purple-500 to-indigo-600 text-white hover:from-purple-600 hover:to-indigo-700'
                      }`}
                    >
                      {isRecording ? (
                        <>
                          <Square className="w-5 h-5" />
                          <span>Arrêter ({formatTime(recordingTime)})</span>
                        </>
                      ) : (
                        <>
                          <Mic className="w-5 h-5" />
                          <span>Dicter</span>
                        </>
                      )}
                    </button>
                  </div>

                  {isRecording && (
                    <div className="bg-gradient-to-r from-red-50 to-pink-50 border-2 border-red-300 rounded-lg p-3 animate-fade-in">
                      <div className="flex items-center space-x-3">
                        <div className="flex space-x-1">
                          <div className="w-1 h-6 bg-red-500 rounded-full animate-pulse" style={{animationDelay: '0s'}}></div>
                          <div className="w-1 h-6 bg-red-500 rounded-full animate-pulse" style={{animationDelay: '0.1s'}}></div>
                          <div className="w-1 h-6 bg-red-500 rounded-full animate-pulse" style={{animationDelay: '0.2s'}}></div>
                          <div className="w-1 h-6 bg-red-500 rounded-full animate-pulse" style={{animationDelay: '0.3s'}}></div>
                        </div>
                        <div>
                          <p className="text-sm font-bold text-red-700">🎙️ Enregistrement en cours...</p>
                          <p className="text-xs text-red-600">Parlez clairement en français, arabe ou tunisien</p>
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="relative">
                    <textarea
                      name="description"
                      value={formData.description}
                      onChange={handleInputChange}
                      rows="10"
                      placeholder="Décrivez l'incident de manière détaillée : contexte, lieu, date, témoins éventuels, actions déjà entreprises... Vous pouvez aussi cliquer sur le bouton 'Dicter' pour parler."
                      className={`w-full px-4 py-3.5 border-2 rounded-xl focus:outline-none focus:ring-4 focus:ring-blue-200 transition-all resize-none ${
                        errors.description ? 'border-red-400 bg-red-50' : 'border-slate-300 hover:border-blue-400'
                      } ${isRecording ? 'ring-4 ring-purple-200 border-purple-400' : ''}`}
                    />
                    {isAnalyzing && formData.description.trim().length >= 20 && (
                      <div className="absolute top-3 right-3">
                        <Sparkles className="w-5 h-5 text-blue-500 animate-spin" />
                      </div>
                    )}
                  </div>
                  <div className="flex justify-between items-center">
                    <div>
                      {errors.description && <p className="error-message text-sm text-red-600 flex items-center"><AlertTriangle className="w-4 h-4 mr-1" />{errors.description}</p>}
                      {errors.authentication && <p className="error-message text-sm text-red-600 flex items-center"><AlertTriangle className="w-4 h-4 mr-1" />{errors.authentication}</p>}
                    </div>
                    <span className={`text-sm ${formData.description.length >= 20 ? 'text-green-600' : 'text-slate-400'}`}>
                      {formData.description.length} caractères {formData.description.length >= 20 && '✓'}
                    </span>
                  </div>
                </div>

                {/* Submit */}
                <div className="pt-6 border-t-2 border-slate-200">
                  <button
                    type="submit"
                    className="w-full bg-gradient-to-r from-cyan-500 to-blue-600 text-white py-4 px-8 rounded-xl font-bold text-lg shadow-xl hover:shadow-2xl hover:from-cyan-600 hover:to-blue-700 transform hover:scale-105 transition-all duration-300 flex items-center justify-center space-x-3"
                  >
                    <Shield className="w-6 h-6" />
                    <span>Soumettre le Signalement</span>
                  </button>
                  <p className="text-center text-sm text-slate-500 mt-4">
                    En soumettant ce formulaire, vous acceptez que les informations soient traitées conformément à notre politique de confidentialité
                  </p>
                </div>

              </form>
            </div>
          </div>

        </div>
      </div>

      {/* Modal de connexion */}
      {showLoginModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8 transform animate-scale-in">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-bold text-slate-800">Connexion</h3>
              <button
                onClick={() => setShowLoginModal(false)}
                className="text-slate-400 hover:text-slate-600 transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <form onSubmit={handleLogin} className="space-y-6">
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Email</label>
                <input
                  type="email"
                  value={loginCredentials.email}
                  onChange={(e) => setLoginCredentials(prev => ({ ...prev, email: e.target.value }))}
                  placeholder="votre.email@example.com"
                  required
                  className="w-full px-4 py-3 border-2 border-slate-300 rounded-xl focus:outline-none focus:ring-4 focus:ring-indigo-200 focus:border-indigo-400 transition-all"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Mot de passe</label>
                <input
                  type="password"
                  value={loginCredentials.password}
                  onChange={(e) => setLoginCredentials(prev => ({ ...prev, password: e.target.value }))}
                  placeholder="••••••••"
                  required
                  className="w-full px-4 py-3 border-2 border-slate-300 rounded-xl focus:outline-none focus:ring-4 focus:ring-indigo-200 focus:border-indigo-400 transition-all"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-gradient-to-r from-indigo-500 to-purple-600 text-white py-3 px-6 rounded-xl font-bold shadow-lg hover:shadow-xl hover:from-indigo-600 hover:to-purple-700 transition-all flex items-center justify-center space-x-2"
              >
                <LogIn className="w-5 h-5" />
                <span>Se connecter</span>
              </button>
            </form>

            <p className="text-center text-sm text-slate-500 mt-6">
              Connexion sécurisée avec cryptage SSL
            </p>
            
            <div className="mt-4 text-center">
              <button
                onClick={() => {
                  setShowLoginModal(false);
                  setShowSignupModal(true);
                }}
                className="text-sm text-emerald-600 hover:text-emerald-700 font-semibold"
              >
                Pas encore de compte ? Créer un compte
              </button>
            </div>
          </div>
        </div>
      )}

      {showSignupModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8 transform animate-scale-in">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-bold text-slate-800">Créer un compte</h3>
              <button
                onClick={() => setShowSignupModal(false)}
                className="text-slate-400 hover:text-slate-600 transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <form onSubmit={handleSignup} className="space-y-5">
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Nom complet</label>
                <input
                  type="text"
                  value={signupData.name}
                  onChange={(e) => setSignupData(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="Votre nom complet"
                  required
                  className="w-full px-4 py-3 border-2 border-slate-300 rounded-xl focus:outline-none focus:ring-4 focus:ring-emerald-200 focus:border-emerald-400 transition-all"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Email</label>
                <input
                  type="email"
                  value={signupData.email}
                  onChange={(e) => setSignupData(prev => ({ ...prev, email: e.target.value }))}
                  placeholder="votre.email@example.com"
                  required
                  className="w-full px-4 py-3 border-2 border-slate-300 rounded-xl focus:outline-none focus:ring-4 focus:ring-emerald-200 focus:border-emerald-400 transition-all"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Mot de passe</label>
                <input
                  type="password"
                  value={signupData.password}
                  onChange={(e) => setSignupData(prev => ({ ...prev, password: e.target.value }))}
                  placeholder="Au moins 6 caractères"
                  required
                  minLength={6}
                  className="w-full px-4 py-3 border-2 border-slate-300 rounded-xl focus:outline-none focus:ring-4 focus:ring-emerald-200 focus:border-emerald-400 transition-all"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Confirmer le mot de passe</label>
                <input
                  type="password"
                  value={signupData.confirmPassword}
                  onChange={(e) => setSignupData(prev => ({ ...prev, confirmPassword: e.target.value }))}
                  placeholder="Répétez votre mot de passe"
                  required
                  minLength={6}
                  className="w-full px-4 py-3 border-2 border-slate-300 rounded-xl focus:outline-none focus:ring-4 focus:ring-emerald-200 focus:border-emerald-400 transition-all"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-gradient-to-r from-emerald-500 to-teal-600 text-white py-3 px-6 rounded-xl font-bold shadow-lg hover:shadow-xl hover:from-emerald-600 hover:to-teal-700 transition-all flex items-center justify-center space-x-2"
              >
                <User className="w-5 h-5" />
                <span>Créer mon compte</span>
              </button>
            </form>

            <p className="text-center text-sm text-slate-500 mt-6">
              En créant un compte, vous acceptez nos conditions d'utilisation
            </p>
            
            <div className="mt-4 text-center">
              <button
                onClick={() => {
                  setShowSignupModal(false);
                  setShowLoginModal(true);
                }}
                className="text-sm text-indigo-600 hover:text-indigo-700 font-semibold"
              >
                Déjà un compte ? Se connecter
              </button>
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        @keyframes scale-in {
          from {
            transform: scale(0.9);
            opacity: 0;
          }
          to {
            transform: scale(1);
            opacity: 1;
          }
        }
        
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes bounce-subtle {
          0%, 100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-10px);
          }
        }
        
        .animate-scale-in {
          animation: scale-in 0.5s ease-out;
        }
        
        .animate-fade-in {
          animation: fade-in 0.4s ease-out;
        }
        
        .animate-bounce-subtle {
          animation: bounce-subtle 2s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
};

export default IncidentReportingPlatform;