const { query } = require('express');
const database = require('../config/database');
var moment = require('moment')
class CampDAO {
    constructor(pg) {
        this._pg = pg;
    }

    //ok
    async primeira_compra() {
        try {
            const resultDB = await this._pg.diamantes.query(`SELECT f_dic_pes_cpfcnpj(X.CD_PESSOA) as cpf,
            'Primeira Compra' AS campanha,
            regexp_replace((F_DIC_PES_TELEFONE2('002',X.CD_PESSOA, NULL)), '[^0-9]', '', 'gi') as telefone
           FROM VR_TRA_TRANSACAO X
           WHERE X.TP_SITUACAO = '4'
           AND X.TP_MODALIDADE IN ('4','8')
           AND X.TP_OPERACAO = 'S'
           and x.CD_PESSOA not in (select crm.cd_cliente  from cli_rec_men crm where rec_mensagem = false)
           AND X.DT_TRANSACAO = CURRENT_DATE -1
           AND X.DT_TRANSACAO = (SELECT MIN(W.DT_TRANSACAO) FROM VR_TRA_TRANSACAO W WHERE W.TP_SITUACAO = '4'
           AND W.TP_MODALIDADE IN ('4','8') AND W.TP_OPERACAO = 'S' AND W.CD_PESSOA = X.CD_PESSOA)
           GROUP BY X.CD_PESSOA`)
            if (resultDB[0].length > 0) {
                return resultDB[0]
            }
            return false;
        } catch (error) {
            throw {
                status: 500,
                msg: 'Erro Interno, tente novamente'
            };
        }
    }
    //ok
    async aniversariante() {
        try {
            const resultDB = await this._pg.diamantes.query(`SELECT f_dic_pes_cpfcnpj(Z.CD_PESSOA) as cpf,
            'Aniversariantes' AS campanha,
            regexp_replace((F_DIC_PES_TELEFONE2('002',Z.CD_PESSOA, NULL)), '[^0-9]', '', 'gi') as telefone
          FROM (SELECT W.CD_PESSOA,
          W.DT_NASCIMENTO,
          W.DT_ATUAL,
          ((CAST((SELECT MAX(X.DT_TRANSACAO)
          FROM VR_TRA_TRANSACAO X
          WHERE X.CD_PESSOA = W.CD_PESSOA
          AND X.TP_SITUACAO = '4'
          AND X.TP_MODALIDADE IN ('4','8')
          AND X.TP_OPERACAO = 'S') as date))
          +
          90)AS DT_INATIVACAO,
          (CURRENT_DATE - INTERVAL '12 MONTHS') AS DT_CORTE
          FROM (SELECT A.CD_PESSOA,
          TO_CHAR(A.DT_NASCIMENTO,'DD/MM') AS DT_NASCIMENTO,
          TO_CHAR(CURRENT_DATE,'DD/MM') AS DT_ATUAL
          FROM VR_PES_PESFISICA A where CD_PESSOA not in (select crm.cd_cliente  from cli_rec_men crm where rec_mensagem = false)) W
          WHERE W.DT_NASCIMENTO = W.DT_ATUAL) Z
          WHERE CAST(Z.DT_INATIVACAO AS DATE) > CAST(Z.DT_CORTE AS DATE)`)
            if (resultDB[0].length > 0) {
                return resultDB[0]
            }
            return false;
        } catch (error) {
            throw {
                status: 500,
                msg: 'Erro Interno, tente novamente'
            };
        }
    }
    //ok
    async inativo_30_60() {
        try {
            const resultDB = await this._pg.diamantes.query(`SELECT  f_dic_pes_cpfcnpj(W.CD_PESSOA) as cpf,
            (CASE W.NR_DIAS
           WHEN '30' THEN 'Inativo 30'
           WHEN '60' THEN 'Inativo 60'
           END) as campanha,
           regexp_replace((F_DIC_PES_TELEFONE2('002',W.CD_PESSOA, NULL)), '[^0-9]', '', 'gi') as telefone
           FROM (SELECT X.CD_PESSOA,
           CURRENT_DATE - (CAST(MAX(X.DT_MOVIMENTO) AS DATE) + 90) AS NR_DIAS
           FROM VENDA_POR_CLASS X where x.CD_PESSOA not in (select crm.cd_cliente  from cli_rec_men crm where rec_mensagem = false)
           GROUP BY X.CD_PESSOA) W
           WHERE W.NR_DIAS IN (30,60)`)
            if (resultDB[0].length > 0) {
                return resultDB[0]
            }
            return false;
        } catch (error) {
            throw {
                status: 500,
                msg: 'Erro Interno, tente novamente'
            };
        }
    }
    //validar
    async tempo_cadastro_1_5_7_10_15() {
        try {
            const resultDB = await this._pg.diamantes.query(`SELECT f_dic_pes_cpfcnpj(T.CD_PESSOA) as cpf,
            T.AGE,
            regexp_replace((F_DIC_PES_TELEFONE2('002',T.CD_PESSOA, NULL)), '[^0-9]', '', 'gi') as telefone
            FROM (SELECT X.CD_PESSOA,
            CAST(AGE(CURRENT_DATE , X.DT_PRIMEIRA_COMPRA) AS TEXT) AS AGE
            FROM (SELECT W.CD_PESSOA,MIN(W.DT_TRANSACAO) AS DT_PRIMEIRA_COMPRA
            FROM VR_TRA_TRANSACAO W,VR_PES_PESSOA G, PES_CLIENTE T
            WHERE W.TP_SITUACAO = '4'
            AND W.CD_PESSOA = G.CD_PESSOA
            AND G.IN_INATIVO = 'F'
            AND W.TP_MODALIDADE IN ('4','8')
            AND W.TP_OPERACAO = 'S'
            AND G.CD_PESSOA = T.CD_CLIENTE
            AND T.IN_INATIVO = 'F'
            GROUP BY W.CD_PESSOA) X) T
            WHERE T.AGE IN ('1 year','2 years','3 years','4 years','5 years','6 years','7 years','8 years','9 years','10 years','11 years','12 years','13 years','14 years','15 years','16 years','17 years','18 years','19 years','20 years')`)
            if (resultDB[0].length > 0) {
                return resultDB[0]
            }
            return false;
        } catch (error) {
            throw {
                status: 500,
                msg: 'Erro Interno, tente novamente'
            };
        }
    }
    //ok
    async teledigitalSMS() {
        try {
            const resultDB = await this._pg.diamantes.query(`select * from (select
                distinct A.CD_PESSOA as COD_PESSOA,
               F_DIC_PES_NOME(A.CD_PESSOA) as NOME,
               F_DIC_PES_CPFCNPJ(A.CD_PESSOA) as cpf,
               'Compras realizadas no teledigital' as campanha,
               F_DIC_PES_TELEFONE2('002',A.CD_PESSOA,NULL) as TEL
               from VR_TRA_TRANSACAO A
               where A.CD_EMPRESA = 1
               and A.tp_situacao = '4'
               and A.tp_operacao = 'S'
               and A.tp_modalidade in ('4','8')
               and A.DT_TRANSACAO = CURRENT_DATE-1
               and A.CD_PESSOA not in (select crm.cd_cliente  from cli_rec_men crm where rec_mensagem = false)
               and (select MAX(W.CD_SALDO) from VR_GER_OPERACAO W where W.CD_OPERACAO = A.CD_OPERACAO) = 34) m
               where M.TEL is not null`)
            if (resultDB[0].length > 0) {
                return resultDB[0]
            }
            return false;
        } catch (error) {
            throw {
                status: 500,
                msg: 'Erro Interno, tente novamente'
            };
        }
    }

