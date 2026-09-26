# OUTPLAY Ignition

Crie apenas as primeiras telas de autenticação do jogo mobile OUTPLAY. Nesta etapa NÃO crie menu principal, matchmaking, combate, perfil, loja ou outras funcionalidades.



1. SPLASH SCREEN



Ao abrir o jogo, mostrar uma tela de abertura profissional e cinematográfica.

- faz bem o logotipo para acabar todos espaço etc

- Duração aproximada: 2 segundos.

- Depois da animação, verificar se o jogador está autenticado:

  - Se estiver autenticado → seguir para a área principal futura do jogo.

  - Se não estiver autenticado → abrir a tela de entrada.

- Não mostrar menus ou conteúdo desnecessário no splash.



A experiência deve parecer a abertura de um jogo mobile competitivo, e não de um website.



2. TELA ENTRAR



Criar uma tela de login limpa, moderna e totalmente responsiva para celular.



Elementos:



- Logo OUTPLAY no topo.

- Título: Bem-vindo de volta

- Campo: E-mail

- Campo: Palavra-passe

- Botão principal grande: ENTRAR

- Link: Esqueceu a palavra-passe?

- Separador simples com "ou"

- Botão secundário: Continuar com Google

- Texto inferior:

  Ainda não tens uma conta? Criar conta



Regras:



- O botão ENTRAR deve validar os campos.

- Mostrar mensagens de erro claras quando os dados forem inválidos.

- A palavra-passe deve ficar escondida por padrão, com opção para mostrar/ocultar.

- Não criar dados fictícios ou usuários de demonstração.

- Preparar a autenticação para funcionar posteriormente com Supabase Auth.



3. TELA CRIAR CONTA



Criar uma tela de cadastro simples e rápida.



Elementos:



- Logo OUTPLAY.

- Título: Criar conta

- Campo: Nome de jogador

- Campo: E-mail

- Campo: Palavra-passe

- Botão principal: CRIAR CONTA

- Texto inferior:

  Já tens uma conta? Entrar



Regras:



- O nome de jogador deve ser obrigatório.

- O e-mail deve ser validado.

- A palavra-passe deve ter requisitos mínimos de segurança.

- Não exigir confirmação de e-mail nesta primeira versão.

- Depois do cadastro bem-sucedido, autenticar o jogador automaticamente.

- Não criar dados fictícios.

- Usar Supabase Auth para autenticação.

- Guardar o nome de jogador associado à conta do usuário no banco de dados.

- Preparar a estrutura para futuramente gerar um OUTPLAY ID único para cada jogador.



NAVEGAÇÃO



Fluxo:



Splash

↓

Se não autenticado

↓

Entrar

↕

Criar conta



Se já autenticado:

Splash

↓

Área principal do jogo (será criada posteriormente)



DESIGN



O resultado deve parecer um jogo mobile competitivo premium.



- Interface mobile-first.

- Visual moderno e cinematográfico.

- Fundo escuro.

- Tipografia forte e legível.

- Botões grandes e fáceis de tocar.

- Animações suaves.

- Boa hierarquia visual.

- Não transformar a interface em um dashboard ou website.

- Não adicionar funcionalidades que não foram solicitadas.

- Não usar textos de exemplo desnecessários.

- Não usar usuários fictícios.



Por enquanto, implemente somente Splash + Entrar + Criar conta, deixando a arquitetura preparada para continuarmos o desenvolvimento do OUTPLAY nas próximas etapas. Faz só isso agora

This project was built with [Lovable](https://lovable.dev).

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/8ba606d8-d0c3-4201-aad3-3c4d2151cc9a).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
