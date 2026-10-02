// Interações originais preservadas; a coleta está em portal.js.
function sincronizarFaturamentoInput() {
      const input = document.getElementById('inputFaturamento');
      const range = document.getElementById('rangeFaturamento');
      if (input && range) {
        range.value = input.value;
      }
      calcularProjecao();
    }

function sincronizarFaturamentoSlider() {
      const input = document.getElementById('inputFaturamento');
      const range = document.getElementById('rangeFaturamento');
      if (input && range) {
        input.value = range.value;
      }
      calcularProjecao();
    }

function calcularProjecao() {
      const rngInvest = document.getElementById('rangeInvest');
      const rngCpl = document.getElementById('rangeCpl');
      const selTaxa = document.getElementById('selectTaxaReuniao');
      const inputFat = document.getElementById('inputFaturamento');

      if (!rngInvest || !rngCpl) return;

      const invest = parseFloat(rngInvest.value) || 3500;
      const cpl = parseFloat(rngCpl.value) || 180;
      const taxaReuniao = parseFloat(selTaxa ? selTaxa.value : 0.30) || 0.30;
      const fatAberto = parseFloat(inputFat ? inputFat.value : 15000) || 0;

      // Rótulos dos Sliders
      document.getElementById('valInvestSimulado').innerText = `R$ ${invest.toLocaleString('pt-BR', {minimumFractionDigits: 2})}`;
      document.getElementById('valCplSimulado').innerText = `R$ ${cpl.toLocaleString('pt-BR', {minimumFractionDigits: 2})}`;

      // 1. Projeção de Leads: Verba ÷ CPL
      const leads = Math.floor(invest / cpl);
      
      // 2. Reuniões Agendadas: Leads x Taxa de Reunião
      const reunioes = Math.round(leads * taxaReuniao);
      
      // 3. Pipeline de Oportunidades: Reuniões x Faturamento por Negócio
      const pipeline = reunioes * fatAberto;

      // 4. ROAS Estimado: Faturamento Aberto ÷ Investimento
      const roas = invest > 0 ? (fatAberto / invest).toFixed(2) : '0.00';

      // Atualiza os valores visíveis nos cards
      document.getElementById('simLeads').innerText = `${leads} Leads`;
      document.getElementById('simReunioes').innerText = `${reunioes} Reuniões`;
      document.getElementById('simPipeline').innerText = `R$ ${pipeline.toLocaleString('pt-BR', {minimumFractionDigits: 2})}`;
      document.getElementById('simRoas').innerText = `ROAS ${roas}x`;

      // Fórmulas matemáticas explicativas em tempo real
      document.getElementById('simCalcFormulaLeads').innerText = `R$ ${invest.toLocaleString('pt-BR')} ÷ R$ ${cpl} = ${leads} Leads`;
      document.getElementById('simCalcFormulaReunioes').innerText = `${Math.round(taxaReuniao * 100)}% de ${leads} Leads = ${reunioes} Agendamentos`;
      document.getElementById('simCalcFormulaPipeline').innerText = `${reunioes} Reuniões x Ticket R$ ${(fatAberto / 1000).toFixed(1)}k`;
      document.getElementById('simCalcFormulaRoas').innerText = `R$ ${fatAberto.toLocaleString('pt-BR')} Faturamento (ROAS ${(fatAberto / invest).toFixed(2)}x)`;
    }

function switchPipelineTab(tab) {
      const blockConcluidos = document.getElementById('pipelineConcluidosBlock');
      const blockFuturos = document.getElementById('pipelineFuturosBlock');
      const tabBtnConcluidos = document.getElementById('tabBtnConcluidos');
      const tabBtnFuturos = document.getElementById('tabBtnFuturos');

      if (!blockConcluidos || !blockFuturos) return;

      if (tab === 'concluidos') {
        blockConcluidos.classList.remove('hidden');
        blockFuturos.classList.add('hidden');
        tabBtnConcluidos.className = 'px-4 py-2 rounded-xl font-bold transition-all shadow-xs bg-zinc-950 text-white cursor-pointer';
        tabBtnFuturos.className = 'px-4 py-2 rounded-xl font-bold transition-all shadow-xs bg-zinc-100 text-zinc-600 hover:bg-zinc-200 cursor-pointer';
      } else {
        blockConcluidos.classList.add('hidden');
        blockFuturos.classList.remove('hidden');
        tabBtnFuturos.className = 'px-4 py-2 rounded-xl font-bold transition-all shadow-xs bg-zinc-950 text-white cursor-pointer';
        tabBtnConcluidos.className = 'px-4 py-2 rounded-xl font-bold transition-all shadow-xs bg-zinc-100 text-zinc-600 hover:bg-zinc-200 cursor-pointer';
      }
    }

function scrollToSection(id) {
      const sec = document.getElementById(id);
      if (sec) {
        sec.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }
