import React from 'react';
import { Clock, Mail } from 'lucide-react';
import PixelCapsule from './PixelCapsule';

const AnimationSequence = ({ 
  phase, 
  backgroundShift, 
  animatedAnswers, 
  showAnswerAnimation 
}) => {
  
  const getStatusText = () => {
    switch (phase) {
      case 'showing-answers':
        return {
          title: 'Organizando suas respostas',
          subtitle: 'Suas respostas estão sendo organizadas'
        };
      case 'opening-capsule':
        return {
          title: 'Abrindo a Soura',
          subtitle: 'A cápsula está se preparando para receber suas memórias'
        };
      case 'collecting-answers':
        return {
          title: 'Guardando suas memórias',
          subtitle: 'Todas as suas palavras estão sendo cuidadosamente preservadas'
        };
      case 'closing-capsule':
        return {
          title: 'Selando a Soura',
          subtitle: 'Protegendo suas reflexões para a jornada temporal'
        };
      case 'flying':
        return {
          title: 'Enviando para o futuro',
          subtitle: 'Sua Soura está viajando através do tempo'
        };
      default:
        return { title: '', subtitle: '' };
    }
  };

  const status = getStatusText();

  return (
    <div style={{ 
      minHeight: '100vh', 
      display: 'flex',
      position: 'relative',
      overflow: 'hidden'
    }}>
      
      {/* Presente com transição */}
      <div style={{
        width: backgroundShift ? '30%' : '70%',
        position: 'relative',
        overflow: 'hidden',
        background: 'linear-gradient(135deg, #BFB584 0%, #0B3140 100%)',
        transition: 'width 3s cubic-bezier(0.4, 0, 0.2, 1)'
      }}>
        <div style={{
          position: 'absolute',
          top: '60px',
          left: '24px'
        }}>
          <div style={{ color: '#e7e5e4', marginBottom: '8px' }}>
            <Clock size={24} />
          </div>
          <h3 style={{ 
            fontSize: '18px', 
            fontWeight: '200', 
            color: '#e7e5e4', 
            letterSpacing: '0.1em',
            margin: 0
          }}>
            Presente
          </h3>
        </div>
      </div>
      
      {/* Futuro com transição */}
      <div style={{
        width: backgroundShift ? '70%' : '30%',
        position: 'relative',
        overflow: 'hidden',
        background: 'linear-gradient(135deg, #0B3140 0%, #40131B 100%)',
        transition: 'width 3s cubic-bezier(0.4, 0, 0.2, 1)'
      }}>
        <div style={{
          position: 'absolute',
          top: '60px',
          right: '24px',
          textAlign: 'right',
          opacity: backgroundShift ? 1 : 0.6,
          transition: 'opacity 1s ease'
        }}>
          <div style={{ color: '#fbbf24', marginBottom: '8px', marginLeft: 'auto', width: '24px' }}>
            <Mail size={24} />
          </div>
          <h3 style={{ 
            fontSize: '18px', 
            fontWeight: '200', 
            color: '#fde68a', 
            letterSpacing: '0.1em',
            margin: 0
          }}>
            Futuro
          </h3>
        </div>
      </div>

      {/* Blocos de respostas com posicionamento orgânico */}
      <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}>
        {showAnswerAnimation && animatedAnswers.map((answer, index) => {
          const positions = [
            { top: '15%', left: '12%' },
            { top: '25%', left: '28%' },
            { top: '35%', left: '8%' },
            { top: '20%', right: '15%' },
            { top: '30%', right: '8%' },
            { top: '40%', right: '25%' },
            { top: '50%', left: '15%' },
            { top: '55%', right: '20%' }
          ];
          
          const position = positions[index] || positions[0];
          
          return (
            <div
              key={answer.id}
              className="answer-block"
              style={{
                position: 'absolute',
                backgroundColor: 'rgba(255, 255, 255, 0.92)',
                border: '2px solid #fbbf24',
                borderRadius: '16px',
                padding: '18px',
                minWidth: '200px',
                maxWidth: '280px',
                boxShadow: '0 12px 40px rgba(0, 0, 0, 0.35)',
                backdropFilter: 'blur(12px)',
                opacity: phase === 'showing-answers' || phase === 'opening-capsule' ? 1 : 0,
                transform: phase === 'collecting-answers' 
                  ? 'translate(-50%, -50%) scale(0.2) rotate(5deg)' 
                  : 'translate(0, 0) scale(1) rotate(0deg)',
                transition: 'all 1.8s cubic-bezier(0.4, 0, 0.2, 1)',
                zIndex: 10,
                ...position,
                ...(phase === 'collecting-answers' && {
                  top: '50%',
                  left: '50%',
                  right: 'auto'
                })
              }}
            >
              <div style={{
                fontSize: '11px',
                fontWeight: '700',
                color: '#92400e',
                marginBottom: '10px',
                textTransform: 'uppercase',
                letterSpacing: '0.08em'
              }}>
                {answer.question}
              </div>
              <div style={{
                fontSize: '15px',
                color: '#1c1917',
                fontWeight: '400',
                lineHeight: '1.5'
              }}>
                {typeof answer.text === 'string' 
                  ? answer.text.length > 65 
                    ? answer.text.substring(0, 65) + '...' 
                    : answer.text
                  : answer.text
                }
              </div>
            </div>
          );
        })}
      </div>

      {/* Cápsula central com animação*/}
      <div style={{ 
        position: 'absolute', 
        inset: 0, 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        pointerEvents: 'none'
      }}>
        <div style={{
          transform: phase === 'flying' 
            ? 'translateX(450px) translateY(-60px) scale(0.7) rotate(12deg)' 
            : 'translateX(0) translateY(0) scale(1) rotate(0deg)',
          opacity: phase === 'flying' ? 0.2 : 1,
          transition: 'all 3.2s cubic-bezier(0.4, 0, 0.2, 1)',
          display: phase === 'showing-answers' ? 'none' : 'block'
        }}>
          <PixelCapsule 
            size={180} 
            isOpen={phase === 'opening-capsule' || phase === 'collecting-answers'}
            isAnimating={phase !== 'idle'}
          />
        </div>
      </div>

      {/* Partículas mágicas*/}
      {phase === 'flying' && (
        <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}>
          {[...Array(15)].map((_, i) => (
            <div
              key={i}
              className="sparkle-particle"
              style={{
                position: 'absolute',
                width: '5px',
                height: '5px',
                backgroundColor: i % 3 === 0 ? '#FFD700' : i % 3 === 1 ? '#FFA500' : '#FF8C00',
                borderRadius: '50%',
                top: `${42 + (Math.sin(i * 0.7) * 15)}%`,
                left: `${45 + i * 4}%`,
                opacity: '0.8',
                animationDelay: `${i * 120}ms`,
                boxShadow: '0 0 8px currentColor'
              }}
            />
          ))}
        </div>
      )}

      {/* Status text */}
      <div style={{
        position: 'absolute',
        bottom: '60px',
        left: 0,
        right: 0,
        textAlign: 'center',
        transition: 'all 0.5s ease'
      }}>
        <div style={{ color: '#e7e5e4' }}>
          <h2 style={{ 
            fontSize: '28px', 
            fontWeight: '200', 
            marginBottom: '8px', 
            letterSpacing: '0.03em',
            margin: '0 0 8px 0'
          }}>
            {status.title}
          </h2>
          <p style={{ 
            color: '#d6d3d1', 
            fontWeight: '300', 
            fontSize: '16px',
            margin: 0,
            opacity: 0.9
          }}>
            {status.subtitle}
          </p>
        </div>
      </div>
    </div>
  );
};

export default AnimationSequence;