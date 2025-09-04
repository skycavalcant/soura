import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const QuestionForm = ({ 
  question, 
  answer, 
  onAnswerChange, 
  onNext, 
  onPrev, 
  canGoNext, 
  canGoPrev, 
  isLastStep,
  onSubmit 
}) => {
  const inputStyle = {
    width: '100%',
    padding: '16px 0',
    border: 'none',
    borderBottom: '1px solid rgba(120, 113, 108, 0.3)',
    outline: 'none',
    background: 'transparent',
    color: '#1c1917',
    fontSize: '18px',
    fontWeight: '300',
    transition: 'border-color 0.3s ease'
  };

  const handleFocus = (e) => {
    e.target.style.borderBottomColor = 'rgba(146, 64, 14, 0.7)';
  };

  const handleBlur = (e) => {
    e.target.style.borderBottomColor = 'rgba(120, 113, 108, 0.3)';
  };

  const renderInput = () => {
    switch (question.type) {
      case 'text':
        return (
          <textarea
            style={{
              ...inputStyle,
              height: '120px',
              resize: 'none',
              lineHeight: '1.6'
            }}
            placeholder="Escreva a resposta do fundo do seu coração..."
            value={answer || ''}
            onChange={(e) => onAnswerChange(e.target.value)}
            onFocus={handleFocus}
            onBlur={handleBlur}
          />
        );
      
      case 'multiple':
        return (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {question.options.map((option, index) => (
              <label key={index} style={{ 
                display: 'flex', 
                alignItems: 'center', 
                cursor: 'pointer',
                padding: '8px 0'
              }}>
                <input
                  type="radio"
                  value={option}
                  checked={answer === option}
                  onChange={(e) => onAnswerChange(e.target.value)}
                  style={{ display: 'none' }}
                />
                <div style={{
                  width: '18px',
                  height: '18px',
                  borderRadius: '50%',
                  border: answer === option ? '2px solid #92400e' : '2px solid #9ca3af',
                  backgroundColor: answer === option ? '#92400e' : 'transparent',
                  marginRight: '12px',
                  transition: 'all 0.2s ease',
                  position: 'relative'
                }}>
                  {answer === option && (
                    <div style={{
                      width: '6px',
                      height: '6px',
                      backgroundColor: 'white',
                      borderRadius: '50%',
                      position: 'absolute',
                      top: '50%',
                      left: '50%',
                      transform: 'translate(-50%, -50%)'
                    }}/>
                  )}
                </div>
                <span style={{ 
                  color: '#374151', 
                  fontSize: '16px', 
                  fontWeight: '300'
                }}>
                  {option}
                </span>
              </label>
            ))}
          </div>
        );
      
      case 'date':
        return (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            <input
              type="date"
              style={inputStyle}
              value={answer || ''}
              onChange={(e) => onAnswerChange(e.target.value)}
              onFocus={handleFocus}
              onBlur={handleBlur}
              min={new Date().toISOString().split('T')[0]}
            />
            <p style={{ 
              fontSize: '14px', 
              color: '#57534e', 
              fontWeight: '300', 
              lineHeight: '1.5' 
            }}>
              Escolha uma data significativa para receber suas reflexões
            </p>
          </div>
        );
      
      default:
        return null;
    }
  };

  return (
    <div style={{
      backgroundColor: 'rgba(255, 255, 255, 0.95)',
      backdropFilter: 'blur(20px)',
      padding: '40px',
      boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
      border: '1px solid rgba(255, 255, 255, 0.7)',
      borderRadius: '8px'
    }}>
      {/* Header da pergunta */}
      <div style={{ marginBottom: '32px' }}>
        <div style={{ display: 'flex', alignItems: 'center', marginBottom: '20px' }}>
          <question.icon size={20} style={{ color: '#92400e', marginRight: '12px' }} />
          <span style={{
            fontSize: '11px',
            color: '#92400e',
            textTransform: 'uppercase',
            letterSpacing: '0.15em',
            fontWeight: '600'
          }}>
            {question.title}
          </span>
        </div>
        <h2 style={{ 
          fontSize: '24px', 
          fontWeight: '200', 
          color: '#1c1917', 
          lineHeight: '1.5', 
          letterSpacing: '0.02em',
          margin: 0
        }}>
          {question.question}
        </h2>
      </div>

      {/* Input */}
      <div style={{ marginBottom: '32px' }}>
        {renderInput()}
      </div>

      {/* Navegação */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <button
          onClick={onPrev}
          disabled={!canGoPrev}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            fontSize: '13px',
            fontWeight: '300',
            color: canGoPrev ? '#57534e' : '#d6d3d1',
            background: 'transparent',
            border: 'none',
            cursor: canGoPrev ? 'pointer' : 'not-allowed',
            transition: 'all 0.2s ease',
            padding: '8px 0'
          }}
        >
          <ChevronLeft size={16} />
          <span style={{ letterSpacing: '0.05em' }}>ANTERIOR</span>
        </button>

        <button
          onClick={isLastStep ? onSubmit : onNext}
          disabled={!canGoNext}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: isLastStep ? '12px 24px' : '8px 0',
            fontSize: '13px',
            fontWeight: '300',
            letterSpacing: '0.05em',
            backgroundColor: isLastStep && canGoNext ? '#92400e' : 'transparent',
            color: canGoNext ? (isLastStep ? 'white' : '#57534e') : '#d6d3d1',
            border: 'none',
            cursor: canGoNext ? 'pointer' : 'not-allowed',
            transition: 'all 0.2s ease',
            borderRadius: isLastStep ? '4px' : '0',
            boxShadow: isLastStep && canGoNext ? '0 4px 6px -1px rgba(0, 0, 0, 0.1)' : 'none'
          }}
        >
          <span>{isLastStep ? 'ENVIAR' : 'PRÓXIMO'}</span>
          {!isLastStep && <ChevronRight size={16} />}
        </button>
      </div>
    </div>
  );
};

export default QuestionForm;