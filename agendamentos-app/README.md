# Recuperação de senha

**RF**
- O usuário poderá recuperar sua senha informando o seu e-mail;
- O usuário receberá um e-mail com as instruções de recuperação de senha;
- O usuário poderá trocar sua senha;

**RNF**
- Utilizar Ethereal para testar envios em ambiente de desenvolvimento;
- Utilizar Amazon SES para envios em produção;
- O envio de e-mails deve acontecer em segundo plano;

**RN**
- O link enviado por e-mail para recuperação de senha deve expirar;
- O usuário deverá confirmar sua nova senha;

# Atualização do perfil
**RF**
- O usuário poderá atualizar suas informações;
- O usuário deve receber um e-mail com as instruções de recuperação de senha;
- O usuário poderá trocar sua senha;

**RN**
- O usuário não poderá alterar seu e-mail para um já utilizado;
- O usuário deverá informar sua senha antiga ao atualizar sua senha;
- O usuário deverá confirmar sua nova senha;

# Painel do prestador
**RF**
- O prestador poderá listar seus agendamentos de um dia específico;
- O prestador receberá uma notificação sempre que houver um novo agendamento;
- O prestador poderá visualizar as notificações não lidas;

**RNF**
- Os agendamentos do dia devem ser armazenados em cache;
- As notificações do prestador devem ser armazenadas no MongoDB;
- As notificações do prestador devem ser enviadas em tempo-real utilizando socket.io;

**RN**
- A notificação deve ter status de lida ou não-lida;

# Agendamento de serviços
**RF**
- O usuário poderá listar todos os prestadores de serviço cadastrados;
- O usuário poderá listar os dias de um mês com pelo menos um horário disponível de algum prestador;
- O usuário poderá listar os horários disponíveis em um dia específico de um prestador;
- O usuário poderá realizar um novo agendamento com um prestador

**RNF**
- A listagem de prestadores deve ser armazenada em cache;
- Utilizar Amazon SES para envios em produção;
- O envio de e-mails deve acontecer em segundo plano;

**RN**
- Cada agendamento deve durar exatamente 1 (uma) hora;
- Os agendamentos devem estar disponíveis entre 8 (oito) horas até às 18 (dezoito) horas;
- O usuário não pode agendar em um horário já agendado;
- O usuário não pode agendar um horário passado;
- O usuário não poderá agendar um serviço consigo mesmo
