// Interações originais preservadas; a coleta está em portal.js.
function filtrarTabelaKw() {
      const input = document.getElementById('inputBuscaKw');
      const filter = input.value.toLowerCase();
      const tbody = document.getElementById('tabelaPalavrasBody');
      const trs = tbody.getElementsByTagName('tr');

      for (let i = 0; i < trs.length; i++) {
        const text = trs[i].innerText.toLowerCase();
        trs[i].style.display = text.includes(filter) ? '' : 'none';
      }
    }
