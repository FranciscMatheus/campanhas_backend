const { send, status } = require('express/lib/response');
const sequel = require('../config/conexao');
const InicioDao = require('../DAO/campDAO');
const inicioDao = new InicioDao(sequel);
const SmsMsg = require('../shared/smsMsg');
const smsMsg = new SmsMsg();
const axios = require('axios');
var fs = require('fs');
const validator = require('validar-telefone');
const cliProgress = require('cli-progress');
const { NULL } = require('mysql/lib/protocol/constants/types');


exports.appteste = async(req,res,next)=>{
    const cpf = identificador('06041499307'+'');
}

exports.appcampanhasBitrixWhats = async (req, res, next) => {
    let msgs = [];
    const wpp_primeira_compra = await inicioDao.primeira_compra();
    const wpp_aniversariante = await inicioDao.aniversariante();
    const wpp_inativo_30_60 = await inicioDao.inativo_30_60();
    const wpp_tempo_cadastro_1_5_7_10_15 = await inicioDao.tempo_cadastro_1_5_7_10_15();
    res.status(200).send();
    await new Promise(r => setTimeout(r, 1000));


    for (let i = 0; i < wpp_primeira_compra.length; i++) {
        const cli = {
            cpf: wpp_primeira_compra[i].cpf.trim(),
            campanha: wpp_primeira_compra[i].campanha,
            telefone: formataTel55(padraoTel(wpp_primeira_compra[i].telefone)),
            tempo: 0,
            mensagemEnviada: 'não',
            identifier: identificador(wpp_primeira_compra[i].cpf.trim().toString())
            
        };
        msgs.push(cli);
    }

    for (let i = 0; i < wpp_aniversariante.length; i++) {
        const cli = {
            cpf: wpp_aniversariante[i].cpf.trim(),
            campanha: wpp_aniversariante[i].campanha,
            telefone: formataTel55(padraoTel(wpp_aniversariante[i].telefone)),
            tempo: 0,
            mensagemEnviada: 'não',
            identifier: identificador(wpp_aniversariante[i].cpf.trim().toString())
        };
        msgs.push(cli);
    }
    for (let i = 0; i < wpp_inativo_30_60.length; i++) {
        const cli = {
            cpf: wpp_inativo_30_60[i].cpf.trim(),
            campanha: wpp_inativo_30_60[i].campanha,
            telefone: formataTel55(padraoTel(wpp_inativo_30_60[i].telefone)),
            tempo: 0,
            mensagemEnviada: 'não',
            identifier: identificador(wpp_inativo_30_60[i].cpf.trim())
        };
        msgs.push(cli);
    }
    for (let i = 0; i < wpp_tempo_cadastro_1_5_7_10_15.length; i++) {
        const cli = {
            cpf: wpp_tempo_cadastro_1_5_7_10_15[i].cpf.trim(),
            campanha: 'Tempo de Cadastro ' + wpp_tempo_cadastro_1_5_7_10_15[i].age.trim(),
            telefone: formataTel55(padraoTel(wpp_tempo_cadastro_1_5_7_10_15[i].telefone)),
            tempo: 0,
            mensagemEnviada: 'não',
            identifier: identificador(wpp_tempo_cadastro_1_5_7_10_15[i].cpf.trim())
        };
        msgs.push(cli);
    }
    if (msgs.length > 0) {
        writeLog('Envio de WhatsApp Campanha', msgs);
        console.log('Enviando a Lista....', msgs.length);
        // VerificarTelefone(msgs)
        let mensg = await sendListaCampanha(msgs, 1, msgs[0].length);
        console.log('Aguardando o envio....', mensg.length);
        console.log(mensg);
        if (mensg.length > 0) {
            backBitrixContato(mensg)
        }
    }

}

