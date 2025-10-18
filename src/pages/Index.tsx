import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import Icon from '@/components/ui/icon';
import { Badge } from '@/components/ui/badge';
import BloodDrops from '@/components/BloodDrops';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import AuthScreen from '@/components/AuthScreen';
import SnakeGame from '@/components/SnakeGame';

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
  const [users, setUsers] = useState<Array<{username: string, vip: boolean, loginTime: number, sessionDuration: number, banned?: boolean, role?: string, roleLevel?: number}>>([]);
  const [showAccountMenu, setShowAccountMenu] = useState(false);
  const [newUsername, setNewUsername] = useState('');
  const [showChangeUsername, setShowChangeUsername] = useState(false);
  const [showMasterWelcome, setShowMasterWelcome] = useState(false);
  const [isMaster, setIsMaster] = useState(false);
  const [adminPanelTab, setAdminPanelTab] = useState<'users' | 'roles' | 'settings'>('users');
  const [newAdminPassword, setNewAdminPassword] = useState('');
  const [roleUsername, setRoleUsername] = useState('');
  const [roleType, setRoleType] = useState<'moderator' | 'admin'>('moderator');
  const [roleLevel, setRoleLevel] = useState(1);
  const [banUsername, setBanUsername] = useState('');
  const [permissions, setPermissions] = useState<{[key: string]: {ban: number, delete: number, kick: number}}>({});
  const [showSnakeGame, setShowSnakeGame] = useState(false);

  useEffect(() => {
    const storedUsername = localStorage.getItem('username');
    const loginTime = localStorage.getItem('loginTime');
    
    if (storedUsername && loginTime) {
      setIsAuthenticated(true);
      setUsername(storedUsername);
      setShowAuth(false);
      setIsMaster(storedUsername.toLowerCase() === 'anal_genius');
      updateUserSession(storedUsername);
    }
    
    loadPermissions();

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
    
    // Обновляем сессии пользователей каждые 30 секунд
    const sessionInterval = setInterval(() => {
      if (storedUsername) {
        updateUserSession(storedUsername);
      }
    }, 30000);
    
    return () => clearInterval(sessionInterval);
  }, []);

  const loadUsers = () => {
    const storedUsers = localStorage.getItem('siteUsers');
    if (storedUsers) {
      const parsed = JSON.parse(storedUsers);
      // Показываем всех пользователей, кроме забаненных
      const activUsers = parsed.filter((u: any) => !u.banned);
      setUsers(activUsers);
    } else {
      setUsers([]);
    }
  };

  const loadPermissions = () => {
    const storedPerms = localStorage.getItem('rolePermissions');
    if (storedPerms) {
      setPermissions(JSON.parse(storedPerms));
    } else {
      const defaultPerms = {
        moderator: { ban: 2, delete: 1, kick: 1 },
        admin: { ban: 5, delete: 3, kick: 1 }
      };
      setPermissions(defaultPerms);
      localStorage.setItem('rolePermissions', JSON.stringify(defaultPerms));
    }
  };

  const savePermissions = () => {
    localStorage.setItem('rolePermissions', JSON.stringify(permissions));
    alert('Настройки прав доступа сохранены!');
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
    // Обновляем список пользователей (исключая забаненных)
    setUsers(usersList.filter((u: any) => !u.banned));
  };

  const handleRegister = (newUsername: string, isMasterUser?: boolean) => {
    localStorage.setItem('username', newUsername);
    localStorage.setItem('loginTime', Date.now().toString());
    setIsAuthenticated(true);
    setUsername(newUsername);
    setIsMaster(isMasterUser || false);
    updateUserSession(newUsername);
    
    if (isMasterUser) {
      setShowMasterWelcome(true);
      setTimeout(() => {
        setShowMasterWelcome(false);
      }, 4000);
    }
  };

  const handleAdminUnlock = () => {
    if (isMaster) {
      setAdminUnlocked(true);
      // Принудительно перезагружаем список пользователей
      setTimeout(() => loadUsers(), 100);
      return;
    }
    
    const storedPassword = localStorage.getItem('adminPassword') || 'denis222p';
    if (adminPassword === storedPassword) {
      setAdminUnlocked(true);
      setTimeout(() => loadUsers(), 100);
    } else {
      alert('Неверный пароль!');
    }
  };

  const handleChangeAdminPassword = () => {
    if (newAdminPassword.length < 6) {
      alert('Пароль должен быть минимум 6 символов!');
      return;
    }
    localStorage.setItem('adminPassword', newAdminPassword);
    setNewAdminPassword('');
    alert('Пароль админ-панели успешно изменён!');
  };

  const handleAssignRole = () => {
    if (!roleUsername) {
      alert('Введите ник пользователя!');
      return;
    }
    
    if (roleUsername.toLowerCase() === 'anal_genius') {
      alert('Невозможно назначить роль основателю!');
      return;
    }
    
    const storedUsers = localStorage.getItem('siteUsers');
    const usersList = storedUsers ? JSON.parse(storedUsers) : [];
    const userIndex = usersList.findIndex((u: any) => u.username.toLowerCase() === roleUsername.toLowerCase());
    
    if (userIndex === -1) {
      alert('Пользователь не найден!');
      return;
    }
    
    if (roleType === 'moderator' && (roleLevel < 1 || roleLevel > 3)) {
      alert('Уровень модератора: от 1 до 3!');
      return;
    }
    
    if (roleType === 'admin' && (roleLevel < 1 || roleLevel > 10)) {
      alert('Уровень админа: от 1 до 10!');
      return;
    }
    
    usersList[userIndex].role = roleType;
    usersList[userIndex].roleLevel = roleLevel;
    localStorage.setItem('siteUsers', JSON.stringify(usersList));
    setUsers(usersList);
    setRoleUsername('');
    alert(`Роль ${roleType} уровня ${roleLevel} назначена пользователю ${roleUsername}!`);
  };

  const handleBanUser = () => {
    if (!banUsername) {
      alert('Введите ник пользователя!');
      return;
    }
    
    if (banUsername.toLowerCase() === 'anal_genius') {
      alert('Невозможно забанить основателя!');
      return;
    }
    
    const storedUsers = localStorage.getItem('siteUsers');
    const usersList = storedUsers ? JSON.parse(storedUsers) : [];
    const userIndex = usersList.findIndex((u: any) => u.username.toLowerCase() === banUsername.toLowerCase());
    
    if (userIndex === -1) {
      alert('Пользователь не найден!');
      return;
    }
    
    usersList[userIndex].banned = true;
    localStorage.setItem('siteUsers', JSON.stringify(usersList));
    setUsers(usersList.filter((u: any) => !u.banned));
    setBanUsername('');
    alert(`Пользователь ${banUsername} заблокирован!`);
  };

  const handleLogout = () => {
    localStorage.removeItem('username');
    localStorage.removeItem('loginTime');
    localStorage.removeItem('vipExpiry');
    localStorage.removeItem('vipActivated');
    setIsAuthenticated(false);
    setUsername('');
    setVipActive(false);
    setVipUsed(false);
    setShowAccountMenu(false);
  };

  const handleChangeUsername = () => {
    if (isMaster) {
      alert('Основатель не может изменить свой ник!');
      return;
    }
    
    if (newUsername.trim().length < 3) {
      alert('Ник должен быть минимум 3 символа');
      return;
    }
    
    const oldUsername = username;
    localStorage.setItem('username', newUsername);
    setUsername(newUsername);
    
    const storedUsers = localStorage.getItem('siteUsers');
    const usersList = storedUsers ? JSON.parse(storedUsers) : [];
    const userIndex = usersList.findIndex((u: any) => u.username === oldUsername);
    
    if (userIndex >= 0) {
      usersList[userIndex].username = newUsername;
      localStorage.setItem('siteUsers', JSON.stringify(usersList));
      setUsers(usersList);
    }
    
    setShowChangeUsername(false);
    setNewUsername('');
    setShowAccountMenu(false);
  };

  const getUserLevel = () => {
    if (isMaster) {
      return { level: 100, name: 'Основатель', color: 'text-transparent bg-clip-text bg-gradient-to-r from-red-500 via-yellow-500 via-green-500 via-blue-500 to-purple-500 animate-rainbow' };
    }
    
    const loginTime = parseInt(localStorage.getItem('loginTime') || Date.now().toString());
    const sessionMinutes = Math.floor((Date.now() - loginTime) / 60000);
    
    if (sessionMinutes < 10) return { level: 1, name: 'Новобранец', color: 'text-gray-400' };
    if (sessionMinutes < 30) return { level: 2, name: 'Сотрудник', color: 'text-blue-400' };
    if (sessionMinutes < 60) return { level: 3, name: 'Специалист', color: 'text-green-400' };
    return { level: 4, name: 'Ветеран', color: 'text-purple-400' };
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
      {showMasterWelcome && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm animate-fade-in">
          <div className="text-center space-y-4 animate-fade-in">
            <div className="text-4xl font-bold uppercase tracking-wider text-blue-400 glitch">
              Добро пожаловать,
            </div>
            <div className="text-3xl font-bold uppercase tracking-wider text-blue-300">
              Мой Господин
            </div>
            <div className="text-xl text-blue-400/70 uppercase tracking-widest mt-6">
              Всё в вашем распоряжении
            </div>
            <div className="flex justify-center gap-2 mt-8">
              <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse" />
              <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse" style={{animationDelay: '0.2s'}} />
              <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse" style={{animationDelay: '0.4s'}} />
            </div>
          </div>
        </div>
      )}
      
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
            <div className="flex gap-3 items-center">
              <Button
                variant={activeTab === 'home' ? 'default' : 'outline'}
                onClick={() => setActiveTab('home')}
                className="uppercase tracking-wider"
              >
                <Icon name="Home" size={16} className="mr-2" />
                Главная
              </Button>
              
              <div className="relative">
                <button
                  onClick={() => setShowAccountMenu(!showAccountMenu)}
                  className={`w-10 h-10 rounded-full flex items-center justify-center hover:scale-105 transition-transform ${
                    isMaster 
                      ? 'bg-gradient-to-br from-red-500 via-yellow-500 via-green-500 via-blue-500 to-purple-500 p-0.5 animate-spin-slow' 
                      : 'bg-gradient-to-br from-destructive to-destructive/60 border-2 border-destructive'
                  }`}
                >
                  <div className={`w-full h-full rounded-full flex items-center justify-center ${isMaster ? 'bg-card' : ''}`}>
                    <Icon name="User" size={20} className="text-primary-foreground" />
                  </div>
                </button>
                
                {showAccountMenu && (
                  <div className="absolute right-0 mt-2 w-64 bg-card border border-destructive/30 rounded-lg shadow-lg z-50">
                    <div className="p-4 border-b border-destructive/30">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-destructive to-destructive/60 border-2 border-destructive flex items-center justify-center">
                          <Icon name="User" size={24} className="text-primary-foreground" />
                        </div>
                        <div className="flex-1">
                          <h3 className="font-bold truncate">{username}</h3>
                          <p className={`text-xs uppercase ${getUserLevel().color}`}>
                            {getUserLevel().name} • LVL {getUserLevel().level}
                          </p>
                        </div>
                      </div>
                      {isMaster ? (
                        <Badge className="mt-2 w-full justify-center animate-rainbow uppercase font-bold">
                          <Icon name="Crown" size={12} className="mr-1" />
                          Основатель
                        </Badge>
                      ) : vipActive && (
                        <Badge className="mt-2 w-full justify-center bg-purple-500">
                          <Icon name="Crown" size={12} className="mr-1" />
                          VIP Активен
                        </Badge>
                      )}
                    </div>
                    
                    <div className="p-2">
                      {!isMaster && (
                        <Button
                          variant="ghost"
                          className="w-full justify-start"
                          onClick={() => {
                            setShowChangeUsername(true);
                            setShowAccountMenu(false);
                          }}
                        >
                          <Icon name="Edit" size={16} className="mr-2" />
                          Сменить ник
                        </Button>
                      )}
                      
                      <Button
                        variant="ghost"
                        className="w-full justify-start text-destructive hover:text-destructive hover:bg-destructive/10"
                        onClick={handleLogout}
                      >
                        <Icon name="LogOut" size={16} className="mr-2" />
                        Выход
                      </Button>
                    </div>
                  </div>
                )}
              </div>
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
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-2">
            <p className="text-xs text-muted-foreground uppercase tracking-widest">
              SCP Foundation Internal System v<span className="redacted">█.█.█</span>
            </p>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowSnakeGame(true)}
              className="text-green-500 hover:text-green-400 hover:bg-green-500/10 font-mono text-xs"
            >
              [TERMINAL]
            </Button>
          </div>
          <p className="text-xs text-muted-foreground/70 text-center">
            Все данные классифицированы • Несанкционированный доступ запрещен
          </p>
        </div>
      </footer>

      <Dialog 
        open={showAdminPanel} 
        onOpenChange={(open) => {
          setShowAdminPanel(open);
          if (open && isMaster) {
            // Перезагружаем пользователей при открытии панели
            loadUsers();
          }
        }}
      >
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
            <div className="space-y-4">
              {isMaster && (
                <div className="flex gap-2 border-b border-destructive/30 pb-2">
                  <Button
                    variant={adminPanelTab === 'users' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setAdminPanelTab('users')}
                    className="flex-1"
                  >
                    <Icon name="Users" size={14} className="mr-1" />
                    Пользователи
                  </Button>
                  <Button
                    variant={adminPanelTab === 'roles' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setAdminPanelTab('roles')}
                    className="flex-1"
                  >
                    <Icon name="Shield" size={14} className="mr-1" />
                    Роли
                  </Button>
                  <Button
                    variant={adminPanelTab === 'settings' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setAdminPanelTab('settings')}
                    className="flex-1"
                  >
                    <Icon name="Settings" size={14} className="mr-1" />
                    Настройки
                  </Button>
                </div>
              )}
              
              <div className="max-h-96 overflow-y-auto">
                {adminPanelTab === 'users' && (
                  <div className="space-y-4">
                    <div className="border-l-4 border-purple-500 pl-4 py-2 bg-purple-900/20">
                      <h3 className="font-bold uppercase text-sm mb-1 text-purple-400">Статистика пользователей</h3>
                      <p className="text-xs text-muted-foreground">
                        Всего зарегистрировано: {users.length}
                      </p>
                    </div>

                    {isMaster && (
                      <Card className="border-destructive/50 bg-destructive/10">
                        <CardContent className="p-3">
                          <h4 className="text-xs uppercase font-bold mb-2 text-destructive">Бан пользователя</h4>
                          <div className="flex gap-2">
                            <Input
                              type="text"
                              placeholder="Ник пользователя..."
                              value={banUsername}
                              onChange={(e) => setBanUsername(e.target.value)}
                              className="bg-secondary/50 border-destructive/30 text-sm"
                            />
                            <Button
                              size="sm"
                              variant="destructive"
                              onClick={handleBanUser}
                            >
                              <Icon name="Ban" size={14} />
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    )}

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
                                    {user.role && (
                                      <Badge variant="default" className="bg-blue-600">
                                        {user.role === 'moderator' ? 'Модератор' : 'Админ'} LVL {user.roleLevel}
                                      </Badge>
                                    )}
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
                
                {adminPanelTab === 'roles' && isMaster && (
                  <div className="space-y-4">
                    <div className="border-l-4 border-blue-500 pl-4 py-2 bg-blue-900/20">
                      <h3 className="font-bold uppercase text-sm mb-1 text-blue-400">Назначение ролей</h3>
                      <p className="text-xs text-muted-foreground">
                        Модераторы: уровни 1-3 • Админы: уровни 1-10
                      </p>
                    </div>
                    
                    <Card className="border-blue-500/50 bg-blue-900/10">
                      <CardContent className="p-4 space-y-3">
                        <div>
                          <label className="text-xs uppercase text-muted-foreground mb-1 block">Ник пользователя</label>
                          <Input
                            type="text"
                            placeholder="Введите ник..."
                            value={roleUsername}
                            onChange={(e) => setRoleUsername(e.target.value)}
                            className="bg-secondary/50 border-blue-500/30"
                          />
                        </div>
                        
                        <div className="grid grid-cols-2 gap-2">
                          <div>
                            <label className="text-xs uppercase text-muted-foreground mb-1 block">Тип роли</label>
                            <select
                              value={roleType}
                              onChange={(e) => setRoleType(e.target.value as 'moderator' | 'admin')}
                              className="w-full bg-secondary border border-blue-500/30 rounded px-2 py-1.5 text-sm"
                            >
                              <option value="moderator">Модератор</option>
                              <option value="admin">Админ</option>
                            </select>
                          </div>
                          
                          <div>
                            <label className="text-xs uppercase text-muted-foreground mb-1 block">Уровень</label>
                            <Input
                              type="number"
                              min={1}
                              max={roleType === 'moderator' ? 3 : 10}
                              value={roleLevel}
                              onChange={(e) => setRoleLevel(parseInt(e.target.value) || 1)}
                              className="bg-secondary/50 border-blue-500/30"
                            />
                          </div>
                        </div>
                        
                        <Button
                          onClick={handleAssignRole}
                          className="w-full bg-blue-600 hover:bg-blue-700"
                        >
                          <Icon name="UserPlus" size={16} className="mr-2" />
                          Назначить роль
                        </Button>
                      </CardContent>
                    </Card>
                    
                    <div className="border-t border-blue-500/30 pt-3">
                      <h4 className="text-xs uppercase font-bold mb-2 text-blue-400">Текущие роли</h4>
                      <div className="space-y-2">
                        {users.filter(u => u.role).map((user, index) => (
                          <div key={index} className="flex items-center justify-between p-2 bg-secondary/30 rounded">
                            <span className="text-sm font-bold">{user.username}</span>
                            <Badge variant="default" className="bg-blue-600">
                              {user.role === 'moderator' ? 'Модератор' : 'Админ'} LVL {user.roleLevel}
                            </Badge>
                          </div>
                        ))}
                        {users.filter(u => u.role).length === 0 && (
                          <p className="text-xs text-muted-foreground text-center py-2">Нет назначенных ролей</p>
                        )}
                      </div>
                    </div>
                  </div>
                )}
                
                {adminPanelTab === 'settings' && isMaster && (
                  <div className="space-y-4">
                    <div className="border-l-4 border-green-500 pl-4 py-2 bg-green-900/20">
                      <h3 className="font-bold uppercase text-sm mb-1 text-green-400">Настройки системы</h3>
                      <p className="text-xs text-muted-foreground">
                        Управление паролями и правами доступа
                      </p>
                    </div>
                    
                    <Card className="border-green-500/50 bg-green-900/10">
                      <CardContent className="p-4 space-y-3">
                        <h4 className="text-xs uppercase font-bold text-green-400">Изменить пароль админ-панели</h4>
                        <Input
                          type="password"
                          placeholder="Новый пароль (минимум 6 символов)..."
                          value={newAdminPassword}
                          onChange={(e) => setNewAdminPassword(e.target.value)}
                          className="bg-secondary/50 border-green-500/30"
                        />
                        <Button
                          onClick={handleChangeAdminPassword}
                          className="w-full bg-green-600 hover:bg-green-700"
                        >
                          <Icon name="Key" size={16} className="mr-2" />
                          Сменить пароль
                        </Button>
                      </CardContent>
                    </Card>
                    
                    <Card className="border-yellow-500/50 bg-yellow-900/10">
                      <CardContent className="p-4 space-y-3">
                        <h4 className="text-xs uppercase font-bold text-yellow-400">Права доступа по ролям</h4>
                        <p className="text-xs text-muted-foreground mb-3">
                          Укажите минимальный уровень для каждого действия
                        </p>
                        
                        <div className="space-y-3">
                          <div>
                            <label className="text-xs uppercase text-muted-foreground mb-1 block">Модераторы</label>
                            <div className="grid grid-cols-3 gap-2">
                              <div>
                                <label className="text-xs text-muted-foreground">Бан (LVL)</label>
                                <Input
                                  type="number"
                                  min={1}
                                  max={3}
                                  value={permissions.moderator?.ban || 2}
                                  onChange={(e) => setPermissions({...permissions, moderator: {...permissions.moderator, ban: parseInt(e.target.value) || 1}})}
                                  className="bg-secondary/50 text-sm"
                                />
                              </div>
                              <div>
                                <label className="text-xs text-muted-foreground">Удаление</label>
                                <Input
                                  type="number"
                                  min={1}
                                  max={3}
                                  value={permissions.moderator?.delete || 1}
                                  onChange={(e) => setPermissions({...permissions, moderator: {...permissions.moderator, delete: parseInt(e.target.value) || 1}})}
                                  className="bg-secondary/50 text-sm"
                                />
                              </div>
                              <div>
                                <label className="text-xs text-muted-foreground">Кик</label>
                                <Input
                                  type="number"
                                  min={1}
                                  max={3}
                                  value={permissions.moderator?.kick || 1}
                                  onChange={(e) => setPermissions({...permissions, moderator: {...permissions.moderator, kick: parseInt(e.target.value) || 1}})}
                                  className="bg-secondary/50 text-sm"
                                />
                              </div>
                            </div>
                          </div>
                          
                          <div>
                            <label className="text-xs uppercase text-muted-foreground mb-1 block">Админы</label>
                            <div className="grid grid-cols-3 gap-2">
                              <div>
                                <label className="text-xs text-muted-foreground">Бан (LVL)</label>
                                <Input
                                  type="number"
                                  min={1}
                                  max={10}
                                  value={permissions.admin?.ban || 5}
                                  onChange={(e) => setPermissions({...permissions, admin: {...permissions.admin, ban: parseInt(e.target.value) || 1}})}
                                  className="bg-secondary/50 text-sm"
                                />
                              </div>
                              <div>
                                <label className="text-xs text-muted-foreground">Удаление</label>
                                <Input
                                  type="number"
                                  min={1}
                                  max={10}
                                  value={permissions.admin?.delete || 3}
                                  onChange={(e) => setPermissions({...permissions, admin: {...permissions.admin, delete: parseInt(e.target.value) || 1}})}
                                  className="bg-secondary/50 text-sm"
                                />
                              </div>
                              <div>
                                <label className="text-xs text-muted-foreground">Кик</label>
                                <Input
                                  type="number"
                                  min={1}
                                  max={10}
                                  value={permissions.admin?.kick || 1}
                                  onChange={(e) => setPermissions({...permissions, admin: {...permissions.admin, kick: parseInt(e.target.value) || 1}})}
                                  className="bg-secondary/50 text-sm"
                                />
                              </div>
                            </div>
                          </div>
                        </div>
                        
                        <Button
                          onClick={savePermissions}
                          className="w-full bg-yellow-600 hover:bg-yellow-700"
                        >
                          <Icon name="Save" size={16} className="mr-2" />
                          Сохранить настройки
                        </Button>
                      </CardContent>
                    </Card>
                  </div>
                )}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      <Dialog open={showChangeUsername} onOpenChange={setShowChangeUsername}>
        <DialogContent className="border-destructive/30 bg-card/95 backdrop-blur">
          <DialogHeader>
            <DialogTitle className="uppercase tracking-wider flex items-center gap-2">
              <Icon name="Edit" size={20} className="text-destructive" />
              Смена ника
            </DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4">
            <div className="border-l-4 border-destructive pl-4 py-2">
              <p className="text-sm text-muted-foreground">
                Текущий ник: <span className="font-bold text-foreground">{username}</span>
              </p>
            </div>
            
            <div>
              <label className="text-xs uppercase text-muted-foreground mb-2 block">Новый ник</label>
              <Input
                type="text"
                placeholder="Введите новый ник..."
                value={newUsername}
                onChange={(e) => setNewUsername(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleChangeUsername()}
                className="bg-secondary/50 border-destructive/30"
              />
            </div>
            
            <Button 
              onClick={handleChangeUsername}
              className="w-full"
              variant="destructive"
            >
              <Icon name="Check" size={16} className="mr-2" />
              Подтвердить
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <SnakeGame open={showSnakeGame} onClose={() => setShowSnakeGame(false)} />
    </div>
  );
};

export default Index;