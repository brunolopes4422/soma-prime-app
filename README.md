# Soma Prime — Portal Operacional

Portal interno de guias operacionais para a Soma Prime e PH Consult Pro.
Desenvolvido com React + TypeScript + Vite + Tailwind + Supabase.

---

## 🚀 Como rodar o projeto do zero

### 1. Clonar o repositório
```bash
git clone https://github.com/brunolopes4422/soma-prime-app.git
cd soma-prime-app
```

### 2. Instalar dependências
```bash
npm install
```

### 3. Configurar variáveis de ambiente
Cria um arquivo `.env` na raiz do projeto com as chaves do Supabase:
```
VITE_SUPABASE_URL=https://xxxxxxxxxxxxxxxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGc...
```
> As chaves ficam em **Supabase → Project Settings → API Keys → Legacy anon key**

### 4. Rodar localmente
```bash
npm run dev
```
Acesse em `http://localhost:5173`

---

## 🗄️ Banco de dados

O banco está no Supabase. Em caso de novo projeto, rode o script abaixo no **SQL Editor**:

```sql
create table profiles (
  id          uuid references auth.users on delete cascade primary key,
  full_name   text,
  company     text,
  role        text,
  sector      text,
  created_at  timestamp with time zone default now()
);

create table checklist_progress (
  id          uuid default gen_random_uuid() primary key,
  user_id     uuid references profiles(id) on delete cascade,
  guide       text,
  item_id     text,
  completed   boolean default false,
  updated_at  timestamp with time zone default now(),
  unique(user_id, guide, item_id)
);

alter table profiles enable row level security;
alter table checklist_progress enable row level security;

create policy "Perfil liberado" on profiles for all using (true);
create policy "Usuário vê próprio progresso" on checklist_progress for all using (auth.uid() = user_id);
```

---

## 👤 Criar usuário

1. Supabase → **Authentication → Users → Add User**
2. Copiar o UUID gerado
3. Rodar no SQL Editor:

```sql
insert into profiles (id, full_name, company, role, sector)
values (
  'uuid-do-usuario',
  'Nome Completo',
  'soma_prime',       -- ou 'ph_consult'
  'manager',          -- ou 'collaborator'
  'cs'                -- cs | fiscal | dp
);
```

---

## 🏗️ Estrutura do projeto

```
src/
├── components/
│   └── layout/        # Sidebar, Header, Layout
├── config/
│   └── modules.ts     # Registro central de todos os módulos
├── contexts/
│   └── AuthContext.tsx
├── lib/
│   └── supabase.ts
├── pages/
│   ├── Login.tsx
│   ├── Home.tsx
│   ├── ComingSoon.tsx
│   ├── dashboard/
│   └── guides/        # Um arquivo por módulo
└── styles/
    └── themes.ts      # Temas por empresa
```

---

## ➕ Como adicionar um novo módulo

1. Adicionar entrada em `src/config/modules.ts`
2. Criar `src/pages/guides/GuideNovo.tsx`
3. Adicionar rota em `src/App.tsx`
4. Adicionar a chave do módulo em `src/styles/themes.ts` para as empresas que devem ter acesso

---

## 🔒 Segurança

- Nunca suba o arquivo `.env` para o GitHub
- As chaves do Supabase ficam apenas localmente
- O banco usa Row Level Security (RLS) — cada usuário só acessa os próprios dados

---

## 🌐 Deploy (Vercel)

1. Acesse [vercel.com](https://vercel.com) e conecte o repositório GitHub
2. Configure as variáveis de ambiente (`VITE_SUPABASE_URL` e `VITE_SUPABASE_ANON_KEY`)
3. Deploy automático a cada `git push`