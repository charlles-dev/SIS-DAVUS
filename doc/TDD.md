# **Technical Design Document (TDD)**

## **Sistema de Controle de Estoque e Patrimônio \- Davus Engenharia**

Versão: 1.5.1 (Free Tier Deep Dive)  
Data: 28/11/2025  
Status: Especificação Técnica Final  
Arquitetura: Serverless Hybrid & Zero Cost

### **1\. Visão Geral e Restrições do Projeto**

#### **1.1. Objetivo Técnico**

Desenvolver uma aplicação robusta utilizando exclusivamente as camadas gratuitas (Free Tier) de provedores de nuvem modernos, mitigando as limitações de performance (como "cold starts") através de engenharia de software inteligente no Frontend e estratégias de cache.

#### **1.2. Atores e Matriz de Acesso (RBAC)**

O sistema utiliza o django.contrib.auth com grupos estendidos:

* **ADMIN (Admin Patrimonial):**  
  * *Acesso:* Irrestrito.  
  * *Permissões Críticas:* Hard Delete de registros, Ajuste manual de estoque, Configuração de Webhooks.  
* **MANAGER (Engenheiro/Gestor):**  
  * *Acesso:* Leitura e Escrita em Estoque e Ativos. Aprovação de compras.  
  * *Restrição:* Não pode excluir histórico de auditoria.  
* **OPERATOR (Almoxarife):**  
  * *Acesso:* Criação de Movimentações (IN/OUT), Check-in/Check-out.  
  * *Restrição:* Não vê valores monetários (R$) de compras ou ativos.

### **2\. Arquitetura de Solução "Zero Cost"**

#### **2.1. Diagrama de Stack & Fluxo de Dados**

1. **Frontend (Vercel):**  
   * Single Page Application (React \+ Vite).  
   * Hospedagem em Edge Network global.  
   * *Estratégia:* Cache de Assets (Imagens/JS) no CDN da Vercel.  
2. **Backend (Render Web Service \- Free):**  
   * Container Docker rodando Gunicorn \+ Django.  
   * *Limitação:* Hiberna após 15 min de inatividade. Spin-up time: \~30s.  
   * *Mitigação:* "Waking Pixel" (Request leve ao abrir o app) e UptimeRobot.  
3. **Database (Supabase \- Free):**  
   * PostgreSQL 16\.  
   * *Conexão:* Via **Supabase Transaction Pooler (PgBouncer)** na porta 6543\. Isso é crítico pois o Django abre muitas conexões e o plano free limita conexões diretas.  
4. **Cache & Mensageria (Upstash Redis \- Free):**  
   * Redis Serverless via HTTP/TCP.  
   * Uso: Cache de API (Response Cache) e Broker do Celery.

#### **2.2. Estratégia de Tolerância a Falhas**

| Risco | Probabilidade | Mitigação Técnica |
| :---- | :---- | :---- |
| **Cold Start do Backend** | Alta | Frontend exibe loader "Iniciando Servidor..." com feedback visual real. React Query configurado com retry: 3 e retryDelay: 1000\. |
| **Limite de Conexões DB** | Média | Uso obrigatório da porta 6543 (Pooler) e CONN\_MAX\_AGE=0 no Django para fechar conexões rapidamente. |
| **Estouro de Storage (500MB)** | Baixa (Inicial) | Compressão de imagem no Cliente (Browser) antes do upload. Redução para max 1024px/70% quality WebP. |

### **3\. Modelagem de Dados & Otimizações**

#### **3.1. Índices e Performance**

Para compensar a CPU compartilhada do plano gratuito, índices são obrigatórios em colunas de filtro frequente:

* inventory\_product(category\_id, current\_stock): Índice composto para telas de listagem.  
* assets\_asset(asset\_tag): Índice único para buscas rápidas via QR Code.  
* core\_user(username): Índice padrão do Django.

### **4\. Especificação de API**

#### **4.1. Protocolo de Comunicação**

* **RESTful JSON:** Padrão estrito.  
* **Timeouts:** O Render tem hard timeout de 100s. Uploads grandes devem ser feitos diretamente ao Supabase (Signed URLs) ou em chunks (não implementado na v1).

### **5\. Segurança**

* **HTTPS:** Forçado em todas as pontas (Render e Vercel gerenciam SSL).  
* **Dados Sensíveis:** DATABASE\_URL e SECRET\_KEY injetados apenas em tempo de execução via Environment Variables. Nunca commitados.