# Desafio Softplan

Essa é a implementação do frontend do desafio para o processo seletivo da [Softplan](http://www.softplan.com.br). 
Se trata apenas de um cadastro e listagem de pessoas físicas. É uma Single-page application (SPA) escrita com Angular integrada com uma API escrita em Java.

## Processo de build e deploy

Todo o processo de build e deploy da aplicação é feito utilizando o Docker, portanto é necessário ter o Docker instalado. Basta seguir o passo-a-passo:

**ATENÇÃO:** a aplicação por padrão está configurada para acessar uma API rodando na mesma máquina (no localhost), para apontar para a API rodando em outro endereço, basta modificar a variável de ambiente no arquivo src/environments/environment.homologacao.ts, modificando o parâmetro API_URL para apontar para o endereço desejado.

*  Faça clone deste repositório: 

    `git clone https://github.com/geovannyAvelar/desafio-softplan-frontend.git`
*  Entre no diretório do repositório e faça build utilizando o Docker Compose:
    
    `cd desafio-softplan-frontend`
    
    `docker build -t cadastro-frontend .`
*  Terminado o processo de build, faça o deploy com:

    `docker run -d -p 80:80 --name cadastro-front cadastro-frontend`
