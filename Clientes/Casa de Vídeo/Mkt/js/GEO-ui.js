// Interações originais preservadas; a coleta está em portal.js.
function showTab(tabId) {
      // Esconde todas as panes
      const panes = document.querySelectorAll('.tab-pane');
      panes.forEach(pane => {
        pane.classList.remove('active-pane');
      });

      // Exibe a pane selecionada
      const activePane = document.getElementById('pane-' + tabId);
      if (activePane) {
        activePane.classList.add('active-pane');
      }

      // Desativa todos os botões de abas
      const tabBtns = document.querySelectorAll('.tab-btn');
      tabBtns.forEach(btn => {
        btn.classList.remove('tab-active');
      });

      // Ativa o botão selecionado
      const activeBtn = document.getElementById('btn-tab-' + tabId);
      if (activeBtn) {
        activeBtn.classList.add('tab-active');
      }
    }

function filtrar56Prompts() {
      const input = document.getElementById('inputBusca56Prompts');
      const filter = input.value.toLowerCase();
      const items = document.querySelectorAll('.card-prompt-item');
      let count = 0;

      items.forEach(item => {
        const text = item.textContent || item.innerText;
        if (text.toLowerCase().indexOf(filter) > -1) {
          item.style.display = "";
          count++;
        } else {
          item.style.display = "none";
        }
      });

      document.getElementById('countPromptsVisiveis').innerText = count;
    }
