# gera lista de classificados a partir do sorteio
import sys
import pandas as pd

from datetime import datetime

def gera_classificados(sorteio_filename='', inscritos_filename='', categoria=''):
    df_sorteio = pd.read_csv('exemplo_sorteio.csv')
    df_inscritos = pd.read_csv('exemplo_inscritos.csv')
    print(f'Inscritos: {df_inscritos["inscricao"].count()}\nSorteio: {df_sorteio["inscricao"].count()}')
    df_classificacao = pd.merge(left=df_sorteio, right=df_inscritos, how='left', on='inscricao')
    df_classificacao.to_csv(f'classificacao_{categoria}.csv')

    # checa se algum inscrito ficou fora da classificacao
    df_inscrito_fora_lista = df_classificacao[~df_classificacao['inscricao'].isin(df_inscritos['inscricao'])]
    if not df_inscrito_fora_lista.empty:
        print('Existem inscritos fora da lista')
        df_inscrito_fora_lista.to_csv(f'inscrito_fora_lista_{categoria}.csv')

if __name__ == '__main__':
    if len(sys.argv) < 3:
        print("Inclua os parametros dos nomes dos arquivos\nExemplo: python3 arq1.csv arq2.csv")
        exit(0)
    categoria = sys.argv[3] if (len(sys.argv) > 3) else f'{int(datetime.today().timestamp())}'
    gera_classificados(str(sys.argv[1]), str(sys.argv[2]), categoria)