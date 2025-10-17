import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import Icon from '@/components/ui/icon';
import { Badge } from '@/components/ui/badge';
import BloodDrops from '@/components/BloodDrops';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import AuthScreen from '@/components/AuthScreen';

const Index = () => {
  const [activeTab, setActiveTab] = useState<'home' | 'admins'>('home');
  const [vipActive, setVipActive] = useState(false);
  const [vipUsed, setVipUsed] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [showAuth, setShowAuth] = useState(true);
  const [username, setUsername] = useState('');
  const [showAdminPanel, setShowAdminPanel] = useState(false);
  const [adminPassword, setAdminPassword] = useState('');
  const [adminUnlocked, setAdminUnlocked] = useState(false);
  const [users, setUsers] = useState<Array<{username: string, vip: boolean, loginTime: number, sessionDuration: number}>>([]);

  useEffect(() => {
    const storedUsername = localStorage.getItem('username');
    const loginTime = localStorage.getItem('loginTime');
    
    if (storedUsername && loginTime) {
      setIsAuthenticated(true);
      setUsername(storedUsername);
      setShowAuth(false);
      updateUserSession(storedUsername);
    }

    const vipExpiry = localStorage.getItem('vipExpiry');
    const vipActivated = localStorage.getItem('vipActivated');
    
    if (vipActivated === 'true') {
      setVipUsed(true);
    }
    
    if (vipExpiry) {
      const expiryTime = parseInt(vipExpiry);
      const now = Date.now();
      
      if (now < expiryTime) {
        setVipActive(true);
        const timeout = setTimeout(() => {
          setVipActive(false);
          localStorage.removeItem('vipExpiry');
        }, expiryTime - now);
        
        return () => clearTimeout(timeout);
      } else {
        localStorage.removeItem('vipExpiry');
      }
    }

    loadUsers();
  }, []);

  const loadUsers = () => {
    const storedUsers = localStorage.getItem('siteUsers');
    if (storedUsers) {
      setUsers(JSON.parse(storedUsers));
    }
  };

  const updateUserSession = (user: string) => {
    const storedUsers = localStorage.getItem('siteUsers');
    const usersList = storedUsers ? JSON.parse(storedUsers) : [];
    const loginTime = parseInt(localStorage.getItem('loginTime') || Date.now().toString());
    const vipExpiry = localStorage.getItem('vipExpiry');
    const hasVip = vipExpiry ? Date.now() < parseInt(vipExpiry) : false;
    
    const existingUserIndex = usersList.findIndex((u: any) => u.username === user);
    
    if (existingUserIndex >= 0) {
      usersList[existingUserIndex].sessionDuration = Date.now() - loginTime;
      usersList[existingUserIndex].vip = hasVip;
    } else {
      usersList.push({
        username: user,
        vip: hasVip,
        loginTime: loginTime,
        sessionDuration: 0
      });
    }
    
    localStorage.setItem('siteUsers', JSON.stringify(usersList));
    setUsers(usersList);
  };

  const handleRegister = (newUsername: string) => {
    localStorage.setItem('username', newUsername);
    localStorage.setItem('loginTime', Date.now().toString());
    setIsAuthenticated(true);
    setUsername(newUsername);
    updateUserSession(newUsername);
  };

  const handleAdminUnlock = () => {
    if (adminPassword === 'denis222p') {
      setAdminUnlocked(true);
      loadUsers();
    } else {
      alert('Неверный пароль!');
    }
  };

  const formatDuration = (ms: number) => {
    const seconds = Math.floor(ms / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    
    if (hours > 0) return `${hours}ч ${minutes % 60}м`;
    if (minutes > 0) return `${minutes}м ${seconds % 60}с`;
    return `${seconds}с`;
  };

  const activateVip = () => {
    if (vipUsed) return;
    
    const twoDays = 2 * 24 * 60 * 60 * 1000;
    const expiryTime = Date.now() + twoDays;
    
    localStorage.setItem('vipExpiry', expiryTime.toString());
    localStorage.setItem('vipActivated', 'true');
    setVipActive(true);
    setVipUsed(true);
    updateUserSession(username);
  };

  if (!isAuthenticated) {
    return <AuthScreen onRegister={handleRegister} />;
  }

  return (
    <div className="min-h-screen bg-background text-foreground relative scanline">
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-20" 
        style={{ backgroundImage: 'url(https://cdn.poehali.dev/projects/8c395228-8ba9-4eb4-8f5a-3c8614bf9c9e/files/6f30ca28-62d2-466a-8fd7-25e42e5800af.jpg)' }}
      />
      <div className="static-noise absolute inset-0 pointer-events-none" />
      
      <nav className="border-b border-destructive/50 bg-card/95 backdrop-blur sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <div className="blood-drip relative w-16 h-16 overflow-hidden">
                  <img 
                    src="https://cdn.poehali.dev/projects/8c395228-8ba9-4eb4-8f5a-3c8614bf9c9e/files/5f933d73-0f84-4534-8cd9-1796950d33c9.jpg" 
                    alt="SCP Logo" 
                    className="w-full h-full object-cover relative z-10"
                  />
                  <div className="absolute inset-0 z-20 pointer-events-none">
                    <BloodDrops />
                  </div>
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h1 className="text-xl font-bold tracking-wider glitch">
                      SCP HiTOs
                    </h1>
                    {vipActive && (
                      <span className="text-sm font-bold uppercase animate-rainbow px-2 py-0.5 border border-purple-500 rounded">
                        VIP
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground uppercase tracking-widest">
                    Secure. Contain. Protect.
                  </p>
                </div>
              </div>
            </div>
            <div className="flex gap-2">
              <Button
                variant={activeTab === 'home' ? 'default' : 'outline'}
                onClick={() => setActiveTab('home')}
                className="uppercase tracking-wider"
              >
                <Icon name="Home" size={16} className="mr-2" />
                Главная
              </Button>
              <Button
                variant={activeTab === 'admins' ? 'default' : 'outline'}
                onClick={() => setActiveTab('admins')}
                className="uppercase tracking-wider"
              >
                <Icon name="Users" size={16} className="mr-2" />
                Администраторы
              </Button>
            </div>
          </div>
        </div>
      </nav>

      <main className="container mx-auto px-4 py-8 relative z-10">
        {activeTab === 'home' && (
          <div className="space-y-8 animate-fade-in">
            <Card className="border-destructive/30 bg-card/80 backdrop-blur">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <Badge variant="destructive" className="uppercase text-xs px-3 py-1">
                      Classified
                    </Badge>
                    <h2 className="text-2xl font-bold uppercase tracking-wider">
                      Уровень допуска: {vipActive ? (
                        <span className="text-purple-500 animate-pulse">O5-COUNCIL</span>
                      ) : (
                        <span className="redacted">████████</span>
                      )}
                    </h2>
                  </div>
                  <Icon name="Lock" size={24} className="text-destructive animate-flicker" />
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="border-l-4 border-destructive pl-4 py-2">
                  <h3 className="text-xl font-bold mb-2 uppercase">Внимание</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    {vipActive ? (
                      <>
                        <span className="text-green-500">✓ Полный доступ предоставлен.</span> Вы обладаете уровнем допуска O5-Council. 
                        Все материалы и протоколы Фонда доступны без ограничений. Срок действия статуса истекает через 2 дня.
                      </>
                    ) : (
                      <>
                        Доступ к данной информации ограничен персоналом с уровнем допуска 
                        <span className="redacted mx-1">███</span> и выше. Несанкционированный доступ 
                        карается согласно протоколу <span className="redacted">████-█</span>.
                      </>
                    )}
                  </p>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <Card className="border-border bg-secondary/20">
                    <CardContent className="p-6">
                      <div className="flex items-start gap-4">
                        <div className="w-12 h-12 bg-destructive/20 flex items-center justify-center shrink-0">
                          <Icon name="FileText" size={24} className="text-destructive" />
                        </div>
                        <div>
                          <h4 className="font-bold uppercase mb-2">Документы</h4>
                          <p className="text-sm text-muted-foreground">
                            {vipActive ? (
                              <span className="text-green-400">Доступ к 1,847 засекреченным файлам</span>
                            ) : (
                              <>Доступ к <span className="redacted">███</span> засекреченным файлам</>
                            )}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="border-border bg-secondary/20">
                    <CardContent className="p-6">
                      <div className="flex items-start gap-4">
                        <div className="w-12 h-12 bg-destructive/20 flex items-center justify-center shrink-0">
                          <Icon name="Database" size={24} className="text-destructive" />
                        </div>
                        <div>
                          <h4 className="font-bold uppercase mb-2">База данных</h4>
                          <p className="text-sm text-muted-foreground">
                            Каталог объектов SCP
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <a 
                    href="https://scpfoundation.net/lockdown-procedures?ysclid=mgthto24dr130428703" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="block"
                  >
                    <Card className="border-border bg-secondary/20 hover:bg-secondary/40 transition-all cursor-pointer hover:border-destructive/50">
                      <CardContent className="p-6">
                        <div className="flex items-start gap-4">
                          <div className="w-12 h-12 bg-destructive/20 flex items-center justify-center shrink-0">
                            <Icon name="AlertTriangle" size={24} className="text-destructive" />
                          </div>
                          <div>
                            <h4 className="font-bold uppercase mb-2 flex items-center gap-2">
                              Протоколы
                              <Icon name="ExternalLink" size={14} className="text-destructive" />
                            </h4>
                            <p className="text-sm text-muted-foreground">
                              Процедуры содержания
                            </p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </a>

                  <a 
                    href="https://t.me/+EKpJvUxFHgRhYzZi" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="block"
                  >
                    <Card className="border-border bg-secondary/20 hover:bg-secondary/40 transition-all cursor-pointer hover:border-destructive/50">
                      <CardContent className="p-6">
                        <div className="flex items-start gap-4">
                          <div className="w-12 h-12 bg-destructive/20 flex items-center justify-center shrink-0">
                            <Icon name="Send" size={24} className="text-destructive" />
                          </div>
                          <div>
                            <h4 className="font-bold uppercase mb-2 flex items-center gap-2">
                              Telegram
                              <Icon name="ExternalLink" size={14} className="text-destructive" />
                            </h4>
                            <p className="text-sm text-muted-foreground">
                              Канал фонда
                            </p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </a>
                </div>

                {vipActive && (
                  <div className="bg-purple-900/20 border border-purple-500 p-4 mt-6 animate-pulse">
                    <div className="flex items-start gap-3">
                      <Icon name="Crown" size={20} className="text-purple-500 shrink-0 mt-1" />
                      <div>
                        <h4 className="font-bold uppercase text-sm mb-1 text-purple-400">VIP ПРИВИЛЕГИИ АКТИВНЫ</h4>
                        <p className="text-xs text-purple-300">
                          • Полный доступ ко всем секретным файлам<br/>
                          • Уровень допуска O5-Council<br/>
                          • Расшифрованные документы<br/>
                          • Специальный статус в системе
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {!vipActive && (
                  <div className="bg-destructive/10 border border-destructive p-4 mt-6">
                    <div className="flex items-start gap-3">
                      <Icon name="AlertCircle" size={20} className="text-destructive shrink-0 mt-1" />
                      <div>
                        <h4 className="font-bold uppercase text-sm mb-1">Предупреждение системы</h4>
                        <p className="text-xs text-muted-foreground">
                          Обнаружена попытка несанкционированного доступа к файлу 
                          <span className="redacted mx-1">████-███</span>. Система безопасности активирована.
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            <div className="border-t border-destructive/30 pt-6 text-center">
              <p className="text-xs text-muted-foreground uppercase tracking-widest">
                Foundation <span 
                  onClick={activateVip} 
                  className="cursor-default hover:text-muted-foreground"
                  style={{ userSelect: 'none' }}
                >Internal</span> Network • Level <span className="redacted">█</span> Clearance Required
              </p>
            </div>
          </div>
        )}

        {activeTab === 'admins' && (
          <div className="space-y-8 animate-fade-in">
            <Card className="border-destructive/30 bg-card/30 backdrop-blur">
              <CardHeader>
                <div className="flex items-center gap-4">
                  <Badge variant="destructive" className="uppercase text-xs px-3 py-1">
                    Restricted Access
                  </Badge>
                  <h2 className="text-2xl font-bold uppercase tracking-wider">
                    Администраторы фонда
                  </h2>
                </div>
              </CardHeader>
              <CardContent>
                <div className="max-w-2xl mx-auto">
                  <Card className="border-destructive/50 bg-secondary/20 hover:bg-secondary/40 transition-colors">
                    <CardContent className="p-6">
                      <div className="flex items-start gap-6">
                        <div className="w-20 h-20 bg-destructive/20 border-2 border-destructive flex items-center justify-center shrink-0">
                          <Icon name="User" size={40} className="text-destructive" />
                        </div>
                        <div className="flex-1 space-y-3">
                          <div>
                            <div className="flex items-center gap-3 mb-2">
                              <h3 className="text-xl font-bold uppercase">anal_genius</h3>
                              <Badge className="bg-destructive text-primary-foreground uppercase text-xs">
                                Основатель
                              </Badge>
                            </div>
                            <p className="text-sm text-muted-foreground">
                              Уровень допуска: <span className="text-destructive font-bold">O5-█</span>
                            </p>
                          </div>
                          
                          <div className="grid grid-cols-2 gap-4 pt-3 border-t border-border">
                            <div>
                              <p className="text-xs text-muted-foreground uppercase mb-1">Статус</p>
                              <div className="flex items-center gap-2">
                                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                                <span className="text-sm font-mono">Активен</span>
                              </div>
                            </div>
                            <div>
                              <p className="text-xs text-muted-foreground uppercase mb-1">Полномочия</p>
                              <span className="text-sm font-mono">Полный доступ</span>
                            </div>
                          </div>

                          <div className="pt-3">
                            <p className="text-xs text-muted-foreground uppercase mb-2">Доступные протоколы</p>
                            <div className="flex flex-wrap gap-2">
                              <Badge variant="outline" className="text-xs">
                                <Icon name="Shield" size={12} className="mr-1" />
                                Протокол-Alpha
                              </Badge>
                              <Badge variant="outline" className="text-xs">
                                <Icon name="Lock" size={12} className="mr-1" />
                                Код-Омега
                              </Badge>
                              <Badge variant="outline" className="text-xs">
                                <Icon name="Key" size={12} className="mr-1" />
                                Clearance-5
                              </Badge>
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <div className="mt-6 bg-destructive/10 border border-destructive p-4">
                    <div className="flex items-start gap-3">
                      <Icon name="Info" size={20} className="text-destructive shrink-0 mt-1" />
                      <div>
                        <h4 className="font-bold uppercase text-sm mb-1">Информация</h4>
                        <p className="text-xs text-muted-foreground">
                          Администратор с уровнем O5 имеет неограниченный доступ ко всем материалам 
                          и протоколам Фонда. Попытка персонификации карается 
                          <span className="redacted mx-1">████████████</span>.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="border-t border-destructive/30 pt-6">
              <div className="flex justify-between items-center">
                <p className="text-xs text-muted-foreground uppercase tracking-widest">
                  Administrator Registry • O5 Council Approved
                </p>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowAdminPanel(true)}
                  className="text-destructive hover:text-destructive hover:bg-destructive/10"
                >
                  <Icon name="Lock" size={16} />
                </Button>
              </div>
            </div>
          </div>
        )}
      </main>

      <footer className="border-t border-destructive/30 mt-12 py-6 bg-card/50 backdrop-blur">
        <div className="container mx-auto px-4 text-center">
          <p className="text-xs text-muted-foreground uppercase tracking-widest mb-2">
            SCP Foundation Internal System v<span className="redacted">█.█.█</span>
          </p>
          <p className="text-xs text-muted-foreground/70">
            Все данные классифицированы • Несанкционированный доступ запрещен
          </p>
        </div>
      </footer>

      <Dialog open={showAdminPanel} onOpenChange={setShowAdminPanel}>
        <DialogContent className="border-destructive/30 bg-card/95 backdrop-blur">
          <DialogHeader>
            <DialogTitle className="uppercase tracking-wider flex items-center gap-2">
              <Icon name="Shield" size={20} className="text-destructive" />
              Панель основателя
            </DialogTitle>
          </DialogHeader>
          
          {!adminUnlocked ? (
            <div className="space-y-4">
              <div className="border-l-4 border-destructive pl-4 py-2">
                <p className="text-sm text-muted-foreground">
                  Требуется пароль для доступа к панели управления.
                </p>
              </div>
              <Input
                type="password"
                placeholder="Введите пароль..."
                value={adminPassword}
                onChange={(e) => setAdminPassword(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleAdminUnlock()}
                className="bg-secondary/50 border-destructive/30"
              />
              <Button 
                onClick={handleAdminUnlock}
                className="w-full"
                variant="destructive"
              >
                <Icon name="Unlock" size={16} className="mr-2" />
                Разблокировать
              </Button>
            </div>
          ) : (
            <div className="space-y-4 max-h-96 overflow-y-auto">
              <div className="border-l-4 border-purple-500 pl-4 py-2 bg-purple-900/20">
                <h3 className="font-bold uppercase text-sm mb-1 text-purple-400">Статистика пользователей</h3>
                <p className="text-xs text-muted-foreground">
                  Всего зарегистрировано: {users.length}
                </p>
              </div>

              <div className="space-y-3">
                {users.map((user, index) => (
                  <Card key={index} className="border-border bg-secondary/30">
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex items-start gap-3 flex-1">
                          <div className="w-10 h-10 bg-destructive/20 flex items-center justify-center shrink-0 rounded">
                            <Icon name="User" size={20} className="text-destructive" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <h4 className="font-bold text-sm truncate">{user.username}</h4>
                            <div className="flex flex-wrap gap-2 mt-2">
                              <Badge 
                                variant={user.vip ? "default" : "outline"}
                                className={user.vip ? "bg-purple-500" : ""}
                              >
                                {user.vip ? "VIP" : "Обычный"}
                              </Badge>
                              <Badge variant="outline" className="text-xs">
                                <Icon name="Clock" size={12} className="mr-1" />
                                {formatDuration(user.sessionDuration)}
                              </Badge>
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Index;