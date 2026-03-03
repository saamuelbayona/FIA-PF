import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import orbImage from '../assets/pollo_fiesta_FIA.png';

export default function SplashScreen({ onComplete }) {
  const [progress, setProgress] = useState(0);
  const [started, setStarted] = useState(false);
  const [audioContext, setAudioContext] = useState(null);

  useEffect(() => {
    if (!started) return;

    // Reproducir sonido inmediatamente
    playSound();

    // Progreso de 0 a 100 en 3 segundos
    const progressInterval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(progressInterval);
          setTimeout(() => onComplete(), 300);
          return 100;
        }
        return prev + 3.33; // 100 / 30 = 3.33 por cada 100ms
      });
    }, 100);

    return () => {
      clearInterval(progressInterval);
      if (audioContext) {
        audioContext.close();
      }
    };
  }, [started, onComplete]);

  const playSound = async () => {
    try {
      const AudioContextClass = window.AudioContext || window.webkitAudioContext;
      const ctx = new AudioContextClass();
      setAudioContext(ctx);
      
      if (ctx.state === 'suspended') {
        await ctx.resume();
      }
      
      const now = ctx.currentTime;
      
      // SONIDO MODERNO Y ROBUSTO
      // Tipo: Stripe, Notion, Linear, Vercel - UI premium actual
      
      // === IMPACTO INICIAL ROBUSTO ===
      // Click profundo tipo UI moderna
      const impact = ctx.createOscillator();
      const impactGain = ctx.createGain();
      const impactFilter = ctx.createBiquadFilter();
      
      impact.type = 'sine';
      impact.frequency.value = 150; // Grave pero no demasiado
      
      impactFilter.type = 'lowpass';
      impactFilter.frequency.value = 400;
      
      impactGain.gain.setValueAtTime(0.25, now);
      impactGain.gain.exponentialRampToValueAtTime(0.001, now + 0.15);
      
      impact.connect(impactFilter);
      impactFilter.connect(impactGain);
      impactGain.connect(ctx.destination);
      impact.start(now);
      impact.stop(now + 0.15);
      
      // === TONO PRINCIPAL LIMPIO ===
      // Frecuencia media-alta, moderna y clara
      const mainTone = ctx.createOscillator();
      const mainGain = ctx.createGain();
      const mainFilter = ctx.createBiquadFilter();
      
      mainTone.type = 'sine';
      mainTone.frequency.value = 440; // A4 - Frecuencia estándar y agradable
      
      mainFilter.type = 'lowpass';
      mainFilter.frequency.value = 3000;
      mainFilter.Q.value = 0.7;
      
      mainGain.gain.setValueAtTime(0, now + 0.08);
      mainGain.gain.linearRampToValueAtTime(0.18, now + 0.12);
      mainGain.gain.exponentialRampToValueAtTime(0.001, now + 0.8);
      
      mainTone.connect(mainFilter);
      mainFilter.connect(mainGain);
      mainGain.connect(ctx.destination);
      mainTone.start(now + 0.08);
      mainTone.stop(now + 0.8);
      
      // === ARMÓNICO SUPERIOR (Brillo sutil) ===
      const harmonic = ctx.createOscillator();
      const harmonicGain = ctx.createGain();
      
      harmonic.type = 'sine';
      harmonic.frequency.value = 880; // A5 - Octava superior
      
      harmonicGain.gain.setValueAtTime(0, now + 0.08);
      harmonicGain.gain.linearRampToValueAtTime(0.08, now + 0.12);
      harmonicGain.gain.exponentialRampToValueAtTime(0.001, now + 0.7);
      
      harmonic.connect(harmonicGain);
      harmonicGain.connect(ctx.destination);
      harmonic.start(now + 0.08);
      harmonic.stop(now + 0.7);
      
      // === SUB-BASS MODERNO (Profundidad) ===
      const subBass = ctx.createOscillator();
      const subGain = ctx.createGain();
      const subFilter = ctx.createBiquadFilter();
      
      subBass.type = 'sine';
      subBass.frequency.value = 110; // A2 - Bajo limpio
      
      subFilter.type = 'lowpass';
      subFilter.frequency.value = 250;
      
      subGain.gain.setValueAtTime(0, now + 0.08);
      subGain.gain.linearRampToValueAtTime(0.12, now + 0.15);
      subGain.gain.setValueAtTime(0.12, now + 0.5);
      subGain.gain.exponentialRampToValueAtTime(0.001, now + 1.0);
      
      subBass.connect(subFilter);
      subFilter.connect(subGain);
      subGain.connect(ctx.destination);
      subBass.start(now + 0.08);
      subBass.stop(now + 1.0);
      
      // === ACORDE FINAL ROBUSTO ===
      // Tríada simple pero efectiva (A - C# - E)
      const createChordNote = (freq, startTime, duration, volume) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        const filter = ctx.createBiquadFilter();
        
        osc.type = 'sine';
        osc.frequency.value = freq;
        
        filter.type = 'lowpass';
        filter.frequency.value = 2500;
        
        gain.gain.setValueAtTime(0, startTime);
        gain.gain.linearRampToValueAtTime(volume, startTime + 0.08);
        gain.gain.setValueAtTime(volume * 0.85, startTime + duration - 0.4);
        gain.gain.exponentialRampToValueAtTime(0.001, startTime + duration);
        
        osc.connect(filter);
        filter.connect(gain);
        gain.connect(ctx.destination);
        
        osc.start(startTime);
        osc.stop(startTime + duration);
      };
      
      // Acorde de La mayor (A - C# - E) - Brillante pero no agresivo
      createChordNote(220.00, now + 0.35, 1.2, 0.08); // A3
      createChordNote(277.18, now + 0.35, 1.2, 0.07); // C#4
      createChordNote(329.63, now + 0.35, 1.2, 0.06); // E4
      
      // === REVERB MODERNO Y LIMPIO ===
      const delay = ctx.createDelay();
      const delayGain = ctx.createGain();
      const delayFilter = ctx.createBiquadFilter();
      
      delay.delayTime.value = 0.12; // Delay corto y tight
      delayGain.gain.value = 0.2; // Sutil
      
      delayFilter.type = 'lowpass';
      delayFilter.frequency.value = 2000;
      
      // Nota final con reverb
      const finalNote = ctx.createOscillator();
      const finalGain = ctx.createGain();
      
      finalNote.type = 'sine';
      finalNote.frequency.value = 440; // A4
      
      finalGain.gain.setValueAtTime(0, now + 0.5);
      finalGain.gain.linearRampToValueAtTime(0.1, now + 0.55);
      finalGain.gain.exponentialRampToValueAtTime(0.001, now + 1.8);
      
      finalNote.connect(finalGain);
      finalGain.connect(ctx.destination);
      finalGain.connect(delay);
      delay.connect(delayFilter);
      delayFilter.connect(delayGain);
      delayGain.connect(ctx.destination);
      
      finalNote.start(now + 0.5);
      finalNote.stop(now + 1.8);
      
      console.log('Sistema iniciado');
      
    } catch (error) {
      console.error('Error al reproducir sonido:', error);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center overflow-hidden bg-gradient-to-br from-slate-950 via-slate-900 to-black">
      
      {/* Pantalla de inicio */}
      {!started && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="relative z-50 flex flex-col items-center gap-8"
        >
          <motion.div
            animate={{
              scale: [1, 1.05, 1],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          >
            <img 
              src={orbImage} 
              alt="FIA Logo" 
              className="w-48 h-48 object-cover"
              style={{
                filter: 'brightness(1.2) drop-shadow(0 0 40px rgba(56, 189, 248, 0.6))'
              }}
            />
          </motion.div>

          <motion.h1
            className="text-6xl font-black"
            style={{
              background: 'linear-gradient(135deg, #ffffff 0%, #38bdf8 50%, #1d4ed8 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}
          >
            FIA
          </motion.h1>

          <motion.button
            onClick={() => setStarted(true)}
            className="px-12 py-4 rounded-full text-xl font-bold transition-all"
            style={{
              background: 'linear-gradient(135deg, #38bdf8, #1d4ed8)',
              color: 'white',
              boxShadow: '0 0 40px rgba(56, 189, 248, 0.6)',
              border: '2px solid rgba(56, 189, 248, 0.8)'
            }}
            whileHover={{
              scale: 1.1,
              boxShadow: '0 0 60px rgba(56, 189, 248, 0.9)'
            }}
            whileTap={{ scale: 0.95 }}
          >
            INICIAR SISTEMA
          </motion.button>

          <p className="text-gray-400 text-sm font-mono">
            Presiona para comenzar
          </p>
        </motion.div>
      )}

      {/* Animación principal optimizada */}
      {started && (
        <div className="relative z-10 flex flex-col items-center w-full max-w-2xl px-8">
          
          {/* Logo central simplificado */}
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5, type: "spring" }}
            className="relative mb-12 w-64 h-64 flex items-center justify-center"
          >
            {/* Anillos simples */}
            {[...Array(3)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute rounded-full"
                style={{
                  width: `${120 + i * 50}px`,
                  height: `${120 + i * 50}px`,
                  border: `2px solid rgba(56, 189, 248, ${0.5 - i * 0.15})`,
                }}
                animate={{
                  rotate: i % 2 === 0 ? 360 : -360,
                  scale: [1, 1.05, 1]
                }}
                transition={{
                  rotate: { duration: 8 - i * 2, repeat: Infinity, ease: "linear" },
                  scale: { duration: 2, repeat: Infinity, ease: "easeInOut" }
                }}
              />
            ))}

            {/* Logo central */}
            <motion.div
              className="relative w-40 h-40 rounded-full flex items-center justify-center overflow-hidden z-10"
              style={{
                background: 'radial-gradient(circle, rgba(56, 189, 248, 0.3), rgba(0, 0, 0, 0.9))',
                border: '3px solid rgba(56, 189, 248, 0.8)',
                boxShadow: '0 0 60px rgba(56, 189, 248, 0.6)'
              }}
              animate={{
                boxShadow: [
                  '0 0 60px rgba(56, 189, 248, 0.6)',
                  '0 0 80px rgba(56, 189, 248, 0.8)',
                  '0 0 60px rgba(56, 189, 248, 0.6)'
                ]
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            >
              <img 
                src={orbImage} 
                alt="FIA Logo" 
                className="w-[130%] h-[130%] object-cover relative z-10"
                style={{
                  filter: 'brightness(1.3) contrast(1.2)'
                }}
              />
            </motion.div>

            {/* Partículas simples */}
            {[...Array(8)].map((_, i) => (
              <motion.div
                key={`particle-${i}`}
                className="absolute w-2 h-2 rounded-full bg-sky-400"
                style={{
                  boxShadow: '0 0 10px rgba(56, 189, 248, 1)',
                  left: '50%',
                  top: '50%'
                }}
                animate={{
                  x: [0, Math.cos(i * 45 * Math.PI / 180) * 100],
                  y: [0, Math.sin(i * 45 * Math.PI / 180) * 100],
                  opacity: [0, 1, 0]
                }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                  delay: i * 0.2,
                  ease: "easeOut"
                }}
              />
            ))}
          </motion.div>

          {/* Texto FIA */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="text-center mb-8"
          >
            <h1
              className="text-7xl font-black mb-3"
              style={{
                background: 'linear-gradient(135deg, #ffffff 0%, #38bdf8 50%, #1d4ed8 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}
            >
              FIA
            </h1>
            
            <p
              className="text-sm text-gray-300 font-light uppercase tracking-widest"
              style={{
                letterSpacing: '0.3em',
              }}
            >
              FIESTA INTELLIGENCE ASSISTANT
            </p>
          </motion.div>

          {/* Barra de progreso */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="w-full max-w-md"
          >
            <div className="relative h-2 bg-slate-800/50 rounded-full overflow-hidden">
              <motion.div
                className="absolute inset-y-0 left-0 rounded-full"
                style={{
                  background: 'linear-gradient(90deg, #38bdf8, #1d4ed8)',
                  boxShadow: '0 0 15px rgba(56, 189, 248, 0.6)',
                  width: `${progress}%`
                }}
              />
            </div>
            <div className="flex justify-between mt-2 text-xs text-gray-400 font-mono">
              <span>CARGANDO</span>
              <span>{Math.round(progress)}%</span>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