    async pesqLojaSMS() {
        try {
            const resultDB = await this._pg.diamantes.query(`select * from (select distinct cd_pessoa as COD_PESSOA,
                F_DIC_PES_NOME(A.CD_PESSOA) as NOME,
              F_DIC_PES_CPFCNPJ(A.CD_PESSOA) as cpf,
              'Compras realizadas nas lojas' as campanha,
              F_DIC_PES_TELEFONE2('002',A.CD_PESSOA,NULL) as TEL,
               (select (DATE(CURRENT_DATE) - DATE(W.DT_ENVIO)) from camp_msg w where W.cd_cliente = A.CD_PESSOA) as envio
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
              where M.TEL is not null`)
            if (resultDB[0].length > 0) {
                return resultDB[0]
            } else {
                return false;
            }
        } catch (error) {
            throw {
                status: 500,
                msg: 'Erro Interno, tente novamente'
            };
        }
    }

    async insertPesqLojaSMS(dados){
        try {
           
            const {codigo,cpf,campanha} = dados
            let sql = `INSERT INTO public.camp_msg(cd_cliente, cd_cpf_cnpj, ds_tp_msg)VALUES ('${codigo}','${cpf}','${campanha}')returning *`;
            let res = await this._pg.diamantes.query(sql);

        } catch (error) {
            console.log(error);
            throw new Error("Ocorreu um erro")
        }
    }

    async updatePesqLojaSMS(dados){
        try {
            const {cpf} = dados
            const resultDB = await this._pg.diamantes.query(`select w.id from camp_msg w where w.cd_cpf_cnpj = $1`,{bind:[dados]})
            console.log(resultDB[0]);
            if (resultDB[0].length > 0) {
                try {
                    let sql = 'UPDATE camp_msg SET ';
                    let datUpdate = moment(new Date, "YYYY MM DD HH:mm:ss").format("YYYY-MM-DD HH:mm:ss")
                    // console.log(moment(new Date, "YYYY MM DD hh:mm:ss"));
                    // console.log(datUpdate);
                    sql += `dt_envio = '${datUpdate}' where id = ${resultDB[0][0].id} returning *`
                    let result = await this._pg.diamantes.query(sql)
                    // console.log(result);
                } catch (error) {
                    console.log(error);
            throw new Error("Ocorreu um erro, update pesquisa loja")
                }
            } else {
                return false;
            }
        } catch (error) {
            console.log(error);
            throw new Error("Ocorreu um erro, Select de busca id, pesquisa loja")
        }
    }

    async insertCampanha(dados){
        try {
           
            const {codigo,nome,cpf,tel,tp_camp,campanha,msg} = dados
            
            let res = await this._pg.diamantes.query(`INSERT INTO public.log_camp_msg(cd_cliente, ds_nome, cd_cpf_cnpj, cd_telefone, ds_tp_camp, ds_campanha, ds_msg)VALUES ($1,$2,$3,$4,$5,$6,$7)returning *`,{bind:[codigo,nome,cpf,tel,tp_camp,campanha,msg]});
            
        } catch (error) {
            console.log(error);
            throw new Error("Ocorreu um erro")
        }
    }
}

module.exports = CampDAO