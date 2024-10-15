function geraListaSorteada() {
  let nomeCurso = document.sorteio.nomeCurso.value;
  let nomePolo = document.sorteio.nomePolo.value;
  let cota = document.sorteio.cota.value;
  let inscritos = document.sorteio.totalInscritos.value;
  let semente;
  if (document.sorteio.semente.value) {
    semente = document.sorteio.semente.value;
  } else {
    semente = new Date().getTime();
  }

  let embaralhada = gereListaEmbaralhada(inscritos, semente);
  
  imprimeResultado(nomeCurso, semente, embaralhada, nomePolo, cota);
  // baixaListaCSV(embaralhada, nomeCurso, nomePolo, cota);
}

function gereListaEmbaralhada(inscritos, semente) {
  Math.seedrandom(semente);
  let consumida = new Array(inscritos);
  let resultado = new Array(inscritos);
  for (let i = 0; i < inscritos; i++) {
    consumida[i] = 1 + i;
    resultado[i] = 0;
  }

  for (let i = 0; i < inscritos; i++) {
    let aleatorio = Math.floor(Math.random() * inscritos);
    while (consumida[aleatorio] == 0) {
      aleatorio = (1 + aleatorio) % inscritos;
    }
    resultado[i] = consumida[aleatorio];
    consumida[aleatorio] = 0;
  }

  return resultado;
}

function imprimeResultado(nomeCurso, semente, embaralhada, nomePolo, cota) {
  let divImpressao = document.getElementById('resultado');
  let conteudo = `
  <div class="col">
    <div class="row justify-content-center">
      ${geraCabecalhoDaLista()}
      <div class="col-md-6">
      <table class="table table-striped table-sm" style="margin-left: 1rem;">
        <caption style="caption-side: top; text-align: center;">Classificação do Sorteio para ${cota}</br>${nomeCurso} - Polo ${nomePolo}</caption>
        <tr><td>Posição</td><td>Número de Inscrição</td></tr>
        ${gereVisualDeListaDeSelecionados(embaralhada)}
      </table>
      </div>
      ${gereVisualDeFim()}
      ${geraVisualDeInformacoes(semente)}
    </div>
  </div>
  `;


  divImpressao.value = conteudo;
  divImpressao.innerHTML = conteudo;
}

function geraCabecalhoDaLista() {
  return `
    <div class="col-md-1">
      <img class="img-responsive text-center" src="republica_brasao_cor_rgb.jpg" alt="Brasão da República" width="100%" height="100%">
    </div>
      <div class="text-center text-sm">MINISTÉRIO DA EDUCAÇÃO</div>
      <div class="text-center text-sm">Instituto Federal do Paraná</div>
      <div class="text-center text-sm">Diretoria de Educação a Distância</div>
    `;
}

function gereVisualDeListaDeSelecionados(lista) {
  let conteudo = "";
  for (let i = 0; i < lista.length; i++) {
    conteudo += "<tr><td>" + padSpaces(lista[i], lista.length) + (i + 1) + "º</td><td>&emsp;&emsp;&emsp; " + lista[i] + "</td></tr>";
  }
  return conteudo;
}

function gereVisualDeFim() {
  return `<br/><p class="text-center">${'.'.repeat(160)}</p>`;
}

function geraVisualDeInformacoes(semente) {
  let dateTime = new Date();

  return `
  <H4 class="text-center">Informações do Sorteio</H4>
  <div class="text-center text-sm">Data e Hora: ${dateTime.toLocaleDateString()} ${dateTime.toLocaleTimeString()}</div>
  <div class="text-center text-sm">Semente utilizada: ${semente}</div>
  <div class="text-center text-sm">Sistema: ${navigator.userAgent}</div>
  `;
}

function padSpaces(atual, maximo) {
  var conteudo = "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;";
  var espacosExtras = (maximo + "").length - (atual + "").length;

  for (var i = 1; i <= espacosExtras; i++) {
    conteudo += "&nbsp;";
  }

  return conteudo;
}

function baixaListaCSV(lista, nomeCurso, nomePolo, cota){
  let csvContent = 'posicao,inscricao\n';

  lista.forEach((row, index) => {
  csvContent += `${index+1},${row}\n`;
})

const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8,' })
const objUrl = URL.createObjectURL(blob);
const link = document.createElement("a");
link.href = objUrl;
link.download = `${nomePolo}_${nomeCurso}_${cota}_${new Date().getTime()}.csv`;

document.body.appendChild(link);

link.dispatchEvent(
  new MouseEvent('click', { 
    bubbles: true, 
    cancelable: true, 
    view: window 
  })
);

document.body.removeChild(link);

}