import { useState, useEffect, useCallback } from 'react';
import { Dialog, DialogContent } from '@/components/ui/dialog';

interface Position {
  x: number;
  y: number;
}

interface SnakeGameProps {
  open: boolean;
  onClose: () => void;
}

const GRID_SIZE = 30;
const CELL_SIZE = 10;
const INITIAL_SPEED = 200;

const SnakeGame = ({ open, onClose }: SnakeGameProps) => {
  const [snake, setSnake] = useState<Position[]>([
    { x: 5, y: 5 },
    { x: 4, y: 5 },
    { x: 3, y: 5 },
    { x: 2, y: 5 }
  ]);
  const [food, setFood] = useState<Position>({ x: 15, y: 8 });
  const [direction, setDirection] = useState<'UP' | 'DOWN' | 'LEFT' | 'RIGHT'>('RIGHT');
  const [nextDirection, setNextDirection] = useState<'UP' | 'DOWN' | 'LEFT' | 'RIGHT'>('RIGHT');
  const [gameOver, setGameOver] = useState(false);
  const [score, setScore] = useState(1);
  const [gameStarted, setGameStarted] = useState(false);
  const [speed, setSpeed] = useState(INITIAL_SPEED);

  const generateFood = useCallback((currentSnake: Position[]) => {
    let newFood: Position;
    do {
      newFood = {
        x: Math.floor(Math.random() * GRID_SIZE),
        y: Math.floor(Math.random() * GRID_SIZE),
      };
    } while (currentSnake.some(segment => segment.x === newFood.x && segment.y === newFood.y));
    return newFood;
  }, []);

  const resetGame = () => {
    const initialSnake = [
      { x: 5, y: 5 },
      { x: 4, y: 5 },
      { x: 3, y: 5 },
      { x: 2, y: 5 }
    ];
    setSnake(initialSnake);
    setFood(generateFood(initialSnake));
    setDirection('RIGHT');
    setNextDirection('RIGHT');
    setGameOver(false);
    setScore(1);
    setGameStarted(false);
    setSpeed(INITIAL_SPEED);
  };

  useEffect(() => {
    if (!open) {
      resetGame();
    }
  }, [open]);

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (!gameStarted && !gameOver) {
        setGameStarted(true);
      }

      switch (e.key) {
        case 'ArrowUp':
        case 'w':
        case 'W':
          if (direction !== 'DOWN') setNextDirection('UP');
          e.preventDefault();
          break;
        case 'ArrowDown':
        case 's':
        case 'S':
          if (direction !== 'UP') setNextDirection('DOWN');
          e.preventDefault();
          break;
        case 'ArrowLeft':
        case 'a':
        case 'A':
          if (direction !== 'RIGHT') setNextDirection('LEFT');
          e.preventDefault();
          break;
        case 'ArrowRight':
        case 'd':
        case 'D':
          if (direction !== 'LEFT') setNextDirection('RIGHT');
          e.preventDefault();
          break;
        case 'r':
        case 'R':
          if (gameOver) resetGame();
          break;
        case 'Escape':
          onClose();
          break;
      }
    };

    if (open) {
      window.addEventListener('keydown', handleKeyPress);
      return () => window.removeEventListener('keydown', handleKeyPress);
    }
  }, [direction, gameStarted, gameOver, open, onClose]);

  useEffect(() => {
    if (!gameStarted || gameOver) return;

    const moveSnake = () => {
      setDirection(nextDirection);
      
      setSnake(prevSnake => {
        const head = prevSnake[0];
        let newHead: Position;

        switch (nextDirection) {
          case 'UP':
            newHead = { x: head.x, y: head.y - 1 };
            break;
          case 'DOWN':
            newHead = { x: head.x, y: head.y + 1 };
            break;
          case 'LEFT':
            newHead = { x: head.x - 1, y: head.y };
            break;
          case 'RIGHT':
            newHead = { x: head.x + 1, y: head.y };
            break;
        }

        if (newHead.x < 0 || newHead.x >= GRID_SIZE || newHead.y < 0 || newHead.y >= GRID_SIZE) {
          setGameOver(true);
          return prevSnake;
        }

        if (prevSnake.some(segment => segment.x === newHead.x && segment.y === newHead.y)) {
          setGameOver(true);
          return prevSnake;
        }

        const newSnake = [newHead, ...prevSnake];

        if (newHead.x === food.x && newHead.y === food.y) {
          setScore(prev => prev + 1);
          setFood(generateFood(newSnake));
          if ((score + 1) % 5 === 0 && speed > 100) {
            setSpeed(prev => Math.max(100, prev - 15));
          }
          return newSnake;
        }

        newSnake.pop();
        return newSnake;
      });
    };

    const interval = setInterval(moveSnake, speed);
    return () => clearInterval(interval);
  }, [gameStarted, gameOver, nextDirection, food, speed, score, generateFood]);

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-[700px] bg-black border-none p-0 overflow-hidden">
        <div className="relative p-8" style={{
          background: 'linear-gradient(180deg, #1a1a1a 0%, #0a0a0a 100%)',
        }}>
          {/* Корпус Nokia */}
          <div className="relative mx-auto p-6 rounded-3xl shadow-2xl" style={{
            width: '560px',
            background: 'linear-gradient(145deg, #2a2a2a, #1a1a1a)',
            boxShadow: '0 20px 60px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.1)',
          }}>
            {/* Экран Nokia с характерной желто-зеленой подсветкой */}
            <div 
              className="relative mx-auto rounded-lg overflow-hidden"
              style={{
                width: '500px',
                height: '340px',
                background: 'linear-gradient(145deg, #a4b82e, #8a9e1e)',
                boxShadow: 'inset 0 2px 10px rgba(0,0,0,0.3), 0 0 30px rgba(164, 184, 46, 0.4)',
                border: '3px solid #3a3a3a',
              }}
            >
              {/* Градиент экрана для эффекта LCD */}
              <div className="absolute inset-0" style={{
                background: 'radial-gradient(ellipse at center, transparent 0%, rgba(0,0,0,0.1) 70%)',
              }} />

              {/* Счёт в правом верхнем углу */}
              <div 
                className="absolute top-3 right-3 px-3 py-1 font-bold"
                style={{
                  fontSize: '24px',
                  color: '#1a1a1a',
                  textShadow: '1px 1px 0 rgba(0,0,0,0.2)',
                  fontFamily: 'monospace',
                  letterSpacing: '2px',
                }}
              >
                {score.toString().padStart(2, '0')}
              </div>

              {/* Игровое поле */}
              <div 
                className="absolute"
                style={{ 
                  left: '50%',
                  top: '50%',
                  transform: 'translate(-50%, -50%)',
                  width: GRID_SIZE * CELL_SIZE,
                  height: GRID_SIZE * CELL_SIZE,
                }}
              >
                {/* Змейка - пиксельная как в Nokia */}
                {snake.map((segment, index) => {
                  const prevSegment = index > 0 ? snake[index - 1] : null;
                  const nextSegment = index < snake.length - 1 ? snake[index + 1] : null;
                  
                  // Определяем направление сегмента
                  const isHorizontal = (prevSegment && prevSegment.y === segment.y) || 
                                      (nextSegment && nextSegment.y === segment.y);
                  
                  return (
                    <div
                      key={index}
                      className="absolute"
                      style={{
                        left: segment.x * CELL_SIZE,
                        top: segment.y * CELL_SIZE,
                        width: CELL_SIZE,
                        height: CELL_SIZE,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      {/* Сегмент змейки с зубчиками */}
                      <div style={{
                        width: isHorizontal ? '10px' : '8px',
                        height: isHorizontal ? '8px' : '10px',
                        backgroundColor: '#1a1a1a',
                        position: 'relative',
                      }}>
                        {/* Зубчики по краям */}
                        {isHorizontal ? (
                          <>
                            {/* Верхний зубчик */}
                            <div style={{
                              position: 'absolute',
                              top: '-1px',
                              left: '3px',
                              width: '4px',
                              height: '1px',
                              backgroundColor: '#1a1a1a',
                            }} />
                            {/* Нижний зубчик */}
                            <div style={{
                              position: 'absolute',
                              bottom: '-1px',
                              left: '3px',
                              width: '4px',
                              height: '1px',
                              backgroundColor: '#1a1a1a',
                            }} />
                          </>
                        ) : (
                          <>
                            {/* Левый зубчик */}
                            <div style={{
                              position: 'absolute',
                              left: '-1px',
                              top: '3px',
                              width: '1px',
                              height: '4px',
                              backgroundColor: '#1a1a1a',
                            }} />
                            {/* Правый зубчик */}
                            <div style={{
                              position: 'absolute',
                              right: '-1px',
                              top: '3px',
                              width: '1px',
                              height: '4px',
                              backgroundColor: '#1a1a1a',
                            }} />
                          </>
                        )}
                      </div>
                    </div>
                  );
                })}

                {/* Еда - крестик как в оригинале */}
                <div
                  className="absolute"
                  style={{
                    left: food.x * CELL_SIZE,
                    top: food.y * CELL_SIZE,
                    width: CELL_SIZE,
                    height: CELL_SIZE,
                  }}
                >
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div style={{
                      width: '8px',
                      height: '8px',
                      position: 'relative',
                    }}>
                      <div style={{
                        position: 'absolute',
                        left: '3px',
                        top: '0',
                        width: '2px',
                        height: '8px',
                        backgroundColor: '#1a1a1a',
                      }} />
                      <div style={{
                        position: 'absolute',
                        left: '0',
                        top: '3px',
                        width: '8px',
                        height: '2px',
                        backgroundColor: '#1a1a1a',
                      }} />
                    </div>
                  </div>
                </div>

                {/* Оверлей при начале игры */}
                {!gameStarted && !gameOver && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div 
                      className="text-center font-bold animate-pulse"
                      style={{
                        fontSize: '16px',
                        color: '#1a1a1a',
                        textShadow: '1px 1px 0 rgba(0,0,0,0.2)',
                        fontFamily: 'monospace',
                      }}
                    >
                      PRESS START
                    </div>
                  </div>
                )}

                {/* Оверлей Game Over */}
                {gameOver && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div 
                      className="text-center font-bold"
                      style={{
                        fontSize: '16px',
                        color: '#1a1a1a',
                        textShadow: '1px 1px 0 rgba(0,0,0,0.2)',
                        fontFamily: 'monospace',
                      }}
                    >
                      <div className="animate-pulse mb-2">GAME OVER</div>
                      <div className="text-sm">PRESS R</div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Кнопки управления Nokia */}
            <div className="mt-6 flex flex-col items-center gap-3">
              {/* Верхняя кнопка */}
              <button
                onClick={() => {
                  if (!gameStarted && !gameOver) setGameStarted(true);
                  if (direction !== 'DOWN') setNextDirection('UP');
                }}
                className="w-12 h-12 rounded-lg transition-all active:scale-95"
                style={{
                  background: 'linear-gradient(145deg, #3a3a3a, #2a2a2a)',
                  boxShadow: '0 4px 8px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.1)',
                }}
              >
                <span className="text-gray-400 text-xl">▲</span>
              </button>
              
              {/* Средние кнопки */}
              <div className="flex gap-3">
                <button
                  onClick={() => {
                    if (!gameStarted && !gameOver) setGameStarted(true);
                    if (direction !== 'RIGHT') setNextDirection('LEFT');
                  }}
                  className="w-12 h-12 rounded-lg transition-all active:scale-95"
                  style={{
                    background: 'linear-gradient(145deg, #3a3a3a, #2a2a2a)',
                    boxShadow: '0 4px 8px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.1)',
                  }}
                >
                  <span className="text-gray-400 text-xl">◄</span>
                </button>
                
                <button
                  onClick={() => {
                    if (!gameStarted && !gameOver) setGameStarted(true);
                    if (direction !== 'LEFT') setNextDirection('RIGHT');
                  }}
                  className="w-12 h-12 rounded-lg transition-all active:scale-95"
                  style={{
                    background: 'linear-gradient(145deg, #3a3a3a, #2a2a2a)',
                    boxShadow: '0 4px 8px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.1)',
                  }}
                >
                  <span className="text-gray-400 text-xl">►</span>
                </button>
              </div>
              
              {/* Нижняя кнопка */}
              <button
                onClick={() => {
                  if (!gameStarted && !gameOver) setGameStarted(true);
                  if (direction !== 'UP') setNextDirection('DOWN');
                }}
                className="w-12 h-12 rounded-lg transition-all active:scale-95"
                style={{
                  background: 'linear-gradient(145deg, #3a3a3a, #2a2a2a)',
                  boxShadow: '0 4px 8px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.1)',
                }}
              >
                <span className="text-gray-400 text-xl">▼</span>
              </button>
            </div>

            {/* Нижний ряд кнопок */}
            <div className="mt-6 flex justify-center gap-4">
              <button
                onClick={resetGame}
                className="px-6 py-2 rounded-lg text-sm font-bold text-gray-300 transition-all active:scale-95"
                style={{
                  background: 'linear-gradient(145deg, #3a3a3a, #2a2a2a)',
                  boxShadow: '0 4px 8px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.1)',
                }}
              >
                RESTART
              </button>
              <button
                onClick={onClose}
                className="px-6 py-2 rounded-lg text-sm font-bold text-gray-300 transition-all active:scale-95"
                style={{
                  background: 'linear-gradient(145deg, #3a3a3a, #2a2a2a)',
                  boxShadow: '0 4px 8px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.1)',
                }}
              >
                EXIT
              </button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default SnakeGame;