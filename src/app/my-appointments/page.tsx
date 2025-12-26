'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Calendar, Clock, User, MapPin, Video, CheckCircle, XCircle, AlertCircle, Home, MessageCircle } from 'lucide-react';
import { Appointment } from '@/lib/types';

export default function MyAppointmentsPage() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      const userData = JSON.parse(storedUser);
      setUser(userData);

      // Simular agendamentos do paciente baseado no email
      const mockAppointments: Appointment[] = [
        {
          id: '1',
          psychologistId: '1',
          psychologistName: 'Dra. Ana Paula Silva',
          psychologistPhoto: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&h=400&fit=crop',
          date: '2024-12-25',
          time: '14:00',
          modality: 'online',
          patientName: userData.name,
          patientEmail: userData.email,
          patientPhone: userData.phone,
          status: 'confirmed',
          createdAt: '2024-12-15T10:30:00Z',
          notes: 'Primeira consulta'
        },
        {
          id: '2',
          psychologistId: '2',
          psychologistName: 'Dr. Carlos Mendes',
          psychologistPhoto: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop',
          date: '2024-12-30',
          time: '10:00',
          modality: 'presencial',
          patientName: userData.name,
          patientEmail: userData.email,
          patientPhone: userData.phone,
          status: 'pending',
          createdAt: '2024-12-20T15:20:00Z'
        }
      ];

      setAppointments(mockAppointments);
    }
  }, []);

  const getStatusColor = (status: Appointment['status']) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      case 'confirmed': return 'bg-green-100 text-green-800 border-green-300';
      case 'rejected': return 'bg-red-100 text-red-800 border-red-300';
      case 'completed': return 'bg-blue-100 text-blue-800 border-blue-300';
      case 'cancelled': return 'bg-gray-100 text-gray-800 border-gray-300';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: Appointment['status']) => {
    switch (status) {
      case 'pending': return <AlertCircle className="w-4 h-4" />;
      case 'confirmed': return <CheckCircle className="w-4 h-4" />;
      case 'rejected': return <XCircle className="w-4 h-4" />;
      case 'completed': return <CheckCircle className="w-4 h-4" />;
      case 'cancelled': return <XCircle className="w-4 h-4" />;
      default: return null;
    }
  };

  const getStatusText = (status: Appointment['status']) => {
    switch (status) {
      case 'pending': return 'Pendente';
      case 'confirmed': return 'Confirmado';
      case 'rejected': return 'Recusado';
      case 'completed': return 'Concluído';
      case 'cancelled': return 'Cancelado';
      default: return status;
    }
  };

  // Função para formatar data de forma consistente
  const formatDate = (dateString: string) => {
    const [year, month, day] = dateString.split('-');
    const date = new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
    
    return date.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
      timeZone: 'America/Sao_Paulo'
    });
  };

  const handleCancelAppointment = (appointmentId: string) => {
    if (confirm('Tem certeza que deseja cancelar este agendamento?')) {
      setAppointments(prev => 
        prev.map(apt => 
          apt.id === appointmentId 
            ? { ...apt, status: 'cancelled' as const }
            : apt
        )
      );
      alert('Agendamento cancelado com sucesso.');
    }
  };

  const handleJoinCall = (appointment: Appointment) => {
    if (appointment.modality === 'online') {
      // Simular link de chamada
      alert('Redirecionando para a chamada online...');
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 flex items-center justify-center">
        <Card className="p-8 text-center">
          <h2 className="text-xl font-semibold mb-4">Acesso Restrito</h2>
          <p className="text-gray-600 mb-4">Você precisa estar logado para ver seus agendamentos.</p>
          <Button onClick={() => window.location.href = '/'}>
            Voltar ao Início
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 p-4 py-12">
      <div className="container mx-auto max-w-6xl">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-800 mb-2">
              Meus Agendamentos
            </h1>
            <p className="text-gray-600">
              Gerencie suas consultas agendadas
            </p>
          </div>
          <Button
            onClick={() => window.location.href = '/'}
            variant="outline"
          >
            <Home className="mr-2 w-4 h-4" />
            Voltar ao Início
          </Button>
        </div>

        {/* Filtros */}
        <div className="flex gap-3 mb-6 overflow-x-auto pb-2">
          <Button variant="outline" size="sm" className="whitespace-nowrap">
            Todos ({appointments.length})
          </Button>
          <Button variant="outline" size="sm" className="whitespace-nowrap">
            Pendentes ({appointments.filter(a => a.status === 'pending').length})
          </Button>
          <Button variant="outline" size="sm" className="whitespace-nowrap">
            Confirmados ({appointments.filter(a => a.status === 'confirmed').length})
          </Button>
          <Button variant="outline" size="sm" className="whitespace-nowrap">
            Concluídos ({appointments.filter(a => a.status === 'completed').length})
          </Button>
        </div>

        {/* Lista de Agendamentos */}
        <div className="grid grid-cols-1 gap-4">
          {appointments.map((appointment) => (
            <Card 
              key={appointment.id} 
              className={`p-6 bg-white/90 backdrop-blur-sm hover:shadow-lg transition-all ${
                appointment.status === 'pending' ? 'border-l-4 border-yellow-500' : ''
              }`}
            >
              <div className="flex flex-col lg:flex-row gap-6">
                {/* Informações do Psicólogo */}
                <div className="flex-1">
                  <div className="flex items-start gap-4 mb-4">
                    <img
                      src={appointment.psychologistPhoto}
                      alt={appointment.psychologistName}
                      className="w-12 h-12 rounded-full object-cover"
                    />
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-800">
                        {appointment.psychologistName}
                      </h3>
                      <p className="text-sm text-gray-600">Psicólogo(a)</p>
                    </div>
                    <div className={`px-3 py-1 rounded-full text-xs font-medium border flex items-center gap-1 ${getStatusColor(appointment.status)}`}>
                      {getStatusIcon(appointment.status)}
                      {getStatusText(appointment.status)}
                    </div>
                  </div>

                  {/* Detalhes do Agendamento */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
                    <div className="flex items-center gap-2 text-gray-700">
                      <Calendar className="w-4 h-4 text-purple-600" />
                      <span className="text-sm" suppressHydrationWarning>
                        {formatDate(appointment.date)}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-700">
                      <Clock className="w-4 h-4 text-purple-600" />
                      <span className="text-sm">{appointment.time}</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-700">
                      {appointment.modality === 'online' ? (
                        <>
                          <Video className="w-4 h-4 text-purple-600" />
                          <span className="text-sm">Online</span>
                        </>
                      ) : (
                        <>
                          <MapPin className="w-4 h-4 text-purple-600" />
                          <span className="text-sm">Presencial</span>
                        </>
                      )}
                    </div>
                  </div>

                  {appointment.notes && (
                    <div className="bg-gray-50 rounded-lg p-3 mb-4">
                      <p className="text-sm text-gray-700">
                        <span className="font-medium">Observações:</span> {appointment.notes}
                      </p>
                    </div>
                  )}
                </div>

                {/* Ações */}
                <div className="flex flex-col gap-2 lg:w-48">
                  {appointment.status === 'confirmed' && (
                    <>
                      <Button
                        onClick={() => handleJoinCall(appointment)}
                        className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white"
                      >
                        {appointment.modality === 'online' ? 'Entrar na Chamada' : 'Ver Localização'}
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                      >
                        <MessageCircle className="mr-2 w-4 h-4" />
                        Mensagem
                      </Button>
                    </>
                  )}

                  {appointment.status === 'pending' && (
                    <div className="text-center text-sm text-gray-600 p-4 bg-yellow-50 rounded-lg">
                      Aguardando confirmação do psicólogo
                    </div>
                  )}

                  {(appointment.status === 'confirmed' || appointment.status === 'pending') && (
                    <Button
                      onClick={() => handleCancelAppointment(appointment.id)}
                      variant="outline"
                      size="sm"
                      className="border-red-300 text-red-600 hover:bg-red-50"
                    >
                      Cancelar Agendamento
                    </Button>
                  )}

                  {appointment.status === 'completed' && (
                    <div className="text-center text-sm text-gray-600 p-4 bg-blue-50 rounded-lg">
                      Consulta realizada
                    </div>
                  )}
                </div>
              </div>
            </Card>
          ))}
        </div>

        {appointments.length === 0 && (
          <Card className="p-12 text-center bg-white/90 backdrop-blur-sm">
            <Calendar className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-800 mb-2">
              Nenhum agendamento ainda
            </h3>
            <p className="text-gray-600 mb-4">
              Você ainda não tem consultas agendadas.
            </p>
            <Button onClick={() => window.location.href = '/'}>
              Encontrar um Psicólogo
            </Button>
          </Card>
        )}
      </div>
    </div>
  );
}