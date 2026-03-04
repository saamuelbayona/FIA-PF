import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import orbImage from '../assets/pollo_fiesta_FIA.png';

export default function SplashScreen({ onComplete }) {
  const [progress, setProgress] = useState(0);
  const [started, setStarted] = useState(false);
  const [audioContext, setAudioContext] = useState(null);

  useEffect(() => {
    if (!started) return;

    playSound();

    const progressInterval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(progressInterval);
          setTimeout(() => onComplete(), 300);
          return 100;
        }
        return prev + 3.33;
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
      
      const impact = ctx.createOscillator();
      const impactGain = ctx.createGain();
      const impactFilter = ctx.createBiquadFilter();
      
      impact.type = 'sine';
      impact.frequency.value = 150;
      
      impactFilter.type = 'lowpass';
      impactFilter.frequency.value = 400;
      
      impactGain.gain.setValueAtTime(0.25, now);
      impactGain.gain.exponentialRampToValueAtTime(0.001, now + 0.15);
      
      impact.connect(impactFilter);
      impactFilter.connect(impactGain);
      impactGain.connect(ctx.destination);
      impact.start(now);
      impact.stop(now + 0.15);
      
      const mainTone = ctx.createOscillator();
      const mainGain = ctx.createGain();
      const mainFilter = ctx.createBiquadFilter();
      
      mainTone.type = 'sine';
      mainTone.frequency.value = 440;
      
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
      
    } catch (error) {
      console.error('Error al reproducir sonido:', error);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center overflow-hidden bg-gradient-to-br from-slate-950 via-slate-900 to-black">
      
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

      {started && (
        <div className="relative z-10 flex flex-col items-center w-full max-w-2xl px-8">
          
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5, type: "spring" }}
            className="relative mb-12 w-64 h-64 flex items-center justify-center"
          >
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
