'use client';

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ArrowLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function AboutPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 p-4 py-12">
      <div className="container mx-auto max-w-4xl">
        <Button
          onClick={() => router.push('/')}
          variant="ghost"
          className="mb-6"
        >
          <ArrowLeft className="mr-2 w-4 h-4" />
          Voltar para início
        </Button>

        <Card className="p-8 bg-white/90 backdrop-blur-sm shadow-xl">
          <h1 className="text-3xl font-bold text-gray-800 mb-6">
            Psicólogos Qualificados
          </h1>

          <div className="prose prose-lg max-w-none text-gray-700 space-y-4">
            <p>
              No EncontraPsi, você encontra psicólogos altamente qualificados, prontos para oferecer o suporte necessário para suas necessidades emocionais e psicológicas. Todos os profissionais cadastrados em nossa plataforma possuem registro ativo no Conselho Regional de Psicologia (CRP) e são especializados em diversas abordagens terapêuticas, garantindo que você encontre o terapeuta ideal para o seu perfil.
            </p>

            <p>
              Nossos psicólogos passam por um rigoroso processo de validação de documentos, incluindo diplomas e certificados, para assegurar que você está em boas mãos. Além disso, eles são constantemente avaliados por pacientes, o que nos permite destacar aqueles que oferecem um atendimento excepcional.
            </p>

            <p>
              Seja qual for a sua necessidade, nossos psicólogos estão preparados para ajudar você a encontrar o equilíbrio e o bem-estar que procura. Explore as opções disponíveis e agende sua consulta com confiança.
            </p>

            <h2 className="text-2xl font-bold text-gray-800 mt-8 mb-4">
              Processo de Validação
            </h2>

            <p>
              Cada psicólogo cadastrado passa por um processo rigoroso de validação que inclui:
            </p>

            <ul className="list-disc pl-6 space-y-2">
              <li>Verificação do registro ativo no CRP (Conselho Regional de Psicologia)</li>
              <li>Análise de diplomas e certificados de formação</li>
              <li>Validação de especializações e cursos complementares</li>
              <li>Avaliação contínua baseada em feedback de pacientes</li>
              <li>Monitoramento de qualidade do atendimento</li>
            </ul>

            <h2 className="text-2xl font-bold text-gray-800 mt-8 mb-4">
              Abordagens Disponíveis
            </h2>

            <p>
              Nossa plataforma conta com profissionais especializados em diversas abordagens terapêuticas, incluindo:
            </p>

            <ul className="list-disc pl-6 space-y-2">
              <li><strong>Psicanálise:</strong> Exploração profunda do inconsciente</li>
              <li><strong>Terapia Cognitivo-Comportamental (TCC):</strong> Foco em pensamentos e comportamentos</li>
              <li><strong>Terapia Sistêmica:</strong> Análise de relações e contextos</li>
              <li><strong>Gestalt-Terapia:</strong> Consciência do momento presente</li>
              <li><strong>Abordagem Humanista:</strong> Crescimento pessoal e autorrealização</li>
              <li><strong>Terapia de Grupo:</strong> Apoio coletivo e compartilhamento</li>
            </ul>

            <h2 className="text-2xl font-bold text-gray-800 mt-8 mb-4">
              Compromisso com a Qualidade
            </h2>

            <p>
              Nosso compromisso é conectar você com profissionais que não apenas possuem as qualificações técnicas necessárias, mas que também demonstram empatia, ética e dedicação ao bem-estar de seus pacientes. Acreditamos que a terapia é uma jornada transformadora, e estamos aqui para facilitar esse processo com segurança e confiança.
            </p>
          </div>

          <div className="mt-8 pt-6 border-t border-gray-200">
            <Button
              onClick={() => router.push('/')}
              size="lg"
              className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white"
            >
              Começar Agora
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
}
