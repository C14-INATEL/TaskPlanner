FROM jenkins/jenkins:lts-jdk17

# Alterna para root para instalar os pacotes de sistema
USER root

# Copia o script de configuração para dentro do container
COPY setup-ambientes.sh /tmp/setup-ambientes.sh

# Dá permissão de execução e roda o script de instalação
RUN chmod +x /tmp/setup-ambientes.sh && /tmp/setup-ambientes.sh

# Remove o script temporário após a instalação
RUN rm /tmp/setup-ambientes.sh

# Retorna para o usuário padrão do Jenkins por boas práticas de segurança
USER jenkins