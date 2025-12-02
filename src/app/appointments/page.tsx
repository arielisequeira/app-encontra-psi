'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Calendar, Clock, User, MapPin, Video, CheckCircle, XCircle, AlertCircle, Home, Bell } from 'lucide-react';
import { Appointment } from '@/lib/types';

export default function AppointmentsPage() {
  const [appointments, setAppointments] = useState<Appointment[]>([
    {
      id: '1',
      psychologistId: '1',
      psychologistName: 'Dra. Ana Paula Silva',
      psychologistPhoto: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&h=400&fit=crop',
      date: '2024-12-20',
      time: '14:00',
      modality: 'online',
      patientName: 'João Silva',
      patientEmail: 'joao@email.com',
      patientPhone: '(11) 98765-4321',
      status: 'pending',
      createdAt: '2024-12-15T10:30:00Z',
      notes: 'Primeira consulta'
    },
    {
      id: '2',
      psychologistId: '1',
      psychologistName: 'Dra. Ana Paula Silva',
      psychologistPhoto: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&h=400&fit=crop',
      date: '2024-12-18',
      time: '10:00',
      modality: 'presencial',
      patientName: 'Maria Santos',
      patientEmail: 'maria@email.com',
      patientPhone: '(11) 91234-5678',
      status: 'confirmed',
      createdAt: '2024-12-10T15:20:00Z'
    }
  ]);

  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);
  const [showNotifications, setShowNotifications] = useState(false);

  const handleAccept = (appointmentId: string) => {
    setAppointments(prev => 
      prev.map(apt => 
        apt.id === appointmentId 
          ? { ...apt, status: 'confirmed' as const }
          : apt
      )
    );
    
    // Simular envio de notificação ao paciente
    alert('Agendamento confirmado! O paciente receberá uma notificação por e-mail e SMS.');
    setSelectedAppointment(null);
  };

  const handleReject = (appointmentId: string) => {
    const reason = prompt('Motivo da recusa (opcional):');
    
    setAppointments(prev => 
      prev.map(apt => 
        apt.id === appointmentId 
          ? { ...apt, status: 'rejected' as const, notes: reason || apt.notes }
          : apt
      )
    );
    
    alert('Agendamento recusado. O paciente receberá uma notificação.');
    setSelectedAppointment(null);
  };

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

  const pendingCount = appointments.filter(apt => apt.status === 'pending').length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 p-4 py-12">
      <div className="container mx-auto max-w-6xl">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-800 mb-2">
              Gerenciar Agendamentos
            </h1>
            <p className="text-gray-600">
              Visualize e gerencie suas consultas agendadas
            </p>
          </div>
          <div className="flex gap-3">
            <Button
              onClick={() => setShowNotifications(!showNotifications)}
              variant="outline"
              className="relative"
            >
              <Bell className="w-5 h-5" />
              {pendingCount > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                  {pendingCount}
                </span>
              )}
            </Button>
            <Button
              onClick={() => window.location.href = '/'}
              variant="outline"
            >
              <Home className="mr-2 w-4 h-4" />
              Voltar ao Início
            </Button>
          </div>
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
                {/* Informações do Paciente */}
                <div className="flex-1">
                  <div className="flex items-start gap-4 mb-4">
                    <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                      <User className="w-6 h-6 text-purple-600" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-800">
                        {appointment.patientName}
                      </h3>
                      <p className="text-sm text-gray-600">{appointment.patientEmail}</p>
                      <p className="text-sm text-gray-600">{appointment.patientPhone}</p>
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
                      <span className="text-sm">
                        {new Date(appointment.date).toLocaleDateString('pt-BR', {
                          day: '2-digit',
                          month: 'long',
                          year: 'numeric'
                        })}
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
                {appointment.status === 'pending' && (
                  <div className="flex flex-col gap-2 lg:w-48">
                    <Button
                      onClick={() => handleAccept(appointment.id)}
                      className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white"
                    >
                      <CheckCircle className="mr-2 w-4 h-4" />
                      Aceitar
                    </Button>
                    <Button
                      onClick={() => handleReject(appointment.id)}
                      variant="outline"
                      className="border-red-300 text-red-600 hover:bg-red-50"
                    >
                      <XCircle className="mr-2 w-4 h-4" />
                      Recusar
                    </Button>
                    <Button
                      onClick={() => setSelectedAppointment(appointment)}
                      variant="ghost"
                      size="sm"
                    >
                      Ver Detalhes
                    </Button>
                  </div>
                )}

                {appointment.status === 'confirmed' && (
                  <div className="flex flex-col gap-2 lg:w-48">
                    <Button
                      className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white"
                    >
                      Iniciar Consulta
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                    >
                      Reagendar
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-red-600 hover:text-red-700"
                    >
                      Cancelar
                    </Button>
                  </div>
                )}
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
            <p className="text-gray-600">
              Quando pacientes solicitarem consultas, elas aparecerão aqui.
            </p>
          </Card>
        )}

        {/* Modal de Detalhes */}
        {selectedAppointment && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            <Card className="max-w-2xl w-full p-6 bg-white">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">
                Detalhes do Agendamento
              </h2>
              
              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold text-gray-800 mb-2">Paciente</h3>
                  <p className="text-gray-700">{selectedAppointment.patientName}</p>
                  <p className="text-sm text-gray-600">{selectedAppointment.patientEmail}</p>
                  <p className="text-sm text-gray-600">{selectedAppointment.patientPhone}</p>
                </div>

                <div>
                  <h3 className="font-semibold text-gray-800 mb-2">Data e Horário</h3>
                  <p className="text-gray-700">
                    {new Date(selectedAppointment.date).toLocaleDateString('pt-BR')} às {selectedAppointment.time}
                  </p>
                </div>

                <div>
                  <h3 className="font-semibold text-gray-800 mb-2">Modalidade</h3>
                  <p className="text-gray-700">
                    {selectedAppointment.modality === 'online' ? 'Online' : 'Presencial'}
                  </p>
                </div>

                {selectedAppointment.notes && (
                  <div>
                    <h3 className="font-semibold text-gray-800 mb-2">Observações</h3>
                    <p className="text-gray-700">{selectedAppointment.notes}</p>
                  </div>
                )}
              </div>

              <div className="flex gap-3 mt-6">
                <Button
                  onClick={() => setSelectedAppointment(null)}
                  variant="outline"
                  className="flex-1"
                >
                  Fechar
                </Button>
              </div>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}
