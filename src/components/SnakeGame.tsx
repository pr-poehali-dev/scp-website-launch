import { useState, useEffect, useCallback } from 'react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

interface Position {
  x: number;
  y: number;
}

interface SnakeGameProps {
  open: boolean;
  onClose: () => void;
}

const GRID_SIZE = 20;
const CELL_SIZE = 20;
const INITIAL_SPEED = 150;

const SnakeGame = ({ open, onClose }: SnakeGameProps) => {
  const [snake, setSnake] = useState<Position[]>([{ x: 10, y: 10 }]);
  const [food, setFood] = useState<Position>({ x: 15, y: 15 });
  const [direction, setDirection] = useState<'UP' | 'DOWN' | 'LEFT' | 'RIGHT'>('RIGHT');
  const [nextDirection, setNextDirection] = useState<'UP' | 'DOWN' | 'LEFT' | 'RIGHT'>('RIGHT');
  const [gameOver, setGameOver] = useState(false);
  const [score, setScore] = useState(0);
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
    const initialSnake = [{ x: 10, y: 10 }];
    setSnake(initialSnake);
    setFood(generateFood(initialSnake));
    setDirection('RIGHT');
    setNextDirection('RIGHT');
    setGameOver(false);
    setScore(0);
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
          break;
        case 'ArrowDown':
        case 's':
        case 'S':
          if (direction !== 'UP') setNextDirection('DOWN');
          break;
        case 'ArrowLeft':
        case 'a':
        case 'A':
          if (direction !== 'RIGHT') setNextDirection('LEFT');
          break;
        case 'ArrowRight':
        case 'd':
        case 'D':
          if (direction !== 'LEFT') setNextDirection('RIGHT');
          break;
        case 'r':
        case 'R':
          if (gameOver) resetGame();
          break;
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [direction, gameStarted, gameOver]);

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

        // Проверка столкновения со стенами
        if (newHead.x < 0 || newHead.x >= GRID_SIZE || newHead.y < 0 || newHead.y >= GRID_SIZE) {
          setGameOver(true);
          return prevSnake;
        }

        // Проверка столкновения с самим собой
        if (prevSnake.some(segment => segment.x === newHead.x && segment.y === newHead.y)) {
          setGameOver(true);
          return prevSnake;
        }

        const newSnake = [newHead, ...prevSnake];

        // Проверка поедания еды
        if (newHead.x === food.x && newHead.y === food.y) {
          setScore(prev => prev + 10);
          setFood(generateFood(newSnake));
          // Увеличиваем скорость каждые 5 очков
          if ((score + 10) % 50 === 0 && speed > 50) {
            setSpeed(prev => Math.max(50, prev - 10));
          }
          return newSnake;
        }

        // Убираем хвост если не съели еду
        newSnake.pop();
        return newSnake;
      });
    };

    const interval = setInterval(moveSnake, speed);
    return () => clearInterval(interval);
  }, [gameStarted, gameOver, nextDirection, food, speed, score, generateFood]);

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-[500px] bg-black border-2 border-green-500 p-6">
        <div className="flex flex-col items-center gap-4">
          {/* Заголовок в стиле SCP */}
          <div className="text-center font-mono">
            <h2 className="text-2xl font-bold text-green-500 mb-1">
              ═══ SNAKE GAME ═══
            </h2>
            <p className="text-green-500 text-sm">
              [SCP FOUNDATION TERMINAL]
            </p>
          </div>

          {/* Счёт */}
          <div className="w-full bg-green-950 border border-green-500 p-2 font-mono text-green-500 text-center">
            SCORE: {score.toString().padStart(4, '0')}
          </div>

          {/* Игровое поле */}
          <div 
            className="relative border-2 border-green-500 bg-black"
            style={{ 
              width: GRID_SIZE * CELL_SIZE,
              height: GRID_SIZE * CELL_SIZE,
            }}
          >
            {/* Сетка */}
            <div className="absolute inset-0 opacity-20">
              {Array.from({ length: GRID_SIZE }).map((_, y) =>
                Array.from({ length: GRID_SIZE }).map((_, x) => (
                  <div
                    key={`${x}-${y}`}
                    className="absolute border border-green-900"
                    style={{
                      left: x * CELL_SIZE,
                      top: y * CELL_SIZE,
                      width: CELL_SIZE,
                      height: CELL_SIZE,
                    }}
                  />
                ))
              )}
            </div>

            {/* Змейка */}
            {snake.map((segment, index) => (
              <div
                key={index}
                className="absolute transition-all duration-75"
                style={{
                  left: segment.x * CELL_SIZE,
                  top: segment.y * CELL_SIZE,
                  width: CELL_SIZE - 2,
                  height: CELL_SIZE - 2,
                  backgroundColor: index === 0 ? '#00ff00' : '#00cc00',
                  border: '1px solid #00ff00',
                  boxShadow: index === 0 ? '0 0 10px #00ff00' : 'none',
                }}
              />
            ))}

            {/* Еда */}
            <div
              className="absolute animate-pulse"
              style={{
                left: food.x * CELL_SIZE,
                top: food.y * CELL_SIZE,
                width: CELL_SIZE - 2,
                height: CELL_SIZE - 2,
                backgroundColor: '#ff0000',
                border: '1px solid #ff0000',
                boxShadow: '0 0 15px #ff0000',
                borderRadius: '50%',
              }}
            />

            {/* Оверлей при начале игры */}
            {!gameStarted && !gameOver && (
              <div className="absolute inset-0 bg-black bg-opacity-80 flex items-center justify-center">
                <div className="text-center font-mono text-green-500">
                  <p className="text-lg mb-2">PRESS ANY KEY</p>
                  <p className="text-sm">TO START</p>
                </div>
              </div>
            )}

            {/* Оверлей Game Over */}
            {gameOver && (
              <div className="absolute inset-0 bg-black bg-opacity-90 flex items-center justify-center">
                <div className="text-center font-mono text-green-500">
                  <p className="text-2xl mb-2 animate-pulse">GAME OVER</p>
                  <p className="text-lg mb-4">SCORE: {score}</p>
                  <p className="text-sm">PRESS R TO RESTART</p>
                </div>
              </div>
            )}
          </div>

          {/* Инструкция */}
          <div className="w-full bg-green-950 border border-green-500 p-3 font-mono text-green-500 text-xs">
            <div className="grid grid-cols-2 gap-2">
              <div>
                <p>CONTROLS:</p>
                <p>↑ W - UP</p>
                <p>↓ S - DOWN</p>
              </div>
              <div>
                <p>&nbsp;</p>
                <p>← A - LEFT</p>
                <p>→ D - RIGHT</p>
              </div>
            </div>
            <p className="mt-2">R - RESTART</p>
          </div>

          {/* Кнопка закрытия */}
          <Button
            onClick={onClose}
            className="w-full bg-red-900 hover:bg-red-800 text-white border border-red-500 font-mono"
          >
            [EXIT TERMINAL]
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default SnakeGame;
