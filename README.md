# ZOOBET

Sistema web full stack para simulação do Jogo do Bicho, desenvolvido para fins acadêmicos na disciplina de Laboratório de Software.

---

## Tecnologias utilizadas

### Backend
- FastAPI
- SQLAlchemy
- Alembic
- JWT
- Passlib
- Python

### Frontend
- React
- Vite
- TypeScript
- Axios
- Bootstrap

### Banco de Dados
- PostgreSQL

### Infraestrutura
- Docker Compose

### Versionamento e organização
- Git
- GitHub
- GitHub Projects
- GitHub Actions

---

## Arquitetura do sistema

O projeto utiliza uma **arquitetura monolítica em camadas**.
O sistema está em um único projeto, mas organizado por responsabilidades, separando melhor as partes da aplicação.

As camadas adotadas são:

- **Camada de Apresentação (Frontend):** interface do usuário desenvolvida em React.
- **Camada de Aplicação (Backend):** API desenvolvida em FastAPI, responsável pelo processamento das requisições.
- **Camada de Serviços:** onde ficam as regras de negócio, como criação de apostas, sorteios e validações.
- **Camada de Dados:** responsável pela comunicação com o banco de dados PostgreSQL.
- **Camada de Contrato da API:** define os endpoints REST consumidos pelo frontend.

---

## Funcionalidades

- Cadastro de usuário
- Login com autenticação JWT
- Consulta de dados do usuário autenticado
- Realização de apostas
- Atualização de saldo
- Histórico de apostas
- Grid dos animais/grupos do jogo do bicho

---

## Endpoints principais

### Autenticação
- `POST /auth/registrar` - registra novo usuário
- `POST /auth/login` - autentica o usuário e retorna o token JWT
- `GET /auth/me` - retorna os dados do usuário autenticado

### Apostas
- `POST /apostas/` - cria uma nova aposta
- `GET /apostas/historico` - lista o histórico de apostas do usuário
- `POST /apostas/sortear` - realiza o sorteio das apostas pendentes

### Animais
- `GET /animais/` - lista os grupos e animais do jogo do bicho

---

# Como clonar e executar o projeto

## 1. Pré-requisitos na sua máquina

Antes de executar o projeto, é necessário ter instalado:

- Git
- Python 3.10 ou superior
- Node.js
- Docker Desktop

---

## 2. Clonar o repositório

Abra o terminal e execute:

```bash
git clone https://github.com/julianafalcaoo/zoobet-projeto.git
cd zoobet-projeto

---

## 3. Subir banco de dados

Execute:
- docker-compose up -d

Verifice se está rodando:
- docker ps

## 4. Confirgurar e executar o backend

Execute: - cd backend

# 4.1 Criar ambiente virtual:

# Windows:
python -m venv venv
venv\Scripts\activate

# Linux/Mac:
python3 -m venv venv
source venv/bin/activate

# 4.2 Instalar as dependências do backend

pip install -r requirements.txt

#4.3 Confugurar variaveis de ambiente

Crie um arquivo chamado .env dentro da pasta backend.

DATABASE_URL=postgresql://zoobet:zoobet@localhost:5432/zoobet
SECRET_KEY = "chave_super_secreta"
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 60
FRONTEND_URL = http://localhost:5173

#4.4 Executar migrations do bd

alembic upgrade head

# 4.5 Inicializar o servidor backend
 .\venv\Scripts\Activate  
 uvicorn app.main:app --reload 

# 4.6 Backend disponível em:

API: http://127.0.0.1:8000
Documentação Swagger: http://127.0.0.1:8000/docs

## 5. Configurar frontend

Abrir outro terminal:

- cd frontend

# 5.1 Instalar dependências

npm install

# 5.2 Rodar frontend

npm run dev

# 5.3 Frontend disponível em:
http://localhost:5173

## RESUMO

1. docker-compose up -d
2. rodar backend
3. rodar frontend

** O banco deve iniciar antes do backend
** O backend deve iniciar antes do frontend
