# Teste - Backend

## Comandos de Inicialização

Para iniciar o projeto, siga estas etapas:

1. Certifique-se de ter o Docker eo docker composer instalado em seu ambiente.

2. Execute o seguinte comando na raiz do projeto:

   ```bash
   npm run up
   ```

   Isso iniciará os contêineres necessários.

caso queira iniciar sem os container garanta pode configurar as variaveis de ambiente no env e executar os seguuintes comandos

npm run dev para o run com nodemon
npm run build && npm run start para run com node 

3. Será criado um usuário root para cadastro de carros e finalização de leilões:

   - Email: admin@instacarro.com
   - Senha: 123456

## Testes

Para executar os testes do projeto, você pode usar os seguintes comandos:
  
- Todos os testes:

  ```bash
  npm run test
  ```

- Testes para Ambiente de Integração Contínua (CI) com cobertura:

  ```bash
  npm run test:ci
  ```

## Documentação

A documentação da API está disponível via Swagger UI. Para acessá-la, utilize o seguinte URL:

```
baseurl/api-docs
```

Substitua `baseurl` pelo endereço base do seu servidor onde a aplicação está hospedada, por exemplo, `localhost:3000/api-docs`. Isso fornecerá acesso à documentação interativa da API, permitindo que você visualize e teste facilmente os endpoints disponíveis.
