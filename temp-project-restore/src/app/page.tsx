'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Brain, Heart, Users, Target, MessageCircle, Calendar, ArrowRight, Sparkles, CheckCircle, Home, BookOpen, UserPlus, Settings, CreditCard, Check, X, Upload, AlertCircle, Clock, Star, Bell, LogOut, User as UserIcon } from 'lucide-react';
import { quizQuestions, therapyApproaches, mockPsychologists, brazilianStates } from '@/lib/data';
import { TherapyApproach, QuizResult, Psychologist, PsychologistRegistration, Appointment } from '@/lib/types';
import { AuthModal } from '@/components/custom/auth-modal';
import { useRouter } from 'next/navigation';

type Step = 'home' | 'quiz' | 'result' | 'list' | 'profile' | 'therapy-detail' | 'psy-register' | 'psy-subscription' | 'psy-dashboard';

interface User {
  name: string;
  email: string;
  phone: string;
  role: 'patient' | 'psychologist';
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