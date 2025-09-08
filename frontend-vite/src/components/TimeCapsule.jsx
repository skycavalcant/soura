import React, { useState, useRef, useEffect } from 'react';
import { ChevronRight, ChevronLeft, Clock, Mail, Heart, Target, Calendar, X, Search, Play, Pause, Volume2 } from 'lucide-react';
import PixelCapsule from './PixelCapsule.jsx';
import AnimationSequence from './AnimationSequence.jsx';
import { useAnimationPhases } from '../hooks/useAnimationPhases.js';
import { QUESTIONS } from '../utils/constants.js';
import { timeCapsuleAPI } from '../services/api.js';
import { Speaker } from "lucide-react";

// modal inicial
const WelcomeModal = ({ isOpen, onClose, onSelectVideo }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);

  const YOUTUBE_API_KEY = 'AIzaSyC75gzC74r1g07L-XqUoqLaiAD1i6GmTBw';

  const searchYouTubeMusic = async (query) => {
    if (!query.trim()) return;
    
    setIsSearching(true);
    
    try {
      // URL correta da API do YouTube v3
      const apiUrl = `https://www.googleapis.com/youtube/v3/search?part=snippet&maxResults=6&q=${encodeURIComponent(query)}&type=video&key=${YOUTUBE_API_KEY}`;
      
      console.log('Buscando:', query);
      console.log('URL da API:', apiUrl);
      
      const response = await fetch(apiUrl);
      
      console.log('Response status:', response.status);
      console.log('Response ok:', response.ok);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('Erro na resposta da API:', response.status, errorText);
        
        // Verificar se é problema de quota/API key
        if (response.status === 403) {
          throw new Error('API Key inválida ou quota esgotada');
        } else if (response.status === 400) {
          throw new Error('Parâmetros inválidos na requisição');
        } else {
          throw new Error(`Erro HTTP: ${response.status}`);
        }
      }
      
      const data = await response.json();
      console.log('Dados recebidos da API:', data);
      
      if (data.error) {
        console.error('Erro na resposta da API:', data.error);
        throw new Error(data.error.message || 'Erro na API do YouTube');
      }
      
      if (!data.items || data.items.length === 0) {
        throw new Error('Nenhum resultado encontrado para esta busca');
      }
      
      const results = data.items.map(item => ({
        id: item.id.videoId,
        title: item.snippet.title,
        artist: item.snippet.channelTitle,
        thumbnail: item.snippet.thumbnails.medium?.url || item.snippet.thumbnails.default.url
      }));
      
      console.log('Resultados processados:', results);
      setSearchResults(results);
      
    } catch (error) {
      console.error('Erro completo na busca:', error);
      
      // Mostrar erro específico para o usuário
      const errorResults = [
        {
          id: 'error',
          title: `Erro: ${error.message}`,
          artist: 'Verifique sua conexão ou tente novamente',
          thumbnail: 'https://via.placeholder.com/320x180/ff0000/ffffff?text=ERRO'
        }
      ];
      
      setSearchResults(errorResults);
    }
    
    setIsSearching(false);
  };

  const selectMusic = (music) => {
    onSelectVideo(music);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.4)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 10000,
      backdropFilter: 'blur(8px)'
    }}>
      <div style={{
        backgroundColor: '#FEFAF7',
        borderRadius: '10px',
        maxWidth: '600px',
        width: '90%',
        maxHeight: '85vh',
        overflow: 'hidden',
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.6)',
        border: 'none',
        position: 'relative'
      }}>
        
        <div style={{
          background: 'linear-gradient(135deg, #0a1b4bff 0%, #050e22ff 100%)',
          color: '#FEFAF7',
          padding: '32px',
          position: 'relative',
          overflow: 'hidden'
        }}>
          
          <div style={{ textAlign: 'center', position: 'relative', zIndex: 2 }}>
            <h1 style={{
              fontSize: '36px',
              fontWeight: '300',
              margin: '0 0 12px 0',
              letterSpacing: '0.15em',
              color: '#FEFAF7',
              textShadow: '0 2px 4px rgba(0,0,0,0.3)'
            }}>
              Bem-vindo ao Soura!
            </h1>
            <div style={{
              width: '80px',
              height: '3px',
              backgroundColor: '#b99e83ff',
              margin: '0 auto'
            }}></div>
          </div>
        </div>

        <div style={{
          padding: '20px',
          maxHeight: '450px',
          overflowY: 'auto',
          backgroundColor: '#ebded0ff'
        }}>
          <div style={{
            fontSize: '17px',
            lineHeight: '1.8',
            color: '#374151',
            marginBottom: '30px',
            textAlign: 'center'
          }}>
            <p style={{ margin: '0 0 12px 0' }}>
              Temos algumas perguntas para você. Todas as suas respostas serão recebidas no futuro, 
              então seja sincero — você está respondendo a si mesmo.
            </p>
            <p style={{ margin: '0px 10px 20px' }}>
              Use fone para melhor experiência e escolha uma música que te inspire enquanto responde.
            </p>

            <div style={{ position: 'relative', width: 'center', marginBottom: '20px' }}>
              <input
                type="text"
                placeholder=" Dê preferencia a algo emotivo..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && searchYouTubeMusic(searchQuery)}
                style={{
                  width: "100%",
                  maxWidth: "400px",
                  minWidth: "100px",
                  height: "30px",
                  padding: '4px 35px 4px 15px',
                  border: 'none',
                  borderRadius: '50px',
                  fontSize: '14px',
                  outline: 'none',
                  backgroundColor: '#a39f9c63',
                  color: '#374151'
                }}
              />
              <button
                onClick={() => searchYouTubeMusic(searchQuery)}
                disabled={isSearching || !searchQuery.trim()}
                style={{
                  position: 'absolute',
                  right: '5px',
                  top: '3px',
                  padding: '2px',
                  backgroundColor: 'transparent',
                  color: '#110c08ff',
                  border: 'none',
                  borderRadius: '50%',
                  width: '24px',
                  height: '24px',
                  cursor: isSearching ? 'not-allowed' : 'pointer',
                  fontSize: '12px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  opacity: isSearching ? 0.5 : 1
                }}
              >
                <Search size={14} />
              </button>
            </div>

            {searchResults.length > 0 && (
              <div>
                <h4 style={{
                  fontSize: '12px', 
                  fontWeight: '700',
                  color: '#374151',
                  margin: '12px'
                }}>
                  Resultados encontrados ({searchResults.length}):
                </h4>
                <div style={{ maxHeight: '200px', overflowY: 'auto' }}>
                  {searchResults.map((music) => (
                    <div
                      key={music.id}
                      onClick={() => selectMusic(music)}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        padding: '10px 12px',
                        backgroundColor: '#b4a69cff',
                        borderRadius: '20px',
                        marginBottom: '10px',
                        cursor: 'pointer',
                        transition: 'all 0.2s ease',
                        boxShadow: '0 2px 6px rgba(0, 0, 0, 0.1)'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = '#a8a09ac7';
                        e.currentTarget.style.transform = 'scale(1.02)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = '#dbcbbfff';
                        e.currentTarget.style.transform = 'scale(1)';
                      }}
                    >
                      <div style={{ flex: 1, overflow: 'hidden' }}>
                        <div style={{
                          fontSize: '14px',
                          fontWeight: '600',
                          color: '#1f2937',
                          whiteSpace: 'nowrap',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis'
                        }}>
                          {music.title.length > 35 ? music.title.substring(0, 35) + '...' : music.title}
                        </div>
                        <div style={{
                          fontSize: '12px',
                          color: '#343e53ff'
                        }}>
                          {music.artist}
                        </div>
                      </div>
                      <div style={{
                        width: '32px',
                        height: '32px',
                        borderRadius: '50%',
                        backgroundColor: '#ceb6a5ff',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        transition: 'background 0.2s ease'
                         }}>
                      <Play size={16} style={{ 
                        color: '#080401ff',
                        left: '20px'
                         }} />
                    </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <p style={{ 
              margin: '20px 0',
              fontWeight: '600',
              color: '#8B4513',
              fontSize: '19px',
              textAlign: 'center'
            }}>
              Boa experiência! Te vejo no futuro!
            </p>

            <div style={{
              textAlign: 'center',
              marginTop: '20px'
            }}>
              <button
                onClick={onClose}
                style={{
                  backgroundColor: '#021035e0',
                  color: '#FEFAF7',
                  padding: '12px 30px',
                  border: 'none',
                  borderRadius: '10px',
                  fontSize: '14px',
                  fontWeight: '400',
                  cursor: 'pointer',
                  letterSpacing: '0.08em',
                  textTransform: 'uppercase',
                  boxShadow: '0 6px 12px rgba(30, 58, 138, 0.3)'
                }}
              >
                Começar Jornada
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Player 
const BackgroundMusicPlayer = ({ currentMusic, onClose }) => {
  const [isPlaying, setIsPlaying] = useState(true);

  if (!currentMusic) return null;

  return (
    <>
      {/* Iframe invisível para o áudio */}
      <iframe
        width="0"
        height="0"
        src={`https://www.youtube.com/embed/${currentMusic.id}?autoplay=1&loop=1&playlist=${currentMusic.id}`}
        frameBorder="0"
        allow="autoplay; encrypted-media"
        allowFullScreen
        title="Background Music"
        style={{ position: 'absolute', left: '-9999px', opacity: 0 }}
      />
      
      {/* Player visual simples */}
      <div style={{
        position: 'fixed',
        bottom: '20px',
        right: '20px',
        zIndex: 9999,
        backgroundColor: 'rgba(40, 40, 40, 0.95)',
        borderRadius: '25px',
        padding: '8px 16px',
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)',
        backdropFilter: 'blur(10px)',
        border: '1px solid rgba(255, 255, 255, 0.1)'
      }}>
        
        {/* Botão Fechar */}
        <button
          onClick={onClose}
          style={{
            background: 'none',
            border: 'none',
            color: 'rgba(255, 255, 255, 0.8)',
            cursor: 'pointer',
            padding: '4px',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'color 0.2s ease'
          }}
          onMouseOver={(e) => e.target.style.color = 'white'}
          onMouseOut={(e) => e.target.style.color = 'rgba(255, 255, 255, 0.8)'}
        >
          <X size={14} />
        </button>

        {/* Controles */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          
          {/* Anterior */}
          <button style={{
            background: 'none',
            border: 'none',
            color: 'rgba(255, 255, 255, 0.6)',
            cursor: 'pointer',
            padding: '4px',
            display: 'flex',
            alignItems: 'center'
          }}>
            <ChevronLeft size={16} />
            <ChevronLeft size={16} style={{ marginLeft: '-8px' }} />
          </button>

          {/* Play/Pause */}
          <button 
            onClick={() => setIsPlaying(!isPlaying)}
            style={{
              background: 'white',
              border: 'none',
              borderRadius: '50%',
              width: '32px',
              height: '32px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              transition: 'transform 0.1s ease'
            }}
            onMouseOver={(e) => e.target.style.transform = 'scale(1.05)'}
            onMouseOut={(e) => e.target.style.transform = 'scale(1)'}
          >
            {isPlaying ? <Pause size={16} color="#333" /> : <Play size={16} color="#333" />}
          </button>

          {/* Próximo */}
          <button style={{
            background: 'none',
            border: 'none',
            color: 'rgba(255, 255, 255, 0.6)',
            cursor: 'pointer',
            padding: '4px',
            display: 'flex',
            alignItems: 'center'
          }}>
            <ChevronRight size={16} />
            <ChevronRight size={16} style={{ marginLeft: '-8px' }} />
          </button>

        </div>

        {/* Nome da música */}
        <div style={{
          color: 'white',
          fontSize: '12px',
          fontWeight: '400',
          maxWidth: '150px',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          whiteSpace: 'nowrap'
        }}>
          {currentMusic.title.length > 20 ? currentMusic.title.substring(0, 20) + '...' : currentMusic.title}
        </div>

        {/* Volume */}
        <Volume2 size={16} style={{ color: 'rgba(255, 255, 255, 0.6)' }} />

      </div>
    </>
  );
};

// CARTA ESPECIAL
const SpecialLetter = ({ isOpen, onClose, friendName }) => {
  const getLetterContent = (name) => {
    const letters = {
      'thais': {
        title: 'Carta de Deus, para Thais',
        content: `Querida Thais,

Eu vejo você. Cada gesto seu, cada sorriso que oferece ao mundo, cada momento em que o seu coração se enche de esperança — tudo isso é luz para mim. Você é uma alma que espalha beleza e amor, mesmo quando o mundo parece pesado.
Eu sei que recentemente você passou por um momento muito difícil, daqueles que marcam fundo e que parecem maiores do que a própria força. Mas também sei da coragem silenciosa com que enfrentou a dor; quero que saiba que eu estava lá, com você, jamais deixaria você sozinha. E sei que sua fé permaneceu firme dentro de você, mesmo quando tudo parecia se apagar. Isso me enche de orgulho e ternura.
Eu sei, minha filha, o quanto feriu seu coração sentir que o sonho de ser levada ao altar pelo seu pai foi despedaçado. Esse desejo sempre viveu em você, cheio de ternura, e a ausência dele nesse lugar tão sagrado pareceu roubar o sentido desse sonho. Mas quero que guarde em sua alma uma verdade: o amor não conhece ausências. Seu pai, mesmo não caminhando ao seu lado em passos visíveis, caminha com você em espírito. De onde está, ele vela por você, cuida de você e continuará acompanhando cada instante da sua vida, como sempre desejou.
Sei que há momentos em que a tristeza vem, silenciosa, e parece querer tomar seu brilho. Quero que saiba que mesmo nesses instantes, você nunca está sozinha. Estou ao seu lado, segurando sua mão, envolvendo você em um abraço que atravessa o tempo e o espaço.
Permita-se sentir com toda a intensidade do seu coração. Permita-se lembrar, sonhar e sorrir, mesmo quando as lembranças apertam. Cada lágrima sua é uma prova do amor que você carrega e que continua vivo, eterno, dentro de você.
Sua fé, sua bondade, sua coragem — tudo isso reflete a luz que sempre quis colocar no mundo. E é essa luz que me enche de orgulho. Você merece ser cuidada, ser amada e sentir que o amor que há ao seu redor nunca se perde. Ele está em cada gesto seu, em cada respiração, em cada instante de ternura que você oferece.
Eu estou aqui. Sempre. Para segurar sua mão, para aquecer seu coração, para lembrar você de que o amor é maior que qualquer dor e que a esperança nunca se esgota.

Com todo o meu amor,
Deus`
      },
      'monica': {
        title: 'Carta de Deus, para Monica',
        content: `Minha querida Mônica,

Eu vejo o quanto o seu coração é cheio de carinho e de amor. Sei o quanto a ausência do seu pai tem doído e sei o quanto ele significava para você. Como filha mais velha, você guardava com ele uma ligação especial, única, que deixou marcas profundas em sua alma.
Eu sei que o seu coração se partiu quando ele partiu antes de ver seu pequeno completar o primeiro ano. Mas quero que perceba o presente que deixei em sua vida: esse bebê, que carrega tanto do avô em seus gestos, em seu olhar, em sua presença. Ele é uma continuação do amor que vocês compartilharam. Cada sorriso dele é um sinal de que a vida, mesmo em meio à dor, floresce e traz esperança.
Você não está sozinha, Mônica. Sua doçura, sua força e a forma como cuida do seu filho são reflexos daquilo que aprendeu com seu pai e do amor que ainda existe entre vocês. A saudade pode apertar, mas o amor nunca se perde — ele apenas se transforma e encontra novos caminhos para permanecer vivo.
Permita-se acolher sua dor com calma, sem pressa. Permita-se sorrir lembrando dele, assim como permite que seu bebê ilumine seus dias. Você é uma filha amada, uma mãe dedicada e uma mulher de luz. E eu estou aqui, sempre, para segurar sua mão e aquecer seu coração.

Com todo o meu amor,
Deus`
      },
      'simone': {
        title: 'Carta de Deus, para Simone',
        content: `Minha querida Simone,

Eu conheço o silêncio do seu coração. Sei que você sempre pediu pouco, que guardou muito para si mesma e que sempre preferiu cuidar dos outros antes de se deixar cuidar. Mas também sei que esta perda trouxe uma dor profunda, que muitas vezes você não coloca em palavras, mas que eu sinto em cada lágrima escondida.
Não pense que seu jeito discreto faz com que eu não perceba o tamanho da sua saudade. Pelo contrário: eu vejo sua dor e sei como ela pesa em seu coração. Sei o quanto seu pai significava para você e como a ausência dele deixou um espaço difícil de compreender.
Quero que saiba que não há amor menor no silêncio. Mesmo sem muitas palavras, o laço que unia você ao seu pai é eterno, e continua vivo dentro de você. Ele se reflete em sua força silenciosa, em sua capacidade de amar sem exigir nada em troca, em cada gesto simples que carrega grandeza.
Permita-se sentir, Simone. Não é fraqueza chorar, não é exagero sentir falta. É amor. E o amor é eterno. Seu pai continua presente em você, naquilo que você é, no coração que, mesmo reservado, transborda mais do que você mesma imagina.
Estou aqui, sempre, para segurar sua mão mesmo quando você prefere o silêncio. Em cada passo que dá, em cada suspiro, em cada instante, eu estou contigo.

Com todo o meu amor,
Deus`
      }
    };
    
    return letters[name.toLowerCase()] || letters['thais'];
  };

  const letter = getLetterContent(friendName);

  if (!isOpen) return null;

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.6)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 10000,
      backdropFilter: 'blur(8px)'
    }}>
      <div style={{
        backgroundColor: '#FEFAF7',
        borderRadius: '12px',
        maxWidth: '500px',
        width: '90%',
        maxHeight: '80vh',
        overflow: 'hidden',
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.6)',
        border: '2px solid #fbbf24',
        position: 'relative'
      }}>
        
        <div style={{
          background: 'linear-gradient(135deg, #0B3140, #40131B)',
          color: '#FEFAF7',
          padding: '24px',
          textAlign: 'center',
          position: 'relative'
        }}>
          <button
            onClick={onClose}
            style={{
              position: 'absolute',
              top: '16px',
              right: '16px',
              background: 'rgba(255,255,255,0.2)',
              border: 'none',
              color: '#FEFAF7',
              borderRadius: '50%',
              width: '32px',
              height: '32px',
              cursor: 'pointer',
              fontSize: '18px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            ×
          </button>
          
          <h2 style={{
            fontSize: '24px',
            fontWeight: '300',
            margin: '0',
            letterSpacing: '0.1em'
          }}>
            {letter.title}
          </h2>
          <div style={{
            width: '60px',
            height: '2px',
            backgroundColor: '#fbbf24',
            margin: '12px auto 0'
          }}></div>
        </div>

        <div style={{
          padding: '32px 24px',
          maxHeight: '300px',
          overflowY: 'auto'
        }}>
          <div style={{
            fontSize: '16px',
            lineHeight: '1.8',
            color: '#374151',
            whiteSpace: 'pre-line',
            textAlign: 'left'
          }}>
            {letter.content}
          </div>
        </div>

        <div style={{
          padding: '24px',
          borderTop: '1px solid #e5e7eb',
          textAlign: 'center'
        }}>
          <button
            onClick={onClose}
            style={{
              backgroundColor: '#0B3140',
              color: '#FEFAF7',
              padding: '12px 24px',
              border: 'none',
              borderRadius: '8px',
              fontSize: '14px',
              fontWeight: '400',
              cursor: 'pointer',
              letterSpacing: '0.05em',
              textTransform: 'uppercase',
              transition: 'all 0.2s ease'
            }}
            onMouseOver={(e) => {
              e.target.style.backgroundColor = '#40131B';
            }}
            onMouseOut={(e) => {
              e.target.style.backgroundColor = '#0B3140';
            }}
          >
            Continuar com a Soura
          </button>
        </div>
      </div>
    </div>
  );
};

