# campanhas_backend

campanha de sms pesquisa loja

select * from (select /*(select (  
                CASE WHEN (  AA.CD_EMPRESA = 1) THEN    
           CASE    
           (SELECT X.DS_SALDO  
           FROM VR_PRD_TIPOSALDO X  
           WHERE X.CD_SALDO =   AA.cd_saldo ) WHEN 'SALDO DPA' THEN 'DPA' WHEN 'SALDO LOJA' THEN 'LOJA BR'  
            WHEN 'TELEVENDAS 1' THEN 'LOJA TELEVENDAS 1'  WHEN 'TELEVENDAS 2' THEN 'LOJA TELEVENDAS 2'  
            WHEN 'TELEVENDAS 3' THEN  'LOJA TELEVENDAS 3'  WHEN 'TELEVENDAS 4' THEN  'LOJA TELEVENDAS 4'  
            WHEN 'TELEVENDAS 5' THEN 'LOJA TELEVENDAS 5'  WHEN 'TELEVENDAS 6' THEN 'LOJA TELEVENDAS 6'  
            WHEN 'TELEVENDAS 7' THEN 'LOJA TELEVENDAS 7'  WHEN 'TELEVENDAS 8' THEN  'LOJA TELEVENDAS 8'  
            WHEN 'TELEVENDAS 9' THEN 'LOJA TELEVENDAS 9'  WHEN 'TELEVENDAS 10' THEN 'LOJA TELEVENDAS 10'  
            ELSE (SELECT X.DS_SALDO  
           FROM VR_PRD_TIPOSALDO X  
           WHERE X.CD_SALDO =   AA.cd_saldo)                          
            END  
            WHEN (  AA.CD_EMPRESA = 2) THEN 'LOJA FORTALEZA 2'  
            WHEN (  AA.CD_EMPRESA = 7) THEN 'LOJA FORTALEZA 3'  
            WHEN (  AA.CD_EMPRESA = 8) THEN 'LOJA FORTALEZA 5'  
            WHEN (  AA.CD_EMPRESA = 17) THEN 'LOJA AFINIDADES'  
         
           WHEN (  AA.CD_EMPRESA = 33) THEN CASE    
             AA.cd_saldo WHEN '1' THEN 'LOJA ITABAIANA' WHEN '17' THEN 'LOJA OUTRAN' ELSE (SELECT X.DS_SALDO  
           FROM VR_PRD_TIPOSALDO X  
           WHERE X.CD_SALDO =   AA.cd_saldo)
            END  
           else
           ( select xx.nm_grupoempresa from vr_ger_empresa xx where xx.cd_empresa =   AA.cd_empresa)  
           END
         )
         from venda_por_class AA
         where   AA.id = (
         select max(h.id)
         from venda_por_class h
         where h.cd_empresa = a.cd_empresa and h.cd_pessoa = a.cd_pessoa
         )) as loja,*/
                         distinct cd_pessoa as COD_PESSOA,
                       F_DIC_PES_NOME(A.CD_PESSOA) as NOME,
                     F_DIC_PES_CPFCNPJ(A.CD_PESSOA) as cpf,
                     'Compras realizadas nas lojas' as campanha,
                     F_DIC_PES_TELEFONE2('002',A.CD_PESSOA,NULL) as TEL
                     from VR_TRA_TRANSACAO A
                     where
                      A.tp_situacao = '4'
                     and A.tp_operacao = 'S'
                     and A.tp_modalidade in ('4','8')
                     and A.DT_TRANSACAO = CURRENT_DATE-1
                     and A.CD_PESSOA not in (select crm.cd_cliente  from cli_rec_men crm where rec_mensagem = false)
                     /*FILTRA SOMENTE CLIENTES QUE NAO TIVEREM MENSAGEM ENVIADA OU CUJA DATA DO ULTIMO ENVIO FAZ MAIS DE 15 DIAS*/                    
                     and (case when ((select (DATE(CURRENT_DATE) - DATE(W.DT_ENVIO)) from camp_msg W where W.cd_cliente = A.CD_PESSOA) is null) then 1
                     when ((select (DATE(CURRENT_DATE) - DATE(W.DT_ENVIO)) from camp_msg W where W.cd_cliente = A.CD_PESSOA) > 15) then 1 else 0 END) = 1
                     and (select MAX(W.CD_SALDO) from VR_GER_OPERACAO W where W.CD_OPERACAO = A.CD_OPERACAO) != 34) m
                     where M.TEL is not null