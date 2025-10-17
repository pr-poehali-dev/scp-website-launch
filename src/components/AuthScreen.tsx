import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import Icon from '@/components/ui/icon';
import { Input } from '@/components/ui/input';
import BloodDrops from './BloodDrops';

interface AuthScreenProps {
  onRegister: (username: string, isMaster?: boolean) => void;
}

const AuthScreen = ({ onRegister }: AuthScreenProps) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [requiresPassword, setRequiresPassword] = useState(false);

  const handleUsernameCheck = () => {
    if (username.trim().length < 3) {
      alert('Ник должен быть минимум 3 символа');
      return;
    }
    
    if (username.toLowerCase() === 'anal_genius') {
      setRequiresPassword(true);
    } else {
      onRegister(username);
    }
  };

  const handlePasswordSubmit = () => {
    if (password === 'denis2010') {
      onRegister(username, true);
    } else {
      alert('Неверный пароль!');
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground flex items-center justify-center relative scanline">
      <div className="static-noise absolute inset-0 pointer-events-none" />
      <Card className="w-full max-w-md border-destructive/30 bg-card/90 backdrop-blur relative z-10">
        <CardHeader>
          <div className="flex flex-col items-center gap-4">
            <div className="blood-drip relative w-20 h-20 overflow-hidden">
              <img 
                src="https://cdn.poehali.dev/projects/8c395228-8ba9-4eb4-8f5a-3c8614bf9c9e/files/5f933d73-0f84-4534-8cd9-1796950d33c9.jpg" 
                alt="SCP Logo" 
                className="w-full h-full object-cover relative z-10"
              />
              <div className="absolute inset-0 z-20 pointer-events-none">
                <BloodDrops />
              </div>
            </div>
            <div className="text-center">
              <h1 className="text-2xl font-bold tracking-wider glitch mb-2">SCP HiTOs</h1>
              <p className="text-xs text-muted-foreground uppercase tracking-widest">Secure. Contain. Protect.</p>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="border-l-4 border-destructive pl-4 py-2">
            <h3 className="font-bold uppercase mb-2 text-sm">Авторизация требуется</h3>
            <p className="text-xs text-muted-foreground">
              Для доступа к материалам Фонда необходимо зарегистрироваться.
            </p>
          </div>
          
          <div className="space-y-3">
            {!requiresPassword ? (
              <>
                <div>
                  <label className="text-xs uppercase text-muted-foreground mb-2 block">Введите ник</label>
                  <Input
                    type="text"
                    placeholder="Ваш ник..."
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleUsernameCheck()}
                    className="bg-secondary/50 border-destructive/30"
                  />
                </div>
                
                <Button 
                  onClick={handleUsernameCheck}
                  className="w-full uppercase tracking-wider"
                  variant="destructive"
                >
                  <Icon name="ShieldCheck" size={16} className="mr-2" />
                  Зарегистрироваться
                </Button>
              </>
            ) : (
              <>
                <div className="border-l-4 border-blue-500 pl-4 py-2 bg-blue-900/20">
                  <h3 className="font-bold uppercase mb-1 text-sm text-blue-400">O5 Уровень доступа</h3>
                  <p className="text-xs text-muted-foreground">
                    Для входа в аккаунт <span className="font-bold text-foreground">{username}</span> требуется пароль.
                  </p>
                </div>
                
                <div>
                  <label className="text-xs uppercase text-muted-foreground mb-2 block">Введите пароль</label>
                  <Input
                    type="password"
                    placeholder="Пароль..."
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handlePasswordSubmit()}
                    className="bg-secondary/50 border-blue-500/50"
                    autoFocus
                  />
                </div>
                
                <div className="flex gap-2">
                  <Button 
                    onClick={() => {
                      setRequiresPassword(false);
                      setPassword('');
                    }}
                    className="flex-1 uppercase tracking-wider"
                    variant="outline"
                  >
                    <Icon name="ArrowLeft" size={16} className="mr-2" />
                    Назад
                  </Button>
                  <Button 
                    onClick={handlePasswordSubmit}
                    className="flex-1 uppercase tracking-wider bg-blue-600 hover:bg-blue-700"
                  >
                    <Icon name="Unlock" size={16} className="mr-2" />
                    Войти
                  </Button>
                </div>
              </>
            )}
          </div>

          <div className="bg-destructive/10 border border-destructive p-3 mt-4">
            <div className="flex items-start gap-2">
              <Icon name="AlertTriangle" size={16} className="text-destructive shrink-0 mt-0.5" />
              <p className="text-xs text-muted-foreground">
                Регистрация обязательна. Минимум 3 символа.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AuthScreen;