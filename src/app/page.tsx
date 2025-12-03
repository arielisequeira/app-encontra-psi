'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Brain, Heart, Users, Target, MessageCircle, Calendar, ArrowRight, Sparkles, CheckCircle, Home, BookOpen, UserPlus, Settings, CreditCard, Check, X, Upload, AlertCircle, Clock, Star, Bell, LogOut, User as UserIcon } from 'lucide-react';
import { quizQuestions, therapyApproaches, mockPsychologists, brazilianStates } from '@/lib/data';
import { TherapyApproach, QuizResult, Psychologist, PsychologistRegistration, Appointment } from '@/lib/types';
import { AuthModal } from '@/components/custom/auth-modal';

type Step = 'home' | 'quiz' | 'result' | 'list' | 'profile' | 'therapy-detail' | 'psy-register' | 'psy-subscription' | 'psy-dashboard';

interface User {
  name: string;
  email: string;
  phone: string;
}

export default function HomePage() {
  const [step, setStep] = useState<Step>('home');
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<TherapyApproach[]>([]);
  const [quizResult, setQuizResult] = useState<QuizResult | null>(null);
  const [selectedPsychologist, setSelectedPsychologist] = useState<Psychologist | null>(null);
  const [selectedTherapy, setSelectedTherapy] = useState<TherapyApproach | null>(null);
  const [showAppointmentForm, setShowAppointmentForm] = useState(false);
  const [showCalendar, setShowCalendar] = useState(false);
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [selectedTime, setSelectedTime] = useState<string>('');
  
  // Estados de autenticação
  const [user, setUser] = useState<User | null>(null);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');
  const [pendingAction, setPendingAction] = useState<'viewPsychologists' | null>(null);
  
  // Estados para cadastro de psicólogo
  const [psyRegistration, setPsyRegistration] = useState<Partial<PsychologistRegistration>>({
    approaches: [],
    specialties: [],
    modality: []
  });
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<'credit_card' | 'pix'>('credit_card');
  const [currentPsychologist, setCurrentPsychologist] = useState<Psychologist | null>(null);

  // Verificar se usuário está logado ao carregar
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  // Horários disponíveis (simulado)
  const availableTimes = ['08:00', '09:00', '10:00', '11:00', '14:00', '15:00', '16:00', '17:00', '18:00'];

  // Gerar próximos 30 dias
  const getNext30Days = () => {
    const days = [];
    const today = new Date();
    for (let i = 0; i < 30; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      days.push(date);
    }
    return days;
  };

  const handleLogout = () => {
    localStorage.removeItem('user');
    setUser(null);
    setStep('home');
  };

  const handleAuthSuccess = () => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setShowAuthModal(false);
    
    // Se havia uma ação pendente, executar
    if (pendingAction === 'viewPsychologists') {
      setPendingAction(null);
      setStep('list');
    }
  };

  const startQuiz = () => {
    setStep('quiz');
    setCurrentQuestion(0);
    setAnswers([]);
  };

  const handleAnswer = (approach: TherapyApproach) => {
    const newAnswers = [...answers, approach];
    setAnswers(newAnswers);

    if (currentQuestion < quizQuestions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      // Calcular resultado
      const scores: Record<TherapyApproach, number> = {
        psicanalise: 0,
        sistemica: 0,
        gestalt: 0,
        humanista: 0,
        tcc: 0,
        grupo: 0
      };

      newAnswers.forEach(answer => {
        scores[answer]++;
      });

      const maxScore = Math.max(...Object.values(scores));
      const topApproaches = Object.entries(scores)
        .filter(([_, score]) => score === maxScore)
        .map(([approach]) => approach as TherapyApproach)
        .slice(0, 2);

      setQuizResult({
        approaches: topApproaches,
        scores
      });
      setStep('result');
    }
  };

  const viewPsychologists = () => {
    // Verificar se usuário está logado
    if (!user) {
      setPendingAction('viewPsychologists');
      setAuthMode('register');
      setShowAuthModal(true);
      return;
    }
    
    setStep('list');
  };

  const viewProfile = (psychologist: Psychologist) => {
    setSelectedPsychologist(psychologist);
    setStep('profile');
  };

  const viewTherapyDetail = (therapyId: TherapyApproach) => {
    setSelectedTherapy(therapyId);
    setStep('therapy-detail');
  };

  const handleAppointment = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedDate || !selectedTime) {
      alert('Por favor, selecione data e horário.');
      return;
    }

    // Simular criação de agendamento
    const formData = new FormData(e.target as HTMLFormElement);
    const appointment: Appointment = {
      id: Date.now().toString(),
      psychologistId: selectedPsychologist?.id || '',
      psychologistName: selectedPsychologist?.name || '',
      psychologistPhoto: selectedPsychologist?.photo || '',
      date: selectedDate,
      time: selectedTime,
      modality: formData.get('modality') as 'online' | 'presencial',
      patientName: formData.get('name') as string,
      patientEmail: formData.get('email') as string,
      patientPhone: formData.get('phone') as string,
      status: 'pending',
      createdAt: new Date().toISOString(),
      notes: formData.get('notes') as string || undefined
    };

    alert(`✅ Solicitação de agendamento enviada com sucesso!\n\nVocê receberá uma notificação por e-mail e SMS quando ${selectedPsychologist?.name} confirmar o agendamento.\n\nData: ${new Date(selectedDate).toLocaleDateString('pt-BR')}\nHorário: ${selectedTime}`);
    
    setShowAppointmentForm(false);
    setShowCalendar(false);
    setSelectedDate('');
    setSelectedTime('');
    setStep('list');
  };

  const handlePsyRegistration = (e: React.FormEvent) => {
    e.preventDefault();
    // Validar se todos os campos estão preenchidos
    if (!psyRegistration.fullName || !psyRegistration.crp || !psyRegistration.email || 
        !psyRegistration.phone || !psyRegistration.city || !psyRegistration.state ||
        !psyRegistration.bio || !psyRegistration.priceRange ||
        psyRegistration.approaches?.length === 0 || psyRegistration.modality?.length === 0) {
      alert('Por favor, preencha todos os campos obrigatórios.');
      return;
    }
    
    // Redirecionar para página de assinatura
    setStep('psy-subscription');
  };

  const handleSubscriptionPayment = (e: React.FormEvent) => {
    e.preventDefault();
    alert('Pagamento processado com sucesso! Seu perfil será ativado após a validação dos documentos.');
    
    // Criar perfil do psicólogo (simulado)
    const newPsychologist: Psychologist = {
      id: Date.now().toString(),
      name: psyRegistration.fullName || '',
      crp: psyRegistration.crp || '',
      photo: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=400&fit=crop',
      approaches: psyRegistration.approaches || [],
      specialties: psyRegistration.specialties || [],
      bio: psyRegistration.bio || '',
      city: psyRegistration.city || '',
      state: psyRegistration.state || '',
      neighborhood: psyRegistration.neighborhood || '',
      modality: psyRegistration.modality || [],
      priceRange: psyRegistration.priceRange || '',
      rating: 0,
      reviewCount: 0,
      availability: [],
      subscriptionStatus: 'active',
      subscriptionPlan: 'monthly',
      subscriptionExpiry: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      documentsValidated: false
    };
    
    setCurrentPsychologist(newPsychologist);
    setStep('psy-dashboard');
  };

  const toggleApproach = (approach: TherapyApproach) => {
    const current = psyRegistration.approaches || [];
    if (current.includes(approach)) {
      setPsyRegistration({
        ...psyRegistration,
        approaches: current.filter(a => a !== approach)
      });
    } else {
      setPsyRegistration({
        ...psyRegistration,
        approaches: [...current, approach]
      });
    }
  };

  const toggleModality = (modality: 'online' | 'presencial') => {
    const current = psyRegistration.modality || [];
    if (current.includes(modality)) {
      setPsyRegistration({
        ...psyRegistration,
        modality: current.filter(m => m !== modality)
      });
    } else {
      setPsyRegistration({
        ...psyRegistration,
        modality: [...current, modality]
      });
    }
  };

  // Filtrar apenas psicólogos com assinatura ativa
  const activePsychologists = mockPsychologists.filter(psy => psy.subscriptionStatus === 'active');
  
  // Filtrar psicólogos baseado no resultado do quiz
  const filteredPsychologists = quizResult
    ? activePsychologists.filter(psy =>
        psy.approaches.some(approach => quizResult.approaches.includes(approach))
      )
    : activePsychologists;

  if (step === 'home') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50">
        {/* Header com Login/Logout */}
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-end items-center gap-3">
            {user ? (
              <>
                <div className="flex items-center gap-2 px-4 py-2 bg-white/80 backdrop-blur-sm rounded-full shadow-sm">
                  <UserIcon className="w-4 h-4 text-purple-600" />
                  <span className="text-sm font-medium text-gray-700">{user.name}</span>
                </div>
                <Button
                  onClick={handleLogout}
                  variant="outline"
                  size="sm"
                  className="rounded-full"
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  Sair
                </Button>
              </>
            ) : (
              <>
                <Button
                  onClick={() => {
                    setAuthMode('login');
                    setShowAuthModal(true);
                  }}
                  variant="outline"
                  size="sm"
                  className="rounded-full"
                >
                  Entrar
                </Button>
                <Button
                  onClick={() => {
                    setAuthMode('register');
                    setShowAuthModal(true);
                  }}
                  size="sm"
                  className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white rounded-full"
                >
                  Criar Conta
                </Button>
              </>
            )}
          </div>
        </div>

        {/* Hero Section */}
        <div className="container mx-auto px-4 py-8 sm:py-16">
          <div className="text-center max-w-4xl mx-auto">
            <div className="inline-flex items-center gap-2 bg-white/80 backdrop-blur-sm px-4 py-2 rounded-full mb-6 shadow-sm">
              <Sparkles className="w-4 h-4 text-purple-600" />
              <span className="text-sm font-medium text-purple-600">Encontre seu terapeuta ideal</span>
            </div>
            
            <h1 className="text-4xl sm:text-6xl font-bold mb-6 bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 bg-clip-text text-transparent">
              EncontraPsi
            </h1>
            
            <p className="text-xl sm:text-2xl text-gray-700 mb-4 font-medium">
              O match perfeito entre você e sua terapia.
            </p>
            
            <p className="text-base sm:text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
              Descubra qual abordagem terapêutica combina com você e conecte-se com psicólogos qualificados na sua região.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Button 
                onClick={startQuiz}
                size="lg"
                className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-8 py-6 text-lg rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
              >
                Fazer o Quiz Gratuito
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
              
              <Button 
                onClick={() => setStep('psy-register')}
                size="lg"
                variant="outline"
                className="border-2 border-purple-600 text-purple-600 hover:bg-purple-50 px-8 py-6 text-lg rounded-full shadow-lg hover:shadow-xl transition-all duration-300"
              >
                <UserPlus className="mr-2 w-5 h-5" />
                Sou Psicólogo(a)
              </Button>
            </div>
          </div>

          {/* Features */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-16 sm:mt-24 max-w-4xl mx-auto">
            <Card className="p-6 bg-white/80 backdrop-blur-sm border-pink-100 hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 bg-gradient-to-br from-pink-500 to-rose-500 rounded-xl flex items-center justify-center mb-4">
                <Users className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-lg font-semibold mb-2 text-gray-800">Psicólogos Qualificados</h3>
              <p className="text-gray-600 text-sm mb-4">
                No EncontraPsi, você encontra psicólogos altamente qualificados, prontos para oferecer o suporte necessário para suas necessidades emocionais e psicológicas. Todos os profissionais cadastrados em nossa plataforma possuem registro ativo no Conselho Regional de Psicologia (CRP) e são especializados em diversas abordagens terapêuticas, garantindo que você encontre o terapeuta ideal para o seu perfil.
              </p>
              <p className="text-gray-600 text-sm mb-4">
                Nossos psicólogos passam por um rigoroso processo de validação de documentos, incluindo diplomas e certificados, para assegurar que você está em boas mãos. Além disso, eles são constantemente avaliados por pacientes, o que nos permite destacar aqueles que oferecem um atendimento excepcional.
              </p>
              <p className="text-gray-600 text-sm">
                Seja qual for a sua necessidade, nossos psicólogos estão preparados para ajudar você a encontrar o equilíbrio e o bem-estar que procura. Explore as opções disponíveis e agende sua consulta com confiança.
              </p>
            </Card>

            <Card className="p-6 bg-white/80 backdrop-blur-sm border-blue-100 hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center mb-4">
                <Calendar className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-lg font-semibold mb-2 text-gray-800">Agendamento Fácil</h3>
              <p className="text-gray-600 text-sm">Agende consultas online ou presenciais diretamente pela plataforma com calendário interativo.</p>
            </Card>
          </div>

          {/* Abordagens */}
          <div className="mt-16 sm:mt-24">
            <h2 className="text-2xl sm:text-3xl font-bold text-center mb-4 text-gray-800">
              Conheça as Abordagens Terapêuticas
            </h2>
            <p className="text-center text-gray-600 mb-12 max-w-2xl mx-auto">
              Clique em cada abordagem para conhecer mais detalhes sobre como funciona e para quem é indicada.
            </p>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
              {Object.values(therapyApproaches).map((therapy) => (
                <Card 
                  key={therapy.id} 
                  className="p-6 bg-white/80 backdrop-blur-sm hover:shadow-xl transition-all duration-300 hover:scale-105 cursor-pointer group"
                  onClick={() => viewTherapyDetail(therapy.id)}
                >
                  <div className={`w-12 h-12 bg-gradient-to-br ${therapy.color} rounded-xl flex items-center justify-center mb-4 text-2xl group-hover:scale-110 transition-transform`}>
                    {therapy.icon}
                  </div>
                  <h3 className="text-lg font-semibold mb-2 text-gray-800 group-hover:text-purple-600 transition-colors">
                    {therapy.name}
                  </h3>
                  <p className="text-gray-600 text-sm mb-3">{therapy.description}</p>
                  <div className="flex items-center gap-2 text-purple-600 text-sm font-medium">
                    <BookOpen className="w-4 h-4" />
                    <span>Saiba mais</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </div>

        {/* Modal de Autenticação */}
        <AuthModal
          isOpen={showAuthModal}
          onClose={() => setShowAuthModal(false)}
          onSuccess={handleAuthSuccess}
          mode={authMode}
        />
      </div>
    );
  }

  if (step === 'psy-register') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 p-4 py-12">
        <div className="container mx-auto max-w-4xl">
          <Button
            onClick={() => setStep('home')}
            variant="ghost"
            className="mb-6"
          >
            ← Voltar para início
          </Button>

          <Card className="p-8 bg-white/90 backdrop-blur-sm shadow-xl">
            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <UserPlus className="w-8 h-8 text-white" />
              </div>
              <h1 className="text-3xl font-bold text-gray-800 mb-2">
                Cadastro de Psicólogo
              </h1>
              <p className="text-gray-600">
                Preencha seus dados para começar a atender pacientes pela plataforma
              </p>
            </div>

            <form onSubmit={handlePsyRegistration} className="space-y-6">
              {/* Dados Pessoais */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-800">Dados Pessoais</h3>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Nome Completo *
                    </label>
                    <input
                      type="text"
                      required
                      value={psyRegistration.fullName || ''}
                      onChange={(e) => setPsyRegistration({...psyRegistration, fullName: e.target.value})}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      placeholder="Seu nome completo"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      CRP *
                    </label>
                    <input
                      type="text"
                      required
                      value={psyRegistration.crp || ''}
                      onChange={(e) => setPsyRegistration({...psyRegistration, crp: e.target.value})}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      placeholder="CRP 00/000000"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      E-mail *
                    </label>
                    <input
                      type="email"
                      required
                      value={psyRegistration.email || ''}
                      onChange={(e) => setPsyRegistration({...psyRegistration, email: e.target.value})}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      placeholder="seu@email.com"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Telefone *
                    </label>
                    <input
                      type="tel"
                      required
                      value={psyRegistration.phone || ''}
                      onChange={(e) => setPsyRegistration({...psyRegistration, phone: e.target.value})}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      placeholder="(00) 00000-0000"
                    />
                  </div>
                </div>
              </div>

              {/* Abordagens */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Abordagens Terapêuticas * (selecione uma ou mais)
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {Object.values(therapyApproaches).map((therapy) => (
                    <button
                      key={therapy.id}
                      type="button"
                      onClick={() => toggleApproach(therapy.id)}
                      className={`p-3 rounded-lg border-2 transition-all ${
                        psyRegistration.approaches?.includes(therapy.id)
                          ? `border-purple-500 bg-purple-50`
                          : 'border-gray-200 hover:border-purple-300'
                      }`}
                    >
                      <div className="text-2xl mb-1">{therapy.icon}</div>
                      <div className="text-xs font-medium text-gray-700">{therapy.name}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Especialidades */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Especialidades (separadas por vírgula)
                </label>
                <input
                  type="text"
                  value={psyRegistration.specialties?.join(', ') || ''}
                  onChange={(e) => setPsyRegistration({
                    ...psyRegistration, 
                    specialties: e.target.value.split(',').map(s => s.trim()).filter(s => s)
                  })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder="Ex: Ansiedade, Depressão, Traumas"
                />
              </div>

              {/* Localização */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-800">Localização</h3>
                
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Estado *
                    </label>
                    <select
                      required
                      value={psyRegistration.state || ''}
                      onChange={(e) => setPsyRegistration({...psyRegistration, state: e.target.value})}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    >
                      <option value="">Selecione...</option>
                      {brazilianStates.map(state => (
                        <option key={state.code} value={state.code}>{state.name}</option>
                      ))}
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Cidade *
                    </label>
                    <input
                      type="text"
                      required
                      value={psyRegistration.city || ''}
                      onChange={(e) => setPsyRegistration({...psyRegistration, city: e.target.value})}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      placeholder="Sua cidade"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Bairro
                    </label>
                    <input
                      type="text"
                      value={psyRegistration.neighborhood || ''}
                      onChange={(e) => setPsyRegistration({...psyRegistration, neighborhood: e.target.value})}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      placeholder="Seu bairro"
                    />
                  </div>
                </div>
              </div>

              {/* Modalidade */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Modalidade de Atendimento * (selecione uma ou mais)
                </label>
                <div className="flex gap-4">
                  <button
                    type="button"
                    onClick={() => toggleModality('online')}
                    className={`flex-1 p-4 rounded-lg border-2 transition-all ${
                      psyRegistration.modality?.includes('online')
                        ? 'border-purple-500 bg-purple-50'
                        : 'border-gray-200 hover:border-purple-300'
                    }`}
                  >
                    <div className="text-2xl mb-2">💻</div>
                    <div className="font-medium text-gray-700">Online</div>
                  </button>
                  
                  <button
                    type="button"
                    onClick={() => toggleModality('presencial')}
                    className={`flex-1 p-4 rounded-lg border-2 transition-all ${
                      psyRegistration.modality?.includes('presencial')
                        ? 'border-purple-500 bg-purple-50'
                        : 'border-gray-200 hover:border-purple-300'
                    }`}
                  >
                    <div className="text-2xl mb-2">🏢</div>
                    <div className="font-medium text-gray-700">Presencial</div>
                  </button>
                </div>
              </div>

              {/* Preço */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Preço Médio da Sessão *
                </label>
                <input
                  type="text"
                  required
                  value={psyRegistration.priceRange || ''}
                  onChange={(e) => setPsyRegistration({...psyRegistration, priceRange: e.target.value})}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder="Ex: R$ 150 - R$ 200"
                />
              </div>

              {/* Bio */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Mini Bio *
                </label>
                <textarea
                  required
                  rows={4}
                  value={psyRegistration.bio || ''}
                  onChange={(e) => setPsyRegistration({...psyRegistration, bio: e.target.value})}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder="Conte um pouco sobre sua experiência e abordagem..."
                />
              </div>

              {/* Documentos */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Documentos para Validação *
                </label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-purple-400 transition-colors cursor-pointer">
                  <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                  <p className="text-sm text-gray-600 mb-1">
                    Clique para fazer upload ou arraste os arquivos
                  </p>
                  <p className="text-xs text-gray-500">
                    CRP, diploma, certificados (PDF, JPG ou PNG)
                  </p>
                  <input
                    type="file"
                    multiple
                    accept=".pdf,.jpg,.jpeg,.png"
                    className="hidden"
                  />
                </div>
              </div>

              <Button
                type="submit"
                size="lg"
                className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white"
              >
                Continuar para Assinatura
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </form>
          </Card>
        </div>
      </div>
    );
  }

  if (step === 'psy-subscription') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 p-4 py-12">
        <div className="container mx-auto max-w-4xl">
          <Button
            onClick={() => setStep('psy-register')}
            variant="ghost"
            className="mb-6"
          >
            ← Voltar
          </Button>

          <Card className="p-8 bg-white/90 backdrop-blur-sm shadow-xl">
            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <CreditCard className="w-8 h-8 text-white" />
              </div>
              <h1 className="text-3xl font-bold text-gray-800 mb-2">
                Plano de Assinatura
              </h1>
              <p className="text-gray-600">
                Escolha seu plano e comece a receber pacientes
              </p>
            </div>

            {/* Plano */}
            <Card className="p-6 mb-8 bg-gradient-to-br from-purple-50 to-pink-50 border-2 border-purple-200">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-2xl font-bold text-gray-800 mb-2">Plano Mensal</h3>
                  <p className="text-gray-600 mb-4">Acesso completo à plataforma</p>
                </div>
                <div className="text-right">
                  <div className="text-3xl font-bold text-purple-600">R$ 99</div>
                  <div className="text-sm text-gray-600">/mês</div>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-center gap-2 text-gray-700">
                  <Check className="w-5 h-5 text-green-600" />
                  <span>Aparecer nas buscas da plataforma</span>
                </div>
                <div className="flex items-center gap-2 text-gray-700">
                  <Check className="w-5 h-5 text-green-600" />
                  <span>Receber mensagens de pacientes</span>
                </div>
                <div className="flex items-center gap-2 text-gray-700">
                  <Check className="w-5 h-5 text-green-600" />
                  <span>Receber pedidos de agendamento</span>
                </div>
                <div className="flex items-center gap-2 text-gray-700">
                  <Check className="w-5 h-5 text-green-600" />
                  <span>Painel administrativo completo</span>
                </div>
                <div className="flex items-center gap-2 text-gray-700">
                  <Check className="w-5 h-5 text-green-600" />
                  <span>Destaque para avaliações altas</span>
                </div>
                <div className="flex items-center gap-2 text-gray-700">
                  <Check className="w-5 h-5 text-green-600" />
                  <span>Renovação automática</span>
                </div>
              </div>
            </Card>

            {/* Forma de Pagamento */}
            <form onSubmit={handleSubscriptionPayment} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Forma de Pagamento
                </label>
                <div className="grid grid-cols-2 gap-4">
                  <button
                    type="button"
                    onClick={() => setSelectedPaymentMethod('credit_card')}
                    className={`p-4 rounded-lg border-2 transition-all ${
                      selectedPaymentMethod === 'credit_card'
                        ? 'border-purple-500 bg-purple-50'
                        : 'border-gray-200 hover:border-purple-300'
                    }`}
                  >
                    <CreditCard className="w-6 h-6 mx-auto mb-2 text-gray-700" />
                    <div className="font-medium text-gray-700">Cartão de Crédito</div>
                    <div className="text-xs text-gray-500 mt-1">Renovação automática</div>
                  </button>
                  
                  <button
                    type="button"
                    onClick={() => setSelectedPaymentMethod('pix')}
                    className={`p-4 rounded-lg border-2 transition-all ${
                      selectedPaymentMethod === 'pix'
                        ? 'border-purple-500 bg-purple-50'
                        : 'border-gray-200 hover:border-purple-300'
                    }`}
                  >
                    <div className="text-2xl mb-2">💳</div>
                    <div className="font-medium text-gray-700">PIX</div>
                    <div className="text-xs text-gray-500 mt-1">Recorrente mensal</div>
                  </button>
                </div>
              </div>

              {selectedPaymentMethod === 'credit_card' && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Número do Cartão
                    </label>
                    <input
                      type="text"
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      placeholder="0000 0000 0000 0000"
                    />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Validade
                      </label>
                      <input
                        type="text"
                        required
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        placeholder="MM/AA"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        CVV
                      </label>
                      <input
                        type="text"
                        required
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        placeholder="000"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Nome no Cartão
                    </label>
                    <input
                      type="text"
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      placeholder="Nome como está no cartão"
                    />
                  </div>
                </div>
              )}

              {selectedPaymentMethod === 'pix' && (
                <Card className="p-6 bg-blue-50 border-blue-200">
                  <div className="text-center">
                    <div className="w-48 h-48 bg-white rounded-lg mx-auto mb-4 flex items-center justify-center">
                      <div className="text-gray-400">QR Code PIX</div>
                    </div>
                    <p className="text-sm text-gray-600 mb-2">
                      Escaneie o QR Code ou copie o código PIX
                    </p>
                    <Button type="button" variant="outline" size="sm">
                      Copiar Código PIX
                    </Button>
                  </div>
                </Card>
              )}

              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 flex gap-3">
                <AlertCircle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
                <div className="text-sm text-gray-700">
                  <p className="font-medium mb-1">Importante:</p>
                  <p>Seu perfil será ativado após a validação dos documentos enviados. Você receberá um e-mail quando estiver tudo pronto!</p>
                </div>
              </div>

              <Button
                type="submit"
                size="lg"
                className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white"
              >
                Confirmar Pagamento - R$ 99,00
              </Button>
            </form>
          </Card>
        </div>
      </div>
    );
  }

  if (step === 'psy-dashboard' && currentPsychologist) {
    const daysUntilExpiry = Math.ceil((new Date(currentPsychologist.subscriptionExpiry || '').getTime() - Date.now()) / (1000 * 60 * 60 * 24));
    
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 p-4 py-12">
        <div className="container mx-auto max-w-6xl">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-800 mb-2">
                Painel Administrativo
              </h1>
              <p className="text-gray-600">Bem-vindo(a), {currentPsychologist.name}</p>
            </div>
            <div className="flex gap-3">
              <Button
                onClick={() => window.location.href = '/appointments'}
                variant="outline"
                className="relative"
              >
                <Calendar className="mr-2 w-4 h-4" />
                Agendamentos
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                  2
                </span>
              </Button>
              <Button
                onClick={() => setStep('home')}
                variant="outline"
              >
                <Home className="mr-2 w-4 h-4" />
                Voltar ao Início
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
            {/* Status da Assinatura */}
            <Card className="p-6 bg-white/90 backdrop-blur-sm">
              <div className="flex items-center gap-3 mb-4">
                <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                  currentPsychologist.subscriptionStatus === 'active' 
                    ? 'bg-green-100' 
                    : 'bg-red-100'
                }`}>
                  {currentPsychologist.subscriptionStatus === 'active' ? (
                    <Check className="w-6 h-6 text-green-600" />
                  ) : (
                    <X className="w-6 h-6 text-red-600" />
                  )}
                </div>
                <div>
                  <h3 className="font-semibold text-gray-800">Status da Assinatura</h3>
                  <p className={`text-sm ${
                    currentPsychologist.subscriptionStatus === 'active'
                      ? 'text-green-600'
                      : 'text-red-600'
                  }`}>
                    {currentPsychologist.subscriptionStatus === 'active' ? 'Ativa' : 'Inativa'}
                  </p>
                </div>
              </div>
              <div className="space-y-2 text-sm text-gray-600">
                <p>Plano: <span className="font-medium">Mensal</span></p>
                <p>Renova em: <span className="font-medium">{daysUntilExpiry} dias</span></p>
                <p>Valor: <span className="font-medium">R$ 99,00/mês</span></p>
              </div>
              <div className="mt-4 pt-4 border-t border-gray-200 space-y-2">
                <Button variant="outline" size="sm" className="w-full">
                  Gerenciar Assinatura
                </Button>
                <Button variant="ghost" size="sm" className="w-full text-red-600 hover:text-red-700 hover:bg-red-50">
                  Cancelar Assinatura
                </Button>
              </div>
            </Card>

            {/* Validação de Documentos */}
            <Card className="p-6 bg-white/90 backdrop-blur-sm">
              <div className="flex items-center gap-3 mb-4">
                <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                  currentPsychologist.documentsValidated 
                    ? 'bg-green-100' 
                    : 'bg-yellow-100'
                }`}>
                  {currentPsychologist.documentsValidated ? (
                    <Check className="w-6 h-6 text-green-600" />
                  ) : (
                    <AlertCircle className="w-6 h-6 text-yellow-600" />
                  )}
                </div>
                <div>
                  <h3 className="font-semibold text-gray-800">Documentos</h3>
                  <p className={`text-sm ${
                    currentPsychologist.documentsValidated
                      ? 'text-green-600'
                      : 'text-yellow-600'
                  }`}>
                    {currentPsychologist.documentsValidated ? 'Validados' : 'Em análise'}
                  </p>
                </div>
              </div>
              <p className="text-sm text-gray-600 mb-4">
                {currentPsychologist.documentsValidated
                  ? 'Seus documentos foram validados com sucesso!'
                  : 'Seus documentos estão sendo analisados. Você receberá um e-mail em breve.'}
              </p>
              <Button variant="outline" size="sm" className="w-full">
                Ver Documentos
              </Button>
            </Card>

            {/* Estatísticas */}
            <Card className="p-6 bg-white/90 backdrop-blur-sm">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                  <Users className="w-6 h-6 text-purple-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-800">Estatísticas</h3>
                  <p className="text-sm text-gray-600">Este mês</p>
                </div>
              </div>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Visualizações</span>
                  <span className="font-semibold text-gray-800">0</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Mensagens</span>
                  <span className="font-semibold text-gray-800">0</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Agendamentos</span>
                  <span className="font-semibold text-gray-800">2</span>
                </div>
              </div>
            </Card>
          </div>

          {/* Editar Perfil */}
          <Card className="p-8 bg-white/90 backdrop-blur-sm">
            <div className="flex items-center gap-3 mb-6">
              <Settings className="w-6 h-6 text-purple-600" />
              <h2 className="text-2xl font-bold text-gray-800">Editar Perfil</h2>
            </div>

            <form className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Foto de Perfil
                  </label>
                  <div className="flex items-center gap-4">
                    <img
                      src={currentPsychologist.photo}
                      alt={currentPsychologist.name}
                      className="w-20 h-20 rounded-full object-cover"
                    />
                    <Button type="button" variant="outline" size="sm">
                      Alterar Foto
                    </Button>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Preço da Sessão
                  </label>
                  <input
                    type="text"
                    defaultValue={currentPsychologist.priceRange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Bio
                </label>
                <textarea
                  rows={4}
                  defaultValue={currentPsychologist.bio}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Horários Disponíveis
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {['Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb', 'Dom'].map(day => (
                    <button
                      key={day}
                      type="button"
                      className="p-3 rounded-lg border-2 border-gray-200 hover:border-purple-300 transition-all"
                    >
                      {day}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Endereço (se presencial)
                </label>
                <input
                  type="text"
                  defaultValue={currentPsychologist.address || ''}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder="Rua, número, complemento"
                />
              </div>

              <div className="flex gap-4">
                <Button
                  type="submit"
                  className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white"
                >
                  Salvar Alterações
                </Button>
                <Button type="button" variant="outline">
                  Cancelar
                </Button>
              </div>
            </form>
          </Card>
        </div>
      </div>
    );
  }

  if (step === 'therapy-detail' && selectedTherapy) {
    const therapy = therapyApproaches[selectedTherapy];
    
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 p-4 py-12">
        <div className="container mx-auto max-w-4xl">
          <Button
            onClick={() => setStep('home')}
            variant="ghost"
            className="mb-6"
          >
            ← Voltar para início
          </Button>

          <Card className="p-8 bg-white/90 backdrop-blur-sm shadow-xl">
            <div className="flex items-center gap-4 mb-6">
              <div className={`w-16 h-16 bg-gradient-to-br ${therapy.color} rounded-2xl flex items-center justify-center text-3xl`}>
                {therapy.icon}
              </div>
              <div>
                <h1 className="text-3xl sm:text-4xl font-bold text-gray-800">
                  {therapy.name}
                </h1>
                <p className="text-gray-600 mt-1">{therapy.description}</p>
              </div>
            </div>

            <div className="prose prose-lg max-w-none">
              <div className="text-gray-700 whitespace-pre-line leading-relaxed">
                {therapy.detailedDescription}
              </div>
            </div>

            <div className="mt-8 pt-6 border-t border-gray-200 flex flex-col sm:flex-row gap-4">
              <Button
                onClick={startQuiz}
                size="lg"
                className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white"
              >
                Fazer Quiz para Descobrir Minha Abordagem
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
              <Button
                onClick={() => setStep('home')}
                variant="outline"
                size="lg"
              >
                Voltar ao Início
              </Button>
            </div>
          </Card>
        </div>
      </div>
    );
  }

  if (step === 'quiz') {
    const question = quizQuestions[currentQuestion];
    const progress = ((currentQuestion + 1) / quizQuestions.length) * 100;

    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 flex items-center justify-center p-4">
        <Card className="w-full max-w-2xl p-6 sm:p-8 bg-white/90 backdrop-blur-sm shadow-xl">
          <div className="mb-6">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium text-gray-600">
                Pergunta {currentQuestion + 1} de {quizQuestions.length}
              </span>
              <span className="text-sm font-medium text-purple-600">{Math.round(progress)}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-gradient-to-r from-purple-600 to-pink-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>

          <h2 className="text-2xl sm:text-3xl font-bold mb-8 text-gray-800">
            {question.question}
          </h2>

          <div className="space-y-3">
            {question.options.map((option) => (
              <button
                key={option.id}
                onClick={() => handleAnswer(option.approach)}
                className="w-full text-left p-4 rounded-xl border-2 border-gray-200 hover:border-purple-400 hover:bg-purple-50 transition-all duration-200 group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-gray-100 group-hover:bg-purple-100 flex items-center justify-center font-semibold text-gray-600 group-hover:text-purple-600 transition-colors">
                    {option.id.toUpperCase()}
                  </div>
                  <span className="text-gray-700 group-hover:text-gray-900 font-medium">
                    {option.text}
                  </span>
                </div>
              </button>
            ))}
          </div>
        </Card>
      </div>
    );
  }

  if (step === 'result' && quizResult) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 p-4 py-12">
        <div className="container mx-auto max-w-4xl">
          <Card className="p-6 sm:p-8 bg-white/90 backdrop-blur-sm shadow-xl">
            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-8 h-8 text-white" />
              </div>
              <h2 className="text-3xl sm:text-4xl font-bold mb-4 text-gray-800">
                Seu Resultado!
              </h2>
              <p className="text-gray-600 text-lg">
                {quizResult.approaches.length === 1 
                  ? 'A abordagem ideal para você é:'
                  : 'As abordagens que mais combinam com você são:'}
              </p>
            </div>

            <div className="space-y-4 mb-8">
              {quizResult.approaches.map((approachId) => {
                const therapy = therapyApproaches[approachId];
                return (
                  <Card key={approachId} className={`p-6 bg-gradient-to-br ${therapy.color} text-white`}>
                    <div className="flex items-start gap-4">
                      <div className="text-4xl">{therapy.icon}</div>
                      <div className="flex-1">
                        <h3 className="text-2xl font-bold mb-2">{therapy.name}</h3>
                        <p className="text-white/90">{therapy.description}</p>
                      </div>
                    </div>
                  </Card>
                );
              })}
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                onClick={viewPsychologists}
                size="lg"
                className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white"
              >
                Ver Psicólogos Recomendados
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
              <Button
                onClick={() => setStep('home')}
                variant="outline"
                size="lg"
              >
                <Home className="mr-2 w-5 h-5" />
                Voltar ao Início
              </Button>
              <Button
                onClick={startQuiz}
                variant="outline"
                size="lg"
              >
                Refazer Quiz
              </Button>
            </div>
          </Card>
        </div>

        {/* Modal de Autenticação */}
        <AuthModal
          isOpen={showAuthModal}
          onClose={() => setShowAuthModal(false)}
          onSuccess={handleAuthSuccess}
          mode={authMode}
        />
      </div>
    );
  }

  if (step === 'list') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 p-4 py-12">
        <div className="container mx-auto max-w-6xl">
          <div className="mb-8">
            <Button
              onClick={() => setStep(quizResult ? 'result' : 'home')}
              variant="ghost"
              className="mb-4"
            >
              ← Voltar
            </Button>
            <h1 className="text-3xl sm:text-4xl font-bold mb-2 text-gray-800">
              Psicólogos Recomendados
            </h1>
            <p className="text-gray-600">
              {filteredPsychologists.length} profissionais encontrados
              {quizResult && ' para sua abordagem'}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredPsychologists.map((psy) => (
              <Card key={psy.id} className="p-6 bg-white/90 backdrop-blur-sm hover:shadow-xl transition-shadow">
                <div className="flex gap-4 mb-4">
                  <img
                    src={psy.photo}
                    alt={psy.name}
                    className="w-20 h-20 rounded-full object-cover"
                  />
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-gray-800">{psy.name}</h3>
                    <p className="text-sm text-gray-600">{psy.crp}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <div className="flex items-center gap-1">
                        <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                        <span className="text-sm font-medium">{psy.rating}</span>
                      </div>
                      <span className="text-sm text-gray-500">({psy.reviewCount} avaliações)</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-2 mb-4">
                  <div className="flex flex-wrap gap-2">
                    {psy.approaches.map((approach) => (
                      <span
                        key={approach}
                        className={`px-3 py-1 rounded-full text-xs font-medium text-white bg-gradient-to-r ${therapyApproaches[approach].color}`}
                      >
                        {therapyApproaches[approach].name}
                      </span>
                    ))}
                  </div>
                  <p className="text-sm text-gray-600 line-clamp-2">{psy.bio}</p>
                  <div className="flex items-center gap-4 text-sm text-gray-600">
                    <span>📍 {psy.city}/{psy.state}</span>
                    <span>💰 {psy.priceRange}</span>
                  </div>
                  <div className="flex gap-2">
                    {psy.modality.map((mod) => (
                      <span key={mod} className="text-xs px-2 py-1 bg-blue-100 text-blue-700 rounded">
                        {mod === 'online' ? '💻 Online' : '🏢 Presencial'}
                      </span>
                    ))}
                  </div>
                </div>

                <Button
                  onClick={() => viewProfile(psy)}
                  className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white"
                >
                  Ver Perfil Completo
                </Button>
              </Card>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (step === 'profile' && selectedPsychologist) {
    const psy = selectedPsychologist;
    const next30Days = getNext30Days();

    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 p-4 py-12">
        <div className="container mx-auto max-w-4xl">
          <Button
            onClick={() => setStep('list')}
            variant="ghost"
            className="mb-4"
          >
            ← Voltar para lista
          </Button>

          <Card className="p-6 sm:p-8 bg-white/90 backdrop-blur-sm shadow-xl">
            <div className="flex flex-col sm:flex-row gap-6 mb-6">
              <img
                src={psy.photo}
                alt={psy.name}
                className="w-32 h-32 rounded-full object-cover mx-auto sm:mx-0"
              />
              <div className="flex-1 text-center sm:text-left">
                <h1 className="text-3xl font-bold text-gray-800 mb-2">{psy.name}</h1>
                <p className="text-gray-600 mb-2">{psy.crp}</p>
                <div className="flex items-center gap-2 justify-center sm:justify-start mb-3">
                  <div className="flex items-center gap-1">
                    <Star className="w-5 h-5 text-yellow-500 fill-yellow-500" />
                    <span className="text-lg font-medium">{psy.rating}</span>
                  </div>
                  <span className="text-gray-500">({psy.reviewCount} avaliações)</span>
                </div>
                <div className="flex flex-wrap gap-2 justify-center sm:justify-start">
                  {psy.approaches.map((approach) => (
                    <span
                      key={approach}
                      className={`px-3 py-1 rounded-full text-sm font-medium text-white bg-gradient-to-r ${therapyApproaches[approach].color}`}
                    >
                      {therapyApproaches[approach].name}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <div>
                <h2 className="text-xl font-semibold mb-3 text-gray-800">Sobre</h2>
                <p className="text-gray-700">{psy.bio}</p>
              </div>

              <div>
                <h2 className="text-xl font-semibold mb-3 text-gray-800">Especialidades</h2>
                <div className="flex flex-wrap gap-2">
                  {psy.specialties.map((specialty) => (
                    <span key={specialty} className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm">
                      {specialty}
                    </span>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <h3 className="font-semibold text-gray-800 mb-2">📍 Localização</h3>
                  <p className="text-gray-600">{psy.city}/{psy.state}</p>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-800 mb-2">💰 Valor da Consulta</h3>
                  <p className="text-gray-600">{psy.priceRange}</p>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-800 mb-2">📅 Disponibilidade</h3>
                  <p className="text-gray-600">{psy.availability.join(', ')}</p>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-800 mb-2">💻 Modalidade</h3>
                  <div className="flex gap-2">
                    {psy.modality.map((mod) => (
                      <span key={mod} className="text-sm px-2 py-1 bg-blue-100 text-blue-700 rounded">
                        {mod === 'online' ? 'Online' : 'Presencial'}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {!showAppointmentForm ? (
                <div className="flex flex-col sm:flex-row gap-4 pt-4">
                  <Button
                    onClick={() => {
                      setShowAppointmentForm(true);
                      setShowCalendar(true);
                    }}
                    size="lg"
                    className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white"
                  >
                    <Calendar className="mr-2 w-5 h-5" />
                    Agendar Consulta
                  </Button>
                  <Button
                    variant="outline"
                    size="lg"
                    className="flex-1"
                  >
                    <MessageCircle className="mr-2 w-5 h-5" />
                    Enviar Mensagem
                  </Button>
                </div>
              ) : (
                <Card className="p-6 bg-purple-50 border-purple-200">
                  <h3 className="text-xl font-semibold mb-4 text-gray-800 flex items-center gap-2">
                    <Calendar className="w-5 h-5 text-purple-600" />
                    Agendar Consulta com {psy.name}
                  </h3>
                  
                  <form onSubmit={handleAppointment} className="space-y-4">
                    {/* Calendário Interativo */}
                    {showCalendar && (
                      <div className="mb-6">
                        <label className="block text-sm font-medium text-gray-700 mb-3">
                          Escolha uma data disponível:
                        </label>
                        <div className="grid grid-cols-3 sm:grid-cols-5 gap-2 max-h-64 overflow-y-auto p-2 bg-white rounded-lg border border-gray-200">
                          {next30Days.map((date) => {
                            const dateStr = date.toISOString().split('T')[0];
                            const isSelected = selectedDate === dateStr;
                            const dayName = date.toLocaleDateString('pt-BR', { weekday: 'short' });
                            const dayNum = date.getDate();
                            const monthName = date.toLocaleDateString('pt-BR', { month: 'short' });
                            
                            return (
                              <button
                                key={dateStr}
                                type="button"
                                onClick={() => {
                                  setSelectedDate(dateStr);
                                  setSelectedTime('');
                                }}
                                className={`p-3 rounded-lg border-2 transition-all text-center ${
                                  isSelected
                                    ? 'border-purple-500 bg-purple-100'
                                    : 'border-gray-200 hover:border-purple-300 hover:bg-purple-50'
                                }`}
                              >
                                <div className="text-xs text-gray-600 capitalize">{dayName}</div>
                                <div className="text-lg font-bold text-gray-800">{dayNum}</div>
                                <div className="text-xs text-gray-600 capitalize">{monthName}</div>
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    )}

                    {/* Horários Disponíveis */}
                    {selectedDate && (
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-3">
                          Escolha um horário:
                        </label>
                        <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                          {availableTimes.map((time) => {
                            const isSelected = selectedTime === time;
                            return (
                              <button
                                key={time}
                                type="button"
                                onClick={() => setSelectedTime(time)}
                                className={`p-3 rounded-lg border-2 transition-all flex items-center justify-center gap-2 ${
                                  isSelected
                                    ? 'border-purple-500 bg-purple-100'
                                    : 'border-gray-200 hover:border-purple-300 hover:bg-purple-50'
                                }`}
                              >
                                <Clock className="w-4 h-4 text-gray-600" />
                                <span className="font-medium text-gray-800">{time}</span>
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    )}

                    {selectedDate && selectedTime && (
                      <>
                        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                          <p className="text-sm text-green-800 font-medium">
                            ✓ Data e horário selecionados: {new Date(selectedDate).toLocaleDateString('pt-BR')} às {selectedTime}
                          </p>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Nome Completo *
                          </label>
                          <input
                            type="text"
                            name="name"
                            required
                            defaultValue={user?.name || ''}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                            placeholder="Seu nome"
                          />
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            E-mail *
                          </label>
                          <input
                            type="email"
                            name="email"
                            required
                            defaultValue={user?.email || ''}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                            placeholder="seu@email.com"
                          />
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Telefone *
                          </label>
                          <input
                            type="tel"
                            name="phone"
                            required
                            defaultValue={user?.phone || ''}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                            placeholder="(00) 00000-0000"
                          />
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Modalidade *
                          </label>
                          <select
                            name="modality"
                            required
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                          >
                            <option value="">Selecione...</option>
                            {psy.modality.map((mod) => (
                              <option key={mod} value={mod}>
                                {mod === 'online' ? 'Online' : 'Presencial'}
                              </option>
                            ))}
                          </select>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Observações (opcional)
                          </label>
                          <textarea
                            name="notes"
                            rows={3}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                            placeholder="Alguma informação adicional que gostaria de compartilhar..."
                          />
                        </div>

                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                          <div className="flex gap-3">
                            <Bell className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                            <div className="text-sm text-blue-800">
                              <p className="font-medium mb-1">Sistema de Notificações Ativo</p>
                              <p>Você receberá notificações por e-mail e SMS quando o psicólogo confirmar, recusar ou reagendar sua consulta. Também enviaremos lembretes antes da sessão!</p>
                            </div>
                          </div>
                        </div>
                      </>
                    )}

                    <div className="flex gap-3 pt-2">
                      {selectedDate && selectedTime && (
                        <Button
                          type="submit"
                          className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white"
                        >
                          <CheckCircle className="mr-2 w-5 h-5" />
                          Confirmar Agendamento
                        </Button>
                      )}
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => {
                          setShowAppointmentForm(false);
                          setShowCalendar(false);
                          setSelectedDate('');
                          setSelectedTime('');
                        }}
                      >
                        Cancelar
                      </Button>
                    </div>
                  </form>
                </Card>
              )}
            </div>
          </Card>
        </div>
      </div>
    );
  }

  return null;
}
