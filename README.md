# Control 🖥️  
*Sistema de Controle de Equipamentos*  

![Badges](https://img.shields.io/badge/Next.js-14.2.3-informational?style=flat&logo=next.js)  
![Badges](https://img.shields.io/badge/TypeScript-5.0.0-blue?style=flat&logo=typescript)  
![Badges](https://img.shields.io/badge/PostgreSQL-16.0-blue?style=flat&logo=postgresql)  

---

## **Descrição**  
O **Control** é um sistema de gerenciamento de equipamentos desenvolvido para:  
- 🛠️ Controlar equipamentos em uso e em estoque.  
- 👥 Gerenciar usuários, gestores e permissões.  
- 📅 Registrar histórico de retiradas e devoluções.  
- 📊 Exportar relatórios em CSV para análise.  

---

## **Funcionalidades Principais**  
- **Dashboard Interativo**: Visualize equipamentos em tempo real.  
- **Gestão de Usuários**: Cadastro e listagem de usuários/gestores.  
- **Atribuição de Equipamentos**: Associe equipamentos a usuários autorizados.  
- **Histórico Detalhado**: Registro completo de movimentações.  
- **Exportação CSV**: Gere relatórios personalizados.  

---

## **Tecnologias Utilizadas**  
- **Frontend**: Next.js (com TypeScript).  
- **Backend**: Next.js API Routes.  
- **Banco de Dados**: PostgreSQL.  
- **ORM**: Drizzle ORM (para queries e migrações).  

---

## **Pré-requisitos**  
- Node.js (v18 ou superior).  
- PostgreSQL configurado.  
- Git (para clonar o repositório).  

---

## **Instalação**  
1. **Clone o repositório**:  
   ```bash  
   git clone [URL_DO_REPOSITÓRIO]  
   cd control  

## **Instale as dependências**

```bash
npm install --force  
````

## **Configure o ambiente**
### Crie um arquivo .env na raiz do projeto com:
```bash
DATABASE_URL="postgresql://[USUÁRIO]:[SENHA]@[HOST]:[PORTA]/[NOME_DO_BANCO]"  
ADMIN_USER="admin"  
ADMIN_PASSWORD="senha_segura"  
```
## **Execute o sistema**
```bash
npm run dev  
```
Acesse: http://localhost:3000.


## **Contribuição**
### Contribuições são bem-vindas! Siga os passos:

1. Faça um fork do projeto.
2. Crie uma branch: git checkout -b feature/nova-funcionalidade.
3. Envie um pull request.




-----

## Licença

Distribuído sob a licença MIT. Veja o arquivo LICENSE para mais detalhes.

Se precisar de ajustes ou mais detalhes, é só avisar! 😊
