import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import Icon from '@/components/ui/icon';
import { Badge } from '@/components/ui/badge';

const Index = () => {
  const [activeTab, setActiveTab] = useState<'home' | 'admins'>('home');

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
                <div className="blood-drip">
                  <img 
                    src="https://cdn.poehali.dev/projects/8c395228-8ba9-4eb4-8f5a-3c8614bf9c9e/files/5f933d73-0f84-4534-8cd9-1796950d33c9.jpg" 
                    alt="SCP Logo" 
                    className="w-16 h-16 object-cover"
                  />
                </div>
                <div>
                  <h1 className="text-xl font-bold tracking-wider glitch">
                    SCP HiTOs
                  </h1>
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
                      Уровень допуска: <span className="redacted">████████</span>
                    </h2>
                  </div>
                  <Icon name="Lock" size={24} className="text-destructive animate-flicker" />
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="border-l-4 border-destructive pl-4 py-2">
                  <h3 className="text-xl font-bold mb-2 uppercase">Внимание</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    Доступ к данной информации ограничен персоналом с уровнем допуска 
                    <span className="redacted mx-1">███</span> и выше. Несанкционированный доступ 
                    карается согласно протоколу <span className="redacted">████-█</span>.
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
                            Доступ к <span className="redacted">███</span> засекреченным файлам
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
              </CardContent>
            </Card>

            <div className="border-t border-destructive/30 pt-6 text-center">
              <p className="text-xs text-muted-foreground uppercase tracking-widest">
                Foundation Internal Network • Level <span className="redacted">█</span> Clearance Required
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

            <div className="border-t border-destructive/30 pt-6 text-center">
              <p className="text-xs text-muted-foreground uppercase tracking-widest">
                Administrator Registry • O5 Council Approved
              </p>
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
    </div>
  );
};

export default Index;