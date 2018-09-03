# Instalação do kernel no raspbarry

Antes de configurar o kernel no Raspbarry, instale o SO raspbian with Desktop, no raspbarry.
Caso seja necessário inverter a tela, adicione a linha "lcd_rotate=2" no final do arquivo "/boot/config.txt".

Seguir o seguinte tutorial:
https://www.w3schools.com/nodejs/nodejs_raspberrypi.asp

Executar "sudo raspi-config" e alterar password do usuário "pi", inserir SSID e senha do wifi, alterar o timezone, renomear o host para "bigboxx", atualizar o utilitário e ativar SSH.

Configurar no /etc/ssh/sshd_config:

```
TCPKeepAlive yes

ClientAliveInterval 60

```

## Instalando o mongodb

Baixar os binários MongoDB 3.0.14 para rapbian stretch encontrados em https://andyfelong.com/2017/08/mongodb-3-0-14-for-raspbian-stretch/ , 
baixe o  **mongodb_stretch_3_0_14_core.zip** e o  **mongodb_stretch_3_0_14_tools.zip**.

* Cheque pelo usuário mongoDB:

```shell
$ grep mongodb /etc/passwd
```
* Se nenhum usuário, crie:

```shell
$ sudo adduser --ingroup nogroup --shell /etc/false --disabled-password --gecos "" \ --no-create-home mongodb
```

* Faça para cada binario baixado anteriormente:

```shell
$ cd dir-with-binaries
$ sudo chown root:root mongo*
$ sudo chmod 755 mongo*
$ sudo strip mongo*
$ sudo cp -p mongo* /usr/bin
```

* Criar arquivo de logs com as permissões necessárias

```shell
$ sudo mkdir /var/log/mongodb
$ sudo chown mongodb:nogroup /var/log/mongodb
```

*Criar diretório de dados com as permissões necessárias

```shell
$ sudo mkdir /var/lib/mongodb
$ sudo chown mongodb:root /var/lib/mongodb
$ sudo chmod 775 /var/lib/mongodb
``` 

* Criar mongodb.conf em etc/

```shell
$ cd /etc
$ sudo vi mongodb.conf
```
* Inserir no arquivo

```
# /etc/mongodb.conf
# minimal config file (old style)
# Run mongod --help to see a list of options

bind_ip = 127.0.0.1,10.147.10.22(este é o ipv4 pelo qual vc deseja acessar remotamente o mongo)
quiet = true
dbpath = /var/lib/mongodb
logpath = /var/log/mongodb/mongod.log
logappend = true
storageEngine = mmapv1
```

* Criar um .service em systemd/system/

```shell
$ cd /lib/systemd/system
$ sudo vi 
``` 

* Insira no arquivo

```
[Unit]
Description=High-performance, schema-free document-oriented database
After=multi-user.target

[Service]
User=mongodb
ExecStart=/usr/bin/mongod --quiet --config /etc/mongodb.conf

[Install]
WantedBy=multi-user.target
```

* Para habilitar a inicialização do mongodb junto ao SO, faça: 

```shell
$ systemctl enable mongodb.service
```

Assim o serviço do mongodb iniciará automaticamente após o modo multi-usuário ser ativado, isso levará 1 minuto após ligarmos o raspbarry +/-.

Para verificar se está executando, faça 

```shell
$ systemctl status mongodb.service
```

## Instalando o node e os servidor do ecattle

* Atualizar o raspbian:

```shell
apt-get -y update
apt-get -y upgrade
apt-get -y dist-upgrade
apt autoremove
```

* Instalar o Node:

```shell
curl -sL https://deb.nodesource.com/setup_10.x | sudo -E bash -
apt-get update
apt-get install nodejs
```

Atualizar o npm:
```shell
npm install -g npm@latest
```

### Instalar o git

* Inserir no usuário "update" do GitLab a chave SSH do Raspberry:

```shell
ssh-keygen -t rsa -C "update@cnpgc.embrapa.br" -b 4096
vi ~/.ssh/id_rsa.pub
```

* Criar diretório "/var/bigboxx" e clonar repositórios Kernel.
* clonar também o repositório api.
* Dar o "npm install" e "npm update" nos repositórios.

## Habilitando a inicialização do kernel junto ao SO

* Criar um script start_ecattle.sh :

```shell
$ vim /usr/lib/systemd/scripts/start_ecattle.sh
```
* Inserir no arquivo o seguinte:

```sh
#!/bin/bash

rm /var/lib/mongodb/mongod.lock               <--remover arquivo .lock caso exista (evita muitos problemas)
node /var/bigboxx/kernel/bin/server.js & node /var/bigboxx/api/bin/server.js && fg   <--executar os scripts do node em paralelo 

exit 0

```
* Dê as permissões necessárias:

```shell
$ chmod 755 /usr/lib/systemd/scripts/start_ecattle.sh
```

* Criar um arquivo .service:

```shell
$vim /etc/systemd/system/ecattle.service
```

* Insira no arquivo o seguinte:

```
[Unit]
 Description=Start ecattle scripts
 After=multi-user.target

[Service]
User=root
ExecStart=/bin/bash /usr/lib/systemd/scripts/start_ecattle.sh

[Install]
WantedBy=multi-user.target

```

* Dê as permissões necessárias:

```shell
$chmod 755 /lib/systemd/system/ecattle.service
``` 

* Habilitar a execução no startup

```shell
$systemctl daemon-reload
$systemctl enable ecattle.service
```

