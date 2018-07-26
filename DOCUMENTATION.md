# Documentação do Projeto

## Validação de dados sensoriais

A validação de dados sensoriais consiste em

+ Nós temos um contrato?
+ O que foi enviado está de acordo com o contrato?
+ Os dados das medidas estão corretos?

## Modelo do contrato
Para se fazer um contrato com o e-cattle, deve-se fazer uma requisição HTTP pelo método POST no endpoint /devices/ com o seguinte padrão:
```json
    {
        "name":"Snooper",
        "description":"dispositivo de medicao", 
        "branch":"embrapa", 
        "model":"snooper1.0" , 
        "mac":"2c:3a:e8:1b:03:41" ,
        "sensors":[
            {"type":"type-air-temperature" , "descriptor":"temperatura da estufa" , "name":"dht22_1"},
            {"type":"type-air-temperature" , "descriptor":"temperatura da estufa" , "name":"termopar"},
            {"type":"type-relative-humidity" , "descriptor":"humidade" , "name":"dht22_2"},
            {"type":"type-co2" , "descriptor":"detecção de gases inflamaveis" , "name":"MQ-2"}
        ]
    }
```

## Envio de dados sensoriais

A medida deve ser enviada através de uma requisição HTTP pelo método POST no endpoint /measures/ com o seguinte padrão:

```json
   {
        "mac":"2c:3a:e8:1b:01:50",
        "token":"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjViNThiNDNjZTAwMTlmMDM3OGIwNjZlZiIsIm5hbWUiOiJTbm9vcGVyIiwibWFjIjoiMmM6M2E6ZTg6MWI6MDE6NTAiLCJpYXQiOjE1MzI1NDczMzUsImV4cCI6MTUzMjYzMzczNX0.jdvLTfSiThR28cawXMPQ3nCdjrnDXDOcBLCbgZW6cd4",
        "measures":[
            {
                "name":"dht22_1",
                "value" : 20.0,
                "date": 123344567
            },
            {
                "name":"termopar",
                "value" : 21.3,
                "date": 123344567
            },
            {
                "name":"dht22_2",
                "value" : 48.3,
                "date": 123344567
            },
            {
                "name":"MQ-2",
                "value": 0.0,
                "date":  123344567
            }
        ]
    }
```

### Fluxo

A requisição é interceptada pelo **measure-route.js** onde ele verifica a validade do **token** através da função **authorizeDevice** do **auth-service.js**. Se o token for dado como inválido um **HTTP Response** é enviado para o cliente da requisição com o **HTTP Status** 401 com o corpo da resposta contendo:

```json
    {
        "message": "Token Inválido"
    }
```
Caso o **token** for considera válido, então a requisição continua para o **measure-controller** chamando a função **create**. Ela verficará se o **MAC** do dispositivo remetente está registrado e ativado na base de dados através do método **authenticate** do **device-repository.js**. Caso o MAC ou não esteja cadastrado na base ou não esteja ativado, então um HTTP Response com status 404 será enviado ao cliente contendo o seguinte dado:

```json
{
    "message": "Dispositivo Inválido ou Bloqueado"
}
```

Caso o dispositivo exista na base de dados e esteja ativo, então o **measure-controller** verificará se, na requisição, foi informado uma coleção (lista) de dados sensoriais lido em `req.body.measures`. Caso não haja, na requisção, tal informação então será enviado um HTTP Response com *status* 404 contendo o seguinte dado:

```json
{
    "message": "É necessário informar os dados sensoriais"
}
```

Caso haja então uma lista de dados sensoriais, em `req.body.measures` então o `measure-controller` fará uma iteração sobre esta lista verificando se cada objeto `measure` dentro da lista `req.body.measures` é uma medida na qual seu tipo é reconhecida pelo sistema (para mais informações sobre essa validação consulte a seção: **Validação de dados sensoriais**) e o device tem autorização de envio. Se por acaso houver, pelo menos um dado sensorial no qual, ou o dispositivo não tem autorização de envio, ou o dado sensorial não seja de um tipo reconhecido, então um HTTP Response será enviado ao cliente com *status* 404 contendo o seguinte dados:

```json
{
    "message": "Sensor: <nome-do-sensor> inexistente ou não autorizado para este dispositivo"
}
```

Caso os dados sensoriais sejam válidos, tanto em reconhecimento do tipo e de autorização do dispositivo, então o `measure-controller` salvará cada dado sensorial da lista `req.body.measures`. Caso o processo haja algum erro interno um HTTP Response com *status* 500 será enviado ao cliente com o seguinte dado:

```json
{
    "message": "Falha ao salvar dado sensorial: <nome-do-sensor>"
}
```

Caso o processo ocorra sem erros um HTTP Response com *status* 201 será enviado com o seguinte dado:

```json
{
    "message": "Dado sensorial salvo com sucesso"
}
```