exports.appcampanhasSms = async (req, res, next) => {
    console.log('Carregando SMS TeleDigital...');
    let msgs = [];
    const wpp_teledigitalSMS = await inicioDao.teledigitalSMS();
    res.status(200).send();
    await new Promise(r => setTimeout(r, 1000));
    for (let i = 0; i < wpp_teledigitalSMS.length; i++) {
        const cli = {
            cpf: wpp_teledigitalSMS[i].cpf.trim(),
            campanha: wpp_teledigitalSMS[i].campanha,
            tel: padraoTel(wpp_teledigitalSMS[i].tel.trim()),
            msg: 'Ficamos muito felizes por você escolher a Diamantes como sua parceira! Gostariamos de saber sua opiniao sobre nosso atendimento: bit.ly/3G0nQ6Q'
        }
        msgs.push(cli)

    }

    //     let arrayRemove = [
    //      //    87988693177,
    //      65999433535,
    //      82993962495,
    //      13982069516,
    //      88988451267,
    //      98986022986,
    //      95991112963,
    //      89999820805,
    //     ];



    // let newsms = msgs.filter((v,i)=>{
    //     if (!arrayRemove.includes(Number(v.tel))){
    //        return v
    //    }
    // })



    if (msgs.length > 0) {
        console.log('Enviando....', msgs.length);
        let mensg = await sendListaCampanha(msgs, 1, msgs.length);

        console.log('Aguardando o envio....', mensg.length);
        if (mensg.length > 0) {
            writeLog('salvando o log de SMS TeleDigital', mensg);
            await new Promise(r => setTimeout(r, 2000));
            sendSMS(mensg)
        }
    }


}

exports.appcampanhasLojasSms = async(req,res,next)=>{
    console.log('Carregando SMS Lojas...');
    let msgs = [];
    const wpp_lojasSMS = await inicioDao.pesqLojaSMS();
    res.status(200).send();
    await new Promise(r => setTimeout(r, 1000));
    for (let i = 0; i < wpp_lojasSMS.length; i++) {
        const cli = {
            codigo:wpp_lojasSMS[i].cod_pessoa.trim().replace(/([^0-9])/g),
            cpf: wpp_lojasSMS[i].cpf.trim(),
            campanha: wpp_lojasSMS[i].campanha,
            tel: padraoTel(wpp_lojasSMS[i].tel.trim()),
            msg: 'Ficamos muito felizes por você escolher a Diamantes como sua parceira! Gostariamos de saber sua opiniao sobre nosso atendimento: bit.ly/3G0nQ6Q'
        }
        msgs.push(cli)

    }

    
    if (msgs.length > 0) {
        console.log('Carregando a Lista....', msgs.length);
        let mensg = await sendListaCampanha(msgs, 1, msgs.length);

        console.log('Aguardando o envio....', mensg.length);
        if (mensg.length > 0) {
            writeLog('Salvando o log SMS LojaPesquisa', mensg);
            sendSMS(mensg)
        }

    }
}


//Verificar se o telefone está com o 9 ou sem o 9
function padraoTel(tel) {
    if(tel == NULL || tel == undefined){
        tel ='88992208124'

        return tel
    }

    tel = tel.replace('(', '').replace('(', '')
        .replace(')', '').replace(')', '')
        .replace(' ', '').replace(' ', '')
        .replace(' ', '').replace(' ', '')
        .replace(' ', '').replace(' ', '')
        .replace(' ', '').replace(' ', '')
        .replace(' ', '').replace(' ', '')
        .replace('-', '').replace('-', '')
        .replace('-', '').replace('-', '')
        .replace('*', '').replace('*', '')
        .replace('*', '').replace('*', '')
        .replace('+55', '')
    if (tel.substring(0, 1) === '0') {
        tel = tel.substring(1, tel.length);
        tel = tel;
    } else {
        tel = tel;
    }

    var ddd = tel.substring(0, 2);
    tel = tel.substring(2, tel.length);

    if (tel.length == 8) {
        tel = '9' + tel;
    }

    tel = ddd + tel;

    return tel;
}
//Formata o telefone para receber o +55
function formataTel55(num) {
    let tel = String(num).trim();
    if (tel.substring(0, 2) == '55') {
        tel = tel.substring(2);
    }

    tel = tel.replace('(', '').replace('(', '')
        .replace(')', '').replace(')', '')
        .replace(' ', '').replace(' ', '')
        .replace(' ', '').replace(' ', '')
        .replace(' ', '').replace(' ', '')
        .replace(' ', '').replace(' ', '')
        .replace(' ', '').replace(' ', '')
        .replace('-', '').replace('-', '')
        .replace('-', '').replace('-', '')
        .replace('*', '').replace('*', '')
        .replace('*', '').replace('*', '')
        .replace('+55', '')

    if (tel.substring(0, 1) === '0') {
        tel = tel.substring(1, tel.length);
        tel = '+55' + tel;
    } else {
        tel = '+55' + tel;
    }

    return tel;
}

