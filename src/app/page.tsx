'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Brain, Heart, Users, Target, MessageCircle, Calendar, ArrowRight, Sparkles, CheckCircle, Home, BookOpen, UserPlus, Settings, CreditCard, Check, X, Upload, AlertCircle, Clock, Star, Bell, LogOut, User as UserIcon } from 'lucide-react';
import { quizQuestions, therapyApproaches, mockPsychologists, brazilianStates } from '@/lib/data';
import { TherapyApproach, QuizResult, Psychologist, PsychologistRegistration, Appointment, QuizQuestion } from '@/lib/types';
import { AuthModal } from '@/components/custom/auth-modal';
import { useRouter } from 'next/navigation';

type Step = 'home' | 'quiz' | 'result' | 'list' | 'profile' | 'therapy-detail' | 'psy-intro' | 'psy-register' | 'psy-subscription' | 'psy-dashboard';

interface User {
  name: string;
  email: string;
  phone: string;
  role: 'patient' | 'psychologist';
}

// Função para embaralhar array (Fisher-Yates shuffle)
function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

export default function HomePage() {
  const router = useRouter();
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
  const [randomizedQuestions, setRandomizedQuestions] = useState<QuizQuestion[]>([]);
  
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
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<'credit_card' | 'pix'>('credit_card');
  const [currentPsychologist, setCurrentPsychologist] = useState<Psychologist | null>(null);
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);

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
      const userData = JSON.parse(storedUser);
      setUser(userData);
      
      // Redirecionar baseado no role
      if (userData.role === 'psychologist') {
        router.push('/appointments');
      } else {
        router.push('/my-appointments');
      }
    }
    setShowAuthModal(false);
    
    // Se havia uma ação pendente, executar
    if (pendingAction === 'viewPsychologists') {
      setPendingAction(null);
      setStep('list');
    }
  };

  const startQuiz = () => {
    // Embaralhar perguntas ao iniciar o quiz
    const shuffled = shuffleArray(quizQuestions);
    setRandomizedQuestions(shuffled);
    setStep('quiz');
    setCurrentQuestion(0);
    setAnswers([]);
    setQuizResult(null);
  };

  const handleAnswer = (approach: TherapyApproach) => {
    const newAnswers = [...answers, approach];
    setAnswers(newAnswers);

    if (currentQuestion < randomizedQuestions.length - 1) {
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

  const handleSubscriptionPayment = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!psyRegistration.fullName || !psyRegistration.email || !psyRegistration.crp) {
      alert('Dados incompletos. Por favor, volte e preencha todos os campos.');
      return;
    }

    setIsProcessingPayment(true);

    try {
      // Criar preferência de pagamento no Mercado Pago
      const response = await fetch('/api/mercadopago/create-preference', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          fullName: psyRegistration.fullName,
          email: psyRegistration.email,
          crp: psyRegistration.crp,
        }),
      });

      if (!response.ok) {
        throw new Error('Erro ao criar preferência de pagamento');
      }

      const data = await response.json();
      
      // Redirecionar para o checkout do Mercado Pago
      if (data.initPoint) {
        window.location.href = data.initPoint;
      } else {
        throw new Error('Link de pagamento não disponível');
      }
    } catch (error) {
      console.error('Erro ao processar pagamento:', error);
      alert('Erro ao processar pagamento. Por favor, tente novamente.');
      setIsProcessingPayment(false);
    }
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

  // TELA HOME
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
                  onClick={() => router.push(user.role === 'psychologist' ? '/appointments' : '/my-appointments')}
                  variant="outline"
                  size="sm"
                  className="rounded-full"
                >
                  {user.role === 'psychologist' ? 'Gerenciar Agendamentos' : 'Meus Agendamentos'}
                </Button>
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
                onClick={() => setStep('psy-intro')}
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
              <p className="text-gray-600 text-sm mb-3">
                No EncontraPsi, você encontra psicólogos altamente qualificados, prontos para oferecer o suporte necessário para suas necessidades emocionais e psicológicas. Todos os profissionais cadastrados em nossa plataforma possuem registro ativo no Conselho Regional de Psicologia (CRP) e são especializados em diversas abordagens terapêuticas, garantindo que você encontre o terapeuta ideal para o seu perfil.
              </p>
              <Button
                onClick={() => router.push('/about')}
                variant="ghost"
                size="sm"
                className="text-purple-600 hover:text-purple-700 p-0 h-auto font-medium"
              >
                Saiba mais...
              </Button>
            </Card>

            <Card 
              className="p-6 bg-white/80 backdrop-blur-sm border-blue-100 hover:shadow-lg transition-shadow cursor-pointer"
              onClick={() => router.push('/find-psychologists')}
            >
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center mb-4">
                <Calendar className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-lg font-semibold mb-2 text-gray-800">Agendamento Fácil</h3>
              <p className="text-gray-600 text-sm mb-3">Agende consultas online ou presenciais diretamente pela plataforma com calendário interativo.</p>
              <div className="flex items-center gap-2 text-purple-600 text-sm font-medium">
                <span>Agendar agora</span>
                <ArrowRight className="w-4 h-4" />
              </div>
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
                  onClick={() => router.push(`/abordagens/${therapy.id}`)}
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

  // TELA QUIZ
  if (step === 'quiz') {
    const currentQuizQuestion = randomizedQuestions[currentQuestion];
    const progress = ((currentQuestion + 1) / randomizedQuestions.length) * 100;

    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 py-12">
        <div className="container mx-auto px-4 max-w-3xl">
          <Button
            onClick={() => setStep('home')}
            variant="ghost"
            className="mb-6"
          >
            <ArrowRight className="w-4 h-4 mr-2 rotate-180" />
            Voltar
          </Button>

          <Card className="p-8 bg-white/90 backdrop-blur-sm shadow-xl">
            {/* Header */}
            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-gradient-to-br from-purple-600 to-pink-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Brain className="w-8 h-8 text-white" />
              </div>
              <h1 className="text-3xl font-bold text-gray-800 mb-2">
                Descubra sua Terapia Ideal
              </h1>
              <p className="text-gray-600">
                Pergunta {currentQuestion + 1} de {randomizedQuestions.length}
              </p>
            </div>

            {/* Barra de Progresso */}
            <div className="mb-8">
              <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                <div 
                  className="bg-gradient-to-r from-purple-600 to-pink-600 h-full transition-all duration-500 ease-out"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>

            {/* Pergunta */}
            <div className="mb-8">
              <h2 className="text-xl font-semibold text-gray-800 mb-6 text-center">
                {currentQuizQuestion?.question}
              </h2>

              {/* Opções */}
              <div className="space-y-3">
                {currentQuizQuestion?.options.map((option) => (
                  <button
                    key={option.id}
                    onClick={() => handleAnswer(option.approach)}
                    className="w-full p-4 text-left border-2 border-gray-200 rounded-xl hover:border-purple-600 hover:bg-purple-50 transition-all duration-200 group"
                  >
                    <div className="flex items-start gap-3">
                      <span className="flex-shrink-0 w-8 h-8 bg-purple-100 group-hover:bg-purple-600 text-purple-600 group-hover:text-white rounded-full flex items-center justify-center font-semibold text-sm transition-colors">
                        {option.id.toUpperCase()}
                      </span>
                      <span className="text-gray-700 group-hover:text-gray-900 font-medium">
                        {option.text}
                      </span>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </Card>
        </div>
      </div>
    );
  }

  // TELA RESULTADO
  if (step === 'result' && quizResult) {
    const primaryApproach = therapyApproaches[quizResult.approaches[0]];
    const secondaryApproach = quizResult.approaches[1] ? therapyApproaches[quizResult.approaches[1]] : null;
    const hasMultipleTopScores = quizResult.approaches.length > 1;

    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 py-12">
        <div className="container mx-auto px-4 max-w-4xl">
          <Card className="p-8 bg-white/90 backdrop-blur-sm shadow-xl">
            {/* Header */}
            <div className="text-center mb-8">
              <div className="w-20 h-20 bg-gradient-to-br from-purple-600 to-pink-600 rounded-2xl flex items-center justify-center mx-auto mb-4 text-4xl">
                {primaryApproach.icon}
              </div>
              <h1 className="text-3xl font-bold text-gray-800 mb-2">
                Seu Resultado
              </h1>
              <p className="text-gray-600">
                {hasMultipleTopScores 
                  ? 'Você tem compatibilidade com duas abordagens!' 
                  : 'Sua terapia ideal foi identificada!'}
              </p>
            </div>

            {/* Resultado Principal */}
            <div className="mb-8 p-6 bg-gradient-to-br from-purple-100 to-pink-100 rounded-xl border-2 border-purple-200">
              <div className="flex items-center gap-3 mb-4">
                <div className={`w-12 h-12 bg-gradient-to-br ${primaryApproach.color} rounded-xl flex items-center justify-center text-2xl`}>
                  {primaryApproach.icon}
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-800">{primaryApproach.name}</h2>
                  <p className="text-sm text-gray-600">
                    {quizResult.scores[quizResult.approaches[0]]} de {randomizedQuestions.length} respostas
                  </p>
                </div>
              </div>
              <p className="text-gray-700 mb-4">{primaryApproach.description}</p>
              <Button
                onClick={() => router.push(`/abordagens/${primaryApproach.id}`)}
                variant="outline"
                size="sm"
                className="border-purple-600 text-purple-600 hover:bg-purple-50"
              >
                <BookOpen className="w-4 h-4 mr-2" />
                Saiba mais sobre {primaryApproach.name}
              </Button>
            </div>

            {/* Resultado Secundário (se houver empate) */}
            {hasMultipleTopScores && secondaryApproach && (
              <div className="mb-8 p-6 bg-gradient-to-br from-blue-100 to-cyan-100 rounded-xl border-2 border-blue-200">
                <div className="flex items-center gap-3 mb-4">
                  <div className={`w-12 h-12 bg-gradient-to-br ${secondaryApproach.color} rounded-xl flex items-center justify-center text-2xl`}>
                    {secondaryApproach.icon}
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-gray-800">{secondaryApproach.name}</h2>
                    <p className="text-sm text-gray-600">
                      {quizResult.scores[quizResult.approaches[1]]} de {randomizedQuestions.length} respostas
                    </p>
                  </div>
                </div>
                <p className="text-gray-700 mb-4">{secondaryApproach.description}</p>
                <Button
                  onClick={() => router.push(`/abordagens/${secondaryApproach.id}`)}
                  variant="outline"
                  size="sm"
                  className="border-blue-600 text-blue-600 hover:bg-blue-50"
                >
                  <BookOpen className="w-4 h-4 mr-2" />
                  Saiba mais sobre {secondaryApproach.name}
                </Button>
              </div>
            )}

            {/* Pontuação Detalhada */}
            <div className="mb-8">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Sua Pontuação Completa</h3>
              <div className="space-y-3">
                {Object.entries(quizResult.scores)
                  .sort(([, a], [, b]) => b - a)
                  .map(([approach, score]) => {
                    const therapy = therapyApproaches[approach as TherapyApproach];
                    const percentage = (score / randomizedQuestions.length) * 100;
                    return (
                      <div key={approach} className="flex items-center gap-3">
                        <div className="flex-shrink-0 w-8 h-8 text-xl">
                          {therapy.icon}
                        </div>
                        <div className="flex-1">
                          <div className="flex justify-between items-center mb-1">
                            <span className="text-sm font-medium text-gray-700">{therapy.name}</span>
                            <span className="text-sm text-gray-600">{score}/{randomizedQuestions.length}</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div 
                              className={`bg-gradient-to-r ${therapy.color} h-full rounded-full transition-all duration-500`}
                              style={{ width: `${percentage}%` }}
                            />
                          </div>
                        </div>
                      </div>
                    );
                  })}
              </div>
            </div>

            {/* Mensagem Amigável */}
            <div className="mb-8 p-6 bg-blue-50 rounded-xl border border-blue-200">
              <div className="flex items-start gap-3">
                <Heart className="w-6 h-6 text-blue-600 mt-0.5 flex-shrink-0" />
                <div>
                  <h3 className="font-semibold text-gray-800 mb-2">Por que essa recomendação?</h3>
                  <p className="text-sm text-gray-700">
                    {hasMultipleTopScores 
                      ? `Suas respostas indicam que você se identifica tanto com ${primaryApproach.name} quanto com ${secondaryApproach?.name}. Isso é ótimo! Significa que você tem flexibilidade para escolher entre essas abordagens ou até mesmo combiná-las. Ambas podem ser muito benéficas para você.`
                      : `Suas respostas mostram uma forte identificação com ${primaryApproach.name}. Esta abordagem se alinha perfeitamente com suas expectativas e necessidades terapêuticas. Psicólogos especializados nesta linha podem ajudá-lo a alcançar seus objetivos de forma mais eficaz.`
                    }
                  </p>
                </div>
              </div>
            </div>

            {/* Ações */}
            <div className="flex flex-col sm:flex-row gap-4">
              <Button
                onClick={() => router.push('/find-psychologists')}
                className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white py-6 text-lg rounded-xl shadow-lg"
              >
                <Users className="w-5 h-5 mr-2" />
                Ver Psicólogos Compatíveis
              </Button>
              <Button
                onClick={startQuiz}
                variant="outline"
                className="flex-1 border-2 border-purple-600 text-purple-600 hover:bg-purple-50 py-6 text-lg rounded-xl"
              >
                Refazer Quiz
              </Button>
            </div>

            <div className="mt-6 text-center">
              <Button
                onClick={() => setStep('home')}
                variant="ghost"
                className="text-gray-600 hover:text-gray-800"
              >
                Voltar para Home
              </Button>
            </div>
          </Card>
        </div>
      </div>
    );
  }

  // TELA 1 - APRESENTAÇÃO PARA PSICÓLOGOS
  if (step === 'psy-intro') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 py-12">
        <div className="container mx-auto px-4 max-w-4xl">
          <Button
            onClick={() => setStep('home')}
            variant="ghost"
            className="mb-6"
          >
            <ArrowRight className="w-4 h-4 mr-2 rotate-180" />
            Voltar
          </Button>

          <Card className="p-8 bg-white/90 backdrop-blur-sm shadow-xl">
            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-gradient-to-br from-purple-600 to-pink-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <UserPlus className="w-8 h-8 text-white" />
              </div>
              <h1 className="text-3xl font-bold text-gray-800 mb-2">
                Seja um Psicólogo Parceiro
              </h1>
              <p className="text-gray-600">
                Expanda sua prática e conecte-se com pacientes ideais
              </p>
            </div>

            {/* Descrição do Serviço */}
            <div className="mb-8">
              <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-purple-600" />
                O que você ganha
              </h2>
              <div className="space-y-3">
                <div className="flex items-start gap-3 p-3 bg-purple-50 rounded-lg">
                  <Users className="w-5 h-5 text-purple-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-medium text-gray-800">Divulgação profissional</p>
                    <p className="text-sm text-gray-600">Seu perfil visível para milhares de pacientes em busca de terapia</p>
                  </div>
                </div>
                <div className="flex items-start gap-3 p-3 bg-pink-50 rounded-lg">
                  <Target className="w-5 h-5 text-pink-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-medium text-gray-800">Match por abordagem</p>
                    <p className="text-sm text-gray-600">Conecte-se com pacientes que buscam sua especialidade terapêutica</p>
                  </div>
                </div>
                <div className="flex items-start gap-3 p-3 bg-blue-50 rounded-lg">
                  <MessageCircle className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-medium text-gray-800">Atendimento flexível</p>
                    <p className="text-sm text-gray-600">Ofereça sessões online e/ou presenciais conforme sua preferência</p>
                  </div>
                </div>
                <div className="flex items-start gap-3 p-3 bg-green-50 rounded-lg">
                  <Calendar className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-medium text-gray-800">Gestão completa</p>
                    <p className="text-sm text-gray-600">Receba mensagens, gerencie agendamentos e sua agenda dentro do app</p>
                  </div>
                </div>
                <div className="flex items-start gap-3 p-3 bg-indigo-50 rounded-lg">
                  <CheckCircle className="w-5 h-5 text-indigo-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-medium text-gray-800">Selo CRP verificado</p>
                    <p className="text-sm text-gray-600">Perfil com credibilidade e verificação profissional</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Plano de Uso */}
            <div className="mb-8 p-6 bg-gradient-to-br from-purple-100 to-pink-100 rounded-xl border-2 border-purple-200">
              <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
                <CreditCard className="w-5 h-5 text-purple-600" />
                Plano de Assinatura
              </h2>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-gray-700">Assinatura mensal</span>
                  <span className="text-2xl font-bold text-purple-600">R$ 49,90/mês</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <CheckCircle className="w-4 h-4 text-green-600" />
                  <span>Renovação automática</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <CheckCircle className="w-4 h-4 text-green-600" />
                  <span>Perfil visível apenas com assinatura ativa</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <CheckCircle className="w-4 h-4 text-green-600" />
                  <span>Cancele quando quiser, sem multas</span>
                </div>
              </div>
            </div>

            {/* Termos */}
            <div className="mb-6">
              <label className="flex items-start gap-3 cursor-pointer group">
                <input
                  type="checkbox"
                  checked={termsAccepted}
                  onChange={(e) => setTermsAccepted(e.target.checked)}
                  className="mt-1 w-5 h-5 rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                />
                <span className="text-sm text-gray-700 group-hover:text-gray-900">
                  Li e aceito os{' '}
                  <a href="/terms" className="text-purple-600 hover:text-purple-700 underline">
                    Termos de Uso
                  </a>
                  {' '}e{' '}
                  <a href="/privacy" className="text-purple-600 hover:text-purple-700 underline">
                    Política de Privacidade
                  </a>
                </span>
              </label>
            </div>

            {/* Botão Continuar */}
            <Button
              onClick={() => setStep('psy-register')}
              disabled={!termsAccepted}
              className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white py-6 text-lg rounded-xl shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Continuar para cadastro
              <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
          </Card>
        </div>
      </div>
    );
  }

  // TELA 2 - CADASTRO DO PSICÓLOGO
  if (step === 'psy-register') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 py-12">
        <div className="container mx-auto px-4 max-w-4xl">
          <Button
            onClick={() => setStep('psy-intro')}
            variant="ghost"
            className="mb-6"
          >
            <ArrowRight className="w-4 h-4 mr-2 rotate-180" />
            Voltar
          </Button>

          <Card className="p-8 bg-white/90 backdrop-blur-sm shadow-xl">
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold text-gray-800 mb-2">
                Cadastro Profissional
              </h1>
              <p className="text-gray-600">
                Preencha seus dados para criar seu perfil
              </p>
            </div>

            <form onSubmit={handlePsyRegistration} className="space-y-6">
              {/* Nome Completo */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nome Completo *
                </label>
                <input
                  type="text"
                  required
                  value={psyRegistration.fullName || ''}
                  onChange={(e) => setPsyRegistration({ ...psyRegistration, fullName: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder="Seu nome completo"
                />
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email *
                </label>
                <input
                  type="email"
                  required
                  value={psyRegistration.email || ''}
                  onChange={(e) => setPsyRegistration({ ...psyRegistration, email: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder="seu@email.com"
                />
              </div>

              {/* Senha */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Senha *
                </label>
                <input
                  type="password"
                  required
                  value={psyRegistration.password || ''}
                  onChange={(e) => setPsyRegistration({ ...psyRegistration, password: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder="Mínimo 8 caracteres"
                  minLength={8}
                />
              </div>

              {/* Telefone */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Telefone/WhatsApp *
                </label>
                <input
                  type="tel"
                  required
                  value={psyRegistration.phone || ''}
                  onChange={(e) => setPsyRegistration({ ...psyRegistration, phone: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder="(00) 00000-0000"
                />
              </div>

              {/* CRP + Estado */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    CRP *
                  </label>
                  <input
                    type="text"
                    required
                    value={psyRegistration.crp || ''}
                    onChange={(e) => setPsyRegistration({ ...psyRegistration, crp: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    placeholder="00/000000"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Estado *
                  </label>
                  <select
                    required
                    value={psyRegistration.state || ''}
                    onChange={(e) => setPsyRegistration({ ...psyRegistration, state: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  >
                    <option value="">Selecione</option>
                    {brazilianStates.map((state) => (
                      <option key={state.value} value={state.value}>{state.label}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Abordagens Terapêuticas */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Abordagens Terapêuticas * (selecione todas que pratica)
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {Object.values(therapyApproaches).map((therapy) => (
                    <label
                      key={therapy.id}
                      className={`flex items-center gap-3 p-3 border-2 rounded-lg cursor-pointer transition-all ${
                        psyRegistration.approaches?.includes(therapy.id)
                          ? 'border-purple-600 bg-purple-50'
                          : 'border-gray-200 hover:border-purple-300'
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={psyRegistration.approaches?.includes(therapy.id)}
                        onChange={() => toggleApproach(therapy.id)}
                        className="w-5 h-5 text-purple-600 rounded"
                      />
                      <span className="text-sm font-medium text-gray-700">{therapy.name}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Especialidades */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Especialidades (opcional)
                </label>
                <input
                  type="text"
                  value={psyRegistration.specialties?.join(', ') || ''}
                  onChange={(e) => setPsyRegistration({ 
                    ...psyRegistration, 
                    specialties: e.target.value.split(',').map(s => s.trim()).filter(s => s) 
                  })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder="Ex: Ansiedade, Depressão, Relacionamentos (separar por vírgula)"
                />
              </div>

              {/* Modalidade */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Modalidade de Atendimento *
                </label>
                <div className="flex gap-4">
                  <label
                    className={`flex-1 flex items-center justify-center gap-2 p-4 border-2 rounded-lg cursor-pointer transition-all ${
                      psyRegistration.modality?.includes('online')
                        ? 'border-purple-600 bg-purple-50'
                        : 'border-gray-200 hover:border-purple-300'
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={psyRegistration.modality?.includes('online')}
                      onChange={() => toggleModality('online')}
                      className="w-5 h-5 text-purple-600 rounded"
                    />
                    <span className="font-medium text-gray-700">Online</span>
                  </label>
                  <label
                    className={`flex-1 flex items-center justify-center gap-2 p-4 border-2 rounded-lg cursor-pointer transition-all ${
                      psyRegistration.modality?.includes('presencial')
                        ? 'border-purple-600 bg-purple-50'
                        : 'border-gray-200 hover:border-purple-300'
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={psyRegistration.modality?.includes('presencial')}
                      onChange={() => toggleModality('presencial')}
                      className="w-5 h-5 text-purple-600 rounded"
                    />
                    <span className="font-medium text-gray-700">Presencial</span>
                  </label>
                </div>
              </div>

              {/* Cidade/Bairro */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Cidade *
                  </label>
                  <input
                    type="text"
                    required
                    value={psyRegistration.city || ''}
                    onChange={(e) => setPsyRegistration({ ...psyRegistration, city: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    placeholder="Sua cidade"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Bairro (opcional)
                  </label>
                  <input
                    type="text"
                    value={psyRegistration.neighborhood || ''}
                    onChange={(e) => setPsyRegistration({ ...psyRegistration, neighborhood: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    placeholder="Seu bairro"
                  />
                </div>
              </div>

              {/* Valor Médio da Sessão */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Valor Médio da Sessão *
                </label>
                <select
                  required
                  value={psyRegistration.priceRange || ''}
                  onChange={(e) => setPsyRegistration({ ...psyRegistration, priceRange: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                >
                  <option value="">Selecione a faixa de preço</option>
                  <option value="R$ 50 - R$ 100">R$ 50 - R$ 100</option>
                  <option value="R$ 100 - R$ 150">R$ 100 - R$ 150</option>
                  <option value="R$ 150 - R$ 200">R$ 150 - R$ 200</option>
                  <option value="R$ 200 - R$ 300">R$ 200 - R$ 300</option>
                  <option value="Acima de R$ 300">Acima de R$ 300</option>
                </select>
              </div>

              {/* Mini Biografia */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Mini Biografia *
                </label>
                <textarea
                  required
                  value={psyRegistration.bio || ''}
                  onChange={(e) => setPsyRegistration({ ...psyRegistration, bio: e.target.value })}
                  rows={5}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
                  placeholder="Conte um pouco sobre sua experiência, formação e abordagem terapêutica..."
                />
                <p className="text-xs text-gray-500 mt-1">
                  Esta descrição será exibida no seu perfil para os pacientes
                </p>
              </div>

              {/* Botão Continuar */}
              <Button
                type="submit"
                className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white py-6 text-lg rounded-xl shadow-lg"
              >
                Continuar para pagamento
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </form>
          </Card>
        </div>
      </div>
    );
  }

  // TELA 3 - PAGAMENTO DA ASSINATURA
  if (step === 'psy-subscription') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 py-12">
        <div className="container mx-auto px-4 max-w-4xl">
          <Button
            onClick={() => setStep('psy-register')}
            variant="ghost"
            className="mb-6"
          >
            <ArrowRight className="w-4 h-4 mr-2 rotate-180" />
            Voltar
          </Button>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Resumo do Plano */}
            <Card className="lg:col-span-1 p-6 bg-white/90 backdrop-blur-sm shadow-xl h-fit">
              <h2 className="text-xl font-bold text-gray-800 mb-4">Resumo do Plano</h2>
              
              <div className="space-y-4">
                <div className="p-4 bg-gradient-to-br from-purple-100 to-pink-100 rounded-lg">
                  <p className="text-sm text-gray-600 mb-1">Plano Mensal</p>
                  <p className="text-3xl font-bold text-purple-600">R$ 49,90</p>
                  <p className="text-xs text-gray-500 mt-1">por mês</p>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm text-gray-700">
                    <CheckCircle className="w-4 h-4 text-green-600" />
                    <span>Perfil visível para pacientes</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-700">
                    <CheckCircle className="w-4 h-4 text-green-600" />
                    <span>Match por abordagem</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-700">
                    <CheckCircle className="w-4 h-4 text-green-600" />
                    <span>Gestão de agendamentos</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-700">
                    <CheckCircle className="w-4 h-4 text-green-600" />
                    <span>Selo CRP verificado</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-700">
                    <CheckCircle className="w-4 h-4 text-green-600" />
                    <span>Renovação automática</span>
                  </div>
                </div>

                <div className="pt-4 border-t border-gray-200">
                  <div className="flex justify-between items-center text-sm mb-2">
                    <span className="text-gray-600">Subtotal</span>
                    <span className="font-medium">R$ 49,90</span>
                  </div>
                  <div className="flex justify-between items-center font-bold text-lg">
                    <span>Total</span>
                    <span className="text-purple-600">R$ 49,90</span>
                  </div>
                </div>
              </div>
            </Card>

            {/* Formulário de Pagamento */}
            <Card className="lg:col-span-2 p-8 bg-white/90 backdrop-blur-sm shadow-xl">
              <h2 className="text-2xl font-bold text-gray-800 mb-6">Pagamento</h2>

              <form onSubmit={handleSubscriptionPayment} className="space-y-6">
                {/* Método de Pagamento */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Método de Pagamento
                  </label>
                  <div className="grid grid-cols-2 gap-4">
                    <button
                      type="button"
                      onClick={() => setSelectedPaymentMethod('credit_card')}
                      className={`p-4 border-2 rounded-lg transition-all ${
                        selectedPaymentMethod === 'credit_card'
                          ? 'border-purple-600 bg-purple-50'
                          : 'border-gray-200 hover:border-purple-300'
                      }`}
                    >
                      <CreditCard className="w-6 h-6 mx-auto mb-2 text-purple-600" />
                      <p className="text-sm font-medium text-gray-700">Cartão de Crédito</p>
                    </button>
                    <button
                      type="button"
                      onClick={() => setSelectedPaymentMethod('pix')}
                      className={`p-4 border-2 rounded-lg transition-all ${
                        selectedPaymentMethod === 'pix'
                          ? 'border-purple-600 bg-purple-50'
                          : 'border-gray-200 hover:border-purple-300'
                      }`}
                    >
                      <div className="w-6 h-6 mx-auto mb-2 text-purple-600 font-bold text-lg">PIX</div>
                      <p className="text-sm font-medium text-gray-700">PIX</p>
                    </button>
                  </div>
                </div>

                {/* Formulário de Cartão */}
                {selectedPaymentMethod === 'credit_card' && (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Número do Cartão
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="0000 0000 0000 0000"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Nome no Cartão
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="Como está no cartão"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Validade
                        </label>
                        <input
                          type="text"
                          required
                          placeholder="MM/AA"
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          CVV
                        </label>
                        <input
                          type="text"
                          required
                          placeholder="000"
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* Informação PIX */}
                {selectedPaymentMethod === 'pix' && (
                  <div className="p-6 bg-purple-50 rounded-lg border-2 border-purple-200">
                    <div className="flex items-start gap-3 mb-4">
                      <AlertCircle className="w-5 h-5 text-purple-600 mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="font-medium text-gray-800 mb-2">Como funciona o pagamento via PIX:</p>
                        <ol className="text-sm text-gray-600 space-y-1 list-decimal list-inside">
                          <li>Clique em "Finalizar Pagamento"</li>
                          <li>Um QR Code será gerado</li>
                          <li>Escaneie com o app do seu banco</li>
                          <li>Confirme o pagamento de R$ 49,90</li>
                          <li>Seu perfil será ativado automaticamente</li>
                        </ol>
                      </div>
                    </div>
                  </div>
                )}

                {/* Informações Importantes */}
                <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                  <div className="flex items-start gap-2">
                    <AlertCircle className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                    <div className="text-sm text-gray-700">
                      <p className="font-medium mb-1">Informações importantes:</p>
                      <ul className="space-y-1 text-xs">
                        <li>• Seu perfil ficará ativo imediatamente após a confirmação do pagamento</li>
                        <li>• A assinatura será renovada automaticamente todo mês</li>
                        <li>• Você pode cancelar a qualquer momento sem multas</li>
                        <li>• Se a assinatura expirar, seu perfil ficará oculto automaticamente</li>
                      </ul>
                    </div>
                  </div>
                </div>

                {/* Botão de Pagamento */}
                <Button
                  type="submit"
                  className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white py-6 text-lg rounded-xl shadow-lg"
                >
                  <CreditCard className="w-5 h-5 mr-2" />
                  Finalizar Pagamento - R$ 49,90
                </Button>

                <p className="text-xs text-center text-gray-500">
                  Pagamento processado com segurança pela Keoto
                </p>
              </form>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  // Retorno padrão para outros steps (list, profile, therapy-detail, etc.)
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 flex items-center justify-center p-4">
      <Card className="p-8 text-center">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Em desenvolvimento</h2>
        <p className="text-gray-600 mb-6">Esta funcionalidade está sendo implementada.</p>
        <Button onClick={() => setStep('home')} className="bg-gradient-to-r from-purple-600 to-pink-600">
          Voltar para Home
        </Button>
      </Card>
    </div>
  );
}
