function escapePreview(value) {
  return String(value || '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
}
function safePreviewUrl(value) {
  try { const url = new URL(value); return ['https:', 'http:'].includes(url.protocol) ? escapePreview(url.href) : ''; } catch { return ''; }
}
// Interações originais preservadas; a coleta está em portal.js.
function alternarAba(nomeAba) {
      ['dashboard', 'passoapasso', 'anamnese'].forEach(aba => {
        const modulo = document.getElementById(`tab-conteudo-${aba}`);
        const btn = document.getElementById(`btn-tab-${aba}`);
        if (modulo && btn) {
          if (aba === nomeAba) {
            modulo.classList.remove('hidden');
            btn.className = "tab-btn-active px-4 py-2 rounded-xl font-bold transition-all flex items-center gap-1.5 whitespace-nowrap cursor-pointer";
          } else {
            modulo.classList.add('hidden');
            btn.className = "tab-btn-inactive px-4 py-2 rounded-xl font-bold transition-all flex items-center gap-1.5 whitespace-nowrap cursor-pointer";
          }
        }
      });

      if (history.replaceState) {
        history.replaceState(null, null, `?tab=${nomeAba}`);
      }
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }

function abrirModalGoogleAds() {
      document.getElementById('modalGoogleAds').classList.remove('hidden');
      selecionarCampanhaModal('camp-1');
    }

function fecharModalGoogleAds() {
      document.getElementById('modalGoogleAds').classList.add('hidden');
    }

function selecionarCampanhaModal(idCamp) {
      // Highlight sidebar button
      ['camp-1', 'camp-2', 'camp-3', 'camp-4'].forEach(id => {
        const btn = document.getElementById(`btn-${id}`);
        if (id === idCamp) {
          btn.className = "w-full text-left p-3 rounded-xl font-mono text-xs transition-all bg-indigo-50 border border-indigo-200 text-indigo-900 font-bold cursor-pointer";
        } else {
          btn.className = "w-full text-left p-3 rounded-xl font-mono text-xs transition-all hover:bg-zinc-100 border border-transparent text-zinc-700 cursor-pointer";
        }
      });

      // READ REAL-TIME DATA FROM ANAMNESE INPUTS
      const liveSiteUrl = safePreviewUrl(document.getElementById('an_siteUrl')?.value) || 'https://casadevideo.com.br';
      const liveDriveUrl = escapePreview(document.getElementById('an_driveUrl')?.value) || 'https://drive.google.com/drive/folders/...';
      const liveNomeEmpresa = escapePreview(document.getElementById('an_nomeEmpresa')?.value) || 'Casa de Vídeo Produções Ltda';
      const liveDiferenciais = escapePreview(document.getElementById('an_diferenciais')?.value) || 'Acabamento cinematográfico em 4K, equipe própria...';
      const liveRegiao = escapePreview(document.getElementById('an_regiao')?.value) || 'Brasil (Principais Capitais Comerciais)';

      const liveTitulo1 = escapePreview(document.getElementById('an_titulo1')?.value) || 'Produtora de Vídeo B2B Brasil';
      const liveTitulo2 = escapePreview(document.getElementById('an_titulo2')?.value) || 'Filmes Corporativos & Comerciais';
      const liveTitulo3 = escapePreview(document.getElementById('an_titulo3')?.value) || 'Peça uma Proposta Audiovisual';
      const liveTitulo4 = escapePreview(document.getElementById('an_titulo4')?.value) || 'Vídeos Institucionais 4K';
      const liveTitulo5 = escapePreview(document.getElementById('an_titulo5')?.value) || 'Produtora de Filmes Publicitários';
      const liveTitulo6 = escapePreview(document.getElementById('an_titulo6')?.value) || 'Vídeos para Marcas & Agências';

      const liveDesc1 = escapePreview(document.getElementById('an_desc1')?.value) || 'Sua empresa precisa de vídeos que geram resultados reais?';
      const liveDesc2 = escapePreview(document.getElementById('an_desc2')?.value) || 'Transforme sua comunicação corporativa...';
      const liveSitelinks = (escapePreview(document.getElementById('an_sitelinks')?.value) || 'Portfólio B2B, Vídeos Institucionais, Comerciais de TV, Falar com Diretor em 24h').split(',').map(s => s.trim());

      // DEFINITION OF CAMPAIGN DETAILS & AMPLAS/FRASE KEYWORDS
      const configCampanhas = {
        'camp-1': {
          nome: "Search | Lead | Marca-CasaDeVideo | BR",
          tipoOuro: "Campanha 1 — Dominação Top 1 no Google (Branded)",
          momentoFunil: "📌 Fundo de Funil (Decisão Direta & Retenção de Marca)",
          explicacaoDidatica: "Esta campanha entra em ação quando o cliente já ouviu falar da Casa de Vídeo ou recebeu uma indicação e pesquisa pelo nome exato no Google. Ela busca ampliar a presença da marca, impedindo que concorrentes comprem o termo 'Casa de Vídeo' nos leilões do Google.",
          orcamento: "R$ 20,00 / dia (R$ 600,00 / mês)",
          redes: "Rede de Pesquisa do Google",
          geotargeting: liveRegiao,
          idiomas: "Português, Inglês",
          lances: "Maximizar Conversões",
          palavras: [
            { termo: "\"casa de video\"", tipo: "Frase", explicacao: "Captura buscas contendo a marca inteira", iq: "A medir" },
            { termo: "casa de video producoes", tipo: "Ampla Inteligente", explicacao: "Captura buscas com variações como 'produtora casa de video audiovisual'", iq: "A medir" },
            { termo: "\"produtora casa de video\"", tipo: "Frase", explicacao: "Garante captura exata da reputação institucional", iq: "A medir" },
            { termo: "casa de video brasil", tipo: "Ampla", explicacao: "Cobre pesquisas institucionais de empresas em todo o Brasil", iq: "A medir" }
          ],
          rsa: {
            titulos: [liveNomeEmpresa, "Produtora Audiovisual B2B", liveTitulo3, "Showreel 2026", "Atendimento em 24h"],
            descricoes: [liveDesc1, liveDesc2]
          }
        },
        'camp-2': {
          nome: "Search | Lead | Produtora-Video-B2B | BR",
          tipoOuro: "Campanha 2 — Vendas B2B Intenção Direta",
          momentoFunil: "🎯 Fundo / Meio de Funil (Intenção Direta de Compra B2B)",
          explicacaoDidatica: "É o principal motor de aquisição de clientes da Casa de Vídeo. Entra em ação quando um Diretor de Marketing ou CEO digita termos como 'produtora de vídeo corporativo' ou 'produtora b2b'. Após a aprovação da verba pelo cliente, a oportunidade de conversão no site é altíssima!",
          orcamento: "R$ 50,00 / dia (R$ 1.500,00 / mês)",
          redes: "Rede de Pesquisa do Google",
          geotargeting: liveRegiao,
          idiomas: "Português",
          lances: "Maximizar Conversões (Meta tCPL: R$ 180,00)",
          palavras: [
            { termo: "produtora de video b2b", tipo: "Ampla Inteligente", explicacao: "Captura todas as buscas de empresas procurando produtoras de vídeo B2B no Brasil", iq: "A medir" },
            { termo: "\"produtora de video corporativo\"", tipo: "Frase", explicacao: "Captura termos como 'orçamento produtora de video corporativo'", iq: "A medir" },
            { termo: "\"produtora de filmes publicitarios\"", tipo: "Frase", explicacao: "Captura pesquisas por comerciais de TV e campanhas publicitárias", iq: "A medir" },
            { termo: "produtora audiovisual empresas", tipo: "Ampla Inteligente", explicacao: "Captura diretores pesquisando produtoras para comunicação empresarial", iq: "A medir" },
            { termo: "\"produtora de video para marketing\"", tipo: "Frase", explicacao: "Atrai gestores de marketing buscando parceiros audiovisuais", iq: "A medir" },
            { termo: "produtora de comercial tv web", tipo: "Ampla", explicacao: "Atrai marcas que buscam criar filmes publicitários para televisão e internet", iq: "A medir" }
          ],
          rsa: {
            titulos: [liveTitulo1, liveTitulo2, liveTitulo3, liveTitulo4, liveTitulo5, liveTitulo6],
            descricoes: [liveDesc1, liveDesc2]
          }
        },
        'camp-3': {
          nome: "Search | Lead | Concorrentes-Audiovisuais | BR",
          tipoOuro: "Campanha 3 — Conquista de Tráfego Comparativo",
          momentoFunil: "⚔️ Meio / Fundo de Funil (Comparação de Mercado)",
          explicacaoDidatica: "Esta campanha exibe a Casa de Vídeo quando clientes estão pesquisando marcas concorrentes conhecidas de grande porte (ex: O2, Sentimental, Conspiração). Ela apresenta a Casa de Vídeo como uma opção cinematográfica premium em 4K, ágil e competitiva.",
          orcamento: "R$ 20,00 / dia (R$ 600,00 / mês)",
          redes: "Rede de Pesquisa do Google",
          geotargeting: liveRegiao,
          idiomas: "Português",
          lances: "Maximizar Conversões",
          palavras: [
            { termo: "\"o2 filmes produtora\"", tipo: "Frase", explicacao: "Captura buscas cotando a produtora O2", iq: "A medir" },
            { termo: "\"sentimental filme\"", tipo: "Frase", explicacao: "Captura buscas cotando a produtora Sentimental", iq: "A medir" },
            { termo: "\"conspiracao filmes\"", tipo: "Frase", explicacao: "Captura pesquisas por Conspiração Filmes", iq: "A medir" },
            { termo: "produtoras audiovisuais grandes sp brasil", tipo: "Ampla Inteligente", explicacao: "Captura quem está mapeando as principais produtoras do mercado", iq: "A medir" }
          ],
          rsa: {
            titulos: ["Casa de Vídeo — Produtora B2B", "Alta Qualidade & Entrega Ágil", "Compare Orçamento Audiovisual", liveTitulo4],
            descricoes: [liveDesc1, liveDesc2]
          }
        },
        'camp-4': {
          nome: "PMax | Lead | Performance-Showreel-4K | BR",
          tipoOuro: "Campanha 4 — Multicanal PMax & Descoberta Visual",
          momentoFunil: "🎨 Topo / Meio de Funil & Remarketing Multicanal",
          explicacaoDidatica: "Impacta visualmente diretores de marketing e CEOs no YouTube, Gmail, Display e Google Search através do vídeo Showreel 4K e imagens do set de filmagens vinculados via link do Google Drive da Anamnese.",
          orcamento: "R$ 26,00 / dia (R$ 800,00 / mês)",
          redes: "Google Multicanal (YouTube 4K, Display, Gmail, Search e Maps)",
          geotargeting: liveRegiao,
          idiomas: "Português, Inglês",
          lances: "Maximizar Conversões",
          palavras: [
            { termo: "Sinais de Intenção: Interesses em Produção Audiovisual & Marketing B2B", tipo: "Sinais Intenção", explicacao: "Segmenta decisores de empresas no YouTube e Display", iq: "Alta" },
            { termo: "Remarketing: Visitantes do site casadevideo.com.br", tipo: "First-Party Data", explicacao: "Reimpacta quem visitou o site mas ainda não preencheu o formulário", iq: "Alta" },
            { termo: "Link do Google Drive de Mídias", tipo: "Drive URL", explicacao: liveDriveUrl, iq: "Sincronizado" }
          ],
          rsa: {
            titulos: ["Showreel Casa de Vídeo 2026", "Produções Audiovisuais 4K", liveTitulo2],
            descricoes: [liveDesc1, liveDesc2]
          }
        }
      };

      const c = configCampanhas[idCamp];

      const html = `
        <!-- Header da Campanha Selecionada -->
        <div class="bg-white p-5 rounded-2xl border border-zinc-200 space-y-3 shadow-sm">
          <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
            <div>
              <span class="font-mono text-[10px] text-indigo-600 font-bold uppercase bg-indigo-50 px-2.5 py-0.5 rounded border border-indigo-200">
                ${c.tipoOuro}
              </span>
              <h3 class="font-display font-bold text-xl text-zinc-950 mt-1">${c.nome}</h3>
            </div>
            <span class="font-mono text-xs bg-emerald-100 text-emerald-800 px-3 py-1 rounded-xl font-bold border border-emerald-300">● Ativa no Google Ads</span>
          </div>

          <div class="grid grid-cols-1 sm:grid-cols-3 gap-3 font-mono text-xs pt-1">
            <div class="bg-zinc-50 p-3 rounded-xl border border-zinc-200">
              <span class="text-zinc-500 text-[10px] block">Orçamento Diário:</span>
              <strong class="text-indigo-600 font-bold text-sm">${c.orcamento}</strong>
            </div>
            <div class="bg-zinc-50 p-3 rounded-xl border border-zinc-200">
              <span class="text-zinc-500 text-[10px] block">Estratégia de Lances:</span>
              <strong class="text-zinc-900 font-bold">${c.lances}</strong>
            </div>
            <div class="bg-zinc-50 p-3 rounded-xl border border-zinc-200">
              <span class="text-zinc-500 text-[10px] block">Geotargeting Nacional:</span>
              <strong class="text-zinc-900 font-bold">${c.geotargeting}</strong>
            </div>
          </div>
        </div>

        <!-- BOX DIDÁTICO: MOMENTO DA JORNADA & ESTRATÉGIA DE CONVERSÃO -->
        <div class="bg-amber-50/80 p-5 rounded-2xl border border-amber-200 space-y-2 font-sans text-xs">
          <div class="flex items-center gap-2">
            <span class="font-mono font-bold text-amber-900 text-xs uppercase bg-amber-200/80 px-2 py-0.5 rounded">💡 Entendendo a Estratégia & Momento do Cliente</span>
            <span class="font-mono font-bold text-amber-800 text-[11px]">${c.momentoFunil}</span>
          </div>
          <p class="text-zinc-800 leading-relaxed text-xs">
            ${c.explicacaoDidatica}
          </p>
        </div>

        <!-- DADOS DA ANAMNESE SINCRONIZADOS -->
        <div class="bg-white p-5 rounded-2xl border border-zinc-200 space-y-3 font-sans text-xs">
          <div class="flex items-center justify-between border-b border-zinc-100 pb-2">
            <h4 class="font-display font-bold text-sm text-zinc-950 uppercase flex items-center gap-2">
              <span>📋 Informações Sincronizadas da Anamnese</span>
            </h4>
            <span class="font-mono text-[10px] text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded font-bold border border-emerald-200">Live Sync</span>
          </div>

          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 font-mono text-[11px]">
            <div>
              <span class="text-zinc-500 text-[10px] block">Site Oficial Destino:</span>
              <a href="${liveSiteUrl}" target="_blank" class="text-indigo-600 underline font-bold">${liveSiteUrl}</a>
            </div>
            <div>
              <span class="text-zinc-500 text-[10px] block">Mídias no Google Drive (Banners/Vídeos):</span>
              <span class="text-indigo-700 font-bold truncate block">${liveDriveUrl}</span>
            </div>
            <div class="sm:col-span-2">
              <span class="text-zinc-500 text-[10px] block">Diferenciais Únicos Aplicados:</span>
              <span class="text-zinc-800 font-sans text-xs block">${liveDiferenciais}</span>
            </div>
          </div>
        </div>

        <!-- PALAVRAS-CHAVE CONFIGURADAS (AMPLAS & FRASE) -->
        <div class="bg-white p-5 rounded-2xl border border-zinc-200 space-y-3">
          <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
            <h4 class="font-display font-bold text-sm text-zinc-950 uppercase">🔑 Palavras-Chave Amplas e Frase no Grupo STAG</h4>
            <span class="font-mono text-[10px] text-blue-700 bg-blue-50 px-2.5 py-0.5 rounded font-bold border border-blue-200">Sobral STAG Protocol</span>
          </div>

          <p class="font-sans text-xs text-zinc-600">
            Utilizamos correspondências <strong>Ampla Inteligente</strong> e de <strong>Frase</strong> para capturar todas as variações de termos digitados pelos diretores de marketing no Google, enquanto a lista de 45+ palavras negativas bloqueia buscas irrelevantes.
          </p>

          <div class="overflow-x-auto">
            <table class="w-full text-left font-mono text-xs border-collapse">
              <thead>
                <tr class="border-b border-zinc-200 text-zinc-400 text-[10px] uppercase">
                  <th class="pb-2">Palavra-Chave / Termo</th>
                  <th class="pb-2">Correspondência</th>
                  <th class="pb-2">O que esta palavra captura? (Estratégia)</th>
                  <th class="pb-2">Índice Qualidade (IQ)</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-zinc-100">
                ${c.palavras.map(p => `
                  <tr>
                    <td class="py-2.5 font-bold text-zinc-950">${p.termo}</td>
                    <td>
                      <span class="${p.tipo.includes('Ampla') ? 'bg-blue-50 text-blue-700 border-blue-200' : 'bg-indigo-50 text-indigo-700 border-indigo-200'} border px-2 py-0.5 rounded text-[10px] font-bold">
                        ${p.tipo}
                      </span>
                    </td>
                    <td class="font-sans text-xs text-zinc-600">${p.explicacao}</td>
                    <td class="font-bold text-emerald-600">${p.iq}</td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
          </div>
        </div>

        <!-- VISUALIZAÇÃO FIEL DO ANÚNCIO (RSA) -->
        <div class="bg-white p-5 rounded-2xl border border-zinc-200 space-y-3">
          <h4 class="font-display font-bold text-sm text-zinc-950 uppercase flex items-center justify-between">
            <span>📱 Visualização Fiel do Anúncio Responsivo (Google Search)</span>
            <span class="font-mono text-[10px] text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded font-bold border border-emerald-200">Tríade P-A-P Nota 10/10</span>
          </h4>

          <div class="bg-white border border-zinc-300 rounded-2xl p-5 shadow-sm space-y-2 font-sans">
            <div class="flex items-center gap-2 font-mono text-xs text-zinc-700">
              <span class="bg-zinc-200 text-zinc-900 font-bold px-1.5 py-0.5 rounded text-[10px]">Patrocinado</span>
              <span class="text-zinc-500">${liveSiteUrl}</span>
              <span class="text-zinc-400">› produtora-b2b</span>
            </div>
            
            <h3 class="text-blue-700 hover:underline text-lg font-medium cursor-pointer leading-snug">
              ${c.rsa.titulos[0]} | ${c.rsa.titulos[1]} | ${c.rsa.titulos[2] || 'Orçamento em 24h'}
            </h3>

            <p class="text-zinc-600 text-xs leading-relaxed">
              ${c.rsa.descricoes[0]}
            </p>

            <div class="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2 border-t border-zinc-100 font-sans text-xs">
              ${liveSitelinks.map(s => `
                <div class="text-blue-700 hover:underline cursor-pointer font-medium text-[11px]">
                  • ${s}
                </div>
              `).join('')}
            </div>
          </div>
        </div>
      `;

      document.getElementById('conteudoCampanhaModal').innerHTML = html;
    }

function baixarAnamneseMD() {
      const nomeEmpresa = document.getElementById('an_nomeEmpresa').value;
      const siteUrl = document.getElementById('an_siteUrl').value;
      const nicho = document.getElementById('an_nicho').value;
      const regiao = document.getElementById('an_regiao').value;
      const diferenciais = document.getElementById('an_diferenciais').value;

      const ofertaServicos = document.getElementById('an_ofertaServicos').value;
      const verbaMetas = document.getElementById('an_verbaMetas').value;
      const conversaoSite = document.getElementById('an_conversaoSite').value;

      const icpCargos = document.getElementById('an_icpCargos').value;
      const objecoes = document.getElementById('an_objecoes').value;

      const camp1Marca = document.getElementById('an_camp1Marca').value;
      const camp2B2B = document.getElementById('an_camp2B2B').value;
      const camp3Concorrentes = document.getElementById('an_camp3Concorrentes').value;
      const camp4PMax = document.getElementById('an_camp4PMax').value;

      // AD VARIATIONS MATRIX
      const titulo1 = document.getElementById('an_titulo1').value;
      const titulo2 = document.getElementById('an_titulo2').value;
      const titulo3 = document.getElementById('an_titulo3').value;
      const titulo4 = document.getElementById('an_titulo4').value;
      const titulo5 = document.getElementById('an_titulo5').value;
      const titulo6 = document.getElementById('an_titulo6').value;
      const titulosAdicionais = document.getElementById('an_titulosAdicionais').value;

      const desc1 = document.getElementById('an_desc1').value;
      const desc2 = document.getElementById('an_desc2').value;
      const desc3 = document.getElementById('an_desc3').value;
      const desc4 = document.getElementById('an_desc4').value;

      const driveUrl = document.getElementById('an_driveUrl').value;
      const sitelinks = document.getElementById('an_sitelinks').value;

      const termosNegativos = document.getElementById('an_termosNegativos').value;

      const mdContent = `# 📋 Anamnese & Briefing de Tráfego Pago — ${nomeEmpresa}

Data de Preenchimento: ${new Date().toLocaleDateString('pt-BR')}
Metodologia: Nova Gestão de Tráfego (Sobral Framework) & Agente BE | Ads • b.rocket

---

## 🏢 1. Ficha da Empresa & Diferenciais Competitivos
- **Nome da Empresa / Marca**: ${nomeEmpresa}
- **Site Oficial (Destino do Tráfego)**: ${siteUrl}
- **Nicho de Atuação**: ${nicho}
- **Região de Atuação Comercial**: ${regiao}
- **Diferenciais Competitivos Únicos**:
  ${diferenciais}

---

## 🔺 2. O Triângulo de Ouro das Vendas
- **Pilar 1: Oferta & Serviços Prioritários**:
  ${ofertaServicos}
- **Pilar 2: Tráfego, Verba & Metas de CPL**:
  ${verbaMetas}
- **Pilar 3: Conversão no Site Oficial (casadevideo.com.br)**:
  ${conversaoSite}

---

## 🎯 3. ICP (Perfil de Comprador Ideal) & Objeções
- **Cargos & Tomadores de Decisão**:
  ${icpCargos}
- **Principais Dores & Objeções Mapeadas**:
  ${objecoes}

---

## 🏆 4. Direcionamento das 4 Campanhas de Ouro (Google Ads)
1. **Campanha 1 (Dominação Marca Branded Top 1)**:
   - Keywords: ${camp1Marca}
2. **Campanha 2 (Vendas B2B Direct - Search)**:
   - Keywords: ${camp2B2B}
3. **Campanha 3 (Concorrentes Direct)**:
   - Keywords: ${camp3Concorrentes}
4. **Campanha 4 (PMax Showreel 4K Multicanal)**:
   - Ativos: ${camp4PMax}

---

## ✍️ 5. Matriz de Anúncios Responsivos (Títulos, Descrições & Mídias no Drive)

### 📌 Títulos dos Anúncios (Headlines - Max 30 Caracteres):
1. **Palavra-Chave Principal**: ${titulo1}
2. **Oferta de Serviço**: ${titulo2}
3. **Chamada para Ação (CTA)**: ${titulo3}
4. **Qualidade Técnica**: ${titulo4}
5. **Publicidade**: ${titulo5}
6. **Público Alvo**: ${titulo6}
7. **Títulos Adicionais (7 a 15)**: ${titulosAdicionais}

### 📝 Descrições dos Anúncios (Descriptions - Max 90 Caracteres):
1. ${desc1}
2. ${desc2}
3. ${desc3}
4. ${desc4}

### 📁 Pasta do Google Drive (Imagens, Banners & Vídeos):
- **URL da Pasta com Ativos no Drive**: ${driveUrl}
- **Extensões de Sitelinks**: ${sitelinks}

---

## ⛔ 6. Termos Negativos & Exclusões
- **Consultas a Bloquear**:
  ${termosNegativos}

---
*Gerado via Portal BE | Ads • b.rocket para continuidade operacional.*
`;

      const blob = new Blob([mdContent], { type: 'text/markdown;charset=utf-8;' });
      const link = document.createElement('a');
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', `anamnese_trafego_pago_${nomeEmpresa.toLowerCase().replace(/[^a-z0-9]/g, '_')}.md`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      setTimeout(() => URL.revokeObjectURL(url), 1000);

      alert('✅ Arquivo "anamnese_trafego_pago_casa_de_video.md" gerado e baixado com sucesso!');
    }

function copiarResumoAnamnese() {
      const mdContent = `ANAMNESE & MATRIZ DE ANÚNCIOS TRÁFEGO PAGO - CASA DE VÍDEO:
Empresa: ${document.getElementById('an_nomeEmpresa').value}
Região: ${document.getElementById('an_regiao').value}
Drive Mídias: ${document.getElementById('an_driveUrl').value}
Título 1: ${document.getElementById('an_titulo1').value}
Título 2: ${document.getElementById('an_titulo2').value}
Descrição 1: ${document.getElementById('an_desc1').value}`;

      navigator.clipboard.writeText(mdContent);
      alert('📋 Resumo da Anamnese copiado para a área de transferência!');
    }
