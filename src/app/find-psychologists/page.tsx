'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Search, Filter, Star, MapPin, Video, Building, Home, ArrowLeft } from 'lucide-react';
import { mockPsychologists, therapyApproaches, brazilianStates } from '@/lib/data';
import { TherapyApproach, Psychologist } from '@/lib/types';
import { useRouter } from 'next/navigation';

export default function FindPsychologistsPage() {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedApproach, setSelectedApproach] = useState<TherapyApproach | 'all'>('all');
  const [selectedState, setSelectedState] = useState<string>('all');
  const [selectedCity, setSelectedCity] = useState<string>('all');
  const [selectedModalities, setSelectedModalities] = useState<('online' | 'presencial')[]>([]);
  const [filteredPsychologists, setFilteredPsychologists] = useState<Psychologist[]>(mockPsychologists);

  // Filtrar cidades baseado no estado selecionado
  const availableCities = selectedState === 'all' 
    ? [...new Set(mockPsychologists.map(p => p.city))]
    : mockPsychologists.filter(p => p.state === selectedState).map(p => p.city);

  // Aplicar filtros
  useEffect(() => {
    let filtered = mockPsychologists.filter(psy => psy.subscriptionStatus === 'active');

    // Filtro por termo de busca
    if (searchTerm) {
      filtered = filtered.filter(psy => 
        psy.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        psy.bio.toLowerCase().includes(searchTerm.toLowerCase()) ||
        psy.specialties.some(spec => spec.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    // Filtro por abordagem
    if (selectedApproach !== 'all') {
      filtered = filtered.filter(psy => psy.approaches.includes(selectedApproach));
    }

    // Filtro por estado
    if (selectedState !== 'all') {
      filtered = filtered.filter(psy => psy.state === selectedState);
    }

    // Filtro por cidade
    if (selectedCity !== 'all') {
      filtered = filtered.filter(psy => psy.city === selectedCity);
    }

    // Filtro por modalidade
    if (selectedModalities.length > 0) {
      filtered = filtered.filter(psy => 
        selectedModalities.some(mod => psy.modality.includes(mod))
      );
    }

    setFilteredPsychologists(filtered);
  }, [searchTerm, selectedApproach, selectedState, selectedCity, selectedModalities]);

  const handleModalityChange = (modality: 'online' | 'presencial', checked: boolean) => {
    if (checked) {
      setSelectedModalities(prev => [...prev, modality]);
    } else {
      setSelectedModalities(prev => prev.filter(m => m !== modality));
    }
  };

  const viewProfile = (psychologist: Psychologist) => {
    // Por enquanto, vamos usar a mesma lógica do quiz result
    // Em uma implementação real, isso levaria para uma página de perfil
    router.push(`/?psychologist=${psychologist.id}#profile`);
  };

  const clearFilters = () => {
    setSearchTerm('');
    setSelectedApproach('all');
    setSelectedState('all');
    setSelectedCity('all');
    setSelectedModalities([]);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 p-4 py-12">
      <div className="container mx-auto max-w-7xl">
        {/* Header */}
        <div className="mb-8">
          <Button
            onClick={() => router.push('/')}
            variant="ghost"
            className="mb-4"
          >
            <ArrowLeft className="mr-2 w-4 h-4" />
            Voltar ao início
          </Button>
          
          <h1 className="text-3xl sm:text-4xl font-bold mb-2 text-gray-800">
            Encontre seu Psicólogo
          </h1>
          <p className="text-gray-600 text-lg">
            Use os filtros abaixo para encontrar o profissional ideal para você
          </p>
        </div>

        {/* Filtros */}
        <Card className="p-6 mb-8 bg-white/90 backdrop-blur-sm">
          <div className="flex items-center gap-2 mb-6">
            <Filter className="w-5 h-5 text-purple-600" />
            <h2 className="text-xl font-semibold text-gray-800">Filtros de Busca</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            {/* Busca por nome ou especialidade */}
            <div className="relative">
              <Search className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
              <Input
                placeholder="Buscar por nome ou especialidade..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>

            {/* Abordagem Terapêutica */}
            <Select value={selectedApproach} onValueChange={(value) => setSelectedApproach(value as TherapyApproach | 'all')}>
              <SelectTrigger>
                <SelectValue placeholder="Abordagem terapêutica" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas as abordagens</SelectItem>
                {Object.values(therapyApproaches).map((approach) => (
                  <SelectItem key={approach.id} value={approach.id}>
                    {approach.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Estado */}
            <Select value={selectedState} onValueChange={(value) => {
              setSelectedState(value);
              setSelectedCity('all'); // Reset city when state changes
            }}>
              <SelectTrigger>
                <SelectValue placeholder="Estado" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos os estados</SelectItem>
                {brazilianStates.map((state) => (
                  <SelectItem key={state.code} value={state.code}>
                    {state.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Cidade */}
            <Select value={selectedCity} onValueChange={setSelectedCity} disabled={selectedState === 'all'}>
              <SelectTrigger>
                <SelectValue placeholder="Cidade" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas as cidades</SelectItem>
                {availableCities.map((city) => (
                  <SelectItem key={city} value={city}>
                    {city}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Modalidades */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Modalidade de Atendimento
            </label>
            <div className="flex gap-6">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="online"
                  checked={selectedModalities.includes('online')}
                  onCheckedChange={(checked) => handleModalityChange('online', checked as boolean)}
                />
                <label htmlFor="online" className="text-sm font-medium text-gray-700 flex items-center gap-2">
                  <Video className="w-4 h-4 text-purple-600" />
                  Online
                </label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="presencial"
                  checked={selectedModalities.includes('presencial')}
                  onCheckedChange={(checked) => handleModalityChange('presencial', checked as boolean)}
                />
                <label htmlFor="presencial" className="text-sm font-medium text-gray-700 flex items-center gap-2">
                  <Building className="w-4 h-4 text-purple-600" />
                  Presencial
                </label>
              </div>
            </div>
          </div>

          {/* Botão Limpar Filtros */}
          <div className="flex justify-between items-center">
            <Button
              onClick={clearFilters}
              variant="outline"
              size="sm"
            >
              Limpar Filtros
            </Button>
            <p className="text-sm text-gray-600">
              {filteredPsychologists.length} psicólogo{filteredPsychologists.length !== 1 ? 's' : ''} encontrado{filteredPsychologists.length !== 1 ? 's' : ''}
            </p>
          </div>
        </Card>

        {/* Resultados */}
        {filteredPsychologists.length === 0 ? (
          <Card className="p-12 text-center bg-white/90 backdrop-blur-sm">
            <Search className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-800 mb-2">
              Nenhum psicólogo encontrado
            </h3>
            <p className="text-gray-600 mb-4">
              Tente ajustar os filtros para encontrar mais opções.
            </p>
            <Button onClick={clearFilters} variant="outline">
              Limpar filtros
            </Button>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredPsychologists.map((psy) => (
              <Card key={psy.id} className="p-6 bg-white/90 backdrop-blur-sm hover:shadow-xl transition-all duration-300">
                <div className="flex gap-4 mb-4">
                  <img
                    src={psy.photo}
                    alt={psy.name}
                    className="w-16 h-16 rounded-full object-cover"
                  />
                  <div className="flex-1">
                    <h3 className="text-lg font-bold text-gray-800 mb-1">{psy.name}</h3>
                    <p className="text-sm text-gray-600 mb-2">{psy.crp}</p>
                    <div className="flex items-center gap-1 mb-2">
                      <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                      <span className="text-sm font-medium">{psy.rating}</span>
                      <span className="text-sm text-gray-500">({psy.reviewCount})</span>
                    </div>
                  </div>
                </div>

                {/* Abordagens */}
                <div className="mb-3">
                  <div className="flex flex-wrap gap-1">
                    {psy.approaches.map((approach) => (
                      <span
                        key={approach}
                        className={`px-2 py-1 rounded-full text-xs font-medium text-white bg-gradient-to-r ${therapyApproaches[approach].color}`}
                      >
                        {therapyApproaches[approach].name}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Especialidades */}
                <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                  {psy.specialties.join(', ')}
                </p>

                {/* Localização e Modalidade */}
                <div className="space-y-2 mb-4">
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <MapPin className="w-4 h-4 text-purple-600" />
                    <span>{psy.city}/{psy.state}</span>
                  </div>
                  <div className="flex gap-2">
                    {psy.modality.map((mod) => (
                      <span key={mod} className="text-xs px-2 py-1 bg-blue-100 text-blue-700 rounded flex items-center gap-1">
                        {mod === 'online' ? <Video className="w-3 h-3" /> : <Building className="w-3 h-3" />}
                        {mod === 'online' ? 'Online' : 'Presencial'}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Preço */}
                <div className="flex items-center justify-between mb-4">
                  <span className="text-sm font-medium text-gray-700">{psy.priceRange}</span>
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
        )}
      </div>
    </div>
  );
}