// FUNÇÃO DE VERIFICAÇÃO PARA CARTAS ESPECIAIS
const checkSpecialFriend = (email, name) => {
  const specialFriends = [
    { emails: ['thais@gmail.com', 'thais@hotmail.com'], name: 'thais' },
    { emails: ['monica@gmail.com', 'monica@hotmail.com'], name: 'monica' }, 
    { emails: ['simone@gmail.com', 'simone@hotmail.com'], name: 'simone' }
  ];
  
  const lowerName = name.toLowerCase();
  if (lowerName.includes('thais') || lowerName.includes('thaís')) return 'thais';
  if (lowerName.includes('monica') || lowerName.includes('mônica')) return 'monica';
  if (lowerName.includes('simone')) return 'simone';
  
  return null;
};

const TimeCapsule = () => {
  const [showWelcomeModal, setShowWelcomeModal] = useState(true);
  const [currentMusic, setCurrentMusic] = useState(null);
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState({});
  const [userInfo, setUserInfo] = useState({ email: '', name: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [animatedAnswers, setAnimatedAnswers] = useState([]);
  const [showAnswerAnimation, setShowAnswerAnimation] = useState(false);
  const [error, setError] = useState('');
  
  // Estados da carta especial
  const [showSpecialLetter, setShowSpecialLetter] = useState(false);
  const [friendName, setFriendName] = useState('');
  
  // Estado para data customizada
  const [displayDate, setDisplayDate] = useState('');
  
  // Ref para manter o iframe de música persistente
  const musicIframeRef = useRef(null);
  const musicContainerRef = useRef(null);

  const { phase, backgroundShift, startAnimationSequence, resetAnimation } = useAnimationPhases();

  // Criar iframe de música uma única vez
  useEffect(() => {
    if (currentMusic && !musicIframeRef.current) {
      // Criar o iframe apenas uma vez
      const iframe = document.createElement('iframe');
      iframe.width = '0';
      iframe.height = '0';
      iframe.src = `https://www.youtube.com/embed/${currentMusic.id}?autoplay=1&loop=1&playlist=${currentMusic.id}`;
      iframe.frameBorder = '0';
      iframe.allow = 'autoplay; encrypted-media';
      iframe.allowFullScreen = true;
      iframe.title = 'Background Music';
      iframe.style.cssText = 'position: absolute; left: -9999px; opacity: 0;';
      
      // Adicionar ao body para garantir que nunca seja removido
      document.body.appendChild(iframe);
      musicIframeRef.current = iframe;
    }
  }, [currentMusic]);

  // Limpar iframe quando música for removida
  useEffect(() => {
    if (!currentMusic && musicIframeRef.current) {
      document.body.removeChild(musicIframeRef.current);
      musicIframeRef.current = null;
    }
  }, [currentMusic]);

  const currentQuestion = QUESTIONS[currentStep];
  const progress = ((currentStep + 1) / QUESTIONS.length) * 100;

  // Player visual apenas (iframe é criado no useEffect)
  const renderMusicControls = () => (
    currentMusic ? (
      <div style={{
        position: 'fixed',
        bottom: '20px',
        right: '20px',
        zIndex: 9999,
        backgroundColor: 'rgba(40, 40, 40, 0.95)',
        borderRadius: '25px',
        padding: '8px 16px',
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)',
        backdropFilter: 'blur(10px)',
        border: '1px solid rgba(255, 255, 255, 0.1)'
      }}>
        
        {/* Botão Fechar */}
        <button
          onClick={() => setCurrentMusic(null)}
          style={{
            background: 'none',
            border: 'none',
            color: 'rgba(255, 255, 255, 0.8)',
            cursor: 'pointer',
            padding: '4px',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'color 0.2s ease'
          }}
          onMouseOver={(e) => e.target.style.color = 'white'}
          onMouseOut={(e) => e.target.style.color = 'rgba(255, 255, 255, 0.8)'}
        >
          <X size={14} />
        </button>

        {/* Nome da música */}
        <div style={{
          color: 'white',
          fontSize: '12px',
          fontWeight: '400',
          maxWidth: '150px',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          whiteSpace: 'nowrap'
        }}>
          {currentMusic.title.length > 20 ? currentMusic.title.substring(0, 20) + '...' : currentMusic.title}
        </div>

        {/* Volume */}
        <Volume2 size={16} style={{ color: 'rgba(255, 255, 255, 0.6)' }} />

      </div>
    ) : null
  );

  const handleAnswerChange = (questionId, value) => {
    if (questionId === 'user_email') {
      setUserInfo(prev => ({ ...prev, email: value }));
    } else if (questionId === 'user_name') {
      setUserInfo(prev => ({ ...prev, name: value }));
    } else {
      setAnswers(prev => ({ ...prev, [questionId]: value }));
    }
  };

  const isStepValid = () => {
    if (currentQuestion.id === 'user_info') {
      return userInfo.email && /\S+@\S+\.\S+/.test(userInfo.email);
    }
    return answers[currentQuestion.id];
  };

  const nextStep = () => {
    if (currentStep < QUESTIONS.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const executeNormalSubmit = async () => {
    const capsuleData = {
      user_email: userInfo.email,
      user_name: userInfo.name,
      life_meaning: answers.life_meaning || '',
      emotional_state: answers.emotional_state || '',
      current_priorities: answers.current_priorities || '',
      future_vision: answers.future_vision || '',
      future_message: answers.future_message || '',
      future_message_2: answers.future_message_2 || '',
      future_message_3: answers.future_message_3 || '',
      future_message_4: answers.future_message_4 || '',
      future_message_5: answers.future_message_5 || '',
      future_message_6: answers.future_message_6 || '',
      future_message_7: answers.future_message_7 || '',
      future_message_8: answers.future_message_8 || '',
      delivery_date: answers.delivery_date
    };

    const allAnswers = [
      { id: 'email', text: userInfo.email, question: 'Email' },
      { id: 'name', text: userInfo.name || 'Anônimo', question: 'Nome' },
      { id: 'a', text: answers.life_meaning || '', question: 'Sentido da vida' },
      { id: 'b', text: answers.emotional_state || '', question: 'Estado emocional' },
      { id: 'c', text: answers.current_priorities || '', question: 'Prioridades atuais' },
      { id: 'd', text: answers.future_vision || '', question: 'Visão do futuro' },
      { id: 'e', text: answers.future_message || '', question: 'Mensagem' },
      { id: 'f', text: answers.future_message_2 || '', question: 'Promessas' },
      { id: 'g', text: answers.future_message_3 || '', question: 'Sobre medo' },
      { id: 'h', text: answers.future_message_4 || '', question: 'Medo' },
      { id: 'i', text: answers.future_message_5 || '', question: 'Sobre sonhos' },
      { id: 'j', text: answers.future_message_6 || '', question: 'Revisitar' },
      { id: 'k', text: answers.future_message_7 || '', question: 'Momentos difíceis' },
      { id: 'l', text: answers.future_message_8 || '', question: 'Algo para você' },
      { id: 'm', text: answers.delivery_date || '', question: 'Data de entrega' }
    ].filter(answer => answer.text);

    setAnimatedAnswers(allAnswers);
    setShowAnswerAnimation(true);

    startAnimationSequence(allAnswers, async () => {
      try {
        await timeCapsuleAPI.submitCapsule(capsuleData);
        setIsSubmitting(false);
        setShowSuccess(true);
      } catch (err) {
        setError('Erro ao salvar cápsula: ' + err.message);
        setIsSubmitting(false);
        setShowAnswerAnimation(false);
        resetAnimation();
      }
    });
  };

  // Função principal de submit
  const handleSubmit = async () => {
    setIsSubmitting(true);
    setError('');
    
    try {
      // Verificar se é uma amiga especial PRIMEIRO
      const specialFriend = checkSpecialFriend(userInfo.email, userInfo.name);
      if (specialFriend) {
        setFriendName(specialFriend);
        setShowSpecialLetter(true);
        setIsSubmitting(false);
        return;
      }

      // para continuar o fluxo, caso não seja pessoas especiais
      await executeNormalSubmit();

    } catch (err) {
      setError('Erro ao processar dados: ' + err.message);
      setIsSubmitting(false);
      setShowAnswerAnimation(false);
      resetAnimation();
    }
  };

  // Função para continuar após ver a carta
  const handleContinueAfterLetter = async () => {
    setShowSpecialLetter(false);
    setIsSubmitting(true);
    
    try {
      await executeNormalSubmit();
    } catch (err) {
      setError('Erro ao processar dados: ' + err.message);
      setIsSubmitting(false);
    }
  };

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

  const renderUserInfo = () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <input
        type="email"
        placeholder="seu@email.com"
        style={inputStyle}
        value={userInfo.email}
        onChange={(e) => handleAnswerChange('user_email', e.target.value)}
        onFocus={handleFocus}
        onBlur={handleBlur}
        required
      />
      <input
        type="text"
        placeholder="Seu nome (opcional)"
        style={inputStyle}
        value={userInfo.name}
        onChange={(e) => handleAnswerChange('user_name', e.target.value)}
        onFocus={handleFocus}
        onBlur={handleBlur}
      />
    </div>
  );

  const renderQuestion = () => {
    switch (currentQuestion.type) {
      case 'user_info':
        return renderUserInfo();
        
      case 'text':
        return (
          <textarea
            style={{
              ...inputStyle,
              height: '120px',
              resize: 'none',
              lineHeight: '1.6'
            }}
            placeholder="Suas reflexões..."
            value={answers[currentQuestion.id] || ''}
            onChange={(e) => handleAnswerChange(currentQuestion.id, e.target.value)}
            onFocus={handleFocus}
            onBlur={handleBlur}
          />
        );
      
      case 'multiple':
        return (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {currentQuestion.options.map((option, index) => (
              <label key={index} style={{ 
                display: 'flex', 
                alignItems: 'center', 
                cursor: 'pointer',
                padding: '8px 0'
              }}>
                <input
                  type="radio"
                  value={option}
                  checked={answers[currentQuestion.id] === option}
                  onChange={(e) => handleAnswerChange(currentQuestion.id, e.target.value)}
                  style={{ display: 'none' }}
                />
                <div style={{
                  width: '16px',
                  height: '16px',
                  borderRadius: '2px',
                  border: '2px solid #92400e',
                  backgroundColor: answers[currentQuestion.id] === option ? '#92400e' : 'rgba(146, 64, 14, 0.1)',
                  marginRight: '12px',
                  transition: 'none',
                  position: 'relative',
                  imageRendering: 'pixelated'
                }}>
                  {answers[currentQuestion.id] === option && (
                    <div style={{
                      width: '6px',
                      height: '6px',
                      backgroundColor: '#fbbf24',
                      borderRadius: '1px',
                      position: 'absolute',
                      top: '50%',
                      left: '50%',
                      transform: 'translate(-50%, -50%)',
                      imageRendering: 'pixelated'
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
        const formatDateInput = (input) => {
          // Remove tudo que não é número
          const numbers = input.replace(/\D/g, '');
          
          // Aplica a máscara dd/mm/yyyy
          let formatted = '';
          
          if (numbers.length >= 1) {
            formatted = numbers.substring(0, 2);
          }
          if (numbers.length >= 3) {
            formatted += '/' + numbers.substring(2, 4);
          }
          if (numbers.length >= 5) {
            formatted += '/' + numbers.substring(4, 8);
          }
          
          return formatted;
        };

        const validateAndConvertDate = (brDate) => {
          if (brDate.length !== 10) return null;
          
          const [day, month, year] = brDate.split('/');
          
          // Validação básica
          const dayNum = parseInt(day);
          const monthNum = parseInt(month);
          const yearNum = parseInt(year);
          
          if (dayNum < 1 || dayNum > 31) return null;
          if (monthNum < 1 || monthNum > 12) return null;
          if (yearNum < new Date().getFullYear()) return null;
          
          // Criar data e validar se é real
          const date = new Date(yearNum, monthNum - 1, dayNum);
          
          if (date.getDate() !== dayNum || 
              date.getMonth() !== monthNum - 1 || 
              date.getFullYear() !== yearNum) {
            return null;
          }
          
          // Verificar se é data futura
          const today = new Date();
          today.setHours(0, 0, 0, 0);
          
          if (date <= today) return null;
          
          // Retornar no formato ISO
          return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
        };

        const handleDateChange = (e) => {
          const input = e.target.value;
          const formatted = formatDateInput(input);
          setDisplayDate(formatted);
          
          // Se data está completa, validar e salvar
          if (formatted.length === 10) {
            const isoDate = validateAndConvertDate(formatted);
            if (isoDate) {
              handleAnswerChange(currentQuestion.id, isoDate);
            }
          }
        };

        // Sincronizar displayDate com o valor salvo
        const currentDisplayDate = displayDate || (() => {
          const isoDate = answers[currentQuestion.id];
          if (isoDate) {
            const [year, month, day] = isoDate.split('-');
            return `${day}/${month}/${year}`;
          }
          return '';
        })();

        const isDateValid = currentDisplayDate.length === 10 && validateAndConvertDate(currentDisplayDate) !== null;

        return (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            <input
              type="text"
              placeholder="dd/mm/aaaa"
              style={{
                ...inputStyle,
                borderBottomColor: currentDisplayDate && !isDateValid ? 'rgba(220, 38, 38, 0.5)' : 'rgba(120, 113, 108, 0.3)'
              }}
              value={currentDisplayDate}
              onChange={handleDateChange}
              onFocus={handleFocus}
              onBlur={handleBlur}
              maxLength={10}
            />
            <p style={{ 
              fontSize: '14px', 
              color: currentDisplayDate && !isDateValid ? '#dc2626' : '#57534e', 
              fontWeight: '300', 
              lineHeight: '1.5' 
            }}>
              {currentDisplayDate && !isDateValid && currentDisplayDate.length === 10 
                ? 'Data inválida ou no passado'
                : 'Escolha uma data significativa para receber suas reflexões'
              }
            </p>
          </div>
        );
      
      default:
        return null;
    }
  };

  // Tela de sucesso
  if (showSuccess) {
    return (
      <>
        {renderMusicControls()}
        <div style={{ minHeight: '100vh', display: 'flex' }}>
          <div style={{
            width: '30%',
            background: 'linear-gradient(135deg, #BFB584 0%, #0B3140 100%)',
            position: 'relative'
          }}>
            <div style={{ position: 'absolute', top: '60px', left: '24px' }}>
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

          <div style={{
            width: '70%',
            background: 'linear-gradient(135deg, #0B3140 0%, #40131B 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <div style={{ textAlign: 'center', maxWidth: '400px', padding: '0 24px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <PixelCapsule size={140} />
              <h2 style={{ 
                fontSize: '32px', 
                fontWeight: '200', 
                color: '#e7e5e4', 
                margin: '24px 0 16px' 
              }}>
                Enviada com Sucesso!
              </h2>
              <p style={{ 
                color: '#d6d3d1', 
                fontWeight: '300', 
                fontSize: '18px', 
                lineHeight: '1.6', 
                margin: '0 0 32px' 
              }}>
                Sua Soura foi criada e será entregue na data escolhida.
                <br/>
                <span style={{ color: '#fbbf24' }}>Suas memórias estão seguras no futuro.</span>
              </p>
              <button 
                onClick={() => window.location.reload()}
                style={{
                  padding: '12px 24px',
                  border: '1px solid #a8a29e',
                  color: '#d6d3d1',
                  background: 'transparent',
                  cursor: 'pointer',
                  borderRadius: '6px',
                  fontWeight: '300',
                  letterSpacing: '0.05em',
                  transition: 'all 0.3s ease'
                }}
                onMouseOver={(e) => {
                  e.target.style.borderColor = '#d97706';
                  e.target.style.color = '#fbbf24';
                }}
                onMouseOut={(e) => {
                  e.target.style.borderColor = '#a8a29e';
                  e.target.style.color = '#d6d3d1';
                }}
              >
                Criar Nova Soura
              </button>
            </div>
          </div>
        </div>
      </>
    );
  }

  // Tela de animação
  if (isSubmitting) {
    return (
      <>
        {renderMusicControls()}
        <AnimationSequence 
          phase={phase}
          backgroundShift={backgroundShift}
          animatedAnswers={animatedAnswers}
          showAnswerAnimation={showAnswerAnimation}
        />
      </>
    );
  }

  // Interface principal
  return (
  <>
    <WelcomeModal 
      isOpen={showWelcomeModal}
      onClose={() => setShowWelcomeModal(false)}
      onSelectVideo={setCurrentMusic}
    />
    {/* Controles de música sempre presentes */}
    {renderMusicControls()}
    <div style={{ minHeight: '100vh', display: 'flex', position: 'relative' }}>
      
      {/* Erro */}
      {error && (
        <div style={{
          position: 'fixed',
          top: '20px',
          left: '50%',
          transform: 'translateX(-50%)',
          backgroundColor: '#fee2e2',
          border: '1px solid #fecaca',
          color: '#dc2626',
          padding: '12px 24px',
          borderRadius: '8px',
          zIndex: 1000
        }}>
          {error}
        </div>
      )}

      {/* Presente - 70% */}
      <div style={{
        width: '70%',
        background: 'linear-gradient(135deg, #BFB584 0%, #0B3140 100%)',
        position: 'relative'
      }}>
        <div style={{ position: 'absolute', top: '60px', left: '24px' }}>
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

      {/* Futuro - 30% */}
      <div style={{
        width: '30%',
        background: 'linear-gradient(135deg, #0B3140 0%, #40131B 100%)',
        position: 'relative'
      }}>
        <div style={{ position: 'absolute', top: '60px', right: '24px', textAlign: 'right' }}>
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

      {/* Interface Central */}
      <div style={{
        position: 'absolute',
        inset: 0,
        display: 'flex',
        alignItems: 'flex-start',
        justifyContent: 'center',
        paddingTop: '40px'
      }}>
        <div style={{ width: '100%', maxWidth: '500px' }}>
          
          {/* Header */}
          <div style={{ textAlign: 'center', marginBottom: '48px' }}>
            <h1 style={{ 
              fontSize: '42px', 
              fontWeight: '200', 
              color: '#f5f5f4', 
              marginBottom: '12px', 
              letterSpacing: '0.3em',
              margin: '0 0 12px 0'
            }}>
              SOURA
            </h1>
            <div style={{ 
              width: '40px', 
              height: '1px',
              backgroundColor: '#fbbf24', 
              margin: '0 auto' 
            }}/>
          </div>

          {/* Progress */}
          <div style={{ marginBottom: '40px' }}>
            <div style={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              fontSize: '11px', 
              color: '#d6d3d1', 
              marginBottom: '8px', 
              fontWeight: '300', 
              letterSpacing: '0.1em'
            }}>
              <span>{currentStep + 1} DE {QUESTIONS.length}</span>
              <span>{Math.round(progress)}%</span>
            </div>
            <div style={{ 
              height: '6px', 
              backgroundColor: 'rgba(155, 125, 125, 0.3)',
              borderRadius: '1px',
              border: '1px solid rgba(155, 125, 125, 0.3)',
              overflow: 'hidden',
              imageRendering: 'pixelated'
            }}>
              <div style={{
              height: '100%',
              background: `repeating-linear-gradient(
                to right,
            #fbbf24 0%,
            #fbbf24 8px,
            #f59e0b 8px,
            #f59e0b 16px
              )`,
              width: `${progress}%`,
              transition: 'width 0.3s steps(20)',
              imageRendering: 'pixelated',
              borderRight: progress < 100 ? '1px solid #bb701aff' : 'none'
            }}/>
            </div>
            </div>

          {/* Card principal */}
          <div style={{
            backgroundColor: 'rgba(255, 255, 255, 0.95)',
            backdropFilter: 'blur(20px)',
            padding: '32px',
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
            border: '1px solid rgba(255, 255, 255, 0.7)',
            borderRadius: '8px',
            marginTop: '30px'
          }}>
            
            {/* Header da pergunta */}
            <div style={{ marginBottom: '28px' }}>
              <div style={{ display: 'flex', alignItems: 'center', marginBottom: '16px' }}>
                <currentQuestion.icon size={18} style={{ color: '#92400e', marginRight: '12px' }} />
                <span style={{
                  fontSize: '10px',
                  color: '#92400e',
                  textTransform: 'uppercase',
                  letterSpacing: '0.15em',
                  fontWeight: '600'
                }}>
                  {currentQuestion.title}
                </span>
              </div>
              <h2 style={{ 
                fontSize: '22px', 
                fontWeight: '200', 
                color: '#1c1917', 
                lineHeight: '1.5', 
                letterSpacing: '0.02em',
                margin: 0
              }}>
                {currentQuestion.question}
              </h2>
            </div>

            {/* Conteúdo da pergunta */}
            <div style={{ marginBottom: '28px' }}>
              {renderQuestion()}
            </div>

            {/* Navegação */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <button
                onClick={prevStep}
                disabled={currentStep === 0}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  fontSize: '12px',
                  fontWeight: '300',
                  color: currentStep === 0 ? '#d6d3d1' : '#57534e',
                  background: 'transparent',
                  border: 'none',
                  cursor: currentStep === 0 ? 'not-allowed' : 'pointer',
                  transition: 'all 0.2s ease',
                  padding: '8px 0'
                }}
              >
                <ChevronLeft size={16} />
                <span style={{ letterSpacing: '0.05em' }}>ANTERIOR</span>
              </button>

              <button
                onClick={currentStep === QUESTIONS.length - 1 ? handleSubmit : nextStep}
                disabled={!isStepValid()}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: currentStep === QUESTIONS.length - 1 ? '10px 20px' : '8px 0',
                  fontSize: '12px',
                  fontWeight: '300',
                  letterSpacing: '0.05em',
                  backgroundColor: currentStep === QUESTIONS.length - 1 && isStepValid() ? '#92400e' : 'transparent',
                  color: isStepValid() ? (currentStep === QUESTIONS.length - 1 ? 'white' : '#57534e') : '#d6d3d1',
                  border: 'none',
                  cursor: isStepValid() ? 'pointer' : 'not-allowed',
                  transition: 'all 0.2s ease',
                  borderRadius: currentStep === QUESTIONS.length - 1 ? '4px' : '0',
                  boxShadow: currentStep === QUESTIONS.length - 1 && isStepValid() ? '0 4px 6px -1px rgba(0, 0, 0, 0.1)' : 'none'
                }}
              >
                <span>{currentStep === QUESTIONS.length - 1 ? 'ENVIAR' : 'PRÓXIMO'}</span>
                {currentStep !== QUESTIONS.length - 1 && <ChevronRight size={16} />}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <SpecialLetter 
      isOpen={showSpecialLetter} 
      onClose={handleContinueAfterLetter}
      friendName={friendName}
    />
  </>
  );
};

export default TimeCapsule;
