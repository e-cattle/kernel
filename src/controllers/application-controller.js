'use strict'

const applicationRepository = require('../repositories/application-repository')
const applicationAuth = require('../auth/application-auth')

// Cadastra ou Altera o Application
exports.save = async (req, res, next) => {
  try {
    let application = req.body

    // Cadastra o Aplicativo
    const newApplication = await applicationRepository.save(application)

    // Geração do Token
    // Gera o token valido para o dispositivo
    const token = await applicationAuth.generateToken({
      date: newApplication.changed,
      id: newApplication._id,
      name: newApplication.name,
    })

    // Envia o novo token para o dispositivo
    res.status(201).send({
      token: token
    })

    return
  } catch (error) {
    res.status(500).send(error)
    throw error
  }
}

exports.all = async (req, res, next) => {
  try {
    const applications = await applicationRepository.getAll()

    if (!applications) {
      res.status(404).send({ message: 'Aplicativos não encontrados!' })
      return
    }

    res.status(200).send(applications)
  } catch (e) {
    res.status(500).send({ message: 'Falha na requisição!', data: e })
  }
}

// exports.enable = async (req, res, next) => {
//   if (!req.params.mac) {
//     res.status(401).json({ message: 'MAC não fornecido!' })
//     return
//   }

//   try {
//     const mac = req.params.mac

//     const device = await deviceRepository.enableByMac(mac)

//     if (!device) {
//       res.status(404).json({ message: 'Dipositivo não encontrado!' })

//       return
//     }

//     res.status(200).json(device)
//   } catch (e) {
//     res.status(500).json({ message: 'Falha na requisição!', data: e })
//   }
// }

// exports.disable = async (req, res, next) => {
//   if (!req.params.mac) {
//     res.status(401).json({ message: 'MAC não fornecido!' })
//     return
//   }

//   try {
//     const mac = req.params.mac

//     const device = await deviceRepository.disableByMac(mac)

//     if (!device) {
//       res.status(404).json({ message: 'Dipositivo não encontrado!' })
//       return
//     }

//     res.status(200).json(device)
//   } catch (e) {
//     res.status(500).json({ message: 'Falha na requisição!', data: e })
//   }
// }