async function sendListaCampanha(lista, extra, pausa) {
    console.log('Configurando o tempo da lista', lista.length);

    let time = 0
    let dest1 = embaralhar(lista)
    await new Promise(r => setTimeout(r, 2000));// milesegundo
    let dest = embaralhar(dest1)
    for (let num = 0; num < dest.length; num++) {
        if ((num % pausa) == 0 && num > 0) {
            await new Promise(r => setTimeout(r, 120000));// milesegundo
        }

        time = time + ((Math.floor(Math.random() * (30)) + extra));
        dest[num].tempo = time
    }
    return dest
}

//Criar log
async function writeLog(nmarq, arq) {
    let dt = new Date();
    let dados = arq;
    let nm = dt.getFullYear() + '-' + (dt.getMonth() + 1) + '-' + dt.getDate();
    fs.writeFile(`C:\\RestLogs\\${nm}-${nmarq}.txt`, JSON.stringify(dados), function (erro) {

        if (erro) {
            console.log('-------------------')
            console.log('erro salvar arquivo')
            console.log('-------------------')
            throw erro;
        }

        console.log("Log Registrado: " + nmarq);
    });
}

//Enviar SMS
async function sendSMS(dest) {
    console.log('Enviando o SMS');
    const bar = new cliProgress.SingleBar({format: 'progress [{bar}] {percentage}% | ETA: {eta}s | {value}/{total}|{msg}'}, cliProgress.Presets.shades_classic);
    bar.start(dest.length, 0,{msg:''});
    for (num in dest) {
        smsMsg.send({
            numero: dest[num].tel,
            msg: dest[num].msg
        }).then(res => {
            if (!res.result) {
                console.log("Falha ao enviar mensagem para o número  " + dest[num].tel);
                console.log("Resultado:", res.response)
            }
        })

        if (dest[num].campanha=='Compras realizadas nas lojas') {
            await inicioDao.insertPesqLojaSMS(dest[num]);
        }
        bar.increment(1,{msg:''});
        console.log(dest[num].tel);

        if (num!=(dest.length-1)) {
            await new Promise(r => setTimeout(r, 1000 * 12));
        }else{
            break;
        }
    }
    bar.stop()
    console.log('Fim do envio dos SMS');
}

//Função de Embaralhar
function embaralhar(array) {
    console.log('Embaralhando a lista');
    var indice_atual = array.length, valor_temporario, indice_aleatorio;

    while (0 !== indice_atual) {

        indice_aleatorio = Math.floor(Math.random() * indice_atual);
        indice_atual -= 1;

        valor_temporario = array[indice_atual];
        array[indice_atual] = array[indice_aleatorio];
        array[indice_aleatorio] = valor_temporario;
    }

    return array;
}

