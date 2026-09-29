---
name: deploy-cdv
description: Executa o fluxo completo de build, commit, push e deploy automático do projeto Casa de Vídeo (cdv.berocket.com.br / dashboard.berocket.com.br) no servidor Coolify PaaS. Ative sempre que o usuário solicitar deploy, publicação em produção, atualização do site cdv.berocket.com.br ou envio de alterações.
---

# Skill: Deploy Automático Casa de Vídeo (cdv.berocket.com.br)

Esta skill documenta e automatiza o procedimento padronizado de publicação e deploy do ecossistema **Casa de Vídeo (b.rocket)** em produção no **Coolify PaaS**.

---

## 📌 Informações da Aplicação e Servidor

- **URLs de Produção:**
  - `https://cdv.berocket.com.br`
  - `https://dashboard.berocket.com.br`
- **UUID da Aplicação no Coolify:** `gdjf1tnq7levuy2npetakjs8`
- **Nome no Coolify:** `Casa de Video`
- **Repositórios Git:**
  - Remote `cdv`: `https://github.com/agencia-berocket/cdv.git` (Branch `main`)
  - Remote `origin`: `https://github.com/agencia-berocket/geo.git` (Branch `main`)

---

## 🚀 Fluxo de Deploy em 5 Passos

Sempre que o usuário solicitar um deploy ("faz o deploy", "sobe pra produção", "publica no cdv", etc.), execute os 5 passos abaixo sequencialmente:

### 1. Verificar o Status Local do Git
Execute no diretório raiz do projeto:
```bash
git status
```

### 2. Adicionar e Commitar as Alterações
Se houver modificações pendentes, adicione e faça o commit com uma mensagem descritiva em português:
```bash
git add .
git commit -m "feat(deploy): atualizacoes e melhorias no portal cdv.berocket.com.br"
```

### 3. Enviar para os Repositórios Remotos (Git Push)
Garanta o envio para os dois remotes mapeados (`cdv` e `origin`):
```bash
git push cdv main
git push origin main
```

### 4. Disparar Deploy no Coolify via MCP Tool
Chame a ferramenta MCP `coolify` -> `deploy` com os seguintes parâmetros:
```json
{
  "tag_or_uuid": "gdjf1tnq7levuy2npetakjs8",
  "wait": true
}
```

### 5. Confirmar o Resultado e Informar o Usuário
Após a ferramenta retornar `"status": "finished"`, apresente o resumo do deploy com os links clicáveis `file:///` e URLs de produção em Português do Brasil:
- **Status:** 🟢 Implantação Concluída com Sucesso (`finished`)
- **Commit:** Hash do commit implantado
- **Duração:** Tempo decorrido em segundos
- **URLs de Produção:**
  - [https://cdv.berocket.com.br](https://cdv.berocket.com.br)
  - [https://dashboard.berocket.com.br](https://dashboard.berocket.com.br)
