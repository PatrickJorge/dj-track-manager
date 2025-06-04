# DJ Track Manager 🎧

Um aplicativo moderno para gerenciamento de músicas e playlists para DJs, desenvolvido com React, TypeScript e Node.js.

## 🚀 Tecnologias Utilizadas

### Frontend
- React 18
- TypeScript
- Vite
- TailwindCSS
- Framer Motion
- React Router DOM
- Zustand (Gerenciamento de Estado)
- React Hook Form
- Headless UI
- Lucide React (Ícones)

### Backend
- Node.js
- Express
- MongoDB (Mongoose)
- JWT (Autenticação)
- Bcrypt (Criptografia)
- CORS

## 📋 Pré-requisitos

- Node.js (versão 18 ou superior)
- MongoDB
- npm ou yarn

## 🔧 Instalação

1. Clone o repositório:
```bash
git clone https://github.com/seu-usuario/dj-track-manager.git
cd dj-track-manager
```

2. Instale as dependências:
```bash
npm install
```

3. Configure as variáveis de ambiente:
Crie um arquivo `.env` na raiz do projeto com as seguintes variáveis:
```env
MONGODB_URI=sua_url_do_mongodb
JWT_SECRET=seu_segredo_jwt
```

## 🚀 Executando o Projeto

1. Inicie o servidor de desenvolvimento:
```bash
npm run dev
```

2. Em outro terminal, inicie o servidor backend:
```bash
npm run server
```

O frontend estará disponível em `http://localhost:5173`
O backend estará disponível em `http://localhost:3000`

## 📦 Scripts Disponíveis

- `npm run dev` - Inicia o servidor de desenvolvimento
- `npm run build` - Cria a build de produção
- `npm run preview` - Visualiza a build de produção localmente
- `npm run server` - Inicia o servidor backend
- `npm run lint` - Executa o linter

## 🛠️ Estrutura do Projeto

```
dj-track-manager/
├── src/               # Código fonte do frontend
├── server/           # Código fonte do backend
├── public/           # Arquivos estáticos
├── index.html        # Página principal
└── package.json      # Dependências e scripts
```

## 🔐 Funcionalidades

- Autenticação de usuários
- Gerenciamento de playlists
- Organização de músicas
- Interface moderna e responsiva
- Animações suaves
- Sistema de notificações

## 🤝 Contribuindo

1. Faça um Fork do projeto
2. Crie uma Branch para sua Feature (`git checkout -b feature/AmazingFeature`)
3. Faça o Commit das suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Faça o Push para a Branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📝 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

Desenvolvido por : Patrick Jorge

## ✨ Agradecimentos

- [React](https://reactjs.org/)
- [Vite](https://vitejs.dev/)
- [TailwindCSS](https://tailwindcss.com/)
- [MongoDB](https://www.mongodb.com/) 