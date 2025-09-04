import { useState, useCallback } from 'react';

export const useAnimationPhases = () => {
  const [phase, setPhase] = useState('idle');
  const [backgroundShift, setBackgroundShift] = useState(false);

  const startAnimationSequence = useCallback((allAnswers, onComplete) => {
    console.log('Iniciando sequência de animação');
    
    // Fase 1: Mostrar respostas (2s)
    setPhase('showing-answers');
    
    setTimeout(() => {
      // Fase 2: Abrir cápsula (1s)
      setPhase('opening-capsule');
      console.log('Abrindo cápsula');
      
      setTimeout(() => {
        // Fase 3: Coletar respostas (2s)
        setPhase('collecting-answers');
        console.log('Coletando respostas');
        
        setTimeout(() => {
          // Fase 4: Fechar cápsula (1s)
          setPhase('closing-capsule');
          console.log('Fechando cápsula');
          
          setTimeout(() => {
            // Fase 5: Voar para o futuro (4s)
            setPhase('flying');
            setBackgroundShift(true);
            console.log('Voando para o futuro');
            
            setTimeout(() => {
              console.log('Animação completa');
              onComplete();
            }, 3000);
          }, 1000);
        }, 2000);
      }, 1000);
    }, 2000);
  }, []);

  const resetAnimation = useCallback(() => {
    setPhase('idle');
    setBackgroundShift(false);
  }, []);

  return {
    phase,
    backgroundShift,
    startAnimationSequence,
    resetAnimation
  };
};