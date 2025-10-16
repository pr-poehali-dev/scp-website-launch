import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import Icon from '@/components/ui/icon';
import { Input } from '@/components/ui/input';
import BloodDrops from './BloodDrops';

interface AuthScreenProps {
  onRegister: (username: string) => void;
}

const AuthScreen = ({ onRegister }: AuthScreenProps) => {
  const [username, setUsername] = useState('');

  const handleRegister = () => {
    if (username.trim().length < 3) {
      alert('Ник должен быть минимум 3 символа');
      return;
    }
    onRegister(username);
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
            <div>
              <label className="text-xs uppercase text-muted-foreground mb-2 block">Введите ник</label>
              <Input
                type="text"
                placeholder="Ваш ник..."
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleRegister()}
                className="bg-secondary/50 border-destructive/30"
              />
            </div>
            
            <Button 
              onClick={handleRegister}
              className="w-full uppercase tracking-wider"
              variant="destructive"
            >
              <Icon name="ShieldCheck" size={16} className="mr-2" />
              Зарегистрироваться
            </Button>
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
