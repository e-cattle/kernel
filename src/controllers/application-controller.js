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

exports.enable = async (req, res, next) => {
  if (!req.params._id) {
    res.status(401).json({ message: 'ID não fornecido!' })
    return
  }

  try {
    const _id = req.params._id

    const application = await applicationRepository.enableById(_id)

    if (!application) {
      res.status(404).json({ message: 'App não encontrada!' })

      return
    }

    res.status(200).json(application)
  } catch (e) {
    res.status(500).json({ message: 'Falha na requisição!', data: e })
  }
}

exports.disable = async (req, res, next) => {
  if (!req.params._id) {
    res.status(401).json({ message: 'ID não fornecido!' })
    return
  }

  try {
    const id = req.params._id

    const application = await applicationRepository.disableById(id)

    if (!application) {
      res.status(404).json({ message: 'App não encontrada!' })
      return
    }

    res.status(200).json(application)
  } catch (e) {
    res.status(500).json({ message: 'Falha na requisição!', data: e })
  }
}

exports.remove = async (req, res, next) => {
  if (!req.params._id) {
    res.status(401).json({ message: 'ID não fornecido!' })
    return
  }

  try {
    const application = await applicationRepository.removeById(req.params._id)

    if (!application) {
      res.status(404).json({ message: 'App não encontrada!' })
      return
    }

    res.status(200).json(application)
  } catch (e) {
    res.status(500).json({ message: 'Falha na requisição!', data: e })
  }
}