async function backBitrixContato(dados) {
    let clients = dados;
    let contatos = [];
    let contatos_update = [];
    let falhas = 0;
    let erro = 1;


    try {
        //contatos
        try {
            for (let i = 0; i < clients.length; i++) {
                // console.log(clients[i].cpf);
                const contato = await axios.post('https://diamantesl.bitrix24.com.br/rest/22/hjs1n3jqhco2jkvj/crm.contact.list',
                    { "start": -1, "filter": { "SECOND_NAME": clients[i].cpf } });
                // console.log(contato.data.result[0] ? contato.data.result[0].SECOND_NAME : "");
                if (contato.data.result.length > 0 && contato.data.result[0].SECOND_NAME == clients[i].cpf) {
                    let cli = {
                        ID: contato.data.result[0].ID,
                        SECOND_NAME: contato.data.result[0].SECOND_NAME
                    }
                    contatos.push(cli);
                }
                await new Promise(r => setTimeout(r, 1000));
                console.log('-------------------')
                console.log('contato.... ' + i)
                console.log('-------------------')
            }
        } catch (e) {
            console.log(e)
            erro = 2;
            falhas++;
            throw 'Erro Geral';
        }
        console.log('Terminou a busca')
        if (erro == 2) {
            throw 'Erro Geral';
        }
        //separação de contatos que será realizado update
        for (let i = 0; i < clients.length; i++) {
            for (let j = 0; j < contatos.length; j++) {
                console.log(clients[i].cpf, "/", contatos[j].SECOND_NAME)
                if (clients[i].cpf == contatos[j].SECOND_NAME) {
                    let cli = {
                        ID: contatos[j].ID,
                        CAMPANHA: clients[i].campanha,
                        TELEFONE: clients[i].telefone,
                        TEMPO: clients[i].tempo,
                        MENSAGEM_ENVIADA: clients[i].mensagemEnviada,
                        IDENTIFICADOR: clients[i].identifier,
                    }
                    contatos_update.push(cli);
                    temp = null;
                    break;
                }
            }
        }
        console.log('-------------------')
        console.log('separou....')
        console.log('-------------------')
        console.log('atualizar', contatos_update.length)


        //atualizar contatos

        for (let i = 0; i < contatos_update.length; i++) {
            try {
                await new Promise(r => setTimeout(r, 3000));

                const req2 = await axios.post('https://diamantesl.bitrix24.com.br/rest/22/hjs1n3jqhco2jkvj/crm.contact.update',
                    {
                        id: contatos_update[i].ID,
                        fields: {
                            "UF_CRM_1632395655": contatos_update[i].CAMPANHA,
                            "UF_CRM_1645098425": contatos_update[i].TELEFONE,
                            "UF_CRM_1632395632": contatos_update[i].TEMPO,
                            "UF_CRM_1631565161": contatos_update[i].MENSAGEM_ENVIADA,
                            "UF_CRM_1645727804": contatos_update[i].IDENTIFICADOR


                        },
                        params: { "REGISTER_SONET_EVENT": "F" }
                    });
                console.log('-------------------')
                console.log('atualizou....' + contatos_update[i].ID)
                console.log('-------------------')


            } catch (e) {
                falhas++;
                console.log('-------------------')
                console.log('FALHA....' + contatos_update[i].ID)
                console.log('-------------------')
                await new Promise(r => setTimeout(r, 2500));
            }
        }
        console.log('-------------------')
        console.log('Fim da Atualização do contato...')
        console.log('-------------------')
    } catch (e) {
        console.log(e)
    }
}



async function VerificarTelefone(numero) {
    for (tel in numero) {
        console.log(validator(numero[tel].telefone == true ? null : writeLog('Salvando o log SMS LojaPesquisa', numero[tel].telefone)));
        // console.log(validator(numero[tel].telefone));
    }
}


 function identificador(cpf) {

    let arrayDiam=['m','t','d','s','i','g','n','e','a','l']
    let arrayCpf = ''
    for (num in cpf){
        arrayCpf+=(arrayDiam[Number(cpf[num])])
    }
    //console.log(arrayCpf);
    return arrayCpf;
}
